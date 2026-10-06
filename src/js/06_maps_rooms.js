/* ============ Innenräume: Flughafen, Hotel Kramer, Colba, Bars, Museum, Mercado ============ */
function doorBottom(m, x, w, to, spawn, label, o = {}) {
  for (let k = 0; k < w; k++) m.set(x + k, m.h - 1, T.TILE, 1);
  m.decal((c) => { R(c, x * TS, (m.h - 1) * TS, w * TS, TS, '#3a3430'); R(c, x * TS + 3, (m.h - 1) * TS + 3, w * TS - 6, 15, '#6a5a48'); for (let k = 6; k < w * TS - 6; k += 4) R(c, x * TS + k, (m.h - 1) * TS + 4, 1, 12, '#5a4a3a'); });
  m.warp(x, m.h - 1, to, spawn, Object.assign({ w, label }, o));
}
function placePerson(m, id, tx, ty, dir, o = {}) {
  m.npcDefs.push(Object.assign({ id, name: PEOPLE[id].name, x: tx * TS + 12, y: ty * TS + 20, dir, look: personLook(id), talk: (n) => Story.talkTo(id, n), cond: () => Story.isHere(id, m.id) }, o));
}

/* ----------- Flughafen Valencia: Ankunftshalle ----------- */
MAP_BUILDERS.airport = () => {
  const m = new GMap('airport', 44, 24, { name: 'Aeropuerto de València', indoor: true, bg: '#0e1116', wallStyle: { cap: '#4a4e54' }, music: 'lobby' });
  m.room(0, 0, 44, 24, 5, T.CONCRETE);
  m.decal((c) => { DECAL.gateSign(c, 2 * TS, TS + 6, 'LLEGADAS · ARRIVALS'); DECAL.gateSign(c, 30 * TS, TS + 6, 'SALIDA · TAXI ↓'); DECAL.gateSign(c, 16 * TS, TS + 6, 'RECOGIDA DE EQUIPAJES'); DECAL.clock(c, 26 * TS, TS + 4); for (let k = 0; k < 4; k++) DECAL.poster(c, (36 + k * 2) * TS, TS + 2, ['#ff8c1a', '#2f8fd8', '#3f8e4b', '#e8c23a'][k]); });
  /* Gate-Tür oben: Ankunft */
  m.fill(3, 1, 3, 2, T.TILE, 2); m.decal((c) => { R(c, 3 * TS, TS, 3 * TS, 2 * TS, '#5a7086'); R(c, 3 * TS + 4, TS + 4, 3 * TS - 8, 2 * TS - 6, '#8ab8d8'); R(c, 4 * TS + 11, TS + 4, 2, 2 * TS - 6, '#2e3a46'); });
  /* Gepäckbänder */
  m.add(objBelt(8, 6, 14)); m.add(objBelt(8, 10, 14));
  m.decal((c) => { R(c, 8 * TS, 7 * TS, 14 * TS, 3 * TS, '#b0b4b8'); R(c, 8 * TS + 2, 7 * TS, 14 * TS - 4, 1, '#d0d4d8'); });
  m.fill(8, 7, 14, 3, T.CONCRETE); m.solid(8, 7, 14, 3, 1);
  m.trig(8, 11, 14, 1, { label: 'Gepäckband 3: Koffer suchen', act: () => Story.baggage() });
  m.trig(8, 5, 14, 1, { label: 'Gepäckband 3: Koffer suchen', act: () => Story.baggage() });
  m.add(objSignpost(15, 4, 'BAND 3 · ZRH', '#1a3a7a'));
  m.add(objSignpost(30, 12, 'BAND 4 · LEJ', '#1a3a7a'));
  m.add(objBelt(26, 13, 10)); m.fill(26, 14, 10, 2, T.CONCRETE); m.solid(26, 14, 10, 2, 1);
  /* Sitzreihen, Automaten, Café, Mietwagen-Schalter */
  for (const [x, y] of [[2, 14], [2, 17], [6, 14], [6, 17]]) m.add(objSeats(x, y, 3));
  m.add(objVending(1, 9)); m.trig(1, 9, 1, 1, { label: 'Automat', act: () => Story.shop('automat') });
  m.add(objVending(2, 9));
  m.add(objCounter(36, 6, 6, 1, { top: '#2a2a2e', front: '#f0d040', reg: true })); m.decal((c) => DECAL.logo(c, 36 * TS + 8, 3 * TS + 2, 'RENT A CAR', '#f0d040'));
  m.trig(36, 6, 6, 1, { label: 'Mietwagen-Schalter', act: () => Story.carRental() });
  m.add(objCounter(24, 19, 6, 1, { top: '#8a5e3a', front: '#4a2c18', glasses: true })); m.decal((c) => DECAL.logo(c, 24 * TS + 10, 16 * TS + 12, 'CAFÉ', '#ff8c1a'));
  m.trig(24, 19, 6, 1, { label: 'Flughafen-Café', act: () => Story.shop('aircafe') });
  m.npcDefs.push({ id: 'aircafe', name: 'Barista', x: 27 * TS + 12, y: 18 * TS + 20, dir: 0, look: npcLook(501, { top: 2, topCol: 17, hat: 1, hatCol: 0 }), talk: () => Story.shop('aircafe'), keepDir: true, bubbleRand: ['coffee'] });
  m.add(objPlant(23, 22, true)); m.add(objPlant(41, 22, true)); m.add(objPlant(1, 22));
  m.add(objSignpost(34, 20, 'TAXI ↓', '#f0d040'));
  m.add(objLuggage(31, 14)); m.add(objSuitcase(5, 20, '#c8352d')); m.add(objSuitcase(38, 15, '#3f8e4b'));
  /* Ausgang zum Taxistand */
  doorBottom(m, 34, 3, 'city', 'taxi', 'Ausgang: Taxistand', { guard: () => Story.leaveAirport() });
  m.pedZones.push({ x: 2, y: 4, w: 40, h: 17, n: 10 });
  m.spawn('start', 4, 4, 0);
  m.spawn('entry', 35, 22, 3);
  /* Die Reisegruppe steht verteilt in der Halle (Story.populate) */
  return m;
};

