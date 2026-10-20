/* =========================================================
   DOMINIC RYAN — INSTAGRAM STORY PLAYBACK MANAGEMENT

   SociableKIT Instagram Story Highlights

   FEATURES:
   - Automatically plays opened stories
   - Attempts playback with sound
   - Falls back to muted autoplay when necessary
   - Stops previous videos when changing stories
   - Stops playback when closing the viewer
   - Pauses playback when leaving the page
   - Supports dynamically loaded stories
   ========================================================= */

(() => {
  "use strict";

  /* =====================================================
     CONFIGURATION
     ===================================================== */

  const WIDGET = ".sk-ww-instagram-story-highlights";

  const VIEWER = ".sk-story-viewer-layout";

  const SLIDE = ".sk-carousel-item";

  const VIDEO = ".sk-story-slide-media video";

  const TRACK = ".sk-carousel-track";

  let activeVideo = null;

  let syncScheduled = false;

  let syncTimer = null;

  /* =====================================================
     ELEMENT HELPERS
     ===================================================== */

  function getWidget() {
    return document.querySelector(WIDGET);
  }

  function getViewer() {
    const widget = getWidget();

    return widget
      ? widget.querySelector(VIEWER)
      : null;
  }

  function getVideos() {
    const widget = getWidget();

    return widget
      ? [...widget.querySelectorAll(VIDEO)]
      : [];
  }

  /* =====================================================
     IDENTIFY THE VISIBLE STORY
     ===================================================== */

  function getActiveVideo() {

    const viewer = getViewer();

    if (!viewer) return null;

    const videos = getVideos();

    if (!videos.length) return null;

    const track = viewer.querySelector(TRACK);

    if (!track) return null;

    const trackRect = track.getBoundingClientRect();

    const viewerRect = viewer.getBoundingClientRect();

    const visibleSlides = videos
      .map(video => {

        const slide = video.closest(SLIDE);

        if (!slide) return null;

        const rect = slide.getBoundingClientRect();

        const visibleWidth = Math.max(
          0,
          Math.min(rect.right, viewerRect.right) -
          Math.max(rect.left, viewerRect.left)
        );

        return {
          video,
          rect,
          visibleWidth
        };

      })
      .filter(Boolean);

    if (!visibleSlides.length) return null;

    const viewerCenter =
      (viewerRect.left + viewerRect.right) / 2;

    visibleSlides.sort((a, b) => {

      const aCenter =
        (a.rect.left + a.rect.right) / 2;

      const bCenter =
        (b.rect.left + b.rect.right) / 2;

      return (
        Math.abs(aCenter - viewerCenter) -
        Math.abs(bCenter - viewerCenter)
      );

    });

    return visibleSlides[0]?.video || null;

  }

  /* =====================================================
     STOP ALL OTHER VIDEOS
     ===================================================== */

  function stopOtherVideos(except = null) {

    getVideos().forEach(video => {

      if (video === except) return;

      video.pause();

      video.muted = true;

    });

  }

  /* =====================================================
     PLAY ACTIVE VIDEO
     ===================================================== */

  async function playStory(video) {

    if (!video) return;

    stopOtherVideos(video);

    activeVideo = video;

    video.volume = 1;

    video.muted = false;

    video.autoplay = true;

    video.playsInline = true;

    try {

      await video.play();

    } catch (_) {

      /*
         Browser blocked playback with sound.

         Try muted autoplay instead.
      */

      if (activeVideo !== video) return;

      video.muted = true;

      try {

        await video.play();

      } catch (_) {

        /*
           Playback is still restricted.

           The visitor can manually start it.
        */

      }

    }

  }

  /* =====================================================
     SYNCHRONIZE STORY PLAYBACK
     ===================================================== */

  function syncPlayback() {

    syncScheduled = false;

    if (document.hidden) {

      stopOtherVideos();

      if (activeVideo) {
        activeVideo.pause();
      }

      return;

    }

    const viewer = getViewer();

    if (!viewer) {

      stopOtherVideos();

      activeVideo = null;

      return;

    }

    const nextVideo = getActiveVideo();

    if (!nextVideo) {

      stopOtherVideos();

      activeVideo = null;

      return;

    }

    if (nextVideo !== activeVideo) {

      playStory(nextVideo);

      return;

    }

    stopOtherVideos(nextVideo);

    /*
       If SociableKIT paused the current video
       while navigating, restart it.
    */

    if (nextVideo.paused) {

      playStory(nextVideo);

    }

  }

  /* =====================================================
     SCHEDULE PLAYBACK CHECK
     ===================================================== */

  function scheduleSync() {

    if (syncScheduled) return;

    syncScheduled = true;

    requestAnimationFrame(() => {

      requestAnimationFrame(syncPlayback);

    });

  }

  /* =====================================================
     OBSERVE SOCIABLEKIT
     ===================================================== */

  function initializeObserver() {

    const widget = getWidget();

    if (!widget) {

      setTimeout(initializeObserver, 500);

      return;

    }

    const observer = new MutationObserver(() => {

      scheduleSync();

    });

    observer.observe(widget, {

      childList: true,

      subtree: true,

      attributes: true,

      attributeFilter: [
        "style",
        "class"
      ]

    });

    scheduleSync();

  }

  /* =====================================================
     USER INTERACTIONS
     ===================================================== */

  document.addEventListener("click", event => {

    const widget = getWidget();

    if (!widget || !widget.contains(event.target)) {
      return;
    }

    /*
       Allow SociableKIT to finish opening
       or transitioning between stories.
    */

    scheduleSync();

    setTimeout(scheduleSync, 100);

    setTimeout(scheduleSync, 350);

    setTimeout(scheduleSync, 650);

  });

  /* =====================================================
     PAGE VISIBILITY
     ===================================================== */

  document.addEventListener("visibilitychange", () => {

    if (document.hidden) {

      getVideos().forEach(video => {
        video.pause();
      });

    } else {

      activeVideo = null;

      scheduleSync();

    }

  });

  /* =====================================================
     PAGE EXIT
     ===================================================== */

  window.addEventListener("pagehide", () => {

    getVideos().forEach(video => {

      video.pause();

      video.muted = true;

    });

    activeVideo = null;

  });

  /* =====================================================
     INITIALIZATION
     ===================================================== */

  if (document.readyState === "loading") {

    document.addEventListener(
      "DOMContentLoaded",
      initializeObserver
    );

  } else {

    initializeObserver();

  }

})();
