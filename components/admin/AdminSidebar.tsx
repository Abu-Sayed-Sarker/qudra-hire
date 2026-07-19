"use client";

import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  UserCheck,
  Building2,
  Briefcase,
  FileText,
  Star,
  Settings,
  LogOut,
  ChevronLeft,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Candidates", href: "/admin/candidates", icon: UserCheck },
  { label: "Companies", href: "/admin/companies", icon: Building2 },
  { label: "Jobs", href: "/admin/jobs", icon: Briefcase },
  { label: "Applications", href: "/admin/applications", icon: FileText },
  { label: "Subscriptions", href: "/admin/subscriptions", icon: Star },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-[260px] shrink-0 flex-col bg-card border-r border-border">
      {/* Logo */}
      <div className="flex items-center px-5 h-16 border-b border-border">
        <Link href="/" className="flex items-center">
          <div className="hidden dark:block">
            <Image src="/logo.png" height={700} width={700} className="w-44 h-auto" alt="logo" />
          </div>
          <div className="block dark:hidden">
            <Image src="/light-logo.png" height={700} width={700} className="w-44 h-auto" alt="logo" />
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <p className="px-3 mb-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
          Main Menu
        </p>
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive =
            pathname === href ||
            (href !== "/admin/dashboard" && pathname.startsWith(href));

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[15px] font-medium transition-all duration-200",
                isActive
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon
                className={cn(
                  "h-[18px] w-[18px] flex-shrink-0 transition-colors",
                  isActive ? "text-white" : "text-muted-foreground group-hover:text-accent-foreground"
                )}
              />
              <span className="leading-tight">{label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-border p-3">
        <Link
          href="/admin/logout"
          className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[15px] font-medium text-muted-foreground transition-all duration-200 hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-[18px] w-[18px] flex-shrink-0" />
          <span>Log Out</span>
        </Link>
      </div>
    </aside>
  );
}
