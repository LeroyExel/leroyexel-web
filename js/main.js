// Leroy Exel — subtiele animaties (hero, scroll-reveal, menu, jaar, actieve navigatie)
(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Hero-animatie: start kort na laden, alleen opacity + kleine translateY via CSS
  function startHero() {
    if (reduceMotion) {
      document.querySelectorAll('.anim-hero').forEach(function (el) {
        el.style.opacity = '1';
      });
      return;
    }
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        document.body.classList.add('is-loaded');
      });
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startHero);
  } else {
    startHero();
  }

  // Scroll-reveal: één keer animeren, zonder JS blijft alles leesbaar
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
  revealEls.forEach(function (el) {
    var delay = el.getAttribute('data-delay');
    if (delay) el.style.setProperty('--rd', delay + 'ms');
  });

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  } else if (revealEls.length) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  // Mobiel menu met vloeiende CSS-overgang
  var toggle = document.getElementById('menu-toggle');
  var nav = document.getElementById('site-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Menu sluiten' : 'Menu openen');
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Menu openen');
      }
    });
  }

  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  // Actieve navigatiestatus bij scrollen
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));
  var sections = ['home', 'projecten', 'over-mij', 'contact']
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          links.forEach(function (a) {
            a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id);
          });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(function (s) { navObserver.observe(s); });
  }
})();
