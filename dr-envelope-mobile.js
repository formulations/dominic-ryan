/* =========================================================
   DOMINIC RYAN — MOBILE CORRESPONDENCE
   VERSION 7

   Designed for index3.html

   FEATURES:
   - Mobile only (760px and below)
   - Existing website header preserved
   - Existing navigation preserved
   - Ivory envelope with champagne wax seal
   - Existing DR monogram
   - Stationery concealed before opening
   - Graceful envelope opening
   - Continuous transition into actual letter
   - Bouncing instructional arrow
   - Session-based opening memory
   - Desktop unaffected

   EXISTING GITHUB ASSETS:
   /dr-reveals-removebg-preview.png

   REQUIRED HTML ELEMENTS:
   .hero-composition
   .paper
   .paper-content
   ========================================================= */

(() => {
  "use strict";

  /* =======================================================
     MOBILE DETECTION
     ======================================================= */

  const mq = window.matchMedia("(max-width: 760px)");

  if (!mq.matches) {
    return;
  }

  /* =======================================================
     EXISTING WEBSITE ELEMENTS
     ======================================================= */

  const paper = document.querySelector(".paper");

  const hero = document.querySelector(".hero-composition");

  if (!paper || !hero) {
    return;
  }

  if (document.getElementById("dr-envelope-inline")) {
    return;
  }

  /* =======================================================
     SESSION CONTROL
     ======================================================= */

  const KEY = "dr-envelope-v7-opened";

  const replay = new URLSearchParams(
    window.location.search
  ).has("replay");

  let visited = false;

  try {
    visited =
      sessionStorage.getItem(KEY) === "yes" &&
      !replay;
  } catch (_) {}

  /* Returning visitors see the actual letter. */

  if (visited) {
    paper.classList.add(
      "mobile-paper-visible",
      "dr-letter-revealed"
    );

    return;
  }

  /* =======================================================
     ENVELOPE STYLING
     ======================================================= */

  const style = document.createElement("style");

  style.id = "dr-envelope-inline-style";

  style.textContent = `

    @media (max-width: 760px) {

      /* =====================================================
         TEMPORARY SCROLL LOCK
         ===================================================== */

      html.dr-envelope-active,
      body.dr-envelope-active {
        overflow: hidden !important;
        overscroll-behavior: none !important;
      }

      /* =====================================================
         EXISTING PAGE COORDINATION
         ===================================================== */

      .hero-composition {
        position: relative;
      }

      .paper.dr-envelope-waiting {
        opacity: 0 !important;
        visibility: hidden !important;
        animation: none !important;
        transition: none !important;
      }

      .paper.dr-envelope-waiting .paper-content {
        opacity: 0 !important;
        animation: none !important;
      }

      .paper.dr-letter-revealed {
        opacity: 1 !important;
        visibility: visible !important;
        animation: none !important;

        transition:
          opacity 0.65s ease,
          box-shadow 0.65s ease !important;
      }

      .paper.dr-letter-revealed .paper-content {
        opacity: 1 !important;
        animation: none !important;
      }

      /* =====================================================
         ENVELOPE PRESENTATION
         ===================================================== */

      #dr-envelope-inline {
        position: absolute;

        top: 0;
        left: 50%;

        transform: translateX(-50%);

        width: min(94vw, 520px);

        min-height: clamp(
          410px,
          calc(100svh - 205px),
          640px
        );

        padding:
          clamp(24px, 4vh, 38px)
          16px
          clamp(25px, 4vh, 38px);

        border:
          1px solid rgba(172, 150, 128, 0.28);

        border-radius: 8px;

        background:
          linear-gradient(
            160deg,
            #f4efe6,
            #f1eae0
          );

        box-shadow:
          0 16px 42px
          rgba(78, 63, 49, 0.055);

        display: flex;
        flex-direction: column;

        align-items: center;
        justify-content: space-between;

        z-index: 8;

        isolation: isolate;

        opacity: 1;

        transition:
          opacity 0.72s ease,
          transform 0.72s ease;
      }

      /* =====================================================
         EDITORIAL HEADING
         ===================================================== */

      #dr-envelope-inline .dr-envelope-heading {
        font-family:
          "DR Avenir Next",
          "Avenir Next",
          sans-serif;

        font-size: 12px;
        font-weight: 500;

        line-height: 1.4;

        letter-spacing: 0.19em;

        color: #74645a;

        text-align: center;
      }

      /* =====================================================
         ENVELOPE SCENE
         ===================================================== */

      #dr-envelope-inline .dr-envelope-scene {
        position: relative;

        width: min(100%, 410px);

        aspect-ratio: 1.48;

        flex: none;

        perspective: 1000px;

        transform: translateY(0);

        transition:
          transform 1s
          cubic-bezier(.2, .7, .2, 1);
      }

      /* =====================================================
         ENVELOPE BACK
         ===================================================== */

      #dr-envelope-inline .dr-env-back {
        position: absolute;

        inset: 0;

        background: #eae2d7;

        border: 1px solid #d8cbbd;

        box-shadow:
          0 12px 25px
          rgba(80, 60, 45, 0.08);

        z-index: 1;
      }

      /* =====================================================
         CONCEALED STATIONERY
         ===================================================== */

      #dr-envelope-inline .dr-env-sheet {
        position: absolute;

        left: 7%;
        right: 7%;

        top: 19%;

        height: 76%;

        z-index: 2;

        background: #fbf8f2;

        border:
          1px solid #e7ded2;

        box-shadow:
          0 3px 10px
          rgba(80, 60, 45, 0.06);

        /* Completely concealed initially */

        opacity: 0;

        transform: translateY(14%);

        transition:
          transform 1.1s
          cubic-bezier(.2, .7, .18, 1),
          opacity 0.28s ease;

        display: flex;

        align-items: flex-start;
        justify-content: center;

        padding-top: 20px;

        font-family:
          "DR Avenir Next",
          sans-serif;

        font-size: 9px;
        font-weight: 500;

        letter-spacing: 0.15em;

        color: #998a7c;
      }

      /* =====================================================
         ENVELOPE SIDE FOLDS
         ===================================================== */

      #dr-envelope-inline .dr-env-fold-left,
      #dr-envelope-inline .dr-env-fold-right {
        position: absolute;

        inset: 0;

        z-index: 3;

        pointer-events: none;
      }

      #dr-envelope-inline .dr-env-fold-left {
        background: #f0e9df;

        clip-path:
          polygon(
            0 0,
            50% 50%,
            0 100%
          );
      }

      #dr-envelope-inline .dr-env-fold-right {
        background: #eee6dc;

        clip-path:
          polygon(
            100% 0,
            50% 50%,
            100% 100%
          );
      }

      /* =====================================================
         FRONT ENVELOPE POCKET
         ===================================================== */

      #dr-envelope-inline .dr-env-front {
        position: absolute;

        inset: 0;

        z-index: 4;

        background:
          linear-gradient(
            180deg,
            #f8f3eb,
            #eee6db
          );

        clip-path:
          polygon(
            0 100%,
            50% 43%,
            100% 100%
          );

        border-bottom:
          1px solid #d8cbbd;

        pointer-events: none;
      }

      /* =====================================================
         TOP ENVELOPE FLAP
         ===================================================== */

      #dr-envelope-inline .dr-env-flap {
        position: absolute;

        inset: 0;

        z-index: 6;

        background:
          linear-gradient(
            180deg,
            #faf6ef,
            #eee6dc
          );

        clip-path:
          polygon(
            0 0,
            100% 0,
            50% 55%
          );

        transform-origin: 50% 0;

        backface-visibility: hidden;

        transition:
          transform 0.85s
          cubic-bezier(.25, .7, .25, 1);

        pointer-events: none;
      }

      /* =====================================================
         INTERACTIVE WAX SEAL
         ===================================================== */

      #dr-envelope-inline .dr-env-seal {
        position: absolute;

        left: 50%;
        top: 50%;

        z-index: 8;

        transform:
          translate(-50%, -50%);

        width:
          clamp(76px, 21vw, 98px);

        height:
          clamp(76px, 21vw, 98px);

        border: 0;

        background: transparent;

        padding: 0;

        cursor: pointer;

        touch-action: manipulation;

        transition:
          opacity 0.28s ease,
          transform 0.35s ease;
      }

      /* =====================================================
         CHAMPAGNE WAX MATERIAL
         ===================================================== */

      #dr-envelope-inline .dr-env-wax {
        position: absolute;

        inset: 0;

        border-radius:
          48% 52% 49% 51% /
          52% 47% 53% 48%;

        background:
          radial-gradient(
            circle at 32% 23%,
            #f7e8cf,
            #e0c6a2 52%,
            #bf986d 100%
          );

        box-shadow:
          0 7px 12px
          rgba(103, 77, 55, 0.22),

          inset 0 2px 2px
          #fff4dc,

          inset 0 -3px 5px
          rgba(106, 76, 48, 0.16);
      }

      /* Inner embossed wax border */

      #dr-envelope-inline .dr-env-wax::before {
        content: "";

        position: absolute;

        inset: 9%;

        border:
          2px solid rgba(
            255, 247, 229, 0.85
          );

        border-radius: 50%;

        box-shadow:
          0 0 0 3px
          rgba(156, 119, 78, 0.14);
      }

      #dr-envelope-inline .dr-env-wax::after {
        content: "";

        position: absolute;

        inset: 17%;

        border:
          1px solid rgba(
            142, 107, 75, 0.28
          );

        border-radius: 50%;
      }

      /* =====================================================
         DR MONOGRAM
         ===================================================== */

      #dr-envelope-inline .dr-env-seal img {
        position: absolute;

        left: 50%;
        top: 50%;

        width: 68%;
        height: 68%;

        object-fit: contain;

        transform:
          translate(-50%, -50%);

        opacity: 0.76;

        filter:
          sepia(0.6)
          saturate(0.5)
          brightness(0.85);

        pointer-events: none;
      }

      /* =====================================================
         INSTRUCTION
         ===================================================== */

      #dr-envelope-inline .dr-env-prompt {
        display: flex;

        flex-direction: column;

        align-items: center;

        gap: 9px;

        color: #88786c;

        font-family:
          "DR Avenir Next",
          "Avenir Next",
          sans-serif;

        font-size:
          clamp(10px, 2.9vw, 12px);

        font-weight: 500;

        line-height: 1.4;

        letter-spacing: 0.15em;

        text-align: center;

        transition:
          opacity 0.3s ease;
      }

      /* Bouncing arrow */

      #dr-envelope-inline .dr-env-arrow {
        font-family:
          Georgia,
          serif;

        font-size: 30px;

        font-weight: 400;

        line-height: 1;

        animation:
          drEnvBounce
          1.45s
          ease-in-out
          infinite;
      }

      @keyframes drEnvBounce {

        0%,
        100% {
          transform:
            translateY(5px);
        }

        50% {
          transform:
            translateY(-5px);
        }

      }

      /* =====================================================
         OPENING SEQUENCE
         ===================================================== */

      /* Wax seal releases */

      #dr-envelope-inline.dr-opening .dr-env-seal {
        opacity: 0;

        transform:
          translate(-50%, -64%)
          scale(0.92);

        pointer-events: none;
      }

      /* Flap opens */

      #dr-envelope-inline.dr-opening .dr-env-flap {
        transform:
          rotateX(178deg);
      }

      /* Stationery emerges */

      #dr-envelope-inline.dr-opening .dr-env-sheet {
        opacity: 1;

        transform:
          translateY(-75%);

        transition-delay:
          0.38s,
          0.32s;
      }

      /* Instruction disappears */

      #dr-envelope-inline.dr-opening .dr-env-prompt {
        opacity: 0;
      }

      /* Envelope dissolves into the actual letter */

      #dr-envelope-inline.dr-handoff {
        opacity: 0;

        pointer-events: none;

        transform:
          translate(-50%, -10px);
      }

      /* =====================================================
         ACCESSIBILITY
         ===================================================== */

      #dr-envelope-inline .dr-env-seal:focus-visible {
        outline:
          2px solid #88786c;

        outline-offset: 5px;

        border-radius: 50%;
      }

      /* =====================================================
         SMALL MOBILE SCREENS
         ===================================================== */

      @media (max-height: 650px) {

        #dr-envelope-inline {
          min-height: 410px;

          padding:
            18px 16px;
        }

        #dr-envelope-inline .dr-envelope-scene {
          width:
            min(100%, 290px);
        }

      }

      /* =====================================================
         REDUCED MOTION
         ===================================================== */

      @media (prefers-reduced-motion: reduce) {

        #dr-envelope-inline *,
        #dr-envelope-inline {
          animation-duration:
            0.01ms !important;

          transition-duration:
            0.01ms !important;
        }

      }

    }

  `;

  document.head.appendChild(style);

  /* =======================================================
     PREPARE ACTUAL PERSONAL LETTER
     ======================================================= */

  paper.classList.add("dr-envelope-waiting");

  /* =======================================================
     CREATE ENVELOPE
     ======================================================= */

  const wrap = document.createElement("section");

  wrap.id = "dr-envelope-inline";

  wrap.setAttribute(
    "aria-label",
    "Open a personal message"
  );

  wrap.innerHTML = `

    <div class="dr-envelope-heading">
      A PERSONAL MESSAGE
    </div>

    <div class="dr-envelope-scene">

      <div
        class="dr-env-back"
        aria-hidden="true"
      ></div>

      <div
        class="dr-env-sheet"
        aria-hidden="true"
      >
        A PERSONAL MESSAGE
      </div>

      <div
        class="dr-env-fold-left"
        aria-hidden="true"
      ></div>

      <div
        class="dr-env-fold-right"
        aria-hidden="true"
      ></div>

      <div
        class="dr-env-front"
        aria-hidden="true"
      ></div>

      <div
        class="dr-env-flap"
        aria-hidden="true"
      ></div>

      <button
        class="dr-env-seal"
        type="button"
        aria-label="Tap the seal to open"
      >

        <span
          class="dr-env-wax"
          aria-hidden="true"
        ></span>

        <img
          src="/dr-reveals-removebg-preview.png"
          alt=""
          aria-hidden="true"
        >

      </button>

    </div>

    <div class="dr-env-prompt">

      <span
        class="dr-env-arrow"
        aria-hidden="true"
      >
        ↑
      </span>

      <span>
        TAP THE SEAL TO OPEN
      </span>

    </div>

  `;

  hero.insertBefore(wrap, paper);

  /* =======================================================
     LOCK SCROLL DURING ENVELOPE
     ======================================================= */

  document.documentElement.classList.add(
    "dr-envelope-active"
  );

  document.body.classList.add(
    "dr-envelope-active"
  );

  /* =======================================================
     ANIMATION STATE
     ======================================================= */

  let opened = false;

  const timers = [];

  const later = (fn, delay) => {
    timers.push(
      window.setTimeout(fn, delay)
    );
  };

  /* =======================================================
     UNLOCK VIEWPORT
     ======================================================= */

  const unlock = () => {

    document.documentElement.classList.remove(
      "dr-envelope-active"
    );

    document.body.classList.remove(
      "dr-envelope-active"
    );

  };

  /* =======================================================
     REVEAL ACTUAL PERSONAL MESSAGE
     ======================================================= */

  const reveal = () => {

    paper.classList.remove(
      "dr-envelope-waiting"
    );

    paper.classList.add(
      "mobile-paper-visible",
      "dr-letter-revealed"
    );

    if (
      typeof window.drEnvelopeRevealLetter === "function"
    ) {
      window.drEnvelopeRevealLetter();
    }

  };

  /* =======================================================
     SEAL INTERACTION
     ======================================================= */

  const sealButton =
    wrap.querySelector(".dr-env-seal");

  sealButton.addEventListener(
    "click",
    () => {

      if (opened) {
        return;
      }

      opened = true;

      sealButton.disabled = true;

      /* Begin envelope opening */

      wrap.classList.add(
        "dr-opening"
      );

      /* Remember successful interaction */

      try {
        sessionStorage.setItem(
          KEY,
          "yes"
        );
      } catch (_) {}

      /* Reveal actual letter beneath envelope */

      later(() => {

        reveal();

        wrap.classList.add(
          "dr-handoff"
        );

      }, 1580);

      /* Remove envelope after transition */

      later(() => {

        wrap.remove();

        unlock();

      }, 2330);

    }
  );

  /* =======================================================
     HANDLE DESKTOP RESIZING
     ======================================================= */

  mq.addEventListener(
    "change",
    event => {

      if (!event.matches) {

        timers.forEach(
          clearTimeout
        );

        wrap.remove();

        unlock();

        paper.classList.remove(
          "dr-envelope-waiting"
        );

      }

    }
  );

})();
