/* ============ Die Leute: Reisegruppe, Colba, Backoffice ============ */
const PEOPLE = {
  simon: { name: _t('Simon'), role: _t('Organisator · PO Indurain'), team: 'indurain', bg: '#2a4a3a', from: _t('Zürich'), intro: _t('Hat die Agenda, die Hotelbuchung und das Restaurant für den Donnerstag im Kopf.') },
  luigi: { name: _t('Luigi'), role: _t('PO Meeseeks · Autofan'), team: 'meeseeks', bg: '#5a2a24', from: _t('Zürich'), intro: _t('Redet über PS, wenn andere über Story Points reden. Kartbahn ist Pflicht.') },
  dominique: { name: _t('Dominique'), role: _t('PO Rocket'), team: 'rocket', bg: '#3a3a4a', from: _t('Zürich'), intro: _t('Alle 45 Minuten auf den Balkon. Dort entstehen die besten Ideen.') },
  robin: { name: _t('Robin'), role: _t('Geschäftsführer · zum ersten Mal dabei'), team: 'indurain', bg: '#2a2a3a', from: _t('Zürich'), intro: _t('Hält am Dienstag den Business Context – und hat noch nie eine valencianische Klingel gedrückt.') },
  lukas: { name: _t('Lukas'), role: _t('Battery-Pass-Spezialist'), team: 'rocket', bg: '#6a2a2a', from: _t('Bern'), intro: _t('Kennt die EU-Batterieverordnung auswendig. Jede Zelle bekommt einen Pass.') },
  pascal: { name: _t('Pascal'), role: _t('iOS-Entwickler aus Leipzig'), team: 'meeseeks', bg: '#2a3a5a', from: _t('Leipzig'), intro: _t('Reist allein aus Leipzig an. SwiftUI im Blut, Club Mate im Rucksack.') },
  chris: { name: _t('Chris'), role: _t('Product Manager aus Fuerteventura · Surfer'), team: 'meeseeks', bg: '#2a5a6a', from: _t('Fuerteventura'), intro: _t('Kommt mit Surf-Wax und Roadmap aus Fuerteventura. Morgens Wellen, tagsüber Features.') },
  danny: { name: _t('Danny'), role: _t('Teamleiter Indurain'), team: 'indurain', bg: '#3a2a2a' },
  fran: { name: _t('Fran'), role: _t('Hardware-Entwickler · CANopen-Experte'), team: 'indurain', bg: '#2a2a2a' },
  estella: { name: _t('Estella'), role: _t('Software-Entwicklerin · Indurain'), team: 'indurain', bg: '#5a4a2a' },
  bea: { name: _t('Bea'), role: _t('Backend-Entwicklerin'), team: 'indurain', bg: '#2a3a4a' },
  vicente: { name: _t('Vicente'), role: _t('DevOps-Engineer'), team: 'indurain', bg: '#2a4a4a' },
  juanjo: { name: _t('Juanjo'), role: _t('Inhaber von Colba · Android'), team: 'meeseeks', bg: '#4a3a2a' },
  oscar: { name: _t('Oscar'), role: _t('Android-Entwickler'), team: 'meeseeks', bg: '#3a3a3a' },
  pablo: { name: _t('Pablo'), role: _t('iOS-Entwickler'), team: 'meeseeks', bg: '#5a3a2a' },
  guillem: { name: _t('Guillem'), role: _t('iOS-Entwickler'), team: 'meeseeks', bg: '#4a2a5a' },
  elena: { name: _t('Elena'), role: _t('UX- und UI-Designerin'), team: 'meeseeks', bg: '#5a2a4a' },
  carlos: { name: _t('Carlos'), role: _t('Software-Architekt · Bassist'), team: 'rocket', bg: '#3a3a2a' },
  salva: { name: _t('Salva'), role: _t('Software-Entwickler · Rocket'), team: 'rocket', bg: '#2a3a5a' },
  aitor: { name: _t('Aitor'), role: _t('Software-Entwickler · Radfahrer'), team: 'rocket', bg: '#5a4a1a' },
  isabell: { name: _t('Isabell'), role: _t('Backoffice · Organisation'), team: null, bg: '#2a5a5a' },
};
const TRAVELLERS = ['simon', 'luigi', 'dominique', 'robin', 'lukas', 'pascal', 'chris'];
const COLBA = ['danny', 'fran', 'estella', 'bea', 'vicente', 'juanjo', 'oscar', 'pablo', 'guillem', 'elena', 'carlos', 'salva', 'aitor'];
const SWISS = ['simon', 'luigi', 'dominique', 'robin', 'lukas'];
/* Alle Figuren sind spielbar: Reisende landen am Flughafen, Colba-Leute holen die Gäste dort ab */
const CREW = Object.keys(PEOPLE).map((id) => Object.assign({ id }, PEOPLE[id]));
/* Vordefiniertes Aussehen (Indizes siehe LOOK_OPTS in 02_look.js) */
const PEOPLE_LOOKS = {
  simon: { fem: 0, skin: 1, build: 1, height: 1, head: 0, hair: 2, hairCol: 2, beard: 0, beardCol: 2, eyes: 0, eyeCol: 4, glasses: 0, top: 0, topCol: 14, print: 0, pants: 0, pantsCol: 0, shoes: 0, shoesCol: 0, acc: 6, hat: 0, mark: 0, jewel: 0 },
  luigi: { fem: 0, skin: 2, build: 2, height: 1, head: 2, hair: 2, hairCol: 4, beard: 1, beardCol: 4, eyes: 0, eyeCol: 1, glasses: 0, top: 2, topCol: 17, print: 0, pants: 0, pantsCol: 0, shoes: 0, shoesCol: 1, hat: 0, acc: 0, mark: 0, jewel: 0 },
  dominique: { fem: 0, skin: 1, build: 1, height: 1, head: 3, hair: 2, hairCol: 2, beard: 1, beardCol: 2, eyes: 3, eyeCol: 6, glasses: 0, top: 2, topCol: 11, print: 0, pants: 1, pantsCol: 2, shoes: 1, shoesCol: 1, hat: 0, acc: 7, mark: 6, jewel: 0 },
  robin: { fem: 0, skin: 1, build: 2, height: 2, head: 2, hair: 2, hairCol: 9, beard: 0, beardCol: 8, eyes: 0, eyeCol: 4, glasses: 2, top: 7, topCol: 11, print: 0, pants: 5, pantsCol: 3, shoes: 3, shoesCol: 2, hat: 0, acc: 3, mark: 0, jewel: 0 },
  lukas: { fem: 0, skin: 2, build: 1, height: 1, head: 1, hair: 6, hairCol: 4, beard: 1, beardCol: 4, eyes: 4, eyeCol: 3, glasses: 0, top: 0, topCol: 0, print: 2, pants: 0, pantsCol: 0, shoes: 2, shoesCol: 2, hat: 0, acc: 1, mark: 1, jewel: 0 },
  pascal: { fem: 0, skin: 1, build: 0, height: 2, head: 3, hair: 14, hairCol: 3, beard: 0, beardCol: 3, eyes: 0, eyeCol: 6, glasses: 0, top: 0, topCol: 6, print: 0, pants: 2, pantsCol: 2, shoes: 0, shoesCol: 0, hat: 0, acc: 6, mark: 0, jewel: 2 },
  chris: { fem: 0, skin: 5, build: 2, height: 2, head: 0, hair: 6, hairCol: 2, beard: 0, beardCol: 2, eyes: 0, eyeCol: 4, glasses: 0, top: 0, topCol: 8, print: 6, pants: 6, pantsCol: 12, shoes: 6, shoesCol: 1, hat: 0, acc: 2, mark: 0, jewel: 0 },
  danny: { fem: 0, skin: 5, build: 1, height: 1, head: 2, hair: 2, hairCol: 0, beard: 1, beardCol: 0, eyes: 0, eyeCol: 1, glasses: 0, top: 1, topCol: 9, print: 0, pants: 1, pantsCol: 8, shoes: 3, shoesCol: 2, hat: 0, acc: 0, mark: 0, jewel: 0 },
  fran: { fem: 0, skin: 3, build: 3, height: 1, head: 1, hair: 2, hairCol: 2, beard: 5, beardCol: 2, eyes: 0, eyeCol: 0, glasses: 0, top: 0, topCol: 16, print: 0, pants: 0, pantsCol: 0, shoes: 1, shoesCol: 1, hat: 0, acc: 5, mark: 7, jewel: 0, mouth: 0 },
  estella: { fem: 1, skin: 2, build: 0, height: 0, head: 4, hair: 14, hairCol: 7, beard: 0, eyes: 1, eyeCol: 3, glasses: 0, top: 0, topCol: 4, print: 0, pants: 0, pantsCol: 1, shoes: 0, shoesCol: 0, hat: 0, acc: 1, mark: 1, jewel: 3 },
  bea: { fem: 1, skin: 6, build: 1, height: 1, head: 0, hair: 14, hairCol: 0, beard: 0, eyes: 0, eyeCol: 1, glasses: 0, top: 0, topCol: 0, print: 0, pants: 1, pantsCol: 2, shoes: 0, shoesCol: 1, hat: 0, acc: 0, mark: 0, jewel: 1 },
  vicente: { fem: 0, skin: 4, build: 0, height: 2, head: 3, hair: 1, hairCol: 0, beard: 0, beardCol: 0, eyes: 0, eyeCol: 1, glasses: 0, top: 0, topCol: 14, print: 4, pants: 0, pantsCol: 0, shoes: 0, shoesCol: 0, hat: 0, acc: 0, mark: 0, jewel: 0, mouth: 2 },
  juanjo: { fem: 0, skin: 4, build: 1, height: 1, head: 2, hair: 3, hairCol: 0, beard: 0, beardCol: 0, eyes: 0, eyeCol: 0, glasses: 2, top: 0, topCol: 10, print: 0, pants: 0, pantsCol: 0, shoes: 0, shoesCol: 0, hat: 0, acc: 3, mark: 0, jewel: 0 },
  oscar: { fem: 0, skin: 6, build: 1, height: 1, head: 3, hair: 2, hairCol: 0, beard: 0, beardCol: 0, eyes: 2, eyeCol: 1, glasses: 0, top: 1, topCol: 15, print: 0, pants: 0, pantsCol: 8, shoes: 3, shoesCol: 1, hat: 0, acc: 0, mark: 0, jewel: 0, nose: 3 },
  pablo: { fem: 0, skin: 4, build: 2, height: 1, head: 0, hair: 2, hairCol: 0, beard: 4, beardCol: 0, eyes: 0, eyeCol: 1, glasses: 0, top: 0, topCol: 14, print: 0, pants: 3, pantsCol: 5, shoes: 4, shoesCol: 2, hat: 0, acc: 2, mark: 0, jewel: 0 },
  guillem: { fem: 0, skin: 3, build: 0, height: 1, head: 1, hair: 11, hairCol: 0, beard: 0, beardCol: 0, eyes: 4, eyeCol: 1, glasses: 0, top: 3, topCol: 12, print: 0, pants: 0, pantsCol: 1, shoes: 0, shoesCol: 4, hat: 0, acc: 0, mark: 0, jewel: 0 },
  elena: { fem: 1, skin: 3, build: 1, height: 1, head: 4, hair: 14, hairCol: 0, beard: 0, eyes: 1, eyeCol: 1, glasses: 0, top: 11, topCol: 13, print: 0, pants: 8, pantsCol: 2, shoes: 3, shoesCol: 1, hat: 0, acc: 6, mark: 4, jewel: 1, mouth: 4 },
  carlos: { fem: 0, skin: 3, build: 0, height: 2, head: 3, hair: 2, hairCol: 2, beard: 0, beardCol: 2, eyes: 3, eyeCol: 0, glasses: 0, top: 0, topCol: 17, print: 0, pants: 1, pantsCol: 2, shoes: 1, shoesCol: 1, hat: 0, acc: 0, mark: 0, jewel: 0 },
  salva: { fem: 0, skin: 4, build: 1, height: 0, head: 1, hair: 2, hairCol: 2, beard: 0, beardCol: 2, eyes: 1, eyeCol: 0, glasses: 1, top: 0, topCol: 10, print: 4, pants: 0, pantsCol: 0, shoes: 0, shoesCol: 5, hat: 0, acc: 1, mark: 0, jewel: 0 },
  aitor: { fem: 0, skin: 4, build: 2, height: 1, head: 2, hair: 2, hairCol: 1, beard: 1, beardCol: 1, eyes: 0, eyeCol: 0, glasses: 0, top: 0, topCol: 2, print: 0, pants: 0, pantsCol: 0, shoes: 5, shoesCol: 1, hat: 0, acc: 3, mark: 0, jewel: 0, nose: 2 },
  isabell: { fem: 1, skin: 2, build: 1, height: 1, head: 0, hair: 14, hairCol: 2, beard: 0, eyes: 0, eyeCol: 4, glasses: 0, top: 11, topCol: 8, print: 0, pants: 5, pantsCol: 2, shoes: 3, shoesCol: 1, hat: 0, acc: 3, mark: 0, jewel: 1 },
};
function personLook(id) {
  const p = PEOPLE[id];
  const base = randomLook(rng(p.name.length * 977 + p.name.charCodeAt(0) * 31), {}, { fem: 0 });
  return Object.assign(base, { fem: 0, mark: 0, jewel: 0, hat: 0, acc: 0, print: 0, glasses: 0 }, PEOPLE_LOOKS[id] || {});
}
function npcLook(seed, o = {}) { const L = randomLook(rng(seed), {}); return Object.assign(L, o); }
let FRIENDS = {};
function buildFriends() {
  FRIENDS = {};
  for (const id of Object.keys(PEOPLE)) { if (id === G.S.pid) continue; FRIENDS[id] = { id, name: PEOPLE[id].name, role: PEOPLE[id].role, look: personLook(id), bg: PEOPLE[id].bg, team: PEOPLE[id].team }; }
  for (const k of Object.keys(FRIENDS)) if (G.S.aff[k] == null) G.S.aff[k] = 50;
  if (!G.S.fprom) G.S.fprom = {};
  if (!G.S.team) G.S.team = PEOPLE[G.S.pid].team;
}
const fname = (id) => (PEOPLE[id] ? PEOPLE[id].name : id);
const myTeam = () => G.S.team || PEOPLE[G.S.pid].team || 'indurain';
const isPO = () => TEAMS[myTeam()].po === G.S.pid;
const teamOf = (id) => PEOPLE[id] && PEOPLE[id].team;
/* Wer führt das Team an, wenn man dessen PO nicht selber ist? */
function teamLead(team) { const po = TEAMS[team].po; return po === G.S.pid ? ({ indurain: 'danny', meeseeks: 'juanjo', rocket: 'carlos' })[team] : po; }
const fprom = (id) => (G.S.fprom && G.S.fprom[id]) || 0;
const listNames = (ids) => { const n = ids.map(fname); return n.length <= 1 ? n.join('') : n.slice(0, -1).join(', ') + _t(' und ') + n[n.length - 1]; };

