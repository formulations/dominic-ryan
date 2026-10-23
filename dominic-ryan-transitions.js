/* =========================================================
   DOMINIC RYAN — CROSS-PAGE TRANSITIONS

   A Personal Message ↔ The Maison ↔ Explore the Collection

   Desktop + Mobile

   Page:
   - 280ms directional glide

   Navigation underline:
   - 400ms directional movement
   - Subtle stretch and contraction
   - Soft deceleration
   - Coordinated across page changes

   Supports:
   - index.html
   - index3.html
   - Mobile swipe navigation
   - Desktop navigation
   - Browser back/forward restoration

   ========================================================= */

(() => {
  "use strict";

  /* =========================================================
     01 — CONFIGURATION
     ========================================================= */

  const PAGE_DURATION = 280;
  const LINE_DURATION = 400;

  const PAGE_EASING =
    "cubic-bezier(.22, .7, .2, 1)";

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
    timestamp: "drTransitionTimestamp",
    underline: "drTransitionUnderline"
  };

  const EXIT_CLASS = "dr-fallback-leaving";
  const ENTRY_CLASS = "dr-fallback-entering";

  const TRANSITION_MAX_AGE = 10000;

  const root = document.documentElement;

  let navigating = false;
  let navigationTimer = null;
  let entryTimer = null;

  let underlineElement = null;
  let underlineNavigation = null;
  let underlineAnimation = null;

  let resizeObserver = null;

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
    remove(STORAGE.underline);

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
     05 — NAVIGATION UNDERLINE
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

  function initializeUnderline() {

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
     06 — UNDERLINE ANIMATION
     ========================================================= */

  function animateUnderline(destination) {

    if (
      !underlineElement ||
      !underlineNavigation
    ) {
      return;
    }

    const currentPath = normalizePath(
      window.location.pathname
    );

    const destinationPath =
      getDestinationPath(destination);

    if (!destinationPath) {
      return;
    }

    const currentLink =
      getNavigationLink(currentPath);

    const destinationLink =
      getNavigationLink(destinationPath);

    if (!currentLink || !destinationLink) {
      return;
    }

    const from = getUnderlineGeometry(
      currentLink,
      underlineNavigation
    );

    const to = getUnderlineGeometry(
      destinationLink,
      underlineNavigation
    );

    if (!from || !to) {
      return;
    }

    if (underlineAnimation) {
      underlineAnimation.cancel();
    }

    const distance = to.left - from.left;

    /*
       A very restrained extension of the line
       during movement.

       Maximum stretch: 12px.
    */

    const stretch = Math.min(
      Math.abs(distance) * 0.08,
      12
    );

    const movingRight = distance > 0;

    const midpoint = {
      left:
        from.left +
        distance * 0.58 -
        (movingRight ? 0 : stretch),

      width:
        from.width +
        (to.width - from.width) * 0.58 +
        stretch,

      top:
        from.top +
        (to.top - from.top) * 0.58
    };

    underlineAnimation = underlineElement.animate(
      [
        {
          left: `${from.left}px`,
          width: `${from.width}px`,
          top: `${from.top}px`,
          opacity: 1,
          offset: 0
        },
        {
          left: `${midpoint.left}px`,
          width: `${midpoint.width}px`,
          top: `${midpoint.top}px`,
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

    store(
      STORAGE.underline,
      destinationPath
    );

  }

  /* =========================================================
     07 — INCOMING UNDERLINE
     ========================================================= */

  function animateIncomingUnderline(direction) {

    if (
      !underlineElement ||
      !underlineNavigation
    ) {
      return;
    }

    const currentPath = normalizePath(
      window.location.pathname
    );

    const currentLink =
      getNavigationLink(currentPath);

    if (!currentLink) {
      return;
    }

    const to = getUnderlineGeometry(
      currentLink,
      underlineNavigation
    );

    if (!to) {
      return;
    }

    const enteringFromRight =
      direction === "left";

    const offset = enteringFromRight
      ? -10
      : 10;

    const stretch = 8;

    underlineElement.animate(
      [
        {
          transform: `translateX(${offset}px)`,
          width: `${to.width + stretch}px`,
          opacity: 0.9
        },
        {
          transform: "translateX(0)",
          width: `${to.width}px`,
          opacity: 1
        }
      ],
      {
        duration: LINE_DURATION,
        easing: LINE_EASING,
        fill: "none"
      }
    );

  }

  /* =========================================================
     08 — NATIVE TRANSITION DETECTION
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
     09 — PREPARE NAVIGATION
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

    animateUnderline(destination);

    return true;

  }

  /* =========================================================
     10 — FALLBACK PAGE EXIT
     ========================================================= */

  function animateExit() {

    return new Promise(resolve => {

      root.classList.remove(ENTRY_CLASS);
      root.classList.add(EXIT_CLASS);

      navigationTimer = window.setTimeout(
        resolve,
        PAGE_DURATION
      );

    });

  }

  /* =========================================================
     11 — NAVIGATION
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

      window.location.assign(destination);
      return;

    }

    store(STORAGE.fallback, "1");

    await animateExit();

    window.location.assign(destination);

  }

  /* =========================================================
     12 — INCOMING PAGE
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

    setDirection(direction);

    clearTransitionStorage();

    positionUnderline();

    animateIncomingUnderline(direction);

    if (fallback !== "1") {
      return;
    }

    root.classList.remove(EXIT_CLASS);
    root.classList.add(ENTRY_CLASS);

    entryTimer = window.setTimeout(() => {

      root.classList.remove(ENTRY_CLASS);
      entryTimer = null;

    }, PAGE_DURATION + 50);

  }

  /* =========================================================
     13 — CLICK HANDLING
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

    const link = target.closest("a[href]");

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
      getPageIndex(window.location.pathname);

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
     14 — RESTORATION
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

    if (underlineAnimation) {

      underlineAnimation.cancel();
      underlineAnimation = null;

    }

    root.classList.remove(EXIT_CLASS);
    root.classList.remove(ENTRY_CLASS);

    positionUnderline();

  }

  /* =========================================================
     15 — INITIALIZATION
     ========================================================= */

  function initialize() {

    initializeUnderline();

    animateEntry();

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
     16 — PUBLIC API
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
     17 — START
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
