/* ============ Story: Ablauf, Orte, Dialoge ============ */
const STAGES = ['koffer', 'sammeln', 'taxi', 'hotel', 'checkin', 'zimmer', 'bar', 'free'];
const OPEN = { bar: [11, 26], jamon: [12, 24], bodega: [17, 24], disco: [23, 30], museum: [10, 20], mercado: [7.5, 15], kart: [10, 22], padel: [9, 22], sail: [10, 18], moda: [10, 21], super: [9, 21.5], farmacia: [9, 20.5], estanco: [8, 22], souvenir: [10, 22], rent: [9, 20], horchata: [9, 22], churros: [8, 23], chiringuito: [10, 24], veles: [11, 26], breakfast: [7, 10.5], paella: [11, 17], station: [6, 23] };
function isOpen(k) {
  const o = OPEN[k]; if (!o) return true;
  let h = hourOf(G.S.time);
  const sunday = dayOf(G.S.time) % 7 === 6;
  if (sunday && ['moda', 'super', 'farmacia', 'mercado', 'rent'].includes(k)) return false;
  if (o[1] > 24 && h < o[1] - 24) h += 24;
  return h >= o[0] && h < o[1];
}
const hoursStr = (k) => { const o = OPEN[k]; const f = (v) => pad2(Math.floor(v % 24)) + ':' + pad2(Math.round((v % 1) * 60)); return f(o[0]) + '–' + f(o[1]); };
const LUNCH = { 1: ['paella', _t('Paella Valenciana'), _t('Isabel hat beim Restaurant um die Ecke zwei riesige Pfannen bestellt: Hühnchen, Kaninchen, Garrofó, Bohnen, Safran. Kein Chorizo – niemals.')], 2: ['burger', _t('Smash Burger'), _t('Burger-Mittwoch: Vicente hat den Foodtruck organisiert. Doppelt Käse, Pommes dazu.')], 3: ['bocadillo', _t('Bocadillos'), _t('Donnerstag ist Bocadillo-Tag: Jamón, Tortilla, Esgarraet – auf knusprigem Brot aus dem Mercado.')], 4: ['bowl', _t('Healthy Breakfast'), _t('Freitagmorgen: Bowls, Obst, Joghurt, Zumo. Elena besteht auf dem gesunden Abschluss.')] };

const it = (id, price, o = {}) => Object.assign({ id, price }, o);
const SHOPS = {
  automat: { title: _t('Automat'), mode: 'take', sections: [{ t: _t('Snacks & Getränke'), items: [it('agua', 1.5), it('cola', 2), it('energy', 2.5), it('chips', 1.8), it('almendras', 2.2), it('croissant', 2)] }] },
  aircafe: { title: _t('Flughafen-Café'), mode: 'eat', intro: _t('Der Barista stellt die Tasse hin, bevor du bestellt hast. „¿Cortado?“'), sections: [{ t: _t('Kaffee'), items: [it('cortado', 2.2), it('conleche', 2.6), it('zumo', 3.5), it('agua', 1.8)] }, { t: _t('Essen'), items: [it('bocadillo', 5.5), it('croissant', 2.4), it('tortilla', 4.5)] }] },
  breakfast: { title: _t('Frühstück im Hotel Kramer'), mode: 'eat', intro: _t('Buffet bis 10:30. Marta schiebt dir eine Zeitung hin.'), sections: [{ t: _t('Frühstück'), items: [it('conleche', 0), it('zumo', 0), it('croissant', 0), it('tortilla', 0), it('bowl', 0), it('fruta', 0)] }] },
  minibar: { title: _t('Minibar'), mode: 'eat', intro: _t('Hotelpreise. Natürlich.'), sections: [{ t: _t('Inhalt'), items: [it('tercio', 5.5), it('agua', 4), it('cola', 4.5), it('chips', 4.5), it('almendras', 5)] }] },
  bar: { title: _t('Bar Pepita'), mode: 'eat', venue: 'bar', intro: _t('Pepita poliert ein Glas. „¿Qué os pongo?“'), sections: [
    { t: _t('Bier'), items: [it('cana', 2.2), it('jarra', 4.5), it('tercio', 3)] },
    { t: _t('Valencia'), items: [it('agua_val', 6.5), it('agua_val_j', 24, { n: _t('Agua de Valencia (Krug für alle)'), d: _t('Cava, Orangensaft, Wodka, Gin – ein Krug für den Tisch'), special: 'round' }), it('tinto', 3.5), it('sangria', 4.5), it('chupito', 2.5)] },
    { t: _t('Alkoholfrei'), items: [it('cola', 2.5), it('agua', 2), it('cortado', 1.8), it('zumo', 3.5)] },
    { t: _t('Tapas'), items: [it('tapas', 9.5), it('bravas', 5.5), it('tortilla', 4.5), it('esgarraet', 6), it('bocadillo', 6)] },
  ] },
  jamon: { title: _t('Jamonería Ramón'), mode: 'eat', venue: 'jamon', intro: _t('Ramón schneidet hauchdünn. „Bellota, 36 Monate. Pruébalo.“'), sections: [{ t: _t('Jamón'), items: [it('jamon', 18), it('tapas', 10), it('esgarraet', 6.5)] }, { t: _t('Dazu'), items: [it('vino', 4), it('cana', 2.5), it('cava', 4.5), it('agua', 2)] }] },
  discobar: { title: _t('Bar im Marina Beach Club'), mode: 'eat', venue: 'disco', intro: _t('Noa schreit über den Bass: „¿QUÉ QUIERES?“'), sections: [{ t: _t('Drinks'), items: [it('tercio', 6), it('gintonic', 11), it('mojito', 10), it('chupito', 4)] }, { t: _t('Alkoholfrei'), items: [it('cola', 4.5), it('agua', 4), it('energy', 5)] }] },
  chiringuito: { title: _t('Chiringuito'), mode: 'eat', venue: 'chiringuito', intro: _t('Füsse im Sand, Musik aus der Box.'), sections: [{ t: _t('Getränke'), items: [it('cana', 3), it('tinto', 4), it('mojito', 8), it('zumo', 4), it('agua', 2.5)] }, { t: _t('Essen'), items: [it('calamares', 9), it('pescado', 14), it('bravas', 5.5), it('fruta', 4)] }] },
  veles: { title: _t('Veles e Vents · Bar'), mode: 'eat', venue: 'veles', intro: _t('Hafenblick, Segelboote, ein Hauch von America’s Cup.'), sections: [{ t: _t('Getränke'), items: [it('cava', 6), it('gintonic', 12), it('cana', 3.5), it('cortado', 2.5), it('agua', 3)] }, { t: _t('Essen'), items: [it('sepia', 12), it('fideua', 16), it('tapas', 11)] }] },
  horchata: { title: _t('Horchatería'), mode: 'eat', venue: 'horchata', intro: _t('„Horchata mit Fartons – das ist Valencia.“'), sections: [{ t: _t('Horchata'), items: [it('horchata', 3), it('fartons', 1.5)] }, { t: _t('Sonst'), items: [it('zumo', 3.5), it('cortado', 1.8), it('agua', 1.5)] }] },
  zumo: { title: _t('Zumo-Wagen'), mode: 'eat', venue: 'horchata', sections: [{ t: _t('Frisch gepresst'), items: [it('zumo', 3), it('naranja', 0.8), it('fruta', 4)] }] },
  churros: { title: _t('Churrería'), mode: 'eat', venue: 'churros', sections: [{ t: _t('Süsses'), items: [it('churros', 4.5), it('conleche', 2.2), it('horchata', 3)] }] },
  super: { title: _t('Supermercado'), mode: 'take', venue: 'super', sections: [{ t: _t('Einkaufen'), items: [it('agua', 0.7), it('tercio', 1.1), it('energy', 1.4), it('naranja', 0.4), it('bocadillo', 3.2), it('chips', 1.9), it('almendras', 2.4), it('fruta', 2.5), it('sonnencreme', 7.9)] }] },
  farmacia: { title: _t('Farmacia'), mode: 'take', venue: 'farmacia', intro: _t('Die Apothekerin mustert dich über ihre Brille hinweg.'), sections: [{ t: _t('Rezeptfrei'), items: [it('aspirin', 5.9), it('magen', 8.5), it('sonnencreme', 11.9)] }] },
  estanco: { title: _t('Estanco'), mode: 'take', venue: 'estanco', sections: [{ t: _t('Tabak & Co.'), items: [it('zigaretten', 5.5), it('feuerzeug', 1.2), it('postits', 2.5)] }] },
  souvenir: { title: _t('Souvenirs València'), mode: 'take', venue: 'souvenir', sections: [{ t: _t('Andenken'), items: [it('fallera', 14.9), it('ninot', 9.9), it('abanico', 7.5), it('azulejo', 6.5), it('paellera', 24), it('schal', 19.9, { d: _t('Valencia CF – Amunt!') }), it('chufa', 4.5)] }] },
  moda: { title: _t('Moda Valencia'), mode: 'wear', venue: 'moda', intro: _t('Leinen, Sonnenbrillen, Strohhüte – und ein Verkäufer mit perfekter Bräune.'), sections: [{ t: _t('Kleidung'), items: [
    it('o_sonne', 29, { n: _t('Sonnenbrille'), icon: 'glasses', wear: { glasses: 3 }, d: _t('Pflicht am Strand') }),
    it('o_stroh', 24, { n: _t('Strohhut'), icon: 'hat', wear: { hat: 6 }, unlock: 'strohhut', d: _t('Gegen die Mittagssonne') }),
    it('o_leinen', 89, { n: _t('Leinen-Set'), icon: 'shirt', wear: { top: 1, topCol: 14, pants: 1, pantsCol: 5, shoes: 4, shoesCol: 2, hat: 0, print: 0 }, d: _t('Weisses Hemd, beige Chino, Sandalen') }),
    it('o_beach', 59, { n: _t('Strand-Set'), icon: 'shirt', wear: { top: 0, topCol: 8, print: 6, pants: 6, pantsCol: 12, shoes: 6, shoesCol: 1 }, d: _t('Palmen-Shirt, Boardshorts, Flip-Flops') }),
    it('o_racing', 149, { n: _t('Racing-Jacke'), icon: 'shirt', wear: { top: 9, topCol: 0 }, unlock: 'racing', d: _t('Luigi wird neidisch') }),
    it('o_trikot', 79, { n: _t('Radtrikot & Radschuhe'), icon: 'shirt', wear: { top: 10, topCol: 2, shoes: 7, shoesCol: 1 }, unlock: 'radtrikot', d: _t('Für die Ausfahrt mit Aitor') }),
    it('o_vcf', 69, { n: _t('Valencia-CF-Set'), icon: 'shirt', wear: { top: 6, topCol: 14, print: 3, acc: 4, hat: 0 }, d: _t('Trikot Nummer 7 und Schal') }),
    it('o_helm', 39, { n: _t('Velohelm'), icon: 'helmet', wear: { hat: 5, hatCol: 8 }, d: _t('Sicherheit geht vor') }),
  ] }] },
  fisch: { title: _t('Pescadería'), mode: 'take', venue: 'mercado', intro: _t('Toni wirft Eis auf die Doraden. „¡Fresco, fresco!“'), sections: [{ t: _t('Frisch vom Markt'), items: [it('pescado', 9, { n: _t('Dorada (ganz)'), d: _t('Für die Hotelküche – oder als Geschenk für Isabel') }), it('calamares', 7, { n: _t('Calamares (roh)'), d: _t('Roh. Besser im Chiringuito bestellen.') })] }] },
  mjamon: { title: _t('Jamones y Embutidos'), mode: 'eat', venue: 'mercado', sections: [{ t: _t('Zum Probieren'), items: [it('jamon', 12), it('bocadillo', 4.5), it('tapas', 7)] }] },
  fruta: { title: _t('Frutería'), mode: 'take', venue: 'mercado', sections: [{ t: _t('Obst'), items: [it('naranja', 0.3), it('fruta', 2.8), it('zumo', 2.5)] }] },
  spice: { title: _t('Especias'), mode: 'take', venue: 'mercado', sections: [{ t: _t('Gewürze'), items: [it('chufa', 3.9), it('almendras', 3.5), it('azulejo', 5.9, { n: _t('Safran-Dose (Azulejo-Design)'), d: _t('Für die Paella zuhause') })] }] },
  flores: { title: _t('Flores'), mode: 'take', venue: 'mercado', sections: [{ t: _t('Blumen'), items: [it('abanico', 6.5, { n: _t('Fächer mit Blumen'), icon: 'fan' }), it('fallera', 12.9)] }] },
};

