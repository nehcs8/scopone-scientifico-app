// Scopone Scientifico game engine (JavaScript port of scopone/engine.py + scoring.py).
//
// Cards are integers 0..39: idx = suit*10 + (value-1), suits ordered denari, coppe, bastoni, spade
// (same as scopone/ai/observation.py:card_idx). Move generation order matches the Python engine exactly,
// because capture tie-breaking and the AI's observation depend on it. Parity is checked by
// tests/offline_parity.test.mjs against fixtures recorded from the Python engine.

export const SUITS = ['denari', 'coppe', 'bastoni', 'spade'];
export const cardSuit = (c) => Math.floor(c / 10);
export const cardValue = (c) => (c % 10) + 1;
export const SETTEBELLO = 6; // 7 of denari

const mod4 = (n) => ((n % 4) + 4) % 4;
export const teamOf = (seat) => seat % 2;

// ── Setup ──────────────────────────────────────────────────────────────────

export function shuffledDeck(rng = Math.random) {
  const deck = Array.from({ length: 40 }, (_, i) => i);
  for (let i = 39; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

/** Deal 10 cards to each seat, one at a time, starting at (dealer-1) and going to lower seats. */
export function deal(state, deck = shuffledDeck()) {
  const first = mod4(state.dealer - 1);
  const order = [0, 1, 2, 3].map((i) => mod4(first - i));
  let k = 0;
  for (let round = 0; round < 10; round++) {
    for (const seat of order) state.hands[seat].push(deck[k++]);
  }
}

export function newGame(dealer = 0, deck = undefined) {
  const state = {
    dealer,
    handNumber: 0,
    hands: { 0: [], 1: [], 2: [], 3: [] },
    table: [],
    taken: { 0: [], 1: [] },
    scope: { 0: 0, 1: 0 },
    lastCaptureTeam: null,
    currentPlayer: mod4(dealer - 1),
    playsInHand: 0,
    gameScores: { 0: 0, 1: 0 },
    phase: 'playing',
    playHistory: [],
  };
  deal(state, deck);
  return state;
}

export function startNextHand(state, deck = undefined) {
  if (state.phase !== 'hand_over') throw new Error(`Cannot start next hand in phase '${state.phase}'`);
  state.dealer = mod4(state.dealer - 1);
  state.hands = { 0: [], 1: [], 2: [], 3: [] };
  state.table = [];
  state.taken = { 0: [], 1: [] };
  state.scope = { 0: 0, 1: 0 };
  state.lastCaptureTeam = null;
  state.currentPlayer = mod4(state.dealer - 1);
  state.playsInHand = 0;
  state.playHistory = [];
  state.phase = 'playing';
  deal(state, deck);
}

// ── Moves ──────────────────────────────────────────────────────────────────

/** All subsets of `table` whose values sum to `value`, in the same order as the Python backtracking. */
export function findCaptures(table, value) {
  const results = [];
  const current = [];
  const backtrack = (idx, remaining) => {
    if (remaining === 0) {
      results.push(current.slice());
      return;
    }
    for (let i = idx; i < table.length; i++) {
      const v = cardValue(table[i]);
      if (v <= remaining) {
        current.push(table[i]);
        backtrack(i + 1, remaining - v);
        current.pop();
      }
    }
  };
  backtrack(0, value);
  return results;
}

/** Valid actions for the current player: [{card, capture}] where capture is an array of card ids or null. */
export function getValidActions(state) {
  const seat = state.currentPlayer;
  const actions = [];
  for (const card of state.hands[seat]) {
    const value = cardValue(card);
    if (value === 1 && state.playsInHand >= 4) {
      // Asso piglia tutto: one forced action regardless of the table
      actions.push({ card, capture: state.table.slice() });
      continue;
    }
    const captures = findCaptures(state.table, value);
    const exact = captures.filter((c) => c.length === 1 && cardValue(c[0]) === value);
    if (exact.length) {
      for (const c of exact) actions.push({ card, capture: c });
    } else if (captures.length) {
      for (const c of captures) actions.push({ card, capture: c });
    } else {
      actions.push({ card, capture: null });
    }
  }
  return actions;
}

function sameCards(a, b) {
  return a.length === b.length && a.every((c) => b.includes(c));
}

/** Apply an action (mutates state). Returns {scopa, asso, handOver, handScores, breakdown}. */
export function applyAction(state, action) {
  if (state.phase !== 'playing') throw new Error(`Cannot apply action in phase '${state.phase}'`);
  const seat = state.currentPlayer;
  const team = teamOf(seat);
  const card = action.card;
  const hand = state.hands[seat];
  const at = hand.indexOf(card);
  if (at < 0) throw new Error(`Card ${card} not in player ${seat}'s hand`);

  const tableBefore = state.table.slice();
  hand.splice(at, 1);

  const result = { scopa: false, asso: false, handOver: false, handScores: null, breakdown: null };

  if (cardValue(card) === 1 && state.playsInHand >= 4) {
    result.asso = true;
    if (state.table.length) {
      state.taken[team].push(...state.table);
      state.table = [];
      state.lastCaptureTeam = team;
    }
    state.taken[team].push(card);
  } else if (action.capture !== null) {
    for (const c of action.capture) {
      if (!state.table.includes(c)) throw new Error(`Card ${c} not on table`);
    }
    state.table = state.table.filter((c) => !action.capture.includes(c));
    state.taken[team].push(...action.capture, card);
    state.lastCaptureTeam = team;
    const isLastCard = [0, 1, 2, 3].every((s) => state.hands[s].length === 0);
    if (state.table.length === 0 && !isLastCard) {
      state.scope[team] += 1;
      result.scopa = true;
    }
  } else {
    state.table.push(card);
  }

  state.playHistory.push({
    seat,
    card,
    captured: action.capture !== null ? action.capture.slice() : [],
    scopa: result.scopa,
    tableBefore,
  });
  state.playsInHand += 1;

  if ([0, 1, 2, 3].every((s) => state.hands[s].length === 0)) {
    const { handScores, breakdown } = endOfHand(state);
    result.handOver = true;
    result.handScores = handScores;
    result.breakdown = breakdown;
  } else {
    state.currentPlayer = mod4(state.currentPlayer - 1);
  }
  return result;
}

function endOfHand(state) {
  if (state.table.length && state.lastCaptureTeam !== null) {
    state.taken[state.lastCaptureTeam].push(...state.table);
    state.table = [];
  } else if (state.table.length) {
    state.taken[0].push(...state.table);
    state.table = [];
  }
  const breakdown = scoreBreakdown(state.taken, state.scope);
  const handScores = scoreHand(state.taken, state.scope);
  for (const t of [0, 1]) state.gameScores[t] += handScores[t];
  state.handNumber += 1;
  state.phase = state.handNumber >= 4 ? 'game_over' : 'hand_over';
  return { handScores, breakdown };
}

/** Missed scopa: the played card could have taken the whole table but did not (used by the observation). */
export function missedScopa(play) {
  if (play.scopa || play.tableBefore.length === 0) return false;
  for (const cap of findCaptures(play.tableBefore, cardValue(play.card))) {
    if (cap.length === play.tableBefore.length && !sameCards(play.captured, play.tableBefore)) return true;
  }
  return false;
}

// ── Scoring ────────────────────────────────────────────────────────────────

export const PRIMIERA = { 7: 21, 6: 18, 1: 16, 5: 15, 4: 14, 3: 13, 2: 12, 8: 10, 9: 10, 10: 10 };

function compare(a, b) {
  if (a === b) return {};
  return a > b ? { 0: 1 } : { 1: 1 };
}

function carte(taken) {
  return compare(taken[0].length, taken[1].length);
}

function denari(taken) {
  const n = (cards) => cards.filter((c) => cardSuit(c) === 0).length;
  return compare(n(taken[0]), n(taken[1]));
}

function settebello(taken) {
  for (const team of [0, 1]) if (taken[team].includes(SETTEBELLO)) return { [team]: 1 };
  return {};
}

function primiera(taken) {
  const scores = {};
  for (const team of [0, 1]) {
    const best = {};
    for (const c of taken[team]) {
      const v = PRIMIERA[cardValue(c)];
      const s = cardSuit(c);
      if (!(s in best) || v > best[s]) best[s] = v;
    }
    const suits = Object.keys(best);
    scores[team] = suits.length < 4 ? 0 : suits.reduce((sum, s) => sum + best[s], 0);
  }
  if (scores[0] === scores[1]) return {};
  const winner = scores[0] > scores[1] ? 0 : 1;
  return scores[winner] === 0 ? {} : { [winner]: 1 };
}

function napola(taken) {
  const result = {};
  for (const team of [0, 1]) {
    const vals = new Set(taken[team].filter((c) => cardSuit(c) === 0).map(cardValue));
    if (!(vals.has(1) && vals.has(2) && vals.has(3))) continue;
    let n = 3;
    while (vals.has(n + 1)) n++;
    result[team] = n;
  }
  return result;
}

export function scoreBreakdown(taken, scope) {
  const sc = {};
  for (const t of [0, 1]) if (scope[t] > 0) sc[t] = scope[t];
  return {
    carte: carte(taken),
    denari: denari(taken),
    settebello: settebello(taken),
    primiera: primiera(taken),
    napola: napola(taken),
    scope: sc,
  };
}

export function scoreHand(taken, scope) {
  const total = { 0: 0, 1: 0 };
  for (const part of [carte(taken), denari(taken), settebello(taken), primiera(taken), napola(taken)]) {
    for (const [t, pts] of Object.entries(part)) total[t] += pts;
  }
  for (const t of [0, 1]) total[t] += scope[t];
  return total;
}
