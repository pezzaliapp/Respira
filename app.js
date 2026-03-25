/* ═══════════════════════════════════════════
   RESPIRA — app.js
   ═══════════════════════════════════════════ */

'use strict';

// ═══════════════════════════════════════════
//  BACKGROUND AURORA CANVAS
// ═══════════════════════════════════════════

const canvas = document.getElementById('bg-canvas');
const ctx    = canvas.getContext('2d');
let W, H;

function resizeCanvas() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const ORB_DEFS = [
  { x: 0.15, y: 0.25, r: 0.55, color: [196, 132,  90], speed: 0.0003,  phase: 0   },
  { x: 0.8,  y: 0.7,  r: 0.4,  color: [122, 158, 126], speed: 0.0002,  phase: 2.1 },
  { x: 0.5,  y: 0.5,  r: 0.35, color: [138, 180, 194], speed: 0.00015, phase: 4.2 },
];

let breathScale       = 1;
let targetBreathScale = 1;

function drawBg(t) {
  ctx.fillStyle = '#1a1209';
  ctx.fillRect(0, 0, W, H);

  breathScale += (targetBreathScale - breathScale) * 0.02;

  ORB_DEFS.forEach(o => {
    const px = W * o.x + Math.sin(t * o.speed + o.phase) * W * 0.08;
    const py = H * o.y + Math.cos(t * o.speed * 1.3 + o.phase) * H * 0.06;
    const r  = Math.min(W, H) * o.r * breathScale;

    const g = ctx.createRadialGradient(px, py, 0, px, py, r);
    g.addColorStop(0, `rgba(${o.color},0.13)`);
    g.addColorStop(1, `rgba(${o.color},0)`);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(px, py, r, 0, Math.PI * 2);
    ctx.fill();
  });
}

(function loop(t) {
  drawBg(t);
  requestAnimationFrame(loop);
})();


// ═══════════════════════════════════════════
//  TECHNIQUES DATA
// ═══════════════════════════════════════════

const TECHNIQUES = {
  box: {
    name:   'Box Breathing',
    rounds: 6,
    phases: [
      { name: 'Inspira',   duration: 4, type: 'inhale' },
      { name: 'Trattieni', duration: 4, type: 'hold'   },
      { name: 'Espira',    duration: 4, type: 'exhale'  },
      { name: 'Trattieni', duration: 4, type: 'hold2'  },
    ],
    science:     'Il Box Breathing abbassa il cortisolo e attiva il nervo vago, portando il sistema nervoso in modalità parasimpatica.',
    completeMsg: 'La tua frequenza cardiaca è più regolare ora.',
  },
  '478': {
    name:   '4 · 7 · 8',
    rounds: 4,
    phases: [
      { name: 'Inspira',   duration: 4, type: 'inhale' },
      { name: 'Trattieni', duration: 7, type: 'hold'   },
      { name: 'Espira',    duration: 8, type: 'exhale'  },
    ],
    science:     'Il 4-7-8 di Andrew Weil amplifica l\'effetto calmante del GABA, riducendo l\'ansia e favorendo il sonno.',
    completeMsg: 'Il tuo cortisolo si è abbassato. Dormirai meglio.',
  },
  coherence: {
    name:   'Coerenza Cardiaca',
    rounds: 25,
    phases: [
      { name: 'Inspira', duration: 5, type: 'inhale' },
      { name: 'Espira',  duration: 5, type: 'exhale'  },
    ],
    science:     'La coerenza cardiaca a 5s/fase sincronizza il ritmo cardiaco con la respirazione, massimizzando l\'HRV e la resilienza emotiva.',
    completeMsg: 'La tua variabilità cardiaca è migliorata. Sei più resiliente.',
  },
};


// ═══════════════════════════════════════════
//  STATE
// ═══════════════════════════════════════════

const state = {
  currentTechnique: null,
  isRunning:        false,
  currentRound:     0,
  currentPhaseIdx:  0,
  progressTimer:    null,
  totalCircumference: 0,
};


// ═══════════════════════════════════════════
//  STORAGE — minimal, no obsessive streaks
// ═══════════════════════════════════════════

function loadStats() {
  try {
    const s = JSON.parse(localStorage.getItem('respira_stats') || '{}');
    return {
      totalSessions:   s.totalSessions   || 0,
      streakDays:      s.streakDays      || 0,
      lastSessionDate: s.lastSessionDate || null,
      todaySessions:   s.todaySessions   || 0,
      lastTodayDate:   s.lastTodayDate   || null,
    };
  } catch {
    return { totalSessions: 0, streakDays: 0, lastSessionDate: null, todaySessions: 0, lastTodayDate: null };
  }
}

function saveStats(s) {
  localStorage.setItem('respira_stats', JSON.stringify(s));
}

