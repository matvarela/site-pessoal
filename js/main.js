// ============================================================
//  main.js — 4 camadas: Gate → Chaos → Chrome/Spatial → Content
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

let rebuildBusy = false;

// -- Passo 1: Gate → Chaos → Stable --
function initAudioGate() {
  const gate = $("#audioGate");
  AppState.set("GATE");

  const enter = async (withSound) => {
    Sound.setEnabled(withSound);
    const audioHud = $("#hudAudio");
    if (audioHud) audioHud.textContent = withSound ? "ON" : "OFF";

    gate.classList.add("exit");
    Sound.boot();

    await new Promise((r) => setTimeout(r, 450));
    gate.remove();

    // Intro System Failure (3.5–4s) → estabiliza Content Layer
    await Chaos.run({ duration: 3800 });

    document.body.classList.add("interface-ready");
    window.scrollTo({ top: 0, behavior: "auto" });
    initReveal();
  };

  $("#audioOn").addEventListener("click", () => enter(true));
  $("#audioOff").addEventListener("click", () => enter(false));
}

// -- Passo 3: [REBUILD] reengatilha o caos e reseta origem --
function initRebuild() {
  const btn = $("#rebuildBtn");
  btn.addEventListener("click", async () => {
    if (rebuildBusy || AppState.get() === "CHAOS") return;
    rebuildBusy = true;
    btn.disabled = true;

    await Chaos.run({ duration: 3200 });
    window.scrollTo({ top: 0, behavior: "auto" });

    $$(".reveal").forEach((n) => n.classList.remove("visible"));
    initReveal();

    btn.disabled = false;
    rebuildBusy = false;
  });
}

function initCursor() {
  const ring = $("#cursorRing");
  const dot = $("#cursorDot");
  if (!ring || window.matchMedia("(pointer: coarse)").matches) {
    document.body.classList.add("no-cursor");
    return;
  }
  let x = innerWidth / 2, y = innerHeight / 2, tx = x, ty = y;
  const tick = () => {
    x += (tx - x) * 0.2;
    y += (ty - y) * 0.2;
    ring.style.transform = `translate3d(${x}px,${y}px,0)`;
    dot.style.transform = `translate3d(${tx}px,${ty}px,0)`;
    requestAnimationFrame(tick);
  };
  window.addEventListener("pointermove", (e) => {
    tx = e.clientX; ty = e.clientY;
    ring.classList.add("active");
    dot.classList.add("active");
  }, { passive: true });
  document.addEventListener("pointerover", (e) => {
    if (e.target.closest("a, button, .contact-card, .skill-tag, .cert-badge")) ring.classList.add("hover");
  });
  document.addEventListener("pointerout", (e) => {
    if (e.target.closest("a, button, .contact-card, .skill-tag, .cert-badge")) ring.classList.remove("hover");
  });
  requestAnimationFrame(tick);
}

function renderHero() {
  $("#navLogo").textContent = d.shortName || "MV";
  $("#heroSystem").textContent = `[ ${d.systemId} : ${d.version} ]`;
  $("#heroName").textContent = d.name;
  $("#heroHeadline").textContent = d.headline;
  $("#heroTagline").textContent = d.tagline;
  $("#hudLoc").textContent = `LOC=${d.location.toUpperCase()}`;
  $("#hudVersion").textContent = d.version;
  $("#hudStamp").textContent = isoStamp();
  $("#hudPid").textContent = "2207";
  $("#heroActions").innerHTML = `
    <a href="${d.linkedinUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" data-sound="click">LinkedIn</a>
    <a href="#contact" class="btn btn-ghost" data-sound="click">Contato</a>
  `;
}

function renderImpact() {
  $("#impactGrid").innerHTML = d.heroStats.map((s, i) => `
    <article class="impact-item reveal" data-delay="${i * 70}">
      <div class="impact-value">${s.value}</div>
      <div class="impact-label">${s.label}</div>
    </article>
  `).join("");
}

function renderAbout() {
  let text = d.about;
  ["Microsoft Fabric", "220 relatórios", "200%", "DP-700", "PL-300", "Rede D'Or"].forEach((kw) => {
    text = text.replace(new RegExp(kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"), `<strong>${kw}</strong>`);
  });
  $("#aboutText").innerHTML = text;
}

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
        <ul class="timeline-highlights">${exp.highlights.map((h) => `<li>${h}</li>`).join("")}</ul>
      </div>`;
    container.appendChild(item);
  });
}

function renderSkills() {
  const container = $("#skillsGrid");
  d.skills.forEach((cat, idx) => {
    const card = el("div", "skill-category reveal");
    card.dataset.delay = String(idx * 60);
    card.innerHTML = `
      <div class="skill-category-title">${cat.category}</div>
      <div class="skill-tags">${cat.items.map((item) => `<span class="skill-tag">${item}</span>`).join("")}</div>`;
    container.appendChild(card);
  });
}

function renderEducation() {
  d.education.forEach((edu) => {
    const item = el("div", "edu-item");
    item.innerHTML = `
      <div class="edu-degree">${edu.degree}</div>
      ${edu.institution ? `<div class="edu-institution">${edu.institution}</div>` : ""}
      ${edu.year ? `<div class="edu-year">${edu.year}</div>` : ""}`;
    $("#educationList").appendChild(item);
  });
  d.certifications.forEach((cert) => {
    const badge = el("div", "cert-badge");
    badge.innerHTML = `<div class="cert-code">${cert.code}</div><div class="cert-name">${cert.name}</div>`;
    $("#certBadges").appendChild(badge);
  });
}

function renderContact() {
  const contacts = [
    { label: "Email", value: d.email, href: `mailto:${d.email}`, icon: "✉" },
    { label: "Telefone", value: d.phone, href: `tel:${d.phoneRaw}`, icon: "☎" },
    { label: "LinkedIn", value: d.linkedin, href: d.linkedinUrl, icon: "in" },
    { label: "Localização", value: d.location, href: "https://maps.google.com/?q=Rio+de+Janeiro+RJ", icon: "◎" }
  ];
  contacts.forEach((c, idx) => {
    const card = el("a", "contact-card reveal");
    card.href = c.href;
    card.dataset.delay = String(idx * 50);
    card.dataset.sound = "click";
    if (c.href.startsWith("http")) { card.target = "_blank"; card.rel = "noopener noreferrer"; }
    card.setAttribute("aria-label", `${c.label}: ${c.value}`);
    card.innerHTML = `
      <div class="contact-icon">${c.icon}</div>
      <div>
        <div class="contact-label">${c.label}</div>
        <div class="contact-value">${c.value}</div>
      </div>`;
    $("#contactGrid").appendChild(card);
  });
}

function initNavbar() {
  const navbar = $("#navbar");
  const navToggle = $("#navToggle");
  const navLinks = $("#navLinks");
  const links = navLinks.querySelectorAll("a");

  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    navToggle.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
  links.forEach((link) => link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle.classList.remove("open");
  }));
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 24);
  }, { passive: true });

  const sections = $$("section[id]");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        links.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === `#${entry.target.id}`));
      }
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  sections.forEach((s) => observer.observe(s));
}

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
  initRebuild();
  initAudioGate();
  Sound.bindUi();
  Field.start();

  setInterval(() => {
    if (AppState.get() !== "STABLE") return;
    const stamp = $("#hudStamp");
    if (stamp) stamp.textContent = isoStamp();
  }, 1000);
});
