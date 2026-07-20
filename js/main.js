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
function heroIn(opts) {
  const options = opts || {};
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

function finishPreloader(preloader, skipNavLogo) {
  document.body.classList.remove('is-loading');
  if (preloader) {
    preloader.style.display = 'none';
    preloader.setAttribute('aria-hidden', 'true');
  }
  heroIn({ skipNavLogo: Boolean(skipNavLogo) });
}

/* ---- Preloader estilo eleven-eleven ---- */
function easeInOutQuart(t) {
  return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
}

function createLiquidWipe(pathEl, opts) {
  const speed = opts.speed || 1100;
  const numInPoints = opts.numInPoints || 4;
  const numOutPoints = opts.numOutPoints || 6;
  const delayPointsMaxIn = opts.delayPointsMaxIn || 250;
  const delayPointsMaxOut = opts.delayPointsMaxOut || 300;
  const delayPerPath = opts.delayPerPath || 100;

  let isCovering = false;
  let delays = [];
  let numPoints = numInPoints;
  let delayMax = delayPointsMaxIn;
  let startTime = 0;
  let halfwayFired = false;
  let ticking = false;

  function buildPath(elapsed, covering) {
    /* covering=true → wipe IN (preenche de cima p/ baixo), como EE o.value=true */
    const points = [];
    for (let i = 0; i < numPoints; i++) {
      points[i] = easeInOutQuart(Math.min(Math.max(elapsed - delays[i], 0) / speed, 1)) * 100;
    }
    let d = covering ? `M 0 0 V ${points[0]} ` : `M 0 ${points[0]} `;
    for (let i = 0; i < numPoints - 1; i++) {
      const x = ((i + 1) / (numPoints - 1)) * 100;
      const cx = x - (1 / (numPoints - 1) * 100) / 2;
      d += `C ${cx} ${points[i]} ${cx} ${points[i + 1]} ${x} ${points[i + 1]} `;
    }
    d += covering ? 'V 0 H 0' : 'V 100 H 0';
    return d;
  }

  function arm(covering) {
    isCovering = covering;
    numPoints = covering ? numInPoints : numOutPoints;
    delayMax = covering ? delayPointsMaxIn : delayPointsMaxOut;
    const phase = Math.random() * Math.PI * 2;
    delays = [];
    for (let i = 0; i < numPoints; i++) {
      const angle = (i / Math.max(numPoints - 1, 1)) * Math.PI * 2;
      delays[i] = ((Math.sin(angle + phase) + 1) / 2) * delayMax;
    }
    startTime = Date.now();
    halfwayFired = false;
  }

  function tick() {
    if (!ticking) return;
    const elapsed = Date.now() - (startTime + delayPerPath);
    pathEl.setAttribute('d', buildPath(Math.max(elapsed, 0), isCovering));

    if (elapsed > speed / 2 && isCovering && !halfwayFired) {
      halfwayFired = true;
      if (opts.onHalfway) opts.onHalfway();
    }

    if (elapsed > speed + delayPerPath + delayMax) {
      ticking = false;
      if (typeof gsap !== 'undefined') gsap.ticker.remove(tick);
      if (isCovering) {
        if (opts.onInComplete) opts.onInComplete();
      } else if (opts.onOutComplete) {
        opts.onOutComplete();
      }
    }
  }

  return {
    coverIn() {
      arm(true);
      ticking = true;
      if (typeof gsap !== 'undefined') gsap.ticker.add(tick);
      else {
        const loop = () => {
          tick();
          if (ticking) requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
      }
    },
    coverOut() {
      arm(false);
      ticking = true;
      if (typeof gsap !== 'undefined') gsap.ticker.add(tick);
      else {
        const loop = () => {
          tick();
          if (ticking) requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
      }
    }
  };
}

function animateGooBlobs() {
  const dots = document.querySelectorAll('.pl-blob-dot');
  if (!dots.length || typeof gsap === 'undefined') return null;

  const tweens = [];
  dots.forEach((dot, i) => {
    const cx = parseFloat(dot.getAttribute('cx'));
    const cy = parseFloat(dot.getAttribute('cy'));
    const r = parseFloat(dot.getAttribute('r'));

    tweens.push(
      gsap.to(dot, {
        attr: {
          cx: cx + gsap.utils.random(-260, 260),
          cy: cy + gsap.utils.random(-200, 200)
        },
        duration: gsap.utils.random(1.8, 3.2),
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: i * 0.05
      })
    );
    tweens.push(
      gsap.to(dot, {
        attr: { r: Math.max(90, r + gsap.utils.random(-55, 70)) },
        duration: gsap.utils.random(1.5, 2.6),
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: i * 0.1
      })
    );
  });
  return () => tweens.forEach((t) => t.kill());
}

function setWipeGradient() {
  const palettes = [
    ['#a855f7', '#22d3ee'],
    ['#f472b6', '#818cf8'],
    ['#22d3ee', '#f472b6'],
    ['#2dd4bf', '#a855f7']
  ];
  const pair = palettes[Math.floor(Math.random() * palettes.length)];
  const s1 = document.getElementById('plWipeStop1');
  const s2 = document.getElementById('plWipeStop2');
  if (s1) s1.setAttribute('stop-color', pair[0]);
  if (s2) s2.setAttribute('stop-color', pair[1]);
}

function runPreloader() {
  const preloader = $('#preloader');
  const stage = $('#plStage');
  const logo = $('#plLogo');
  const wipeSvg = $('#plWipe');
  const wipePath = $('#plWipePath');
  const navMark = document.querySelector('.nav-logo-mark');

  const forcePreloader = new URLSearchParams(window.location.search).has('preloader');
  const skipAnim =
    typeof gsap === 'undefined' ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    (!forcePreloader && sessionStorage.getItem('mv_preloader_v4') === '1');

  if (!preloader) {
    document.body.classList.remove('is-loading');
    heroIn();
    return;
  }

  if (skipAnim) {
    finishPreloader(preloader, false);
    return;
  }

  if (!forcePreloader) {
    sessionStorage.setItem('mv_preloader_v4', '1');
  }

  const stopGoo = animateGooBlobs();
  setWipeGradient();

  const GOO_MS = 2400;

  window.setTimeout(() => {
    /* 1) Logo solidifica em branco e voa para a nav (shared layout) */
    const flyPromise = new Promise((resolve) => {
      if (!logo || !navMark) {
        resolve(false);
        return;
      }

      const start = logo.getBoundingClientRect();
      const end = navMark.getBoundingClientRect();

      logo.classList.add('is-flying');
      gsap.set(logo, {
        top: start.top,
        left: start.left,
        width: start.width,
        height: start.height,
        x: 0,
        y: 0,
        position: 'fixed',
        zIndex: 9010
      });

      const tl = gsap.timeline({
        onComplete: () => resolve(true)
      });

      /* esconde goo, preenche de branco */
      tl.to('.pl-goo', { opacity: 0, duration: 0.35, ease: 'power2.out' }, 0);
      tl.to('.pl-logo-bg', { attr: { fill: '#ffffff' }, duration: 0.45, ease: 'power2.out' }, 0.05);
      tl.to(
        logo,
        {
          top: end.top,
          left: end.left,
          width: end.width,
          height: end.height,
          duration: 1.05,
          ease: 'power4.inOut'
        },
        0.1
      );
    });

    /* 2) Wipe líquido sobe (como LoaderBlob do EE) */
    if (wipeSvg && wipePath) {
      wipeSvg.classList.add('is-active');

      const wipe = createLiquidWipe(wipePath, {
        speed: 1100,
        onHalfway: () => {
          /* revela página sob o wipe */
          if (stage) stage.style.opacity = '0';
          document.body.classList.remove('is-loading');
          if (navMark) {
            navMark.style.opacity = '1';
            navMark.style.visibility = 'visible';
          }
          if (logo) logo.style.opacity = '0';
          heroIn({ skipNavLogo: true });
        },
        onInComplete: () => {
          /* blob cobre tudo → começa a sair */
          wipe.coverOut();
        },
        onOutComplete: () => {
          if (stopGoo) stopGoo();
          flyPromise.then(() => {
            preloader.style.display = 'none';
            preloader.setAttribute('aria-hidden', 'true');
          });
        }
      });

      /* inicia wipe um pouco depois do FLIP começar */
      window.setTimeout(() => wipe.coverIn(), 280);
    } else {
      flyPromise.then(() => finishPreloader(preloader, true));
    }
  }, GOO_MS);
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
  runPreloader();
});
