/* =========================================================================
   Rezerwacja rozmów — World Foundation (etap 1 planu rozbudowy, 2026-11-14)
   Kroki: 1 Termin (kalendarz + godziny) → 2 Twoje dane → 3 Gotowe.
   Konfiguracja (opcjonalna, przed załadowaniem skryptu):
     window.WF_BOOKING = { api: "https://meble-crm.vercel.app/api/public/booking" }
   Bez `api` moduł działa w TRYBIE PODGLĄDU (przykładowe terminy, nic nie wysyła).
   Kontrakt z aplikacją (krok 1C):
     GET  {api}/slots?from=YYYY-MM-DD&to=YYYY-MM-DD
          → { slots:[{start,end,specialist_id,specialist_name,specialist_role,specialist_photo}] }
          (kilka osób → nad kalendarzem wybór „Z kim chcesz porozmawiać?” ze zdjęciami)
     POST {api}            body {start,specialist_id,name,phone,email,note,consent,website}
                           → 200 { ok:true } | 409 { error:"taken" } | 4xx { error:"…" }
   Otwierają go: linki href="#modalSpotkanie" i elementy z atrybutem data-wf-booking,
   albo window.WFBooking.open({ day:'YYYY-MM-DD' }).
   Kalendarzyk w sekcji strony: element z atrybutem data-wfb-mini (klik w wolny dzień
   otwiera okno od razu na tym dniu).
   Rozmowę inicjuje FUNDACJA — osoba przypisana do godziny dzwoni na numer z formularza
   (Adam 2026-11-14: nie zawsze psycholog, więc w tekstach „zadzwonimy do Ciebie”).
   ========================================================================= */
