/* =========================================================
   DOMINIC RYAN — MOBILE CORRESPONDENCE EXPERIENCE
   FINAL REFINED VERSION

   Designed for:
   Dominic Ryan | A Personal Message

   MOBILE ONLY — 760px AND BELOW

   FEATURES
   ---------------------------------------------------------
   01. Original website header/navigation preserved
   02. Full-height editorial presentation
   03. Layered ivory presentation background
   04. Original envelope proportions and folded appearance
   05. Champagne wax seal with illuminated DR monogram
   06. Properly scaled and centered monogram
   07. EB Garamond italic invitation
   08. Original DR Avenir Next typography
   09. Animated letter derived from actual letter content
   10. Letter rises naturally from envelope
   11. Envelope masks the lower portion during extraction
   12. Continuous transition to original HTML letter
   13. No automatic scrolling during opening
   14. Background content hidden until opening completes
   15. Scrolling disabled until opening completes
   16. Envelope reappears on every page refresh
   17. Desktop experience unaffected

   REQUIRED EXISTING ASSETS
   ---------------------------------------------------------
   /dr-envelope-logo.png

   /AvenirNext-Regular.woff2
   /AvenirNext-Medium.woff2
   /AvenirNext-DemiBold.woff2

   /eb-garamond-latin-400-italic.woff2

   ========================================================= */

