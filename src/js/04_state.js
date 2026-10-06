/* ============ Spielzustand, Werte, Gegenstände ============ */
const DAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']; /* Tag 0 = Montag, 16. März 2026 (Fallas-Woche) */
const START_DATE = { d: 16, m: 3, y: 2026 };
const DAY_NAMES = { Mo: 'Montag', Di: 'Dienstag', Mi: 'Mittwoch', Do: 'Donnerstag', Fr: 'Freitag', Sa: 'Samstag', So: 'Sonntag' };
const MONTH_NAMES = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
const G = {
  S: null, map: null, player: null, npcs: [], peds: [], parts: [], birds: [],
  cam: { x: 0, y: 0 }, t: 0, busy: 0, fx: { shake: 0, flash: 0, tint: null }, warned: {}, lastMinute: 0, live: null,
};

/* ---- Gegenstände ----
   alc = Promille-Zuwachs, food = Sättigung, en = Energie, mood = Laune, nau = Übelkeit, caf = Koffein */
const ITEMS = {
  cana: { n: 'Caña (kleines Bier)', t: 'drink', alc: 0.12, beer: 1, mood: 3, en: -1, icon: 'beer' },
  tercio: { n: 'Tercio (Flaschenbier 0,33 l)', t: 'drink', alc: 0.17, beer: 1, mood: 4, en: -2, icon: 'bottle', inv: true },
  jarra: { n: 'Jarra (0,5 l Bier)', t: 'drink', alc: 0.25, beer: 1, mood: 4, en: -2, icon: 'beer' },
  agua_val: { n: 'Agua de Valencia (Glas)', t: 'drink', alc: 0.3, mood: 7, en: 2, nau: 4, icon: 'orange' },
  agua_val_j: { n: 'Agua de Valencia (Krug für alle)', t: 'drink', alc: 0.3, mood: 8, en: 2, nau: 4, icon: 'orange', round: true },
  sangria: { n: 'Sangría', t: 'drink', alc: 0.2, mood: 5, nau: 3, icon: 'wine' },
  tinto: { n: 'Tinto de Verano', t: 'drink', alc: 0.14, mood: 4, icon: 'wine' },
  vino: { n: 'Glas Bobal (Rotwein aus Utiel-Requena)', t: 'drink', alc: 0.16, mood: 5, icon: 'wine' },
  cava: { n: 'Cava', t: 'drink', alc: 0.15, mood: 6, icon: 'cava' },
  chupito: { n: 'Chupito (Orujo de Hierbas)', t: 'drink', alc: 0.13, mood: 5, en: -2, nau: 5, icon: 'shot' },
  gintonic: { n: 'Gin Tonic', t: 'drink', alc: 0.2, mood: 6, icon: 'long' },
  mojito: { n: 'Mojito', t: 'drink', alc: 0.18, mood: 6, icon: 'long' },
  horchata: { n: 'Horchata de Chufa', t: 'drink', food: 10, en: 6, mood: 5, nau: -8, icon: 'horchata' },
  cortado: { n: 'Cortado', t: 'drink', en: 14, nau: -2, caf: 1, icon: 'coffee' },
  conleche: { n: 'Café con Leche', t: 'drink', en: 12, mood: 2, caf: 1, icon: 'coffee' },
  kaffee: { n: 'Büro-Kaffee (Nespresso)', t: 'drink', en: 12, mood: 1, caf: 1, icon: 'coffee' },
  zumo: { n: 'Zumo de Naranja (frisch)', t: 'drink', en: 8, mood: 3, nau: -6, icon: 'orange' },
  agua: { n: 'Mineralwasser', t: 'drink', water: 1, nau: -10, icon: 'water', inv: true },
  cola: { n: 'Cola', t: 'drink', en: 6, mood: 1, icon: 'long' },
  energy: { n: 'Energy-Drink', t: 'drink', en: 25, mood: 1, nau: 2, icon: 'can', inv: true },
  paella: { n: 'Paella Valenciana', t: 'food', food: 70, mood: 12, nau: -16, icon: 'paella' },
  fideua: { n: 'Fideuà', t: 'food', food: 60, mood: 9, nau: -14, icon: 'paella' },
  bocadillo: { n: 'Bocadillo de Jamón', t: 'food', food: 40, mood: 6, nau: -10, icon: 'sandwich', inv: true },
  bocadillo_t: { n: 'Bocadillo de Tortilla', t: 'food', food: 40, mood: 6, nau: -10, icon: 'sandwich', inv: true },
  jamon: { n: 'Ración Jamón Ibérico de Bellota', t: 'food', food: 35, mood: 12, nau: -8, icon: 'jamon' },
  tapas: { n: 'Tapas-Teller', t: 'food', food: 30, mood: 6, nau: -8, icon: 'tapas' },
  bravas: { n: 'Patatas Bravas', t: 'food', food: 28, mood: 5, nau: -6, icon: 'fries' },
  tortilla: { n: 'Tortilla de Patatas', t: 'food', food: 35, mood: 5, nau: -10, icon: 'tortilla' },
  esgarraet: { n: 'Esgarraet (Paprika & Stockfisch)', t: 'food', food: 22, mood: 5, nau: -4, icon: 'tapas' },
  burger: { n: 'Smash Burger', t: 'food', food: 60, mood: 9, nau: -14, icon: 'burger', burger: 1 },
  pizza: { n: 'Pizza-Stück', t: 'food', food: 30, mood: 5, nau: -8, icon: 'pizza' },
  churros: { n: 'Churros con Chocolate', t: 'food', food: 25, mood: 9, nau: -4, icon: 'churros' },
  fartons: { n: 'Fartons', t: 'food', food: 12, mood: 4, nau: -2, icon: 'fartons', inv: true },
  naranja: { n: 'Orange (valencianisch)', t: 'food', food: 10, en: 4, nau: -5, icon: 'orange', inv: true, bird: 1 },
  fruta: { n: 'Obstbecher', t: 'food', food: 15, en: 5, nau: -6, mood: 3, icon: 'orange', inv: true },
  bowl: { n: 'Healthy Bowl', t: 'food', food: 45, mood: 6, en: 8, nau: -12, hang: 1, icon: 'bowl' },
  croissant: { n: 'Croissant', t: 'food', food: 15, mood: 3, nau: -5, icon: 'croissant', inv: true },
  almendras: { n: 'Mandeln', t: 'food', food: 8, mood: 1, icon: 'nuts', inv: true },
  chips: { n: 'Chips', t: 'food', food: 12, mood: 3, icon: 'chips', inv: true },
  pescado: { n: 'Gegrillter Fisch (Dorada)', t: 'food', food: 55, mood: 9, nau: -14, icon: 'fish' },
  calamares: { n: 'Calamares a la Romana', t: 'food', food: 35, mood: 7, nau: -6, icon: 'fish' },
  sepia: { n: 'Sepia a la Plancha', t: 'food', food: 40, mood: 7, nau: -10, icon: 'fish' },
  aspirin: { n: 'Kopfwehtabletten', t: 'med', hang: 2, nau: -10, icon: 'pill', inv: true },
  magen: { n: 'Magentropfen', t: 'med', nau: -45, icon: 'pill', inv: true },
  sonnencreme: { n: 'Sonnencreme LSF 50', t: 'med', sun: 1, icon: 'cream', inv: true, uses: 4 },
  zigaretten: { n: 'Zigaretten (Packung)', t: 'smoke', icon: 'cig', inv: true, uses: 20 },
  feuerzeug: { n: 'Feuerzeug', t: 'tool', icon: 'lighter', inv: true },
  badge: { n: 'Colba-Besucherbadge', t: 'tool', icon: 'badge', inv: true },
  postits: { n: 'Block Post-its', t: 'tool', icon: 'postit', inv: true },
  boarding: { n: 'Bordkarte Valencia → Zürich', t: 'ticket', icon: 'ticket', inv: true },
  kartticket: { n: 'Kart-Ticket (10 Minuten)', t: 'ticket', icon: 'ticket', inv: true },
  fallera: { n: 'Fallera-Figur (Keramik)', t: 'souv', icon: 'fallera', inv: true },
  paellera: { n: 'Paella-Pfanne (46 cm)', t: 'souv', icon: 'paella', inv: true },
  abanico: { n: 'Abanico (Fächer)', t: 'souv', icon: 'fan', inv: true },
  azulejo: { n: 'Azulejo-Kachel', t: 'souv', icon: 'tile', inv: true },
  schal: { n: 'Schal Valencia CF', t: 'souv', icon: 'scarf', inv: true },
  ninot: { n: 'Mini-Ninot', t: 'souv', icon: 'fallera', inv: true },
  chufa: { n: 'Chufa-Beutel', t: 'souv', icon: 'nuts', inv: true },
  pokal: { n: 'Kart-Pokal', t: 'souv', icon: 'trophy', inv: true },
  surfwax: { n: 'Surf-Wax von Chris', t: 'souv', icon: 'wax', inv: true },
  batterypass: { n: 'Battery-Pass-Flyer von Lukas', t: 'read', icon: 'paper', inv: true },
  canref: { n: 'CANopen-Spickzettel von Fran', t: 'read', icon: 'paper', inv: true },
};

