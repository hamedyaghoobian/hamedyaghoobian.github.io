// Teaching (pedagogy.md): the term-by-course matrix. The page draws the
// matrix itself (Liquid, from the page's own list), so this only answers
// the pointer: point at a course (its column head, a bar, its name in a
// term's list) and its column lights, with its pilot or what the pilot
// became, and the line under the matrix reads its run. Everything is read
// from the page, so there is nothing here to keep in step by hand.

(function () {
  const root = document.getElementById('tm');
  const out = document.getElementById('tm-readout');
  if (!root || !out) return;

  const $$ = (s, r = root) => [...r.querySelectorAll(s)];
  const heads = $$('.tm-head .tm-col');
  const rows = $$('.tm-row');
  const term = row => row.querySelector('.tm-term').textContent.replace(/\(scheduled\)|now/g, '').trim();
  const REST = 'point at a course: its column lights and its run reads here';

  // A pilot sits just before the course it became.
  const family = code => {
    const i = heads.findIndex(h => h.dataset.c === code);
    if (i < 0) return [code];
    if (heads[i].classList.contains('tm-col--pilot') && heads[i + 1]) return [code, heads[i + 1].dataset.c];
    if (heads[i - 1] && heads[i - 1].classList.contains('tm-col--pilot')) return [heads[i - 1].dataset.c, code];
    return [code];
  };

  function run(code) {
    const h = heads.find(x => x.dataset.c === code);
    const name = h ? h.title.replace(/ · pilot$/, '') : 'CSI ' + code;
    const taught = [], next = [];
    let n = 0;
    rows.forEach(r => {
      const bars = r.querySelectorAll(`.tm-cell[data-c="${code}"] i`).length;
      if (!bars) return;
      if (r.classList.contains('tm-row--scheduled')) next.push(term(r));
      else { taught.unshift(term(r)); n += bars; }
    });
    const bits = [name];
    if (taught.length) {
      bits.push(`${taught.length} term${taught.length === 1 ? '' : 's'}, ${n} section${n === 1 ? '' : 's'}`);
      bits.push(taught.length === 1 ? taught[0] : `${taught[0]} – ${taught[taught.length - 1]}`);
    }
    if (next.length) bits.push(`${taught.length ? 'next' : 'scheduled'}: ${next.join(', ')}`);
    const fam = family(code);
    if (fam.length > 1) {
      const other = heads.find(x => x.dataset.c === fam.find(c => c !== code));
      if (other) bits.push(fam[0] === code ? `pilot for ${other.title}` : `piloted as ${other.title.replace(/ · pilot$/, '')}`);
    }
    return bits.join(' · ');
  }

  let lit = null;
  function light(code) {
    if (code === lit) return;
    lit = code;
    const fam = code ? family(code) : [];
    $$('[data-c]').forEach(e => e.classList.toggle('is-lit', fam.includes(e.dataset.c)));
    out.textContent = code ? run(code) : REST;
  }

  root.addEventListener('pointerover', e => {
    const t = e.target.closest('[data-c]');
    light(t ? t.dataset.c : null);
  });
  root.addEventListener('pointerleave', () => light(null));
  // The one link in the list (Learning Machines) lights its course by Tab too.
  root.addEventListener('focusin', e => { const t = e.target.closest('[data-c]'); if (t) light(t.dataset.c); });
  root.addEventListener('focusout', () => light(null));

  out.textContent = REST;
})();
