// ============================================================
//  spline-logo.js — 3D Logo via Spline Web Component + GSAP
//  Abordagem: <spline-viewer> web component no container DOM
//  GSAP anima o container (posição, escala) como elemento CSS.
//  Mouse hover aplica rotação 3D leve via CSS transform.
// ============================================================

(function () {
  'use strict';

  var container = document.getElementById('splineContainer');

  if (!container) {
    console.warn('[spline-logo] #splineContainer not found');
    return;
  }

  // --------------------------------------------------------
  // Aguarda o GSAP + ScrollTrigger estarem prontos
  // --------------------------------------------------------
  function onGSAPReady() {
    gsap.registerPlugin(ScrollTrigger);
    initSplineLogo();
  }

  if (window.gsap && window.ScrollTrigger) {
    onGSAPReady();
  } else {
    // Tenta de novo após 200ms (scripts assíncronos ainda carregando)
    setTimeout(function () {
      if (window.gsap && window.ScrollTrigger) {
        onGSAPReady();
      } else {
        console.warn('[spline-logo] GSAP ou ScrollTrigger não encontrados.');
      }
    }, 200);
  }

  function initSplineLogo() {
    // --------------------------------------------------------
    // A. Posição inicial: canto superior direito
    // --------------------------------------------------------
    gsap.set(container, {
      xPercent: 0,
      yPercent: 0,
      x: 'calc(100vw - 380px)',  // Cola no lado direito
      y: '60px',
      scale: 0.65,
      opacity: 1,
      transformOrigin: 'center center',
    });

    // --------------------------------------------------------
    // B. ScrollTrigger Waypoints — start no topo, end na #about
    // --------------------------------------------------------
    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        endTrigger: '#about',
        end: 'bottom center',
        scrub: 1.2,  // 1.2s de suavização, animação ultra-fluida
      }
    });

    // Waypoint 1: move para o centro e aumenta de tamanho
    tl.to(container, {
      x: '50vw',
      y: '40vh',
      xPercent: -50,
      yPercent: -50,
      scale: 1.1,
      ease: 'power2.inOut',
      duration: 1,
    });

    // --------------------------------------------------------
    // C. Mouse movement — rotação 3D leve no container
    // --------------------------------------------------------
    var mouseX = 0;
    var mouseY = 0;
    var currentRotX = 0;
    var currentRotY = 0;
    var raf = null;

    window.addEventListener('mousemove', function (e) {
      // Normaliza de -1 a 1
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    function animateMouse() {
      // Suavização — lerp
      currentRotY += (mouseX * 12 - currentRotY) * 0.06;
      currentRotX += (mouseY * 8 - currentRotX) * 0.06;

      gsap.set(container, {
        rotationY: currentRotY,
        rotationX: currentRotX,
        transformPerspective: 900,
        ease: 'none',
      });

      raf = requestAnimationFrame(animateMouse);
    }

    animateMouse();

    // --------------------------------------------------------
    // D. Forçar refresh do ScrollTrigger após a página carregar
    // --------------------------------------------------------
    window.addEventListener('load', function () {
      ScrollTrigger.refresh();
    });
  }

})();
