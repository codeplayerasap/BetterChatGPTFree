/* ============================================================
   Danzeisen Shop – Kern: Platzhalter, Warenkorb, Helfer
   (klassisches Script, lädt nach shop-data.js)
   ============================================================ */
window.SHOPCORE = (function () {
  const { cats, products } = window.SHOP;
  const byId = id => products.find(p => p.id === id);
  const euro = n => n.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });

  // farbiger SVG-Platzhalter statt Foto
  function placeholder(p) {
    const c = cats[p.cat];
    const label = p.name.replace(/&/g, '&amp;');
    return `<svg class="ph" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${label}">
      <defs><linearGradient id="g-${p.id}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${c.color}"/><stop offset="1" stop-color="${c.c2}"/></linearGradient></defs>
      <rect width="400" height="300" fill="url(#g-${p.id})"/>
      <g fill="none" stroke="rgba(255,255,255,.9)" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" transform="translate(200 118) scale(3.4) translate(-12 -12)">
        <path d="${c.icon}"/></g>
      <text x="200" y="242" text-anchor="middle" fill="#fff" font-family="Inter,sans-serif" font-size="19" font-weight="700" opacity=".95">${c.label}</text>
      <text x="200" y="268" text-anchor="middle" fill="rgba(255,255,255,.85)" font-family="Inter,sans-serif" font-size="14">Platzhalter · Foto folgt</text>
    </svg>`;
  }

  /* ---------- Warenkorb (localStorage) ---------- */
  const KEY = 'danz-cart';
  function read() { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } }
  function write(c) { localStorage.setItem(KEY, JSON.stringify(c)); updateBadges(); }
  const CART = {
    items: read,
    count() { return read().reduce((n, i) => n + i.qty, 0); },
    total() { return read().reduce((s, i) => { const p = byId(i.id); return s + (p ? p.price * i.qty : 0); }, 0); },
    add(id, qty = 1, variant = '') {
      const c = read(); const key = id + '|' + variant;
      const ex = c.find(i => (i.id + '|' + (i.variant || '')) === key);
      if (ex) ex.qty += qty; else c.push({ id, qty, variant });
      write(c);
    },
    setQty(id, variant, qty) {
      let c = read(); const it = c.find(i => i.id === id && (i.variant || '') === (variant || ''));
      if (it) { it.qty = qty; if (it.qty <= 0) c = c.filter(x => x !== it); }
      write(c);
    },
    remove(id, variant) { write(read().filter(i => !(i.id === id && (i.variant || '') === (variant || '')))); },
    clear() { write([]); }
  };
  function updateBadges() {
    const n = CART.count();
    document.querySelectorAll('[data-cart-count]').forEach(el => {
      el.textContent = n; el.style.display = n > 0 ? '' : 'none';
    });
  }
  document.addEventListener('DOMContentLoaded', updateBadges);

  return { cats, products, byId, euro, placeholder, CART, updateBadges };
})();
