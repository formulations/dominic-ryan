/* ============================================================
   DOMINIC RYAN
   A PERSONAL MESSAGE — THE CORRESPONDENCE EXPERIENCE

   MOBILE ONLY

   DESIGN
   - Warm ivory correspondence envelope
   - Softly squared, matte taupe seal
   - Original DR monogram artwork
   - Restrained dimensional paper construction
   - No metallic gradients
   - No decorative ribbon

   INTERACTION
   - Tap the seal to open
   - No scroll-to-open
   - No additional gestures
   - Stationary viewport throughout animation
   - Automatic transition to actual personal message
   - Scrolling restored after completion

   DESKTOP
   - Completely unaffected

   ============================================================ */

(() => {
  "use strict";

  /* ============================================================
     CONFIGURATION
     ============================================================ */

  const MOBILE_QUERY = "(max-width: 760px)";

  const MONOGRAM_SRC =
    "/dr-reveals-removebg-preview.png";

  const EXPERIENCE_ID =
    "dr-correspondence-experience";

  const STYLE_ID =
    "dr-correspondence-styles";

  const COLORS = {
    background: "#F2EDE6",
    envelope: "#F7F2E9",
    envelopeLight: "#FBF8F2",
    envelopeShadow: "#E7DDD0",
    envelopeDeep: "#DCD0C1",
    paper: "#FBF8F2",
    seal: "#9D8873",
    sealBorder: "#B7A694",
    sealInk: "#F8F3EC",
    ink: "#51463E",
    muted: "#84776D"
  };

  const TIMING = {
    seal: 520,
    flap: 1250,
    letter: 2350,
    dissolve: 3250,
    complete: 4100
  };

  /* ============================================================
     MOBILE CHECK
     ============================================================ */

  if (!window.matchMedia(MOBILE_QUERY).matches) {
    return;
  }

  if (document.getElementById(EXPERIENCE_ID)) {
    return;
  }

  const actualLetter =
    document.querySelector(".letter-wrap");

  const actualPaper =
    document.querySelector(".paper");

  const actualPaperContent =
    document.querySelector(".paper-content");

  if (!actualLetter || !actualPaper) {
    return;
  }

  /* ============================================================
     STATE
     ============================================================ */

  let opening = false;
  let completed = false;

  let previousBodyOverflow = "";
  let previousHtmlOverflow = "";

  let previousBodyTouchAction = "";
  let previousHtmlTouchAction = "";

  let previousScrollBehavior = "";

  let animationTimers = [];

  /* ============================================================
     STYLES
     ============================================================ */

  const style = document.createElement("style");

  style.id = STYLE_ID;

  style.textContent = `

    /* ========================================================
       FONTS
       ======================================================== */

    #${EXPERIENCE_ID} {
      --dr-bg: ${COLORS.background};
      --dr-envelope: ${COLORS.envelope};
      --dr-envelope-light: ${COLORS.envelopeLight};
      --dr-envelope-shadow: ${COLORS.envelopeShadow};
      --dr-envelope-deep: ${COLORS.envelopeDeep};
      --dr-paper: ${COLORS.paper};
      --dr-seal: ${COLORS.seal};
      --dr-seal-border: ${COLORS.sealBorder};
      --dr-seal-ink: ${COLORS.sealInk};
      --dr-ink: ${COLORS.ink};
      --dr-muted: ${COLORS.muted};

      font-family:
        "DR Avenir Next",
        "Avenir Next",
        Arial,
        sans-serif;

      -webkit-font-smoothing: antialiased;
    }

    /* ========================================================
       FIXED EXPERIENCE
       ======================================================== */

    #${EXPERIENCE_ID} {
      position: fixed;
      inset: 0;

      z-index: 2147483000;

      width: 100%;
      height: 100vh;
      height: 100dvh;

      overflow: hidden;

      background: var(--dr-bg);

      display: flex;
      align-items: center;
      justify-content: center;

      isolation: isolate;

      opacity: 1;
      visibility: visible;

      -webkit-tap-highlight-color: transparent;
    }

    #${EXPERIENCE_ID},
    #${EXPERIENCE_ID} * {
      box-sizing: border-box;
    }

    /* ========================================================
       SUBTLE BACKGROUND
       ======================================================== */

    #${EXPERIENCE_ID} .dr-correspondence-background {
      position: absolute;
      inset: 0;

      pointer-events: none;

      background:
        radial-gradient(
          ellipse 82% 56% at 50% 46%,
          rgba(255,255,255,.32) 0%,
          rgba(255,255,255,0) 76%
        );
    }

    /* ========================================================
       MAIN STAGE
       ======================================================== */

    #${EXPERIENCE_ID} .dr-correspondence-stage {
      position: relative;

      width: 100%;
      height: 100%;

      display: flex;
      align-items: center;
      justify-content: center;

      padding:
        env(safe-area-inset-top, 0px)
        20px
        env(safe-area-inset-bottom, 0px);
    }

    /* ========================================================
       ENVELOPE COMPOSITION
       ======================================================== */

    #${EXPERIENCE_ID} .dr-envelope-composition {
      position: relative;

      width: min(86vw, 365px);

      aspect-ratio: 1.48 / 1;

      transform: translateY(-24px);

      perspective: 1200px;

      transform-style: preserve-3d;

      transition:
        opacity 750ms ease,
        transform 1050ms cubic-bezier(.22,.61,.36,1);
    }

    /* ========================================================
       ENVELOPE BODY
       ======================================================== */

    #${EXPERIENCE_ID} .dr-envelope-body {
      position: absolute;
      inset: 0;

      background: var(--dr-envelope);

      border: 1px solid rgba(115,96,78,.13);

      box-shadow:
        0 30px 65px rgba(72,56,43,.105),
        0 9px 24px rgba(72,56,43,.055);

      overflow: visible;

      transform-style: preserve-3d;
    }

    /* ========================================================
       BACK PANEL
       ======================================================== */

    #${EXPERIENCE_ID} .dr-envelope-back {
      position: absolute;
      inset: 0;

      z-index: 1;

      background: var(--dr-envelope-shadow);
    }

    /* ========================================================
       LETTER INSIDE ENVELOPE
       ======================================================== */

    #${EXPERIENCE_ID} .dr-envelope-letter {
      position: absolute;

      left: 7%;
      right: 7%;

      top: 11%;

      height: 91%;

      z-index: 2;

      background: var(--dr-paper);

      border: 1px solid rgba(103,85,70,.09);

      box-shadow:
        0 8px 24px rgba(76,59,45,.075);

      transform: translateY(8%);

      opacity: 1;

      overflow: hidden;

      will-change: transform;

      transition:
        transform 1450ms
          cubic-bezier(.22,.61,.36,1),
        box-shadow 1200ms ease;
    }

    /* ========================================================
       LETTER DETAILS
       ======================================================== */

    #${EXPERIENCE_ID} .dr-letter-interior {
      position: relative;

      width: 100%;
      height: 100%;

      padding: 25px 23px;

      color: var(--dr-ink);
    }

    #${EXPERIENCE_ID} .dr-letter-heading {
      font-family:
        "DR Avenir Next",
        "Avenir Next",
        Arial,
        sans-serif;

      font-size: 9px;

      font-weight: 500;

      letter-spacing: .11em;

      text-transform: uppercase;

      color: var(--dr-muted);
    }

    #${EXPERIENCE_ID} .dr-letter-rule {
      width: 100%;
      height: 1px;

      margin-top: 14px;

      background: rgba(81,70,62,.11);
    }

    #${EXPERIENCE_ID} .dr-letter-preview {
      margin-top: 17px;

      font-family:
        "DR Didot",
        Didot,
        Georgia,
        serif;

      font-size: clamp(17px, 4.4vw, 21px);

      font-weight: 400;

      letter-spacing: .025em;

      color: var(--dr-ink);
    }

    /* ========================================================
       LEFT FOLD
       ======================================================== */

    #${EXPERIENCE_ID} .dr-envelope-left {
      position: absolute;
      inset: 0;

      z-index: 4;

      background: var(--dr-envelope-shadow);

      clip-path: polygon(
        0 0,
        53% 50%,
        0 100%
      );

      pointer-events: none;
    }

    /* ========================================================
       RIGHT FOLD
       ======================================================== */

    #${EXPERIENCE_ID} .dr-envelope-right {
      position: absolute;
      inset: 0;

      z-index: 5;

      background: #EEE5D9;

      clip-path: polygon(
        100% 0,
        47% 50%,
        100% 100%
      );

      pointer-events: none;
    }

    /* ========================================================
       BOTTOM FOLD
       ======================================================== */

    #${EXPERIENCE_ID} .dr-envelope-bottom {
      position: absolute;
      inset: 0;

      z-index: 6;

      background: var(--dr-envelope-light);

      clip-path: polygon(
        0 100%,
        50% 43%,
        100% 100%
      );

      filter:
        drop-shadow(
          0 -1px 1px rgba(88,72,59,.07)
        );

      pointer-events: none;
    }

    /* ========================================================
       TOP FLAP
       ======================================================== */

    #${EXPERIENCE_ID} .dr-envelope-flap {
      position: absolute;

      left: 0;
      top: 0;

      width: 100%;
      height: 57%;

      z-index: 8;

      transform-origin: center top;

      transform: rotateX(0deg);

      transform-style: preserve-3d;

      backface-visibility: visible;

      -webkit-backface-visibility: visible;

      will-change: transform;

      transition:
        transform 1150ms
          cubic-bezier(.35,.05,.2,1);
    }

    #${EXPERIENCE_ID} .dr-envelope-flap-front {
      position: absolute;
      inset: 0;

      background: #F5EFE6;

      clip-path: polygon(
        0 0,
        100% 0,
        50% 100%
      );

      border-top:
        1px solid rgba(108,88,70,.08);

      backface-visibility: hidden;

      -webkit-backface-visibility: hidden;
    }

    #${EXPERIENCE_ID} .dr-envelope-flap-back {
      position: absolute;
      inset: 0;

      background: #E9DED0;

      clip-path: polygon(
        0 0,
        100% 0,
        50% 100%
      );

      transform: rotateY(180deg);

      backface-visibility: hidden;

      -webkit-backface-visibility: hidden;
    }

    /* ========================================================
       SEAL BUTTON

       SOFTLY SQUARED
       MATTE TAUPE
       NO METALLIC FINISH
       ======================================================== */

    #${EXPERIENCE_ID} .dr-envelope-seal {
      position: absolute;

      left: 50%;
      top: 55%;

      z-index: 20;

      width: 78px;
      height: 78px;

      padding: 0;

      display: flex;
      align-items: center;
      justify-content: center;

      border-radius: 15px;

      border:
        1px solid rgba(251,248,242,.34);

      background: var(--dr-seal);

      box-shadow:
        0 5px 13px rgba(67,52,40,.15),
        0 1px 3px rgba(67,52,40,.08),
        inset 0 1px 0 rgba(255,255,255,.14);

      transform: translate(-50%, -50%);

      cursor: pointer;

      appearance: none;
      -webkit-appearance: none;

      touch-action: manipulation;

      -webkit-tap-highlight-color: transparent;

      overflow: visible;

      transition:
        opacity 420ms ease,
        transform 520ms cubic-bezier(.22,.61,.36,1),
        box-shadow 350ms ease;
    }

    /* ========================================================
       DELICATE INSET EMBOSSED BORDER
       ======================================================== */

    #${EXPERIENCE_ID} .dr-envelope-seal::before {
      content: "";

      position: absolute;

      inset: 5px;

      border:
        1px solid rgba(251,248,242,.27);

      border-radius: 10px;

      pointer-events: none;
    }

    /* ========================================================
       ORIGINAL DR MONOGRAM

       IMAGE IS NOT CROPPED
       PRESERVE NATURAL PROPORTIONS
       ======================================================== */

    #${EXPERIENCE_ID} .dr-envelope-seal img {
      display: block;

      width: 66px;
      height: 66px;

      max-width: none;

      object-fit: contain;
      object-position: center;

      opacity: .95;

      filter:
        brightness(0)
        invert(1);

      pointer-events: none;

      user-select: none;
      -webkit-user-drag: none;
    }

    #${EXPERIENCE_ID} .dr-envelope-seal:focus-visible {
      outline: 2px solid var(--dr-ink);
      outline-offset: 5px;
    }

    @media (hover:hover) {

      #${EXPERIENCE_ID}
      .dr-envelope-seal:hover {

        box-shadow:
          0 8px 19px rgba(67,52,40,.18),
          0 2px 5px rgba(67,52,40,.08),
          inset 0 1px 0 rgba(255,255,255,.14);

      }

    }

    /* ========================================================
       INSTRUCTION

       EXACT REQUESTED STYLIZED TEXT
       ======================================================== */

    #${EXPERIENCE_ID} .dr-envelope-instruction {
      position: absolute;

      left: 50%;
      top: calc(100% + 51px);

      width: max-content;
      max-width: 90vw;

      transform: translateX(-50%);

      margin: 0;

      font-family:
        "DR Avenir Next",
        "Avenir Next",
        Georgia,
        serif;

      font-size: 15px;

      font-weight: 400;

      line-height: 1.5;

      letter-spacing: .015em;

      color: var(--dr-muted);

      text-align: center;

      pointer-events: none;

      transition:
        opacity 350ms ease,
        transform 350ms ease;
    }

    /* ========================================================
       OPENING — SEAL RELEASE
       ======================================================== */

    #${EXPERIENCE_ID}.dr-opening
    .dr-envelope-seal {

      opacity: 0;

      transform:
        translate(-50%, -50%)
        scale(.88);

      pointer-events: none;
    }

    #${EXPERIENCE_ID}.dr-opening
    .dr-envelope-instruction {

      opacity: 0;

      transform:
        translate(-50%, -5px);
    }

    /* ========================================================
       OPENING — FLAP
       ======================================================== */

    #${EXPERIENCE_ID}.dr-flap-open
    .dr-envelope-flap {

      transform: rotateX(-180deg);

      z-index: 3;
    }

    /* ========================================================
       OPENING — LETTER EMERGES
       ======================================================== */

    #${EXPERIENCE_ID}.dr-letter-emerging
    .dr-envelope-letter {

      transform: translateY(-79%);

      box-shadow:
        0 18px 35px rgba(76,59,45,.12),
        0 4px 10px rgba(76,59,45,.045);

      z-index: 7;
    }

    /* ========================================================
       FINAL TRANSITION
       ======================================================== */

    #${EXPERIENCE_ID}.dr-dissolving
    .dr-envelope-composition {

      opacity: 0;

      transform:
        translateY(16px)
        scale(.965);
    }

    #${EXPERIENCE_ID}.dr-dissolving {

      animation:
        drCorrespondenceDissolve
        780ms
        cubic-bezier(.22,.61,.36,1)
        forwards;
    }

    @keyframes drCorrespondenceDissolve {

      0% {
        opacity: 1;
      }

      100% {
        opacity: 0;
      }

    }

    /* ========================================================
       SMALL PHONE ADJUSTMENTS
       ======================================================== */

    @media (max-width: 390px) {

      #${EXPERIENCE_ID}
      .dr-envelope-composition {

        width: 87vw;
      }

      #${EXPERIENCE_ID}
      .dr-envelope-seal {

        width: 72px;
        height: 72px;

        border-radius: 14px;
      }

      #${EXPERIENCE_ID}
      .dr-envelope-seal img {

        width: 61px;
        height: 61px;
      }

      #${EXPERIENCE_ID}
      .dr-envelope-instruction {

        font-size: 14px;

        top: calc(100% + 45px);
      }

    }

    /* ========================================================
       SHORT VIEWPORT ADJUSTMENTS
       ======================================================== */

    @media (max-height: 650px) {

      #${EXPERIENCE_ID}
      .dr-envelope-composition {

        width: min(75vw, 305px);

        transform: translateY(-16px);
      }

      #${EXPERIENCE_ID}
      .dr-envelope-instruction {

        top: calc(100% + 32px);
      }

    }

    /* ========================================================
       LETTER VISIBILITY AFTER TRANSITION
       ======================================================== */

    @media (max-width: 760px) {

      body.dr-correspondence-active .paper,
      body.dr-correspondence-complete .paper {

        animation: none !important;

        opacity: 1 !important;

        box-shadow:
          0 24px 55px rgba(70,57,47,.09),
          0 3px 12px rgba(70,57,47,.045);
      }

      body.dr-correspondence-active .paper-content,
      body.dr-correspondence-complete .paper-content {

        animation: none !important;

        opacity: 1 !important;
      }

    }

  `;

  document.head.appendChild(style);

  /* ============================================================
     BUILD EXPERIENCE
     ============================================================ */

  const experience = document.createElement("div");

  experience.id = EXPERIENCE_ID;

  experience.setAttribute(
    "role",
    "dialog"
  );

  experience.setAttribute(
    "aria-modal",
    "true"
  );

  experience.setAttribute(
    "aria-label",
    "Open a personal message from Dominic Ryan"
  );

  experience.innerHTML = `

    <div
      class="dr-correspondence-background"
      aria-hidden="true"
    ></div>

    <div class="dr-correspondence-stage">

      <div class="dr-envelope-composition">

        <div class="dr-envelope-body">

          <div
            class="dr-envelope-back"
            aria-hidden="true"
          ></div>

          <div
            class="dr-envelope-letter"
            aria-hidden="true"
          >

            <div class="dr-letter-interior">

              <div class="dr-letter-heading">
                A Personal Message
              </div>

              <div class="dr-letter-rule"></div>

              <div class="dr-letter-preview">
                Dominic Ryan
              </div>

            </div>

          </div>

          <div
            class="dr-envelope-left"
            aria-hidden="true"
          ></div>

          <div
            class="dr-envelope-right"
            aria-hidden="true"
          ></div>

          <div
            class="dr-envelope-bottom"
            aria-hidden="true"
          ></div>

          <div
            class="dr-envelope-flap"
            aria-hidden="true"
          >

            <div class="dr-envelope-flap-front"></div>

            <div class="dr-envelope-flap-back"></div>

          </div>

        </div>

        <button
          class="dr-envelope-seal"
          type="button"
          aria-label="Tap the seal to open the personal message"
        >

          <img
            src="${MONOGRAM_SRC}"
            alt=""
            draggable="false"
          >

        </button>

        <p class="dr-envelope-instruction">
          𝑇𝑎𝑝 𝑡ℎ𝑒 𝑠𝑒𝑎𝑙.
        </p>

      </div>

    </div>

  `;

  document.body.appendChild(experience);

  const sealButton =
    experience.querySelector(".dr-envelope-seal");

  /* ============================================================
     PREVENT BACKGROUND SCROLLING
     ============================================================ */

  function lockPage() {

    previousBodyOverflow =
      document.body.style.overflow;

    previousHtmlOverflow =
      document.documentElement.style.overflow;

    previousBodyTouchAction =
      document.body.style.touchAction;

    previousHtmlTouchAction =
      document.documentElement.style.touchAction;

    previousScrollBehavior =
      document.documentElement.style.scrollBehavior;

    document.body.style.overflow = "hidden";

    document.documentElement.style.overflow = "hidden";

    document.body.style.touchAction = "none";

    document.documentElement.style.touchAction = "none";

    document.documentElement.style.scrollBehavior = "auto";

  }

  /* ============================================================
     RESTORE SCROLLING
     ============================================================ */

  function unlockPage() {

    document.body.style.overflow =
      previousBodyOverflow;

    document.documentElement.style.overflow =
      previousHtmlOverflow;

    document.body.style.touchAction =
      previousBodyTouchAction;

    document.documentElement.style.touchAction =
      previousHtmlTouchAction;

    document.documentElement.style.scrollBehavior =
      previousScrollBehavior;

  }

  /* ============================================================
     PREPARE ACTUAL LETTER
     ============================================================ */

  function prepareActualLetter() {

    document.body.classList.add(
      "dr-correspondence-active"
    );

    actualPaper.classList.add(
      "mobile-paper-visible"
    );

    if (actualPaperContent) {

      actualPaperContent.style.opacity = "1";

    }

  }

  /* ============================================================
     MOVE TO ACTUAL MESSAGE

     THE OPAQUE EXPERIENCE COVERS THIS MOVEMENT.
     VISITORS NEVER SEE THE PAGE SCROLL.
     ============================================================ */

  function positionActualMessage() {

    const paperRect =
      actualPaper.getBoundingClientRect();

    const target =
      window.scrollY +
      paperRect.top -
      18;

    window.scrollTo({
      top: Math.max(0, target),
      left: 0,
      behavior: "instant"
    });

  }

  /* ============================================================
     TIMER HELPER
     ============================================================ */

  function schedule(callback, delay) {

    const timer =
      window.setTimeout(callback, delay);

    animationTimers.push(timer);

    return timer;

  }

  /* ============================================================
     OPENING SEQUENCE
     ============================================================ */

  function openEnvelope() {

    if (opening || completed) {
      return;
    }

    opening = true;

    sealButton.disabled = true;

    /* ----------------------------------------
       1. RELEASE THE SEAL
       ---------------------------------------- */

    experience.classList.add(
      "dr-opening"
    );

    /* ----------------------------------------
       2. UNFOLD THE TOP FLAP
       ---------------------------------------- */

    schedule(() => {

      experience.classList.add(
        "dr-flap-open"
      );

    }, TIMING.seal);

    /* ----------------------------------------
       3. RAISE THE LETTER
       ---------------------------------------- */

    schedule(() => {

      experience.classList.add(
        "dr-letter-emerging"
      );

    }, TIMING.flap);

    /* ----------------------------------------
       4. PREPARE REAL LETTER BEHIND SCENE
       ---------------------------------------- */

    schedule(() => {

      prepareActualLetter();

      positionActualMessage();

    }, TIMING.letter);

    /* ----------------------------------------
       5. DISSOLVE THE ENVELOPE SCENE
       ---------------------------------------- */

    schedule(() => {

      experience.classList.add(
        "dr-dissolving"
      );

    }, TIMING.dissolve);

    /* ----------------------------------------
       6. RESTORE NORMAL PAGE
       ---------------------------------------- */

    schedule(() => {

      completeExperience();

    }, TIMING.complete);

  }

  /* ============================================================
     COMPLETE EXPERIENCE
     ============================================================ */

  function completeExperience() {

    if (completed) {
      return;
    }

    completed = true;

    prepareActualLetter();

    document.body.classList.remove(
      "dr-correspondence-active"
    );

    document.body.classList.add(
      "dr-correspondence-complete"
    );

    experience.remove();

    unlockPage();

  }

  /* ============================================================
     INTERACTION

     ACTUAL BUTTON
     ONE CLICK HANDLER
     NO TOUCH/CLICK DUPLICATION
     ============================================================ */

  sealButton.addEventListener(
    "click",
    openEnvelope
  );

  /* ============================================================
     KEYBOARD SUPPORT
     ============================================================ */

  experience.addEventListener(
    "keydown",
    event => {

      if (
        event.key === "Enter" ||
        event.key === " "
      ) {

        if (
          document.activeElement === sealButton
        ) {

          event.preventDefault();

          openEnvelope();

        }

      }

    }
  );

  /* ============================================================
     INITIALIZATION
     ============================================================ */

  lockPage();

  prepareActualLetter();

  /* Keep the scene at the beginning of the page. */

  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "instant"
  });

  /* Focus without scrolling. */

  try {

    sealButton.focus({
      preventScroll: true
    });

  } catch (_) {

    sealButton.focus();

  }

})();
