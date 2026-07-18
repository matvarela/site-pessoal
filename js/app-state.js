// ============================================================
//  app-state.js — Ciclo de vida da aplicação
//  GATE → CHAOS → STABLE  (e CHAOS de novo via [REBUILD])
// ============================================================

const AppState = (() => {
  /** @type {'GATE'|'CHAOS'|'STABLE'} */
  let phase = "GATE";
  const listeners = new Set();

  function get() { return phase; }

  function set(next) {
    if (phase === next) return;
    const prev = phase;
    phase = next;
    document.body.dataset.phase = next;
    document.body.classList.toggle("phase-gate", next === "GATE");
    document.body.classList.toggle("phase-chaos", next === "CHAOS");
    document.body.classList.toggle("phase-stable", next === "STABLE");
    document.body.classList.toggle("locked", next !== "STABLE");
    listeners.forEach((fn) => fn(next, prev));
  }

  function onChange(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  }

  return { get, set, onChange };
})();
