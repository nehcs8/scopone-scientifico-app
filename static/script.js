// ── Italian card rendering ──────────────────────────────────────────────────
const VALUE_LABELS = {1:'A',2:'2',3:'3',4:'4',5:'5',6:'6',7:'7',8:'F',9:'C',10:'R'};

const SUIT_SVGS = {
  denari: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#e8b800" stroke="#a07800" stroke-width="1.5"/>
    <circle cx="12" cy="12" r="5.5" fill="none" stroke="#a07800" stroke-width="1.2"/>
    <circle cx="12" cy="12" r="2" fill="#a07800"/>
  </svg>`,
  coppe: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M4,3 Q4,14 12,17 Q20,14 20,3 Z" fill="#cc2222" stroke="#881111" stroke-width="1.2" stroke-linejoin="round"/>
    <rect x="10.5" y="17" width="3" height="4.5" fill="#cc2222" stroke="#881111" stroke-width="0.8"/>
    <path d="M7,22 L17,22" stroke="#881111" stroke-width="2.5" stroke-linecap="round"/>
  </svg>`,
  bastoni: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <line x1="4" y1="20" x2="20" y2="4" stroke="#7a4a10" stroke-width="4.5" stroke-linecap="round"/>
    <line x1="4" y1="4" x2="20" y2="20" stroke="#7a4a10" stroke-width="4.5" stroke-linecap="round"/>
  </svg>`,
  spade: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <line x1="12" y1="1" x2="12" y2="23" stroke="#1a3080" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M5,9 L12,2 L19,9" stroke="#1a3080" stroke-width="2.5" fill="none" stroke-linejoin="round"/>
    <line x1="6" y1="17" x2="18" y2="17" stroke="#1a3080" stroke-width="2.5" stroke-linecap="round"/>
  </svg>`,
};

// Pip positions [xPct, yPct] within card body for values 1-7
const PIP_POSITIONS = {
  1: [[50, 50]],
  2: [[50, 22], [50, 78]],
  3: [[50, 18], [50, 50], [50, 82]],
  4: [[28, 22], [72, 22], [28, 78], [72, 78]],
  5: [[28, 18], [72, 18], [50, 50], [28, 82], [72, 82]],
  6: [[28, 15], [72, 15], [28, 50], [72, 50], [28, 85], [72, 85]],
  7: [[28, 12], [72, 12], [50, 35], [28, 60], [72, 60], [28, 85], [72, 85]],
};

// SVG figures for face cards (Fante=8, Cavallo=9, Re=10)
const FACE_SVGS = {
  // Fante (Jack) — standing soldier in red tunic
  8: `<svg viewBox="0 0 56 68" xmlns="http://www.w3.org/2000/svg">
    <rect x="20" y="44" width="7" height="20" rx="3" fill="#2c3e50"/>
    <rect x="29" y="44" width="7" height="20" rx="3" fill="#2c3e50"/>
    <rect x="18" y="22" width="20" height="24" rx="3" fill="#c0392b"/>
    <rect x="17" y="39" width="22" height="4" rx="1" fill="#7f0000"/>
    <line x1="18" y1="27" x2="7" y2="38" stroke="#ffddaa" stroke-width="5" stroke-linecap="round"/>
    <line x1="38" y1="27" x2="49" y2="34" stroke="#ffddaa" stroke-width="5" stroke-linecap="round"/>
    <circle cx="28" cy="13" r="9" fill="#ffddaa" stroke="#cc9966" stroke-width="1"/>
    <ellipse cx="28" cy="5" rx="11" ry="4" fill="#880000"/>
    <rect x="17" y="5" width="22" height="7" rx="2" fill="#880000"/>
    <circle cx="24" cy="13" r="1.5" fill="#555"/>
    <circle cx="32" cy="13" r="1.5" fill="#555"/>
    <path d="M24,18 Q28,21 32,18" stroke="#a06040" stroke-width="1.2" fill="none"/>
  </svg>`,
  // Cavallo (Knight) — horse with armoured rider
  9: `<svg viewBox="0 0 56 68" xmlns="http://www.w3.org/2000/svg">
    <line x1="13" y1="54" x2="11" y2="68" stroke="#6B3410" stroke-width="5" stroke-linecap="round"/>
    <line x1="21" y1="58" x2="19" y2="68" stroke="#6B3410" stroke-width="5" stroke-linecap="round"/>
    <line x1="33" y1="58" x2="35" y2="68" stroke="#6B3410" stroke-width="5" stroke-linecap="round"/>
    <line x1="41" y1="54" x2="43" y2="68" stroke="#6B3410" stroke-width="5" stroke-linecap="round"/>
    <ellipse cx="27" cy="48" rx="20" ry="11" fill="#8B4513" stroke="#5c2a00" stroke-width="1"/>
    <path d="M8,44 Q2,38 4,50 Q6,58 10,52" stroke="#5c2a00" stroke-width="5" fill="none" stroke-linecap="round"/>
    <ellipse cx="42" cy="36" rx="7" ry="13" fill="#8B4513" stroke="#5c2a00" stroke-width="1" transform="rotate(20,42,36)"/>
    <ellipse cx="48" cy="25" rx="6" ry="8" fill="#8B4513" stroke="#5c2a00" stroke-width="1" transform="rotate(15,48,25)"/>
    <polygon points="46,17 50,12 52,18" fill="#6B3410"/>
    <circle cx="50" cy="24" r="2" fill="#111"/>
    <rect x="21" y="27" width="14" height="20" rx="3" fill="#1a3a8a"/>
    <circle cx="28" cy="17" r="8" fill="#ffddaa" stroke="#cc9966" stroke-width="1"/>
    <ellipse cx="28" cy="10" rx="9" ry="4" fill="#444"/>
    <rect x="19" y="10" width="18" height="6" rx="1" fill="#444"/>
  </svg>`,
  // Re (King) — crowned king with scepter
  10: `<svg viewBox="0 0 56 68" xmlns="http://www.w3.org/2000/svg">
    <path d="M10,44 Q10,66 28,68 Q46,66 46,44 Q38,42 28,44 Q18,42 10,44 Z" fill="#6B0099" stroke="#440066" stroke-width="1"/>
    <rect x="10" y="44" width="36" height="5" rx="1" fill="rgba(255,255,255,0.45)"/>
    <line x1="47" y1="20" x2="47" y2="60" stroke="#B8860B" stroke-width="3.5" stroke-linecap="round"/>
    <polygon points="47,12 43,22 51,22" fill="#FFD700" stroke="#B8860B" stroke-width="1"/>
    <circle cx="28" cy="35" r="10" fill="#ffddaa" stroke="#cc9966" stroke-width="1"/>
    <path d="M20,41 Q24,48 28,48 Q32,48 36,41" fill="#8B6914"/>
    <circle cx="24" cy="34" r="1.5" fill="#555"/>
    <circle cx="32" cy="34" r="1.5" fill="#555"/>
    <path d="M24,39 Q28,42 32,39" stroke="#a06040" stroke-width="1.2" fill="none"/>
    <rect x="16" y="22" width="24" height="6" rx="1" fill="#FFD700" stroke="#B8860B" stroke-width="1.5"/>
    <path d="M16,22 L20,11 L28,18 L36,11 L40,22 Z" fill="#FFD700" stroke="#B8860B" stroke-width="1.5" stroke-linejoin="round"/>
    <circle cx="28" cy="12" r="2.5" fill="#cc0000"/>
    <circle cx="20" cy="16" r="2" fill="#0044cc"/>
    <circle cx="36" cy="16" r="2" fill="#0044cc"/>
  </svg>`,
};

// ── State ──────────────────────────────────────────────────────────────────
let gameState = null;
let lastPlayedIdx = null;
let moveLog = [];          // last 4 HTML strings
let lastLoggedMove = null; // fingerprint to avoid duplicates

// Room + WebSocket
let currentRoomId = null;
let _gameWs = null;
let _lastAnimatedMoveKey = null; // prevents double-animating same move

// Cache for last rendered values (to avoid unnecessary DOM updates)
let _lastRendered = {
  scores: null,
  stats: null,
  handIndicator: null,
  currentPlayer: null,
  visibleHands: null,
  hands: {},
  tableCards: null,
  moveLog: null,
};

// Account
let myPlayerId = null;
let myUsername = null;

// Lobby
let currentLobbyCode = null;
let _lobbyWs = null;
let availableModels = null;  // Fetched from /api/models
let _lobbyRefreshInterval = null;  // Auto-refresh lobby list

// Fetch available AI models
async function loadAvailableModels() {
  try {
    const resp = await fetch('/api/models');
    if (resp.ok) {
      availableModels = await resp.json();
    }
  } catch (e) {
    console.error('Failed to load models:', e);
  }
}

// Fetch and display public lobbies
async function loadPublicLobbies() {
  try {
    const resp = await fetch('/api/lobbies');
    if (!resp.ok) {
      console.error('Failed to fetch lobbies');
      return;
    }
    const data = await resp.json();
    const lobbies = data.lobbies || [];

    const container = document.getElementById('lobby-list');
    if (lobbies.length === 0) {
      container.innerHTML = '<p style="color:#888; font-size:0.9rem; text-align:center;">No public lobbies available</p>';
      return;
    }

    container.innerHTML = '';
    lobbies.forEach(lobby => {
      const playerCount = Object.values(lobby.slots).filter(sl => sl.type === 'human' && sl.player_id).length;
      const div = document.createElement('div');
      div.style.cssText = 'background:#2a2a2a; padding:8px 12px; margin:4px 0; border-radius:4px; cursor:pointer; display:flex; justify-content:space-between; align-items:center;';
      div.innerHTML = `
        <div>
          <span style="font-weight:600; color:#4a9a4a;">${_esc(lobby.code)}</span>
          <span style="color:#888; font-size:0.85rem; margin-left:8px;">${playerCount} player${playerCount !== 1 ? 's' : ''}</span>
        </div>
        <button class="pregame-btn green" style="padding:4px 12px; font-size:0.8rem; margin:0;">Join</button>
      `;
      div.querySelector('button').onclick = (e) => {
        e.stopPropagation();
        document.getElementById('join-code').value = lobby.code;
        doJoinLobby();
      };
      container.appendChild(div);
    });
  } catch (e) {
    console.error('Error loading lobbies:', e);
  }
}

// Start/stop auto-refresh of lobby list
function startLobbyRefresh() {
  if (window.SCOPONE_OFFLINE || _lobbyRefreshInterval) return;
  loadPublicLobbies();  // Load immediately
  _lobbyRefreshInterval = setInterval(loadPublicLobbies, 3000);  // Refresh every 3 seconds
}

function stopLobbyRefresh() {
  if (_lobbyRefreshInterval) {
    clearInterval(_lobbyRefreshInterval);
    _lobbyRefreshInterval = null;
  }
}

