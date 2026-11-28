/* Program „Technologia dla zdrowia” — treść modułów, tematów i urządzeń (2026-11-27).
   Jedno miejsce na treść: strona (js/technologia.js) buduje z tego kafelki modułów i okna.
   Typy pozycji: "artykul" (poradnik / wyjaśnienie) i "urzadzenie" (rodzaj urządzenia, pojazd).
   Pole todo:true = opis skrócony, pełny artykuł (badania, producenci) w przygotowaniu.
   Materiały robocze i źródła: 1. FUNDACJA\Programy\Technologia dla zdrowia\ (plan + research). */
window.WFT_DATA = (function () {
  'use strict';
  var IMG = '../images/banery/technologia-zdrowie.webp?v=3';
  // Zdjęcia aut (images/technologia/auta) to zdjęcia producentów — włączyć (true) dopiero po uzyskaniu zgody / press kit.
  var AUTA_ZGODA = true;   // Adam 28.11.2026: używamy zdjęć producentów (promocja produktów); usuniemy na prośbę producenta
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
            // Wyróżniony model (Adam 28.11.2026): najnowszy BOOX — tablet E Ink z Androidem, polecany studentom
            id: 'boox-note-air6c', type: 'urzadzenie', group: 'Urządzenia', badge: 'Polecamy dla studentów',
            photo: '../images/technologia/producenci/boox/boox-note-air6c.webp',
            title: 'BOOX Note Air6 C', sub: 'Kolorowy tablet E Ink 10,3″ z Androidem 16 i sklepem Google Play: notatki, PDF-y, podręczniki i aplikacje do nauki w jednym.',
            specs: [['Ekran', '10,3″ kolorowy E Ink (Kaleido 3)'], ['System', 'Android 16 z Google Play'], ['Procesor', '8-rdzeniowy, 4 nm, do 2,9 GHz'], ['Pamięć', '6 GB RAM, 64 GB + karta microSD (do 2 TB)'], ['Bateria', '3150 mAh'], ['Rysik', 'technologia EMR (bez baterii)'], ['Premiera', 'wrzesień 2026']],
            body:
              '<p class="wft-lead">Najnowszy notatnik E Ink firmy Onyx (BOOX). Łączy ekran przypominający papier z pełnym Androidem, dlatego jest jednym z najwszechstronniejszych tabletów E Ink dla uczniów szkół średnich i studentów.</p>' +
              '<h3>Dlaczego go wyróżniamy?</h3><ul>' +
              '<li><strong>Android i Google Play</strong>: można zainstalować aplikacje potrzebne do nauki, np. czytniki PDF, Dysk Google, słowniki, fiszki, aplikacje uczelni i e-podręczniki. Zamknięte notatniki E Ink tego nie potrafią.</li>' +
              '<li><strong>Odręczne notatki rysikiem EMR</strong>: pisze się jak w zeszycie, z dopiskami bezpośrednio na PDF-ach.</li>' +
              '<li><strong>Kolor</strong>: wykresy, schematy i zakreślenia w kolorze, co przydaje się w biologii, chemii czy geografii.</li>' +
              '<li><strong>Karta microSD</strong>: cała biblioteka materiałów na jednym urządzeniu.</li>' +
              '<li>Opcjonalna <strong>klawiatura w etui</strong> do pisania dłuższych tekstów.</li></ul>' +
              '<h3>Uczciwie: na co uważać?</h3><ul>' +
              '<li>Android to też dostęp do rozpraszaczy (media społecznościowe, filmy). Dla młodszych dzieci lepszy jest system zamknięty albo kontrola rodzicielska, a dla studentów wystarczy samodyscyplina i prosty ekran główny.</li>' +
              '<li>Kolorowy E Ink jest ciemniejszy od czarno-białego, a kolory są przygaszone. Recenzenci radzą zwiększać jasność w pomieszczeniach. Do samego czytania tekstu ostrzejszy będzie model czarno-biały (zob. Go 10.3 Gen II).</li></ul>',
            link: 'https://shop.boox.com/products/noteair6c',
            credit: 'Zdjęcie: materiały producenta (BOOX)'
          },
          {
            id: 'boox-go103', type: 'urzadzenie', group: 'Urządzenia',
            photo: '../images/technologia/producenci/boox/boox-go103-gen2.webp',
            title: 'BOOX Go 10.3 (Gen II)', sub: 'Lekki, cienki, czarno-biały tablet E Ink z Androidem 15: najostrzejszy tekst do czytania i notatek.',
            specs: [['Ekran', '10,3″ czarno-biały E Ink'], ['System', 'Android 15 z Google Play'], ['Pamięć', '4 GB RAM, 64 GB'], ['Wersje', 'Lumi z podświetleniem (regulowana barwa) i Standard bez podświetlenia'], ['Rysik', 'pojemnościowy'], ['Premiera', 'marzec 2026']],
            body:
              '<p class="wft-lead">Czarno-biała alternatywa dla Note Air6 C: bardzo cienka i lekka, z ostrzejszym tekstem niż ekrany kolorowe.</p>' +
              '<h3>Dla kogo?</h3><ul><li>Dla osób, które głównie <strong>czytają i notują</strong> i nie potrzebują koloru.</li><li>Wersja <strong>Standard bez podświetlenia</strong> działa jak kartka papieru i korzysta tylko ze światła w pokoju. Wersja <strong>Lumi</strong> ma podświetlenie z ciepłą barwą na wieczór.</li></ul>' +
              '<h3>Na co uważać?</h3><ul><li>Tak jak w każdym tablecie z Androidem: warto ograniczyć aplikacje rozpraszające.</li></ul>',
            link: 'https://shop.boox.com/products/go103gen2',
            credit: 'Zdjęcie: materiały producenta (BOOX)'
          },
          {
            id: 'remarkable-paper-pro', type: 'urzadzenie', group: 'Urządzenia',
            photo: '../images/technologia/producenci/remarkable/remarkable-paper-pro.webp',
            title: 'reMarkable Paper Pro', sub: 'Duży kolorowy notatnik E Ink z Norwegii, zaprojektowany tylko do pisania, czytania i porządkowania notatek.',
            specs: [['Ekran', '11,8″ kolorowy Canvas Color (E Ink Gallery 3), regulowane podświetlenie'], ['System', 'zamknięty reMarkable OS, bez sklepu z aplikacjami'], ['Pamięć', '64 GB'], ['Waga', 'ok. 525 g'], ['Bateria', 'do ok. 2 tygodni (wg producenta)']],
            body:
              '<p class="wft-lead">Notatnik dla osób, które chcą pisać odręcznie i czytać dokumenty bez rozpraszaczy: nie ma tu przeglądarki z mediami społecznościowymi ani sklepu z aplikacjami.</p>' +
              '<h3>Dla kogo / co daje?</h3><ul><li>Dla uczniów starszych klas i studentów, którzy dużo <strong>notują i dopisują uwagi do PDF-ów</strong>.</li><li>Duży ekran wygodny do materiałów w formacie A4.</li><li>Kolor do zakreśleń i schematów, podświetlenie do pracy wieczorem.</li></ul>' +
              '<h3>Na co uważać?</h3><ul><li>Część funkcji chmurowych wymaga płatnej subskrypcji Connect.</li><li>Brak gniazda karty pamięci i aplikacji (zaleta dla skupienia, wada, gdy potrzebny jest np. e-podręcznik w aplikacji).</li><li>Recenzenci zwracają uwagę, że ekran kolorowy odświeża się wolniej przy otwieraniu dokumentów i przewracaniu stron.</li></ul>',
            link: 'https://remarkable.com/products/remarkable-paper/pro',
            credit: 'Zdjęcie: materiały producenta (reMarkable)'
          },
          {
            id: 'supernote-manta', type: 'urzadzenie', group: 'Urządzenia',
            photo: '../images/technologia/producenci/supernote/supernote-manta.webp',
            title: 'Supernote Manta', sub: 'Czarno-biały notatnik E Ink nastawiony na samo pisanie, ceniony za odczucie pisania podobne do papieru.',
            specs: [['Ekran', '10,7″ czarno-biały E Ink Carta 1300, 300 PPI, bez podświetlenia'], ['System', 'zamknięty Supernote OS, bez sklepu z aplikacjami'], ['Waga', 'ok. 375 g'], ['Bateria', '3600 mAh, wymienna (konstrukcja modułowa)']],
            body:
              '<p class="wft-lead">Prosty, skupiony notatnik: piszesz, porządkujesz notatki i czytasz dokumenty. Bez aplikacji, które odciągają od nauki.</p>' +
              '<h3>Dla kogo / co daje?</h3><ul><li>Dla osób, które chcą zastąpić zeszyty i kołonotatniki jednym lekkim urządzeniem.</li><li>Ostry tekst czarno-białego ekranu, dobry do czytania PDF-ów.</li><li>Producent udostępnia instrukcje naprawy, a baterię można wymienić, więc urządzenie może służyć dłużej.</li></ul>' +
              '<h3>Na co uważać?</h3><ul><li>Brak podświetlenia: potrzebne jest dobre światło w pokoju (tak jak przy zeszycie).</li><li>Rysik kupuje się osobno.</li><li>Brak koloru i aplikacji.</li></ul>',
            link: 'https://supernote.com/products/supernote-manta',
            credit: 'Zdjęcie: materiały producenta (Supernote)'
          },
          {
            id: 'pocketbook-inkpad-eo2', type: 'urzadzenie', group: 'Urządzenia',
            photo: '../images/technologia/producenci/pocketbook/pocketbook-inkpad-eo-2.webp',
            title: 'PocketBook InkPad Eo 2', sub: 'Kolorowy notatnik E Ink 10,3″ z Androidem 14, rysikiem w zestawie i rozpoznawaniem pisma odręcznego.',
            specs: [['Ekran', '10,3″ kolorowy E Ink Kaleido 3 (300 DPI czarno-białe, 150 DPI kolor)'], ['System', 'Android 14 z Google Play'], ['Pamięć', '4 GB RAM, 64 GB + karta microSD'], ['Rysik', 'PocketBook Stylus 2 w zestawie'], ['Bateria / waga', '4900 mAh / 470 g']],
            body:
              '<p class="wft-lead">Najnowszy notatnik szwajcarskiej marki PocketBook: duży kolorowy ekran, aktywny rysik i rozpoznawanie pisma, które zamienia odręczne notatki na tekst.</p>' +
              '<h3>Dla kogo / co daje?</h3><ul><li>Dla uczniów i studentów, którzy chcą <strong>notować i czytać</strong> na jednym urządzeniu oraz korzystać z aplikacji do nauki.</li><li>Rysik w zestawie, karta microSD na materiały, czytanie na głos (text-to-speech).</li><li>Regulacja jasności i barwy podświetlenia (SMARTlight).</li></ul>' +
              '<h3>Na co uważać?</h3><ul><li>Android to także dostęp do rozpraszających aplikacji, więc przyda się prosty ekran główny albo kontrola rodzicielska.</li><li>Kolorowy E Ink jest mniej kontrastowy niż czarno-biały.</li><li>Na razie mało niezależnych, szczegółowych recenzji.</li></ul>',
            link: 'https://pocketbook.ch/en-ch/catalog/e-notes/pocketbook-inkpad-eo-2-ch',
            credit: 'Zdjęcie: materiały producenta (PocketBook)'
          },
          {
            id: 'kobo-libra-colour', type: 'urzadzenie', group: 'Urządzenia',
            photo: '../images/technologia/producenci/kobo/kobo-libra-colour.webp',
            title: 'Kobo Libra Colour', sub: 'Poręczny, wodoodporny czytnik 7″ z kolorowym ekranem, przyciskami do zmiany stron i opcją notatek rysikiem.',
            specs: [['Ekran', '7″ kolorowy E Ink Kaleido 3 (300 PPI czarno-białe, 150 PPI kolor)'], ['Wodoodporność', 'IPX8 (do 2 m przez 60 min)'], ['Pamięć', '32 GB'], ['Rysik', 'Kobo Stylus 2, sprzedawany osobno']],
            body:
              '<p class="wft-lead">Przede wszystkim czytnik książek: lekki, do torby i do czytania lektur, z możliwością robienia notatek i zakreśleń.</p>' +
              '<h3>Dla kogo / co daje?</h3><ul><li>Dla dzieci i młodzieży, które dużo <strong>czytają</strong>: lektury, książki, komiksy w kolorze.</li><li>Fizyczne przyciski do przewracania stron i odporność na wodę (czytanie w wannie czy na plaży).</li><li>Zamknięty system bez gier i mediów społecznościowych.</li></ul>' +
              '<h3>Na co uważać?</h3><ul><li>Ekran 7″ jest za mały do wygodnej pracy z podręcznikami PDF w formacie A4.</li><li>Rysik trzeba dokupić.</li><li>Część użytkowników zgłasza, że baterię trzeba ładować co tydzień–dwa.</li></ul>',
            link: 'https://ereader.kobo.com/pl-pl/products/kobo-libra-colour',
            credit: 'Zdjęcie: materiały producenta (Kobo)'
          },
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
            id: 'mudita-kompakt', type: 'urzadzenie', group: 'Urządzenia',
            photo: '../images/technologia/producenci/mudita/mudita-kompakt.webp',
            title: 'Mudita Kompakt', sub: 'Minimalistyczny telefon E Ink polskiej firmy Mudita: rozmowy, wiadomości, mapy i podstawowe narzędzia bez mediów społecznościowych.',
            specs: [['Ekran', '4,3″ czarno-biały E Ink (800×480)'], ['System', 'MuditaOS K (bez usług Google), aplikacje z katalogu InkApps'], ['Bateria', '3300 mAh, do 6 dni (wg producenta), ładowanie bezprzewodowe'], ['Offline+', 'przełącznik odcinający sieć komórkową i mikrofony'], ['Waga', 'ok. 164 g']],
            body:
              '<p class="wft-lead">Telefon zaprojektowany w Polsce z myślą o spokoju i prywatności. Ma to, co potrzebne na co dzień, a resztę dodaje się tylko wtedy, gdy naprawdę jest potrzebna.</p>' +
              '<h3>Dla kogo / co daje?</h3><ul><li>Dla nastolatków i dorosłych, którzy chcą <strong>zostać w kontakcie</strong>, ale ograniczyć czas przed ekranem.</li><li>Matowy ekran E Ink czytelny w pełnym słońcu, możliwość czytania e-booków.</li><li>Przełącznik <strong>Offline+</strong> na boku: jednym ruchem odcina sieć komórkową i mikrofony, np. na czas nauki lub snu.</li><li>Prosty ekran z wyborem aplikacji, foldery chronione kodem PIN.</li></ul>' +
              '<h3>Na co uważać?</h3><ul><li>Brak sklepu Google Play: przed zakupem sprawdź, czy działają aplikacje potrzebne dziecku (np. dziennik elektroniczny, bilety, bank).</li><li>Mały, czarno-biały ekran i prosty aparat nie zastąpią smartfona do zdjęć.</li></ul>',
            link: 'https://mudita.com/pl/products/phones/mudita-kompakt/',
            credit: 'Zdjęcie: materiały producenta (Mudita)'
          },
          {
            id: 'bigme-hibreak-pro-color', type: 'urzadzenie', group: 'Urządzenia',
            photo: '../images/technologia/producenci/bigme/bigme-hibreak-pro-color.webp',
            title: 'Bigme HiBreak Pro Color', sub: 'Pełny smartfon z Androidem 14 i kolorowym ekranem E Ink: wszystkie aplikacje, ale ekran, który nie zachęca do przewijania.',
            specs: [['Ekran', '6,13″ kolorowy E Ink Kaleido 3 (300 PPI czarno-białe, 150 PPI kolor)'], ['System', 'Android 14, instalacja dowolnych aplikacji'], ['Pamięć', '8 GB RAM, 256 GB'], ['Bateria', '4500 mAh, ładowanie 18 W'], ['Łączność', '5G, dwie karty SIM, NFC']],
            body:
              '<p class="wft-lead">Dla osób, które potrzebują pełnego smartfona (bankowość, bilety, komunikatory, nawigacja), ale chcą ekranu przypominającego papier.</p>' +
              '<h3>Dla kogo / co daje?</h3><ul><li>Dla starszej młodzieży i dorosłych, którym aplikacje są niezbędne do szkoły i pracy.</li><li>Ekran E Ink: filmy i gry tracą atrakcyjność, a czytanie, wiadomości i mapy działają.</li><li>Wydajny procesor i duża pamięć, aparat 20 MP ze skanowaniem dokumentów.</li></ul>' +
              '<h3>Na co uważać?</h3><ul><li>Pełny Android oznacza też dostęp do mediów społecznościowych: sam ekran nie zastąpi ustawień i zasad korzystania.</li><li>Producent nie zadeklarował, jak długo będzie wydawał aktualizacje systemu.</li><li>Sprzedaż głównie przez sklep internetowy producenta: przed zakupem sprawdź warunki gwarancji i serwisu.</li></ul>',
            link: 'https://bigmestore.com/products/android-14-hibreak-pro-color-6-e-ink-eye-friendly-smartphone-with-4g-5g-connection',
            credit: 'Zdjęcie: materiały producenta (Bigme)'
          },
          {
            id: 'hisense-a9', type: 'urzadzenie', group: 'Urządzenia',
            title: 'Hisense A9', sub: 'Jeden z najbardziej znanych smartfonów E Ink: duży czarno-biały ekran z podświetleniem i Android.',
            specs: [['Ekran', '6,1″ czarno-biały E Ink Carta 1200 (824×1648, 300 PPI), podświetlenie'], ['System', 'Android 11'], ['Procesor', 'Snapdragon 662']],
            body:
              '<p class="wft-lead">Smartfon z ekranem E Ink, ceniony za ostry tekst i długie działanie na baterii. Dobrze sprawdza się do wiadomości, czytania i map.</p>' +
              '<h3>Dla kogo / co daje?</h3><ul><li>Dla osób, które chcą smartfona z aplikacjami, ale z ekranem przyjaznym do czytania.</li><li>Czarno-biały ekran ma ostrzejszy tekst niż ekrany kolorowe E Ink.</li></ul>' +
              '<h3>Na co uważać?</h3><ul><li>Telefon jest oficjalnie sprzedawany głównie w Chinach: w Polsce kupuje się go przez importerów, bez lokalnego serwisu producenta.</li><li>Starszy system Android 11.</li><li>E Ink nie nadaje się do oglądania filmów (to zaleta lub wada, zależnie od celu).</li></ul>'
          },
          {
            id: 'nokia-3210-4g', type: 'urzadzenie', group: 'Urządzenia',
            photo: '../images/technologia/producenci/hmd/nokia-3210-4g.webp',
            title: 'Nokia 3210 4G', sub: 'Klasyczny telefon z klawiaturą: rozmowy, SMS-y, aparat, radio i Snake. Bateria na kilka dni.',
            specs: [['Ekran', '2,4″ kolorowy (QVGA)'], ['System', 'S30+ (bez sklepu z aplikacjami)'], ['Łączność', '4G, Bluetooth 5.0, gniazdo słuchawkowe 3,5 mm'], ['Aparat', '2 MP z lampą LED'], ['Bateria', '1450 mAh, wymienna, ładowanie USB-C'], ['Cena orientacyjna', 'ok. 80 € (wg zapowiedzi producenta)']],
            body:
              '<p class="wft-lead">Odświeżona wersja kultowego telefonu z 1999 r. Ma to, co potrzebne do kontaktu, i prawie nic, co wciąga.</p>' +
              '<h3>Dla kogo / co daje?</h3><ul><li>Dobry <strong>pierwszy telefon</strong> dla dziecka w wieku szkolnym albo telefon „na wyjazd” i na czas nauki.</li><li>Fizyczna klawiatura, głośny dzwonek, mocne wibracje, radio FM i latarka.</li><li>Bateria wystarcza zwykle na kilka dni, a gdy się zużyje, łatwo ją wymienić.</li><li>Niska cena: zgubienie lub zniszczenie nie jest dramatem.</li></ul>' +
              '<h3>Na co uważać?</h3><ul><li>Zależnie od wersji w menu mogą być proste usługi internetowe (np. pogoda, wiadomości, krótkie filmy). Warto przejrzeć menu razem z dzieckiem.</li><li>Brak komunikatorów (np. WhatsApp), aplikacji szkolnych i biletów: sprawdź, czy dziecku nie są potrzebne.</li><li>Słaby aparat i mały ekran. Użytkownicy narzekają też na niewyłączalne dźwięki klawiszy.</li></ul>',
            link: 'https://www.hmd.com/pl_pl/nokia-3210',
            credit: 'Zdjęcie: materiały producenta (HMD)'
          },
          {
            id: 'light-phone-iii', type: 'urzadzenie', group: 'Urządzenia',
            photo: '../images/technologia/producenci/light/light-phone-iii.webp',
            title: 'Light Phone III', sub: 'Minimalistyczny telefon z czarno-białym interfejsem: rozmowy, wiadomości, mapy, aparat i kilka narzędzi, bez aplikacji społecznościowych.',
            specs: [['Ekran', '3,92″ matowy OLED, interfejs czarno-biały'], ['System', 'LightOS (bez sklepu z aplikacjami, bez przeglądarki)'], ['Narzędzia', 'budzik, kalendarz, notatki, mapy, muzyka, podcasty, pogoda, hotspot, 2FA'], ['Aparat', '50 MP z tyłu (zdjęcia 12 MP), 8 MP z przodu'], ['Łączność', '5G, GPS, Bluetooth, NFC, czytnik linii papilarnych'], ['Bateria', '1800 mAh, wymienna'], ['Cena', 'ok. 899 USD (sprzedaż ze Stanów Zjednoczonych)']],
            body:
              '<p class="wft-lead">Telefon dla osób, które chcą być w kontakcie i mieć pod ręką kilka przydatnych narzędzi, ale świadomie rezygnują z mediów społecznościowych, przeglądarki i gier.</p>' +
              '<h3>Dla kogo / co daje?</h3><ul><li>Dla starszej młodzieży i dorosłych, którzy chcą <strong>ograniczyć smartfon</strong>, a nie zrezygnować z map, muzyki i aparatu.</li><li>Prosty, spokojny ekran: same nazwy narzędzi, bez ikon i powiadomień z aplikacji.</li><li>Producent stawia na naprawialność: wymienna bateria, łatwiejsza wymiana ekranu i portu USB.</li></ul>' +
              '<h3>Na co uważać?</h3><ul><li>Wysoka cena, a do tego koszty wysyłki z USA, cło i VAT.</li><li>Brak komunikatorów (np. WhatsApp), bankowości i aplikacji szkolnych.</li><li>Przed zakupem sprawdź, czy działa z Twoim operatorem i czy obsługuje polskie znaki.</li><li>W recenzjach chwalony za wygląd, krytykowany za ograniczenia i krótszą pracę na baterii niż w prostych telefonach.</li></ul>',
            link: 'https://www.thelightphone.com/lightiii',
            credit: 'Zdjęcie: materiały producenta (Light)'
          },
          {
            id: 'xplora-x6play', type: 'urzadzenie', group: 'Urządzenia',
            photo: '../images/technologia/producenci/xplora/xplora-x6play.webp',
            title: 'Xplora X6Play', sub: 'Zegarek z funkcją telefonu dla młodszych dzieci: rozmowy z zaufanymi osobami, lokalizacja GPS i tryb szkolny.',
            specs: [['Ekran', '1,52″ dotykowy'], ['Funkcje', 'rozmowy i wiadomości tylko z zatwierdzonymi kontaktami, GPS, przycisk SOS, krokomierz, aparat 5 MP'], ['Łączność', '4G, karta nano-SIM (w niektórych wersjach eSIM)'], ['Odporność', 'IP68'], ['Bateria', 'ok. 900 mAh, do 72 h czuwania (wg producenta)'], ['Producent', 'Xplora, Norwegia']],
            body:
              '<p class="wft-lead">Zamiast pierwszego smartfona: dziecko może zadzwonić do rodziców, a rodzice wiedzą, gdzie ono jest. Bez internetu, sklepu z aplikacjami i nieznajomych kontaktów.</p>' +
              '<h3>Dla kogo / co daje?</h3><ul><li>Dla dzieci mniej więcej w wieku <strong>6–10 lat</strong>, które zaczynają same chodzić do szkoły lub na zajęcia.</li><li>Kontakty dodaje wyłącznie rodzic w aplikacji Xplora, a połączenia od nieznanych numerów są blokowane.</li><li><strong>Tryb szkolny</strong> wyłącza większość funkcji w czasie lekcji.</li><li>Krokomierz nagradza ruch.</li></ul>' +
              '<h3>Na co uważać?</h3><ul><li>Do działania potrzebna jest karta SIM z abonamentem lub pakietem danych. Część funkcji wymaga płatnej subskrypcji Xplora, więc sprawdź warunki u sprzedawcy.</li><li>Lokalizacja nie jest idealnie dokładna, zwłaszcza w budynkach.</li><li>Śledzenie dziecka to decyzja rodzinna. Warto rozmawiać z dzieckiem, kiedy i po co sprawdzamy lokalizację, i stopniowo dawać mu więcej samodzielności.</li><li>Przed zabraniem zegarka do szkoły sprawdź jej regulamin.</li></ul>',
            link: 'https://www.xplora.com/',
            credit: 'Zdjęcie: materiały producenta (Xplora)'
          },
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
            id: 'telefon-do-komunikacji', type: 'urzadzenie', group: 'Urządzenia', icon: 'fa-phone',
            title: 'Telefon do komunikacji', was: 'niekończącej się rozrywki',
            sub: 'Proste telefony, telefony minimalistyczne i zegarki z funkcją telefonu: jak wybrać pierwszy telefon dla dziecka.',
            body:
              '<p class="wft-lead">Pierwszy telefon nie musi być smartfonem. Dziecko potrzebuje przede wszystkim kontaktu z rodzicami, a dopiero później dostępu do aplikacji.</p>' +
              '<h3><span>1</span>Problem</h3><p>Smartfon daje dziecku jednocześnie kontakt z rodziną i dostęp do mediów społecznościowych, gier i niekończących się filmików. Rodzice często kupują go „dla bezpieczeństwa”, a w praktyce dziecko dostaje urządzenie zaprojektowane tak, by przyciągać uwagę.</p>' +
              '<h3><span>2</span>Rodzaje urządzeń</h3><ul>' +
              '<li><strong>Zegarek z funkcją telefonu</strong> (dla młodszych dzieci): rozmowy tylko z zatwierdzonymi osobami, lokalizacja, przycisk SOS. Np. Xplora X6Play.</li>' +
              '<li><strong>Klasyczny telefon z klawiaturą</strong>: rozmowy, SMS-y, prosty aparat, bateria na kilka dni. Np. Nokia 3210 4G.</li>' +
              '<li><strong>Telefon minimalistyczny</strong> (dla nastolatków): wybrane narzędzia, takie jak mapy, muzyka czy aparat, bez mediów społecznościowych. Np. Mudita Kompakt, Light Phone III.</li>' +
              '<li><strong>Smartfon z kontrolą rodzicielską</strong>: pełny telefon z ograniczeniami ustawianymi przez rodzica. Pojawiają się modele z ograniczeniami wbudowanymi w system, ale nie wszystkie są sprzedawane w Polsce.</li></ul>' +
              '<h3><span>3</span>Jak dobrać do wieku?</h3><ul><li><strong>Młodsze dzieci (ok. 6–10 lat)</strong>: zegarek z funkcją telefonu albo prosty telefon, który zostaje w plecaku.</li><li><strong>Starsze dzieci (ok. 10–13 lat)</strong>: telefon klasyczny lub minimalistyczny, a gdy pojawiają się potrzeby szkolne (dziennik, bilety), rozważ telefon E Ink.</li><li><strong>Nastolatki</strong>: telefon minimalistyczny, telefon E Ink albo smartfon z rozsądnymi ustawieniami i zasadami rodzinnymi.</li></ul><p>Granice wieku są orientacyjne. Ważniejsze od wieku jest to, czy dziecko jest gotowe, i to, czego naprawdę potrzebuje.</p>' +
              '<h3><span>4</span>Co daje taki wybór?</h3><ul><li>Kontakt z rodzicami bez stałego dostępu do mediów społecznościowych i gier.</li><li>Mniej rozpraszania w czasie nauki i snu.</li><li>Długie działanie na baterii i często niższa cena.</li><li>Czas, by dziecko spokojnie dojrzało do smartfona.</li></ul>' +
              '<h3><span>5</span>Na co zwrócić uwagę przed zakupem?</h3><ul><li><strong>Potrzeby szkolne</strong>: czy dziecku nie jest potrzebny dziennik elektroniczny, komunikator klasowy albo bilet w aplikacji?</li><li><strong>Relacje z rówieśnikami</strong>: jeśli cała klasa umawia się w komunikatorze, porozmawiaj z dzieckiem i innymi rodzicami o wspólnych zasadach.</li><li><strong>Karta SIM i abonament</strong>: zegarki wymagają karty z pakietem danych, a część funkcji bywa płatna.</li><li><strong>Prywatność</strong>: kto ma dostęp do lokalizacji i rozmów dziecka i gdzie są przechowywane dane.</li><li><strong>Zasady szkoły</strong>: wiele szkół ogranicza korzystanie z telefonów i zegarków w czasie lekcji.</li></ul>' +
              '<h3><span>6</span>Rozmowa ważniejsza niż urządzenie</h3><p>Żaden telefon nie zastąpi rozmowy. Warto wspólnie ustalić, kiedy i po co dziecko korzysta z telefonu, gdzie telefon „śpi” w nocy i kiedy przyjdzie czas na kolejny krok. Przy zegarkach z lokalizacją dobrze jest od początku tłumaczyć, że to narzędzie bezpieczeństwa, a nie stałej kontroli.</p>'
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
            photo: '../images/technologia/producenci/dafi/dafi-crystal-dzbanek.webp', credit: 'Zdjęcie: materiały producenta (Dafi, dzbanek Crystal LED)', link: 'https://dafi.pl/szklany-dzbanek-filtrujacy-dafi-crystal-led-czarny-6-wkladow-unimax.html',
            title: 'Dzbanek filtrujący', sub: 'Najprostszy start: poprawia smak i ogranicza chlor oraz kamień.',
            body: '<h3>Jak działa?</h3><p>Woda przepływa przez wkład z <strong>węglem aktywnym</strong> (wyłapuje chlor i związki pogarszające smak i zapach) i zwykle <strong>żywicą jonowymienną</strong> (ogranicza kamień i część metali, np. miedź, ołów; zależnie od wkładu).</p><h3>Co daje, a czego nie?</h3><ul><li>✔ lepszy smak i zapach, mniej kamienia w czajniku,</li><li>✖ nie usuwa bakterii i wirusów,</li><li>✖ zwykle nie usuwa skutecznie azotanów.</li></ul><h3>Dla kogo?</h3><p>Mieszkanie z wodą wodociągową, mała rodzina, start bez montażu.</p><h3>Eksploatacja</h3><p>Wkład wymieniaj według zaleceń (zwykle co ok. 4 tygodnie). Dzbanek myj i trzymaj w chłodzie, przefiltrowaną wodę zużyj w ciągu doby.</p>'
          },
          {
            id: 'butelka-filtr', type: 'urzadzenie', group: 'Rodzaje filtrów', icon: 'fa-flask',
            photo: '../images/technologia/producenci/dafi/dafi-soft-butelka.webp', credit: 'Zdjęcie: materiały producenta (Dafi, butelka Soft)', link: 'https://dafi.pl/butelki-filtrujace/butelka-filtrujaca-dafi-soft-0-5-l-stalowa-filtr-weglowy.html',
            title: 'Butelka z filtrem', sub: 'Do szkoły i na wyjazd: filtruje w trakcie picia.',
            body: '<h3>Jak działa?</h3><p>W butelce jest mały wkład, najczęściej węglowy, przez który woda przechodzi przy piciu. Modele <strong>turystyczne z membraną</strong> (ultrafiltracja) zatrzymują też bakterie i pierwotniaki.</p><h3>Co daje?</h3><ul><li>Lepszy smak wody z kranu lub poidełka w szkole.</li><li>Jedna butelka zamiast wielu plastikowych.</li></ul><h3>Na co uważać?</h3><p>Wybieraj butelki ze stali lub tworzyw bez BPA, regularnie myj i wymieniaj wkład.</p><div class="wft-note"><p><strong>Na zdjęciu:</strong> Dafi Soft od polskiego producenta z Kielc: butelka 0,3, 0,5 lub 0,7 l z wymiennym filtrem z węgla z łupin kokosa (wymiana co miesiąc), z tworzywa bez BPA.</p></div>'
          },
          {
            id: 'na-kran', type: 'urzadzenie', group: 'Rodzaje filtrów', icon: 'fa-shower',
            photo: '../images/technologia/producenci/brita/brita-on-tap-pro.webp', credit: 'Zdjęcie: materiały producenta (Brita On Tap Pro V-MF)', link: 'https://www.brita.com.au/onTap/ontap',
            title: 'Filtr na kran', sub: 'Nakładka na wylewkę: filtrowana woda bez dzbanka.',
            body: '<h3>Jak działa?</h3><p>Mały filtr węglowy zakręcany na wylewkę z przełącznikiem: woda filtrowana albo zwykła.</p><h3>Co daje?</h3><ul><li>Lepszy smak, mniej chloru, od razu z kranu.</li><li>Tańszy start niż filtr podzlewowy, bez montażu pod zlewem.</li></ul><h3>Ograniczenia</h3><p>Wolniejszy przepływ, pasuje nie do każdej baterii, mały wkład wymaga częstej wymiany.</p><div class="wft-note"><p><strong>Na zdjęciu:</strong> Brita On Tap Pro V-MF: wkład na ok. 600 l, wyświetlacz pokazuje, ile litrów zostało, trzy tryby (woda filtrowana, niefiltrowana i natrysk), adaptery do większości kranów. Według producenta minerały (wapń, magnez) zostają w wodzie. To nie jest filtr przeciw kamieniowi.</p></div>'
          },
          {
            id: 'podzlewowy', type: 'urzadzenie', group: 'Rodzaje filtrów', icon: 'fa-sliders',
            photo: '../images/technologia/producenci/aquaphor/aquaphor-eco-pro.webp', credit: 'Zdjęcie: materiały producenta (Aquaphor ECO Pro)', link: 'https://aquaphor.com/pl-pl/kuchenne-filtry-podzlewozmywakowe/krysztal-eco-pro',
            title: 'Filtr podzlewowy', sub: 'Kilka stopni filtracji ukrytych pod zlewem, osobny kranik.',
            body: '<h3>Jak działa?</h3><p>Zwykle 2–3 wkłady: <strong>sedymentacyjny</strong> (piasek, rdza), <strong>węglowy</strong> (najlepiej węgiel blokowy: chlor, smak, część związków organicznych) i opcjonalnie wkład na konkretny problem. Filtrowana woda płynie osobnym kranikiem.</p><h3>Co daje?</h3><ul><li>Duża wydajność dla całej rodziny, do picia i gotowania.</li><li>Wkłady wymienia się rzadziej (zwykle co 6–12 miesięcy).</li></ul><h3>Dla kogo?</h3><p>Rodziny, które dużo gotują i chcą zrezygnować z wody butelkowanej na stałe.</p><div class="wft-note"><p><strong>Na zdjęciu:</strong> Aquaphor ECO Pro: trzystopniowy filtr podzlewowy z osobnym kranikiem; według producenta wydajność ok. 10 000 l i przepływ 2,5 l/min, a filtr zachowuje skład mineralny wody.</p></div>'
          },
          {
            id: 'osmoza', type: 'urzadzenie', group: 'Rodzaje filtrów', icon: 'fa-th',
            photo: '../images/technologia/producenci/aquaphor/aquaphor-osmo-pro-50.webp', credit: 'Zdjęcie: materiały producenta (Aquaphor, system OSMO Pro 50)', link: 'https://aquaphor.com/pl-pl/reverse-osmosis/osmo-pro-50',
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
            id: 'dystrybutory', type: 'urzadzenie', group: 'Rodzaje filtrów', icon: 'fa-building-o',
            title: 'Systemy dla szkół i firm', sub: 'Poidełka, zdroje do napełniania bidonów i dystrybutory podłączone do sieci.',
            body:
              '<p class="wft-lead">Woda z wodociągu podana prosto w szkole: dzieci piją, kiedy chcą, napełniają własne bidony, a szkoła nie kupuje butelek ani galonów.</p>' +
              '<h3><span>1</span>Problem</h3><p>W wielu szkołach jedynym źródłem wody jest umywalka w łazience albo woda kupowana w butelkach. Dzieci piją za mało, a w plecakach lądują kolejne plastikowe butelki i słodzone napoje.</p>' +
              '<h3><span>2</span>Rodzaje rozwiązań</h3><ul>' +
              '<li><strong>Poidełko (pitnik, źródełko)</strong>: strumień wody do picia bezpośrednio z urządzenia, często uruchamiany przyciskiem lub bezdotykowo.</li>' +
              '<li><strong>Zdrój do napełniania butelek i bidonów</strong>: dzieci nalewają wodę do własnych butelek wielokrotnego użytku. To najbardziej higieniczne rozwiązanie i najlepszy nawyk.</li>' +
              '<li><strong>Dystrybutor podłączony do sieci</strong> (zamiast galonów): urządzenie z filtracją, a często także z chłodzeniem, zasilane bezpośrednio z wodociągu.</li></ul>' +
              '<h3><span>3</span>Jak to działa?</h3><p>Urządzenie podłącza się do instalacji wodociągowej. Zależnie od jakości wody w budynku stosuje się filtr (np. węglowy), a w niektórych modelach także lampę UV. Woda płynie świeża, bez magazynowania w butelkach.</p>' +
              '<h3><span>4</span>Korzyści dla dzieci i szkoły</h3><ul><li>Łatwy dostęp do wody przez cały dzień, a dobrze nawodnione dziecko łatwiej się koncentruje.</li><li>Mniej butelek plastikowych i mniej słodzonych napojów.</li><li>Dobry nawyk: własny bidon zamiast butelki jednorazowej.</li><li>Brak kosztów zakupu i przechowywania galonów.</li></ul>' +
              '<h3><span>5</span>Jak szkoła może to wprowadzić?</h3><ol class="wft-steps">' +
              '<li><b>Sprawdź, czy w Twoim mieście działa program wodociągów.</b> Np. w Krakowie Wodociągi Miasta Krakowa razem z miastem montują w szkołach pitniki (szkoła dostosowuje instalację, urządzenie przekazywane jest w darowiźnie), we Wrocławiu od 2019 r. działa program „Wrocławska Kranówka” ze zdrojami do napełniania bidonów, a w Warszawie i Szczecinie także są źródełka w budynkach publicznych.</li>' +
              '<li><b>Zbadaj wodę w budynku</b> (w szczególności przy starej instalacji) i ustal z administratorem miejsce montażu.</li>' +
              '<li><b>Wybierz rozwiązanie</b>: zdrój do bidonów, poidełko albo dystrybutor sieciowy, najlepiej bezdotykowy.</li>' +
              '<li><b>Ustal obsługę</b>: kto czyści urządzenie, jak często wymienia się filtry i kto robi okresowe badania wody.</li>' +
              '<li><b>Finansowanie</b>: budżet szkoły, rada rodziców, program miejski lub sponsor.</li></ol>' +
              '<h3><span>6</span>Na co zwrócić uwagę?</h3><ul><li><strong>Higiena</strong>: regularne mycie i dezynfekcja, bezdotykowe uruchamianie, osłona dyszy.</li><li><strong>Serwis</strong>: wymiana filtrów według zaleceń producenta, bo zaniedbany filtr pogarsza wodę.</li><li><strong>Zalecenia sanitarne</strong>: Państwowa Inspekcja Sanitarna opracowała zasady udostępniania wody wodociągowej dzieciom w placówkach szkolno-wychowawczych. Warto je przeczytać przed montażem.</li><li>Uwaga prawna: przepisy nie określają wprost, w jakiej formie szkoła ma zapewniać wodę pitną (projekt takiego zapisu z 2019 r. nie wszedł w życie), ale dostęp do wody jest powszechnie uznawany za standard higieny w szkole.</li></ul>' +
              '<div class="wft-src"><p>Źródła</p><ol>' +
              '<li><a href="https://krakow.pl/aktualnosci/209843,34,komunikat,dobra_woda_pitna_z_kranu_w_szkolach.html" target="_blank" rel="noopener">Kraków: dobra woda pitna z kranu w szkołach</a></li>' +
              '<li><a href="https://www.wroclaw.pl/wroclawska-kranowka-w-szkolach-podstawowych-i-liceum" target="_blank" rel="noopener">Wrocław: Wrocławska Kranówka w szkołach</a></li>' +
              '<li><a href="https://warszawa19115.pl/pl/-/zrodelka-z-warszawska-kranowka-w-instytucjach" target="_blank" rel="noopener">Warszawa: źródełka z warszawską kranówką</a></li>' +
              '<li><a href="https://www.gov.pl/attachment/fce8237b-29a7-429d-bf4d-ef221ceb4a20" target="_blank" rel="noopener">Zasady udostępniania wody wodociągowej dzieciom w placówkach szkolno-wychowawczych (gov.pl)</a></li>' +
              '</ol></div>'
          },
          {
            id: 'oczyszczacz', type: 'urzadzenie', group: 'Powietrze i materiały', icon: 'fa-leaf', visual: crop.air,
            photo: '../images/technologia/producenci/philips/philips-ac0820.webp', credit: 'Zdjęcie: materiały producenta (Philips, seria 800, AC0820/10)', link: 'https://www.philips.pl/c-p/AC0820_10/oczyszczacz-powietrza',
            title: 'Oczyszczacz powietrza w pokoju dziecka', sub: 'Technologie filtracji ograniczające ilość pyłów i alergenów.',
            body: '<h3>Jak działa?</h3><p>Wentylator przeciąga powietrze przez filtry: wstępny, <strong>HEPA</strong> (zatrzymuje drobny pył, pyłki, sierść) i często węglowy (zapachy).</p><h3>Na co zwrócić uwagę?</h3><ul><li>Filtr <strong>HEPA klasy H13</strong> (norma EN 1822), a nie „typu HEPA”.</li><li>Współczynnik <strong>CADR</strong> dopasowany do metrażu pokoju.</li><li><strong>Głośność</strong> w trybie nocnym.</li><li><strong>Bez jonizatora i ozonowania</strong> w pokoju dziecka.</li><li>Koszt i dostępność filtrów zamiennych.</li></ul><div class="wft-note"><p><strong>Na zdjęciu:</strong> kompaktowy oczyszczacz Philips z serii 800, przeznaczony do mniejszych pomieszczeń. Przed zakupem dowolnego modelu sprawdź w danych technicznych klasę filtra, CADR i głośność w trybie nocnym. Uwaga na określenia marketingowe: o tym, czy filtr spełnia normę HEPA, bywały spory, dlatego liczy się klasa filtra podana zgodnie z normą EN 1822.</p></div>'
          },
          {
            id: 'czujniki-powietrza', type: 'urzadzenie', group: 'Powietrze i materiały', icon: 'fa-tachometer',
            photo: '../images/technologia/producenci/aranet/aranet4-home.webp', credit: 'Zdjęcie: materiały producenta (Aranet4 HOME)', link: 'https://aranet.com/products/aranet4/',
            title: 'Czujniki jakości powietrza', sub: 'Kontrolowanie stężenia pyłów, dwutlenku węgla i wilgotności.',
            body: '<h3>Co mierzą?</h3><ul><li><strong>CO₂</strong>: wysoki poziom w zamkniętym pokoju oznacza, że czas wywietrzyć (duszność obniża koncentrację i jakość snu).</li><li><strong>PM2.5 / PM10</strong>: pył zawieszony, ważny zwłaszcza w sezonie grzewczym.</li><li>Temperatura i wilgotność.</li></ul><h3>Na co zwrócić uwagę?</h3><ul><li>CO₂ mierzony czujnikiem <strong>NDIR</strong>, a nie „eCO₂” szacowanym z innych gazów.</li><li>Czytelny wyświetlacz i alarm świetlny, które działają też bez aplikacji.</li></ul><div class="wft-note"><p><strong>Na zdjęciu:</strong> Aranet4 HOME od łotewskiego producenta: czujnik CO₂ typu NDIR, mierzy też temperaturę, wilgotność i ciśnienie, ma ekran E Ink z kolorowym wskaźnikiem (zielony, żółty, czerwony) i działa na dwóch bateriach AA przez kilka lat. Z aplikacją łączy się przez Bluetooth, ale działa także bez niej.</p></div>'
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
          { id: 'roboty', type: 'urzadzenie', group: 'Zestawy i urządzenia', icon: 'fa-cogs', title: 'Roboty edukacyjne', sub: 'Nauka programowania poprzez budowanie i sterowanie robotami.', photo: '../images/technologia/producenci/photon/photon-robot.webp', credit: 'Zdjęcie: materiały producenta (Photon Education)', link: 'https://photon.education/pl/photon-robot/', specs: [['Producent', 'Photon Education (Polska)'], ['Programowanie', 'od bloków (Scratch, Blockly) po MakeCode, JavaScript i Python'], ['Sterowanie', 'aplikacja na tablet lub telefon (Bluetooth)'], ['Dla kogo', 'od przedszkola do szkoły średniej']], body: '<p class="wft-lead">Robot, którego dziecko programuje, uczy myślenia krok po kroku: zaplanuj, sprawdź, popraw. Efekt widać od razu, bo robot jedzie, świeci, gra albo omija przeszkody.</p><h3>Co daje?</h3><ul><li>Logiczne myślenie i cierpliwość: błąd w programie to wskazówka, a nie porażka.</li><li>Ruch i zabawa z rodzeństwem lub w grupie zamiast samotnego przewijania ekranu.</li><li>Stopniowanie trudności: najmłodsze dzieci układają polecenia z obrazków, starsze piszą prawdziwy kod.</li></ul><h3>Na co zwrócić uwagę?</h3><ul><li>Czy robot rośnie razem z dzieckiem (kilka poziomów programowania).</li><li>Wytrzymałość obudowy i dostęp do lekcji lub scenariuszy zajęć.</li><li>Czas przed tabletem: najlepiej, gdy aplikacja służy do programowania, a zabawa dzieje się na podłodze.</li></ul>' + '<div class=\"wft-note\"><p><strong>Na zdjęciu:</strong> Photon od polskiej firmy Photon Education: robot do nauki programowania z czujnikami, który wraz z postępami dziecka „odblokowuje” kolejne umiejętności. Programuje się go z aplikacji: od bloków po MakeCode, JavaScript i Pythona. Używany w przedszkolach i szkołach.</p></div>', brands: [{ name: 'Photon Education', country: 'Polska' }, { name: 'LEGO Education', country: 'Dania' }, { name: 'Makeblock', country: 'Chiny' }, { name: 'Sphero', country: 'USA' }] },
          { id: 'elektronika', type: 'urzadzenie', group: 'Zestawy i urządzenia', icon: 'fa-microchip', title: 'Elektronika dla dzieci', sub: 'Zestawy do samodzielnego konstruowania prostych układów elektronicznych.', photo: '../images/technologia/producenci/microbit/microbit-v2.webp', credit: 'Zdjęcie: materiały producenta (Micro:bit Educational Foundation)', link: 'https://microbit.org/', specs: [['Płytka', 'BBC micro:bit V2'], ['Na pokładzie', 'matryca 25 diod LED, 2 przyciski, dotykowe logo'], ['Czujniki', 'ruchu (akcelerometr), kompas, światła, temperatury, mikrofon; głośnik'], ['Programowanie', 'MakeCode (bloki), Python, Scratch']], body: '<p class="wft-lead">Mały komputer, który dziecko programuje i od razu widzi efekt: diody układają się w obrazek, płytka gra melodię, liczy kroki albo mierzy temperaturę w pokoju.</p><h3>Co daje?</h3><ul><li>Zrozumienie, jak działa technika wokół nas: czujniki, przyciski, światło i dźwięk.</li><li>Własne projekty: krokomierz, kostka do gry, alarm do pokoju, stacja pogodowa.</li><li>Prosty start w przeglądarce (bloki), a później prawdziwy Python.</li></ul><h3>Na co zwrócić uwagę?</h3><ul><li>Zestawy z niskim napięciem i z bateriami w zamykanej obudowie.</li><li>Dostęp do darmowych lekcji (polskie materiały, kursy dla szkół).</li><li>Rozszerzenia: płytki z czujnikami, silniczkami i klockami, które pozwalają rozwijać projekty.</li></ul>' + '<div class=\"wft-note\"><p><strong>Na zdjęciu:</strong> BBC micro:bit V2: kieszonkowy komputer edukacyjny z diodami LED, przyciskami, czujnikami, mikrofonem i głośnikiem. Programuje się go w przeglądarce (MakeCode), w Pythonie lub w Scratchu. Na stronie producenta są darmowe lekcje.</p></div>' },
          { id: 'druk-3d', type: 'urzadzenie', group: 'Zestawy i urządzenia', icon: 'fa-cube', title: 'Druk 3D', sub: 'Projektowanie i tworzenie własnych przedmiotów.', link: 'https://www.prusa3d.com/en/product/prusa-core-one/', body: '<p class="wft-lead">Od pomysłu, przez projekt w prostym programie (np. Tinkercad), do przedmiotu w ręku. Dziecko uczy się wyobraźni przestrzennej, mierzenia i poprawiania własnych błędów.</p><h3>Co daje?</h3><ul><li>Własne projekty: brelok, uchwyt na biurko, część do zabawki, model do szkoły.</li><li>Myślenie inżynierskie: projekt, próba, poprawka.</li></ul><h3>Bezpieczeństwo</h3><ul><li>Dysza i stół drukarki są gorące: drukarka ma stać poza zasięgiem małych dzieci, a druk odbywa się pod okiem dorosłego.</li><li>Drukarki <strong>zamknięte w obudowie</strong> ograniczają kontakt z gorącymi elementami i oparami. Pomieszczenie warto wietrzyć, a do domu wybierać filament PLA.</li><li>Długopisy 3D dla dzieci działają w niższej temperaturze: to dobry start dla młodszych.</li></ul>' + '<div class=\"wft-note\"><p><strong>Przykład:</strong> Prusa CORE One od czeskiego producenta Prusa Research (UE): zamknięta drukarka 3D z polem roboczym ok. 25 × 22 × 27 cm. Zdjęcie dodamy, gdy na stronie producenta będą zdjęcia bez nakładek promocyjnych.</p></div>' },
          { id: 'animacja', type: 'urzadzenie', group: 'Zestawy i urządzenia', icon: 'fa-film', title: 'Animacja poklatkowa', was: 'biernego oglądania', sub: 'Tworzenie własnych filmów zamiast biernego oglądania gotowych produkcji.', body: '<p class="wft-lead">Zamiast oglądać kolejną bajkę, dziecko robi własną: ustawia figurki, robi zdjęcie, przesuwa je o milimetr, robi następne… a aplikacja skleja to w film.</p><h3>Czego potrzeba?</h3><ul><li>Telefon albo tablet na <strong>statywie</strong> (obraz nie może się ruszać).</li><li>Darmowa aplikacja do animacji, np. Stop Motion Studio.</li><li>Figurki, klocki, plastelina, papierowe wycinanki i stałe światło (lampka zamiast okna).</li></ul><h3>Co daje?</h3><ul><li>Cierpliwość i planowanie: scenariusz, scenografia, kolejne klatki.</li><li>Opowiadanie historii, praca w zespole z rodzeństwem lub kolegami.</li><li>Ekran staje się narzędziem do tworzenia, a nie tylko do oglądania.</li></ul>' },
          { id: 'muzyka', type: 'urzadzenie', group: 'Zestawy i urządzenia', icon: 'fa-music', title: 'Muzyka i dźwięk', sub: 'Elektroniczne instrumenty i urządzenia rozwijające zainteresowania muzyczne.', body: '<p class="wft-lead">Klawisze, padowe kontrolery i proste studia nagrań pozwalają dziecku komponować, nagrywać i eksperymentować z dźwiękiem zamiast tylko słuchać.</p><h3>Od czego zacząć?</h3><ul><li><strong>Keyboard z podświetlanymi klawiszami</strong> albo trybem nauki: pierwsze melodie bez nut.</li><li><strong>Kontroler padowy</strong> (kolorowe przyciski z dźwiękami) podłączony do darmowej aplikacji: budowanie rytmów i własnych utworów.</li><li><strong>Mikrofon i słuchawki</strong>: nagrywanie śpiewu, słuchowisk, podcastu z rodzeństwem.</li></ul><h3>Na co zwrócić uwagę?</h3><ul><li><strong>Słuchawki dla dzieci z ograniczeniem głośności</strong>, bo słuch dziecka jest wrażliwy.</li><li>Instrument, który da się grać bez aplikacji, jest mniej rozpraszający.</li></ul>' },
          { id: 'gry-logiczne', type: 'urzadzenie', group: 'Zestawy i urządzenia', icon: 'fa-puzzle-piece', title: 'Gry edukacyjne i logiczne', sub: 'Interaktywna zabawa rozwijająca myślenie i umiejętność rozwiązywania problemów.', body: '<p class="wft-lead">Łamigłówki i gry logiczne, w których wygrywa myślenie, a nie refleks przed ekranem.</p><h3>Rodzaje</h3><ul><li><strong>Łamigłówki jednoosobowe z zadaniami o rosnącej trudności</strong>: dziecko samo dochodzi do rozwiązania.</li><li><strong>Gry planszowe o programowaniu</strong>: układanie „kodu” z kart, którym porusza się pionek.</li><li><strong>Zestawy łączące fizyczne klocki z aplikacją</strong>: ręce pracują, ekran tylko sprawdza.</li></ul><h3>Na co zwrócić uwagę?</h3><ul><li>Gry z poziomami trudności, które „rosną” z dzieckiem.</li><li>Gry, w które da się grać razem, bo wspólna gra to też czas z rodzicem.</li></ul>' },
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
          { id: 'budzik', type: 'urzadzenie', group: 'Urządzenia', icon: 'fa-clock-o', visual: crop.lamp, photo: '../images/technologia/producenci/philips/philips-smartsleep-hf3520.webp', credit: 'Zdjęcie: materiały producenta (Philips SmartSleep HF3520)', link: 'https://www.usa.philips.com/c-p/HF3520_60/smartsleep', title: 'Budzik', was: 'telefonu przy łóżku', sub: 'Oddzielenie funkcji budzenia od urządzenia służącego do komunikacji i rozrywki.', specs: [['Przykład', 'Philips SmartSleep (HF3520)'], ['Świt', 'stopniowe rozjaśnianie przez 20–40 min (czerwień → pomarańcz → żółć)'], ['Jasność', '20 poziomów, do 300 luksów'], ['Wieczór', 'tryb zachodu słońca: światło stopniowo gaśnie']], body: '<p class="wft-lead">Gdy telefon służy za budzik, ląduje przy łóżku, a z nim powiadomienia, wiadomości i „jeszcze jeden filmik”. Osobny budzik pozwala, żeby telefon nocował poza sypialnią.</p><h3>Budzik ze światłem świtu</h3><p>Przed godziną pobudki lampa stopniowo się rozjaśnia, naśladując wschód słońca. Budzenie jest łagodniejsze, co pomaga zwłaszcza zimą, gdy rano jest ciemno. Wieczorem tryb „zachodu słońca” powoli przygasa i ułatwia wyciszenie.</p><h3>Dla małych dzieci: budzik „pora wstawać”</h3><p>Zegar pokazuje obrazkiem, czy jeszcze jest noc, czy już można wstać (np. gwiazdki i słoneczko). Dziecko, które nie zna jeszcze godzin, wie, kiedy może wyjść z łóżka.</p><h3>Na co zwrócić uwagę?</h3><ul><li>Wyświetlacz, który można całkiem przyciemnić w nocy.</li><li>Działanie bez aplikacji i konta.</li></ul>' + '<div class=\"wft-note\"><p><strong>Na zdjęciu:</strong> Philips SmartSleep (HF3520): budzik ze światłem świtu, rozjaśnianie przez 20–40 minut, 20 poziomów jasności (do 300 luksów) i tryb zachodu słońca na wieczór.</p></div>' },
          { id: 'oswietlenie', type: 'urzadzenie', group: 'Urządzenia', icon: 'fa-lightbulb-o', title: 'Inteligentne oświetlenie', sub: 'Regulacja natężenia i temperatury barwowej światła w zależności od pory dnia.', body: '<p class="wft-lead">Jasne, chłodniejsze światło w ciągu dnia, a ciepłe i przygaszone wieczorem. Żarówki i lampy z regulacją barwy mogą zmieniać się automatycznie według pory dnia.</p><h3>Jak z tego korzystać?</h3><ul><li><strong>Dzień i nauka:</strong> jasne, neutralne lub chłodniejsze światło.</li><li><strong>Ostatnia godzina przed snem:</strong> ciepła barwa (pomarańczowa) i niższa jasność. To sygnał dla organizmu, że czas zwolnić.</li><li><strong>Harmonogram:</strong> światło samo przygasa o stałej porze, co wspiera rytuał zasypiania.</li></ul><h3>Na co zwrócić uwagę?</h3><ul><li>Płynna regulacja jasności i barwy (od ciepłej ok. 2200–2700 K do neutralnej).</li><li>Brak migotania przy przyciemnianiu.</li><li>Sterowanie także zwykłym włącznikiem, nie tylko z telefonu, żeby wieczorne ściemnianie nie kończyło się przewijaniem.</li></ul>' },
          { id: 'audio', type: 'urzadzenie', group: 'Urządzenia', icon: 'fa-headphones', photo: '../images/technologia/producenci/tonies/toniebox-2.webp', credit: 'Zdjęcie: materiały producenta (tonies, Toniebox 2)', link: 'https://tonies.com/en-gb/discover-toniebox-2', title: 'Odtwarzacze dźwięków i audiobooków', sub: 'Alternatywa dla wieczornego oglądania filmów.', specs: [['Przykład', 'Toniebox 2 (premiera: wrzesień 2025)'], ['Obsługa', 'bez ekranu: figurka na górze włącza bajkę'], ['Na noc', 'wyłącznik czasowy ze światłem, budzenie światłem świtu'], ['Inne', 'Yoto Player: karty zamiast figurek']], body: '<p class="wft-lead">Odtwarzacze bez ekranu pozwalają dziecku samodzielnie włączyć bajkę, słuchowisko czy audiobook przed snem, bez sięgania po tablet i bez obrazów, które pobudzają.</p><h3>Co dają?</h3><ul><li>Samodzielność: dziecko samo wybiera i włącza historię.</li><li>Wyobraźnia: słuchanie zamiast oglądania.</li><li>Wieczorny rytuał bez ekranu, z wyłącznikiem czasowym.</li></ul><h3>Na co zwrócić uwagę?</h3><ul><li>Ograniczenie maksymalnej głośności (ustawiane przez rodzica).</li><li>Dostępność treści po polsku.</li><li>Koszt kolejnych figurek lub kart.</li></ul>' + '<div class=\"wft-note\"><p><strong>Na zdjęciu:</strong> Toniebox 2: odtwarzacz dla dzieci bez ekranu. Postawienie figurki na kostce włącza nagranie, a uszy służą do regulacji głośności. Ma pierścień świetlny, wyłącznik czasowy ze światłem i budzenie światłem świtu. Podobne urządzenie to Yoto Player, który działa na karty zamiast figurek.</p></div>', brands: [{ name: 'tonies', country: 'Niemcy' }, { name: 'Yoto', country: 'Wielka Brytania' }] },
          { id: 'swiatlo-nocne', type: 'urzadzenie', group: 'Urządzenia', icon: 'fa-moon-o', photo: '../images/technologia/producenci/tommee-tippee/groclock.webp', credit: 'Zdjęcie: materiały producenta (Tommee Tippee Groclock)', link: 'https://www.tommeetippee.com/en-gb/products/groclock-sleep-trainer-clock', title: 'Światło nocne z regulacją jasności', sub: 'Rozwiązania pomagające dostosować oświetlenie do potrzeb dziecka.', body: '<p class="wft-lead">Delikatne, ciepłe światło daje poczucie bezpieczeństwa i nie wybudza. Jasne, niebieskie światło w nocy może utrudniać zasypianie.</p><h3>Na co zwrócić uwagę?</h3><ul><li><strong>Płynna regulacja jasności</strong>, najlepiej z możliwością całkowitego wyłączenia.</li><li><strong>Ciepła barwa</strong> (pomarańczowa, bursztynowa) zamiast białej i niebieskiej.</li><li>Bezpieczne zasilanie (USB, niska temperatura obudowy) i stabilna podstawa.</li><li>Dla młodszych dzieci: lampka połączona z budzikiem „pora wstawać”.</li></ul>' + '<div class=\"wft-note\"><p><strong>Na zdjęciu:</strong> Tommee Tippee Groclock: zegar dla małych dzieci, który działa też jako lampka nocna. Obrazki na ekranie pokazują, czy jeszcze jest noc, czy już pora wstać. Jasność ekranu można przyciemnić, a zegar zasila się przez USB.</p></div>' },
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
            photo: '../images/technologia/producenci/boneco/boneco-w200.webp', credit: 'Zdjęcie: materiały producenta (BONECO W200)', link: 'https://www.boneco.com/collections/humidifiers',
            title: 'Kontrola wilgotności powietrza', sub: 'Higrometry, nawilżacze i osuszacze.',
            body: '<p class="wft-lead">Za suche powietrze zimą wysusza śluzówki nosa i gardła, a za wilgotne sprzyja roztoczom i pleśni. Za komfortową uznaje się zwykle wilgotność ok. 40–60%.</p><h3>Higrometr: zacznij od pomiaru</h3><p>Mały i tani miernik wilgotności i temperatury. Dopiero gdy wiesz, ile wynosi wilgotność w pokoju dziecka, możesz zdecydować, czy potrzebujesz nawilżacza albo osuszacza.</p><h3>Nawilżacz: 3 rodzaje</h3><ul><li><strong>Ewaporacyjny</strong>: woda paruje z mokrego filtra; nie przesyca powietrza i nie tworzy białego pyłu.</li><li><strong>Ultradźwiękowy</strong>: cichy, tworzy chłodną mgiełkę; przy twardej wodzie może osadzać biały pył (lepiej woda zdemineralizowana).</li><li><strong>Parowy</strong>: podgrzewa wodę, więc jest higieniczny, ale zużywa więcej prądu, a gorąca para wymaga ostrożności przy dzieciach.</li></ul><p>Każdy nawilżacz trzeba <strong>regularnie myć</strong>, bo w stojącej wodzie rozwijają się drobnoustroje.</p><h3>Osuszacz</h3><p>Przydaje się w wilgotnych pomieszczeniach: łazience bez okna, przy suszeniu prania, w mieszkaniach z problemem zawilgocenia ścian.</p><div class="wft-note"><p><strong>Na zdjęciu:</strong> BONECO W200 od szwajcarskiego producenta: nawilżacz ewaporacyjny typu „air washer” (nawilża przez parowanie z obracających się dysków, bez mgiełki), do pomieszczeń o powierzchni ok. 50 m², ze zbiornikiem 4,5 l.</p></div>',
            brands: [{ name: 'Boneco', country: 'Szwajcaria' }, { name: 'Stadler Form', country: 'Szwajcaria' }, { name: 'Philips', country: 'Holandia' }, { name: 'De’Longhi', country: 'Włochy' }, { name: 'Meaco', country: 'Wielka Brytania' }]
          },
          { id: 'termostaty', type: 'urzadzenie', group: 'Urządzenia', icon: 'fa-thermometer-half', title: 'Inteligentne termostaty', sub: 'Utrzymywanie odpowiedniej temperatury w pomieszczeniach.',
            photo: '../images/technologia/producenci/tado/tado-x-glowica.webp', credit: 'Zdjęcie: materiały producenta (tado° Smart Radiator Thermostat X)', link: 'https://www.tado.com/products/radiators',
            body: '<p class="wft-lead">Głowice i termostaty, które same obniżają temperaturę w nocy i podnoszą ją przed pobudką. W chłodniejszej sypialni zwykle lepiej się śpi, a dom zużywa mniej energii.</p>' +
              '<h3>Co dają?</h3><ul><li>Każdy pokój ma własną temperaturę i harmonogram, np. chłodniej w sypialni dziecka w nocy, cieplej rano.</li><li>Mniej przegrzanych pomieszczeń, a suche, przegrzane powietrze to częsty problem zimą.</li><li>Głowicę zakłada się zamiast zwykłego pokrętła na kaloryferze.</li></ul>' +
              '<h3>Na co uważać?</h3><ul><li>Sprawdź zgodność z zaworami kaloryferów (producenci mają narzędzia do sprawdzenia).</li><li>Systemy „smart” zwykle wymagają aplikacji i bramki. Zwróć uwagę, czy działają też bez internetu i jakie dane zbierają.</li></ul>' +
              '<div class="wft-note"><p><strong>Na zdjęciu:</strong> głowica tado° Smart Radiator Thermostat X: montaż w kilka minut, wbudowany akumulator (bez wymiany baterii), sterowanie z aplikacji i harmonogramy. Do działania potrzebna jest bramka Bridge X albo inny router Thread w domu. Producent daje 10 lat gwarancji.</p></div>' },
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
            id: 'chatenet-ch46', type: 'urzadzenie', group: 'Pojazdy na kat. AM', icon: 'fa-car', photo: auto('chatenet-ch46.webp'),
            credit: 'Zdjęcie: materiały sprzedawcy (Volt & Go) – Chatenet CH46 e-Spring',
            title: 'Chatenet CH46', sub: 'Diesel lub elektryczny · 45 km/h · 2 miejsca · Francja',
            specs: [['Uprawnienia', 'kat. AM od 14 lat (wersja L6e)'], ['Napęd', 'diesel 2-cylindrowy ok. 478 cm³ (ok. 6 kW, automat) albo wersja elektryczna e-Spring'], ['Norma spalin (diesel)', 'Euro 5'], ['Wymiary', 'ok. 2,98 × 1,49 m'], ['Prędkość maks.', '45 km/h'], ['Miejsca', '2']],
            body: '<p>Najwyżej pozycjonowany model francuskiej marki Chatenet, sportowo stylizowany, dostępny w odmianach m.in. SL, Sport R i Barooder, z silnikiem diesla lub jako elektryczny CH46 e-Spring (na zdjęciu).</p><h3>Na co zwrócić uwagę?</h3><ul><li>Upewnij się, że kupujesz wersję <strong>L6e</strong> (dowód rejestracyjny).</li><li>Dane techniczne wersji elektrycznej (bateria, zasięg) sprawdź u sprzedawcy.</li></ul><p>W teście Euro NCAP z 2016 r. inny model tej marki, CH30 w wersji ciężkiej, uzyskał najlepszy wynik w tamtej serii: 2 gwiazdki.</p>',
            link: 'https://voltandgo.com/p/chatenet-ch46-e-spring-9938/'
          },
          {
            id: 'citroen-ami', type: 'urzadzenie', group: 'Pojazdy na kat. AM', icon: 'fa-car', photo: auto('citroen-ami.webp'), photoCover: true, photoPos: '50% 60%',
            credit: 'Zdjęcie: Stellantis Media (materiały prasowe Citroën)',
            title: 'Citroën Ami', sub: 'Elektryczny · 45 km/h · 2 miejsca · Francja',
            specs: [['Uprawnienia', 'kat. AM od 14 lat (L6e)'], ['Napęd', 'elektryczny, 6 kW'], ['Akumulator / zasięg', 'ok. 5,4 kWh, do ok. 75 km (WLTP)'], ['Ładowanie', 'ok. 4 h, także ze zwykłego gniazdka'], ['Prędkość maks.', '45 km/h'], ['Miejsca', '2']],
            body: '<p class="wft-lead">Jeden z najpopularniejszych mikrosamochodów w Europie: bardzo mały, w pełni elektryczny, ładowany z domowego gniazdka.</p><h3>Co go wyróżnia?</h3><ul><li>Prosta konstrukcja i niewielkie wymiary, dzięki czemu łatwo nim manewrować i parkować w mieście.</li><li>Wersja odświeżona w 2025 r. Jest też odmiana Buggy z otwartym nadwoziem.</li></ul><h3>Na co zwrócić uwagę?</h3><ul><li>Bardzo podstawowe wyposażenie i komfort, bo to pojazd do krótkich, miejskich tras.</li><li>Zimą zasięg będzie wyraźnie krótszy niż katalogowe 75 km.</li><li>Tak jak w każdym czterokołowcu lekkim ochrona w razie wypadku jest mniejsza niż w samochodzie osobowym (zob. „Bezpieczeństwo młodych kierowców”).</li></ul>',
            link: 'https://www.media.stellantis.com/em-en/citroen/press/all-new-ami-opens-up-its-order-book-and-adds-a-new-buggy-version-to-its-range'
          },
          {
            id: 'fiat-topolino', type: 'urzadzenie', group: 'Pojazdy na kat. AM', icon: 'fa-car', photo: auto('fiat-topolino.webp'), photoCover: true, photoPos: '50% 62%',
            credit: 'Zdjęcie: Stellantis Media (materiały prasowe Fiat)',
            title: 'Fiat Topolino', sub: 'Elektryczny · 45 km/h · 2 miejsca · Włochy',
            specs: [['Uprawnienia', 'kat. AM od 14 lat (L6e)'], ['Napęd', 'elektryczny, 6 kW'], ['Akumulator / zasięg', 'ok. 5,4 kWh, do ok. 75 km (WLTP)'], ['Ładowanie', 'ok. 4 h (do 2,3 kW)'], ['Prędkość maks.', '45 km/h'], ['Miejsca', '2']],
            body: '<p class="wft-lead">Elektryczny mikrosamochód Fiata w stylu retro. Technicznie to bliźniak Citroëna Ami, ale z włoskim wyglądem. Za wzornictwo otrzymał nagrodę Compasso d’Oro ADI.</p><h3>Co go wyróżnia?</h3><ul><li>Charakterystyczny design i wersja Dolcevita z otwartym nadwoziem.</li><li>Ładowanie w ok. 4 godziny, bez potrzeby specjalnej ładowarki.</li></ul><h3>Na co zwrócić uwagę?</h3><ul><li>Krótki zasięg, zwłaszcza zimą, bo to pojazd do miasta.</li><li>Wersja z otwartym nadwoziem nie chroni przed deszczem i zimnem.</li><li>Ochrona w razie wypadku mniejsza niż w samochodzie osobowym (zob. „Bezpieczeństwo młodych kierowców”).</li></ul>',
            link: 'https://www.fiat.co.uk/models/topolino'
          }
        ]
      }
    ]
  };
})();

