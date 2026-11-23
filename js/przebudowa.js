/* TRYB „STRONA W PRZEBUDOWIE” (zlecenie 6A, 2026-11-20; plan zaakceptowany przez Adama).
 *
 * ▶ WYŁĄCZENIE PO 26.11: zmień w linii niżej  true  →  false  (jedna linia, działa na wszystkich stronach).
 */
var WF_PRZEBUDOWA = true;
/*
 * Jak działa:
 *  • Plik ładowany w <head> (bez async/defer) na: pl/index.html, program-rodzic-nie-jestes-sam.html, projekt-spot.html, dolacz.html.
 *    Dodaje klasę `wf-rebuild` na <html> — całe ukrywanie robi css/przebudowa.css (nic nie jest usuwane z HTML).
 *  • Na stronie głównej widoczne zostają: nagłówek z sliderem, rezerwacja rozmów (#services), baner psychologów (#join), stopka.
 *    W menu zostają: Home, Konsultacje, Program dla rodziców, Zarząd, Dołącz, Kontakt (Zarząd od 20.11, prośba Adama). „Kontakt” (i inne linki do ukrytego #contact-info/#contacts)
 *    przewija do stopki z danymi kontaktowymi.
 *  • Pod menu pasek „Strona w przebudowie — pełna wersja będzie dostępna od czwartku 26 listopada.”
 *  • Podgląd pełnej wersji: dodaj ?pelna=1 do adresu (zapamiętane w sessionStorage na czas karty — kotwice i podstrony
 *    też pokazują pełną wersję). ?pelna=0 wraca do trybu przebudowy.
 */
(function () {
  'use strict';
  var KEY = 'wf-pelna';
  var full = false;
  try {
    var p = new URLSearchParams(window.location.search).get('pelna');
    if (p === '1') sessionStorage.setItem(KEY, '1');
    else if (p === '0') sessionStorage.removeItem(KEY);
    full = sessionStorage.getItem(KEY) === '1';
  } catch (e) { /* brak sessionStorage — zostaje tryb przebudowy */ }

  if (!WF_PRZEBUDOWA || full) return;
  var root = document.documentElement;
  root.classList.add('wf-rebuild');

  // sekcje strony głównej ukryte w trybie przebudowy (linki do nich znikają z menu i stopki)
  var HIDDEN = ['about', 'experience', 'projects', 'world-market', 'pricing', 'news'];
  var CONTACT = ['contact-info', 'contacts'];

  function anchorOf(a) {
    var href = a.getAttribute('href') || '';
    var i = href.indexOf('#');
    if (i < 0) return null;
    var path = href.slice(0, i);
    if (path && !/(^|\/)index\.html$/.test(path)) return null; // tylko kotwice strony głównej
    return href.slice(i + 1);
  }

  // menu (pozycja <li>) i „Szybkie linki” w stopce (same <a>) prowadzące do ukrytych sekcji — chowamy
  function tidyLinks(scope) {
    var links = (scope || document).querySelectorAll('.rd-navbar-nav a[href*="#"], .wf-footer a[href*="#"]');
    for (var i = 0; i < links.length; i++) {
      var a = links[i];
      var id = anchorOf(a);
      if (!id || HIDDEN.indexOf(id) < 0) continue;
      (a.closest('.rd-navbar-nav') ? a.closest('li') || a : a).classList.add('wfr-hidden');
    }
  }

  function footer() {
    return document.querySelector('.wf-footer') || document.getElementById('footer-placeholder');
  }

  // klik w link do ukrytego kontaktu → stopka; przyciski z data-wfr-href → podstrona zamiast ukrytej sekcji
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a');
    if (!a) return;
    var alt = a.getAttribute('data-wfr-href');
    if (alt) {
      e.preventDefault();
      e.stopImmediatePropagation();
      window.location.href = alt;
      return;
    }
    var id = anchorOf(a);
    if (id && CONTACT.indexOf(id) >= 0) {
      var f = footer();
      if (!f) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      var y = f.getBoundingClientRect().top + window.pageYOffset - 70;
      window.scrollTo({ top: y, behavior: 'smooth' });
      // menu na telefonie: zamknij rozwiniętą listę
      var toggle = document.querySelector('.rd-navbar-toggle.active');
      if (toggle) toggle.click();
    }
  }, true);

  function addBar() {
    if (document.querySelector('.wfr-bar')) return;
    var bar = document.createElement('div');
    bar.className = 'wfr-bar';
    bar.setAttribute('role', 'status');
    bar.innerHTML = '<span class="wfr-bar__dot" aria-hidden="true"></span>' +
      '<span><strong>Strona w przebudowie</strong> — pełna wersja będzie dostępna od czwartku 26&nbsp;listopada.</span>';
    // wewnątrz nagłówka, zaraz pod menu (na stronie głównej nagłówek leży nad sliderem — pasek też)
    var header = document.querySelector('header.page-header');
    if (header) header.appendChild(bar);
    else document.body.insertBefore(bar, document.body.firstChild);
    place();
  }

  // Na telefonie/tablecie menu motywu jest przyklejone do góry (position: fixed) i nie zajmuje miejsca w układzie —
  // wtedy odsuwamy pasek o wysokość menu, żeby był widoczny pod nim, a nie pod spodem.
  function place() {
    var bar = document.querySelector('.wfr-bar');
    if (!bar) return;
    bar.style.marginTop = '0px';
    shiftContent(bar, false);
    // w układzie „fixed” motyw przykleja do góry sam pasek z logo i hamburgerem (.rd-navbar-panel)
    var fixedEl = null;
    var cands = document.querySelectorAll('.rd-navbar, .rd-navbar-panel');
    for (var i = 0; i < cands.length; i++) if (getComputedStyle(cands[i]).position === 'fixed') { fixedEl = cands[i]; break; }
    if (!fixedEl) return;
    shiftContent(bar, true);
    var navH = fixedEl.getBoundingClientRect().height;
    var barTop = bar.getBoundingClientRect().top + window.pageYOffset;
    if (barTop < navH) bar.style.marginTop = Math.ceil(navH - barTop) + 'px';
  }

  // Nagłówek motywu leży nad treścią (position: absolute). Na komputerze menu jest przezroczyste, a pierwsze sekcje
  // mają duży odstęp u góry — pasek może na nich leżeć. Na telefonie/tablecie (menu przyklejone, białe) przesuwamy
  // pierwszą sekcję podstrony o wysokość paska, żeby nie zasłaniał tytułu. Slider strony głównej zostaje bez zmian.
  function shiftContent(bar, on) {
    var header = document.querySelector('header.page-header');
    if (!header || getComputedStyle(header).position !== 'absolute') return;
    var next = header.nextElementSibling;
    while (next && /^(SCRIPT|STYLE)$/.test(next.tagName)) next = next.nextElementSibling;
    if (!next || next.classList.contains('swiper-container')) return;
    next.style.marginTop = on ? bar.offsetHeight + 'px' : '';
  }

  function init() {
    addBar();
    // motyw przełącza menu w tryb „fixed” dopiero po swoim starcie — przeliczamy po załadowaniu i przy zmianie rozmiaru
    window.addEventListener('load', place);
    window.addEventListener('resize', place);
    setTimeout(place, 600);
    tidyLinks(document);
    // stopka jest doładowywana (footer.html) — porządkujemy jej linki po wstawieniu
    var ph = document.getElementById('footer-placeholder');
    if (ph && window.MutationObserver) {
      new MutationObserver(function () { tidyLinks(ph); }).observe(ph, { childList: true, subtree: true });
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
