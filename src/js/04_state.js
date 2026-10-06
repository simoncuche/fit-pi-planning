/* ============ Spielzustand, Werte, Gegenstände ============ */
const DAYS = [_t('Mo'), _t('Di'), _t('Mi'), _t('Do'), _t('Fr'), _t('Sa'), _t('So')]; /* Tag 0 = Montag, 2. November 2026 */
const START_DATE = { d: 2, m: 11, y: 2026 };
const DAY_NAMES = [_t('Montag'), _t('Dienstag'), _t('Mittwoch'), _t('Donnerstag'), _t('Freitag'), _t('Samstag'), _t('Sonntag')]; /* Index wie DAYS */
const MONTH_NAMES = [_t('Januar'), _t('Februar'), _t('März'), _t('April'), _t('Mai'), _t('Juni'), _t('Juli'), _t('August'), _t('September'), _t('Oktober'), _t('November'), _t('Dezember')];
const G = {
  S: null, map: null, player: null, npcs: [], peds: [], parts: [], birds: [],
  cam: { x: 0, y: 0 }, t: 0, busy: 0, fx: { shake: 0, flash: 0, tint: null }, warned: {}, lastMinute: 0, live: null,
};

/* ---- Gegenstände ----
   alc = Promille-Zuwachs, food = Sättigung, en = Energie, mood = Laune, nau = Übelkeit, caf = Koffein */
