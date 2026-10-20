/* =========================================================
   DOMINIC RYAN — INSTAGRAM STORY EXPERIENCE
   SociableKIT Instagram Story Highlights

   FEATURES
   - Automatic video playback
   - Audio enabled when browser permits
   - Sequential playback within each Highlight
   - Automatic progression through images
   - Automatic closing after the final Story
   - No video looping
   - No overlapping audio
   - Native previous/next arrow support
   - Miniature Highlight collection navigation
   - Direct switching between Highlights
   - Click surrounding viewer background to close
   - Playback stops when leaving the page
   ========================================================= */

(() => {
  "use strict";

  const CONFIG = {
    widget: ".sk-ww-instagram-story-highlights",
    viewer: ".sk-story-viewer-layout",
    slide: ".sk-carousel-item",
    progress: ".sk-story-progress-seg",
    activeProgress: ".sk-story-progress-seg.is-active",
    next: ".sk-carousel-next",
    close: ".sk-story-close",

    imageDuration: 5000,
    navigationDelay: 180,
    thumbnailSize: 34
  };

  let widget = null;
  let activeMedia = null;
  let activeIndex = -1;
  let imageTimer = null;
  let playbackGeneration = 0;
  let pendingAdvance = false;
  let observer = null;
  let syncQueued = false;
  let viewerWasOpen = false;
  let switchingHighlight = false;

  /* =====================================================
     HELPERS
     ===================================================== */

  function getWidget() {
    return document.querySelector(CONFIG.widget);
  }

  function getViewer() {
    return widget?.querySelector(CONFIG.viewer) || null;
  }

  function isViewerVisible(viewer = getViewer()) {
    if (!viewer || !viewer.isConnected) return false;

    const style = window.getComputedStyle(viewer);

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
      ? [
          ...viewer.querySelectorAll(
            ".sk-carousel-track > .sk-carousel-item"
          )
        ]
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

  function getActiveSlide() {
    const index = getActiveIndex();

    return getSlides()[index] || null;
  }

  function clearImageTimer() {
    if (imageTimer !== null) {
      clearTimeout(imageTimer);
      imageTimer = null;
    }
  }

  /* =====================================================
     AUDIO AND VIDEO CLEANUP
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
    pendingAdvance = false;

    stopAllVideos();

    activeMedia = null;
    activeIndex = -1;
  }

  /* =====================================================
     DISABLE VIDEO LOOPING
     ===================================================== */

  function disableLooping() {
    widget?.querySelectorAll(
      ".sk-story-slide-media video"
    ).forEach(video => {
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

    // Catch playback restarted during SociableKIT cleanup.
    requestAnimationFrame(() => {
      stopAllVideos();
    });

    setTimeout(() => {
      stopAllVideos();
      scheduleSync();
    }, 150);
  }

  /* =====================================================
     ADVANCE STORY
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

    pendingAdvance = true;

    clearImageTimer();

    if (index >= slides.length - 1) {
      closeViewer();
      return;
    }

    const nextButton = viewer.querySelector(
      CONFIG.next
    );

    if (!nextButton) {
      pendingAdvance = false;
      return;
    }

    invalidatePlayback();

    pendingAdvance = true;

    nextButton.click();

    setTimeout(() => {
      pendingAdvance = false;
      scheduleSync();
    }, CONFIG.navigationDelay);
  }

  /* =====================================================
     PLAY VIDEO
     ===================================================== */

  async function playVideo(video, generation) {
    if (!video) return;

    stopAllVideos(video);

    video.loop = false;
    video.removeAttribute("loop");

    video.autoplay = true;
    video.playsInline = true;
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
        // Browser requires user interaction.
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
     ACTIVATE CURRENT STORY
     ===================================================== */

  function activateStory() {
    const viewer = getViewer();

    if (!isViewerVisible(viewer)) return;

    disableLooping();

    const index = getActiveIndex();
    const slide = getActiveSlide();

    if (index < 0 || !slide) return;

    const media = slide.querySelector(
      "video, img"
    );

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
      media.tagName === "VIDEO" ? media : null
    );

    if (media.tagName === "VIDEO") {
      try {
        media.currentTime = 0;
      } catch (_) {
        // Media may not be ready yet.
      }

      playVideo(media, generation);
      return;
    }

    if (media.tagName === "IMG") {
      imageTimer = setTimeout(() => {
        if (generation !== playbackGeneration) return;

        advanceStory();
      }, CONFIG.imageDuration);
    }
  }

  /* =====================================================
     VIDEO ENDED
     ===================================================== */

  document.addEventListener(
    "ended",
    event => {
      const video = event.target;

      if (!(video instanceof HTMLVideoElement)) {
        return;
      }

      if (!widget?.contains(video)) return;
      if (video !== activeMedia) return;

      advanceStory();
    },
    true
  );

  /* =====================================================
     SYNCHRONIZE VIEWER
     ===================================================== */

  function syncViewer() {
    syncQueued = false;

    const viewer = getViewer();

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

    updateMiniNavigation();
  }

  function scheduleSync() {
    if (syncQueued) return;

    syncQueued = true;

    requestAnimationFrame(() => {
      requestAnimationFrame(syncViewer);
    });
  }

  /* =====================================================
     MINIATURE HIGHLIGHT NAVIGATION
     ===================================================== */

  function getHighlightCandidates() {
    if (!widget) return [];

    const viewer = getViewer();

    const images = [
      ...widget.querySelectorAll("img")
    ].filter(img => {
      if (viewer?.contains(img)) return false;

      if (img.closest(".dr-mini-highlights")) {
        return false;
      }

      return Boolean(
        img.closest("button, a, [role='button']")
      );
    });

    const unique = new Set();

    return images
      .map(img => {
        const button = img.closest(
          "button, a, [role='button']"
        );

        if (!button || unique.has(button)) {
          return null;
        }

        unique.add(button);

        return {
          button,
          image: img,
          label:
            button.getAttribute("aria-label") ||
            img.getAttribute("alt") ||
            button.textContent.trim() ||
            "View Highlight"
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

    highlights.forEach((highlight, index) => {
      const button = document.createElement("button");

      button.type = "button";
      button.className = "dr-mini-highlight";

      button.setAttribute(
        "aria-label",
        highlight.label
      );

      button.dataset.highlightIndex = index;

      const image = document.createElement("img");

      image.src =
        highlight.image.currentSrc ||
        highlight.image.src;

      image.alt = "";

      button.appendChild(image);

      button.addEventListener("click", event => {
        event.stopPropagation();

        switchingHighlight = true;

        invalidatePlayback();

        const target = highlight.button;

        closeViewer();

        setTimeout(() => {
          if (document.contains(target)) {
            target.click();
          }

          viewerWasOpen = false;
          switchingHighlight = false;

          scheduleSync();
        }, 120);
      });

      navigation.appendChild(button);
    });

    const frame = viewer.querySelector(
      ".sk-story-frame"
    );

    if (frame) {
      frame.appendChild(navigation);
    }
  }

  function updateMiniNavigation() {
    const navigation = widget?.querySelector(
      ".dr-mini-highlights"
    );

    if (!navigation) return;

    navigation.querySelectorAll(
      ".dr-mini-highlight"
    ).forEach(button => {
      button.setAttribute(
        "aria-pressed",
        "false"
      );
    });
  }

  /* =====================================================
     CLICK SURROUNDING VIEWER BACKGROUND TO CLOSE
     ===================================================== */

  document.addEventListener(
    "pointerdown",
    event => {
      const viewer = getViewer();

      if (!isViewerVisible(viewer)) return;

      const target = event.target;

      if (!(target instanceof Element)) return;

      // Only handle clicks inside the Story viewer.
      if (!viewer.contains(target)) return;

      // Preserve actual Story media.
      if (
        target.closest(
          ".sk-story-slide-media video, " +
          ".sk-story-slide-media img"
        )
      ) {
        return;
      }

      // Preserve native navigation and close controls.
      if (
        target.closest(
          ".sk-story-nav-btn, " +
          ".sk-story-close, " +
          ".dr-mini-highlights"
        )
      ) {
        return;
      }

      // Preserve progress bar interactions.
      if (
        target.closest(".sk-story-progress")
      ) {
        return;
      }

      // Everything else inside the viewer is dismissible.
      closeViewer();
    },
    true
  );

  /* =====================================================
     SOCIABLEKIT INTERACTIONS
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

  window.addEventListener("pagehide", () => {
    invalidatePlayback();
  });

  /* =====================================================
     INITIALIZE
     ===================================================== */

  function initialize() {
    widget = getWidget();

    if (!widget) {
      setTimeout(initialize, 400);
      return;
    }

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
