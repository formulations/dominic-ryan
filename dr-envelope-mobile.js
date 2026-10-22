/* =========================================================
   DOMINIC RYAN — MOBILE ENVELOPE INTRO
   Refined editorial version
   ========================================================= */

(() => {
  "use strict";

  const MOBILE_QUERY = window.matchMedia("(max-width: 760px)");
  const ENVELOPE_SESSION_KEY = "dr-envelope-opened";

try {
  if (sessionStorage.getItem(ENVELOPE_SESSION_KEY) === "true") {
    return;
  }
} catch (_) {}

  const STYLE_ID = "dr-envelope-editorial-style";
  const OVERLAY_ID = "dr-envelope-editorial";
  const LOCK_CLASS = "dr-envelope-lock";

  const actualPaper = document.querySelector(".paper");
  const actualLetterWrap = document.querySelector(".letter-wrap");

  if (!actualPaper || !actualLetterWrap) return;
  if (document.getElementById(OVERLAY_ID)) return;

  const CTA_TEXT = "𝑇𝑎𝑝 𝑡ℎ𝑒 𝑠𝑒𝑎𝑙.";
  const MONOGRAM_SRC = "/dr-reveals-removebg-preview.png";

  let overlay = null;
  let sealButton = null;
  let hasOpened = false;
  let rafId = null;
  let timers = [];

  injectStyles();
  buildExperience();
  lockViewport();
  window.scrollTo(0, 0);

  requestAnimationFrame(() => {
    if (overlay) {
      overlay.classList.add("is-visible");
    }
  });

  MOBILE_QUERY.addEventListener("change", event => {
    if (!event.matches) {
      cleanup(true);
    }
  });

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;

    style.textContent = `
      @media (max-width: 760px) {

        html.${LOCK_CLASS},
        body.${LOCK_CLASS} {
          overflow: hidden !important;
          overscroll-behavior: none !important;
        }

        body.${LOCK_CLASS} {
          touch-action: manipulation;
        }

        #${OVERLAY_ID} {
          --dr-bg: #f2ede6;
          --dr-card: #f7f1e8;
          --dr-card-border: rgba(176, 156, 136, 0.34);

          --dr-ink: #6f5f54;
          --dr-soft-ink: #938378;

          --dr-envelope: #f6f1e8;
          --dr-envelope-stroke: rgba(179, 160, 142, 0.38);
          --dr-envelope-shadow: rgba(110, 92, 77, 0.08);

          --dr-fold-left: #eee8df;
          --dr-fold-right: #efe8df;
          --dr-front: #f8f4ec;
          --dr-flap: #f4eee6;

          --dr-paper: #fbf8f2;
          --dr-paper-line: rgba(176, 156, 136, 0.16);

          --dr-wax-1: #ead7b7;
          --dr-wax-2: #d8bc93;
          --dr-wax-3: #c7a379;
          --dr-wax-shadow: rgba(118, 95, 74, 0.17);

          position: fixed;
          inset: 0;
          z-index: 99998;
          display: flex;
          align-items: center;
          justify-content: center;
          padding:
            calc(env(safe-area-inset-top, 0px) + 18px)
            18px
            calc(env(safe-area-inset-bottom, 0px) + 18px);
          background:
            radial-gradient(
              circle at 50% 38%,
              rgba(255, 255, 255, 0.58) 0%,
              rgba(255, 255, 255, 0.18) 26%,
              rgba(242, 237, 230, 0.94) 64%,
              rgba(242, 237, 230, 1) 100%
            ),
            var(--dr-bg);
          opacity: 0;
          pointer-events: auto;
          transition: opacity 0.45s ease;
          overflow: hidden;
          isolation: isolate;
        }

        #${OVERLAY_ID}::before {
          content: "";
          position: absolute;
          right: -18vw;
          bottom: -8vh;
          width: 60vw;
          height: 60vw;
          background: url("${MONOGRAM_SRC}") center / contain no-repeat;
          opacity: 0.035;
          filter: saturate(0.7) sepia(0.1);
          pointer-events: none;
          z-index: 0;
        }

        #${OVERLAY_ID}.is-visible {
          opacity: 1;
        }

        #${OVERLAY_ID}.is-handoff {
          opacity: 0;
          pointer-events: none;
        }

        .dr-envelope-card {
          position: relative;
          z-index: 1;
          width: min(90vw, 400px);
          max-height: calc(100dvh - 36px - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px));
          padding: 22px 18px 24px;
          border-radius: 16px;
          border: 1px solid var(--dr-card-border);
          background:
            linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.22) 0%,
              rgba(255, 255, 255, 0.06) 100%
            ),
            var(--dr-card);
          box-shadow:
            0 26px 60px rgba(91, 74, 60, 0.08),
            0 8px 22px rgba(91, 74, 60, 0.05);
          overflow: hidden;
          transform: translateY(12px) scale(0.985);
          transition:
            transform 0.55s cubic-bezier(.22,.61,.36,1),
            box-shadow 0.55s ease,
            opacity 0.4s ease;
        }

        #${OVERLAY_ID}.is-visible .dr-envelope-card {
          transform: translateY(0) scale(1);
        }

        #${OVERLAY_ID}.is-opening .dr-envelope-card {
          transform: translateY(-5px) scale(0.995);
        }

        .dr-envelope-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 18px;
        }

        .dr-envelope-brand-mark {
          display: block;
          width: 58px;
          height: auto;
          flex: none;
          filter: saturate(0.82) sepia(0.08);
          opacity: 0.9;
        }

        .dr-envelope-brand-name {
          font-family:
            "DR Didot",
            Didot,
            "Didot LT STD",
            "Bodoni 72",
            "Bodoni MT",
            Georgia,
            serif;
          font-size: 16px;
          line-height: 1;
          letter-spacing: 0.28em;
          color: rgba(78, 68, 61, 0.96);
          white-space: nowrap;
        }

        .dr-envelope-rule {
          width: 100%;
          height: 1px;
          margin-bottom: 28px;
          background: rgba(176, 156, 136, 0.42);
        }

        .dr-envelope-kicker {
          margin-bottom: 26px;
          text-align: center;
          font-family:
            "DR Avenir Next",
            "Avenir Next",
            "Helvetica Neue",
            Arial,
            sans-serif;
          font-size: 11px;
          line-height: 1;
          font-weight: 500;
          letter-spacing: 0.18em;
          color: rgba(101, 87, 77, 0.9);
          text-transform: uppercase;
        }

        .dr-envelope-scene {
          position: relative;
          width: min(100%, 318px);
          margin: 0 auto;
          aspect-ratio: 1.62 / 1;
          transition: transform 1.15s cubic-bezier(.22,.61,.36,1);
        }

        #${OVERLAY_ID}.is-opening .dr-envelope-scene {
          transform: translateY(-10px);
        }

        .dr-envelope-stage-paper {
          position: absolute;
          left: 8%;
          right: 8%;
          top: 8%;
          height: 72%;
          border-radius: 2px 2px 0 0;
          background:
            linear-gradient(
              180deg,
              rgba(255,255,255,0.86) 0%,
              rgba(251,248,242,1) 100%
            );
          border: 1px solid rgba(182, 164, 146, 0.16);
          box-shadow:
            0 8px 20px rgba(118, 98, 80, 0.05),
            inset 0 1px 0 rgba(255,255,255,0.74);
          z-index: 1;
          transform: translateY(16%);
          transition:
            transform 1.25s cubic-bezier(.2,.72,.18,1),
            box-shadow 1.25s cubic-bezier(.2,.72,.18,1),
            opacity 0.8s ease;
          overflow: hidden;
        }

        .dr-envelope-stage-paper::before {
          content: "";
          position: absolute;
          left: 10%;
          right: 10%;
          top: 12%;
          height: 1px;
          background: var(--dr-paper-line);
          box-shadow:
            0 38px 0 var(--dr-paper-line),
            0 76px 0 var(--dr-paper-line),
            0 114px 0 var(--dr-paper-line);
          opacity: 0.55;
        }

        .dr-envelope-stage-paper::after {
          content: "A Personal Message";
          position: absolute;
          top: 16px;
          left: 0;
          right: 0;
          text-align: center;
          font-family:
            "DR Avenir Next",
            "Avenir Next",
            "Helvetica Neue",
            Arial,
            sans-serif;
          font-size: 9px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(116, 102, 91, 0.72);
        }

        #${OVERLAY_ID}.is-opening .dr-envelope-stage-paper {
          transform: translateY(-34%);
          box-shadow:
            0 18px 36px rgba(118, 98, 80, 0.08),
            inset 0 1px 0 rgba(255,255,255,0.82);
        }

        .dr-envelope-object {
          position: absolute;
          inset: 13% 0 0;
          z-index: 2;
          transition:
            opacity 0.6s ease,
            transform 1.15s cubic-bezier(.22,.61,.36,1);
        }

        #${OVERLAY_ID}.is-opening .dr-envelope-object {
          transform: translateY(8px);
        }

        .dr-envelope-back {
          position: absolute;
          inset: 0;
          background: var(--dr-envelope);
          border: 1px solid var(--dr-envelope-stroke);
          box-shadow:
            0 16px 34px var(--dr-envelope-shadow);
        }

        .dr-envelope-fold-left,
        .dr-envelope-fold-right {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 50.1%;
          z-index: 2;
        }

        .dr-envelope-fold-left {
          left: 0;
          background: var(--dr-fold-left);
          clip-path: polygon(0 0, 100% 50%, 0 100%);
        }

        .dr-envelope-fold-right {
          right: 0;
          background: var(--dr-fold-right);
          clip-path: polygon(100% 0, 0 50%, 100% 100%);
        }

        .dr-envelope-front {
          position: absolute;
          inset: 0;
          z-index: 4;
          background: var(--dr-front);
          clip-path: polygon(0 0, 50% 56%, 100% 0, 100% 100%, 0 100%);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.54);
        }

        .dr-envelope-flap {
          position: absolute;
          inset: 0;
          z-index: 5;
          background: var(--dr-flap);
          clip-path: polygon(0 0, 100% 0, 50% 58%);
          transform-origin: top center;
          transform: rotateX(0deg);
          transition:
            transform 1s cubic-bezier(.22,.61,.36,1) 0.18s,
            opacity 0.45s ease;
          backface-visibility: hidden;
          box-shadow: inset 0 -1px 0 rgba(255,255,255,0.44);
        }

        #${OVERLAY_ID}.is-opening .dr-envelope-flap {
          transform: rotateX(-178deg);
        }

        .dr-envelope-seal {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 84px;
          height: 84px;
          margin: 0;
          padding: 0;
          border: 0;
          background: transparent;
          transform: translate(-50%, -50%);
          z-index: 7;
          cursor: pointer;
          appearance: none;
          -webkit-appearance: none;
          touch-action: manipulation;
          transition:
            transform 0.46s cubic-bezier(.22,.61,.36,1),
            opacity 0.25s ease 0.16s,
            filter 0.4s ease;
        }

        .dr-envelope-seal:focus-visible {
          outline: 2px solid rgba(110, 92, 77, 0.55);
          outline-offset: 5px;
          border-radius: 999px;
        }

        .dr-envelope-seal:hover {
          filter: brightness(1.015);
        }

        #${OVERLAY_ID}.is-opening .dr-envelope-seal {
          transform: translate(-50%, -62%) scale(0.94) rotate(-5deg);
          opacity: 0;
          pointer-events: none;
        }

        .dr-envelope-seal-wax {
          position: absolute;
          inset: 0;
          border-radius: 46% 54% 52% 48% / 51% 45% 55% 49%;
          background:
            radial-gradient(
              circle at 34% 28%,
              rgba(255,255,255,0.56) 0%,
              rgba(255,255,255,0.15) 19%,
              transparent 37%
            ),
            linear-gradient(
              145deg,
              var(--dr-wax-1) 0%,
              var(--dr-wax-2) 56%,
              var(--dr-wax-3) 100%
            );
          box-shadow:
            0 10px 18px var(--dr-wax-shadow),
            inset 0 1px 0 rgba(255,255,255,0.55),
            inset 0 -2px 5px rgba(155, 119, 84, 0.11);
        }

        .dr-envelope-seal-wax::before {
          content: "";
          position: absolute;
          inset: 5px;
          border-radius: 48% 52% 52% 48% / 52% 46% 54% 48%;
          border: 1px solid rgba(255,255,255,0.42);
          opacity: 0.9;
        }

        .dr-envelope-seal-wax::after {
          content: "";
          position: absolute;
          inset: 13px;
          border-radius: 50%;
          border: 1px solid rgba(164, 126, 90, 0.18);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.35),
            0 0 0 1px rgba(255,255,255,0.14);
        }

        .dr-envelope-seal-mark {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 58%;
          height: 58%;
          object-fit: contain;
          transform: translate(-50%, -50%);
          opacity: 0.38;
          filter:
            grayscale(1)
            sepia(0.28)
            saturate(0.7)
            brightness(0.92)
            contrast(0.9);
          pointer-events: none;
        }

        .dr-envelope-instruction {
          margin-top: 26px;
          text-align: center;
          color: var(--dr-soft-ink);
          transition:
            opacity 0.3s ease,
            transform 0.4s ease;
        }

        #${OVERLAY_ID}.is-opening .dr-envelope-instruction {
          opacity: 0;
          transform: translateY(8px);
        }

        .dr-envelope-arrow {
          display: inline-block;
          margin-bottom: 12px;
          font-family:
            "DR Didot",
            Didot,
            Georgia,
            serif;
          font-size: 29px;
          line-height: 1;
          color: rgba(124, 108, 97, 0.9);
          animation: drEnvelopeArrowFloat 1.5s ease-in-out 0.35s 3;
          will-change: transform, opacity;
        }

        .dr-envelope-cta {
          font-family:
            "DR Didot",
            Didot,
            "Didot LT STD",
            "Bodoni 72",
            "Bodoni MT",
            Georgia,
            serif;
          font-size: 19px;
          line-height: 1.35;
          color: rgba(137, 120, 109, 0.96);
          letter-spacing: 0.015em;
          font-style: italic;
        }

        @keyframes drEnvelopeArrowFloat {
          0% {
            opacity: 0.3;
            transform: translateY(0);
          }
          28% {
            opacity: 1;
            transform: translateY(-7px);
          }
          58% {
            opacity: 0.8;
            transform: translateY(0);
          }
          100% {
            opacity: 0.3;
            transform: translateY(0);
          }
        }

        /* Hide any older envelope intro if it still exists anywhere */
        .dr-envelope-intro,
        #dr-envelope-intro {
          display: none !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function buildExperience() {
    overlay = document.createElement("div");
    overlay.id = OVERLAY_ID;
    overlay.setAttribute("aria-label", "Tap the seal to open the personal message");

    overlay.innerHTML = `
      <div class="dr-envelope-card">
        <div class="dr-envelope-brand">
          <img
            class="dr-envelope-brand-mark"
            src="${MONOGRAM_SRC}"
            alt=""
            aria-hidden="true"
          >
          <div class="dr-envelope-brand-name">DOMINIC RYAN</div>
        </div>

        <div class="dr-envelope-rule" aria-hidden="true"></div>

        <div class="dr-envelope-kicker">A PERSONAL MESSAGE</div>

        <div class="dr-envelope-scene">
          <div class="dr-envelope-stage-paper" aria-hidden="true"></div>

          <div class="dr-envelope-object">
            <div class="dr-envelope-back" aria-hidden="true"></div>
            <div class="dr-envelope-fold-left" aria-hidden="true"></div>
            <div class="dr-envelope-fold-right" aria-hidden="true"></div>
            <div class="dr-envelope-front" aria-hidden="true"></div>
            <div class="dr-envelope-flap" aria-hidden="true"></div>

            <button
              class="dr-envelope-seal"
              type="button"
              data-dr-open
              aria-label="Tap the seal to open"
            >
              <span class="dr-envelope-seal-wax" aria-hidden="true"></span>
              <img
                class="dr-envelope-seal-mark"
                src="${MONOGRAM_SRC}"
                alt=""
                aria-hidden="true"
              >
            </button>
          </div>
        </div>

        <div class="dr-envelope-instruction" aria-hidden="true">
          <div class="dr-envelope-arrow">↑</div>
          <div class="dr-envelope-cta">${CTA_TEXT}</div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    sealButton = overlay.querySelector("[data-dr-open]");

    if (sealButton) {
      sealButton.addEventListener("click", beginOpenSequence);
      sealButton.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          beginOpenSequence();
        }
      });
    }

    overlay.addEventListener(
      "wheel",
      event => {
        event.preventDefault();
      },
      { passive: false }
    );

    overlay.addEventListener(
      "touchmove",
      event => {
        event.preventDefault();
      },
      { passive: false }
    );
  }

  function lockViewport() {
    document.documentElement.classList.add(LOCK_CLASS);
    document.body.classList.add(LOCK_CLASS);

    /*
      Keep the page visually still at the top while the intro is active.
      This avoids the awkward underlying movement you saw before.
    */
    window.scrollTo(0, 0);
  }

  function unlockViewport() {
    document.documentElement.classList.remove(LOCK_CLASS);
    document.body.classList.remove(LOCK_CLASS);
  }

