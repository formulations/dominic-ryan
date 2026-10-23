/* =========================================================
   DOMINIC RYAN
   MOBILE CORRESPONDENCE EXPERIENCE

   REFINED ENVELOPE — COMPLETE VERSION

   FEATURES
   ---------------------------------------------------------
   • Mobile only: 760px and below
   • Original header and navigation preserved
   • Full available viewport presentation
   • No automatic scrolling
   • Scroll locked until correspondence opens
   • Original ivory envelope proportions
   • Champagne wax seal
   • Custom DR monogram
   • Subtle illuminated monogram treatment
   • EB Garamond italic instruction
   • Realistic flap-opening animation
   • Letter partially extracted from envelope
   • Lower letter concealed behind front pocket
   • Original HTML letter preserved
   • Smooth transition to actual letter
   • Background content hidden until opening
   • Envelope appears on every refresh
   • No sessionStorage or localStorage
   • Desktop completely unaffected

   ASSETS
   ---------------------------------------------------------
   /dr-envelope-logo.png
   /eb-garamond-latin-400-italic.woff2

   ========================================================= */

(() => {
  "use strict";

  /* =======================================================
     MOBILE DETECTION
     ======================================================= */

  const mobileQuery = window.matchMedia(
    "(max-width: 760px)"
  );

  if (!mobileQuery.matches) {
    return;
  }

  /* =======================================================
     PREVENT DUPLICATE INITIALIZATION
     ======================================================= */

  if (
    document.getElementById(
      "dr-envelope-experience"
    )
  ) {
    return;
  }

  /* =======================================================
     REQUIRED ELEMENTS
     ======================================================= */

  const header = document.querySelector(
    ".header"
  );

  const navigation = document.querySelector(
    ".collection-navigation"
  );

  const main = document.querySelector(
    "main"
  );

  const paper = document.querySelector(
    ".hero-composition > .paper"
  );

  const paperContent = paper?.querySelector(
    ".paper-content"
  );

  if (
    !header ||
    !navigation ||
    !main ||
    !paper ||
    !paperContent
  ) {
    return;
  }

  /* =======================================================
     CONFIGURATION
     ======================================================= */

  const CONFIG = {

    monogram:
      "/dr-envelope-logo.png",

    font:
      "/eb-garamond-latin-400-italic.woff2",

    flapDuration:
      850,

    extractionDelay:
      450,

    extractionDuration:
      1350,

    transitionDelay:
      1900,

    transitionDuration:
      1050,

    cleanupDelay:
      3100

  };

  /* =======================================================
     STATE
     ======================================================= */

  let opened = false;

  let destroyed = false;

  let previousBodyOverflow =
    document.body.style.overflow;

  let previousHtmlOverflow =
    document.documentElement.style.overflow;

  let previousMainVisibility =
    main.style.visibility;

  let previousMainPointerEvents =
    main.style.pointerEvents;

  let previousPaperOpacity =
    paper.style.opacity;

  let previousPaperVisibility =
    paper.style.visibility;

  let previousPaperAnimation =
    paper.style.animation;

  let previousPaperTransition =
    paper.style.transition;

  let previousPaperContentOpacity =
    paperContent.style.opacity;

  let previousPaperContentTransform =
    paperContent.style.transform;

  let previousPaperContentAnimation =
    paperContent.style.animation;

  let previousPaperContentTransition =
    paperContent.style.transition;

  /* =======================================================
     STYLES
     ======================================================= */

  const style = document.createElement(
    "style"
  );

  style.id =
    "dr-envelope-mobile-styles";

  style.textContent = `

    /* =====================================================
       SELF-HOSTED GARamond
       ===================================================== */

    @font-face {

      font-family:
        "DR EB Garamond";

      src:
        url("${CONFIG.font}")
        format("woff2");

      font-style:
        italic;

      font-weight:
        400;

      font-display:
        swap;

    }


    /* =====================================================
       MOBILE ONLY
       ===================================================== */

    @media (max-width: 760px) {

      /* ===================================================
         HEADER AND NAVIGATION

         Preserve their existing appearance.
         Only establish stacking order.
         =================================================== */

      body.dr-envelope-active
      .site-shell {

        position:
          relative;

      }

      body.dr-envelope-active
      .header {

        position:
          relative;

        z-index:
          10002;

      }

      body.dr-envelope-active
      .collection-navigation {

        position:
          relative;

        z-index:
          10002;

      }


      /* ===================================================
         MAIN CONTENT

         The original document remains in place.

         This avoids restructuring the existing page.
         =================================================== */

      body.dr-envelope-active main {

        visibility:
          hidden;

        pointer-events:
          none;

      }


      /* ===================================================
         EXPERIENCE CONTAINER
         =================================================== */

      #dr-envelope-experience {

        position:
          fixed;

        top:
          var(--dr-envelope-top, 180px);

        right:
          0;

        bottom:
          0;

        left:
          0;

        z-index:
          10000;

        display:
          flex;

        flex-direction:
          column;

        align-items:
          center;

        justify-content:
          center;

        width:
          100%;

        padding:
          18px 0
          calc(
            24px +
            env(safe-area-inset-bottom)
          );

        overflow:
          hidden;

        background:
          #f2ede6;

        opacity:
          1;

        transform:
          translateZ(0);

        transition:
          opacity
          ${CONFIG.transitionDuration}ms
          cubic-bezier(.22,.61,.36,1);

        isolation:
          isolate;

      }


      /* ===================================================
         FULL PRESENTATION
         =================================================== */

      .dr-envelope-presentation {

        width:
          100%;

        max-width:
          760px;

        display:
          flex;

        flex-direction:
          column;

        align-items:
          center;

        justify-content:
          center;

        flex:
          0 1 auto;

        min-height:
          0;

      }


      /* ===================================================
         HEADING
         =================================================== */

      .dr-envelope-heading {

        margin:
          0 0
          clamp(22px, 4.8vh, 48px);

        padding:
          0 16px;

        font-family:
          "DR Avenir Next",
          "Avenir Next",
          Arial,
          sans-serif;

        font-size:
          clamp(11px, 2.8vw, 14px);

        font-weight:
          500;

        line-height:
          1.5;

        letter-spacing:
          .23em;

        text-align:
          center;

        text-transform:
          uppercase;

        color:
          #75655e;

      }


      /* ===================================================
         ENVELOPE SCENE
         =================================================== */

      .dr-envelope-scene {

        position:
          relative;

        width:
          min(94vw, 610px);

        aspect-ratio:
          1.43 / 1;

        flex:
          none;

        perspective:
          1200px;

        filter:
          drop-shadow(
            0 20px 24px
            rgba(71,55,43,.09)
          );

      }


      /* ===================================================
         ENVELOPE BACK
         =================================================== */

      .dr-envelope-back {

        position:
          absolute;

        inset:
          0;

        z-index:
          1;

        background:
          linear-gradient(
            155deg,
            #f8f5f0 0%,
            #eee9e4 100%
          );

        border:
          1px solid
          rgba(165,137,116,.24);

        box-shadow:
          inset 0 1px 1px
          rgba(255,255,255,.8);

      }


      /* ===================================================
         LETTER PREVIEW

         Uses a clone of the actual HTML letter.

         The visible portion is deliberately clipped.

         It is NOT a replacement for the real letter.
         =================================================== */

      .dr-envelope-sheet {

        position:
          absolute;

        left:
          6%;

        top:
          4%;

        width:
          88%;

        height:
          94%;

        z-index:
          2;

        overflow:
          hidden;

        background:
          #fbf8f2;

        border:
          1px solid
          rgba(117,98,83,.11);

        box-shadow:
          0 5px 20px
          rgba(65,51,42,.09);

        transform:
          translateY(10%);

        opacity:
          0;

        transition:
          transform
          ${CONFIG.extractionDuration}ms
          cubic-bezier(.22,.61,.36,1),

          opacity
          350ms
          ease;

        will-change:
          transform;

      }


      /* ===================================================
         PREVIEW CONTENT

         Existing letter styles remain the source.

         No font replacement is applied.
         =================================================== */

      .dr-envelope-sheet
      .dr-envelope-preview {

        width:
          100%;

        height:
          100%;

        overflow:
          hidden;

        padding:
          clamp(15px, 4vw, 30px);

        background:
          #fbf8f2;

      }

      .dr-envelope-preview
      .paper-content {

        opacity:
          1 !important;

        animation:
          none !important;

        transform:
          none !important;

        transition:
          none !important;

      }

      .dr-envelope-preview
      .message-label {

        margin-bottom:
          15px;

        font-size:
          clamp(8px, 1.9vw, 11px);

      }

      .dr-envelope-preview h1 {

        margin-bottom:
          15px;

        font-size:
          clamp(13px, 3vw, 19px);

        line-height:
          1.35;

      }

      .dr-envelope-preview p {

        margin-bottom:
          12px;

        font-size:
          clamp(10px, 2.4vw, 13px);

        line-height:
          1.5;

      }

      .dr-envelope-preview
      .final-typewriter-text {

        opacity:
          1 !important;

        filter:
          none !important;

      }

      .dr-envelope-preview
      .signature {

        opacity:
          1 !important;

        transform:
          none !important;

        filter:
          none !important;

      }


      /* ===================================================
         ENVELOPE SIDE FOLDS
         =================================================== */

      .dr-envelope-left {

        position:
          absolute;

        inset:
          0;

        z-index:
          3;

        background:
          linear-gradient(
            120deg,
            #eee9e5,
            #e6e0dc
          );

        clip-path:
          polygon(
            0 0,
            50% 50%,
            0 100%
          );

        filter:
          drop-shadow(
            1px 0 1px
            rgba(120,99,85,.07)
          );

      }

      .dr-envelope-right {

        position:
          absolute;

        inset:
          0;

        z-index:
          3;

        background:
          linear-gradient(
            240deg,
            #f0ebe7,
            #e7e1dd
          );

        clip-path:
          polygon(
            100% 0,
            100% 100%,
            50% 50%
          );

      }


      /* ===================================================
         FRONT POCKET

         Conceals the lower part of the emerging letter.
         =================================================== */

      .dr-envelope-front {

        position:
          absolute;

        inset:
          0;

        z-index:
          4;

        background:
          linear-gradient(
            180deg,
            #e9e4e0 0%,
            #e6e0dc 100%
          );

        clip-path:
          polygon(
            0 100%,
            50% 50%,
            100% 100%
          );

      }


      /* ===================================================
         ENVELOPE FLAP

         Closed: triangular flap covers upper half.

         Open: folds backward around top edge.
         =================================================== */

      .dr-envelope-flap {

        position:
          absolute;

        left:
          0;

        top:
          0;

        width:
          100%;

        height:
          51%;

        z-index:
          6;

        background:
          linear-gradient(
            180deg,
            #faf8f5 0%,
            #eee9e4 100%
          );

        clip-path:
          polygon(
            0 0,
            100% 0,
            50% 100%
          );

        transform-origin:
          50% 0%;

        transform:
          rotateX(0deg);

        backface-visibility:
          visible;

        transition:
          transform
          ${CONFIG.flapDuration}ms
          cubic-bezier(.22,.61,.36,1);

        filter:
          drop-shadow(
            0 2px 1px
            rgba(130,105,87,.12)
          );

      }


      /* ===================================================
         WAX SEAL BUTTON
         =================================================== */

      .dr-envelope-seal {

        position:
          absolute;

        left:
          50%;

        top:
          50%;

        z-index:
          9;

        width:
          clamp(78px, 20vw, 105px);

        height:
          clamp(78px, 20vw, 105px);

        padding:
          0;

        display:
          flex;

        align-items:
          center;

        justify-content:
          center;

        border:
          0;

        border-radius:
          50%;

        background:
          transparent;

        transform:
          translate(-50%, -50%);

        cursor:
          pointer;

        -webkit-tap-highlight-color:
          transparent;

        touch-action:
          manipulation;

        transition:
          opacity 450ms ease,
          transform 450ms ease;

      }

      .dr-envelope-seal:focus-visible {

        outline:
          2px solid #84776d;

        outline-offset:
          5px;

      }


      /* ===================================================
         OUTER WAX
         =================================================== */

      .dr-envelope-wax {

        position:
          absolute;

        inset:
          0;

        border-radius:
          47% 53% 49% 51% /
          51% 47% 53% 49%;

        background:
          radial-gradient(
            circle at 32% 25%,
            #f5e8cf 0%,
            #e6cdaa 38%,
            #c8a27e 78%,
            #b88f6e 100%
          );

        box-shadow:
          0 8px 17px
          rgba(89,63,45,.18),

          inset 0 2px 3px
          rgba(255,255,255,.72),

          inset 0 -4px 6px
          rgba(117,78,50,.15);

      }


      /* ===================================================
         INNER EMBOSSED RING
         =================================================== */

      .dr-envelope-wax::before {

        content:
          "";

        position:
          absolute;

        inset:
          10%;

        border-radius:
          50%;

        border:
          2px solid
          rgba(255,249,231,.86);

        box-shadow:
          inset 0 2px 5px
          rgba(113,80,53,.15),

          0 1px 1px
          rgba(125,87,58,.12);

      }


      /* ===================================================
         INNER WAX SURFACE
         =================================================== */

      .dr-envelope-wax::after {

        content:
          "";

        position:
          absolute;

        inset:
          15%;

        border-radius:
          50%;

        background:
          radial-gradient(
            circle at 38% 28%,
            rgba(255,251,232,.44),
            rgba(255,246,223,.08) 58%,
            rgba(155,107,73,.08) 100%
          );

        pointer-events:
          none;

      }


      /* ===================================================
         MONOGRAM CONTAINER

         Circular clipping ensures that the R tail
         cannot extend outside the embossed surface.
         =================================================== */

      .dr-envelope-monogram {

        position:
          absolute;

        left:
          50%;

        top:
          50%;

        z-index:
          2;

        width:
          67%;

        height:
          67%;

        display:
          flex;

        align-items:
          center;

        justify-content:
          center;

        overflow:
          hidden;

        border-radius:
          50%;

        transform:
          translate(-50%, -50%);

        pointer-events:
          none;

      }


      /* ===================================================
         DR LOGO

         The new asset replaces the original.

         The lettering is emphasized without allowing
         the R tail to dominate the seal.
         =================================================== */

      .dr-envelope-monogram img {

        display:
          block;

        width:
          100%;

        height:
          100%;

        object-fit:
          contain;

        object-position:
          center;

        opacity:
          .94;

        filter:
          brightness(1.09)
          contrast(1.06)
          drop-shadow(
            0 1px 1px
            rgba(255,252,239,.58)
          );

        transform:
          scale(1.16)
          translate(-1%, -3%);

        transform-origin:
          center;

        pointer-events:
          none;

      }


      /* ===================================================
         SUBTLE CHAMPAGNE ILLUMINATION
         =================================================== */

      .dr-envelope-illumination {

        position:
          absolute;

        inset:
          17%;

        z-index:
          1;

        border-radius:
          50%;

        background:
          radial-gradient(
            circle at 43% 37%,
            rgba(255,251,231,.55),
            rgba(255,241,206,.19) 45%,
            transparent 78%
          );

        pointer-events:
          none;

        animation:
          drWaxIlluminate
          5.5s
          ease-in-out
          infinite;

      }

      @keyframes drWaxIlluminate {

        0%,
        100% {

          opacity:
            .68;

        }

        50% {

          opacity:
            1;

        }

      }


      /* ===================================================
         INSTRUCTION
         =================================================== */

      .dr-envelope-instruction {

        display:
          flex;

        flex-direction:
          column;

        align-items:
          center;

        justify-content:
          center;

        margin-top:
          clamp(28px, 5vh, 48px);

        padding:
          0 18px;

        text-align:
          center;

        pointer-events:
          none;

      }


      /* ===================================================
         UPWARD ARROW
         =================================================== */

      .dr-envelope-arrow {

        width:
          23px;

        height:
          33px;

        margin-bottom:
          12px;

        color:
          #84776d;

        animation:
          drEnvelopeArrow
          2.3s
          ease-in-out
          infinite;

      }

      .dr-envelope-arrow svg {

        display:
          block;

        width:
          100%;

        height:
          100%;

        fill:
          none;

        stroke:
          currentColor;

        stroke-width:
          1.35;

        stroke-linecap:
          round;

        stroke-linejoin:
          round;

      }

      @keyframes drEnvelopeArrow {

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
         EB GARAMOND INSTRUCTION
         =================================================== */

      .dr-envelope-instruction-text {

        margin:
          0;

        font-family:
          "DR EB Garamond",
          Georgia,
          serif;

        font-size:
          clamp(25px, 6.2vw, 33px);

        font-weight:
          400;

        font-style:
          italic;

        line-height:
          1.2;

        letter-spacing:
          .005em;

        color:
          #84776d;

        white-space:
          nowrap;

      }


      /* ===================================================
         OPENING STATE
         =================================================== */

      #dr-envelope-experience.dr-opening
      .dr-envelope-flap {

        transform:
          rotateX(180deg);

        z-index:
          1;

      }

      #dr-envelope-experience.dr-opening
      .dr-envelope-sheet {

        opacity:
          1;

        transform:
          translateY(-35%);

        transition-delay:
          ${CONFIG.extractionDelay}ms;

      }

      #dr-envelope-experience.dr-opening
      .dr-envelope-seal {

        opacity:
          0;

        transform:
          translate(-50%, -50%)
          scale(.92);

        pointer-events:
          none;

      }

      #dr-envelope-experience.dr-opening
      .dr-envelope-instruction {

        opacity:
          0;

        transition:
          opacity 450ms ease;

      }

      #dr-envelope-experience.dr-opening
      .dr-envelope-heading {

        opacity:
          0;

        transition:
          opacity 550ms ease;

      }


      /* ===================================================
         FINAL HANDOFF

         No scrolling.
         No viewport translation.
         No page repositioning.
         =================================================== */

      #dr-envelope-experience.dr-handoff {

        opacity:
          0;

        pointer-events:
          none;

      }


      /* ===================================================
         SMALL MOBILE DEVICES
         =================================================== */

      @media (max-height: 700px) {

        .dr-envelope-heading {

          margin-bottom:
            16px;

        }

        .dr-envelope-scene {

          width:
            min(86vw, 490px);

        }

        .dr-envelope-instruction {

          margin-top:
            20px;

        }

        .dr-envelope-instruction-text {

          font-size:
            25px;

        }

      }


      /* ===================================================
         REDUCED MOTION
         =================================================== */

      @media (prefers-reduced-motion: reduce) {

        .dr-envelope-arrow,
        .dr-envelope-illumination {

          animation:
            none;

        }

      }

    }

  `;

  document.head.appendChild(style);

  /* =======================================================
     LOCK PAGE BEFORE DISPLAYING EXPERIENCE
     ======================================================= */

  document.body.classList.add(
    "dr-envelope-active"
  );

  document.documentElement.style.overflow =
    "hidden";

  document.body.style.overflow =
    "hidden";

  main.style.visibility =
    "hidden";

  main.style.pointerEvents =
    "none";

  /* =======================================================
     PREPARE ORIGINAL LETTER

     Do not change its dimensions, padding, or typography.
     ======================================================= */

  paper.style.opacity =
    "0";

  paper.style.visibility =
    "hidden";

  paper.style.animation =
    "none";

  paper.style.transition =
    "none";

  paperContent.style.opacity =
    "0";

  paperContent.style.transform =
    "none";

  paperContent.style.animation =
    "none";

  paperContent.style.transition =
    "none";

  /* =======================================================
     CREATE ENVELOPE
     ======================================================= */

  const experience = document.createElement(
    "section"
  );

  experience.id =
    "dr-envelope-experience";

  experience.setAttribute(
    "aria-label",
    "Open a personal message from Dominic Ryan"
  );

  experience.innerHTML = `

    <div class="dr-envelope-presentation">

      <h2 class="dr-envelope-heading">
        A Personal Message
      </h2>

      <div class="dr-envelope-scene">

        <!-- ENVELOPE BACK -->

        <div
          class="dr-envelope-back"
          aria-hidden="true"
        ></div>


        <!-- EMERGING LETTER -->

        <div
          class="dr-envelope-sheet"
          aria-hidden="true"
        >

          <div class="dr-envelope-preview"></div>

        </div>


        <!-- LEFT FOLD -->

        <div
          class="dr-envelope-left"
          aria-hidden="true"
        ></div>


        <!-- RIGHT FOLD -->

        <div
          class="dr-envelope-right"
          aria-hidden="true"
        ></div>


        <!-- FRONT POCKET -->

        <div
          class="dr-envelope-front"
          aria-hidden="true"
        ></div>


        <!-- TOP FLAP -->

        <div
          class="dr-envelope-flap"
          aria-hidden="true"
        ></div>


        <!-- WAX SEAL -->

        <button
          class="dr-envelope-seal"
          type="button"
          aria-label="Open the personal message"
        >

          <span
            class="dr-envelope-wax"
            aria-hidden="true"
          ></span>

          <span
            class="dr-envelope-illumination"
            aria-hidden="true"
          ></span>

          <span
            class="dr-envelope-monogram"
            aria-hidden="true"
          >

            <img
              src="${CONFIG.monogram}"
              alt=""
              draggable="false"
            >

          </span>

        </button>

      </div>


      <!-- INSTRUCTION -->

      <div class="dr-envelope-instruction">

        <div
          class="dr-envelope-arrow"
          aria-hidden="true"
        >

          <svg viewBox="0 0 24 36">

            <path d="M12 33V3"></path>

            <path d="M3 12L12 3L21 12"></path>

          </svg>

        </div>

        <p class="dr-envelope-instruction-text">
          Tap the seal to open
        </p>

      </div>

    </div>

  `;

  document.body.appendChild(
    experience
  );

  /* =======================================================
     BUILD LETTER PREVIEW FROM ORIGINAL CONTENT
     ======================================================= */

  const previewContainer =
    experience.querySelector(
      ".dr-envelope-preview"
    );

  const previewContent =
    paperContent.cloneNode(true);

  /* =======================================================
     PREVIEW SAFETY

     The preview is decorative.

     Remove duplicate IDs and interactive elements.
     ======================================================= */

  previewContent
    .querySelectorAll("[id]")
    .forEach(element => {

      element.removeAttribute("id");

    });

  previewContent
    .querySelectorAll(
      "button, input, textarea, select, iframe"
    )
    .forEach(element => {

      element.remove();

    });

  previewContent
    .querySelectorAll("a")
    .forEach(element => {

      element.removeAttribute("href");

    });

  previewContainer.appendChild(
    previewContent
  );

  /* =======================================================
     POSITION BELOW EXISTING NAVIGATION

     This is what preserves the original header.

     The envelope fills the space beneath the navigation.
     ======================================================= */

  function updateExperiencePosition() {

    if (destroyed) {
      return;
    }

    const headerRect =
      header.getBoundingClientRect();

    const navRect =
      navigation.getBoundingClientRect();

    const bottom =
      Math.max(
        headerRect.bottom,
        navRect.bottom
      );

    const top =
      Math.max(
        0,
        Math.ceil(bottom + 12)
      );

    experience.style.setProperty(
      "--dr-envelope-top",
      `${top}px`
    );

  }

  updateExperiencePosition();

  window.addEventListener(
    "resize",
    updateExperiencePosition,
    { passive: true }
  );

  /* =======================================================
     PRELOAD MONOGRAM
     ======================================================= */

  const monogramPreload = new Image();

  monogramPreload.src =
    CONFIG.monogram;

  /* =======================================================
     OPENING CONTROL
     ======================================================= */

  const seal = experience.querySelector(
    ".dr-envelope-seal"
  );

  function revealOriginalLetter() {

    /* Make the original page visible underneath
       the envelope before beginning the fade. */

    main.style.visibility =
      previousMainVisibility;

    main.style.pointerEvents =
      previousMainPointerEvents;

    /* Disable the old initial animation so the
       letter does not replay a second entrance. */

    paper.style.animation =
      "none";

    paper.style.visibility =
      "visible";

    paper.style.opacity =
      "1";

    paper.style.transition =
      "none";

    paper.classList.add(
      "mobile-paper-visible"
    );

    paperContent.style.opacity =
      "1";

    paperContent.style.transform =
      "none";

    paperContent.style.animation =
      "none";

    paperContent.style.transition =
      "none";

    /* Preserve the existing letter-reveal callback. */

    if (
      typeof window.drEnvelopeRevealLetter ===
      "function"
    ) {

      window.drEnvelopeRevealLetter();

    }

    /* Fade the envelope away without moving
       the page or changing scroll position. */

    experience.classList.add(
      "dr-handoff"
    );

  }

  /* =======================================================
     CLEANUP
     ======================================================= */

  function cleanup() {

    if (destroyed) {
      return;
    }

    destroyed = true;

    /* Restore page scrolling. */

    document.documentElement.style.overflow =
      previousHtmlOverflow;

    document.body.style.overflow =
      previousBodyOverflow;

    document.body.classList.remove(
      "dr-envelope-active"
    );

    /* Restore original content interaction. */

    main.style.visibility =
      previousMainVisibility;

    main.style.pointerEvents =
      previousMainPointerEvents;

    /* Ensure the actual letter remains visible. */

    paper.classList.add(
      "mobile-paper-visible"
    );

    paper.style.opacity =
      "1";

    paper.style.visibility =
      "visible";

    paper.style.animation =
      "none";

    paper.style.transition =
      previousPaperTransition;

    paperContent.style.opacity =
      "1";

    paperContent.style.transform =
      "none";

    paperContent.style.animation =
      "none";

    paperContent.style.transition =
      previousPaperContentTransition;

    /* Remove temporary presentation. */

    experience.remove();

    style.remove();

    window.removeEventListener(
      "resize",
      updateExperiencePosition
    );

  }

  /* =======================================================
     OPEN THE ENVELOPE
     ======================================================= */

  function openEnvelope() {

    if (
      opened ||
      destroyed
    ) {
      return;
    }

    opened = true;

    seal.disabled = true;

    /* Phase 1:
       Open the flap. */

    experience.classList.add(
      "dr-opening"
    );

    /* Phase 2:
       Letter rises partially from the pocket.

       This is handled by the CSS transition.

       The page does not scroll. */

    /* Phase 3:
       Reveal the actual letter underneath. */

    window.setTimeout(() => {

      if (destroyed) {
        return;
      }

      revealOriginalLetter();

    }, CONFIG.transitionDelay);

    /* Phase 4:
       Remove temporary envelope and unlock scroll. */

    window.setTimeout(() => {

      cleanup();

    }, CONFIG.cleanupDelay);

  }

  seal.addEventListener(
    "click",
    openEnvelope
  );

  /* =======================================================
     DESKTOP SAFETY

     If the viewport changes to desktop size while
     the envelope is active, restore the page.
     ======================================================= */

  function handleViewportChange(event) {

    if (
      !event.matches &&
      !destroyed
    ) {

      cleanup();

    }

  }

  mobileQuery.addEventListener(
    "change",
    handleViewportChange
  );

  /* =======================================================
     IMPORTANT

     NO:
     - scrollTo()
     - scrollIntoView()
     - sessionStorage
     - localStorage
     - automatic page repositioning

     Every fresh page load initializes the envelope
     again on mobile.

     ======================================================= */

})();
