/* ============================================================
   Sanitätshaus Danzeisen – Interaktion (Vanilla JS)
   ============================================================ */
(function () {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* ---------- Jahr im Footer ---------- */
  $('#year').textContent = new Date().getFullYear();

  /* ---------- Theme Toggle (mit Speicherung) ---------- */
  const root = document.body;
  const saved = localStorage.getItem('dz-theme');
  if (saved) root.setAttribute('data-theme', saved);
  else if (window.matchMedia('(prefers-color-scheme: dark)').matches)
    root.setAttribute('data-theme', 'dark');

  $('#themeToggle').addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('dz-theme', next);
  });

  /* ---------- Scroll-Progress + sticky nav + back-to-top ---------- */
  const nav = $('#nav');
  const progress = $('#scrollProgress');
  const toTop = $('#toTop');
  const onScroll = () => {
    const h = document.documentElement;
    const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight);
    progress.style.width = (scrolled * 100) + '%';
    nav.classList.toggle('is-stuck', h.scrollTop > 8);
    toTop.classList.toggle('show', h.scrollTop > 600);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- Mobile Menü ---------- */
  const burger = $('#burger');
  const navLinks = $('#navLinks');
  const closeMenu = () => {
    navLinks.classList.remove('open');
    root.classList.remove('menu-open');
    burger.setAttribute('aria-expanded', 'false');
  };
  burger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    root.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
  });
  $$('#navLinks a').forEach(a => a.addEventListener('click', closeMenu));

  /* ---------- Öffnungszeiten-Status (live) ---------- */
  function updateOpenStatus() {
    const badge = $('#openStatus');
    const now = new Date();
    const day = now.getDay(); // 0 So … 6 Sa
    const mins = now.getHours() * 60 + now.getMinutes();
    let open = false;
    if (day >= 1 && day <= 5) {
      open = (mins >= 540 && mins < 780) || (mins >= 840 && mins < 1080); // 9-13, 14-18
    } else if (day === 6) {
      open = mins >= 540 && mins < 780; // Sa 9-13
    }
    badge.textContent = open ? 'Jetzt geöffnet' : 'Aktuell geschlossen';
    badge.classList.toggle('is-open', open);
    badge.classList.toggle('is-closed', !open);
  }
  updateOpenStatus();
  setInterval(updateOpenStatus, 60000);

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  $$('.reveal').forEach(el => io.observe(el));

  /* ---------- Animierte Zähler ---------- */
  const counters = $$('.stat__num');
  const cio = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = +el.dataset.count;
      const suffix = el.dataset.suffix || '';
      const isYear = target > 1900;
      const dur = 1400; const start = performance.now();
      const from = isYear ? target - 60 : 0;
      const step = (t) => {
        const p = Math.min((t - start) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        const val = Math.round(from + (target - from) * ease);
        el.textContent = val + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      cio.unobserve(el);
    });
  }, { threshold: 0.6 });
  counters.forEach(c => cio.observe(c));

  /* ---------- Produktwelten: Draw-on-Scroll ---------- */
  // Pfadlänge je Linie messen, damit die Zeichen-Animation sauber läuft
  $$('.illu').forEach(svgEl => {
    $$('path, circle, line', svgEl).forEach(p => {
      if (p.classList.contains('fillp') || p.closest('.ping')) return;
      let len;
      try { len = p.getTotalLength(); } catch (e) { len = 900; }
      if (len && isFinite(len)) {
        // Nur die CSS-Variable setzen – Dash/Offset steuert das Stylesheet,
        // damit die .in-Regel den Offset auf 0 animieren kann.
        p.style.setProperty('--len', Math.ceil(len) + 1);
      }
    });
  });
  const showIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); showIO.unobserve(e.target); }
    });
  }, { threshold: 0.3 });
  $$('.showcase').forEach(s => showIO.observe(s));

  /* ---------- Scrollspy ---------- */
  const sections = ['leistungen','sortiment','produktwelten','reha','standorte','ablauf','kontakt']
    .map(id => $('#' + id)).filter(Boolean);
  const spy = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const id = e.target.id;
      $$('#navLinks a').forEach(a =>
        a.classList.toggle('is-current', a.getAttribute('href') === '#' + id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(s => spy.observe(s));

  /* ---------- Toast ---------- */
  let toastTimer;
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 3400);
  }

  /* ============================================================
     SORTIMENT-KATALOG
     ============================================================ */
  const ICONS = {
    sock: '<path d="M8 3h6v6c0 1 .3 2 1.2 2.8l3 3a3.5 3.5 0 0 1-5 5l-5.5-5.5A4 4 0 0 1 6.5 11V3"/><path d="M8 3h6"/>',
    bandage: '<rect x="3" y="8" width="18" height="8" rx="4" transform="rotate(45 12 12)"/><path d="M9 9l6 6M12 6l6 6"/>',
    foot: '<path d="M7 4c2 0 4 2 4 6s-1 6-1 8-1 2-2 2-2-1-2-3 0-3-1-5-1-3 1-5 1-3 2-3z"/><circle cx="14" cy="6" r="1"/><circle cx="16" cy="8" r="1"/><circle cx="17" cy="11" r="1"/>',
    wheelchair: '<circle cx="9" cy="18" r="3"/><path d="M9 5a2 2 0 1 1 0-.01M9 7v5h5l2 5M9 12h6"/>',
    walker: '<path d="M6 4v16M18 4v16M6 8h12M5 20h3M16 20h3"/>',
    bed: '<path d="M3 9v9M3 13h18v5M21 13v5M7 13V9a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4"/>',
    breast: '<path d="M12 4c4 0 8 3 8 8a8 8 0 0 1-16 0c0-5 4-8 8-8z"/><circle cx="12" cy="13" r="2"/>',
    baby: '<circle cx="12" cy="8" r="3"/><path d="M6 21c0-4 2.7-6 6-6s6 2 6 6"/><path d="M9 8h.01M15 8h.01"/>',
    pill: '<rect x="3" y="9" width="18" height="6" rx="3" transform="rotate(45 12 12)"/><path d="M8.5 8.5l7 7"/>',
    heart: '<path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z"/>',
    glove: '<path d="M7 11V5a1.5 1.5 0 0 1 3 0v5M10 10V4a1.5 1.5 0 0 1 3 0v6M13 10V6a1.5 1.5 0 0 1 3 0v6c0 4-2 8-6 8s-6-3-6-6l1.5-2"/>',
    swim: '<path d="M2 18c2 0 2-1.5 4-1.5s2 1.5 4 1.5 2-1.5 4-1.5 2 1.5 4 1.5M7 12l4-4 3 2M14 6a1.5 1.5 0 1 1-.01 0"/>'
  };
  function svg(name){ return `<svg viewBox="0 0 24 24">${ICONS[name]||ICONS.heart}</svg>`; }

  const PRODUCTS = [
    { cat:'kompression', icon:'sock', tag:'Kompression', title:'Kompressionsstrümpfe',
      text:'Medizinische Strümpfe bei Venenleiden – als Serien- oder Maßanfertigung, in vielen Farben.',
      tags:['Venen','Reisestrümpfe','Maßanfertigung'] },
    { cat:'kompression', icon:'bandage', tag:'Kompression', title:'Lymph- & Lipödem',
      text:'Spezialversorgung und adaptive Kompressionssysteme für ödematöse Erkrankungen.',
      tags:['Flachstrick','Adaptiv','Manuell anlegbar'] },
    { cat:'orthopaedie', icon:'bandage', tag:'Orthopädie', title:'Bandagen & Orthesen',
      text:'Stabilisierende Bandagen und Orthesen für Knie, Sprunggelenk, Schulter, Hand & Rücken.',
      tags:['Knie','Rücken','Sport'] },
    { cat:'orthopaedie', icon:'foot', tag:'Orthopädie', title:'Orthopädische Einlagen',
      text:'Maßgefertigte Einlagen aus eigener Werkstatt – nach Fußabdruck und Ganganalyse.',
      tags:['Maßanfertigung','Ganganalyse','Sport'] },
    { cat:'orthopaedie', icon:'foot', tag:'Orthopädie', title:'Fußpflege & Komfort',
      text:'Produkte zur täglichen Fußpflege, Druckschutz und komfortable Hilfsmittel.',
      tags:['Druckschutz','Pflege'] },
    { cat:'reha', icon:'wheelchair', tag:'Reha', title:'Rollstühle',
      text:'Standard-, Leichtgewicht- und Aktivrollstühle. Individuell angepasst und probegefahren.',
      tags:['Aktiv','Leichtgewicht','Anpassung'] },
    { cat:'reha', icon:'walker', tag:'Reha', title:'Rollatoren & Gehhilfen',
      text:'Sichere Mobilität für drinnen und draußen – faltbar, leicht und stabil.',
      tags:['Indoor','Outdoor','Faltbar'] },
    { cat:'reha', icon:'bed', tag:'Reha', title:'Pflegebetten',
      text:'Komfortable Pflegebetten inkl. Lieferung, Aufbau und Einweisung bei Ihnen zu Hause.',
      tags:['Lieferung','Aufbau','Hausbesuch'] },
    { cat:'pflege', icon:'glove', tag:'Pflege', title:'Häusliche Pflege',
      text:'Pflegehilfsmittel und Verbrauchsartikel für die Versorgung im eigenen Zuhause.',
      tags:['Verbrauch','Hygiene','Box'] },
    { cat:'pflege', icon:'heart', tag:'Pflege', title:'Alltags- & Geriatriehilfen',
      text:'Praktische Helfer, die den Alltag erleichtern und Selbstständigkeit erhalten.',
      tags:['Greifhilfen','Anziehhilfen','Bad'] },
    { cat:'frau', icon:'breast', tag:'Frau', title:'Brustprothesen',
      text:'Diskrete, einfühlsame Versorgung nach Brustoperationen inkl. passender Wäsche.',
      tags:['Diskret','Wäsche','Beratung'] },
    { cat:'frau', icon:'baby', tag:'Familie', title:'Mutter & Kind',
      text:'Produkte für werdende und stillende Mütter – von Stützmieder bis Stillhilfe.',
      tags:['Schwangerschaft','Stillzeit'] },
    { cat:'frau', icon:'swim', tag:'Frau', title:'Bademode & Accessoires',
      text:'Modische Bademoden und Accessoires – auch passend zur Prothesenversorgung.',
      tags:['Bademode','Mode'] }
  ];

  const catalog = $('#catalog');
  const empty = $('#catalogEmpty');
  let activeFilter = 'all';
  let query = '';

  function renderCatalog() {
    const q = query.trim().toLowerCase();
    const items = PRODUCTS.filter(p => {
      const okCat = activeFilter === 'all' || p.cat === activeFilter;
      const okQ = !q || (p.title + ' ' + p.text + ' ' + p.tags.join(' ')).toLowerCase().includes(q);
      return okCat && okQ;
    });
    catalog.innerHTML = items.map(p => `
      <article class="card" data-cat="${p.cat}">
        <div class="card__top">
          <span class="card__icon">${svg(p.icon)}</span>
          <span class="card__tag">${p.tag}</span>
        </div>
        <h3>${p.title}</h3>
        <p>${p.text}</p>
        <ul class="card__list">${p.tags.map(t => `<li>${t}</li>`).join('')}</ul>
        <a class="card__link" href="#kontakt">Beraten lassen
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </a>
      </article>`).join('');
    empty.hidden = items.length !== 0;
    // staggered fade-in
    $$('.card', catalog).forEach((c, i) => setTimeout(() => c.classList.add('in'), 40 * i));
  }

  $$('#filters .chip').forEach(chip => {
    chip.addEventListener('click', () => {
      $$('#filters .chip').forEach(c => c.classList.remove('is-active'));
      chip.classList.add('is-active');
      activeFilter = chip.dataset.filter;
      renderCatalog();
    });
  });
  let searchTimer;
  $('#catalogSearch').addEventListener('input', (e) => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => { query = e.target.value; renderCatalog(); }, 160);
  });
  renderCatalog();

  /* ============================================================
     STANDORTE
     ============================================================ */
  const LOCATIONS = [
    { name:'Laim · Stammhaus', street:'Fürstenrieder Str. 34', zip:'80686 München',
      phone:'089 546712-30', tel:'+498954671230',
      note:'Seit 1928 – unser Gründungsstandort mit Werkstatt.',
      maps:'https://www.google.com/maps?q=F%C3%BCrstenrieder+Str.+34,+80686+M%C3%BCnchen&output=embed' },
    { name:'Pasing', street:'Am Schützeneck 8', zip:'81241 München',
      phone:'089 829207-10', tel:'+498982920710',
      note:'Filiale im Westen – Beratung & Sanitätsfachhandel.',
      maps:'https://www.google.com/maps?q=Am+Sch%C3%BCtzeneck+8,+81241+M%C3%BCnchen&output=embed' },
    { name:'Neuhausen', street:'Nymphenburger Str. 153', zip:'80634 München',
      phone:'089 829207-10', tel:'+498982920710',
      note:'Zentral gelegen – Kompression & Reha-Beratung.',
      maps:'https://www.google.com/maps?q=Nymphenburger+Str.+153,+80634+M%C3%BCnchen&output=embed' }
  ];

  const locList = $('#locationList');
  const locDetail = $('#locationDetail');
  locList.innerHTML = LOCATIONS.map((l, i) => `
    <button class="loc-item${i===0?' is-active':''}" data-i="${i}" role="tab" aria-selected="${i===0}">
      <span class="loc-item__pin"><svg viewBox="0 0 24 24"><path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/></svg></span>
      <span><strong>${l.name}</strong><span class="loc-item__sub">${l.street}</span></span>
    </button>`).join('');

  function renderLoc(i) {
    const l = LOCATIONS[i];
    locDetail.innerHTML = `
      <div class="loc-detail__map">
        <iframe loading="lazy" title="Karte ${l.name}" src="${l.maps}" referrerpolicy="no-referrer-when-downgrade"></iframe>
      </div>
      <div class="loc-detail__body">
        <h3>${l.name}</h3>
        <p class="muted">${l.note}</p>
        <div class="loc-detail__rows">
          <div class="loc-row"><svg class="ic" viewBox="0 0 24 24"><path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/></svg><span>${l.street}<br>${l.zip}</span></div>
          <div class="loc-row"><svg class="ic" viewBox="0 0 24 24"><path d="M6.6 10.8a15.6 15.6 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.58 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.4 11.4 0 0 0 .58 3.6 1 1 0 0 1-.25 1z"/></svg><a href="tel:${l.tel}">${l.phone}</a></div>
          <div class="loc-row"><svg class="ic" viewBox="0 0 24 24"><path d="M12 8v5l3 2"/><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/></svg><span>Mo–Fr 09–13 &amp; 14–18 · Sa 09–13</span></div>
        </div>
        <div class="loc-detail__actions">
          <a class="btn btn--primary" target="_blank" rel="noopener" href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(l.street + ', ' + l.zip)}">Route planen</a>
          <a class="btn btn--ghost" href="tel:${l.tel}">Anrufen</a>
        </div>
      </div>`;
  }
  renderLoc(0);
  $$('#locationList .loc-item').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('#locationList .loc-item').forEach(b => { b.classList.remove('is-active'); b.setAttribute('aria-selected','false'); });
      btn.classList.add('is-active'); btn.setAttribute('aria-selected','true');
      renderLoc(+btn.dataset.i);
    });
  });

  /* ============================================================
     TESTIMONIALS
     ============================================================ */
  const TESTI = [
    { stars:5, text:'Endlich ein Sanitätshaus, das sich wirklich Zeit nimmt. Meine Kompressionsstrümpfe passen perfekt.', name:'Brigitte H.', role:'Kundin aus Laim' },
    { stars:5, text:'Das REHA-Team hat den Rollstuhl meiner Mutter angepasst und alles mit der Kasse geregelt. Top!', name:'Thomas R.', role:'Angehöriger' },
    { stars:5, text:'Diskrete, herzliche Beratung nach meiner OP. Ich habe mich rundum gut aufgehoben gefühlt.', name:'Sabine K.', role:'Kundin aus Pasing' },
    { stars:5, text:'Schnelle Einlagen-Anfertigung und freundliches Team. Komme immer wieder gern her.', name:'Michael B.', role:'Läufer aus Neuhausen' }
  ];
  const track = $('#testiTrack');
  const dots = $('#testiDots');
  track.innerHTML = TESTI.map(t => `
    <div class="testi__slide">
      <div class="testi__quote">
        <div class="testi__stars">${'★'.repeat(t.stars)}</div>
        <p class="testi__text">„${t.text}“</p>
        <div class="testi__author">
          <span class="testi__avatar">${t.name.charAt(0)}</span>
          <span><strong>${t.name}</strong><small>${t.role}</small></span>
        </div>
      </div>
    </div>`).join('');
  dots.innerHTML = TESTI.map((_, i) => `<button aria-label="Stimme ${i+1}" class="${i===0?'is-active':''}"></button>`).join('');
  let ti = 0;
  function goTesti(n) {
    ti = (n + TESTI.length) % TESTI.length;
    track.style.transform = `translateX(-${ti*100}%)`;
    $$('#testiDots button').forEach((d, i) => d.classList.toggle('is-active', i === ti));
  }
  $('#testiNext').addEventListener('click', () => { goTesti(ti+1); restart(); });
  $('#testiPrev').addEventListener('click', () => { goTesti(ti-1); restart(); });
  $$('#testiDots button').forEach((d, i) => d.addEventListener('click', () => { goTesti(i); restart(); }));
  let auto = setInterval(() => goTesti(ti+1), 5500);
  function restart() { clearInterval(auto); auto = setInterval(() => goTesti(ti+1), 5500); }

  /* ============================================================
     FORMULARE (Demo – kein Backend)
     ============================================================ */
  $('#quickForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const f = e.target;
    if (!f.topic.value || !f.contact.value.trim()) { toast('Bitte Anliegen und Kontakt angeben.'); return; }
    f.reset();
    toast('Danke! Wir rufen Sie schnellstmöglich zurück. 📞');
  });

  const cForm = $('#contactForm');
  cForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const note = $('#contactNote');
    const name = $('#cf-name').value.trim();
    const mail = $('#cf-mail').value.trim();
    const phone = $('#cf-phone').value.trim();
    const agreed = cForm.querySelector('.check input').checked;
    if (!name) { note.textContent = 'Bitte geben Sie Ihren Namen an.'; note.className = 'form-note err'; return; }
    if (!mail && !phone) { note.textContent = 'Bitte Telefon oder E-Mail angeben.'; note.className = 'form-note err'; return; }
    if (!agreed) { note.textContent = 'Bitte stimmen Sie der Kontaktaufnahme zu.'; note.className = 'form-note err'; return; }
    note.textContent = 'Vielen Dank! Ihre Nachricht ist bei uns – wir melden uns zeitnah.';
    note.className = 'form-note ok';
    cForm.reset();
    toast('Nachricht gesendet ✓');
  });
})();
