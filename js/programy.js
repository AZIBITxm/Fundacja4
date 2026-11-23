/* Strona główna — animacje sekcji „Poznaj siebie” (#poznaj-siebie) i „Nasze programy” (#programy). 2026-11-23/24.
 *
 * „Nasze programy”: pokaz 3 kafelków 3D. Klik w boczny kafelek = na środek; klik w środkowy aktywny program = przejście.
 *   Strzałki, kropki, palec, klawisze ← →. Sam się przełącza: środek → lewy → środek → prawy → … (co 4,5 s, tylko gdy
 *   sekcja jest widoczna; po ręcznym ruchu pauza 12 s). Wysokość sceny = najwyższy kafelek, żeby opis i kreski
 *   nie wchodziły pod kafelek (na telefonie).
 * „Poznaj siebie”: kafelki ankiet wjeżdżają z prawej, potem po kolei się podświetlają, a pod tytułem zmienia się opis. */
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function onView(el, fn, thr) {
    if (!('IntersectionObserver' in window)) { fn(true); return; }
    new IntersectionObserver(function (en) { en.forEach(function (e) { fn(e.isIntersecting); }); }, { threshold: thr || .25 }).observe(el);
  }

  // ---------- Nasze programy ----------
  function initPrograms() {
    var flow = document.querySelector('.wfp3__flow');
    if (!flow) return;
    var cards = [].slice.call(flow.querySelectorAll('.wfp3__card'));
    var dots = [].slice.call(document.querySelectorAll('.wfp3__dot'));
    var descs = [].slice.call(document.querySelectorAll('.wfp3__desc > div'));
    var start = +(flow.getAttribute('data-start') || 0), a = start;
    var visible = false, pausedUntil = 0, step = 0;

    function fitHeight() { // scena tak wysoka jak najwyższy kafelek (+ odstęp na cień i podniesienie)
      var h = 0; cards.forEach(function (c) { h = Math.max(h, c.querySelector('.wfp3__in').offsetHeight); });
      if (h) flow.style.height = (h + 46) + 'px';
    }
    function set(i, anim) {
      a = (i + cards.length) % cards.length;
      cards.forEach(function (c, k) {
        var d = k - a; c.style.setProperty('--d', d); c.style.setProperty('--ad', Math.abs(d));
        c.classList.toggle('is-active', d === 0); c.setAttribute('aria-current', d === 0 ? 'true' : 'false');
      });
      dots.forEach(function (d, k) { d.classList.toggle('is-active', k === a); });
      descs.forEach(function (d, k) { d.hidden = k !== a; if (k === a && anim) { d.classList.remove('is-in'); void d.offsetWidth; d.classList.add('is-in'); } });
    }
    function user(i) { pausedUntil = Date.now() + 12000; set(i, true); }

    cards.forEach(function (c, k) {
      c.addEventListener('click', function (e) {
        if (k !== a || c.classList.contains('is-soon')) { e.preventDefault(); if (k !== a) user(k); }
      });
    });
    dots.forEach(function (d, k) { d.addEventListener('click', function () { user(k); }); });
    var prev = document.querySelector('.wfp3__arrow--prev'), next = document.querySelector('.wfp3__arrow--next');
    if (prev) prev.addEventListener('click', function () { user(a - 1); });
    if (next) next.addEventListener('click', function () { user(a + 1); });
    flow.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { user(a - 1); e.preventDefault(); }
      if (e.key === 'ArrowRight') { user(a + 1); e.preventDefault(); }
    });
    flow.addEventListener('mouseenter', function () { pausedUntil = Date.now() + 8000; });
    var sx = null, sy = 0;
    flow.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; pausedUntil = Date.now() + 12000; }, { passive: true });
    flow.addEventListener('touchend', function (e) {
      if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy; sx = null;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) user(a + (dx < 0 ? 1 : -1));
    }, { passive: true });

    set(a, false);
    fitHeight();
    window.addEventListener('resize', fitHeight);
    window.addEventListener('load', fitHeight);
    var shown = false;
    onView(flow, function (v) {
      visible = v;
      if (v && !shown) { shown = true; flow.classList.add('is-in'); setTimeout(function () { flow.classList.add('is-ready'); fitHeight(); }, 1300); }
    });
    // samoczynne przełączanie: środek → lewy → środek → prawy → …
    if (!reduce && cards.length === 3) {
      var seq = [start - 1, start, start + 1, start];
      setInterval(function () {
        if (!visible || Date.now() < pausedUntil || document.hidden) return;
        set(seq[step % seq.length], true); step++;
      }, 4500);
    }
  }

  // ---------- Poznaj siebie ----------
  function initPromo() {
    var box = document.getElementById('poznaj-siebie');
    if (!box) return;
    var links = [].slice.call(box.querySelectorAll('.wfq-promo__list a'));
    var rot = box.querySelector('.wfq-promo__rot');
    if (!links.length || !rot) return;
    var items = links.map(function (l) { return { n: l.querySelector('b').textContent, d: l.getAttribute('data-rot') || '' }; });
    var lbl = rot.querySelector('.wfq-promo__rotlbl'), txt = rot.querySelector('.wfq-promo__rottxt');
    var i = 0, visible = false, hover = false;
    function show(k) {
      i = k % links.length;
      links.forEach(function (l, j) { l.classList.toggle('is-hl', j === i); });
      lbl.textContent = items[i].n; txt.textContent = items[i].d;
      rot.classList.remove('is-swap'); void rot.offsetWidth; rot.classList.add('is-swap');
    }
    links.forEach(function (l, j) {
      l.addEventListener('mouseenter', function () { hover = true; show(j); });
      l.addEventListener('mouseleave', function () { hover = false; });
    });
    show(0);
    onView(box, function (v) { visible = v; if (v) box.classList.add('is-in'); }, .2);
    if (!reduce) setInterval(function () { if (visible && !hover && !document.hidden) show(i + 1); }, 3800);
  }

  function init() { initPrograms(); initPromo(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
