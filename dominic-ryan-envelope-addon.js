/* ============================================================
   DOMINIC RYAN
   THE ART OF CORRESPONDENCE
   MOBILE INTRODUCTION — FINAL REBUILD

   DESIGN PRINCIPLES
   ------------------------------------------------------------
   - Quiet luxury
   - Architectural restraint
   - Authentic stationery proportions
   - No ornamental animation
   - One deliberate interaction
   - Short, graceful reveal
   - Stationary viewport
   - No scrolling during opening
   - No desktop changes

   ============================================================ */

(() => {
  "use strict";

  const MOBILE = window.matchMedia("(max-width: 760px)");

  if (!MOBILE.matches) return;

  const ID = "dr-correspondence";
  const STYLE_ID = "dr-correspondence-css";

  if (document.getElementById(ID)) return;

  const paper = document.querySelector(".paper");
  const paperContent = document.querySelector(".paper-content");

  if (!paper) return;

  const CONFIG = {
    monogram: "/dr-reveals-removebg-preview.png",
    duration: 2800
  };

  let opening = false;
  let finished = false;

  let savedScrollY = window.scrollY;

  const originalStyles = {
    htmlOverflow: document.documentElement.style.overflow,
    bodyOverflow: document.body.style.overflow,
    bodyPosition: document.body.style.position,
    bodyTop: document.body.style.top,
    bodyWidth: document.body.style.width,
    bodyTouchAction: document.body.style.touchAction,
    htmlScrollBehavior: document.documentElement.style.scrollBehavior
  };

  /* ============================================================
     STYLE
     ============================================================ */

  const style = document.createElement("style");

  style.id = STYLE_ID;

  style.textContent = `

    @media (max-width:760px) {

      /* --------------------------------------------------------
         EXPERIENCE
         -------------------------------------------------------- */

      #${ID} {
        --dr-bg: #f2ede6;
        --dr-paper: #fbf8f2;
        --dr-ink: #51463e;
        --dr-muted: #84776d;
        --dr-taupe: #9d8873;

        position: fixed;
        inset: 0;

        width: 100%;
        height: 100vh;
        height: 100dvh;

        z-index: 2147483000;

        display: grid;
        place-items: center;

        overflow: hidden;

        background: var(--dr-bg);

        isolation: isolate;

        opacity: 1;

        -webkit-font-smoothing: antialiased;
        -webkit-tap-highlight-color: transparent;
      }

      #${ID},
      #${ID} * {
        box-sizing: border-box;
      }

      /* --------------------------------------------------------
         STAGE
         -------------------------------------------------------- */

      #${ID} .dr-stage {
        position: relative;

        width: 100%;
        height: 100%;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        padding: 28px 20px;

        transform: translateY(-8px);
      }

      /* --------------------------------------------------------
         ENVELOPE GROUP
         -------------------------------------------------------- */

      #${ID} .dr-envelope {
        position: relative;

        width: min(82vw, 370px);
        aspect-ratio: 1.56;

        flex: none;

        perspective: 1200px;

        transform-style: preserve-3d;

        filter:
          drop-shadow(0 16px 22px rgba(81,70,62,.095));

        transition:
          transform 850ms cubic-bezier(.22,.61,.36,1),
          opacity 700ms ease,
          filter 850ms ease;
      }

      /* --------------------------------------------------------
         BACK OF ENVELOPE
         -------------------------------------------------------- */

      #${ID} .dr-envelope-back {
        position: absolute;
        inset: 0;

        background: #f4eee6;

        border: 1px solid rgba(119,99,81,.12);

        z-index: 1;
      }

      /* --------------------------------------------------------
         LETTER
         -------------------------------------------------------- */

      #${ID} .dr-letter {
        position: absolute;

        left: 7%;
        right: 7%;
        top: 8%;

        height: 94%;

        background: var(--dr-paper);

        border: 1px solid rgba(119,99,81,.08);

        box-shadow:
          0 5px 13px rgba(81,70,62,.055);

        z-index: 2;

        transform: translateY(10%);

        will-change: transform;

        transition:
          transform 1150ms cubic-bezier(.16,1,.3,1),
          box-shadow 1150ms ease;
      }

      #${ID} .dr-letter-inner {
        padding: 24px 22px;
      }

      #${ID} .dr-letter-kicker {
        font-family:
          "DR Avenir Next",
          "Avenir Next",
          Arial,
          sans-serif;

        font-size: 9px;
        font-weight: 500;

        letter-spacing: .13em;
        text-transform: uppercase;

        color: var(--dr-muted);
      }

      #${ID} .dr-letter-line {
        width: 100%;
        height: 1px;

        margin-top: 15px;

        background: rgba(81,70,62,.13);
      }

      #${ID} .dr-letter-name {
        margin-top: 19px;

        font-family:
          "DR Didot",
          Didot,
          Georgia,
          serif;

        font-size: clamp(19px, 5vw, 24px);

        font-weight: 400;

        color: var(--dr-ink);
      }

      /* --------------------------------------------------------
         ENVELOPE FACE

         ONE COORDINATED SVG.
         NO MISALIGNED CSS TRIANGLES.
         -------------------------------------------------------- */

      #${ID} .dr-envelope-face {
        position: absolute;
        inset: 0;

        width: 100%;
        height: 100%;

        z-index: 5;

        pointer-events: none;
      }

      #${ID} .dr-envelope-face svg {
        display: block;
        width: 100%;
        height: 100%;
      }

      /* --------------------------------------------------------
         OPENING FLAP
         -------------------------------------------------------- */

      #${ID} .dr-envelope-flap {
        position: absolute;

        top: 0;
        left: 0;

        width: 100%;
        height: 55%;

        transform-origin: center top;

        transform: rotateX(0deg);

        z-index: 7;

        transform-style: preserve-3d;

        transition:
          transform 850ms cubic-bezier(.22,.61,.36,1);
      }

      #${ID} .dr-envelope-flap svg {
        display: block;
        width: 100%;
        height: 100%;
        overflow: visible;
      }

      /* --------------------------------------------------------
         SEAL

         SMALL, MATTE, SOFTLY SQUARED.
         -------------------------------------------------------- */

      #${ID} .dr-seal {
        position: absolute;

        left: 50%;
        top: 54%;

        width: 62px;
        height: 62px;

        transform: translate(-50%, -50%);

        z-index: 20;

        display: grid;
        place-items: center;

        padding: 0;

        background: #9d8873;

        border: 1px solid rgba(255,255,255,.12);

        border-radius: 12px;

        box-shadow:
          0 3px 7px rgba(81,70,62,.13);

        cursor: pointer;

        appearance: none;
        -webkit-appearance: none;

        touch-action: manipulation;

        transition:
          opacity 320ms ease,
          transform 420ms cubic-bezier(.22,.61,.36,1);
      }

      #${ID} .dr-seal::before {
        content: "";

        position: absolute;

        inset: 4px;

        border: 1px solid rgba(251,248,242,.25);

        border-radius: 8px;

        pointer-events: none;
      }

      #${ID} .dr-seal img {
        display: block;

        width: 54px;
        height: 54px;

        object-fit: contain;

        filter: brightness(0) invert(1);

        opacity: .95;

        pointer-events: none;
        user-select: none;
      }

      #${ID} .dr-seal:focus-visible {
        outline: 2px solid var(--dr-ink);
        outline-offset: 5px;
      }

      /* --------------------------------------------------------
         INSTRUCTION
         -------------------------------------------------------- */

      #${ID} .dr-instruction {
        position: relative;

        margin-top: 38px;

        font-family:
          "DR Avenir Next",
          "Avenir Next",
          Georgia,
          serif;

        font-size: 15px;
        font-weight: 400;

        line-height: 1.5;
        letter-spacing: .01em;

        color: var(--dr-muted);

        text-align: center;

        transition:
          opacity 300ms ease,
          transform 300ms ease;
      }

      /* --------------------------------------------------------
         SEQUENCE
         -------------------------------------------------------- */

      #${ID}.dr-opening .dr-seal {
        opacity: 0;

        transform:
          translate(-50%, -50%)
          scale(.88);

        pointer-events: none;
      }

      #${ID}.dr-opening .dr-instruction {
        opacity: 0;
        transform: translateY(5px);
      }

      #${ID}.dr-flap-open .dr-envelope-flap {
        transform: rotateX(-178deg);
        z-index: 3;
      }

      #${ID}.dr-letter-out .dr-letter {
        transform: translateY(-68%);

        box-shadow:
          0 15px 28px rgba(81,70,62,.10);
      }

      #${ID}.dr-exit .dr-envelope {
        transform:
          translateY(24px)
          scale(.965);

        opacity: 0;

        filter:
          drop-shadow(0 5px 8px rgba(81,70,62,.02));
      }

      #${ID}.dr-exit {
        transition: opacity 650ms ease;
        opacity: 0;
      }

      /* --------------------------------------------------------
         ACTUAL LETTER VISIBILITY
         -------------------------------------------------------- */

      body.dr-correspondence-ready .paper,
      body.dr-correspondence-complete .paper {
        opacity: 1 !important;
        animation: none !important;
      }

      body.dr-correspondence-ready .paper-content,
      body.dr-correspondence-complete .paper-content {
        opacity: 1 !important;
        animation: none !important;
      }

      /* --------------------------------------------------------
         SHORT SCREENS
         -------------------------------------------------------- */

      @media (max-height: 680px) {

        #${ID} .dr-envelope {
          width: min(72vw, 310px);
        }

        #${ID} .dr-instruction {
          margin-top: 28px;
        }

      }

      /* --------------------------------------------------------
         REDUCED MOTION
         -------------------------------------------------------- */

      @media (prefers-reduced-motion: reduce) {

        #${ID} *,
        #${ID} {
          transition-duration: .01ms !important;
        }

      }

    }

  `;

  document.head.appendChild(style);

  /* ============================================================
     MARKUP
     ============================================================ */

  const scene = document.createElement("div");

  scene.id = ID;

  scene.setAttribute("role", "dialog");
  scene.setAttribute("aria-modal", "true");
  scene.setAttribute(
    "aria-label",
    "Open a personal message from Dominic Ryan"
  );

  scene.innerHTML = `

    <div class="dr-stage">

      <div class="dr-envelope">

        <div class="dr-envelope-back"></div>

        <div class="dr-letter">

          <div class="dr-letter-inner">

            <div class="dr-letter-kicker">
              A Personal Message
            </div>

            <div class="dr-letter-line"></div>

            <div class="dr-letter-name">
              Dominic Ryan
            </div>

          </div>

        </div>

        <!-- FRONT FOLDS -->

        <div class="dr-envelope-face">

          <svg
            viewBox="0 0 600 385"
            preserveAspectRatio="none"
            aria-hidden="true"
          >

            <path
              d="M0 0 L300 205 L0 385 Z"
              fill="#F2EBE2"
            />

            <path
              d="M600 0 L300 205 L600 385 Z"
              fill="#F0E8DE"
            />

            <path
              d="M0 385 L300 185 L600 385 Z"
              fill="#F7F2EB"
            />

            <path
              d="M0 385 L300 185 L600 385"
              fill="none"
              stroke="#D8CCBF"
              stroke-width="1.2"
              vector-effect="non-scaling-stroke"
            />

            <path
              d="M0 0 L300 205 L600 0"
              fill="none"
              stroke="#E0D5C8"
              stroke-width="1"
              vector-effect="non-scaling-stroke"
            />

          </svg>

        </div>

        <!-- TOP FLAP -->

        <div class="dr-envelope-flap">

          <svg
            viewBox="0 0 600 215"
            preserveAspectRatio="none"
            aria-hidden="true"
          >

            <path
              d="M0 0 L600 0 L300 215 Z"
              fill="#F6F0E8"
              stroke="#D8CCBF"
              stroke-width="1"
              vector-effect="non-scaling-stroke"
            />

          </svg>

        </div>

        <!-- SEAL -->

        <button
          class="dr-seal"
          type="button"
          aria-label="Open the personal message"
        >

          <img
            src="${CONFIG.monogram}"
            alt=""
            draggable="false"
          >

        </button>

      </div>

      <div class="dr-instruction">
        𝑇𝑎𝑝 𝑡ℎ𝑒 𝑠𝑒𝑎𝑙.
      </div>

    </div>

  `;

  document.body.appendChild(scene);

  const seal = scene.querySelector(".dr-seal");

  /* ============================================================
     SCROLL LOCK

     LOCKS THE ENTIRE PAGE, INCLUDING MOBILE TOUCH SCROLLING.
     ============================================================ */

  function lockScroll() {

    savedScrollY = window.scrollY;

    document.documentElement.style.overflow = "hidden";

    document.body.style.overflow = "hidden";

    document.body.style.position = "fixed";

    document.body.style.top = `-${savedScrollY}px`;

    document.body.style.width = "100%";

    document.body.style.touchAction = "none";

  }

  function unlockScroll() {

    document.documentElement.style.overflow =
      originalStyles.htmlOverflow;

    document.body.style.overflow =
      originalStyles.bodyOverflow;

    document.body.style.position =
      originalStyles.bodyPosition;

    document.body.style.top =
      originalStyles.bodyTop;

    document.body.style.width =
      originalStyles.bodyWidth;

    document.body.style.touchAction =
      originalStyles.bodyTouchAction;

  }

  /* ============================================================
     PREPARE EXISTING LETTER
     ============================================================ */

  function prepareLetter() {

    document.body.classList.add(
      "dr-correspondence-ready"
    );

    paper.classList.add("mobile-paper-visible");

    if (paperContent) {
      paperContent.style.opacity = "1";
    }

  }

  /* ============================================================
     OPENING SEQUENCE
     ============================================================ */

  function openEnvelope() {

    if (opening || finished) return;

    opening = true;

    seal.disabled = true;

    scene.classList.add("dr-opening");

    const reducedMotion =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

    if (reducedMotion) {
      finish();
      return;
    }

    window.setTimeout(() => {

      scene.classList.add("dr-flap-open");

    }, 280);

    window.setTimeout(() => {

      scene.classList.add("dr-letter-out");

    }, 820);

    window.setTimeout(() => {

      prepareLetter();

      scene.classList.add("dr-exit");

    }, 2050);

    window.setTimeout(() => {

      finish();

    }, CONFIG.duration);

  }

  /* ============================================================
     FINISH

     POSITION THE REAL LETTER WHILE THE INTRODUCTION
     STILL COVERS THE SCREEN.
     ============================================================ */

  function finish() {

    if (finished) return;

    finished = true;

    prepareLetter();

    document.documentElement.style.scrollBehavior = "auto";

    /*
       Remove the fixed body positioning before measuring
       the actual document.
    */

    unlockScroll();

    /*
       The introduction remains over the page during
       the position adjustment.
    */

    const rect = paper.getBoundingClientRect();

    const destination =
      window.scrollY + rect.top - 16;

    window.scrollTo({
      top: Math.max(0, destination),
      left: 0,
      behavior: "instant"
    });

    document.documentElement.style.scrollBehavior =
      originalStyles.htmlScrollBehavior;

    document.body.classList.remove(
      "dr-correspondence-ready"
    );

    document.body.classList.add(
      "dr-correspondence-complete"
    );

    scene.remove();

  }

  /* ============================================================
     INTERACTION
     ============================================================ */

  seal.addEventListener("click", openEnvelope);

  /* ============================================================
     INITIALIZATION
     ============================================================ */

  prepareLetter();

  lockScroll();

  try {
    seal.focus({ preventScroll: true });
  } catch (_) {
    seal.focus();
  }

})();
