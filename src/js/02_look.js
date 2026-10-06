/* ============ Aussehen: Merkmale, Porträt (96×96) ============ */
const LOOK_OPTS = [
  { g: 'Körper', k: 'skin', n: 'Hautton', col: [['Porzellan', '#ffe3cc'], ['Hell', '#f6d2b4'], ['Rosig', '#f1c3a6'], ['Warm hell', '#e9b98f'], ['Sand', '#dcaa7f'], ['Oliv', '#c99a6c'], ['Honig', '#c48a58'], ['Bronze', '#a8714a'], ['Karamell', '#93613c'], ['Kakao', '#7a4c2f'], ['Dunkel', '#5f3a24'], ['Ebenholz', '#47291a']] },
  { g: 'Körper', k: 'fem', n: 'Figur', v: ['Männlich', 'Weiblich'] },
  { g: 'Körper', k: 'build', n: 'Statur', v: ['Schlank', 'Normal', 'Athletisch', 'Kräftig'] },
  { g: 'Körper', k: 'height', n: 'Grösse', v: ['Klein', 'Mittel', 'Gross'] },
  { g: 'Kopf', k: 'head', n: 'Kopfform', v: ['Oval', 'Rund', 'Eckig', 'Lang', 'Herz', 'Breit'] },
  { g: 'Kopf', k: 'ears', n: 'Ohren', v: ['Normal', 'Klein', 'Abstehend'] },
  { g: 'Kopf', k: 'hair', n: 'Frisur', v: ['Glatze', 'Buzzcut', 'Kurzhaar', 'Seitenscheitel', 'Undercut', 'Tolle', 'Locken', 'Afro', 'Man-Bun', 'Surfer lang', 'Halbglatze', 'Spikes', 'Pferdeschwanz', 'Bob', 'Lang offen', 'Mittelscheitel'] },
  { g: 'Kopf', k: 'hairCol', n: 'Haarfarbe', col: [['Schwarz', '#1f1b1a'], ['Dunkelbraun', '#3b2618'], ['Braun', '#5c3a22'], ['Hellbraun', '#82572f'], ['Dunkelblond', '#9e7746'], ['Blond', '#d3aa5e'], ['Platin', '#ebddb0'], ['Rot', '#a8431d'], ['Kupfer', '#c4682e'], ['Grau', '#8c8985'], ['Weiss', '#ece9e2'], ['Blau', '#3360d4'], ['Grün', '#3d9c52'], ['Pink', '#e3589c']] },
  { g: 'Gesicht', k: 'eyes', n: 'Augen', v: ['Normal', 'Gross', 'Schmal', 'Müde', 'Wach'] },
  { g: 'Gesicht', k: 'eyeCol', n: 'Augenfarbe', col: [['Braun', '#6b4024'], ['Dunkelbraun', '#3e2414'], ['Haselnuss', '#8a6a2e'], ['Grün', '#4f8a3c'], ['Blau', '#3f74c4'], ['Hellblau', '#79b1e0'], ['Grau', '#7d8790']] },
  { g: 'Gesicht', k: 'brows', n: 'Augenbrauen', v: ['Normal', 'Buschig', 'Dünn', 'Grimmig', 'Gewölbt'] },
  { g: 'Gesicht', k: 'nose', n: 'Nase', v: ['Klein', 'Gerade', 'Breit', 'Spitz', 'Knollig', 'Stups'] },
  { g: 'Gesicht', k: 'mouth', n: 'Mund', v: ['Lächeln', 'Neutral', 'Grinsen', 'Schmal', 'Volle Lippen', 'Schief'] },
  { g: 'Gesicht', k: 'beard', n: 'Bart', v: ['Glatt rasiert', '3-Tage-Bart', 'Schnauz', 'Kinnbart', 'Vollbart kurz', 'Vollbart lang', 'Goatee', 'Henriquatre'] },
  { g: 'Gesicht', k: 'beardCol', n: 'Bartfarbe', col: [['Schwarz', '#1f1b1a'], ['Dunkelbraun', '#3b2618'], ['Braun', '#5c3a22'], ['Hellbraun', '#82572f'], ['Dunkelblond', '#9e7746'], ['Blond', '#d3aa5e'], ['Rot', '#a8431d'], ['Kupfer', '#c4682e'], ['Grau', '#8c8985'], ['Salz & Pfeffer', '#6a6560']] },
  { g: 'Gesicht', k: 'mark', n: 'Besonderheit', v: ['Keine', 'Sommersprossen', 'Narbe', 'Muttermal', 'Rote Wangen', 'Sonnenbrand', 'Augenringe', 'Tattoo am Arm'] },
  { g: 'Gesicht', k: 'glasses', n: 'Brille', v: ['Keine', 'Rund', 'Eckig', 'Sonnenbrille', 'Sportbrille', 'Hornbrille'] },
  { g: 'Gesicht', k: 'jewel', n: 'Ohrschmuck', v: ['Keiner', 'Stecker', 'Ring', 'Kreolen'] },
  { g: 'Kleidung', k: 'hat', n: 'Kopfbedeckung', v: ['Keine', 'Cap', 'Cap verkehrt', 'Beanie', 'Fischerhut', 'Velohelm', 'Strohhut', 'Stirnband', 'Bandana'] },
  { g: 'Kleidung', k: 'hatCol', n: 'Farbe Kopfbedeckung', col: [['Schwarz', '#232327'], ['Rot', '#c4312b'], ['Navy', '#22345e'], ['Grau', '#7b7f86'], ['Beige', '#c9b38a'], ['Oliv', '#5d6a37'], ['Weiss', '#ece9e1'], ['Orange', '#e07b25'], ['Türkis', '#2a9aa0'], ['Gelb', '#e8c23a']] },
  { g: 'Kleidung', k: 'top', n: 'Oberteil', v: ['T-Shirt', 'Hemd', 'Polo', 'Hoodie', 'Pullover', 'Tanktop', 'Trikot', 'Sakko', 'Lederjacke', 'Racing-Jacke', 'Radtrikot', 'Bluse'] },
  { g: 'Kleidung', k: 'topCol', n: 'Farbe Oberteil', col: [['Rot', '#c8352d'], ['Weinrot', '#7c2333'], ['Orange', '#e27c2c'], ['Senf', '#cf9f2e'], ['Gelb', '#efd34a'], ['Oliv', '#6e7a3a'], ['Grün', '#3f8e4b'], ['Petrol', '#1f6f73'], ['Türkis', '#2a9aa0'], ['Hellblau', '#7fb4e2'], ['Blau', '#2f5fb8'], ['Navy', '#23325a'], ['Lila', '#6a4a9c'], ['Rosa', '#e79bb4'], ['Weiss', '#efede6'], ['Hellgrau', '#b9bbbf'], ['Anthrazit', '#45474d'], ['Schwarz', '#212125'], ['Beige', '#d4c09a']] },
  { g: 'Kleidung', k: 'print', n: 'Muster', v: ['Uni', 'Streifen', 'Schweizerkreuz', 'Nummer 7', 'Colba-Logo', 'Karo', 'Palmen'] },
  { g: 'Kleidung', k: 'pants', n: 'Hose', v: ['Jeans', 'Chino', 'Cargo', 'Shorts', 'Jogginghose', 'Anzughose', 'Boardshorts', 'Radlerhose', 'Rock'] },
  { g: 'Kleidung', k: 'pantsCol', n: 'Farbe Hose', col: [['Jeansblau', '#38558a'], ['Helle Jeans', '#7e9cc6'], ['Schwarz', '#222226'], ['Anthrazit', '#4a4c52'], ['Grau', '#8c8e93'], ['Beige', '#cdb48c'], ['Khaki', '#9a8a5c'], ['Oliv', '#5a6234'], ['Navy', '#253158'], ['Braun', '#6b4a2e'], ['Weiss', '#e9e6de'], ['Rot', '#a83a30'], ['Türkis', '#2a9aa0']] },
  { g: 'Kleidung', k: 'shoes', n: 'Schuhe', v: ['Sneaker', 'Boots', 'Wanderschuhe', 'Halbschuhe', 'Sandalen', 'Laufschuhe', 'Flip-Flops', 'Radschuhe'] },
  { g: 'Kleidung', k: 'shoesCol', n: 'Farbe Schuhe', col: [['Weiss', '#efede8'], ['Schwarz', '#1f1f23'], ['Braun', '#6e4527'], ['Grau', '#85878c'], ['Rot', '#c3352c'], ['Blau', '#2f5fb8'], ['Grün', '#3f8e4b'], ['Beige', '#cbb58f'], ['Orange', '#e3762a'], ['Neon', '#c8f03a']] },
  { g: 'Kleidung', k: 'acc', n: 'Accessoire', v: ['Keines', 'Rucksack', 'Halskette', 'Armbanduhr', 'Fan-Schal', 'Bauchtasche', 'Laptop-Tasche', 'Zigarette'] },
];
const LOOK_GROUPS = ['Körper', 'Kopf', 'Gesicht', 'Kleidung'];
const LOOK_BY_KEY = Object.fromEntries(LOOK_OPTS.map((o) => [o.k, o]));
const LOOK_COUNT = LOOK_OPTS.reduce((s, o) => s + (o.col || o.v).length, 0);
/* Einige Stücke gibt es erst nach dem Kauf im Laden */
const LOCKED = { top: { 9: 'racing', 10: 'radtrikot' }, hat: { 6: 'strohhut' }, shoes: { 7: 'radschuhe' } };
const optLen = (k) => (LOOK_BY_KEY[k].col || LOOK_BY_KEY[k].v).length;
const optName = (k, i) => { const o = LOOK_BY_KEY[k]; return o.col ? o.col[i][0] : o.v[i]; };
const lc = (L, k) => LOOK_BY_KEY[k].col[clamp(L[k] | 0, 0, LOOK_BY_KEY[k].col.length - 1)][1];
function isLocked(k, i, unlocked) { const l = LOCKED[k]; return !!(l && l[i] && !(unlocked && unlocked[l[i]])); }

