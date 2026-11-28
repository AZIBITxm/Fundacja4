/* Program „Technologia dla zdrowia” — treść modułów, tematów i urządzeń (2026-11-27).
   Jedno miejsce na treść: strona (js/technologia.js) buduje z tego kafelki modułów i okna.
   Typy pozycji: "artykul" (poradnik / wyjaśnienie) i "urzadzenie" (rodzaj urządzenia, pojazd).
   Pole todo:true = opis skrócony, pełny artykuł (badania, producenci) w przygotowaniu.
   Materiały robocze i źródła: 1. FUNDACJA\Programy\Technologia dla zdrowia\ (plan + research). */
window.WFT_DATA = (function () {
  'use strict';
  var IMG = '../images/banery/technologia-zdrowie.webp?v=3';
  // Zdjęcia aut (images/technologia/auta) to zdjęcia producentów — włączyć (true) dopiero po uzyskaniu zgody / press kit.
  var AUTA_ZGODA = false;
  function auto(f) { return AUTA_ZGODA ? '../images/technologia/auta/' + f : null; }
  // kadry z jednej grafiki (background-position przy background-size 300%)
  var crop = {
    reader: { img: IMG, pos: '4% 59%' },
    phone:  { img: IMG, pos: '76% 79%' },
    jug:    { img: IMG, pos: '75% 26%' },
    lamp:   { img: IMG, pos: '8% 22%' },
    plant:  { img: IMG, pos: '100% 32%' },
    air:    { img: IMG, pos: '45% 21%' }
  };

  var NIE_NAMAWIAMY = '<div class="wft-note wft-note--warn"><p><strong>Informujemy, nie namawiamy.</strong> Nie zachęcamy do zakupu takich pojazdów ani do samodzielnej jazdy przez młodzież. Każdą taką decyzję powinni indywidualnie rozważyć rodzice, biorąc pod uwagę dojrzałość dziecka, jego odpowiedzialność, umiejętności i zdolność do bezpiecznego uczestnictwa w ruchu drogowym. To, że pojazd może prowadzić czternastolatek, nie oznacza, że w razie wypadku chroni tak jak zwykły samochód osobowy.</p></div>';

  return {
    modules: [
      /* ============ 1. NAUKA ============ */
      {
        id: 'nauka', no: 1, name: 'Nauka i edukacja', color: '#5b8cff', icon: 'fa-graduation-cap', visual: crop.reader,
        motto: 'Nowoczesna technologia w służbie nauki.',
        swap: { from: 'stosu zeszytów', to: 'tablet E Ink' },
        intro: [
          'Sposób, w jaki dzieci zdobywają wiedzę, szybko się zmienia. Nowoczesne urządzenia pozwalają korzystać z materiałów edukacyjnych, prowadzić notatki i przechowywać podręczniki w jednym miejscu.',
          'Warto jednak wybierać rozwiązania odpowiednie do nauki. Nie każdy ekran sprawdza się równie dobrze podczas wielogodzinnego czytania i pracy z tekstem.',
          'Szczególnie interesującą technologią jest elektroniczny papier E Ink, który pozwala korzystać z cyfrowych materiałów w sposób przypominający czytanie tradycyjnej książki.'
        ],
        items: [
          {
            id: 'e-ink', type: 'artykul', group: 'Poradniki', icon: 'fa-file-text-o',
            title: 'Elektroniczny papier zamiast klasycznego ekranu', was: 'klasycznego ekranu',
            sub: 'Czym różni się E Ink od LCD i OLED i dlaczego jest interesującą alternatywą do czytania.',
            body:
              '<h3><span>1</span>Problem</h3><p>Dzieci coraz więcej czytają i uczą się z ekranów: tabletów, laptopów, telefonów. Klasyczne ekrany LCD i OLED <strong>same świecą</strong>: obraz powstaje ze światła, które pada prosto w oczy. Przy wielogodzinnej pracy z tekstem warto zapytać, czy da się to robić w sposób bliższy zwykłej książce.</p>' +
              '<h3><span>2</span>Co mówią badania?</h3><p>W badaniu Benedetto i współpracowników (2013) porównano czytanie na ekranie LCD, na czytniku E Ink i na papierze. Pod względem zmęczenia wzroku <strong>E Ink wypadł bardzo podobnie do tradycyjnej książki</strong>, w odróżnieniu od ekranu LCD.<a class="wft-cite" href="#zr-eink-1">[1]</a></p>' +
              '<div class="wft-note"><p><strong>Uczciwie:</strong> długie czytanie z bliska nadal może męczyć oczy, bez względu na to, czy to papier, czy ekran. E Ink nie „usuwa” zmęczenia wzroku. Natomiast porównanie go do papieru ma naukowe uzasadnienie.</p></div>' +
              '<h3><span>3</span>Alternatywa</h3><p>Czytniki i notatniki z ekranem E Ink (elektroniczny papier): do czytania podręczników, lektur i materiałów, a w wersjach z rysikiem także do odręcznych notatek.</p>' +
              '<h3><span>4</span>Jak to działa?</h3><ul><li>E Ink <strong>nie jest klasycznym ekranem emitującym światło</strong>.</li><li>Obraz powstaje dzięki <strong>przemieszczaniu cząstek pigmentu</strong>: maleńkie białe i czarne (w ekranach kolorowych także barwne) drobinki przesuwa pole elektryczne.</li><li>W wersji bez podświetlenia ekran <strong>wykorzystuje światło otoczenia</strong>, odbija je jak kartka papieru.</li><li>Raz ułożony obraz zostaje bez zużywania prądu, dlatego baterie wystarczają na tygodnie.</li><li><strong>Podświetlenie</strong>, jeśli urządzenie je ma, to dodatkowa funkcja, z której nie trzeba korzystać.</li></ul>' +
              '<h3><span>5</span>Korzyści dla dziecka</h3><ul><li>W dobrych warunkach oświetleniowych czyta się podobnie jak na papierze.</li><li>Wiele podręczników i notatek w jednym lekkim urządzeniu.</li><li>Mniej rozpraszaczy: czytniki E Ink zwykle nie mają gier, filmów ani powiadomień.</li></ul>' +
              '<h3><span>6</span>Na co zwrócić uwagę przy wyborze?</h3><ul><li>Regulacja jasności i <strong>barwy podświetlenia</strong> (cieplejsze światło wieczorem).</li><li>System zamknięty czy z dostępem do aplikacji: więcej aplikacji to też więcej rozpraszaczy.</li><li>Przekątna dopasowana do materiałów (podręczniki PDF lepiej czyta się na większym ekranie).</li><li>Dobre światło w pokoju i przerwy w czytaniu nadal są ważne.</li></ul>' +
              '<div class="wft-src"><p>Źródła</p><ol><li id="zr-eink-1">Benedetto S. i in. (2013). Porównanie czytania na LCD, E Ink i papierze. <a href="https://pubmed.ncbi.nlm.nih.gov/24386252/" target="_blank" rel="noopener">PubMed 24386252</a></li></ol></div>'
          },
          {
            id: 'narzedzia', type: 'artykul', group: 'Poradniki', icon: 'fa-lightbulb-o', todo: true,
            title: 'Cyfrowe narzędzia do nauki',
            sub: 'Aplikacje i urządzenia wspierające zapamiętywanie, organizację wiedzy i samodzielną naukę.',
            body: '<p>Aplikacje do powtórek (fiszki), porządkowania notatek i planowania nauki mogą pomóc dziecku uczyć się samodzielnie i regularnie. Pokażemy, które narzędzia rzeczywiście wspierają zapamiętywanie, a które tylko zajmują czas przed ekranem.</p>'
          },
          {
            id: 'tablet-e-ink', type: 'urzadzenie', group: 'Urządzenia', icon: 'fa-tablet', visual: crop.reader,
            title: 'Tablet E Ink', was: 'stosu zeszytów',
            sub: 'Cyfrowe notatniki, które pozwalają przechowywać materiały edukacyjne i robić odręczne notatki.',
            body:
              '<p class="wft-lead">Notatnik z ekranem z elektronicznego papieru i rysikiem: piszesz odręcznie jak w zeszycie, a w jednym urządzeniu mieszczą się wszystkie zeszyty, notatki i materiały.</p>' +
              '<h3>Co daje?</h3><ul><li>Odręczne pisanie, ważne dla zapamiętywania, bez noszenia stosu zeszytów.</li><li>Czytanie PDF-ów i podręczników na ekranie przypominającym papier (zob. „Elektroniczny papier zamiast klasycznego ekranu”).</li><li>Porządek: notatki w folderach, wyszukiwanie, kopia zapasowa.</li></ul>' +
              '<h3>Na co zwrócić uwagę?</h3><ul><li>Przekątna (ok. 10 cali to wygodny format zeszytu A5–A4).</li><li>Rysik w zestawie, opóźnienie pisania, wymienne końcówki.</li><li>Podświetlenie z regulacją barwy (albo jego brak: czyste „papierowe” czytanie).</li><li>System zamknięty (mniej rozpraszaczy) czy Android z aplikacjami.</li><li>Ekran czarno-biały czy kolorowy (kolor bywa mniej kontrastowy).</li></ul>',
            brands: [
              { name: 'reMarkable', country: 'Norwegia' }, { name: 'Kobo', country: 'Kanada' },
              { name: 'Amazon Kindle Scribe', country: 'USA' }, { name: 'Onyx Boox', country: 'Chiny' },
              { name: 'Supernote', country: 'Chiny' }, { name: 'PocketBook', country: 'Szwajcaria' }
            ]
          },
          {
            id: 'e-podreczniki', type: 'urzadzenie', group: 'Urządzenia', icon: 'fa-book', todo: true,
            title: 'Cyfrowe podręczniki', was: 'ciężkich książek',
            sub: 'Możliwość korzystania z wielu podręczników w jednym lekkim urządzeniu.',
            body: '<p>Ciężki plecak to codzienność wielu uczniów. Cyfrowe wersje podręczników i lektur pozwalają mieć wszystkie materiały w jednym lekkim urządzeniu. Darmowe materiały edukacyjne udostępnia m.in. rządowa Zintegrowana Platforma Edukacyjna (zpe.gov.pl), a wydawnictwa szkolne oferują wersje cyfrowe swoich podręczników. Opiszemy, na jakich urządzeniach najwygodniej z nich korzystać.</p>'
          }
        ]
      },

      /* ============ 2. TELEFONY ============ */
      {
        id: 'telefony', no: 2, name: 'Telefony i komunikacja', color: '#c084fc', icon: 'fa-mobile', visual: crop.phone,
        motto: 'Technologia dopasowana do potrzeb, a nie odwrotnie.',
        swap: { from: 'klasycznego smartfona', to: 'telefon E Ink' },
        intro: [
          'Smartfon stał się ważnym elementem codziennego życia. Dzieci i młodzież wykorzystują go do komunikacji, nauki i kontaktu ze światem. Problemem nie jest jednak sama możliwość korzystania z telefonu, ale sposób, w jaki zaprojektowano współczesne urządzenia i aplikacje.',
          'Kolorowe ekrany, animacje, powiadomienia i niekończące się strumienie treści mogą zachęcać do ciągłego sięgania po urządzenie.',
          'Alternatywą mogą być telefony wykorzystujące technologię E Ink. Pozwalają zachować dostęp do komunikacji i potrzebnych funkcji, jednocześnie oferując zupełnie inne doświadczenie korzystania z urządzenia.'
        ],
        items: [
          {
            id: 'telefon-e-ink', type: 'urzadzenie', group: 'Urządzenia', icon: 'fa-mobile', visual: crop.phone, todo: true,
            title: 'Telefon E Ink', was: 'klasycznego smartfona',
            sub: 'Alternatywa z ekranem przypominającym papier.',
            body: '<p class="wft-lead">Smartfon z ekranem z elektronicznego papieru: działają rozmowy, wiadomości, mapy czy bilety, ale ekran jest matowy, zwykle czarno-biały i odświeża się wolniej.</p><h3>Co daje?</h3><ul><li>Przewijanie filmików i gier przestaje być atrakcyjne, a potrzebne funkcje zostają.</li><li>Ekran czytelny w słońcu, bateria na kilka dni.</li></ul><h3>Na co zwrócić uwagę?</h3><ul><li>Czy działają aplikacje potrzebne w szkole i do kontaktu z rodziną.</li><li>Czy telefon ma możliwość ograniczenia aplikacji (np. tryb dla dziecka).</li></ul>',
            brands: [{ name: 'Mudita', country: 'Polska' }, { name: 'Hisense', country: 'Chiny' }, { name: 'Bigme', country: 'Chiny' }]
          },
          { ref: 'nauka/tablet-e-ink' },   // ten sam tablet E Ink co w module 1 (Adam: „w telefonach też mogą być tablety”)
          {
            id: 'mniej-bodzcow', type: 'artykul', group: 'Poradniki', icon: 'fa-eye-slash',
            title: 'Mniej bodźców, więcej koncentracji',
            sub: 'Jak ograniczyć wizualną atrakcyjność urządzeń i ułatwić skupienie.',
            body: '<p>Nie trzeba od razu zmieniać telefonu. Już w zwykłym smartfonie można sporo zrobić:</p><ul><li><strong>Skala szarości</strong> (tryb czarno-biały w ustawieniach dostępności): ekran przestaje być tak kuszący.</li><li><strong>Wyłączenie powiadomień</strong> z aplikacji, które nie są potrzebne do komunikacji.</li><li><strong>Tryb skupienia / nie przeszkadzać</strong> na czas nauki i snu.</li><li><strong>Prosty ekran główny</strong>: tylko potrzebne aplikacje, reszta w folderze lub odinstalowana.</li><li>Telefon <strong>poza pokojem</strong> w nocy (zob. moduł „Sen i odpoczynek”).</li></ul>'
          },
          {
            id: 'telefon-do-komunikacji', type: 'urzadzenie', group: 'Urządzenia', icon: 'fa-phone', todo: true,
            title: 'Telefon do komunikacji', was: 'niekończącej się rozrywki',
            sub: 'Urządzenia skoncentrowane na podstawowych funkcjach.',
            body: '<p>Proste telefony, czyli rozmowy, SMS-y, czasem aparat i nawigacja, to dobry „pierwszy telefon”. Dziecko ma kontakt z rodzicami, a nie ma dostępu do mediów społecznościowych i gier. Opiszemy dostępne rodzaje: telefony klasyczne, minimalistyczne i zegarki z funkcją telefonu dla młodszych dzieci.</p>'
          },
          {
            id: 'media-spolecznosciowe', type: 'artykul', group: 'Poradniki', icon: 'fa-commenting-o', todo: true,
            title: 'Świadome korzystanie z mediów społecznościowych',
            sub: 'Rozwiązania pomagające zachować dostęp do komunikacji bez nadmiernego angażowania uwagi.',
            body: '<p>Narzędzia kontroli rodzicielskiej, limity czasu, aplikacje „spowalniające” otwieranie serwisów i wspólne zasady rodzinne. Pokażemy, jak z nich korzystać, żeby chronić uwagę dziecka i nie odbierać mu kontaktu z rówieśnikami.</p>'
          }
        ]
      },

      /* ============ 3. WODA I ŚRODOWISKO ============ */
      {
        id: 'woda', no: 3, name: 'Woda i środowisko', color: '#22d3ee', icon: 'fa-tint', visual: crop.jug,
        motto: 'To, z czym dzieci mają kontakt każdego dnia, ma znaczenie.',
        swap: { from: 'plastikowych butelek', to: 'filtr do wody' },
        intro: [
          'Woda, powietrze i materiały, z którymi mamy codzienny kontakt, tworzą środowisko, w którym rozwijają się dzieci.',
          'Nowoczesne technologie pozwalają lepiej kontrolować jakość otoczenia i ograniczać kontakt z wybranymi zanieczyszczeniami. Warto poznać dostępne rozwiązania i świadomie wybierać te, które rzeczywiście przynoszą korzyści.'
        ],
        items: [
          {
            id: 'butelki', type: 'artykul', group: 'Poradniki', icon: 'fa-flask',
            title: 'Filtr do wody zamiast plastikowych butelek', was: 'plastikowych butelek',
            sub: 'Systemy filtracji, mikroplastik i substancje mogące przedostawać się do wody.',
            body:
              '<h3><span>1</span>Problem</h3><p>Woda w plastikowych butelkach to dla wielu rodzin codzienność, także w szkolnym plecaku. Butelki z tworzywa PET mają kontakt z wodą przez wiele tygodni, często w cieple. Warto zapytać, czy coś z opakowania może przenikać do wody.</p>' +
              '<h3><span>2</span>Co mówią badania?</h3><ul><li>Badanie z 2010 r. porównało wodę mineralną z tego samego źródła w butelkach szklanych i plastikowych PET. W laboratoryjnym teście E-Screen <strong>aktywność estrogenowa była trzykrotnie wyższa</strong> w próbkach z butelek plastikowych.<a class="wft-cite" href="#zr-pet-1">[1]</a></li><li>Badanie z 2014 r. objęło 29 marek wody butelkowanej. <strong>Aktywność estrogenową wykryto w 79,3% próbek</strong>, w tym w części wód ze szkła.<a class="wft-cite" href="#zr-pet-2">[2]</a></li></ul>' +
              '<div class="wft-note"><p><strong>Precyzyjnie:</strong> badania dotyczyły aktywności hormonalnej <strong>próbek wody w testach laboratoryjnych</strong>. Nie wykazały wzrostu estrogenów we krwi osób pijących taką wodę. Pokazują natomiast, że warto interesować się substancjami zaburzającymi gospodarkę hormonalną i ograniczać niepotrzebny kontakt z nimi. Drugie badanie pokazuje też, że szkło nie zawsze było „czyste”, więc argumentem jest raczej: mniej butelek i dobrze dobrany filtr.</p></div>' +
              '<h3><span>3</span>Alternatywa</h3><p>Woda z kranu przefiltrowana w domu (dzbanek, filtr na kran, podzlewowy lub odwrócona osmoza), noszona w butelce wielorazowej ze stali lub szkła.</p>' +
              '<h3><span>4</span>Jak to działa?</h3><p>Każdy rodzaj filtra działa inaczej i usuwa co innego. Kliknij poniżej w <strong>rodzaj filtra</strong>, żeby zobaczyć, co daje i dla kogo jest.</p>' +
              '<h3><span>5</span>Korzyści dla dziecka</h3><ul><li>Mniej kontaktu z opakowaniami z tworzyw.</li><li>Woda zawsze pod ręką, bez dźwigania zgrzewek.</li><li>Mniej plastikowych odpadów, czyli dobry nawyk na całe życie.</li></ul>' +
              '<h3><span>6</span>Na co zwrócić uwagę przy wyborze?</h3><ul><li><strong>Najpierw sprawdź swoją wodę</strong> (wyniki wodociągów lub własne badanie), bo dopiero wtedy wiadomo, co trzeba usuwać.</li><li><strong>Atest higieniczny (PZH)</strong> dla wyrobów mających kontakt z wodą pitną oraz certyfikaty skuteczności, np. NSF/ANSI 42, 53, 58 (odwrócona osmoza), 401.</li><li>Koszt i częstotliwość wymiany wkładów: zaniedbany filtr może pogorszyć wodę.</li><li>Nie kupuj przypadkowych, bardzo tanich wkładów bez certyfikatów.</li></ul>' +
              '<div class="wft-src"><p>Źródła</p><ol><li id="zr-pet-1">Endocrine disruptors in bottled mineral water: estrogenic activity in the E-Screen (2010). <a href="https://pubmed.ncbi.nlm.nih.gov/21050888/" target="_blank" rel="noopener">PubMed 21050888</a></li><li id="zr-pet-2">Analiza aktywności estrogenowej 29 marek wody butelkowanej (2014). <a href="https://pubmed.ncbi.nlm.nih.gov/25454229/" target="_blank" rel="noopener">PubMed 25454229</a></li></ol></div>'
          },
          {
            id: 'czysta-woda', type: 'artykul', group: 'Poradniki', icon: 'fa-tint',
            title: 'Czysta woda w domu: od czego zacząć?',
            sub: 'Rodzaje filtrów, ich skuteczność i prawidłowa eksploatacja.',
            body: '<ol><li><strong>Poznaj swoją wodę.</strong> Wodociągi publikują wyniki badań. Przy własnej studni zrób analizę w laboratorium.</li><li><strong>Ustal cel:</strong> smak i chlor? kamień? metale? bakterie (studnia)? Do każdego celu służy inny filtr.</li><li><strong>Dobierz rodzaj filtra</strong> (zob. kafelki „Rodzaje filtrów”).</li><li><strong>Pilnuj wymiany wkładów</strong> według zaleceń producenta i dbaj o higienę (dzbanek myj, przechowuj w chłodzie).</li></ol>',
            brands: [{ name: 'Dafi', country: 'Polska' }, { name: 'Aquafilter', country: 'Polska' }, { name: 'Brita', country: 'Niemcy' }, { name: 'BWT', country: 'Austria' }, { name: 'Aquaphor', country: 'Estonia/Łotwa' }, { name: 'Laica', country: 'Włochy' }]
          },
          {
            id: 'dzbanek', type: 'urzadzenie', group: 'Rodzaje filtrów', icon: 'fa-filter', visual: crop.jug,
            title: 'Dzbanek filtrujący', sub: 'Najprostszy start: poprawia smak i ogranicza chlor oraz kamień.',
            body: '<h3>Jak działa?</h3><p>Woda przepływa przez wkład z <strong>węglem aktywnym</strong> (wyłapuje chlor i związki pogarszające smak i zapach) i zwykle <strong>żywicą jonowymienną</strong> (ogranicza kamień i część metali, np. miedź, ołów; zależnie od wkładu).</p><h3>Co daje, a czego nie?</h3><ul><li>✔ lepszy smak i zapach, mniej kamienia w czajniku,</li><li>✖ nie usuwa bakterii i wirusów,</li><li>✖ zwykle nie usuwa skutecznie azotanów.</li></ul><h3>Dla kogo?</h3><p>Mieszkanie z wodą wodociągową, mała rodzina, start bez montażu.</p><h3>Eksploatacja</h3><p>Wkład wymieniaj według zaleceń (zwykle co ok. 4 tygodnie). Dzbanek myj i trzymaj w chłodzie, przefiltrowaną wodę zużyj w ciągu doby.</p>'
          },
          {
            id: 'butelka-filtr', type: 'urzadzenie', group: 'Rodzaje filtrów', icon: 'fa-flask',
            title: 'Butelka z filtrem', sub: 'Do szkoły i na wyjazd: filtruje w trakcie picia.',
            body: '<h3>Jak działa?</h3><p>W butelce jest mały wkład, najczęściej węglowy, przez który woda przechodzi przy piciu. Modele <strong>turystyczne z membraną</strong> (ultrafiltracja) zatrzymują też bakterie i pierwotniaki.</p><h3>Co daje?</h3><ul><li>Lepszy smak wody z kranu lub poidełka w szkole.</li><li>Jedna butelka zamiast wielu plastikowych.</li></ul><h3>Na co uważać?</h3><p>Wybieraj butelki ze stali lub tworzyw bez BPA, regularnie myj i wymieniaj wkład.</p>'
          },
          {
            id: 'na-kran', type: 'urzadzenie', group: 'Rodzaje filtrów', icon: 'fa-shower',
            title: 'Filtr na kran', sub: 'Nakładka na wylewkę: filtrowana woda bez dzbanka.',
            body: '<h3>Jak działa?</h3><p>Mały filtr węglowy zakręcany na wylewkę z przełącznikiem: woda filtrowana albo zwykła.</p><h3>Co daje?</h3><ul><li>Lepszy smak, mniej chloru, od razu z kranu.</li><li>Tańszy start niż filtr podzlewowy, bez montażu pod zlewem.</li></ul><h3>Ograniczenia</h3><p>Wolniejszy przepływ, pasuje nie do każdej baterii, mały wkład wymaga częstej wymiany.</p>'
          },
          {
            id: 'podzlewowy', type: 'urzadzenie', group: 'Rodzaje filtrów', icon: 'fa-sliders',
            title: 'Filtr podzlewowy', sub: 'Kilka stopni filtracji ukrytych pod zlewem, osobny kranik.',
            body: '<h3>Jak działa?</h3><p>Zwykle 2–3 wkłady: <strong>sedymentacyjny</strong> (piasek, rdza), <strong>węglowy</strong> (najlepiej węgiel blokowy: chlor, smak, część związków organicznych) i opcjonalnie wkład na konkretny problem. Filtrowana woda płynie osobnym kranikiem.</p><h3>Co daje?</h3><ul><li>Duża wydajność dla całej rodziny, do picia i gotowania.</li><li>Wkłady wymienia się rzadziej (zwykle co 6–12 miesięcy).</li></ul><h3>Dla kogo?</h3><p>Rodziny, które dużo gotują i chcą zrezygnować z wody butelkowanej na stałe.</p>'
          },
          {
            id: 'osmoza', type: 'urzadzenie', group: 'Rodzaje filtrów', icon: 'fa-th',
            title: 'Odwrócona osmoza', sub: 'Najdokładniejsza filtracja domowa: membrana o bardzo drobnych porach.',
            body: '<h3>Jak działa?</h3><p>Po wstępnych filtrach woda jest przeciskana przez <strong>membranę osmotyczną</strong>, która zatrzymuje większość rozpuszczonych substancji. Czysta woda trafia do zbiornika, a koncentrat zanieczyszczeń do kanalizacji.</p><h3>Co daje?</h3><ul><li>Usuwa większość metali, azotanów, wiele mikrozanieczyszczeń i drobin (także mikroplastik).</li><li>Daje stałą jakość niezależnie od wahań wody w sieci.</li></ul><h3>Na co uważać?</h3><ul><li>Usuwa też minerały, dlatego często stosuje się <strong>mineralizator</strong>.</li><li>Część wody idzie do ścieku, potrzebne miejsce na zbiornik i serwis.</li><li>Szukaj certyfikatu skuteczności (np. NSF/ANSI 58).</li></ul>'
          },
          {
            id: 'caly-dom', type: 'urzadzenie', group: 'Rodzaje filtrów', icon: 'fa-home',
            title: 'Filtracja dla całego domu', sub: 'Filtr na wejściu instalacji i stacje uzdatniania.',
            body: '<h3>Jak działa?</h3><p>Montowana tuż za wodomierzem. Podstawą jest <strong>filtr mechaniczny</strong> zatrzymujący piasek i rdzę. Zależnie od wyników analizy wody dochodzą stacje: <strong>odżelaziacz</strong>, <strong>zmiękczacz</strong>, filtr węglowy.</p><h3>Co daje?</h3><ul><li>Chroni rury, bojler, pralkę i zmywarkę.</li><li>Lepsza woda w całym domu, także pod prysznicem.</li></ul><h3>Dla kogo?</h3><p>Domy jednorodzinne, szczególnie z własną studnią. Zawsze zacznij od badania wody i doboru przez fachowca.</p>'
          },
          {
            id: 'zmiekczacz', type: 'urzadzenie', group: 'Rodzaje filtrów', icon: 'fa-snowflake-o',
            title: 'Zmiękczacz wody', sub: 'Usuwa kamień: chroni instalację i urządzenia.',
            body: '<h3>Jak działa?</h3><p>Złoże jonowymienne zamienia jony wapnia i magnezu (odpowiedzialne za kamień) na jony sodu. Złoże regeneruje się solą tabletkowaną.</p><h3>Co daje, a czego nie?</h3><ul><li>✔ koniec z kamieniem na armaturze, w czajniku i pralce,</li><li>✖ <strong>nie oczyszcza</strong> wody z zanieczyszczeń chemicznych ani bakterii; to urządzenie do ochrony instalacji, nie filtr wody pitnej.</li></ul>'
          },
          {
            id: 'uv', type: 'urzadzenie', group: 'Rodzaje filtrów', icon: 'fa-sun-o',
            title: 'Lampa UV', sub: 'Unieszkodliwia bakterie i wirusy, bez chemii.',
            body: '<h3>Jak działa?</h3><p>Woda przepływa obok lampy emitującej promieniowanie UV-C, które uszkadza materiał genetyczny mikroorganizmów.</p><h3>Co daje, a czego nie?</h3><ul><li>✔ ochrona przed bakteriami i wirusami (np. przy studni),</li><li>✖ nie usuwa związków chemicznych, metali ani zawiesiny; przed lampą potrzebny filtr mechaniczny.</li></ul><h3>Eksploatacja</h3><p>Lampę wymienia się zwykle raz w roku, nawet jeśli nadal świeci.</p>'
          },
          {
            id: 'dystrybutory', type: 'urzadzenie', group: 'Rodzaje filtrów', icon: 'fa-building-o', todo: true,
            title: 'Systemy dla szkół i firm', sub: 'Dystrybutory podłączone do sieci i poidełka z filtracją.',
            body: '<p>Dystrybutory podłączone bezpośrednio do wodociągu filtrują (a często chłodzą) wodę na miejscu, więc nie trzeba wymieniać galonów ani kupować butelek. W szkołach mogą to być poidełka i punkty napełniania bidonów. Opiszemy rozwiązania i to, jak szkoła może je wprowadzić.</p>'
          },
          {
            id: 'oczyszczacz', type: 'urzadzenie', group: 'Powietrze i materiały', icon: 'fa-leaf', visual: crop.air,
            title: 'Oczyszczacz powietrza w pokoju dziecka', sub: 'Technologie filtracji ograniczające ilość pyłów i alergenów.',
            body: '<h3>Jak działa?</h3><p>Wentylator przeciąga powietrze przez filtry: wstępny, <strong>HEPA</strong> (zatrzymuje drobny pył, pyłki, sierść) i często węglowy (zapachy).</p><h3>Na co zwrócić uwagę?</h3><ul><li>Filtr <strong>HEPA klasy H13</strong> (norma EN 1822), a nie „typu HEPA”.</li><li>Współczynnik <strong>CADR</strong> dopasowany do metrażu pokoju.</li><li><strong>Głośność</strong> w trybie nocnym.</li><li><strong>Bez jonizatora i ozonowania</strong> w pokoju dziecka.</li><li>Koszt i dostępność filtrów zamiennych.</li></ul>'
          },
          {
            id: 'czujniki-powietrza', type: 'urzadzenie', group: 'Powietrze i materiały', icon: 'fa-tachometer',
            title: 'Czujniki jakości powietrza', sub: 'Kontrolowanie stężenia pyłów, dwutlenku węgla i wilgotności.',
            body: '<h3>Co mierzą?</h3><ul><li><strong>CO₂</strong>: wysoki poziom w zamkniętym pokoju oznacza, że czas wywietrzyć (duszność obniża koncentrację i jakość snu).</li><li><strong>PM2.5 / PM10</strong>: pył zawieszony, ważny zwłaszcza w sezonie grzewczym.</li><li>Temperatura i wilgotność.</li></ul><h3>Na co zwrócić uwagę?</h3><ul><li>CO₂ mierzony czujnikiem <strong>NDIR</strong>, a nie „eCO₂” szacowanym z innych gazów.</li><li>Czytelny wyświetlacz i alarm świetlny, które działają też bez aplikacji.</li></ul>'
          },
          {
            id: 'materialy', type: 'artykul', group: 'Powietrze i materiały', icon: 'fa-shield',
            title: 'Bezpieczniejsze materiały codziennego użytku', sub: 'Jak czytać oznaczenia i ograniczać kontakt z niepożądanymi substancjami.',
            body: '<p>Zamiast listy marek: przewodnik po oznaczeniach, które warto znać.</p><ul><li><strong>OEKO-TEX Standard 100</strong>: tekstylia przebadane pod kątem substancji szkodliwych.</li><li><strong>GOTS</strong>: tekstylia z włókien ekologicznych, z wymaganiami dla całego procesu produkcji.</li><li><strong>FSC</strong>: drewno i papier z odpowiedzialnie prowadzonych lasów.</li><li><strong>EU Ecolabel</strong>: unijne oznakowanie ekologiczne produktów.</li><li><strong>BPA free</strong>: tworzywo bez bisfenolu A (przy butelkach i pojemnikach lepiej jednak wybierać stal lub szkło).</li></ul>'
          }
        ]
      },

      /* ============ 4. ZABAWA ============ */
      {
        id: 'zabawa', no: 4, name: 'Zabawa i kreatywność', color: '#fb923c', icon: 'fa-rocket',
        motto: 'Od oglądania do tworzenia.',
        swap: { from: 'biernego oglądania', to: 'własne filmy i projekty' },
        intro: [
          'Technologia może być doskonałym narzędziem rozwijania zainteresowań. Dziecko nie musi być wyłącznie odbiorcą treści. Może samodzielnie tworzyć, eksperymentować i odkrywać zasady działania otaczającego je świata.',
          'Nowoczesne zestawy edukacyjne pozwalają łączyć zabawę z nauką programowania, elektroniki, mechaniki i projektowania.',
          'Warto wybierać rozwiązania, które zachęcają do działania i rozwijają samodzielne myślenie.'
        ],
        items: [
          { id: 'roboty', type: 'urzadzenie', group: 'Zestawy i urządzenia', icon: 'fa-cogs', todo: true, title: 'Roboty edukacyjne', sub: 'Nauka programowania poprzez budowanie i sterowanie robotami.', body: '<p>Roboty, które dziecko składa i programuje (od kolorowych klocków-poleceń dla najmłodszych po kod dla nastolatków), uczą myślenia krok po kroku, cierpliwości i pracy w grupie.</p>', brands: [{ name: 'Photon Education', country: 'Polska' }, { name: 'LEGO Education', country: 'Dania' }, { name: 'Makeblock', country: 'Chiny' }, { name: 'Sphero', country: 'USA' }] },
          { id: 'elektronika', type: 'urzadzenie', group: 'Zestawy i urządzenia', icon: 'fa-microchip', todo: true, title: 'Elektronika dla dzieci', sub: 'Zestawy do samodzielnego konstruowania prostych układów elektronicznych.', body: '<p>Zestawy z bezpiecznymi, niskonapięciowymi modułami: dziecko buduje obwody, czujniki i małe urządzenia, a przy okazji rozumie, jak działa technika wokół niego.</p>' },
          { id: 'druk-3d', type: 'urzadzenie', group: 'Zestawy i urządzenia', icon: 'fa-cube', todo: true, title: 'Druk 3D', sub: 'Projektowanie i tworzenie własnych przedmiotów.', body: '<p>Od pomysłu, przez projekt w prostym programie, do przedmiotu w ręku. Opiszemy bezpieczne korzystanie (wentylacja, temperatura), a także drukarki i długopisy 3D odpowiednie dla dzieci.</p>' },
          { id: 'animacja', type: 'urzadzenie', group: 'Zestawy i urządzenia', icon: 'fa-film', todo: true, title: 'Animacja poklatkowa', was: 'biernego oglądania', sub: 'Tworzenie własnych filmów zamiast biernego oglądania gotowych produkcji.', body: '<p>Telefon na statywie, aplikacja do animacji i figurki z klocków albo plasteliny wystarczą, żeby dziecko zamiast oglądać zaczęło tworzyć własne filmy.</p>' },
          { id: 'muzyka', type: 'urzadzenie', group: 'Zestawy i urządzenia', icon: 'fa-music', todo: true, title: 'Muzyka i dźwięk', sub: 'Elektroniczne instrumenty i urządzenia rozwijające zainteresowania muzyczne.', body: '<p>Klawisze, kontrolery i proste studia nagrań pozwalają komponować, nagrywać i eksperymentować z dźwiękiem.</p>' },
          { id: 'gry-logiczne', type: 'urzadzenie', group: 'Zestawy i urządzenia', icon: 'fa-puzzle-piece', todo: true, title: 'Gry edukacyjne i logiczne', sub: 'Interaktywna zabawa rozwijająca myślenie i umiejętność rozwiązywania problemów.', body: '<p>Łamigłówki, gry logiczne i zestawy łączące świat fizyczny z aplikacją, czyli zabawa, w której wygrywa myślenie, a nie refleks przed ekranem.</p>' }
        ]
      },

      /* ============ 5. SEN ============ */
      {
        id: 'sen', no: 5, name: 'Sen i odpoczynek', color: '#a78bfa', icon: 'fa-moon-o', visual: crop.lamp,
        motto: 'Technologie wspierające regenerację.',
        swap: { from: 'telefonu przy łóżku', to: 'budzik' },
        intro: [
          'Sen jest jednym z najważniejszych elementów prawidłowego rozwoju dziecka. Znaczenie ma nie tylko jego długość, ale również warunki, w jakich dziecko zasypia i odpoczywa.',
          'Nowoczesne urządzenia pozwalają lepiej dostosować oświetlenie, ograniczyć wieczorne korzystanie ze smartfonów i stworzyć spokojniejsze otoczenie sprzyjające regeneracji.'
        ],
        items: [
          { id: 'budzik', type: 'urzadzenie', group: 'Urządzenia', icon: 'fa-clock-o', visual: crop.lamp, title: 'Budzik', was: 'telefonu przy łóżku', sub: 'Oddzielenie funkcji budzenia od urządzenia służącego do komunikacji i rozrywki.', body: '<p class="wft-lead">Gdy telefon służy za budzik, ląduje przy łóżku, a z nim powiadomienia, wiadomości i „jeszcze jeden filmik”.</p><h3>Co daje osobny budzik?</h3><ul><li>Telefon może nocować poza sypialnią.</li><li><strong>Budziki ze światłem świtu</strong> stopniowo rozjaśniają pokój przed pobudką, co ułatwia wstawanie zimą.</li><li>Dla młodszych dzieci: budziki „pora wstawać”, które kolorem pokazują, kiedy można już wyjść z łóżka.</li></ul><h3>Na co zwrócić uwagę?</h3><ul><li>Wyświetlacz z możliwością całkowitego przyciemnienia w nocy.</li><li>Działanie bez aplikacji i konta.</li></ul>', todo: true },
          { id: 'oswietlenie', type: 'urzadzenie', group: 'Urządzenia', icon: 'fa-lightbulb-o', todo: true, title: 'Inteligentne oświetlenie', sub: 'Regulacja natężenia i temperatury barwowej światła w zależności od pory dnia.', body: '<p>Jasne, chłodniejsze światło w ciągu dnia, ciepłe i przygaszone wieczorem. Żarówki i lampy z regulacją barwy mogą zmieniać się automatycznie według pory dnia i pomagać wyciszyć się przed snem.</p>' },
          { id: 'audio', type: 'urzadzenie', group: 'Urządzenia', icon: 'fa-headphones', todo: true, title: 'Odtwarzacze dźwięków i audiobooków', sub: 'Alternatywa dla wieczornego oglądania filmów.', body: '<p>Odtwarzacze bez ekranu, sterowane figurkami lub kartami, pozwalają dziecku samodzielnie włączyć bajkę czy audiobook przed snem, bez sięgania po tablet.</p>' },
          { id: 'swiatlo-nocne', type: 'urzadzenie', group: 'Urządzenia', icon: 'fa-moon-o', todo: true, title: 'Światło nocne z regulacją jasności', sub: 'Rozwiązania pomagające dostosować oświetlenie do potrzeb dziecka.', body: '<p>Delikatne, ciepłe światło, które daje poczucie bezpieczeństwa i nie wybudza. Warto wybierać lampki z płynną regulacją jasności i barwą zbliżoną do pomarańczowej.</p>' }
        ]
      },

      /* ============ 6. OTOCZENIE ============ */
      {
        id: 'otoczenie', no: 6, name: 'Zdrowe otoczenie i codzienne nawyki', short: 'Zdrowe otoczenie', color: '#34d399', icon: 'fa-home', visual: crop.plant,
        motto: 'Lepsze warunki do dorastania zaczynają się w domu.',
        swap: { from: 'zgadywania', to: 'pomiar wilgotności i temperatury' },
        intro: [
          'Na zdrowie dziecka wpływają również warunki, w jakich spędza ono czas. Temperatura, wilgotność, oświetlenie i jakość powietrza mają znaczenie dla codziennego komfortu.',
          'Technologie dostępne na rynku pozwalają kontrolować te parametry i dostosowywać środowisko domowe do potrzeb mieszkańców.'
        ],
        items: [
          {
            id: 'wilgotnosc', type: 'urzadzenie', group: 'Urządzenia', icon: 'fa-tint', visual: crop.plant,
            title: 'Kontrola wilgotności powietrza', sub: 'Higrometry, nawilżacze i osuszacze.',
            body: '<p class="wft-lead">Za suche powietrze zimą wysusza śluzówki nosa i gardła, a za wilgotne sprzyja roztoczom i pleśni. Za komfortową uznaje się zwykle wilgotność ok. 40–60%.</p><h3>Higrometr: zacznij od pomiaru</h3><p>Mały i tani miernik wilgotności i temperatury. Dopiero gdy wiesz, ile wynosi wilgotność w pokoju dziecka, możesz zdecydować, czy potrzebujesz nawilżacza albo osuszacza.</p><h3>Nawilżacz: 3 rodzaje</h3><ul><li><strong>Ewaporacyjny</strong>: woda paruje z mokrego filtra; nie przesyca powietrza i nie tworzy białego pyłu.</li><li><strong>Ultradźwiękowy</strong>: cichy, tworzy chłodną mgiełkę; przy twardej wodzie może osadzać biały pył (lepiej woda zdemineralizowana).</li><li><strong>Parowy</strong>: podgrzewa wodę, więc jest higieniczny, ale zużywa więcej prądu, a gorąca para wymaga ostrożności przy dzieciach.</li></ul><p>Każdy nawilżacz trzeba <strong>regularnie myć</strong>, bo w stojącej wodzie rozwijają się drobnoustroje.</p><h3>Osuszacz</h3><p>Przydaje się w wilgotnych pomieszczeniach: łazience bez okna, przy suszeniu prania, w mieszkaniach z problemem zawilgocenia ścian.</p>',
            brands: [{ name: 'Boneco', country: 'Szwajcaria' }, { name: 'Stadler Form', country: 'Szwajcaria' }, { name: 'Philips', country: 'Holandia' }, { name: 'De’Longhi', country: 'Włochy' }, { name: 'Meaco', country: 'Wielka Brytania' }]
          },
          { id: 'termostaty', type: 'urzadzenie', group: 'Urządzenia', icon: 'fa-thermometer-half', todo: true, title: 'Inteligentne termostaty', sub: 'Utrzymywanie odpowiedniej temperatury w pomieszczeniach.', body: '<p>Głowice i termostaty, które same obniżają temperaturę w nocy i podnoszą ją przed pobudką. W chłodniejszej sypialni zwykle lepiej się śpi, a dom zużywa mniej energii.</p>' },
          { id: 'oswietlenie-aktywnosc', type: 'urzadzenie', group: 'Urządzenia', icon: 'fa-sun-o', todo: true, title: 'Oświetlenie dostosowane do aktywności', sub: 'Rozwiązania wspierające komfort podczas nauki, zabawy i odpoczynku.', body: '<p>Do nauki: lampa biurkowa z dobrym oddaniem barw, bez migotania, oświetlająca równomiernie cały blat. Do odpoczynku: ciepłe, rozproszone światło. Wyjaśnimy, co oznaczają luksy, CRI i temperatura barwowa.</p>' },
          { id: 'czujniki-domowe', type: 'urzadzenie', group: 'Urządzenia', icon: 'fa-signal', visual: crop.air, todo: true, title: 'Domowe czujniki środowiskowe', sub: 'Urządzenia pozwalające kontrolować wybrane parametry otoczenia.', body: '<p>Stacje mierzące jednocześnie temperaturę, wilgotność, CO₂ i hałas. Opiszemy, jak wybrać takie, które działają bez chmury i nie zbierają niepotrzebnie danych o domownikach.</p>' }
        ]
      },

      /* ============ 7. MOBILNOŚĆ ============ */
      {
        id: 'mobilnosc', no: 7, name: 'Mobilność i bezpieczeństwo', color: '#f87171', icon: 'fa-car',
        visual: AUTA_ZGODA ? { img: auto('ligier-js50.webp'), pos: '50% 55%', size: 'cover', photo: true } : null,
        motto: 'Nowoczesne rozwiązania transportowe dla młodych ludzi.',
        swap: { from: 'podwożenia wszędzie', to: 'samodzielność od 14 lat?' },
        intro: [
          'Rozwój technologii motoryzacyjnych sprawił, że na rynku dostępne są niewielkie pojazdy, którymi, przy spełnieniu określonych wymagań prawnych, mogą poruszać się również osoby niepełnoletnie.',
          'W Polsce prawo jazdy kategorii AM można uzyskać już w wieku 14 lat. Uprawnia ono między innymi do kierowania czterokołowcami lekkimi. To niewielkie pojazdy, często przypominające klasyczne samochody, z zamkniętą kabiną chroniącą przed warunkami atmosferycznymi.',
          'Chcemy przybliżać rodzicom dostępne rozwiązania, przedstawiać ich możliwości oraz informować o obowiązujących przepisach.'
        ],
        introExtra: NIE_NAMAWIAMY,
        items: [
          {
            id: 'prawo-jazdy-am', type: 'artykul', group: 'Poradniki', icon: 'fa-id-card-o',
            title: 'Jak zdobyć prawo jazdy AM od 14 lat?', sub: 'Wymagania, kurs, egzamin i koszty, krok po kroku.',
            body:
              NIE_NAMAWIAMY +
              '<h3>Co daje kategoria AM?</h3><ul><li><strong>Motorower</strong>: silnik do 50 cm³ lub elektryczny do 4 kW, prędkość konstrukcyjna do 45 km/h.</li><li><strong>Czterokołowiec lekki</strong> (homologacja <strong>L6e</strong>, potocznie „mikrosamochód”): prędkość konstrukcyjna do <strong>45 km/h</strong>.</li><li>Nie uprawnia do kierowania samochodem osobowym ani szybszymi czterokołowcami (L7e).</li></ul>' +
              '<h3>Wymagania</h3><ul><li>Ukończone <strong>14 lat</strong>. Kurs można zacząć 3 miesiące wcześniej.</li><li><strong>Pisemna zgoda rodzica lub opiekuna</strong> (do 18. roku życia).</li><li><strong>Orzeczenie lekarskie</strong> o braku przeciwwskazań do kierowania pojazdami.</li></ul>' +
              '<h3>Krok po kroku</h3><ol class="wft-steps"><li><b>Badanie lekarskie</b> u lekarza uprawnionego do badania kierowców.</li><li><b>Zgoda rodzica</b> na piśmie.</li><li><b>Profil Kandydata na Kierowcę (PKK)</b>: wniosek, zdjęcie, orzeczenie i zgoda w wydziale komunikacji starostwa lub urzędu miasta. Urząd nadaje numer PKK.</li><li><b>Kurs w ośrodku szkolenia kierowców</b>: przepisowe minimum to 5 godz. teorii (+1 godz. pierwszej pomocy) i 5 godz. jazd. Ośrodek może dać więcej, ale nie mniej.</li><li><b>Egzamin wewnętrzny</b> w ośrodku szkolenia.</li><li><b>Egzamin państwowy teoretyczny</b> w WORD.</li><li><b>Egzamin państwowy praktyczny</b> w WORD.</li><li><b>Odbiór prawa jazdy</b> w urzędzie.</li></ol>' +
              '<h3>Jak wygląda egzamin?</h3><div class="wft-two"><div class="wft-box"><p class="wft-box__t">Teoria</p><ul><li>32 pytania, 25 minut</li><li>do zdania: 68 z 74 punktów</li><li>pytania z ogólnodostępnej bazy, więc można ćwiczyć</li></ul></div><div class="wft-box"><p class="wft-box__t">Praktyka</p><ul><li>motorowerem albo czterokołowcem lekkim</li><li>plac manewrowy: m.in. „ósemka”, slalom, ominięcie przeszkody, hamowanie</li><li>potem jazda w ruchu drogowym</li></ul></div></div>' +
              '<h3>Ile to kosztuje? <small>(orientacyjnie, listopad 2026)</small></h3><table class="wft-table"><tbody><tr><td>Badanie lekarskie</td><td>ok. 200 zł</td></tr><tr><td>Kurs AM w ośrodku szkolenia</td><td>ok. 1 000–3 000 zł</td></tr><tr><td>Egzamin teoretyczny (WORD)</td><td>ok. 50–57 zł</td></tr><tr><td>Egzamin praktyczny (WORD)</td><td>ok. 220–230 zł <small>za każde podejście</small></td></tr><tr><td>Wydanie prawa jazdy</td><td>100,50 zł</td></tr><tr class="is-sum"><td>Razem</td><td>ok. 1 600–3 600 zł</td></tr></tbody></table><p class="wft-small">Opłaty za egzamin ustala sejmik województwa, więc mogą się różnić w zależności od WORD. Ceny kursów zależą od miasta i od tego, czy jazdy odbywają się motorowerem, czy czterokołowcem. Do kosztów pojazdu dochodzą obowiązkowe ubezpieczenie OC, rejestracja i okresowe badania techniczne.</p>' +
              '<h3>Lista dla rodzica</h3><ul class="wft-check"><li>Czy dziecko jest dojrzałe do samodzielnego uczestnictwa w ruchu: przewidywanie, emocje, odporność na presję kolegów?</li><li>Czy zna i stosuje przepisy jako pieszy i rowerzysta?</li><li>Czy konkretny pojazd ma homologację <strong>L6e</strong> (dowód rejestracyjny)? Te same modele bywają w wersji L7e, której z kat. AM prowadzić nie wolno.</li><li>Jakie wyposażenie bezpieczeństwa ma pojazd?</li><li>Wspólne zasady: trasy, pora dnia, pasażerowie, telefon.</li></ul>' +
              '<div class="wft-src"><p>Źródła</p><ol><li><a href="https://www.gov.pl/web/infrastruktura/kategorie-prawa-jazdy" target="_blank" rel="noopener">Ministerstwo Infrastruktury: kategorie prawa jazdy</a></li><li><a href="https://isap.sejm.gov.pl/isap.nsf/download.xsp/WDU20250001226/O/D20251226.pdf" target="_blank" rel="noopener">Ustawa o kierujących pojazdami (Dz.U. 2025 poz. 1226)</a></li><li><a href="https://isap.sejm.gov.pl/isap.nsf/download.xsp/WDU20160000280/O/D20160280.pdf" target="_blank" rel="noopener">Rozporządzenie w sprawie szkolenia (Dz.U. 2016 poz. 280)</a></li><li><a href="https://word.waw.pl/images/Alternatywny_dostep/Egzaminy/Kategorie_prawa_jazdy/AM/20200821_Kategoria_AM.pdf" target="_blank" rel="noopener">WORD Warszawa: kategoria AM</a></li></ol></div>'
          },
          {
            id: 'bezpieczenstwo', type: 'artykul', group: 'Poradniki', icon: 'fa-shield',
            title: 'Bezpieczeństwo młodych kierowców', sub: 'Jak ocenić bezpieczeństwo pojazdu i dlaczego dojrzałość kierowcy ma takie znaczenie.',
            body:
              '<h3><span>1</span>Problem</h3><p>Mikrosamochód wygląda jak mały samochód, więc łatwo założyć, że chroni jak samochód. Tymczasem czterokołowce mają <strong>znacznie łagodniejsze wymagania</strong> niż samochody osobowe i nie przechodzą takich samych testów zderzeniowych.</p>' +
              '<h3><span>2</span>Co mówią badania?</h3><p>Niezależna organizacja <strong>Euro NCAP</strong> testowała czterokołowce w 2014 i 2016 r. Wyniki były słabe: w 2016 r. Chatenet CH30 dostał 2 gwiazdki, a Aixam Crossover GTR, Microcar M.Go Family i Bajaj Qute po 1 gwiazdce. W jednym z pojazdów głowa manekina mocno uderzała w kierownicę, w innym opcjonalna poduszka powietrzna okazała się nieskuteczna.<a class="wft-cite" href="#zr-ncap-1">[1]</a><a class="wft-cite" href="#zr-ncap-2">[2]</a></p>' +
              '<div class="wft-note"><p><strong>Precyzyjnie:</strong> testowano czterokołowce <strong>ciężkie (L7e)</strong>, a nie lekkie L6e prowadzone z kat. AM. Gwiazdek czterokołowców nie wolno porównywać z gwiazdkami samochodów osobowych, bo obowiązywał osobny, łagodniejszy protokół. Euro NCAP zwrócił uwagę, że pod względem ochrony mały używany samochód jest zwykle bezpieczniejszy, ale samochód osobowy można prowadzić dopiero od 17 lat.</p></div>' +
              '<h3><span>3</span>Na co zwrócić uwagę przy wyborze pojazdu?</h3><ul class="wft-check"><li>hamulce tarczowe i ABS, jeśli dostępny,</li><li>pasy z napinaczami, poduszka powietrzna,</li><li>światła dzienne LED, dobre lusterka, kamera lub czujniki cofania,</li><li>konstrukcja nadwozia i ochrona boczna,</li><li>serwis marki w Polsce i niezawodność.</li></ul>' +
              '<h3><span>4</span>Dojrzałość kierowcy ma znaczenie</h3><p>Pojazd to tylko połowa bezpieczeństwa. Młodzi kierowcy częściej przeceniają swoje umiejętności, ulegają presji rówieśników i rozpraszają się telefonem. Mikrosamochód jedzie maksymalnie 45 km/h, więc inni kierowcy często go wyprzedzają, a to wymaga spokoju i przewidywania. Porozmawiajcie przed decyzją: czy dziecko potrafi odmówić kolegom, odłożyć telefon i trzymać się wspólnych zasad?</p>' +
              '<div class="wft-src"><p>Źródła</p><ol><li id="zr-ncap-1"><a href="https://www.euroncap.com/nl/pers/persberichten/quadricycle-safety-at-a-standstill" target="_blank" rel="noopener">Euro NCAP: Quadricycle Safety at a Standstill (2016)</a></li><li id="zr-ncap-2"><a href="https://www.euroncap.com/nl/pers/persberichten/euro-ncap-s-spotlight-falls-on-heavy-quadricycles" target="_blank" rel="noopener">Euro NCAP: Spotlight Falls on Heavy Quadricycles (2014)</a></li></ol></div>'
          },
          {
            id: 'kategorie', type: 'artykul', group: 'Poradniki', icon: 'fa-road',
            title: 'Prawo jazdy AM, B1 i B: czym się różnią?', sub: 'Wiek, uprawnienia i rodzaje pojazdów w jednym miejscu.',
            body:
              '<div class="wft-age"><div><b>14</b><span>AM</span></div><div><b>16</b><span>B1</span></div><div><b>17</b><span>B z opiekunem</span></div><div><b>18</b><span>B</span></div></div>' +
              '<table class="wft-table wft-table--cols"><thead><tr><th>Kategoria</th><th>Od ilu lat</th><th>Czym można kierować</th></tr></thead><tbody>' +
              '<tr><td><b>AM</b></td><td>14</td><td>motorower i czterokołowiec lekki L6e (do 45 km/h); do 18 lat potrzebna zgoda rodzica</td></tr>' +
              '<tr><td><b>B1</b></td><td>16</td><td>czterokołowiec inny niż lekki (np. szybsze mikrosamochody L7e)</td></tr>' +
              '<tr><td><b>B</b></td><td>17</td><td>samochód osobowy (od 3 marca 2026 r.): do 18. urodzin <strong>tylko z osobą towarzyszącą</strong> spełniającą wymagania ustawy i tylko w Polsce; okres próbny 3 lata (nie dłużej niż do 20. roku życia)</td></tr>' +
              '<tr><td><b>B</b></td><td>18</td><td>samochód osobowy, okres próbny 2 lata</td></tr></tbody></table>' +
              '<div class="wft-src"><p>Źródła</p><ol><li><a href="https://www.gov.pl/web/infrastruktura/kategorie-prawa-jazdy" target="_blank" rel="noopener">Ministerstwo Infrastruktury: kategorie prawa jazdy</a></li><li><a href="https://www.gazetaprawna.pl/urzad/samorzad-terytorialny/artykuly/11048241,prawo-jazdy-b-od-17-lat-w-2026-r.html" target="_blank" rel="noopener">Gazeta Prawna: prawo jazdy B od 17 lat</a></li></ol></div>'
          },
          {
            id: 'aixam-city', type: 'urzadzenie', group: 'Pojazdy na kat. AM', photo: auto('aixam-city.webp'), icon: 'fa-car',
            title: 'Aixam City', sub: 'Elektryczny lub diesel · 45 km/h · 2 miejsca · Francja',
            specs: [['Uprawnienia', 'kat. AM od 14 lat (wersja L6e)'], ['Napęd', 'elektryczny 6 kW (e-City) lub diesel ok. 480 cm³'], ['Akumulator / zasięg', '5 kWh – ok. 75 km · 7,5 kWh – do ok. 113 km (dane producenta)'], ['Prędkość maks.', '45 km/h'], ['Skrzynia', 'automatyczna'], ['Miejsca', '2']],
            body: '<p>Aixam to francuski producent, jeden z największych w Europie wśród czterokołowców lekkich. City to jego podstawowy, miejski model.</p><h3>Na co zwrócić uwagę?</h3><ul><li>Zimą realny zasięg wersji elektrycznej jest krótszy niż katalogowy.</li><li>Sprawdź wyposażenie bezpieczeństwa konkretnej wersji (hamulce, ABS, poduszka) i homologację w dowodzie.</li></ul>',
            link: 'https://www.aixam.com'
          },
          {
            id: 'ligier-js50', type: 'urzadzenie', group: 'Pojazdy na kat. AM', photo: auto('ligier-js50.webp'), icon: 'fa-car',
            title: 'Ligier JS50', sub: 'Elektryczny lub diesel · 45 km/h · 2 miejsca · Francja',
            specs: [['Uprawnienia', 'kat. AM od 14 lat (wersja L6e; odmiana L7e wymaga B1)'], ['Diesel', 'REVO D+ 499,8 cm³, 6 kW, Euro 5+, ok. 3,0 l/100 km'], ['Elektryczny', 'ok. 5,6 kW; 8,28 kWh – do ok. 123 km · 12,42 kWh – do ok. 192 km'], ['Gama 2026', 'bateria 11 kWh LFP – do ok. 164 km (WMTC), 5 lat gwarancji'], ['Prędkość maks.', '45 km/h'], ['Miejsca', '2']],
            body: '<p>Druga generacja JS50 (od 2024/2025) od francuskiej grupy Ligier, do której należy też marka Microcar. Dostępna w kilku wersjach wyposażenia.</p><h3>Na co zwrócić uwagę?</h3><ul><li>Zasięgi podawane w różnych cyklach pomiarowych nie są ze sobą porównywalne.</li><li>Upewnij się, że kupujesz wersję <strong>L6e</strong>, a nie szybszą L7e.</li></ul>',
            link: 'https://www.ligier.fr'
          },
          {
            id: 'microcar-mgo', type: 'urzadzenie', group: 'Pojazdy na kat. AM', photo: auto('microcar-mgo.webp'), icon: 'fa-car',
            title: 'Microcar M.Go', sub: 'Diesel · 45 km/h · 2 miejsca · Francja',
            specs: [['Uprawnienia', 'kat. AM od 14 lat (wersja L6e)'], ['Napęd', 'diesel ok. 480 cm³, 6 kW (8 KM), automat CVT, napęd przedni'], ['Zużycie', 'ok. 3,6 l/100 km, zbiornik 16 l'], ['Wymiary', 'ok. 3,0 × 1,5 × 1,5 m, masa od ok. 345 kg'], ['Prędkość maks.', '45 km/h'], ['Miejsca', '2']],
            body: '<p>Model marki Microcar z grupy Ligier. W teście Euro NCAP z 2016 r. badano cięższą wersję M.Go Family (czterokołowiec ciężki). Dostała 1 gwiazdkę, a opcjonalna poduszka kierowcy okazała się w teście nieskuteczna (zob. „Bezpieczeństwo młodych kierowców”).</p>',
            link: 'https://www.microcar.fr'
          },
          {
            id: 'chatenet-ch46', type: 'urzadzenie', group: 'Pojazdy na kat. AM', icon: 'fa-car',
            title: 'Chatenet CH46', sub: 'Diesel · 45 km/h · 2 miejsca · Francja',
            specs: [['Uprawnienia', 'kat. AM od 14 lat (wersja L6e)'], ['Napęd', 'diesel 2-cylindrowy ok. 478 cm³, ok. 6 kW, automat'], ['Norma spalin', 'Euro 5'], ['Prędkość maks.', '45 km/h'], ['Miejsca', '2']],
            body: '<p>Sportowo stylizowany model francuskiej marki Chatenet (odmiany m.in. Erre Erre i Sport R). W teście Euro NCAP z 2016 r. inny model tej marki, CH30 w wersji ciężkiej, uzyskał najlepszy wynik w tamtej serii: 2 gwiazdki.</p>',
            link: 'https://www.chatenet.com'
          }
        ]
      }
    ]
  };
})();
