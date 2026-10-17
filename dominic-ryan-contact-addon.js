/* =========================================================
   DOMINIC RYAN — CONTACT FORM ADDITION
   Self-contained CSS, HTML, and JavaScript
   Formspree: https://formspree.io/f/xzedoqkn
   ========================================================= */

(() => {
  "use strict";

  const FORMSPREE_URL = "https://formspree.io/f/xzedoqkn";

  const styles = `
    /* CONTACT BUTTONS */

    .dr-contact-header {
      display: flex;
      align-items: center;
      gap: 22px;
    }

    .dr-contact-trigger {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 9px;
      padding: 9px 13px;
      background: #8b786b;
      border: 1px solid rgba(255,255,255,.55);
      border-radius: 2px;
      color: #fbf8f2;
      font-family: "Avenir Next", "Helvetica Neue", Arial, sans-serif;
      font-size: 9px;
      font-weight: 500;
      letter-spacing: .14em;
      white-space: nowrap;
      cursor: pointer;
      transition: background .25s ease, transform .25s ease;
    }

    .dr-contact-trigger:hover {
      background: #746256;
      transform: translateY(-1px);
    }

    .dr-contact-trigger:focus-visible,
    .dr-contact-close:focus-visible,
    .dr-contact-submit:focus-visible,
    .dr-contact-toolbar button:focus-visible {
      outline: 2px solid #8b786b;
      outline-offset: 3px;
    }

    .dr-contact-mail {
      font-size: 15px;
      line-height: 1;
      font-weight: 400;
    }

    .dr-contact-nav-link {
      cursor: pointer;
    }

    /* MODAL OVERLAY */

    .dr-contact-overlay {
      position: fixed;
      inset: 0;
      z-index: 20000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      background: rgba(44,38,34,.43);
      backdrop-filter: blur(7px);
      -webkit-backdrop-filter: blur(7px);
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
      transition: opacity .35s ease, visibility .35s ease;
    }

    .dr-contact-overlay.is-open {
      opacity: 1;
      visibility: visible;
      pointer-events: auto;
    }

    .dr-contact-dialog {
      position: relative;
      width: min(100%, 636px);
      max-height: min(920px, calc(100dvh - 48px));
      overflow-y: auto;
      overscroll-behavior: contain;
      padding: 43px 43px 31px;
      background: #fbf8f2;
      color: #51463e;
      border-radius: 3px;
      box-shadow: 0 26px 75px rgba(35,28,24,.23);
      transform: translateY(14px) scale(.99);
      transition: transform .4s cubic-bezier(.22,.61,.36,1);
      scrollbar-width: thin;
    }

    .dr-contact-overlay.is-open .dr-contact-dialog {
      transform: translateY(0) scale(1);
    }

    .dr-contact-close {
      position: absolute;
      top: 18px;
      right: 19px;
      border: 0;
      background: transparent;
      color: #332a25;
      font-family: Arial, sans-serif;
      font-size: 33px;
      font-weight: 200;
      line-height: 1;
      cursor: pointer;
      padding: 3px 7px;
    }

    .dr-contact-eyebrow {
      margin: 0 0 12px;
      font-family: "Avenir Next", Arial, sans-serif;
      font-size: 10px;
      letter-spacing: .24em;
      color: #51463e;
    }

    .dr-contact-title {
      display: flex;
      align-items: baseline;
      gap: 15px;
      margin: 0 0 8px;
      font-family: Didot, "Bodoni 72", Georgia, serif;
      font-size: clamp(39px, 5vw, 53px);
      line-height: 1.1;
      font-weight: 400;
      letter-spacing: -.035em;
      color: #16120f;
    }

    .dr-contact-ornament {
      font-family: Georgia, serif;
      font-size: .66em;
      line-height: 1;
      font-weight: 400;
    }

    .dr-contact-intro {
      margin: 0 0 25px;
      max-width: 490px;
      font-family: Georgia, serif;
      font-size: 17px;
      line-height: 1.48;
      color: #625b55;
    }

    /* FIELDS */

    .dr-contact-field {
      position: relative;
      display: flex;
      align-items: center;
      height: 59px;
      margin-bottom: 11px;
      border: 1px solid #d0c6bc;
      border-radius: 6px;
      background: rgba(255,255,255,.18);
      transition: border-color .2s ease;
    }

    .dr-contact-field:focus-within {
      border-color: #8b786b;
    }

    .dr-contact-field-icon {
      flex: 0 0 59px;
      text-align: center;
      color: #493a30;
      font-size: 22px;
      line-height: 1;
    }

    .dr-contact-field input {
      width: 100%;
      min-width: 0;
      height: 100%;
      border: 0;
      outline: 0;
      background: transparent;
      padding: 0 14px 0 0;
      font-family: Georgia, serif;
      font-size: 16px;
      color: #51463e;
    }

    .dr-contact-field input::placeholder {
      color: #746c65;
      opacity: 1;
    }

    .dr-contact-divider {
      width: 200px;
      height: 1px;
      margin: 18px auto 18px;
      background: #9d8e83;
    }

    /* MESSAGE EDITOR */

    .dr-contact-editor {
      border: 1px solid #d0c6bc;
      border-radius: 6px;
      overflow: hidden;
      background: rgba(255,255,255,.18);
    }

    .dr-contact-editor:focus-within {
      border-color: #8b786b;
    }

    .dr-contact-toolbar {
      display: flex;
      align-items: center;
      gap: 3px;
      min-height: 53px;
      padding: 5px 11px;
      background: rgba(135,115,100,.07);
      border-bottom: 1px solid #ded7d0;
      flex-wrap: wrap;
    }

    .dr-contact-toolbar button {
      min-width: 42px;
      height: 36px;
      border: 0;
      background: transparent;
      color: #493a30;
      cursor: pointer;
      font-family: Georgia, serif;
      font-size: 19px;
      border-radius: 3px;
    }

    .dr-contact-toolbar button:hover {
      background: rgba(135,115,100,.12);
    }

    .dr-contact-toolbar-separator {
      width: 1px;
      height: 24px;
      margin: 0 7px;
      background: #d8cec4;
    }

    .dr-contact-message-wrap {
      position: relative;
      display: flex;
      align-items: flex-start;
      min-height: 235px;
      padding: 19px 19px 20px;
      gap: 15px;
    }

    .dr-contact-pencil {
      flex: none;
      font-size: 21px;
      color: #493a30;
    }

    .dr-contact-message {
      flex: 1;
      min-width: 0;
      min-height: 195px;
      outline: 0;
      overflow-wrap: anywhere;
      font-family: Georgia, serif;
      font-size: 16px;
      line-height: 1.55;
      color: #51463e;
    }

    .dr-contact-message:empty::before {
      content: attr(data-placeholder);
      color: #746c65;
      pointer-events: none;
    }

    .dr-contact-message a {
      color: #766052;
      text-decoration: underline;
    }

    .dr-contact-message ul,
    .dr-contact-message ol {
      padding-left: 22px;
    }

    /* FOOTER */

    .dr-contact-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
      margin-top: 29px;
    }

    .dr-contact-monogram {
      display: block;
      width: 67px;
      height: auto;
      opacity: .8;
    }

    .dr-contact-submit {
      min-width: 275px;
      min-height: 54px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 28px;
      padding: 12px 22px;
      background: #8b786b;
      border: 0;
      color: #fffaf5;
      font-family: "Avenir Next", Arial, sans-serif;
      font-size: 11px;
      font-weight: 500;
      letter-spacing: .17em;
      cursor: pointer;
      transition: background .2s ease;
    }

    .dr-contact-submit:hover {
      background: #746256;
    }

    .dr-contact-submit:disabled {
      opacity: .6;
      cursor: wait;
    }

    .dr-contact-arrow {
      font-size: 25px;
      line-height: .8;
      font-weight: 300;
    }

    .dr-contact-status {
      margin-top: 15px;
      min-height: 20px;
      font-family: "Avenir Next", Arial, sans-serif;
      font-size: 12px;
      line-height: 1.5;
      color: #655d56;
    }

    .dr-contact-status.is-error {
      color: #9a3d34;
    }

    .dr-contact-success {
      display: none;
      padding: 45px 0 20px;
      text-align: left;
    }

    .dr-contact-success h3 {
      font-family: Didot, "Bodoni 72", Georgia, serif;
      font-size: 40px;
      font-weight: 400;
      margin: 0 0 15px;
      color: #16120f;
    }

    .dr-contact-success p {
      font-family: Georgia, serif;
      font-size: 17px;
      line-height: 1.6;
      color: #625b55;
    }

    .dr-contact-dialog.is-success .dr-contact-form-content {
      display: none;
    }

    .dr-contact-dialog.is-success .dr-contact-success {
      display: block;
    }

    /* MOBILE */

    @media (max-width: 760px) {
      .dr-contact-header {
        gap: 9px;
        align-items: center;
      }

      .dr-contact-trigger {
        padding: 7px 9px;
        font-size: 8px;
        letter-spacing: .05em;
        gap: 5px;
      }

      .dr-contact-mail {
        font-size: 13px;
      }

      .dr-contact-overlay {
        padding: 12px;
        align-items: center;
      }

      .dr-contact-dialog {
        width: 100%;
        max-height: calc(100dvh - 24px);
        padding: 39px 23px 23px;
      }

      .dr-contact-title {
        font-size: clamp(34px, 9vw, 45px);
      }

      .dr-contact-intro {
        font-size: 15px;
      }

      .dr-contact-field {
        height: 53px;
      }

      .dr-contact-message-wrap {
        min-height: 215px;
      }

      .dr-contact-message {
        min-height: 175px;
      }

      .dr-contact-toolbar {
        gap: 0;
        padding: 5px;
      }

      .dr-contact-toolbar button {
        min-width: 35px;
      }

      .dr-contact-toolbar-separator {
        margin: 0 3px;
      }

      .dr-contact-submit {
        min-width: 0;
        flex: 1;
        min-height: 49px;
        gap: 13px;
        padding: 10px 12px;
        font-size: 9px;
      }

      .dr-contact-monogram {
        width: 54px;
      }
    }

    @media (max-width: 390px) {
      .dr-contact-trigger {
        font-size: 7px;
        padding: 7px;
      }

      .dr-contact-mail {
        font-size: 12px;
      }

      .dr-contact-header {
        gap: 6px;
      }

      .dr-contact-dialog {
        padding-left: 18px;
        padding-right: 18px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .dr-contact-overlay,
      .dr-contact-dialog,
      .dr-contact-trigger {
        transition: none !important;
      }
    }
  `;

  const styleElement = document.createElement("style");
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);

  /* =========================================================
     HEADER BUTTON
     ========================================================= */

  const header = document.querySelector(".header");
  const location = document.querySelector(".header .location");

  if (header && location) {
    const headerGroup = document.createElement("div");
    headerGroup.className = "dr-contact-header";

    const headerButton = document.createElement("button");
    headerButton.type = "button";
    headerButton.className = "dr-contact-trigger";
    headerButton.setAttribute("data-dr-contact-open", "");
    headerButton.setAttribute("aria-haspopup", "dialog");
    headerButton.innerHTML =
      '<span class="dr-contact-mail" aria-hidden="true">✉</span>' +
      '<span>SEND A MESSAGE</span>';

    location.parentNode.insertBefore(headerGroup, location);
    headerGroup.appendChild(headerButton);
    headerGroup.appendChild(location);
  }

  /* =========================================================
     FOOTER NAVIGATION LINK
     ========================================================= */

  const nav = document.getElementById("utility-nav");

  if (nav) {
    const divider = document.createElement("span");
    divider.className = "utility-rule dr-contact-nav-rule";
    divider.setAttribute("aria-hidden", "true");

    const footerLink = document.createElement("a");
    footerLink.href = "#contact";
    footerLink.className = "dr-contact-nav-link";
    footerLink.setAttribute("data-dr-contact-open", "");
    footerLink.textContent = "SEND A MESSAGE";

    nav.appendChild(divider);
    nav.appendChild(footerLink);
  }

  /* =========================================================
     MODAL HTML
     ========================================================= */

  const overlay = document.createElement("div");
  overlay.className = "dr-contact-overlay";
  overlay.id = "dr-contact-overlay";
  overlay.setAttribute("aria-hidden", "true");

  overlay.innerHTML = `
    <section
      class="dr-contact-dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dr-contact-title"
      tabindex="-1"
    >
      <button
        class="dr-contact-close"
        type="button"
        aria-label="Close contact form"
      >&times;</button>

      <div class="dr-contact-form-content">
        <div class="dr-contact-eyebrow">
          A MESSAGE TO DOMINIC
        </div>

        <h2 class="dr-contact-title" id="dr-contact-title">
          Get in Touch
          <span class="dr-contact-ornament" aria-hidden="true">❧</span>
        </h2>

        <p class="dr-contact-intro">
          Whether it’s a question, a project, a recommendation,
          or simply a message to share — I’d love to hear from you.
        </p>

        <form id="dr-contact-form" novalidate>
          <label class="dr-contact-field">
            <span class="dr-contact-field-icon" aria-hidden="true">♙</span>
            <input
              name="name"
              type="text"
              placeholder="Your name"
              aria-label="Your name"
              autocomplete="name"
              required
              maxlength="150"
            >
          </label>

          <label class="dr-contact-field">
            <span class="dr-contact-field-icon" aria-hidden="true">✉</span>
            <input
              name="email"
              type="email"
              placeholder="Your email"
              aria-label="Your email"
              autocomplete="email"
              required
              maxlength="254"
            >
          </label>

          <label class="dr-contact-field">
            <span class="dr-contact-field-icon" aria-hidden="true">♢</span>
            <input
              name="subject"
              type="text"
              placeholder="Subject"
              aria-label="Subject"
              required
              maxlength="200"
            >
          </label>

          <div class="dr-contact-divider" aria-hidden="true"></div>

          <div class="dr-contact-editor">
            <div
              class="dr-contact-toolbar"
              role="toolbar"
              aria-label="Message formatting"
            >
              <button type="button" data-format="bold" aria-label="Bold">
                <strong>B</strong>
              </button>

              <button type="button" data-format="italic" aria-label="Italic">
                <em>I</em>
              </button>

              <button type="button" data-format="underline" aria-label="Underline">
                <u>U</u>
              </button>

              <span class="dr-contact-toolbar-separator" aria-hidden="true"></span>

              <button type="button" data-format="color" aria-label="Text color">
                ◉
              </button>

              <span class="dr-contact-toolbar-separator" aria-hidden="true"></span>

              <button type="button" data-format="list" aria-label="Bulleted list">
                ☷
              </button>

              <button type="button" data-format="link" aria-label="Insert link">
                🔗
              </button>
            </div>

            <div class="dr-contact-message-wrap">
              <span class="dr-contact-pencil" aria-hidden="true">✎</span>

              <div
                id="dr-contact-message"
                class="dr-contact-message"
                contenteditable="true"
                role="textbox"
                aria-label="Your message"
                aria-multiline="true"
                data-placeholder="Write your message..."
                spellcheck="true"
              ></div>
            </div>
          </div>

          <div class="dr-contact-footer">
            <img
              class="dr-contact-monogram"
              src="dr-reveals-removebg-preview.png"
              alt=""
              aria-hidden="true"
            >

            <button class="dr-contact-submit" type="submit">
              <span>SEND MESSAGE</span>
              <span class="dr-contact-arrow" aria-hidden="true">→</span>
            </button>
          </div>

          <div
            class="dr-contact-status"
            id="dr-contact-status"
            role="status"
            aria-live="polite"
          ></div>
        </form>
      </div>

      <div class="dr-contact-success" role="status">
        <h3>Message Sent ❧</h3>
        <p>
          Thank you for reaching out. Your message has been received,
          and I look forward to reading it.
        </p>
      </div>
    </section>
  `;

  document.body.appendChild(overlay);

  const dialog = overlay.querySelector(".dr-contact-dialog");
  const closeButton = overlay.querySelector(".dr-contact-close");
  const form = overlay.querySelector("#dr-contact-form");
  const editor = overlay.querySelector("#dr-contact-message");
  const status = overlay.querySelector("#dr-contact-status");
  const submitButton = overlay.querySelector(".dr-contact-submit");

  let previousFocus = null;
  let previousOverflow = "";

  /* =========================================================
     OPEN / CLOSE
     ========================================================= */

  function openContact(event) {
    if (event) event.preventDefault();

    previousFocus = document.activeElement;
    previousOverflow = document.body.style.overflow;

    dialog.classList.remove("is-success");
    form.reset();
    editor.innerHTML = "";
    status.textContent = "";
    status.classList.remove("is-error");

    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";

    closeButton.focus();
  }

  function closeContact() {
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");

    document.body.style.overflow = previousOverflow;

    if (previousFocus && typeof previousFocus.focus === "function") {
      previousFocus.focus();
    }
  }

  document.querySelectorAll("[data-dr-contact-open]").forEach(trigger => {
    trigger.addEventListener("click", openContact);
  });

  closeButton.addEventListener("click", closeContact);

  /* Click the blurred area to dismiss. */
  overlay.addEventListener("click", event => {
    if (event.target === overlay) {
      closeContact();
    }
  });

  document.addEventListener("keydown", event => {
    if (!overlay.classList.contains("is-open")) return;

    if (event.key === "Escape") {
      event.preventDefault();
      closeContact();
      return;
    }

    if (event.key === "Tab") {
      const focusable = Array.from(
        dialog.querySelectorAll(
          'button:not([disabled]), input:not([disabled]), [contenteditable="true"], a[href]'
        )
      ).filter(element => element.getClientRects().length);

      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  /* =========================================================
     RICH TEXT FORMATTING
     ========================================================= */

  const toolbar = overlay.querySelector(".dr-contact-toolbar");

  toolbar.addEventListener("mousedown", event => {
    if (event.target.closest("button")) {
      event.preventDefault();
    }
  });

  toolbar.addEventListener("click", event => {
    const button = event.target.closest("button[data-format]");
    if (!button) return;

    const format = button.dataset.format;

    editor.focus();

    if (format === "bold") {
      document.execCommand("bold", false, null);
    }

    if (format === "italic") {
      document.execCommand("italic", false, null);
    }

    if (format === "underline") {
      document.execCommand("underline", false, null);
    }

    if (format === "list") {
      document.execCommand("insertUnorderedList", false, null);
    }

    if (format === "color") {
      const color = window.prompt(
        "Enter a text color (for example #8b786b):",
        "#8b786b"
      );

      if (color && /^#[0-9a-fA-F]{6}$/.test(color.trim())) {
        document.execCommand("foreColor", false, color.trim());
      }
    }

    if (format === "link") {
      const url = window.prompt(
        "Enter a link beginning with https://"
      );

      if (url) {
        try {
          const parsed = new URL(url.trim());

          if (parsed.protocol === "https:" || parsed.protocol === "http:") {
            document.execCommand("createLink", false, parsed.href);
          }
        } catch (_) {
          /* Invalid links are ignored. */
        }
      }
    }
  });

  /* =========================================================
     SANITIZE MESSAGE HTML
     ========================================================= */

  function sanitizeMessageHTML(html) {
    const template = document.createElement("template");
    template.innerHTML = html;

    const allowedTags = new Set([
      "B", "STRONG", "I", "EM", "U",
      "P", "DIV", "BR", "UL", "OL", "LI",
      "A", "SPAN", "FONT"
    ]);

    function clean(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        return document.createTextNode(node.textContent);
      }

      if (node.nodeType !== Node.ELEMENT_NODE) {
        return document.createDocumentFragment();
      }

      const tag = node.tagName;

      const fragment = document.createDocumentFragment();

      if (!allowedTags.has(tag)) {
        node.childNodes.forEach(child => fragment.appendChild(clean(child)));
        return fragment;
      }

      const element = document.createElement(tag.toLowerCase());

      if (tag === "A") {
        const href = node.getAttribute("href");

        if (href) {
          try {
            const parsed = new URL(href, window.location.href);

            if (parsed.protocol === "https:" || parsed.protocol === "http:") {
              element.setAttribute("href", parsed.href);
            }
          } catch (_) {}
        }
      }

      if (tag === "SPAN" || tag === "FONT") {
        const style = node.getAttribute("style") || "";
        const match = style.match(
          /(?:^|;)\s*color\s*:\s*(#[0-9a-fA-F]{3,6})\s*(?:;|$)/i
        );

        if (match) {
          element.style.color = match[1];
        }
      }

      node.childNodes.forEach(child => element.appendChild(clean(child)));

      return element;
    }

    const result = document.createElement("div");

    template.content.childNodes.forEach(node => {
      result.appendChild(clean(node));
    });

    return result.innerHTML;
  }

  /* =========================================================
     FORMSPREE SUBMISSION
     ========================================================= */

  form.addEventListener("submit", async event => {
    event.preventDefault();

    const name = form.elements.name.value.trim();
    const email = form.elements.email.value.trim();
    const subject = form.elements.subject.value.trim();
    const message = editor.innerText.trim();

    status.textContent = "";
    status.classList.remove("is-error");

    if (!name || !email || !subject || !message) {
      status.textContent = "Please complete all fields before sending.";
      status.classList.add("is-error");
      return;
    }

    if (!form.elements.email.checkValidity()) {
      status.textContent = "Please enter a valid email address.";
      status.classList.add("is-error");
      return;
    }

    if (message.length > 20000) {
      status.textContent = "Please shorten your message before sending.";
      status.classList.add("is-error");
      return;
    }

    submitButton.disabled = true;
    status.textContent = "Sending your message…";

    const payload = {
      name,
      email,
      _replyto: email,
      subject,
      message,
      formatted_message: sanitizeMessageHTML(editor.innerHTML)
    };

    try {
      const response = await fetch(FORMSPREE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Form submission failed.");
      }

      dialog.classList.add("is-success");
      dialog.scrollTop = 0;
    } catch (error) {
      status.textContent =
        "Your message couldn't be sent. Please try again.";
      status.classList.add("is-error");
    } finally {
      submitButton.disabled = false;
    }
  });
/* =========================================================
   DOMINIC RYAN — CONTACT DESIGN REFINEMENTS

   - Refined SVG icons
   - Original branding colors
   - Corrected header alignment
   - Soft-focus correspondence button
   - Elegant hover transitions
   ========================================================= */


/* =========================================================
   1. REPLACE UNICODE ICONS WITH REFINED SVG ICONS
   ========================================================= */

const drRefinedIcons = {

  person: `
    <svg
      viewBox="0 0 24 24"
      width="23"
      height="23"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="7.5" r="3.5"/>
      <path d="M4.5 20v-1.5a7.5 7.5 0 0 1 15 0V20H4.5Z"/>
    </svg>
  `,

  envelope: `
    <svg
      viewBox="0 0 24 24"
      width="23"
      height="23"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <rect x="2.5" y="5" width="19" height="14" rx="1"/>
      <path d="m3 6 9 7 9-7"/>
    </svg>
  `,

  tag: `
    <svg
      viewBox="0 0 24 24"
      width="23"
      height="23"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M20.5 12.5 12 21 3 12l8.5-8.5H20.5v9Z"/>
      <circle cx="16.5" cy="7.5" r="1.25"/>
    </svg>
  `,

  pencil: `
    <svg
      viewBox="0 0 24 24"
      width="23"
      height="23"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="m4 20 4.5-1 11-11a2.1 2.1 0 0 0-3-3l-11 11L4 20Z"/>
      <path d="m14.5 7.5 3 3"/>
    </svg>
  `

};


/* APPLY ICONS TO FORM FIELDS */

const drFieldIcons =
  overlay.querySelectorAll(
    ".dr-contact-field-icon"
  );

const drFieldIconNames = [
  "person",
  "envelope",
  "tag"
];

drFieldIcons.forEach((icon, index) => {

  const iconName = drFieldIconNames[index];

  if (iconName) {
    icon.innerHTML = drRefinedIcons[iconName];
  }

});


/* REPLACE MESSAGE PENCIL */

const drPencil =
  overlay.querySelector(
    ".dr-contact-pencil"
  );

if (drPencil) {
  drPencil.innerHTML = drRefinedIcons.pencil;
}


/* REPLACE HEADER ENVELOPE */

const drHeaderMail =
  document.querySelector(
    ".dr-contact-trigger .dr-contact-mail"
  );

if (drHeaderMail) {
  drHeaderMail.innerHTML = drRefinedIcons.envelope;
}


/* =========================================================
   2. REFINED CONTACT STYLING
   ========================================================= */

const drRefinementStyles = `

  /* -----------------------------------------
     HEADER ALIGNMENT
     ----------------------------------------- */

  .dr-contact-header {
    display: flex;
    align-items: center;
    gap: 18px;
  }

  .dr-contact-header .location {
    padding-top: 0;
    margin: 0;
    line-height: 1.4;
  }


  /* -----------------------------------------
     CORRESPONDENCE BUTTON
     ----------------------------------------- */

  .dr-contact-trigger {
    position: relative;

    display: inline-flex;
    align-items: center;
    justify-content: center;

    gap: 9px;

    padding: 9px 15px;

    overflow: hidden;
    isolation: isolate;

    background: #8b786b;

    border: 1px solid rgba(255,255,255,.32);

    border-radius: 2px;

    color: #fbf8f2;

    box-shadow:
      0 2px 7px rgba(70,57,47,.07);

    transform: none;

    transition:
      background-color .7s ease,
      border-color .7s ease,
      box-shadow .8s ease;
  }


  /* DIFFUSED LIGHT LAYER */

  .dr-contact-trigger::before {
    content: "";

    position: absolute;

    inset: -35%;

    z-index: -1;

    pointer-events: none;

    background:
      radial-gradient(
        ellipse at 35% 40%,
        rgba(255,255,255,.30) 0%,
        rgba(255,255,255,.13) 35%,
        transparent 72%
      );

    filter: blur(17px);

    opacity: 0;

    transition:
      opacity .75s
      cubic-bezier(.22,.61,.36,1);
  }


  /* REFINED FOLDED-CORNER DETAIL */

  .dr-contact-trigger::after {
    content: "";

    position: absolute;

    top: 0;
    right: 0;

    width: 9px;
    height: 9px;

    background:
      linear-gradient(
        225deg,
        rgba(251,248,242,.42) 0%,
        rgba(251,248,242,.12) 48%,
        transparent 50%
      );

    pointer-events: none;
  }


  /* SOFT-FOCUS HOVER */

  @media (hover: hover) and (pointer: fine) {

    .dr-contact-trigger:hover {
      background: #968276;

      border-color:
        rgba(255,255,255,.48);

      box-shadow:
        0 0 17px rgba(139,120,107,.19),
        0 3px 12px rgba(70,57,47,.07);

      transform: none;
    }

    .dr-contact-trigger:hover::before {
      opacity: 1;
    }

  }


  /* SOFT PRESS RESPONSE */

  .dr-contact-trigger:active {
    background: #806d61;

    box-shadow:
      0 0 12px rgba(139,120,107,.16);

    transform: none;
  }


  /* ENVELOPE REMAINS SHARP */

  .dr-contact-mail {
    display: inline-flex;
    align-items: center;
    justify-content: center;

    width: 17px;
    height: 17px;

    flex: none;
  }

  .dr-contact-mail svg {
    display: block;

    width: 17px;
    height: 17px;

    stroke-width: 1.8;
  }


  /* -----------------------------------------
     TITLE — ORIGINAL BRAND BROWN
     ----------------------------------------- */

  .dr-contact-title {
    color: #51463e;
  }

  .dr-contact-ornament {
    color: #51463e;
  }


  /* -----------------------------------------
     FORM ICONS
     ----------------------------------------- */

  .dr-contact-field-icon {
    display: flex;
    align-items: center;
    justify-content: center;

    flex: 0 0 59px;

    color: #51463e;
  }

  .dr-contact-field-icon svg {
    display: block;

    width: 23px;
    height: 23px;

    stroke-width: 1.8;
  }

  .dr-contact-pencil {
    display: inline-flex;
    align-items: center;
    justify-content: center;

    color: #51463e;
  }

  .dr-contact-pencil svg {
    display: block;

    width: 23px;
    height: 23px;

    stroke-width: 1.8;
  }


  /* -----------------------------------------
     MOBILE REFINEMENTS
     ----------------------------------------- */

  @media (max-width: 760px) {

    .dr-contact-header {
      gap: 10px;
    }

    .dr-contact-trigger {
      padding: 8px 10px;

      gap: 7px;

      font-size: 8px;
    }

    .dr-contact-mail,
    .dr-contact-mail svg {
      width: 15px;
      height: 15px;
    }

    .dr-contact-field-icon {
      flex-basis: 51px;
    }

    .dr-contact-field-icon svg {
      width: 21px;
      height: 21px;
    }

  }


  /* -----------------------------------------
     REDUCED MOTION
     ----------------------------------------- */

  @media (prefers-reduced-motion: reduce) {

    .dr-contact-trigger,
    .dr-contact-trigger::before {
      transition: none !important;
    }

  }

`;


/* APPLY STYLES AFTER ORIGINAL CONTACT CSS */

const drRefinementStyleElement =
  document.createElement("style");

drRefinementStyleElement.textContent =
  drRefinementStyles;

document.head.appendChild(
  drRefinementStyleElement
);
})();