/* ---- Sehenswürdigkeiten (recherchierte Fakten) ---- */
const SIGHTS = {
  ciudad: { n: 'Ciudad de las Artes y las Ciencias', f: 'Der futuristische Komplex von Santiago Calatrava und Félix Candela im alten Turia-Flussbett. 1998 öffnete als Erstes das Hemisfèric; das Oceanogràfic ist das grösste Aquarium Europas.' },
  micalet: { n: 'El Micalet', f: 'Der achteckige Glockenturm der Kathedrale, gotisch, 14./15. Jahrhundert, rund 51 Meter hoch. 207 Stufen führen auf die Plattform mit Blick über die ganze Stadt.' },
  lonja: { n: 'Lonja de la Seda', f: 'Die spätgotische Seidenbörse (1482–1548) mit ihrer Säulenhalle ist seit 1996 UNESCO-Welterbe – ein Zeugnis der Handelsmacht Valencias im 15. Jahrhundert.' },
  serranos: { n: 'Torres de Serranos', f: 'Stadttor von 1392–1398, eines der besterhaltenen gotischen Stadttore Europas. Von hier wird Ende Februar mit der „Crida“ die Fallas-Zeit eröffnet.' },
  mercado: { n: 'Mercado Central', f: 'Die modernistische Markthalle wurde 1928 eröffnet und gehört zu den grössten Europas. Unter der Kuppel: Fisch, Jamón, Gemüse, Safran – und die Horchata-Bar.' },
  turia: { n: 'Jardín del Turia', f: 'Nach der Flutkatastrophe von 1957 wurde der Fluss Turia umgeleitet. Im alten Flussbett entstand ein neun Kilometer langer Park, eröffnet 1986 – das Lieblingsrevier aller Velofahrer.' },
  malvarrosa: { n: 'Playa de la Malvarrosa', f: 'Der breite Stadtstrand mit Promenade. Der Maler Joaquín Sorolla hat hier das Licht Valencias auf die Leinwand gebracht.' },
  marina: { n: 'La Marina de València', f: 'Der Hafen wurde für den America’s Cup 2007 umgebaut. Heute: Segelboote, Veles e Vents und Konzerte am Wasser.' },
  virgen: { n: 'Plaza de la Virgen', f: 'Der Turia-Brunnen zeigt den Flussgott mit acht Frauen – den acht Bewässerungskanälen der Huerta. Jeden Donnerstag um 12 Uhr tagt hier das Wassergericht, das älteste Gericht Europas (UNESCO 2009).' },
  ayuntamiento: { n: 'Plaza del Ayuntamiento', f: 'Während der Fallas (1.–19. März) knallt hier jeden Tag um 14 Uhr die Mascletà: Minuten lang Böller, bis der Boden bebt.' },
  museum: { n: 'Museu de Belles Arts', f: 'Eines der bedeutendsten Kunstmuseen Spaniens: Sorolla, Goya, El Greco und ein Selbstporträt von Velázquez hängen hier.' },
  estacion: { n: 'Estación del Norte', f: 'Modernistischer Bahnhof von 1917, verziert mit Orangen, Azulejos und Mosaiken – Valencias schönste Visitenkarte.' },
  falla: { n: 'Falla-Monument', f: 'Die riesigen Figuren aus Holz und Pappmaché werden monatelang gebaut – und in der Nacht des 19. März bei der Cremà verbrannt. Nur ein Ninot wird jedes Jahr begnadigt.' },
  colba: { n: 'Colba-Hochhaus', f: 'Im ersten Stock entwickelt Colba die E-Bike-Apps. Die Klingel ist angeschrieben – trotzdem weiss niemand, welche die richtige ist.' },
};

