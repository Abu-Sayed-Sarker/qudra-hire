"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google: any;
  }
}

export default function GoogleTranslate() {
  const [activeLanguage, setActiveLanguage] = useState("en");

  function readActiveLanguage() {
    const match = document.cookie.match(/(?:^|; )googtrans=([^;]+)/);
    if (!match) return "en";

    return decodeURIComponent(match[1]).endsWith("/ar") ? "ar" : "en";
  }

  function clearTranslateCookie() {
    document.cookie = "googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }

  function setTranslateLanguage(language: "en" | "ar") {
    if (language === "en") {
      clearTranslateCookie();
    } else {
      document.cookie = "googtrans=/en/ar; path=/";
    }

    setActiveLanguage(language);
    window.location.reload();
  }

  useEffect(() => {
    setActiveLanguage(readActiveLanguage());

    window.googleTranslateElementInit = () => {
      const element = document.getElementById("google_translate_element");
      if (!element || element.childElementCount > 0) {
        return;
      }

      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,ar",
          layout:
            window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        "google_translate_element"
      );
    };

    if (window.google?.translate?.TranslateElement) {
      window.googleTranslateElementInit?.();
      return;
    }

    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }

    const style = document.createElement("style");
    style.textContent = `
      .goog-te-banner-frame, .goog-te-gadget-icon, .skiptranslate, .goog-te-ftab, #google_translate_element { display: none !important; }
      body { top: 0 !important; }
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <div className="flex items-center gap-2">
      <div id="google_translate_element" className="hidden" aria-hidden="true" />

      <button
        type="button"
        onClick={() => setTranslateLanguage("en")}
        className={[
          "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
          activeLanguage === "en"
            ? "border-[#4BC957] bg-[#4BC957] text-white"
            : "border-surface bg-transparent text-on-surface-muted hover:text-on-surface",
        ].join(" ")}
        aria-pressed={activeLanguage === "en"}
      >
        EN
      </button>

      <button
        type="button"
        onClick={() => setTranslateLanguage("ar")}
        className={[
          "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
          activeLanguage === "ar"
            ? "border-[#4BC957] bg-[#4BC957] text-white"
            : "border-surface bg-transparent text-on-surface-muted hover:text-on-surface",
        ].join(" ")}
        aria-pressed={activeLanguage === "ar"}
      >
        AR
      </button>
    </div>
  );
}