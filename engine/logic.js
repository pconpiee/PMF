// ═══════════════════════════════════════════════════════
// PMF LAB — GAME LOGIC
// Action execution, hypothesis gate, endgame trigger.
// Depends on: state.js, render.js
// ═══════════════════════════════════════════════════════

// ── ACTION SELECTION ─────────────────────────────────────
// Called when player clicks an action card.
// Opens the hypothesis gate before executing.

function selectAction(actionId) {
  const action = ACTIONS.find(a => a.id === actionId);
  if (!action) return;

  // Guard: already used
  if (isActionUsed(actionId)) return;

  // Guard: can't afford
  if (!canAfford(action)) {
    flashAffordWarning(actionId);
    return;
  }

  // Store pending action and open hypothesis gate
  G.pendingAction = action;
  G.pendingPrediction = '';
  openHypothesisGate(action);
}

// ── HYPOTHESIS GATE ──────────────────────────────────────

function openHypothesisGate(action) {
  const typeLabels = {
    research: 'Research',
    product:  'Product',
    channel:  'Channel',
    pivot:    'Pivot'
  };

  document.getElementById('hg-action-desc').textContent =
    `${typeLabels[action.type]} · ${action.name} — ${action.desc}`;
  document.getElementById('hg-input').value = '';
  document.getElementById('hypothesis-gate').classList.add('open');
  setTimeout(() => document.getElementById('hg-input').focus(), 100);
}

function closeHypothesisGate() {
  document.getElementById('hypothesis-gate').classList.remove('open');
  document.getElementById('hg-input').value = '';
}

// Called by both "Execute Action" and "Skip for now" buttons
function confirmAction(skipped) {
  if (!G.pendingAction) return;

  G.pendingPrediction = skipped
    ? ''
    : (document.getElementById('hg-input').value.trim() || '');

  closeHypothesisGate();
  executeAction(G.pendingAction, G.pendingPrediction);
}

// ── ACTION EXECUTION ─────────────────────────────────────

function executeAction(action, prediction) {
  // Roll weighted outcome
  const outcome = rollOutcome(action.outcomes);

  // Snapshot PMF before
  const pmfBefore = G.pmfScore;

  // Apply state changes
  G.day     += action.timeCost;
  G.budget   = Math.max(0, G.budget - action.budgetCost);
  G.pmfScore = Math.min(100, Math.max(0, G.pmfScore + outcome.pmfDelta));
  G.insights += action.insightGain + (outcome.insights || 0);
  G.users    += outcome.users || 0;

  // Record to history
  G.actionsUsed.push(action.id);
  G.actionHistory.push({
    actionId:   action.id,
    actionName: action.name,
    actionType: action.type,
    outcome:    outcome,
    prediction: prediction,
    dayTaken:   G.day,
    pmfBefore:  pmfBefore,
    pmfAfter:   G.pmfScore
  });

  // Side effects
  updateMetrics();
  updateSegmentSignals(action.type, outcome.pmfDelta);
  resolveHypothesis(action.name, outcome.pmfDelta);

  // Activity log
  logActivity('do', `${action.name}: ${outcome.title}`);
  if (outcome.pmfDelta > 5)  logActivity('good', `PMF +${outcome.pmfDelta}pts → ${Math.round(G.pmfScore)}%`);
  if (outcome.pmfDelta < 0)  logActivity('warn', `PMF dropped ${Math.abs(outcome.pmfDelta)}pts`);
  if (outcome.pmfDelta >= 10) logActivity('learn', `Strong signal: ${outcome.title}`);

  // Show outcome modal
  showOutcomeModal(action, outcome, prediction);
}

// ── OUTCOME ROLLER ───────────────────────────────────────

function rollOutcome(outcomes) {
  const roll = Math.random() * 100;
  let cumulative = 0;
  for (const o of outcomes) {
    cumulative += o.weight;
    if (roll < cumulative) return o;
  }
  return outcomes[outcomes.length - 1];
}

// ── OUTCOME MODAL ────────────────────────────────────────

