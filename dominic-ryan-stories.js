/* =========================================================
   DOMINIC RYAN — INSTAGRAM STORY EXPERIENCE
   SociableKIT Instagram Story Highlights

   CONSOLIDATED EDITION / OCTOBER 2026

   Features:
   - Automatic Story progression
   - Five-second image duration
   - Video playback with audio when permitted
   - No video looping
   - Automatic closure after final Story
   - Miniature Highlight navigation
   - Immediate audio cleanup
   - Warm-stone background click-to-close
   - Lighter website background click-to-close
   - Native carousel navigation preserved
   - Responsive desktop and mobile support
   ========================================================= */

(() => {
  "use strict";

  /* =====================================================
     01 / CONFIGURATION
     ===================================================== */

  const CONFIG = {
    widget:
      '.sk-ww-instagram-story-highlights[data-embed-id="25723348"]',

    viewer: ".sk-story-viewer-layout",

    slide: ".sk-carousel-track > .sk-carousel-item",

    activeProgress: ".sk-story-progress-seg.is-active",

    next: ".sk-carousel-next",

    close: ".sk-story-close",

    imageDuration: 5000,

    navigationDelay: 220,

    highlightSwitchDelay: 150
  };

  /* =====================================================
     02 / STATE
     ===================================================== */

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

  let closingViewer = false;

  /* =====================================================
     03 / VIEWER HELPERS
     ===================================================== */

  function getViewer() {
    return widget?.querySelector(CONFIG.viewer) || null;
  }

function isViewerVisible(viewer = getViewer()) {
  if (!viewer || !viewer.isConnected) {
    return false;
  }

  const style = window.getComputedStyle(viewer);

  if (
    style.display === "none" ||
    style.visibility === "hidden"
  ) {
    return false;
  }

  return viewer.getClientRects().length > 0;
}

    const style = window.getComputedStyle(viewer);

    if (
      style.display === "none" ||
      style.visibility === "hidden"
    ) {
      return false;
    }

    if (viewer.getClientRects().length === 0) {
      return false;
    }

    /*
     Check whether an ancestor is hiding the viewer.
     */

    let ancestor = viewer.parentElement;

    while (ancestor && ancestor !== document.body) {
      const ancestorStyle =
        window.getComputedStyle(ancestor);

      if (
        ancestorStyle.display === "none" ||
        ancestorStyle.visibility === "hidden"
      ) {
        return false;
      }

      ancestor = ancestor.parentElement;
    }

    return true;
  }

  function getSlides() {
    const viewer = getViewer();

    if (!viewer) {
      return [];
    }

    return [
      ...viewer.querySelectorAll(CONFIG.slide)
    ];
  }

  function getActiveIndex() {
    const viewer = getViewer();

    if (!viewer) {
      return -1;
    }

    const active = viewer.querySelector(
      CONFIG.activeProgress
    );

    if (!active) {
      return -1;
    }

    const index = Number(active.dataset.index);

    return Number.isInteger(index)
      ? index
      : -1;
  }

  function clearImageTimer() {
    if (imageTimer !== null) {
      clearTimeout(imageTimer);

      imageTimer = null;
    }
  }

  /* =====================================================
     04 / AUDIO MANAGEMENT
     ===================================================== */

  function stopAllVideos(except = null) {
    if (!widget) {
      return;
    }

    widget.querySelectorAll("video").forEach(video => {
      if (video === except) {
        return;
      }

      try {
        video.pause();

        video.muted = true;

        video.autoplay = false;
      } catch (_) {
        // Ignore unavailable media states.
      }
    });
  }

  function invalidatePlayback() {
    clearImageTimer();

    playbackGeneration++;

    stopAllVideos();

    activeMedia = null;
    activeIndex = -1;
  }

  /* =====================================================
     05 / PREVENT VIDEO LOOPING
     ===================================================== */

  function disableLooping() {
    if (!widget) {
      return;
    }

    widget.querySelectorAll("video").forEach(video => {
      video.loop = false;

      video.removeAttribute("loop");

      video.playsInline = true;
    });
  }

  /* =====================================================
     06 / CLOSE STORY VIEWER
     ===================================================== */

  function closeViewer() {
    if (closingViewer) {
      return;
    }

    const viewer = getViewer();

    if (!viewer || !isViewerVisible(viewer)) {
      stopAllVideos();
      return;
    }

    closingViewer = true;

    invalidatePlayback();

    pendingAdvance = false;

    const closeButton = viewer.querySelector(
      CONFIG.close
    );

    if (closeButton) {
      closeButton.click();
    }

    viewerWasOpen = false;

    requestAnimationFrame(() => {
      stopAllVideos();
    });

    setTimeout(() => {
      stopAllVideos();

      closingViewer = false;

      scheduleSync();
    }, 180);
  }

  /* =====================================================
     07 / ADVANCE STORY
     ===================================================== */

  function advanceStory() {
    if (
      pendingAdvance ||
      switchingHighlight ||
      closingViewer
    ) {
      return;
    }

    const viewer = getViewer();

if (!viewer || !viewer.isConnected) {

  return;

}

    const index = getActiveIndex();

    const slides = getSlides();

    if (
      index < 0 ||
      slides.length === 0 ||
      index >= slides.length
    ) {
      return;
    }

    /*
     Close after the final Story.
     Do not intentionally advance into another Highlight.
     */

    if (index === slides.length - 1) {
      closeViewer();
      return;
    }

    const nextButton = viewer.querySelector(
      CONFIG.next
    );

    if (!nextButton) {
      return;
    }

    pendingAdvance = true;

    invalidatePlayback();

    nextButton.click();

    setTimeout(() => {
      pendingAdvance = false;

      scheduleSync();
    }, CONFIG.navigationDelay);
  }

  /* =====================================================
     08 / VIDEO PLAYBACK
     ===================================================== */

  async function playVideo(video, generation) {
    if (!video) {
      return;
    }

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
      /*
       Browsers may prohibit unmuted autoplay.
       Fall back to muted playback.
       */

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
        // Playback may require user interaction.
      }
    }

    /*
     Stop playback if navigation occurred while
     the asynchronous play request was pending.
     */

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
     09 / ACTIVATE CURRENT STORY
     ===================================================== */

  function activateStory() {
    if (
      pendingAdvance ||
      switchingHighlight ||
      closingViewer
    ) {
      return;
    }

    const viewer = getViewer();

    if (!isViewerVisible(viewer)) {
      return;
    }

    disableLooping();

    const index = getActiveIndex();

    const slides = getSlides();

    const slide = slides[index];

    if (index < 0 || !slide) {
      return;
    }

    const media = slide.querySelector(
      ".sk-story-slide-media video, " +
      ".sk-story-slide-media img"
    );

    if (!media) {
      return;
    }

    /*
     Avoid restarting the same Story.
     */

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

    const isVideo =
      media instanceof HTMLVideoElement;

    stopAllVideos(isVideo ? media : null);

    if (isVideo) {
      try {
        media.currentTime = 0;
      } catch (_) {
        // Metadata may not yet be available.
      }

      playVideo(media, generation);

      return;
    }

    /*
     Images remain visible for five seconds.
     */

    imageTimer = setTimeout(() => {
      if (
        generation !== playbackGeneration ||
        closingViewer
      ) {
        return;
      }

      advanceStory();
    }, CONFIG.imageDuration);
  }

  /* =====================================================
     10 / VIDEO COMPLETION
     ===================================================== */

  document.addEventListener(
    "ended",
    event => {
      const video = event.target;

      if (!(video instanceof HTMLVideoElement)) {
        return;
      }

      if (!widget?.contains(video)) {
        return;
      }

      if (video !== activeMedia) {
        return;
      }

      advanceStory();
    },
    true
  );

  /* =====================================================
     11 / DISCOVER ORIGINAL HIGHLIGHTS
     ===================================================== */

  function getHighlightCandidates() {
    if (!widget) {
      return [];
    }

    const items = widget.querySelectorAll(
      ".sk-highlights-strip-viewport " +
      ".sk-posts-story-item"
    );

    return [...items]
      .map(item => {
        const image = item.querySelector(
          ".sk-story-thumb-wrap img"
        );

        if (!image) {
          return null;
        }

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

  /* =====================================================
     12 / REMOVE MINIATURE NAVIGATION
     ===================================================== */

  function removeMiniNavigation() {
    widget
      ?.querySelectorAll(".dr-mini-highlights")
      .forEach(element => {
        element.remove();
      });
  }

  /* =====================================================
     13 / BUILD MINIATURE NAVIGATION
     ===================================================== */

  function buildMiniNavigation() {
    const viewer = getViewer();

    if (!viewer) {
      return;
    }

    removeMiniNavigation();

    const highlights = getHighlightCandidates();

    if (highlights.length < 2) {
      return;
    }

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

        if (switchingHighlight) {
          return;
        }

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
        }, CONFIG.highlightSwitchDelay);
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

  /* =====================================================
     14 / BACKGROUND CLICK TO CLOSE

     Handles:
     - Warm-stone SociableKIT background
     - Lighter website background
     - Empty viewer areas

     Preserves:
     - Story images and videos
     - Previous/next controls
     - Close button
     - Progress indicators
     - Miniature Highlight navigation
     ===================================================== */

  document.addEventListener(
    "pointerdown",
    event => {
      const viewer = getViewer();

      /*
       Only process background clicks while
       the Story viewer is open.
       */

      if (!isViewerVisible(viewer)) {
        return;
      }

      if (
        closingViewer ||
        switchingHighlight
      ) {
        return;
      }

      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      /*
       OUTSIDE VIEWER

       Includes the lighter background of
       the Formulations webpage.
       */

      if (!viewer.contains(target)) {
        /*
         Allow clicks on original Highlight
         thumbnails to open their own Stories.
         */

        if (
          target.closest(
            ".sk-highlights-strip-viewport " +
            ".sk-posts-story-item"
          )
        ) {
          invalidatePlayback();

          return;
        }

        closeViewer();

        return;
      }

      /*
       INSIDE VIEWER

       Preserve native controls and miniature
       Highlight navigation.
       */

      if (
        target.closest(
          ".sk-story-nav-btn, " +
          ".sk-story-close, " +
          ".dr-mini-highlights, " +
          ".sk-story-progress"
        )
      ) {
        return;
      }

      /*
       Preserve interactions within the actual
       Story image/video rectangle.
       */

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

        if (insideMedia) {
          return;
        }
      }

      /*
       All remaining clicks inside the viewer
       are treated as background clicks.
       */

      closeViewer();
    },
    true
  );

  /* =====================================================
     15 / NATIVE SOCIABLEKIT INTERACTIONS
     ===================================================== */

  document.addEventListener(
    "click",
    event => {
      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      if (!widget?.contains(target)) {
        return;
      }

      const control = target.closest(
        ".sk-story-nav-btn, .sk-story-close"
      );

      if (control) {
        invalidatePlayback();
      }

      /*
       Allow SociableKIT to update its carousel
       before synchronizing custom playback.
       */

      setTimeout(scheduleSync, 60);

      setTimeout(scheduleSync, 220);

      setTimeout(scheduleSync, 450);
    },
    true
  );

  /* =====================================================
     16 / VIEWER SYNCHRONIZATION
     ===================================================== */

  function syncViewer() {
    syncQueued = false;

    const viewer = getViewer();

    if (
      !isViewerVisible(viewer) ||
      document.hidden
    ) {
      invalidatePlayback();

      viewerWasOpen = false;

      removeMiniNavigation();

      return;
    }

    if (closingViewer) {
      return;
    }

    disableLooping();

    /*
     Build miniature Highlight navigation
     when the viewer first opens.
     */

    if (!viewerWasOpen) {
      viewerWasOpen = true;

      buildMiniNavigation();
    }

    if (!switchingHighlight) {
      activateStory();
    }
  }

  function scheduleSync() {
    if (syncQueued) {
      return;
    }

    syncQueued = true;

    requestAnimationFrame(() => {
      requestAnimationFrame(syncViewer);
    });
  }

  /* =====================================================
     17 / PAGE VISIBILITY

     Stop audio when the user leaves the page
     or switches browser tabs.
     ===================================================== */

  document.addEventListener(
    "visibilitychange",
    () => {
      if (document.hidden) {
        invalidatePlayback();

        return;
      }

      activeMedia = null;

      activeIndex = -1;

      scheduleSync();
    }
  );

  window.addEventListener(
    "pagehide",
    () => {
      invalidatePlayback();
    }
  );

  /* =====================================================
     18 / INITIALIZATION
     ===================================================== */

  function initialize() {
    widget = document.querySelector(
      CONFIG.widget
    );

    if (!widget) {
      setTimeout(initialize, 400);

      return;
    }

    observer = new MutationObserver(() => {
      scheduleSync();
    });

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