/* ---- Erlebnisse ---- */
const ACH = {
  koffer: ['Gepäck gefunden', 'Den eigenen Koffer vom Band gefischt'],
  taxi: ['Taxi!', 'Mit der ganzen Truppe ins Hotel Kramer gefahren'],
  checkin: ['Eingecheckt', 'Im Hotel Kramer eingecheckt'],
  bar: ['Buenas noches', 'Alle am Montagabend in der Bar Pepita getroffen'],
  klingel: ['Klingelprofi', 'Die richtige Klingel am Colba-Hochhaus gefunden'],
  lift: ['Erster Stock', 'Im Colba-Office angekommen'],
  kickoff: ['Business Context', 'Robins ersten Vortrag überstanden'],
  poker: ['Planning Poker', 'Eine Schätzrunde mit Konsens abgeschlossen'],
  canopen: ['CANopen-Guru', 'Frans Index-Quiz fehlerfrei bestanden'],
  roam: ['ROAM', 'Alle Risiken richtig eingeordnet'],
  board: ['Sprint-Board', 'Ein Programm-Board ohne Überlast gefüllt'],
  deps: ['Abhängigkeiten geklärt', 'Mit allen anderen Teams verhandelt'],
  plan50: ['Halbzeit', 'Der eigene PI-Plan steht zu 50 %'],
  plan80: ['Commitment', 'Der eigene PI-Plan steht zu 80 %'],
  confidence: ['Confidence Vote', 'Das Planning mit hohem Vertrauen abgeschlossen'],
  paella: ['Paella-Dienstag', 'Mittagessen im Aufenthaltsraum: Paella'],
  burgerday: ['Burger-Mittwoch', 'Smash Burger im Office verdrückt'],
  bocata: ['Bocadillo-Donnerstag', 'Spanische Sandwiches zum Zmittag'],
  healthy: ['Healthy Friday', 'Mit einer Bowl in den letzten Tag gestartet'],
  mascleta: ['Mascletà', 'Um 14 Uhr auf der Plaza del Ayuntamiento den Boden beben gespürt'],
  crema: ['Cremà', 'Die Fallas brennen gesehen'],
  tribunal: ['Wassergericht', 'Das Tribunal de las Aguas am Donnerstag erlebt'],
  gota: ['Gota fría', 'Von einem valencianischen Platzregen erwischt'],
  moewe: ['Möwenalarm', 'Am Strand von einer Möwe beklaut worden'],
  segeln: ['Segeltörn', 'Im Hafen alle Bojen gerundet'],
  kart: ['Kartbahn', 'Auf der Kartbahn gefahren'],
  kartsieg: ['Pole Position', 'Luigi auf der Kartbahn geschlagen'],
  wein: ['Sommelier', 'Bei der Weindegustation alle Weine erkannt'],
  museum: ['Kulturbanause', 'Im Museu de Belles Arts alle Bilder angeschaut'],
  fussball: ['Strandkick', 'Beim Strandfussball gewonnen'],
  disco: ['Noche Valenciana', 'In der Disco über 80 % getanzt'],
  padel: ['Padel-Champion', 'Das Padel-Turnier gewonnen'],
  fischmarkt: ['Mercado', 'Im Mercado Central eingekauft'],
  horchata: ['Chufa-Fan', 'Horchata mit Fartons getrunken'],
  jamon: ['Bellota', 'Eine Ración Jamón Ibérico gegessen'],
  aguaval: ['Agua de Valencia', 'Den Stadt-Cocktail probiert'],
  paellachef: ['Socarrat', 'Den Paella-Kochwettbewerb gewonnen'],
  ebike: ['Ausfahrt', 'Mit dem E-Bike durch den Turia-Park gefahren'],
  akku: ['Akku leer', 'Mit leerem Akku nach Hause getreten'],
  teamride: ['Team-Ausfahrt', 'Die Donnerstags-Ausfahrt mit dem Team gefahren'],
  surf: ['Dawn Patrol', 'Mit Chris am Morgen im Wasser gewesen'],
  autofan: ['Benzingespräch', 'Mit Luigi über Autos gefachsimpelt'],
  rauchpause: ['Rauchpause', 'Mit Dominique auf dem Balkon gestanden'],
  robin: ['Chef-Betreuung', 'Robin dreimal den Weg gezeigt'],
  battery: ['Battery Pass', 'Lukas’ Vortrag über den Batteriepass gehört'],
  leipzig: ['Sachse', 'Pascals Anreise aus Leipzig angehört'],
  fuerte: ['Fuerte-Vibes', 'Chris’ Surfbericht aus Fuerteventura angehört'],
  isabell: ['Backoffice', 'Isabell bei der Organisation geholfen'],
  kotzen: ['Ups…', 'Sich übergeben müssen'],
  filmriss: ['Filmriss', 'Komplett abgestürzt'],
  kater: ['Kater besiegt', 'Einen Kater kuriert'],
  sonnenbrand: ['Rot wie eine Tomate', 'Ohne Sonnencreme zu lange am Strand'],
  shopping: ['Shopping', 'Neue Kleider gekauft'],
  souvenir: ['Andenken', 'Ein Souvenir gekauft'],
  fotos: ['Fotograf', 'Alle Sehenswürdigkeiten fotografiert'],
  knipser: ['Knipser', 'Einen Schnappschuss gemacht'],
  strich: ['Strichliste voll', '10 Biere in Valencia'],
  heimflug: ['Heimflug', 'Nach fünf Tagen Planning wieder im Flieger'],
};