function updateStatsBar() {
  const s     = loadStats();
  const today = new Date().toDateString();
  const count = s.lastTodayDate === today ? s.todaySessions : 0;

  document.getElementById('stat-today').textContent  = count;
  document.getElementById('stat-streak').textContent = s.streakDays;
  document.getElementById('stat-total').textContent  = s.totalSessions;
}

function recordSession() {
  const s     = loadStats();
  const today = new Date().toDateString();

  if (s.lastTodayDate !== today) {
    s.todaySessions = 0;
    s.lastTodayDate = today;
  }
  s.todaySessions++;
  s.totalSessions++;

  if (s.lastSessionDate) {
    const last    = new Date(s.lastSessionDate);
    const now     = new Date();
    const diffDays = Math.floor((now - last) / 86400000);
    if (diffDays === 1)      s.streakDays++;
    else if (diffDays > 1)  s.streakDays = 1;
  } else {
    s.streakDays = 1;
  }
  s.lastSessionDate = today;
  saveStats(s);
  updateStatsBar();
}


// ═══════════════════════════════════════════
//  SCREEN NAVIGATION
// ═══════════════════════════════════════════

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');

  const inBreath = id === 'screen-breath';
  document.getElementById('stats-bar').style.opacity = inBreath ? '0' : '1';
}


// ═══════════════════════════════════════════
//  PROGRESS ARC
// ═══════════════════════════════════════════

function setupArc() {
  const arc  = document.getElementById('progress-arc');
  const circ = 2 * Math.PI * 108;
  state.totalCircumference = circ;
  arc.style.strokeDasharray  = circ;
  arc.style.strokeDashoffset = circ;
}

function setArcProgress(pct) {
  document.getElementById('progress-arc').style.strokeDashoffset =
    state.totalCircumference * (1 - pct);
}

function setArcColor(type) {
  const colors = { inhale: '#c4845a', hold: '#8ab4c2', hold2: '#8ab4c2', exhale: '#7a9e7e' };
  document.getElementById('progress-arc').style.stroke = colors[type] || '#c4845a';
}


// ═══════════════════════════════════════════
//  CIRCLE VISUAL STATE
// ═══════════════════════════════════════════

function setCirclePhase(type) {
  document.getElementById('circle-inner').className = 'circle-inner ' + type;

  const glows = {
    inhale: 'radial-gradient(ellipse, rgba(196,132,90,0.18) 30%, rgba(196,132,90,0) 80%)',
    hold:   'radial-gradient(ellipse, rgba(138,180,194,0.12) 30%, rgba(138,180,194,0) 80%)',
    hold2:  'radial-gradient(ellipse, rgba(138,180,194,0.10) 30%, rgba(138,180,194,0) 80%)',
    exhale: 'radial-gradient(ellipse, rgba(122,158,126,0.15) 30%, rgba(122,158,126,0) 80%)',
  };
  document.getElementById('circle-glow').style.background = glows[type] || '';

  const scales = { inhale: 1.10, hold: 1.08, hold2: 1.05, exhale: 0.96 };
  targetBreathScale = scales[type] || 1.0;
}


// ═══════════════════════════════════════════
//  BREATHING ENGINE
// ═══════════════════════════════════════════

function startBreathing() {
  if (!state.currentTechnique) return;

  const btnStart = document.getElementById('btn-start');
  btnStart.textContent = 'Pausa';
  btnStart.onclick     = pauseBreathing;

  state.isRunning       = true;
  state.currentRound    = 1;
  state.currentPhaseIdx = 0;
  runPhase();
}

function runPhase() {
  if (!state.isRunning) return;

  const tech  = TECHNIQUES[state.currentTechnique];
  const phase = tech.phases[state.currentPhaseIdx];

  // Update labels
  document.getElementById('breath-phase').textContent      = phase.name;
  document.getElementById('breath-count').textContent      = phase.duration;
  document.getElementById('breath-unit').textContent       = 'SECONDI';
  document.getElementById('breath-rounds-info').textContent =
    `Ciclo ${state.currentRound} di ${tech.rounds}`;

  setCirclePhase(phase.type);
  setArcColor(phase.type);

  // Gentle haptic hint
  if ('vibrate' in navigator) {
    if (phase.type === 'inhale')       navigator.vibrate([30]);
    else if (phase.type === 'exhale')  navigator.vibrate([20, 20, 20]);
  }

  let elapsed      = 0;
  const total      = phase.duration;
  const intervalMs = 50;

  clearInterval(state.progressTimer);

  state.progressTimer = setInterval(() => {
    if (!state.isRunning) { clearInterval(state.progressTimer); return; }

    elapsed += intervalMs / 1000;
    const remaining = Math.ceil(total - elapsed);
    const countEl   = document.getElementById('breath-count');

    if (remaining !== parseInt(countEl.textContent, 10)) {
      countEl.textContent = remaining > 0 ? remaining : 0;
    }
    setArcProgress(elapsed / total);

    if (elapsed >= total) {
      clearInterval(state.progressTimer);
      nextPhase();
    }
  }, intervalMs);
}