/* ----------- Hotel Kramer ----------- */
MAP_BUILDERS.hotel_lobby = () => {
  const m = new GMap('hotel_lobby', 24, 14, { name: 'Hotel Kramer · Lobby', indoor: true, bg: '#0e1116', wallStyle: { cap: '#3a2e22' }, music: 'lobby' });
  m.room(0, 0, 24, 14, 0, T.MARBLE);
  m.decal((c) => { DECAL.lift(c, 3 * TS + 6, TS + 2, '4'); DECAL.picture(c, 9 * TS, TS + 8, '#3a9ac8'); DECAL.picture(c, 11 * TS, TS + 8, '#e8b040'); DECAL.clock(c, 13 * TS, TS + 6); DECAL.logo(c, 14 * TS + 4, TS + 30, 'KRAMER', '#2a4a3a'); DECAL.flag(c, 20 * TS, TS + 10); DECAL.carpetRun(c, 10 * TS, 4 * TS, 4 * TS, 9 * TS, '#8e2f34'); });
  m.warp(4, 3, 'hotel_floor', 'lift', { w: 1, label: 'Lift', guard: () => Story.liftGuard() });
  m.fill(20, 1, 2, 2, T.STAIRS, 0); m.warp(20, 2, 'hotel_floor', 'stairs', { w: 2, label: 'Treppe', guard: () => Story.liftGuard() });
  m.add(objReception(13, 3, 5)); m.trig(13, 3, 5, 1, { label: 'Rezeption', act: () => Story.reception() });
  m.npcDefs.push({ id: 'marta', name: 'Marta (Rezeption)', x: 15 * TS + 12, y: 2 * TS + 22, dir: 0, look: npcLook(601, { fem: 1, hair: 12, hairCol: 1, top: 11, topCol: 14, pants: 5, pantsCol: 8, jewel: 1, glasses: 0 }), talk: () => Story.reception(), keepDir: true, bubbleRand: ['dots', 'heart'] });
  m.add(objSofa(2, 8, 3, '#2a4a3a')); m.add(objSofa(2, 11, 3, '#2a4a3a')); m.add(objTable(5, 9, 1, 2, { col: '#8a5e3a' }));
  m.add(objPlant(1, 5, true)); m.add(objPlant(22, 5, true)); m.add(objPlant(7, 12)); m.add(objLuggage(19, 5));
  m.add(objCoffee(21, 8)); m.trig(21, 8, 1, 1, { label: 'Kaffee für Gäste', act: () => Story.hotelCoffee() });
  m.add(objKiosk(16, 9, 'FRÜHSTÜCK', '#2a4a3a')); m.trig(16, 9, 2, 1, { label: 'Frühstücksbuffet', act: () => Story.shop('breakfast') });
  m.add(objUmbrellaTable(19, 11, '#2a4a3a'));
  doorBottom(m, 11, 2, 'city', 'hotel', 'Auf die Strasse');
  m.spawn('entry', 12, 12, 3); m.spawn('lift', 4, 4, 0); m.spawn('stairs', 20, 3, 0);
  return m;
};
MAP_BUILDERS.hotel_floor = () => {
  const m = new GMap('hotel_floor', 30, 8, { name: 'Hotel Kramer · 4. Stock', indoor: true, bg: '#0e1116', wallStyle: { cap: '#3a2e22' }, music: null });
  m.room(0, 0, 30, 8, 0, T.CARPET, 0);
  const rooms = [410, 411, 412, 413, 414, 415];
  m.decal((c) => { DECAL.lift(c, 2 * TS + 6, TS + 2, '4'); rooms.forEach((n, i) => DECAL.door(c, (6 + i * 4) * TS, TS, i === 2 ? '#8a5a34' : '#6a4428', n)); DECAL.picture(c, 28 * TS - 20, TS + 8, '#3a9ac8'); });
  m.warp(3, 3, 'hotel_lobby', 'lift', { w: 1, label: 'Lift' });
  m.fill(27, 1, 2, 2, T.STAIRS, 1); m.warp(27, 2, 'hotel_lobby', 'stairs', { w: 2, label: 'Treppe' });
  rooms.forEach((n, i) => { if (n === 412) m.warp(6 + i * 4, 3, 'hotel_room', 'entry', { w: 1, label: 'Zimmer 412', guard: () => Story.roomDoor(412) }); else m.trig(6 + i * 4, 3, 1, 1, { label: 'Zimmer ' + n, act: () => Story.roomDoor(n) }); });
  m.add(objPlant(1, 6)); m.add(objPlant(28, 6)); m.add(objTable(14, 6, 1, 1, { col: '#8a5e3a' }));
  m.spawn('lift', 3, 4, 0); m.spawn('stairs', 27, 3, 0); m.spawn('room', 14, 4, 0);
  return m;
};
MAP_BUILDERS.hotel_room = () => {
  const m = new GMap('hotel_room', 14, 12, { name: 'Zimmer 412', indoor: true, bg: '#0e1116', wallStyle: { cap: '#3a2e22' }, music: null });
  m.room(0, 0, 14, 12, 0, T.CARPET, 2);
  m.fill(9, 1, 4, 5, T.TILE, 0); m.fill(9, 3, 4, 1, T.WALL); m.fill(9, 1, 4, 2, T.WALLF, 4); m.set(9, 3, T.WALL); m.set(12, 3, T.WALL);
  m.decal((c) => { DECAL.seaWindow(c, 3 * TS, TS + 4, 44, 32); DECAL.picture(c, 6 * TS + 8, TS + 10, '#e8b040'); DECAL.mirror(c, 10 * TS, TS + 6); });
  m.add(objBed(2, 4)); m.trig(2, 6, 2, 1, { label: 'Bett', act: () => Story.bed() });
  m.add(objWardrobe(5, 3, 2)); m.trig(5, 3, 2, 1, { label: 'Kleiderschrank', act: () => Story.wardrobe() });
  m.add(objDesk(7, 5, 2, { coffee: true })); m.trig(7, 5, 2, 1, { label: 'Schreibtisch: Laptop', act: () => Story.laptop() });
  m.add(objOfficeChair(8, 6));
  m.add(objSuitcase(2, 8, '#2a9aa0')); m.trig(2, 8, 1, 1, { label: 'Koffer auspacken', act: () => Story.unpack() });
  m.fill(10, 4, 2, 2, T.TILE, 0); m.decal((c) => { R(c, 10 * TS, 4 * TS, 2 * TS, 2 * TS, '#d8e4ea'); for (let k = 0; k < 48; k += 8) for (let j = 0; j < 48; j += 8) R(c, 10 * TS + k, 4 * TS + j, 6, 6, '#e8f0f4'); R(c, 10 * TS, 4 * TS, 48, 2, '#a8c0d0'); E(c, 11 * TS, 5 * TS, 3, 3, '#8a96a0'); });
  m.trig(10, 4, 2, 2, { here: true, label: 'Duschen', act: () => Story.shower() });
  m.add(mkObj(12, 5, 1, 1, 6, (c, W, H) => { R(c, 4, 0, 14, 8, '#f4f6f8'); E(c, 11, 15, 6, 6, '#f4f6f8'); E(c, 11, 15, 4, 4, '#c9dce6'); }, { solid: true }));
  m.add(mkObj(9, 5, 1, 1, 6, (c, W, H) => { R(c, 2, 3, 20, 14, '#f4f6f8'); E(c, 12, 10, 7, 4, '#c9d6de'); R(c, 11, 1, 2, 4, '#a8b0b8'); }, { solid: true }));
  m.add(mkObj(12, 9, 1, 1, 8, (c, W, H) => { R(c, 3, 0, 18, H - 1, '#2a2c30'); R(c, 4, 2, 16, H - 6, '#3a3d42'); R(c, 17, 8, 1, 8, '#9aa0a6'); R(c, 4, 2, 16, 1, '#5a5e64'); }, { solid: true }));
  m.trig(12, 9, 1, 1, { label: 'Minibar', act: () => Story.shop('minibar') });
  m.add(objPlant(1, 10));
  doorBottom(m, 6, 1, 'hotel_floor', 'room', 'Auf den Flur');
  m.spawn('entry', 6, 10, 3);
  return m;
};

