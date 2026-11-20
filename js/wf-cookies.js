/* ZGODA NA COOKIES — własny lekki mechanizm strony World Foundation (zlecenie 6B, 2026-11-20; zastępuje Osano).
 *
 * Kategorie:
 *   necessary — zawsze włączone (zapamiętanie zgody, wybór języka, tryb podglądu; techniczne zasoby strony),
 *   stats     — statystyki: Google Analytics 4 (cookies _ga, _ga_<ID>),
 *   media     — media zewnętrzne: osadzony formularz wpłat Donorbox (z płatnościami Stripe / PayPal; cookies Cloudflare).
 *
 * Blokowanie do czasu zgody — w HTML:
 *   <script type="text/plain" data-wfc="stats" data-src="https://…"></script>   (zewnętrzny skrypt)
 *   <script type="text/plain" data-wfc="stats"> … </script>                      (skrypt wbudowany)
 *   <iframe data-wfc="media" data-wfc-src="https://…"></iframe>                 (ramka; bez zgody — zastępnik z przyciskiem)
 * Zgoda: cookie pierwszej strony `wf_consent` (12 miesięcy), np. "v1.stats-1.media-0.1700000000".
 * Zmiana zgody: link „Ustawienia cookies” w stopce → WFCookies.open(). Wycofanie statystyk usuwa cookies _ga i przeładowuje stronę.
 */
