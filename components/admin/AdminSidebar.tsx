"use client";

import { useState } from "react";
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
  Pencil,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { logout } from "@/store/authSlice";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Candidates", href: "/admin/candidates", icon: UserCheck },
  { label: "Companies", href: "/admin/companies", icon: Building2 },
  { label: "Jobs", href: "/admin/jobs", icon: Briefcase },
  { label: "Edit Requests", href: "/admin/job-edit-requests", icon: Pencil },
  { label: "Applications", href: "/admin/applications", icon: FileText },
  { label: "Subscriptions", href: "/admin/subscriptions", icon: Star },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside className={cn("flex h-screen shrink-0 flex-col bg-card border-r border-border transition-all duration-300", isCollapsed ? "w-20" : "w-65")}>
      {/* Logo */}
      <div className={cn("flex items-center h-16 border-b border-border py-5", isCollapsed ? "justify-center px-4" : "justify-between px-5")}>
        {!isCollapsed && (
          <Link href="/" className="flex items-center">
            <div className="hidden dark:block">
              <Image src="/logo.png" height={700} width={700} className="w-36 h-auto" alt="logo" />
            </div>
            <div className="block dark:hidden">
              <Image src="/light-logo.png" height={700} width={700} className="w-36 h-auto" alt="logo" />
            </div>
          </Link>
        )}
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-2 hover:bg-muted rounded-xl transition-colors">
          {isCollapsed ? (
            <PanelLeftOpen className="h-5 w-5 text-muted-foreground" />
          ) : (
            <PanelLeftClose className="h-5 w-5 text-muted-foreground" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {!isCollapsed && (
          <p className="px-3 mb-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
            Main Menu
          </p>
        )}
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive =
            pathname === href ||
            (href !== "/admin/dashboard" && pathname.startsWith(href));

          return (
            <Link
              key={href}
              href={href}
              title={isCollapsed ? label : undefined}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[15px] font-medium transition-all duration-200",
                isActive
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                isCollapsed && "justify-center px-0"
              )}
            >
              <Icon
                className={cn(
                  "h-4.5 w-4.5 shrink-0 transition-colors",
                  isActive ? "text-white" : "text-muted-foreground group-hover:text-accent-foreground"
                )}
              />
              {!isCollapsed && <span className="leading-tight">{label}</span>}
              {isActive && !isCollapsed && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-border p-3">
        <button
          onClick={() => { dispatch(logout()); router.push("/"); }}
          title={isCollapsed ? "Log Out" : undefined}
          className={cn(
            "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[15px] font-medium text-muted-foreground transition-all duration-200 hover:bg-destructive/10 hover:text-destructive w-full",
            isCollapsed && "justify-center px-0"
          )}
        >
          <LogOut className="h-4.5 w-4.5 shrink-0" />
          {!isCollapsed && <span>Log Out</span>}
        </button>
      </div>
    </aside>
  );
}
