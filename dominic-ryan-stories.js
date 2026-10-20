/* =========================================================
   DOMINIC RYAN — FORMULATIONS
   INSTAGRAM STORY HIGHLIGHTS

   CONSOLIDATED EDITION / OCTOBER 2026

   Design objectives:
   - Centered circular Highlights
   - Compact editorial presentation
   - Clean portrait Story viewer
   - No profile photograph in Story viewer
   - No Story header/title
   - Functional carousel navigation
   - Responsive desktop and mobile layouts
   - Remove SociableKIT branding
   ========================================================= */


/* =========================================================
   01 / DESIGN VARIABLES
   ========================================================= */

.sk-ww-instagram-story-highlights {
  --dr-highlight-size: 112px;
  --dr-highlight-gap: 14px;

  --dr-story-width: 390px;

  --dr-ink: #292621;
  --dr-accent: #9D8873;

  width: 100% !important;
  max-width: 100% !important;

  margin: 0 auto !important;
  padding: 0 !important;

  background: transparent !important;

  border: none !important;
  border-radius: 0 !important;
  box-shadow: none !important;
}


/* =========================================================
   02 / REMOVE MAIN WIDGET HEADER

   Does not affect Story navigation.
   ========================================================= */

.sk-ww-instagram-story-highlights
.sk-posts-header,

.sk-ww-instagram-story-highlights
.sk-header-follow-btn,

.sk-ww-instagram-story-highlights
.sk-button-follow-instagram {
  display: none !important;
}


/* =========================================================
   03 / WIDGET BODY
   ========================================================= */

.sk-ww-instagram-story-highlights
.sk-posts-body {
  box-sizing: border-box !important;

  width: 100% !important;
  max-width: 100% !important;

  margin: 0 !important;
  padding: 0 !important;

  background: transparent !important;
}


/* =========================================================
   04 / HIGHLIGHTS STRIP
   ========================================================= */

.sk-ww-instagram-story-highlights
.sk-highlights-strip-wrap {
  display: flex !important;

  justify-content: center !important;
  align-items: center !important;

  width: 100% !important;

  margin: 0 auto !important;
  padding: 0 !important;
}


/* =========================================================
   05 / HIGHLIGHTS VIEWPORT
   ========================================================= */

.sk-ww-instagram-story-highlights
.sk-highlights-strip-viewport {
  width: 100% !important;
  max-width: 100% !important;

  margin: 0 auto !important;
  padding: 0 !important;

  overflow: hidden !important;
}


/* =========================================================
   06 / HIGHLIGHTS TRACK

   Scoped to the thumbnail strip.
   ========================================================= */

.sk-ww-instagram-story-highlights
.sk-highlights-strip-viewport
.sk-posts-stories {
  display: flex !important;

  justify-content: center !important;
  align-items: flex-start !important;

  flex-wrap: nowrap !important;

  gap: var(--dr-highlight-gap) !important;

  width: 100% !important;

  margin: 0 auto !important;
  padding: 0 !important;

  transform: none !important;
}


/* =========================================================
   07 / HIGHLIGHT ITEMS
   ========================================================= */

.sk-ww-instagram-story-highlights
.sk-highlights-strip-viewport
.sk-posts-story-item {
  box-sizing: border-box !important;

  flex: 0 0 var(--dr-highlight-size) !important;

  width: var(--dr-highlight-size) !important;
  min-width: var(--dr-highlight-size) !important;
  max-width: var(--dr-highlight-size) !important;

  margin: 0 !important;
  padding: 0 !important;

  background: transparent !important;
  border: none !important;

  text-align: center !important;
}


/* =========================================================
   08 / CIRCULAR THUMBNAIL WRAPPERS
   ========================================================= */

.sk-ww-instagram-story-highlights
.sk-highlights-strip-viewport
.sk-story-thumb-wrap {
  display: block !important;

  position: relative !important;

  box-sizing: border-box !important;

  width: var(--dr-highlight-size) !important;
  height: var(--dr-highlight-size) !important;

  min-width: var(--dr-highlight-size) !important;
  min-height: var(--dr-highlight-size) !important;

  max-width: var(--dr-highlight-size) !important;
  max-height: var(--dr-highlight-size) !important;

  aspect-ratio: 1 / 1 !important;

  margin: 0 auto !important;
  padding: 0 !important;

  overflow: hidden !important;

  border-radius: 50% !important;

  border: none !important;
  box-shadow: none !important;
}


/* =========================================================
   09 / CIRCULAR THUMBNAIL IMAGES

   Applies ONLY to Highlights thumbnails.
   ========================================================= */

.sk-ww-instagram-story-highlights
.sk-highlights-strip-viewport
.sk-story-thumb-wrap img {
  display: block !important;

  box-sizing: border-box !important;

  width: 100% !important;
  height: 100% !important;

  aspect-ratio: 1 / 1 !important;

  object-fit: cover !important;
  object-position: center center !important;

  border-radius: 50% !important;

  transform: none !important;
  filter: none !important;

  opacity: 1 !important;

  image-rendering: auto !important;

  transition: opacity 350ms ease !important;
}


