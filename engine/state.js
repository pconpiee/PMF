// ═══════════════════════════════════════════════════════
// PMF LAB — GAME STATE
// Single source of truth for all game data.
// All other modules read from and write to G.
// ═══════════════════════════════════════════════════════

// ── PHASE DEFINITIONS ───────────────────────────────────
const PHASES = [
  'Discovery',
  'Problem Validation',
  'Solution Testing',
  'Market Fit',
  'Scale Prep'
];

// ── PHASE THRESHOLDS ────────────────────────────────────
// PMF score ranges that trigger phase transitions
const PHASE_THRESHOLDS = [0, 20, 40, 60, 80];

// ── GRADE DEFINITIONS ───────────────────────────────────
const GRADES = {
  A: {
    min: 75,
    grade: 'A',
    color: '#2a7a4a',
    title: 'PMF Achieved',
    label: 'PRODUCT-MARKET FIT CONFIRMED',
    desc: 'Outstanding execution. You identified your beachhead segment, validated the pain, found a repeatable acquisition channel, and proved retention. Investors would fund this. A Series A conversation is warranted.'
  },
  B: {
    min: 55,
    grade: 'B',
    color: '#c97c2a',
    title: 'Strong PMF Signal',
    label: 'APPROACHING PRODUCT-MARKET FIT',
    desc: 'You\'ve found real PMF signal but haven\'t fully cracked retention or channel repeatability. The foundation is solid. With more runway you\'d get there. This is a strong "keep going" signal — not a pivot signal.'
  },
  C: {
    min: 35,
    grade: 'C',
    color: '#a06a2a',
    title: 'Weak PMF Signal',
    label: 'PMF SIGNAL FRAGILE',
    desc: 'You have some evidence of fit but it\'s fragile. Your hypothesis testing was incomplete and you may have chased the wrong segment. You need another iteration cycle — and to be more ruthless about killing assumptions early.'
  },
  D: {
    min: 0,
    grade: 'D',
    color: '#8a3030',
    title: 'PMF Not Found',
    label: 'RUNWAY EXHAUSTED',
    desc: 'The runway ran out before you found fit. This is the most common startup outcome. The good news: you\'ve learned what doesn\'t work. The critical question — did you learn it cheaply enough to pivot and try again?'
  }
};

// ── GAME STATE ──────────────────────────────────────────
// G is the single mutable state object.
// Never mutate nested objects directly — replace them.
let G = {
  // Scenario
  scenario: null,

  // Time & money
  day: 0,
  totalDays: 120,
  budget: 500000,

  // Progress
  pmfScore: 0,
  insights: 0,
  users: 0,

  // Actions
  actionsUsed: [],       // array of action ids
  actionHistory: [],     // array of { actionId, outcome, prediction, dayTaken, pmfBefore, pmfAfter }

  // Hypotheses — cloned from scenario on start
  hypotheses: [],

  // Segments — cloned from scenario on start
  segments: [],

  // Metrics — updated after each action
  metrics: {
    mrr: 0,
    nps: null,
    d30retention: null,
    cac: null
  },

  // Activity log — drives the right sidebar feed
  activityLog: [],       // array of { type, text, day }

  // Hypothesis gate state
  pendingAction: null,   // action object waiting for hypothesis input
  pendingPrediction: '', // text from hypothesis gate input

  // Filter state
  activeFilter: 'all',

  // End state
  isOver: false
};

// ── STATE HELPERS ────────────────────────────────────────

function getPhase() {
  const score = G.pmfScore;
  for (let i = PHASE_THRESHOLDS.length - 1; i >= 0; i--) {
    if (score >= PHASE_THRESHOLDS[i]) return i;
  }
  return 0;
}

function getGrade() {
  const score = Math.round(G.pmfScore);
  if (score >= GRADES.A.min) return GRADES.A;
  if (score >= GRADES.B.min) return GRADES.B;
  if (score >= GRADES.C.min) return GRADES.C;
  return GRADES.D;
}

function fmtBudget(n) {
  if (n >= 1000000) return '£' + (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000)    return '£' + Math.round(n / 1000) + 'K';
  return '£' + n;
}

function fmtDelta(n) {
  if (n > 0) return '+' + n;
  return String(n);
}

function daysLeft() {
  return G.totalDays - G.day;
}

function isActionUsed(id) {
  return G.actionsUsed.includes(id);
}

function canAfford(action) {
  return G.budget >= action.budgetCost && daysLeft() >= action.timeCost;
}

function logActivity(type, text) {
  G.activityLog.push({ type, text, day: G.day });
}

// ── RESET ────────────────────────────────────────────────

function resetState(scenario) {
  G.scenario      = scenario;
  G.day           = 0;
  G.totalDays     = scenario.totalDays;
  G.budget        = scenario.startBudget;
  G.pmfScore      = 0;
  G.insights      = 0;
  G.users         = 0;
  G.actionsUsed   = [];
  G.actionHistory = [];
  G.hypotheses    = scenario.hypotheses.map(h => ({ ...h, status: 'pending', result: '' }));
  G.segments      = scenario.segments.map(s => ({ ...s }));
  G.metrics       = { mrr: 0, nps: null, d30retention: null, cac: null };
  G.activityLog   = [];
  G.pendingAction = null;
  G.pendingPrediction = '';
  G.activeFilter  = 'all';
  G.isOver        = false;
}

// ── METRICS UPDATE ───────────────────────────────────────
// Called after every action resolves

function updateMetrics() {
  const s = G.scenario;
  G.metrics.mrr = G.users * s.arpu;
  G.metrics.nps = G.users > 0
    ? Math.min(72, Math.round(G.pmfScore * 0.85 - 12))
    : null;
  G.metrics.d30retention = G.users > 0
    ? Math.min(80, Math.round(G.pmfScore * 0.7))
    : null;
  G.metrics.cac = G.users > 0
    ? Math.round((s.startBudget - G.budget) / Math.max(1, G.users))
    : null;
}

// ── SEGMENT SIGNAL UPDATE ────────────────────────────────
// Research and pivot actions reveal more segment information

function updateSegmentSignals(actionType, pmfDelta) {
  if (actionType === 'research' || actionType === 'pivot') {
    G.segments.forEach(seg => {
      const nudge = Math.floor(Math.random() * 6) + (pmfDelta > 5 ? 3 : 0);
      seg.fit = Math.min(95, seg.fit + nudge);
    });
  }
}

// ── HYPOTHESIS RESOLUTION ────────────────────────────────
// After enough insights, resolve one pending hypothesis

function resolveHypothesis(actionName, pmfDelta) {
  if (G.insights < 3) return;
  const pending = G.hypotheses.filter(h => h.status === 'pending');
  if (pending.length === 0) return;

  // Weight: high pmfDelta = more likely confirmed
  const confirmed = pmfDelta > 4
    ? Math.random() > 0.35
    : Math.random() > 0.65;

  const h = pending[0];
  h.status = confirmed ? 'confirmed' : 'refuted';
  h.result = confirmed
    ? `Validated by ${actionName}`
    : `Contradicted by ${actionName}`;
}

// ── ENDGAME CHECK ────────────────────────────────────────

function checkEndgame() {
  if (G.isOver) return false;
  const outOfTime   = daysLeft() <= 0;
  const outOfMoney  = G.budget <= 0;
  const allUsed     = G.actionsUsed.length >= ACTIONS.length;
  if (outOfTime || outOfMoney || allUsed) {
    G.isOver = true;
    return true;
  }
  return false;
}