const ITEMS = {
  cana: { n: _t('Caña (kleines Bier)'), t: 'drink', alc: 0.12, beer: 1, mood: 3, en: -1, icon: 'beer' },
  tercio: { n: _t('Tercio (Flaschenbier 0,33 l)'), t: 'drink', alc: 0.17, beer: 1, mood: 4, en: -2, icon: 'bottle', inv: true },
  jarra: { n: _t('Jarra (0,5 l Bier)'), t: 'drink', alc: 0.25, beer: 1, mood: 4, en: -2, icon: 'beer' },
  agua_val: { n: _t('Agua de Valencia (Glas)'), t: 'drink', alc: 0.3, mood: 7, en: 2, nau: 4, icon: 'orange' },
  agua_val_j: { n: _t('Agua de Valencia (Krug für alle)'), t: 'drink', alc: 0.3, mood: 8, en: 2, nau: 4, icon: 'orange', round: true },
  sangria: { n: _t('Sangría'), t: 'drink', alc: 0.2, mood: 5, nau: 3, icon: 'wine' },
  tinto: { n: _t('Tinto de Verano'), t: 'drink', alc: 0.14, mood: 4, icon: 'wine' },
  vino: { n: _t('Glas Bobal (Rotwein aus Utiel-Requena)'), t: 'drink', alc: 0.16, mood: 5, icon: 'wine' },
  cava: { n: _t('Cava'), t: 'drink', alc: 0.15, mood: 6, icon: 'cava' },
  chupito: { n: _t('Chupito (Orujo de Hierbas)'), t: 'drink', alc: 0.13, mood: 5, en: -2, nau: 5, icon: 'shot' },
  gintonic: { n: _t('Gin Tonic'), t: 'drink', alc: 0.2, mood: 6, icon: 'long' },
  mojito: { n: _t('Mojito'), t: 'drink', alc: 0.18, mood: 6, icon: 'long' },
  horchata: { n: _t('Horchata de Chufa'), t: 'drink', food: 10, en: 6, mood: 5, nau: -8, icon: 'horchata' },
  cortado: { n: _t('Cortado'), t: 'drink', en: 14, nau: -2, caf: 1, icon: 'coffee' },
  conleche: { n: _t('Café con Leche'), t: 'drink', en: 12, mood: 2, caf: 1, icon: 'coffee' },
  kaffee: { n: _t('Büro-Kaffee (Nespresso)'), t: 'drink', en: 12, mood: 1, caf: 1, icon: 'coffee' },
  zumo: { n: _t('Zumo de Naranja (frisch)'), t: 'drink', en: 8, mood: 3, nau: -6, icon: 'orange' },
  agua: { n: _t('Mineralwasser'), t: 'drink', water: 1, nau: -10, icon: 'water', inv: true },
  cola: { n: _t('Cola'), t: 'drink', en: 6, mood: 1, icon: 'long' },
  energy: { n: _t('Energy-Drink'), t: 'drink', en: 25, mood: 1, nau: 2, icon: 'can', inv: true },
  paella: { n: _t('Paella Valenciana'), t: 'food', food: 70, mood: 12, nau: -16, icon: 'paella' },
  fideua: { n: _t('Fideuà'), t: 'food', food: 60, mood: 9, nau: -14, icon: 'paella' },
  bocadillo: { n: _t('Bocadillo de Jamón'), t: 'food', food: 40, mood: 6, nau: -10, icon: 'sandwich', inv: true },
  bocadillo_t: { n: _t('Bocadillo de Tortilla'), t: 'food', food: 40, mood: 6, nau: -10, icon: 'sandwich', inv: true },
  jamon: { n: _t('Ración Jamón Ibérico de Bellota'), t: 'food', food: 35, mood: 12, nau: -8, icon: 'jamon' },
  tapas: { n: _t('Tapas-Teller'), t: 'food', food: 30, mood: 6, nau: -8, icon: 'tapas' },
  bravas: { n: _t('Patatas Bravas'), t: 'food', food: 28, mood: 5, nau: -6, icon: 'fries' },
  tortilla: { n: _t('Tortilla de Patatas'), t: 'food', food: 35, mood: 5, nau: -10, icon: 'tortilla' },
  esgarraet: { n: _t('Esgarraet (Paprika & Stockfisch)'), t: 'food', food: 22, mood: 5, nau: -4, icon: 'tapas' },
  burger: { n: _t('Smash Burger'), t: 'food', food: 60, mood: 9, nau: -14, icon: 'burger', burger: 1 },
  pizza: { n: _t('Pizza-Stück'), t: 'food', food: 30, mood: 5, nau: -8, icon: 'pizza' },
  churros: { n: _t('Churros con Chocolate'), t: 'food', food: 25, mood: 9, nau: -4, icon: 'churros' },
  bunyols: { n: _t('Buñuelos de calabaza'), t: 'food', food: 22, mood: 8, nau: -3, icon: 'churros' },
  fartons: { n: _t('Fartons'), t: 'food', food: 12, mood: 4, nau: -2, icon: 'fartons', inv: true },
  naranja: { n: _t('Orange (valencianisch)'), t: 'food', food: 10, en: 4, nau: -5, icon: 'orange', inv: true, bird: 1 },
  fruta: { n: _t('Obstbecher'), t: 'food', food: 15, en: 5, nau: -6, mood: 3, icon: 'orange', inv: true },
  bowl: { n: _t('Healthy Bowl'), t: 'food', food: 45, mood: 6, en: 8, nau: -12, hang: 1, icon: 'bowl' },
  croissant: { n: _t('Croissant'), t: 'food', food: 15, mood: 3, nau: -5, icon: 'croissant', inv: true },
  almendras: { n: _t('Mandeln'), t: 'food', food: 8, mood: 1, icon: 'nuts', inv: true },
  chips: { n: _t('Chips'), t: 'food', food: 12, mood: 3, icon: 'chips', inv: true },
  pescado: { n: _t('Gegrillter Fisch (Dorada)'), t: 'food', food: 55, mood: 9, nau: -14, icon: 'fish' },
  calamares: { n: _t('Calamares a la Romana'), t: 'food', food: 35, mood: 7, nau: -6, icon: 'fish' },
  sepia: { n: _t('Sepia a la Plancha'), t: 'food', food: 40, mood: 7, nau: -10, icon: 'fish' },
  chorizo: { n: _t('Chorizo vom Grill'), t: 'food', food: 30, mood: 7, nau: -8, icon: 'wurst' },
  pollo: { n: _t('Pollo asado (Grillhähnchen)'), t: 'food', food: 50, mood: 8, nau: -14, icon: 'wings' },
  maiz: { n: _t('Maiskolben vom Grill'), t: 'food', food: 20, mood: 4, nau: -5, icon: 'corn' },
  ropavieja: { n: _t('Ropa Vieja (Beas Rezept)'), t: 'food', food: 55, mood: 10, nau: -14, icon: 'tapas' },
  mojito_c: { n: _t('Mojito cubano (Dannys Rezept)'), t: 'drink', alc: 0.2, mood: 7, nau: 2, icon: 'long' },
  aspirin: { n: _t('Kopfwehtabletten'), t: 'med', hang: 2, nau: -10, icon: 'pill', inv: true },
  magen: { n: _t('Magentropfen'), t: 'med', nau: -45, icon: 'pill', inv: true },
  sonnencreme: { n: _t('Sonnencreme LSF 50'), t: 'med', sun: 1, icon: 'cream', inv: true, uses: 4 },
  zigaretten: { n: _t('Zigaretten (Packung)'), t: 'smoke', icon: 'cig', inv: true, uses: 20 },
  feuerzeug: { n: _t('Feuerzeug'), t: 'tool', icon: 'lighter', inv: true },
  badge: { n: _t('Colba-Besucherbadge'), t: 'tool', icon: 'badge', inv: true },
  postits: { n: _t('Block Post-its'), t: 'tool', icon: 'postit', inv: true },
  boarding: { n: _t('Bordkarte Valencia → Zürich'), t: 'ticket', icon: 'ticket', inv: true },
  kartticket: { n: _t('Kart-Ticket (10 Minuten)'), t: 'ticket', icon: 'ticket', inv: true },
  fallera: { n: _t('Fallera-Figur (Keramik)'), t: 'souv', icon: 'fallera', inv: true },
  paellera: { n: _t('Paella-Pfanne (46 cm)'), t: 'souv', icon: 'paella', inv: true },
  abanico: { n: _t('Abanico (Fächer)'), t: 'souv', icon: 'fan', inv: true },
  azulejo: { n: _t('Azulejo-Kachel'), t: 'souv', icon: 'tile', inv: true },
  schal: { n: _t('Schal Valencia CF'), t: 'souv', icon: 'scarf', inv: true },
  ninot: { n: _t('Mini-Ninot'), t: 'souv', icon: 'fallera', inv: true },
  chufa: { n: _t('Chufa-Beutel'), t: 'souv', icon: 'nuts', inv: true },
  pokal: { n: _t('Kart-Pokal'), t: 'souv', icon: 'trophy', inv: true },
  surfwax: { n: _t('Surf-Wax von Chris'), t: 'souv', icon: 'wax', inv: true },
  batterypass: { n: _t('Battery-Pass-Flyer von Lukas'), t: 'read', icon: 'paper', inv: true },
  canref: { n: _t('CANopen-Spickzettel von Fran'), t: 'read', icon: 'paper', inv: true },
};