const TEAMS = {
  indurain: { n: 'Team Indurain', col: '#e2554a', po: 'simon', members: ['danny', 'fran', 'estella', 'bea', 'vicente'], room: 'Raum 1 · Indurain' },
  meeseeks: { n: 'Team Meeseeks', col: '#2fa0d8', po: 'luigi', members: ['juanjo', 'oscar', 'pablo', 'guillem', 'elena', 'pascal'], room: 'Raum 2 · Meeseeks' },
  rocket: { n: 'Team Rocket', col: '#f0a23a', po: 'dominique', members: ['carlos', 'salva', 'aitor'], room: 'Raum 3 · Rocket' },
};

function newState(look, name) {
  return {
    v: 1, name: name || 'Simon', look, unlocked: {},
    time: 12 * 60 + 5, map: 'airport', x: 0, y: 0, dir: 0,
    stage: 'koffer', flags: { met: {} },
    st: { energy: 80, food: 55, mood: 70, prom: 0, nau: 0, wet: 0, sun: 0, hang: 0 },
    money: { eur: 320 },
    inv: { agua: 1, postits: 1 }, uses: {}, photos: {}, ach: {},
    beers: 0, shots: 0, coffees: 0, lastSleep: 6 * 60, lastFood: 9 * 60 + 30,
    aff: {}, rec: { kart: 0, dance: 0, padel: 0, sail: 0, soccer: 0, ride: 0 },
    plan: { indurain: 0, meeseeks: 0, rocket: 0 }, deps: {}, done: {},
    vomitSpots: [],
  };
}
const minutesAwake = () => G.S.time - G.S.lastSleep;
const dayOf = (t) => Math.floor(t / 1440);
const hourOf = (t) => (t % 1440) / 60;
function clockStr(t = G.S.time) { const m = Math.floor(t) % 1440; return pad2(Math.floor(m / 60)) + ':' + pad2(m % 60); }
function dayStr(t = G.S.time) { return DAYS[dayOf(t) % 7]; }
function calDate(t = G.S.time) { const dt = new Date(START_DATE.y, START_DATE.m - 1, START_DATE.d + dayOf(t)); return { d: dt.getDate(), m: dt.getMonth() + 1, y: dt.getFullYear() }; }
function dateStr(t = G.S.time) { const c = calDate(t); return `${dayStr(t)} ${c.d}.${c.m}.${c.y}`; }
function dateLong(t = G.S.time) { const c = calDate(t); return `${DAY_NAMES[dayStr(t)]}, ${c.d}. ${MONTH_NAMES[c.m - 1]} ${c.y}`; }
function isNight(t = G.S.time) { const h = hourOf(t); return h >= 20.5 || h < 7; }
const today = () => dayOf(G.S.time);
const isWorkday = () => today() >= 1 && today() <= 4;

