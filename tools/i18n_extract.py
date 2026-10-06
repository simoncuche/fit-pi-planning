"""Übersetzungs-Werkzeug.

  python3 tools/i18n_extract.py          # zeigt Schlüssel, die in i18n/en.json oder i18n/es.json fehlen
  python3 tools/i18n_extract.py wrap     # umhüllt neue Text-Literale in src/js/*.js mit _t(...) bzw. _t`...`

Der deutsche Text ist der Schlüssel; Template-Literale bekommen Platzhalter {0}, {1}, … Strings, die schon
mit _t umhüllt sind, Objektschlüssel, case-Labels, Farben, CSS-Selektoren und Tastencodes werden übersprungen.
"""
import re, sys, json, pathlib
GER = re.compile(r'[äöüÄÖÜß]')
REPO = pathlib.Path(__file__).resolve().parent.parent
ROOT = REPO / 'src' / 'js'
SKIP = {'00_i18n.js', '00_lang_en.js', '00_lang_es.js'}

def tokens(src):
    """Alle String-/Template-Literale (auch verschachtelte) als (kind, start, end)."""
    n = len(src); out = []
    def scan_string(i):
        q = src[i]; j = i + 1
        while j < n:
            ch = src[j]
            if ch == '\\': j += 2; continue
            if ch == q: return j + 1
            if ch == '\n': raise ValueError('newline in string at %d' % i)
            j += 1
        raise ValueError('unterminated string')
    def scan_template(i):
        j = i + 1
        while j < n:
            ch = src[j]
            if ch == '\\': j += 2; continue
            if ch == '`': return j + 1
            if ch == '$' and src[j+1] == '{':
                j = scan_code(j + 2, stop_brace=True); continue
            j += 1
        raise ValueError('unterminated template at %d' % i)
    def scan_code(i, stop_brace=False):
        depth = 1; last_sig = '{' if stop_brace else ''
        while i < n:
            ch = src[i]
            if ch == '/' and i + 1 < n and src[i+1] == '/': i = src.index('\n', i); continue
            if ch == '/' and i + 1 < n and src[i+1] == '*': i = src.index('*/', i) + 2; continue
            if ch in '\'"':
                j = scan_string(i); out.append(('str', i, j)); i = j; last_sig = '"'; continue
            if ch == '`':
                j = scan_template(i); out.append(('tpl', i, j)); i = j; last_sig = '`'; continue
            if ch == '/' and last_sig and last_sig in '(,=:[!&|?{};+-*%<>~^':
                j = i + 1; cls = False
                while j < n:
                    c = src[j]
                    if c == '\\': j += 2; continue
                    if c == '[': cls = True
                    elif c == ']': cls = False
                    elif c == '/' and not cls: break
                    elif c == '\n': raise ValueError('regex newline at %d' % i)
                    j += 1
                j += 1
                while j < n and src[j].isalpha(): j += 1
                i = j; last_sig = '/'; continue
            if stop_brace:
                if ch == '{': depth += 1
                elif ch == '}':
                    depth -= 1
                    if depth == 0: return i + 1
            if not ch.isspace(): last_sig = ch
            i += 1
        if stop_brace: raise ValueError('unterminated ${')
        return i
    scan_code(0)
    out.sort(key=lambda t: t[1])
    return out

def unescape(s):
    return re.sub(r'\\(u\{[0-9a-fA-F]+\}|u[0-9a-fA-F]{4}|.)', lambda m: {'n': '\n', 't': '\t', '\\': '\\', "'": "'", '"': '"', '`': '`', '$': '$', '0': '\0'}.get(m.group(1), (chr(int(m.group(1)[2:-1], 16)) if m.group(1).startswith('u{') else chr(int(m.group(1)[1:], 16)) if m.group(1).startswith('u') else m.group(1))), s)

def cooked_key(kind, raw):
    inner = raw[1:-1]
    if kind == 'str': return unescape(inner)
    # Template: ${...} → {i}
    parts = []; i = 0; k = 0; n = len(inner); buf = ''
    while i < n:
        ch = inner[i]
        if ch == '\\': buf += inner[i:i+2]; i += 2; continue
        if ch == '$' and i + 1 < n and inner[i+1] == '{':
            # Ende des Ausdrucks finden (verschachtelte Klammern/Strings/Templates)
            depth = 1; j = i + 2
            while depth:
                c = inner[j]
                if c in '\'"':
                    q = c; j += 1
                    while inner[j] != q:
                        if inner[j] == '\\': j += 1
                        j += 1
                    j += 1; continue
                if c == '`':
                    j += 1
                    while inner[j] != '`':
                        if inner[j] == '\\': j += 1
                        elif inner[j] == '$' and inner[j+1] == '{':
                            d2 = 1; j += 2
                            while d2:
                                if inner[j] == '{': d2 += 1
                                elif inner[j] == '}': d2 -= 1
                                j += 1
                            continue
                        j += 1
                    j += 1; continue
                if c == '{': depth += 1
                elif c == '}': depth -= 1
                j += 1
            buf += '{%d}' % k; k += 1; i = j; continue
        buf += ch; i += 1
    return unescape(buf)

