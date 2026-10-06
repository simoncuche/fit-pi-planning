# PI Planning Valencia – Hinweise für Claude Code

Browser-Rollenspiel (Pixel-Art, Top-down) über das PI Planning der E-Bike-Teams bei Colba in Valencia.
Läuft komplett im Browser ohne Server, ohne Bibliotheken, ohne Build-Tools ausser Python.

## Bauen und Starten

```bash
python3 build.py            # erzeugt dist/index.html (offline spielbar), dist/artifact.html, Icons, manifest.webmanifest, version.json
python3 tests/smoke_test.py # Playwright-Durchlauf der ganzen Woche (pip install playwright; CHROMIUM_PATH=… für ein vorhandenes Chromium)
```

`build.py` hängt `src/style.css` und alle `src/js/*.js` **in alphabetischer Reihenfolge** in `src/index.html` ein und bettet
`APP_VERSION`, `APP_VERSION_DATE`, `BUILD_VARIANT` und `CHANGELOG` aus `CHANGELOG.md` ein. **Bei jeder Änderung einen neuen Eintrag
`## x.y.z – TT.MM.JJJJ` zuoberst anlegen.** Top-Level-Code darf nur auf Dinge aus Dateien mit kleinerer Nummer (bzw. früherem Namen)
zugreifen – sonst TDZ-Fehler bei `const`. Darum heisst die Ereignis-Datei `09_zevents.js` (nach `09_story.js`).

## Aufbau (`src/js/`)

| Datei | Inhalt |
|---|---|
| `00_util.js` | Hilfsfunktionen, Pixel-Zeichnen (`R`, `P`, `E`, `line`, `ring`), Pixelschrift `pxText`, `TS = 24` |
| `01_audio.js` | `Snd`: synthetische Soundeffekte und Musik-Loops (`city`, `office`, `bar`, `disco`, `beach`, `lobby`, `market`, `museum`) |
| `02_look.js` | Merkmale `LOOK_OPTS` (28 Merkmale, inkl. `fem`), `randomLook`, Porträt 96×96 (`drawPortrait`, `portraitCanvas`) |
| `02_sprite.js` | Spielfigur 28×40, 4 Richtungen, 9 Posen (`POSES`, `getSheet`, `drawSprite`) |
| `03_editor.js` | Charakter-Editor (`Editor.open({mode})`: `new`, `clothes`, `hair`, `beard`), Auswahl aus `TRAVELLERS` |
| `04_state.js` | Spielzustand `G`, `newState`, `ITEMS`, `SIGHTS`, `ACH`, `TEAMS`, Werte-Logik (`consume`, `tickStats`), `planAdd`, Speichern (`SAVE_KEY`) |
| `05_tiles.js` | Bodenkacheln `T`/`TILE_PAINT` (24 px), Wandstile `paintWallFace`, Objekte (Orangenbaum, Palme, Gebäude `objBuilding`, Hochhaus `objTower`, Möbel, Marktstände, Falla, Micalet …), `DECAL` |
| `06_maps_city.js` | Karte `city` (100×84): Turia-Park, Plaza de la Virgen, Mercado, Hotel Kramer, Plaza del Ayuntamiento, Colba-Hochhaus, Museum, Calle Colón, Kartbahn, Padel, Disco, Estación, Ciudad de las Artes, Strand, Marina; Autos `cityCar`; Koordinaten in `CITY` |
| `06_maps_rooms.js` | `airport`, `hotel_lobby`, `hotel_floor`, `hotel_room`, `colba_entry`, `colba` (drei Teamräume, Lounge, Balkon, Backoffice, Lab, WC), `bar`, `jamon`, `bodega`, `disco`, `museum`, `mercado`, `danny_house` (Dannys Garten im Vorort: Grill, Gartentisch, Verstärker, Pool, Hängematte, Gartentor); Helfer `doorBottom`, `placePerson` |
| `07_engine.js` | `GMap` (mit `room()`), Akteure, Kollision, Kamera (`resizeView` DPR-bewusst), Licht/Nacht, Rendern, Interaktion, Zeitfluss, E-Bike (`a.bike`, `drawBikeUnder`), `tempActor`/`walk`/`dropActor` |
| `08_ui.js` | HUD (Badge, Post-it mit Ziel, PI-Plan-Balken), Dialoge (`UI.say/ask`), Läden `UI.shop`, Overlays, Ankündigung `UI.announce`, Handy `Phone` (Sprint, Team, Karte, Tasche, Fotos, Status, Optionen), Schnappschüsse `Snap`, Postkarten `drawSightCard` |
| `09_people.js` | `PEOPLE` (7 Reisende, 13 Colba-Leute, Isabell), `PEOPLE_LOOKS`, `TRAVELLERS`, `SWISS`, `COLBA`, `personLook`, `buildFriends`, `myTeam`, `isPO`, `teamLead`, Abhängigkeiten `DEPS` |
| `09_story.js` | Stufen `STAGES` (`koffer → sammeln → taxi → hotel → checkin → zimmer → bar → free`), Öffnungszeiten `OPEN`, Läden `SHOPS`, Mittagsplan `LUNCH`, `Story.*` (Ziele, Zeitplan `schedule`/`whereIs`/`populate`, Flughafen, Hotel, Klingel, Kickoff, Planning-Aktivitäten, Ausfahrt, Final, Aktivitäten in der Stadt, Gespräche `lines`, Körper, Heimflug), `Ending` |
| `09_zevents.js` | Ereignisse: Mascletà (14:00, Mo–Do), Cremà (Do 22:00), Robin verirrt sich, Gota fría, Falleras-Umzug, Horchata, Möwe, Orange, Peloton, CF-Fans, Tourist |
| `10_planning.js` | `Mini.run` (Rahmen) und Planning-Minispiele: `poker`, `canopen`, `roam`, `board`, `deps`, `confidence` |
| `11_minigames.js` | Freizeit: `suitcase`, `bell`, `kart`, `sail`, `paella`, `wine`, `soccer`, `dance`, `padel`, `ride` |
| `11_scenes.js` | `Scene.play(kind, opts)`: 240×144-Szenen (`plane`, `taxi`, `door`, `lift`, `stairs`, `roomdoor`, `sleep`, `shower`, `ride`, `boat`, `mascleta`, `crema`, `flight`), Fassaden `FACADES`, `transitionFor` |
| `12_main.js` | Titel (Bordkarte), Start, Eingabe (Tastatur + Touch-Joystick), Hauptschleife |

