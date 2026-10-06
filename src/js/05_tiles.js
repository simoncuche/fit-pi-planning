/* ============ Bodenkacheln (24×24) ============ */
const T = {
  VOID: 0, PAVE: 1, ASPH: 2, PLAZA: 3, GRASS: 4, WATER: 5, SAND: 6, WOOD: 7, CARPET: 8, TILE: 9, MARBLE: 10,
  CONCRETE: 11, BIKE: 12, WALL: 13, WALLF: 14, HEDGE: 15, FLOWER: 16, ZEBRA: 17, DECK: 18, TRACK: 19, COBBLE: 20,
  GRAVEL: 21, PARK: 22, STAIRS: 23, CURB: 24, PALMS: 25, LOUNGE: 26, DARK: 27, TARMAC: 28, BALCONY: 29, WETSAND: 30,
};
const SOLID_T = new Set([T.VOID, T.WATER, T.WALL, T.WALLF, T.HEDGE, T.FLOWER, T.PALMS]);

function speckle(x, px, py, tx, ty, n, cols, seed = 0) {
  for (let i = 0; i < n; i++) P(x, px + Math.floor(hash(tx, ty, i + seed) * TS), py + Math.floor(hash(ty, tx, i + 40 + seed) * TS), cols[i % cols.length]);
}
function stoneRows(x, px, py, tx, ty, base, gap, rowH, wMin, wMax, seed) {
  R(x, px, py, TS, TS, gap);
  for (let r = 0; r < TS / rowH; r++) {
    let cx = -Math.floor(hash(tx, ty * 7 + r, seed) * wMax);
    let k = 0;
    while (cx < TS) {
      const w = wMin + Math.floor(hash(tx * 13 + k, ty * 5 + r, seed + 1) * (wMax - wMin + 1));
      const c = shade(base, (hash(tx + k, ty + r, seed + 2) - 0.5) * 0.18);
      const x0 = Math.max(cx, 0), x1 = Math.min(cx + w - 1, TS);
      if (x1 > x0) { R(x, px + x0, py + r * rowH, x1 - x0, rowH - 1, c); P(x, px + x0, py + r * rowH, shade(c, 0.15)); }
      cx += w; k++;
    }
  }
}
const TILE_PAINT = {
  [T.VOID]: (x, px, py) => R(x, px, py, TS, TS, '#0a0c10'),
  [T.PAVE]: (x, px, py, tx, ty, m, v) => {
    const base = ['#d8cfbf', '#cfc6b6', '#e2d9c8'][v] || '#d8cfbf';
    R(x, px, py, TS, TS, base);
    const ln = shade(base, -0.12);
    R(x, px, py, TS, 1, ln); R(x, px, py + 12, TS, 1, ln); R(x, px + ((ty % 2) ? 6 : 18), py, 1, 12, ln); R(x, px + ((ty % 2) ? 18 : 6), py + 12, 1, 12, ln);
    if (hash(tx, ty, 3) > 0.85) P(x, px + 8, py + 16, shade(base, -0.25));
    const below = m.at(tx, ty + 1);
    if (below === T.ASPH || below === T.ZEBRA || below === T.BIKE) { R(x, px, py + 21, TS, 3, '#9a948a'); R(x, px, py + 20, TS, 1, '#eee6d6'); }
    const above = m.at(tx, ty - 1);
    if (above === T.ASPH || above === T.BIKE) R(x, px, py, TS, 2, '#a8a298');
  },
  [T.ASPH]: (x, px, py, tx, ty, m, v) => {
    R(x, px, py, TS, TS, '#5c5f66');
    speckle(x, px, py, tx, ty, 22, ['#656870', '#52555b']);
    if (v === 1 && tx % 2 === 0) R(x, px, py + 11, TS, 2, '#ece8dc');
    if (v === 2) R(x, px, py + 11, TS, 2, '#e3c24a');
    if (v === 3 && ty % 2 === 0) R(x, px + 11, py, 2, TS, '#ece8dc');
  },
  [T.TARMAC]: (x, px, py, tx, ty) => { R(x, px, py, TS, TS, '#4a4d54'); speckle(x, px, py, tx, ty, 16, ['#55585f', '#42454b']); if (ty % 3 === 1) R(x, px, py + 11, TS, 2, '#e8c23a'); },
  [T.BIKE]: (x, px, py, tx, ty, m, v) => { R(x, px, py, TS, TS, '#b35a4a'); speckle(x, px, py, tx, ty, 12, ['#bd665a', '#a65042']); if (v === 1) { R(x, px + 8, py + 4, 8, 2, '#f4ece0'); R(x, px + 8, py + 18, 8, 2, '#f4ece0'); R(x, px + 11, py + 6, 2, 12, '#f4ece0'); } },
  [T.PLAZA]: (x, px, py, tx, ty, m, v) => {
    const base = ['#dccfb8', '#cfc2aa', '#c6b89c', '#e8dcc6'][v] || '#dccfb8';
    R(x, px, py, TS, TS, base);
    R(x, px, py, TS, 1, shade(base, -0.12)); R(x, px, py, 1, TS, shade(base, -0.12));
    if ((tx + ty) % 2 === 0) R(x, px + 1, py + 1, TS - 1, TS - 1, shade(base, -0.04));
    if (hash(tx, ty, 4) > 0.82) P(x, px + 9, py + 14, shade(base, -0.2));
  },
  [T.COBBLE]: (x, px, py, tx, ty, m, v) => { const base = ['#a39a8b', '#b19c86', '#8e8a84'][v] || '#a39a8b'; stoneRows(x, px, py, tx, ty, base, shade(base, -0.35), 6, 4, 9, 11); },
  [T.GRASS]: (x, px, py, tx, ty, m, v) => {
    const base = ['#7aa84c', '#6f9c44', '#86b055', '#9ab060'][v] || '#7aa84c';
    R(x, px, py, TS, TS, base);
    for (let i = 0; i < 26; i++) { const gx = Math.floor(hash(tx, ty, i) * TS), gy = Math.floor(hash(ty, tx, i + 9) * (TS - 1)); P(x, px + gx, py + gy, shade(base, -0.18)); P(x, px + gx, py + gy + 1, shade(base, 0.08)); }
    if (v === 1) for (let i = 0; i < 5; i++) { const gx = 1 + Math.floor(hash(tx, ty, i + 50) * 22), gy = 1 + Math.floor(hash(ty, tx, i + 60) * 22); P(x, px + gx, py + gy, ['#f2f2f2', '#f3d24a', '#e86a8a', '#b98ae0', '#ff7a2a'][i]); }
    if (v === 3) for (let i = 0; i < 6; i++) P(x, px + Math.floor(hash(tx, ty, i + 70) * TS), py + Math.floor(hash(ty, tx, i + 80) * TS), '#c8b060');
  },
  [T.PARK]: (x, px, py, tx, ty, m, v) => { TILE_PAINT[T.GRASS](x, px, py, tx, ty, m, v === 1 ? 1 : 0); if (hash(tx, ty, 21) > 0.9) { E(x, px + 12, py + 12, 3, 2, '#5a7a3a'); } },
  [T.WATER]: (x, px, py, tx, ty, m, v) => {
    const deep = v === 1 ? '#2f86b8' : v === 2 ? '#1f6f9a' : '#3a9ac8';
    R(x, px, py, TS, TS, deep);
    for (let i = 0; i < 5; i++) R(x, px + Math.floor(hash(tx, ty, i) * 18), py + Math.floor(hash(ty, tx, i) * 23), 6, 1, shade(deep, 0.14));
    const up = m.at(tx, ty - 1), dn = m.at(tx, ty + 1), lf = m.at(tx - 1, ty), rt = m.at(tx + 1, ty);
    const land = (t) => t !== T.WATER && t !== T.VOID && t !== T.DECK;
    if (up === T.SAND || up === T.WETSAND) { R(x, px, py, TS, 4, '#9fd4e4'); R(x, px, py, TS, 2, '#e8f4f8'); }
    else if (land(up)) { R(x, px, py, TS, 6, '#9a948a'); R(x, px, py, TS, 1, '#c9c2b4'); for (let k = 0; k < TS; k += 6) R(x, px + k, py + 1, 1, 5, '#857e72'); R(x, px, py + 6, TS, 2, shade(deep, -0.25)); }
    if (land(dn) && dn !== T.SAND && dn !== T.WETSAND) { R(x, px, py + 20, TS, 4, '#8e877b'); R(x, px, py + 19, TS, 1, shade(deep, 0.2)); }
    if (land(lf) && lf !== T.SAND) R(x, px, py, 2, TS, '#8e877b');
    if (land(rt) && rt !== T.SAND) R(x, px + 22, py, 2, TS, '#8e877b');
  },
  [T.SAND]: (x, px, py, tx, ty, m, v) => { R(x, px, py, TS, TS, v === 1 ? '#e8d7ad' : '#efe0b8'); speckle(x, px, py, tx, ty, 14, ['#dcc89a', '#f6e8c6', '#d0b88a']); },
  [T.WETSAND]: (x, px, py, tx, ty) => { R(x, px, py, TS, TS, '#d4c094'); speckle(x, px, py, tx, ty, 12, ['#c8b488', '#dccaa4']); if (ty % 2) R(x, px + 2, py + 10, 9, 1, '#e8dcc0'); },
  [T.WOOD]: (x, px, py, tx, ty, m, v) => {
    const base = ['#b58654', '#6b4528', '#d9a96c', '#8a5c34', '#c8a070'][v] || '#b58654';
    R(x, px, py, TS, TS, base);
    for (let k = 0; k < 4; k++) {
      const yy = py + k * 6;
      R(x, px, yy + 5, TS, 1, shade(base, -0.3));
      const seam = Math.floor(hash(tx, ty * 4 + k, 5) * TS);
      R(x, px + seam, yy, 1, 5, shade(base, -0.25));
      R(x, px, yy, TS, 1, shade(base, 0.06 * ((k + tx) % 2)));
    }
  },
  [T.CARPET]: (x, px, py, tx, ty, m, v) => {
    const base = ['#8e2f34', '#2f5e4a', '#3a4a7a', '#5a3a5e', '#7a7a80', '#2a4a5a'][v] || '#8e2f34';
    R(x, px, py, TS, TS, base);
    const d = shade(base, -0.2), l = shade(base, 0.15);
    for (let k = 0; k < TS; k += 12) for (let j = 0; j < TS; j += 12) { P(x, px + k + 6, py + j + 3, l); P(x, px + k + 5, py + j + 4, l); P(x, px + k + 7, py + j + 4, l); P(x, px + k + 6, py + j + 5, l); P(x, px + k + 6, py + j + 4, d); }
    speckle(x, px, py, tx, ty, 8, [d]);
  },
  [T.TILE]: (x, px, py, tx, ty, m, v) => {
    const base = ['#e8ecee', '#d8dcd0', '#c8d8e0', '#f0e8d8'][v] || '#e8ecee';
    R(x, px, py, TS, TS, base);
    R(x, px, py, TS, 1, shade(base, -0.15)); R(x, px, py, 1, TS, shade(base, -0.15));
    if (v === 2 && (tx + ty) % 2) R(x, px + 1, py + 1, TS - 1, TS - 1, shade(base, -0.06));
    if (v === 3) { R(x, px, py + 12, TS, 1, shade(base, -0.1)); R(x, px + 12, py, 1, TS, shade(base, -0.1)); }
  },
  [T.MARBLE]: (x, px, py, tx, ty) => { const a = (tx + ty) % 2 ? '#ebe6da' : '#9a9690'; R(x, px, py, TS, TS, a); line(x, px + 3, py + 4, px + 14, py + 18, shade(a, (tx + ty) % 2 ? -0.06 : 0.1)); R(x, px, py, TS, 1, shade(a, -0.1)); R(x, px, py, 1, TS, shade(a, -0.1)); },
  [T.CONCRETE]: (x, px, py, tx, ty) => { R(x, px, py, TS, TS, '#c9cbcc'); speckle(x, px, py, tx, ty, 14, ['#bfc1c3', '#d4d6d8']); if (tx % 3 === 0) R(x, px, py, 1, TS, '#b0b2b4'); if (ty % 3 === 0) R(x, px, py, TS, 1, '#b0b2b4'); },
  [T.LOUNGE]: (x, px, py, tx, ty) => { R(x, px, py, TS, TS, '#8e9aa6'); speckle(x, px, py, tx, ty, 10, ['#98a4b0', '#84909c']); if ((tx + ty) % 2) R(x, px + 2, py + 2, TS - 4, TS - 4, '#92a0ac'); },
  [T.DARK]: (x, px, py, tx, ty) => { R(x, px, py, TS, TS, '#1e1c26'); speckle(x, px, py, tx, ty, 6, ['#2b2836']); },
  [T.GRAVEL]: (x, px, py, tx, ty) => { R(x, px, py, TS, TS, '#c2b59a'); speckle(x, px, py, tx, ty, 30, ['#a99b80', '#d4c8ae', '#9a8d74']); },
  [T.DECK]: (x, px, py, tx, ty) => { R(x, px, py, TS, TS, '#a8865a'); for (let k = 0; k < TS; k += 6) { R(x, px + k + 5, py, 1, TS, '#7a5a3a'); if (hash(tx, ty, k) > 0.6) P(x, px + k + 2, py + Math.floor(hash(ty, tx, k) * 22), '#c0a070'); } },
  [T.TRACK]: (x, px, py, tx, ty, m, v) => { R(x, px, py, TS, TS, '#3a3c42'); speckle(x, px, py, tx, ty, 14, ['#44464c', '#303238']); if (v === 1) for (let k = 0; k < TS; k += 6) R(x, px + k, py + 10, 3, 4, (k / 6 + ty) % 2 ? '#e8e4dc' : '#c8352d'); if (v === 2) for (let k = 0; k < TS; k += 6) R(x, px + k, py, 3, 3, (k / 6) % 2 ? '#ffffff' : '#1a1a1a'); },
  [T.WALL]: (x, px, py, tx, ty, m) => {
    const cap = (m.wallStyle && m.wallStyle.cap) || '#2c2420';
    R(x, px, py, TS, TS, cap);
    R(x, px, py, TS, 1, shade(cap, 0.18));
    const dn = m.at(tx, ty + 1);
    if (dn !== T.WALL && dn !== T.WALLF && dn !== T.VOID) { R(x, px, py + 18, TS, 6, shade(cap, 0.25)); R(x, px, py + 18, TS, 1, shade(cap, 0.4)); }
  },
  [T.WALLF]: (x, px, py, tx, ty, m, v) => paintWallFace(x, px, py, tx, ty, m, v),
  [T.HEDGE]: (x, px, py, tx, ty) => { R(x, px, py, TS, TS, '#3c6a34'); for (let i = 0; i < 14; i++) R(x, px + Math.floor(hash(tx, ty, i) * 21), py + Math.floor(hash(ty, tx, i) * 21), 3, 3, i % 2 ? '#4d8040' : '#2f5629'); R(x, px, py + 20, TS, 4, '#2a4a24'); },
  [T.PALMS]: (x, px, py, tx, ty) => { R(x, px, py, TS, TS, '#4a7a3a'); for (let i = 0; i < 6; i++) { const cx = Math.floor(hash(tx, ty, i) * TS), cy = Math.floor(hash(ty, tx, i) * TS); E(x, px + cx, py + cy, 6, 5, i % 2 ? '#5a9a48' : '#3a6a30'); } },
  [T.FLOWER]: (x, px, py, tx, ty) => { R(x, px, py, TS, TS, '#5a3e2a'); R(x, px, py, TS, 3, '#9a958c'); R(x, px, py + 21, TS, 3, '#7d786f'); for (let i = 0; i < 12; i++) { const fx = 1 + Math.floor(hash(tx, ty, i) * 21), fy = 4 + Math.floor(hash(ty, tx, i) * 14); R(x, px + fx, py + fy, 3, 3, '#3f7a34'); P(x, px + fx + 1, py + fy - 1, ['#e8402e', '#f2c23a', '#e86ab0', '#ffffff', '#ff7a2a'][i % 5]); } },
  [T.ZEBRA]: (x, px, py) => { R(x, px, py, TS, TS, '#5c5f66'); R(x, px + 3, py, 7, TS, '#ece9e0'); R(x, px + 14, py, 7, TS, '#ece9e0'); },
  [T.STAIRS]: (x, px, py, tx, ty, m, v) => { const b = v === 1 ? '#8a6a46' : '#b5aea2'; R(x, px, py, TS, TS, b); for (let k = 0; k < TS; k += 6) { R(x, px, py + k, TS, 1, shade(b, 0.2)); R(x, px, py + k + 5, TS, 1, shade(b, -0.3)); } },
  [T.CURB]: (x, px, py, tx, ty) => { R(x, px, py, TS, TS, '#b8b2a6'); R(x, px, py + 20, TS, 4, '#8a8478'); R(x, px, py + 19, TS, 1, '#e0dacc'); speckle(x, px, py, tx, ty, 8, ['#aca698']); },
  [T.BALCONY]: (x, px, py, tx, ty) => { R(x, px, py, TS, TS, '#c8b8a0'); R(x, px, py, TS, 1, shade('#c8b8a0', -0.15)); if (tx % 2) R(x, px + 12, py, 1, TS, shade('#c8b8a0', -0.1)); },
};
function paintWallFace(x, px, py, tx, ty, m, v) {
  const upper = m.at(tx, ty + 1) === T.WALLF;
  switch (v) {
    case 0: /* Hotel Kramer: warmer Putz mit Holzleiste */
      if (upper) { R(x, px, py, TS, TS, '#efe3cc'); for (let k = 0; k < TS; k += 6) R(x, px + k, py, 3, TS, '#e6d8bf'); R(x, px, py + 22, TS, 2, '#b89a70'); }
      else { R(x, px, py, TS, TS, '#8a5e3a'); for (let k = 0; k < TS; k += 12) R(x, px + k, py + 3, 1, 15, '#6a4426'); R(x, px, py, TS, 3, '#a87a50'); R(x, px, py + 19, TS, 5, '#3e2818'); }
      break;
    case 1: /* Bar: Azulejos */
      if (upper) { R(x, px, py, TS, TS, '#f0ead8'); for (let k = 0; k < TS; k += 8) for (let j = 0; j < TS; j += 8) { R(x, px + k + 1, py + j + 1, 6, 6, ((k + j) / 8) % 2 ? '#2f6fb8' : '#f4f0e6'); P(x, px + k + 3, py + j + 3, '#e8c23a'); } }
      else { R(x, px, py, TS, TS, '#5a3a24'); for (let k = 0; k < TS; k += 6) R(x, px + k, py, 1, 20, '#4a2c18'); R(x, px, py + 20, TS, 4, '#2a1a10'); }
      break;
    case 2: /* Office: weisse Wand mit Glas */
      if (upper) { R(x, px, py, TS, TS, '#f2f4f6'); R(x, px, py + 22, TS, 2, '#c8ccd0'); }
      else { R(x, px, py, TS, TS, '#e4e8ec'); R(x, px, py + 18, TS, 6, '#8a9098'); R(x, px, py + 18, TS, 1, '#b0b6bc'); }
      break;
    case 3: /* Disco */
      R(x, px, py, TS, TS, '#14121c'); for (let k = 0; k < TS; k += 12) R(x, px + k, py, 1, TS, '#1c1a26');
      if (!upper) { R(x, px, py + 19, TS, 1, '#e040d0'); R(x, px, py + 20, TS, 4, '#0e0c14'); }
      break;
    case 4: /* Fliesen / Bad */
      R(x, px, py, TS, TS, '#dfe7ea'); for (let k = 0; k < TS; k += 6) { R(x, px + k, py, 1, TS, '#bfcad0'); R(x, px, py + k, TS, 1, '#bfcad0'); }
      break;
    case 5: /* Flughafen: Glas und Stahl */
      if (upper) { R(x, px, py, TS, TS, '#a8c8dc'); R(x, px, py, TS, 1, '#6a7a88'); R(x, px + 11, py, 2, TS, '#6a7a88'); for (let k = 0; k < 6; k++) P(x, px + 2 + k * 3, py + 3 + k, '#d8ecf4'); }
      else { R(x, px, py, TS, TS, '#8a949c'); R(x, px, py, TS, 3, '#6a7a88'); R(x, px, py + 18, TS, 6, '#5a646c'); }
      break;
    case 6: /* Markthalle: Backstein & Keramik */
      if (upper) { R(x, px, py, TS, TS, '#b8603a'); for (let r = 0; r < 4; r++) { R(x, px, py + r * 6 + 5, TS, 1, '#8a4428'); R(x, px + (r % 2 ? 6 : 18), py + r * 6, 1, 5, '#8a4428'); } }
      else { R(x, px, py, TS, TS, '#e8d8a0'); for (let k = 0; k < TS; k += 8) R(x, px + k + 2, py + 4, 4, 4, '#2f6fb8'); R(x, px, py + 18, TS, 6, '#8a6a48'); }
      break;
    case 7: /* Museum: helle Wand mit Stuck */
      R(x, px, py, TS, TS, '#f4f0e8'); if (upper) { R(x, px, py + 20, TS, 2, '#d8d0c0'); } else { R(x, px, py + 16, TS, 8, '#c8bca8'); R(x, px, py + 16, TS, 1, '#e8e0d0'); }
      break;
    case 8: /* Hochhaus-Eingang: Marmor & Messing */
      if (upper) { R(x, px, py, TS, TS, '#d8d2c6'); line(x, px + 2, py + 4, px + 20, py + 18, '#c4bcae'); } else { R(x, px, py, TS, TS, '#b8a070'); R(x, px, py, TS, 2, '#d8c080'); R(x, px, py + 18, TS, 6, '#6a5a3a'); }
      break;
    case 9: /* Bodega: Stein und Fässer-Holz */
      if (upper) stoneRows(x, px, py, tx, ty, '#b8a890', '#7c766a', 6, 5, 10, 3); else { R(x, px, py, TS, TS, '#6a4428'); for (let k = 0; k < TS; k += 6) R(x, px + k, py, 1, 20, '#523218'); R(x, px, py + 20, TS, 4, '#3a2210'); }
      break;
    case 10: /* Jamonería: Terrakotta */
      R(x, px, py, TS, TS, upper ? '#e8c89a' : '#c88a5a'); if (!upper) { R(x, px, py + 18, TS, 6, '#7a4a2a'); } else for (let k = 0; k < 3; k++) P(x, px + 4 + k * 7, py + 8 + (k % 2) * 6, '#d0a878');
      break;
    default: R(x, px, py, TS, TS, '#cfc6b4');
  }
}

