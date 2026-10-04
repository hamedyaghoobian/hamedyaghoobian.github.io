// MASFIN (projects/multi-agents-llm-financial-trading-framework.md): the
// five CrewAI crews as five trays climbing in sequence, a few agents
// standing on each, with a human checkpoint on every step between them.
// The agents are a picture of a crew, not a count; every caption is the
// page's own description of that crew.

(function () {
  const root = document.getElementById('masfin-figure');
  if (!root || !window.LineFigure) return;
  const { iso, el, svg: makeSvg, box, edgeLabel, nearest, interact } = window.LineFigure;

  const CREWS = [
    ['Postmortem', 'analyzes delisted or failed firms to counter survivorship bias'],
    ['Screening', 'filters candidate equities using sentiment and real-time data'],
    ['Analysis', 'evaluates financial ratios and technical indicators across tickers'],
    ['Timing', 'determines entry points using historical-only signals'],
    ['Portfolio', 'constructs a 15–30 stock portfolio with risk-adjusted allocations']
  ];

  const SP = 58;                       // tray to tray, along u
  const TW = 44;                       // tray length
  const TD = 44;                       // tray depth
  const RISE = 18;                     // each tray stands this much higher
  const T = 5;                         // tray thickness
  const AW = 6;                        // an agent's footprint
  const AH = 14;                       // an agent's height at rest
  const LIFT = 0.6;                    // how much taller a lit crew stands
  const AGENTS = [[8, 8], [26, 14], [12, 28]];  // where agents stand on a tray

  const svg = makeSvg(root, '-12 -248 300 292',
    'Five trays climbing left to right, one per MASFIN crew — Postmortem, Screening, Analysis, Timing, Portfolio — each with a small crew of agents and a human checkpoint on the step to the next.');

  const base = k => k * RISE;
  const u0 = k => k * SP;

  // Farthest tray first, so nearer trays overlap it.
  const trays = [];
  for (let k = CREWS.length - 1; k >= 0; k--) {
    const g = el('g', {}, svg);
    box(g, 'lf-solid').set(u0(k), 0, base(k) - T, u0(k) + TW, TD, base(k));
    edgeLabel(g, CREWS[k][0], u0(k) + 2, TD, base(k) - T - 11, 'lf-text');

    // The step up to the next crew, with its human checkpoint.
    if (k < CREWS.length - 1) {
      const a = iso(u0(k) + TW, TD / 2, base(k));
      const b = iso(u0(k + 1), TD / 2, base(k + 1));
      el('line', { class: 'lf-line', x1: a[0], y1: a[1], x2: b[0], y2: b[1] }, g);
      const m = iso(u0(k) + TW + (SP - TW) / 2, TD / 2, base(k) + RISE / 2);
      el('line', { class: 'lf-line', x1: m[0], y1: m[1], x2: m[0], y2: m[1] - 12 }, g);
      el('circle', { class: 'lf-line', cx: m[0], cy: m[1] - 14.5, r: 2.5 }, g);
    }

    // Agents, back to front.
    const order = AGENTS.slice().sort((p, q) => (p[1] - p[0]) - (q[1] - q[0]));
    const agents = order.map(() => box(g, 'lf-solid'));
    trays[k] = { g, agents, order, label: g.querySelector('text') };
  }

  const trayX = CREWS.map((_, k) => iso(u0(k) + TW / 2, TD / 2)[0]);

  interact({
    root, svg,
    count: CREWS.length,
    rest: 'Five crews in sequence · a human checkpoint between each',
    describe: k => `${k + 1} · ${CREWS[k][0]} Crew · ${CREWS[k][1]}`,
    pick: x => nearest(x, trayX, SP / 2),
    draw: (glow, active) => {
      trays.forEach((t, k) => {
        const h = AH * (1 + LIFT * glow[k]);
        t.order.forEach(([u, v], i) => {
          t.agents[i].set(u0(k) + u, v, base(k), u0(k) + u + AW, v + AW, base(k) + h);
        });
        t.g.classList.toggle('is-lit', k === active);
        t.label.classList.toggle('is-lit', k === active);
      });
    }
  });
})();
