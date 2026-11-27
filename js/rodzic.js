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
})();
