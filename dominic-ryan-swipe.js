/* =========================================================
   DOMINIC RYAN — MOBILE SWIPE NAVIGATION

   A Personal Message ↔ The Maison ↔ Explore the Collection

   Mobile only.

   Supports:
   - /
   - /index.html
   - /index3.html
   - /maison/
   - /formulations/

   Preserves existing navigation and transitions.

   Excludes interactive elements, the contact form,
   SociableKIT Instagram Highlights, and story viewers.
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

     Treat index3.html as the homepage during testing.
     Continue supporting index.html after publication.
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
     TOUCH TRACKING
     ========================================================= */

  let startX = 0;
  let startY = 0;

  let tracking = false;
  let navigating = false;

  const MIN_DISTANCE = 85;
  const MAX_VERTICAL_DRIFT = 65;

  /* =========================================================
     EXCLUDED INTERACTIVE ELEMENTS
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
     SWIPE NAVIGATION
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

      if (Math.abs(deltaX) < MIN_DISTANCE) {
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

      const direction = deltaX < 0 ? 1 : -1;

      const next = current + direction;

      if (
        next < 0 ||
        next >= pages.length
      ) {
        return;
      }

      navigating = true;

      /* =====================================================
         OUTGOING TRANSITION DIRECTION
         ===================================================== */

      document.documentElement.style.setProperty(
        "--dr-swipe-out",
        direction === 1
          ? "-14px"
          : "14px"
      );

      /* =====================================================
         INCOMING TRANSITION DIRECTION
         ===================================================== */

      try {
        sessionStorage.setItem(
          "drSwipeDirection",
          direction === 1
            ? "left"
            : "right"
        );
      } catch (_) {}

      /* =====================================================
         NAVIGATE
         ===================================================== */

      window.location.assign(pages[next]);

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
