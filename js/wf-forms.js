/* Formularze strony fundacji → aplikacja Zanders (STRONA-WF-ROZBUDOWA-PLAN.md, etap 8).
   Wspólny skrypt dla wszystkich formularzy zgłoszeniowych. Formularz podpina się atrybutem:
     <form data-wf-form="rodzic" novalidate> … </form>
   Pola (atrybut name): name, email, phone, message, consent (checkbox), website (pułapka, ukryte),
   oraz pola dodatkowe z prefiksem „extra_” (np. extra_pomoc) → body.extra.pomoc.
   Komunikat wyniku: element [data-wf-status] wewnątrz formularza.
   Adres API: window.WF_FORMS = { api: "https://meble-crm.vercel.app/api/public/wf-form" }.
   Kontrakt: POST {api}  body {form, name, email, phone, message, consent:true, extra:{}, website}
             → {ok:boolean, message:string}  (CORS tylko worldfoundation.eu + podgląd localhost:8766). */
(function () {
  'use strict';
  var CFG = window.WF_FORMS || {};
  var FALLBACK_ERR = 'Nie udało się wysłać wiadomości. Spróbuj ponownie za chwilę albo zadzwoń: +48 500 461 563.';
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function status(form, kind, text) {
    var el = form.querySelector('[data-wf-status]');
    if (!el) return;
    el.className = 'wff-status' + (kind ? ' is-' + kind : '');
    el.textContent = text || '';
    el.hidden = !text;
  }

  function mark(el, bad) {
    if (!el) return;
    var wrap = el.closest('.wff-consent') || el;
    wrap.classList.toggle('wff-error', !!bad);
    if (el.setAttribute) el.setAttribute('aria-invalid', bad ? 'true' : 'false');
  }

  function validate(form) {
    var f = form.elements, firstBad = null, ok = true;
    function check(name, bad) {
      var el = f[name];
      if (!el) return;
      mark(el, bad);
      if (bad) { ok = false; if (!firstBad) firstBad = el; }
    }
    Array.prototype.forEach.call(form.querySelectorAll('[required]'), function (el) {
      if (el.type === 'checkbox') return;
      check(el.name, !String(el.value || '').trim());
    });
    if (f.email && f.email.value.trim()) check('email', !EMAIL_RE.test(f.email.value.trim()));
    if (f.phone && f.phone.value.trim()) check('phone', f.phone.value.replace(/\D/g, '').length < 7);
    if (f.consent) check('consent', !f.consent.checked);
    if (firstBad && firstBad.focus) firstBad.focus();
    return ok;
  }

  function payload(form) {
    var f = form.elements, extra = {};
    Array.prototype.forEach.call(f, function (el) {
      if (el.name && el.name.indexOf('extra_') === 0) {
        var v = el.tagName === 'SELECT' && el.selectedIndex >= 0 && el.value
          ? el.options[el.selectedIndex].text : el.value;
        extra[el.name.slice(6)] = String(v || '').trim();
      }
    });
    function val(n) { return f[n] ? String(f[n].value || '').trim() : ''; }
    return {
      form: form.getAttribute('data-wf-form'),
      name: val('name'), email: val('email'), phone: val('phone'), message: val('message'),
      consent: !!(f.consent && f.consent.checked), extra: extra, website: val('website')
    };
  }

  function bind(form) {
    form.setAttribute('novalidate', '');
    form.addEventListener('input', function (e) { if (e.target.name) mark(e.target, false); });
    form.addEventListener('change', function (e) { if (e.target.name) mark(e.target, false); });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form.classList.contains('is-sending')) return;
      if (!validate(form)) { status(form, 'error', 'Uzupełnij zaznaczone pola i zaznacz zgodę na przetwarzanie danych.'); return; }
      if (!CFG.api) { status(form, 'error', FALLBACK_ERR); return; }
      var btn = form.querySelector('[type=submit]');
      form.classList.add('is-sending');
      if (btn) { btn.disabled = true; btn.setAttribute('data-label', btn.textContent); btn.textContent = 'Wysyłanie…'; }
      status(form, '', '');
      fetch(CFG.api, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload(form))
      })
        .then(function (r) { return r.json().catch(function () { return { ok: false }; }); })
        .then(function (res) {
          if (res && res.ok) {
            form.reset();
            form.classList.add('is-sent');
            status(form, 'ok', res.message || 'Dziękujemy! Wiadomość dotarła do fundacji.');
          } else status(form, 'error', (res && res.message) || FALLBACK_ERR);
        })
        .catch(function () { status(form, 'error', FALLBACK_ERR); })
        .then(function () {
          form.classList.remove('is-sending');
          if (btn) { btn.disabled = false; btn.textContent = btn.getAttribute('data-label') || 'Wyślij'; }
        });
    });
  }

  function init() { Array.prototype.forEach.call(document.querySelectorAll('form[data-wf-form]'), bind); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
