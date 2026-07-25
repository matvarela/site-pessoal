// ============================================================
//  main.js — Renderização + animações (GSAP)
//  Conteúdo vem de data.js
// ============================================================

const d = profileData;
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

function el(tag, className, html) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  if (html !== undefined) e.innerHTML = html;
  return e;
}

function padNum(n) {
  return String(n).padStart(2, '0');
}

/* ---- Conteúdo dinâmico ---- */
function renderMarquee() {
  const track = $('#marqueeTrack');
  const items = [...d.marquee, ...d.marquee];
  track.innerHTML = items.map((t) => `<span class="mq-item">${t}</span>`).join('');
}

function formatStatValue(n) {
  return Math.round(n).toLocaleString('pt-BR');
}

function renderStats() {
  const container = $('#statsGrid');
  if (!container || !d.stats) return;

  d.stats.forEach((stat) => {
    const card = el('article', 'stat-card');
    card.innerHTML = `
      <span class="stat-value" data-target="${stat.value}" data-suffix="${stat.suffix || ''}">0${stat.suffix || ''}</span>
      <span class="stat-label">${stat.label}</span>
    `;
    container.appendChild(card);
  });

  initCountUp();
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function animateCount(el, target, suffix, duration) {
  const start = performance.now();
  function frame(now) {
    const t = Math.min(1, (now - start) / duration);
    const value = target * easeOutCubic(t);
    el.textContent = formatStatValue(value) + suffix;
    if (t < 1) requestAnimationFrame(frame);
    else el.textContent = formatStatValue(target) + suffix;
  }
  requestAnimationFrame(frame);
}

function initCountUp() {
  const values = $$('.stat-value[data-target]');
  if (!values.length) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const run = (el) => {
    if (el.dataset.counted === '1') return;
    el.dataset.counted = '1';
    const target = parseInt(el.dataset.target, 10) || 0;
    const suffix = el.dataset.suffix || '';
    if (reduced) {
      el.textContent = formatStatValue(target) + suffix;
      return;
    }
    animateCount(el, target, suffix, 1400);
  };

  if (!('IntersectionObserver' in window)) {
    values.forEach(run);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        run(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.35, rootMargin: '0px 0px -8% 0px' }
  );

  values.forEach((el) => observer.observe(el));
}

function renderExperience() {
  const container = $('#experienceList');
  $('#expCount').textContent = `${padNum(d.experiences.length)} cargos`;

  d.experiences.forEach((exp, idx) => {
    const article = el('article', 'pcard');
    article.setAttribute('data-index', String(idx));

    const tags = exp.tags.map((t) => `<span class="tag">${t}</span>`).join('');
    const highlights = exp.highlights
      .slice(0, 4)
      .map((h) => `<li>${h}</li>`)
      .join('');
    const metrics = exp.metrics
      .map(
        (m) => `
        <div class="pmetric">
          <span class="pm-val">${m.value}</span>
          <span class="pm-label">${m.label}</span>
        </div>`
      )
      .join('');

    article.innerHTML = `
      <div class="pcard-inner">
        <div class="pcard-info">
          <div class="pcard-top">
            <span class="pnum">${padNum(idx + 1)}</span>
            <div class="tags">${tags}</div>
          </div>
          <div class="pcard-mid">
            <p class="pcompany">${exp.company}</p>
            <h3 class="pname">${exp.role}</h3>
            <p class="pyear">${exp.period}</p>
          </div>
          <ul class="phighlights">${highlights}</ul>
        </div>
        <div class="pcard-vis" aria-hidden="true">
          <div class="pcard-metrics">${metrics}</div>
        </div>
      </div>
    `;
    container.appendChild(article);
  });
}

function renderAbout() {
  const container = $('#aboutText');
  const keywords = [
    'Microsoft Fabric',
    '220 relatórios',
    '200%',
    'DP-700',
    'PL-300',
    "Rede D'Or"
  ];

  d.about.forEach((para) => {
    let text = para;
    keywords.forEach((kw) => {
      text = text.replace(new RegExp(kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), `<strong>${kw}</strong>`);
    });
    const p = el('p', '', text);
    container.appendChild(p);
  });
}

function renderEducation() {
  const container = $('#educationList');
  d.education.forEach((edu) => {
    const li = el('li', 'exp-item');
    li.innerHTML = `
      <div class="ei-l">
        <span class="ei-co">${edu.degree}</span>
        ${edu.institution ? `<span class="ei-role">${edu.institution}</span>` : ''}
      </div>
      ${edu.year ? `<span class="ei-yr">${edu.year}</span>` : ''}
    `;
    container.appendChild(li);
  });
}

function renderCerts() {
  const container = $('#certList');
  d.certifications.forEach((cert) => {
    const li = el('li', 'award-item');
    li.innerHTML = `
      <div class="aw-l">
        <span class="aw-title">${cert.code}</span>
        <span class="aw-issuer">${cert.name}</span>
      </div>
    `;
    container.appendChild(li);
  });
}

function renderSkills() {
  const container = $('#skillsRow');
  d.skills.forEach((skill) => {
    container.appendChild(el('span', 'skill-pill', skill));
  });
}

function renderContact() {
  $('#cfEmail').textContent = d.email;
  $('#cfLocation').textContent = d.location;
  $('#cfPhone').textContent = d.phone;
  $('#contactMailLink').href = `mailto:${d.email}`;
  $('#cfEmailLink').href = `mailto:${d.email}`;
  $('#cfLinkedin').href = d.linkedinUrl;
  $('#cfPhoneLink').href = `tel:${d.phoneRaw}`;
  $('#footerYear').textContent = new Date().getFullYear();
}

/* ---- Tema ---- */
function initTheme() {
  const html = document.documentElement;
  const tBtn = $('#themeBtn');
  const tIcon = $('#tIcon');
  const tLabel = $('#tLabel');
  let dark = (localStorage.getItem('theme') || 'dark') === 'dark';

  function sync() {
    html.setAttribute('data-theme', dark ? 'dark' : 'light');
    tIcon.textContent = dark ? '◐' : '◑';
    tLabel.textContent = dark ? 'Claro' : 'Escuro';
  }
  sync();

  tBtn.addEventListener('click', () => {
    dark = !dark;
    localStorage.setItem('theme', dark ? 'dark' : 'light');
    sync();
  });
}

/* ---- Navbar ---- */
function initNavbar() {
  const navEl = $('#nav');
  const navToggle = $('#navToggle');
  const navLinks = $('#navLinks');
  const mobileNav = $('#mobileNav');
  const mobileClose = $('#mobileNavClose');
  const desktopLinks = navLinks ? navLinks.querySelectorAll('a') : [];
  const mobileLinks = mobileNav ? mobileNav.querySelectorAll('a') : [];
  const allNavLinks = [...desktopLinks, ...mobileLinks];
  let navScrolled = false;
  let menuScrollY = 0;

  function isMenuOpen() {
    return Boolean(mobileNav && mobileNav.classList.contains('open'));
  }

  function lockBodyScroll() {
    menuScrollY = window.scrollY || window.pageYOffset || 0;
    document.documentElement.classList.add('menu-open');
    document.body.classList.add('menu-open');
    document.body.style.top = `-${menuScrollY}px`;
  }

  function unlockBodyScroll() {
    document.documentElement.classList.remove('menu-open');
    document.body.classList.remove('menu-open');
    document.body.style.top = '';
    window.scrollTo(0, menuScrollY);
  }

  function setMenuOpen(open) {
    if (!mobileNav || !navToggle) return;

    mobileNav.classList.toggle('open', open);
    mobileNav.hidden = !open;
    mobileNav.setAttribute('aria-hidden', String(!open));

    navToggle.classList.toggle('open', open);
    navEl.classList.toggle('menu-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');

    if (open) lockBodyScroll();
    else unlockBodyScroll();
  }

  function closeMenu() {
    if (!isMenuOpen()) return;
    setMenuOpen(false);
  }

  navToggle.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuOpen(!isMenuOpen());
  });

  if (mobileClose) {
    mobileClose.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeMenu();
    });
  }

  mobileLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      const target = href ? document.querySelector(href) : null;
      if (!isMenuOpen()) return;

      e.preventDefault();
      e.stopPropagation();

      mobileNav.classList.remove('open');
      mobileNav.hidden = true;
      mobileNav.setAttribute('aria-hidden', 'true');
      navToggle.classList.remove('open');
      navEl.classList.remove('menu-open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Abrir menu');
      document.documentElement.classList.remove('menu-open');
      document.body.classList.remove('menu-open');
      document.body.style.top = '';
      window.scrollTo(0, menuScrollY);

      if (target) {
        requestAnimationFrame(() => {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      }
    });
  });

  /* Fecha ao tocar no fundo do painel */
  if (mobileNav) {
    mobileNav.addEventListener('click', (e) => {
      if (e.target === mobileNav) closeMenu();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  document.addEventListener(
    'touchmove',
    (e) => {
      if (!isMenuOpen()) return;
      if (navToggle.contains(e.target)) return;
      if (mobileClose && mobileClose.contains(e.target)) return;
      if (e.target.closest && e.target.closest('.mobile-nav-links a')) return;
      e.preventDefault();
    },
    { passive: false }
  );

  window.addEventListener(
    'scroll',
    () => {
      if (isMenuOpen()) return;
      const should = window.scrollY > 60;
      if (should === navScrolled) return;
      navScrolled = should;
      navEl.classList.toggle('scrolled', should);
    },
    { passive: true }
  );

  const sections = $$('section[id]');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        allNavLinks.forEach((l) => {
          l.classList.toggle('active', l.getAttribute('href') === `#${id}`);
        });
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );
  sections.forEach((s) => observer.observe(s));

  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* ---- Copiar e-mail ---- */
function initCopyEmail() {
  const copyBtn = $('#copyEmailBtn');
  if (!copyBtn) return;

  const iconCopy =
    '<svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4.5" y="4.5" width="7" height="7" rx="1.2"/><path d="M1.5 8.5V2.5a1 1 0 0 1 1-1h6"/></svg>';
  const iconCheck =
    '<svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 7l3.5 3.5L11 3"/></svg>';

  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(d.email).then(() => {
      copyBtn.classList.add('copied');
      copyBtn.innerHTML = iconCheck;
      copyBtn.setAttribute('aria-label', 'E-mail copiado');
      setTimeout(() => {
        copyBtn.classList.remove('copied');
        copyBtn.innerHTML = iconCopy;
        copyBtn.setAttribute('aria-label', 'Copiar endereço de e-mail');
      }, 2000);
    });
  });
}

