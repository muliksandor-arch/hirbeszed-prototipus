# Hírbeszéd - kattintható prototípus

Aktuális prototípusverzió: **2.000**.

Ez a projekt gyökerében található mobilos PWA-prototípus. A jelenlegi rögzített irány: az app központi élménye a **Felolvasó**, amely hírfelolvasásra, hangutasításokra és gyors hírléptetésre épül.

## Helyi indítás

PowerShellben, a projekt mappájából:

```powershell
py -m http.server 8000 --bind 127.0.0.1
```

Megnyitás:

```text
http://127.0.0.1:8000/?cachebust=local-dev
```

Ha a böngésző régi változatot mutat, használj új `cachebust` értéket, vagy töröld a prototípus adatait az app Beállítások felületén.

## Fő képernyők

- **Hírfolyam**: RSS-forrásokra és témákra szűrt hírlista.
- **Felolvasó**: automatikusan induló, hangvezérelhető hírfelolvasó nézet.
- **Asszisztens**: prototípus-szintű hírkérdező és összefoglaló felület.
- **Beállítások**: RSS-források, témák, megjelenés, hang, fiók és előfizetés.

## Fájlszerkezet

- `index.html`: a prototípus belépési pontja és a modulok betöltési sorrendje.
- `styles.css`: alap layout, telefonkeret, Felolvasó, gombok és globális stílusok.
- `app.js`: alap állapot, renderelés, Felolvasó logika, hangmotor, gombesemények.
- `prototype-onboarding.js`: első használat, regisztráció, próbaidő, RSS-választás.
- `prototype-topics.js`: témák, RSS-források és hírfolyam-bővítmények.
- `prototype-settings.js`: részletesebb beállítási panelek.
- `prototype-reader-controls.js`: Felolvasó gombsor stabilizálása és hanghullám megjelenése.
- `prototype-auth.js`: fiók, előfizetés és prototípus-törlés folyamatok.
- `prototype-layout.js`: helyi elrendezés- és layout-kiegészítések.
- `prototype-auto-preview.js`: ideiglenes Android Auto / CarPlay előnézet.
- `prototype-navigation.js`: alsó menü ikonok, feliratok és Felolvasó elnevezés.
- `sw.js`: PWA cache és service worker.

## Rögzített működés

A részletes magyar működési leírás itt található:

```text
docs/prototipus-mukodes.md
```

Rövid összegzés:

- Első használat: regisztráció -> próbaidő/előfizetés -> RSS-források -> Felolvasó automatikus indítás.
- A Felolvasás gomb pause/folytatás logikával működik, nem indítja elölről a hírt.
- A Hírléptető kikapcsolva a hír végén megállít, visszakapcsolva a következő hírrel indul.
- A Részletes hírek bekapcsolva az aktuális hírt részletes változatban elölről kezdi.
- A Rövidített hírekre visszaváltás a következő rövid hírrel indul.
- A Mikrofon csak a hangutasítások hallgatását kapcsolja, kikapcsolva a parancslista helyén segítő szöveg látszik.
- A Felolvasó oldalon nincs felugró toast üzenet, hogy ne zavarja az autós/vezetési élményt.

## Felületi sablon

A prototípus app-szintű felületi sablonja a `styles.css` elején lévő `--hb-*` tokenekből dolgozik.

- Betűcsalád: `Inter, "Segoe UI", Arial, sans-serif`.
- Tipográfia: a kis kiegészítő szövegek, metaadatok, kártyacímek, gombok, képernyőcímek és hero címek külön tokenméretet kapnak.
- Kártyák: az általános kártyasugár `18px`, a nagy hero felületek sugara `24px`.
- Gombok: az elsődleges és másodlagos fő gombok alapmagassága `50px`, lekerekítésük `16px`.
- A sablon az onboarding, Felolvasó, Hírfolyam, Asszisztens, Beállítások, sheet/panel és előfizetési felületekre is rá van húzva.

## GitHub Pages

A kattintható prototípus belépési pontja a gyökérben lévő `index.html`. Feltöltéskor ezek a fő fájlok kellenek:

- `index.html`
- `styles.css`
- `app.js`
- `prototype-*.js`
- `prototype-*.css`
- `topics.json`
- `manifest.webmanifest`
- `sw.js`
- `assets/brand/`
- `assets/prototype/`

A `docs/wireframes/osszes-oldal.html` csak statikus képernyőterv, nem ez a futtatandó prototípus.
