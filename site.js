// Site chrome behaviour shared by every page: header background on scroll,
// and the mobile menu (toggle, close on link, Escape, or widening past the breakpoint).
(function () {
  var nav = document.getElementById('wmNav');
  var burger = document.getElementById('wmBurger');
  var menu = document.getElementById('wmMenu');
  if (!nav || !burger || !menu) return;

  function onScroll() { nav.classList.toggle('scrolled', window.scrollY > 40); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function setOpen(open) {
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    menu.classList.toggle('open', open);
    nav.classList.toggle('menu-open', open);
  }
  burger.addEventListener('click', function () {
    setOpen(burger.getAttribute('aria-expanded') !== 'true');
  });
  menu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { setOpen(false); });
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
  window.matchMedia('(min-width: 1081px)').addEventListener('change', function (e) {
    if (e.matches) setOpen(false);
  });
})();
