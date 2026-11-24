/* KONSULTANT AI FUNDACJI — pływające „kółeczko” z globusem + okno czatu (zlecenie 13, 2026-11-21).
 * Wygląd i zachowanie jak konsultant Zanders Atelier (repo metastudio: modale/konsultant.js), w barwach fundacji:
 * okrągły przycisk w prawym dolnym rogu, chmurka-zachęta po kilku sekundach, okno rozwija się nad przyciskiem,
 * nagłówek z obrazkiem i nazwą, dymki, „pisze…”, „Nowa rozmowa”, rozmowa pamiętana w sessionStorage
 * (przechodzi między podstronami, znika po zamknięciu karty), na telefonie okno na cały ekran.
 * Treść i zasady jak dotąd: konsultant WYŁĄCZNIE informacyjny, w czacie nie zbieramy żadnych danych (brak formularza
 * kontaktu z Atelier). Zamiast „Poproś o kontakt” — „Umów bezpłatną rozmowę” (kalendarz z js/booking.js; na podstronach
 * bez kalendarza przejście do index.html#rezerwacja). Gdy serwer zwróci open_booking — przycisk kalendarza w rozmowie.
 * Na stronie programu dla rodziców okno wita zaproszeniem do programu z przyciskiem do formularza (#zgloszenie).
 * Otwierają: kółeczko, chmurka i elementy z atrybutem data-wf-chat (np. „Zapytaj konsultanta” pod filmem).
 * Serwer: POST {api} {messages:[{role:"user"|"model", text}]} → {reply, open_booking} (aplikacja Zanders, Gemini).
 * Adres API: window.WF_CHAT = { api: "…" } (domyślnie produkcja). Opis prywatności: polityka, pkt VIII i XI.
 */
