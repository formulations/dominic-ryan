/* =========================================================
   DOMINIC RYAN — CONTACT FORM
   Self-contained CSS, HTML, and JavaScript

   Formspree:
   https://formspree.io/f/xzedoqkn

   Designed for Dominic Ryan | Formulations

   Includes:
   - Custom exit confirmation
   - Protection against accidentally discarding a message
   - Rich-text message formatting
   - Mobile keyboard-aware scrolling
   - Background scroll preservation
   - Formspree submission
   - Submission success confirmation

   Automatic draft saving has been removed.
   ========================================================= */

(() => {
  "use strict";

  const FORMSPREE_URL = "https://formspree.io/f/xzedoqkn";

  /* Prevent duplicate initialization. */

  if (document.getElementById("dr-contact-overlay")) {
    return;
  }

  /* =========================================================
     SVG ICONS
     ========================================================= */

  const icons = {
    person: `
      <svg viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="1.8"
        stroke-linecap="round" stroke-linejoin="round"
        aria-hidden="true">
        <circle cx="12" cy="7.5" r="3.5"/>
        <path d="M4.5 20v-1.5a7.5 7.5 0 0 1 15 0V20H4.5Z"/>
      </svg>
    `,

    envelope: `
      <svg viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="1.8"
        stroke-linecap="round" stroke-linejoin="round"
        aria-hidden="true">
        <rect x="2.5" y="5" width="19" height="14" rx="1"/>
        <path d="m3 6 9 7 9-7"/>
      </svg>
    `,

    tag: `
      <svg viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="1.8"
        stroke-linecap="round" stroke-linejoin="round"
        aria-hidden="true">
        <path d="M20.5 12.5 12 21 3 12l8.5-8.5H20.5v9Z"/>
        <circle cx="16.5" cy="7.5" r="1.25"/>
      </svg>
    `,

    pencil: `
      <svg viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="1.8"
        stroke-linecap="round" stroke-linejoin="round"
        aria-hidden="true">
        <path d="m4 20 4.5-1 11-11a2.1 2.1 0 0 0-3-3l-11 11L4 20Z"/>
        <path d="m14.5 7.5 3 3"/>
      </svg>
    `
  };

  /* =========================================================
     CONTACT FORM STYLING
     ========================================================= */

  const styles = `

    /* =====================================================
       HEADER
       ===================================================== */

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

    /* =====================================================
       ENVELOPE BUTTON — DESKTOP AND MOBILE
       ===================================================== */

    .dr-contact-trigger {
      position: relative;

      display: inline-flex;
      align-items: center;
      justify-content: center;

      width: 44px;
      height: 44px;

      min-width: 44px;
      min-height: 44px;

      padding: 0;
      gap: 0;

      overflow: hidden;
      isolation: isolate;

      background: #9d8873;

      border: 1px solid rgba(255,255,255,.32);
      border-radius: 8px;

      color: #fbf8f2;

      cursor: pointer;

      box-shadow:
        0 2px 7px rgba(70,57,47,.07);

      transition:
        background-color .7s ease,
        border-color .7s ease,
        box-shadow .8s ease;
    }

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

    @media (hover: hover) and (pointer: fine) {

      .dr-contact-trigger:hover {
        background: #aa9583;

        border-color:
          rgba(255,255,255,.48);

        box-shadow:
          0 0 17px rgba(157,136,117,.19),
          0 3px 12px rgba(70,57,47,.07);
      }

      .dr-contact-trigger:hover::before {
        opacity: 1;
      }

    }

    .dr-contact-trigger:active {
      background: #8b7766;

      box-shadow:
        0 0 12px rgba(157,136,117,.16);
    }

    .dr-contact-mail {
      display: inline-flex;
      align-items: center;
      justify-content: center;

      width: 20px;
      height: 20px;

      flex: none;
    }

    .dr-contact-mail svg {
      display: block;
      width: 20px;
      height: 20px;
    }

    /* =====================================================
       ACCESSIBILITY
       ===================================================== */

    .dr-contact-trigger:focus-visible,
    .dr-contact-close:focus-visible,
    .dr-contact-submit:focus-visible,
    .dr-contact-toolbar button:focus-visible,
    .dr-contact-keep:focus-visible,
    .dr-contact-discard:focus-visible {
      outline: 2px solid #9d8873;
      outline-offset: 3px;
    }

    /* =====================================================
       MODAL OVERLAY
       ===================================================== */

    .dr-contact-overlay {
      position: fixed;
      inset: 0;

      z-index: 20000;

      display: flex;
      align-items: center;
      justify-content: center;

      box-sizing: border-box;

      padding: 24px;

      background: rgba(44,38,34,.43);

      backdrop-filter: blur(7px);
      -webkit-backdrop-filter: blur(7px);

      opacity: 0;
      visibility: hidden;
      pointer-events: none;

      transition:
        opacity .65s ease,
        visibility .65s ease;
    }

    .dr-contact-overlay.is-open {
      opacity: 1;
      visibility: visible;
      pointer-events: auto;
    }

    /* =====================================================
       MODAL PANEL
       ===================================================== */

    .dr-contact-dialog {
      position: relative;

      box-sizing: border-box;

      width: min(100%, 636px);

      max-height:
        min(
          920px,
          calc(100dvh - 48px)
        );

      overflow-x: hidden;
      overflow-y: auto;

      overscroll-behavior: contain;

      padding:
        43px
        43px
        31px;

      background: #fbf8f2;
      color: #51463e;

      border-radius: 3px;

      box-shadow:
        0 26px 75px rgba(35,28,24,.23);

      opacity: 0;

      transform:
        translateY(12px);

      transition:
        opacity .38s ease,
        transform .4s
        cubic-bezier(.22,.61,.36,1);

      scrollbar-width: thin;
    }

    .dr-contact-overlay.is-open .dr-contact-dialog {
      opacity: 1;

      transform:
        translateY(0);
    }

    /* CLOSE BUTTON */

    .dr-contact-close {
      position: absolute;

      top: 18px;
      right: 19px;

      border: 0;
      background: transparent;

      color: #51463e;

      font-family: Arial, sans-serif;
      font-size: 33px;
      font-weight: 200;
      line-height: 1;

      cursor: pointer;

      padding: 3px 7px;
    }

    /* =====================================================
       HEADING
       ===================================================== */

    .dr-contact-eyebrow {
      margin: 0 0 12px;

      font-family:
        "Avenir Next",
        Arial,
        sans-serif;

      font-size: 10px;
      letter-spacing: .24em;

      color: #51463e;
    }

    .dr-contact-title {
      display: flex;
      align-items: baseline;
      gap: 15px;

      margin: 0 0 8px;

      font-family:
        Didot,
        "Bodoni 72",
        Georgia,
        serif;

      font-size:
        clamp(
          39px,
          5vw,
          53px
        );

      line-height: 1.1;

      font-weight: 400;
      letter-spacing: -.035em;

      color: #9d8873;
    }

    .dr-contact-ornament {
      font-family: Georgia, serif;
      font-size: .66em;
      line-height: 1;
      font-weight: 400;
      color: #9d8873;
    }

    .dr-contact-intro {
      margin: 0 0 25px;

      max-width: 490px;

      font-family: Georgia, serif;

      font-size: 17px;
      line-height: 1.48;

      color: #625b55;
    }

    /* =====================================================
       FORM FIELDS
       ===================================================== */

    .dr-contact-field {
      position: relative;

      display: flex;
      align-items: center;

      height: 59px;

      margin-bottom: 11px;

      border: 1px solid #d0c6bc;
      border-radius: 6px;

      background: rgba(255,255,255,.18);

      transition:
        border-color .2s ease;
    }

    .dr-contact-field:focus-within {
      border-color: #8b786b;
    }

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
    }

    .dr-contact-field input {
      box-sizing: border-box;

      width: 100%;
      min-width: 0;
      height: 100%;

      border: 0;
      outline: 0;

      background: transparent;

      padding: 0 14px 0 0;

      font-family:
        "Avenir Next",
        "Helvetica Neue",
        Arial,
        sans-serif;

      font-size: 15px;
      font-weight: 400;
      line-height: 1.56;
      letter-spacing: .01em;

      color: #5c524b;

      -webkit-text-fill-color: #5c524b;
    }

    .dr-contact-field input:-webkit-autofill,
    .dr-contact-field input:-webkit-autofill:hover,
    .dr-contact-field input:-webkit-autofill:focus {
      -webkit-text-fill-color: #5c524b;

      -webkit-box-shadow:
        0 0 0 1000px #fbf8f2 inset;

      box-shadow:
        0 0 0 1000px #fbf8f2 inset;

      transition:
        background-color 9999s ease-out;
    }

    .dr-contact-field input::placeholder {
      color: #746c65;
      opacity: 1;
    }

    /* DIVIDER */

    .dr-contact-divider {
      width: 200px;
      height: 1px;

      margin:
        18px
        auto
        18px;

      background: #9d8e83;
    }

    /* =====================================================
       MESSAGE EDITOR
       ===================================================== */

    .dr-contact-editor {
      box-sizing: border-box;

      width: 100%;
      min-width: 0;

      border: 1px solid #d0c6bc;
      border-radius: 6px;

      overflow: hidden;

      background: rgba(255,255,255,.18);
    }

    .dr-contact-editor:focus-within {
      border-color: #8b786b;
    }

    /* TOOLBAR */

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
      border-radius: 3px;

      background: transparent;

      color: #493a30;

      cursor: pointer;

      font-family: Georgia, serif;
      font-size: 19px;
    }

    .dr-contact-toolbar button:hover {
      background: rgba(135,115,100,.12);
    }

    .dr-contact-toolbar button svg {
      display: block;
      width: 19px;
      height: 19px;
      margin: 0 auto;
      color: #493a30;
    }

    .dr-contact-toolbar-separator {
      width: 1px;
      height: 24px;

      margin: 0 7px;

      background: #d8cec4;
    }

    /* MESSAGE AREA */

    .dr-contact-message-wrap {
      position: relative;

      display: flex;
      align-items: flex-start;

      box-sizing: border-box;

      width: 100%;
      min-width: 0;

      min-height: 235px;

      padding:
        19px
        19px
        20px;

      gap: 15px;
    }

    .dr-contact-pencil {
      display: inline-flex;
      align-items: center;
      justify-content: center;

      flex: none;

      color: #51463e;
    }

    .dr-contact-pencil svg {
      display: block;

      width: 23px;
      height: 23px;
    }

    /* =====================================================
       MESSAGE TYPOGRAPHY
       ===================================================== */

    .dr-contact-message {
      display: block;

      flex: 1 1 auto;

      min-width: 0;
      min-height: 195px;

      outline: 0;
      overflow-wrap: anywhere;

      font-family:
        "Avenir Next",
        "Helvetica Neue",
        Arial,
        sans-serif;

      font-size: 15px;
      font-weight: 400;
      line-height: 1.56;
      letter-spacing: normal;

      color: #9d8873;
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

    /* =====================================================
       FORM FOOTER
       ===================================================== */

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

    /* SEND BUTTON */

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

      font-family:
        "Avenir Next",
        Arial,
        sans-serif;

      font-size: 11px;
      font-weight: 500;

      letter-spacing: .17em;

      cursor: pointer;

      transition:
        background .2s ease;
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

    /* =====================================================
       STATUS / SUCCESS
       ===================================================== */

    .dr-contact-status {
      margin-top: 15px;
      min-height: 20px;

      font-family:
        "Avenir Next",
        Arial,
        sans-serif;

      font-size: 12px;
      line-height: 1.5;

      color: #655d56;
    }

    .dr-contact-status.is-error {
      color: #9a3d34;
    }

    .dr-contact-success {
      display: none;

      padding:
        45px
        0
        20px;

      text-align: left;
    }

    .dr-contact-success h3 {
      font-family:
        Didot,
        "Bodoni 72",
        Georgia,
        serif;

      font-size: 40px;
      font-weight: 400;

      margin: 0 0 15px;

      color: #51463e;
    }

    .dr-contact-success p {
      font-family: Georgia, serif;

      font-size: 17px;
      line-height: 1.6;

      color: #625b55;
    }

    .dr-contact-dialog.is-success
    .dr-contact-form-content {
      display: none;
    }

    .dr-contact-dialog.is-success
    .dr-contact-success {
      display: block;
    }

    /* =====================================================
       DISCARD MESSAGE CONFIRMATION
       ===================================================== */

    .dr-contact-confirmation {
      display: none;

      padding:
        43px
        0
        25px;

      text-align: left;
    }

    .dr-contact-confirmation h3 {
      margin: 0 0 15px;

      font-family:
        Didot,
        "Bodoni 72",
        Georgia,
        serif;

      font-size:
        clamp(
          34px,
          5vw,
          43px
        );

      font-weight: 400;
      line-height: 1.15;
      letter-spacing: -.025em;

      color: #9d8873;
    }

    .dr-contact-confirmation p {
      max-width: 450px;

      margin: 0 0 32px;

      font-family: Georgia, serif;

      font-size: 17px;
      line-height: 1.55;

      color: #625b55;
    }

    .dr-contact-confirmation-actions {
      display: flex;
      align-items: center;

      gap: 12px;
    }

    .dr-contact-keep,
    .dr-contact-discard {
      min-height: 51px;

      padding: 12px 21px;

      font-family:
        "Avenir Next",
        Arial,
        sans-serif;

      font-size: 10px;
      font-weight: 500;
      letter-spacing: .13em;

      cursor: pointer;

      transition:
        background-color .25s ease,
        border-color .25s ease;
    }

    .dr-contact-keep {
      background: #8b786b;

      border: 1px solid #8b786b;

      color: #fffaf5;
    }

    .dr-contact-keep:hover {
      background: #746256;
    }

    .dr-contact-discard {
      background: transparent;

      border: 1px solid #d0c6bc;

      color: #51463e;
    }

    .dr-contact-discard:hover {
      background: rgba(135,115,100,.07);
    }

    .dr-contact-dialog.is-confirming
    .dr-contact-form-content {
      display: none;
    }

    .dr-contact-dialog.is-confirming
    .dr-contact-success {
      display: none;
    }

    .dr-contact-dialog.is-confirming
    .dr-contact-confirmation {
      display: block;
    }

    /* =====================================================
       SHORT DESKTOP / LAPTOP VIEWPORTS
       ===================================================== */

    @media (min-width: 761px) and (max-height: 850px) {

      .dr-contact-overlay {
        padding-top: 14px;
        padding-bottom: 14px;
      }

      .dr-contact-dialog {
        max-height: calc(100dvh - 28px);

        padding:
          31px
          43px
          22px;
      }

      .dr-contact-close {
        top: 13px;
        right: 17px;
      }

      .dr-contact-eyebrow {
        margin-bottom: 7px;
      }

      .dr-contact-title {
        font-size: 45px;
        margin-bottom: 5px;
      }

      .dr-contact-intro {
        font-size: 15.5px;
        line-height: 1.4;
        margin-bottom: 17px;
      }

      .dr-contact-field {
        height: 49px;
        margin-bottom: 8px;
      }

      .dr-contact-field-icon {
        flex-basis: 52px;
      }

      .dr-contact-field-icon svg {
        width: 21px;
        height: 21px;
      }

      .dr-contact-divider {
        margin-top: 13px;
        margin-bottom: 13px;
      }

      .dr-contact-toolbar {
        min-height: 43px;
        padding-top: 3px;
        padding-bottom: 3px;
      }

      .dr-contact-toolbar button {
        height: 32px;
      }

      .dr-contact-message-wrap {
        min-height: 168px;

        padding:
          15px
          18px
          15px;
      }

      .dr-contact-message {
        min-height: 138px;
      }

      .dr-contact-footer {
        margin-top: 18px;
      }

      .dr-contact-monogram {
        width: 58px;
      }

      .dr-contact-submit {
        min-height: 48px;
      }

      .dr-contact-status {
        margin-top: 9px;
        min-height: 16px;
      }

    }

    /* =====================================================
       EXTRA-SHORT DESKTOP VIEWPORTS
       ===================================================== */

    @media (min-width: 761px) and (max-height: 720px) {

      .dr-contact-overlay {
        padding-top: 10px;
        padding-bottom: 10px;
      }

      .dr-contact-dialog {
        max-height: calc(100dvh - 20px);

        padding:
          25px
          39px
          17px;
      }

      .dr-contact-close {
        top: 9px;
      }

      .dr-contact-eyebrow {
        margin-bottom: 5px;
      }

      .dr-contact-title {
        font-size: 40px;
        margin-bottom: 3px;
      }

      .dr-contact-intro {
        font-size: 14px;
        line-height: 1.35;
        margin-bottom: 12px;
      }

      .dr-contact-field {
        height: 44px;
        margin-bottom: 6px;
      }

      .dr-contact-divider {
        margin-top: 9px;
        margin-bottom: 9px;
      }

      .dr-contact-toolbar {
        min-height: 39px;
        padding-top: 2px;
        padding-bottom: 2px;
      }

      .dr-contact-toolbar button {
        height: 30px;
      }

      .dr-contact-message-wrap {
        min-height: 125px;

        padding:
          12px
          17px
          12px;
      }

      .dr-contact-message {
        min-height: 101px;
      }

      .dr-contact-footer {
        margin-top: 13px;
      }

      .dr-contact-monogram {
        width: 51px;
      }

      .dr-contact-submit {
        min-height: 44px;
      }

      .dr-contact-status {
        margin-top: 6px;
        min-height: 14px;
      }

    }

    /* =====================================================
       MOBILE
       ===================================================== */

    @media (max-width: 760px) {

      .header {
        gap: 12px;
      }

      .brand {
        min-width: 0;
        flex: 1 1 auto;
      }

      .dr-contact-header {
        display: flex;
        align-items: flex-start;
        justify-content: flex-end;

        flex: 0 0 auto;
        gap: 0;
      }

      .dr-contact-header .location {
        display: none;
      }

      /* MOBILE MODAL — KEYBOARD-AWARE VIEWPORT */

      .dr-contact-overlay {
        position: fixed;

        top: var(--dr-viewport-top, 0px);
        left: var(--dr-viewport-left, 0px);

        right: auto;
        bottom: auto;

        width: var(--dr-viewport-width, 100%);
        height: var(--dr-viewport-height, 100dvh);

        max-width: none;

        box-sizing: border-box;

        padding: 12px;

        display: flex;

        align-items: flex-start;
        justify-content: center;

        overflow: hidden;
      }

      .dr-contact-dialog {
        box-sizing: border-box;

        width: 100%;
        max-width: 100%;
        min-width: 0;

        max-height: 100%;

        overflow-x: hidden;
        overflow-y: auto;

        -webkit-overflow-scrolling: touch;

        overscroll-behavior-y: contain;

        scroll-padding-top: 18px;
        scroll-padding-bottom: 24px;

        padding:
          39px
          23px
          23px;

        transform: none !important;

        opacity: 0;

        transition:
          opacity 1.1s
          cubic-bezier(.22,.61,.36,1) !important;
      }

      .dr-contact-overlay.is-open .dr-contact-dialog {
        transform: none !important;
      }

      .dr-contact-title {
        font-size:
          clamp(
            34px,
            9vw,
            45px
          );
      }

      .dr-contact-intro {
        font-size: 15px;
      }

      /* MOBILE INPUTS — IOS FOCUS ZOOM */

      .dr-contact-field {
        height: 53px;
      }

      .dr-contact-field input,
      .dr-contact-field input:focus {
        font-size: 16px !important;

        -webkit-text-size-adjust: 100%;
        text-size-adjust: 100%;
      }

      .dr-contact-field-icon {
        flex-basis: 51px;
      }

      .dr-contact-field-icon svg {
        width: 21px;
        height: 21px;
      }

      /* MOBILE MESSAGE EDITOR */

      .dr-contact-editor,
      .dr-contact-message-wrap {
        box-sizing: border-box;

        width: 100%;
        min-width: 0;
        max-width: 100%;
      }

      .dr-contact-message-wrap {
        min-height: 215px;
      }

      .dr-contact-message {
        display: block;

        flex: 1 1 auto;

        min-width: 0;
        min-height: 175px;

        font-family:
          "Avenir Next",
          "Helvetica Neue",
          Arial,
          sans-serif;

        font-size: 17px !important;
        font-weight: 400;
        line-height: 1.56;

        color: #9d8873;

        -webkit-text-size-adjust: 100%;
        text-size-adjust: 100%;

        outline: none;

        overflow-wrap: anywhere;
        word-break: normal;
      }

      .dr-contact-message:focus {
        font-size: 17px !important;
      }

      .dr-contact-message * {
        font-size: inherit !important;
      }

      /* TOOLBAR */

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

      /* FORM FOOTER */

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

      /* DISCARD CONFIRMATION */

      .dr-contact-confirmation {
        padding:
          32px
          0
          20px;
      }

      .dr-contact-confirmation-actions {
        flex-direction: column;
        align-items: stretch;
      }

      .dr-contact-keep,
      .dr-contact-discard {
        width: 100%;
      }

    }

    /* =====================================================
       VERY NARROW MOBILE
       ===================================================== */

    @media (max-width: 390px) {

      .dr-contact-dialog {
        padding-left: 18px;
        padding-right: 18px;
      }

    }

    /* =====================================================
       REDUCED MOTION
       ===================================================== */

    @media (prefers-reduced-motion: reduce) {

      .dr-contact-overlay,
      .dr-contact-dialog,
      .dr-contact-trigger,
      .dr-contact-trigger::before {
        transition: none !important;
      }

    }

    /* =====================================================
       UNIVERSAL TYPOGRAPHY — SELF-HOSTED FONTS
       ===================================================== */

    /* GFS DIDOT — HEADINGS */

    .dr-contact-title,
    .dr-contact-success h3,
    .dr-contact-confirmation h3 {
      font-family:
        "DR Didot",
        Didot,
        "Bodoni 72",
        Georgia,
        serif;
    }

    /* AVENIR NEXT — FORM TEXT */

    .dr-contact-eyebrow,
    .dr-contact-field input,
    .dr-contact-message,
    .dr-contact-submit,
    .dr-contact-status,
    .dr-contact-keep,
    .dr-contact-discard {
      font-family:
        "DR Avenir Next",
        "Avenir Next",
        "Helvetica Neue",
        Arial,
        sans-serif;
    }

    /* AVENIR NEXT — MOBILE MESSAGE EDITOR */

    @media (max-width: 760px) {

      .dr-contact-message {
        font-family:
          "DR Avenir Next",
          "Avenir Next",
          "Helvetica Neue",
          Arial,
          sans-serif;
      }

    }

  `;

  const styleElement =
    document.createElement("style");

  styleElement.textContent = styles;

  document.head.appendChild(styleElement);

  /* =========================================================
     HEADER — ENVELOPE BUTTON
     ========================================================= */

  const header =
    document.querySelector(".header");

  const location =
    document.querySelector(".header .location");

  if (header && location) {

    const headerGroup =
      document.createElement("div");

    headerGroup.className =
      "dr-contact-header";

    const headerButton =
      document.createElement("button");

    headerButton.type = "button";

    headerButton.className =
      "dr-contact-trigger";

    headerButton.setAttribute(
      "aria-label",
      "Get in touch"
    );

    headerButton.setAttribute(
      "data-dr-contact-open",
      ""
    );

    headerButton.setAttribute(
      "aria-haspopup",
      "dialog"
    );

    headerButton.innerHTML = `
      <span class="dr-contact-mail" aria-hidden="true">
        ${icons.envelope}
      </span>
    `;

    location.parentNode.insertBefore(
      headerGroup,
      location
    );

    headerGroup.appendChild(headerButton);
    headerGroup.appendChild(location);

  }

  /* =========================================================
     MODAL HTML
     ========================================================= */

  const overlay =
    document.createElement("div");

  overlay.className =
    "dr-contact-overlay";

  overlay.id =
    "dr-contact-overlay";

  overlay.setAttribute(
    "aria-hidden",
    "true"
  );

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
      >
        &times;
      </button>

      <div class="dr-contact-form-content">

        <div class="dr-contact-eyebrow">
          A MESSAGE TO DOMINIC
        </div>

        <h2
          class="dr-contact-title"
          id="dr-contact-title"
        >
          Get in Touch

          <span
            class="dr-contact-ornament"
            aria-hidden="true"
          >❧</span>
        </h2>

        <p class="dr-contact-intro">
          Whether it’s a question, a project, a recommendation,
          or simply a message to share — I’d love to hear from you.
        </p>

        <form
          id="dr-contact-form"
          autocomplete="off"
          novalidate
        >

          <!-- NAME -->

          <label class="dr-contact-field">

            <span
              class="dr-contact-field-icon"
              aria-hidden="true"
            >
              ${icons.person}
            </span>

            <input
              name="name"
              type="text"
              placeholder="Your name"
              aria-label="Your name"
              autocomplete="off"
              required
              maxlength="150"
            >

          </label>

          <!-- EMAIL -->

          <label class="dr-contact-field">

            <span
              class="dr-contact-field-icon"
              aria-hidden="true"
            >
              ${icons.envelope}
            </span>

            <input
              name="email"
              type="email"
              placeholder="Your email"
              aria-label="Your email"
              autocomplete="off"
              required
              maxlength="254"
            >

          </label>

          <!-- SUBJECT -->

          <label class="dr-contact-field">

            <span
              class="dr-contact-field-icon"
              aria-hidden="true"
            >
              ${icons.tag}
            </span>

            <input
              name="subject"
              type="text"
              placeholder="Subject"
              aria-label="Subject"
              autocomplete="off"
              required
              maxlength="200"
            >

          </label>

          <div
            class="dr-contact-divider"
            aria-hidden="true"
          ></div>

          <!-- MESSAGE EDITOR -->

          <div class="dr-contact-editor">

            <div
              class="dr-contact-toolbar"
              role="toolbar"
              aria-label="Message formatting"
            >

              <button
                type="button"
                data-format="bold"
                aria-label="Bold"
              >
                <strong>B</strong>
              </button>

              <button
                type="button"
                data-format="italic"
                aria-label="Italic"
              >
                <em>I</em>
              </button>

              <button
                type="button"
                data-format="underline"
                aria-label="Underline"
              >
                <u>U</u>
              </button>

              <span
                class="dr-contact-toolbar-separator"
                aria-hidden="true"
              ></span>

              <button
                type="button"
                data-format="list"
                aria-label="Bulleted list"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="19"
                  height="19"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="4" cy="6" r="1" fill="currentColor" stroke="none"/>
                  <circle cx="4" cy="12" r="1" fill="currentColor" stroke="none"/>
                  <circle cx="4" cy="18" r="1" fill="currentColor" stroke="none"/>

                  <path d="M9 6h11"/>
                  <path d="M9 12h11"/>
                  <path d="M9 18h11"/>
                </svg>
              </button>

              <button
                type="button"
                data-format="link"
                aria-label="Insert link"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="19"
                  height="19"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <path d="M10 13.5a5 5 0 0 0 7.07 0l2.12-2.12a5 5 0 0 0-7.07-7.07L10.9 5.53"/>
                  <path d="M14 10.5a5 5 0 0 0-7.07 0L4.81 12.62a5 5 0 0 0 7.07 7.07l1.22-1.22"/>
                </svg>
              </button>

            </div>

            <div class="dr-contact-message-wrap">

              <span
                class="dr-contact-pencil"
                aria-hidden="true"
              >
                ${icons.pencil}
              </span>

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

          <!-- FOOTER -->

          <div class="dr-contact-footer">

            <img
              class="dr-contact-monogram"
              src="dr-reveals-removebg-preview.png"
              alt=""
              aria-hidden="true"
            >

            <button
              class="dr-contact-submit"
              type="submit"
            >

              <span>
                SEND MESSAGE
              </span>

              <span
                class="dr-contact-arrow"
                aria-hidden="true"
              >
                →
              </span>

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

      <!-- SUCCESS MESSAGE -->

      <div
        class="dr-contact-success"
        role="status"
      >

        <h3>
          Message Sent ❧
        </h3>

        <p>
          Thank you for reaching out.
          Your message has been received,
          and I look forward to reading it.
        </p>

      </div>

      <!-- DISCARD MESSAGE CONFIRMATION -->

      <div
        class="dr-contact-confirmation"
        role="group"
        aria-labelledby="dr-contact-confirm-title"
        aria-describedby="dr-contact-confirm-description"
      >

        <h3 id="dr-contact-confirm-title">
          Discard your message?
        </h3>

        <p id="dr-contact-confirm-description">
          Are you sure you want to leave?
          Your message hasn't been sent,
          and your changes will be lost.
        </p>

        <div class="dr-contact-confirmation-actions">

          <button
            class="dr-contact-keep"
            type="button"
          >
            KEEP WRITING
          </button>

          <button
            class="dr-contact-discard"
            type="button"
          >
            DISCARD MESSAGE
          </button>

        </div>

      </div>

    </section>

  `;

  document.body.appendChild(overlay);

  /* =========================================================
     ELEMENT REFERENCES
     ========================================================= */

  const dialog =
    overlay.querySelector(".dr-contact-dialog");

  const closeButton =
    overlay.querySelector(".dr-contact-close");

  const form =
    overlay.querySelector("#dr-contact-form");

  const editor =
    overlay.querySelector("#dr-contact-message");

  const status =
    overlay.querySelector("#dr-contact-status");

  const submitButton =
    overlay.querySelector(".dr-contact-submit");

  const toolbar =
    overlay.querySelector(".dr-contact-toolbar");

  const confirmation =
    overlay.querySelector(".dr-contact-confirmation");

  const keepWritingButton =
    overlay.querySelector(".dr-contact-keep");

  const discardMessageButton =
    overlay.querySelector(".dr-contact-discard");

  const formContent =
    overlay.querySelector(".dr-contact-form-content");

  const successContent =
    overlay.querySelector(".dr-contact-success");

  /* =========================================================
     AUTOCOMPLETE SUPPRESSION
     ========================================================= */

  form.setAttribute(
    "autocomplete",
    "off"
  );

  form
    .querySelectorAll("input")
    .forEach(input => {

      input.setAttribute(
        "autocomplete",
        "off"
      );

    });

  /* =========================================================
     STATE
     ========================================================= */

  let previousFocus = null;
  let previousFormFocus = null;

  let fieldScrollTimer = null;
  let fieldScrollFrame = null;

  let modalOpen = false;
  let confirmationOpen = false;
  let submissionSucceeded = false;

  let closeTimer = null;

  let savedScrollX = 0;
  let savedScrollY = 0;

  let previousBodyStyles = null;
  let previousHtmlOverflow = "";

  let previousDialogScroll = 0;

  /* =========================================================
     DETECT UNFINISHED MESSAGE
     ========================================================= */

  function hasUnfinishedMessage() {

    const name =
      form.elements.name.value.trim();

    const email =
      form.elements.email.value.trim();

    const subject =
      form.elements.subject.value.trim();

    const message =
      editor.textContent.trim();

    return Boolean(
      name ||
      email ||
      subject ||
      message
    );

  }

  /* =========================================================
     RESET CONTACT FORM
     ========================================================= */

  function resetContactForm() {

    form.reset();

    editor.innerHTML = "";

    status.textContent = "";

    status.classList.remove(
      "is-error"
    );

    submissionSucceeded = false;

  }

  /* =========================================================
     MOBILE — VIEWPORT MANAGEMENT
     ========================================================= */

  function isMobileContact() {

    return window.matchMedia(
      "(max-width: 760px)"
    ).matches;

  }

  function syncContactViewport() {

    if (!isMobileContact()) {

      overlay.style.removeProperty(
        "--dr-viewport-top"
      );

      overlay.style.removeProperty(
        "--dr-viewport-left"
      );

      overlay.style.removeProperty(
        "--dr-viewport-width"
      );

      overlay.style.removeProperty(
        "--dr-viewport-height"
      );

      return;

    }

    const viewport =
      window.visualViewport;

    if (!viewport) {
      return;
    }

    overlay.style.setProperty(
      "--dr-viewport-top",
      `${viewport.offsetTop}px`
    );

    overlay.style.setProperty(
      "--dr-viewport-left",
      `${viewport.offsetLeft}px`
    );

    overlay.style.setProperty(
      "--dr-viewport-width",
      `${viewport.width}px`
    );

    overlay.style.setProperty(
      "--dr-viewport-height",
      `${viewport.height}px`
    );

  }

  /* =========================================================
     MOBILE — IDENTIFY ACTIVE FIELD
     ========================================================= */

  function getActiveContactField() {

    const active =
      document.activeElement;

    if (active === editor) {
      return editor;
    }

    if (
      active &&
      active.matches &&
      active.matches(
        ".dr-contact-field input"
      )
    ) {
      return active;
    }

    return null;

  }

  /* =========================================================
     MOBILE — FIND MESSAGE CURSOR
     ========================================================= */

  function getEditorCaretRect() {

    const selection =
      window.getSelection();

    if (
      !selection ||
      !selection.rangeCount ||
      !editor.contains(selection.anchorNode)
    ) {
      return null;
    }

    const range =
      selection.getRangeAt(0).cloneRange();

    range.collapse(false);

    const rect =
      range.getBoundingClientRect();

    if (
      rect &&
      rect.height > 0
    ) {
      return rect;
    }

    const rects =
      range.getClientRects();

    return rects.length
      ? rects[0]
      : null;

  }

  /* =========================================================
     MOBILE — SCROLL ACTIVE FIELD INTO VIEW
     ========================================================= */

  function scrollActiveContactField() {

    if (
      !isMobileContact() ||
      !modalOpen ||
      confirmationOpen
    ) {
      return;
    }

    const active =
      getActiveContactField();

    if (!active) {
      return;
    }

    const dialogRect =
      dialog.getBoundingClientRect();

    const visibleTop =
      dialogRect.top + 18;

    const visibleBottom =
      dialogRect.bottom - 22;

    const availableHeight =
      visibleBottom - visibleTop;

    if (availableHeight <= 0) {
      return;
    }

    let targetTop;
    let targetBottom;

    if (active === editor) {

      const editorRect =
        editor.getBoundingClientRect();

      const caretRect =
        getEditorCaretRect();

      if (
        caretRect &&
        editor.innerText.trim()
      ) {

        targetTop =
          caretRect.top;

        targetBottom =
          caretRect.bottom;

      }

      else {

        targetTop =
          editorRect.top;

        targetBottom =
          editorRect.top + 85;

      }

    }

    else {

      const field =
        active.closest(
          ".dr-contact-field"
        );

      if (!field) {
        return;
      }

      const fieldRect =
        field.getBoundingClientRect();

      targetTop =
        fieldRect.top;

      targetBottom =
        fieldRect.bottom;

    }

    const contextSpace =
      active === editor
        ? Math.min(
            95,
            Math.max(
              22,
              availableHeight * 0.30
            )
          )
        : 14;

    const preferredBottom =
      visibleBottom - contextSpace;

    const preferredTop =
      visibleTop + 14;

    let scrollAmount = 0;

    if (
      targetBottom > preferredBottom
    ) {

      scrollAmount =
        targetBottom - preferredBottom;

    }

    else if (
      targetTop < preferredTop
    ) {

      scrollAmount =
        targetTop - preferredTop;

    }

    if (
      Math.abs(scrollAmount) > 1
    ) {

      dialog.scrollTop +=
        scrollAmount;

    }

  }

  /* =========================================================
     MOBILE — SCHEDULE FIELD SCROLLING
     ========================================================= */

  function scheduleContactFieldScroll(
    delay = 60
  ) {

    if (fieldScrollTimer !== null) {

      clearTimeout(
        fieldScrollTimer
      );

    }

    fieldScrollTimer =
      window.setTimeout(
        () => {

          fieldScrollTimer = null;

          if (
            fieldScrollFrame !== null
          ) {

            cancelAnimationFrame(
              fieldScrollFrame
            );

          }

          fieldScrollFrame =
            requestAnimationFrame(
              () => {

                fieldScrollFrame = null;

                syncContactViewport();

                scrollActiveContactField();

              }
            );

        },
        delay
      );

  }

  /* =========================================================
     MOBILE — KEYBOARD / VIEWPORT CHANGES
     ========================================================= */

  function handleContactViewportChange() {

    if (!modalOpen) {
      return;
    }

    syncContactViewport();

    if (
      !confirmationOpen &&
      getActiveContactField()
    ) {

      scheduleContactFieldScroll(
        70
      );

    }

  }

  if (window.visualViewport) {

    window.visualViewport.addEventListener(
      "resize",
      handleContactViewportChange
    );

    window.visualViewport.addEventListener(
      "scroll",
      handleContactViewportChange
    );

  }

  window.addEventListener(
    "resize",
    handleContactViewportChange
  );

  window.addEventListener(
    "orientationchange",
    handleContactViewportChange
  );

  /* =========================================================
     MOBILE — FOCUS MANAGEMENT
     ========================================================= */

  dialog.addEventListener(
    "focusin",
    event => {

      if (
        !event.target.matches(
          "input, [contenteditable='true']"
        )
      ) {
        return;
      }

      if (confirmationOpen) {
        return;
      }

      scheduleContactFieldScroll(
        80
      );

      window.setTimeout(
        () => {

          if (
            modalOpen &&
            !confirmationOpen
          ) {

            syncContactViewport();

            scrollActiveContactField();

          }

        },
        420
      );

    }
  );

  /* =========================================================
     MOBILE — FOLLOW MESSAGE WHILE TYPING
     ========================================================= */

  editor.addEventListener(
    "input",
    () => {

      scheduleContactFieldScroll(
        40
      );

    }
  );

  editor.addEventListener(
    "keyup",
    () => {

      scheduleContactFieldScroll(
        40
      );

    }
  );

  editor.addEventListener(
    "click",
    () => {

      scheduleContactFieldScroll(
        60
      );

    }
  );

  /* =========================================================
     PAGE SCROLL LOCK
     ========================================================= */

  function lockBackgroundScroll() {

    savedScrollX =
      window.scrollX ||
      window.pageXOffset ||
      0;

    savedScrollY =
      window.scrollY ||
      window.pageYOffset ||
      0;

    previousBodyStyles = {
      position:
        document.body.style.position,

      top:
        document.body.style.top,

      left:
        document.body.style.left,

      right:
        document.body.style.right,

      width:
        document.body.style.width,

      overflow:
        document.body.style.overflow
    };

    previousHtmlOverflow =
      document.documentElement.style.overflow;

    document.body.style.position =
      "fixed";

    document.body.style.top =
      `-${savedScrollY}px`;

    document.body.style.left =
      `-${savedScrollX}px`;

    document.body.style.right =
      "0";

    document.body.style.width =
      "100%";

    document.body.style.overflow =
      "hidden";

    document.documentElement.style.overflow =
      "hidden";

  }

  function restoreBackgroundScroll() {

    if (!previousBodyStyles) {
      return;
    }

    document.body.style.position =
      previousBodyStyles.position;

    document.body.style.top =
      previousBodyStyles.top;

    document.body.style.left =
      previousBodyStyles.left;

    document.body.style.right =
      previousBodyStyles.right;

    document.body.style.width =
      previousBodyStyles.width;

    document.body.style.overflow =
      previousBodyStyles.overflow;

    document.documentElement.style.overflow =
      previousHtmlOverflow;

    window.scrollTo({
      left: savedScrollX,
      top: savedScrollY,
      behavior: "instant"
    });

    previousBodyStyles = null;

  }

  /* =========================================================
     OPEN CONTACT MODAL
     ========================================================= */

  function openContact(event) {

    if (event) {
      event.preventDefault();
    }

    if (modalOpen) {
      return;
    }

    if (closeTimer !== null) {

      clearTimeout(
        closeTimer
      );

      closeTimer = null;

      /*
        If the previous close was interrupted,
        restore the previous scroll lock first.
      */

      restoreBackgroundScroll();

    }

    modalOpen = true;

    previousFocus =
      document.activeElement;

    confirmationOpen = false;

    /*
      Every newly opened contact form begins
      with a blank message.
    */

    resetContactForm();

    dialog.classList.remove(
      "is-success",
      "is-confirming"
    );

    dialog.scrollTop = 0;

    lockBackgroundScroll();

    syncContactViewport();

    overlay.setAttribute(
      "aria-hidden",
      "false"
    );

    /*
      Force the hidden state to render before adding
      is-open. This keeps the entrance transition clean
      and independent from keyboard viewport changes.
    */

    void overlay.offsetWidth;

    requestAnimationFrame(() => {

      requestAnimationFrame(() => {

        if (modalOpen) {

          overlay.classList.add(
            "is-open"
          );

        }

      });

    });

    requestAnimationFrame(
      () => {

        if (modalOpen) {

          closeButton.focus({
            preventScroll: true
          });

        }

      }
    );

  }

  /* =========================================================
     SHOW DISCARD CONFIRMATION
     ========================================================= */

  function showDiscardConfirmation() {

    if (
      !modalOpen ||
      confirmationOpen ||
      submissionSucceeded
    ) {
      return;
    }

    confirmationOpen = true;

    previousFormFocus =
      document.activeElement;

    previousDialogScroll =
      dialog.scrollTop;

    /*
      Close the mobile keyboard before displaying
      the confirmation.
    */

    if (
      previousFormFocus &&
      overlay.contains(previousFormFocus) &&
      typeof previousFormFocus.blur === "function"
    ) {

      previousFormFocus.blur();

    }

    /*
      Temporarily hide the form without removing it.

      This preserves every field value and all
      rich-text formatting.
    */

    dialog.classList.add(
      "is-confirming"
    );

    formContent.setAttribute(
      "aria-hidden",
      "true"
    );

    confirmation.setAttribute(
      "role",
      "alertdialog"
    );

    dialog.scrollTop = 0;

    syncContactViewport();

    keepWritingButton.focus({
      preventScroll: true
    });

  }

  /* =========================================================
     KEEP WRITING
     ========================================================= */

  function keepWriting() {

    if (!confirmationOpen) {
      return;
    }

    confirmationOpen = false;

    dialog.classList.remove(
      "is-confirming"
    );

    formContent.removeAttribute(
      "aria-hidden"
    );

    confirmation.setAttribute(
      "role",
      "group"
    );

    /*
      Restore the form's previous scroll position.
    */

    dialog.scrollTop =
      previousDialogScroll;

    syncContactViewport();

    /*
      Return focus to the previous field.

      No form values or formatting are changed.
    */

    requestAnimationFrame(() => {

      if (
        !modalOpen ||
        confirmationOpen
      ) {
        return;
      }

      if (
        previousFormFocus &&
        previousFormFocus.isConnected &&
        typeof previousFormFocus.focus === "function"
      ) {

        previousFormFocus.focus({
          preventScroll: true
        });

      } else {

        closeButton.focus({
          preventScroll: true
        });

      }

    });

  }

  /* =========================================================
     DISCARD MESSAGE
     ========================================================= */

  function discardMessage() {

    if (!confirmationOpen) {
      return;
    }

    confirmationOpen = false;

    dialog.classList.remove(
      "is-confirming"
    );

    formContent.removeAttribute(
      "aria-hidden"
    );

    confirmation.setAttribute(
      "role",
      "group"
    );

    /*
      The visitor has explicitly chosen to
      discard their unfinished message.
    */

    resetContactForm();

    closeContact();

  }

  /* =========================================================
     REQUEST TO CLOSE CONTACT FORM
     ========================================================= */

  function requestContactClose() {

    if (!modalOpen) {
      return;
    }

    /*
      Do not dismiss the confirmation accidentally.
    */

    if (confirmationOpen) {
      return;
    }

    /*
      A successfully submitted message can
      close immediately.
    */

    if (submissionSucceeded) {

      closeContact();

      return;

    }

    /*
      Ask for confirmation whenever any field
      contains unsent information.
    */

    if (hasUnfinishedMessage()) {

      showDiscardConfirmation();

      return;

    }

    /*
      Empty forms close without interruption.
    */

    closeContact();

  }

  /* =========================================================
     CLOSE CONTACT MODAL
     ========================================================= */

  function closeContact() {

    if (!modalOpen) {
      return;
    }

    modalOpen = false;

    confirmationOpen = false;

    if (
      fieldScrollTimer !== null
    ) {

      clearTimeout(
        fieldScrollTimer
      );

      fieldScrollTimer = null;

    }

    if (
      fieldScrollFrame !== null
    ) {

      cancelAnimationFrame(
        fieldScrollFrame
      );

      fieldScrollFrame = null;

    }

    /*
      Blur any active form field first so the iPhone
      keyboard begins closing before the underlying page
      is restored.
    */

    const active =
      document.activeElement;

    if (
      active &&
      overlay.contains(active) &&
      typeof active.blur === "function"
    ) {

      active.blur();

    }

    overlay.classList.remove(
      "is-open"
    );

    overlay.setAttribute(
      "aria-hidden",
      "true"
    );

    /*
      Keep the page fixed until the closing transition
      finishes. Restoring the body too early is what can
      cause the underlying page to visibly jump.
    */

    closeTimer =
      window.setTimeout(
        () => {

          closeTimer = null;

          dialog.classList.remove(
            "is-confirming",
            "is-success"
          );

          formContent.removeAttribute(
            "aria-hidden"
          );

          confirmation.setAttribute(
            "role",
            "group"
          );

          /*
            Clear the closed form.

            There is no automatic draft storage.
          */

          resetContactForm();

          restoreBackgroundScroll();

          if (
            previousFocus &&
            typeof previousFocus.focus === "function"
          ) {

            previousFocus.focus({
              preventScroll: true
            });

          }

          /*
            Safari can perform a late scroll adjustment
            when focus returns. Reassert the original
            coordinates on the next paint.
          */

          requestAnimationFrame(
            () => {

              window.scrollTo({
                left: savedScrollX,
                top: savedScrollY,
                behavior: "instant"
              });

            }
          );

        },
        400
      );

  }

  /* =========================================================
     OPEN BUTTONS
     ========================================================= */

  document
    .querySelectorAll(
      "[data-dr-contact-open]"
    )
    .forEach(
      trigger => {

        trigger.addEventListener(
          "click",
          openContact
        );

      }
    );

  /* =========================================================
     CLOSE BUTTON
     ========================================================= */

  closeButton.addEventListener(
    "click",
    requestContactClose
  );

  /* =========================================================
     CONFIRMATION BUTTONS
     ========================================================= */

  keepWritingButton.addEventListener(
    "click",
    keepWriting
  );

  discardMessageButton.addEventListener(
    "click",
    discardMessage
  );

 /* =====================================================
   CLICK OUTSIDE STORY TO CLOSE
   ===================================================== */

document.addEventListener("click", event => {

  const viewer = getViewer();

  if (!viewer) return;

  const target = event.target;

  if (!(target instanceof Element)) return;

  /* Preserve miniature Highlight navigation */

  if (target.closest(".dr-mini-highlights")) {
    return;
  }

  /* Preserve SociableKIT navigation arrows */

  if (target.closest(".sk-story-nav-btn")) {
    return;
  }

  /* Preserve the existing close button */

  if (target.closest(".sk-story-close")) {
    return;
  }

  /* Clicking inside the video should not close it */

  if (target.closest(".sk-story-stage-wrap")) {
    return;
  }

  /* Clicking the surrounding area closes the viewer */

  closeViewer();

});

  /* =========================================================
     KEYBOARD SUPPORT
     ========================================================= */

  document.addEventListener(
    "keydown",
    event => {

      if (!modalOpen) {
        return;
      }

      /* ESCAPE */

      if (
        event.key === "Escape"
      ) {

        event.preventDefault();

        if (confirmationOpen) {

          /*
            Escape from the confirmation returns
            to the unfinished message.
          */

          keepWriting();

        } else {

          requestContactClose();

        }

        return;

      }

      /* TAB FOCUS MANAGEMENT */

      if (
        event.key === "Tab"
      ) {

        /*
          During confirmation, focus stays between
          Keep Writing and Discard Message.
        */

        const selector = confirmationOpen
          ? ".dr-contact-confirmation button:not([disabled])"
          : 'button:not([disabled]), input:not([disabled]), [contenteditable="true"], a[href]';

        const focusable =
          Array.from(
            dialog.querySelectorAll(
              selector
            )
          ).filter(
            element =>
              element.getClientRects().length
          );

        if (
          !focusable.length
        ) {
          return;
        }

        const first =
          focusable[0];

        const last =
          focusable[
            focusable.length - 1
          ];

        if (
          event.shiftKey &&
          document.activeElement === first
        ) {

          event.preventDefault();

          last.focus();

        }

        else if (
          !event.shiftKey &&
          document.activeElement === last
        ) {

          event.preventDefault();

          first.focus();

        }

      }

    }
  );

  /* =========================================================
     RICH TEXT FORMATTING
     ========================================================= */

  toolbar.addEventListener(
    "mousedown",
    event => {

      if (
        event.target.closest(
          "button"
        )
      ) {

        event.preventDefault();

      }

    }
  );

  toolbar.addEventListener(
    "click",
    event => {

      const button =
        event.target.closest(
          "button[data-format]"
        );

      if (!button) {
        return;
      }

      const format =
        button.dataset.format;

      editor.focus({
        preventScroll: true
      });

      if (
        format === "bold"
      ) {

        document.execCommand(
          "bold",
          false,
          null
        );

      }

      if (
        format === "italic"
      ) {

        document.execCommand(
          "italic",
          false,
          null
        );

      }

      if (
        format === "underline"
      ) {

        document.execCommand(
          "underline",
          false,
          null
        );

      }

      if (
        format === "list"
      ) {

        document.execCommand(
          "insertUnorderedList",
          false,
          null
        );

      }

      if (
        format === "link"
      ) {

        const url =
          window.prompt(
            "Enter a link beginning with https://"
          );

        if (url) {

          try {

            const parsed =
              new URL(
                url.trim()
              );

            if (
              parsed.protocol === "https:" ||
              parsed.protocol === "http:"
            ) {

              document.execCommand(
                "createLink",
                false,
                parsed.href
              );

            }

          }

          catch (_) {

            /* Invalid links are ignored. */

          }

        }

      }

      scheduleContactFieldScroll(
        70
      );

    }
  );

  /* =========================================================
     FORMSPREE SUBMISSION
     ========================================================= */

  form.addEventListener(
    "submit",
    async event => {

      event.preventDefault();

      /*
        Prevent duplicate submissions while
        the current request is in progress.
      */

      if (submitButton.disabled) {
        return;
      }

      const name =
        form.elements.name.value.trim();

      const email =
        form.elements.email.value.trim();

      const subject =
        form.elements.subject.value.trim();

      const message =
        editor.innerText.trim();

      status.textContent = "";

      status.classList.remove(
        "is-error"
      );

      /* REQUIRED FIELDS */

      if (
        !name ||
        !email ||
        !subject ||
        !message
      ) {

        status.textContent =
          "Please complete all fields before sending.";

        status.classList.add(
          "is-error"
        );

        return;

      }

      /* EMAIL VALIDATION */

      if (
        !form.elements.email.checkValidity()
      ) {

        status.textContent =
          "Please enter a valid email address.";

        status.classList.add(
          "is-error"
        );

        return;

      }

      /* MESSAGE LENGTH */

      if (
        message.length > 20000
      ) {

        status.textContent =
          "Please shorten your message before sending.";

        status.classList.add(
          "is-error"
        );

        return;

      }

      submitButton.disabled = true;

      status.textContent =
        "Sending your message…";

      const payload = {
        name,
        email,
        _replyto: email,
        subject,
        message
      };

      try {

        const response =
          await fetch(
            FORMSPREE_URL,
            {

              method: "POST",

              headers: {

                "Content-Type":
                  "application/json",

                "Accept":
                  "application/json"

              },

              body:
                JSON.stringify(
                  payload
                )

            }
          );

        if (
          !response.ok
        ) {

          throw new Error(
            "Form submission failed."
          );

        }

        /*
          Formspree has confirmed successful submission.
        */

        submissionSucceeded = true;

        /*
          Close the software keyboard before showing the
          success state on mobile.
        */

        const active =
          document.activeElement;

        if (
          active &&
          overlay.contains(active) &&
          typeof active.blur === "function"
        ) {

          active.blur();

        }

        /*
          Clear the submitted fields.

          The success message is shown immediately.
          A new blank form appears the next time
          the visitor opens the contact modal.
        */

        form.reset();

        editor.innerHTML = "";

        confirmationOpen = false;

        dialog.classList.remove(
          "is-confirming"
        );

        dialog.classList.add(
          "is-success"
        );

        dialog.scrollTop = 0;

        syncContactViewport();

      }

      catch (error) {

        /*
          Keep all form values intact when submission
          fails so the visitor can retry.
        */

        status.textContent =
          "Your message couldn't be sent. Please try again.";

        status.classList.add(
          "is-error"
        );

      }

      finally {

        submitButton.disabled = false;

      }

    }
  );

})();