const Story = {
  ready: false, EVENTS: [],
  say(sp, text) { return UI.say(sp, text); },
  ask(sp, text, opts) { return UI.ask(sp, text, opts); },
  stageAt(s) { return STAGES.indexOf(G.S.stage) >= STAGES.indexOf(s); },
  setStage(s) { G.S.stage = s; UI.hud(); Track.event('stage', s, true); },
  isSwiss() { return SWISS.includes(G.S.pid); },
  isColba() { return COLBA.includes(G.S.pid) || G.S.pid === 'isabell'; },
  /* Wen muss man am Flughafen einsammeln? */
  airportGroup() { return SWISS.filter((id) => id !== G.S.pid); },
  /* ---------- Workshops im Aufenthaltsraum (Tag, Startstunde, Dauer 1,5 h) ---------- */
  WORKSHOPS: { 1: { id: 'ux', h: 16, who: 'elena', n: _t('UX-Workshop') }, 2: { id: 'arch', h: 11, who: 'carlos', n: _t('Architektur-Workshop') }, 3: { id: 'roadmap', h: 11, who: 'chris', n: _t('Roadmap-Workshop') }, 4: { id: 'retro', h: 11, who: 'simon', n: _t('PI-Retrospektive') } },
  /* Feste Termine: höchstens eine Stunde zu spät, sonst ist Schluss – mit Neustart zwei Stunden vorher (Checkpoint) */
  appts() {
    const f = G.S.flags, W = this.WORKSHOPS;
    const list = [
      { id: 'bar', d: 0, h: 17, n: _t('Treffen in der Bar Pepita'), where: _t('Bar Pepita, Plaza de la Virgen'), done: () => this.stageAt('free') },
      { id: 'kickoff', d: 1, h: 9.5, n: _t('Kickoff: Business Context'), where: _t('Aufenthaltsraum bei Colba'), done: () => !!f.kickoff },
    ];
    for (const d of [1, 2, 3, 4]) list.push({ id: 'ws_' + W[d].id, d, h: W[d].h, n: W[d].n, where: _t('Aufenthaltsraum bei Colba'), done: () => !!f['ws_' + W[d].id] });
    list.push({ id: 'ride', d: 3, h: 15.5, n: _t('Team-Ausfahrt'), where: _t('E-Bike-Raum bei Colba'), done: () => !!f.teamRide });
    list.push({ id: 'final', d: 4, h: 15, n: _t('Final-Präsentation'), where: _t('Aufenthaltsraum bei Colba'), done: () => !!f.final });
    return list;
  },
  checkAppts() {
    const f = G.S.flags, now = G.S.time; f.apw = f.apw || {};
    if (f.noAppts) return; /* Schalter für Tests, die durch die Woche springen */
    for (const a of this.appts()) {
      if (a.done()) continue;
      const at = a.d * 1440 + a.h * 60, lvl = f.apw[a.id] || 0;
      if (now < at - 120) continue;
      if (lvl < 1) { f.apw[a.id] = 1; this.checkpoint(a.id); }
      if (now >= at - 30 && lvl < 2) { f.apw[a.id] = 2; UI.toast(_t`In 30 Minuten: ${a.n} – ${a.where}.`, 'warn'); }
      if (now >= at && lvl < 3) { f.apw[a.id] = 3; UI.toast(_t`Jetzt: ${a.n}! ${a.where}.`, 'warn'); }
      if (now >= at + 45 && lvl < 4) { f.apw[a.id] = 4; UI.toast(_t`Letzte Chance: ${a.n} – in 15 Minuten ist es zu spät.`, 'warn'); }
      if (now > at + 60) { this.missed(a, at); return; }
    }
  },
  checkpoint(id) {
    if (!G.player || !G.map) return;
    const snap = Object.assign({}, G.S, { map: G.map.id, x: Math.round(G.player.x), y: Math.round(G.player.y), dir: G.player.dir });
    try { localStorage.setItem(SAVE_KEY + '-cp', JSON.stringify({ id, state: snap })); } catch (e) {}
  },
  async missed(a, at) {
    G.busy++;
    Track.event('missed', a.n, true);
    const retry = () => {
      let st = null;
      try { const cp = JSON.parse(localStorage.getItem(SAVE_KEY + '-cp') || 'null'); if (cp && cp.id === a.id && cp.state) st = cp.state; } catch (e) {}
      if (!st) { st = JSON.parse(JSON.stringify(G.S)); st.map = G.map.id; st.x = Math.round(G.player.x); st.y = Math.round(G.player.y); st.dir = G.player.dir; }
      st.time = Math.min(st.time, at - 120); st.flags.retries = (st.flags.retries || 0) + 1; if (st.flags.apw) delete st.flags.apw[a.id];
      st.st.energy = Math.max(st.st.energy, 50);
      G.busy = 0; Track.event('retry', a.n, true);
      startGame(st, false);
      setTimeout(() => UI.toast(_t`Zweite Chance: ${a.n} um ${clockStr(at)}. Diesmal pünktlich!`, 'warn'), 900);
    };
    UI.missed(_t('Termin verpasst'), _t`${a.n} war um ${clockStr(at)} – ${a.where}. Jetzt ist es ${clockStr()}. Bei Colba wartet niemand länger als eine Stunde.`, _t('Du kannst zwei Stunden vor dem Termin nochmals starten und es diesmal rechtzeitig schaffen.'), retry);
  },
  workshopAt(d, h) { const w = this.WORKSHOPS[d]; return w && h >= w.h && h < w.h + 1.5 && !G.S.flags['ws_' + w.id] && G.S.flags.kickoff ? w : null; },
  workshopNow() { return this.workshopAt(today(), hourOf(G.S.time)); },
  async workshop(w) {
    const f = G.S.flags;
    G.busy++;
    await UI.announce(_t`${DAY_NAMES[today() % 7]} ${w.h}:00`, w.n, _t`mit ${fname(w.who)} im Aufenthaltsraum`);
    const intro = { ux: _t('Ein Nachmittag für die App: Ich zeige euch sechs Stellen, an denen Nutzer gescheitert sind. Ihr sagt mir, was wir ändern. Keine Codes, keine Hexzahlen – Menschen.'), arch: _t('Vier Schichten, ein Pfeil nach unten. UI oben, Infrastruktur unten, und nichts zeigt nach oben. Wer das verstanden hat, refactort nie wieder um drei Uhr nachts.'), roadmap: _t('Die Roadmap ist ein Surfbrett: Richtung klar, Weg flexibel. Sechs Sprints, zehn Punkte – Meilensteine und Releases. Legt sie so, dass nichts vor seiner Voraussetzung kommt. Und die Demo zuletzt.'), retro: _t('Bevor wir committen: Was lief gut, was lassen wir, was fangen wir an? Keep, Stop, Start. Robin, du darfst auch.') }[w.id];
    await this.say(w.who, intro);
    const r = await Mini[w.id]();
    if (!r) { G.busy--; await this.say(w.who, _t('Wir machen weiter, wenn du wieder da bist.')); return; }
    f['ws_' + w.id] = 1; achieve(w.id);
    const good = r.ok != null ? r.ok : r.correct >= Math.ceil(r.total * 0.7);
    const gain = r.ok != null ? (r.ok ? 8 : 4) : 2 + r.correct;
    planAdd(myTeam(), gain); mood(good ? 6 : 2);
    const outro = { ux: good ? _t('Genau so. Ab morgen sind die Buttons 44 Pixel – und niemand sieht mehr 0x60A0.') : _t('Nicht schlecht. Aber bitte: Nutzer sind keine Entwickler. Wir üben das.'), arch: good ? _t('Sauber geschichtet. Der Parser wird stolz auf euch sein, wenn er fertig ist.') : _t('Ein paar Pfeile zeigen nach oben. Das rächt sich im dritten Sprint – ich hab es gesehen.'), roadmap: good ? _t('Das ist eine Roadmap: keine Release vor ihrem Meilenstein, die Demo zuletzt. Ich häng sie ins Büro.') : _t`${r.errors} Punkte liegen vor ihrer Voraussetzung oder zu dicht. So fahren wir gegen die Wand – nochmal im nächsten PI.`, retro: good ? _t('Keep, Stop, Start – und eine Liste, die wir in drei Monaten wieder anschauen. Danke.') : _t('Ein paar Stops waren eigentlich Keeps. Retros sind Übung – nächstes PI wieder.') }[w.id];
    await this.say(w.who, outro);
    await this.say(null, _t`${w.n}: ${r.ok != null ? (r.ok ? _t('alles richtig platziert') : _t`${r.errors} Fehler`) : _t`${r.correct} von ${r.total} richtig`}. Plan +${gain} %.`);
    G.busy--;
  },

  /* ---------- Ziele ---------- */
  objective() {
    const s = G.S.stage, f = G.S.flags, d = today(), h = hourOf(G.S.time);
    switch (s) {
      case 'koffer': return this.isColba() ? _t('Gepäckband 3: Die Schweizer landen – hol sie dort ab') : _t('Gepäckband 3: Hol deinen Koffer vom Band');
      case 'sammeln': { const miss = this.airportGroup().filter((id) => !f.met[id]); return _t`Finde ${listNames(miss)} in der Ankunftshalle (sie winken mit „!“)`; }
      case 'taxi': return _t('Alle da! Zum Ausgang unten – Taxistand');
      case 'hotel': return _t('Finde das Hotel Kramer – Gasse westlich der Plaza del Ayuntamiento');
      case 'checkin': return _t('Check bei Marta an der Rezeption ein');
      case 'zimmer': return _t('Lift in den 4. Stock: Zimmer 412 beziehen, Koffer auspacken');
      case 'bar': return h < 17 ? _t('Freier Nachmittag · 17:00 Treffpunkt Bar Pepita (Plaza de la Virgen)') : _t('Bar Pepita, Plaza de la Virgen: alle treffen');
      default: {
        if (d === 0) return _t('Montagabend: Agua de Valencia · Morgen 9:30 Kickoff bei Colba (Hochhaus im Osten)');
        if (d >= 5) return f.finished ? _t('Heimflug') : _t('Samstag: Taxi zum Flughafen – Heimflug um 10:00');
        const wd = isWorkday();
        if (wd && !f.kickoff) return h < 9 ? _t('Zum Colba-Hochhaus (Osten) – richtige Klingel finden, 1. Stock') : _t('Kickoff 9:30 im Aufenthaltsraum: Robin hält den Business Context');
        if (d === 4 && h >= 14.5 && !f.final) return _t('Freitag 15:00: Final-Präsentation im Aufenthaltsraum (grosser Bildschirm)');
        { const w = this.workshopAt(d, h); if (w) return _t`Jetzt: ${w.n} mit ${fname(w.who)} im Aufenthaltsraum (grosser Bildschirm)`; }
        if (f.final) return _t('Planning abgeschlossen! Geniess Valencia – Samstag 10:00 Heimflug ab Flughafen');
        if (wd && h >= 13 && h < 14.5 && !f['lunch' + d]) return _t`Mittagessen im Aufenthaltsraum: ${LUNCH[d][1]}`;
        if (d === 3 && h >= 15.5 && h < 18.5 && !f.teamRide) return _t('Donnerstag: Team-Ausfahrt mit dem E-Bike – Aitor im E-Bike-Raum neben der Lounge (Office)');
        if (wd && h >= 9 && h < 18) { const p = Math.round(G.S.plan[myTeam()]); return _t`${TEAMS[myTeam()].room}: PI-Plan weiterbringen (${p} %) – Poker, CANopen, ROAM, Board, Abhängigkeiten`; }
        const tips = [];
        if (G.S.money.eur < 15) tips.push(_t('Fast pleite – Bankomat an der Calle Colón'));
        else if (G.S.st.energy < 25) tips.push(_t('Du bist müde – Zimmer 412 im Hotel Kramer'));
        else if (G.S.st.food < 25) tips.push(_t('Hunger! Tapas in der Bar Pepita oder Jamón bei Ramón'));
        else if (d === 2 && h >= 18.5 && h < 23 && !f.asado) tips.push(_t('Mittwochabend: Asado bei Danny – Taxi vor dem Hotel oder an der Estación, „Zu Danny“'));
        else if (h >= 22) tips.push(_t('Nachtleben: Marina Beach Club beim Strand'));
        else if (h < 9) tips.push(_t('Frühstück im Hotel, dann ab ins Office (Klingel!)'));
        else tips.push(pick([_t('Segeltörn im Hafen, Kartbahn im Südwesten, Padel beim Park'), _t('Mercado Central, Museum, Strandfussball'), _t('Weindegustation in der Bodega, Jamón bei Ramón'), _t('Paella-Wettbewerb am Strand, Horchata auf der Plaza')]));
        return _t`${tips[0]} · Fotos ${Object.keys(G.S.photos).length}/${Object.keys(SIGHTS).length}`;
      }
    }
  },
  objectiveTag() {
    const s = G.S.stage;
    if (s !== 'free') return { koffer: _t('GEPÄCK'), sammeln: 'TRUPPE', taxi: 'TAXI', hotel: 'HOTEL', checkin: 'HOTEL', zimmer: 'ZIMMER', bar: 'BAR' }[s];
    const d = today(), f = G.S.flags, h = hourOf(G.S.time);
    if (d >= 5 || f.final) return 'FREI';
    if (isWorkday() && !f.kickoff) return 'KICKOFF';
    if (isWorkday() && h >= 9 && h < 18) return 'PLANNING';
    return 'VALENCIA';
  },
  steps() {
    const f = G.S.flags, tm = myTeam();
    return [
      { t: _t('Montag: Ankunft in Valencia'), d: _t('Koffer, Truppe, Taxi, Hotel Kramer, Zimmer beziehen'), done: this.stageAt('bar') },
      { t: _t('Montagabend: Bar Pepita'), d: _t('Alle treffen – auch Pascal aus Leipzig, Chris aus Fuerte und Juanjo'), done: this.stageAt('free') },
      { t: _t('Dienstag: Colba finden'), d: _t('Hochhaus im Osten, richtige Klingel, 1. Stock'), done: !!f.colbaVisited },
      { t: _t('Kickoff 9:30'), d: _t('Robins Business Context im Aufenthaltsraum'), done: !!f.kickoff },
      { t: _t('PI-Plan Team ') + TEAMS[tm].n.replace(_t('Team '), ''), d: _t('Poker, CANopen-Quiz, ROAM, Programm-Board – mindestens 80 %'), done: G.S.plan[tm] >= 80 },
      { t: _t('Abhängigkeiten klären'), d: _t('Mit den anderen Teams verhandeln (Dependency-Board)'), done: Object.entries(DEPS).filter(([k, d]) => d.from === tm || d.to === tm).every(([k]) => G.S.deps[k]) },
      { t: _t('Mittagessen im Aufenthaltsraum'), d: _t('Di Paella · Mi Burger · Do Bocadillos · Fr Healthy Breakfast'), done: !!(f.lunch1 && f.lunch2 && f.lunch3 && f.lunch4) },
      { t: _t('Workshops im Aufenthaltsraum'), d: _t('Di 16:00 UX (Elena) · Mi 11:00 Architektur (Carlos) · Do 11:00 Roadmap (Chris) · Fr 11:00 PI-Retro (Simon)'), done: !!(f.ws_ux && f.ws_arch && f.ws_roadmap && f.ws_retro) },
      { t: _t('Mittwochabend: Asado bei Danny'), d: _t('Taxi „Zu Danny“ ab 18:30 – Grill, Mojito, Carlos am Bass'), done: !!f.asado },
      { t: _t('Donnerstag: Team-Ausfahrt'), d: _t('Mit Aitor und dem Team durch den Turia-Park'), done: !!f.teamRide },
      { t: _t('Freitag 15:00: Final & Confidence Vote'), d: _t('Alle Teams präsentieren'), done: !!f.final },
      { t: _t('Valencia erleben'), d: _t('Segeln, Kart, Paella, Wein, Museum, Strand, Disco, Padel, Mercado'), done: Object.keys(G.S.ach).length >= 25 },
      { t: _t('Samstag: Heimflug'), d: _t('Taxi zum Flughafen'), done: !!f.finished },
    ];
  },
  mapPois(id) {
    if (id !== 'city') return [];
    const A = '#ff8c1a', S = '#3f9a4b', V = '#1f7fb8', N = '#e85af0', C = '#2a9aa0';
    return [
      { x: 13, y: 30, n: _t('Hotel Kramer'), c: A }, { x: 76, y: 27, n: _t('Colba'), c: C }, { x: 24, y: 17, n: _t('Bar Pepita'), c: A }, { x: 55, y: 20, n: _t('Mercado'), c: V }, { x: 88, y: 18, n: _t('Museum'), c: V },
      { x: 31, y: 17, n: _t('Micalet'), c: V }, { x: 39, y: 20, n: _t('Pl. Virgen'), c: V }, { x: 34, y: 38, n: _t('Rathaus · Brunnen'), c: V }, { x: 55, y: 50, n: _t('Mercado de Colón'), c: V }, { x: 40, y: 10, n: _t('Torres Serranos'), c: V }, { x: 46, y: 3, n: _t('Turia-Park'), c: V },
      { x: 26, y: 49, n: _t('Jamonería'), c: S }, { x: 33, y: 49, n: _t('Bodega'), c: S }, { x: 39, y: 49, n: _t('Souvenirs'), c: S }, { x: 45, y: 49, n: _t('E-Bike-Miete'), c: S }, { x: 63, y: 36, n: _t('Moda'), c: S }, { x: 53, y: 42, n: _t('Super'), c: S }, { x: 65, y: 42, n: _t('Farmacia'), c: S }, { x: 21, y: 50, n: _t('Bankomat'), c: A },
      { x: 10, y: 63, n: _t('Kartbahn'), c: S }, { x: 62, y: 62, n: _t('Padel'), c: S }, { x: 75, y: 62, n: _t('Disco'), c: N }, { x: 36, y: 58, n: _t('Estación'), c: V }, { x: 56, y: 72, n: _t('Ciudad de las Artes'), c: V },
      { x: 90, y: 36, n: _t('Strand'), c: V }, { x: 92, y: 48, n: _t('Strandfussball'), c: S }, { x: 88, y: 60, n: _t('Paella'), c: S }, { x: 89, y: 73, n: _t('Segeln'), c: S }, { x: 86, y: 68, n: _t('Veles e Vents'), c: A },
    ];
  },

  /* ---------- Wo ist wer? ---------- */
  schedule(id) {
    const d = today(), h = hourOf(G.S.time), f = G.S.flags, s = G.S.stage, p = PEOPLE[id];
    if (id === G.S.pid) return null;
    const swiss = SWISS.includes(id), colba = COLBA.includes(id);
    if (f.sick && f.sick[id] === dayOf(G.S.time - 300)) return 'hotel';
    if (d === 0) {
      if (swiss) { if (!this.stageAt('taxi')) return 'airport'; if (!this.stageAt('bar')) return 'hotel'; if (h >= 17 && h < 24) return 'bar'; return 'hotel'; }
      if (id === 'pascal' || id === 'chris') { if (h >= 17 && h < 24) return 'bar'; return h < 17 ? 'travel' : 'hotel'; }
      if (id === 'juanjo') return h >= 17.5 && h < 23.5 ? 'bar' : 'home';
      return 'home';
    }
    if (d >= 5) { if (swiss || id === 'pascal' || id === 'chris') return h < 9 ? 'hotel' : 'airport'; return 'home'; }
    /* Werktage Di–Fr */
    if (h < 1.5 && d >= 1) { if (['luigi', 'chris', 'guillem', 'pablo', 'estella'].includes(id) && d >= 2) return 'disco'; return colba ? 'home' : 'hotel'; }
    if (h < 8) { if (id === 'chris' && h >= 6.5) return 'beach'; return colba ? 'home' : 'hotel'; }
    if (h < 9) { if (id === 'aitor') return 'turia'; if (id === 'isabell') return 'commute'; return colba ? 'commute' : (h < 8.6 ? 'breakfast' : 'commute'); }
    if (h < 9.5 && d === 1 && !f.kickoff) return 'lounge';
    { const w = this.WORKSHOPS[d]; if (w && f.kickoff && !f['ws_' + w.id] && h >= w.h - 0.15 && h < w.h + 1.5 && id !== 'isabell') return 'lounge'; }
    if (d === 1 && !f.kickoff && h >= 9.2 && h < 11) return 'lounge';
    if (h < 13) { if (d === 1 && !f.kickoff) return 'lounge'; if (id === 'dominique' && Math.floor(h * 60) % 60 >= 45) return 'balcony'; if (id === 'isabell') return 'backoffice'; return 'room'; }
    if (h < 14.2) return 'lounge';
    if (h < 18) { if (d === 4 && h >= 14.8) return 'lounge'; if (d === 3 && h >= 15.5 && f.teamRide !== 1 && teamOf(id) === myTeam()) return 'lab'; if (id === 'dominique' && Math.floor(h * 60) % 60 >= 45) return 'balcony'; if (id === 'isabell') return 'backoffice'; if (id === 'robin' && Math.floor(h) % 2 === 1) return 'lost'; return 'room'; }
    if (d === 2 && h >= 18.5 && h < 23.5 && (TRAVELLERS.includes(id) || TEAMS.indurain.members.includes(id) || id === 'carlos' || id === 'juanjo')) return 'bbq';
    if (h < 19.5) { if (id === 'chris' || id === 'vicente') return 'beach'; if (id === 'luigi' && d === 2) return 'kart'; if (id === 'aitor') return 'turia'; return colba ? 'home' : 'hotel'; }
    if (h < 23) { if (['luigi', 'dominique', 'simon', 'robin', 'lukas', 'pascal', 'chris'].includes(id)) return 'bar'; if (['juanjo', 'danny', 'carlos', 'fran'].includes(id)) return 'bar'; if (['estella', 'guillem', 'pablo', 'elena'].includes(id) && h >= 21) return 'bodega'; return 'home'; }
    if (['luigi', 'chris', 'guillem', 'pablo', 'estella', 'vicente'].includes(id)) return 'disco';
    return colba ? 'home' : 'hotel';
  },
  LOC: {
    airport: [_t('in der Ankunftshalle'), 'airport'], hotel: [_t('im Hotel Kramer'), 'city', 13, 30], breakfast: [_t('beim Frühstück im Hotel Kramer'), 'hotel_lobby'], bar: [_t('in der Bar Pepita'), 'bar', 24, 17], jamon: [_t('in der Jamonería Ramón'), 'jamon', 26, 49], bodega: [_t('in der Bodega La Tinaja'), 'bodega', 33, 49], disco: [_t('im Marina Beach Club'), 'disco', 75, 62],
    home: [_t('zuhause (kommt morgen mit Mofa oder Metro)'), null], travel: [_t('noch unterwegs nach Valencia'), null], commute: [_t('auf dem Weg ins Office (Mofa, Metro, Velo)'), 'city', 76, 29], room: [_t('im Teamraum bei Colba'), 'colba'], lounge: [_t('im Aufenthaltsraum bei Colba'), 'colba'], balcony: [_t('auf dem Balkon (raucht)'), 'colba'], backoffice: [_t('am Backoffice-Pult'), 'colba'], lab: [_t('im E-Bike-Raum neben der Lounge'), 'colba'], lost: [_t('irgendwo im Office – sucht den Weg'), 'colba'],
    bbq: [_t('beim Asado in Dannys Garten'), 'danny_house'],
    beach: [_t('am Strand der Malvarrosa'), 'city', 90, 36], turia: [_t('mit dem Velo im Turia-Park'), 'city', 46, 5], kart: [_t('auf der Kartbahn'), 'city', 10, 63],
  },
  whereIs(id) {
    const loc = this.schedule(id);
    const e = this.LOC[loc];
    if (!e) return { t: _t('irgendwo in Valencia'), x: null };
    return { t: e[0], map: e[1], x: e[2] != null ? e[2] : null, y: e[3] };
  },
  isHere(id, mapId) {
    if (id === G.S.pid) return mapId ? G.map.id === mapId : true;
    const loc = this.schedule(id); const e = this.LOC[loc];
    return !!(e && e[1] === mapId);
  },
  /* Leute beim Betreten einer Karte platzieren */
  populate(m) {
    const f = G.S.flags;
    const spots = [];
    const put = (id, tx, ty, dir, o = {}) => { if (id === G.S.pid) return; const a = new Actor(Object.assign({ id, name: PEOPLE[id].name, x: tx * TS + 12, y: ty * TS + 20, dir, look: personLook(id), talk: (n) => Story.talkTo(id, n), solid: true }, o)); G.npcs.push(a); return a; };
    const free = (list, i) => list[i % list.length];
    if (m.id === 'airport') {
      if (!this.stageAt('taxi')) {
        const grp = this.airportGroup();
        const pos = { robin: [30, 12, 0, { bubble: '?', bubbleT: 1e9 }], luigi: [38, 8, 3, { bubble: 'car', bubbleT: 1e9 }], dominique: [33, 21, 0, { bubble: 'cig', bubbleT: 1e9, smokeIdle: false }], lukas: [12, 12, 3, { bubble: 'battery', bubbleT: 1e9 }], simon: [19, 12, 3, { bubble: '!', bubbleT: 1e9 }] };
        for (const id of grp) { const p = pos[id]; const a = put(id, p[0], p[1], p[2], p[3]); if (a && f.met[id]) { a.bubble = null; } }
      } else if (today() >= 5) { ['simon', 'luigi', 'dominique', 'robin', 'lukas', 'pascal', 'chris'].forEach((id, i) => put(id, 4 + i * 2, 16 + (i % 2), 0)); }
      return;
    }
    const who = Object.keys(PEOPLE).filter((id) => id !== G.S.pid);
    const byLoc = {};
    for (const id of who) { const l = this.schedule(id); (byLoc[l] = byLoc[l] || []).push(id); }
    if (m.id === 'city') {
      (byLoc.hotel || []).forEach((id, i) => { if (hourOf(G.S.time) >= 18 && hourOf(G.S.time) < 19.5 && today() >= 1) put(id, 9 + (i % 4) * 2, 32, 0, { wander: { x: 8, y: 31, w: 10, h: 2 } }); });
      (byLoc.beach || []).forEach((id, i) => put(id, 88 + (i % 3) * 2, 36 + i * 3, 0, { wander: { x: 87, y: 33, w: 6, h: 14 } }));
      (byLoc.turia || []).forEach((id, i) => put(id, 40 + i * 6, 5, 2, { bike: true, bikeCol: '#f0a23a', wander: { x: 2, y: 5, w: 96, h: 2 }, speed: 90 }));
      (byLoc.kart || []).forEach((id, i) => put(id, 9 + i, 61, 0));
      (byLoc.commute || []).forEach((id, i) => put(id, 74 + (i % 6), 30 + Math.floor(i / 6), 3, { wander: { x: 72, y: 28, w: 10, h: 4 } }));
      return;
    }
    if (m.id === 'hotel_lobby') { const SEATS = [[14, 10, 0], [15, 10, 0], [7, 5, 0], [8, 5, 0], [16, 5, 0], [17, 5, 0], [18, 11, 2], [20, 11, 1]]; (byLoc.breakfast || []).forEach((id, i) => { const s = SEATS[i % SEATS.length]; put(id, s[0], s[1], s[2], { pose: 'sit', sitIdle: true, drinkIdle: true, keepDir: true }); }); return; }
    if (m.id === 'bar') {
      const seats = [[2, 5, 0], [3, 5, 0], [2, 7, 3], [3, 7, 3], [6, 7, 0], [7, 7, 0], [6, 9, 3], [7, 9, 3], [11, 7, 3], [13, 7, 3], [15, 7, 3], [17, 7, 3], [14, 8, 0], [15, 8, 0], [16, 8, 0], [14, 10, 3], [15, 10, 3], [16, 10, 3]];
      let i = 0; (byLoc.bar || []).forEach((id) => { const s = TRAVELLERS.includes(id) ? seats[i++] : seats[12 + (i++ % 6)]; put(id, s[0], s[1], s[2], { pose: 'sit', drinkIdle: true, sitIdle: true, sortAdd: s[2] === 0 ? 0 : 2 }); });
      return;
    }
    if (m.id === 'jamon') { const seats = [[3, 6, 0], [4, 6, 0], [3, 8, 3], [4, 8, 3], [8, 6, 0], [9, 6, 0], [8, 8, 3], [9, 8, 3], [13, 7, 0], [14, 7, 0], [13, 9, 3], [14, 9, 3]]; (byLoc.jamon || []).forEach((id, i) => { const s = free(seats, i); put(id, s[0], s[1], s[2], { pose: 'sit', drinkIdle: true, sitIdle: true }); }); return; }
    if (m.id === 'bodega') { const seats = [[4, 7, 0], [5, 7, 0], [6, 7, 0], [4, 9, 3], [11, 7, 0], [12, 7, 0]]; (byLoc.bodega || []).forEach((id, i) => { const s = free(seats, i); put(id, s[0], s[1], s[2], { pose: 'sit', drinkIdle: true, sitIdle: true }); }); return; }
    if (m.id === 'disco') { (byLoc.disco || []).forEach((id, i) => put(id, 9 + (i % 5) * 2, 6 + Math.floor(i / 5) * 2, 0, { danceIdle: true, solid: false })); return; }
    if (m.id === 'danny_house') {
      const seats = [[10, 8, 0], [12, 8, 0], [14, 8, 0], [10, 11, 3], [12, 11, 3], [14, 11, 3]];
      let i = 0;
      (byLoc.bbq || []).forEach((id) => {
        if (id === 'danny') { put(id, 18, 8, 3, { bubble: null }); return; }
        if (id === 'carlos') { put(id, 24, 11, 0, { extra: (c, x, y, a) => drawBass(c, x, y, a), bubble: 'note', bubbleT: 1e9 }); return; }
        if (id === 'bea') { put(id, 16, 8, 1, { drinkIdle: true }); return; }
        if (i < seats.length) { const s = seats[i++]; put(id, s[0], s[1], s[2], { pose: 'sit', sitIdle: true, drinkIdle: true, sortAdd: s[2] === 0 ? 0 : 3 }); }
        else put(id, 6 + (i++ % 4) * 3, 14, 0, { wander: { x: 4, y: 13, w: 12, h: 4 }, drinkIdle: true });
      });
      return;
    }
    if (m.id === 'colba') {
      const TR = { indurain: 1, meeseeks: 12, rocket: 23 };
      const roomSeats = (team) => { const x0 = TR[team]; return [[x0 + 2, 5, 0], [x0 + 4, 5, 0], [x0 + 6, 5, 0], [x0 + 2, 8, 3], [x0 + 4, 8, 3], [x0 + 6, 8, 3], [x0 + 8, 6, 1], [x0 + 1, 6, 2]]; };
      const cnt = { indurain: 0, meeseeks: 0, rocket: 0 };
      (byLoc.room || []).forEach((id) => { const tm = teamOf(id) || 'indurain'; const s = free(roomSeats(tm), cnt[tm]++); put(id, s[0], s[1], s[2], { pose: s[2] === 1 || s[2] === 2 ? 'stand' : 'sit', sitIdle: true, sortAdd: s[2] === 0 ? 0 : 3 }); });
      /* Vier Stühle am Tisch, zwei auf dem Sofa; wer steht, steht rechts bei Küche und Automat – die Spalten 35/36 und 41 und die Reihe 9 bleiben frei zum Durchgehen */
      const lseats = [[37, 5, 0], [39, 5, 0], [37, 8, 3], [39, 8, 3], [42, 6, 0], [43, 6, 0], [41, 5, 0], [42, 5, 0], [43, 5, 0], [40, 4, 0], [41, 4, 0], [39, 4, 0], [42, 8, 0], [41, 7, 1], [43, 9, 0], [35, 5, 0], [36, 4, 0]];
      (byLoc.lounge || []).forEach((id, i) => { const s = free(lseats, i); const sit = i < 6; put(id, s[0], s[1], s[2], { pose: sit ? 'sit' : 'stand', drinkIdle: !sit, sitIdle: sit, sortAdd: sit && s[2] === 0 ? 0 : 3 }); });
      (byLoc.balcony || []).forEach((id) => put(id, 45, 18, 3, { smokeIdle: true }));
      (byLoc.backoffice || []).forEach((id) => put(id, 4, 19, 0, { pose: 'sit', sitIdle: true, sortAdd: 2 }));
      const labSpots = [[36, 18], [41, 18], [36, 19], [42, 19], [37, 20], [40, 20], [39, 21], [35, 21]];
      (byLoc.lab || []).forEach((id, i) => { const s = labSpots[i % labSpots.length]; put(id, s[0], s[1], 0, { bubble: 'bike', bubbleT: 1e9 }); });
      (byLoc.lost || []).forEach((id) => put(id, 20 + rint(0, 12), 12, rint(0, 3), { wander: { x: 2, y: 11, w: 43, h: 3 }, bubble: '?', bubbleT: 1e9 }));
      return;
    }
  },
  onEnter(m) {
    const f = G.S.flags;
    if (m.id === 'hotel_lobby' && G.S.stage === 'hotel') this.setStage('checkin');
    if (m.id === 'colba') { if (!f.colbaVisited) { f.colbaVisited = 1; achieve('lift'); } f.lastOffice = G.S.time; this._crowdKey = Object.keys(PEOPLE).map((id) => this.schedule(id)).join(','); }
    if (m.id === 'bar' && G.S.stage === 'bar' && hourOf(G.S.time) >= 17) setTimeout(() => this.barMeet(), 400);
    if (m.id === 'danny_house' && !f.asado) setTimeout(() => this.asadoWelcome(), 400);
    if (m.id === 'city' && f.pendingTaxiArrive) { f.pendingTaxiArrive = 0; }
  },

  /* ---------- Intro & Flughafen ---------- */
  async intro() {
    const me = G.S.pid, p = PEOPLE[me];
    if (this.isColba()) await this.say(null, _t`Du bist ${G.S.name}, ${p.role}. Juanjo hat dich zum Flughafen geschickt: Die Schweizer landen um 12 Uhr, Band 3. Hol sie ab und bring sie ins Hotel Kramer – Juanjo hat für die PI-Woche auch für euch Valencianer Zimmer gebucht, damit nach dem Agua de Valencia niemand Mofa fahren muss.`);
    else if (this.isSwiss()) await this.say(null, _t`Du bist ${G.S.name}, ${p.role}. ${p.intro} Der Flieger aus Zürich ist gelandet: eine Woche PI Planning bei Colba in Valencia. Zuerst: Koffer vom Band 3 holen. Dann die anderen einsammeln – Robin ist zum ersten Mal dabei und steht garantiert am falschen Band.`);
    else if (me === 'pascal') await this.say(null, _t`Du bist Pascal, iOS-Spezialist aus Leipzig. Allein angereist, Rucksack voll Club Mate. Zufall: Die Zürcher sind gerade gelandet – Band 3. Hol deinen Koffer und such die Truppe, dann teilt ihr euch das Taxi ins Hotel Kramer.`);
    else await this.say(null, _t`Du bist Chris, Surfer und Product Manager aus Fuerteventura. Das Brett blieb zuhause, das Wax ist im Koffer. Die Schweizer sind gerade mit dir gelandet – Band 3. Koffer holen, Truppe finden, Taxi ins Hotel Kramer.`);
  },
  async baggage() {
    if (this.isColba() && !G.S.flags.koffer) { G.S.flags.koffer = 1; this.setStage('sammeln'); await this.say(null, _t`Kein Koffer für dich – du bist der Abholservice. Die Schweizer stehen irgendwo in der Halle: ${listNames(this.airportGroup())}. Sie winken mit einem „!“ (oder rauchen, oder schauen Autos an).`); return; }
    if (this.isColba()) { await this.say(null, _t('Band 3 dreht weiter. Deine Gäste warten in der Halle.')); return; }
    if (G.S.flags.koffer) { await this.say(null, _t('Dein Koffer ist schon da. Lukas’ Koffer fährt noch eine Ehrenrunde – er bemerkt es nicht, er liest den Batteriepass-Entwurf.')); return; }
    const res = await Mini.suitcase();
    if (!res) { await this.say(null, _t('Das Band läuft weiter. Dein Koffer kommt schon noch – schau nochmal hin.')); return; }
    if (res.wrong) { await this.say(_t('Robin'), _t('Äh … das ist meiner. Sorry! Erstes Mal dabei, aber den Koffer erkenne ich.')); }
    G.S.flags.koffer = 1; achieve('koffer'); mood(5);
    await this.say(null, _t`Dein Koffer! ${res.wrong ? _t('Beim zweiten Anlauf. ') : ''}Jetzt die Truppe einsammeln: ${listNames(this.airportGroup())}. Sie winken mit einem „!“ (oder rauchen, oder schauen Autos an).`);
    this.setStage('sammeln');
  },
  async carRental() {
    await this.say(_t('Mietwagen-Schalter'), _t('Un Seat León, un Cupra Formentor … Luigi hat den Prospekt schon dreimal gelesen. Ihr fahrt trotzdem Taxi – Simon hat eins bestellt.'));
  },
  async leaveAirport() {
    if (today() >= 5) return true;
    if (!this.stageAt('taxi')) { await this.say(null, this.stageAt('sammeln') ? _t`Ohne die anderen fährst du nicht. Es fehlen: ${listNames(this.airportGroup().filter((id) => !G.S.flags.met[id]))}.` : _t('Erst den Koffer vom Band 3 holen!')); return false; }
    await this.taxiToHotel();
    return false;
  },
  async taxiToHotel() {
    G.busy++;
    await this.say(_t('Taxifahrer Paco'), _t`¿Hotel Kramer? Vale. Fünf Personen und fünf Koffer – das wird eng. Robin, du nimmst den Koffer auf den Schoss.`);
    await Scene.play('taxi', { ms: 3600, text: _t('Vom Flughafen in die Stadt …'), heads: SWISS.filter((id) => id !== G.S.pid).map((id) => getSheet(personLook(id))) });
    passTime(25);
    pay(0);
    await this.say(_t('Taxifahrer Paco'), _t('Die Gasse zum Hotel ist zu eng für das Auto. Ich lass euch an der Plaza del Ayuntamiento raus – das Hotel ist in der Gasse Richtung Westen, zwei Blocks. ¡Buena suerte! Und nehmt einen Schirm mit – im November regnet es hier selten, aber dann richtig.'));
    G.S.flags.pendingTaxiArrive = 1;
    achieve('taxi');
    this.setStage('hotel');
    G.busy--;
    await warpTo('city', { x: 28 * TS + 12, y: 42 * TS + 20, dir: 3 }, { plain: true });
    G.busy++;
    await this.say(null, _t('Valencia! Orangenbäume, Sonne, Böllerrauch. Die anderen schleppen ihre Koffer hinterher – finde das Hotel Kramer in der Gasse westlich der Plaza (vier Sterne am Schild).'));
    G.busy--;
  },
  async taxiCity() {
    const d = today();
    const bbqOk = d === 2 && hourOf(G.S.time) >= 18.5 && this.stageAt('free');
    const opts = [_t('Zum Flughafen (Heimflug)'), _t('Zum Hotel Kramer'), _t('Zum Strand'), _t('Zu Danny (Asado, Vorort)'), _t('Doch nicht')];
    const o = await this.ask(_t('Taxifahrer'), _t`¿A dónde? Flughafen 22 €, Stadt 9 €${bbqOk ? _t(', Vorort 14 €') : ''}.`, opts.map((t, i) => ({ t, disabled: (i === 0 && !(d >= 5 || G.S.flags.final)) || (i === 3 && !bbqOk) })));
    if (o === 4) return;
    if (o === 3) { if (!pay(14)) { await this.say(_t('Taxifahrer'), _t('Sin dinero no hay taxi.')); return; } await Scene.play('taxi', { ms: 2200, text: _t('Raus in den Vorort, zu Danny …') }); passTime(20); enterMap('danny_house', 'entry'); await UI.fadeIn(); return; }
    if (o === 0) { if (!pay(22)) { await this.say(_t('Taxifahrer'), _t('Sin dinero no hay taxi.')); return; } await this.goHome(); return; }
    if (!pay(9)) { await this.say(_t('Taxifahrer'), _t('Sin dinero no hay taxi.')); return; }
    await Scene.play('taxi', { ms: 2000, text: _t('Taxi durch Valencia …') });
    passTime(12);
    if (o === 1) enterMap('city', 'hotel'); else enterMap('city', { x: 86 * TS + 12, y: 36 * TS + 20, dir: 2 });
    await UI.fadeIn();
  },

  /* ---------- Hotel Kramer ---------- */
  async reception() {
    const f = G.S.flags;
    if (G.S.stage === 'checkin') {
      await this.say(_t('Marta'), _t`¡Bienvenidos al Hotel Kramer! Reservierung Colba, ${this.isSwiss() ? _t('fünf') : 'sieben'} Zimmer, vier Nächte. ${G.S.name}: Zimmer 412, vierter Stock. Frühstück 7 bis 10:30. Der Lift ist links – und bitte nicht alle fünf auf einmal, der ist aus den Sechzigern.`);
      await this.say(_t('Robin'), _t('Ich hab Zimmer 414. Wer von euch kennt sich mit diesen Kartenschlössern aus?'));
      f.key = 412; achieve('checkin'); this.setStage('zimmer');
      await this.say(null, _t('Zimmer 412 im 4. Stock: Koffer abstellen, auspacken, durchatmen. Um 17:00 treffen sich alle in der Bar Pepita an der Plaza de la Virgen – auch Pascal, Chris und Juanjo.'));
      return;
    }
    const o = await this.ask(_t('Marta'), _t('Buenos días. Was kann ich für Sie tun?'), [_t('Wo sind die anderen?'), _t('Tipp für den Abend'), _t('Weckruf für 7:30'), _t('Nichts, danke')]);
    if (o === 0) { const ids = TRAVELLERS.filter((id) => id !== G.S.pid); await this.say(_t('Marta'), ids.map((id) => `${fname(id)}: ${this.whereIs(id).t}`).join('. ') + '.'); }
    if (o === 1) await this.say(_t('Marta'), pick([_t('Agua de Valencia in der Bar Pepita – aber nur einen Krug, hören Sie auf mich.'), _t('Buñuelos de calabaza am Stand auf der Plaza – nach Todos los Santos gibt es sie noch die ganze Woche.'), _t('Jamón bei Ramón an der Calle Colón. Bellota, 36 Monate.'), _t('Donnerstag 12 Uhr: das Wassergericht vor der Kathedrale. Das älteste Gericht Europas.'), _t('Der Turia-Park ist neun Kilometer Velo-Paradies. Nehmen Sie ein E-Bike bei Bici Rent.')]));
    if (o === 2) { f.wake = 1; await this.say(_t('Marta'), _t('Notiert. 7:30, mit Zumo.')); }
  },
  async liftGuard() { if (!this.stageAt('zimmer')) { await this.say(_t('Marta'), _t('Erst einchecken, bitte – die Karte öffnet den Lift.')); return false; } return true; },
  async roomDoor(n) {
    if (n !== 412) { const owner = { 410: 'luigi', 411: 'dominique', 413: 'lukas', 414: 'robin', 415: 'pascal' }[n]; await this.say(null, owner ? _t`Zimmer ${n} – ${fname(owner)}s Zimmer. ${this.schedule(owner) === 'hotel' ? _t('Drinnen rumpelt es; er packt noch.') : _t('Niemand da.')}` : _t`Zimmer ${n} ist nicht deins.`); return false; }
    if (!this.stageAt('zimmer')) { await this.say(null, _t('Die Karte fehlt – erst einchecken.')); return false; }
    return true;
  },
  async unpack() {
    if (!G.S.flags.unpacked) {
      G.S.flags.unpacked = 1;
      if (this.isColba()) await this.say(null, _t('Tasche auf: Laptop, Ladegerät, ein Pullover. Juanjo hat gesagt: „Pack für eine Woche Hotel. Teambuilding.“ Das Zimmer hat Meerblick – wenn man sich weit aus dem Fenster lehnt.'));
      else await this.say(null, _t`Koffer auf: Laptop, Post-its, ${G.S.pid === 'lukas' ? _t('der Batteriepass-Entwurf (40 Seiten)') : G.S.pid === 'chris' ? _t('Surf-Wax und Flip-Flops') : G.S.pid === 'luigi' ? _t('eine Zeitschrift über Sportwagen') : G.S.pid === 'dominique' ? _t('zwei Stangen Zigaretten') : _t('Hemden für vier Tage')}. Das Zimmer hat Meerblick – wenn man sich weit aus dem Fenster lehnt.`);
      addInv('badge'); addInv('postits');
      if (G.S.pid === 'dominique') addInv('zigaretten');
      if (G.S.pid === 'chris') addInv('surfwax');
      if (G.S.pid === 'lukas') addInv('batterypass');
      if (G.S.stage === 'zimmer') { this.setStage('bar'); await this.say(null, _t('Erledigt. Der Nachmittag gehört dir: Plaza, Mercado, Strand – oder einfach ein Cortado. Um 17:00: Bar Pepita, Plaza de la Virgen.')); }
      return;
    }
    await this.say(null, _t('Alles ausgepackt. Der Koffer dient jetzt als Nachttisch.'));
  },
  async wardrobe() { G.busy++; await Editor.open({ mode: 'clothes' }); G.busy--; },
  async laptop() {
    const o = await this.ask(null, _t('Der Laptop. Jira, Slack, 43 ungelesene Mails.'), [_t('Jira-Board anschauen'), _t('Mails lesen'), _t('Zuklappen')]);
    if (o === 0) { Phone.open('sprint'); return; }
    if (o === 1) { await this.say(null, pick([_t('Betreff: „Klingel am Hochhaus“ – von Isabel: „Steht NICHT Colba dran. Fragt mich nicht, warum.“'), _t('Betreff: „Mestalla“ – von Juanjo: „Donnerstag 21:00, Valencia spielt. Bar Pepita, Grossleinwand. Pflicht.“'), _t('Betreff: „Battery Pass“ – von Lukas, 12 MB Anhang.'), _t('Betreff: „Kart?“ – von Luigi, kein Text, nur ein Link.')])); mood(1); }
  },
  async bed() {
    const h = hourOf(G.S.time), st = G.S.st;
    const o = await this.ask(null, _t`Das Bett. Es ist ${clockStr()}.`, [{ t: _t('Schlafen bis zum Morgen'), r: h >= 20 || h < 5 ? '' : _t('erst ab 20:00'), disabled: !(h >= 20 || h < 5) }, { t: _t('Kurz hinlegen (90 Minuten)'), r: _t('Energie +') }, _t('Lieber nicht')]);
    if (o === 2) return;
    const was = G.S.time;
    if (o === 1) { await Scene.play('sleep', { ms: 2200, text: _t('Ein Nickerchen …'), nap: true, min: 90 }); passTime(90, { sleep: true, rate: 0.3 }); G.S.lastSleep = G.S.time; await this.say(null, _t`Aufgewacht. ${clockStr()} Uhr. ${st.energy > 60 ? _t('Frisch wie ein Zumo.') : _t('Immer noch etwas müde.')}`); return; }
    const target = (dayOf(G.S.time) + (h >= 20 ? 1 : 0)) * 1440 + (G.S.flags.wake ? 7 * 60 + 30 : 8 * 60 + 5);
    const min = target - G.S.time;
    await Scene.play('sleep', { ms: 3200, text: _t('Buenas noches …'), min });
    passTime(min, { sleep: true });
    G.S.lastSleep = G.S.time; st.energy = Math.max(st.energy, 85);
    if (st.prom > 0.5 || G.S.beers > 6) { st.hang = Math.min(100, 40 + st.prom * 30); st.prom = 0; await this.say(null, _t`${dateLong()}, ${clockStr()}. Der Kopf brummt – Kater. Wasser, Frühstück oder eine Tablette aus der Farmacia helfen.`); }
    else await this.say(null, `${dateLong()}, ${clockStr()}. ${this.morningLine()}`);
    this.newDay();
  },
  morningLine() {
    const d = today();
    return [_t('Heute geht es los: Kickoff um 9:30 bei Colba. Das Hochhaus steht im Osten – und die richtige Klingel findet sich nicht von selbst.'), _t('Burger-Mittwoch. Vorher: Planning.'), _t('Donnerstag: Bocadillos zum Zmittag, Ausfahrt mit dem Team am Nachmittag, abends spielt Valencia – alle in der Bar Pepita.'), _t('Freitag: Healthy Breakfast im Office, um 15:00 die Final-Präsentation. Heute zählt es.'), _t('Samstag: Heimflug um 10:00. Taxi vor dem Hotel.')][d - 1] || _t('Ein neuer Tag in Valencia.');
  },
  newDay() { const f = G.S.flags; f.evN = 0; G.warned = {}; if (today() >= 1 && today() <= 4 && !f['perdiem' + today()]) { f['perdiem' + today()] = 1; addMoney(60); UI.toast(_t('Robin hat Spesen verteilt: +60 €.')); } },
  async shower() {
    if (G.S.flags.lastShower && G.S.time - G.S.flags.lastShower < 240) { await this.say(null, _t('Du bist noch frisch.')); return; }
    await Scene.play('shower', { ms: 2000, text: _t('Duschen …') }); passTime(15); G.S.flags.lastShower = G.S.time; G.S.st.sun = Math.max(0, G.S.st.sun - 20); mood(4); energy(6); G.S.st.wet = 0;
    await this.say(null, _t('Frisch geduscht. Der Wasserdruck im Kramer ist legendär.'));
  },
  async hotelCoffee() { if (!isOpen('breakfast')) { await this.say(null, _t('Die Kaffeemaschine läuft nur zum Frühstück (7–10:30).')); return; } consume('conleche'); await this.say(null, _t('Café con leche aus der Hotelmaschine. Zählt.')); },

  /* ---------- Bar Pepita, Montagabend ---------- */
  async barMeet() {
    if (G.S.stage !== 'bar') return;
    G.busy++;
    const others = TRAVELLERS.filter((id) => id !== G.S.pid);
    await this.say(_t('Pepita'), _t('¡Hola! Ihr seid die Schweizer von Colba? Juanjo hat den Tisch reserviert. Agua de Valencia?'));
    await this.say(_t('Juanjo'), _t`¡Bienvenidos! Schön, dass ihr da seid. Morgen 9:30 im Office, erster Stock. Die Klingel … ach, das erklärt euch Isabel morgen. Pascal ist auch schon da – und Chris kommt gerade vom Strand.`);
    if (G.S.pid !== 'pascal') await this.say(_t('Pascal'), _t('Von Leipzig über Frankfurt, drei Stunden Verspätung, aber: ich bin da. Erste Erkenntnis: Valencia hat mehr Sonne als Sachsen im ganzen Jahr.'));
    if (G.S.pid !== 'chris') await this.say(_t('Chris'), _t('Fuerte war windstill, also hab ich nichts verpasst. Morgen früh um halb sieben am Strand – wer kommt mit?'));
    await this.say(_t('Luigi'), _t('Ich hab die Kartbahn gesehen. Mittwochabend. Keine Diskussion.'));
    await this.say(_t('Dominique'), _t('Ich geh kurz raus, eine rauchen. Bestellt mir einen Krug.'));
    await this.say(_t('Robin'), _t('Also … ich halte morgen den Business Context. 20 Minuten. Ist das hier immer so laut?'));
    consume('agua_val'); achieve('bar'); mood(10);
    for (const id of others) G.S.fprom[id] = 0.3;
    this.setStage('free');
    G.busy--;
    await this.say(null, _t('Erster Krug Agua de Valencia: Cava, Orangensaft, Wodka, Gin. Die Woche kann beginnen. Tipp: nicht zu spät ins Bett – morgen Kickoff.'));
  },
  async barTable() {
    const here = TRAVELLERS.filter((id) => id !== G.S.pid && this.schedule(id) === 'bar');
    if (!here.length) { await this.say(null, _t('Der Stammtisch der POs. Gerade leer – Pepita hat ein „Reservado“-Schild hingestellt.')); return; }
    const o = await this.ask(null, _t`Am Tisch: ${listNames(here)}.`, [_t('Hinsetzen und mittrinken'), _t('Über das Planning reden'), _t('Weitergehen')]);
    if (o === 2) return;
    if (o === 0) { G.player.pose = 'sit'; passTime(30); consume('cana'); mood(4); for (const id of here) G.S.fprom[id] = fprom(id) + 0.15; await this.say(pick(here), pick([_t('Salud! Auf Valencia.'), _t('Noch eine Caña? Die sind klein hier.'), _t('Wusstet ihr, dass Agua de Valencia 1959 im Café Madrid erfunden wurde?'), _t('Morgen früh wieder fit, versprochen.')])); return; }
    await this.say(pick(here), pick([_t`Der Plan von ${TEAMS[myTeam()].n} steht bei ${Math.round(G.S.plan[myTeam()])} %. ${G.S.plan[myTeam()] < 50 ? _t('Da geht noch was.') : _t('Läuft.')}`, _t('Die Abhängigkeiten mit Rocket machen mir Sorgen. Carlos will erst refactoren.'), _t('Fran hat heute 40 CANopen-Indexe aus dem Kopf aufgesagt. Vierzig.'), _t('Robin fragt alle zehn Minuten, was ein Sprint ist. Er lernt schnell.')]));
    planAdd(myTeam(), 1);
  },
  async barTable2() {
    const here = COLBA.filter((id) => id !== G.S.pid && this.schedule(id) === 'bar');
    if (!here.length) { await this.say(null, _t('Der Tisch der Colba-Leute. Leer – die sind bei ihren Familien, oder auf dem Mofa unterwegs.')); return; }
    await this.say(pick(here), pick([_t('Setz dich! Hier redet niemand über Jira.'), _t('¿Una caña? Pepita, otra ronda.'), _t('Donnerstag spielt Valencia. Pepita hängt die Leinwand auf, Juanjo bringt Schals.'), _t('Aitor fährt morgen 60 Kilometer vor der Arbeit. Mit dem Rennvelo. Wir nehmen die Metro.')]));
    mood(3);
  },

  /* ---------- Colba: Klingel, Lift, Office ---------- */
  async bell() {
    const f = G.S.flags;
    if (f.bellOk) { await this.say(null, _t('Du weisst jetzt, welche: „C.B. Soluciones, 1º B“. Die Tür summt.')); await warpTo('colba_entry', 'entry'); return; }
    await this.say(null, _t('Das Klingelbrett. Zwölf Klingeln, alle angeschrieben – und auf keiner steht „Colba“. Isabel hat gesagt, sie steht nicht dran. Welche könnte es sein?'));
    const res = await Mini.bell();
    if (!res) return;
    if (res.ok) { f.bellOk = 1; achieve('klingel'); mood(4); await this.say(_t('Isabel (Gegensprechanlage)'), _t`¡Hola! Ihr habt es gefunden! „C.B.“ – Colba, ganz einfach. Kommt hoch, erster Stock. Lift links oder rechts, die Treppe ist in der Mitte. Der Lift rechts ist langsamer.`); await warpTo('colba_entry', 'entry'); }
    else { mood(-2); await this.say(null, _t('Das war die falsche Klingel. Eine Nachbarin hat dich auf Valencianisch beschimpft. Nochmal versuchen – oder Isabel anrufen (Handy → Team).')); }
  },
  async isabellDesk() {
    if (!this.isHere('isabell', 'colba')) { await this.say(null, _t('Isabels Pult: Agenda, Bestellzettel, ein Teller Mandeln. Sie ist unterwegs – Mittagessen organisieren.')); if (Math.random() < 0.5 && !G.S.flags['mand' + today()]) { G.S.flags['mand' + today()] = 1; consume('almendras'); UI.toast(_t('Eine Handvoll Mandeln genommen.')); } return; }
    await this.talkTo('isabell');
  },
  async kickoff() {
    const f = G.S.flags;
    if (f.kickoff) return;
    G.busy++;
    await UI.announce(_t('Dienstag 9:30'), _t('Kickoff'), _t('Business Context mit Robin'));
    await this.say(_t('Robin'), _t('Guten Morgen zusammen – buenos días. Ich bin Robin, zum ersten Mal dabei, und ich habe 24 Folien. Keine Sorge, ich überspringe die Hälfte. Das nächste halbe Jahr: E-Bike-Apps, die mit dem Bike über CANopen reden. Batteriepass. OTA-Updates. Und ein Händlerportal.'));
    await this.say(_t('Juanjo'), _t('Drei Teams, drei Räume. Indurain: Hardware-Nähe und Diagnose. Meeseeks: Android und iOS. Rocket: Web, Architektur, Batteriepass. Mittags gibt es Paella. Fragen?'));
    await this.say(_t('Fran'), _t('Eine: Welcher Index für den Battery State of Charge? – Ich weiss es. 0x6060. Nur so.'));
    await this.say(_t('Isabel'), _t('Und bitte: die Klingel. Ich schreibe sie trotzdem nicht an. Tradition.'));
    await this.say(_t('Simon'), _t`Agenda steht am Whiteboard. Bis Freitag 15 Uhr braucht jedes Team einen Plan mit mindestens 80 % Commitment – Features geschätzt, Risiken geroamt, Abhängigkeiten geklärt. ${isPO() ? _t('Du bist PO – dein Team schaut auf dich.') : _t('Hilf deinem Team, wo du kannst.')}`);
    f.kickoff = 1; achieve('kickoff'); planAdd(myTeam(), 5);
    G.busy--;
    await this.say(null, _t`Dein Raum: ${TEAMS[myTeam()].room}. Dort: Planning Poker am Tisch, CANopen-Quiz mit Fran (Indurain), ROAM am Flipchart, Programm-Board am Whiteboard, Dependency-Board am Bildschirm. Jede Aktivität bringt den Plan weiter – pro Tag einmal.`);
  },
  async loungeScreen() {
    const f = G.S.flags, d = today(), h = hourOf(G.S.time);
    if (d === 1 && !f.kickoff) { if (h < 9.3) { await this.say(null, _t('Der Bildschirm zeigt Robins Titelfolie: „Business Context – Colba 2026“. Er beginnt um 9:30.')); return; } await this.kickoff(); return; }
    if (d === 4 && h >= 14.5 && !f.final) { await this.finalPresentation(); return; }
    { const w = this.workshopNow(); if (w) { await this.workshop(w); return; } }
    if (!f.kickoff) { await this.say(null, _t('Der Bildschirm zeigt „PI PLANNING“. Der Kickoff ist am Dienstag um 9:30.')); return; }
    await this.say(null, _t`Der grosse Bildschirm: Plan-Stand aller Teams. Indurain ${Math.round(G.S.plan.indurain)} %, Meeseeks ${Math.round(G.S.plan.meeseeks)} %, Rocket ${Math.round(G.S.plan.rocket)} %. ${d === 4 ? _t('Final um 15:00.') : _t('Final am Freitag um 15:00.')}`);
  },
  async loungeTable() {
    const f = G.S.flags, d = today(), h = hourOf(G.S.time);
    if (d === 1 && !f.kickoff && h >= 9.3) { await this.kickoff(); return; }
    if (isWorkday() && LUNCH[d]) {
      const isBreakfast = d === 4;
      const ok = isBreakfast ? (h >= 8.5 && h < 10.5) : (h >= 13 && h < 14.5);
      if (ok) {
        const [item, name, text] = LUNCH[d];
        if (f['lunch' + d]) { await this.say(null, _t`Die ${name} ist aufgegessen. Isabel packt die Reste ein.`); return; }
        const o = await this.ask(_t('Isabel'), _t`${text} Hunger?`, [_t('Zugreifen!'), _t('Später')]);
        if (o === 1) return;
        f['lunch' + d] = 1; consume(item); mood(6); passTime(35);
        achieve(['', 'paella', 'burgerday', 'bocata', 'healthy'][d]);
        await this.say(pick(COLBA.filter((id) => id !== G.S.pid)), pick([_t('¡Qué aproveche!'), _t('Der Socarrat ist das Beste. Der knusprige Reis am Boden.'), _t('Nach dem Essen: Siesta? – Nein, Planning.'), _t('Isabel, du bist die Beste.')]));
        return;
      }
      await this.say(null, isBreakfast ? _t('Healthy Breakfast am Freitag von 8:30 bis 10:30.') : _t`Der grosse Tisch. Mittagessen von 13:00 bis 14:30: ${LUNCH[d][1]}.`);
      return;
    }
    await this.say(null, _t('Der grosse Tisch im Aufenthaltsraum. Hier gibt es Mittagessen, Präsentationen und Diskussionen über den Socarrat.'));
  },
  async coffee() {
    if (G.S.coffees >= 6 && G.S.flags.coffeeDay === today()) { await this.say(null, _t('Sechs Kaffees heute. Vicente schaut besorgt.')); return; }
    if (G.S.flags.coffeeDay !== today()) { G.S.flags.coffeeDay = today(); }
    consume('kaffee'); await this.say(null, pick([_t('Nespresso. George Clooney wäre stolz.'), _t('Kapsel rein, Knopf drücken, warten. Das Beste am Office.'), _t('Fran hat die Maschine auf CANopen umgebaut. Sagt er. Sie macht trotzdem nur Kaffee.')]));
  },
  async fridge() { const o = await this.ask(null, _t('Der Kühlschrank: Wasser, Cola, ein Tupperware mit dem Namen „VICENTE – NICHT ANFASSEN“.'), [_t('Wasser nehmen'), _t('Cola nehmen'), _t('Vicentes Tupperware'), _t('Zu')]); if (o === 0) consume('agua'); if (o === 1) consume('cola'); if (o === 2) { consume('tortilla'); mood(-2); await this.say(_t('Vicente'), _t('… das war meine Tortilla. Ich sag nichts. Aber ich merk es mir.')); } },
  async water() { consume('agua'); await this.say(null, _t('Ein Becher Wasser. Gut gegen Büroluft und gestern Abend.')); },
  async sofa() { G.player.pose = 'sit'; passTime(20); energy(8); mood(2); await this.say(null, _t('Zwanzig Minuten Sofa. Elena nennt es „Designpause“.')); },
  async balcony() {
    const f = G.S.flags;
    if (hasInv('zigaretten')) { takeUse('zigaretten'); G.S.st.nau = Math.max(0, G.S.st.nau - 5); mood(3); passTime(8); for (let k = 0; k < 6; k++) addPart({ x: G.player.x + rnd(-4, 4), y: G.player.y - 30, vy: -8, vx: rnd(-3, 3), life: 1.8, kind: 'smoke' }); }
    else { passTime(5); }
    if (this.isHere('dominique', 'colba') || this.schedule('dominique') === 'balcony') { if (!f.rauchpause) { f.rauchpause = 1; achieve('rauchpause'); } await this.say(_t('Dominique'), pick([_t('Hier entstehen die besten Ideen. Zum Beispiel: Rocket übernimmt das OTA-Update. Carlos weiss es noch nicht.'), _t('Blick auf den Turia-Park. Und auf 14 Kräne. Valencia baut.'), _t('Ich hab Salva das Rauchen abgewöhnt. Er vapt jetzt. Fortschritt.')])); }
    else await this.say(null, hasInv('zigaretten') ? _t('Balkon, Blick auf den Turia-Park. Eine Zigarette später ist die Welt ruhiger.') : _t('Der Balkon. Dominiques Revier – Aschenbecher, Blick auf den Park. Ohne Zigaretten: frische Luft.'));
  },
  async wc() { passTime(5); G.S.st.nau = Math.max(0, G.S.st.nau - 8); await this.say(null, _t('Office-WC. Jemand hat ein Post-it an den Spiegel geklebt: „Definition of Done?“')); },
  async testBench() {
    await this.say(null, _t('Der CANopen-Prüfstand: ein Bike-Controller am Kabel, ein Oszilloskop, ein Laptop mit Frans Index-Tabelle.'));
    if (this.isHere('fran', 'colba')) { await this.canopenQuiz(); return; }
    await this.say(null, _t('Fran ist nicht da. Ohne ihn fasst man den Prüfstand besser nicht an – letztes Mal hat Guillem den Motor rückwärts laufen lassen.'));
  },
  async bikeComputer(n) {
    const f = G.S.flags, d = today();
    const bike = n === 0 ? _t('Bike 1 (rot, Werkstatt-Firmware 2.4)') : _t('Bike 2 (blau, OTA-Kandidat)');
    const fran = this.isHere('fran', 'colba');
    const o = await this.ask(null, _t`Diagnose-PC, per CAN-Kabel am ${bike} angeschlossen. Auf dem Bildschirm laufen die CANopen-Objekte durch.`, [_t('Telemetrie lesen'), _t('Firmware flashen (OTA)'), _t('Fehlerspeicher löschen'), _t('Lassen')]);
    if (o === 3) return;
    passTime(5);
    if (o === 0) {
      const soc = 35 + Math.floor(Math.random() * 60), temp = 24 + Math.floor(Math.random() * 20);
      await this.say(null, _t`0x6060 SOC ${soc} % · 0x6061 Spannung ${(36 + soc * 0.13).toFixed(1)} V · 0x6064 Motortemperatur ${temp} °C · 0x1001 Error-Register 0x00. Alles grün.`);
      if (!f.telemetry) { f.telemetry = 1; achieve('telemetrie'); }
      if (fran) await this.say('fran', pick([_t('Index 0x6060, Subindex 0. Merk dir das – kommt im Quiz.'), _t('Der Ladezustand kommt alle 100 Millisekunden per PDO. Wer das pollt, hat CANopen nicht verstanden.')]));
      return;
    }
    if (o === 1) {
      if (!fran) {
        if (Math.random() < 0.35) { mood(-3); f['brick' + d] = 1; await this.say(null, _t('Blocktransfer … 41 % … Verbindung weg. Das Bike blinkt rot. Bootloader-Modus. Fran wird das morgen reparieren – mit einem Blick, den du nicht vergessen wirst.')); return; }
        await this.say(null, _t('SDO-Blocktransfer, 180 Sekunden, Neustart. Firmware 2.5 läuft. Glück gehabt – Fran hätte dich das nie allein machen lassen.')); mood(3); return;
      }
      await this.say('fran', _t('OTA über CANopen: SDO-Blocktransfer, 1 Kilobyte pro Block, Checksumme am Ende. Schau zu.'));
      await this.say(null, _t('Drei Minuten Fortschrittsbalken. Fran redet derweil über Index-Tabellen. Neustart – Firmware 2.5 läuft. Das ist der Prototyp für die OTA-Story von Rocket.'));
      if (!f['flash' + d]) { f['flash' + d] = 1; planAdd(teamOf('fran') === myTeam() ? myTeam() : 'indurain', 2); mood(3); }
      return;
    }
    await this.say(null, _t('Fehlerspeicher: 3 Einträge (Unterspannung, CAN-Timeout, Drehmomentsensor). Gelöscht.'));
    if (fran) await this.say('fran', _t('Gelöscht?! Die wollte ich zuerst lesen. Der CAN-Timeout war mein Beweis gegen den Lieferanten.')); else await this.say(null, _t('Fran wäre nicht begeistert – er liest Fehlerspeicher wie andere Leute Zeitungen.'));
    mood(-1);
  },
  async officeBikes() {
    const d = today(), h = hourOf(G.S.time);
    if (d === 3 && h >= 15.5 && h < 18.5 && !G.S.flags.teamRide) { await this.teamRide(); return; }
    const o = await this.ask(null, _t('Die Test-E-Bikes von Colba. Akku voll, Display an.'), [_t('E-Bike ausleihen (Stadt)'), _t('Lassen')]);
    if (o === 0) { G.S.flags.battery = 100; G.S.flags.bikeFrom = 'colba'; await this.say(null, _t('Du ziehst das CAN-Kabel ab und schiebst ein Test-Bike durch die Lounge zum Lift. Unten geht die Fahrt los – im Office ist Fahren verboten (Isabel).')); G.S.flags.bikePending = 1; }
  },
  async bikeRental(kind) {
    if (G.player.bike) { await this.say(null, _t('Du sitzt schon auf einem E-Bike.')); return; }
    if (kind === 'colba' && !G.S.flags.bikeOk) { if (!G.S.flags.colbaVisited) { await this.say(null, _t('Colba-E-Bikes. Ohne Badge läuft hier nichts – erst oben vorstellen.')); return; } G.S.flags.bikeOk = 1; }
    const price = kind === 'colba' ? 0 : 12;
    const o = await this.ask(kind === 'colba' ? null : _t('Bici Rent'), kind === 'colba' ? _t('Die Colba-Test-Bikes. Fran hat sie frisch geladen.') : _t`E-Bike-Miete: ${price} € für den Tag, Akku voll, Helm inklusive.`, [{ t: _t('E-Bike nehmen'), r: price ? fmtEur(price) : 'gratis' }, _t('Nein danke')]);
    if (o !== 0) return;
    if (price && !pay(price)) { await this.say(_t('Bici Rent'), _t('Ohne Geld kein Bike.')); return; }
    this.bikeOn(100);
    await this.say(null, _t('Aufgesessen! Mit dem E-Bike bist du doppelt so schnell – bis der Akku leer ist. Radweg im Turia-Park, Promenade am Strand. Mit A absteigen.'));
  },
  bikeOn(bat) { G.player.bike = true; G.player.bikeCol = pick(['#2a9aa0', '#e2554a', '#f0a23a']); G.S.flags.battery = bat; G.S.flags.onBike = 1; achieve('ebike'); Snd.sfx('whirr'); },
  async bikeOff() { G.player.bike = false; G.S.flags.onBike = 0; await this.say(null, _t`Abgestiegen. Akku: ${Math.round(G.S.flags.battery || 0)} %. Das Bike steht jetzt hier – gut, dass Colba genug davon hat.`); },

  /* ---------- Teamraum: Planning ---------- */
  async teamTable(team) {
    const f = G.S.flags, d = today();
    if (!f.kickoff) { await this.say(null, _t('Erst der Kickoff um 9:30 im Aufenthaltsraum.')); return; }
    const mine = team === myTeam();
    const here = TEAMS[team].members.filter((id) => id !== G.S.pid && this.isHere(id, 'colba') && this.schedule(id) === 'room');
    if (!mine) {
      if (!here.length) { await this.say(null, _t`${TEAMS[team].room}. Niemand da.`); return; }
      const o = await this.ask(null, _t`${TEAMS[team].n}: ${listNames(here)} am Tisch.`, [_t('Abhängigkeit verhandeln'), _t('Kurz plaudern'), _t('Weiter')]);
      if (o === 0) { await this.depBoard(team); return; }
      if (o === 1) { await this.talkTo(pick(here)); }
      return;
    }
    const opts = [
      { t: _t('Planning Poker: Features schätzen'), r: f['poker' + d] ? 'heute erledigt' : '+10 %', disabled: !!f['poker' + d] },
      { t: _t('CANopen-Index-Quiz mit Fran'), r: f['can' + d] ? 'heute erledigt' : team === 'indurain' ? '+8 %' : _t('Fran kommt vorbei · +8 %'), disabled: !!f['can' + d] },
      { t: _t('Mit dem Team reden'), r: '+2 %' },
      _t('Weiter'),
    ];
    const o = await this.ask(null, _t`${TEAMS[team].room}. ${here.length ? listNames(here) + _t(' sitzen am Tisch.') : _t('Das Team ist gerade nicht da – die Laptops laufen trotzdem.')} Plan: ${Math.round(G.S.plan[team])} %.`, opts);
    if (o === 0) await this.poker(team);
    if (o === 1) await this.canopenQuiz();
    if (o === 2) { if (!here.length) { await this.say(null, _t('Niemand da zum Reden. Mittagspause? Balkon?')); return; } await this.talkTo(pick(here)); if ((f['talk' + d] || 0) < 4) { f['talk' + d] = (f['talk' + d] || 0) + 1; planAdd(team, 2); } }
  },
  async poker(team) {
    const f = G.S.flags, d = today();
    if (f['poker' + d]) { await this.say(null, _t('Planning Poker für heute erledigt. Morgen gibt es neue Features.')); return; }
    const res = await Mini.poker(team);
    if (!res) return;
    f['poker' + d] = 1;
    const gain = 4 + res.consensus * 2;
    planAdd(team, gain);
    if (res.consensus >= 3) achieve('poker');
    passTime(45);
    await this.say(null, _t`${res.consensus} von ${res.total} Features im Konsens geschätzt. Plan +${gain} %. ${res.consensus === res.total ? _t('Das Team nickt zufrieden.') : _t('Die Ausreisser diskutiert ihr morgen weiter.')}`);
  },
  async canopenQuiz() {
    const f = G.S.flags, d = today();
    if (!f.kickoff) { await this.say(null, _t('Erst der Kickoff.')); return; }
    if (f['can' + d]) { await this.say(_t('Fran'), _t('Heute schon gefragt. Morgen neue Indexe – ich kenne noch 2000 mehr.')); return; }
    await this.say(_t('Fran'), _t('Objektverzeichnis, Objektverzeichnis. Jedes Bike-Signal hat einen Index. Ich frag, du antwortest. Bereit?'));
    const res = await Mini.canopen();
    if (!res) return;
    f['can' + d] = 1;
    const gain = 2 + res.correct * 1.5;
    planAdd(myTeam(), gain);
    if (res.correct === res.total) { achieve('canopen'); if (!hasInv('canref')) { addInv('canref'); await this.say(_t('Fran'), _t('Alle richtig. Hier, mein Spickzettel. Verlier ihn nicht – er ist handgeschrieben.')); } }
    passTime(30);
    await this.say(_t('Fran'), _t`${res.correct} von ${res.total}. ${res.correct === res.total ? _t('¡Perfecto!') : res.correct >= 3 ? _t('Nicht schlecht für einen PO.') : _t('Du brauchst mehr Zeit am Prüfstand.')} Plan +${gain} %.`);
  },
  async roam(team) {
    const f = G.S.flags, d = today();
    if (team !== myTeam()) { await this.say(null, _t`Das Risiko-Flipchart von ${TEAMS[team].n}. ${pick([_t('„Risiko: Carlos refactort alles.“ – Owned.'), _t('„Risiko: Akku-Lieferant.“ – Mitigated.'), _t('„Risiko: Herbstregen.“ – Accepted.')])}`); return; }
    if (!f.kickoff) { await this.say(null, _t('Erst der Kickoff.')); return; }
    if (f['roam' + d]) { await this.say(null, _t('Die Risiken sind heute geroamt. Morgen tauchen neue auf – das ist ihre Natur.')); return; }
    const res = await Mini.roam(team);
    if (!res) return;
    f['roam' + d] = 1;
    const gain = 2 + res.correct * 1.5;
    planAdd(team, gain);
    if (res.correct === res.total) achieve('roam');
    passTime(30);
    await this.say(null, _t`ROAM: ${res.correct} von ${res.total} Risiken sinnvoll eingeordnet (Resolved, Owned, Accepted, Mitigated). Plan +${gain} %.`);
  },
  async teamBoard(team) {
    const f = G.S.flags, d = today();
    if (team !== myTeam()) { await this.say(null, _t`Das Programm-Board von ${TEAMS[team].n}: ${Math.round(G.S.plan[team])} % geplant. Post-its in Teamfarbe, rote Fäden zu den anderen Teams.`); return; }
    if (!f.kickoff) { await this.say(null, _t('Erst der Kickoff um 9:30.')); return; }
    if (f['board' + d]) { await this.say(null, _t('Das Board ist für heute gefüllt. Post-its halten – meistens.')); return; }
    const res = await Mini.board(team);
    if (!res) return;
    f['board' + d] = 1;
    const gain = res.ok ? 10 : 4 + res.filled;
    planAdd(team, gain);
    if (res.ok) achieve('board');
    passTime(40);
    await this.say(null, _t`${res.ok ? _t('Alle sechs Sprints gefüllt, keiner überlastet.') : _t`${res.filled} Sprints sauber, der Rest überlastet oder leer.`} Plan +${gain} %.`);
  },
  async depBoard(team) {
    const f = G.S.flags;
    if (!f.kickoff) { await this.say(null, _t('Erst der Kickoff.')); return; }
    const mine = myTeam();
    const open = Object.entries(DEPS).filter(([k, dep]) => !G.S.deps[k] && ((dep.from === mine && dep.to === team) || (dep.to === mine && dep.from === team) || (team === mine && (dep.from === mine || dep.to === mine))));
    if (team === mine) {
      const list = Object.entries(DEPS).filter(([k, dep]) => dep.from === mine || dep.to === mine);
      await this.say(null, _t`Dependency-Board ${TEAMS[mine].n}: ` + list.map(([k, dep]) => `${dep.t} (${G.S.deps[k] ? _t('geklärt ✓') : _t('offen – mit ') + TEAMS[dep.from === mine ? dep.to : dep.from].n + _t(' verhandeln')})`).join(' · '));
      return;
    }
    if (!open.length) { await this.say(null, _t`Keine offenen Abhängigkeiten mit ${TEAMS[team].n}.`); return; }
    const lead = teamLead(team);
    if (!this.isHere(lead, 'colba')) { await this.say(null, _t`${fname(lead)} ist nicht da (${this.whereIs(lead).t}). Ohne Lead keine Verhandlung.`); return; }
    const [k, dep] = open[0];
    await this.say(lead, _t`${dep.t}? ${dep.d} Wann brauchst du es – beziehungsweise wann liefert ihr?`);
    const res = await Mini.deps(dep, team);
    if (!res) return;
    if (res.ok) { G.S.deps[k] = G.S.time; planAdd(mine, 6); planAdd(team, 3); mood(4); await this.say(lead, pick([_t('Deal. Ich schreib es auf das Board – roter Faden.'), _t('Passt in unseren Sprint. Abgemacht.'), _t('Okay, aber wenn Carlos refactort, verschiebt sich alles um einen Sprint. Nur dass du es weisst.')])); if (Object.entries(DEPS).filter(([kk, dd]) => dd.from === mine || dd.to === mine).every(([kk]) => G.S.deps[kk])) achieve('deps'); }
    else { mood(-2); await this.say(lead, _t('So geht das nicht – der Sprint ist zu früh oder zu spät. Schau dir unsere Kapazität an und komm nochmal.')); }
    passTime(20);
  },
  async teamRide() {
    const f = G.S.flags;
    if (f.teamRide) return;
    const tm = TEAMS[myTeam()];
    await this.say(_t('Aitor'), _t`Ausfahrt! ${tm.n} fährt durch den Turia-Park bis zum Strand. Akku-Management ist Teil des Tests: Wer mit leerem Akku ankommt, trägt das Bike die Treppe hoch.`);
    const riders = ['me'].concat(tm.members.filter((id) => id !== G.S.pid).slice(0, 3), ['aitor'].filter((id) => !tm.members.includes('aitor')));
    const res = await Mini.ride({ riders });
    if (!res) return;
    f.teamRide = 1; achieve('teamride'); planAdd(myTeam(), 4); mood(8); passTime(90);
    await Scene.play('ride', { ms: 2200, text: _t('Zurück ins Office …'), riders, battery: res.battery });
    await this.say(_t('Aitor'), _t`${res.battery > 20 ? _t`Akku ${Math.round(res.battery)} % – sauber gefahren!` : _t('Akku leer. Das Bike trägst du jetzt hoch.')} Und: Nach dem Fahren plant es sich leichter. Das ist wissenschaftlich bewiesen. Von mir.`);
  },
  async finalPresentation() {
    const f = G.S.flags;
    if (f.final) return;
    if (!(today() === 4 && hourOf(G.S.time) >= 14.5)) { await this.say(null, _t('Die Final-Präsentation ist am Freitag um 15:00.')); return; }
    G.busy++;
    await UI.announce(_t('Freitag 15:00'), _t('Final & Confidence Vote'), _t('Alle Teams präsentieren'));
    const plans = Object.entries(TEAMS).map(([k, t]) => `${t.n}: ${Math.round(G.S.plan[k])} %`).join(', ');
    await this.say(_t('Juanjo'), _t`Drei Teams, drei Pläne. ${plans}. Jetzt stellt jedes Team seine Ziele vor – und dann stimmen wir ab, wie sicher wir uns sind: fünf Finger für „läuft“, ein Finger für „vergiss es“.`);
    await this.say(teamLead(myTeam()) === G.S.pid ? _t('Danny') : teamLead(myTeam()), `${TEAMS[myTeam()].n}: ${G.S.plan[myTeam()] >= 80 ? _t('Features geschätzt, Risiken geroamt, Abhängigkeiten sauber. Wir committen.') : G.S.plan[myTeam()] >= 50 ? _t('Der Plan steht zur Hälfte. Wir committen auf die ersten drei Sprints, der Rest ist Forecast.') : _t('Ehrlich gesagt: Wir haben zu wenig geplant. Viel Poker, wenig Board.')}`);
    G.busy--;
    const res = await Mini.confidence(G.S.plan[myTeam()]);
    G.busy++;
    const avg = res ? res.avg : 2.5;
    f.final = 1; f.finalScore = avg;
    if (avg >= 4) achieve('confidence');
    await this.say(_t('Robin'), avg >= 4 ? _t('Durchschnitt über vier! Ich habe keine Ahnung, ob das normal ist, aber Simon sagt, das ist sehr gut. Bar Pepita, ich zahle.') : avg >= 3 ? _t('Drei Komma irgendwas. Solide. Ich habe gelernt, was ein Sprint ist, und ihr habt einen Plan. Prost.') : _t('Hm. Unter drei. Wir reden am Montag nochmal. Trotzdem: danke, Valencia.'));
    await this.say(_t('Isabel'), _t('Und jetzt alle raus: Das Office schliesst, der Samstag ist frei. Heimflug um 10:00 – das Taxi steht um 8:15 vor dem Hotel.'));
    mood(10); G.busy--;
  },

  /* ---------- Asado bei Danny ---------- */
  async asadoWelcome() {
    const f = G.S.flags;
    if (f.asado) return;
    G.busy++;
    await UI.announce(_t('Mittwochabend'), _t('Asado bei Danny'), _t('Garten, Grill, Pool, Bass'));
    await this.say('danny', _t('¡Bienvenidos a mi casa! Das ist der Garten, das ist der Pool, das ist der Grill. Alles andere ist unwichtig. Chorizo ist fast fertig, Pollo braucht noch zwanzig Minuten. Bea hat Ropa Vieja mitgebracht.'));
    await this.say('bea', _t('Zwei Stunden geschmort. Wer es nicht probiert, bekommt morgen keine Code-Reviews.'));
    await this.say('carlos', _t('Und nach dem Essen: ein Solo. Danny hat die Nachbarn gewarnt. Die Nachbarn haben Ohrstöpsel gekauft.'));
    f.asado = 1; achieve('asado'); mood(8);
    G.busy--;
    await this.say(null, _t('Im Garten: Grill (A drücken zum Grillen), Gartentisch mit Mojitos und Ropa Vieja, Carlos’ Verstärker, Pool und Hängematte. Das Gartentor unten bringt dich per Taxi zurück in die Stadt.'));
  },
  async dannyDoor() { await this.say('danny', pick([_t('Drinnen ist nur die Küche – und Beas Topf. Der Garten ist die Party.'), _t('Das Haus habe ich 2019 gekauft. Mit Garten, weil ich in Havanna auf einem Balkon im dritten Stock gegrillt habe. Die Nachbarn fanden das weniger lustig als ich.')])); },
  async grill() {
    const f = G.S.flags;
    const here = this.isHere('danny', 'danny_house') || f.asado;
    if (!here) { await this.say(null, _t('Der Grill ist aus. Danny grillt nur, wenn Gäste da sind.')); return; }
    const o = await this.ask('danny', f.bbq ? _t('Nochmal an die Zange? Der Grill ist für alle da. Oder einfach nur etwas nehmen.') : _t('Grillzange? Chorizo, Pollo und Maiskolben – aber nichts verbrennen lassen. Der Grill ist heiss wie Havanna im August. Wenn alles auf dem Teller ist, essen wir zusammen.'), [{ t: _t('Grillzange übernehmen'), r: _t('Minispiel') }, { t: _t('Nur einen Chorizo nehmen') }, { t: _t('Nur ein Pollo nehmen') }, _t('Später')]);
    if (o === 3) return;
    if (o > 0) { const item = o === 1 ? 'chorizo' : 'pollo'; passTime(10); consume(item); f.grilled = (f.grilled || 0) + 1; await this.say(null, pick([_t`${ITEMS[item].n}. Rauch, Holzkohle, ein Hauch Limette – Danny marinert mit Mojo.`, _t('Vom Grill direkt auf den Teller. Vicente fotografiert sein Essen, Estella isst seines.'), _t('Danny wendet mit der einen Hand und erklärt mit der anderen den Backlog.')])); return; }
    const res = await Mini.bbq();
    if (!res) return;
    passTime(25);
    G.S.rec.bbq = Math.max(G.S.rec.bbq || 0, res.score);
    f.grilled = (f.grilled || 0) + res.served;
    if (res.served >= 6 && res.burnt === 0) achieve('grillmeister');
    const first = !f.bbq; f.bbq = 1;
    await this.say('danny', res.burnt === 0 ? _t`${res.served} Stück auf dem Teller, nichts verbrannt. ¡Qué nivel! In Havanna würden sie dich adoptieren.` : res.burnt <= 2 ? _t`${res.served} auf dem Teller, ${res.burnt} für den Hund. Akzeptabel – der Hund ist auch ein Gast.` : _t`${res.burnt} verbrannt! Der Rauchmelder vom Nachbarn hat angeschlagen. Egal, Bea hat Ropa Vieja.`);
    if (first) await this.bbqDinner(res);
    else { consume(res.items.pollo ? 'pollo' : res.items.chorizo ? 'chorizo' : 'maiz'); }
  },
  /* Nach dem Grillieren: alle setzen sich an den Gartentisch und essen zusammen */
  async bbqDinner(res) {
    const f = G.S.flags;
    G.busy++;
    await this.say('danny', _t('¡A comer! Alle an den Tisch – Teller, Mojo, Limetten. Wer steht, bekommt nichts.'));
    const seats = [[10, 8, 0], [12, 8, 0], [14, 8, 0], [10, 11, 3], [12, 11, 3], [14, 11, 3]];
    const stands = [[9, 9, 2], [9, 10, 2], [16, 10, 1], [11, 12, 3], [13, 12, 3], [15, 12, 3], [8, 9, 2], [17, 9, 1]];
    const npcs = G.npcs.filter((a) => a.id && PEOPLE[a.id]);
    const order = ['danny', 'bea', 'vicente'].concat(npcs.map((a) => a.id).filter((id) => !['danny', 'bea', 'vicente'].includes(id)));
    let si = 0, ki = 0;
    const moves = [];
    for (const id of order) {
      const a = npcs.find((n) => n.id === id); if (!a) continue;
      const seat = si < seats.length ? seats[si++] : stands[ki++ % stands.length];
      a.wander = null; a.danceIdle = false; a.sitIdle = false; a.pose = 'stand'; a.bubble = null;
      moves.push(walk(a, [[seat[0], seat[1]]], 70).then(() => { a.dir = seat[2]; a.pose = si <= seats.length && seats.includes(seat) ? 'sit' : 'stand'; a.sitIdle = a.pose === 'sit'; a.drinkIdle = true; a.sortAdd = seat[2] === 0 ? 0 : 3; }));
    }
    const me = T2P(16, 9); G.player.path = null;
    await Promise.race([Promise.all(moves), sleep(3500)]);
    G.player.x = me.x; G.player.y = me.y; G.player.dir = 1; G.player.pose = 'sit';
    await sleep(400);
    const eat = res.items.pollo ? 'pollo' : res.items.chorizo ? 'chorizo' : 'maiz';
    consume(eat); if (res.items.maiz && eat !== 'maiz') consume('maiz');
    await this.say('bea', _t('Ropa Vieja dazu, Mojo auf alles. Und wer über Sprints redet, spült.'));
    await this.say('vicente', pick([_t('Chorizo vom Grill ist erlaubt. In der Paella nicht. Das ist der ganze Unterschied zwischen Kuba und Valencia.'), _t('Ich fotografiere das. Für die Nachwelt und für Instagram.')]));
    await this.say('danny', pick([_t('Das ist der eigentliche PI-Plan: ein Tisch, alle dran, keiner schaut aufs Handy. Robin, Handy weg.'), _t('In Havanna sagt man: Wer zusammen isst, streitet weniger im Daily. Hab ich mir gerade ausgedacht. Stimmt trotzdem.')]));
    if (this.isHere('robin', 'danny_house')) await this.say('robin', _t('Ich schreibe das in den Business Context. „Teamessen: wirkt.“'));
    passTime(45); mood(10); energy(6);
    for (const a of npcs) if (a.id !== G.S.pid) G.S.fprom[a.id] = fprom(a.id) + 0.15;
    f.bbqDinner = 1; achieve('sobremesa');
    G.player.pose = 'stand';
    G.busy--;
    await this.say(null, _t('Sobremesa: Der Tisch bleibt voll, die Gläser leeren sich, niemand steht auf. Das ist in Spanien der wichtigste Gang.'));
  },
  async gardenTable() {
    const f = G.S.flags;
    if (!f.asado) { await this.say(null, _t('Der Gartentisch: Gläser, Limetten, Hierbabuena. Vorbereitet für den Abend.')); return; }
    const o = await this.ask('bea', _t('Setz dich. Ropa Vieja, Mojito nach Dannys Rezept – oder beides?'), [{ t: _t('Ropa Vieja') }, { t: _t('Mojito cubano') }, { t: _t('Beides') }, _t('Später')]);
    if (o === 3) return;
    G.player.pose = 'sit'; passTime(20);
    if (o === 0 || o === 2) consume('ropavieja');
    if (o === 1 || o === 2) { consume('mojito_c'); if (!f.mojito) { f.mojito = 1; if (f.cubaTalk) achieve('cuba'); else { f.cubaTalk = 1; achieve('cuba'); } } }
    await this.say(o === 0 ? 'bea' : 'danny', o === 0 ? _t('Ropa Vieja heisst „alte Kleider“ – wegen der Fasern. Schmeckt besser, als es heisst.') : pick([_t('Hierbabuena, nicht Minze! Das ist der Unterschied zwischen Havanna und einer Hotelbar.'), _t('Havana Club 3 Años. In der Schweiz zahlt ihr dafür 40 Franken. Hier: 12 Euro. Sag es Robin nicht.')]));
    for (const id of ['danny', 'bea', 'fran', 'estella', 'vicente']) if (id !== G.S.pid) G.S.fprom[id] = fprom(id) + 0.1;
  },
  async bassSolo() {
    const f = G.S.flags;
    if (!this.isHere('carlos', 'danny_house')) { await this.say(null, _t('Ein kleiner Verstärker im Garten. Carlos ist noch nicht da – ohne ihn bleibt er stumm.')); return; }
    if (f.bassOn) { await this.say('carlos', _t('Zugabe? Die Nachbarn … okay, eine noch. Kurz.')); Snd.sfx('brass'); mood(2); return; }
    await this.say('carlos', _t('Okay. Ein Riff aus dem Proberaum. „Null Pointer“ – unser Opener. Danny, Licht aus, Grill an.'));
    f.bassOn = 1; Snd.music('rock'); achieve('bass'); mood(8);
    const c = G.npcs.find((n) => n.id === 'carlos'); if (c) c.danceIdle = true;
    for (const n of G.npcs) if (n.id && n.id !== 'carlos' && n.pose !== 'sit') n.danceIdle = true;
    G.fx.shake = 0.6;
    for (let k = 0; k < 10; k++) addPart({ x: 24 * TS + rnd(-20, 20), y: 10 * TS - rnd(0, 30), vy: -20, life: 1.5, kind: 'note' });
    passTime(15);
    await this.say(null, _t('Zwei Minuten Bass-Solo, Verzerrer auf elf, Dannys Hund flüchtet unter die Hängematte. Robin filmt, Luigi headbangt, Bea lächelt – zum ersten Mal diese Woche sichtbar. Das Fenster vom Nachbarhaus geht auf. Und wieder zu.'));
    await this.say('carlos', _t('Das war der Refrain. Die Strophe spielen wir am Samstag im Proberaum. Ihr seid eingeladen – aber ihr fliegt ja. Nächstes PI.'));
  },
  async pool() { G.player.pose = 'sit'; passTime(15); G.S.st.sun = Math.max(0, G.S.st.sun - 15); mood(4); energy(5); G.S.st.wet = 8; await this.say(null, pick([_t('Füsse im Pool, Mojito in der Hand, der Grill raucht. Planning war gestern.'), _t('Luigi überlegt laut, ob man ein Kart im Pool fahren könnte. Danny sagt Nein. Luigi sagt: Schade.')])); },
  async hammock() { G.player.pose = 'sit'; passTime(25); energy(12); mood(4); await this.say(null, pick([_t('Hängematte zwischen zwei Orangenbäumen. Von hier aus klingt sogar Carlos’ Bass wie Schlafmusik.'), _t('Du schaukelst. Robin fragt, ob das Teambuilding ist. Danny: „Das ist Kuba.“')])); },
  async leaveDanny() {
    const o = await this.ask('danny', _t('Schon los? Das Taxi kommt in fünf Minuten – ich zahle. Chorizo für den Weg?'), [_t('Zurück zum Hotel'), _t('In die Bar Pepita'), _t('Noch bleiben')]);
    if (o === 2) return;
    if (!G.S.flags.asado) G.S.flags.asado = 1;
    addInv('chorizo');
    await Scene.play('taxi', { ms: 2000, text: _t('Zurück in die Stadt …') });
    passTime(20);
    if (o === 0) enterMap('city', 'hotel'); else enterMap('city', 'bar');
    await UI.fadeIn();
  },

  /* ---------- Stadt: Orte & Aktivitäten ---------- */
  async openGuard(k) {
    if (isOpen(k)) return true;
    await this.say(null, _t`Geschlossen. Öffnungszeiten: ${hoursStr(k)}.`);
    return false;
  },
  async photo(id) { addPhoto(id); await this.say(null, `<em>${SIGHTS[id].n}</em> – ${SIGHTS[id].f}`); },
  async fountain() { const o = await this.ask(null, _t('Der Turia-Brunnen: der Flussgott und acht Frauen mit Krügen – die acht Bewässerungskanäle.'), [_t('Münze werfen'), _t('Hände kühlen'), _t('Foto'), _t('Weiter')]); if (o === 0) { if (pay(0.5)) { mood(2); await this.say(null, _t('Plitsch. Wunsch: ein Plan mit 100 %.')); } } if (o === 1) { G.S.st.sun = Math.max(0, G.S.st.sun - 10); mood(2); await this.say(null, _t('Erfrischend. Ein Tourist filmt dich dabei.')); } if (o === 2) await this.photo('virgen'); },
  async tribunal() {
    const d = today(), h = hourOf(G.S.time);
    if (d === 3 && h >= 11.9 && h < 12.6) { if (!G.S.flags.tribunal) { G.S.flags.tribunal = 1; achieve('tribunal'); } await this.say(null, _t('Das Tribunal de las Aguas: acht Männer in schwarzen Kitteln auf Stühlen vor der Puerta de los Apóstoles. Ein Bauer klagt, ein anderer verteidigt sich – auf Valencianisch, mündlich, ohne Akten. Seit über tausend Jahren jeden Donnerstag um zwölf. Das Urteil: 30 Sekunden.')); mood(5); return; }
    await this.say(null, _t('Die Puerta de los Apóstoles. Jeden Donnerstag um 12 Uhr tagt hier das Wassergericht – das älteste Gericht Europas, UNESCO-Kulturerbe.'));
  },
  async atm() { if (G.S.flags.atmDay === today()) { await this.say(null, _t('Der Bankomat kennt dich schon: „Tageslimite erreicht.“')); return; } const o = await this.ask(null, _t('Bankomat. Deine Firmenkarte.'), [_t('100 € abheben'), _t('200 € abheben'), _t('Abbrechen')]); if (o === 2) return; G.S.flags.atmDay = today(); addMoney(o === 0 ? 100 : 200); Snd.sfx('coin'); await this.say(null, _t('Scheine raus. Die Spesenabrechnung macht Isabel.')); },
  async station() { await this.say(null, _t('Estación del Norte, 1917: Orangen aus Keramik, Mosaike, Holzschalter. Der Schalterbeamte: „Zug nach Zürich? Das dauert 17 Stunden. Nehmen Sie das Flugzeug.“')); },
  async kart() {
    if (!await this.openGuard('kart')) return;
    const luigiHere = this.isHere('luigi', 'city') && this.schedule('luigi') === 'kart' && G.S.pid !== 'luigi';
    const o = await this.ask(_t('Nico'), _t`Kart Valencia: 10 Minuten, 22 €. ${luigiHere ? _t('Luigi steht schon mit Helm da und grinst.') : _t('Freie Bahn.')}`, [{ t: luigiHere ? _t('Rennen gegen Luigi') : _t('Zeitfahren'), r: '22 €' }, _t('Zuschauen')]);
    if (o !== 0) return;
    if (!pay(22)) { await this.say(_t('Nico'), _t('Ohne Ticket kein Kart.')); return; }
    achieve('kart');
    const res = await Mini.kart(luigiHere ? 'luigi' : null);
    passTime(25);
    if (!res) return;
    if (res.best && (!G.S.rec.kart || res.best < G.S.rec.kart)) G.S.rec.kart = res.best;
    if (res.win && luigiHere) { achieve('kartsieg'); addInv('pokal'); mood(8); await this.say(_t('Luigi'), _t('Du hast mich geschlagen?! Die Bahn ist kaputt. Das Kart war kaputt. Nochmal! – Nein, okay. Der Pokal ist deiner. Vorerst.')); }
    else if (luigiHere) { mood(3); await this.say(_t('Luigi'), _t`Beste Runde ${res.best.toFixed(1)} Sekunden – aber meine war schneller. Erfahrung, Linie, Bremspunkt. Ich erklär es dir im Taxi.`); if (!G.S.flags.autofan) { G.S.flags.autofan = 1; achieve('autofan'); } }
    else { mood(4); await this.say(_t('Nico'), _t`Beste Runde: ${res.best.toFixed(1)} Sekunden. ${res.best < 20 ? _t('¡Muy bien!') : _t('Die Linie durch die Haarnadel übt man.')}`); }
  },
  async padel() {
    if (!await this.openGuard('padel')) return;
    const opp = pick(['vicente', 'pablo', 'guillem', 'danny'].filter((id) => id !== G.S.pid));
    const o = await this.ask(_t('Sergio'), _t`Padel-Turnier! Doppel mit mir gegen ${fname(opp)} und einen Einheimischen. Schläger inklusive. 8 €.`, [{ t: _t('Spielen'), r: '8 €' }, _t('Später')]);
    if (o !== 0) return;
    if (!pay(8)) { await this.say(_t('Sergio'), _t('Ohne Geld kein Court.')); return; }
    const res = await Mini.padel(opp);
    passTime(40); energy(-10);
    if (!res) return;
    G.S.rec.padel = Math.max(G.S.rec.padel || 0, res.me);
    if (res.win) { achieve('padel'); mood(8); await this.say(fname(opp), _t('Vale, vale, ihr habt gewonnen. Die Wand ist unfair. Revanche am Strand?')); }
    else { mood(2); await this.say(_t('Sergio'), _t`${res.me}:${res.opp}. Beim Padel geht alles über die Wand – das lernt man.`); }
  },
  async bouncer() { if (!isOpen('disco')) { await this.say(_t('Türsteher Manolo'), _t('Ab 23 Uhr. Vorher: Jamón, Bodega, Spaziergang.')); return; } if (G.S.st.prom > 2.2) { await this.say(_t('Türsteher Manolo'), _t('Nein. Heute nicht. Geh ins Hotel, trink Wasser.')); return; } await this.say(_t('Türsteher Manolo'), _t('Pasa, pasa. Keine Fotos vom DJ.')); },
  async lifeguard() { await this.say(_t('Jordi'), pick([_t('Gelbe Flagge heute. Baden ja, Surfen eher nicht.'), _t('Sonnencreme! Ich sehe das Schweizer Rot schon von hier.'), _t('Die Möwen klauen Bocadillos. Ich warne nur.')])); },
  async soccer() {
    const opp = pick(['vicente', 'aitor', 'pablo', 'chris'].filter((id) => id !== G.S.pid));
    const o = await this.ask(null, _t`Strandfussball! ${fname(opp)} steht im Tor. Fünf Schüsse, fünf gehalten – wer gewinnt?`, [_t('Elfmeterschiessen'), _t('Lieber nicht')]);
    if (o !== 0) return;
    const res = await Mini.soccer(opp);
    passTime(30); energy(-8); G.S.st.sun += 5;
    if (!res) return;
    G.S.rec.soccer = Math.max(G.S.rec.soccer || 0, res.me);
    if (res.win) { achieve('fussball'); mood(7); await this.say(fname(opp), _t`${res.me}:${res.opp}. Du hast gewonnen – der Sand hat mich gebremst. Sagt jeder Torwart.`); }
    else { mood(2); await this.say(fname(opp), _t`${res.me}:${res.opp} für mich. Amunt València!`); }
  },
  async paellaContest() {
    if (!await this.openGuard('paella')) return;
    const o = await this.ask(_t('Abuela Carmen'), _t('Paella-Wettbewerb! Zutaten in der richtigen Reihenfolge, rühren im richtigen Moment, Socarrat am Ende. Teilnahme 10 €, der Sieger isst gratis.'), [{ t: _t('Mitkochen'), r: '10 €' }, _t('Zuschauen')]);
    if (o !== 0) return;
    if (!pay(10)) { await this.say(_t('Abuela Carmen'), _t('Sin dinero no hay arroz.')); return; }
    const res = await Mini.paella();
    passTime(60);
    if (!res) return;
    if (res.score >= 80) { achieve('paellachef'); consume('paella'); mood(10); await this.say(_t('Abuela Carmen'), _t`${res.score} Punkte! Socarrat perfekt. Du hast mehr Talent als mein Schwiegersohn. Iss.`); }
    else { mood(2); consume('tapas'); await this.say(_t('Abuela Carmen'), _t`${res.score} Punkte. ${res.score >= 50 ? _t('Essbar. Beim nächsten Mal: Safran NACH dem Wasser.') : _t('Das ist kein Paella, das ist Risotto. Hier, Tapas zum Trost.')}`); }
  },
  async surf() {
    const chris = G.S.pid !== 'chris' && this.schedule('chris') === 'beach';
    const o = await this.ask(null, chris ? _t('Chris paddelt raus. „Komm, die Welle ist klein, aber sie ist da!“') : _t('Das Meer. Im November noch 18 Grad – sagt Chris.'), [chris ? _t('Mit Chris surfen') : _t('Surfen'), _t('Baden gehen'), _t('Füsse ins Wasser'), _t('Lieber nicht')]);
    if (o === 3) return;
    if (o === 2) { G.S.st.sun = Math.max(0, G.S.st.sun - 10); mood(3); await this.say(null, _t('Kalt! Aber gut. Die Zehen leben noch.')); return; }
    if (o === 1) {
      await Scene.play('swim', { ms: 4500, text: _t('Ein Bad im Mittelmeer …'), with: chris ? 'chris' : null });
      passTime(30); G.S.st.wet = 20; energy(-6); mood(8); G.S.st.sun = Math.max(0, G.S.st.sun - 15); achieve('baden');
      await this.say(null, pick([_t('Ein Bad im Mittelmeer im November. Die Einheimischen schauen, als wärst du verrückt. Vielleicht bist du das.'), _t('18 Grad. Nach zwei Minuten ist es herrlich, nach zehn sind die Lippen blau. Raus, Handtuch, Sonne.'), _t('Eine Möwe schaut zu, als wolltest du ihr Bocadillo. Du hast keins. Sie bleibt trotzdem.')]));
      return;
    }
    const res = await Mini.surf(chris);
    if (!res) return;
    passTime(40); G.S.st.wet = 20; energy(-12); mood(res.win ? 12 : 5); G.S.st.sun = Math.max(0, G.S.st.sun - 15);
    G.S.rec.surf = Math.max(G.S.rec.surf || 0, Math.round(res.secs));
    if (res.win) { achieve('surfking'); if (chris) achieve('surf'); }
    if (chris) { await this.say(_t('Chris'), res.win ? _t('Siehst du? Jede Welle ist ein Sprint: Anpaddeln, aufstehen, geniessen, auslaufen. Retrospektive im Wasser.') : _t`${res.falls} Mal gebadet, ${Math.round(res.secs)} Sekunden gestanden. Das ist ein Sprint mit Impediments. Morgen wieder.`); if (res.win && !hasInv('surfwax') && Math.random() < 0.5) { addInv('surfwax'); await this.say(_t('Chris'), _t('Hier, ein Stück Wax. Riecht nach Fuerte.')); } }
    else await this.say(null, res.win ? _t`30 Sekunden auf dem Brett. Jordi applaudiert vom Turm. ${res.falls ? _t`Davor ${res.falls} Mal gebadet, aber wer zählt.` : _t('Ohne einen einzigen Sturz.')}` : _t`${Math.round(res.secs)} Sekunden gestanden, ${res.falls} Mal gebadet. Das Meer hat gewonnen, aber das Handtuch wartet.`);
  },
  async batteryTester() {
    const f = G.S.flags; f.battest = (f.battest || 0) + 1;
    const lines = [_t('Battery Tester: Zyklus 412 von 500, 28 °C, Status „bitte warten“. Lukas sagt, das sei der Normalzustand.'), _t('Display: 97 % Kapazität. Darunter ein Zettel: „Nicht ausstecken! – L.“ Darunter ein zweiter: „Auch nicht zum Laden vom Handy. – L.“'), _t('Der Tester piept einmal. Niemand weiss, was das heisst. Lukas kommt trotzdem angerannt.'), _t('Zyklus 500. Grün. Lukas macht ein Foto, Daniel einen Screenshot vom Foto.')];
    await this.say(null, lines[Math.min(f.battest - 1, lines.length - 1)]);
    if (f.battest >= 4) achieve('battest');
  },
  async abus() {
    const o = await this.ask(null, _t('ABUS-Schloss am Bike-Raum. Key Card oder App?'), [_t('Key Card'), _t('App'), _t('Lassen')]);
    if (o === 2) return;
    if (o === 0) await this.say(null, pick([_t('Karte an den Leser. Piep. Rot. Nochmal. Piep. Grün. Die Tür war gar nicht abgeschlossen.'), _t('Piep. Die Karte ist von Aitor. Die Tür geht trotzdem auf. Sicherheit ist, wenn man sich sicher fühlt.')]));
    else await this.say(null, pick([_t('Bluetooth an, App auf, Update laden, Bike suchen, Schloss suchen, verbinden … Die Tür geht auf. Von innen. Fran.'), _t('Die App sagt „Schloss geöffnet“. Das Schloss sagt nichts. Du drückst die Klinke. Es war das Schloss am Bike, nicht an der Tür.')]));
    mood(2); achieve('abus');
  },
  async beachChill() { if (G.S.st.sun > 60 && !(G.S.flags.creme && G.S.time - G.S.flags.creme < 240)) { await this.say(null, _t('Du bist schon rot. Lieber in den Schatten.')); return; } G.player.pose = 'sit'; passTime(45); energy(10); mood(5); G.S.st.sun += 10; await this.say(null, pick([_t('45 Minuten Liege. Möwen, Wellen, ein Verkäufer mit Mojitos im Eimer.'), _t('Du döst weg. Das Planning ist weit weg. Bis dein Handy vibriert: Isabel fragt nach der Paella-Bestellung.')])); },
  async sail() {
    if (!await this.openGuard('sail')) return;
    const o = await this.ask(_t('Marina'), _t('Segeltörn im Hafen: Du am Ruder, ich am Grosssegel. Durch die Bojen, gegen den Wind, zurück zur Marina. 35 €.'), [{ t: _t('Segel setzen'), r: '35 €' }, _t('Nur schauen')]);
    if (o !== 0) return;
    if (!pay(35)) { await this.say(_t('Marina'), _t('Ohne Geld kein Boot.')); return; }
    await Scene.play('boat', { ms: 2200, text: _t('Leinen los …') });
    const res = await Mini.sail();
    passTime(75); G.S.st.sun += 8;
    if (!res) return;
    G.S.rec.sail = Math.max(G.S.rec.sail || 0, res.buoys);
    if (res.buoys >= res.total) { achieve('segeln'); mood(10); await this.say(_t('Marina'), _t`Alle ${res.total} Bojen gerundet! Du hast das Gefühl für den Wind. America’s Cup, nächstes Jahr.`); }
    else { mood(4); await this.say(_t('Marina'), _t`${res.buoys} von ${res.total} Bojen. Der Wind dreht, das Boot auch. Nochmal?`); }
  },
  async wine() {
    if (!await this.openGuard('bodega')) return;
    const o = await this.ask(_t('Inés'), _t('Degustation: vier Weine aus Utiel-Requena und Alicante, blind. Du sagst, welche Traube. 15 €.'), [{ t: _t('Degustieren'), r: '15 €' }, { t: _t('Nur ein Glas Bobal'), r: '4 €' }, _t('Später')]);
    if (o === 2) return;
    if (o === 1) { if (pay(4)) consume('vino'); return; }
    if (!pay(15)) { await this.say(_t('Inés'), _t('Ohne Geld kein Wein.')); return; }
    const res = await Mini.wine();
    passTime(50);
    if (!res) return;
    for (let k = 0; k < 4; k++) consume('vino', { silent: true });
    checkThresholds();
    if (res.correct === res.total) { achieve('wein'); mood(8); await this.say(_t('Inés'), _t('Alle vier! Bobal, Monastrell, Tempranillo, Garnacha. Du hast eine Nase. Oder Glück. Salud.')); }
    else { mood(3); await this.say(_t('Inés'), _t`${res.correct} von ${res.total}. Der Bobal ist der mit der Kirsche. Merk dir das – er ist der Wein von Valencia.`); }
  },
  async jamonTalk() { await this.say(_t('Ramón'), pick([_t('Bellota heisst: Das Schwein hat Eicheln gefressen. 36 Monate gereift. Hauchdünn geschnitten, sonst ist es Verschwendung.'), _t('Die Schweizer essen Jamón mit Brot. Die Valencianer mit den Fingern. Beides erlaubt.'), _t('Ein Jamón, zwanzig Kilo, zwei Wochen. Wenn man es richtig macht.')])); await this.shop('jamon'); },
  async dj() { await this.say(_t('DJ Álex'), pick([_t('Reggaeton, Techno, ein bisschen Rumba. Was willst du?'), _t('Tanzfläche voll, Bass voll. Lass dich sehen!'), _t('Luigi hat sich „Formula 1 Theme“ gewünscht. Nein.')])); },
  async dance() {
    const res = await Mini.dance();
    passTime(25); energy(-10);
    if (!res) return;
    G.S.rec.dance = Math.max(G.S.rec.dance || 0, res.pct);
    if (res.pct >= 80) { achieve('disco'); mood(10); await this.say(_t('DJ Álex'), _t`${res.pct} %! Die Tanzfläche gehört dir.`); }
    else { mood(4); await this.say(null, _t`${res.pct} % der Beats getroffen. ${res.pct > 50 ? _t('Die Hüfte lockert sich.') : _t('Agua de Valencia hilft nicht beim Rhythmus.')}`); }
  },
  async discoSofa() { G.player.pose = 'sit'; passTime(20); energy(6); await this.say(null, _t('Lounge-Sofa. Der Bass massiert den Rücken.')); },
  async painting(i, n, f) { G.S.flags.paint = G.S.flags.paint || {}; G.S.flags.paint[i] = 1; await this.say(null, `<em>${n}</em> – ${f}`); mood(2); if (Object.keys(G.S.flags.paint).length >= 6) achieve('museum'); },
  async guard() { await this.say(_t('Señor Ferrer'), pick([_t('Kein Blitz, bitte. Und nicht so nah an den Velázquez.'), _t('Das Museum ist das zweitgrösste Spaniens, nach dem Prado. Sagen wir hier gern.'), _t('Sorolla hat am Strand gemalt, wo heute die Chiringuitos stehen.')])); },
  async fishTalk() { await this.say(_t('Toni'), pick([_t('¡Dorada, lubina, sepia! Alles heute Morgen aus dem Golf.'), _t('Du willst Fisch ins Hotel mitnehmen? Marta wird nicht begeistert sein.'), _t('Kauf eine Dorada für Isabel. Sie liebt Fisch. Sagt jedenfalls Vicente.')])); await this.shop('fisch'); },

  /* ---------- Gespräche ---------- */
  async talkTo(id, n) {
    const f = G.S.flags, d = today(), h = hourOf(G.S.time), s = G.S.stage;
    if (id === G.S.pid) { await this.say(null, _t('Das ist dein Platz.')); return; }
    if (G.map.id === 'airport' && s === 'sammeln' && !f.met[id]) { await this.meetAtAirport(id, n); return; }
    if (G.map.id === 'airport' && s === 'koffer') { await this.say(id, _t('Hol erst deinen Koffer – Band 3.')); return; }
    const lines = this.lines(id);
    const o = await this.ask(id, pick(lines.hello), lines.topics.map((t) => t.t).concat([_t('Bis später')]));
    if (o >= lines.topics.length) return;
    await lines.topics[o].f();
  },
  async meetAtAirport(id, n) {
    const f = G.S.flags;
    const L = {
      robin: [_t('Robin'), _t('Ah, da bist du! Ich stehe seit zwanzig Minuten hier und mein Koffer kommt nicht. – Das ist Band 4, Leipzig? Oh. Das erklärt den Mann mit dem Sachsen-Trikot.')],
      luigi: [_t('Luigi'), _t('Schau dir das an: Cupra Formentor, 310 PS, für 89 Euro am Tag. Wir könnten … – Nein? Taxi? Okay. Aber Mittwoch Kartbahn.')],
      dominique: [_t('Dominique'), _t('Man darf hier drin nicht rauchen. Ich hab’s versucht. Der Sicherheitsmann war sehr freundlich und sehr bestimmt. Gehen wir?')],
      lukas: [_t('Lukas'), _t('Mein Koffer ist noch nicht da, aber ich hab den Batteriepass-Entwurf dabei. 40 Seiten. Willst du … später. Verstehe.')],
      simon: [_t('Simon'), _t('Da bist du. Taxi ist bestellt, Hotel bestätigt, Bar für 19 Uhr reserviert. Robin steht am falschen Band – ich geh ihn holen. Nein, du gehst.')],
    }[id];
    await this.say(L[0], L[1]);
    f.met[id] = 1; n.bubble = null; n.bubbleT = 0; mood(2);
    if (id === 'robin') f.robinHelped = (f.robinHelped || 0) + 1;
    if (id === 'lukas') { addInv('batterypass'); UI.toast(_t('Lukas gibt dir den Battery-Pass-Flyer (Tasche).')); }
    const miss = this.airportGroup().filter((x) => !f.met[x]);
    if (!miss.length) { this.setStage('taxi'); await this.say(null, _t('Alle beisammen! Der Ausgang ist unten – dort stehen die Taxis.')); }
    else UI.hud();
  },
  lines(id) {
    const f = G.S.flags, me = G.S.pid, d = today(), h = hourOf(G.S.time), tm = myTeam();
    const plan = Math.round(G.S.plan[tm]);
    const base = { hello: [_t('Hola!')], topics: [] };
    const planTopic = { t: _t('Wie steht der Plan?'), f: async () => { await this.say(id, `${TEAMS[teamOf(id) || tm].n}: ${Math.round(G.S.plan[teamOf(id) || tm])} %. ${plan < 40 ? _t('Da fehlt noch viel – Poker, Board, Risiken.') : plan < 80 ? _t('Auf gutem Weg. Die Abhängigkeiten nicht vergessen.') : _t('Commitment-reif. Freitag wird gut.')}`); } };
    const P = {
      simon: { hello: [_t('Alles im Plan?'), _t('Hast du die Agenda gesehen?'), _t('Reservierung für Donnerstag steht.')], topics: [planTopic, { t: _t('Was steht heute an?'), f: async () => this.say('simon', this.objective()) }, { t: _t('Organisation'), f: async () => this.say('simon', pick([_t('Taxi Samstag 8:15, Flug 10:00. Ich hab es dreimal bestätigt.'), _t('Isabel und ich haben den Mittagsplan: Di Paella, Mi Burger, Do Bocadillos, Fr Healthy.'), _t('Jeder hat seinen Raum. Jeder hat Post-its. Was kann schiefgehen.')])) }] },
      luigi: { hello: [_t('Hast du die Autos hier gesehen?'), _t('Mittwoch: Kartbahn.'), _t('Ein Seat León mit 300 PS …'), _t('Padel heute Abend? Fast wie Tennis.')], topics: [planTopic, { t: _t('Über Autos reden'), f: async () => { await this.say('luigi', pick([_t('Der Taxifahrer hatte einen Toledo. Ein Toledo! Die gibt es seit 2019 nicht mehr.'), _t('Cupra, das ist Seat mit Attitüde. Und Kupferfarbe.'), _t('Wenn ich reich bin: Alpine A110. Leicht, französisch, laut.'), _t('E-Bikes sind auch Autos. Nur ohne Dach. Und ohne Motor. Also, mit kleinem Motor.')])); if (!f.autofan) { f.autofan = 1; achieve('autofan'); } } }, { t: _t('Tennis'), f: async () => this.say('luigi', pick([_t('Zweimal die Woche Tennis, seit zwanzig Jahren. Vorhand wie ein Rennwagen, Rückhand wie ein Anhänger.'), _t('Der Padel-Court beim Park? Padel ist Tennis für Leute, die keine Lust auf Laufen haben. Ich spiele trotzdem mit. Bring deinen Schläger – ach, Sergio hat welche.'), _t('Nadal hat auf Sand gewonnen, ich verliere auf Sand. Hartplatz. Immer Hartplatz.')])) }, { t: _t('Kartbahn?'), f: async () => this.say('luigi', d === 2 && h < 18 ? _t('Heute Abend ab 18 Uhr bin ich dort. Südwesten der Stadt. Bring Mut mit.') : _t('Mittwochabend. Ich bin dort. Du wirst verlieren.')) }] },
      dominique: { hello: [_t('Kommst du mit auf den Balkon?'), _t('Hast du Feuer?'), _t('Rocket ist bereit.'), _t('Boxtraining fällt diese Woche aus. Dafür: Treppe statt Lift.')], topics: [planTopic, { t: _t('Rauchpause?'), f: async () => { if (G.map.id === 'colba') { await this.say('dominique', _t('Balkon, hinten durchs Bike-Lab. Ich geh vor.')); } else await this.say('dominique', _t('Hier? Gern. Aber nur, wenn du eine hast.')); } }, { t: _t('Boxen'), f: async () => this.say('dominique', pick([_t('Dienstag und Donnerstag Boxtraining. Sandsack, Seil, Pratzen. Besser als jede Retrospektive.'), _t('Boxen und Rauchen? Ja, ich weiss. Mein Trainer sagt das auch. Jede Woche.'), _t('Im Ring zählt nur die nächste Runde. Im Sprint auch. Deshalb bin ich PO geworden.')])) }, { t: _t('Team Rocket'), f: async () => this.say('dominique', pick([_t('Carlos refactort, Salva lernt, Aitor löst. Und Lukas erklärt den Batteriepass. Beste Mischung.'), _t('Rocket macht das Händlerportal und die Battery-Pass-API. Und OTA, wenn Indurain liefert.')])) }] },
      robin: { hello: [_t('Sag mal, wo ist nochmal der Aufenthaltsraum?'), _t('Ist das normal, dass alle Post-its kleben?'), _t('Mein erstes PI Planning. Aufregend.')], topics: [{ t: _t('Den Weg zeigen'), f: async () => { f.robinHelped = (f.robinHelped || 0) + 1; mood(2); await this.say('robin', pick([_t('Danke. Ich hatte den Lift rechts genommen – der hält im Zwischengeschoss.'), _t('Ah, der Aufenthaltsraum ist rechts. Ich war im WC. Zweimal.'), _t('Ihr seid alle so geduldig mit mir.')])); if (f.robinHelped >= 3) achieve('robin'); } }, planTopic, { t: _t('Business Context'), f: async () => this.say('robin', f.kickoff ? _t('Meine Folien kamen an, oder? Fran hat gelacht. Ich glaube, es war ein gutes Lachen.') : _t('24 Folien. Ich übe noch. Was heisst nochmal „Commitment“ auf Spanisch?')) }] },
      lukas: { hello: [_t('Wusstest du, dass jede Batterie ab 2027 einen Pass braucht?'), _t('Der Entwurf hat 40 Seiten.'), _t('Grüezi.')], topics: [{ t: _t('Battery Tester'), f: async () => this.say('lukas', pick([_t('Der Battery Tester hat drei Zustände: grün, rot und „bitte warten“. Den dritten sehen wir am meisten.'), _t('Ich habe den Battery Tester getestet. Er hat bestanden. Knapp. Wer testet eigentlich mich?'), _t('Zyklus 412 von 500. Die Batterie hält länger durch als ich. Und sie beschwert sich nicht.'), _t('Der Tester sagt 97 % Kapazität. Die Batterie sagt nichts. Der Batteriepass sagt: bitte dokumentieren.')])) }, planTopic, { t: _t('Battery Pass erklären lassen'), f: async () => { await this.say('lukas', _t('EU-Batterieverordnung: Jede E-Bike-Batterie bekommt einen digitalen Pass. QR-Code drauf, Daten dahinter: Herkunft, Kapazität, CO₂-Fussabdruck, Zustand. Rocket baut die API, Meeseeks zeigt es in der App. Und die Zelle meldet ihren State of Health über CANopen – Index 0x6080, falls Fran fragt.')); if (!f.battery) { f.battery = 1; achieve('battery'); planAdd(tm, 1); } } }, { t: _t('Schweiz vs. Spanien'), f: async () => this.say('lukas', pick([_t('Hier isst man um 14 Uhr Mittag. Mein Magen ist auf Berner Zeit.'), _t('Der Mestalla ist lauter als das Wankdorf. Viel lauter.'), _t('Ich hab Rivella im Koffer. Nur für Notfälle.')])) }] },
      pascal: { hello: [_t('Nu, alles klar?'), _t('SwiftUI ist die Zukunft.'), _t('Club Mate?'), _t('Freitag ist Demo-Tag. Hier: Final-Tag. Auch okay.')], topics: [planTopic, { t: _t('Wie war die Anreise?'), f: async () => { await this.say('pascal', _t('Leipzig – Frankfurt – Valencia. In Frankfurt drei Stunden Verspätung, aber ich hab dabei das Onboarding-Flow neu gebaut. Guillem wird es lieben. Oder hassen. Beides okay.')); if (!f.leipzig) { f.leipzig = 1; achieve('leipzig'); } } }, { t: _t('Fridays for Future'), f: async () => this.say('pascal', pick([_t('Freitags bin ich in Leipzig auf der Demo. Darum: Zug statt Flieger, wenn es geht. Nach Valencia ging es nicht – 17 Stunden, sagt der Schalterbeamte.'), _t('E-Bikes statt Autos, das ist für mich keine Roadmap, das ist der Grund, warum ich hier arbeite. Sag das Luigi nicht zu laut.'), _t('Der Battery Pass ist Klimapolitik in einer JSON-Datei. Lukas versteht mich.')])) }, { t: _t('iOS bei Meeseeks'), f: async () => this.say('pascal', pick([_t('Pablo und Guillem machen die UI, ich die CAN-Bridge. Alles in Swift, alles typsicher.'), _t('Oscar ist der ruhigste Mensch, den ich kenne. Sein Code auch.')])) }] },
      chris: { hello: [_t('Wind kommt auf.'), _t('Morgen früh am Strand?'), _t('Aloha – falsch, hola.')], topics: [planTopic, { t: _t('Fuerteventura?'), f: async () => { await this.say('chris', _t('Fuerte: Wind, Wellen, Wüste. Ich arbeite vom Van aus, Starlink auf dem Dach. Die Roadmap entsteht zwischen zwei Sessions. Hier in Valencia ist die Welle klein, aber das Licht ist besser.')); if (!f.fuerte) { f.fuerte = 1; achieve('fuerte'); } } }, { t: _t('Roadmap'), f: async () => this.say('chris', pick([_t('Die Roadmap ist ein Surfbrett: Richtung klar, Weg flexibel.'), _t('Drei Themen fürs halbe Jahr: Batteriepass, Diagnose, Händlerportal. Alles andere ist Schaum.')])) }] },
      danny: { hello: [_t('¡Oye, asere! Indurain fährt vorne.'), _t('Hola, jefe.'), _t('Wir brauchen den Parser von Carlos.'), _t('Mittwochabend: Asado bei mir im Garten. Keine Ausreden.')], topics: [planTopic, { t: _t('Team Indurain'), f: async () => this.say('danny', pick([_t('Fran kennt die Hardware, Bea das Backend, Vicente die Pipeline, Estella alles andere. Ich halte die Fäden.'), _t('Wir heissen Indurain, weil wir im Tempo bleiben. Fünf Tour-Siege, kein Sprinter.')])) }, { t: _t('Kuba'), f: async () => { await this.say('danny', pick([_t('Havanna, Vedado. Mit 24 nach Valencia – das Licht ist dasselbe, nur der Kaffee ist schlechter. Bea kommt aus Santiago, wir haben uns hier im Büro kennengelernt und auf Spanisch mit kubanischem Akzent gestritten.'), _t('In Kuba lernt man, mit dem zu bauen, was da ist. Ein 57er Chevy läuft mit einem Lada-Motor. Genau so refactoren wir den CAN-Parser.'), _t('Mein Mojito-Rezept: Hierbabuena, nicht Minze. Brauner Zucker, Limette, Havana Club 3 Años, Soda. Mittwoch im Garten zeig ich es euch.')])); if (!f.cubaTalk) f.cubaTalk = 1; } }, { t: _t('Dein Haus'), f: async () => this.say('danny', d < 2 ? _t('Vorort, zwanzig Minuten mit dem Taxi. Garten, Pool, Hängematte und ein Grill, auf den ich stolzer bin als auf jedes Release. Mittwoch ab 19 Uhr seid ihr alle eingeladen – Taxi nehmen, ich zahle den Rückweg.') : d === 2 ? _t('Heute Abend! Taxi vor dem Hotel oder an der Estación: „Zu Danny“. Ich bin ab sieben am Grill.') : _t('Der Grill ist noch warm von gestern. Nächstes Mal bleibt ihr länger.')) }] },
      fran: { hello: [_t('0x6060. Frag nicht, sag es einfach.'), _t('Der Prüfstand läuft.'), _t('CANopen ist ein Objektverzeichnis mit Gefühlen.')], topics: [{ t: _t('Parameter'), f: async () => this.say('fran', pick([_t('Parameter 0x2001, Sub 3: Maximalgeschwindigkeit. Sub 4: die Geschwindigkeit, die der Kunde glaubt.'), _t('Jeder Parameter hat einen Default. Der Default ist falsch. Immer. Darum heisst er Default.'), _t('2000 Parameter. Ich kenne alle. Daniel kennt das Dokument. Zusammen sind wir unschlagbar – getrennt sind wir gefährlich.'), _t('„Kannst du schnell einen Parameter ändern?“ – Schnell: ja. Einen: nie.')])) }, { t: _t('CANopen-Quiz'), f: () => this.canopenQuiz() }, { t: _t('Über Hardware reden'), f: async () => this.say('fran', pick([_t('Der Motorcontroller spricht CANopen mit 250 kBit/s. Mehr braucht ein Bike nicht.'), _t('SDO ist Fragen und Antworten. PDO ist Schreien. Das Bike schreit die Geschwindigkeit, alle zehn Millisekunden.'), _t('Heartbeat 0x1017. Wenn das Bike nicht mehr schlägt, ist es tot. Oder der Stecker ist raus.')])) }] },
      estella: { hello: [_t('¡Hola! Ich hab eine Idee!'), _t('Können wir das heute noch einbauen?'), _t('Ich bin früh da, ich geh spät.')], topics: [planTopic, { t: _t('Deine Idee?'), f: async () => { await this.say('estella', pick([_t('Ein Dashboard, das den Akku als Orange anzeigt. Je leerer, desto weniger Spalten!'), _t('Wir könnten das Diagnose-Tool in einer Woche bauen. Danny sagt drei. Wir treffen uns bei zwei.'), _t('Ich hab gestern bis elf den CAN-Logger umgebaut. Fran hat es gemerkt. Er hat nichts gesagt. Das heisst: gut.')])); planAdd(tm === 'indurain' ? tm : 'indurain', 0.5); } }] },
      bea: { hello: [_t('…hola.'), _t('Der Service läuft.'), _t('Ich hab das Backend gestern migriert. Niemand hat es gemerkt – gut.')], topics: [planTopic, { t: _t('Backend'), f: async () => this.say('bea', pick([_t('Telemetrie rein, Events raus. Postgres, Kafka, ein bisschen Rust.'), _t('Ich rede nicht viel. Mein Code auch nicht. Er funktioniert einfach.')])) }, { t: _t('Kuba'), f: async () => { await this.say('bea', pick([_t('Santiago de Cuba. Dort ist es lauter als hier – ich bin die Ruhige, weil zuhause alle reden. Danny ist aus Havanna, das merkt man: Er redet für zwei.'), _t('Programmieren habe ich in Santiago gelernt, mit einem Rechner, den sich zwanzig Leute geteilt haben. Deshalb schreibe ich kleine Funktionen.'), _t('Mittwoch bringe ich Ropa Vieja mit. Rindfleisch, lange geschmort, mit Paprika. Danny grillt, ich koche. Arbeitsteilung wie im Team.')])); if (!f.cubaTalk) f.cubaTalk = 1; } }] },
      vicente: { hello: [_t('Pipeline grün.'), _t('Hast du meine Tortilla gegessen?'), _t('Deploy ist Freitag. Wie immer. Leider.')], topics: [planTopic, { t: _t('DevOps'), f: async () => this.say('vicente', pick([_t('Kubernetes, ArgoCD, Grafana. Und ein Bash-Skript von 2019, das niemand anfasst.'), _t('Burger-Mittwoch ist mein Werk. Der Foodtruck gehört meinem Cousin.')])) }] },
      juanjo: { hello: [_t('¿Todo bien?'), _t('Colba wächst. Ihr seid Teil davon.'), _t('Android first – aber sag es Pascal nicht.')], topics: [planTopic, { t: _t('Colba'), f: async () => this.say('juanjo', pick([_t('Angefangen mit zwei Leuten und einer Android-App für einen Bike-Händler. Heute dreizehn. Und ihr.'), _t('Das Hochhaus war günstig, weil niemand die Klingel findet. Ich scherze. Halb.')])) }] },
      oscar: { hello: [_t('Hm.'), _t('Die Spezifikation ist unklar.'), _t('Ich hab es getestet. Dreimal.')], topics: [planTopic, { t: _t('Android'), f: async () => this.say('oscar', pick([_t('Kotlin, Compose, Clean Architecture. Keine Kompromisse.'), _t('Ein Bug ist ein Missverständnis zwischen Spezifikation und Realität. Ich kläre es.')])) }] },
      pablo: { hello: [_t('Hola! Meine Schwester hat das Design fertig.'), _t('iOS, Strand, iOS.'), _t('Elena sagt, der Button ist zu klein. Elena hat immer recht.')], topics: [planTopic, { t: _t('Elena & du'), f: async () => this.say('pablo', _t('Geschwister im gleichen Team: Sie designt, ich baue. Beim Mittagessen reden wir über Mama. Beim Code-Review nicht.')) }] },
      guillem: { hello: [_t('Hey! Hast du das neue iOS-Beta gesehen?'), _t('Ich lerne von Pascal. Und von Oscar. Und von YouTube.'), _t('¡Vamos!')], topics: [planTopic, { t: _t('Der Junge im Team'), f: async () => this.say('guillem', pick([_t('Ich bin 23 und hab schon drei Apps im Store. Zwei davon sind gut.'), _t('Pascal zeigt mir SwiftUI-Tricks. Ich zeig ihm, wo man in Valencia tanzen geht.')])) }] },
      elena: { hello: [_t('Hola. Das Design-System ist fast fertig.'), _t('Kannst du das UI anschauen?'), _t('Farben, Abstände, Typografie. Der Rest ist Code.')], topics: [planTopic, { t: _t('Design-System'), f: async () => this.say('elena', pick([_t('Komponenten für alle Apps: Buttons, Karten, der Akku-Ring. Indurain nutzt sie für die Werkstatt-App.'), _t('Ich hab die Teamfarben gewählt: Rot für Indurain, Blau für Meeseeks, Orange für Rocket. Post-its passend.')])) }] },
      carlos: { hello: [_t('Das muss refactort werden.'), _t('Architektur zuerst.'), _t('Wer hat diesen Parser geschrieben? Ah. Ich. 2019.'), _t('Samstag Konzert. Hardrock. Ich bin am Bass.')], topics: [planTopic, { t: _t('Refactoring'), f: async () => this.say('carlos', pick([_t('Der CAN-Parser hat 4000 Zeilen in einer Datei. Nach dem Refactoring: 40 Dateien mit 100 Zeilen. Besser? Ja. Schneller? Wir werden sehen.'), _t('Ein Sprint Refactoring spart drei Sprints Bugs. Das sage ich jedem PO. Dominique hört zu.')])) }, { t: _t('Deine Band'), f: async () => { await this.say('carlos', pick([_t('„Stack Overflow“ – vier Entwickler, ein Proberaum in Benimaclet, Hardrock. Ich spiele Bass, weil der Bass die Architektur ist: Man hört ihn nicht, aber ohne ihn fällt alles zusammen.'), _t('Ein Riff ist auch nur eine Funktion: klein, wiederverwendbar, laut. Unser Drummer refactort nie. Darum spielen wir alles in E.'), _t('Mittwoch bei Danny bringe ich den Bass und den kleinen Verstärker mit. Nach dem Essen gibt es ein Solo. Die Nachbarn kennen es schon.')])); if (!f.bandTalk) { f.bandTalk = 1; mood(2); } } }] },
      salva: { hello: [_t('Kann ich dabei sein?'), _t('Ich hab das Buch über SAFe gelesen. Ganz.'), _t('Erklär mir das nochmal?')], topics: [planTopic, { t: _t('Etwas erklären'), f: async () => { await this.say('salva', pick([_t('Ein PI ist ein halbes Jahr? – Fünf Sprints plus einer für Innovation. Okay. Und das Board? – Alles klar, ich schreib es auf.'), _t('Lukas hat mir den Batteriepass erklärt. Zweimal. Ich glaube, ich kann ihn jetzt bauen.')])); planAdd('rocket', 0.5); mood(2); } }] },
      aitor: { hello: [_t('Heute 60 Kilometer vor der Arbeit.'), _t('Es gibt immer eine Lösung.'), _t('Donnerstag Ausfahrt!')], topics: [{ t: _t('ABUS-Schloss'), f: async () => this.say('aitor', pick([_t('Das ABUS-Schloss geht mit Key Card oder App auf. Die App braucht Bluetooth, Bluetooth braucht Akku, der Akku ist in der Hose von gestern.'), _t('Key Card verloren? Kein Problem, die App. Handy leer? Kein Problem, die Key Card. Beides? Dann gehst du halt zu Fuss. Gesund.'), _t('Ich habe das Schloss per App geöffnet. Dreimal. Beim vierten Mal stand ich vor dem falschen Bike.'), _t('60 Kilometer am Morgen, und vor dem Bike-Raum scheitere ich an einem Piepton.')])) }, planTopic, { t: _t('Ausfahrt'), f: async () => { if (d === 3 && h >= 15.5 && h < 18.5 && !f.teamRide && G.map.id === 'colba') await this.teamRide(); else await this.say('aitor', d === 3 ? _t('Nachmittag ab halb vier, E-Bike-Raum neben der Lounge. Turia-Park bis zum Strand.') : _t('Donnerstagnachmittag fahren wir mit dem ganzen Team. Bis dahin: Turia-Park, jeden Morgen, allein.')); } }, { t: _t('Lösungsorientiert?'), f: async () => this.say('aitor', pick([_t('Jedes Problem ist ein Anstieg. Oben wartet die Abfahrt.'), _t('Rocket hat drei Leute und zehn Features. Lösung: fünf Features. Fertig.')])) }] },
      daniel: { hello: [_t('Hast du das dokumentiert?'), _t('Ich hab einen Bug gefunden. Drei.'), _t('Reproduzierbar?')], topics: [planTopic, { t: _t('3rd Level Support'), f: async () => this.say('daniel', pick([_t('3rd Level Support heisst: Wenn das Ticket bei mir landet, haben es schon zwei Leute nicht verstanden.'), _t('Mein Lieblingsticket: „Bike tut nichts.“ Priorität: hoch. Anhang: keiner. Antwort: Screenshot?'), _t('Third Level: ich, ein Logfile und ein Kaffee. In dieser Reihenfolge. Der Kaffee löst die Hälfte.'), _t('Second Level sagt „reproduzierbar“. Third Level sagt „bei welchem Parameter?“. Fran sagt „0x2001“.')])) }, { t: _t('Testen'), f: async () => { await this.say('daniel', pick([_t('Ich teste alles. Auch die Kaffeemaschine. Sie hat einen Bug: Sie macht zu wenig Kaffee.'), _t('Ein Feature ohne Testfall ist ein Gerücht.'), _t('Guillem sagt „läuft bei mir“. Ich sage: Screenshot, Schritte, erwartetes Ergebnis.')])); if (!f.tester) { f.tester = 1; achieve('tester'); } } }, { t: _t('Dokumentation'), f: async () => this.say('daniel', pick([_t('Alles steht im Wiki. Auch die Klingel. Seite 1, fett.'), _t('Mein Testprotokoll vom Dienstag hat 40 Seiten. Lukas’ Batteriepass hat auch 40. Zufall.'), _t('Wenn es nicht dokumentiert ist, ist es nicht passiert.')])) }] },
      isabell: { hello: [_t('Habt ihr die Klingel gefunden?'), _t('Mittagessen ist bestellt.'), _t('Ich organisiere, ihr plant.')], topics: [{ t: _t('Hilfe anbieten'), f: async () => { if (f['isa' + d]) { await this.say('isabell', _t('Heute ist alles organisiert. Danke!')); return; } f['isa' + d] = 1; passTime(15); mood(3); const n = (f.isaHelp = (f.isaHelp || 0) + 1); await this.say('isabell', pick([_t('Kannst du die Stühle in den Aufenthaltsraum tragen? Danke! Du bist der Erste, der fragt.'), _t('Die Paella-Bestellung: 22 Portionen, zwei Vegetarier, ein Chris, der alles isst. Erledigt.'), _t('Hilf mir mit den Namensschildern – Robin hat seines im Hotel gelassen.')])); if (n >= 2) achieve('isabell'); } }, { t: _t('Die Klingel'), f: async () => this.say('isabell', _t('Sie steht nicht dran. „C.B. Soluciones, 1º B“. Juanjo findet das lustig. Ich nicht. Aber ich lasse es so.')) }, { t: _t('Spesen'), f: async () => this.say('isabell', _t('Quittungen sammeln, Foto schicken, fertig. Nicht wie Luigi, der die Kart-Rechnung als „Teambuilding“ einreicht.')) }] },
    };
    const L = P[id] || base;
    return { hello: L.hello, topics: L.topics };
  },

  /* ---------- Läden ---------- */
  async shop(id) {
    const def = SHOPS[id];
    if (!def) return;
    if (def.venue && !isOpen(def.venue)) { await this.say(null, _t`Geschlossen. Öffnungszeiten: ${hoursStr(def.venue)}.`); return; }
    if (id === 'breakfast' && !isOpen('breakfast')) { await this.say(null, _t('Frühstück gibt es von 7 bis 10:30.')); return; }
    if (id === 'breakfast' && G.S.flags.bf === today()) { await this.say(_t('Marta'), _t('Sie haben heute schon gefrühstückt. Ein Kaffee geht immer.')); consume('conleche'); return; }
    await UI.shop(def);
  },
  async buy(def, item, o = {}) {
    const price = item.price;
    if (!canPay(price)) { UI.toast(_t('Zu wenig Geld.'), 'warn'); return; }
    if (item.special === 'round') {
      if (!pay(price)) return;
      const here = G.npcs.filter((n) => n.id && PEOPLE[n.id]);
      consume('agua_val'); for (const n of here) G.S.fprom[n.id] = fprom(n.id) + 0.3;
      UI.toast(_t`Ein Krug für den Tisch. ${here.length ? listNames(here.map((n) => n.id)) + _t(' prosten dir zu.') : _t('Du trinkst ihn allein. Respekt.')}`); mood(5);
      return;
    }
    if (item.wear) {
      if (!pay(price)) return;
      if (item.unlock) G.S.unlocked[item.unlock] = 1;
      Object.assign(G.S.look, item.wear); G.player.look = G.S.look;
      achieve('shopping'); UI.toast(_t`Angezogen: ${item.n}`); return;
    }
    if (!pay(price)) return;
    const I = ITEMS[item.id];
    if (def.mode === 'take' || o.take || (def.mode === 'eat' && !['drink', 'food', 'med'].includes(I.t))) { addInv(item.id); if (I.t === 'souv') achieve('souvenir'); UI.toast(_t`In die Tasche: ${I.n}`); }
    else { consume(item.id); if (def.title.startsWith(_t('Frühstück'))) G.S.flags.bf = today(); UI.toast(`${I.t === 'food' ? _t('Gegessen') : _t('Getrunken')}: ${I.n}`); }
  },
  async readItem(id) {
    if (id === 'batterypass') await this.say(null, _t('<em>Battery Pass – Kurzfassung (Lukas)</em>: Ab 2027 braucht jede Industrie- und E-Bike-Batterie über 2 kWh einen digitalen Produktpass. QR-Code, Daten zu Herkunft, Kapazität, CO₂ und Zustand. Seite 2 bis 40: Tabellen.'));
    if (id === 'canref') await this.say(null, _t('<em>Frans Spickzettel</em>: 0x1017 Heartbeat · 0x6040 Controlword · 0x6060 Battery SOC · 0x6064 Geschwindigkeit · 0x6070 Motortemperatur · 0x6080 Battery SOH · 0x6090 Assist Level · 0x60A0 Fehlercode.'));
  },

  /* ---------- Minuten-Takt, Tage, Ereignisse ---------- */
  minute() {
    const f = G.S.flags, h = hourOf(G.S.time), d = today(), mn = Math.floor(G.S.time) % 60;
    const hour = Math.floor(h);
    if (hour !== this._lastHour) { this._lastHour = hour; this.hourly(); }
    this.checkAppts(); if (G.busy) return;
    /* Im Office: wenn sich der Stundenplan ändert (Kickoff, Workshop, Final, Ausfahrt), kommen die Leute in den richtigen Raum */
    if (G.map && G.map.id === 'colba') { const key = Object.keys(PEOPLE).map((id) => this.schedule(id)).join(','); if (this._crowdKey && key !== this._crowdKey) { this._crowdKey = key; enterMap('colba', { x: G.player.x, y: G.player.y, dir: G.player.dir }); return; } this._crowdKey = key; }
    /* Montag: wer schon vor 17:00 in der Bar sitzt, bekommt das Treffen trotzdem – die anderen kommen herein */
    if (G.map && G.map.id === 'bar' && G.S.stage === 'bar' && h >= 17 && !G.busy && !f.barMeetWait) { f.barMeetWait = 1; (async () => { await UI.card(_t('17:00 – die Tür geht auf, die anderen kommen herein.'), 1400); if (G.map.id === 'bar' && G.S.stage === 'bar') enterMap('bar', { x: G.player.x, y: G.player.y, dir: G.player.dir }); })(); }
    /* Fremde Teams planen selbst; das eigene Team ohne PO-Spieler auch ein bisschen */
    if (isWorkday() && h >= 9.5 && h < 17.5 && f.kickoff) {
      for (const k of Object.keys(TEAMS)) { if (k === myTeam()) { if (!isPO()) planAdd(k, 1.6 / 60); } else planAdd(k, 2.6 / 60); }
    }
    if (G.S.stage === 'bar' && h >= 17 && h < 17.02 && G.map.id !== 'bar') UI.toast(_t('17:00 – die anderen sind in der Bar Pepita (Plaza de la Virgen).'));
    if (isWorkday() && h >= 9.25 && h < 9.27 && !f.kickoff && d === 1) UI.toast(_t('9:15 – Kickoff in 15 Minuten im Aufenthaltsraum bei Colba!'), 'warn');
    if (isWorkday() && h >= 12.9 && h < 12.92 && LUNCH[d] && d !== 4) UI.toast(_t`Gleich Mittag: ${LUNCH[d][1]} im Aufenthaltsraum.`);
    if (d === 4 && h >= 14.4 && h < 14.42 && !f.final) UI.toast(_t('Final-Präsentation um 15:00 im Aufenthaltsraum!'), 'warn');
    { const w = this.WORKSHOPS[d]; if (isWorkday() && w && f.kickoff && !f['ws_' + w.id] && h >= w.h - 0.25 && h < w.h - 0.23) UI.toast(_t`Gleich: ${w.n} mit ${fname(w.who)} im Aufenthaltsraum.`, 'warn'); }
    if (d === 5 && h >= 10 && !f.finished) this.goHome(true);
    if (G.S.flags.bikePending && G.map.id === 'city') { G.S.flags.bikePending = 0; this.bikeOn(100); }
    if (f.onBike && G.player && !G.player.bike && G.map.id === 'city' && !G.map.indoor) { /* nach Kartenwechsel wieder aufs Bike */ G.player.bike = true; }
    this.maybeEvent();
  },
  hourly() {
    const h = Math.floor(hourOf(G.S.time));
    if (G.map.id === 'city') { for (const n of G.npcs.slice()) if (n.id && PEOPLE[n.id] && !this.isHere(n.id, 'city')) dropActor(n); }
  },
  /* Zufällige und feste Ereignisse in Valencia */
  maybeEvent() {
    const f = G.S.flags, h = hourOf(G.S.time), d = today();
    if (G.busy || G.live || G.mode !== 'play' || !this.stageAt('free')) return;
    const m = G.map.id;
    /* Festes Ereignis: Donnerstag 21:00 Valencia-Spiel in der Bar Pepita */
    if (m === 'bar' && d === 3 && h >= 21 && h < 23.5 && !f.matchDone) { f.matchDone = 1; this.ev_mestalla(); return; }
    if (m === 'colba' && h >= 9 && h < 18 && isWorkday() && Math.random() < 0.004 && this.schedule('robin') === 'lost' && G.S.pid !== 'robin' && (f.lastEv || 0) + 90 < G.S.time) { f.lastEv = G.S.time; this.ev_robin(); return; }
    if (m !== 'city') return;
    if ((f.lastEv || 0) + 150 > G.S.time) return;
    if (Math.random() > 0.012) return;
    const pool = this.EVENTS.filter((e) => (!e.cond || e.cond()) && (f.evSeen || {})[e.id] !== d);
    if (!pool.length) return;
    const e = pick(pool);
    f.lastEv = G.S.time; f.evSeen = f.evSeen || {}; f.evSeen[e.id] = d;
    this['ev_' + e.id]();
  },

  /* ---------- Körper ---------- */
  async vomit() {
    G.busy++;
    const st = G.S.st;
    Snd.sfx('vomit');
    G.player.pose = 'bend';
    for (let k = 0; k < 14; k++) addPart({ x: G.player.x + rnd(-6, 6), y: G.player.y - 10, vx: rnd(-20, 20), vy: rnd(-30, 10), g: 90, life: 0.8, kind: 'vomit', s: 3 });
    G.S.vomitSpots.push({ map: G.map.id, x: G.player.x + DIRV[G.player.dir][0] * 14, y: G.player.y + 4, t: G.S.time });
    await sleep(900);
    st.nau = 25; st.prom = Math.max(0, st.prom - 0.5); st.food = Math.max(0, st.food - 40); mood(-12);
    achieve('kotzen');
    G.player.pose = 'stand';
    await this.say(null, pick([_t('Das war zu viel Agua de Valencia. Oder zu wenig Paella.'), _t('Ein Passant: „¡Madre mía!“ Du: „Lo siento.“'), _t('Der Boden hat jetzt eine Erinnerung an dich.')]));
    G.busy--;
  },
  async blackout() {
    G.busy++;
    await UI.fadeOut(_t('Filmriss …'));
    await sleep(1500);
    G.S.st.prom = 0.4; G.S.st.nau = 20; G.S.st.energy = 35; G.S.st.hang = 80; mood(-15);
    addMoney(-30);
    G.S.flags.sick = G.S.flags.sick || {};
    achieve('filmriss');
    const target = (dayOf(G.S.time) + 1) * 1440 + 9 * 60 + 20;
    G.S.time = target; G.S.lastSleep = G.S.time - 400;
    enterMap('hotel_room', 'entry');
    await UI.fadeIn();
    await this.say(null, _t`${dateLong()}, ${clockStr()}. Du wachst im Zimmer 412 auf, in Kleidern. Das Portemonnaie ist 30 € leichter, das Handy zeigt ein Foto von dir mit einer Riesen-Paella-Pfanne. Kater. ${isWorkday() ? _t('Und du bist spät dran fürs Planning.') : ''}`);
    this.newDay();
    G.busy--;
  },
  async tiredWarning() { G.warned.tiredCrit = 1; UI.toast(_t('Du kannst kaum noch die Augen offen halten – ins Hotel, schnell.'), 'warn'); },
  async collapse() {
    G.busy++;
    await UI.fadeOut(_t('Zzz …'));
    await sleep(1200);
    const hh = hourOf(G.S.time);
    G.S.st.energy = 60; mood(-8);
    passTime(180, { sleep: true });
    G.S.lastSleep = G.S.time;
    if (G.map.id !== 'hotel_room') { enterMap('hotel_room', 'entry'); await UI.fadeIn(); await this.say(null, _t`Du bist auf einer Bank eingeschlafen. ${pick([_t('Ein Polizist'), _t('Aitor'), _t('Eine Marathonläuferin')])} hat dich ins Hotel gebracht. Es ist ${clockStr()}.`); }
    else { await UI.fadeIn(); await this.say(null, _t('Eingeschlafen, in Kleidern, mit Laptop. Drei Stunden später.')); }
    G.busy--;
  },

  /* ---------- Ende ---------- */
  async goHome(auto) {
    const f = G.S.flags;
    if (f.finished) return;
    G.busy++;
    const colba = this.isColba();
    if (auto) { await UI.fadeOut(''); await sleep(500); }
    await Scene.play('taxi', { ms: 2600, text: colba ? _t('Samstag, 8:15 – die Schweizer zum Flughafen bringen …') : _t('Samstag, 10:00 – zum Flughafen …'), heads: TRAVELLERS.filter((id) => id !== G.S.pid).slice(0, 4).map((id) => getSheet(personLook(id))) });
    if (!colba) await Scene.play('flight', { ms: 2800, text: _t('VLC → ZRH') });
    f.finished = 1; G.S.finished = 1; achieve('heimflug');
    Track.event('ende', colba ? 'Verabschiedung am Flughafen' : 'Heimflug', true);
    saveGame(true);
    G.busy--;
    Ending.show();
  },
};
const Ending = {
  show() {
    const f = G.S.flags, tm = myTeam();
    const achN = Object.keys(G.S.ach).length, achT = Object.keys(ACH).length;
    const deps = Object.entries(DEPS).filter(([k, d]) => d.from === tm || d.to === tm);
    const depOk = deps.filter(([k]) => G.S.deps[k]).length;
    const score = Math.round(G.S.plan[tm] * 0.6 + (f.finalScore || 0) * 8 + achN * 0.5);
    const grade = score >= 90 ? _t('Legendär – Juanjo will dich einstellen.') : score >= 70 ? _t('Stark – ein Plan, auf den man committen kann.') : score >= 50 ? _t('Okay – das halbe Jahr wird spannend.') : _t('Naja – aber Valencia war schön.');
    const farewell = Story.isColba() ? _t`${G.S.name} winkt den Schweizern nach ${dayOf(G.S.time) + 1} Tagen am Flughafen nach.` : _t`${G.S.name} fliegt nach ${dayOf(G.S.time) + 1} Tagen zurück.`;
    const html = _t`<div class="panel"><div class="panel-head"><h2>Heimflug · Bilanz</h2></div><div class="panel-body">
      <p class="note">${farewell} ${grade}</p>
      <div class="statgrid"><div class="stat"><small>PI-Plan ${TEAMS[tm].n}</small><b>${Math.round(G.S.plan[tm])} %</b></div><div class="stat"><small>Confidence Vote</small><b>${f.finalScore ? f.finalScore.toFixed(1) : '–'}</b></div>
      <div class="stat"><small>Abhängigkeiten</small><b>${depOk}/${deps.length}</b></div><div class="stat"><small>Erlebnisse</small><b>${achN}/${achT}</b></div>
      <div class="stat"><small>Fotos</small><b>${Object.keys(G.S.photos).length}/${Object.keys(SIGHTS).length}</b></div><div class="stat"><small>Biere</small><b>${G.S.beers}</b></div>
      <div class="stat"><small>Kaffees</small><b>${G.S.coffees}</b></div><div class="stat"><small>Geld übrig</small><b>${fmtEur(G.S.money.eur)}</b></div></div>
      <p class="note">Indurain ${Math.round(G.S.plan.indurain)} % · Meeseeks ${Math.round(G.S.plan.meeseeks)} % · Rocket ${Math.round(G.S.plan.rocket)} %</p>
      </div><div class="panel-foot"><span>Gesamtpunkte: ${score}</span><button class="btn primary" id="endNew">Neues Spiel</button></div></div>`;
    const o = UI.overlay(html, null);
    o.querySelector('#endNew').addEventListener('click', () => { clearSave(); location.reload(); });
    G.mode = 'over';
  },
};