function nextPhase() {
  const tech = TECHNIQUES[state.currentTechnique];
  state.currentPhaseIdx++;

  if (state.currentPhaseIdx >= tech.phases.length) {
    state.currentPhaseIdx = 0;
    state.currentRound++;

    if (state.currentRound > tech.rounds) {
      completeSession();
      return;
    }
  }
  runPhase();
}

function pauseBreathing() {
  state.isRunning = false;
  clearInterval(state.progressTimer);

  const btnStart = document.getElementById('btn-start');
  btnStart.textContent = 'Riprendi';
  btnStart.onclick     = resumeBreathing;

  document.getElementById('breath-phase').textContent = 'In pausa';
  document.getElementById('circle-inner').className   = 'circle-inner';
  targetBreathScale = 1;
}

function resumeBreathing() {
  state.isRunning      = true;
  const btnStart       = document.getElementById('btn-start');
  btnStart.textContent = 'Pausa';
  btnStart.onclick     = pauseBreathing;
  runPhase();
}

function stopBreathing() {
  state.isRunning = false;
  clearInterval(state.progressTimer);
  setArcProgress(0);
  document.getElementById('circle-inner').className = 'circle-inner';
  targetBreathScale = 1;
}

function completeSession() {
  stopBreathing();
  recordSession();

  const tech = TECHNIQUES[state.currentTechnique];
  document.getElementById('complete-msg').textContent     = tech.completeMsg;
  document.getElementById('complete-science').textContent = tech.science;

  const icon = document.getElementById('complete-icon');
  icon.style.animation = 'complete-pop 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards';

  if ('vibrate' in navigator) navigator.vibrate([40, 30, 40, 30, 60]);

  showScreen('screen-complete');
}


// ═══════════════════════════════════════════
//  SETUP BREATH SCREEN
// ═══════════════════════════════════════════

function openTechnique(key) {
  state.currentTechnique = key;
  const tech = TECHNIQUES[key];

  document.getElementById('breath-technique-label').textContent = tech.name;
  document.getElementById('breath-rounds-info').textContent     = `Ciclo 1 di ${tech.rounds}`;
  document.getElementById('breath-phase').textContent           = 'Pronto?';
  document.getElementById('breath-count').textContent           = '·';
  document.getElementById('breath-unit').textContent            = 'TOCCA PER INIZIARE';

  const btnStart       = document.getElementById('btn-start');
  btnStart.textContent = 'Inizia';
  btnStart.onclick     = startBreathing;

  setArcProgress(0);
  document.getElementById('circle-inner').className = 'circle-inner';
  showScreen('screen-breath');
}


// ═══════════════════════════════════════════
//  EVENT LISTENERS
// ═══════════════════════════════════════════

// Technique cards
document.querySelectorAll('.tech-card').forEach(card => {
  const key = card.dataset.technique;

  card.addEventListener('click', () => openTechnique(key));
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openTechnique(key);
    }
  });
});

// Circle tap — starts if idle
document.getElementById('circle-container').addEventListener('click', () => {
  if (!state.isRunning && state.currentTechnique) {
    document.getElementById('btn-start').click();
  }
});

// Back home
document.getElementById('btn-back-home').addEventListener('click', () => {
  stopBreathing();
  showScreen('screen-home');
});

// Complete screen
document.getElementById('btn-home-from-complete').addEventListener('click', () => {
  document.getElementById('complete-icon').style.animation = 'none';
  showScreen('screen-home');
});

document.getElementById('btn-repeat').addEventListener('click', () => {
  document.getElementById('complete-icon').style.animation = 'none';
  document.getElementById('breath-phase').textContent = 'Pronto?';
  document.getElementById('breath-count').textContent = '·';
  document.getElementById('breath-unit').textContent  = 'TOCCA PER INIZIARE';

  const btnStart       = document.getElementById('btn-start');
  btnStart.textContent = 'Inizia';
  btnStart.onclick     = startBreathing;

  setArcProgress(0);
  showScreen('screen-breath');
});


// ═══════════════════════════════════════════
//  PWA — SERVICE WORKER REGISTRATION
// ═══════════════════════════════════════════

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('[SW] Registered:', reg.scope))
      .catch(err => console.warn('[SW] Registration failed:', err));
  });
}


// ═══════════════════════════════════════════
//  PWA — INSTALL PROMPT
// ═══════════════════════════════════════════

let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredPrompt = e;
  setTimeout(() => document.getElementById('install-banner').classList.add('show'), 4000);
});

document.getElementById('btn-install').addEventListener('click', async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  document.getElementById('install-banner').classList.remove('show');
});


// ═══════════════════════════════════════════
//  INIT
// ═══════════════════════════════════════════

setupArc();
updateStatsBar();
