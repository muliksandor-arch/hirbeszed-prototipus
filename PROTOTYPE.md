# Hírbeszéd – kattintható prototípus

Ez a projekt gyökerében található mobilos PWA-prototípus. A kezdőképernyő az Autós mód.

## Helyi megnyitás

PowerShellben, a projekt mappájából:

```powershell
py -m http.server 4173
```

Ezután: `http://localhost:4173`

## GitHub Pages frissítése

A repository gyökerébe kell feltölteni:

- `index.html`
- `styles.css`
- `app.js`
- `manifest.webmanifest`
- `sw.js`
- `assets/brand/`
- `assets/prototype/`

A `docs/wireframes/osszes-oldal.html` csak a statikus képernyőterv; a kattintható prototípus belépési pontja a gyökérben lévő `index.html`.

