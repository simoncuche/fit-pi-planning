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
const fmtEur = (v) => v.toFixed(2).replace('.', numSep()) + ' €';
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

/* ---- Pixel-Schrift 4x6 für Schilder, Tafeln und Titel (Vorschub 5 px, Höhe 6 px): so klein wie die alte 3x5, aber feiner ---- */
const PXF = {
  A: '011010011001111110011001', B: '111010011110100110011110', C: '011110001000100010000111', D: '111010011001100110011110', E: '111110001110100010001111', F: '111110001110100010001000',
  G: '011110001000101110010111', H: '100110011111100110011001', I: '111001000100010001001110', J: '001100010001000110010110', K: '100110101100110010101001', L: '100010001000100010001111',
  M: '100111111111100110011001', N: '100111011101101110111001', O: '011010011001100110010110', P: '111010011001111010001000', Q: '011010011001100110110111', R: '111010011001111010101001',
  S: '011110000110000100011110', T: '111101000100010001000100', U: '100110011001100110010110', V: '100110011001100101100110', W: '100110011001111111111001', X: '100110010110011010011001',
  Y: '100110010110010001000100', Z: '111100010010010010001111', '0': '011010011011110110010110', '1': '010011000100010001001110', '2': '011010010001001001001111', '3': '111000010110000100011110',
  '4': '001001101010111100100010', '5': '111110001110000100011110', '6': '011010001110100110010110', '7': '111100010010010001000100', '8': '011010010110100110010110', '9': '011010011001011100010110',
  Ä: '100101101001111110011001', Ö: '100101101001100110010110', Ü: '100100001001100110010110', Ñ: '010110101001110110111001', Á: '001001000110100111111001', É: '001001001111111010001111',
  Í: '001001001110010001001110', Ó: '001001000110100110010110', Ú: '001001001001100110010110', À: '010000100110100111111001', È: '010000101111111010001111', '¿': '010000000100100010010110',
  '¡': '010000000100010001000100', '.': '000000000000000000000100', ',': '000000000000000001001000', '!': '010001000100010000000100', '?': '011010010001001000000010', ':': '000001000000000001000000',
  '-': '000000001111000000000000', '–': '000000001111000000000000', '/': '000100010010010010001000', '+': '000001001110010000000000', ' ': '000000000000000000000000', '&': '010010100100101110100101',
  "'": '010001000000000000000000', '’': '010001000000000000000000', '€': '001101001110010001000011', '%': '100100010010010010001001', '·': '000000000100000000000000', '(': '001001000100010001000010',
  ')': '010000100010001000100100', º: '011010010110000000000000', '"': '101010100000000000000000', '*': '000010100100101000000000', '=': '000011110000111100000000', Ç: '011110001000011100100110',
};
function pxText(x, str, X, Y, c, scale = 1) {
  x.fillStyle = c;
  let cx = X;
  for (const ch of String(str).toUpperCase()) {
    const g = PXF[ch] || PXF[' '];
    for (let i = 0; i < 24; i++) if (g[i] === '1') x.fillRect(cx + (i % 4) * scale, Y + Math.floor(i / 4) * scale, scale, scale);
    cx += 5 * scale;
  }
}
const pxTextW = (str, scale = 1) => String(str).length * 5 * scale - scale;
const PX_H = 6;
