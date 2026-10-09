/* ============ Szenen: kurze animierte Pixelbilder (240×144) im Überblend-Overlay ============
   Scene.play(kind, { text, ms, keep, ... }) – mit keep: true bleibt das Overlay danach stehen (Kartenwechsel). */
const SCENE_W = 240, SCENE_H = 144;
function sceneSprite(c, sheet, pose, dir, x, y, s = 1, alpha = 1) {
  c.globalAlpha = alpha;
  c.drawImage(sheet, POSE_I[pose] * SPR_W, dir * SPR_H, SPR_W, SPR_H, Math.round(x), Math.round(y), SPR_W * s, SPR_H * s);
  c.globalAlpha = 1;
}
function inRect(c, x, y, w, h, fn) { c.save(); c.beginPath(); c.rect(x, y, w, h); c.clip(); fn(); c.restore(); }
function sceneSky(c, night, p = 0, dusk = false) {
  const top = night ? '#121a3a' : dusk ? mix('#2a5fa8', '#e86a4a', p) : '#5aa8e0', bot = night ? '#2a3660' : dusk ? mix('#ffb347', '#ffd9a0', p) : '#cfe6f2';
  for (let y = 0; y < 90; y++) R(c, 0, y, SCENE_W, 1, mix(top, bot, y / 90));
  if (night) { for (let i = 0; i < 26; i++) P(c, Math.floor(hash(i, 3) * SCENE_W), Math.floor(hash(i, 7) * 60), hash(i, 9) > 0.5 ? '#ffffff' : '#c8d0ff'); E(c, 200, 20, 10, 10, '#f4f0d8'); E(c, 206, 17, 9, 9, top); }
  else if (!dusk) { E(c, 200, 22, 12, 12, '#fff2c0'); for (let i = 0; i < 4; i++) { E(c, 30 + i * 60, 24 + (i % 2) * 12, 18, 6, 'rgba(255,255,255,0.85)'); E(c, 42 + i * 60, 20 + (i % 2) * 12, 12, 5, 'rgba(255,255,255,0.9)'); } }
  else E(c, 120, 70, 16, 16, '#fff2c0');
}
function sceneSea(c, y0, t) { R(c, 0, y0, SCENE_W, SCENE_H - y0, '#1f7fb8'); for (let k = 0; k < 30; k++) { const x = (k * 37 + t * 20) % SCENE_W, y = y0 + 4 + (k * 13) % (SCENE_H - y0 - 6); R(c, x, y, 8, 1, 'rgba(255,255,255,0.35)'); } }
function sceneCity(c, y0, t, off = 0) {
  for (let i = 0; i < 14; i++) { const w = 14 + Math.floor(hash(i, 1) * 14), h = 26 + Math.floor(hash(i, 2) * 30), x = ((i * 22 - off) % (SCENE_W + 40) + SCENE_W + 40) % (SCENE_W + 40) - 20; R(c, x, y0 - h, w, h, mix('#e8c9a0', '#c8a080', hash(i, 4))); for (let wy = y0 - h + 4; wy < y0 - 4; wy += 7) for (let wx = x + 2; wx < x + w - 2; wx += 6) R(c, wx, wy, 3, 4, '#5a6a7a'); R(c, x, y0 - h, w, 2, '#b85a3a'); }
  for (let i = 0; i < 5; i++) { const x = ((i * 60 + 20 - off * 1.3) % (SCENE_W + 40) + SCENE_W + 40) % (SCENE_W + 40) - 20; R(c, x, y0 - 22, 3, 22, '#8a6a44'); for (let k = 0; k < 6; k++) line(c, x + 1, y0 - 22, x + 1 + Math.cos(k * 1.1 - 0.5) * 12, y0 - 22 + Math.sin(k * 1.1 - 0.5) * 7 + 3, '#3f8a3a'); }
}
/* Fassaden der Orte für die Türszenen */
const FACADES = {
  hotel_lobby: { name: _t('HOTEL KRAMER'), wall: '#efe3cc', door: 'glass', sign: ['#2a4a3a', '#f4e8c0'], inner: '#ffe6a8', stars: 4, flags: true, plants: true },
  bar: { name: _t('BAR PEPITA'), wall: '#f4d8a0', door: 'wood', doorCol: '#5a3a24', sign: ['#2a1a10', '#ffb53d'], inner: '#ffc870', azulejos: true, neon: 'orange' },
  jamon: { name: _t('JAMONERÍA RAMÓN'), wall: '#e8c89a', door: 'wood', doorCol: '#6a3a1a', sign: ['#5a1a10', '#f8e8c8'], inner: '#ffb860', jamones: true },
  bodega: { name: _t('BODEGA LA TINAJA'), wall: '#c8b898', door: 'wood', doorCol: '#4a2a14', sign: ['#3a1a10', '#f8e8c8'], inner: '#ffb860', barrels: true, lantern: true },
  disco: { name: _t('MARINA BEACH CLUB'), arch: false, wall: '#1a1a2a', door: 'metal', sign: ['#101028', '#7ad0ff'], inner: 'strobe', rope: true, bass: true, bouncer: true },
  museum: { name: _t('MUSEU DE BELLES ARTS'), wall: '#f0e8d8', door: 'arch', sign: ['#2a2a3a', '#e8d8a0'], inner: '#fff4d0', columns: true },
  mercado: { name: _t('MERCADO CENTRAL'), wall: '#b8603a', door: 'arch', sign: ['#2a1a10', '#f8e8c8'], inner: '#ffe8b0', azulejos: true, dome: true },
  colba_entry: { name: _t('C.B. SOLUCIONES'), wall: '#c8ccd0', door: 'glass', sign: ['#1e2a3a', '#7ad0d8'], inner: '#e8f4f8', tower: true },
  airport: { name: 'AEROPUERTO', wall: '#d8dce0', door: 'glass', sign: ['#1a3a7a', '#ffffff'], inner: '#eef4fa', station: true },
  kart: { name: _t('KART VALENCIA'), wall: '#3a3c42', door: 'metal', sign: ['#1a1a1e', '#ffffff'], inner: '#ffd27a', checker: true },
};
function facadeFor(id) { return FACADES[id] || { name: '', wall: '#e8c9a0', door: 'wood', sign: ['#3a2a20', '#f4e8c0'], inner: '#f6d890' }; }
function transitionFor(from, to, spawn, opts = {}) {
  if (opts.kind === 'thrown') return { kind: 'thrown', style: facadeFor(from), ms: 1500 };
  if (opts.kind === 'closing') return { kind: 'door', exit: true, closing: true, style: facadeFor(from), ms: 1400 };
  const hotel = ['hotel_lobby', 'hotel_floor'];
  if (hotel.includes(from) && hotel.includes(to)) return spawn === 'lift' ? { kind: 'lift', up: to === 'hotel_floor', floor: '4', ms: 1900 } : { kind: 'stairs', up: to === 'hotel_floor', ms: 1300 };
  if (from === 'hotel_floor' && to === 'hotel_room') return { kind: 'roomdoor', exit: false, ms: 1150 };
  if (from === 'hotel_room' && to === 'hotel_floor') return { kind: 'roomdoor', exit: true, ms: 1000 };
  if ((from === 'colba_entry' && to === 'colba') || (from === 'colba' && to === 'colba_entry')) return spawn === 'stairs' || opts.stairs ? { kind: 'stairs', up: to === 'colba', ms: 1300 } : { kind: 'lift', up: to === 'colba', floor: '1', ms: 1900 };
  if (to === 'danny_house' || from === 'danny_house') return null;
  const toM = getMap(to), fromM = getMap(from);
  const exit = !toM.indoor;
  const venue = exit ? from : to;
  if (!toM.indoor && !fromM.indoor) return null;
  return { kind: 'door', exit, style: facadeFor(venue), ms: 950 };
}
function drawFacade(c, t, st, open, lightsOff) {
  const S = st.style || facadeFor(''), night = st.night;
  const dx = 96, dy = 46, dw = 48, dh = 84;
  const W = SCENE_W, H = SCENE_H;
  const inner = S.inner === 'strobe' ? ['#ff3ad0', '#3ae0ff', '#ffe03a', '#7aff6a'][Math.floor(t * 6) % 4] : S.inner || '#f6d890';
  const wall = S.wall || '#e8c9a0';
  R(c, 0, 0, W, H, night ? shade(wall, -0.55) : wall);
  for (let i = 0; i < 90; i++) P(c, (i * 37) % W, (i * 23) % 130, night ? shade(wall, -0.62) : shade(wall, -0.06));
  if (S.tower) { for (let f = 0; f < 5; f++) for (let x = 6; x < W; x += 20) { if (x > 80 && x < 150) continue; R(c, x, 6 + f * 16, 12, 10, night ? (hash(f, x) > 0.5 ? '#ffe9b0' : '#2a3a4a') : '#4a6a8a'); R(c, x, 6 + f * 16, 12, 1, '#a8c8e0'); } R(c, 0, 0, W, 4, '#8a8e94'); R(c, 152, 60, 14, 30, '#d8c890'); for (let k = 0; k < 6; k++) { P(c, 155, 64 + k * 4, '#5a5048'); R(c, 158, 64 + k * 4, 5, 1, '#8a8070'); } }
  else if (S.station) { for (let x = 6; x < W; x += 34) { if (x > 60 && x < 170) continue; R(c, x, 20, 28, 100, '#5a646c'); R(c, x + 3, 23, 22, 94, night ? '#ffe8b0' : '#b8d4e8'); } E(c, 120, 14, 10, 10, '#f4f4f0'); const hm = hourOf(G.S.time) % 12, mm = G.S.time % 60; line(c, 120, 14, 120 + Math.sin(hm / 12 * 6.283) * 6, 14 - Math.cos(hm / 12 * 6.283) * 6, '#1a1a1e'); line(c, 120, 14, 120 + Math.sin(mm / 60 * 6.283) * 9, 14 - Math.cos(mm / 60 * 6.283) * 9, '#1a1a1e'); }
  else if (S.checker) { for (let x = 0; x < W; x += 12) for (let y = 0; y < 16; y += 8) R(c, x + (y / 8) * 6, y, 6, 8, ((x / 12 + y / 8) % 2) ? '#ffffff' : '#1a1a1e'); }
  else if (S.columns) { for (const cx of [30, 60, 180, 210]) { R(c, cx, 30, 12, 100, night ? '#8a8070' : '#e8e0d0'); R(c, cx - 2, 28, 16, 4, '#c8bca8'); R(c, cx - 2, 126, 16, 4, '#c8bca8'); } for (let k = 0; k < 12; k++) R(c, 100 + k * 2, 20 - k, 40 - k * 4 + 2, 1, '#c8bca8'); }
  else for (const wx of [22, 190]) { R(c, wx, 36, 28, 40, '#3a4a5a'); R(c, wx + 2, 38, 24, 36, lightsOff ? '#1a2030' : night ? '#ffd27a' : '#9fd0f0'); R(c, wx + 13, 38, 2, 36, '#3a4a5a'); R(c, wx - 3, 78, 34, 4, '#5a5048'); for (let k = 0; k < 7; k++) { P(c, wx + k * 5, 76, k % 2 ? '#e8402e' : '#f2c23a'); P(c, wx + 1 + k * 5, 75, '#3f8e4b'); } for (let k = -3; k < 32; k += 3) R(c, wx + k, 70, 1, 8, '#3a3430'); }
  if (S.azulejos && !S.dome) for (let k = 0; k < 6; k++) for (let j = 0; j < 2; j++) { const ax = 20 + k * 10, ay = 100 + j * 10; R(c, ax, ay, 8, 8, ((k + j) % 2) ? '#2f6fb8' : '#f4f0e6'); P(c, ax + 3, ay + 3, '#e8c23a'); }
  if (S.dome) { for (let k = 0; k < 40; k++) R(c, 80 + k, 30 - Math.sqrt(Math.max(0, 1 - ((k - 20) / 20) ** 2)) * 26, 1, Math.sqrt(Math.max(0, 1 - ((k - 20) / 20) ** 2)) * 26, k % 5 ? '#8a9aa0' : '#e8c23a'); for (let k = 0; k < 40; k++) R(c, 120 + k, 30 - Math.sqrt(Math.max(0, 1 - ((k - 20) / 20) ** 2)) * 26, 1, Math.sqrt(Math.max(0, 1 - ((k - 20) / 20) ** 2)) * 26, k % 5 ? '#8a9aa0' : '#e8c23a'); R(c, 0, 30, W, 3, '#8a4428'); }
  R(c, 0, 130, W, 14, night ? '#2a2a30' : '#8a8a90'); R(c, 0, 130, W, 1, night ? '#44444c' : '#b0b0b8');
  R(c, dx - 5, dy - 5, dw + 10, dh + 5, S.door === 'glass' ? '#5a5e64' : S.door === 'arch' ? '#8a7a60' : '#5a3a24');
  if (S.door === 'arch') { c.fillStyle = '#8a7a60'; c.beginPath(); c.moveTo(dx - 5, dy); c.quadraticCurveTo(dx + dw / 2, dy - 28, dx + dw + 5, dy); c.fill(); c.fillStyle = lightsOff ? '#1a1418' : inner; c.beginPath(); c.moveTo(dx, dy + 2); c.quadraticCurveTo(dx + dw / 2, dy - 20, dx + dw, dy + 2); c.lineTo(dx + dw, dy + dh); c.lineTo(dx, dy + dh); c.fill(); }
  R(c, dx, dy, dw, dh, lightsOff ? '#1a1418' : inner);
  if (!lightsOff) R(c, dx + 6, dy + 10, dw - 12, dh - 20, mix(inner, '#ffffff', 0.25));
  const type = S.door || 'wood';
  if (type === 'glass') { const half = dw / 2, sl = Math.round(half * open * 0.95); for (const [x0, w] of [[dx, half - sl], [dx + half + sl, half - sl]]) if (w > 0) { R(c, x0, dy, w, dh, '#7a8088'); R(c, x0 + 1, dy + 1, Math.max(0, w - 2), dh - 2, 'rgba(190,225,245,0.55)'); if (w > 5) R(c, x0 + (x0 === dx ? w - 4 : 2), dy + 34, 2, 18, '#c9ccd2'); } }
  else if (type === 'arch') { const pw = Math.round(dw * (1 - open * 0.92)); if (pw > 0) { R(c, dx, dy, pw, dh, '#4a3020'); for (let k = 6; k < dh; k += 12) R(c, dx + 2, dy + k, Math.max(0, pw - 4), 1, '#6a4a2a'); } }
  else { const pw = Math.round(dw * (1 - open * 0.92)); const col = type === 'metal' ? '#1e1e24' : (S.doorCol || '#7a4a28'); if (pw > 0) { R(c, dx, dy, pw, dh, col); if (type === 'metal') { for (let k = 6; k < dh; k += 10) { P(c, dx + 3, dy + k, '#5a5e64'); if (pw > 6) P(c, dx + pw - 4, dy + k, '#5a5e64'); } if (pw > 18) { E(c, dx + pw / 2, dy + 22, 7, 7, '#3a3c40'); E(c, dx + pw / 2, dy + 22, 5, 5, inner); } } else if (pw > 8) { R(c, dx + 4, dy + 7, Math.max(0, pw - 8), 28, shade(col, 0.12)); R(c, dx + 4, dy + 45, Math.max(0, pw - 8), 30, shade(col, 0.12)); } if (pw > 12) R(c, dx + pw - 8, dy + 44, 3, 4, '#e8c84a'); R(c, dx + pw - 1, dy, 1, dh, shade(col, -0.3)); } }
  if (open > 0 && !lightsOff) { c.fillStyle = `rgba(${S.inner === 'strobe' ? '180,120,255' : '255,220,140'},${0.28 * open})`; c.beginPath(); c.moveTo(dx, dy + dh); c.lineTo(dx + dw, dy + dh); c.lineTo(dx + dw + 34, H); c.lineTo(dx - 34, H); c.closePath(); c.fill(); }
  let name = S.name || ''; while (name.length > 3 && pxTextW(name, 2) > 200) name = name.slice(0, -1);
  if (name) { const w = pxTextW(name, 2) + 12, sy = S.dome ? 36 : dy - 24; R(c, 120 - w / 2, sy, w, 16, S.sign[0]); R(c, 120 - w / 2, sy, w, 1, shade(S.sign[0], 0.3)); const glow = night && !lightsOff; if (glow) E(c, 120, sy + 8, w / 2 + 8, 12, `rgba(${S.neon ? '255,140,26' : S.bass ? '120,200,255' : '255,200,120'},${0.12 + Math.sin(t * 5) * 0.04})`); pxText(c, name, 120 - pxTextW(name, 2) / 2, sy + 3, lightsOff ? shade(S.sign[1], -0.6) : S.sign[1], 2); }
  if (S.stars) for (let k = 0; k < S.stars; k++) { const sx = 120 - (S.stars - 1) * 7 + k * 14, sy = dy - 36; P(c, sx, sy - 1, '#ffd23d'); R(c, sx - 1, sy, 3, 1, '#ffd23d'); P(c, sx, sy + 1, '#ffd23d'); }
  if (S.flags) for (const fx of [54, 186]) { R(c, fx, 6, 1, 38, '#5a5e64'); const wv = Math.sin(t * 6 + fx) * 2; R(c, fx + 1, 8 + wv * 0.3, 18, 3, '#c8a020'); R(c, fx + 1, 11 + wv * 0.3, 18, 3, '#c8352d'); R(c, fx + 1, 14 + wv * 0.3, 18, 3, '#c8a020'); R(c, fx + 1, 17 + wv * 0.3, 18, 2, '#2f5fb8'); }
  if (S.plants) for (const px of [dx - 22, dx + dw + 8]) { R(c, px, 116, 12, 12, '#8a5a32'); for (let k = 0; k < 6; k++) R(c, px + 6 - k, 114 - k * 5, k * 2 + 1, 5, '#2f5a30'); }
  if (S.lantern) { line(c, dx + dw + 8, dy - 8, dx + dw + 20, dy - 8, '#2a2a2e'); R(c, dx + dw + 16, dy - 7, 8, 12, '#2a2a2e'); R(c, dx + dw + 17, dy - 6, 6, 10, lightsOff ? '#3a3a3e' : '#ffd27a'); }
  if (S.jamones) for (let k = 0; k < 4; k++) { const jx = 18 + k * 14 + (k > 1 ? 150 : 0); R(c, jx, 24, 2, 8, '#5a5048'); R(c, jx - 3, 32, 8, 20, '#a83a30'); R(c, jx - 2, 33, 6, 5, '#f4e8d8'); }
  if (S.barrels) for (const bx of [16, 196]) { R(c, bx, 96, 26, 32, '#8a5a32'); R(c, bx, 102, 26, 3, '#3a3a3e'); R(c, bx, 118, 26, 3, '#3a3a3e'); }
  if (S.neon && !lightsOff) { const on = Math.floor(t * 7) % 9 !== 0; const col = on ? '#ff8c1a' : '#5a3a10'; E(c, 40, 100, 9, 9, col); E(c, 40, 100, 5, 5, on ? '#ffd27a' : '#5a5040'); R(c, 39, 88, 2, 5, '#3f8e4b'); }
  if (S.bass && !lightsOff) { c.fillStyle = `rgba(140,80,255,${0.08 + Math.abs(Math.sin(t * 8)) * 0.1})`; c.fillRect(0, 0, W, H); }
  if (S.rope) { for (const px of [36, 70]) { R(c, px, 110, 3, 20, '#c9a227'); E(c, px + 1, 109, 3, 3, '#c9a227'); } c.strokeStyle = '#a8203a'; c.lineWidth = 3; c.beginPath(); c.moveTo(39, 112); c.quadraticCurveTo(54, 122, 70, 112); c.stroke(); }
  if (S.bouncer) { R(c, 186, 76, 24, 54, '#121216'); E(c, 198, 70, 8, 9, '#c99a6c'); R(c, 190, 66, 16, 3, '#121216'); R(c, 180, 88, 6, 24, '#121216'); R(c, 210, 88, 6, 24, '#121216'); }
  return { dx, dy, dw, dh };
}
const SCENES = {
  /* Baden: Himmel, Meer mit Wellen, die Figur bis zur Brust im Wasser, Spritzer – mit Chris, wenn er dabei ist */
  swim: (c, t, p, st) => {
    for (let y = 0; y < 50; y++) R(c, 0, y, SCENE_W, 1, mix('#7ec8f0', '#dff0f8', y / 50));
    E(c, 200, 22, 12, 12, '#ffe9a0');
    for (let y = 50; y < SCENE_H; y++) R(c, 0, y, SCENE_W, 1, mix('#2f8fd8', '#1a4a8a', (y - 50) / 94));
    for (let k = 0; k < 7; k++) { const yy = 56 + k * 13; for (let x = -24; x < SCENE_W + 24; x += 24) { const o = Math.sin(t * 2 + k + x * 0.05) * 3; R(c, x + ((t * 18 + k * 9) % 24), yy + o, 12, 2, 'rgba(255,255,255,0.45)'); } }
    const people = [['me', 120, 0]].concat(st.with ? [[st.with, 165, 1.7]] : []);
    for (const [id, px, ph] of people) {
      const bob = Math.sin(t * 2.2 + ph) * 3, wl = 104 + bob, sheet = id === 'me' ? getSheet(G.S.look) : getSheet(personLook(id));
      inRect(c, 0, 0, SCENE_W, wl, () => sceneSprite(c, sheet, 'stand', 0, px - SPR_W / 2, wl - SPR_H + 14));
      R(c, px - 20, wl - 1, 40, 3, 'rgba(255,255,255,0.6)');
      for (let i = 0; i < 6; i++) { const f = (t * 1.5 + i / 6 + ph) % 1; P(c, px - 16 + i * 7 + Math.sin(t * 5 + i) * 2, wl - 4 - f * 14, `rgba(255,255,255,${(1 - f).toFixed(2)})`); }
    }
    for (let i = 0; i < 3; i++) { const gx = (t * 25 + i * 90) % (SCENE_W + 40) - 20, gy = 18 + i * 9 + Math.sin(t * 3 + i) * 3; line(c, gx - 5, gy + 2, gx, gy, '#ffffff'); line(c, gx, gy, gx + 5, gy + 2, '#ffffff'); }
  },
  /* Anflug auf Valencia: Flugzeug über Meer und Stadt */
  plane(c, t, p, st) {
    sceneSky(c, false);
    sceneSea(c, 90, t);
    sceneCity(c, 100, t, p * 60);
    R(c, 0, 100, SCENE_W, 44, '#efe0b8'); for (let k = 0; k < 20; k++) P(c, (k * 29) % SCENE_W, 104 + (k * 7) % 36, '#dcc89a');
    for (let k = 0; k < 8; k++) { const x = (k * 36 + 10 - p * 60) % (SCENE_W + 40); R(c, x, 96, 3, 14, '#8a6a44'); for (let j = 0; j < 5; j++) line(c, x + 1, 96, x + 1 + Math.cos(j * 1.3 - 0.4) * 10, 96 + Math.sin(j * 1.3 - 0.4) * 6 + 2, '#3f8a3a'); }
    const px = 30 + p * 150, py = 40 + Math.sin(p * 3.14) * 10 + p * 30;
    E(c, px, py, 22, 5, '#f4f4f4'); R(c, px - 22, py - 2, 10, 4, '#f4f4f4'); R(c, px - 24, py - 10, 6, 10, '#c8352d'); R(c, px - 8, py - 4, 16, 3, '#c8352d'); R(c, px + 6, py - 3, 6, 2, '#8ab0d0');
    for (let k = -14; k < 14; k += 5) P(c, px + k, py - 2, '#4a6a8a');
    R(c, px - 6, py + 3, 18, 3, '#c8ccd0'); R(c, px - 2, py + 5, 3, 3, '#1a1a1e'); R(c, px + 8, py + 5, 3, 3, '#1a1a1e');
    for (let k = 0; k < 20; k++) P(c, px - 30 - k * 3, py - 3 + Math.sin(k) * 2, `rgba(255,255,255,${0.6 - k * 0.03})`);
    pxText(c, 'VLC', 200, 120, '#1a3a7a');
  },
  /* Taxi vom Flughafen in die Stadt: Autobahn, Ciudad de las Artes zieht vorbei */
  taxi(c, t, p, st) {
    sceneSky(c, st.night, p, !st.night && hourOf(G.S.time) > 18);
    sceneCity(c, 96, t, t * 40);
    if (p > 0.3 && p < 0.8) { const x = 260 - (p - 0.3) * 520; for (let k = 0; k < 80; k++) { const tt = (k - 40) / 40; const h = Math.sqrt(Math.max(0, 1 - tt * tt)) * 30; R(c, x + k, 96 - h, 1, h, k % 7 ? '#e8ecf0' : '#9ab0b8'); } for (let k = 0; k < 80; k++) { const tt = (k - 40) / 40; const h = Math.sqrt(Math.max(0, 1 - tt * tt)) * 16; R(c, x + k, 96 - h, 1, h, '#5a8ab0'); } }
    R(c, 0, 96, SCENE_W, 48, '#5c5f66');
    for (let k = 0; k < 6; k++) R(c, (k * 48 - t * 160) % (SCENE_W + 48), 118, 24, 3, '#e8e4dc');
    R(c, 0, 96, SCENE_W, 2, '#8a8e94'); R(c, 0, 140, SCENE_W, 4, '#4a4d54');
    const bump = Math.sin(t * 9) * 1;
    const cx = 110, cy = 112 + bump;
    R(c, cx - 36, cy - 12, 72, 22, '#f0d040'); R(c, cx - 36, cy - 12, 72, 1, '#fff4a0'); R(c, cx - 22, cy - 26, 44, 15, '#e8c830'); R(c, cx - 19, cy - 24, 16, 10, '#7fb4e2'); R(c, cx + 3, cy - 24, 16, 10, '#7fb4e2');
    R(c, cx - 15, cy - 34, 30, 9, '#1a1a1e'); pxText(c, 'TAXI', cx - 11, cy - 33, '#f0d040');
    R(c, cx - 36, cy - 2, 72, 3, '#1a1a1a'); E(c, cx - 22, cy + 10, 7, 7, '#1a1a1e'); E(c, cx + 22, cy + 10, 7, 7, '#1a1a1e'); P(c, cx - 22 + Math.cos(t * 20) * 3, cy + 10 + Math.sin(t * 20) * 3, '#8a8e94'); P(c, cx + 22 + Math.cos(t * 20) * 3, cy + 10 + Math.sin(t * 20) * 3, '#8a8e94');
    if (st.night) { R(c, cx + 36, cy - 8, 20, 4, 'rgba(255,240,180,0.5)'); }
    const heads = st.heads || [];
    heads.slice(0, 4).forEach((sh, i) => { inRect(c, cx - 19 + (i % 2) * 22, cy - 24, 16, 10, () => sceneHead(c, sh, cx - 19 + (i % 2) * 22 + (i < 2 ? 0 : 4) - 6, cy - 24 - 2 + (i >= 2 ? 1 : 0), 1, i < 2 ? 2 : 0)); });
    R(c, 0, 96, SCENE_W, 48, `rgba(0,0,0,${st.night ? 0.3 : 0})`);
  },
  /* Tür: Fassade, Tür geht auf, Figur verschwindet / kommt heraus */
  door(c, t, p, st) {
    const exit = !!st.exit;
    const open = exit ? (p < 0.25 ? p / 0.25 : p > 0.8 ? 1 - (p - 0.8) / 0.2 : 1) : (p < 0.3 ? p / 0.3 : p > 0.85 ? 1 - (p - 0.85) / 0.15 : 1);
    const { dx, dy, dw, dh } = drawFacade(c, t, st, open, st.closing);
    const sheet = getSheet(G.S.look);
    const s = 1;
    const walk = Math.floor(t * 8) % 2 ? 'walkA' : 'walkB';
    if (!exit) { const y = 130 - p * 56, x = 120 - SPR_W / 2; if (p < 0.9) inRect(c, 0, 0, SCENE_W, dy + dh, () => sceneSprite(c, sheet, p < 0.85 ? walk : 'stand', 3, x, y - SPR_H + 10, s, p > 0.7 ? 1 - (p - 0.7) / 0.2 : 1)); }
    else { const y = 74 + p * 56, x = 120 - SPR_W / 2; inRect(c, 0, 0, SCENE_W, SCENE_H, () => sceneSprite(c, sheet, p < 0.9 ? walk : 'stand', 0, x, y - SPR_H + 10, s, p < 0.2 ? p / 0.2 : 1)); }
    if (st.closing) pxText(c, 'CERRADO', 120 - pxTextW('CERRADO', 2) / 2, dy + 20, '#c8352d', 2);
  },
  thrown(c, t, p, st) {
    drawFacade(c, t, st, p < 0.5 ? 1 : 1 - (p - 0.5) * 2, false);
    const sheet = getSheet(G.S.look);
    const x = 120 - SPR_W / 2 + p * 60, y = 100 - Math.sin(p * 3.14) * 50 + p * 40;
    c.save(); c.translate(x + SPR_W / 2, y); c.rotate(p * 9); sceneSprite(c, sheet, 'stand', 0, -SPR_W / 2, -SPR_H / 2); c.restore();
    pxText(c, _t('¡FUERA!'), 60, 20, '#ffffff', 2);
  },
  /* Lift: Kabine, Etagenanzeige */
  lift(c, t, p, st) {
    R(c, 0, 0, SCENE_W, SCENE_H, '#9aa0a6');
    R(c, 40, 10, 160, 124, '#c6ccd2'); R(c, 44, 14, 152, 116, '#d8dce0'); for (let k = 0; k < 152; k += 8) R(c, 44 + k, 14, 1, 116, '#c8ccd0');
    R(c, 44, 120, 152, 10, '#8a8e94');
    R(c, 160, 24, 30, 22, '#1a1a1e'); const floors = st.up ? ['0', st.floor || '1'] : [st.floor || '1', '0']; const f = p < 0.5 ? floors[0] : floors[1]; pxText(c, f, 170, 30, '#f2c84a', 2); pxText(c, st.up ? '▲' : '▼', 184, 30, '#f2c84a');
    for (let k = 0; k < 6; k++) { R(c, 52, 24 + k * 14, 8, 8, '#8a8e94'); E(c, 56, 28 + k * 14, 2, 2, k === (st.up ? 1 : 0) + 1 ? '#ffd23d' : '#5a5e64'); }
    const sheet = getSheet(G.S.look);
    const bob = Math.sin(t * 6) * (p > 0.2 && p < 0.8 ? 1 : 0);
    sceneSprite(c, sheet, 'stand', 0, 120 - SPR_W / 2, 122 - SPR_H + bob);
    for (const id of (st.with || [])) { const i = (st.with.indexOf(id)); sceneSprite(c, getSheet(personLook(id)), 'stand', 0, 80 + i * 60 - SPR_W / 2 + (i > 0 ? 40 : 0), 122 - SPR_H + bob); }
    if (p > 0.9) pxText(c, 'DING', 110, 60, '#f2c84a', 2);
    R(c, 0, 0, SCENE_W, SCENE_H, `rgba(0,0,0,${p < 0.1 ? 1 - p * 10 : p > 0.92 ? (p - 0.92) * 12 : 0})`);
  },
  stairs(c, t, p, st) {
    R(c, 0, 0, SCENE_W, SCENE_H, '#d8d2c6');
    for (let k = 0; k < 10; k++) { const y = 120 - k * 10; R(c, 40 + k * 12, y, 160 - k * 24, 10, k % 2 ? '#b5aea2' : '#c8c2b6'); R(c, 40 + k * 12, y, 160 - k * 24, 1, '#e8e2d6'); }
    R(c, 30, 20, 4, 110, '#5a5e64'); R(c, 206, 20, 4, 110, '#5a5e64'); line(c, 32, 30, 208, 30, '#8a6a44');
    const sheet = getSheet(G.S.look);
    const k = st.up ? p * 9 : (1 - p) * 9;
    const x = 120 - SPR_W / 2, y = 128 - k * 10;
    sceneSprite(c, sheet, Math.floor(t * 8) % 2 ? 'walkA' : 'walkB', st.up ? 3 : 0, x, y - SPR_H + 8, 1);
    pxText(c, st.up ? _t('1. STOCK') : 'ERDGESCHOSS', 120 - pxTextW(st.up ? _t('1. STOCK') : 'ERDGESCHOSS') / 2, 8, '#2a2a30');
  },
  roomdoor(c, t, p, st) {
    R(c, 0, 0, SCENE_W, SCENE_H, '#efe3cc'); R(c, 0, 110, SCENE_W, 34, '#8e2f34'); R(c, 0, 110, SCENE_W, 2, '#b85a5a');
    const open = p < 0.4 ? p / 0.4 : p > 0.8 ? 1 - (p - 0.8) / 0.2 : 1;
    R(c, 90, 26, 60, 86, '#3a2a1c'); R(c, 94, 30, 52, 82, '#ffe6a8');
    const pw = Math.round(52 * (1 - open * 0.9)); if (pw > 0) { R(c, 94, 30, pw, 82, '#6a4428'); if (pw > 10) { R(c, 98, 36, pw - 8, 30, '#7a5232'); R(c, 98, 72, pw - 8, 30, '#7a5232'); R(c, 94 + pw - 8, 70, 3, 4, '#e8c84a'); } }
    R(c, 104, 14, 32, 11, '#c9a65a'); pxText(c, '412', 112, 16, '#2a1a10', 1);
    const sheet = getSheet(G.S.look);
    if (!st.exit) { const y = 130 - p * 40; if (p < 0.92) inRect(c, 0, 0, SCENE_W, 112, () => sceneSprite(c, sheet, Math.floor(t * 8) % 2 ? 'walkA' : 'walkB', 3, 120 - SPR_W / 2, y - SPR_H + 8, 1, p > 0.75 ? 1 - (p - 0.75) / 0.17 : 1)); }
    else { const y = 90 + p * 40; sceneSprite(c, sheet, Math.floor(t * 8) % 2 ? 'walkA' : 'walkB', 0, 120 - SPR_W / 2, y - SPR_H + 8, 1, p < 0.2 ? p / 0.2 : 1); }
  },
  /* Schlafen im Hotelzimmer */
  sleep(c, t, p, st) {
    R(c, 0, 0, SCENE_W, SCENE_H, '#141c2c'); R(c, 0, 100, SCENE_W, 44, '#2a2a38');
    R(c, 60, 60, 120, 50, '#6a4428'); R(c, 66, 66, 108, 40, '#f4f0e6'); R(c, 66, 80, 108, 26, '#2f7fa8'); R(c, 70, 68, 30, 10, '#ffffff');
    const sheet = getSheet(G.S.look);
    c.save(); c.translate(110, 84); c.rotate(-Math.PI / 2); sceneSprite(c, sheet, 'stand', 2, -SPR_W / 2, -SPR_H / 2); c.restore();
    R(c, 90, 80, 84, 22, '#2f7fa8');
    for (let k = 0; k < 3; k++) { const ph = (t * 0.5 + k / 3) % 1; pxText(c, 'Z', 128 + ph * 20 + k * 6, 50 - ph * 30, `rgba(140,170,255,${1 - ph})`, 1 + k * 0.5 | 0); }
    R(c, 150, 20, 50, 40, '#1a2a4a'); for (let i = 0; i < 10; i++) P(c, 155 + Math.floor(hash(i, 1) * 40), 24 + Math.floor(hash(i, 2) * 30), '#ffffff');
    const h = hourOf(G.S.time); if (p > 0.7 && !st.nap) { R(c, 150, 20, 50, 40, mix('#1a2a4a', '#ffb347', (p - 0.7) / 0.3)); }
    R(c, 20, 90, 24, 14, '#2a2a2e'); pxText(c, clockStr(st.t0 + Math.round(p * (st.min || 0))), 22, 94, '#ff3a3a');
  },
  shower(c, t, p, st) {
    R(c, 0, 0, SCENE_W, SCENE_H, '#dfe7ea'); for (let k = 0; k < SCENE_W; k += 12) R(c, k, 0, 1, SCENE_H, '#bfcad0'); for (let k = 0; k < SCENE_H; k += 12) R(c, 0, k, SCENE_W, 1, '#bfcad0');
    R(c, 112, 10, 16, 6, '#8a96a0'); R(c, 118, 2, 4, 10, '#8a96a0');
    for (let k = 0; k < 30; k++) { const x = 100 + hash(k, 1) * 40, y = (16 + (t * 120 + k * 17) % 110); R(c, x, y, 1, 4, 'rgba(120,180,230,0.8)'); }
    const sheet = getSheet(Object.assign({}, G.S.look, { top: 5, topCol: 14, pants: 3, pantsCol: 10, shoes: 6, hat: 0, glasses: 0, acc: 0 }));
    sceneSprite(c, sheet, 'stand', 0, 120 - SPR_W / 2, 124 - SPR_H);
    for (let k = 0; k < 8; k++) E(c, 100 + hash(k, 3) * 40, 118 + hash(k, 4) * 10, 3, 2, 'rgba(255,255,255,0.8)');
    R(c, 0, 128, SCENE_W, 16, '#c9d6de');
  },
  /* E-Bike durch den Turia-Park */
  ride(c, t, p, st) {
    sceneSky(c, st.night);
    R(c, 0, 80, SCENE_W, 20, '#7aa84c'); R(c, 0, 100, SCENE_W, 30, '#b35a4a'); R(c, 0, 130, SCENE_W, 14, '#6f9c44');
    for (let k = 0; k < 6; k++) R(c, (k * 48 - t * 140) % (SCENE_W + 48), 114, 20, 2, '#f4ece0');
    for (let k = 0; k < 6; k++) { const x = ((k * 50 - t * 60) % (SCENE_W + 50) + SCENE_W + 50) % (SCENE_W + 50) - 25; R(c, x, 60, 4, 22, '#8a6a44'); for (let j = 0; j < 6; j++) line(c, x + 2, 60, x + 2 + Math.cos(j * 1.05 - 0.4) * 14, 60 + Math.sin(j * 1.05 - 0.4) * 8 + 2, '#3f8a3a'); }
    for (let k = 0; k < 5; k++) { const x = ((k * 70 + 30 - t * 60) % (SCENE_W + 50) + SCENE_W + 50) % (SCENE_W + 50) - 25; E(c, x, 76, 10, 8, '#2e5a2a'); E(c, x, 74, 8, 6, '#3f7a36'); for (let j = 0; j < 4; j++) P(c, x - 5 + j * 3, 72 + (j % 2) * 3, '#ff8c1a'); }
    const ids = st.riders || [];
    ids.forEach((id, i) => { const L = id === 'me' ? G.S.look : personLook(id); const a = { dir: 2, moving: true, bike: true, bikeCol: ['#2a9aa0', '#e2554a', '#f0a23a', '#2fa0d8'][i % 4] }; const x = 60 + i * 50 - Math.sin(t * 2 + i) * 4, y = 122 + (i % 2) * 2; drawBikeUnder(c, x, y, Object.assign(a, { x, y }), false); sceneSprite(c, getSheet(L), 'ride', 2, x - SPR_W / 2, y - SPR_H - 3); drawBikeUnder(c, x, y, a, true); });
    if (st.battery != null) { R(c, 8, 8, 44, 12, '#1a1a1e'); R(c, 10, 10, Math.round(40 * st.battery / 100), 8, st.battery > 30 ? '#3af07a' : '#ff5a4a'); pxText(c, Math.round(st.battery) + '%', 56, 11, '#ffffff'); }
  },
  /* Segeltörn im Hafen */
  boat(c, t, p, st) {
    sceneSky(c, false);
    sceneSea(c, 70, t);
    for (let k = 0; k < 4; k++) { const x = (k * 70 - t * 10) % (SCENE_W + 60); R(c, x, 60, 30, 12, '#e8e8e0'); R(c, x + 12, 40, 2, 20, '#6a4a2a'); for (let j = 0; j < 16; j++) R(c, x + 14, 42 + j, j * 0.5, 1, '#ffffff'); }
    const bx = 120, by = 108 + Math.sin(t * 2) * 3;
    c.save(); c.translate(bx, by); c.rotate(Math.sin(t * 2) * 0.05);
    E(c, 0, 0, 44, 9, '#f4f0e6'); R(c, -40, -12, 80, 12, '#f4f0e6'); R(c, -40, -3, 80, 3, '#2f5fb8');
    R(c, -2, -80, 4, 70, '#6a4a2a'); for (let k = 0; k < 56; k++) R(c, 2, -78 + k, k * 0.7, 1, '#ffffff'); for (let k = 0; k < 40; k++) R(c, -2 - k * 0.5, -60 + k, k * 0.5, 1, '#f0e8d8');
    const sheet = getSheet(G.S.look); sceneSprite(c, sheet, 'stand', 2, -30, -12 - SPR_H + 4, 1);
    c.restore();
    for (let k = 0; k < 10; k++) E(c, bx - 50 + k * 10, by + 6 + Math.sin(t * 4 + k) * 2, 4, 1, 'rgba(255,255,255,0.7)');
  },
  /* Mascletà: Plaza del Ayuntamiento, Böller, Rauch */
  mascleta(c, t, p, st) {
    sceneSky(c, false);
    R(c, 0, 70, SCENE_W, 30, '#dccfb8'); R(c, 20, 30, 200, 44, '#e8dcc6'); for (let wx = 28; wx < 212; wx += 16) for (let wy = 34; wy < 70; wy += 12) R(c, wx, wy, 8, 8, '#5a6a7a'); R(c, 20, 26, 200, 4, '#b85a3a');
    R(c, 0, 100, SCENE_W, 44, '#c6b89c');
    for (let k = 0; k < 40; k++) { const x = 10 + hash(k, 1) * 220, y = 92 + hash(k, 2) * 44; E(c, x, y, 3, 4, ['#c8352d', '#2f5fb8', '#f4f0e6', '#e8c23a', '#3f8e4b'][k % 5]); E(c, x, y - 5, 2, 2, '#f4c8a0'); }
    const n = Math.floor(t * 20);
    for (let k = 0; k < 8; k++) { if ((n + k) % 3 === 0) { const x = 40 + hash(k, n) * 160, y = 60 + hash(n, k) * 30; E(c, x, y, 4 + hash(k, 5) * 4, 4, k % 2 ? '#ffffff' : '#ffe08a'); } }
    for (let k = 0; k < 20; k++) E(c, 30 + hash(k, 9) * 180, 50 + ((t * 20 + k * 7) % 40) - 10, 10 + k % 5, 6, `rgba(220,220,225,${0.3 + Math.sin(t * 5 + k) * 0.1})`);
    if (p > 0.85) pxText(c, _t('¡VISCA VALÈNCIA!'), 120 - pxTextW(_t('¡VISCA VALÈNCIA!'), 2) / 2, 20, '#c8352d', 2);
  },
  /* Cremà: Die Falla brennt */
  crema(c, t, p, st) {
    sceneSky(c, true);
    R(c, 0, 100, SCENE_W, 44, '#2a2a30');
    for (let k = 0; k < 30; k++) { const x = 10 + hash(k, 1) * 220, y = 110 + hash(k, 2) * 30; E(c, x, y, 3, 4, '#1a1a22'); E(c, x, y - 5, 2, 2, '#c99a6c'); }
    const burn = p;
    const hgt = 70 * (1 - burn * 0.8);
    R(c, 100, 100 - hgt, 40, hgt, '#e8b040'); if (hgt > 30) { R(c, 104, 100 - hgt, 32, 12, '#2f5fb8'); E(c, 120, 100 - hgt - 10, 10, 10, '#f4c8a0'); }
    for (let k = 0; k < 40; k++) { const fx = 80 + hash(k, 3) * 80, ph = (t * 1.5 + hash(k, 4)) % 1, fy = 104 - ph * (40 + burn * 60); R(c, fx, fy, 3 + hash(k, 5) * 4, 6, `rgba(255,${Math.round(90 + ph * 140)},30,${1 - ph})`); }
    for (let k = 0; k < 30; k++) { const ph = (t * 0.8 + hash(k, 6)) % 1; P(c, 90 + hash(k, 7) * 60 + Math.sin(t * 3 + k) * 10, 60 - ph * 60, `rgba(255,${Math.round(120 + ph * 100)},60,${1 - ph})`); }
    for (let k = 0; k < 12; k++) E(c, 70 + hash(k, 8) * 100, 20 + ((t * 15 + k * 9) % 50), 12 + k % 6, 7, 'rgba(80,80,90,0.45)');
    c.fillStyle = `rgba(255,120,30,${0.08 + Math.sin(t * 9) * 0.04})`; c.fillRect(0, 0, SCENE_W, SCENE_H);
    if (p > 0.85) pxText(c, 'CREMÀ', 120 - pxTextW('CREMÀ', 3) / 2, 16, '#ffd27a', 3);
  },
  /* Heimflug */
  flight(c, t, p, st) {
    sceneSky(c, true, 0, true);
    sceneSea(c, 100, t);
    const px = 30 + p * 170, py = 100 - p * 60;
    E(c, px, py, 22, 5, '#f4f4f4'); R(c, px - 22, py - 2, 10, 4, '#f4f4f4'); R(c, px - 24, py - 10, 6, 10, '#c8352d'); R(c, px - 8, py - 4, 16, 3, '#c8352d');
    for (let k = -14; k < 14; k += 5) P(c, px + k, py - 2, '#ffe9b0');
    for (let k = 0; k < 20; k++) P(c, px - 30 - k * 3, py + 2 + k, `rgba(255,255,255,${0.6 - k * 0.03})`);
    pxText(c, _t('VLC → ZRH'), 160, 128, '#ffffff');
  },
  /* Flugzeugkabine: Pascal/Chris allein */
  cabin(c, t, p, st) {
    R(c, 0, 0, SCENE_W, SCENE_H, '#d8dce0'); R(c, 0, 0, SCENE_W, 24, '#b8bcc0'); for (let k = 0; k < SCENE_W; k += 48) { R(c, k + 8, 40, 30, 26, '#1a3a6a'); E(c, k + 23, 53, 12, 10, '#5aa8e0'); E(c, k + 18, 58, 6, 3, '#ffffff'); }
    for (let k = 0; k < 5; k++) { R(c, k * 48 + 4, 90, 36, 50, '#2a4a7a'); R(c, k * 48 + 4, 86, 36, 6, '#1a3a6a'); }
    const sheet = getSheet(G.S.look); sceneSprite(c, sheet, 'sit', 0, 100 - SPR_W / 2, 120 - SPR_H + 6);
    R(c, 90, 118, 20, 6, '#3a3a40'); R(c, 92, 110, 16, 8, '#7ad0f0');
  },
};
const Scene = {
  async play(kind, o = {}) {
    const fn = SCENES[kind];
    if (!fn) { await UI.fadeOut(o.text || ''); if (!o.keep) await UI.fadeIn(); return; }
    const cv = UI.els.fadeCv, x = cv.getContext('2d');
    sceneFit(cv, x);
    const st = Object.assign({ night: isNight(), t0: G.S.time }, o);
    UI.els.fade.classList.add('scene');
    /* Der Text erscheint erst, wenn die Szene sichtbar ist – nicht schon über dem alten Ort */
    UI.els.fadeText.textContent = '';
    const tt = setTimeout(() => { UI.els.fadeText.textContent = o.text || ''; }, 380);
    UI.els.fade.classList.add('on');
    const ms = o.ms || 1500;
    const start = performance.now();
    await new Promise((res) => {
      const step = (now) => {
        const p = Math.min(1, (now - start) / ms);
        x.clearRect(0, 0, SCENE_W, SCENE_H);
        try { fn(x, (now - start) / 1000, p, st); } catch (e) { console.error(e); }
        if (p < 1) requestAnimationFrame(step); else res();
      };
      requestAnimationFrame(step);
    });
    clearTimeout(tt); UI.els.fadeText.textContent = o.text || '';
    if (!o.keep) await UI.fadeIn();
  },
};
/* Szene in Geräteauflösung: der Canvas hat k Gerätepixel pro Szenenpixel (ganzzahlig, wie die Spielwelt), gezeichnet wird
   mit setTransform(k) – der Browser skaliert nichts mehr, die Figur ist so scharf wie im Spiel, auch wo image-rendering fehlt. */
function sceneFit(cv, x) {
  const dpr = window.devicePixelRatio || 1, box = UI.els.fade.getBoundingClientRect();
  const sp = Math.max(1, Math.round((View.scale || 1) * dpr));
  const maxK = Math.max(1, Math.floor(Math.min((box.width || innerWidth) * 0.94 * dpr / SCENE_W, (box.height || innerHeight) * 0.62 * dpr / SCENE_H)));
  const k = Math.max(1, Math.min(maxK, Math.max(sp, 2)));
  if (cv.width !== SCENE_W * k || cv.height !== SCENE_H * k) { cv.width = SCENE_W * k; cv.height = SCENE_H * k; }
  cv.style.width = (SCENE_W * k / dpr) + 'px'; cv.style.height = (SCENE_H * k / dpr) + 'px';
  x.setTransform(k, 0, 0, k, 0, 0);
  x.imageSmoothingEnabled = false;
  return k;
}
function sceneHead(c, sheet, x, y, s = 1, dir = 0) { c.drawImage(sheet, 0, dir * SPR_H + SPR_TOP, SPR_W, 16, Math.round(x), Math.round(y), SPR_W * s, 16 * s); }
