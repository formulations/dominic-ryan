/* =========================================================
   DOMINIC RYAN — BRANDED INTRODUCTION
   ========================================================= */

(() => {
  "use strict";

  /* =========================================================
     SESSION CONTROL
     ========================================================= */

  try {
    if (sessionStorage.getItem("dr-intro-shown")) {
      return;
    }

    sessionStorage.setItem("dr-intro-shown", "true");
  } catch (_) {
    // Continue if session storage is unavailable.
  }

  /* =========================================================
     DEVICE DETECTION
     ========================================================= */

  const isMobile = window.matchMedia("(max-width: 760px)").matches;

  /* =========================================================
     STYLING
     ========================================================= */

  const style = document.createElement("style");

  style.textContent = `
    .dr-intro {
      position: fixed;
      inset: 0;
      z-index: 99999;

      display: flex;
      align-items: center;
      justify-content: center;

      background: #9D8873;

      opacity: 1;
      visibility: visible;

      transition:
        opacity .8s ease,
        visibility .8s ease;
    }

    .dr-intro.is-finished {
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
    }

    .dr-intro video,
    .dr-intro img {
      display: block;

      width: min(40vw, 150px);
      height: auto;

      object-fit: contain;
      background: transparent;

      pointer-events: none;
    }

    /* DESKTOP WEBM COLOR */

    .dr-intro video {
      filter: brightness(0) saturate(100%) invert(94%) sepia(5%) saturate(271%) hue-rotate(332deg) brightness(102%) contrast(91%);
    }

    /* MOBILE */

    @media (max-width: 760px) {
      .dr-intro video,
      .dr-intro img {
        width: min(40vw, 120px);
      }
    }

    /* REDUCED MOTION */

    @media (prefers-reduced-motion: reduce) {
      .dr-intro {
        transition: none;
      }
    }
  `;

  document.head.appendChild(style);

  /* =========================================================
     INTRODUCTION ELEMENT
     ========================================================= */

  const intro = document.createElement("div");

  intro.className = "dr-intro";
  intro.setAttribute("aria-label", "Dominic Ryan");

  if (isMobile) {

    /* MOBILE — TRANSPARENT APNG */

    const logo = document.createElement("img");

    logo.src = "dr-reveal-ivory-mobile.apng?v=1";
    logo.alt = "Dominic Ryan";
    logo.setAttribute("fetchpriority", "high");

    intro.appendChild(logo);

  } else {

    /* DESKTOP — ORIGINAL 60FPS WEBM */

    const logo = document.createElement("video");

    logo.src = "dr-reveal-60fps-transparent-correctedd.webm";

    logo.autoplay = true;
    logo.muted = true;
    logo.playsInline = true;
    logo.preload = "auto";
    logo.loop = false;

    logo.setAttribute("aria-label", "Dominic Ryan");
    logo.setAttribute("disablepictureinpicture", "");

    intro.appendChild(logo);
  }

  document.body.appendChild(intro);

  /* =========================================================
     ANIMATION TIMING
     ========================================================= */

  // Begin fading after the animation finishes.
  window.setTimeout(() => {
    intro.classList.add("is-finished");
  }, 2550);

  // Remove the overlay after the fade.
  window.setTimeout(() => {
    intro.remove();
    style.remove();
  }, 3350);

})();