function addMoney(v) { G.S.money.eur = Math.round((G.S.money.eur + v) * 100) / 100; UI.hud(); }
function canPay(v) { return G.S.money.eur + 1e-6 >= v; }
function pay(v) { if (!canPay(v)) return false; addMoney(-v); Snd.sfx('coin'); return true; }
function addInv(id, n = 1) { G.S.inv[id] = (G.S.inv[id] || 0) + n; if (ITEMS[id] && ITEMS[id].uses && !G.S.uses[id]) G.S.uses[id] = ITEMS[id].uses; }
function hasInv(id) { return (G.S.inv[id] || 0) > 0; }
function takeUse(id) { if (!hasInv(id)) return false; const I = ITEMS[id]; if (I && I.uses) { G.S.uses[id] = (G.S.uses[id] || I.uses) - 1; if (G.S.uses[id] <= 0) { takeInv(id); delete G.S.uses[id]; } return true; } return takeInv(id); }
function takeInv(id, n = 1) { if (!hasInv(id)) return false; G.S.inv[id] -= n; if (G.S.inv[id] <= 0) delete G.S.inv[id]; return true; }

function achieve(id) {
  if (!ACH[id] || G.S.ach[id]) return;
  G.S.ach[id] = G.S.time;
  Snd.sfx('win');
  UI.toast(`<b>Erlebnis:</b> ${ACH[id][0]}`, 'ach');
}
function addPhoto(id) {
  if (G.S.photos[id]) { UI.toast('Davon hast du schon ein Foto.'); return false; }
  G.S.photos[id] = G.S.time;
  Snd.sfx('shutter');
  G.fx.flash = 1;
  UI.toast(`📷 Foto: <b>${SIGHTS[id].n}</b>`);
  if (Object.keys(G.S.photos).length >= Object.keys(SIGHTS).length) achieve('fotos');
  mood(3);
  return true;
}
function mood(v) { G.S.st.mood = clamp(G.S.st.mood + v, 0, 100); }
function energy(v) { G.S.st.energy = clamp(G.S.st.energy + v, 0, 100); }
/* Fortschritt im eigenen Team-Plan */
function planAdd(team, v) {
  const p = G.S.plan;
  p[team] = clamp(Math.round((p[team] + v) * 10) / 10, 0, 100);
  if (team === myTeam()) { if (p[team] >= 50) achieve('plan50'); if (p[team] >= 80) achieve('plan80'); }
  UI.hud();
}

