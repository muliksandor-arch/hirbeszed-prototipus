# Hírbeszéd – termék- és működési specifikáció

**Verzió:** 0.1  
**Állapot:** tervezési alap, fejlesztés előtti egyeztetésre  
**Elsődleges nyelv:** magyar  
**Célplatformok:** iPhone, Android, Apple CarPlay, Android Auto

## 1. Termékvízió

A Hírbeszéd egy RSS-alapú hírolvasó, amely két egyenrangú használati módot kapcsol össze:

1. hagyományos, képes és görgethető mobilos hírfolyam;
2. vezetés közben használható, automatikus felolvasás és természetes hangvezérlés.

Az alkalmazás nem saját hírtartalmat gyárt. A felhasználó által engedélyezett RSS-forrásokból dolgozik, megőrzi a hír eredeti forrását és linkjét, valamint egyértelműen jelzi, ha csak az RSS-ben elérhető rövid kivonat áll rendelkezésre.

## 2. Rögzített termékdöntések

- A fő navigáció négy eleme: **Hírfolyam**, **Autós mód**, **Asszisztens**, **Beállítások**.
- Az alkalmazás alapértelmezett kezdőlapja az Autós mód.
- A hírfolyamban nincs hangvezérlés és automatikus felolvasás.
- Az olvasott, meghallgatott és átugrott hír egységesen **olvasott** állapotú.
- A **Mentve későbbre** az olvasottságtól független állapot.
- A hírfolyam alapértelmezett rendezése fordított időrend: a legfrissebb hír van felül.
- A mobilnetes működés alapértelmezetten engedélyezett.
- A helyi hírekhez csak opcionális, hozzávetőleges helyadatot használunk.
- A hírek, az előzmények és a személyre szabási profil elsődlegesen a készüléken maradnak.
- Nem üzemeltetünk hagyományos saját szervert. A hitelesítéshez, opcionális szinkronhoz és AI-kapcsolathoz menedzselt háttérszolgáltatás használható.
- A telefonos Autós mód pontosan három nagy vezérlőt tartalmaz. A CarPlay és Android Auto a saját, kötelező médiavezérlőit is megjelenítheti.

## 3. Felhasználói szerepkör

Az első kiadásban egyetlen végfelhasználói szerepkör van. Kiadói vagy szerkesztői felület nem készül.

A felhasználó:

- forrásokat és témákat választ;
- híreket olvas, hallgat, ment és keres;
- vezeti saját érdeklődési profilját;
- az asszisztenssel beszélget a betöltött hírekről;
- szabályozza az értesítéseket, adatforgalmat és adatkezelést.

## 4. Alkalmazástérkép

### 4.1. Belépés előtti képernyők

1. Indítóképernyő
2. Rövid termékbemutató
3. Regisztráció és belépés
4. E-mail/telefon ellenőrzése
5. Első beállítás
   - témák kiválasztása;
   - ajánlott RSS-források kiválasztása;
   - értesítési preferencia;
   - helyi hírek opcionális engedélyezése;
   - hang és felolvasási sebesség kipróbálása.

### 4.2. Hírfolyam

- Fő hírfolyam
- Téma- és forrásszűrő
- Keresés
- Mentett hírek
- Előzmények
- Hírrészletek
- Eredeti cikk megnyitása

### 4.3. Autós mód

- Aktuális hír és lejátszási állapot
- Hangutasítási mini súgó
- Hangalapú beszélgetés az aktuális hírről
- Hiba- és kapcsolatállapotok

### 4.4. Asszisztens

- Élő hangbeszélgetés
- Gépeléses cset
- Néma mód
- Forrásokkal ellátott válaszok
- Asszisztensi előzmények

### 4.5. Beállítások

- RSS-források
- Témák és érdeklődés
- Értesítések
- Megjelenés
- Hang és autós mód
- Mobiladat, offline tartalom és tárhely
- Helyi hírek
- Nyelv
- Fiók és biztonság
- Adatvédelem és adatok törlése
- Súgó

