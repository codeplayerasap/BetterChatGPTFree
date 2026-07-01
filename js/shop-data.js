/* ============================================================
   Danzeisen Shop – Daten (50 Artikel, Platzhalter, kein Backend)
   ============================================================ */
window.SHOP = (function () {
  const cats = {
    kompression: { label: 'Kompression', color: '#0e8f8f', c2: '#5fd0c8', icon: 'M8 3h8v6c0 1 .3 2 1.2 2.8l3 3a3.5 3.5 0 0 1-5 5L9.7 16A4 4 0 0 1 8 12.8V3z' },
    orthesen:    { label: 'Bandagen & Orthesen', color: '#3457b8', c2: '#7f9be6', icon: 'M12 3a4 4 0 0 0-4 4v10a4 4 0 0 0 8 0V7a4 4 0 0 0-4-4zM6 9h12M6 15h12' },
    einlagen:    { label: 'Einlagen & Orthopädie', color: '#c8871a', c2: '#f0c069', icon: 'M9 3c3 0 5 3 5 8s-2 10-6 10-5-4-5-8 3-10 6-10z' },
    reha:        { label: 'Reha & Mobilität', color: '#3f4b5b', c2: '#8b98a8', icon: 'M7 19a3 3 0 100-6 3 3 0 000 6zM17 19a3 3 0 100-6 3 3 0 000 6zM5 5h2l2.5 10H17' },
    pflege:      { label: 'Pflege & Alltag', color: '#1f9d63', c2: '#73d6a2', icon: 'M12 21s-7-4.5-9.5-9A5.5 5.5 0 0112 6a5.5 5.5 0 019.5 6C19 16.5 12 21 12 21z' },
    frau:        { label: 'Frau & Familie', color: '#c0468a', c2: '#f0a0cd', icon: 'M12 4c4 0 8 3 8 8a8 8 0 01-16 0c0-5 4-8 8-8z' },
    fuss:        { label: 'Fußpflege & Sport', color: '#1596a8', c2: '#6fd2df', icon: 'M7 4c2 0 4 2 4 6s-1 8-3 8-2-2-3-4-2-10 2-10z' }
  };

  // opt = [ [name, [optionen…]], … ]
  const S = ['S', 'M', 'L', 'XL'];
  const KKL = ['KKL 1', 'KKL 2', 'KKL 3'];
  const products = [
    { id: 'venenstrumpf-ad', name: 'Venen-Kompressionsstrumpf AD', cat: 'kompression', price: 64.9, kasse: true, opt: [['Kompressionsklasse', KKL], ['Größe', S], ['Farbe', ['Schwarz', 'Caramel', 'Marine']]], tags: ['Venen', 'Kniestrumpf'], desc: 'Medizinischer Kniestrumpf mit definiertem Druckverlauf bei Venenleiden.' },
    { id: 'venenstrumpf-ag', name: 'Venen-Kompressionsstrumpf AG', cat: 'kompression', price: 89.9, kasse: true, opt: [['Kompressionsklasse', KKL], ['Größe', S]], tags: ['Venen', 'Schenkelstrumpf'], desc: 'Schenkelstrumpf mit Haftband – gleichmäßige Kompression bis zum Oberschenkel.' },
    { id: 'venenstrumpfhose', name: 'Venen-Kompressionsstrumpfhose', cat: 'kompression', price: 109.0, kasse: true, opt: [['Kompressionsklasse', KKL], ['Größe', S]], tags: ['Venen', 'Strumpfhose'], desc: 'Strumpfhose mit medizinischer Kompression und bequemem Leibteil.' },
    { id: 'reisestruempfe', name: 'Reise-Kompressionsstrümpfe', cat: 'kompression', price: 29.9, kasse: false, opt: [['Größe', S], ['Farbe', ['Schwarz', 'Grau']]], tags: ['Reise', 'Prophylaxe'], desc: 'Leichte Stützstrümpfe gegen schwere Beine auf langen Flügen und Reisen.' },
    { id: 'stuetzstruempfe', name: 'Stützstrümpfe (Alltag)', cat: 'kompression', price: 24.9, kasse: false, opt: [['Größe', S], ['Farbe', ['Schwarz', 'Beige']]], tags: ['Stütze', 'Alltag'], desc: 'Angenehme Stützstrümpfe für langes Stehen und Sitzen im Alltag.' },
    { id: 'kompression-herren', name: 'Kompressionsstrümpfe Herren', cat: 'kompression', price: 69.9, kasse: true, opt: [['Kompressionsklasse', KKL], ['Größe', S]], tags: ['Venen', 'Herren'], desc: 'Diskrete, businesstaugliche Kompressionsstrümpfe im Herren-Design.' },
    { id: 'flachstrick-arm', name: 'Lymphversorgung Arm (Flachstrick)', cat: 'kompression', price: 149.0, kasse: true, opt: [['Kompressionsklasse', KKL], ['Ausführung', ['Maßanfertigung']]], tags: ['Lymphödem', 'Flachstrick', 'Maß'], desc: 'Flachgestrickte Armversorgung bei Lymph- und Lipödem – nach Maß gefertigt.' },
    { id: 'flachstrick-bein', name: 'Lymphversorgung Bein (Flachstrick)', cat: 'kompression', price: 199.0, kasse: true, opt: [['Kompressionsklasse', KKL], ['Ausführung', ['Maßanfertigung']]], tags: ['Lymphödem', 'Flachstrick', 'Maß'], desc: 'Kräftige Flachstrick-Beinversorgung bei ausgeprägten Ödemen.' },
    { id: 'adaptive-wrap', name: 'Adaptives Kompressionssystem (Wrap)', cat: 'kompression', price: 179.0, kasse: true, opt: [['Größe', S], ['Region', ['Unterschenkel', 'Fuß', 'Oberschenkel']]], tags: ['Lipödem', 'Selbst anlegbar'], desc: 'Mit Klettbändern selbst anlegbares System – ideal bei eingeschränkter Handkraft.' },
    { id: 'kompressionshandschuh', name: 'Kompressionshandschuh', cat: 'kompression', price: 79.0, kasse: true, opt: [['Kompressionsklasse', KKL], ['Größe', S]], tags: ['Lymphödem', 'Hand'], desc: 'Handversorgung bei Lymphödem, mit oder ohne Fingerlinge.' },

    { id: 'kniebandage', name: 'Kniebandage Aktiv', cat: 'orthesen', price: 74.9, kasse: true, opt: [['Größe', S]], tags: ['Knie', 'Bandage'], desc: 'Gestrickte Aktivbandage mit Silikon-Patellaring zur Führung und Entlastung.' },
    { id: 'knieorthese-gelenk', name: 'Knieorthese mit Gelenkschienen', cat: 'orthesen', price: 189.0, kasse: true, opt: [['Größe', S], ['Seite', ['links', 'rechts']]], tags: ['Knie', 'Orthese', 'nach OP'], desc: 'Hartrahmen-Orthese mit einstellbaren Gelenken – Stabilität nach Verletzung/OP.' },
    { id: 'sprunggelenkorthese', name: 'Sprunggelenk-Orthese', cat: 'orthesen', price: 59.9, kasse: true, opt: [['Größe', S], ['Seite', ['links', 'rechts']]], tags: ['Sprunggelenk', 'Sport'], desc: 'Stabilisiert das Sprunggelenk bei Bänderdehnung und Instabilität.' },
    { id: 'rueckenorthese', name: 'Rückenorthese / Lordosenstütze', cat: 'orthesen', price: 129.0, kasse: true, opt: [['Größe', S]], tags: ['Rücken', 'Entlastung'], desc: 'Entlastet die Lendenwirbelsäule und richtet die Haltung auf.' },
    { id: 'handgelenkbandage', name: 'Handgelenkbandage', cat: 'orthesen', price: 34.9, kasse: true, opt: [['Größe', S], ['Seite', ['links', 'rechts']]], tags: ['Hand', 'Bandage'], desc: 'Stützt und wärmt das Handgelenk bei Überlastung.' },
    { id: 'ellenbogenbandage', name: 'Ellenbogenbandage (Epicondylitis)', cat: 'orthesen', price: 39.9, kasse: true, opt: [['Größe', S]], tags: ['Ellenbogen', 'Tennisarm'], desc: 'Mit Pelotten gegen Tennis- und Golferarm, gezielte Druckentlastung.' },
    { id: 'schulterorthese', name: 'Schulterorthese / Armschlinge', cat: 'orthesen', price: 84.9, kasse: true, opt: [['Größe', S], ['Seite', ['links', 'rechts']]], tags: ['Schulter', 'nach OP'], desc: 'Ruhigstellung und Entlastung der Schulter nach Verletzung oder Operation.' },
    { id: 'halskrause', name: 'Zervikalstütze (Halskrause)', cat: 'orthesen', price: 29.9, kasse: true, opt: [['Höhe', ['niedrig', 'mittel', 'hoch']]], tags: ['HWS', 'Nacken'], desc: 'Entlastet die Halswirbelsäule und begrenzt die Beweglichkeit.' },
    { id: 'daumenorthese', name: 'Daumenorthese', cat: 'orthesen', price: 44.9, kasse: true, opt: [['Größe', S], ['Seite', ['links', 'rechts']]], tags: ['Daumen', 'Rhizarthrose'], desc: 'Stabilisiert das Daumensattelgelenk bei Arthrose und Überlastung.' },

    { id: 'einlagen-senso', name: 'Sensomotorische Einlagen', cat: 'einlagen', price: 149.0, kasse: true, opt: [['Ausführung', ['Maßanfertigung']], ['Größe', ['nach Maß']]], tags: ['Maß', 'Ganganalyse'], desc: 'Aktivieren die Fußmuskulatur – nach Ganganalyse individuell gefertigt.' },
    { id: 'einlagen-sport', name: 'Sport-Einlagen', cat: 'einlagen', price: 119.0, kasse: false, opt: [['Sportart', ['Laufen', 'Fußball', 'Wandern']], ['Größe', ['nach Maß']]], tags: ['Sport', 'Dämpfung'], desc: 'Dämpfende, stützende Einlagen für Lauf- und Sportschuhe.' },
    { id: 'einlagen-business', name: 'Business-/Alltagseinlagen', cat: 'einlagen', price: 99.0, kasse: false, opt: [['Größe', ['nach Maß']]], tags: ['Alltag', 'schmal'], desc: 'Schmale Maßeinlagen, die auch in eleganten Schuhen Platz finden.' },
    { id: 'einlagen-fersensporn', name: 'Fersensporn-Einlagen', cat: 'einlagen', price: 89.0, kasse: true, opt: [['Größe', ['nach Maß']]], tags: ['Ferse', 'Entlastung'], desc: 'Gezielte Weichbettung zur Entlastung bei Fersensporn und Fersenschmerz.' },
    { id: 'einlagen-diabetes', name: 'Diabetiker-Weichbetteinlagen', cat: 'einlagen', price: 129.0, kasse: true, opt: [['Größe', ['nach Maß']]], tags: ['Diabetes', 'Weichbett'], desc: 'Druckumverteilende Weichbettung zum Schutz des diabetischen Fußes.' },
    { id: 'einlagen-kinder', name: 'Kinder-Einlagen', cat: 'einlagen', price: 69.0, kasse: true, opt: [['Größe', ['nach Maß']]], tags: ['Kinder', 'Wachstum'], desc: 'Korrigierende Einlagen für Kinderfüße – regelmäßig ans Wachstum angepasst.' },

    { id: 'rollstuhl-standard', name: 'Standard-Faltrollstuhl', cat: 'reha', price: 299.0, kasse: true, opt: [['Sitzbreite', ['39 cm', '43 cm', '46 cm']]], tags: ['Rollstuhl', 'faltbar'], desc: 'Robuster, faltbarer Rollstuhl für den täglichen Gebrauch, mit Feststellbremsen.' },
    { id: 'rollstuhl-leicht', name: 'Leichtgewicht-/Aktivrollstuhl', cat: 'reha', price: 749.0, kasse: true, opt: [['Sitzbreite', ['38 cm', '40 cm', '42 cm']], ['Rahmen', ['Aluminium']]], tags: ['Aktiv', 'leicht'], desc: 'Wendiger Aktivrollstuhl mit geringem Gewicht für aktive Nutzer.' },
    { id: 'rollstuhl-transport', name: 'Transportrollstuhl', cat: 'reha', price: 219.0, kasse: true, opt: [['Sitzbreite', ['40 cm', '43 cm']]], tags: ['Transport', 'kompakt'], desc: 'Leichter Reise- und Transportrollstuhl mit kleinen Rädern, faltbar.' },
    { id: 'rollator-standard', name: 'Rollator Standard', cat: 'reha', price: 129.0, kasse: true, opt: [['Farbe', ['Silber', 'Blau']]], tags: ['Rollator', 'Outdoor'], desc: 'Vierrad-Rollator mit Sitz, Korb und Bremsen für sicheres Gehen draußen.' },
    { id: 'rollator-carbon', name: 'Leichtgewicht-Rollator (Carbon)', cat: 'reha', price: 299.0, kasse: true, opt: [['Farbe', ['Anthrazit', 'Rot']]], tags: ['Carbon', 'ultraleicht'], desc: 'Ultraleichter Carbon-Rollator, faltet sich schmal zusammen.' },
    { id: 'rollator-indoor', name: 'Indoor-Rollator', cat: 'reha', price: 149.0, kasse: true, opt: [['Ausführung', ['schmal']]], tags: ['Indoor', 'wendig'], desc: 'Schmaler Wohnraum-Rollator, passt durch enge Türen und Flure.' },
    { id: 'gehstock', name: 'Gehstock höhenverstellbar', cat: 'reha', price: 24.9, kasse: true, opt: [['Griff', ['Derby', 'Fritz', 'Soft']], ['Farbe', ['Schwarz', 'Blau']]], tags: ['Gehhilfe'], desc: 'Stufenlos höhenverstellbarer Gehstock mit rutschfestem Gummipuffer.' },
    { id: 'unterarmgehstuetzen', name: 'Unterarmgehstützen (Paar)', cat: 'reha', price: 34.9, kasse: true, opt: [['Ausführung', ['Standard', 'anatomisch']]], tags: ['Gehstütze', 'Paar'], desc: 'Höhenverstellbare Unterarmgehstützen als Paar, mit Weichgriff.' },
    { id: 'pflegebett', name: 'Pflegebett elektrisch', cat: 'reha', price: 1290.0, kasse: true, opt: [['Ausführung', ['Standard', 'Niederflur']]], tags: ['Pflegebett', 'Lieferung'], desc: 'Elektrisch verstellbares Pflegebett – wir liefern, bauen auf und weisen ein.' },

    { id: 'sitzkissen-dekubitus', name: 'Anti-Dekubitus-Sitzkissen', cat: 'pflege', price: 89.0, kasse: true, opt: [['Größe', ['40×40', '43×43', '46×46']]], tags: ['Dekubitus', 'Sitz'], desc: 'Druckentlastendes Sitzkissen zur Dekubitusprophylaxe im Rollstuhl/Stuhl.' },
    { id: 'wechseldruckmatratze', name: 'Wechseldruckmatratze', cat: 'pflege', price: 249.0, kasse: true, opt: [['Ausführung', ['mit Kompressor']]], tags: ['Dekubitus', 'Matratze'], desc: 'Aktives Wechseldrucksystem zur Vorbeugung und Behandlung von Wundliegen.' },
    { id: 'toilettensitzerhoehung', name: 'Toilettensitzerhöhung', cat: 'pflege', price: 49.9, kasse: true, opt: [['Höhe', ['+6 cm', '+10 cm']], ['Armlehnen', ['ohne', 'mit']]], tags: ['Bad', 'WC'], desc: 'Erleichtert das Aufstehen von der Toilette, optional mit Armlehnen.' },
    { id: 'badewannenlift', name: 'Badewannenlift', cat: 'pflege', price: 399.0, kasse: true, opt: [['Farbe', ['Weiß', 'Blau']]], tags: ['Bad', 'Lift'], desc: 'Senkt sicher in die Wanne ab – für entspanntes, selbstständiges Baden.' },
    { id: 'duschhocker', name: 'Duschhocker / Duschstuhl', cat: 'pflege', price: 44.9, kasse: true, opt: [['Ausführung', ['Hocker', 'mit Lehne']]], tags: ['Bad', 'Sicherheit'], desc: 'Höhenverstellbarer, rutschfester Sitz für sicheres Duschen.' },
    { id: 'greifhilfe', name: 'Greifhilfe / Greifzange', cat: 'pflege', price: 16.9, kasse: false, opt: [['Länge', ['70 cm', '90 cm']]], tags: ['Alltag', 'Greifen'], desc: 'Verlängert die Reichweite – Gegenstände mühelos vom Boden aufheben.' },
    { id: 'anziehhilfe', name: 'Anziehhilfe (Strumpfanzieher)', cat: 'pflege', price: 19.9, kasse: false, opt: [['Ausführung', ['Standard', 'für Kompression']]], tags: ['Alltag', 'Anziehen'], desc: 'Hilft beim Anziehen von Strümpfen ohne tiefes Bücken.' },
    { id: 'bettschutzeinlagen', name: 'Pflege-Bettschutzeinlagen (Box)', cat: 'pflege', price: 22.9, kasse: true, opt: [['Größe', ['60×60', '60×90']], ['Menge', ['30 Stk', '100 Stk']]], tags: ['Hygiene', 'Verbrauch'], desc: 'Saugstarke Einmalunterlagen zum Schutz von Bett und Sitzmöbeln.' },

    { id: 'brustprothese', name: 'Brustprothese (Silikon)', cat: 'frau', price: 249.0, kasse: true, opt: [['Größe', ['1', '2', '3', '4', '5']], ['Form', ['symmetrisch', 'links', 'rechts']]], tags: ['Prothese', 'diskret'], desc: 'Hochwertige Silikonprothese nach Brust-OP – diskrete Beratung im Haus.' },
    { id: 'prothesen-bh', name: 'Prothesen-BH', cat: 'frau', price: 49.9, kasse: true, opt: [['Größe', ['75B', '80B', '80C', '85C']], ['Farbe', ['Haut', 'Weiß', 'Schwarz']]], tags: ['Wäsche', 'Taschen-BH'], desc: 'Bequemer BH mit Taschen zur sicheren Aufnahme der Brustprothese.' },
    { id: 'mastektomie-bademode', name: 'Mastektomie-Bademode', cat: 'frau', price: 89.0, kasse: false, opt: [['Größe', ['38', '40', '42', '44']]], tags: ['Bademode', 'Taschen'], desc: 'Badeanzug mit integrierten Taschen für die Prothese – unbeschwert baden.' },
    { id: 'schwangerschaftsguertel', name: 'Schwangerschafts-Stützgürtel', cat: 'frau', price: 39.9, kasse: false, opt: [['Größe', S]], tags: ['Schwangerschaft', 'Rücken'], desc: 'Entlastet Rücken und Beckenboden in der Schwangerschaft.' },
    { id: 'stillkissen', name: 'Stillkissen', cat: 'frau', price: 34.9, kasse: false, opt: [['Bezug', ['Baumwolle', 'Jersey']]], tags: ['Mutter & Kind', 'Stillen'], desc: 'Vielseitiges Lagerungs- und Stillkissen für Mama und Baby.' },
    { id: 'milchpumpe', name: 'Milchpumpe (elektrisch)', cat: 'frau', price: 69.9, kasse: true, opt: [['Ausführung', ['einseitig', 'doppelseitig']]], tags: ['Mutter & Kind', 'Leihgerät'], desc: 'Elektrische Milchpumpe – auch als Leihgerät auf Rezept erhältlich.' },

    { id: 'hallux-spreizer', name: 'Silikon-Zehenspreizer (Hallux)', cat: 'fuss', price: 12.9, kasse: false, opt: [['Größe', ['S/M', 'L/XL']]], tags: ['Hallux', 'Fußpflege'], desc: 'Weicher Silikonspreizer richtet den Großzeh sanft aus und schützt vor Druck.' },
    { id: 'sportsocken-kompression', name: 'Kompressions-Sportsocken', cat: 'fuss', price: 24.9, kasse: false, opt: [['Größe', S], ['Farbe', ['Schwarz', 'Weiß', 'Blau']]], tags: ['Sport', 'Regeneration'], desc: 'Fördern die Durchblutung beim Sport und in der Regeneration.' }
  ];

  return { cats, products };
})();
