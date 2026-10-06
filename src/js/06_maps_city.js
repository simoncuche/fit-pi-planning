/* ============ Valencia (Stadtkarte 100×84) ============ */
const CITY = {
  hotel: { x: 10, y: 27, w: 7, h: 4 }, bar: { x: 22, y: 15, w: 6, h: 3 }, colba: { x: 72, y: 24, w: 8, h: 4 },
  mercado: { x: 50, y: 15, w: 12, h: 6 }, museum: { x: 84, y: 14, w: 10, h: 5 }, jamon: { x: 24, y: 47, w: 5, h: 3 }, bodega: { x: 31, y: 47, w: 5, h: 3 },
  disco: { x: 72, y: 60, w: 7, h: 4 }, kart: { x: 6, y: 62, w: 12, h: 8 }, padel: { x: 60, y: 60, w: 6, h: 4 }, estacion: { x: 30, y: 56, w: 14, h: 4 },
};
const PASTEL = ['#f4d8a0', '#e8c9a0', '#f0b8a0', '#d8e0c0', '#f8e8c8', '#e0c8d8', '#c8d8e8', '#f2c8a8', '#e8d8b0', '#d0c8b8'];
function cityBlock(m, x, y, w, h, r, o = {}) {
  /* Häuserzeile: mehrere Gebäude nebeneinander auf einem Block (w Kacheln breit, h tief) */
  let cx = x;
  while (cx < x + w) {
    const bw = Math.min(x + w - cx, rint(3, 6));
    const wall = PASTEL[Math.floor(r() * PASTEL.length)];
    const floors = 2 + Math.floor(r() * 3);
    const doors = r() > 0.4 ? [{ dx: Math.floor(bw / 2), type: r() > 0.5 ? 'door' : 'arch' }] : [];
    const shop = r() > 0.6 ? [0, bw - 1] : [];
    m.add(objBuilding(cx, y, bw, h, Object.assign({ floors, wall, roof: r() > 0.5 ? '#b85a3a' : '#a86a4a', roofType: r() > 0.5 ? 'gable' : 'flat', shutter: r() > 0.5 ? '#3f6a5a' : null, doors, shopWins: shop, seed: cx * 31 + y * 17, awning: r() > 0.6 ? { cols: [Math.min(bw - 1, 1)], col: ['#c8352d', '#2f5fb8', '#3f8e4b'][Math.floor(r() * 3)] } : null, goods: ['#ff8c1a', '#3f8e4b', '#e8c23a'] }, o)));
    cx += bw;
  }
}
function hStreet(m, x, y, w, lanes = 2) { m.fill(x, y, w, lanes, T.ASPH, (xx, yy) => (lanes === 2 && yy === y ? 1 : 0)); }
function vStreet(m, x, y, h, lanes = 2) { m.fill(x, y, lanes, h, T.ASPH, (xx) => (lanes === 2 && xx === x ? 3 : 0)); }
MAP_BUILDERS.city = () => {
  const m = new GMap('city', 100, 84, { name: _t('Valencia'), bg: '#1f7fb8', music: 'city', city: 'vlc', sunny: true });
  const r = rng(2026);
  m.fill(0, 0, 100, 84, T.PAVE, (x, y) => ((x * 7 + y * 3) % 11 === 0 ? 1 : 0));
  /* ---- Jardín del Turia (Norden): Wiese, Radweg, Bäume ---- */
  m.fill(0, 0, 100, 11, T.PARK, (x, y) => ((x + y) % 9 === 0 ? 1 : 0));
  m.fill(0, 5, 100, 2, T.BIKE, (x) => (x % 5 === 0 ? 1 : 0));
  m.fill(0, 11, 100, 1, T.CURB);
  for (let x = 2; x < 98; x += 6) { m.add(objOrange(x + (x % 12 === 2 ? 0 : 1), x % 12 === 2 ? 2 : 9, x % 18 === 8)); }
  for (let x = 5; x < 98; x += 11) m.add(objPalm(x, 3, 40));
  for (let x = 8; x < 96; x += 16) m.add(objBench(x, 8, 0, '#6a8a4a'));
  for (let x = 14; x < 96; x += 24) m.add(objLamp(x, 4, 'old'));
  m.add(objFountain(46, 1));
  m.pedZones.push({ x: 0, y: 1, w: 100, h: 4, n: 8 }); m.pedZones.push({ x: 0, y: 5, w: 100, h: 2, n: 5, bike: true }); m.pedZones.push({ x: 0, y: 7, w: 100, h: 4, n: 6 });
  m.birdSpots.push({ x: 44, y: 3, w: 8, h: 5, n: 6 });
  m.trig(45, 3, 5, 3, { here: true, label: _t('Foto: Jardín del Turia'), act: () => Story.photo('turia'), cond: () => !G.S.photos.turia });
  m.trig(0, 5, 100, 2, { here: true, label: _t('Radweg: Foto Turia'), act: () => Story.photo('turia'), cond: () => !G.S.photos.turia && false });
  /* ---- Torres de Serranos am Südrand des Parks ---- */
  m.add(objSerranos(38, 9, 4));
  m.trig(37, 13, 6, 1, { here: true, label: _t('Foto: Torres de Serranos'), act: () => Story.photo('serranos'), cond: () => !G.S.photos.serranos });
  /* ---- Strassennetz ---- */
  hStreet(m, 0, 12, 82); hStreet(m, 0, 25, 82); hStreet(m, 0, 44, 82); hStreet(m, 0, 52, 82); hStreet(m, 0, 68, 82);
  vStreet(m, 20, 12, 58); vStreet(m, 48, 12, 58); vStreet(m, 70, 12, 58); vStreet(m, 82, 12, 72);
  for (const [x, y] of [[20, 12], [48, 12], [70, 12], [82, 12], [20, 25], [48, 25], [70, 25], [82, 25], [20, 44], [48, 44], [70, 44], [82, 44], [20, 52], [48, 52], [70, 52], [82, 52], [20, 68], [48, 68], [70, 68], [82, 68]]) m.fill(x, y, 2, 2, T.ASPH, 0);
  for (const [x, y] of [[13, 12], [34, 12], [60, 12], [76, 12], [13, 25], [34, 25], [60, 25], [13, 44], [40, 44], [60, 44], [76, 44], [13, 52], [40, 52], [60, 52], [13, 68], [40, 68], [60, 68]]) m.fill(x, y, 2, 2, T.ZEBRA);
  for (const [y, x] of [[18, 20], [36, 20], [18, 48], [36, 48], [18, 70], [36, 70], [60, 20], [60, 48], [60, 70], [30, 82], [50, 82], [60, 82], [74, 82]]) m.fill(x, y, 2, 2, T.ZEBRA);
  /* ---- Plaza de la Virgen: Micalet, Turia-Brunnen, Orangenbäume, Bar Pepita ---- */
  m.fill(22, 14, 26, 11, T.PLAZA, (x, y) => ((x + y) % 2 ? 1 : 3));
  m.add(objMicalet(30, 14));
  m.trig(29, 18, 5, 1, { here: true, label: _t('Foto: El Micalet'), act: () => Story.photo('micalet'), cond: () => !G.S.photos.micalet });
  m.add(objFountain(38, 18));
  m.trig(37, 20, 5, 2, { here: true, label: _t('Turia-Brunnen'), act: () => Story.fountain() });
  for (const [x, y] of [[24, 21], [28, 22], [44, 15], [45, 22], [34, 23]]) m.add(objOrange(x, y));
  for (const [x, y] of [[26, 19], [42, 19]]) m.add(objLamp(x, y, 'old'));
  m.add(objBench(32, 22, 0)); m.add(objBench(40, 23, 0));
  m.add(objKiosk(44, 18, 'HORCHATA', '#e07b25')); m.trig(44, 18, 2, 1, { label: _t('Horchatería'), act: () => Story.shop('horchata') });
  m.npcDefs.push({ id: 'horchatera', name: _t('Horchatera Amparo'), x: 45 * TS + 12, y: 17 * TS + 20, dir: 0, look: npcLook(301, { fem: 1, hair: 12, hairCol: 1, top: 11, topCol: 14, pants: 8, pantsCol: 2, hat: 0, glasses: 0 }), talk: () => Story.shop('horchata'), keepDir: true, bubbleRand: ['dots', 'heart'] });
  m.add(objBuilding(CITY.bar.x, CITY.bar.y, CITY.bar.w, CITY.bar.h, { floors: 2, wall: '#f4d8a0', roof: '#b85a3a', roofType: 'gable', shutter: '#3f6a5a', doors: [{ dx: 2, type: 'door', col: '#5a3a24' }], shopWins: [0, 1, 3, 4], goods: ['#ff8c1a', '#e8b33a', '#f4f0e6'], awning: { cols: [0, 1, 3, 4], col: '#ff8c1a' }, sign: { text: _t('BAR PEPITA'), bg: '#2a1a10', fg: '#ffb53d' }, seed: 7 }));
  m.warp(CITY.bar.x + 2, CITY.bar.y + CITY.bar.h - 1, 'bar', 'entry', { label: _t('Bar Pepita'), guard: () => Story.openGuard('bar') });
  for (const [x, y] of [[22, 19], [25, 19]]) { m.add(objUmbrellaTable(x, y, '#ff8c1a')); }
  m.pedZones.push({ x: 22, y: 14, w: 26, h: 11, n: 7 }); m.birdSpots.push({ x: 34, y: 20, w: 10, h: 4, n: 9 });
  m.trig(36, 22, 4, 2, { here: true, label: _t('Foto: Plaza de la Virgen'), act: () => Story.photo('virgen'), cond: () => !G.S.photos.virgen });
  m.trig(32, 16, 4, 2, { here: true, label: _t('Puerta de los Apóstoles'), act: () => Story.tribunal() });
  /* ---- Mercado Central & Lonja (Block rechts der Plaza) ---- */
  m.add(objBuilding(CITY.mercado.x, CITY.mercado.y, CITY.mercado.w, CITY.mercado.h, { floors: 3, wall: '#c8703a', roof: '#8a9aa0', roofType: 'flat', balcony: false, wins: 'arch', doors: [{ dx: 5, type: 'arch' }, { dx: 6, type: 'arch' }], shopWins: [0, 1, 2, 3, 8, 9, 10, 11], goods: ['#e86a7a', '#3f8e4b', '#ff8c1a', '#e8c23a'], sign: { text: _t('MERCADO CENTRAL'), bg: '#2a1a10', fg: '#f8e8c8', scale: 1 }, seed: 12, special: (c, W, H, fy0) => { for (let k = 0; k < 60; k++) { const t = (k - 30) / 30; const h = Math.sqrt(Math.max(0, 1 - t * t)) * 22; R(c, W / 2 - 30 + k, fy0 - 2 - h, 1, h + 2, k % 6 ? '#9aa8b0' : '#e8c23a'); } R(c, W / 2 - 2, fy0 - 28, 4, 6, '#e8c23a'); } }));
  m.warp(CITY.mercado.x + 5, CITY.mercado.y + CITY.mercado.h - 1, 'mercado', 'entry', { w: 2, label: _t('Mercado Central'), guard: () => Story.openGuard('mercado') });
  m.trig(54, 21, 5, 2, { here: true, label: _t('Foto: Mercado Central'), act: () => Story.photo('mercado'), cond: () => !G.S.photos.mercado });
  m.add(objBuilding(64, 15, 5, 6, { floors: 3, wall: '#d8c8a8', roof: '#8a7a60', roofType: 'flat', balcony: false, wins: 'arch', doors: [{ dx: 2, type: 'arch' }], shopWins: [], sign: { text: 'LONJA', bg: '#3a2a20', fg: '#f4e8c0' }, seed: 15, special: (c, W, H, fy0) => { for (let k = 0; k < W; k += 8) R(c, k, fy0 + 2, 4, 6, '#b8a888'); } }));
  m.trig(64, 21, 5, 1, { here: true, label: _t('Foto: Lonja de la Seda'), act: () => Story.photo('lonja'), cond: () => !G.S.photos.lonja });
  m.fill(50, 21, 19, 4, T.PLAZA, 2);
  m.add(objOrangeCart(58, 22)); m.trig(58, 22, 2, 1, { label: _t('Zumo-Wagen'), act: () => Story.shop('zumo') });
  /* ---- Hotel Kramer (Seitengasse westlich) ---- */
  cityBlock(m, 1, 14, 18, 4, r);
  cityBlock(m, 1, 19, 7, 4, r);
  m.add(objBuilding(CITY.hotel.x, CITY.hotel.y, CITY.hotel.w, CITY.hotel.h, { floors: 5, wall: '#efe3cc', roof: '#8a3b2a', roofType: 'gable', shutter: '#2a4a3a', balcony: true, doors: [{ dx: 3, type: 'glass' }], shopWins: [1, 5], goods: ['#2a4a3a', '#f4e8c0'], sign: { text: _t('HOTEL KRAMER'), bg: '#2a4a3a', fg: '#f4e8c0' }, seed: 3, special: (c, W, H, fy0) => { for (let k = 0; k < 4; k++) { const sx = W / 2 - 21 + k * 14, sy = H - 40; P(c, sx, sy - 1, '#ffd23d'); R(c, sx - 1, sy, 3, 1, '#ffd23d'); P(c, sx, sy + 1, '#ffd23d'); } for (const fx of [8, W - 10]) { R(c, fx, fy0 + 6, 1, 20, '#5a5e64'); R(c, fx + 1, fy0 + 7, 8, 2, '#c8a020'); R(c, fx + 1, fy0 + 9, 8, 2, '#c8352d'); R(c, fx + 1, fy0 + 11, 8, 2, '#c8a020'); } } }));
  m.warp(CITY.hotel.x + 3, CITY.hotel.y + CITY.hotel.h - 1, 'hotel_lobby', 'entry', { label: _t('Hotel Kramer') });
  for (const [x, y] of [[9, 31], [17, 31]]) m.add(objPlanter(x, y, '#e8402e'));
  m.add(objCar(2, 31, '#f0d040', 'h', { taxi: true })); m.trig(2, 31, 2, 1, { label: _t('Taxi'), act: () => Story.taxiCity() });
  m.add(objLamp(8, 33, 'old'));
  cityBlock(m, 1, 33, 18, 4, r);
  cityBlock(m, 1, 38, 18, 5, r);
  cityBlock(m, 9, 19, 10, 4, r);
  /* ---- Plaza del Ayuntamiento: Rathaus, Falla ---- */
  m.fill(22, 27, 26, 17, T.PLAZA, (x, y) => ((x * 3 + y) % 4 === 0 ? 1 : 0));
  m.add(objBuilding(22, 27, 26, 5, { floors: 4, wall: '#e8dcc6', roof: '#6a6a70', roofType: 'flat', balcony: true, wins: 'arch', doors: [{ dx: 12, type: 'arch' }, { dx: 13, type: 'arch' }], shopWins: [], sign: { text: 'AJUNTAMENT', bg: '#2a2a3a', fg: '#f4e8c0' }, seed: 21, special: (c, W, H, fy0) => { R(c, W / 2 - 10, fy0 - 26, 20, 26, '#d8ccb0'); R(c, W / 2 - 12, fy0 - 28, 24, 3, '#b8a888'); E(c, W / 2, fy0 - 20, 5, 5, '#f4f2ea'); for (const fx of [W / 2 - 30, W / 2 + 26]) { R(c, fx, fy0 - 14, 1, 14, '#5a5e64'); R(c, fx + 1, fy0 - 13, 7, 2, '#c8a020'); R(c, fx + 1, fy0 - 11, 7, 2, '#c8352d'); R(c, fx + 1, fy0 - 9, 7, 2, '#c8a020'); } } }));
  m.add(objFalla(33, 36));
  m.trig(32, 38, 5, 2, { here: true, label: _t('Foto: Falla'), act: () => Story.photo('falla'), cond: () => !G.S.photos.falla });
  m.trig(26, 33, 18, 3, { here: true, label: _t('Foto: Plaza del Ayuntamiento'), act: () => Story.photo('ayuntamiento'), cond: () => !G.S.photos.ayuntamiento });
  for (const [x, y] of [[24, 34], [45, 34], [24, 41], [45, 41]]) m.add(objPalm(x, y, 46));
  for (const [x, y] of [[28, 36], [41, 36]]) m.add(objLamp(x, y, 'old'));
  for (const [x, y] of [[27, 41], [40, 41]]) m.add(objBench(x, y, 0));
  m.add(objKiosk(42, 38, 'CHURROS', '#c8352d')); m.trig(42, 38, 2, 1, { label: _t('Churrería'), act: () => Story.shop('churros') });
  m.pedZones.push({ x: 22, y: 32, w: 26, h: 12, n: 9 }); m.birdSpots.push({ x: 24, y: 36, w: 8, h: 6, n: 7 });
  m.add(objSignpost(23, 32, _t('MASCLETÀ 14:00'), '#c8352d'));
  /* ---- Blöcke um den Mercado ---- */
  cityBlock(m, 50, 27, 19, 4, r, { allShop: false });
  cityBlock(m, 50, 32, 8, 5, r);
  m.add(objBuilding(59, 32, 10, 5, { floors: 3, wall: '#e8e4dc', roof: '#8a8e94', roofType: 'flat', balcony: false, doors: [{ dx: 4, type: 'glass' }], shopWins: [0, 1, 2, 3, 6, 7, 8, 9], goods: ['#2f5fb8', '#f4f0e6', '#e8c23a'], sign: { text: _t('MODA VALENCIA'), bg: '#2a2a3a', fg: '#ffffff' }, seed: 44, awning: { cols: [0, 1, 2, 3, 6, 7, 8, 9], col: '#2f5fb8' } }));
  m.trig(63, 36, 1, 1, { label: _t('Moda Valencia (Kleider)'), act: () => Story.shop('moda') });
  m.add(objBuilding(50, 38, 19, 5, { floors: 3, wall: '#f0b8a0', roof: '#b85a3a', roofType: 'gable', shutter: '#5a3a24', doors: [{ dx: 3, type: 'glass' }, { dx: 10, type: 'door' }, { dx: 15, type: 'glass' }], shopWins: [1, 2, 4, 5, 13, 14, 16, 17], goods: ['#3f8e4b', '#e8c23a', '#f4f0e6'], seed: 45, awning: { cols: [1, 2, 4, 5], col: '#3f8e4b' }, special: (c, W, H) => { R(c, 10, H - 34, 70, 9, '#1e5a2a'); pxText(c, 'SUPERMERCADO', 13, H - 32, '#ffffff'); R(c, 15 * 24 - 10, H - 34, 60, 9, '#2f6fb8'); pxText(c, 'FARMACIA', 15 * 24 - 2, H - 32, '#ffffff'); R(c, 15 * 24 + 20, H - 44, 14, 4, '#3f9a4b'); R(c, 15 * 24 + 25, H - 49, 4, 14, '#3f9a4b'); } }));
  m.trig(53, 42, 1, 1, { label: _t('Supermercado'), act: () => Story.shop('super') });
  m.trig(65, 42, 1, 1, { label: _t('Farmacia'), act: () => Story.shop('farmacia') });
  m.trig(60, 42, 1, 1, { label: _t('Estanco (Tabak)'), act: () => Story.shop('estanco') });
  /* ---- Colba-Viertel (Osten): Hochhaus, moderne Blöcke ---- */
  m.fill(72, 14, 10, 11, T.PLAZA, 1);
  cityBlock(m, 72, 14, 10, 4, r, { roofType: 'flat', wall: '#d8dce0', balcony: false });
  m.add(objTower(CITY.colba.x, CITY.colba.y, CITY.colba.w, CITY.colba.h, { floors: 11, sign: _t('EDIFICIO TURIA') }));
  m.trig(CITY.colba.x + 3, CITY.colba.y + CITY.colba.h, 2, 1, { label: _t('Haustür: Klingeln'), act: () => Story.bell() });
  m.add(objBellPanel(CITY.colba.x + 5, CITY.colba.y + CITY.colba.h - 1)); m.solid(CITY.colba.x + 5, CITY.colba.y + CITY.colba.h - 1, 1, 1, 1);
  m.trig(CITY.colba.x + 5, CITY.colba.y + CITY.colba.h - 1, 1, 1, { label: _t('Klingelbrett'), act: () => Story.bell() });
  m.trig(CITY.colba.x + 2, CITY.colba.y + CITY.colba.h + 1, 5, 2, { here: true, label: _t('Foto: Colba-Hochhaus'), act: () => Story.photo('colba'), cond: () => !G.S.photos.colba });
  m.add(objBikeStand(72, 29, 3)); m.trig(72, 29, 2, 1, { label: _t('Colba-E-Bikes'), act: () => Story.bikeRental('colba') });
  m.add(objScooter(78, 29, '#c8302a')); m.add(objScooter(80, 29, '#2f5fb8', true));
  for (const [x, y] of [[71, 30], [81, 30]]) m.add(objPalm(x, y, 44));
  m.add(objVending(76, 30)); m.trig(76, 30, 1, 1, { label: _t('Automat'), act: () => Story.shop('automat') });
  m.fill(72, 28, 10, 4, T.PLAZA, 1);
  cityBlock(m, 72, 33, 10, 4, r, { roofType: 'flat', wall: '#c8d0d8', balcony: false, solar: true });
  cityBlock(m, 72, 38, 10, 5, r, { roofType: 'flat' });
  /* ---- Museum (Nordosten) ---- */
  m.add(objBuilding(CITY.museum.x, CITY.museum.y, CITY.museum.w, CITY.museum.h, { floors: 3, wall: '#f0e8d8', roof: '#8a7a60', roofType: 'flat', balcony: false, wins: 'arch', doors: [{ dx: 4, type: 'arch' }, { dx: 5, type: 'arch' }], shopWins: [], sign: { text: _t('MUSEU DE BELLES ARTS'), bg: '#2a2a3a', fg: '#e8d8a0' }, seed: 31, special: (c, W, H, fy0) => { for (let k = 0; k < 6; k++) R(c, 10 + k * 40, fy0 + 4, 8, H - fy0 - 24, '#e8e0d0'); for (let k = 0; k < 60; k++) { const t = (k - 30) / 30; const h = Math.sqrt(Math.max(0, 1 - t * t)) * 16; R(c, W / 2 - 30 + k, fy0 - h, 1, h, k % 4 ? '#5aa0c8' : '#3a80a8'); } } }));
  m.warp(CITY.museum.x + 4, CITY.museum.y + CITY.museum.h - 1, 'museum', 'entry', { w: 2, label: _t('Museu de Belles Arts'), guard: () => Story.openGuard('museum') });
  m.fill(84, 19, 14, 6, T.PLAZA, 3);
  for (const [x, y] of [[85, 21], [96, 21]]) m.add(objCypress(x, y));
  m.add(objBench(89, 22, 0)); m.add(objBench(93, 22, 0));
  m.trig(87, 20, 6, 2, { here: true, label: _t('Foto: Museu de Belles Arts'), act: () => Story.photo('museum'), cond: () => !G.S.photos.museum });
  cityBlock(m, 84, 26, 14, 4, r);
  /* ---- Calle Colón: Jamonería, Bodega, Souvenirs ---- */
  cityBlock(m, 1, 46, 18, 5, r);
  m.add(objBuilding(CITY.jamon.x, CITY.jamon.y, CITY.jamon.w, CITY.jamon.h, { floors: 3, wall: '#e8c89a', roof: '#b85a3a', roofType: 'gable', shutter: '#6a3a1a', doors: [{ dx: 2, type: 'door', col: '#6a3a1a' }], shopWins: [0, 1, 3, 4], goods: ['#a83a30', '#f4e8d8', '#c85a4a'], sign: { text: 'JAMONERÍA', bg: '#5a1a10', fg: '#f8e8c8' }, seed: 52, special: (c, W, H) => { for (let k = 0; k < 4; k++) { const jx = 8 + k * 10 + (k > 1 ? 60 : 0); R(c, jx, H - 42, 2, 5, '#5a5048'); R(c, jx - 3, H - 37, 7, 12, '#a83a30'); R(c, jx - 2, H - 36, 5, 3, '#f4e8d8'); } } }));
  m.warp(CITY.jamon.x + 2, CITY.jamon.y + CITY.jamon.h - 1, 'jamon', 'entry', { label: _t('Jamonería Ramón'), guard: () => Story.openGuard('jamon') });
  m.add(objBuilding(CITY.bodega.x, CITY.bodega.y, CITY.bodega.w, CITY.bodega.h, { floors: 2, wall: '#c8b898', roof: '#8a6a4a', roofType: 'gable', balcony: false, doors: [{ dx: 2, type: 'arch' }], shopWins: [], sign: { text: 'BODEGA', bg: '#3a1a10', fg: '#f8e8c8' }, seed: 53, special: (c, W, H) => { for (const bx of [6, W - 20]) { R(c, bx, H - 24, 14, 18, '#8a5a32'); R(c, bx, H - 20, 14, 2, '#3a3a3e'); R(c, bx, H - 10, 14, 2, '#3a3a3e'); } } }));
  m.warp(CITY.bodega.x + 2, CITY.bodega.y + CITY.bodega.h - 1, 'bodega', 'entry', { label: _t('Bodega La Tinaja'), guard: () => Story.openGuard('bodega') });
  m.add(objBuilding(37, 46, 6, 4, { floors: 3, wall: '#f8e8c8', roof: '#b85a3a', roofType: 'gable', doors: [{ dx: 2, type: 'glass' }], shopWins: [0, 1, 3, 4, 5], goods: ['#e8c23a', '#c8352d', '#2f6fb8'], sign: { text: 'SOUVENIRS', bg: '#2f6fb8', fg: '#ffffff' }, seed: 54, awning: { cols: [0, 1, 3, 4, 5], col: '#e8c23a' } }));
  m.trig(39, 49, 1, 1, { label: _t('Souvenirs València'), act: () => Story.shop('souvenir') });
  m.add(objBuilding(43, 46, 5, 4, { floors: 3, wall: '#d8e0c0', roof: '#a86a4a', roofType: 'flat', doors: [{ dx: 2, type: 'glass' }], shopWins: [0, 4], goods: ['#2a9aa0', '#1e1e22'], sign: { text: _t('BICI RENT'), bg: '#2a9aa0', fg: '#ffffff' }, seed: 55 }));
  m.trig(45, 49, 1, 1, { label: _t('Bici Rent: E-Bike mieten'), act: () => Story.bikeRental('rent') });
  m.add(objBikeStand(43, 50, 3));
  cityBlock(m, 50, 46, 19, 5, r);
  cityBlock(m, 72, 46, 10, 5, r);
  m.add(objSignpost(21, 50, 'BANKOMAT', '#1e3a6a')); m.trig(21, 50, 1, 1, { label: _t('Bankomat'), act: () => Story.atm() });
  m.fill(21, 50, 1, 1, T.PAVE);
  /* ---- Süden: Estación del Norte, Kartbahn, Padel, Disco ---- */
  m.add(objBuilding(CITY.estacion.x, CITY.estacion.y, CITY.estacion.w, CITY.estacion.h, { floors: 3, wall: '#e8c89a', roof: '#8a9aa0', roofType: 'flat', balcony: false, wins: 'arch', doors: [{ dx: 6, type: 'arch' }, { dx: 7, type: 'arch' }], shopWins: [], sign: { text: _t('ESTACIÓ DEL NORD'), bg: '#2a2a3a', fg: '#ff8c1a' }, seed: 61, special: (c, W, H, fy0) => { for (let k = 0; k < 10; k++) { E(c, 14 + k * 32, fy0 + 10, 4, 4, '#ff8c1a'); P(c, 14 + k * 32, fy0 + 5, '#3f8e4b'); } R(c, W / 2 - 16, fy0 - 10, 32, 10, '#d8ccb0'); E(c, W / 2, fy0 - 5, 4, 4, '#f4f2ea'); } }));
  m.trig(34, 60, 6, 2, { here: true, label: _t('Foto: Estación del Norte'), act: () => Story.photo('estacion'), cond: () => !G.S.photos.estacion });
  m.trig(36, 59, 2, 1, { label: _t('Bahnhof: Fahrkartenschalter'), act: () => Story.station() });
  m.fill(22, 54, 26, 14, T.PLAZA, 0);
  for (const [x, y] of [[23, 62], [46, 62]]) m.add(objPalm(x, y, 44));
  m.add(objCar(24, 64, '#f0d040', 'h', { taxi: true })); m.trig(24, 64, 2, 1, { label: _t('Taxi'), act: () => Story.taxiCity() });
  m.add(objCar(27, 64, '#f0d040', 'h', { taxi: true }));
  m.pedZones.push({ x: 22, y: 60, w: 26, h: 8, n: 6 });
  cityBlock(m, 1, 54, 18, 4, r);
  m.fill(1, 59, 18, 9, T.GRAVEL);
  m.fill(CITY.kart.x, CITY.kart.y, CITY.kart.w, CITY.kart.h, T.TRACK, (x, y) => ((y === CITY.kart.y + 3 && x > CITY.kart.x + 2 && x < CITY.kart.x + 6) ? 1 : 0));
  m.fill(CITY.kart.x + 3, CITY.kart.y + 2, CITY.kart.w - 6, CITY.kart.h - 4, T.GRASS, 2);
  m.add(objKartSign(8, 59)); m.trig(8, 60, 3, 1, { label: _t('Kart Valencia: Rezeption'), act: () => Story.kart() });
  m.npcDefs.push({ id: 'nico', name: _t('Nico (Kart-Marshal)'), x: 11 * TS + 12, y: 61 * TS + 20, dir: 0, look: npcLook(401, { top: 9, topCol: 0, pants: 2, pantsCol: 2, hat: 1, hatCol: 0, beard: 1 }), talk: () => Story.kart(), keepDir: true, bubbleRand: ['car', 'dots'] });
  for (const [x, y] of [[20, 55], [20, 62]]) { }
  m.add(objPadelCourt(CITY.padel.x, CITY.padel.y));
  m.fill(50, 54, 19, 14, T.GRASS, 3);
  m.trig(CITY.padel.x - 1, CITY.padel.y + 1, 1, 2, { label: _t('Padel-Court'), act: () => Story.padel() });
  m.npcDefs.push({ id: 'sergio', name: _t('Sergio (Padel-Coach)'), x: 58 * TS + 12, y: 63 * TS + 20, dir: 2, look: npcLook(402, { top: 2, topCol: 14, pants: 3, pantsCol: 8, shoes: 5, hat: 1, hatCol: 6, glasses: 3 }), talk: () => Story.padel(), keepDir: true, bubbleRand: ['!'] });
  for (const [x, y] of [[52, 56], [67, 56], [52, 66], [67, 66]]) m.add(objPalm(x, y, 42));
  m.add(objBuilding(CITY.disco.x, CITY.disco.y, CITY.disco.w, CITY.disco.h, { floors: 2, wall: '#1a1a2a', roof: '#2a2a3a', roofType: 'flat', balcony: false, trim: '#3a3a4a', doors: [{ dx: 3, type: 'door', col: '#1e1e24', lit: true }], shopWins: [], sign: { text: _t('MARINA BEACH CLUB'), bg: '#101028', fg: '#7ad0ff', lit: true }, seed: 71, special: (c, W, H) => { for (let k = 0; k < 10; k++) P(c, 10 + k * 15, H - 40 + (k % 3) * 4, ['#ff3ad0', '#3ae0ff', '#ffe03a'][k % 3]); }, specialNight: (c, W, H) => { for (let k = 0; k < 10; k++) R(c, 9 + k * 15, H - 41 + (k % 3) * 4, 3, 3, ['#ff3ad0', '#3ae0ff', '#ffe03a'][k % 3]); } }));
  m.warp(CITY.disco.x + 3, CITY.disco.y + CITY.disco.h - 1, 'disco', 'entry', { label: _t('Marina Beach Club'), guard: () => Story.openGuard('disco') });
  m.npcDefs.push({ id: 'bouncer', name: _t('Türsteher Manolo'), x: (CITY.disco.x + 4) * TS + 12, y: (CITY.disco.y + 4) * TS + 20, dir: 0, look: npcLook(403, { build: 3, top: 7, topCol: 17, pants: 5, pantsCol: 2, glasses: 3, hair: 1, hairCol: 0, beard: 6 }), talk: () => Story.bouncer(), keepDir: true, cond: () => hourOf(G.S.time) >= 22 || hourOf(G.S.time) < 5 });
  m.fill(72, 54, 10, 14, T.PLAZA, 1);
  for (const [x, y] of [[73, 65], [80, 65]]) m.add(objPalm(x, y, 40));
  cityBlock(m, 1, 70, 18, 5, r); cityBlock(m, 22, 70, 20, 5, r, { roofType: 'flat' });
  /* ---- Ciudad de las Artes (Süden, im Flussbett) ---- */
  m.fill(44, 70, 36, 14, T.PLAZA, 3);
  m.fill(46, 76, 32, 6, T.WATER, 1);
  m.add(objHemisferic(52, 71, 10));
  m.trig(50, 75, 14, 1, { here: true, label: _t('Foto: Ciudad de las Artes'), act: () => Story.photo('ciudad'), cond: () => !G.S.photos.ciudad });
  for (const [x, y] of [[45, 72], [78, 72]]) m.add(objPalm(x, y, 46));
  m.add(objBench(64, 74, 0)); m.add(objBench(70, 74, 0));
  m.pedZones.push({ x: 44, y: 70, w: 36, h: 6, n: 5 });
  cityBlock(m, 1, 76, 40, 6, r);
  /* ---- Strand & Marina (Osten) ---- */
  m.fill(84, 30, 2, 54, T.PAVE, 2); m.fill(84, 30, 1, 54, T.BIKE, 0);
  m.fill(86, 30, 9, 54, T.SAND, (x, y) => ((x + y) % 5 === 0 ? 1 : 0));
  m.fill(94, 30, 1, 54, T.WETSAND);
  m.fill(95, 30, 5, 54, T.WATER, (x, y) => (x >= 98 ? 2 : x >= 96 ? 1 : 0));
  m.fill(84, 31, 16, 1, T.PAVE, 2);
  m.sunnyZone = { x: 86, y: 30, w: 14, h: 54 };
  for (let y = 33; y < 60; y += 7) { m.add(objSunbed(88, y, ['#2f8fd8', '#ff8c1a', '#3f8e4b'][(y / 7) % 3 | 0])); m.add(objSunUmbrella(89, y - 1, ['#2f8fd8', '#ff8c1a', '#3f8e4b'][(y / 7) % 3 | 0])); }
  for (let y = 34; y < 70; y += 9) m.add(objPalm(86, y, 48));
  m.add(objLifeguard(90, 40)); m.trig(90, 42, 2, 1, { label: _t('Rettungsschwimmer Jordi'), act: () => Story.lifeguard() });
  m.add(objGoal(92, 48)); m.trig(91, 48, 1, 2, { label: _t('Strandfussball'), act: () => Story.soccer() });
  m.add(objPaellaStand(88, 60)); m.trig(88, 61, 2, 1, { label: _t('Paella-Kochwettbewerb'), act: () => Story.paellaContest() });
  m.add(objKiosk(88, 54, 'CHIRINGUITO', '#2f8fd8')); m.trig(88, 54, 2, 1, { label: _t('Chiringuito'), act: () => Story.shop('chiringuito') });
  m.trig(90, 34, 4, 3, { here: true, label: _t('Foto: Playa de la Malvarrosa'), act: () => Story.photo('malvarrosa'), cond: () => !G.S.photos.malvarrosa });
  m.trig(92, 36, 2, 10, { label: _t('Ins Meer: Surfen / Baden'), act: () => Story.surf(), here: true });
  m.pedZones.push({ x: 87, y: 33, w: 7, h: 30, n: 7, beach: true }); m.birdSpots.push({ x: 88, y: 44, w: 6, h: 10, n: 6, kind: 'gull' });
  m.trig(87, 46, 2, 4, { here: true, label: _t('Sonnenliege: Chillen'), act: () => Story.beachChill() });
  /* Marina */
  m.fill(84, 66, 16, 18, T.PLAZA, 2);
  m.fill(90, 70, 10, 14, T.WATER, 1);
  m.fill(88, 72, 2, 10, T.DECK); m.fill(90, 76, 8, 1, T.DECK);
  m.add(objSailboat(91, 73, '#f4f0e6')); m.add(objSailboat(95, 73, '#e8e4dc', '#f8f0e0')); m.add(objSailboat(92, 78, '#d8d4cc'));
  for (const [x, y] of [[93, 71], [97, 79]]) m.add(objBuoy(x, y));
  m.trig(89, 72, 1, 4, { label: _t('Segelschule: Segeltörn'), act: () => Story.sail(), here: true });
  m.npcDefs.push({ id: 'marina', name: _t('Marina (Segellehrerin)'), x: 88 * TS + 12, y: 74 * TS + 20, dir: 2, look: npcLook(404, { fem: 1, hair: 12, hairCol: 5, top: 2, topCol: 14, pants: 3, pantsCol: 8, shoes: 4, glasses: 3, hat: 1, hatCol: 2 }), talk: () => Story.sail(), keepDir: true, bubbleRand: ['wave'] });
  m.add(objBuilding(84, 66, 5, 3, { floors: 2, wall: '#e8e4dc', roof: '#2f5fb8', roofType: 'flat', balcony: false, doors: [{ dx: 2, type: 'glass' }], shopWins: [0, 4], goods: ['#2f5fb8', '#f4f0e6'], sign: { text: _t('VELES E VENTS'), bg: '#1a3a6a', fg: '#ffffff' }, seed: 81 }));
  m.trig(86, 68, 1, 1, { label: _t('Veles e Vents: Bar'), act: () => Story.shop('veles') });
  m.trig(86, 70, 4, 2, { here: true, label: _t('Foto: La Marina'), act: () => Story.photo('marina'), cond: () => !G.S.photos.marina });
  for (const [x, y] of [[85, 72], [85, 80]]) m.add(objLamp(x, y, 'modern'));
  m.pedZones.push({ x: 84, y: 66, w: 6, h: 16, n: 4 });
  /* ---- Autos auf den Avenidas ---- */
  const carCols = ['#2f5fb8', '#c8352d', '#e8e4dc', '#2a2a2e', '#3f8e4b', '#f0d040'];
  for (let i = 0; i < 6; i++) m.vehicles.push(cityCar(m, [12, 25, 44, 52, 68][i % 5], i % 2 ? 1 : -1, carCols[i], i * 300));
  for (let i = 0; i < 3; i++) m.vehicles.push(cityCarV(m, [20, 48, 70][i], i % 2 ? 1 : -1, carCols[(i + 3) % 6], i * 400));
  /* ---- Laternen entlang der Strassen ---- */
  for (let x = 4; x < 82; x += 12) { m.add(objLamp(x, 24, 'modern')); m.add(objLamp(x + 6, 43, 'modern')); m.add(objLamp(x, 51, 'modern')); }
  for (let y = 15; y < 66; y += 10) { m.add(objLamp(19, y, 'modern')); m.add(objLamp(69, y, 'modern')); }
  m.pedZones.push({ x: 0, y: 14, w: 20, h: 10, n: 4 }); m.pedZones.push({ x: 50, y: 46, w: 32, h: 5, n: 5 }); m.pedZones.push({ x: 72, y: 28, w: 10, h: 4, n: 3 });
  m.spawn('start', 12, 32, 3);
  m.spawn('hotel', 13, 32, 0);
  m.spawn('bar', 24, 19, 0);
  m.spawn('colba', 75, 29, 0);
  m.spawn('mercado', 55, 22, 0);
  m.spawn('museum', 88, 20, 0);
  m.spawn('jamon', 26, 51, 0);
  m.spawn('bodega', 33, 51, 0);
  m.spawn('disco', 75, 65, 0);
  m.spawn('taxi', 13, 32, 0);
  m.spawn('airport', 36, 61, 0);
  m.groundAnim = waterAnim;
  m.musicFn = () => (isNight() ? 'lobby' : 'city');
  m.onEnter = () => { };
  return m;
};
function waterAnim(c, cx, cy, t) {
  const m = G.map;
  const x0 = Math.max(0, Math.floor(cx / TS)), x1 = Math.min(m.w - 1, Math.floor((cx + View.w) / TS));
  const y0 = Math.max(0, Math.floor(cy / TS)), y1 = Math.min(m.h - 1, Math.floor((cy + View.h) / TS));
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
    if (m.at(x, y) !== T.WATER) continue;
    for (let k = 0; k < 3; k++) {
      const ph = (t * 0.6 + hash(x, y, k)) % 1;
      const yy = y * TS + 4 + Math.floor(hash(x, y, k + 9) * 18);
      const xx = x * TS + Math.floor(((hash(x, y, k + 4) * TS) + ph * 14) % 20);
      R(c, xx - cx, yy - cy, 4, 1, `rgba(200,230,245,${0.5 * Math.sin(ph * Math.PI)})`);
    }
  }
}
/* Fahrendes Auto auf einer waagrechten Strasse (Spur y, Richtung dir) */
function cityCar(m, laneY, dir, col, off) {
  const [cv, x] = canvas(48, 36);
  const o = objCar(0, 0, col, 'h'); o.paint(x, 48, 36, o);
  const v = { x: off % (m.w * TS), y: (laneY + (dir > 0 ? 1 : 0)) * TS + 20, dir, sp: rnd(70, 110), cv, sortY() { return this.y; }, update(dt) {
    this.x += this.sp * dt * this.dir;
    if (this.dir > 0 && this.x > 84 * TS) this.x = -50; if (this.dir < 0 && this.x < -50) this.x = 84 * TS;
    const p = G.player; if (p && !p.hidden && Math.abs(p.y - this.y) < 14 && Math.abs(p.x - this.x) < 30 && !G.busy && !G.S.flags.honk) { G.S.flags.honk = 1; Snd.sfx('horn'); setTimeout(() => { G.S.flags.honk = 0; }, 2000); }
  }, draw(c, cx, cy) { const px = Math.round(this.x - cx) - 24, py = Math.round(this.y - cy) - 36; if (this.dir < 0) { c.save(); c.translate(px + 48, py); c.scale(-1, 1); c.drawImage(this.cv, 0, 0); c.restore(); } else c.drawImage(this.cv, px, py); } };
  return v;
}
function cityCarV(m, laneX, dir, col, off) {
  const [cv, x] = canvas(24, 56);
  const o = objCar(0, 0, col, 'v'); o.paint(x, 24, 56, o);
  return { x: (laneX + (dir > 0 ? 0 : 1)) * TS + 12, y: off % (m.h * TS), dir, sp: rnd(60, 90), cv, sortY() { return this.y; }, update(dt) { this.y += this.sp * dt * this.dir; if (this.dir > 0 && this.y > 70 * TS) this.y = 12 * TS; if (this.dir < 0 && this.y < 12 * TS) this.y = 70 * TS; }, draw(c, cx, cy) { c.drawImage(this.cv, Math.round(this.x - cx) - 12, Math.round(this.y - cy) - 48); } };
}
