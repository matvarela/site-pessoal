# Implementação — SYSTEM FAILURE & GLITCH

Portfólio Matheus Varela Mendes, herdando o contrato de interação de `to-portfolio.com` e trocando a estética espacial por **Kernel Panic procedural** em preto/branco estrito.

## Passo 1 — Lógica do Gate e arquitetura de estado

Arquivo: `js/app-state.js`

Estados globais:

| Fase | `data-phase` | Scroll | O que está ativo |
|---|---|---|---|
| `GATE` | GATE | bloqueado | Overlay `// AUDIO·RX` |
| `CHAOS` | CHAOS | bloqueado | Popups de erro + glitch + noise canvas |
| `STABLE` | STABLE | liberado | Chrome + Spatial + Content |

Ciclo de vida:

```text
GATE  --(ON|OFF)-->  CHAOS (~3.5–4s)  -->  STABLE
                         ^                    |
                         +---- [REBUILD] -----+
```

Transições em `js/main.js`:

1. Clique ON/OFF no gate → `Sound.setEnabled` → remove gate  
2. `Chaos.run({ duration: 3800 })` → `AppState.set('CHAOS')`  
3. Ao terminar → `AppState.set('STABLE')` → revela content layer e libera scroll  

CSS usa `body.phase-*` para esconder content/nav até `STABLE`.

## Passo 2 — Intro System Failure (snippet conceitual)

Arquivo: `js/chaos.js` + estilos em `css/style.css`

Procedural (sem vídeo):

- Banner `CRITICAL SYSTEM FAILURE` com classe `.glitch-text`
- 7 janelas `.chaos-window` spawnadas em posições/rotações aleatórias
- Canvas 2D de ruído binário (pixels `#000` / `#FFF`)
- Flashes invertendo fundo preto↔branco
- Scramble do label `[ SYSTEM : … ]` no hero

Após `duration` ms: classe `.exit` dissolve a layer e a Content Layer aparece limpa.

## Passo 3 — Mecanismo `[REBUILD]`

Arquivo: `js/main.js` → `initRebuild()`

```text
click [REBUILD]
  → se não estiver em CHAOS
  → Chaos.run({ duration: 3200 })
  → scrollTo(top)
  → re-dispara reveals
```

Isso reutiliza a mesma intro de colapso (não um overlay separado), alinhado ao ritual narrativo do referência: destruir o mundo e voltar à origem.

## Paleta

- Fundo: `#000000`
- Texto / linhas / bordas: `#FFFFFF`
- Inversão pontual: botões hover e barras de janela de erro (`#FFF` bg / `#000` texto)
- Sem cinzas (`#666`, `rgba` cinza, etc.)

## Arquivos-chave

| Arquivo | Papel |
|---|---|
| `js/app-state.js` | Máquina de estados |
| `js/chaos.js` | Intro / rebuild failure |
| `js/audio.js` | Web Audio diegético |
| `js/field.js` | Spatial layer pós-estável |
| `js/main.js` | Orquestração + content |
| `css/style.css` | Tokens B&W + chaos UI |
