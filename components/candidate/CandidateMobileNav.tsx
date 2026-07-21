"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import CandidateSidebar from "@/components/candidate/CandidateSidebar";
import NotificationBell from "@/components/shared/NotificationBell";

export default function CandidateMobileNav() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
            <CandidateSidebar />
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
          <NotificationBell />
          <div className="md:hidden">
            <ThemeToggle />
          </div>
        </div>
      </header>
    </>
  );
}
