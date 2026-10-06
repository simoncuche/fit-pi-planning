/* ============ Freizeit-Minispiele: Koffer, Klingel, Kart, Segeln, Paella, Wein, Strandfussball, Disco, Padel, E-Bike ============ */
Object.assign(Mini, {
  /* ---------- Gepäckband: den eigenen Koffer erwischen ---------- */
  suitcase() {
    const W = 240, H = 120;
    const cols = ['#2a9aa0', '#c8352d', '#3f8e4b', '#2f5fb8', '#e8c23a', '#8a4a9c', '#1e1e22', '#f4f0e6'];
    const mineCol = '#2a9aa0';
    const cases = [];
    for (let i = 0; i < 9; i++) cases.push({ x: i * 60, col: i === 4 ? mineCol : pick(cols.filter((c) => c !== mineCol)), tag: i === 4 ? 'me' : i === 2 ? 'robin' : null });
    let grabbed = null, msg = _t('Das Band läuft. Drück A oder tipp, wenn DEIN Koffer (türkis, mit deinem Namen) vor dir ist.');
    return this.run(_t('Gepäckband 3'), _t('Zürich – Valencia'), _t`<canvas aria-label="Gepäckband"></canvas><div class="mini-bar"><span id="scInfo">${msg}</span></div><button class="btn primary" id="scGrab" style="height:56px;font-size:18px">Koffer greifen!</button>`, W, H, (api) => {
      const sheet = getSheet(G.S.look);
      const grab = () => { if (grabbed) return; const c = cases.find((k) => Math.abs(((k.x % 540) + 540) % 540 - 120) < 22 && k.y === undefined); if (!c) { api.o.querySelector('#scInfo').textContent = _t('Daneben gegriffen – kein Koffer vor dir.'); Snd.sfx('error'); return; } grabbed = c; Snd.sfx('ok'); };
      api.o.querySelector('#scGrab').onclick = grab; api.cv.addEventListener('pointerdown', grab);
      Mini.key = (k) => { if (['Space', 'Enter', 'KeyE'].includes(k)) grab(); };
      let t = 0, endT = 0;
      return (dt) => {
        t += dt;
        const c = api.ctx;
        R(c, 0, 0, W, H, '#c9cbcc'); R(c, 0, 30, W, 40, '#8a8e94'); R(c, 0, 34, W, 32, '#3a3c40'); for (let k = 0; k < W; k += 8) R(c, ((k - t * 50) % W + W) % W, 34, 1, 32, '#4a4c50');
        for (const k of cases) { if (k === grabbed) continue; k.x -= 50 * dt; const x = ((k.x % 540) + 540) % 540 - 60; if (x < -40 || x > W) continue; R(c, x, 38, 36, 24, k.col); R(c, x, 38, 36, 2, shade(k.col, 0.3)); R(c, x + 14, 34, 8, 4, '#2a2a2e'); if (k.tag) { R(c, x + 4, 54, 28, 7, '#f4f0e6'); pxText(c, k.tag === 'me' ? G.S.name.slice(0, 6) : 'ROBIN', x + 6, 55, '#1a1a1a'); } }
        R(c, 110, 60, 20, 10, 'rgba(255,255,255,0.15)'); R(c, 108, 58, 24, 1, '#ffd23d'); R(c, 108, 70, 24, 1, '#ffd23d');
        sceneSprite(c, sheet, 'stand', 3, 120 - SPR_W / 2, 110 - SPR_H);
        if (grabbed) { endT += dt; R(c, 102, 72, 36, 24, grabbed.col); if (endT > 0.6) api.finish({ wrong: grabbed.tag !== 'me' ? true : false, ok: grabbed.tag === 'me' }); }
        if (t > 40) api.finish(null);
      };
    }).then((r) => (r && !r.ok && r.wrong ? (UI.toast(_t('Das war Robins Koffer! Nochmal.')), Mini.suitcase()) : r));
  },
  /* ---------- Klingelbrett: zwölf Klingeln, keine heisst Colba ---------- */
  bell() {
    const names = [_t('Gestoría Ruiz'), _t('Dr. Ferrándiz'), _t('C.B. Soluciones 1ºB'), _t('Familia Martí'), _t('Peluquería Lola'), _t('Despacho 3A'), _t('Abogados Soler'), _t('Clínica Dental'), _t('Fisio Valencia'), _t('Estudio Arq.'), _t('Portería'), _t('Seguros Vidal')];
    const order = shuffle(names.slice());
    let tries = 0;
    return new Promise((resolve) => {
      let done = false;
      const fin = (v) => { if (done) return; done = true; UI.closeOverlay(); resolve(v); };
      const o = UI.overlay('', () => { if (!done) { done = true; resolve(null); } });
      const replies = { 'Gestoría Ruiz': _t('„¿Sí? ¿Hacienda?“ – „Nein, Colba.“ – „¡No!“ Klick.'), 'Dr. Ferrándiz': _t('Eine Sprechstundenhilfe: „Termin?“ – „Nein …“ Klick.'), 'Familia Martí': _t('Ein Kind: „¡Mamáááá!“ Dann Rauschen.'), 'Peluquería Lola': _t('„Haarschnitt erst ab 11.“'), 'Despacho 3A': _t('Niemand antwortet.'), 'Abogados Soler': _t('„Nombre completo, por favor.“ Du legst auf.'), 'Clínica Dental': _t('Bohrgeräusch. Klick.'), 'Fisio Valencia': _t('„Zweiter Stock, aber wir haben zu.“'), 'Estudio Arq.': _t('Jemand gähnt ins Mikrofon.'), 'Portería': _t('Der Portero: „Colba? Erster Stock, Klingel mit den Buchstaben. Hombre.“ Klick.'), 'Seguros Vidal': _t('„Lebensversicherung?“ – „Nein.“ Klick.') };
      const render = (msg) => {
        o.innerHTML = _t`<div class="panel mini"><div class="panel-head"><h2>Klingelbrett · Edificio Turia</h2><span class="sub">Versuch ${tries + 1}</span><button class="x-btn" id="blX">×</button></div><div class="panel-body">
          <p class="note">${msg || _t('Zwölf Klingeln. Isabel: „Steht nicht Colba dran.“ Hinweis aus der Mail: erster Stock.')}</p>
          <div class="bell-grid">${order.map((n) => `<button data-n="${n}"><i></i>${n}</button>`).join('')}</div></div></div>`;
        o.querySelector('#blX').onclick = () => fin(null);
        o.querySelectorAll(_t('.bell-grid button')).forEach((b) => b.onclick = () => { tries++; Snd.sfx('bell'); const n = b.dataset.n; if (n.startsWith(_t('C.B.'))) { setTimeout(() => { Snd.sfx('buzz'); fin({ ok: true, tries }); }, 500); b.classList.add('done'); return; } b.classList.add('done'); if (tries >= 4) { fin({ ok: false, tries }); return; } render(replies[n] || _t('Klick.')); });
      };
      render();
    });
  },
  /* ---------- Kartbahn: Rundkurs von oben, gegen Luigi oder die Uhr ---------- */
  kart(oppId) {
    const W = 240, H = 150;
    const path = []; for (let i = 0; i < 80; i++) { const a = i / 80 * 6.283; path.push({ x: 120 + Math.cos(a) * 90 + Math.cos(a * 3) * 10, y: 75 + Math.sin(a) * 50 + Math.sin(a * 2) * 8 }); }
    const [bg, bx] = canvas(W, H);
    R(bx, 0, 0, W, H, '#5a8a3a'); for (let i = 0; i < 60; i++) P(bx, Math.floor(hash(i, 1) * W), Math.floor(hash(i, 2) * H), '#4a7a30');
    bx.lineCap = 'round'; bx.lineJoin = 'round';
    for (const [w, col] of [[30, '#c8352d'], [26, '#f4f0e6'], [22, '#3a3c42']]) { bx.strokeStyle = col; bx.lineWidth = w; bx.beginPath(); path.forEach((p, i) => i ? bx.lineTo(p.x, p.y) : bx.moveTo(p.x, p.y)); bx.closePath(); bx.stroke(); }
    for (let k = 0; k < 6; k++) R(bx, path[0].x - 6 + k * 2, path[0].y - 11 + (k % 2) * 2, 2, 2, '#ffffff');
    R(bx, path[0].x - 7, path[0].y - 12, 14, 24, 'rgba(255,255,255,0.0)');
    for (let k = -12; k < 12; k += 4) for (let j = 0; j < 2; j++) R(bx, path[0].x + j * 3 - 2, path[0].y + k + 0, 3, 4, ((k / 4 + j) % 2) ? '#ffffff' : '#1a1a1e');
    const onTrack = (x, y) => path.some((p) => Math.hypot(p.x - x, p.y - y) < 14);
    return this.run(_t('Kart Valencia'), oppId ? _t`gegen ${fname(oppId)}` : _t('Zeitfahren · 3 Runden'), _t`<canvas aria-label="Kartbahn"></canvas><div class="mini-bar"><span id="ktInfo">◀ ▶ lenken, ▲ Gas (oder links/rechts tippen, Gas automatisch)</span><b id="ktT">0.0</b></div><div class="lanes" style="grid-template-columns:1fr 1fr"><button data-b="l">◀</button><button data-b="r">▶</button></div>`, W, H, (api) => {
      const me = { x: path[0].x, y: path[0].y + 4, a: Math.atan2(path[1].y - path[0].y, path[1].x - path[0].x), v: 0, lap: 0, seg: 0, laps: [], lapT: 0 };
      const op = oppId ? { i: 0, f: 0, lap: 0, sp: 2.2 } : null;
      const keys = { l: 0, r: 0, g: 0 };
      api.o.querySelectorAll('.lanes button').forEach((b) => { b.addEventListener('pointerdown', (e) => { e.preventDefault(); keys[b.dataset.b] = 1; }); b.addEventListener('pointerup', () => { keys[b.dataset.b] = 0; }); b.addEventListener('pointerleave', () => { keys[b.dataset.b] = 0; }); });
      const down = {};
      Mini.key = (k) => { down[k] = 1; };
      const onUp = (e) => { down[e.code] = 0; }; window.addEventListener('keyup', onUp);
      let t = 0, total = 0, over = false, msg = '';
      Snd.sfx('engine');
      return (dt) => {
        t += dt; total += dt;
        const c = api.ctx;
        const steer = (keys.r || down.ArrowRight || down.KeyD ? 1 : 0) - (keys.l || down.ArrowLeft || down.KeyA ? 1 : 0);
        const gas = Input.touch || down.ArrowUp || down.KeyW || !(down.ArrowDown || down.KeyS) ? 1 : 0;
        const wob = Mini.wob();
        me.a += steer * 2.8 * dt * (0.8 + me.v / 120) + (wob > 1 ? Math.sin(t * 3) * 0.3 * (wob - 1) * dt : 0);
        const on = onTrack(me.x, me.y);
        const vmax = on ? 95 : 35;
        me.v += (gas ? 90 : -60) * dt; me.v = clamp(me.v, 0, vmax);
        me.x += Math.cos(me.a) * me.v * dt; me.y += Math.sin(me.a) * me.v * dt;
        me.x = clamp(me.x, 4, W - 4); me.y = clamp(me.y, 4, H - 4);
        /* Rundenzählung über Streckensegmente */
        let best = 0, bd = 1e9; path.forEach((p, i) => { const d = Math.hypot(p.x - me.x, p.y - me.y); if (d < bd) { bd = d; best = i; } });
        if (best === (me.seg + 1) % 80 || best === (me.seg + 2) % 80) me.seg = best;
        if (me.seg >= 78 && best <= 1) { me.seg = 0; me.lap++; me.laps.push(total - me.lapT); me.lapT = total; Snd.sfx('ding'); if (me.lap >= 3) over = true; }
        if (op) { op.f += op.sp * dt * 10; if (op.f >= 80) { op.f -= 80; op.lap++; if (op.lap >= 3 && !over) { over = true; msg = _t('Luigi gewinnt'); } } }
        c.drawImage(bg, 0, 0);
        const kart = (x, y, a, col) => { c.save(); c.translate(x, y); c.rotate(a); R(c, -7, -5, 14, 10, col); R(c, -7, -5, 14, 2, shade(col, 0.3)); R(c, -8, -7, 4, 3, '#1a1a1e'); R(c, -8, 4, 4, 3, '#1a1a1e'); R(c, 4, -7, 4, 3, '#1a1a1e'); R(c, 4, 4, 4, 3, '#1a1a1e'); E(c, 0, 0, 3, 3, '#f4c8a0'); c.restore(); };
        if (op) { const i = Math.floor(op.f) % 80, p = path[i], q = path[(i + 1) % 80]; kart(p.x, p.y - 4, Math.atan2(q.y - p.y, q.x - p.x), '#c8352d'); }
        kart(me.x, me.y, me.a, '#2a9aa0');
        if (!on && me.v > 5 && Math.random() < 0.5) addPart({});
        api.o.querySelector('#ktT').textContent = _t`Runde ${Math.min(3, me.lap + 1)}/3 · ${(total - me.lapT).toFixed(1)} s${me.laps.length ? _t(' · beste ') + Math.min(...me.laps).toFixed(1) : ''}`;
        if (!on) api.o.querySelector('#ktInfo').textContent = _t('Im Gras! Zurück auf die Bahn.'); else api.o.querySelector('#ktInfo').textContent = msg || (op ? _t`Luigi: Runde ${Math.min(3, op.lap + 1)}` : _t('Gib Gas!'));
        if (over) { window.removeEventListener('keyup', onUp); const win = !op || me.lap >= 3 && op.lap < 3; Snd.sfx(win ? 'win' : 'lose'); api.finish({ best: me.laps.length ? Math.min(...me.laps) : 99, win, total }); }
        if (total > 150) { window.removeEventListener('keyup', onUp); api.finish({ best: me.laps.length ? Math.min(...me.laps) : 99, win: false, total }); }
      };
    });
  },
  /* ---------- Segeltörn: Bojen runden, Wind beachten ---------- */
  sail() {
    const W = 240, H = 150;
    const buoys = [{ x: 60, y: 40 }, { x: 180, y: 30 }, { x: 200, y: 110 }, { x: 90, y: 120 }, { x: 130, y: 75 }];
    return this.run(_t('Segeltörn'), _t('Marina de València'), _t`<canvas aria-label="Segeln"></canvas><div class="mini-bar"><span id="slInfo">◀ ▶ Ruder. Der Wind kommt von oben – gegen den Wind wirst du langsam.</span><b id="slB">0/5</b></div><div class="lanes" style="grid-template-columns:1fr 1fr"><button data-b="l">◀ Backbord</button><button data-b="r">Steuerbord ▶</button></div>`, W, H, (api) => {
      const b = { x: 120, y: 130, a: -Math.PI / 2, v: 0, next: 0, done: 0 };
      const keys = { l: 0, r: 0 };
      api.o.querySelectorAll('.lanes button').forEach((bt) => { bt.addEventListener('pointerdown', (e) => { e.preventDefault(); keys[bt.dataset.b] = 1; }); bt.addEventListener('pointerup', () => { keys[bt.dataset.b] = 0; }); bt.addEventListener('pointerleave', () => { keys[bt.dataset.b] = 0; }); });
      const down = {}; Mini.key = (k) => { down[k] = 1; }; const onUp = (e) => { down[e.code] = 0; }; window.addEventListener('keyup', onUp);
      let t = 0, wind = -Math.PI / 2;
      return (dt) => {
        t += dt; wind = -Math.PI / 2 + Math.sin(t * 0.3) * 0.6;
        const c = api.ctx;
        const steer = (keys.r || down.ArrowRight || down.KeyD ? 1 : 0) - (keys.l || down.ArrowLeft || down.KeyA ? 1 : 0);
        b.a += steer * 1.8 * dt;
        const rel = Math.cos(b.a - wind); /* 1 = genau gegen den Wind (Wind kommt aus Richtung wind) */
        const eff = clamp(1 - rel, 0.15, 1.6);
        b.v += (eff * 40 - b.v) * dt * 1.5;
        b.x += Math.cos(b.a) * b.v * dt; b.y += Math.sin(b.a) * b.v * dt;
        if (b.x < 6 || b.x > W - 6 || b.y < 6 || b.y > H - 6) { b.x = clamp(b.x, 6, W - 6); b.y = clamp(b.y, 6, H - 6); b.v *= 0.3; }
        const tgt = buoys[b.next];
        if (tgt && Math.hypot(tgt.x - b.x, tgt.y - b.y) < 14) { b.next++; b.done++; Snd.sfx('ding'); if (b.next >= buoys.length) { Snd.sfx('win'); api.finish({ buoys: b.done, total: buoys.length }); return; } }
        R(c, 0, 0, W, H, '#1f7fb8'); for (let k = 0; k < 40; k++) R(c, (k * 37 + t * 20) % W, (k * 13) % H, 8, 1, 'rgba(255,255,255,0.3)');
        R(c, 0, H - 10, 60, 10, '#a8865a'); R(c, 0, H - 12, 60, 2, '#c8a070');
        buoys.forEach((bu, i) => { const col = i < b.next ? '#3f8e4b' : i === b.next ? '#ff8c1a' : '#f4f0e6'; E(c, bu.x, bu.y, 5, 5, col); R(c, bu.x - 1, bu.y - 10, 2, 6, col); if (i === b.next) ring(c, bu.x, bu.y, 12 + Math.sin(t * 5) * 2, '#ffe08a'); });
        const wx = 200, wy = 20; line(c, wx - Math.cos(wind) * 12, wy - Math.sin(wind) * 12, wx + Math.cos(wind) * 12, wy + Math.sin(wind) * 12, '#ffffff'); E(c, wx + Math.cos(wind) * 12, wy + Math.sin(wind) * 12, 3, 3, '#ffffff'); pxText(c, 'WIND', wx - 8, wy + 16, '#ffffff');
        c.save(); c.translate(b.x, b.y); c.rotate(b.a); E(c, 0, 0, 10, 4, '#f4f0e6'); R(c, -2, -1, 4, 2, '#6a4a2a'); const sa = clamp(-(b.a - wind), -1, 1) * 0.8; c.rotate(sa); for (let k = 0; k < 14; k++) R(c, -k, -k * 0.5, 1, k, '#ffffff'); c.restore();
        api.o.querySelector('#slB').textContent = `${b.done}/${buoys.length}`;
        api.o.querySelector('#slInfo').textContent = rel > 0.7 ? _t('Im Wind! Abfallen – kreuzen.') : _t('Kurs auf die orange Boje.');
        if (t > 90) { window.removeEventListener('keyup', onUp); api.finish({ buoys: b.done, total: buoys.length }); }
      };
    });
  },
  /* ---------- Paella: Zutaten in der richtigen Reihenfolge zum richtigen Zeitpunkt ---------- */
  paella() {
    const steps = [[_t('Öl'), 'oil', '#e8c23a'], [_t('Hühnchen & Kaninchen'), 'meat', '#c87a4a'], [_t('Bohnen & Garrofó'), 'beans', '#3f8e4b'], [_t('Tomate & Paprika'), 'tomato', '#c8352d'], [_t('Wasser'), 'water', '#5ab8e0'], [_t('Safran'), 'saffron', '#ff8c1a'], [_t('Reis'), 'rice', '#f4f0e6'], [_t('Socarrat: Hitze hoch!'), 'fire', '#ff5a2a']];
    const order = steps.map((s) => s[1]);
    const W = 240, H = 120;
    return this.run(_t('Paella-Wettbewerb'), _t('Abuela Carmen schaut zu'), _t`<canvas aria-label="Paella"></canvas><div class="mini-bar"><span id="paInfo">Zutaten in der richtigen Reihenfolge – wenn die Pfanne grün blinkt!</span><b id="paS">0</b></div><div class="cards" id="paBtns">${shuffle(steps.slice()).map((s) => `<button class="pcard" style="width:auto;padding:0 8px;height:40px;font-size:11px;font-family:var(--f-sign);border-color:${s[2]}" data-k="${s[1]}">${s[0]}</button>`).join('')}</div>`, W, H, (api) => {
      let idx = 0, score = 0, t = 0, phase = 0, win = 0, msg = '', stirT = 0;
      const added = [];
      api.o.querySelectorAll('#paBtns button').forEach((b) => b.onclick = () => {
        if (idx >= order.length) return;
        const k = b.dataset.k;
        if (k === order[idx]) { const good = phase > 0.5; score += good ? 12 : 6; msg = good ? _t('¡Perfecto! Richtiger Moment.') : _t('Richtig, aber zu früh – die Pfanne war noch nicht so weit.'); added.push(k); idx++; Snd.sfx(good ? 'ok' : 'blip'); b.disabled = true; b.classList.add('sel'); if (idx >= order.length) { win = 1; } }
        else { score = Math.max(0, score - 8); msg = _t`Nein – zuerst ${steps[idx][0]}!`; Snd.sfx('error'); }
      });
      return (dt) => {
        t += dt; phase = (Math.sin(t * 1.6) + 1) / 2;
        const c = api.ctx;
        R(c, 0, 0, W, H, '#efe0b8'); R(c, 0, 90, W, 30, '#8a5e3a');
        E(c, 120, 70, 70, 26, '#2a2a2e'); E(c, 120, 68, 66, 23, phase > 0.5 ? '#3f8e4b' : '#1a1a1e'); E(c, 120, 68, 62, 21, '#2e2e34');
        const fill = ['oil', 'meat', 'beans', 'tomato', 'water', 'saffron', 'rice', 'fire'];
        added.forEach((k) => { const col = steps.find((s) => s[1] === k)[2]; if (k === 'water') E(c, 120, 68, 58, 19, '#8a6a30'); else if (k === 'rice') E(c, 120, 68, 58, 19, '#e8b040'); else if (k === 'fire') for (let j = 0; j < 20; j++) P(c, 70 + hash(j, 1) * 100, 60 + hash(j, 2) * 16, '#5a3010'); else for (let j = 0; j < 14; j++) E(c, 70 + hash(j, k.length) * 100, 60 + hash(k.length, j) * 16, 2, 1.5, col); });
        for (let k = 0; k < 4; k++) { const ph = (t * 0.6 + k / 4) % 1; c.fillStyle = `rgba(255,255,255,${0.4 * (1 - ph)})`; c.fillRect(100 + k * 14 + Math.sin(t * 2 + k) * 3, 50 - ph * 30, 3, 3); }
        for (let k = 0; k < 6; k++) R(c, 70 + k * 18, 94 + Math.sin(t * 9 + k) * 2, 6, 10, '#ff8c1a'); R(c, 60, 104, 120, 6, '#5a5e64');
        R(c, 10, 10, 60, 10, '#1a1a1e'); R(c, 12, 12, Math.round(56 * phase), 6, phase > 0.5 ? '#3f8e4b' : '#c8352d'); pxText(c, 'HITZE', 72, 12, '#1a1a1e');
        api.o.querySelector('#paS').textContent = _t`${score} Punkte`;
        api.o.querySelector('#paInfo').textContent = msg || (idx < order.length ? _t`Als Nächstes: ${steps[idx][0]} – wenn die Hitze grün ist.` : _t('Fertig!'));
        if (win) { stirT += dt; if (stirT > 1.2) { Snd.sfx('win'); api.finish({ score: Math.min(100, score + 4) }); } }
        if (t > 120) api.finish({ score });
      };
    });
  },
  /* ---------- Weindegustation: Traube erraten ---------- */
  wine() {
    const wines = [[_t('Bobal'), _t('Dunkles Rubinrot, Kirsche, Brombeere, kräftige Tannine – die Traube aus Utiel-Requena.')], [_t('Monastrell'), _t('Dicht, dunkel, Feigen und Lakritz, viel Alkohol – aus Alicante und Jumilla.')], [_t('Tempranillo'), _t('Rote Früchte, Vanille vom Holz, mittlere Tannine – der Klassiker aus Rioja, hier als Nachbar.')], [_t('Garnacha'), _t('Hell im Glas, Erdbeere, Pfeffer, wenig Tannin, weich – die Sonne von Aragón.')]];
    const order = shuffle(wines.slice());
    let idx = 0, correct = 0, msg = '';
    const o = UI.overlay('', null);
    return new Promise((resolve) => {
      let done = false;
      const fin = (v) => { if (done) return; done = true; UI.closeOverlay(); resolve(v); };
      UI._ovClose = () => { if (!done) { done = true; resolve(null); } };
      const render = () => {
        if (idx >= order.length) { fin({ correct, total: order.length }); return; }
        const [ans, desc] = order[idx];
        o.innerHTML = _t`<div class="panel mini"><div class="panel-head"><h2>Degustation</h2><span class="sub">Glas ${idx + 1}/4 · ${correct} richtig</span><button class="x-btn" id="wnX">×</button></div><div class="panel-body">
          <div class="teamcard"><div style="width:48px;height:48px;background:#8a1e3a;border-radius:50%;box-shadow:inset 0 -8px 0 #5a1020"></div><div><div class="n">Inés</div><div class="r">${msg || _t('Schwenken, riechen, schmecken. Welche Traube?')}</div></div></div>
          <div class="story-card" style="background:#f2c8c8;border-color:#c88a8a"><b>Glas ${idx + 1}</b>${desc}</div>
          <div class="cards">${shuffle(wines.map((w) => w[0])).map((n) => `<button class="pcard" style="width:100px;font-size:12px" data-n="${n}">${n}</button>`).join('')}</div>
          </div></div>`;
        o.querySelector('#wnX').onclick = () => fin(null);
        o.querySelectorAll('.pcard[data-n]').forEach((b) => b.onclick = () => { if (b.dataset.n === ans) { correct++; msg = pick([_t('¡Exacto!'), _t('Richtig. Du hast Geschmack.'), _t('Salud!')]); Snd.sfx('clink'); } else { msg = _t`Nein, das war ${ans}.`; Snd.sfx('error'); } idx++; render(); });
      };
      render();
    });
  },
  /* ---------- Strandfussball: Elfmeter, Torwart hält ---------- */
  soccer(oppId) {
    const W = 240, H = 130;
    return this.run(_t('Strandfussball'), _t`${fname(oppId)} im Tor`, _t`<canvas aria-label="Elfmeter"></canvas><div class="mini-bar"><span id="fbInfo">Tipp auf die Ecke oder drück A, wenn der Zeiger passt.</span><b id="fbS">0 : 0</b></div><button class="btn primary" id="fbShoot" style="height:52px;font-size:18px">Schuss!</button>`, W, H, (api) => {
      const st = { round: 0, me: 0, opp: 0, t: 0, phase: 'aim', aimX: 0, ball: null, gk: 0, wait: 0, msg: '' };
      const gkSheet = getSheet(personLook(oppId)), mySheet = getSheet(G.S.look);
      const shoot = (tx) => { if (st.phase !== 'aim') return; const x = tx != null ? tx : 120 + Math.sin(st.t * 3 * Mini.wob()) * 60; const err = rnd(-10, 10) * Mini.wob(); st.ball = { x: 120, y: 118, tx: clamp(x + err, 50, 190), ty: 52, p: 0 }; st.gk = pick([-1, 0, 1]) * 50 + rnd(-10, 10); st.phase = 'shot'; Snd.sfx('kick'); };
      api.o.querySelector('#fbShoot').onclick = () => shoot();
      api.cv.addEventListener('pointerdown', (e) => { const r = api.cv.getBoundingClientRect(); shoot((e.clientX - r.left) / r.width * W); });
      Mini.key = (k) => { if (['Space', 'Enter', 'KeyE'].includes(k)) shoot(); };
      return (dt) => {
        st.t += dt;
        const c = api.ctx;
        R(c, 0, 0, W, 40, '#5aa8e0'); R(c, 0, 40, W, H - 40, '#efe0b8'); for (let k = 0; k < 30; k++) P(c, (k * 29) % W, 44 + (k * 7) % 80, '#dcc89a');
        R(c, 50, 30, 140, 3, '#f4f0e6'); R(c, 50, 30, 3, 32, '#f4f0e6'); R(c, 187, 30, 3, 32, '#f4f0e6'); for (let k = 54; k < 186; k += 5) for (let j = 34; j < 60; j += 5) P(c, k, j, 'rgba(255,255,255,0.5)');
        const gkx = 120 + (st.phase === 'aim' ? Math.sin(st.t * 2) * 10 : st.gk * Math.min(1, st.ball ? st.ball.p * 2 : 0));
        sceneSprite(c, gkSheet, 'danceA', 0, gkx - SPR_W / 2, 62 - SPR_H);
        sceneSprite(c, mySheet, 'stand', 3, 120 - SPR_W / 2 - 16, 128 - SPR_H);
        if (st.phase === 'aim') { const ax = 120 + Math.sin(st.t * 3 * Mini.wob()) * 60; R(c, ax - 1, 36, 3, 22, '#ff8c1a'); E(c, ax, 47, 6, 6, 'rgba(255,140,26,0.3)'); E(c, 120, 118, 4, 4, '#f4f0e6'); P(c, 119, 117, '#1a1a1a'); }
        if (st.ball) { st.ball.p += dt * 1.6; const p = Math.min(1, st.ball.p); const bx = lerp(st.ball.x, st.ball.tx, p), by = lerp(st.ball.y, st.ball.ty, p) - Math.sin(p * 3.14) * 20; E(c, bx, by, 4, 4, '#f4f0e6'); P(c, bx - 1, by - 1, '#1a1a1a'); if (p >= 1 && st.phase === 'shot') { st.phase = 'wait'; st.wait = 1; const saved = Math.abs(st.ball.tx - gkx) < 22; if (saved) { st.opp++; st.msg = _t('Gehalten!'); Snd.sfx('lose'); } else { st.me++; st.msg = _t('TOOOR!'); Snd.sfx('cheer'); } } }
        if (st.phase === 'wait') { st.wait -= dt; if (st.wait <= 0) { st.round++; st.ball = null; st.phase = 'aim'; st.msg = ''; if (st.round >= 5) { api.finish({ me: st.me, opp: st.opp, win: st.me > st.opp }); return; } } }
        api.o.querySelector('#fbS').textContent = `${st.me} : ${st.opp}`;
        api.o.querySelector('#fbInfo').textContent = st.msg || _t`Schuss ${st.round + 1}/5`;
      };
    });
  },
  /* ---------- Disco: Rhythmus in vier Spuren ---------- */
  dance() {
    const W = 240, H = 150;
    return this.run(_t('Tanzen'), _t('Marina Beach Club'), _t`<canvas aria-label="Tanzen"></canvas><div class="mini-bar"><span id="dnInfo">Tipp die Spur, wenn der Punkt die Linie erreicht (Tasten 1–4 oder ◀▲▼▶).</span><b id="dnS">0 %</b></div><div class="lanes">${['◀', '▲', '▼', '▶'].map((s, i) => `<button data-l="${i}">${s}</button>`).join('')}</div>`, W, H, (api) => {
      const notes = []; let t = 0, hit = 0, total = 0, next = 1, flash = [0, 0, 0, 0], msg = '';
      const bpm = 126, beat = 60 / bpm;
      const press = (l) => { flash[l] = 0.15; const n = notes.find((n) => n.l === l && !n.done && Math.abs(n.t - t) < 0.18); if (n) { n.done = true; hit++; Snd.sfx('blip'); msg = Math.abs(n.t - t) < 0.07 ? 'PERFECT' : 'OK'; } else { msg = 'MISS'; } };
      api.o.querySelectorAll('.lanes button').forEach((b) => b.addEventListener('pointerdown', (e) => { e.preventDefault(); press(+b.dataset.l); }));
      Mini.key = (k) => { const m = { Digit1: 0, Digit2: 1, Digit3: 2, Digit4: 3, ArrowLeft: 0, ArrowUp: 1, ArrowDown: 2, ArrowRight: 3 }; if (m[k] != null) press(m[k]); };
      const sheet = getSheet(G.S.look);
      return (dt) => {
        t += dt;
        while (next < 40 * beat && next < t + 2) { if (Math.random() < 0.8) { notes.push({ l: rint(0, 3), t: next, done: false }); total++; } next += beat / (Math.random() < 0.3 ? 2 : 1); }
        const c = api.ctx;
        R(c, 0, 0, W, H, '#14121c'); for (let k = 0; k < 4; k++) { c.fillStyle = ['#ff3ad0', '#3ae0ff', '#ffe03a', '#7aff6a'][(k + Math.floor(t * 4)) % 4]; c.globalAlpha = 0.08; c.fillRect(k * 60, 0, 60, H); c.globalAlpha = 1; }
        for (let l = 0; l < 4; l++) { R(c, 20 + l * 50, 110, 40, 3, flash[l] > 0 ? '#ffffff' : '#5a5a6a'); flash[l] -= dt; }
        for (const n of notes) { if (n.done) continue; const y = 110 - (n.t - t) * 70; if (y < -10 || y > H) continue; E(c, 40 + n.l * 50, y, 6, 6, ['#ff3ad0', '#3ae0ff', '#ffe03a', '#7aff6a'][n.l]); if (n.t < t - 0.18) { n.done = true; msg = 'MISS'; } }
        const pose = Math.floor(t * 2.1) % 2 ? 'danceA' : 'danceB';
        sceneSprite(c, sheet, pose, 0, 190 - SPR_W / 2, 100 - SPR_H, 1);
        if (msg) pxText(c, msg, 100 - pxTextW(msg) / 2, 128, msg === 'MISS' ? '#ff5a4a' : '#7aff6a');
        const pct = total ? Math.round(hit / total * 100) : 0;
        api.o.querySelector('#dnS').textContent = `${pct} %`;
        if (t > 40 * beat + 1) { Snd.sfx(pct >= 80 ? 'win' : 'ok'); api.finish({ pct }); }
      };
    });
  },
  /* ---------- Padel: Ball über die Wand zurückspielen ---------- */
  padel(oppId) {
    const W = 240, H = 150;
    return this.run(_t('Padel'), _t`gegen ${fname(oppId)}`, _t`<canvas aria-label="Padel"></canvas><div class="mini-bar"><span id="pdInfo">◀ ▶ bewegen – der Ball kommt auch von der Glaswand zurück. Bis 5 Punkte.</span><b id="pdS">0 : 0</b></div><div class="lanes" style="grid-template-columns:1fr 1fr"><button data-b="l">◀</button><button data-b="r">▶</button></div>`, W, H, (api) => {
      const me = { x: 120, w: 30 }, op = { x: 120, w: 30 };
      const ball = { x: 120, y: 75, vx: 60, vy: 90 };
      const keys = { l: 0, r: 0 }; let sm = 0, so = 0, t = 0, msg = '';
      api.o.querySelectorAll('.lanes button').forEach((bt) => { bt.addEventListener('pointerdown', (e) => { e.preventDefault(); keys[bt.dataset.b] = 1; }); bt.addEventListener('pointerup', () => { keys[bt.dataset.b] = 0; }); bt.addEventListener('pointerleave', () => { keys[bt.dataset.b] = 0; }); });
      const down = {}; Mini.key = (k) => { down[k] = 1; }; const onUp = (e) => { down[e.code] = 0; }; window.addEventListener('keyup', onUp);
      api.cv.addEventListener('pointermove', (e) => { const r = api.cv.getBoundingClientRect(); me.x = (e.clientX - r.left) / r.width * W; });
      const reset = (dir) => { ball.x = 120; ball.y = 75; ball.vx = rnd(-60, 60); ball.vy = 90 * dir; };
      const mySheet = getSheet(G.S.look), opSheet = getSheet(personLook(oppId));
      return (dt) => {
        t += dt;
        const c = api.ctx;
        const steer = (keys.r || down.ArrowRight || down.KeyD ? 1 : 0) - (keys.l || down.ArrowLeft || down.KeyA ? 1 : 0);
        me.x = clamp(me.x + steer * 160 * dt, 20, W - 20);
        op.x += clamp(ball.x - op.x, -1, 1) * 95 * dt * (ball.vy < 0 ? 1 : 0.4);
        ball.x += ball.vx * dt; ball.y += ball.vy * dt;
        if (ball.x < 6 || ball.x > W - 6) { ball.vx *= -1; ball.x = clamp(ball.x, 6, W - 6); Snd.sfx('bounce'); }
        if (ball.y > 130 && ball.y < 136 && Math.abs(ball.x - me.x) < me.w / 2 + 4 && ball.vy > 0) { ball.vy = -Math.abs(ball.vy) * 1.04; ball.vx += (ball.x - me.x) * 4; Snd.sfx('kick'); }
        if (ball.y < 22 && ball.y > 16 && Math.abs(ball.x - op.x) < op.w / 2 + 4 && ball.vy < 0) { ball.vy = Math.abs(ball.vy) * 1.02; ball.vx += (ball.x - op.x) * 3 + rnd(-30, 30); Snd.sfx('kick'); }
        /* Glaswand hinter den Spielern: Ball kommt mit Verlust zurück, zweite Berührung = Punkt */
        if (ball.y > H - 4) { if (ball.wall === 'me') { so++; msg = _t`${fname(oppId)} punktet`; Snd.sfx('lose'); reset(1); ball.wall = null; } else { ball.wall = 'me'; ball.vy = -Math.abs(ball.vy) * 0.6; ball.y = H - 4; Snd.sfx('bounce'); } }
        else if (ball.y < 4) { if (ball.wall === 'op') { sm++; msg = _t('Punkt für dich!'); Snd.sfx('ok'); reset(-1); ball.wall = null; } else { ball.wall = 'op'; ball.vy = Math.abs(ball.vy) * 0.6; ball.y = 4; Snd.sfx('bounce'); } }
        else if (ball.y > 40 && ball.y < 110) ball.wall = null;
        R(c, 0, 0, W, H, '#2f6fb8'); R(c, 0, 73, W, 4, '#f4f0e6'); R(c, 0, 0, W, 3, 'rgba(200,230,255,0.5)'); R(c, 0, H - 3, W, 3, 'rgba(200,230,255,0.5)'); R(c, 0, 0, 3, H, 'rgba(200,230,255,0.5)'); R(c, W - 3, 0, 3, H, 'rgba(200,230,255,0.5)');
        sceneSprite(c, opSheet, ball.vy < 0 && Math.abs(ball.x - op.x) < 30 ? 'danceB' : 'stand', 0, op.x - SPR_W / 2, 36 - SPR_H + 10);
        sceneSprite(c, mySheet, ball.vy > 0 && Math.abs(ball.x - me.x) < 30 ? 'danceB' : 'stand', 3, me.x - SPR_W / 2, 150 - SPR_H + 4);
        E(c, ball.x, ball.y, 3, 3, '#e8f040');
        api.o.querySelector('#pdS').textContent = `${sm} : ${so}`;
        api.o.querySelector('#pdInfo').textContent = msg || _t('Spiel läuft');
        if (sm >= 5 || so >= 5) { window.removeEventListener('keyup', onUp); Snd.sfx(sm > so ? 'win' : 'lose'); api.finish({ me: sm, opp: so, win: sm > so }); }
      };
    });
  },
  /* ---------- E-Bike-Ausfahrt: Hindernisse ausweichen, Akku einteilen ---------- */
  ride(o = {}) {
    const W = 240, H = 150;
    return this.run(_t('Team-Ausfahrt'), _t('Turia-Park → Strand'), _t`<canvas aria-label="E-Bike"></canvas><div class="mini-bar"><span id="rdInfo">▲▼ Spur wechseln, ▶ Turbo (frisst Akku). Komm mit Akku am Strand an!</span><b id="rdB">100 %</b></div><div class="lanes" style="grid-template-columns:1fr 1fr 1fr"><button data-b="u">▲</button><button data-b="d">▼</button><button data-b="t">⚡ Turbo</button></div>`, W, H, (api) => {
      const lanes = [60, 90, 120];
      const me = { lane: 1, y: 90, dist: 0, bat: 100, hp: 3, turbo: 0 };
      const obs = []; let t = 0, nextObs = 1.5, msg = '', hitT = 0;
      const keys = { t: 0 };
      api.o.querySelectorAll('.lanes button').forEach((bt) => { bt.addEventListener('pointerdown', (e) => { e.preventDefault(); if (bt.dataset.b === 'u') me.lane = Math.max(0, me.lane - 1); if (bt.dataset.b === 'd') me.lane = Math.min(2, me.lane + 1); if (bt.dataset.b === 't') keys.t = 1; }); bt.addEventListener('pointerup', () => { keys.t = 0; }); bt.addEventListener('pointerleave', () => { keys.t = 0; }); });
      const down = {}; Mini.key = (k) => { down[k] = 1; if (k === 'ArrowUp' || k === 'KeyW') me.lane = Math.max(0, me.lane - 1); if (k === 'ArrowDown' || k === 'KeyS') me.lane = Math.min(2, me.lane + 1); }; const onUp = (e) => { down[e.code] = 0; }; window.addEventListener('keyup', onUp);
      const riders = (o.riders || ['me']).map((id, i) => ({ sheet: getSheet(id === 'me' ? G.S.look : personLook(id)), col: ['#2a9aa0', '#e2554a', '#f0a23a', '#2fa0d8', '#3f8e4b'][i % 5], off: i }));
      const GOAL = 1200;
      return (dt) => {
        t += dt;
        const turbo = keys.t || down.ArrowRight || down.KeyD;
        const sp = (me.bat > 0 ? (turbo ? 150 : 95) : 55);
        if (me.bat > 0) me.bat -= dt * (turbo ? 9 : 2.2);
        me.bat = Math.max(0, me.bat);
        me.dist += sp * dt;
        me.y += (lanes[me.lane] - me.y) * Math.min(1, dt * 10);
        nextObs -= dt * sp / 95;
        if (nextObs <= 0) { nextObs = rnd(0.9, 1.6); obs.push({ x: W + 20, lane: rint(0, 2), kind: pick(['cone', 'dog', 'runner', 'orange', 'puddle', 'battery']) }); }
        for (const ob of obs) { ob.x -= sp * dt; if (!ob.hit && ob.x < 50 && ob.x > 30 && ob.lane === me.lane) { ob.hit = true; if (ob.kind === 'battery') { me.bat = Math.min(100, me.bat + 25); Snd.sfx('coin'); msg = _t('Akku +25 %'); } else if (ob.kind === 'orange') { Snd.sfx('ok'); msg = _t('Orange!'); } else { me.hp--; hitT = 0.4; Snd.sfx('hit'); msg = ob.kind === 'dog' ? _t('Hund!') : ob.kind === 'runner' ? _t('Jogger erwischt!') : _t('Autsch!'); } } }
        while (obs.length && obs[0].x < -30) obs.shift();
        const c = api.ctx;
        R(c, 0, 0, W, 40, '#5aa8e0'); R(c, 0, 40, W, 10, '#7aa84c'); R(c, 0, 50, W, 90, '#b35a4a'); R(c, 0, 140, W, 10, '#6f9c44');
        for (let k = 0; k < 8; k++) R(c, ((k * 40 - me.dist * 0.9) % (W + 40) + W + 40) % (W + 40) - 20, 74, 20, 2, '#f4ece0'); for (let k = 0; k < 8; k++) R(c, ((k * 40 - me.dist * 0.9 + 20) % (W + 40) + W + 40) % (W + 40) - 20, 104, 20, 2, '#f4ece0');
        for (let k = 0; k < 6; k++) { const x = ((k * 50 - me.dist * 0.5) % (W + 60) + W + 60) % (W + 60) - 30; R(c, x, 24, 4, 20, '#8a6a44'); E(c, x + 2, 22, 10, 8, '#3f7a36'); for (let j = 0; j < 3; j++) P(c, x - 3 + j * 4, 20 + (j % 2) * 4, '#ff8c1a'); }
        for (const ob of obs) { if (ob.hit && ob.kind !== 'cone') continue; const y = lanes[ob.lane] + 8; if (ob.kind === 'cone') { R(c, ob.x - 3, y - 10, 6, 10, '#ff8c1a'); R(c, ob.x - 5, y - 1, 10, 2, '#1a1a1e'); R(c, ob.x - 2, y - 7, 4, 2, '#ffffff'); } else if (ob.kind === 'dog') { R(c, ob.x - 7, y - 6, 14, 5, '#6a4428'); R(c, ob.x + 6, y - 9, 5, 5, '#6a4428'); R(c, ob.x - 6, y - 1, 2, 3, '#4a2e1a'); R(c, ob.x + 3, y - 1, 2, 3, '#4a2e1a'); } else if (ob.kind === 'runner') { sceneSprite(c, getSheet(npcLook(999, { top: 5, pants: 3, shoes: 5 })), Math.floor(t * 8) % 2 ? 'walkA' : 'walkB', 1, ob.x - SPR_W / 2, y - SPR_H + 2); } else if (ob.kind === 'orange') { E(c, ob.x, y - 3, 3, 3, '#ff8c1a'); } else if (ob.kind === 'puddle') { E(c, ob.x, y, 10, 3, '#5aa8e0'); } else if (ob.kind === 'battery') { R(c, ob.x - 6, y - 8, 12, 7, '#2a2a2e'); R(c, ob.x - 5, y - 7, 8, 5, '#3af07a'); R(c, ob.x + 6, y - 6, 2, 3, '#2a2a2e'); } }
        riders.forEach((r, i) => { const x = 40 - i * 0, yy = i === 0 ? me.y + 8 : lanes[(me.lane + i) % 3] + 8 + Math.sin(t * 2 + i) * 2, xx = i === 0 ? 40 : 40 - i * 36 - 10; const a = { dir: 2, moving: true, bike: true, bikeCol: r.col, x: xx, y: yy }; if (hitT > 0 && i === 0 && Math.floor(t * 20) % 2) return; drawBikeUnder(c, xx, yy, a, false); sceneSprite(c, r.sheet, 'ride', 2, xx - SPR_W / 2, yy - SPR_H - 3); drawBikeUnder(c, xx, yy, a, true); });
        if (hitT > 0) hitT -= dt;
        R(c, 8, 8, 60, 10, '#1a1a1e'); R(c, 10, 10, Math.round(56 * me.bat / 100), 6, me.bat > 30 ? '#3af07a' : '#ff5a4a'); pxText(c, Math.round(me.dist / GOAL * 100) + '%', 72, 10, '#ffffff'); for (let k = 0; k < me.hp; k++) R(c, 110 + k * 10, 8, 8, 8, '#e04a6a');
        if (turbo && me.bat > 0) pxText(c, 'TURBO', 190, 10, '#ffe08a');
        api.o.querySelector('#rdB').textContent = `${Math.round(me.bat)} %`;
        api.o.querySelector('#rdInfo').textContent = msg || (me.bat <= 0 ? _t('Akku leer – jetzt heisst es treten.') : _t('Weiter!'));
        if (me.dist >= GOAL) { window.removeEventListener('keyup', onUp); Snd.sfx('win'); api.finish({ battery: me.bat, hp: me.hp }); }
        if (me.hp <= 0) { window.removeEventListener('keyup', onUp); Snd.sfx('lose'); api.finish({ battery: 0, hp: 0 }); }
      };
    });
  },
});