/* ---- Sehenswürdigkeiten (recherchierte Fakten) ---- */
const SIGHTS = {
  ciudad: { n: _t('Ciudad de las Artes y las Ciencias'), f: _t('Der futuristische Komplex von Santiago Calatrava und Félix Candela im alten Turia-Flussbett. 1998 öffnete als Erstes das Hemisfèric; das Oceanogràfic ist das grösste Aquarium Europas.') },
  micalet: { n: _t('El Micalet'), f: _t('Der achteckige Glockenturm der Kathedrale, gotisch, 14./15. Jahrhundert, rund 51 Meter hoch. 207 Stufen führen auf die Plattform mit Blick über die ganze Stadt.') },
  lonja: { n: _t('Lonja de la Seda'), f: _t('Die spätgotische Seidenbörse (1482–1548) mit ihrer Säulenhalle ist seit 1996 UNESCO-Welterbe – ein Zeugnis der Handelsmacht Valencias im 15. Jahrhundert.') },
  serranos: { n: _t('Torres de Serranos'), f: _t('Stadttor von 1392–1398, eines der besterhaltenen gotischen Stadttore Europas. Von hier wird Ende Februar mit der „Crida“ die Fallas-Zeit eröffnet.') },
  mercado: { n: _t('Mercado Central'), f: _t('Die modernistische Markthalle wurde 1928 eröffnet und gehört zu den grössten Europas. Unter der Kuppel: Fisch, Jamón, Gemüse, Safran – und die Horchata-Bar.') },
  turia: { n: _t('Jardín del Turia'), f: _t('Nach der Flutkatastrophe von 1957 wurde der Fluss Turia umgeleitet. Im alten Flussbett entstand ein neun Kilometer langer Park, eröffnet 1986 – das Lieblingsrevier aller Velofahrer.') },
  malvarrosa: { n: _t('Playa de la Malvarrosa'), f: _t('Der breite Stadtstrand mit Promenade. Der Maler Joaquín Sorolla hat hier das Licht Valencias auf die Leinwand gebracht.') },
  marina: { n: _t('La Marina de València'), f: _t('Der Hafen wurde für den America’s Cup 2007 umgebaut. Heute: Segelboote, Veles e Vents und Konzerte am Wasser.') },
  virgen: { n: _t('Plaza de la Virgen'), f: _t('Der Turia-Brunnen zeigt den Flussgott mit acht Frauen – den acht Bewässerungskanälen der Huerta. Jeden Donnerstag um 12 Uhr tagt hier das Wassergericht, das älteste Gericht Europas (UNESCO 2009).') },
  ayuntamiento: { n: _t('Plaza del Ayuntamiento'), f: _t('Während der Fallas (1.–19. März) knallt hier jeden Tag um 14 Uhr die Mascletà: Minuten lang Böller, bis der Boden bebt.') },
  museum: { n: _t('Museu de Belles Arts'), f: _t('Eines der bedeutendsten Kunstmuseen Spaniens: Sorolla, Goya, El Greco und ein Selbstporträt von Velázquez hängen hier.') },
  estacion: { n: _t('Estación del Norte'), f: _t('Modernistischer Bahnhof von 1917, verziert mit Orangen, Azulejos und Mosaiken – Valencias schönste Visitenkarte.') },
  colon: { n: _t('Mercado de Colón'), f: _t('Die modernistische Markthalle von 1916 (Architekt Francisco Mora) an der Calle Colón: Eisen, Glas und Keramik. Heute keine Marktstände mehr, sondern Cafés, Horchaterías und Tapas unter dem Dach.') },
  colba: { n: _t('Colba-Hochhaus'), f: _t('Im ersten Stock entwickelt Colba die E-Bike-Apps. Die Klingel ist angeschrieben – trotzdem weiss niemand, welche die richtige ist.') },
};

