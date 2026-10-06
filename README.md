# PI Planning Valencia

**Online spielen:** https://simoncuche.github.io/fit-pi-planning/ – der Workflow `.github/workflows/pages.yml` baut bei jedem Push und veröffentlicht `dist/` auf dem Branch `gh-pages`.

**Sprachen:** Das Spiel läuft standardmässig auf Englisch; Deutsch und Spanisch sind auf dem Titelbildschirm und im Handy unter Optionen wählbar. Die Übersetzungen liegen in `i18n/en.json` und `i18n/es.json` (deutscher Text = Schlüssel).

*Fünf Tage, drei Teams, ein Plan · Montag, 16. März 2026 (Fallas-Woche)*

Ein Pixel-Rollenspiel für den Browser: Die Product Owner Simon, Luigi und Dominique fliegen mit ihrem Chef Robin und
Battery-Pass-Spezialist Lukas von Zürich nach Valencia zum PI Planning bei Colba. Pascal (iOS, aus Leipzig) und Chris
(Surfer und Product Manager, aus Fuerteventura) stossen dazu. Alle wohnen im Hotel Kramer; geplant wird im ersten Stock
eines Hochhauses – wenn man die richtige Klingel findet.

**Spielen:** `dist/index.html` lokal im Browser öffnen oder die GitHub-Pages-Seite des Repos.
Kein Server, keine Installation. Funktioniert am Handy und am Computer.

## Was drin ist

- **Charakter-Editor** mit 28 Merkmalen und über 230 Varianten. Du wählst, wer du bist: Simon, Luigi, Dominique, Robin, Lukas, Pascal oder Chris.
  Die anderen reisen als Kollegen mit – jeder mit seiner Eigenheit (Autofan, Raucher, Organisator, Chef zum ersten Mal, Batteriepass, Leipzig, Surfen).
- **Montag:** Ankunft am Flughafen, den eigenen Koffer vom Band fischen (Robin steht am falschen Band), die Truppe einsammeln, Taxi,
  Hotel Kramer finden, einchecken, Zimmer 412, abends alle in der Bar Pepita mit Agua de Valencia.
- **Colba:** Hochhaus im Osten mit zwölf angeschriebenen Klingeln – auf keiner steht Colba. Eingangshalle mit Lift links und rechts und Treppe in der Mitte.
  Erster Stock: drei Teamräume (**Indurain**: Danny, Fran, Estella, Bea, Vicente · **Meeseeks**: Juanjo, Oscar, Pablo, Guillem, Elena, Pascal ·
  **Rocket**: Carlos, Salva, Aitor, Lukas), Aufenthaltsraum mit grossem Bildschirm, Küche und Balkon, Backoffice mit Isabell beim Lift, E-Bike-Raum neben dem Aufenthaltsraum mit Diagnose-PCs am CAN-Kabel, Prüfstand und Test-Bikes.
- **Planning (Di–Fr):** Kickoff mit Robins Business Context, dann pro Tag Planning Poker, CANopen-Index-Quiz mit Fran, ROAM-Risiken, Programm-Board
  und Abhängigkeiten mit den anderen Teams verhandeln. Freitag 15:00: Final-Präsentation und Confidence Vote.
- **Mittagessen im Aufenthaltsraum:** Dienstag Paella, Mittwoch Smash Burger, Donnerstag Bocadillos, Freitag Healthy Breakfast.
- **E-Bikes:** Test-Bikes bei Colba oder Miete bei Bici Rent, Akku-Anzeige, Radweg im Turia-Park. Donnerstag Team-Ausfahrt mit Aitor bis zum Strand.
- **Valencia:** Plaza de la Virgen mit Micalet und Turia-Brunnen, Mercado Central, Lonja, Torres de Serranos, Plaza del Ayuntamiento mit Falla,
  Museu de Belles Arts, Estación del Norte, Ciudad de las Artes, Strand der Malvarrosa, Marina.
- **Freizeit:** Segeltörn im Hafen, Shopping (Moda Valencia, Souvenirs), Jamón Ibérico bei Ramón, Bars, Kartbahn (gegen Luigi), Paella-Kochwettbewerb,
  Weindegustation in der Bodega, Museum, Strandfussball, Marina Beach Club (Disco), Padel-Turnier, Fischmarkt.
- **Asado bei Danny:** Mittwochabend lädt Danny (aus Kuba, wie Bea) in sein Haus im Vorort ein – Garten mit Pool, Hängematte und BBQ-Grill.
  Chorizo, Pollo und Maiskolben vom Grill, Beas Ropa Vieja, Mojito cubano und ein Bass-Solo von Carlos (Hardrock-Band „Stack Overflow“).
- **Valencia-Ereignisse:** Mascletà täglich um 14 Uhr, Cremà am Donnerstagabend, Wassergericht am Donnerstag um 12, Falleras-Umzug, Gota fría,
  Möwen am Strand, Peloton im Turia-Park, Valencia-CF-Fans, Horchata-Verkäufer.
- **Körper:** Energie, Hunger, Laune, Promille, Übelkeit, Sonne. Wer trinkt, ohne zu essen und zu schlafen, muss sich übergeben. Zu viel → Filmriss.

## Steuerung

- **Handy:** links auf den Bildschirm tippen und ziehen = gehen (weit ziehen = rennen), **A** = Aktion, oben rechts = Handy und Kamera.
- **Tastatur:** WASD/Pfeile gehen, Shift rennen, E/Leertaste Aktion, M Handy, P Foto.

## Entwickeln

```bash
python3 build.py              # src/ → dist/index.html
python3 tests/smoke_test.py   # automatischer Durchlauf (pip install playwright; CHROMIUM_PATH=… für ein vorhandenes Chromium)
```

Bei jedem Push auf `main` baut der Workflow `.github/workflows/pages.yml` das Spiel und veröffentlicht `dist/` auf GitHub Pages
(Repo-Einstellungen → Pages → Source: *GitHub Actions*).

Die Versionsnummer und die Historie kommen aus `CHANGELOG.md`; bei jeder Änderung dort einen Eintrag ergänzen.

Mehr zur Struktur in `CLAUDE.md`.
