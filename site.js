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

// Conversion events through Vercel Web Analytics (cookieless, already loaded on
// every page; window.va is the queue stub each page declares in its head).
// booking_click: any link to a booking page (watchmenhq.elyonsci.ai/book/...). email_click: any mailto link.
// `location` is the page path plus header/nav/footer or the nearest section id, so a
// report can tell which button produced the booking. Nothing typed is sent.
(function () {
  function where(a) {
    var tag = a.closest('header') ? 'header'
      : a.closest('nav') ? 'nav'
      : a.closest('footer') ? 'footer'
      : (a.closest('section[id]') || {}).id || 'page';
    return (location.pathname.replace(/\/$/, '') || '/home') + '#' + tag;
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || typeof window.va !== 'function') return;
    var href = a.getAttribute('href') || '';
    var name = /^https:\/\/([a-z0-9-]+\.)?elyonsci\.ai\/book\//i.test(href) ? 'booking_click'
      : /^mailto:/i.test(href) ? 'email_click'
      : null;
    if (name) window.va('event', { name: name, data: { location: where(a) } });
  }, true);
})();
