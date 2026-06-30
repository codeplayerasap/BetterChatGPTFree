/* ============================================================
   Sanitätshaus Danzeisen — UI (Nav, Reveal, Standorte, Form)
   ============================================================ */
(function () {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  $('#year').textContent = new Date().getFullYear();

  /* ---- Scroll: progress, sticky nav, back-to-top ---- */
  const nav = $('#nav'), progress = $('#scrollProgress'), toTop = $('#toTop');
  function onScroll() {
    const h = document.documentElement;
    const sc = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
    progress.style.width = (sc * 100) + '%';
    nav.classList.toggle('is-stuck', h.scrollTop > 8);
    toTop.classList.toggle('show', h.scrollTop > 800);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---- Mobile menu ---- */
  const burger = $('#burger'), navLinks = $('#navLinks');
  function closeMenu() { navLinks.classList.remove('open'); document.body.classList.remove('menu-open'); burger.setAttribute('aria-expanded', 'false'); }
  burger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    document.body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
  });
  $$('#navLinks a').forEach(a => a.addEventListener('click', closeMenu));

  /* ---- Reveal on scroll ---- */
  const io = new IntersectionObserver((es) => {
    es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.14 });
  $$('.reveal').forEach(el => io.observe(el));
  // Sicherung: alles, was beim Laden bereits im Viewport ist, sofort zeigen
  requestAnimationFrame(() => {
    $$('.reveal').forEach(el => { if (el.getBoundingClientRect().top < window.innerHeight * 0.92) el.classList.add('in'); });
  });

  /* ---- Animated counters ---- */
  const cio = new IntersectionObserver((es) => {
    es.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target, target = +el.dataset.count, suffix = el.dataset.suffix ?? '';
      const isYear = target > 1900, from = isYear ? target - 55 : 0, dur = 1500, t0 = performance.now();
      const step = (t) => {
        const p = Math.min((t - t0) / dur, 1), e2 = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(from + (target - from) * e2) + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step); cio.unobserve(el);
    });
  }, { threshold: 0.6 });
  $$('[data-count]').forEach(c => cio.observe(c));

  /* ---- Scrollspy ---- */
  const ids = ['szenen', 'leistungen', 'standorte', 'service', 'kontakt'];
  const map = { szenen: '#szenen', leistungen: '#leistungen', standorte: '#standorte', service: '#service', kontakt: '#kontakt' };
  const spy = new IntersectionObserver((es) => {
    es.forEach(e => {
      if (!e.isIntersecting) return;
      $$('#navLinks a').forEach(a => a.classList.toggle('is-current', a.getAttribute('href') === map[e.target.id]));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  ids.map(i => $('#' + i)).filter(Boolean).forEach(s => spy.observe(s));

  /* ---- Standorte ---- */
  const LOCATIONS = [
    { name: 'Laim · Stammhaus', street: 'Fürstenrieder Str. 34', zip: '80686 München', phone: '089 546712-30', tel: '+498954671230', note: 'Seit 1928 – unser Gründungsstandort mit eigener Werkstatt.', maps: 'https://www.google.com/maps?q=F%C3%BCrstenrieder+Str.+34,+80686+M%C3%BCnchen&output=embed' },
    { name: 'Pasing', street: 'Am Schützeneck 8', zip: '81241 München', phone: '089 829207-10', tel: '+498982920710', note: 'Filiale im Westen – Beratung & Sanitätsfachhandel.', maps: 'https://www.google.com/maps?q=Am+Sch%C3%BCtzeneck+8,+81241+M%C3%BCnchen&output=embed' },
    { name: 'Neuhausen', street: 'Nymphenburger Str. 153', zip: '80634 München', phone: '089 829207-10', tel: '+498982920710', note: 'Zentral gelegen – Kompression & Reha-Beratung.', maps: 'https://www.google.com/maps?q=Nymphenburger+Str.+153,+80634+M%C3%BCnchen&output=embed' }
  ];
  const pin = '<svg viewBox="0 0 24 24"><path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/></svg>';
  const locList = $('#locList'), locDetail = $('#locDetail');
  locList.innerHTML = LOCATIONS.map((l, i) => `
    <button class="loc-item${i === 0 ? ' is-active' : ''}" data-i="${i}" role="tab" aria-selected="${i === 0}">
      <span class="loc-item__pin">${pin}</span>
      <span><strong>${l.name}</strong><span class="loc-item__sub">${l.street}</span></span>
    </button>`).join('');
  function renderLoc(i) {
    const l = LOCATIONS[i];
    locDetail.innerHTML = `
      <div class="loc-map"><iframe loading="lazy" title="Karte ${l.name}" src="${l.maps}" referrerpolicy="no-referrer-when-downgrade"></iframe></div>
      <div class="loc-body">
        <h3>${l.name}</h3>
        <p style="color:var(--muted);margin:.2rem 0 0">${l.note}</p>
        <div class="loc-rows">
          <div>${l.street}<br>${l.zip}</div>
          <div><a href="tel:${l.tel}">${l.phone}</a></div>
          <div>Mo–Fr 09–13 &amp; 14–18 · Sa 09–13</div>
        </div>
        <div class="loc-actions">
          <a class="btn btn--primary" target="_blank" rel="noopener" href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(l.street + ', ' + l.zip)}">Route planen</a>
          <a class="btn btn--ghost" href="tel:${l.tel}">Anrufen</a>
        </div>
      </div>`;
  }
  renderLoc(0);
  $$('#locList .loc-item').forEach(b => b.addEventListener('click', () => {
    $$('#locList .loc-item').forEach(x => { x.classList.remove('is-active'); x.setAttribute('aria-selected', 'false'); });
    b.classList.add('is-active'); b.setAttribute('aria-selected', 'true'); renderLoc(+b.dataset.i);
  }));

  /* ---- Toast + Kontaktformular ---- */
  let toastTimer;
  function toast(m) { const t = $('#toast'); t.textContent = m; t.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 3400); }
  const cForm = $('#contactForm');
  cForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const note = $('#contactNote');
    const name = $('#cf-name').value.trim(), mail = $('#cf-mail').value.trim(), phone = $('#cf-phone').value.trim();
    const agreed = cForm.querySelector('.check input').checked;
    if (!name) { note.textContent = 'Bitte geben Sie Ihren Namen an.'; note.className = 'form-note err'; return; }
    if (!mail && !phone) { note.textContent = 'Bitte Telefon oder E-Mail angeben.'; note.className = 'form-note err'; return; }
    if (!agreed) { note.textContent = 'Bitte stimmen Sie der Kontaktaufnahme zu.'; note.className = 'form-note err'; return; }
    note.textContent = 'Vielen Dank! Ihre Nachricht ist bei uns – wir melden uns zeitnah.'; note.className = 'form-note ok';
    cForm.reset(); toast('Nachricht gesendet ✓');
  });
})();
