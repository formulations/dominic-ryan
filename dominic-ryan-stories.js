/* =========================================================
   DOMINIC RYAN — INSTAGRAM STORY EXPERIENCE
   SociableKIT Instagram Story Highlights
   October 2026
   ========================================================= */

(() => {
  "use strict";

  const CONFIG = {
    widget: ".sk-ww-instagram-story-highlights",
    viewer: ".sk-story-viewer-layout",
    slide: ".sk-carousel-track > .sk-carousel-item",
    activeProgress: ".sk-story-progress-seg.is-active",
    next: ".sk-carousel-next",
    close: ".sk-story-close",

    imageDuration: 5000,
    navigationDelay: 220
  };

  let widget = null;
  let observer = null;

  let activeMedia = null;
  let activeIndex = -1;

  let imageTimer = null;
  let playbackGeneration = 0;

  let syncQueued = false;
  let pendingAdvance = false;
  let viewerWasOpen = false;
  let switchingHighlight = false;

  /* =====================================================
     VIEWER HELPERS
     ===================================================== */

  function getViewer() {
    return widget?.querySelector(CONFIG.viewer) || null;
  }

  function isViewerVisible(viewer = getViewer()) {
    if (!viewer || !viewer.isConnected) return false;

    const style = getComputedStyle(viewer);

    if (
      style.display === "none" ||
      style.visibility === "hidden"
    ) {
      return false;
    }

    return viewer.getClientRects().length > 0;
  }

  function getSlides() {
    const viewer = getViewer();

    return viewer
      ? [...viewer.querySelectorAll(CONFIG.slide)]
      : [];
  }

  function getActiveIndex() {
    const viewer = getViewer();

    const active = viewer?.querySelector(
      CONFIG.activeProgress
    );

    if (!active) return -1;

    const index = Number(active.dataset.index);

    return Number.isInteger(index) ? index : -1;
  }

  function clearImageTimer() {
    if (imageTimer !== null) {
      clearTimeout(imageTimer);
      imageTimer = null;
    }
  }

  /* =====================================================
     AUDIO MANAGEMENT
     ===================================================== */

  function stopAllVideos(except = null) {
    if (!widget) return;

    widget.querySelectorAll("video").forEach(video => {
      if (video === except) return;

      video.pause();
      video.muted = true;
      video.autoplay = false;
    });
  }

  function invalidatePlayback() {
    clearImageTimer();

    playbackGeneration++;

    stopAllVideos();

    activeMedia = null;
    activeIndex = -1;

    pendingAdvance = false;
  }

  /* =====================================================
     VIDEO LOOP PREVENTION
     ===================================================== */

  function disableLooping() {
    widget?.querySelectorAll("video").forEach(video => {
      video.loop = false;
      video.removeAttribute("loop");
      video.playsInline = true;
    });
  }

  /* =====================================================
     CLOSE VIEWER
     ===================================================== */

  function closeViewer() {
    invalidatePlayback();

    const viewer = getViewer();

    const closeButton = viewer?.querySelector(
      CONFIG.close
    );

    if (closeButton) {
      closeButton.click();
    }

    viewerWasOpen = false;

    requestAnimationFrame(stopAllVideos);

    setTimeout(() => {
      stopAllVideos();
      scheduleSync();
    }, 150);
  }

  /* =====================================================
     STORY ADVANCEMENT
     ===================================================== */

  function advanceStory() {
    if (pendingAdvance || switchingHighlight) return;

    const viewer = getViewer();

    if (!isViewerVisible(viewer)) return;

    const index = getActiveIndex();
    const slides = getSlides();

    if (
      index < 0 ||
      !slides.length ||
      index >= slides.length
    ) {
      return;
    }

    if (index === slides.length - 1) {
      closeViewer();
      return;
    }

    const nextButton = viewer.querySelector(
      CONFIG.next
    );

    if (!nextButton) return;

    pendingAdvance = true;

    invalidatePlayback();

    pendingAdvance = true;

    nextButton.click();

    setTimeout(() => {
      pendingAdvance = false;
      scheduleSync();
    }, CONFIG.navigationDelay);
  }

  /* =====================================================
     VIDEO PLAYBACK
     ===================================================== */

  async function playVideo(video, generation) {
    if (!video) return;

    stopAllVideos(video);

    video.loop = false;
    video.removeAttribute("loop");

    video.playsInline = true;
    video.autoplay = true;

    video.volume = 1;
    video.muted = false;

    try {
      await video.play();
    } catch (_) {
      if (
        generation !== playbackGeneration ||
        video !== activeMedia
      ) {
        video.pause();
        video.muted = true;
        return;
      }

      video.muted = true;

      try {
        await video.play();
      } catch (_) {
        // User interaction may be required.
      }
    }

    if (
      generation !== playbackGeneration ||
      video !== activeMedia ||
      !isViewerVisible()
    ) {
      video.pause();
      video.muted = true;
    }
  }

  /* =====================================================
     ACTIVATE STORY
     ===================================================== */

  function activateStory() {
    const viewer = getViewer();

    if (!isViewerVisible(viewer)) return;

    disableLooping();

    const index = getActiveIndex();
    const slides = getSlides();

    const slide = slides[index];

    if (index < 0 || !slide) return;

    const media = slide.querySelector("video, img");

    if (!media) return;

    if (
      index === activeIndex &&
      media === activeMedia
    ) {
      return;
    }

    clearImageTimer();

    playbackGeneration++;

    const generation = playbackGeneration;

    activeIndex = index;
    activeMedia = media;

    stopAllVideos(
      media instanceof HTMLVideoElement
        ? media
        : null
    );

    if (media instanceof HTMLVideoElement) {
      try {
        media.currentTime = 0;
      } catch (_) {}

      playVideo(media, generation);
      return;
    }

    imageTimer = setTimeout(() => {
      if (generation !== playbackGeneration) return;

      advanceStory();
    }, CONFIG.imageDuration);
  }

  /* =====================================================
     VIDEO COMPLETION
     ===================================================== */

  document.addEventListener(
    "ended",
    event => {
      if (!(event.target instanceof HTMLVideoElement)) {
        return;
      }

      if (!widget?.contains(event.target)) return;
      if (event.target !== activeMedia) return;

      advanceStory();
    },
    true
  );

  /* =====================================================
     MINIATURE HIGHLIGHT DISCOVERY
     ===================================================== */

  function getHighlightCandidates() {
    if (!widget) return [];

    return [
      ...widget.querySelectorAll(
        ".sk-highlights-strip-viewport .sk-posts-story-item"
      )
    ]
      .map(item => {
        const image = item.querySelector(
          ".sk-story-thumb-wrap img"
        );

        if (!image) return null;

        const label =
          item.querySelector(
            ".sk-story-highlight-title"
          )?.textContent?.trim() ||
          "View Highlight";

        return {
          item,
          image,
          label
        };
      })
      .filter(Boolean);
  }

  function removeMiniNavigation() {
    widget
      ?.querySelectorAll(".dr-mini-highlights")
      .forEach(element => element.remove());
  }

  function buildMiniNavigation() {
    const viewer = getViewer();

    if (!viewer) return;

    removeMiniNavigation();

    const highlights = getHighlightCandidates();

    if (highlights.length < 2) return;

    const navigation = document.createElement("nav");

    navigation.className = "dr-mini-highlights";

    navigation.setAttribute(
      "aria-label",
      "Explore other Story Highlights"
    );

    highlights.forEach(highlight => {
      const button = document.createElement("button");

      button.type = "button";
      button.className = "dr-mini-highlight";

      button.setAttribute(
        "aria-label",
        highlight.label
      );

      const image = document.createElement("img");

      image.src =
        highlight.image.currentSrc ||
        highlight.image.src;

      image.alt = "";

      button.appendChild(image);

      button.addEventListener("click", event => {
        event.stopPropagation();

        switchingHighlight = true;

        const target = highlight.item;

        closeViewer();

        setTimeout(() => {
          if (document.contains(target)) {
            target.click();
          }

          viewerWasOpen = false;
          switchingHighlight = false;

          scheduleSync();
        }, 150);
      });

      navigation.appendChild(button);
    });

    const frame = viewer.querySelector(
      ".sk-story-frame"
    );

    frame?.appendChild(navigation);
  }
  /* =====================================================
     LIGHT WEBSITE BACKGROUND — CLICK TO CLOSE

     Independent of the existing warm-stone
     background click functionality.
     ===================================================== */

  let websiteBackdrop = null;

  function createWebsiteBackdrop() {
    if (websiteBackdrop) return;

    websiteBackdrop = document.createElement("div");

    websiteBackdrop.id = "dr-story-website-backdrop";

    websiteBackdrop.setAttribute("aria-hidden", "true");

    Object.assign(websiteBackdrop.style, {
      position: "fixed",
      inset: "0",
      width: "100vw",
      height: "100vh",
      background: "transparent",
      zIndex: "9998",
      display: "none",
      pointerEvents: "auto"
    });

    websiteBackdrop.addEventListener("pointerdown", event => {
      event.preventDefault();
      event.stopPropagation();

      closeViewer();
    });

    document.body.appendChild(websiteBackdrop);
  }

  function updateWebsiteBackdrop() {
    if (!websiteBackdrop) return;

    const viewer = getViewer();

    const isOpen = isViewerVisible(viewer);

    websiteBackdrop.style.display = isOpen
      ? "block"
      : "none";
  }
  /* =====================================================
     BACKGROUND CLICK TO CLOSE
     ===================================================== */

  document.addEventListener(
    "pointerdown",
    event => {
      const viewer = getViewer();

      if (!isViewerVisible(viewer)) return;

      const target = event.target;

      if (!(target instanceof Element)) return;

      if (!viewer.contains(target)) return;

      // Preserve navigation and controls.
if (
  target.closest(
    ".sk-story-nav-btn, " +
    ".sk-carousel-next, " +
    ".sk-carousel-prev, " +
    ".sk-story-close, " +
    ".dr-mini-highlights, " +
    ".sk-story-progress"
  )
) {
  return;
}

      // Preserve clicks within the actual media rectangle.
      const slide = getSlides()[getActiveIndex()];

      const media = slide?.querySelector(
        ".sk-story-slide-media video, " +
        ".sk-story-slide-media img"
      );

      if (media) {
        const rect = media.getBoundingClientRect();

        const insideMedia =
          event.clientX >= rect.left &&
          event.clientX <= rect.right &&
          event.clientY >= rect.top &&
          event.clientY <= rect.bottom;

        if (insideMedia) return;
      }

      closeViewer();
    },
    true
  );

  /* =====================================================
     NATIVE SOCIABLEKIT CONTROLS
     ===================================================== */

  document.addEventListener(
    "click",
    event => {
      const target = event.target;

      if (!(target instanceof Element)) return;
      if (!widget?.contains(target)) return;

      const control = target.closest(
        ".sk-story-nav-btn, .sk-story-close"
      );

      if (control) {
        invalidatePlayback();
      }

      setTimeout(scheduleSync, 60);
      setTimeout(scheduleSync, 220);
      setTimeout(scheduleSync, 450);
    },
    true
  );

  /* =====================================================
     VIEWER SYNCHRONIZATION
     ===================================================== */

  function syncViewer() {
    syncQueued = false;

    const viewer = getViewer();
         updateWebsiteBackdrop();

    if (!isViewerVisible(viewer) || document.hidden) {
      invalidatePlayback();

      viewerWasOpen = false;

      removeMiniNavigation();
      return;
    }

    disableLooping();

    if (!viewerWasOpen) {
      viewerWasOpen = true;
      buildMiniNavigation();
    }

    if (!switchingHighlight) {
      activateStory();
    }
  }

  function scheduleSync() {
    if (syncQueued) return;

    syncQueued = true;

    requestAnimationFrame(() => {
      requestAnimationFrame(syncViewer);
    });
  }

  /* =====================================================
     PAGE VISIBILITY
     ===================================================== */

  document.addEventListener(
    "visibilitychange",
    () => {
      if (document.hidden) {
        invalidatePlayback();
      } else {
        activeMedia = null;
        activeIndex = -1;

        scheduleSync();
      }
    }
  );

  window.addEventListener(
    "pagehide",
    invalidatePlayback
  );

  /* =====================================================
     INITIALIZATION
     ===================================================== */

  function initialize() {
    widget = document.querySelector(CONFIG.widget);

    if (!widget) {
      setTimeout(initialize, 400);
      return;
    }
    createWebsiteBackdrop();
    observer = new MutationObserver(scheduleSync);

    observer.observe(widget, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: [
        "class",
        "style"
      ]
    });

    scheduleSync();
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initialize
    );
  } else {
    initialize();
  }

})();
