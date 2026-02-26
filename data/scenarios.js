// ═══════════════════════════════════════════════════════
// PMF LAB — SCENARIO DATA
// Three scenarios of increasing difficulty.
// Each teaches a different PMF failure mode.
// ═══════════════════════════════════════════════════════

const SCENARIOS = [
  {
    id: 'fintech',
    name: 'Clearfund',
    sector: 'FINTECH · B2C / SMB',
    desc: 'Invoice financing for UK freelancers. Three VC-backed competitors just entered. Find your beachhead before they do.',
    difficulty: 1,
    totalDays: 90,
    startBudget: 300000,
    arpu: 800,
    context: `Clearfund gives UK freelancers instant payment on invoices for a 3% fee. The pain is universal — freelancers wait 60–90 days on client invoices while rent, software subscriptions, and tax bills don't wait. You have £300K, 3 months, and three well-funded competitors who just announced Series A rounds. You cannot out-spend them on paid acquisition. You need to find the one segment that becomes your defensible beachhead before they commoditise the category.`,
    phaseContext: [
      "The market is moving fast. Before your competitors lock in positioning, you need to identify which segment to own.",
      "You have a segment hypothesis. Now test whether the pain is deep enough to change their financial behaviour.",
      "Pain validated. Now find out whether your acquisition channel actually reaches them — and whether referrals activate.",
      "Early traction. Do the unit economics hold? Does this segment retain and refer others like them?",
      "You've found repeatable growth. Now protect the beachhead before competitors commoditise it with VC money."
    ],
    segments: [
      {
        id: 'designers',
        name: 'Freelance Designers',
        size: '80K UK',
        pain: 'Late client payments',
        wtp: '3% fee',
        fit: 42
      },
      {
        id: 'contractors',
        name: 'IT Contractors',
        size: '200K UK',
        pain: 'Large invoice gaps',
        wtp: '2.5% fee',
        fit: 60
      },
      {
        id: 'agencies',
        name: 'Small Agencies',
        size: '15K UK',
        pain: 'Cash flow planning',
        wtp: '4% fee',
        fit: 80
      },
      {
        id: 'consultants',
        name: 'Solo Consultants',
        size: '120K UK',
        pain: 'Irregular income',
        wtp: '3.5% fee',
        fit: 54
      }
    ],
    hypotheses: [
      {
        id: 'h1',
        text: 'Freelancers will pay 3%+ for same-day payment without needing to negotiate',
        status: 'pending'
      },
      {
        id: 'h2',
        text: 'Small agencies have higher invoice volume and are stickier than individual freelancers',
        status: 'pending'
      },
      {
        id: 'h3',
        text: 'Word-of-mouth within professional communities will be the primary growth channel',
        status: 'pending'
      },
      {
        id: 'h4',
        text: 'Mobile-first UX is required — our users will not adopt a desktop-only product',
        status: 'pending'
      }
    ],
    debrief: `Clearfund's insight is that channel-market fit and product-market fit are separate problems that must both be solved. Freelance designers had the pain but small invoices (avg £800) made unit economics difficult — the 3% fee on an £800 invoice is £24, barely covering operational cost. IT contractors had large invoices (avg £15K) but used enterprise procurement paths that Clearfund couldn't penetrate at their stage. Small agencies were the beachhead: invoice volumes 5× higher than individuals, and critically, they had peer networks. Once one agency in a niche adopted Clearfund, they recommended it to peers in industry Facebook groups, at trade meetups, and through direct referrals. The product-led growth loop only worked because this segment had both the pain AND the referral behaviour. The right question is not "who has the highest pain?" but "who has the pain AND the network effect?"`
  },

  {
    id: 'healthtech',
    name: 'HealthOS',
    sector: 'HEALTHTECH · B2B SAAS',
    desc: 'AI clinical documentation. £500K seed. But who is the actual buyer — the doctor or the hospital system?',
    difficulty: 2,
    totalDays: 120,
    startBudget: 500000,
    arpu: 1200,
    context: `You've raised £500K pre-seed for HealthOS — an AI system that auto-generates clinical documentation, cutting admin time by 80%. Every doctor you've spoken to confirms the pain. But four completely different segments each have a claim to being your ICP. The doctor is the user. The clinic admin controls the budget. The hospital group is the economic decision-maker. The telehealth company operates at 10× scale. You have 4 months before a funding decision that could end the company.`,
    phaseContext: [
      "You're mapping the landscape. Who has the problem most acutely? Who actually signs the contract? These are different people.",
      "Pain confirmed. Now test whether your solution solves it in a way that justifies the price — for the person who actually pays.",
      "Pain confirmed, solution validated. Now test whether you can reach the right buyer efficiently and repeatably.",
      "You have early traction. The question is repeatability. Can you replicate this deal at lower cost and faster speed?",
      "The fundamentals are in place. Now prove the engine scales without breaking."
    ],
    segments: [
      {
        id: 'solo_gp',
        name: 'Solo GPs',
        size: '12K clinics',
        pain: 'Admin overload',
        wtp: '£200/mo',
        fit: 12
      },
      {
        id: 'clinic_adm',
        name: 'Clinic Admins',
        size: '4K groups',
        pain: 'Compliance cost',
        wtp: '£800/mo',
        fit: 30
      },
      {
        id: 'hospital',
        name: 'Hospital Groups',
        size: '800 groups',
        pain: 'Staff efficiency',
        wtp: '£8K/mo',
        fit: 58
      },
      {
        id: 'telehealth',
        name: 'Telehealth Cos',
        size: '200 cos',
        pain: 'Scale ops',
        wtp: '£15K/mo',
        fit: 74
      }
    ],
    hypotheses: [
      {
        id: 'h1',
        text: 'Solo GPs have the highest urgency and will pay a premium for time savings',
        status: 'pending'
      },
      {
        id: 'h2',
        text: 'The primary pain is documentation time, not compliance or cost management',
        status: 'pending'
      },
      {
        id: 'h3',
        text: 'Telehealth companies need enterprise API access, not a SaaS dashboard',
        status: 'pending'
      },
      {
        id: 'h4',
        text: 'Regulatory compliance is a stronger purchase trigger than productivity',
        status: 'pending'
      }
    ],
    debrief: `HealthOS reveals what most healthtech founders miss: the doctor is the user but rarely the economic buyer. Solo GPs felt the pain most acutely but had minimal budget authority and high switching cost anxiety — changing a clinical workflow requires practice-wide buy-in that a single GP rarely has. Telehealth companies had 10× the WTP because they experienced 10× the documentation cost at scale, and they had dedicated operations budgets rather than clinical budgets. This is the classic User ≠ Buyer problem. The segment with the loudest pain is almost never the segment with the strongest PMF. Strong PMF triangulates: pain intensity × willingness to pay × decision-making authority × urgency. Telehealth scored highest on all four. Everything else was noise until you found that combination.`
  },

  {
    id: 'deeptech',
    name: 'Carbonix',
    sector: 'DEEPTECH · B2B ENTERPRISE',
    desc: 'IoT carbon monitoring with 8 wildly different pilot results. Find the replicable ICP before £2M runs out.',
    difficulty: 3,
    totalDays: 180,
    startBudget: 2000000,
    arpu: 3500,
    context: `Carbonix uses IoT sensor arrays and ML to provide real-time carbon emissions monitoring for industrial facilities. You've raised £2M seed, but your 8 pilots have produced completely inconsistent results — three sites are raving fans, three are indifferent, two have gone silent. The technology demonstrably works. But you have no replicable ICP. You have 6 months before the Series A window requires evidence of a pattern. The question isn't whether the technology is good — it's who has the right combination of urgency, budget, and operational need to buy it reliably.`,
    phaseContext: [
      "Eight pilots, three response patterns. The signal is in the difference between your three raving fans and the indifferent sites. What do the fans share?",
      "You have a segment hypothesis. Now test whether the pain is structural (they must solve it) or aspirational (nice to have).",
      "Structural pain confirmed. Now map the purchase path: who approves, what's the budget cycle, how long does procurement take?",
      "You have a repeatable sale. Now prove retention and expansion — the LTV must justify an 18-month sales cycle.",
      "Beachhead proven. Map the path to adjacent segments without breaking the sales motion that works."
    ],
    segments: [
      {
        id: 'cement',
        name: 'Cement Plants',
        size: '400 UK sites',
        pain: 'EU ETS compliance',
        wtp: '£50K/yr',
        fit: 38
      },
      {
        id: 'steel',
        name: 'Steel Manufacturers',
        size: '80 sites',
        pain: 'Scope 3 reporting',
        wtp: '£200K/yr',
        fit: 62
      },
      {
        id: 'logistics',
        name: 'Logistics Hubs',
        size: '600 sites',
        pain: 'ESG investor pressure',
        wtp: '£25K/yr',
        fit: 28
      },
      {
        id: 'dcentres',
        name: 'Data Centres',
        size: '300 sites',
        pain: 'PPA commitments',
        wtp: '£80K/yr',
        fit: 84
      }
    ],
    hypotheses: [
      {
        id: 'h1',
        text: 'EU ETS compliance penalties create faster purchase decisions than ESG reporting pressure',
        status: 'pending'
      },
      {
        id: 'h2',
        text: 'Steel manufacturers have the highest LTV but require prohibitive levels of customisation',
        status: 'pending'
      },
      {
        id: 'h3',
        text: 'Data centres have standardised monitoring needs and are the fastest-growing segment',
        status: 'pending'
      },
      {
        id: 'h4',
        text: 'Energy consultants as channel partners will meaningfully accelerate enterprise sales cycles',
        status: 'pending'
      }
    ],
    debrief: `Carbonix had the classic deeptech trap: interesting technology looking for a market. The instinct was to pursue steel (highest WTP at £200K/yr) but 18-month procurement cycles were burning cash faster than deals could close. The breakthrough insight was about the type of urgency. Logistics hubs had ESG pressure — but "investor pressure" is soft urgency, easily postponed when other priorities compete. Data centres had a different property: Power Purchase Agreement (PPA) commitments meant carbon monitoring wasn't aspirational, it was contractually required. The ESG team AND the operations team both had budget. Deals closed in 6–8 weeks, not 18 months. The deeper lesson is the difference between regulatory urgency and operational stickiness. When Carbonix appeared in a data centre's KPI dashboard rather than their compliance checklist, churn dropped to near zero. The product became part of how the site was managed daily, not just how it was reported quarterly. That operational integration is the only PMF that survives.`
  }
];
