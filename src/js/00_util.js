'use strict';
/* ============ Grundwerkzeuge ============
   PI Planning Valencia – Kachelgrösse 24 px (höhere Auflösung als die klassischen 16 px). */
const TS = 24;
const MAP_BUILDERS = {};
const BUILT = {};
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const lerp = (a, b, t) => a + (b - a) * t;
const rnd = (a, b) => a + Math.random() * (b - a);
const rint = (a, b) => Math.floor(a + Math.random() * (b - a + 1));
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const fmtEur = (v) => v.toFixed(2).replace('.', ',') + ' €';
const pad2 = (n) => String(n).padStart(2, '0');

function hash(x, y, s = 0) {
  let h = Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + Math.imul(s | 0, 1013904223);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function canvas(w, h) {
  const c = document.createElement('canvas');
  c.width = Math.max(1, w | 0);
  c.height = Math.max(1, h | 0);
  const x = c.getContext('2d');
  x.imageSmoothingEnabled = false;
  return [c, x];
}

/* ---- Farben ---- */
const _rgbCache = new Map();
function hexToRgb(h) {
  let r = _rgbCache.get(h);
  if (r) return r;
  let s = h.replace('#', '');
  if (s.length === 3) s = s.split('').map((c) => c + c).join('');
  const n = parseInt(s, 16);
  r = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  _rgbCache.set(h, r);
  return r;
}
function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map((v) => clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0')).join('');
}
function shade(hex, f) {
  const [r, g, b] = hexToRgb(hex);
  if (f < 0) return rgbToHex(r * (1 + f), g * (1 + f), b * (1 + f));
  return rgbToHex(r + (255 - r) * f, g + (255 - g) * f, b + (255 - b) * f);
}
function mix(a, b, t) {
  const A = hexToRgb(a), B = hexToRgb(b);
  return rgbToHex(lerp(A[0], B[0], t), lerp(A[1], B[1], t), lerp(A[2], B[2], t));
}
function rgba(hex, a) {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r},${g},${b},${a})`;
}

/* ---- Pixel-Zeichnen ---- */
function R(x, X, Y, W, H, c) {
  if (W <= 0 || H <= 0) return;
  x.fillStyle = c;
  x.fillRect(Math.round(X), Math.round(Y), Math.round(W), Math.round(H));
}
function P(x, X, Y, c) {
  x.fillStyle = c;
  x.fillRect(Math.round(X), Math.round(Y), 1, 1);
}
function E(x, cx, cy, rx, ry, c) {
  x.fillStyle = c;
  for (let yy = -ry; yy <= ry; yy++) {
    const w = Math.round(rx * Math.sqrt(Math.max(0, 1 - (yy * yy) / (ry * ry || 1))));
    x.fillRect(Math.round(cx - w), Math.round(cy + yy), w * 2 + 1, 1);
  }
}
function line(x, x0, y0, x1, y1, c) {
  x0 = Math.round(x0); y0 = Math.round(y0); x1 = Math.round(x1); y1 = Math.round(y1);
  const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
  let err = dx + dy;
  x.fillStyle = c;
  for (let i = 0; i < 600; i++) {
    x.fillRect(x0, y0, 1, 1);
    if (x0 === x1 && y0 === y1) break;
    const e2 = 2 * err;
    if (e2 >= dy) { err += dy; x0 += sx; }
    if (e2 <= dx) { err += dx; y0 += sy; }
  }
}
function dither(x, X, Y, W, H, c, density = 0.5, seed = 1) {
  x.fillStyle = c;
  for (let yy = 0; yy < H; yy++)
    for (let xx = 0; xx < W; xx++) {
      if (density === 0.5 ? (xx + yy) % 2 === 0 : hash(X + xx, Y + yy, seed) < density) x.fillRect(X + xx, Y + yy, 1, 1);
    }
}
/* Gefüllter Kreis-Umriss (für Räder, Schilder) */
function ring(x, cx, cy, r, c) { for (let a = 0; a < 64; a++) { const t = a / 64 * 6.2832; P(x, cx + Math.cos(t) * r, cy + Math.sin(t) * r, c); } }

/* ---- Pixel-Schrift 3x5 für Schilder ---- */
const PXF = {
  A: '010101111101101', B: '110101110101110', C: '011100100100011', D: '110101101101110', E: '111100110100111',
  F: '111100110100100', G: '011100101101011', H: '101101111101101', I: '111010010010111', J: '001001001101010',
  K: '101101110101101', L: '100100100100111', M: '101111111101101', N: '110101101101101', O: '010101101101010',
  P: '110101110100100', Q: '010101101110011', R: '110101110101101', S: '011100010001110', T: '111010010010010',
  U: '101101101101111', V: '101101101101010', W: '101101111111101', X: '101101010101101', Y: '101101010010010',
  Z: '111001010100111', 0: '111101101101111', 1: '010110010010111', 2: '110001010100111', 3: '110001010001110',
  4: '101101111001001', 5: '111100110001110', 6: '011100111101111', 7: '111001010010010', 8: '111101111101111',
  9: '111101111001110', Ä: '101010101111101', Ö: '101010101101010', Ü: '101000101101111', Ñ: '111000110101101', '-': '000000111000000',
  '.': '000000000000010', '&': '010101010101011', "'": '010010000000000', '!': '010010010000010', ':': '000010000010000',
  '/': '001001010100100', '+': '000010111010000', ' ': '000000000000000', '€': '011100110100011', ',': '000000000010100', '?': '110001010000010', '%': '101001010100101',
};
function pxText(x, str, X, Y, c, scale = 1) {
  x.fillStyle = c;
  let cx = X;
  for (const ch of String(str).toUpperCase()) {
    const g = PXF[ch] || PXF[' '];
    for (let i = 0; i < 15; i++) if (g[i] === '1') x.fillRect(cx + (i % 3) * scale, Y + Math.floor(i / 3) * scale, scale, scale);
    cx += 4 * scale;
  }
}
const pxTextW = (str, scale = 1) => String(str).length * 4 * scale - scale;