// Build model dropdown options with grouped categories
function buildModelOptions(selectedType) {
  if (!availableModels || !availableModels.grouped) {
    // Fallback to hardcoded options
    return `
      <option value="HEUR_V1"    ${selectedType==='HEUR_V1'   ?'selected':''}>Heuristic V1</option>
      <option value="HEUR_V2"    ${selectedType==='HEUR_V2'   ?'selected':''}>Heuristic V2</option>
      <option value="RANDOM"     ${selectedType==='RANDOM'    ?'selected':''}>Random</option>
    `;
  }

  const g = availableModels.grouped;
  let html = '';

  // Difficulty levels (the apps' opponents)
  if (g.levels && g.levels.length > 0) {
    html += '<optgroup label="Levels">';
    for (const model of g.levels) {
      html += `<option value="${model}" ${selectedType===model?'selected':''}>${model}</option>`;
    }
    html += '</optgroup>';
  }

  // Heuristic AIs
  if (g.heuristic && g.heuristic.length > 0) {
    html += '<optgroup label="Heuristic AIs">';
    for (const model of g.heuristic) {
      html += `<option value="${model}" ${selectedType===model?'selected':''}>${model}</option>`;
    }
    html += '</optgroup>';
  }

  // Random
  if (g.random && g.random.length > 0) {
    html += '<optgroup label="Random">';
    for (const model of g.random) {
      html += `<option value="${model}" ${selectedType===model?'selected':''}>${model}</option>`;
    }
    html += '</optgroup>';
  }

  // OLD (168-feature)
  if (g.old_168 && g.old_168.length > 0) {
    html += '<optgroup label="OLD (168-feature)">';
    for (const model of g.old_168) {
      html += `<option value="${model}" ${selectedType===model?'selected':''}>${model}</option>`;
    }
    html += '</optgroup>';
  }

  // F218 (218-feature)
  if (g.f218 && g.f218.length > 0) {
    html += '<optgroup label="F218 (218-feature)">';
    for (const model of g.f218) {
      html += `<option value="${model}" ${selectedType===model?'selected':''}>${model}</option>`;
    }
    html += '</optgroup>';
  }

  // League
  if (g.league && g.league.length > 0) {
    html += '<optgroup label="League (218-feature)">';
    for (const model of g.league) {
      html += `<option value="${model}" ${selectedType===model?'selected':''}>${model}</option>`;
    }
    html += '</optgroup>';
  }

  return html;
}

// WS message queue: ensures animations play sequentially even under auto-advance
const _wsQueue = [];
let _wsProcessing = false;

// Table card layout: persists across renderState() calls within a hand
const tableCardPositions = {}; // cardIdx -> {x, y, rot, z}
let tableZCounter = 1;
let _lastHandNumber = -1;

// ── Pregame navigation ─────────────────────────────────────────────────────
function showScreen(id) {
  document.querySelectorAll('.pregame-screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById(id);
  if (el) el.classList.add('active');

  // Manage lobby refresh
  if (id === 'screen-home') {
    startLobbyRefresh();
  } else {
    stopLobbyRefresh();
  }
}

// ── Login ──────────────────────────────────────────────────────────────────
async function doLogin() {
  const username = document.getElementById('login-username').value.trim();
  if (!username) return;
  const resp = await fetch('/api/login', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ username })
  });
  if (!resp.ok) { alert('Login failed'); return; }
  const data = await resp.json();
  myPlayerId = data.player_id;
  myUsername = data.username;
  localStorage.setItem('playerId', myPlayerId);
  localStorage.setItem('username', myUsername);
  document.getElementById('home-greeting').textContent = `Hello, ${myUsername}!`;
  showScreen('screen-home');  // This will start lobby refresh via showScreen
}

// ── Lobby ──────────────────────────────────────────────────────────────────
async function doCreateLobby() {
  try {
    const resp = await fetch('/api/lobbies', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ player_id: myPlayerId })
    });
    if (!resp.ok) {
      const errText = await resp.text();
      console.error('Create lobby failed:', resp.status, errText);
      alert(`Could not create lobby: ${resp.status} ${errText}`);
      return;
    }
    const data = await resp.json();
    currentLobbyCode = data.code;
    connectLobbyWs(data.code);
    renderLobbyScreen(data);
    showScreen('screen-lobby');
  } catch (err) {
    console.error('Create lobby error:', err);
    alert(`Error creating lobby: ${err.message}`);
  }
}

async function doJoinLobby() {
  const code = document.getElementById('join-code').value.trim().toUpperCase();
  if (!code) return;
  const resp = await fetch(`/api/lobbies/${code}`);
  if (!resp.ok) { alert(`Lobby "${code}" not found.`); return; }
  const data = await resp.json();
  if (data.started) { alert('That game has already started.'); return; }
  currentLobbyCode = code;
  connectLobbyWs(code);
  renderLobbyScreen(data);
  showScreen('screen-lobby');
}

function connectLobbyWs(code) {
  if (_lobbyWs) { _lobbyWs.close(); _lobbyWs = null; }
  const proto = location.protocol === 'https:' ? 'wss:' : 'ws:';
  _lobbyWs = new WebSocket(`${proto}//${location.host}/ws/lobby/${code}`);
  _lobbyWs.onmessage = (e) => {
    const data = JSON.parse(e.data);
    renderLobbyScreen(data);
    if (data.started && data.room_id) {
      if (_lobbyWs) { _lobbyWs.close(); _lobbyWs = null; }
      currentLobbyCode = null;
      enterGame(data.room_id);
    }
  };
  _lobbyWs.onclose = () => {
    if (currentLobbyCode === code) setTimeout(() => connectLobbyWs(code), 2000);
  };
}

function _esc(s) {
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function renderLobbyScreen(lobby) {
  const isOwner = lobby.owner_id === myPlayerId;
  document.getElementById('lobby-code-val').textContent = lobby.code;
  document.getElementById('btn-start-lobby').style.display = isOwner ? '' : 'none';

  // Show privacy toggle button for owner
  const privacyBtn = document.getElementById('btn-toggle-private');
  const privacyIcon = document.getElementById('privacy-icon');
  const privacyText = document.getElementById('privacy-text');
  if (isOwner) {
    privacyBtn.style.display = '';
    if (lobby.private) {
      privacyIcon.textContent = '🔒';
      privacyText.textContent = 'Private';
      privacyBtn.style.background = '#6a4a4a';
    } else {
      privacyIcon.textContent = '🔓';
      privacyText.textContent = 'Public';
      privacyBtn.style.background = '#4a6a4a';
    }
  } else {
    privacyBtn.style.display = 'none';
  }

  const evalBtn = document.getElementById('btn-toggle-eval');
  evalBtn.style.display = isOwner ? '' : 'none';
  evalBtn.style.background = lobby.eval_mode ? '#5a3a8a' : '#555';
  document.getElementById('eval-text').textContent = lobby.eval_mode ? 'Evaluation: on' : 'Evaluation: off';
  document.getElementById('lobby-eval-hint').style.display = lobby.eval_mode ? '' : 'none';

  let mySeat = null;
  for (const [s, sl] of Object.entries(lobby.slots)) {
    if (sl.player_id === myPlayerId) { mySeat = parseInt(s); break; }
  }

  const container = document.getElementById('lobby-slots');
  container.innerHTML = '';

  for (let s = 0; s < 4; s++) {
    const sl = lobby.slots[s];
    const team = s % 2 === 0 ? 0 : 1;
    const row = document.createElement('div');
    row.className = 'lobby-slot';

    let nameHtml = '', actHtml = '';
    if (sl.type === 'human' && sl.player_id) {
      const isMe = sl.player_id === myPlayerId;
      nameHtml = `<span class="lobby-slot-name">${_esc(sl.username)}${isMe ? ' <em style="color:#aaa;font-size:0.8rem;">(you)</em>' : ''}</span>`;
      if (isMe) {
        actHtml = `<button class="ctrl-btn" style="padding:4px 12px;font-size:0.8rem;margin:0;" onclick="doStand()">Stand</button>`;
      }
    } else {
      const aiType = sl.ai_type || 'HEUR_V2';
      nameHtml = `<span class="lobby-slot-name ai">${_esc(aiType)}</span>`;
      if (mySeat === null && !lobby.started) {
        actHtml = `<button class="ctrl-btn" style="padding:4px 12px;font-size:0.8rem;margin:0;background:#3a6e3a;" onclick="doSit(${s})">Sit</button>`;
      }
      if (isOwner) {
        actHtml += `<select onchange="doSetAi(${s}, this.value)">
          ${buildModelOptions(aiType)}
        </select>`;
      }
    }

    row.innerHTML = `
      <span class="team-badge team${team}" style="font-size:0.7rem;padding:2px 5px;flex-shrink:0;">T${team}</span>
      <span class="lobby-seat-label">P${s}</span>
      ${nameHtml}${actHtml}
    `;
    container.appendChild(row);
  }

  const humanCount = Object.values(lobby.slots).filter(sl => sl.type === 'human' && sl.player_id).length;
  const statusEl = document.getElementById('lobby-status');
  if (lobby.started) {
    statusEl.textContent = 'Game in progress...';
  } else if (humanCount === 0) {
    statusEl.textContent = 'Waiting for players to sit...';
  } else {
    statusEl.textContent = `${humanCount} player${humanCount !== 1 ? 's' : ''} ready`;
  }
}

async function doSit(seat) {
  const resp = await fetch(`/api/lobbies/${currentLobbyCode}/sit`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ player_id: myPlayerId, seat })
  });
  if (resp.ok) { renderLobbyScreen(await resp.json()); }
  else { const e = await resp.json(); alert(e.detail || 'Could not sit'); }
}

async function doStand() {
  const resp = await fetch(`/api/lobbies/${currentLobbyCode}/stand`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ player_id: myPlayerId })
  });
  if (resp.ok) { renderLobbyScreen(await resp.json()); }
}

async function doSetAi(seat, aiType) {
  await fetch(`/api/lobbies/${currentLobbyCode}/set_ai`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ player_id: myPlayerId, seat, ai_type: aiType })
  });
  // Lobby WS will push the update
}

async function doTogglePrivate() {
  if (!currentLobbyCode) return;
  const resp = await fetch(`/api/lobbies/${currentLobbyCode}/toggle_private`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ player_id: myPlayerId })
  });
  if (!resp.ok) {
    const e = await resp.json();
    alert(e.detail || 'Could not toggle privacy');
  }
  // Lobby WS will push the update
}

async function doToggleEval() {
  if (!currentLobbyCode) return;
  const resp = await fetch(`/api/lobbies/${currentLobbyCode}/toggle_eval`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ player_id: myPlayerId })
  });
  if (!resp.ok) {
    const e = await resp.json();
    alert(e.detail || 'Could not toggle evaluation mode');
  }
  // Lobby WS will push the update
}

async function doStartGame() {
  const resp = await fetch(`/api/lobbies/${currentLobbyCode}/start`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ player_id: myPlayerId })
  });
  if (!resp.ok) { const e = await resp.json(); alert(e.detail || 'Could not start'); return; }
  const data = await resp.json();
  if (_lobbyWs) { _lobbyWs.close(); _lobbyWs = null; }
  currentLobbyCode = null;
  enterGame(data.room_id);
}

// Difficulty ladder: one trained model per level (see mobile/export_models.py)
const AI_LEVELS = {
  easy:   { model: 'PULCINO', label: '🐣 Pulcino (easy)' },
  medium: { model: 'VOLPE',   label: '🦊 Volpe (medium)' },
  hard:   { model: 'LEONE',   label: '🦁 Leone (hard)' },
};

// You at P0 with an AI partner at P2 against two AIs at P1/P3, all playing at the chosen level
async function startVsAi(level) {
  const model = AI_LEVELS[level].model;
  try {
    const resp = await fetch('/api/rooms', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        human_seats: [0],
        ai_types: { '1': model, '2': model, '3': model },
        player_id: myPlayerId,
      })
    });
    if (!resp.ok) { const e = await resp.json(); alert(e.detail || 'Could not start the game'); return; }
    const data = await resp.json();
    enterGame(data.room_id);
  } catch (err) {
    console.error('startVsAi failed:', err);
    alert(`Could not start the game: ${err.message}`);
  }
}

async function quickWatchAi() {
  const resp = await fetch('/api/rooms', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ human_seats: [], ai_types: {
      '0': 'HEUR_V2', '1': 'HEUR_V1', '2': 'HEUR_V2', '3': 'HEUR_V1'
    }})
  });
  const data = await resp.json();
  enterGame(data.room_id);
}

function leaveLobby() {
  if (_lobbyWs) { _lobbyWs.close(); _lobbyWs = null; }
  currentLobbyCode = null;
  showScreen('screen-home');
  startLobbyRefresh();  // Resume lobby refresh when returning to home
}

