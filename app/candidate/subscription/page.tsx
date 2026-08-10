"use client";

import React, { useState } from "react";
import { Check, Zap, Star, ShieldCheck, Lock, Loader2, CreditCard, AlertTriangle } from "lucide-react";
import { useGetSubscriptionHistoryQuery, useGetSubscriptionPlansQuery, useGetCandidateProfilesQuery, useCreateStripeCheckoutSessionMutation } from "@/store/authApi";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { get403Message } from "@/lib/utils";
import PageLoader from "@/components/ui/page-loader";
import SubscriptionRequiredCard from "@/components/ui/subscription-required-card";

export default function CandidateSubscriptionPage() {
  const { data: historyData, isLoading: historyLoading, isError: isHistoryError, error: historyError } = useGetSubscriptionHistoryQuery();
  const { data: plansData, isLoading: plansLoading, isError: isPlansError, error: plansError } = useGetSubscriptionPlansQuery();
  const { data: profilesData, isLoading: profilesLoading } = useGetCandidateProfilesQuery();
  const [createCheckoutSession, { isLoading: isCheckingOut }] = useCreateStripeCheckoutSessionMutation();

  const [yearly, setYearly] = useState(false);

  // Checkout popup state
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{ id: string; name: string; price: string } | null>(null);
  const [selectedProfileId, setSelectedProfileId] = useState<number | null>(null);

  const history = historyData?.data ?? [];
  const allPlans = plansData?.data ?? [];
  const plans = allPlans.filter((p) => p.category === "CANDIDATE");
  const profiles = (profilesData?.data as any).profiles ?? [];

  const activeSub = history.find((h) => h.sub_status === "ACTIVE");
  const freePlan = plans.find(
    (p) => p.plan_type === "Free" || p.name?.toLowerCase() === "free" || Number(p.price) === 0
  );
  const premiumPlan = plans.find(
    (p) =>
      p.plan_type === "Premium" ||
      p.plan_type === "Pro" ||
      p.name?.toLowerCase() === "pro" ||
      p.name?.toLowerCase() === "premium" ||
      Number(p.price) > 0
  );

  const freeFeatures =
    freePlan?.features && freePlan.features.length > 0
      ? freePlan.features
      : ["Basic job browsing & applications", "Candidate profile creation", "Standard AI recommendations"];

  const premiumFeatures =
    premiumPlan?.features && premiumPlan.features.length > 0
      ? premiumPlan.features
      : [
        "Unlimited AI job matching",
        "Priority candidate placement",
        "Advanced resume parsing & AI recruiter",
        "24/7 Priority support",
      ];

  const isLoading = historyLoading || plansLoading || profilesLoading;

  const openCheckout = (plan: { id: string; name: string; price: string }) => {
    setSelectedPlan(plan);
    // Default to first profile if only one exists
    if (profiles.length === 1) {
      setSelectedProfileId(profiles[0].id);
    } else {
      setSelectedProfileId(null);
    }
    setCheckoutOpen(true);
  };

  const handleCheckout = async () => {
    if (!selectedPlan || !selectedProfileId) return;
    try {
      const result = await createCheckoutSession({
        plan_id: selectedPlan.id,
        profile_id: selectedProfileId,
      }).unwrap();
      setCheckoutOpen(false);
      // Redirect to Stripe checkout
      window.location.href = result.data.checkout_url;
    } catch (err: any) {
      toast.error(err?.data?.details ?? "Failed to create checkout session");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-full bg-background text-foreground">
        <PageLoader label="Loading subscription..." />
      </div>
    );
  }

  if (isHistoryError || isPlansError) {
    const err = isHistoryError ? historyError : plansError;
    const msg = get403Message(err);
    if (msg) {
      return (
        <div className="min-h-full bg-background text-foreground">
          <SubscriptionRequiredCard message={msg} />
        </div>
      );
    }
    return (
      <div className="min-h-full bg-background text-foreground">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-8 flex flex-col items-center justify-center text-center">
          <div className="h-16 w-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Failed to load subscription</h2>
          <p className="text-sm text-muted-foreground mb-4 max-w-sm">
            Something went wrong while fetching subscription data.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-background text-foreground">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-8 space-y-8">

        {/* Header */}
        <div>
          <p className="text-xs text-muted-foreground mb-1">Your Plan</p>
          <h1 className="text-3xl font-bold text-foreground">Subscription</h1>
          <p className="text-sm text-muted-foreground mt-1">Unlock your AI Recruiter. Cancel anytime.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-card border border-border rounded-xl px-5 py-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-[#4BC957] shrink-0" />
              <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">Active Subscriptions</span>
            </div>
            <p className="text-4xl font-extrabold text-foreground">{activeSub ? 1 : 0}</p>
          </div>
          <div className="bg-card border border-border rounded-xl px-5 py-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-[#4BC957] shrink-0" />
              <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">Total Subscriptions</span>
            </div>
            <p className="text-4xl font-extrabold text-foreground">{history.length}</p>
          </div>
          <div className="bg-card border border-border rounded-xl px-5 py-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Lock className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">Expired</span>
            </div>
            <p className="text-4xl font-extrabold text-foreground">{history.filter((h) => h.sub_status !== "ACTIVE").length}</p>
          </div>
        </div>

        {/* Active Subscription */}
        {activeSub && (
          <div>
            <h2 className="text-lg font-bold text-foreground mb-3">Your active subscription</h2>
            <div className="bg-card border border-border rounded-xl px-5 py-4 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="mt-0.5 w-7 h-7 rounded-full flex items-center justify-center shrink-0 bg-[#4BC957]/15">
                    <Check className="w-4 h-4 text-[#4BC957]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground text-sm leading-tight">{activeSub.plan_name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{activeSub.currency} {activeSub.price} / plan</p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold bg-[#4BC957]/15 text-[#4BC957] border border-[#4BC957]/30 rounded px-2 py-0.5">
                  ✓ Active
                </span>
              </div>
              <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-[12px] text-muted-foreground">
                <span>Started {new Date(activeSub.started_at).toLocaleDateString()}</span>
                <span>Renews {new Date(activeSub.expires_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* Choose your plan */}
        {(freePlan || premiumPlan) && (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <h2 className="text-lg font-bold text-foreground">Choose your plan</h2>
              <div className="inline-flex items-center bg-muted border border-border rounded-xl p-1 gap-1">
                <button
                  onClick={() => setYearly(false)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${!yearly ? "bg-background text-foreground shadow" : "text-muted-foreground hover:text-foreground"}`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setYearly(true)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${yearly ? "bg-[#4BC957] text-white shadow" : "text-muted-foreground hover:text-foreground"}`}
                >
                  Yearly
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
              {/* Free card */}
              {freePlan && (
                <div className="bg-card border border-border rounded-2xl p-6 flex flex-col h-full shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-4 h-4 text-muted-foreground" />
                    <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">STARTER</span>
                  </div>
                  <h3 className="text-3xl font-extrabold text-foreground mb-1">{freePlan.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{freePlan.description || "Everything you need to start."}</p>
                  <div className="flex items-baseline gap-1 mb-5">
                    <span className="text-3xl font-extrabold text-foreground">AED {Number(freePlan.price)}</span>
                    <span className="text-sm text-muted-foreground">{freePlan.renewal}</span>
                  </div>
                  <button
                    onClick={() => openCheckout({ id: freePlan.id, name: freePlan.name, price: freePlan.price })}
                    className="w-full h-11 rounded-xl font-bold text-sm border border-border text-foreground hover:bg-muted transition-all mb-5"
                  >
                    Get started free
                  </button>
                  <div className="border-t border-border mb-4" />
                  <ul className="space-y-2.5 flex-1">
                    {freeFeatures.map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                        <span className="h-4 w-4 rounded-full bg-muted flex items-center justify-center shrink-0">
                          <Check className="h-2.5 w-2.5 text-muted-foreground" />
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Premium card */}
              {premiumPlan && (
                <div className="relative bg-green-50 dark:bg-[#0f1f14] border-2 border-[#4BC957]/50 rounded-2xl p-6 flex flex-col h-full shadow-xl shadow-[#4BC957]/10">
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="bg-[#4BC957] text-white text-[10px] font-bold px-3 py-1 rounded-full tracking-wide">MOST POPULAR</span>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="w-4 h-4 text-[#4BC957]" />
                    <span className="text-[10px] font-bold tracking-widest text-[#4BC957] uppercase">RECOMMENDED</span>
                  </div>
                  <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-1">{premiumPlan.name}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{premiumPlan.description || "Your always-on AI Recruiter."}</p>
                  <div className="flex items-baseline gap-1 mb-5">
                    <span className="text-3xl font-extrabold text-slate-900 dark:text-white">AED {Number(premiumPlan.price)}</span>
                    <span className="text-sm text-slate-600 dark:text-slate-400">/ month</span>
                  </div>
                  <button
                    onClick={() => openCheckout({ id: premiumPlan.id, name: premiumPlan.name, price: premiumPlan.price })}
                    className="w-full h-11 rounded-xl font-bold text-sm bg-[#4BC957] hover:bg-[#3DAF49] text-white shadow-lg shadow-[#4BC957]/20 transition-all mb-5"
                  >
                    Upgrade to {premiumPlan.name}
                  </button>
                  <div className="border-t border-green-200 dark:border-white/10 mb-4" />
                  <ul className="space-y-2.5 flex-1">
                    {premiumFeatures.map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                        <span className="h-4 w-4 rounded-full bg-[#4BC957]/15 flex items-center justify-center shrink-0">
                          <Check className="h-2.5 w-2.5 text-[#4BC957]" />
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Billing History */}
        <div>
          <h2 className="text-lg font-bold text-foreground mb-3">Billing history</h2>
          {history.length === 0 ? (
            <div className="border border-border rounded-xl bg-card px-5 py-8 text-center text-sm text-muted-foreground shadow-sm">No subscription history yet.</div>
          ) : (
            <>
              {/* Mobile: stacked cards */}
              <div className="sm:hidden space-y-3">
                {history.map((row) => (
                  <div key={row.id} className="border border-border rounded-xl bg-card px-4 py-4 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-semibold text-foreground text-sm leading-tight">{row.plan_name}</p>
                      <span className={`shrink-0 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${row.sub_status === "ACTIVE"
                        ? "bg-[#4BC957]/15 text-[#4BC957]"
                        : "bg-muted text-muted-foreground"
                        }`}>
                        {row.sub_status}
                      </span>
                    </div>
                    <dl className="mt-3 pt-3 border-t border-border grid grid-cols-2 gap-y-2 text-xs">
                      <div>
                        <dt className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-0.5">Started</dt>
                        <dd className="text-foreground font-medium">{new Date(row.started_at).toLocaleDateString()}</dd>
                      </div>
                      <div className="text-right">
                        <dt className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-0.5">Expires</dt>
                        <dd className="text-foreground font-medium">{new Date(row.expires_at).toLocaleDateString()}</dd>
                      </div>
                      <div>
                        <dt className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-0.5">Amount</dt>
                        <dd className="text-foreground font-bold">{row.currency} {row.price}</dd>
                      </div>
                    </dl>
                  </div>
                ))}
              </div>

              {/* Desktop: table */}
              <div className="hidden sm:block border border-border rounded-xl overflow-hidden bg-card shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/50 border-b border-border text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                        <th className="px-5 py-3 text-left">Plan</th>
                        <th className="px-5 py-3 text-left">Started</th>
                        <th className="px-5 py-3 text-left">Expires</th>
                        <th className="px-5 py-3 text-left">Status</th>
                        <th className="px-5 py-3 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((row) => (
                        <tr key={row.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                          <td className="px-5 py-3.5 text-foreground font-medium">{row.plan_name}</td>
                          <td className="px-5 py-3.5 text-muted-foreground">{new Date(row.started_at).toLocaleDateString()}</td>
                          <td className="px-5 py-3.5 text-muted-foreground">{new Date(row.expires_at).toLocaleDateString()}</td>
                          <td className="px-5 py-3.5">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${row.sub_status === "ACTIVE"
                              ? "bg-[#4BC957]/15 text-[#4BC957]"
                              : "bg-muted text-muted-foreground"
                              }`}>
                              {row.sub_status}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-right font-semibold text-foreground">{row.currency} {row.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>

      </div>

      {/* Checkout Popup */}
      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-[#4BC957]" />
              Confirm Purchase
            </DialogTitle>
            <DialogDescription>
              Select a profile for this subscription, then confirm to proceed to checkout.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Plan summary */}
            {selectedPlan && (
              <div className="bg-muted/50 border border-border rounded-xl px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-foreground">{selectedPlan.name}</p>
                  <p className="text-xs text-muted-foreground">Subscription plan</p>
                </div>
                <p className="text-lg font-extrabold text-foreground">AED {Number(selectedPlan.price)}</p>
              </div>
            )}

            {/* Profile selection */}
            <div>
              <p className="text-sm font-semibold text-foreground mb-2">Select profile</p>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {profiles.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-2">No profiles found. Create a profile first.</p>
                ) : (
                  profiles.map((profile: any) => (
                    <label
                      key={profile.id}
                      className={`flex items-center gap-3 border rounded-xl px-4 py-3 cursor-pointer transition-all ${selectedProfileId === profile.id
                        ? "border-[#4BC957] bg-[#4BC957]/5"
                        : "border-border hover:border-muted-foreground/30"
                        }`}
                    >
                      <input
                        type="radio"
                        name="checkout-profile"
                        value={profile.id}
                        checked={selectedProfileId === profile.id}
                        onChange={() => setSelectedProfileId(profile.id)}
                        className="accent-[#4BC957]"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{profile.role_title || `Profile ${profile.id}`}</p>
                        <p className="text-xs text-muted-foreground truncate">{profile.industry || "No industry"} &bull; {profile.location || "No location"}</p>
                      </div>
                    </label>
                  ))
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <button
              onClick={() => setCheckoutOpen(false)}
              disabled={isCheckingOut}
              className="text-sm font-semibold border border-border bg-card hover:bg-muted text-foreground px-4 py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCheckout}
              disabled={!selectedProfileId || isCheckingOut}
              className="text-sm font-semibold bg-[#4BC957] hover:bg-[#3DAF49] text-white px-5 py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isCheckingOut && <Loader2 className="h-4 w-4 animate-spin" />}
              <CreditCard className="h-4 w-4" />
              Confirm & Pay
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
