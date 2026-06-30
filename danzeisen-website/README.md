# Sanitätshaus Danzeisen – Webseite

Moderne, interaktive One-Page-Webseite für das **Sanitätshaus Danzeisen** (München, seit 1928).
Reine statische Seite – **kein Build, kein Server nötig**. Einfach auf die Domain hochladen.

## Inhalt

```
danzeisen-website/
├── index.html      → die komplette Seite
├── css/styles.css  → Design (inkl. Dark Mode)
└── js/main.js      → Interaktion & Animationen
```

## Hochladen auf deine Domain

Lade den **gesamten Ordner `danzeisen-website/`** per FTP / Hosting-Panel in das
Web-Root (z. B. `public_html/` oder `htdocs/`). Wichtig ist nur, dass die Ordner-
struktur erhalten bleibt (`css/` und `js/` neben der `index.html`).

Danach ist die Seite unter `https://deine-domain.de/` erreichbar.

> Möchtest du die Dateien direkt im Root statt im Unterordner haben, kopiere den
> **Inhalt** von `danzeisen-website/` ins Web-Root.

## Lokal ansehen

```bash
cd danzeisen-website
python3 -m http.server 8080
# → http://localhost:8080
```

## Funktionen

- **Live-Öffnungszeiten-Status** (Mo–Fr 9–13 / 14–18, Sa 9–13) – „Jetzt geöffnet / geschlossen“.
- **Dark Mode** mit Speicherung (folgt auch der System-Einstellung).
- **Scroll-Showcases „Produktwelten“** – animierte SVG-Illustrationen, die sich beim
  Scrollen aufbauen, damit jedes Produkt sofort verständlich ist.
- **Filterbares & durchsuchbares Sortiment** (Kompression, Orthopädie, Reha, Pflege, Frau & Familie).
- **Interaktiver Standort-Umschalter** mit Karte & Routenplanung (Laim, Pasing, Neuhausen).
- **Testimonial-Slider, FAQ-Akkordeon, animierte Zähler, Scroll-Fortschritt**, Mobile-Menü.
- **Zwei Kontaktformulare** (Schnell-Rückruf + ausführlich) mit Validierung.

## Anpassen

Alle Inhalte stehen in `index.html`. Produkte und Standorte lassen sich bequem in
`js/main.js` in den Arrays `PRODUCTS` und `LOCATIONS` pflegen.

### Formulare aktivieren
Die Formulare zeigen aktuell eine Erfolgsmeldung (Demo, kein Backend). Für echten
Versand entweder einen Dienst wie [Formspree](https://formspree.io) eintragen
(`<form action="https://formspree.io/f/DEIN_ID" method="POST">`) oder die Daten an
ein eigenes Skript senden.

## Hinweise / Platzhalter

- **Telefonnummern, Adressen, E-Mail** beruhen auf öffentlich auffindbaren Angaben
  zu Danzeisen München – bitte vor Veröffentlichung gegenprüfen.
- **Impressum / Datenschutz / Cookies** im Footer sind Platzhalter-Links und müssen
  rechtlich noch befüllt werden (Pflicht in Deutschland).
- Bilder sind bewusst als SVG-Illustrationen umgesetzt (schnell, scharf, kein Lizenz-
  thema). Eigene Fotos lassen sich jederzeit ergänzen.