/* ============ Objekte (vorgerendert, nach y sortiert) ============ */
function mkObj(x, y, w, h, drawH, paint, extra = {}) {
  return Object.assign({ x, y, w, h, drawH, padX: 0, paint, solid: true }, extra);
}
/* --- Bäume: Orangenbaum, Palme, Pinie, Zypresse --- */
function objOrange(x, y, big = false) {
  const R0 = big ? 18 : 14;
  return mkObj(x, y, 1, 1, big ? 40 : 32, (c, W, H) => {
    const cx = W / 2;
    E(c, cx, H - 3, 10, 3, 'rgba(0,0,0,0.22)');
    R(c, cx - 2, H - 16, 5, 15, '#6a4a2c'); R(c, cx + 1, H - 16, 2, 15, '#4a3018');
    const cy = R0 + 2;
    const blobs = [[0, 0, R0], [-R0 * 0.55, R0 * 0.25, R0 * 0.7], [R0 * 0.55, R0 * 0.3, R0 * 0.7], [0, R0 * 0.55, R0 * 0.65], [-R0 * 0.3, -R0 * 0.4, R0 * 0.6]];
    for (const [dx, dy, r] of blobs) E(c, cx + dx, cy + dy + 1, Math.round(r), Math.round(r * 0.85), '#2e5a2a');
    for (const [dx, dy, r] of blobs) E(c, cx + dx, cy + dy, Math.round(r - 1), Math.round(r * 0.85 - 1), '#3f7a36');
    for (const [dx, dy, r] of blobs) E(c, cx + dx - 2, cy + dy - 2, Math.round(r * 0.55), Math.round(r * 0.45), '#5a9a48');
    for (let i = 0; i < 12; i++) { const a = hash(x, y, i) * 6.28, d = hash(y, x, i) * R0 * 0.85; const ox = cx + Math.cos(a) * d, oy = cy + Math.sin(a) * d * 0.85; E(c, ox, oy, 1.5, 1.5, '#ff8c1a'); P(c, ox - 1, oy - 1, '#ffb050'); }
  }, { padX: 12, solid: true });
}
function objPalm(x, y, h = 44) {
  return mkObj(x, y, 1, 1, h, (c, W, H) => {
    const cx = W / 2;
    E(c, cx, H - 2, 7, 2, 'rgba(0,0,0,0.22)');
    for (let k = 0; k < H - 14; k += 3) { const off = Math.sin(k * 0.08) * 3; R(c, cx - 2 + off, H - 3 - k, 4, 3, k % 6 ? '#8a6a44' : '#6e5234'); P(c, cx - 2 + off, H - 3 - k, '#a88858'); }
    const top = 12, tx = cx + Math.sin((H - 14) * 0.08) * 3;
    for (let i = 0; i < 7; i++) {
      const a = -0.3 + i * (3.5 / 6), len = 16 + (i % 2) * 4;
      for (let k = 0; k < len; k++) { const px = tx + Math.cos(a) * k, py = top + Math.sin(a) * k * 0.6 + (k * k) / 40; R(c, px - 1, py, 3, 2, k % 3 ? '#3f8a3a' : '#2e6a2c'); P(c, px, py - 1, '#5aa848'); }
    }
    E(c, tx, top + 2, 3, 2, '#8a6a2a'); P(c, tx - 1, top + 1, '#d8a040'); P(c, tx + 1, top + 2, '#d8a040');
  }, { padX: 14, solid: true });
}
function objPine(x, y) {
  return mkObj(x, y, 1, 1, 40, (c, W, H) => {
    const cx = W / 2;
    E(c, cx, H - 2, 9, 2, 'rgba(0,0,0,0.22)');
    R(c, cx - 2, H - 18, 4, 17, '#5a3c26'); R(c, cx + 1, H - 18, 1, 17, '#3e2818');
    for (const [dx, dy, r] of [[0, 14, 16], [-9, 20, 10], [9, 19, 10], [0, 8, 10]]) { E(c, cx + dx, dy + 2, r, Math.round(r * 0.55), '#2a5228'); E(c, cx + dx, dy, r - 1, Math.round(r * 0.55) - 1, '#3a6a34'); }
    for (let i = 0; i < 20; i++) P(c, cx - 14 + Math.floor(hash(x, y, i) * 28), 4 + Math.floor(hash(y, x, i) * 22), i % 2 ? '#4f8a44' : '#244a22');
  }, { padX: 14 });
}
function objCypress(x, y) {
  return mkObj(x, y, 1, 1, 46, (c, W, H) => { const cx = W / 2; E(c, cx, H - 2, 5, 2, 'rgba(0,0,0,0.22)'); for (let k = 0; k < H - 4; k++) { const w = Math.round(6 * Math.sin((k / (H - 4)) * 3.1) + 1); R(c, cx - w, k + 2, w * 2 + 1, 1, k % 3 ? '#2a5a2a' : '#1e4a22'); } }, { padX: 4 });
}
function objBush(x, y, col = '#4f8040', flowers) {
  return mkObj(x, y, 1, 1, 6, (c, W, H) => {
    E(c, 12, H - 2, 10, 2, 'rgba(0,0,0,0.2)');
    E(c, 12, H - 11, 10, 8, shade(col, -0.25)); E(c, 11, H - 12, 9, 7, col); E(c, 9, H - 15, 4, 3, shade(col, 0.2));
    if (flowers) for (let i = 0; i < 8; i++) P(c, 4 + Math.floor(hash(x, y, i) * 16), H - 18 + Math.floor(hash(y, x, i) * 12), flowers);
  });
}
/* --- Strassenmöbel --- */
function objLamp(x, y, style = 'modern') {
  const o = mkObj(x, y, 1, 1, 44, (c, W, H) => {
    E(c, 12, H - 2, 5, 1, 'rgba(0,0,0,0.25)');
    R(c, 9, H - 7, 6, 6, '#2a2c30'); R(c, 11, 10, 2, H - 16, '#34373c'); P(c, 11, 10, '#4a4e54');
    if (style === 'old') { R(c, 7, 2, 10, 3, '#2a2c30'); R(c, 8, 5, 8, 8, '#f2dc9a'); R(c, 8, 5, 1, 8, '#2a2c30'); R(c, 15, 5, 1, 8, '#2a2c30'); R(c, 11, 5, 2, 8, '#e8c870'); R(c, 7, 13, 10, 1, '#2a2c30'); R(c, 11, 0, 2, 2, '#2a2c30'); }
    else { R(c, 6, 4, 14, 3, '#34373c'); R(c, 7, 7, 12, 2, '#f4eecf'); }
  }, { solid: true, light: { dx: 12, dy: 10, r: 60, c: '#ffd78a' } });
  o.emit = (c) => { if (style === 'old') R(c, 8, 5, 8, 8, '#ffe8a0'); else R(c, 7, 7, 12, 2, '#fff4d0'); };
  return o;
}
function objBench(x, y, dir = 0, col = '#8a5a32') {
  return mkObj(x, y, 2, 1, 10, (c, W, H) => {
    E(c, W / 2, H - 2, W / 2 - 2, 2, 'rgba(0,0,0,0.2)');
    R(c, 2, H - 14, W - 4, 5, col); R(c, 2, H - 14, W - 4, 1, shade(col, 0.25)); R(c, 2, H - 10, W - 4, 1, shade(col, -0.3));
    R(c, 3, H - 9, 2, 8, '#3a3a3e'); R(c, W - 5, H - 9, 2, 8, '#3a3a3e');
    if (dir === 0) { R(c, 2, H - 20, W - 4, 5, shade(col, -0.1)); R(c, 2, H - 20, W - 4, 1, shade(col, 0.2)); }
  }, { solid: true, sortOff: 0 });
}
function objBin(x, y) { return mkObj(x, y, 1, 1, 8, (c, W, H) => { E(c, 12, H - 2, 6, 1, 'rgba(0,0,0,0.2)'); R(c, 6, H - 20, 12, 18, '#3a5a3a'); R(c, 6, H - 20, 12, 3, '#4f7a4f'); R(c, 8, H - 16, 1, 12, '#2e4a2e'); R(c, 12, H - 16, 1, 12, '#2e4a2e'); R(c, 7, H - 22, 10, 2, '#1e2a1e'); }); }
function objBollard(x, y) { return mkObj(x, y, 1, 1, 4, (c, W, H) => { E(c, 12, H - 3, 4, 1, 'rgba(0,0,0,0.2)'); R(c, 9, H - 18, 6, 15, '#3a3c40'); R(c, 9, H - 18, 6, 2, '#5a5e64'); R(c, 9, H - 13, 6, 2, '#d0b040'); }); }
function objPlanter(x, y, fl = '#e8402e') { return mkObj(x, y, 1, 1, 10, (c, W, H) => { R(c, 3, H - 12, 18, 11, '#b0603a'); R(c, 3, H - 12, 18, 2, '#c8784a'); E(c, 12, H - 15, 9, 5, '#3f7a34'); for (let i = 0; i < 7; i++) P(c, 5 + i * 2, H - 17 + (i % 3), fl); }); }
function objBikes(x, y, n = 4) { return mkObj(x, y, 2, 1, 8, (c, W, H) => { for (let k = 0; k < n; k++) { const bx = 3 + k * 11; ring(c, bx + 3, H - 5, 3.5, '#1e1e22'); ring(c, bx + 9, H - 5, 3.5, '#1e1e22'); line(c, bx + 3, H - 5, bx + 6, H - 11, ['#c8302a', '#2f5fb8', '#3f8e4b', '#e8c23a'][k % 4]); line(c, bx + 6, H - 11, bx + 9, H - 5, ['#c8302a', '#2f5fb8', '#3f8e4b', '#e8c23a'][k % 4]); R(c, bx + 5, H - 12, 3, 1, '#2a2a2e'); } }, { solid: true }); }
function objScooter(x, y, col = '#c8302a', fx = false) {
  return mkObj(x, y, 1, 1, 10, (c, W, H) => {
    E(c, 12, H - 2, 10, 2, 'rgba(0,0,0,0.25)');
    const s = fx ? -1 : 1, cx = 12;
    ring(c, cx - s * 7, H - 5, 3.5, '#1e1e22'); ring(c, cx + s * 7, H - 5, 3.5, '#1e1e22');
    R(c, cx - 5, H - 13, 11, 5, col); R(c, cx - 5, H - 13, 11, 1, shade(col, 0.3)); R(c, cx - 6, H - 15, 6, 3, '#2a2a2e');
    R(c, cx + s * 4, H - 17, 2, 6, col); R(c, cx + s * 2, H - 18, 7, 2, '#2a2a2e'); P(c, cx + s * 8, H - 14, '#f4e8a0');
  }, { solid: true });
}
function objEbike(x, y, col = '#2a9aa0', fx = false) {
  return mkObj(x, y, 1, 1, 12, (c, W, H) => {
    E(c, 12, H - 2, 10, 2, 'rgba(0,0,0,0.25)');
    const s = fx ? -1 : 1, cx = 12;
    ring(c, cx - 7, H - 6, 5, '#1e1e22'); ring(c, cx + 7, H - 6, 5, '#1e1e22'); P(c, cx - 7, H - 6, '#8a8e94'); P(c, cx + 7, H - 6, '#8a8e94');
    line(c, cx - 7, H - 6, cx - 2, H - 14, col); line(c, cx - 2, H - 14, cx + 6, H - 14, col); line(c, cx + 6, H - 14, cx + 7, H - 6, col); line(c, cx - 7, H - 6, cx + 2, H - 6, col); line(c, cx + 2, H - 6, cx - 2, H - 14, shade(col, -0.3));
    R(c, cx - 3, H - 13, 7, 3, '#2a2a2e'); R(c, cx + 4, H - 18, 2, 5, '#2a2a2e'); R(c, cx + 2, H - 19, 6, 1, '#2a2a2e'); R(c, cx - 4, H - 16, 4, 2, '#5a5e64');
    P(c, cx + 8, H - 17, '#f4f0a0');
  }, { solid: true, ebike: true });
}
function objCar(x, y, col = '#2f5fb8', dir = 'h', o = {}) {
  const w = dir === 'h' ? 2 : 1, h = dir === 'h' ? 1 : 2;
  return mkObj(x, y, w, h, dir === 'h' ? 12 : 8, (c, W, H) => {
    E(c, W / 2, H - 2, W / 2 - 2, 2, 'rgba(0,0,0,0.3)');
    if (dir === 'h') {
      R(c, 2, H - 16, W - 4, 11, col); R(c, 2, H - 16, W - 4, 1, shade(col, 0.3)); R(c, 10, H - 22, W - 20, 7, shade(col, -0.1));
      R(c, 12, H - 21, 9, 5, '#7fb4e2'); R(c, W - 21, H - 21, 9, 5, '#7fb4e2');
      R(c, 7, H - 6, 6, 4, '#1a1a1e'); R(c, W - 13, H - 6, 6, 4, '#1a1a1e');
      if (o.taxi) { R(c, W / 2 - 7, H - 25, 14, 3, '#f0d040'); pxText(c, 'TAXI', W / 2 - 7, H - 25, '#1a1a1a'); R(c, 2, H - 10, W - 4, 2, '#1a1a1a'); }
      P(c, 2, H - 12, '#fff4c0'); P(c, W - 3, H - 12, '#ff5a4a');
    } else {
      R(c, 3, 4, W - 6, H - 8, col); R(c, 3, 4, W - 6, 1, shade(col, 0.3)); R(c, 5, 10, W - 10, 10, '#7fb4e2'); R(c, 5, H - 14, W - 10, 6, shade(col, -0.15));
      R(c, 1, 8, 3, 6, '#1a1a1e'); R(c, W - 4, 8, 3, 6, '#1a1a1e'); R(c, 1, H - 12, 3, 6, '#1a1a1e'); R(c, W - 4, H - 12, 3, 6, '#1a1a1e');
      if (o.taxi) { R(c, 7, 14, 10, 3, '#f0d040'); }
    }
  }, { solid: true });
}
function objUmbrellaTable(x, y, col = '#e07b25') {
  return mkObj(x, y, 1, 1, 30, (c, W, H) => {
    E(c, 12, H - 2, 8, 2, 'rgba(0,0,0,0.2)');
    E(c, 12, H - 8, 7, 3, '#e8e4dc'); E(c, 12, H - 9, 7, 3, '#f4f0e6'); R(c, 11, H - 30, 2, 24, '#8a8e94');
    for (let k = 0; k < 10; k++) { const w = 3 + k * 1.6; R(c, 12 - w, 2 + k, w * 2 + 1, 1, (Math.floor(k / 2) % 2) ? col : '#f8f4ec'); }
    R(c, 11, 0, 2, 2, '#8a8e94');
  });
}
function objSunbed(x, y, col = '#2f8fd8') {
  return mkObj(x, y, 1, 1, 6, (c, W, H) => { R(c, 3, H - 14, 18, 12, '#e8e4dc'); R(c, 3, H - 14, 18, 1, '#ffffff'); for (let k = 0; k < 12; k += 3) R(c, 3, H - 14 + k, 18, 1, col); R(c, 2, H - 16, 20, 3, shade(col, -0.2)); R(c, 4, H - 2, 2, 2, '#8a8e94'); R(c, 18, H - 2, 2, 2, '#8a8e94'); });
}
function objSunUmbrella(x, y, col = '#2f8fd8') {
  return mkObj(x, y, 1, 1, 28, (c, W, H) => { R(c, 11, H - 30, 2, 28, '#e8e4dc'); for (let k = 0; k < 9; k++) { const w = 4 + k * 1.8; R(c, 12 - w, 1 + k, w * 2 + 1, 1, (k % 2) ? col : '#f8f4ec'); } E(c, 12, 10, 14, 2, shade(col, -0.2)); }, { solid: false });
}
/* --- Gebäude (Valencia: Pastellfassaden, Balkone, Markisen) --- */
function objBuilding(x, y, w, h, o) {
  o = Object.assign({ floors: 3, wall: '#e8c9a0', roof: '#b85a3a', roofType: 'flat', trim: '#f4efe4', shutter: null, balcony: true, wins: 'std', doors: [], shopWins: [], seed: x * 31 + y * 17, drawH: 14 }, o);
  const ob = mkObj(x, y, w, h, o.drawH, (c, W, H) => paintBuilding(c, W, H, o, false), { emit: (c, W, H) => paintBuilding(c, W, H, o, true), bld: o });
  return ob;
}
function paintBuilding(c, W, H, o, night) {
  const FH = 22;
  const fh = Math.min(o.floors * FH, H - 10);
  const fy0 = H - fh;
  const wall = o.wall, wD = shade(wall, -0.16), wL = shade(wall, 0.12);
  const r = rng(o.seed);
  const cols = Math.floor(W / TS);
  if (!night) {
    paintRoof(c, W, fy0, o, r);
    R(c, 0, fy0, W, fh, wall);
    for (let i = 0; i < W * fh / 50; i++) P(c, r() * W, fy0 + r() * fh, r() > 0.5 ? wD : wL);
    R(c, 0, fy0, W, 2, 'rgba(0,0,0,0.28)');
    R(c, W - 1, fy0, 1, fh, wD); R(c, 0, fy0, 1, fh, wL);
    for (let f = 1; f < o.floors; f++) { const yy = H - f * FH; R(c, 0, yy, W, 1, wL); R(c, 0, yy + 1, W, 1, wD); }
    R(c, 0, H - 4, W, 4, '#8f887c'); R(c, 0, H - 4, W, 1, '#a8a194');
    if (o.corner) for (let yy = fy0 + 2; yy < H - 4; yy += 6) { R(c, 0, yy, 4, 4, wL); R(c, W - 4, yy, 4, 4, wL); }
  }
  for (let f = 1; f < o.floors; f++) {
    const yy = H - (f + 1) * FH;
    for (let k = 0; k < cols; k++) paintWindow(c, k * TS + 12, yy + 4, o, night, hash(o.seed, k * 7 + f), false, f);
  }
  for (let k = 0; k < cols; k++) {
    const d = o.doors.find((d) => d.dx === k);
    const px = k * TS;
    if (d) paintDoor(c, px, H - FH, d, o, night);
    else if (o.shopWins.includes(k) || o.allShop) paintShopWindow(c, px, H - FH, o, night, k);
    else if (o.arcade) paintArcade(c, px, H - FH, o, night);
    else paintWindow(c, px + 12, H - 18, o, night, hash(o.seed, k * 3 + 99), true, 0);
  }
  if (o.awning && !night) for (const k of o.awning.cols) paintAwning(c, k * TS, H - FH, o.awning.col);
  if (o.sign) paintSign(c, W, H, o, night);
  if (o.special && !night) o.special(c, W, H, fy0);
  if (o.specialNight && night) o.specialNight(c, W, H, fy0);
}
function paintRoof(c, W, fy0, o, r) {
  const rf = o.roof, rD = shade(rf, -0.25), rL = shade(rf, 0.18);
  if (o.roofType === 'flat') {
    R(c, 0, 4, W, fy0 - 4, '#8a8278'); for (let i = 0; i < W * fy0 / 12; i++) P(c, r() * W, 4 + r() * (fy0 - 4), r() > 0.5 ? '#7c7468' : '#9a9288');
    R(c, 0, 4, W, 2, '#b4ac9c'); R(c, 0, fy0 - 3, W, 3, '#5e5c58'); R(c, 0, 4, 2, fy0 - 4, '#b4ac9c'); R(c, W - 2, 4, 2, fy0 - 4, '#5e5c58');
    if (W > 60) { R(c, W - 30, fy0 - 12, 14, 9, '#9a9ca0'); R(c, W - 30, fy0 - 12, 14, 1, '#c0c2c6'); }
    if (o.solar) for (let k = 6; k < W - 20; k += 16) { R(c, k, 7, 14, 6, '#1e3a6a'); R(c, k, 7, 14, 1, '#4a6a9a'); R(c, k + 7, 7, 1, 6, '#4a6a9a'); }
    return;
  }
  /* Ziegeldach (Teja) */
  const top = 2;
  R(c, 0, top, W, fy0 - top, rf);
  for (let yy = top + 2; yy < fy0 - 2; yy += 4) { R(c, 0, yy, W, 1, rD); for (let xx = (Math.floor(yy / 4) % 2) * 3; xx < W; xx += 6) { R(c, xx, yy - 2, 3, 2, rL); P(c, xx + 1, yy - 1, shade(rf, 0.05)); } }
  R(c, 0, fy0 - 3, W, 3, shade(rf, -0.4));
  R(c, 0, top, W, 2, rD);
}
function paintWindow(c, cx, y, o, night, h, ground, floor) {
  const lit = night && h > 0.42;
  const glass = lit ? (h > 0.85 ? '#ffe9b0' : '#ffd27a') : '#3e4c5e';
  if (night && !lit) return;
  const ww = 9, wh = ground ? 12 : 13;
  const x0 = cx - Math.floor(ww / 2);
  if (!night) {
    R(c, x0 - 1, y - 1, ww + 2, wh + 2, o.trim);
    if (o.wins === 'arch') { R(c, x0, y - 2, ww, 1, o.trim); P(c, x0 + 1, y - 3, o.trim); P(c, x0 + ww - 2, y - 3, o.trim); }
  }
  R(c, x0, y, ww, wh, glass);
  if (!night) {
    P(c, x0 + 1, y + 1, '#8fa4b8'); P(c, x0 + 2, y + 1, '#6a7e94'); P(c, x0 + 1, y + 2, '#8fa4b8');
    R(c, x0 + Math.floor(ww / 2), y, 1, wh, o.trim); R(c, x0, y + Math.floor(wh / 2), ww, 1, o.trim);
    if (o.shutter) { R(c, x0 - 4, y, 3, wh, o.shutter); R(c, x0 + ww + 1, y, 3, wh, o.shutter); for (let k = 1; k < wh; k += 2) { P(c, x0 - 3, y + k, shade(o.shutter, -0.3)); P(c, x0 + ww + 2, y + k, shade(o.shutter, -0.3)); } }
    if (o.balcony && !ground && h > 0.35) { const bw = ww + 8; R(c, cx - bw / 2, y + wh + 1, bw, 2, '#5a5048'); for (let k = 0; k < bw; k += 2) R(c, cx - bw / 2 + k, y + wh - 4, 1, 5, '#3a3430'); R(c, cx - bw / 2, y + wh - 5, bw, 1, '#3a3430'); if (h > 0.6) { P(c, cx - 3, y + wh - 6, '#e8402e'); P(c, cx + 2, y + wh - 6, '#3f8e4b'); P(c, cx + 3, y + wh - 7, '#e86ab0'); } }
    if (o.curtain && h > 0.5) R(c, x0, y, 3, wh, o.curtain);
  } else R(c, x0 + Math.floor(ww / 2), y, 1, wh, shade(glass, -0.35));
}
function paintDoor(c, px, py, d, o, night) {
  const t = d.type || 'door';
  if (night) { if (t === 'glass' || d.lit) R(c, px + 4, py + 4, 16, 17, '#ffdc8a'); return; }
  if (t === 'arch') { R(c, px + 2, py + 2, 20, 20, shade(o.wall, -0.25)); R(c, px + 4, py + 6, 16, 16, '#2a2622'); R(c, px + 5, py + 4, 14, 2, '#2a2622'); R(c, px + 7, py + 3, 10, 1, '#2a2622'); return; }
  R(c, px + 2, py + 2, 20, 20, o.trim); R(c, px + 3, py + 3, 18, 1, shade(o.trim, -0.15));
  if (t === 'glass') { R(c, px + 4, py + 4, 16, 18, '#5a7086'); R(c, px + 4, py + 4, 16, 18, 'rgba(160,190,210,0.25)'); R(c, px + 11, py + 4, 2, 18, '#2e3a46'); P(c, px + 5, py + 5, '#c4d8e8'); P(c, px + 6, py + 6, '#c4d8e8'); R(c, px + 9, py + 12, 1, 3, '#c9cdd2'); R(c, px + 14, py + 12, 1, 3, '#c9cdd2'); return; }
  const dc = d.col || '#6a4428';
  R(c, px + 4, py + 4, 16, 18, dc); R(c, px + 4, py + 4, 16, 1, shade(dc, 0.2));
  R(c, px + 6, py + 7, 4, 5, shade(dc, -0.2)); R(c, px + 14, py + 7, 4, 5, shade(dc, -0.2)); R(c, px + 6, py + 15, 4, 4, shade(dc, -0.2)); R(c, px + 14, py + 15, 4, 4, shade(dc, -0.2));
  R(c, px + 11, py + 4, 2, 18, shade(dc, -0.35)); P(c, px + 14, py + 13, '#e8c84a');
}
function paintShopWindow(c, px, py, o, night, k) {
  if (night) { R(c, px + 3, py + 4, 18, 13, '#ffe3a8'); return; }
  R(c, px + 2, py + 3, 20, 16, o.shopFrame || '#3a3430'); R(c, px + 3, py + 4, 18, 13, '#6a7e90');
  const g = o.goods || ['#c8352d', '#e8c23a', '#2f5fb8'];
  for (let i = 0; i < 5; i++) R(c, px + 4 + i * 3.5, py + 11 + (i % 2), 3, 5 - (i % 2), g[(i + k) % g.length]);
  P(c, px + 4, py + 5, '#c9dcea'); P(c, px + 5, py + 6, '#c9dcea');
  R(c, px + 2, py + 19, 20, 1, shade(o.wall, -0.3));
}
function paintArcade(c, px, py, o, night) {
  if (night) return;
  R(c, px, py, TS, TS, shade(o.wall, -0.2)); R(c, px + 3, py + 6, 18, 18, '#3a3530'); R(c, px + 4, py + 4, 16, 2, '#3a3530'); R(c, px + 7, py + 3, 10, 1, '#3a3530');
  R(c, px + 6, py + 12, 12, 8, '#5a6a7a'); R(c, px + 6, py + 12, 12, 1, '#8a9aa8');
}
function paintAwning(c, px, py, col) {
  for (let k = 0; k < 7; k++) for (let xx = 0; xx < TS; xx++) P(c, px + xx, py - 3 + k, (Math.floor(xx / 3) % 2) ? col : '#f4f0e6');
  for (let xx = 0; xx < TS; xx += 6) R(c, px + xx, py + 4, 3, 1, col);
}
function paintSign(c, W, H, o, night) {
  const s = o.sign;
  const sc = s.scale || 1;
  const tw = pxTextW(s.text, sc) + 6;
  const sx = s.x !== undefined ? s.x : Math.round(W / 2 - tw / 2), sy = s.y !== undefined ? s.y : H - 32;
  if (night && !s.lit) return;
  R(c, sx, sy, tw, 7 * sc + 2, s.bg); if (!night) R(c, sx, sy + 7 * sc + 1, tw, 1, shade(s.bg, -0.3));
  pxText(c, s.text, sx + 3, sy + 2, s.fg, sc);
}
/* --- Hochhaus (Colba) --- */
function objTower(x, y, w, h, o = {}) {
  const floors = o.floors || 12;
  return mkObj(x, y, w, h, floors * 14 + 10, (c, W, H) => {
    const fh = floors * 14, fy0 = H - fh - 2;
    R(c, 0, fy0 - 4, W, 4, '#6a6e74'); R(c, 0, fy0 - 4, W, 1, '#9a9ea4');
    R(c, W / 2 - 2, fy0 - 18, 3, 14, '#4a4e54'); P(c, W / 2 - 1, fy0 - 19, '#ff3a3a');
    R(c, 0, fy0, W, fh, '#c8ccd0');
    for (let f = 0; f < floors; f++) {
      const yy = fy0 + f * 14;
      R(c, 0, yy, W, 1, '#8a8e94'); R(c, 0, yy + 1, W, 1, '#e4e8ec');
      for (let k = 6; k < W - 6; k += 12) { R(c, k, yy + 4, 8, 8, f === floors - 2 ? '#2a9aa0' : (hash(f, k) > 0.5 ? '#4a6a8a' : '#6a8aaa')); R(c, k, yy + 4, 8, 1, '#a8c8e0'); }
    }
    R(c, 0, fy0, 2, fh, '#e8ecf0'); R(c, W - 2, fy0, 2, fh, '#7a7e84');
    /* Erdgeschoss: Eingang mit Glastür, Klingelbrett daneben */
    R(c, 0, H - 26, W, 26, '#9a948a'); R(c, 0, H - 26, W, 2, '#b8b2a6');
    const dx = W / 2 - 12;
    R(c, dx - 3, H - 24, 30, 23, '#4a4e54'); R(c, dx, H - 22, 24, 20, '#7a9ab8'); R(c, dx + 11, H - 22, 2, 20, '#2e3a46'); R(c, dx + 5, H - 10, 1, 4, '#d8dce0'); R(c, dx + 17, H - 10, 1, 4, '#d8dce0');
    R(c, dx + 30, H - 20, 8, 14, '#d8c890'); for (let k = 0; k < 6; k++) { P(c, dx + 32, H - 18 + k * 2, '#5a5048'); P(c, dx + 35, H - 18 + k * 2, '#5a5048'); }
    if (o.sign) { R(c, W / 2 - 24, H - 34, 48, 9, '#1e2a3a'); pxText(c, o.sign, W / 2 - pxTextW(o.sign) / 2, H - 32, '#7ad0d8'); }
    R(c, 0, H - 3, W, 3, '#8f887c');
  }, { emit: (c, W, H) => { const fh = floors * 14, fy0 = H - fh - 2; for (let f = 0; f < floors; f++) for (let k = 6; k < W - 6; k += 12) if (hash(f, k, 3) > 0.45) R(c, k, fy0 + f * 14 + 4, 8, 8, '#ffe9b0'); R(c, W / 2 - 12, H - 22, 24, 20, '#ffe9b0'); }, bld: { roof: '#6a6e74', wall: '#c8ccd0' } });
}
/* --- Innenmöbel --- */
function objCounter(x, y, w, h, o = {}) {
  const top = o.top || '#7a4a2a', front = o.front || '#4a2c18';
  return mkObj(x, y, w, h, 6, (c, W, H) => {
    R(c, 0, 0, W, H, top); R(c, 0, 0, W, 3, shade(top, 0.22)); R(c, 0, H - 12, W, 12, front); R(c, 0, H - 12, W, 1, shade(front, -0.3));
    for (let k = 9; k < W; k += 18) R(c, k, H - 10, 1, 8, shade(front, 0.15));
    if (o.taps) for (let k = 0; k < o.taps; k++) { const tx = 14 + k * 13; R(c, tx, 2, 5, 9, '#c9ccd2'); R(c, tx + 1, 0, 3, 4, ['#c8352d', '#2f7a3a', '#e8c23a', '#2f5fb8'][k % 4]); }
    if (o.reg) { R(c, W - 20, 0, 14, 10, '#2a2a2e'); R(c, W - 18, 2, 10, 5, '#7ad0f0'); }
    if (o.glasses) for (let k = 0; k < Math.floor(W / 12); k++) { R(c, 6 + k * 12, 3, 4, 6, 'rgba(230,240,245,0.8)'); R(c, 6 + k * 12, 3, 4, 1, '#ffffff'); }
  }, { solid: true });
}
function objStool(x, y, col = '#c8352d') { return mkObj(x, y, 1, 1, 6, (c, W, H) => { E(c, 12, H - 3, 6, 1, 'rgba(0,0,0,0.25)'); R(c, 11, H - 13, 2, 10, '#6a6e74'); E(c, 12, H - 15, 6, 3, col); E(c, 12, H - 16, 5, 2, shade(col, 0.25)); }, { solid: false }); }
function objChair(x, y, dir = 0, col = '#8a5a32') {
  return mkObj(x, y, 1, 1, 10, (c, W, H) => {
    E(c, 12, H - 2, 7, 1, 'rgba(0,0,0,0.2)');
    R(c, 5, H - 12, 14, 5, col); R(c, 5, H - 12, 14, 1, shade(col, 0.25));
    R(c, 6, H - 7, 2, 6, shade(col, -0.3)); R(c, 16, H - 7, 2, 6, shade(col, -0.3));
    if (dir === 0) { R(c, 5, H - 22, 14, 10, shade(col, -0.1)); R(c, 5, H - 22, 14, 1, shade(col, 0.2)); R(c, 7, H - 20, 10, 6, shade(col, -0.2)); }
    if (dir === 3) { R(c, 5, H - 15, 14, 3, shade(col, -0.2)); }
  }, { solid: false });
}
function objOfficeChair(x, y, col = '#2a2a30') {
  return mkObj(x, y, 1, 1, 12, (c, W, H) => { E(c, 12, H - 2, 8, 2, 'rgba(0,0,0,0.2)'); for (let k = 0; k < 5; k++) line(c, 12, H - 6, 12 + Math.cos(k * 1.26) * 7, H - 3 + Math.sin(k * 1.26) * 2, '#5a5e64'); R(c, 11, H - 12, 2, 7, '#5a5e64'); R(c, 5, H - 16, 14, 5, col); R(c, 5, H - 16, 14, 1, shade(col, 0.3)); R(c, 6, H - 26, 12, 10, shade(col, -0.1)); R(c, 7, H - 24, 10, 6, shade(col, 0.15)); }, { solid: false });
}
function objTable(x, y, w = 2, h = 1, o = {}) {
  const col = o.col || '#a87a4a';
  return mkObj(x, y, w, h, 8, (c, W, H) => {
    R(c, 1, 2, W - 2, H - 8, col); R(c, 1, 2, W - 2, 2, shade(col, 0.25)); R(c, 1, H - 7, W - 2, 1, shade(col, -0.3));
    R(c, 3, H - 6, 3, 6, shade(col, -0.35)); R(c, W - 6, H - 6, 3, 6, shade(col, -0.35));
    if (o.cloth) { R(c, 1, 2, W - 2, H - 8, o.cloth); for (let k = 0; k < W; k += 8) for (let j = 2; j < H - 8; j += 8) if (((k + j) / 8) % 2 === 0) R(c, k, j, 4, 4, shade(o.cloth, 0.3)); }
    if (o.laptops) for (let k = 0; k < o.laptops; k++) { const lx = 6 + k * 24; R(c, lx, 4, 14, 9, '#3a3a40'); R(c, lx + 1, 5, 12, 6, '#7ad0f0'); R(c, lx + 2, 6, 6, 1, '#ffffff'); R(c, lx - 1, 13, 16, 2, '#8a8e94'); }
    if (o.items) o.items(c, W, H);
  }, { solid: true });
}
function objDesk(x, y, w = 2, o = {}) {
  return mkObj(x, y, w, 1, 10, (c, W, H) => {
    R(c, 0, 2, W, H - 8, '#e8e4dc'); R(c, 0, 2, W, 2, '#f8f4ec'); R(c, 1, H - 6, 3, 6, '#8a8e94'); R(c, W - 4, H - 6, 3, 6, '#8a8e94');
    R(c, 6, 4, 16, 10, '#3a3a40'); R(c, 7, 5, 14, 7, o.screen || '#7ad0f0'); R(c, 8, 6, 8, 1, '#ffffff'); R(c, 8, 8, 5, 1, '#ffffff'); R(c, 12, 14, 4, 2, '#5a5e64');
    if (W > 30) { R(c, W - 16, 6, 10, 7, '#f4f0e6'); R(c, W - 15, 7, 8, 1, '#8a8e94'); R(c, W - 15, 9, 6, 1, '#8a8e94'); }
    if (o.coffee) { R(c, W - 7, 3, 4, 4, '#f4f0e6'); R(c, W - 6, 4, 2, 1, '#6a4428'); }
  }, { solid: true, emit: (c, W) => R(c, 7, 5, 14, 7, '#9ae0ff') });
}
function objSofa(x, y, w = 3, col = '#5a2a2a', dir = 0) {
  return mkObj(x, y, w, 1, 10, (c, W, H) => { R(c, 0, H - 12, W, 10, col); R(c, 0, H - 22, W, 10, shade(col, -0.15)); R(c, 0, H - 22, W, 1, shade(col, 0.2)); R(c, 0, H - 14, 4, 12, shade(col, 0.1)); R(c, W - 4, H - 14, 4, 12, shade(col, 0.1)); for (let k = 6; k < W - 6; k += (W - 12) / 2) R(c, k, H - 12, 1, 8, shade(col, -0.3)); }, { solid: true });
}
function objBed(x, y) {
  return mkObj(x, y, 2, 2, 8, (c, W, H) => { R(c, 1, 0, W - 2, H - 2, '#6a4428'); R(c, 3, 10, W - 6, H - 14, '#f4f0e6'); R(c, 3, 18, W - 6, H - 22, '#2f7fa8'); R(c, 3, 18, W - 6, 2, '#5aa0c8'); R(c, 5, 3, 16, 7, '#ffffff'); R(c, W - 21, 3, 16, 7, '#ffffff'); R(c, 1, 0, W - 2, 3, '#8a5a34'); }, { solid: true });
}
function objWardrobe(x, y, w = 2) { return mkObj(x, y, w, 1, 28, (c, W, H) => { R(c, 0, 0, W, H, '#8a5e3a'); R(c, 0, 0, W, 3, '#a87a50'); R(c, W / 2, 4, 1, H - 6, '#4a3020'); R(c, 4, 6, W / 2 - 7, H - 12, '#9a6e46'); R(c, W / 2 + 4, 6, W / 2 - 7, H - 12, '#9a6e46'); R(c, W / 2 - 3, H / 2, 2, 3, '#e8c84a'); R(c, W / 2 + 2, H / 2, 2, 3, '#e8c84a'); }); }
function objPlant(x, y, big = false) { return mkObj(x, y, 1, 1, big ? 26 : 18, (c, W, H) => { E(c, 12, H - 2, 7, 1, 'rgba(0,0,0,0.25)'); R(c, 6, H - 12, 12, 11, '#b0603a'); R(c, 6, H - 12, 12, 2, '#c8784a'); for (let i = 0; i < 9; i++) { const a = -2.7 + i * 0.3; line(c, 12, H - 12, 12 + Math.cos(a) * (big ? 14 : 10), H - 12 + Math.sin(a) * (big ? 18 : 12), i % 2 ? '#3f8a3a' : '#2f6a2e'); } }); }
function objWhiteboard(x, y, w = 3, o = {}) {
  return mkObj(x, y, w, 1, 30, (c, W, H) => {
    R(c, 1, 0, W - 2, H - 4, '#8a8e94'); R(c, 3, 2, W - 6, H - 8, '#f8f8f6');
    const cols = ['#ffe066', '#ff9f6b', '#9be5a0', '#8ec5ff', '#f5a3d0'];
    if (o.notes !== false) for (let k = 0; k < Math.floor((W - 10) / 11); k++) for (let j = 0; j < 2; j++) if (hash(x + k, y + j, 5) > 0.3) { R(c, 5 + k * 11, 5 + j * 11, 9, 9, cols[(k + j) % 5]); R(c, 6 + k * 11, 7 + j * 11, 6, 1, 'rgba(0,0,0,0.3)'); R(c, 6 + k * 11, 9 + j * 11, 4, 1, 'rgba(0,0,0,0.3)'); }
    if (o.title) pxText(c, o.title, 5, H - 11, '#2a4a8a');
    if (o.graph) { line(c, 6, H - 8, W - 8, H - 18, '#c8352d'); line(c, 6, H - 12, W - 8, H - 9, '#2f5fb8'); }
    R(c, 3, H - 6, W - 6, 2, '#b0b4b8'); R(c, 6, H - 7, 6, 1, '#c8352d'); R(c, 14, H - 7, 6, 1, '#2f5fb8');
    R(c, 2, H - 4, 3, 4, '#5a5e64'); R(c, W - 5, H - 4, 3, 4, '#5a5e64');
  }, { solid: true });
}
function objFlipchart(x, y) { return mkObj(x, y, 1, 1, 30, (c, W, H) => { R(c, 3, 2, 18, 22, '#f8f8f4'); R(c, 2, 0, 20, 3, '#8a8e94'); for (let k = 0; k < 5; k++) R(c, 6, 7 + k * 3, 8 + (k * 3) % 6, 1, '#2a4a8a'); E(c, 14, 16, 3, 3, '#c8352d'); R(c, 11, 24, 2, 8, '#5a5e64'); line(c, 11, 32, 6, H - 1, '#5a5e64'); line(c, 13, 32, 18, H - 1, '#5a5e64'); }); }
function objScreen(x, y, w = 3) { return mkObj(x, y, w, 1, 30, (c, W, H) => { R(c, 2, 0, W - 4, H - 8, '#1a1a1e'); R(c, 4, 2, W - 8, H - 12, '#1e3a5a'); pxText(c, _t('PI PLANNING'), W / 2 - pxTextW(_t('PI PLANNING')) / 2, 6, '#7ad0d8'); for (let k = 0; k < 3; k++) { R(c, 8 + k * ((W - 16) / 3), 16, (W - 16) / 3 - 4, 6, ['#e2554a', '#2fa0d8', '#f0a23a'][k]); } R(c, W / 2 - 2, H - 8, 4, 6, '#5a5e64'); R(c, W / 2 - 8, H - 3, 16, 3, '#5a5e64'); }, { solid: true, emit: (c, W, H) => R(c, 4, 2, W - 8, H - 12, 'rgba(120,200,255,0.5)') }); }
function objCoffee(x, y) { return mkObj(x, y, 1, 1, 14, (c, W, H) => { R(c, 3, 0, 18, H - 4, '#e8e4dc'); R(c, 3, 0, 18, 3, '#2a2a2e'); R(c, 5, 4, 14, 8, '#2a2a2e'); R(c, 7, 6, 10, 3, '#7ad0f0'); R(c, 9, 13, 6, 6, '#5a5e64'); R(c, 10, H - 7, 4, 3, '#f4f0e6'); R(c, 4, H - 4, 16, 4, '#8a8e94'); }, { solid: true, anim: (c, t, px, py) => { for (let k = 0; k < 2; k++) { const ph = (t * 0.5 + k * 0.5) % 1; c.fillStyle = `rgba(255,255,255,${0.4 * (1 - ph)})`; c.fillRect(px + 11 + k * 3 + Math.sin(t * 3 + k) * 1.5, py + 4 - ph * 8, 2, 2); } } }); }
function objFridge(x, y) { return mkObj(x, y, 1, 1, 30, (c, W, H) => { R(c, 3, 0, 18, H - 2, '#d8dce0'); R(c, 3, 0, 18, 1, '#f4f6f8'); R(c, 3, 14, 18, 1, '#8a8e94'); R(c, 17, 4, 2, 7, '#5a5e64'); R(c, 17, 18, 2, 9, '#5a5e64'); R(c, 6, 3, 5, 4, '#e8c23a'); R(c, 7, 19, 4, 5, '#2f5fb8'); }, { solid: true }); }
function objWaterCooler(x, y) { return mkObj(x, y, 1, 1, 24, (c, W, H) => { R(c, 7, 12, 10, H - 14, '#e8e4dc'); R(c, 6, 0, 12, 13, '#8ac8e8'); R(c, 6, 0, 12, 1, '#c8ecf8'); R(c, 8, 2, 3, 8, '#c8ecf8'); R(c, 9, 14, 6, 3, '#2f5fb8'); R(c, 11, 18, 2, 2, '#5a5e64'); }, { solid: true }); }
function objKitchen(x, y, w = 3) { return mkObj(x, y, w, 1, 12, (c, W, H) => { R(c, 0, 2, W, H - 6, '#e4e0d8'); R(c, 0, 2, W, 2, '#f4f0e8'); R(c, 0, H - 14, W, 10, '#8a9098'); for (let k = 12; k < W; k += 24) R(c, k, H - 12, 1, 8, '#6a7078'); R(c, 6, 4, 14, 8, '#c8d0d8'); E(c, 13, 8, 5, 2, '#a8b0b8'); R(c, 12, 0, 1, 5, '#8a8e94'); R(c, W - 20, 4, 14, 8, '#2a2a2e'); E(c, W - 16, 7, 3, 2, '#5a5e64'); E(c, W - 9, 7, 3, 2, '#5a5e64'); }, { solid: true }); }
function objReception(x, y, w = 4) { return mkObj(x, y, w, 1, 12, (c, W, H) => { R(c, 0, 0, W, H, '#6a4428'); R(c, 0, 0, W, 4, '#8a5a34'); R(c, 0, H - 14, W, 14, '#4a2c18'); for (let k = 0; k < W; k += 16) R(c, k + 4, H - 12, 8, 1, '#c9a65a'); R(c, 6, 1, 10, 7, '#2a2a2e'); R(c, 7, 2, 8, 4, '#7ad0f0'); R(c, W - 14, 1, 7, 7, '#f4f0e6'); R(c, W - 13, 2, 5, 1, '#8a8e94'); R(c, W - 24, 2, 5, 5, '#c9a65a'); R(c, W - 23, 1, 3, 1, '#e8d08a'); }, { solid: true }); }
function objVending(x, y) { return mkObj(x, y, 1, 1, 30, (c, W, H) => { R(c, 3, 0, 18, H - 2, '#c8302a'); R(c, 5, 3, 14, 18, '#1a2a3a'); for (let k = 0; k < 3; k++) for (let j = 0; j < 4; j++) R(c, 7 + k * 4, 5 + j * 4, 3, 3, ['#2f5fb8', '#e8c23a', '#ff8c1a', '#f4f0e6'][(k + j) % 4]); R(c, 5, 23, 14, 5, '#5a5e64'); R(c, 15, 2, 3, 1, '#ffffff'); }, { solid: true, emit: (c) => R(c, 5, 3, 14, 18, 'rgba(120,200,255,0.3)') }); }
function objLuggage(x, y) { return mkObj(x, y, 1, 1, 26, (c, W, H) => { R(c, 3, H - 5, 18, 3, '#c9a65a'); R(c, 3, 5, 2, H - 8, '#c9a65a'); R(c, 19, 5, 2, H - 8, '#c9a65a'); R(c, 3, 5, 18, 2, '#e8c870'); R(c, 6, H - 20, 12, 15, '#2f5fb8'); R(c, 7, H - 30, 9, 9, '#8a3a2a'); E(c, 6, H - 1, 1, 1, '#1a1a1a'); E(c, 18, H - 1, 1, 1, '#1a1a1a'); }); }
function objSuitcase(x, y, col = '#2f5fb8') { return mkObj(x, y, 1, 1, 6, (c, W, H) => { R(c, 3, H - 20, 18, 17, col); R(c, 3, H - 20, 18, 1, shade(col, 0.25)); R(c, 9, H - 23, 6, 3, '#2a2a2e'); R(c, 3, H - 13, 18, 1, shade(col, -0.3)); R(c, 5, H - 3, 3, 2, '#1a1a1a'); R(c, 16, H - 3, 3, 2, '#1a1a1a'); }, { solid: false }); }
function objSeats(x, y, w = 3, col = '#2a4a7a') { return mkObj(x, y, w, 1, 8, (c, W, H) => { R(c, 1, H - 14, W - 2, 8, col); R(c, 1, H - 22, W - 2, 8, shade(col, -0.15)); R(c, 1, H - 22, W - 2, 1, shade(col, 0.2)); for (let k = 0; k < W; k += 24) R(c, k, H - 22, 1, 16, '#5a5e64'); R(c, 2, H - 6, 2, 6, '#5a5e64'); R(c, W - 4, H - 6, 2, 6, '#5a5e64'); }, { solid: true }); }
function objSignpost(x, y, text, col = '#1e3a6a') { return mkObj(x, y, 1, 1, 30, (c, W, H) => { R(c, 11, 8, 2, H - 9, '#5a5e64'); const tw = pxTextW(text) + 6; R(c, 12 - tw / 2, 0, tw, 9, col); pxText(c, text, 12 - tw / 2 + 3, 2, '#ffffff'); }, { solid: false }); }
function objFountain(x, y) {
  return mkObj(x, y, 3, 2, 22, (c, W, H) => {
    E(c, W / 2, H - 6, W / 2 - 2, 10, '#9a948a'); E(c, W / 2, H - 7, W / 2 - 4, 8, '#3a9ac8'); E(c, W / 2, H - 7, W / 2 - 6, 6, '#5ab8e0');
    R(c, W / 2 - 5, H - 30, 10, 20, '#a8a098'); R(c, W / 2 - 7, H - 32, 14, 3, '#b8b0a8');
    R(c, W / 2 - 3, H - 44, 6, 12, '#8a8278'); E(c, W / 2, H - 46, 3, 3, '#8a8278'); R(c, W / 2 - 8, H - 38, 5, 2, '#8a8278'); R(c, W / 2 + 3, H - 40, 6, 2, '#8a8278');
    for (let k = 0; k < 8; k++) { const a = k / 8 * 6.28; E(c, W / 2 + Math.cos(a) * 16, H - 14 + Math.sin(a) * 5, 2, 3, '#7a7268'); }
  }, { solid: true, anim: (c, t, px, py) => { for (let k = 0; k < 6; k++) { const ph = (t * 0.7 + k / 6) % 1; c.fillStyle = `rgba(220,245,255,${0.8 * (1 - ph)})`; c.fillRect(px + 36 + Math.sin(k * 2.1) * ph * 14, py + 30 - Math.sin(ph * 3.14) * 16, 2, 2); } } });
}
function objKiosk(x, y, label = 'HORCHATA', col = '#e07b25') {
  return mkObj(x, y, 2, 1, 26, (c, W, H) => {
    R(c, 2, 10, W - 4, H - 14, '#f4ead8'); R(c, 2, 10, W - 4, 2, '#d8cab0');
    for (let k = 0; k < W; k += 8) { R(c, k, 2, 8, 8, (k / 8) % 2 ? col : '#f8f4ec'); }
    R(c, 0, 10, W, 2, shade(col, -0.3));
    R(c, 5, 14, W - 10, 10, '#3a3a40'); R(c, 6, 15, W - 12, 8, '#8ac8e8');
    const tw = pxTextW(label) + 4; R(c, W / 2 - tw / 2, 3, tw, 7, '#2a1a10'); pxText(c, label, W / 2 - tw / 2 + 2, 4, '#f8e8c8');
    R(c, 2, H - 4, W - 4, 4, '#8a7a60');
  }, { solid: true, light: { dx: 24, dy: 10, r: 40, c: '#ffd78a' }, emit: (c, W) => R(c, 6, 15, W - 12, 8, '#ffe8b0') });
}
function objMarketStall(x, y, kind = 'fish', w = 2) {
  const cols = { fish: ['#9ab0b8', '#c8d8dc', '#e86a7a'], fruit: ['#ff8c1a', '#e8c23a', '#c8352d'], jamon: ['#a83a30', '#c85a4a', '#f4e8d8'], veg: ['#3f8e4b', '#e8402e', '#9a5ae0'], spice: ['#e8a020', '#c8352d', '#8a4a2a'], flowers: ['#e86ab0', '#f2c23a', '#ffffff'] };
  const g = cols[kind] || cols.fruit;
  return mkObj(x, y, w, 1, 28, (c, W, H) => {
    for (let k = 0; k < W; k += 8) R(c, k, 0, 8, 7, (k / 8) % 2 ? g[0] : '#f8f4ec');
    for (let k = 0; k < W; k += 8) { c.fillStyle = (k / 8) % 2 ? g[0] : '#f8f4ec'; c.beginPath(); c.moveTo(k, 7); c.lineTo(k + 8, 7); c.lineTo(k + 4, 11); c.closePath(); c.fill(); }
    R(c, 2, 8, 2, H - 10, '#6a4a2a'); R(c, W - 4, 8, 2, H - 10, '#6a4a2a');
    R(c, 1, H - 16, W - 2, 14, '#8a5e3a'); R(c, 1, H - 16, W - 2, 2, '#a87a50');
    if (kind === 'fish') { R(c, 3, H - 15, W - 6, 6, '#e8f4f8'); for (let k = 0; k < (W - 8) / 7; k++) { E(c, 7 + k * 7, H - 12, 3, 1.5, k % 2 ? g[0] : g[1]); P(c, 9 + k * 7, H - 12, '#1a1a1a'); } }
    else for (let k = 0; k < (W - 6) / 5; k++) for (let j = 0; j < 2; j++) E(c, 5 + k * 5, H - 13 + j * 3, 2, 2, g[(k + j) % 3]);
    if (kind === 'jamon') { for (let k = 0; k < 3; k++) { R(c, 6 + k * 10, 9, 5, 12, '#a83a30'); R(c, 7 + k * 10, 9, 3, 3, '#f4e8d8'); P(c, 8 + k * 10, 21, '#f4e8d8'); } }
  }, { solid: true });
}
function objBarrel(x, y) { return mkObj(x, y, 1, 1, 14, (c, W, H) => { E(c, 12, H - 2, 7, 2, 'rgba(0,0,0,0.25)'); R(c, 5, H - 22, 14, 20, '#8a5a32'); R(c, 4, H - 20, 16, 16, '#9a6a3c'); R(c, 4, H - 18, 16, 2, '#3a3a3e'); R(c, 4, H - 8, 16, 2, '#3a3a3e'); R(c, 6, H - 20, 1, 16, '#b88a5a'); }, { solid: true }); }
function objDJ(x, y) { return mkObj(x, y, 2, 1, 16, (c, W, H) => { R(c, 0, 4, W, H - 8, '#1a1a22'); R(c, 0, 4, W, 2, '#3a3a48'); R(c, 4, 6, 14, 8, '#2a2a36'); E(c, 11, 10, 5, 3, '#1a1a1e'); E(c, 11, 10, 1, 1, '#c8352d'); R(c, W - 18, 6, 14, 8, '#2a2a36'); E(c, W - 11, 10, 5, 3, '#1a1a1e'); for (let k = 0; k < 6; k++) P(c, 20 + k * 2, 8 + (k % 2), ['#ff3ad0', '#3ae0ff', '#ffe03a'][k % 3]); R(c, 0, H - 4, W, 4, '#101016'); }, { solid: true, anim: (c, t, px, py) => { for (let k = 0; k < 4; k++) { c.fillStyle = ['#ff3ad0', '#3ae0ff', '#ffe03a', '#7aff6a'][(k + Math.floor(t * 4)) % 4]; c.fillRect(px + 6 + k * 10, py + 2, 4, 2); } } }); }
function objSpeaker(x, y) { return mkObj(x, y, 1, 1, 22, (c, W, H) => { R(c, 2, 0, 20, H - 1, '#141218'); E(c, 12, 9, 6, 6, '#2a2830'); E(c, 12, 9, 2, 2, '#555'); E(c, 12, 26, 8, 8, '#2a2830'); E(c, 12, 26, 3, 3, '#555'); }); }
function objBuoy(x, y, col = '#ff8c1a') { return mkObj(x, y, 1, 1, 8, (c, W, H) => { E(c, 12, H - 4, 6, 3, col); R(c, 10, H - 14, 4, 10, col); R(c, 10, H - 14, 4, 2, '#1a1a1e'); P(c, 11, H - 16, '#ffffff'); }, { solid: true }); }
function objSailboat(x, y, col = '#f4f0e6', sail = '#ffffff') {
  return mkObj(x, y, 2, 1, 44, (c, W, H) => {
    E(c, W / 2, H - 4, W / 2 - 3, 4, col); R(c, 4, H - 12, W - 8, 8, col); R(c, 4, H - 12, W - 8, 1, shade(col, -0.2)); R(c, 4, H - 6, W - 8, 2, '#2f5fb8');
    R(c, W / 2 - 1, 2, 2, H - 12, '#6a4a2a');
    for (let k = 0; k < 30; k++) { const w = Math.round(k * 0.6); R(c, W / 2 + 1, 4 + k, w, 1, sail); }
    for (let k = 0; k < 20; k++) { const w = Math.round(k * 0.4); R(c, W / 2 - 1 - w, 12 + k, w, 1, shade(sail, -0.1)); }
    P(c, W / 2, 1, '#c8352d');
  }, { solid: true });
}
function objGoal(x, y) { return mkObj(x, y, 1, 2, 20, (c, W, H) => { R(c, 2, 0, 2, H - 2, '#f4f0e6'); R(c, 2, 0, 20, 2, '#f4f0e6'); R(c, 20, 0, 2, H - 2, '#f4f0e6'); for (let k = 4; k < 20; k += 3) for (let j = 2; j < H - 2; j += 3) P(c, k, j, 'rgba(255,255,255,0.5)'); }, { solid: true }); }
function objLifeguard(x, y) { return mkObj(x, y, 2, 1, 40, (c, W, H) => { R(c, 6, 20, 3, H - 22, '#e8e4dc'); R(c, W - 9, 20, 3, H - 22, '#e8e4dc'); R(c, 4, 14, W - 8, 8, '#f4f0e6'); R(c, 4, 4, W - 8, 10, '#c8352d'); R(c, 4, 4, W - 8, 2, '#f4f0e6'); R(c, 8, 7, 10, 5, '#7ad0f0'); R(c, 2, 0, W - 4, 4, '#2a2a2e'); }, { solid: true }); }
function objFalla(x, y) {
  return mkObj(x, y, 3, 2, 70, (c, W, H) => {
    E(c, W / 2, H - 6, W / 2 - 2, 8, '#d8a040'); E(c, W / 2, H - 8, W / 2 - 4, 6, '#f0c060');
    R(c, W / 2 - 14, H - 40, 28, 32, '#e8b040'); R(c, W / 2 - 14, H - 40, 28, 2, '#f8d870');
    R(c, W / 2 - 10, H - 50, 20, 12, '#2f5fb8'); R(c, W / 2 - 12, H - 52, 24, 3, '#ffffff');
    E(c, W / 2, H - 62, 10, 10, '#f4c8a0'); E(c, W / 2 - 4, H - 64, 1.5, 1.5, '#1a1a1a'); E(c, W / 2 + 4, H - 64, 1.5, 1.5, '#1a1a1a'); R(c, W / 2 - 4, H - 58, 8, 2, '#c8352d');
    for (let k = 0; k < 12; k++) { const a = k / 12 * 6.28; E(c, W / 2 + Math.cos(a) * 12, H - 66 + Math.sin(a) * 10, 2, 2, ['#c8352d', '#e8c23a', '#2f5fb8', '#3f8e4b'][k % 4]); }
    R(c, W / 2 - 20, H - 30, 8, 22, '#c8352d'); E(c, W / 2 - 16, H - 34, 5, 5, '#f4c8a0'); R(c, W / 2 + 12, H - 26, 8, 18, '#3f8e4b'); E(c, W / 2 + 16, H - 30, 5, 5, '#f4c8a0');
    pxText(c, 'FALLA', W / 2 - pxTextW('FALLA') / 2, H - 20, '#7a2a10');
  }, { solid: true });
}
function objMicalet(x, y) {
  return mkObj(x, y, 3, 2, 120, (c, W, H) => {
    const cx = W / 2;
    R(c, cx - 22, 20, 44, H - 24, '#d8c8a8'); R(c, cx - 22, 20, 4, H - 24, '#e8dcc0'); R(c, cx + 18, 20, 4, H - 24, '#b8a888');
    for (let yy = 26; yy < H - 10; yy += 6) R(c, cx - 22, yy, 44, 1, '#c0b090');
    for (let k = 0; k < 3; k++) { R(c, cx - 14 + k * 12, 30 + k * 0, 6, 14, '#5a4a3a'); R(c, cx - 14 + k * 12, 30, 6, 2, '#2a2420'); }
    R(c, cx - 24, 16, 48, 4, '#c8b898'); for (let k = -22; k < 24; k += 8) R(c, cx + k, 10, 5, 6, '#c8b898');
    R(c, cx - 4, 2, 8, 10, '#8a7a5a'); P(c, cx, 0, '#1a1a1a');
    R(c, cx - 20, H - 36, 40, 1, '#b8a888'); R(c, cx - 8, H - 24, 16, 20, '#3a2a1a'); R(c, cx - 6, H - 22, 12, 1, '#5a4a3a');
    R(c, cx - 28, H - 4, 56, 4, '#9a948a');
  }, { padX: 12, solid: true });
}
function objSerranos(x, y, w = 4) {
  return mkObj(x, y, w, 2, 60, (c, W, H) => {
    R(c, 0, 10, W, H - 14, '#c8b898'); for (let yy = 14; yy < H - 8; yy += 6) R(c, 0, yy, W, 1, '#b0a080');
    for (const tx of [4, W - 34]) { R(c, tx, 0, 30, H - 4, '#d4c4a4'); R(c, tx, 0, 30, 3, '#a89878'); for (let k = 0; k < 30; k += 8) R(c, tx + k, 0, 4, 5, '#d4c4a4'); R(c, tx + 8, 20, 6, 10, '#3a2a1a'); R(c, tx + 18, 20, 6, 10, '#3a2a1a'); }
    R(c, W / 2 - 12, H - 30, 24, 26, '#2a2420'); for (let k = 0; k < 12; k++) { const a = Math.PI + k / 12 * Math.PI; R(c, W / 2 + Math.cos(a) * 12 - 1, H - 30 + Math.sin(a) * 10 + 8, 3, 3, '#b8a888'); }
    R(c, 0, H - 4, W, 4, '#9a948a');
  }, { solid: true });
}
function objHemisferic(x, y, w = 8) {
  return mkObj(x, y, w, 3, 46, (c, W, H) => {
    E(c, W / 2, H - 20, W / 2 - 2, 6, '#3a9ac8');
    for (let k = 0; k < W; k++) { const t = (k - W / 2) / (W / 2); const h = Math.sqrt(Math.max(0, 1 - t * t)) * 40; R(c, k, H - 24 - h, 1, h, k % 7 === 0 ? '#9ab0b8' : '#e8ecf0'); }
    for (let k = 0; k < W; k++) { const t = (k - W / 2) / (W / 2); const h = Math.sqrt(Math.max(0, 1 - t * t)) * 22; R(c, k, H - 24 - h, 1, h, '#5a8ab0'); }
    E(c, W / 2, H - 30, 10, 8, '#2a4a7a'); E(c, W / 2, H - 30, 6, 5, '#1a2a4a');
    R(c, 0, H - 26, W, 2, '#c8ccd0');
  }, { solid: true });
}
function objPaellaStand(x, y) {
  return mkObj(x, y, 2, 1, 24, (c, W, H) => {
    R(c, 2, 8, W - 4, 4, '#8a5e3a'); R(c, 4, 12, 2, H - 14, '#6a4a2a'); R(c, W - 6, 12, 2, H - 14, '#6a4a2a');
    E(c, W / 2, 8, 18, 6, '#2a2a2e'); E(c, W / 2, 7, 16, 5, '#e8b040'); for (let k = 0; k < 14; k++) P(c, W / 2 - 12 + Math.floor(hash(k, 2) * 24), 5 + Math.floor(hash(2, k) * 5), ['#c8352d', '#3f8e4b', '#f4f0e6', '#8a4a2a'][k % 4]);
    R(c, W / 2 - 18, 1, 3, 10, '#2a2a2e'); R(c, W / 2 + 15, 1, 3, 10, '#2a2a2e');
    R(c, 2, H - 4, W - 4, 4, '#8a7a60');
  }, { solid: true, anim: (c, t, px, py) => { for (let k = 0; k < 3; k++) { const ph = (t * 0.4 + k / 3) % 1; c.fillStyle = `rgba(255,255,255,${0.35 * (1 - ph)})`; c.fillRect(px + 14 + k * 8 + Math.sin(t * 2 + k) * 2, py + 4 - ph * 10, 2, 2); } } });
}
function objBelt(x, y, w) {
  return mkObj(x, y, w, 1, 10, (c, W, H) => { R(c, 0, 0, W, H, '#8a8e94'); R(c, 0, 0, W, 3, '#a8acb2'); R(c, 2, 4, W - 4, H - 10, '#3a3c40'); for (let k = 0; k < W; k += 6) R(c, k + 2, 4, 1, H - 10, '#4a4c50'); R(c, 0, H - 6, W, 6, '#6a6e74'); }, { solid: true });
}
function objGrill(x, y) {
  return mkObj(x, y, 2, 1, 18, (c, W, H) => {
    E(c, W / 2, H - 2, 18, 3, 'rgba(0,0,0,0.25)');
    R(c, 6, H - 10, 3, 9, '#2a2a2e'); R(c, W - 9, H - 10, 3, 9, '#2a2a2e'); R(c, 10, H - 3, 28, 2, '#3a3c40');
    E(c, W / 2, H - 14, 20, 7, '#1e1e22'); E(c, W / 2, H - 15, 18, 5, '#3a3c40');
    for (let k = -14; k <= 14; k += 4) R(c, W / 2 + k, H - 18, 1, 7, '#8a8e94');
    E(c, W / 2 - 8, H - 17, 4, 2, '#a83a30'); E(c, W / 2 + 2, H - 17, 5, 2, '#d8902a'); E(c, W / 2 + 10, H - 17, 3, 2, '#e8c23a');
    R(c, W / 2 - 22, H - 30, 44, 12, '#2a2a2e'); R(c, W / 2 - 20, H - 28, 40, 8, '#3a3c40'); R(c, W / 2 - 4, H - 32, 8, 2, '#8a8e94');
    for (let k = 0; k < 6; k++) P(c, W / 2 - 15 + k * 6, H - 16, '#ff6a2a');
  }, { solid: true, light: { dx: 24, dy: 14, r: 50, c: '#ff9a4a' }, anim: (c, t, px, py) => { for (let k = 0; k < 4; k++) { const ph = (t * 0.5 + k / 4) % 1; c.fillStyle = `rgba(200,200,205,${0.4 * (1 - ph)})`; c.fillRect(px + 14 + k * 7 + Math.sin(t * 2 + k) * 2, py + 8 - ph * 14, 3, 3); } } });
}
function objAmp(x, y) {
  return mkObj(x, y, 1, 1, 20, (c, W, H) => {
    R(c, 1, 2, 22, H - 4, '#1a1a1e'); R(c, 1, 2, 22, 1, '#3a3a40'); R(c, 3, 4, 18, 6, '#2a2a30'); for (let k = 0; k < 5; k++) E(c, 5 + k * 3.5, 7, 1, 1, '#c9ccd2'); P(c, 19, 6, '#ff3a3a');
    R(c, 3, 11, 18, H - 15, '#3a3030'); E(c, 12, H - 11, 7, 7, '#1a1a1e'); E(c, 12, H - 11, 3, 3, '#5a5a66');
  }, { solid: true, light: { dx: 20, dy: 6, r: 24, c: '#ff3a3a' } });
}
function objHammock(x, y) { return mkObj(x, y, 3, 1, 20, (c, W, H) => { R(c, 3, 0, 3, H - 2, '#6a4a2a'); R(c, W - 6, 0, 3, H - 2, '#6a4a2a'); for (let k = 6; k < W - 6; k++) { const yy = 6 + Math.sin((k - 6) / (W - 12) * 3.14) * 9; R(c, k, yy, 1, 4, k % 4 < 2 ? '#e8c23a' : '#2f8fd8'); } }, { solid: true }); }
/* Bassgitarre quer vor der Figur (Carlos) */
function drawBass(c, x, y, a) { const s = a.dir === 1 ? -1 : 1; line(c, x - 9 * s, y - 14, x + 7 * s, y - 24, '#5a3a1a'); line(c, x - 9 * s, y - 15, x + 7 * s, y - 25, '#8a5a2a'); E(c, x - 7 * s, y - 14, 5, 4, '#8a1e1e'); E(c, x - 10 * s, y - 11, 4, 3, '#8a1e1e'); R(c, x + 6 * s, y - 27, 3, 4, '#2a2a2e'); for (let k = 0; k < 4; k++) P(c, x - 6 * s + k * 3 * s, y - 15 - k, '#e8e8e8'); }
function objBellPanel(x, y) { return mkObj(x, y, 1, 1, 26, (c, W, H) => { R(c, 4, 0, 16, 24, '#d8c890'); R(c, 4, 0, 16, 1, '#f0e0b0'); for (let k = 0; k < 6; k++) { R(c, 7, 3 + k * 3, 2, 2, '#5a5048'); R(c, 11, 3 + k * 3, 6, 1, '#8a8070'); } R(c, 6, 20, 12, 3, '#8a8070'); R(c, 11, 24, 2, 4, '#8a8e94'); }, { solid: false }); }
function objPadelCourt(x, y) {
  return mkObj(x, y, 6, 4, 10, (c, W, H) => {
    R(c, 0, 10, W, H - 10, '#2f6fb8'); R(c, 0, 10, W, 1, '#8ac8e8'); R(c, 0, H - 1, W, 1, '#8ac8e8'); R(c, 0, 10, 1, H - 10, '#8ac8e8'); R(c, W - 1, 10, 1, H - 10, '#8ac8e8');
    R(c, W / 2 - 1, 10, 2, H - 10, '#f4f0e6'); R(c, 0, H / 2 + 4, W, 1, '#f4f0e6'); R(c, W / 4, 14, 1, H - 16, '#f4f0e6'); R(c, 3 * W / 4, 14, 1, H - 16, '#f4f0e6');
    for (let k = 0; k < W; k += 4) R(c, k, 0, 1, 12, 'rgba(200,220,230,0.5)');
  }, { solid: true });
}
function objKartSign(x, y) { return mkObj(x, y, 3, 1, 36, (c, W, H) => { R(c, 8, 10, 3, H - 12, '#5a5e64'); R(c, W - 11, 10, 3, H - 12, '#5a5e64'); R(c, 2, 0, W - 4, 14, '#1a1a1e'); for (let k = 0; k < W - 4; k += 4) for (let j = 0; j < 2; j++) R(c, 2 + k, j * 4, 4, 4, ((k / 4 + j) % 2) ? '#ffffff' : '#1a1a1e'); R(c, 2, 8, W - 4, 6, '#c8352d'); pxText(c, _t('KART VALENCIA'), W / 2 - pxTextW(_t('KART VALENCIA')) / 2, 8, '#ffffff'); }, { solid: false }); }
function objPainting(x, y, kind) {
  return mkObj(x, y, 1, 1, 18, (c, W, H) => {
    R(c, 2, 0, 20, 16, '#c9a65a'); R(c, 4, 2, 16, 12, '#f4f0e6');
    if (kind === 'sorolla') { R(c, 4, 2, 16, 7, '#8ac8e8'); R(c, 4, 9, 16, 5, '#efe0b8'); E(c, 10, 9, 2, 3, '#f4f0e6'); E(c, 14, 10, 1.5, 2, '#f4c8a0'); }
    if (kind === 'goya') { R(c, 4, 2, 16, 12, '#2a2420'); E(c, 12, 8, 4, 5, '#d8b898'); R(c, 8, 11, 8, 3, '#8a1a1a'); }
    if (kind === 'velazquez') { R(c, 4, 2, 16, 12, '#3a3028'); E(c, 12, 7, 3, 4, '#e8c8a8'); R(c, 9, 10, 6, 4, '#1a1a1a'); R(c, 10, 9, 4, 1, '#f4f0e6'); }
    if (kind === 'greco') { R(c, 4, 2, 16, 12, '#4a4a6a'); R(c, 10, 4, 4, 9, '#c8c8e8'); E(c, 12, 4, 2, 2, '#e8d8c8'); }
    if (kind === 'modern') { R(c, 4, 2, 8, 6, '#c8352d'); R(c, 12, 2, 8, 6, '#2f5fb8'); R(c, 4, 8, 8, 6, '#e8c23a'); R(c, 12, 8, 8, 6, '#f4f0e6'); }
    if (kind === 'bike') { R(c, 4, 2, 16, 12, '#f4ead8'); ring(c, 9, 10, 3, '#2a2a2e'); ring(c, 15, 10, 3, '#2a2a2e'); line(c, 9, 10, 12, 5, '#c8352d'); line(c, 12, 5, 15, 10, '#c8352d'); }
    R(c, 2, 16, 20, 2, '#8a7a50');
  }, { solid: false });
}
function objBikeStand(x, y, n = 3) { return mkObj(x, y, 2, 1, 14, (c, W, H) => { R(c, 0, H - 4, W, 4, '#8a8e94'); for (let k = 0; k < n; k++) { const bx = 4 + k * 14; ring(c, bx + 2, H - 8, 4, '#1e1e22'); ring(c, bx + 10, H - 8, 4, '#1e1e22'); line(c, bx + 2, H - 8, bx + 5, H - 16, ['#2a9aa0', '#e2554a', '#f0a23a'][k % 3]); line(c, bx + 5, H - 16, bx + 10, H - 8, ['#2a9aa0', '#e2554a', '#f0a23a'][k % 3]); R(c, bx + 3, H - 17, 4, 1, '#2a2a2e'); } }, { solid: true }); }
/* Diagnose-Arbeitsplatz: Pult mit PC links, Kabel zum E-Bike auf dem Montageständer rechts */
function objBikeRig(x, y, col = '#2a9aa0', o = {}) {
  return mkObj(x, y, 3, 1, 22, (c, W, H) => {
    /* Pult */
    R(c, 0, 10, 44, H - 16, '#e8e4dc'); R(c, 0, 10, 44, 2, '#f8f4ec'); R(c, 1, H - 6, 3, 6, '#8a8e94'); R(c, 40, H - 6, 3, 6, '#8a8e94');
    /* Monitor mit CAN-Trace */
    R(c, 6, 0, 24, 18, '#3a3a40'); R(c, 7, 1, 22, 14, '#0a1a12'); for (let k = 0; k < 10; k++) R(c, 8 + k * 2, 3 + ((k * 7) % 9), 1, 1, '#3af07a'); line(c, 8, 12, 28, 12, '#1f6f4a'); R(c, 8, 4, 10, 1, '#7ad0f0'); R(c, 16, 15, 4, 3, '#5a5e64');
    /* Tastatur, Tower */
    R(c, 8, 20, 18, 3, '#c6ccd2'); R(c, 32, 4, 9, 20, '#2a2a2e'); P(c, 34, 6, '#3af07a'); P(c, 37, 6, '#ff9a3a');
    /* CAN-Kabel zum Bike */
    line(c, 41, 14, 50, 12, '#e8c23a'); line(c, 50, 12, 56, 18, '#e8c23a'); R(c, 49, 10, 3, 3, '#2a2a2e');
    /* Montageständer */
    R(c, 58, H - 2, 12, 2, '#5a5e64'); R(c, 63, H - 14, 2, 12, '#5a5e64');
    /* E-Bike */
    const cx = 60, by = H - 4;
    ring(c, cx - 7, by - 4, 5, '#1e1e22'); ring(c, cx + 7, by - 4, 5, '#1e1e22'); P(c, cx - 7, by - 4, '#8a8e94'); P(c, cx + 7, by - 4, '#8a8e94');
    line(c, cx - 7, by - 4, cx - 2, by - 12, col); line(c, cx - 2, by - 12, cx + 6, by - 12, col); line(c, cx + 6, by - 12, cx + 7, by - 4, col); line(c, cx - 7, by - 4, cx + 2, by - 4, col); line(c, cx + 2, by - 4, cx - 2, by - 12, shade(col, -0.3));
    R(c, cx - 3, by - 11, 7, 3, '#2a2a2e'); R(c, cx + 4, by - 16, 2, 5, '#2a2a2e'); R(c, cx + 2, by - 17, 6, 1, '#2a2a2e'); R(c, cx - 4, by - 14, 4, 2, '#5a5e64'); P(c, cx + 8, by - 15, '#f4f0a0');
    if (o.err) { P(c, cx + 5, by - 13, '#ff3a3a'); } else P(c, cx + 5, by - 13, '#3af07a');
  }, { solid: true, emit: (c) => { R(c, 7, 1, 22, 14, 'rgba(60,240,120,0.3)'); } });
}
function objTestBench(x, y) { return mkObj(x, y, 2, 1, 18, (c, W, H) => { R(c, 0, 4, W, H - 8, '#5a5e64'); R(c, 0, 4, W, 2, '#8a8e94'); R(c, 4, 6, 18, 10, '#1a1a1e'); R(c, 5, 7, 16, 8, '#0a2a1a'); for (let k = 0; k < 6; k++) R(c, 6, 8 + k, 4 + (k * 5) % 10, 1, '#3af07a'); R(c, 26, 8, 8, 6, '#2a2a2e'); for (let k = 0; k < 4; k++) P(c, 27 + k * 2, 10, k % 2 ? '#ff3a3a' : '#3af07a'); R(c, 36, 6, 10, 10, '#2a9aa0'); R(c, 37, 7, 8, 3, '#f4f0e6'); line(c, 22, 12, 26, 11, '#e8c23a'); line(c, 34, 11, 36, 10, '#e8c23a'); R(c, 2, H - 4, 3, 4, '#3a3c40'); R(c, W - 5, H - 4, 3, 4, '#3a3c40'); }, { solid: true, emit: (c) => R(c, 5, 7, 16, 8, 'rgba(60,240,120,0.35)') }); }
function objAshtray(x, y) { return mkObj(x, y, 1, 1, 18, (c, W, H) => { R(c, 8, 6, 8, H - 8, '#8a9096'); R(c, 8, 6, 2, H - 8, '#b0b6bc'); R(c, 7, 4, 10, 3, '#5a6066'); R(c, 8, 4, 8, 1, '#c8ccd0'); P(c, 10, 5, '#ff8a3a'); }, { solid: true }); }
function objOrangeCart(x, y) { return mkObj(x, y, 2, 1, 20, (c, W, H) => { R(c, 2, 8, W - 4, 10, '#8a5e3a'); R(c, 2, 8, W - 4, 2, '#a87a50'); for (let k = 0; k < 10; k++) E(c, 6 + (k % 5) * 8, 6 + Math.floor(k / 5) * 4, 2.5, 2.5, '#ff8c1a'); ring(c, 8, H - 4, 4, '#2a2a2e'); ring(c, W - 8, H - 4, 4, '#2a2a2e'); R(c, W / 2 - 14, 0, 28, 6, '#3f8e4b'); pxText(c, 'ZUMO', W / 2 - 7, 1, '#ffffff'); }, { solid: true }); }