// ── Enter game ─────────────────────────────────────────────────────────────
function enterGame(roomId) {
  currentRoomId = roomId;
  document.getElementById('pregame').classList.add('hidden');
  document.getElementById('app').classList.add('visible');

  const badge = document.getElementById('room-badge');
  badge.textContent = `Room: ${roomId}  Watching`;
  badge.style.display = '';

  lastPlayedIdx = null;
  moveLog = [];
  lastLoggedMove = null;
  _lastAnimatedMoveKey = null;
  resetPiles();
  cancelThrow();

  // Reset render cache for new game
  _lastRendered = {
    scores: null,
    stats: null,
    handIndicator: null,
    currentPlayer: null,
    visibleHands: null,
    hands: {},
    tableCards: null,
    moveLog: null,
  };

  connectGameWs();
  renderState();
  updateButtonState();
}

function showSetup() {
  if (_gameWs) { _gameWs.close(); _gameWs = null; }
  currentRoomId = null;
  gameState = null;
  document.getElementById('pregame').classList.remove('hidden');
  document.getElementById('app').classList.remove('visible');
  showScreen('screen-home');  // This will start lobby refresh via showScreen
}

function copyRoomCode() {
  if (currentRoomId) navigator.clipboard.writeText(currentRoomId);
}

// Returns true if this client can play the current seat.
function canPlayCurrentSeat(gs) {
  if (!gs || gs.phase !== 'playing') return false;
  const seat = gs.current_player;
  if (!gs.human_seats.includes(seat)) return false;
  return gs.my_seat !== null && gs.my_seat !== undefined && gs.my_seat === seat;
}

// ── WebSocket ──────────────────────────────────────────────────────────────
function connectGameWs() {
  if (_gameWs) { _gameWs.close(); _gameWs = null; }
  const proto = location.protocol === 'https:' ? 'wss:' : 'ws:';
  _gameWs = new WebSocket(`${proto}//${location.host}/ws/${currentRoomId}`);

  _gameWs.onopen = () => {
    if (myPlayerId) {
      _gameWs.send(JSON.stringify({ type: 'identify', player_id: myPlayerId }));
    }
  };

  _gameWs.onmessage = (event) => {
    _wsQueue.push(JSON.parse(event.data));
    _drainWsQueue();
  };

  const thisWs = _gameWs;
  _gameWs.onclose = () => {
    // Only reconnect if this socket is still the active one (not replaced by a new game)
    setTimeout(() => { if (currentRoomId && _gameWs === thisWs) connectGameWs(); }, 2000);
  };
}

// Create a fingerprint of the state for efficient comparison
function getStateFingerprint(state) {
  if (!state) return null;

  // Create a simple fingerprint of all fields that affect rendering
  return JSON.stringify({
    phase: state.phase,
    current_player: state.current_player,
    hand_number: state.hand_number,
    plays_in_hand: state.plays_in_hand,
    table: state.table,
    hands: state.hands,
    game_scores: state.game_scores,
    scope: state.scope,
    taken_counts: state.taken_counts,
    visible_hands: state.visible_hands,
    valid_card_indices: state.valid_card_indices ? [...state.valid_card_indices].sort((a, b) => a - b) : null, // Sort copy for consistency
    has_breakdown: !!state.last_hand_breakdown,
    capture_options: state.capture_options,
    my_seat: state.my_seat,
    eval: state.eval ? [state.eval.games, state.eval.delta_n, state.eval.baseline_pending, state.eval.game_recorded] : null,
  });
}

// Helper to check if state has meaningfully changed
function hasStateChanged(prev, curr) {
  const prevFp = getStateFingerprint(prev);
  const currFp = getStateFingerprint(curr);
  return prevFp !== currFp;
}

async function _drainWsQueue() {
  if (_wsProcessing) return;
  _wsProcessing = true;
  try {
    while (_wsQueue.length > 0) {
      const data = _wsQueue.shift();

      const prevFp = getStateFingerprint(gameState);
      const currFp = getStateFingerprint(data);

      // Skip if this is truly identical state (duplicate broadcast)
      if (prevFp === currFp) {
        continue;
      }

      const lm = data.last_move;
      let finishAnim = null;
      if (lm) {
        const key = `${data.hand_number ?? 0}-${data.plays_in_hand ?? 0}-${lm.seat}-${lm.card?.idx}`;
        if (key !== _lastAnimatedMoveKey) {
          _lastAnimatedMoveKey = key;
          // Run animation BEFORE updating state so DOM still has old card in hand
          finishAnim = await runPlayAnimation(lm);
        }
      }

      // Only render if state has actually changed
      if (hasStateChanged(gameState, data)) {
        gameState = data;
        renderState();
        updateButtonState();
      } else {
        // State hasn't changed, just update reference
        gameState = data;
      }
      if (finishAnim) finishAnim();   // swap ghosts for the freshly rendered real cards
    }
  } finally {
    _wsProcessing = false;
  }
}

// ── Game actions ───────────────────────────────────────────────────────────
async function nextMove() {
  const resp = await fetch(`/api/rooms/${currentRoomId}/step`, { method: 'POST' });
  if (!resp.ok) {
    const err = await resp.json();
    console.error(err.detail || 'Error');
  }
  // State update delivered via WebSocket broadcast
}

async function playCard(cardIdx) {
  const body = { card_idx: cardIdx };
  if (myPlayerId) body.player_id = myPlayerId;
  const resp = await fetch(`/api/rooms/${currentRoomId}/play`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(body)
  });
  if (!resp.ok) {
    const err = await resp.json();
    console.error(err.detail || 'Invalid move');
    return false;
  }
  return true;
  // State update (including capture_options if needed) delivered via WebSocket
}

function showCaptureOptions(options) {
  const container = document.getElementById('capture-options');
  container.innerHTML = '';
  options.forEach((cards, idx) => {
    const btn = document.createElement('div');
    btn.className = 'capture-opt';
    cards.forEach(card => btn.appendChild(makeCard(card, false, false)));
    btn.onclick = () => chooseCapture(idx);
    container.appendChild(btn);
  });
  document.getElementById('capture-modal').classList.add('visible');
}

async function chooseCapture(optionIdx) {
  document.getElementById('capture-modal').classList.remove('visible');
  const body = { option_idx: optionIdx };
  if (myPlayerId) body.player_id = myPlayerId;
  await fetch(`/api/rooms/${currentRoomId}/choose_capture`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(body)
  });
  // State update delivered via WebSocket
}

async function toggleHand(seat) {
  await fetch(`/api/rooms/${currentRoomId}/toggle_hand`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ seat })
  });
  // State update delivered via WebSocket
}

// ── Rendering ──────────────────────────────────────────────────────────────
function makeCard(card, isValid, isPlayed) {
  const el = document.createElement('div');
  el.className = `card ${card.color}`;
  el.dataset.cardIdx    = card.idx;
  el.dataset.cardSuit   = card.suit;
  el.dataset.cardValue  = card.value;
  el.dataset.cardColor  = card.color;
  el.dataset.cardSymbol = card.symbol;
  if (isValid) el.classList.add('valid');
  if (isPlayed) el.classList.add('just-played');

  const label = VALUE_LABELS[card.value] || String(card.value);
  const suitSvg = SUIT_SVGS[card.suit] || '';

  function makeCorner() {
    const corner = document.createElement('div');
    corner.className = 'card-corner';
    corner.innerHTML = `<span class="corner-val">${label}</span><span class="corner-suit-icon">${suitSvg}</span>`;
    return corner;
  }

  const top = makeCorner();

  // Card body: pips for 1-7, figure for face cards
  const body = document.createElement('div');
  body.className = 'card-body';
  if (card.value >= 8) {
    const face = document.createElement('div');
    face.className = 'card-face';
    face.innerHTML = FACE_SVGS[card.value] || '';
    body.appendChild(face);
  } else {
    const positions = PIP_POSITIONS[card.value] || [];
    const pipSize = card.value === 1 ? 28 : card.value <= 3 ? 20 : card.value <= 5 ? 17 : 14;
    positions.forEach(([xPct, yPct]) => {
      const pip = document.createElement('div');
      pip.className = 'pip';
      const k = pipSize / 72;  // pip size relative to the card width
      pip.style.width = `calc(var(--w) * ${k})`;
      pip.style.height = `calc(var(--w) * ${k})`;
      pip.style.left = `calc(${xPct}% - var(--w) * ${k / 2})`;
      pip.style.top  = `calc(${yPct}% - var(--w) * ${k / 2})`;
      pip.innerHTML = suitSvg;
      body.appendChild(pip);
    });
  }

  const bot = makeCorner();
  bot.classList.add('bottom');

  el.appendChild(top);
  el.appendChild(body);
  el.appendChild(bot);

  if (isValid) {
    el.onclick = () => { if (!_suppressClick && !pendingThrow) playCard(card.idx); };
    el.title = `Play ${label} di ${card.suit}`;
  }
  return el;
}

function makeCardBack() {
  const el = document.createElement('div');
  el.className = 'card card-back';
  return el;
}

function renderHand(containerId, cards, validSet, isHorizontal) {
  const el = document.getElementById(containerId);
  // FLIP: remember where the cards are, so the remaining ones glide into place after a card leaves
  const before = new Map();
  el.querySelectorAll('[data-card-idx]').forEach(c => before.set(c.dataset.cardIdx, c.getBoundingClientRect()));
  el.innerHTML = '';
  if (cards === null) return;
  cards.forEach(card => {
    const isValid = validSet.has(card.idx);
    const isPlayed = card.idx === lastPlayedIdx;
    el.appendChild(makeCard(card, isValid, isPlayed));
  });
  if (before.size > cards.length) {
    const moved = [];
    el.querySelectorAll('[data-card-idx]').forEach(c => {
      const o = before.get(c.dataset.cardIdx);
      if (!o) return;
      const n = c.getBoundingClientRect();
      const dx = o.left - n.left, dy = o.top - n.top;
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;
      c.style.transition = 'none';
      c.style.transform = `translate(${dx}px, ${dy}px)`;
      moved.push(c);
    });
    if (moved.length) {
      requestAnimationFrame(() => requestAnimationFrame(() => moved.forEach(c => {
        c.style.transition = 'transform 160ms ease-out';
        c.style.transform = '';
      })));
    }
  }
}

// Helper: count denari cards in taken pile
function countDenari(taken, team) {
  if (!taken || !taken[team]) return 0;
  return taken[team].filter(c => c.suit === 'denari').length;
}

