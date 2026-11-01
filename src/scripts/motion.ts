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

  // Index the children of any [data-reveal-stagger] parent. CSS turns --i into the
  // tile-settle delay (--stagger-seat per item, capped at six) and the rotation cap.
  document.querySelectorAll<HTMLElement>("[data-reveal-stagger]").forEach((parent) => {
    Array.from(parent.children).forEach((child, i) => {
      if (child instanceof HTMLElement && child.hasAttribute("data-reveal")) {
        child.style.setProperty("--i", String(i));
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

/* ---------------------------------------------------------------- statement band */
// Home Band 2 ships as a plain navy band. With motion allowed, it blends in from linen
// to navy, and its text from ink to linen, as it scrolls up the screen.
// The band's [data-assemble] cluster rides the same ScrollTrigger (round 3).
function initStatement() {
  const band = document.querySelector<HTMLElement>("[data-statement]");
  if (!band || prefersReduced()) return;
  const root = getComputedStyle(document.documentElement);
  const token = (name: string) => root.getPropertyValue(name).trim();

  const tl = gsap.timeline({
    scrollTrigger: { trigger: band, start: "top 85%", end: "top 35%", scrub: true },
  });
  tl.fromTo(
    band,
    { backgroundColor: token("--color-linen"), color: token("--color-ink") },
    { backgroundColor: token("--color-navy"), color: token("--color-linen"), ease: "none" },
    0
  );
  const field = band.querySelector<HTMLElement>("[data-assemble]");
  if (field) tl.add(assembleFrom(field), 0);
  cleanups.push(() => { tl.scrollTrigger?.kill(); tl.kill(); });
}

/* ---------------------------------------------------------------- assembling clusters */
// "The pieces aligning": tiles start scattered at 60% opacity and settle into the block.
// The markup is the assembled block, so JS off and reduced motion show it finished.
// Offsets come from the tile index, so the scatter is the same on every visit.
function assembleFrom(field: HTMLElement) {
  const tiles = Array.from(field.querySelectorAll<SVGPolygonElement>("polygon"));
  const jitter = (i: number, salt: number) => {
    const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
    return (x - Math.floor(x)) * 2 - 1;
  };
  return gsap.from(tiles, {
    x: (i) => jitter(i, 1) * 90,
    y: (i) => jitter(i, 2) * 70,
    rotation: (i) => jitter(i, 3) * 40,
    opacity: 0.6,
    transformOrigin: "50% 50%",
    ease: "none",
  });
}

function initAssemble() {
  if (prefersReduced()) return;
  document.querySelectorAll<HTMLElement>("[data-assemble]").forEach((field) => {
    if (field.closest("[data-statement]")) return;
    const tween = assembleFrom(field);
    const st = ScrollTrigger.create({
      trigger: field,
      start: "top 92%",
      end: "center 55%",
      scrub: true,
      animation: tween,
    });
    cleanups.push(() => { st.kill(); tween.kill(); });
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

/* ---------------------------------------------------------------- drift */
// [data-drift="seconds"] with optional data-drift-travel="percent": a very slow yoyo
// drift for background layers (MosaicGlow, hero gradients, band tiles). Felt, not seen.
// Reduced motion leaves every layer where it is.
function initDrift() {
  if (prefersReduced()) return;
  document.querySelectorAll<HTMLElement>("[data-drift]").forEach((el, i) => {
    const duration = Number(el.dataset.drift) || 50;
    const travel = Number(el.dataset.driftTravel) || 2;
    const dir = i % 2 === 0 ? 1 : -1;
    const tween = gsap.to(el, {
      xPercent: travel * dir,
      yPercent: travel * 0.6 * -dir,
      duration: duration / 2,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });
    cleanups.push(() => tween.kill());
  });
}

/* ---------------------------------------------------------------- count-up */
// <span data-countup="75">75</span>: counts from 0 once, when it scrolls into view.
// The markup already holds the final number, so JS off and reduced motion show 75.
function initCountUp() {
  if (prefersReduced()) return;
  document.querySelectorAll<HTMLElement>("[data-countup]").forEach((el) => {
    const target = Number(el.dataset.countup) || 0;
    const counter = { n: 0 };
    el.textContent = "0";
    const tween = gsap.to(counter, {
      n: target,
      duration: 1.4,
      ease: "power2.out",
      paused: true,
      onUpdate: () => { el.textContent = String(Math.round(counter.n)); },
    });
    // The underline under the whole line ([data-draw] host) lays itself as the count starts.
    const host = el.closest<HTMLElement>("[data-draw]");
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: () => { tween.play(); host?.classList.add("is-drawn"); },
    });
    cleanups.push(() => { st.kill(); tween.kill(); el.textContent = String(target); });
  });
}

/* ---------------------------------------------------------------- thank-you */
// When the thank-you field reveals, its pieces seat once, then initDrift carries on.
function initThankYou() {
  const field = document.querySelector<HTMLElement>("[data-thanks-field]");
  if (!field || prefersReduced()) return;
  // The CSS drift animates transform too, so it holds off while the pieces seat.
  field.classList.add("is-seating");
  const tween = assembleFrom(field).pause(0);
  const seat = gsap.to(tween, {
    progress: 1, duration: 1.2, ease: "expo.out", paused: true,
    onComplete: () => field.classList.remove("is-seating"),
  });
  const io = new IntersectionObserver(([entry]) => {
    if (!entry?.isIntersecting) return;
    seat.play();
    io.disconnect();
  });
  io.observe(field);
  cleanups.push(() => { io.disconnect(); seat.kill(); tween.kill(); });
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
  initStatement();
  initBeliefs();
  initSubnav();
  initAssemble();
  initDrift();
  initCountUp();
  initThankYou();
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