## Wichtige Konventionen

- Kachelgrösse `TS = 24`, Sprite 28×40, Porträt 96×96. Spielpixel werden auf ganze Gerätepixel vergrössert (`resizeView`), Ziel ~13 Kacheln Breite.
- Karten werden programmatisch gebaut (`m.fill`, `m.add(obj)`, `m.trig`, `m.warp`, `m.spawn`, `m.room`). Objekte haben Fussabdruck in Kacheln plus `drawH` Pixel nach oben.
- Trigger: `m.trig(x, y, w, h, { label, act, here, cond })`; `m.warp(...)` ist ein automatischer Trigger mit optionalem `guard`.
- Alle Interaktionen sind `async` und laufen innerhalb von `G.busy`. Dialoge immer über `Story.say/ask`; Sprecher-Ids aus `PEOPLE` liefern Porträts.
- Werte: `G.S.st` = `energy`, `food`, `mood`, `prom`, `nau`, `wet`, `sun`, `hang`. `consume(itemId)` wendet Essen/Trinken an, `tickStats` läuft pro Spielminute.
- PI-Plan: `G.S.plan[team]` 0–100, `planAdd(team, v)`. Pro Tag je einmal `poker`, `can`, `roam`, `board` (Flags `poker<d>` usw.), Abhängigkeiten `G.S.deps[id]`.
  Fremde Teams planen automatisch (`Story.minute`), das eigene nur über den Spieler (bzw. langsam, wenn er nicht PO ist).
- Wo wer ist: `Story.schedule(id)` → Ortskürzel, `Story.LOC` → Text/Karte/Koordinaten, `Story.populate(m)` platziert Leute beim Betreten.
- Datum: Tag 0 ist Montag, 16. März 2026 (`START_DATE`, `DAYS`). Werktage `isWorkday()` sind Di–Fr (Tag 1–4), Samstag Heimflug (`Story.goHome`).
- Spielstand: `localStorage` unter `pi-valencia-v1` (Schnappschüsse unter `…-snaps`). Bei Strukturänderungen `v` in `newState` und `SAVE_KEY` erhöhen.
- Texte auf Deutsch mit Schweizer Färbung (ss statt ß). Fakten zu Sehenswürdigkeiten sind recherchiert – bei neuen Fakten prüfen.
