# Fit PI Planning – The Game – Hinweise für Claude Code

Browser-Rollenspiel (Pixel-Art, Top-down) über das PI Planning der E-Bike-Teams bei Colba in Valencia.
Läuft komplett im Browser ohne Server, ohne Bibliotheken, ohne Build-Tools ausser Python.

## Bauen und Starten

```bash
python3 build.py            # erzeugt dist/index.html (offline spielbar), dist/artifact.html, Icons, manifest.webmanifest, version.json
python3 tests/smoke_test.py # Playwright-Durchlauf der ganzen Woche (pip install playwright; CHROMIUM_PATH=… für ein vorhandenes Chromium)
```

`build.py` hängt `src/style.css` und alle `src/js/*.js` **in alphabetischer Reihenfolge** in `src/index.html` ein und bettet
`APP_VERSION`, `APP_VERSION_DATE`, `BUILD_VARIANT` und `CHANGELOG` aus `CHANGELOG.md` ein (der Changelog wird im Spiel angezeigt und ist deshalb
**auf Englisch**). **Bei jeder Änderung einen neuen Eintrag `## x.y.z – TT.MM.JJJJ` zuoberst anlegen.** Ausserdem bettet `build.py` die
Übersetzungen aus `i18n/*.json` direkt nach `00_i18n.js` ein. Top-Level-Code darf nur auf Dinge aus Dateien mit kleinerer Nummer (bzw. früherem Namen)
zugreifen – sonst TDZ-Fehler bei `const`. Darum heisst die Ereignis-Datei `09_zevents.js` (nach `09_story.js`).

## Aufbau (`src/js/`)

