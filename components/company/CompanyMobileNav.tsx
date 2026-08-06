"use client";

import { useState } from "react";
import { Menu, Globe } from "lucide-react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import CompanySidebar from "@/components/company/CompanySidebar";
import NotificationBell from "@/components/shared/NotificationBell";

export default function CompanyMobileNav() {
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
            <CompanySidebar setSidebarOpen={setSidebarOpen} />
          </div>
        </div>
      )}

      {/* Mobile top header */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-background/90 backdrop-blur-md px-4 py-3 md:hidden">
        <button
          onClick={() => setSidebarOpen(true)}
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>
        <span className="text-lg font-bold text-foreground">CareerSprint</span>
        <div className="flex items-center gap-2">
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
          <ThemeToggle />
        </div>
      </div>
    </>
  );
}
