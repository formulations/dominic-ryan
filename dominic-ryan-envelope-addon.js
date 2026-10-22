/* ============================================================
   DOMINIC RYAN
   A PERSONAL MESSAGE — THE ART OF CORRESPONDENCE

   MOBILE-ONLY EDITORIAL OPENING EXPERIENCE

   EXPERIENCE:
   01. An ivory envelope rests beneath the site navigation.
   02. The DR monogram sits within a champagne oval seal.
   03. Tap the seal or begin scrolling to initiate the sequence.
   04. The seal releases and the envelope flap unfolds.
   05. The letter rises from the envelope.
   06. The envelope recedes.
   07. The actual personal message comes into view.

   DESKTOP:
   Completely unaffected.

   REQUIRED EXISTING ELEMENTS:
   .letter-wrap
   .paper
   .paper-content

   REQUIRED ASSET:
   /dr-reveals-removebg-preview.png
   ============================================================ */

(() => {
  "use strict";

  /* ============================================================
     01 — MOBILE ONLY
     ============================================================ */

  const mobileQuery = window.matchMedia("(max-width: 760px)");

  if (!mobileQuery.matches) {
    return;
  }

  const letterWrap = document.querySelector(".letter-wrap");
  const actualPaper = document.querySelector(".paper");

  if (!letterWrap || !actualPaper) {
    return;
  }

  if (document.getElementById("dr-correspondence")) {
    return;
  }

  /* ============================================================
     02 — CONFIGURATION
     ============================================================ */

  const CONFIG = {
    monogram: "/dr-reveals-removebg-preview.png",

    timings: {
      seal: 520,
      flap: 1100,
      letter: 1450,
      envelopeExit: 850,
      handoff: 850
    },

    easing: {
      ceremonial: "cubic-bezier(.22,.61,.36,1)",
      expressive: "cubic-bezier(.16,1,.3,1)"
    }
  };

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  let started = false;
  let completed = false;
  let touchStartY = null;
  let sequenceTimers = [];
  let previousScrollBehavior = "";

  /* ============================================================
     03 — CREATE THE EXPERIENCE
     ============================================================ */

  const experience = document.createElement("section");

  experience.id = "dr-correspondence";

  experience.setAttribute(
    "aria-label",
    "Open a personal message from Dominic Ryan"
  );

  experience.innerHTML = `

    <div class="dr-correspondence-scene">

      <div class="dr-correspondence-atmosphere"
           aria-hidden="true">
      </div>

      <div class="dr-envelope-composition">

        <!-- LETTER: THE REVEAL OBJECT -->

        <div class="dr-letter-reveal"
             aria-hidden="true">

          <div class="dr-letter-reveal-inner">

            <span class="dr-letter-reveal-kicker">
              A Personal Message
            </span>

            <span class="dr-letter-reveal-heading">
              I’m Dominic Ryan.
            </span>

            <span class="dr-letter-reveal-rule"></span>

          </div>

        </div>

        <!-- ENVELOPE -->

        <div class="dr-envelope-object">

          <div class="dr-envelope-shadow"
               aria-hidden="true">
          </div>

          <div class="dr-envelope-body">

            <!-- INTERIOR -->

            <div class="dr-envelope-interior"></div>

            <!-- BACK FOLD -->

            <div class="dr-envelope-back"></div>

            <!-- OPENING FLAP -->

            <div class="dr-envelope-flap">

              <svg
                viewBox="0 0 600 210"
                preserveAspectRatio="none"
                aria-hidden="true"
              >

                <defs>

                  <linearGradient
                    id="dr-flap-gradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >

                    <stop
                      offset="0%"
                      stop-color="#fffdfa"
                    />

                    <stop
                      offset="56%"
                      stop-color="#f5f0e9"
                    />

                    <stop
                      offset="100%"
                      stop-color="#e9e0d6"
                    />

                  </linearGradient>

                </defs>

                <path
                  d="M 0 0 L 600 0 L 300 210 Z"
                  fill="url(#dr-flap-gradient)"
                  stroke="#c6b5a5"
                  stroke-width="1.15"
                  vector-effect="non-scaling-stroke"
                />

              </svg>

            </div>

            <!-- FRONT POCKET -->

            <div class="dr-envelope-front">

              <svg
                viewBox="0 0 600 390"
                preserveAspectRatio="none"
                aria-hidden="true"
              >

                <defs>

                  <linearGradient
                    id="dr-envelope-left-gradient"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                  >

                    <stop
                      offset="0%"
                      stop-color="#fffdfa"
                    />

                    <stop
                      offset="100%"
                      stop-color="#eee7df"
                    />

                  </linearGradient>

                  <linearGradient
                    id="dr-envelope-right-gradient"
                    x1="1"
                    y1="0"
                    x2="0"
                    y2="1"
                  >

                    <stop
                      offset="0%"
                      stop-color="#fcfaf7"
                    />

                    <stop
                      offset="100%"
                      stop-color="#ece4db"
                    />

                  </linearGradient>

                  <linearGradient
                    id="dr-envelope-bottom-gradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >

                    <stop
                      offset="0%"
                      stop-color="#f9f5ef"
                    />

                    <stop
                      offset="100%"
                      stop-color="#eae1d7"
                    />

                  </linearGradient>

                </defs>

                <!-- LEFT FOLD -->

                <path
                  d="M 0 0 L 300 210 L 0 390 Z"
                  fill="url(#dr-envelope-left-gradient)"
                  stroke="#c8b8a9"
                  stroke-width="1.05"
                  vector-effect="non-scaling-stroke"
                />

                <!-- RIGHT FOLD -->

                <path
                  d="M 600 0 L 300 210 L 600 390 Z"
                  fill="url(#dr-envelope-right-gradient)"
                  stroke="#c8b8a9"
                  stroke-width="1.05"
                  vector-effect="non-scaling-stroke"
                />

                <!-- BOTTOM FOLD -->

                <path
                  d="M 0 390 L 300 166 L 600 390 Z"
                  fill="url(#dr-envelope-bottom-gradient)"
                  stroke="#c4b3a4"
                  stroke-width="1.1"
                  vector-effect="non-scaling-stroke"
                />

              </svg>

            </div>

            <!-- SEAL -->

            <button
              class="dr-envelope-seal"
              type="button"
              aria-label="Open the personal message"
            >

              <span class="dr-envelope-seal-surface">

                <span class="dr-envelope-seal-inner">

                  <img
                    src="${CONFIG.monogram}"
                    alt=""
                    draggable="false"
                  >

                </span>

              </span>

            </button>

          </div>

        </div>

      </div>

      <!-- EDITORIAL INSTRUCTION -->

      <div class="dr-correspondence-instruction">

        <span class="dr-correspondence-arrow"
              aria-hidden="true">

          <svg
            viewBox="0 0 24 24"
            fill="none"
          >

            <path
              d="M12 20V4M5.5 10.5L12 4L18.5 10.5"
              stroke="currentColor"
              stroke-width="1.15"
              stroke-linecap="round"
              stroke-linejoin="round"
            />

          </svg>

        </span>

        <span class="dr-correspondence-instruction-text">
          𝑇𝑎𝑝 𝑡ℎ𝑒 𝑠𝑒𝑎𝑙 𝑜𝑟 𝑠𝑐𝑟𝑜𝑙𝑙 𝑡𝑜 𝑜𝑝𝑒𝑛.
        </span>

      </div>

    </div>
  `;

  letterWrap.parentNode.insertBefore(
    experience,
    letterWrap
  );

  /* ============================================================
     04 — STYLING
     ============================================================ */

  const style = document.createElement("style");

  style.id = "dr-correspondence-styles";

  style.textContent = `

    @media (max-width:760px) {

      /* ========================================================
         EXPERIENCE CONTAINER
         ======================================================== */

      #dr-correspondence {

        --dr-ivory: #f7f3ed;
        --dr-paper: #fbf8f2;
        --dr-champagne: #cbb4a2;
        --dr-taupe: #9d8873;
        --dr-ink: #51463e;

        position: relative;

        width: 100%;

        height: var(--dr-scene-height, 72svh);

        min-height: 430px;

        overflow: hidden;

        isolation: isolate;

        background: transparent;

        z-index: 2;

        transition:
          height 850ms cubic-bezier(.22,.61,.36,1),
          min-height 850ms cubic-bezier(.22,.61,.36,1),
          opacity 650ms ease;

      }

      #dr-correspondence.dr-finished {

        height: 0 !important;

        min-height: 0 !important;

        opacity: 0;

        pointer-events: none;

      }

      .dr-correspondence-scene {

        position: relative;

        width: 100%;

        height: 100%;

        min-height: inherit;

        display: flex;

        align-items: center;

        justify-content: center;

        flex-direction: column;

        overflow: hidden;

      }

      /* ========================================================
         ATMOSPHERE
         ======================================================== */

      .dr-correspondence-atmosphere {

        position: absolute;

        inset: 0;

        pointer-events: none;

        background:
          radial-gradient(
            ellipse 72% 49% at 50% 52%,
            rgba(255,255,255,.36) 0%,
            rgba(255,255,255,.12) 47%,
            rgba(255,255,255,0) 100%
          );

        opacity: .85;

      }

      /* ========================================================
         OBJECT COMPOSITION
         ======================================================== */

      .dr-envelope-composition {

        position: relative;

        width: min(83vw, 460px);

        aspect-ratio: 600 / 390;

        margin-top: -10px;

        perspective: 1200px;

        transform-style: preserve-3d;

        flex: none;

        z-index: 3;

        transition:
          transform 850ms cubic-bezier(.22,.61,.36,1),
          opacity 850ms ease,
          filter 850ms ease;

      }

      .dr-envelope-object {

        position: absolute;

        inset: 0;

        transform-style: preserve-3d;

        z-index: 3;

        transition:
          transform 950ms cubic-bezier(.22,.61,.36,1),
          opacity 800ms ease;

      }

      .dr-envelope-shadow {

        position: absolute;

        left: 8%;
        right: 8%;
        bottom: -18px;

        height: 36px;

        border-radius: 50%;

        background:
          rgba(89,68,52,.13);

        filter: blur(20px);

        z-index: -1;

        transition:
          opacity 850ms ease,
          transform 850ms ease;

      }

      /* ========================================================
         ENVELOPE BODY
         ======================================================== */

      .dr-envelope-body {

        position: absolute;

        inset: 0;

        transform-style: preserve-3d;

        background: #f8f4ef;

        border:
          1px solid rgba(167,140,119,.45);

        box-shadow:
          0 25px 45px rgba(75,57,43,.10),
          0 8px 16px rgba(75,57,43,.045),
          inset 0 1px 0 rgba(255,255,255,.75);

      }

      .dr-envelope-interior {

        position: absolute;

        inset: 0;

        background:
          linear-gradient(
            180deg,
            #e9e0d6 0%,
            #f6f0e8 32%,
            #fbf8f2 100%
          );

        box-shadow:
          inset 0 12px 22px rgba(92,69,53,.08);

        z-index: 1;

      }

      .dr-envelope-back {

        position: absolute;

        inset: 0;

        background:
          linear-gradient(
            135deg,
            #fffdfa,
            #f1eae1
          );

        z-index: 0;

      }

      /* ========================================================
         TOP FLAP
         ======================================================== */

      .dr-envelope-flap {

        position: absolute;

        top: 0;
        left: 0;

        width: 100%;

        height: 54%;

        transform-origin: 50% 0%;

        transform: rotateX(0deg);

        transform-style: preserve-3d;

        backface-visibility: visible;

        -webkit-backface-visibility: visible;

        z-index: 5;

        filter:
          drop-shadow(
            0 3px 3px rgba(75,57,43,.045)
          );

        transition:
          transform 1100ms cubic-bezier(.16,1,.3,1),
          filter 850ms ease;

      }

      .dr-envelope-flap svg {

        display: block;

        width: 100%;
        height: 100%;

        overflow: visible;

      }

      /* ========================================================
         FRONT FOLDS
         ======================================================== */

      .dr-envelope-front {

        position: absolute;

        inset: 0;

        z-index: 6;

        pointer-events: none;

      }

      .dr-envelope-front svg {

        display: block;

        width: 100%;
        height: 100%;

      }

      /* ========================================================
         CHAMPAGNE MONOGRAM SEAL

         Oval proportions are deliberate:
         the original DR artwork is taller than a typical
         circular seal comfortably accommodates.
         ======================================================== */

      .dr-envelope-seal {

        position: absolute;

        left: 50%;
        top: 53%;

        transform:
          translate(-50%, -50%);

        width: clamp(76px, 17vw, 100px);

        height: clamp(91px, 20vw, 118px);

        padding: 0;

        border: 0;

        border-radius: 49%;

        background: transparent;

        cursor: pointer;

        z-index: 10;

        -webkit-tap-highlight-color: transparent;

        touch-action: manipulation;

        transition:
          opacity 520ms ease,
          transform 520ms cubic-bezier(.22,.61,.36,1),
          filter 520ms ease;

      }

      .dr-envelope-seal:focus-visible {

        outline: 2px solid #51463e;

        outline-offset: 6px;

      }

      .dr-envelope-seal-surface {

        position: absolute;

        inset: 0;

        display: block;

        border-radius: inherit;

        background:
          radial-gradient(
            ellipse at 32% 23%,
            #e9d7c9 0%,
            #d5baa7 34%,
            #b99a86 76%,
            #a98b79 100%
          );

        border:
          1px solid rgba(255,248,241,.72);

        box-shadow:
          0 5px 11px rgba(76,52,37,.19),
          0 2px 3px rgba(76,52,37,.10),
          inset 0 2px 3px rgba(255,255,255,.65),
          inset 0 -4px 6px rgba(92,59,41,.12);

      }

      .dr-envelope-seal-surface::before {

        content: "";

        position: absolute;

        inset: 5px;

        border-radius: inherit;

        border:
          1px solid rgba(255,247,237,.75);

        box-shadow:
          inset 0 1px 2px rgba(96,69,50,.12);

        pointer-events: none;

      }

      .dr-envelope-seal-inner {

        position: absolute;

        inset: 11px 15px;

        display: flex;

        align-items: center;

        justify-content: center;

        overflow: visible;

      }

      .dr-envelope-seal-inner img {

        display: block;

        width: 100%;
        height: 100%;

        object-fit: contain;

        object-position: center;

        opacity: .9;

        filter:
          sepia(.22)
          saturate(.72)
          brightness(.77);

        pointer-events: none;

        user-select: none;

      }

      /* ========================================================
         LETTER OBJECT

         The letter is positioned behind the envelope front.
         It emerges only after the flap begins opening.
         ======================================================== */

      .dr-letter-reveal {

        position: absolute;

        left: 8%;
        right: 8%;

        top: 5%;

        height: 112%;

        background:
          linear-gradient(
            180deg,
            #fffdfa 0%,
            #fbf8f2 100%
          );

        box-shadow:
          0 8px 25px rgba(75,57,43,.08),
          0 1px 3px rgba(75,57,43,.035);

        transform:
          translateY(24%)
          scale(.96);

        transform-origin: center bottom;

        opacity: 0;

        z-index: 4;

        overflow: hidden;

        transition:
          transform 1450ms cubic-bezier(.16,1,.3,1),
          opacity 650ms ease,
          box-shadow 1100ms ease;

      }

      .dr-letter-reveal-inner {

        position: relative;

        width: 100%;
        height: 100%;

        padding:
          15% 10% 10%;

        display: flex;

        flex-direction: column;

        align-items: flex-start;

      }

      .dr-letter-reveal-kicker {

        font-family:
          "DR Avenir Next",
          "Avenir Next",
          Arial,
          sans-serif;

        font-size:
          clamp(8px, 2vw, 11px);

        font-weight: 500;

        letter-spacing: .11em;

        text-transform: uppercase;

        color: #84776d;

      }

      .dr-letter-reveal-heading {

        margin-top: 15%;

        font-family:
          "DR Didot",
          Didot,
          Georgia,
          serif;

        font-size:
          clamp(20px, 5vw, 31px);

        font-weight: 400;

        line-height: 1.2;

        color: #51463e;

      }

      .dr-letter-reveal-rule {

        display: block;

        width: 42%;

        height: 1px;

        margin-top: 16%;

        background:
          rgba(132,119,109,.22);

      }

      /* ========================================================
         INSTRUCTION
         ======================================================== */

      .dr-correspondence-instruction {

        position: relative;

        z-index: 4;

        width: 100%;

        margin-top: 46px;

        display: flex;

        flex-direction: column;

        align-items: center;

        justify-content: center;

        gap: 15px;

        text-align: center;

        transition:
          opacity 550ms ease,
          transform 550ms ease;

      }

      .dr-correspondence-arrow {

        display: block;

        width: 23px;
        height: 29px;

        color: #9d8873;

        animation:
          dr-correspondence-arrow-float
          2.6s
          ease-in-out
          infinite;

      }

      .dr-correspondence-arrow svg {

        display: block;

        width: 100%;
        height: 100%;

      }

      @keyframes dr-correspondence-arrow-float {

        0%, 100% {
          transform: translateY(3px);
        }

        50% {
          transform: translateY(-5px);
        }

      }

      .dr-correspondence-instruction-text {

        display: block;

        padding: 0 22px;

        font-family:
          "DR Avenir Next",
          "Avenir Next",
          Georgia,
          serif;

        font-size:
          clamp(15px, 3.6vw, 19px);

        line-height: 1.6;

        font-weight: 400;

        letter-spacing: .015em;

        color: #84776d;

      }

      /* ========================================================
         ANIMATION — SEAL RELEASE
         ======================================================== */

      #dr-correspondence.dr-seal-released
      .dr-envelope-seal {

        opacity: 0;

        transform:
          translate(-50%, -50%)
          scale(.86);

        filter: blur(2px);

        pointer-events: none;

      }

      #dr-correspondence.dr-opening
      .dr-correspondence-instruction {

        opacity: 0;

        transform:
          translateY(9px);

        pointer-events: none;

      }

      /* ========================================================
         ANIMATION — FLAP OPENING
         ======================================================== */

      #dr-correspondence.dr-flap-open
      .dr-envelope-flap {

        transform:
          rotateX(178deg);

        filter:
          drop-shadow(
            0 -4px 8px rgba(75,57,43,.06)
          );

        z-index: 2;

      }

      /* ========================================================
         ANIMATION — LETTER EMERGENCE
         ======================================================== */

      #dr-correspondence.dr-letter-emerging
      .dr-letter-reveal {

        opacity: 1;

        transform:
          translateY(-57%)
          scale(1);

        box-shadow:
          0 18px 40px rgba(75,57,43,.13),
          0 4px 10px rgba(75,57,43,.045);

      }

      /* ========================================================
         ANIMATION — ENVELOPE RECEDES
         ======================================================== */

      #dr-correspondence.dr-envelope-receding
      .dr-envelope-object {

        transform:
          translateY(45px)
          scale(.96);

        opacity: 0;

      }

      #dr-correspondence.dr-envelope-receding
      .dr-envelope-shadow {

        opacity: 0;

        transform: scale(.75);

      }

      /* ========================================================
         ANIMATION — LETTER TRANSITION
         ======================================================== */

      #dr-correspondence.dr-transitioning
      .dr-letter-reveal {

        transform:
          translateY(-62%)
          scale(1.045);

        opacity: 0;

        box-shadow:
          0 12px 25px rgba(75,57,43,.03);

      }

      #dr-correspondence.dr-transitioning
      .dr-envelope-composition {

        opacity: 0;

        filter: blur(3px);

      }

      /* ========================================================
         ACTUAL LETTER

         Prevents the old mobile fade from conflicting
         with the new correspondence sequence.
         ======================================================== */

      body.dr-correspondence-enabled
      .paper {

        animation: none !important;

        opacity: 1 !important;

        transition:
          box-shadow 1.1s ease,
          transform 1.1s cubic-bezier(.22,.61,.36,1) !important;

      }

      body.dr-correspondence-enabled
      .paper-content {

        animation: none !important;

        opacity: 1 !important;

      }

      body.dr-correspondence-enabled
      .letter-wrap {

        transition: none;

      }

      /* ========================================================
         SHORT MOBILE SCREENS
         ======================================================== */

      @media (max-height: 700px) {

        .dr-envelope-composition {

          width: min(72vw, 390px);

          margin-top: -8px;

        }

        .dr-correspondence-instruction {

          margin-top: 30px;

          gap: 9px;

        }

        .dr-correspondence-instruction-text {

          font-size: 14px;

        }

      }

      /* ========================================================
         REDUCED MOTION
         ======================================================== */

      @media (prefers-reduced-motion: reduce) {

        .dr-correspondence-arrow {

          animation: none;

        }

        #dr-correspondence,
        #dr-correspondence * {

          transition-duration: .01ms !important;

          animation-duration: .01ms !important;

        }

      }

    }

  `;

  document.head.appendChild(style);

  document.body.classList.add(
    "dr-correspondence-enabled"
  );

  /* ============================================================
     05 — FIT THE OPENING TO THE AVAILABLE SCREEN

     This is important.

     The original implementation reserved more than a full
     viewport of scrolling space, producing a large empty
     area after the envelope.

     Here, the experience occupies only the space remaining
     beneath the existing header and navigation.

     The opening sequence is timed, not tied to an extended
     scrolling threshold.
     ============================================================ */

  function fitExperience() {

    if (started || completed) {
      return;
    }

    const rect = experience.getBoundingClientRect();

    const viewportHeight =
      window.visualViewport?.height ||
      window.innerHeight;

    const availableHeight =
      Math.max(
        430,
        viewportHeight - Math.max(0, rect.top) - 8
      );

    experience.style.setProperty(
      "--dr-scene-height",
      `${availableHeight}px`
    );

  }

  requestAnimationFrame(fitExperience);

  window.addEventListener(
    "resize",
    fitExperience,
    { passive: true }
  );

  /* ============================================================
     06 — SEQUENCE UTILITIES
     ============================================================ */

  function wait(ms) {

    return new Promise(resolve => {

      const timer = window.setTimeout(
        resolve,
        ms
      );

      sequenceTimers.push(timer);

    });

  }

  function revealStage(className) {

    experience.classList.add(className);

  }

  /* ============================================================
     07 — COMPLETE OPENING SEQUENCE

     The entire sequence runs automatically after one gesture.

     Visitors do not have to keep scrolling to complete
     the opening.
     ============================================================ */

  async function openCorrespondence() {

    if (started || completed) {
      return;
    }

    started = true;

    experience.classList.add("dr-opening");

    const reducedMotion =
      prefersReducedMotion.matches;

    if (reducedMotion) {

      finishCorrespondence(true);

      return;

    }

    /* 01 — RELEASE THE SEAL */

    revealStage("dr-seal-released");

    await wait(360);

    /* 02 — UNFOLD THE ENVELOPE */

    revealStage("dr-flap-open");

    await wait(780);

    /* 03 — DRAW OUT THE LETTER */

    revealStage("dr-letter-emerging");

    await wait(1050);

    /* 04 — ALLOW THE ENVELOPE TO RECEDE */

    revealStage("dr-envelope-receding");

    await wait(550);

    /* 05 — PREPARE THE VISUAL HANDOFF */

    revealStage("dr-transitioning");

    await wait(500);

    /* 06 — REVEAL THE ACTUAL MESSAGE */

    finishCorrespondence(false);

  }

  /* ============================================================
     08 — TRANSITION TO THE REAL LETTER

     No long scroll spacer.
     No second viewport of empty background.
     No additional user gesture required.

     The temporary envelope scene collapses and the actual
     existing letter becomes the destination.
     ============================================================ */

  function finishCorrespondence(immediate = false) {

    if (completed) {
      return;
    }

    completed = true;

    const html = document.documentElement;

    previousScrollBehavior =
      html.style.scrollBehavior;

    html.style.scrollBehavior = "auto";

    /*
       Collapse the introductory scene.

       The original letter remains in the document,
       unchanged and fully readable.
    */

    experience.classList.add("dr-finished");

    /*
       Keep the actual paper in view as the introductory
       scene collapses.

       The first adjustment happens immediately; a second
       adjustment follows the collapse to account for
       its changing height.
    */

    const moveToLetter = () => {

      const paperRect =
        actualPaper.getBoundingClientRect();

      const topPadding = 18;

      const destination =
        window.scrollY +
        paperRect.top -
        topPadding;

      window.scrollTo({
        top: Math.max(0, destination),
        behavior: immediate ? "instant" : "smooth"
      });

    };

    window.setTimeout(
      moveToLetter,
      immediate ? 0 : 170
    );

    window.setTimeout(() => {

      /*
         Remove the completed introduction entirely.

         This guarantees that no invisible spacer
         remains above the letter.
      */

      experience.remove();

      /*
         Restore normal page scrolling.
      */

      html.style.scrollBehavior =
        previousScrollBehavior;

      /*
         Position the real letter naturally.
      */

      actualPaper.scrollIntoView({
        behavior: immediate ? "instant" : "smooth",
        block: "start"
      });

    }, immediate ? 20 : 900);

  }

  /* ============================================================
     09 — TAP TO OPEN
     ============================================================ */

  const seal = experience.querySelector(
    ".dr-envelope-seal"
  );

  seal.addEventListener(
    "click",
    openCorrespondence
  );

  /* ============================================================
     10 — SCROLL TO OPEN

     A deliberate downward gesture triggers the same
     automatic sequence.

     The visitor does not need to scroll through a
     long animation timeline.
     ============================================================ */

  function handleWheel(event) {

    if (started || completed) {
      return;
    }

    if (event.deltaY > 5) {

      event.preventDefault();

      openCorrespondence();

    }

  }

  function handleTouchStart(event) {

    if (started || completed) {
      return;
    }

    touchStartY =
      event.touches[0]?.clientY ?? null;

  }

  function handleTouchMove(event) {

    if (
      started ||
      completed ||
      touchStartY === null
    ) {
      return;
    }

    const currentY =
      event.touches[0]?.clientY;

    if (currentY === undefined) {
      return;
    }

    const movement =
      touchStartY - currentY;

    if (movement > 12) {

      event.preventDefault();

      openCorrespondence();

      touchStartY = null;

    }

  }

  function handleKeyDown(event) {

    if (started || completed) {
      return;
    }

    const openingKeys = [
      "ArrowDown",
      "PageDown",
      " "
    ];

    if (openingKeys.includes(event.key)) {

      event.preventDefault();

      openCorrespondence();

    }

  }

  /*
     Listeners are attached only to the introductory scene
     where possible, avoiding interference with the rest
     of the website.
  */

  experience.addEventListener(
    "wheel",
    handleWheel,
    { passive: false }
  );

  experience.addEventListener(
    "touchstart",
    handleTouchStart,
    { passive: true }
  );

  experience.addEventListener(
    "touchmove",
    handleTouchMove,
    { passive: false }
  );

  /*
     Keyboard opening is enabled only while the
     introduction is visible.
  */

  window.addEventListener(
    "keydown",
    handleKeyDown
  );

  /*
     Some mobile browsers begin scrolling on the page
     rather than within the introductory element.

     Detect that initial downward movement as a fallback.
  */

  let initialScrollY = window.scrollY;

  function handleInitialScroll() {

    if (started || completed) {
      return;
    }

    if (window.scrollY > initialScrollY + 8) {

      openCorrespondence();

    }

  }

  window.addEventListener(
    "scroll",
    handleInitialScroll,
    { passive: true }
  );

  /* ============================================================
     11 — CLEANUP
     ============================================================ */

  function cleanup() {

    window.removeEventListener(
      "keydown",
      handleKeyDown
    );

    window.removeEventListener(
      "scroll",
      handleInitialScroll
    );

    window.removeEventListener(
      "resize",
      fitExperience
    );

  }

  /*
     Cleanup once the animation has completed.
  */

  const originalFinish =
    finishCorrespondence;

  /*
     The completion state is monitored without altering
     the existing site's event handlers.
  */

  const completionObserver =
    new MutationObserver(() => {

      if (completed) {

        cleanup();

        completionObserver.disconnect();

      }

    });

  completionObserver.observe(
    experience,
    {
      attributes: true,
      attributeFilter: ["class"]
    }
  );

  /* ============================================================
     12 — INITIAL STATE
     ============================================================ */

  /*
     Ensure the envelope begins closed.

     The page itself remains scrollable and all original
     content remains present.
  */

  experience.classList.add(
    "dr-correspondence-ready"
  );

})();
