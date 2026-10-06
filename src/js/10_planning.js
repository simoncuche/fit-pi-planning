/* ============ Planning-Minispiele: Poker, CANopen, ROAM, Programm-Board, Abhängigkeiten, Confidence Vote ============ */
const Mini = {
  key: null,
  frame(title, sub, inner) {
    return _t`<div class="panel mini"><div class="panel-head"><h2>${title}</h2><span class="sub" id="miniSub">${sub || ''}</span><button class="x-btn" id="miniCam" aria-label="Foto machen" title="Foto machen">📷</button><button class="x-btn" id="miniX" aria-label="Abbrechen">×</button></div><div class="panel-body">${inner}</div></div>`;
  },
  run(title, sub, inner, W, H, setup) {
    return new Promise((resolve) => {
      let done = false, raf = 0;
      const finish = (v) => { if (done) return; done = true; cancelAnimationFrame(raf); Mini.key = null; UI.closeOverlay(); resolve(v); };
      const o = UI.overlay(Mini.frame(title, sub, inner), () => { if (!done) { done = true; cancelAnimationFrame(raf); Mini.key = null; resolve(null); } });
      o.querySelector('#miniX').onclick = () => finish(null);
      const cv = o.querySelector('canvas');
      const camB = o.querySelector('#miniCam'); if (camB) { if (!cv) camB.remove(); else camB.onclick = () => Snap.shoot(cv); }
      const ctx = cv ? cv.getContext('2d') : null;
      if (cv) { cv.width = W; cv.height = H; ctx.imageSmoothingEnabled = false; }
      const api = { o, cv, ctx, finish, sub: (t) => { const e = o.querySelector('#miniSub'); if (e) e.innerHTML = t; }, t0: performance.now() };
      const tick = setup(api);
      if (!tick) return;
      let last = performance.now();
      const loop = (now) => { if (done) return; const dt = Math.min(0.05, (now - last) / 1000); last = now; tick(dt, (now - api.t0) / 1000); raf = requestAnimationFrame(loop); };
      raf = requestAnimationFrame(loop);
    });
  },
  wob() { const p = G.S.st.prom; return 1 + Math.max(0, p - 0.4) * 1.4 + (G.S.st.energy < 25 ? 0.5 : 0); },

  /* ---------- Planning Poker: Features schätzen, Konsens mit dem Team finden ---------- */
  FEATURES: {
    indurain: [[_t('Motor-Diagnose über CANopen'), _t('Fehlercodes 0x60A0 auslesen und in der Werkstatt-App anzeigen'), 8], [_t('Battery-SOC-Stream'), _t('State of Charge alle 500 ms als PDO publizieren'), 5], [_t('OTA-Update-Protokoll'), _t('SDO-Blocktransfer für Firmware, mit Rollback'), 13], [_t('Heartbeat-Überwachung'), _t('Node-Guarding, Timeout nach 3 s'), 3], [_t('CAN-Logger im Prüfstand'), _t('Trace-Dateien aufzeichnen und exportieren'), 5], [_t('Bremslicht-Signal'), _t('Rücklicht bei Rekuperation ansteuern'), 2], [_t('Rekuperations-Kennlinie'), _t('Energierückgewinnung beim Bremsen abstimmen, drei Stufen'), 5], [_t('Schiebehilfe'), _t('Walk-Assist bis 6 km/h über den Controller'), 3], [_t('Lichtsteuerung über CAN'), _t('Front- und Rücklicht als CANopen-Objekt 0x2010'), 3], [_t('Diebstahlschutz-Modus'), _t('Motor sperren, wenn das Bike per App gesperrt ist'), 8], [_t('Temperatur-Derating'), _t('Leistung drosseln, wenn der Motor über 80 °C kommt'), 5], [_t('Tretsensor-Kalibrierung'), _t('Drehmomentsensor im Prüfstand automatisch abgleichen'), 8], [_t('Fehlerspeicher löschen'), _t('Service-Funktion für die Werkstatt, mit Protokoll'), 2], [_t('Zweitakku-Umschaltung'), _t('Range-Extender nahtlos zuschalten'), 13], [_t('Bootloader-Signatur'), _t('Firmware nur mit gültiger Signatur flashen'), 8], [_t('Reifendruck-Sensor'), _t('BLE-Sensor einbinden und auf dem Display zeigen'), 5], [_t('Display-Protokoll v2'), _t('Neues Bedienteil mit höherer Baudrate anbinden'), 8], [_t('Standby-Stromverbrauch'), _t('Sleep-Mode unter 1 mA bringen'), 5]],
    meeseeks: [[_t('Akku-Ring in der App'), _t('Elenas Design-System: Ring mit SOC und Restreichweite'), 5], [_t('Login-SDK'), _t('OAuth für Android, iOS und Web, Biometrie'), 13], [_t('Batteriepass-QR'), _t('QR-Code scannen, Pass anzeigen'), 8], [_t('Bluetooth-Pairing'), _t('Bike per BLE koppeln, CAN-Bridge'), 8], [_t('Onboarding-Flow'), _t('Pascals Entwurf aus Frankfurt: fünf Screens'), 3], [_t('Dark Mode'), _t('Alle Screens, beide Plattformen'), 2], [_t('Routenplaner'), _t('Reichweite auf der Karte einzeichnen, mit Höhenprofil'), 13], [_t('Push-Benachrichtigungen'), _t('Akku voll, Service fällig, Bike bewegt sich'), 5], [_t('Fahrtenbuch'), _t('Alle Fahrten mit Strecke, Höhenmetern und Verbrauch'), 8], [_t('Diebstahlalarm'), _t('Bewegung ohne entsperrte App meldet sich aufs Handy'), 8], [_t('Widget für den Homescreen'), _t('Akkustand sehen, ohne die App zu öffnen'), 3], [_t('Mehrere Bikes verwalten'), _t('Familienkonto mit bis zu fünf Bikes'), 5], [_t('Service-Erinnerung'), _t('Nach 1000 km die Werkstatt vorschlagen'), 2], [_t('Sprachen ES und IT'), _t('Lokalisierung für Spanien und Italien'), 3], [_t('Offline-Karten'), _t('Kartenkacheln für die Tour vorab laden'), 8], [_t('Fitness-Export'), _t('Fahrten an Strava und Apple Health übergeben'), 5], [_t('Barrierefreiheit'), _t('Screenreader und grosse Schrift auf allen Screens'), 5], [_t('Release-Pipeline für die Stores'), _t('Automatisch bauen, testen und einreichen'), 8]],
    rocket: [[_t('Battery-Pass-API'), _t('REST und GraphQL, EU-Datenmodell nach Lukas'), 13], [_t('CAN-Parser-Refactoring'), _t('Carlos: 4000 Zeilen in Module zerlegen'), 8], [_t('Händlerportal'), _t('Web-App für Bike-Händler, Login über Meeseeks-SDK'), 13], [_t('Update-Server'), _t('Firmware-Pakete verwalten, OTA ausrollen'), 8], [_t('Monitoring-Dashboard'), _t('Grafana für Flottendaten'), 5], [_t('Dokumentation'), _t('Salva schreibt alles auf'), 3], [_t('Flotten-Export'), _t('CSV und PDF für Händler und Verleiher'), 3], [_t('Garantie-Workflow'), _t('Garantiefall erfassen, prüfen, freigeben'), 8], [_t('Rechte und Rollen'), _t('Händler, Werkstatt, Admin mit Berechtigungen'), 5], [_t('Audit-Log'), _t('Jede Änderung nachvollziehbar speichern'), 5], [_t('Firmware-Freigabestufen'), _t('Beta, Pilot, Alle – mit Rollback'), 8], [_t('Datenlöschung nach DSGVO'), _t('Konto und Fahrdaten auf Wunsch löschen'), 5], [_t('Zweite Region'), _t('Failover nach Frankfurt, Lastverteilung'), 13], [_t('Händler-Onboarding'), _t('Einladung, Vertrag, erster Login'), 5], [_t('Reporting-API'), _t('Kennzahlen pro Flotte als Endpunkt'), 5], [_t('Ersatzteil-Katalog'), _t('Teile pro Bike-Modell mit Lagerbestand'), 8], [_t('Alarmierung'), _t('Pager, wenn der Update-Server ausfällt'), 3], [_t('Testdaten-Generator'), _t('Tausend Bikes für die Lasttests'), 2]],
  },
  /* Schon geschätzte Features merken (Flags est[team]), damit nichts zweimal geschätzt wird */
  pickFresh(list, key, n, name) {
    const f = G.S.flags, seen = (f[key] = f[key] || {});
    let pool = list.filter((e) => !seen[name(e)]);
    if (pool.length < n) { for (const k of Object.keys(seen)) delete seen[k]; pool = list.slice(); }
    return { feats: shuffle(pool).slice(0, n), mark: (e) => { seen[name(e)] = 1; } };
  },
  poker(team) {
    const { feats, mark } = this.pickFresh(this.FEATURES[team], 'est_' + team, 4, (e) => e[0]);
    const CARDS = [1, 2, 3, 5, 8, 13, 20];
    const members = TEAMS[team].members.filter((id) => id !== G.S.pid).slice(0, 4);
    const names = members.map(fname);
    let idx = 0, consensus = 0, round = 0, votes = null, sel = null;
    const o = UI.overlay('', null);
    return new Promise((resolve) => {
      let done = false;
      const fin = (v) => { if (done) return; done = true; UI.closeOverlay(); resolve(v); };
      UI._ovClose = () => { if (!done) { done = true; resolve(null); } };
      const render = () => {
        const [n, d, ref] = feats[idx];
        const hint = ref >= 13 ? _t('Das Team murmelt: „Das ist gross.“') : ref >= 8 ? _t('Danny: „Mittel bis gross.“') : ref >= 5 ? _t('Estella: „Machbar in einem Sprint.“') : _t('Fran: „Kleinigkeit.“');
        o.innerHTML = _t`<div class="panel mini"><div class="panel-head"><h2>Planning Poker</h2><span class="sub">Feature ${idx + 1}/${feats.length} · Konsens ${consensus}</span><button class="x-btn" id="pkX">×</button></div><div class="panel-body">
          <div class="story-card"><b>${n}</b>${d}<br><small>${round ? hint : _t('Jeder schätzt verdeckt in Story Points. Dann aufdecken – bei Ausreissern wird diskutiert und nochmal geschätzt.')}</small></div>
          <div class="cards" id="pkTeam">${members.map((id, i) => `<div><canvas width="96" height="96" style="width:40px;height:40px;image-rendering:pixelated;border-radius:6px;display:block;margin:0 auto 4px" data-p="${id}"></canvas><div class="pcard ${votes ? '' : 'back'}">${votes ? votes[i] : '?'}</div></div>`).join('')}</div>
          <div class="note" style="text-align:center">Deine Schätzung:</div>
          <div class="cards">${CARDS.map((c) => `<button class="pcard ${sel === c ? 'sel' : ''}" data-c="${c}">${c}</button>`).join('')}</div>
          ${votes ? `<button class="btn primary" id="pkNext">${round >= 2 || votes.every((v) => Math.abs(CARDS.indexOf(v) - CARDS.indexOf(sel)) <= 1) ? _t('Nächstes Feature') : _t('Diskutieren und neu schätzen')}</button>` : _t('<button class="btn primary" id="pkReveal" ') + (sel == null ? 'disabled' : '') + '>Aufdecken</button>'}
          </div></div>`;
        o.querySelectorAll('canvas[data-p]').forEach((c) => c.getContext('2d').drawImage(portraitCanvas(personLook(c.dataset.p), PEOPLE[c.dataset.p].bg), 0, 0));
        o.querySelector('#pkX').onclick = () => fin(null);
        o.querySelectorAll('.pcard[data-c]').forEach((b) => b.onclick = () => { if (votes) return; sel = +b.dataset.c; Snd.sfx('key'); render(); });
        const rv = o.querySelector('#pkReveal'); if (rv) rv.onclick = () => {
          const ri = CARDS.indexOf(ref);
          votes = members.map((id, i) => { const spread = round === 0 ? 2 : 1; const k = clamp(ri + rint(-spread, spread) * (Math.random() < 0.5 ? 0 : 1), 0, CARDS.length - 1); return CARDS[k]; });
          Snd.sfx('card'); render();
        };
        const nx = o.querySelector('#pkNext'); if (nx) nx.onclick = () => {
          const agree = votes.every((v) => Math.abs(CARDS.indexOf(v) - CARDS.indexOf(sel)) <= 1);
          if (agree || round >= 2) { if (agree && Math.abs(CARDS.indexOf(sel) - CARDS.indexOf(ref)) <= 1) consensus++; else if (agree) consensus += 0.5; mark(feats[idx]); idx++; round = 0; votes = null; sel = null; if (idx >= feats.length) { fin({ consensus: Math.round(consensus), total: feats.length }); return; } }
          else { round++; votes = null; sel = null; }
          render();
        };
      };
      render();
    });
  },

  /* ---------- CANopen-Index-Quiz mit Fran ---------- */
  CAN: [[_t('Heartbeat Producer Time'), '0x1017', ['0x1017', '0x1005', '0x6040']], [_t('Battery State of Charge'), '0x6060', ['0x6060', '0x6064', '0x1018']], [_t('Fahrgeschwindigkeit'), '0x6064', ['0x6064', '0x6060', '0x1000']], [_t('Motortemperatur'), '0x6070', ['0x6070', '0x6080', '0x1400']], [_t('Battery State of Health'), '0x6080', ['0x6080', '0x6060', '0x1800']], [_t('Unterstützungsstufe (Assist Level)'), '0x6090', ['0x6090', '0x6040', '0x2000']], [_t('Fehlercode des Controllers'), '0x60A0', ['0x60A0', '0x1001', '0x6064']], [_t('Identity Object (Hersteller-ID)'), '0x1018', ['0x1018', '0x1000', '0x1017']], [_t('Controlword (Motor ein/aus)'), '0x6040', ['0x6040', '0x6041', '0x6090']], [_t('Device Type'), '0x1000', ['0x1000', '0x1001', '0x1018']]],
  canopen() {
    const { feats: qs, mark } = this.pickFresh(this.CAN, 'can_seen', 5, (e) => e[1]);
    let idx = 0, correct = 0, msg = '';
    const o = UI.overlay('', null);
    return new Promise((resolve) => {
      let done = false;
      const fin = (v) => { if (done) return; done = true; UI.closeOverlay(); resolve(v); };
      UI._ovClose = () => { if (!done) { done = true; resolve(null); } };
      const render = () => {
        if (idx >= qs.length) { fin({ correct, total: qs.length }); return; }
        const [q, ans, opts] = qs[idx];
        const sh = shuffle(opts.slice());
        o.innerHTML = _t`<div class="panel mini"><div class="panel-head"><h2>CANopen-Quiz</h2><span class="sub">Frage ${idx + 1}/${qs.length} · ${correct} richtig</span><button class="x-btn" id="cqX">×</button></div><div class="panel-body">
          <div class="teamcard"><canvas width="96" height="96" id="cqFran"></canvas><div><div class="n">Fran</div><div class="r">${msg || _t('Welcher Index im Objektverzeichnis?')}</div></div></div>
          <div class="story-card" style="background:#a8e6a0;border-color:#7ac08a"><b>${q}</b>Index?</div>
          <div class="cards">${sh.map((a) => `<button class="pcard" style="width:92px;font-size:13px" data-a="${a}">${a}</button>`).join('')}</div>
          ${hasInv('canref') ? _t('<p class="note">Du hast Frans Spickzettel in der Tasche – aber nachschauen wäre Betrug. Fran schaut.</p>') : ''}
          </div></div>`;
        o.querySelector('#cqFran').getContext('2d').drawImage(portraitCanvas(personLook('fran'), PEOPLE.fran.bg), 0, 0);
        o.querySelector('#cqX').onclick = () => fin(null);
        o.querySelectorAll('.pcard[data-a]').forEach((b) => b.onclick = () => { if (b.dataset.a === ans) { correct++; msg = pick([_t('¡Eso es!'), _t('Richtig. Weiter.'), _t('Du hast zugehört.')]); Snd.sfx('ok'); } else { msg = _t`Nein – ${ans}. ${pick([_t('Merk dir das.'), _t('Steht auf dem Prüfstand.'), _t('Nochmal: Objektverzeichnis.')])}`; Snd.sfx('error'); } mark(qs[idx]); idx++; render(); });
      };
      render();
    });
  },

  /* ---------- ROAM: Risiken einordnen ---------- */
  RISKS: [[_t('Fran ist im April zwei Wochen in den Ferien – niemand sonst kennt die Indexe'), 'M', _t('Mitigated: Spickzettel und Pairing mit Estella')], [_t('Der Akku-Lieferant ändert das CAN-Protokoll'), 'O', _t('Owned: Danny klärt es mit dem Lieferanten')], [_t('DANA-Warnung: halb Valencia bleibt zuhause'), 'A', _t('Accepted: im Herbst gehört der Regen dazu – Homeoffice-Tag')], [_t('Login-SDK von Meeseeks kommt erst in Sprint 3'), 'R', _t('Resolved: Abhängigkeit im Board geklärt')], [_t('Carlos’ Refactoring dauert länger als ein Sprint'), 'M', _t('Mitigated: Feature-Flag, alter Parser bleibt parallel')], [_t('EU-Batterieverordnung ändert das Datenmodell'), 'O', _t('Owned: Lukas verfolgt die Verordnung')], [_t('Robin verspricht dem Händler ein Feature, das nicht im Plan ist'), 'A', _t('Accepted: passiert. Simon fängt es ab.')], [_t('Prüfstand fällt aus (Guillem hat ihn rückwärts laufen lassen)'), 'R', _t('Resolved: Fran hat ihn repariert')], [_t('Zu wenig iOS-Kapazität im Sommer'), 'M', _t('Mitigated: Pascal bleibt zwei Sprints länger')], [_t('Apple lehnt die App wegen Bluetooth-Berechtigung ab'), 'O', _t('Owned: Oscar und Pablo prüfen die Guidelines')]],
  roam(team) {
    const risks = shuffle(this.RISKS.slice()).slice(0, 5);
    let idx = 0, correct = 0, msg = '';
    const o = UI.overlay('', null);
    const L = { R: _t('Resolved'), O: _t('Owned'), A: _t('Accepted'), M: _t('Mitigated') };
    return new Promise((resolve) => {
      let done = false;
      const fin = (v) => { if (done) return; done = true; UI.closeOverlay(); resolve(v); };
      UI._ovClose = () => { if (!done) { done = true; resolve(null); } };
      const render = () => {
        if (idx >= risks.length) { fin({ correct, total: risks.length }); return; }
        const [r, ans, why] = risks[idx];
        o.innerHTML = _t`<div class="panel mini"><div class="panel-head"><h2>ROAM · Risiken</h2><span class="sub">${idx + 1}/${risks.length} · ${correct} richtig</span><button class="x-btn" id="roX">×</button></div><div class="panel-body">
          <p class="note">${msg || _t('Jedes Risiko bekommt eine Kategorie: <b>R</b>esolved (erledigt), <b>O</b>wned (jemand kümmert sich), <b>A</b>ccepted (leben wir mit), <b>M</b>itigated (abgefedert).')}</p>
          <div class="story-card" style="background:#ff9fb0;border-color:#e68a9a"><b>Risiko</b>${r}</div>
          <div class="roam-grid">${['R', 'O', 'A', 'M'].map((k) => `<button data-k="${k}">${L[k]}</button>`).join('')}</div>
          </div></div>`;
        o.querySelector('#roX').onclick = () => fin(null);
        o.querySelectorAll(_t('.roam-grid button')).forEach((b) => b.onclick = () => { const ok = b.dataset.k === ans; if (ok) { correct++; Snd.sfx('ok'); } else Snd.sfx('error'); msg = `${ok ? '✓' : '✗'} ${why}`; idx++; render(); });
      };
      render();
    });
  },

  /* ---------- Programm-Board: Features auf sechs Sprints verteilen, Kapazität beachten ---------- */
  board(team) {
    const feats = shuffle(this.FEATURES[team].slice()).map(([n, d, p]) => ({ n, p, s: -1 }));
    const CAP = [10, 10, 10, 10, 10, 6];
    let sel = 0;
    const o = UI.overlay('', null);
    return new Promise((resolve) => {
      let done = false;
      const fin = (v) => { if (done) return; done = true; UI.closeOverlay(); resolve(v); };
      UI._ovClose = () => { if (!done) { done = true; resolve(null); } };
      const load = (i) => feats.filter((f) => f.s === i).reduce((a, f) => a + f.p, 0);
      const render = () => {
        const rest = feats.filter((f) => f.s < 0);
        o.innerHTML = _t`<div class="panel mini"><div class="panel-head"><h2>Programm-Board</h2><span class="sub">${rest.length} Features offen</span><button class="x-btn" id="bdX">×</button></div><div class="panel-body">
          <p class="note">Tipp ein Feature an, dann einen Sprint. Kapazität pro Sprint: 10 Punkte, Sprint 6 (IP) nur 6. Kein Sprint darf überlastet sein, keiner leer.</p>
          <div class="cards">${rest.map((f, i) => _t`<button class="pcard ${sel === feats.indexOf(f) ? 'sel' : ''}" style="width:auto;padding:0 8px;height:auto;min-height:48px;font-size:11px;font-family:var(--f-sign)" data-f="${feats.indexOf(f)}">${f.n}<br><b>${f.p} SP</b></button>`).join('') || _t('<span class="note">Alles verteilt.</span>')}</div>
          <div class="cols">${CAP.map((c, i) => { const l = load(i); return _t`<div class="col ${l > c ? 'over' : l > 0 ? 'ok' : ''}" data-s="${i}"><b>S${i + 1}</b>${l}/${c}${feats.filter((f) => f.s === i).map((f) => `<i class="${f.p >= 8 ? 'big' : ''}" title="${f.n}" data-f="${feats.indexOf(f)}"></i>`).join('')}</div>`; }).join('')}</div>
          <button class="btn primary" id="bdOk" ${rest.length ? 'disabled' : ''}>Board abschliessen</button>
          </div></div>`;
        o.querySelector('#bdX').onclick = () => fin(null);
        o.querySelectorAll('.pcard[data-f]').forEach((b) => b.onclick = () => { sel = +b.dataset.f; Snd.sfx('key'); render(); });
        o.querySelectorAll('.col').forEach((c) => c.onclick = (e) => { const t = e.target.closest('i[data-f]'); if (t) { feats[+t.dataset.f].s = -1; sel = +t.dataset.f; Snd.sfx('blip'); render(); return; } if (feats[sel] && feats[sel].s < 0) { feats[sel].s = +c.dataset.s; Snd.sfx('card'); const nx = feats.findIndex((f) => f.s < 0); sel = nx; render(); } });
        const ok = o.querySelector('#bdOk'); if (ok) ok.onclick = () => { const over = CAP.filter((c, i) => load(i) > c).length, empty = CAP.filter((c, i) => load(i) === 0).length; fin({ ok: over === 0 && empty === 0, filled: 6 - over - empty }); };
      };
      render();
    });
  },

  /* ---------- Abhängigkeit verhandeln: Sprint wählen, der für beide passt ---------- */
  deps(dep, otherTeam) {
    const need = rint(2, 4);
    const busy = shuffle([0, 1, 2, 3, 4, 5]).slice(0, 2).filter((s) => s !== need - 1);
    const o = UI.overlay('', null);
    return new Promise((resolve) => {
      let done = false;
      const fin = (v) => { if (done) return; done = true; UI.closeOverlay(); resolve(v); };
      UI._ovClose = () => { if (!done) { done = true; resolve(null); } };
      o.innerHTML = _t`<div class="panel mini"><div class="panel-head"><h2>Abhängigkeit</h2><span class="sub">${TEAMS[dep.from].n} → ${TEAMS[dep.to].n}</span><button class="x-btn" id="dpX">×</button></div><div class="panel-body">
        <div class="story-card" style="background:#8ec5ff;border-color:#5a9ad8"><b>${dep.t}</b>${dep.d}</div>
        <p class="note">${TEAMS[dep.to].n} braucht es <b>spätestens in Sprint ${need + 1}</b>. ${TEAMS[dep.from].n} hat in ${busy.map((s) => _t('Sprint ') + (s + 1)).join(_t(' und '))} keine Kapazität. Lieferung muss <b>vor</b> dem Bedarf liegen und in einen freien Sprint fallen.</p>
        <div class="cols">${[0, 1, 2, 3, 4, 5].map((s) => _t`<button class="col ${busy.includes(s) ? 'over' : ''}" data-s="${s}" style="min-height:50px"><b>S${s + 1}</b>${busy.includes(s) ? 'voll' : s === need ? _t('Bedarf') : 'frei'}</button>`).join('')}</div>
        </div></div>`;
      o.querySelector('#dpX').onclick = () => fin(null);
      o.querySelectorAll('.col').forEach((b) => b.onclick = () => { const s = +b.dataset.s; const ok = !busy.includes(s) && s < need; Snd.sfx(ok ? 'ok' : 'error'); fin({ ok, sprint: s }); });
    });
  },

  /* ---------- Confidence Vote ---------- */
  confidence(plan) {
    const members = TEAMS[myTeam()].members.filter((id) => id !== G.S.pid);
    const o = UI.overlay('', null);
    return new Promise((resolve) => {
      let done = false, mine = null;
      const fin = (v) => { if (done) return; done = true; UI.closeOverlay(); resolve(v); };
      UI._ovClose = () => { if (!done) { done = true; resolve(null); } };
      const render = () => {
        const votes = mine == null ? null : members.map((id) => clamp(Math.round(plan / 20 + rnd(-0.8, 0.8) + (G.S.aff[id] - 50) / 50), 1, 5));
        const avg = votes ? (votes.reduce((a, b) => a + b, mine) / (votes.length + 1)) : 0;
        o.innerHTML = _t`<div class="panel mini"><div class="panel-head"><h2>Confidence Vote</h2><span class="sub">${TEAMS[myTeam()].n} · Plan ${Math.round(plan)} %</span></div><div class="panel-body">
          <p class="note">Auf drei zeigt jeder mit den Fingern, wie sicher er sich fühlt, dass der Plan hält: 1 = „vergiss es“, 5 = „läuft“. Zuerst du.</p>
          <div class="cards">${[1, 2, 3, 4, 5].map((v) => `<button class="pcard ${mine === v ? 'sel' : ''}" data-v="${v}" ${mine != null ? 'disabled' : ''}>${'✋'.slice(0, 0)}${v}</button>`).join('')}</div>
          ${votes ? _t`<div class="cards">${members.map((id, i) => `<div><canvas width="96" height="96" style="width:40px;height:40px;image-rendering:pixelated;border-radius:6px;display:block;margin:0 auto 4px" data-p="${id}"></canvas><div class="pcard">${votes[i]}</div></div>`).join('')}</div><p class="note" style="text-align:center;font-size:16px"><b>Durchschnitt: ${avg.toFixed(1)}</b> ${avg >= 4 ? '🎉' : avg >= 3 ? '👍' : '😬'}</p><button class="btn primary" id="cvOk">Weiter</button>` : ''}
          </div></div>`;
        o.querySelectorAll('canvas[data-p]').forEach((c) => c.getContext('2d').drawImage(portraitCanvas(personLook(c.dataset.p), PEOPLE[c.dataset.p].bg), 0, 0));
        o.querySelectorAll('.pcard[data-v]').forEach((b) => b.onclick = () => { mine = +b.dataset.v; Snd.sfx('card'); render(); });
        const ok = o.querySelector('#cvOk'); if (ok) ok.onclick = () => fin({ avg, mine });
      };
      render();
    });
  },
};
