/* „Poznaj siebie” — ankiety samooceny (pl/poznaj-siebie.html), wersja 1, 2026-11-23.
 * Plan: 1. AGENT/Claude Code/ANKIETA-SAMOOCENY-PLAN.md
 *
 * Zasada: jedno pytanie na ekranie, duże przyciski, przejście dalej automatycznie.
 * Liczenie w przeglądarce, wg kluczy autorów narzędzi. Odpowiedzi NIE są nigdzie wysyłane —
 * zostają w localStorage (klucz `wf-ankieta-v1`), żeby nie zgubić postępu i wyników.
 *
 * Narzędzia:
 *  • IPIP-BFM-20 — Topolewska, Skimina, Strus, Cieciuch, Rowiński (2014), Roczniki Psychologiczne 17(2);
 *    pula IPIP = domena publiczna. Normy porównawcze: IPIP-BFM-50, N = 7074 (Strus, Cieciuch, Rowiński 2014, tab. 8).
 *  • Skala Samooceny — Rosenberg (1965), domena publiczna (Univ. of Maryland); tłumaczenie własne fundacji.
 *  • Skala Uogólnionej Własnej Skuteczności (GSES) — Schwarzer, Jerusalem (1995); tłumaczenie własne fundacji.
 *  • Skala Rozkwitu (Flourishing Scale) — Diener i in. (2010); użycie bez zgody, z podaniem autorów; tłumaczenie własne.
 *  • Skala Satysfakcji z Życia (SWLS) — Diener, Emmons, Larsen, Griffin (1985); tłumaczenie własne.
 * Tekst {a|b} = forma męska | żeńska (wybór na początku).
 */
