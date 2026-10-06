/* ============ Oberfläche ============ */
const ICON_CACHE = {};
function itemIconURL(icon) {
  if (ICON_CACHE[icon]) return ICON_CACHE[icon];
  const [c, x] = canvas(16, 16);
  const beerGlass = (col) => { R(x, 4, 3, 8, 11, col); R(x, 4, 3, 8, 2, '#fffaf0'); R(x, 12, 6, 2, 5, '#d9e2e6'); R(x, 5, 6, 1, 7, shade(col, 0.3)); R(x, 4, 14, 8, 1, shade(col, -0.3)); };
  switch (icon) {
    case 'beer': beerGlass('#e8b33a'); break;
    case 'bottle': R(x, 6, 1, 4, 4, '#4a7a3a'); R(x, 5, 5, 6, 10, '#4a7a3a'); R(x, 5, 8, 6, 4, '#f2e8c8'); break;
    case 'orange': E(x, 8, 8, 6, 6, '#ff8c1a'); E(x, 6, 6, 2, 2, '#ffb050'); R(x, 8, 1, 1, 2, '#3f8e4b'); R(x, 9, 1, 3, 1, '#3f8e4b'); break;
    case 'wine': R(x, 5, 2, 6, 6, '#e8f0f2'); R(x, 6, 4, 4, 3, '#8a1e3a'); R(x, 7, 8, 2, 5, '#e8f0f2'); R(x, 5, 13, 6, 1, '#e8f0f2'); break;
    case 'cava': R(x, 6, 1, 4, 9, '#e8f0f2'); R(x, 7, 3, 2, 6, '#f4e8a0'); R(x, 7, 10, 2, 4, '#e8f0f2'); R(x, 5, 14, 6, 1, '#e8f0f2'); P(x, 7, 4, '#ffffff'); break;
    case 'shot': R(x, 5, 6, 6, 8, '#e8f0f2'); R(x, 6, 8, 4, 5, '#8ac860'); R(x, 5, 14, 6, 1, '#a8b0b8'); break;
    case 'long': R(x, 4, 2, 8, 13, '#e8f0f2'); R(x, 5, 5, 6, 9, '#c84a7a'); R(x, 9, 0, 1, 6, '#3ab0e0'); P(x, 6, 7, '#ffffff'); break;
    case 'horchata': R(x, 4, 2, 8, 13, '#e8f0f2'); R(x, 5, 4, 6, 10, '#f4ead0'); R(x, 9, 0, 1, 6, '#c8352d'); break;
    case 'water': R(x, 5, 2, 6, 13, '#a8d8f0'); R(x, 6, 0, 4, 2, '#2f5fb8'); R(x, 5, 7, 6, 3, '#2f5fb8'); break;
    case 'coffee': R(x, 3, 6, 9, 7, '#f4f0e6'); R(x, 4, 6, 7, 2, '#5a3a1e'); R(x, 12, 7, 2, 3, '#f4f0e6'); R(x, 2, 13, 12, 1, '#c9c2b4'); R(x, 6, 2, 1, 3, '#c9c2b4'); R(x, 9, 1, 1, 3, '#c9c2b4'); break;
    case 'can': R(x, 4, 2, 8, 13, '#2f5fb8'); R(x, 4, 5, 8, 6, '#c8f03a'); R(x, 5, 2, 6, 1, '#8a9096'); break;
    case 'paella': E(x, 8, 9, 7, 5, '#2a2a2e'); E(x, 8, 8, 6, 4, '#e8b040'); P(x, 5, 8, '#c8352d'); P(x, 10, 7, '#3f8e4b'); P(x, 8, 9, '#f4f0e6'); R(x, 0, 8, 2, 1, '#2a2a2e'); R(x, 14, 8, 2, 1, '#2a2a2e'); break;
    case 'sandwich': R(x, 2, 5, 12, 3, '#e8c890'); R(x, 2, 8, 12, 1, '#a83a30'); R(x, 2, 9, 12, 1, '#3f8a3a'); R(x, 2, 10, 12, 3, '#e8c890'); break;
    case 'jamon': R(x, 3, 3, 3, 10, '#5a5048'); R(x, 5, 5, 9, 8, '#a83a30'); R(x, 6, 6, 4, 3, '#f4e8d8'); break;
    case 'tapas': E(x, 8, 9, 7, 4, '#f4f0e6'); E(x, 6, 8, 2, 1.5, '#c8352d'); E(x, 10, 8, 2, 1.5, '#3f8e4b'); E(x, 8, 10, 2, 1, '#e8c23a'); break;
    case 'wurst': R(x, 2, 7, 12, 4, '#b8582a'); R(x, 2, 7, 12, 1, '#d87a4a'); R(x, 4, 10, 8, 1, '#e8c23a'); break;
    case 'corn': R(x, 4, 3, 8, 11, '#f2d84a'); for (let k = 4; k < 14; k += 3) R(x, 4, k, 8, 1, '#e8c020'); R(x, 2, 12, 3, 3, '#3f8e4b'); R(x, 11, 12, 3, 3, '#3f8e4b'); break;
    case 'fries': R(x, 4, 7, 8, 8, '#c8352d'); for (let k = 5; k < 12; k += 2) R(x, k, 2 + (k % 3), 1, 6, '#f2c84a'); break;
    case 'tortilla': E(x, 8, 9, 7, 4, '#e8b040'); E(x, 8, 8, 6, 3, '#f4c860'); R(x, 8, 5, 1, 8, '#c89030'); break;
    case 'burger': E(x, 8, 5, 6, 3, '#d8902a'); R(x, 2, 7, 12, 2, '#3f8a3a'); R(x, 2, 9, 12, 2, '#6a3a1e'); R(x, 2, 8, 12, 1, '#e8c23a'); E(x, 8, 12, 6, 2, '#d8902a'); break;
    case 'pizza': E(x, 8, 8, 7, 7, '#d8a050'); E(x, 8, 8, 6, 6, '#c8402a'); for (const [a, b] of [[5, 6], [10, 7], [7, 10], [11, 11]]) E(x, a, b, 1.5, 1.5, '#f4f0e0'); break;
    case 'churros': for (let k = 0; k < 3; k++) R(x, 3 + k * 4, 2 + k, 2, 10, '#d8a050'); R(x, 2, 11, 12, 4, '#5a3420'); break;
    case 'fartons': for (let k = 0; k < 3; k++) R(x, 2 + k * 4, 5 + (k % 2), 3, 8, '#e8c890'); R(x, 2, 4, 11, 1, '#ffffff'); break;
    case 'bowl': E(x, 8, 10, 7, 4, '#f4f0e6'); E(x, 8, 8, 6, 3, '#8ac860'); P(x, 6, 7, '#c8352d'); P(x, 10, 8, '#e8c23a'); P(x, 8, 6, '#ff8c1a'); break;
    case 'croissant': for (let k = 0; k < 5; k++) E(x, 4 + k * 2, 9 - Math.abs(k - 2), 2, 2, '#d8a050'); break;
    case 'nuts': R(x, 4, 4, 8, 10, '#e8d8b0'); for (let k = 0; k < 5; k++) E(x, 5 + (k % 3) * 3, 6 + Math.floor(k / 3) * 3, 1.5, 1, '#8a4a2a'); break;
    case 'chips': R(x, 4, 2, 8, 12, '#e8c23a'); R(x, 5, 5, 6, 4, '#c8352d'); R(x, 4, 2, 8, 1, '#a8901a'); break;
    case 'fish': E(x, 7, 8, 5, 3, '#9ab0b8'); E(x, 7, 7, 4, 2, '#c8d8dc'); line(x, 12, 8, 14, 5, '#7a9098'); line(x, 12, 8, 14, 11, '#7a9098'); P(x, 4, 7, '#1a1a1a'); break;
    case 'pill': R(x, 3, 6, 10, 5, '#ffffff'); R(x, 8, 6, 5, 5, '#c8352d'); R(x, 3, 6, 10, 1, '#e8e8e8'); break;
    case 'cream': R(x, 5, 3, 6, 11, '#ffd23d'); R(x, 6, 1, 4, 3, '#2f5fb8'); R(x, 6, 7, 4, 3, '#ffffff'); break;
    case 'cig': R(x, 2, 4, 12, 9, '#f4f0e6'); R(x, 2, 4, 12, 3, '#c8352d'); R(x, 5, 1, 2, 4, '#e8c890'); R(x, 8, 1, 2, 4, '#f4f0e6'); break;
    case 'lighter': R(x, 5, 4, 6, 10, '#2f5fb8'); R(x, 5, 2, 6, 2, '#c9ccd2'); R(x, 7, 0, 2, 2, '#ffb030'); break;
    case 'badge': R(x, 3, 3, 10, 12, '#ffffff'); R(x, 3, 3, 10, 3, '#2a9aa0'); R(x, 5, 8, 6, 1, '#8a8e94'); R(x, 5, 10, 4, 1, '#8a8e94'); R(x, 7, 0, 2, 3, '#2a9aa0'); break;
    case 'postit': R(x, 3, 3, 10, 10, '#ffe066'); R(x, 4, 5, 7, 1, 'rgba(0,0,0,0.3)'); R(x, 4, 7, 5, 1, 'rgba(0,0,0,0.3)'); R(x, 10, 10, 3, 3, '#e6c94a'); break;
    case 'ticket': R(x, 2, 4, 12, 8, '#f4f0e6'); R(x, 2, 4, 3, 8, '#ff8c1a'); R(x, 6, 6, 6, 1, '#1a1a1a'); R(x, 6, 9, 4, 1, '#1a1a1a'); break;
    case 'fallera': E(x, 8, 4, 3, 3, '#f4c8a0'); R(x, 5, 1, 6, 2, '#1a1a1a'); R(x, 4, 7, 8, 7, '#e8c23a'); R(x, 4, 7, 8, 2, '#c8352d'); R(x, 3, 12, 10, 3, '#2f5fb8'); break;
    case 'fan': for (let k = 0; k < 7; k++) line(x, 8, 14, 2 + k * 2, 3 + Math.abs(k - 3), k % 2 ? '#c8352d' : '#e8c23a'); P(x, 8, 14, '#1a1a1a'); break;
    case 'tile': R(x, 2, 2, 12, 12, '#f4f0e6'); R(x, 4, 4, 8, 8, '#2f6fb8'); R(x, 6, 6, 4, 4, '#e8c23a'); break;
    case 'scarf': R(x, 2, 6, 12, 4, '#ff8c1a'); R(x, 2, 6, 3, 4, '#1a1a1e'); R(x, 8, 6, 3, 4, '#1a1a1e'); R(x, 11, 10, 3, 4, '#ff8c1a'); break;
    case 'trophy': R(x, 5, 2, 6, 7, '#e8c23a'); R(x, 3, 2, 2, 4, '#e8c23a'); R(x, 11, 2, 2, 4, '#e8c23a'); R(x, 7, 9, 2, 3, '#c8a020'); R(x, 4, 12, 8, 2, '#8a6a2a'); break;
    case 'wax': R(x, 3, 5, 10, 8, '#f4f0e6'); R(x, 3, 5, 10, 2, '#2a9aa0'); E(x, 8, 9, 2, 1, '#8ac8e8'); break;
    case 'paper': R(x, 2, 3, 12, 10, '#f4f0e6'); R(x, 3, 4, 10, 2, '#2a9aa0'); for (let k = 7; k < 12; k += 2) R(x, 3, k, 10, 1, '#8a8a8a'); break;
    case 'shirt': R(x, 4, 3, 8, 11, '#2f5fb8'); R(x, 1, 3, 3, 5, '#2f5fb8'); R(x, 12, 3, 3, 5, '#2f5fb8'); R(x, 7, 3, 2, 2, '#f4f0e6'); break;
    case 'hat': R(x, 1, 10, 14, 2, '#e8d8a0'); R(x, 4, 4, 8, 6, '#e8d8a0'); R(x, 4, 8, 8, 1, '#c23a2a'); break;
    case 'shoe': R(x, 2, 8, 12, 5, '#5a3a1e'); R(x, 2, 12, 12, 1, '#2a1a10'); R(x, 4, 6, 5, 3, '#5a3a1e'); break;
    case 'glasses': R(x, 1, 6, 6, 4, '#18181c'); R(x, 9, 6, 6, 4, '#18181c'); R(x, 7, 7, 2, 1, '#18181c'); P(x, 2, 7, '#5a6070'); break;
    case 'helmet': E(x, 8, 8, 6, 5, '#2a9aa0'); R(x, 2, 9, 12, 2, '#1a1a1e'); for (let k = 0; k < 3; k++) R(x, 5 + k * 3, 4, 1, 4, '#1e7a80'); break;
    default: R(x, 3, 3, 10, 10, '#8a9096');
  }
  ICON_CACHE[icon] = c.toDataURL();
  return ICON_CACHE[icon];
}

