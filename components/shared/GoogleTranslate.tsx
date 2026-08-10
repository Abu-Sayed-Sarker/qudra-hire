"use client";

import { useEffect, useState } from "react";

type Language = "en" | "ar";

function readActiveLanguage(): Language {
  if (typeof document === "undefined") return "en";
  const match = document.cookie.match(/(?:^|; )googtrans=([^;]+)/);
  if (!match) return "en";
  return decodeURIComponent(match[1]).endsWith("/ar") ? "ar" : "en";
}

export default function GoogleTranslate() {
  const [activeLanguage, setActiveLanguage] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setActiveLanguage(readActiveLanguage());
    setMounted(true);
  }, []);

  function setLanguage(lang: Language) {
    if (lang === activeLanguage) return;

    if (lang === "en") {
      document.cookie = "googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie =
        "googtrans=; path=/; domain=" +
        window.location.hostname +
        "; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    } else {
      document.cookie = "googtrans=/en/" + lang + "; path=/";
      document.cookie =
        "googtrans=/en/" + lang + "; path=/; domain=" + window.location.hostname;
    }

    setActiveLanguage(lang);
    // Google Translate requires a full reload to apply translation
    window.location.reload();
  }

  return (
    <div className="flex items-center gap-2" role="group" aria-label="Language selector">
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
        <span className="flex items-center gap-1 notranslate" translate="no">
          <span aria-hidden="true">🇬🇧</span>
          <span>EN</span>
        </span>
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
        <span className="flex items-center gap-1 notranslate" translate="no">
          <span aria-hidden="true">🇸🇦</span>
          <span>{activeLanguage === "ar" ? "ع" : "AR"}</span>
        </span>
        {activeLanguage === "ar" && mounted && (
          <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-white ring-1 ring-[#4BC957]" />
        )}
      </button>
    </div>
  );
}