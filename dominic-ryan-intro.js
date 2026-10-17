/* =========================================================
   DOMINIC RYAN — BRANDED INTRODUCTION
   ========================================================= */

(() => {
  "use strict";

  // Display once per browsing session.
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

      background: #9D8875;

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

      width: min(65vw, 360px);
      height: auto;

      object-fit: contain;

      /* Warm ivory monogram — #F0EBE3 */
      filter: brightness(0) saturate(100%) invert(94%) sepia(5%) saturate(271%) hue-rotate(332deg) brightness(102%) contrast(91%);
    }

    /* MOBILE */

    @media (max-width: 760px) {
      .dr-intro img {
        width: min(75vw, 290px);
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

  intro.setAttribute(
    "aria-label",
    "Dominic Ryan"
  );

  const logo = document.createElement("img");

  logo.src = "dr-reveal-entrance.gif";

  logo.alt = "Dominic Ryan";

  logo.setAttribute(
    "fetchpriority",
    "high"
  );

  intro.appendChild(logo);

  document.body.appendChild(intro);

  /* =========================================================
     ANIMATION TIMING
     ========================================================= */

  // Allow the 2.55-second GIF to finish.
  window.setTimeout(() => {

    intro.classList.add(
      "is-finished"
    );

  }, 2550);

  // Remove the introduction after the 0.8-second fade.
  window.setTimeout(() => {

    intro.remove();

    style.remove();

  }, 3350);

})();
