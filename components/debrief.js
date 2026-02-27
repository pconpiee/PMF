// ═══════════════════════════════════════════════════════
// PMF LAB — DEBRIEF COMPONENT
// GAS Framework: Gather / Analyse / Summarise
// This is the highest-evidence intervention in simulation
// education. The debrief IS the learning event.
// Research basis: INACSL Standards, Kapur (2024),
// Mezirow (1990), Ebbinghaus forgetting curve.
// ═══════════════════════════════════════════════════════

function showDebrief() {
  buildDebriefGrade();
  buildDebriefStats();
  buildGatherTimeline();
  buildAnalyseSection();
  buildSummariseSection();

  document.getElementById('debrief-screen').classList.add('open');

  // Scroll to top of debrief
  document.getElementById('debrief-screen').scrollTop = 0;
}

// ── 00 / GRADE BLOCK ─────────────────────────────────────

function buildDebriefGrade() {
  const g = getGrade();

  document.getElementById('db-grade').textContent       = g.grade;
  document.getElementById('db-grade').style.color       = g.color;
  document.getElementById('db-grade-label').textContent = g.label;
  document.getElementById('db-title').textContent       = g.title;
  document.getElementById('db-desc').textContent        = g.desc;
}

// ── STATS ROW ────────────────────────────────────────────

function buildDebriefStats() {
  const g     = getGrade();
  const score = Math.round(G.pmfScore);

  document.getElementById('db-stats').innerHTML = `
    <div class="dstat">
      <div class="dstat-val" style="color:${g.color}">${score}%</div>
      <div class="dstat-label">PMF SCORE</div>
    </div>
    <div class="dstat">
      <div class="dstat-val" style="color:var(--amber)">${G.actionsUsed.length}</div>
      <div class="dstat-label">ACTIONS TAKEN</div>
    </div>
    <div class="dstat">
      <div class="dstat-val" style="color:var(--teal)">${G.insights}</div>
      <div class="dstat-label">INSIGHTS GAINED</div>
    </div>
    <div class="dstat">
      <div class="dstat-val" style="color:var(--blue)">${G.users}</div>
      <div class="dstat-label">USERS ACQUIRED</div>
    </div>
  `;
}

// ── 01 / GATHER — DECISION TIMELINE ──────────────────────
// Shows every action taken, in sequence, with:
// - Day taken
// - Action name and outcome title
// - PMF delta
// - Student's prediction (if they wrote one)

function buildGatherTimeline() {
  const container = document.getElementById('db-timeline');

  if (G.actionHistory.length === 0) {
    container.innerHTML = '<div style="color:#5a5450;font-size:0.82rem;padding:1rem 0">No actions were taken in this run.</div>';
    return;
  }

  container.innerHTML = G.actionHistory.map(entry => {
    const delta    = Math.round(entry.pmfAfter - entry.pmfBefore);
    const deltaStr = fmtDelta(delta);
    const deltaCls = delta > 0 ? 'pos' : delta < 0 ? 'neg' : 'neu';

    const predictionHTML = entry.prediction
      ? `<div class="dt-prediction">
           Predicted: "${entry.prediction}"
         </div>`
      : '';

    return `
      <div class="dt-item">
        <div class="dt-day">D${entry.dayTaken}</div>
        <div class="dt-content">
          <div class="dt-action">${entry.actionName}</div>
          <div class="dt-outcome">${entry.outcome.title}</div>
          ${predictionHTML}
          <span class="dt-delta ${deltaCls}">${deltaStr} PMF</span>
        </div>
      </div>
    `;
  }).join('');
}

// ── 02 / ANALYSE — HYPOTHESIS AUTOPSY ────────────────────
// For each scenario hypothesis:
// - Shows confirmed / refuted / not tested status
// - For refuted: surfaces the gap between prediction and reality
// - Expert analysis at the end

function buildAnalyseSection() {
  buildHypothesisAnalysis();
  buildExpertAnalysis();
}

