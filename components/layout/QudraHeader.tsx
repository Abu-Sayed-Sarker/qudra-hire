"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { LayoutDashboard, LogOut, X } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import GoogleTranslate from "@/components/shared/GoogleTranslate";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/authSlice";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/jobs", label: "Jobs" },
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
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const user = useAppSelector((s) => s.auth.user);
  const isLoggedIn = mounted && !!user;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        triggerRef.current?.focus();
      }
      if (e.key === "Tab" && menuRef.current) {
        const focusable = menuRef.current.querySelectorAll<HTMLElement>(
          'a, button, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

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
        <Link href="/" className="flex items-center gap-2 group">
          <div className="hidden dark:block">
            <Image src="/logo.png" height={700} width={700} className="w-48 h-auto" alt="CareerSprint logo" />
          </div>
          <div className="block dark:hidden">
            <Image src="/light-logo.png" height={700} width={700} className="w-48 h-auto" alt="CareerSprint logo" />
          </div>
        </Link>

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

        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <Link
                href={getDashboardHref()}
                className="hidden md:flex items-center gap-1.5 text-sm font-medium text-on-surface-muted hover:text-on-surface transition-colors"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
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
              <Link
                href="/login"
                className="text-sm text-on-surface-muted font-medium hover:text-on-surface transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="text-sm bg-[#4BC957] hover:bg-[#00B96E] text-white font-bold px-4 py-2 rounded-lg transition-all active:scale-[0.97]"
              >
                Get started
              </Link>
            </>
          )}

          <div className="hidden md:block">
            <ThemeToggle />
          </div>

          <div className="hidden md:block">
            <GoogleTranslate />
          </div>

          <button
            ref={triggerRef}
            className="md:hidden text-on-surface-muted hover:text-on-surface transition-colors p-2 -mr-1 rounded-lg hover:bg-surface-deep"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu with backdrop */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30 md:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div
            id="mobile-menu"
            ref={menuRef}
            className="md:hidden fixed inset-x-0 top-16 z-50 bg-surface border-b border-surface shadow-xl max-h-[calc(100vh-4rem)] overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <nav className="px-4 py-4 flex flex-col gap-1 text-[15px] font-medium text-on-surface-muted">
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`flex items-center gap-2 px-3 py-3 rounded-xl transition-colors ${
                    isActive(l.href)
                      ? "text-on-surface font-semibold bg-surface-deep"
                      : "hover:text-on-surface hover:bg-surface-deep"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {l.label}
                </Link>
              ))}

              <div className="pt-3 border-t border-surface mt-2 flex flex-col gap-1">
                {isLoggedIn ? (
                  <>
                    <Link
                      href={getDashboardHref()}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 px-3 py-3 rounded-xl text-on-surface-muted hover:text-on-surface hover:bg-surface-deep transition-colors"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-3 py-3 rounded-xl text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-colors text-left"
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
                      className="flex items-center gap-2 px-3 py-3 rounded-xl text-on-surface-muted hover:text-on-surface hover:bg-surface-deep transition-colors"
                    >
                      Log in
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 px-3 py-3 rounded-xl text-sm bg-[#4BC957] hover:bg-[#00B96E] text-white font-bold text-center transition-colors"
                    >
                      Get started
                    </Link>
                  </>
                )}
              </div>

              <div className="pt-3 border-t border-surface mt-2 flex items-center justify-between">
                <span className="text-sm text-on-surface-muted">Theme</span>
                <ThemeToggle />
              </div>

              <div className="pt-2 border-t border-surface">
                <GoogleTranslate />
              </div>
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