| Datei | Inhalt |
|---|---|
| `00_i18n.js` | Sprachen `LANGS` (en Standard, de, es), `LANG` aus `localStorage`, Übersetzungsfunktion `_t`, `setLang` (lädt neu), `numSep` |
| `00_util.js` | Hilfsfunktionen, Pixel-Zeichnen (`R`, `P`, `E`, `line`, `ring`), Pixelschrift `pxText`, `TS = 24` |
| `01_audio.js` | `Snd`: synthetische Soundeffekte und Musik-Loops (`city`, `office`, `bar`, `disco`, `beach`, `lobby`, `market`, `museum`) |
| `02_look.js` | Merkmale `LOOK_OPTS` (28 Merkmale, inkl. `fem`), `randomLook`, Porträt 96×96 (`drawPortrait`, `portraitCanvas`) |
| `02_sprite.js` | Spielfigur 28×48 (`SPR_H`, davon `SPR_TOP = 8` px Luft oben für Hüte), 4 Richtungen, 11 Posen (`POSES`, `getSheet`, `drawSprite`) |
| `03_editor.js` | Charakter-Editor (`Editor.open({mode})`: `new`, `clothes`, `hair`, `beard`), Auswahl aus allen `PEOPLE` (Porträt, Name und lustige Kurzbeschreibung `tag`) |
| `04_track.js` | `Track`: Fortschritt pro Gerät an Firebase Realtime Database per REST (`PATCH pi/devices/<Gerät>.json`, Mehrpfad mit `games/<gameId>/s` und `games/<gameId>/log/<id>`), Drosselung 45 s, Pause nach Fehlern, Opt-out `pi-track-off`; `EV_TITLES` für die Tracker-Seite; Hooks in `saveGame`, `achieve`, `Story.setStage`, `Story.goHome`, `UI.gameOver`, `startGame` |
| `04_state.js` | Spielzustand `G`, `newState`, `ITEMS`, `SIGHTS`, `ACH`, `TEAMS`, Werte-Logik (`consume`, `tickStats`), `planAdd`, Speichern (`SAVE_KEY`) |
| `05_tiles.js` | Bodenkacheln `T`/`TILE_PAINT` (24 px), Wandstile `paintWallFace`, Objekte (Orangenbaum, Palme, Gebäude `objBuilding`, Hochhaus `objTower`, Möbel, Marktstände, Bushaltestelle `objBusStop`, Blumenbeet `objFlowerBed`, Ladenregale `objShelfRack`, Kleiderständer, Puppe, Kühlregal, Umkleide, Postkartenständer, Bankomat `objAtm`, Karts `objParkedKart`/`objTyres`, Falla, Micalet …), `DECAL` |
| `06_maps_city.js` | Karte `city` (100×84): Turia-Park, Plaza de la Virgen, Mercado, Hotel Kramer, Plaza del Ayuntamiento, Colba-Hochhaus, Museum, Calle Colón, Kartbahn, Padel, Disco, Estación, Ciudad de las Artes, Strand, Marina; Autos `cityCar`, Kartbahn `kartTrack` (mit rundendrehendem Kart); Koordinaten in `CITY` |
| `06_maps_rooms.js` | `airport`, `hotel_lobby`, `hotel_floor`, `hotel_room`, `colba_entry`, `colba` (48×24: Flur y 11–13, oben drei Teamräume x 1/12/23 und Lounge x 34, unten Backoffice, WC, Lift/Treppe in der Mitte und Bike-Lab `lab` mit `objBikeRig` und Balkon rechts; Türen über `door()`), `bar`, `jamon`, `bodega`, `disco`, `museum`, `mercado`, `danny_house`, Läden `moda`, `super`, `farmacia`, `estanco`, `souvenir`, `veles` (Helfer `shopKeeper`) (Dannys Garten im Vorort: Grill, Gartentisch, Verstärker, Pool, Hängematte, Gartentor); Helfer `doorBottom`, `placePerson` |
| `07_engine.js` | `GMap` (mit `room()`), Akteure, Kollision, Kamera (`resizeView` DPR-bewusst), Licht/Nacht, Rendern, Interaktion, Zeitfluss, E-Bike (`a.bike`, `drawBikeUnder`), `tempActor`/`walk`/`dropActor` |
| `08_ui.js` | HUD (Badge, Post-it mit Ziel, PI-Plan-Balken), Dialoge (`UI.say/ask`), Läden `UI.shop`, Overlays, Ankündigung `UI.announce`, Handy `Phone` (Sprint, Team, Karte, Tasche, Fotos, Status, Optionen), Schnappschüsse `Snap`, Postkarten `drawSightCard` |
| `09_people.js` | `PEOPLE` (7 Reisende, 14 Colba-Leute inkl. Daniel, Isabel; `tag` = lustige Kurzbeschreibung), `PEOPLE_LOOKS`, `TRAVELLERS`, `SWISS`, `COLBA`, `personLook`, `buildFriends`, `myTeam`, `isPO`, `teamLead`, Abhängigkeiten `DEPS` |
| `09_story.js` | Stufen `STAGES` (`koffer → sammeln → taxi → hotel → checkin → zimmer → bar → free`), Öffnungszeiten `OPEN`, Läden `SHOPS`, Mittagsplan `LUNCH`, `Story.*` (Ziele, Zeitplan `schedule`/`whereIs`/`populate`, Flughafen, Hotel, Klingel, Kickoff, Planning-Aktivitäten, Ausfahrt, Final, Aktivitäten in der Stadt, Gespräche `lines`, Körper, Heimflug), `Ending` |
| `09_zevents.js` | Ereignisse: Valencia-Spiel in der Bar (Do 21:00), Buñuelos-Stand auf der Plaza, Marathon-Training im Turia-Park, Robin verirrt sich, Gota fría, Horchata, Möwe, Orange, Peloton, CF-Fans, Tourist |
| `10_planning.js` | `Mini.run` (Rahmen) und Planning-Minispiele: `poker`, `canopen`, `roam`, `board`, `deps`, `confidence` |
| `10_workshops.js` | Workshops als Minispiele (`Mini.ux`, `Mini.arch`, `Mini.roadmap`, `Mini.retro`) mit den Rahmen `quizCards`, `sortCards`, `placeBoard`; Zeitplan in `Story.WORKSHOPS` |
| `11_minigames.js` | Freizeit: `suitcase`, `bell`, `kart`, `sail`, `paella`, `bbq` (Grill bei Danny, danach `Story.bbqDinner` am Gartentisch), `wine`, `soccer`, `dance`, `padel`, `ride` |
| `11_scenes.js` | `Scene.play(kind, opts)`: 240×144-Szenen (`plane`, `taxi`, `door`, `lift`, `stairs`, `roomdoor`, `sleep`, `shower`, `ride`, `boat`, `mascleta`, `crema`, `flight`), Fassaden `FACADES`, `transitionFor` |
| `12_main.js` | Titel (Bordkarte), Start, Eingabe (Tastatur + Touch-Joystick), Hauptschleife |

## Tracking und Tracker-Seite

- Datenbank-URL in `tracking.json` (`databaseURL`) oder Umgebungsvariable `TRACK_DB` (im Workflow aus der Repo-Variable `vars.TRACK_DB`). Leer = kein Tracking. `build.py` bettet sie als `TRACK_DB` ein; `NO_TRACK=1` schaltet das Tracking beim Bauen aus.
- Alle Daten liegen unter dem Zweig `pi/` (`TRACK_ROOT`), damit dieselbe Firebase-Datenbank wie beim Wiehnachtsreisli genutzt werden kann. Firebase-Regeln: `pi/devices` lesbar, `pi/devices/$device` beschreibbar.
- `src/tracker.html` wird zu `dist/tracker.html` (mit `00_i18n.js`, den Übersetzungen, `00_util.js` und `02_look.js` für die Porträts). URL-Parameter `?db=` überschreibt die Datenbank zum Testen.
- Ereignisse: `Track.init()` umhüllt jede `Story.ev_<id>()` und zählt Aufrufe in `flags.evSeen`; `EV_TITLES` in `04_track.js` liefert die Titel, `build.py` übernimmt sie in die Tracker-Seite.
- Ranglisten zählen nur offene Spiele (aktuelles Spiel des Geräts, ohne `finished`/`over`); beendete Spiele stehen separat. Fehler beim Senden dürfen das Spiel nie stören.
- Spielername: beim Boarding Pflichtfeld (`#edName`, zuletzt verwendeter Name in `localStorage` `pi-player-name`); `G.S.name` ist der eingegebene Name, `G.S.pid` die gespielte Figur.

