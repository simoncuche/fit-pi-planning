/* ============ Start & Hauptschleife ============ */
G.mode = 'title';
function isTouch() { return window.matchMedia && (matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window); }

function boot() {
  View.cv = document.getElementById('screen');
  View.ctx = View.cv.getContext('2d');
  [View.wcv, View.wctx] = canvas(480, 270);
  [View.lcv, View.lctx] = canvas(480, 270);
  resizeView();
  window.addEventListener('resize', resizeView);
  UI.init();
  Input.touch = isTouch();
  document.body.classList.toggle('touch', Input.touch);
  wireInput();
  showTitle();
  let last = performance.now(), hudT = 0;
  const loop = (now) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (G.mode === 'play' && G.map) {
      try {
        updateWorld(dt);
        renderWorld();
        renderScreen();
      } catch (e) { console.error(e); }
      hudT += dt; if (hudT > 0.5) { hudT = 0; UI.hud(); }
    }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
  document.addEventListener('visibilitychange', () => { if (document.hidden && G.mode === 'play') saveGame(true); });
}

function changelogHtml() {
  return CHANGELOG.map((e, i) => `<div class="cl-entry${i === 0 ? ' cur' : ''}"><div class="cl-head"><b>Version ${e.v}</b><span>${e.date}${i === 0 ? ' · aktuell' : ''}</span></div><ul>${e.items.map((x) => `<li>${x}</li>`).join('')}</ul></div>`).join('');
}
const SKYLINE_SVG = `<svg viewBox="0 0 1200 70" preserveAspectRatio="none" aria-hidden="true"><g fill="#0e2a44"><rect x="0" y="40" width="1200" height="30"/><rect x="40" y="22" width="30" height="20"/><rect x="90" y="30" width="60" height="12"/><rect x="170" y="8" width="14" height="34"/><rect x="167" y="4" width="20" height="5"/><rect x="200" y="26" width="50" height="16"/><path d="M280 42 Q330 -10 380 42 Z"/><path d="M300 42 Q330 14 360 42 Z" fill="#1f4a6a"/><rect x="400" y="18" width="22" height="24"/><rect x="430" y="28" width="40" height="14"/><rect x="500" y="12" width="60" height="30"/><rect x="505" y="6" width="50" height="7"/><rect x="590" y="24" width="30" height="18"/><rect x="640" y="30" width="80" height="12"/><path d="M740 42 Q770 0 800 42 Z"/><rect x="820" y="20" width="18" height="22"/><rect x="850" y="30" width="46" height="12"/><rect x="920" y="2" width="16" height="40"/><rect x="950" y="26" width="60" height="16"/><rect x="1030" y="14" width="30" height="28"/><rect x="1080" y="30" width="80" height="12"/></g><g fill="#0e2a44"><path d="M60 42 l-2 -14 l-6 -2 l8 -2 l-2 -8 l6 6 l6 -6 l-2 8 l8 2 l-6 2 l-2 14 Z"/><path d="M1130 42 l-2 -14 l-6 -2 l8 -2 l-2 -8 l6 6 l6 -6 l-2 8 l8 2 l-6 2 l-2 14 Z"/></g></svg>`;
function showTitle() {
  const t = document.getElementById('title');
  const save = loadSave();
  t.hidden = false;
  t.innerHTML = `<div class="sunball" aria-hidden="true"></div><div class="skyline" aria-hidden="true">${SKYLINE_SVG}</div><div class="waves" aria-hidden="true"></div>
  <div class="title-card"><div class="boarding">
    <div class="bp-head"><span>Boarding Pass · Economy</span><b>PI 2026-03</b></div>
    <div class="bp-body">
      <h1 class="title-name">PI Planning <span>Valencia</span></h1>
      <div class="bp-route"><div><small>Von</small><b>ZRH</b></div><span class="plane">✈</span><div><small>Nach</small><b>VLC</b></div></div>
      <div class="bp-grid"><div><small>Datum</small><b>16.03.2026</b></div><div><small>Gate</small><b>B42</b></div><div><small>Sitz</small><b>14A</b></div><div><small>Ziel</small><b>Colba, 1. Stock</b></div></div>
      <p class="title-sub">Fünf Tage, drei Teams, ein Plan. Flieg mit den POs nach Valencia, finde den Koffer, das Hotel Kramer und die richtige Klingel am Colba-Hochhaus. Plane mit Indurain, Meeseeks und Rocket das nächste halbe Jahr – und erleb dazwischen Paella, Mascletà, Kartbahn, Segeltörn und E-Bike-Ausfahrten.</p>
      <div class="title-btns">
        ${save && !save.finished ? `<button class="btn primary" id="tCont">Weiterspielen · ${save.name}, ${dateStr(save.time)} ${clockStr(save.time)}</button>` : ''}
        ${save && save.finished ? `<p class="title-sub">Letztes Planning abgeschlossen: ${save.name}, ${Object.keys(save.ach || {}).length} Erlebnisse, Plan ${Math.round(save.plan[save.team] || 0)} %.</p>` : ''}
        <button class="btn ${save && !save.finished ? '' : 'primary'}" id="tNew">${save && !save.finished ? 'Neues Spiel' : 'Boarding'}</button>
      </div>
    </div>
    <div class="bp-tear"></div>
    <div class="keys">Tastatur: <kbd>WASD</kbd>/<kbd>Pfeile</kbd> gehen · <kbd>Shift</kbd> rennen · <kbd>E</kbd> Aktion · <kbd>M</kbd> Handy · <kbd>P</kbd> Foto. Am Handy: links ziehen zum Gehen, <kbd>A</kbd> für Aktionen. Läuft komplett im Browser, Spielstand bleibt auf diesem Gerät.</div>
    <div class="barcode" aria-hidden="true"></div>
    <div class="version"><span>Version ${APP_VERSION} · ${APP_VERSION_DATE}${BUILD_VARIANT ? ` · Vorschau ${BUILD_VARIANT}` : ''}</span><button class="link" id="tLog" aria-expanded="false">Was ist neu?</button></div>
    <div class="changelog" id="tChangelog" hidden>${changelogHtml()}</div>
  </div></div>`;
  const logBtn = t.querySelector('#tLog'), logBox = t.querySelector('#tChangelog');
  logBtn.onclick = () => { const open = logBox.hidden; logBox.hidden = !open; logBtn.textContent = open ? 'Historie schliessen' : 'Was ist neu?'; logBtn.setAttribute('aria-expanded', String(open)); if (open) logBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); };
  const cont = t.querySelector('#tCont');
  if (cont) cont.onclick = () => { Snd.init(); startGame(save); };
  t.querySelector('#tNew').onclick = async () => {
    Snd.init();
    t.hidden = true;
    const res = await Editor.open({ mode: 'new' });
    if (!res) { showTitle(); return; }
    const crew = CREW.find((c) => c.id === res.pid);
    const S2 = newState(res.look, crew.name);
    S2.pid = res.pid;
    S2.team = crew.team;
    clearSave();
    try { localStorage.removeItem(SAVE_KEY + '-img'); } catch (e) {}
    startGame(S2, true);
  };
}