/* =========================================================
   10 / HIGHLIGHT LABELS
   ========================================================= */

.sk-ww-instagram-story-highlights
.sk-highlights-strip-viewport
.sk-story-highlight-title {
  display: block !important;

  width: 100% !important;

  margin: 9px 0 0 !important;
  padding: 0 !important;

  font-family: Georgia, "Times New Roman", serif !important;

  font-size: 12px !important;
  font-weight: 400 !important;

  line-height: 1.4 !important;

  color: var(--dr-ink) !important;

  text-align: center !important;
}


/* =========================================================
   11 / HIDE HIGHLIGHTS STRIP ARROWS

   Does not hide Story navigation.
   ========================================================= */

.sk-ww-instagram-story-highlights
.sk-highlights-strip-nav {
  display: none !important;
}


/* =========================================================

   12 / STORY VIEWER LAYOUT

   ========================================================= */

.sk-ww-instagram-story-highlights

.sk-story-viewer-layout {

  justify-content: center !important;

  align-items: flex-start !important;

  box-sizing: border-box !important;

  width: 100% !important;

  max-width: 100% !important;

  margin: 0 auto !important;

  padding: 0 !important;

}


/* =========================================================
   13 / STORY FRAME

   Prevent the oversized black rectangle.
   ========================================================= */

.sk-ww-instagram-story-highlights
.sk-story-viewer-layout
.sk-story-frame {
  position: relative !important;

  box-sizing: border-box !important;

  width: min(
    var(--dr-story-width),
    100%
  ) !important;

  max-width: var(--dr-story-width) !important;

  margin: 0 auto !important;
  padding: 0 !important;
}


/* =========================================================
   14 / STORY STAGE ROW

   Keep navigation aligned with the Story.
   ========================================================= */

.sk-ww-instagram-story-highlights
.sk-story-viewer-layout
.sk-story-stage-row {
  position: relative !important;

  display: flex !important;

  justify-content: center !important;
  align-items: center !important;

  width: 100% !important;
  min-width: 0 !important;

  margin: 0 auto !important;
}


/* =========================================================
   15 / STORY MAIN COLUMN
   ========================================================= */

.sk-ww-instagram-story-highlights
.sk-story-viewer-layout
.sk-story-main-column {
  position: relative !important;

  box-sizing: border-box !important;

  flex: 1 1 auto !important;

  width: 100% !important;
  min-width: 0 !important;
  max-width: 100% !important;
}


/* =========================================================
   16 / STORY STAGE WRAPPERS
   ========================================================= */

.sk-ww-instagram-story-highlights
.sk-story-viewer-layout
.sk-story-stage-wrap,

.sk-ww-instagram-story-highlights
.sk-story-viewer-layout
.sk-story-stage {
  position: relative !important;

  box-sizing: border-box !important;

  width: 100% !important;
  min-width: 0 !important;
  max-width: 100% !important;
}


/* =========================================================
   17 / STORY CAROUSEL

   Preserve native carousel track movement.
   ========================================================= */

.sk-ww-instagram-story-highlights
.sk-story-viewer-layout
.sk-posts-carousel.sk-carousel-story {
  box-sizing: border-box !important;

  width: 100% !important;
  max-width: 100% !important;

  overflow: hidden !important;
}


/* =========================================================
   18 / STORY CAROUSEL TRACK

   Do not override transforms or navigation logic.
   ========================================================= */

.sk-ww-instagram-story-highlights
.sk-story-viewer-layout
.sk-carousel-track {
  display: flex !important;

  align-items: stretch !important;
}


/* =========================================================
   19 / STORY SLIDE DIMENSIONS

   Prevent 0px carousel items.
   ========================================================= */

.sk-ww-instagram-story-highlights
.sk-story-viewer-layout
.sk-carousel-story
.sk-carousel-track
.sk-carousel-item {
  box-sizing: border-box !important;

  flex: 0 0 100% !important;

  width: 100% !important;
  min-width: 100% !important;
  max-width: 100% !important;

  margin: 0 !important;
  padding: 0 !important;
}


/* =========================================================
   20 / STORY MEDIA CONTAINER

   Never apply circular thumbnail styling here.
   ========================================================= */

.sk-ww-instagram-story-highlights
.sk-story-viewer-layout
.sk-story-slide-media {
  position: relative !important;

  box-sizing: border-box !important;

  width: 100% !important;
  max-width: 100% !important;

  overflow: hidden !important;

  border-radius: 0 !important;
}


/* =========================================================
   21 / STORY IMAGES
   ========================================================= */

.sk-ww-instagram-story-highlights
.sk-story-viewer-layout
.sk-story-slide-media img {
  display: block !important;

  width: 100% !important;
  height: auto !important;

  max-width: 100% !important;

  object-fit: contain !important;
  object-position: center center !important;

  aspect-ratio: auto !important;

  border-radius: 0 !important;

  transform: none !important;
  filter: none !important;
}


/* =========================================================
   22 / STORY VIDEOS
   ========================================================= */

