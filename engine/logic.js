// ═══════════════════════════════════════════════════════
// PMF LAB — GAME LOGIC v2
// Consequence engine: outcomes now respond to game state.
// What you did before, when you did it, and how much
// runway you have left all affect what happens next.
// ═══════════════════════════════════════════════════════

// ── STAGING CONSTANTS ────────────────────────────────────
// Early / Middle / Late game thresholds
const STAGE = {
  EARLY:  { maxDay: 30,  maxPmf: 25 },
  MIDDLE: { maxDay: 60,  maxPmf: 55 },
  // Late = everything beyond middle
};

function getStage() {
  if (G.day <= STAGE.EARLY.maxDay && G.pmfScore <= STAGE.EARLY.maxPmf) return 'early';
  if (G.day <= STAGE.MIDDLE.maxDay && G.pmfScore <= STAGE.MIDDLE.maxPmf) return 'middle';
  return 'late';
}

// ── CONSEQUENCE ENGINE ───────────────────────────────────
// Returns a multiplier (0.0 – 2.0) applied to pmfDelta.
// Called every time an action resolves.

function computeModifier(action, recentHistory) {
  let modifier = 1.0;
  const stage  = getStage();
  const type   = action.type;
  const lastIds = recentHistory.slice(-3).map(e => e.actionId);
  const last2   = recentHistory.slice(-2).map(e => e.actionType);
  const allTypes = recentHistory.map(e => e.actionType);
  const researchCount  = allTypes.filter(t => t === 'research').length;
  const productCount   = allTypes.filter(t => t === 'product').length;

  // ── STAGING MODIFIERS ──────────────────────────────────
  // Research is most valuable early. Scale is most valuable late.
  if (stage === 'early') {
    if (type === 'research') modifier *= 1.5;
    if (type === 'product')  modifier *= 0.6;
    if (type === 'channel')  modifier *= 0.4;
  }
  if (stage === 'middle') {
    if (type === 'research') modifier *= 0.8;
    if (type === 'product')  modifier *= 1.0;
    if (type === 'channel')  modifier *= 1.0;
  }
  if (stage === 'late') {
    if (type === 'research') modifier *= 0.4;
    if (type === 'channel')  modifier *= 1.5;
    if (type === 'pivot')    modifier *= 1.3;
  }

  // ── DISCOVERY BONUS ────────────────────────────────────
  // Research before any product action = market rewards learning first
  if (type === 'research' && productCount === 0) {
    modifier *= 1.3;
    logActivity('learn', 'Discovery bonus: researching before building earns richer signal.');
  }

  // ── MVP WITHOUT DISCOVERY PENALTY ─────────────────────
  // Building before talking to customers is a classic mistake
  if (action.id === 'mvp_build' && researchCount < 2) {
    modifier *= 0.5;
    logActivity('warn', 'Building before discovery: MVP delta halved. Talk to customers first.');
  }

  // ── COMPETITIVE CLOCK ──────────────────────────────────
  // Pressure in late game reduces all PMF gains
  const daysRemaining = daysLeft();
  const runwayPct = daysRemaining / G.totalDays;
  if (runwayPct < 0.2) {
    modifier *= 0.85;
    logActivity('warn', 'Runway below 20%: competitive clock is slowing your PMF gains.');
  }

  // ── BUDGET STRESS ──────────────────────────────────────
  const budgetPct = G.budget / G.scenario.startBudget;
  if (budgetPct < 0.2 && type === 'product') {
    modifier *= 0.7;
    logActivity('warn', 'Budget stress: product actions cost more when runway is tight.');
  }

  // ── DIMINISHING RETURNS ────────────────────────────────
  // Same action type 3+ times in a row loses effectiveness
  if (last2.length >= 2 && last2.every(t => t === type)) {
    modifier *= 0.75;
    logActivity('warn', `Diminishing returns: ${type} actions back-to-back are losing effectiveness.`);
  }

  // ── POWER COMBOS ──────────────────────────────────────
  // Sequences that produce multiplicative effects

  // Combo 1: interviews → pricing_experiment → mvp_build
  if (action.id === 'mvp_build' &&
      lastIds.includes('customer_interview') &&
      lastIds.includes('pricing_experiment')) {
    modifier *= 1.35;
    logActivity('learn', 'Power combo: Discovery → Pricing → Build. +35% PMF delta. Ideal sequence.');
  }

  // Combo 2: landing_page → channel_test
  if (action.id === 'channel_test' &&
      lastIds.includes('landing_page')) {
    modifier *= 1.25;
    logActivity('learn', 'Power combo: Landing Page → Channel Test. Warm audience = better signal.');
  }

  // Combo 3: cohort_analysis → mvp_build (retention before growth)
  if (action.id === 'mvp_build' &&
      lastIds.includes('cohort_analysis')) {
    modifier *= 1.2;
    logActivity('learn', 'Power combo: Retention data informed your build. +20% to MVP delta.');
  }

  // Combo 4: competitive_pivot after customer_interview
  if (action.id === 'competitive_pivot' &&
      lastIds.includes('customer_interview')) {
    modifier *= 1.3;
    logActivity('learn', 'Power combo: Customer data → Pivot. Intelligence-led repositioning. +30%.');
  }

  // Combo 5: channel_test → partner_channel
  if (action.id === 'partner_channel' &&
      lastIds.includes('channel_test')) {
    modifier *= 1.25;
    logActivity('learn', 'Power combo: You know what channel works. Now scale it via partners. +25%.');
  }

  // ── ANTI-PATTERNS ─────────────────────────────────────
  // Sequences that reflect real startup mistakes

  // Anti 1: paid marketing before landing page / channel test
  if (action.id === 'channel_test' &&
      G.actionsUsed.includes('channel_test') &&
      !G.actionsUsed.includes('landing_page')) {
    modifier *= 0.6;
    logActivity('warn', 'Anti-pattern: scaling spend before validating message. CAC destroyed.');
  }

  // Anti 2: PR campaign before PMF score > 40
  if (action.id === 'landing_page' &&
      G.pmfScore < 40 &&
      G.actionsUsed.includes('channel_test')) {
    // This catches premature scaling pattern
    modifier *= 0.7;
    logActivity('warn', 'Anti-pattern: amplifying before fit. Users arrive and churn. Net negative.');
  }

  // Anti 3: pivot without any research
  if (action.id === 'competitive_pivot' && researchCount < 2) {
    modifier *= 0.55;
    logActivity('warn', 'Anti-pattern: pivoting on gut feel without customer data. High risk.');
  }

  // Anti 4: three same-type actions in a row (stronger penalty)
  const last3Types = recentHistory.slice(-3).map(e => e.actionType);
  if (last3Types.length === 3 && last3Types.every(t => t === type)) {
    modifier *= 0.6;
    logActivity('warn', `Anti-pattern: three ${type} actions in a row. You're stuck in a loop.`);
  }

  // Anti 5: partner_channel before mvp_build
  if (action.id === 'partner_channel' &&
      !G.actionsUsed.includes('mvp_build')) {
    modifier *= 0.5;
    logActivity('warn', 'Anti-pattern: building partnerships before you have a product to partner around.');
  }

  // ── CAP ───────────────────────────────────────────────
  // Never let modifier go below 0.1 or above 2.0
  return Math.max(0.1, Math.min(2.0, modifier));
}

