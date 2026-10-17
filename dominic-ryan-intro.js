/* =========================================================
   DOMINIC RYAN — BRANDED INTRODUCTION
   APNG VERSION — DESKTOP + MOBILE
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

    .dr-intro img {
      display: block;

      width: min(40vw, 150px);
      height: auto;

      object-fit: contain;
      background: transparent;

      pointer-events: none;
    }

    /* MOBILE */

    @media (max-width: 760px) {
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

  /* =========================================================
     APNG — ALL DEVICES
     ========================================================= */

  const logo = document.createElement("img");

  logo.src = "dr-reveal-ivory-mobile.apng?v=1";
  logo.alt = "Dominic Ryan";
  logo.setAttribute("fetchpriority", "high");

  intro.appendChild(logo);

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
