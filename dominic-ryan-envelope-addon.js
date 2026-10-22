/* =========================================================
   DOMINIC RYAN
   MOBILE CORRESPONDENCE — VERSION 3

   Scroll-driven envelope introduction
   Refined wax seal
   Shorter animation runway
   Mobile only

   Requires:
   - .letter-wrap
   - .paper
   - /dr-reveals-removebg-preview.png

   ========================================================= */

(() => {
  "use strict";

  /* =========================================================
     MOBILE ONLY
     ========================================================= */

  if (!window.matchMedia("(max-width:760px)").matches) {
    return;
  }

  if (document.getElementById("dr-correspondence-threshold")) {
    return;
  }

  const letterWrap = document.querySelector(".letter-wrap");
  const paper = document.querySelector(".paper");

  if (!letterWrap || !paper) {
    return;
  }

  /* =========================================================
     STYLING
     ========================================================= */

  const style = document.createElement("style");

  style.textContent = `

    @media (max-width:760px) {

      /* =====================================================
         SCROLL THRESHOLD
         ===================================================== */

      #dr-correspondence-threshold {
        --dr-progress: 0;
        --dr-instruction: 1;

        position: relative;

        height: 132svh;
        min-height: 0;

        background: var(--bg, #f2ede6);

        isolation: isolate;
      }

      /* =====================================================
         STICKY STAGE
         ===================================================== */

      #dr-correspondence-stage {
        position: sticky;

        top: 0;

        height: 100svh;
        min-height: 420px;

        overflow: hidden;

        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;

        padding: 12px 14px 16px;

        background:
          radial-gradient(
            ellipse 70% 48% at 50% 48%,
            rgba(255,250,241,.5),
            transparent 90%
          );
      }

      #dr-correspondence-stage::before {
        content: "";

        position: absolute;
        inset: 0;

        pointer-events: none;

        background:
          radial-gradient(
            ellipse at 50% 45%,
            transparent 32%,
            rgba(102,79,59,.028) 100%
          );
      }

      /* =====================================================
         ENVELOPE GROUP
         ===================================================== */

      .dr-correspondence-group {
        position: relative;

        width: min(80vw,390px);

        flex: none;

        transform:
          translateY(
            calc(var(--dr-progress) * -12px)
          )
          scale(
            calc(1 - var(--dr-progress) * .035)
          );

        opacity: var(--dr-envelope-opacity,1);

        will-change: transform,opacity;
      }

      /* =====================================================
         ENVELOPE BODY
         ===================================================== */

      .dr-correspondence-envelope {
        position: relative;

        width: 100%;
        aspect-ratio: 1.43;

        perspective: 1200px;

        filter:
          drop-shadow(
            0 26px 28px rgba(66,48,34,.12)
          )
          drop-shadow(
            0 8px 12px rgba(66,48,34,.07)
          );
      }

      .dr-correspondence-back {
        position: absolute;
        inset: 0;

        background:
          linear-gradient(
            142deg,
            #faf7f2 0%,
            #eee8e1 57%,
            #e4dbd1 100%
          );

        border:
          1px solid rgba(135,113,93,.25);
      }

      .dr-correspondence-inside {
        position: absolute;

        left: 2px;
        right: 2px;
        top: 2px;

        height: 70%;

        background:
          linear-gradient(
            #d9cabe,
            #f3ece5 62%,
            #f8f3ed
          );

        clip-path:
          polygon(
            0 0,
            100% 0,
            50% 82%
          );

        box-shadow:
          inset 0 3px 12px rgba(69,51,37,.13);
      }

      /* =====================================================
         ENVELOPE FRONT FOLDS
         ===================================================== */

      .dr-correspondence-front {
        position: absolute;

        inset: 0;

        z-index: 3;

        width: 100%;
        height: 100%;

        overflow: visible;

        filter:
          drop-shadow(
            0 -1px 1px rgba(100,78,57,.035)
          );
      }

      /* =====================================================
         OPENING FLAP
         ===================================================== */

      .dr-correspondence-flap {
        position: absolute;

        z-index: 5;

        left: 0;
        top: 0;

        width: 100%;
        height: 58%;

        transform-origin: top center;

        transform:
          rotateX(
            calc(
              var(--dr-flap-progress,0) * -179deg
            )
          );

        transform-style: preserve-3d;
        backface-visibility: visible;

        will-change: transform;

        pointer-events: none;
      }

      .dr-correspondence-flap svg {
        display: block;

        width: 100%;
        height: 100%;

        overflow: visible;

        filter:
          drop-shadow(
            0 3px 2px rgba(91,68,47,.07)
          );
      }

      /* =====================================================
         CHAMPAGNE WAX SEAL
         ===================================================== */

      .dr-correspondence-seal {
        position: absolute;

        z-index: 7;

        left: 50%;
        top: 49%;

        width: clamp(60px,16vw,76px);
        aspect-ratio: 1;

        transform:
          translate(-50%,-50%)
          scale(
            calc(
              1 - var(--dr-flap-progress,0) * .16
            )
          );

        opacity: var(--dr-seal-opacity,1);

        border: 0;
        border-radius: 50%;

        padding: 0;

        background:
          radial-gradient(
            circle at 32% 24%,
            #f2dfc5 0%,
            #ddc3a4 42%,
            #b99679 82%,
            #aa856b 100%
          );

        box-shadow:
          inset 1px 2px 3px rgba(255,255,255,.9),
          inset -3px -4px 6px rgba(94,65,42,.23),
          0 4px 8px rgba(78,53,34,.2),
          0 0 0 1px rgba(119,90,67,.18);

        cursor: pointer;

        display: grid;
        place-items: center;

        overflow: hidden;
      }

      .dr-correspondence-seal::before {
        content: "";

        position: absolute;

        inset: 9%;

        border:
          1px solid rgba(255,252,243,.54);

        border-radius: 50%;

        box-shadow:
          inset 0 1px 3px rgba(112,79,54,.12);
      }

      /* =====================================================
         MONOGRAM — REFINED SCALE
         ===================================================== */

      .dr-correspondence-seal img {
        position: relative;

        width: 52%;
        height: 52%;

        object-fit: contain;

        transform:
          translate(-4%,-5%);

        filter:
          sepia(.4)
          saturate(.55)
          brightness(.72);

        opacity: .88;

        pointer-events: none;
      }

      /* =====================================================
         OPENING INSTRUCTION
         ===================================================== */

      .dr-correspondence-prompt {
        position: relative;

        z-index: 8;

        margin-top:
          clamp(34px,6svh,65px);

        font:
          500
          clamp(9px,2.3vw,11px)/1.5
          "DR Avenir Next",
          "Avenir Next",
          Arial,
          sans-serif;

        letter-spacing: .16em;

        text-align: center;

        color: #84776d;

        opacity: var(--dr-prompt-opacity,1);

        white-space: nowrap;

        pointer-events: none;
      }

      /* =====================================================
         FLOATING ARROW
         ===================================================== */

      .dr-correspondence-arrow {
        display: block;

        margin: 0 auto 12px;

        width: 18px;
        height: 25px;

        animation:
          drCorrespondenceFloat
          2.5s
          ease-in-out
          infinite;
      }

      .dr-correspondence-arrow svg {
        display: block;

        width: 100%;
        height: 100%;

        fill: none;

        stroke: #95857b;
        stroke-width: 1.6;

        stroke-linecap: round;
        stroke-linejoin: round;
      }

      @keyframes drCorrespondenceFloat {

        0%,100% {
          transform: translateY(-3px);
        }

        50% {
          transform: translateY(4px);
        }

      }

      /* =====================================================
         SUBTLE AMBIENT LIGHT
         ===================================================== */

      #dr-correspondence-threshold
      .dr-correspondence-glow {
        position: absolute;

        z-index: 1;

        pointer-events: none;

        left: 50%;
        top: 50%;

        width: 85%;
        height: 70%;

        transform: translate(-50%,-50%);

        background:
          radial-gradient(
            ellipse,
            rgba(255,251,244,.48),
            transparent 72%
          );

        opacity:
          calc(
            .25 + var(--dr-progress) * .45
          );
      }

      /* =====================================================
         MOBILE LETTER VISIBILITY
         ===================================================== */

      body.dr-correspondence-enabled .paper {
        animation: none !important;

        transition:
          opacity .75s cubic-bezier(.22,.61,.36,1),
          box-shadow .75s ease !important;

        opacity: 1 !important;
      }

      body.dr-correspondence-enabled .paper-content {
        animation: none !important;
        opacity: 1 !important;
      }

      #dr-correspondence-threshold:focus-visible {
        outline: 2px solid #9d8873;
        outline-offset: -4px;
      }

      @media (prefers-reduced-motion:reduce) {

        .dr-correspondence-arrow {
          animation: none !important;
        }

      }

    }

  `;

  document.head.appendChild(style);

  /* =========================================================
     ENVELOPE MARKUP
     ========================================================= */

  const threshold = document.createElement("div");

  threshold.id = "dr-correspondence-threshold";

  threshold.setAttribute(
    "aria-label",
    "Open A Personal Message by scrolling or tapping the seal"
  );

  threshold.innerHTML = `

    <div id="dr-correspondence-stage">

      <div class="dr-correspondence-group">

        <div
          class="dr-correspondence-glow"
          aria-hidden="true"
        ></div>

        <div class="dr-correspondence-envelope">

          <div class="dr-correspondence-back"></div>

          <div class="dr-correspondence-inside"></div>

          <div
            class="dr-correspondence-flap"
            aria-hidden="true"
          >

            <svg
              viewBox="0 0 400 164"
              preserveAspectRatio="none"
            >

              <defs>

                <linearGradient
                  id="dr-flap-gradient"
                  x1="0"
                  y1="0"
                  x2=".65"
                  y2="1"
                >

                  <stop stop-color="#fbf9f5"/>

                  <stop
                    offset=".65"
                    stop-color="#eee8e1"
                  />

                  <stop
                    offset="1"
                    stop-color="#dfd4c8"
                  />

                </linearGradient>

              </defs>

              <path
                d="M0 0H400L200 163Z"
                fill="url(#dr-flap-gradient)"
                stroke="#c8b8a8"
                stroke-width="1"
              />

            </svg>

          </div>

          <svg
            class="dr-correspondence-front"
            viewBox="0 0 400 280"
            preserveAspectRatio="none"
            aria-hidden="true"
          >

            <defs>

              <linearGradient
                id="dr-left-fold"
                x1="0"
                y1="0"
                x2="1"
                y2="1"
              >

                <stop stop-color="#faf8f4"/>

                <stop
                  offset="1"
                  stop-color="#e6ddd4"
                />

              </linearGradient>

              <linearGradient
                id="dr-right-fold"
                x1="1"
                y1="0"
                x2="0"
                y2="1"
              >

                <stop stop-color="#f6f2ed"/>

                <stop
                  offset="1"
                  stop-color="#e5dcd2"
                />

              </linearGradient>

              <linearGradient
                id="dr-bottom-fold"
                x1="0"
                y1="0"
                x2=".6"
                y2="1"
              >

                <stop stop-color="#f7f3ee"/>

                <stop
                  offset="1"
                  stop-color="#eae2d9"
                />

              </linearGradient>

            </defs>

            <path
              d="M0 0L204 144L0 280Z"
              fill="url(#dr-left-fold)"
              stroke="#d3c4b7"
              stroke-width=".8"
            />

            <path
              d="M400 0L196 144L400 280Z"
              fill="url(#dr-right-fold)"
              stroke="#d3c4b7"
              stroke-width=".8"
            />

            <path
              d="M0 280L200 138L400 280Z"
              fill="url(#dr-bottom-fold)"
              stroke="#cdbfb1"
              stroke-width=".9"
            />

          </svg>

          <button
            class="dr-correspondence-seal"
            type="button"
            aria-label="Open the letter"
          >

            <img
              src="/dr-reveals-removebg-preview.png"
              alt=""
            >

          </button>

        </div>

        <div class="dr-correspondence-prompt">

          <span
            class="dr-correspondence-arrow"
            aria-hidden="true"
          >

            <svg viewBox="0 0 24 32">

              <path
                d="M12 29V4M5 11l7-7 7 7"
              />

            </svg>

          </span>

          TOUCH THE SEAL · OR SCROLL TO OPEN

        </div>

      </div>

    </div>

  `;

  /* =========================================================
     INSERT BEFORE EXISTING LETTER
     ========================================================= */

  letterWrap.before(threshold);

  document.body.classList.add(
    "dr-correspondence-enabled"
  );

  /* =========================================================
     SCROLL PROGRESS
     ========================================================= */

  let ticking = false;

  const clamp = value =>
    Math.min(1,Math.max(0,value));

  function update() {

    ticking = false;

    const max = Math.max(
      1,
      threshold.offsetHeight - window.innerHeight
    );

    const progress = clamp(
      -threshold.getBoundingClientRect().top / max
    );

    threshold.style.setProperty(
      "--dr-progress",
      progress.toFixed(4)
    );

    /* Envelope opening */

    const flap = clamp(
      (progress - .04) / .64
    );

    /* Envelope disappearance */

    const finish = clamp(
      (progress - .79) / .21
    );

    threshold.style.setProperty(
      "--dr-flap-progress",
      flap.toFixed(4)
    );

    threshold.style.setProperty(
      "--dr-envelope-opacity",
      (1 - finish).toFixed(4)
    );

    threshold.style.setProperty(
      "--dr-seal-opacity",
      (
        1 - clamp(
          (progress - .02) / .24
        )
      ).toFixed(4)
    );

    threshold.style.setProperty(
      "--dr-prompt-opacity",
      (
        1 - clamp(
          progress / .24
        )
      ).toFixed(4)
    );

    threshold.style.pointerEvents =
      progress > .96 ? "none" : "";

  }

  function tick() {

    if (!ticking) {

      ticking = true;

      requestAnimationFrame(update);

    }

  }

  window.addEventListener(
    "scroll",
    tick,
    { passive:true }
  );

  window.addEventListener(
    "resize",
    tick,
    { passive:true }
  );

  /* =========================================================
     TOUCH SEAL TO OPEN
     ========================================================= */

  const open = () => {

    const destination =
      window.scrollY +
      letterWrap.getBoundingClientRect().top;

    window.scrollTo({

      top: destination,

      behavior:
        window.matchMedia(
          "(prefers-reduced-motion:reduce)"
        ).matches
          ? "instant"
          : "smooth"

    });

  };

  threshold
    .querySelector(".dr-correspondence-seal")
    .addEventListener("click",open);

  /* =========================================================
     INITIALIZE
     ========================================================= */

  update();

})();
