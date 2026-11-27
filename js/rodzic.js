/* Program „Nie jesteś sam” (2026-11-27): pojawianie się elementów przy przewijaniu,
   płynne rozwijanie podpunktów i pytań, w pytaniach otwarte tylko jedno naraz, oś kroków rysuje się przy przewijaniu.
   Bez JS i przy „ogranicz animacje” wszystko jest widoczne i działa jak zwykłe <details>. */
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- pojawianie się (z lekkim opóźnieniem dla sąsiadów w tej samej grupie)
  if (!reduce && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('wfr-js');
    var els = [].slice.call(document.querySelectorAll('[data-reveal]'));
    els.forEach(function (el) {
      var sib = el.parentNode ? [].slice.call(el.parentNode.children).filter(function (c) { return c.hasAttribute('data-reveal'); }) : [];
      var i = sib.indexOf(el);
      if (sib.length > 1 && i > 0) el.style.setProperty('--wfr-d', Math.min(i, 5) * 90 + 'ms');
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    els.forEach(function (el) { io.observe(el); });
    // przejście z linku (#obszar-3, #zgloszenie…) — pokaż od razu docelowy element
    function showTarget() {
      var id = decodeURIComponent((location.hash || '').slice(1));
      var t = id && document.getElementById(id);
      if (t) { t.classList.add('is-in'); [].forEach.call(t.querySelectorAll('[data-reveal]'), function (x) { x.classList.add('is-in'); }); }
    }
    showTarget();
    window.addEventListener('hashchange', showTarget);
  } else {
    [].forEach.call(document.querySelectorAll('.wfr-step'), function (s) { s.classList.add('is-in'); });
  }

  // --- płynne rozwijanie <details class="wfr-acc">
  function animate(d, open) {
    var body = d.querySelector('.wfr-acc__body');
    d._target = open;
    if (!body || reduce || !body.animate) { d.open = open; return; }
    if (d._anim) d._anim.cancel();
    var start, end;
    if (open) {
      d.open = true;
      start = 0; end = body.scrollHeight;
    } else {
      start = d.open ? body.offsetHeight : 0; end = 0;
    }
    body.style.overflow = 'hidden';
    d._anim = body.animate(
      [{ height: start + 'px', opacity: open ? 0 : 1 }, { height: end + 'px', opacity: open ? 1 : 0 }],
      { duration: open ? 320 : 240, easing: 'cubic-bezier(.25,.7,.3,1)' }
    );
    d._anim.onfinish = function () {
      d._anim = null; body.style.overflow = '';
      if (!open) d.open = false;
    };
  }
  [].forEach.call(document.querySelectorAll('.wfr-acc'), function (d) {
    var sum = d.querySelector('summary');
    sum.addEventListener('click', function (ev) {
      ev.preventDefault();
      var willOpen = !(typeof d._target === 'boolean' ? d._target : d.open);
      // w pytaniach: jedno otwarte naraz
      var faq = d.closest('[data-faq]');
      if (faq && willOpen) {
        [].forEach.call(faq.querySelectorAll('.wfr-acc[open]'), function (o) { if (o !== d) animate(o, false); });
      }
      animate(d, willOpen);
    });
  });

  // --- oś kroków: linia „dorysowuje się” wraz z przewijaniem
  var steps = document.querySelector('.wfr-steps');
  if (steps && !reduce) {
    var ticking = false;
    function draw() {
      ticking = false;
      var r = steps.getBoundingClientRect();
      var line = window.innerHeight * 0.65;
      var p = (line - r.top) / Math.max(1, r.height);
      p = Math.max(0, Math.min(1, p));
      steps.style.setProperty('--wfr-p', p.toFixed(3));
    }
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(draw); } }, { passive: true });
    window.addEventListener('resize', draw);
    draw();
  }

  // --- „Dla kogo”: karuzela (Adam 27.11.2026). Zdjęcie na środku, 2 kafelki z lewej, 3 z prawej; obieg w kółko.
  //     Klik w boczny kafelek = na środek; strzałki, kropki, palec, klawisze ← →. Sama się nie przewija.
  (function initCf() {
    var flow = document.querySelector('.wfr-cf__flow');
    if (!flow) return;
    var root = flow.closest('.wfr-cf');
    var cards = [].slice.call(flow.querySelectorAll('.wfr-cf__card'));
    var n = cards.length, a = 0;
    var dotsBox = root.querySelector('.wfr-cf__dots');
    var dots = cards.map(function (c, k) {
      var b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', 'Kafelek ' + (k + 1));
      b.addEventListener('click', function () { set(k); }); dotsBox.appendChild(b); return b;
    });
    function fit() { // wszystkie kafelki tak wysokie jak najwyższy (zdjęcie też), scena = kafelek + cień
      cards.forEach(function (c) { c.style.height = ''; });
      var h = 0; cards.forEach(function (c) { if (!c.classList.contains('wfr-who__photo')) h = Math.max(h, c.offsetHeight); });
      if (!h) return;
      cards.forEach(function (c) { c.style.height = h + 'px'; });
      flow.style.height = (h + 24) + 'px';
    }
    function set(i) {
      a = (i % n + n) % n;
      cards.forEach(function (c, k) {
        var d = ((k - a) % n + n) % n; if (d > n / 2) d -= n;
        var prev = c._d === undefined ? d : c._d; c._d = d;
        if (Math.abs(d - prev) > 2) { c.classList.add('is-wrap'); requestAnimationFrame(function () { requestAnimationFrame(function () { c.classList.remove('is-wrap'); }); }); }
        c.style.setProperty('--d', d); c.style.setProperty('--ad', Math.abs(d));
        c.classList.toggle('is-active', d === 0); c.classList.toggle('is-side2', Math.abs(d) === 2); c.classList.toggle('is-far', Math.abs(d) > 2 || (window.innerWidth < 768 && Math.abs(d) > 1));
      });
      dots.forEach(function (d, k) { d.classList.toggle('is-active', k === a); });
    }
    cards.forEach(function (c, k) { c.addEventListener('click', function () { if (k !== a) set(k); }); });
    root.querySelector('.wfr-cf__arrow--prev').addEventListener('click', function () { set(a - 1); });
    root.querySelector('.wfr-cf__arrow--next').addEventListener('click', function () { set(a + 1); });
    flow.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { set(a - 1); e.preventDefault(); }
      if (e.key === 'ArrowRight') { set(a + 1); e.preventDefault(); }
    });
    var sx = null, sy = 0;
    flow.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    flow.addEventListener('touchend', function (e) {
      if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy; sx = null;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) set(a + (dx < 0 ? 1 : -1));
    }, { passive: true });
    set(0); fit();
    window.addEventListener('resize', function () { fit(); set(a); });
    window.addEventListener('load', fit);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
  })();

  // --- „Jak pomagamy”: półka z książkami (Adam 27.11.2026). Jeden obszar otwarty, reszta = grzbiety po prawej (w kolejności po otwartym).
  //     Sama się zmienia co 8 s, gdy półka jest widoczna i nie ma nad nią myszy; po pierwszym ruchu użytkownika — stoi na wybranym.
  (function initShelf() {
    var shelf = document.querySelector('.wfr-shelf');
    if (!shelf) return;
    var books = [].slice.call(shelf.querySelectorAll('.wfr-area'));
    var n = books.length, a = 0, auto = !reduce, visible = false, hover = false, timer = null, T = 8000;
    var count = shelf.querySelector('.wfr-shelf__count b');
    shelf.style.setProperty('--wfr-shelf-t', T / 1000 + 's');
    books.forEach(function (b, k) {
      var no = (b.querySelector('.wfr-area__no') || {}).textContent || ('Obszar ' + (k + 1));
      var h3 = (b.querySelector('h3') || {}).textContent || '';
      var ico = b.querySelector('.wfr-area__ico i');
      var sp = document.createElement('button');
      sp.type = 'button'; sp.className = 'wfr-spine'; sp.setAttribute('aria-label', no + ': ' + h3);
      sp.innerHTML = (ico ? '<i class="wfr-spine__ico ' + ico.className + '" aria-hidden="true"></i>' : '') +
        '<span class="wfr-spine__txt"><b>' + no + '</b> · ' + h3 + '</span>';
      sp.addEventListener('click', function () { user(k); });
      b.insertBefore(sp, b.firstChild);
    });
    function open(i) {
      a = (i % n + n) % n;
      books.forEach(function (b, k) {
        var on = k === a;
        b.classList.toggle('is-open', on); b.classList.toggle('is-shut', !on);
        b.style.order = ((k - a) % n + n) % n;          // otwarta pierwsza, potem kolejne w obiegu
      });
      if (count) count.textContent = a + 1;
      restart();
    }
    function restart() { // pasek postępu i odliczanie od nowa
      clearTimeout(timer);
      shelf.classList.remove('is-auto'); void shelf.offsetWidth;
      if (auto && visible && !hover && !document.hidden) { shelf.classList.add('is-auto'); timer = setTimeout(function () { open(a + 1); }, T); }
    }
    function stop() { auto = false; clearTimeout(timer); shelf.classList.remove('is-auto'); }
    function user(i) { stop(); open(i); }
    [].forEach.call(shelf.querySelectorAll('.wfr-shelf__arrow'), function (b) {
      b.addEventListener('click', function () { user(a + (+b.getAttribute('data-dir'))); });
    });
    shelf.addEventListener('mouseenter', function () { hover = true; restart(); });
    shelf.addEventListener('mouseleave', function () { hover = false; restart(); });
    shelf.addEventListener('click', function (e) { if (e.target.closest('.wfr-acc, summary')) stop(); });
    var box = shelf.querySelector('.wfr-shelf__books'), sx = null, sy = 0;
    box.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    box.addEventListener('touchend', function (e) {
      if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy; sx = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.3) user(a + (dx < 0 ? 1 : -1));
      else stop();
    }, { passive: true });
    // linki do obszarów (#obszar-3 — kolorowe przyciski, menu „Na tej stronie”) otwierają właściwą książkę
    function fromHash() {
      var m = /^#obszar-(\d)$/.exec(location.hash || '');
      if (m) { var k = books.indexOf(document.getElementById('obszar-' + m[1])); if (k >= 0) user(k); }
    }
    document.addEventListener('click', function (e) {
      var l = e.target.closest && e.target.closest('a[href*="#obszar-"]');
      if (!l) return;
      var k = books.indexOf(document.getElementById(l.getAttribute('href').split('#')[1]));
      if (k >= 0) user(k);
    });
    window.addEventListener('hashchange', fromHash);
    document.addEventListener('visibilitychange', restart);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { visible = en[0].isIntersecting; restart(); }, { threshold: 0, rootMargin: '-25% 0px -35% 0px' }).observe(shelf);
    } else { visible = true; }
    open(0);
    fromHash();
  })();
})();