/* Essen und Trinken */
function consume(id, opts = {}) {
  const it = ITEMS[id];
  const st = G.S.st;
  if (!it) return;
  if (it.alc) {
    const stomach = st.food > 55 ? 0.82 : st.food < 20 ? 1.22 : 1;
    st.prom = Math.min(4, st.prom + it.alc * stomach);
    const units = it.alc / 0.25;
    let n = 8 * units;
    if (st.food < 30) n += 10 * units;
    if (minutesAwake() > 14 * 60) n += 8 * units;
    if (st.prom > 1.4) n += 7 * units;
    if (st.food > 60) n -= 4 * units;
    st.nau = clamp(st.nau + Math.max(2, n) + (it.nau || 0), 0, 140);
    if (it.beer) { G.S.beers++; if (G.S.beers >= 10) achieve('strich'); }
    else G.S.shots++;
    if (id.startsWith('agua_val')) achieve('aguaval');
    if (st.prom < 1.8) mood(it.mood || 3); else mood(-1);
    energy(it.en || 0);
    Snd.sfx('gulp');
  } else {
    if (it.food) { st.food = clamp(st.food + it.food, 0, 100); G.S.lastFood = G.S.time; Snd.sfx('eat'); }
    else Snd.sfx('gulp');
    if (it.nau) st.nau = clamp(st.nau + it.nau, 0, 140);
    if (it.en) energy(it.en);
    if (it.mood) mood(it.mood);
    if (it.caf) G.S.coffees++;
    if (it.water) { st.prom = Math.max(0, st.prom - 0.04); st.hang = Math.max(0, st.hang - 15); }
    if (it.hang && st.hang > 0) { st.hang = Math.max(0, st.hang - 40 * it.hang); if (st.hang <= 0) { achieve('kater'); UI.toast('Der Kater ist weg!'); } }
    if (it.sun) { st.sun = 0; G.S.flags.creme = G.S.time; }
    if (id === 'horchata') achieve('horchata');
    if (id === 'jamon') achieve('jamon');
  }
  if (!opts.silent) checkThresholds();
}

