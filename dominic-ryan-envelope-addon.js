/* =========================================================
   DOMINIC RYAN
   THE PERSONAL CORRESPONDENCE EXPERIENCE

   MOBILE ONLY

   Interaction:
   - Tap the wax seal
   - Swipe upward
   - Scroll downward

   Once initiated:
   - The wax seal releases
   - The envelope opens
   - The letter emerges
   - The envelope recedes
   - The experience transitions into the actual letter

   No artificial scrolling section.
   No blank spacer.
   No changes to desktop.
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
    document.getElementById(
      "dr-correspondence-experience"
    )
  ) {
    return;
  }

  /* =========================================================
     REQUIRED EXISTING ELEMENTS
     ========================================================= */

  const letter = document.querySelector(".paper");

  const letterContent = document.querySelector(
    ".paper-content"
  );

  const navigation = document.querySelector(
    ".collection-navigation"
  );

  if (!letter || !letterContent) {
    return;
  }

  /* =========================================================
     CONFIGURATION
     ========================================================= */

  const CONFIG = {
    sealRelease: 260,
    flapOpening: 850,
    letterEmergence: 1250,
    envelopeDeparture: 1650,
    transitionComplete: 2150
  };

  let started = false;
  let completed = false;

  let touchStartY = null;

  /* =========================================================
     OVERRIDE EXISTING MOBILE LETTER FADE

     The real letter must be ready when the animated
     letter transitions into it.
     ========================================================= */

  const overrideStyle = document.createElement(
    "style"
  );

  overrideStyle.id =
    "dr-correspondence-style";

  overrideStyle.textContent = `

    @media (max-width: 760px) {

      body.dr-correspondence-active .paper,
      body.dr-correspondence-complete .paper {

        opacity: 1 !important;

        animation: none !important;

        transition: none !important;

      }

      body.dr-correspondence-active .paper-content,
      body.dr-correspondence-complete .paper-content {

        opacity: 1 !important;

        animation: none !important;

      }

      /* ===============================================
         EXPERIENCE OVERLAY
         =============================================== */

      #dr-correspondence-experience {

        position: fixed;

        left: 0;
        right: 0;

        top: var(--dr-experience-top, 0px);

        bottom: 0;

        z-index: 9000;

        overflow: hidden;

        display: flex;

        align-items: center;
        justify-content: center;

        background: #f2ede6;

        isolation: isolate;

        -webkit-tap-highlight-color: transparent;

        touch-action: pan-y;

      }

      #dr-correspondence-experience::before {

        content: "";

        position: absolute;

        inset: 0;

        pointer-events: none;

        background:
          radial-gradient(
            ellipse at 50% 43%,
            rgba(255,255,255,.64) 0%,
            rgba(255,255,255,.24) 39%,
            rgba(242,237,230,0) 76%
          );

        opacity: .85;

      }

      /* ===============================================
         COMPOSITION
         =============================================== */

      .dr-correspondence-scene {

        position: relative;

        width: min(82vw, 390px);

        aspect-ratio: 1.43;

        margin-top: -44px;

        perspective: 1200px;

        transform-style: preserve-3d;

        will-change: transform, opacity;

      }

      /* ===============================================
         ENVELOPE BODY
         =============================================== */

      .dr-envelope-body {

        position: absolute;

        inset: 0;

        z-index: 3;

        filter:
          drop-shadow(
            0 16px 22px
            rgba(78,61,48,.105)
          );

        transform-style: preserve-3d;

      }

      .dr-envelope-back {

        position: absolute;

        inset: 0;

        background:
          linear-gradient(
            145deg,
            #fffdf9 0%,
            #f6f0e8 57%,
            #ece3d8 100%
          );

        border:
          1px solid rgba(139,115,96,.31);

        box-shadow:
          inset 0 1px 0
          rgba(255,255,255,.9);

      }

      /* ===============================================
         LETTER EMERGING FROM ENVELOPE
         =============================================== */

      .dr-emerging-letter {

        position: absolute;

        z-index: 4;

        left: 6%;
        right: 6%;

        top: 8%;

        height: 118%;

        overflow: hidden;

        background: #fbf8f2;

        box-shadow:
          0 7px 22px
          rgba(72,56,44,.11);

        transform:
          translateY(24%)
          scale(.92);

        transform-origin: center bottom;

        opacity: 0;

        will-change: transform, opacity;

      }

      .dr-emerging-letter-inner {

        padding:
          29px 25px;

        color: #51463e;

      }

      .dr-emerging-label {

        margin-bottom: 20px;

        font-family:
          "DR Avenir Next",
          "Avenir Next",
          Arial,
          sans-serif;

        font-size: 9px;

        font-weight: 500;

        letter-spacing: .11em;

        text-transform: uppercase;

        color: #84776d;

      }

      .dr-emerging-heading {

        margin: 0 0 16px;

        font-family:
          "DR Avenir Next",
          "Avenir Next",
          Arial,
          sans-serif;

        font-size: clamp(15px, 4.2vw, 20px);

        font-weight: 500;

        line-height: 1.35;

        color: #51463e;

      }

      .dr-emerging-copy {

        margin: 0;

        font-family:
          "DR Avenir Next",
          "Avenir Next",
          Arial,
          sans-serif;

        font-size: 10px;

        line-height: 1.7;

        color: #655d56;

      }

      /* ===============================================
         FRONT FOLDS

         SVG creates the actual four-fold envelope
         geometry rather than relying on rectangular
         overlays.
         =============================================== */

      .dr-envelope-front {

        position: absolute;

        inset: 0;

        z-index: 6;

        width: 100%;
        height: 100%;

        overflow: visible;

        pointer-events: none;

      }

      /* ===============================================
         TOP FLAP
         =============================================== */

      .dr-envelope-flap {

        position: absolute;

        z-index: 7;

        top: 0;
        left: 0;

        width: 100%;
        height: 53%;

        transform-origin: 50% 0%;

        transform:
          rotateX(0deg);

        backface-visibility: visible;

        -webkit-backface-visibility: visible;

        will-change: transform;

      }

      .dr-envelope-flap svg {

        display: block;

        width: 100%;
        height: 100%;

        overflow: visible;

        filter:
          drop-shadow(
            0 2px 2px
            rgba(90,69,54,.065)
          );

      }

      /* ===============================================
         WAX SEAL
         =============================================== */

      .dr-wax-seal {

        position: absolute;

        z-index: 10;

        left: 50%;
        top: 50%;

        width: clamp(58px, 16vw, 74px);
        height: clamp(58px, 16vw, 74px);

        padding: 0;

        display: flex;

        align-items: center;
        justify-content: center;

        transform:
          translate(-50%, -50%);

        border-radius: 50%;

        border:
          1px solid rgba(255,255,255,.49);

        background:
          radial-gradient(
            circle at 31% 24%,
            #e9d2bc 0%,
            #cfad91 31%,
            #b9957b 73%,
            #9f7b64 100%
          );

        box-shadow:
          0 2px 3px rgba(88,65,50,.16),
          0 6px 12px rgba(88,65,50,.18),
          inset 0 2px 3px rgba(255,255,255,.57),
          inset 0 -3px 5px rgba(98,69,50,.2);

        cursor: pointer;

        -webkit-appearance: none;
        appearance: none;

        -webkit-tap-highlight-color: transparent;

        will-change: transform, opacity;

      }

      .dr-wax-seal::before {

        content: "";

        position: absolute;

        inset: 5px;

        border-radius: 50%;

        border:
          1px solid rgba(255,246,233,.76);

        box-shadow:
          inset 0 1px 2px
          rgba(104,74,55,.12);

        pointer-events: none;

      }

      .dr-wax-seal::after {

        content: "";

        position: absolute;

        inset: -3px;

        border-radius: 50%;

        border:
          1px solid rgba(160,124,98,.2);

        pointer-events: none;

      }

      /* Actual monogram image */

      .dr-wax-monogram {

        display: block;

        width: 70%;
        height: 70%;

        object-fit: contain;

        object-position: center;

        opacity: .83;

        filter:
          brightness(.62)
          sepia(.24);

        pointer-events: none;

        user-select: none;

        -webkit-user-drag: none;

      }

      /* ===============================================
         INVITATION
         =============================================== */

      .dr-correspondence-invitation {

        position: absolute;

        z-index: 11;

        top: calc(100% + 42px);

        left: 50%;

        width: max-content;
        max-width: 90vw;

        display: flex;

        flex-direction: column;

        align-items: center;

        gap: 12px;

        transform:
          translateX(-50%);

        text-align: center;

        color: #84776d;

        pointer-events: none;

      }

      .dr-correspondence-arrow {

        width: 19px;
        height: 27px;

        animation:
          drInvitationFloat
          2.3s
          ease-in-out
          infinite;

      }

      .dr-correspondence-arrow svg {

        display: block;

        width: 100%;
        height: 100%;

        fill: none;

        stroke: currentColor;

        stroke-width: 1.25;

        stroke-linecap: round;
        stroke-linejoin: round;

      }

      .dr-correspondence-invitation-text {

        font-family:
          "DR Didot",
          Didot,
          Georgia,
          serif;

        font-size:
          clamp(15px, 4vw, 18px);

        font-weight: 400;

        font-style: italic;

        letter-spacing: .015em;

        line-height: 1.55;

        white-space: nowrap;

      }

      .dr-correspondence-invitation-text span {

        display: block;

      }

      .dr-correspondence-invitation-text span + span {

        margin-top: 1px;

        opacity: .78;

        font-size: .9em;

      }

      @keyframes drInvitationFloat {

        0%, 100% {

          transform: translateY(3px);

        }

        50% {

          transform: translateY(-5px);

        }

      }

      /* ===============================================
         ANIMATION: SEAL RELEASE
         =============================================== */

      .dr-correspondence-opening .dr-wax-seal {

        animation:
          drSealRelease
          520ms
          cubic-bezier(.22,.61,.36,1)
          forwards;

        pointer-events: none;

      }

      @keyframes drSealRelease {

        0% {

          opacity: 1;

          transform:
            translate(-50%,-50%)
            scale(1);

        }

        55% {

          opacity: 1;

          transform:
            translate(-50%,-50%)
            scale(1.08);

        }

        100% {

          opacity: 0;

          transform:
            translate(-50%,-50%)
            scale(.82);

        }

      }

      /* ===============================================
         ANIMATION: FLAP OPENING
         =============================================== */

      .dr-correspondence-opening .dr-envelope-flap {

        animation:
          drFlapOpen
          850ms
          cubic-bezier(.22,.61,.36,1)
          220ms
          both;

      }

      @keyframes drFlapOpen {

        0% {

          transform:
            rotateX(0deg);

        }

        100% {

          transform:
            rotateX(-176deg);

        }

      }

      /* ===============================================
         ANIMATION: LETTER EMERGENCE
         =============================================== */

      .dr-correspondence-opening .dr-emerging-letter {

        animation:
          drLetterEmerge
          1300ms
          cubic-bezier(.19,1,.22,1)
          500ms
          both;

      }

      @keyframes drLetterEmerge {

        0% {

          opacity: 0;

          transform:
            translateY(24%)
            scale(.92);

        }

        22% {

          opacity: 1;

        }

        68% {

          opacity: 1;

          transform:
            translateY(-34%)
            scale(.97);

        }

        100% {

          opacity: 1;

          transform:
            translateY(-54%)
            scale(1.03);

        }

      }

      /* ===============================================
         ANIMATION: ENVELOPE RECEDES
         =============================================== */

      .dr-correspondence-opening .dr-envelope-body {

        animation:
          drEnvelopeRecede
          850ms
          cubic-bezier(.22,.61,.36,1)
          1120ms
          both;

      }

      @keyframes drEnvelopeRecede {

        0% {

          opacity: 1;

          transform:
            translateY(0);

        }

        100% {

          opacity: 0;

          transform:
            translateY(35%);

        }

      }

      /* ===============================================
         ANIMATION: LETTER EXPANDS
         =============================================== */

      .dr-correspondence-opening .dr-emerging-letter {

        box-shadow:
          0 16px 38px
          rgba(70,57,47,.1);

      }

      /* ===============================================
         INVITATION DISAPPEARS
         =============================================== */

      .dr-correspondence-opening
      .dr-correspondence-invitation {

        animation:
          drInvitationDisappear
          300ms
          ease
          forwards;

      }

      @keyframes drInvitationDisappear {

        to {

          opacity: 0;

          transform:
            translateX(-50%)
            translateY(9px);

        }

      }

      /* ===============================================
         FINAL TRANSITION
         =============================================== */

      .dr-correspondence-finishing {

        animation:
          drExperienceFinish
          620ms
          cubic-bezier(.22,.61,.36,1)
          forwards;

        pointer-events: none;

      }

      @keyframes drExperienceFinish {

        0% {

          opacity: 1;

        }

        100% {

          opacity: 0;

        }

      }

      /* ===============================================
         SMALL-SCREEN REFINEMENTS
         =============================================== */

      @media (max-height: 700px) {

        .dr-correspondence-scene {

          width: min(70vw, 325px);

          margin-top: -30px;

        }

        .dr-correspondence-invitation {

          top: calc(100% + 25px);

          gap: 7px;

        }

        .dr-correspondence-invitation-text {

          font-size: 14px;

        }

      }

      @media (max-width: 360px) {

        .dr-correspondence-scene {

          width: 79vw;

        }

        .dr-correspondence-invitation-text {

          font-size: 14px;

        }

      }

      @media (prefers-reduced-motion: reduce) {

        .dr-correspondence-arrow {

          animation: none;

        }

      }

    }

  `;

  document.head.appendChild(overrideStyle);

  /* =========================================================
     CREATE EXPERIENCE
     ========================================================= */

  const experience = document.createElement(
    "div"
  );

  experience.id =
    "dr-correspondence-experience";

  experience.setAttribute(
    "aria-label",
    "Open Dominic Ryan's personal message"
  );

  experience.innerHTML = `

    <div class="dr-correspondence-scene">

      <div class="dr-envelope-body">

        <div class="dr-envelope-back"></div>

        <!-- TOP FLAP -->

        <div class="dr-envelope-flap">

          <svg
            viewBox="0 0 400 150"
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
                  stop-color="#fffdf9"
                />

                <stop
                  offset="100%"
                  stop-color="#eae0d5"
                />

              </linearGradient>

            </defs>

            <path
              d="M0 0 L400 0 L200 150 Z"
              fill="url(#dr-flap-gradient)"
              stroke="#bba999"
              stroke-width=".9"
            />

          </svg>

        </div>

        <!-- EMERGING LETTER -->

        <div class="dr-emerging-letter">

          <div class="dr-emerging-letter-inner">

            <div class="dr-emerging-label">
              A Personal Message
            </div>

            <h2 class="dr-emerging-heading">
              I’m Dominic Ryan.
            </h2>

            <p class="dr-emerging-copy">
              Based in Austin, Texas.
              I’ve always been drawn to things
              that carry a point of view —
              objects, places, images, and
              ideas shaped by intention.
            </p>

          </div>

        </div>

        <!-- ENVELOPE FRONT -->

        <svg
          class="dr-envelope-front"
          viewBox="0 0 400 280"
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
                stop-color="#fffdf9"
              />

              <stop
                offset="100%"
                stop-color="#eee6dc"
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
                stop-color="#fffdf9"
              />

              <stop
                offset="100%"
                stop-color="#ece2d7"
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
                stop-color="#f8f3ec"
              />

              <stop
                offset="100%"
                stop-color="#ede4d9"
              />

            </linearGradient>

          </defs>

          <!-- LEFT FOLD -->

          <path
            d="M0 0 L200 140 L0 280 Z"
            fill="url(#dr-envelope-left-gradient)"
            stroke="#c0afa0"
            stroke-width=".8"
          />

          <!-- RIGHT FOLD -->

          <path
            d="M400 0 L200 140 L400 280 Z"
            fill="url(#dr-envelope-right-gradient)"
            stroke="#c0afa0"
            stroke-width=".8"
          />

          <!-- LOWER FOLD -->

          <path
            d="M0 280 L200 130 L400 280 Z"
            fill="url(#dr-envelope-bottom-gradient)"
            stroke="#c0afa0"
            stroke-width=".8"
          />

        </svg>

        <!-- WAX SEAL -->

        <button
          class="dr-wax-seal"
          type="button"
          aria-label="Tap the seal to open the letter"
        >

          <img
            class="dr-wax-monogram"
            src="/dr-reveals-removebg-preview.png"
            alt=""
            draggable="false"
          >

        </button>

      </div>

      <!-- INVITATION -->

      <div class="dr-correspondence-invitation">

        <div class="dr-correspondence-arrow">

          <svg
            viewBox="0 0 24 32"
            aria-hidden="true"
          >

            <path d="M12 28 V4" />

            <path d="M4 12 L12 4 L20 12" />

          </svg>

        </div>

        <div class="dr-correspondence-invitation-text">

          <span>Tap the seal</span>

          <span>or scroll to open</span>

        </div>

      </div>

    </div>

  `;

  document.body.appendChild(experience);

  document.body.classList.add(
    "dr-correspondence-active"
  );

  /* =========================================================
     POSITION BELOW EXISTING NAVIGATION

     Keeps the site's header and primary navigation
     visible above the experience.
     ========================================================= */

  function positionExperience() {

    if (started || completed) {
      return;
    }

    let top = 0;

    if (navigation) {

      const rect =
        navigation.getBoundingClientRect();

      top = Math.max(
        0,
        rect.bottom
      );

    }

    experience.style.setProperty(
      "--dr-experience-top",
      `${Math.round(top)}px`
    );

  }

  positionExperience();

  window.addEventListener(
    "resize",
    positionExperience,
    { passive: true }
  );

  /* =========================================================
     START ANIMATION

     One interaction starts the entire sequence.
     No further scrolling required.
     ========================================================= */

  function openCorrespondence() {

    if (started || completed) {
      return;
    }

    started = true;

    /* Begin opening animation */

    experience.classList.add(
      "dr-correspondence-opening"
    );

    /* Disable repeated interaction */

    const seal = experience.querySelector(
      ".dr-wax-seal"
    );

    if (seal) {
      seal.disabled = true;
    }

    /* ===============================================
       PREPARE ACTUAL LETTER

       We move the viewport directly to the real
       letter while the animated composition is
       still covering the screen.

       This removes the empty scrolling section.
       =============================================== */

    window.setTimeout(() => {

      const letterRect =
        letter.getBoundingClientRect();

      const targetY =
        window.scrollY +
        letterRect.top -
        12;

      window.scrollTo({
        top: Math.max(0, targetY),
        behavior: "instant"
      });

      letter.classList.add(
        "mobile-paper-visible"
      );

    }, 1280);

    /* ===============================================
       DISSOLVE ANIMATION INTO ACTUAL LETTER
       =============================================== */

    window.setTimeout(() => {

      experience.classList.add(
        "dr-correspondence-finishing"
      );

    }, 1550);

    /* ===============================================
       REMOVE EXPERIENCE

       The actual letter is already in position.
       No additional scrolling required.
       =============================================== */

    window.setTimeout(() => {

      completed = true;

      experience.remove();

      document.body.classList.remove(
        "dr-correspondence-active"
      );

      document.body.classList.add(
        "dr-correspondence-complete"
      );

      window.removeEventListener(
        "wheel",
        handleWheel
      );

      window.removeEventListener(
        "touchstart",
        handleTouchStart
      );

      window.removeEventListener(
        "touchend",
        handleTouchEnd
      );

      window.removeEventListener(
        "keydown",
        handleKeydown
      );

    }, CONFIG.transitionComplete);

  }

  /* =========================================================
     TAP THE SEAL
     ========================================================= */

  const seal = experience.querySelector(
    ".dr-wax-seal"
  );

  seal.addEventListener(
    "click",
    openCorrespondence
  );

  /* =========================================================
     SCROLL DOWN TO OPEN
     ========================================================= */

  function handleWheel(event) {

    if (started || completed) {
      return;
    }

    if (event.deltaY > 3) {

      event.preventDefault();

      openCorrespondence();

    }

  }

  window.addEventListener(
    "wheel",
    handleWheel,
    { passive: false }
  );

  /* =========================================================
     MOBILE SWIPE UP TO OPEN
     ========================================================= */

  function handleTouchStart(event) {

    if (started || completed) {
      return;
    }

    if (!event.touches.length) {
      return;
    }

    touchStartY =
      event.touches[0].clientY;

  }

  function handleTouchEnd(event) {

    if (
      started ||
      completed ||
      touchStartY === null
    ) {
      return;
    }

    if (!event.changedTouches.length) {
      return;
    }

    const touchEndY =
      event.changedTouches[0].clientY;

    const movement =
      touchStartY - touchEndY;

    touchStartY = null;

    if (movement > 22) {
      openCorrespondence();
    }

  }

  window.addEventListener(
    "touchstart",
    handleTouchStart,
    { passive: true }
  );

  window.addEventListener(
    "touchend",
    handleTouchEnd,
    { passive: true }
  );

  /* =========================================================
     KEYBOARD ACCESSIBILITY
     ========================================================= */

  function handleKeydown(event) {

    if (started || completed) {
      return;
    }

    if (
      event.key === "ArrowDown" ||
      event.key === "PageDown" ||
      event.key === "Enter" ||
      event.key === " "
    ) {

      event.preventDefault();

      openCorrespondence();

    }

  }

  window.addEventListener(
    "keydown",
    handleKeydown
  );

})();