/* Abhängigkeiten zwischen den Teams – werden im Planning verhandelt */
const DEPS = {
  d1: { t: _t('Battery-SOC-Telemetrie in der App'), from: 'indurain', to: 'meeseeks', d: _t('Indurain liefert den CANopen-Datenstrom (Index 0x6060), Meeseeks zeigt ihn in Android und iOS an.') },
  d2: { t: _t('Login-SDK für die Web-App'), from: 'meeseeks', to: 'rocket', d: _t('Meeseeks baut das Auth-SDK, Rocket braucht es für das Händlerportal.') },
  d3: { t: _t('Refactoring des CAN-Parsers'), from: 'rocket', to: 'indurain', d: _t('Carlos räumt den Parser auf, Indurain baut darauf die Motor-Diagnose.') },
  d4: { t: _t('OTA-Firmware-Update über CANopen'), from: 'indurain', to: 'rocket', d: _t('Indurain definiert das Update-Protokoll (SDO-Blocktransfer), Rocket baut den Update-Server.') },
  d5: { t: _t('Design-System für Diagnose-Screens'), from: 'meeseeks', to: 'indurain', d: _t('Elena liefert die Komponenten, Indurain nutzt sie für die Werkstatt-App.') },
  d6: { t: _t('Battery-Pass-API für die Mobile-App'), from: 'rocket', to: 'meeseeks', d: _t('Rocket baut mit Lukas die Batteriepass-Schnittstelle, Meeseeks zeigt den QR-Code in der App.') },
};