function beginOpenSequence() {
  if (hasOpened || !overlay) return;

  hasOpened = true;
  try {
  sessionStorage.setItem(ENVELOPE_SESSION_KEY, "true");
} catch (_) {}

  if (sealButton) {
    sealButton.disabled = true;
    sealButton.setAttribute("aria-disabled", "true");
  }

  overlay.classList.add("is-opening");

  // Allow the envelope and paper animations to play.
  timers.push(
    window.setTimeout(() => {
      handoffToRealMessage();
    }, 1380)
  );

  // Allow the existing letter to complete its gradual reveal.
timers.push(
  window.setTimeout(() => {
    if (overlay) {
      overlay.classList.add("is-handoff");
    }
  }, 5600)
);

// Remove the overlay after its fade finishes.
timers.push(
  window.setTimeout(() => {
    cleanup(false);
  }, 6150)
);
}

function handoffToRealMessage() {
  if (!actualPaper || !overlay) return;

  /*
    Keep the envelope opaque while preparing
    the actual letter underneath.
  */

  const root = document.documentElement;
  const previousScrollBehavior = root.style.scrollBehavior;

  root.style.scrollBehavior = "auto";

  // Release the scroll lock before positioning.
  unlockViewport();

  const targetTop =
    window.scrollY +
    actualPaper.getBoundingClientRect().top -
    20;

  window.scrollTo(0, Math.max(0, targetTop));

  // Reveal the existing letter.
  if (typeof window.drEnvelopeRevealLetter === "function") {
    window.drEnvelopeRevealLetter();
  } else {
    actualPaper.classList.add("mobile-paper-visible");
  }

  requestAnimationFrame(() => {
    root.style.scrollBehavior = previousScrollBehavior;
  });
}

  function cleanup(forceImmediate = false) {
    timers.forEach(timer => clearTimeout(timer));
    timers = [];

    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }

    unlockViewport();

    if (!overlay) return;

    if (forceImmediate) {
      overlay.remove();
      overlay = null;
      return;
    }

    overlay.remove();
    overlay = null;
  }
})();