/* ---- Erlebnisse ---- */
const ACH = {
  koffer: [_t('Gepäck gefunden'), _t('Den eigenen Koffer vom Band gefischt')],
  taxi: [_t('Taxi!'), _t('Mit der ganzen Truppe ins Hotel Kramer gefahren')],
  checkin: [_t('Eingecheckt'), _t('Im Hotel Kramer eingecheckt')],
  bar: [_t('Buenas noches'), _t('Alle am Montagabend in der Bar Pepita getroffen')],
  klingel: [_t('Klingelprofi'), _t('Die richtige Klingel am Colba-Hochhaus gefunden')],
  lift: [_t('Erster Stock'), _t('Im Colba-Office angekommen')],
  kickoff: [_t('Business Context'), _t('Robins ersten Vortrag überstanden')],
  poker: [_t('Planning Poker'), _t('Eine Schätzrunde mit Konsens abgeschlossen')],
  canopen: [_t('CANopen-Guru'), _t('Frans Index-Quiz fehlerfrei bestanden')],
  roam: ['ROAM', _t('Alle Risiken richtig eingeordnet')],
  board: [_t('Sprint-Board'), _t('Ein Programm-Board ohne Überlast gefüllt')],
  deps: [_t('Abhängigkeiten geklärt'), _t('Mit allen anderen Teams verhandelt')],
  plan50: [_t('Halbzeit'), _t('Der eigene PI-Plan steht zu 50 %')],
  plan80: [_t('Commitment'), _t('Der eigene PI-Plan steht zu 80 %')],
  confidence: [_t('Confidence Vote'), _t('Das Planning mit hohem Vertrauen abgeschlossen')],
  paella: [_t('Paella-Dienstag'), _t('Mittagessen im Aufenthaltsraum: Paella')],
  burgerday: [_t('Burger-Mittwoch'), _t('Smash Burger im Office verdrückt')],
  bocata: [_t('Bocadillo-Donnerstag'), _t('Spanische Sandwiches zum Zmittag')],
  healthy: [_t('Healthy Friday'), _t('Mit einer Bowl in den letzten Tag gestartet')],
  bunyols: [_t('Buñuelos'), _t('Buñuelos de calabaza mit Schokolade gegessen – die Woche nach Todos los Santos')],
  mestalla: [_t('Amunt!'), _t('Das Valencia-Spiel am Donnerstagabend in der Bar Pepita gesehen')],
  tribunal: [_t('Wassergericht'), _t('Das Tribunal de las Aguas am Donnerstag erlebt')],
  gota: [_t('Gota fría'), _t('Von einem valencianischen Platzregen erwischt')],
  moewe: [_t('Möwenalarm'), _t('Am Strand von einer Möwe beklaut worden')],
  segeln: [_t('Segeltörn'), _t('Im Hafen alle Bojen gerundet')],
  kart: [_t('Kartbahn'), _t('Auf der Kartbahn gefahren')],
  kartsieg: [_t('Pole Position'), _t('Luigi auf der Kartbahn geschlagen')],
  wein: [_t('Sommelier'), _t('Bei der Weindegustation alle Weine erkannt')],
  museum: [_t('Kulturbanause'), _t('Im Museu de Belles Arts alle Bilder angeschaut')],
  fussball: [_t('Strandkick'), _t('Beim Strandfussball gewonnen')],
  disco: [_t('Noche Valenciana'), _t('In der Disco über 80 % getanzt')],
  padel: [_t('Padel-Champion'), _t('Das Padel-Turnier gewonnen')],
  fischmarkt: [_t('Mercado'), _t('Im Mercado Central eingekauft')],
  horchata: [_t('Chufa-Fan'), _t('Horchata mit Fartons getrunken')],
  jamon: [_t('Bellota'), _t('Eine Ración Jamón Ibérico gegessen')],
  aguaval: [_t('Agua de Valencia'), _t('Den Stadt-Cocktail probiert')],
  paellachef: [_t('Socarrat'), _t('Den Paella-Kochwettbewerb gewonnen')],
  ebike: [_t('Ausfahrt'), _t('Mit dem E-Bike durch den Turia-Park gefahren')],
  akku: [_t('Akku leer'), _t('Mit leerem Akku nach Hause getreten')],
  teamride: [_t('Team-Ausfahrt'), _t('Die Donnerstags-Ausfahrt mit dem Team gefahren')],
  surf: [_t('Dawn Patrol'), _t('Mit Chris am Morgen im Wasser gewesen')],
  autofan: [_t('Benzingespräch'), _t('Mit Luigi über Autos gefachsimpelt')],
  rauchpause: [_t('Rauchpause'), _t('Mit Dominique auf dem Balkon gestanden')],
  robin: [_t('Chef-Betreuung'), _t('Robin dreimal den Weg gezeigt')],
  battery: [_t('Battery Pass'), _t('Lukas’ Vortrag über den Batteriepass gehört')],
  leipzig: [_t('Sachse'), _t('Pascals Anreise aus Leipzig angehört')],
  fuerte: [_t('Fuerte-Vibes'), _t('Chris’ Surfbericht aus Fuerteventura angehört')],
  isabell: [_t('Backoffice'), _t('Isabel bei der Organisation geholfen')],
  asado: [_t('Asado bei Danny'), _t('Am Mittwochabend in Dannys Garten gegrillt')],
  bass: [_t('Hardrock'), _t('Carlos’ Bass-Solo im Garten gehört')],
  cuba: [_t('Havanna-Vibes'), _t('Mit Danny und Bea über Kuba geredet und einen echten Mojito getrunken')],
  grillmeister: [_t('Grillmeister'), _t('Am Grill nichts verbrannt')],
  telemetrie: [_t('Telemetrie'), _t('Live-Daten eines E-Bikes am Diagnose-PC gelesen')],
  ux: [_t('UX-Auge'), _t('Elenas UX-Workshop mitgemacht')],
  arch: [_t('Schichtenmodell'), _t('Carlos’ Architektur-Workshop mitgemacht')],
  roadmap: [_t('Roadmap'), _t('Mit Chris Meilensteine und Releases auf die Sprints gelegt')],
  retro: [_t('Retro'), _t('Die PI-Retrospektive mitgemacht')],
  tester: [_t('Reproduzierbar'), _t('Mit Daniel über Testen und Dokumentation geredet')],
  kotzen: [_t('Ups…'), _t('Sich übergeben müssen')],
  filmriss: [_t('Filmriss'), _t('Komplett abgestürzt')],
  kater: [_t('Kater besiegt'), _t('Einen Kater kuriert')],
  sonnenbrand: [_t('Rot wie eine Tomate'), _t('Ohne Sonnencreme zu lange am Strand')],
  shopping: [_t('Shopping'), _t('Neue Kleider gekauft')],
  souvenir: [_t('Andenken'), _t('Ein Souvenir gekauft')],
  fotos: [_t('Fotograf'), _t('Alle Sehenswürdigkeiten fotografiert')],
  knipser: [_t('Knipser'), _t('Einen Schnappschuss gemacht')],
  strich: [_t('Strichliste voll'), _t('10 Biere in Valencia')],
  heimflug: [_t('Heimflug'), _t('Nach fünf Tagen Planning wieder im Flieger')],
};