/* ---- Animações GSAP ---- */
let heroStarted = false;
let scrollStarted = false;

function heroIn(opts) {
  const options = opts || {};
  if (heroStarted) return;
  heroStarted = true;

  if (typeof gsap === 'undefined') {
    revealFallback();
    return;
  }

  if (options.skipNavLogo) {
    gsap.set('.nav-logo', { opacity: 1 });
    gsap.set('.nav-right', { opacity: 0 });
    gsap.to('.nav-right', { opacity: 1, duration: 0.7, ease: 'power2.out', delay: 0.05 });
  } else {
    gsap.set('.nav-logo', { opacity: 0 });
    gsap.set('.nav-right', { opacity: 0 });
    gsap.to(['.nav-logo', '.nav-right'], {
      opacity: 1,
      duration: 0.7,
      stagger: 0.12,
      ease: 'power2.out'
    });
  }

  gsap.set('.pill', { opacity: 0, x: 32 });

  gsap.to('.hero-title .tl span', {
    y: 0,
    duration: 1.05,
    stagger: 0.1,
    ease: 'power3.out',
    delay: 0.05
  });
  gsap.to('.hero-eyebrow span', {
    y: 0,
    duration: 0.75,
    ease: 'power3.out',
    delay: 0.5
  });
  gsap.set('.hero-desc', { opacity: 0, y: 16 });
  gsap.to('.hero-desc', {
    opacity: 1,
    y: 0,
    duration: 0.75,
    ease: 'power2.out',
    delay: 0.65
  });
  gsap.to('.pill', {
    x: 0,
    opacity: 1,
    duration: 0.55,
    stagger: 0.1,
    ease: 'power2.out',
    delay: 0.75
  });
  gsap.to('.scroll-hint', { opacity: 1, duration: 0.6, delay: 1.2 });

  initScroll();
}

