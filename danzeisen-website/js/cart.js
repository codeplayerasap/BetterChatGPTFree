/* ============================================================
   Danzeisen Shop – Warenkorb
   ============================================================ */
(function () {
  const { byId, cats, euro, placeholder, CART } = window.SHOPCORE;
  const $ = (s, c = document) => c.querySelector(s);
  const root = $('#cartRoot');

  function render() {
    const items = CART.items();
    if (!items.length) {
      root.innerHTML = `<div class="cart-empty">
        <h1>Ihr Warenkorb ist leer</h1>
        <p>Stöbern Sie durch unser Sortiment – über 50 Hilfsmittel warten auf Sie.</p>
        <a class="btn btn--primary btn--lg" href="shop.html">Zum Shop</a></div>`;
      return;
    }
    const rows = items.map(i => {
      const p = byId(i.id); if (!p) return '';
      return `<div class="crow">
        <a class="crow__media" href="product.html?id=${p.id}">${placeholder(p)}</a>
        <div class="crow__info">
          <span class="crow__cat">${cats[p.cat].label}</span>
          <a class="crow__name" href="product.html?id=${p.id}">${p.name}</a>
          ${i.variant ? `<span class="crow__var">${i.variant}</span>` : ''}
        </div>
        <div class="stepper stepper--sm">
          <button data-dec="${p.id}|${i.variant || ''}">–</button><span>${i.qty}</span><button data-inc="${p.id}|${i.variant || ''}">+</button>
        </div>
        <div class="crow__price">${euro(p.price * i.qty)}</div>
        <button class="crow__rm" data-rm="${p.id}|${i.variant || ''}" aria-label="Entfernen">✕</button>
      </div>`;
    }).join('');

    root.innerHTML = `
      <div class="cart-grid">
        <div class="cart-list">${rows}</div>
        <aside class="cart-sum">
          <h2>Zusammenfassung</h2>
          <div class="cart-sum__row"><span>Zwischensumme</span><strong>${euro(CART.total())}</strong></div>
          <div class="cart-sum__row cart-sum__row--muted"><span>Versand</span><span>wird im Checkout berechnet</span></div>
          <a class="btn btn--primary btn--block btn--lg" href="#" id="checkout">Zur Kasse</a>
          <a class="btn btn--ghost btn--block" href="shop.html">Weiter einkaufen</a>
          <p class="cart-note">Viele Artikel sind Kassenleistung – laden Sie beim Checkout Ihr Rezept hoch, wir rechnen mit Ihrer Krankenkasse ab.</p>
        </aside>
      </div>`;

    root.querySelectorAll('[data-inc]').forEach(b => b.addEventListener('click', () => step(b.dataset.inc, +1)));
    root.querySelectorAll('[data-dec]').forEach(b => b.addEventListener('click', () => step(b.dataset.dec, -1)));
    root.querySelectorAll('[data-rm]').forEach(b => b.addEventListener('click', () => {
      const [id, v] = b.dataset.rm.split('|'); CART.remove(id, v); render();
    }));
    $('#checkout').addEventListener('click', e => {
      e.preventDefault();
      alert('Demo-Shop: Die Kasse ist noch nicht angebunden.\n\nFür eine echte Bestellung oder Beratung rufen Sie uns an (089 546712-30) oder besuchen Sie eine Filiale.');
    });
  }

  function step(key, d) {
    const [id, v] = key.split('|');
    const it = CART.items().find(i => i.id === id && (i.variant || '') === v);
    CART.setQty(id, v, (it ? it.qty : 1) + d); render();
  }
  render();
})();