## 5. Regisztráció és fiók

### 5.1. Belépési módok

- Apple
- Google
- Facebook
- E-mail
- Telefonszám

Az iOS-verzióban az Apple-belépés a többi közösségi belépéssel azonos hangsúllyal jelenik meg.

### 5.2. Ajánlott biztonsági modell

- A közösségi fiókok hitelesítését az adott szolgáltató végzi.
- E-mailes regisztrációnál e-mail-cím ellenőrzése szükséges.
- Telefonszámos belépésnél egyszer használatos SMS-kód szükséges.
- Új vagy gyanús készüléknél külön megerősítés kérhető.
- A kétlépcsős védelem választható; adminisztrátori rendszer esetén kötelező.
- A munkamenet visszavonható a Fiók és biztonság oldalon.
- A felhasználó az alkalmazáson belül kezdeményezheti a fiók törlését.

### 5.3. Fiók-összekapcsolás

Azonos személy Apple-, Google-, Facebook-, e-mail- és telefonszámos belépése egyetlen profilhoz kapcsolható. Összekapcsolás előtt újrahitelesítés szükséges.

## 6. Első beállítás

Az első beállítás legfeljebb öt rövid lépésből áll, és később minden eleme módosítható.

1. Legalább három érdeklődési téma kiválasztása.
2. Ajánlott magyar RSS-források bekapcsolása.
3. Értesítési alapmód kiválasztása: kikapcsolva, rendkívüli hírek, napi összefoglaló.
4. Helyi hírek opcionális bekapcsolása vagy város kézi kiválasztása.
5. Magyar felolvasóhang és sebesség próbája.

A rendszerengedélyeket csak akkor kérjük, amikor a hozzájuk tartozó funkciót a felhasználó bekapcsolja.

## 7. Hírfolyam

### 7.1. Hírkártya

Minden kártya tartalmazza:

- RSS-kép vagy semleges forráshelyettesítő;
- forrás neve;
- kategória;
- közzététel ideje;
- cím;
- rövid kivonat;
- mentés gomb;
- olvasottsági jelzés.

A kártyára kattintva megnyílik a hírrészlet, és a hír olvasottá válik.

### 7.2. Rendezés és szűrés

Rendezési módok:

- Legfrissebb;
- Nekem ajánlott;
- Csak olvasatlan.

Szűrés:

- téma;
- forrás;
- időszak;
- mentett hírek.

### 7.3. Frissítés

- lefelé húzással kézi frissítés;
- alkalmazás megnyitásakor automatikus frissítés;
- aktív Autós módban időzített frissítés;
- háttérben az operációs rendszer által engedélyezett, legjobb igyekezet szerinti frissítés.

Választható kívánt gyakoriság:

- 15 perc;
- 30 perc;
- 60 perc;
- 3 óra;
- csak kézzel.

A beállított idő háttérben nem garantált, mert az iOS és az Android korlátozhatja a futást.

## 8. Hírrészletek

A részletes nézet az RSS-ben rendelkezésre álló tartalmat mutatja:

- kép;
- cím;
- forrás, szerző és időpont;
- RSS-leírás vagy tartalom;
- eredeti cikk megnyitása;
- mentés;
- megosztás;
- olvasatlanra jelölés;
- kapcsolódó, helyben talált hírek.

Az alkalmazás nem ígér teljes cikket, ha az RSS csak kivonatot szolgáltat.

## 9. Keresés, mentések és előzmények

### 9.1. Keresés

A keresés a helyi hír-adatbázisban működik:

- cím;
- kivonat;
- forrás;
- téma;
- dátum.

Hang alapú keresés az Asszisztensben és az Autós módban használható, a Hírfolyam képernyőjén nem.

### 9.2. Mentett hírek

- olvasottságtól függetlenek;
- automatikusan nem törlődnek;
- offline elérhetők, ha a tartalom már letöltődött;
- manuálisan törölhetők;
- kereshetők és témák szerint szűrhetők.

