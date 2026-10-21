
/* =========================================================
   DOMINIC RYAN — MOBILE SWIPE NAVIGATION

   A Personal Message ↔ The Maison ↔ Explore the Collection

   Mobile only.

   Preserves:
   - Three-page horizontal swipe navigation
   - Cross-document View Transitions
   - Existing page animations
   - Vertical scrolling
   - Safari page restoration

   Protects:
   - SociableKIT Instagram Story Highlights
   - Expanded SociableKIT story viewer
   - SociableKIT story navigation controls
   - Elfsight Instagram grid
   - Embedded widgets and carousels
   - Contact forms and interactive controls
   ========================================================= */

(() => {
  "use strict";

  /* =========================================================
     MOBILE DETECTION
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

  const normalize = path => {
    const cleaned = path.replace(/\/index\.html$/i, "/");

    return cleaned.endsWith("/")
      ? cleaned
      : `${cleaned}/`;
  };

  const current = pages.indexOf(
    normalize(window.location.pathname)
  );

  if (current === -1) {
    return;
  }

  /* =========================================================
     TRANSITION STYLING
     ========================================================= */

  const style = document.createElement("style");

  style.textContent = `
    @media (max-width: 760px) and
           (prefers-reduced-motion: no-preference) {

      @view-transition {
        navigation: auto;
      }

      ::view-transition-old(root) {
        animation:
          220ms cubic-bezier(.22,.7,.2,1)
          both dr-page-out;
      }

      ::view-transition-new(root) {
        animation:
          220ms cubic-bezier(.22,.7,.2,1)
          both dr-page-in;
      }

      @keyframes dr-page-out {
        to {
          opacity: .86;
          transform:
            translateX(var(--dr-swipe-out, -14px));
        }
      }

      @keyframes dr-page-in {
        from {
          opacity: .86;
          transform:
            translateX(var(--dr-swipe-in, 14px));
        }
      }
    }

    @media (prefers-reduced-motion: reduce) {

      ::view-transition-old(root),
      ::view-transition-new(root) {
        animation: none !important;
      }

    }
  `;

  document.head.appendChild(style);

  /* =========================================================
     DIRECTION PERSISTENCE
     ========================================================= */

  let incomingDirection = null;

  try {
    incomingDirection = sessionStorage.getItem(
      "drSwipeDirection"
    );

    sessionStorage.removeItem(
      "drSwipeDirection"
    );
  } catch (_) {}

  if (incomingDirection === "left") {

    document.documentElement.style.setProperty(
      "--dr-swipe-in",
      "14px"
    );

  } else if (incomingDirection === "right") {

    document.documentElement.style.setProperty(
      "--dr-swipe-in",
      "-14px"
    );

  }

  /* =========================================================
     INTERACTIVE ELEMENT EXCLUSIONS
     ========================================================= */

  const EXCLUDED = [
    "input",
    "textarea",
    "select",
    "[contenteditable]",
    "[role='slider']",
    "[data-no-swipe]",
    ".dr-contact-overlay",
    "video",

    /* SociableKIT Highlights — actual Collection HTML */

    ".instagram-highlights",
    ".sk-ww-instagram-story-highlights",
    "[data-embed-id='25723348']",

    /* SociableKIT expanded story viewer */

    ".sk-story-viewer-layout",
    ".sk-story-frame",
    ".sk-story-stage-row",
    ".sk-story-stage-wrap",
    ".sk-highlight-story-shell",
    ".sk-story-nav-btn",

    /* SociableKIT thumbnail navigation */

    ".dr-mini-highlights",
    ".dr-mini-highlight",

    /* Elfsight Instagram grid */

    ".instagram-grid",
    ".elfsight-app-149e3c46-7ba9-47e5-b87f-8d51c5619fc4",

    /* Other embedded widgets and carousels */

    "iframe",
    "[aria-roledescription='carousel']",
    ".swiper",
    ".swiper-container",
    ".splide",
    ".slick-slider",
    ".owl-carousel"
  ].join(",");

  /* =========================================================
     SOCIABLEKIT STORY VIEWER DETECTION

     Prevents website navigation while a SociableKIT
     story viewer is open, even if the viewer has been
     rendered outside its original Highlights container.
     ========================================================= */

  const STORY_VIEWER_SELECTORS = [
    ".sk-story-viewer-layout",
    ".sk-story-frame",
    ".sk-story-stage-row",
    ".sk-story-stage-wrap",
    ".sk-highlight-story-shell"
  ].join(",");

  function isVisible(element) {

    if (!element || !element.isConnected) {
      return false;
    }

    const styles = window.getComputedStyle(element);

    if (
      styles.display === "none" ||
      styles.visibility === "hidden" ||
      Number(styles.opacity) === 0
    ) {
      return false;
    }

    const rect = element.getBoundingClientRect();

    return (
      rect.width > 0 &&
      rect.height > 0 &&
      rect.bottom > 0 &&
      rect.top < window.innerHeight &&
      rect.right > 0 &&
      rect.left < window.innerWidth
    );
  }

  function isStoryViewerOpen() {

    if (current !== 2) {
      return false;
    }

    const viewers = document.querySelectorAll(
      STORY_VIEWER_SELECTORS
    );

    for (const viewer of viewers) {

      if (!isVisible(viewer)) {
        continue;
      }

      /*
       * Detect an expanded story viewer.
       *
       * The viewer must occupy a meaningful portion
       * of the viewport, preventing ordinary inline
       * thumbnails from disabling page navigation.
       */

      const rect = viewer.getBoundingClientRect();

      const substantialWidth =
        rect.width >= window.innerWidth * 0.45;

      const substantialHeight =
        rect.height >= window.innerHeight * 0.35;

      if (
        substantialWidth &&
        substantialHeight
      ) {
        return true;
      }

    }

    return false;
  }

  /* =========================================================
     HORIZONTAL SCROLL DETECTION
     ========================================================= */

  function isHorizontallyScrollable(target) {

    let element = target;

    while (
      element &&
      element !== document.body
    ) {

      const styles = window.getComputedStyle(element);

      const overflowX = styles.overflowX;

      if (
        (
          overflowX === "auto" ||
          overflowX === "scroll"
        ) &&
        element.scrollWidth >
          element.clientWidth + 4
      ) {
        return true;
      }

      element = element.parentElement;
    }

    return false;
  }

  /* =========================================================
     SWIPE EXCLUSION CHECK
     ========================================================= */

  function isExcluded(target) {

    if (!(target instanceof Element)) {
      return false;
    }

    if (target.closest(EXCLUDED)) {
      return true;
    }

    if (isHorizontallyScrollable(target)) {
      return true;
    }

    /*
     * Protect an open SociableKIT story viewer
     * regardless of where the widget renders it.
     */

    if (isStoryViewerOpen()) {
      return true;
    }

    return false;
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

  document.addEventListener(
    "touchstart",
    event => {

      tracking = false;

      if (
        navigating ||
        event.touches.length !== 1
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
     SWIPE NAVIGATION
     ========================================================= */

  document.addEventListener(
    "touchend",
    event => {

      if (
        !tracking ||
        navigating ||
        !event.changedTouches.length
      ) {
        return;
      }

      tracking = false;

      /*
       * Recheck whether a story viewer opened
       * during the gesture.
       */

      if (isStoryViewerOpen()) {
        return;
      }

      const deltaX =
        event.changedTouches[0].clientX - startX;

      const deltaY =
        event.changedTouches[0].clientY - startY;

      if (
        Math.abs(deltaX) < MIN_DISTANCE
      ) {
        return;
      }

      if (
        Math.abs(deltaY) > MAX_VERTICAL_DRIFT
      ) {
        return;
      }

      if (
        Math.abs(deltaX) <
        Math.abs(deltaY) * 1.5
      ) {
        return;
      }

      const direction =
        deltaX < 0 ? 1 : -1;

      const next =
        current + direction;

      if (
        next < 0 ||
        next >= pages.length
      ) {
        return;
      }

      navigating = true;

      /* Departure direction */

      document.documentElement.style.setProperty(
        "--dr-swipe-out",
        direction === 1 ? "-14px" : "14px"
      );

      /* Arrival direction */

      try {

        sessionStorage.setItem(
          "drSwipeDirection",
          direction === 1 ? "left" : "right"
        );

      } catch (_) {}

      /*
       * Navigate immediately.
       *
       * Supporting browsers animate both documents.
       * Other browsers navigate normally.
       */

      window.location.assign(
        pages[next]
      );

    },
    { passive: true }
  );

  /* =========================================================
     GESTURE CANCELLATION
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