EXCL = {' sel', ' on', ' cur', 'toast ', '.ed-tabs .tab', '.lanes button', ' · '}
KEYCODE = re.compile(r'^(Key[A-Z]|Arrow(Up|Down|Left|Right)|Enter|Space|Escape|Tab)$')
def is_text(s):
    if len(s) < 2: return False
    if s in EXCL or KEYCODE.match(s): return False
    if s.startswith('<svg'): return False
    if s.startswith('translate('): return False
    if '="' in s and '<' not in s: return False   # HTML-Attributfragment
    plain = re.sub(r'<[^>]*>|\{\d+\}', '', s)
    if not re.search(r'[A-Za-zÀ-ÿ]', plain): return False
    if s.startswith(('#', 'rgba(', 'rgb(')): return False
    if re.match(r'^[\d.]+px ', s) or re.match(r'^(bold |italic )?[\d.]+px', s): return False
    if re.match(r'^[a-z0-9_\-]+$', s): return False
    if re.match(r'^[a-z0-9_\-]+( [a-z0-9_\-]+)+$', s) and not GER.search(s): return False
    if re.match(r'^[\d\s.,:%+\-×/{}]+$', s): return False
    if re.match(r'^M[\d.\-]', s): return False  # SVG-Pfad
    if GER.search(s): return True
    if re.match(r'^[A-Za-z0-9ÄÖÜäöü][A-Za-z0-9ÄÖÜäöüß]*(-[A-Za-z0-9ÄÖÜäöüß]+)+$', s) and re.search(r'[A-ZÄÖÜ]', s) and not re.match(r'^[A-Z0-9-]+$', s): return True  # Bindestrich-Wörter wie E-Bike-Miete
    if ' ' in s: return True
    if re.match(r'^[A-ZÄÖÜ][a-zäöüß]+', s): return True
    if s.endswith(('.', '!', '?', '…', ':')): return True
    return False

def sig_before(src, i):
    j = i - 1
    while j >= 0 and src[j].isspace(): j -= 1
    return src[j] if j >= 0 else ''
def word_before(src, i):
    j = i - 1
    while j >= 0 and src[j].isspace(): j -= 1
    k = j
    while k >= 0 and (src[k].isalnum() or src[k] == '_'): k -= 1
    return src[k+1:j+1]
def sig_after(src, i):
    j = i
    while j < len(src) and src[j].isspace(): j += 1
    return src[j] if j < len(src) else ''

keys = []
mode = sys.argv[1] if len(sys.argv) > 1 else 'extract'
for f in sorted(ROOT.glob('*.js')):
    if f.name in SKIP: continue
    src = f.read_text()
    toks = tokens(src)
    edits = []
    for kind, a, b in toks:
        raw = src[a:b]
        key = cooked_key(kind, raw)
        if not is_text(key): continue
        pb = sig_before(src, a); pa = sig_after(src, b)
        if pa == ':' and pb in '{,' : continue           # Objekt-Schlüssel
        if word_before(src, a) == 'case': continue
        line = src.count('\n', 0, a) + 1
        keys.append({'f': f.name, 'l': line, 'k': key})
        if src[a-3:a] == '_t(' or src[a-2:a] == '_t': continue  # schon umhüllt
        if kind == 'str': edits.append((a, '_t(')); edits.append((b, ')'))
        else: edits.append((a, '_t'))
    if mode == 'wrap':
        for pos, ins in sorted(edits, key=lambda e: -e[0]):
            src = src[:pos] + ins + src[pos:]
        f.write_text(src)
        print(f.name, len(edits))
uniq = []
for k in keys:
    if k['k'] not in uniq: uniq.append(k['k'])
print('Texte:', len(keys), 'eindeutig:', len(uniq))
for lp in sorted((REPO / 'i18n').glob('*.json')):
    d = json.loads(lp.read_text(encoding='utf-8'))
    miss = [k for k in uniq if k not in d]
    print(f'{lp.name}: {len(d)} Einträge, {len(miss)} fehlen')
    for k in miss: print('  ', json.dumps(k, ensure_ascii=False))