const TEAMS = {
  indurain: { n: _t('Team Indurain'), col: '#e2554a', po: 'simon', members: ['danny', 'fran', 'estella', 'bea', 'vicente'], room: _t('Raum 1 · Indurain') },
  meeseeks: { n: _t('Team Meeseeks'), col: '#2fa0d8', po: 'luigi', members: ['juanjo', 'oscar', 'pablo', 'guillem', 'elena', 'pascal'], room: _t('Raum 2 · Meeseeks') },
  rocket: { n: _t('Team Rocket'), col: '#f0a23a', po: 'dominique', members: ['carlos', 'salva', 'aitor', 'daniel'], room: _t('Raum 3 · Rocket') },
};

function newState(look, name) {
  return {
    v: 1, name: name || _t('Simon'), look, unlocked: {},
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
function dateLong(t = G.S.time) { const c = calDate(t); return `${DAY_NAMES[dayOf(t) % 7]}, ${c.d}. ${MONTH_NAMES[c.m - 1]} ${c.y}`; }
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
  UI.toast(_t`<b>Erlebnis:</b> ${ACH[id][0]}`, 'ach');
  Track.event('ach', ACH[id][0]);
}
function addPhoto(id) {
  if (G.S.photos[id]) { UI.toast(_t('Davon hast du schon ein Foto.')); return false; }
  G.S.photos[id] = G.S.time;
  Snd.sfx('shutter');
  G.fx.flash = 1;
  UI.toast(_t`📷 Foto: <b>${SIGHTS[id].n}</b>`);
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
    if (it.hang && st.hang > 0) { st.hang = Math.max(0, st.hang - 40 * it.hang); if (st.hang <= 0) { achieve('kater'); UI.toast(_t('Der Kater ist weg!')); } }
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
  warnOnce('hunger', st.food < 18, _t('Dein Magen knurrt. Zeit für ein Bocadillo?'), st.food > 35);
  warnOnce('tired', st.energy < 22, _t('Du bist müde. Leg dich im Hotelzimmer kurz hin – oder hol dir einen Cortado.'), st.energy > 40);
  warnOnce('nau1', st.nau > 60, _t('Dir ist flau im Magen …'), st.nau < 40);
  warnOnce('nau2', st.nau > 85, _t('Dir wird richtig übel! Iss etwas oder geh schlafen.'), st.nau < 70);
  warnOnce('prom1', st.prom > 1.2, _t('Die Welt fängt an zu schwanken.'), st.prom < 0.9);
  warnOnce('prom2', st.prom > 2.0, _t('Du siehst doppelt. Vielleicht ein Wasser?'), st.prom < 1.7);
  warnOnce('sun', st.sun > 60, _t('Deine Haut brennt – Sonnencreme oder in den Schatten!'), st.sun < 30);
  if (st.sun >= 100) achieve('sonnenbrand');
  if (st.energy > 40) G.warned.tiredCrit = 0;
  if (!G.busy && Story.ready) {
    if (st.nau >= 100) Story.vomit();
    else if (st.prom >= 2.6) Story.blackout();
    else if (st.energy <= 7 && !G.warned.tiredCrit) Story.tiredWarning();
    else if (st.energy <= 0) Story.collapse();
  }
}
function promStr(v = G.S.st.prom) { return v.toFixed(2).replace('.', numSep()) + ' ‰'; }

/* ---- Speichern ---- */
const SAVE_KEY = 'pi-valencia-v1' + (BUILD_VARIANT ? '-' + BUILD_VARIANT : '');
function saveGame(silent) {
  if (!G.S || !G.player) return;
  G.S.map = G.map.id; G.S.x = Math.round(G.player.x); G.S.y = Math.round(G.player.y); G.S.dir = G.player.dir;
  Track.send('save');
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(G.S)); if (!silent) UI.toast(_t('Spielstand gespeichert.')); return true; }
  catch (e) { if (!silent) UI.toast(_t('Speichern ist in diesem Browser nicht möglich.'), 'warn'); return false; }
}
function loadSave() {
  try { const s = localStorage.getItem(SAVE_KEY); if (!s) return null; const o = JSON.parse(s); return o && o.v === 1 ? o : null; } catch (e) { return null; }
}
function clearSave() { try { localStorage.removeItem(SAVE_KEY); } catch (e) {} }
