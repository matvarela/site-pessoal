// ============================================================
//  spline-logo.js — 3D White Logo via Spline Runtime + GSAP
//  - Canvas nativo (<canvas id="splineCanvas">) sem Shadow DOM.
//  - Fundo 100% transparente (alpha: true).
//  - Material branco brilhante com luzes specular 3D e profundidade.
//  - GSAP ScrollTrigger com giro de 360° no Y + arrasto 360° interativo.
// ============================================================

import { Application } from 'https://unpkg.com/@splinetool/runtime@1.9.82/build/runtime.js';

(function () {
  'use strict';

  const container = document.getElementById('splineContainer');
  const inner = document.getElementById('splineInner') || (container && container.querySelector('.spline-inner'));
  const canvas = document.getElementById('splineCanvas');

  if (!container || !canvas) {
    console.warn('[spline-logo] Container ou canvas não encontrado');
    return;
  }

  // 1. Inicializa o Spline no canvas nativo
  const spline = new Application(canvas);

  spline.load('assets/scene.splinecode').then(() => {
    // A. Força o fundo a ser nulo/transparente no Three.js scene e renderer
    try {
      if (spline._scene) {
        spline._scene.background = null;
      }
      if (spline._renderer) {
        spline._renderer.setClearColor(0x000000, 0);
      }
    } catch (e) {}

    // B. Ajusta iluminação e força cor branca nos materiais 3D (para profundidade e destaque no fundo escuro)
    try {
      if (spline._scene) {
        spline._scene.traverse((child) => {
          if (child.isLight) {
            child.intensity = Math.max(child.intensity || 1, 1.8);
          }
          if (child.isMesh && child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach(m => enhanceMaterial(m));
            } else {
              enhanceMaterial(child.material);
            }
          }
        });
      }
    } catch (e) {
      console.warn('[spline-logo] Ajuste de material:', e);
    }

    // Revela com fade-in suave
    container.classList.add('is-loaded');

    // Inicializa animações GSAP e interatividade
    initGSAPAndInteraction();
  }).catch((err) => {
    console.error('[spline-logo] Erro ao carregar scene.splinecode:', err);
    container.classList.add('is-loaded');
    initGSAPAndInteraction();
  });

  function enhanceMaterial(mat) {
    if (!mat) return;
    if (mat.color) {
      const hsl = {};
      mat.color.getHSL(hsl);
      if (hsl.l < 0.85) {
        mat.color.setHex(0xffffff);
      }
    }
    if ('metalness' in mat) mat.metalness = 0.15;
    if ('roughness' in mat) mat.roughness = 0.3;
    mat.needsUpdate = true;
  }

  function initGSAPAndInteraction() {
    function onGSAPReady() {
      gsap.registerPlugin(ScrollTrigger);
      startGSAPTimeline();
    }

    if (window.gsap && window.ScrollTrigger) {
      onGSAPReady();
    } else {
      setTimeout(function () {
        if (window.gsap && window.ScrollTrigger) {
          onGSAPReady();
        }
      }, 200);
    }
  }

  function startGSAPTimeline() {
    const isMobile = window.innerWidth <= 768;
    const logoWidth = isMobile ? 280 : 420;

    const startX = isMobile
      ? (window.innerWidth - logoWidth) / 2
      : window.innerWidth - logoWidth - 32;

    gsap.set(container, {
      x: startX,
      y: isMobile ? 80 : 60,
      scale: isMobile ? 0.8 : 0.75,
      rotationY: 0,
      transformPerspective: 1000,
      transformOrigin: 'center center',
    });

    // Timeline ScrollTrigger com Giro de 360° em Y
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        endTrigger: '#about',
        end: 'bottom center',
        scrub: 1.2,
      }
    });

    tl.to(container, {
      x: function () {
        const currentW = window.innerWidth <= 768 ? 280 : 420;
        return (window.innerWidth - currentW) / 2;
      },
      y: function () {
        return window.innerHeight * 0.32;
      },
      rotationY: 360,     // Giro 360° completo na rolagem
      rotationX: 12,      // Inclinação 3D para destacar a profundidade
      scale: isMobile ? 1.0 : 1.15,
      ease: 'none',
      duration: 1,
    });

    // Arrasto interativo (360° drag) + Hover Tilt no .spline-inner
    let mouseX = 0;
    let mouseY = 0;
    let dragRotY = 0;
    let isDragging = false;
    let previousMouseX = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;

      if (isDragging) {
        const deltaX = e.clientX - previousMouseX;
        dragRotY += deltaX * 0.8;
        previousMouseX = e.clientX;
      }
    });

    container.addEventListener('mousedown', (e) => {
      isDragging = true;
      previousMouseX = e.clientX;
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    container.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        isDragging = true;
        previousMouseX = e.touches[0].clientX;
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (isDragging && e.touches.length > 0) {
        const deltaX = e.touches[0].clientX - previousMouseX;
        dragRotY += deltaX * 0.8;
        previousMouseX = e.touches[0].clientX;
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });

    let currentRotX = 0;
    let currentRotY = 0;

    function animateMouse() {
      const targetY = (mouseX * 15) + dragRotY;
      const targetX = (mouseY * 12);

      currentRotY += (targetY - currentRotY) * 0.08;
      currentRotX += (targetX - currentRotX) * 0.08;

      if (inner) {
        gsap.set(inner, {
          rotationY: currentRotY,
          rotationX: currentRotX,
          transformPerspective: 1000,
          ease: 'none',
        });
      }

      requestAnimationFrame(animateMouse);
    }

    animateMouse();

    window.addEventListener('resize', () => ScrollTrigger.refresh());
    window.addEventListener('load', () => ScrollTrigger.refresh());
  }

})();
