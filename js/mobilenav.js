/* Mobile-Navigation (Burger) für die Varianten-Startseiten.
   Erwartet #burger und #navLinks; schließt beim Linkklick. */
(function () {
  'use strict';
  var b = document.getElementById('burger'), l = document.getElementById('navLinks');
  if (!b || !l) return;
  b.addEventListener('click', function () {
    var o = l.classList.toggle('open');
    document.body.classList.toggle('menu-open', o);
    b.setAttribute('aria-expanded', String(o));
  });
  l.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      l.classList.remove('open');
      document.body.classList.remove('menu-open');
      b.setAttribute('aria-expanded', 'false');
    });
  });
})();
