"""Trailer-Video (media/trailer.mp4) aus dist/index.html erzeugen: Bilder, Ton, Video.

    python3 build.py && python3 tools/trailer_video.py [--out media/trailer.mp4] [--fps 24]

Braucht Playwright mit Chromium (CHROMIUM_PATH=… für ein vorhandenes Chromium), numpy und ffmpeg.
Die Szenen kommen aus Trailer.FULL in src/js/11_trailer.js: [Dauer, Funktion, Geräusch]. Geräusche:
'intro', 'panel', 'words:<Anzahl Wörter>', 'plan', 'final'. Die Texte erscheinen in der Standardsprache (Englisch).
Danach python3 build.py nochmals laufen lassen, damit dist/trailer.mp4 die neue Datei bekommt.
"""
import argparse, json, os, pathlib, shutil, subprocess, sys, tempfile, wave

import numpy as np
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
FINAL_TAIL = 6.8  # Sekunden Titelkarte am Schluss
SR = 44100


def chromium():
    p = os.environ.get("CHROMIUM_PATH")
    if p:
        return p
    for c in sorted(pathlib.Path("/opt/pw-browsers").glob("chromium-*/chrome-linux/chrome")):
        return str(c)
    return None


def capture(frames_dir, fps):
    url = (ROOT / "dist" / "index.html").as_uri()
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path=chromium())
        pg = b.new_page(viewport={"width": 1920, "height": 1080}, device_scale_factor=1)
        pg.route("**/firebasedatabase.app/**", lambda r: r.abort())
        pg.goto(url)
        pg.wait_for_timeout(2000)
        pg.evaluate("""async () => { await document.fonts.load("700 30px 'Oswald'"); await document.fonts.load("800 20px 'Nunito'"); await document.fonts.ready; }""")
        # Ohne PC-Rahmen, ganzer Trailer, ohne «Überspringen»/«Taste drücken» und ohne den ▶-Knopf
        pg.evaluate("""() => { document.body.classList.add('touch'); frameSize(); cancelAnimationFrame(Trailer.raf);
          Trailer.S = Trailer.FULL; Trailer.video = true; Trailer._resize();
          const b = document.querySelector('.intro-trailer'); if (b) b.remove();
          Trailer.t0 = 100000; Trailer.jump = 0; }""")
        pg.wait_for_timeout(300)
        scenes = pg.evaluate("() => Trailer.FULL.map((s) => [s[0], s[2] || ''])")
        final = sum(d for d, _ in scenes[:-1])
        dur = final + FINAL_TAIL
        n = int(round(dur * fps))
        for i in range(n):
            pg.evaluate(f"() => Trailer.frame(100000 + {i / fps * 1000})")
            pg.screenshot(path=str(frames_dir / f"f{i:04d}.jpg"), type="jpeg", quality=92)
        b.close()
    return scenes, dur


