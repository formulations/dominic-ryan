/* =========================================================
   DOMINIC RYAN — MOBILE CORRESPONDENCE EXPERIENCE

   REFINED EDITION

   Mobile only: 760px and below

   DESIGN:
   - Full-screen editorial envelope presentation
   - Original header and navigation preserved
   - Ivory correspondence envelope
   - Champagne wax seal
   - Custom DR monogram
   - EB Garamond italic invitation
   - Authentic letter-opening animation

   BEHAVIOR:
   - Envelope appears on every refresh
   - No sessionStorage or localStorage restrictions
   - Page scrolling locked until opening
   - Other page content concealed until opening
   - Letter emerges naturally from envelope
   - Actual letter typography preserved
   - No automatic scrolling to the top
   - No duplicate text during transition
   - Desktop remains unaffected

   ASSETS:
   /dr-envelope-logo.png

   /eb-garamond-latin-400-italic.woff2
   ========================================================= */

(() => {
  "use strict";

  /* =========================================================
     MOBILE ONLY
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
      "dr-envelope-experience"
    )
  ) {
    return;
  }

  /* =========================================================
     ELEMENT REFERENCES
     ========================================================= */

  const hero = document.querySelector(
    ".hero-composition"
  );

  const paper = document.querySelector(
    ".hero-composition > .paper"
  );

  const paperContent = paper?.querySelector(
    ".paper-content"
  );

  const photo = document.querySelector(
    ".photo-stage"
  );

  const instagram = document.querySelector(
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

  if (!hero || !paper || !paperContent) {
    return;
  }

  /* =========================================================
     CONFIGURATION
     ========================================================= */

  const CONFIG = {

    monogram:
      "/dr-envelope-logo.png",

    monogramCrop:
      0.76,

    openingDuration:
      1250,

    letterRiseDuration:
      1650,

    handoffDelay:
      1800,

    completionDelay:
      2450

  };

  /* =========================================================
     STATE
     ========================================================= */

  let opened = false;

  let completed = false;

  let scrollPosition = window.scrollY;

  let originalBodyPosition =
    document.body.style.position;

  let originalBodyTop =
    document.body.style.top;

  let originalBodyWidth =
    document.body.style.width;

  let originalBodyOverflow =
    document.body.style.overflow;

  let originalHtmlOverflow =
    document.documentElement.style.overflow;

  const hiddenElements = [
    photo,
    instagram,
    footer,
    utilityNav,
    backToTop
  ].filter(Boolean);

  /* =========================================================
     FONT
     ========================================================= */

  const fontStyle = document.createElement(
    "style"
  );

  fontStyle.id =
    "dr-envelope-garamond-font";

  fontStyle.textContent = `

    @font-face {

      font-family:
        "DR Envelope Garamond";

      src:
        url("/eb-garamond-latin-400-italic.woff2")
        format("woff2");

      font-style:italic;

      font-weight:400;

      font-display:swap;

    }

  `;

  document.head.appendChild(fontStyle);

  /* =========================================================
     STYLES
     ========================================================= */

  const style = document.createElement(
    "style"
  );

  style.id =
    "dr-envelope-experience-styles";

  style.textContent = `

    @media (max-width:760px) {

      /* ===============================================
         LOCKED EXPERIENCE
         =============================================== */

      html.dr-envelope-locked {

        overflow:hidden !important;

        overscroll-behavior:none;

      }

      body.dr-envelope-locked {

        overflow:hidden !important;

        overscroll-behavior:none;

      }

      body.dr-envelope-locked
      .dr-envelope-hidden-content {

        opacity:0 !important;

        visibility:hidden !important;

        pointer-events:none !important;

      }

      /* ===============================================
         ORIGINAL LETTER
         =============================================== */

      .hero-composition > .paper.dr-envelope-waiting {

        opacity:0 !important;

        visibility:hidden !important;

        pointer-events:none !important;

        animation:none !important;

        transition:none !important;

      }

      .hero-composition > .paper.dr-envelope-waiting
      .paper-content {

        opacity:0 !important;

        animation:none !important;

        transition:none !important;

      }

      .hero-composition > .paper.dr-envelope-revealed {

        opacity:1 !important;

        visibility:visible !important;

        pointer-events:auto !important;

        animation:none !important;

        transition:
          opacity .8s
          cubic-bezier(.22,.61,.36,1) !important;

      }

      .hero-composition > .paper.dr-envelope-revealed
      .paper-content {

        opacity:1 !important;

        transform:none !important;

        animation:none !important;

        transition:
          opacity .8s ease !important;

      }

      /* ===============================================
         FULL-SCREEN CORRESPONDENCE STAGE
         =============================================== */

      #dr-envelope-experience {

        position:fixed;

        inset:0;

        z-index:9000;

        display:flex;

        flex-direction:column;

        align-items:center;

        justify-content:center;

        width:100%;

        height:100vh;

        height:100dvh;

        overflow:hidden;

        background:
          linear-gradient(
            180deg,
            #f2ede6 0%,
            #f1ece5 52%,
            #eee8e1 100%
          );

        isolation:isolate;

        opacity:1;

        transition:
          opacity .8s
          cubic-bezier(.22,.61,.36,1);

      }

      #dr-envelope-experience.dr-finishing {

        opacity:0;

        pointer-events:none;

      }

      /* ===============================================
         EDITORIAL COMPOSITION
         =============================================== */

      .dr-envelope-composition {

        position:relative;

        width:100%;

        max-width:760px;

        display:flex;

        flex-direction:column;

        align-items:center;

        justify-content:center;

        transform:translateY(-1.5vh);

      }

      /* ===============================================
         TITLE
         =============================================== */

      .dr-envelope-title {

        margin:
          0
          0
          clamp(48px,8vh,82px);

        padding:0 18px;

        font-family:
          "DR Avenir Next",
          "Avenir Next",
          Arial,
          sans-serif;

        font-size:
          clamp(12px,3.15vw,15px);

        font-weight:500;

        letter-spacing:.25em;

        line-height:1.5;

        text-align:center;

        color:#75645f;

      }

      /* ===============================================
         ENVELOPE SCENE
         =============================================== */

      .dr-envelope-scene {

        position:relative;

        width:100%;

        max-width:760px;

        aspect-ratio:1.65 / 1;

        perspective:1400px;

        filter:
          drop-shadow(
            0 20px 25px
            rgba(78,63,49,.095)
          );

      }

      /* ===============================================
         ENVELOPE BACK
         =============================================== */

      .dr-envelope-back {

        position:absolute;

        inset:0;

        z-index:1;

        background:
          linear-gradient(
            160deg,
            #f9f6f1 0%,
            #eee9e4 100%
          );

      }

      /* ===============================================
         LETTER WINDOW
         =============================================== */

      .dr-envelope-letter-window {

        position:absolute;

        left:8%;

        right:8%;

        bottom:0;

        height:100%;

        z-index:2;

        overflow:visible;

        pointer-events:none;

      }

      /* ===============================================
         AUTHENTIC LETTER PREVIEW
         =============================================== */

      .dr-envelope-letter-preview {

        position:absolute;

        left:0;

        bottom:0;

        width:100%;

        height:auto;

        min-height:100%;

        padding:0;

        background:#fbf8f2;

        box-shadow:
          0 8px 28px
          rgba(69,54,44,.075);

        opacity:0;

        transform:
          translateY(36%);

        transition:
          transform 1.65s
          cubic-bezier(.22,.61,.36,1),
          opacity .3s ease;

        will-change:transform;

        overflow:hidden;

      }

      .dr-envelope-letter-preview.dr-preview-ready {

        opacity:1;

      }

      /* ===============================================
         REAL LETTER TYPOGRAPHY

         This preview is a clone of the actual
         .paper-content, not a recreated letter.

         The same typography and content are retained.
         =============================================== */

      .dr-envelope-letter-preview
      .dr-envelope-letter-inner {

        width:100%;

        padding:
          24px
          24px
          38px;

        background:#fbf8f2;

        color:#51463e;

      }

      .dr-envelope-letter-preview
      .paper-content {

        opacity:1 !important;

        transform:none !important;

        animation:none !important;

        transition:none !important;

      }

      .dr-envelope-letter-preview
      .signature {

        opacity:1 !important;

        transform:none !important;

        filter:none !important;

        animation:none !important;

      }

      .dr-envelope-letter-preview
      .final-typewriter-text,

      .dr-envelope-letter-preview
      .final-typewriter-ornament {

        opacity:1 !important;

        filter:none !important;

        transition:none !important;

      }

      /* ===============================================
         ENVELOPE SIDE FOLDS
         =============================================== */

      .dr-envelope-fold-left {

        position:absolute;

        inset:0;

        z-index:4;

        background:
          linear-gradient(
            140deg,
            #e9e4df,
            #f0ebe6
          );

        clip-path:
          polygon(
            0 0,
            51% 50%,
            0 100%
          );

      }

      .dr-envelope-fold-right {

        position:absolute;

        inset:0;

        z-index:4;

        background:
          linear-gradient(
            220deg,
            #eae5e0,
            #f0ebe6
          );

        clip-path:
          polygon(
            100% 0,
            49% 50%,
            100% 100%
          );

      }

      /* ===============================================
         FRONT POCKET

         The pocket remains in front of the letter
         during the entire opening sequence.
         =============================================== */

      .dr-envelope-front {

        position:absolute;

        inset:0;

        z-index:5;

        background:
          linear-gradient(
            180deg,
            #f1ece7,
            #e7e2de
          );

        clip-path:
          polygon(
            0 100%,
            50% 50%,
            100% 100%
          );

      }

      /* ===============================================
         ENVELOPE FLAP
         =============================================== */

      .dr-envelope-flap {

        position:absolute;

        top:0;

        left:0;

        width:100%;

        height:100%;

        z-index:7;

        background:
          linear-gradient(
            180deg,
            #fbf9f6,
            #eee9e4
          );

        clip-path:
          polygon(
            0 0,
            100% 0,
            50% 50%
          );

        transform-origin:
          center top;

        transform:
          rotateX(0deg);

        backface-visibility:hidden;

        transition:
          transform 1.25s
          cubic-bezier(.22,.61,.36,1),
          z-index 0s linear 1.1s;

      }

      /* ===============================================
         WAX SEAL
         =============================================== */

      .dr-envelope-seal {

        position:absolute;

        top:50%;

        left:50%;

        z-index:10;

        width:
          clamp(94px,22vw,124px);

        height:
          clamp(94px,22vw,124px);

        padding:0;

        border:0;

        border-radius:50%;

        cursor:pointer;

        transform:
          translate(-50%,-50%);

        background:
          radial-gradient(
            circle at 36% 25%,
            #fff3dc 0%,
            #e9d1af 34%,
            #c6a07c 77%,
            #ad8666 100%
          );

        box-shadow:
          0 13px 24px
          rgba(73,51,35,.2),
          inset 0 2px 5px
          rgba(255,255,255,.65),
          inset 0 -4px 7px
          rgba(113,76,48,.19);

        display:flex;

        align-items:center;

        justify-content:center;

        -webkit-tap-highlight-color:transparent;

        transition:
          opacity .35s ease,
          transform .45s
          cubic-bezier(.22,.61,.36,1);

      }

      .dr-envelope-seal::before {

        content:"";

        position:absolute;

        inset:9%;

        border-radius:50%;

        border:
          2px solid
          rgba(255,248,232,.9);

        box-shadow:
          inset 0 1px 2px
          rgba(114,82,58,.16);

        pointer-events:none;

      }

      /* ===============================================
         MONOGRAM

         No oversized image scaling.

         The image is centered within its own
         clipping region.

         Only the lower R tail is intentionally
         removed by the prepared canvas image.
         =============================================== */

      .dr-envelope-monogram {

        position:relative;

        z-index:2;

        width:69%;

        height:69%;

        display:block;

        object-fit:contain;

        opacity:.9;

        filter:
          drop-shadow(
            0 1px 1px
            rgba(255,250,239,.4)
          );

        pointer-events:none;

      }

      /* ===============================================
         INVITATION
         =============================================== */

      .dr-envelope-invitation {

        display:flex;

        flex-direction:column;

        align-items:center;

        justify-content:center;

        gap:19px;

        margin-top:
          clamp(46px,8vh,82px);

        color:#82716d;

      }

      .dr-envelope-arrow {

        width:25px;

        height:39px;

        display:block;

        animation:
          drEnvelopeArrowFloat
          2.6s
          ease-in-out
          infinite;

      }

      @keyframes drEnvelopeArrowFloat {

        0%,100% {

          transform:translateY(3px);

        }

        50% {

          transform:translateY(-3px);

        }

      }

      .dr-envelope-invitation-text {

        font-family:
          "DR Envelope Garamond",
          Georgia,
          serif;

        font-style:italic;

        font-weight:400;

        font-size:
          clamp(29px,7vw,43px);

        line-height:1.15;

        letter-spacing:.005em;

        text-align:center;

      }

      /* ===============================================
         OPENING
         =============================================== */

      #dr-envelope-experience.dr-opening
      .dr-envelope-flap {

        transform:
          rotateX(178deg);

        z-index:1;

      }

      #dr-envelope-experience.dr-opening
      .dr-envelope-seal {

        opacity:0;

        transform:
          translate(-50%,-50%)
          scale(.9);

        pointer-events:none;

      }

      #dr-envelope-experience.dr-opening
      .dr-envelope-letter-preview {

        transform:
          translateY(-54%);

      }

      #dr-envelope-experience.dr-opening
      .dr-envelope-invitation {

        opacity:0;

        transition:
          opacity .45s ease;

      }

      /* ===============================================
         HANDOFF
         =============================================== */

      #dr-envelope-experience.dr-handoff
      .dr-envelope-letter-preview {

        opacity:0;

        transition:
          opacity .25s ease;

      }

      /* ===============================================
         REDUCED MOTION
         =============================================== */

      @media (
        prefers-reduced-motion:reduce
      ) {

        .dr-envelope-flap,

        .dr-envelope-letter-preview,

        .dr-envelope-seal,

        #dr-envelope-experience {

          transition-duration:.15s !important;

        }

        .dr-envelope-arrow {

          animation:none !important;

        }

      }

    }

  `;

  document.head.appendChild(style);

  /* =========================================================
     CREATE EXPERIENCE
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

    <div class="dr-envelope-composition">

      <h2 class="dr-envelope-title">
        A PERSONAL MESSAGE
      </h2>

      <div class="dr-envelope-scene">

        <div
          class="dr-envelope-back"
          aria-hidden="true"
        ></div>

        <div
          class="dr-envelope-letter-window"
          aria-hidden="true"
        >

          <div
            class="dr-envelope-letter-preview"
          >

            <div
              class="dr-envelope-letter-inner"
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
          aria-label="Open personal message"
        >

          <img
            class="dr-envelope-monogram"
            alt=""
          >

        </button>

      </div>

      <div class="dr-envelope-invitation">

        <svg
          class="dr-envelope-arrow"
          viewBox="0 0 24 40"
          fill="none"
          aria-hidden="true"
        >

          <path
            d="M12 38V3M2 13L12 3L22 13"
            stroke="currentColor"
            stroke-width="1.4"
            stroke-linecap="round"
            stroke-linejoin="round"
          />

        </svg>

        <div class="dr-envelope-invitation-text">
          Tap the seal to open
        </div>

      </div>

    </div>

  `;

  document.body.appendChild(experience);

  /* =========================================================
     LETTER PREVIEW

     Clone the actual paper content.

     This ensures the wording, formatting,
     and underlying typography remain aligned
     with the real personal letter.
     ========================================================= */

  const previewInner =
    experience.querySelector(
      ".dr-envelope-letter-inner"
    );

  const preview =
    experience.querySelector(
      ".dr-envelope-letter-preview"
    );

  const clonedContent =
    paperContent.cloneNode(true);

  clonedContent.removeAttribute("id");

  previewInner.appendChild(clonedContent);

  /* =========================================================
     MATCH ACTUAL LETTER TYPOGRAPHY

     Copy computed typography from the real letter
     to corresponding elements in the preview.

     This prevents a different-looking letter.
     ========================================================= */

  function matchTypography() {

    const sourceElements = [
      paperContent,
      ...paperContent.querySelectorAll("*")
    ];

    const cloneElements = [
      clonedContent,
      ...clonedContent.querySelectorAll("*")
    ];

    const properties = [

      "font-family",

      "font-size",

      "font-weight",

      "font-style",

      "line-height",

      "letter-spacing",

      "color",

      "text-transform",

      "text-decoration",

      "text-align"

    ];

    sourceElements.forEach(
      (source, index) => {

        const target =
          cloneElements[index];

        if (!target) {
          return;
        }

        const computed =
          window.getComputedStyle(source);

        properties.forEach(property => {

          target.style.setProperty(
            property,
            computed.getPropertyValue(property)
          );

        });

      }
    );

  }

  matchTypography();

  /* =========================================================
     MONOGRAM PREPARATION

     Important:
     - Uses the new uploaded PNG
     - Detects visible image bounds
     - Removes transparent padding
     - Preserves the D
     - Preserves the upper R
     - Crops the lower R tail
     - Centers the remaining visible design

     The source file is not modified.
     ========================================================= */

  const monogramElement =
    experience.querySelector(
      ".dr-envelope-monogram"
    );

  function prepareMonogram() {

    const source = new Image();

    source.decoding = "async";

    source.onload = () => {

      try {

        const sourceCanvas =
          document.createElement("canvas");

        sourceCanvas.width =
          source.naturalWidth;

        sourceCanvas.height =
          source.naturalHeight;

        const sourceContext =
          sourceCanvas.getContext(
            "2d",
            {
              willReadFrequently:true
            }
          );

        sourceContext.drawImage(
          source,
          0,
          0
        );

        const width =
          sourceCanvas.width;

        const height =
          sourceCanvas.height;

        const pixels =
          sourceContext.getImageData(
            0,
            0,
            width,
            height
          ).data;

        let minX = width;

        let minY = height;

        let maxX = 0;

        let maxY = 0;

        let found = false;

        for (
          let y = 0;
          y < height;
          y++
        ) {

          for (
            let x = 0;
            x < width;
            x++
          ) {

            const alpha =
              pixels[
                (y * width + x) * 4 + 3
              ];

            if (alpha > 35) {

              found = true;

              minX = Math.min(minX,x);

              minY = Math.min(minY,y);

              maxX = Math.max(maxX,x);

              maxY = Math.max(maxY,y);

            }

          }

        }

        if (!found) {

          monogramElement.src =
            CONFIG.monogram;

          return;

        }

        const visibleWidth =
          maxX - minX + 1;

        const visibleHeight =
          maxY - minY + 1;

        /* Crop the lower R tail, not the D. */

        const croppedHeight =
          Math.round(
            visibleHeight *
            CONFIG.monogramCrop
          );

        const outputSize = 400;

        const output =
          document.createElement("canvas");

        output.width =
          outputSize;

        output.height =
          outputSize;

        const context =
          output.getContext("2d");

        const padding = 35;

        const available =
          outputSize - padding * 2;

        const scale =
          Math.min(
            available / visibleWidth,
            available / croppedHeight
          );

        const drawWidth =
          visibleWidth * scale;

        const drawHeight =
          croppedHeight * scale;

        const drawX =
          (outputSize - drawWidth) / 2;

        const drawY =
          (outputSize - drawHeight) / 2;

        context.drawImage(

          sourceCanvas,

          minX,

          minY,

          visibleWidth,

          croppedHeight,

          drawX,

          drawY,

          drawWidth,

          drawHeight

        );

        monogramElement.src =
          output.toDataURL("image/png");

      } catch (_) {

        monogramElement.src =
          CONFIG.monogram;

      }

    };

    source.onerror = () => {

      monogramElement.src =
        CONFIG.monogram;

    };

    source.src =
      CONFIG.monogram;

  }

  prepareMonogram();

  /* =========================================================
     CONCEAL OTHER PAGE ELEMENTS

     Header and navigation remain untouched.
     ========================================================= */

  hiddenElements.forEach(element => {

    element.classList.add(
      "dr-envelope-hidden-content"
    );

  });

  /* =========================================================
     CONCEAL ORIGINAL LETTER
     ========================================================= */

  paper.classList.add(
    "dr-envelope-waiting"
  );

  paper.classList.remove(
    "mobile-paper-visible"
  );

  /* =========================================================
     SCROLL LOCK

     The user cannot scroll the page until the
     envelope has finished opening.
     ========================================================= */

  function lockScroll() {

    scrollPosition =
      window.scrollY;

    document.documentElement.classList.add(
      "dr-envelope-locked"
    );

    document.body.classList.add(
      "dr-envelope-locked"
    );

    document.body.style.position =
      "fixed";

    document.body.style.top =
      `-${scrollPosition}px`;

    document.body.style.width =
      "100%";

    document.body.style.overflow =
      "hidden";

    document.documentElement.style.overflow =
      "hidden";

  }

  function unlockScroll() {

    document.documentElement.classList.remove(
      "dr-envelope-locked"
    );

    document.body.classList.remove(
      "dr-envelope-locked"
    );

    document.body.style.position =
      originalBodyPosition;

    document.body.style.top =
      originalBodyTop;

    document.body.style.width =
      originalBodyWidth;

    document.body.style.overflow =
      originalBodyOverflow;

    document.documentElement.style.overflow =
      originalHtmlOverflow;

    /* Restore position without a visible jump. */

    window.scrollTo({
      top:scrollPosition,
      left:0,
      behavior:"instant"
    });

  }

  lockScroll();

  /* =========================================================
     PREVIEW READY
     ========================================================= */

  requestAnimationFrame(() => {

    preview.classList.add(
      "dr-preview-ready"
    );

  });

  /* =========================================================
     REVEAL ORIGINAL PAGE
     ========================================================= */

  function revealOriginalPage() {

    if (completed) {
      return;
    }

    completed = true;

    paper.classList.remove(
      "dr-envelope-waiting"
    );

    paper.classList.add(
      "mobile-paper-visible",
      "dr-envelope-revealed"
    );

    hiddenElements.forEach(element => {

      element.classList.remove(
        "dr-envelope-hidden-content"
      );

    });

    if (
      typeof window.drEnvelopeRevealLetter ===
      "function"
    ) {

      window.drEnvelopeRevealLetter();

    }

  }

  /* =========================================================
     OPEN ENVELOPE
     ========================================================= */

  const seal =
    experience.querySelector(
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

    /* Begin with the original flap opening. */

    setTimeout(() => {

      preview.classList.add(
        "dr-preview-ready"
      );

    }, 150);

    /* Fade preview before showing the actual letter. */

    setTimeout(() => {

      experience.classList.add(
        "dr-handoff"
      );

    }, CONFIG.handoffDelay);

    /* Reveal the full, original personal letter. */

    setTimeout(() => {

      revealOriginalPage();

    }, CONFIG.handoffDelay + 180);

    /* Remove envelope and restore scrolling. */

    setTimeout(() => {

      experience.classList.add(
        "dr-finishing"
      );

    }, CONFIG.completionDelay - 500);

    setTimeout(() => {

      experience.remove();

      unlockScroll();

    }, CONFIG.completionDelay);

  }

  seal.addEventListener(
    "click",
    openEnvelope
  );

  /* =========================================================
     RESPONSIVE SAFETY

     If the viewport changes to desktop,
     remove the mobile-only experience.
     ========================================================= */

  function handleViewportChange(event) {

    if (event.matches) {
      return;
    }

    revealOriginalPage();

    experience.remove();

    unlockScroll();

  }

  mobileQuery.addEventListener(
    "change",
    handleViewportChange
  );

  /* =========================================================
     EVERY REFRESH

     No sessionStorage.

     No localStorage.

     No cookies.

     The envelope initializes on every mobile
     page load, including private browsing.
     ========================================================= */

})();
