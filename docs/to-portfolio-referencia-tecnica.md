# Referência técnica — to-portfolio.com

Documento de engenharia reversa comportamental do site de referência  
**URL:** https://to-portfolio.com/  
**Autor do site:** Tomotsugu Oyamada (Tokyo) · Web Developer  
**Captura:** Cloud Agent · 2026-07-18  

## Artefatos desta análise

| Artefato | Caminho |
|---|---|
| Tour gravado (MP4) | `/opt/cursor/artifacts/videos/to-portfolio-reference-tour.mp4` |
| Tour gravado (WebM) | `/opt/cursor/artifacts/videos/to-portfolio-reference-tour.webm` |
| Sessão rebuild (WebM) | `/opt/cursor/artifacts/videos/to-portfolio-rebuild-tour.webm` |
| Screenshots da sessão | `docs/assets/to-portfolio-ref/` e `/opt/cursor/artifacts/screenshots/ref-deep/` |
| Dumps JSON/texto | `/tmp/to-port-record/` (sessão efêmera da VM) |

> O vídeo principal cobre: gate de áudio → cena WebGL → movimento de mouse → cliques em ORIGIN/LOG/ABOUT/WORK/END → scroll profundo. O segundo vídeo captura o chrome de header com `[REBUILD]` visível e navegação.

---

## 1. Visão geral do produto

`to-portfolio.com` não é um currículo estático. É uma **simulação de interface de sistema** (“Neural Node Interface”) com:

1. ritual de boot (áudio),
2. cena espacial 3D (WebGL / Three.js),
3. HUD vivo (PID, timestamp, LOOP),
4. navegação por rotas + âncoras de scroll,
5. ciclo de colapso/reconstrução (`[REBUILD]`).

Metadados públicos do site:

- Title: `[PORTFOLIO]`
- Description: *“A system-style web developer portfolio — interactive UI, shaders, and spatial experiments.”*
- Stack aparente: **Next.js (App Router / Turbopack)** + **React** + **Three.js/WebGL** + **GSAP-like overlays** + **Web Audio**

---

## 2. Arquitetura de experiência (fluxo)

```text
[Landing]
   │
   ▼
┌──────────────────────────────┐
│  AUDIO GATE  // AUDIO·RX     │
│  OUTPUT ROUTING              │
│  ON  |  OFF                  │
└──────────────┬───────────────┘
               │ escolha do usuário
               ▼
┌──────────────────────────────┐
│  BOOT / LOAD                 │
│  VERIFY·FIELD / HANDSHAKE    │
│  LOADING · WEBGL · 3D SCENE  │
│  overlay "Reconstructing..." │
└──────────────┬───────────────┘
               │ canvas ready
               ▼
┌──────────────────────────────┐
│  HOME SPATIAL SCENE          │
│  Three.js + HUD + scroll     │
│  header: OFF [REBUILD]       │
│          [HOME][ABOUT][LOGS] │
└───────┬───────────┬──────────┘
        │           │
        │ scroll    │ rotas
        ▼           ▼
  seções home     /about  /work
  (history,       PROFILE  EXPT.LOGS
   circuit SVG,   stack    cases 01-05
   reconstruct
   gateway)
        │
        ▼
┌──────────────────────────────┐
│  [REBUILD] / RECONSTRUCT     │
│  collapse overlay + SFX/TTS  │
│  reset scroll → origin/top   │
└──────────────────────────────┘
```

---

## 3. Gate de áudio (primeira interação obrigatória)

### UI observada

```
// AUDIO·RX
OUTPUT ROUTING
SELECT CHANNEL STATE TO INITIALIZE INTERFACE
SCOPE: SFX · VOICE SYNTH · NO AMBIENT LOOP
[ ON ]   [ OFF ]
```

### Comportamento

| Ação | Efeito |
|---|---|
| **ON** | Habilita SFX + TTS (não há loop ambiental). Inicializa `AudioContext`. Persiste preferência. |
| **OFF** | Segue sem áudio. Ainda assim inicializa a interface. |
| Após escolha | Overlay de boot / handshake / loading WebGL |

### Persistência (localStorage)

Chaves encontradas no bundle:

- `portfolio2026-sound-enabled`
- `portfolio2026-audio-gate-complete`
- `portfolio2026-intro-seen`

### Assets de áudio mapeados

**SFX**

- `/sound/se/click-button.mp3`

**TTS / voice synth**

- `/sound/tts/welcome_user.mp3`
- `/sound/tts/nice_to_meet_you.mp3`
- `/sound/tts/user_authentication.mp3`
- `/sound/tts/inbound_signal_detected.mp3`
- `/sound/tts/permit.mp3`
- `/sound/tts/complete.mp3`
- `/sound/tts/capacity98percent.mp3`
- `/sound/tts/reconstructing.mp3`
- `/sound/tts/reconstruncting-noise1.mp3`
- `/sound/tts/reconstruncting-noise2.mp3`
- `/sound/tts/bye.mp3`