function renderState() {
  if (!gameState) return;
  const gs = gameState;

  // Room badge: update seat info once identified
  const badge = document.getElementById('room-badge');
  if (badge && currentRoomId && badge.style.display !== 'none') {
    const seatLabel = gs.my_seat !== null && gs.my_seat !== undefined
      ? `  P${gs.my_seat}` : '  Watching';
    const ev = gs.eval ? `  EVAL game ${gs.eval.game_idx + 1}${gs.eval.mirror ? ' (mirrored)' : ''}` : '';
    const lvl = gs.level && gs.level.level && AI_LEVELS[gs.level.level] ? `  ${AI_LEVELS[gs.level.level].label}` : '';
    badge.textContent = window.SCOPONE_OFFLINE
      ? `${lvl.trim() || 'Offline'}${seatLabel}`
      : `Room: ${currentRoomId}${seatLabel}${ev}${lvl}`;
  }
  document.body.classList.toggle('eval-mode', !!gs.eval);

  // Scores - only update if changed
  const s0 = gs.game_scores['0'] ?? 0;
  const s1 = gs.game_scores['1'] ?? 0;
  const scoresKey = `${s0}-${s1}`;
  if (_lastRendered.scores !== scoresKey) {
    _lastRendered.scores = scoresKey;
    const sc0 = document.getElementById('score-t0');
    const sc1 = document.getElementById('score-t1');
    sc0.textContent = s0;
    sc1.textContent = s1;
    sc0.className = 'score-chip' + (s0 > s1 ? ' winning' : '');
    sc1.className = 'score-chip' + (s1 > s0 ? ' winning' : '');
  }

  // Hand indicator - only update if changed
  const handText = `Hand ${Math.min(gs.hand_number + 1, 4)}/4`;
  if (_lastRendered.handIndicator !== handText) {
    _lastRendered.handIndicator = handText;
    document.getElementById('hand-indicator').textContent = handText;
  }

  // Team stats in topbar - only update if changed
  const takenCounts = gs.taken_counts || {};
  const scope = gs.scope || {};
  const dc = gs.denari_counts || {};
  const denari0 = dc[0] ?? (gs.taken ? countDenari(gs.taken, 0) : 0);
  const denari1 = dc[1] ?? (gs.taken ? countDenari(gs.taken, 1) : 0);
  const statsKey = `${takenCounts[0]}-${denari0}-${scope[0]}-${takenCounts[1]}-${denari1}-${scope[1]}`;
  if (_lastRendered.stats !== statsKey) {
    _lastRendered.stats = statsKey;
    [[0, denari0], [1, denari1]].forEach(([t, d]) => {
      document.getElementById(`c-t${t}`).textContent = takenCounts[t] ?? 0;
      document.getElementById(`d-t${t}`).textContent = d;
      document.getElementById(`sc-t${t}`).textContent = scope[t] ?? 0;
    });

    // Also update individual taken displays (for desktop)
    [0,1,2,3].forEach(s => {
      const team = s % 2 === 0 ? 0 : 1;
      const el = document.getElementById(`taken-${s}`);
      if (el) el.textContent = `${takenCounts[team] ?? 0} taken · ${scope[team] ?? 0} scope`;
    });
  }

  // Active seat highlight - only update if changed
  if (_lastRendered.currentPlayer !== gs.current_player) {
    _lastRendered.currentPlayer = gs.current_player;
    [0,1,2,3].forEach(s => {
      const panel = document.getElementById(`seat-${s}`);
      panel.classList.toggle('active-seat', gs.current_player === s);
    });
  }

  // Eye button — only update if visibility changed
  const visibleKey = JSON.stringify(gs.visible_hands);
  if (_lastRendered.visibleHands !== visibleKey) {
    _lastRendered.visibleHands = visibleKey;
    const visible = new Set(gs.visible_hands);
    const isWatchMode = gs.human_seats.length === 0;
    [0,1,2,3].forEach(s => {
      const btn = document.getElementById(`eye-${s}`);
      const canToggle = isWatchMode;
      btn.style.display = canToggle ? '' : 'none';
      btn.classList.toggle('on', visible.has(s));
      btn.textContent = visible.has(s) ? '👁' : '🙈';
    });
  }

  document.getElementById('seat-0').classList.toggle('my-turn', canPlayCurrentSeat(gs));

  // Hands - only re-render if hands changed
  const validSet = canPlayCurrentSeat(gs) ? new Set(gs.valid_card_indices) : new Set();
  // Sort valid indices for consistent cache key
  const validIndices = Array.from(validSet).sort((a, b) => a - b).join(',');

  [0,1,2,3].forEach(s => {
    const handKey = JSON.stringify(gs.hands[String(s)]) + '-' + validIndices + '-' + gs.current_player;
    if (_lastRendered.hands[s] !== handKey) {
      _lastRendered.hands[s] = handKey;
      const isHorizontal = s === 0 || s === 2;

      if (gs.hands[String(s)] === null) {
        // Fill hidden hands with card backs
        const el = document.getElementById(`hand-${s}`);
        el.innerHTML = '';
        const count = gs.hand_sizes?.[String(s)] ?? 0;
        for (let i = 0; i < count; i++) el.appendChild(makeCardBack());
      } else {
        renderHand(`hand-${s}`, gs.hands[String(s)], validSet, isHorizontal);
      }
    }
  });

  // Table
  const tableEl = document.getElementById('table-cards');
  const emptyEl = document.getElementById('table-empty');

  // Clear position state at the start of each new hand
  if (gs.hand_number !== _lastHandNumber) {
    _lastHandNumber = gs.hand_number;
    Object.keys(tableCardPositions).forEach(k => delete tableCardPositions[k]);
    tableZCounter = 1;
  }

  tableEl.innerHTML = '';
  if (gs.table.length === 0) {
    emptyEl.style.display = '';
  } else {
    emptyEl.style.display = 'none';
    const tcRect = tableEl.getBoundingClientRect();
    gs.table.forEach(card => {
      // Assign a position if none exists yet (e.g. after page refresh)
      if (!tableCardPositions[card.idx]) {
        const spot = computeLandingSpot(gs.current_player ?? 0, tcRect.width > 0 ? tcRect : { width: 300, height: 300 });
        tableCardPositions[card.idx] = { ...spot, z: tableZCounter++ };
      }
      const pos = tableCardPositions[card.idx];
      const el = makeCard(card, false, false);
      el.style.transform = _tablePose(pos);
      el.style.zIndex = pos.z;
      tableEl.appendChild(el);
    });
  }

  _tableDims = _tableDimsNow();
  renderPiles();

  // If capture options are pending, re-show the modal (e.g. after page refresh)
  if (gs.capture_options && gs.capture_options.length > 1) {
    showCaptureOptions(gs.capture_options);
  }

  // Move log
  updateLog(gs);

  // Show breakdown popup if hand just ended
  if (gs.last_hand_breakdown) {
    showBreakdown(gs.last_hand_breakdown, gs.hand_number, gs.game_scores);
  }
}

// ── Table layout helpers ───────────────────────────────────────────────────

// Assign a random landing position (in #table-cards-relative px) for a card
// thrown by the given seat. Returns {x, y, rot}.
function computeLandingSpot(seat, rect) {
  const W = rect.width, H = rect.height;

  // Get actual table card size
  const { width: cW, height: cH } = _getCardSize();
  const mg = 6;
  const rnd = (a, b) => a + Math.random() * (b - a);

  // Zones cover ~70% of the table biased toward the player's edge, so they overlap
  // in the middle (fulfilling the "radius bigger than half the table" spec).
  // Ranges are clamped so the card stays fully inside the table even on small screens.
  const xFull = [mg, W - cW - mg];
  const yFull = [mg, H - cH - mg];
  const yLo   = [Math.max(mg, H * 0.28), H - cH - mg];        // lower 72%
  const yHi   = [mg, Math.min(H - cH - mg, H * 0.72 - cH)];  // upper 72%
  const xLo   = [mg, Math.min(W - cW - mg, W * 0.72 - cW)];  // left 72%
  const xHi   = [Math.max(mg, W * 0.28), W - cW - mg];        // right 72%

  let [x0, x1] = xFull, [y0, y1] = yFull;
  switch (seat) {
    case 0: [x0, x1] = xFull; [y0, y1] = yLo;  break; // bottom
    case 2: [x0, x1] = xFull; [y0, y1] = yHi;  break; // top
    case 1: [x0, x1] = xLo;   [y0, y1] = yFull; break; // left
    case 3: [x0, x1] = xHi;   [y0, y1] = yFull; break; // right
  }

  // Guard against degenerate ranges (very small table)
  if (x1 <= x0) x1 = x0 + 1;
  if (y1 <= y0) y1 = y0 + 1;

  return {
    x: Math.max(mg, Math.min(W - cW - mg, rnd(x0, x1))),
    y: Math.max(mg, Math.min(H - cH - mg, rnd(y0, y1))),
    rot: (Math.random() - 0.5) * 36,
  };
}

// ── Animation system ───────────────────────────────────────────────────────
// Every moving card is a "ghost": a real card element of exactly the same size as all other cards
// (CSS var --cw), moved only with transform (GPU-composited), never resized. A drawn hand carries the
// card, gathers captured cards, pushes overlapping cards apart; a small broom sweeps the table on a scopa.

const _sleep = ms => new Promise(r => setTimeout(r, ms));

function _centerOf(el) {
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}

// Actual card dimensions from CSS (responsive + user setting); cached until the layout changes
let _cardSizeCache = null;
function _getCardSize() {
  if (!_cardSizeCache) {
    const temp = document.createElement('div');
    temp.className = 'card';
    temp.style.visibility = 'hidden';
    temp.style.position = 'absolute';
    document.body.appendChild(temp);
    const rect = temp.getBoundingClientRect();
    document.body.removeChild(temp);
    _cardSizeCache = { width: rect.width || 72, height: rect.height || 104 };
  }
  return _cardSizeCache;
}

function _tablePose(pos) {
  return `translate(${pos.x}px, ${pos.y}px) rotate(${pos.rot}deg)`;
}

// Pose of any ghost (card, hand, broom): centre in viewport px + rotation
function _setPose(el, p) {
  el._p = p;
  el.style.transform = `translate3d(${p.cx - el._w / 2}px, ${p.cy - el._h / 2}px, 0) rotate(${p.rot}deg)`;
}

function _makeGhost(card, cx, cy, rot = 0) {
  const { width, height } = _getCardSize();
  const el = makeCard(card, false, false);
  el.classList.add('ghost');
  el._w = width; el._h = height;
  _setPose(el, { cx, cy, rot });
  return el;
}

// Glide a ghost with a CSS transition. fadeDelay: start fading to `opacity` only after that many ms.
function _go(el, cx, cy, ms, { opacity, easing = 'ease-in-out', rot, delay = 0, fadeDelay = 0 } = {}) {
  let t = `transform ${ms}ms ${easing} ${delay}ms`;
  if (opacity !== undefined) {
    t += `, opacity ${Math.max(ms - fadeDelay, 1)}ms ${easing} ${delay + fadeDelay}ms`;
    el.style.opacity = String(opacity);
  }
  el.style.transition = t;
  _setPose(el, { cx, cy, rot: rot !== undefined ? rot : el._p.rot });
}

// ── The hand ─────────────────────────────────────────────────────────────
const OUT = { 0: [0, 1], 1: [-1, 0], 2: [0, -1], 3: [1, 0] };          // direction from the table toward each seat
const HAND_ANGLE = { 0: 0, 1: 90, 2: 180, 3: -90 };
const HAND_SVG = `<svg viewBox="0 0 60 86" xmlns="http://www.w3.org/2000/svg" fill="#f3cda4" stroke="#b07f55" stroke-width="1.6" stroke-linejoin="round">
  <rect x="9"  y="14" width="10" height="38" rx="5"/>
  <rect x="20" y="5"  width="10" height="44" rx="5"/>
  <rect x="31" y="9"  width="10" height="42" rx="5"/>
  <rect x="42" y="18" width="9"  height="34" rx="4.5"/>
  <path d="M9 46 H51 V66 Q51 82 33 84 H27 Q9 82 9 66 Z"/>
  <path d="M10 56 Q-2 46 4 36 Q8 32 12 40 L16 50 Z"/>
</svg>`;
const BROOM_SVG = `<svg viewBox="0 0 40 90" xmlns="http://www.w3.org/2000/svg" stroke-linejoin="round">
  <rect x="17" y="0" width="6" height="52" rx="3" fill="#8a5a2b" stroke="#5c3a18" stroke-width="1.2"/>
  <path d="M10 50 H30 L38 88 H2 Z" fill="#e2b84a" stroke="#9c7a1e" stroke-width="1.4"/>
  <path d="M10 56 L8 86 M16 56 L15 86 M22 56 L22 86 M28 56 L29 86 M34 60 L35 86" stroke="#9c7a1e" stroke-width="1" fill="none"/>
  <rect x="9" y="48" width="22" height="6" rx="2" fill="#b3402f" stroke="#7a2a1e" stroke-width="1"/>
</svg>`;

function _makeHand(seat) {
  const { width } = _getCardSize();
  const el = document.createElement('div');
  el.className = 'ghost-hand';
  el.innerHTML = HAND_SVG;
  el._w = width * 0.95; el._h = width * 1.36;
  el.style.width = el._w + 'px'; el.style.height = el._h + 'px';
  el._seat = seat;
  return el;
}

// Where the hand sits relative to the card it holds (fingertips on the card's middle, wrist toward the seat)
function _handOffset(seat, hand) {
  const { height: cH } = _getCardSize();
  const d = hand._h / 2 - cH * 0.12;
  return { x: OUT[seat][0] * d, y: OUT[seat][1] * d };
}

