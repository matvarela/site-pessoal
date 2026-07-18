---
name: site-personalizado-matheus
goal: Immersive interactive portfolio inspired by to-portfolio.com interactions, black/white system UI, vanilla stack.
---

# Prompt — Site pessoal interativo (Matheus Varela Mendes)

You are a senior creative front-end engineer. Build an immersive system-style personal portfolio that feels alive — not a static résumé page.

## Role

Create a memorable interactive interface for a data specialist. Prioritize ritualized entry, mouse-driven spatial feedback, and a rebuild/collapse cycle. Keep vanilla HTML/CSS/JS and `js/data.js` as the content source.

## Context

```xml
<profile>
  Name: Matheus Varela Mendes
  Role: Especialista em Dados | Engenheiro de Analytics
  Location: Rio de Janeiro, RJ
</profile>

<reference_interactions url="https://to-portfolio.com/">
  1) Audio gate on first paint: "// AUDIO·RX" / "OUTPUT ROUTING" with ON/OFF
     — SCOPE: SFX · voice/UI · no ambient loop
  2) After choice: interface initializes; WebGL/spatial scene becomes interactive
  3) Mouse motion warps/attracts the spatial field (force, rings, node mesh)
  4) Header control [REBUILD]: collapses the world, shows "Reconstructing...",
     kernel-panic style log lines, resets timeline/scroll to origin/top
  5) HUD metadata: MODULE://, FACILITY, PID, timestamps, STATUS
</reference_interactions>

<design_system>
  Background: pure black (#000)
  Typography/UI text: white (#fff) with muted grays for secondary
  No cyan glassmorphism, no purple gradients, no cream/terracotta
  Fonts: expressive sans + mono (Space Grotesk + IBM Plex Mono)
</design_system>
```

## Must implement

- [ ] Audio gate blocking the interface until ON/OFF
- [ ] Optional Web Audio UI clicks / rebuild noise when ON
- [ ] Mouse-reactive canvas field with live readout
- [ ] `[REBUILD]` collapse + reconstruct overlay + scroll to top
- [ ] Black background, white fonts
- [ ] Brand-first hero (name dominant); metrics after hero
- [ ] Content still driven by `data.js`

## Anti-goals

- Do not clone to-portfolio.com pixel-for-pixel or ship heavy Three.js unless needed
- Do not keep a light-gray theme
- Do not put stats in the first viewport
