// ============================================================
//  audio.js — Web Audio SFX (sem arquivos externos)
//  Gate ON/OFF no boot, cliques e tom de rebuild
// ============================================================

const Sound = (() => {
  let ctx = null;
  let enabled = false;

  function ensure() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    return ctx;
  }

  function tone({ freq = 440, dur = 0.08, type = "square", gain = 0.04, slide = 0 } = {}) {
    if (!enabled) return;
    const ac = ensure();
    if (!ac) return;
    const t0 = ac.currentTime;
    const osc = ac.createOscillator();
    const g = ac.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), t0 + dur);
    g.gain.setValueAtTime(gain, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g);
    g.connect(ac.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }

  function click() {
    tone({ freq: 880, dur: 0.045, type: "square", gain: 0.035, slide: -420 });
  }

  function hover() {
    tone({ freq: 620, dur: 0.03, type: "triangle", gain: 0.018 });
  }

  function boot() {
    if (!enabled) return;
    tone({ freq: 180, dur: 0.12, type: "sawtooth", gain: 0.03, slide: 220 });
    setTimeout(() => tone({ freq: 360, dur: 0.1, type: "square", gain: 0.025, slide: 180 }), 90);
  }

  function rebuild() {
    if (!enabled) return;
    const ac = ensure();
    if (!ac) return;
    // noise burst + falling tone
    const t0 = ac.currentTime;
    const bufferSize = ac.sampleRate * 0.35;
    const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    const noise = ac.createBufferSource();
    noise.buffer = buffer;
    const ng = ac.createGain();
    ng.gain.setValueAtTime(0.05, t0);
    ng.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.35);
    noise.connect(ng);
    ng.connect(ac.destination);
    noise.start(t0);
    tone({ freq: 240, dur: 0.45, type: "sawtooth", gain: 0.04, slide: -200 });
  }

  function setEnabled(v) {
    enabled = !!v;
    if (enabled) ensure();
    try {
      localStorage.setItem("mv-sound-enabled", enabled ? "1" : "0");
      localStorage.setItem("mv-audio-gate-complete", "1");
    } catch (_) {}
  }

  function isEnabled() { return enabled; }

  function bindUi() {
    document.addEventListener("click", (e) => {
      const t = e.target.closest("[data-sound], .gate-btn, .rebuild-btn, .btn, .contact-card, .nav-links a");
      if (t) click();
    });
  }

  return { setEnabled, isEnabled, click, hover, boot, rebuild, bindUi, ensure };
})();
