// ============================================================
//  field.js — Campo espacial B&W (mouse-driven), pós-estabilização
// ============================================================

const Field = (() => {
  let canvas, ctx, nodes = [], raf = 0;
  let mx = 0.5, my = 0.5, force = 0;
  let w = 0, h = 0;
  let running = false;
  const reduce = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function seed() {
    const count = Math.min(80, Math.floor((window.innerWidth * window.innerHeight) / 20000));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      ox: 0,
      oy: 0,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.6 + 0.6
    }));
    nodes.forEach((n) => { n.ox = n.x; n.oy = n.y; });
  }

  function resize() {
    if (!canvas) return;
    w = window.innerWidth;
    h = window.innerHeight;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seed();
  }

  function draw() {
    if (!ctx) return;
    ctx.clearRect(0, 0, w, h);
    const cx = mx * w;
    const cy = my * h;
    const radius = 180 + force * 220;

    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1;

    for (const n of nodes) {
      if (!reduce()) {
        const dx = n.x - cx;
        const dy = n.y - cy;
        const dist = Math.hypot(dx, dy) || 1;
        if (dist < radius) {
          const push = (1 - dist / radius) * (1.8 + force * 4.5);
          n.vx += (dx / dist) * push * 0.08;
          n.vy += (dy / dist) * push * 0.08;
        }
        n.vx += (n.ox - n.x) * 0.002;
        n.vy += (n.oy - n.y) * 0.002;
        n.vx *= 0.92;
        n.vy *= 0.92;
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      }
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    }

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        // sparse links only — avoid "gray" denseness
        if (dist < 100 && ((i + j) % 3 === 0)) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    if (!reduce()) {
      ctx.beginPath();
      ctx.arc(cx, cy, 28 + force * 40, 0, Math.PI * 2);
      ctx.stroke();
    }

    if (running) raf = requestAnimationFrame(draw);
  }

  function onPointer(e) {
    const x = e.clientX / w;
    const y = e.clientY / h;
    force = Math.min(1.4, Math.hypot(x - mx, y - my) * 18);
    mx = x; my = y;
    const readout = document.getElementById("signalLine");
    if (readout) {
      readout.textContent =
        `MOUSE:// X=${mx.toFixed(3)} Y=${my.toFixed(3)} · FORCE=${force.toFixed(2)} · NODES ${nodes.length}`;
    }
  }

  function start() {
    canvas = document.getElementById("fieldCanvas");
    if (!canvas) return;
    ctx = canvas.getContext("2d");
    resize();
    running = true;
    window.addEventListener("resize", () => {
      cancelAnimationFrame(raf);
      resize();
      if (running) draw();
    }, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });
    draw();
  }

  function collapseBurst() {
    for (const n of nodes) {
      n.vx += (Math.random() - 0.5) * 28;
      n.vy += (Math.random() - 0.5) * 28;
    }
    force = 1.4;
  }

  return { start, collapseBurst };
})();
