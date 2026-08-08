"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google: any;
  }
}

type Language = "en" | "ar";

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Read the active language from the googtrans cookie. */
function readActiveLanguage(): Language {
  if (typeof document === "undefined") return "en";
  const match = document.cookie.match(/(?:^|; )googtrans=([^;]+)/);
  if (!match) return "en";
  return decodeURIComponent(match[1]).endsWith("/ar") ? "ar" : "en";
}

/** Apply dir + lang to the root <html> element and persist in localStorage. */
function applyDirection(lang: Language) {
  const dir = lang === "ar" ? "rtl" : "ltr";
  document.documentElement.setAttribute("dir", dir);
  document.documentElement.setAttribute("lang", lang);
  try {
    localStorage.setItem("qh-lang", lang);
  } catch (_) { }
}

/** Fully suppress every Google Translate UI element (banner, toolbar, etc.). */
function injectSuppressStyles() {
  const id = "gt-suppress-style";
  if (document.getElementById(id)) return;
  const style = document.createElement("style");
  style.id = id;
  style.textContent = `
    /* Hide Google Translate toolbar + iframe */
    .goog-te-banner-frame,
    .goog-te-balloon-frame,
    #goog-gt-tt,
    .goog-te-ftab,
    .goog-te-gadget-icon,
    .skiptranslate,
    #google_translate_element { display: none !important; }

    /* Undo the margin Google injects onto <body> */
    body { top: 0 !important; margin-top: 0 !important; }

    /* Prevent the "select text to translate" popup */
    .goog-te-balloon-frame { display: none !important; }
  `;
  document.head.appendChild(style);
}

/** Initialise the hidden Google Translate widget (needed to set the cookie). */
function initWidget() {
  const element = document.getElementById("google_translate_element");
  if (!element || element.childElementCount > 0) return;

  new window.google.translate.TranslateElement(
    {
      pageLanguage: "en",
      includedLanguages: "en,ar",
      layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
      autoDisplay: false,
    },
    "google_translate_element"
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function GoogleTranslate() {
  // Initialise as "en"; will be corrected on mount to avoid SSR mismatch.
  const [activeLanguage, setActiveLanguage] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  // ── On mount: read real language, apply direction, set up Google widget ──
  useEffect(() => {
    const lang = readActiveLanguage();
    setActiveLanguage(lang);
    // applyDirection(lang);
    setMounted(true);

    injectSuppressStyles();

    // Callback that Google calls once its script is ready
    window.googleTranslateElementInit = () => {
      initWidget();
    };

    // If the widget API is already loaded (hot-reload / navigation), init now
    if (window.google?.translate?.TranslateElement) {
      initWidget();
      return;
    }

    // Inject the Google script once
    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // ── Switch language ─────────────────────────────────────────────────────
  function setLanguage(lang: Language) {
    // Skip if already active — avoid an unnecessary reload
    if (lang === activeLanguage) return;

    if (lang === "en") {
      // Clear the cookie to go back to the original language
      document.cookie =
        "googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie =
        "googtrans=; path=/; domain=" +
        window.location.hostname +
        "; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    } else {
      // Set the googtrans cookie for the target language
      document.cookie = "googtrans=/en/" + lang + "; path=/";
      document.cookie =
        "googtrans=/en/" +
        lang +
        "; path=/; domain=" +
        window.location.hostname;
    }

    // applyDirection(lang);
    setActiveLanguage(lang);

    // Google Translate requires a full reload to re-translate the page
    window.location.reload();
  }

  // ── Render ────────────────────────────────────────────────────────────────
  // Hidden widget anchor (required by Google's API but visually hidden)
  return (
    <div className="flex items-center gap-2" role="group" aria-label="Language selector">
      {/* Hidden Google Translate mount point */}
      <div id="google_translate_element" className="hidden" aria-hidden="true" />

      {/* English button */}
      <button
        type="button"
        id="lang-btn-en"
        onClick={() => setLanguage("en")}
        disabled={!mounted}
        className={[
          "relative rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4BC957]/60",
          activeLanguage === "en"
            ? "border-[#4BC957] bg-[#4BC957] text-white shadow-sm shadow-[#4BC957]/30"
            : "border-surface bg-transparent text-on-surface-muted hover:text-on-surface hover:border-[#4BC957]/50",
        ].join(" ")}
        aria-pressed={activeLanguage === "en"}
        aria-label="Switch to English"
        title="English"
      >
        <span className="flex items-center gap-1">
          <span aria-hidden="true">🇬🇧</span>
          <span>EN</span>
        </span>
        {/* Active indicator dot */}
        {activeLanguage === "en" && mounted && (
          <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-white ring-1 ring-[#4BC957]" />
        )}
      </button>

      {/* Arabic button */}
      <button
        type="button"
        id="lang-btn-ar"
        onClick={() => setLanguage("ar")}
        disabled={!mounted}
        className={[
          "relative rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4BC957]/60",
          activeLanguage === "ar"
            ? "border-[#4BC957] bg-[#4BC957] text-white shadow-sm shadow-[#4BC957]/30"
            : "border-surface bg-transparent text-on-surface-muted hover:text-on-surface hover:border-[#4BC957]/50",
        ].join(" ")}
        aria-pressed={activeLanguage === "ar"}
        aria-label="Switch to Arabic"
        title="العربية"
      >
        <span className="flex items-center gap-1">
          <span aria-hidden="true">🇸🇦</span>
          {/* Show Arabic script label when AR is active for native speakers */}
          <span>{activeLanguage === "ar" ? "ع" : "AR"}</span>
        </span>
        {/* Active indicator dot */}
        {activeLanguage === "ar" && mounted && (
          <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-white ring-1 ring-[#4BC957]" />
        )}
      </button>
    </div>
  );
}