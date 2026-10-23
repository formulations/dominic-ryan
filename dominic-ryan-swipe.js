/* =========================================================
   DOMINIC RYAN — MOBILE SWIPE NAVIGATION

   A Personal Message ↔ The Maison ↔ Explore the Collection

   Features:
   - Mobile-only swipe navigation
   - Native View Transitions
   - JavaScript animation fallback
   - Direction-aware animations
   - index3.html testing support
   - Contact modal protection
   - SociableKIT Highlights protection

   Navigation animations are not conditional on
   the device's Reduce Motion preference.
   ========================================================= */

(() => {
  "use strict";

  /* =========================================================
     DEVICE DETECTION
     ========================================================= */

  const MOBILE = "(max-width: 760px)";

  if (!window.matchMedia(MOBILE).matches) {
    return;
  }

  /* =========================================================
     PAGE ORDER
     ========================================================= */

  const pages = [
    "/",
    "/maison/",
    "/formulations/"
  ];

  /* =========================================================
     PATH NORMALIZATION
     ========================================================= */

  function normalize(path) {
    let cleaned = path;

    try {
      cleaned = decodeURIComponent(path);
    } catch (_) {}

    cleaned = cleaned.replace(
      /\/index(?:3)?\.html$/i,
      "/"
    );

    if (!cleaned.startsWith("/")) {
      cleaned = `/${cleaned}`;
    }

    return cleaned.endsWith("/")
      ? cleaned
      : `${cleaned}/`;
  }

  const currentPath = normalize(
    window.location.pathname
  );

  const current = pages.indexOf(currentPath);

  if (current === -1) {
    return;
  }

  /* =========================================================
     BROWSER CAPABILITY
     ========================================================= */

  const nativeTransitions =
    typeof CSS !== "undefined" &&
    CSS.supports(
      "view-transition-name",
      "none"
    ) &&
    "startViewTransition" in document;

  /* =========================================================
     DIRECTION PERSISTENCE
     ========================================================= */

  const DIRECTION_KEY = "drSwipeDirection";
  const FALLBACK_KEY = "drFallbackTransition";

  let incomingDirection = null;
  let fallbackEntry = false;

  try {
    incomingDirection = sessionStorage.getItem(
      DIRECTION_KEY
    );

    fallbackEntry =
      sessionStorage.getItem(FALLBACK_KEY) === "true";

    sessionStorage.removeItem(DIRECTION_KEY);
    sessionStorage.removeItem(FALLBACK_KEY);
  } catch (_) {}

  /* =========================================================
     INCOMING DIRECTION
     ========================================================= */

  if (incomingDirection === "left") {
    document.documentElement.style.setProperty(
      "--dr-swipe-in",
      "22px"
    );
  } else if (incomingDirection === "right") {
    document.documentElement.style.setProperty(
      "--dr-swipe-in",
      "-22px"
    );
  }

  /* =========================================================
     FALLBACK ENTRY ANIMATION
     ========================================================= */

  if (
    fallbackEntry &&
    !nativeTransitions
  ) {
    const startEntry = () => {

      document.documentElement.classList.add(
        "dr-fallback-entering"
      );

      window.setTimeout(() => {
        document.documentElement.classList.remove(
          "dr-fallback-entering"
        );
      }, 300);

    };

    if (document.readyState === "loading") {
      document.addEventListener(
        "DOMContentLoaded",
        startEntry,
        { once: true }
      );
    } else {
      startEntry();
    }
  }

  /* =========================================================
     TOUCH TRACKING
     ========================================================= */

  let startX = 0;
  let startY = 0;

  let tracking = false;
  let navigating = false;

  const MIN_DISTANCE = 85;
  const MAX_VERTICAL_DRIFT = 65;

  /* =========================================================
     EXCLUSIONS
     ========================================================= */

  const EXCLUDED = [
    "input",
    "textarea",
    "select",
    "[contenteditable]",
    "[role='slider']",
    "[data-no-swipe]",
    ".dr-contact-overlay",
    "#dr-contact-overlay",
    "video",

    /* SociableKIT Instagram Highlights */

    ".instagram-highlights",
    ".sk-ww-instagram-story-highlights",
    "[data-embed-id='25723348']",

    /* Expanded story viewer */

    ".sk-story-viewer-layout",
    ".sk-story-frame",
    ".sk-story-stage-row",
    ".sk-story-stage-wrap",
    ".sk-highlight-story-shell",
    ".sk-story-nav-btn"
  ].join(",");

  function isExcluded(target) {
    return (
      target instanceof Element &&
      !!target.closest(EXCLUDED)
    );
  }

  /* =========================================================
     CONTACT MODAL PROTECTION
     ========================================================= */

  function contactIsOpen() {
    const overlay = document.getElementById(
      "dr-contact-overlay"
    );

    if (!overlay) {
      return false;
    }

    const styles = window.getComputedStyle(overlay);

    return (
      styles.display !== "none" &&
      styles.visibility !== "hidden" &&
      styles.pointerEvents !== "none" &&
      styles.opacity !== "0"
    );
  }

  /* =========================================================
     NAVIGATION ENGINE
     ========================================================= */

  function navigate(next, direction) {

    if (navigating) {
      return;
    }

    navigating = true;

    const destination = pages[next];

    const outgoing =
      direction === 1 ? "-22px" : "22px";

    const incoming =
      direction === 1 ? "22px" : "-22px";

    document.documentElement.style.setProperty(
      "--dr-swipe-out",
      outgoing
    );

    document.documentElement.style.setProperty(
      "--dr-swipe-in",
      incoming
    );

    try {
      sessionStorage.setItem(
        DIRECTION_KEY,
        direction === 1 ? "left" : "right"
      );
    } catch (_) {}

    /* =======================================================
       NATIVE VIEW TRANSITIONS
       ======================================================= */

    if (nativeTransitions) {
      window.location.assign(destination);
      return;
    }

    /* =======================================================
       JAVASCRIPT FALLBACK
       ======================================================= */

    try {
      sessionStorage.setItem(
        FALLBACK_KEY,
        "true"
      );
    } catch (_) {}

    document.documentElement.classList.add(
      "dr-fallback-leaving"
    );

    window.setTimeout(() => {
      window.location.assign(destination);
    }, 280);

  }

  /* =========================================================
     TOUCH START
     ========================================================= */

  document.addEventListener(
    "touchstart",
    event => {

      tracking = false;

      if (
        navigating ||
        event.touches.length !== 1 ||
        contactIsOpen()
      ) {
        return;
      }

      if (isExcluded(event.target)) {
        return;
      }

      startX = event.touches[0].clientX;
      startY = event.touches[0].clientY;

      tracking = true;

    },
    { passive: true }
  );

  /* =========================================================
     TOUCH END
     ========================================================= */

  document.addEventListener(
    "touchend",
    event => {

      if (
        !tracking ||
        navigating ||
        contactIsOpen() ||
        !event.changedTouches.length
      ) {
        return;
      }

      tracking = false;

      const deltaX =
        event.changedTouches[0].clientX - startX;

      const deltaY =
        event.changedTouches[0].clientY - startY;

      if (
        Math.abs(deltaX) < MIN_DISTANCE ||
        Math.abs(deltaY) > MAX_VERTICAL_DRIFT ||
        Math.abs(deltaX) < Math.abs(deltaY) * 1.5
      ) {
        return;
      }

      const direction =
        deltaX < 0 ? 1 : -1;

      const next = current + direction;

      if (
        next < 0 ||
        next >= pages.length
      ) {
        return;
      }

      navigate(next, direction);

    },
    { passive: true }
  );

  /* =========================================================
     TOUCH CANCELLATION
     ========================================================= */

  document.addEventListener(
    "touchcancel",
    () => {
      tracking = false;
    },
    { passive: true }
  );

  /* =========================================================
     SAFARI PAGE RESTORATION
     ========================================================= */

  window.addEventListener(
    "pageshow",
    () => {
      navigating = false;
      tracking = false;
    }
  );

})();
