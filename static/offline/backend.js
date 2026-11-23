// In-browser stand-in for server/game_server_multi.py, so the existing UI (script.js) runs without a server.
// install() replaces window.fetch for /api/... requests and window.WebSocket for /ws/... connections.
// Only what a single human vs 3 AIs needs: login, model list, room create/play/choose_capture/step.
// Payloads mirror server._serialize_for exactly.

import {
  newGame, getValidActions, applyAction, startNextHand,
  SUITS, cardSuit, cardValue, PRIMIERA,
} from './engine.js';
import { PolicyNet, makePlayer } from './ai.js';

const SYMBOL = { denari: '♦', coppe: '♥', bastoni: '♣', spade: '♠' };
const COLOR = { denari: 'red', coppe: 'red', bastoni: 'black', spade: 'black' };

// AI names (difficulty ladder, see mobile/export_models.py) -> weight files
export const AI_MODELS = {
  PULCINO: { file: 'pulcino.bin', level: 'easy' },
  VOLPE: { file: 'volpe.bin', level: 'medium' },
  LEONE: { file: 'leone.bin', level: 'hard' },
};
let aiDelayMs = 800;
/** Test hook: shorten the pause before each AI move. */
export function setAiDelay(ms) { aiDelayMs = ms; }

const cardDict = (c) => {
  const suit = SUITS[cardSuit(c)];
  return { suit, value: cardValue(c), symbol: SYMBOL[suit], color: COLOR[suit], idx: c };
};

const rooms = new Map();
const netCache = new Map();
let realFetch = null;
let nextRoomNo = 1;

async function loadPlayer(name) {
  const key = name in AI_MODELS ? name : 'LEONE';
  if (!netCache.has(key)) {
    const resp = await realFetch(new URL(`static/models/${AI_MODELS[key].file}`, document.baseURI));
    if (!resp.ok) throw new Error(`Could not load model ${key}: ${resp.status}`);
    netCache.set(key, new PolicyNet(await resp.arrayBuffer()));
  }
  return makePlayer(netCache.get(key));
}

// ── Room state → client payload ────────────────────────────────────────────

function enhanceBreakdown(breakdown, taken) {
  const cardCounts = {};
  const denariCounts = {};
  const primieraCards = { 0: {}, 1: {} };
  for (const t of [0, 1]) {
    cardCounts[t] = taken[t].length;
    denariCounts[t] = taken[t].filter((c) => cardSuit(c) === 0).length;
    for (const c of taken[t]) {
      const suit = SUITS[cardSuit(c)];
      const pv = PRIMIERA[cardValue(c)];
      const cur = primieraCards[t][suit];
      if (!cur || pv > cur.primiera_value) primieraCards[t][suit] = { value: cardValue(c), primiera_value: pv };
    }
  }
  return { ...breakdown, card_counts: cardCounts, denari_counts: denariCounts, primiera_cards: primieraCards };
}

function serialize(room, ownedSeat) {
  const st = room.state;
  const hands = {};
  for (let seat = 0; seat < 4; seat++) {
    const show = ownedSeat !== null ? seat === ownedSeat : room.visibleHands.has(seat);
    hands[seat] = show
      ? st.hands[seat].slice().sort((a, b) => cardValue(a) - cardValue(b) || cardSuit(a) - cardSuit(b)).map(cardDict)
      : null;
  }
  let validIndices = [];
  if (st.phase === 'playing' && room.humanSeats.has(st.currentPlayer) && ownedSeat !== null && st.currentPlayer === ownedSeat) {
    validIndices = [...new Set(getValidActions(st).map((a) => a.card))];
  }
  const captureOptions = room.pendingCapture.length
    ? room.pendingCapture.map((a) => (a.capture || []).map(cardDict).sort((x, y) => x.value - y.value))
    : null;
  const handSizes = {};
  for (let s = 0; s < 4; s++) handSizes[s] = st.hands[s].length;
  return {
    room_id: room.id,
    phase: st.phase,
    current_player: st.phase === 'playing' ? st.currentPlayer : -1,
    capture_options: captureOptions,
    hand_number: st.handNumber,
    dealer: st.dealer,
    plays_in_hand: st.playsInHand,
    hands,
    table: st.table.map(cardDict),
    hand_sizes: handSizes,
    taken_counts: { 0: st.taken[0].length, 1: st.taken[1].length },
    scope: { ...st.scope },
    game_scores: { ...st.gameScores },
    valid_card_indices: validIndices,
    human_seats: [...room.humanSeats],
    visible_hands: [...room.visibleHands],
    last_move: room.lastMove,
    last_hand_breakdown: room.lastHandBreakdown,
    my_seat: ownedSeat,
    level: room.level,
    eval: null,
  };
}