function showOutcomeModal(action, outcome, prediction) {
  const typeColors = {
    research: 'var(--teal)',
    product:  'var(--blue)',
    channel:  'var(--amber)',
    pivot:    'var(--rose)'
  };
  const tagClasses = {
    research: 'tag-research',
    product:  'tag-product',
    channel:  'tag-channel',
    pivot:    'tag-pivot'
  };

  // Header
  const typeTag = document.getElementById('om-type-tag');
  typeTag.textContent = action.type.toUpperCase();
  typeTag.className = `outcome-action-tag ${tagClasses[action.type]}`;
  document.getElementById('om-action-name').textContent = action.name;
  document.getElementById('om-icon').textContent  = outcome.icon;
  document.getElementById('om-title').textContent = outcome.title;
  document.getElementById('om-body').textContent  = outcome.body;

  // Prediction section
  const predSection = document.getElementById('om-prediction-section');
  if (prediction && prediction.length > 0) {
    predSection.style.display = 'block';
    document.getElementById('om-prediction-text').textContent =
      'I chose this because I believed… ' + prediction;
  } else {
    predSection.style.display = 'none';
  }

  // Stats
  const delta = outcome.pmfDelta;
  const deltaColor = delta > 0
    ? 'var(--good)'
    : delta < 0 ? 'var(--bad)' : 'var(--mid)';

  document.getElementById('om-stats').innerHTML = `
    <div class="outcome-stat">
      <div class="ostat-val" style="color:${deltaColor}">${fmtDelta(delta)}</div>
      <div class="ostat-label">PMF SCORE</div>
    </div>
    <div class="outcome-stat">
      <div class="ostat-val" style="color:var(--bad)">−${fmtBudget(action.budgetCost)}</div>
      <div class="ostat-label">BUDGET SPENT</div>
    </div>
    <div class="outcome-stat">
      <div class="ostat-val" style="color:var(--teal)">+${action.insightGain + (outcome.insights || 0)}</div>
      <div class="ostat-label">INSIGHTS</div>
    </div>
  `;

  // Learning principle
  document.getElementById('om-learning').textContent = outcome.learning;

  // Progress line
  document.getElementById('om-progress').textContent =
    `Day ${G.day} of ${G.totalDays} · ${G.actionsUsed.length} actions taken`;

  // Open modal
  document.getElementById('outcome-modal').classList.add('open');
}

function closeOutcome() {
  document.getElementById('outcome-modal').classList.remove('open');
  G.pendingAction = null;

  // Re-render game board
  renderAll();

  // Check if game should end
  if (checkEndgame()) {
    setTimeout(showDebrief, 700);
  }
}

// ── FILTER ───────────────────────────────────────────────

function filterActions(type, btn) {
  G.activeFilter = type;

  // Update tab styles
  document.querySelectorAll('.type-tab').forEach(t => {
    t.className = 'type-tab';
  });
  btn.classList.add(`active-${type}`);

  // Show/hide cards
  document.querySelectorAll('.action-card').forEach(card => {
    const cardType = card.dataset.type;
    if (type === 'all' || cardType === type) {
      card.classList.remove('hidden');
    } else {
      card.classList.add('hidden');
    }
  });
}

// ── FLASH AFFORD WARNING ─────────────────────────────────

function flashAffordWarning(actionId) {
  const card = document.querySelector(`[data-action-id="${actionId}"]`);
  if (!card) return;
  card.style.transition = 'border-color 0.1s';
  card.style.borderColor = 'var(--bad)';
  setTimeout(() => {
    card.style.borderColor = '';
  }, 600);
}

// ── REPLAY / NEW GAME ────────────────────────────────────

function replayScenario() {
  const scenario = G.scenario;
  resetState(scenario);
  document.getElementById('debrief-screen').classList.remove('open');
  renderAll();
  logActivity('do', `Replaying ${scenario.name}. Apply what you learned.`);
}

function startGame() {
  if (!G.scenario) return;
  resetState(G.scenario);

  // Hide splash, show app
  document.getElementById('splash').classList.add('out');
  setTimeout(() => {
    document.getElementById('splash').style.display = 'none';
    document.getElementById('app').classList.add('visible');
  }, 600);

  // Set topbar scenario label
  document.getElementById('top-scenario').textContent =
    G.scenario.name + ' · ' + G.scenario.sector;

  // Initial render
  renderAll();

  // First activity entry
  logActivity('do',
    `Simulation started. Budget: ${fmtBudget(G.budget)}. ${G.totalDays} days. Find PMF.`
  );
  renderActivityFeed();
}

// ── SCENARIO SELECTION ───────────────────────────────────

function selectScenario(scenarioId, cardEl) {
  // Deselect all cards
  document.querySelectorAll('.sc-card').forEach(c => c.classList.remove('selected'));

  // Select this card
  cardEl.classList.add('selected');

  // Set scenario in state
  G.scenario = SCENARIOS.find(s => s.id === scenarioId);

  // Enable launch button
  const btn = document.getElementById('launch-btn');
  btn.disabled = false;
  btn.textContent = `Begin ${G.scenario.name} →`;
}

// ── INIT SPLASH ──────────────────────────────────────────

function initSplash() {
  const grid = document.getElementById('scenario-grid');
  grid.innerHTML = '';

  SCENARIOS.forEach(scenario => {
    const card = document.createElement('div');
    card.className = 'sc-card';
    card.onclick = () => selectScenario(scenario.id, card);

    // Difficulty pips
    const pips = Array.from({ length: 3 }, (_, i) =>
      `<div class="diff-pip ${i < scenario.difficulty ? 'on' : ''}"></div>`
    ).join('');

    const diffLabel = ['', 'Introductory', 'Intermediate', 'Advanced'][scenario.difficulty];

    card.innerHTML = `
      <div class="sc-sector">${scenario.sector}</div>
      <div class="sc-name">${scenario.name}</div>
      <div class="sc-desc">${scenario.desc}</div>
      <div class="sc-diff">
        ${pips}
        <span style="margin-left:0.4rem">${diffLabel}</span>
      </div>
    `;

    grid.appendChild(card);
  });
}
