"use client";

import { cn } from "@/lib/utils";
import {
  Briefcase,
  FileText,
  ClipboardList,
  MessageSquare,
  Wallet,
  Star,
  User,
  LogOut,
  ChevronRight,
  ChevronDown,
  Plus,
  Loader2,
  Upload,
  Sun,
  Moon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState, useRef } from "react";
import { useGetCandidateProfilesQuery, useCreateCandidateProfileMutation, authApi } from "@/store/authApi";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/authSlice";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "@/components/layout/ThemeProvider";
import ProfileCreationSuccess from "@/components/ui/profile-creation-success";

const navItems = [
  { label: "Dashboard", href: "/candidate", icon: Briefcase },
  { label: "Browse Jobs", href: "/candidate/jobs", icon: Briefcase },
  { label: "My CV", href: "/candidate/cv", icon: FileText },
  { label: "Applications", href: "/candidate/applications", icon: ClipboardList },
  { label: "Inbox", href: "/candidate/inbox", icon: MessageSquare },
  { label: "Subscription", href: "/candidate/subscription", icon: Star },
];

export default function CandidateSidebar({ setSidebarOpen }: { setSidebarOpen?: any }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isMobile = useIsMobile();
  const user = useAppSelector((s) => s.auth.user);
  const { data: profilesData, isLoading: profilesLoading } = useGetCandidateProfilesQuery();
  const [createProfile, { isLoading: isCreating }] = useCreateCandidateProfileMutation();
  const { resolvedTheme, setTheme } = useTheme();



  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successProfileId, setSuccessProfileId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const profiles = (profilesData?.data as any)?.profiles || [];
  const fullName = [user?.first_name, user?.last_name].filter(Boolean).join(" ").trim() || "Candidate";
  const email = user?.email || "";
  const initials = (fullName.match(/\b\w/g)?.slice(0, 2).join("") || "CU").toUpperCase();

  const handleCreateProfile = async () => {
    let payload: FormData | undefined = undefined;
    if (selectedFile) {
      payload = new FormData();
      payload.append("cv", selectedFile);
    }

    try {
      const result = await createProfile(payload).unwrap();
      toast.success(result.details || "Profile created successfully");
      setIsDialogOpen(false);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      const newProfileId = result.data?.id;
      if (newProfileId) {
        setSuccessProfileId(String(newProfileId));
        setShowSuccess(true);
      }
    } catch {
      toast.error("Failed to create profile");
    }
  };

  const handleSuccessComplete = () => {
    setShowSuccess(false);
    if (successProfileId) {
      router.push(`/candidate/profile/${successProfileId}`);
      dispatch(authApi.util.invalidateTags(["CandidateProfiles"]))
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  return (
    <>
      <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-border bg-card text-foreground">
        {/* Brand */}
        <div className="flex items-center gap-1.5 border-b border-border px-6 py-5 font-sans text-xl font-bold tracking-tight">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            <div className="hidden dark:block">
              <Image src='/logo.png' height={200} width={700} className="w-48 h-auto" alt="logo" />
            </div>
            <div className="block dark:hidden">
              <Image src='/light-logo.png' height={200} width={700} className="w-48 h-auto" alt="logo" />
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1.5 px-4 py-6">
          {navItems.map(({ label, href, icon: Icon }) => {
            const isActive =
              href === "/candidate"
                ? pathname === "/candidate"
                : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => { setSidebarOpen(false) }}
                className={cn(
                  "group flex items-center gap-3.5 rounded-xl px-4 py-3.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-muted text-foreground border border-border shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 transition-colors",
                    isActive ? "text-[#4BC957]" : "text-muted-foreground group-hover:text-foreground"
                  )}
                />
                <span>{label}</span>
              </Link>
            );
          })}

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className={cn(
              "w-full group flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-medium transition-all duration-200 outline-none",
              pathname.startsWith("/candidate/profile")
                ? "bg-muted text-foreground border border-border shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}>
              <div className="flex items-center gap-3.5">
                <User
                  className={cn(
                    "h-5 w-5 transition-colors",
                    pathname.startsWith("/candidate/profile") ? "text-[#4BC957]" : "text-muted-foreground group-hover:text-foreground"
                  )}
                />
                <span>My profile</span>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 bg-card border border-border p-2 shadow-xl"
              side={isMobile ? "bottom" : "right"}
              align="start"
              sideOffset={isMobile ? 4 : 16}
            >
              {profilesLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              ) : profiles.length === 0 ? (
                <div className="px-3 py-2 text-sm text-muted-foreground">No profiles yet</div>
              ) : (
                profiles.map((profile: any) => (
                  <DropdownMenuItem
                    key={profile.id}
                    onClick={() => { router.push(`/candidate/profile/${profile.id}`); setSidebarOpen?.(false); }}

                    className="flex items-center justify-between text-foreground hover:bg-muted hover:text-foreground cursor-pointer focus:bg-muted focus:text-foreground rounded-md px-3 py-2.5"
                  >
                    <span className="font-semibold text-sm truncate max-w-35">{profile.role_title || ""}</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </DropdownMenuItem>
                ))
              )}
              <DropdownMenuSeparator className="bg-border my-1" />
              <DropdownMenuItem
                onClick={() => setIsDialogOpen(true)}
                className="flex items-center justify-between text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer focus:bg-muted focus:text-foreground rounded-md px-3 py-2.5"
              >
                <span className="text-sm">Add more</span>
                <Plus className="h-4 w-4 text-muted-foreground" />
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border my-1" />
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Profile */}
        <div className="border-t border-border p-4">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex w-full items-center gap-3 rounded-xl p-2 text-left hover:bg-muted transition-colors cursor-pointer outline-none">
              <div className="h-9 w-9 rounded-full bg-linear-to-tr from-[#4BC957] to-emerald-400 flex items-center justify-center font-bold text-white text-sm shadow-md">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground truncate">{fullName}</p>
                <p className="text-[13px] text-muted-foreground truncate">{email}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
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

      {/* Add Profile Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add new profile</DialogTitle>
            <DialogDescription>
              Upload a CV to create a new candidate profile.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div
              className="border-2 border-dashed border-green-300 dark:border-[#4BC957]/40 bg-slate-50 dark:bg-[#0F172A]/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-4 cursor-pointer hover:border-green-500 dark:hover:border-[#4BC957]/70 transition-all"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-[#4BC957]/10 flex items-center justify-center text-green-600 dark:text-[#4BC957]">
                <Upload className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Upload CV</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">PDF or DOCX, max 10MB</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
              {selectedFile && (
                <p className="text-[13px] text-slate-600 dark:text-slate-400 font-medium truncate max-w-xs">
                  {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateProfile}
              disabled={isCreating}
              className="bg-green-600 hover:bg-green-500 dark:bg-[#4BC957] dark:hover:bg-[#00B96E] text-white"
            >
              {isCreating ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Creating...
                </span>
              ) : (
                "Create Profile"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {showSuccess && successProfileId && (
        <ProfileCreationSuccess
          onComplete={handleSuccessComplete}
          profileId={successProfileId}
        />
      )}
    </>
  );
}