function initScroll() {
  if (scrollStarted) return;
  scrollStarted = true;

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    revealFallback();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealFallback();
    return;
  }

  gsap.set('.pcard', { opacity: 0, y: 40 });
  gsap.set('.stat-card', { opacity: 0, y: 28 });

  gsap.utils.toArray('.s-title').forEach((el) => {
    const spans = el.querySelectorAll('.tl span');
    gsap.to(spans, {
      y: 0,
      duration: 1.05,
      stagger: 0.08,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%' }
    });
  });

  gsap.utils.toArray('.stat-card').forEach((card, i) => {
    gsap.to(card, {
      opacity: 1,
      y: 0,
      duration: 0.65,
      ease: 'power2.out',
      delay: i * 0.06,
      scrollTrigger: { trigger: card, start: 'top 90%' }
    });
  });

  gsap.utils.toArray('.pcard').forEach((card, i) => {
    gsap.to(card, {
      opacity: 1,
      y: 0,
      duration: 0.75,
      ease: 'power2.out',
      delay: i * 0.08,
      scrollTrigger: { trigger: card, start: 'top 88%' }
    });
  });

  gsap.utils.toArray('.about-bio p').forEach((p, i) => {
    gsap.fromTo(
      p,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.65,
        delay: i * 0.08,
        ease: 'power2.out',
        scrollTrigger: { trigger: p, start: 'top 90%' }
      }
    );
  });

  gsap.utils.toArray('.about-side > div').forEach((block, i) => {
    gsap.fromTo(
      block,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.65,
        delay: i * 0.1,
        ease: 'power2.out',
        scrollTrigger: { trigger: block, start: 'top 88%' }
      }
    );
  });

  gsap.utils.toArray('.contact-headline .tl span').forEach((span, i) => {
    gsap.fromTo(
      span,
      { y: '110%' },
      {
        y: '0%',
        duration: 0.9,
        delay: i * 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: span, start: 'top 90%' }
      }
    );
  });

  gsap.fromTo(
    '.contact-footer',
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: { trigger: '.contact-footer', start: 'top 90%' }
    }
  );

  setTimeout(() => ScrollTrigger.refresh(), 400);
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