(() => {
  "use strict";

  /* =========================================================
     MOBILE DETECTION
     ========================================================= */

  const mobileQuery = window.matchMedia(
    "(max-width: 760px)"
  );

  if (!mobileQuery.matches) {
    return;
  }

  /* =========================================================
     PREVENT DUPLICATE INITIALIZATION
     ========================================================= */

  if (
    document.getElementById("dr-envelope-experience")
  ) {
    return;
  }

  /* =========================================================
     ORIGINAL WEBSITE ELEMENTS
     ========================================================= */

  const hero = document.querySelector(
    ".hero-composition"
  );

  const originalPaper = document.querySelector(
    ".hero-composition > .paper"
  );

  const photoStage = document.querySelector(
    ".hero-composition > .photo-stage"
  );

  const instagramSection = document.querySelector(
    ".formulations-feed"
  );

  const footer = document.querySelector(
    ".dr-unified-footer"
  );

  const backToTop = document.getElementById(
    "dr-back-to-top"
  );

  if (!hero || !originalPaper) {
    return;
  }

  /* =========================================================
     CONFIGURATION
     ========================================================= */

  const CONFIG = {

    monogram:
      "/dr-envelope-logo.png",

    invitationFont:
      "/eb-garamond-latin-400-italic.woff2",

    openingDuration:
      1050,

    letterRiseDuration:
      1750,

    handoffDuration:
      900,

    monogramScale:
      0.64

  };

  /* =========================================================
     STATE
     ========================================================= */

  let opened = false;

  let completed = false;

  let animationTimers = [];

  let originalScrollY = window.scrollY;

  const originalBodyOverflow =
    document.body.style.overflow;

  const originalHtmlOverflow =
    document.documentElement.style.overflow;

  const originalBodyTouchAction =
    document.body.style.touchAction;

  /* =========================================================
     FONT DEFINITIONS
     ========================================================= */

  const style = document.createElement("style");

  style.id = "dr-envelope-mobile-styles";

  style.textContent = `

    /* =====================================================
       EXACT WEBSITE FONTS
       ===================================================== */

    @font-face {
      font-family: "DR Envelope Avenir";
      src: url("/AvenirNext-Regular.woff2")
        format("woff2");
      font-style: normal;
      font-weight: 400;
      font-display: swap;
    }

    @font-face {
      font-family: "DR Envelope Avenir";
      src: url("/AvenirNext-Medium.woff2")
        format("woff2");
      font-style: normal;
      font-weight: 500;
      font-display: swap;
    }

    @font-face {
      font-family: "DR Envelope Avenir";
      src: url("/AvenirNext-DemiBold.woff2")
        format("woff2");
      font-style: normal;
      font-weight: 600 900;
      font-display: swap;
    }

    @font-face {
      font-family: "DR Envelope Garamond";
      src: url("${CONFIG.invitationFont}")
        format("woff2");
      font-style: italic;
      font-weight: 400;
      font-display: swap;
    }

    /* =====================================================
       MOBILE EXPERIENCE ONLY
       ===================================================== */

    @media (max-width: 760px) {

      /* ===================================================
         PAGE LOCK
         =================================================== */

      html.dr-envelope-locked,
      body.dr-envelope-locked {
        overflow: hidden !important;
        overscroll-behavior: none !important;
      }

      body.dr-envelope-locked {
        touch-action: none;
      }

      /* ===================================================
         HIDE SECONDARY WEBSITE CONTENT
         =================================================== */

      body.dr-envelope-active .photo-stage,
      body.dr-envelope-active .formulations-feed,
      body.dr-envelope-active .dr-unified-footer,
      body.dr-envelope-active .dr-back-to-top {
        visibility: hidden !important;
        pointer-events: none !important;
      }

      /* ===================================================
         ORIGINAL LETTER DURING INTRODUCTION
         =================================================== */

      body.dr-envelope-active
      .hero-composition > .paper {
        opacity: 0 !important;
        visibility: hidden !important;
        pointer-events: none !important;
        animation: none !important;
        transition: none !important;
      }

      body.dr-envelope-active
      .hero-composition > .paper
      .paper-content {
        opacity: 0 !important;
        animation: none !important;
      }

      /* ===================================================
         PRESENTATION POSITIONING
         =================================================== */

      body.dr-envelope-active .letter-wrap {
        padding-top: 0 !important;
        padding-bottom: 0 !important;
      }

      body.dr-envelope-active .hero-composition {
        position: relative;
        display: block !important;
        width: 100% !important;
        min-height: 0;
        transform: none !important;
      }

      /* ===================================================
         MAIN EDITORIAL PRESENTATION

         Three layers:
         - Website background
         - Ivory presentation panel
         - Physical envelope
         =================================================== */

      #dr-envelope-experience {
        position: relative;

        width: 100%;

        min-height: calc(
          100svh - var(--dr-envelope-top, 0px)
        );

        display: flex;
        align-items: center;
        justify-content: center;

        padding:
          clamp(18px, 4vw, 28px)
          12px
          clamp(22px, 5vw, 40px);

        isolation: isolate;

        opacity: 1;

        transition:
          opacity .75s ease,
          transform .75s
            cubic-bezier(.22,.61,.36,1);
      }

      /* ===================================================
         PRESENTATION BACKGROUND
         =================================================== */

      .dr-envelope-presentation {
        position: relative;

        width: 100%;

        min-height: min(
          740px,
          calc(
            100svh -
            var(--dr-envelope-top, 0px) -
            42px
          )
        );

        display: flex;
        flex-direction: column;

        align-items: center;
        justify-content: center;

        padding:
          clamp(36px, 7vw, 58px)
          clamp(12px, 3vw, 24px)
          clamp(38px, 7vw, 58px);

        border:
          1px solid
          rgba(171, 150, 132, .32);

        border-radius: 13px;

        background:
          linear-gradient(
            155deg,
            #f8f5f0 0%,
            #f4efe8 48%,
            #f1ebe3 100%
          );

        box-shadow:
          0 18px 50px
            rgba(74, 60, 48, .065),
          0 2px 9px
            rgba(74, 60, 48, .025);

        overflow: hidden;
      }

      /* Subtle illuminated paper surface */

      .dr-envelope-presentation::before {
        content: "";

        position: absolute;

        inset: 0;

        pointer-events: none;

        background:
          radial-gradient(
            ellipse at 50% 35%,
            rgba(255,255,255,.48),
            transparent 68%
          );

        z-index: 0;
      }

      /* ===================================================
         PRESENTATION TITLE
         =================================================== */

      .dr-envelope-heading {
        position: relative;
        z-index: 3;

        margin: 0 0
          clamp(42px, 8vw, 66px);

        font-family:
          "DR Envelope Avenir",
          "DR Avenir Next",
          sans-serif;

        font-size:
          clamp(11px, 2.8vw, 14px);

        font-weight: 500;

        line-height: 1.5;

        letter-spacing: .24em;

        text-transform: uppercase;

        text-align: center;

        color: #756660;
      }

      /* ===================================================
         ENVELOPE SCENE
         =================================================== */

      .dr-envelope-scene {
        position: relative;
        z-index: 2;

        width: min(100%, 440px);

        aspect-ratio: 1.65 / 1;

        perspective: 1200px;

        transform-style: preserve-3d;

        filter:
          drop-shadow(
            0 20px 21px
            rgba(72,57,47,.11)
          );
      }

      /* ===================================================
         ENVELOPE BACK
         =================================================== */

      .dr-envelope-back {
        position: absolute;
        inset: 0;

        z-index: 1;

        background:
          linear-gradient(
            145deg,
            #f1ede8,
            #e7dfd8
          );

        border:
          1px solid
          rgba(172,150,132,.2);
      }

      /* ===================================================
         LETTER EXTRACTION WINDOW
         =================================================== */

      .dr-envelope-letter-window {
        position: absolute;

        left: 5%;
        right: 5%;

        top: -92%;

        height: 192%;

        z-index: 2;

        overflow: hidden;

        pointer-events: none;
      }

      /* ===================================================
         ANIMATED LETTER

         Same Avenir typography as original letter.
         =================================================== */

      .dr-envelope-letter {
        position: absolute;

        left: 0;
        right: 0;

        top: 48%;

        width: 100%;

        min-height: 155%;

        padding:
          clamp(19px, 4.6vw, 30px)
          clamp(18px, 4.5vw, 31px)
          36px;

        background: #fbf8f2;

        box-shadow:
          0 7px 23px
          rgba(70,57,47,.09);

        transform:
          translateY(0);

        opacity: 0;

        transition:
          transform 1.75s
            cubic-bezier(.22,.61,.36,1),
          opacity .45s ease;

        overflow: hidden;
      }

      .dr-envelope-letter-content {
        font-family:
          "DR Envelope Avenir",
          "DR Avenir Next",
          sans-serif !important;

        font-weight: 400;

        font-style: normal;

        color: #5c524b;
      }

      .dr-envelope-letter-content
      .message-label {
        font-family:
          "DR Envelope Avenir",
          sans-serif !important;

        font-size: 10px;

        font-weight: 500;

        letter-spacing: .08em;

        line-height: 1.5;

        margin-bottom: 17px;

        color: #7a6f67;
      }

      .dr-envelope-letter-content h1 {
        font-family:
          "DR Envelope Avenir",
          sans-serif !important;

        font-size:
          clamp(15px, 3.9vw, 20px);

        font-weight: 500;

        line-height: 1.35;

        margin: 0 0 17px;

        color: #51463e;
      }

      .dr-envelope-letter-content p {
        font-family:
          "DR Envelope Avenir",
          sans-serif !important;

        font-size:
          clamp(10px, 2.7vw, 13px);

        font-weight: 400;

        line-height: 1.56;

        margin: 0 0 15px;

        color: #5c524b;
      }

      .dr-envelope-letter-content strong,
      .dr-envelope-letter-content b {
        font-family:
          "DR Envelope Avenir",
          sans-serif !important;

        font-weight: 600 !important;
      }

      .dr-envelope-letter-content em,
      .dr-envelope-letter-content i {
        font-family:
          "DR Envelope Avenir",
          sans-serif !important;

        font-style: italic;
      }

      .dr-envelope-letter-content
      .final-typewriter-text {
        opacity: 1 !important;
        filter: none !important;
        transition: none !important;
      }

      .dr-envelope-letter-content
      .final-typewriter-ornament {
        opacity: 1 !important;
      }

      .dr-envelope-letter-content
      .signature {
        opacity: 1 !important;
        transform: none !important;
        filter: none !important;
      }

      /* ===================================================
         ENVELOPE SIDE FOLDS
         =================================================== */

      .dr-envelope-fold-left {
        position: absolute;
        inset: 0;

        z-index: 4;

        background:
          linear-gradient(
            120deg,
            #eee9e4,
            #e6dfda
          );

        clip-path:
          polygon(
            0 0,
            53% 51%,
            0 100%
          );
      }

      .dr-envelope-fold-right {
        position: absolute;
        inset: 0;

        z-index: 4;

        background:
          linear-gradient(
            240deg,
            #ede8e3,
            #e5ddd7
          );

        clip-path:
          polygon(
            100% 0,
            47% 51%,
            100% 100%
          );
      }

      /* ===================================================
         ENVELOPE FRONT POCKET
         =================================================== */

      .dr-envelope-front {
        position: absolute;
        inset: 0;

        z-index: 5;

        background:
          linear-gradient(
            180deg,
            #eee9e4,
            #e7dfd9
          );

        clip-path:
          polygon(
            0 100%,
            50% 49%,
            100% 100%
          );
      }

      /* ===================================================
         ENVELOPE TOP FLAP
         =================================================== */

      .dr-envelope-flap {
        position: absolute;
        inset: 0;

        z-index: 7;

        background:
          linear-gradient(
            180deg,
            #f7f5f2,
            #e9e3dd
          );

        clip-path:
          polygon(
            0 0,
            100% 0,
            50% 52%
          );

        transform-origin:
          50% 0;

        backface-visibility:
          hidden;

        transition:
          transform 1.05s
            cubic-bezier(.22,.61,.36,1);

        filter:
          drop-shadow(
            0 2px 2px
            rgba(91,72,59,.06)
          );
      }

      /* ===================================================
         WAX SEAL
         =================================================== */

      .dr-envelope-seal {
        position: absolute;

        z-index: 9;

        left: 50%;
        top: 50%;

        width:
          clamp(80px, 21vw, 100px);

        aspect-ratio: 1;

        padding: 0;

        border: 0;
        border-radius: 50%;

        display: flex;
        align-items: center;
        justify-content: center;

        background:
          radial-gradient(
            circle at 35% 25%,
            #fff2d5 0%,
            #ead1aa 34%,
            #cda77f 73%,
            #b98c68 100%
          );

        box-shadow:
          inset 0 2px 4px
            rgba(255,255,255,.62),
          inset 0 -5px 9px
            rgba(117,77,46,.18),
          0 8px 18px
            rgba(70,48,33,.2),
          0 0 18px
            rgba(247,222,175,.28);

        transform:
          translate(-50%, -50%);

        cursor: pointer;

        -webkit-tap-highlight-color:
          transparent;

        transition:
          opacity .3s ease,
          transform .4s ease,
          box-shadow .4s ease;
      }

      .dr-envelope-seal::before {
        content: "";

        position: absolute;

        inset: 9%;

        border-radius: 50%;

        border:
          1.5px solid
          rgba(255,249,230,.9);

        box-shadow:
          0 0 0 2px
            rgba(165,120,82,.12),
          inset 0 1px 3px
            rgba(111,77,48,.11);

        pointer-events: none;
      }

      /* ===================================================
         MONOGRAM

         Intentionally smaller than the inner ring.

         The image is not stretched to fill the seal.
         =================================================== */

      .dr-envelope-monogram-frame {
        position: absolute;

        width: 53%;
        height: 53%;

        left: 50%;
        top: 49%;

        transform:
          translate(-50%, -50%);

        display: flex;
        align-items: center;
        justify-content: center;

        overflow: hidden;

        border-radius: 2px;

        pointer-events: none;
      }

      .dr-envelope-monogram {
        display: block;

        width: 100%;
        height: 100%;

        object-fit: contain;

        object-position:
          center center;

        opacity: .83;

        filter:
          sepia(.18)
          saturate(.72)
          brightness(.89);

        transform: none;

        pointer-events: none;
      }

      /* ===================================================
         INVITATION
         =================================================== */

      .dr-envelope-prompt {
        position: relative;
        z-index: 3;

        display: flex;
        flex-direction: column;

        align-items: center;

        margin-top:
          clamp(34px, 7vw, 49px);

        gap: 12px;

        text-align: center;

        color: #88736e;
      }

      .dr-envelope-arrow {
        width: 23px;
        height: 33px;

        animation:
          drEnvelopeArrowFloat
          2.4s ease-in-out infinite;
      }

      .dr-envelope-arrow svg {
        display: block;

        width: 100%;
        height: 100%;

        stroke: currentColor;
        stroke-width: 1.35;

        fill: none;

        stroke-linecap: round;
        stroke-linejoin: round;
      }

      @keyframes drEnvelopeArrowFloat {
        0%, 100% {
          transform: translateY(3px);
        }

        50% {
          transform: translateY(-3px);
        }
      }

      .dr-envelope-invitation {
        margin: 0;

        font-family:
          "DR Envelope Garamond",
          Georgia,
          serif;

        font-size:
          clamp(24px, 6.3vw, 35px);

        font-style: italic;
        font-weight: 400;

        line-height: 1.2;

        letter-spacing: 0;

        color: #88736e;
      }

      /* ===================================================
         OPENING ANIMATION
         =================================================== */

      #dr-envelope-experience.dr-opening
      .dr-envelope-seal {
        opacity: 0;

        transform:
          translate(-50%, -50%)
          scale(.82);

        pointer-events: none;
      }

      #dr-envelope-experience.dr-opening
      .dr-envelope-flap {
        transform:
          rotateX(178deg);
      }

      #dr-envelope-experience.dr-opening
      .dr-envelope-prompt {
        opacity: 0;

        transition:
          opacity .35s ease;
      }

      #dr-envelope-experience.dr-letter-rising
      .dr-envelope-letter {
        opacity: 1;

        transform:
          translateY(-58%);
      }

      /* ===================================================
         FINAL HANDOFF
         =================================================== */

      #dr-envelope-experience.dr-handoff {
        opacity: 0;

        pointer-events: none;

        transform:
          translateY(0);
      }

      /* ===================================================
         ORIGINAL LETTER REVEAL
         =================================================== */

      body.dr-envelope-complete
      .hero-composition > .paper {
        opacity: 1 !important;
        visibility: visible !important;
        pointer-events: auto !important;
        animation: none !important;

        transition:
          opacity .9s
          cubic-bezier(.22,.61,.36,1) !important;
      }

      body.dr-envelope-complete
      .hero-composition > .paper
      .paper-content {
        opacity: 1 !important;
        transform: none !important;
        animation: none !important;
      }

      /* ===================================================
         SMALL MOBILE REFINEMENTS
         =================================================== */

      @media (max-width: 390px) {

        .dr-envelope-presentation {
          padding-left: 10px;
          padding-right: 10px;
        }

        .dr-envelope-heading {
          letter-spacing: .2em;
        }

        .dr-envelope-invitation {
          font-size: 25px;
        }

      }

      /* ===================================================
         REDUCED MOTION
         =================================================== */

      @media (prefers-reduced-motion: reduce) {

        .dr-envelope-arrow {
          animation: none;
        }

      }

    }

  `;

  document.head.appendChild(style);

  /* =========================================================
     SAVE ORIGINAL PAGE STATE
     ========================================================= */

  const originalDisplay = new Map();

  [
    photoStage,
    instagramSection,
    footer,
    backToTop
  ].forEach(element => {

    if (!element) {
      return;
    }

    originalDisplay.set(
      element,
      element.style.display
    );

  });

  /* =========================================================
     PREPARE THE ORIGINAL LETTER
     ========================================================= */

  originalPaper.classList.remove(
    "mobile-paper-visible"
  );

  originalPaper.classList.remove(
    "dr-letter-revealed"
  );

  /* =========================================================
     PREVENT PAGE SCROLLING
     ========================================================= */

  function lockScrolling() {

    originalScrollY = window.scrollY;

    document.documentElement.classList.add(
      "dr-envelope-locked"
    );

    document.body.classList.add(
      "dr-envelope-locked"
    );

    document.documentElement.style.overflow =
      "hidden";

    document.body.style.overflow =
      "hidden";

    document.body.style.touchAction =
      "none";

  }

  function unlockScrolling() {

    document.documentElement.classList.remove(
      "dr-envelope-locked"
    );

    document.body.classList.remove(
      "dr-envelope-locked"
    );

    document.documentElement.style.overflow =
      originalHtmlOverflow;

    document.body.style.overflow =
      originalBodyOverflow;

    document.body.style.touchAction =
      originalBodyTouchAction;

  }

  /* =========================================================
     ACTIVATE INTRODUCTION
     ========================================================= */

  document.body.classList.add(
    "dr-envelope-active"
  );

  lockScrolling();

  /* =========================================================
     CREATE PRESENTATION
     ========================================================= */

  const experience = document.createElement(
    "section"
  );

  experience.id =
    "dr-envelope-experience";

  experience.setAttribute(
    "aria-label",
    "Open Dominic Ryan's personal message"
  );

  experience.innerHTML = `

    <div class="dr-envelope-presentation">

      <h2 class="dr-envelope-heading">
        A Personal Message
      </h2>

      <div
        class="dr-envelope-scene"
        aria-label="Sealed correspondence"
      >

        <div
          class="dr-envelope-back"
          aria-hidden="true"
        ></div>

        <div
          class="dr-envelope-letter-window"
          aria-hidden="true"
        >

          <div class="dr-envelope-letter">

            <div
              class="dr-envelope-letter-content"
            ></div>

          </div>

        </div>

        <div
          class="dr-envelope-fold-left"
          aria-hidden="true"
        ></div>

        <div
          class="dr-envelope-fold-right"
          aria-hidden="true"
        ></div>

        <div
          class="dr-envelope-front"
          aria-hidden="true"
        ></div>

        <div
          class="dr-envelope-flap"
          aria-hidden="true"
        ></div>

        <button
          class="dr-envelope-seal"
          type="button"
          aria-label="Open the personal message"
        >

          <span
            class="dr-envelope-monogram-frame"
            aria-hidden="true"
          >

            <img
              class="dr-envelope-monogram"
              src="${CONFIG.monogram}"
              alt=""
            >

          </span>

        </button>

      </div>

      <div class="dr-envelope-prompt">

        <span
          class="dr-envelope-arrow"
          aria-hidden="true"
        >

          <svg viewBox="0 0 24 36">

            <path d="M12 34V3"></path>

            <path d="M3 12L12 3L21 12"></path>

          </svg>

        </span>

        <p class="dr-envelope-invitation">
          Tap the seal to open
        </p>

      </div>

    </div>

  `;

  /* =========================================================
     INSERT ENVELOPE INTO EXISTING WEBSITE
     ========================================================= */

  hero.insertBefore(
    experience,
    originalPaper
  );

  /* =========================================================
     ADJUST HEIGHT TO AVAILABLE MOBILE VIEWPORT
     ========================================================= */

  function updatePresentationHeight() {

    if (completed) {
      return;
    }

    const rect =
      experience.getBoundingClientRect();

    const top = Math.max(
      0,
      rect.top
    );

    experience.style.setProperty(
      "--dr-envelope-top",
      `${top}px`
    );

  }

  updatePresentationHeight();

  window.addEventListener(
    "resize",
    updatePresentationHeight,
    { passive: true }
  );

  /* =========================================================
     CLONE ORIGINAL LETTER CONTENT

     IMPORTANT:
     The animation uses the actual letter HTML.

     This preserves:
     - Existing wording
     - Original stylized Dominic Ryan lettering
     - Existing paragraph structure
     - Bold and italic markup
     ========================================================= */

  const originalContent =
    originalPaper.querySelector(
      ".paper-content"
    );

  const animatedContent =
    experience.querySelector(
      ".dr-envelope-letter-content"
    );

  if (
    originalContent &&
    animatedContent
  ) {

    const clonedContent =
      originalContent.cloneNode(true);

    animatedContent.innerHTML =
      clonedContent.innerHTML;

    /* Remove duplicate IDs from preview. */

    animatedContent
      .querySelectorAll("[id]")
      .forEach(element => {
        element.removeAttribute("id");
      });

  }

  /* =========================================================
     FORCE FONT CONSISTENCY

     Ensures the animated preview uses the same Avenir
     family as the original personal letter.
     ========================================================= */

  function synchronizeLetterTypography() {

    if (
      !originalContent ||
      !animatedContent
    ) {
      return;
    }

    const originalElements =
      originalContent.querySelectorAll("*");

    const animatedElements =
      animatedContent.querySelectorAll("*");

    const count = Math.min(
      originalElements.length,
      animatedElements.length
    );

    for (
      let index = 0;
      index < count;
      index++
    ) {

      const source =
        originalElements[index];

      const target =
        animatedElements[index];

      const computed =
        window.getComputedStyle(source);

      target.style.fontFamily =
        '"DR Envelope Avenir", "DR Avenir Next", sans-serif';

      target.style.fontWeight =
        computed.fontWeight;

      target.style.fontStyle =
        computed.fontStyle;

      target.style.letterSpacing =
        computed.letterSpacing;

    }

  }

  synchronizeLetterTypography();

  /* =========================================================
     LOAD FONTS BEFORE INTERACTION
     ========================================================= */

  if (document.fonts) {

    document.fonts.load(
      '400 14px "DR Envelope Avenir"'
    ).catch(() => {});

    document.fonts.load(
      '500 14px "DR Envelope Avenir"'
    ).catch(() => {});

    document.fonts.load(
      '600 14px "DR Envelope Avenir"'
    ).catch(() => {});

    document.fonts.load(
      'italic 28px "DR Envelope Garamond"'
    ).catch(() => {});

  }

  /* =========================================================
     ANIMATION ELEMENTS
     ========================================================= */

  const seal = experience.querySelector(
    ".dr-envelope-seal"
  );

  const animatedLetter =
    experience.querySelector(
      ".dr-envelope-letter"
    );

  /* =========================================================
     TIMER MANAGEMENT
     ========================================================= */

  function schedule(callback, delay) {

    const timer = window.setTimeout(
      callback,
      delay
    );

    animationTimers.push(timer);

    return timer;

  }

  function clearAnimationTimers() {

    animationTimers.forEach(timer => {
      window.clearTimeout(timer);
    });

    animationTimers = [];

  }

  /* =========================================================
     REVEAL ORIGINAL LETTER
     ========================================================= */

  function revealOriginalLetter() {

    document.body.classList.add(
      "dr-envelope-complete"
    );

    originalPaper.classList.add(
      "mobile-paper-visible"
    );

    originalPaper.classList.add(
      "dr-letter-revealed"
    );

    if (
      typeof window.drEnvelopeRevealLetter ===
      "function"
    ) {

      window.drEnvelopeRevealLetter();

    }

  }

  /* =========================================================
     COMPLETE HANDOFF

     No scrollTo().
     No automatic scroll animation.
     No jump to top.

     The original page remains in its natural position.
     ========================================================= */

  function completeOpening() {

    if (completed) {
      return;
    }

    completed = true;

    revealOriginalLetter();

    document.body.classList.remove(
      "dr-envelope-active"
    );

    experience.remove();

    unlockScrolling();

    window.removeEventListener(
      "resize",
      updatePresentationHeight
    );

    clearAnimationTimers();

  }

  /* =========================================================
     OPENING SEQUENCE
     ========================================================= */

  function openEnvelope() {

    if (opened || completed) {
      return;
    }

    opened = true;

    seal.disabled = true;

    /* -----------------------------------------------------
       PHASE 1 — BREAK SEAL AND OPEN FLAP
       ----------------------------------------------------- */

    experience.classList.add(
      "dr-opening"
    );

    /* -----------------------------------------------------
       PHASE 2 — LETTER RISES FROM ENVELOPE

       Lower portion remains hidden behind envelope folds.
       ----------------------------------------------------- */

    schedule(() => {

      experience.classList.add(
        "dr-letter-rising"
      );

    }, 570);

    /* -----------------------------------------------------
       PHASE 3 — PREPARE ACTUAL LETTER

       The full original letter is revealed as the
       presentation fades away.
       ----------------------------------------------------- */

    schedule(() => {

      revealOriginalLetter();

      experience.classList.add(
        "dr-handoff"
      );

    }, 2100);

    /* -----------------------------------------------------
       PHASE 4 — REMOVE PRESENTATION

       Original page becomes fully interactive.
       ----------------------------------------------------- */

    schedule(() => {

      completeOpening();

    }, 3000);

  }

  /* =========================================================
     SEAL INTERACTION
     ========================================================= */

  seal.addEventListener(
    "click",
    openEnvelope
  );

  /* =========================================================
     DESKTOP RESIZE SAFETY
     ========================================================= */

  function handleBreakpointChange(event) {

    if (event.matches) {
      return;
    }

    completeOpening();

  }

  mobileQuery.addEventListener(
    "change",
    handleBreakpointChange
  );

  /* =========================================================
     PAGE RESTORATION SAFETY
     ========================================================= */

  window.addEventListener(
    "pageshow",
    event => {

      if (
        event.persisted &&
        !completed
      ) {

        updatePresentationHeight();

      }

    }
  );

  /* =========================================================
     IMPORTANT:
     NO SESSION STORAGE

     The envelope intentionally appears every time the
     page is loaded or refreshed.

     This includes:
     - Normal browsing
     - Private browsing
     - New tabs
     - New sessions
     - Repeated refreshes

     ========================================================= */

})();