(function () {
  'use strict';

  var CFG = Object.assign({
    api: null,
    phone: '+48 500 461 563',
    phoneHref: '+48500461563',
    privacy: 'polityka-prywatnosci.html',
    logo: '../images/logo/logo.png',
    minHours: 24,      // najwcześniej za tyle godzin
    maxDays: 42        // najpóźniej za tyle dni
  }, window.WF_BOOKING || {});
  var DEMO = !CFG.api;

  var DOW = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'];
  var fmtDay = new Intl.DateTimeFormat('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' });
  var fmtMonth = new Intl.DateTimeFormat('pl-PL', { month: 'long', year: 'numeric' });

  /* ---------- ikony ---------- */
  var I = {
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>',
    next: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    gift: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12v9H4v-9M2 7h20v5H2zM12 21V7M12 7H7.5a2.5 2.5 0 1 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 1 0 0-5C13 2 12 7 12 7z"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/></svg>',
    person: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
    cal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4.5" width="18" height="17" rx="3"/><path d="M3 10h18M8 2.5v4M16 2.5v4"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="4.5" width="19" height="15" rx="3"/><path d="M3 7l9 6 9-6"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.5v.5"/></svg>',
    tick: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    bigTick: '<svg viewBox="0 0 104 104" fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"><path d="M32 54l14 14 27-30"/></svg>'
  };

  /* ---------- daty ---------- */
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function ymd(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function parseLocal(s) { // "YYYY-MM-DDTHH:mm[:ss]" → Date (czas lokalny)
    var m = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2}))?/.exec(s);
    return new Date(+m[1], +m[2] - 1, +m[3], +(m[4] || 0), +(m[5] || 0));
  }
  function hm(s) { return s.slice(11, 16); }
  function plural(n, one, few, many) {
    if (n === 1) return one;
    var d = n % 10, t = n % 100;
    return (d >= 2 && d <= 4 && (t < 12 || t > 14)) ? few : many;
  }
  function firstOfMonth(d) { return new Date(d.getFullYear(), d.getMonth(), 1); }
  function addMonths(d, n) { return new Date(d.getFullYear(), d.getMonth() + n, 1); }

  /* ---------- dane ---------- */
  // PODGLĄD: dwie osoby z zakładki „Zespół” (zdjęcia tymczasowe, do podmiany na dyżurujących)
  // Godziny podglądu wg Adama (2026-11-14): środa 17–18 Adam, 18–19 razem; czwartek 17–18 Anna, 18–19 razem.
  var DEMO_PEOPLE = [
    { id: 'adam', name: 'Adam Zanders', role: 'Prezes Fundacji', photo: '../images/Postacie/Adam%20kopia.webp',
      plan: { 3: [17, 19], 4: [18, 19] } },
    { id: 'anna', name: 'Anna Zychowicz', role: 'Współzałożycielka fundacji', photo: '../images/Postacie/Ania.jpg',
      plan: { 3: [18, 19], 4: [17, 19] } }
  ];
  function demoSlots() {
    var out = [], now = new Date(), min = new Date(now.getTime() + CFG.minHours * 36e5);
    for (var i = 0; i <= CFG.maxDays; i++) {
      var d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
      DEMO_PEOPLE.forEach(function (who, wi) {
        var p = who.plan[d.getDay()];
        if (!p) return;
        for (var m = p[0] * 60; m + 30 <= p[1] * 60; m += 30) {
          var s = new Date(d.getFullYear(), d.getMonth(), d.getDate(), Math.floor(m / 60), m % 60);
          if (s < min) continue;
          var e = new Date(s.getTime() + 30 * 6e4);
          out.push({ start: ymd(s) + 'T' + pad(s.getHours()) + ':' + pad(s.getMinutes()) + ':00',
                     end: ymd(e) + 'T' + pad(e.getHours()) + ':' + pad(e.getMinutes()) + ':00',
                     specialist_id: who.id, specialist_name: who.name, specialist_role: who.role, specialist_photo: who.photo });
        }
      });
    }
    return out;
  }
  function loadSlots() {
    if (DEMO) return new Promise(function (r) { setTimeout(function () { r(demoSlots()); }, 450); });
    var now = new Date(), to = new Date(now.getTime() + CFG.maxDays * 864e5);
    return fetch(CFG.api + '/slots?from=' + ymd(now) + '&to=' + ymd(to), { headers: { Accept: 'application/json' } })
      .then(function (r) { if (!r.ok) throw new Error('slots ' + r.status); return r.json(); })
      .then(function (j) { return j.slots || []; });
  }
  function sendBooking(payload) {
    if (DEMO) return new Promise(function (r) { setTimeout(function () { r({ ok: true }); }, 1100); });
    return fetch(CFG.api, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { j.status = r.status; return j; }); });
  }

  /* ---------- stan ---------- */
  var root, els = {}, st = {
    step: 0, month: firstOfMonth(new Date()), byDay: {}, groups: [], all: [], people: [], person: null, loaded: false, loading: false,
    day: null, slot: null, email: '', lastFocus: null
  };

  function h(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }

  function build() {
    root = h('div', 'wfb-root');
    root.hidden = true;
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-modal', 'true');
    root.setAttribute('aria-labelledby', 'wfb-title');
    root.innerHTML =
      '<div class="wfb-backdrop" data-close></div>' +
      '<div class="wfb-panel">' +
        (DEMO ? '<div class="wfb-demo">PODGLĄD<span class="wfb-demo-more"> — przykładowe terminy</span></div>' : '') +
        '<aside class="wfb-aside">' +
          // górna część (logo, tytuł, opis, 3 pola) — na telefonie w kroku „Twoje dane” zjeżdża w górę
          '<div class="wfb-aside-top"><div class="wfb-aside-top-in">' +
          '<div class="wfb-logo"><img src="' + CFG.logo + '" alt="World Foundation"></div>' +
          '<h2 id="wfb-title">Umów rozmowę</h2>' +
          '<p class="wfb-lead">Wybierz dogodny termin —&nbsp;o&nbsp;tej godzinie zadzwonimy i&nbsp;porozmawiamy o&nbsp;tym, z&nbsp;czym przychodzisz.</p>' +
          '<ul class="wfb-facts">' +
            '<li>' + I.gift + '<span>Rozmowa jest bezpłatna</span></li>' +
            '<li>' + I.clock + '<span>Trwa do 30 minut</span></li>' +
            '<li>' + I.phone + '<span>Zadzwonimy do Ciebie</span></li>' +
          '</ul>' +
          '</div></div>' +
          '<div class="wfb-aside-sep"></div>' +
          '<div class="wfb-summary" data-sumbox>' +
            '<div class="wfb-summary-txt">' +
              '<span class="wfb-summary-label" data-sumlabel>Twój termin</span>' +
              '<span class="wfb-summary-value" data-summary>Wybierz dzień w kalendarzu</span>' +
              '<span class="wfb-summary-time" data-sumtime></span>' +
              '<span class="wfb-summary-who" data-sumwho></span>' +
              '<span class="wfb-summary-name" data-sumname></span>' +
              '<button type="button" class="wfb-sum-change" data-change>Zmień</button>' +
            '</div>' +
            '<span class="wfb-summary-photo" data-sumphoto></span>' +
          '</div>' +
        '</aside>' +
        '<section class="wfb-main">' +
          '<div class="wfb-head">' +
            '<button type="button" class="wfb-back" data-back aria-label="Wstecz" aria-hidden="true">' + I.back + '</button>' +
            '<div class="wfb-steps">' +
              '<div class="wfb-step" data-st="0"><span class="wfb-step-dot">1</span><span class="wfb-step-label">Termin</span></div><div class="wfb-step-line" data-ln="0"></div>' +
              '<div class="wfb-step" data-st="1"><span class="wfb-step-dot">2</span><span class="wfb-step-label">Twoje dane</span></div><div class="wfb-step-line" data-ln="1"></div>' +
              '<div class="wfb-step" data-st="2"><span class="wfb-step-dot">3</span><span class="wfb-step-label">Gotowe</span></div>' +
            '</div>' +
            '<button type="button" class="wfb-close" data-close aria-label="Zamknij">' + I.close + '</button>' +
          '</div>' +
          '<div class="wfb-viewport">' +
            /* krok 1 */
            '<div class="wfb-pane" data-pane="0">' +
              '<h3 class="wfb-pane-title wfb-in" style="--i:0">Wybierz dzień i godzinę</h3>' +
              '<p class="wfb-pane-sub wfb-in" style="--i:1">Pokazujemy tylko wolne terminy.</p>' +
              '<div class="wfb-people wfb-in" style="--i:2" data-people hidden></div>' +
              '<div class="wfb-pick wfb-in" style="--i:3">' +
                '<div class="wfb-cal">' +
                  '<div class="wfb-cal-head"><div class="wfb-month" data-month><span></span></div>' +
                    '<div class="wfb-nav"><button type="button" data-prev aria-label="Poprzedni miesiąc">' + I.back + '</button><button type="button" data-next aria-label="Następny miesiąc">' + I.next + '</button></div></div>' +
                  '<div class="wfb-week">' + DOW.map(function (d) { return '<span>' + d + '</span>'; }).join('') + '</div>' +
                  '<div class="wfb-grid-wrap"><div class="wfb-grid" data-grid></div></div>' +
                  '<div class="wfb-loading" data-loading><span class="wfb-spin"></span>Sprawdzam wolne terminy…</div>' +
                  '<div class="wfb-legend"><span><i style="background:#f3f6ff;border-bottom:3px solid #6689ff"></i>Są wolne terminy</span><span><i style="background:#fff;border:1px solid #e3e6ee"></i>Brak terminów</span></div>' +
                  '<div class="wfb-tz">Godziny w czasie polskim.</div>' +
                '</div>' +
                '<div class="wfb-times"><div class="wfb-times-inner">' +
                  '<div class="wfb-times-day" data-tday></div><div class="wfb-times-count" data-tcount></div>' +
                  '<div class="wfb-slots" data-slots></div>' +
                '</div></div>' +
              '</div>' +
              '<div class="wfb-hint wfb-in" style="--i:4" data-hint>' + I.info + '<span>Kliknij wyróżniony dzień, a pojawią się wolne godziny.</span></div>' +
            '</div>' +
            /* krok 2 */
            '<div class="wfb-pane" data-pane="1">' +
              '<h3 class="wfb-pane-title wfb-in" style="--i:0">Twoje dane</h3>' +
              '<p class="wfb-pane-sub wfb-in" style="--i:1">Tylko tyle, ile potrzeba, żeby potwierdzić termin i zadzwonić.</p>' +
              
              '<form class="wfb-form" novalidate data-form>' +
                '<div class="wfb-field wfb-in" style="--i:3"><input id="wfb-name" name="name" autocomplete="given-name" placeholder=" " maxlength="60"><label for="wfb-name">Imię lub pseudonim</label><span class="wfb-err">Podaj imię lub pseudonim (co najmniej 2 znaki).</span></div>' +
                '<div class="wfb-field wfb-in" style="--i:4"><input id="wfb-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder=" " maxlength="20"><label for="wfb-phone">Telefon</label><span class="wfb-err">Podaj numer telefonu (9 cyfr).</span></div>' +
                '<div class="wfb-field is-wide wfb-in" style="--i:5"><input id="wfb-email" name="email" type="email" inputmode="email" autocomplete="email" placeholder=" " maxlength="120"><label for="wfb-email">E-mail — tu wyślemy potwierdzenie</label><span class="wfb-err">Podaj poprawny adres e-mail.</span></div>' +
                '<div class="wfb-field is-wide wfb-in" style="--i:6"><textarea id="wfb-note" name="note" placeholder=" " maxlength="500"></textarea><label for="wfb-note">Kilka słów o sobie <span class="wfb-opt">(nieobowiązkowe)</span></label><span class="wfb-counter" data-counter>0/500</span><span class="wfb-help">Na przykład z czym przychodzisz. Wystarczy jedno zdanie — możesz też nic nie pisać.</span></div>' +
                '<input class="wfb-hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">' +
                '<label class="wfb-consent wfb-in" style="--i:7" data-consent-wrap><input type="checkbox" name="consent"><span class="wfb-check">' + I.tick + '</span><span>Wyrażam zgodę na przetwarzanie moich danych w celu umówienia i przeprowadzenia rozmowy. Szczegóły w <a href="' + CFG.privacy + '" target="_blank" rel="noopener">polityce prywatności</a>.</span></label>' +
                '<div class="wfb-actions wfb-in" style="--i:8"><button type="submit" class="wfb-btn" data-submit><span class="wfb-spin"></span><span>Zarezerwuj rozmowę</span></button><span class="wfb-note-small">Rozmowa jest bezpłatna.</span></div>' +
              '</form>' +
            '</div>' +
            /* krok 3 */
            '<div class="wfb-pane" data-pane="2">' +
              '<div class="wfb-done">' +
                '<div class="wfb-done-mark">' + I.bigTick + '</div>' +
                '<h3 class="wfb-in" style="--i:4">Termin zarezerwowany</h3>' +
                '<p class="wfb-done-when wfb-in" style="--i:5" data-dwhen></p>' +
                '<div class="wfb-done-box wfb-in" style="--i:6">' +
                  '<div class="wfb-done-row">' + I.phone + '<span>O wybranej godzinie zadzwonimy na numer <b data-dphone></b><span data-dwho></span>. Połączenie może przyjść z nieznanego numeru — prosimy je odebrać.</span></div>' +
                  '<div class="wfb-done-row">' + I.mail + '<span>Potwierdzenie wysłaliśmy na adres <b data-demail></b>. Znajdziesz w nim też link do odwołania terminu.</span></div>' +
                  '<div class="wfb-done-row">' + I.clock + '<span>Rozmowa jest bezpłatna i trwa do 30 minut. Jeśli coś się zmieni, zadzwoń do nas: <a href="tel:' + CFG.phoneHref + '">' + CFG.phone + '</a>.</span></div>' +
                '</div>' +
                '<div class="wfb-done-actions wfb-in" style="--i:7"><button type="button" class="wfb-btn wfb-btn-ghost" data-ics>' + I.cal + '<span>Dodaj do kalendarza</span></button><button type="button" class="wfb-btn" data-close>Zamknij</button></div>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</section>' +
      '</div>';
    document.body.appendChild(root);

    function q(s) { return root.querySelector(s); }
    els.summary = q('[data-summary]'); els.month = q('[data-month] span'); els.grid = q('[data-grid]');
    els.prev = q('[data-prev]'); els.next = q('[data-next]'); els.loading = q('[data-loading]');
    els.pick = q('.wfb-pick'); els.tday = q('[data-tday]'); els.tcount = q('[data-tcount]'); els.slots = q('[data-slots]');
    els.hint = q('[data-hint]'); els.back = q('[data-back]'); els.form = q('[data-form]'); els.submit = q('[data-submit]');
    els.dwhen = q('[data-dwhen]'); els.demail = q('[data-demail]'); els.dphone = q('[data-dphone]'); els.dwho = q('[data-dwho]');
    els.sumbox = q('[data-sumbox]'); els.sumlabel = q('[data-sumlabel]'); els.sumtime = q('[data-sumtime]'); els.sumwho = q('[data-sumwho]'); els.sumname = q('[data-sumname]'); els.sumphoto = q('[data-sumphoto]'); els.people = q('[data-people]');
    els.counter = q('[data-counter]'); els.times = q('.wfb-times');
    els.panes = [].slice.call(root.querySelectorAll('[data-pane]'));
    els.steps = [].slice.call(root.querySelectorAll('[data-st]'));
    els.lines = [].slice.call(root.querySelectorAll('[data-ln]'));

    root.addEventListener('click', function (e) {
      var t = e.target.closest('[data-close],[data-back],[data-prev],[data-next],[data-change],[data-ics],[data-person],[data-dd],.wfb-day,.wfb-slot-time,.wfb-slot-go,.wfb-who-opt');
      if (!e.target.closest('.wfb-dd')) toggleDd(false);
      if (!t) return;
      if (t.hasAttribute('data-dd')) return toggleDd();
      if (t.hasAttribute('data-close')) return close();
      if (t.hasAttribute('data-back')) return go(st.step - 1);
      if (t.hasAttribute('data-change')) return go(0);
      if (t.hasAttribute('data-prev')) return shiftMonth(-1);
      if (t.hasAttribute('data-next')) return shiftMonth(1);
      if (t.hasAttribute('data-ics')) return downloadIcs();
      if (t.hasAttribute('data-person')) { toggleDd(false); return pickPerson(t.getAttribute('data-person') || null); }
      if (t.classList.contains('wfb-day')) return pickDay(t.getAttribute('data-day'), t);
      if (t.classList.contains('wfb-slot-time')) return clickTime(+t.getAttribute('data-gi'));
      if (t.classList.contains('wfb-who-opt')) return chooseSlot(+t.getAttribute('data-gi'), +t.getAttribute('data-si'));
      if (t.classList.contains('wfb-slot-go')) return go(1);
    });
    root.addEventListener('input', function (e) {
      if (!e.target.hasAttribute('data-ddq')) return;
      var q2 = e.target.value.trim().toLowerCase();
      [].forEach.call(els.people.querySelectorAll('.wfb-dd-opt[data-name]'), function (o) {
        o.hidden = q2 && o.getAttribute('data-name').indexOf(q2) < 0;
      });
    });
    root.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && els.people.querySelector('.wfb-dd.is-open')) { toggleDd(false); return; }
      if (e.key === 'Escape') close();
      if (e.key === 'Tab') trapFocus(e);
    });
    els.form.addEventListener('submit', submit);
    els.form.addEventListener('input', function (e) {
      var f = e.target.closest('.wfb-field, .wfb-consent');
      if (f) f.classList.remove('has-error');
      if (e.target.name === 'note') els.counter.textContent = e.target.value.length + '/500';
    });
    els.form.addEventListener('change', function (e) {
      if (e.target.name === 'consent') e.target.closest('.wfb-consent').classList.remove('has-error');
    });
  }

  function trapFocus(e) {
    var f = [].filter.call(root.querySelectorAll('button, a[href], input:not(.wfb-hp), textarea'), function (el) {
      return el.offsetParent !== null && !el.closest('[aria-hidden="true"]') && !el.closest('.wfb-pane:not(.is-current)');
    });
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  /* ---------- kroki ---------- */
  function go(n) {
    if (n < 0 || n > 2) return;
    if (n === 1 && !st.slot) return;
    st.step = n;
    els.panes.forEach(function (p, i) {
      p.classList.toggle('is-current', i === n);
      p.classList.toggle('is-left', i < n);
      p.setAttribute('aria-hidden', i === n ? 'false' : 'true');
      if (i === n) p.scrollTop = 0;
    });
    els.steps.forEach(function (s, i) { s.classList.toggle('is-active', i === n); s.classList.toggle('is-done', i < n); });
    els.lines.forEach(function (l, i) { l.classList.toggle('is-done', i < n); });
    els.back.setAttribute('aria-hidden', (n === 1) ? 'false' : 'true');
    root.setAttribute('data-step', String(n));
    root.classList.toggle('is-compact', n >= 1);
    if (n === 1) {
      fillChosen();
      setTimeout(function () { var i = root.querySelector('#wfb-name'); if (i && !i.value) i.focus({ preventScroll: true }); }, 520);
    }
  }

  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  var INI_COLORS = ['#6689ff', '#5668a2', '#7796ff', '#4a5fd1', '#8a7fd8'];
  function face(name, photo, cls) {
    if (photo) return '<img class="' + cls + '" src="' + esc(photo) + '" alt="">';
    if (!name) return '';
    var parts = String(name).replace(/\(.*?\)/g, '').trim().split(/\s+/), ini = '';
    parts.slice(0, 2).forEach(function (w) { if (w) ini += w.charAt(0).toUpperCase(); });
    var h = 0; for (var i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 997;
    return '<span class="wfb-ini ' + cls + '" style="background:' + INI_COLORS[h % INI_COLORS.length] + '">' + esc(ini || '?') + '</span>';
  }
  function avatar(s, cls) { return s ? face(s.specialist_name, s.specialist_photo, cls || 'wfb-ava') : ''; }
  // Twój termin: blado-pomarańczowy do czasu rezerwacji, zielony po rezerwacji
  function setSummary(text, slot, subText) {
    var time = slot ? 'godz. ' + hm(slot.start) + '–' + hm(slot.end) : (subText || '');
    var who = slot && slot.specialist_name ? 'Zadzwoni:' : '', name = slot && slot.specialist_name ? slot.specialist_name : '';
    var photo = slot ? avatar(slot, 'wfb-sum-img') : '';
    if (els.summary.textContent === text && els.sumtime.textContent === time && els.sumname.textContent === name) return;
    els.summary.textContent = text;
    els.sumtime.textContent = time;
    els.sumwho.textContent = who;
    els.sumname.textContent = name;
    els.sumphoto.innerHTML = photo;
    els.sumbox.classList.toggle('has-photo', !!photo);
    els.sumbox.classList.remove('is-swap'); void els.sumbox.offsetWidth; els.sumbox.classList.add('is-swap');
  }
  function markBooked(on) {
    els.sumbox.classList.toggle('is-booked', on);
    els.sumlabel.innerHTML = on ? I.tick + 'Zarezerwowano' : 'Twój termin';
  }
  function cap(t) { return t.charAt(0).toUpperCase() + t.slice(1); }
  function dayLabel(dayStr) { return cap(fmtDay.format(parseLocal(dayStr))); }
  function fillChosen() {
    // okienko z terminem w kroku „Twoje dane” usunięte (Adam 2026-11-14) — termin widać w „Twój termin”
    if (st.slot) setSummary(dayLabel(st.slot.start), st.slot);
  }

  /* ---------- kalendarz ---------- */
  function monthBounds() {
    var now = new Date();
    return { min: firstOfMonth(now), max: firstOfMonth(new Date(now.getTime() + CFG.maxDays * 864e5)) };
  }
  function renderMonth(dir) {
    var b = monthBounds(), m = st.month, today = ymd(new Date());
    els.prev.disabled = m <= b.min;
    els.next.disabled = m >= b.max;
    els.month.textContent = cap(fmtMonth.format(m));
    els.month.className = dir ? (dir > 0 ? 'is-in-next' : 'is-in-prev') : '';
    var lead = (m.getDay() + 6) % 7, days = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate();
    var html = '';
    for (var i = 0; i < lead; i++) html += '<span class="wfb-day is-empty"></span>';
    for (var d = 1; d <= days; d++) {
      var key = m.getFullYear() + '-' + pad(m.getMonth() + 1) + '-' + pad(d);
      var free = st.byDay[key] && st.byDay[key].length;
      var cls = 'wfb-day' + (free ? ' is-free' : '') + (key === today ? ' is-today' : '') + (key === st.day ? ' is-selected' : '');
      html += free
        ? '<button type="button" class="' + cls + '" data-day="' + key + '" aria-label="' + dayLabel(key) + ', ' + free + ' ' + plural(free, 'wolny termin', 'wolne terminy', 'wolnych terminów') + '">' + d + '</button>'
        : '<span class="' + cls + '" aria-hidden="true">' + d + '</span>';
    }
    els.grid.innerHTML = html;
    els.grid.className = 'wfb-grid' + (dir ? (dir > 0 ? ' is-in-next' : ' is-in-prev') : '');
  }
  function shiftMonth(n) {
    var b = monthBounds(), m = addMonths(st.month, n);
    if (m < b.min || m > b.max) return;
    st.month = m;
    renderMonth(n);
  }
  // Godziny zgrupowane: jedna pozycja = jedna godzina, w środku 1..N osób.
  // 1 osoba → zdjęcie + imię, wybór od razu; kilka osób → nałożone zdjęcia + „N osoby”,
  // klik rozwija listę osób (przewijaną — działa i przy 20 osobach), wybór osoby = wybór terminu.
  function groupSlots(list) {
    var out = [], by = {};
    list.forEach(function (s) {
      var g = by[s.start];
      if (!g) { g = by[s.start] = { start: s.start, end: s.end, slots: [] }; out.push(g); }
      g.slots.push(s);
    });
    return out;
  }
  function timeInner(g, chosen) {
    var showWho = st.people.length > 1;
    if (!showWho) return hm(g.start);
    if (chosen || g.slots.length === 1) {
      var s = chosen || g.slots[0];
      return avatar(s) + '<span class="wfb-slot-txt"><b>' + hm(g.start) + '</b><small>' + esc(s.specialist_name || '') + '</small></span>' +
        (g.slots.length > 1 ? '<span class="wfb-slot-chev">' + I.next + '</span>' : '');
    }
    var n = g.slots.length, stack = g.slots.slice(0, 3).map(function (x) { return avatar(x, 'wfb-stack-img'); }).join('');
    return '<span class="wfb-stack">' + stack + (n > 3 ? '<span class="wfb-stack-more">+' + (n - 3) + '</span>' : '') + '</span>' +
      '<span class="wfb-slot-txt"><b>' + hm(g.start) + '</b><small>' + n + ' ' + plural(n, 'osoba', 'osoby', 'osób') + '</small></span>' +
      '<span class="wfb-slot-chev">' + I.next + '</span>';
  }
  function pickDay(key, btn) {
    st.day = key; st.slot = null;
    [].forEach.call(els.grid.querySelectorAll('.is-selected'), function (x) { x.classList.remove('is-selected'); });
    if (btn) btn.classList.add('is-selected');
    st.groups = groupSlots(st.byDay[key] || []);
    var n = st.groups.length;
    els.tday.textContent = dayLabel(key);
    els.tcount.textContent = n + ' ' + plural(n, 'wolna godzina', 'wolne godziny', 'wolnych godzin');
    els.slots.innerHTML = st.groups.map(function (g, gi) {
      var multi = g.slots.length > 1 && st.people.length > 1;
      return '<div class="wfb-slot' + (st.people.length > 1 ? ' has-who' : '') + (multi ? ' is-multi' : '') + '" style="--i:' + gi + '">' +
        '<button type="button" class="wfb-slot-time" data-gi="' + gi + '"' + (multi ? ' aria-expanded="false"' : '') + '>' + timeInner(g) + '</button>' +
        '<button type="button" class="wfb-slot-go" tabindex="-1">Dalej →</button>' +
        (multi ? '<div class="wfb-who"><div class="wfb-who-in">' + g.slots.map(function (x, si) {
          return '<button type="button" class="wfb-who-opt" data-gi="' + gi + '" data-si="' + si + '" style="--j:' + si + '">' + avatar(x, 'wfb-person-img') +
            '<span class="wfb-person-txt"><b>' + esc(x.specialist_name || '') + '</b>' + (x.specialist_role ? '<small>' + esc(x.specialist_role) + '</small>' : '') + '</span></button>';
        }).join('') + '</div></div>' : '') +
      '</div>';
    }).join('');
    els.pick.classList.add('has-day');
    els.hint.style.display = 'none';
    setSummary(dayLabel(key), null, 'Wybierz godzinę');
    if (window.matchMedia('(max-width: 860px)').matches) {
      setTimeout(function () { els.times.scrollIntoView({ behavior: "smooth", block: "start" }); }, 480);
    }
  }
  function rowReset(row, gi) {
    row.classList.remove('is-chosen', 'is-open');
    row.querySelector('.wfb-slot-go').tabIndex = -1;
    var tb = row.querySelector('.wfb-slot-time');
    if (row.classList.contains('is-multi')) { tb.innerHTML = timeInner(st.groups[gi]); tb.setAttribute('aria-expanded', 'false'); }
    [].forEach.call(row.querySelectorAll('.wfb-who-opt.is-on'), function (o) { o.classList.remove('is-on'); });
  }
  function clickTime(gi) {
    var g = st.groups[gi];
    if (!g) return;
    if (g.slots.length === 1 || st.people.length < 2) return chooseSlot(gi, 0);
    var row = els.slots.children[gi], opening = !row.classList.contains('is-open');
    [].forEach.call(els.slots.children, function (r, i) { if (i !== gi) rowReset(r, i); });
    if (opening) {
      var keep = st.slot && st.slot.start === g.start ? st.slot : null;
      row.classList.remove('is-chosen');
      row.classList.add('is-open');
      row.querySelector('.wfb-slot-time').setAttribute('aria-expanded', 'true');
      [].forEach.call(row.querySelectorAll('.wfb-who-opt'), function (o) {
        o.classList.toggle('is-on', !!keep && g.slots[+o.getAttribute('data-si')] === keep);
      });
      if (!keep) { st.slot = null; setSummary(dayLabel(g.start), null, 'godz. ' + hm(g.start) + ' — wybierz osobę'); }
    } else if (st.slot && st.slot.start === g.start) {
      row.classList.remove('is-open'); row.classList.add('is-chosen');
    } else {
      rowReset(row, gi);
    }
  }
  function chooseSlot(gi, si) {
    var g = st.groups[gi], s = g && g.slots[si];
    if (!s) return;
    st.slot = s;
    [].forEach.call(els.slots.children, function (row, i) {
      if (i !== gi) return rowReset(row, i);
      row.classList.remove('is-open');
      row.classList.add('is-chosen');
      row.querySelector('.wfb-slot-go').tabIndex = 0;
      if (row.classList.contains('is-multi')) {
        var tb = row.querySelector('.wfb-slot-time');
        tb.innerHTML = timeInner(g, s); tb.setAttribute('aria-expanded', 'false');
        [].forEach.call(row.querySelectorAll('.wfb-who-opt'), function (o) { o.classList.toggle('is-on', +o.getAttribute('data-si') === si); });
      }
    });
    setSummary(dayLabel(s.start), s);
  }

  function refreshSlots() {
    st.loading = true;
    els.loading.style.display = '';
    return loadSlots().then(function (slots) {
      st.all = slots.sort(function (a, b) { return a.start < b.start ? -1 : (a.start > b.start ? 1 : (a.specialist_name || '') < (b.specialist_name || '') ? -1 : 1); });
      var seen = {};
      st.people = [];
      st.all.forEach(function (s) {
        if (!s.specialist_id || seen[s.specialist_id]) return;
        seen[s.specialist_id] = 1;
        st.people.push({ id: s.specialist_id, name: s.specialist_name, role: s.specialist_role, photo: s.specialist_photo });
      });
      if (st.person && !seen[st.person]) st.person = null;
      renderPeople();
      indexSlots();
      st.loaded = true;
      // pierwszy miesiąc z wolnym terminem
      var first = Object.keys(st.byDay).sort()[0];
      if (first && !st.day) st.month = firstOfMonth(parseLocal(first));
      renderMonth(0);
    }).catch(function () {
      els.hint.style.display = '';
      els.hint.querySelector('span').innerHTML = 'Nie udało się pobrać terminów. Zadzwoń do nas: <a href="tel:' + CFG.phoneHref + '">' + CFG.phone + '</a>.';
    }).then(function () { st.loading = false; els.loading.style.display = 'none'; });
  }

  /* ---------- z kim rozmowa ---------- */
  function indexSlots() {
    st.byDay = {};
    st.all.forEach(function (s) {
      if (st.person && s.specialist_id !== st.person) return;
      var k = s.start.slice(0, 10);
      (st.byDay[k] = st.byDay[k] || []).push(s);
    });
  }
  function personRow(p) {
    return (p ? face(p.name, p.photo, 'wfb-person-img') : '<span class="wfb-person-any">' + I.person + '</span>') +
      '<span class="wfb-person-txt"><b>' + (p ? esc(p.name) : 'Wszyscy konsultanci') + '</b><small>' +
      (p ? esc(p.role || '') : 'wszystkie wolne terminy') + '</small></span>';
  }
  function renderPeople() {
    if (st.people.length < 2) { els.people.hidden = true; return; }
    els.people.hidden = false;
    var cur = null;
    st.people.forEach(function (p) { if (p.id === st.person) cur = p; });
    els.people.innerHTML = '<div class="wfb-people-label">Dostępni konsultanci</div>' +
      '<div class="wfb-dd">' +
        '<button type="button" class="wfb-dd-btn" data-dd aria-haspopup="listbox" aria-expanded="false">' +
          '<span class="wfb-dd-cur">' + personRow(cur) + '</span><span class="wfb-dd-chev">' + I.next + '</span></button>' +
        '<div class="wfb-dd-list" role="listbox">' +
          (st.people.length > 6 ? '<input class="wfb-dd-q" data-ddq placeholder="Szukaj osoby…" autocomplete="off">' : '') +
          '<div class="wfb-dd-opts">' +
            '<button type="button" class="wfb-dd-opt' + (st.person ? '' : ' is-on') + '" data-person="" role="option">' + personRow(null) + '</button>' +
            st.people.map(function (p) {
              return '<button type="button" class="wfb-dd-opt' + (st.person === p.id ? ' is-on' : '') + '" data-person="' + esc(p.id) +
                '" data-name="' + esc((p.name || '').toLowerCase()) + '" role="option">' + personRow(p) + '</button>';
            }).join('') +
          '</div>' +
        '</div>' +
      '</div>';
  }
  function toggleDd(force) {
    var dd = els.people && els.people.querySelector('.wfb-dd');
    if (!dd) return;
    var on = force === undefined ? !dd.classList.contains('is-open') : force;
    if (on === dd.classList.contains('is-open')) return;
    dd.classList.toggle('is-open', on);
    dd.querySelector('[data-dd]').setAttribute('aria-expanded', on ? 'true' : 'false');
    var qi = dd.querySelector('[data-ddq]');
    if (on && qi) setTimeout(function () { qi.focus({ preventScroll: true }); }, 120);
  }
  function pickPerson(id) {
    if (st.person === id) return;
    st.person = id;
    var cur = null;
    st.people.forEach(function (p) { if (p.id === id) cur = p; });
    [].forEach.call(els.people.querySelectorAll('[data-person]'), function (b) {
      b.classList.toggle('is-on', (b.getAttribute('data-person') || null) === id);
    });
    var curEl = els.people.querySelector('.wfb-dd-cur');
    curEl.innerHTML = personRow(cur);
    curEl.classList.remove('is-swap'); void curEl.offsetWidth; curEl.classList.add('is-swap');
    indexSlots();
    // bieżący miesiąc bez terminów tej osoby → pierwszy miesiąc, w którym je ma
    var keys = Object.keys(st.byDay).sort(), mk = st.month.getFullYear() + '-' + pad(st.month.getMonth() + 1);
    if (keys.length && !keys.some(function (k) { return k.slice(0, 7) === mk; })) st.month = firstOfMonth(parseLocal(keys[0]));
    var keepDay = st.day && st.byDay[st.day] ? st.day : null;
    if (st.day && !keepDay) {
      // wybrany dzień nie ma terminów tej osoby → zwijamy godziny
      st.day = null; st.slot = null;
      els.pick.classList.remove('has-day'); els.hint.style.display = '';
      setTimeout(function () { if (!st.day) els.slots.innerHTML = ''; }, 600);
      setSummary('Wybierz dzień w kalendarzu');
    }
    renderMonth(0);
    els.grid.classList.add('is-fade');
    if (keepDay) pickDay(keepDay, els.grid.querySelector('[data-day="' + keepDay + '"]'));
  }

  /* ---------- formularz ---------- */
  function fieldErr(name, bad) {
    var el = els.form.elements[name], wrap = el.closest('.wfb-field, .wfb-consent');
    wrap.classList.toggle('has-error', bad);
    if (bad) { wrap.classList.remove('is-shake'); void wrap.offsetWidth; wrap.classList.add('is-shake'); }
    return bad;
  }
  function submit(e) {
    e.preventDefault();
    var f = els.form.elements;
    var name = f.name.value.trim(), phone = f.phone.value.replace(/[^\d+]/g, ''), email = f.email.value.trim();
    var digits = phone.replace(/\D/g, '');
    var bad = [
      fieldErr('name', name.length < 2),
      fieldErr('phone', digits.length < 9 || digits.length > 13),
      fieldErr('email', !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)),
      fieldErr('consent', !f.consent.checked)
    ].some(Boolean);
    var old = els.form.querySelector('.wfb-alert'); if (old) old.remove();
    if (bad) { var firstBad = els.form.querySelector('.has-error input, .has-error textarea'); if (firstBad) firstBad.focus(); return; }
    els.submit.classList.add('is-busy');
    sendBooking({
      start: st.slot.start, specialist_id: st.slot.specialist_id,
      name: name, phone: phone, email: email, note: f.note.value.trim(),
      consent: true, website: f.website.value
    }).then(function (res) {
      els.submit.classList.remove('is-busy');
      if (res && res.ok) {
        st.email = email;
        els.dwhen.textContent = dayLabel(st.slot.start) + ', godz. ' + hm(st.slot.start);
        els.demail.textContent = email;
        els.dphone.textContent = f.phone.value.trim();
        els.dwho.textContent = st.slot.specialist_name ? ' (zadzwoni ' + st.slot.specialist_name + ')' : '';
        markBooked(true);
        go(2);
        return;
      }
      if (res && (res.status === 409 || res.error === 'taken')) {
        alertBox('Ten termin przed chwilą ktoś zarezerwował. Wybierz proszę inną godzinę.');
        setTimeout(function () { st.slot = null; st.day = null; els.pick.classList.remove('has-day'); refreshSlots(); go(0); }, 1600);
        return;
      }
      alertBox((res && res.error) || 'Nie udało się zapisać rezerwacji. Spróbuj ponownie albo zadzwoń: ' + CFG.phone + '.');
    }).catch(function () {
      els.submit.classList.remove('is-busy');
      alertBox('Brak połączenia. Spróbuj ponownie albo zadzwoń: ' + CFG.phone + '.');
    });
  }
  function alertBox(msg) {
    var a = h('div', 'wfb-alert'); a.textContent = msg;
    els.form.insertBefore(a, els.form.querySelector('.wfb-actions'));
  }

  /* ---------- plik kalendarza (.ics) ---------- */
  function downloadIcs() {
    var s = st.slot; if (!s) return;
    function c(x) { return x.replace(/[-:]/g, '').slice(0, 15); }
    var ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//World Foundation//Rezerwacja//PL', 'BEGIN:VEVENT',
      'UID:' + Date.now() + '@worldfoundation.eu',
      'DTSTAMP:' + new Date().toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z',
      'DTSTART;TZID=Europe/Warsaw:' + c(s.start), 'DTEND;TZID=Europe/Warsaw:' + c(s.end),
      'SUMMARY:Rozmowa z psychologiem — World Foundation',
      'DESCRIPTION:Bezpłatna rozmowa wstępna (do 30 min). Zadzwonimy na Twój numer. Zmiana planów: ' + CFG.phone,
      'BEGIN:VALARM', 'TRIGGER:-PT15M', 'ACTION:DISPLAY', 'DESCRIPTION:Rozmowa z World Foundation', 'END:VALARM',
      'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
    a.download = 'rozmowa-world-foundation.ics';
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }

  /* ---------- otwieranie / zamykanie ---------- */
  function resetAll() {
    st.day = null; st.slot = null;
    els.form.reset(); els.counter.textContent = '0/500';
    [].forEach.call(els.form.querySelectorAll('.has-error'), function (x) { x.classList.remove('has-error'); });
    var a = els.form.querySelector('.wfb-alert'); if (a) a.remove();
    els.pick.classList.remove('has-day'); els.hint.style.display = '';
    els.hint.querySelector('span').textContent = 'Kliknij wyróżniony dzień, a pojawią się wolne godziny.';
    setSummary('Wybierz dzień w kalendarzu');
    markBooked(false);
  }
  function open(opts) {
    opts = opts || {};
    if (!root) build();
    if (!root.hidden && root.classList.contains('is-open')) return;
    st.lastFocus = document.activeElement;
    if (st.step === 2) resetAll();
    root.hidden = false;
    root.classList.remove('is-closing');
    document.body.classList.add('wfb-lock');
    go(0);
    if (opts.day) { st.month = firstOfMonth(parseLocal(opts.day)); st.day = null; }
    if (!st.loaded) renderMonth(0);
    refreshSlots().then(function () {
      if (!opts.day || !st.byDay[opts.day]) return;
      st.month = firstOfMonth(parseLocal(opts.day)); renderMonth(0);
      setTimeout(function () { pickDay(opts.day, els.grid.querySelector('[data-day="' + opts.day + '"]')); }, 380);
    });
    void root.offsetWidth;
    root.classList.add('is-open');
    setTimeout(function () { var c = root.querySelector('.wfb-close'); if (c) c.focus({ preventScroll: true }); }, 60);
  }
  function close() {
    if (!root || root.hidden) return;
    root.classList.add('is-closing');
    root.classList.remove('is-open');
    setTimeout(function () {
      root.hidden = true;
      root.classList.remove('is-closing');
      document.body.classList.remove('wfb-lock');
      if (st.lastFocus && st.lastFocus.focus) st.lastFocus.focus({ preventScroll: true });
    }, 340);
  }

  // Przechwycenie starych przycisków „Umów spotkanie” (#modalSpotkanie) i data-wf-booking.
  window.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('a[href="#modalSpotkanie"], [data-wf-booking]');
    if (!t) return;
    e.preventDefault();
    e.stopPropagation();
    open({ day: t.getAttribute('data-day') || null });
  }, true);

  /* ---------- kalendarzyk w sekcji strony (data-wfb-mini) ---------- */
  function initMini(box) {
    var ms = { month: firstOfMonth(new Date()), byDay: {}, first: true };
    box.classList.add('wfb-mini');
    box.innerHTML =
      '<div class="wfb-mini-label">Bezpłatna rozmowa</div>' +
      '<a class="button button-secondary button-pipaluk coop-btn-animated wfb-mini-btn" href="#rezerwacja" data-wf-booking>Umów rozmowę</a>' +
      '<div class="wfb-mini-head"><div class="wfb-mini-month"><span></span></div>' +
        '<div class="wfb-mini-nav"><button type="button" data-mprev aria-label="Poprzedni miesiąc">' + I.back + '</button><button type="button" data-mnext aria-label="Następny miesiąc">' + I.next + '</button></div></div>' +
      '<div class="wfb-mini-week">' + DOW.map(function (d) { return '<span>' + d + '</span>'; }).join('') + '</div>' +
      '<div class="wfb-mini-grid-wrap"><div class="wfb-mini-grid"></div></div>' +
      '<div class="wfb-mini-next">Sprawdzam wolne terminy…</div>' +
      '<div class="wfb-mini-title">Wybierz dzień — zadzwonimy do Ciebie</div>';
    var mEl = box.querySelector('.wfb-mini-month span'), grid = box.querySelector('.wfb-mini-grid'),
        prev = box.querySelector('[data-mprev]'), next = box.querySelector('[data-mnext]'), nextEl = box.querySelector('.wfb-mini-next');
    function draw(dir) {
      var b = monthBounds(), m = ms.month, today = ymd(new Date());
      prev.disabled = m <= b.min; next.disabled = m >= b.max;
      mEl.textContent = cap(fmtMonth.format(m));
      mEl.className = dir ? (dir > 0 ? 'is-in-next' : 'is-in-prev') : '';
      var lead = (m.getDay() + 6) % 7, days = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate(), html = '', n = 0;
      for (var i = 0; i < lead; i++) html += '<span class="wfb-mini-day is-empty" style="--d:' + (n++) + '"></span>';
      for (var d = 1; d <= days; d++) {
        var key = m.getFullYear() + '-' + pad(m.getMonth() + 1) + '-' + pad(d);
        var free = ms.byDay[key] && ms.byDay[key].length;
        var cls = 'wfb-mini-day' + (free ? ' is-free' : '') + (key === today ? ' is-today' : '');
        html += free
          ? '<button type="button" class="' + cls + '" style="--d:' + (n++) + '" data-wf-booking data-day="' + key + '" aria-label="' + dayLabel(key) + ' — umów rozmowę">' + d + '</button>'
          : '<span class="' + cls + '" style="--d:' + (n++) + '">' + d + '</span>';
      }
      var tail = (7 - (lead + days) % 7) % 7;
      for (var t = 0; t < tail; t++) html += '<span class="wfb-mini-day is-empty" style="--d:' + (n++) + '"></span>';
      grid.innerHTML = html;
      grid.className = 'wfb-mini-grid' + (ms.first ? ' is-first' : '') + (dir ? (dir > 0 ? ' is-in-next' : ' is-in-prev') : '');
    }
    prev.addEventListener('click', function () { var m = addMonths(ms.month, -1); if (m >= monthBounds().min) { ms.first = false; ms.month = m; draw(-1); } });
    next.addEventListener('click', function () { var m = addMonths(ms.month, 1); if (m <= monthBounds().max) { ms.first = false; ms.month = m; draw(1); } });
    draw(0);
    function load() {
      loadSlots().then(function (slots) {
        ms.byDay = {};
        slots.sort(function (a, b) { return a.start < b.start ? -1 : 1; }).forEach(function (s) {
          var k = s.start.slice(0, 10); (ms.byDay[k] = ms.byDay[k] || []).push(s);
        });
        var firstDay = Object.keys(ms.byDay).sort()[0];
        if (firstDay) {
          ms.month = firstOfMonth(parseLocal(firstDay));
          var s0 = ms.byDay[firstDay][0];
          nextEl.innerHTML = 'Najbliższy wolny termin:<b>' + dayLabel(firstDay) + ', godz. ' + hm(s0.start) + '</b>';
        } else {
          nextEl.innerHTML = 'Brak wolnych terminów w najbliższych tygodniach. Zadzwoń do nas: <b><a href="tel:' + CFG.phoneHref + '" style="color:inherit">' + CFG.phone + '</a></b>';
        }
        draw(0);
      }).catch(function () {
        nextEl.innerHTML = 'Nie udało się pobrać terminów. Zadzwoń do nas: <b>' + CFG.phone + '</b>';
      });
    }
    // dane i animacja dopiero, gdy kalendarzyk pojawi się na ekranie
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (en) {
        if (!en[0].isIntersecting) return;
        io.disconnect(); box.classList.add('is-visible'); load();
      }, { threshold: 0.25 });
      io.observe(box);
    } else { box.classList.add('is-visible'); load(); }
  }
  function initMinis() { [].forEach.call(document.querySelectorAll('[data-wfb-mini]'), initMini); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initMinis); else initMinis();

  /* ---------- film w sekcji: bez pasków odtwarzacza, tylko okrągły odtwórz/pauza ---------- */
  function initVideo(w) {
    var v = w.querySelector('video'), b = w.querySelector('.wf-vid-btn'), t;
    if (!v || !b) return;
    v.controls = false;
    function sync() {
      var playing = !v.paused && !v.ended;
      w.classList.toggle('is-playing', playing);
      b.setAttribute('aria-label', playing ? 'Zatrzymaj film' : 'Odtwórz film');
    }
    function flash() { w.classList.add('show-btn'); clearTimeout(t); t = setTimeout(function () { w.classList.remove('show-btn'); }, 900); }
    w.addEventListener('click', function () {
      if (v.paused || v.ended) { v.muted = false; v.volume = 1; var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); } else v.pause();
      flash();
    });
    ['play', 'playing', 'pause', 'ended'].forEach(function (ev) { v.addEventListener(ev, sync); });
    // po końcu filmu wracamy do pierwszej klatki (zamiast czarnej klatki na końcu)
    v.addEventListener('ended', function () { try { v.currentTime = 0.1; } catch (e) {} sync(); });
    sync();
  }
  function initVideos() { [].forEach.call(document.querySelectorAll('[data-wf-video]'), initVideo); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initVideos); else initVideos();

  window.WFBooking = { open: open, close: close };
  if (/[#&]rezerwacja\b/.test(location.hash)) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', open); else open();
  }
})();
