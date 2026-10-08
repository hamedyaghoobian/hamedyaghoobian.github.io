// Publications (public-interactions.md): small ASCII charts, in the manner of
// ascii.rest's data section — box-drawing axes, dotted gridlines, block bars
// with their values riding on top. Two of them:
//   #cites-chart   citations per year, from Google Scholar
//   .pub-cites     a short bar beside each paper, scaled to the most-cited one
// Both read their numbers from data attributes the page writes from
// _data/scholar.json; without this script each paper still says its count.

(function () {
  const EIGHTHS = ' ▁▂▃▄▅▆▇█';          // vertical eighths, for bar tops
  const PARTIAL = ' ▏▎▍▌▋▊▉█';          // horizontal eighths, for bar ends

  // A step of 1, 2 or 5 × 10ⁿ that divides `max` into about three bands.
  function niceStep(max) {
    const raw = Math.max(1, max / 3);
    const mag = Math.pow(10, Math.floor(Math.log10(raw)));
    return [1, 2, 5, 10].map(m => m * mag).find(s => s >= raw);
  }

  function columnChart(values, labels, opts) {
    const BAR = 4, GAP = 3, ROWS_PER_STEP = 3;
    const max = Math.max(...values, 1);
    const step = niceStep(max);
    const bands = Math.ceil(max / step);
    const rows = bands * ROWS_PER_STEP;
    const top = bands * step;
    const yw = String(top).length;
    const width = values.length * (BAR + GAP) + GAP;
    const height = v => v / top * rows;          // in rows, fractional

    const out = [];
    // One row of headroom above the top line, so the tallest bar's value
    // still has somewhere to sit.
    for (let r = rows + 1; r >= 1; r--) {
      const tick = r <= rows && r % ROWS_PER_STEP === 0;
      let line = (tick ? String(r / rows * top).padStart(yw) + ' ┤' : ' '.repeat(yw) + ' │');
      line += (tick ? '┈' : ' ').repeat(GAP);
      values.forEach(v => {
        const h = height(v);
        let cell;
        if (h >= r) cell = '█'.repeat(BAR);
        else if (h > r - 1) cell = EIGHTHS[Math.max(1, Math.round((h - (r - 1)) * 8))].repeat(BAR);
        else if (Math.ceil(h) === r - 1) {
          // The value rides on top of its bar.
          const label = String(v);
          cell = label.padStart(Math.ceil((BAR + label.length) / 2)).padEnd(BAR);
        } else cell = (tick ? '┈' : ' ').repeat(BAR);
        line += cell + (tick ? '┈' : ' ').repeat(GAP);
      });
      out.push(line.replace(/┈+$/, ''));
    }
    out.push('0'.padStart(yw) + ' └' + '─'.repeat(width));
    out.push(' '.repeat(yw + 2) + ' '.repeat(GAP) + labels.map(l => l.padEnd(BAR + GAP)).join(''));
    return out.join('\n');
  }

  function rowBar(v, max, width) {
    const units = max ? v / max * width * 8 : 0;
    const full = Math.floor(units / 8), rest = Math.round(units % 8);
    return ('█'.repeat(full) + (rest ? PARTIAL[rest] : '')).padEnd(width) + ' ' + v;
  }

  const chart = document.getElementById('cites-chart');
  if (chart) {
    try {
      const data = JSON.parse(chart.dataset.cites || '{}');
      const years = Object.keys(data).sort();
      if (years.length) {
        const current = chart.dataset.year;
        const labels = years.map(y => (y === current ? y + '*' : y));
        chart.textContent = columnChart(years.map(y => data[y]), labels);
        chart.removeAttribute('aria-hidden');
        chart.setAttribute('role', 'img');
        chart.setAttribute('aria-label', 'Citations per year: ' + years.map(y => `${y}, ${data[y]}`).join('; ') + '.');
      }
    } catch (e) { /* leave the figure empty; the counts are in the text */ }
  }

  document.querySelectorAll('.pub-cites').forEach(el => {
    const v = +el.dataset.cites || 0, max = +el.dataset.max || 0;
    el.setAttribute('aria-label', `${v} citation${v === 1 ? '' : 's'}`);
    el.textContent = rowBar(v, max, 12);
    el.classList.add('is-drawn');
  });
})();