function buildHypothesisAnalysis() {
  const container = document.getElementById('db-hypothesis-analysis');

  container.innerHTML = G.hypotheses.map(h => {
    const statusClass = h.status === 'confirmed' ? 'has-confirmed'
                      : h.status === 'refuted'   ? 'has-refuted'
                      : 'has-pending';

    const statusLabel = h.status === 'confirmed' ? '✓ CONFIRMED'
                      : h.status === 'refuted'   ? '✗ REFUTED'
                      : '○ NOT TESTED';

    // Find the action history entry that resolved this hypothesis
    const resolvedBy = h.result
      ? G.actionHistory.find(e =>
          h.result.includes(e.actionName)
        )
      : null;

    // Generate insight text based on status
    let insightText = '';
    if (h.status === 'confirmed') {
      insightText = `This assumption held. The market validated it through ${h.result || 'your actions'}. Carry this forward — it\'s a building block of your PMF thesis.`;
    } else if (h.status === 'refuted') {
      insightText = `This assumption was wrong. ${h.result || 'The market contradicted it'}. This is productive failure: you now know what not to build for, and why. The next iteration should start from this corrected premise.`;
    } else {
      insightText = 'You didn\'t gather enough evidence to test this assumption. In a real company, untested assumptions are silent killers — they shape decisions without ever being challenged.';
    }

    return `
      <div class="hyp-analysis-item">
        <div class="hyp-analysis-header">
          <span class="hyp-analysis-status ${statusClass}">${statusLabel}</span>
          <div class="hyp-analysis-text">${h.text}</div>
        </div>
        <div class="hyp-analysis-insight">${insightText}</div>
      </div>
    `;
  }).join('');
}

function buildExpertAnalysis() {
  const container = document.getElementById('db-expert');

  // Build a contextual expert analysis based on what happened
  const score        = Math.round(G.pmfScore);
  const actionsCount = G.actionsUsed.length;
  const usedTypes    = [...new Set(G.actionHistory.map(e => e.actionType))];
  const confirmedHyp = G.hypotheses.filter(h => h.status === 'confirmed').length;
  const refutedHyp   = G.hypotheses.filter(h => h.status === 'refuted').length;
  const bestAction   = G.actionHistory.reduce((best, e) =>
    (e.pmfAfter - e.pmfBefore) > (best.pmfAfter - best.pmfBefore) ? e : best,
    G.actionHistory[0]
  );

  // Scenario-specific expert debrief
  const scenarioDebrief = G.scenario.debrief;

  // Behavioural analysis
  const missingTypes = ['research', 'product', 'channel', 'pivot'].filter(t => !usedTypes.includes(t));
  const balanceNote = missingTypes.length > 0
    ? `You didn't use any ${missingTypes.join(' or ')} actions. In a real PMF search, this is a gap — ${missingTypes[0] === 'research' ? 'understanding the customer must precede building for them' : missingTypes[0] === 'channel' ? 'finding the right customer is as important as building the right product' : 'strategic pivots based on competitive intelligence often unlock the defensible beachhead'}.`
    : 'You balanced research, product, channel, and pivot actions well — this mirrors how successful founders approach early-stage discovery.';

  const hypothesisNote = refutedHyp > 0
    ? `${refutedHyp} of your hypotheses were refuted. This is not failure — it is the mechanism. Kapur's productive failure research shows that students who encounter and resolve incorrect assumptions retain the correct principle 3× more durably than those who were told the answer first.`
    : confirmedHyp > 0
    ? `${confirmedHyp} of your hypotheses were confirmed. Strong start. The next run should stress-test the assumptions you didn\'t get to test.`
    : 'Few hypotheses were resolved this run. More research actions earlier in the sequence would have surfaced the market signal faster.';

  const bestActionNote = bestAction
    ? `Your highest-value action was ${bestAction.actionName} (Day ${bestAction.dayTaken}, +${Math.round(bestAction.pmfAfter - bestAction.pmfBefore)} PMF). Ask yourself: what made this action so valuable at that moment? The answer is the sequencing principle worth carrying into your next run.`
    : '';

  container.textContent = [
    scenarioDebrief,
    '',
    balanceNote,
    '',
    hypothesisNote,
    '',
    bestActionNote
  ].filter(Boolean).join('\n\n');
}

// ── 03 / SUMMARISE — PERSPECTIVE SHIFT ───────────────────
// Student writes their own perspective transformation sentence.
// Research basis: Mezirow (1990) — articulating the shift
// is the final step of transformative learning.
// The act of writing consolidates the changed mental model.

function buildSummariseSection() {
  // Clear any previous input
  const input = document.getElementById('db-perspective-input');
  if (input) input.value = '';

  // The prompt is static HTML in index.html.
  // Nothing to build here — the textarea is ready.
  // We do add a gentle save-on-blur so the text persists
  // if the student scrolls away and comes back.

  if (input) {
    input.addEventListener('blur', () => {
      G.perspectiveNote = input.value;
    });
  }
}

// ── DEBRIEF CLOSE / REPLAY ───────────────────────────────
// These are called by buttons in index.html

function closeDebrief() {
  document.getElementById('debrief-screen').classList.remove('open');
}
