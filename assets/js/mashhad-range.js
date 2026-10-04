// The home page's footer (_includes/footer.html): a line drawing of the
// mountains above Mashhad, with Mashhad's own sky over them.
//
// The range is drawn here, live, as SVG in the site's ink on its paper:
// four ridges from far to near, the central massif highest, gullies
// ribbing the slopes, mist in the valleys. Over it stands a sun if it is
// day in Mashhad right now, a moon if it is night there, placed along its
// arc by how far through Mashhad's day (or night) it is; the slopes that
// face it take the full ink. The caption gives Mashhad's local time.
//
// The footer wakes on its own terms: while the pointer is over it (with a
// soft lamp following the pointer along the ridges), or on a touch screen
// once it comes into view. Nothing elsewhere on the page sets it off.

(function () {
  const footer = document.querySelector('.site-footer');
  const host = footer && footer.querySelector('.footer-range');
  if (!host) return;
  const short = footer.querySelector('.footer-place__short');
  const full = footer.querySelector('.footer-place__full');

  // ── Mashhad's clock and sun ───────────────────────────────────────────

  const LAT = 36.30;                   // Mashhad
  const LON = 59.60;
  const ZONE = 'Asia/Tehran';
  const HOME = 'America/New_York';     // eastern Pennsylvania
  const MILES = '6,400';               // great-circle distance, Allentown → Mashhad

  // Minutes east of UTC for a time zone at an instant — daylight saving
  // on either side comes from the browser's own time-zone data.
  function offset(zone, date) {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: zone, hourCycle: 'h23',
      year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric'
    }).formatToParts(date);
    const p = Object.fromEntries(parts.map(x => [x.type, x.value]));
    const wall = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute);
    return Math.round((wall - Math.floor(date.getTime() / 60000) * 60000) / 60000);
  }

  // Sunrise and sunset in Mashhad, as minutes past UTC midnight (NOAA's
  // general solar position approximation; a minute or two is plenty here).
  function sunTimes(date) {
    const rad = Math.PI / 180;
    const doy = Math.floor((date - Date.UTC(date.getUTCFullYear(), 0, 1)) / 864e5) + 1;
    const g = 2 * Math.PI / 365 * (doy - 1);
    const eq = 229.18 * (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g)
      - 0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g));
    const decl = 0.006918 - 0.399912 * Math.cos(g) + 0.070257 * Math.sin(g)
      - 0.006758 * Math.cos(2 * g) + 0.000907 * Math.sin(2 * g)
      - 0.002697 * Math.cos(3 * g) + 0.00148 * Math.sin(3 * g);
    const ha = Math.acos(Math.cos(90.833 * rad) / (Math.cos(LAT * rad) * Math.cos(decl))
      - Math.tan(LAT * rad) * Math.tan(decl)) / rad;
    return { rise: 720 - 4 * (LON + ha) - eq, set: 720 - 4 * (LON - ha) - eq };
  }

  // Day or night in Mashhad, and how far through it (0…1).
  function sky(date) {
    const { rise, set } = sunTimes(date);
    const wrap = m => ((m % 1440) + 1440) % 1440;
    const t = date.getUTCHours() * 60 + date.getUTCMinutes();
    const r = wrap(rise), s = wrap(set);
    const day = r < s ? t >= r && t < s : t >= r || t < s;
    const length = day ? wrap(s - r) : 1440 - wrap(s - r);
    return { day, p: Math.min(1, wrap(t - (day ? r : s)) / length) };
  }

  function captions(date) {
    const time = new Intl.DateTimeFormat('en-US', { timeZone: ZONE, hour: 'numeric', minute: '2-digit' })
      .format(date).replace(/\s*([AP])M$/, (_, a) => ` ${a.toLowerCase()}m`);
    const ahead = (offset(ZONE, date) - offset(HOME, date)) / 60;
    const whole = Math.floor(ahead);
    const hours = `${whole}${ahead - whole >= 0.5 ? '½' : ''} hours`;
    return {
      short: `Mashhad, where I grew up · ${time} there now`,
      full: `In Mashhad it’s ${time} · ${hours} ahead of Pennsylvania · ${MILES} miles east`
    };
  }

  // ── The range ─────────────────────────────────────────────────────────

  const NS = 'http://www.w3.org/2000/svg';
  function el(name, attrs, parent) {
    const node = document.createElementNS(NS, name);
    for (const k in attrs) node.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(node);
    return node;
  }
  const f = n => n.toFixed(1);
  const line = pts => pts.map((p, i) => (i ? 'L' : 'M') + f(p[0]) + ' ' + f(p[1])).join('');

  // A seeded generator, so the range is the same drawing on every visit.
  function rng(seed) {
    return () => {
      seed = (seed + 0x6D2B79F5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // Smooth value noise along x (in pixels), one octave.
  function noise(seed, period) {
    const r = rng(seed), vals = [];
    return x => {
      const u = Math.max(0, x) / period, i = Math.floor(u), k = u - i;
      while (vals.length <= i + 1) vals.push(r());
      const t = (1 - Math.cos(Math.PI * k)) / 2;
      return vals[i] + (vals[i + 1] - vals[i]) * t;
    };
  }

  // Far to near. Heights are in units of the footer band's own height, so
  // the range scales with it; periods are in pixels, so a wider screen
  // shows more mountains rather than stretched ones. The far ridge carries
  // the central massif, the second a high shoulder to the right, as in the
  // range above the city.
  const LAYERS = [
    { base: 0.38, amp: 0.52, seed: 11, periods: [170, 75, 30], weights: [1, 0.5, 0.25], massif: 0.45, gullies: 1 },
    { base: 0.27, amp: 0.50, seed: 23, periods: [140, 60, 26], weights: [1, 0.55, 0.25], shoulder: 0.22, gullies: 0.75 },
    { base: 0.13, amp: 0.40, seed: 37, periods: [120, 52, 22], weights: [1, 0.5, 0.25], gullies: 0.55 },
    { base: 0.02, amp: 0.28, seed: 53, periods: [100, 45, 20], weights: [1, 0.45, 0.2], gullies: 0 }
  ];

  function profile(layer, W, R) {
    const octaves = layer.periods.map((p, i) => noise(layer.seed + i * 101, p));
    const total = layer.weights.reduce((a, b) => a + b, 0);
    const sigma = Math.min(W * 0.11, 180);
    return x => {
      // Ridged noise: sharp crests, rounded valleys.
      let n = 0;
      octaves.forEach((o, i) => { n += layer.weights[i] * (1 - Math.abs(2 * o(x) - 1)); });
      n = Math.pow(n / total, 1.6);
      let h = layer.base + layer.amp * n;
      if (layer.massif) h += layer.massif * Math.exp(-Math.pow((x - W / 2) / sigma, 2));
      if (layer.shoulder) h += layer.shoulder * Math.exp(-Math.pow((x - W * 0.84) / (W * 0.1), 2));
      return h * R;
    };
  }

  // A cloud bank's top edge: soft, puffy, drawn wider than the page so it
  // can drift.
  function mist(seed, W, H, R, level, swell) {
    const n1 = noise(seed, 130), n2 = noise(seed + 7, 46);
    const pts = [];
    for (let x = -0.08 * W; x <= 1.08 * W; x += 4) {
      const puff = Math.pow(n1(x + W) * 0.7 + n2(x + W) * 0.3, 0.7);
      pts.push([x, H - R * (level + swell * puff)]);
    }
    return pts;
  }

  function draw(W, H, R) {
    const date = new Date();
    const { day, p } = sky(date);
    const text = captions(date);
    if (short) short.textContent = text.short;
    if (full) full.textContent = text.full;

    const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, width: W, height: H, focusable: 'false', class: day ? 'range--day' : 'range--night' });
    svg.style.height = `${H}px`;

    // The lamp: a soft circle that follows the pointer.
    const defs = el('defs', {}, svg);
    const grad = el('radialGradient', { id: 'range-lamp-grad' }, defs);
    el('stop', { offset: '0', 'stop-color': '#fff' }, grad);
    el('stop', { offset: '0.55', 'stop-color': '#fff', 'stop-opacity': '0.6' }, grad);
    el('stop', { offset: '1', 'stop-color': '#fff', 'stop-opacity': '0' }, grad);
    const mask = el('mask', { id: 'range-lamp', maskUnits: 'userSpaceOnUse', x: -W, y: -H, width: 3 * W, height: 3 * H }, defs);
    lamp = el('circle', { cx: -999, cy: -999, r: Math.max(90, R * 0.9), fill: 'url(#range-lamp-grad)' }, mask);

    // The sky: Mashhad's sun or moon, placed before the ridges so they
    // hide it as it sets.
    const bodyR = Math.max(7, Math.min(13, R * 0.075));
    const lightX = W * (0.14 + 0.72 * p);
    const arc = Math.sin(Math.PI * p);
    const horizon = H - R * 0.5, peak = bodyR + 10;
    const lightY = horizon + (peak - horizon) * arc;
    if (day) {
      el('circle', { class: 'range-sun', cx: f(lightX), cy: f(lightY), r: f(bodyR) }, svg);
    } else {
      const sr = rng(7);
      for (let i = 0; i < 9; i++) {
        const sx = W * (0.08 + 0.84 * sr()), sy = 6 + (H - R * 0.95) * sr();
        if (sy > 4) el('circle', { class: 'range-star', cx: f(sx), cy: f(sy), r: f(0.7 + sr() * 0.6) }, svg);
      }
      const s = (bodyR * 2.2) / 24;
      el('path', {
        class: 'range-moon',
        d: 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z',
        transform: `translate(${f(lightX - 12 * s)} ${f(lightY - 12 * s)}) scale(${s.toFixed(3)})`
      }, svg);
    }

    // Faces toward the light, within its reach, take the full ink.
    const facing = (x, slope) => (lightX - x) * slope < 0 && Math.abs(x - lightX) < W * 0.42;

    LAYERS.forEach((layer, li) => {
      const h = profile(layer, W, R);
      const pts = [];
      for (let x = 0; x <= W; x += 3) pts.push([x, H - h(x)]);
      pts.push([W, H - h(W)]);
      const g = el('g', {}, svg);
      el('path', { class: 'range-fill', d: line(pts) + `L${W} ${H}L0 ${H}Z` }, g);
      el('path', { class: 'range-ridge', d: line(pts) }, g);

      // The lit stretches of the ridge line.
      let lit = '', run = [];
      for (let i = 1; i < pts.length; i++) {
        const slope = (h(pts[i][0]) - h(pts[i - 1][0])) / 3;
        if (facing(pts[i][0], slope)) {
          if (!run.length) run.push(pts[i - 1]);
          run.push(pts[i]);
        } else if (run.length) { lit += line(run); run = []; }
      }
      if (run.length) lit += line(run);
      if (lit) el('path', { class: 'range-ridge range-ridge--lit', d: lit }, g);

      // Gullies down the fall line, more on the far ridges.
      let soft = '', bright = '', all = line(pts);
      if (layer.gullies) {
        const r = rng(layer.seed * 13);
        for (let x = 6 + r() * 6; x < W - 4; x += (li ? 7 : 5) + r() * 8) {
          const slope = (h(x + 3) - h(x - 3)) / 6;
          if (Math.abs(slope) < 0.12 || r() > layer.gullies) continue;
          const dir = slope > 0 ? -1 : 1;
          const len = R * (0.16 + 0.3 * r()) * (1 - li * 0.2);
          const y0 = H - h(x) + 1.5;
          const d = `M${f(x)} ${f(y0)}Q${f(x + dir * len * 0.1)} ${f(y0 + len * 0.55)} ${f(x + dir * len * 0.32)} ${f(y0 + len)}`;
          if (facing(x, slope)) bright += d; else soft += d;
          all += d;
        }
      }
      if (soft) el('path', { class: 'range-gully', d: soft }, g);
      if (bright) el('path', { class: 'range-gully range-gully--lit', d: bright }, g);
      el('path', { class: 'range-lamp', d: all, mask: 'url(#range-lamp)' }, g);

      // Valley mist settles in front of the second-nearest ridge, and a
      // last bank along the foot of the range.
      if (li === 1 || li === 3) {
        const m = mist(li === 1 ? 71 : 89, W, H, R, li === 1 ? 0.2 : 0.02, li === 1 ? 0.14 : 0.1);
        const drift = el('g', { class: li === 1 ? 'range-drift' : 'range-drift range-drift--slow' }, svg);
        el('path', { class: 'range-mist', d: line(m) + `L${f(1.08 * W)} ${H}L${f(-0.08 * W)} ${H}Z` }, drift);
        el('path', { class: 'range-mist-edge', d: line(m) }, drift);
      }
    });

    host.replaceChildren(svg);
  }

  // ── Size, waking, the lamp ────────────────────────────────────────────

  let lamp = null;
  const above = [...document.querySelectorAll('.home-container, .info-section')];

  // The drawing's sky reaches up into the clear ground left between the
  // text above and the band, never past it.
  function render() {
    const W = host.clientWidth, R = host.clientHeight;
    if (!W || !R) return;
    const ground = host.getBoundingClientRect().bottom;
    const text = above.length ? Math.max(...above.map(e => e.getBoundingClientRect().bottom)) : ground - R;
    const H = Math.round(Math.min(R * 2.4, Math.max(R, ground - text - 16)));
    draw(W, H, R);
  }

  let queued = 0;
  const later = () => { if (!queued) queued = requestAnimationFrame(() => { queued = 0; render(); }); };

  render();
  window.addEventListener('resize', later);
  if (window.ResizeObserver) {
    const ro = new ResizeObserver(later);
    above.forEach(e => ro.observe(e));
  }
  // The sun keeps moving while the page is open.
  setInterval(render, 60000);

  const wake = on => footer.classList.toggle('is-awake', on);
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    // A short pause before waking, so a pointer passing through doesn't
    // set it off; a longer one before settling, so it doesn't flicker.
    let timer = 0;
    footer.addEventListener('pointerenter', () => { clearTimeout(timer); timer = setTimeout(() => wake(true), 120); });
    footer.addEventListener('pointerleave', () => {
      clearTimeout(timer);
      timer = setTimeout(() => wake(false), 400);
      if (lamp) { lamp.setAttribute('cx', -999); lamp.setAttribute('cy', -999); }
    });
    footer.addEventListener('pointermove', e => {
      const svg = host.firstChild;
      if (!lamp || !svg) return;
      const box = svg.getBoundingClientRect();
      lamp.setAttribute('cx', f(e.clientX - box.left));
      lamp.setAttribute('cy', f(e.clientY - box.top));
    });
  } else if (window.IntersectionObserver) {
    new IntersectionObserver(entries => entries.forEach(e => wake(e.isIntersecting)), { threshold: 0.5 })
      .observe(footer);
  }
})();