(function () {
  'use strict';

  var STORE = 'wf-ankieta-v1';
  var COLORS_N = 4; // 3 = bez żółtego (decyzja Adama w toku)

  // ---------- skale odpowiedzi ----------
  var SC5 = ['Zupełnie do mnie nie pasuje', 'Raczej nie pasuje', 'Trudno powiedzieć', 'Raczej pasuje', 'Bardzo do mnie pasuje'];
  var SC4A = ['Zdecydowanie się nie zgadzam', 'Raczej się nie zgadzam', 'Raczej się zgadzam', 'Zdecydowanie się zgadzam'];
  var SC4B = ['Nie', 'Raczej nie', 'Raczej tak', 'Tak'];
  var SC7 = ['Zdecydowanie się nie zgadzam', 'Nie zgadzam się', 'Raczej się nie zgadzam', 'Ani tak, ani nie', 'Raczej się zgadzam', 'Zgadzam się', 'Zdecydowanie się zgadzam'];

  // ---------- pytania ----------
  // k: klucz skali, r: pytanie odwrócone
  var BFM = [
    ['Jestem duszą towarzystwa.', 'E', 0],
    ['Niezbyt obchodzą mnie inni ludzie.', 'A', 1],
    ['Mam bogate słownictwo.', 'I', 0],
    ['Zostawiam moje rzeczy, gdzie popadnie.', 'C', 1],
    ['Zwykle jestem {zrelaksowany|zrelaksowana}.', 'S', 0],
    ['Mam trudności ze zrozumieniem abstrakcyjnych pojęć.', 'I', 1],
    ['Często martwię się czymś.', 'S', 1],
    ['Trzymam się z boku.', 'E', 1],
    ['Jestem {wyrozumiały|wyrozumiała} dla uczuć innych ludzi.', 'A', 0],
    ['Rzadko czuję się {przygnębiony|przygnębiona}.', 'S', 0],
    ['Nie interesują mnie problemy innych ludzi.', 'A', 1],
    ['Bez zwłoki wypełniam codzienne obowiązki.', 'C', 0],
    ['Często zapominam odkładać rzeczy na miejsce.', 'C', 1],
    ['Nie mam zbyt bogatej wyobraźni.', 'I', 1],
    ['Rozmawiam z wieloma różnymi ludźmi na przyjęciach.', 'E', 0],
    ['Znajduję czas dla innych.', 'A', 0],
    ['Często miewam huśtawki nastrojów.', 'S', 1],
    ['Postępuję zgodnie z harmonogramem.', 'C', 0],
    ['Wśród nieznajomych jestem {małomówny|małomówna}.', 'E', 1],
    ['Mam głowę pełną pomysłów.', 'I', 0]
  ].map(function (q) { return { t: q[0], k: q[1], r: q[2], s: SC5 }; });

  var RSES = [
    ['Ogólnie rzecz biorąc, jestem z siebie {zadowolony|zadowolona}.', 0],
    ['Czasami myślę, że jestem do niczego.', 1],
    ['Uważam, że mam wiele dobrych cech.', 0],
    ['Potrafię robić różne rzeczy tak dobrze, jak większość ludzi.', 0],
    ['Czuję, że nie mam wielu powodów do dumy.', 1],
    ['Czasami czuję się naprawdę {bezużyteczny|bezużyteczna}.', 1],
    ['Czuję, że jestem wartościowym człowiekiem — co najmniej tak samo jak inni.', 0],
    ['{Chciałbym|Chciałabym} mieć więcej szacunku dla {samego|samej} siebie.', 1],
    ['Patrząc na wszystko razem, mam poczucie, że w życiu mi się nie powiodło.', 1],
    ['Mam pozytywny stosunek do siebie.', 0]
  ].map(function (q) { return { t: q[0], k: 'R', r: q[1], s: SC4A }; });

  var GSES = [
    'Zawsze potrafię rozwiązać trudny problem, jeśli tylko się postaram.',
    'Gdy ktoś mi się sprzeciwia, potrafię znaleźć sposób, żeby osiągnąć to, czego chcę.',
    'Łatwo mi trzymać się swoich celów i je osiągać.',
    '{Jestem pewny|Jestem pewna}, że {poradziłbym|poradziłabym} sobie z niespodziewanymi zdarzeniami.',
    'Dzięki swojej zaradności wiem, jak radzić sobie w nieprzewidzianych sytuacjach.',
    'Potrafię rozwiązać większość problemów, jeśli włożę w to odpowiedni wysiłek.',
    'Zachowuję spokój w trudnościach, bo mogę polegać na swoich umiejętnościach radzenia sobie.',
    'Kiedy staję przed problemem, zwykle znajduję kilka rozwiązań.',
    'Gdy mam kłopoty, zwykle wiem, co zrobić.',
    'Zazwyczaj radzę sobie z tym, co mnie spotyka.'
  ].map(function (t) { return { t: t, k: 'G', r: 0, s: SC4B }; });

  var FS = [
    'Moje życie ma cel i sens.',
    'Moje relacje z ludźmi są wspierające i dają mi satysfakcję.',
    'Jestem {zaangażowany|zaangażowana} i {zainteresowany|zainteresowana} tym, co robię na co dzień.',
    'Aktywnie przyczyniam się do szczęścia i dobra innych ludzi.',
    'Jestem {kompetentny|kompetentna} i {zdolny|zdolna} w sprawach, które są dla mnie ważne.',
    'Jestem dobrym człowiekiem i prowadzę dobre życie.',
    'Patrzę na swoją przyszłość z optymizmem.',
    'Ludzie mnie szanują.'
  ].map(function (t) { return { t: t, k: 'F', r: 0, s: SC7 }; });

  var SWLS = [
    'Pod wieloma względami moje życie jest bliskie ideału.',
    'Warunki mojego życia są doskonałe.',
    'Jestem {zadowolony|zadowolona} ze swojego życia.',
    'Jak dotąd mam w życiu to, co dla mnie ważne.',
    '{Gdybym mógł|Gdybym mogła} przeżyć swoje życie jeszcze raz, prawie niczego bym nie {zmienił|zmieniła}.'
  ].map(function (t) { return { t: t, k: 'W', r: 0, s: SC7 }; });

  var MODULES = [
    { id: 'charakter', name: 'Mój charakter', icon: '🧭', mins: 4,
      lead: 'Pięć podstawowych cech osobowości i Twój kolor.',
      intro: 'Przeczytaj zdanie i zaznacz, na ile do Ciebie pasuje. Nie ma dobrych ani złych odpowiedzi — myśl o tym, jaki jesteś zwykle, a nie jaki chciałbyś być.',
      qs: BFM },
    { id: 'samoocena', name: 'Moja samoocena', icon: '💪', mins: 4,
      lead: 'Jak oceniasz siebie i na ile wierzysz w swoje możliwości.',
      intro: 'Zaznacz, na ile zgadzasz się z każdym zdaniem. Odpowiadaj szczerze — to ankieta tylko dla Ciebie.',
      qs: RSES.concat(GSES) },
    { id: 'rozwoj', name: 'Mój etap rozwoju', icon: '🌱', mins: 3,
      lead: 'Sens, relacje, zadowolenie z życia — gdzie dziś jesteś.',
      intro: 'Zaznacz, na ile zgadzasz się z każdym zdaniem, myśląc o swoim życiu w ostatnim czasie.',
      qs: FS.concat(SWLS) }
  ];

  // ---------- normy i opisy ----------
  // IPIP-BFM-50, średnia pozycji 1–5, Strus i in. 2014 (tab. 8)
  var NORMS = {
    k: { E: [3.36, .77], A: [3.90, .59], C: [3.48, .66], S: [2.97, .80], I: [3.57, .59] },
    m: { E: [3.34, .77], A: [3.80, .62], C: [3.43, .66], S: [3.14, .79], I: [3.60, .58] }
  };
  var TRAITS = {
    E: { n: 'Ekstrawersja', hi: 'Jesteś osobą aktywną, energiczną i towarzyską. Łatwo nawiązujesz kontakt, chętnie rozmawiasz i dobrze czujesz się wśród ludzi.', mid: 'Potrafisz być towarzyski, ale dobrze czujesz się też w spokoju i we własnym gronie — zależnie od sytuacji.', lo: 'Jesteś raczej spokojny i powściągliwy. Wolisz mniejsze grono, potrzebujesz czasu dla siebie i nie szukasz centrum uwagi.' },
    A: { n: 'Ugodowość', hi: 'Masz życzliwe, ufne nastawienie do ludzi. Jesteś wyrozumiały, serdeczny i chętnie pomagasz innym.', mid: 'Jesteś życzliwy dla ludzi, ale potrafisz też postawić na swoim i zadbać o własne sprawy.', lo: 'Jesteś raczej niezależny i krytyczny wobec innych. Mówisz wprost i nie zawsze stawiasz cudze sprawy przed swoimi.' },
    C: { n: 'Sumienność', hi: 'Jesteś zorganizowany, staranny i obowiązkowy. Lubisz porządek, planujesz i doprowadzasz sprawy do końca.', mid: 'Zwykle dotrzymujesz obowiązków, choć nie zawsze trzymasz się planu i porządku.', lo: 'Działasz raczej spontanicznie, mniej przywiązujesz wagę do porządku i planowania. Bywa, że coś Ci umyka.' },
    S: { n: 'Stabilność emocjonalna', hi: 'Jesteś spokojny i zrównoważony. Niełatwo wyprowadzić Cię z równowagi i dobrze znosisz stres.', mid: 'Zwykle panujesz nad emocjami, choć w trudniejszych chwilach stres i nerwy dają o sobie znać.', lo: 'Mocno przeżywasz emocje. Łatwiej Cię zaniepokoić, zdarza Ci się martwić i odczuwać zmiany nastroju.' },
    I: { n: 'Intelekt i wyobraźnia', hi: 'Masz bogatą wyobraźnię i ciekawość świata. Lubisz nowe pomysły, myślenie i twórcze zadania.', mid: 'Lubisz nowe pomysły, ale cenisz też sprawdzone, praktyczne rozwiązania.', lo: 'Jesteś osobą konkretną i praktyczną. Bardziej niż teorie i abstrakcje interesuje Cię to, co realne i użyteczne.' }
  };
  var COLORS = {
    red: { n: 'Czerwony', sub: 'Działający', hex: '#e5484d', d: 'Masz w sobie energię do działania. Szybko podejmujesz decyzje, stawiasz sobie cele i przejmujesz inicjatywę. Ludzie widzą w Tobie kogoś, kto „pociągnie” sprawę.' },
    yellow: { n: 'Żółty', sub: 'Inspirujący', hex: '#f5a524', d: 'Jesteś towarzyski i pełen entuzjazmu. Łatwo zarażasz innych pomysłami, dobrze czujesz się wśród ludzi i potrafisz ich motywować.' },
    green: { n: 'Zielony', sub: 'Wspierający', hex: '#30a46c', d: 'Jesteś spokojny, cierpliwy i życzliwy. Dbasz o relacje i dobrą atmosferę, umiesz słuchać, a ludzie czują się przy Tobie bezpiecznie.' },
    blue: { n: 'Niebieski', sub: 'Analizujący', hex: '#3a6bdf', d: 'Jesteś dokładny i rozważny. Zanim coś zrobisz, wolisz to przemyśleć, opierasz się na faktach i cenisz porządek oraz rzetelność.' }
  };

  // ---------- stan ----------
  var st = load();
  function load() {
    try { var s = JSON.parse(localStorage.getItem(STORE) || 'null'); if (s && s.v === 1) return s; } catch (e) { }
    return { v: 1, sex: null, ans: {}, done: {} };
  }
  function save() { try { localStorage.setItem(STORE, JSON.stringify(st)); } catch (e) { } }

  // opisy wyników pisane w formie męskiej — dla kobiet podmiana słów (całych wyrazów)
  var FEM = {
    spokojny: 'spokojna', powściągliwy: 'powściągliwa', życzliwy: 'życzliwa', wyrozumiały: 'wyrozumiała', serdeczny: 'serdeczna',
    niezależny: 'niezależna', krytyczny: 'krytyczna', zorganizowany: 'zorganizowana', staranny: 'staranna', obowiązkowy: 'obowiązkowa',
    zrównoważony: 'zrównoważona', dokładny: 'dokładna', rozważny: 'rozważna', towarzyski: 'towarzyska', cierpliwy: 'cierpliwa',
    pełen: 'pełna', jaki: 'jaka', chciałbyś: 'chciałabyś', chciał: 'chciała', sam: 'sama'
  };
  function g(t) { // forma męska/żeńska
    var f = st.sex === 'k' ? 1 : 0;
    t = t.replace(/\{([^|}]*)\|([^}]*)\}/g, function (m, a, b) {
      if (st.sex === 'x') return a + ' / ' + b;
      return f ? b : a;
    });
    if (f) t = t.replace(/[A-Za-ząćęłńóśźżĄĆĘŁŃÓŚŹŻ]+/g, function (w) { return FEM[w] || w; });
    return t;
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function mod(id) { for (var i = 0; i < MODULES.length; i++) if (MODULES[i].id === id) return MODULES[i]; }

  // ---------- liczenie ----------
  function itemVal(q, a) { var n = q.s.length; return q.r ? (n + 1 - a) : a; }
  function sums(m) {
    var out = {}, a = st.ans[m.id] || [];
    m.qs.forEach(function (q, i) { if (!a[i]) return; out[q.k] = out[q.k] || { s: 0, n: 0 }; out[q.k].s += itemVal(q, a[i]); out[q.k].n++; });
    return out;
  }
  function cdf(z) { // rozkład normalny
    var t = 1 / (1 + 0.2316419 * Math.abs(z)), d = 0.3989423 * Math.exp(-z * z / 2);
    var p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    return z > 0 ? 1 - p : p;
  }
  function norm(k) {
    if (st.sex === 'k' || st.sex === 'm') return NORMS[st.sex][k];
    return [(NORMS.k[k][0] + NORMS.m[k][0]) / 2, (NORMS.k[k][1] + NORMS.m[k][1]) / 2];
  }
  function scoreCharakter() {
    var s = sums(mod('charakter')), r = {};
    ['E', 'A', 'C', 'S', 'I'].forEach(function (k) {
      var mean = s[k].s / s[k].n, nm = norm(k), z = (mean - nm[0]) / nm[1];
      var pct = Math.round(cdf(z) * 100), sten = Math.max(1, Math.min(10, Math.round(5.5 + 2 * z)));
      r[k] = { mean: mean, z: z, pct: Math.max(1, Math.min(99, pct)), sten: sten, band: pct < 30 ? 'lo' : pct > 70 ? 'hi' : 'mid' };
    });
    // kolor = metafora wyliczona z wymiarów (wagi do dostrojenia na własnych danych)
    var E = r.E.z, A = r.A.z, C = r.C.z, S = r.S.z, I = r.I.z;
    var raw = { red: E + 0.5 * C - A, yellow: E + A, green: -E + A + 0.5 * S, blue: -E + C + 0.5 * I };
    if (COLORS_N === 3) delete raw.yellow;
    var tot = 0, col = {};
    Object.keys(raw).forEach(function (c) { col[c] = Math.exp(raw[c] * 0.6); tot += col[c]; });
    var list = Object.keys(col).map(function (c) { return { c: c, p: Math.round(col[c] / tot * 100) }; }).sort(function (a, b) { return b.p - a.p; });
    var fix = 100 - list.reduce(function (a, x) { return a + x.p; }, 0); list[0].p += fix;
    return { traits: r, colors: list };
  }
  function scoreSamoocena() {
    var s = sums(mod('samoocena'));
    var R = s.R.s, G = s.G.s;
    return {
      R: { v: R, min: 10, max: 40, band: R <= 24 ? 'lo' : R >= 36 ? 'hi' : 'mid' },
      G: { v: G, min: 10, max: 40, band: G <= 24 ? 'lo' : G >= 35 ? 'hi' : 'mid' }
    };
  }
  function scoreRozwoj() {
    var s = sums(mod('rozwoj'));
    var F = s.F.s, W = s.W.s;
    var swl = W >= 31 ? 'Bardzo duże zadowolenie z życia' : W >= 26 ? 'Duże zadowolenie z życia' : W >= 21 ? 'Raczej zadowolenie z życia' : W === 20 ? 'Ani zadowolenie, ani niezadowolenie' : W >= 15 ? 'Raczej niezadowolenie z życia' : W >= 10 ? 'Niezadowolenie z życia' : 'Duże niezadowolenie z życia';
    var p = ((F - 8) / 48 + (W - 5) / 30) / 2, stage = p < 0.45 ? 0 : p < 0.62 ? 1 : p < 0.8 ? 2 : 3;
    return { F: { v: F, min: 8, max: 56, band: F < 38 ? 'lo' : F >= 52 ? 'hi' : 'mid' }, W: { v: W, min: 5, max: 35, label: swl }, stage: stage };
  }
  var STAGES = [
    { n: 'Szukam', d: 'Jesteś w momencie poszukiwania. Część ważnych spraw — sens, relacje albo zadowolenie z codzienności — nie układa się dziś tak, jak byś chciał. To dobry moment, żeby zatrzymać się i zastanowić, czego naprawdę potrzebujesz. Nie musisz robić tego sam.' },
    { n: 'Buduję', d: 'Masz już fundamenty, na których możesz budować, ale niektóre obszary życia wymagają jeszcze uwagi. Warto wybrać jeden z nich i świadomie nad nim pracować.' },
    { n: 'Rozwijam się', d: 'Twoje życie w dużej mierze ma kierunek i sens. Masz wsparcie ludzi i poczucie, że sobie radzisz. Teraz możesz rozwijać to, co już działa.' },
    { n: 'Rozkwitam', d: 'Czujesz sens, satysfakcję i dobre relacje z ludźmi. Jesteś w bardzo dobrym miejscu — możesz też dzielić się tym z innymi i ich wspierać.' }
  ];
  var SELF = {
    R: { n: 'Samoocena', lo: 'Twoja samoocena jest dziś niska — często patrzysz na siebie krytycznie i nie dostrzegasz swoich mocnych stron. To nie jest ocena Twojej wartości, tylko tego, jak siebie teraz widzisz. To da się zmienić, a rozmowa z kimś życzliwym bardzo w tym pomaga.', mid: 'Twoja samoocena jest na zdrowym, przeciętnym poziomie. Zwykle akceptujesz siebie, choć w trudniejszych chwilach pojawiają się wątpliwości.', hi: 'Masz wysoką samoocenę — akceptujesz siebie i widzisz swoją wartość. To mocny fundament w relacjach i działaniu.' },
    G: { n: 'Wiara we własne możliwości', lo: 'Często masz wątpliwości, czy poradzisz sobie z trudnościami. Warto zauważać nawet małe sukcesy — to one budują poczucie, że „dam radę”.', mid: 'Zwykle wierzysz, że poradzisz sobie z trudnościami, choć nowe lub nieoczekiwane sytuacje czasem Cię niepokoją.', hi: 'Mocno wierzysz w swoje możliwości. Trudności traktujesz jak zadania do rozwiązania i zwykle znajdujesz wyjście.' }
  };
  var BANDLBL = { lo: 'niski', mid: 'przeciętny', hi: 'wysoki' };

  // ---------- quiz (pełny ekran) ----------
  var ov, cur = { m: null, i: 0, intro: true };
  function openQuiz(id) {
    cur = { m: mod(id), i: 0, intro: true };
    var a = st.ans[id] || [];
    if (a.length && !st.done[id]) { // wznowienie
      var i = 0; while (i < cur.m.qs.length && a[i]) i++;
      cur.i = Math.min(i, cur.m.qs.length - 1); cur.intro = false;
    } else if (st.done[id]) { st.ans[id] = []; st.done[id] = false; save(); }
    if (!st.sex) cur.sexAsk = true;
    document.documentElement.classList.add('wfq-lock');
    ov.hidden = false;
    render();
  }
  function closeQuiz() { ov.hidden = true; document.documentElement.classList.remove('wfq-lock'); renderHome(); }

  function render() {
    var m = cur.m, box = ov.querySelector('.wfq-card');
    var total = m.qs.length, a = st.ans[m.id] || [];
    var answered = a.filter(Boolean).length;
    ov.querySelector('.wfq-mod').textContent = m.icon + ' ' + m.name;
    ov.querySelector('.wfq-bar i').style.width = Math.round(answered / total * 100) + '%';
    var h = '';
    if (cur.sexAsk) {
      h = '<p class="wfq-step">Na początek</p><h2 class="wfq-q">Jak mamy się do Ciebie zwracać?</h2>' +
        '<p class="wfq-hint">Dzięki temu pytania będą w odpowiedniej formie, a wynik porównamy z właściwą grupą.</p>' +
        '<div class="wfq-opts">' +
        '<button type="button" data-sex="k">Jestem kobietą</button>' +
        '<button type="button" data-sex="m">Jestem mężczyzną</button>' +
        '<button type="button" data-sex="x" class="wfq-opt--soft">Wolę nie podawać</button></div>';
    } else if (cur.intro) {
      h = '<p class="wfq-step">' + total + ' pytań · ok. ' + m.mins + ' min</p><h2 class="wfq-q">' + esc(m.name) + '</h2>' +
        '<p class="wfq-hint wfq-hint--big">' + esc(g(m.intro)) + '</p>' +
        '<div class="wfq-opts"><button type="button" class="wfq-go" data-start>Zaczynamy →</button></div>';
    } else {
      var q = m.qs[cur.i], sel = a[cur.i];
      h = '<p class="wfq-step">Pytanie ' + (cur.i + 1) + ' z ' + total + '</p>' +
        '<h2 class="wfq-q">' + esc(g(q.t)) + '</h2><div class="wfq-opts wfq-opts--' + q.s.length + '">';
      q.s.forEach(function (lbl, j) {
        h += '<button type="button" data-a="' + (j + 1) + '"' + (sel === j + 1 ? ' class="is-on"' : '') + '><span class="wfq-dot" aria-hidden="true"></span>' + esc(lbl) + '</button>';
      });
      h += '</div>';
    }
    box.innerHTML = h;
    box.classList.remove('wfq-in'); void box.offsetWidth; box.classList.add('wfq-in');
    ov.querySelector('[data-back]').style.visibility = (cur.sexAsk || cur.intro) ? 'hidden' : 'visible';
    if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
  }

  function onClick(ev) {
    var b = ev.target.closest('button'); if (!b || !ov.contains(b)) return;
    if (b.hasAttribute('data-close')) return closeQuiz();
    if (b.hasAttribute('data-back')) {
      if (cur.i > 0) { cur.i--; render(); } else { cur.intro = true; render(); }
      return;
    }
    if (b.hasAttribute('data-sex')) { st.sex = b.getAttribute('data-sex'); save(); cur.sexAsk = false; render(); return; }
    if (b.hasAttribute('data-start')) { cur.intro = false; render(); return; }
    if (b.hasAttribute('data-a')) {
      if (ov.dataset.busy) return;
      var m = cur.m, a = st.ans[m.id] = st.ans[m.id] || [];
      a[cur.i] = +b.getAttribute('data-a'); save();
      [].forEach.call(b.parentNode.children, function (x) { x.classList.toggle('is-on', x === b); });
      ov.dataset.busy = '1';
      setTimeout(function () {
        delete ov.dataset.busy;
        var next = -1; for (var i = cur.i + 1; i < m.qs.length; i++) if (!a[i]) { next = i; break; }
        if (next < 0) for (i = 0; i < m.qs.length; i++) if (!a[i]) { next = i; break; }
        if (next < 0) { st.done[m.id] = true; st.at = st.at || {}; st.at[m.id] = new Date().toISOString(); save(); finish(m.id); }
        else { cur.i = next; render(); }
      }, 260);
    }
  }
  function finish(id) {
    closeQuiz();
    var el = document.getElementById('wyniki-' + id) || document.getElementById('wyniki');
    if (el) setTimeout(function () { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); el.classList.add('wfq-flash'); }, 80);
  }

  // ---------- strona: moduły i wyniki ----------
  function bar(pct, color) { return '<div class="wfq-meter"><i style="width:' + Math.max(3, pct) + '%;' + (color ? 'background:' + color : '') + '"></i></div>'; }

  function renderHome() {
    var grid = document.getElementById('wfq-modules');
    grid.innerHTML = MODULES.map(function (m) {
      var a = (st.ans[m.id] || []).filter(Boolean).length, done = st.done[m.id];
      var btn = done ? 'Zrób jeszcze raz' : a ? 'Dokończ (' + a + '/' + m.qs.length + ')' : 'Rozpocznij';
      return '<article class="wfq-mcard' + (done ? ' is-done' : '') + '">' +
        '<div class="wfq-mcard__ic" aria-hidden="true">' + m.icon + '</div>' +
        '<h3>' + esc(m.name) + '</h3><p>' + esc(m.lead) + '</p>' +
        '<p class="wfq-meta">' + m.qs.length + ' pytań · ok. ' + m.mins + ' min' + (done ? ' · <b>gotowe ✓</b>' : '') + '</p>' +
        '<div class="wfq-mcard__btns"><button type="button" class="wfd-btn ' + (done ? 'wfd-btn--outline' : 'wfd-btn--blue') + '" data-open="' + m.id + '">' + btn + '</button>' +
        (done ? '<a class="wfq-link" href="#wyniki-' + m.id + '">Zobacz wynik ↓</a>' : '') + '</div></article>';
    }).join('');
    renderResults();
  }

  function renderResults() {
    var wrap = document.getElementById('wyniki'), out = '';
    if (st.done.charakter) {
      var c = scoreCharakter(), top = COLORS[c.colors[0].c], sec = COLORS[c.colors[1].c];
      out += '<section class="wfq-res" id="wyniki-charakter"><p class="wfq-kicker">🧭 Mój charakter</p>' +
        '<div class="wfq-color" style="--c:' + top.hex + '"><div class="wfq-color__dot"></div><div><p class="wfq-color__lbl">Twój kolor</p>' +
        '<h3>' + top.n + ' <span>— ' + top.sub + '</span></h3><p>' + esc(g(top.d)) + '</p>' +
        '<p class="wfq-color__2">Drugi kolor: <b style="color:' + sec.hex + '">' + sec.n + ' (' + sec.sub.toLowerCase() + ')</b> — ' + esc(g(sec.d)) + '</p></div></div>' +
        '<div class="wfq-mix">' + c.colors.map(function (x) { return '<span style="flex:' + Math.max(x.p, 4) + ';background:' + COLORS[x.c].hex + '" title="' + COLORS[x.c].n + ' ' + x.p + '%">' + (x.p >= 9 ? x.p + '%' : '') + '</span>'; }).join('') + '</div>' +
        '<div class="wfq-mixlbl">' + c.colors.map(function (x) { return '<span><i style="background:' + COLORS[x.c].hex + '"></i>' + COLORS[x.c].n + ' ' + x.p + '%</span>'; }).join('') + '</div>' +
        '<h4 class="wfq-sub">Pięć cech osobowości</h4><div class="wfq-traits">' +
        ['E', 'A', 'C', 'S', 'I'].map(function (k) {
          var t = c.traits[k], T = TRAITS[k];
          return '<div class="wfq-trait"><div class="wfq-trait__h"><b>' + T.n + '</b><span class="wfq-band wfq-band--' + t.band + '">' + BANDLBL[t.band] + '</span></div>' +
            bar(t.pct) + '<p class="wfq-trait__p">Wyżej niż u ok. <b>' + t.pct + '%</b> osób</p><p>' + esc(g(T[t.band])) + '</p></div>';
        }).join('') + '</div>' +
        '<p class="wfq-note">Kolor to uproszczony opis wyliczony z Twoich wyników pięciu cech osobowości (model Wielkiej Piątki). Porównanie orientacyjne — z wynikami ok. 7000 osób w Polsce' + (st.sex === 'k' ? ' (kobiety)' : st.sex === 'm' ? ' (mężczyźni)' : '') + '.</p></section>';
    }
    if (st.done.samoocena) {
      var s = scoreSamoocena();
      out += '<section class="wfq-res" id="wyniki-samoocena"><p class="wfq-kicker">💪 Moja samoocena</p><div class="wfq-two">' +
        ['R', 'G'].map(function (k) {
          var r = s[k], S = SELF[k], pct = Math.round((r.v - r.min) / (r.max - r.min) * 100);
          return '<div class="wfq-score"><div class="wfq-trait__h"><b>' + S.n + '</b><span class="wfq-band wfq-band--' + r.band + '">' + BANDLBL[r.band] + '</span></div>' +
            '<p class="wfq-big">' + r.v + '<small> / ' + r.max + ' pkt</small></p>' + bar(pct) + '<p>' + esc(g(S[r.band])) + '</p></div>';
        }).join('') + '</div></section>';
    }
    if (st.done.rozwoj) {
      var w = scoreRozwoj(), stg = STAGES[w.stage];
      out += '<section class="wfq-res" id="wyniki-rozwoj"><p class="wfq-kicker">🌱 Mój etap rozwoju</p>' +
        '<ol class="wfq-stages">' + STAGES.map(function (x, i) { return '<li class="' + (i === w.stage ? 'is-on' : i < w.stage ? 'is-past' : '') + '"><span>' + (i + 1) + '</span>' + x.n + '</li>'; }).join('') + '</ol>' +
        '<h3 class="wfq-stage">Twój etap: ' + stg.n + '</h3><p>' + esc(g(stg.d)) + '</p><div class="wfq-two">' +
        '<div class="wfq-score"><div class="wfq-trait__h"><b>Rozkwit (sens, relacje, kompetencje)</b><span class="wfq-band wfq-band--' + w.F.band + '">' + BANDLBL[w.F.band] + '</span></div><p class="wfq-big">' + w.F.v + '<small> / 56 pkt</small></p>' + bar(Math.round((w.F.v - 8) / 48 * 100)) + '</div>' +
        '<div class="wfq-score"><div class="wfq-trait__h"><b>Zadowolenie z życia</b></div><p class="wfq-big">' + w.W.v + '<small> / 35 pkt</small></p>' + bar(Math.round((w.W.v - 5) / 30 * 100)) + '<p>' + w.W.label + '.</p></div>' +
        '</div></section>';
    }
    var any = st.done.charakter || st.done.samoocena || st.done.rozwoj;
    var left = MODULES.filter(function (m) { return !st.done[m.id]; });
    if (any && left.length) {
      out += '<div class="wfq-next"><p>Zostało jeszcze: <b>' + left.map(function (m) { return m.name; }).join(', ') + '</b></p>' +
        '<button type="button" class="wfd-btn wfd-btn--blue" data-open="' + left[0].id + '">' + left[0].icon + ' ' + left[0].name + ' →</button></div>';
    }
    if (any) {
      out += '<div class="wfq-cta"><div><h3>Chcesz porozmawiać o swoim wyniku?</h3><p>Umów bezpłatną rozmowę z Fundacją. Pomożemy zrozumieć wynik i zastanowić się, co dalej.</p></div>' +
        '<div class="wfq-cta__btns"><a class="wfd-btn wfd-btn--blue" href="index.html#services">Umów bezpłatną rozmowę →</a>' +
        '<button type="button" class="wfd-btn wfd-btn--outline" data-print>Zapisz wynik (PDF)</button>' +
        '<button type="button" class="wfq-link" data-reset>Usuń moje odpowiedzi</button></div></div>' +
        '<p class="wfq-help">Wynik to samopoznanie, nie diagnoza. Jeśli od dłuższego czasu czujesz się źle — porozmawiaj z kimś. Pomoc w kryzysie: <a href="tel:116123">116 123</a> (dorośli), <a href="tel:116111">116 111</a> (dzieci i młodzież), w nagłym zagrożeniu <a href="tel:112">112</a>.</p>';
    }
    wrap.innerHTML = out;
    wrap.hidden = !any;
    document.getElementById('wfq-res-title').hidden = !any;
  }

  // ---------- start ----------
  function init() {
    ov = document.getElementById('wfq-quiz');
    ov.addEventListener('click', onClick);
    document.addEventListener('keydown', function (e) {
      if (ov.hidden) return;
      if (e.key === 'Escape') closeQuiz();
      var n = parseInt(e.key, 10), bs = ov.querySelectorAll('[data-a]');
      if (n >= 1 && n <= bs.length) bs[n - 1].click();
    });
    document.addEventListener('click', function (e) {
      var o = e.target.closest('[data-open]'); if (o) { e.preventDefault(); openQuiz(o.getAttribute('data-open')); return; }
      if (e.target.closest('[data-all]')) { e.preventDefault(); var nx = MODULES.filter(function (m) { return !st.done[m.id]; })[0] || MODULES[0]; openQuiz(nx.id); return; }
      if (e.target.closest('[data-print]')) { window.print(); return; }
      if (e.target.closest('[data-reset]')) {
        if (confirm('Usunąć wszystkie odpowiedzi i wyniki z tego urządzenia?')) { st = { v: 1, sex: null, ans: {}, done: {} }; save(); renderHome(); }
      }
    });
    renderHome();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
