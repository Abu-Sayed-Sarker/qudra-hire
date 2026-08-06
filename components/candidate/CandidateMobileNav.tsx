"use client";

import { useState } from "react";
import { Menu, Globe } from "lucide-react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import CandidateSidebar from "@/components/candidate/CandidateSidebar";
import NotificationBell from "@/components/shared/NotificationBell";

export default function CandidateMobileNav() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const currentLang = typeof window !== "undefined" ? localStorage.getItem("careersprint-lang") || "en" : "en";

  function toggleLang() {
    const next = currentLang === "en" ? "ar" : "en";
    localStorage.setItem("careersprint-lang", next);
    window.location.reload();
  }

  return (
    <>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full">
            <CandidateSidebar setSidebarOpen={setSidebarOpen}/>
          </div>
        </div>
      )}

      {/* Header Bar */}
      <header className="h-16 border-b border-border flex items-center px-4 md:px-8 flex-shrink-0 gap-3 bg-background">
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden text-muted-foreground hover:text-foreground transition-colors p-1"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-bold text-foreground">Welcome</h1>
        <div className="ml-auto flex items-center gap-1">
          {/* Language Toggle */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="h-9 w-9 rounded-lg border border-border bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Toggle language"
            >
              <Globe className="h-4 w-4" />
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-2 w-32 bg-card border border-border rounded-xl shadow-xl py-1 z-50">
                <button
                  onClick={() => { setLangOpen(false); toggleLang(); }}
                  className={`w-full text-left px-4 py-2 text-sm ${currentLang === "en" ? "text-foreground font-semibold bg-accent" : "text-muted-foreground hover:bg-muted"}`}
                >
                  English
                </button>
                <button
                  onClick={() => { setLangOpen(false); toggleLang(); }}
                  className={`w-full text-left px-4 py-2 text-sm ${currentLang === "ar" ? "text-foreground font-semibold bg-accent" : "text-muted-foreground hover:bg-muted"}`}
                >
                  العربية
                </button>
              </div>
            )}
          </div>
          <NotificationBell />
          <div className="md:hidden">
            <ThemeToggle />
          </div>
        </div>
      </header>
    </>
  );
}