## Sprachen (i18n)

- **Alle sichtbaren Texte im Code sind deutsch und mit `_t('…')` bzw. `` _t`…` `` umhüllt.** Der deutsche Text ist der Schlüssel; die
  Übersetzungen stehen in `i18n/en.json` und `i18n/es.json`. In Template-Literalen werden `${…}` zu Platzhaltern `{0}`, `{1}`, …
  (Reihenfolge darf in der Übersetzung wechseln). Fehlt ein Schlüssel, erscheint der deutsche Text.
- Neue Texte: deutsch schreiben, mit `_t` umhüllen (oder `python3 tools/i18n_extract.py wrap` laufen lassen), dann mit
  `python3 tools/i18n_extract.py` die fehlenden Schlüssel anzeigen und in beiden JSON-Dateien ergänzen. Der Smoke-Test meldet zur Laufzeit
  fehlende Übersetzungen (`I18N_MISSING`), läuft mit `GAME_LANG=en|de|es`.
- `_t` wird beim Laden ausgewertet (z. B. in `LOOK_OPTS`, `ITEMS`, `ACH`), darum lädt ein Sprachwechsel die Seite neu.
- Pixelschrift `pxText` kennt A–Z, Ziffern, ÄÖÜ, ÁÉÍÓÚÀÈÑ, ¿¡ und einige Satzzeichen; Texte für Schilder in Grossbuchstaben halten.
- Spieldaten in Dateien: `tests/smoke_test.py` prüft nur Flags und IDs, keine Texte.

## Wichtige Konventionen

- Am PC (kein Touch, Fenster ≥ 860×560) läuft das Spiel in einem 4:3-Rahmen (`frameSize()` in `07_engine.js`, `body.framed`, `#app` max. 1180 px breit); sonst füllt es das Fenster. `resizeView` und der Trailer messen `#app`, nicht das Fenster.
- Kachelgrösse `TS = 24`, Sprite 28×48 (Figur 40 px, Füsse unten), Porträt 96×96. Spielpixel werden auf ganze Gerätepixel vergrössert (`resizeView`), Ziel ~13 Kacheln Breite.
- Karten werden programmatisch gebaut (`m.fill`, `m.add(obj)`, `m.trig`, `m.warp`, `m.spawn`, `m.room`). Objekte haben Fussabdruck in Kacheln plus `drawH` Pixel nach oben.
- Trigger: `m.trig(x, y, w, h, { label, act, here, cond })`; `m.warp(...)` ist ein automatischer Trigger mit optionalem `guard`.
- Alle Interaktionen sind `async` und laufen innerhalb von `G.busy`. Dialoge immer über `Story.say/ask`; Sprecher-Ids aus `PEOPLE` liefern Porträts.
- Werte: `G.S.st` = `energy`, `food`, `mood`, `prom`, `nau`, `wet`, `sun`, `hang`. `consume(itemId)` wendet Essen/Trinken an, `tickStats` läuft pro Spielminute.
- PI-Plan: `G.S.plan[team]` 0–100, `planAdd(team, v)`. Pro Tag je einmal `poker`, `can`, `roam`, `board` (Flags `poker<d>` usw.), Abhängigkeiten `G.S.deps[id]`.
  Fremde Teams planen automatisch (`Story.minute`), das eigene nur über den Spieler (bzw. langsam, wenn er nicht PO ist).
- Spielfigur: jede Person aus `PEOPLE` ist spielbar (`CREW`). `Story.isColba()` kennzeichnet Colba-Spieler (Abholung am Flughafen statt Koffer,
  Hotelzimmer von Juanjo, Samstag Verabschiedung statt Flug). `Story.isHere(pid)` ist wahr, `UI.speaker` zeigt die Spielfigur, wenn eine
  Script-Zeile ihren Namen oder ihre Id als Sprecher hat. Rollen in `PEOPLE` sind neutrale Berufsbezeichnungen.
- Wo wer ist: `Story.schedule(id)` → Ortskürzel, `Story.LOC` → Text/Karte/Koordinaten, `Story.populate(m)` platziert Leute beim Betreten.
- Datum: Tag 0 ist Montag, 2. November 2026 (`START_DATE`, `DAYS`). Werktage `isWorkday()` sind Di–Fr (Tag 1–4), Samstag Heimflug (`Story.goHome`).
- Spielstand: `localStorage` unter `pi-valencia-v1` (Schnappschüsse unter `…-snaps`). Bei Strukturänderungen `v` in `newState` und `SAVE_KEY` erhöhen.
- Deutsche Quelltexte mit Schweizer Färbung (ss statt ß); Englisch ist die Standardsprache im Spiel. Fakten zu Sehenswürdigkeiten sind recherchiert – bei neuen Fakten prüfen.
