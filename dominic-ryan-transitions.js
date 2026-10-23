/* =========================================================
   DOMINIC RYAN — CROSS-PAGE TRANSITIONS

   A Personal Message ↔ The Maison ↔ Explore the Collection

   Desktop + Mobile

   Page:
   - 280ms directional glide

   Navigation underline:
   - 400ms continuous movement
   - Natural width interpolation
   - Soft deceleration
   - Native cross-document View Transition

   Supports:
   - index.html
   - index3.html
   - Mobile swipe navigation
   - Desktop navigation
   - Browser back/forward restoration
   - JavaScript fallback

   ========================================================= */

(() => {
  "use strict";

  /* =========================================================
     01 — CONFIGURATION
     ========================================================= */

  const PAGE_DURATION = 280;
  const LINE_DURATION = 400;

  const LINE_EASING =
    "cubic-bezier(.22, 1, .36, 1)";

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

  const NATIVE_CLASS = "dr-native-underline";

  const TRANSITION_MAX_AGE = 10000;

  const root = document.documentElement;

  let navigating = false;
  let navigationTimer = null;
  let entryTimer = null;

  let underlineElement = null;
  let underlineNavigation = null;

  let resizeObserver = null;

  let incomingTransition = false;

  /* =========================================================
     02 — PATH NORMALIZATION
     ========================================================= */

  function normalizePath(path) {

    if (typeof path !== "string") {
      return "/";
    }

    let cleaned = path;

    try {
      cleaned = decodeURIComponent(cleaned);
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

      return normalizePath(url.pathname);

    } catch (_) {

      return null;

    }

  }

  /* =========================================================
     03 — STORAGE
     ========================================================= */

  function store(key, value) {

    try {
      sessionStorage.setItem(key, String(value));
    } catch (_) {}

  }

  function retrieve(key) {

    try {
      return sessionStorage.getItem(key);
    } catch (_) {
      return null;
    }

  }

  function remove(key) {

    try {
      sessionStorage.removeItem(key);
    } catch (_) {}

  }

  function clearTransitionStorage() {

    remove(STORAGE.direction);
    remove(STORAGE.fallback);
    remove(STORAGE.destination);
    remove(STORAGE.timestamp);

  }

  /* =========================================================
     04 — DIRECTION
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
     05 — NATIVE VIEW TRANSITION SUPPORT
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
     06 — PRIMARY NAVIGATION
     ========================================================= */

  function getPrimaryNavigation() {

    return document.querySelector(
      ".collection-navigation, .maison-primary-nav"
    );

  }

  function getNavigationLink(path) {

    const navigation = getPrimaryNavigation();

    if (!navigation) {
      return null;
    }

    const links = navigation.querySelectorAll(
      "a[href]"
    );

    for (const link of links) {

      if (
        getDestinationPath(link.href) === path
      ) {
        return link;
      }

    }

    return null;

  }

  /* =========================================================
     07 — UNDERLINE GEOMETRY
     ========================================================= */

  function getUnderlineGeometry(link, navigation) {

    if (!link || !navigation) {
      return null;
    }

    const linkRect = link.getBoundingClientRect();
    const navRect = navigation.getBoundingClientRect();

    return {
      left: linkRect.left - navRect.left,
      width: linkRect.width,
      top: linkRect.bottom - navRect.top - 1
    };

  }

  function applyUnderlineGeometry(geometry) {

    if (!underlineElement || !geometry) {
      return;
    }

    underlineElement.style.left =
      `${geometry.left}px`;

    underlineElement.style.width =
      `${geometry.width}px`;

    underlineElement.style.top =
      `${geometry.top}px`;

    underlineElement.style.opacity = "1";

  }

  function positionUnderline() {

    if (
      !underlineElement ||
      !underlineNavigation ||
      navigating
    ) {
      return;
    }

    const currentPath = normalizePath(
      window.location.pathname
    );

    const link = getNavigationLink(currentPath);

    if (!link) {
      return;
    }

    applyUnderlineGeometry(
      getUnderlineGeometry(
        link,
        underlineNavigation
      )
    );

  }

  /* =========================================================
     08 — INITIALIZE UNDERLINE
     ========================================================= */

  function initializeUnderline() {

    if (underlineElement) {
      return;
    }

    const navigation = getPrimaryNavigation();

    if (!navigation) {
      return;
    }

    underlineNavigation = navigation;

    const underline = document.createElement("span");

    underline.className =
      "dr-traveling-underline";

    underline.setAttribute(
      "aria-hidden",
      "true"
    );

    navigation.appendChild(underline);

    underlineElement = underline;

    navigation.classList.add(
      "dr-travel-nav"
    );

    positionUnderline();

    if ("ResizeObserver" in window) {

      resizeObserver = new ResizeObserver(() => {

        if (!navigating) {
          positionUnderline();
        }

      });

      resizeObserver.observe(navigation);

    }

    if (document.fonts && document.fonts.ready) {

      document.fonts.ready.then(() => {

        if (!navigating) {
          positionUnderline();
        }

      }).catch(() => {});

    }

  }

  /* =========================================================
     09 — NATIVE UNDERLINE IDENTITY
     ========================================================= */

  function enableNativeUnderline() {

    if (!underlineElement) {
      return;
    }

    root.classList.add(
      NATIVE_CLASS
    );

  }

  function disableNativeUnderline() {

    root.classList.remove(
      NATIVE_CLASS
    );

  }

  /* =========================================================
     10 — INCOMING PAGE TRANSITION
     ========================================================= */

  function prepareIncomingTransition() {

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
      (
        direction === "left" ||
        direction === "right"
      )
    );

    if (!validTransition) {

      clearTransitionStorage();
      positionUnderline();
      return;

    }

    incomingTransition = true;

    setDirection(direction);

    if (fallback === "1") {

      root.classList.add(
        ENTRY_CLASS
      );

      entryTimer = window.setTimeout(() => {

        root.classList.remove(
          ENTRY_CLASS
        );

        entryTimer = null;

      }, PAGE_DURATION + 50);

    }

    clearTransitionStorage();

  }

  /* =========================================================
     11 — BROWSER VIEW TRANSITION LIFECYCLE
     ========================================================= */

  function initializeViewTransitionEvents() {

    /*
       pageswap fires on the outgoing document
       before its visual snapshot is captured.
    */

    window.addEventListener(
      "pageswap",
      event => {

        if (!event.viewTransition) {
          return;
        }

        enableNativeUnderline();

      }
    );

    /*
       pagereveal fires on the incoming document
       before its visual snapshot is revealed.

       The underline is initialized and assigned
       its matching View Transition name.
    */

    window.addEventListener(
      "pagereveal",
      event => {

        if (!event.viewTransition) {
          return;
        }

        if (!underlineElement) {
          initializeUnderline();
        }

        positionUnderline();

        enableNativeUnderline();

      }
    );

  }

  /* =========================================================
     12 — NAVIGATION PREPARATION
     ========================================================= */

  function prepareNavigation(destination) {

    const direction = getDirection(destination);

    if (!direction) {
      return false;
    }

    const destinationPath =
      getDestinationPath(destination);

    setDirection(direction);

    store(STORAGE.direction, direction);
    store(STORAGE.destination, destinationPath);
    store(STORAGE.timestamp, Date.now());

    return true;

  }

  /* =========================================================
     13 — FALLBACK UNDERLINE ANIMATION
     ========================================================= */

  function animateFallbackUnderline(destination) {

    if (
      !underlineElement ||
      !underlineNavigation
    ) {
      return;
    }

    const destinationPath =
      getDestinationPath(destination);

    if (!destinationPath) {
      return;
    }

    const destinationLink =
      getNavigationLink(destinationPath);

    if (!destinationLink) {
      return;
    }

    const from = getUnderlineGeometry(
      getNavigationLink(
        normalizePath(window.location.pathname)
      ),
      underlineNavigation
    );

    const to = getUnderlineGeometry(
      destinationLink,
      underlineNavigation
    );

    if (!from || !to) {
      return;
    }

    const distance = to.left - from.left;

    const stretch = Math.min(
      Math.abs(distance) * 0.08,
      12
    );

    const movingRight = distance > 0;

    underlineElement.animate(
      [
        {
          left: `${from.left}px`,
          width: `${from.width}px`,
          top: `${from.top}px`,
          opacity: 1,
          offset: 0
        },
        {
          left:
            `${
              from.left +
              distance * 0.58 -
              (movingRight ? 0 : stretch)
            }px`,

          width:
            `${
              from.width +
              (to.width - from.width) * 0.58 +
              stretch
            }px`,

          top:
            `${
              from.top +
              (to.top - from.top) * 0.58
            }px`,

          opacity: 1,
          offset: 0.58
        },
        {
          left: `${to.left}px`,
          width: `${to.width}px`,
          top: `${to.top}px`,
          opacity: 1,
          offset: 1
        }
      ],
      {
        duration: LINE_DURATION,
        easing: LINE_EASING,
        fill: "forwards"
      }
    );

  }

  /* =========================================================
     14 — FALLBACK PAGE EXIT
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
        PAGE_DURATION
      );

    });

  }

  /* =========================================================
     15 — NAVIGATION
     ========================================================= */

  async function navigate(destination) {

    if (navigating) {
      return;
    }

    const destinationPath =
      getDestinationPath(destination);

    if (!destinationPath) {

      window.location.assign(destination);
      return;

    }

    const direction = getDirection(destination);

    if (!direction) {

      window.location.assign(destination);
      return;

    }

    navigating = true;

    prepareNavigation(destination);

    if (supportsNativeTransitions()) {

      /*
         Do not animate the underline manually.

         The browser will animate the named underline
         between the outgoing and incoming documents.
      */

      window.location.assign(destination);

      return;

    }

    /*
       Fallback for browsers without native
       cross-document View Transitions.
    */

    store(STORAGE.fallback, "1");

    animateFallbackUnderline(destination);

    await animateExit();

    window.location.assign(destination);

  }

  /* =========================================================
     16 — CLICK HANDLING
     ========================================================= */

  function handleNavigationClick(event) {

    if (
      event.defaultPrevented ||
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

    const destinationPath =
      getDestinationPath(link.href);

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

    navigate(link.href);

  }

  /* =========================================================
     17 — RESTORATION
     ========================================================= */

  function resetNavigation() {

    navigating = false;

    if (navigationTimer !== null) {

      clearTimeout(navigationTimer);
      navigationTimer = null;

    }

    if (entryTimer !== null) {

      clearTimeout(entryTimer);
      entryTimer = null;

    }

    root.classList.remove(EXIT_CLASS);
    root.classList.remove(ENTRY_CLASS);

    disableNativeUnderline();

    positionUnderline();

  }

  /* =========================================================
     18 — INITIALIZATION
     ========================================================= */

  function initialize() {

    initializeUnderline();

    prepareIncomingTransition();

    initializeViewTransitionEvents();

    document.addEventListener(
      "click",
      handleNavigationClick
    );

    window.addEventListener(
      "resize",
      () => {

        if (!navigating) {
          positionUnderline();
        }

      },
      { passive: true }
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
     19 — PUBLIC API
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
     20 — START
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
