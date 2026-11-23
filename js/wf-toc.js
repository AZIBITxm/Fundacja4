/* Spis treści strony programu: zaznacza bieżącą sekcję; na telefonie (poziomy pasek) sam przewija się
   do zaznaczonej pozycji i ma strzałki ‹ › do ręcznego przewijania. */
(function () {
  var nav = document.querySelector('.wfl-toc');
  if (!nav) return;
  var ol = nav.querySelector('ol');
  var links = Array.prototype.slice.call(ol.querySelectorAll('a[href^="#"]'));
  var targets = links.map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); });

  // Strzałki (widoczne tylko na telefonie — CSS)
  function arrow(dir) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'wfl-toc__arrow wfl-toc__arrow--' + dir;
    b.setAttribute('aria-label', dir === 'prev' ? 'Przewiń spis w lewo' : 'Przewiń spis w prawo');
    b.innerHTML = dir === 'prev' ? '&#8249;' : '&#8250;';
    b.addEventListener('click', function () {
      ol.scrollBy({ left: (dir === 'prev' ? -1 : 1) * ol.clientWidth * 0.7, behavior: 'smooth' });
    });
    nav.appendChild(b);
    return b;
  }
  var prev = arrow('prev'), next = arrow('next');
  function edges() {
    var max = ol.scrollWidth - ol.clientWidth;
    prev.classList.toggle('is-hidden', ol.scrollLeft <= 4);
    next.classList.toggle('is-hidden', ol.scrollLeft >= max - 4);
  }
  ol.addEventListener('scroll', edges, { passive: true });

  var active = -1;
  function horizontal() { return ol.scrollWidth > ol.clientWidth + 2; }
  function spy() {
    var line = window.innerHeight * 0.3, idx = -1;
    for (var i = 0; i < targets.length; i++) {
      if (targets[i] && targets[i].getBoundingClientRect().top <= line) idx = i;
    }
    if (idx === active) return;
    if (active >= 0) links[active].classList.remove('is-active');
    active = idx;
    if (idx < 0) return;
    var a = links[idx];
    a.classList.add('is-active');
    if (horizontal()) {
      var li = a.parentNode;
      var x = li.offsetLeft - (ol.clientWidth - li.offsetWidth) / 2;
      ol.scrollTo({ left: Math.max(0, x), behavior: 'smooth' });
    }
  }
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () { ticking = false; spy(); });
  }, { passive: true });
  window.addEventListener('resize', function () { edges(); spy(); });
  edges(); spy();
})();
