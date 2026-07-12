// ============================================================
//  main.js — Renderização dinâmica + animações
//  Não é necessário editar este arquivo para atualizar conteúdo.
//  Todo o conteúdo vem de data.js
// ============================================================

const d = profileData;

// -- Helpers --
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

function el(tag, className, html) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  if (html !== undefined) e.innerHTML = html;
  return e;
}

// -- Hero --
function renderHero() {
  $('#heroName').textContent = d.name;
  $('#heroLocation').textContent = d.location;

  const stats = d.heroStats.map(s => `
    <div class="stat">
      <div class="stat-value">${s.value}</div>
      <div class="stat-label">${s.label}</div>
    </div>
  `).join('');
  $('#heroStats').innerHTML = stats;

  const actions = `
    <a href="${d.linkedinUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" aria-label="Ver LinkedIn">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/></svg>
      LinkedIn
    </a>
    <a href="mailto:${d.email}" class="btn btn-ghost" aria-label="Enviar email">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
      Email
    </a>
  `;
  $('#heroActions').innerHTML = actions;

  // Typewriter
  const titleEl = $('#typewriter');
  const text = d.title;
  let i = 0;
  function typeWriter() {
    if (i < text.length) {
      titleEl.textContent += text.charAt(i);
      i++;
      setTimeout(typeWriter, 45);
    }
  }
  setTimeout(typeWriter, 600);
}

// -- About --
function renderAbout() {
  let text = d.about;
  const keywords = ['Microsoft Fabric', '220 relatórios', '200%', 'DP-700', 'PL-300', 'Rede D\'Or'];
  keywords.forEach(kw => {
    text = text.replace(new RegExp(kw, 'g'), `<strong>${kw}</strong>`);
  });
  $('#aboutText').innerHTML = text;
}

// -- Timeline --
function renderTimeline() {
  const container = $('#timeline');
  d.experiences.forEach((exp, idx) => {
    const item = el('div', 'timeline-item reveal');
    item.dataset.delay = idx * 80;

    const dot = el('div', 'timeline-dot');
    item.appendChild(dot);

    const content = el('div', 'glass-card timeline-content');
    content.innerHTML = `
      <div class="timeline-role">${exp.role}</div>
      <div class="timeline-company">${exp.company}</div>
      <div class="timeline-period">${exp.period}</div>
      <ul class="timeline-highlights">
        ${exp.highlights.map(h => `<li>${h}</li>`).join('')}
      </ul>
    `;
    item.appendChild(content);
    container.appendChild(item);
  });
}

// -- Skills --
function renderSkills() {
  const container = $('#skillsGrid');
  d.skills.forEach((cat, idx) => {
    const card = el('div', 'glass-card skill-category reveal');
    card.dataset.delay = idx * 60;
    card.innerHTML = `
      <div class="skill-category-title">${cat.category}</div>
      <div class="skill-tags">
        ${cat.items.map(item => `<span class="skill-tag">${item}</span>`).join('')}
      </div>
    `;
    container.appendChild(card);
  });
}

// -- Education --
function renderEducation() {
  const container = $('#educationList');
  d.education.forEach(edu => {
    const item = el('div', 'edu-item');
    item.innerHTML = `
      <div class="edu-degree">${edu.degree}</div>
      ${edu.institution ? `<div class="edu-institution">${edu.institution}</div>` : ''}
      ${edu.year ? `<div class="edu-year">${edu.year}</div>` : ''}
    `;
    container.appendChild(item);
  });

  const certContainer = $('#certBadges');
  d.certifications.forEach(cert => {
    const badge = el('div', 'cert-badge');
    badge.innerHTML = `
      <div class="cert-code">${cert.code}</div>
      <div class="cert-name">${cert.name}</div>
    `;
    certContainer.appendChild(badge);
  });
}

// -- Contact --
function renderContact() {
  const container = $('#contactGrid');
  const contacts = [
    {
      label: 'Email',
      value: d.email,
      href: `mailto:${d.email}`,
      icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>'
    },
    {
      label: 'Telefone',
      value: d.phone,
      href: `tel:${d.phoneRaw}`,
      icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13 1.05.36 2.06.7 3a2 2 0 0 1-.45 2.11L8.09 10.91a16 16 0 0 0 6 6l2.08-1.27a2 2 0 0 1 2.11-.45c.94.34 1.95.57 3 .7A2 2 0 0 1 22 16.92z"/></svg>'
    },
    {
      label: 'LinkedIn',
      value: d.linkedin,
      href: d.linkedinUrl,
      icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/></svg>'
    },
    {
      label: 'Localização',
      value: d.location,
      href: 'https://maps.google.com/?q=Rio+de+Janeiro+RJ',
      icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>'
    }
  ];

  contacts.forEach(c => {
    const card = el('a', 'glass-card contact-card reveal');
    card.href = c.href;
    if (c.href.startsWith('http')) {
      card.target = '_blank';
      card.rel = 'noopener noreferrer';
    }
    card.setAttribute('aria-label', `${c.label}: ${c.value}`);
    card.innerHTML = `
      <div class="contact-icon">${c.icon}</div>
      <div>
        <div class="contact-label">${c.label}</div>
        <div class="contact-value">${c.value}</div>
      </div>
    `;
    container.appendChild(card);
  });
}

// -- Navbar --
function initNavbar() {
  const navbar = $('#navbar');
  const navToggle = $('#navToggle');
  const navLinks = $('#navLinks');
  const links = navLinks.querySelectorAll('a');

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
    navToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', false);
    });
  });

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // Active link highlighting
  const sections = $$('section[id]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        links.forEach(l => {
          l.classList.toggle('active', l.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => observer.observe(s));
}

// -- Reveal animations --
function initReveal() {
  const reveals = $$('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay || '0', 10);
        setTimeout(() => entry.target.classList.add('visible'), delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  reveals.forEach(r => observer.observe(r));
}

// -- Footer year --
function renderFooter() {
  $('#footerYear').textContent = new Date().getFullYear();
}

// -- Init --
document.addEventListener('DOMContentLoaded', () => {
  renderHero();
  renderAbout();
  renderTimeline();
  renderSkills();
  renderEducation();
  renderContact();
  renderFooter();
  initNavbar();

  // Initialize reveal after dynamic content is injected
  requestAnimationFrame(() => {
    initReveal();
  });
});