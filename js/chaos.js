// ============================================================
//  chaos.js — Intro "SYSTEM FAILURE & GLITCH" (procedural)
//  DOM popups + CSS glitch + Canvas 2D noise — sem vídeo
// ============================================================

const Chaos = (() => {
  const ERRORS = [
    { title: "KERNEL PANIC", body: "VECTOR 0x00A31F // RETRY COUNT EXCEEDED\nSTACK FRAME COLLAPSED AT DATA_OPS" },
    { title: "EXCEPTION FAULT", body: "NULL PTR @ ARCHIVE://NODE_PIVOT\nHANDSHAKE TIMEOUT · 12ms" },
    { title: "SEGMENTATION", body: "READ VIOLATION · ADDR 0x7FFECC\nMODULE:// FABRIC_CORE UNSTABLE" },
    { title: "I/O FAILURE", body: "DISK QUEUE SATURATED\nLAT P99 > THRESHOLD · FLUSH ABORT" },
    { title: "AUTH BROKEN", body: "TOKEN NONE · SESSION —\nKEX SLOT CORRUPTED" },
    { title: "RENDER CRASH", body: "COMPOSITOR LOST CONTEXT\nSWAPCHAIN RESET REQUIRED" },
    { title: "MEMORY DUMP", body: "HEAP 98% · GC STALL\nLEAK DETECTED IN TIMELINE BUFFER" },
    { title: "CHRONO FAULT", body: "CLOCK DRIFT +840ms\nORIGIN GATE UNSTABLE · CAUTION" }
  ];

  let layer = null;
  let canvas = null;
  let raf = 0;
  let running = false;
  let timers = [];

  function clearTimers() {
    timers.forEach((t) => clearTimeout(t));
    timers = [];
  }

  function ensureLayer() {
    layer = document.getElementById("chaosLayer");
    if (!layer) {
      layer = document.createElement("div");
      layer.id = "chaosLayer";
      layer.className = "chaos-layer";
      layer.setAttribute("aria-hidden", "true");
      document.body.appendChild(layer);
    }
    return layer;
  }

  function spawnBanner(root) {
    const banner = document.createElement("div");
    banner.className = "chaos-banner glitch-text";
    banner.dataset.text = "CRITICAL SYSTEM FAILURE";
    banner.textContent = "CRITICAL SYSTEM FAILURE";
    root.appendChild(banner);

    const sub = document.createElement("pre");
    sub.className = "chaos-banner-sub";
    sub.textContent = [
      "!!! KERNEL PANIC — NOT SYNCING",
      "MODULE:// DATA_OPS  PID=2207",
      "ATTEMPTING AUTOMATIC RECOVERY..."
    ].join("\n");
    root.appendChild(sub);
  }

  function spawnWindow(root, err, i) {
    const win = document.createElement("div");
    win.className = "chaos-window";
    const top = 6 + Math.random() * 62;
    const left = 4 + Math.random() * 68;
    const rot = (Math.random() - 0.5) * 14;
    win.style.top = `${top}vh`;
    win.style.left = `${left}vw`;
    win.style.transform = `rotate(${rot}deg)`;
    win.style.zIndex = String(10 + i);
    win.style.animationDelay = `${i * 0.08}s`;

    win.innerHTML = `
      <div class="chaos-window-bar">
        <span class="chaos-window-title">${err.title}</span>
        <span class="chaos-window-controls" aria-hidden="true">[×]</span>
      </div>
      <pre class="chaos-window-body glitch-text" data-text="${err.body.split("\n")[0]}">${err.body}</pre>
      <div class="chaos-window-foot">// ERR_CODE ${(0xA000 + i).toString(16).toUpperCase()}</div>
    `;
    root.appendChild(win);
  }

  function startNoise(root) {
    canvas = document.createElement("canvas");
    canvas.className = "chaos-noise";
    root.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    const resize = () => {
      canvas.width = Math.min(480, window.innerWidth / 3);
      canvas.height = Math.min(270, window.innerHeight / 3);
    };
    resize();
    running = true;
    const draw = () => {
      if (!running) return;
      const { width: w, height: h } = canvas;
      const img = ctx.createImageData(w, h);
      const d = img.data;
      for (let i = 0; i < d.length; i += 4) {
        const v = Math.random() > 0.82 ? 255 : 0;
        d[i] = d[i + 1] = d[i + 2] = v;
        d[i + 3] = v ? 255 : 0;
      }
      ctx.putImageData(img, 0, 0);
      raf = requestAnimationFrame(draw);
    };
    draw();
    window.addEventListener("resize", resize, { once: true });
  }

  function scrambleHud() {
    const stamp = document.getElementById("hudStamp");
    const ver = document.getElementById("heroSystem");
    if (stamp) stamp.textContent = "TIMEBASE CORRUPT";
    if (ver) {
      const glyphs = "!@#$%&*<>?/\\|";
      let i = 0;
      const id = setInterval(() => {
        let s = "[ SYSTEM : ";
        for (let k = 0; k < 8; k++) s += glyphs[(Math.random() * glyphs.length) | 0];
        s += " ]";
        ver.textContent = s;
        if (++i > 24) clearInterval(id);
      }, 60);
      timers.push(id);
    }
  }

  /**
   * Executa a cena de caos e resolve quando estabiliza.
   * @param {{duration?: number}} opts
   * @returns {Promise<void>}
   */
  function run(opts = {}) {
    const duration = opts.duration ?? 3600;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    return new Promise((resolve) => {
      const root = ensureLayer();
      root.innerHTML = "";
      root.classList.add("active");
      root.classList.remove("exit");
      AppState.set("CHAOS");
      document.body.classList.add("chaos-active");

      if (typeof Sound !== "undefined") Sound.rebuild();

      if (reduce) {
        timers.push(setTimeout(() => {
          root.classList.remove("active");
          document.body.classList.remove("chaos-active");
          AppState.set("STABLE");
          resolve();
        }, 200));
        return;
      }

      spawnBanner(root);
      startNoise(root);

      const order = [...ERRORS].sort(() => Math.random() - 0.5);
      order.slice(0, 7).forEach((err, i) => {
        timers.push(setTimeout(() => spawnWindow(root, err, i), 120 + i * 160));
      });

      scrambleHud();

      // scanline flash bursts
      for (let i = 0; i < 5; i++) {
        timers.push(setTimeout(() => {
          root.classList.toggle("flash");
          setTimeout(() => root.classList.remove("flash"), 80);
        }, 400 + i * 500));
      }

      timers.push(setTimeout(() => {
        root.classList.add("exit");
        running = false;
        cancelAnimationFrame(raf);
      }, duration));

      timers.push(setTimeout(() => {
        root.classList.remove("active", "exit", "flash");
        root.innerHTML = "";
        document.body.classList.remove("chaos-active");
        AppState.set("STABLE");
        // restore system labels after scramble
        if (typeof profileData !== "undefined") {
          const ver = document.getElementById("heroSystem");
          if (ver) ver.textContent = `[ ${profileData.systemId} : ${profileData.version} ]`;
        }
        const stamp = document.getElementById("hudStamp");
        if (stamp) stamp.textContent = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
        resolve();
      }, duration + 700));
    });
  }

  function stop() {
    clearTimers();
    running = false;
    cancelAnimationFrame(raf);
    if (layer) {
      layer.classList.remove("active", "exit", "flash");
      layer.innerHTML = "";
    }
    document.body.classList.remove("chaos-active");
  }

  return { run, stop };
})();