/* ----------- Colba: Eingangshalle & Office ----------- */
MAP_BUILDERS.colba_entry = () => {
  const m = new GMap('colba_entry', 20, 12, { name: 'Edificio Turia · Eingang', indoor: true, bg: '#0e1116', wallStyle: { cap: '#4a4e54' }, music: null });
  m.room(0, 0, 20, 12, 8, T.MARBLE);
  m.decal((c) => { DECAL.lift(c, 2 * TS + 6, TS + 2, '0'); DECAL.lift(c, 16 * TS + 6, TS + 2, '0'); for (let k = 0; k < 8; k++) { R(c, (6 + k) * TS + 4, TS + 6, 16, 10, '#b8a070'); R(c, (6 + k) * TS + 6, TS + 8, 12, 2, '#5a5048'); } pxText(c, 'BUZONES', 8 * TS + 8, TS + 20, '#5a5048'); });
  m.warp(3, 3, 'colba', 'lift', { w: 1, label: 'Lift links' });
  m.warp(17, 3, 'colba', 'lift', { w: 1, label: 'Lift rechts' });
  m.fill(8, 3, 4, 3, T.STAIRS, 0); m.warp(8, 3, 'colba', 'stairs', { w: 4, label: 'Treppe in den 1. Stock', opts: { stairs: true } });
  m.decal((c) => { R(c, 8 * TS, 3 * TS, 4 * TS, 1, '#8a8e94'); });
  m.add(objPlant(1, 9, true)); m.add(objPlant(18, 9, true));
  m.add(objSignpost(13, 6, '1º COLBA', '#2a9aa0'));
  m.add(objBikeStand(5, 9, 2));
  doorBottom(m, 9, 2, 'city', 'colba', 'Auf die Strasse');
  m.spawn('entry', 10, 10, 3); m.spawn('lift', 3, 4, 0); m.spawn('stairs', 10, 6, 0);
  return m;
};
MAP_BUILDERS.colba = () => {
  const m = new GMap('colba', 60, 30, { name: 'Colba · 1. Stock', indoor: true, bg: '#0e1116', wallStyle: { cap: '#3a3e44' }, music: 'office' });
  m.room(0, 0, 60, 30, 2, T.TILE, 1);
  /* Flur in der Mitte (y 14..17), Teamräume oben, Aufenthaltsraum rechts, Lift/Treppe unten links */
  const roomBox = (x, y, w, h, style, floor, fv) => { m.fill(x, y, w, h, floor, fv); m.fill(x, y, w, 1, T.WALL); m.fill(x, y + 1, w, 2, T.WALLF, style); for (let yy = y; yy < y + h; yy++) { m.set(x, yy, T.WALL); m.set(x + w - 1, yy, T.WALL); } m.fill(x, y + h - 1, w, 1, T.WALL); };
  /* Teamräume */
  const TR = { indurain: { x: 1, y: 1 }, meeseeks: { x: 16, y: 1 }, rocket: { x: 31, y: 1 } };
  for (const [team, p] of Object.entries(TR)) {
    const t = TEAMS[team];
    roomBox(p.x, p.y, 14, 13, 2, T.CARPET, team === 'indurain' ? 5 : team === 'meeseeks' ? 2 : 4);
    m.set(p.x + 6, p.y + 12, T.TILE, 1); m.set(p.x + 7, p.y + 12, T.TILE, 1);
    m.decal((c) => { R(c, (p.x + 6) * TS, (p.y + 12) * TS, 2 * TS, TS, '#e4e8ec'); R(c, (p.x + 6) * TS + 2, (p.y + 12) * TS + 2, 2 * TS - 4, 10, '#8a9098'); const tw = pxTextW(t.n.toUpperCase().replace('TEAM ', ''), 1) + 8; R(c, (p.x + 7) * TS - tw / 2, (p.y + 1) * TS + 4, tw, 11, t.col); pxText(c, t.n.toUpperCase().replace('TEAM ', ''), (p.x + 7) * TS - tw / 2 + 4, (p.y + 1) * TS + 7, '#ffffff'); DECAL.logo(c, (p.x + 1) * TS + 4, (p.y + 1) * TS + 24, 'COLBA', '#2a9aa0'); });
    m.add(objWhiteboard(p.x + 4, p.y + 1, 5, { title: 'PI ' + t.n.replace('Team ', '').toUpperCase() }));
    m.trig(p.x + 4, p.y + 3, 5, 1, { label: 'Programm-Board · ' + t.n, act: () => Story.teamBoard(team) });
    m.add(objTable(p.x + 3, p.y + 6, 8, 3, { col: '#e8e4dc', laptops: 3 }));
    m.trig(p.x + 3, p.y + 6, 8, 3, { label: 'Team-Tisch · ' + t.n, act: () => Story.teamTable(team) });
    for (const dx of [3, 6, 9]) { m.add(objOfficeChair(p.x + dx, p.y + 5, '#2a2a30')); m.add(objOfficeChair(p.x + dx, p.y + 9, '#2a2a30')); }
    m.add(objFlipchart(p.x + 11, p.y + 2)); m.add(objPlant(p.x + 1, p.y + 10));
    m.add(objScreen(p.x + 10, p.y + 1, 3));
    if (team === 'rocket') { m.add(objAmp(p.x + 1, p.y + 4)); m.trig(p.x + 1, p.y + 4, 1, 1, { label: 'Carlos’ Bass-Verstärker', act: () => Story.say('carlos', pick(['Der steht hier, weil der Proberaum in Benimaclet keine Heizung hat. Und weil ich in der Mittagspause übe. Leise. Meistens.', 'Nicht anfassen – der Regler steht auf elf. Immer.'])) }); m.decal((c) => DECAL.poster(c, (p.x + 2) * TS, (p.y + 1) * TS + 4, '#1a1a1e', 'ROCK')); }
    m.trig(p.x + 10, p.y + 3, 3, 1, { label: 'Bildschirm: Dependency-Board', act: () => Story.depBoard(team) });
    m.trig(p.x + 11, p.y + 3, 1, 1, { label: 'Flipchart: Risiken (ROAM)', act: () => Story.roam(team) });
    m.spawn('room_' + team, p.x + 7, p.y + 11, 3);
  }
  /* Aufenthaltsraum (rechts) */
  roomBox(46, 1, 13, 20, 2, T.WOOD, 4);
  m.decal((c) => { DECAL.logo(c, 47 * TS + 6, TS + 20, 'LOUNGE', '#ff8c1a'); DECAL.window(c, 50 * TS, TS + 6, 48, 30); DECAL.window(c, 54 * TS, TS + 6, 48, 30); DECAL.clock(c, 47 * TS + 4, TS + 4); });
  m.add(objScreen(52, 1, 4)); m.trig(52, 3, 4, 1, { label: 'Grosser Bildschirm', act: () => Story.loungeScreen() });
  m.add(objKitchen(47, 4, 4)); m.add(objCoffee(51, 4)); m.trig(51, 4, 1, 1, { label: 'Kaffeemaschine', act: () => Story.coffee() });
  m.add(objFridge(55, 4)); m.trig(55, 4, 1, 1, { label: 'Kühlschrank', act: () => Story.fridge() });
  m.add(objWaterCooler(57, 4)); m.trig(57, 4, 1, 1, { label: 'Wasserspender', act: () => Story.water() });
  m.add(objTable(48, 9, 9, 3, { col: '#a87a4a', items: (c, W, H) => { for (let k = 0; k < 6; k++) { const px = 14 + k * 32, py = 8 + (k % 2) * 36; E(c, px, py, 7, 4, '#f4f0e6'); E(c, px, py, 5, 2.5, '#e8b040'); R(c, px + 10, py - 4, 3, 7, 'rgba(230,240,245,0.85)'); } E(c, W / 2, H / 2 - 4, 18, 8, '#2a2a2e'); E(c, W / 2, H / 2 - 5, 16, 6, '#e8b040'); for (let k = 0; k < 10; k++) P(c, W / 2 - 12 + Math.floor(hash(k, 1) * 24), H / 2 - 8 + Math.floor(hash(1, k) * 6), ['#c8352d', '#3f8e4b', '#f4f0e6'][k % 3]); } })); m.trig(48, 9, 9, 3, { label: 'Grosser Tisch', act: () => Story.loungeTable() });
  for (const dx of [48, 51, 54]) { m.add(objChair(dx, 8, 0, '#2a2a30')); m.add(objChair(dx, 12, 3, '#2a2a30')); }
  m.add(objSofa(47, 16, 3, '#2a9aa0')); m.add(objSofa(53, 16, 3, '#ff8c1a')); m.add(objTable(50, 16, 2, 1, { col: '#e8e4dc' }));
  m.trig(47, 16, 3, 1, { label: 'Sofa: Kurz hinsetzen', act: () => Story.sofa() });
  m.add(objPlant(57, 18, true)); m.add(objVending(57, 12)); m.trig(57, 12, 1, 1, { label: 'Snack-Automat', act: () => Story.shop('automat') });
  m.set(52, 20, T.TILE, 1); m.set(53, 20, T.TILE, 1); m.decal((c) => { R(c, 52 * TS, 20 * TS, 2 * TS, TS, '#e4e8ec'); R(c, 52 * TS + 2, 20 * TS + 2, 2 * TS - 4, 10, '#8a9098'); });
  m.spawn('lounge', 52, 19, 3);
  /* Balkon (oben rechts, über den Aufenthaltsraum erreichbar) */
  m.fill(56, 21, 3, 4, T.BALCONY); m.fill(56, 21, 3, 1, T.WALL); m.fill(58, 21, 1, 4, T.WALL); m.set(56, 20, T.WALL);
  m.fill(46, 21, 13, 9, T.TILE, 1);
  m.fill(55, 21, 1, 9, T.WALL); m.fill(55, 25, 4, 1, T.WALL); m.fill(56, 25, 2, 5, T.TILE, 1);
  m.set(55, 27, T.TILE, 1); m.decal((c) => { R(c, 55 * TS, 27 * TS, TS, TS, '#e4e8ec'); R(c, 55 * TS + 2, 27 * TS + 2, 8, TS - 4, '#8a9098'); pxText(c, 'BALKON', 56 * TS + 2, 25 * TS + 6, '#2a9aa0'); });
  m.fill(56, 21, 2, 4, T.BALCONY); m.set(57, 25, T.TILE, 1);
  m.decal((c) => { R(c, 56 * TS, 21 * TS, 2 * TS, 4 * TS, '#c8b8a0'); for (let k = 0; k < 2 * TS; k += 4) R(c, 56 * TS + k, 21 * TS, 2, 6, '#5a5048'); R(c, 56 * TS, 21 * TS + 6, 2 * TS, 1, '#5a5048'); });
  m.add(objAshtray(56, 22)); m.trig(56, 22, 1, 1, { label: 'Balkon: Eine rauchen', act: () => Story.balcony() });
  m.add(objPlanter(57, 24, '#e8402e'));
  /* Backoffice Isabell (unten rechts im grossen Raum), E-Bike-Ecke, WC */
  m.add(objDesk(48, 23, 3, { coffee: true })); m.trig(48, 23, 3, 1, { label: 'Backoffice: Isabell', act: () => Story.isabellDesk() });
  m.add(objOfficeChair(49, 24)); m.decal((c) => DECAL.logo(c, 47 * TS, 21 * TS + 8, 'BACKOFFICE', '#2a9aa0'));
  m.add(objPlant(53, 23));
  m.add(objTestBench(2, 24)); m.trig(2, 24, 2, 1, { label: 'CANopen-Prüfstand', act: () => Story.testBench() });
  m.add(objBikeStand(5, 24, 3)); m.trig(5, 24, 2, 1, { label: 'Test-E-Bikes', act: () => Story.officeBikes() });
  m.add(objEbike(8, 25, '#e2554a')); m.add(objEbike(10, 25, '#2fa0d8', true));
  m.decal((c) => { DECAL.logo(c, 2 * TS, 21 * TS + 8, 'LAB', '#e2554a'); DECAL.poster(c, 12 * TS, 21 * TS + 4, '#2a9aa0', 'CAN'); DECAL.poster(c, 14 * TS, 21 * TS + 4, '#e2554a', 'OTA'); });
  m.fill(16, 21, 6, 1, T.WALL); m.fill(21, 21, 1, 5, T.WALL); m.fill(16, 25, 6, 1, T.WALL); m.fill(17, 22, 4, 3, T.TILE, 0); m.set(18, 25, T.TILE, 1);
  m.decal((c) => { R(c, 18 * TS, 25 * TS, TS, TS, '#e4e8ec'); R(c, 18 * TS + 2, 25 * TS + 2, TS - 4, 10, '#8a9098'); pxText(c, 'WC', 18 * TS + 6, 22 * TS - 6, '#2a2a30'); });
  m.add(mkObj(19, 22, 1, 1, 6, (c, W, H) => { R(c, 4, 0, 14, 8, '#f4f6f8'); E(c, 11, 15, 6, 6, '#f4f6f8'); E(c, 11, 15, 4, 4, '#c9dce6'); }, { solid: true }));
  m.trig(19, 22, 1, 1, { label: 'WC', act: () => Story.wc() });
  /* Flur-Deko */
  m.decal((c) => { for (let k = 0; k < 6; k++) DECAL.poster(c, (24 + k * 3) * TS, 21 * TS + 4, ['#2a9aa0', '#e2554a', '#f0a23a', '#2fa0d8', '#3f8e4b', '#6a4a9c'][k], ['SAFE', 'PI', 'OKR', 'CAN', 'BIKE', 'DEV'][k]); });
  m.add(objPlant(30, 24)); m.add(objPlant(44, 24)); m.add(objWaterCooler(40, 24));
  m.trig(40, 24, 1, 1, { label: 'Wasserspender', act: () => Story.water() });
  /* Lift & Treppe unten links */
  m.decal((c) => { DECAL.lift(c, 2 * TS + 6, 26 * TS - 40, '1'); });
  m.fill(1, 27, 3, 2, T.TILE, 2); m.warp(2, 28, 'colba_entry', 'lift', { w: 1, label: 'Lift' });
  m.fill(6, 27, 3, 2, T.STAIRS, 0); m.warp(6, 28, 'colba_entry', 'stairs', { w: 3, label: 'Treppe', opts: { stairs: true } });
  m.decal((c) => { R(c, 1 * TS, 27 * TS, 3 * TS, 2 * TS, '#c6ccd2'); R(c, 2 * TS + 10, 27 * TS, 4, 2 * TS, '#7a8086'); R(c, 6 * TS, 27 * TS, 3 * TS, 1, '#8a8e94'); });
  m.add(objSignpost(10, 27, 'COLBA 1º', '#2a9aa0'));
  m.spawn('lift', 2, 26, 3); m.spawn('stairs', 7, 26, 3);
  m.pedZones.push({ x: 24, y: 22, w: 20, h: 6, n: 0 });
  return m;
};

