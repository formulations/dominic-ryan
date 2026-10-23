/* =========================================================
   DOMINIC RYAN — MOBILE CORRESPONDENCE EXPERIENCE

   MOBILE ONLY — 760px AND BELOW

   REFINEMENTS
   ---------------------------------------------------------
   01. Presentation positioned directly beneath navigation
   02. Excessive vertical gap eliminated
   03. Square-cornered ivory presentation layer
   04. Original envelope, seal and monogram preserved
   05. Original fonts and invitation preserved
   06. Original letter extraction animation preserved
   07. No automatic scrolling
   08. Original website restored after opening
   09. Envelope reappears on every refresh
   10. Desktop unaffected

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

  const navigation = document.querySelector(
    ".collection-navigation"
  );

  const hero = document.querySelector(
    ".hero-composition"
  );

  const originalPaper = document.querySelector(
    ".hero-composition > .paper"
  );

  const originalContent = originalPaper?.querySelector(
    ".paper-content"
  );

  if (
    !navigation ||
    !hero ||
    !originalPaper
  ) {
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
      900

  };

  /* =========================================================
     STATE
     ========================================================= */

  let opened = false;
  let completed = false;

  let animationTimers = [];

  const originalBodyOverflow =
    document.body.style.overflow;

  const originalHtmlOverflow =
    document.documentElement.style.overflow;

  const originalBodyTouchAction =
    document.body.style.touchAction;

  /* =========================================================
     STYLES
     ========================================================= */

  const style = document.createElement("style");

  style.id = "dr-envelope-mobile-styles";

  style.textContent = `

    /* =====================================================
       ORIGINAL WEBSITE FONTS
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
       MOBILE ONLY
       ===================================================== */

    @media (max-width: 760px) {

      /* ===================================================
         SCROLL LOCK
         =================================================== */

      html.dr-envelope-locked,
      body.dr-envelope-locked {
        overflow: hidden !important;
        overscroll-behavior: none !important;
      }

      body.dr-envelope-locked {
        touch-action: none !important;
      }

      /* ===================================================
         HIDE ORIGINAL CONTENT DURING INTRODUCTION

         IMPORTANT:
         display:none removes the original hero from
         layout so its large vertical spacing cannot
         push the envelope downward.
         =================================================== */

      body.dr-envelope-active .letter-wrap {
        display: none !important;
      }

      body.dr-envelope-active .formulations-feed,
      body.dr-envelope-active .dr-unified-footer,
      body.dr-envelope-active #dr-back-to-top {
        visibility: hidden !important;
        pointer-events: none !important;
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
         MAIN PRESENTATION

         Independently placed immediately after navigation.
         =================================================== */

      #dr-envelope-experience {
        position: relative;

        display: flex;
        align-items: flex-start;
        justify-content: center;

        box-sizing: border-box;

        width: 100%;

        margin: 16px auto 0;

        padding: 0 12px;

        isolation: isolate;

        opacity: 1;

        transition:
          opacity .75s ease,
          transform .75s
            cubic-bezier(.22,.61,.36,1);
      }

      /* ===================================================
         IVORY PRESENTATION PANEL

         SQUARE CORNERS
         =================================================== */

      .dr-envelope-presentation {
        position: relative;

        box-sizing: border-box;

        width: 100%;

        min-height: max(
          440px,
          calc(
            100svh -
            var(--dr-envelope-top, 0px) -
            16px
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
          rgba(171,150,132,.32);

        border-radius: 0;

        background:
          linear-gradient(
            155deg,
            #f8f5f0 0%,
            #f4efe8 48%,
            #f1ebe3 100%
          );

        box-shadow:
          0 18px 50px
            rgba(74,60,48,.065),
          0 2px 9px
            rgba(74,60,48,.025);

        overflow: hidden;
      }

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
         WAX SEAL — UNCHANGED
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
         MONOGRAM — UNCHANGED
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
         OPENING ANIMATION — UNCHANGED
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
         HANDOFF
         =================================================== */

      #dr-envelope-experience.dr-handoff {
        opacity: 0;

        pointer-events: none;

        transform:
          translateY(0);
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

      @media (prefers-reduced-motion: reduce) {

        .dr-envelope-arrow {
          animation: none;
        }

      }

    }

  `;

  document.head.appendChild(style);

  /* =========================================================
     PREPARE ORIGINAL LETTER
     ========================================================= */

  originalPaper.classList.remove(
    "mobile-paper-visible",
    "dr-letter-revealed"
  );

  /* =========================================================
     SCROLL LOCK
     ========================================================= */

  function lockScrolling() {

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
     INSERT DIRECTLY AFTER NAVIGATION

     This is the key positioning correction.
     ========================================================= */

  navigation.insertAdjacentElement(
    "afterend",
    experience
  );

  /* =========================================================
     ACTIVATE INTRODUCTION
     ========================================================= */

  document.body.classList.add(
    "dr-envelope-active"
  );

  lockScrolling();

  /* =========================================================
     SET AVAILABLE PRESENTATION HEIGHT
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
     ========================================================= */

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

    animatedContent
      .querySelectorAll("[id]")
      .forEach(element => {
        element.removeAttribute("id");
      });

  }

  /* =========================================================
     SYNCHRONIZE LETTER TYPOGRAPHY
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
     PRELOAD FONTS
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
      "mobile-paper-visible",
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
     COMPLETE OPENING
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

    /* Phase 1 — Break seal and open flap */

    experience.classList.add(
      "dr-opening"
    );

    /* Phase 2 — Letter rises */

    schedule(() => {

      experience.classList.add(
        "dr-letter-rising"
      );

    }, 570);

    /* Phase 3 — Fade presentation */

    schedule(() => {

      revealOriginalLetter();

      experience.classList.add(
        "dr-handoff"
      );

    }, 2100);

    /* Phase 4 — Restore website */

    schedule(() => {

      completeOpening();

    }, 3000);

  }

  seal.addEventListener(
    "click",
    openEnvelope
  );

  /* =========================================================
     DESKTOP RESIZE SAFETY
     ========================================================= */

  function handleBreakpointChange(event) {

    if (!event.matches) {
      completeOpening();
    }

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
     NO SESSION STORAGE

     The envelope appears on every refresh.
     ========================================================= */

})();
