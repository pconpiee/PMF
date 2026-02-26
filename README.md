# PMF Lab

A simulation game that teaches product-market fit to Masters-level entrepreneurship and business students.

## What It Is

PMF Lab places students in the role of a founding CEO navigating the pre-PMF stage of a startup. They make real resource-constrained decisions — customer discovery, product strategy, channel selection, competitive positioning — and experience the probabilistic consequences of those choices.

It is not a lecture about PMF. It is not a case study about PMF. It is a structured experience of searching for PMF, failing, learning why, and trying again.

## Learning Science Foundation

Every design decision traces to a specific research principle:

- **Productive Failure** (Kapur, 2024) — students act before seeing the theory, 3× greater transfer learning
- **GAS Debrief Framework** — Gather / Analyse / Summarise, the highest-evidence debrief structure in simulation education
- **Hypothesis Gate** — students state their prediction before every action; the gap between prediction and outcome is the learning mechanism
- **Desirable Difficulty** (Bjork) — probabilistic outcomes prevent pattern memorisation
- **Spaced Repetition** — three scenarios of increasing complexity designed for replay

## The Three Scenarios

| Scenario | Sector | Difficulty | Budget | Days |
|----------|--------|------------|--------|------|
| **Clearfund** | Fintech · B2C/SMB | ★☆☆ | £300K | 90 |
| **HealthOS** | Healthtech · B2B SaaS | ★★☆ | £500K | 120 |
| **Carbonix** | Deeptech · Enterprise | ★★★ | £2M | 180 |

## Core PMF Concepts Taught

- User ≠ Buyer (B2B Decision-Making Unit)
- Segment by pain intensity × WTP × urgency, not demographics
- Channel-market fit is a separate problem from product-market fit
- The 40% Very Disappointed test (Sean Ellis / Superhuman)
- PMF as a maintained state, not a one-time milestone
- Beachhead strategy before scale (Peter Thiel)
- Price communicates value (Van Westendorp)

## File Structure
```
pmf-lab/
├── index.html              # App shell
├── styles/
│   └── main.css            # Design system — documentary aesthetic
├── data/
│   ├── scenarios.js        # 3 scenario definitions with segments + hypotheses
│   └── actions.js          # 8 actions with probabilistic outcome sets
├── engine/
│   ├── state.js            # Game state management
│   ├── render.js           # All render functions
│   └── logic.js            # Action execution, scoring, endgame
└── components/
    ├── debrief.js          # GAS debrief — Gather / Analyse / Summarise
    └── hypothesis.js       # Hypothesis gate + tracker
```

## Research References

- Kapur, M. (2024). *Productive Failure*
- Bjork, R. (2011). On the symbiosis of learning, remembering, and forgetting
- Knowles, M. (1980). *The Modern Practice of Adult Education*
- Mezirow, J. (1990). *Fostering Critical Reflection in Adulthood*
- INACSL Standards of Best Practice: Simulation (2021)
- Ellis, S. (2010). The Startup Pyramid
- Vohra, R. (2018). How Superhuman Built an Engine to Find Product-Market Fit

## Status

- [x] V1 — Dark theme, 3 scenarios, basic debrief
- [ ] V2 — Documentary theme, hypothesis gate, GAS debrief, full game engine
- [ ] V3 — Facilitator dashboard, spaced repetition, peer comparison, AI outcomes
