/* =========================================================
   DOMINIC RYAN — MOBILE CORRESPONDENCE EXPERIENCE
   VERSION 12

   MOBILE ONLY: 760px AND BELOW

   FEATURES
   ---------------------------------------------------------
   - Envelope appears on every page refresh
   - Full-viewport editorial presentation
   - No scrolling before opening
   - Original header and navigation remain visible
   - Other page content concealed until opening
   - Champagne wax seal
   - Optically cropped DR monogram
   - Didot italic opening instruction
   - Real-letter visual continuity
   - Letter emerges behind envelope pocket
   - No visible letter below envelope
   - Smooth transition into actual HTML letter
   - Original desktop experience untouched
   ========================================================= */

(() => {
  "use strict";

  const MOBILE_QUERY = window.matchMedia(
    "(max-width: 760px)"
  );

  if (!MOBILE_QUERY.matches) {
    return;
  }

  if (
    document.getElementById(
      "dr-envelope-editorial"
    )
  ) {
    return;
  }

  /* =======================================================
     CONFIGURATION
     ======================================================= */

  const CONFIG = {

    monogram:
      "/dr-reveals-removebg-preview.png",

    flapDuration: 850,

    extractionDuration: 2200,

    transitionDuration: 950,

    extractionDelay: 420,

    settleDelay: 280

  };

  /* =======================================================
     ELEMENTS
     ======================================================= */

  const hero = document.querySelector(
    ".hero-composition"
  );

  const paper = document.querySelector(
    ".hero-composition > .paper"
  );

  const photo = document.querySelector(
    ".photo-stage"
  );

  const feed = document.querySelector(
    ".formulations-feed"
  );

  const footer = document.querySelector(
    ".dr-unified-footer"
  );

  const backToTop = document.querySelector(
    ".dr-back-to-top"
  );

  if (!hero || !paper) {
    return;
  }

  /* =======================================================
     STATE
     ======================================================= */

  let opened = false;

  let completed = false;

  let envelope = null;

  let letterClone = null;

  let openingTimers = [];

  const originalBodyOverflow =
    document.body.style.overflow;

  const originalHtmlOverflow =
    document.documentElement.style.overflow;

  /* =======================================================
     STYLES
     ======================================================= */

  const style = document.createElement("style");

  style.id = "dr-envelope-mobile-styles";

  style.textContent = `

    /* =====================================================
       MOBILE EXPERIENCE
       ===================================================== */

    @media (max-width:760px) {

      html.dr-envelope-locked,
      body.dr-envelope-locked {

        overflow:hidden !important;

        overscroll-behavior:none;

      }

      body.dr-envelope-active {

        overflow:hidden !important;

      }

      /* ===================================================
         CONCEAL PAGE CONTENT BEFORE OPENING
         =================================================== */

      body.dr-envelope-active .photo-stage,
      body.dr-envelope-active .formulations-feed,
      body.dr-envelope-active .dr-unified-footer,
      body.dr-envelope-active .dr-back-to-top {

        visibility:hidden !important;

        opacity:0 !important;

        pointer-events:none !important;

      }

      body.dr-envelope-active .hero-composition > .paper {

        visibility:hidden !important;

        opacity:0 !important;

        pointer-events:none !important;

        animation:none !important;

        transition:none !important;

      }

      body.dr-envelope-active .hero-composition > .paper .paper-content {

        opacity:0 !important;

        animation:none !important;

      }

      /* ===================================================
         FULL-SCREEN ENVELOPE EXPERIENCE
         =================================================== */

      #dr-envelope-editorial {

        position:fixed;

        inset:0;

        z-index:9000;

        display:flex;

        flex-direction:column;

        align-items:center;

        justify-content:center;

        width:100%;

        min-height:100dvh;

        padding:

          max(110px, env(safe-area-inset-top))

          0

          max(55px, env(safe-area-inset-bottom));

        overflow:hidden;

        background:

          linear-gradient(
            180deg,
            #f2ede6 0%,
            #f1ece6 55%,
            #eee9e4 100%
          );

        opacity:1;

        transition:
          opacity 950ms cubic-bezier(.22,.61,.36,1);

      }

      #dr-envelope-editorial.dr-completing {

        opacity:0;

        pointer-events:none;

      }

      /* ===================================================
         EDITORIAL HEADING
         =================================================== */

      .dr-envelope-heading {

        position:relative;

        z-index:3;

        width:100%;

        margin:

          0

          0

          clamp(50px,8vh,90px);

        padding:0 20px;

        text-align:center;

        font-family:
          "DR Avenir Next",
          "Avenir Next",
          Arial,
          sans-serif;

        font-size:
          clamp(11px,3vw,14px);

        font-weight:500;

        letter-spacing:.25em;

        line-height:1.5;

        color:#74655f;

      }

      /* ===================================================
         ENVELOPE SCENE
         =================================================== */

      .dr-envelope-scene {

        position:relative;

        width:min(100vw,540px);

        aspect-ratio:1.65 / 1;

        flex:none;

        perspective:1300px;

        filter:

          drop-shadow(
            0 22px 24px
            rgba(75,61,49,.10)
          );

      }

      /* ===================================================
         ENVELOPE BACK
         =================================================== */

      .dr-envelope-back {

        position:absolute;

        inset:0;

        z-index:1;

        background:

          linear-gradient(
            145deg,
            #f5f1ec,
            #eae5df
          );

      }

      /* ===================================================
         EXTRACTION WINDOW

         IMPORTANT:
         Anything below the envelope opening is concealed.
         =================================================== */

      .dr-letter-extraction-window {

        position:absolute;

        left:6%;

        right:6%;

        bottom:49%;

        height:165%;

        z-index:2;

        overflow:hidden;

        pointer-events:none;

      }

      /* ===================================================
         REAL LETTER REPRESENTATION
         =================================================== */

      .dr-letter-extract {

        position:absolute;

        left:0;

        bottom:-94%;

        width:100%;

        min-height:150%;

        padding:

          30px

          27px

          35px;

        background:#fbf8f2;

        box-shadow:

          0 5px 22px
          rgba(70,57,47,.09);

        opacity:0;

        transform:translateY(0);

        transition:

          bottom 2200ms
          cubic-bezier(.22,.61,.36,1),

          opacity 450ms ease;

        overflow:hidden;

      }

      .dr-letter-extract.dr-letter-rising {

        bottom:-8%;

        opacity:1;

      }

      /* Real letter typography */

      .dr-letter-extract .paper-content {

        opacity:1 !important;

        transform:none !important;

        animation:none !important;

        transition:none !important;

      }

      .dr-letter-extract .message-label {

        margin-bottom:22px;

        font-family:
          "DR Avenir Next",
          Arial,
          sans-serif;

        font-size:10px;

        letter-spacing:.09em;

        color:#786d65;

      }

      .dr-letter-extract h1 {

        margin:0 0 20px;

        font-family:
          "DR Avenir Next",
          Arial,
          sans-serif;

        font-size:18px;

        line-height:1.35;

        font-weight:500;

        color:#51463e;

      }

      .dr-letter-extract p {

        margin:0 0 15px;

        font-family:
          "DR Avenir Next",
          Arial,
          sans-serif;

        font-size:12px;

        line-height:1.56;

        color:#5c524b;

      }

      .dr-letter-extract .signature {

        width:160px;

        opacity:1 !important;

        transform:none !important;

        filter:none !important;

      }

      .dr-letter-extract .final-typewriter-text,
      .dr-letter-extract .final-typewriter-ornament {

        opacity:1 !important;

        filter:none !important;

      }

      /* ===================================================
         LEFT ENVELOPE FOLD
         =================================================== */

      .dr-envelope-left {

        position:absolute;

        inset:0;

        z-index:4;

        background:

          linear-gradient(
            125deg,
            #e7e2dd,
            #eee9e4
          );

        clip-path:

          polygon(
            0 0,
            51% 51%,
            0 100%
          );

        pointer-events:none;

      }

      /* ===================================================
         RIGHT ENVELOPE FOLD
         =================================================== */

      .dr-envelope-right {

        position:absolute;

        inset:0;

        z-index:4;

        background:

          linear-gradient(
            230deg,
            #e7e1dc,
            #f0ebe6
          );

        clip-path:

          polygon(
            100% 0,
            49% 51%,
            100% 100%
          );

        pointer-events:none;

      }

      /* ===================================================
         FRONT ENVELOPE POCKET
         =================================================== */

      .dr-envelope-front {

        position:absolute;

        inset:0;

        z-index:5;

        background:

          linear-gradient(
            180deg,
            #f1ece7,
            #e8e2dc
          );

        clip-path:

          polygon(
            0 100%,
            50% 49%,
            100% 100%
          );

        pointer-events:none;

      }

      /* ===================================================
         ENVELOPE FLAP
         =================================================== */

      .dr-envelope-flap {

        position:absolute;

        inset:0;

        z-index:7;

        background:

          linear-gradient(
            180deg,
            #f8f5f0,
            #ece7e2
          );

        clip-path:

          polygon(
            0 0,
            100% 0,
            50% 52%
          );

        transform-origin:50% 0%;

        transform:rotateX(0deg);

        backface-visibility:hidden;

        transition:

          transform 850ms
          cubic-bezier(.22,.61,.36,1),

          opacity 650ms ease;

        pointer-events:none;

      }

      .dr-envelope-opening .dr-envelope-flap {

        transform:rotateX(178deg);

      }

      /* ===================================================
         CHAMPAGNE WAX SEAL
         =================================================== */

      .dr-envelope-seal {

        position:absolute;

        left:50%;

        top:50%;

        z-index:10;

        width:clamp(83px,21vw,105px);

        height:clamp(83px,21vw,105px);

        padding:0;

        border:0;

        border-radius:50%;

        transform:translate(-50%,-50%);

        background:none;

        cursor:pointer;

        -webkit-tap-highlight-color:transparent;

        touch-action:manipulation;

        transition:

          opacity 450ms ease,

          transform 450ms ease;

      }

      .dr-envelope-seal:focus-visible {

        outline:2px solid #766457;

        outline-offset:7px;

      }

      .dr-envelope-opening .dr-envelope-seal {

        opacity:0;

        transform:
          translate(-50%,-50%)
          scale(.82);

        pointer-events:none;

      }

      .dr-envelope-wax {

        position:absolute;

        inset:0;

        border-radius:50%;

        background:

          radial-gradient(
            circle at 36% 29%,
            #f8ecd6 0%,
            #e5cfaf 34%,
            #d1af8a 69%,
            #bb946f 100%
          );

        border:

          1px solid
          rgba(255,246,226,.75);

        box-shadow:

          inset 0 3px 6px
          rgba(255,255,255,.46),

          inset 0 -5px 9px
          rgba(119,85,56,.21),

          0 9px 15px
          rgba(89,66,49,.16);

      }

      .dr-envelope-wax::before {

        content:"";

        position:absolute;

        inset:10%;

        border-radius:50%;

        border:

          1.5px solid
          rgba(255,248,230,.85);

        box-shadow:

          0 0 0 1px
          rgba(136,105,76,.13),

          inset 0 2px 3px
          rgba(109,82,58,.12);

      }

      /* ===================================================
         DR MONOGRAM — OPTICAL CROP

         Source artwork: 521 x 478

         Main D/R letterforms occupy upper portion.
         R's descending tail is intentionally cropped.
         =================================================== */

      .dr-envelope-monogram-window {

        position:absolute;

        inset:16%;

        overflow:hidden;

        border-radius:50%;

        pointer-events:none;

      }

      .dr-envelope-monogram {

        position:absolute;

        width:112%;

        height:auto;

        max-width:none;

        left:49%;

        top:43%;

        transform:
          translate(-50%,-50%);

        opacity:.65;

        filter:

          sepia(.58)
          saturate(.52)
          brightness(.82);

        pointer-events:none;

        user-select:none;

      }

      /* ===================================================
         OPENING INSTRUCTION
         =================================================== */

      .dr-envelope-prompt {

        position:relative;

        z-index:3;

        display:flex;

        flex-direction:column;

        align-items:center;

        justify-content:center;

        gap:12px;

        margin-top:
          clamp(54px,8vh,88px);

        text-align:center;

        color:#81716b;

        transition:opacity 450ms ease;

      }

      .dr-envelope-opening .dr-envelope-prompt {

        opacity:0;

      }

      .dr-envelope-arrow {

        width:20px;

        height:29px;

        animation:

          drEnvelopeArrowFloat
          2.4s
          ease-in-out
          infinite;

      }

      .dr-envelope-arrow svg {

        width:100%;

        height:100%;

        display:block;

        fill:none;

        stroke:currentColor;

        stroke-width:1.3;

        stroke-linecap:round;

        stroke-linejoin:round;

      }

      @keyframes drEnvelopeArrowFloat {

        0%,100% {

          transform:translateY(3px);

        }

        50% {

          transform:translateY(-3px);

        }

      }

      .dr-envelope-instruction {

        font-family:
          "DR Didot",
          Didot,
          "Bodoni 72",
          Georgia,
          serif;

        font-style:italic;

        font-size:
          clamp(23px,5.8vw,34px);

        font-weight:400;

        line-height:1.2;

        letter-spacing:.01em;

        color:#82716c;

      }

      /* ===================================================
         FINAL TRANSITION
         =================================================== */

      .dr-envelope-editorial-finish {

        opacity:0 !important;

        pointer-events:none !important;

      }

      /* ===================================================
         SHORTER MOBILE SCREENS
         =================================================== */

      @media (max-height:700px) {

        .dr-envelope-heading {

          margin-bottom:34px;

        }

        .dr-envelope-prompt {

          margin-top:35px;

        }

      }

    }

  `;

  document.head.appendChild(style);

  /* =======================================================
     CREATE ENVELOPE
     ======================================================= */

  envelope = document.createElement("section");

  envelope.id = "dr-envelope-editorial";

  envelope.setAttribute(
    "aria-label",
    "Open a personal message"
  );

  envelope.innerHTML = `

    <div class="dr-envelope-heading">

      A PERSONAL MESSAGE

    </div>

    <div class="dr-envelope-scene">

      <div class="dr-envelope-back"></div>

      <div class="dr-letter-extraction-window">

        <div class="dr-letter-extract"></div>

      </div>

      <div class="dr-envelope-left"></div>

      <div class="dr-envelope-right"></div>

      <div class="dr-envelope-front"></div>

      <div class="dr-envelope-flap"></div>

      <button
        class="dr-envelope-seal"
        type="button"
        aria-label="Open the personal letter"
      >

        <span class="dr-envelope-wax">

          <span class="dr-envelope-monogram-window">

            <img
              class="dr-envelope-monogram"
              src="${CONFIG.monogram}"
              alt=""
              draggable="false"
            >

          </span>

        </span>

      </button>

    </div>

    <div class="dr-envelope-prompt">

      <div
        class="dr-envelope-arrow"
        aria-hidden="true"
      >

        <svg viewBox="0 0 24 32">

          <path d="M12 29V3"></path>

          <path d="M4 11L12 3L20 11"></path>

        </svg>

      </div>

      <div class="dr-envelope-instruction">

        Tap the seal to open

      </div>

    </div>

  `;

  document.body.appendChild(envelope);

  /* =======================================================
     CREATE LETTER REPRESENTATION

     Uses actual HTML letter content.
     ======================================================= */

  const extractContainer =
    envelope.querySelector(
      ".dr-letter-extract"
    );

  const originalContent =
    paper.querySelector(
      ".paper-content"
    );

  if (originalContent && extractContainer) {

    letterClone =
      originalContent.cloneNode(true);

    letterClone.removeAttribute("id");

    extractContainer.appendChild(
      letterClone
    );

  }

  /* =======================================================
     LOCK SCROLLING
     ======================================================= */

  function lockScrolling() {

    document.documentElement.classList.add(
      "dr-envelope-locked"
    );

    document.body.classList.add(
      "dr-envelope-locked",
      "dr-envelope-active"
    );

    document.documentElement.style.overflow =
      "hidden";

    document.body.style.overflow =
      "hidden";

  }

  function unlockScrolling() {

    document.documentElement.classList.remove(
      "dr-envelope-locked"
    );

    document.body.classList.remove(
      "dr-envelope-locked",
      "dr-envelope-active"
    );

    document.documentElement.style.overflow =
      originalHtmlOverflow;

    document.body.style.overflow =
      originalBodyOverflow;

  }

  lockScrolling();

  /* =======================================================
     REVEAL ORIGINAL LETTER
     ======================================================= */

  function revealOriginalLetter() {

    paper.classList.add(
      "mobile-paper-visible"
    );

    paper.style.visibility =
      "visible";

    paper.style.opacity =
      "1";

    paper.style.pointerEvents =
      "auto";

    if (
      typeof window.drEnvelopeRevealLetter ===
      "function"
    ) {

      window.drEnvelopeRevealLetter();

    }

  }

  /* =======================================================
     COMPLETE EXPERIENCE
     ======================================================= */

  function completeOpening() {

    if (completed) {
      return;
    }

    completed = true;

    revealOriginalLetter();

    document.body.classList.remove(
      "dr-envelope-active"
    );

    envelope.classList.add(
      "dr-completing"
    );

    const timer = setTimeout(() => {

      if (envelope) {
        envelope.remove();
      }

      unlockScrolling();

      window.scrollTo({
        top:0,
        behavior:"instant"
      });

    }, CONFIG.transitionDuration);

    openingTimers.push(timer);

  }

  /* =======================================================
     OPENING SEQUENCE
     ======================================================= */

  function openEnvelope() {

    if (opened) {
      return;
    }

    opened = true;

    const seal =
      envelope.querySelector(
        ".dr-envelope-seal"
      );

    const extraction =
      envelope.querySelector(
        ".dr-letter-extract"
      );

    if (seal) {
      seal.disabled = true;
    }

    envelope.classList.add(
      "dr-envelope-opening"
    );

    /* Step 1: Open the flap */

    const riseTimer = setTimeout(() => {

      if (extraction) {

        extraction.classList.add(
          "dr-letter-rising"
        );

      }

    }, CONFIG.flapDuration);

    openingTimers.push(riseTimer);

    /* Step 2: Reveal complete original letter */

    const completeTimer = setTimeout(() => {

      completeOpening();

    },

      CONFIG.flapDuration +
      CONFIG.extractionDuration +
      CONFIG.settleDelay

    );

    openingTimers.push(completeTimer);

  }

  /* =======================================================
     SEAL INTERACTION
     ======================================================= */

  const seal =
    envelope.querySelector(
      ".dr-envelope-seal"
    );

  if (seal) {

    seal.addEventListener(
      "click",
      openEnvelope
    );

  }

  /* =======================================================
     RESPONSIVE CLEANUP
     ======================================================= */

  function cleanupOnDesktop() {

    if (MOBILE_QUERY.matches) {
      return;
    }

    openingTimers.forEach(
      clearTimeout
    );

    openingTimers = [];

    if (envelope) {
      envelope.remove();
    }

    unlockScrolling();

    paper.style.visibility = "";

    paper.style.opacity = "";

    paper.style.pointerEvents = "";

  }

  if (
    typeof MOBILE_QUERY.addEventListener ===
    "function"
  ) {

    MOBILE_QUERY.addEventListener(
      "change",
      cleanupOnDesktop
    );

  } else {

    MOBILE_QUERY.addListener(
      cleanupOnDesktop
    );

  }

})();
