/* ---- Sprachen: Englisch (Standard), Deutsch, Spanisch ----
   Alle sichtbaren Texte im Code sind deutsch und mit _t('…') bzw. _t`…` umhüllt. Der deutsche Text ist der Schlüssel;
   00_lang_en.js und 00_lang_es.js enthalten die Übersetzungen. Platzhalter in Template-Literalen heissen {0}, {1}, …
   Die Sprache wird beim Laden gewählt (localStorage); ein Wechsel lädt die Seite neu. */
const LANGS = { en: 'English', de: 'Deutsch', es: 'Español' };
const LANG_KEY = 'pi-valencia-lang';
const LANG = (() => { try { const l = localStorage.getItem(LANG_KEY); if (l && LANGS[l]) return l; } catch (e) {} return 'en'; })();
const I18N = {};
const I18N_MISSING = new Set();
function _t(s, ...vals) {
  const d = I18N[LANG];
  if (Array.isArray(s)) {
    let key = '';
    for (let i = 0; i < s.length; i++) key += s[i] + (i < s.length - 1 ? '{' + i + '}' : '');
    let out = d && d[key] != null ? d[key] : key;
    if (LANG !== 'de' && !(d && d[key] != null)) I18N_MISSING.add(key);
    return out.replace(/\{(\d+)\}/g, (m, i) => String(vals[+i]));
  }
  if (d && d[s] != null) return d[s];
  if (LANG !== 'de') I18N_MISSING.add(s);
  return s;
}
function setLang(l) { if (!LANGS[l] || l === LANG) return; try { localStorage.setItem(LANG_KEY, l); } catch (e) {} location.reload(); }
/* Zahlen: 12,50 € (de/es) bzw. 12.50 € (en) */
const numSep = () => (LANG === 'en' ? '.' : ',');