const UI = {
  els: {}, dlgOpen: false, _dlgResolve: null, _typing: null, _choices: null, _sel: 0, ovOpen: false,
  init() {
    for (const id of ['hud', 'hClock', 'hDay', 'hPlace', 'hEur', 'hProm', 'hPromWrap', 'hPlan', 'hPlanPct', 'hPlanWrap', 'boardText', 'boardGl', 'toasts', 'dialog', 'dlgPort', 'dlgName', 'dlgText', 'dlgChoices', 'overlay', 'fade', 'fadeText', 'fadeCv', 'touch', 'btnA', 'actLabel', 'btnPhone']) this.els[id] = document.getElementById(id);
    this.els.dialog.addEventListener('pointerdown', (e) => { if (e.target.closest('.choice')) return; e.preventDefault(); this.dlgAdvance(); });
    this.els.btnPhone.addEventListener('click', () => { if (!G.busy && !this.ovOpen) Phone.open(); });
    document.getElementById('btnCam').addEventListener('click', (e) => { e.stopPropagation(); Snap.shoot(); });
  },
  hud() {
    if (this.els.hud && !this.els.hud.hidden) View.hudPad = Math.round((this.els.hud.offsetHeight + 4) / View.scale);
    if (!G.S) return;
    const e = this.els, st = G.S.st;
    e.hClock.textContent = clockStr();
    e.hDay.textContent = _t`${DAY_NAMES[dayOf(G.S.time) % 7]} · Tag ${dayOf(G.S.time) + 1}`;
    e.hPlace.textContent = G.map ? G.map.name : '';
    e.hEur.textContent = fmtEur(G.S.money.eur);
    e.hProm.textContent = promStr();
    e.hPromWrap.hidden = st.prom < 0.1;
    const setBar = (id, v) => { const el = document.getElementById(id).querySelector('i'); el.style.setProperty('--v', Math.round(v) + '%'); el.style.setProperty('--c', v > 55 ? 'var(--ok)' : v > 25 ? 'var(--warn)' : 'var(--bad)'); };
    setBar('bEnergy', st.energy); setBar('bFood', st.food); setBar('bMood', st.mood);
    const tm = myTeam();
    const pct = Math.round(G.S.plan[tm] || 0);
    e.hPlan.style.width = pct + '%'; e.hPlan.style.setProperty('--team', TEAMS[tm].col); e.hPlanPct.textContent = pct + ' %';
    e.hPlanWrap.hidden = !Story.stageAt('free');
    e.boardText.textContent = G.live && G.live.hudText ? G.live.hudText() : Story.objective();
    e.boardGl.textContent = Story.objectiveTag();
  },
  toast(html, type = '') {
    const d = document.createElement('div');
    d.className = 'toast ' + type;
    d.innerHTML = _t`<span>${html}</span><b class="x" aria-label="Schliessen">×</b>`;
    this.els.toasts.appendChild(d);
    while (this.els.toasts.children.length > 4) this.els.toasts.firstChild.remove();
    const close = () => { if (d.classList.contains('out')) return; d.classList.add('out'); setTimeout(() => d.remove(), 350); };
    d.addEventListener('pointerdown', (e) => { e.stopPropagation(); close(); });
    setTimeout(close, type === 'ach' ? 9000 : 8000);
    return d;
  },
  speaker(sp) {
    if (!sp) return null;
    const me = G.S && G.S.pid;
    if (sp === 'me' || (me && (sp === me || (PEOPLE[me] && sp === PEOPLE[me].name)))) return { name: G.S.name, look: G.S.look };
    if (typeof sp === 'string') {
      const pid = PEOPLE[sp] ? sp : Object.keys(PEOPLE).find((k) => PEOPLE[k].name === sp);
      if (pid) return { name: PEOPLE[pid].name, look: personLook(pid), bg: PEOPLE[pid].bg };
      const n = G.npcs.find((a) => a.name && a.name.startsWith(sp));
      if (n) return { name: sp, look: n.look };
      let h = 7; for (const ch of sp) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
      return { name: sp, look: npcLook(h) };
    }
    return sp;
  },
  showDlg(sp) {
    const s = this.speaker(sp);
    const d = this.els.dialog;
    d.hidden = false;
    this.dlgOpen = true;
    this.els.btnA.classList.add('idle');
    if (s && s.look) {
      d.classList.remove('noport');
      const pc = this.els.dlgPort.getContext('2d');
      pc.imageSmoothingEnabled = false;
      pc.clearRect(0, 0, PW, PW);
      pc.drawImage(portraitCanvas(s.look, s.bg || '#2a3a52'), 0, 0);
    } else d.classList.add('noport');
    this.els.dlgName.textContent = s ? s.name : '';
    this.els.dlgName.hidden = !s;
  },
  type(text) {
    const el = this.els.dlgText;
    return new Promise((res) => {
      el.innerHTML = '';
      const full = text;
      let i = 0;
      const plain = full.replace(/<[^>]+>/g, '');
      if (plain.length > 0 && Snd.on) Snd.sfx('talk');
      const step = () => {
        i += 2;
        if (i >= plain.length) { el.innerHTML = full; this._typing = null; res(); return; }
        el.textContent = plain.slice(0, i);
        if (i % 12 === 0) Snd.sfx('talk');
        this._typing = { t: setTimeout(step, 20), finish: () => { clearTimeout(this._typing.t); el.innerHTML = full; this._typing = null; res(); } };
      };
      step();
    });
  },
  async say(sp, text) {
    this.showDlg(sp);
    this.els.dlgChoices.innerHTML = '';
    await this.type(text);
    const more = document.createElement('span'); more.className = 'dlg-more'; more.textContent = '▼'; this.els.dlgText.appendChild(more);
    await new Promise((res) => { this._dlgResolve = res; });
    this.hideDlg();
  },
  dlgAdvance() {
    if (!this.dlgOpen) return;
    if (this._typing) { this._typing.finish(); return; }
    if (this._choices) return;
    if (this._dlgResolve) { const r = this._dlgResolve; this._dlgResolve = null; Snd.sfx('blip'); r(); }
  },
  hideDlg() { this.els.dialog.hidden = true; this.dlgOpen = false; this.els.btnA.classList.remove('idle'); },
  async ask(sp, text, opts) {
    this.showDlg(sp);
    this.els.dlgChoices.innerHTML = '';
    await this.type(text);
    return new Promise((res) => {
      const box = this.els.dlgChoices;
      const items = opts.map((o) => (typeof o === 'string' ? { t: o } : o));
      this._choices = items;
      this._sel = items.findIndex((o) => !o.disabled);
      items.forEach((o, i) => {
        const b = document.createElement('button');
        b.className = 'choice';
        b.innerHTML = `<span>${o.t}</span>${o.r ? `<small>${o.r}</small>` : ''}`;
        if (o.disabled) b.disabled = true;
        b.addEventListener('click', (e) => { e.stopPropagation(); pickC(i); });
        box.appendChild(b);
      });
      const pickC = (i) => { if (items[i].disabled) return; Snd.sfx('blip'); this._choices = null; this._pick = null; this.hideDlg(); this.els.dlgChoices.innerHTML = ''; res(i); };
      this._pick = pickC;
      this.markSel();
    });
  },
  markSel() { [...this.els.dlgChoices.children].forEach((b, i) => b.classList.toggle('sel', i === this._sel)); },
  dlgKey(code) {
    if (!this.dlgOpen) return false;
    if (this._choices) {
      const n = this._choices.length;
      if (code === 'ArrowDown' || code === 'KeyS') { do { this._sel = (this._sel + 1) % n; } while (this._choices[this._sel].disabled); this.markSel(); }
      else if (code === 'ArrowUp' || code === 'KeyW') { do { this._sel = (this._sel - 1 + n) % n; } while (this._choices[this._sel].disabled); this.markSel(); }
      else if (code === 'Enter' || code === 'Space' || code === 'KeyE') this._pick(this._sel);
      else if (/^Digit[1-9]$/.test(code)) { const i = +code.slice(5) - 1; if (i < n) this._pick(i); }
      else if (code === 'Escape') { const i = this._choices.length - 1; this._pick(i); }
      return true;
    }
    if (['Enter', 'Space', 'KeyE', 'Escape'].includes(code)) this.dlgAdvance();
    return true;
  },
  /* Ladeanzeige, während eine Karte zum ersten Mal gebaut wird */
  loading(on, text) { const el = document.getElementById('spinner'); if (!el) return; el.hidden = !on; const t = el.querySelector('#spinnerText'); if (t) t.textContent = text || _t('Laden …'); },
  fadeOut(text = '') { this.els.fade.classList.remove('scene'); this.els.fadeText.textContent = text; this.els.fade.classList.add('on'); return sleep(380); },
  async fadeIn() { this.els.fade.classList.remove('on'); await sleep(300); this.els.fade.classList.remove('scene'); },
  async card(text, ms = 1600) { await this.fadeOut(text); await sleep(ms); await this.fadeIn(); },
  missed(title, text, note, onRetry) {
    const html = _t`<div class="panel"><div class="panel-head"><h2>${title}</h2></div><div class="panel-body"><p class="note">${text}</p><p class="note">${note}</p></div><div class="panel-foot"><button class="btn red" id="msEnd">Spiel beenden</button><button class="btn primary" id="msRetry">Zwei Stunden vorher nochmals starten</button></div></div>`;
    const o = this.overlay(html, null);
    o.querySelector('#msRetry').addEventListener('click', () => { this.closeOverlay && this.closeOverlay(); o.hidden = true; o.innerHTML = ''; onRetry(); });
    o.querySelector('#msEnd').addEventListener('click', () => { if (confirm(_t('Spielstand wirklich löschen?'))) { clearSave(); try { localStorage.removeItem(SAVE_KEY + '-img'); localStorage.removeItem(SAVE_KEY + '-cp'); } catch (e) {} location.reload(); } });
    G.mode = 'over';
  },
  gameOver(title, text, note) {
    const html = _t`<div class="panel"><div class="panel-head"><h2>${title}</h2></div><div class="panel-body"><p class="note">${text}</p><p class="note">${note || _t('Der Spielstand wird gelöscht – versuch es nochmal.')}</p></div><div class="panel-foot"><span>Game Over</span><button class="btn primary" id="goRestart">Von vorne anfangen</button></div></div>`;
    const o = this.overlay(html, null);
    o.querySelector('#goRestart').addEventListener('click', () => { clearSave(); try { localStorage.removeItem(SAVE_KEY + '-img'); } catch (e) {} location.reload(); });
    G.mode = 'over';
    Track.event('gameover', title, true);
  },
  overlay(html, onClose) {
    const o = this.els.overlay;
    o.innerHTML = html;
    o.hidden = false;
    document.body.classList.add('ov');
    this.ovOpen = true;
    this._ovClose = onClose;
    G.busy++;
    o.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', () => this.closeOverlay()));
    return o;
  },
  closeOverlay() {
    if (!this.ovOpen) return;
    const o = this.els.overlay;
    o.hidden = true; o.innerHTML = '';
    document.body.classList.remove('ov');
    this.ovOpen = false;
    G.busy = Math.max(0, G.busy - 1);
    const f = this._ovClose; this._ovClose = null;
    if (f) f();
    this.hud();
  },
  updatePrompt() {
    const l = this.els.actLabel;
    if (G.busy || !G.map) { l.hidden = true; return; }
    const it = findInteraction();
    if (it) { l.hidden = false; const lbl = it.label || ''; if (l._t !== lbl) { l.innerHTML = `<kbd>${Input.touch ? 'A' : 'E'}</kbd>${lbl}`; l._t = lbl; } }
    else l.hidden = true;
  },
  shop(def) {
    return new Promise((resolve) => {
      const render = () => {
        let body = '';
        for (const sec of def.sections) {
          body += `<div class="shop-sec">${sec.t}</div>`;
          for (const it of sec.items) {
            const item = ITEMS[it.id] || {};
            const price = it.price;
            const ok = canPay(price) && (!it.cond || it.cond());
            const consumable = ['drink', 'food', 'med'].includes(item.t) && !it.special && def.mode === 'eat' && item.inv;
            const have = G.S.inv[it.id] ? `<span class="have">🎒 ${G.S.inv[it.id]}</span>` : '';
            const btns = consumable
              ? `<button class="btn buy" data-i="${it.key}" ${ok ? '' : 'disabled'} title="Jetzt ${item.t === 'food' ? 'essen' : 'trinken'}">${fmtEur(price)}</button><button class="btn take" data-i="${it.key}" ${ok ? '' : 'disabled'} title="Mitnehmen (in die Tasche)">🎒</button>`
              : `<button class="btn buy" data-i="${it.key}" ${ok ? '' : 'disabled'}>${price ? fmtEur(price) : 'gratis'}</button>`;
            body += `<div class="shop-item ${ok ? '' : 'off'}"><img alt="" src="${itemIconURL(it.icon || item.icon)}"><span><span class="nm">${it.n || item.n}${have}</span><br><span class="ds">${it.d || itemDesc(it.id)}</span></span><span class="pr">${btns}</span></div>`;
          }
        }
        const foot = def.foot || (def.mode === 'eat' ? _t('Preis = jetzt konsumieren · 🎒 = mitnehmen') : def.mode === 'take' ? _t('Gekauftes landet in der Tasche (Handy)') : _t('Tippen zum Kaufen'));
        return _t`<div class="panel"><div class="panel-head"><h2>${def.title}</h2><span class="sub">${fmtEur(G.S.money.eur)}</span><button class="x-btn" data-close aria-label="Schliessen">×</button></div><div class="panel-body">${def.intro ? `<p class="note">${def.intro}</p>` : ''}${body}</div><div class="panel-foot"><span>${foot}</span><button class="btn" data-close>Fertig</button></div></div>`;
      };
      const flat = {};
      let k = 0;
      for (const sec of def.sections) for (const it of sec.items) { it.key = k; flat[k++] = it; }
      const o = this.overlay(render(), resolve);
      const wire = () => {
        o.querySelectorAll(_t('.shop-item .buy, .shop-item .take')).forEach((b) => b.addEventListener('click', async () => {
          const it = flat[b.dataset.i];
          const done = await Story.buy(def, it, { take: b.classList.contains('take') });
          if (done === 'close') { this.closeOverlay(); return; }
          const scroll = o.querySelector('.panel-body').scrollTop;
          o.innerHTML = render(); o.querySelector('.panel-body').scrollTop = scroll;
          o.querySelectorAll('[data-close]').forEach((x) => x.addEventListener('click', () => this.closeOverlay()));
          wire();
          this.hud();
        }));
      };
      wire();
    });
  },
  /* Ereignis-Ankündigung mit Kinobalken */
  async announce(kick, title, sub, ms = 2200) {
    const c = document.getElementById('cine');
    c.querySelector('.ckick').textContent = kick; c.querySelector('.ctitle').textContent = title; c.querySelector('.csub').textContent = sub || '';
    c.classList.add('on', 'flash');
    Snd.sfx('brass');
    await sleep(ms);
    c.classList.remove('on', 'flash');
    await sleep(450);
  },
};
function itemDesc(id) {
  const it = ITEMS[id]; if (!it) return '';
  const p = [];
  if (it.alc) p.push(_t('Alkohol'));
  if (it.food) p.push(it.food >= 50 ? 'macht richtig satt' : it.food >= 25 ? 'macht satt' : _t('Snack'));
  if (it.en > 10) p.push('weckt auf');
  if (it.nau < -20) p.push(_t('beruhigt den Magen'));
  if (it.hang) p.push(_t('gegen Kater'));
  if (it.water) p.push(_t('Wasser'));
  if (it.sun) p.push(_t('schützt vor der Sonne'));
  if (it.t === 'souv') p.push(_t('Andenken'));
  if (it.t === 'read') p.push(_t('zum Lesen'));
  return p.join(' · ');
}