/* ----------- Bar Pepita ----------- */
MAP_BUILDERS.bar = () => {
  const m = new GMap('bar', 22, 14, { name: 'Bar Pepita', indoor: true, bg: '#0e1116', wallStyle: { cap: '#3a2a20' }, music: 'bar', ambient: 0.25 });
  m.room(0, 0, 22, 14, 1, T.WOOD, 1);
  m.decal((c) => { DECAL.jamones(c, 2 * TS, TS + 2, 3); DECAL.shelf(c, 12 * TS, TS + 4, 80); DECAL.tv(c, 17 * TS, TS + 6); DECAL.poster(c, 8 * TS, TS + 4, '#ff8c1a', 'AGUA'); });
  m.add(objCounter(10, 4, 9, 1, { top: '#6a4428', front: '#3a2418', taps: 3, reg: true, glasses: true }));
  m.trig(10, 4, 9, 1, { label: 'Theke', act: () => Story.shop('bar') });
  m.npcDefs.push({ id: 'pepita', name: 'Pepita', x: 14 * TS + 12, y: 3 * TS + 22, dir: 0, look: npcLook(701, { fem: 1, hair: 13, hairCol: 7, top: 0, topCol: 17, pants: 0, pantsCol: 2, jewel: 3, glasses: 0 }), talk: () => Story.shop('bar'), keepDir: true, bubbleRand: ['dots', 'beer'] });
  for (const x of [11, 13, 15, 17]) m.add(objStool(x, 6, '#c8352d'));
  m.add(objTable(2, 6, 2, 1, { col: '#6a4428' })); m.add(objTable(2, 10, 2, 1, { col: '#6a4428' })); m.add(objTable(6, 8, 2, 1, { col: '#6a4428' }));
  for (const [x, y] of [[2, 5], [3, 5], [2, 9], [3, 9], [6, 7], [7, 7]]) m.add(objChair(x, y, 0, '#5a3a24'));
  for (const [x, y] of [[2, 7], [3, 7], [2, 11], [3, 11], [6, 9], [7, 9]]) m.add(objChair(x, y, 3, '#5a3a24'));
  m.trig(2, 6, 2, 1, { label: 'Stammtisch der POs', act: () => Story.barTable() });
  m.add(objTable(14, 9, 3, 1, { col: '#6a4428' })); for (const x of [14, 15, 16]) { m.add(objChair(x, 8, 0, '#5a3a24')); m.add(objChair(x, 10, 3, '#5a3a24')); }
  m.trig(14, 9, 3, 1, { label: 'Tisch der Colba-Leute', act: () => Story.barTable2() });
  m.add(objPlant(20, 11)); m.add(objPlant(1, 12));
  m.pedZones.push({ x: 18, y: 7, w: 3, h: 4, n: 2, drink: true });
  m.light(14 * TS, 3 * TS, 90, '#ffc870'); m.light(4 * TS, 7 * TS, 70, '#ffb860');
  doorBottom(m, 9, 2, 'city', 'bar', 'Auf die Plaza');
  m.spawn('entry', 10, 12, 3);
  return m;
};
/* ----------- Jamonería Ramón ----------- */
MAP_BUILDERS.jamon = () => {
  const m = new GMap('jamon', 18, 12, { name: 'Jamonería Ramón', indoor: true, bg: '#0e1116', wallStyle: { cap: '#4a2a1a' }, music: 'bar', ambient: 0.15 });
  m.room(0, 0, 18, 12, 10, T.TILE, 3);
  m.decal((c) => { DECAL.jamones(c, 2 * TS, TS + 2, 8); DECAL.logo(c, 13 * TS, TS + 24, 'BELLOTA', '#5a1a10'); });
  m.add(objCounter(3, 4, 8, 1, { top: '#8a5e3a', front: '#5a3a24', reg: true }));
  m.trig(3, 4, 8, 1, { label: 'Theke: Jamón', act: () => Story.shop('jamon') });
  m.npcDefs.push({ id: 'ramon', name: 'Ramón (Cortador)', x: 7 * TS + 12, y: 3 * TS + 22, dir: 0, look: npcLook(702, { hair: 10, hairCol: 9, beard: 2, beardCol: 8, top: 1, topCol: 14, pants: 5, pantsCol: 2, build: 3 }), talk: () => Story.jamonTalk(), keepDir: true, bubbleRand: ['dots'] });
  m.add(objBarrel(13, 4)); m.add(objBarrel(15, 4));
  for (const [x, y] of [[3, 7], [8, 7], [13, 8]]) { m.add(objTable(x, y, 2, 1, { col: '#6a4428', cloth: '#c8352d' })); m.add(objChair(x, y - 1, 0, '#5a3a24')); m.add(objChair(x + 1, y - 1, 0, '#5a3a24')); m.add(objChair(x, y + 1, 3, '#5a3a24')); m.add(objChair(x + 1, y + 1, 3, '#5a3a24')); }
  m.pedZones.push({ x: 12, y: 7, w: 4, h: 3, n: 2, sit: true });
  m.light(7 * TS, 3 * TS, 80, '#ffb860');
  doorBottom(m, 8, 2, 'city', 'jamon', 'Auf die Strasse');
  m.spawn('entry', 9, 10, 3);
  return m;
};
/* ----------- Bodega La Tinaja ----------- */
MAP_BUILDERS.bodega = () => {
  const m = new GMap('bodega', 18, 12, { name: 'Bodega La Tinaja', indoor: true, bg: '#0e1116', wallStyle: { cap: '#3a2a1a' }, music: 'museum', ambient: 0.3 });
  m.room(0, 0, 18, 12, 9, T.COBBLE, 2);
  m.decal((c) => { DECAL.shelf(c, 2 * TS, TS + 4, 120); DECAL.logo(c, 11 * TS, TS + 26, 'UTIEL-REQUENA', '#3a1a10'); });
  for (const x of [2, 4, 6, 14, 16]) m.add(objBarrel(x, 4));
  m.add(objCounter(8, 4, 5, 1, { top: '#6a4428', front: '#3a2418', glasses: true }));
  m.trig(8, 4, 5, 1, { label: 'Degustation', act: () => Story.wine() });
  m.npcDefs.push({ id: 'ines', name: 'Inés (Sommelière)', x: 10 * TS + 12, y: 3 * TS + 22, dir: 0, look: npcLook(703, { fem: 1, hair: 13, hairCol: 0, top: 11, topCol: 1, pants: 5, pantsCol: 2, glasses: 1 }), talk: () => Story.wine(), keepDir: true, bubbleRand: ['dots'] });
  m.add(objTable(4, 8, 3, 1, { col: '#5a3a24' })); for (const x of [4, 5, 6]) { m.add(objChair(x, 7, 0, '#4a2a14')); m.add(objChair(x, 9, 3, '#4a2a14')); }
  m.add(objTable(11, 8, 3, 1, { col: '#5a3a24' })); for (const x of [11, 12, 13]) { m.add(objChair(x, 7, 0, '#4a2a14')); m.add(objChair(x, 9, 3, '#4a2a14')); }
  m.light(10 * TS, 3 * TS, 70, '#ffb860'); m.light(5 * TS, 8 * TS, 60, '#ffb860'); m.light(12 * TS, 8 * TS, 60, '#ffb860');
  doorBottom(m, 8, 2, 'city', 'bodega', 'Auf die Strasse');
  m.spawn('entry', 9, 10, 3);
  return m;
};
/* ----------- Marina Beach Club ----------- */
MAP_BUILDERS.disco = () => {
  const m = new GMap('disco', 26, 16, { name: 'Marina Beach Club', indoor: true, bg: '#0a0a12', wallStyle: { cap: '#1a1a26' }, music: 'disco', ambient: 0.55 });
  m.room(0, 0, 26, 16, 3, T.DARK);
  m.fill(8, 5, 10, 7, T.DARK, 1);
  m.decal((c) => { for (let x = 8; x < 18; x++) for (let y = 5; y < 12; y++) R(c, x * TS + 2, y * TS + 2, TS - 4, TS - 4, ['#2a1a4a', '#1a2a4a', '#3a1a3a', '#1a3a3a'][(x + y) % 4]); DECAL.neon(c, 9 * TS, TS + 8, 'MARINA', '#ff3ad0'); DECAL.neon(c, 15 * TS, TS + 8, 'BEACH', '#3ae0ff'); });
  m.add(objDJ(12, 2)); m.trig(12, 2, 2, 1, { label: 'DJ Álex', act: () => Story.dj() });
  m.add(objSpeaker(10, 2)); m.add(objSpeaker(15, 2));
  m.trig(8, 5, 10, 7, { here: true, label: 'Tanzen', act: () => Story.dance() });
  m.add(objCounter(20, 4, 4, 1, { top: '#1a1a26', front: '#101018', taps: 2, glasses: true }));
  m.trig(20, 4, 4, 1, { label: 'Bar', act: () => Story.shop('discobar') });
  m.npcDefs.push({ id: 'mira', name: 'Barkeeperin Noa', x: 22 * TS + 12, y: 3 * TS + 22, dir: 0, look: npcLook(704, { fem: 1, hair: 4, hairCol: 13, top: 5, topCol: 17, pants: 0, pantsCol: 2, jewel: 3 }), talk: () => Story.shop('discobar'), keepDir: true, bubbleRand: ['note'] });
  for (const x of [20, 22]) m.add(objStool(x, 6, '#e040d0'));
  m.add(objSofa(2, 6, 3, '#2a1a3a')); m.add(objSofa(2, 10, 3, '#2a1a3a')); m.add(objTable(5, 8, 1, 1, { col: '#1a1a26' }));
  m.trig(2, 6, 3, 1, { label: 'Lounge-Sofa', act: () => Story.discoSofa() });
  m.pedZones.push({ x: 8, y: 5, w: 10, h: 7, n: 8, dance: true }); m.pedZones.push({ x: 19, y: 7, w: 5, h: 5, n: 2, drink: true });
  m.dynLights = () => { const t = G.t; return [{ x: 13 * TS, y: 8 * TS, r: 110, c: ['#ff3ad0', '#3ae0ff', '#ffe03a', '#7aff6a'][Math.floor(t * 2) % 4] }, { x: 22 * TS, y: 4 * TS, r: 60, c: '#ff8c1a' }]; };
  m.light(13 * TS, 2 * TS, 70, '#ff3ad0');
  doorBottom(m, 12, 2, 'city', 'disco', 'Nach draussen');
  m.spawn('entry', 13, 14, 3);
  return m;
};
/* ----------- Museu de Belles Arts ----------- */
MAP_BUILDERS.museum = () => {
  const m = new GMap('museum', 36, 12, { name: 'Museu de Belles Arts', indoor: true, bg: '#0e1116', wallStyle: { cap: '#8a7a60' }, music: 'museum' });
  m.room(0, 0, 36, 12, 7, T.MARBLE);
  const kinds = [['sorolla', 'Sorolla: „Paseo a orillas del mar“', 'Joaquín Sorolla, 1909. Das Licht der Malvarrosa – zwei Frauen im Wind. Sorolla war Valencianer und malte den Strand immer wieder.'], ['velazquez', 'Velázquez: Selbstbildnis', 'Diego Velázquez, um 1640. Eines der wenigen Selbstporträts des Meisters – und der Stolz des Museums.'], ['goya', 'Goya: „Francisco Bayeu“', 'Francisco de Goya malte seinen Schwager und Lehrer Francisco Bayeu, 1795 – ein Meisterwerk der Porträtkunst.'], ['greco', 'El Greco: „Johannes der Täufer“', 'Dominikos Theotokopoulos, genannt El Greco, um 1600. Lange Figuren, dramatisches Licht.'], ['modern', 'Sempere: Kinetische Komposition', 'Eusebio Sempere, 1970er. Op-Art aus Valencia – Linien, die zu schwingen scheinen.'], ['bike', 'Leihgabe: „Bicicleta“', 'Eine moderne Leihgabe. Hängt hier, weil das Museum eine Fahrrad-Ausstellung zeigt – oder weil Fran den Kurator kennt.']];
  kinds.forEach(([k, n, f], i) => { const x = 3 + i * 5; m.add(objPainting(x, 1, k)); m.trig(x, 3, 1, 1, { label: n.split(':')[0], act: () => Story.painting(i, n, f) }); });
  for (const x of [6, 16, 26]) m.add(objBench(x, 7, 1, '#8a6a44'));
  m.add(objPlant(1, 9, true)); m.add(objPlant(34, 9, true));
  m.npcDefs.push({ id: 'ferrer', name: 'Señor Ferrer (Aufsicht)', x: 32 * TS + 12, y: 6 * TS + 20, dir: 1, look: npcLook(705, { hair: 10, hairCol: 9, beard: 2, beardCol: 8, top: 7, topCol: 11, pants: 5, pantsCol: 8, glasses: 2 }), talk: () => Story.guard(), keepDir: true, bubbleRand: ['dots'] });
  m.pedZones.push({ x: 2, y: 4, w: 32, h: 6, n: 4 });
  doorBottom(m, 17, 2, 'city', 'museum', 'Hinaus');
  m.spawn('entry', 18, 10, 3);
  return m;
};
/* ----------- Mercado Central ----------- */
MAP_BUILDERS.mercado = () => {
  const m = new GMap('mercado', 34, 18, { name: 'Mercado Central', indoor: true, bg: '#0e1116', wallStyle: { cap: '#8a4428' }, music: 'market' });
  m.room(0, 0, 34, 18, 6, T.TILE, 2);
  m.decal((c) => { DECAL.azulejos(c, 2 * TS, TS + 4, 120, 16); DECAL.logo(c, 14 * TS, TS + 10, 'MERCAT CENTRAL', '#8a4428'); DECAL.azulejos(c, 26 * TS, TS + 4, 120, 16); });
  const stalls = [['fish', 4, 4, 'Pescadería Toni', 'fisch'], ['jamon', 10, 4, 'Jamones y Embutidos', 'mjamon'], ['fruit', 16, 4, 'Frutería', 'fruta'], ['veg', 22, 4, 'Verduras', 'fruta'], ['spice', 28, 4, 'Especias & Safran', 'spice'], ['fish', 4, 10, 'Marisquería', 'fisch'], ['flowers', 10, 10, 'Flores', 'flores'], ['fruit', 16, 10, 'Naranjas de Valencia', 'fruta'], ['jamon', 22, 10, 'Quesos & Jamón', 'mjamon'], ['spice', 28, 10, 'Chufas & Horchata', 'horchata']];
  stalls.forEach(([k, x, y, n, shop], i) => { m.add(objMarketStall(x, y, k, 3)); m.trig(x, y + 1, 3, 1, { label: n, act: () => Story.shop(shop) }); });
  m.npcDefs.push({ id: 'toni', name: 'Toni (Pescadero)', x: 5 * TS + 12, y: 3 * TS + 22, dir: 0, look: npcLook(706, { hair: 1, hairCol: 0, beard: 1, top: 0, topCol: 14, pants: 4, pantsCol: 8, hat: 1, hatCol: 2, build: 3 }), talk: () => Story.fishTalk(), keepDir: true, bubbleRand: ['dots', '!'] });
  m.npcDefs.push({ id: 'lola', name: 'Lola (Frutera)', x: 17 * TS + 12, y: 9 * TS + 22, dir: 0, look: npcLook(707, { fem: 1, hair: 12, hairCol: 9, top: 11, topCol: 2, pants: 8, pantsCol: 9 }), talk: () => Story.shop('fruta'), keepDir: true, bubbleRand: ['heart'] });
  m.pedZones.push({ x: 2, y: 6, w: 30, h: 10, n: 12 });
  m.add(objPlant(1, 15)); m.add(objPlant(32, 15));
  doorBottom(m, 16, 2, 'city', 'mercado', 'Hinaus');
  m.spawn('entry', 17, 16, 3);
  return m;
};

