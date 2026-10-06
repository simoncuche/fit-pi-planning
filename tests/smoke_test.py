#!/usr/bin/env python3
"""Automatischer Durchlauf im Headless-Browser: Flughafen, Hotel, Bar, Colba, Planning, Freizeit, Ende.
Benötigt: pip install playwright (Chromium über CHROMIUM_PATH oder playwright install chromium)."""
import glob, json, os, pathlib, subprocess, sys, time
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
subprocess.run([sys.executable, str(ROOT / "build.py")], check=True)
URL = (ROOT / "dist" / "index.html").as_uri()
errors = []
SHOTS = pathlib.Path(os.environ.get("SHOTS", "")) if os.environ.get("SHOTS") else None

def exe():
    p = os.environ.get("CHROMIUM_PATH")
    if p: return p
    g = glob.glob("/opt/pw-browsers/chromium-*/chrome-linux/chrome")
    return g[0] if g else None

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=exe())
    pg = browser.new_page(viewport={"width": 390, "height": 844}, has_touch=True, is_mobile=True, device_scale_factor=3)
    pg.on("pageerror", lambda e: errors.append(str(e)))
    pg.on("console", lambda m: errors.append("console: " + m.text) if m.type == "error" and "Failed to load resource" not in m.text else None)
    pg.route("**/firebasedatabase.app/**", lambda r: r.abort())  # kein Tracking aus Tests
    pg.route("**/fonts.googleapis.com/**", lambda r: r.abort())
    pg.route("**/fonts.gstatic.com/**", lambda r: r.abort())
    LANG = os.environ.get("GAME_LANG", "en")
    pg.add_init_script(f"try {{ localStorage.setItem('pi-valencia-lang', {json.dumps(LANG)}); }} catch (e) {{}}")
    pg.goto(URL)
    time.sleep(0.8)
    assert pg.evaluate("() => LANG") == LANG, "Sprache nicht gesetzt"
    pg.evaluate("""() => { window.__q = []; setInterval(() => { if (UI.dlgOpen) { if (UI._choices && UI._pick) { const q = window.__q.length ? window.__q.shift() : 0; UI._pick(Math.min(q, UI._choices.length - 1)); } else UI.dlgAdvance(); } }, 40); }""")

    def shot(name):
        if SHOTS:
            pg.screenshot(path=str(SHOTS / f"{name}.png"))

    def run(js, wait=0.4, q=None):
        if q is not None:
            pg.evaluate(f"window.__q = {json.dumps(q)}")
        pg.evaluate(f"async () => {{ {js} }}")
        time.sleep(wait)

    def state():
        return pg.evaluate("() => ({stage: G.S.stage, map: G.map.id, time: clockStr(), day: today(), plan: Math.round(G.S.plan[myTeam()]), busy: G.busy})")

    shot("01_title")
    run("const S2 = newState(personLook('simon'), 'Simon'); S2.pid = 'simon'; S2.team = 'indurain'; await startGame(S2, true);", 6.0)
    run("G.S.flags.noAppts = 1;")  # der Test springt durch die Woche; Termine werden am Schluss separat geprüft
    shot("02_airport")
    assert state()["map"] == "airport", state()
    # Koffer: Minispiel direkt lösen
    run("G.S.flags.koffer = 1; achieve('koffer'); Story.setStage('sammeln');")
    run("for (const id of Story.airportGroup()) { const n = G.npcs.find((a) => a.id === id); G.busy++; await Story.meetAtAirport(id, n || { bubble: null }); G.busy--; }", 1.0)
    assert state()["stage"] == "taxi", state()
    run("G.busy++; await Story.taxiToHotel(); G.busy--;", 6.0)
    assert state()["map"] == "city" and state()["stage"] == "hotel", state()
    shot("03_city")
    run("await warpTo('hotel_lobby', 'entry');", 2.5)
    assert state()["stage"] == "checkin", state()
    run("G.busy++; await Story.reception(); G.busy--;", 1.0)
    assert state()["stage"] == "zimmer", state()
    run("await warpTo('hotel_room', 'entry'); G.busy++; await Story.unpack(); G.busy--;", 3.0)
    assert state()["stage"] == "bar", state()
    shot("04_room")
    run("G.S.time = 17 * 60 + 5; await warpTo('bar', 'entry');", 5.0)
    assert state()["stage"] == "free", state()
    shot("05_bar")
    # Dienstag: Klingel, Office, Kickoff
    run("G.S.time = 1440 + 9 * 60; Story.newDay(); await warpTo('city', 'colba');", 2.0)
    run("G.busy++; const r = await (async () => { const p = Mini.bell(); setTimeout(() => { const b = [...document.querySelectorAll('.bell-grid button')].find((x) => x.dataset.n.startsWith('C.B.')); b.click(); }, 300); return p; })(); G.busy--; window.__bell = r;", 2.0)
    assert pg.evaluate("() => window.__bell && window.__bell.ok"), "Klingel nicht gefunden"
    run("G.S.flags.bellOk = 1; await warpTo('colba_entry', 'entry'); await warpTo('colba', 'lift');", 5.0)
    assert state()["map"] == "colba", state()
    shot("06_office")
    run("G.S.time = 1440 + 9 * 60 + 35; G.busy++; await Story.kickoff(); G.busy--;", 4.0)
    assert pg.evaluate("() => !!G.S.flags.kickoff"), "Kickoff fehlt"
    # Planning: Poker automatisch durchklicken
    pg.evaluate("""() => { window.__pk = setInterval(() => { const c = document.querySelector('.pcard[data-c="5"]'); if (c && !c.classList.contains('sel')) { c.click(); return; } const r = document.querySelector('#pkReveal:not([disabled])'); if (r) { r.click(); return; } const n = document.querySelector('#pkNext'); if (n) n.click(); }, 80); G.busy++; Story.poker('indurain').then(() => { G.busy--; clearInterval(window.__pk); window.__pkd = 1; }); }""")
    for _ in range(40):
        if pg.evaluate("() => window.__pkd === 1"): break
        time.sleep(0.5)
    assert pg.evaluate("() => window.__pkd === 1"), "Poker nicht beendet"
    assert state()["plan"] > 5, state()
    # CANopen-Quiz: immer erste Antwort
    pg.evaluate("""() => { window.__cq = setInterval(() => { const b = document.querySelector('.pcard[data-a]'); if (b) b.click(); }, 80); G.busy++; Story.canopenQuiz().then(() => { G.busy--; clearInterval(window.__cq); window.__cqd = 1; }); }""")
    for _ in range(30):
        if pg.evaluate("() => window.__cqd === 1"): break
        time.sleep(0.5)
    assert pg.evaluate("() => window.__cqd === 1"), "CANopen nicht beendet"
    # ROAM
    pg.evaluate("""() => { window.__ro = setInterval(() => { const b = document.querySelector('.roam-grid button'); if (b) b.click(); }, 80); G.busy++; Story.roam('indurain').then(() => { G.busy--; clearInterval(window.__ro); window.__rod = 1; }); }""")
    for _ in range(30):
        if pg.evaluate("() => window.__rod === 1"): break
        time.sleep(0.5)
    assert pg.evaluate("() => window.__rod === 1"), "ROAM nicht beendet"
    # Programm-Board: Features der Reihe nach auf Sprints
    pg.evaluate("""() => { let i = 0; window.__bd = setInterval(() => { const f = document.querySelector('.pcard[data-f]'); if (f) { f.click(); const cols = document.querySelectorAll('.col'); cols[i % 6].click(); i++; return; } const ok = document.querySelector('#bdOk:not([disabled])'); if (ok) ok.click(); }, 100); G.busy++; Story.teamBoard('indurain').then(() => { G.busy--; clearInterval(window.__bd); window.__bdd = 1; }); }""")
    for _ in range(30):
        if pg.evaluate("() => window.__bdd === 1"): break
        time.sleep(0.5)
    assert pg.evaluate("() => window.__bdd === 1"), "Board nicht beendet"
    shot("07_planning")
    # Workshops im Aufenthaltsraum: UX (Di 16), Architektur (Mi 11), Roadmap (Do 11), Retro (Fr 11) – Antworten automatisch
    pg.evaluate("""() => { window.__wi = 0; window.__ws = setInterval(() => { const a = document.querySelector('.pcard[data-a]'); if (a) { a.click(); return; } const r = document.querySelector('.roam-grid button'); if (r) { r.click(); return; } const f = document.querySelector('.pcard[data-f]'); if (f) { f.click(); const cols = document.querySelectorAll('.col'); cols[window.__wi++ % cols.length].click(); return; } const ok = document.querySelector('#wsOk:not([disabled])'); if (ok) ok.click(); }, 60); }""")
    for d, hh in ((1, 16), (2, 11), (3, 11), (4, 11)):
        run(f"G.S.time = {d} * 1440 + {hh} * 60 + 5; enterMap('colba', 'lounge'); window.__wsd = 0; G.busy++; Story.loungeScreen().then(() => {{ G.busy--; window.__wsd = 1; }});", 0.5)
        for _ in range(40):
            if pg.evaluate("() => window.__wsd === 1"): break
            time.sleep(0.5)
        assert pg.evaluate(f"() => window.__wsd === 1 && !!G.S.flags['ws_' + Story.WORKSHOPS[{d}].id]"), f"Workshop Tag {d} fehlt"
        if d == 3: shot("07c_roadmap")
    pg.evaluate("() => clearInterval(window.__ws)")
    assert pg.evaluate("() => G.S.ach.ux && G.S.ach.arch && G.S.ach.roadmap && G.S.ach.retro && G.npcs.length >= 0"), "Workshop-Erfolge fehlen"
    run("G.S.time = 1440 + 12 * 60 + 30; enterMap('colba', 'room_indurain');", 0.5)
    print("Plan nach Dienstag:", state())
    # E-Bike-Raum neben der Lounge: Diagnose-PC (Telemetrie lesen)
    run("enterMap('colba', 'lab'); G.busy++; await Story.bikeComputer(0); G.busy--;", 1.5, q=[0])
    assert pg.evaluate("() => !!G.S.ach.telemetrie"), "Telemetrie fehlt"
    shot("07b_lab")
    # Mittagessen
    run("G.S.time = 1440 + 13 * 60 + 10; G.busy++; await Story.loungeTable(); G.busy--;", 1.5, q=[0])
    assert pg.evaluate("() => !!G.S.flags.lunch1"), "Paella fehlt"
    # Abhängigkeit mit Meeseeks
    run("G.S.time = 1440 + 15 * 60; enterMap('colba', 'room_meeseeks');", 1.0)
    pg.evaluate("""() => { window.__dp = setInterval(() => { const cols = [...document.querySelectorAll('.col:not(.over)')]; if (cols.length) cols[0].click(); }, 100); G.busy++; Story.depBoard('meeseeks').then(() => { G.busy--; clearInterval(window.__dp); window.__dpd = 1; }); }""")
    for _ in range(30):
        if pg.evaluate("() => window.__dpd === 1"): break
        time.sleep(0.5)
    assert pg.evaluate("() => window.__dpd === 1"), "Dependency nicht beendet"
    # Freizeit: Mascletà, Strand, Kart (Minispiele abbrechen lassen)
    run("await warpTo('city', 'hotel'); G.S.time = 1440 + 14 * 60; G.busy++; await Story.ev_bunyols(); G.busy--;", 2.0, q=[0])
    assert pg.evaluate("() => !!G.S.ach.bunyols"), "Buñuelos fehlen"
    run("G.busy++; await Story.ev_mestalla(); G.busy--;", 2.0)
    assert pg.evaluate("() => !!G.S.ach.mestalla"), "Mestalla fehlt"
    shot("08_city_day")
    run("G.busy++; await Story.ev_gota(); G.busy--;", 1.0)
    run("G.busy++; Story.bikeOn(100); G.busy--;", 0.5)
    run("G.S.st.nau = 101; checkThresholds();", 2.5)
    assert pg.evaluate("() => !!G.S.ach.kotzen"), "Übergeben fehlt"
    # Nacht & Schlafen
    run("await warpTo('hotel_room', 'entry'); G.S.time = 1440 + 23 * 60; G.busy++; await Story.bed(); G.busy--;", 6.0, q=[0])
    assert state()["day"] == 2, state()
    # Mittwochabend: Taxi zu Dannys Haus, Asado, Grill, Gartentisch, Bass-Solo, zurück
    run("G.S.time = 2 * 1440 + 19 * 60; await warpTo('city', 'hotel'); G.busy++; await Story.taxiCity(); G.busy--;", 5.0, q=[3])
    assert state()["map"] == "danny_house", state()
    for _ in range(20):
        if pg.evaluate("() => !!G.S.flags.asado && G.busy === 0"): break
        time.sleep(0.5)
    assert pg.evaluate("() => !!G.S.flags.asado && !!G.S.ach.asado"), "Asado fehlt"
    assert pg.evaluate("() => ['danny', 'bea', 'carlos'].every((id) => G.npcs.some((n) => n.id === id))"), "Danny, Bea oder Carlos fehlt im Garten"
    shot("08b_asado")
    # Grill: Option 0 wäre das Minispiel (Grillzange); hier drei Stücke direkt nehmen, dann das gemeinsame Essen direkt auslösen
    run("G.busy++; await Story.grill(); await Story.grill(); await Story.grill(); await Story.gardenTable(); await Story.bassSolo(); G.busy--;", 3.0, q=[1, 2, 1, 2])
    assert pg.evaluate("() => G.S.flags.grilled >= 3 && !!G.S.ach.bass && !!G.S.ach.cuba && G.S.flags.bassOn === 1"), "Grill/Bass/Cuba fehlt"
    run("G.busy++; await Story.bbqDinner({ score: 60, served: 6, burnt: 0, perfect: 3, items: { chorizo: 3, pollo: 2, maiz: 1 } }); G.busy--;", 6.0)
    assert pg.evaluate("() => !!G.S.flags.bbqDinner && !!G.S.ach.sobremesa && G.npcs.filter((n) => n.id && n.pose === 'sit').length >= 4"), "BBQ-Essen am Gartentisch fehlt"
    run("G.busy++; await Story.leaveDanny(); G.busy--;", 4.0, q=[0])
    assert state()["map"] == "city" and pg.evaluate("() => hasInv('chorizo')"), state()
    # Donnerstag: Ausfahrt direkt; Freitag: Final; Samstag: Heimflug
    run("G.S.time = 3 * 1440 + 16 * 60; enterMap('colba', 'lounge'); G.S.plan.indurain = 82; G.S.plan.meeseeks = 70; G.S.plan.rocket = 75;", 1.0)
    pg.evaluate("""() => { window.__cv = setInterval(() => { const b = document.querySelector('.pcard[data-v="5"]'); if (b && !b.disabled) { b.click(); return; } const ok = document.querySelector('#cvOk'); if (ok) ok.click(); }, 100); G.S.time = 4 * 1440 + 15 * 60; G.busy++; Story.finalPresentation().then(() => { G.busy--; clearInterval(window.__cv); window.__cvd = 1; }); }""")
    for _ in range(40):
        if pg.evaluate("() => window.__cvd === 1"): break
        time.sleep(0.5)
    assert pg.evaluate("() => window.__cvd === 1 && !!G.S.flags.final"), "Final fehlt"
    shot("09_final")
    run("G.busy++; await Story.goHome(); G.busy--;", 7.0)
    assert pg.evaluate("() => G.mode === 'over' && !!document.querySelector('#endNew')"), "Kein Ende"
    shot("10_end")
    print("Endzustand:", state())
    # Colba-Spieler: Fran holt die Schweizer am Flughafen ab, kein eigener Koffer, Hotelzimmer von Juanjo gebucht
    run("const S3 = newState(personLook('fran'), 'Fran'); S3.pid = 'fran'; S3.team = 'indurain'; await startGame(S3, true);", 6.0)
    assert state()["map"] == "airport" and state()["stage"] == "koffer", state()
    run("G.busy++; await Story.baggage(); G.busy--;", 1.0)
    assert state()["stage"] == "sammeln", state()
    assert pg.evaluate("() => Story.airportGroup().length === 5 && !G.npcs.some((n) => n.id === 'fran')"), "Abholgruppe falsch"
    run("for (const id of Story.airportGroup()) { const n = G.npcs.find((a) => a.id === id); G.busy++; await Story.meetAtAirport(id, n || { bubble: null }); G.busy--; }", 1.0)
    assert state()["stage"] == "taxi", state()
    run("G.busy++; await Story.taxiToHotel(); G.busy--; await warpTo('hotel_lobby', 'entry'); G.busy++; await Story.reception(); G.busy--; await warpTo('hotel_room', 'entry'); G.busy++; await Story.unpack(); G.busy--;", 8.0)
    assert state()["stage"] == "bar", state()
    assert pg.evaluate("() => UI.speaker('Fran').name === G.S.name && UI.speaker('fran').look === G.S.look && Story.isHere('fran', 'hotel_room')"), "Spieler spricht nicht selbst"
    shot("11_colba_player")
    # Termine: verpasster Kickoff -> Panel „Termin verpasst“, Neustart zwei Stunden vorher
    run("G.S.stage = 'free'; G.S.flags.noAppts = 0; G.S.flags.kickoff = 0; G.S.flags.apw = {}; G.busy = 0; G.S.time = 1440 + 8 * 60; Story.checkAppts(); G.S.time = 1440 + 10 * 60 + 40; Story.checkAppts();", 1.0)
    assert pg.evaluate("() => !!document.querySelector('#msRetry')"), "Panel 'Termin verpasst' fehlt"
    pg.click('#msRetry'); time.sleep(3.0)
    tm = pg.evaluate("() => [clockStr(), today(), G.mode, G.busy]")
    assert tm[0].startswith('07:3') and tm[1] == 1 and tm[2] == 'play', f"Neustart vor dem Termin fehlgeschlagen: {tm}"
    run("G.S.flags.noAppts = 1;")
    missing = pg.evaluate("() => [...I18N_MISSING]")
    if LANG != "de" and missing:
        errors.append("Fehlende Übersetzungen (" + LANG + "): " + json.dumps(missing, ensure_ascii=False))
    browser.close()

if errors:
    print("FEHLER:\n" + "\n".join(errors))
    sys.exit(1)
print("Smoke-Test bestanden.")
