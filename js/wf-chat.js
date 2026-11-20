/* KONSULTANT AI FUNDACJI — okno czatu (etap 2 planu rozbudowy, 2026-11-20).
 * Otwierają je elementy z atrybutem data-wf-chat. Odpowiada serwer aplikacji Zanders:
 *   POST {api}  body {messages:[{role:"user"|"model", text}]}  → {reply, open_booking}
 * Konsultant tylko informuje i kieruje (bez porad terapeutycznych); przy sygnałach kryzysu serwer zawsze dokłada
 * numery pomocowe. Gdy open_booking = true, pod odpowiedzią pojawia się przycisk otwierający kalendarz rezerwacji
 * (window.WFBooking z js/booking.js).
 * Prywatność: rozmowa żyje tylko w tym oknie (nie zapisujemy jej w przeglądarce ani na serwerze); nie ustawia cookies
 * i nie ładuje skryptów z zewnątrz — dlatego nie wymaga zgody w banerze cookies (wysyłka treści następuje dopiero
 * po kliknięciu „Wyślij”; opis w polityce prywatności, pkt XI).
 * Adres API: window.WF_CHAT = { api: "https://meble-crm.vercel.app/api/public/wf-consultant" }.
 */
(function () {
  'use strict';
  var API = (window.WF_CHAT && window.WF_CHAT.api) || 'https://meble-crm.vercel.app/api/public/wf-consultant';
  var MAX_LEN = 1000;
  var SUGGEST = ['Jak umówić bezpłatną rozmowę?', 'Czym zajmuje się fundacja?', 'Program dla rodziców', 'Jak dołączyć jako psycholog?'];
  var HELLO = 'Dzień dobry! Jestem wirtualnym konsultantem Fundacji WorldFoundation. Opowiem, jak działamy, jakie mamy programy, ' +
    'jak umówić bezpłatną rozmowę z psychologiem i jak się z nami skontaktować. W czym mogę pomóc?';

  var root, list, input, sendBtn, chips, history = [], busy = false, lastFocus = null;

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
  }
  // bezpieczne linki: adresy stron, e-mail, telefony (tekst najpierw zabezpieczony)
  function linkify(text) {
    var h = esc(text), saved = [];
    var keep = function (html) { saved.push(html); return '\u0001' + (saved.length - 1) + '\u0002'; };
    // najpierw e-maile (żeby reguła adresów stron nie rozbiła info@worldfoundation.eu)
    h = h.replace(/\b([a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,})\b/gi, function (m) { return keep('<a href="mailto:' + m + '">' + m + '</a>'); });
    h = h.replace(/\b((?:https?:\/\/)?(?:www\.)?(?:worldfoundation\.eu|meble-crm\.vercel\.app)(?:\/[^\s<,)\u0001]*[^\s<.,)\u0001])?)/g, function (m) {
      var url = /^https?:/.test(m) ? m : 'https://' + m;
      return keep('<a href="' + url + '" target="_blank" rel="noopener">' + m + '</a>');
    });
    h = h.replace(/(\+48 ?500 ?461 ?563|\+49 ?15212403091|\b116 ?111\b|\b800 ?12 ?12 ?12\b|\b112\b)/g, function (m) {
      return keep('<a href="tel:' + m.replace(/\s/g, '') + '">' + m + '</a>');
    });
    h = h.replace(/\u0001(\d+)\u0002/g, function (_, i) { return saved[+i]; });
    return h.replace(/\n/g, '<br>');
  }

  function build() {
    if (root) return;
    root = document.createElement('div');
    root.className = 'wfa-root';
    root.hidden = true;
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-modal', 'true');
    root.setAttribute('aria-labelledby', 'wfa-title');
    root.innerHTML =
      '<div class="wfa-backdrop" data-wfa-close></div>' +
      '<section class="wfa-panel">' +
        '<header class="wfa-head">' +
          '<span class="wfa-ava" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 3c-4.97 0-9 3.58-9 8 0 2.1.92 4.01 2.42 5.44L5 21l4.3-1.91c.86.21 1.77.33 2.7.33 4.97 0 9-3.58 9-8s-4.03-8-9-8z" fill="currentColor"/></svg></span>' +
          '<div class="wfa-head-txt"><h2 id="wfa-title">Konsultant AI fundacji</h2>' +
          '<p>Informuję o fundacji i kieruję. Nie udzielam porad psychologicznych.</p></div>' +
          '<button type="button" class="wfa-x" data-wfa-close aria-label="Zamknij czat">×</button>' +
        '</header>' +
        '<div class="wfa-list" aria-live="polite"></div>' +
        '<div class="wfa-chips"></div>' +
        '<form class="wfa-form" novalidate>' +
          '<textarea class="wfa-input" rows="1" maxlength="' + MAX_LEN + '" placeholder="Napisz pytanie…" aria-label="Twoje pytanie"></textarea>' +
          '<button type="submit" class="wfa-send" aria-label="Wyślij"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 20.5l18-8.5L3 3.5l2.5 7L15 12l-9.5 1.5z" fill="currentColor"/></svg></button>' +
        '</form>' +
        '<p class="wfa-note">Nie podawaj danych osobowych ani informacji o zdrowiu — rozmowa nie jest zapisywana. ' +
          'W nagłym zagrożeniu dzwoń <a href="tel:112">112</a>, telefon zaufania <a href="tel:116111">116 111</a>. ' +
          '<a href="polityka-prywatnosci.html#konsultant" target="_blank" rel="noopener">Prywatność</a></p>' +
      '</section>';
    document.body.appendChild(root);
    list = root.querySelector('.wfa-list');
    input = root.querySelector('.wfa-input');
    sendBtn = root.querySelector('.wfa-send');
    chips = root.querySelector('.wfa-chips');
    SUGGEST.forEach(function (s) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'wfa-chip'; b.textContent = s;
      b.addEventListener('click', function () { send(s); });
      chips.appendChild(b);
    });
    root.addEventListener('click', function (e) {
      if (e.target.closest('[data-wfa-close]')) close();
      var bk = e.target.closest('[data-wfa-booking]');
      if (bk) { e.preventDefault(); openBooking(); }
    });
    root.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
      if (e.key === 'Tab') trapFocus(e);
    });
    root.querySelector('.wfa-form').addEventListener('submit', function (e) { e.preventDefault(); send(input.value); });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input.value); }
    });
    input.addEventListener('input', grow);
    addMsg('model', HELLO);
  }

  function grow() {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 120) + 'px';
  }

  function trapFocus(e) {
    var f = root.querySelectorAll('button:not([disabled]), textarea, a[href]');
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  function addMsg(role, text, opts) {
    var row = document.createElement('div');
    row.className = 'wfa-msg wfa-msg--' + (role === 'user' ? 'me' : 'bot');
    var bubble = document.createElement('div');
    bubble.className = 'wfa-bubble';
    bubble.innerHTML = role === 'user' ? esc(text).replace(/\n/g, '<br>') : linkify(text);
    row.appendChild(bubble);
    if (opts && opts.booking) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'wfa-book';
      b.setAttribute('data-wfa-booking', '');
      b.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 2v2H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2V2h-2v2H9V2zm12 7v10H5V9z" fill="currentColor"/></svg> Otwórz kalendarz — umów bezpłatną rozmowę';
      row.appendChild(b);
    }
    list.appendChild(row);
    list.scrollTop = list.scrollHeight;
    return row;
  }

  function typing(on) {
    var t = list.querySelector('.wfa-typing');
    if (on && !t) {
      t = document.createElement('div');
      t.className = 'wfa-msg wfa-msg--bot wfa-typing';
      t.innerHTML = '<div class="wfa-bubble" aria-label="Konsultant pisze"><span></span><span></span><span></span></div>';
      list.appendChild(t);
      list.scrollTop = list.scrollHeight;
    } else if (!on && t) t.parentNode.removeChild(t);
  }

  function send(text) {
    text = String(text || '').trim().slice(0, MAX_LEN);
    if (!text || busy) return;
    busy = true;
    sendBtn.disabled = true;
    chips.hidden = true;
    input.value = ''; grow();
    addMsg('user', text);
    history.push({ role: 'user', text: text });
    typing(true);
    fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: history.slice(-20) }) })
      .then(function (r) { return r.json().catch(function () { return {}; }); })
      .then(function (res) {
        var reply = (res && res.reply) || 'Przepraszam, chwilowo nie mogę odpowiedzieć. Zadzwoń: +48 500 461 563 albo napisz: info@worldfoundation.eu.';
        typing(false);
        addMsg('model', reply, { booking: !!(res && res.open_booking) });
        history.push({ role: 'model', text: reply });
      })
      .catch(function () {
        typing(false);
        addMsg('model', 'Nie udało się połączyć. Sprawdź internet albo zadzwoń: +48 500 461 563 (e-mail: info@worldfoundation.eu).', { booking: true });
      })
      .then(function () { busy = false; sendBtn.disabled = false; input.focus(); });
  }

  function open() {
    build();
    lastFocus = document.activeElement;
    root.hidden = false;
    document.documentElement.classList.add('wfa-lock');
    void root.offsetWidth; // start animacji
    root.classList.remove('is-closing');
    root.classList.add('is-open');
    setTimeout(function () { input.focus(); }, 250);
  }

  function close(cb) {
    if (!root || root.hidden) { if (typeof cb === 'function') cb(); return; }
    root.classList.remove('is-open');
    root.classList.add('is-closing');
    setTimeout(function () {
      root.hidden = true;
      root.classList.remove('is-closing');
      document.documentElement.classList.remove('wfa-lock');
      if (typeof cb === 'function') cb();
      else if (lastFocus && lastFocus.focus) lastFocus.focus();
    }, 320);
  }

  function openBooking() {
    close(function () {
      if (window.WFBooking && window.WFBooking.open) window.WFBooking.open();
      else {
        var t = document.getElementById('services');
        if (t) t.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('[data-wf-chat]');
    if (!t) return;
    e.preventDefault();
    open();
  });

  window.WFChat = { open: open, close: close };
})();
