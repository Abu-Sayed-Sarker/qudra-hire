"use client";

import { useState } from "react"; import { cn } from "@/lib/utils";
import {
  Briefcase,
  Users,
  Calendar,
  MessageSquare,
  Wallet,
  Settings,
  LogOut,
  Star,
  ChevronRight,
  Bot,
  Sun,
  Moon,
  ShieldCheck,
  AlertTriangle,
  PanelLeftOpen,
  PanelLeftClose,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/authSlice";
import { useTheme } from "@/components/layout/ThemeProvider";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { useGetCompanyProfileQuery } from "@/store/authApi";

const navItems = [
  {
    label: "Workspace",
    href: "/company",
    icon: Briefcase,
  },
  // {
  //   label: "Candidates",
  //   href: "/company/candidates",
  //   icon: Users,
  // },
  {
    label: "Manage Jobs",
    href: "/company/jobs",
    icon: Calendar,
  },
  {
    label: "Interviews",
    href: "/company/interviews",
    icon: Bot,
  },
  {
    label: "Inbox",
    href: "/company/inbox",
    icon: MessageSquare,
  },
  {
    label: "Subscription",
    href: "/company/subscription",
    icon: Star,
  },
  {
    label: "Settings",
    href: "/company/settings",
    icon: Settings,
  },
];

export default function CompanySidebar({ setSidebarOpen }: { setSidebarOpen?: (open: boolean) => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data: user } = useGetCompanyProfileQuery();
  const fullName = [user?.data?.first_name, user?.data?.last_name].filter(Boolean).join(" ").trim() || "Company User";
  const email = user?.data?.email || "";
  const initials = (fullName.match(/\b\w/g)?.slice(0, 2).join("") || "CU").toUpperCase();
  const image = user?.data?.logo || "";
  const isVerified = user?.data?.is_licence_verified ?? false;
  const { resolvedTheme, setTheme } = useTheme();

  const isMobile = useIsMobile();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside className={cn("flex h-screen shrink-0 flex-col border-r border-border bg-card text-foreground transition-all duration-300", isCollapsed ? "w-20" : "w-64")}>
      {/* Brand logo */}
      <div className={cn("flex items-center border-b border-border py-5 font-sans text-xl font-bold tracking-tight", isCollapsed ? "justify-center px-4" : "gap-1.5 px-6 justify-between")}>
        {!isCollapsed && (
          <Link href="/" className="text-2xl font-bold tracking-tight">
            <div className="hidden dark:block">
              <Image src='/logo.png' height={200} width={700} className="w-48 h-auto" alt="logo" />
            </div>
            <div className="block dark:hidden">
              <Image src='/light-logo.png' height={200} width={700} className="w-48 h-auto" alt="logo" />
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
      <nav className="flex-1 space-y-1.5 px-4 py-6">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive =
            href === "/company"
              ? pathname === "/company"
              : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              onClick={() => setSidebarOpen?.(false)}
              className={cn(
                "group flex items-center rounded-xl py-3.5 text-sm font-medium transition-all duration-200",
                isCollapsed ? "justify-center px-0" : "gap-3.5 px-4",
                isActive
                  ? "bg-muted text-foreground border border-border shadow-sm"
                  : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5 transition-colors shrink-0",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                )}
              />
              {!isCollapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Profile / Settings */}
      {/* Profile */}
      <div className="border-t border-border p-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex w-full items-center gap-3 rounded-xl p-2 text-left hover:bg-muted transition-colors cursor-pointer outline-none">
            <div className="h-9 w-9 shrink-0 rounded-full bg-linear-to-tr from-[#4BC957] to-emerald-400 flex items-center justify-center font-bold text-white text-sm shadow-md">
              {image ? (
                <img src={image} alt={fullName} className="rounded-full w-full h-full object-cover object-top" />
              ) : (
                initials
              )}
            </div>
            {!isCollapsed && (
              <>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="font-semibold text-foreground truncate">{fullName}</p>
                    {isVerified ? (
                      <div title="Verified Company" className="bg-[#4BC957]/10 text-[#4BC957] px-1.5 py-0.5 rounded-full flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-3 h-3" strokeWidth={3} />
                      </div>
                    ) : (
                      <div title="Unverified Company" className="bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded-full flex items-center justify-center shrink-0">
                        <AlertTriangle className="w-3 h-3" strokeWidth={3} />
                      </div>
                    )}
                  </div>
                  <p className="text-[13px] text-muted-foreground truncate">{email}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent side={isMobile ? "top" : "right"} align="start" className="w-56 bg-card border border-border p-2 shadow-xl">
            <DropdownMenuItem
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer focus:bg-muted focus:text-foreground"
            >
              {resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              {resolvedTheme === "dark" ? "Light mode" : "Dark mode"}
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => { dispatch(logout()); router.push("/"); }}
              className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-red-500 hover:bg-red-500/10 hover:text-red-500 cursor-pointer focus:bg-red-500/10 focus:text-red-500"
            >
              <LogOut className="h-4 w-4" />
              Log Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}

