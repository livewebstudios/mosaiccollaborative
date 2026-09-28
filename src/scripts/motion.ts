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
    // Keep the poster frame on screen. Removing the video would leave a bare panel.
    videos.forEach((v) => {
      v.removeAttribute("autoplay");
      v.pause();
      v.currentTime = 0;
    });
    return;
  }

  const visible = new WeakSet<HTMLVideoElement>();
  const holding = new WeakSet<HTMLVideoElement>();
  const timers: number[] = [];

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const v = entry.target as HTMLVideoElement;
      if (entry.isIntersecting) {
        visible.add(v);
        if (!holding.has(v)) void v.play().catch(() => {});
      } else {
        visible.delete(v);
        v.pause();
      }
    });
  }, { threshold: 0.05 });

  // data-hold="seconds": play once, rest on the final (assembled) frame, fade out, restart.
  // data-rate slows playback so the assembly itself reads calmer. Replaces a hard loop cut.
  videos.forEach((v) => {
    const hold = Number(v.dataset.hold);
    if (!hold) return;
    const rate = Number(v.dataset.rate) || 1;
    v.loop = false;
    const applyRate = () => {
      v.defaultPlaybackRate = rate;
      v.playbackRate = rate;
    };
    applyRate();
    v.addEventListener("loadedmetadata", applyRate);

    const onEnded = () => {
      holding.add(v);
      timers.push(window.setTimeout(() => {
        v.classList.add("is-resetting");
        timers.push(window.setTimeout(() => {
          v.currentTime = 0;
          holding.delete(v);
          if (visible.has(v)) void v.play().catch(() => {});
          v.classList.remove("is-resetting");
        }, 700));
      }, hold * 1000));
    };
    v.addEventListener("ended", onEnded);
    cleanups.push(() => {
      v.removeEventListener("ended", onEnded);
      v.removeEventListener("loadedmetadata", applyRate);
    });
  });

  videos.forEach((v) => io.observe(v));
  cleanups.push(() => {
    io.disconnect();
    timers.forEach((t) => window.clearTimeout(t));
  });
}

/* ---------------------------------------------------------------- accordion */
function initAccordions() {
  document.querySelectorAll<HTMLButtonElement>(".accordion-trigger").forEach((trigger) => {
    const row = trigger.closest<HTMLElement>(".accordion-row");
    const panel = row?.querySelector<HTMLElement>(".accordion-panel");
    if (!row || !panel) return;

    const setOpen = (open: boolean) => {
      row.dataset.open = String(open);
      trigger.setAttribute("aria-expanded", String(open));
      // Keep collapsed links out of the tab order.
      if (open) panel.removeAttribute("inert");
      else panel.setAttribute("inert", "");
    };

    // Rows ship open so the content is readable without JavaScript. Collapse all
    // but the first now that scripting is available.
    if (row.dataset.collapseIndex && row.dataset.collapseIndex !== "0") setOpen(false);

    on(trigger, "click", () => {
      setOpen(row.dataset.open !== "true");
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

/* ---------------------------------------------------------------- journeys rail */
function initJourneyRail() {
  const section = document.querySelector<HTMLElement>("[data-journey-rail]");
  const viewport = section?.querySelector<HTMLElement>("[data-rail-viewport]");
  const track = section?.querySelector<HTMLElement>("[data-rail-track]");
  if (!section || !viewport || !track) return;
  if (prefersReduced() || !window.matchMedia("(min-width: 1024px)").matches) return;

  const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
  if (distance() <= 0) return;

  const tween = gsap.to(track, {
    x: () => -distance(),
    ease: "none",
    scrollTrigger: {
      trigger: viewport,
      start: "center center",
      end: () => `+=${distance()}`,
      pin: section,
      scrub: 0.6,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });
  cleanups.push(() => tween.scrollTrigger?.kill());

  // Numbers drift slower than their panel text.
  section.querySelectorAll<HTMLElement>("[data-rail-number]").forEach((n) => {
    const t = gsap.fromTo(n, { xPercent: 20 }, {
      xPercent: -20,
      ease: "none",
      scrollTrigger: { trigger: viewport, start: "center center", end: () => `+=${distance()}`, scrub: 0.6 },
    });
    cleanups.push(() => t.scrollTrigger?.kill());
  });
}

/* ---------------------------------------------------------------- beliefs */
function initBeliefs() {
  const list = document.querySelector<HTMLElement>("[data-beliefs]");
  if (!list || prefersReduced()) return;

  const cards = Array.from(list.querySelectorAll<HTMLElement>(".belief"));
  if (!cards.length) return;

  cards.forEach((card) => {
    const st = ScrollTrigger.create({
      trigger: card,
      start: "top 65%",
      end: "bottom 35%",
      onToggle: (self) => card.classList.toggle("is-active", self.isActive),
    });
    cleanups.push(() => st.kill());
  });
}

/* ---------------------------------------------------------------- services subnav */
function initSubnav() {
  const nav = document.querySelector<HTMLElement>("[data-subnav]");
  if (!nav) return;
  const families = document.querySelectorAll<HTMLElement>("[data-family]");
  if (!families.length) return;

  const setActive = (slug: string) => {
    nav.querySelectorAll<HTMLAnchorElement>("[data-subnav-link]").forEach((a) => {
      a.classList.toggle("is-active", a.dataset.subnavLink === slug);
    });
  };
  setActive(families[0]!.dataset.family || "");

  families.forEach((family) => {
    const st = ScrollTrigger.create({
      trigger: family,
      start: "top 40%",
      end: "bottom 40%",
      onToggle: (self) => { if (self.isActive) setActive(family.dataset.family || ""); },
    });
    cleanups.push(() => st.kill());
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
  initJourneyRail();
  initBeliefs();
  initSubnav();
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
