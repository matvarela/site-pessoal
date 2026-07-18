// ============================================================
//  main.js — Renderização dinâmica + interações system-style
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

function isoStamp() {
  return new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
}

// -- Boot --
function initBoot() {
  const overlay = $("#bootOverlay");
  const meta = $("#bootMeta");
  document.body.classList.add("booting");
  meta.textContent = `MODULE://${d.systemId} · ${isoStamp()}`;

  const finish = () => {
    overlay.classList.add("done");
    document.body.classList.remove("booting");
    setTimeout(() => overlay.remove(), 1000);
  };

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    finish();
    return;
  }
  setTimeout(finish, 1100);
}

// -- Cursor --
function initCursor() {
  const ring = $("#cursorRing");
  if (!ring || window.matchMedia("(pointer: coarse)").matches) return;

  let x = window.innerWidth / 2;
  let y = window.innerHeight / 2;
  let tx = x;
  let ty = y;
  let raf = 0;

  const tick = () => {
    x += (tx - x) * 0.22;
    y += (ty - y) * 0.22;
    ring.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    raf = requestAnimationFrame(tick);
  };

  window.addEventListener("pointermove", (e) => {
    tx = e.clientX;
    ty = e.clientY;
    ring.classList.add("active");
  }, { passive: true });

  document.addEventListener("mouseleave", () => ring.classList.remove("active"));
  document.addEventListener("mouseenter", () => ring.classList.add("active"));

  const hoverables = "a, button, .skill-tag, .cert-badge, .contact-card";
  document.addEventListener("pointerover", (e) => {
    if (e.target.closest(hoverables)) ring.classList.add("hover");
  });
  document.addEventListener("pointerout", (e) => {
    if (e.target.closest(hoverables)) ring.classList.remove("hover");
  });

  raf = requestAnimationFrame(tick);
}

// -- Network canvas --
function initSpaceCanvas() {
  const canvas = $("#spaceCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let nodes = [];
  let w = 0;
  let h = 0;
  let raf = 0;

  function resize() {
    w = canvas.width = window.innerWidth * devicePixelRatio;
    h = canvas.height = window.innerHeight * devicePixelRatio;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    seed();
  }

  function seed() {
    const count = Math.min(48, Math.floor(window.innerWidth / 28));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.6 + 0.6
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.strokeStyle = "rgba(26,26,26,0.10)";
    ctx.fillStyle = "rgba(26,26,26,0.28)";

    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      if (!reduce) {
        a.x += a.vx;
        a.y += a.vy;
        if (a.x < 0 || a.x > window.innerWidth) a.vx *= -1;
        if (a.y < 0 || a.y > window.innerHeight) a.vy *= -1;
      }
      ctx.beginPath();
      ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
      ctx.fill();

      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 140) {
          ctx.globalAlpha = 1 - dist / 140;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    }

    if (!reduce) raf = requestAnimationFrame(draw);
  }

  resize();
  draw();
  window.addEventListener("resize", () => {
    cancelAnimationFrame(raf);
    resize();
    draw();
  }, { passive: true });
}

// -- Hero --
function renderHero() {
  $("#navLogo").textContent = d.shortName || "MV";
  $("#heroSystem").textContent = `[ ${d.systemId} : ${d.version} ]`;
  $("#heroName").textContent = d.name;
  $("#heroHeadline").textContent = d.headline;
  $("#heroTagline").textContent = d.tagline;
  $("#hudLoc").textContent = `LOC=${d.location.toUpperCase()}`;
  $("#hudVersion").textContent = d.version;
  $("#hudStamp").textContent = isoStamp();
  $("#hudFacility").textContent = "FACILITY=ANALYTICS_NODE/FABRIC";

  $("#heroActions").innerHTML = `
    <a href="${d.linkedinUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" aria-label="Ver LinkedIn">
      LinkedIn
    </a>
    <a href="#contact" class="btn btn-ghost" aria-label="Ir para contato">
      Contato
    </a>
  `;
}

// -- Impact --
function renderImpact() {
  const grid = $("#impactGrid");
  grid.innerHTML = d.heroStats.map((s, i) => `
    <article class="impact-item reveal" data-delay="${i * 70}">
      <div class="impact-value">${s.value}</div>
      <div class="impact-label">${s.label}</div>
    </article>
  `).join("");
}

