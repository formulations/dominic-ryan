/* =========================================================
   DOMINIC RYAN — CROSS-PAGE TRANSITIONS

   A Personal Message ↔ The Maison ↔ Explore the Collection

   Mobile only: 760px and below.

   Coordinates with:
   - dominic-ryan-navigation.css
   - dominic-ryan-swipe.js

   Features:
   - Native cross-document View Transitions
   - JavaScript animation fallback
   - Direction-aware page movement
   - Navigation-link transitions
   - Swipe navigation coordination
   - Browser back/forward restoration
   - Double-navigation prevention
   - No Reduce Motion checks

   ========================================================= */

(() => {
  "use strict";

  /* =========================================================
     01 — CONFIGURATION
     ========================================================= */

  const MOBILE = "(max-width: 760px)";

  const DURATION = 280;

  const PAGES = [
    "/",
    "/maison/",
    "/formulations/"
  ];

  const STORAGE = {
    direction: "drSwipeDirection",
    fallback: "drFallbackTransition"
  };

  const EXIT_CLASS = "dr-fallback-leaving";
  const ENTRY_CLASS = "dr-fallback-entering";

  const TRANSITION_EASING =
    "cubic-bezier(.22, .7, .2, 1)";

  const root = document.documentElement;

  const mobileQuery = window.matchMedia(MOBILE);

  let navigating = false;
  let navigationTimer = null;


  /* =========================================================
     02 — PATH NORMALIZATION
     ========================================================= */

  function normalizePath(path) {

    if (typeof path !== "string") {
      return "/";
    }

    let normalized = path.replace(
      /\/index(?:3)?\.html$/i,
      "/"
    );

    if (!normalized.endsWith("/")) {
      normalized += "/";
    }

    return normalized;

  }


  function getPageIndex(path) {

    return PAGES.indexOf(
      normalizePath(path)
    );

  }


  function getDestinationPath(destination) {

    try {

      const url = new URL(
        destination,
        window.location.href
      );

      if (url.origin !== window.location.origin) {
        return null;
      }

      return normalizePath(
        url.pathname
      );

    } catch (_) {

      return null;

    }

  }


  /* =========================================================
     03 — STORAGE HELPERS
     ========================================================= */

  function store(key, value) {

    try {

      sessionStorage.setItem(
        key,
        value
      );

    } catch (_) {}

  }


  function retrieve(key) {

    try {

      return sessionStorage.getItem(
        key
      );

    } catch (_) {

      return null;

    }

  }


  function remove(key) {

    try {

      sessionStorage.removeItem(
        key
      );

    } catch (_) {}

  }


  /* =========================================================
     04 — NAVIGATION DIRECTION
     ========================================================= */

  function getDirection(destination) {

    const currentIndex = getPageIndex(
      window.location.pathname
    );

    const destinationPath =
      getDestinationPath(destination);

    if (!destinationPath) {
      return null;
    }

    const destinationIndex = getPageIndex(
      destinationPath
    );

    if (
      currentIndex === -1 ||
      destinationIndex === -1 ||
      currentIndex === destinationIndex
    ) {
      return null;
    }

    return destinationIndex > currentIndex
      ? "left"
      : "right";

  }


  function setDirection(direction) {

    const movingLeft = direction === "left";

    root.style.setProperty(
      "--dr-swipe-out",
      movingLeft ? "-22px" : "22px"
    );

    root.style.setProperty(
      "--dr-swipe-in",
      movingLeft ? "22px" : "-22px"
    );

  }


  /* =========================================================
     05 — NATIVE TRANSITION SUPPORT

     Native cross-document transitions are controlled
     by CSS and the browser.

     This detection is used only as an approximation.
     It does not guarantee cross-document support.

     ========================================================= */

  function supportsNativeTransitions() {

    return (
      typeof CSS !== "undefined" &&
      typeof CSS.supports === "function" &&
      CSS.supports(
        "view-transition-name",
        "none"
      ) &&
      typeof document.startViewTransition === "function"
    );

  }


  /* =========================================================
     06 — PREPARE NAVIGATION

     Called by dominic-ryan-swipe.js.

     Saves direction so the destination page
     can use the appropriate animation.

     ========================================================= */

  function prepareNavigation(destination) {

    if (!mobileQuery.matches) {
      return false;
    }

    const direction = getDirection(
      destination
    );

    if (!direction) {
      return false;
    }

    setDirection(direction);

    store(
      STORAGE.direction,
      direction
    );

    return true;

  }


  /* =========================================================
     07 — FALLBACK EXIT ANIMATION
     ========================================================= */

  function animateExit() {

    return new Promise(resolve => {

      root.classList.remove(
        ENTRY_CLASS
      );

      root.classList.add(
        EXIT_CLASS
      );

      navigationTimer = window.setTimeout(
        resolve,
        DURATION
      );

    });

  }


  /* =========================================================
     08 — NAVIGATE WITH TRANSITION
     ========================================================= */

  async function navigate(destination) {

    if (navigating) {
      return;
    }

    const destinationPath =
      getDestinationPath(destination);

    if (!destinationPath) {
      window.location.assign(
        destination
      );
      return;
    }

    const direction = getDirection(
      destination
    );

    if (!direction) {

      window.location.assign(
        destination
      );

      return;
    }

    if (!mobileQuery.matches) {

      window.location.assign(
        destination
      );

      return;
    }

    navigating = true;

    prepareNavigation(
      destination
    );

    /*
       Native cross-document View Transitions
       animate during normal navigation.
    */

    if (supportsNativeTransitions()) {

      window.location.assign(
        destination
      );

      return;
    }

    /*
       Fallback:
       Animate departure before navigation.
    */

    store(
      STORAGE.fallback,
      "1"
    );

    await animateExit();

    window.location.assign(
      destination
    );

  }


  /* =========================================================
     09 — FALLBACK ENTRY ANIMATION
     ========================================================= */

  function animateEntry() {

    if (!mobileQuery.matches) {
      return;
    }

    const direction = retrieve(
      STORAGE.direction
    );

    if (direction) {

      setDirection(
        direction
      );

      remove(
        STORAGE.direction
      );

    }

    const fallback = retrieve(
      STORAGE.fallback
    );

    if (fallback !== "1") {
      return;
    }

    remove(
      STORAGE.fallback
    );

    root.classList.remove(
      EXIT_CLASS
    );

    root.classList.add(
      ENTRY_CLASS
    );

    window.setTimeout(() => {

      root.classList.remove(
        ENTRY_CLASS
      );

    }, DURATION + 50);

  }


  /* =========================================================
     10 — NAVIGATION-LINK HANDLING
     ========================================================= */

  function handleNavigationClick(event) {

    if (!mobileQuery.matches) {
      return;
    }

    if (event.defaultPrevented) {
      return;
    }

    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    const target = event.target;

    if (!(target instanceof Element)) {
      return;
    }

    const link = target.closest(
      "a[href]"
    );

    if (!link) {
      return;
    }

    if (
      link.hasAttribute("download") ||
      link.target === "_blank"
    ) {
      return;
    }

    const destination = link.href;

    const destinationPath =
      getDestinationPath(destination);

    if (!destinationPath) {
      return;
    }

    const destinationIndex =
      getPageIndex(destinationPath);

    const currentIndex =
      getPageIndex(
        window.location.pathname
      );

    if (
      destinationIndex === -1 ||
      currentIndex === -1 ||
      destinationIndex === currentIndex
    ) {
      return;
    }

    event.preventDefault();

    navigate(
      destination
    );

  }


  /* =========================================================
     11 — PAGE RESTORATION
     ========================================================= */

  function resetNavigation() {

    navigating = false;

    if (navigationTimer !== null) {

      window.clearTimeout(
        navigationTimer
      );

      navigationTimer = null;

    }

    root.classList.remove(
      EXIT_CLASS
    );

  }


  /* =========================================================
     12 — INITIALIZATION
     ========================================================= */

  function initialize() {

    if (!mobileQuery.matches) {
      return;
    }

    animateEntry();

    document.addEventListener(
      "click",
      handleNavigationClick
    );

    window.addEventListener(
      "pageshow",
      event => {

        resetNavigation();

        if (event.persisted) {

          root.classList.remove(
            ENTRY_CLASS
          );

        }

      }
    );

  }


  /* =========================================================
     13 — PUBLIC API
     ========================================================= */

  window.DRPageTransitions = {

    prepareNavigation,
    navigate,

    getDirection,

    isNavigating() {
      return navigating;
    }

  };


  /* =========================================================
     14 — START
     ========================================================= */

  if (document.readyState === "loading") {

    document.addEventListener(
      "DOMContentLoaded",
      initialize,
      { once: true }
    );

  } else {

    initialize();

  }

})();