/* Werte pro Spielminute fortschreiben */
function tickStats(dm) {
  const st = G.S.st;
  const awakeH = minutesAwake() / 60;
  let enDrain = 4 / 60 + Math.max(0, st.prom - 0.8) * 2.2 / 60 + (awakeH > 16 ? 2 / 60 : 0);
  if (G.player && G.player.running) enDrain += 3 / 60;
  st.energy = clamp(st.energy - enDrain * dm, 0, 100);
  st.food = clamp(st.food - (6 / 60) * dm, 0, 100);
  st.prom = Math.max(0, st.prom - (0.15 / 60) * dm);
  let nauRate = -10 / 60;
  if (st.food < 15 && st.prom > 0.8) nauRate = 4 / 60;
  if (awakeH > 18 && st.prom > 1) nauRate += 3 / 60;
  st.nau = clamp(st.nau + nauRate * dm, 0, 140);
  if (st.food < 20) mood(-2 / 60 * dm);
  if (st.energy < 20) mood(-2 / 60 * dm);
  if (st.hang > 0) { st.hang = Math.max(0, st.hang - dm * 0.5); mood(-1.2 / 60 * dm); }
  if (st.wet > 0) st.wet = Math.max(0, st.wet - dm);
  /* Sonne am Strand: ohne Creme wird man rot */
  if (G.map && G.map.sunny && !G.map.indoor && G.player && G.player.x > 85 * TS) { const h = hourOf(G.S.time); if (h > 10 && h < 18 && !(G.S.flags.creme && G.S.time - G.S.flags.creme < 240)) st.sun = clamp(st.sun + dm * 0.4, 0, 100); }
  else st.sun = Math.max(0, st.sun - dm * 0.05);
  if (G.S.fprom) for (const k of Object.keys(G.S.fprom)) G.S.fprom[k] = Math.max(0, G.S.fprom[k] - (0.15 / 60) * dm);
  checkThresholds();
}
function warnOnce(key, cond, msg, reset) {
  if (cond && !G.warned[key]) { G.warned[key] = 1; UI.toast(msg, 'warn'); }
  if (reset && G.warned[key]) G.warned[key] = 0;
}
function checkThresholds() {
  const st = G.S.st;
  warnOnce('hunger', st.food < 18, 'Dein Magen knurrt. Zeit für ein Bocadillo?', st.food > 35);
  warnOnce('tired', st.energy < 22, 'Du bist müde. Leg dich im Hotelzimmer kurz hin – oder hol dir einen Cortado.', st.energy > 40);
  warnOnce('nau1', st.nau > 60, 'Dir ist flau im Magen …', st.nau < 40);
  warnOnce('nau2', st.nau > 85, 'Dir wird richtig übel! Iss etwas oder geh schlafen.', st.nau < 70);
  warnOnce('prom1', st.prom > 1.2, 'Die Welt fängt an zu schwanken.', st.prom < 0.9);
  warnOnce('prom2', st.prom > 2.0, 'Du siehst doppelt. Vielleicht ein Wasser?', st.prom < 1.7);
  warnOnce('sun', st.sun > 60, 'Deine Haut brennt – Sonnencreme oder in den Schatten!', st.sun < 30);
  if (st.sun >= 100) achieve('sonnenbrand');
  if (st.energy > 40) G.warned.tiredCrit = 0;
  if (!G.busy && Story.ready) {
    if (st.nau >= 100) Story.vomit();
    else if (st.prom >= 2.6) Story.blackout();
    else if (st.energy <= 7 && !G.warned.tiredCrit) Story.tiredWarning();
    else if (st.energy <= 0) Story.collapse();
  }
}
function promStr(v = G.S.st.prom) { return v.toFixed(2).replace('.', ',') + ' ‰'; }

/* ---- Speichern ---- */
const SAVE_KEY = 'pi-valencia-v1' + (BUILD_VARIANT ? '-' + BUILD_VARIANT : '');
function saveGame(silent) {
  if (!G.S || !G.player) return;
  G.S.map = G.map.id; G.S.x = Math.round(G.player.x); G.S.y = Math.round(G.player.y); G.S.dir = G.player.dir;
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(G.S)); if (!silent) UI.toast('Spielstand gespeichert.'); return true; }
  catch (e) { if (!silent) UI.toast('Speichern ist in diesem Browser nicht möglich.', 'warn'); return false; }
}
function loadSave() {
  try { const s = localStorage.getItem(SAVE_KEY); if (!s) return null; const o = JSON.parse(s); return o && o.v === 1 ? o : null; } catch (e) { return null; }
}
function clearSave() { try { localStorage.removeItem(SAVE_KEY); } catch (e) {} }
