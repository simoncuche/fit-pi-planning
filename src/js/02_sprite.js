/* ============ Spielfigur: Sprite 28×48 (40 px Figur plus 8 px Luft für Hüte und hohe Frisuren), 4 Richtungen, 11 Posen ============ */
const SPR_W = 28, SPR_H = 48, SPR_TOP = 8;
const POSES = ['stand', 'walkA', 'walkB', 'sit', 'drink', 'danceA', 'danceB', 'bend', 'ride', 'rub', 'rubB'];
const POSE_I = Object.fromEntries(POSES.map((p, i) => [p, i]));
const _sprCache = new Map();
function getSheet(L) {
  const key = lookKey(L);
  let s = _sprCache.get(key);
  if (s) return s;
  const [c, x] = canvas(SPR_W * POSES.length, SPR_H * 4);
  for (let d = 0; d < 4; d++)
    for (let p = 0; p < POSES.length; p++) {
      const [fc, fx] = canvas(SPR_W, SPR_H);
      const dir = d === 2 ? 1 : d;
      fx.translate(0, SPR_TOP);
      drawSprite(fx, L, dir, POSES[p]);
      outlineCanvas(fc, fx);
      if (d === 2) { x.save(); x.translate(p * SPR_W + SPR_W, d * SPR_H); x.scale(-1, 1); x.drawImage(fc, 0, 0); x.restore(); }
      else x.drawImage(fc, p * SPR_W, d * SPR_H);
    }
  s = c;
  _sprCache.set(key, s);
  if (_sprCache.size > 90) _sprCache.delete(_sprCache.keys().next().value);
  return s;
}
function outlineCanvas(c, x) {
  const id = x.getImageData(0, 0, c.width, c.height), d = id.data, W = c.width, H = c.height;
  const op = (xx, yy) => xx >= 0 && yy >= 0 && xx < W && yy < H && d[(yy * W + xx) * 4 + 3] > 40;
  const out = [];
  for (let yy = 0; yy < H; yy++) for (let xx = 0; xx < W; xx++) if (!op(xx, yy) && (op(xx - 1, yy) || op(xx + 1, yy) || op(xx, yy - 1) || op(xx, yy + 1))) out.push(yy * W + xx);
  for (const i of out) { d[i * 4] = 26; d[i * 4 + 1] = 20; d[i * 4 + 2] = 26; d[i * 4 + 3] = 235; }
  x.putImageData(id, 0, 0);
}

