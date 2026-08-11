"use client";

import { Search, ChevronDown, Sun, Moon, Menu } from "lucide-react";
import NotificationBell from "@/components/shared/NotificationBell";
import { useAppSelector } from "@/store/hooks";
import { useTheme } from "@/components/layout/ThemeProvider";
import { useState } from "react";
import AdminSidebar from "./AdminSidebar";

export default function AdminTopbar() {
  const user = useAppSelector((s) => s.auth.user);
  const fullName = [user?.first_name, user?.last_name].filter(Boolean).join(" ").trim() || "Admin User";
  const email = user?.email || "";
  const initials = (fullName.match(/\b\w/g)?.slice(0, 2).join("") || "AD").toUpperCase();
  const { resolvedTheme, setTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-65 bg-background">
            <AdminSidebar setSidebarOpen={setSidebarOpen} />
          </div>
        </div>
      )}

      <header className="flex items-center justify-between h-16 px-4 lg:px-6 bg-card border-b border-border shrink-0">
        {/* Left: Mobile Menu & Search */}
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-muted-foreground hover:text-foreground transition-colors p-1"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="relative flex-1 hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search anything..."
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-muted border border-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/30 focus:bg-card focus:ring-2 focus:ring-primary/10 transition-all duration-200"
            />
          </div>
        </div>

      {/* Right: Notifications + Theme + Language + Profile */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          className="h-9 w-9 rounded-lg border border-border bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label="Toggle theme"
          title="Toggle theme"
        >
          {resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>


        {/* Notifications */}
        <NotificationBell />

        {/* Divider */}
        <div className="w-px h-6 bg-border mx-1" />

        {/* Profile */}
        <button className="flex items-center gap-3 pl-2 pr-3 py-1.5 rounded-xl hover:bg-muted transition-colors duration-200">
          <div className="w-9 h-9 rounded-xl bg-linear-to-br from-primary to-emerald-400 flex items-center justify-center text-sm font-bold text-white shadow-sm shadow-primary/20">
            {initials}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-sm font-semibold text-foreground leading-tight">{fullName}</p>
            <p className="text-xs text-muted-foreground">{email}</p>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground hidden md:block" />
        </button>
      </div>
    </header>
    </>
  );
}
