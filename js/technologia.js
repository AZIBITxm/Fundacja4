/* Program „Technologia dla zdrowia” — wersja 2 (2026-11-27).
   1) scena „Co zamienić na co”: przy przewijaniu zamiany przenikają się (stare blednie i się rozmywa, nowe wyostrza i rośnie),
   2) kafelki modułów (z js/technologia-data.js) z efektem 3D przy najechaniu,
   3) okna: moduł → temat/urządzenie; okno „wyrasta” z klikniętego kafelka; adres #t/modul[/pozycja] (można wysłać link),
   4) pojawianie się sekcji przy przewijaniu.
   Bez JS: zostaje nagłówek, teksty i formularz. Przy „ogranicz animacje”: scena jako zwykła siatka, okna bez animacji. */
(function () {
  'use strict';
  var D = window.WFT_DATA, root = document.getElementById('wft');
  if (!D || !root) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var html = document.documentElement;
  var mods = D.modules, byId = {};
  mods.forEach(function (m) { byId[m.id] = m; m.items.forEach(function (it) { it.mod = m; }); });
  var MEDIA = window.WFT_MEDIA || {};
  mods.forEach(function (m) { m.items.forEach(function (it) { var x = it.id && MEDIA[m.id + '/' + it.id]; if (x) { if (x.pic) it.pic = x.pic; if (x.videos) it.videos = x.videos; } }); });
  function picStyle(pc) { return 'background-image:url(\'' + pc.src + '\');--bs:cover;--bp:' + (pc.pos || '50% 50%') + ';'; }
  function credit(pc) { return '<p class="wft-credit">Zdjęcie: <a href="' + pc.file + '" target="_blank" rel="noopener">' + esc(pc.author) + '</a>, ' + esc(pc.license) + ', Wikimedia Commons</p>'; }
  function vidCount(n) { return n + (n === 1 ? ' film' : (n < 5 ? ' filmy' : ' filmów')); }
  function item(m, id) { for (var i = 0; i < m.items.length; i++) if (m.items[i].id === id) return m.items[i]; return null; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function smooth(a, b, x) { var t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); }
  function bg(v) { return v ? 'background-image:url(\'' + v.img + '\');--bp:' + v.pos + ';' + (v.size ? '--bs:' + v.size + ';' : '') : ''; }
  var TYPE = { artykul: 'Poradnik', urzadzenie: 'Urządzenie' };
  function typeName(it) { return it.group === 'Pojazdy na kat. AM' ? 'Pojazd' : (it.group === 'Rodzaje filtrów' ? 'Rodzaj filtra' : TYPE[it.type] || ''); }

  // pozycje „ref” (ten sam opis w dwóch modułach, np. tablet E Ink także w Telefonach)
  mods.forEach(function (m) {
    m.items = m.items.map(function (it) {
      if (!it.ref) return it;
      var pr = it.ref.split('/'), src = byId[pr[0]] && item(byId[pr[0]], pr[1]);
      if (!src) return null;
      var c = {}; for (var k in src) c[k] = src[k]; c.mod = m; return c;
    }).filter(Boolean);
  });
  function isDevGroup(list) { return list.some(function (i) { return i.type === 'urzadzenie'; }); }
  function groupsOf(m) {   // urządzenia najpierw, poradniki pod spodem (Adam 28.11.2026)
    var order = [], map = {};
    m.items.forEach(function (it) { if (!map[it.group]) { map[it.group] = []; order.push(it.group); } map[it.group].push(it); });
    var dev = order.filter(function (g) { return isDevGroup(map[g]); }), rest = order.filter(function (g) { return !isDevGroup(map[g]); });
    return dev.concat(rest).map(function (g) { return { name: g, items: map[g], dev: isDevGroup(map[g]) }; });
  }
  function metaOf(m) {
    var arts = m.items.filter(function (i) { return i.type === 'artykul'; }).length, devs = m.items.length - arts;
    return [devs ? devs + (m.id === 'mobilnosc' ? ' pojazdy' : (devs === 1 ? ' urządzenie' : (devs < 5 ? ' urządzenia' : ' urządzeń'))) : '',
            arts ? arts + (arts === 1 ? ' poradnik' : (arts < 5 ? ' poradniki' : ' poradników')) : ''].filter(Boolean).join(' · ');
  }

  /* ---------- 1. talia „płyt” z modułami ---------- */
  var deck = root.querySelector('[data-deck]'), deckSec = root.querySelector('.wft-deck'), cards = [];
  var deckNo = root.querySelector('[data-deck-no]'), deckBar = root.querySelector('[data-deck-bar]');
  if (deck) {
    deckSec.style.setProperty('--n', mods.length);
    deck.innerHTML = mods.map(function (m, i) {
      var v = m.visual, top = [];
      groupsOf(m).forEach(function (g) { g.items.forEach(function (it) { if (top.length < 4) top.push(it.title.replace(/ zamiast .*/, '')); }); });
      var vis = v ? '<span class="wft-dcard__vis' + (v.photo ? ' wft-dcard__vis--photo' : '') + '"><i class="wft-dcard__img" style="' + (v.photo ? 'background-image:url(\'' + v.img + '\')' : bg(v)) + '"></i></span>'
                  : '<span class="wft-dcard__vis"><span class="wft-mod__orb"><i class="fa ' + m.icon + '"></i></span></span>';
      return '<a class="wft-dcard" href="#t/' + m.id + '" style="--c:' + m.color + ';z-index:' + (i + 1) + '">' +
        '<span class="wft-dcard__bar"><i class="fa ' + m.icon + '" aria-hidden="true"></i><b>Moduł ' + m.no + '</b><span>' + esc(m.name) + '</span><em>' + metaOf(m) + '</em></span>' +
        '<span class="wft-dcard__main">' + vis +
        '<span class="wft-dcard__txt"><span class="wft-dcard__no">0' + m.no + '</span><h3>' + esc(m.name) + '</h3>' +
        '<span class="wft-dcard__motto">' + esc(m.motto) + '</span>' +
        '<span class="wft-mod__swap"><s>zamiast ' + esc(m.swap.from) + '</s><em aria-hidden="true">→</em><b>' + esc(m.swap.to) + '</b></span>' +
        '<span class="wft-dcard__chips">' + top.map(function (t) { return '<span>' + esc(t) + '</span>'; }).join('') + '</span>' +
        '<span class="wft-dcard__open">Otwórz moduł <span aria-hidden="true">→</span></span></span></span></a>';
    }).join('');
    cards = [].slice.call(deck.querySelectorAll('.wft-dcard'));
    if (reduce) deckSec.classList.add('is-static');
  }
  var deckAct = 0;
  function deckTrack() { return deckSec.querySelector('.wft-deck__track'); }
  function drawDeck() {
    if (!deck || reduce || !cards.length) return;
    var tr = deckTrack(), r = tr.getBoundingClientRect(), total = Math.max(1, r.height - window.innerHeight);
    var prog = clamp(-r.top / total, 0, 1), n = cards.length, f = prog * (n - 1);
    var H = deck.clientHeight, C = cards[0].offsetHeight, STEP = 36;
    cards.forEach(function (el, i) {
      var d = i - f, y, sc = 1, br = 1, op = 1;
      if (d > 0) {
        y = d <= 1 ? (C + 10) * d : C + 10 + (d - 1) * STEP;   // wjeżdża z dołu do góry; dalsze płyty czekają jako paski
        sc = d >= 1 ? 1 - (d - 1) * 0.025 : 1;
        if (y > H + 4) op = 0;
      } else {
        y = Math.max(d, -2.2) * 28;                              // przykryte płyty cofają się w głąb
        sc = 1 + Math.max(d, -3) * 0.05; br = 1 + Math.max(d, -3) * 0.22;
        if (d < -2.6) op = 0;
      }
      el.style.transform = 'translate3d(0,' + y.toFixed(1) + 'px,0) scale(' + sc.toFixed(4) + ')';
      el.style.setProperty('--dim', (1 - br).toFixed(3));   // przyciemnienie nakładką zamiast filtra (lżejsze dla telefonu)
      el.style.opacity = op;
      el.style.visibility = op ? 'visible' : 'hidden';
      el.style.zIndex = (d > 0.001 && d < 0.999) ? 300 : Math.round(200 - Math.abs(d) * 10);
    });
    deckAct = clamp(Math.round(f), 0, n - 1);
    cards.forEach(function (el, i) { el.classList.toggle('is-act', i === deckAct); el.setAttribute('tabindex', i === deckAct ? '0' : '-1'); });
    if (deckNo) deckNo.textContent = '0' + (deckAct + 1);
    if (deckBar) deckBar.style.setProperty('--dp', (prog * 100).toFixed(1) + '%');
    deckSec.style.setProperty('--dc', mods[deckAct].color);
  }
  function deckGo(i) {   // klik w pasek czekającej płyty → przewiń tak, żeby wjechała na wierzch
    var tr = deckTrack(), top = tr.getBoundingClientRect().top + window.pageYOffset, total = tr.offsetHeight - window.innerHeight;
    if (deckStep) { deckStep.go(i); return; }
    window.scrollTo({ top: top + total * (i / (cards.length - 1)) + 2, behavior: reduce ? 'auto' : 'smooth' });
  }

  /* ---------- 1b. pasek haseł ---------- */
  var TICK = ['E Ink', 'HEPA H13', 'czujnik CO₂ (NDIR)', 'odwrócona osmoza', 'atest PZH', 'światło świtu', 'kat. AM od 14 lat', 'druk 3D', 'robotyka', 'higrometr', 'filtr węglowy', 'audiobook bez ekranu', 'skala szarości', 'termostat', 'lampa UV', 'animacja poklatkowa'];
  var rows = [].slice.call(root.querySelectorAll('[data-tick]')), tickOn = false;
  rows.forEach(function (row, k) {
    var list = k ? TICK.slice().reverse() : TICK, one = list.map(function (t, j) { return '<span' + (j % 3 === 0 ? ' class="is-hl"' : '') + '>' + esc(t) + '</span>'; }).join('');
    row.innerHTML = '<div class="wft-ticker__in">' + one + one + one + '</div>';
  });
  if (rows.length && 'IntersectionObserver' in window && !reduce) {
    new IntersectionObserver(function (en) { var was = tickOn; tickOn = en[0].isIntersecting; if (tickOn && !was) requestAnimationFrame(tick); }).observe(rows[0].parentNode);
  }
  function tick(t) {
    if (!tickOn) return;
    rows.forEach(function (row) {
      var inn = row.firstChild, W = inn.scrollWidth / 3, dir = +row.getAttribute('data-tick');
      var off = (t * 0.035 + window.pageYOffset * 0.45) % W;
      inn.style.transform = 'translate3d(' + (dir > 0 ? -off : off - W).toFixed(1) + 'px,0,0)';
    });
    requestAnimationFrame(tick);
  }

  /* ---------- 1c. cytat wypełnia się słowo po słowie przy przewijaniu ---------- */
  var fills = [].slice.call(root.querySelectorAll('[data-fill]')).map(function (el) {
    (function split(node) {
      [].slice.call(node.childNodes).forEach(function (ch) {
        if (ch.nodeType === 3) {
          var frag = document.createDocumentFragment();
          ch.textContent.split(/(\s+)/).forEach(function (w) {
            if (!w) return;
            if (/^\s+$/.test(w)) frag.appendChild(document.createTextNode(w));
            else { var s = document.createElement('span'); s.className = 'wft-w'; s.textContent = w; frag.appendChild(s); }
          });
          node.replaceChild(frag, ch);
        } else if (ch.nodeType === 1) split(ch);
      });
    })(el);
    return { el: el, words: [].slice.call(el.querySelectorAll('.wft-w')) };
  });
  if (reduce) fills.forEach(function (f) { f.words.forEach(function (w) { w.classList.add('on'); }); });
  function drawFill() {
    if (reduce) return;
    fills.forEach(function (f) {
      var r = f.el.getBoundingClientRect(), p = clamp((window.innerHeight * 0.88 - r.top) / (window.innerHeight * 0.5), 0, 1), k = Math.round(p * f.words.length);
      f.words.forEach(function (w, i) { w.classList.toggle('on', i < k); });
    });
  }

  /* ---------- 2. scena „co zamienić na co” ---------- */
  var PAIRS = [
    ['nauka', 'tablet-e-ink', 'stosu zeszytów', 'tablet E Ink'],
    ['nauka', 'e-podreczniki', 'ciężkich książek', 'cyfrowe podręczniki'],
    ['telefony', 'telefon-e-ink', 'klasycznego smartfona', 'telefon E Ink'],
    ['woda', 'butelki', 'plastikowych butelek', 'filtr do wody'],
    ['zabawa', 'animacja', 'biernego oglądania', 'własne filmy'],
    ['sen', 'budzik', 'telefonu przy łóżku', 'budzik'],
    ['nauka', 'e-ink', 'świecącego ekranu', 'elektroniczny papier'],
    ['mobilnosc', 'prawo-jazdy-am', 'podwożenia wszędzie', 'samodzielność od 14 lat?', 'Poznaj']
  ];
  var scene = root.querySelector('.wft-scene'), stage = scene && scene.querySelector('[data-pairs]');
  var pairEls = [];
  if (stage) {
    scene.style.setProperty('--n', PAIRS.length);
    stage.innerHTML = PAIRS.map(function (p) {
      var m = byId[p[0]];
      return '<div class="wft-pair" style="--c:' + m.color + '"><div class="wft-pair__old"><small>Zamiast</small><span>' + esc(p[2]) + '</span></div>' +
        '<div class="wft-pair__new"><small>' + (p[4] || 'Wybierz') + '</small><span class="wft-pair__big">' + esc(p[3]) + '</span>' +
        '<a class="wft-pair__go" href="#t/' + p[0] + '/' + p[1] + '">Zobacz, jak to działa <span aria-hidden="true">→</span></a>' +
        '<span class="wft-pair__mod">Moduł ' + m.no + ' · ' + esc(m.short || m.name) + '</span></div></div>';
    }).join('');
    pairEls = [].slice.call(stage.querySelectorAll('.wft-pair'));
    if (reduce) scene.classList.add('is-static');
  }
  var countEl = scene && scene.querySelector('.wft-scene__count');
  function drawScene() {
    if (!stage || reduce) return;
    var r = scene.getBoundingClientRect(), total = Math.max(1, r.height - window.innerHeight);
    var prog = clamp(-r.top / total, 0, 1), n = pairEls.length, f = prog * n;
    var act = clamp(Math.floor(f), 0, n - 1);
    pairEls.forEach(function (el, i) {
      var p = f - i;
      var e = i === 0 ? 1 : smooth(-0.12, 0.08, p);
      var x = i === n - 1 ? 0 : smooth(0.86, 1.04, p);
      var m = smooth(0.22, 0.52, p);
      var op = e * (1 - x);
      if (op <= 0.001) { if (el._vis !== false) { el.style.opacity = 0; el.style.visibility = 'hidden'; el._vis = false; } return; }
      el._vis = true; el.style.visibility = 'visible';
      el.style.opacity = op.toFixed(3);
      el.style.transform = 'scale(' + ((0.82 + 0.18 * e) * (1 + 0.55 * x)).toFixed(4) + ')';
      el.style.filter = 'blur(' + ((1 - e) * 12 + x * 16).toFixed(1) + 'px)';
      var o = el.children[0], nw = el.children[1];
      o.style.opacity = (1 - m).toFixed(3);
      o.style.transform = 'translateY(calc(-50% - ' + (m * 40).toFixed(1) + 'px)) scale(' + (1 - 0.18 * m).toFixed(3) + ')';
      o.style.filter = 'blur(' + (m * 10).toFixed(1) + 'px)';
      nw.style.opacity = m.toFixed(3);
      nw.style.transform = 'translateY(-50%) scale(' + (0.82 + 0.18 * m).toFixed(3) + ')';
      nw.style.filter = 'blur(' + ((1 - m) * 10).toFixed(1) + 'px)';
      el.style.pointerEvents = (m > 0.7 && x < 0.3) ? 'auto' : 'none';
    });
    scene.style.setProperty('--sp', prog.toFixed(4));
    scene.style.setProperty('--sc', byId[PAIRS[act][0]].color);
    scene.style.setProperty('--sc2', byId[PAIRS[Math.min(act + 1, n - 1)][0]].color);
    // poświaty płyną po tle razem z przewijaniem (widać, że całość się „kręci”), mocniej przy zmianie napisu
    var fr = f - Math.floor(f), pulse = Math.sin(Math.PI * clamp(fr, 0, 1));
    scene.style.setProperty('--gx', (Math.sin(f * 1.9) * 26).toFixed(2) + 'vw');
    scene.style.setProperty('--gy', (Math.cos(f * 1.3) * 16).toFixed(2) + 'vh');
    scene.style.setProperty('--gs', (1 + pulse * 0.35).toFixed(3));
    scene.style.setProperty('--gr', (f * 40).toFixed(1) + 'deg');
    if (countEl) countEl.textContent = (act + 1) + ' / ' + n;
  }

  /* ---------- 3. pojawianie się + tło ---------- */
  if (!reduce && 'IntersectionObserver' in window) {
    html.classList.add('wft-js');
    var els = [].slice.call(root.querySelectorAll('[data-in]'));
    els.forEach(function (el) {
      var sib = [].filter.call(el.parentNode.children, function (c) { return c.hasAttribute('data-in'); });
      var i = sib.indexOf(el); if (i > 0) el.style.setProperty('--d', Math.min(i, 6) * 80 + 'ms');
    });
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.06 });
    els.forEach(function (el) { io.observe(el); });
  }
  var ticking = false;
  function onScroll() { if (ticking) return; ticking = true; requestAnimationFrame(function () { ticking = false; drawScene(); drawDeck(); drawFill(); root.style.setProperty('--sy', window.pageYOffset | 0); }); }
  window.addEventListener('scroll', onScroll, { passive: true });
  /* ---------- 3b. przewijanie „po jednym” (Adam 28.11.2026) ----------
     W scenie zamian i w talii płyt jeden ruch kółkiem / palcem / klawiszem = zawsze jedna pełna, płynna animacja
     do następnego (albo poprzedniego) kroku. Nie da się zatrzymać w połowie ani przeskoczyć kilku naraz.
     Na pierwszym kroku ruch w górę i na ostatnim ruch w dół wypuszczają dalej, zwykłym przewijaniem strony. */
  // Szybkie przewijanie (Adam 28.11.2026): kolejny ruch w trakcie animacji od razu startuje następny krok
  // (animacja przejmuje się z bieżącego miejsca), więc „bum, bum, bum” przelatuje dalej bez czekania.
  var animating = false, animTok = 0;
  function ease(t) { return 1 - Math.pow(1 - t, 3); }   // szybki start, łagodny koniec — dobrze się łączy przy szybkich ruchach
  function animScroll(to, dur, done) {
    var from = window.pageYOffset, t0 = performance.now(), tok = ++animTok;
    animating = true;
    (function f(now) {
      if (tok !== animTok) return;                          // przejęta przez nowszy krok
      var t = Math.min(1, (now - t0) / dur);
      window.scrollTo({ top: from + (to - from) * ease(t), behavior: 'instant' });
      if (t < 1) requestAnimationFrame(f); else { animating = false; if (done) done(); }
    })(t0);
  }
  function makeStepper(track, stops, dur) {
    var S = { idx: 0, busy: false, last: stops.length - 1 };
    function geo() { var r = track.getBoundingClientRect(); return { top: r.top + window.pageYOffset, total: Math.max(1, track.offsetHeight - window.innerHeight) }; }
    S.pos = function (i) { var g = geo(); return Math.round(g.top + g.total * stops[i]); };
    S.inRange = function () {
      var r = track.getBoundingClientRect(), y = window.pageYOffset;
      return r.top <= 2 && r.bottom >= window.innerHeight - 2 && y <= S.pos(S.last) + 3;
    };
    S.nearest = function () {
      var y = window.pageYOffset, best = 0;
      for (var k = 1; k <= S.last; k++) if (Math.abs(S.pos(k) - y) < Math.abs(S.pos(best) - y)) best = k;
      return best;
    };
    S.before = function () { return window.pageYOffset < S.pos(0) - 3; };   // między początkiem sekcji a pierwszym krokiem
    S.step = function (dir) { S.go(!S.busy && S.before() ? (dir > 0 ? Math.min(1, S.last) : 0) : S.idx + dir); };
    S.go = function (i, d) {
      S.idx = clamp(i, 0, S.last); S.busy = true;
      animScroll(S.pos(S.idx), d || dur, function () { S.busy = false; });
    };
    return S;
  }
  var steppers = [];
  if (!reduce && stage && pairEls.length) {
    // dwa kroki na zamianę (Adam 28.11.2026): 1. ruch = „zamiast …”, 2. ruch = „wybierz …”, potem następna zamiana
    var ps = [];
    pairEls.forEach(function (_, i) { ps.push((i + 0.12) / pairEls.length, (i + 0.7) / pairEls.length); });
    steppers.push(makeStepper(scene, ps, 820));
  }
  var deckStep = null;
  if (!reduce && deck && cards.length > 1) {
    deckStep = makeStepper(deckTrack(), cards.map(function (_, i) { return i / (cards.length - 1); }), 650);
    steppers.push(deckStep);
  }
  function activeStepper() { if (html.classList.contains('wft-lock')) return null; for (var i = 0; i < steppers.length; i++) if (steppers[i].inRange()) return steppers[i]; return null; }
  function atExit(s, dir) { return (dir < 0 && (s.idx === 0 || s.before())) || (dir > 0 && s.idx === s.last && !s.before()); }

  // wjazd do sekcji rozpędem / przeciągnięciem paska → zatrzymaj i ustaw na kroku od strony wejścia
  var lastY = window.pageYOffset;
  window.addEventListener('scroll', function () {
    var y = window.pageYOffset;
    if (!animating) {
      var s = activeStepper();
      if (s && !s.busy && !s.before() && Math.abs(y - s.pos(s.idx)) > 3) {
        var i = lastY < s.pos(0) - 3 ? 0 : (lastY > s.pos(s.last) + 3 ? s.last : s.nearest());
        html.style.overflow = 'hidden';                       // zatrzymuje rozpęd (telefon)
        s.idx = i; s.busy = true;
        animScroll(s.pos(i), 320, function () { html.style.overflow = ''; s.busy = false; });
      }
    }
    lastY = y;
  }, { passive: true });

  // kółko myszy / gładzik: jeden gest (razem z bezwładnością) = jeden krok
  var wLast = 0, wUsed = false, wAbs = 0, wAt = 0, wDir = 0;
  window.addEventListener('wheel', function (e) {
    var s = activeStepper(); if (!s) return;
    var dir = e.deltaY > 0 ? 1 : (e.deltaY < 0 ? -1 : 0); if (!dir) return;
    var now = Date.now(), a = Math.abs(e.deltaY);
    // nowy gest: przerwa w zdarzeniach, zmiana kierunku albo wyraźny nowy „pych” w trakcie wygasającej bezwładności
    if (now - wLast > 140 || dir !== wDir || (a > wAbs * 1.8 && a > 20 && now - wAt > 180)) wUsed = false;
    wLast = now; wAbs = a; wDir = dir;
    if (!wUsed && atExit(s, dir) && !s.busy) return;           // wyjście z sekcji zwykłym przewijaniem
    e.preventDefault();
    if (wUsed || a < 3 || atExit(s, dir)) return;
    wUsed = true; wAt = now; s.step(dir);
  }, { passive: false });

  // palec: jedno przesunięcie (wolne czy szybkie) = jeden krok
  var tY = null, tUsed = false, tFree = false;
  window.addEventListener('touchstart', function (e) { tY = e.touches[0].clientY; tUsed = false; tFree = false; }, { passive: true });
  window.addEventListener('touchmove', function (e) {
    if (tY === null || tFree) return;
    var s = activeStepper(); if (!s) return;
    var dy = tY - e.touches[0].clientY, dir = dy > 0 ? 1 : -1;
    if (!tUsed && Math.abs(dy) < 6) return;
    if (!tUsed && !s.busy && atExit(s, dir)) { tFree = true; return; }
    e.preventDefault();
    if (tUsed || atExit(s, dir)) return;
    if (Math.abs(dy) > 24) { tUsed = true; s.step(dir); }       // każdy „pych” palcem = następny krok, także w trakcie animacji
  }, { passive: false });
  window.addEventListener('touchend', function () { tY = null; }, { passive: true });

  // klawiatura
  window.addEventListener('keydown', function (e) {
    var k = e.key, dir = (k === 'ArrowDown' || k === 'PageDown' || (k === ' ' && !e.shiftKey)) ? 1 : ((k === 'ArrowUp' || k === 'PageUp' || (k === ' ' && e.shiftKey)) ? -1 : 0);
    if (!dir || /INPUT|TEXTAREA|SELECT/.test((e.target || {}).tagName || '')) return;
    var s = activeStepper(); if (!s || atExit(s, dir)) return;
    e.preventDefault(); s.step(dir);
  });

  window.addEventListener('resize', onScroll);
  drawScene(); drawDeck(); drawFill();
  window.addEventListener('load', drawDeck);

  /* ---------- 4. okna ---------- */
  var layer = root.querySelector('[data-layer]');
  var stack = [];            // { key, win, ov, pushed, origin }
  var origin = null, fromClick = false;

  function renderMod(m) {
    var v = m.visual, head;
    if (v && v.photo) head = '<header class="wft-whead wft-whead--photo"><i class="wft-whead__img" style="background-image:url(\'' + v.img + '\')"></i>';
    else if (v) head = '<header class="wft-whead"><i class="wft-whead__img" style="' + bg(v) + '"></i>';
    else head = '<header class="wft-whead wft-whead--orb"><span class="wft-mod__orb"><i class="fa ' + m.icon + '"></i></span>';
    head += '<div class="wft-whead__txt"><p class="wft-whead__no">Moduł ' + m.no + '</p><h2 id="wft-wt-' + m.id + '">' + esc(m.name) + '</h2><p class="wft-whead__motto">' + esc(m.motto) + '</p></div></header>';
    var k = 0;
    var body = '<div class="wft-wbody"><div class="wft-intro">' + m.intro.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('') + '</div>' + (m.introExtra || '') +
      groupsOf(m).map(function (g) {
        return '<p class="wft-group">' + esc(g.name) + '</p><div class="wft-items' + (g.dev ? ' wft-items--feat' + (g.items.length > 4 ? ' wft-items--many' : '') : '') + '">' + g.items.map(function (it) {
          var vis = it.pic ? '<span class="wft-item__vis wft-item__vis--pic"><i class="wft-item__img" style="' + picStyle(it.pic) + '" role="img" aria-label="' + esc(it.pic.alt || it.title) + '"></i></span>'
            : it.photo ? '<span class="wft-item__vis wft-item__vis--photo"><i class="wft-item__img" style="background-image:url(\'' + it.photo + '\')"></i></span>'
            : '<span class="wft-item__vis">' + (it.visual ? '<i class="wft-item__img" style="' + bg(it.visual) + 'opacity:.6"></i>' : '') + '<b><i class="fa ' + (it.icon || m.icon) + '" aria-hidden="true"></i></b></span>';
          return '<a class="wft-item" href="#t/' + m.id + '/' + it.id + '" style="--i:' + (k++) + '">' + vis +
            (it.todo ? '<span class="wft-item__soon">wkrótce pełny opis</span>' : '') +
            (it.badge ? '<span class="wft-badge"><i class="fa fa-star" aria-hidden="true"></i>' + esc(it.badge) + '</span>' : '') +
            '<span class="wft-item__body"><span class="wft-item__type">' + typeName(it) + '</span><h4>' + esc(it.title) + '</h4>' +
            (it.was ? '<span class="wft-item__was"><b>zamiast</b> ' + esc(it.was) + '</span>' : '') +
            '<p>' + esc(it.sub) + '</p>' + (it.videos ? '<span class="wft-item__vids"><i class="fa fa-youtube-play" aria-hidden="true"></i>' + vidCount(it.videos.length) + '</span>' : '') + (g.dev ? '<span class="wft-item__more">' + (it.brands ? 'Opis i producenci' : 'Zobacz opis') + ' <span aria-hidden="true">→</span></span>' : '') + '</span></a>';
        }).join('') + '</div>';
      }).join('') +
      '<div class="wft-ask"><p>Masz pytanie o ten moduł albo chcesz, żebyśmy opisali konkretne rozwiązanie?</p><a class="wfd-btn wfd-btn--light" href="#zgloszenie" data-temat="' + m.id + '">Napisz do nas →</a></div></div>';
    return { cls: '', label: 'wft-wt-' + m.id, html: head + body };
  }

  function renderItem(m, it) {
    var head;
    if (it.pic) head = '<header class="wft-whead wft-whead--pic"><i class="wft-whead__img" style="' + picStyle(it.pic) + '"></i>';
    else if (it.photo) head = '<header class="wft-whead wft-whead--photo"><i class="wft-whead__img" style="background-image:url(\'' + it.photo + '\')"></i>';
    else if (it.visual) head = '<header class="wft-whead"><i class="wft-whead__img" style="' + bg(it.visual) + '"></i>';
    else head = '<header class="wft-whead wft-whead--orb"><span class="wft-mod__orb"><i class="fa ' + (it.icon || m.icon) + '"></i></span>';
    head += '<div class="wft-whead__txt">' + (it.badge ? '<span class="wft-badge wft-badge--head"><i class="fa fa-star" aria-hidden="true"></i>' + esc(it.badge) + '</span>' : '') + '<p class="wft-whead__no">' + typeName(it) + ' · ' + esc(m.short || m.name) + '</p><h2 id="wft-wt-' + m.id + '-' + it.id + '">' + esc(it.title) + '</h2>' +
      (it.sub ? '<p class="wft-whead__motto">' + esc(it.sub) + '</p>' : '') + '</div></header>';
    var b = '<div class="wft-wbody">';
    if (it.pic) b += credit(it.pic);
    else if (it.credit) b += '<p class="wft-credit">' + esc(it.credit) + '</p>';
    if (it.was) b += '<p class="wft-item__was" style="margin-top:6px!important"><b>zamiast</b> ' + esc(it.was) + '</p>';
    if (it.specs) b += '<div class="wft-specs">' + it.specs.map(function (s, i) { return '<div class="wft-spec" style="--i:' + i + '"><span>' + esc(s[0]) + '</span><b>' + esc(s[1]) + '</b></div>'; }).join('') + '</div>';
    b += '<div class="wft-art">' + (it.body || '') + '</div>';
    if (it.group === 'Pojazdy na kat. AM') b += '<p class="wft-small" style="max-width:820px">Informujemy, nie namawiamy: decyzja należy do rodziców. Przed zakupem sprawdź homologację (L6e) i wyposażenie konkretnego egzemplarza.</p>';
    if (it.brands) {
      var br = it.brands.slice().sort(function (a, c) { return a.name.localeCompare(c.name, 'pl'); });
      b += '<p class="wft-group">Przykładowi producenci</p><div class="wft-brands">' + br.map(function (x) {
        return '<div class="wft-brand' + (x.country === 'Polska' ? ' is-pl' : '') + '"><b>' + esc(x.name) + '</b><span>' + esc(x.country) + '</span></div>';
      }).join('') + '</div><p class="wft-brands-note">Kolejność alfabetyczna, bez rankingu. Nie jesteśmy sklepem i nie pobieramy prowizji.</p>';
    }
    if (it.videos) b += '<p class="wft-group">Filmy i recenzje</p><div class="wft-videos">' + it.videos.map(function (v, i) {
      return '<a class="wft-video" style="--i:' + i + '" href="https://www.youtube.com/watch?v=' + encodeURIComponent(v.yt) + '" target="_blank" rel="noopener">' +
        '<span class="wft-video__play" aria-hidden="true"><i class="fa fa-play"></i></span><span class="wft-video__txt"><b>' + esc(v.t) + '</b>' +
        '<em>YouTube · ' + esc(v.lang) + (v.src === 'producent' ? ' · materiał producenta' : '') + '</em></span><span class="wft-video__go" aria-hidden="true">↗</span></a>';
    }).join('') + '</div><p class="wft-brands-note">Filmy niezależnych twórców i producentów; otwierają się w serwisie YouTube. Nie odpowiadamy za ich treść.</p>';
    if (it.link) b += '<a class="wft-link" href="' + it.link + '" target="_blank" rel="noopener">Strona producenta <span aria-hidden="true">↗</span></a>';
    if (it.todo) b += '<div class="wft-soonbox"><p><strong>W przygotowaniu:</strong> pełny opis z badaniami, parametrami i producentami. Jeśli ten temat jest dla Ciebie ważny, napisz do nas, a damy mu pierwszeństwo.</p></div>';
    b += '<div class="wft-ask"><p>Masz pytanie o to rozwiązanie?</p><a class="wfd-btn wfd-btn--light" href="#zgloszenie" data-temat="' + m.id + '">Napisz do nas →</a></div></div>';
    return { cls: ' wft-win--l2', label: 'wft-wt-' + m.id + '-' + it.id, html: head + b, back: m };
  }

  function visibleRect(el) {
    if (!el || !document.contains(el)) return null;
    var r = el.getBoundingClientRect();
    if (r.width < 4 || r.bottom < 0 || r.top > window.innerHeight) return null;
    return r;
  }

  function openWin(key, m, it, animate) {
    var level = it ? 1 : 0, R = it ? renderItem(m, it) : renderMod(m);
    var ov = document.createElement('div'); ov.className = 'wft-ov';
    var win = document.createElement('div');
    win.className = 'wft-win' + R.cls; win.style.setProperty('--c', m.color);
    win.setAttribute('role', 'dialog'); win.setAttribute('aria-modal', 'true'); win.setAttribute('aria-labelledby', R.label);
    win.innerHTML = '<div class="wft-win__scroll">' +
      (R.back ? '<button type="button" class="wft-win__back" data-close>← ' + esc(R.back.short || R.back.name) + '</button>' : '') +
      '<button type="button" class="wft-win__x" data-close aria-label="Zamknij">×</button><div class="wft-win__in">' + R.html + '</div></div>';
    if (level && stack.length) stack[stack.length - 1].win.classList.add('is-under');
    layer.appendChild(ov); layer.appendChild(win);
    html.classList.add('wft-lock');
    var o = animate ? origin : null, r0 = visibleRect(o);
    var entry = { key: key, win: win, ov: ov, pushed: fromClick, origin: o };
    stack.push(entry);
    requestAnimationFrame(function () { ov.classList.add('is-on'); });
    if (reduce || !win.animate) { win.classList.add('is-ready'); }
    else if (r0) {
      var r1 = win.getBoundingClientRect();
      var tf = 'translate(' + (r0.left - r1.left) + 'px,' + (r0.top - r1.top) + 'px) scale(' + (r0.width / r1.width) + ',' + (r0.height / r1.height) + ')';
      win.animate([{ transform: tf, opacity: .6, borderRadius: '22px' }, { transform: 'none', opacity: 1 }], { duration: 560, easing: 'cubic-bezier(.2,.75,.2,1)' });
      setTimeout(function () { win.classList.add('is-ready'); }, 220);
    } else {
      win.animate([{ transform: 'translateY(24px) scale(.96)', opacity: 0, filter: 'blur(8px)' }, { transform: 'none', opacity: 1, filter: 'blur(0)' }], { duration: 480, easing: 'cubic-bezier(.2,.75,.2,1)' });
      setTimeout(function () { win.classList.add('is-ready'); }, 120);
    }
    var x = win.querySelector('.wft-win__x'); if (x) x.focus({ preventScroll: true });
  }

  function removeTop(done) {
    var e = stack.pop(); if (!e) { if (done) done(); return; }
    var win = e.win, ov = e.ov;
    ov.classList.remove('is-on');
    var under = stack[stack.length - 1]; if (under) under.win.classList.remove('is-under');
    var finished = false;
    function fin() { if (finished) return; finished = true; win.remove(); ov.remove(); if (!stack.length) html.classList.remove('wft-lock'); if (e.origin && document.contains(e.origin) && e.origin.focus) e.origin.focus({ preventScroll: true }); if (done) done(); }
    if (reduce || !win.animate) { fin(); return; }
    win.classList.remove('is-ready');
    var r0 = visibleRect(e.origin), r1 = win.getBoundingClientRect(), a;
    if (r0) a = win.animate([{ transform: 'none', opacity: 1 }, { transform: 'translate(' + (r0.left - r1.left) + 'px,' + (r0.top - r1.top) + 'px) scale(' + (r0.width / r1.width) + ',' + (r0.height / r1.height) + ')', opacity: 0 }], { duration: 420, easing: 'cubic-bezier(.4,0,.2,1)' });
    else a = win.animate([{ transform: 'none', opacity: 1 }, { transform: 'translateY(20px) scale(.96)', opacity: 0, filter: 'blur(6px)' }], { duration: 320, easing: 'ease-in' });
    a.onfinish = fin;
    setTimeout(fin, 700);   // zapas: gdy animacja nie skończy się (np. karta w tle), okno i tak znika
  }

  function wanted() {
    var mt = /^#t\/([\w-]+)(?:\/([\w-]+))?$/.exec(location.hash || ''), keys = [];
    if (mt && byId[mt[1]]) {
      keys.push({ key: 't/' + mt[1], m: byId[mt[1]] });
      var it = mt[2] && item(byId[mt[1]], mt[2]);
      if (it) keys.push({ key: 't/' + mt[1] + '/' + it.id, m: byId[mt[1]], it: it });
    }
    return keys;
  }
  function sync() {
    var w = wanted(), same = 0;
    while (same < stack.length && same < w.length && stack[same].key === w[same].key) same++;
    (function closeExtra() {
      if (stack.length > same) { removeTop(closeExtra); return; }
      for (var i = same; i < w.length; i++) openWin(w[i].key, w[i].m, w[i].it, i === w.length - 1);
      fromClick = false; origin = null;
      if (!w.length) afterCloseScroll();
    })();
  }
  function afterCloseScroll() {
    var id = (location.hash || '').slice(1);
    if (!id || id.indexOf('t/') === 0) return;
    var t = document.getElementById(id);
    if (t) setTimeout(function () { t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); }, 60);
  }
  function closeTop() {
    var e = stack[stack.length - 1]; if (!e) return;
    if (e.pushed) { history.back(); return; }
    var parent = stack.length > 1 ? '#' + stack[stack.length - 2].key : location.pathname + location.search;
    history.replaceState(null, '', parent); sync();
  }

  document.addEventListener('click', function (ev) {
    var a = ev.target.closest && ev.target.closest('a[href]');
    var c = ev.target.closest && ev.target.closest('[data-close]');
    if (c) { ev.preventDefault(); closeTop(); return; }
    if (!a) return;
    var href = a.getAttribute('href');
    if (a.hasAttribute('data-temat')) { var sel = document.getElementById('wfl-temat'); if (sel) sel.value = a.getAttribute('data-temat'); }
    if (a.classList.contains('wft-dcard') && !a.classList.contains('is-act') && !reduce) { ev.preventDefault(); deckGo(cards.indexOf(a)); return; }
    if (/^#t\//.test(href)) { origin = a; fromClick = true; return; }   // zmiana adresu → hashchange → sync
    // linki wewnątrz okna (przypisy #zr-…) — przewiń w oknie, nie zamykaj okien
    if (href.charAt(0) === '#' && a.closest('.wft-win') && href !== '#zgloszenie') {
      ev.preventDefault();
      var t = document.getElementById(href.slice(1)), sc = a.closest('.wft-win__scroll');
      if (t && sc) sc.scrollTo({ top: t.getBoundingClientRect().top - sc.getBoundingClientRect().top + sc.scrollTop - 90, behavior: reduce ? 'auto' : 'smooth' });
    }
  }, true);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && stack.length) { e.preventDefault(); closeTop(); } });
  window.addEventListener('hashchange', sync);
  layer.addEventListener('click', function (e) { if (e.target.classList.contains('wft-ov')) closeTop(); });
  if (/^#t\//.test(location.hash)) sync();
})();
