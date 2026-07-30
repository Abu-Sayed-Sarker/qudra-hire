"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAppSelector } from "@/store/hooks";

const ROLE_SEGMENT_MAP: Record<string, string> = {
  candidate: "candidate",
  admin: "admin",
  company: "company",
};

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const user = useAppSelector((s) => s.auth.user);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (!accessToken) {
      router.replace("/login");
      return;
    }

    const segment = pathname?.split("/")[1]?.toLowerCase();
    const role = user?.role?.toLowerCase();

    if (segment && ROLE_SEGMENT_MAP[role ?? ""] && segment !== role) {
      router.replace("/login");
    }
  }, [mounted, accessToken, user, pathname, router]);

  if (!mounted || !accessToken) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[#4BC957]" />
      </div>
    );
  }

  return <>{children}</>;
}
