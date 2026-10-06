/* ============ Workshops im Aufenthaltsraum: UX, Architektur, Roadmap, PI-Retrospektive ============ */
/* Gemeinsamer Rahmen: Fragekarten (ux, retro) und Zuordnungs-Boards (arch, roadmap). Ergebnis { correct, total } bzw. { ok, errors, placed }. */
Object.assign(Mini, {
  /* ---------- UX-Workshop mit Elena: zu jedem Problem die beste Lösung ---------- */
  UX: [
    [_t('Der Akku-Ring ist rot, obwohl 60 % Akku da sind.'), [_t('Farbe nach Ladezustand: grün über 40 %, orange über 20 %, darunter rot'), _t('Ring einfach blau machen'), _t('Die Prozentzahl weglassen')], _t('Farbe muss etwas bedeuten – sonst lügt sie.')],
    [_t('Der Start-Button ist 20 Pixel gross.'), [_t('Mindestens 44 Pixel Touchfläche'), _t('Einen Tooltip ergänzen'), _t('Den Button blinken lassen')], _t('Daumen sind grösser als Mauszeiger.')],
    [_t('Fehlermeldung: „Error 0x60A0“.'), [_t('Klartext: „Motor zu heiss – 5 Minuten warten“, Code klein darunter'), _t('Den Code grösser schreiben'), _t('Die Meldung ausblenden')], _t('Fran versteht 0x60A0. Der Rest der Welt nicht.')],
    [_t('Das Onboarding hat neun Screens.'), [_t('Auf drei kürzen, der Rest kommt später im Kontext'), _t('Den Überspringen-Button verstecken'), _t('Mehr Animationen einbauen')], _t('Niemand will neun Screens, bevor er das Bike sieht.')],
    [_t('Dark Mode: grauer Text auf dunkelgrauem Grund.'), [_t('Kontrast mindestens 4,5 : 1'), _t('Die Schrift kleiner machen'), _t('Nur im hellen Modus testen')], _t('Kontrast ist keine Geschmacksfrage, sondern Lesbarkeit.')],
    [_t('Die Werkstatt findet die Diagnose nicht.'), [_t('Diagnose ins Hauptmenü, mit Icon und Text'), _t('Ins Impressum verschieben'), _t('Ein Popup bei jedem Start')], _t('Was wichtig ist, gehört auf die erste Ebene.')],
  ],
  ux() { return this.quizCards(_t('UX-Workshop'), 'elena', this.UX, _t('Elena zeigt ein Problem aus der App. Welche Lösung würde sie wählen?'), _t('Lösung?')); },

  /* ---------- PI-Retrospektive: Keep, Stop, Start ---------- */
  RETRO: [
    [_t('Daily um 9:00, pünktlich, maximal 15 Minuten'), 'K', _t('Keep: hat die ganze Woche funktioniert.')],
    [_t('Planning Poker ohne Fran, weil er am Prüfstand steht'), 'S', _t('Stop: ohne den Hardware-Blick sind die Schätzungen zu optimistisch.')],
    [_t('Automatische Tests vor jedem Merge'), 'T', _t('Start: Daniel hat drei Bugs gefunden, die ein Test gefangen hätte.')],
    [_t('Abhängigkeiten erst am Freitag klären'), 'S', _t('Stop: am Freitag hat niemand mehr Kapazität zum Verhandeln.')],
    [_t('Mittagessen gemeinsam im Aufenthaltsraum'), 'K', _t('Keep: die besten Lösungen kamen beim Socarrat.')],
    [_t('Ein Review mit echten Werkstätten pro Sprint'), 'T', _t('Start: Feedback von Leuten, die das Bike jeden Tag reparieren.')],
    [_t('Die Klingel am Hochhaus anschreiben'), 'S', _t('Stop – nein, Keep. Isabel besteht darauf. Tradition. (Zählt trotzdem als Stop.)')],
  ],
  retro() {
    const items = shuffle(this.RETRO.slice()).slice(0, 6);
    const L = { K: _t('Keep'), S: _t('Stop'), T: _t('Start') };
    return this.sortCards(_t('PI-Retrospektive'), items, L, _t('Was behalten wir (Keep), was lassen wir (Stop), was fangen wir an (Start)?'), _t('Thema'));
  },

  /* Fragekarten: Problem mit drei Lösungen, eine ist richtig */
  quizCards(title, host, pool, hint, label) {
    const qs = shuffle(pool.slice()).slice(0, 6);
    let idx = 0, correct = 0, msg = '';
    const o = UI.overlay('', null);
    return new Promise((resolve) => {
      let done = false;
      const fin = (v) => { if (done) return; done = true; UI.closeOverlay(); resolve(v); };
      UI._ovClose = () => { if (!done) { done = true; resolve(null); } };
      const render = () => {
        if (idx >= qs.length) { fin({ correct, total: qs.length }); return; }
        const [q, opts, why] = qs[idx];
        const order = shuffle([0, 1, 2]);
        o.innerHTML = _t`<div class="panel mini"><div class="panel-head"><h2>${title}</h2><span class="sub">${idx + 1}/${qs.length} · ${correct} richtig</span><button class="x-btn" id="wsX">×</button></div><div class="panel-body">
          <div class="teamcard"><canvas width="96" height="96" id="wsHost"></canvas><div><div class="n">${fname(host)}</div><div class="r">${msg || hint}</div></div></div>
          <div class="story-card" style="background:#ffe6a8;border-color:#e0c070"><b>${label}</b>${q}</div>
          <div class="cards" style="flex-direction:column">${order.map((i) => `<button class="pcard" style="width:100%;height:auto;min-height:48px;padding:6px 10px;font-size:13px;font-family:var(--f-body);text-align:left" data-a="${i}">${opts[i]}</button>`).join('')}</div>
          </div></div>`;
        o.querySelector('#wsHost').getContext('2d').drawImage(portraitCanvas(UI.speaker(host).look, PEOPLE[host].bg), 0, 0);
        o.querySelector('#wsX').onclick = () => fin(null);
        o.querySelectorAll('.pcard[data-a]').forEach((b) => b.onclick = () => { const ok = +b.dataset.a === 0; if (ok) { correct++; Snd.sfx('ok'); } else Snd.sfx('error'); msg = `${ok ? '✓' : '✗'} ${why}`; idx++; render(); });
      };
      render();
    });
  },
  /* Sortierkarten: jedes Thema bekommt eine Kategorie */
  sortCards(title, items, L, hint, label) {
    let idx = 0, correct = 0, msg = '';
    const o = UI.overlay('', null);
    return new Promise((resolve) => {
      let done = false;
      const fin = (v) => { if (done) return; done = true; UI.closeOverlay(); resolve(v); };
      UI._ovClose = () => { if (!done) { done = true; resolve(null); } };
      const render = () => {
        if (idx >= items.length) { fin({ correct, total: items.length }); return; }
        const [t, ans, why] = items[idx];
        o.innerHTML = _t`<div class="panel mini"><div class="panel-head"><h2>${title}</h2><span class="sub">${idx + 1}/${items.length} · ${correct} richtig</span><button class="x-btn" id="wsX">×</button></div><div class="panel-body">
          <p class="note">${msg || hint}</p>
          <div class="story-card" style="background:#c8e6ff;border-color:#8ab8e0"><b>${label}</b>${t}</div>
          <div class="roam-grid">${Object.keys(L).map((k) => `<button data-k="${k}">${L[k]}</button>`).join('')}</div>
          </div></div>`;
        o.querySelector('#wsX').onclick = () => fin(null);
        o.querySelectorAll('.roam-grid button').forEach((b) => b.onclick = () => { const ok = b.dataset.k === ans; if (ok) { correct++; Snd.sfx('ok'); } else Snd.sfx('error'); msg = `${ok ? '✓' : '✗'} ${why}`; idx++; render(); });
      };
      render();
    });
  },

  /* ---------- Architektur-Workshop mit Carlos: Komponenten in die richtige Schicht ---------- */
  ARCH: [[_t('Akku-Ring-Widget'), 0], [_t('Login-Screen'), 0], [_t('Onboarding-Flow'), 0], [_t('SOC-Berechnung'), 1], [_t('Fehlercode-Regeln'), 1], [_t('Reichweiten-Schätzung'), 1], [_t('CAN-Bridge (BLE)'), 2], [_t('Battery-Pass-API-Client'), 2], [_t('Telemetrie-Speicher'), 2], [_t('OTA-Update-Server'), 3], [_t('Kubernetes-Pipeline'), 3], [_t('Grafana-Dashboards'), 3]],
  ARCH_LAYERS: [_t('UI'), _t('Domäne'), _t('Daten & CAN'), _t('Infrastruktur')],
  arch() {
    const items = shuffle(this.ARCH.slice()).slice(0, 8).map(([n, l]) => ({ n, l, s: -1 }));
    return this.placeBoard(_t('Architektur-Workshop'), items, this.ARCH_LAYERS.map((n) => ({ n, cap: 99 })), _t('Carlos zeichnet vier Schichten. Tipp eine Komponente an, dann die Schicht, in die sie gehört. Oben die UI, unten die Infrastruktur – Abhängigkeiten zeigen immer nach unten.'), (it, col) => it.l === col, _t('Schichten prüfen'));
  },

  /* ---------- Roadmap-Workshop mit Chris: Meilensteine und Releases auf sechs Sprints ---------- */
  ROADMAP: [
    { id: 'login', short: _t('Login'), n: _t('◆ Login-SDK fertig'), after: [] },
    { id: 'parser', short: _t('Parser'), n: _t('◆ CAN-Parser refactort'), after: [] },
    { id: 'ota', short: _t('OTA'), n: _t('◆ OTA-Protokoll definiert'), after: [] },
    { id: 'bpapi', short: _t('BP-API'), n: _t('◆ Battery-Pass-API live'), after: ['parser'] },
    { id: 'app20', short: _t('App 2.0'), n: _t('🚀 Release App 2.0 (Akku-Ring, Login)'), after: ['login'] },
    { id: 'portal', short: _t('Portal'), n: _t('🚀 Händlerportal Beta'), after: ['login'] },
    { id: 'pilot', short: _t('OTA-Pilot'), n: _t('◆ OTA-Pilot mit 50 Bikes'), after: ['ota', 'parser'] },
    { id: 'app21', short: _t('App 2.1'), n: _t('🚀 Release App 2.1 (Battery-Pass-QR)'), after: ['bpapi', 'app20'] },
    { id: 'diag', short: _t('Diagnose'), n: _t('🚀 Diagnose-Tool für Werkstätten'), after: ['parser'] },
    { id: 'review', short: _t('Demo'), n: _t('◆ PI-Review und Demo'), after: ['app21', 'pilot', 'portal', 'diag'] },
  ],
  roadmap() {
    const items = this.ROADMAP.map((r) => Object.assign({ s: -1 }, r));
    const months = [_t('Apr'), _t('Mai'), _t('Jun'), _t('Jul'), _t('Aug'), _t('Sep')];
    const cols = months.map((m, i) => ({ n: `S${i + 1} · ${m}`, cap: 2 }));
    const okFn = (it, col) => it.after.every((a) => { const p = items.find((x) => x.id === a); return p && p.s >= 0 && p.s < col; });
    return this.placeBoard(_t('Roadmap-Workshop'), items, cols, _t('Chris legt sechs Sprints aus (April bis September). ◆ Meilensteine und 🚀 Releases: Tipp einen Punkt an, dann einen Sprint. Jeder Punkt muss NACH seinen Voraussetzungen liegen, höchstens zwei Punkte pro Sprint, die Demo zuletzt.'), okFn, _t('Roadmap prüfen'));
  },

  /* Zuordnungs-Board: Karten antippen, Spalte antippen; okFn(item, colIndex) prüft die Platzierung beim Abschluss */
  placeBoard(title, items, cols, hint, okFn, okLabel) {
    let sel = 0;
    const o = UI.overlay('', null);
    return new Promise((resolve) => {
      let done = false;
      const fin = (v) => { if (done) return; done = true; UI.closeOverlay(); resolve(v); };
      UI._ovClose = () => { if (!done) { done = true; resolve(null); } };
      const inCol = (i) => items.filter((it) => it.s === i);
      const render = () => {
        const rest = items.filter((it) => it.s < 0);
        o.innerHTML = _t`<div class="panel mini"><div class="panel-head"><h2>${title}</h2><span class="sub">${rest.length} offen</span><button class="x-btn" id="wsX">×</button></div><div class="panel-body">
          <p class="note">${hint}</p>
          <div class="cards">${rest.map((it) => `<button class="pcard ${sel === items.indexOf(it) ? 'sel' : ''}" style="width:auto;padding:0 8px;height:auto;min-height:40px;font-size:11px;font-family:var(--f-sign)" data-f="${items.indexOf(it)}">${it.n}</button>`).join('') || _t('<span class="note">Alles verteilt.</span>')}</div>
          <div class="cols" style="grid-template-columns:repeat(${cols.length}, 1fr)">${cols.map((c, i) => { const l = inCol(i); return `<div class="col ${l.length > c.cap ? 'over' : l.length ? 'ok' : ''}" data-s="${i}" style="min-height:70px"><b>${c.n}</b>${l.map((it) => `<span class="chip" data-f="${items.indexOf(it)}" title="${it.n}">${it.short || it.n}</span>`).join('')}</div>`; }).join('')}</div>
          <button class="btn primary" id="wsOk" ${rest.length ? 'disabled' : ''}>${okLabel}</button>
          </div></div>`;
        o.querySelector('#wsX').onclick = () => fin(null);
        o.querySelectorAll('.pcard[data-f]').forEach((b) => b.onclick = () => { sel = +b.dataset.f; Snd.sfx('key'); render(); });
        o.querySelectorAll('.col').forEach((c) => c.onclick = (e) => {
          const t = e.target.closest('.chip[data-f]');
          if (t) { items[+t.dataset.f].s = -1; sel = +t.dataset.f; Snd.sfx('blip'); render(); return; }
          if (items[sel] && items[sel].s < 0) { items[sel].s = +c.dataset.s; Snd.sfx('card'); const nx = items.findIndex((it) => it.s < 0); if (nx >= 0) sel = nx; render(); }
        });
        const ok = o.querySelector('#wsOk'); if (ok) ok.onclick = () => { const errors = items.filter((it) => !okFn(it, it.s)).length + cols.filter((c, i) => inCol(i).length > c.cap).length; fin({ ok: errors === 0, errors, placed: items.length }); };
      };
      render();
    });
  },
});
