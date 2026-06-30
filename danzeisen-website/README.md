# Sanitätshaus Danzeisen – Webseite (3D)

Moderne, interaktive One-Page-Webseite für das **Sanitätshaus Danzeisen** (München, seit 1928)
mit **realistischen 3D-Scroll-Szenen**. Statisch, **kein Build nötig** – einfach auf die Domain hochladen.

## Inhalt

```
danzeisen-website/
├── index.html          → die komplette Seite
├── css/styles.css      → Design (hell, premium)
├── js/scene.js         → 3D-Engine (Three.js, ES-Modul)
├── js/main.js          → UI (Nav, Standorte, Formular)
└── vendor/             → Three.js lokal (keine externen Abhängigkeiten)
    ├── three.module.js
    └── jsm/environments/RoomEnvironment.js
```

## Hochladen auf deine Domain

Lade den **gesamten Ordner `danzeisen-website/`** ins Web-Root (z. B. `public_html/`).
Die Ordnerstruktur (`css/`, `js/`, `vendor/` neben `index.html`) muss erhalten bleiben.

> **Wichtig:** Der Server muss `.js`-Dateien mit dem MIME-Type `text/javascript`
> ausliefern (Standard bei allen üblichen Hostern), da `scene.js` ein ES-Modul ist.

## Lokal ansehen

ES-Module brauchen einen Webserver (nicht per `file://` öffnen):

```bash
cd danzeisen-website
python3 -m http.server 8080
# → http://localhost:8080
```

## Die 3D-Szenen

Eine fixe WebGL-Bühne (Three.js) zeigt beim Scrollen pro Thema ein realistisch
beleuchtetes, prozedural modelliertes Produkt:

1. **Kompression** – Bein mit Kompressionsstrumpf
2. **Orthopädie** – orthopädische Einlage (Fußbett, Längsgewölbe, Fersenmulde)
3. **Bandagen & Orthesen** – Knieorthese mit Scharnieren und Gurten
4. **Reha & Mobilität** – Rollstuhl mit Speichenrädern
5. **Gehhilfen & Alltag** – Gehstock mit ergonomischem Griff

Technik: physikalisch basierte Materialien (PBR), Studio-Licht über `RoomEnvironment`,
weiche Radial-Bodenschatten, sanftes Schwenken (statt Volldrehung, damit alles
lesbar bleibt) und dezente Maus-Parallaxe. Auf dem Smartphone steht das Produkt
oben, der Text darunter. `prefers-reduced-motion` wird respektiert; ohne WebGL
bleibt die Seite voll lesbar.

## Weitere Funktionen

- Premium-Hero, Scroll-Fortschritt, animierte Zähler, Scrollspy, Mobile-Menü
- Interaktiver Standort-Umschalter mit Karte & Routenplanung (Laim, Pasing, Neuhausen)
- Kontaktformular mit Validierung
- Hell, ohne Dark Mode (bewusst, für ein ruhiges, vertrauenswürdiges Bild)

## Anpassen

- **Produkte/Reihenfolge:** Texte in `index.html` (`.scene`-Blöcke), 3D-Modelle und
  Reihenfolge in `js/scene.js` (`CONFIG` + die `build…`-Funktionen).
- **Standorte:** Array `LOCATIONS` in `js/main.js`.
- **Formular aktivieren:** aktuell Demo-Bestätigung (kein Backend). Für echten Versand
  z. B. [Formspree](https://formspree.io): `<form action="https://formspree.io/f/DEIN_ID" method="POST">`.

## Hinweise / Platzhalter

- **Telefonnummern, Adressen, E-Mail** stammen aus öffentlich auffindbaren Angaben –
  bitte vor Veröffentlichung gegenprüfen.
- **Impressum / Datenschutz** im Footer sind Platzhalter (in DE rechtlich Pflicht).
- Three.js ist unter der MIT-Lizenz lokal eingebunden (Version 0.160.0).