// -- About --
function renderAbout() {
  let text = d.about;
  const keywords = ["Microsoft Fabric", "220 relatórios", "200%", "DP-700", "PL-300", "Rede D'Or"];
  keywords.forEach((kw) => {
    text = text.replace(new RegExp(kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"), `<strong>${kw}</strong>`);
  });
  $("#aboutText").innerHTML = text;
}

// -- Timeline --
function renderTimeline() {
  const container = $("#timeline");
  d.experiences.forEach((exp, idx) => {
    const item = el("article", "timeline-item reveal");
    item.dataset.delay = String(idx * 70);
    item.innerHTML = `
      <div class="timeline-period">${exp.period}</div>
      <div>
        <h3 class="timeline-role">${exp.role}</h3>
        <div class="timeline-company">${exp.company}</div>
        <ul class="timeline-highlights">
          ${exp.highlights.map((h) => `<li>${h}</li>`).join("")}
        </ul>
      </div>
    `;
    container.appendChild(item);
  });
}

// -- Skills --
function renderSkills() {
  const container = $("#skillsGrid");
  d.skills.forEach((cat, idx) => {
    const card = el("div", "skill-category reveal");
    card.dataset.delay = String(idx * 60);
    card.innerHTML = `
      <div class="skill-category-title">${cat.category}</div>
      <div class="skill-tags">
        ${cat.items.map((item) => `<span class="skill-tag">${item}</span>`).join("")}
      </div>
    `;
    container.appendChild(card);
  });
}

// -- Education --
function renderEducation() {
  const container = $("#educationList");
  d.education.forEach((edu) => {
    const item = el("div", "edu-item");
    item.innerHTML = `
      <div class="edu-degree">${edu.degree}</div>
      ${edu.institution ? `<div class="edu-institution">${edu.institution}</div>` : ""}
      ${edu.year ? `<div class="edu-year">${edu.year}</div>` : ""}
    `;
    container.appendChild(item);
  });

  const certContainer = $("#certBadges");
  d.certifications.forEach((cert) => {
    const badge = el("div", "cert-badge");
    badge.innerHTML = `
      <div class="cert-code">${cert.code}</div>
      <div class="cert-name">${cert.name}</div>
    `;
    certContainer.appendChild(badge);
  });
}

// -- Contact --
function renderContact() {
  const container = $("#contactGrid");
  const contacts = [
    {
      label: "Email",
      value: d.email,
      href: `mailto:${d.email}`,
      icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>'
    },
    {
      label: "Telefone",
      value: d.phone,
      href: `tel:${d.phoneRaw}`,
      icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13 1.05.36 2.06.7 3a2 2 0 0 1-.45 2.11L8.09 10.91a16 16 0 0 0 6 6l2.08-1.27a2 2 0 0 1 2.11-.45c.94.34 1.95.57 3 .7A2 2 0 0 1 22 16.92z"/></svg>'
    },
    {
      label: "LinkedIn",
      value: d.linkedin,
      href: d.linkedinUrl,
      icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/></svg>'
    },
    {
      label: "Localização",
      value: d.location,
      href: "https://maps.google.com/?q=Rio+de+Janeiro+RJ",
      icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>'
    }
  ];

  contacts.forEach((c, idx) => {
    const card = el("a", "contact-card reveal");
    card.href = c.href;
    card.dataset.delay = String(idx * 50);
    if (c.href.startsWith("http")) {
      card.target = "_blank";
      card.rel = "noopener noreferrer";
    }
    card.setAttribute("aria-label", `${c.label}: ${c.value}`);
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
  const navbar = $("#navbar");
  const navToggle = $("#navToggle");
  const navLinks = $("#navLinks");
  const links = navLinks.querySelectorAll("a");

  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    navToggle.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
  });

  links.forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      navToggle.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 24);
  }, { passive: true });

  const sections = $$("section[id]");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        links.forEach((l) => {
          l.classList.toggle("active", l.getAttribute("href") === `#${id}`);
        });
      }
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  sections.forEach((s) => observer.observe(s));
}

// -- Reveal --
function initReveal() {
  const reveals = $$(".reveal");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay || "0", 10);
        setTimeout(() => entry.target.classList.add("visible"), delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  reveals.forEach((r) => observer.observe(r));
}

function renderFooter() {
  $("#footerYear").textContent = String(new Date().getFullYear());
  $("#footerSystem").textContent = `[ ${d.systemId} : ${d.version} ] · ${d.location}`;
}

document.addEventListener("DOMContentLoaded", () => {
  initBoot();
  renderHero();
  renderImpact();
  renderAbout();
  renderTimeline();
  renderSkills();
  renderEducation();
  renderContact();
  renderFooter();
  initNavbar();
  initCursor();
  initSpaceCanvas();
  requestAnimationFrame(() => initReveal());
});