async function startGame(state, fresh) {
  G.S = state;
  if (!G.S.flags.met) G.S.flags.met = {};
  buildFriends();
  G.photoImg = {};
  if (fresh || !G.S.flags.gameId) { G.S.flags.gameId = 'g' + Date.now().toString(36); Snap.reset(); }
  try { G.photoImg = JSON.parse(localStorage.getItem(SAVE_KEY + '-img') || '{}'); } catch (e) {}
  document.getElementById('title').hidden = true;
  document.getElementById('hud').hidden = false;
  document.getElementById('touch').hidden = false;
  G.player = null;
  if (fresh) enterMap('airport', 'start');
  else enterMap(G.S.map, { x: G.S.x, y: G.S.y, dir: G.S.dir });
  Story._lastHour = Math.floor(hourOf(G.S.time));
  G.mode = 'play';
  Story.ready = true;
  UI.hud();
  if (fresh) {
    G.busy++;
    await Scene.play('plane', { ms: 3200, text: 'Anflug auf Valencia …' });
    await UI.fadeIn();
    await UI.card(`${dateLong()} · ${clockStr()} Uhr · Aeropuerto de València, Ankunft`, 1800);
    await Story.intro();
    if (Input.touch) await Story.say(null, 'Zieh mit dem Daumen links auf dem Bildschirm, um zu gehen. Weit ziehen heisst rennen. Mit A sprichst du mit Leuten und benutzt Dinge. Oben rechts ist dein Handy.');
    else await Story.say(null, 'WASD oder Pfeiltasten zum Gehen, Shift zum Rennen, E für Aktionen, M für dein Handy, P für ein Foto.');
    G.busy--;
    saveGame(true);
  }
}

