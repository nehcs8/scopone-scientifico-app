// On-device AI: observation builder + policy network forward pass + capture selection.
// JavaScript port of scopone/ai/observation.py, network.py (policy only) and rl_env._select_capture.
// Weights come from mobile/export_models.py (float32 little-endian, layout documented there).

import { cardSuit, cardValue, SETTEBELLO, missedScopa, teamOf } from './engine.js';

export const OBS_SIZE = 218;
export const MAX_ACTIONS = 40;
const HIDDEN = 512;
const LN_EPS = 1e-5;

/** Partial-information observation for `seat` (opponent hands are never read). */
export function observation(state, seat) {
  const obs = new Float32Array(OBS_SIZE);
  for (const c of state.hands[seat]) obs[c] = 1;
  for (const c of state.table) obs[40 + c] = 1;
  for (const c of state.taken[0]) obs[80 + c] = 1;
  for (const c of state.taken[1]) obs[120 + c] = 1;

  obs[160] = state.playsInHand / 40;
  obs[161] = state.scope[0] / 40;
  obs[162] = state.scope[1] / 40;
  obs[163] = state.gameScores[0] / 50;
  obs[164] = state.gameScores[1] / 50;
  obs[165] = state.handNumber / 3;
  obs[166] = teamOf(seat);
  obs[167] = state.dealer === seat ? 1 : 0;

  const history = state.playHistory.slice(-10).reverse(); // most recent first
  history.forEach((play, i) => {
    const base = 168 + i * 5;
    obs[base] = play.card / 39;
    obs[base + 1] = play.seat / 3;
    obs[base + 2] = play.captured.length / 10;
    obs[base + 3] = play.scopa ? 1 : 0;
    obs[base + 4] = missedScopa(play) ? 1 : 0;
  });
  return obs;
}

/** Pick which capture to make for a card (port of rl_env._select_capture). `cardActions` share one card. */
export function selectCapture(cardActions, state) {
  if (cardActions.length === 1) return cardActions[0];
  const playedValue = cardValue(cardActions[0].card);
  const exact = cardActions.filter(
    (a) => a.capture && a.capture.length === 1 && cardValue(a.capture[0]) === playedValue,
  );
  if (exact.length === 1) return exact[0];
  if (exact.length) cardActions = exact;

  const tableSize = state.table.length;
  for (const a of cardActions) {
    // scopa: the capture empties the table (captures are subsets of the table)
    if (a.capture && a.capture.length > 0 && a.capture.length === tableSize) return a;
  }
  for (const a of cardActions) {
    if (a.capture && a.capture.includes(SETTEBELLO)) return a;
  }
  let best = cardActions[0];
  const size = (a) => (a.capture ? a.capture.length : 0);
  for (const a of cardActions) if (size(a) > size(best)) best = a;
  return best;
}

/** MLP policy: 3 x (Linear -> LayerNorm -> ReLU) -> Linear(40). */
export class PolicyNet {
  constructor(buffer) {
    const f = new Float32Array(buffer);
    let p = 0;
    const take = (n) => {
      const view = f.subarray(p, p + n);
      p += n;
      return view;
    };
    this.blocks = [];
    let inDim = OBS_SIZE;
    for (let i = 0; i < 3; i++) {
      this.blocks.push({
        inDim,
        w: take(HIDDEN * inDim),
        b: take(HIDDEN),
        lnW: take(HIDDEN),
        lnB: take(HIDDEN),
      });
      inDim = HIDDEN;
    }
    this.headW = take(MAX_ACTIONS * HIDDEN);
    this.headB = take(MAX_ACTIONS);
    if (p !== f.length) throw new Error(`Model file has ${f.length} floats, expected ${p}`);
  }

  /** Raw (unmasked) logits for an observation. */
  logits(obs) {
    let x = obs;
    for (const { inDim, w, b, lnW, lnB } of this.blocks) {
      const y = new Float64Array(HIDDEN);
      for (let j = 0; j < HIDDEN; j++) {
        let s = b[j];
        const row = j * inDim;
        for (let i = 0; i < inDim; i++) s += w[row + i] * x[i];
        y[j] = s;
      }
      let mean = 0;
      for (let j = 0; j < HIDDEN; j++) mean += y[j];
      mean /= HIDDEN;
      let variance = 0;
      for (let j = 0; j < HIDDEN; j++) variance += (y[j] - mean) ** 2;
      variance /= HIDDEN;
      const inv = 1 / Math.sqrt(variance + LN_EPS);
      for (let j = 0; j < HIDDEN; j++) y[j] = Math.max(0, (y[j] - mean) * inv * lnW[j] + lnB[j]);
      x = y;
    }
    const out = new Float64Array(MAX_ACTIONS);
    for (let k = 0; k < MAX_ACTIONS; k++) {
      let s = this.headB[k];
      const row = k * HIDDEN;
      for (let i = 0; i < HIDDEN; i++) s += this.headW[row + i] * x[i];
      out[k] = s;
    }
    return out;
  }
}

/** Sample a card index from masked logits (softmax), like the Python Categorical policy. */
export function sampleMasked(logits, validCards, rng = Math.random) {
  let max = -Infinity;
  for (const c of validCards) max = Math.max(max, logits[c]);
  const weights = validCards.map((c) => Math.exp(logits[c] - max));
  const total = weights.reduce((a, b) => a + b, 0);
  let r = rng() * total;
  for (let i = 0; i < validCards.length; i++) {
    r -= weights[i];
    if (r <= 0) return validCards[i];
  }
  return validCards[validCards.length - 1];
}

/** Wrap a network as a player: (state, actions) -> action. */
export function makePlayer(net, rng = Math.random) {
  return (state, actions) => {
    const validCards = [...new Set(actions.map((a) => a.card))];
    const logits = net.logits(observation(state, state.currentPlayer));
    const card = sampleMasked(logits, validCards, rng);
    return selectCapture(actions.filter((a) => a.card === card), state);
  };
}

export { cardSuit };
