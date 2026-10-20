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
   - Click outside the Story to close
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

  /* =====================================================
     HELPERS
     ===================================================== */

  function getWidget() {
    return document.querySelector(CONFIG.widget);
  }

  function getViewer() {
    return widget?.querySelector(CONFIG.viewer) || null;
  }

  function getSlides() {
    const viewer = getViewer();

    return viewer
      ? [...viewer.querySelectorAll(
          ".sk-carousel-track > .sk-carousel-item"
        )]
      : [];
  }

  function getActiveIndex() {
    const viewer = getViewer();

    const active = viewer?.querySelector(
      CONFIG.activeProgress
    );

    if (!active) return -1;

    return Number(active.dataset.index);
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

  function stopAllVideos(except = null) {
    widget?.querySelectorAll("video").forEach(video => {
      if (video === except) return;

      video.pause();
      video.muted = true;
    });
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
    clearImageTimer();

    playbackGeneration++;
    pendingAdvance = false;

    stopAllVideos();

    activeMedia = null;
    activeIndex = -1;

    getViewer()
      ?.querySelector(CONFIG.close)
      ?.click();
  }

  /* =====================================================
     ADVANCE STORY
     ===================================================== */

  function advanceStory() {
    if (pendingAdvance) return;

    const viewer = getViewer();
    if (!viewer) return;

    const index = getActiveIndex();

    const slides = getSlides();

    if (index < 0 || !slides.length) return;

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
      if (generation !== playbackGeneration) return;

      video.muted = true;

      try {
        await video.play();
      } catch (_) {
        // Browser requires manual interaction.
      }
    }

    if (generation !== playbackGeneration) {
      video.pause();
    }
  }

  /* =====================================================
     ACTIVATE CURRENT STORY
     ===================================================== */

  function activateStory() {
    const viewer = getViewer();

    if (!viewer) return;

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
      media.currentTime = 0;
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

    if (!viewer || document.hidden) {
      clearImageTimer();
      stopAllVideos();

      activeMedia = null;
      activeIndex = -1;
      viewerWasOpen = false;

      removeMiniNavigation();
      return;
    }

    disableLooping();

    if (!viewerWasOpen) {
      viewerWasOpen = true;
      buildMiniNavigation();
    }

    activateStory();
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

      image.src = highlight.image.currentSrc ||
        highlight.image.src;

      image.alt = "";

      button.appendChild(image);

      button.addEventListener("click", event => {
        event.stopPropagation();

        clearImageTimer();
        stopAllVideos();

        playbackGeneration++;

        activeMedia = null;
        activeIndex = -1;

        const target = highlight.button;

        closeViewer();

        setTimeout(() => {
          if (document.contains(target)) {
            target.click();
          }

          viewerWasOpen = false;
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
     CLICK OUTSIDE STORY TO CLOSE
     ===================================================== */

  document.addEventListener("click", event => {
    const viewer = getViewer();

    if (!viewer) return;

    if (
      event.target.closest(
        ".dr-mini-highlights"
      )
    ) {
      return;
    }

    if (
      event.target.closest(
        ".sk-story-nav-btn"
      )
    ) {
      return;
    }

    const mainColumn = viewer.querySelector(
      ".sk-story-main-column"
    );

    if (
      mainColumn &&
      !mainColumn.contains(event.target) &&
      viewer.contains(event.target)
    ) {
      closeViewer();
    }
  });

  /* =====================================================
     SOCIABLEKIT INTERACTIONS
     ===================================================== */

  document.addEventListener("click", event => {
    if (!widget?.contains(event.target)) return;

    setTimeout(scheduleSync, 60);
    setTimeout(scheduleSync, 220);
    setTimeout(scheduleSync, 450);
  });

  /* =====================================================
     PAGE VISIBILITY
     ===================================================== */

  document.addEventListener(
    "visibilitychange",
    () => {
      if (document.hidden) {
        clearImageTimer();
        stopAllVideos();
      } else {
        activeMedia = null;
        activeIndex = -1;
        scheduleSync();
      }
    }
  );

  window.addEventListener("pagehide", () => {
    clearImageTimer();
    stopAllVideos();
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