function defaultLook() {
  return { skin: 2, fem: 0, build: 1, height: 1, head: 0, ears: 0, hair: 2, hairCol: 2, eyes: 0, eyeCol: 0, brows: 0, nose: 1, mouth: 0, beard: 1, beardCol: 2, mark: 0, glasses: 0, jewel: 0, hat: 0, hatCol: 2, top: 0, topCol: 10, print: 0, pants: 0, pantsCol: 0, shoes: 0, shoesCol: 0, acc: 0 };
}
function randomLook(r = Math.random, unlocked, o = {}) {
  const L = {};
  for (const op of LOOK_OPTS) {
    const n = (op.col || op.v).length;
    let i = Math.floor(r() * n);
    let guard = 0;
    while (isLocked(op.k, i, unlocked) && guard++ < 20) i = Math.floor(r() * n);
    L[op.k] = i;
  }
  L.fem = o.fem != null ? o.fem : (r() < 0.4 ? 1 : 0);
  if (r() < 0.6) L.hat = 0;
  if (r() < 0.6) L.glasses = 0;
  if (r() < 0.6) L.jewel = 0;
  if (r() < 0.6) L.mark = 0;
  if (r() < 0.6) L.print = 0;
  if (r() < 0.7) L.acc = 0;
  if (L.acc === 7 && r() < 0.8) L.acc = 0;
  if (L.fem) { L.beard = 0; if (r() < 0.6) L.hair = pick([12, 13, 14, 15, 9, 2]); if (L.pants === 8 && r() < 0.5) L.pants = 0; } else { L.pants = L.pants === 8 ? 0 : L.pants; L.top = L.top === 11 ? 1 : L.top; }
  if (r() < 0.75) L.beardCol = Math.min(L.hairCol, 9);
  if (L.hairCol > 10 && r() < 0.8) L.hairCol = rint(0, 10);
  return L;
}
const lookKey = (L) => LOOK_OPTS.map((o) => L[o.k] | 0).join('.') + (L.kid ? '.k' : '');

