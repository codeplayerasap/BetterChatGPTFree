/* ============================================================
   Danzeisen Shop – Produktdetailseite (?id=slug)
   ============================================================ */
(function () {
  const { byId, products, cats, euro, placeholder, CART } = window.SHOPCORE;
  const $ = (s, c = document) => c.querySelector(s);
  const root = $('#product');
  const id = new URLSearchParams(location.search).get('id');
  const p = byId(id);

  if (!p) {
    root.innerHTML = '<div class="wrap" style="padding:120px 0;text-align:center"><h1>Artikel nicht gefunden</h1><p><a class="btn btn--primary" href="shop.html">Zum Shop</a></p></div>';
    return;
  }
  document.title = p.name + ' · Danzeisen Shop';
  const cat = cats[p.cat];

  const boiler = {
    kompression: 'Medizinische Kompression wirkt von unten nach oben und unterstützt den venösen Rückfluss. Wir messen im Haus exakt an und rechnen mit allen Krankenkassen ab.',
    orthesen: 'Orthesen und Bandagen führen das Gelenk, entlasten gezielt und geben Sicherheit – ob nach Verletzung, bei Arthrose oder im Sport. Passgenau angepasst.',
    einlagen: 'Aus unserer eigenen Werkstatt – nach Fußabdruck und Ganganalyse gefertigt. Für ein ausgewogenes Gangbild im Alltag wie im Sport.',
    reha: 'Reha-Hilfsmittel passen wir individuell an, liefern nach Hause und übernehmen den Schriftverkehr mit der Kasse. Für mehr Selbstständigkeit.',
    pflege: 'Durchdachte Hilfsmittel, die den Alltag zu Hause erleichtern und die Selbstständigkeit erhalten – auf Wunsch mit Beratung vor Ort.',
    frau: 'Diskrete, einfühlsame Versorgung in separaten Räumen. Wir nehmen uns Zeit und finden gemeinsam die passende Lösung.',
    fuss: 'Kleine Helfer mit großer Wirkung für gesunde, schmerzfreie Füße – im Alltag und beim Sport.'
  }[p.cat];

  const optionsHTML = (p.opt || []).map((o, i) => `
    <label class="opt"><span>${o[0]}</span>
      <select data-opt="${i}">${o[1].map(v => `<option>${v}</option>`).join('')}</select>
    </label>`).join('');

  const related = products.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 4);

  root.innerHTML = `
    <nav class="crumbs wrap"><a href="index.html">Start</a> › <a href="shop.html">Shop</a> ›
      <a href="shop.html?cat=${p.cat}">${cat.label}</a> › <span>${p.name}</span></nav>
    <div class="wrap pdp">
      <div class="pdp__media">
        <div class="pdp__main" id="pdpMain">${placeholder(p)}</div>
        <div class="pdp__thumbs">
          ${[0, 1, 2].map(i => `<div class="pdp__thumb${i === 0 ? ' is-active' : ''}">${placeholder(p)}</div>`).join('')}
        </div>
      </div>
      <div class="pdp__info">
        <span class="pdp__cat">${cat.label}</span>
        <h1>${p.name}</h1>
        <p class="pdp__desc">${p.desc}</p>
        <div class="pdp__price">${euro(p.price)} ${p.kasse ? '<span class="pdp__kasse">✓ Kassenleistung · auch auf Rezept</span>' : '<span class="pdp__free">frei verkäuflich</span>'}</div>
        <div class="pdp__opts">${optionsHTML}</div>
        <div class="pdp__qty">
          <label>Menge</label>
          <div class="stepper"><button data-step="-1" aria-label="weniger">–</button><input id="pdpQty" type="number" value="1" min="1" /><button data-step="1" aria-label="mehr">+</button></div>
        </div>
        <div class="pdp__actions">
          <button class="btn btn--primary btn--lg" id="pdpAdd">In den Warenkorb</button>
          <a class="btn btn--ghost btn--lg" href="index.html#kontakt">Beraten lassen</a>
        </div>
        <ul class="pdp__usp">
          <li>✓ Anpassung & Beratung in Laim, Pasing & Neuhausen</li>
          <li>✓ Abrechnung mit allen Krankenkassen</li>
          <li>✓ Abholung in der Filiale möglich</li>
        </ul>
        <div class="pdp__long">
          <h3>Produktinfo</h3>
          <p>${p.desc} ${boiler}</p>
          <table class="pdp__spec">
            <tr><th>Kategorie</th><td>${cat.label}</td></tr>
            <tr><th>Verordnungsfähig</th><td>${p.kasse ? 'Ja, auf ärztliches Rezept' : 'Nein (frei verkäuflich)'}</td></tr>
            <tr><th>Hilfsmittelnummer</th><td>${p.kasse ? 'auf Anfrage' : '–'}</td></tr>
            <tr><th>Merkmale</th><td>${p.tags.join(' · ')}</td></tr>
          </table>
        </div>
      </div>
    </div>
    ${related.length ? `<section class="wrap related">
      <h2>Passt dazu</h2>
      <div class="related__grid">
        ${related.map(r => `<a class="rcard" href="product.html?id=${r.id}">
          <div class="rcard__media">${placeholder(r)}</div>
          <strong>${r.name}</strong><span>${euro(r.price)}</span></a>`).join('')}
      </div></section>` : ''}
  `;

  // Thumbnails aktiv
  root.querySelectorAll('.pdp__thumb').forEach(t => t.addEventListener('click', () => {
    root.querySelectorAll('.pdp__thumb').forEach(x => x.classList.remove('is-active'));
    t.classList.add('is-active');
  }));
  // Stepper
  const qty = $('#pdpQty');
  root.querySelectorAll('[data-step]').forEach(b => b.addEventListener('click', () => {
    qty.value = Math.max(1, (parseInt(qty.value) || 1) + parseInt(b.dataset.step));
  }));
  // In den Warenkorb
  $('#pdpAdd').addEventListener('click', () => {
    const variant = Array.from(root.querySelectorAll('[data-opt]')).map(s => s.value).join(' · ');
    CART.add(p.id, Math.max(1, parseInt(qty.value) || 1), variant);
    const btn = $('#pdpAdd'); btn.textContent = '✓ Im Warenkorb';
    setTimeout(() => btn.textContent = 'In den Warenkorb', 1600);
  });
})();