**Implicação de design:** o áudio é diegético (faz parte da ficção do “sistema”), não trilha de fundo.

---

## 4. HUD / chrome persistente

Sempre presente após o boot:

| Elemento | Função |
|---|---|
| `NEURAL NODE INTERFACE` + `LINK STABLE` | Status de “link” (online) |
| `[ LOOP 00 ]` | Contador de loop / fase da experiência |
| `OFF` / toggle som | Reabilita SFX depois do gate |
| `[REBUILD]` | Colapsa e reconstrói a timeline (home) |
| `[HOME]` `/` | Rota home |
| `[ABOUT]` `/about` | Perfil |
| `[EXPT. LOGS]` `/work` | Portfólio de experimentos |
| `[MENU]` | Drawer de navegação (mobile/alternativo) |
| Bloco `MODULE:// CHRONOD` | Telemetria fictícia (PID, timestamp ISO, user) |
| `SCROLL` cue | Convite a entrar na timeline scrollável |
| `LOOP:` grande | Marcador visual de fase |

Texto de sistema típico:

```
[USER]: 0X71-LINUX
# MODULE:// CHRONOD
FACILITY=NEURAL_NODE/CHRONO_DAEMON · PID=4182
<epoch>
<ISO timestamp>
[ PORTFOLIO : VER_x.x.x ]
```

---

## 5. Cena espacial (mouse / WebGL)

### Observado

- 1–2 `<canvas>` ativos na home.
- Geometria central: esfera + tetraedros + anéis de cubos (data-stream).
- Rede de nós/linhas no fundo.
- Movimento do mouse altera orientação/parabilidade da cena e “força” visual.
- Título glitch: `[ PORTFOLIO : VER_... ]` com caracteres instáveis.

### IDs de DOM relevantes (home)

- `home-parallax-root`
- `home-history-area`
- `home-history-backdrop-root` / `home-history-backdrop-plate`
- `home-history-circuit-layer` / `home-history-circuit-svg`
- `home-circuit-line-1..n` (+ path start/end)
- `home-history-content-gate`
- `home-work-queue`
- `home-about`
- `home-reconstruct-gateway`

### Interpretação técnica

A home é um **scroll-theater**:

1. viewport 100dvh com WebGL dominante,
2. ao scrollar, camadas SVG/circuit + conteúdo de arquivo (`ARCHIVE://`) entram em parallax,
3. o mouse continua influenciando a cena 3D mesmo durante o scroll.

---

## 6. Navegação e rotas

### Rotas reais

| Rota | Título observado | Conteúdo |
|---|---|---|
| `/` | `[PORTFOLIO]` | Cena espacial + timeline/arquivo + gateway de rebuild |
| `/about` | `ABOUT \| [PORTFOLIO]` | PROFILE / EXPERIENCE / STACK |
| `/work` | `EXPT. LOGS \| [PORTFOLIO]` | Cases indexados 01–05 |

### Menu / labels de sistema

No fluxo espacial/home aparecem âncoras conceituais:

`ORIGIN · LOG · ABOUT · WORK · END`

No chrome de páginas:

`[HOME] · [ABOUT] · [EXPT. LOGS]`

### Work cases detectados (aria-labels)

1. Smoke Diffusion  
2. Voronoi Field  
3. Stable Flame  
4. Metaball  
5. Magnetic Tape  

Cada case abre detalhe com navegação `‹ ›`, índice `01 / 05`, e copy técnica (shaders / procedural).

### About (estrutura)

Âncoras:

- `about-profile-anchor`
- `about-experience-anchor`
- `about-stack-anchor`

Conteúdo em blocos `PROFILE://`, `EXPERIENCE://`, `STACK://`.

---

## 7. Scroll: o que muda

Ao descer na home (observado no vídeo + dumps):

1. A cena 3D permanece como plano espacial.
2. Entram blocos `ARCHIVE://` (nós narrativos):
   - `NODE: PIVOT` — carreira (educação → sales → web)
   - `NODE: VOW` — craft/intent
3. Circuitos SVG (`home-history-circuit-*`) desenham conexões.
4. Cue `SCROLL` e `LOOP` acompanham a progressão.
5. No fim existe `home-reconstruct-gateway` (“ORIGIN GATE” / `RECONSTRUCT WORLD//`).

**Padrão de UX:** scroll = avanço de “fita temporal” do sistema, não páginas convencionais empilhadas.

---

## 8. `[REBUILD]` — colapso e reconstrução

### Controles

- Botão header: `[REBUILD]`
- `aria-label`: **“Reconstruct world and return to top”**
- Tooltip: *“Reconstruct the timeline at origin. Returns to top.”*
- Aviso: *“LOOP 03–04 use intensified glitch effects — proceed with caution.”*
- Gateway final: `RECONSTRUCT WORLD//` / `Close this timeline and reconstruct the world at origin coordinates.`