// ── ACTION SELECTION ─────────────────────────────────────

function selectAction(actionId) {
  const action = ACTIONS.find(a => a.id === actionId);
  if (!action) return;
  if (isActionUsed(actionId)) return;
  if (!canAfford(action)) {
    flashAffordWarning(actionId);
    return;
  }
  G.pendingAction = action;
  G.pendingPrediction = '';
  openHypothesisGate(action);
}

// ── HYPOTHESIS GATE ──────────────────────────────────────

function openHypothesisGate(action) {
  const typeLabels = {
    research: 'Research', product: 'Product',
    channel: 'Channel', pivot: 'Pivot'
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

  // Compute consequence modifier from game state
  const modifier = computeModifier(action, G.actionHistory);

  // Apply modifier to PMF delta
  const rawDelta      = outcome.pmfDelta;
  const modifiedDelta = Math.round(rawDelta * modifier);

  // Snapshot before
  const pmfBefore = G.pmfScore;

  // Apply state changes
  G.day      += action.timeCost;
  G.budget    = Math.max(0, G.budget - action.budgetCost);

  // Apply burn rate for days elapsed
  const burnCost = action.timeCost * G.scenario.dailyBurn;
  G.budget = Math.max(0, G.budget - burnCost);

  G.pmfScore  = Math.min(100, Math.max(0, G.pmfScore + modifiedDelta));
  G.insights += action.insightGain + (outcome.insights || 0);
  G.users    += outcome.users || 0;

  // Record
  G.actionsUsed.push(action.id);
  G.actionHistory.push({
    actionId:    action.id,
    actionName:  action.name,
    actionType:  action.type,
    outcome:     outcome,
    rawDelta:    rawDelta,
    modifier:    Math.round(modifier * 100),
    modifiedDelta,
    prediction,
    dayTaken:    G.day,
    pmfBefore,
    pmfAfter:    G.pmfScore
  });

  // Side effects
  updateMetrics();
  updateSegmentSignals(action.type, modifiedDelta);
  resolveHypothesis(action.name, modifiedDelta);

  // Activity log
  logActivity('do', `${action.name}: ${outcome.title}`);
  if (modifier > 1.2) logActivity('learn', `Context bonus ×${Math.round(modifier*100)}%: sequencing rewarded.`);
  if (modifier < 0.7) logActivity('warn', `Context penalty ×${Math.round(modifier*100)}%: sequencing cost you.`);
  if (modifiedDelta > 5)  logActivity('good', `PMF +${modifiedDelta}pts → ${Math.round(G.pmfScore)}%`);
  if (modifiedDelta < 0)  logActivity('warn', `PMF dropped ${Math.abs(modifiedDelta)}pts`);

  // Check failure states before showing outcome
  const failure = checkFailureStates();
  if (failure) {
    showOutcomeModal(action, outcome, prediction, modifiedDelta, modifier);
    return;
  }

  showOutcomeModal(action, outcome, prediction, modifiedDelta, modifier);
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

// ── FAILURE STATE DETECTION ──────────────────────────────

function checkFailureStates() {
  if (G.isOver) return null;

  // Failure 1: Runway Exhaustion
  if (G.budget <= 0) {
    G.isOver = true;
    G.failureMode = 'runway';
    setTimeout(() => showDebrief(), 800);
    return 'runway';
  }

  // Failure 2: Out of time
  if (daysLeft() <= 0) {
    G.isOver = true;
    G.failureMode = 'time';
    setTimeout(() => showDebrief(), 800);
    return 'time';
  }

  // Failure 3: Premature Scaling
  // Channel spend > 30% of budget with retention < 20%
  const channelSpend = G.actionHistory
    .filter(e => e.actionType === 'channel')
    .reduce((sum, e) => {
      const action = ACTIONS.find(a => a.id === e.actionId);
      return sum + (action ? action.budgetCost : 0);
    }, 0);
  const budgetSpentOnChannel = channelSpend / G.scenario.startBudget;
  const retention = G.metrics.d30retention || 0;

  if (budgetSpentOnChannel > 0.3 && retention < 20 && G.users > 5) {
    G.isOver = true;
    G.failureMode = 'premature_scaling';
    logActivity('warn', 'CRITICAL: Scaling before retention is proven. Users are churning faster than you acquire them.');
    setTimeout(() => showDebrief(), 800);
    return 'premature_scaling';
  }

  return null;
}

// ── OUTCOME MODAL ────────────────────────────────────────

function showOutcomeModal(action, outcome, prediction, modifiedDelta, modifier) {
  const tagClasses = {
    research: 'tag-research', product: 'tag-product',
    channel: 'tag-channel', pivot: 'tag-pivot'
  };

  const typeTag = document.getElementById('om-type-tag');
  typeTag.textContent = action.type.toUpperCase();
  typeTag.className   = `outcome-action-tag ${tagClasses[action.type]}`;
  document.getElementById('om-action-name').textContent = action.name;
  document.getElementById('om-icon').textContent        = outcome.icon;
  document.getElementById('om-title').textContent       = outcome.title;
  document.getElementById('om-body').textContent        = outcome.body;

  // Prediction
  const predSection = document.getElementById('om-prediction-section');
  if (prediction && prediction.length > 0) {
    predSection.style.display = 'block';
    document.getElementById('om-prediction-text').textContent =
      'I chose this because I believed… ' + prediction;
  } else {
    predSection.style.display = 'none';
  }

  // Show modifier if significant
  const modifierNote = document.getElementById('om-modifier-note');
  if (modifierNote) {
    if (modifier > 1.15 || modifier < 0.85) {
      const pct   = Math.round(modifier * 100);
      const dir   = modifier > 1 ? '▲' : '▼';
      const color = modifier > 1 ? 'var(--good)' : 'var(--bad)';
      modifierNote.style.display = 'block';
      modifierNote.style.color   = color;
      modifierNote.textContent   = `${dir} Sequencing modifier: ×${pct}% applied to this outcome`;
    } else {
      modifierNote.style.display = 'none';
    }
  }

  // Stats — show both raw and modified delta if they differ
  const deltaColor = modifiedDelta > 0 ? 'var(--good)' : modifiedDelta < 0 ? 'var(--bad)' : 'var(--mid)';
  const deltaDisplay = modifier !== 1.0 && Math.abs(modifier - 1.0) > 0.1
    ? `${fmtDelta(modifiedDelta)} <span style="font-size:0.75em;color:var(--mid)">(base ${fmtDelta(outcome.pmfDelta)})</span>`
    : fmtDelta(modifiedDelta);

  document.getElementById('om-stats').innerHTML = `
    <div class="outcome-stat">
      <div class="ostat-val" style="color:${deltaColor}">${fmtDelta(modifiedDelta)}</div>
      <div class="ostat-label">PMF SCORE</div>
    </div>
    <div class="outcome-stat">
      <div class="ostat-val" style="color:var(--bad)">−${fmtBudget(action.budgetCost + action.timeCost * G.scenario.dailyBurn)}</div>
      <div class="ostat-label">TOTAL COST</div>
    </div>
    <div class="outcome-stat">
      <div class="ostat-val" style="color:var(--teal)">+${action.insightGain + (outcome.insights || 0)}</div>
      <div class="ostat-label">INSIGHTS</div>
    </div>
  `;

  document.getElementById('om-learning').textContent  = outcome.learning;
  document.getElementById('om-progress').textContent  =
    `Day ${G.day} of ${G.totalDays} · ${fmtBudget(G.budget)} remaining · PMF ${Math.round(G.pmfScore)}%`;

  document.getElementById('outcome-modal').classList.add('open');
}

function closeOutcome() {
  document.getElementById('outcome-modal').classList.remove('open');
  G.pendingAction = null;
  renderAll();

  if (!G.isOver && checkEndgame()) {
    setTimeout(showDebrief, 700);
  }
}

// ── FILTER ───────────────────────────────────────────────

function filterActions(type, btn) {
  G.activeFilter = type;
  document.querySelectorAll('.type-tab').forEach(t => { t.className = 'type-tab'; });
  btn.classList.add(`active-${type}`);
  document.querySelectorAll('.action-card').forEach(card => {
    const cardType = card.dataset.type;
    card.classList.toggle('hidden', type !== 'all' && cardType !== type);
  });
}

// ── FLASH AFFORD WARNING ─────────────────────────────────

function flashAffordWarning(actionId) {
  const card = document.querySelector(`[data-action-id="${actionId}"]`);
  if (!card) return;
  card.style.borderColor = 'var(--bad)';
  setTimeout(() => { card.style.borderColor = ''; }, 600);
}

// ── ENDGAME CHECK ────────────────────────────────────────

function checkEndgame() {
  if (G.isOver) return false;
  const outOfTime  = daysLeft() <= 0;
  const outOfMoney = G.budget <= 0;
  const allUsed    = G.actionsUsed.length >= ACTIONS.length;
  if (outOfTime || outOfMoney || allUsed) {
    G.isOver = true;
    return true;
  }
  return false;
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
  document.getElementById('splash').classList.add('out');
  setTimeout(() => {
    document.getElementById('splash').style.display = 'none';
    document.getElementById('app').classList.add('visible');
  }, 600);
  document.getElementById('top-scenario').textContent =
    G.scenario.name + ' · ' + G.scenario.sector;
  renderAll();
  logActivity('do',
    `Simulation started. Budget: ${fmtBudget(G.budget)}. ${G.totalDays} days. Burn: ${fmtBudget(G.scenario.dailyBurn)}/day. Find PMF.`
  );
  renderActivityFeed();
}

function selectScenario(scenarioId, cardEl) {
  document.querySelectorAll('.sc-card').forEach(c => c.classList.remove('selected'));
  cardEl.classList.add('selected');
  G.scenario = SCENARIOS.find(s => s.id === scenarioId);
  const btn = document.getElementById('launch-btn');
  btn.disabled = false;
  btn.textContent = `Begin ${G.scenario.name} →`;
}

function initSplash() {
  const grid = document.getElementById('scenario-grid');
  grid.innerHTML = '';
  SCENARIOS.forEach(scenario => {
    const card = document.createElement('div');
    card.className = 'sc-card';
    card.onclick   = () => selectScenario(scenario.id, card);
    const pips = Array.from({ length: 3 }, (_, i) =>
      `<div class="diff-pip ${i < scenario.difficulty ? 'on' : ''}"></div>`
    ).join('');
    const diffLabel = ['', 'Introductory', 'Intermediate', 'Advanced'][scenario.difficulty];
    card.innerHTML = `
      <div class="sc-sector">${scenario.sector}</div>
      <div class="sc-name">${scenario.name}</div>
      <div class="sc-desc">${scenario.desc}</div>
      <div class="sc-diff">${pips}<span style="margin-left:0.4rem">${diffLabel}</span></div>
    `;
    grid.appendChild(card);
  });
}
