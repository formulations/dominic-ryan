/* =========================================================
   DOMINIC RYAN
   MOBILE CORRESPONDENCE EXPERIENCE

   VERSION 12 — CONTINUOUS LETTER REVEAL

   FEATURES
   ---------------------------------------------------------
   • Mobile only (760px and below)
   • Existing header and navigation remain visible
   • Full-screen ivory correspondence experience
   • Background page completely concealed before opening
   • Scrolling locked until the letter opens
   • Elegant landscape correspondence envelope
   • Champagne wax seal with optically centered DR monogram
   • Didot italic "Tap the seal to open"
   • Gentle animated upward arrow
   • Real letter content cloned directly from .paper
   • Matching typography, spacing, and paragraph structure
   • Letter physically rises from inside the envelope
   • Envelope folds conceal the emerging letter naturally
   • Animated letter transitions toward real page position
   • Real letter revealed without an abrupt content swap
   • Mobile letter height follows actual content
   • Existing photo, Instagram widget, and footer preserved
   • Existing signature and final-line animations preserved
   • Envelope appears on EVERY refresh
   • No sessionStorage or localStorage
   • Desktop remains untouched

   ========================================================= */

(() => {
  "use strict";

  /* =========================================================
     01. MOBILE-ONLY SAFETY
     ========================================================= */

  const mobileQuery = window.matchMedia(
    "(max-width: 760px)"
  );

  if (!mobileQuery.matches) {
    return;
  }

  /* =========================================================
     02. REQUIRED ELEMENTS
     ========================================================= */

  const hero = document.querySelector(
    ".hero-composition"
  );

  const paper = document.querySelector(
    ".hero-composition > .paper"
  );

  const paperContent = paper
    ? paper.querySelector(".paper-content")
    : null;

  const header = document.querySelector(
    ".header"
  );

  const navigation = document.querySelector(
    ".collection-navigation"
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

  const utilityNav = document.querySelector(
    ".utility-nav"
  );

  const backToTop = document.querySelector(
    ".dr-back-to-top"
  );

  if (
    !hero ||
    !paper ||
    !paperContent ||
    document.getElementById("dr-envelope-experience")
  ) {
    return;
  }

  /* =========================================================
     03. CONFIGURATION
     ========================================================= */

  const CONFIG = {

    monogram:
      "/dr-reveals-removebg-preview.png",

    envelopeOpenDuration:
      850,

    letterRiseDelay:
      360,

    letterRiseDuration:
      1250,

    handoffStart:
      1650,

    handoffDuration:
      1100,

    finishDelay:
      2850,

    pageTopGap:
      12

  };

  let opened = false;
  let finished = false;
  let transitioning = false;

  const timers = [];

  function later(callback, delay) {

    const timer = window.setTimeout(
      callback,
      delay
    );

    timers.push(timer);

    return timer;

  }

  /* =========================================================
     04. RECORD ORIGINAL INLINE STYLES
     ========================================================= */

  const originalStyles = {

    htmlOverflow:
      document.documentElement.style.overflow,

    bodyOverflow:
      document.body.style.overflow,

    bodyPosition:
      document.body.style.position,

    bodyTop:
      document.body.style.top,

    bodyLeft:
      document.body.style.left,

    bodyRight:
      document.body.style.right,

    bodyWidth:
      document.body.style.width

  };

  const originalScrollY = window.scrollY;

  /* =========================================================
     05. LOCK SCROLLING
     ========================================================= */

  function lockPage() {

    document.documentElement.style.overflow =
      "hidden";

    document.body.style.overflow =
      "hidden";

    document.body.style.position =
      "fixed";

    document.body.style.top =
      `-${originalScrollY}px`;

    document.body.style.left =
      "0";

    document.body.style.right =
      "0";

    document.body.style.width =
      "100%";

  }

  function unlockPage() {

    document.documentElement.style.overflow =
      originalStyles.htmlOverflow;

    document.body.style.overflow =
      originalStyles.bodyOverflow;

    document.body.style.position =
      originalStyles.bodyPosition;

    document.body.style.top =
      originalStyles.bodyTop;

    document.body.style.left =
      originalStyles.bodyLeft;

    document.body.style.right =
      originalStyles.bodyRight;

    document.body.style.width =
      originalStyles.bodyWidth;

  }

  lockPage();

  /* =========================================================
     06. PREPARE REAL LETTER
     ========================================================= */

  paper.classList.remove(
    "mobile-paper-visible",
    "dr-envelope-revealed"
  );

  paper.classList.add(
    "dr-envelope-waiting"
  );

  /* =========================================================
     07. INJECT MOBILE-ONLY CSS
     ========================================================= */

  const style = document.createElement(
    "style"
  );

  style.id =
    "dr-envelope-mobile-styles";

  style.textContent = `

    @media (max-width: 760px) {

      /* ===================================================
         ACTUAL LETTER — PRE-OPENING
         =================================================== */

      .paper.dr-envelope-waiting {

        opacity: 0 !important;

        visibility: hidden !important;

        pointer-events: none !important;

        animation: none !important;

        transition: none !important;

      }

      .paper.dr-envelope-waiting .paper-content {

        opacity: 0 !important;

        animation: none !important;

      }

      /* ===================================================
         ACTUAL LETTER — REVEALED
         =================================================== */

      .paper.dr-envelope-revealed {

        opacity: 1 !important;

        visibility: visible !important;

        pointer-events: auto !important;

        animation: none !important;

        height: auto !important;

        min-height: 0 !important;

        aspect-ratio: auto !important;

        transition:
          opacity 950ms cubic-bezier(.22,.61,.36,1),
          box-shadow 950ms cubic-bezier(.22,.61,.36,1) !important;

      }

      .paper.dr-envelope-revealed .paper-content {

        opacity: 1 !important;

        transform: translateY(0) !important;

        animation: none !important;

      }

      /* ===================================================
         REMOVE EXCESS MINIMUM HEIGHT ON MOBILE

         This affects only the personal letter.

         =================================================== */

      .hero-composition > .paper {

        min-height: 0 !important;

        height: auto !important;

        aspect-ratio: auto !important;

      }

      /* ===================================================
         FULL-SCREEN INTRODUCTION
         =================================================== */

      #dr-envelope-experience {

        position: fixed;

        top: var(
          --dr-envelope-top,
          180px
        );

        left: 0;

        right: 0;

        bottom: 0;

        width: 100%;

        z-index: 9000;

        display: flex;

        align-items: center;

        justify-content: center;

        padding:
          clamp(18px, 4vh, 38px)
          clamp(16px, 4.5vw, 30px)
          calc(
            24px +
            env(safe-area-inset-bottom, 0px)
          );

        overflow: hidden;

        isolation: isolate;

        background:
          radial-gradient(
            ellipse at 50% 38%,
            rgba(255,255,255,.46) 0%,
            rgba(255,255,255,.13) 48%,
            rgba(255,255,255,0) 80%
          ),
          #f2ede6;

        opacity: 1;

        transition:
          opacity 950ms cubic-bezier(.22,.61,.36,1);

      }

      #dr-envelope-experience.dr-experience-leaving {

        opacity: 0;

        pointer-events: none;

      }

      /* ===================================================
         INTRODUCTION CONTENT
         =================================================== */

      .dr-envelope-content {

        position: relative;

        width: 100%;

        max-width: 520px;

        display: flex;

        flex-direction: column;

        align-items: center;

        justify-content: center;

        min-height: 0;

        transform: translateY(-1vh);

      }

      /* ===================================================
         EDITORIAL HEADING
         =================================================== */

      .dr-envelope-heading {

        margin:
          0
          0
          clamp(35px, 6vh, 58px);

        font-family:
          "DR Avenir Next",
          "Avenir Next",
          Arial,
          sans-serif;

        font-size:
          clamp(10px, 2.8vw, 12px);

        font-weight: 500;

        line-height: 1.5;

        letter-spacing: .23em;

        text-transform: uppercase;

        text-align: center;

        color: #74665d;

        opacity: 0;

        animation:
          drEnvelopeFadeUp
          1000ms
          cubic-bezier(.22,.61,.36,1)
          150ms
          forwards;

      }

      /* ===================================================
         ENVELOPE SCENE
         =================================================== */

      .dr-envelope-scene {

        position: relative;

        width:
          min(100%, 430px);

        aspect-ratio:
          1.72 / 1;

        perspective: 1200px;

        transform-style: preserve-3d;

        filter:
          drop-shadow(
            0 17px 21px rgba(79,62,47,.11)
          );

        opacity: 0;

        animation:
          drEnvelopeFadeUp
          1100ms
          cubic-bezier(.22,.61,.36,1)
          250ms
          forwards;

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
            155deg,
            #f8f5ef 0%,
            #e9e1d8 100%
          );

        border:
          1px solid rgba(154,133,114,.18);

        border-radius: 2px;

      }

      /* ===================================================
         LETTER VIEWPORT

         This holds a real-content replica of .paper.

         The paper itself can move while the envelope
         masks its lower portion.

         =================================================== */

      .dr-envelope-letter-window {

        position: absolute;

        inset: 0;

        z-index: 2;

        overflow: visible;

        pointer-events: none;

      }

      /* ===================================================
         ACTUAL-CONTENT LETTER REPLICA
         =================================================== */

      .dr-envelope-letter {

        position: absolute;

        left: 8%;

        top: 9%;

        width: 84%;

        height: auto;

        min-height: 0;

        padding:
          clamp(17px, 4vw, 26px)
          clamp(17px, 4vw, 26px)
          32px;

        background:
          #fbf8f2;

        border:
          1px solid rgba(149,129,110,.14);

        box-shadow:
          0 4px 16px rgba(70,57,47,.06);

        transform:
          translateY(12%);

        opacity: 0;

        will-change:
          transform,
          opacity;

        transition:
          transform 1250ms cubic-bezier(.22,.61,.36,1),
          opacity 350ms ease;

      }

      /* ===================================================
         LETTER CONTENT

         Uses a clone of the real paper-content element.

         =================================================== */

      .dr-envelope-letter .paper-content {

        opacity: 1 !important;

        transform: none !important;

        animation: none !important;

        transition: none !important;

      }

      .dr-envelope-letter .message-label {

        margin-bottom: 17px;

        font-size: 9px;

        letter-spacing: .08em;

      }

      .dr-envelope-letter h1 {

        margin-bottom: 15px;

        font-size: 15px;

        line-height: 1.35;

      }

      .dr-envelope-letter p {

        margin-bottom: 12px;

        font-size: 10px;

        line-height: 1.5;

      }

      .dr-envelope-letter .signature {

        width: 145px;

        max-width: 55%;

        opacity: 1 !important;

        transform: none !important;

        filter: none !important;

        transition: none !important;

      }

      .dr-envelope-letter .final-typewriter-text,
      .dr-envelope-letter .final-typewriter-ornament {

        opacity: 1 !important;

        filter: none !important;

        transition: none !important;

      }

      /* ===================================================
         ENVELOPE SIDE FOLDS
         =================================================== */

      .dr-envelope-fold-left {

        position: absolute;

        inset: 0;

        z-index: 3;

        clip-path:
          polygon(
            0 0,
            54% 51%,
            0 100%
          );

        background:
          linear-gradient(
            110deg,
            #ede7df 0%,
            #f4eee7 100%
          );

      }

      .dr-envelope-fold-right {

        position: absolute;

        inset: 0;

        z-index: 3;

        clip-path:
          polygon(
            100% 0,
            46% 51%,
            100% 100%
          );

        background:
          linear-gradient(
            250deg,
            #e9e1d8 0%,
            #f2ebe3 100%
          );

      }

      /* ===================================================
         FRONT POCKET
         =================================================== */

      .dr-envelope-front {

        position: absolute;

        inset: 0;

        z-index: 4;

        clip-path:
          polygon(
            0 100%,
            50% 48%,
            100% 100%
          );

        background:
          linear-gradient(
            180deg,
            #f6f0e9 0%,
            #eae2d8 100%
          );

      }

      /* ===================================================
         TOP FLAP
         =================================================== */

      .dr-envelope-flap {

        position: absolute;

        inset: 0;

        z-index: 6;

        clip-path:
          polygon(
            0 0,
            100% 0,
            50% 55%
          );

        background:
          linear-gradient(
            180deg,
            #fbf8f3 0%,
            #ece5dd 100%
          );

        transform-origin:
          50% 0%;

        backface-visibility:
          hidden;

        transition:
          transform 850ms cubic-bezier(.22,.61,.36,1);

      }

      /* ===================================================
         WAX SEAL
         =================================================== */

      .dr-envelope-seal {

        position: absolute;

        left: 50%;

        top: 53%;

        z-index: 8;

        width:
          clamp(76px, 19vw, 92px);

        height:
          clamp(76px, 19vw, 92px);

        padding: 0;

        border: 0;

        border-radius: 50%;

        background: transparent;

        transform:
          translate(-50%, -50%);

        cursor: pointer;

        touch-action: manipulation;

        -webkit-tap-highlight-color:
          transparent;

        transition:
          opacity 400ms ease,
          transform 400ms ease;

      }

      .dr-envelope-seal:focus-visible {

        outline:
          2px solid #786a5e;

        outline-offset: 6px;

      }

      /* ===================================================
         CHAMPAGNE WAX
         =================================================== */

      .dr-envelope-wax {

        position: absolute;

        inset: 0;

        display: block;

        border-radius: 50%;

        background:
          radial-gradient(
            circle at 32% 24%,
            #fff3d9 0%,
            #ead6b7 24%,
            #d6b894 59%,
            #b99570 100%
          );

        border:
          1px solid rgba(255,244,218,.55);

        box-shadow:
          inset 0 2px 5px rgba(255,255,255,.65),
          inset 0 -5px 8px rgba(117,79,49,.18),
          0 8px 16px rgba(79,57,39,.17);

      }

      .dr-envelope-wax::before {

        content: "";

        position: absolute;

        inset: 10%;

        border-radius: 50%;

        border:
          1px solid rgba(255,250,235,.78);

        box-shadow:
          inset 0 1px 3px rgba(109,77,52,.15);

      }

      /* ===================================================
         OPTICALLY CENTERED DR MONOGRAM
         =================================================== */

      .dr-envelope-monogram-window {

        position: absolute;

        inset: 16%;

        overflow: hidden;

        border-radius: 50%;

        pointer-events: none;

      }

      .dr-envelope-monogram {

        position: absolute;

        left: 46%;

        top: 46%;

        width: 106%;

        height: 106%;

        object-fit: contain;

        transform:
          translate(-50%, -50%);

        opacity: .67;

        filter:
          sepia(.65)
          saturate(.55)
          brightness(.84);

        pointer-events: none;

      }

      /* ===================================================
         INVITATION
         =================================================== */

      .dr-envelope-invitation {

        display: flex;

        flex-direction: column;

        align-items: center;

        justify-content: center;

        margin-top:
          clamp(30px, 5.5vh, 46px);

        opacity: 0;

        animation:
          drEnvelopeFadeUp
          1100ms
          cubic-bezier(.22,.61,.36,1)
          650ms
          forwards;

      }

      .dr-envelope-arrow {

        display: block;

        width: 17px;

        height: 27px;

        margin-bottom: 10px;

        color: #8a796d;

        animation:
          drEnvelopeArrow
          2700ms
          ease-in-out
          infinite;

      }

      .dr-envelope-arrow svg {

        display: block;

        width: 100%;

        height: 100%;

      }

      .dr-envelope-invitation-text {

        margin: 0;

        font-family:
          "DR Didot",
          Didot,
          "Bodoni 72",
          Georgia,
          serif;

        font-size:
          clamp(20px, 5.2vw, 22px);

        font-weight: 400;

        font-style: italic;

        line-height: 1.35;

        letter-spacing: .01em;

        text-align: center;

        color: #84776d;

      }

      /* ===================================================
         OPENING STATES
         =================================================== */

      .dr-opening .dr-envelope-flap {

        transform:
          rotateX(178deg);

        z-index: 2;

      }

      .dr-opening .dr-envelope-seal {

        opacity: 0;

        transform:
          translate(-50%, -62%)
          scale(.92);

        pointer-events: none;

      }

      .dr-opening .dr-envelope-letter {

        opacity: 1;

        transform:
          translateY(-32%);

        transition-delay:
          360ms;

      }

      .dr-opening .dr-envelope-invitation {

        opacity: 0;

        animation: none;

        transition:
          opacity 300ms ease;

      }

      /* ===================================================
         HANDOFF

         The animated sheet moves toward the real letter
         before the full-screen introduction fades.

         =================================================== */

      .dr-envelope-letter.dr-letter-handoff {

        transition:
          transform 1100ms cubic-bezier(.22,.61,.36,1),
          width 1100ms cubic-bezier(.22,.61,.36,1),
          height 1100ms cubic-bezier(.22,.61,.36,1),
          left 1100ms cubic-bezier(.22,.61,.36,1),
          top 1100ms cubic-bezier(.22,.61,.36,1),
          padding 1100ms cubic-bezier(.22,.61,.36,1),
          opacity 700ms ease;

      }

      /* ===================================================
         ENTRANCE ANIMATION
         =================================================== */

      @keyframes drEnvelopeFadeUp {

        from {

          opacity: 0;

          transform:
            translateY(10px);

        }

        to {

          opacity: 1;

          transform:
            translateY(0);

        }

      }

      /* ===================================================
         ARROW ANIMATION
         =================================================== */

      @keyframes drEnvelopeArrow {

        0%, 100% {

          transform:
            translateY(2px);

        }

        50% {

          transform:
            translateY(-3px);

        }

      }

      /* ===================================================
         SMALL SCREENS
         =================================================== */

      @media (max-height: 720px) {

        .dr-envelope-heading {

          margin-bottom: 26px;

        }

        .dr-envelope-scene {

          width:
            min(100%, 350px);

        }

        .dr-envelope-invitation {

          margin-top: 23px;

        }

        .dr-envelope-invitation-text {

          font-size: 19px;

        }

      }

      /* ===================================================
         REDUCED MOTION
         =================================================== */

      @media (prefers-reduced-motion: reduce) {

        .dr-envelope-heading,
        .dr-envelope-scene,
        .dr-envelope-invitation {

          animation-duration: 1ms;

          animation-delay: 0ms;

        }

        .dr-envelope-arrow {

          animation: none;

        }

      }

    }

  `;

  document.head.appendChild(style);

  /* =========================================================
     08. CREATE FULL-SCREEN INTRODUCTION
     ========================================================= */

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

    <div class="dr-envelope-content">

      <h2 class="dr-envelope-heading">
        A Personal Message
      </h2>

      <div
        class="dr-envelope-scene"
        aria-label="A sealed personal letter"
      >

        <div
          class="dr-envelope-back"
          aria-hidden="true"
        ></div>

        <div
          class="dr-envelope-letter-window"
          aria-hidden="true"
        >

          <div class="dr-envelope-letter"></div>

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
          aria-label="Open the personal letter"
        >

          <span
            class="dr-envelope-wax"
            aria-hidden="true"
          ></span>

          <span
            class="dr-envelope-monogram-window"
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

      <div class="dr-envelope-invitation">

        <span
          class="dr-envelope-arrow"
          aria-hidden="true"
        >

          <svg
            viewBox="0 0 20 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >

            <path
              d="M10 27V4"
              stroke="currentColor"
              stroke-width="1.2"
              stroke-linecap="round"
            />

            <path
              d="M3.5 10.5L10 4L16.5 10.5"
              stroke="currentColor"
              stroke-width="1.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />

          </svg>

        </span>

        <p class="dr-envelope-invitation-text">
          Tap the seal to open
        </p>

      </div>

    </div>

  `;

  document.body.appendChild(
    experience
  );

  /* =========================================================
     09. CLONE THE ACTUAL LETTER CONTENT

     The animation is generated from the actual HTML.

     No manually copied paragraphs.

     ========================================================= */

  const animatedLetter = experience.querySelector(
    ".dr-envelope-letter"
  );

  const clonedContent = paperContent.cloneNode(
    true
  );

  /* Avoid duplicate IDs in the cloned content. */

  if (clonedContent.id) {
    clonedContent.removeAttribute("id");
  }

  clonedContent.querySelectorAll("[id]").forEach(
    element => {
      element.removeAttribute("id");
    }
  );

  /* Prevent the cloned content from participating in
     the original scroll-triggered reveal sequence. */

  clonedContent.classList.remove(
    "mobile-paper-visible"
  );

  animatedLetter.appendChild(
    clonedContent
  );

  /* =========================================================
     10. ALIGN INTRODUCTION BELOW EXISTING NAVIGATION
     ========================================================= */

  function positionExperience() {

    if (finished) {
      return;
    }

    const navigationBottom = navigation
      ? navigation.getBoundingClientRect().bottom
      : header
        ? header.getBoundingClientRect().bottom
        : 0;

    const top = Math.max(
      0,
      Math.round(
        navigationBottom +
        CONFIG.pageTopGap
      )
    );

    experience.style.setProperty(
      "--dr-envelope-top",
      `${top}px`
    );

  }

  positionExperience();

  window.addEventListener(
    "resize",
    positionExperience
  );

  /* =========================================================
     11. GET REAL LETTER DIMENSIONS
     ========================================================= */

  function getRealLetterRect() {

    return paper.getBoundingClientRect();

  }

  /* =========================================================
     12. HANDOFF ANIMATION

     This transitions the animated letter toward the
     actual paper's position.

     ========================================================= */

  function beginLetterHandoff() {

    if (
      finished ||
      !opened ||
      transitioning
    ) {
      return;
    }

    transitioning = true;

    const animatedRect =
      animatedLetter.getBoundingClientRect();

    const realRect =
      getRealLetterRect();

    const dx =
      realRect.left -
      animatedRect.left;

    const dy =
      realRect.top -
      animatedRect.top;

    const scaleX =
      realRect.width /
      animatedRect.width;

    /*
       We use uniform scaling to preserve the visual
       proportions of the emerging sheet.
    */

    const scale = scaleX;

    animatedLetter.style.transformOrigin =
      "top left";

    animatedLetter.classList.add(
      "dr-letter-handoff"
    );

    /*
       The sheet travels toward the actual paper's
       location and expands proportionally.
    */

    animatedLetter.style.transform =
      `translate(${dx}px, ${dy}px) scale(${scale})`;

    /*
       Reveal the real paper while the animated sheet
       is completing its movement.
    */

    later(() => {

      paper.classList.remove(
        "dr-envelope-waiting"
      );

      paper.classList.add(
        "mobile-paper-visible",
        "dr-envelope-revealed"
      );

      if (
        typeof window.drEnvelopeRevealLetter ===
        "function"
      ) {

        window.drEnvelopeRevealLetter();

      }

    }, 550);

    /*
       Begin dissolving the introductory environment.
    */

    later(() => {

      experience.classList.add(
        "dr-experience-leaving"
      );

    }, 680);

  }

  /* =========================================================
     13. COMPLETE EXPERIENCE
     ========================================================= */

  function finishExperience() {

    if (finished) {
      return;
    }

    finished = true;

    paper.classList.remove(
      "dr-envelope-waiting"
    );

    paper.classList.add(
      "mobile-paper-visible",
      "dr-envelope-revealed"
    );

    unlockPage();

    experience.remove();

    window.removeEventListener(
      "resize",
      positionExperience
    );

    window.scrollTo({
      top: 0,
      behavior: "instant"
    });

  }

  /* =========================================================
     14. OPEN ENVELOPE
     ========================================================= */

  const seal = experience.querySelector(
    ".dr-envelope-seal"
  );

  function openEnvelope() {

    if (opened) {
      return;
    }

    opened = true;

    seal.disabled = true;

    experience.classList.add(
      "dr-opening"
    );

    /*
       Step 1:
       Flap opens.

       Step 2:
       Real-content replica rises.

       Step 3:
       Replica transitions toward actual letter.

       Step 4:
       Actual letter becomes visible.

       Step 5:
       Full-screen presentation disappears.
    */

    later(
      beginLetterHandoff,
      CONFIG.handoffStart
    );

    later(
      finishExperience,
      CONFIG.finishDelay
    );

  }

  seal.addEventListener(
    "click",
    openEnvelope
  );

  /* =========================================================
     15. VIEWPORT SAFETY

     If the viewport changes to desktop, remove the
     mobile-only introduction immediately.

     ========================================================= */

  function handleViewportChange(event) {

    if (event.matches) {
      return;
    }

    timers.forEach(
      window.clearTimeout
    );

    finishExperience();

    mobileQuery.removeEventListener(
      "change",
      handleViewportChange
    );

  }

  mobileQuery.addEventListener(
    "change",
    handleViewportChange
  );

  /* =========================================================
     16. REFINE POSITION AFTER FONTS LOAD
     ========================================================= */

  window.addEventListener(
    "load",
    positionExperience,
    {
      once: true
    }
  );

  if (
    document.fonts &&
    document.fonts.ready
  ) {

    document.fonts.ready.then(() => {

      if (!finished) {

        positionExperience();

      }

    });

  }

  /* =========================================================
     17. EVERY REFRESH

     Intentionally no sessionStorage or localStorage.

     The envelope initializes on every new page load.

     ========================================================= */

})();
