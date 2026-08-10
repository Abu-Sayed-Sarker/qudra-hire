"use client";

import React, { Suspense } from "react";
import { CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { RootState } from "@/store";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const role = useAppSelector((state: RootState) => state.auth.user?.role);
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card border border-border rounded-2xl p-8 text-center shadow-xl space-y-6">
        <div className="h-16 w-16 bg-[#4BC957]/15 border border-[#4BC957]/30 rounded-full flex items-center justify-center mx-auto text-[#4BC957]">
          <CheckCircle2 className="h-10 w-10" />
        </div>

        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4BC957] bg-[#4BC957]/10 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Subscription Activated
          </span>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
            Payment Successful!
          </h1>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            Thank you for your purchase. Your subscription has been successfully processed and your premium features are now unlocked.
          </p>
        </div>

        {sessionId && sessionId !== "free" && (
          <div className="bg-muted/50 border border-border rounded-xl p-3 text-xs text-muted-foreground font-mono truncate">
            Session ID: {sessionId}
          </div>
        )}

        <div className="pt-2 space-y-3">

          {/* //// button show according to user role  */}
          {role === "CANDIDATE" ? (
            <Link
              href="/candidate/subscription"
              className="w-full inline-flex items-center justify-center gap-2 bg-[#4BC957] hover:bg-[#3DAF49] text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md shadow-[#4BC957]/20 text-sm"
            >
              Go to Candidate Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <Link
              href="/company/subscription"
              className="w-full inline-flex items-center justify-center gap-2 bg-card hover:bg-muted text-foreground border border-border font-semibold py-2.5 px-6 rounded-xl transition-all text-xs"
            >
              Go to Company Dashboard
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground text-sm">Loading payment details...</p>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
