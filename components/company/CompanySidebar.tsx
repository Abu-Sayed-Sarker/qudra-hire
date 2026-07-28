"use client";

import { cn } from "@/lib/utils";
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
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/store/hooks";

const navItems = [
  {
    label: "Workspace",
    href: "/company",
    icon: Briefcase,
  },
  {
    label: "Candidates",
    href: "/company/candidates",
    icon: Users,
  },
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

export default function CompanySidebar() {
  const pathname = usePathname();
  const user = useAppSelector((s) => s.auth.user);
  const fullName = [user?.first_name, user?.last_name].filter(Boolean).join(" ").trim() || "Company User";
  const email = user?.email || "";
  const initials = (fullName.match(/\b\w/g)?.slice(0, 2).join("") || "CU").toUpperCase();

  return (
    <aside className="flex h-screen w-64 flex-shrink-0 flex-col border-r border-border bg-card text-foreground">
      {/* Brand logo */}
      <div className="flex items-center gap-2 border-b border-border px-6 py-5">
        <div className="flex items-center gap-1.5 font-sans text-xl font-bold tracking-tight">  {/* Logo */}
          <Link href="/" className="text-2xl font-bold tracking-tight">
            <div className="hidden dark:block">
              <Image src='/logo.png' height={700} width={700} className="w-48 h-auto" alt="logo" />
            </div>
            <div className="block dark:hidden">
              <Image src='/light-logo.png' height={700} width={700} className="w-48 h-auto" alt="logo" />
            </div>
          </Link>
        </div>
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
              className={cn(
                "group flex items-center gap-3.5 rounded-xl px-4 py-3.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-muted text-foreground border border-border shadow-sm"
                  : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                )}
              />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Profile / Settings */}
      <div className="border-t border-border p-4 bg-muted/30">
        <div className="flex items-center gap-3 rounded-xl p-2 hover:bg-muted transition-colors cursor-pointer">
          <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary to-emerald-500 flex items-center justify-center font-bold text-primary-foreground text-sm shadow-md">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className=" font-semibold text-foreground truncate">{fullName}</p>
            <p className="text-[13px] text-muted-foreground truncate">{email}</p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
    </aside>
  );
}