function broadcast(room) {
  for (const sock of [...room.sockets]) sock._deliver(serialize(room, sock.seat));
}

function moveInfo(seat, action, result) {
  return {
    seat,
    card: cardDict(action.card),
    capture: (action.capture || []).map(cardDict),
    scopa: result.scopa,
    asso: result.asso,
  };
}

// ── Game flow ──────────────────────────────────────────────────────────────

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function autoStepLoop(room) {
  if (room.autoStepping) return;
  room.autoStepping = true;
  try {
    for (;;) {
      await sleep(aiDelayMs);
      const st = room.state;
      if (st.phase !== 'playing' || room.humanSeats.has(st.currentPlayer)) return;
      const seat = st.currentPlayer;
      const action = room.ai[seat](st, getValidActions(st));
      const result = applyAction(st, action);
      room.lastMove = moveInfo(seat, action, result);
      if (result.handOver) room.lastHandBreakdown = enhanceBreakdown(result.breakdown, st.taken);
      broadcast(room);
      if (st.phase !== 'playing') return;
    }
  } finally {
    room.autoStepping = false;
  }
}

function triggerAutoStep(room) {
  const st = room.state;
  if (room.humanSeats.size > 0 && st.phase === 'playing' && !room.humanSeats.has(st.currentPlayer) && !room.autoStepping) {
    autoStepLoop(room);
  }
}

async function createRoom(body) {
  const room = {
    id: `L${String(nextRoomNo++).padStart(3, '0')}`,
    state: newGame(0),
    humanSeats: new Set(body.human_seats || []),
    playerSeats: {},
    ai: {},
    visibleHands: new Set(),
    lastMove: null,
    lastHandBreakdown: null,
    pendingCapture: [],
    autoStepping: false,
    sockets: new Set(),
    level: null,
  };
  for (let s = 0; s < 4; s++) {
    if (room.humanSeats.has(s)) {
      if (body.player_id) room.playerSeats[s] = body.player_id;
    } else {
      const name = (body.ai_types && body.ai_types[String(s)]) || 'LEONE';
      room.ai[s] = await loadPlayer(name);
      room.level = room.level || { name, level: (AI_MODELS[name] || AI_MODELS.LEONE).level };
    }
  }
  if (room.humanSeats.size === 0) room.visibleHands = new Set([0, 1, 2, 3]);
  rooms.set(room.id, room);
  triggerAutoStep(room);
  return { room_id: room.id };
}

function applyHuman(room, seat, action) {
  const st = room.state;
  const result = applyAction(st, action);
  room.lastMove = moveInfo(seat, action, result);
  if (result.handOver) room.lastHandBreakdown = enhanceBreakdown(result.breakdown, st.taken);
  broadcast(room);
  triggerAutoStep(room);
  return serialize(room, null);
}

class HttpError extends Error {
  constructor(status, detail) {
    super(detail);
    this.status = status;
  }
}

function getRoom(id) {
  const room = rooms.get(id);
  if (!room) throw new HttpError(404, `Room '${id}' not found`);
  return room;
}

function checkAuth(room, seat, playerId) {
  const expected = room.playerSeats[seat];
  if (expected !== undefined && playerId !== expected) throw new HttpError(403, `Not authorized to play seat ${seat}`);
}