function _placeHand(hand, cx, cy) {
  const o = _handOffset(hand._seat, hand);
  _setPose(hand, { cx: cx + o.x, cy: cy + o.y, rot: HAND_ANGLE[hand._seat] });
}

function _goHand(hand, cx, cy, ms, opts = {}) {
  const o = _handOffset(hand._seat, hand);
  _go(hand, cx + o.x, cy + o.y, ms, { ...opts, rot: HAND_ANGLE[hand._seat] });
}

const _ease = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;   // easeInOutCubic

// The hand carries the card along a gentle curve; the card turns to its landing tilt on the way
function _carry(card, hand, from, to, finalRot, durationMs) {
  return new Promise(resolve => {
    const start = performance.now();
    const dx = to.x - from.x, dy = to.y - from.y;
    const dist = Math.hypot(dx, dy) || 1;
    const bulge = dist * 0.09 * (Math.random() < 0.5 ? 1 : -1);
    const px = -dy / dist, py = dx / dist;
    card.style.transition = 'none'; hand.style.transition = 'none';
    function frame(now) {
      const t = Math.min((now - start) / durationMs, 1);
      const e = _ease(t);
      const b = Math.sin(Math.PI * e) * bulge;
      const cx = from.x + dx * e + px * b, cy = from.y + dy * e + py * b;
      _setPose(card, { cx, cy, rot: finalRot * e });
      _placeHand(hand, cx, cy);
      if (t < 1) requestAnimationFrame(frame); else resolve();
    }
    requestAnimationFrame(frame);
  });
}

// Card touches down: its shadow shrinks (no size change)
function _settle(card) {
  card.style.transition = 'box-shadow 180ms ease-out';
  card.style.boxShadow = '1px 2px 5px rgba(0,0,0,0.35)';
}

// The hand lets go and withdraws toward its seat
async function _handAway(hand, seat) {
  const { width: cW } = _getCardSize();
  const p = hand._p;
  _go(hand, p.cx + OUT[seat][0] * cW * 1.1, p.cy + OUT[seat][1] * cW * 1.1, 260, { opacity: 0, easing: 'ease-in', fadeDelay: 60 });
  await _sleep(270);
}

// New card landed on top of others: the hand pushes the overlapped cards aside
async function _pushApart(seat, newCardIdx, ghost, hand) {
  const newPos = tableCardPositions[newCardIdx];
  if (!newPos) return;
  const tableCardsEl = document.getElementById('table-cards');
  const tcRect = tableCardsEl.getBoundingClientRect();
  const { width: cW, height: cH } = _getCardSize();
  const mg = 4;
  const nc = { x: newPos.x + cW / 2, y: newPos.y + cH / 2 };

  const overlaps = [];
  for (const [idxStr, pos] of Object.entries(tableCardPositions)) {
    const idx = parseInt(idxStr);
    if (idx === newCardIdx) continue;
    const c = { x: pos.x + cW / 2, y: pos.y + cH / 2 };
    if (Math.hypot(nc.x - c.x, nc.y - c.y) < cW * 0.6) overlaps.push({ idx, pos, center: c });
  }
  if (overlaps.length === 0) return;

  const clampX = x => Math.max(mg, Math.min(x, tcRect.width - cW - mg));
  const clampY = y => Math.max(mg, Math.min(y, tcRect.height - cH - mg));
  const NUDGE = cW * 0.8, T = 320, ease = 'cubic-bezier(0.22, 0.7, 0.3, 1)';
  let sx = 0, sy = 0;

  overlaps.forEach(({ idx, pos, center }) => {
    let dx = center.x - nc.x, dy = center.y - nc.y;
    const d = Math.hypot(dx, dy);
    if (d < 1) { dx = OUT[seat][0] * -1 || 1; dy = OUT[seat][1] * -1; }   // dead centre: push away from the player
    const n = Math.hypot(dx, dy) || 1;
    dx /= n; dy /= n; sx += dx; sy += dy;
    tableCardPositions[idx] = {
      ...pos, x: clampX(pos.x + dx * NUDGE), y: clampY(pos.y + dy * NUDGE),
      rot: pos.rot + (Math.random() - 0.5) * 14,
    };
    const el = tableCardsEl.querySelector(`[data-card-idx="${idx}"]`);
    if (el) {
      el.style.transition = `transform ${T}ms ${ease}`;
      el.style.transform = _tablePose(tableCardPositions[idx]);
    }
  });

  // The hand drags the new card a little along with the push
  const sn = Math.hypot(sx, sy) || 1;
  const nx = clampX(newPos.x + (sx / sn) * NUDGE * 0.35), ny = clampY(newPos.y + (sy / sn) * NUDGE * 0.35);
  tableCardPositions[newCardIdx] = { ...newPos, x: nx, y: ny };
  const gc = { x: tcRect.left + nx + cW / 2, y: tcRect.top + ny + cH / 2 };
  _go(ghost, gc.x, gc.y, T, { easing: ease });
  if (hand) _goHand(hand, gc.x, gc.y, T, { easing: ease });
  await _sleep(T + 30);
}

// ── Taken-card piles (one per team) ───────────────────────────────────────
// A team's pile sits in a side column near the first of its players that took something. Newly taken cards
// land on it chaotically; the next time a member of that team takes cards, the hand squares the pile up first.
const PILE_MAX = 14;
const pileState = { hand: -1, 0: { seat: null, items: [], nodes: [] }, 1: { seat: null, items: [], nodes: [] } };

function pileCenter(seat) {
  const b = document.getElementById('board').getBoundingClientRect();
  const { width: cW, height: cH } = _getCardSize();
  const L = b.left + cW / 2 + 6, R = b.right - cW / 2 - 6;
  const top = b.top + 58 + cH / 2, bot = b.bottom - cH - 40 - cH / 2;
  return { 0: { x: R, y: bot }, 1: { x: L, y: bot }, 2: { x: L, y: top }, 3: { x: R, y: top } }[seat];
}

function _pileTransform(it, i) {
  if (it.tidy) return `translate(${(-i * 0.7).toFixed(1)}px, ${(-i * 0.9).toFixed(1)}px) rotate(0deg)`;
  return `translate(calc(var(--cw) * ${it.dx.toFixed(3)}), calc(var(--cw) * ${it.dy.toFixed(3)})) rotate(${it.rot.toFixed(1)}deg)`;
}

function resetPiles() {
  pileState.hand = -1;
  [0, 1].forEach(t => {
    pileState[t].seat = null; pileState[t].items = []; pileState[t].nodes = [];
    const el = document.getElementById(`pile-${t}`);
    if (el) el.innerHTML = '<div class="pile-count"></div>';
  });
}

function renderPiles() {
  const gs = gameState;
  if (!gs) return;
  if (gs.hand_number !== pileState.hand) { resetPiles(); pileState.hand = gs.hand_number; }
  const b = document.getElementById('board').getBoundingClientRect();
  [0, 1].forEach(t => {
    const n = gs.taken_counts?.[t] ?? 0;
    const P = pileState[t];
    const el = document.getElementById(`pile-${t}`);
    const vis = Math.min(n, PILE_MAX);
    while (P.items.length < vis) P.items.push({ dx: (Math.random() - 0.5) * 0.45, dy: (Math.random() - 0.5) * 0.45, rot: (Math.random() - 0.5) * 70, tidy: false, fresh: true });
    while (P.items.length > vis) { P.items.pop(); const nd = P.nodes.pop(); if (nd) nd.remove(); }
    if (n > 0 && P.seat === null) P.seat = t;          // e.g. after a reload: default to the team's first seat
    el.style.display = n > 0 ? 'block' : 'none';
    if (n <= 0) return;
    const c = pileCenter(P.seat);
    el.style.left = (c.x - b.left) + 'px';
    el.style.top  = (c.y - b.top) + 'px';
    const countEl = el.querySelector('.pile-count');
    countEl.textContent = n;
    while (P.nodes.length < P.items.length) {
      const nd = makeCardBack();
      el.insertBefore(nd, countEl);
      P.nodes.push(nd);
    }
    P.items.forEach((it, i) => {
      const nd = P.nodes[i];
      nd.style.transform = _pileTransform(it, i);
      nd.style.zIndex = i;
      if (it.fresh) { it.fresh = false; nd.classList.add('fresh'); setTimeout(() => nd.classList.remove('fresh'), 260); }
    });
  });
}

// A member of the team touches the pile: it becomes one tidy stack
function tidyPile(t) {
  const P = pileState[t];
  P.items.forEach(it => { it.tidy = true; });
  P.items.forEach((it, i) => { if (P.nodes[i]) P.nodes[i].style.transform = _pileTransform(it, i); });
}

// ── Taking cards ─────────────────────────────────────────────────────────
// Everything in `group` is moved by the same transition, `followers` ride along under the leader
function _moveGroup(leader, followers, hand, cx, cy, ms, easing = 'ease-in-out') {
  _go(leader, cx, cy, ms, { easing });
  followers.forEach((f, i) => _go(f, cx + (i + 1) * 1.6, cy - (i + 1) * 1.6, ms, { easing }));
  if (hand) _goHand(hand, cx, cy, ms, { easing });
}

// The leader card (held by the hand) goes to each card in `targets` (nearest first) and picks it up
async function _collect(leader, followers, hand, targets) {
  const remaining = [...targets];
  const hop = Math.max(110, Math.min(240, 900 / Math.max(remaining.length, 1)));
  while (remaining.length) {
    const p = leader._p;
    remaining.sort((a, b) => Math.hypot(a._p.cx - p.cx, a._p.cy - p.cy) - Math.hypot(b._p.cx - p.cx, b._p.cy - p.cy));
    const g = remaining.shift();
    _moveGroup(leader, followers, hand, g._p.cx, g._p.cy, hop);
    await _sleep(hop + 15);
    g.style.transition = 'box-shadow 120ms'; g.style.boxShadow = '0 8px 18px rgba(0,0,0,0.5)';   // picked up
    followers.push(g);
    await _sleep(50);
  }
}

// The hand carries the picked-up cards back to the team's pile and drops them on it
async function _toPile(leader, followers, hand, pileC, team, handSeat) {
  const { width: cW } = _getCardSize();
  _moveGroup(leader, followers, hand, pileC.x, pileC.y, 520, 'cubic-bezier(0.45, 0, 0.2, 1)');
  await _sleep(440);
  tidyPile(team);                                           // the hand reaches the pile and squares it up
  await _sleep(100);
  const all = [leader, ...followers];
  all.forEach((g, i) => _go(g, pileC.x + (Math.random() - 0.5) * cW * 0.3, pileC.y + (Math.random() - 0.5) * cW * 0.3, 170, {
    easing: 'ease-out', opacity: 0, rot: (Math.random() - 0.5) * 60, delay: i * 25, fadeDelay: 60,
  }));
  await _sleep(170 + all.length * 25 + 20);
  if (hand) await _handAway(hand, handSeat);
}

