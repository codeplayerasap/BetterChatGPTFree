/* Kleine Nav-Helfer für die Shop-Seiten (sticky, Burger, Jahr) */
(function () {
  const nav = document.getElementById('nav');
  if (nav) {
    const st = () => nav.classList.toggle('is-stuck', window.scrollY > 8);
    window.addEventListener('scroll', st, { passive: true }); st();
  }
  const burger = document.getElementById('burger'), links = document.getElementById('navLinks');
  if (burger && links) {
    burger.addEventListener('click', () => {
      const o = links.classList.toggle('open');
      document.body.classList.toggle('menu-open', o);
      burger.setAttribute('aria-expanded', String(o));
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      links.classList.remove('open'); document.body.classList.remove('menu-open');
    }));
  }
  const y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();
})();
