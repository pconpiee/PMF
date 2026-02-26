// ═══════════════════════════════════════════════════════
// PMF LAB — ACTION DATA
// 8 actions across 4 types: research, product, channel, pivot
// Each action has 2-3 weighted probabilistic outcomes.
// Every outcome teaches a named PMF principle.
// ═══════════════════════════════════════════════════════

const ACTIONS = [

  // ── RESEARCH ────────────────────────────────────────

  {
    id: 'customer_interview',
    name: 'Customer Interviews',
    type: 'research',
    desc: 'Five deep-dive interviews with your target segment. Surface the pain hierarchy, decision triggers, and the precise language customers use.',
    timeCost: 8,
    budgetCost: 5000,
    insightGain: 3,
    outcomes: [
      {
        weight: 50,
        icon: '🎯',
        title: 'Pain Hierarchy Overturned',
        body: 'Interviews surface a striking finding: the pain you built for ranks third. The real urgent problem is stated in near-identical words across four interviewees. Three use the phrase "I would pay anything to solve this." The exact repetition is the signal — not just the words.',
        pmfDelta: 7,
        users: 0,
        insights: 3,
        learning: 'Marc Andreessen: "The only thing that matters is whether customers are pulling the product out of your hands." The job of customer interviews is not to confirm your hypothesis — it\'s to be surprised. Verbatim phrase repetition across independent interviews is the strongest qualitative PMF signal available.'
      },
      {
        weight: 30,
        icon: '⚠️',
        title: 'User ≠ Buyer — The Classic B2B Trap',
        body: 'Four of five interviewees confirm the pain acutely. But when you ask "who approves a purchase like this?" — a different person emerges. You\'ve been selling to the user. The economic buyer is one organisational level above. They have different concerns, different language, and different objections.',
        pmfDelta: 3,
        users: 0,
        insights: 2,
        learning: 'The B2B Decision-Making Unit (DMU) includes an initiator, influencer, decider, buyer, and gatekeeper. Perfect product-user fit can coexist with zero sales if you\'ve never identified the decider. Map every role in every potential deal. User enthusiasm is evidence — but it is not a purchase.'
      },
      {
        weight: 20,
        icon: '💡',
        title: 'A Champion Emerges',
        body: 'One interview far exceeds the others. The interviewee leans in: "I\'ve been waiting for exactly this. Can I introduce you to our Head of Operations?" Unprompted internal referral from a thirty-minute conversation. This is the champion signal — someone willing to stake their professional reputation on your success.',
        pmfDelta: 11,
        users: 1,
        insights: 4,
        learning: 'A champion is not someone who likes your product. A champion believes they personally succeed when you succeed — and acts on that belief internally. In early B2B, one genuine champion is worth 100 lukewarm prospects. Find them. Serve them obsessively. Never let them fail.'
      }
    ]
  },

  {
    id: 'landing_page',
    name: 'Landing Page Test',
    type: 'research',
    desc: 'Run segment-specific landing pages with targeted traffic. Measure conversion rate and click language by segment — before building anything.',
    timeCost: 5,
    budgetCost: 8000,
    insightGain: 2,
    outcomes: [
      {
        weight: 38,
        icon: '📊',
        title: 'One Segment Converts 10×',
        body: 'The conversion data is unambiguous. Segment A: 0.6%. Segment B: 2.9%. Segment C: 8.7%. The CTA text that converts highest is "instant compliance reporting" — not "save time" or "reduce cost." Both the segment and the language are now revealed.',
        pmfDelta: 9,
        users: 5,
        insights: 2,
        learning: 'Sean Ellis: measure pull before you build. A segment converting 10× better at top of funnel will almost certainly retain better and refer more. The CTA language also reveals how they frame the problem — use their exact words in your pitch, not your own.'
      },
      {
        weight: 37,
        icon: '🔀',
        title: 'Message-Market Mismatch',
        body: 'All three pages convert below 1%. Session recordings show users scrolling carefully, reading, then leaving without acting. They understand what you do — they just don\'t see why it\'s for them. The problem is positioning, not product. You\'re describing features when they\'re looking for an outcome.',
        pmfDelta: 1,
        users: 0,
        insights: 2,
        learning: 'Clayton Christensen: customers don\'t buy products, they hire them to do jobs. Your page must answer: "Can this do the job I actually need done?" Describing what the product IS rather than what job it performs produces poor conversion even in your best segment.'
      },
      {
        weight: 25,
        icon: '🚀',
        title: 'Organic Viral Share',
        body: 'One segment shares the landing page in a community — Slack, a forum, a professional network. Traffic spikes 280% from a single referral at zero ad cost. The shares include comments: "This is exactly what we\'ve been waiting for." You haven\'t even built it yet.',
        pmfDelta: 13,
        users: 14,
        insights: 3,
        learning: 'Unprompted sharing is one of the rarest and most powerful PMF signals. It means: the pain is real and widely felt; your framing resonated precisely; the community has latent demand that pre-exists your product. This is a product-led growth flywheel before you have a product.'
      }
    ]
  },

  {
    id: 'cohort_analysis',
    name: 'Cohort & Retention Analysis',
    type: 'research',
    desc: 'Analyse retention, activation, and NPS across your existing users by acquisition source and behaviour pattern.',
    timeCost: 4,
    budgetCost: 2000,
    insightGain: 4,
    outcomes: [
      {
        weight: 45,
        icon: '📉',
        title: 'Retention Cliff at Day 7',
        body: 'D1 retention: 68%. D7: 23%. D30: 8%. You\'re losing 80% of users before they experience core value. Users sign up, get confused by onboarding, and never hit the "aha moment." The product works — but no one is staying long enough to discover it.',
        pmfDelta: 2,
        users: 0,
        insights: 4,
        learning: 'Chamath Palihapitiya\'s North Star framework: every product has a single action that drives retention — Facebook\'s was "7 friends in 10 days." Your job is to find YOUR core action and ruthlessly optimise to get users there as fast as possible. Fix activation before fixing features.'
      },
      {
        weight: 35,
        icon: '⚡',
        title: 'Power User Cohort Identified',
        body: 'Users acquired from one specific channel show 60% D30 retention vs 8% average. These users share three characteristics: same role, same use case, same content trigger for sign-up. This cohort IS your real ICP — everything else is noise.',
        pmfDelta: 12,
        users: 0,
        insights: 3,
        learning: 'Analyse your best cohort, not your average. Every product has a subset of users who "get it" — they find the aha moment, retain, and refer. The question isn\'t "why do most users churn?" It\'s "what makes our power users so powerful?" Build for them, not the median.'
      },
      {
        weight: 20,
        icon: '🔍',
        title: 'NPS Detractors Reveal Gold',
        body: 'NPS: +18 (decent but not great). But the detractors\' open-text reveals a consistent complaint: "I wanted X but got Y." X is a feature you haven\'t built. Your promoters would love X too. One consistent complaint pattern across detractors equals one high-confidence product hypothesis.',
        pmfDelta: 5,
        users: 0,
        insights: 4,
        learning: 'Net Promoter Score is a lagging indicator — but the open-text comments are gold. Detractors aren\'t lost causes; they\'re telling you precisely what would convert them to promoters. One consistent complaint pattern = one high-confidence product hypothesis worth building immediately.'
      }
    ]
  },

  // ── PRODUCT ─────────────────────────────────────────

  {
    id: 'mvp_build',
    name: 'Build & Ship MVP',
    type: 'product',
    desc: 'Ship a minimum viable version of the core use case. Three features maximum. Get it in front of real users immediately.',
    timeCost: 20,
    budgetCost: 40000,
    insightGain: 1,
    outcomes: [
      {
        weight: 43,
        icon: '🔨',
        title: 'Mixed Signal — But Three Users Are Gold',
        body: 'Eight beta users. Three log in every day without prompting. Three log in weekly. Two never returned after day one. The daily-three are building workarounds to extract more value than you designed. Their support tickets aren\'t complaints — they\'re feature requests. The 3/8 ratio looks like failure. It is not.',
        pmfDelta: 8,
        users: 8,
        insights: 2,
        learning: 'Paul Graham: "It\'s better to have 100 people who love you than a million who sort-of like you." Your three daily users who hack around limitations are the future of your company. Study every action they take. Interview them weekly. Build for them, not the median.'
      },
      {
        weight: 30,
        icon: '🎭',
        title: 'Wrong Job — Users Repurposed the Product',
        body: 'Usage data reveals something unexpected: users are ignoring your primary feature and using a secondary one as their core workflow. They\'ve hired your product to do a completely different job than you designed for. You built a hammer; they\'re using it as a lever.',
        pmfDelta: 4,
        users: 4,
        insights: 3,
        learning: 'Eric Ries calls this the "zoom out" pivot — your core use case hypothesis was wrong, but something adjacent you built has genuine pull. Don\'t be precious about your original vision. Follow actual usage data, not intended usage. The product the market wants may differ from what you wanted to build.'
      },
      {
        weight: 27,
        icon: '⭐',
        title: 'Superhuman-Level Retention',
        body: 'D30 retention: 68%. Category average: 14%. Users set calendar reminders to use the product. Three have referred colleagues without being asked. NPS from this cohort: +71. One user says "I\'d quit my job before I stopped using this." You are watching product-market fit happen in real time.',
        pmfDelta: 19,
        users: 15,
        insights: 1,
        learning: 'Rahul Vohra\'s PMF framework: "How would you feel if you could no longer use this product?" When >40% say "very disappointed," you have PMF. D30 retention of 68% against a 14% average and NPS +71 are Superhuman-level signals. Retention cannot be gamed — people vote with behaviour, not words.'
      }
    ]
  },

  {
    id: 'pricing_experiment',
    name: 'Pricing Experiment',
    type: 'product',
    desc: 'Test three price points. Run Van Westendorp willingness-to-pay interviews. Find the psychological acceptable range.',
    timeCost: 6,
    budgetCost: 3000,
    insightGain: 2,
    outcomes: [
      {
        weight: 38,
        icon: '💰',
        title: 'Pricing Into the Low-Trust Zone',
        body: 'Van Westendorp results: £50/mo feels "too cheap — something must be wrong with it." £150–£400/mo is the acceptable range. Your current price of £99/mo is literally signalling low quality. Users are not leaving because you\'re expensive. They\'re leaving because you\'re not expensive enough.',
        pmfDelta: 6,
        users: 0,
        insights: 2,
        learning: 'Price communicates value. In B2B especially, a price too low creates doubt about quality, not gratitude about accessibility. The Van Westendorp Price Sensitivity Meter exposes the psychological band within which customers trust what they\'re buying is real. Below "too cheap" means you\'re paying to make people distrust you.'
      },
      {
        weight: 35,
        icon: '📉',
        title: 'WTP Varies 20× Across Segments',
        body: 'The data: Segment A accepts £80–150/mo. Segment B: £400–700/mo. Segment C: £2K–5K/mo. You\'ve been pricing for Segment A. Segment C generates the same annual revenue with 20 customers instead of 300 — and those 20 are easier to onboard, support, and expand.',
        pmfDelta: 9,
        users: 0,
        insights: 3,
        learning: 'Madhavan Ramanujam: don\'t start with the product and add pricing. Start with WTP by segment and work backwards to what to build and for whom. Your highest-WTP segment almost always has the lowest churn — they pay because the product is mission-critical to them.'
      },
      {
        weight: 27,
        icon: '📈',
        title: 'Usage-Based Pricing Unlocks Adoption',
        body: 'Fixed fees require budget approval, committee sign-off, quarterly planning cycles. Usage-based pricing shortens the procurement path from 8 weeks to 3 days. The "try before you commit" model converts experiments into dependency before formal contracts are needed.',
        pmfDelta: 7,
        users: 8,
        insights: 2,
        learning: 'Usage-based pricing (Snowflake, Twilio, AWS, Stripe) reduces buyer risk and aligns cost directly with value received. In enterprise, a usage-based pilot can be approved by a department manager — no committee required. Once they\'re dependent, the formal contract follows.'
      }
    ]
  },

  // ── CHANNEL ─────────────────────────────────────────

  {
    id: 'channel_test',
    name: 'Channel Experiment',
    type: 'channel',
    desc: 'Run two acquisition channels simultaneously. Measure CAC, activation rate, and retention quality by channel — not just volume.',
    timeCost: 10,
    budgetCost: 15000,
    insightGain: 2,
    outcomes: [
      {
        weight: 35,
        icon: '🌱',
        title: 'Community-Led Growth Dominates',
        body: 'Paid ads: CAC £480, activation 11%, D30 retention 18%. Community-led (Slack groups, newsletters): CAC £55, activation 51%, D30 retention 62%. Users from community are 4× more likely to become power users and 7× more likely to refer. The channel isn\'t just cheaper — it selects for better customers.',
        pmfDelta: 10,
        users: 20,
        insights: 2,
        learning: 'Brian Balfour\'s channel-product fit: the right channel reaches people with the problem who are also in a buying mindset. Community channels self-select for motivated users already engaged with the problem space. Channel affects customer quality, not just quantity — and quality compounds.'
      },
      {
        weight: 35,
        icon: '🤝',
        title: 'This is a Sales-Led Product',
        body: 'Self-serve activation: 22%. Outbound sales with live demo: 79% conversion to paid, £32K ACV. For your ICP, buying is a considered process with multiple stakeholders and a proof-of-concept period. They need a human, not a signup flow.',
        pmfDelta: 9,
        users: 3,
        insights: 2,
        learning: 'The PLG vs sales-led decision is one of the most consequential in go-to-market. The signal: at what point does the prospect need a human to move forward? If they need a human to understand the value, it\'s sales-led. Building a PLG motion for a sales-led product is one of the most common and expensive mistakes in B2B SaaS.'
      },
      {
        weight: 30,
        icon: '🔥',
        title: 'Channel-Market Mismatch',
        body: 'All three channels underperform — not because your product doesn\'t work, but because your target buyer isn\'t on these channels at all. £15K spent discovering where your customer isn\'t. This is genuinely useful, if expensive, information.',
        pmfDelta: -2,
        users: 0,
        insights: 3,
        learning: 'Jeff Bezos: "Our success is a function of how many experiments we do per year." A failed channel experiment eliminates a false path. The real lesson: understand WHY these channels failed. Where does your target buyer actually consume information? That\'s where your channel lives.'
      }
    ]
  },

  {
    id: 'partner_channel',
    name: 'Strategic Partnership Test',
    type: 'channel',
    desc: 'Approach 3 potential distribution partners. Test whether a partner can unlock a new segment at lower CAC.',
    timeCost: 12,
    budgetCost: 10000,
    insightGain: 1,
    outcomes: [
      {
        weight: 35,
        icon: '🤝',
        title: 'Reseller Unlocks Segment',
        body: 'One partner — a professional services firm in your target industry — agrees to bundle the product for their clients. Immediate access to 400 potential users with near-zero CAC. The partner becomes your distribution channel and de-risks customer acquisition entirely.',
        pmfDelta: 14,
        users: 25,
        insights: 1,
        learning: 'Distribution partnerships can solve channel-market fit overnight. But choose carefully: the right partner already has trust with your ICP and has a business reason to sell you. Ask: what do they get from selling us? If the answer is unclear, the partnership will fail regardless of the signed agreement.'
      },
      {
        weight: 40,
        icon: '⏳',
        title: 'Partnership Too Early',
        body: 'Two partners express interest but want a revenue share, product customisation, AND a 6-month exclusivity clause before committing. The negotiation takes 3 months and goes nowhere. Partnerships require more product maturity and legal complexity than you\'re ready for at this stage.',
        pmfDelta: -3,
        users: 0,
        insights: 2,
        learning: 'Reid Hoffman: "If you are not embarrassed by the first version of your product, you\'ve launched too late." Same applies to partnerships. Go direct first, find PMF, then add partner channels. Partners want to sell something proven — not join your experiment. Sequence matters.'
      },
      {
        weight: 25,
        icon: '🔌',
        title: 'API Integration Demand',
        body: 'All three potential partners ask the same question unprompted: "Does it have an API?" They want to embed your capability into their existing product — not resell yours. This is a completely different business model: a platform play rather than a direct SaaS.',
        pmfDelta: 8,
        users: 5,
        insights: 3,
        learning: 'Platform vs product is a fundamental business model decision. If three partners independently ask for an API, that\'s a strong market signal. Platform businesses have different unit economics — lower CAC, higher LTV via embedding — but require developer experience and documentation investment upfront.'
      }
    ]
  },

  // ── PIVOT ────────────────────────────────────────────

  {
    id: 'competitive_pivot',
    name: 'Competitive Deep-Dive + Niche Pivot',
    type: 'pivot',
    desc: 'Analyse three direct competitors in depth. Identify the segment they\'re all ignoring. Reposition your product for that white space.',
    timeCost: 7,
    budgetCost: 4000,
    insightGain: 3,
    outcomes: [
      {
        weight: 40,
        icon: '🗺️',
        title: 'White Space Identified',
        body: 'All three funded competitors target the same large segment. All three ignore the same subsegment — it\'s too small for their investor expectations and their enterprise sales motion can\'t serve it economically. For you: £40M TAM with zero serious competition and users desperate for a purpose-built solution.',
        pmfDelta: 12,
        users: 0,
        insights: 3,
        learning: 'Peter Thiel: "Competition is for losers." The strongest PMF positions are near-monopolies in a specific niche — you\'re the only product for a specific job for a specific user. The beachhead strategy: own something small completely before you try to own something large partially.'
      },
      {
        weight: 35,
        icon: '🔬',
        title: 'Differentiation Refined',
        body: 'Competitive analysis reveals you\'re competing on features — which you\'ll always lose on against funded players. But customers actually choose based on a specific outcome guarantee. Repositioning from "AI-powered X" to "the only tool that guarantees Y in Z days" creates a clear, defensible position.',
        pmfDelta: 7,
        users: 2,
        insights: 2,
        learning: 'April Dunford\'s positioning framework: your competitive alternative is the key. If you position against spreadsheets, your features look amazing. If you position against Salesforce, you look weak. Choose your competitive alternative strategically — it defines the entire value narrative.'
      },
      {
        weight: 25,
        icon: '⏰',
        title: 'Market Timing Risk',
        body: 'Research reveals two VC-backed competitors just raised £30M Series A targeting your exact segment. You have 90 days before they outspend you on every channel. The market is real — but is this the right time to be building it, or should you find the flanking segment they\'ll ignore for 18 months?',
        pmfDelta: 0,
        users: 0,
        insights: 4,
        learning: 'Bill Gurley: "The best moat is being first with the best product in a category." But first-mover advantage only matters if you can defend. If a competitor has 20× your capital, find the flanking segment they won\'t bother with. Timing + positioning beats head-on competition every time.'
      }
    ]
  }

];