### 9.3. Előzmények

Az előzmények időrendben mutatják az olvasott, meghallgatott és átugrott híreket. A felhasználó:

- egy elemet törölhet;
- minden előzményt törölhet;
- újra olvasatlanná tehet egy hírt;
- kikapcsolhatja az előzményekből történő személyre szabást.

## 10. Autós mód – telefonos felület

### 10.1. Látható elemek

- aktuális RSS-kép;
- hír címe;
- forrás és kategória;
- állapot: Betöltés, Felolvasás, Figyelek, Gondolkodom, Beszélgetés, Szünet vagy Leállítva;
- rövid hangutasítási súgó;
- három nagy gomb.

### 10.2. A három gomb

1. **Mikrofon** – hangutasítások be- vagy kikapcsolása.
2. **Automatikus következő** – a hír végén továbblépés be- vagy kikapcsolása.
3. **Leállítás/Folytatás** – a felolvasás tényleges leállítása; nem a hangerőt némítja.

A gombok legalább 48×48 pontos érintési területet kapnak, magas kontraszttal és rövid felirattal.

### 10.3. Lejátszási folyamat

1. A rendszer kiválasztja a legfrissebb olvasatlan hírt a szűrt hírfolyamból.
2. Megjeleníti a képét és címét.
3. Felolvassa a forrást, a címet és a rövid RSS-tartalmat.
4. Beszéd érzékelésekor azonnal megszakítja a felolvasást.
5. Meghallgatja, értelmezi és végrehajtja a kérést.
6. Válasz után folytatja a hírt vagy a kért műveletet hajtja végre.
7. A hír végén olvasottnak jelöli.
8. Bekapcsolt automatikus következő esetén rövid szünet után továbblép.
9. Kikapcsolt automatikus következő esetén várakozik.

Az átugrott hír azonnal olvasottá válik.

### 10.4. Állapotgép

| Állapot | Jelentés | Lehetséges következő állapot |
|---|---|---|
| Betöltés | Hír vagy kép betöltése | Felolvasás, Hiba |
| Felolvasás | A rendszer beszél | Figyelek, Szünet, Leállítva, Következő |
| Figyelek | A felhasználó beszélhet | Értelmezés, Felolvasás, Hiba |
| Értelmezés | Szándék felismerése | Válasz, Felolvasás, Hiba |
| Válasz | Rövid hangválasz | Felolvasás, Beszélgetés, Következő |
| Beszélgetés | Élő párbeszéd az aktuális hírről | Beszélgetés, Felolvasás, Leállítva |
| Szünet | A sor megmarad, nincs felolvasás | Felolvasás, Leállítva |
| Leállítva | A munkamenet nem halad tovább | Betöltés, Felolvasás |
| Hiba | Hálózati, RSS-, hang- vagy jogosultsági hiba | Újrapróbálás, Következő, Leállítva |

### 10.5. Beszédmegszakítás

- A felhasználó beszéde elsőbbséget élvez a felolvasással szemben.
- Az érzékeléskor a TTS azonnal megáll vagy lehalkul.
- Sikertelen felismeréskor az alkalmazás röviden jelzi: „Nem értettem”, majd folytatja, ha a felhasználó nem próbálkozik újra.
- Kikapcsolt mikrofonnál nincs automatikus megszakítás; csak a képernyő és az autó fizikai médiavezérlői használhatók.
- Telefonhívás és navigációs hang elsőbbséget kap. A felolvasás ezután folytatható.

## 11. Hangutasítások

Az alkalmazás szándékokat értelmez, nem kizárólag pontos kulcsszavakat.