def soundtrack(scenes, dur, path):
    mix = np.zeros(int(SR * dur))
    rng = np.random.default_rng(7)

    def env(n, a=0.005, d=None):
        t = np.arange(n) / SR
        e = np.minimum(1, t / a)
        if d:
            e *= np.exp(-t / d)
        return e

    def put(sig, at, vol=1.0):
        i = int(at * SR); j = min(len(mix), i + len(sig))
        if j > i:
            mix[i:j] += sig[:j - i] * vol

    def tone(f0, d, kind="square", f1=None, vol=0.2, dec=None):
        n = int(d * SR); t = np.arange(n) / SR
        f = f0 if f1 is None else f0 + (f1 - f0) * t / d
        ph = 2 * np.pi * np.cumsum(f) / SR
        w = {"sine": np.sin(ph), "square": np.sign(np.sin(ph)), "tri": 2 * np.abs(2 * ((ph / (2 * np.pi)) % 1) - 1) - 1}[kind]
        return w * env(n, 0.004, dec or d / 3) * vol

    def noise(d, vol=0.2, lo=None, hi=None, dec=None):
        n = int(d * SR); w = rng.standard_normal(n)
        if lo or hi:
            sp = np.fft.rfft(w); fr = np.fft.rfftfreq(n, 1 / SR)
            if lo: sp[fr < lo] = 0
            if hi: sp[fr > hi] = 0
            w = np.fft.irfft(sp, n); w /= (np.abs(w).max() + 1e-9)
        return w * env(n, 0.003, dec or d / 3) * vol

    def whoosh(at): put(noise(0.35, 0.35, 300, 4000, 0.09), at); put(tone(120, 0.25, "sine", 50, 0.4, 0.07), at)
    def slam(at): put(noise(0.08, 0.5, 100, 2000, 0.02), at); put(tone(180, 0.22, "sine", 55, 0.6, 0.06), at)
    def thwack(at): put(noise(0.05, 0.4, 800, 6000, 0.012), at); put(tone(260, 0.12, "square", 120, 0.18, 0.03), at)
    def boom(at): put(noise(0.5, 0.6, 40, 900, 0.12), at); put(tone(70, 0.7, "sine", 35, 0.9, 0.18), at)
    def blip(at, f=1200): put(tone(f, 0.03, "square", vol=0.12, dec=0.012), at)
    def tick(at): put(tone(2000, 0.02, "square", vol=0.08, dec=0.008), at)
    def ding(at): put(tone(1568, 0.6, "sine", vol=0.25, dec=0.18), at); put(tone(2093, 0.5, "sine", vol=0.12, dec=0.15), at + 0.08)

    t = 0.0
    final = None
    for i, (d, kind) in enumerate(scenes):
        if i > 0:
            whoosh(t - 0.04)
        if kind == "intro":
            for k in range(16): blip(k / 16 * 0.7 + t + 0.02, 1100 + (k % 3) * 150)
            slam(t + 0.8); thwack(t + 0.82)
        elif kind == "panel":
            put(noise(0.25, 0.2, 200, 3000, 0.08), t + 0.02); slam(t + 0.25); boom(t + 0.7); tick(t + 1.0)
        elif kind.startswith("words"):
            slam(t + 0.02)
            for k in range(int(kind.split(":")[1]) if ":" in kind else 4): thwack(t + 0.35 + k * 0.22)
        elif kind == "plan":
            slam(t + 0.02)
            for k, p in enumerate([0.96, 0.82, 0.74]): put(tone(220, 1.2 * p, "tri", 220 + 660 * p, 0.14, 1.0), t + 0.3 + k * 0.2)
            boom(t + 1.9); ding(t + 1.95)
        elif kind == "final":
            final = t
            boom(t); put(tone(55, 1.2, "sine", 55, 0.5, 0.4), t)
            slam(t + 0.5); tick(t + 1.1)
            for k in range(3): thwack(t + 1.4 + k * 0.18)
            for k in range(6): blip(t + 2.0 + k * 0.12, 600 + k * 120)
            for k, f in enumerate([523, 659, 784, 1047, 784, 1047]): put(tone(f, 0.22, "square", vol=0.12, dec=0.09), t + 2.8 + k * 0.12)
            put(tone(1047, 1.4, "square", vol=0.12, dec=0.5), t + 3.55); put(tone(523, 1.4, "square", vol=0.08, dec=0.5), t + 3.55)
        t += d
    final = final if final is not None else dur
    # Chiptune-Beat 128 BPM bis kurz nach der Titelkarte, dann leicht absenken
    beat = 60 / 128; bass = [110, 110, 165, 110, 131, 131, 196, 147]
    tb, k = 0.0, 0
    while tb < final + 0.5:
        put(tone(bass[k % 8], beat * 0.9, "square", vol=0.07, dec=0.25), tb)
        put(noise(0.08, 0.5, 30, 300, 0.05), tb)
        put(noise(0.03, 0.10, 5000, 12000, 0.012), tb + beat / 2)
        if k % 2 == 1: put(noise(0.12, 0.18, 1200, 5000, 0.04), tb)
        tb += beat; k += 1
    fi = int((final + 0.5) * SR)
    if fi < len(mix):
        mix[fi:] *= np.linspace(1, 0.85, len(mix) - fi)
    mix = np.tanh(mix * 1.4) * 0.9
    with wave.open(str(path), "w") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((mix * 32767).astype("<i2").tobytes())


def main():
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--out", default=str(ROOT / "media" / "trailer.mp4"))
    ap.add_argument("--fps", type=int, default=24)
    a = ap.parse_args()
    if not shutil.which("ffmpeg"):
        sys.exit("ffmpeg fehlt")
    with tempfile.TemporaryDirectory() as tmp:
        tmp = pathlib.Path(tmp)
        scenes, dur = capture(tmp, a.fps)
        soundtrack(scenes, dur, tmp / "audio.wav")
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-framerate", str(a.fps), "-i", str(tmp / "f%04d.jpg"), "-i", str(tmp / "audio.wav"),
                        "-c:v", "libx264", "-preset", "slow", "-crf", "20", "-pix_fmt", "yuv420p", "-movflags", "+faststart",
                        "-c:a", "aac", "-b:a", "144k", "-shortest", a.out], check=True)
    print(json.dumps({"out": a.out, "seconds": round(dur, 2), "scenes": len(scenes)}))


if __name__ == "__main__":
    main()