// Scopa: a small broom sweeps the cards toward the pile in one flowing stroke
function _sweep(cards, from, endC, ms) {
  return new Promise(resolve => {
    const { width: cW } = _getCardSize();
    const dx0 = endC.x - from.x, dy0 = endC.y - from.y, n0 = Math.hypot(dx0, dy0) || 1;
    const u = [dx0 / n0, dy0 / n0];
    const broom = document.createElement('div');
    broom.className = 'ghost-broom';
    broom.innerHTML = BROOM_SVG;
    broom._w = cW * 0.8; broom._h = cW * 1.75;
    broom.style.width = broom._w + 'px'; broom.style.height = broom._h + 'px';
    document.getElementById('anim-overlay').appendChild(broom);

    const lead = cW * 1.2;                                   // broom starts behind the pile
    const S = { x: from.x - u[0] * lead, y: from.y - u[1] * lead };
    const E = endC;
    const px = -u[1], py = u[0];                             // sideways
    const baseAngle = Math.atan2(-u[0], u[1]) * 180 / Math.PI;   // bristles lead toward the pile
    const f0 = Math.min(0.35, lead / (Math.hypot(E.x - S.x, E.y - S.y) || 1));
    const starts = cards.map(c => ({ x: c._p.cx, y: c._p.cy, rot: c._p.rot }));
    const jit = cards.map(() => ({ s: (Math.random() - 0.5) * cW * 0.5, r: (Math.random() - 0.5) * 30 }));
    const path = e => {
      const wob = Math.sin(e * Math.PI * 3) * cW * 0.45 * (1 - 0.5 * e);
      return { x: S.x + (E.x - S.x) * e + px * wob, y: S.y + (E.y - S.y) * e + py * wob };
    };
    const b0 = path(f0);
    const start = performance.now();
    cards.forEach(c => { c.style.transition = 'none'; });
    broom.style.opacity = '0'; broom.style.transition = 'none';

    function frame(now) {
      const t = Math.min((now - start) / ms, 1);
      const e = _ease(t);
      const B = path(e);
      _setPose(broom, { cx: B.x, cy: B.y, rot: baseAngle + Math.sin(e * Math.PI * 3 + 1.2) * 14 });
      broom.style.opacity = String(Math.min(1, t * 8, (1 - t) * 6));
      cards.forEach((c, i) => {
        const ei = Math.max(0, e - i * 0.018);               // later cards trail a little
        if (ei <= f0) return;
        const Bi = path(ei);
        const k = Math.min(1, (ei - f0) / 0.25);              // pile bunches up as it is pushed
        const s = starts[i];
        _setPose(c, {
          cx: s.x + (Bi.x - b0.x) + jit[i].s * k * px + (starts[0].x - s.x) * 0.3 * k,
          cy: s.y + (Bi.y - b0.y) + jit[i].s * k * py + (starts[0].y - s.y) * 0.3 * k,
          rot: s.rot + jit[i].r * k,
        });
        c.style.opacity = String(Math.max(0, 1 - (e - 0.82) / 0.18));
      });
      if (t < 1) requestAnimationFrame(frame);
      else { broom.remove(); resolve(); }
    }
    requestAnimationFrame(frame);
  });
}

// Plays the animation of a move. Resolves to a cleanup() function: call it right AFTER the new state is
// rendered, so the landed ghost is swapped for the real table card in the same frame (no flash).
// If the local player threw/dropped the card by hand (pendingThrow), the card is already on the table; for a
// capture their PARTNER's hand then starts from the table card, picks the thrown card up and takes both.
async function runPlayAnimation(lm) {
  if (!lm) return null;

  const pend = (pendingThrow && pendingThrow.ready && pendingThrow.cardIdx === lm.card.idx && pendingThrow.seat === lm.seat)
    ? pendingThrow : null;
  pendingThrow = null;

  const overlay = document.getElementById('anim-overlay');
  const label   = document.getElementById('anim-label');
  if (!pend) overlay.innerHTML = '';
  label.style.opacity = '0';

  const seat = lm.seat, team = seat % 2;
  const { width: cW, height: cH } = _getCardSize();
  const seatEl = document.getElementById(`seat-${seat}`);
  const handEl = document.getElementById(`hand-${seat}`);
  const tcEl   = document.getElementById('table-cards');
  const seatC  = _centerOf(seatEl);
  const tableC = _centerOf(tcEl);

  let handCardEl = pend ? pend.handCardEl : handEl.querySelector(`[data-card-idx="${lm.card.idx}"]`);
  if (!handCardEl && handEl.children.length) handCardEl = handEl.children[Math.floor(handEl.children.length / 2)];
  const startC = pend ? { x: pend.ghost._p.cx, y: pend.ghost._p.cy } : (handCardEl ? _centerOf(handCardEl) : seatC);

  const tableSnap = [];
  document.querySelectorAll('#table-cards [data-card-idx]').forEach(el => {
    const idx = parseInt(el.dataset.cardIdx);
    const cardData = (lm.capture || []).find(c => c.idx === idx);
    if (lm.asso || cardData) {
      tableSnap.push({ card: cardData, el, pos: _centerOf(el), rot: tableCardPositions[idx]?.rot ?? 0 });
    }
  });
  const capSnaps = tableSnap.filter(s => s.card?.suit);

  const isCapture = lm.asso || (lm.capture && lm.capture.length > 0);
  let spot = null, tcRect = null;
  if (!isCapture) {
    tcRect = tcEl.getBoundingClientRect();
    spot = pend
      ? { x: pend.ghost._p.cx - cW / 2 - tcRect.left, y: pend.ghost._p.cy - cH / 2 - tcRect.top, rot: pend.ghost._p.rot }
      : computeLandingSpot(seat, tcRect);
    tableCardPositions[lm.card.idx] = { ...spot, z: tableZCounter++ };
  }
  const finalRot = spot ? spot.rot : (Math.random() - 0.5) * 16;

  // The first player of a team to take something decides where that team's pile is
  if (isCapture && pileState[team].seat === null) pileState[team].seat = seat;
  const pileC = pileCenter(pileState[team].seat ?? seat);

  const nearestTo = (p, list) => [...list].sort((a, b) => Math.hypot(a.pos.x - p.x, a.pos.y - p.y) - Math.hypot(b.pos.x - p.x, b.pos.y - p.y));
  const centroid = capSnaps.length
    ? { x: capSnaps.reduce((a, p) => a + p.pos.x, 0) / capSnaps.length, y: capSnaps.reduce((a, p) => a + p.pos.y, 0) / capSnaps.length }
    : tableC;

  const cleanup = () => {
    overlay.innerHTML = '';
    label.style.opacity = '0';
    if (handCardEl) handCardEl.style.visibility = '';
    tableSnap.forEach(s => { s.el.style.visibility = ''; });
  };

  try {
    if (handCardEl) handCardEl.style.visibility = 'hidden';
    tableSnap.forEach(s => { s.el.style.visibility = 'hidden'; });

    const ghostOf = new Map();
    capSnaps.forEach(({ card: c, pos, rot }) => {
      const g = _makeGhost(c, pos.x, pos.y, rot);
      g.style.boxShadow = '1px 2px 5px rgba(0,0,0,0.35)';
      overlay.appendChild(g);
      ghostOf.set(c.idx, g);
    });
    const captureGhosts = capSnaps.map(s => ghostOf.get(s.card.idx));
    const mainGhost = pend ? pend.ghost : _makeGhost(lm.card, startC.x, startC.y, 0);
    if (!pend) overlay.appendChild(mainGhost);

    label.innerHTML = lm.asso  ? `<span class="anim-accent">Asso piglia tutto!</span>P${seat}`
                    : lm.scopa ? `<span class="anim-accent">SCOPA!</span>P${seat}` : '';
    label.style.opacity = (lm.asso || lm.scopa) ? '1' : '0';

    // The hand (the player's own, unless they threw the card themselves) takes hold of the card …
    let hand = null;
    if (!pend) {
      hand = _makeHand(seat);
      overlay.appendChild(hand);
      _placeHand(hand, startC.x, startC.y);
      await _sleep(20);
      hand.style.transition = 'opacity 120ms ease-out';
      hand.style.opacity = '1';
      await _sleep(130);
    }

    if (!isCapture) {
      // … carries it to the table; if it lands on others, the hand pushes them aside
      if (hand) {
        await _carry(mainGhost, hand, startC, { x: tcRect.left + spot.x + cW / 2, y: tcRect.top + spot.y + cH / 2 }, finalRot, 380 + Math.random() * 80);
      }
      _settle(mainGhost);
      await _pushApart(seat, lm.card.idx, mainGhost, hand);
      if (hand) await _handAway(hand, seat);
      // mainGhost stays: it is the new table card until cleanup() swaps in the real one

    } else if (lm.scopa) {
      if (hand) {
        await _carry(mainGhost, hand, startC, centroid, finalRot, 380 + Math.random() * 80);
        _settle(mainGhost);
        await _handAway(hand, seat);
      }
      await _sweep([mainGhost, ...captureGhosts], pend ? centroid : centroid, pileC, 900);
      tidyPile(team);

    } else {
      // The played card (or, after a hand-thrown card, the table card) picks the other cards up one by one,
      // then the hand takes them back to the pile
      const followers = [];
      let leader, targets;
      if (!pend) {
        const order = nearestTo(startC, capSnaps).map(s => ghostOf.get(s.card.idx));
        leader = mainGhost;
        const first = order.shift();
        await _carry(mainGhost, hand, startC, { x: first._p.cx, y: first._p.cy }, finalRot * 0.3, 380 + Math.random() * 80);
        first.style.boxShadow = '0 8px 18px rgba(0,0,0,0.5)';
        followers.push(first);
        targets = order;
      } else {
        const order = nearestTo(startC, capSnaps).map(s => ghostOf.get(s.card.idx));
        leader = order.shift();                              // the card that was already on the table
        overlay.appendChild(leader);                         // … on top
        _settle(mainGhost);
        hand = _makeHand((seat + 2) % 4);                    // the partner reaches in from the opposite side
        overlay.appendChild(hand);
        _placeHand(hand, leader._p.cx, leader._p.cy);
        leader.style.boxShadow = '0 8px 18px rgba(0,0,0,0.5)';
        await _sleep(20);
        hand.style.transition = 'opacity 120ms ease-out';
        hand.style.opacity = '1';
        await _sleep(130);
        targets = [mainGhost, ...order];
      }
      await _collect(leader, followers, hand, targets);
      await _toPile(leader, followers, hand, pileC, team, hand._seat);
    }
  } catch (err) {
    console.error('Play animation failed:', err);
  }
  return cleanup;
}

// ── Dragging / throwing your own cards ────────────────────────────────────
// Tap: the hand plays the card. Drag and let go: the card lands where you drop it. Flick: it flies on in
// the direction (and with the speed) of the flick. The card then stays in the overlay until the move arrives.
let pendingThrow = null;      // { seat, cardIdx, ghost, handCardEl, ready }
let _suppressClick = false;

function cancelThrow() {
  if (!pendingThrow) return;
  const p = pendingThrow;
  pendingThrow = null;
  if (p.ghost) p.ghost.remove();
  if (p.handCardEl) p.handCardEl.style.visibility = '';
}

function _clampToTable(c) {
  const r = document.getElementById('table-cards').getBoundingClientRect();
  const { width: cW, height: cH } = _getCardSize();
  return {
    x: Math.max(r.left + cW / 2 + 4, Math.min(c.x, r.right - cW / 2 - 4)),
    y: Math.max(r.top + cH / 2 + 4, Math.min(c.y, r.bottom - cH / 2 - 4)),
  };
}