| Szándék | Példák |
|---|---|
| Következő | „Következő”, „Menjünk tovább”, „Ez nem érdekel” |
| Előző | „Előző hír”, „Menj vissza” |
| Újra | „Olvasd újra”, „Kezdd elölről” |
| Szünet | „Állj meg egy pillanatra”, „Szünet” |
| Folytatás | „Folytasd”, „Mehet tovább” |
| Leállítás | „Állítsd le”, „Fejezzük be” |
| Részletek | „Mondj róla többet”, „Érdekelnek a részletek” |
| Mentés | „Mentsd el későbbre”, „Tedd a mentettek közé” |
| Automatikus ugrás | „Ne lépj tovább automatikusan”, „Kapcsold vissza az automatikus következőt” |
| Mikrofon | „Kapcsold ki a mikrofont”, „Most ne figyelj” |
| Forrás | „Melyik lap írta?”, „Mikor jelent meg?” |
| Keresés | „Van új hír erről?”, „Keress technológiai híreket” |
| Beszélgetés | „Beszéljük meg”, „Mit jelent ez?” |
| Vissza a hírekhez | „Folytassuk a híreket”, „Vissza a hírfolyamhoz” |

Biztonsági vagy romboló műveletet, például teljes előzménytörlést, hangutasítással csak megerősítés után hajtunk végre.

## 12. Beszélgetés az autóban

A felhasználó az aktuális hírből hanggal beszélgetést indíthat. Beszélgetés közben:

- az aktuális hír marad vizuális kontextusként;
- a hírsor szünetel;
- a rendszer rövid, vezetés közben követhető válaszokat ad;
- megnevezi, mely betöltött hírek alapján válaszol;
- kérésre kapcsolódó hírt keres a helyi adatbázisban vagy frissíti az engedélyezett RSS-forrásokat;
- a „vissza a hírekhez” utasítás visszatér a lejátszási sorhoz.

Ha a kérdéshez nincs elegendő betöltött forrás, az asszisztens ezt kimondja. Nem állít nem ellenőrzött tényt hírként.

## 13. CarPlay és Android Auto

Az autós rendszerekben a Hírbeszéd médiaalkalmazásként működik.

Leképezés:

- RSS-kép → médiaborító;
- hírcím → aktuális elem címe;
- forrás és kategória → alcím/metaadat;
- felolvasás → médiahang;
- következő/előző/leállítás → médiavezérlés;
- beszélgetés → ugyanazon munkamenet hangalapú állapota.

A jármű kijelzőjén nincs hagyományos csetablak vagy hosszú szöveges átirat. Az élő cset hangban érhető el. A telefonos Asszisztens nézet továbbra is teljes szöveges előzményt mutat.

A platform által kötelezően megjelenített standard médiagombokat az alkalmazás nem feltétlenül tudja elrejteni. A pontos megjelenést korai technikai prototípussal kell ellenőrizni mindkét rendszeren.

## 14. Asszisztens

### 14.1. Módok

- **Hangmód:** alapértelmezett, élő beszélgetés.
- **Gépelés:** hagyományos szöveges cset.
- **Néma mód:** gépelt kérdés és csak írott válasz.

### 14.2. Képességek

- keresés a letöltött hírek között;
- RSS-források frissítése;
- aktuális vagy több hír összefoglalása;
- eltérő források összevetése;
- mentés későbbre;
- hírfolyam szűrése;
- források, témák és értesítések módosítása megerősítéssel;
- napi vagy témánkénti hírösszefoglaló;
- visszatérés az Autós mód lejátszási sorához.

### 14.3. Válaszok minősége

- Minden hírjellegű válaszhoz forrás és dátum tartozik.
- A tény, összefoglalás és következtetés elkülönül.
- Több forrás esetén az eltéréseket jelzi.
- Hiányos RSS-tartalomnál nem talál ki részleteket.
- A válaszok autóban rövidebbek, telefonos csetben részletesebbek lehetnek.

## 15. RSS-források

### 15.1. Kezelés

- előre telepített, kikapcsolható magyar forráslista;
- ajánlott források témák szerint;
- új forrás hozzáadása RSS-linkkel;
- URL ellenőrzése és előnézete mentés előtt;
- forrás átnevezése vagy eltávolítása;
- forrásonkénti értesítés;
- forrásonkénti mobiladat-engedély későbbi lehetőségként.

