// Bot Without Organs (tools.md): the A-to-Z the bot is built on, as an
// index-card drawer drawn flat, in front elevation. Twenty-six cards stand
// in the drawer, one behind the other, so only their lettered tabs show
// above its rim; typing a letter (or pointing at a tab, or the arrow keys)
// slides that card up out of the drawer, in the plane of the drawing, to
// show its interview.
//
// Data: the bot's own source, botwithoutorgans/botwithoutorgans.github.io,
// whose audio data holds one interview per letter of L'Abécédaire de
// Gilles Deleuze — A to W, then Z (H and P in two parts). There are no X
// and Y interviews there, so those cards stay blank. Titles are as the
// files give them; the English glosses are plain translations.
//
// Plain SVG: only el / svg / interact come from LineFigure. Styles are the
// .tlf-* rules in _sass/faceplate/pages/_tools.scss.

(function () {
  const root = document.getElementById('bot-figure');
  if (!root || !window.LineFigure) return;
  const { el, svg: makeSvg, interact } = window.LineFigure;

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

  const X0 = 4.8, P = 4.4, TW = 4;     // tabs: first edge, pitch, width
  const CX0 = 3.6, CX1 = 120.4;        // a card's width
  const TOP = 46, TH = 4.6;            // a card's top edge at rest; tab height
  const CH = 34;                       // card height
  const RIM = 50;                      // the drawer front's top edge
  const LIFT = 28;                     // how far a picked card slides up
  const tabX = i => X0 + i * P;

  function nearest(x, xs, reach) {
    let best = -1, dist = reach;
    xs.forEach((xi, i) => { const d = Math.abs(xi - x); if (d < dist) { best = i; dist = d; } });
    return best;
  }

  const svg = makeSvg(root, '0 10 124 72',
    'A card-index drawer labelled Abécédaire, drawn flat from the front, with twenty-six lettered tabs from A to Z above its rim. Picking a letter slides its card up to show the title of Deleuze\'s interview for that letter; X and Y are blank.');
  svg.classList.add('tlf');

  // A card: its tab, its face, and what is written on it.
  function card(i, parent) {
    const k = CARDS[i][0];
    const g = el('g', {}, parent);
    const x = tabX(i);
    el('rect', { class: 'tlf-solid tlf-tab', x, y: TOP - TH, width: TW, height: TH + 1, rx: 0.6 }, g);
    el('text', { x: x + TW / 2, y: TOP - 1.2, 'text-anchor': 'middle', 'font-size': 3, class: 'tlf-mono' }, g).textContent = k;
    return g;
  }

  // A picked card rises from the back of the drawer, so it is drawn
  // first: the other cards' tabs, and the drawer front, stay in front of
  // what of it is still inside. Only one is ever up (and one on its way
  // down).
  const lifted = el('g', {}, svg);

  // The stack at rest: every card's top edge, one behind the other, and
  // its tab.
  el('rect', { class: 'tlf-solid', x: CX0, y: TOP, width: CX1 - CX0, height: RIM - TOP + 1 }, svg);
  const tabs = CARDS.map((_, i) => card(i, svg));

  // Each card, drawn whole.
  const faces = CARDS.map(([k, title, gloss, note], i) => {
    const g = el('g', { style: 'display:none' }, lifted);
    el('rect', { class: 'tlf-solid', x: CX0, y: TOP, width: CX1 - CX0, height: CH, rx: 0.8 }, g);
    const tab = card(i, g);
    tab.classList.add('tlf-own');
    [14.5, 19.5, 24.5, 29.5].forEach(dy => {
      el('line', { class: 'tlf-line tlf-faint', x1: CX0 + 4, y1: TOP + dy, x2: CX1 - 4, y2: TOP + dy }, g);
    });
    el('text', { x: CX0 + 4, y: TOP + 11.5, 'font-size': 9, class: 'tlf-head' }, g).textContent = k;
    if (title) {
      el('text', { x: CX0 + 16, y: TOP + 7.5, 'font-size': 4.6, class: 'tlf-head' }, g).textContent = title;
      el('text', { x: CX0 + 16, y: TOP + 12, 'font-size': 3.1 }, g).textContent = gloss + (note ? ` · ${note}` : '');
    }
    return g;
  });

  // The drawer front, with its label holder and pull.
  el('rect', { class: 'tlf-solid', x: 1, y: RIM, width: 122, height: 30, rx: 1 }, svg);
  el('rect', { class: 'tlf-line', x: 47, y: RIM + 5, width: 30, height: 7, rx: 0.6 }, svg);
  el('text', { x: 62, y: RIM + 9.9, 'text-anchor': 'middle', 'font-size': 3, 'letter-spacing': 0.2, class: 'tlf-mono' }, svg).textContent = 'ABÉCÉDAIRE';
  el('path', { d: `M54 ${RIM + 17} Q62 ${RIM + 23} 70 ${RIM + 17}`, class: 'tlf-line tlf-strong' }, svg);

  const cardX = CARDS.map((_, i) => tabX(i) + TW / 2);

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
        const up = glow[i] > 0.002;
        faces[i].style.display = up ? '' : 'none';
        if (up) faces[i].setAttribute('transform', `translate(0 ${(-LIFT * glow[i]).toFixed(2)})`);
        faces[i].classList.toggle('tlf-on', i === active);
        tabs[i].style.visibility = up ? 'hidden' : '';   // its tab went up with it
      });
      // The picked card rides on top of one on its way down.
      if (active >= 0 && lifted.lastChild !== faces[active]) lifted.appendChild(faces[active]);
    }
  });

  // Typing a letter picks its card.
  root.addEventListener('keydown', e => {
    if (e.metaKey || e.ctrlKey || e.altKey || e.key.length !== 1) return;
    const i = CARDS.findIndex(c => c[0] === e.key.toUpperCase());
    if (i >= 0) { e.preventDefault(); api.set(i); }
  });
})();