/* ============ Handy: Planning-Board ============ */
const Phone = {
  tab: 'sprint',
  open(tab) {
    if (tab) this.tab = tab;
    const o = UI.overlay(_t`<div class="panel" style="height:min(740px,100%)"><div class="panel-head"><h2>${G.S.name}s Handy</h2><span class="sub">${clockStr()} · ${dateStr()}</span><button class="x-btn" data-close aria-label="Schliessen">×</button></div>
      <div class="tabs" role="tablist">${[['sprint', _t('Sprint')], ['team', _t('Team')], ['karte', _t('Karte')], ['inv', _t('Tasche')], ['fotos', _t('Fotos')], ['status', _t('Status')], ['opt', _t('Optionen')]].map(([k, n]) => `<button class="tab ${k === this.tab ? 'on' : ''}" data-tab="${k}" role="tab">${n}</button>`).join('')}</div>
      <div class="panel-body" id="phoneBody"></div></div>`);
    o.querySelectorAll('.tab').forEach((b) => b.addEventListener('click', () => { this.tab = b.dataset.tab; o.querySelectorAll('.tab').forEach((x) => x.classList.toggle('on', x === b)); this.render(); }));
    this.render();
  },
  render() {
    const b = document.getElementById('phoneBody');
    if (!b) return;
    b.innerHTML = '';
    this[this.tab](b);
  },
  sprint(b) {
    const steps = Story.steps();
    const achN = Object.keys(G.S.ach).length, achT = Object.keys(ACH).length;
    const tm = myTeam();
    const planRows = Object.entries(TEAMS).map(([k, t]) => `<div class="teamhead"><i style="background:${t.col}"></i><span>${t.n}${k === tm ? _t(' (du)') : ''}</span><div class="plan-bar"><i style="width:${Math.round(G.S.plan[k])}%;background:${t.col}"></i></div><b>${Math.round(G.S.plan[k])} %</b></div>`).join('');
    b.innerHTML = _t`<div class="row" style="border-color:var(--sun)"><div><div class="d">Jetzt</div><div class="t">${Story.objective()}</div></div></div>
      <div class="shop-sec">PI-Plan · Stand</div>${planRows}
      <div class="shop-sec">Wochenplan</div><div class="list">${steps.map((s) => `<div class="row postit ${s.done ? 'done' : ''}"><div><div class="t">${s.t}</div>${s.d ? `<div class="d">${s.d}</div>` : ''}</div><span class="${s.done ? 'tick' : 'open'}">${s.done ? '✓' : '·'}</span></div>`).join('')}</div>
      <div class="shop-sec">Erlebnisse ${achN}/${achT}</div><div class="list">${Object.entries(ACH).map(([k, [t, d]]) => `<div class="row ${G.S.ach[k] ? 'done' : ''}"><div><div class="t">${G.S.ach[k] ? t : '???'}</div><div class="d">${d}</div></div><span class="${G.S.ach[k] ? 'tick' : 'open'}">${G.S.ach[k] ? '✓' : '·'}</span></div>`).join('')}</div>`;
  },
  team(b) {
    let html = '';
    const card = (id) => { const p = PEOPLE[id]; const w = Story.whereIs(id); return `<div class="teamcard"><canvas width="96" height="96" data-p="${id}"></canvas><div><div class="n">${p.name}${id === G.S.pid ? _t(' (du)') : ''}</div><div class="r">${p.role}</div></div><div class="w">${id === G.S.pid ? 'hier' : w.t}</div></div>`; };
    const inTeam = new Set();
    for (const [k, t] of Object.entries(TEAMS)) { const ids = [t.po].concat(t.members); ids.forEach((m) => inTeam.add(m)); html += _t`<div class="teamhead"><i style="background:${t.col}"></i><span>${t.n} · PO ${PEOPLE[t.po].name}</span></div><div class="list">${ids.map(card).join('')}</div>`; }
    html += _t`<div class="shop-sec">Weitere</div><div class="list">${Object.keys(PEOPLE).filter((id) => !inTeam.has(id)).map(card).join('')}</div>`;
    b.innerHTML = html;
    b.querySelectorAll('canvas[data-p]').forEach((c) => c.getContext('2d').drawImage(portraitCanvas(personLook(c.dataset.p), PEOPLE[c.dataset.p].bg || '#2a3a52'), 0, 0));
  },
  karte(b) {
    const showCity = G.map.indoor && BUILT.city && G.map.id !== 'airport' && G.map.id !== 'danny_house';
    const m = showCity ? BUILT.city : G.map;
    const sc = m.w > 60 ? 7 : 9;
    const [c, x] = canvas(m.w * sc, m.h * sc);
    const col = { [T.WATER]: '#3a9ac8', [T.GRASS]: '#7aa84c', [T.PARK]: '#6f9c44', [T.PALMS]: '#4a7a3a', [T.ASPH]: '#5c5f66', [T.TARMAC]: '#4a4d54', [T.ZEBRA]: '#8a8d92', [T.PLAZA]: '#dccfb8', [T.COBBLE]: '#a49a8a', [T.PAVE]: '#d8cfbf', [T.CURB]: '#b8b2a6', [T.HEDGE]: '#2f5a2a', [T.GRAVEL]: '#c2b59a', [T.WALL]: '#3a3430', [T.WALLF]: '#5a5048', [T.SAND]: '#efe0b8', [T.WETSAND]: '#d4c094', [T.BIKE]: '#b35a4a', [T.DECK]: '#a8865a', [T.TRACK]: '#3a3c42', [T.FLOWER]: '#8a5a3a' };
    for (let y = 0; y < m.h; y++) for (let xx = 0; xx < m.w; xx++) { const t = m.at(xx, y); R(x, xx * sc, y * sc, sc, sc, col[t] || '#c8c0b0'); }
    for (const o of m.objs) { if (!o.bld && o.w < 2) continue; R(x, o.x * sc, o.y * sc, o.w * sc, o.h * sc, o.bld ? shade(o.bld.roof, -0.1) : '#6a6058'); if (o.bld) R(x, o.x * sc, (o.y + o.h) * sc - 2, o.w * sc, 2, shade(o.bld.wall, -0.1)); }
    const pois = Story.mapPois(m.id);
    x.font = 'bold 15px Oswald, "Arial Narrow", sans-serif'; x.lineJoin = 'round'; x.lineWidth = 4; x.strokeStyle = '#1f2430';
    /* Beschriftungen staffeln, damit sie sich an dichten Stellen nicht überdecken */
    const boxes = pois.map((p) => ({ x: p.x * sc + sc / 2 - 7, y: p.y * sc + sc / 2 - 7, w: 14, h: 14 }));
    pois.forEach((p) => { const px = p.x * sc + sc / 2, py = p.y * sc + sc / 2; E(x, px, py, 6, 6, '#1f2430'); E(x, px, py, 5, 5, p.c); const tw = x.measureText(p.n).width + 4; let lx = px + 9, ly = py + 5;
      for (const dy of [0, -17, 17, -34, 34]) { const cand = { x: lx, y: py + 5 + dy - 13, w: tw, h: 17 }; if (!boxes.some((b2) => cand.x < b2.x + b2.w && cand.x + cand.w > b2.x && cand.y < b2.y + b2.h && cand.y + cand.h > b2.y)) { ly = py + 5 + dy; boxes.push(cand); break; } }
      if (ly !== py + 5) { x.beginPath(); x.moveTo(px, py); x.lineTo(lx, ly - 5); x.stroke(); }
      x.strokeText(p.n, lx, ly); x.fillStyle = '#ffffff'; x.fillText(p.n, lx, ly); });
    if (!showCity) { const px = G.player.x / TS * sc, py = G.player.y / TS * sc; E(x, px, py, 6, 6, '#ff8c1a'); E(x, px, py, 3, 3, '#ffffff'); }
    for (const id of Object.keys(PEOPLE)) { if (id === G.S.pid) continue; const w = Story.whereIs(id); if (w.x != null && w.map === m.id) { E(x, w.x * sc + sc / 2 + (hash(id.length, 1) * 8 - 4), w.y * sc + sc / 2, 3, 3, PEOPLE[id].bg || '#444'); } }
    const wrap = document.createElement('div'); wrap.className = 'mapwrap'; wrap.appendChild(c);
    /* Ausschnitt dorthin rollen, wo man ist (in der Stadt), sonst zum Hotel */
    const fx = showCity ? (Story.LOC && Story.LOC.hotel ? Story.LOC.hotel[2] : 13) * sc : G.player.x / TS * sc, fy = showCity ? (Story.LOC && Story.LOC.hotel ? Story.LOC.hotel[3] : 30) * sc : G.player.y / TS * sc;
    requestAnimationFrame(() => { wrap.scrollLeft = Math.max(0, fx - wrap.clientWidth / 2); wrap.scrollTop = Math.max(0, fy - wrap.clientHeight / 2); });
    b.innerHTML = _t`<div class="legend"><span><i style="background:#ff8c1a"></i>Du</span><span><i style="background:#2a9aa0"></i>Colba</span><span><i style="background:#1f7fb8"></i>Sehenswürdigkeit</span><span><i style="background:#3f9a4b"></i>Läden & Freizeit</span><span><i style="background:#e85af0"></i>Nachtleben</span></div>`;
    b.appendChild(wrap);
    const note = document.createElement('p'); note.className = 'note'; note.textContent = showCity ? _t('Karte von Valencia. Kleine Punkte: wo die Kollegen gerade sind.') : _t`Karte: ${m.name}`; b.appendChild(note);
  },
  inv(b) {
    const keys = Object.keys(G.S.inv);
    if (!keys.length) { b.innerHTML = _t('<p class="note">Deine Tasche ist leer. Im Mercado, am Kiosk oder im Supermarkt gibt es Proviant.</p>'); return; }
    b.innerHTML = _t`<div class="shop-sec">Tasche · ${fmtEur(G.S.money.eur)}</div>`;
    for (const id of keys) {
      const it = ITEMS[id]; if (!it) continue;
      const n = G.S.inv[id];
      const usable = ['drink', 'food', 'med'].includes(it.t);
      const uses = it.uses ? _t` · ${G.S.uses[id] || it.uses} übrig` : '';
      const d = document.createElement('div'); d.className = 'shop-item';
      d.innerHTML = `<img alt="" src="${itemIconURL(it.icon)}"><span><span class="nm">${it.n} ${n > 1 ? '× ' + n : ''}</span><br><span class="ds">${itemDesc(id)}${uses}</span></span><span class="pr">${usable ? `<button class="btn use">${it.t === 'food' ? _t('Essen') : it.t === 'med' ? _t('Nehmen') : _t('Trinken')}</button>` : it.t === 'read' ? _t('<button class="btn use">Lesen</button>') : ''}</span>`;
      const u = d.querySelector('.use');
      if (u) u.addEventListener('click', async () => { if (it.t === 'read') { UI.closeOverlay(); G.busy++; await Story.readItem(id); G.busy--; return; } takeInv(id); consume(id); UI.toast(`${it.t === 'food' ? _t('Gegessen') : _t('Getrunken')}: ${it.n}`); this.render(); UI.hud(); });
      b.appendChild(d);
    }
  },
  fotos(b) {
    const snaps = Snap.list();
    let html = _t`<div class="shop-sec">Schnappschüsse (${snaps.length})</div>`;
    html += snaps.length ? `<div class="snaps">${snaps.map((s, i) => `<button class="snap" data-i="${i}"><img alt="Schnappschuss" src="${s.img}"></button>`).join('')}</div>` : _t('<p class="note">Noch keine Schnappschüsse. Kamera-Knopf oben rechts (oder P) – geht auch während Gesprächen und Minispielen.</p>');
    html += _t`<div class="shop-sec">Sehenswürdigkeiten ${Object.keys(G.S.photos).length}/${Object.keys(SIGHTS).length}</div><div class="photos">`;
    for (const [id, s] of Object.entries(SIGHTS)) {
      if (G.S.photos[id]) html += `<div class="photo" style="--r:${(hash(id.length, 3) * 4 - 2).toFixed(1)}deg"><canvas data-s="${id}" width="96" height="64"></canvas><b>${s.n}</b><p>${s.f}</p></div>`;
      else html += _t`<div class="photo missing">${s.n}<br><small>noch kein Foto</small></div>`;
    }
    b.innerHTML = html + '</div>';
    b.querySelectorAll('canvas[data-s]').forEach((c) => drawSightCard(c.getContext('2d'), c.dataset.s));
    b.querySelectorAll('.snap').forEach((s) => s.addEventListener('click', () => Snap.view(+s.dataset.i)));
  },
  status(b) {
    const st = G.S.st;
    const f = (v) => Math.round(v);
    b.innerHTML = _t`<div class="statgrid">
      <div class="stat"><small>Energie</small><b>${f(st.energy)} %</b></div><div class="stat"><small>Satt</small><b>${f(st.food)} %</b></div>
      <div class="stat"><small>Laune</small><b>${f(st.mood)} %</b></div><div class="stat"><small>Pegel</small><b>${promStr()}</b></div>
      <div class="stat"><small>Übelkeit</small><b>${f(st.nau)}</b></div><div class="stat"><small>Sonne</small><b>${f(st.sun)} %${st.sun > 60 ? ' 🔥' : ''}</b></div>
      <div class="stat"><small>Kater</small><b>${st.hang > 0 ? f(st.hang) : '–'}</b></div><div class="stat"><small>Wach seit</small><b>${Math.floor(minutesAwake() / 60)} h</b></div>
      <div class="stat"><small>Biere</small><b>${G.S.beers}</b></div><div class="stat"><small>Kaffees</small><b>${G.S.coffees}</b></div>
      <div class="stat"><small>Rekord Kart</small><b>${G.S.rec.kart ? G.S.rec.kart.toFixed(1) + _t(' s') : '–'}</b></div><div class="stat"><small>Rekord Disco</small><b>${G.S.rec.dance ? G.S.rec.dance + ' %' : '–'}</b></div>
      </div>
      <div class="shop-sec">Spieler</div><div class="row"><div><div class="t">${G.S.name}</div><div class="d">${PEOPLE[G.S.pid].role} · ${TEAMS[myTeam()].n}</div></div><button class="btn" id="stEdit">Kleider</button></div>
      <div class="shop-sec">Abhängigkeiten</div><div class="list">${Object.entries(DEPS).filter(([k, d]) => d.from === myTeam() || d.to === myTeam()).map(([k, d]) => `<div class="row ${G.S.deps[k] ? 'done' : ''}"><div><div class="t">${d.t}</div><div class="d">${TEAMS[d.from].n} → ${TEAMS[d.to].n}</div></div><span class="${G.S.deps[k] ? 'tick' : 'open'}">${G.S.deps[k] ? '✓' : '·'}</span></div>`).join('')}</div>`;
    b.querySelector('#stEdit').addEventListener('click', async () => { UI.closeOverlay(); G.busy++; await Editor.open({ mode: 'clothes' }); G.busy--; });
  },
  opt(b) {
    b.innerHTML = _t`<div class="opt-row"><span>Soundeffekte</span><button class="btn" id="oSfx">${Snd.on ? _t('An') : _t('Aus')}</button></div>
      <div class="opt-row"><span>Musik</span><button class="btn" id="oMus">${Snd.musicOn ? _t('An') : _t('Aus')}</button></div>
      <div class="opt-row"><span>Spielstand</span><button class="btn" id="oSave">Jetzt speichern</button></div>
      <div class="opt-row"><span>Neues Spiel</span><button class="btn red" id="oReset">Spielstand löschen</button></div>
      <p class="note">Version ${APP_VERSION} · ${APP_VERSION_DATE} · Audio: ${Snd.state()}</p>
      <div class="shop-sec">Was ist neu?</div><div class="changelog" style="padding:0">${changelogHtml()}</div>`;
    b.querySelector('#oSfx').addEventListener('click', (e) => { Snd.on = !Snd.on; e.target.textContent = Snd.on ? _t('An') : _t('Aus'); });
    b.querySelector('#oMus').addEventListener('click', (e) => { Snd.musicOn = !Snd.musicOn; e.target.textContent = Snd.musicOn ? _t('An') : _t('Aus'); });
    b.querySelector('#oSave').addEventListener('click', () => saveGame(false));
    if (TRACK_DB) b.querySelector('#oSave').closest('.opt-row').insertAdjacentHTML('afterend', `<div class="opt-row"><span>${_t('Fortschritt teilen')}</span><button class="btn" id="oTrack">${Track.optOut() ? _t('Aus') : _t('An')}</button></div>`);
    const tb = b.querySelector('#oTrack');
    if (tb) tb.addEventListener('click', () => { const off = !Track.optOut(); Track.setOptOut(off); tb.textContent = off ? _t('Aus') : _t('An'); });
    b.querySelector('#oSave').closest('.opt-row').insertAdjacentHTML('beforebegin', `<div class="opt-row"><span>${_t('Sprache')}</span><span class="langs">${Object.entries(LANGS).map(([k, n]) => `<button class="btn lang${k === LANG ? ' on' : ''}" data-lang="${k}">${n}</button>`).join('')}</span></div>`);
    b.querySelectorAll('.lang').forEach((el) => el.addEventListener('click', () => { saveGame(true); setLang(el.dataset.lang); }));
    b.querySelector('#oReset').addEventListener('click', () => { if (confirm(_t('Spielstand wirklich löschen?'))) { clearSave(); try { localStorage.removeItem(SAVE_KEY + '-img'); } catch (e) {} location.reload(); } });
  },
};
/* Sehenswürdigkeit als Postkarte zeichnen */
function drawSightCard(x, id) {
  R(x, 0, 0, 96, 64, '#8ec3e6'); R(x, 0, 44, 96, 20, '#d8cfbf');
  for (let i = 0; i < 20; i++) P(x, Math.floor(hash(i, 5) * 96), Math.floor(hash(i, 6) * 30), '#ffffff');
  const col = { ciudad: '#e8ecf0', micalet: '#d8c8a8', lonja: '#c8b898', serranos: '#c8b898', mercado: '#b8603a', turia: '#7aa84c', malvarrosa: '#efe0b8', marina: '#3a9ac8', virgen: '#dccfb8', ayuntamiento: '#dccfb8', museum: '#f4f0e8', estacion: '#e8c89a', colon: '#d8c8b0', colba: '#c8ccd0' }[id] || '#c8c0b0';
  if (id === 'ciudad') { for (let k = 0; k < 60; k++) { const t = (k - 30) / 30; R(x, 18 + k, 44 - Math.sqrt(1 - t * t) * 24, 1, Math.sqrt(1 - t * t) * 24, k % 6 ? col : '#9ab0b8'); } }
  else if (id === 'micalet') { R(x, 40, 8, 16, 36, col); R(x, 38, 6, 20, 3, '#a89878'); R(x, 46, 20, 4, 8, '#5a4a3a'); }
  else if (id === 'malvarrosa' || id === 'marina') { R(x, 0, 24, 96, 20, '#3a9ac8'); R(x, 0, 44, 96, 20, col); if (id === 'marina') { R(x, 50, 14, 2, 20, '#6a4a2a'); for (let k = 0; k < 16; k++) R(x, 52, 16 + k, k * 0.6, 1, '#ffffff'); } else { R(x, 30, 36, 8, 6, '#2f8fd8'); R(x, 34, 20, 1, 16, '#e8e4dc'); } }
  else if (id === 'turia') { R(x, 0, 30, 96, 14, '#6f9c44'); for (let k = 0; k < 5; k++) { R(x, 10 + k * 18, 22, 4, 12, '#6a4a2c'); E(x, 12 + k * 18, 20, 7, 6, '#3f7a36'); } }
  else if (id === 'colon') { E(x, 48, 24, 34, 12, '#8a4a2a'); R(x, 16, 24, 64, 20, col); for (let k = 0; k < 5; k++) R(x, 22 + k * 12, 30, 6, 10, '#3e4c5e'); R(x, 14, 22, 68, 3, '#5a3a2a'); }
  else if (id === 'colba') { R(x, 36, 2, 24, 42, col); for (let f = 0; f < 6; f++) for (let k = 0; k < 2; k++) R(x, 40 + k * 10, 6 + f * 6, 6, 4, f === 4 ? '#2a9aa0' : '#4a6a8a'); }
  else { R(x, 20, 16, 56, 28, col); for (let k = 0; k < 4; k++) R(x, 26 + k * 12, 24, 6, 8, '#3e4c5e'); R(x, 18, 12, 60, 5, shade(col, -0.3)); }
  E(x, 80, 10, 5, 5, '#ffe28a');
}
/* ============ Schnappschüsse ============ */
const Snap = {
  KEY() { return SAVE_KEY + '-snaps'; },
  list() { try { return (JSON.parse(localStorage.getItem(this.KEY()) || '[]')).filter((s) => s.g === G.S.flags.gameId); } catch (e) { return []; } },
  reset() { try { localStorage.removeItem(this.KEY()); } catch (e) {} },
  shoot(src) {
    if (G.mode !== 'play' || !G.map) return;
    const cv = src || View.cv;
    const [c, x] = canvas(Math.min(cv.width, 360), Math.min(cv.height, 480));
    const sx = Math.max(0, (cv.width - c.width) / 2), sy = Math.max(0, (cv.height - c.height) / 2);
    x.drawImage(cv, sx, sy, c.width, c.height, 0, 0, c.width, c.height);
    R(x, 4, c.height - 13, pxTextW(`${dateStr()} ${clockStr()}`) + 4, 11, 'rgba(0,0,0,0.5)');
    pxText(x, `${dateStr()} ${clockStr()}`, 6, c.height - 11, '#ffffff');
    const fl = document.createElement('div'); fl.className = 'cam-flash'; document.getElementById('app').appendChild(fl); setTimeout(() => fl.remove(), 500);
    Snd.sfx('shutter');
    const list = this.list();
    list.push({ img: c.toDataURL('image/png'), t: G.S.time, g: G.S.flags.gameId, map: G.map.name });
    while (list.length > 24) list.shift();
    try { localStorage.setItem(this.KEY(), JSON.stringify(list)); } catch (e) { UI.toast(_t('Kein Platz mehr für Schnappschüsse.'), 'warn'); }
    achieve('knipser');
    UI.toast(_t('📷 Schnappschuss gespeichert (Handy → Fotos).'));
  },
  view(i) {
    const s = this.list()[i]; if (!s) return;
    const o = UI.overlay(_t`<div class="panel snap-panel"><div class="panel-head"><h2>Schnappschuss</h2><span class="sub">${s.map} · ${dateStr(s.t)} ${clockStr(s.t)}</span><button class="x-btn" data-close aria-label="Schliessen">×</button></div><div class="panel-body"><div class="snap-view"><img alt="Schnappschuss" src="${s.img}"></div><div class="snap-btns"><a class="btn primary" style="text-align:center;text-decoration:none" download="valencia-${i + 1}.png" href="${s.img}">Speichern</a><button class="btn" data-close>Zurück</button></div></div></div>`, () => Phone.open('fotos'));
  },
};
