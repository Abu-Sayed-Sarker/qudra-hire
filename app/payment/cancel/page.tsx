"use client";

import React from "react";
import { XCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card border border-border rounded-2xl p-8 text-center shadow-xl space-y-6">
        <div className="h-16 w-16 bg-amber-500/15 border border-amber-500/30 rounded-full flex items-center justify-center mx-auto text-amber-500">
          <XCircle className="h-10 w-10" />
        </div>

        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
            Checkout Cancelled
          </h1>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            Your payment was not completed. No charges were made to your account.
          </p>
        </div>

        <div className="pt-2 space-y-3">
          <Link
            href="/candidate/subscription"
            className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold py-3 px-6 rounded-xl transition-all text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Subscriptions
          </Link>
        </div>
      </div>
    </div>
  );
}
