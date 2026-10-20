/* =========================================================
   DOMINIC RYAN — INSTAGRAM STORY AUDIO MANAGEMENT
   SociableKIT Story Highlights

   PURPOSE:
   - Enable sound on the active video when permitted
   - Prevent overlapping story audio
   - Stop inactive story videos
   - Stop playback when leaving the page
   ========================================================= */

(() => {
  "use strict";

  const WIDGET = ".sk-ww-instagram-story-highlights";
  const VIEWER = ".sk-story-viewer-layout";

  let activeVideo = null;
  let syncTimer = null;

  /* =========================================================
     FIND STORY VIDEOS
     ========================================================= */

  function getWidget() {
    return document.querySelector(WIDGET);
  }

  function getVideos() {
    const widget = getWidget();

    return widget
      ? [...widget.querySelectorAll("video")]
      : [];
  }

  /* =========================================================
     IDENTIFY THE ACTIVE STORY
     ========================================================= */

  function getActiveVideo() {
    const widget = getWidget();

    if (!widget) return null;

    const viewer = widget.querySelector(VIEWER);

    if (!viewer) return null;

    const videos = getVideos();

    const viewerRect = viewer.getBoundingClientRect();

    const viewerCenter =
      (viewerRect.left + viewerRect.right) / 2;

    let closestVideo = null;
    let closestDistance = Infinity;

    videos.forEach(video => {
      const rect = video.getBoundingClientRect();

      if (
        rect.width === 0 ||
        rect.height === 0
      ) {
        return;
      }

      const videoCenter =
        (rect.left + rect.right) / 2;

      const distance =
        Math.abs(videoCenter - viewerCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestVideo = video;
      }
    });

    return closestVideo;
  }

  /* =========================================================
     MANAGE PLAYBACK
     ========================================================= */

  function syncStoryAudio() {
    const videos = getVideos();
    const nextVideo = getActiveVideo();

    videos.forEach(video => {
      if (video !== nextVideo) {
        video.pause();
        video.muted = true;
      }
    });

    if (!nextVideo) {
      activeVideo = null;
      return;
    }

    if (nextVideo !== activeVideo) {
      activeVideo = nextVideo;

      nextVideo.muted = false;
      nextVideo.volume = 1;

      const attempt = nextVideo.play();

      if (
        attempt &&
        typeof attempt.catch === "function"
      ) {
        attempt.catch(() => {
          // Browser may restrict playback with sound.
        });
      }
    }
  }

  /* =========================================================
     SCHEDULE UPDATES
     ========================================================= */

  function scheduleSync() {
    clearTimeout(syncTimer);

    syncTimer = setTimeout(
      syncStoryAudio,
      100
    );
  }

  /* =========================================================
     OBSERVE STORY CHANGES
     ========================================================= */

  const observer = new MutationObserver(scheduleSync);

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: [
      "class",
      "style"
    ]
  });

  /* =========================================================
     STORY NAVIGATION
     ========================================================= */

  document.addEventListener("click", event => {
    if (
      event.target.closest(
        ".sk-story-nav-btn, .sk-story-close"
      )
    ) {
      scheduleSync();
    }
  });
  /* =========================================================
     CLOSE STORY WHEN CLICKING OUTSIDE
     ========================================================= */

  document.addEventListener("click", event => {

    const widget = getWidget();
    if (!widget) return;

    const viewer = widget.querySelector(VIEWER);
    if (!viewer) return;

    const story = viewer.querySelector(
      ".sk-story-main-column"
    );

    if (!story) return;

    // Keep clicks inside the story working normally.
    if (story.contains(event.target)) return;

    // Preserve previous/next navigation.
    if (event.target.closest(".sk-story-nav-btn")) {
      return;
    }

    // Only close when clicking the surrounding viewer.
    if (!viewer.contains(event.target)) return;

    const closeButton = viewer.querySelector(
      ".sk-story-close"
    );

    if (closeButton) {
      closeButton.click();
      scheduleSync();
    }

  });
  /* =========================================================
     PAGE VISIBILITY
     ========================================================= */

  document.addEventListener(
    "visibilitychange",
    () => {
      if (document.hidden) {
        getVideos().forEach(video => {
          video.pause();
        });
      } else {
        scheduleSync();
      }
    }
  );

  window.addEventListener("pagehide", () => {
    getVideos().forEach(video => {
      video.pause();
    });
  });

  /* =========================================================
     INITIALIZE
     ========================================================= */

  scheduleSync();

})();