### 15.2. Helyi feldolgozás

- ETag és Last-Modified használata, ha a forrás támogatja;
- időzóna és dátum normalizálása;
- HTML tisztítása;
- kép kiválasztása RSS enclosure, media vagy tartalmi kép alapján;
- eredeti link és forrás megőrzése;
- hibás és átirányított feedek kezelése;
- letöltési hibák elkülönítése forrásonként.

### 15.3. Duplikációszűrés

Beállítási szintek:

- Kikapcsolva;
- Normál;
- Szigorú.

A normál mód azonos GUID vagy normalizált URL alapján szűr. A szigorú mód ezen felül címhasonlóságot, forrást és megjelenési időt is figyelembe vesz.

## 16. Témarendszer

Alap témák:

- Belföld;
- Külföld;
- Világhírek;
- Politika – belföld;
- Politika – külföld;
- Gazdaság – belföld;
- Gazdaság – külföld;
- Sport;
- Technológia;
- Tudomány;
- Egészség;
- Kultúra;
- Mozi és sorozatok;
- Bulvár;
- Életmód;
- Autó és közlekedés;
- Helyi hírek;
- Egyéb.

Elsődleges besorolásként az RSS saját kategóriája használható. Ismeretlen vagy eltérő kategóriát a készülék helyi megfeleltetési táblája rendel az általános témákhoz.

## 17. Helyi személyre szabás

A „Nekem ajánlott” sorrend helyben számolható az alábbi tényezőkből:

- frissesség;
- téma iránti érdeklődés;
- forrás iránti érdeklődés;
- részletek kérése;
- mentés;
- átugrás;
- helyi relevancia;
- ismétlődés és túl gyakori forrás miatti csökkentés.

Alapelvek:

- a frissesség mindig erős súly marad;
- egyetlen forrás nem uralhatja a teljes ajánlott listát;
- a felhasználó megtekintheti és törölheti érdeklődési profilját;
- a Legfrissebb mód teljesen független a személyre szabástól.

## 18. Értesítések

### 18.1. Választható értesítések

- rendkívüli hírek;
- napi összefoglaló;
- téma;
- RSS-forrás;
- helyi hírek;
- mentett témához kapcsolódó új hírek.

### 18.2. Szabályozás

- csendes időszak;
- napi maximális darabszám;
- mobilnetes frissítés engedélyezése;
- „Miért kaptam ezt?” magyarázat;
- azonos vagy hasonló értesítések összevonása.

Saját RSS-szerver nélkül a háttérben történő frissítés és helyi értesítés nem garantáltan azonnali. Valós idejű rendkívüli push későbbi, felhőalapú RSS-feldolgozást igényelne.

## 19. Megjelenés és hozzáférhetőség

- Rendszer szerinti, világos és sötét téma.
- Dinamikus betűméret.
- Képernyőolvasó-kompatibilis címkék.
- Magas kontraszt.
- Színtől független állapotjelzés.
- Nagy érintési célok az Autós módban.
- Felirat és vizuális visszajelzés a hangállapotokról.
- A mozgások csökkenthetők.

## 20. Mobiladat, offline mód és tárhely

Alapértelmezetten mobilneten is működik:

- RSS-frissítés;
- képek letöltése;
- hangalapú szolgáltatások, ha külső szolgáltatás szükséges.

Beállítható:

- mobiladat teljes tiltása;
- képek tiltása mobilneten;
- roaming tiltása;
- előtöltendő hírek száma;
- gyorsítótár maximális mérete;
- hírek megőrzése 7, 30 vagy 90 napig;
- automatikus gyorsítótár-tisztítás.

A mentett hírek nem törlődnek az automatikus takarításkor.

## 21. Helyadat

