"use client";

/**
 * TranslationEngine — invisible component, mounted globally in root layout.
 *
 * PROBLEM SOLVED:
 * The GoogleTranslate UI buttons live inside QudraHeader, which is only
 * present on pages under app/(public)/. When the user navigates to /login
 * or /signup (outside the public layout), the header unmounts — and with it,
 * the component that re-triggers Google Translate on route changes.
 * Result: the new page renders in English even though the Arabic cookie is set.
 *
 * This component contains ONLY the logic (no visible UI) and is mounted in
 * the root layout so it persists across every page, including auth pages.
 */

import { useEffect } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google: any;
  }
}

type Language = "en" | "ar";

function readActiveLanguage(): Language {
  if (typeof document === "undefined") return "en";
  const match = document.cookie.match(/(?:^|; )googtrans=([^;]+)/);
  if (!match) return "en";
  return decodeURIComponent(match[1]).endsWith("/ar") ? "ar" : "en";
}

function applyDirection(lang: Language) {
  const dir = lang === "ar" ? "rtl" : "ltr";
  document.documentElement.setAttribute("dir", dir);
  document.documentElement.setAttribute("lang", lang);
  try {
    localStorage.setItem("qh-lang", lang);
  } catch (_) { }
}

function injectSuppressStyles() {
  const id = "gt-suppress-style";
  if (document.getElementById(id)) return;
  const style = document.createElement("style");
  style.id = id;
  style.textContent = `
    /* ── Hide all Google Translate UI: toolbar, banner, loading bar, iframes ── */

    /* Main toolbar iframe that sits at the top of the page */
    .goog-te-banner-frame,
    /* Balloon / tooltip popup */
    .goog-te-balloon-frame,
    /* The little floating tooltip box */
    #goog-gt-tt,
    /* Tab bar */
    .goog-te-ftab,
    /* Google G icon */
    .goog-te-gadget-icon,
    /* Any element marked as "skip translate" (includes toolbar wrappers) */
    .skiptranslate,
    /* Our hidden widget mount point */
    #google_translate_element,
    #google_translate_element_global,
    /* Loading spinner / progress container */
    .goog-te-spinner,
    .goog-te-spinner-pos,
    /* The top loading bar Google shows while translating */
    .VIpgJd-ZVi9od-l4eHX-hSRGPd,
    /* Loading overlay that sometimes dims the page */
    .VIpgJd-ZVi9od-vH1Gmf,
    /* Google's injected iframe */
    iframe.goog-te-menu-frame,
    iframe.skiptranslate { display: none !important; }

    /* Remove the margin/top offset Google pushes onto <body> */
    body {
      top: 0 !important;
      margin-top: 0 !important;
      min-height: 100% !important;
    }

    /* Kill Google's loading progress bar at the very top */
    .VIpgJd-ZVi9od-ORHb-OEVmcd { display: none !important; }
  `;
  document.head.appendChild(style);
}

function initWidget() {
  const element = document.getElementById("google_translate_element_global");
  if (!element || element.childElementCount > 0) return;
  new window.google.translate.TranslateElement(
    {
      pageLanguage: "en",
      includedLanguages: "en,ar",
      layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
      autoDisplay: false,
    },
    "google_translate_element_global"
  );
}

function retriggerTranslation(lang: Language) {
  const attempt = (tries: number) => {
    const select = document.querySelector<HTMLSelectElement>(".goog-te-combo");
    if (select) {
      select.value = lang;
      select.dispatchEvent(new Event("change"));
      return;
    }
    if (tries > 0) setTimeout(() => attempt(tries - 1), 100);
  };
  // Small initial delay so React finishes rendering the new route
  setTimeout(() => attempt(15), 150);
}

export default function TranslationEngine() {
  const pathname = usePathname();

  // ── On first mount: load Google script, apply saved direction ──
  useEffect(() => {
    const lang = readActiveLanguage();
    // applyDirection(lang);
    injectSuppressStyles();

    window.googleTranslateElementInit = () => {
      initWidget();
    };

    if (window.google?.translate?.TranslateElement) {
      initWidget();
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
  }, []);

  // ── On every route change: re-apply direction and re-translate if Arabic ──
  useEffect(() => {
    const lang = readActiveLanguage();
    // applyDirection(lang);
    if (lang === "ar") {
      retriggerTranslation("ar");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Invisible anchor for the Google Translate widget
  return (
    <div
      id="google_translate_element_global"
      aria-hidden="true"
      style={{ display: "none" }}
    />
  );
}
