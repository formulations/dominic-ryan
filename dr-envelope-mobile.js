/* =========================================================
   DOMINIC RYAN — MOBILE CORRESPONDENCE
   VERSION 10 — LETTER CONTINUITY

   TESTING MODE:
   Envelope appears on EVERY mobile page refresh.

   DESIGNED FOR:
   index3.html

   EXISTING ELEMENTS:
   .hero-composition
   .paper
   .paper-content
   .message-label
   .paper h1
   .paper p

   EXISTING GITHUB ASSET:
   /dr-reveals-removebg-preview.png

   NO OTHER JAVASCRIPT FILES REQUIRED.
   ========================================================= */

(() => {
  "use strict";

  /* =======================================================
     MOBILE ONLY
     ======================================================= */

  const mobileQuery = window.matchMedia(
    "(max-width: 760px)"
  );

  if (!mobileQuery.matches) return;

  /* =======================================================
     EXISTING WEBSITE ELEMENTS
     ======================================================= */

  const hero = document.querySelector(
    ".hero-composition"
  );

  const paper = hero?.querySelector(
    ":scope > .paper"
  );

  const paperContent = paper?.querySelector(
    ".paper-content"
  );

  if (!hero || !paper || !paperContent) return;

  if (
    document.getElementById("dr-envelope-inline")
  ) return;

  /* =======================================================
     CONFIGURATION
     ======================================================= */

  const CONFIG = {
    monogram: "/dr-reveals-removebg-preview.png",

    flapDuration: 900,

    letterRiseDelay: 450,

    expandDelay: 1750,

    transitionDuration: 850,

    cleanupDelay: 2850
  };

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* =======================================================
     COPY ACTUAL LETTER CONTENT

     We clone the opening content from index3.html.
     No separately maintained letter copy is needed.
     ======================================================= */

  const originalLabel = paperContent.querySelector(
    ".message-label"
  );

  const originalHeading = paperContent.querySelector(
    "h1"
  );

  const originalParagraph = paperContent.querySelector(
    "p:not(.final-typewriter)"
  );

  const letterPreview = document.createElement("div");

  letterPreview.className = "dr-env-letter-content";

  if (originalLabel) {
    const label = originalLabel.cloneNode(true);
    label.removeAttribute("id");
    letterPreview.appendChild(label);
  }

  if (originalHeading) {
    const heading = originalHeading.cloneNode(true);
    heading.removeAttribute("id");
    letterPreview.appendChild(heading);
  }

  if (originalParagraph) {
    const paragraph = originalParagraph.cloneNode(true);
    paragraph.removeAttribute("id");
    letterPreview.appendChild(paragraph);
  }

  /* =======================================================
     STYLING
     ======================================================= */

  const style = document.createElement("style");

  style.id = "dr-envelope-v10-styles";

  style.textContent = `

    @media (max-width: 760px) {

      /* ===================================================
         EXISTING LETTER COORDINATION
         =================================================== */

      .hero-composition {
        position: relative;
      }

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

      .hero-composition > .paper.dr-letter-revealed {
        opacity: 1 !important;
        visibility: visible !important;
        animation: none !important;

        transition:
          opacity 0.65s ease,
          box-shadow 0.65s ease !important;
      }

      .hero-composition
      > .paper.dr-letter-revealed
      .paper-content {
        opacity: 1 !important;
        animation: none !important;
      }

      /* ===================================================
         PRESENTATION CARD
         =================================================== */

      #dr-envelope-inline {
        position: absolute;

        top: 0;
        left: 50%;

        transform: translateX(-50%);

        width: min(94vw, 520px);

        padding:
          38px
          clamp(14px, 3.5vw, 20px)
          42px;

        display: flex;
        flex-direction: column;

        align-items: center;
        justify-content: center;

        border:
          1px solid rgba(172,150,128,.28);

        border-radius: 9px;

        background:
          linear-gradient(
            160deg,
            #f4efe6,
            #f1eae0
          );

        box-shadow:
          0 16px 42px
          rgba(78,63,49,.055);

        isolation: isolate;

        z-index: 8;

        opacity: 1;

        transition:
          opacity .65s ease;
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

        font-size: 11px;

        font-weight: 500;

        letter-spacing: .2em;

        line-height: 1.5;

        text-align: center;

        color: #74645a;
      }

      /* ===================================================
         ENVELOPE SCENE
         =================================================== */

      #dr-envelope-inline .dr-envelope-scene {
        position: relative;

        width: min(100%, 410px);

        aspect-ratio: 1.65 / 1;

        flex: none;

        margin-top: 42px;

        perspective: 1200px;

        isolation: isolate;
      }

      /* ===================================================
         ENVELOPE BACK
         =================================================== */

      #dr-envelope-inline .dr-env-back {
        position: absolute;
        inset: 0;

        z-index: 1;

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
          rgba(80,60,45,.08);
      }

      /* ===================================================
         STATIONERY

         The sheet starts behind the envelope's front
         pocket and remains completely concealed until
         the opening animation begins.
         =================================================== */

      #dr-envelope-inline .dr-env-sheet {
        position: absolute;

        left: 7%;
        right: 7%;

        top: 16%;

        height: 78%;

        z-index: 2;

        overflow: hidden;

        background: #fbf8f2;

        border:
          1px solid #e7ded2;

        box-shadow:
          0 3px 10px
          rgba(80,60,45,.06);

        opacity: 0;

        transform:
          translateY(12%);

        transition:
          transform 1.25s
          cubic-bezier(.22,.61,.36,1),
          opacity .25s ease;
      }

      /* ===================================================
         ACTUAL LETTER PREVIEW
         =================================================== */

      #dr-envelope-inline .dr-env-letter-content {
        padding: 22px 21px;

        font-family:
          "DR Avenir Next",
          "Avenir Next",
          Arial,
          sans-serif;

        color: #51463e;
      }

      #dr-envelope-inline
      .dr-env-letter-content .message-label {
        margin: 0 0 14px;

        font-size: 8px;

        font-weight: 500;

        line-height: 1.5;

        letter-spacing: .1em;

        text-transform: uppercase;

        color: #7a6f67;
      }

      #dr-envelope-inline
      .dr-env-letter-content h1 {
        margin: 0 0 12px;

        font-family:
          "DR Avenir Next",
          Arial,
          sans-serif;

        font-size: 14px;

        font-weight: 500;

        line-height: 1.4;

        color: #51463e;
      }

      #dr-envelope-inline
      .dr-env-letter-content p {
        margin: 0;

        font-family:
          "DR Avenir Next",
          Arial,
          sans-serif;

        font-size: 10px;

        font-weight: 400;

        line-height: 1.55;

        color: #5c524b;
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
          transform .9s
          cubic-bezier(.22,.61,.36,1);

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
          clamp(76px,21vw,98px);

        height:
          clamp(76px,21vw,98px);

        padding: 0;

        border: 0;

        background: transparent;

        cursor: pointer;

        touch-action: manipulation;

        -webkit-tap-highlight-color:
          transparent;

        transition:
          opacity .3s ease,
          transform .4s ease;
      }

      /* ===================================================
         CHAMPAGNE WAX
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
          rgba(103,77,55,.22),
          inset 0 2px 2px
          #fff4dc,
          inset 0 -3px 5px
          rgba(106,76,48,.16);
      }

      /* Single restrained embossed ring */

      #dr-envelope-inline .dr-env-wax::before {
        content: "";

        position: absolute;

        inset: 10%;

        border:
          1px solid
          rgba(255,247,229,.65);

        border-radius: 50%;

        box-shadow:
          inset 0 1px 2px
          rgba(116,84,53,.16),
          0 1px 1px
          rgba(255,250,238,.35);
      }

      /* ===================================================
         MONOGRAM IMPRESSION

         Uses the existing DR artwork, with a separate
         optical-positioning container.
         =================================================== */

      #dr-envelope-inline .dr-env-monogram {
        position: absolute;

        left: 50%;
        top: 50%;

        width: 54%;
        height: 54%;

        transform:
          translate(-50%, -50%);

        display: flex;

        align-items: center;
        justify-content: center;

        pointer-events: none;
      }

      #dr-envelope-inline .dr-env-monogram img {
        display: block;

        width: 100%;
        height: 100%;

        object-fit: contain;

        opacity: .48;

        filter:
          sepia(1)
          saturate(.35)
          brightness(.72);

        transform:
          translate(-3%, -3%);

        pointer-events: none;
      }

      /* ===================================================
         INTERACTION PROMPT
         =================================================== */

      #dr-envelope-inline .dr-env-prompt {
        display: flex;
        flex-direction: column;

        align-items: center;

        gap: 8px;

        margin-top: 32px;

        font-family:
          "DR Avenir Next",
          "Avenir Next",
          Arial,
          sans-serif;

        font-size:
          clamp(10px,2.9vw,12px);

        font-weight: 500;

        line-height: 1.4;

        letter-spacing: .15em;

        text-align: center;

        color: #88786c;

        transition:
          opacity .3s ease;
      }

      #dr-envelope-inline .dr-env-arrow {
        display: block;

        font-family:
          Georgia,
          serif;

        font-size: 27px;

        line-height: 1;

        animation:
          drEnvBounce
          1.6s
          ease-in-out
          infinite;
      }

      @keyframes drEnvBounce {
        0%, 100% {
          transform: translateY(3px);
        }

        50% {
          transform: translateY(-3px);
        }
      }

      /* ===================================================
         OPENING SEQUENCE
         =================================================== */

      #dr-envelope-inline.dr-opening .dr-env-seal {
        opacity: 0;

        transform:
          translate(-50%, -64%)
          scale(.92);

        pointer-events: none;
      }

      #dr-envelope-inline.dr-opening .dr-env-flap {
        transform:
          rotateX(178deg);
      }

      #dr-envelope-inline.dr-opening .dr-env-sheet {
        opacity: 1;

        transform:
          translateY(-78%);

        transition-delay:
          .42s,
          .36s;
      }

      #dr-envelope-inline.dr-opening .dr-env-prompt {
        opacity: 0;
      }

      /* ===================================================
         TRANSITION TO ACTUAL LETTER
         =================================================== */

      #dr-envelope-inline.dr-handoff {
        opacity: 0;
        pointer-events: none;
      }

      /* ===================================================
         FLOATING TRANSITION SHEET
         =================================================== */

      .dr-envelope-transition-sheet {
        position: fixed;

        z-index: 9997;

        margin: 0;

        overflow: hidden;

        background: #fbf8f2;

        border:
          1px solid rgba(231,222,210,.8);

        box-shadow:
          0 16px 35px
          rgba(70,57,47,.12);

        pointer-events: none;

        transform-origin: top left;

        transition:
          top .85s
          cubic-bezier(.22,.61,.36,1),
          left .85s
          cubic-bezier(.22,.61,.36,1),
          width .85s
          cubic-bezier(.22,.61,.36,1),
          height .85s
          cubic-bezier(.22,.61,.36,1),
          opacity .35s ease;
      }

      .dr-envelope-transition-sheet
      .dr-env-letter-content {
        padding: 22px 21px;
      }

      .dr-envelope-transition-sheet
      .message-label {
        margin: 0 0 14px;
        font-size: 8px;
        letter-spacing: .1em;
        text-transform: uppercase;
        color: #7a6f67;
      }

      .dr-envelope-transition-sheet h1 {
        margin: 0 0 12px;
        font-size: 14px;
        font-weight: 500;
        color: #51463e;
      }

      .dr-envelope-transition-sheet p {
        margin: 0;
        font-size: 10px;
        line-height: 1.55;
        color: #5c524b;
      }

      /* ===================================================
         SMALLER MOBILE SCREENS
         =================================================== */

      @media (max-height: 650px) {

        #dr-envelope-inline {
          padding:
            28px 14px 30px;
        }

        #dr-envelope-inline .dr-envelope-scene {
          margin-top: 35px;
        }

        #dr-envelope-inline .dr-env-prompt {
          margin-top: 27px;
        }

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

      @media (prefers-reduced-motion: reduce) {

        #dr-envelope-inline *,
        #dr-envelope-inline,
        .dr-envelope-transition-sheet {
          animation-duration:
            .01ms !important;

          transition-duration:
            .01ms !important;
        }

      }

    }

  `;

  document.head.appendChild(style);

  /* =======================================================
     PREPARE EXISTING LETTER
     ======================================================= */

  paper.classList.add(
    "dr-envelope-waiting"
  );

  /* =======================================================
     CREATE ENVELOPE
     ======================================================= */

  const envelope = document.createElement("section");

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
      ></div>

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

        <span
          class="dr-env-monogram"
          aria-hidden="true"
        >
          <img
            src="${CONFIG.monogram}"
            alt=""
          >
        </span>

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

  const envelopeSheet = envelope.querySelector(
    ".dr-env-sheet"
  );

  envelopeSheet.appendChild(
    letterPreview
  );

  hero.insertBefore(
    envelope,
    paper
  );

  /* =======================================================
     ANIMATION STATE
     ======================================================= */

  let opened = false;

  let transitionSheet = null;

  const timers = [];

  const later = (callback, delay) => {
    timers.push(
      window.setTimeout(callback, delay)
    );
  };

  /* =======================================================
     REVEAL ACTUAL LETTER
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
     TRANSITION SHEET INTO ACTUAL LETTER
     ======================================================= */

  const expandLetter = () => {

    if (reducedMotion) {
      revealLetter();
      envelope.remove();
      return;
    }

    const sourceRect =
      envelopeSheet.getBoundingClientRect();

    const targetRect =
      paper.getBoundingClientRect();

    /*
       Create a temporary copy of the stationery.

       This copy can move beyond the envelope pocket
       without being clipped by the envelope folds.
    */

    transitionSheet = document.createElement("div");

    transitionSheet.className =
      "dr-envelope-transition-sheet";

    transitionSheet.appendChild(
      letterPreview.cloneNode(true)
    );

    Object.assign(
      transitionSheet.style,
      {
        top: `${sourceRect.top}px`,
        left: `${sourceRect.left}px`,
        width: `${sourceRect.width}px`,
        height: `${sourceRect.height}px`
      }
    );

    document.body.appendChild(
      transitionSheet
    );

    /*
       Hide the original envelope stationery
       while its floating counterpart takes over.
    */

    envelopeSheet.style.opacity = "0";

    /*
       Begin expanding toward the actual letter.
    */

    requestAnimationFrame(() => {

      requestAnimationFrame(() => {

        Object.assign(
          transitionSheet.style,
          {
            top: `${targetRect.top}px`,
            left: `${targetRect.left}px`,
            width: `${targetRect.width}px`,
            height: `${targetRect.height}px`
          }
        );

      });

    });

    /*
       Reveal the real letter near the end of
       the transition.
    */

    later(() => {

      revealLetter();

      envelope.classList.add(
        "dr-handoff"
      );

      transitionSheet.style.opacity = "0";

    }, 650);

  };

  /* =======================================================
     SEAL INTERACTION
     ======================================================= */

  const seal = envelope.querySelector(
    ".dr-env-seal"
  );

  seal.addEventListener(
    "click",
    () => {

      if (opened) return;

      opened = true;

      seal.disabled = true;

      /* Release seal and open flap. */

      envelope.classList.add(
        "dr-opening"
      );

      /* Expand stationery into actual letter. */

      later(
        expandLetter,
        CONFIG.expandDelay
      );

      /* Final cleanup. */

      later(() => {

        revealLetter();

        envelope.remove();

        transitionSheet?.remove();

      }, CONFIG.cleanupDelay);

    }
  );

  /* =======================================================
     VIEWPORT CHANGE
     ======================================================= */

  const handleViewportChange = (event) => {

    if (event.matches) return;

    timers.forEach(clearTimeout);

    envelope.remove();

    transitionSheet?.remove();

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