/* ----------- Dannys Haus: Garten mit BBQ-Grill (Mittwochabend Asado) ----------- */
MAP_BUILDERS.danny_house = () => {
  const m = new GMap('danny_house', 30, 20, { name: 'Bei Danny · Garten', bg: '#2a4a2a', city: 'vlc' });
  m.fill(0, 0, 30, 20, T.GRASS, (x, y) => ((x * 3 + y) % 7 === 0 ? 1 : 0));
  m.fill(0, 0, 30, 1, T.HEDGE); m.fill(0, 19, 30, 1, T.HEDGE); for (let y = 0; y < 20; y++) { m.set(0, y, T.HEDGE); m.set(29, y, T.HEDGE); }
  /* Haus oben: weiss, Terrakotta-Dach, Terrasse davor */
  m.add(objBuilding(9, 1, 12, 4, { floors: 2, wall: '#f4f0e6', roof: '#b85a3a', roofType: 'gable', shutter: '#2f6fb8', balcony: false, doors: [{ dx: 5, type: 'glass' }, { dx: 6, type: 'glass' }], shopWins: [], seed: 88, sign: { text: 'CASA DANNY', bg: '#2f6fb8', fg: '#ffffff' }, special: (c, W, H, fy0) => { for (let k = 0; k < 3; k++) { R(c, 20 + k * 100, H - 44, 14, 6, '#8a5e3a'); for (let j = 0; j < 5; j++) P(c, 22 + k * 100 + j * 3, H - 46, j % 2 ? '#e8402e' : '#f2c23a'); } } }));
  m.trig(14, 4, 2, 1, { label: 'Dannys Haustür', act: () => Story.dannyDoor() });
  m.fill(8, 5, 14, 3, T.PLAZA, 2);
  for (const [x, y] of [[8, 5], [21, 5]]) m.add(objPlanter(x, y, '#e86ab0'));
  /* Grill, grosser Tisch, Verstärker, Pool, Hängematte, Bäume */
  m.add(objGrill(17, 6)); m.trig(17, 7, 2, 1, { label: 'BBQ-Grill', act: () => Story.grill() });
  m.add(objTable(10, 9, 6, 2, { col: '#a87a4a', cloth: '#f4f0e6', items: (c, W, H) => { for (let k = 0; k < 5; k++) { E(c, 14 + k * 28, 10, 6, 3, '#f4f0e6'); R(c, 24 + k * 28, 4, 3, 6, 'rgba(230,240,245,0.85)'); E(c, 25 + k * 28, 7, 1, 1.5, '#8ac860'); } E(c, W / 2, H / 2 - 2, 14, 6, '#5a3a24'); E(c, W / 2, H / 2 - 3, 12, 4, '#a83a30'); } }));
  m.trig(10, 9, 6, 2, { label: 'Gartentisch', act: () => Story.gardenTable() });
  for (const dx of [10, 12, 14]) { m.add(objChair(dx, 8, 0, '#e8e4dc')); m.add(objChair(dx, 11, 3, '#e8e4dc')); }
  m.add(objAmp(23, 9)); m.trig(23, 9, 1, 1, { label: 'Verstärker (Carlos)', act: () => Story.bassSolo() });
  m.add(objSpeaker(25, 9));
  m.fill(3, 8, 4, 4, T.WATER, 1); m.fill(2, 7, 6, 1, T.DECK); m.fill(2, 12, 6, 1, T.DECK); m.fill(2, 8, 1, 4, T.DECK); m.fill(7, 8, 1, 4, T.DECK);
  m.trig(2, 12, 6, 1, { here: true, label: 'Pool: Füsse reinhängen', act: () => Story.pool() });
  m.add(objSunbed(3, 13, '#ff8c1a'));
  m.add(objHammock(20, 13)); m.trig(20, 13, 3, 1, { label: 'Hängematte', act: () => Story.hammock() });
  for (const [x, y] of [[2, 3], [26, 3], [26, 15]]) m.add(objPalm(x, y, 44));
  for (const [x, y] of [[5, 15], [24, 6], [12, 16]]) m.add(objOrange(x, y));
  m.add(objBush(8, 15, '#4f8040', '#e86ab0')); m.add(objBush(17, 16, '#4f8040', '#f2c23a'));
  for (const [x, y] of [[9, 13], [19, 12]]) m.add(objLamp(x, y, 'old'));
  /* Gartentor unten: Taxi zurück */
  m.set(14, 19, T.GRAVEL); m.set(15, 19, T.GRAVEL);
  m.decal((c) => { R(c, 14 * TS, 19 * TS, 2 * TS, TS, '#8a7a60'); for (let k = 2; k < 2 * TS - 2; k += 5) R(c, 14 * TS + k, 19 * TS + 2, 2, TS - 4, '#5a4a3a'); });
  m.trig(14, 19, 2, 1, { here: true, label: 'Gartentor: Taxi zurück in die Stadt', act: () => Story.leaveDanny() });
  m.light(18 * TS, 6 * TS, 70, '#ff9a4a');
  m.musicFn = () => (G.S.flags.bassOn ? 'rock' : 'beach');
  m.birdSpots.push({ x: 8, y: 14, w: 6, h: 3, n: 3 });
  m.spawn('entry', 15, 18, 3);
  return m;
};