- Alapból kikapcsolva.
- Bekapcsoláskor hozzávetőleges, használat közbeni helyengedélyt kér.
- Kézzel kiválasztott város vagy régió mindig használható alternatívaként.
- Nem tárol helyelőzményt.
- Nem változtatja meg váratlanul a teljes hírfolyamot; a helyi hírek külön téma vagy blokk.
- A felhasználó bármikor törölheti a helyi beállítást.

## 22. Adatmodell

### 22.1. Helyi entitások

**Source**

- azonosító;
- név;
- RSS URL;
- weboldal URL;
- ikon;
- engedélyezett állapot;
- frissítési metaadatok;
- utolsó sikeres és sikertelen frissítés.

**Article**

- helyi azonosító;
- RSS GUID;
- normalizált eredeti URL;
- forrásazonosító;
- cím;
- kivonat vagy RSS-tartalom;
- kép URL vagy helyi elérési út;
- szerző;
- megjelenési idő;
- témák;
- deduplikációs ujjlenyomat.

**ArticleState**

- olvasott;
- mentett;
- olvasás ideje;
- utolsó interakció;
- törölt vagy elrejtett állapot.

**Interaction**

- cikkazonosító;
- esemény: megnyitás, felolvasás, átugrás, részletek, mentés, keresési találat;
- időpont;
- személyre szabásban felhasználható-e.

**Preferences**

- téma és forrás beállítások;
- értesítések;
- megjelenés;
- adatforgalom;
- hang;
- autós mód;
- helyi hírek;
- nyelv;
- személyre szabási súlyok.

### 22.2. Opcionálisan szinkronizált adatok

- minimális felhasználói profil;
- engedélyezett források;
- beállítások;
- mentett hírek URL-jei;
- olvasottsági ujjlenyomatok korlátozott időtartamban.

Pontos helyadat, mikrofonfelvétel és teljes letöltött cikktartalom nem kerül felhőbe.

## 23. Technikai felépítés

### 23.1. Készüléken

- natív RSS-letöltés és -feldolgozás;
- helyi, titkosított adatbázis;
- képek gyorsítótára;
- rendszer TTS;
- rendszer vagy helyi beszédfelismerés;
- helyi parancsértelmező az alapvető autós utasításokhoz;
- helyi kereső és személyre szabás;
- CarPlay és Android Auto média-integráció.

### 23.2. Menedzselt szolgáltatásban

- Apple, Google, Facebook, e-mail és telefonos hitelesítés;
- opcionális beállítás- és mentésszinkron;
- AI-szolgáltatás titkos kulcsának védelme;
- rövid életű AI-munkamenetek létrehozása;
- opcionális push értesítés.

### 23.3. Fontos biztonsági szabály

AI-, SMS- vagy más szolgáltatói titkos kulcs nem építhető közvetlenül a mobilalkalmazásba. A kulcsot menedzselt titoktároló és minimális serverless funkció védi.

## 24. Hibaállapotok

Az alkalmazás érthető, rövid visszajelzést ad:

- nincs internet;
- egy RSS-forrás nem érhető el;
- hibás RSS-link;
- nincs új olvasatlan hír;
- nem tölthető be a kép;
- nincs mikrofonengedély;
- a beszéd nem volt érthető;
- a felolvasóhang nem érhető el;
- az AI-szolgáltatás nem elérhető;
- a helyi tárhely megtelt;
- a CarPlay vagy Android Auto kapcsolat megszakadt.

Egyetlen hibás RSS-forrás nem állíthatja le a teljes frissítést vagy az Autós módot.

## 25. Első kiadás – MVP

### Benne van

- teljes magyar felület;
- regisztráció Apple, Google, Facebook és e-mail használatával;
- telefonszámos belépés, ha a választott hitelesítési csomag támogatja;
- ajánlott és kézzel megadott RSS-források;
- időrendi hírfolyam;
- olvasott és mentett állapot;
- keresés és előzmények;
- világos, sötét és rendszer szerinti téma;
- mobiladat-beállítások;
- telefonos Autós mód három gombbal;
- automatikus felolvasás és továbblépés;
- megszakítható beszéd és alapvető természetes parancsok;
- CarPlay és Android Auto média-integrációs prototípus;
- Asszisztens hang-, gépeléses és néma móddal;
- helyi személyre szabás első változata;
- opcionális hozzávetőleges helyi hírek.

