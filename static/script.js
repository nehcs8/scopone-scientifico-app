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
  }
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
    el.onclick = () => playCard(card.idx);
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
    sc0.textContent = `Team 0: ${s0}`;
    sc1.textContent = `Team 1: ${s1}`;
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
  const denari0 = gs.taken ? countDenari(gs.taken, 0) : '?';
  const denari1 = gs.taken ? countDenari(gs.taken, 1) : '?';
  const statsKey = `${takenCounts[0]}-${denari0}-${scope[0]}-${takenCounts[1]}-${denari1}-${scope[1]}`;
  if (_lastRendered.stats !== statsKey) {
    _lastRendered.stats = statsKey;
    const stats0 = document.getElementById('stats-t0');
    const stats1 = document.getElementById('stats-t1');
    if (stats0) stats0.textContent = `T0: ${takenCounts[0] ?? 0}📇 ${denari0}♦ ${scope[0] ?? 0}⭐`;
    if (stats1) stats1.textContent = `T1: ${takenCounts[1] ?? 0}📇 ${denari1}♦ ${scope[1] ?? 0}⭐`;

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
      const canToggle = isWatchMode || gs.my_seat === s;
      btn.style.display = canToggle ? '' : 'none';
      btn.classList.toggle('on', visible.has(s));
      btn.textContent = visible.has(s) ? '👁' : '🙈';
    });
  }

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
// (CSS var --cw). Ghosts are only moved with transform (GPU-composited) and never resized, so a card
// keeps one size from the hand, through the throw, to the table.

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

// Ghost pose: centre (viewport px) + rotation. The only thing that ever changes on a ghost.
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

// Glide a ghost to a new centre (and optionally rotation / opacity) with a CSS transition
function _go(el, cx, cy, ms, { opacity, easing = 'ease-in-out', rot } = {}) {
  el.style.transition = `transform ${ms}ms ${easing}` + (opacity !== undefined ? `, opacity ${ms}ms ${easing}` : '');
  if (opacity !== undefined) el.style.opacity = String(opacity);
  _setPose(el, { cx, cy, rot: rot !== undefined ? rot : el._p.rot });
}

// Throw along a quadratic Bézier arc with some spin; lands exactly on (toX, toY) with rotation finalRot.
function _throwArc(ghost, fromX, fromY, toX, toY, finalRot, durationMs) {
  return new Promise(resolve => {
    const start = performance.now();
    const dist = Math.hypot(toX - fromX, toY - fromY);
    const arcH = Math.max(40, dist * 0.35);
    const cpX = (fromX + toX) / 2;
    const cpY = (fromY + toY) / 2 - arcH;
    const dir = Math.random() < 0.5 ? 1 : -1;
    const totalRot = finalRot + (1 + Math.floor(Math.random() * 2)) * 360 * dir;   // 1-2 full turns
    ghost.style.transition = 'none';

    function frame(now) {
      const t = Math.min((now - start) / durationMs, 1);
      const e = 1 - (1 - t) * (1 - t);                       // ease-out: fast leaving the hand, soft landing
      const x = (1 - e) * (1 - e) * fromX + 2 * (1 - e) * e * cpX + e * e * toX;
      const y = (1 - e) * (1 - e) * fromY + 2 * (1 - e) * e * cpY + e * e * toY;
      _setPose(ghost, { cx: x, cy: y, rot: totalRot * e });
      if (t < 1) requestAnimationFrame(frame);
      else {
        _setPose(ghost, { cx: toX, cy: toY, rot: finalRot });   // same look as totalRot, so no visible jump
        resolve();
      }
    }
    requestAnimationFrame(frame);
  });
}