### Sequência comportamental (código + UI)

1. Clique em rebuild.
2. Overlay fullscreen sobe (`translateY`) com fundo claro `#e6e6e6` no tema original.
3. Label: `Reconstructing...`
4. SFX/TTS: `reconstructing.mp3` / `reconstruncting-noise*.mp3`
5. Mensagens estilo panic (bundle):
   - `KERNEL PANIC AT VECTOR 0x00A31F // RETRY COUNT EXCEEDED`
   - `RECONSTRUCT TIMELINE ... ORIGIN GATE UNSTABLE ... CAUTION`
   - `CHRONO_DAEMON STACK TRACE ...`
6. Timeline/scroll volta à origem (topo).
7. Overlay sai; cena “renasce”.

### Significado de produto

Rebuild não é refresh de página: é um **gesto narrativo + reset de estado espacial**, reforçando a metáfora de sistema.

---

## 9. Sistema visual (referência)

| Token | Observado no original |
|---|---|
| Fundo | Cinza claro / concreto `#E6E6E6` |
| Texto | `#141414` / `#333` |
| Tipografia | Geist + Geist Mono (+ Noto Sans JP) |
| Moldura | Corner marks (L shapes) no gate |
| Linguagem UI | Uppercase mono, `//` kickers, `[BRACKETS]` |
| 3D | Branco translúcido, low-poly, anéis de cubos |
| Transições | Overlay “Reconstructing...”, glitch de versão, route remap copy |

> Para o site do Matheus, a decisão de produto já adotada é **inverter o tema**: fundo preto + tipografia branca, preservando a gramática system-style.

---

## 10. Modelo mental (como “funciona”)

Pense em 4 camadas empilhadas:

1. **Gate layer** — bloqueia até decidir áudio.  
2. **System chrome** — HUD sempre-on (status, loop, nav, rebuild).  
3. **Spatial layer** — WebGL + SVG circuits reativos a pointer/scroll.  
4. **Content layer** — arquivos (`ARCHIVE`, profile, work cases) que aparecem conforme a timeline avança.

Eventos-chave:

| Evento | Dispara |
|---|---|
| `audio gate complete` | Boot + load WebGL |
| `pointermove` | Deformação/órbita da cena |
| `scroll` | Avanço de nós da timeline + parallax |
| `route change` | Remap de viewport (`ROUTE:// ... REQUESTED`) |
| `rebuild click` | Collapse overlay + reset origin |

---

## 11. Checklist para reimplementação (site Matheus)

Prioridade alta (paridade de sensação):

- [x] Gate `// AUDIO·RX` com ON/OFF  
- [x] Tema preto / branco  
- [x] HUD system + `[REBUILD]` com colapso  
- [x] Campo reativo ao mouse + readout  
- [ ] Cena 3D mais rica (Three.js opcional) ou canvas 2.5D mais próximo do anel de cubos  
- [ ] Timeline scrollável tipo `ARCHIVE://` (nós de carreira)  
- [ ] Rotas/seções com “ROUTE:// handshake” copy  
- [ ] SFX/TTS diegéticos (mesmo que sintéticos)  
- [ ] Drawer `[MENU]` com labels `ORIGIN/LOG/ABOUT/WORK/END`  

Prioridade média:

- [ ] Glitch no version string do hero  
- [ ] Loop counter que muda com scroll  
- [ ] Gateway final `RECONSTRUCT WORLD//`  
- [ ] Cases/projetos no estilo EXPT. LOGS  

---

## 12. Mapa de telas capturadas

| Frame | Arquivo | O que mostra |
|---|---|---|
| Gate | `docs/assets/to-portfolio-ref/01-audio-gate.png` | OUTPUT ROUTING ON/OFF |
| Home viva | `docs/assets/to-portfolio-ref/04-after-mouse.png` | WebGL + HUD + `[REBUILD]` |
| Work | `docs/assets/to-portfolio-ref/05-click-log.png` | EXPT. LOGS / cases |
| About | `docs/assets/to-portfolio-ref/05-click-about.png` | PROFILE/STACK |
| Scroll | `docs/assets/to-portfolio-ref/07-scrolled-mid.png` | Progressão da timeline |

---

## 13. Conclusão

O diferencial de `to-portfolio.com` não é só o visual monocromático: é o **contrato de interação**.

1. Você *autoriza* o sistema (áudio).  
2. O sistema *materializa* um mundo (WebGL).  
3. Você *navega no tempo* (scroll + rotas).  
4. Você pode *destruir e reconstruir* o mundo (`[REBUILD]`).

Qualquer portfólio inspirado nele precisa preservar esse ciclo — não apenas copiar tipografia mono e grid.
