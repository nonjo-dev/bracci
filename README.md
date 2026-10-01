# Braccì UF

Statisk webbplats publicerad med GitHub Pages. Fem sidor, ingen
backend, inget byggsteg.

Adress: `https://DITT-NAMN.github.io/bracci/`

| Sida | Fil | Sökväg på sajten |
|---|---|---|
| Start | `index.html` | `/` |
| Armband | `subpages/armband.html` | `/subpages/armband.html` |
| Om oss | `subpages/omoss.html` | `/subpages/omoss.html` |
| Kontakt | `subpages/kontakt.html` | `/subpages/kontakt.html` |
| Betalsätt | `subpages/betalsatt.html` | `/subpages/betalsatt.html` |

## Struktur

```
index.html        startsida
style.css         all styling, gemensam för alla sidor
script.js         meny, scroll-animationer, slideshow, bildvisning
img/              logga (webp + png), armbandsbilder
subpages/         fyra undersidor
.nojekyll         hindrar Jekyll från att bearbeta filerna
```

Alla sidor delar samma `style.css` och `script.js`. Klassen på
`<body>` styr vilka särskilda regler som gäller, exempelvis
`class="bracelet-page"` på armbandssidan och `class="payment-page"`
på betalsättssidan.

## Arbetsflöde

Redigera filerna, committa, pusha. GitHub Pages bygger om sajten
inom en minut eller två.

```bash
git add .
git commit -m "kort beskrivning av ändringen"
git push
```

## Publicering

Sajten publiceras från branchen `main`, direkt från repots rot.
Ingen byggprocess, ingen Jekyll.

Aktivera i GitHub: **Settings → Pages → Source: Deploy from a
branch → Branch: main / (root)**.

## Anmärkningar

- `img/logga.png` (635 KB) ligger kvar som fallback för webbläsare
  utan webp-stöd. `img/logga.webp` (14,5 KB) används i praktiken
  av alla moderna webbläsare via `<picture>`.
- Loggan har ingen alfa-kanal; bakgrunden #f5f4f0 är inbakad i
  bilden. Det fungerar på ljust underlag men inte på den mörka
  footern, där en genomskinlig logga skulle behövas.
- Beställningar görs via Instagram: [@bracci_uf](https://www.instagram.com/bracci_uf/).
- TikTok-länkarna i footern är tomma (`href="#"`) och väntar på ert
  TikTok-konto. Ta bort dem om ni inte har ett.
- GitHub Pages styr cache och saknar HTTP-huvud. Filerna får
  Netlifys standardcaching, som i praktiken innebär att en
  besökare kan behöva hard refresh (Ctrl+Shift+R) efter en
  uppdatering. Det är den främsta skillnaden mot Netlify.
- `img/logga-original.png` är en 1,7 MB backup som inte ingår i
  repot (se `.gitignore`).
