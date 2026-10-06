/* ============ Klang (WebAudio, alles synthetisch) ============ */
const Snd = {
  ctx: null, master: null, musicGain: null, on: true, musicOn: true,
  init() {
    this.unlock();
    if (this.ctx) { if (this.ctx.state !== 'running') this.ctx.resume().catch(() => {}); return; }
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.master = this.ctx.createGain(); this.master.gain.value = 0.45; this.master.connect(this.ctx.destination);
      this.musicGain = this.ctx.createGain(); this.musicGain.gain.value = 0.3; this.musicGain.connect(this.master);
    } catch (e) { this.ctx = null; }
  },
  _unlocked: false,
  unlock() {
    if (this._unlocked) return;
    this._unlocked = true;
    try { const a = new Audio('data:audio/wav;base64,UklGRnQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YVAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=='); a.volume = 0.01; const pr = a.play(); if (pr && pr.catch) pr.catch(() => { this._unlocked = false; }); } catch (e) { this._unlocked = false; }
  },
  state() { if (!this.ctx) return 'noch nicht gestartet'; return this.ctx.state === 'running' ? 'bereit' : 'angehalten (' + this.ctx.state + ')'; },
  tone(freq, dur, type = 'square', vol = 0.12, when = 0, slide = 0, dest) {
    if (!this.ctx || !this.on) return;
    const t = this.ctx.currentTime + when;
    const o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, freq + slide), t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(dest || this.master);
    o.start(t); o.stop(t + dur + 0.02);
  },
  noise(dur, vol = 0.1, freq = 1200, when = 0, type = 'lowpass', dest) {
    if (!this.ctx || !this.on) return;
    const t = this.ctx.currentTime + when;
    const len = Math.max(1, Math.floor(this.ctx.sampleRate * dur));
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const s = this.ctx.createBufferSource(); s.buffer = buf;
    const f = this.ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq;
    const g = this.ctx.createGain(); g.gain.value = vol;
    s.connect(f); f.connect(g); g.connect(dest || this.master);
    s.start(t);
  },
  sfx(n) {
    if (!this.ctx || !this.on) return;
    switch (n) {
      case 'blip': this.tone(880, 0.05, 'square', 0.05); break;
      case 'talk': this.tone(rnd(300, 420), 0.03, 'square', 0.025); break;
      case 'ok': this.tone(660, 0.07, 'square', 0.06); this.tone(990, 0.1, 'square', 0.06, 0.07); break;
      case 'error': this.tone(200, 0.15, 'sawtooth', 0.06); break;
      case 'coin': this.tone(988, 0.06, 'square', 0.06); this.tone(1319, 0.18, 'square', 0.06, 0.06); break;
      case 'door': this.noise(0.18, 0.12, 500); this.tone(140, 0.12, 'triangle', 0.08, 0.05); break;
      case 'step': this.noise(0.03, 0.03, 900); break;
      case 'clink': this.tone(2100, 0.25, 'sine', 0.08); this.tone(2650, 0.3, 'sine', 0.06, 0.04); break;
      case 'gulp': this.tone(180, 0.08, 'sine', 0.12, 0, 120); this.tone(160, 0.08, 'sine', 0.1, 0.14, 120); break;
      case 'eat': for (let i = 0; i < 3; i++) this.noise(0.05, 0.08, 1800, i * 0.12, 'bandpass'); break;
      case 'win': [523, 659, 784, 1047].forEach((f, i) => this.tone(f, 0.16, 'square', 0.06, i * 0.1)); break;
      case 'lose': [392, 330, 262].forEach((f, i) => this.tone(f, 0.2, 'square', 0.05, i * 0.14)); break;
      case 'shutter': this.noise(0.04, 0.14, 4000, 0, 'highpass'); this.noise(0.05, 0.1, 3000, 0.08, 'highpass'); break;
      case 'whoosh': this.noise(0.4, 0.08, 700, 0, 'bandpass'); break;
      case 'gull': this.tone(1400, 0.18, 'sawtooth', 0.04, 0, -500); this.tone(1200, 0.14, 'sawtooth', 0.03, 0.2, -300); break;
      case 'hicks': this.tone(520, 0.06, 'square', 0.05, 0, 260); break;
      case 'yawn': this.tone(330, 0.6, 'sine', 0.05, 0, -140); break;
      case 'vomit': this.noise(0.7, 0.12, 400); this.tone(160, 0.6, 'sawtooth', 0.04, 0, -90); break;
      case 'cheer': for (let i = 0; i < 10; i++) this.noise(0.25, 0.04, rnd(900, 2400), i * 0.04, 'bandpass'); break;
      case 'ding': this.tone(1568, 0.5, 'sine', 0.1); this.tone(1568, 0.5, 'sine', 0.1, 0.25); break;
      case 'lift': this.tone(1047, 0.3, 'sine', 0.08); this.tone(1319, 0.5, 'sine', 0.08, 0.3); break;
      case 'bell': this.tone(1200, 0.4, 'square', 0.05); this.tone(1200, 0.4, 'square', 0.05, 0.5); break;
      case 'buzz': this.tone(120, 0.5, 'sawtooth', 0.08); break;
      case 'engine': this.tone(90, 0.3, 'sawtooth', 0.08, 0, 160); this.noise(0.3, 0.05, 600); break;
      case 'horn': this.tone(440, 0.25, 'square', 0.08); this.tone(554, 0.25, 'square', 0.08, 0.02); break;
      case 'boom': this.noise(0.5, 0.35, 180); this.tone(60, 0.5, 'sine', 0.3, 0, -30); break;
      case 'crack': this.noise(0.06, 0.25, 3500, 0, 'highpass'); break;
      case 'splash': this.noise(0.6, 0.16, 1400); this.noise(0.4, 0.08, 600, 0.15); break;
      case 'rain': this.noise(1.2, 0.08, 2500, 0, 'highpass'); break;
      case 'whirr': this.tone(600, 0.2, 'sine', 0.04, 0, 300); break;
      case 'key': this.noise(0.03, 0.06, 2500, 0, 'highpass'); break;
      case 'bounce': this.tone(300, 0.08, 'square', 0.06, 0, 200); break;
      case 'kick': this.noise(0.08, 0.15, 900); this.tone(200, 0.1, 'triangle', 0.1, 0, -100); break;
      case 'whistle': this.tone(2200, 0.3, 'sine', 0.06); this.tone(2600, 0.3, 'sine', 0.06, 0.3); break;
      case 'sizzle': this.noise(0.8, 0.06, 4000, 0, 'highpass'); break;
      case 'pour': this.noise(0.5, 0.08, 1000, 0, 'bandpass'); break;
      case 'plane': this.noise(1.5, 0.12, 400); this.tone(80, 1.5, 'sawtooth', 0.04, 0, 60); break;
      case 'applause': for (let i = 0; i < 18; i++) this.noise(0.08, 0.05, rnd(1200, 3000), i * 0.07, 'bandpass'); break;
      case 'brass': [392, 494, 587, 784].forEach((f, i) => this.tone(f, 0.25, 'sawtooth', 0.05, i * 0.18)); break;
    }
  },
  _mus: null,
  music(kind) {
    if (this._mus && this._mus.kind === kind) return;
    this.stopMusic();
    if (!this.ctx || !kind) return;
    const self = this;
    const st = { kind, step: 0, next: this.ctx.currentTime + 0.05, timer: null };
    const songs = {
      /* Rumba valenciana: Gitarre und Palmas */
      city: { bpm: 112, steps: 16, play(i, t) {
        const g = self.musicGain, bar = Math.floor(st.step / 16) % 4, dt = t - self.ctx.currentTime;
        const root = [220, 174.6, 196, 164.8][bar];
        if (i % 4 === 0 || i === 6 || i === 10) self.tone(root / 2, 0.22, 'triangle', 0.16, dt, 0, g);
        if ([2, 6, 10, 14].includes(i)) self.noise(0.04, 0.09, 2200, dt, 'bandpass', g);
        if (i % 2 === 0) { self.tone(root, 0.1, 'sawtooth', 0.03, dt, 0, g); self.tone(root * 1.25, 0.1, 'sawtooth', 0.025, dt, 0, g); self.tone(root * 1.5, 0.1, 'sawtooth', 0.025, dt, 0, g); }
        const mel = [[440, 0, 494, 0, 523, 0, 494, 440, 0, 392, 0, 440, 0, 0, 0, 0], [349, 0, 392, 0, 440, 0, 392, 349, 0, 330, 0, 349, 0, 0, 0, 0], [392, 0, 440, 0, 494, 0, 523, 494, 0, 440, 0, 392, 0, 0, 0, 0], [330, 0, 349, 0, 392, 0, 349, 330, 0, 294, 0, 330, 0, 0, 0, 0]][bar];
        if (mel[i]) self.tone(mel[i], 0.14, 'triangle', 0.06, dt, 0, g);
      } },
      /* Büro: Lo-Fi */
      office: { bpm: 84, steps: 16, play(i, t) {
        const g = self.musicGain, bar = Math.floor(st.step / 16) % 4, dt = t - self.ctx.currentTime;
        if (i % 8 === 0) self.tone(65, 0.25, 'sine', 0.35, dt, -20, g);
        if (i % 8 === 4) self.noise(0.1, 0.08, 1500, dt, 'bandpass', g);
        if (i % 2 === 1) self.noise(0.03, 0.03, 7000, dt, 'highpass', g);
        const chord = [[262, 330, 392], [247, 294, 370], [220, 262, 330], [233, 294, 349]][bar];
        if (i === 0 || i === 6) chord.forEach((f) => self.tone(f, 0.5, 'sine', 0.035, dt, 0, g));
        const mel = [[0, 0, 523, 0, 0, 494, 0, 0, 440, 0, 0, 0, 392, 0, 0, 0], [0, 0, 0, 0, 440, 0, 0, 0, 0, 494, 0, 0, 0, 0, 0, 0], [0, 0, 523, 0, 0, 587, 0, 0, 523, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 440, 0, 392, 0, 0, 349, 0, 0, 0, 0, 0]][bar];
        if (mel[i]) self.tone(mel[i], 0.3, 'sine', 0.045, dt, 0, g);
      } },
      bar: { bpm: 100, steps: 8, play(i, t) {
        const g = self.musicGain, ph = Math.floor(st.step / 8) % 4, dt = t - self.ctx.currentTime;
        const root = [131, 175, 147, 196][ph];
        if (i % 4 === 0) self.tone(root / 2, 0.3, 'triangle', 0.18, dt, 0, g);
        if (i % 4 === 2) self.tone(root * 0.75, 0.3, 'triangle', 0.12, dt, 0, g);
        if (i % 2 === 1) self.noise(0.03, 0.05, 6000, dt, 'highpass', g);
        if (i === 0 || i === 3 || i === 6) self.tone(root * 2, 0.25, 'sine', 0.04, dt, 0, g);
      } },
      disco: { bpm: 126, steps: 16, play(i, t) {
        const g = self.musicGain, bar = Math.floor(st.step / 16) % 4, dt = t - self.ctx.currentTime;
        if (i % 4 === 0) self.tone(110, 0.18, 'sine', 0.5, dt, -70, g);
        if (i % 4 === 2) self.noise(0.04, 0.12, 7000, dt, 'highpass', g);
        if (i % 8 === 4) self.noise(0.12, 0.16, 1800, dt, 'bandpass', g);
        const bass = [55, 55, 65.4, 49][bar];
        if (i % 2 === 1) self.tone(bass * 2, 0.11, 'sawtooth', 0.09, dt, 0, g);
        const mel = [[440, 0, 523, 0, 587, 0, 523, 440], [392, 0, 440, 0, 523, 0, 440, 392], [349, 0, 440, 0, 523, 587, 523, 440], [330, 0, 392, 0, 494, 0, 392, 330]][bar];
        if (i % 2 === 0 && mel[i / 2]) self.tone(mel[i / 2], 0.1, 'square', 0.035, dt, 0, g);
      } },
      beach: { bpm: 76, steps: 16, play(i, t) {
        const g = self.musicGain, bar = Math.floor(st.step / 16) % 2, dt = t - self.ctx.currentTime;
        if (i === 0) self.noise(1.4, 0.07, 500, dt, 'lowpass', g);
        if (i === 8) self.noise(0.8, 0.04, 800, dt, 'lowpass', g);
        const chord = [[262, 330, 392, 494], [294, 349, 440, 523]][bar];
        if (i % 4 === 0) self.tone(chord[(i / 4) % 4], 0.5, 'sine', 0.05, dt, 0, g);
        if (i === 2 || i === 10) self.tone(chord[0] / 2, 0.6, 'triangle', 0.08, dt, 0, g);
      } },
      lobby: { bpm: 92, steps: 16, play(i, t) {
        const g = self.musicGain, bar = Math.floor(st.step / 16) % 4, dt = t - self.ctx.currentTime;
        if (i % 8 === 0) self.tone(55, 0.3, 'sine', 0.4, dt, -40, g);
        if (i % 2 === 0) self.noise(0.03, 0.04, 8000, dt, 'highpass', g);
        const mel = [[0, 0, 0, 0, 330, 0, 392, 0, 0, 0, 440, 0, 0, 392, 0, 0], [0, 0, 0, 0, 294, 0, 330, 0, 0, 0, 392, 0, 0, 0, 0, 0], [0, 0, 0, 0, 262, 0, 330, 0, 0, 0, 392, 0, 440, 0, 0, 0], [0, 0, 0, 0, 247, 0, 294, 0, 0, 0, 330, 0, 0, 0, 0, 0]][bar];
        if (mel[i]) self.tone(mel[i], 0.3, 'sine', 0.05, dt, 0, g);
      } },
      market: { bpm: 120, steps: 8, play(i, t) {
        const g = self.musicGain, ph = Math.floor(st.step / 8) % 4, dt = t - self.ctx.currentTime;
        if (i % 2 === 0) self.tone([196, 220, 175, 165][ph], 0.12, 'triangle', 0.12, dt, 0, g);
        if (i === 1 || i === 5) self.noise(0.04, 0.07, 2500, dt, 'bandpass', g);
        const mel = [[392, 440, 494, 0, 440, 392, 0, 0], [440, 494, 523, 0, 494, 440, 0, 0], [349, 392, 440, 0, 392, 349, 0, 0], [330, 392, 440, 0, 494, 440, 392, 0]][ph];
        if (mel[i]) self.tone(mel[i], 0.12, 'sawtooth', 0.035, dt, 0, g);
      } },
      museum: { bpm: 60, steps: 8, play(i, t) {
        const g = self.musicGain, ph = Math.floor(st.step / 8) % 4, dt = t - self.ctx.currentTime;
        const mel = [[523, 0, 659, 0, 784, 0, 659, 0], [494, 0, 587, 0, 740, 0, 587, 0], [440, 0, 523, 0, 659, 0, 523, 0], [494, 0, 587, 0, 659, 0, 740, 0]][ph];
        if (mel[i]) self.tone(mel[i], 0.8, 'sine', 0.04, dt, 0, g);
        if (i === 0) self.tone([131, 123, 110, 123][ph], 1.6, 'triangle', 0.08, dt, 0, g);
      } },
    };
    const song = songs[kind];
    if (!song) return;
    st.timer = setInterval(() => {
      if (!self.ctx) return;
      const spb = 60 / song.bpm / (song.steps === 16 ? 4 : song.steps === 12 ? 3 : 2);
      while (st.next < self.ctx.currentTime + 0.15) {
        if (self.musicOn && self.on) song.play(st.step % song.steps, st.next);
        st.next += spb; st.step++;
      }
    }, 40);
    this._mus = st;
  },
  stopMusic() { if (this._mus) { clearInterval(this._mus.timer); this._mus = null; } },
};
