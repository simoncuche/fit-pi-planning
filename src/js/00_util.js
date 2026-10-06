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

/* ---- Pixel-Schrift 5x7 für Schilder, Tafeln und Titel (Vorschub 6 px, Höhe 7 px) ---- */
const PXF = {
  A: '01110100011000111111100011000110001', B: '11110100011000111110100011000111110', C: '01110100011000010000100001000101110', D: '11110100011000110001100011000111110', E: '11111100001000011110100001000011111',
  F: '11111100001000011110100001000010000', G: '01110100011000010111100011000101111', H: '10001100011000111111100011000110001', I: '01110001000010000100001000010001110', J: '00111000100001000010000101001001100',
  K: '10001100101010011000101001001010001', L: '10000100001000010000100001000011111', M: '10001110111010110101100011000110001', N: '10001100011100110101100111000110001', O: '01110100011000110001100011000101110',
  P: '11110100011000111110100001000010000', Q: '01110100011000110001101011001001101', R: '11110100011000111110101001001010001', S: '01111100001000001110000010000111110', T: '11111001000010000100001000010000100',
  U: '10001100011000110001100011000101110', V: '10001100011000110001100010101000100', W: '10001100011000110101101011010101010', X: '10001100010101000100010101000110001', Y: '10001100010101000100001000010000100',
  Z: '11111000010001000100010001000011111', '0': '01110100011001110101110011000101110', '1': '00100011000010000100001000010001110', '2': '01110100010000100010001000100011111', '3': '11111000100010000010000011000101110',
  '4': '00010001100101010010111110001000010', '5': '11111100001111000001000011000101110', '6': '00110010001000011110100011000101110', '7': '11111000010001000100010000100001000', '8': '01110100011000101110100011000101110',
  '9': '01110100011000101111000010001001100', Ä: '10001000000111010001111111000110001', Ö: '10001000000111010001100011000101110', Ü: '10001000001000110001100011000101110', Ñ: '01010101001000111001101011001110001',
  Á: '00010001000111010001111111000110001', É: '00010001001111110000111101000011111', Í: '00010001000111000100001000010001110', Ó: '00010001000111010001100011000101110', Ú: '00010001001000110001100011000101110',
  À: '01000001000111010001111111000110001', È: '01000001001111110000111101000011111', '¿': '00100000000010001000100001000101110', '¡': '00100000000010000100001000010000100', '.': '00000000000000000000000000110001100',
  ',': '00000000000000000000011000010001000', '!': '00100001000010000100001000000000100', '?': '01110100010000100010001000000000100', ':': '00000011000110000000011000110000000', '-': '00000000000000011111000000000000000',
  '–': '00000000000000011111000000000000000', '/': '00001000100001000100010000100010000', '+': '00000001000010011111001000010000000', ' ': '00000000000000000000000000000000000', '&': '01100100101010001000101011001001101',
  "'": '00100001000000000000000000000000000', '’': '00100001000000000000000000000000000', '€': '00111010001111001000111100100000111', '%': '11001110100001000100010000101110011', '·': '00000000000000001100000000000000000',
  '(': '00010001000100001000010000010000010', ')': '01000001000001000010000100010001000', º: '01100100100110000000000000000000000', '"': '01010010100000000000000000000000000', '*': '00000101010111011111011101010100000',
  '=': '00000000001111100000111110000000000', Ç: '01110100011000010000100010111000100',
};
function pxText(x, str, X, Y, c, scale = 1) {
  x.fillStyle = c;
  let cx = X;
  for (const ch of String(str).toUpperCase()) {
    const g = PXF[ch] || PXF[' '];
    for (let i = 0; i < 35; i++) if (g[i] === '1') x.fillRect(cx + (i % 5) * scale, Y + Math.floor(i / 5) * scale, scale, scale);
    cx += 6 * scale;
  }
}
const pxTextW = (str, scale = 1) => String(str).length * 6 * scale - scale;
const PX_H = 7;
