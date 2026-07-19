"use client";

import { cn } from "@/lib/utils";
import {
  Bell,
  Briefcase,
  Building2,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Settings,
  Star,
  Users,
  UserCheck,
  FileText,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },

  {
    label: "Candidates Management",
    href: "/admin/candidates",
    icon: UserCheck,
  },
  {
    label: "Company Management",
    href: "/admin/companies",
    icon: Building2,
  },
  {
    label: "Job Management",
    href: "/admin/jobs",
    icon: Briefcase,
  },
  {
    label: "Application Management",
    href: "/admin/applications",
    icon: FileText,
  },
  {
    label: "Credit Management",
    href: "/admin/credits",
    icon: CreditCard,
  },
  {
    label: "Subscriptions",
    href: "/admin/subscriptions",
    icon: Star,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-[250px] shrink-0 flex-col bg-card text-foreground border-r border-border">
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 py-5 border-b border-border">
        <div className="flex items-center gap-1">
          <Link href="/" >
            <div className="hidden dark:block">
              <Image src='/logo.png' height={700} width={700} className="w-48 h-auto" alt="logo" />
            </div>
            <div className="block dark:hidden">
              <Image src='/light-logo.png' height={700} width={700} className="w-48 h-auto" alt="logo" />
            </div>
          </Link>

        </div>
      </div>

      {/* Welcome text */}
      <div className="px-5 pt-5 pb-2">
        <p className="text-muted-foreground text-[11px] uppercase tracking-widest font-medium">Main Menu</p>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto py-2 px-3">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive =
            pathname === href ||
            (href !== "/admin/dashboard" && pathname.startsWith(href));

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-[16px] font-medium transition-all duration-200",
                isActive
                  ? "bg-green-500 text-white"
                  : "text-muted-foreground hover:bg-green-500 hover:text-white"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 flex-shrink-0 transition-colors",
                  isActive ? "text-white" : "text-muted-foreground group-hover:text-white"
                )}
              />
              <span className="leading-tight">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-border p-3">
        <Link
          href="/admin/logout"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-foreground"
        >
          <LogOut className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
          <span>Log Out</span>
        </Link>
      </div>
    </aside>
  );
}