/* ---------- Porträt (96×96) ---------- */
const PW = 96;
const HEADS = [
  [4, 9, 11, 12, 12.5, 12.5, 12, 11, 9.5, 7, 3.5],
  [5, 10, 12.5, 13.5, 14, 14, 13.5, 12.5, 10.5, 7.5, 4],
  [6, 11, 12.5, 13, 13, 13, 13, 12.5, 12, 10, 7],
  [4, 8, 10, 11, 11, 11, 10.5, 10, 8.5, 6.5, 3.5],
  [5, 10.5, 13, 13.5, 13.5, 12.5, 11, 9.5, 7.5, 5, 2.5],
  [5, 10, 12.5, 13.5, 14, 14.5, 14.5, 14, 13, 10.5, 6],
];
function headGeo(L) {
  const S = 1.5;
  const lang = L.head === 3;
  const top = Math.round((lang ? 11 : 13) * S), chin = Math.round((lang ? 47 : 45) * S);
  const prof = HEADS[L.head] || HEADS[0];
  const hw = (y) => {
    const t = (y - top) / (chin - top);
    if (t < 0) return prof[0] * S;
    if (t > 1) return -1;
    const f = t * 10, i = Math.floor(f);
    return (i >= 10 ? prof[10] : lerp(prof[i], prof[i + 1], f - i)) * S;
  };
  const ey = Math.round(top + (chin - top) * 0.5);
  const my = Math.round(top + (chin - top) * 0.82);
  let maxW = 0;
  for (let y = top; y <= chin; y++) maxW = Math.max(maxW, hw(y));
  return { top, chin, hw, cx: 48, ey, my, maxW, S };
}
function maskRender(x, M, base, tex, opt = {}) {
  const dark = shade(base, -0.32), light = shade(base, 0.22);
  const at = (xx, yy) => (xx >= 0 && xx < PW && yy >= 0 && yy < PW ? M[yy * PW + xx] : 0);
  for (let y = 0; y < PW; y++)
    for (let xx = 0; xx < PW; xx++) {
      const v = M[y * PW + xx];
      if (!v) continue;
      if (v === 2) { if ((xx + y) % 2 === 0) P(x, xx, y, opt.stub || mix(base, '#c9a080', 0.35)); continue; }
      const h = hash(xx, y, 7);
      let c = base;
      if (tex === 'curl') { if ((xx + (Math.floor(y / 3) % 2) * 3) % 6 < 2 && y % 3 === 0) c = dark; else if (h > 0.85) c = light; }
      else if (tex === 'beard') { if (h > 0.62) c = dark; else if (h > 0.93) c = light; }
      else { if (xx % 4 === 0 && h > 0.45) c = dark; else if (h > 0.92) c = light; }
      if (!at(xx, y - 1) && !opt.noTopLight) c = light;
      if (!at(xx, y + 1) || !at(xx - 1, y) || !at(xx + 1, y)) c = dark;
      P(x, xx, y, c);
    }
}
function drawPortrait(x, L, opt = {}) {
  const g = headGeo(L);
  const { cx, top, chin, ey, my, hw, S } = g;
  const skin = lc(L, 'skin'), skinD = shade(skin, -0.14), skinDD = shade(skin, -0.3), ol = shade(skin, -0.45), skinL = shade(skin, 0.12);
  const hair = lc(L, 'hairCol'), beardC = lc(L, 'beardCol');
  const topC = lc(L, 'topCol'), hatC = lc(L, 'hatCol');
  if (!opt.noBg) R(x, 0, 0, PW, PW, opt.bg || '#2a3a52');
  const hasHat = L.hat > 0 && L.hat !== 7;
  const HB = new Uint8Array(PW * PW), HF = new Uint8Array(PW * PW);
  const mset = (M, xx, yy, v = 1) => { xx = Math.round(xx); yy = Math.round(yy); if (xx >= 0 && xx < PW && yy >= 0 && yy < PW && (!M[yy * PW + xx] || v === 1)) M[yy * PW + xx] = v; };
  const mrow = (M, x0, x1, yy, v = 1) => { for (let xx = Math.round(x0); xx <= Math.round(x1); xx++) mset(M, xx, yy, v); };
  const mell = (M, ecx, ecy, rx, ry, v = 1) => { for (let yy = -ry; yy <= ry; yy++) { const w = rx * Math.sqrt(Math.max(0, 1 - (yy * yy) / (ry * ry))); mrow(M, ecx - w, ecx + w, ecy + yy, v); } };
  const domeHalf = (y, vol, ext) => { const base = hw(top + 4) + ext; if (y >= top + 4) return hw(y) + ext; const ry = vol + 4, dy = top + 4 - y; return base * Math.sqrt(Math.max(0, 1 - (dy / ry) * (dy / ry))); };
  const cap = (vol, ext, bottomFn, v = 1, sideTo = ey - 3, sideW = 3) => {
    for (let y = top - vol; y <= sideTo + 18; y++) {
      if (y < top - vol) continue;
      const half = y <= top + 21 ? domeHalf(y, vol, ext) : hw(y) + ext;
      for (let xx = Math.round(cx - half); xx <= Math.round(cx + half); xx++) {
        const dx = Math.abs(xx - cx);
        const faceEdge = y >= top ? hw(y) : 0;
        const inSide = dx >= faceEdge - sideW;
        const by = bottomFn(xx);
        if (y <= by || (inSide && y <= sideTo)) mset(HF, xx, y, v);
      }
    }
  };
  const hs = L.hair;
  let tex = 'std';
  const flat = hasHat;
  switch (hs) {
    case 0: break;
    case 1: cap(0, 0, () => top + 10, 2, ey - 5, 3); break;
    case 2: cap(3, 1, (xx) => top + 10 + (hash(xx, 3) > 0.6 ? 1 : 0), 1, ey - 2); break;
    case 3: cap(4, 1, (xx) => (xx < cx - 6 ? top + 9 : top + 10 + Math.min(6, Math.floor((xx - cx + 6) / 3))), 1, ey - 2); break;
    case 4: cap(0, 0, () => top + 12, 2, ey, 4); cap(flat ? 0 : 6, -1, () => top + 9, 1, top + 8, 0); break;
    case 5: cap(3, 1, () => top + 9, 1, ey - 4); if (!flat) mell(HF, cx - 3, top - 3, 13, 7); break;
    case 6: tex = 'curl'; for (let y = ey - 3; y <= chin - 9; y++) mrow(HB, cx - hw(y) - 6, cx + hw(y) + 6, y); cap(flat ? 1 : 7, 4, (xx) => top + 12 + (hash(xx, 9) > 0.5 ? 1 : 0), 1, ey + 4, 4); break;
    case 7: tex = 'curl'; if (!flat) mell(HB, cx, top + 13, 33, 28); else for (let y = top + 6; y <= ey + 9; y++) mrow(HB, cx - hw(y) - 10, cx + hw(y) + 10, y); cap(1, 3, () => top + 12, 1, ey + 3, 6); break;
    case 8: cap(1, 0, () => top + 9, 1, ey - 3); if (!flat) mell(HF, cx, top - 6, 7, 6); break;
    case 9: for (let y = top + 9; y <= 87; y++) { const w = hw(Math.min(y, ey)) + 6 - Math.max(0, y - 81); mrow(HB, cx - w, cx + w, y); } cap(flat ? 1 : 4, 3, (xx) => top + 10 + Math.floor(Math.abs(xx - cx) * 0.35), 1, chin + 9, 6); break;
    case 10: for (let y = top + 10; y <= ey + 1; y++) { const w = hw(y) + 1; mrow(HF, cx - w, cx - w + 4, y); mrow(HF, cx + w - 4, cx + w, y); } for (let y = top + 13; y <= ey + 6; y++) mrow(HB, cx - hw(y) - 1, cx + hw(y) + 1, y); break;
    case 11: cap(3, 1, () => top + 10, 1, ey - 3); if (!flat) for (let sx = cx - 15; sx <= cx + 15; sx += 6) for (let k = 0; k < 9; k++) mrow(HF, sx - Math.max(0, 3 - Math.floor(k / 2)), sx + Math.max(0, 3 - Math.floor(k / 2)), top - 3 - k + 4); break;
    case 12: cap(3, 1, () => top + 9, 1, ey - 2); if (!flat) { mell(HB, cx + hw(ey) + 2, ey + 2, 6, 5); for (let y = ey + 2; y <= chin + 14; y++) mrow(HB, cx + hw(Math.min(y, chin)) + 1, cx + hw(Math.min(y, chin)) + 7 - Math.max(0, (y - chin - 6) * 0.5), y); } break;
    case 13: cap(3, 2, (xx) => top + 9 + Math.floor(Math.abs(xx - cx) * 0.2), 1, chin - 4, 5); for (let y = ey - 2; y <= chin - 2; y++) { const w = hw(Math.min(y, ey)) + 5; mrow(HB, cx - w, cx + w, y); } break;
    case 14: for (let y = top + 6; y <= 92; y++) { const w = hw(Math.min(y, ey)) + 7 - Math.max(0, y - 86); mrow(HB, cx - w, cx + w, y); } cap(flat ? 1 : 4, 3, (xx) => top + 10 + Math.floor(Math.abs(xx - cx) * 0.3), 1, chin + 12, 7); break;
    case 15: cap(3, 1, (xx) => (Math.abs(xx - cx) < 13 ? top + 7 + Math.floor(Math.abs(xx - cx) * 0.5) : top + 13), 1, ey + 3, 4); break;
  }
  maskRender(x, HB, shade(hair, -0.12), tex, {});
  /* Hals & Schultern */
  const sh = [27, 31, 34, 39][L.build] - (L.fem ? 3 : 0);
  const nw = [6, 7, 8, 10][L.build] - (L.fem ? 1 : 0);
  const bodyTop = 73;
  for (let y = chin - 8; y <= bodyTop + 4; y++) R(x, cx - nw, y, nw * 2 + 1, 1, y < chin + 4 ? skinDD : skinD);
  R(x, cx + nw - 1, chin, 2, bodyTop + 4 - chin, skinDD);
  drawTopPortrait(x, L, g, sh, nw, topC, skin, bodyTop);
  if ([9, 14].includes(L.hair)) { const M = new Uint8Array(PW * PW); for (let y = ey; y <= 92; y++) { const w = hw(Math.min(y, chin)) + 6; mrow(M, cx - w - 2, cx - w + 4, y); mrow(M, cx + w - 4, cx + w + 2, y); } maskRender(x, M, hair, tex, {}); }
  /* Ohren */
  const earH = [10, 7, 12][L.ears], earW = [4, 3, 7][L.ears];
  for (const s of [-1, 1]) {
    const ex0 = cx + s * (hw(ey) - 1);
    for (let k = 0; k < earH; k++) {
      const y = ey - 4 + k;
      const w = earW - (k === 0 || k === earH - 1 ? 1 : 0);
      const xA = s < 0 ? ex0 - w : ex0;
      R(x, xA, y, w + 1, 1, skin);
      P(x, s < 0 ? xA : xA + w, y, ol);
      if (k > 2 && k < earH - 3) P(x, s < 0 ? xA + 1 : xA + w - 1, y, skinDD);
    }
  }
  /* Kopf */
  for (let y = top; y <= chin; y++) {
    const half = hw(y);
    const x0 = Math.round(cx - half), x1 = Math.round(cx + half);
    R(x, x0, y, x1 - x0 + 1, 1, skin);
    R(x, x1 - 3, y, 3, 1, skinD);
    if (y > my + 1) R(x, x0 + 1, y, 2, 1, skinD);
    P(x, x0, y, ol); P(x, x1, y, ol);
    if (y === top || y === chin) R(x, x0, y, x1 - x0 + 1, 1, ol);
    if (y === chin - 1) R(x, x0 + 1, y, x1 - x0 - 1, 1, skinD);
  }
  R(x, cx - 12, ey + 5, 3, 1, skinL); P(x, cx - 13, ey + 6, skinL);
  if (L.hair === 0 || L.hair === 10) { R(x, cx - 9, top + 3, 6, 1, skinL); R(x, cx - 10, top + 4, 3, 1, skinL); }
  const mk = L.mark;
  if (mk === 5) { for (let y = top + 4; y < top + 10; y++) R(x, cx - hw(y) + 3, y, (hw(y) - 3) * 2, 1, mix(skin, '#e0503c', 0.2)); for (let y = ey + 3; y < ey + 9; y++) { R(x, cx - 15, y, 7, 1, mix(skin, '#e0503c', 0.35)); R(x, cx + 9, y, 7, 1, mix(skin, '#e0503c', 0.35)); } }
  if (mk === 4) for (let y = ey + 4; y < ey + 9; y++) { R(x, cx - 15, y, 6, 1, mix(skin, '#e86a7a', 0.38)); R(x, cx + 10, y, 6, 1, mix(skin, '#e86a7a', 0.38)); }
  if (mk === 1) { const fr = mix(skin, '#9a4a20', 0.45); [[-10, 4], [-13, 6], [-7, 6], [-12, 9], [-9, 8], [10, 4], [13, 6], [7, 6], [12, 9], [9, 8], [-3, 3], [3, 3], [0, 5]].forEach(([dx, dy]) => P(x, cx + dx, ey + dy, fr)); }
  if (mk === 6) for (const s of [-1, 1]) R(x, cx + s * 9 - 3, ey + 5, 7, 1, mix(skin, '#5a3a5a', 0.3));
  /* Augen, Brauen, Nase, Mund */
  const eyeC = lc(L, 'eyeCol');
  for (const s of [-1, 1]) drawEyeP(x, cx + s * 9, ey, s, L.eyes, eyeC, skin);
  const browC = mix(L.hair === 0 || L.hair === 10 ? beardC : hair, '#2a1a12', 0.35);
  drawBrowsP(x, g, L.brows, browC, L.eyes);
  drawNoseP(x, g, L.nose, skin);
  drawMouthP(x, g, L.mouth, skin, L.fem);
  if (mk === 2) { line(x, cx + 8, ey + 4, cx + 14, ey + 11, mix(skin, '#ffffff', 0.35)); P(x, cx + 9, ey + 7, skinDD); P(x, cx + 12, ey + 9, skinDD); }
  if (mk === 3) R(x, cx - 9, my - 3, 2, 2, '#4a2e22');
  drawBeardP(x, L, g, beardC, skin);
  maskRender(x, HF, hair, tex, { stub: mix(hair, skin, 0.42) });
  if (hs === 3 && !hasHat) line(x, cx - 6, top - 1, cx - 6, top + 5, shade(hair, -0.5));
  if (hs === 15 && !hasHat) line(x, cx, top - 1, cx, top + 6, shade(hair, -0.5));
  drawGlassesP(x, g, L.glasses, skin);
  const gold = '#f2c84b', silver = '#d9dde3';
  const lobe = (s) => [cx + s * (hw(ey) + (L.ears === 2 ? 5 : 2)), ey + [5, 2, 6][L.ears]];
  if (L.jewel === 1) { const [lx, ly] = lobe(-1); R(x, lx - 1, ly, 3, 3, gold); }
  if (L.jewel === 2) { const [lx, ly] = lobe(1); ring(x, lx, ly + 3, 2.5, silver); }
  if (L.jewel === 3) for (const s of [-1, 1]) { const [lx, ly] = lobe(s); ring(x, lx, ly + 5, 4, gold); }
  if (L.acc === 7) { R(x, cx + 5, my, 9, 2, '#f4f0e6'); R(x, cx + 12, my, 2, 2, '#e8b030'); P(x, cx + 14, my, '#ff6a2a'); }
  drawHatP(x, L, g, hatC, hair);
}
function drawEyeP(x, ex, ey, s, st, eyeC, skin) {
  const white = '#f5f2ea', pup = '#17110e', lid = shade(skin, -0.6), lidSoft = shade(skin, -0.25);
  const S = [{ w: 6, h: 3, iw: 3 }, { w: 7, h: 5, iw: 4 }, { w: 6, h: 2, iw: 3 }, { w: 6, h: 3, iw: 3 }, { w: 7, h: 4, iw: 4 }][st];
  const x0 = ex - Math.floor(S.w / 2) + (S.w % 2 === 0 && s > 0 ? 1 : 0);
  const y0 = ey - Math.floor(S.h / 2);
  for (let r = 0; r < S.h; r++) { const inset = S.h > 3 && (r === 0 || r === S.h - 1) ? 1 : 0; R(x, x0 + inset, y0 + r, S.w - inset * 2, 1, white); }
  const ix = ex - Math.floor(S.iw / 2) + (S.iw % 2 === 0 && s > 0 ? 1 : 0);
  R(x, ix, y0, S.iw, S.h, eyeC);
  R(x, ix + Math.floor(S.iw / 2) - (S.iw > 3 ? 1 : 0), y0 + Math.max(0, S.h - 2), S.iw > 3 ? 2 : 1, S.h > 2 ? 2 : 1, pup);
  if (S.h > 2) P(x, ix, y0, shade(eyeC, 0.5));
  if (st === 4) P(x, ix, y0, '#ffffff');
  R(x, x0, y0 - 1, S.w, 1, lid);
  if (st === 3) { R(x, x0, y0, S.w, 1, lidSoft); R(x, x0, y0 + S.h + 1, S.w, 1, shade(skin, -0.12)); }
  if (st === 2) P(x, s < 0 ? x0 - 1 : x0 + S.w, y0, lid);
}
function drawBrowsP(x, g, st, c, eyeSt) {
  const { cx, ey } = g;
  const by = ey - ([1, 4].includes(eyeSt) ? 8 : 6);
  for (const s of [-1, 1]) {
    const ex = cx + s * 9, inner = s < 0 ? 1 : -1;
    switch (st) {
      case 0: R(x, ex - 3, by, 7, 2, c); P(x, ex + inner * 3, by + 2, c); break;
      case 1: R(x, ex - 4, by - 1, 10, 3, c); P(x, ex - inner * 4, by - 1, shade(c, 0.25)); break;
      case 2: R(x, ex - 3, by, 6, 1, shade(c, 0.2)); break;
      case 3: for (let k = 0; k < 8; k++) R(x, ex - inner * (4 - k), by - 1 + Math.floor(k / 3), 1, 2, c); break;
      case 4: R(x, ex - 1, by - 1, 3, 2, c); R(x, ex - 3, by, 2, 2, c); R(x, ex + 2, by, 2, 2, c); P(x, ex - 4, by + 2, c); P(x, ex + 4, by + 2, c); break;
    }
  }
}
function drawNoseP(x, g, st, skin) {
  const { cx, ey } = g;
  const sd = shade(skin, -0.2), dk = shade(skin, -0.42), hl = shade(skin, 0.14);
  const n = ey + 2;
  switch (st) {
    case 0: R(x, cx + 1, n + 4, 2, 2, sd); P(x, cx - 1, n + 6, dk); P(x, cx + 2, n + 6, dk); P(x, cx, n + 3, hl); break;
    case 1: R(x, cx + 1, n, 2, 7, sd); R(x, cx - 3, n + 7, 7, 2, sd); P(x, cx - 2, n + 8, dk); P(x, cx + 2, n + 8, dk); R(x, cx, n + 3, 1, 3, hl); break;
    case 2: R(x, cx + 1, n + 1, 2, 6, sd); R(x, cx - 4, n + 7, 10, 2, sd); P(x, cx - 3, n + 8, dk); P(x, cx + 4, n + 8, dk); break;
    case 3: R(x, cx + 1, n, 2, 8, sd); R(x, cx - 1, n + 8, 3, 1, sd); P(x, cx - 2, n + 8, dk); P(x, cx + 2, n + 9, dk); break;
    case 4: R(x, cx + 1, n, 2, 4, sd); E(x, cx, n + 6, 3, 2, mix(skin, '#d0605a', 0.22)); P(x, cx - 1, n + 5, hl); P(x, cx - 3, n + 7, dk); P(x, cx + 3, n + 7, dk); break;
    case 5: R(x, cx + 1, n + 2, 2, 3, sd); P(x, cx, n + 4, hl); R(x, cx - 1, n + 6, 4, 1, sd); P(x, cx - 2, n + 6, dk); P(x, cx + 3, n + 6, dk); break;
  }
}
function drawMouthP(x, g, st, skin, fem) {
  const { cx, my } = g;
  const ln = shade(mix(skin, '#6a2a2a', 0.5), -0.2), lip = fem ? mix(skin, '#c43a52', 0.55) : mix(skin, '#c45a62', 0.38), lipL = shade(lip, 0.15);
  switch (st) {
    case 0: R(x, cx - 5, my, 11, 1, ln); P(x, cx - 6, my - 1, ln); P(x, cx + 6, my - 1, ln); R(x, cx - 4, my + 1, 9, 2, lip); break;
    case 1: R(x, cx - 5, my, 10, 1, ln); R(x, cx - 4, my + 1, 8, 2, lip); break;
    case 2: R(x, cx - 6, my - 1, 13, 1, ln); R(x, cx - 6, my, 13, 3, '#5a1e1e'); R(x, cx - 5, my, 11, 2, '#f4efe4'); P(x, cx - 7, my - 2, ln); P(x, cx + 7, my - 2, ln); R(x, cx - 5, my + 3, 11, 1, lip); break;
    case 3: R(x, cx - 3, my, 7, 1, ln); break;
    case 4: R(x, cx - 5, my - 2, 11, 2, lip); R(x, cx - 5, my, 11, 1, ln); R(x, cx - 5, my + 1, 11, 3, lip); R(x, cx - 2, my + 1, 5, 1, lipL); break;
    case 5: R(x, cx - 4, my, 6, 1, ln); R(x, cx + 2, my - 1, 4, 1, ln); P(x, cx + 6, my - 2, ln); R(x, cx - 3, my + 1, 5, 2, lip); break;
  }
}
function drawBeardP(x, L, g, c, skin) {
  const st = L.beard;
  if (!st) return;
  const { cx, ey, my, chin, hw } = g;
  const M = new Uint8Array(PW * PW);
  const set = (xx, yy, v = 1) => { xx = Math.round(xx); yy = Math.round(yy); if (xx >= 0 && xx < PW && yy >= 0 && yy < PW) M[yy * PW + xx] = v; };
  const row = (x0, x1, yy, v = 1) => { for (let xx = Math.round(x0); xx <= Math.round(x1); xx++) set(xx, yy, v); };
  const inFace = (xx, yy) => yy <= chin && Math.abs(xx - cx) <= hw(yy) - 0.5;
  const full = (v = 1, from = ey + 5) => { for (let yy = from; yy <= chin; yy++) for (let xx = 0; xx < PW; xx++) if (inFace(xx, yy) && (Math.abs(xx - cx) >= hw(yy) - 6 || yy >= my + 3)) set(xx, yy, v); };
  const must = (w = 6, rows = 3, v = 1) => { for (let r = 0; r < rows; r++) row(cx - w + (r === 0 ? 1 : 0), cx + w - (r === 0 ? 1 : 0), my - 3 + r, v); };
  const ext = (len, w0) => { for (let k = 0; k <= len; k++) { const w = Math.max(2, w0 * (1 - k / (len + 3))); row(cx - w, cx + w, chin + k); } };
  switch (st) {
    case 1: full(2, ey + 6); must(6, 3, 2); break;
    case 2: must(7, 3); set(cx - 8, my - 1); set(cx + 8, my - 1); break;
    case 3: for (let yy = my + 3; yy <= chin + 2; yy++) row(cx - 5, cx + 5, yy); break;
    case 4: full(1); must(7, 3); break;
    case 5: full(1); must(7, 3); ext(14, hw(chin - 4)); break;
    case 6: must(6, 3); for (let yy = my - 1; yy <= chin + 1; yy++) { if (yy >= my + 3) row(cx - 6, cx + 6, yy); else { set(cx - 6, yy); set(cx + 6, yy); } } break;
    case 7: row(cx - 5, cx + 5, my - 3); set(cx - 6, my - 2); set(cx + 6, my - 2); for (let yy = my + 3; yy <= chin + 6; yy++) { const w = Math.max(0, 3 - Math.floor((yy - chin) / 2)); row(cx - w, cx + w, yy); } break;
  }
  maskRender(x, M, c, 'beard', { stub: mix(c, skin, 0.5), noTopLight: true });
  if ([4, 5].includes(st)) R(x, cx - 3, my, 7, 1, '#3a1818');
}
function drawGlassesP(x, g, st, skin) {
  if (!st) return;
  const { cx, ey, hw } = g;
  const fr = ['#000', '#2a2a30', '#1f1f24', '#151519', '#2b2b30', '#5a3418'][st];
  const lx = cx - 9, rx = cx + 9;
  const rectO = (ex, y0, w, h, c, th = 1) => { R(x, ex - Math.floor(w / 2), y0, w, th, c); R(x, ex - Math.floor(w / 2), y0 + h - th, w, th, c); R(x, ex - Math.floor(w / 2), y0, th, h, c); R(x, ex - Math.floor(w / 2) + w - th, y0, th, h, c); };
  const temples = (y) => { R(x, cx - hw(ey), y, lx - 5 - (cx - hw(ey)), 1, fr); R(x, rx + 6, y, cx + hw(ey) - rx - 6, 1, fr); };
  switch (st) {
    case 1: for (const ex of [lx, rx]) ring(x, ex, ey, 5.5, fr); R(x, lx + 6, ey - 1, rx - lx - 12, 1, fr); temples(ey - 1); break;
    case 2: for (const ex of [lx, rx]) rectO(ex, ey - 4, 13, 9, fr); R(x, lx + 7, ey - 3, rx - lx - 13, 1, fr); temples(ey - 3); break;
    case 3: for (const ex of [lx, rx]) { R(x, ex - 6, ey - 4, 13, 9, '#18181c'); P(x, ex - 3, ey - 3, '#5a6070'); P(x, ex - 4, ey - 2, '#5a6070'); R(x, ex - 6, ey - 4, 13, 1, '#000'); } R(x, lx + 7, ey - 4, rx - lx - 13, 1, '#000'); temples(ey - 3); break;
    case 4: for (let xx = cx - 18; xx <= cx + 18; xx++) for (let yy = ey - 4; yy <= ey + 3; yy++) { if ((yy === ey + 3) && Math.abs(xx - cx) < 3) continue; P(x, xx, yy, mix('#ff7a2a', '#7a3ad0', (xx - cx + 18) / 36)); } R(x, cx - 18, ey - 4, 37, 1, '#1a1a1e'); R(x, cx - 12, ey - 3, 3, 1, '#ffd8a0'); temples(ey - 3); break;
    case 5: for (const ex of [lx, rx]) rectO(ex, ey - 4, 13, 10, fr, 2); R(x, lx + 7, ey - 3, rx - lx - 13, 2, fr); temples(ey - 3); break;
  }
}
function drawHatP(x, L, g, c, hair) {
  const st = L.hat;
  if (!st) return;
  const { cx, top, hw, maxW } = g;
  const dk = shade(c, -0.3), lt = shade(c, 0.2), W = Math.round(maxW) + 1;
  const dome = (cy, ry, w, from, to, col) => { for (let y = from; y <= to; y++) { const dy = cy - y; const hh = dy > 0 ? w * Math.sqrt(Math.max(0, 1 - (dy * dy) / (ry * ry))) : w; R(x, cx - hh, y, hh * 2 + 1, 1, col); P(x, cx - hh, y, dk); P(x, cx + hh, y, dk); } };
  switch (st) {
    case 1: dome(top + 12, 16, W, top - 4, top + 12, c); R(x, cx - 2, top - 6, 5, 2, dk); E(x, cx, top + 14, W + 4, 3, dk); R(x, cx - W - 4, top + 13, (W + 4) * 2 + 1, 1, lt); break;
    case 2: dome(top + 10, 15, W, top - 4, top + 10, c); R(x, cx - 9, top - 7, 19, 3, dk); R(x, cx - 5, top + 4, 11, 7, hair); R(x, cx - 5, top + 9, 11, 1, '#2a2a2a'); break;
    case 3: dome(top + 15, 19, W, top - 5, top + 16, c); for (let xx = -W; xx <= W; xx++) R(x, cx + xx, top + 10, 1, 7, xx % 3 ? c : dk); E(x, cx, top - 7, 6, 4, lt); break;
    case 4: dome(top + 9, 13, W - 1, top - 4, top + 9, c); for (let k = 0; k < 7; k++) { const w = W + 1 + k; R(x, cx - w, top + 9 + k, w * 2 + 1, 1, k < 3 ? c : dk); } R(x, cx - W + 1, top + 6, (W - 1) * 2 + 1, 2, dk); break;
    case 5: dome(top + 12, 17, W + 2, top - 6, top + 12, c); for (let k = -3; k <= 3; k++) R(x, cx + k * 8 - 1, top - 4, 3, 14, dk); R(x, cx - W - 2, top + 12, (W + 2) * 2 + 5, 3, '#2a2a2e'); E(x, cx, top + 14, W + 4, 2, '#1a1a1e'); break;
    case 6: { const sc = '#e8d8a0', sd = shade(sc, -0.3); dome(top + 8, 12, W - 2, top - 5, top + 8, sc); for (let k = 0; k < 4; k++) { const w = W + 6 + k * 2; R(x, cx - w, top + 8 + k, w * 2 + 1, 1, k < 2 ? sc : sd); } for (let xx = -(W - 2); xx <= W - 2; xx++) R(x, cx + xx, top + 5, 1, 3, xx % 2 ? '#c8302a' : '#1a1a1e'); for (let yy = top - 4; yy < top + 8; yy += 3) for (let xx = -(W - 3); xx <= W - 3; xx += 4) P(x, cx + xx, yy, sd); break; }
    case 7: for (let y = top + 8; y <= top + 13; y++) { const w = hw(y) + 1; R(x, cx - w, y, w * 2 + 1, 1, y === top + 10 ? lt : c); } break;
    case 8: dome(top + 9, 13, W, top - 4, top + 9, c); for (let yy = top - 3; yy < top + 9; yy += 3) for (let xx = -W; xx <= W; xx += 3) if ((xx + yy) % 2 === 0) P(x, cx + xx, yy, lt); R(x, cx + W - 5, top + 8, 12, 3, c); R(x, cx + W + 4, top + 10, 6, 2, dk); break;
  }
}
function drawTopPortrait(x, L, g, sh, nw, c, skin, bodyTop) {
  const { cx } = g;
  const dk = shade(c, -0.28), lt = shade(c, 0.18), dd = shade(c, -0.45);
  const t = L.top;
  const bodyRow = (y) => (y < bodyTop + 6 ? Math.round(lerp(nw + 6, sh, (y - bodyTop) / 6)) : Math.round(sh + (y - bodyTop - 6) * 0.25));
  const fillBody = (col, fn) => { for (let y = bodyTop; y < PW; y++) { const w = bodyRow(y); R(x, cx - w, y, w * 2 + 1, 1, col); if (fn) fn(y, w); R(x, cx + w - 4, y, 4, 1, shade(col, -0.18)); P(x, cx - w, y, shade(col, -0.4)); P(x, cx + w, y, shade(col, -0.4)); } };
  const vNeck = (depth, col) => { for (let k = 0; k < depth; k++) { const w = Math.max(0, nw - 1 - Math.floor(k * 0.7)); R(x, cx - w, bodyTop + k, w * 2 + 1, 1, col); } };
  const crew = (rim) => { for (let k = 0; k < 4; k++) { const w = nw - k; R(x, cx - w, bodyTop + k, w * 2 + 1, 1, shade(skin, -0.14)); } for (let k = 0; k <= nw; k++) { P(x, cx - nw + k, bodyTop + 3 + (k > nw - 2 ? 1 : 0), rim); P(x, cx + nw - k, bodyTop + 3 + (k > nw - 2 ? 1 : 0), rim); } R(x, cx - 3, bodyTop + 4, 7, 1, rim); };
  const collar = (col) => { for (let k = 0; k < 7; k++) { R(x, cx - nw - 3 + k, bodyTop - 2 + k, 4, 1, col); R(x, cx + nw - 1 - k, bodyTop - 2 + k, 4, 1, col); } };
  const pattern = () => {
    const pr = L.print;
    if (![0, 2, 3, 4, 5, 6, 10].includes(t)) return;
    if (pr === 1) for (let y = bodyTop + 8; y < PW; y += 4) { const w = bodyRow(y) - 1; R(x, cx - w, y, w * 2 + 1, 2, lt); }
    if (pr === 2) { const red = L.topCol <= 1; const bg = red ? '#ffffff' : '#d52b1e', fg = red ? '#d52b1e' : '#ffffff'; R(x, cx - 7, bodyTop + 8, 15, 15, bg); R(x, cx - 1, bodyTop + 10, 3, 11, fg); R(x, cx - 5, bodyTop + 14, 11, 3, fg); }
    if (pr === 3) pxText(x, '7', cx - 4, bodyTop + 8, L.topCol >= 14 && L.topCol <= 15 ? '#22223a' : '#f6f4ee', 3);
    if (pr === 4) { const lc2 = L.topCol >= 14 && L.topCol <= 15 ? '#2a3a62' : '#f6f4ee'; ring(x, cx + 12, bodyTop + 10, 3, lc2); P(x, cx + 12, bodyTop + 10, lc2); }
    if (pr === 5) for (let y = bodyTop + 6; y < PW; y++) { const w = bodyRow(y) - 1; for (let xx = -w; xx <= w; xx++) if (((Math.floor((xx + 40) / 4) + Math.floor(y / 4)) % 2) === 0) P(x, cx + xx, y, dk); }
    if (pr === 6) for (let k = 0; k < 4; k++) { const px = cx - 14 + k * 9, py = bodyTop + 9 + (k % 2) * 7; line(x, px, py + 5, px, py, '#2a6a3a'); for (const a of [-1, 1]) { line(x, px, py, px + a * 3, py - 3, '#3f9e4b'); line(x, px, py + 1, px + a * 4, py, '#3f9e4b'); } }
  };
  switch (t) {
    case 0: fillBody(c); crew(dk); pattern(); break;
    case 1: fillBody(c); vNeck(7, shade(skin, -0.14)); collar(lt); for (let y = bodyTop + 9; y < PW; y += 4) P(x, cx, y, dd); R(x, cx, bodyTop + 8, 1, 14, dk); break;
    case 2: fillBody(c); vNeck(6, shade(skin, -0.14)); collar(lt); P(x, cx, bodyTop + 6, '#eee'); P(x, cx, bodyTop + 9, '#eee'); pattern(); break;
    case 3: fillBody(c); for (let k = 0; k < 6; k++) { const w = nw + 6 - k; R(x, cx - w, bodyTop - 4 + k, w * 2 + 1, 1, dk); } crew(dd); R(x, cx - 4, bodyTop + 5, 1, 9, '#efefef'); R(x, cx + 4, bodyTop + 5, 1, 10, '#efefef'); R(x, cx - 10, bodyTop + 17, 21, 1, dk); pattern(); break;
    case 4: fillBody(c); crew(dk); for (let xx = -nw - 2; xx <= nw + 2; xx++) if (xx % 2) P(x, cx + xx, bodyTop + 5 + (Math.abs(xx) > nw - 1 ? -1 : 0), dd); pattern(); break;
    case 5: { fillBody(skin); const w0 = Math.max(6, sh - 13); for (let y = bodyTop; y < PW; y++) { if (y < bodyTop + 6) { R(x, cx - w0 - 1, y, 4, 1, c); R(x, cx + w0 - 2, y, 4, 1, c); } else { const w = Math.min(bodyRow(y) - 3, w0 + (y - bodyTop - 6)); R(x, cx - w, y, w * 2 + 1, 1, c); } } for (let k = 0; k < 4; k++) R(x, cx - nw + k + 1, bodyTop + 6 + k, (nw - k - 1) * 2 + 1, 1, skin); pattern(); break; }
    case 6: { fillBody(c); vNeck(7, shade(skin, -0.14)); line(x, cx - sh + 3, bodyTop + 7, cx - nw - 3, bodyTop, '#f6f4ee'); line(x, cx + sh - 3, bodyTop + 7, cx + nw + 3, bodyTop, '#f6f4ee'); pattern(); break; }
    case 7: { fillBody(c); for (let k = 0; k < 18; k++) { const w = Math.max(0, nw - Math.floor(k * 0.5)); R(x, cx - w, bodyTop + k, w * 2 + 1, 1, '#f1efe8'); } for (let k = 0; k < 15; k++) { P(x, cx - nw - 1 + Math.floor(k * 0.55), bodyTop + k, dk); P(x, cx + nw + 1 - Math.floor(k * 0.55), bodyTop + k, dk); P(x, cx - nw - 2 + Math.floor(k * 0.55), bodyTop + k, lt); P(x, cx + nw + 2 - Math.floor(k * 0.55), bodyTop + k, lt); } P(x, cx, PW - 3, dd); break; }
    case 8: { const J = '#2a2420'; fillBody(J); for (let k = 0; k < 16; k++) { const w = Math.max(0, nw + 1 - Math.floor(k * 0.6)); R(x, cx - w, bodyTop + k, w * 2 + 1, 1, c); } for (let k = 0; k < 13; k++) { P(x, cx - nw - 3 + Math.floor(k * 0.6), bodyTop + k, '#4a3f38'); P(x, cx + nw + 3 - Math.floor(k * 0.6), bodyTop + k, '#4a3f38'); } R(x, cx - nw - 6, bodyTop - 1, 6, 4, '#3a322c'); R(x, cx + nw + 1, bodyTop - 1, 6, 4, '#3a322c'); P(x, cx + 13, bodyTop + 15, '#a0a4a8'); break; }
    case 9: { fillBody(c); R(x, cx - nw - 2, bodyTop - 3, (nw + 2) * 2 + 1, 4, dk); R(x, cx, bodyTop + 1, 2, 21, '#c9ccd0'); for (let y = bodyTop + 10; y < PW; y++) { const w = bodyRow(y); R(x, cx - w, y, 5, 1, '#f4f0e6'); R(x, cx + w - 4, y, 5, 1, '#f4f0e6'); } R(x, cx + 6, bodyTop + 8, 10, 6, '#f4f0e6'); R(x, cx + 7, bodyTop + 9, 8, 4, '#c8352d'); pxText(x, 'GP', cx - 13, bodyTop + 9, '#f4f0e6'); break; }
    case 10: { fillBody(c); R(x, cx - nw - 1, bodyTop - 2, (nw + 1) * 2 + 3, 3, dk); R(x, cx, bodyTop + 1, 1, 16, '#c9ccd0'); for (let y = bodyTop + 12; y < bodyTop + 16; y++) { const w = bodyRow(y); R(x, cx - w, y, w * 2 + 1, 1, '#f4f0e6'); } for (let y = bodyTop + 16; y < PW; y++) { const w = bodyRow(y); R(x, cx - w, y, w * 2 + 1, 1, '#2a2a30'); } pattern(); break; }
    case 11: { fillBody(c); vNeck(8, shade(skin, -0.14)); collar(lt); for (let y = bodyTop + 10; y < PW; y += 5) R(x, cx - 1, y, 2, 2, '#f4f0e6'); break; }
  }
  const a = L.acc;
  if (a === 1) for (const s of [-1, 1]) { R(x, cx + s * (sh - 8) - 2, bodyTop, 4, 23, '#30333a'); R(x, cx + s * (sh - 8) - 2, bodyTop + 14, 4, 2, '#8c9096'); }
  if (a === 2) { for (let k = -nw; k <= nw; k++) P(x, cx + k, bodyTop + 3 + Math.round((1 - (k * k) / (nw * nw)) * 5), '#e8c04a'); R(x, cx - 1, bodyTop + 8, 3, 4, '#e8c04a'); P(x, cx, bodyTop + 9, '#b8902a'); }
  if (a === 4) { for (let y = bodyTop - 3; y <= bodyTop + 3; y++) { const w = nw + 6; for (let xx = -w; xx <= w; xx++) P(x, cx + xx, y, Math.floor((xx + 30) / 4) % 2 ? '#f08a1e' : '#1a1a1e'); } for (let y = bodyTop + 4; y < PW; y++) for (let xx = cx - 13; xx < cx - 6; xx++) P(x, xx, y, Math.floor(y / 4) % 2 ? '#f08a1e' : '#1a1a1e'); }
  if (a === 5) { for (let k = 0; k < 23; k++) R(x, cx + sh - 7 - k * 1.3, bodyTop + k, 4, 1, '#2a2c33'); R(x, cx - sh + 3, bodyTop + 15, 14, 7, '#3a3d45'); R(x, cx - sh + 4, bodyTop + 16, 12, 1, '#5a5e68'); }
  if (a === 6) { for (let k = 0; k < 23; k++) R(x, cx - sh + 7 + k * 1.1, bodyTop + k, 3, 1, '#2a2a30'); R(x, cx + sh - 16, bodyTop + 14, 16, 9, '#3a3a42'); R(x, cx + sh - 15, bodyTop + 15, 14, 1, '#6a6a74'); }
}
const _portCache = new Map();
function portraitCanvas(L, bg) {
  const key = lookKey(L) + '|' + (bg || '');
  let c = _portCache.get(key);
  if (c) return c;
  const [cv, x] = canvas(PW, PW);
  drawPortrait(x, L, { bg });
  _portCache.set(key, cv);
  if (_portCache.size > 60) _portCache.delete(_portCache.keys().next().value);
  return cv;
}
