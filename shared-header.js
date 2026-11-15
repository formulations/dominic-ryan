/* Extracted from the existing common tagline fitting implementation.
   Load once after the header markup (without defer) to preserve first-paint fitting.
   Remove the original inline tagline fitting script from each page. */

/* Shared, synchronous, first-paint fitting: no visibility gate or delayed reveal. */
(() => {
  const tagline = document.querySelector('.header .tagline');
  if (!tagline) return;
  const fit = () => {
    // Reset only the sizing we own; preserve the original design's preferred font size.
    tagline.style.fontSize = '';
    tagline.style.width = '';
    tagline.style.maxWidth = '';
    const left = tagline.getBoundingClientRect().left;
    const viewport = document.documentElement.clientWidth || innerWidth;
    // Keep the full line clear of the floating contact control on mobile.
    // On desktop retain the original header sizing unless space is genuinely tight.
    const reserved = viewport <= 760 ? 78 : 180;
    const available = Math.max(1, Math.floor(viewport - left - reserved));
    const naturalSize = parseFloat(getComputedStyle(tagline).fontSize);
    if (!naturalSize) return;
    tagline.style.width = available + 'px';
    tagline.style.maxWidth = available + 'px';
    if (tagline.scrollWidth <= available) return;
    let low = 1, high = naturalSize;
    for (let i = 0; i < 18; i++) {
      const mid = (low + high) / 2;
      tagline.style.fontSize = mid + 'px';
      if (tagline.scrollWidth > available) high = mid;
      else low = mid;
    }
    tagline.style.fontSize = Math.max(1, low - .25) + 'px';
  };
  // This parser-blocking inline script follows the complete header, so the
  // browser has not painted the header before the first measurement.
  fit();
  let scheduled = false;
  window.addEventListener('resize', () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => { scheduled = false; fit(); });
  }, {passive:true});
})();
