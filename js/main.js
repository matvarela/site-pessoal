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

    hidePercent();
    if (logoEl) logoEl.style.opacity = '0';
    gsap.set(preloader, { pointerEvents: 'none' });

    gsap.to(preloader, {
      opacity: 0,
      duration: 0.55,
      ease: 'power2.out',
      onComplete: () => {
        dismissPreloader();
        showIntroPlayer();
      }
    });
  }

  function showIntroPlayer() {
    const container = document.getElementById('introVideoContainer');
    const playerScreen = document.getElementById('introPlayerScreen');
    const videoWrapper = document.getElementById('introVideoWrapper');
    const video = document.getElementById('introVideo');
    const playBtn = document.getElementById('introPlayBtn');
    const skipBtn = document.getElementById('introSkipBtn');
    const videoSkipBtn = document.getElementById('introVideoSkip');

    if (!container || !playerScreen || !video) {
      revealHero(false);
      return;
    }

    // Show container
    container.style.display = 'block';
    if (typeof gsap !== 'undefined') {
      gsap.to(container, { opacity: 1, duration: 0.4, ease: 'power2.out', onComplete: () => {
        playerScreen.classList.add('visible');
      }});
    } else {
      container.style.opacity = '1';
      playerScreen.classList.add('visible');
    }

    function finishIntro() {
      const doReveal = () => {
        gsap.to(container, { opacity: 0, duration: 0.6, ease: 'power2.out', onComplete: () => {
          container.style.display = 'none';
          revealHero(false);
        }});
      };

      // hide video wrapper first if visible
      if (videoWrapper && videoWrapper.classList.contains('visible')) {
        video.pause();
        videoWrapper.classList.remove('visible');
        setTimeout(doReveal, 300);
      } else {
        playerScreen.classList.remove('visible');
        setTimeout(doReveal, 300);
      }
    }

    // Skip button (player screen)
    if (skipBtn) {
      skipBtn.addEventListener('click', finishIntro);
    }

    // Play button
    if (playBtn) {
      playBtn.addEventListener('click', () => {
        // Transition from player screen to video
        playerScreen.classList.remove('visible');
        setTimeout(() => {
          videoWrapper.style.display = 'block';
          requestAnimationFrame(() => {
            videoWrapper.classList.add('visible');
            video.play().catch(() => finishIntro());
          });
        }, 400);
      });
    }

    // Skip during video
    if (videoSkipBtn) {
      videoSkipBtn.addEventListener('click', finishIntro);
    }

    // Video ended
    video.addEventListener('ended', finishIntro);
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