/* --- Wandschmuck (direkt in den Boden-Layer gemalt) --- */
const DECAL = {
  window: (c, px, py, w = 20, h = 18, night) => { R(c, px - 1, py - 1, w + 2, h + 2, '#e8e4dc'); R(c, px, py, w, h, '#8ec3e6'); R(c, px, py + h - 6, w, 6, '#e8d8a0'); R(c, px + 3, py + h - 12, 6, 6, '#6d8a9e'); R(c, px + 11, py + h - 13, 7, 7, '#5e7a8e'); R(c, px + w / 2, py, 1, h, '#e8e4dc'); R(c, px, py + h / 2, w, 1, '#e8e4dc'); R(c, px - 2, py + h + 1, w + 4, 2, '#cfc8bc'); },
  seaWindow: (c, px, py, w = 20, h = 18) => { R(c, px - 1, py - 1, w + 2, h + 2, '#e8e4dc'); R(c, px, py, w, h, '#8ec3e6'); R(c, px, py + h - 7, w, 7, '#3a9ac8'); R(c, px + 2, py + h - 7, 4, 1, '#e8f4f8'); R(c, px + w / 2, py, 1, h, '#e8e4dc'); },
  picture: (c, px, py, col = '#6a8ab0') => { R(c, px, py, 14, 11, '#8a6a3a'); R(c, px + 1, py + 1, 12, 9, col); R(c, px + 1, py + 7, 12, 3, '#5a7a4a'); P(c, px + 4, py + 3, '#f2e2a0'); },
  poster: (c, px, py, col, txt) => { R(c, px, py, 14, 20, col); R(c, px + 2, py + 3, 10, 1, '#ffffff'); R(c, px + 3, py + 7, 8, 7, shade(col, -0.3)); if (txt) pxText(c, txt, px + 1, py + 15, '#ffffff'); },
  tv: (c, px, py, w = 30, h = 18) => { R(c, px, py, w, h, '#18181c'); R(c, px + 1, py + 1, w - 2, h - 2, '#2e7a3a'); R(c, px + 1, py + h / 2, w - 2, 1, '#f2f2f2'); E(c, px + w / 2, py + h / 2, 2, 2, '#f2f2f2'); },
  board: (c, px, py, w = 26, lines = 4) => { R(c, px, py, w, 20, '#7a5a3a'); R(c, px + 1, py + 1, w - 2, 18, '#2a3a2e'); for (let k = 0; k < lines; k++) R(c, px + 4, py + 4 + k * 4, 8 + (k * 5) % 10, 1, '#e9efe6'); },
  clock: (c, px, py) => { E(c, px + 7, py + 7, 7, 7, '#2a2a2e'); E(c, px + 7, py + 7, 6, 6, '#f4f2ea'); line(c, px + 7, py + 7, px + 7, py + 3, '#1a1a1a'); line(c, px + 7, py + 7, px + 10, py + 7, '#1a1a1a'); },
  mirror: (c, px, py) => { R(c, px, py, 16, 20, '#c9a65a'); R(c, px + 1, py + 1, 14, 18, '#bcd6e2'); line(c, px + 4, py + 4, px + 9, py + 9, '#e8f4fa'); },
  lift: (c, px, py, label) => { R(c, px, py, 36, 42, '#9aa0a6'); R(c, px + 3, py + 6, 30, 36, '#c6ccd2'); R(c, px + 17, py + 6, 2, 36, '#7a8086'); R(c, px + 12, py, 12, 4, '#1a1a1e'); pxText(c, label || '1', px + 16, py - 1, '#f2c84a'); R(c, px + 38, py + 20, 3, 3, '#f2c84a'); },
  door: (c, px, py, col = '#6a4428', num) => { R(c, px + 1, py + 2, 22, 42, '#3a2a1c'); R(c, px + 3, py + 4, 18, 40, col); R(c, px + 5, py + 7, 14, 14, shade(col, -0.15)); R(c, px + 5, py + 25, 14, 14, shade(col, -0.15)); R(c, px + 17, py + 25, 2, 2, '#e8c84a'); if (num) { const tw = pxTextW(String(num)) + 4; R(c, px + 12 - tw / 2, py - 2, tw, 8, '#c9a65a'); pxText(c, String(num), px + 14 - tw / 2, py - 1, '#2a1a10'); } },
  shelf: (c, px, py, w = 46) => { R(c, px, py + 8, w, 2, '#5a3a24'); R(c, px, py + 20, w, 2, '#5a3a24'); for (let k = 2; k < w - 2; k += 4) { const col = ['#2f7a3a', '#a8401e', '#d8b040', '#4a2a6a', '#e0e0e0', '#7a3a1a'][(k + px) % 6]; R(c, px + k, py, 3, 8, col); P(c, px + k + 1, py - 1, '#2a2a2a'); R(c, px + k, py + 13, 3, 7, ['#d8b040', '#e0e0e0', '#7a3a1a'][(k + px) % 3]); } },
  logo: (c, px, py, txt, col = '#2a9aa0') => { R(c, px, py, pxTextW(txt, 2) + 8, 16, col); pxText(c, txt, px + 4, py + 3, '#ffffff', 2); },
  jamones: (c, px, py, n = 4) => { for (let k = 0; k < n; k++) { R(c, px + k * 14, py, 2, 6, '#5a5048'); R(c, px + k * 14 - 2, py + 6, 7, 16, '#a83a30'); R(c, px + k * 14 - 1, py + 7, 5, 4, '#f4e8d8'); P(c, px + k * 14 + 1, py + 20, '#f4e8d8'); } },
  azulejos: (c, px, py, w, h) => { for (let k = 0; k < w; k += 8) for (let j = 0; j < h; j += 8) { R(c, px + k + 1, py + j + 1, 6, 6, ((k + j) / 8) % 2 ? '#2f6fb8' : '#f4f0e6'); P(c, px + k + 3, py + j + 3, '#e8c23a'); } },
  neon: (c, px, py, text, col) => pxText(c, text, px, py, col, 2),
  flag: (c, px, py) => { R(c, px, py, 20, 4, '#c8a020'); R(c, px, py + 4, 20, 4, '#c8352d'); R(c, px, py + 8, 20, 4, '#c8a020'); R(c, px, py + 12, 20, 2, '#2f5fb8'); },
  carpetRun: (c, px, py, w, h, col = '#8e2f34') => { R(c, px, py, w, h, col); R(c, px, py, w, 2, shade(col, 0.2)); R(c, px, py + h - 2, w, 2, shade(col, 0.2)); },
  gateSign: (c, px, py, txt) => { const tw = pxTextW(txt) + 6; R(c, px, py, tw, 10, '#1e2a3a'); pxText(c, txt, px + 3, py + 2, '#f2c84a'); },
};
