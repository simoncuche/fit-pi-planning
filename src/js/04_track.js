/* ============ Tracking: Spielfortschritt pro Gerät in Firebase (Realtime Database über REST, ohne Bibliothek) ============
   TRACK_DB kommt aus tracking.json bzw. der Umgebungsvariable TRACK_DB (build.py). Leer, offline, abgeschaltet oder nicht
   erreichbar: das Spiel läuft einfach weiter. Daten unter <DB>/pi/devices/<Gerät> = { info, lastSeen, current, label?,
   games/<gameId> = { s: Spielstand-Auszug, started, log/<id> } }. Die Auswertung zeigt dist/tracker.html. */
const TRACK_ROOT = 'pi';
/* Titel der Ereignisse aus 09_zevents.js (Story.ev_<id>) für die Tracker-Seite; build.py übernimmt sie dorthin */
const EV_TITLES = { bunyols: 'Buñuelos-Stand', mestalla: 'Valencia-Spiel in der Bar', robin: 'Robin verirrt sich', gota: 'Gota fría', marathon: 'Marathon-Training', horchata: 'Horchata', moewe: 'Möwe', orange: 'Orange', peloton: 'Peloton', cffans: 'CF-Fans', tourist: 'Tourist' };
const Track = {
  KEY: 'pi-device',
  OFF_KEY: 'pi-track-off',
  MIN_GAP: 45000,
  _last: 0, _blockUntil: 0, _backoff: 60000, _busy: false, _timer: 0, _log: {}, _n: 0,
  enabled() { return !!(typeof TRACK_DB === 'string' && TRACK_DB) && !this.optOut() && !(typeof navigator !== 'undefined' && navigator.webdriver); },
  optOut() { try { return localStorage.getItem(this.OFF_KEY) === '1'; } catch (e) { return false; } },
  setOptOut(off) { try { if (off) localStorage.setItem(this.OFF_KEY, '1'); else localStorage.removeItem(this.OFF_KEY); } catch (e) {} if (!off) this.send('optin', true); },
  device() {
    let id = '';
    try { id = localStorage.getItem(this.KEY) || ''; } catch (e) {}
    if (!/^[a-z0-9]{6,32}$/.test(id)) { id = 'd' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8); try { localStorage.setItem(this.KEY, id); } catch (e) {} }
    return id;
  },
  deviceInfo() {
    const ua = navigator.userAgent || '';
    const os = /iPhone/.test(ua) ? 'iPhone' : /iPad|Macintosh.*Mobile/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1) ? 'iPad' : /Android/.test(ua) ? 'Android' : /Windows/.test(ua) ? 'Windows' : /Mac OS X/.test(ua) ? 'Mac' : /Linux/.test(ua) ? 'Linux' : 'Unbekannt';
    const br = /Edg\//.test(ua) ? 'Edge' : /SamsungBrowser/.test(ua) ? 'Samsung Internet' : /CriOS|Chrome\//.test(ua) ? 'Chrome' : /FxiOS|Firefox\//.test(ua) ? 'Firefox' : /Safari\//.test(ua) ? 'Safari' : 'Browser';
    let app = false; try { app = !!(navigator.standalone || matchMedia('(display-mode: standalone)').matches); } catch (e) {}
    return { os, browser: br, app, screen: `${screen.width}×${screen.height}`, lang: (typeof LANG === 'string' ? LANG : '') || navigator.language || '' };
  },
  /* Ereignisse zählen: jede Story.ev_<id>() wird beim ersten Aufruf von Track.init() umhüllt */
  evSeen() { return (G.S && G.S.flags && G.S.flags.evSeen) || {}; },
  /* Auszug aus dem Spielstand: Fortschritt, Werte, PI-Plan, Erlebnisse, Rekorde */
  snapshot() {
    const S = G.S, r1 = (v) => Math.round((v || 0) * 10) / 10, f = S.flags || {};
    const st = {}; for (const k of Object.keys(S.st)) st[k] = k === 'prom' ? Math.round(S.st.prom * 100) / 100 : r1(S.st[k]);
    const p = PEOPLE[S.pid] || {}, team = S.team || p.team || '';
    const plan = {}; for (const k of Object.keys(S.plan || {})) plan[k] = Math.round(S.plan[k] || 0);
    return {
      name: S.name, pid: S.pid || '', who: p.name || '', role: p.role || '', team, teamName: (TEAMS[team] || {}).n || '', po: !!(TEAMS[team] && TEAMS[team].po === S.pid),
      look: S.look, stage: S.stage, stageIdx: STAGES.indexOf(S.stage), day: dayOf(S.time), time: Math.round(S.time),
      when: `${dateStr()} ${clockStr()}`, map: (G.map && G.map.name) || S.map || '', lang: typeof LANG === 'string' ? LANG : '',
      st, money: { eur: Math.round(S.money.eur * 100) / 100 },
      beers: S.beers || 0, shots: S.shots || 0, coffees: S.coffees || 0,
      ach: Object.keys(S.ach || {}), achTotal: Object.keys(ACH).length,
      sights: Object.keys(S.photos || {}).length, rec: S.rec || {},
      plan, deps: Object.keys(S.deps || {}).length,
      ws: { ux: !!f.ws_ux, arch: !!f.ws_arch, roadmap: !!f.ws_roadmap, retro: !!f.ws_retro },
      ev: this.evSeen(), evTotal: Object.keys(EV_TITLES).length,
      finished: !!S.finished, over: G.mode === 'over',
      v: APP_VERSION, at: { '.sv': 'timestamp' },
    };
  },
  /* Ereignis fürs Protokoll merken; wichtige Ereignisse sofort senden */
  event(kind, val, now) {
    if (!this.enabled() || !G.S) return;
    const id = Date.now().toString(36) + (this._n++ % 36).toString(36);
    this._log[id] = { e: kind, v: val == null ? '' : String(val).slice(0, 80), when: G.S.time != null ? `${dateStr()} ${clockStr()}` : '', at: { '.sv': 'timestamp' } };
    if (now) this.send(kind, true);
    else this.send(kind);
  },
  /* Senden mit Drosselung (MIN_GAP), Zeitlimit und Pause nach Fehlern; Fehler werden still ignoriert */
  send(reason, force, keepalive) {
    if (!this.enabled() || !G.S || !G.S.flags || !G.S.flags.gameId) return;
    const now = Date.now();
    if (now < this._blockUntil || (typeof navigator !== 'undefined' && navigator.onLine === false)) return;
    if (this._busy && !keepalive) { this._again = this._again === 'force' || force ? 'force' : 'later'; return; }
    if (!force && now - this._last < this.MIN_GAP) {
      if (!this._timer) this._timer = setTimeout(() => { this._timer = 0; this.send('later'); }, this.MIN_GAP - (now - this._last) + 50);
      return;
    }
    clearTimeout(this._timer); this._timer = 0;
    const gid = G.S.flags.gameId, base = `games/${gid}`;
    const body = { info: this.deviceInfo(), lastSeen: { '.sv': 'timestamp' }, current: gid, [`${base}/s`]: this.snapshot() };
    if (!G.S.flags.trackStarted) body[`${base}/started`] = { '.sv': 'timestamp' };
    const log = this._log; this._log = {};
    for (const k of Object.keys(log)) body[`${base}/log/${k}`] = log[k];
    this._last = now; this._busy = true;
    const url = `${TRACK_DB.replace(/\/+$/, '')}/${TRACK_ROOT}/devices/${this.device()}.json`;
    let ctl = null, to = 0;
    try { ctl = new AbortController(); to = setTimeout(() => ctl.abort(), 7000); } catch (e) {}
    let p;
    try { p = fetch(url, { method: 'PATCH', body: JSON.stringify(body), keepalive: !!keepalive, signal: ctl ? ctl.signal : undefined, headers: { 'Content-Type': 'application/json' } }); }
    catch (e) { p = Promise.reject(e); }
    p.then((res) => {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      G.S.flags.trackStarted = 1; this._backoff = 60000;
    }).catch(() => {
      /* Nicht erreichbar: Ereignisse für später behalten, eine Weile Pause (bis 30 Minuten) */
      Object.assign(this._log, log);
      const keys = Object.keys(this._log); if (keys.length > 40) for (const k of keys.slice(0, keys.length - 40)) delete this._log[k];
      this._blockUntil = Date.now() + this._backoff; this._backoff = Math.min(this._backoff * 2, 30 * 60000);
    }).finally(() => {
      clearTimeout(to); this._busy = false;
      if (this._again) { const f = this._again === 'force'; this._again = false; this.send('again', f); }
    });
  },
  init() {
    if (this._init) return; this._init = true;
    /* Ereignisse zählen, egal ob Tracking an ist (Erlebnis-Zähler im Spielstand) */
    for (const id of Object.keys(EV_TITLES)) {
      const k = 'ev_' + id, orig = Story[k];
      if (typeof orig !== 'function') continue;
      Story[k] = function (...a) { const f = G.S && G.S.flags; if (f) { f.evSeen = f.evSeen || {}; f.evSeen[id] = (f.evSeen[id] || 0) + 1; } Track.event('ev', EV_TITLES[id], true); return orig.apply(this, a); };
    }
    /* Regelmässiges Lebenszeichen, solange gespielt wird */
    setInterval(() => { if (G.S && G.mode === 'play' && !document.hidden) this.send('tick'); }, 60000);
    document.addEventListener('visibilitychange', () => { if (document.hidden && G.S) this.send('hide', true, true); });
    window.addEventListener('pagehide', () => { if (G.S) this.send('hide', true, true); });
  },
};