// After a card lands on the table, check if it overlaps an existing card. If so, slide a hand in
// from the player's side and nudge the cards apart (real cards and the landed ghost move together).
async function _animateSeparation(seat, newCardIdx, overlay, ghost) {
  const newPos = tableCardPositions[newCardIdx];
  if (!newPos) return;

  const tableCardsEl = document.getElementById('table-cards');
  const tcRect = tableCardsEl.getBoundingClientRect();
  const { width: cW, height: cH } = _getCardSize();
  const mg = 6;

  const nc = { x: newPos.x + cW / 2, y: newPos.y + cH / 2 };
  const overlaps = [];
  for (const [idxStr, pos] of Object.entries(tableCardPositions)) {
    const idx = parseInt(idxStr);
    if (idx === newCardIdx) continue;
    const c = { x: pos.x + cW / 2, y: pos.y + cH / 2 };
    if (Math.hypot(nc.x - c.x, nc.y - c.y) < cW * 0.6) overlaps.push({ idx, pos, center: c });
  }
  if (overlaps.length === 0) return;

  const pileVX = tcRect.left + nc.x;
  const pileVY = tcRect.top  + nc.y;
  const handRot = { 0: 0, 2: 180, 1: 90, 3: -90 };
  const away = cW * 1.2;
  let hStartX, hStartY;
  switch (seat) {
    case 2: hStartX = pileVX; hStartY = tcRect.top - away; break;
    case 1: hStartX = tcRect.left - away; hStartY = pileVY; break;
    case 3: hStartX = tcRect.right + away; hStartY = pileVY; break;
    default: hStartX = pileVX; hStartY = tcRect.bottom + away;
  }

  const handEl = document.createElement('div');
  handEl.textContent = '🤚';
  const rot = handRot[seat] ?? 0;
  const handAt = (x, y) => `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) rotate(${rot}deg)`;
  Object.assign(handEl.style, {
    position: 'fixed', left: '0', top: '0', fontSize: Math.round(cW * 0.6) + 'px', zIndex: '102', willChange: 'transform',
    pointerEvents: 'none', opacity: '0', transition: 'none', transform: handAt(hStartX, hStartY),
  });
  overlay.appendChild(handEl);

  // Slide hand in to the pile
  await _sleep(20);
  handEl.style.transition = 'transform 180ms ease-out, opacity 130ms ease';
  handEl.style.opacity = '1';
  handEl.style.transform = handAt(pileVX, pileVY);
  await _sleep(200);

  // Nudge overlapping cards away from the new card; push the new card back slightly
  const NUDGE = cW * 0.7;
  let sumDx = 0, sumDy = 0;
  overlaps.forEach(({ idx, pos, center }) => {
    let dx = center.x - nc.x, dy = center.y - nc.y;
    const d = Math.hypot(dx, dy) || 1;
    dx /= d; dy /= d;
    sumDx += dx; sumDy += dy;
    const nx = Math.max(mg, Math.min(pos.x + dx * NUDGE, tcRect.width  - cW - mg));
    const ny = Math.max(mg, Math.min(pos.y + dy * NUDGE, tcRect.height - cH - mg));
    tableCardPositions[idx] = { ...tableCardPositions[idx], x: nx, y: ny };
    const el = tableCardsEl.querySelector(`[data-card-idx="${idx}"]`);
    if (el) {
      el.style.transition = 'transform 180ms ease-out';
      el.style.transform = _tablePose(tableCardPositions[idx]);
    }
  });

  const sd = Math.hypot(sumDx, sumDy) || 1;
  const backX = Math.max(mg, Math.min(newPos.x - (sumDx / sd) * NUDGE * 0.45, tcRect.width  - cW - mg));
  const backY = Math.max(mg, Math.min(newPos.y - (sumDy / sd) * NUDGE * 0.45, tcRect.height - cH - mg));
  tableCardPositions[newCardIdx] = { ...tableCardPositions[newCardIdx], x: backX, y: backY };
  if (ghost) _go(ghost, tcRect.left + backX + cW / 2, tcRect.top + backY + cH / 2, 180, { easing: 'ease-out' });
  await _sleep(200);

  // Hand slides back out
  handEl.style.transition = 'transform 160ms ease-in, opacity 130ms ease 30ms';
  handEl.style.opacity = '0';
  handEl.style.transform = handAt(hStartX, hStartY);
  await _sleep(180);
  handEl.remove();
}

