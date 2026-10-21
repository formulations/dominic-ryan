
/* =========================================================
   DOMINIC RYAN — MOBILE SWIPE NAVIGATION (REFINED)

   A Personal Message ↔ The Maison ↔ Explore the Collection

   Mobile only.
   Preserves existing pages, URLs, links and vertical scrolling.
   Uses cross-document View Transitions where supported.
   ========================================================= */

(() => {
  "use strict";

  const MOBILE = "(max-width: 760px)";

  if (!window.matchMedia(MOBILE).matches) return;

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

  if (current === -1) return;

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

    sessionStorage.removeItem("drSwipeDirection");
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

  const EXCLUDED = [
    "input",
    "textarea",
    "select",
    "[contenteditable]",
    "[role='slider']",
    "[data-no-swipe]",
    ".dr-contact-overlay",
    "video"
  ].join(",");

  document.addEventListener(
    "touchstart",
    event => {

      tracking = false;

      if (navigating || event.touches.length !== 1) {
        return;
      }

      if (event.target.closest(EXCLUDED)) {
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

      const deltaX =
        event.changedTouches[0].clientX - startX;

      const deltaY =
        event.changedTouches[0].clientY - startY;

      if (Math.abs(deltaX) < MIN_DISTANCE) return;

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

      if (next < 0 || next >= pages.length) {
        return;
      }

      navigating = true;

      /* Set the departure direction. */

      document.documentElement.style.setProperty(
        "--dr-swipe-out",
        direction === 1 ? "-14px" : "14px"
      );

      /* Preserve the arrival direction. */

      try {
        sessionStorage.setItem(
          "drSwipeDirection",
          direction === 1 ? "left" : "right"
        );
      } catch (_) {}

      /* Navigate immediately.
         Supporting browsers animate both documents.
         Other browsers navigate normally. */

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
    }
  );

})();
