/* ============ Ereignisse in Valencia ============ */
Story.EVENTS = [
  { id: 'gota', cond: () => hourOf(G.S.time) > 8 && hourOf(G.S.time) < 20 },
  { id: 'fallera', cond: () => hourOf(G.S.time) > 10 && hourOf(G.S.time) < 21 && today() <= 3 },
  { id: 'horchata', cond: () => hourOf(G.S.time) > 10 && hourOf(G.S.time) < 19 },
  { id: 'moewe', cond: () => G.player.x > 86 * TS && G.player.y > 30 * TS && G.player.y < 66 * TS && hourOf(G.S.time) > 8 },
  { id: 'orange', cond: () => hourOf(G.S.time) > 7 },
  { id: 'peloton', cond: () => G.player.y < 12 * TS && hourOf(G.S.time) > 7 && hourOf(G.S.time) < 20 },
  { id: 'cffans', cond: () => hourOf(G.S.time) > 17 },
  { id: 'tourist', cond: () => hourOf(G.S.time) > 9 && hourOf(G.S.time) < 20 },
];
Object.assign(Story, {
  async ev_mascleta() {
    G.busy++;
    await UI.announce('14:00 · Plaza del Ayuntamiento', 'Mascletà', 'Ohren zu!');
    Snd.sfx('boom'); G.fx.shake = 1;
    await Scene.play('mascleta', { ms: 3200, text: 'Boom. Boom. BOOM.' });
    G.fx.shake = 1.2; Snd.sfx('boom'); Snd.sfx('crack');
    for (let k = 0; k < 20; k++) addPart({ x: G.player.x + rnd(-80, 80), y: G.player.y - rnd(0, 60), vy: -20, life: 2, kind: 'smoke' });
    achieve('mascleta'); mood(6); energy(4);
    await this.say(null, pick(['Fünf Minuten Böller, 120 Dezibel, der Boden bebt. Die Valencianer stehen mit offenem Mund da – damit die Ohren den Druck ausgleichen. Jetzt weisst du es auch.', 'Mascletà! Eine Mutter hält ihrem Baby die Ohren zu, ein Opa lächelt selig. Der Rauch riecht nach Schiesspulver und Churros.']));
    if (this.isHere('robin', 'city') || Math.random() < 0.5) await this.say('Robin', 'Ist das … normal hier? Jeden Tag? Ich dachte, das Hochhaus stürzt ein.');
    G.busy--;
  },
  async ev_crema() {
    G.busy++;
    await UI.announce('Donnerstag 22:00', 'La Cremà', 'Die Fallas brennen');
    await Scene.play('crema', { ms: 4200, text: 'Feuer, Funken, Blaskapelle.' });
    achieve('crema'); mood(10);
    const falla = G.map.objs.find((o) => o.cv && o.h === 2 && o.w === 3 && o.x === 33);
    if (falla) falla.gone = true;
    await this.say(null, 'Um Mitternacht brennt die grosse Falla auf der Plaza del Ayuntamiento. Monate Arbeit, in zwanzig Minuten Asche – die Feuerwehr spritzt die Fassaden nass, die Kapelle spielt, und alle weinen ein bisschen. Morgen früh ist der Platz gefegt, als wäre nichts gewesen.');
    await this.say(pick(['juanjo', 'dominique', 'estella']), pick(['Das ist Valencia: bauen, feiern, verbrennen, von vorne.', 'Nächstes Jahr kommt ihr wieder. Zur ganzen Woche.', 'Jetzt Churros. Und dann ins Bett – morgen ist Final.']));
    G.busy--;
  },
  async ev_robin() {
    const r = G.npcs.find((n) => n.id === 'robin');
    if (!r) return;
    G.busy++;
    r.path = [{ x: G.player.x + (G.player.x > r.x ? -20 : 20), y: G.player.y }]; r.onArrive = null;
    await sleep(600);
    const o = await this.ask('robin', pick(['Entschuldige – wo ist nochmal der Aufenthaltsraum? Ich war im Lift, und dann war ich im Keller.', 'Welcher Raum ist Indurain? Ich bin dreimal an Rocket vorbeigelaufen.', 'Gibt es hier ein WC, das nicht abgeschlossen ist?']), ['Den Weg zeigen', 'Keine Zeit']);
    if (o === 0) { G.S.flags.robinHelped = (G.S.flags.robinHelped || 0) + 1; mood(2); planAdd(myTeam(), 0.5); await this.say('robin', pick(['Danke! Ich sollte mir einen Plan zeichnen. Das wäre ironisch.', 'Du bist ein Schatz. Ich erwähne das beim nächsten Gehaltsgespräch. Deinem.'])); if (G.S.flags.robinHelped >= 3) achieve('robin'); }
    else await this.say('robin', 'Verstehe. Ich frag Isabell. Wo ist Isabell?');
    r.path = [{ x: 52 * TS, y: 23 * TS }]; r.onArrive = (a) => dropActor(a);
    G.busy--;
  },
  async ev_gota() {
    G.busy++;
    await UI.announce('Wetter', 'Gota fría', 'Platzregen aus dem Nichts');
    Snd.sfx('rain');
    const until = G.S.time + 60;
    const live = { update(dt) { for (let k = 0; k < 6; k++) addPart({ x: G.cam.x + rnd(0, View.w), y: G.cam.y + rnd(-20, View.h), vy: 220, vx: -30, life: 0.5, kind: 'rain' }); if (G.S.time > until) G.live = null; }, draw(c) { c.fillStyle = 'rgba(40,60,90,0.18)'; c.fillRect(0, 0, View.w, View.h); } };
    G.live = live;
    G.S.st.wet = 30; mood(-3); achieve('gota');
    for (const p of G.peds) p.speed *= 2.5;
    await this.say(null, 'Von null auf Wolkenbruch in dreissig Sekunden. Die Valencianer rennen unter die Arkaden, die Touristen fotografieren. Du wirst nass. Sehr nass.');
    G.busy--;
  },
  async ev_fallera() {
    G.busy++;
    await UI.announce('Fallas', 'Ofrenda-Umzug', 'Falleras und Blaskapelle');
    Snd.sfx('brass');
    const y = G.player.y + 60;
    const acts = [];
    for (let i = 0; i < 7; i++) {
      const look = i < 4 ? npcLook(900 + i, { fem: 1, hair: 12, hairCol: 0, top: 11, topCol: [13, 4, 9, 14][i], pants: 8, pantsCol: [11, 12, 1, 10][i], jewel: 3, hat: 0 }) : npcLook(910 + i, { top: 7, topCol: 11, pants: 5, pantsCol: 2, hat: 1, hatCol: 2 });
      const a = tempActor({ x: G.cam.x - 40 - i * 34, y: y + (i % 2) * 10, look, dir: 2, name: i < 4 ? 'Fallera' : 'Musiker', speed: 55, bubble: i >= 4 ? 'note' : null, bubbleT: 1e9 });
      acts.push(a);
      a.path = [{ x: G.cam.x + View.w + 80, y: a.y }]; a.onArrive = (b) => dropActor(b);
    }
    mood(5);
    await this.say(null, 'Eine Falla-Kommission zieht vorbei: Falleras in Seide, Brokat und mit Haarschnecken, dahinter die Blaskapelle mit „Paquito el Chocolatero“. Jede Falla bringt Blumen zur Virgen – 20 Tonnen in zwei Tagen.');
    G.busy--;
  },
  async ev_horchata() {
    G.busy++;
    const a = tempActor({ x: G.player.x + 40, y: G.player.y, look: npcLook(920, { top: 0, topCol: 14, hat: 6, pants: 1, pantsCol: 5 }), dir: 1, name: 'Horchata-Verkäufer' });
    const o = await this.ask('Horchata-Verkäufer', '¡Horchata, horchata fresquita! Zwei Euro, mit Fartons drei.', [{ t: 'Horchata mit Fartons', r: '3 €' }, { t: 'Nur Horchata', r: '2 €' }, 'Gracias, no']);
    if (o === 0 && pay(3)) { consume('horchata'); consume('fartons'); }
    if (o === 1 && pay(2)) consume('horchata');
    a.path = [{ x: a.x + 200, y: a.y }]; a.onArrive = (b) => dropActor(b);
    G.busy--;
  },
  async ev_moewe() {
    G.busy++;
    Snd.sfx('gull');
    const b = { x: G.player.x + 80, y: G.player.y - 20, z: 30, vx: -60, vy: 10, vz: -10, state: 'fly', t: 0, kind: 'gull', spot: { x: 88, y: 44, w: 6, h: 10 }, fx: true };
    G.birds.push(b);
    await sleep(900);
    const food = Object.keys(G.S.inv).find((k) => ITEMS[k] && ITEMS[k].t === 'food');
    achieve('moewe');
    if (food) { takeInv(food); mood(-4); await this.say(null, `Eine Möwe im Sturzflug – und weg ist ${ITEMS[food].n}. Jordi hatte gewarnt.`); }
    else { mood(-1); await this.say(null, 'Eine Möwe sturzfliegt auf deine Tasche zu, findet nichts Essbares und schreit dich beleidigt an.'); }
    G.busy--;
  },
  async ev_orange() {
    G.busy++;
    Snd.sfx('bounce');
    for (let k = 0; k < 3; k++) addPart({ x: G.player.x + rnd(-10, 10), y: G.player.y - 40, vy: 60, g: 100, life: 0.7, kind: 'orange' });
    addInv('naranja');
    await this.say(null, pick(['Plopp. Eine Orange fällt dir vor die Füsse. Bitter – die Strassenorangen sind Zierorangen. Trotzdem: in die Tasche.', 'Eine Orange vom Baum. Die Einheimischen lachen: „Die isst keiner!“ Du nimmst sie trotzdem.']));
    G.busy--;
  },
  async ev_peloton() {
    G.busy++;
    const y = 5 * TS + 18;
    const ids = ['aitor'];
    for (let i = 0; i < 6; i++) { const look = i === 0 && G.S.pid !== 'aitor' ? personLook('aitor') : npcLook(930 + i, { top: 10, topCol: [0, 2, 4, 6, 10, 12][i], pants: 7, pantsCol: 2, hat: 5, hatCol: [0, 1, 8, 2, 9, 7][i], glasses: 4, shoes: 7 }); const a = tempActor({ x: G.cam.x - 30 - i * 40, y: y + (i % 2) * 20, look, dir: 2, bike: true, bikeCol: ['#c8352d', '#2f5fb8', '#e8c23a', '#3f8e4b', '#f0a23a', '#2a9aa0'][i], name: i === 0 ? 'Aitor' : 'Radfahrer', speed: 150 }); a.path = [{ x: G.cam.x + View.w + 100, y: a.y }]; a.onArrive = (b) => dropActor(b); }
    Snd.sfx('whirr');
    await this.say(null, 'Ein Peloton rauscht über den Radweg – Rennvelos, Trikots, Vollgas. Vorne: Aitor, der winkt, ohne abzubremsen. „Nach der Arbeit nochmal 40!“');
    mood(2);
    G.busy--;
  },
  async ev_cffans() {
    G.busy++;
    Snd.sfx('cheer');
    for (let i = 0; i < 5; i++) { const a = tempActor({ x: G.cam.x - 30 - i * 30, y: G.player.y + 40 + (i % 2) * 12, look: npcLook(940 + i, { top: 6, topCol: 14, print: 3, acc: 4, hat: i % 2 ? 1 : 0, hatCol: 7 }), dir: 2, name: 'Fan', speed: 50, bubble: 'note', bubbleT: 1e9 }); a.path = [{ x: G.cam.x + View.w + 60, y: a.y }]; a.onArrive = (b) => dropActor(b); }
    await this.say(null, '„¡Amunt València!“ – Fans in Weiss ziehen Richtung Mestalla. Heute spielt Valencia CF. Einer drückt dir einen Schal in die Hand: „Für Glück!“');
    if (!hasInv('schal')) addInv('schal');
    mood(3);
    G.busy--;
  },
  async ev_tourist() {
    G.busy++;
    const a = tempActor({ x: G.player.x - 40, y: G.player.y, look: npcLook(950, { hat: 4, hatCol: 4, top: 0, topCol: 9, pants: 3, pantsCol: 5, shoes: 4, acc: 1, glasses: 3 }), dir: 2, name: 'Tourist' });
    const o = await this.ask('Tourist', pick(['Excuse me – where is the Ciudad de las Artes?', 'Sorry, do you know a good paella place?', 'Can you take a photo of us? With the Micalet behind!']), ['Helfen', 'Keine Zeit']);
    if (o === 0) { mood(3); Snd.sfx('shutter'); await this.say('Tourist', pick(['Thank you! You are from here? – Switzerland? Ah, chocolate!', 'Gracias! Here, have a… I only have gum. Take the gum.'])); }
    a.path = [{ x: a.x - 160, y: a.y }]; a.onArrive = (b) => dropActor(b);
    G.busy--;
  },
});