/* Zdjęcia urządzeń i filmy (2026-11-28). Klucz: "modul/pozycja".
   pic: zdjęcie z wolną licencją (autor + licencja + link są pokazywane pod zdjęciem — wymóg CC BY-SA).
   videos: filmy na YouTube (zewnętrzni twórcy; src:"producent" = materiał producenta/dystrybutora). Bez miniaturek
   z YouTube — strona nie łączy się z serwerami YouTube, dopóki ktoś nie kliknie. */
window.WFT_MEDIA = {
  'sen/audio': {
    videos: [
      { yt: '8SZGiCbpUd8', t: 'Toniebox 2 po 8 miesiącach – szczera opinia', lang: 'EN' },
      { yt: 'e3TzsMocu1w', t: 'Toniebox 2 – co nowego', lang: 'EN' }
    ]
  },
  'zabawa/elektronika': {
    videos: [
      { yt: 'LkZ6RGUNFl0', t: 'Pierwsze zadanie z płytką micro:bit', lang: 'PL' },
      { yt: '3lOGODg6CuQ', t: 'micro:bit – elektroniczna kostka do gry', lang: 'PL' }
    ]
  },
  'zabawa/animacja': {
    videos: [
      { yt: '-Qb9TnIUIUY', t: 'Jak korzystać z aplikacji Stop Motion Studio?', lang: 'PL' },
      { yt: 't2o3WKy5ShY', t: 'Jak zrobić animację poklatkową z LEGO – warsztaty', lang: 'PL' }
    ]
  },
  'woda/czujniki-powietrza': {
    videos: [
      { yt: 'QBmSVom0SuA', t: 'Aranet4 – pełna recenzja domowego czujnika CO₂', lang: 'EN' },
      { yt: '4XagiTzYAq8', t: 'Aranet4 – recenzja czujnika jakości powietrza', lang: 'EN' }
    ]
  },
  'nauka/boox-note-air6c': {
    videos: [
      { yt: 'bXNAcfgQ4jw', t: 'BOOX Note Air6 C – recenzja: kolorowy E Ink, Android 16', lang: 'EN' },
      { yt: 'lX0SaVslJMA', t: 'BOOX Note Air6 C – „na ten czekałem”', lang: 'EN' },
      { yt: 'lD8QXxQYznk', t: 'BOOX Note Air6 C po dwóch tygodniach pracy (porównanie z Supernote)', lang: 'EN' },
      { yt: 'MU3GtlkRy3A', t: 'Note Air 6C – rozpakowanie i pierwsze wrażenia', lang: 'EN' }
    ]
  },
  'nauka/boox-go103': {
    videos: [
      { yt: 'YTzxbjojrDw', t: 'Boox Go 10.3 (Gen 2) Lumi – recenzja: „prawie idealny tablet E Ink”', lang: 'EN' },
      { yt: 'x7vK_uYboWs', t: 'BOOX Go 10.3 (Gen II) – wreszcie prawdziwa zmiana', lang: 'EN' },
      { yt: 'pxWfX3Di9Gw', t: 'Boox Go 10.3 Gen II – recenzja', lang: 'EN' }
    ]
  },
  'nauka/remarkable-paper-pro': {
    videos: [
      { yt: 'f5mND1I7Bf8', t: 'reMarkable Paper Pro – recenzja po 6 miesiącach', lang: 'EN' },
      { yt: '45gmAtA8QZ4', t: 'reMarkable Paper Pro – długi test: „myślałem, że zmienię, a ciągle wracam”', lang: 'EN' },
      { yt: 'Q2sEWfGkRj0', t: 'reMarkable Paper Pro – recenzja', lang: 'EN' }
    ]
  },
  'nauka/supernote-manta': {
    videos: [
      { yt: 'GwrF5Ibevf8', t: 'Supernote A5 X2 Manta – recenzja: lepszy niż reMarkable?', lang: 'EN' },
      { yt: 'soi2WvH1uGo', t: 'Supernote Manta po roku – mieszane uczucia', lang: 'EN' },
      { yt: 'N18W_4Xi_Ck', t: 'Supernote Manta – szczegółowy przewodnik', lang: 'EN' }
    ]
  },
  'nauka/pocketbook-inkpad-eo2': {
    videos: [
      { yt: 'w2szNwsIK88', t: 'PocketBook InkPad Eo 2 – recenzja', lang: 'EN' },
      { yt: 'OOEa-o2uj_Q', t: 'PocketBook Eo 2 – najnowsze urządzenie PocketBook', lang: 'EN' }
    ]
  },
  'nauka/kobo-libra-colour': {
    videos: [
      { yt: 'QVUatQQDQmQ', t: 'Kobo Libra Colour – recenzja: kolorowy E Ink, przyciski, pokaz', lang: 'EN' },
      { yt: 'eqbR6fLvMVk', t: 'Kobo Libra Colour po roku (przesiadka z Kindle)', lang: 'EN' },
      { yt: 'T3ftUUb-2q8', t: 'Kobo Libra Colour – szczera recenzja po 6 miesiącach', lang: 'EN' }
    ]
  },
  'nauka/tablet-e-ink': {
    pic: { src: '../images/technologia/urzadzenia/remarkable-tablet.webp', pos: '50% 40%', author: 'Sauer202', license: 'CC BY-SA 4.0', file: 'https://commons.wikimedia.org/wiki/File:ReMarkable_tablet_and_pen.jpg', alt: 'Tablet reMarkable z rysikiem i notatkami na ekranie' },
    videos: [
      { yt: 'qKOHEft5WbI', t: 'reMarkable, Kindle Scribe, Supernote czy Boox? Jak wybrać tablet E Ink', lang: 'EN' },
      { yt: 'I42YavA0gNU', t: 'Porównanie notowania na tabletach E Ink', lang: 'EN' },
      { yt: 'xqR9tI9p1CE', t: 'Porównanie czytania na tabletach E Ink', lang: 'EN' },
      { yt: 'PpTlDZ_6laY', t: 'Kolorowy E Ink: Kindle, reMarkable i BOOX w porównaniu', lang: 'EN' }
    ]
  },
  'nauka/e-podreczniki': {
    pic: { src: '../images/technologia/urzadzenia/kobo-clara-hd.webp', pos: '50% 50%', author: 'DYVER', license: 'CC BY-SA 4.0', file: 'https://commons.wikimedia.org/wiki/File:Kobo_Clara_HD.jpg', alt: 'Czytnik e-booków Kobo' },
    videos: [{ yt: 'xqR9tI9p1CE', t: 'Porównanie czytania na urządzeniach E Ink', lang: 'EN' }]
  },
  'nauka/e-ink': {
    videos: [
      { yt: '6NRT8E5-reM', t: 'Jak działa E Ink: technologia elektronicznego papieru', lang: 'EN' },
      { yt: 'Oqu1--AzM7U', t: 'How E Ink Works', lang: 'EN' }
    ]
  },
  'telefony/nokia-3210-4g': {
    videos: [
      { yt: 'oNYDT9tfouc', t: 'Nokia 3210, czyli telefon bez social mediów', lang: 'PL' },
      { yt: 'hbJONKnpinI', t: 'Nokia 3210 4G – recenzja (Dumbphone Reviews)', lang: 'EN' },
      { yt: 'Co_iDiaQJO0', t: 'Nokia 3210 – test (ShortCircuit)', lang: 'EN' }
    ]
  },
  'telefony/light-phone-iii': {
    videos: [
      { yt: 'fRRNSEb1DAQ', t: 'Dwa tygodnie bez smartfona – recenzja Light Phone III (MrMobile)', lang: 'EN' },
      { yt: 'HdTCDxX-UnQ', t: 'Light Phone III – opinia (Marques Brownlee)', lang: 'EN' },
      { yt: 'ebWLvXdDwNY', t: 'Czy Light Phone III zastąpi iPhone’a? (CNET)', lang: 'EN' }
    ]
  },
  'telefony/xplora-x6play': {
    videos: [
      { yt: 'QIV40HFatzM', t: 'Xplora X6Play – recenzja długoterminowa', lang: 'EN' },
      { yt: 'FfktpTSOvYQ', t: 'Xplora X6Play – krótka recenzja', lang: 'EN' },
      { yt: '5_zdpj1ZHAc', t: 'Xplora X6Play czy XGO3 – który wybrać?', lang: 'EN' }
    ]
  },
  'telefony/mudita-kompakt': {
    videos: [
      { yt: 'Oe6h1ehtuAg', t: 'Polski antysmartfon – Mudita Kompakt', lang: 'PL' },
      { yt: 'XeVhnfzo9v8', t: 'Mudita Kompakt – recenzja', lang: 'EN' },
      { yt: '2cyF8CrEcI8', t: 'Mudita Kompakt – czas przed ekranem po sześciu miesiącach', lang: 'EN' }
    ]
  },
  'telefony/bigme-hibreak-pro-color': {
    videos: [
      { yt: 'C1WnFk0EiLQ', t: 'Bigme HiBreak Pro Color – recenzja', lang: 'EN' },
      { yt: 'cM7cHPARdjY', t: 'Bigme HiBreak Pro Color – wydajny telefon E Ink z jedną poważną wadą', lang: 'EN' },
      { yt: 'gqX8HfYCaP0', t: 'Bigme HiBreak Pro Color jako telefon i czytnik', lang: 'EN' }
    ]
  },
  'telefony/hisense-a9': {
    pic: { src: '../images/technologia/urzadzenia/hisense-a9.webp', pos: '50% 45%', author: 'Bzxfdg', license: 'CC0 1.0', file: 'https://commons.wikimedia.org/wiki/File:Hisense_A9.jpg', alt: 'Telefon Hisense A9 z ekranem E Ink' },
    videos: [
      { yt: 'iZROIjvbICA', t: 'Hisense A9 – recenzja', lang: 'EN' },
      { yt: 'zSYfeSxIcww', t: 'Hisense A9 z systemem LineageOS', lang: 'EN' }
    ]
  },
  'telefony/telefon-e-ink': {
    pic: { src: '../images/technologia/urzadzenia/hisense-a9.webp', pos: '50% 45%', author: 'Bzxfdg', license: 'CC0 1.0', file: 'https://commons.wikimedia.org/wiki/File:Hisense_A9.jpg', alt: 'Telefon Hisense A9 z ekranem E Ink' },
    videos: [
      { yt: 'XeVhnfzo9v8', t: 'Mudita Kompakt – recenzja', lang: 'EN' },
      { yt: '9-6DzUFUO-E', t: 'Telefon, który chce, żebyś używał go mniej – Mudita Kompakt', lang: 'EN' },
      { yt: 'fF-pBZivyVQ', t: 'Rok z Mudita Kompakt jako głównym telefonem', lang: 'EN' }
    ]
  },
  'woda/osmoza': {
    videos: [
      { yt: 'SsOhoDpxS9A', t: 'Jak działa odwrócona osmoza?', lang: 'PL' },
      { yt: 'em_hs0mLFRM', t: 'Jak filtr odwróconej osmozy oczyszcza wodę?', lang: 'PL' },
      { yt: 'uMpGVfk7jXc', t: 'Wymiana wkładów w systemie odwróconej osmozy – instrukcja', lang: 'PL' }
    ]
  },
  'woda/dzbanek': {
    videos: [
      { yt: 'm1BD-V7NksA', t: 'Wielki test filtrów do wody', lang: 'PL' },
      { yt: '9FlIrDfoZmE', t: 'Czy dzbanki filtrujące usuwają wszystkie zanieczyszczenia?', lang: 'PL' }
    ]
  },
  'woda/oczyszczacz': {
    videos: [
      { yt: 'mWpCnjkElfA', t: '8 rzeczy, które musisz wiedzieć przed zakupem oczyszczacza powietrza', lang: 'PL' },
      { yt: 'vNDbEFffQU8', t: 'Oczyszczacz powietrza bez tajemnic – przewodnik od A do Z', lang: 'PL' }
    ]
  },
  'otoczenie/wilgotnosc': {
    videos: [
      { yt: 'tNjuGbeBLRo', t: 'Jak wybrać nawilżacz powietrza?', lang: 'PL' },
      { yt: 'q9lJ4hO8r2Q', t: 'Jaki nawilżacz wybrać?', lang: 'PL' }
    ]
  },
  'zabawa/roboty': {
    videos: [
      { yt: 't-yo2M_zt4Y', t: 'Robot edukacyjny Photon', lang: 'PL', src: 'producent' },
      { yt: 'QWLGmvfKeto', t: 'Photon w przedszkolu', lang: 'PL', src: 'producent' }
    ]
  },
  'mobilnosc/prawo-jazdy-am': {
    videos: [
      { yt: 'avXrOTj6z-I', t: 'Omówienie zadań egzaminacyjnych na placu: kat. AM, A1, A2, A', lang: 'PL' },
      { yt: '3aisol_fUeY', t: '„Ósemka” – jak zdać egzamin (AM, A1, A2, A)', lang: 'PL' }
    ]
  },
  'mobilnosc/bezpieczenstwo': {
    videos: [
      { yt: 'Efamvs2oBoY', t: 'Euro NCAP 2016 – testy zderzeniowe czterokołowców', lang: 'EN' },
      { yt: 'Zet4qF4cE3Q', t: 'Euro NCAP – testy zderzeniowe czterokołowców ciężkich (2014)', lang: 'EN' }
    ]
  },
  'mobilnosc/aixam-city': {
    videos: [{ yt: 'n5cTna_Czes', t: 'Aixam – samochody od 14 roku życia', lang: 'PL', src: 'producent' }]
  },
  'mobilnosc/microcar-mgo': {
    videos: [{ yt: '-GmS3cgGaUE', t: 'Microcar M.GO – prezentacja', lang: 'DE', src: 'producent' }]
  }
};
