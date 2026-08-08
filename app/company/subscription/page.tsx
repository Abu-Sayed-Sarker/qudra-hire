"use client";

import React, { useState } from "react";
import { Check, Star, Zap, ShieldCheck, Building2, Loader2, CreditCard } from "lucide-react";
import { useCreateStripeCheckoutSessionMutation, useGetCompanyProfileQuery, useGetSubscriptionHistoryQuery, useGetSubscriptionPlansQuery } from "@/store/authApi";
import { useAppSelector } from "@/store/hooks";
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
import SubscriptionRequiredCard from "@/components/ui/subscription-required-card";
import { AlertTriangle } from "lucide-react";

export default function CompanySubscriptionPage() {
  const { data: historyData, isLoading: historyLoading, isError: isHistoryError, error: historyError } = useGetSubscriptionHistoryQuery();
  const { data: plansData, isLoading: plansLoading, isError: isPlansError, error: plansError } = useGetSubscriptionPlansQuery();
  const [createCheckoutSession, { isLoading: isCheckingOut }] = useCreateStripeCheckoutSessionMutation();
  const { data: user } = useGetCompanyProfileQuery()
  const [yearly, setYearly] = useState(true);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{ id: string; name: string; price: string } | null>(null);

  const resolveCompanyProfileId = () => {

    if (!user) return null;

    const profile = user.data;
    const directId = typeof profile === "number" ? profile : profile?.id;
    return directId;
  };

  const companyProfileId = resolveCompanyProfileId();

  const openCheckout = (plan: { id: string; name: string; price: string }) => {

    if (!companyProfileId) {
      toast.error("Company profile not found in session. Please log in again.");
      return;
    }
    setSelectedPlan(plan);
    setCheckoutOpen(true);
  };

  const handleCheckout = async () => {
    if (!selectedPlan || !companyProfileId) return;

    try {
      const result = await createCheckoutSession({
        plan_id: selectedPlan.id,
        profile_id: companyProfileId,
      }).unwrap();

      setCheckoutOpen(false);
      window.location.href = result.data.checkout_url;
    } catch (err: any) {
      toast.error(err?.data?.details ?? "Failed to create checkout session");
    }
  };

  const history = historyData?.data ?? [];
  const allPlans = plansData?.data ?? [];
  const plans = allPlans.filter((p) => p.category === "COMPANY");

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
      : ["Post active job vacancies", "Basic candidate matching", "Standard analytics dashboard"];

  const premiumFeatures =
    premiumPlan?.features && premiumPlan.features.length > 0
      ? premiumPlan.features
      : [
        "Unlimited active job postings",
        "Advanced AI recruiter & automated screening",
        "Priority candidate matching & outreach",
        "Dedicated account manager & 24/7 support",
      ];

  const isLoading = historyLoading || plansLoading;

  if (isLoading) {
    return (
      <div className="min-h-full bg-background text-foreground">
        <div className="max-w-full mx-2 sm:mx-auto px-6 flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
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
        <div className="max-w-full mx-2 sm:mx-auto px-6 flex flex-col items-center justify-center py-20 text-center">
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
      <div className="max-w-full mx-2 sm:mx-auto px-6 py-8 space-y-8">

        {/* Header */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">Your Plan</p>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Subscription</h1>
          <p className="text-muted-foreground mt-1">Unlock your AI Recruiter. Cancel anytime.</p>
        </div>

        {/* Current Plan Banner */}
        {activeSub && (
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-start gap-5">
              <div className="h-12 w-12 rounded-xl bg-[#4BC957]/10 border border-[#4BC957]/20 flex items-center justify-center shrink-0">
                <Building2 className="h-6 w-6 text-[#4BC957]" />
              </div>
              <div>
                <span className="text-[11px] font-bold tracking-widest text-[#4BC957] uppercase">ACTIVE SUBSCRIPTION</span>
                <h2 className="text-xl font-bold text-foreground mt-0.5">{activeSub.plan_name}</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {activeSub.currency} {activeSub.price} &bull; Renews on {new Date(activeSub.expires_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Plans Grid */}
        {(freePlan || premiumPlan) && (
          <div>
            <div className="flex flex-wrap items-center gap-5 justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-foreground tracking-tight">Available Plans</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Select a plan that fits your hiring needs</p>
              </div>
              <div className="bg-muted p-1 rounded-full flex items-center border border-border">
                <button
                  onClick={() => setYearly(false)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${!yearly ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
                    }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setYearly(true)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${yearly ? "bg-[#4BC957] text-white shadow-sm" : "text-muted-foreground"
                    }`}
                >
                  Yearly
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Free Card */}
              {freePlan && (
                <div className="bg-card border border-border rounded-2xl p-6 flex flex-col h-full">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-4 h-4 text-muted-foreground" />
                    <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">STARTER</span>
                  </div>
                  <h3 className="text-3xl font-extrabold text-foreground mb-1">{freePlan.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{freePlan.description || "Everything you need to get started."}</p>
                  <div className="flex items-baseline gap-1 mb-5">
                    <span className="text-4xl font-extrabold text-foreground">AED {Number(freePlan.price)}</span>
                    <span className="text-sm text-muted-foreground ml-1">{freePlan.renewal}</span>
                  </div>
                  <button
                    onClick={() => openCheckout({ id: freePlan.id, name: freePlan.name, price: freePlan.price })}
                    disabled={activeSub?.plan_name === freePlan.name}
                    className="w-full py-2.5 rounded-xl border border-border bg-background hover:bg-muted text-foreground text-sm font-bold transition-all mb-6 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {activeSub?.plan_name === freePlan.name ? "Current plan" : "Get started free"}
                  </button>
                  <div className="border-t border-border pt-5 space-y-3 flex-1">
                    {freeFeatures.map((f) => (
                      <div key={f} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-[#4BC957] shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Premium Card */}
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
                    <span className="text-4xl font-extrabold text-slate-900 dark:text-white">AED {Number(premiumPlan.price)}</span>
                    <span className="text-sm text-slate-600 dark:text-slate-400 ml-1">/ month</span>
                    {yearly && premiumPlan.discount && (
                      <span className="ml-2 text-[11px] font-bold bg-[#4BC957]/20 text-[#4BC957] px-2 py-0.5 rounded-full">{premiumPlan.discount}</span>
                    )}
                  </div>
                  <button
                    onClick={() => openCheckout({ id: premiumPlan.id, name: premiumPlan.name, price: premiumPlan.price })}
                    disabled={activeSub?.plan_name === premiumPlan.name}
                    className="w-full py-2.5 rounded-xl bg-[#4BC957] hover:bg-[#3DAF49] text-white text-sm font-bold transition-all mb-6 shadow-md shadow-[#4BC957]/30 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {activeSub?.plan_name === premiumPlan.name ? "Active" : `Upgrade to ${premiumPlan.name}`}
                  </button>
                  <div className="border-t border-green-200 dark:border-white/10 pt-5 space-y-3 flex-1">
                    {premiumFeatures.map((f) => (
                      <div key={f} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-[#4BC957] shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-700 dark:text-slate-300">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Billing History */}
        <div>
          <h2 className="text-xl font-extrabold text-foreground mb-4">Billing history</h2>
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            {history.length === 0 ? (
              <div className="px-6 py-8 text-center text-sm text-muted-foreground">No subscription history yet.</div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-xs font-semibold text-muted-foreground px-6 py-4 uppercase tracking-wider">Plan</th>
                    <th className="text-left text-xs font-semibold text-muted-foreground px-6 py-4 uppercase tracking-wider">Started</th>
                    <th className="text-left text-xs font-semibold text-muted-foreground px-6 py-4 uppercase tracking-wider">Expires</th>
                    <th className="text-left text-xs font-semibold text-muted-foreground px-6 py-4 uppercase tracking-wider">Status</th>
                    <th className="text-right text-xs font-semibold text-muted-foreground px-6 py-4 uppercase tracking-wider">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((row, i) => (
                    <tr key={row.id} className={i < history.length - 1 ? "border-b border-border" : ""}>
                      <td className="px-6 py-4 text-sm font-semibold text-foreground">{row.plan_name}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{new Date(row.started_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{new Date(row.expires_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${row.sub_status === "ACTIVE"
                          ? "bg-[#4BC957]/10 text-[#4BC957]"
                          : "bg-muted text-muted-foreground"
                          }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${row.sub_status === "ACTIVE" ? "bg-[#4BC957]" : "bg-muted-foreground"}`} />
                          {row.sub_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-foreground text-right">{row.currency} {row.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Security Note */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground border border-border rounded-xl px-5 py-4 bg-card">
          <ShieldCheck className="h-4 w-4 text-[#4BC957] shrink-0" />
          <span>Payments are secured by Stripe. Your billing details are never stored on our servers.</span>
        </div>
      </div>

      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-[#4BC957]" />
              Confirm Purchase
            </DialogTitle>
            <DialogDescription>
              Confirm this company subscription and continue to Stripe checkout.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            {selectedPlan && (
              <div className="bg-muted/50 border border-border rounded-xl px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-foreground">{selectedPlan.name}</p>
                  <p className="text-xs text-muted-foreground">Company subscription plan</p>
                </div>
                <p className="text-lg font-extrabold text-foreground">AED {Number(selectedPlan.price)}</p>
              </div>
            )}

            {/* <div className="bg-card border border-border rounded-xl px-4 py-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Profile ID</p>
              <p className="text-sm font-bold text-foreground mt-1">{companyProfileId ?? "Not available"}</p>
            </div> */}
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
              disabled={!companyProfileId || isCheckingOut}
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
