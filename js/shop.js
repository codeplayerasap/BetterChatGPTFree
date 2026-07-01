/* ============================================================
   Danzeisen Shop – Übersichtsseite
   ============================================================ */
(function () {
  const { products, cats, euro, placeholder, CART } = window.SHOPCORE;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  let filter = new URLSearchParams(location.search).get('cat') || 'all';
  let query = '';
  let sort = 'rel';

  // Filter-Chips
  const filters = $('#shopFilters');
  const chips = [['all', 'Alles'], ...Object.entries(cats).map(([k, v]) => [k, v.label])];
  filters.innerHTML = chips.map(([k, l]) =>
    `<button class="chip${k === filter ? ' is-active' : ''}" data-cat="${k}">${l}</button>`).join('');
  $$('#shopFilters .chip').forEach(b => b.addEventListener('click', () => {
    filter = b.dataset.cat;
    $$('#shopFilters .chip').forEach(x => x.classList.toggle('is-active', x === b));
    render();
  }));

  $('#shopSearch').addEventListener('input', e => { query = e.target.value.toLowerCase(); render(); });
  $('#shopSort').addEventListener('change', e => { sort = e.target.value; render(); });

  const grid = $('#shopGrid'), empty = $('#shopEmpty'), countEl = $('#shopCount');

  function render() {
    let list = products.filter(p => {
      const okc = filter === 'all' || p.cat === filter;
      const q = query.trim();
      const okq = !q || (p.name + ' ' + p.desc + ' ' + p.tags.join(' ') + ' ' + cats[p.cat].label).toLowerCase().includes(q);
      return okc && okq;
    });
    if (sort === 'price-asc') list = list.slice().sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') list = list.slice().sort((a, b) => b.price - a.price);
    if (sort === 'name') list = list.slice().sort((a, b) => a.name.localeCompare(b.name, 'de'));

    countEl.textContent = list.length + (list.length === 1 ? ' Artikel' : ' Artikel');
    empty.hidden = list.length !== 0;
    grid.innerHTML = list.map(p => `
      <article class="pcard">
        <a class="pcard__media" href="product.html?id=${p.id}" aria-label="${p.name}">
          ${placeholder(p)}
          ${p.kasse ? '<span class="pcard__flag">Kassenleistung</span>' : ''}
        </a>
        <div class="pcard__body">
          <span class="pcard__cat">${cats[p.cat].label}</span>
          <h3><a href="product.html?id=${p.id}">${p.name}</a></h3>
          <p>${p.desc}</p>
          <div class="pcard__foot">
            <span class="pcard__price">${p.price % 1 === 0 || true ? 'ab ' : ''}${euro(p.price)}</span>
            <button class="btn btn--primary btn--sm" data-add="${p.id}">In den Warenkorb</button>
          </div>
        </div>
      </article>`).join('');
    $$('[data-add]', grid).forEach(b => b.addEventListener('click', () => {
      CART.add(b.dataset.add, 1);
      b.textContent = '✓ Hinzugefügt';
      setTimeout(() => b.textContent = 'In den Warenkorb', 1400);
    }));
  }
  render();
})();
