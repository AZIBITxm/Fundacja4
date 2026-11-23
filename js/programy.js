/* „Nasze programy” — pokaz 3 kafelków 3D (pl/index.html, sekcja #programy), 2026-11-23.
 * Klik w boczny kafelek = przesuwa go na środek; klik w środkowy aktywny program = przejście do programu.
 * Strzałki, kropki, przesunięcie palcem i klawisze ← →. Opis pod kafelkami zmienia się z aktywnym kafelkiem. */
(function () {
  'use strict';
  function init() {
    var flow = document.querySelector('.wfp3__flow');
    if (!flow) return;
    var cards = [].slice.call(flow.querySelectorAll('.wfp3__card'));
    var dots = [].slice.call(document.querySelectorAll('.wfp3__dot'));
    var descs = [].slice.call(document.querySelectorAll('.wfp3__desc > div'));
    var a = +(flow.getAttribute('data-start') || 0);

    function set(i, anim) {
      a = (i + cards.length) % cards.length;
      cards.forEach(function (c, k) {
        var d = k - a; c.style.setProperty('--d', d); c.style.setProperty('--ad', Math.abs(d));
        c.classList.toggle('is-active', d === 0); c.setAttribute('aria-current', d === 0 ? 'true' : 'false');
      });
      dots.forEach(function (d, k) { d.classList.toggle('is-active', k === a); });
      descs.forEach(function (d, k) { d.hidden = k !== a; if (k === a && anim) { d.classList.remove('is-in'); void d.offsetWidth; d.classList.add('is-in'); } });
    }
    cards.forEach(function (c, k) {
      c.addEventListener('click', function (e) {
        if (k !== a || c.classList.contains('is-soon')) { e.preventDefault(); if (k !== a) set(k, true); }
      });
    });
    dots.forEach(function (d, k) { d.addEventListener('click', function () { set(k, true); }); });
    var prev = document.querySelector('.wfp3__arrow--prev'), next = document.querySelector('.wfp3__arrow--next');
    if (prev) prev.addEventListener('click', function () { set(a - 1, true); });
    if (next) next.addEventListener('click', function () { set(a + 1, true); });
    flow.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { set(a - 1, true); e.preventDefault(); }
      if (e.key === 'ArrowRight') { set(a + 1, true); e.preventDefault(); }
    });
    var sx = null, sy = 0;
    flow.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    flow.addEventListener('touchend', function (e) {
      if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy; sx = null;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) set(a + (dx < 0 ? 1 : -1), true);
    }, { passive: true });

    set(a, false);
    function show() { flow.classList.add('is-in'); setTimeout(function () { flow.classList.add('is-ready'); }, 1300); }
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { show(); io.disconnect(); } }, { threshold: .25 });
      io.observe(flow);
    } else show();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