function setupOwnCardDrag() {
  const handEl = document.getElementById('hand-0');
  let st = null;

  handEl.addEventListener('pointerdown', (e) => {
    if (pendingThrow || (e.pointerType === 'mouse' && e.button !== 0)) return;
    const el = e.target.closest('.card.valid');
    if (!el || !gameState) return;
    st = { el, id: e.pointerId, x0: e.clientX, y0: e.clientY, drag: false, pts: [], ghost: null };
  });

  handEl.addEventListener('pointermove', (e) => {
    if (!st || e.pointerId !== st.id) return;
    if (!st.drag) {
      if (Math.hypot(e.clientX - st.x0, e.clientY - st.y0) < 10) return;
      const idx = parseInt(st.el.dataset.cardIdx);
      const card = (gameState.hands[String(gameState.my_seat)] || []).find(c => c.idx === idx);
      if (!card) { st = null; return; }
      st.drag = true;
      try { handEl.setPointerCapture(e.pointerId); } catch (err) { /* synthetic or already released pointer */ }
      const c = _centerOf(st.el);
      st.off = { x: c.x - st.x0, y: c.y - st.y0 };
      st.ghost = _makeGhost(card, c.x, c.y, 0);
      document.getElementById('anim-overlay').appendChild(st.ghost);
      st.el.style.visibility = 'hidden';
    }
    const now = performance.now();
    st.pts.push({ t: now, x: e.clientX, y: e.clientY });
    while (st.pts.length > 2 && now - st.pts[0].t > 120) st.pts.shift();
    const a = st.pts[0], b = st.pts[st.pts.length - 1];
    const vx = b.t > a.t ? (b.x - a.x) / (b.t - a.t) : 0;
    _setPose(st.ghost, { cx: e.clientX + st.off.x, cy: e.clientY + st.off.y, rot: Math.max(-18, Math.min(18, vx * 14)) });
  });

  const finish = async (e, cancelled) => {
    if (!st || e.pointerId !== st.id) return;
    const s = st; st = null;
    if (!s.drag) return;                                    // a tap: the card's own click handler plays it
    _suppressClick = true; setTimeout(() => { _suppressClick = false; }, 60);
    const { width: cW, height: cH } = _getCardSize();
    const ghost = s.ghost;
    const cur = { x: ghost._p.cx, y: ghost._p.cy };
    const now = performance.now();
    const pts = s.pts.filter(p => now - p.t < 100);
    let vx = 0, vy = 0;
    if (pts.length >= 2) {
      const a = pts[0], b = pts[pts.length - 1], dt = Math.max(b.t - a.t, 1);
      vx = (b.x - a.x) / dt; vy = (b.y - a.y) / dt;
    }
    const speed = Math.hypot(vx, vy);
    const zone = document.getElementById('table-cards').getBoundingClientRect();
    const flick = speed > 0.6;
    const raw = flick ? { x: cur.x + vx * 280, y: cur.y + vy * 280 } : cur;
    const back = raw.y > zone.bottom + cH * 0.5 || cancelled;   // let go over the hand (or flicked toward it): not played

    pendingThrow = { seat: gameState.my_seat, cardIdx: parseInt(s.el.dataset.cardIdx), ghost, handCardEl: s.el, ready: false };
    if (back) {
      const home = _centerOf(s.el);
      _go(ghost, home.x, home.y, 180, { easing: 'ease-out', rot: 0 });
      await _sleep(190);
      cancelThrow();
      return;
    }
    const target = _clampToTable(raw);
    const finalRot = flick ? (Math.random() - 0.5) * 40 : (Math.random() - 0.5) * 12;
    const dist = Math.hypot(target.x - cur.x, target.y - cur.y);
    const ms = flick ? Math.max(200, Math.min(520, 160 + dist * 0.9)) : 120;
    const spins = flick ? Math.max(1, Math.round(speed * 1.6)) * 360 * (vx >= 0 ? 1 : -1) : 0;
    const startRot = ghost._p.rot;
    await new Promise(resolve => {
      const t0 = performance.now();
      ghost.style.transition = 'none';
      const frame = (nowT) => {
        const t = Math.min((nowT - t0) / ms, 1);
        const e1 = 1 - Math.pow(1 - t, 3);                  // leaves fast, slows down
        _setPose(ghost, {
          cx: cur.x + (target.x - cur.x) * e1, cy: cur.y + (target.y - cur.y) * e1,
          rot: startRot + (finalRot + spins - startRot) * e1,
        });
        if (t < 1) requestAnimationFrame(frame); else resolve();
      };
      requestAnimationFrame(frame);
    });
    _setPose(ghost, { cx: target.x, cy: target.y, rot: finalRot });
    _settle(ghost);
    pendingThrow.ready = true;
    const mine = pendingThrow;
    setTimeout(() => { if (pendingThrow === mine) cancelThrow(); }, 12000);   // safety net
    const ok = await playCard(mine.cardIdx);
    if (!ok && pendingThrow === mine) cancelThrow();
  };
  handEl.addEventListener('pointerup', (e) => finish(e, false));
  handEl.addEventListener('pointercancel', (e) => finish(e, true));
}

// Mini card with the same suit icon as the real cards
function miniCard(c) {
  return `<span class="mini ${c.color}">${VALUE_LABELS[c.value] || c.value}<span class="sicon">${SUIT_SVGS[c.suit] || ''}</span></span>`;
}

// Slim ticker with the last two moves: who, the card played, and what it took
function updateLog(gs) {
  const lm = gs.last_move;
  if (lm) {
    const fp = `${lm.seat}-${lm.card.idx}`;
    if (fp !== lastLoggedMove) {
      lastLoggedMove = fp;
      let what;
      if (lm.asso) what = '<span class="arrow">▸</span><span class="star">all</span>';
      else if (lm.capture.length > 0) {
        what = '<span class="arrow">▸</span>' + lm.capture.map(miniCard).join('') + (lm.scopa ? '<span class="star">★</span>' : '');
      } else what = '<span class="arrow">↓</span>';
      moveLog.push(`<span class="chip"><span class="who t${lm.seat % 2}">P${lm.seat}</span>${miniCard(lm.card)}${what}</span>`);
      if (moveLog.length > 2) moveLog.shift();
    }
  }
  const logKey = moveLog.join('|');
  if (_lastRendered.moveLog !== logKey) {
    _lastRendered.moveLog = logKey;
    document.getElementById('move-log').innerHTML = moveLog.join('');
  }
}

function toggleInfo(e) {
  if (e) e.stopPropagation();
  document.getElementById('info-panel').classList.toggle('open');
}
document.addEventListener('click', (e) => {
  if (!e.target.closest('#info-panel')) document.getElementById('info-panel').classList.remove('open');
});
document.querySelector('.info-table th.sicon').innerHTML = SUIT_SVGS.denari;

function updateButtonState() {
  const btn = document.getElementById('btn-next');
  const controls = document.getElementById('controls');
  if (!gameState) { btn.disabled = true; btn.style.display = 'none'; controls.classList.remove('show'); return; }

  const gs = gameState;
  const isWatchMode = gs.human_seats.length === 0;
  controls.classList.toggle('show', isWatchMode);   // New Game lives in the ☰ menu

  // Only show "Next Move" button in watch mode (no human players)
  if (!isWatchMode) {
    btn.style.display = 'none';
    return;
  }

  btn.style.display = '';  // Show button in watch mode

  if (gs.phase === 'game_over') {
    btn.disabled = true;
    btn.textContent = 'Game Over';
    return;
  }
  if (gs.phase === 'hand_over') {
    btn.disabled = true;  // use breakdown dialog button instead
    btn.textContent = 'Next Hand';
    return;
  }
  btn.disabled = false;
  btn.textContent = 'Next Move';
}

