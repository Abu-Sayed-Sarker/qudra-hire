"use client";

import React, { useState } from "react";
import Link from "next/link";
import { LayoutDashboard, LogOut } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import GoogleTranslate from "@/components/shared/GoogleTranslate";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/authSlice";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/jobs", label: "Find jobs" },
  { href: "/about", label: "About us" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact us" },
];

export default function QudraHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const user = useAppSelector((s) => s.auth.user);
  // Defer auth state to client-only to avoid SSR/client hydration mismatch.
  // The server always has an empty store, so we render the logged-out UI on
  // both server and first client paint, then switch to the real state.
  const isLoggedIn = mounted && !!user;

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Determine dashboard route from user role
  function getDashboardHref() {
    const role = user?.role?.toUpperCase();
    if (role === "ADMIN") return "/admin/dashboard";
    if (role === "COMPANY") return "/company";
    return "/candidate";
  }

  function handleLogout() {
    dispatch(logout());
    router.push("/");
    setMobileOpen(false);
  }

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-surface header-glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="hidden dark:block">
            <Image src='/logo.png' height={700} width={700} className="w-48 h-auto" alt="logo" />
          </div>
          <div className="block dark:hidden">
            <Image src='/light-logo.png' height={700} width={700} className="w-48 h-auto" alt="logo" />
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7 text-[14px] font-medium text-on-surface-muted">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={
                isActive(l.href)
                  ? "text-on-surface font-semibold"
                  : "hover:text-on-surface transition-colors"
              }
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              {/* Dashboard button */}
              <Link
                href={getDashboardHref()}
                className="hidden md:flex items-center gap-1.5 text-sm font-medium text-on-surface-muted hover:text-on-surface transition-colors"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>

              {/* Logout button */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-sm bg-red-500/10 hover:bg-red-500/20 text-red-500 font-semibold px-4 py-2 rounded-lg border border-red-500/20 transition-all active:scale-[0.97]"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <>
              {/* Log in */}
              <Link
                href="/login"
                className="text-sm text-on-surface-muted font-medium hover:text-on-surface transition-colors"
              >
                Log in
              </Link>

              {/* Get started — only shown when NOT logged in */}
              <Link
                href="/signup"
                className="text-sm bg-[#4BC957] hover:bg-[#00B96E] text-white font-bold px-4 py-2 rounded-lg transition-all active:scale-[0.97]"
              >
                Get started
              </Link>
            </>
          )}

          {/* Theme Toggle — desktop */}
          <div className="hidden md:block">
            <ThemeToggle />
          </div>

          <div className="hidden md:block">
            <GoogleTranslate />
          </div>

          {/* Hamburger */}
          <button
            className="md:hidden text-on-surface-muted hover:text-on-surface transition-colors p-1"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-surface-deep border-t border-surface px-4 py-4 flex flex-col gap-4 text-[15px] font-medium text-on-surface-muted">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={isActive(l.href) ? "text-on-surface font-semibold" : "hover:text-on-surface transition-colors"}
              onClick={() => setMobileOpen(false)}
            >
              {l.label}
            </Link>
          ))}

          {/* Mobile auth actions */}
          <div className="pt-2 border-t border-surface flex flex-col gap-3">
            {isLoggedIn ? (
              <>
                <Link
                  href={getDashboardHref()}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 text-on-surface-muted hover:text-on-surface transition-colors"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-500 hover:text-red-400 transition-colors text-left"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="text-on-surface-muted hover:text-on-surface transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm bg-[#4BC957] hover:bg-[#00B96E] text-white font-bold px-4 py-2 rounded-lg transition-all text-center"
                >
                  Get started
                </Link>
              </>
            )}
          </div>

          {/* Theme Toggle — mobile */}
          <div className="flex items-center gap-2 pt-2 border-t border-surface">
            <span className="text-sm text-on-surface-muted">Theme</span>
            <ThemeToggle />
          </div>
        </div>
      )}
    </header>
  );
}
