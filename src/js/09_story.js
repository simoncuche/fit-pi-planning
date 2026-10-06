/* ============ Story: Ablauf, Orte, Dialoge ============ */
const STAGES = ['koffer', 'sammeln', 'taxi', 'hotel', 'checkin', 'zimmer', 'bar', 'free'];
const OPEN = { bar: [11, 26], jamon: [12, 24], bodega: [17, 24], disco: [23, 30], museum: [10, 20], mercado: [7.5, 15], kart: [10, 22], padel: [9, 22], sail: [10, 18], moda: [10, 21], super: [9, 21.5], farmacia: [9, 20.5], estanco: [8, 22], souvenir: [10, 22], rent: [9, 20], horchata: [9, 22], churros: [8, 23], chiringuito: [10, 24], veles: [11, 26], breakfast: [7, 10.5], paella: [11, 17], station: [6, 23] };
function isOpen(k) {
  const o = OPEN[k]; if (!o) return true;
  let h = hourOf(G.S.time);
  const sunday = dayStr() === 'So';
  if (sunday && ['moda', 'super', 'farmacia', 'mercado', 'rent'].includes(k)) return false;
  if (o[1] > 24 && h < o[1] - 24) h += 24;
  return h >= o[0] && h < o[1];
}
const hoursStr = (k) => { const o = OPEN[k]; const f = (v) => pad2(Math.floor(v % 24)) + ':' + pad2(Math.round((v % 1) * 60)); return f(o[0]) + '–' + f(o[1]); };
const LUNCH = { 1: ['paella', 'Paella Valenciana', 'Isabell hat beim Restaurant um die Ecke zwei riesige Pfannen bestellt: Hühnchen, Kaninchen, Garrofó, Bohnen, Safran. Kein Chorizo – niemals.'], 2: ['burger', 'Smash Burger', 'Burger-Mittwoch: Vicente hat den Foodtruck organisiert. Doppelt Käse, Pommes dazu.'], 3: ['bocadillo', 'Bocadillos', 'Donnerstag ist Bocadillo-Tag: Jamón, Tortilla, Esgarraet – auf knusprigem Brot aus dem Mercado.'], 4: ['bowl', 'Healthy Breakfast', 'Freitagmorgen: Bowls, Obst, Joghurt, Zumo. Elena besteht auf dem gesunden Abschluss.'] };

const it = (id, price, o = {}) => Object.assign({ id, price }, o);
const SHOPS = {
  automat: { title: 'Automat', mode: 'take', sections: [{ t: 'Snacks & Getränke', items: [it('agua', 1.5), it('cola', 2), it('energy', 2.5), it('chips', 1.8), it('almendras', 2.2), it('croissant', 2)] }] },
  aircafe: { title: 'Flughafen-Café', mode: 'eat', intro: 'Der Barista stellt die Tasse hin, bevor du bestellt hast. „¿Cortado?“', sections: [{ t: 'Kaffee', items: [it('cortado', 2.2), it('conleche', 2.6), it('zumo', 3.5), it('agua', 1.8)] }, { t: 'Essen', items: [it('bocadillo', 5.5), it('croissant', 2.4), it('tortilla', 4.5)] }] },
  breakfast: { title: 'Frühstück im Hotel Kramer', mode: 'eat', intro: 'Buffet bis 10:30. Marta schiebt dir eine Zeitung hin.', sections: [{ t: 'Frühstück', items: [it('conleche', 0), it('zumo', 0), it('croissant', 0), it('tortilla', 0), it('bowl', 0), it('fruta', 0)] }] },
  minibar: { title: 'Minibar', mode: 'eat', intro: 'Hotelpreise. Natürlich.', sections: [{ t: 'Inhalt', items: [it('tercio', 5.5), it('agua', 4), it('cola', 4.5), it('chips', 4.5), it('almendras', 5)] }] },
  bar: { title: 'Bar Pepita', mode: 'eat', venue: 'bar', intro: 'Pepita poliert ein Glas. „¿Qué os pongo?“', sections: [
    { t: 'Bier', items: [it('cana', 2.2), it('jarra', 4.5), it('tercio', 3)] },
    { t: 'Valencia', items: [it('agua_val', 6.5), it('agua_val_j', 24, { n: 'Agua de Valencia (Krug für alle)', d: 'Cava, Orangensaft, Wodka, Gin – ein Krug für den Tisch', special: 'round' }), it('tinto', 3.5), it('sangria', 4.5), it('chupito', 2.5)] },
    { t: 'Alkoholfrei', items: [it('cola', 2.5), it('agua', 2), it('cortado', 1.8), it('zumo', 3.5)] },
    { t: 'Tapas', items: [it('tapas', 9.5), it('bravas', 5.5), it('tortilla', 4.5), it('esgarraet', 6), it('bocadillo', 6)] },
  ] },
  jamon: { title: 'Jamonería Ramón', mode: 'eat', venue: 'jamon', intro: 'Ramón schneidet hauchdünn. „Bellota, 36 Monate. Pruébalo.“', sections: [{ t: 'Jamón', items: [it('jamon', 18), it('tapas', 10), it('esgarraet', 6.5)] }, { t: 'Dazu', items: [it('vino', 4), it('cana', 2.5), it('cava', 4.5), it('agua', 2)] }] },
  discobar: { title: 'Bar im Marina Beach Club', mode: 'eat', venue: 'disco', intro: 'Noa schreit über den Bass: „¿QUÉ QUIERES?“', sections: [{ t: 'Drinks', items: [it('tercio', 6), it('gintonic', 11), it('mojito', 10), it('chupito', 4)] }, { t: 'Alkoholfrei', items: [it('cola', 4.5), it('agua', 4), it('energy', 5)] }] },
  chiringuito: { title: 'Chiringuito', mode: 'eat', venue: 'chiringuito', intro: 'Füsse im Sand, Musik aus der Box.', sections: [{ t: 'Getränke', items: [it('cana', 3), it('tinto', 4), it('mojito', 8), it('zumo', 4), it('agua', 2.5)] }, { t: 'Essen', items: [it('calamares', 9), it('pescado', 14), it('bravas', 5.5), it('fruta', 4)] }] },
  veles: { title: 'Veles e Vents · Bar', mode: 'eat', venue: 'veles', intro: 'Hafenblick, Segelboote, ein Hauch von America’s Cup.', sections: [{ t: 'Getränke', items: [it('cava', 6), it('gintonic', 12), it('cana', 3.5), it('cortado', 2.5), it('agua', 3)] }, { t: 'Essen', items: [it('sepia', 12), it('fideua', 16), it('tapas', 11)] }] },
  horchata: { title: 'Horchatería', mode: 'eat', venue: 'horchata', intro: '„Horchata mit Fartons – das ist Valencia.“', sections: [{ t: 'Horchata', items: [it('horchata', 3), it('fartons', 1.5)] }, { t: 'Sonst', items: [it('zumo', 3.5), it('cortado', 1.8), it('agua', 1.5)] }] },
  zumo: { title: 'Zumo-Wagen', mode: 'eat', venue: 'horchata', sections: [{ t: 'Frisch gepresst', items: [it('zumo', 3), it('naranja', 0.8), it('fruta', 4)] }] },
  churros: { title: 'Churrería', mode: 'eat', venue: 'churros', sections: [{ t: 'Süsses', items: [it('churros', 4.5), it('conleche', 2.2), it('horchata', 3)] }] },
  super: { title: 'Supermercado', mode: 'take', venue: 'super', sections: [{ t: 'Einkaufen', items: [it('agua', 0.7), it('tercio', 1.1), it('energy', 1.4), it('naranja', 0.4), it('bocadillo', 3.2), it('chips', 1.9), it('almendras', 2.4), it('fruta', 2.5), it('sonnencreme', 7.9)] }] },
  farmacia: { title: 'Farmacia', mode: 'take', venue: 'farmacia', intro: 'Die Apothekerin mustert dich über ihre Brille hinweg.', sections: [{ t: 'Rezeptfrei', items: [it('aspirin', 5.9), it('magen', 8.5), it('sonnencreme', 11.9)] }] },
  estanco: { title: 'Estanco', mode: 'take', venue: 'estanco', sections: [{ t: 'Tabak & Co.', items: [it('zigaretten', 5.5), it('feuerzeug', 1.2), it('postits', 2.5)] }] },
  souvenir: { title: 'Souvenirs València', mode: 'take', venue: 'souvenir', sections: [{ t: 'Andenken', items: [it('fallera', 14.9), it('ninot', 9.9), it('abanico', 7.5), it('azulejo', 6.5), it('paellera', 24), it('schal', 19.9, { d: 'Valencia CF – Amunt!' }), it('chufa', 4.5)] }] },
  moda: { title: 'Moda Valencia', mode: 'wear', venue: 'moda', intro: 'Leinen, Sonnenbrillen, Strohhüte – und ein Verkäufer mit perfekter Bräune.', sections: [{ t: 'Kleidung', items: [
    it('o_sonne', 29, { n: 'Sonnenbrille', icon: 'glasses', wear: { glasses: 3 }, d: 'Pflicht am Strand' }),
    it('o_stroh', 24, { n: 'Strohhut', icon: 'hat', wear: { hat: 6 }, unlock: 'strohhut', d: 'Gegen die Mittagssonne' }),
    it('o_leinen', 89, { n: 'Leinen-Set', icon: 'shirt', wear: { top: 1, topCol: 14, pants: 1, pantsCol: 5, shoes: 4, shoesCol: 2, hat: 0, print: 0 }, d: 'Weisses Hemd, beige Chino, Sandalen' }),
    it('o_beach', 59, { n: 'Strand-Set', icon: 'shirt', wear: { top: 0, topCol: 8, print: 6, pants: 6, pantsCol: 12, shoes: 6, shoesCol: 1 }, d: 'Palmen-Shirt, Boardshorts, Flip-Flops' }),
    it('o_racing', 149, { n: 'Racing-Jacke', icon: 'shirt', wear: { top: 9, topCol: 0 }, unlock: 'racing', d: 'Luigi wird neidisch' }),
    it('o_trikot', 79, { n: 'Radtrikot & Radschuhe', icon: 'shirt', wear: { top: 10, topCol: 2, shoes: 7, shoesCol: 1 }, unlock: 'radtrikot', d: 'Für die Ausfahrt mit Aitor' }),
    it('o_vcf', 69, { n: 'Valencia-CF-Set', icon: 'shirt', wear: { top: 6, topCol: 14, print: 3, acc: 4, hat: 0 }, d: 'Trikot Nummer 7 und Schal' }),
    it('o_helm', 39, { n: 'Velohelm', icon: 'helmet', wear: { hat: 5, hatCol: 8 }, d: 'Sicherheit geht vor' }),
  ] }] },
  fisch: { title: 'Pescadería', mode: 'take', venue: 'mercado', intro: 'Toni wirft Eis auf die Doraden. „¡Fresco, fresco!“', sections: [{ t: 'Frisch vom Markt', items: [it('pescado', 9, { n: 'Dorada (ganz)', d: 'Für die Hotelküche – oder als Geschenk für Isabell' }), it('calamares', 7, { n: 'Calamares (roh)', d: 'Roh. Besser im Chiringuito bestellen.' })] }] },
  mjamon: { title: 'Jamones y Embutidos', mode: 'eat', venue: 'mercado', sections: [{ t: 'Zum Probieren', items: [it('jamon', 12), it('bocadillo', 4.5), it('tapas', 7)] }] },
  fruta: { title: 'Frutería', mode: 'take', venue: 'mercado', sections: [{ t: 'Obst', items: [it('naranja', 0.3), it('fruta', 2.8), it('zumo', 2.5)] }] },
  spice: { title: 'Especias', mode: 'take', venue: 'mercado', sections: [{ t: 'Gewürze', items: [it('chufa', 3.9), it('almendras', 3.5), it('azulejo', 5.9, { n: 'Safran-Dose (Azulejo-Design)', d: 'Für die Paella zuhause' })] }] },
  flores: { title: 'Flores', mode: 'take', venue: 'mercado', sections: [{ t: 'Blumen', items: [it('abanico', 6.5, { n: 'Fächer mit Blumen', icon: 'fan' }), it('fallera', 12.9)] }] },
};

