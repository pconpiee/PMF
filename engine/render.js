// ═══════════════════════════════════════════════════════
// PMF LAB — RENDER ENGINE
// All DOM updates live here. Nothing else touches the DOM
// except through these functions.
// Depends on: state.js
// ═══════════════════════════════════════════════════════

// ── MASTER RENDER ────────────────────────────────────────
// Call this after any state change to sync the full UI.

function renderAll() {
  renderTopBar();
  renderPMFMeter();
  renderPhaseCard();
  renderSegments();
  renderHypotheses();
  renderActions();
  renderMetrics();
  renderActivityFeed();
  renderMoveChips();
}

// ── TOPBAR ───────────────────────────────────────────────

function renderTopBar() {
  const left   = daysLeft();
  const pct    = left / G.totalDays;

  // Budget
  const budgetEl = document.getElementById('top-budget');
  budgetEl.textContent = fmtBudget(G.budget);
  budgetEl.className = 'topbar-resource-val mono';
  if (G.budget < G.scenario.startBudget * 0.2) budgetEl.classList.add('danger');
  else if (G.budget < G.scenario.startBudget * 0.4) budgetEl.classList.add('warn');

  // Days
  const daysEl = document.getElementById('top-days');
  daysEl.textContent = left;
  daysEl.className = 'topbar-resource-val mono';
  if (pct < 0.2) daysEl.classList.add('danger');
  else if (pct < 0.4) daysEl.classList.add('warn');

  // Runway bar
  document.getElementById('runway-bar').style.width = Math.max(0, pct * 100) + '%';
}

// ── PMF METER ────────────────────────────────────────────

function renderPMFMeter() {
  const score = Math.min(100, Math.round(G.pmfScore));

  document.getElementById('pmf-big').textContent = score + '%';
  document.getElementById('pmf-bar-fill').style.width = score + '%';

  // Colour by score
  const bigEl = document.getElementById('pmf-big');
  if (score >= 60)      bigEl.style.color = 'var(--good)';
  else if (score >= 30) bigEl.style.color = 'var(--amber)';
  else                  bigEl.style.color = 'var(--bad)';

  // Phase name
  const phase = getPhase();
  document.getElementById('pmf-phase-name').textContent = PHASES[phase];
}

// ── PHASE CONTEXT CARD ───────────────────────────────────

function renderPhaseCard() {
  const phase = getPhase();
  const s = G.scenario;

  document.getElementById('ctx-eyebrow').textContent = `PHASE ${phase + 1} OF 5 · ${PHASES[phase].toUpperCase()}`;
  document.getElementById('ctx-phase').textContent   = PHASES[phase];
  document.getElementById('ctx-body').textContent    = s.phaseContext[phase];

  // Progress pips
  const pipsEl = document.getElementById('ctx-pips');
  pipsEl.innerHTML = PHASES.map((_, i) => {
    let cls = '';
    if (i < phase)  cls = 'done';
    if (i === phase) cls = 'active';
    return `<div class="context-pip ${cls}"></div>`;
  }).join('');
}

// ── SEGMENTS ─────────────────────────────────────────────

function renderSegments() {
  const container = document.getElementById('segments-list');
  container.innerHTML = '';

  // Find highest fit segment to highlight
  const maxFit = Math.max(...G.segments.map(s => s.fit));

  G.segments.forEach(seg => {
    const isHot = seg.fit === maxFit && seg.fit > 50;
    const fitClass = seg.fit < 35 ? 'fit-cold' : seg.fit < 65 ? 'fit-warm' : 'fit-hot';

    const card = document.createElement('div');
    card.className = `seg-card ${isHot ? 'hot' : ''}`;
    card.innerHTML = `
      <div class="seg-card-top">
        <div class="seg-name">${seg.name}</div>
        <div class="seg-wtp">${seg.wtp}</div>
      </div>
      <div class="seg-pain">${seg.pain} · ${seg.size}</div>
      <div class="seg-fit-row">
        <div class="seg-fit-track">
          <div class="seg-fit-fill ${fitClass}" style="width:${seg.fit}%"></div>
        </div>
        <div class="seg-fit-pct">${seg.fit}%</div>
      </div>
    `;
    container.appendChild(card);
  });
}

// ── HYPOTHESES ───────────────────────────────────────────

function renderHypotheses() {
  const container = document.getElementById('hypothesis-list');
  container.innerHTML = '';

  G.hypotheses.forEach(h => {
    const item = document.createElement('div');
    item.className = `hyp-item ${h.status !== 'pending' ? h.status : ''}`;

    const iconClass = h.status === 'confirmed' ? 'c'
                    : h.status === 'refuted'   ? 'r'
                    : 'p';
    const iconChar  = h.status === 'confirmed' ? '✓'
                    : h.status === 'refuted'   ? '✗'
                    : '?';

    item.innerHTML = `
      <div class="hyp-icon ${iconClass}">${iconChar}</div>
      <div>
        <div class="hyp-text">${h.text}</div>
        ${h.result ? `<div class="hyp-result">${h.result}</div>` : ''}
      </div>
    `;
    container.appendChild(item);
  });
}

