# Braccì UF

Statisk webbplats för Braccì UF. Fem sidor, ingen backend, inget
byggsteg.

| Sida | Fil |
|---|---|
| Start | `index.html` |
| Armband | `subpages/armband.html` |
| Om oss | `subpages/omoss.html` |
| Kontakt | `subpages/kontakt.html` |
| Betalsätt | `subpages/betalsatt.html` |

## Struktur

```
index.html        startsida
style.css         all styling, gemensam för alla sidor
script.js         meny, scroll-animationer, slideshow, bildvisning
img/              logga (webp + png), armbandsbilder
subpages/         fyra undersidor
_headers          cache- och säkerhetshuvud för Netlify
```

Alla sidor delar samma `style.css` och `script.js`. Klassen på
`<body>` styr vilka särskilda regler som gäller, exempelvis
`class="bracelet-page"` på armbandssidan och `class="payment-page"`
på betalsättssidan.

## Arbetsflöde

Redigera filerna, committa, pusha. Sajten uppdateras automatiskt
inom någon sekund.

```bash
git add .
git commit -m "kort beskrivning av ändringen"
git push
```

## Publicering

Repot är kopplat till Netlify. Varje push till `main` bygger och
publicerar sajten automatiskt. Deployinställningar:

- Publish directory: `.`
- Build command: lämnas tomt (ingen byggprocess)

`_headers` läses automatiskt av Netlify. Den innehåller
cache-inställningar och Content-Security-Policy.

## Anmärkningar

- `img/logga.png` (635 KB) ligger kvar som fallback för
  webbläsare utan webp-stöd. `img/logga.webp` (14,5 KB) används i
  praktiken av alla moderna webbläsare via `<picture>`.
- Loggan har ingen alfa-kanal; bakgrunden #f5f4f0 är inbakad i
  bilden. Det fungerar på ljust underlag men inte på den mörka
  footern, där en genomskinlig logga skulle behövas.
- Beställningar görs via Instagram. Sök och ersätt
  `DITT_INSTAGRAM_NAMN` på undersidorna.