const Story = {
  ready: false, EVENTS: [],
  say(sp, text) { return UI.say(sp, text); },
  ask(sp, text, opts) { return UI.ask(sp, text, opts); },
  stageAt(s) { return STAGES.indexOf(G.S.stage) >= STAGES.indexOf(s); },
  setStage(s) { G.S.stage = s; UI.hud(); },
  isSwiss() { return SWISS.includes(G.S.pid); },
  /* Wen muss man am Flughafen einsammeln? */
  airportGroup() { return SWISS.filter((id) => id !== G.S.pid); },
  /* ---------- Ziele ---------- */
  objective() {
    const s = G.S.stage, f = G.S.flags, d = today(), h = hourOf(G.S.time);
    switch (s) {
      case 'koffer': return 'Gepäckband 3: Hol deinen Koffer vom Band';
      case 'sammeln': { const miss = this.airportGroup().filter((id) => !f.met[id]); return `Finde ${listNames(miss)} in der Ankunftshalle (sie winken mit „!“)`; }
      case 'taxi': return 'Alle da! Zum Ausgang unten – Taxistand';
      case 'hotel': return 'Finde das Hotel Kramer – Gasse westlich der Plaza del Ayuntamiento';
      case 'checkin': return 'Check bei Marta an der Rezeption ein';
      case 'zimmer': return 'Lift in den 4. Stock: Zimmer 412 beziehen, Koffer auspacken';
      case 'bar': return h < 19 ? 'Freier Nachmittag · 19:00 Treffpunkt Bar Pepita (Plaza de la Virgen)' : 'Bar Pepita, Plaza de la Virgen: alle treffen';
      default: {
        if (d === 0) return 'Montagabend: Agua de Valencia · Morgen 9:30 Kickoff bei Colba (Hochhaus im Osten)';
        if (d >= 5) return f.finished ? 'Heimflug' : 'Samstag: Taxi zum Flughafen – Heimflug um 10:00';
        const wd = isWorkday();
        if (wd && !f.kickoff) return h < 9 ? 'Zum Colba-Hochhaus (Osten) – richtige Klingel finden, 1. Stock' : 'Kickoff 9:30 im Aufenthaltsraum: Robin hält den Business Context';
        if (d === 4 && h >= 14.5 && !f.final) return 'Freitag 15:00: Final-Präsentation im Aufenthaltsraum (grosser Bildschirm)';
        if (f.final) return 'Planning abgeschlossen! Geniess Valencia – Samstag 10:00 Heimflug ab Flughafen';
        if (wd && h >= 13 && h < 14.5 && !f['lunch' + d]) return `Mittagessen im Aufenthaltsraum: ${LUNCH[d][1]}`;
        if (d === 3 && h >= 15.5 && h < 18.5 && !f.teamRide) return 'Donnerstag: Team-Ausfahrt mit dem E-Bike – Aitor im E-Bike-Raum neben der Lounge (Office)';
        if (wd && h >= 9 && h < 18) { const p = Math.round(G.S.plan[myTeam()]); return `${TEAMS[myTeam()].room}: PI-Plan weiterbringen (${p} %) – Poker, CANopen, ROAM, Board, Abhängigkeiten`; }
        const tips = [];
        if (G.S.money.eur < 15) tips.push('Fast pleite – Bankomat an der Calle Colón');
        else if (G.S.st.energy < 25) tips.push('Du bist müde – Zimmer 412 im Hotel Kramer');
        else if (G.S.st.food < 25) tips.push('Hunger! Tapas in der Bar Pepita oder Jamón bei Ramón');
        else if (d === 2 && h >= 18.5 && h < 23 && !f.asado) tips.push('Mittwochabend: Asado bei Danny – Taxi vor dem Hotel oder an der Estación, „Zu Danny“');
        else if (h >= 22) tips.push('Nachtleben: Marina Beach Club beim Strand');
        else if (h < 9) tips.push('Frühstück im Hotel, dann ab ins Office (Klingel!)');
        else tips.push(pick(['Segeltörn im Hafen, Kartbahn im Südwesten, Padel beim Park', 'Mercado Central, Museum, Strandfussball', 'Weindegustation in der Bodega, Jamón bei Ramón', 'Paella-Wettbewerb am Strand, Horchata auf der Plaza']));
        return `${tips[0]} · Fotos ${Object.keys(G.S.photos).length}/${Object.keys(SIGHTS).length}`;
      }
    }
  },
  objectiveTag() {
    const s = G.S.stage;
    if (s !== 'free') return { koffer: 'GEPÄCK', sammeln: 'TRUPPE', taxi: 'TAXI', hotel: 'HOTEL', checkin: 'HOTEL', zimmer: 'ZIMMER', bar: 'BAR' }[s];
    const d = today(), f = G.S.flags, h = hourOf(G.S.time);
    if (d >= 5 || f.final) return 'FREI';
    if (isWorkday() && !f.kickoff) return 'KICKOFF';
    if (isWorkday() && h >= 9 && h < 18) return 'PLANNING';
    return 'VALENCIA';
  },
  steps() {
    const f = G.S.flags, tm = myTeam();
    return [
      { t: 'Montag: Ankunft in Valencia', d: 'Koffer, Truppe, Taxi, Hotel Kramer, Zimmer beziehen', done: this.stageAt('bar') },
      { t: 'Montagabend: Bar Pepita', d: 'Alle treffen – auch Pascal aus Leipzig, Chris aus Fuerte und Juanjo', done: this.stageAt('free') },
      { t: 'Dienstag: Colba finden', d: 'Hochhaus im Osten, richtige Klingel, 1. Stock', done: !!f.colbaVisited },
      { t: 'Kickoff 9:30', d: 'Robins Business Context im Aufenthaltsraum', done: !!f.kickoff },
      { t: 'PI-Plan Team ' + TEAMS[tm].n.replace('Team ', ''), d: 'Poker, CANopen-Quiz, ROAM, Programm-Board – mindestens 80 %', done: G.S.plan[tm] >= 80 },
      { t: 'Abhängigkeiten klären', d: 'Mit den anderen Teams verhandeln (Dependency-Board)', done: Object.entries(DEPS).filter(([k, d]) => d.from === tm || d.to === tm).every(([k]) => G.S.deps[k]) },
      { t: 'Mittagessen im Aufenthaltsraum', d: 'Di Paella · Mi Burger · Do Bocadillos · Fr Healthy Breakfast', done: !!(f.lunch1 && f.lunch2 && f.lunch3 && f.lunch4) },
      { t: 'Mittwochabend: Asado bei Danny', d: 'Taxi „Zu Danny“ ab 18:30 – Grill, Mojito, Carlos am Bass', done: !!f.asado },
      { t: 'Donnerstag: Team-Ausfahrt', d: 'Mit Aitor und dem Team durch den Turia-Park', done: !!f.teamRide },
      { t: 'Freitag 15:00: Final & Confidence Vote', d: 'Alle Teams präsentieren', done: !!f.final },
      { t: 'Valencia erleben', d: 'Segeln, Kart, Paella, Wein, Museum, Strand, Disco, Padel, Mercado', done: Object.keys(G.S.ach).length >= 25 },
      { t: 'Samstag: Heimflug', d: 'Taxi zum Flughafen', done: !!f.finished },
    ];
  },
  mapPois(id) {
    if (id !== 'city') return [];
    const A = '#ff8c1a', S = '#3f9a4b', V = '#1f7fb8', N = '#e85af0', C = '#2a9aa0';
    return [
      { x: 13, y: 30, n: 'Hotel Kramer', c: A }, { x: 76, y: 27, n: 'Colba', c: C }, { x: 24, y: 17, n: 'Bar Pepita', c: A }, { x: 55, y: 20, n: 'Mercado', c: V }, { x: 88, y: 18, n: 'Museum', c: V },
      { x: 31, y: 17, n: 'Micalet', c: V }, { x: 39, y: 20, n: 'Pl. Virgen', c: V }, { x: 34, y: 38, n: 'Falla · Mascletà', c: V }, { x: 40, y: 10, n: 'Torres Serranos', c: V }, { x: 46, y: 3, n: 'Turia-Park', c: V },
      { x: 26, y: 49, n: 'Jamonería', c: S }, { x: 33, y: 49, n: 'Bodega', c: S }, { x: 39, y: 49, n: 'Souvenirs', c: S }, { x: 45, y: 49, n: 'E-Bike-Miete', c: S }, { x: 63, y: 36, n: 'Moda', c: S }, { x: 53, y: 42, n: 'Super', c: S }, { x: 65, y: 42, n: 'Farmacia', c: S }, { x: 21, y: 50, n: 'Bankomat', c: A },
      { x: 10, y: 63, n: 'Kartbahn', c: S }, { x: 62, y: 62, n: 'Padel', c: S }, { x: 75, y: 62, n: 'Disco', c: N }, { x: 36, y: 58, n: 'Estación', c: V }, { x: 56, y: 72, n: 'Ciudad de las Artes', c: V },
      { x: 90, y: 36, n: 'Strand', c: V }, { x: 92, y: 48, n: 'Strandfussball', c: S }, { x: 88, y: 60, n: 'Paella', c: S }, { x: 89, y: 73, n: 'Segeln', c: S }, { x: 86, y: 68, n: 'Veles e Vents', c: A },
    ];
  },

  /* ---------- Wo ist wer? ---------- */
  schedule(id) {
    const d = today(), h = hourOf(G.S.time), f = G.S.flags, s = G.S.stage, p = PEOPLE[id];
    if (id === G.S.pid) return null;
    const swiss = SWISS.includes(id), colba = COLBA.includes(id);
    if (f.sick && f.sick[id] === dayOf(G.S.time - 300)) return 'hotel';
    if (d === 0) {
      if (swiss) { if (!this.stageAt('taxi')) return 'airport'; if (!this.stageAt('bar')) return 'hotel'; if (h >= 19 && h < 24) return 'bar'; return h < 19 ? 'hotel' : 'hotel'; }
      if (id === 'pascal' || id === 'chris') { if (h >= 19 && h < 24) return 'bar'; return h < 19 ? 'travel' : 'hotel'; }
      if (id === 'juanjo') return h >= 19.5 && h < 23.5 ? 'bar' : 'home';
      return 'home';
    }
    if (d >= 5) { if (swiss || id === 'pascal' || id === 'chris') return h < 9 ? 'hotel' : 'airport'; return 'home'; }
    /* Werktage Di–Fr */
    if (h < 1.5 && d >= 1) { if (['luigi', 'chris', 'guillem', 'pablo', 'estella'].includes(id) && d >= 2) return 'disco'; return colba ? 'home' : 'hotel'; }
    if (h < 8) { if (id === 'chris' && h >= 6.5) return 'beach'; return colba ? 'home' : 'hotel'; }
    if (h < 9) { if (id === 'aitor') return 'turia'; return colba ? 'commute' : (h < 8.6 ? 'breakfast' : 'commute'); }
    if (h < 9.5 && d === 1 && !f.kickoff) return 'lounge';
    if (h < 13) { if (d === 1 && !f.kickoff) return 'lounge'; if (id === 'dominique' && Math.floor(h * 60) % 60 >= 45) return 'balcony'; if (id === 'isabell') return 'backoffice'; return 'room'; }
    if (h < 14.2) return 'lounge';
    if (h < 18) { if (d === 4 && h >= 14.8) return 'lounge'; if (d === 3 && h >= 15.5 && f.teamRide !== 1 && teamOf(id) === myTeam()) return 'lab'; if (id === 'dominique' && Math.floor(h * 60) % 60 >= 45) return 'balcony'; if (id === 'isabell') return 'backoffice'; if (id === 'robin' && Math.floor(h) % 2 === 1) return 'lost'; return 'room'; }
    if (d === 2 && h >= 18.5 && h < 23.5 && (TRAVELLERS.includes(id) || TEAMS.indurain.members.includes(id) || id === 'carlos' || id === 'juanjo')) return 'bbq';
    if (h < 19.5) { if (id === 'chris' || id === 'vicente') return 'beach'; if (id === 'luigi' && d === 2) return 'kart'; if (id === 'aitor') return 'turia'; return colba ? 'home' : 'hotel'; }
    if (h < 23) { if (['luigi', 'dominique', 'simon', 'robin', 'lukas', 'pascal', 'chris'].includes(id)) return d === 3 && h >= 21.5 ? 'crema' : 'bar'; if (['juanjo', 'danny', 'carlos', 'fran'].includes(id)) return 'bar'; if (['estella', 'guillem', 'pablo', 'elena'].includes(id) && h >= 21) return 'bodega'; return 'home'; }
    if (['luigi', 'chris', 'guillem', 'pablo', 'estella', 'vicente'].includes(id)) return 'disco';
    return colba ? 'home' : 'hotel';
  },
  LOC: {
    airport: ['in der Ankunftshalle', 'airport'], hotel: ['im Hotel Kramer', 'city', 13, 30], breakfast: ['beim Frühstück im Hotel Kramer', 'hotel_lobby'], bar: ['in der Bar Pepita', 'bar', 24, 17], jamon: ['in der Jamonería Ramón', 'jamon', 26, 49], bodega: ['in der Bodega La Tinaja', 'bodega', 33, 49], disco: ['im Marina Beach Club', 'disco', 75, 62],
    home: ['zuhause (kommt morgen mit Mofa oder Metro)', null], travel: ['noch unterwegs nach Valencia', null], commute: ['auf dem Weg ins Office (Mofa, Metro, Velo)', 'city', 76, 29], room: ['im Teamraum bei Colba', 'colba'], lounge: ['im Aufenthaltsraum bei Colba', 'colba'], balcony: ['auf dem Balkon (raucht)', 'colba'], backoffice: ['am Backoffice-Pult', 'colba'], lab: ['im E-Bike-Raum neben der Lounge', 'colba'], lost: ['irgendwo im Office – sucht den Weg', 'colba'],
    bbq: ['beim Asado in Dannys Garten', 'danny_house'],
    beach: ['am Strand der Malvarrosa', 'city', 90, 36], turia: ['mit dem Velo im Turia-Park', 'city', 46, 5], kart: ['auf der Kartbahn', 'city', 10, 63], crema: ['bei der Cremà auf der Plaza del Ayuntamiento', 'city', 34, 38],
  },
  whereIs(id) {
    const loc = this.schedule(id);
    const e = this.LOC[loc];
    if (!e) return { t: 'irgendwo in Valencia', x: null };
    return { t: e[0], map: e[1], x: e[2] != null ? e[2] : null, y: e[3] };
  },
  isHere(id, mapId) {
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
      (byLoc.crema || []).forEach((id, i) => put(id, 28 + i * 2, 40 + (i % 2), 3));
      (byLoc.commute || []).forEach((id, i) => put(id, 74 + (i % 6), 30 + Math.floor(i / 6), 3, { wander: { x: 72, y: 28, w: 10, h: 4 } }));
      return;
    }
    if (m.id === 'hotel_lobby') { (byLoc.breakfast || []).forEach((id, i) => put(id, 15 + (i % 3) * 2, 11 - Math.floor(i / 3), 3, { drinkIdle: true })); return; }
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
      const TR = { indurain: 1, meeseeks: 16, rocket: 31 };
      const roomSeats = (team) => { const x0 = TR[team]; return [[x0 + 3, 5, 0], [x0 + 6, 5, 0], [x0 + 9, 5, 0], [x0 + 3, 9, 3], [x0 + 6, 9, 3], [x0 + 9, 9, 3], [x0 + 11, 7, 1], [x0 + 2, 7, 2]]; };
      const cnt = { indurain: 0, meeseeks: 0, rocket: 0 };
      (byLoc.room || []).forEach((id) => { const tm = teamOf(id) || 'indurain'; const s = free(roomSeats(tm), cnt[tm]++); put(id, s[0], s[1], s[2], { pose: s[2] === 1 || s[2] === 2 ? 'stand' : 'sit', sitIdle: true, sortAdd: s[2] === 0 ? 0 : 3 }); });
      const lseats = [[48, 8, 0], [51, 8, 0], [54, 8, 0], [48, 12, 3], [51, 12, 3], [54, 12, 3], [49, 15, 0], [50, 15, 0], [55, 15, 0], [56, 15, 0], [50, 6, 0], [52, 6, 0], [54, 6, 0], [56, 6, 0], [49, 18, 0], [52, 18, 0], [55, 18, 0]];
      (byLoc.lounge || []).forEach((id, i) => { const s = free(lseats, i); const sit = i < 6; put(id, s[0], s[1], s[2], { pose: sit ? 'sit' : 'stand', drinkIdle: !sit, sitIdle: sit, sortAdd: sit && s[2] === 0 ? 0 : 3, wander: sit ? null : { x: 47, y: 5, w: 11, h: 15 } }); });
      (byLoc.balcony || []).forEach((id) => put(id, 57, 23, 3, { smokeIdle: true }));
      (byLoc.backoffice || []).forEach((id) => put(id, 10, 24, 0, { pose: 'sit', sitIdle: true, sortAdd: 2 }));
      (byLoc.lab || []).forEach((id, i) => put(id, 47 + (i % 4) * 2, 25 + Math.floor(i / 4) * 3, 0, { bubble: 'bike', bubbleT: 1e9 }));
      (byLoc.lost || []).forEach((id) => put(id, 30 + rint(0, 12), 23, rint(0, 3), { wander: { x: 24, y: 22, w: 20, h: 5 }, bubble: '?', bubbleT: 1e9 }));
      return;
    }
  },
  onEnter(m) {
    const f = G.S.flags;
    if (m.id === 'hotel_lobby' && G.S.stage === 'hotel') this.setStage('checkin');
    if (m.id === 'colba') { if (!f.colbaVisited) { f.colbaVisited = 1; achieve('lift'); } f.lastOffice = G.S.time; }
    if (m.id === 'bar' && G.S.stage === 'bar' && hourOf(G.S.time) >= 19) setTimeout(() => this.barMeet(), 400);
    if (m.id === 'danny_house' && !f.asado) setTimeout(() => this.asadoWelcome(), 400);
    if (m.id === 'city' && f.pendingTaxiArrive) { f.pendingTaxiArrive = 0; }
  },

  /* ---------- Intro & Flughafen ---------- */
  async intro() {
    const me = G.S.pid, p = PEOPLE[me];
    if (this.isSwiss()) await this.say(null, `Du bist ${G.S.name}, ${p.role}. ${p.intro} Der Flieger aus Zürich ist gelandet: eine Woche PI Planning bei Colba in Valencia. Zuerst: Koffer vom Band 3 holen. Dann die anderen einsammeln – Robin ist zum ersten Mal dabei und steht garantiert am falschen Band.`);
    else if (me === 'pascal') await this.say(null, `Du bist Pascal, iOS-Spezialist aus Leipzig. Allein angereist, Rucksack voll Club Mate. Zufall: Die Zürcher sind gerade gelandet – Band 3. Hol deinen Koffer und such die Truppe, dann teilt ihr euch das Taxi ins Hotel Kramer.`);
    else await this.say(null, `Du bist Chris, Surfer und Product Manager aus Fuerteventura. Das Brett blieb zuhause, das Wax ist im Koffer. Die Schweizer sind gerade mit dir gelandet – Band 3. Koffer holen, Truppe finden, Taxi ins Hotel Kramer.`);
  },
  async baggage() {
    if (G.S.flags.koffer) { await this.say(null, 'Dein Koffer ist schon da. Lukas’ Koffer fährt noch eine Ehrenrunde – er bemerkt es nicht, er liest den Batteriepass-Entwurf.'); return; }
    const res = await Mini.suitcase();
    if (!res) { await this.say(null, 'Das Band läuft weiter. Dein Koffer kommt schon noch – schau nochmal hin.'); return; }
    if (res.wrong) { await this.say('Robin', 'Äh … das ist meiner. Sorry! Erstes Mal dabei, aber den Koffer erkenne ich.'); }
    G.S.flags.koffer = 1; achieve('koffer'); mood(5);
    await this.say(null, `Dein Koffer! ${res.wrong ? 'Beim zweiten Anlauf. ' : ''}Jetzt die Truppe einsammeln: ${listNames(this.airportGroup())}. Sie winken mit einem „!“ (oder rauchen, oder schauen Autos an).`);
    this.setStage('sammeln');
  },
  async carRental() {
    await this.say('Mietwagen-Schalter', 'Un Seat León, un Cupra Formentor … Luigi hat den Prospekt schon dreimal gelesen. Ihr fahrt trotzdem Taxi – Simon hat eins bestellt.');
  },
  async leaveAirport() {
    if (today() >= 5) return true;
    if (!this.stageAt('taxi')) { await this.say(null, this.stageAt('sammeln') ? `Ohne die anderen fährst du nicht. Es fehlen: ${listNames(this.airportGroup().filter((id) => !G.S.flags.met[id]))}.` : 'Erst den Koffer vom Band 3 holen!'); return false; }
    await this.taxiToHotel();
    return false;
  },
  async taxiToHotel() {
    G.busy++;
    await this.say('Taxifahrer Paco', `¿Hotel Kramer? Vale. Fünf Personen und fünf Koffer – das wird eng. Robin, du nimmst den Koffer auf den Schoss.`);
    await Scene.play('taxi', { ms: 3600, text: 'Vom Flughafen in die Stadt …', heads: SWISS.filter((id) => id !== G.S.pid).map((id) => getSheet(personLook(id))) });
    passTime(25);
    pay(0);
    await this.say('Taxifahrer Paco', 'Die Gasse zum Hotel ist zu eng für das Auto. Ich lass euch an der Plaza del Ayuntamiento raus – das Hotel ist in der Gasse Richtung Westen, zwei Blocks. ¡Buena suerte! Und um 14 Uhr: Ohren zu, Mascletà.');
    G.S.flags.pendingTaxiArrive = 1;
    achieve('taxi');
    this.setStage('hotel');
    G.busy--;
    await warpTo('city', { x: 28 * TS + 12, y: 42 * TS + 20, dir: 3 }, { plain: true });
    G.busy++;
    await this.say(null, 'Valencia! Orangenbäume, Sonne, Böllerrauch. Die anderen schleppen ihre Koffer hinterher – finde das Hotel Kramer in der Gasse westlich der Plaza (vier Sterne am Schild).');
    G.busy--;
  },
  async taxiCity() {
    const d = today();
    const bbqOk = d === 2 && hourOf(G.S.time) >= 18.5 && this.stageAt('free');
    const opts = ['Zum Flughafen (Heimflug)', 'Zum Hotel Kramer', 'Zum Strand', 'Zu Danny (Asado, Vorort)', 'Doch nicht'];
    const o = await this.ask('Taxifahrer', `¿A dónde? Flughafen 22 €, Stadt 9 €${bbqOk ? ', Vorort 14 €' : ''}.`, opts.map((t, i) => ({ t, disabled: (i === 0 && !(d >= 5 || G.S.flags.final)) || (i === 3 && !bbqOk) })));
    if (o === 4) return;
    if (o === 3) { if (!pay(14)) { await this.say('Taxifahrer', 'Sin dinero no hay taxi.'); return; } await Scene.play('taxi', { ms: 2200, text: 'Raus in den Vorort, zu Danny …' }); passTime(20); enterMap('danny_house', 'entry'); await UI.fadeIn(); return; }
    if (o === 0) { if (!pay(22)) { await this.say('Taxifahrer', 'Sin dinero no hay taxi.'); return; } await this.goHome(); return; }
    if (!pay(9)) { await this.say('Taxifahrer', 'Sin dinero no hay taxi.'); return; }
    await Scene.play('taxi', { ms: 2000, text: 'Taxi durch Valencia …' });
    passTime(12);
    if (o === 1) enterMap('city', 'hotel'); else enterMap('city', { x: 86 * TS + 12, y: 36 * TS + 20, dir: 2 });
    await UI.fadeIn();
  },

  /* ---------- Hotel Kramer ---------- */
  async reception() {
    const f = G.S.flags;
    if (G.S.stage === 'checkin') {
      await this.say('Marta', `¡Bienvenidos al Hotel Kramer! Reservierung Colba, ${this.isSwiss() ? 'fünf' : 'sieben'} Zimmer, vier Nächte. ${G.S.name}: Zimmer 412, vierter Stock. Frühstück 7 bis 10:30. Der Lift ist links – und bitte nicht alle fünf auf einmal, der ist aus den Sechzigern.`);
      await this.say('Robin', 'Ich hab Zimmer 414. Wer von euch kennt sich mit diesen Kartenschlössern aus?');
      f.key = 412; achieve('checkin'); this.setStage('zimmer');
      await this.say(null, 'Zimmer 412 im 4. Stock: Koffer abstellen, auspacken, durchatmen. Um 19:00 treffen sich alle in der Bar Pepita an der Plaza de la Virgen – auch Pascal, Chris und Juanjo.');
      return;
    }
    const o = await this.ask('Marta', 'Buenos días. Was kann ich für Sie tun?', ['Wo sind die anderen?', 'Tipp für den Abend', 'Weckruf für 7:30', 'Nichts, danke']);
    if (o === 0) { const ids = TRAVELLERS.filter((id) => id !== G.S.pid); await this.say('Marta', ids.map((id) => `${fname(id)}: ${this.whereIs(id).t}`).join('. ') + '.'); }
    if (o === 1) await this.say('Marta', pick(['Agua de Valencia in der Bar Pepita – aber nur einen Krug, hören Sie auf mich.', 'Die Mascletà um 14 Uhr auf der Plaza del Ayuntamiento. Ohren zu!', 'Jamón bei Ramón an der Calle Colón. Bellota, 36 Monate.', 'Donnerstag 12 Uhr: das Wassergericht vor der Kathedrale. Das älteste Gericht Europas.', 'Der Turia-Park ist neun Kilometer Velo-Paradies. Nehmen Sie ein E-Bike bei Bici Rent.']));
    if (o === 2) { f.wake = 1; await this.say('Marta', 'Notiert. 7:30, mit Zumo.'); }
  },
  async liftGuard() { if (!this.stageAt('zimmer')) { await this.say('Marta', 'Erst einchecken, bitte – die Karte öffnet den Lift.'); return false; } return true; },
  async roomDoor(n) {
    if (n !== 412) { const owner = { 410: 'luigi', 411: 'dominique', 413: 'lukas', 414: 'robin', 415: 'pascal' }[n]; await this.say(null, owner ? `Zimmer ${n} – ${fname(owner)}s Zimmer. ${this.schedule(owner) === 'hotel' ? 'Drinnen rumpelt es; er packt noch.' : 'Niemand da.'}` : `Zimmer ${n} ist nicht deins.`); return false; }
    if (!this.stageAt('zimmer')) { await this.say(null, 'Die Karte fehlt – erst einchecken.'); return false; }
    return true;
  },
  async unpack() {
    if (!G.S.flags.unpacked) {
      G.S.flags.unpacked = 1;
      await this.say(null, `Koffer auf: Laptop, Post-its, ${G.S.pid === 'lukas' ? 'der Batteriepass-Entwurf (40 Seiten)' : G.S.pid === 'chris' ? 'Surf-Wax und Flip-Flops' : G.S.pid === 'luigi' ? 'eine Zeitschrift über Sportwagen' : G.S.pid === 'dominique' ? 'zwei Stangen Zigaretten' : 'Hemden für vier Tage'}. Das Zimmer hat Meerblick – wenn man sich weit aus dem Fenster lehnt.`);
      addInv('badge'); addInv('postits');
      if (G.S.pid === 'dominique') addInv('zigaretten');
      if (G.S.pid === 'chris') addInv('surfwax');
      if (G.S.pid === 'lukas') addInv('batterypass');
      if (G.S.stage === 'zimmer') { this.setStage('bar'); await this.say(null, 'Erledigt. Der Nachmittag gehört dir: Plaza, Mercado, Strand – oder einfach ein Cortado. Um 19:00: Bar Pepita, Plaza de la Virgen.'); }
      return;
    }
    await this.say(null, 'Alles ausgepackt. Der Koffer dient jetzt als Nachttisch.');
  },
  async wardrobe() { G.busy++; await Editor.open({ mode: 'clothes' }); G.busy--; },
  async laptop() {
    const o = await this.ask(null, 'Der Laptop. Jira, Slack, 43 ungelesene Mails.', ['Jira-Board anschauen', 'Mails lesen', 'Zuklappen']);
    if (o === 0) { Phone.open('sprint'); return; }
    if (o === 1) { await this.say(null, pick(['Betreff: „Klingel am Hochhaus“ – von Isabell: „Steht NICHT Colba dran. Fragt mich nicht, warum.“', 'Betreff: „Mascletà“ – von Juanjo: „14:00, Plaza del Ayuntamiento. Pflicht.“', 'Betreff: „Battery Pass“ – von Lukas, 12 MB Anhang.', 'Betreff: „Kart?“ – von Luigi, kein Text, nur ein Link.'])); mood(1); }
  },
  async bed() {
    const h = hourOf(G.S.time), st = G.S.st;
    const o = await this.ask(null, `Das Bett. Es ist ${clockStr()}.`, [{ t: 'Schlafen bis zum Morgen', r: h >= 20 || h < 5 ? '' : 'erst ab 20:00', disabled: !(h >= 20 || h < 5) }, { t: 'Kurz hinlegen (90 Minuten)', r: 'Energie +' }, 'Lieber nicht']);
    if (o === 2) return;
    const was = G.S.time;
    if (o === 1) { await Scene.play('sleep', { ms: 2200, text: 'Ein Nickerchen …', nap: true, min: 90 }); passTime(90, { sleep: true, rate: 0.3 }); G.S.lastSleep = G.S.time; await this.say(null, `Aufgewacht. ${clockStr()} Uhr. ${st.energy > 60 ? 'Frisch wie ein Zumo.' : 'Immer noch etwas müde.'}`); return; }
    const target = (dayOf(G.S.time) + (h >= 20 ? 1 : 0)) * 1440 + (G.S.flags.wake ? 7 * 60 + 30 : 8 * 60 + 5);
    const min = target - G.S.time;
    await Scene.play('sleep', { ms: 3200, text: 'Buenas noches …', min });
    passTime(min, { sleep: true });
    G.S.lastSleep = G.S.time; st.energy = Math.max(st.energy, 85);
    if (st.prom > 0.5 || G.S.beers > 6) { st.hang = Math.min(100, 40 + st.prom * 30); st.prom = 0; await this.say(null, `${dateLong()}, ${clockStr()}. Der Kopf brummt – Kater. Wasser, Frühstück oder eine Tablette aus der Farmacia helfen.`); }
    else await this.say(null, `${dateLong()}, ${clockStr()}. ${this.morningLine()}`);
    this.newDay();
  },
  morningLine() {
    const d = today();
    return ['Heute geht es los: Kickoff um 9:30 bei Colba. Das Hochhaus steht im Osten – und die richtige Klingel findet sich nicht von selbst.', 'Burger-Mittwoch. Vorher: Planning.', 'Donnerstag: Bocadillos zum Zmittag, Ausfahrt mit dem Team am Nachmittag, abends brennen die Fallas.', 'Freitag: Healthy Breakfast im Office, um 15:00 die Final-Präsentation. Heute zählt es.', 'Samstag: Heimflug um 10:00. Taxi vor dem Hotel.'][d - 1] || 'Ein neuer Tag in Valencia.';
  },
  newDay() { const f = G.S.flags; f.evN = 0; G.warned = {}; if (today() >= 1 && today() <= 4 && !f['perdiem' + today()]) { f['perdiem' + today()] = 1; addMoney(60); UI.toast('Robin hat Spesen verteilt: +60 €.'); } },
  async shower() {
    if (G.S.flags.lastShower && G.S.time - G.S.flags.lastShower < 240) { await this.say(null, 'Du bist noch frisch.'); return; }
    await Scene.play('shower', { ms: 2000, text: 'Duschen …' }); passTime(15); G.S.flags.lastShower = G.S.time; G.S.st.sun = Math.max(0, G.S.st.sun - 20); mood(4); energy(6); G.S.st.wet = 0;
    await this.say(null, 'Frisch geduscht. Der Wasserdruck im Kramer ist legendär.');
  },
  async hotelCoffee() { if (!isOpen('breakfast')) { await this.say(null, 'Die Kaffeemaschine läuft nur zum Frühstück (7–10:30).'); return; } consume('conleche'); await this.say(null, 'Café con leche aus der Hotelmaschine. Zählt.'); },

  /* ---------- Bar Pepita, Montagabend ---------- */
  async barMeet() {
    if (G.S.stage !== 'bar') return;
    G.busy++;
    const others = TRAVELLERS.filter((id) => id !== G.S.pid);
    await this.say('Pepita', '¡Hola! Ihr seid die Schweizer von Colba? Juanjo hat den Tisch reserviert. Agua de Valencia?');
    await this.say('Juanjo', `¡Bienvenidos! Schön, dass ihr da seid. Morgen 9:30 im Office, erster Stock. Die Klingel … ach, das erklärt euch Isabell morgen. Pascal ist auch schon da – und Chris kommt gerade vom Strand.`);
    if (G.S.pid !== 'pascal') await this.say('Pascal', 'Von Leipzig über Frankfurt, drei Stunden Verspätung, aber: ich bin da. Erste Erkenntnis: Valencia hat mehr Sonne als Sachsen im ganzen Jahr.');
    if (G.S.pid !== 'chris') await this.say('Chris', 'Fuerte war windstill, also hab ich nichts verpasst. Morgen früh um halb sieben am Strand – wer kommt mit?');
    await this.say('Luigi', 'Ich hab die Kartbahn gesehen. Mittwochabend. Keine Diskussion.');
    await this.say('Dominique', 'Ich geh kurz raus, eine rauchen. Bestellt mir einen Krug.');
    await this.say('Robin', 'Also … ich halte morgen den Business Context. 20 Minuten. Ist das hier immer so laut?');
    consume('agua_val'); achieve('bar'); mood(10);
    for (const id of others) G.S.fprom[id] = 0.3;
    this.setStage('free');
    G.busy--;
    await this.say(null, 'Erster Krug Agua de Valencia: Cava, Orangensaft, Wodka, Gin. Die Woche kann beginnen. Tipp: nicht zu spät ins Bett – morgen Kickoff.');
  },
  async barTable() {
    const here = TRAVELLERS.filter((id) => id !== G.S.pid && this.schedule(id) === 'bar');
    if (!here.length) { await this.say(null, 'Der Stammtisch der POs. Gerade leer – Pepita hat ein „Reservado“-Schild hingestellt.'); return; }
    const o = await this.ask(null, `Am Tisch: ${listNames(here)}.`, ['Hinsetzen und mittrinken', 'Über das Planning reden', 'Weitergehen']);
    if (o === 2) return;
    if (o === 0) { G.player.pose = 'sit'; passTime(30); consume('cana'); mood(4); for (const id of here) G.S.fprom[id] = fprom(id) + 0.15; await this.say(pick(here), pick(['Salud! Auf Valencia.', 'Noch eine Caña? Die sind klein hier.', 'Wusstet ihr, dass Agua de Valencia 1959 im Café Madrid erfunden wurde?', 'Morgen früh wieder fit, versprochen.'])); return; }
    await this.say(pick(here), pick([`Der Plan von ${TEAMS[myTeam()].n} steht bei ${Math.round(G.S.plan[myTeam()])} %. ${G.S.plan[myTeam()] < 50 ? 'Da geht noch was.' : 'Läuft.'}`, 'Die Abhängigkeiten mit Rocket machen mir Sorgen. Carlos will erst refactoren.', 'Fran hat heute 40 CANopen-Indexe aus dem Kopf aufgesagt. Vierzig.', 'Robin fragt alle zehn Minuten, was ein Sprint ist. Er lernt schnell.']));
    planAdd(myTeam(), 1);
  },
  async barTable2() {
    const here = COLBA.filter((id) => id !== G.S.pid && this.schedule(id) === 'bar');
    if (!here.length) { await this.say(null, 'Der Tisch der Colba-Leute. Leer – die sind bei ihren Familien, oder auf dem Mofa unterwegs.'); return; }
    await this.say(pick(here), pick(['Setz dich! Hier redet niemand über Jira.', '¿Una caña? Pepita, otra ronda.', 'Nach dem Planning gehen wir alle zur Cremà. Donnerstagnacht brennt alles.', 'Aitor fährt morgen 60 Kilometer vor der Arbeit. Mit dem Rennvelo. Wir nehmen die Metro.']));
    mood(3);
  },

  /* ---------- Colba: Klingel, Lift, Office ---------- */
  async bell() {
    const f = G.S.flags;
    if (f.bellOk) { await this.say(null, 'Du weisst jetzt, welche: „C.B. Soluciones, 1º B“. Die Tür summt.'); await warpTo('colba_entry', 'entry'); return; }
    await this.say(null, 'Das Klingelbrett. Zwölf Klingeln, alle angeschrieben – und auf keiner steht „Colba“. Isabell hat gesagt, sie steht nicht dran. Welche könnte es sein?');
    const res = await Mini.bell();
    if (!res) return;
    if (res.ok) { f.bellOk = 1; achieve('klingel'); mood(4); await this.say('Isabell (Gegensprechanlage)', `¡Hola! Ihr habt es gefunden! „C.B.“ – Colba, ganz einfach. Kommt hoch, erster Stock. Lift links oder rechts, die Treppe ist in der Mitte. Der Lift rechts ist langsamer.`); await warpTo('colba_entry', 'entry'); }
    else { mood(-2); await this.say(null, 'Das war die falsche Klingel. Eine Nachbarin hat dich auf Valencianisch beschimpft. Nochmal versuchen – oder Isabell anrufen (Handy → Team).'); }
  },
  async isabellDesk() {
    if (!this.isHere('isabell', 'colba')) { await this.say(null, 'Isabells Pult: Agenda, Bestellzettel, ein Teller Mandeln. Sie ist unterwegs – Mittagessen organisieren.'); if (Math.random() < 0.5 && !G.S.flags['mand' + today()]) { G.S.flags['mand' + today()] = 1; consume('almendras'); UI.toast('Eine Handvoll Mandeln genommen.'); } return; }
    await this.talkTo('isabell');
  },
  async kickoff() {
    const f = G.S.flags;
    if (f.kickoff) return;
    G.busy++;
    await UI.announce('Dienstag 9:30', 'Kickoff', 'Business Context mit Robin');
    await this.say('Robin', 'Guten Morgen zusammen – buenos días. Ich bin Robin, zum ersten Mal dabei, und ich habe 24 Folien. Keine Sorge, ich überspringe die Hälfte. Das nächste halbe Jahr: E-Bike-Apps, die mit dem Bike über CANopen reden. Batteriepass. OTA-Updates. Und ein Händlerportal.');
    await this.say('Juanjo', 'Drei Teams, drei Räume. Indurain: Hardware-Nähe und Diagnose. Meeseeks: Android und iOS. Rocket: Web, Architektur, Batteriepass. Mittags gibt es Paella. Fragen?');
    await this.say('Fran', 'Eine: Welcher Index für den Battery State of Charge? – Ich weiss es. 0x6060. Nur so.');
    await this.say('Isabell', 'Und bitte: die Klingel. Ich schreibe sie trotzdem nicht an. Tradition.');
    await this.say('Simon', `Agenda steht am Whiteboard. Bis Freitag 15 Uhr braucht jedes Team einen Plan mit mindestens 80 % Commitment – Features geschätzt, Risiken geroamt, Abhängigkeiten geklärt. ${isPO() ? 'Du bist PO – dein Team schaut auf dich.' : 'Hilf deinem Team, wo du kannst.'}`);
    f.kickoff = 1; achieve('kickoff'); planAdd(myTeam(), 5);
    G.busy--;
    await this.say(null, `Dein Raum: ${TEAMS[myTeam()].room}. Dort: Planning Poker am Tisch, CANopen-Quiz mit Fran (Indurain), ROAM am Flipchart, Programm-Board am Whiteboard, Dependency-Board am Bildschirm. Jede Aktivität bringt den Plan weiter – pro Tag einmal.`);
  },
  async loungeScreen() {
    const f = G.S.flags, d = today(), h = hourOf(G.S.time);
    if (d === 1 && !f.kickoff) { if (h < 9.3) { await this.say(null, 'Der Bildschirm zeigt Robins Titelfolie: „Business Context – Colba 2026“. Er beginnt um 9:30.'); return; } await this.kickoff(); return; }
    if (d === 4 && h >= 14.5 && !f.final) { await this.finalPresentation(); return; }
    if (!f.kickoff) { await this.say(null, 'Der Bildschirm zeigt „PI PLANNING“. Der Kickoff ist am Dienstag um 9:30.'); return; }
    await this.say(null, `Der grosse Bildschirm: Plan-Stand aller Teams. Indurain ${Math.round(G.S.plan.indurain)} %, Meeseeks ${Math.round(G.S.plan.meeseeks)} %, Rocket ${Math.round(G.S.plan.rocket)} %. ${d === 4 ? 'Final um 15:00.' : 'Final am Freitag um 15:00.'}`);
  },
  async loungeTable() {
    const f = G.S.flags, d = today(), h = hourOf(G.S.time);
    if (d === 1 && !f.kickoff && h >= 9.3) { await this.kickoff(); return; }
    if (isWorkday() && LUNCH[d]) {
      const isBreakfast = d === 4;
      const ok = isBreakfast ? (h >= 8.5 && h < 10.5) : (h >= 13 && h < 14.5);
      if (ok) {
        const [item, name, text] = LUNCH[d];
        if (f['lunch' + d]) { await this.say(null, `Die ${name} ist aufgegessen. Isabell packt die Reste ein.`); return; }
        const o = await this.ask('Isabell', `${text} Hunger?`, ['Zugreifen!', 'Später']);
        if (o === 1) return;
        f['lunch' + d] = 1; consume(item); mood(6); passTime(35);
        achieve(['', 'paella', 'burgerday', 'bocata', 'healthy'][d]);
        await this.say(pick(COLBA.filter((id) => id !== G.S.pid)), pick(['¡Qué aproveche!', 'Der Socarrat ist das Beste. Der knusprige Reis am Boden.', 'Nach dem Essen: Siesta? – Nein, Planning.', 'Isabell, du bist die Beste.']));
        return;
      }
      await this.say(null, isBreakfast ? 'Healthy Breakfast am Freitag von 8:30 bis 10:30.' : `Der grosse Tisch. Mittagessen von 13:00 bis 14:30: ${LUNCH[d][1]}.`);
      return;
    }
    await this.say(null, 'Der grosse Tisch im Aufenthaltsraum. Hier gibt es Mittagessen, Präsentationen und Diskussionen über den Socarrat.');
  },
  async coffee() {
    if (G.S.coffees >= 6 && G.S.flags.coffeeDay === today()) { await this.say(null, 'Sechs Kaffees heute. Vicente schaut besorgt.'); return; }
    if (G.S.flags.coffeeDay !== today()) { G.S.flags.coffeeDay = today(); }
    consume('kaffee'); await this.say(null, pick(['Nespresso. George Clooney wäre stolz.', 'Kapsel rein, Knopf drücken, warten. Das Beste am Office.', 'Fran hat die Maschine auf CANopen umgebaut. Sagt er. Sie macht trotzdem nur Kaffee.']));
  },
  async fridge() { const o = await this.ask(null, 'Der Kühlschrank: Wasser, Cola, ein Tupperware mit dem Namen „VICENTE – NICHT ANFASSEN“.', ['Wasser nehmen', 'Cola nehmen', 'Vicentes Tupperware', 'Zu']); if (o === 0) consume('agua'); if (o === 1) consume('cola'); if (o === 2) { consume('tortilla'); mood(-2); await this.say('Vicente', '… das war meine Tortilla. Ich sag nichts. Aber ich merk es mir.'); } },
  async water() { consume('agua'); await this.say(null, 'Ein Becher Wasser. Gut gegen Mascletà-Staub und gestern Abend.'); },
  async sofa() { G.player.pose = 'sit'; passTime(20); energy(8); mood(2); await this.say(null, 'Zwanzig Minuten Sofa. Elena nennt es „Designpause“.'); },
  async balcony() {
    const f = G.S.flags;
    if (hasInv('zigaretten')) { takeUse('zigaretten'); G.S.st.nau = Math.max(0, G.S.st.nau - 5); mood(3); passTime(8); for (let k = 0; k < 6; k++) addPart({ x: G.player.x + rnd(-4, 4), y: G.player.y - 30, vy: -8, vx: rnd(-3, 3), life: 1.8, kind: 'smoke' }); }
    else { passTime(5); }
    if (this.isHere('dominique', 'colba') || this.schedule('dominique') === 'balcony') { if (!f.rauchpause) { f.rauchpause = 1; achieve('rauchpause'); } await this.say('Dominique', pick(['Hier entstehen die besten Ideen. Zum Beispiel: Rocket übernimmt das OTA-Update. Carlos weiss es noch nicht.', 'Blick auf den Turia-Park. Und auf 14 Kräne. Valencia baut.', 'Ich hab Salva das Rauchen abgewöhnt. Er vapt jetzt. Fortschritt.'])); }
    else await this.say(null, hasInv('zigaretten') ? 'Balkon, Blick auf den Turia-Park. Eine Zigarette später ist die Welt ruhiger.' : 'Der Balkon. Dominiques Revier – Aschenbecher, Blick auf den Park. Ohne Zigaretten: frische Luft.');
  },
  async wc() { passTime(5); G.S.st.nau = Math.max(0, G.S.st.nau - 8); await this.say(null, 'Office-WC. Jemand hat ein Post-it an den Spiegel geklebt: „Definition of Done?“'); },
  async testBench() {
    await this.say(null, 'Der CANopen-Prüfstand: ein Bike-Controller am Kabel, ein Oszilloskop, ein Laptop mit Frans Index-Tabelle.');
    if (this.isHere('fran', 'colba')) { await this.canopenQuiz(); return; }
    await this.say(null, 'Fran ist nicht da. Ohne ihn fasst man den Prüfstand besser nicht an – letztes Mal hat Guillem den Motor rückwärts laufen lassen.');
  },
  async bikeComputer(n) {
    const f = G.S.flags, d = today();
    const bike = n === 0 ? 'Bike 1 (rot, Werkstatt-Firmware 2.4)' : 'Bike 2 (blau, OTA-Kandidat)';
    const fran = this.isHere('fran', 'colba');
    const o = await this.ask(null, `Diagnose-PC, per CAN-Kabel am ${bike} angeschlossen. Auf dem Bildschirm laufen die CANopen-Objekte durch.`, ['Telemetrie lesen', 'Firmware flashen (OTA)', 'Fehlerspeicher löschen', 'Lassen']);
    if (o === 3) return;
    passTime(5);
    if (o === 0) {
      const soc = 35 + Math.floor(Math.random() * 60), temp = 24 + Math.floor(Math.random() * 20);
      await this.say(null, `0x6060 SOC ${soc} % · 0x6061 Spannung ${(36 + soc * 0.13).toFixed(1)} V · 0x6064 Motortemperatur ${temp} °C · 0x1001 Error-Register 0x00. Alles grün.`);
      if (!f.telemetry) { f.telemetry = 1; achieve('telemetrie'); }
      if (fran) await this.say('fran', pick(['Index 0x6060, Subindex 0. Merk dir das – kommt im Quiz.', 'Der Ladezustand kommt alle 100 Millisekunden per PDO. Wer das pollt, hat CANopen nicht verstanden.']));
      return;
    }
    if (o === 1) {
      if (!fran) {
        if (Math.random() < 0.35) { mood(-3); f['brick' + d] = 1; await this.say(null, 'Blocktransfer … 41 % … Verbindung weg. Das Bike blinkt rot. Bootloader-Modus. Fran wird das morgen reparieren – mit einem Blick, den du nicht vergessen wirst.'); return; }
        await this.say(null, 'SDO-Blocktransfer, 180 Sekunden, Neustart. Firmware 2.5 läuft. Glück gehabt – Fran hätte dich das nie allein machen lassen.'); mood(3); return;
      }
      await this.say('fran', 'OTA über CANopen: SDO-Blocktransfer, 1 Kilobyte pro Block, Checksumme am Ende. Schau zu.');
      await this.say(null, 'Drei Minuten Fortschrittsbalken. Fran redet derweil über Index-Tabellen. Neustart – Firmware 2.5 läuft. Das ist der Prototyp für die OTA-Story von Rocket.');
      if (!f['flash' + d]) { f['flash' + d] = 1; planAdd(teamOf('fran') === myTeam() ? myTeam() : 'indurain', 2); mood(3); }
      return;
    }
    await this.say(null, 'Fehlerspeicher: 3 Einträge (Unterspannung, CAN-Timeout, Drehmomentsensor). Gelöscht.');
    if (fran) await this.say('fran', 'Gelöscht?! Die wollte ich zuerst lesen. Der CAN-Timeout war mein Beweis gegen den Lieferanten.'); else await this.say(null, 'Fran wäre nicht begeistert – er liest Fehlerspeicher wie andere Leute Zeitungen.');
    mood(-1);
  },
  async officeBikes() {
    const d = today(), h = hourOf(G.S.time);
    if (d === 3 && h >= 15.5 && h < 18.5 && !G.S.flags.teamRide) { await this.teamRide(); return; }
    const o = await this.ask(null, 'Die Test-E-Bikes von Colba. Akku voll, Display an.', ['E-Bike ausleihen (Stadt)', 'Lassen']);
    if (o === 0) { G.S.flags.battery = 100; G.S.flags.bikeFrom = 'colba'; await this.say(null, 'Du ziehst das CAN-Kabel ab und schiebst ein Test-Bike durch die Lounge zum Lift. Unten geht die Fahrt los – im Office ist Fahren verboten (Isabell).'); G.S.flags.bikePending = 1; }
  },
  async bikeRental(kind) {
    if (G.player.bike) { await this.say(null, 'Du sitzt schon auf einem E-Bike.'); return; }
    if (kind === 'colba' && !G.S.flags.bikeOk) { if (!G.S.flags.colbaVisited) { await this.say(null, 'Colba-E-Bikes. Ohne Badge läuft hier nichts – erst oben vorstellen.'); return; } G.S.flags.bikeOk = 1; }
    const price = kind === 'colba' ? 0 : 12;
    const o = await this.ask(kind === 'colba' ? null : 'Bici Rent', kind === 'colba' ? 'Die Colba-Test-Bikes. Fran hat sie frisch geladen.' : `E-Bike-Miete: ${price} € für den Tag, Akku voll, Helm inklusive.`, [{ t: 'E-Bike nehmen', r: price ? fmtEur(price) : 'gratis' }, 'Nein danke']);
    if (o !== 0) return;
    if (price && !pay(price)) { await this.say('Bici Rent', 'Ohne Geld kein Bike.'); return; }
    this.bikeOn(100);
    await this.say(null, 'Aufgesessen! Mit dem E-Bike bist du doppelt so schnell – bis der Akku leer ist. Radweg im Turia-Park, Promenade am Strand. Mit A absteigen.');
  },
  bikeOn(bat) { G.player.bike = true; G.player.bikeCol = pick(['#2a9aa0', '#e2554a', '#f0a23a']); G.S.flags.battery = bat; G.S.flags.onBike = 1; achieve('ebike'); Snd.sfx('whirr'); },
  async bikeOff() { G.player.bike = false; G.S.flags.onBike = 0; await this.say(null, `Abgestiegen. Akku: ${Math.round(G.S.flags.battery || 0)} %. Das Bike steht jetzt hier – gut, dass Colba genug davon hat.`); },

  /* ---------- Teamraum: Planning ---------- */
  async teamTable(team) {
    const f = G.S.flags, d = today();
    if (!f.kickoff) { await this.say(null, 'Erst der Kickoff um 9:30 im Aufenthaltsraum.'); return; }
    const mine = team === myTeam();
    const here = TEAMS[team].members.filter((id) => id !== G.S.pid && this.isHere(id, 'colba') && this.schedule(id) === 'room');
    if (!mine) {
      if (!here.length) { await this.say(null, `${TEAMS[team].room}. Niemand da.`); return; }
      const o = await this.ask(null, `${TEAMS[team].n}: ${listNames(here)} am Tisch.`, ['Abhängigkeit verhandeln', 'Kurz plaudern', 'Weiter']);
      if (o === 0) { await this.depBoard(team); return; }
      if (o === 1) { await this.talkTo(pick(here)); }
      return;
    }
    const opts = [
      { t: 'Planning Poker: Features schätzen', r: f['poker' + d] ? 'heute erledigt' : '+10 %', disabled: !!f['poker' + d] },
      { t: 'CANopen-Index-Quiz mit Fran', r: f['can' + d] ? 'heute erledigt' : team === 'indurain' ? '+8 %' : 'Fran kommt vorbei · +8 %', disabled: !!f['can' + d] },
      { t: 'Mit dem Team reden', r: '+2 %' },
      'Weiter',
    ];
    const o = await this.ask(null, `${TEAMS[team].room}. ${here.length ? listNames(here) + ' sitzen am Tisch.' : 'Das Team ist gerade nicht da – die Laptops laufen trotzdem.'} Plan: ${Math.round(G.S.plan[team])} %.`, opts);
    if (o === 0) await this.poker(team);
    if (o === 1) await this.canopenQuiz();
    if (o === 2) { if (!here.length) { await this.say(null, 'Niemand da zum Reden. Mittagspause? Balkon?'); return; } await this.talkTo(pick(here)); if ((f['talk' + d] || 0) < 4) { f['talk' + d] = (f['talk' + d] || 0) + 1; planAdd(team, 2); } }
  },
  async poker(team) {
    const f = G.S.flags, d = today();
    if (f['poker' + d]) { await this.say(null, 'Planning Poker für heute erledigt. Morgen gibt es neue Features.'); return; }
    const res = await Mini.poker(team);
    if (!res) return;
    f['poker' + d] = 1;
    const gain = 4 + res.consensus * 2;
    planAdd(team, gain);
    if (res.consensus >= 3) achieve('poker');
    passTime(45);
    await this.say(null, `${res.consensus} von ${res.total} Features im Konsens geschätzt. Plan +${gain} %. ${res.consensus === res.total ? 'Das Team nickt zufrieden.' : 'Die Ausreisser diskutiert ihr morgen weiter.'}`);
  },
  async canopenQuiz() {
    const f = G.S.flags, d = today();
    if (!f.kickoff) { await this.say(null, 'Erst der Kickoff.'); return; }
    if (f['can' + d]) { await this.say('Fran', 'Heute schon gefragt. Morgen neue Indexe – ich kenne noch 2000 mehr.'); return; }
    await this.say('Fran', 'Objektverzeichnis, Objektverzeichnis. Jedes Bike-Signal hat einen Index. Ich frag, du antwortest. Bereit?');
    const res = await Mini.canopen();
    if (!res) return;
    f['can' + d] = 1;
    const gain = 2 + res.correct * 1.5;
    planAdd(myTeam(), gain);
    if (res.correct === res.total) { achieve('canopen'); if (!hasInv('canref')) { addInv('canref'); await this.say('Fran', 'Alle richtig. Hier, mein Spickzettel. Verlier ihn nicht – er ist handgeschrieben.'); } }
    passTime(30);
    await this.say('Fran', `${res.correct} von ${res.total}. ${res.correct === res.total ? '¡Perfecto!' : res.correct >= 3 ? 'Nicht schlecht für einen PO.' : 'Du brauchst mehr Zeit am Prüfstand.'} Plan +${gain} %.`);
  },
  async roam(team) {
    const f = G.S.flags, d = today();
    if (team !== myTeam()) { await this.say(null, `Das Risiko-Flipchart von ${TEAMS[team].n}. ${pick(['„Risiko: Carlos refactort alles.“ – Owned.', '„Risiko: Akku-Lieferant.“ – Mitigated.', '„Risiko: Fallas-Woche.“ – Accepted.'])}`); return; }
    if (!f.kickoff) { await this.say(null, 'Erst der Kickoff.'); return; }
    if (f['roam' + d]) { await this.say(null, 'Die Risiken sind heute geroamt. Morgen tauchen neue auf – das ist ihre Natur.'); return; }
    const res = await Mini.roam(team);
    if (!res) return;
    f['roam' + d] = 1;
    const gain = 2 + res.correct * 1.5;
    planAdd(team, gain);
    if (res.correct === res.total) achieve('roam');
    passTime(30);
    await this.say(null, `ROAM: ${res.correct} von ${res.total} Risiken sinnvoll eingeordnet (Resolved, Owned, Accepted, Mitigated). Plan +${gain} %.`);
  },
  async teamBoard(team) {
    const f = G.S.flags, d = today();
    if (team !== myTeam()) { await this.say(null, `Das Programm-Board von ${TEAMS[team].n}: ${Math.round(G.S.plan[team])} % geplant. Post-its in Teamfarbe, rote Fäden zu den anderen Teams.`); return; }
    if (!f.kickoff) { await this.say(null, 'Erst der Kickoff um 9:30.'); return; }
    if (f['board' + d]) { await this.say(null, 'Das Board ist für heute gefüllt. Post-its halten – meistens.'); return; }
    const res = await Mini.board(team);
    if (!res) return;
    f['board' + d] = 1;
    const gain = res.ok ? 10 : 4 + res.filled;
    planAdd(team, gain);
    if (res.ok) achieve('board');
    passTime(40);
    await this.say(null, `${res.ok ? 'Alle sechs Sprints gefüllt, keiner überlastet.' : `${res.filled} Sprints sauber, der Rest überlastet oder leer.`} Plan +${gain} %.`);
  },
  async depBoard(team) {
    const f = G.S.flags;
    if (!f.kickoff) { await this.say(null, 'Erst der Kickoff.'); return; }
    const mine = myTeam();
    const open = Object.entries(DEPS).filter(([k, dep]) => !G.S.deps[k] && ((dep.from === mine && dep.to === team) || (dep.to === mine && dep.from === team) || (team === mine && (dep.from === mine || dep.to === mine))));
    if (team === mine) {
      const list = Object.entries(DEPS).filter(([k, dep]) => dep.from === mine || dep.to === mine);
      await this.say(null, `Dependency-Board ${TEAMS[mine].n}: ` + list.map(([k, dep]) => `${dep.t} (${G.S.deps[k] ? 'geklärt ✓' : 'offen – mit ' + TEAMS[dep.from === mine ? dep.to : dep.from].n + ' verhandeln'})`).join(' · '));
      return;
    }
    if (!open.length) { await this.say(null, `Keine offenen Abhängigkeiten mit ${TEAMS[team].n}.`); return; }
    const lead = teamLead(team);
    if (!this.isHere(lead, 'colba')) { await this.say(null, `${fname(lead)} ist nicht da (${this.whereIs(lead).t}). Ohne Lead keine Verhandlung.`); return; }
    const [k, dep] = open[0];
    await this.say(lead, `${dep.t}? ${dep.d} Wann brauchst du es – beziehungsweise wann liefert ihr?`);
    const res = await Mini.deps(dep, team);
    if (!res) return;
    if (res.ok) { G.S.deps[k] = G.S.time; planAdd(mine, 6); planAdd(team, 3); mood(4); await this.say(lead, pick(['Deal. Ich schreib es auf das Board – roter Faden.', 'Passt in unseren Sprint. Abgemacht.', 'Okay, aber wenn Carlos refactort, verschiebt sich alles um einen Sprint. Nur dass du es weisst.'])); if (Object.entries(DEPS).filter(([kk, dd]) => dd.from === mine || dd.to === mine).every(([kk]) => G.S.deps[kk])) achieve('deps'); }
    else { mood(-2); await this.say(lead, 'So geht das nicht – der Sprint ist zu früh oder zu spät. Schau dir unsere Kapazität an und komm nochmal.'); }
    passTime(20);
  },
  async teamRide() {
    const f = G.S.flags;
    if (f.teamRide) return;
    const tm = TEAMS[myTeam()];
    await this.say('Aitor', `Ausfahrt! ${tm.n} fährt durch den Turia-Park bis zum Strand. Akku-Management ist Teil des Tests: Wer mit leerem Akku ankommt, trägt das Bike die Treppe hoch.`);
    const riders = ['me'].concat(tm.members.filter((id) => id !== G.S.pid).slice(0, 3), ['aitor'].filter((id) => !tm.members.includes('aitor')));
    const res = await Mini.ride({ riders });
    if (!res) return;
    f.teamRide = 1; achieve('teamride'); planAdd(myTeam(), 4); mood(8); passTime(90);
    await Scene.play('ride', { ms: 2200, text: 'Zurück ins Office …', riders, battery: res.battery });
    await this.say('Aitor', `${res.battery > 20 ? `Akku ${Math.round(res.battery)} % – sauber gefahren!` : 'Akku leer. Das Bike trägst du jetzt hoch.'} Und: Nach dem Fahren plant es sich leichter. Das ist wissenschaftlich bewiesen. Von mir.`);
  },
  async finalPresentation() {
    const f = G.S.flags;
    if (f.final) return;
    if (!(today() === 4 && hourOf(G.S.time) >= 14.5)) { await this.say(null, 'Die Final-Präsentation ist am Freitag um 15:00.'); return; }
    G.busy++;
    await UI.announce('Freitag 15:00', 'Final & Confidence Vote', 'Alle Teams präsentieren');
    const plans = Object.entries(TEAMS).map(([k, t]) => `${t.n}: ${Math.round(G.S.plan[k])} %`).join(', ');
    await this.say('Juanjo', `Drei Teams, drei Pläne. ${plans}. Jetzt stellt jedes Team seine Ziele vor – und dann stimmen wir ab, wie sicher wir uns sind: fünf Finger für „läuft“, ein Finger für „vergiss es“.`);
    await this.say(teamLead(myTeam()) === G.S.pid ? 'Danny' : teamLead(myTeam()), `${TEAMS[myTeam()].n}: ${G.S.plan[myTeam()] >= 80 ? 'Features geschätzt, Risiken geroamt, Abhängigkeiten sauber. Wir committen.' : G.S.plan[myTeam()] >= 50 ? 'Der Plan steht zur Hälfte. Wir committen auf die ersten drei Sprints, der Rest ist Forecast.' : 'Ehrlich gesagt: Wir haben zu wenig geplant. Viel Poker, wenig Board.'}`);
    G.busy--;
    const res = await Mini.confidence(G.S.plan[myTeam()]);
    G.busy++;
    const avg = res ? res.avg : 2.5;
    f.final = 1; f.finalScore = avg;
    if (avg >= 4) achieve('confidence');
    await this.say('Robin', avg >= 4 ? 'Durchschnitt über vier! Ich habe keine Ahnung, ob das normal ist, aber Simon sagt, das ist sehr gut. Bar Pepita, ich zahle.' : avg >= 3 ? 'Drei Komma irgendwas. Solide. Ich habe gelernt, was ein Sprint ist, und ihr habt einen Plan. Prost.' : 'Hm. Unter drei. Wir reden am Montag nochmal. Trotzdem: danke, Valencia.');
    await this.say('Isabell', 'Und jetzt alle raus: Das Office schliesst, der Samstag ist frei. Heimflug um 10:00 – das Taxi steht um 8:15 vor dem Hotel.');
    mood(10); G.busy--;
  },

  /* ---------- Asado bei Danny ---------- */
  async asadoWelcome() {
    const f = G.S.flags;
    if (f.asado) return;
    G.busy++;
    await UI.announce('Mittwochabend', 'Asado bei Danny', 'Garten, Grill, Pool, Bass');
    await this.say('danny', '¡Bienvenidos a mi casa! Das ist der Garten, das ist der Pool, das ist der Grill. Alles andere ist unwichtig. Chorizo ist fast fertig, Pollo braucht noch zwanzig Minuten. Bea hat Ropa Vieja mitgebracht.');
    await this.say('bea', 'Zwei Stunden geschmort. Wer es nicht probiert, bekommt morgen keine Code-Reviews.');
    await this.say('carlos', 'Und nach dem Essen: ein Solo. Danny hat die Nachbarn gewarnt. Die Nachbarn haben Ohrstöpsel gekauft.');
    f.asado = 1; achieve('asado'); mood(8);
    G.busy--;
    await this.say(null, 'Im Garten: Grill (A drücken zum Grillen), Gartentisch mit Mojitos und Ropa Vieja, Carlos’ Verstärker, Pool und Hängematte. Das Gartentor unten bringt dich per Taxi zurück in die Stadt.');
  },
  async dannyDoor() { await this.say('danny', pick(['Drinnen ist nur die Küche – und Beas Topf. Der Garten ist die Party.', 'Das Haus habe ich 2019 gekauft. Mit Garten, weil ich in Havanna auf einem Balkon im dritten Stock gegrillt habe. Die Nachbarn fanden das weniger lustig als ich.'])); },
  async grill() {
    const f = G.S.flags;
    const here = this.isHere('danny', 'danny_house') || f.asado;
    const o = await this.ask(here ? 'danny' : null, here ? 'Grillzange? Chorizo, Pollo oder Maiskolben – aber nicht verbrennen lassen. Der Grill ist heiss wie Havanna im August.' : 'Der Grill ist aus. Danny grillt nur, wenn Gäste da sind.', here ? [{ t: 'Chorizo wenden & essen' }, { t: 'Pollo asado' }, { t: 'Maiskolben' }, 'Nur zuschauen'] : ['Okay']);
    if (!here || o === 3) return;
    const timing = Math.random();
    const burnt = timing < 0.15 && G.S.st.prom > 1.2;
    const item = ['chorizo', 'pollo', 'maiz'][o];
    passTime(10);
    if (burnt) { mood(-2); await this.say('danny', '¡Ay, no! Verbrannt. Das war mein letzter Chorizo. Nein, Spass – hier, der nächste.'); }
    consume(item);
    f.grilled = (f.grilled || 0) + 1;
    if (f.grilled >= 3 && !burnt) achieve('grillmeister');
    await this.say(null, pick([`${ITEMS[item].n}. Rauch, Holzkohle, ein Hauch Limette – Danny marinert mit Mojo.`, 'Vom Grill direkt auf den Teller. Vicente fotografiert sein Essen, Estella isst seines.', 'Danny wendet mit der einen Hand und erklärt mit der anderen den Backlog.']));
  },
  async gardenTable() {
    const f = G.S.flags;
    if (!f.asado) { await this.say(null, 'Der Gartentisch: Gläser, Limetten, Hierbabuena. Vorbereitet für den Abend.'); return; }
    const o = await this.ask('bea', 'Setz dich. Ropa Vieja, Mojito nach Dannys Rezept – oder beides?', [{ t: 'Ropa Vieja' }, { t: 'Mojito cubano' }, { t: 'Beides' }, 'Später']);
    if (o === 3) return;
    G.player.pose = 'sit'; passTime(20);
    if (o === 0 || o === 2) consume('ropavieja');
    if (o === 1 || o === 2) { consume('mojito_c'); if (!f.mojito) { f.mojito = 1; if (f.cubaTalk) achieve('cuba'); else { f.cubaTalk = 1; achieve('cuba'); } } }
    await this.say(o === 0 ? 'bea' : 'danny', o === 0 ? 'Ropa Vieja heisst „alte Kleider“ – wegen der Fasern. Schmeckt besser, als es heisst.' : pick(['Hierbabuena, nicht Minze! Das ist der Unterschied zwischen Havanna und einer Hotelbar.', 'Havana Club 3 Años. In der Schweiz zahlt ihr dafür 40 Franken. Hier: 12 Euro. Sag es Robin nicht.']));
    for (const id of ['danny', 'bea', 'fran', 'estella', 'vicente']) if (id !== G.S.pid) G.S.fprom[id] = fprom(id) + 0.1;
  },
  async bassSolo() {
    const f = G.S.flags;
    if (!this.isHere('carlos', 'danny_house')) { await this.say(null, 'Ein kleiner Verstärker im Garten. Carlos ist noch nicht da – ohne ihn bleibt er stumm.'); return; }
    if (f.bassOn) { await this.say('carlos', 'Zugabe? Die Nachbarn … okay, eine noch. Kurz.'); Snd.sfx('brass'); mood(2); return; }
    await this.say('carlos', 'Okay. Ein Riff aus dem Proberaum. „Null Pointer“ – unser Opener. Danny, Licht aus, Grill an.');
    f.bassOn = 1; Snd.music('rock'); achieve('bass'); mood(8);
    const c = G.npcs.find((n) => n.id === 'carlos'); if (c) c.danceIdle = true;
    for (const n of G.npcs) if (n.id && n.id !== 'carlos' && n.pose !== 'sit') n.danceIdle = true;
    G.fx.shake = 0.6;
    for (let k = 0; k < 10; k++) addPart({ x: 24 * TS + rnd(-20, 20), y: 10 * TS - rnd(0, 30), vy: -20, life: 1.5, kind: 'note' });
    passTime(15);
    await this.say(null, 'Zwei Minuten Bass-Solo, Verzerrer auf elf, Dannys Hund flüchtet unter die Hängematte. Robin filmt, Luigi headbangt, Bea lächelt – zum ersten Mal diese Woche sichtbar. Das Fenster vom Nachbarhaus geht auf. Und wieder zu.');
    await this.say('carlos', 'Das war der Refrain. Die Strophe spielen wir am Samstag im Proberaum. Ihr seid eingeladen – aber ihr fliegt ja. Nächstes PI.');
  },
  async pool() { G.player.pose = 'sit'; passTime(15); G.S.st.sun = Math.max(0, G.S.st.sun - 15); mood(4); energy(5); G.S.st.wet = 8; await this.say(null, pick(['Füsse im Pool, Mojito in der Hand, der Grill raucht. Planning war gestern.', 'Luigi überlegt laut, ob man ein Kart im Pool fahren könnte. Danny sagt Nein. Luigi sagt: Schade.'])); },
  async hammock() { G.player.pose = 'sit'; passTime(25); energy(12); mood(4); await this.say(null, pick(['Hängematte zwischen zwei Orangenbäumen. Von hier aus klingt sogar Carlos’ Bass wie Schlafmusik.', 'Du schaukelst. Robin fragt, ob das Teambuilding ist. Danny: „Das ist Kuba.“'])); },
  async leaveDanny() {
    const o = await this.ask('danny', 'Schon los? Das Taxi kommt in fünf Minuten – ich zahle. Chorizo für den Weg?', ['Zurück zum Hotel', 'In die Bar Pepita', 'Noch bleiben']);
    if (o === 2) return;
    if (!G.S.flags.asado) G.S.flags.asado = 1;
    addInv('chorizo');
    await Scene.play('taxi', { ms: 2000, text: 'Zurück in die Stadt …' });
    passTime(20);
    if (o === 0) enterMap('city', 'hotel'); else enterMap('city', 'bar');
    await UI.fadeIn();
  },

  /* ---------- Stadt: Orte & Aktivitäten ---------- */
  async openGuard(k) {
    if (isOpen(k)) return true;
    await this.say(null, `Geschlossen. Öffnungszeiten: ${hoursStr(k)}.`);
    return false;
  },
  async photo(id) { addPhoto(id); await this.say(null, `<em>${SIGHTS[id].n}</em> – ${SIGHTS[id].f}`); },
  async fountain() { const o = await this.ask(null, 'Der Turia-Brunnen: der Flussgott und acht Frauen mit Krügen – die acht Bewässerungskanäle.', ['Münze werfen', 'Hände kühlen', 'Foto', 'Weiter']); if (o === 0) { if (pay(0.5)) { mood(2); await this.say(null, 'Plitsch. Wunsch: ein Plan mit 100 %.'); } } if (o === 1) { G.S.st.sun = Math.max(0, G.S.st.sun - 10); mood(2); await this.say(null, 'Erfrischend. Ein Tourist filmt dich dabei.'); } if (o === 2) await this.photo('virgen'); },
  async tribunal() {
    const d = today(), h = hourOf(G.S.time);
    if (d === 3 && h >= 11.9 && h < 12.6) { if (!G.S.flags.tribunal) { G.S.flags.tribunal = 1; achieve('tribunal'); } await this.say(null, 'Das Tribunal de las Aguas: acht Männer in schwarzen Kitteln auf Stühlen vor der Puerta de los Apóstoles. Ein Bauer klagt, ein anderer verteidigt sich – auf Valencianisch, mündlich, ohne Akten. Seit über tausend Jahren jeden Donnerstag um zwölf. Das Urteil: 30 Sekunden.'); mood(5); return; }
    await this.say(null, 'Die Puerta de los Apóstoles. Jeden Donnerstag um 12 Uhr tagt hier das Wassergericht – das älteste Gericht Europas, UNESCO-Kulturerbe.');
  },
  async atm() { if (G.S.flags.atmDay === today()) { await this.say(null, 'Der Bankomat kennt dich schon: „Tageslimite erreicht.“'); return; } const o = await this.ask(null, 'Bankomat. Deine Firmenkarte.', ['100 € abheben', '200 € abheben', 'Abbrechen']); if (o === 2) return; G.S.flags.atmDay = today(); addMoney(o === 0 ? 100 : 200); Snd.sfx('coin'); await this.say(null, 'Scheine raus. Die Spesenabrechnung macht Isabell.'); },
  async station() { await this.say(null, 'Estación del Norte, 1917: Orangen aus Keramik, Mosaike, Holzschalter. Der Schalterbeamte: „Zug nach Zürich? Das dauert 17 Stunden. Nehmen Sie das Flugzeug.“'); },
  async kart() {
    if (!await this.openGuard('kart')) return;
    const luigiHere = this.isHere('luigi', 'city') && this.schedule('luigi') === 'kart' && G.S.pid !== 'luigi';
    const o = await this.ask('Nico', `Kart Valencia: 10 Minuten, 22 €. ${luigiHere ? 'Luigi steht schon mit Helm da und grinst.' : 'Freie Bahn.'}`, [{ t: luigiHere ? 'Rennen gegen Luigi' : 'Zeitfahren', r: '22 €' }, 'Zuschauen']);
    if (o !== 0) return;
    if (!pay(22)) { await this.say('Nico', 'Ohne Ticket kein Kart.'); return; }
    achieve('kart');
    const res = await Mini.kart(luigiHere ? 'luigi' : null);
    passTime(25);
    if (!res) return;
    if (res.best && (!G.S.rec.kart || res.best < G.S.rec.kart)) G.S.rec.kart = res.best;
    if (res.win && luigiHere) { achieve('kartsieg'); addInv('pokal'); mood(8); await this.say('Luigi', 'Du hast mich geschlagen?! Die Bahn ist kaputt. Das Kart war kaputt. Nochmal! – Nein, okay. Der Pokal ist deiner. Vorerst.'); }
    else if (luigiHere) { mood(3); await this.say('Luigi', `Beste Runde ${res.best.toFixed(1)} Sekunden – aber meine war schneller. Erfahrung, Linie, Bremspunkt. Ich erklär es dir im Taxi.`); if (!G.S.flags.autofan) { G.S.flags.autofan = 1; achieve('autofan'); } }
    else { mood(4); await this.say('Nico', `Beste Runde: ${res.best.toFixed(1)} Sekunden. ${res.best < 20 ? '¡Muy bien!' : 'Die Linie durch die Haarnadel übt man.'}`); }
  },
  async padel() {
    if (!await this.openGuard('padel')) return;
    const opp = pick(['vicente', 'pablo', 'guillem', 'danny'].filter((id) => id !== G.S.pid));
    const o = await this.ask('Sergio', `Padel-Turnier! Doppel mit mir gegen ${fname(opp)} und einen Einheimischen. Schläger inklusive. 8 €.`, [{ t: 'Spielen', r: '8 €' }, 'Später']);
    if (o !== 0) return;
    if (!pay(8)) { await this.say('Sergio', 'Ohne Geld kein Court.'); return; }
    const res = await Mini.padel(opp);
    passTime(40); energy(-10);
    if (!res) return;
    G.S.rec.padel = Math.max(G.S.rec.padel || 0, res.me);
    if (res.win) { achieve('padel'); mood(8); await this.say(fname(opp), 'Vale, vale, ihr habt gewonnen. Die Wand ist unfair. Revanche am Strand?'); }
    else { mood(2); await this.say('Sergio', `${res.me}:${res.opp}. Beim Padel geht alles über die Wand – das lernt man.`); }
  },
  async bouncer() { if (!isOpen('disco')) { await this.say('Türsteher Manolo', 'Ab 23 Uhr. Vorher: Jamón, Bodega, Spaziergang.'); return; } if (G.S.st.prom > 2.2) { await this.say('Türsteher Manolo', 'Nein. Heute nicht. Geh ins Hotel, trink Wasser.'); return; } await this.say('Türsteher Manolo', 'Pasa, pasa. Keine Fotos vom DJ.'); },
  async lifeguard() { await this.say('Jordi', pick(['Gelbe Flagge heute. Baden ja, Surfen eher nicht.', 'Sonnencreme! Ich sehe das Schweizer Rot schon von hier.', 'Die Möwen klauen Bocadillos. Ich warne nur.'])); },
  async soccer() {
    const opp = pick(['vicente', 'aitor', 'pablo', 'chris'].filter((id) => id !== G.S.pid));
    const o = await this.ask(null, `Strandfussball! ${fname(opp)} steht im Tor. Fünf Schüsse, fünf gehalten – wer gewinnt?`, ['Elfmeterschiessen', 'Lieber nicht']);
    if (o !== 0) return;
    const res = await Mini.soccer(opp);
    passTime(30); energy(-8); G.S.st.sun += 5;
    if (!res) return;
    G.S.rec.soccer = Math.max(G.S.rec.soccer || 0, res.me);
    if (res.win) { achieve('fussball'); mood(7); await this.say(fname(opp), `${res.me}:${res.opp}. Du hast gewonnen – der Sand hat mich gebremst. Sagt jeder Torwart.`); }
    else { mood(2); await this.say(fname(opp), `${res.me}:${res.opp} für mich. Amunt València!`); }
  },
  async paellaContest() {
    if (!await this.openGuard('paella')) return;
    const o = await this.ask('Abuela Carmen', 'Paella-Wettbewerb! Zutaten in der richtigen Reihenfolge, rühren im richtigen Moment, Socarrat am Ende. Teilnahme 10 €, der Sieger isst gratis.', [{ t: 'Mitkochen', r: '10 €' }, 'Zuschauen']);
    if (o !== 0) return;
    if (!pay(10)) { await this.say('Abuela Carmen', 'Sin dinero no hay arroz.'); return; }
    const res = await Mini.paella();
    passTime(60);
    if (!res) return;
    if (res.score >= 80) { achieve('paellachef'); consume('paella'); mood(10); await this.say('Abuela Carmen', `${res.score} Punkte! Socarrat perfekt. Du hast mehr Talent als mein Schwiegersohn. Iss.`); }
    else { mood(2); consume('tapas'); await this.say('Abuela Carmen', `${res.score} Punkte. ${res.score >= 50 ? 'Essbar. Beim nächsten Mal: Safran NACH dem Wasser.' : 'Das ist kein Paella, das ist Risotto. Hier, Tapas zum Trost.'}`); }
  },
  async surf() {
    const h = hourOf(G.S.time);
    const chris = G.S.pid !== 'chris' && this.schedule('chris') === 'beach';
    const o = await this.ask(null, chris ? 'Chris paddelt raus. „Komm, die Welle ist klein, aber sie ist da!“' : 'Das Meer. Noch kühl im März.', [chris ? 'Mit Chris surfen' : 'Baden gehen', 'Füsse ins Wasser', 'Lieber nicht']);
    if (o === 2) return;
    if (o === 1) { G.S.st.sun = Math.max(0, G.S.st.sun - 10); mood(3); await this.say(null, 'Kalt! Aber gut. Die Zehen leben noch.'); return; }
    passTime(40); G.S.st.wet = 20; energy(-10); mood(8); G.S.st.sun = Math.max(0, G.S.st.sun - 15);
    if (chris) { achieve('surf'); await this.say('Chris', 'Siehst du? Jede Welle ist ein Sprint: Anpaddeln, aufstehen, geniessen, auslaufen. Retrospektive im Wasser.'); if (!hasInv('surfwax') && Math.random() < 0.5) { addInv('surfwax'); await this.say('Chris', 'Hier, ein Stück Wax. Riecht nach Fuerte.'); } }
    else await this.say(null, 'Ein Bad im Mittelmeer im März. Die Einheimischen schauen, als wärst du verrückt. Vielleicht bist du das.');
  },
  async beachChill() { if (G.S.st.sun > 60 && !(G.S.flags.creme && G.S.time - G.S.flags.creme < 240)) { await this.say(null, 'Du bist schon rot. Lieber in den Schatten.'); return; } G.player.pose = 'sit'; passTime(45); energy(10); mood(5); G.S.st.sun += 10; await this.say(null, pick(['45 Minuten Liege. Möwen, Wellen, ein Verkäufer mit Mojitos im Eimer.', 'Du döst weg. Das Planning ist weit weg. Bis dein Handy vibriert: Isabell fragt nach der Paella-Bestellung.'])); },
  async sail() {
    if (!await this.openGuard('sail')) return;
    const o = await this.ask('Marina', 'Segeltörn im Hafen: Du am Ruder, ich am Grosssegel. Durch die Bojen, gegen den Wind, zurück zur Marina. 35 €.', [{ t: 'Segel setzen', r: '35 €' }, 'Nur schauen']);
    if (o !== 0) return;
    if (!pay(35)) { await this.say('Marina', 'Ohne Geld kein Boot.'); return; }
    await Scene.play('boat', { ms: 2200, text: 'Leinen los …' });
    const res = await Mini.sail();
    passTime(75); G.S.st.sun += 8;
    if (!res) return;
    G.S.rec.sail = Math.max(G.S.rec.sail || 0, res.buoys);
    if (res.buoys >= res.total) { achieve('segeln'); mood(10); await this.say('Marina', `Alle ${res.total} Bojen gerundet! Du hast das Gefühl für den Wind. America’s Cup, nächstes Jahr.`); }
    else { mood(4); await this.say('Marina', `${res.buoys} von ${res.total} Bojen. Der Wind dreht, das Boot auch. Nochmal?`); }
  },
  async wine() {
    if (!await this.openGuard('bodega')) return;
    const o = await this.ask('Inés', 'Degustation: vier Weine aus Utiel-Requena und Alicante, blind. Du sagst, welche Traube. 15 €.', [{ t: 'Degustieren', r: '15 €' }, { t: 'Nur ein Glas Bobal', r: '4 €' }, 'Später']);
    if (o === 2) return;
    if (o === 1) { if (pay(4)) consume('vino'); return; }
    if (!pay(15)) { await this.say('Inés', 'Ohne Geld kein Wein.'); return; }
    const res = await Mini.wine();
    passTime(50);
    if (!res) return;
    for (let k = 0; k < 4; k++) consume('vino', { silent: true });
    checkThresholds();
    if (res.correct === res.total) { achieve('wein'); mood(8); await this.say('Inés', 'Alle vier! Bobal, Monastrell, Tempranillo, Garnacha. Du hast eine Nase. Oder Glück. Salud.'); }
    else { mood(3); await this.say('Inés', `${res.correct} von ${res.total}. Der Bobal ist der mit der Kirsche. Merk dir das – er ist der Wein von Valencia.`); }
  },
  async jamonTalk() { await this.say('Ramón', pick(['Bellota heisst: Das Schwein hat Eicheln gefressen. 36 Monate gereift. Hauchdünn geschnitten, sonst ist es Verschwendung.', 'Die Schweizer essen Jamón mit Brot. Die Valencianer mit den Fingern. Beides erlaubt.', 'Ein Jamón, zwanzig Kilo, zwei Wochen. Wenn man es richtig macht.'])); await this.shop('jamon'); },
  async dj() { await this.say('DJ Álex', pick(['Reggaeton, Techno, ein bisschen Rumba. Was willst du?', 'Tanzfläche voll, Bass voll. Lass dich sehen!', 'Luigi hat sich „Formula 1 Theme“ gewünscht. Nein.'])); },
  async dance() {
    const res = await Mini.dance();
    passTime(25); energy(-10);
    if (!res) return;
    G.S.rec.dance = Math.max(G.S.rec.dance || 0, res.pct);
    if (res.pct >= 80) { achieve('disco'); mood(10); await this.say('DJ Álex', `${res.pct} %! Die Tanzfläche gehört dir.`); }
    else { mood(4); await this.say(null, `${res.pct} % der Beats getroffen. ${res.pct > 50 ? 'Die Hüfte lockert sich.' : 'Agua de Valencia hilft nicht beim Rhythmus.'}`); }
  },
  async discoSofa() { G.player.pose = 'sit'; passTime(20); energy(6); await this.say(null, 'Lounge-Sofa. Der Bass massiert den Rücken.'); },
  async painting(i, n, f) { G.S.flags.paint = G.S.flags.paint || {}; G.S.flags.paint[i] = 1; await this.say(null, `<em>${n}</em> – ${f}`); mood(2); if (Object.keys(G.S.flags.paint).length >= 6) achieve('museum'); },
  async guard() { await this.say('Señor Ferrer', pick(['Kein Blitz, bitte. Und nicht so nah an den Velázquez.', 'Das Museum ist das zweitgrösste Spaniens, nach dem Prado. Sagen wir hier gern.', 'Sorolla hat am Strand gemalt, wo heute die Chiringuitos stehen.'])); },
  async fishTalk() { await this.say('Toni', pick(['¡Dorada, lubina, sepia! Alles heute Morgen aus dem Golf.', 'Du willst Fisch ins Hotel mitnehmen? Marta wird nicht begeistert sein.', 'Kauf eine Dorada für Isabell. Sie liebt Fisch. Sagt jedenfalls Vicente.'])); await this.shop('fisch'); },

  /* ---------- Gespräche ---------- */
  async talkTo(id, n) {
    const f = G.S.flags, d = today(), h = hourOf(G.S.time), s = G.S.stage;
    if (G.map.id === 'airport' && s === 'sammeln' && !f.met[id]) { await this.meetAtAirport(id, n); return; }
    if (G.map.id === 'airport' && s === 'koffer') { await this.say(id, 'Hol erst deinen Koffer – Band 3.'); return; }
    const lines = this.lines(id);
    const o = await this.ask(id, pick(lines.hello), lines.topics.map((t) => t.t).concat(['Bis später']));
    if (o >= lines.topics.length) return;
    await lines.topics[o].f();
  },
  async meetAtAirport(id, n) {
    const f = G.S.flags;
    const L = {
      robin: ['Robin', 'Ah, da bist du! Ich stehe seit zwanzig Minuten hier und mein Koffer kommt nicht. – Das ist Band 4, Leipzig? Oh. Das erklärt den Mann mit dem Sachsen-Trikot.'],
      luigi: ['Luigi', 'Schau dir das an: Cupra Formentor, 310 PS, für 89 Euro am Tag. Wir könnten … – Nein? Taxi? Okay. Aber Mittwoch Kartbahn.'],
      dominique: ['Dominique', 'Man darf hier drin nicht rauchen. Ich hab’s versucht. Der Sicherheitsmann war sehr freundlich und sehr bestimmt. Gehen wir?'],
      lukas: ['Lukas', 'Mein Koffer ist noch nicht da, aber ich hab den Batteriepass-Entwurf dabei. 40 Seiten. Willst du … später. Verstehe.'],
      simon: ['Simon', 'Da bist du. Taxi ist bestellt, Hotel bestätigt, Bar für 19 Uhr reserviert. Robin steht am falschen Band – ich geh ihn holen. Nein, du gehst.'],
    }[id];
    await this.say(L[0], L[1]);
    f.met[id] = 1; n.bubble = null; n.bubbleT = 0; mood(2);
    if (id === 'robin') f.robinHelped = (f.robinHelped || 0) + 1;
    if (id === 'lukas') { addInv('batterypass'); UI.toast('Lukas gibt dir den Battery-Pass-Flyer (Tasche).'); }
    const miss = this.airportGroup().filter((x) => !f.met[x]);
    if (!miss.length) { this.setStage('taxi'); await this.say(null, 'Alle beisammen! Der Ausgang ist unten – dort stehen die Taxis.'); }
    else UI.hud();
  },
  lines(id) {
    const f = G.S.flags, me = G.S.pid, d = today(), h = hourOf(G.S.time), tm = myTeam();
    const plan = Math.round(G.S.plan[tm]);
    const base = { hello: ['Hola!'], topics: [] };
    const planTopic = { t: 'Wie steht der Plan?', f: async () => { await this.say(id, `${TEAMS[teamOf(id) || tm].n}: ${Math.round(G.S.plan[teamOf(id) || tm])} %. ${plan < 40 ? 'Da fehlt noch viel – Poker, Board, Risiken.' : plan < 80 ? 'Auf gutem Weg. Die Abhängigkeiten nicht vergessen.' : 'Commitment-reif. Freitag wird gut.'}`); } };
    const P = {
      simon: { hello: ['Alles im Plan?', 'Hast du die Agenda gesehen?', 'Reservierung für Donnerstag steht.'], topics: [planTopic, { t: 'Was steht heute an?', f: async () => this.say('simon', this.objective()) }, { t: 'Organisation', f: async () => this.say('simon', pick(['Taxi Samstag 8:15, Flug 10:00. Ich hab es dreimal bestätigt.', 'Isabell und ich haben den Mittagsplan: Di Paella, Mi Burger, Do Bocadillos, Fr Healthy.', 'Jeder hat seinen Raum. Jeder hat Post-its. Was kann schiefgehen.'])) }] },
      luigi: { hello: ['Hast du die Autos hier gesehen?', 'Mittwoch: Kartbahn.', 'Ein Seat León mit 300 PS …'], topics: [planTopic, { t: 'Über Autos reden', f: async () => { await this.say('luigi', pick(['Der Taxifahrer hatte einen Toledo. Ein Toledo! Die gibt es seit 2019 nicht mehr.', 'Cupra, das ist Seat mit Attitüde. Und Kupferfarbe.', 'Wenn ich reich bin: Alpine A110. Leicht, französisch, laut.', 'E-Bikes sind auch Autos. Nur ohne Dach. Und ohne Motor. Also, mit kleinem Motor.'])); if (!f.autofan) { f.autofan = 1; achieve('autofan'); } } }, { t: 'Kartbahn?', f: async () => this.say('luigi', d === 2 && h < 18 ? 'Heute Abend ab 18 Uhr bin ich dort. Südwesten der Stadt. Bring Mut mit.' : 'Mittwochabend. Ich bin dort. Du wirst verlieren.') }] },
      dominique: { hello: ['Kommst du mit auf den Balkon?', 'Hast du Feuer?', 'Rocket ist bereit.'], topics: [planTopic, { t: 'Rauchpause?', f: async () => { if (G.map.id === 'colba') { await this.say('dominique', 'Balkon, oben rechts im Aufenthaltsraum. Ich geh vor.'); } else await this.say('dominique', 'Hier? Gern. Aber nur, wenn du eine hast.'); } }, { t: 'Team Rocket', f: async () => this.say('dominique', pick(['Carlos refactort, Salva lernt, Aitor löst. Und Lukas erklärt den Batteriepass. Beste Mischung.', 'Rocket macht das Händlerportal und die Battery-Pass-API. Und OTA, wenn Indurain liefert.'])) }] },
      robin: { hello: ['Sag mal, wo ist nochmal der Aufenthaltsraum?', 'Ist das normal, dass alle Post-its kleben?', 'Mein erstes PI Planning. Aufregend.'], topics: [{ t: 'Den Weg zeigen', f: async () => { f.robinHelped = (f.robinHelped || 0) + 1; mood(2); await this.say('robin', pick(['Danke. Ich hatte den Lift rechts genommen – der hält im Zwischengeschoss.', 'Ah, der Aufenthaltsraum ist rechts. Ich war im WC. Zweimal.', 'Ihr seid alle so geduldig mit mir.'])); if (f.robinHelped >= 3) achieve('robin'); } }, planTopic, { t: 'Business Context', f: async () => this.say('robin', f.kickoff ? 'Meine Folien kamen an, oder? Fran hat gelacht. Ich glaube, es war ein gutes Lachen.' : '24 Folien. Ich übe noch. Was heisst nochmal „Commitment“ auf Spanisch?') }] },
      lukas: { hello: ['Wusstest du, dass jede Batterie ab 2027 einen Pass braucht?', 'Der Entwurf hat 40 Seiten.', 'Grüezi.'], topics: [planTopic, { t: 'Battery Pass erklären lassen', f: async () => { await this.say('lukas', 'EU-Batterieverordnung: Jede E-Bike-Batterie bekommt einen digitalen Pass. QR-Code drauf, Daten dahinter: Herkunft, Kapazität, CO₂-Fussabdruck, Zustand. Rocket baut die API, Meeseeks zeigt es in der App. Und die Zelle meldet ihren State of Health über CANopen – Index 0x6080, falls Fran fragt.'); if (!f.battery) { f.battery = 1; achieve('battery'); planAdd(tm, 1); } } }, { t: 'Schweiz vs. Spanien', f: async () => this.say('lukas', pick(['Hier isst man um 14 Uhr Mittag. Mein Magen ist auf Berner Zeit.', 'Die Mascletà ist lauter als das Zibelemärit-Feuerwerk. Viel lauter.', 'Ich hab Rivella im Koffer. Nur für Notfälle.'])) }] },
      pascal: { hello: ['Nu, alles klar?', 'SwiftUI ist die Zukunft.', 'Club Mate?'], topics: [planTopic, { t: 'Wie war die Anreise?', f: async () => { await this.say('pascal', 'Leipzig – Frankfurt – Valencia. In Frankfurt drei Stunden Verspätung, aber ich hab dabei das Onboarding-Flow neu gebaut. Guillem wird es lieben. Oder hassen. Beides okay.'); if (!f.leipzig) { f.leipzig = 1; achieve('leipzig'); } } }, { t: 'iOS bei Meeseeks', f: async () => this.say('pascal', pick(['Pablo und Guillem machen die UI, ich die CAN-Bridge. Alles in Swift, alles typsicher.', 'Oscar ist der ruhigste Mensch, den ich kenne. Sein Code auch.'])) }] },
      chris: { hello: ['Wind kommt auf.', 'Morgen früh am Strand?', 'Aloha – falsch, hola.'], topics: [planTopic, { t: 'Fuerteventura?', f: async () => { await this.say('chris', 'Fuerte: Wind, Wellen, Wüste. Ich arbeite vom Van aus, Starlink auf dem Dach. Die Roadmap entsteht zwischen zwei Sessions. Hier in Valencia ist die Welle klein, aber das Licht ist besser.'); if (!f.fuerte) { f.fuerte = 1; achieve('fuerte'); } } }, { t: 'Roadmap', f: async () => this.say('chris', pick(['Die Roadmap ist ein Surfbrett: Richtung klar, Weg flexibel.', 'Drei Themen fürs halbe Jahr: Batteriepass, Diagnose, Händlerportal. Alles andere ist Schaum.'])) }] },
      danny: { hello: ['¡Oye, asere! Indurain fährt vorne.', 'Hola, jefe.', 'Wir brauchen den Parser von Carlos.', 'Mittwochabend: Asado bei mir im Garten. Keine Ausreden.'], topics: [planTopic, { t: 'Team Indurain', f: async () => this.say('danny', pick(['Fran kennt die Hardware, Bea das Backend, Vicente die Pipeline, Estella alles andere. Ich halte die Fäden.', 'Wir heissen Indurain, weil wir im Tempo bleiben. Fünf Tour-Siege, kein Sprinter.'])) }, { t: 'Kuba', f: async () => { await this.say('danny', pick(['Havanna, Vedado. Mit 24 nach Valencia – das Licht ist dasselbe, nur der Kaffee ist schlechter. Bea kommt aus Santiago, wir haben uns hier im Büro kennengelernt und auf Spanisch mit kubanischem Akzent gestritten.', 'In Kuba lernt man, mit dem zu bauen, was da ist. Ein 57er Chevy läuft mit einem Lada-Motor. Genau so refactoren wir den CAN-Parser.', 'Mein Mojito-Rezept: Hierbabuena, nicht Minze. Brauner Zucker, Limette, Havana Club 3 Años, Soda. Mittwoch im Garten zeig ich es euch.'])); if (!f.cubaTalk) f.cubaTalk = 1; } }, { t: 'Dein Haus', f: async () => this.say('danny', d < 2 ? 'Vorort, zwanzig Minuten mit dem Taxi. Garten, Pool, Hängematte und ein Grill, auf den ich stolzer bin als auf jedes Release. Mittwoch ab 19 Uhr seid ihr alle eingeladen – Taxi nehmen, ich zahle den Rückweg.' : d === 2 ? 'Heute Abend! Taxi vor dem Hotel oder an der Estación: „Zu Danny“. Ich bin ab sieben am Grill.' : 'Der Grill ist noch warm von gestern. Nächstes Mal bleibt ihr länger.') }] },
      fran: { hello: ['0x6060. Frag nicht, sag es einfach.', 'Der Prüfstand läuft.', 'CANopen ist ein Objektverzeichnis mit Gefühlen.'], topics: [{ t: 'CANopen-Quiz', f: () => this.canopenQuiz() }, { t: 'Über Hardware reden', f: async () => this.say('fran', pick(['Der Motorcontroller spricht CANopen mit 250 kBit/s. Mehr braucht ein Bike nicht.', 'SDO ist Fragen und Antworten. PDO ist Schreien. Das Bike schreit die Geschwindigkeit, alle zehn Millisekunden.', 'Heartbeat 0x1017. Wenn das Bike nicht mehr schlägt, ist es tot. Oder der Stecker ist raus.'])) }] },
      estella: { hello: ['¡Hola! Ich hab eine Idee!', 'Können wir das heute noch einbauen?', 'Ich bin früh da, ich geh spät.'], topics: [planTopic, { t: 'Deine Idee?', f: async () => { await this.say('estella', pick(['Ein Dashboard, das den Akku als Orange anzeigt. Je leerer, desto weniger Spalten!', 'Wir könnten das Diagnose-Tool in einer Woche bauen. Danny sagt drei. Wir treffen uns bei zwei.', 'Ich hab gestern bis elf den CAN-Logger umgebaut. Fran hat es gemerkt. Er hat nichts gesagt. Das heisst: gut.'])); planAdd(tm === 'indurain' ? tm : 'indurain', 0.5); } }] },
      bea: { hello: ['…hola.', 'Der Service läuft.', 'Ich hab das Backend gestern migriert. Niemand hat es gemerkt – gut.'], topics: [planTopic, { t: 'Backend', f: async () => this.say('bea', pick(['Telemetrie rein, Events raus. Postgres, Kafka, ein bisschen Rust.', 'Ich rede nicht viel. Mein Code auch nicht. Er funktioniert einfach.'])) }, { t: 'Kuba', f: async () => { await this.say('bea', pick(['Santiago de Cuba. Dort ist es lauter als hier – ich bin die Ruhige, weil zuhause alle reden. Danny ist aus Havanna, das merkt man: Er redet für zwei.', 'Programmieren habe ich in Santiago gelernt, mit einem Rechner, den sich zwanzig Leute geteilt haben. Deshalb schreibe ich kleine Funktionen.', 'Mittwoch bringe ich Ropa Vieja mit. Rindfleisch, lange geschmort, mit Paprika. Danny grillt, ich koche. Arbeitsteilung wie im Team.'])); if (!f.cubaTalk) f.cubaTalk = 1; } }] },
      vicente: { hello: ['Pipeline grün.', 'Hast du meine Tortilla gegessen?', 'Deploy ist Freitag. Wie immer. Leider.'], topics: [planTopic, { t: 'DevOps', f: async () => this.say('vicente', pick(['Kubernetes, ArgoCD, Grafana. Und ein Bash-Skript von 2019, das niemand anfasst.', 'Burger-Mittwoch ist mein Werk. Der Foodtruck gehört meinem Cousin.'])) }] },
      juanjo: { hello: ['¿Todo bien?', 'Colba wächst. Ihr seid Teil davon.', 'Android first – aber sag es Pascal nicht.'], topics: [planTopic, { t: 'Colba', f: async () => this.say('juanjo', pick(['Angefangen mit zwei Leuten und einer Android-App für einen Bike-Händler. Heute dreizehn. Und ihr.', 'Das Hochhaus war günstig, weil niemand die Klingel findet. Ich scherze. Halb.'])) }] },
      oscar: { hello: ['Hm.', 'Die Spezifikation ist unklar.', 'Ich hab es getestet. Dreimal.'], topics: [planTopic, { t: 'Android', f: async () => this.say('oscar', pick(['Kotlin, Compose, Clean Architecture. Keine Kompromisse.', 'Ein Bug ist ein Missverständnis zwischen Spezifikation und Realität. Ich kläre es.'])) }] },
      pablo: { hello: ['Hola! Meine Schwester hat das Design fertig.', 'iOS, Strand, iOS.', 'Elena sagt, der Button ist zu klein. Elena hat immer recht.'], topics: [planTopic, { t: 'Elena & du', f: async () => this.say('pablo', 'Geschwister im gleichen Team: Sie designt, ich baue. Beim Mittagessen reden wir über Mama. Beim Code-Review nicht.') }] },
      guillem: { hello: ['Hey! Hast du das neue iOS-Beta gesehen?', 'Ich lerne von Pascal. Und von Oscar. Und von YouTube.', '¡Vamos!'], topics: [planTopic, { t: 'Der Junge im Team', f: async () => this.say('guillem', pick(['Ich bin 23 und hab schon drei Apps im Store. Zwei davon sind gut.', 'Pascal zeigt mir SwiftUI-Tricks. Ich zeig ihm, wo man in Valencia tanzen geht.'])) }] },
      elena: { hello: ['Hola. Das Design-System ist fast fertig.', 'Kannst du das UI anschauen?', 'Farben, Abstände, Typografie. Der Rest ist Code.'], topics: [planTopic, { t: 'Design-System', f: async () => this.say('elena', pick(['Komponenten für alle Apps: Buttons, Karten, der Akku-Ring. Indurain nutzt sie für die Werkstatt-App.', 'Ich hab die Teamfarben gewählt: Rot für Indurain, Blau für Meeseeks, Orange für Rocket. Post-its passend.'])) }] },
      carlos: { hello: ['Das muss refactort werden.', 'Architektur zuerst.', 'Wer hat diesen Parser geschrieben? Ah. Ich. 2019.', 'Samstag Konzert. Hardrock. Ich bin am Bass.'], topics: [planTopic, { t: 'Refactoring', f: async () => this.say('carlos', pick(['Der CAN-Parser hat 4000 Zeilen in einer Datei. Nach dem Refactoring: 40 Dateien mit 100 Zeilen. Besser? Ja. Schneller? Wir werden sehen.', 'Ein Sprint Refactoring spart drei Sprints Bugs. Das sage ich jedem PO. Dominique hört zu.'])) }, { t: 'Deine Band', f: async () => { await this.say('carlos', pick(['„Stack Overflow“ – vier Entwickler, ein Proberaum in Benimaclet, Hardrock. Ich spiele Bass, weil der Bass die Architektur ist: Man hört ihn nicht, aber ohne ihn fällt alles zusammen.', 'Ein Riff ist auch nur eine Funktion: klein, wiederverwendbar, laut. Unser Drummer refactort nie. Darum spielen wir alles in E.', 'Mittwoch bei Danny bringe ich den Bass und den kleinen Verstärker mit. Nach dem Essen gibt es ein Solo. Die Nachbarn kennen es schon.'])); if (!f.bandTalk) { f.bandTalk = 1; mood(2); } } }] },
      salva: { hello: ['Kann ich dabei sein?', 'Ich hab das Buch über SAFe gelesen. Ganz.', 'Erklär mir das nochmal?'], topics: [planTopic, { t: 'Etwas erklären', f: async () => { await this.say('salva', pick(['Ein PI ist ein halbes Jahr? – Fünf Sprints plus einer für Innovation. Okay. Und das Board? – Alles klar, ich schreib es auf.', 'Lukas hat mir den Batteriepass erklärt. Zweimal. Ich glaube, ich kann ihn jetzt bauen.'])); planAdd('rocket', 0.5); mood(2); } }] },
      aitor: { hello: ['Heute 60 Kilometer vor der Arbeit.', 'Es gibt immer eine Lösung.', 'Donnerstag Ausfahrt!'], topics: [planTopic, { t: 'Ausfahrt', f: async () => { if (d === 3 && h >= 15.5 && h < 18.5 && !f.teamRide && G.map.id === 'colba') await this.teamRide(); else await this.say('aitor', d === 3 ? 'Nachmittag ab halb vier, E-Bike-Raum neben der Lounge. Turia-Park bis zum Strand.' : 'Donnerstagnachmittag fahren wir mit dem ganzen Team. Bis dahin: Turia-Park, jeden Morgen, allein.'); } }, { t: 'Lösungsorientiert?', f: async () => this.say('aitor', pick(['Jedes Problem ist ein Anstieg. Oben wartet die Abfahrt.', 'Rocket hat drei Leute und zehn Features. Lösung: fünf Features. Fertig.'])) }] },
      isabell: { hello: ['Habt ihr die Klingel gefunden?', 'Mittagessen ist bestellt.', 'Ich organisiere, ihr plant.'], topics: [{ t: 'Hilfe anbieten', f: async () => { if (f['isa' + d]) { await this.say('isabell', 'Heute ist alles organisiert. Danke!'); return; } f['isa' + d] = 1; passTime(15); mood(3); const n = (f.isaHelp = (f.isaHelp || 0) + 1); await this.say('isabell', pick(['Kannst du die Stühle in den Aufenthaltsraum tragen? Danke! Du bist der Erste, der fragt.', 'Die Paella-Bestellung: 22 Portionen, zwei Vegetarier, ein Chris, der alles isst. Erledigt.', 'Hilf mir mit den Namensschildern – Robin hat seines im Hotel gelassen.'])); if (n >= 2) achieve('isabell'); } }, { t: 'Die Klingel', f: async () => this.say('isabell', 'Sie steht nicht dran. „C.B. Soluciones, 1º B“. Juanjo findet das lustig. Ich nicht. Aber ich lasse es so.') }, { t: 'Spesen', f: async () => this.say('isabell', 'Quittungen sammeln, Foto schicken, fertig. Nicht wie Luigi, der die Kart-Rechnung als „Teambuilding“ einreicht.') }] },
    };
    const L = P[id] || base;
    return { hello: L.hello, topics: L.topics };
  },

  /* ---------- Läden ---------- */
  async shop(id) {
    const def = SHOPS[id];
    if (!def) return;
    if (def.venue && !isOpen(def.venue)) { await this.say(null, `Geschlossen. Öffnungszeiten: ${hoursStr(def.venue)}.`); return; }
    if (id === 'breakfast' && !isOpen('breakfast')) { await this.say(null, 'Frühstück gibt es von 7 bis 10:30.'); return; }
    if (id === 'breakfast' && G.S.flags.bf === today()) { await this.say('Marta', 'Sie haben heute schon gefrühstückt. Ein Kaffee geht immer.'); consume('conleche'); return; }
    await UI.shop(def);
  },
  async buy(def, item, o = {}) {
    const price = item.price;
    if (!canPay(price)) { UI.toast('Zu wenig Geld.', 'warn'); return; }
    if (item.special === 'round') {
      if (!pay(price)) return;
      const here = G.npcs.filter((n) => n.id && PEOPLE[n.id]);
      consume('agua_val'); for (const n of here) G.S.fprom[n.id] = fprom(n.id) + 0.3;
      UI.toast(`Ein Krug für den Tisch. ${here.length ? listNames(here.map((n) => n.id)) + ' prosten dir zu.' : 'Du trinkst ihn allein. Respekt.'}`); mood(5);
      return;
    }
    if (item.wear) {
      if (!pay(price)) return;
      if (item.unlock) G.S.unlocked[item.unlock] = 1;
      Object.assign(G.S.look, item.wear); G.player.look = G.S.look;
      achieve('shopping'); UI.toast(`Angezogen: ${item.n}`); return;
    }
    if (!pay(price)) return;
    const I = ITEMS[item.id];
    if (def.mode === 'take' || o.take || (def.mode === 'eat' && !['drink', 'food', 'med'].includes(I.t))) { addInv(item.id); if (I.t === 'souv') achieve('souvenir'); UI.toast(`In die Tasche: ${I.n}`); }
    else { consume(item.id); if (def.title.startsWith('Frühstück')) G.S.flags.bf = today(); UI.toast(`${I.t === 'food' ? 'Gegessen' : 'Getrunken'}: ${I.n}`); }
  },
  async readItem(id) {
    if (id === 'batterypass') await this.say(null, '<em>Battery Pass – Kurzfassung (Lukas)</em>: Ab 2027 braucht jede Industrie- und E-Bike-Batterie über 2 kWh einen digitalen Produktpass. QR-Code, Daten zu Herkunft, Kapazität, CO₂ und Zustand. Seite 2 bis 40: Tabellen.');
    if (id === 'canref') await this.say(null, '<em>Frans Spickzettel</em>: 0x1017 Heartbeat · 0x6040 Controlword · 0x6060 Battery SOC · 0x6064 Geschwindigkeit · 0x6070 Motortemperatur · 0x6080 Battery SOH · 0x6090 Assist Level · 0x60A0 Fehlercode.');
  },

  /* ---------- Minuten-Takt, Tage, Ereignisse ---------- */
  minute() {
    const f = G.S.flags, h = hourOf(G.S.time), d = today(), mn = Math.floor(G.S.time) % 60;
    const hour = Math.floor(h);
    if (hour !== this._lastHour) { this._lastHour = hour; this.hourly(); }
    /* Fremde Teams planen selbst; das eigene Team ohne PO-Spieler auch ein bisschen */
    if (isWorkday() && h >= 9.5 && h < 17.5 && f.kickoff) {
      for (const k of Object.keys(TEAMS)) { if (k === myTeam()) { if (!isPO()) planAdd(k, 1.6 / 60); } else planAdd(k, 2.6 / 60); }
    }
    if (G.S.stage === 'bar' && h >= 19 && h < 19.02 && G.map.id !== 'bar') UI.toast('19:00 – die anderen sind in der Bar Pepita (Plaza de la Virgen).');
    if (isWorkday() && h >= 9.25 && h < 9.27 && !f.kickoff && d === 1) UI.toast('9:15 – Kickoff in 15 Minuten im Aufenthaltsraum bei Colba!', 'warn');
    if (isWorkday() && h >= 12.9 && h < 12.92 && LUNCH[d] && d !== 4) UI.toast(`Gleich Mittag: ${LUNCH[d][1]} im Aufenthaltsraum.`);
    if (d === 4 && h >= 14.4 && h < 14.42 && !f.final) UI.toast('Final-Präsentation um 15:00 im Aufenthaltsraum!', 'warn');
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
    /* Feste Ereignisse: Mascletà 14:00 (Mo–Do), Cremà Do 22:00 */
    if (m === 'city' && d <= 3 && h >= 14 && h < 14.05 && f.mascletaDay !== d) { f.mascletaDay = d; this.ev_mascleta(); return; }
    if (m === 'city' && d === 3 && h >= 22 && h < 23.5 && !f.cremaDone) { f.cremaDone = 1; this.ev_crema(); return; }
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
    await this.say(null, pick(['Das war zu viel Agua de Valencia. Oder zu wenig Paella.', 'Ein Passant: „¡Madre mía!“ Du: „Lo siento.“', 'Der Boden hat jetzt eine Erinnerung an dich.']));
    G.busy--;
  },
  async blackout() {
    G.busy++;
    await UI.fadeOut('Filmriss …');
    await sleep(1500);
    G.S.st.prom = 0.4; G.S.st.nau = 20; G.S.st.energy = 35; G.S.st.hang = 80; mood(-15);
    addMoney(-30);
    G.S.flags.sick = G.S.flags.sick || {};
    achieve('filmriss');
    const target = (dayOf(G.S.time) + 1) * 1440 + 9 * 60 + 20;
    G.S.time = target; G.S.lastSleep = G.S.time - 400;
    enterMap('hotel_room', 'entry');
    await UI.fadeIn();
    await this.say(null, `${dateLong()}, ${clockStr()}. Du wachst im Zimmer 412 auf, in Kleidern. Das Portemonnaie ist 30 € leichter, das Handy zeigt ein Foto von dir mit einem Ninot. Kater. ${isWorkday() ? 'Und du bist spät dran fürs Planning.' : ''}`);
    this.newDay();
    G.busy--;
  },
  async tiredWarning() { G.warned.tiredCrit = 1; UI.toast('Du kannst kaum noch die Augen offen halten – ins Hotel, schnell.', 'warn'); },
  async collapse() {
    G.busy++;
    await UI.fadeOut('Zzz …');
    await sleep(1200);
    const hh = hourOf(G.S.time);
    G.S.st.energy = 60; mood(-8);
    passTime(180, { sleep: true });
    G.S.lastSleep = G.S.time;
    if (G.map.id !== 'hotel_room') { enterMap('hotel_room', 'entry'); await UI.fadeIn(); await this.say(null, `Du bist auf einer Bank eingeschlafen. ${pick(['Ein Polizist', 'Aitor', 'Eine Fallera'])} hat dich ins Hotel gebracht. Es ist ${clockStr()}.`); }
    else { await UI.fadeIn(); await this.say(null, 'Eingeschlafen, in Kleidern, mit Laptop. Drei Stunden später.'); }
    G.busy--;
  },

  /* ---------- Ende ---------- */
  async goHome(auto) {
    const f = G.S.flags;
    if (f.finished) return;
    G.busy++;
    if (auto) { await UI.fadeOut('Samstag, 10:00 – Boarding …'); await sleep(800); }
    await Scene.play('taxi', { ms: 2200, text: 'Zum Flughafen …', heads: TRAVELLERS.filter((id) => id !== G.S.pid).slice(0, 4).map((id) => getSheet(personLook(id))) });
    await Scene.play('flight', { ms: 2800, text: 'VLC → ZRH' });
    f.finished = 1; G.S.finished = 1; achieve('heimflug');
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
    const grade = score >= 90 ? 'Legendär – Juanjo will dich einstellen.' : score >= 70 ? 'Stark – ein Plan, auf den man committen kann.' : score >= 50 ? 'Okay – das halbe Jahr wird spannend.' : 'Naja – aber Valencia war schön.';
    const html = `<div class="panel"><div class="panel-head"><h2>Heimflug · Bilanz</h2></div><div class="panel-body">
      <p class="note">${G.S.name} fliegt nach ${dayOf(G.S.time) + 1} Tagen zurück. ${grade}</p>
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