// Plays the animation of a move. Resolves to a cleanup() function: call it right AFTER the new state is
// rendered, so the landed ghost is swapped for the real table card in the same frame (no flash).
async function runPlayAnimation(lm) {
  if (!lm) return null;

  const overlay = document.getElementById('anim-overlay');
  const label   = document.getElementById('anim-label');
  overlay.innerHTML = '';
  label.style.opacity = '0';

  const { width: cW, height: cH } = _getCardSize();
  const seatEl      = document.getElementById(`seat-${lm.seat}`);
  const tableAreaEl = document.getElementById('table-area');
  const handEl      = document.getElementById(`hand-${lm.seat}`);
  const seatC  = _centerOf(seatEl);
  const tableC = _centerOf(tableAreaEl);

  // The card leaves from its place in the hand (hidden hands: from the middle of the fan)
  let handCardEl = handEl.querySelector(`[data-card-idx="${lm.card.idx}"]`);
  if (!handCardEl && handEl.children.length) handCardEl = handEl.children[Math.floor(handEl.children.length / 2)];
  const startC = handCardEl ? _centerOf(handCardEl) : seatC;

  const tableSnap = [];
  document.querySelectorAll('#table-cards [data-card-idx]').forEach(tcEl => {
    const idx = parseInt(tcEl.dataset.cardIdx);
    const cardData = (lm.capture || []).find(c => c.idx === idx);
    if (lm.asso || cardData) {
      tableSnap.push({ card: cardData, el: tcEl, pos: _centerOf(tcEl), rot: tableCardPositions[idx]?.rot ?? 0 });
    }
  });

  // Landing spot for plays that stay on the table
  const isCapture = lm.asso || (lm.capture && lm.capture.length > 0);
  let spot = null, tcRect = null;
  if (!isCapture) {
    tcRect = document.getElementById('table-cards').getBoundingClientRect();
    spot = computeLandingSpot(lm.seat, tcRect);
    tableCardPositions[lm.card.idx] = { ...spot, z: tableZCounter++ };
  }
  const throwFinalRot = spot ? spot.rot : (Math.random() - 0.5) * 20;

  let targetC = tableC;
  if (lm.asso && tableSnap.length > 0) {
    const nearest = tableSnap
      .filter(s => s.card?.suit)
      .reduce((best, s) => {
        const d = Math.hypot(s.pos.x - startC.x, s.pos.y - startC.y);
        return (!best || d < best.d) ? { s, d } : best;
      }, null);
    if (nearest) targetC = nearest.s.pos;
  } else if (!lm.asso && tableSnap.length > 0) {
    targetC = {
      x: tableSnap.reduce((s, p) => s + p.pos.x, 0) / tableSnap.length,
      y: tableSnap.reduce((s, p) => s + p.pos.y, 0) / tableSnap.length,
    };
  } else if (spot && tcRect) {
    targetC = { x: tcRect.left + spot.x + cW / 2, y: tcRect.top + spot.y + cH / 2 };
  }

  const cleanup = () => {
    overlay.innerHTML = '';
    label.style.opacity = '0';
    if (handCardEl) handCardEl.style.visibility = '';
    tableSnap.forEach(s => { s.el.style.visibility = ''; });
  };

  try {
    // Swap the real cards for ghosts in one frame (same size, same place → invisible)
    if (handCardEl) handCardEl.style.visibility = 'hidden';
    tableSnap.forEach(s => { s.el.style.visibility = 'hidden'; });

    const mainGhost = _makeGhost(lm.card, startC.x, startC.y, 0);
    overlay.appendChild(mainGhost);
    const captureGhosts = tableSnap
      .filter(s => s.card?.suit)
      .map(({ card: c, pos, rot }) => {
        const g = _makeGhost(c, pos.x, pos.y, rot);
        overlay.appendChild(g);
        return g;
      });

    // For asso: pair each ghost with its snap, sorted nearest → farthest from the thrower
    const assoItems = lm.asso
      ? tableSnap
          .filter(s => s.card?.suit)
          .map((snap, i) => ({ snap, ghost: captureGhosts[i] }))
          .sort((a, b) =>
            Math.hypot(a.snap.pos.x - startC.x, a.snap.pos.y - startC.y) -
            Math.hypot(b.snap.pos.x - startC.x, b.snap.pos.y - startC.y))
      : [];

    label.innerHTML = lm.asso  ? `<span class="anim-accent">Asso piglia tutto!</span>P${lm.seat}`
                    : lm.scopa ? `<span class="anim-accent">SCOPA!</span>P${lm.seat}`
                    :             `P${lm.seat}`;
    label.style.opacity = '1';

    // ── Throw ───────────────────────────────────────────────────────────
    await _throwArc(mainGhost, startC.x, startC.y, targetC.x, targetC.y, throwFinalRot, 340 + Math.random() * 100);

    // ── Action ──────────────────────────────────────────────────────────
    if (lm.asso) {
      if (assoItems.length === 0) {
        _go(mainGhost, seatC.x, seatC.y, 300, { opacity: 0, easing: 'ease-in' });
        await _sleep(320);
      } else {
        assoItems[0].ghost.style.transition = 'opacity 100ms ease';
        assoItems[0].ghost.style.opacity = '0';
        await _sleep(90);
        for (let i = 1; i < assoItems.length; i++) {
          const dest = assoItems[i].snap.pos;
          _go(mainGhost, dest.x, dest.y, 170, { easing: 'ease-in-out' });
          await _sleep(180);
          assoItems[i].ghost.style.transition = 'opacity 90ms ease';
          assoItems[i].ghost.style.opacity = '0';
          await _sleep(60);
        }
        await _sleep(60);
        [mainGhost, ...captureGhosts].forEach(g =>
          _go(g, seatC.x, seatC.y, 360, { opacity: 0, easing: 'ease-in' }));
        await _sleep(380);
      }

    } else if (lm.scopa) {
      const dx = seatC.x - targetC.x, dy = seatC.y - targetC.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const ux = dx / dist, uy = dy / dist;
      const broomAngle = Math.atan2(uy, ux) * 180 / Math.PI - 45;

      captureGhosts.forEach(g => _go(g, targetC.x, targetC.y, 140, { easing: 'ease-in' }));
      await _sleep(160);

      const bx0 = targetC.x - ux * cW, by0 = targetC.y - uy * cW;
      const broom = Object.assign(document.createElement('div'), { textContent: '🧹' });
      const broomAt = (x, y) => `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) rotate(${broomAngle}deg)`;
      Object.assign(broom.style, {
        position: 'fixed', left: '0', top: '0', fontSize: Math.round(cW * 1.8) + 'px', zIndex: '101', willChange: 'transform',
        pointerEvents: 'none', opacity: '0', transition: 'none', transform: broomAt(bx0, by0),
      });
      overlay.appendChild(broom);
      await _sleep(20);
      broom.style.transition = 'opacity 80ms ease';
      broom.style.opacity = '1';
      await _sleep(90);

      const sweepPx = cW * 0.7;
      const allGhosts = [mainGhost, ...captureGhosts];
      for (let i = 0; i < 3; i++) {
        const cx = targetC.x + ux * sweepPx * (i + 1);
        const cy = targetC.y + uy * sweepPx * (i + 1);
        const brx = bx0 + ux * sweepPx * (i + 1);
        const bry = by0 + uy * sweepPx * (i + 1);
        broom.style.transition = 'transform 133ms ease-in-out';
        broom.style.transform = broomAt(brx, bry);
        allGhosts.forEach(g => _go(g, cx, cy, 133, { easing: 'ease-in-out' }));
        await _sleep(150);
        if (i < 2) {
          broom.style.transition = 'transform 73ms ease-out';
          broom.style.transform = broomAt(brx - ux * 14, bry - uy * 14);
          await _sleep(95);
        }
      }

      allGhosts.forEach(g => _go(g, seatC.x, seatC.y, 227, { opacity: 0, easing: 'ease-in' }));
      broom.style.transition = 'transform 227ms ease-in, opacity 147ms ease 80ms';
      broom.style.transform = broomAt(seatC.x + ux * 40, seatC.y + uy * 40);
      broom.style.opacity = '0';
      await _sleep(240);

    } else if (captureGhosts.length > 0) {
      captureGhosts.forEach(g => _go(g, targetC.x, targetC.y, 220, { easing: 'ease-in' }));
      await _sleep(240);
      [mainGhost, ...captureGhosts].forEach(g =>
        _go(g, seatC.x, seatC.y, 340, { opacity: 0, easing: 'ease-out' }));
      await _sleep(360);

    } else {
      // No capture: the ghost stays put (it is the new table card) while any overlap is separated.
      // It is removed by cleanup() once the real table card is rendered.
      await _animateSeparation(lm.seat, lm.card.idx, overlay, mainGhost);
    }
  } catch (err) {
    console.error('Play animation failed:', err);
  }
  return cleanup;
}