function revealFallback() {
  document.body.classList.remove('is-loading');
  $$('.nav-logo, .nav-right, .pill, .hero-desc, .scroll-hint, .pcard, .stat-card, .about-bio p, .about-side > div, .contact-footer').forEach(
    (node) => {
      node.style.opacity = '1';
      node.style.transform = 'none';
    }
  );
  $$('.hero-title .tl span, .hero-eyebrow span, .s-title .tl span, .contact-headline .tl span').forEach(
    (node) => {
      node.style.transform = 'none';
    }
  );
}

function finishPreloader(preloader, opts) {
  const options = opts || {};
  document.body.classList.remove('is-loading');
  if (preloader) {
    preloader.style.display = 'none';
    preloader.setAttribute('aria-hidden', 'true');
  }
  heroIn({ skipNavLogo: Boolean(options.skipNavLogo) });
}

function runPreloader() {
  const preloader = $('#preloader');
  const percentEl = $('#plPercent');
  const logoEl = document.querySelector('#preloader .pl-logo');
  const navMark = document.querySelector('.nav-logo-mark');

  const forcePreloader = new URLSearchParams(window.location.search).has('preloader');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const skipAnim =
    (!forcePreloader && sessionStorage.getItem('mv_preloader_v5') === '1') || reduceMotion;

  if (!preloader) {
    document.body.classList.remove('is-loading');
    heroIn();
    return;
  }

  if (skipAnim) {
    finishPreloader(preloader);
    return;
  }

  if (!forcePreloader) {
    sessionStorage.setItem('mv_preloader_v5', '1');
  }

  const duration = 1.8;
  const counter = { value: 0 };

  function hidePercent() {
    if (!percentEl) return;
    percentEl.textContent = '';
    percentEl.classList.add('is-gone');
    percentEl.setAttribute('aria-hidden', 'true');
    gsap.killTweensOf(percentEl);
    gsap.set(percentEl, { opacity: 0, visibility: 'hidden', display: 'none' });
  }

  function revealHero(skipNavLogo) {
    /* Libera a página e dispara a hero no mesmo instante — sem pausa em preto */
    document.body.classList.remove('is-loading');
    if (navMark) {
      navMark.style.opacity = '1';
      navMark.style.visibility = 'visible';
    }
    if (logoEl) logoEl.style.opacity = '0';
    heroIn({ skipNavLogo: Boolean(skipNavLogo) });
  }

  function dismissPreloader() {
    if (!preloader) return;
    preloader.style.display = 'none';
    preloader.setAttribute('aria-hidden', 'true');
  }

  function flyLogoToNav(done) {
    if (!logoEl || !navMark || typeof gsap === 'undefined') {
      done(false);
      return;
    }

    hidePercent();

    const start = logoEl.getBoundingClientRect();
    const end = navMark.getBoundingClientRect();

    logoEl.classList.add('is-flying');
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    gsap.set(logoEl, {
      top: start.top,
      left: start.left,
      width: start.width,
      height: start.height,
      x: 0,
      y: 0,
      position: 'fixed',
      zIndex: 9010,
      opacity: 1,
      filter: isLight ? 'invert(1)' : 'none'
    });

    gsap.set(preloader, { backgroundColor: '#000000' });

    gsap.to(logoEl, {
      top: end.top,
      left: end.left,
      width: end.width,
      height: end.height,
      duration: 1.05,
      ease: 'power3.inOut',
      onComplete: () => done(true)
    });
  }

  function exit() {
    if (typeof gsap === 'undefined') {
      hidePercent();
      finishPreloader(preloader);
      return;
    }

    flyLogoToNav((ok) => {
      /* Ao pousar a logo: hero entra junto com o fade do preto */
      revealHero(ok);

      gsap.set(preloader, { pointerEvents: 'none' });
      gsap.to(preloader, {
        opacity: 0,
        duration: 0.55,
        ease: 'power2.out',
        onComplete: dismissPreloader
      });
    });
  }


  if (typeof gsap === 'undefined') {
    let n = 0;
    const id = setInterval(() => {
      n += 4;
      if (n >= 100) {
        n = 100;
        clearInterval(id);
        if (percentEl) percentEl.textContent = '100%';
        setTimeout(exit, 200);
      }
      if (percentEl) percentEl.textContent = `${n}%`;
      if (logoEl) {
        logoEl.style.opacity = '1';
        logoEl.style.transform = 'none';
      }
      if (percentEl) percentEl.style.opacity = '1';
    }, 40);
    return;
  }

  gsap.to(logoEl, { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' });
  gsap.to(percentEl, { opacity: 1, duration: 0.45, ease: 'power2.out', delay: 0.1 });

  gsap.to(counter, {
    value: 100,
    duration,
    ease: 'power2.inOut',
    onUpdate: () => {
      if (percentEl) percentEl.textContent = `${Math.round(counter.value)}%`;
    },
    onComplete: () => {
      if (percentEl) percentEl.textContent = '100%';
      gsap.delayedCall(0.12, exit);
    }
  });
}

/* ---- ASCII Hands Footer ---- */
function initAsciiHands() {
  const canvas = document.getElementById('asciiHandsCanvas');
  if (!canvas) return;
  const wrapper = canvas.closest('.god-hand-wrapper');
  if (!wrapper) return;

  const ctx = canvas.getContext('2d');

  /* --- Config --- */
  const CELL_W    = 7;
  const CELL_H    = 10;
  const SIDE_RATIO = 0.38;   // each hand occupies 38% of wrapper width
  const THRESHOLD  = 0.06;   // minimum brightness to render a char
  const HOVER_R    = 100;    // mouse influence radius (px)
  const SPRING_K   = 0.08;
  const DAMPING    = 0.82;
  const PUSH_STR   = 12;
  const CHAR_SET   = ['.', ':', ';', '-', '=', '+', 'x', '#', '%', '@', '$'];
  const SCRAMBLE   = ['@','#','%','&','$','8','0','X','Z','?','!','+','*','x','~',';',':','.'];

  /* --- Perlin Noise (simple 2D, no lib) --- */
  const _pArr = new Uint8Array(256);
  for (let i = 0; i < 256; i++) _pArr[i] = i;
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = _pArr[i]; _pArr[i] = _pArr[j]; _pArr[j] = tmp;
  }
  const perm = new Uint8Array(512);
  for (let i = 0; i < 512; i++) perm[i] = _pArr[i & 255];

  function fade(t)        { return t * t * t * (t * (t * 6 - 15) + 10); }
  function lerp(a, b, t)  { return a + t * (b - a); }
  function grad(h, x, y)  {
    h &= 3;
    const u = h < 2 ? x : y;
    const v = h < 2 ? y : x;
    return ((h & 1) ? -u : u) + ((h & 2) ? -v : v);
  }
  function noise(x, y) {
    const X = Math.floor(x) & 255, Y = Math.floor(y) & 255;
    x -= Math.floor(x); y -= Math.floor(y);
    const u = fade(x), v = fade(y);
    const a = perm[X] + Y, b = perm[X + 1] + Y;
    return lerp(
      lerp(grad(perm[a],     x,     y),   grad(perm[b],     x - 1, y),   u),
      lerp(grad(perm[a + 1], x,     y - 1), grad(perm[b + 1], x - 1, y - 1), u),
      v
    );
  }

  /* --- State --- */
  let W = 0, H = 0, sideW = 0;
  let grid = [];
  let mouseX = -9999, mouseY = -9999;
  let t = 0;
  let rafId = null;

  /* --- Image loading --- */
  const imgL = new Image(), imgR = new Image();
  imgL.src = 'assets/god-hand-rodape-left.png';
  imgR.src = 'assets/god-hand-rodape-right.png';
  let okL = false, okR = false;
  imgL.onload = () => { okL = true; if (okR) build(); };
  imgR.onload = () => { okR = true; if (okL) build(); };

  /* Sample an image to an offscreen canvas and return pixel data */
  function sampleImg(img, w, h) {
    const off = document.createElement('canvas');
    off.width = w; off.height = h;
    const oc = off.getContext('2d');
    oc.drawImage(img, 0, 0, w, h);
    return oc.getImageData(0, 0, w, h).data;
  }

  function build() {
    const rect = wrapper.getBoundingClientRect();
    W = rect.width;
    H = rect.height;
    sideW = W * SIDE_RATIO;

    /* Resize canvas respecting DPR */
    const dpr = window.devicePixelRatio || 1;
    canvas.width  = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    /* Compute displayed image sizes: height fills wrapper, width auto */
    const aspL  = imgL.naturalWidth / imgL.naturalHeight;
    const dispLW = Math.round(H * aspL),  dispLH = H;

    const aspR  = imgR.naturalWidth / imgR.naturalHeight;
    const dispRW = Math.round(H * aspR), dispRH = H;

    /* Sample at capped resolution to avoid slow getImageData on huge images */
    const maxPx = 800;
    const scL = Math.min(1, maxPx / dispLW);
    const sLW = Math.round(dispLW * scL), sLH = Math.round(dispLH * scL);
    const dataL = sampleImg(imgL, sLW, sLH);

    const scR = Math.min(1, maxPx / dispRW);
    const sRW = Math.round(dispRW * scR), sRH = Math.round(dispRH * scR);
    const dataR = sampleImg(imgR, sRW, sRH);

    /* Right image left-edge in canvas coords */
    const rImgX0 = W - dispRW;

    grid = [];
    const cols = Math.floor(W / CELL_W);
    const rows = Math.floor(H / CELL_H);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cx = (c + 0.5) * CELL_W;
        const cy = (r + 0.5) * CELL_H;

        let brightness = 0;

        if (cx < sideW) {
          /* Left zone — image anchored at x=0 */
          const ix = Math.round((cx / dispLW) * sLW);
          const iy = Math.round((cy / dispLH) * sLH);
          if (ix >= 0 && ix < sLW && iy >= 0 && iy < sLH) {
            const k = (iy * sLW + ix) * 4;
            brightness = (dataL[k] * 0.299 + dataL[k+1] * 0.587 + dataL[k+2] * 0.114) / 255;
          }
        } else if (cx > W - sideW) {
          /* Right zone — image anchored at right edge */
          const ix = Math.round(((cx - rImgX0) / dispRW) * sRW);
          const iy = Math.round((cy / dispRH) * sRH);
          if (ix >= 0 && ix < sRW && iy >= 0 && iy < sRH) {
            const k = (iy * sRW + ix) * 4;
            brightness = (dataR[k] * 0.299 + dataR[k+1] * 0.587 + dataR[k+2] * 0.114) / 255;
          }
        } else {
          continue; /* center zone: skip — stays black */
        }

        if (brightness > THRESHOLD) {
          const ci = Math.min(CHAR_SET.length - 1, Math.floor(brightness * (CHAR_SET.length - 1)));
          grid.push({
            baseX: cx, baseY: cy,
            x: cx,     y: cy,
            vx: 0,     vy: 0,
            density: brightness,
            baseChar:    CHAR_SET[ci],
            currentChar: CHAR_SET[ci],
            hl: 0
          });
        }
      }
    }
  }

  /* --- Render loop --- */
  function render() {
    rafId = requestAnimationFrame(render);
    ctx.clearRect(0, 0, W, H);

    ctx.font = '8px "JetBrains Mono", monospace';
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    t += 0.002;

    for (let i = 0; i < grid.length; i++) {
      const p = grid[i];

      /* Mouse repulsion (spring physics) */
      const dx = p.x - mouseX, dy = p.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < HOVER_R && dist > 0) {
        const f = 1 - dist / HOVER_R;
        p.vx += (dx / dist) * f * f * PUSH_STR;
        p.vy += (dy / dist) * f * f * PUSH_STR;
        p.hl  = Math.max(p.hl, f);
        /* faster glyph scramble near cursor */
        if (Math.random() < f * 0.4)
          p.currentChar = SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)];
      } else {
        p.hl *= 0.88;
        if (p.hl < 0.02) {
          p.hl = 0;
          /* Perlin-driven slow organic mutation */
          const n = noise(p.baseX * 0.014 + t, p.baseY * 0.014 + t * 0.6);
          if (n > 0.32)
            p.currentChar = SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)];
          else if (Math.random() < 0.025)
            p.currentChar = p.baseChar;
        }
      }

      /* Spring return to base position */
      p.vx = (p.vx + (p.baseX - p.x) * SPRING_K) * DAMPING;
      p.vy = (p.vy + (p.baseY - p.y) * SPRING_K) * DAMPING;
      p.x += p.vx;
      p.y += p.vy;

      /* Subtle organic float via sine */
      const wave = Math.sin(t * 0.9 + p.baseX * 0.011 + p.baseY * 0.009) * 1.3;

      const alpha = p.hl > 0.1
        ? Math.min(1, p.density * 0.75 + p.hl * 0.25)
        : p.density * 0.55;

      ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
      ctx.fillText(p.currentChar, p.x, p.y + wave);
    }
  }

  /* --- Mouse tracking --- */
  wrapper.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    mouseX = e.clientX - r.left;
    mouseY = e.clientY - r.top;
  });
  wrapper.addEventListener('mouseleave', () => { mouseX = -9999; mouseY = -9999; });

  /* --- Resize (debounced) --- */
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (okL && okR) {
        grid = [];
        if (rafId) cancelAnimationFrame(rafId);
        build();
        rafId = requestAnimationFrame(render);
      }
    }, 150);
  });

  /* Start */
  if (okL && okR) build();
  rafId = requestAnimationFrame(render);
}

/* ---- Init ---- */
document.addEventListener('DOMContentLoaded', () => {
  renderMarquee();
  renderStats();
  renderExperience();
  renderAbout();
  renderEducation();
  renderCerts();
  renderSkills();
  renderContact();
  initTheme();
  initNavbar();
  initCopyEmail();
  initAsciiHands();
  runPreloader();
});
