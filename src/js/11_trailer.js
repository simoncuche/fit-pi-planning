/* ============ Trailer: Startbildschirm vor der Bordkarte (schnell geschnitten, Comic-Stil) ============ */
if (!CanvasRenderingContext2D.prototype.roundRect) CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) { this.moveTo(x + r, y); this.arcTo(x + w, y, x + w, y + h, r); this.arcTo(x + w, y + h, x, y + h, r); this.arcTo(x, y + h, x, y, r); this.arcTo(x, y, x + w, y, r); this.closePath(); };
const Trailer = {
  el: null, cv: null, x: null, raf: 0, t0: null, done: null, skipTo: null, LW: 540, LH: 960, k: 1, port: true,
  play() {
    if (this.done) return this.done.promise;
    let resolve; const promise = new Promise((r) => { resolve = r; }); this.done = { promise, resolve };
    const el = document.createElement('div'); el.id = 'intro'; el.setAttribute('role', 'button'); el.setAttribute('aria-label', _t('Trailer – tippen zum Überspringen'));
    this.cv = document.createElement('canvas'); el.appendChild(this.cv);
    const vb = document.createElement('button'); vb.className = 'btn intro-trailer'; vb.type = 'button'; vb.textContent = '▶ ' + _t('Trailer'); vb.setAttribute('aria-label', _t('Trailer ansehen'));
    vb.addEventListener('pointerdown', (e) => e.stopPropagation()); vb.addEventListener('click', (e) => { e.stopPropagation(); Trailer.showVideo(); }); el.appendChild(vb);
    document.body.appendChild(el); this.el = el;
    this.x = this.cv.getContext('2d');
    this.resize = () => this._resize(); this._resize(); window.addEventListener('resize', this.resize);
    this.onTap = (e) => { if (document.getElementById('trailerVid')) return; if (e.type === 'keydown' && (e.key === 'Tab' || e.altKey || e.ctrlKey || e.metaKey)) return; e.preventDefault(); this.tap(); };
    el.addEventListener('pointerdown', this.onTap); window.addEventListener('keydown', this.onTap);
    this.t0 = null; this.jump = 0;
    const loop = (ts) => { if (!this.done) return; this.frame(ts); this.raf = requestAnimationFrame(loop); };
    this.raf = requestAnimationFrame(loop);
    return promise;
  },
  /* Trailer-Video (dist/trailer.mp4) im Overlay abspielen; auch von der Bordkarte aus */
  showVideo() {
    if (document.getElementById('trailerVid')) return;
    const o = document.createElement('div'); o.id = 'trailerVid'; o.setAttribute('role', 'dialog'); o.setAttribute('aria-label', _t('Trailer'));
    o.innerHTML = `<video src="trailer.mp4" controls autoplay playsinline preload="metadata"></video><button class="btn vid-close" type="button" aria-label="${_t('Schliessen')}">✕</button>`;
    const close = () => { const v = o.querySelector('video'); try { v.pause(); } catch (e) {} o.remove(); window.removeEventListener('keydown', esc); };
    const esc = (e) => { if (e.key === 'Escape') close(); };
    o.querySelector('.vid-close').onclick = close; o.addEventListener('click', (e) => { if (e.target === o) close(); }); o.addEventListener('pointerdown', (e) => e.stopPropagation());
    window.addEventListener('keydown', esc); document.body.appendChild(o);
    Snd.init(); const v = o.querySelector('video'); v.play && v.play().catch(() => {});
  },
  stop() {
    if (!this.done) return;
    cancelAnimationFrame(this.raf); window.removeEventListener('resize', this.resize); window.removeEventListener('keydown', this.onTap);
    if (this.el) this.el.remove(); this.el = null;
    const d = this.done; this.done = null; d.resolve();
  },
  tap() {
    Snd.init();
    const fi = this.S.length - 1;
    if (this.scene === fi && this.u > 1.2) { this.stop(); return; }
    if (this.scene !== fi) { this.jump = this.before(fi); this.t0 = performance.now(); }
  },
  _resize() {
    const iw = innerWidth, ih = innerHeight, dpr = Math.min(2, devicePixelRatio || 1);
    this.port = ih >= iw;
    if (this.port) { this.LW = 540; this.LH = Math.round(540 * ih / iw); this.k = 1; }
    else { this.LH = 640; this.LW = Math.round(640 * iw / ih); this.k = 1.15; }
    this.cv.width = Math.round(iw * dpr); this.cv.height = Math.round(ih * dpr); this.cv.style.width = iw + 'px'; this.cv.style.height = ih + 'px';
    this.sc = iw * dpr / this.LW;
  },
  before(i) { let t = 0; for (let j = 0; j < i; j++) t += this.S[j][0]; return t; },
  frame(ts) {
    if (this.t0 === null) this.t0 = ts;
    const S = this.S, TOT = this.before(S.length);
    let t = (ts - this.t0) / 1000 + this.jump, i = 0;
    if (t >= TOT) { t = TOT - 0.001; }
    while (t >= S[i][0] && i < S.length - 1) { t -= S[i][0]; i++; }
    this.scene = i; this.u = t;
    const x = this.x; x.setTransform(this.sc, 0, 0, this.sc, 0, 0); x.imageSmoothingEnabled = false;
    x.textBaseline = 'middle'; x.textAlign = 'center';
    S[i][1].call(this, t);
    if (t < 0.07 && i > 0) this.R(0, 0, this.LW, this.LH, `rgba(255,255,255,${(1 - t / 0.07).toFixed(2)})`);
    if (i < S.length - 1) { x.font = `${Math.round(13 * this.k)}px ${TR_FONT_SIGN}`; x.fillStyle = 'rgba(255,255,255,0.75)'; x.textAlign = 'right'; x.fillText(_t('Überspringen') + ' ▸', this.LW - 14, 18 * this.k); }
  },
  /* ---------- Zeichenhelfer ---------- */
  R(X, Y, w, h, c) { this.x.fillStyle = c; this.x.fillRect(X, Y, w, h); },
  px(s, X, Y, c, sc, al) { const w = pxTextW(s) * sc; if (al === 'c') X -= w / 2; if (al === 'r') X -= w; pxText(this.x, s, Math.round(X), Math.round(Y), c, sc); },
  px3(s, X, Y, c, sh, sc, al) { this.px(s, X + Math.max(1, sc * 0.5), Y + Math.max(1, sc * 0.5), sh, sc, al); this.px(s, X, Y, c, sc, al); },
  halftone(bg, dot, u) {
    const { x, LW, LH } = this; this.R(0, 0, LW, LH, bg); x.fillStyle = dot; const st = 14, o = (u * 20) % st;
    for (let yy = -st; yy < LH + st; yy += st) for (let xx = -st; xx < LW + st; xx += st) { x.beginPath(); x.arc(xx + o, yy + o * 0.5, 1.6, 0, 6.3); x.fill(); }
  },
  lines(cx, cy, c) { const x = this.x; x.strokeStyle = c; x.lineWidth = 2.5; const r0 = Math.min(this.LW, this.LH) * 0.3; for (let a = 0; a < 56; a++) { const t = a / 56 * 6.2832; x.beginPath(); x.moveTo(cx + Math.cos(t) * r0, cy + Math.sin(t) * r0); x.lineTo(cx + Math.cos(t) * 1500, cy + Math.sin(t) * 1500); x.stroke(); } },
  burst(X, Y, t, c, rot, sc) {
    const x = this.x; x.save(); x.translate(X, Y); x.rotate(rot); x.scale(sc, sc);
    x.beginPath(); for (let i = 0; i < 24; i++) { const a = i / 24 * 6.2832, r = i % 2 ? 60 : 82; x.lineTo(Math.cos(a) * r * 1.35, Math.sin(a) * r); } x.closePath();
    x.fillStyle = '#1a1a1e'; x.fill(); x.save(); x.scale(0.9, 0.9); x.fillStyle = c; x.fill(); x.restore();
    x.fillStyle = '#1a1a1e'; x.font = `700 30px ${TR_FONT_SIGN}`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(t, 0, 2); x.restore();
  },
  wrap(t, mw) { const w = t.split(' '), L = []; let l = ''; for (const s of w) { const n = l ? l + ' ' + s : s; if (this.x.measureText(n).width > mw && l) { L.push(l); l = s; } else l = n; } L.push(l); return L; },
  bubble(X, Y, Wd, t, tx, ty, fs) {
    const x = this.x; x.font = `800 ${fs}px ${TR_FONT_BODY}`; const L = this.wrap(t, Wd - 40), lh = fs * 1.25, Ht = L.length * lh + 34;
    x.lineWidth = 4; x.strokeStyle = '#1a1a1e'; x.fillStyle = '#fbfbf4';
    x.beginPath(); x.roundRect(X, Y, Wd, Ht, 18); x.fill(); x.stroke();
    const up = ty < Y; const by = up ? Y + 3 : Y + Ht - 3;
    x.beginPath(); x.moveTo(tx, ty); x.lineTo(X + 36, by); x.lineTo(X + 80, by); x.closePath(); x.fill(); x.stroke();
    this.R(X + 37, up ? Y + 1 : Y + Ht - 7, 42, 6, '#fbfbf4');
    x.fillStyle = '#1a1a1e'; x.textAlign = 'left'; x.textBaseline = 'top'; L.forEach((l, i) => x.fillText(l, X + 20, Y + 17 + i * lh));
    return Ht;
  },
  caption(t, Y) {
    const x = this.x, fs = Math.round(15 * this.k); x.font = `800 ${fs}px ${TR_FONT_BODY}`; const L = this.wrap(t, this.LW - 70), lh = fs * 1.3, h = L.length * lh + 16;
    let w = 0; L.forEach((l) => { w = Math.max(w, x.measureText(l).width); }); w += 30;
    x.lineWidth = 3; x.strokeStyle = '#1a1a1e'; x.fillStyle = '#f2c84a'; x.fillRect(this.LW / 2 - w / 2, Y - h / 2, w, h); x.strokeRect(this.LW / 2 - w / 2, Y - h / 2, w, h);
    x.fillStyle = '#1a1a1e'; x.textAlign = 'center'; x.textBaseline = 'middle'; L.forEach((l, i) => x.fillText(l, this.LW / 2, Y - h / 2 + 8 + lh / 2 + i * lh));
  },
  spr(id, X, Y, sc, pose, dir = 0) { const sh = getSheet(personLook(id)); this.x.drawImage(sh, (pose || 0) * SPR_W, dir * SPR_H, SPR_W, SPR_H, Math.round(X), Math.round(Y), SPR_W * sc, SPR_H * sc); },
  slam(u, d) { return u < d ? 1 + (1 - u / d) * (1 - u / d) * 1.4 : 1; },
  ease(u) { return u < 0 ? 0 : u > 1 ? 1 : 1 - (1 - u) * (1 - u) * (1 - u); },
  chip(t, cx, cy, rot, s, col, fs) {
    const x = this.x; x.save(); x.translate(cx, cy); x.rotate(rot); x.scale(s, s); x.font = `700 ${fs}px ${TR_FONT_SIGN}`;
    const wd = x.measureText(t).width + 30; x.lineWidth = 4; x.strokeStyle = '#1a1a1e'; x.fillStyle = col; x.beginPath(); x.roundRect(-wd / 2, -fs * 0.85, wd, fs * 1.7, 10); x.fill(); x.stroke();
    x.fillStyle = '#1a1a1e'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(t, 0, 2); x.restore();
  },
  /* ---------- Szenen ---------- */
  intro(u) {
    const { LW, LH, k } = this; this.R(0, 0, LW, LH, '#141a2e');
    const a = 'COLBA - VALENCIA', n = Math.min(a.length, Math.floor(u / 1.1 * a.length)), ps = Math.max(2, Math.round(7 * k));
    this.px(a.slice(0, n) + ((Math.floor(u * 4) % 2 && n < a.length) ? '-' : ''), LW / 2, LH * 0.4, '#2a9aa0', ps, 'c');
    if (u > 1.1) this.px(_t('2.-6. NOVEMBER 2026'), LW / 2, LH * 0.4 + ps * 10, '#f4f0e6', Math.max(2, Math.round(4 * k)), 'c');
    if (u > 1.6) this.px(_t('EINE PI PLANNING WOCHE'), LW / 2, LH * 0.4 + ps * 15, '#cfd6dd', Math.max(2, Math.round(3 * k)), 'c');
  },
  panel(id, q, bg, dot, bu, col, u) {
    const { LW, LH, k, port, x } = this; this.halftone(bg, dot, u); this.lines(LW * (port ? 0.5 : 0.3), LH * (port ? 0.3 : 0.5), 'rgba(0,0,0,0.12)');
    const sc = Math.max(3, Math.round((port ? 5 : 6) * k)), cw = SPR_W * sc + 24, ch = SPR_H * sc + 44;
    const sx = this.ease(u / 0.25);
    const cx0 = port ? LW / 2 - cw / 2 : LW * 0.26 - cw / 2, cy0 = port ? LH * 0.08 : LH * 0.2;
    const X = cx0 - (1 - sx) * (LW + cw), Y = cy0;
    this.R(X - 6, Y - 6, cw + 12, ch + 12, '#1a1a1e'); this.R(X, Y, cw, ch, '#fbfbf4');
    this.spr(id, X + 12, Y + 12, sc);
    this.px3(PEOPLE[id].name, X + cw / 2, Y + ch - 26, '#1a1a1e', '#f2c84a', Math.max(2, Math.round(3 * k)), 'c');
    if (u > 0.25) {
      const s = this.slam(u - 0.25, 0.18), fs = Math.round(20 * k);
      const bx = port ? 30 : LW * 0.48, bw = port ? LW - 60 : LW * 0.46, by = port ? Y + ch + 48 : LH * 0.2;
      x.save(); x.translate(bx + bw / 2, by + 40); x.scale(s, s); x.translate(-(bx + bw / 2), -(by + 40));
      this.bubble(bx, by, bw, q, port ? LW / 2 : X + cw - 10, port ? Y + ch + 8 : Y + ch * 0.5, fs);
      x.restore();
    }
    if (u > 0.7) { const s = this.slam(u - 0.7, 0.15); this.burst(port ? LW * 0.7 : LW * 0.78, port ? LH * 0.72 : LH * 0.72, bu, col, -0.2, s * 1.1 * k); }
    if (u > 1) this.caption(PEOPLE[id].tag, LH - 60 * k);
  },
  words(title, ws, bg, dot, u, col) {
    const { LW, LH, k, port } = this; this.halftone(bg, dot, u); this.lines(LW / 2, LH / 2, 'rgba(255,255,255,0.14)');
    const x = this.x, s0 = this.slam(u, 0.15); x.save(); x.translate(LW / 2, LH * 0.16); x.scale(s0, s0);
    this.px3(title, 0, -14 * k, '#fbfbf4', '#1a1a1e', Math.max(3, Math.round(7 * k)), 'c'); x.restore();
    ws.forEach((w, i) => { const t0 = 0.35 + i * 0.22; if (u < t0) return; const s = this.slam(u - t0, 0.14); const p = port ? w[1] : w[2]; this.chip(w[0], LW * p[0], LH * p[1], p[2], s, col || '#f2c84a', Math.round(26 * k)); });
  },
  plan(u) {
    const { LW, LH, k, port } = this; this.halftone('#141a2e', '#1e2740', u);
    this.px3(_t('PI-PLAN'), LW / 2, LH * 0.12, '#fbfbf4', '#2a9aa0', Math.max(3, Math.round(7 * k)), 'c');
    const T = [['INDURAIN', 0.96, '#2a9aa0'], ['MEESEEKS', 0.82, '#f0a23a'], ['ROCKET', 0.74, '#e2554a']];
    const bx = port ? 40 : LW * 0.3, bw = port ? LW - 80 : LW * 0.5, y0 = LH * (port ? 0.3 : 0.32), dy = (port ? 110 : 90) * k, ps = Math.max(2, Math.round(3.5 * k));
    T.forEach((t, i) => {
      const Y = y0 + i * dy, p = this.ease((u - 0.3 - i * 0.2) / 1.2) * t[1];
      this.px(t[0], bx, Y, '#f4f0e6', ps); this.R(bx, Y + ps * 7, bw, 26 * k, '#1a1a1e'); this.R(bx + 4, Y + ps * 7 + 4, (bw - 8) * p, 26 * k - 8, t[2]);
      if (p > 0) this.px(Math.floor(p * 100) + '%', bx + bw, Y, '#f4f0e6', ps, 'r');
    });
    if (u > 1.9) { const s = this.slam(u - 1.9, 0.15); this.burst(LW * 0.68, LH * 0.74, 'COMMIT!', '#f2c84a', 0.15, s * 1.1 * k); }
    this.caption(_t('Poker, CANopen, ROAM, Board, Konfidenz – jeden Tag eine Runde'), LH - 60 * k);
  },
  hunger(u) {
    const { LW, LH, k, port } = this; this.halftone('#2a3a6a', '#223058', u);
    const sc = Math.max(3, Math.round(6 * k)), X = LW / 2 - SPR_W * sc / 2, Y = LH * (port ? 0.36 : 0.3);
    this.spr('simon', X, Y, sc, POSE_I[Math.floor(u * 3) % 2 ? 'rub' : 'rubB']);
    if (u > 0.4) {
      const x = this.x, s = this.slam(u - 0.4, 0.15), ps = Math.max(3, Math.round(5 * k)), bw = pxTextW(_t('MMH, ESSEN')) * ps + 50, bh = ps * 5 + 44, bx = LW / 2 - bw / 2 + 30 * k, by = Y - bh - 30 * k;
      x.save(); x.translate(bx + bw / 2, by + bh / 2); x.scale(s, s); x.translate(-(bx + bw / 2), -(by + bh / 2));
      x.lineWidth = 4; x.strokeStyle = '#1a1a1e'; x.fillStyle = '#fbfbf4'; x.beginPath(); x.roundRect(bx, by, bw, bh, 16); x.fill(); x.stroke();
      x.beginPath(); x.moveTo(bx + 30, by + bh - 2); x.lineTo(bx + 10, by + bh + 26); x.lineTo(bx + 70, by + bh - 2); x.closePath(); x.fill(); x.stroke(); this.R(bx + 32, by + bh - 6, 36, 6, '#fbfbf4');
      this.px(_t('MMH, ESSEN'), bx + 25, by + 22, '#1a1a1e', ps); x.restore();
    }
    if (u > 0.9) this.caption(_t('Hungrig? Dann wird gestoppt, geseufzt und über den Bauch gestrichen.'), LH - 60 * k);
  },
  final(u) {
    const { LW, LH, k, port, x } = this;
    const g = x.createRadialGradient(LW / 2, LH * 1.1, 40, LW / 2, LH * 1.1, LH * 1.2); g.addColorStop(0, '#b8481c'); g.addColorStop(0.5, '#2a3a6a'); g.addColorStop(1, '#0e1116');
    x.fillStyle = g; x.fillRect(0, 0, LW, LH);
    const two = port, ts = Math.max(3, Math.floor((LW - 50) / (two ? pxTextW('PLANNING') : pxTextW('FIT PI PLANNING')) * (two ? 0.78 : 0.9)));
    const s = this.slam(u, 0.22), ty = LH * (port ? 0.17 : 0.12);
    x.save(); x.translate(LW / 2, ty); x.scale(s, s);
    if (two) { this.px3('FIT PI', 0, 0, '#f4f0e6', '#2a9aa0', ts, 'c'); this.px3('PLANNING', 0, ts * 7, '#f4f0e6', '#2a9aa0', ts, 'c'); }
    else this.px3('FIT PI PLANNING', 0, 0, '#f4f0e6', '#2a9aa0', ts, 'c');
    x.restore();
    const y2 = ty + ts * (two ? 14 : 7) + 10 * k;
    if (u > 0.5) { const s2 = this.slam(u - 0.5, 0.18); x.save(); x.translate(LW / 2, y2); x.scale(s2, s2); this.px3('THE GAME', 0, 0, '#f0a23a', '#1a1a1e', Math.max(3, Math.round(ts * 0.75)), 'c'); x.restore(); }
    const y3 = y2 + ts * 0.75 * 5 + 24 * k;
    if (u > 1.1) this.px(_t('2.-6. NOVEMBER 2026') + ' - COLBA - VALENCIA', LW / 2, y3, '#cfd6dd', Math.max(2, Math.round(2.5 * k)), 'c');
    const stats = [[_t('22 FIGUREN'), '#2a9aa0'], [_t('5 TAGE'), '#f0a23a'], [_t('20 MINISPIELE'), '#e2554a']];
    const y4 = y3 + 60 * k;
    stats.forEach((st, i) => { const t0 = 1.4 + i * 0.18; if (u < t0) return; const s3 = this.slam(u - t0, 0.14); const cx = port ? LW / 2 : LW / 2 + (i - 1) * LW * 0.26, cy = port ? y4 + i * 54 * k : y4; this.chip(st[0], cx, cy, (i - 1) * 0.05, s3, st[1], Math.round(22 * k)); });
    const cast = ['luigi', 'robin', 'isabell', 'danny', 'daniel', 'carlos'], cs = Math.max(2, Math.round(3 * k)), cw = SPR_W * cs + 10 * k, cy0 = LH - 150 * k;
    cast.forEach((id, i) => { const t0 = 2 + i * 0.12; if (u < t0) return; const b = Math.abs(Math.sin((u - t0) * 6)) * (u - t0 < 1.2 ? 24 : 7) * k; this.spr(id, LW / 2 - cast.length * cw / 2 + i * cw, cy0 - b, cs); });
    if (u > 3 && Math.floor(u * 2) % 2) this.px(Input.touch ? _t('TIPPEN ZUM STARTEN') : _t('TASTE DRÜCKEN'), LW / 2, LH - 40 * k, '#f2c84a', Math.max(2, Math.round(3 * k)), 'c');
  },
};
const TR_FONT_SIGN = "'Oswald', 'Arial Narrow', Impact, sans-serif", TR_FONT_BODY = "'Nunito', 'Helvetica Neue', Arial, sans-serif";
/* Im Spiel läuft nur die Schlussszene (Titelkarte); die ganze Sequenz gibt es als Video. */
Trailer.S = [[600, Trailer.final]];
