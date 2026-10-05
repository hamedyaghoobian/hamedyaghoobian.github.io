// Bot Without Organs (tools.md): the A-to-Z the bot is built on, as an
// index-card drawer. Twenty-six cards stand in an open drawer, a lettered
// tab on each; typing a letter (or pointing at a card, or the arrow keys)
// lifts that card out of the drawer to show its interview.
//
// Data: the bot's own source, botwithoutorgans/botwithoutorgans.github.io,
// whose audio data holds one interview per letter of L'Abécédaire de
// Gilles Deleuze — A to W, then Z (H and P in two parts). There are no X
// and Y interviews there, so those cards stay blank. Titles are as the
// files give them; the English glosses are plain translations.

(function () {
  const root = document.getElementById('bot-figure');
  if (!root || !window.LineFigure) return;
  const { iso, el, svg: makeSvg, box, onEnd, face, nearest, interact } = window.LineFigure;

  // [letter, title, gloss, note]
  const CARDS = [
    ['A', 'Animal', 'animal'],
    ['B', 'Boisson', 'drink'],
    ['C', 'Culture', 'culture'],
    ['D', 'Désir', 'desire'],
    ['E', 'Enfance', 'childhood'],
    ['F', 'Fidélité', 'fidelity'],
    ['G', 'Gauche', 'the left'],
    ['H', 'Histoire de la philosophie', 'history of philosophy', 'in two parts'],
    ['I', 'Idée', 'idea'],
    ['J', 'Joie', 'joy'],
    ['K', 'Kant', 'Kant'],
    ['L', 'Littérature', 'literature'],
    ['M', 'Maladie', 'illness'],
    ['N', 'Neurologie', 'neurology'],
    ['O', 'Opéra', 'opera'],
    ['P', 'Professeur', 'teacher', 'in two parts'],
    ['Q', 'Question', 'question'],
    ['R', 'Résistance', 'resistance'],
    ['S', 'Style', 'style'],
    ['T', 'Tennis', 'tennis'],
    ['U', 'Un', 'one'],
    ['V', 'Voyage', 'travel'],
    ['W', 'Wittgenstein', 'Wittgenstein'],
    ['X'],
    ['Y'],
    ['Z', 'Zig zag', 'zigzag']
  ];

  const P = 4.2;                       // card to card, along u
  const CT = 0.7;                      // card thickness
  const V0 = 2, V1 = 24;               // a card's span across the drawer
  const CH = 17;                       // card height
  const TW = 7, TH = 3;                // tab width and height
  const TABS = [V0, V0 + 7.5, V0 + 15];  // tab positions, cycling like a real file
  const LIFT = 14;                     // how far a picked card rises
  const WALL = 12;                     // drawer wall height
  const L = CARDS.length * P;

  function split(t) {
    const mid = t.length / 2;
    let best = -1;
    for (let k = 0; k < t.length; k++) if (t[k] === ' ' && (best < 0 || Math.abs(k - mid) < Math.abs(best - mid))) best = k;
    return best < 0 ? [t] : [t.slice(0, best), t.slice(best + 1)];
  }
  const uOf = i => i * P + 1;

  const svg = makeSvg(root, '-8 -92 130 114',
    'An open card-index drawer labelled Abécédaire, with twenty-six lettered cards from A to Z. Picking a letter lifts its card out to show the title of Deleuze\'s interview for that letter; X and Y are blank.');

  // The drawer, back to front: back wall, floor, far end.
  box(svg, 'lf-solid').set(-3, -1, 0, L + 2, 0, WALL);
  box(svg, 'lf-solid').set(-3, -1, -2, L + 2, V1 + 2, 0);
  box(svg, 'lf-solid').set(L, -1, 0, L + 2, V1 + 2, WALL);

  // Cards, farthest first.
  const cards = [];
  for (let i = CARDS.length - 1; i >= 0; i--) {
    const g = el('g', {}, svg);
    const body = box(g, 'lf-solid');
    const tab = box(g, 'lf-solid');
    const letter = face(g, '');
    el('text', { x: TW / 2, y: TH - 0.7, 'text-anchor': 'middle', 'font-size': 2.6 }, letter).textContent = CARDS[i][0];
    const front = face(g, '');
    const title = CARDS[i][1];
    if (title) {
      // A long title takes two lines, broken at the space nearest its middle.
      const lines = title.length > 14 ? split(title) : [title];
      lines.forEach((t, n) => {
        el('text', { x: (V1 - V0) / 2, y: (lines.length > 1 ? 3.3 : 4.2) + n * 2.7, 'text-anchor': 'middle', 'font-size': lines.length > 1 ? 2.3 : 3 }, front).textContent = t;
      });
      el('text', { x: (V1 - V0) / 2, y: lines.length > 1 ? 8.9 : 7.6, 'text-anchor': 'middle', 'font-size': 2 }, front).textContent = CARDS[i][2];
    }
    el('line', { x1: 2, y1: 10.2, x2: V1 - V0 - 2, y2: 10.2, class: 'lf-line lf-faint' }, front);
    cards[i] = { g, body, tab, letter, front };
  }

  // Near wall, then the drawer's front with its label holder and pull.
  box(svg, 'lf-solid').set(-3, V1, 0, L + 2, V1 + 2, WALL);
  box(svg, 'lf-solid').set(-5, -1, -2, -3, V1 + 2, WALL + 2);
  const front = face(svg, onEnd(-5, -1, WALL + 2));
  el('rect', { x: 4.5, y: 2.4, width: 19, height: 4.6, rx: 0.6, class: 'lf-line' }, front);
  el('text', { x: 14, y: 5.5, 'text-anchor': 'middle', 'font-size': 2.1, 'letter-spacing': 0.15 }, front).textContent = 'ABÉCÉDAIRE';
  el('path', { d: 'M10.5 10.5 Q14 13.5 17.5 10.5', class: 'lf-line lf-strong' }, front);

  const cardX = CARDS.map((_, i) => iso(uOf(i), (V0 + V1) / 2, CH)[0]);

  const api = interact({
    root, svg,
    count: CARDS.length,
    rest: 'Deleuze from A to Z, the interviews the bot draws on · type a letter',
    describe: i => {
      const [k, title, gloss, note] = CARDS[i];
      if (!title) return `${k} · no ${k} interview in the series`;
      return `${k} comme ${title} · ${gloss}` + (note ? ` · ${note}` : '');
    },
    pick: x => nearest(x, cardX, P),
    draw: (glow, active) => {
      CARDS.forEach((_, i) => {
        const c = cards[i], u = uOf(i), h = LIFT * glow[i];
        const tv = TABS[i % 3];
        c.body.set(u, V0, h, u + CT, V1, CH + h);
        c.tab.set(u, tv, CH + h, u + CT, tv + TW, CH + TH + h);
        c.letter.setAttribute('transform', onEnd(u, tv, CH + TH + h));
        c.front.setAttribute('transform', onEnd(u, V0, CH + h));
        c.front.style.opacity = glow[i].toFixed(2);
        c.g.classList.toggle('is-lit', i === active);
      });
    }
  });

  // Typing a letter picks its card.
  root.addEventListener('keydown', e => {
    if (e.metaKey || e.ctrlKey || e.altKey || e.key.length !== 1) return;
    const i = CARDS.findIndex(c => c[0] === e.key.toUpperCase());
    if (i >= 0) { e.preventDefault(); api.set(i); }
  });
})();