// ── ACTION GRID ──────────────────────────────────────────

function renderActions() {
  const grid     = document.getElementById('action-grid');
  const subtitle = document.getElementById('actions-subtitle');
  const left     = daysLeft();

  const remaining = ACTIONS.filter(a => !isActionUsed(a.id)).length;
  subtitle.textContent = `${remaining} actions remaining · ${left} days · ${fmtBudget(G.budget)} left`;

  grid.innerHTML = '';

  ACTIONS.forEach(action => {
    const used       = isActionUsed(action.id);
    const affordable = canAfford(action);
    const hidden     = G.activeFilter !== 'all' && action.type !== G.activeFilter;

    const card = document.createElement('div');
    card.className = [
      'action-card',
      `t-${action.type}`,
      used       ? 'used'        : '',
      !affordable && !used ? 'cant-afford' : '',
      hidden     ? 'hidden'      : ''
    ].filter(Boolean).join(' ');

    card.dataset.actionId = action.id;
    card.dataset.type     = action.type;

    if (!used && affordable) {
      card.onclick = () => selectAction(action.id);
    }

    const tagClass = {
      research: 'tag-research',
      product:  'tag-product',
      channel:  'tag-channel',
      pivot:    'tag-pivot'
    }[action.type];

    card.innerHTML = `
      <div class="action-type-row">
        <span class="action-type-tag ${tagClass}">${action.type.toUpperCase()}</span>
        ${used ? '<span class="action-used-badge">USED</span>' : ''}
        ${!affordable && !used ? '<span class="action-used-badge" style="color:var(--bad)">INSUFFICIENT RESOURCES</span>' : ''}
      </div>
      <div class="action-name">${action.name}</div>
      <div class="action-desc">${action.desc}</div>
      <div class="action-costs">
        <span class="cost-tag cost-t">⏱ ${action.timeCost}d</span>
        <span class="cost-tag cost-b">${fmtBudget(action.budgetCost)}</span>
        <span class="cost-tag cost-i">+${action.insightGain} insights</span>
      </div>
    `;

    grid.appendChild(card);
  });
}

// ── MOVE CHIPS ───────────────────────────────────────────

function renderMoveChips() {
  const container = document.getElementById('move-chips');
  container.innerHTML = '';

  if (G.actionHistory.length === 0) {
    container.innerHTML = '<span style="font-family:\'IBM Plex Mono\',monospace;font-size:0.62rem;color:var(--pale)">No actions taken yet</span>';
    return;
  }

  G.actionHistory.forEach(entry => {
    const chip = document.createElement('div');
    chip.className = `move-chip chip-${entry.actionType}`;
    chip.textContent = entry.actionName;
    chip.title = `Day ${entry.dayTaken} · PMF ${Math.round(entry.pmfBefore)}% → ${Math.round(entry.pmfAfter)}%`;
    container.appendChild(chip);
  });
}

// ── METRICS ──────────────────────────────────────────────

function renderMetrics() {
  const container = document.getElementById('metrics-list');
  const m = G.metrics;

  const rows = [
    {
      name: 'PMF Score',
      val: Math.round(G.pmfScore) + '%',
      cls: G.pmfScore >= 60 ? 'up' : G.pmfScore >= 30 ? 'flat' : ''
    },
    {
      name: 'MRR',
      val: m.mrr > 0 ? fmtBudget(m.mrr) : '—',
      cls: m.mrr > 0 ? 'up' : 'flat'
    },
    {
      name: 'D30 Retention',
      val: m.d30retention !== null ? m.d30retention + '%' : '—',
      cls: m.d30retention > 40 ? 'up' : 'flat'
    },
    {
      name: 'NPS',
      val: m.nps !== null ? (m.nps > 0 ? '+' : '') + m.nps : '—',
      cls: m.nps > 30 ? 'up' : 'flat'
    },
    {
      name: 'CAC',
      val: m.cac ? fmtBudget(m.cac) : '—',
      cls: 'flat'
    },
    {
      name: 'Active Users',
      val: G.users,
      cls: G.users > 10 ? 'up' : 'flat'
    },
    {
      name: 'Insights',
      val: G.insights,
      cls: 'up'
    },
    {
      name: 'Day',
      val: G.day + ' / ' + G.totalDays,
      cls: 'flat'
    }
  ];

  container.innerHTML = rows.map(r => `
    <div class="metric-item">
      <span class="metric-name">${r.name}</span>
      <span class="metric-val ${r.cls}">${r.val}</span>
    </div>
  `).join('');
}

// ── ACTIVITY FEED ─────────────────────────────────────────

function renderActivityFeed() {
  const container = document.getElementById('activity-feed');

  if (G.activityLog.length === 0) {
    container.innerHTML = '<div style="font-size:0.78rem;color:var(--pale);padding:0.5rem 0">Activity will appear here as you play.</div>';
    return;
  }

  // Show last 8 entries, newest first
  const recent = [...G.activityLog].reverse().slice(0, 8);

  container.innerHTML = recent.map(item => `
    <div class="feed-item ${item.type}">
      <div class="feed-day">Day ${item.day}</div>
      ${item.text}
    </div>
  `).join('');
}
