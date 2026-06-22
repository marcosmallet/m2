const SITE_CONFIG = {
  WHATSAPP_NUMBER: "+5521997224987",
  EMAIL: "contato@m2solucoes.online",
  NOME_EMPRESA: "M2 Soluções com IA",
  WHATSAPP_MESSAGE: "Olá! Quero uma solução com IA para meu negócio.",
};

const normalizedWhatsAppNumber = SITE_CONFIG.WHATSAPP_NUMBER.replace(/\D/g, "");
const whatsappUrl = `https://wa.me/${normalizedWhatsAppNumber}?text=${encodeURIComponent(
  SITE_CONFIG.WHATSAPP_MESSAGE,
)}`;

document.querySelectorAll("[data-whatsapp-link]").forEach((link) => {
  link.setAttribute("href", whatsappUrl);
  link.setAttribute("target", "_blank");
  link.setAttribute("rel", "noopener noreferrer");
});

document.querySelectorAll("[data-email-link]").forEach((link) => {
  link.setAttribute("href", `mailto:${SITE_CONFIG.EMAIL}`);
  link.textContent = SITE_CONFIG.EMAIL;
});

const yearElement = document.querySelector("[data-current-year]");
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navPanel = document.querySelector("[data-nav-panel]");
const navLinks = document.querySelectorAll(".nav-list a");

function setNavOpen(isOpen) {
  document.body.classList.toggle("nav-open", isOpen);
  navToggle?.setAttribute("aria-expanded", String(isOpen));
  navToggle?.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
}

navToggle?.addEventListener("click", () => {
  setNavOpen(!document.body.classList.contains("nav-open"));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => setNavOpen(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setNavOpen(false);
  }
});

document.addEventListener("click", (event) => {
  if (!document.body.classList.contains("nav-open")) return;
  if (navPanel?.contains(event.target) || navToggle?.contains(event.target)) return;
  setNavOpen(false);
});

function updateHeaderState() {
  header?.classList.toggle("is-scrolled", window.scrollY > 12);
}

updateHeaderState();
window.addEventListener("scroll", updateHeaderState, { passive: true });

const faqItems = document.querySelectorAll(".faq-item");
faqItems.forEach((item) => {
  const button = item.querySelector("button");
  button?.addEventListener("click", () => {
    const isOpen = item.classList.toggle("is-open");
    button.setAttribute("aria-expanded", String(isOpen));
  });
});

const revealElements = document.querySelectorAll("[data-reveal]");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
  revealElements.forEach((element) => element.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -60px 0px" },
  );

  revealElements.forEach((element) => revealObserver.observe(element));
}

const sections = [...document.querySelectorAll("main section[id]")];
const navBySection = new Map(
  [...navLinks]
    .map((link) => {
      const sectionId = link.getAttribute("href")?.replace("#", "");
      return [sectionId, link];
    })
    .filter(([sectionId]) => sectionId),
);

if ("IntersectionObserver" in window) {
  const activeSectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => link.classList.remove("is-active"));
        navBySection.get(entry.target.id)?.classList.add("is-active");
      });
    },
    { threshold: 0.42 },
  );

  sections.forEach((section) => activeSectionObserver.observe(section));
}
