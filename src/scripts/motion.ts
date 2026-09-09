/**
 * Motion layer. Everything here is progressive enhancement: with this file
 * blocked, or under prefers-reduced-motion, the site stays fully readable.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

const prefersReduced = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isTouch = () => window.matchMedia("(hover: none)").matches;

let lenis: Lenis | null = null;
let rafId = 0;
const cleanups: Array<() => void> = []

function on<K extends keyof WindowEventMap>(
  target: Window | Document | Element,
  type: K | string,
  handler: EventListenerOrEventListenerObject,
  opts?: AddEventListenerOptions
) {
  target.addEventListener(type, handler, opts);
  cleanups.push(() => target.removeEventListener(type, handler, opts));
}

/* ---------------------------------------------------------------- smooth scroll */
function initLenis() {
  if (prefersReduced() || isTouch()) return;
  lenis = new Lenis({ lerp: 0.08, wheelMultiplier: 0.9 });
  lenis.on("scroll", ScrollTrigger.update);
  const raf = (time: number) => {
    lenis?.raf(time);
    rafId = requestAnimationFrame(raf);
  };
  rafId = requestAnimationFrame(raf);
}

/* ---------------------------------------------------------------- reveals */
function initReveals() {
  const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
  if (!els.length) return;

  if (prefersReduced()) {
    els.forEach((el) => el.classList.add("is-revealed"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-revealed");
        io.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -15% 0px", threshold: 0.15 }
  );

  els.forEach((el) => io.observe(el));
  cleanups.push(() => io.disconnect());

  // Stagger children of any [data-reveal-stagger] parent.
  document.querySelectorAll<HTMLElement>("[data-reveal-stagger]").forEach((parent) => {
    const step = Number(parent.dataset.revealStagger || 80);
    Array.from(parent.children).forEach((child, i) => {
      if (child instanceof HTMLElement && child.hasAttribute("data-reveal")) {
        child.style.setProperty("--reveal-delay", `${i * step}ms`);
      }
    });
  });
}

/* ---------------------------------------------------------------- header */
function initHeader() {
  const header = document.querySelector<HTMLElement>("[data-header]");
  if (!header) return;
  let last = window.scrollY;

  const update = () => {
    const y = window.scrollY;
    if (y > 80) header.setAttribute("data-stuck", "");
    else header.removeAttribute("data-stuck");

    const menuOpen = document.querySelector("[data-mobile-menu]")?.hasAttribute("hidden") === false;
    if (!menuOpen && y > 200 && y > last) header.setAttribute("data-hide-header", "");
    else header.removeAttribute("data-hide-header");

    last = y;
  };

  update();
  on(window, "scroll", update, { passive: true });
}

/* ---------------------------------------------------------------- mobile menu */
function initMobileMenu() {
  const toggle = document.querySelector<HTMLButtonElement>("[data-nav-toggle]");
  const close = document.querySelector<HTMLButtonElement>("[data-nav-close]");
  const menu = document.querySelector<HTMLElement>("[data-mobile-menu]");
  if (!toggle || !menu) return;

  menu.querySelectorAll("li").forEach((li, i) => li.style.setProperty("--n", String(i)));

  const setOpen = (open: boolean) => {
    menu.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
    if (open) {
      requestAnimationFrame(() => menu.classList.add("is-open"));
      menu.querySelector<HTMLAnchorElement>("a")?.focus();
    } else {
      menu.classList.remove("is-open");
    }
  };

  on(toggle, "click", () => setOpen(menu.hidden));
  if (close) on(close, "click", () => setOpen(false));
  on(menu, "click", (e) => {
    if ((e.target as HTMLElement).closest("a")) setOpen(false);
  });
  on(document, "keydown", (e) => {
    if ((e as KeyboardEvent).key === "Escape" && !menu.hidden) {
      setOpen(false);
      toggle.focus();
    }
  });
}

/* ---------------------------------------------------------------- cursor */
function initCursor() {
  const dot = document.querySelector<HTMLElement>("[data-cursor]");
  if (!dot || prefersReduced() || isTouch()) return;

  let x = window.innerWidth / 2;
  let y = window.innerHeight / 2;
  let tx = x;
  let ty = y;

  on(window, "mousemove", (e) => {
    tx = (e as MouseEvent).clientX;
    ty = (e as MouseEvent).clientY;
  }, { passive: true });

  const tick = () => {
    x += (tx - x) * 0.2;
    y += (ty - y) * 0.2;
    dot.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
  };
  gsap.ticker.add(tick);
  cleanups.push(() => gsap.ticker.remove(tick));

  on(document, "mouseover", (e) => {
    const el = (e.target as HTMLElement)?.closest<HTMLElement>("a, button, [data-cursor-label]");
    dot.classList.remove("is-link", "is-label");
    dot.textContent = "";
    if (!el) return;
    const label = el.dataset.cursorLabel;
    if (label) {
      dot.classList.add("is-label");
      dot.textContent = label;
    } else {
      dot.classList.add("is-link");
    }
  });
}

/* ---------------------------------------------------------------- video */
function initVideos() {
  const videos = document.querySelectorAll<HTMLVideoElement>("video[data-autoplay]");
  if (!videos.length) return;

  if (prefersReduced()) {
    videos.forEach((v) => {
      v.pause();
      v.removeAttribute("autoplay");
      v.hidden = true;
    });
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const v = entry.target as HTMLVideoElement;
      if (entry.isIntersecting) void v.play().catch(() => {});
      else v.pause();
    });
  }, { threshold: 0.05 });

  videos.forEach((v) => io.observe(v));
  cleanups.push(() => io.disconnect());
}

/* ---------------------------------------------------------------- accordion */
function initAccordions() {
  document.querySelectorAll<HTMLButtonElement>(".accordion-trigger").forEach((trigger) => {
    const row = trigger.closest<HTMLElement>(".accordion-row");
    if (!row) return;
    on(trigger, "click", () => {
      const open = row.dataset.open === "true";
      row.dataset.open = String(!open);
      trigger.setAttribute("aria-expanded", String(!open));
      ScrollTrigger.refresh();
    });
  });
}

/* ---------------------------------------------------------------- parallax */
function initParallax() {
  if (prefersReduced()) return;
  document.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
    const ratio = Number(el.dataset.parallax || 0.2);
    gsap.to(el, {
      yPercent: ratio * 100,
      ease: "none",
      scrollTrigger: {
        trigger: el.closest("[data-parallax-scope]") || el.parentElement || el,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  });
}

/* ---------------------------------------------------------------- boot */
function boot() {
  initLenis();
  initHeader();
  initMobileMenu();
  initReveals();
  initCursor();
  initVideos();
  initAccordions();
  initParallax();
  ScrollTrigger.refresh();
}

function teardown() {
  cleanups.splice(0).forEach((fn) => fn());
  ScrollTrigger.getAll().forEach((t) => t.kill());
  if (rafId) cancelAnimationFrame(rafId);
  lenis?.destroy();
  lenis = null;
  document.body.style.overflow = "";
}

document.addEventListener("astro:page-load", boot);
document.addEventListener("astro:before-swap", teardown);
