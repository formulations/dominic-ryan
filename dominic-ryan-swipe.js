/* =========================================================
   DOMINIC RYAN — MOBILE SWIPE NAVIGATION

   A Personal Message ↔ The Maison ↔ Explore the Collection

   Mobile only: 760px and below.

   Coordinates with:
   - dominic-ryan-transitions.js
   - dominic-ryan-navigation.css

   Features:
   - Direction-aware swipe navigation
   - Native View Transitions via transition controller
   - JavaScript animation fallback via transition controller
   - index3.html testing support
   - Vertical scrolling protection
   - Contact modal protection
   - SociableKIT Instagram Highlights protection
   - Expanded Instagram story viewer protection
   - Double-navigation prevention
   - No Reduce Motion checks

   ========================================================= */

(() => {
  "use strict";


  /* =========================================================
     01 — MOBILE ONLY
     ========================================================= */

  const MOBILE = "(max-width: 760px)";

  if (!window.matchMedia(MOBILE).matches) {
    return;
  }


  /* =========================================================
     02 — PAGE ORDER
     ========================================================= */

  const pages = [
    "/",
    "/maison/",
    "/formulations/"
  ];


  /* =========================================================
     03 — PATH NORMALIZATION
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

  const current = pages.indexOf(
    currentPath
  );

  if (current === -1) {
    return;
  }


  /* =========================================================
     04 — TOUCH TRACKING
     ========================================================= */

  let startX = 0;
  let startY = 0;

  let tracking = false;
  let navigating = false;

  const MIN_DISTANCE = 85;
  const MAX_VERTICAL_DRIFT = 65;


  /* =========================================================
     05 — EXCLUDED INTERACTIVE ELEMENTS
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
     06 — CONTACT MODAL PROTECTION
     ========================================================= */

  function contactIsOpen() {

    const overlay = document.getElementById(
      "dr-contact-overlay"
    );

    if (!overlay) {
      return false;
    }

    const styles = window.getComputedStyle(
      overlay
    );

    return (
      styles.display !== "none" &&
      styles.visibility !== "hidden" &&
      styles.pointerEvents !== "none" &&
      styles.opacity !== "0"
    );

  }


  /* =========================================================
     07 — NAVIGATION COORDINATION
     ========================================================= */

  function navigate(next) {

    if (navigating) {
      return;
    }

    const destination = pages[next];

    if (!destination) {
      return;
    }

    const transitions =
      window.DRPageTransitions;

    if (
      !transitions ||
      typeof transitions.navigate !== "function"
    ) {

      /*
         Preserve navigation if the transition
         controller fails to load.
      */

      navigating = true;

      window.location.assign(
        destination
      );

      return;
    }

    if (
      typeof transitions.isNavigating === "function" &&
      transitions.isNavigating()
    ) {
      return;
    }

    navigating = true;

    /*
       The transition controller handles:

       - Navigation direction
       - Outgoing animation
       - Native View Transitions
       - JavaScript fallback
       - Incoming animation
       - Destination navigation
    */

    transitions.navigate(
      destination
    );

  }


  /* =========================================================
     08 — TOUCH START
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
     09 — TOUCH END
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


      /* Minimum horizontal distance */

      if (
        Math.abs(deltaX) < MIN_DISTANCE
      ) {
        return;
      }


      /* Prevent vertical gestures */

      if (
        Math.abs(deltaY) > MAX_VERTICAL_DRIFT
      ) {
        return;
      }


      /* Require clear horizontal intent */

      if (
        Math.abs(deltaX) <
        Math.abs(deltaY) * 1.5
      ) {
        return;
      }


      /* Determine swipe direction */

      const direction =
        deltaX < 0 ? 1 : -1;

      const next = current + direction;


      /* Prevent navigation beyond boundaries */

      if (
        next < 0 ||
        next >= pages.length
      ) {
        return;
      }


      /* Delegate navigation to transition controller */

      navigate(
        next
      );

    },
    { passive: true }
  );


  /* =========================================================
     10 — TOUCH CANCELLATION
     ========================================================= */

  document.addEventListener(
    "touchcancel",
    () => {

      tracking = false;

    },
    { passive: true }
  );


  /* =========================================================
     11 — SAFARI PAGE RESTORATION
     ========================================================= */

  window.addEventListener(
    "pageshow",
    () => {

      navigating = false;
      tracking = false;

    }
  );


})();
