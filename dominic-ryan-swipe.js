
/* =========================================================
   DOMINIC RYAN — MOBILE PAGE SWIPE NAVIGATION

   A Personal Message ↔ The Maison ↔ Explore the Collection

   Mobile only.
   Preserves existing pages, URLs, links and vertical scrolling.
   ========================================================= */

(() => {
  "use strict";

  if (window.matchMedia("(min-width: 761px)").matches) return;

  const pages = ["/", "/maison/", "/formulations/"];

  const normalize = path => {
    const cleaned = path.replace(/\/index\.html$/, "/");
    return cleaned.endsWith("/") ? cleaned : cleaned + "/";
  };

  const current = pages.indexOf(normalize(window.location.pathname));

  if (current === -1) return;

  const MIN_DISTANCE = 85;
  const MAX_VERTICAL_DRIFT = 65;

  let startX = 0;
  let startY = 0;
  let tracking = false;
  let navigating = false;

  const style = document.createElement("style");

  style.textContent = `
    @media (max-width: 760px) {
      body.dr-swipe-exit-left {
        animation: drSwipeExitLeft 280ms ease-in forwards;
      }

      body.dr-swipe-exit-right {
        animation: drSwipeExitRight 280ms ease-in forwards;
      }

      @keyframes drSwipeExitLeft {
        to {
          opacity: 0;
          transform: translateX(-24px);
        }
      }

      @keyframes drSwipeExitRight {
        to {
          opacity: 0;
          transform: translateX(24px);
        }
      }

      @media (prefers-reduced-motion: reduce) {
        body.dr-swipe-exit-left,
        body.dr-swipe-exit-right {
          animation: none;
        }
      }
    }
  `;

  document.head.appendChild(style);

  document.addEventListener("touchstart", event => {
    if (navigating || event.touches.length !== 1) return;

    const target = event.target;

    if (
      target.closest(
        "input, textarea, select, [contenteditable], " +
        "[role='slider'], .dr-contact-overlay"
      )
    ) {
      tracking = false;
      return;
    }

    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;
    tracking = true;
  }, { passive: true });

  document.addEventListener("touchend", event => {
    if (!tracking || navigating || !event.changedTouches.length) return;

    tracking = false;

    const deltaX = event.changedTouches[0].clientX - startX;
    const deltaY = event.changedTouches[0].clientY - startY;

    if (Math.abs(deltaX) < MIN_DISTANCE) return;
    if (Math.abs(deltaY) > MAX_VERTICAL_DRIFT) return;
    if (Math.abs(deltaX) < Math.abs(deltaY) * 1.5) return;

    const direction = deltaX < 0 ? 1 : -1;
    const next = current + direction;

    if (next < 0 || next >= pages.length) return;

    navigating = true;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion) {
      window.location.assign(pages[next]);
      return;
    }

    document.body.classList.add(
      direction === 1 ? "dr-swipe-exit-left" : "dr-swipe-exit-right"
    );

    window.setTimeout(() => {
      window.location.assign(pages[next]);
    }, 270);

  }, { passive: true });

  document.addEventListener("touchcancel", () => {
    tracking = false;
  }, { passive: true });

})();
