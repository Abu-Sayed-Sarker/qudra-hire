"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import CompanySidebar from "@/components/company/CompanySidebar";
import NotificationBell from "@/components/shared/NotificationBell";

export default function CompanyMobileNav() {
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

          <NotificationBell />
          <ThemeToggle />
        </div>
      </div>
    </>
  );
}
