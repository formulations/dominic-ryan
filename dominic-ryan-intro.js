/* =========================================================
   DOMINIC RYAN — BRANDED INTRODUCTION
   APNG VERSION — DESKTOP + MOBILE
   ========================================================= */

(() => {
  "use strict";

  /* =========================================================
     INTRODUCTION CONTROL
     ========================================================= */

  // The homepage determines whether the introduction
  // should play based on how the visitor arrived.

  if (window.drPlayHomeIntro !== true) {
    return;
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
        transform: translate(15px, -15px);
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

  // Request a fresh animation for each eligible arrival.
  // This prevents a cached completed animation from
  // being reused instead of playing from the beginning.

  logo.src =
    "dr-reveal-ivory-mobile.apng?v=1&arrival=" +
    Date.now();

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