function wireInput() {
  const keyDown = (e) => {
    if (G.mode !== 'play') return;
    if (!document.getElementById('editor').hidden) return;
    const code = e.code;
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(code)) e.preventDefault();
    if (code === 'KeyP' && !UI.ovOpen) { Snap.shoot(); return; }
    if (UI.dlgOpen) { UI.dlgKey(code); return; }
    if (UI.ovOpen) {
      if (Mini.key) { Mini.key(code); return; }
      if (code === 'Escape' || code === 'KeyM') UI.closeOverlay();
      return;
    }
    Input.keys[code] = true;
    if (['KeyE', 'Space', 'Enter'].includes(code)) doInteract();
    if (code === 'KeyM' || code === 'Tab') { e.preventDefault(); if (!G.busy) Phone.open(); }
  };
  window.addEventListener('keydown', keyDown);
  window.addEventListener('keyup', (e) => { Input.keys[e.code] = false; });
  window.addEventListener('blur', () => { Input.keys = {}; });
  const scr = document.getElementById('screen');
  const stick = document.getElementById('stick'), knob = document.getElementById('knob');
  const S = Input.stick;
  const start = (e) => {
    if (G.mode !== 'play' || G.busy) return;
    Input.touch = true; document.body.classList.add('touch');
    if (S.on) return;
    S.on = true; S.id = e.pointerId; S.ox = e.clientX; S.oy = e.clientY; S.x = 0; S.y = 0;
    stick.style.left = e.clientX + 'px'; stick.style.top = e.clientY + 'px'; stick.classList.add('on'); document.body.classList.add('stick-on');
    knob.style.transform = 'translate(0,0)';
    e.preventDefault();
  };
  const move = (e) => {
    if (!S.on || e.pointerId !== S.id) return;
    const dx = e.clientX - S.ox, dy = e.clientY - S.oy;
    const d = Math.hypot(dx, dy), max = 48;
    const k = d > max ? max / d : 1;
    S.x = (dx * k) / max * (d > 8 ? 1 : 0); S.y = (dy * k) / max * (d > 8 ? 1 : 0);
    if (d > 70) { S.x *= 1.2; S.y *= 1.2; }
    knob.style.transform = `translate(${dx * k}px, ${dy * k}px)`;
  };
  const end = (e) => { if (e.pointerId !== S.id) return; S.on = false; S.x = 0; S.y = 0; stick.classList.remove('on'); document.body.classList.remove('stick-on'); };
  scr.addEventListener('pointerdown', start);
  window.addEventListener('pointermove', move);
  window.addEventListener('pointerup', end);
  window.addEventListener('pointercancel', end);
  document.getElementById('touch').addEventListener('pointerdown', (e) => { if (e.target.id === 'touch' || e.target.id === 'stickHint') start(e); });
  document.getElementById('btnA').addEventListener('pointerdown', (e) => { e.preventDefault(); e.stopPropagation(); Snd.init(); if (UI.dlgOpen) { UI.dlgAdvance(); return; } doInteract(); });
  document.addEventListener('contextmenu', (e) => { if (G.mode === 'play') e.preventDefault(); });
  document.addEventListener('pointerdown', () => Snd.init());
  document.addEventListener('keydown', () => Snd.init());
  document.addEventListener('visibilitychange', () => { if (!document.hidden) Snd.init(); });
}
window.addEventListener('load', boot);
/* Homescreen-Apps halten gern eine alte Version im Cache: version.json ohne Cache lesen und zum Neuladen auffordern */
async function checkUpdate() {
  if (!/^https?:/.test(location.protocol)) return;
  try {
    const r = await fetch('version.json?t=' + Date.now(), { cache: 'no-store' });
    if (!r.ok) return;
    const j = await r.json();
    if (!j.v || j.v === APP_VERSION) return;
    const el = UI.toast(`Neue Version ${j.v} verfügbar – hier tippen zum Neuladen.`, 'ach');
    if (el) { el.addEventListener('pointerdown', () => location.reload(), { once: true }); setTimeout(() => el.classList.remove('out'), 400); }
  } catch (e) { /* offline */ }
}
window.addEventListener('load', () => setTimeout(checkUpdate, 2500));
