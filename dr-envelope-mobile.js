/* =========================================================
   DOMINIC RYAN — MOBILE CORRESPONDENCE
   VERSION 9 — DESIGN REFINEMENT / TESTING

   PURPOSE
   - Refined mobile envelope experience
   - Appears on EVERY page refresh during testing
   - No sessionStorage or localStorage
   - Preserves existing website header and navigation
   - Transitions into the actual personal message
   - Desktop remains unchanged

   GITHUB ASSETS
   - /dr-reveals-removebg-preview.png

   EXISTING PAGE ELEMENTS
   - .hero-composition
   - .paper
   - .paper-content
   ========================================================= */

(() => {
  "use strict";

  /* =======================================================
     1. MOBILE DETECTION
     ======================================================= */

  const mobileQuery = window.matchMedia(
    "(max-width: 760px)"
  );

  if (!mobileQuery.matches) {
    return;
  }

  /* =======================================================
     2. EXISTING WEBSITE ELEMENTS
     ======================================================= */

  const hero = document.querySelector(
    ".hero-composition"
  );

  const paper = document.querySelector(
    ".hero-composition > .paper"
  );

  if (!hero || !paper) {
    return;
  }

  if (
    document.getElementById(
      "dr-envelope-inline"
    )
  ) {
    return;
  }

  /* =======================================================
     3. CONFIGURATION
     ======================================================= */

  const CONFIG = {

    /* Testing mode: show envelope on every refresh. */

    alwaysShowEnvelope: true,

    /* Existing GitHub monogram asset. */

    monogram:
      "/dr-reveals-removebg-preview.png",

    /* Opening animation timing. */

    letterRevealDelay: 1750,

    envelopeRemovalDelay: 2600

  };

  /* =======================================================
     4. CREATE STYLES
     ======================================================= */

  const style = document.createElement("style");

  style.id = "dr-envelope-mobile-styles";

  style.textContent = `

    /* =====================================================
       MOBILE ONLY
       ===================================================== */

    @media (max-width: 760px) {

      /* ===================================================
         HERO COORDINATION
         =================================================== */

      .hero-composition {
        position: relative;
      }

      /* Hide original letter while envelope is displayed. */

      .hero-composition > .paper.dr-envelope-waiting {
        opacity: 0 !important;
        visibility: hidden !important;

        animation: none !important;
        transition: none !important;
      }

      .hero-composition
      > .paper.dr-envelope-waiting
      .paper-content {
        opacity: 0 !important;
        animation: none !important;
      }

      /* Reveal original letter during envelope handoff. */

      .hero-composition > .paper.dr-letter-revealed {
        opacity: 1 !important;
        visibility: visible !important;

        animation: none !important;

        transition:
          opacity 0.85s
          cubic-bezier(.22, .61, .36, 1),
          box-shadow 0.85s
          cubic-bezier(.22, .61, .36, 1)
          !important;
      }

      .hero-composition
      > .paper.dr-letter-revealed
      .paper-content {
        opacity: 1 !important;
        animation: none !important;
      }

      /* ===================================================
         ENVELOPE PRESENTATION CARD
         =================================================== */

      #dr-envelope-inline {
        position: absolute;

        top: 0;
        left: 50%;

        transform: translateX(-50%);

        width: min(94vw, 520px);

        height: auto;
        min-height: 0;

        padding:
          clamp(29px, 5vw, 40px)
          clamp(14px, 3.5vw, 20px)
          clamp(27px, 5vw, 38px);

        display: flex;
        flex-direction: column;

        align-items: center;

        gap: 0;

        border:
          1px solid rgba(
            172, 150, 128, 0.28
          );

        border-radius: 9px;

        background:
          linear-gradient(
            160deg,
            #f4efe6 0%,
            #f1eae0 100%
          );

        box-shadow:
          0 16px 42px
          rgba(78, 63, 49, 0.055);

        isolation: isolate;

        z-index: 8;

        opacity: 1;

        transition:
          opacity 0.85s
          cubic-bezier(.22, .61, .36, 1),
          transform 0.85s
          cubic-bezier(.22, .61, .36, 1);
      }

      /* ===================================================
         EDITORIAL HEADING
         =================================================== */

      #dr-envelope-inline .dr-envelope-heading {
        margin: 0;

        font-family:
          "DR Avenir Next",
          "Avenir Next",
          Arial,
          sans-serif;

        font-size:
          clamp(11px, 3vw, 13px);

        font-weight: 500;

        line-height: 1.4;

        letter-spacing: 0.19em;

        color: #74645a;

        text-align: center;
      }

      /* ===================================================
         ENVELOPE SCENE
         =================================================== */

      #dr-envelope-inline .dr-envelope-scene {
        position: relative;

        width: min(100%, 410px);

        aspect-ratio: 1.65 / 1;

        flex: none;

        margin-top:
          clamp(44px, 8vw, 66px);

        perspective: 1100px;

        transform: translateY(0);

        transition:
          transform 1.1s
          cubic-bezier(.22, .61, .36, 1);
      }

      /* ===================================================
         ENVELOPE BACK
         =================================================== */

      #dr-envelope-inline .dr-env-back {
        position: absolute;
        inset: 0;

        background:
          linear-gradient(
            180deg,
            #ece5dc,
            #e5dbcf
          );

        border:
          1px solid #d8cbbd;

        box-shadow:
          0 12px 25px
          rgba(80, 60, 45, 0.08);

        z-index: 1;
      }

      /* ===================================================
         STATIONERY — CONCEALED INITIALLY
         =================================================== */

      #dr-envelope-inline .dr-env-sheet {
        position: absolute;

        left: 7%;
        right: 7%;

        top: 17%;

        height: 77%;

        z-index: 2;

        background: #fbf8f2;

        border:
          1px solid #e7ded2;

        box-shadow:
          0 3px 10px
          rgba(80, 60, 45, 0.06);

        opacity: 0;

        transform:
          translateY(12%);

        transition:
          transform 1.25s
          cubic-bezier(.22, .61, .36, 1),
          opacity 0.25s ease;

        display: flex;

        align-items: flex-start;
        justify-content: center;

        padding-top: 20px;

        font-family:
          "DR Avenir Next",
          Arial,
          sans-serif;

        font-size: 9px;

        font-weight: 500;

        letter-spacing: 0.15em;

        color: #998a7c;
      }

      /* ===================================================
         SIDE FOLDS
         =================================================== */

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

      /* ===================================================
         FRONT POCKET
         =================================================== */

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

      /* ===================================================
         TOP FLAP
         =================================================== */

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
          transform 0.9s
          cubic-bezier(.22, .61, .36, 1);

        pointer-events: none;
      }

      /* ===================================================
         WAX SEAL
         =================================================== */

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

        padding: 0;

        border: 0;

        background: transparent;

        cursor: pointer;

        touch-action: manipulation;

        -webkit-tap-highlight-color:
          transparent;

        transition:
          opacity 0.3s ease,
          transform 0.4s ease;
      }

      /* ===================================================
         CHAMPAGNE WAX MATERIAL
         =================================================== */

      #dr-envelope-inline .dr-env-wax {
        position: absolute;
        inset: 0;

        border-radius:
          48% 52% 49% 51% /
          52% 47% 53% 48%;

        background:
          radial-gradient(
            circle at 32% 23%,
            #f7e8cf 0%,
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

      #dr-envelope-inline .dr-env-wax::before {
        content: "";

        position: absolute;

        inset: 9%;

        border:
          2px solid
          rgba(255, 247, 229, 0.85);

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
          1px solid
          rgba(142, 107, 75, 0.28);

        border-radius: 50%;
      }

      /* ===================================================
         DR MONOGRAM — OPTICALLY REFINED
         =================================================== */

      #dr-envelope-inline .dr-env-seal img {
        position: absolute;

        left: 49%;
        top: 48%;

        width: 59%;
        height: 59%;

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

      /* ===================================================
         INSTRUCTION
         =================================================== */

      #dr-envelope-inline .dr-env-prompt {
        display: flex;
        flex-direction: column;

        align-items: center;

        gap: 7px;

        margin-top:
          clamp(31px, 6vw, 43px);

        font-family:
          "DR Avenir Next",
          "Avenir Next",
          Arial,
          sans-serif;

        font-size:
          clamp(10px, 2.9vw, 12px);

        font-weight: 500;

        line-height: 1.4;

        letter-spacing: 0.15em;

        text-align: center;

        color: #88786c;

        transition:
          opacity 0.3s ease;
      }

      /* ===================================================
         BOUNCING ARROW
         =================================================== */

      #dr-envelope-inline .dr-env-arrow {
        display: block;

        font-family:
          Georgia,
          serif;

        font-size: 27px;

        font-weight: 400;

        line-height: 1;

        animation:
          drEnvBounce
          1.6s
          ease-in-out
          infinite;
      }

      @keyframes drEnvBounce {

        0%,
        100% {
          transform:
            translateY(3px);
        }

        50% {
          transform:
            translateY(-3px);
        }

      }

      /* ===================================================
         OPENING — SEAL RELEASE
         =================================================== */

      #dr-envelope-inline.dr-opening .dr-env-seal {
        opacity: 0;

        transform:
          translate(-50%, -64%)
          scale(0.92);

        pointer-events: none;
      }

      /* ===================================================
         OPENING — FLAP
         =================================================== */

      #dr-envelope-inline.dr-opening .dr-env-flap {
        transform:
          rotateX(178deg);
      }

      /* ===================================================
         OPENING — STATIONERY
         =================================================== */

      #dr-envelope-inline.dr-opening .dr-env-sheet {
        opacity: 1;

        transform:
          translateY(-78%);

        transition-delay:
          0.42s,
          0.36s;
      }

      /* ===================================================
         OPENING — INSTRUCTION
         =================================================== */

      #dr-envelope-inline.dr-opening .dr-env-prompt {
        opacity: 0;
      }

      /* ===================================================
         HANDOFF TO ACTUAL PERSONAL MESSAGE
         =================================================== */

      #dr-envelope-inline.dr-handoff {
        opacity: 0;

        pointer-events: none;

        transform:
          translate(-50%, -8px);
      }

      /* ===================================================
         ACCESSIBILITY
         =================================================== */

      #dr-envelope-inline .dr-env-seal:focus-visible {
        outline:
          2px solid #88786c;

        outline-offset: 5px;

        border-radius: 50%;
      }

      /* ===================================================
         SMALL MOBILE SCREENS
         =================================================== */

      @media (max-height: 650px) {

        #dr-envelope-inline {
          padding:
            24px 14px 26px;
        }

        #dr-envelope-inline .dr-envelope-scene {
          margin-top: 38px;
        }

        #dr-envelope-inline .dr-env-prompt {
          margin-top: 27px;
        }

      }

      /* ===================================================
         REDUCED MOTION
         =================================================== */

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
     5. PREPARE ORIGINAL PERSONAL MESSAGE
     ======================================================= */

  paper.classList.add(
    "dr-envelope-waiting"
  );

  /* =======================================================
     6. CREATE ENVELOPE
     ======================================================= */

  const envelope = document.createElement(
    "section"
  );

  envelope.id = "dr-envelope-inline";

  envelope.setAttribute(
    "aria-label",
    "Open a personal message"
  );

  envelope.innerHTML = `

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
          src="${CONFIG.monogram}"
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

  hero.insertBefore(
    envelope,
    paper
  );

  /* =======================================================
     7. OPENING STATE
     ======================================================= */

  let opened = false;

  const timers = [];

  const later = (callback, delay) => {
    timers.push(
      window.setTimeout(
        callback,
        delay
      )
    );
  };

  /* =======================================================
     8. REVEAL ORIGINAL LETTER
     ======================================================= */

  const revealLetter = () => {

    paper.classList.remove(
      "dr-envelope-waiting"
    );

    paper.classList.add(
      "mobile-paper-visible",
      "dr-letter-revealed"
    );

    if (
      typeof window.drEnvelopeRevealLetter ===
      "function"
    ) {
      window.drEnvelopeRevealLetter();
    }

  };

  /* =======================================================
     9. SEAL INTERACTION
     ======================================================= */

  const seal = envelope.querySelector(
    ".dr-env-seal"
  );

  seal.addEventListener(
    "click",
    () => {

      if (opened) {
        return;
      }

      opened = true;

      seal.disabled = true;

      /* Start the envelope animation. */

      envelope.classList.add(
        "dr-opening"
      );

      /*
         No sessionStorage is used.

         During testing, the envelope will
         appear again on every page refresh.
      */

      /* Reveal the existing personal message. */

      later(
        () => {

          revealLetter();

          envelope.classList.add(
            "dr-handoff"
          );

        },
        CONFIG.letterRevealDelay
      );

      /* Remove the envelope after the fade. */

      later(
        () => {

          envelope.remove();

        },
        CONFIG.envelopeRemovalDelay
      );

    }
  );

  /* =======================================================
     10. HANDLE DESKTOP RESIZING
     ======================================================= */

  const handleViewportChange = (event) => {

    if (event.matches) {
      return;
    }

    timers.forEach(
      window.clearTimeout
    );

    envelope.remove();

    paper.classList.remove(
      "dr-envelope-waiting"
    );

    paper.classList.add(
      "mobile-paper-visible"
    );

  };

  if (
    typeof mobileQuery.addEventListener ===
    "function"
  ) {

    mobileQuery.addEventListener(
      "change",
      handleViewportChange
    );

  } else {

    mobileQuery.addListener(
      handleViewportChange
    );

  }

})();
