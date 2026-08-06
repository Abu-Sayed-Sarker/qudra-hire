"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/jobs", label: "Jobs" },
  { href: "/about", label: "About" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export default function MobileBottomNav() {
  const pathname = usePathname();

  if (
    pathname.startsWith("/company") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/candidate") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password") ||
    pathname.startsWith("/verify-otp") ||
    pathname.startsWith("/change-password") ||
    pathname.startsWith("/payment")
  ) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 md:hidden",
        "bg-background/90 backdrop-blur-md border-t border-border",
        "px-2 py-2 pb-[env(safe-area-inset-bottom)]"
      )}
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-5 gap-1">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className="min-w-0">
              <Button
                variant="ghost"
                className={cn(
                  "w-full h-12 rounded-2xl flex flex-col items-center justify-center gap-1",
                  "text-[11px] font-semibold leading-tight",
                  "transition-colors",
                  isActive(pathname, item.href)
                    ? "bg-primary text-primary-foreground hover:bg-primary"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                <span>{item.label}</span>
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

