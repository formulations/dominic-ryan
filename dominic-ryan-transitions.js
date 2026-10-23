/* =========================================================
   DOMINIC RYAN — CROSS-PAGE TRANSITIONS

   A Personal Message ↔ The Maison ↔ Explore the Collection

   Desktop + Mobile

   Coordinates with:
   - dominic-ryan-navigation.css
   - dominic-ryan-swipe.js

   Features:
   - Native cross-document View Transitions
   - JavaScript animation fallback
   - Direction-aware page movement
   - Navigation-link transitions
   - Mobile swipe navigation coordination
   - Browser back/forward restoration
   - Double-navigation prevention
   - No Reduce Motion checks

   ========================================================= */

(() => {
  "use strict";

  /* =========================================================
     01 — CONFIGURATION
     ========================================================= */

  const DURATION = 280;

  const PAGES = [
    "/",
    "/maison/",
    "/formulations/"
  ];

  const STORAGE = {
    direction: "drSwipeDirection",
    fallback: "drFallbackTransition",
    destination: "drTransitionDestination",
    timestamp: "drTransitionTimestamp"
  };

  const EXIT_CLASS = "dr-fallback-leaving";
  const ENTRY_CLASS = "dr-fallback-entering";

  const root = document.documentElement;

  const TRANSITION_MAX_AGE = 10000;

  let navigating = false;
  let navigationTimer = null;
  let entryTimer = null;


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
        String(value)
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


  function clearTransitionStorage() {

    remove(STORAGE.direction);
    remove(STORAGE.fallback);
    remove(STORAGE.destination);
    remove(STORAGE.timestamp);

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

     Cross-document transitions require browser support
     and @view-transition { navigation: auto; } on
     both participating documents.

     The browser is responsible for running the native
     transition. We avoid assuming that support for
     document.startViewTransition() guarantees support
     for cross-document transitions.

     ========================================================= */

  function supportsNativeTransitions() {

    return (
      typeof CSS !== "undefined" &&
      typeof CSS.supports === "function" &&
      CSS.supports(
        "view-transition-name",
        "none"
      ) &&
      typeof document.startViewTransition === "function" &&
      typeof window.navigation !== "undefined"
    );

  }


  /* =========================================================
     06 — PREPARE NAVIGATION

     Also called by dominic-ryan-swipe.js.

     ========================================================= */

  function prepareNavigation(destination) {

    const direction = getDirection(
      destination
    );

    if (!direction) {
      return false;
    }

    const destinationPath =
      getDestinationPath(destination);

    setDirection(direction);

    store(
      STORAGE.direction,
      direction
    );

    store(
      STORAGE.destination,
      destinationPath
    );

    store(
      STORAGE.timestamp,
      Date.now()
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

    const destination = retrieve(
      STORAGE.destination
    );

    const timestamp = Number(
      retrieve(STORAGE.timestamp)
    );

    const direction = retrieve(
      STORAGE.direction
    );

    const fallback = retrieve(
      STORAGE.fallback
    );

    const currentPath = normalizePath(
      window.location.pathname
    );

    const validTransition = (
      destination === currentPath &&
      Number.isFinite(timestamp) &&
      timestamp > 0 &&
      Date.now() - timestamp < TRANSITION_MAX_AGE &&
      (direction === "left" || direction === "right")
    );

    if (!validTransition) {

      clearTransitionStorage();
      return;

    }

    setDirection(direction);

    clearTransitionStorage();

    if (fallback !== "1") {
      return;
    }

    root.classList.remove(
      EXIT_CLASS
    );

    root.classList.add(
      ENTRY_CLASS
    );

    entryTimer = window.setTimeout(() => {

      root.classList.remove(
        ENTRY_CLASS
      );

      entryTimer = null;

    }, DURATION + 50);

  }


  /* =========================================================
     10 — NAVIGATION-LINK HANDLING
     ========================================================= */

  function handleNavigationClick(event) {

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
      (
        link.target &&
        link.target.toLowerCase() !== "_self"
      )
    ) {
      return;
    }

    if (
      link.hasAttribute("data-dr-contact-open") ||
      link.closest("#dr-contact-overlay")
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

    if (entryTimer !== null) {

      window.clearTimeout(
        entryTimer
      );

      entryTimer = null;

    }

    root.classList.remove(
      EXIT_CLASS
    );

    root.classList.remove(
      ENTRY_CLASS
    );

  }


  /* =========================================================
     12 — INITIALIZATION
     ========================================================= */

  function initialize() {

    animateEntry();

    document.addEventListener(
      "click",
      handleNavigationClick
    );

    window.addEventListener(
      "pageshow",
      event => {

        if (event.persisted) {

          resetNavigation();

          clearTransitionStorage();

        } else {

          navigating = false;

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
