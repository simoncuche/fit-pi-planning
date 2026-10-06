/* ============ Ereignisse in Valencia ============ */
Story.EVENTS = [
  { id: 'gota', cond: () => hourOf(G.S.time) > 8 && hourOf(G.S.time) < 20 },
  { id: 'marathon', cond: () => G.player.y < 12 * TS && hourOf(G.S.time) > 7 && hourOf(G.S.time) < 20 },
  { id: 'bunyols', cond: () => G.player.x > 20 * TS && G.player.x < 50 * TS && G.player.y > 26 * TS && G.player.y < 46 * TS && hourOf(G.S.time) > 10 && hourOf(G.S.time) < 21 },
  { id: 'horchata', cond: () => hourOf(G.S.time) > 10 && hourOf(G.S.time) < 19 },
  { id: 'moewe', cond: () => G.player.x > 86 * TS && G.player.y > 30 * TS && G.player.y < 66 * TS && hourOf(G.S.time) > 8 },
  { id: 'orange', cond: () => hourOf(G.S.time) > 7 },
  { id: 'peloton', cond: () => G.player.y < 12 * TS && hourOf(G.S.time) > 7 && hourOf(G.S.time) < 20 },
  { id: 'cffans', cond: () => hourOf(G.S.time) > 17 },
  { id: 'tourist', cond: () => hourOf(G.S.time) > 9 && hourOf(G.S.time) < 20 },
];
Object.assign(Story, {
  async ev_bunyols() {
    G.busy++;
    const a = tempActor({ x: G.player.x + 44, y: G.player.y, look: npcLook(925, { fem: 1, top: 0, topCol: 14, hat: 4, hatCol: 6, pants: 1, pantsCol: 5, acc: 0 }), dir: 1, name: _t('Buñuelos-Verkäuferin') });
    const o = await this.ask(_t('Buñuelos-Verkäuferin'), _t('¡Buñuelos de calabaza, calentitos! Zwei Euro, mit Schokolade dreifünfzig. Todos los Santos war am Sonntag – der Stand bleibt die ganze Woche.'), [{ t: _t('Buñuelos mit Schokolade'), r: '3.50 €' }, { t: _t('Nur Buñuelos'), r: '2 €' }, _t('Gracias, no')]);
    if (o === 0 && pay(3.5)) { consume('bunyols'); consume('churros'); achieve('bunyols'); mood(3); await this.say(null, _t('Kürbisteig, frittiert, Zucker drauf, dazu dicke Schokolade. Die Valencianer essen das zu Todos los Santos – und danach, solange die Stände stehen.')); }
    else if (o === 1 && pay(2)) { consume('bunyols'); achieve('bunyols'); await this.say(null, _t('Warm, luftig, nach Kürbis. Ohne Schokolade ist es fast gesund. Fast.')); }
    dropActor(a);
    G.busy--;
  },
  async ev_mestalla() {
    G.busy++;
    await UI.announce(_t('Donnerstag 21:00'), _t('Mestalla'), _t('Valencia CF spielt – Grossleinwand in der Bar Pepita'));
    Snd.sfx('brass'); G.fx.shake = 0.4;
    for (const n of G.npcs) if (n.id && n.pose !== 'sit') n.danceIdle = true;
    achieve('mestalla'); mood(10);
    await this.say(null, _t('Pepita hat die Leinwand aufgehängt, Juanjo verteilt Schals. Neunzig Minuten „¡Amunt!“, Agua de Valencia – und ein Tor in der Nachspielzeit. Für Valencia. Die Bar explodiert.'));
    await this.say(pick(['juanjo', 'dominique', 'estella']), pick([_t('Das ist Valencia: leiden, hoffen, jubeln, von vorne.'), _t('Nächstes Jahr kommt ihr ins Mestalla. Echte Tribüne, echte Hymne.'), _t('Jetzt Churros. Und dann ins Bett – morgen ist Final.')]));
    G.busy--;
  },
  async ev_robin() {
    const r = G.npcs.find((n) => n.id === 'robin');
    if (!r) return;
    G.busy++;
    r.path = [{ x: G.player.x + (G.player.x > r.x ? -20 : 20), y: G.player.y }]; r.onArrive = null;
    await sleep(600);
    const o = await this.ask('robin', pick([_t('Entschuldige – wo ist nochmal der Aufenthaltsraum? Ich war im Lift, und dann war ich im Keller.'), _t('Welcher Raum ist Indurain? Ich bin dreimal an Rocket vorbeigelaufen.'), _t('Gibt es hier ein WC, das nicht abgeschlossen ist?')]), [_t('Den Weg zeigen'), _t('Keine Zeit')]);
    if (o === 0) { G.S.flags.robinHelped = (G.S.flags.robinHelped || 0) + 1; mood(2); planAdd(myTeam(), 0.5); await this.say('robin', pick([_t('Danke! Ich sollte mir einen Plan zeichnen. Das wäre ironisch.'), _t('Du bist ein Schatz. Ich erwähne das beim nächsten Gehaltsgespräch. Deinem.')])); if (G.S.flags.robinHelped >= 3) achieve('robin'); }
    else await this.say('robin', _t('Verstehe. Ich frag Isabel. Wo ist Isabel?'));
    r.path = [{ x: 25 * TS, y: 16 * TS }]; r.onArrive = (a) => dropActor(a);
    G.busy--;
  },
  async ev_gota() {
    G.busy++;
    await UI.announce(_t('Wetter'), _t('Gota fría'), _t('Platzregen aus dem Nichts'));
    Snd.sfx('rain');
    const until = G.S.time + 60;
    const live = { update(dt) { for (let k = 0; k < 6; k++) addPart({ x: G.cam.x + rnd(0, View.w), y: G.cam.y + rnd(-20, View.h), vy: 220, vx: -30, life: 0.5, kind: 'rain' }); if (G.S.time > until) G.live = null; }, draw(c) { c.fillStyle = 'rgba(40,60,90,0.18)'; c.fillRect(0, 0, View.w, View.h); } };
    G.live = live;
    G.S.st.wet = 30; mood(-3); achieve('gota');
    for (const p of G.peds) p.speed *= 2.5;
    await this.say(null, _t('Von null auf Wolkenbruch in dreissig Sekunden. Die Valencianer rennen unter die Arkaden, die Touristen fotografieren. Du wirst nass. Sehr nass.'));
    G.busy--;
  },
  async ev_marathon() {
    G.busy++;
    await UI.announce(_t('Turia-Park'), _t('Marathon-Training'), _t('Valencia-Marathon am 6. Dezember'));
    const y = G.player.y + 60;
    const acts = [];
    for (let i = 0; i < 6; i++) {
      const look = i === 0 && G.S.pid !== 'aitor' ? Object.assign(personLook('aitor'), { top: 5, topCol: 2, pants: 3, pantsCol: 2, shoes: 5, hat: 7, hatCol: 0 }) : npcLook(940 + i, { top: 5, topCol: [4, 8, 10, 12, 0, 6][i], pants: 3, pantsCol: [2, 8, 3, 2, 10, 2][i], shoes: 5, shoesCol: [9, 0, 4, 5, 1, 8][i], hat: 7, hatCol: [0, 1, 6, 2, 9, 7][i] });
      const a = tempActor({ x: G.cam.x - 40 - i * 30, y: y + (i % 2) * 10, look, dir: 2, name: i === 0 && G.S.pid !== 'aitor' ? _t('Aitor') : _t('Läufer'), speed: 95 });
      acts.push(a);
      a.path = [{ x: G.cam.x + View.w + 80, y: a.y }]; a.onArrive = (b) => dropActor(b);
    }
    mood(3);
    await this.say(null, _t('Eine Laufgruppe zieht vorbei: Training für den Valencia-Marathon am 6. Dezember – die flachste Strecke Europas, sagt Aitor. Er läuft natürlich mit. Nach 60 Kilometern Velo.'));
    G.busy--;
  },
  async ev_horchata() {
    G.busy++;
    const a = tempActor({ x: G.player.x + 40, y: G.player.y, look: npcLook(920, { top: 0, topCol: 14, hat: 6, pants: 1, pantsCol: 5 }), dir: 1, name: _t('Horchata-Verkäufer') });
    const o = await this.ask(_t('Horchata-Verkäufer'), _t('¡Horchata, horchata fresquita! Zwei Euro, mit Fartons drei.'), [{ t: _t('Horchata mit Fartons'), r: '3 €' }, { t: _t('Nur Horchata'), r: '2 €' }, _t('Gracias, no')]);
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
    if (food) { takeInv(food); mood(-4); await this.say(null, _t`Eine Möwe im Sturzflug – und weg ist ${ITEMS[food].n}. Jordi hatte gewarnt.`); }
    else { mood(-1); await this.say(null, _t('Eine Möwe sturzfliegt auf deine Tasche zu, findet nichts Essbares und schreit dich beleidigt an.')); }
    G.busy--;
  },
  async ev_orange() {
    G.busy++;
    Snd.sfx('bounce');
    for (let k = 0; k < 3; k++) addPart({ x: G.player.x + rnd(-10, 10), y: G.player.y - 40, vy: 60, g: 100, life: 0.7, kind: 'orange' });
    addInv('naranja');
    await this.say(null, pick([_t('Plopp. Eine Orange fällt dir vor die Füsse. Bitter – die Strassenorangen sind Zierorangen. Trotzdem: in die Tasche.'), _t('Eine Orange vom Baum. Die Einheimischen lachen: „Die isst keiner!“ Du nimmst sie trotzdem.')]));
    G.busy--;
  },
  async ev_peloton() {
    G.busy++;
    const y = 5 * TS + 18;
    const ids = ['aitor'];
    for (let i = 0; i < 6; i++) { const look = i === 0 && G.S.pid !== 'aitor' ? personLook('aitor') : npcLook(930 + i, { top: 10, topCol: [0, 2, 4, 6, 10, 12][i], pants: 7, pantsCol: 2, hat: 5, hatCol: [0, 1, 8, 2, 9, 7][i], glasses: 4, shoes: 7 }); const a = tempActor({ x: G.cam.x - 30 - i * 40, y: y + (i % 2) * 20, look, dir: 2, bike: true, bikeCol: ['#c8352d', '#2f5fb8', '#e8c23a', '#3f8e4b', '#f0a23a', '#2a9aa0'][i], name: i === 0 ? _t('Aitor') : _t('Radfahrer'), speed: 150 }); a.path = [{ x: G.cam.x + View.w + 100, y: a.y }]; a.onArrive = (b) => dropActor(b); }
    Snd.sfx('whirr');
    await this.say(null, _t('Ein Peloton rauscht über den Radweg – Rennvelos, Trikots, Vollgas. Vorne: Aitor, der winkt, ohne abzubremsen. „Nach der Arbeit nochmal 40!“'));
    mood(2);
    G.busy--;
  },
  async ev_cffans() {
    G.busy++;
    Snd.sfx('cheer');
    for (let i = 0; i < 5; i++) { const a = tempActor({ x: G.cam.x - 30 - i * 30, y: G.player.y + 40 + (i % 2) * 12, look: npcLook(940 + i, { top: 6, topCol: 14, print: 3, acc: 4, hat: i % 2 ? 1 : 0, hatCol: 7 }), dir: 2, name: _t('Fan'), speed: 50, bubble: 'note', bubbleT: 1e9 }); a.path = [{ x: G.cam.x + View.w + 60, y: a.y }]; a.onArrive = (b) => dropActor(b); }
    await this.say(null, _t('„¡Amunt València!“ – Fans in Weiss ziehen Richtung Mestalla. Heute spielt Valencia CF. Einer drückt dir einen Schal in die Hand: „Für Glück!“'));
    if (!hasInv('schal')) addInv('schal');
    mood(3);
    G.busy--;
  },
  async ev_tourist() {
    G.busy++;
    const a = tempActor({ x: G.player.x - 40, y: G.player.y, look: npcLook(950, { hat: 4, hatCol: 4, top: 0, topCol: 9, pants: 3, pantsCol: 5, shoes: 4, acc: 1, glasses: 3 }), dir: 2, name: _t('Tourist') });
    const o = await this.ask(_t('Tourist'), pick([_t('Excuse me – where is the Ciudad de las Artes?'), _t('Sorry, do you know a good paella place?'), _t('Can you take a photo of us? With the Micalet behind!')]), [_t('Helfen'), _t('Keine Zeit')]);
    if (o === 0) { mood(3); Snd.sfx('shutter'); await this.say(_t('Tourist'), pick([_t('Thank you! You are from here? – Switzerland? Ah, chocolate!'), _t('Gracias! Here, have a… I only have gum. Take the gum.')])); }
    a.path = [{ x: a.x - 160, y: a.y }]; a.onArrive = (b) => dropActor(b);
    G.busy--;
  },
});