function updateLog(gs) {
  const lm = gs.last_move;

  // Build a move entry if there's a new last_move
  if (lm) {
    const fp = `${lm.seat}-${lm.card.idx}`;
    if (fp !== lastLoggedMove) {
      lastLoggedMove = fp;
      const card = `<span class="hl">${VALUE_LABELS[lm.card.value]}${lm.card.symbol}</span>`;
      let msg = `P${lm.seat} → ${card}`;
      if (lm.asso) {
        msg += ' <span class="hl">asso piglia tutto</span>';
      } else if (lm.capture.length > 0) {
        const caps = lm.capture.map(c => `${c.value}${c.symbol}`).join(' ');
        msg += ` captures ${caps}`;
        if (lm.scopa) msg += ' <span class="sc">SCOPA</span>';
      } else {
        msg += ' to table';
      }
      moveLog.push(msg);
      if (moveLog.length > 3) moveLog.shift();
    }
  }

  // Always append a prompt as the last visual line (not stored in log)
  let prompt = '';
  if (gs.phase === 'game_over') {
    const s0 = gs.game_scores['0'], s1 = gs.game_scores['1'];
    const winner = s0 > s1 ? 'Team 0' : s1 > s0 ? 'Team 1' : 'Tie';
    prompt = `<span class="sys hl">Game over — ${winner} wins (${s0}–${s1})</span>`;
  } else if (gs.phase === 'hand_over') {
    prompt = `<span class="sys">Hand over — see results</span>`;
  } else {
    const cur = gs.current_player;
    if (canPlayCurrentSeat(gs)) {
      prompt = hintsOn() ? `<span class="sys hl">Your turn (P${cur}) — tap a card</span>` : `<span class="sys hl">Your turn</span>`;
    } else if (gs.human_seats.includes(cur)) {
      prompt = `<span class="sys">P${cur} to play...</span>`;
    } else {
      prompt = `<span class="sys">P${cur} (AI) thinking...</span>`;
    }
  }

  // Only update DOM if log has changed
  const logKey = moveLog.join('|') + '||' + prompt;
  if (_lastRendered.moveLog !== logKey) {
    _lastRendered.moveLog = logKey;

    const logEl = document.getElementById('move-log');
    logEl.innerHTML = '';
    moveLog.forEach(html => {
      const d = document.createElement('div');
      d.className = 'log-line';
      d.innerHTML = html;
      logEl.appendChild(d);
    });
    const pd = document.createElement('div');
    pd.className = 'log-line';
    pd.innerHTML = prompt;
    logEl.appendChild(pd);
  }
}

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
const settings = { textScale: 1, cardScale: 1, hints: true };

function hintsOn() { return settings.hints; }

function applySettings() {
  const root = document.documentElement;
  root.style.setProperty('--text-scale', String(settings.textScale));
  root.style.setProperty('--card-scale', String(settings.cardScale));
  document.body.classList.toggle('hints-off', !settings.hints);
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
function relayoutTable() {
  _cardSizeCache = null;
  if (!gameState) return;
  Object.keys(tableCardPositions).forEach(k => delete tableCardPositions[k]);
  tableZCounter = 1;
  renderState();
}

function setSetting(key, raw) {
  settings[key] = key === 'hints' ? raw === 'true' : parseFloat(raw);
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