"use client";

import { useRouter, usePathname } from "next/navigation";
import { Lock, Zap, ArrowRight } from "lucide-react";

interface SubscriptionRequiredCardProps {
  message?: string;
  href?: string;
  title?: string;
}

export default function SubscriptionRequiredCard({
  message,
  href,
  title = "Subscription required",
}: SubscriptionRequiredCardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isCompany = pathname?.startsWith("/company");
  const target = href ?? (isCompany ? "/company/subscription" : "/candidate/subscription");

  return (
    <div className="flex items-center justify-center p-4 py-20">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-sm overflow-hidden text-center">
        <div className="h-2 bg-gradient-to-r from-[#4BC957] via-[#23C65F] to-[#4BC957]" />
        <div className="p-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#4BC957]/10 border border-[#4BC957]/20 flex items-center justify-center mb-5">
            <Lock className="w-8 h-8 text-[#4BC957]" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">{title}</h2>
          <p className="text-sm text-muted-foreground mb-6">
            {message ||
              "This feature requires an active subscription. Subscribe now to unlock it and continue."}
          </p>
          <button
            onClick={() => router.push(target)}
            className="w-full inline-flex items-center justify-center gap-2 text-sm font-bold bg-[#4BC957] hover:bg-[#3DAF49] text-white px-5 py-3 rounded-xl transition-colors"
          >
            <Zap className="w-4 h-4" />
            Subscribe & Upgrade
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