.sk-ww-instagram-story-highlights
.sk-story-viewer-layout
.sk-story-slide-media video {
  display: block !important;

  width: 100% !important;
  height: auto !important;

  max-width: 100% !important;

  object-fit: contain !important;
  object-position: center center !important;

  border-radius: 0 !important;
}


/* =========================================================
   23 / REMOVE STORY PROFILE HEADER

   Confirmed SociableKIT selector.

   Removes:
   - Profile photograph
   - Story title / username

   Preserves:
   - Story progress indicators
   - Close button
   - Previous / next navigation
   ========================================================= */

.sk-ww-instagram-story-highlights
.sk-story-viewer-layout
.sk-story-topbar {
  display: none !important;
}


/* =========================================================
   24 / STORY PROGRESS INDICATORS

   Preserve native progress functionality.
   ========================================================= */

.sk-ww-instagram-story-highlights
.sk-story-viewer-layout
.sk-story-progress {
  max-width: 100% !important;
}


/* =========================================================
   25 / STORY CLOSE BUTTON

   Keep the close button near the viewer.
   ========================================================= */

.sk-ww-instagram-story-highlights
.sk-story-viewer-layout
.sk-story-close {
  position: absolute !important;

  top: 0 !important;
  right: 0 !important;

  z-index: 20 !important;

  cursor: pointer !important;
}


/* =========================================================
   26 / STORY NAVIGATION

   Preserve previous / next functionality.
   ========================================================= */

.sk-ww-instagram-story-highlights
.sk-story-viewer-layout
.sk-story-nav-btn {
  flex-shrink: 0 !important;

  cursor: pointer !important;
}


/* =========================================================
   27 / HOVER INTERACTION
   ========================================================= */

@media (hover: hover) and (pointer: fine) {

  .sk-ww-instagram-story-highlights
  .sk-highlights-strip-viewport
  .sk-posts-story-item:hover
  .sk-story-thumb-wrap img {
    opacity: 0.85 !important;
  }

}


/* =========================================================
   28 / TABLET
   ========================================================= */

@media screen and (max-width: 1024px) {

  .sk-ww-instagram-story-highlights {
    --dr-highlight-size: 100px;
    --dr-highlight-gap: 12px;

    --dr-story-width: 360px;
  }

}


/* =========================================================
   29 / MOBILE
   ========================================================= */

@media screen and (max-width: 767px) {

  .sk-ww-instagram-story-highlights {
    --dr-highlight-size: 76px;
    --dr-highlight-gap: 12px;

    --dr-story-width: 100%;
  }

  .sk-ww-instagram-story-highlights
  .sk-highlights-strip-viewport {
    overflow-x: auto !important;
    overflow-y: hidden !important;

    -webkit-overflow-scrolling: touch;
  }

  .sk-ww-instagram-story-highlights
  .sk-highlights-strip-viewport
  .sk-posts-stories {
    justify-content: flex-start !important;

    width: max-content !important;
    min-width: 100% !important;
  }

  .sk-ww-instagram-story-highlights
  .sk-story-viewer-layout
  .sk-story-frame {
    width: 100% !important;
    max-width: 100% !important;
  }

}


/* =========================================================
   30 / ACCESSIBILITY
   ========================================================= */

@media (prefers-reduced-motion: reduce) {

  .sk-ww-instagram-story-highlights
  .sk-highlights-strip-viewport
  .sk-story-thumb-wrap img {
    transition: none !important;
  }

}


/* =========================================================
   31 / REMOVE SOCIABLEKIT BRANDING

   Targets the branding container outside the widget.

   Includes preview and published implementations.
   ========================================================= */

.sk_branding,
.sk-widget-preview-host .sk_branding {
  display: none !important;
  visibility: hidden !important;
}
/* =====================================================
   DOMINIC RYAN — STORY VIEWER COLORS
   ===================================================== */

/* Unified warm stone background */

.sk-highlight-story-shell,
.sk-story-viewer-layout,
.sk-story-frame,
.sk-story-stage-row,
.sk-story-stage-wrap,
.sk-story-stage {
  background-color: #E5DED6 !important;
}

/* Remove contrasting borders and shadows */

.sk-highlight-story-shell,
.sk-story-viewer-layout,
.sk-story-frame {
  border-color: transparent !important;
  box-shadow: none !important;
}

/* Navigation buttons */

.sk-story-nav-btn {
  background-color: #84776D !important;
  color: #FBF8F2 !important;
  border-color: transparent !important;
}

/* Navigation hover */

.sk-story-nav-btn:hover {
  background-color: #51463E !important;
}

/* =====================================================
   DOMINIC RYAN — STORY BACKGROUND CLICK SUPPORT
   ===================================================== */

/* Identify the Story viewer's surrounding background */

.sk-ww-instagram-story-highlights
.sk-story-viewer-layout {
  position: relative !important;
}

/* Preserve normal click behavior on the viewer background */

.sk-ww-instagram-story-highlights
.sk-story-frame,
.sk-ww-instagram-story-highlights
.sk-story-stage-row,
.sk-ww-instagram-story-highlights
.sk-story-stage-wrap {
  pointer-events: auto !important;
}
