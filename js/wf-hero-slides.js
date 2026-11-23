/* Nagłówek programu dla rodziców (2026-11-23, wersja 4).
   Jeden przebieg filmu = jeden blok tekstu; bloki idą na zmianę (1, 2, 1, 2…).
   Przebieg: pierwsza klatka krótko wyłania się z grafitu (granatowy filtr zostaje na wierzchu) → film leci →
   jeszcze w trakcie końcówki film zanika, a tekst chowa się linijka po linijce tak samo, jak wchodził →
   od razu następny przebieg z kolejnym blokiem (bez pustej przerwy).
   Przytrzymanie tekstu wstrzymuje film i napisy.
   Bez JS i przy „ogranicz animacje” zostaje zwykły akapit i film w pętli. */
(function () {
  var hero = document.querySelector('.wfl-hero');
  if (!hero) return;
  var video = hero.querySelector('.wfl-hero__video');
  var lead = hero.querySelector('.wfd-hero__lead');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!lead || !video || reduce) return;

  var blocks = (lead.getAttribute('data-blocks') || '').split('|').map(function (s) { return s.trim(); }).filter(Boolean);
  if (blocks.length < 2) return;

  var RATE = 0.8;        // tempo filmu (8 s → 10 s)
  var FADE_IN = 1300;    // wyłanianie pierwszej klatki z grafitu
  var FADE_OUT = 1400;   // zanik końcówki filmu (zaczyna się, gdy film jeszcze leci)
  var LINE_IN = 230;     // ms między linijkami przy wejściu
  var LINE_OUT = 150;    // ms między linijkami przy chowaniu
  var WORD_MS = 650;     // czas animacji jednej linijki

  lead.classList.add('wfh-sr'); // pełny tekst dla czytników ekranu
  var box = document.createElement('div');
  box.className = 'wfh-box';
  box.setAttribute('aria-hidden', 'true');
  lead.parentNode.insertBefore(box, lead.nextSibling);

  function buildBlock(text) {
    var p = document.createElement('p');
    p.className = 'wfh-block';
    text.split(/\s+/).forEach(function (w) {
      var s = document.createElement('span');
      s.className = 'wfh-w';
      s.textContent = w;
      p.appendChild(s);
      p.appendChild(document.createTextNode(' '));
    });
    return p;
  }
  function lines(p) {
    var tops = [], words = p.querySelectorAll('.wfh-w'), map = [];
    for (var i = 0; i < words.length; i++) {
      var t = words[i].offsetTop, li = tops.indexOf(t);
      if (li < 0) { tops.push(t); li = tops.length - 1; }
      map.push(li);
    }
    return { words: words, map: map, count: tops.length };
  }
  function measure() {
    var max = 0;
    blocks.forEach(function (t) {
      var p = buildBlock(t); p.style.visibility = 'hidden'; p.style.position = 'static';
      box.appendChild(p); max = Math.max(max, p.offsetHeight); box.removeChild(p);
    });
    box.style.height = max + 'px';
  }

  var current = null, currentLines = 0;
  function showBlock(i) {
    var p = buildBlock(blocks[i]);
    box.appendChild(p);
    var L = lines(p);
    for (var k = 0; k < L.words.length; k++) L.words[k].style.transitionDelay = (L.map[k] * LINE_IN) + 'ms';
    current = p; currentLines = L.count;
    void p.offsetWidth;
    p.classList.add('is-in');
  }
  function hideDuration() { return Math.max(0, currentLines - 1) * LINE_OUT + WORD_MS; }
  function hideBlock() {
    var old = current; current = null;
    if (!old) return;
    var L = lines(old);
    for (var k = 0; k < L.words.length; k++) L.words[k].style.transitionDelay = (L.map[k] * LINE_OUT) + 'ms';
    old.classList.remove('is-in'); old.classList.add('is-out');
    setTimeout(function () { if (old.parentNode) old.parentNode.removeChild(old); }, hideDuration() + 100);
  }

  // ---- cykl ----
  video.removeAttribute('loop'); video.loop = false; video.removeAttribute('autoplay');
  var phase = 'idle', blockIdx = 0, fadeStarted = false, hideStarted = false;
  var paused = false, fadeTimer = 0, fadeLeft = 0, fadeStart = 0;

  function setVisible(on, ms) {
    video.style.transitionDuration = ms + 'ms';
    video.classList.toggle('wfh-off', !on);
  }
  function play() { var pr = video.play(); if (pr && pr.catch) pr.catch(function () {}); }

  function cycle() {
    phase = 'fadein'; fadeStarted = false; hideStarted = false;
    video.pause();
    try { video.currentTime = 0; } catch (e) {}
    video.playbackRate = RATE; video.defaultPlaybackRate = RATE;
    setVisible(true, FADE_IN);           // pierwsza klatka stoi i wyłania się z grafitu
    showBlock(blockIdx);
    blockIdx = (blockIdx + 1) % blocks.length;
    fadeLeft = FADE_IN; startFadeTimer();
  }
  function startFadeTimer() {
    fadeStart = performance.now();
    fadeTimer = setTimeout(function () { phase = 'play'; play(); }, fadeLeft);
  }

  // Końcówka liczona na bieżąco z czasu filmu, żeby zanik i chowanie tekstu kończyły się razem z filmem.
  function watch() {
    requestAnimationFrame(watch);
    if (phase !== 'play' || paused || !video.duration) return;
    var leftMs = (video.duration - video.currentTime) / (video.playbackRate || 1) * 1000;
    if (!hideStarted && leftMs <= hideDuration()) { hideStarted = true; hideBlock(); }
    if (!fadeStarted && leftMs <= FADE_OUT) { fadeStarted = true; setVisible(false, FADE_OUT); }
  }
  video.addEventListener('ended', function () {
    if (phase !== 'play') return;
    if (!hideStarted) { hideStarted = true; hideBlock(); }
    if (!fadeStarted) { fadeStarted = true; setVisible(false, 300); }
    cycle();                              // od razu następny przebieg
  });

  // Przytrzymanie = pauza
  function hold() {
    if (paused) return;
    paused = true; hero.classList.add('wfh-paused');
    if (phase === 'fadein') { clearTimeout(fadeTimer); fadeLeft -= performance.now() - fadeStart; }
    if (phase === 'play') video.pause();
  }
  function release() {
    if (!paused) return;
    paused = false; hero.classList.remove('wfh-paused');
    if (phase === 'fadein') startFadeTimer();
    if (phase === 'play') play();
  }
  box.addEventListener('pointerdown', hold);
  ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (ev) { box.addEventListener(ev, release); });
  box.addEventListener('contextmenu', function (e) { e.preventDefault(); });
  document.addEventListener('visibilitychange', function () { if (document.hidden) hold(); else release(); });

  var rt;
  window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(measure, 150); });

  // Start od grafitu.
  video.style.transitionDuration = '0ms';
  video.classList.add('wfh-off');
  video.pause();
  function go() {
    measure();
    void video.offsetWidth;
    requestAnimationFrame(watch);
    if (video.readyState >= 2) cycle();
    else video.addEventListener('loadeddata', function once() { video.removeEventListener('loadeddata', once); cycle(); });
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(go); else go();
})();
