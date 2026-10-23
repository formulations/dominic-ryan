/* =========================================================
   DOMINIC RYAN — CROSS-PAGE TRANSITIONS

   A Personal Message ↔ The Maison ↔ Explore the Collection

   Desktop + Mobile

   DESIGN
   - 280ms directional page glide
   - 400ms traveling navigation underline
   - Single visible underline during native transitions
   - No competing page animations

   RELIABILITY
   - Early pageswap / pagereveal registration
   - Direction-aware forward and backward navigation
   - Stable underline geometry
   - Font and viewport recalibration
   - Browser history restoration
   - Progressive fallback
   - Mobile swipe integration

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
  let initialized = false;

  let navigationTimer = null;
  let entryTimer = null;

  let underlineElement = null;
  let underlineNavigation = null;
  let underlineAnimation = null;

  let resizeObserver = null;

  let nativeTransitionActive = false;

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
     03 — SESSION STORAGE
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
     04 — NAVIGATION DIRECTION
     ========================================================= */

  function directionBetween(fromPath, toPath) {

    const fromIndex = getPageIndex(fromPath);
    const toIndex = getPageIndex(toPath);

    if (
      fromIndex === -1 ||
      toIndex === -1 ||
      fromIndex === toIndex
    ) {
      return null;
    }

    return toIndex > fromIndex
      ? "left"
      : "right";

  }

  function getDirection(destination) {

    const destinationPath =
      getDestinationPath(destination);

    if (!destinationPath) {
      return null;
    }

    return directionBetween(
      window.location.pathname,
      destinationPath
    );

  }

  function setDirection(direction) {

    if (
      direction !== "left" &&
      direction !== "right"
    ) {
      return;
    }

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
     05 — NATIVE CAPABILITY

     This detects the core View Transition API.

     Actual cross-document transitions are confirmed
     through pageswap / pagereveal event.viewTransition.

     ========================================================= */

  function supportsViewTransitionAPI() {

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
     06 — PRIMARY NAVIGATION
     ========================================================= */

  function getPrimaryNavigation() {

    return document.querySelector(
      ".collection-navigation, .maison-primary-nav"
    );

  }

  function getNavigationLink(path) {

    const navigation =
      underlineNavigation ||
      getPrimaryNavigation();

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

    const linkRect =
      link.getBoundingClientRect();

    const navRect =
      navigation.getBoundingClientRect();

    if (
      !linkRect.width ||
      !Number.isFinite(linkRect.left)
    ) {
      return null;
    }

    return {
      left:
        linkRect.left -
        navRect.left -
        navigation.clientLeft +
        navigation.scrollLeft,

      width: linkRect.width,

      top:
        linkRect.bottom -
        navRect.top -
        navigation.clientTop +
        navigation.scrollTop -
        1
    };

  }

  function applyUnderlineGeometry(geometry) {

    if (
      !underlineElement ||
      !geometry
    ) {
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

  function positionUnderline(force = false) {

    if (
      !underlineElement ||
      !underlineNavigation
    ) {
      return;
    }

    if (
      !force &&
      (
        navigating ||
        nativeTransitionActive
      )
    ) {
      return;
    }

    const currentPath = normalizePath(
      window.location.pathname
    );

    const link = getNavigationLink(
      currentPath
    );

    if (!link) {
      return;
    }

    const geometry = getUnderlineGeometry(
      link,
      underlineNavigation
    );

    applyUnderlineGeometry(geometry);

  }

  /* =========================================================
     08 — UNDERLINE INITIALIZATION
     ========================================================= */

  function initializeUnderline() {

    if (
      underlineElement &&
      underlineElement.isConnected
    ) {
      return true;
    }

    const navigation =
      getPrimaryNavigation();

    if (!navigation) {
      return false;
    }

    underlineNavigation = navigation;

    const existing = navigation.querySelector(
      ".dr-traveling-underline"
    );

    const underline =
      existing ||
      document.createElement("span");

    underline.className =
      "dr-traveling-underline";

    underline.setAttribute(
      "aria-hidden",
      "true"
    );

    if (!existing) {
      navigation.appendChild(underline);
    }

    underlineElement = underline;

    navigation.classList.add(
      "dr-travel-nav"
    );

    positionUnderline(true);

    if (
      "ResizeObserver" in window &&
      !resizeObserver
    ) {

      resizeObserver = new ResizeObserver(() => {

        if (
          !navigating &&
          !nativeTransitionActive
        ) {
          positionUnderline();
        }

      });

      resizeObserver.observe(navigation);

    }

    if (
      document.fonts &&
      document.fonts.ready
    ) {

      document.fonts.ready
        .then(() => {

          if (
            !navigating &&
            !nativeTransitionActive
          ) {
            positionUnderline();
          }

        })
        .catch(() => {});

    }

    return true;

  }

  /* =========================================================
     09 — NATIVE UNDERLINE IDENTITY
     ========================================================= */

  function enableNativeUnderline() {

    if (!initializeUnderline()) {
      return false;
    }

    /*
       Measure before assigning the named
       transition identity.
    */

    positionUnderline(true);

    root.classList.add(
      NATIVE_CLASS
    );

    return true;

  }

  function disableNativeUnderline() {

    root.classList.remove(
      NATIVE_CLASS
    );

  }

  /* =========================================================
     10 — FALLBACK UNDERLINE MOVEMENT
     ========================================================= */

  function animateFallbackUnderline(destination) {

    if (
      !underlineElement ||
      !underlineNavigation ||
      typeof underlineElement.animate !== "function"
    ) {
      return;
    }

    const destinationPath =
      getDestinationPath(destination);

    if (!destinationPath) {
      return;
    }

    const currentLink = getNavigationLink(
      normalizePath(window.location.pathname)
    );

    const destinationLink = getNavigationLink(
      destinationPath
    );

    if (
      !currentLink ||
      !destinationLink
    ) {
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

    const distance =
      to.left - from.left;

    const stretch = Math.min(
      Math.abs(distance) * 0.08,
      12
    );

    const movingRight =
      distance > 0;

    underlineAnimation =
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
     11 — INCOMING TRANSITION STATE
     ========================================================= */

  function prepareIncomingTransition() {

    const destination =
      retrieve(STORAGE.destination);

    const timestamp = Number(
      retrieve(STORAGE.timestamp)
    );

    const direction =
      retrieve(STORAGE.direction);

    const fallback =
      retrieve(STORAGE.fallback);

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
      return;
    }

    setDirection(direction);

    clearTransitionStorage();

    /*
       Only animate entry when the outgoing
       page explicitly used the JS fallback.
    */

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

  }

  /* =========================================================
     12 — NATIVE TRANSITION LIFECYCLE

     These listeners are registered immediately,
     before DOMContentLoaded.

     ========================================================= */

  window.addEventListener(
    "pageswap",
    event => {

      if (!event.viewTransition) {
        return;
      }

      /*
         Determine direction for navigations that
         bypass our click handler, including history.
      */

      const activation =
        event.activation;

      if (
        activation &&
        activation.from &&
        activation.entry
      ) {

        const direction = directionBetween(
          new URL(activation.from.url).pathname,
          new URL(activation.entry.url).pathname
        );

        setDirection(direction);

      }

      /*
         Outgoing snapshot preparation.
      */

      enableNativeUnderline();

    }
  );

  window.addEventListener(
    "pagereveal",
    event => {

      /*
         Resolve incoming direction before
         the new snapshot is captured.
      */

      const activation =
        event.activation;

      if (
        activation &&
        activation.from &&
        activation.entry
      ) {

        const direction = directionBetween(
          new URL(activation.from.url).pathname,
          new URL(activation.entry.url).pathname
        );

        setDirection(direction);

      }

      if (!event.viewTransition) {
        return;
      }

      /*
         Incoming snapshot preparation.

         This must occur synchronously inside
         pagereveal.
      */

      nativeTransitionActive = true;

      enableNativeUnderline();

      /*
         Clear the named identity after the
         browser finishes the transition.
      */

      Promise.resolve(
        event.viewTransition.finished
      )
        .catch(() => {})
        .then(() => {

          nativeTransitionActive = false;

          disableNativeUnderline();

          positionUnderline(true);

        });

    }
  );

  /* =========================================================
     13 — NAVIGATION PREPARATION
     ========================================================= */

  function prepareNavigation(destination) {

    const direction =
      getDirection(destination);

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

    const direction =
      getDirection(destination);

    if (!direction) {

      window.location.assign(destination);
      return;

    }

    navigating = true;

    prepareNavigation(destination);

    /*
       Native-capable browsers navigate immediately.

       Cross-document transitions are coordinated
       by pageswap / pagereveal.

       No JS page animation is applied simultaneously.
    */

    if (supportsViewTransitionAPI()) {

      window.location.assign(destination);
      return;

    }

    /*
       Controlled fallback for browsers without
       the View Transition API.
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
    nativeTransitionActive = false;

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

    disableNativeUnderline();

    positionUnderline(true);

  }

  /* =========================================================
     18 — INITIALIZATION
     ========================================================= */

  function initialize() {

    if (initialized) {
      return;
    }

    initialized = true;

    initializeUnderline();

    prepareIncomingTransition();

    document.addEventListener(
      "click",
      handleNavigationClick
    );

    window.addEventListener(
      "resize",
      () => {

        if (
          !navigating &&
          !nativeTransitionActive
        ) {
          positionUnderline();
        }

      },
      { passive: true }
    );

    window.addEventListener(
      "orientationchange",
      () => {

        window.requestAnimationFrame(() => {

          if (
            !navigating &&
            !nativeTransitionActive
          ) {
            positionUnderline();
          }

        });

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

     Preserves compatibility with mobile swipe JS.

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

  /*
     Register native lifecycle listeners immediately
     above, then initialize the DOM-dependent elements
     as soon as the parsed document is available.
  */

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
