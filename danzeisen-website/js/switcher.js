/* Varianten-Switcher: Logo-Klick öffnet/schließt das Dropdown.
   Schließt bei Klick außerhalb und mit Escape. */
(function () {
  'use strict';
  var root = document.querySelector('.vswitch');
  if (!root) return;
  var btn = root.querySelector('.vswitch__btn');

  function setOpen(open) {
    root.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
  }
  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    setOpen(!root.classList.contains('open'));
  });
  document.addEventListener('click', function (e) {
    if (!root.contains(e.target)) setOpen(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { setOpen(false); btn.focus(); }
  });
})();