(function () {
  'use strict';
  if (window.WFChat) return;
  var API = (window.WF_CHAT && window.WF_CHAT.api) || 'https://meble-crm.vercel.app/api/public/wf-consultant';
  var STORE = 'wf-konsultant-v1';
  var MAX_LEN = 1000;
  var SCRIPT = document.currentScript && document.currentScript.src;
  var AVATAR = (function () {
    try { return new URL('../images/konsultant/konsultantka-240.webp', SCRIPT || location.href).href; } catch (e) { return '../images/konsultant/konsultantka-240.webp'; }
  })();
  var PAGE = /program-dla-rodzicow\.html/.test(location.pathname) ? 'program'
    : /dolacz\.html/.test(location.pathname) ? 'dolacz'
    : /zrodla-programu\.html/.test(location.pathname) ? 'zrodla' : 'main';

  var T = {
    title: 'Konsultant fundacji',
    sub: 'Odpowiadam od razu',
    hello: 'Dzień dobry! Jestem wirtualnym konsultantem Fundacji WorldFoundation. Opowiem, jak działamy, jakie mamy programy, ' +
      'jak umówić bezpłatną rozmowę z psychologiem i jak się z nami skontaktować. W czym mogę pomóc?',
    helloProgram: 'Dzień dobry! Chcesz, żeby program „Technoferencja w rodzinie” poprowadzić w Twojej szkole albo wziąć w nim udział jako rodzic? ' +
      'Wypełnij krótkie zgłoszenie na tej stronie — odezwiemy się. Chętnie też odpowiem na pytania o program i fundację.',
    toForm: 'Przejdź do zgłoszenia',
    placeholder: 'Napisz pytanie…',
    typing: 'Konsultant pisze…',
    reset: 'Nowa rozmowa', close: 'Zamknij', send: 'Wyślij',
    booking: 'Umów bezpłatną rozmowę',
    bookingInline: 'Otwórz kalendarz — umów bezpłatną rozmowę',
    open: 'Porozmawiaj z konsultantem fundacji',
    teaser: {
      main: 'Masz pytanie o fundację albo bezpłatną rozmowę z psychologiem? Zapytaj naszego konsultanta.',
      program: 'Chcesz program w swojej szkole? Zapytaj konsultanta albo wypełnij krótkie zgłoszenie.',
      zrodla: 'Masz pytanie o program dla rodziców? Zapytaj konsultanta.',
      dolacz: 'Jesteś psychologiem? Zapytaj konsultanta, jak dołączyć do fundacji.',
    },
    teaserClose: 'Zamknij podpowiedź',
    error: 'Nie udało się połączyć. Sprawdź internet albo zadzwoń: +48 500 461 563 (e-mail: info@worldfoundation.eu).',
    noReply: 'Przepraszam, chwilowo nie mogę odpowiedzieć. Zadzwoń: +48 500 461 563 albo napisz: info@worldfoundation.eu.',
  };
  var SUGGEST = PAGE === 'program' || PAGE === 'zrodla'
    ? ['Ile trwa spotkanie dla rodziców?', 'Czy spotkanie jest bezpłatne?', 'Jak zgłosić szkołę?', 'Czym zajmuje się fundacja?']
    : PAGE === 'dolacz'
      ? ['Jak dołączyć jako psycholog?', 'Jak wygląda weryfikacja?', 'Czym zajmuje się fundacja?']
      : ['Jak umówić bezpłatną rozmowę?', 'Czym zajmuje się fundacja?', 'Program dla rodziców', 'Jak dołączyć jako psycholog?'];

  // ---------- stan rozmowy (sessionStorage — tylko ta karta przeglądarki) ----------
  var msgs = [];
  try {
    var saved = JSON.parse(sessionStorage.getItem(STORE) || 'null');
    if (saved && Array.isArray(saved.msgs)) msgs = saved.msgs.filter(function (m) { return m && typeof m.text === 'string'; });
  } catch (e) { /* brak dostępu do pamięci — okno działa bez niej */ }
  function save() {
    try {
      if (msgs.length) sessionStorage.setItem(STORE, JSON.stringify({ msgs: msgs.slice(-30) }));
      else sessionStorage.removeItem(STORE);
    } catch (e) { /* jw. */ }
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
  }
  // bezpieczne linki: adresy stron, e-mail, telefony (tekst najpierw zabezpieczony)
  function linkify(text) {
    var h = esc(text), kept = [];
    var keep = function (html) { kept.push(html); return '\u0001' + (kept.length - 1) + '\u0002'; };
    h = h.replace(/\b([a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,})\b/gi, function (m) { return keep('<a href="mailto:' + m + '">' + m + '</a>'); });
    h = h.replace(/\b((?:https?:\/\/)?(?:www\.)?(?:worldfoundation\.eu|worldfoundation\.vercel\.app|meble-crm\.vercel\.app)(?:\/[^\s<,)\u0001]*[^\s<.,)\u0001])?)/g, function (m) {
      var url = /^https?:/.test(m) ? m : 'https://' + m;
      return keep('<a href="' + url + '" target="_blank" rel="noopener">' + m + '</a>');
    });
    h = h.replace(/(\+48 ?500 ?461 ?563|\+49 ?15212403091|\b116 ?111\b|\b800 ?12 ?12 ?12\b|\b112\b)/g, function (m) {
      return keep('<a href="tel:' + m.replace(/\s/g, '') + '">' + m + '</a>');
    });
    h = h.replace(/\u0001(\d+)\u0002/g, function (_, i) { return kept[+i]; });
    return h.replace(/\n/g, '<br>');
  }

  var ICON_CAL = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 2v2H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2V2h-2v2H9V2zm12 7v10H5V9z" fill="currentColor"/></svg>';
  var ICON_SEND = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 20.5l18-8.5L3 3.5l2.5 7L15 12l-9.5 1.5z" fill="currentColor"/></svg>';
  var ICON_RESET = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5V2L7 6l5 4V7a5 5 0 1 1-5 5H5a7 7 0 1 0 7-7z" fill="currentColor"/></svg>';
  var ICON_X = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.4 5 5 6.4 10.6 12 5 17.6 6.4 19l5.6-5.6 5.6 5.6 1.4-1.4-5.6-5.6L19 6.4 17.6 5 12 10.6z" fill="currentColor"/></svg>';

  var root, log, ta, sendBtn, fab, tip, busy = false, lastFocus = null;

  // ---------- kółeczko ----------
  function buildFab() {
    fab = document.createElement('button');
    fab.type = 'button';
    fab.id = 'wfa-fab';
    fab.setAttribute('aria-label', T.open);
    fab.setAttribute('aria-expanded', 'false');
    fab.innerHTML = '<img src="' + AVATAR + '" alt="" width="70" height="70"><span class="wfa-fab__dot" aria-hidden="true"></span>';
    fab.addEventListener('click', function () { hideTip(); if (isOpen()) close(); else open(); });
    document.body.appendChild(fab);
    document.documentElement.classList.add('wfa-has-fab');
  }

  // ---------- okno ----------
  function build() {
    if (root) return;
    root = document.createElement('div');
    root.id = 'wfa-chat';
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-label', T.title);
    root.innerHTML =
      '<div class="wfa-head">' +
        '<img src="' + AVATAR + '" alt="" width="40" height="40">' +
        '<div class="wfa-head-t"><strong>' + esc(T.title) + '</strong><span>' + esc(T.sub) + '</span></div>' +
        '<button type="button" class="wfa-icon wfa-reset" title="' + esc(T.reset) + '" aria-label="' + esc(T.reset) + '">' + ICON_RESET + '</button>' +
        '<button type="button" class="wfa-icon wfa-close" title="' + esc(T.close) + '" aria-label="' + esc(T.close) + '">' + ICON_X + '</button>' +
      '</div>' +
      '<div class="wfa-log" aria-live="polite"></div>' +
      '<div class="wfa-bottom">' +
        '<button type="button" class="wfa-bookbtn" data-wfa-booking>' + ICON_CAL + '<span>' + esc(T.booking) + '</span></button>' +
        '<div class="wfa-input">' +
          '<textarea rows="1" maxlength="' + MAX_LEN + '" placeholder="' + esc(T.placeholder) + '" aria-label="' + esc(T.placeholder) + '"></textarea>' +
          '<button type="button" class="wfa-send" aria-label="' + esc(T.send) + '">' + ICON_SEND + '</button>' +
        '</div>' +
        '<p class="wfa-note">Czat ma charakter wyłącznie informacyjny — nie zbieram danych i nie udzielam porad zdrowotnych. ' +
          'Nie podawaj danych osobowych ani informacji o zdrowiu. W nagłym zagrożeniu dzwoń <a href="tel:112">112</a>, ' +
          'telefon zaufania <a href="tel:116111">116 111</a>. <a href="polityka-prywatnosci.html#konsultant" target="_blank" rel="noopener">Prywatność</a></p>' +
      '</div>';
    document.body.appendChild(root);
    log = root.querySelector('.wfa-log');
    ta = root.querySelector('textarea');
    sendBtn = root.querySelector('.wfa-send');

    root.querySelector('.wfa-close').addEventListener('click', function () { close(); });
    root.querySelector('.wfa-reset').addEventListener('click', function () { msgs = []; save(); render(); ta.focus(); });
    root.addEventListener('click', function (e) {
      if (e.target.closest('[data-wfa-booking]')) { e.preventDefault(); openBooking(); }
    });
    sendBtn.addEventListener('click', function () { send(ta.value); });
    ta.addEventListener('input', grow);
    ta.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(ta.value); }
    });
    root.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
    // przeglądarka telefonu potrafi „przewinąć” samo okno przy fokusie — przewija się tylko rozmowa
    root.addEventListener('scroll', function () { if (root.scrollTop) root.scrollTop = 0; });
    root.addEventListener('focusin', function () { setTimeout(fitViewport, 50); setTimeout(fitViewport, 350); });
    render();
  }

  function bubble(role, text, extra) {
    var d = document.createElement('div');
    d.className = 'wfa-msg wfa-' + (role === 'user' ? 'user' : 'model') + (extra ? ' ' + extra : '');
    d.innerHTML = role === 'user' ? esc(text).replace(/\n/g, '<br>') : linkify(text);
    log.appendChild(d);
    log.scrollTop = log.scrollHeight;
    return d;
  }
  function chips(list) {
    var old = log.querySelector('.wfa-chips');
    if (old) old.parentNode.removeChild(old);
    if (!list || !list.length) return;
    var box = document.createElement('div');
    box.className = 'wfa-chips';
    list.forEach(function (c) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'wfa-chip' + (c.main ? ' wfa-chip-main' : '');
      b.innerHTML = c.html || esc(c.label);
      b.addEventListener('click', c.fn);
      box.appendChild(b);
    });
    log.appendChild(box);
    log.scrollTop = log.scrollHeight;
  }
  function bookingChip(row) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'wfa-chip wfa-chip-main wfa-inline-book';
    b.setAttribute('data-wfa-booking', '');
    b.innerHTML = ICON_CAL + '<span>' + esc(T.bookingInline) + '</span>';
    row.insertAdjacentElement('afterend', b);
    log.scrollTop = log.scrollHeight;
  }
  function suggestions() {
    if (msgs.length) return;
    var list = SUGGEST.map(function (s) { return { label: s, fn: function () { send(s); } }; });
    if (PAGE === 'program' && document.getElementById('zgloszenie')) {
      list.unshift({ label: T.toForm + ' →', main: true, fn: goToForm });
    }
    chips(list);
  }
  function render() {
    log.innerHTML = '';
    bubble('model', PAGE === 'program' ? T.helloProgram : T.hello);
    msgs.forEach(function (m) {
      var d = bubble(m.role, m.text);
      if (m.booking) bookingChip(d);
    });
    suggestions();
  }
  function grow() {
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
  }

  function send(text) {
    text = String(text || '').trim().slice(0, MAX_LEN);
    if (!text || busy) return;
    busy = true;
    sendBtn.disabled = true;
    chips(null);
    ta.value = '';
    grow();
    msgs.push({ role: 'user', text: text });
    bubble('user', text);
    save();
    var typing = bubble('model', T.typing, 'wfa-typing');
    typing.innerHTML = '<span class="wfa-dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="wfa-sr">' + esc(T.typing) + '</span>';
    var history = msgs.map(function (m) { return { role: m.role, text: m.text }; }).slice(-20);
    fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: history }) })
      .then(function (r) { return r.json().catch(function () { return {}; }); })
      .then(function (res) {
        var reply = (res && res.reply) || T.noReply;
        var booking = !!(res && res.open_booking);
        typing.remove();
        msgs.push(booking ? { role: 'model', text: reply, booking: true } : { role: 'model', text: reply });
        save();
        var d = bubble('model', reply);
        if (booking) bookingChip(d);
      })
      .catch(function () {
        typing.remove();
        var d = bubble('model', T.error);
        bookingChip(d);
      })
      .then(function () {
        busy = false;
        sendBtn.disabled = false;
        if (isOpen() && !mobile.matches) ta.focus();
      });
  }

  // ---------- kalendarz i formularz programu ----------
  function openBooking() {
    close(true);
    if (window.WFBooking && window.WFBooking.open) { window.WFBooking.open(); return; }
    location.href = 'index.html#rezerwacja';
  }
  function goToForm() {
    var f = document.getElementById('zgloszenie');
    close(true);
    if (!f) return;
    f.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ---------- telefon: okno = widoczna część ekranu (klawiatura nie wypycha nagłówka) ----------
  var vv = window.visualViewport;
  var mobile = window.matchMedia('(max-width: 768px)');
  function fitViewport() {
    if (!root) return;
    if (!vv || !mobile.matches || !isOpen()) {
      root.style.top = root.style.height = root.style.bottom = '';
      return;
    }
    root.style.top = vv.offsetTop + 'px';
    root.style.height = vv.height + 'px';
    root.style.bottom = 'auto';
    log.scrollTop = log.scrollHeight;
  }
  if (vv) {
    vv.addEventListener('resize', fitViewport);
    vv.addEventListener('scroll', fitViewport);
  }

  function isOpen() { return !!root && root.classList.contains('wfa-open'); }
  function open() {
    build();
    hideTip();
    lastFocus = document.activeElement;
    root.classList.add('wfa-open');
    document.documentElement.classList.add('wfa-chat-on');
    if (fab) fab.setAttribute('aria-expanded', 'true');
    fitViewport();
    log.scrollTop = log.scrollHeight;
    setTimeout(function () { if (!mobile.matches) ta.focus(); else root.querySelector('.wfa-close').focus({ preventScroll: true }); }, 200);
  }
  function close(silent) {
    if (!isOpen()) return;
    root.classList.remove('wfa-open');
    document.documentElement.classList.remove('wfa-chat-on');
    if (fab) fab.setAttribute('aria-expanded', 'false');
    fitViewport();
    if (silent !== true && lastFocus && lastFocus.focus) try { lastFocus.focus({ preventScroll: true }); } catch (e) { /* bez fokusu */ }
  }

  // ---------- chmurka przy kółeczku (każde wejście na stronę; nie przy otwartym oknie ani banerze cookies) ----------
  function hideTip() {
    if (!tip) return;
    var t = tip;
    tip = null;
    t.classList.remove('wfa-teaser-on');
    setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 400);
  }
  function showTip() {
    if (isOpen() || tip || document.documentElement.classList.contains('wfa-cookie-on')) return;
    tip = document.createElement('div');
    tip.className = 'wfa-teaser';
    tip.setAttribute('role', 'status');
    tip.innerHTML = '<button type="button" class="wfa-teaser-text">' + esc(T.teaser[PAGE] || T.teaser.main) + '</button>' +
      '<button type="button" class="wfa-teaser-x" aria-label="' + esc(T.teaserClose) + '" title="' + esc(T.teaserClose) + '">' + ICON_X + '</button>';
    tip.querySelector('.wfa-teaser-x').addEventListener('click', function (e) { e.stopPropagation(); hideTip(); });
    tip.querySelector('.wfa-teaser-text').addEventListener('click', function () { open(); });
    document.body.appendChild(tip);
    requestAnimationFrame(function () { requestAnimationFrame(function () { if (tip) tip.classList.add('wfa-teaser-on'); }); });
    // chmurka nie wisi nad treścią strony (np. kalendarzem rezerwacji na telefonie): znika sama po 15 s,
    // a na telefonie także przy przewijaniu strony
    var shownAt = Date.now();
    setTimeout(hideTip, 15000);
    if (mobile.matches) {
      var onScroll = function () {
        if (Date.now() - shownAt < 1200) return;
        window.removeEventListener('scroll', onScroll);
        hideTip();
      };
      window.addEventListener('scroll', onScroll, { passive: true });
    }
  }

  // ---------- baner cookies: przy otwartym banerze kółeczko i chmurka chowają się (nie zasłaniają przycisków) ----------
  function syncCookie() {
    var on = !!document.querySelector('.wfc.is-open');
    document.documentElement.classList.toggle('wfa-cookie-on', on);
    if (on) hideTip();
  }

  // ---------- start ----------
  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('[data-wf-chat]');
    if (!t) return;
    e.preventDefault();
    open();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isOpen()) close();
  });

  function start() {
    buildFab();
    syncCookie();
    if (window.MutationObserver) {
      new MutationObserver(syncCookie).observe(document.body, { subtree: true, attributes: true, attributeFilter: ['class'], childList: true });
    }
    setTimeout(showTip, 6000);
  }
  if (document.body) start();
  else document.addEventListener('DOMContentLoaded', start);

  window.WFChat = { open: open, close: close };
})();