async function route(method, path, body) {
  let m;
  if (method === 'POST' && path === 'login') {
    return { player_id: 'local-player', username: (body.username || 'Player').trim() || 'Player' };
  }
  if (method === 'GET' && path === 'models') {
    return {
      models: Object.keys(AI_MODELS),
      grouped: { levels: Object.keys(AI_MODELS), heuristic: [], random: [], old_168: [], f218: [], league: [] },
    };
  }
  if (method === 'POST' && path === 'rooms') return createRoom(body);

  if ((m = path.match(/^rooms\/([^/]+)\/(toggle_hand|play|choose_capture|step)$/)) && method === 'POST') {
    const room = getRoom(m[1]);
    const st = room.state;
    const op = m[2];

    if (op === 'toggle_hand') {
      if (![0, 1, 2, 3].includes(body.seat)) throw new HttpError(400, 'Invalid seat');
      if (!room.visibleHands.delete(body.seat)) room.visibleHands.add(body.seat);
      broadcast(room);
      return { visible_hands: [...room.visibleHands] };
    }

    if (op === 'play') {
      if (st.phase !== 'playing') throw new HttpError(400, `Phase is '${st.phase}'`);
      const seat = st.currentPlayer;
      if (!room.humanSeats.has(seat)) throw new HttpError(400, `Seat ${seat} is not human`);
      checkAuth(room, seat, body.player_id);
      const cardActions = getValidActions(st).filter((a) => a.card === body.card_idx);
      if (!cardActions.length) throw new HttpError(400, `Card index ${body.card_idx} is not a valid move`);
      const value = cardValue(cardActions[0].card);
      const exact = cardActions.filter((a) => a.capture && a.capture.length === 1 && cardValue(a.capture[0]) === value);
      if (cardActions.length === 1 || exact.length === 1) {
        room.pendingCapture = [];
        return applyHuman(room, seat, exact.length === 1 ? exact[0] : cardActions[0]);
      }
      room.pendingCapture = cardActions;
      broadcast(room);
      return serialize(room, null);
    }

    if (op === 'choose_capture') {
      if (!room.pendingCapture.length) throw new HttpError(400, 'No pending capture');
      const seat = st.currentPlayer;
      checkAuth(room, seat, body.player_id);
      if (!(body.option_idx >= 0 && body.option_idx < room.pendingCapture.length)) throw new HttpError(400, 'Invalid option index');
      const action = room.pendingCapture[body.option_idx];
      room.pendingCapture = [];
      return applyHuman(room, seat, action);
    }

    // step: next hand (after a hand breakdown) or one AI move in watch mode
    if (st.phase === 'game_over') throw new HttpError(400, 'Game over');
    if (st.phase === 'hand_over') {
      room.lastHandBreakdown = null;
      startNextHand(st);
      room.lastMove = null;
      broadcast(room);
      triggerAutoStep(room);
      return serialize(room, null);
    }
    const seat = st.currentPlayer;
    if (room.humanSeats.has(seat)) throw new HttpError(400, `Seat ${seat} is human — use /play`);
    const action = room.ai[seat](st, getValidActions(st));
    const result = applyAction(st, action);
    room.lastMove = moveInfo(seat, action, result);
    if (result.handOver) room.lastHandBreakdown = enhanceBreakdown(result.breakdown, st.taken);
    broadcast(room);
    return serialize(room, null);
  }

  throw new HttpError(404, 'Not available in the offline app');
}

// ── Browser glue ───────────────────────────────────────────────────────────

class LocalSocket {
  constructor(url) {
    this.url = url;
    this.readyState = 0;
    this.seat = null;
    this.roomId = (String(url).match(/\/ws\/([^/?#]+)/) || [])[1];
    setTimeout(() => {
      this.readyState = 1;
      if (this.onopen) this.onopen({});
    }, 0);
  }

  send(text) {
    let msg;
    try { msg = JSON.parse(text); } catch { return; }
    if (msg && msg.type === 'identify') {
      const room = rooms.get(this.roomId);
      if (!room) return;
      const entry = Object.entries(room.playerSeats).find(([, pid]) => pid === msg.player_id);
      this.seat = entry ? Number(entry[0]) : null;
      room.sockets.add(this);
      this._deliver(serialize(room, this.seat));
    }
  }

  close() {
    if (this.readyState === 3) return;
    this.readyState = 3;
    const room = rooms.get(this.roomId);
    if (room) room.sockets.delete(this);
    setTimeout(() => this.onclose && this.onclose({}), 0);
  }

  _deliver(obj) {
    if (this.onmessage) this.onmessage({ data: JSON.stringify(obj) });
  }
}

export function install() {
  realFetch = window.fetch.bind(window);
  window.fetch = async (input, init = {}) => {
    const url = typeof input === 'string' ? input : input.url;
    const m = String(url).match(/\/api\/([^?#]*)/);
    if (!m) return realFetch(input, init);
    const method = (init.method || 'GET').toUpperCase();
    let body = {};
    try { body = init.body ? JSON.parse(init.body) : {}; } catch { /* ignore */ }
    try {
      const data = await route(method, m[1], body);
      return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (e) {
      const status = e instanceof HttpError ? e.status : 500;
      if (!(e instanceof HttpError)) console.error('[offline backend]', e);
      return new Response(JSON.stringify({ detail: e.message }), { status, headers: { 'Content-Type': 'application/json' } });
    }
  };
  window.WebSocket = LocalSocket;
}