### Nem része az első kiadásnak

- saját RSS-gyűjtő szerver;
- kiadói adminisztráció;
- közösségi kommentek;
- teljes internetes hírfeltérképezés;
- garantált valós idejű rendkívüli értesítés;
- többnyelvű tartalmi felület a magyar mellett;
- reklám- és előfizetési rendszer.

## 26. Kritikus technikai próbák fejlesztés előtt

1. RSS-kép, cím és leírás megjelenítése egy valós magyar feedből.
2. Magyar TTS működése lezárt képernyőn és Bluetooth-on.
3. Beszéddel történő felolvasás-megszakítás zajos környezetben.
4. Telefonhívás és navigációs hang utáni helyes folytatás.
5. CarPlay médiaborító, cím és engedélyezett vezérlők.
6. Android Auto médiaborító, cím és engedélyezett vezérlők.
7. Élő hangbeszélgetés késleltetése és mobiladat-használata.
8. Háttérfrissítés tényleges gyakorisága iOS-en és Androidon.

## 27. Elfogadási feltételek az első működő prototípushoz

- Legalább öt valós RSS-forrás hírei időrendben megjelennek.
- A felhasználó hozzáadhat és kikapcsolhat forrást.
- Egy hír megnyitáskor olvasottá válik.
- Egy hír menthető, kereshető és újra megnyitható.
- Az Autós mód automatikusan felolvassa a legfrissebb olvasatlan hírt.
- A felhasználói beszéd megszakítja a felolvasást.
- A „következő”, „részletek”, „mentsd el”, „állj” és „folytasd” szándék működik.
- Bekapcsolt automatikus módban a következő hír magától elindul.
- Kikapcsolt automatikus módban a rendszer várakozik.
- Az átugrott hír olvasottá válik.
- A világos és sötét mód minden fő képernyőn olvasható.
- Hálózati hiba nem okoz adatvesztést vagy alkalmazás-összeomlást.

## 28. Fejlesztési ütemezés

### 0. szakasz – termékterv

- jelen specifikáció jóváhagyása;
- képernyővázlatok;
- kezdő RSS-lista;
- vizuális arculat.

### 1. szakasz – technikai kockázatcsökkentés

- RSS-próba;
- TTS és beszédmegszakítás;
- CarPlay és Android Auto proof of concept;
- háttérfrissítési próba.

### 2. szakasz – mobilos alap

- belépés;
- helyi adatbázis;
- Hírfolyam;
- hírrészletek;
- keresés, mentések, előzmények;
- Beállítások.

### 3. szakasz – autós élmény

- lejátszási sor;
- hangparancsok;
- automatikus továbblépés;
- Bluetooth, hívás és navigáció kezelése;
- autós rendszerintegráció.

### 4. szakasz – asszisztens és személyre szabás

- élő cset;
- forrásos válaszok;
- helyi érdeklődési modell;
- ajánlott sorrend;
- opcionális szinkron.

### 5. szakasz – kiadás

- hozzáférhetőségi teszt;
- adatvédelmi dokumentumok;
- valós autós teszt;
- alkalmazásbolti ellenőrzés;
- béta és hibajavítás.

## 29. Következő tervezési feladat

**Elkészült képernyőrendszer:** [wireframes/KEPERNYO-INDEX.md](wireframes/KEPERNYO-INDEX.md)

A teljes, 33 képernyős képernyőrendszer világos és sötét témában elkészült, és v1.0-s végleges vizuális alapként a jóváhagyott logó- valamint színrendszert használja. A következő feladat a fő felhasználói folyamatok kattintható prototípusa, majd a CarPlay és Android Auto technikai próba.