(function () {
  'use strict';
  var NAME = 'wf_consent';
  var VERSION = 'v1';
  var MAX_AGE = 365 * 24 * 3600; // 12 miesięcy
  var CATS = ['stats', 'media'];
  var POLICY = (location.pathname.indexOf('/pl/') >= 0 ? '' : 'pl/') + 'polityka-prywatnosci.html#pliki-cookies';

  function read() {
    var m = document.cookie.match(/(?:^|;\s*)wf_consent=([^;]+)/);
    if (!m) return null;
    var parts = decodeURIComponent(m[1]).split('.');
    if (parts[0] !== VERSION) return null;
    var c = { necessary: true, stats: false, media: false, ts: 0 };
    parts.slice(1).forEach(function (p) {
      var kv = p.split('-');
      if (CATS.indexOf(kv[0]) >= 0) c[kv[0]] = kv[1] === '1';
      else if (/^\d+$/.test(p)) c.ts = +p;
    });
    return c;
  }

  function write(c) {
    var v = [VERSION, 'stats-' + (c.stats ? 1 : 0), 'media-' + (c.media ? 1 : 0), Math.floor(Date.now() / 1000)].join('.');
    document.cookie = NAME + '=' + encodeURIComponent(v) + '; Max-Age=' + MAX_AGE + '; Path=/; SameSite=Lax' + (location.protocol === 'https:' ? '; Secure' : '');
  }

  // usunięcie cookies Google Analytics po wycofaniu zgody (różne warianty domeny)
  function clearStats() {
    var names = document.cookie.split(';').map(function (s) { return s.split('=')[0].trim(); })
      .filter(function (n) { return n === '_ga' || n.indexOf('_ga_') === 0 || n === '_gid' || n === '_gat'; });
    var host = location.hostname;
    var domains = ['', host, '.' + host];
    var parts = host.split('.');
    if (parts.length > 2) domains.push('.' + parts.slice(-2).join('.'));
    names.forEach(function (n) {
      domains.forEach(function (d) {
        document.cookie = n + '=; Max-Age=0; Path=/' + (d ? '; Domain=' + d : '');
      });
    });
  }

  var activated = {};
  function activate(c) {
    CATS.forEach(function (cat) {
      if (!c[cat] || activated[cat]) return;
      activated[cat] = true;
      var scripts = document.querySelectorAll('script[type="text/plain"][data-wfc="' + cat + '"]');
      Array.prototype.forEach.call(scripts, function (old) {
        var s = document.createElement('script');
        Array.prototype.forEach.call(old.attributes, function (a) {
          if (a.name !== 'type' && a.name !== 'data-src' && a.name !== 'data-wfc') s.setAttribute(a.name, a.value);
        });
        if (old.getAttribute('data-src')) s.src = old.getAttribute('data-src');
        else s.text = old.text;
        old.parentNode.replaceChild(s, old);
      });
      var frames = document.querySelectorAll('iframe[data-wfc="' + cat + '"][data-wfc-src]');
      Array.prototype.forEach.call(frames, function (f) {
        f.src = f.getAttribute('data-wfc-src');
        f.removeAttribute('data-wfc-src');
        f.style.display = '';
        var ph = f.previousElementSibling;
        if (ph && ph.classList.contains('wfc-placeholder')) ph.parentNode.removeChild(ph);
      });
    });
  }

  // zastępniki w miejscu zablokowanych ramek (Donorbox) — z przyciskiem zgody na media zewnętrzne
  function placeholders(c) {
    if (c && c.media) return;
    var frames = document.querySelectorAll('iframe[data-wfc="media"][data-wfc-src]');
    Array.prototype.forEach.call(frames, function (f) {
      var prev = f.previousElementSibling;
      if (prev && prev.classList.contains('wfc-placeholder')) return;
      f.style.display = 'none';
      var small = parseInt(f.getAttribute('height') || '0', 10) < 200;
      var ph = document.createElement('div');
      ph.className = 'wfc-placeholder' + (small ? ' wfc-placeholder--small' : '');
      ph.innerHTML = '<p>' + (small ? 'Licznik zbiórki jest wyświetlany przez serwis Donorbox.'
        : 'Formularz wpłat jest wyświetlany przez serwis Donorbox (płatności Stripe / PayPal), który zapisuje własne pliki cookies.') +
        '</p><button type="button" class="wfc-btn wfc-btn--primary">Pokaż' + (small ? '' : ' formularz wpłat') + '</button>' +
        ' <a href="' + POLICY + '" target="_blank" rel="noopener">Więcej</a>';
      ph.querySelector('button').addEventListener('click', function () {
        var cur = read() || { stats: false, media: false };
        save({ stats: cur.stats, media: true });
      });
      f.parentNode.insertBefore(ph, f);
    });
  }

  function save(c) {
    var before = read();
    write(c);
    hide();
    if (before && before.stats && !c.stats) { clearStats(); location.reload(); return; }
    if (before && before.media && !c.media) { location.reload(); return; }
    activate(c);
    placeholders(c);
  }

  // ---------- baner ----------
  var root = null;
  function hide() { if (root) { root.classList.remove('is-open'); root.setAttribute('aria-hidden', 'true'); } }

  function build() {
    if (root) return root;
    root = document.createElement('div');
    root.className = 'wfc';
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-modal', 'false');
    root.setAttribute('aria-labelledby', 'wfc-title');
    root.innerHTML =
      '<div class="wfc-card">' +
        '<h2 class="wfc-title" id="wfc-title">Szanujemy Twoją prywatność</h2>' +
        '<p class="wfc-text">Używamy niezbędnych plików cookies, żeby strona działała. Za Twoją zgodą włączymy też statystyki odwiedzin ' +
          '(Google Analytics) i treści zewnętrzne (formularz wpłat Donorbox). Zgodę możesz w każdej chwili zmienić w stopce: „Ustawienia cookies”. ' +
          '<a href="' + POLICY + '" target="_blank" rel="noopener">Polityka cookies</a></p>' +
        '<div class="wfc-prefs" hidden>' +
          '<label class="wfc-row"><span><strong>Niezbędne</strong><small>Zapamiętanie tej zgody, wybór języka, działanie formularzy i rezerwacji. Zawsze włączone.</small></span>' +
            '<input type="checkbox" checked disabled aria-label="Niezbędne — zawsze włączone"></label>' +
          '<label class="wfc-row"><span><strong>Statystyczne</strong><small>Google Analytics: anonimowe statystyki odwiedzin, które pomagają nam ulepszać stronę.</small></span>' +
            '<input type="checkbox" name="stats"></label>' +
          '<label class="wfc-row"><span><strong>Media zewnętrzne</strong><small>Formularz wpłat i licznik zbiórki Donorbox (płatności Stripe / PayPal).</small></span>' +
            '<input type="checkbox" name="media"></label>' +
        '</div>' +
        '<div class="wfc-actions">' +
          '<button type="button" class="wfc-btn wfc-btn--primary" data-act="reject">Odrzuć</button>' +
          '<button type="button" class="wfc-btn wfc-btn--outline" data-act="settings">Ustawienia</button>' +
          '<button type="button" class="wfc-btn wfc-btn--outline" data-act="save" hidden>Zapisz wybór</button>' +
          '<button type="button" class="wfc-btn wfc-btn--primary" data-act="all">Akceptuj wszystkie</button>' +
        '</div>' +
      '</div>';
    root.addEventListener('click', function (e) {
      var b = e.target.closest('[data-act]');
      if (!b) return;
      var act = b.getAttribute('data-act');
      if (act === 'all') save({ stats: true, media: true });
      else if (act === 'reject') save({ stats: false, media: false });
      else if (act === 'settings') showPrefs(true);
      else if (act === 'save') save({ stats: root.querySelector('[name=stats]').checked, media: root.querySelector('[name=media]').checked });
    });
    document.body.appendChild(root);
    return root;
  }

  function showPrefs(on) {
    var c = read() || { stats: false, media: false };
    root.querySelector('[name=stats]').checked = !!c.stats;
    root.querySelector('[name=media]').checked = !!c.media;
    root.querySelector('.wfc-prefs').hidden = !on;
    root.querySelector('[data-act=settings]').hidden = on;
    root.querySelector('[data-act=save]').hidden = !on;
  }

  function open(prefs) {
    build();
    showPrefs(!!prefs);
    root.classList.add('is-open');
    root.setAttribute('aria-hidden', 'false');
    var first = root.querySelector('[data-act=all]');
    if (first && prefs) root.querySelector('[name=stats]').focus();
  }

  window.WFCookies = {
    open: function () { open(true); return false; },
    get: read,
    acceptAll: function () { save({ stats: true, media: true }); },
    reject: function () { save({ stats: false, media: false }); },
  };

  // link „Ustawienia cookies” w stopce (stopka bywa doładowywana — obsługa przez delegację)
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('[data-wfc-open]');
    if (!a) return;
    e.preventDefault();
    open(true);
  });

  function init() {
    var c = read();
    if (c) activate(c);
    placeholders(c);
    if (!c) open(false);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