// ── Hand breakdown dialog ─────────────────────────────────────────────────
function showBreakdown(bd, handNum, gameScores) {
  const isGameOver = handNum >= 4;
  document.getElementById('breakdown-title').textContent =
    isGameOver ? 'Game Over!' : `Hand ${handNum} Complete`;

  const tbody = document.getElementById('breakdown-body');
  tbody.innerHTML = '';

  // ── Details Section (hidden by default) ──────────────────────────────────

  // Add card counts (details)
  if (bd.card_counts) {
    const c0 = bd.card_counts['0'] ?? 0;
    const c1 = bd.card_counts['1'] ?? 0;
    const ctr = document.createElement('tr');
    ctr.className = 'breakdown-detail';
    ctr.style.borderBottom = '1px solid #333';
    ctr.innerHTML = `
      <td style="color:#aaa;font-size:0.9rem">Cards captured</td>
      <td style="color:#aaa;font-size:0.9rem">${c0}</td>
      <td style="color:#aaa;font-size:0.9rem">${c1}</td>
    `;
    tbody.appendChild(ctr);
  }

  // Add denari counts (details)
  if (bd.denari_counts) {
    const d0 = bd.denari_counts['0'] ?? 0;
    const d1 = bd.denari_counts['1'] ?? 0;
    const dtr = document.createElement('tr');
    dtr.className = 'breakdown-detail';
    dtr.style.borderBottom = '1px solid #444';
    dtr.innerHTML = `
      <td style="color:#aaa;font-size:0.9rem">Denari captured</td>
      <td style="color:#aaa;font-size:0.9rem">${d0}</td>
      <td style="color:#aaa;font-size:0.9rem">${d1}</td>
    `;
    tbody.appendChild(dtr);
  }

  // Add primiera cards (details) - using Italian card display
  if (bd.primiera_cards) {
    const suits = ['denari', 'coppe', 'bastoni', 'spade'];
    const suitLabels = {'denari': 'Denari', 'coppe': 'Coppe', 'bastoni': 'Bastoni', 'spade': 'Spade'};

    suits.forEach(suit => {
      const p0 = bd.primiera_cards['0']?.[suit];
      const p1 = bd.primiera_cards['1']?.[suit];
      const ptr = document.createElement('tr');
      ptr.className = 'breakdown-detail breakdown-primiera';
      ptr.style.fontSize = '0.8rem';
      ptr.style.color = '#999';

      // Label cell
      const labelCell = document.createElement('td');
      labelCell.textContent = suitLabels[suit];
      ptr.appendChild(labelCell);

      // Team 0 card cell
      const t0Cell = document.createElement('td');
      t0Cell.style.textAlign = 'center';
      if (p0) {
        const cardContainer = document.createElement('div');
        cardContainer.style.display = 'flex';
        cardContainer.style.justifyContent = 'center';
        cardContainer.style.alignItems = 'center';
        cardContainer.style.gap = '4px';
        const card = makeCard({
          idx: -1,  // dummy idx
          suit: suit,
          value: p0.value,
          color: (suit === 'denari' || suit === 'coppe') ? 'red' : 'black',
          symbol: suit === 'denari' ? '♦' : suit === 'coppe' ? '♥' : suit === 'bastoni' ? '♣' : '♠'
        }, false, false);
        card.style.setProperty('--w', '44px');
        cardContainer.appendChild(card);
        const score = document.createElement('span');
        score.textContent = `(${p0.primiera_value})`;
        score.style.fontSize = '0.8rem';
        score.style.color = '#aaa';
        score.style.marginLeft = '4px';
        cardContainer.appendChild(score);
        t0Cell.appendChild(cardContainer);
      } else {
        t0Cell.textContent = '—';
      }
      ptr.appendChild(t0Cell);

      // Team 1 card cell
      const t1Cell = document.createElement('td');
      t1Cell.style.textAlign = 'center';
      if (p1) {
        const cardContainer = document.createElement('div');
        cardContainer.style.display = 'flex';
        cardContainer.style.justifyContent = 'center';
        cardContainer.style.alignItems = 'center';
        cardContainer.style.gap = '4px';
        const card = makeCard({
          idx: -1,  // dummy idx
          suit: suit,
          value: p1.value,
          color: (suit === 'denari' || suit === 'coppe') ? 'red' : 'black',
          symbol: suit === 'denari' ? '♦' : suit === 'coppe' ? '♥' : suit === 'bastoni' ? '♣' : '♠'
        }, false, false);
        card.style.setProperty('--w', '44px');
        cardContainer.appendChild(card);
        const score = document.createElement('span');
        score.textContent = `(${p1.primiera_value})`;
        score.style.fontSize = '0.8rem';
        score.style.color = '#aaa';
        score.style.marginLeft = '4px';
        cardContainer.appendChild(score);
        t1Cell.appendChild(cardContainer);
      } else {
        t1Cell.textContent = '—';
      }
      ptr.appendChild(t1Cell);

      tbody.appendChild(ptr);
    });

    // Separator after details
    const sep = document.createElement('tr');
    sep.className = 'breakdown-detail';
    sep.innerHTML = '<td colspan="3" style="border-top:1px solid #444;padding-top:8px;"></td>';
    tbody.appendChild(sep);
  }

  // ── Basic View (always visible) ───────────────────────────────────────────

  const categories = [
    ['Carte',      bd.carte],
    ['Denari',     bd.denari],
    ['Settebello', bd.settebello],
    ['Primiera',   bd.primiera],
    ['Napola',     bd.napola],
    ['Scope',      bd.scope],
  ];

  let total0 = 0, total1 = 0;
  categories.forEach(([name, pts]) => {
    if (!pts) return;
    const p0 = pts['0'] ?? 0;
    const p1 = pts['1'] ?? 0;
    total0 += p0;
    total1 += p1;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${name}</td>
      <td class="${p0 > p1 ? 'winner' : 'loser'}">${p0 > 0 ? '+'+p0 : '–'}</td>
      <td class="${p1 > p0 ? 'winner' : 'loser'}">${p1 > 0 ? '+'+p1 : '–'}</td>
    `;
    tbody.appendChild(tr);
  });

  // Totals row
  const ttr = document.createElement('tr');
  ttr.style.borderTop = '1px solid #555';
  ttr.innerHTML = `
    <td style="font-weight:700">Hand Total</td>
    <td class="${total0 > total1 ? 'winner' : 'loser'}" style="font-weight:700">+${total0}</td>
    <td class="${total1 > total0 ? 'winner' : 'loser'}" style="font-weight:700">+${total1}</td>
  `;
  tbody.appendChild(ttr);

  // Game scores row
  const gs0 = gameScores['0'] ?? 0, gs1 = gameScores['1'] ?? 0;
  const gtr = document.createElement('tr');
  gtr.innerHTML = `
    <td style="color:#aaa;font-size:0.9rem;font-weight:600">Game Score</td>
    <td class="${gs0 > gs1 ? 'winner' : 'loser'}" style="font-size:0.9rem;font-weight:600">${gs0}</td>
    <td class="${gs1 > gs0 ? 'winner' : 'loser'}" style="font-size:0.9rem;font-weight:600">${gs1}</td>
  `;
  tbody.appendChild(gtr);

  // Update button text and actions
  const btn = document.querySelector('.breakdown-close');
  if (isGameOver) {
    btn.textContent = 'Close';
    btn.onclick = () => dismissFinalBreakdown();
  } else {
    btn.textContent = 'Next Hand →';
    btn.onclick = () => closeBreakdown();
  }

  // Add "Back to Main Menu" button if game is over
  const menuBtn = document.querySelector('.breakdown-menu-btn');
  if (isGameOver) {
    menuBtn.style.display = 'block';
  } else {
    menuBtn.style.display = 'none';
  }

  // Reset details visibility (hidden by default)
  const detailsBtn = document.querySelector('.breakdown-details-btn');
  detailsBtn.textContent = 'Show Details';
  detailsBtn.style.display = 'block';
  document.querySelectorAll('.breakdown-detail').forEach(el => el.style.display = 'none');

  renderEvalSummary(isGameOver ? gameState && gameState.eval : null);

  document.getElementById('breakdown-panel').classList.add('visible');
}

// Evaluation mode: results of the finished game + running session statistics
function renderEvalSummary(ev) {
  const box = document.getElementById('eval-summary');
  const nextBtn = document.getElementById('btn-eval-next');
  const closeBtn = document.querySelector('.breakdown-close');
  if (!ev) {
    box.style.display = 'none'; nextBtn.style.display = 'none';
    closeBtn.style.display = '';
    return;
  }
  closeBtn.style.display = 'none';   // in evaluation mode the panel stays until you continue or leave

  const fmt = (x, d = 1) => (x === null || x === undefined) ? '…' : (x > 0 ? '+' : '') + x.toFixed(d);
  const rows = ev.pairs.map(p =>
    `<tr><td>${p.pair + 1}</td><td>${fmt(p.human_margin, 0)}</td><td>${fmt(p.bot_margin)}</td><td>${fmt(p.delta)}</td></tr>`
  ).join('');
  const ci = ev.delta_se !== null ? ` ± ${(1.96 * ev.delta_se).toFixed(1)} (95%)` : '';
  box.innerHTML = `
    <div><b>Evaluation</b> — partner ${_esc(ev.partner)}, opponents ${_esc(ev.opponents.join(' / '))}</div>
    <div>Games: ${ev.wins}W ${ev.draws}D ${ev.losses}L of ${ev.games}, avg margin ${fmt(ev.avg_margin)}</div>
    <table>
      <tr><th>Pair</th><th>You (2 games)</th><th>Bot in your seat</th><th>You − bot</th></tr>
      ${rows || '<tr><td colspan="4">complete a pair (2 games) to compare</td></tr>'}
    </table>
    <div style="margin-top:6px;">
      Mean You − bot per pair: <b>${fmt(ev.delta_mean)}${ci}</b> (n=${ev.delta_n})
      ${ev.baseline_pending ? ' — baseline computing…' : ''}
    </div>
    <div style="color:#999;">Positive = you beat what ${_esc(ev.partner)} would score in your seat on the same deals.
    Margins are team points (you − opponents) summed over the pair; finish every game you start.</div>`;
  box.style.display = 'block';
  nextBtn.style.display = 'block';
}

async function evalNextGame() {
  if (!gameState || !gameState.eval) return;
  const resp = await fetch(`/api/eval/${gameState.eval.session_id}/next`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ player_id: myPlayerId })
  });
  if (!resp.ok) { const e = await resp.json(); alert(e.detail || 'Could not start next game'); return; }
  const data = await resp.json();
  document.getElementById('breakdown-panel').classList.remove('visible');
  if (_gameWs) { _gameWs.close(); _gameWs = null; }
  gameState = null;
  enterGame(data.room_id);
}

// Toggle breakdown details visibility
function toggleBreakdownDetails() {
  const detailRows = document.querySelectorAll('.breakdown-detail');
  const btn = document.querySelector('.breakdown-details-btn');
  const isHidden = detailRows[0]?.style.display === 'none';

  detailRows.forEach(row => {
    row.style.display = isHidden ? '' : 'none';
  });

  btn.textContent = isHidden ? 'Hide Details' : 'Show Details';
}

function dismissFinalBreakdown() {
  document.getElementById('breakdown-panel').classList.remove('visible');
  gameState.last_hand_breakdown = null;  // Prevent it from reappearing
}

function backToMainMenu() {
  document.getElementById('breakdown-panel').classList.remove('visible');
  document.getElementById('app').classList.remove('visible');
  document.getElementById('pregame').classList.remove('hidden');
  showScreen('screen-home');

  // Close WebSocket connection
  if (_gameWs) {
    _gameWs.close();
    _gameWs = null;
  }

  // Reset state
  gameState = null;
  currentRoomId = null;
  mySeat = null;
  moveLog = [];
}

async function closeBreakdown() {
  document.getElementById('breakdown-panel').classList.remove('visible');
  lastPlayedIdx = null;
  lastLoggedMove = null;
  await fetch(`/api/rooms/${currentRoomId}/step`, { method: 'POST' });
  // State update delivered via WebSocket
}

// ── Settings (text size, card size, suggestions) ──────────────────────────
const SETTINGS_KEY = 'scopone.settings';
const settings = { textScale: 1, cardScale: 1, hints: true, pileCounts: false };

function hintsOn() { return settings.hints; }

function applySettings() {
  const root = document.documentElement;
  root.style.setProperty('--text-scale', String(settings.textScale));
  root.style.setProperty('--card-scale', String(settings.cardScale));
  document.body.classList.toggle('hints-off', !settings.hints);
  document.body.classList.toggle('pile-counts', settings.pileCounts);
  document.querySelectorAll('#settings-modal .seg').forEach(seg => {
    const cur = String(settings[seg.dataset.setting]);
    seg.querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.v === cur));
  });
}

function loadSettings() {
  try { Object.assign(settings, JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}')); } catch (e) { /* storage unavailable */ }
  applySettings();
}

// Card size changed (setting or window resize): table positions are in px, so lay them out again
function _tableDimsNow() {
  const r = document.getElementById('table-cards').getBoundingClientRect();
  const { width: cW, height: cH } = _getCardSize();
  return { W: r.width, H: r.height, cW, cH };
}

// Screen or card size changed: keep every card where it was, relative to the table (positions are permanent)
let _tableDims = null;
function relayoutTable() {
  const old = _tableDims;
  _cardSizeCache = null;
  const now = _tableDimsNow();
  if (old && old.W > 0 && now.W > 0) {
    const mg = 6;
    const rx = Math.max(now.W - now.cW - 2 * mg, 1) / Math.max(old.W - old.cW - 2 * mg, 1);
    const ry = Math.max(now.H - now.cH - 2 * mg, 1) / Math.max(old.H - old.cH - 2 * mg, 1);
    Object.values(tableCardPositions).forEach(p => {
      p.x = mg + (p.x - mg) * rx;
      p.y = mg + (p.y - mg) * ry;
    });
  }
  _tableDims = now;
  if (gameState) renderState();
}

function setSetting(key, raw) {
  settings[key] = (key === 'hints' || key === 'pileCounts') ? raw === 'true' : parseFloat(raw);
  try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); } catch (e) { /* ignore */ }
  applySettings();
  if (key === 'hints') {
    _lastRendered.moveLog = null;
    if (gameState) updateLog(gameState);
  } else {
    relayoutTable();
  }
}

function openSettings()  { document.getElementById('settings-modal').classList.add('visible'); }
function closeSettings() { document.getElementById('settings-modal').classList.remove('visible'); }

document.getElementById('settings-modal').addEventListener('click', (e) => {
  const btn = e.target.closest('.seg button');
  if (btn) { setSetting(btn.closest('.seg').dataset.setting, btn.dataset.v); return; }
  if (e.target.id === 'settings-modal') closeSettings();
});

let _resizeTimer = null;
window.addEventListener('resize', () => {
  clearTimeout(_resizeTimer);
  _resizeTimer = setTimeout(relayoutTable, 150);
});
setupOwnCardDrag();

loadSettings();

// ── Init ───────────────────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', async () => {
  // Offline app: run the game engine and AI in the browser instead of talking to a server
  if (window.SCOPONE_OFFLINE) {
    const { install } = await import('./offline/backend.js');
    install();
    document.body.classList.add('offline-app');
    myPlayerId = 'local-player';
    myUsername = 'Player';
    document.getElementById('home-greeting').textContent = 'Choose your opponent';
    loadAvailableModels();
    showScreen('screen-home');
    return;
  }

  // Load available AI models
  loadAvailableModels();

  myPlayerId = localStorage.getItem('playerId');
  myUsername = localStorage.getItem('username');

  // If we have stored credentials, try to re-login to validate them
  if (myPlayerId && myUsername) {
    try {
      const resp = await fetch('/api/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ username: myUsername })
      });
      if (resp.ok) {
        const data = await resp.json();
        myPlayerId = data.player_id;
        localStorage.setItem('playerId', data.player_id);
        localStorage.setItem('username', data.username);
        document.getElementById('home-greeting').textContent = `Hello, ${data.username}!`;
        showScreen('screen-home');  // This will start lobby refresh via showScreen
      } else {
        // Login failed, clear storage and show login screen
        localStorage.removeItem('playerId');
        localStorage.removeItem('username');
        myPlayerId = null;
        myUsername = null;
        showScreen('screen-login');
      }
    } catch (err) {
      console.error('Re-login failed:', err);
      showScreen('screen-login');
    }
  } else {
    showScreen('screen-login');
  }

  document.getElementById('login-username').addEventListener('keydown', e => {
    if (e.key === 'Enter') doLogin();
  });
  document.getElementById('join-code').addEventListener('keydown', e => {
    if (e.key === 'Enter') doJoinLobby();
  });
});

// ── Keyboard shortcut: Space = next move ──────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.code === 'Space' && document.getElementById('breakdown-panel').classList.contains('visible')) {
    // Check if game is over
    if (gameState && gameState.phase === 'game_over') {
      dismissFinalBreakdown();
    } else {
      closeBreakdown();
    }
    e.preventDefault();
  } else if (e.code === 'Space' && !document.getElementById('btn-next').disabled) {
    nextMove();
    e.preventDefault();
  }
});

// Menu toggle
function toggleMenu() {
  const modal = document.getElementById('menu-modal');
  modal.classList.toggle('visible');
}

// Close menu when clicking outside
document.getElementById('menu-modal')?.addEventListener('click', (e) => {
  if (e.target.id === 'menu-modal') toggleMenu();
});