function drawSprite(x, L, dir, pose) {
  const p = (xx, yy, c) => P(x, xx, yy, c);
  const r = (xx, yy, w, h, c) => R(x, xx, yy, w, h, c);
  const skin = lc(L, 'skin'), skinD = shade(skin, -0.18), skinL = shade(skin, 0.12);
  const hair = lc(L, 'hairCol'), hairD = shade(hair, -0.3), hairL = shade(hair, 0.22);
  const beard = lc(L, 'beardCol');
  let topC = lc(L, 'topCol');
  let pantsC = lc(L, 'pantsCol'), shoeC = lc(L, 'shoesCol'), hatC = lc(L, 'hatCol');
  const T = L.top;
  if (T === 8) topC = '#2c2622';
  const topD = shade(topC, -0.25), topL = shade(topC, 0.18);
  const longSleeve = [1, 3, 4, 7, 8, 9, 11].includes(T);
  const sit = pose === 'sit' || pose === 'ride', bend = pose === 'bend', ride = pose === 'ride', rub = pose === 'rub' || pose === 'rubB';
  const walkA = pose === 'walkA', walkB = pose === 'walkB', walk = walkA || walkB;
  const dance = pose === 'danceA' || pose === 'danceB';
  const dh = [2, 0, -2][L.height], dh2 = [1, 0, -1][L.height];
  const bob = walk ? -1 : 0;
  const drop = sit ? 5 : bend ? 3 : 0;
  const hy = 4 + dh + bob + drop;
  const tTop = hy + 12;
  const legsTop = 28 + dh2 + drop;
  let [tx0, tx1] = [[10, 17], [9, 18], [8, 19], [7, 20]][L.build];
  if (L.fem && L.build > 0) { tx0++; tx1--; }
  const pt = L.pants, shortsLike = [3, 6, 7, 8].includes(pt);
  const mouthC = shade(mix(skin, '#7a2a2a', 0.5), -0.1);
  const eyeC = '#21160f';
  const hairy = L.hair !== 0;
  const hasHat = L.hat > 0 && L.hat !== 7;

  /* ---------- Beine & Schuhe ---------- */
  const shoe = (xx, yy, w, toeLeft, back) => {
    const sh = L.shoes;
    let col = shoeC;
    if (sh === 2) col = mix(shoeC, '#6e4527', 0.5);
    if (sh === 4 || sh === 6) col = skin;
    const h = sh === 1 || sh === 2 ? 3 : 2;
    r(xx, yy - (h - 2), w, h, back ? shade(col, -0.2) : col);
    r(xx, yy + 1, w, 1, sh === 0 || sh === 5 ? '#f2f0ea' : sh === 4 || sh === 6 ? '#6e4527' : shade(col, -0.4));
    if (sh === 4) r(xx, yy, w, 1, '#6e4527');
    if (sh === 6) p(xx + (toeLeft ? 1 : w - 2), yy, '#c8352d');
    if (sh === 5) p(xx + (toeLeft ? 0 : w - 1), yy, '#c8f03a');
    if (sh === 2 || sh === 1) p(xx + Math.floor(w / 2), yy - 1, shade(col, 0.3));
    if (sh === 7) r(xx + (toeLeft ? 0 : w - 2), yy + 1, 2, 1, '#e8e8e8');
  };
  const legCol = (k, len, front) => {
    const pd = front ? pantsC : shade(pantsC, -0.22);
    if (pt === 7) return k < 6 ? (front ? '#1e1e24' : '#121216') : skin;
    if (pt === 3) return k < 5 ? pd : skin;
    if (pt === 6) return k < 6 ? pd : skin;
    if (pt === 8) return k < 6 ? pd : skin;
    return pd;
  };
  const legsFront = (back) => {
    const inner0 = tx0 + 1, inner1 = tx1 - 1, lw = Math.floor((inner1 - inner0 + 1) / 2);
    const lx = inner0, rx = inner1 - lw + 1;
    const len = 36 - legsTop;
    const la = walkA ? -2 : 0, rb = walkB ? -2 : 0;
    const spread = pose === 'danceB' ? 1 : 0;
    if (sit) {
      r(tx0 + 1, legsTop, tx1 - tx0 - 1, 3, pantsC); r(tx0 + 1, legsTop + 2, tx1 - tx0 - 1, 1, shade(pantsC, -0.2));
      r(lx, legsTop + 3, lw, 3, shortsLike ? skin : pantsC); r(rx, legsTop + 3, lw, 3, shortsLike ? skin : shade(pantsC, -0.1));
      shoe(lx - 1, 37, lw + 1, true, back); shoe(rx, 37, lw + 1, false, back);
      return;
    }
    for (let k = 0; k < len + la; k++) r(lx - spread, legsTop + k, lw, 1, legCol(k, len, !back));
    for (let k = 0; k < len + rb; k++) r(rx + spread, legsTop + k, lw, 1, legCol(k, len, !back));
    if (pt === 8) { for (let k = 0; k < 6; k++) r(tx0 + 1 - Math.floor(k / 3), legsTop + k, tx1 - tx0 - 1 + Math.floor(k / 3) * 2, 1, k === 5 ? shade(pantsC, -0.3) : pantsC); }
    else if (pt !== 7) r(rx + spread, legsTop, 1, Math.min(len + rb, pt === 3 ? 5 : pt === 6 ? 6 : len), shade(pantsC, -0.3));
    if (pt === 4 && !back) { r(lx - spread, legsTop, 1, len, topL === pantsC ? '#f4f0e6' : '#f4f0e6'); }
    if (pt === 2) { r(lx - spread + 1, legsTop + 4, 2, 2, shade(pantsC, -0.35)); r(rx + spread + 1, legsTop + 4, 2, 2, shade(pantsC, -0.35)); }
    if (pt === 6) for (let k = 0; k < 6; k += 2) { p(lx + (k % 3), legsTop + k, '#f4f0e6'); p(rx + 1 + (k % 2), legsTop + k + 1, '#f4f0e6'); }
    if (pt === 5) { p(lx + 1, legsTop + 3, shade(pantsC, 0.12)); p(lx + 1, legsTop + 6, shade(pantsC, 0.12)); }
    shoe(lx - 1 - spread, 36 + la, lw + 1, true, back); shoe(rx + spread, 36 + rb, lw + 1, false, back);
  };
  const legsSide = () => {
    const sx0 = tx0 + 2, sx1 = tx1 - 2, lw = Math.max(3, Math.min(4, sx1 - sx0));
    const len = 36 - legsTop;
    if (sit) {
      const fx = sx0 - 6;
      r(fx, legsTop, sx1 - fx + 1, 3, pantsC); r(fx, legsTop + 2, sx1 - fx + 1, 1, shade(pantsC, -0.2));
      r(fx, legsTop + 3, 3, 33 - legsTop, shortsLike ? skin : pantsC);
      if (ride) { r(fx + 2, legsTop + 3, 3, 33 - legsTop, shortsLike ? skin : shade(pantsC, -0.15)); shoe(fx + 1, 35, 4, true); }
      shoe(fx - 1, 37, 4, true);
      return;
    }
    const back = { x: sx0 + 1, c: false }, front = { x: sx0, c: true };
    if (walkA) { front.x = sx0 - 2; back.x = sx0 + 3; }
    if (walkB) { front.x = sx0 + 3; back.x = sx0 - 2; }
    for (let k = 0; k < len; k++) r(back.x, legsTop + k, lw, 1, legCol(k, len, false));
    shoe(back.x - 1, 36, lw + 1, true, true);
    for (let k = 0; k < len; k++) r(front.x, legsTop + k, lw, 1, legCol(k, len, true));
    if (pt === 8) for (let k = 0; k < 6; k++) r(sx0 - Math.floor(k / 3), legsTop + k, sx1 - sx0 + 1 + Math.floor(k / 3) * 2, 1, k === 5 ? shade(pantsC, -0.3) : pantsC);
    if (pt === 4) r(front.x + 1, legsTop, 1, len, '#f4f0e6');
    if (pt === 2) r(front.x + 1, legsTop + 4, 2, 2, shade(pantsC, -0.35));
    shoe(front.x - 1, 36, lw + 1, true, false);
  };

  /* ---------- Oberkörper ---------- */
  const armCol = longSleeve ? topC : skin, armColD = longSleeve ? topD : skinD;
  const sleeveRows = T === 5 ? 0 : longSleeve ? 99 : 3;
  const armFront = (ax, side, back) => {
    const len = legsTop - tTop - 1;
    const col = (k) => (k < sleeveRows ? (side > 0 ? topD : topC) : (back ? skinD : side > 0 ? skinD : skin));
    if (pose === 'drink' && side > 0 && !back) { for (let k = 0; k < 3; k++) r(ax, tTop + 1 + k, 2, 1, col(k)); for (let k = 0; k < tTop - hy - 4; k++) r(ax, hy + 7 + k, 2, 1, k < 2 ? skin : col(99)); drawGlass(r, p, ax - 1, hy + 4); return; }
    if (pose === 'danceA' || (pose === 'danceB' && side > 0)) { for (let k = 0; k < tTop - hy + 3; k++) r(ax, hy - 2 + k, 2, 1, k < 3 ? skin : col(k > 6 ? 0 : 99)); return; }
    if (pose === 'danceB' && side < 0) { r(ax - 4, tTop + 2, 6, 2, col(0)); r(ax - 5, tTop + 2, 2, 2, skin); return; }
    if (ride) { r(ax, tTop + 1, 2, 4, col(0)); return; }
    if (rub && side < 0 && !back) { const sh = pose === 'rubB' ? 3 : 0; r(ax, tTop + 1, 2, 5, col(0)); r(ax, tTop + 6, 5 + sh, 2, col(99)); r(ax + 4 + sh, tTop + 6, 2, 2, skin); return; }
    let l = len + (bend ? 2 : 0);
    if ((walkA && side < 0) || (walkB && side > 0)) l += 1;
    if ((walkA && side > 0) || (walkB && side < 0)) l -= 1;
    for (let k = 0; k < l; k++) r(ax, tTop + 1 + k, 2, 1, col(k));
    r(ax, tTop + 1 + l - 1, 2, 2, skin);
    if (L.mark === 7 && !longSleeve && side < 0 && !back) { p(ax, tTop + 5, '#2a3a5a'); p(ax + 1, tTop + 6, '#2a3a5a'); p(ax, tTop + 7, '#2a3a5a'); }
    if (L.acc === 3 && side < 0 && !back) r(ax, tTop + l - 1, 2, 1, '#d9dde3');
  };
  const torsoFront = (back) => {
    r(tx0, tTop, tx1 - tx0 + 1, legsTop - tTop, topC);
    r(tx1 - 1, tTop, 2, legsTop - tTop, topD);
    if (L.build >= 2 && !L.fem) { p(tx0 - 1, tTop, topC); p(tx1 + 1, tTop, topD); }
    if (L.fem) { r(tx0 + 1, tTop + 4, tx1 - tx0 - 1, 2, topL); }
    r(tx0, legsTop - 1, tx1 - tx0 + 1, 1, pt === 7 ? '#1e1e24' : shade(pantsC, -0.25));
    const cx0 = tx0 + Math.floor((tx1 - tx0) / 2);
    if (back) {
      if (T === 3) r(tx0 + 1, tTop - 1, tx1 - tx0 - 1, 3, topD);
      if (T === 10) { r(tx0 + 1, legsTop - 5, tx1 - tx0 - 1, 3, topD); p(cx0, legsTop - 4, topC); }
      if (T === 6 || T === 10) pxTiny(r, L.print === 3 ? '7' : '', cx0 - 1, tTop + 2, '#f6f4ee');
      if (T === 7 || T === 8) r(cx0, tTop, 1, legsTop - tTop, topD);
      if (L.acc === 1) { r(tx0 + 2, tTop + 1, tx1 - tx0 - 3, 7, '#30333a'); r(tx0 + 3, tTop + 2, tx1 - tx0 - 5, 1, '#4a4e57'); r(tx0 + 3, tTop + 5, tx1 - tx0 - 5, 1, '#4a4e57'); }
      if (L.acc === 6) { for (let k = 0; k < legsTop - tTop; k++) p(tx0 + 2 + Math.floor(k * 0.5), tTop + k, '#2a2a30'); }
      return;
    }
    drawTopFront(r, p, L, T, tTop, legsTop, tx0, tx1, cx0, topC, topD, topL, skin);
  };
  const headFront = (back) => {
    const wide = L.head === 5 ? 1 : 0, round = L.head === 1, sq = L.head === 2, heart = L.head === 4;
    r(9 - wide, hy, 10 + wide * 2, 1, skin);
    r(8 - wide, hy + 1, 12 + wide * 2, 9, skin);
    r(9 - wide + (heart ? 1 : 0), hy + 10, 10 + wide * 2 - (heart ? 2 : 0), 1, skin);
    if (sq) { p(8 - wide, hy, skin); p(19 + wide, hy, skin); p(8 - wide, hy + 10, skin); p(19 + wide, hy + 10, skin); }
    if (round) { p(7 - wide, hy + 4, skin); p(20 + wide, hy + 4, skinD); p(7 - wide, hy + 5, skin); p(20 + wide, hy + 5, skinD); }
    if (L.head === 3) r(9, hy + 11, 10, 1, skin);
    r(18 + wide, hy + 1, 2, 9, skinD); r(9 - wide, hy + 10, 10 + wide * 2, 1, skinD);
    /* Hals */
    r(12, hy + 11, 4, 1, skinD);
    const earW = L.ears === 2 ? 2 : L.ears === 1 ? 1 : 1;
    const earH = L.ears === 1 ? 2 : 3;
    r(8 - wide - earW, hy + 4, earW, earH, back ? skinD : skin); r(20 + wide, hy + 4, earW, earH, skinD);
    if (back) return;
    /* Gesicht */
    const ey = hy + 5;
    const big = L.eyes === 1, narrow = L.eyes === 2, tired = L.eyes === 3;
    const eyeW = '#f5f2ea';
    if (narrow) { r(10, ey, 2, 1, eyeC); r(16, ey, 2, 1, eyeC); }
    else {
      p(10, ey, eyeW); p(11, ey, eyeC); p(16, ey, eyeC); p(17, ey, eyeW);
      if (big) { r(10, ey - 1, 2, 1, eyeW); r(16, ey - 1, 2, 1, eyeW); p(11, ey - 1, lc(L, 'eyeCol')); p(16, ey - 1, lc(L, 'eyeCol')); }
      if (L.eyes === 4) { p(10, ey - 1, eyeW); p(17, ey - 1, eyeW); }
    }
    if (tired) { r(10, ey + 1, 2, 1, shade(skin, -0.3)); r(16, ey + 1, 2, 1, shade(skin, -0.3)); }
    const browC = mix(L.hair === 0 || L.hair === 10 ? beard : hair, '#2a1a12', 0.35);
    const by = ey - (big ? 2 : 1);
    if (L.brows === 0 || L.brows === 4) { r(10, by, 2, 1, browC); r(16, by, 2, 1, browC); }
    if (L.brows === 1) { r(9, by, 3, 1, browC); r(16, by, 3, 1, browC); p(9, by - 1, browC); p(18, by - 1, browC); }
    if (L.brows === 2) { p(10, by, browC); p(17, by, browC); }
    if (L.brows === 3) { p(10, by, browC); p(11, by + 1 - 1, browC); r(11, by, 1, 1, browC); p(12, by, browC); p(15, by, browC); p(16, by, browC); p(17, by, browC); p(12, by + 0, browC); }
    /* Nase */
    const nx = 13;
    if (L.nose === 0) p(nx + 1, ey + 2, skinD);
    else if (L.nose === 2) r(nx, ey + 2, 3, 1, skinD);
    else if (L.nose === 4) { r(nx, ey + 2, 2, 1, skinD); p(nx + 1, ey + 1, mix(skin, '#d0605a', 0.2)); }
    else { p(nx + 1, ey + 1, skinD); p(nx + 1, ey + 2, skinD); p(nx, ey + 2, skinD); }
    /* Mund */
    const my = hy + 8;
    const lip = L.fem ? mix(skin, '#c43a52', 0.5) : mouthC;
    if (L.mouth === 2) { r(11, my, 6, 1, '#f4efe4'); p(10, my - 1, mouthC); p(17, my - 1, mouthC); r(11, my + 1, 6, 1, mouthC); }
    else if (L.mouth === 0) { r(12, my, 4, 1, lip); p(11, my - 1, lip); p(16, my - 1, lip); }
    else if (L.mouth === 3) r(13, my, 2, 1, lip);
    else if (L.mouth === 4) { r(12, my, 4, 2, lip); r(13, my, 2, 1, shade(lip, 0.2)); }
    else if (L.mouth === 5) { r(12, my, 3, 1, lip); p(15, my - 1, lip); }
    else r(12, my, 4, 1, lip);
    if (L.mark === 4 || L.mark === 5) { r(9, ey + 2, 2, 1, mix(skin, '#e05a6a', 0.45)); r(17, ey + 2, 2, 1, mix(skin, '#e05a6a', 0.45)); }
    if (L.mark === 1) { p(10, ey + 2, mix(skin, '#9a4a20', 0.4)); p(17, ey + 2, mix(skin, '#9a4a20', 0.4)); p(12, ey + 3, mix(skin, '#9a4a20', 0.4)); }
    if (L.mark === 2) { p(17, ey + 1, skinL); p(18, ey + 2, skinL); }
    if (L.mark === 3) p(11, my - 1, '#4a2e22');
    if (L.mark === 6) { r(10, ey + 1, 2, 1, mix(skin, '#5a3a5a', 0.3)); r(16, ey + 1, 2, 1, mix(skin, '#5a3a5a', 0.3)); }
    if (L.jewel === 1 || L.jewel === 3) p(7 - wide - earW + earW - 1, hy + 7, '#f2c84b');
    if (L.jewel >= 2) p(20 + wide, hy + 7, L.jewel === 2 ? '#d9dde3' : '#f2c84b');
    /* Bart */
    const bd = L.beard, bc = beard;
    if (bd === 1) for (let yy = my; yy <= hy + 10; yy++) for (let xx = 9; xx <= 18; xx++) if ((xx + yy) % 2 === 0 && !(yy === my && xx > 11 && xx < 16)) p(xx, yy, mix(bc, skin, 0.5));
    if (bd === 2 || bd === 6 || bd === 7) r(11, my - 1, 6, 1, bc);
    if (bd === 3 || bd === 6) r(12, hy + 9, 4, 2, bc);
    if (bd === 7) { r(11, hy + 9, 6, 1, bc); p(11, hy + 10, bc); p(16, hy + 10, bc); }
    if (bd === 4 || bd === 5) { r(8, my - 1, 12, 1, bc); r(8, my - 2, 1, 1, bc); r(19, my - 2, 1, 1, bc); r(8, my, 2, 3, bc); r(18, my, 2, 3, bc); r(9, hy + 9, 10, 2, bc); r(10, hy + 11, 8, 1, bc); if (bd === 5) { r(11, hy + 12, 6, 2, bc); r(12, hy + 14, 4, 1, bc); } }
    /* Haare vorne */
    hairFront(wide);
    /* Brille */
    if (L.glasses) {
      const gc = ['', '#26262c', '#26262c', '#151519', '#ff7a2a', '#5a3418'][L.glasses];
      if (L.glasses === 3) { r(9, ey - 1, 4, 2, '#151519'); r(15, ey - 1, 4, 2, '#151519'); r(13, ey - 1, 2, 1, '#151519'); p(9, ey - 1, '#5a6070'); p(15, ey - 1, '#5a6070'); }
      else if (L.glasses === 4) { r(9, ey - 1, 10, 2, gc); r(10, ey, 2, 1, '#b45ad0'); r(16, ey, 2, 1, '#b45ad0'); }
      else if (L.glasses === 1) { p(9, ey, gc); p(12, ey, gc); p(15, ey, gc); p(18, ey, gc); r(10, ey - 1, 2, 1, gc); r(16, ey - 1, 2, 1, gc); r(10, ey + 1, 2, 1, gc); r(16, ey + 1, 2, 1, gc); r(13, ey, 2, 1, gc); }
      else { p(9, ey, gc); p(12, ey, gc); p(15, ey, gc); p(18, ey, gc); r(9, ey - 1, 4, 1, gc); r(15, ey - 1, 4, 1, gc); r(13, ey, 2, 1, gc); if (L.glasses === 5) { r(9, ey - 1, 4, 1, '#3a2010'); r(15, ey - 1, 4, 1, '#3a2010'); } }
    }
    if (L.acc === 7) { r(16, my, 3, 1, '#f4f0e6'); p(19, my, '#ff7a2a'); }
  };
  const hairFront = (wide) => {
    const hs = L.hair;
    const W0 = 8 - wide, W1 = 19 + wide;
    const top = (y0, y1, x0 = W0, x1 = W1) => r(x0, y0, x1 - x0 + 1, y1 - y0 + 1, hair);
    const sides = (y0, y1, w = 1) => { r(W0 - w + 1, y0, w, y1 - y0 + 1, hair); r(W1, y0, w, y1 - y0 + 1, hairD); };
    switch (hs) {
      case 0: break;
      case 1: for (let yy = hy; yy <= hy + 2; yy++) for (let xx = W0; xx <= W1; xx++) if ((xx + yy) % 2 === 0) p(xx, yy, mix(hair, skin, 0.4)); break;
      case 2: top(hy - 1, hy + 2); sides(hy + 3, hy + 5); break;
      case 3: top(hy - 1, hy + 2); sides(hy + 3, hy + 5); r(13, hy + 3, 7, 1, hair); r(11, hy - 1, 1, 4, hairD); break;
      case 4: top(hy - 2, hy + 2, W0 + 1, W1 - 1); for (let yy = hy + 3; yy <= hy + 4; yy++) for (let xx of [W0, W1]) if (yy % 2) p(xx, yy, mix(hair, skin, 0.5)); break;
      case 5: top(hy - 2, hy + 2); r(9, hy - 4, 7, 2, hair); r(10, hy - 5, 4, 1, hairL); sides(hy + 3, hy + 4); break;
      case 6: top(hy - 2, hy + 3, W0 - 1, W1 + 1); for (let k = 0; k < 10; k++) p(W0 - 1 + Math.floor(hash(k, hs) * 14), hy - 2 + Math.floor(hash(hs, k) * 6), k % 2 ? hairD : hairL); sides(hy + 4, hy + 6, 2); break;
      case 7: for (let yy = hy - 6; yy <= hy + 9; yy++) { const dy = (yy - (hy + 1)) / 9; const w = Math.round(10 * Math.sqrt(Math.max(0, 1 - dy * dy))); if (yy < hy) r(14 - w, yy, w * 2, 1, hair); else { r(14 - w, yy, Math.max(0, w - 6), 1, hair); r(20, yy, Math.max(0, w - 6), 1, hairD); } } for (let k = 0; k < 16; k++) p(5 + Math.floor(hash(k, 77) * 18), hy - 6 + Math.floor(hash(77, k) * 5), k % 2 ? hairD : hairL); break;
      case 8: top(hy - 1, hy + 2); sides(hy + 3, hy + 5); r(12, hy - 4, 4, 3, hair); r(12, hy - 4, 4, 1, hairL); break;
      case 9: top(hy - 2, hy + 2); sides(hy + 3, hy + 11, 2); r(W0 - 1, hy + 10, 1, 2, hairD); break;
      case 10: sides(hy + 1, hy + 5); r(W0, hy, 2, 1, hair); r(W1 - 1, hy, 2, 1, hairD); break;
      case 11: top(hy - 1, hy + 2); for (const sx of [9, 12, 15, 18]) { r(sx, hy - 4, 2, 3, hair); p(sx, hy - 5, hairL); } sides(hy + 3, hy + 4); break;
      case 12: top(hy - 1, hy + 2); sides(hy + 3, hy + 4); r(W1 + 1, hy + 2, 2, 7, hairD); break;
      case 13: top(hy - 2, hy + 2); sides(hy + 3, hy + 9, 2); r(W0 - 1, hy + 9, 2, 1, hairD); r(W1, hy + 9, 2, 1, hairD); break;
      case 14: top(hy - 2, hy + 2); sides(hy + 3, hy + 14, 2); r(W0 - 2, hy + 8, 1, 6, hair); r(W1 + 1, hy + 8, 1, 6, hairD); break;
      case 15: top(hy - 1, hy + 2); r(13, hy - 1, 2, 2, hairD); r(W0, hy + 3, 2, 3, hair); r(W1 - 1, hy + 3, 2, 3, hairD); break;
    }
    hatFront(wide);
  };
  const hatFront = (wide) => {
    const st = L.hat; if (!st) return;
    const hd = shade(hatC, -0.3), hl = shade(hatC, 0.2);
    const W0 = 8 - wide, W1 = 19 + wide;
    switch (st) {
      case 1: r(W0, hy - 2, W1 - W0 + 1, 4, hatC); r(W0 + 1, hy - 3, W1 - W0 - 1, 1, hatC); r(W0 - 1, hy + 2, W1 - W0 + 3, 1, hd); r(W0, hy - 2, 1, 4, hl); break;
      case 2: r(W0, hy - 2, W1 - W0 + 1, 4, hatC); r(W0 + 1, hy - 3, W1 - W0 - 1, 1, hatC); r(W0, hy - 2, 1, 4, hl); break;
      case 3: r(W0, hy - 3, W1 - W0 + 1, 6, hatC); r(W0 + 1, hy - 4, W1 - W0 - 1, 1, hatC); r(W0, hy + 1, W1 - W0 + 1, 2, hd); for (let xx = W0; xx <= W1; xx += 2) p(xx, hy - 1, hl); p(13, hy - 5, hl); p(14, hy - 5, hl); break;
      case 4: r(W0, hy - 2, W1 - W0 + 1, 4, hatC); r(W0 + 1, hy - 3, W1 - W0 - 1, 1, hatC); r(W0 - 2, hy + 2, W1 - W0 + 5, 1, hd); r(W0 - 1, hy + 1, 1, 1, hd); r(W1 + 1, hy + 1, 1, 1, hd); break;
      case 5: r(W0 - 1, hy - 3, W1 - W0 + 3, 5, hatC); r(W0, hy - 4, W1 - W0 + 1, 1, hatC); for (const xx of [W0 + 1, W0 + 4, W0 + 7, W0 + 10]) r(xx, hy - 3, 1, 4, hd); r(W0 - 1, hy + 2, W1 - W0 + 3, 1, '#2a2a2e'); p(W0, hy + 7, '#2a2a2e'); p(W1, hy + 7, '#2a2a2e'); break;
      case 6: { const sc = '#e8d8a0', sd = '#b8a060'; r(W0, hy - 3, W1 - W0 + 1, 4, sc); r(W0 + 1, hy - 4, W1 - W0 - 1, 1, sc); r(W0 - 3, hy + 1, W1 - W0 + 7, 2, sc); r(W0 - 3, hy + 2, W1 - W0 + 7, 1, sd); r(W0, hy, W1 - W0 + 1, 1, '#c8352d'); break; }
      case 7: r(W0, hy + 2, W1 - W0 + 1, 2, hatC); r(W0, hy + 2, W1 - W0 + 1, 1, hl); break;
      case 8: r(W0, hy - 1, W1 - W0 + 1, 4, hatC); r(W0 + 1, hy - 2, W1 - W0 - 1, 1, hatC); for (let xx = W0 + 1; xx <= W1; xx += 3) p(xx, hy, hl); r(W1 + 1, hy + 2, 2, 2, hd); break;
    }
  };

  /* ---------- Rückansicht ---------- */
  if (dir === 3) {
    legsFront(true);
    torsoFront(true);
    armFront(tx0 - 2, -1, true); armFront(tx1 + 1, 1, true);
    headFront(true);
    const hs = L.hair, hd = hairD;
    const W0 = 8 - (L.head === 5 ? 1 : 0), W1 = 19 + (L.head === 5 ? 1 : 0);
    const backHair = (y0, y1, x0 = W0, x1 = W1) => { r(x0, y0, x1 - x0 + 1, y1 - y0 + 1, hair); r(x1 - 1, y0, 2, y1 - y0 + 1, hd); };
    if (hs === 1) for (let yy = hy; yy <= hy + 6; yy++) for (let xx = W0; xx <= W1; xx++) if ((xx + yy) % 2 === 0) p(xx, yy, mix(hair, skin, 0.4));
    else if (hs === 10) { backHair(hy + 2, hy + 7); }
    else if (hs === 7) { E(x, 13.5, hy + 2, 9, 8, hair); r(W0 - 2, hy + 1, 2, 9, hair); r(W1 + 1, hy + 1, 2, 9, hd); }
    else if (hs === 9 || hs === 14) { backHair(hy - 2, hy + (hs === 14 ? 20 : 14), W0 - 1, W1 + 1); }
    else if (hs === 13) backHair(hy - 2, hy + 11, W0 - 1, W1 + 1);
    else if (hs === 12) { backHair(hy - 1, hy + 6); r(12, hy + 6, 4, 9, hair); r(14, hy + 6, 2, 9, hd); r(12, hy + 5, 4, 1, hairD); }
    else if (hs === 8) { backHair(hy - 1, hy + 6); r(12, hy - 4, 4, 3, hair); }
    else if (hs === 11) { backHair(hy - 1, hy + 6); for (const sx of [9, 12, 15, 18]) r(sx, hy - 4, 2, 3, hair); }
    else if (hs === 5) { backHair(hy - 2, hy + 6); }
    else if (hs === 6) { backHair(hy - 2, hy + 7, W0 - 1, W1 + 1); for (let k = 0; k < 10; k++) p(W0 - 1 + Math.floor(hash(k, 6) * 14), hy - 2 + Math.floor(hash(6, k) * 9), k % 2 ? hd : hairL); }
    else if (hs === 4) { backHair(hy - 2, hy + 2, W0 + 1, W1 - 1); for (let yy = hy + 3; yy <= hy + 6; yy++) for (let xx = W0; xx <= W1; xx++) if ((xx + yy) % 2 === 0) p(xx, yy, mix(hair, skin, 0.5)); }
    else if (hs !== 0) backHair(hy - 1, hy + 6);
    const st = L.hat, hd2 = shade(hatC, -0.3);
    if (st === 1 || st === 2 || st === 4 || st === 8) { r(W0, hy - 2, W1 - W0 + 1, 5, hatC); r(W0 + 1, hy - 3, W1 - W0 - 1, 1, hatC); r(W1 - 1, hy - 2, 2, 5, hd2); if (st === 2) r(W0 - 1, hy + 2, W1 - W0 + 3, 1, hd2); if (st === 4) r(W0 - 2, hy + 2, W1 - W0 + 5, 1, hd2); if (st === 8) { r(12, hy + 3, 4, 2, hatC); r(11, hy + 5, 2, 3, hd2); r(15, hy + 5, 2, 3, hd2); } if (st === 1) r(12, hy + 1, 4, 1, hd2); }
    else if (st === 3) { r(W0, hy - 3, W1 - W0 + 1, 6, hatC); r(W0 + 1, hy - 4, W1 - W0 - 1, 1, hatC); r(W0, hy + 1, W1 - W0 + 1, 2, hd2); }
    else if (st === 5) { r(W0 - 1, hy - 3, W1 - W0 + 3, 6, hatC); r(W0, hy - 4, W1 - W0 + 1, 1, hatC); for (const xx of [W0 + 1, W0 + 4, W0 + 7, W0 + 10]) r(xx, hy - 3, 1, 5, hd2); }
    else if (st === 6) { r(W0, hy - 3, W1 - W0 + 1, 4, '#e8d8a0'); r(W0 - 3, hy + 1, W1 - W0 + 7, 2, '#e8d8a0'); r(W0 - 3, hy + 2, W1 - W0 + 7, 1, '#b8a060'); }
    else if (st === 7) r(W0, hy + 2, W1 - W0 + 1, 2, hatC);
    if (L.acc === 4) r(tx0 + 1, tTop, tx1 - tx0 - 1, 2, '#f08a1e');
    return;
  }
  /* ---------- Seitenansicht (nach links) ---------- */
  if (dir === 1) {
    const sx0 = tx0 + 2, sx1 = tx1 - 2;
    legsSide();
    /* Rumpf */
    r(sx0, tTop, sx1 - sx0 + 1, legsTop - tTop, topC);
    r(sx1, tTop, 1, legsTop - tTop, topD);
    r(sx0, legsTop - 1, sx1 - sx0 + 1, 1, pt === 7 ? '#1e1e24' : shade(pantsC, -0.25));
    if (T === 3) { r(sx0 + 1, tTop - 1, sx1 - sx0, 2, topD); r(sx0, tTop + 2, 1, 4, '#efefef'); }
    if (T === 7 || T === 8) { r(sx0, tTop, 2, legsTop - tTop, T === 8 ? lc(L, 'topCol') : '#f1efe8'); r(sx0 + 2, tTop, 1, 5, topD); }
    if (T === 9) { r(sx0, tTop + 1, 1, legsTop - tTop - 2, '#f4f0e6'); }
    if (T === 10) { r(sx0, tTop + 4, sx1 - sx0 + 1, 2, '#f4f0e6'); r(sx1 - 1, legsTop - 4, 2, 2, topD); }
    if (T === 5) { r(sx0, tTop, sx1 - sx0 + 1, 2, skin); r(sx0 + 1, tTop, 1, 3, topC); }
    if (L.print === 1 && [0, 2, 6].includes(T)) for (let yy = tTop + 3; yy < legsTop - 2; yy += 3) r(sx0, yy, sx1 - sx0 + 1, 1, topL);
    if (L.acc === 1) r(sx1, tTop + 1, 3, 7, '#30333a');
    if (L.acc === 5) r(sx0 - 1, legsTop - 3, 3, 2, '#3a3d45');
    if (L.acc === 6) r(sx1, legsTop - 5, 3, 5, '#3a3a42');
    if (L.acc === 4) { r(sx0, tTop, sx1 - sx0 + 1, 2, '#f08a1e'); r(sx0, tTop + 2, 2, 6, '#1a1a1e'); p(sx0, tTop + 4, '#f08a1e'); }
    /* Kopf */
    const wide = L.head === 5 ? 1 : 0;
    r(9, hy, 9 + wide, 1, skin); r(8, hy + 1, 11 + wide, 9, skin); r(9, hy + 10, 9 + wide, 1, skin);
    r(17 + wide, hy + 1, 2, 9, skinD);
    r(12, hy + 11, 4, 1, skinD);
    /* Nase & Gesicht */
    const ny = hy + 6;
    if (L.nose === 0) p(7, ny, skinD); else if (L.nose === 2 || L.nose === 4) { r(6, ny, 2, 2, skinD); } else if (L.nose === 3) { p(7, ny, skin); p(6, ny + 1, skinD); p(7, ny + 1, skinD); } else { p(7, ny, skin); p(7, ny + 1, skinD); }
    if (L.nose === 4) p(6, ny + 1, mix(skin, '#d0605a', 0.25));
    const ey = hy + 5;
    if (L.eyes === 2) r(10, ey, 2, 1, eyeC); else { p(10, ey, eyeC); p(11, ey, '#f5f2ea'); if (L.eyes === 1) { p(11, ey - 1, '#f5f2ea'); p(10, ey - 1, lc(L, 'eyeCol')); } }
    const browC = mix(L.hair === 0 || L.hair === 10 ? beard : hair, '#2a1a12', 0.35);
    r(9, ey - (L.eyes === 1 ? 2 : 1), 3, 1, browC);
    const my = hy + 8;
    r(9, my, 2, 1, L.mouth === 2 ? '#f4efe4' : mouthC);
    if (L.mouth === 2) p(8, my, mouthC);
    r(15 + wide, hy + 4, L.ears === 2 ? 2 : 1, L.ears === 1 ? 2 : 3, skinD);
    if (L.jewel >= 1) p(15 + wide, hy + 7, L.jewel === 2 ? '#d9dde3' : '#f2c84b');
    if (L.mark === 4 || L.mark === 5) r(9, ey + 2, 2, 1, mix(skin, '#e05a6a', 0.45));
    /* Bart */
    const bd = L.beard, bc = beard;
    if (bd === 1) for (let yy = my; yy <= hy + 10; yy++) for (let xx = 8; xx <= 15; xx++) if ((xx + yy) % 2 === 0) p(xx, yy, mix(bc, skin, 0.5));
    if (bd === 2 || bd === 6 || bd === 7) r(8, my - 1, 4, 1, bc);
    if (bd === 3 || bd === 6) r(8, hy + 9, 4, 2, bc);
    if (bd === 7) { r(8, hy + 9, 5, 1, bc); p(8, hy + 10, bc); }
    if (bd === 4 || bd === 5) { r(8, my, 9, 1, bc); r(8, hy + 9, 10, 2, bc); r(12, my - 2, 5, 2, bc); r(9, hy + 11, 8, 1, bc); if (bd === 5) { r(9, hy + 12, 6, 2, bc); r(10, hy + 14, 3, 1, bc); } }
    /* Haare seitlich */
    const hs = L.hair;
    const topS = (y0, y1, x0 = 8, x1 = 18 + wide) => { r(x0, y0, x1 - x0 + 1, y1 - y0 + 1, hair); r(x1 - 1, y0, 2, y1 - y0 + 1, hairD); };
    const backS = (y0, y1, x0 = 14 + wide, x1 = 18 + wide) => { r(x0, y0, x1 - x0 + 1, y1 - y0 + 1, hair); r(x1 - 1, y0, 2, y1 - y0 + 1, hairD); };
    switch (hs) {
      case 0: break;
      case 1: for (let yy = hy; yy <= hy + 6; yy++) for (let xx = 8; xx <= 18 + wide; xx++) if ((xx + yy) % 2 === 0 && (yy <= hy + 2 || xx >= 14)) p(xx, yy, mix(hair, skin, 0.4)); break;
      case 2: case 3: case 8: case 11: case 12: case 15: topS(hy - 1, hy + 2); backS(hy + 3, hy + 6);
        if (hs === 3) r(8, hy + 3, 3, 1, hair);
        if (hs === 8) { r(16, hy - 4, 4, 3, hair); r(16, hy - 4, 4, 1, hairL); }
        if (hs === 11) for (const sx of [9, 12, 15, 18]) { r(sx, hy - 4, 2, 3, hair); p(sx, hy - 5, hairL); }
        if (hs === 12) { r(18 + wide, hy + 3, 3, 3, hair); r(19 + wide, hy + 6, 3, 8, hair); r(21 + wide, hy + 6, 1, 8, hairD); }
        if (hs === 15) r(8, hy + 3, 2, 3, hair);
        break;
      case 4: topS(hy - 2, hy + 2, 9, 17 + wide); for (let yy = hy + 3; yy <= hy + 6; yy++) for (let xx = 14; xx <= 18 + wide; xx++) if ((xx + yy) % 2 === 0) p(xx, yy, mix(hair, skin, 0.5)); break;
      case 5: topS(hy - 2, hy + 2); r(6, hy - 4, 8, 3, hair); r(7, hy - 5, 4, 1, hairL); backS(hy + 3, hy + 6); break;
      case 6: topS(hy - 2, hy + 3, 7, 19 + wide); backS(hy + 4, hy + 7, 13 + wide, 19 + wide); for (let k = 0; k < 10; k++) p(7 + Math.floor(hash(k, 66) * 13), hy - 2 + Math.floor(hash(66, k) * 7), k % 2 ? hairD : hairL); break;
      case 7: E(x, 13 + wide, hy + 2, 9, 8, hair); r(8, hy + 2, 7, 6, skin); r(18 + wide, hy - 2, 3, 10, hairD); break;
      case 9: topS(hy - 2, hy + 2); backS(hy + 3, hy + 11, 15 + wide, 19 + wide); r(8, hy + 3, 1, 7, hair); break;
      case 10: backS(hy + 1, hy + 5); r(14, hy, 4, 1, hair); break;
      case 13: topS(hy - 2, hy + 2, 7, 19 + wide); backS(hy + 3, hy + 9, 14 + wide, 20 + wide); r(7, hy + 3, 1, 6, hair); break;
      case 14: topS(hy - 2, hy + 2, 7, 19 + wide); backS(hy + 3, hy + 14, 14 + wide, 20 + wide); r(7, hy + 3, 1, 8, hair); break;
    }
    /* Brille seitlich */
    if (L.glasses) { const gc = L.glasses === 3 ? '#151519' : L.glasses === 4 ? '#ff7a2a' : L.glasses === 5 ? '#5a3418' : '#26262c'; r(8, ey, 4, 1, gc); r(12, ey - 1, 4, 1, gc); if (L.glasses === 3 || L.glasses === 4) r(8, ey - 1, 4, 1, gc); }
    /* Hut seitlich */
    const st = L.hat, hd2 = shade(hatC, -0.3), hl2 = shade(hatC, 0.2);
    if (st === 1 || st === 2 || st === 4 || st === 8) { r(8, hy - 2, 11 + wide, 4, hatC); r(9, hy - 3, 9 + wide, 1, hatC); r(17 + wide, hy - 2, 2, 4, hd2); if (st === 1) r(3, hy + 2, 9, 1, hd2); if (st === 2) r(14 + wide, hy + 2, 7, 1, hd2); if (st === 4) { r(5, hy + 2, 16 + wide, 1, hd2); p(5, hy + 1, hd2); } if (st === 8) { r(18 + wide, hy + 2, 3, 2, hatC); r(20 + wide, hy + 4, 1, 3, hd2); } p(8, hy - 1, hl2); }
    else if (st === 3) { r(8, hy - 3, 11 + wide, 6, hatC); r(9, hy - 4, 9 + wide, 1, hatC); r(8, hy + 1, 11 + wide, 2, hd2); for (let xx = 8; xx <= 18; xx += 2) p(xx, hy - 1, hl2); }
    else if (st === 5) { r(7, hy - 3, 13 + wide, 5, hatC); r(8, hy - 4, 11 + wide, 1, hatC); for (const xx of [9, 12, 15]) r(xx, hy - 3, 1, 4, hd2); r(7, hy + 2, 13 + wide, 1, '#2a2a2e'); p(14, hy + 7, '#2a2a2e'); }
    else if (st === 6) { r(8, hy - 3, 11 + wide, 4, '#e8d8a0'); r(4, hy + 1, 19 + wide, 2, '#e8d8a0'); r(4, hy + 2, 19 + wide, 1, '#b8a060'); r(8, hy, 11 + wide, 1, '#c8352d'); }
    else if (st === 7) r(8, hy + 2, 11 + wide, 2, hatC);
    if (L.acc === 7) { r(4, my, 4, 1, '#f4f0e6'); p(4, my, '#ff7a2a'); }
    /* Arm */
    let ax = sx0 + 1;
    if (walkA) ax = sx0 - 1; if (walkB) ax = sx0 + 3;
    const col = (k) => (k < sleeveRows ? topD : skin);
    if (pose === 'drink') { for (let k = 0; k < 3; k++) r(sx0, tTop + 1 + k, 2, 1, col(k)); r(sx0 - 2, hy + 8, 2, tTop - hy - 6, skin); r(sx0 - 2, tTop + 1, 3, 1, col(99)); drawGlass(r, p, sx0 - 4, hy + 5); }
    else if (dance) { for (let k = 0; k < tTop - hy + 3; k++) r(sx0 + 1, hy - 2 + k, 2, 1, k < 3 ? skin : col(k > 6 ? 0 : 99)); }
    else if (ride) { r(sx0, tTop + 1, 2, 3, col(0)); r(sx0 - 5, tTop + 3, 6, 2, col(sleeveRows ? 1 : 99)); r(sx0 - 6, tTop + 3, 2, 2, skin); }
    else if (sit) { r(sx0, tTop + 1, 2, legsTop - tTop - 2, col(0)); r(sx0 - 2, legsTop - 2, 4, 2, skin); }
    else { const l = legsTop - tTop - 1 + (bend ? 2 : 0); for (let k = 0; k < l; k++) r(ax, tTop + 1 + k, 2, 1, col(k)); r(ax, tTop + l, 2, 1, skin); if (L.acc === 3) r(ax, tTop + l - 1, 2, 1, '#d9dde3'); }
    return;
  }
  /* ---------- Frontansicht ---------- */
  legsFront(false);
  if ([9, 14, 13, 7].includes(L.hair)) { const W0 = 8, W1 = 19; if (L.hair === 7) E(x, 13.5, hy + 2, 9, 8, hairD); else { r(W0 - 1, hy, 2, 10 + (L.hair === 14 ? 8 : 0), hairD); r(W1, hy, 2, 10 + (L.hair === 14 ? 8 : 0), hairD); } }
  torsoFront(false);
  armFront(tx0 - 2, -1, false); armFront(tx1 + 1, 1, false);
  if (L.acc === 1) { r(tx0 + 1, tTop, 2, 5, '#30333a'); r(tx1 - 2, tTop, 2, 5, '#30333a'); }
  if (L.acc === 5) { for (let k = 0; k < 7; k++) p(tx1 - 1 - k, tTop + k, '#2a2c33'); r(tx0, tTop + 7, 4, 3, '#3a3d45'); }
  if (L.acc === 6) { for (let k = 0; k < 8; k++) p(tx0 + 1 + k, tTop + k, '#2a2a30'); r(tx1 - 2, legsTop - 6, 4, 5, '#3a3a42'); }
  if (L.acc === 4) { r(tx0 + 2, tTop, tx1 - tx0 - 3, 2, '#f08a1e'); for (let xx = tx0 + 2; xx < tx1 - 1; xx += 2) p(xx, tTop, '#1a1a1e'); r(tx0 + 2, tTop + 2, 2, 5, '#1a1a1e'); p(tx0 + 2, tTop + 4, '#f08a1e'); }
  if (L.acc === 2) { r(12, tTop + 1, 4, 1, '#e8c04a'); p(13, tTop + 2, '#e8c04a'); }
  headFront(false);
}
function drawGlass(r, p, xx, yy) { r(xx, yy, 3, 4, '#e8b33a'); r(xx, yy - 1, 3, 1, '#fbf6e8'); p(xx + 3, yy + 1, '#d9e2e6'); }
function pxTiny(r, s, xx, yy, c) {
  const GL = { 7: ['111', '001', '010', '010', '010'], 1: ['010', '110', '010', '010', '111'], 0: ['111', '101', '101', '101', '111'] };
  let cx = xx;
  for (const ch of String(s)) { const g = GL[ch]; if (!g) continue; for (let j = 0; j < 5; j++) for (let i = 0; i < 3; i++) if (g[j][i] === '1') r(cx + i, yy + j, 1, 1, c); cx += 4; }
}
/* Oberteile von vorn */
function drawTopFront(r, p, L, T, tTop, legsTop, tx0, tx1, cx0, topC, topD, topL, skin) {
  const skinD = shade(skin, -0.14);
  const w = tx1 - tx0 + 1;
  const crew = () => { r(12, tTop, 4, 1, skinD); p(11, tTop, topD); p(16, tTop, topD); };
  const vneck = (d = 2, col = skinD) => { r(12, tTop, 4, 1, col); r(13, tTop + 1, 2, d - 1, col); };
  const collar = (col) => { r(10, tTop, 2, 2, col); r(16, tTop, 2, 2, col); p(11, tTop + 2, col); p(16, tTop + 2, col); };
  const pattern = () => {
    const pr = L.print;
    if (![0, 2, 3, 4, 5, 6, 10].includes(T)) return;
    if (pr === 1) for (let yy = tTop + 3; yy < legsTop - 1; yy += 3) r(tx0, yy, w, 1, topL);
    if (pr === 2) { const red = L.topCol <= 1; const bg = red ? '#ffffff' : '#d52b1e', fg = red ? '#d52b1e' : '#ffffff'; r(12, tTop + 3, 5, 5, bg); r(14, tTop + 4, 1, 3, fg); r(13, tTop + 5, 3, 1, fg); }
    if (pr === 3) pxTiny(r, '7', 12, tTop + 3, L.topCol >= 14 && L.topCol <= 15 ? '#22223a' : '#f6f4ee');
    if (pr === 4) { const lc2 = L.topCol >= 14 && L.topCol <= 15 ? '#2a3a62' : '#f6f4ee'; p(cx0 + 2, tTop + 3, lc2); p(cx0 + 1, tTop + 4, lc2); p(cx0 + 3, tTop + 4, lc2); p(cx0 + 2, tTop + 5, lc2); }
    if (pr === 5) for (let yy = tTop + 1; yy < legsTop - 1; yy++) for (let xx = tx0; xx <= tx1; xx++) if ((Math.floor(xx / 2) + Math.floor(yy / 2)) % 2 === 0) p(xx, yy, topD);
    if (pr === 6) for (let k = 0; k < 3; k++) { const px = tx0 + 1 + k * 3, py = tTop + 3 + (k % 2) * 4; p(px, py, '#3f9e4b'); p(px + 1, py + 1, '#2a6a3a'); p(px, py + 2, '#3f9e4b'); }
  };
  switch (T) {
    case 0: crew(); pattern(); break;
    case 1: vneck(2); collar('#f6f4ee'); for (let yy = tTop + 3; yy < legsTop - 1; yy += 3) p(cx0, yy, topD); break;
    case 2: vneck(2); collar(topL); p(cx0, tTop + 2, '#eee'); p(cx0, tTop + 4, '#eee'); pattern(); break;
    case 3: r(tx0 + 1, tTop - 1, w - 2, 2, topD); crew(); r(cx0 - 2, tTop + 1, 1, 5, '#efefef'); r(cx0 + 2, tTop + 1, 1, 6, '#efefef'); r(tx0 + 1, legsTop - 5, w - 2, 1, topD); r(tx0 + 1, legsTop - 5, 1, 4, topD); r(tx1 - 1, legsTop - 5, 1, 4, topD); pattern(); break;
    case 4: crew(); for (let xx = tx0; xx <= tx1; xx++) if (xx % 2) p(xx, tTop + 1, topD); pattern(); break;
    case 5: r(tx0, tTop, w, 2, skin); r(tx0 + 1, tTop, 1, 3, topC); r(tx1 - 1, tTop, 1, 3, topD); r(12, tTop + 2, 4, 1, skin); pattern(); break;
    case 6: vneck(2); r(tx0, tTop + 1, 1, legsTop - tTop - 2, '#f6f4ee'); r(tx1, tTop + 1, 1, legsTop - tTop - 2, '#f6f4ee'); pattern(); break;
    case 7: { r(cx0 - 2, tTop, 5, legsTop - tTop - 1, '#f1efe8'); r(cx0 - 1, tTop + 4, 3, legsTop - tTop - 5, '#f1efe8'); p(12, tTop, skinD); p(13, tTop, skinD); p(14, tTop, skinD); p(15, tTop, skinD); r(cx0 - 3, tTop, 1, 5, topD); r(cx0 + 3, tTop, 1, 5, topD); for (let k = 0; k < 4; k++) { p(cx0 - 2 + Math.floor(k / 2), tTop + 5 + k, topC); p(cx0 + 2 - Math.floor(k / 2), tTop + 5 + k, topC); } r(cx0 - 2, legsTop - 3, 5, 2, topC); p(cx0, legsTop - 3, topD); break; }
    case 8: { const inner = lc(L, 'topCol'); r(cx0 - 2, tTop, 5, legsTop - tTop - 1, inner); r(cx0, tTop + 2, 1, legsTop - tTop - 4, '#c9ccd0'); r(tx0, tTop, 3, 2, '#3a322c'); r(tx1 - 2, tTop, 3, 2, '#3a322c'); r(12, tTop, 4, 1, skinD); r(tx0 + 2, tTop + 2, 1, 4, '#4a3f38'); r(tx1 - 2, tTop + 2, 1, 4, '#4a3f38'); break; }
    case 9: { r(tx0 + 1, tTop, w - 2, 2, topD); r(12, tTop, 4, 1, skinD); r(cx0, tTop + 2, 1, legsTop - tTop - 3, '#c9ccd0'); r(tx0, tTop + 4, 1, legsTop - tTop - 5, '#f4f0e6'); r(tx1, tTop + 4, 1, legsTop - tTop - 5, '#f4f0e6'); r(cx0 + 2, tTop + 3, 3, 2, '#f4f0e6'); p(cx0 + 3, tTop + 3, '#c8352d'); r(tx0 + 1, legsTop - 2, w - 2, 1, topD); break; }
    case 10: { crew(); r(tx0, tTop + 4, w, 2, '#f4f0e6'); r(tx0, legsTop - 3, w, 2, '#2a2a30'); r(cx0, tTop + 1, 1, 3, '#c9ccd0'); pattern(); break; }
    case 11: { vneck(3); collar(topL); r(cx0, tTop + 4, 1, legsTop - tTop - 5, topL); break; }
  }
  if (pt8(L)) { /* Rock: Bund */ }
}
function pt8(L) { return L.pants === 8; }
