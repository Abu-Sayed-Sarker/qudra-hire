"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
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
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="group relative overflow-hidden bg-card/60 backdrop-blur-2xl border border-emerald-500/30 rounded-2xl p-6 shadow-lg shadow-emerald-500/5 hover:shadow-xl hover:shadow-emerald-500/10 hover:border-emerald-500/50 transition-all duration-500"
          >
            <div className="absolute inset-0 bg-linear-to-br from-emerald-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-emerald-500/5 to-transparent pointer-events-none z-0 skew-x-12" />

            <div className="relative z-10 flex items-start gap-5">
              <motion.div
                whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.5 }}
                className="h-12 w-12 rounded-xl bg-[#4BC957]/15 border border-[#4BC957]/30 flex items-center justify-center shrink-0 shadow-inner"
              >
                <Building2 className="h-6 w-6 text-[#4BC957]" />
              </motion.div>
              <div>
                <span className="text-[11px] font-bold tracking-widest text-[#4BC957] uppercase flex items-center gap-1.5 group-hover:scale-105 transition-transform origin-left">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4BC957] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4BC957]"></span>
                  </span>
                  ACTIVE SUBSCRIPTION
                </span>
                <h2 className="text-xl font-bold text-foreground mt-1 group-hover:text-[#4BC957] transition-colors">{activeSub.plan_name}</h2>
                <p className="text-sm font-medium text-muted-foreground mt-1">
                  {activeSub.currency} {activeSub.price} &bull; Renews on {new Date(activeSub.expires_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Plans Grid */}
        {(freePlan || premiumPlan) && (
          <div>
            <div className="flex flex-wrap items-center gap-5 justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-foreground tracking-tight">Available Plans</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Select a plan that fits your hiring needs</p>
              </div>
              {/* <div className="bg-muted p-1 rounded-full flex items-center border border-border">
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
              </div> */}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Free Card */}
              {freePlan && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="group relative overflow-hidden bg-card/60 backdrop-blur-2xl border border-border/80 rounded-xl p-8 flex flex-col h-full shadow-sm hover:shadow-2xl hover:shadow-slate-500/10 hover:border-slate-500/30 transition-all duration-500"
                >
                  <div className="absolute inset-0 bg-linear-to-br from-slate-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                  <div className="relative z-10 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-4">
                      <Zap className="w-5 h-5 text-muted-foreground group-hover:scale-110 transition-transform" />
                      <span className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase">STARTER</span>
                    </div>
                    <h3 className="text-3xl font-extrabold text-foreground mb-2 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">{freePlan.name}</h3>
                    <p className="text-sm font-medium text-muted-foreground mb-6">{freePlan.description || "Everything you need to get started."}</p>
                    <div className="flex items-baseline gap-1.5 mb-8">
                      <span className="text-4xl font-extrabold text-foreground">AED {Number(freePlan.price)}</span>
                      <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider ml-1">{freePlan.renewal}</span>
                    </div>
                    <button
                      onClick={() => openCheckout({ id: freePlan.id, name: freePlan.name, price: freePlan.price })}
                      disabled={activeSub?.plan_name === freePlan.name}
                      className="w-full h-12 rounded-2xl border border-border bg-background hover:bg-slate-100 dark:hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98] text-foreground text-sm font-bold transition-all mb-8 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {activeSub?.plan_name === freePlan.name ? "Current plan" : "Get started free"}
                    </button>
                    <div className="border-t border-border/50 pt-6 space-y-4 flex-1">
                      {freeFeatures.map((f) => (
                        <div key={f} className="flex items-start gap-3">
                          <span className="h-5 w-5 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-slate-200 dark:group-hover:bg-slate-800 transition-colors">
                            <Check className="w-3 h-3 text-muted-foreground" />
                          </span>
                          <span className="text-sm font-medium text-muted-foreground">{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Premium Card */}
              {premiumPlan && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="group relative bg-green-50/80 dark:bg-[#0f1f14]/80 backdrop-blur-2xl border-2 border-[#4BC957]/50 rounded-xl p-8 flex flex-col h-full shadow-2xl shadow-[#4BC957]/10 hover:shadow-[#4BC957]/20 hover:-translate-y-1 transition-all duration-500"
                >
                  <div className="absolute inset-0 bg-linear-to-br from-[#4BC957]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                  <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-white/10 to-transparent pointer-events-none z-0 skew-x-12" />

                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
                    <span className="bg-linear-to-r from-[#4BC957] to-emerald-400 text-white text-[11px] font-bold px-4 py-1.5 rounded-full tracking-wider shadow-lg shadow-[#4BC957]/30">MOST POPULAR</span>
                  </div>

                  <div className="relative z-10 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-4">
                      <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.5 }}>
                        <Star className="w-5 h-5 text-[#4BC957]" fill="currentColor" />
                      </motion.div>
                      <span className="text-[11px] font-bold tracking-widest text-[#4BC957] uppercase">RECOMMENDED</span>
                    </div>
                    <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2 bg-clip-text group-hover:text-transparent group-hover:bg-linear-to-r group-hover:from-emerald-500 group-hover:to-[#4BC957] transition-all duration-300">{premiumPlan.name}</h3>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-6">{premiumPlan.description || "Your always-on AI Recruiter."}</p>
                    <div className="flex items-baseline gap-1.5 mb-8">
                      <span className="text-4xl font-extrabold text-slate-900 dark:text-white">AED {Number(premiumPlan.price)}</span>
                      <span className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider ml-1">/ month</span>
                      {yearly && premiumPlan.discount && (
                        <span className="ml-2 text-[11px] font-bold bg-[#4BC957]/20 text-[#4BC957] px-2 py-0.5 rounded-full">{premiumPlan.discount}</span>
                      )}
                    </div>
                    <button
                      onClick={() => openCheckout({ id: premiumPlan.id, name: premiumPlan.name, price: premiumPlan.price })}
                      disabled={activeSub?.plan_name === premiumPlan.name}
                      className="w-full h-12 rounded-2xl font-bold text-sm bg-linear-to-r from-[#4BC957] to-emerald-500 hover:from-emerald-500 hover:to-[#4BC957] text-white shadow-xl shadow-[#4BC957]/30 hover:shadow-[#4BC957]/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 mb-8 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {activeSub?.plan_name === premiumPlan.name ? "Active" : `Upgrade to ${premiumPlan.name}`}
                    </button>
                    <div className="border-t border-green-200 dark:border-white/10 pt-6 space-y-4 flex-1">
                      {premiumFeatures.map((f) => (
                        <div key={f} className="flex items-start gap-3">
                          <span className="h-5 w-5 rounded-full bg-[#4BC957]/20 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                            <Check className="h-3 w-3 text-[#4BC957]" />
                          </span>
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        )}

        {/* Billing History */}
        <div>
          <h2 className="text-xl font-extrabold text-foreground mb-4">Billing history</h2>
          <div className="bg-card/60 backdrop-blur-2xl border border-border/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
            {history.length === 0 ? (
              <div className="px-6 py-8 text-center text-sm text-muted-foreground">No subscription history yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50 border-b border-border/50 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                      <th className="text-left px-6 py-4">Plan</th>
                      <th className="text-left px-6 py-4">Started</th>
                      <th className="text-left px-6 py-4">Expires</th>
                      <th className="text-left px-6 py-4">Status</th>
                      <th className="text-right px-6 py-4">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((row, i) => (
                      <motion.tr
                        key={row.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * i, duration: 0.4 }}
                        className={`group cursor-default hover:bg-muted/30 transition-colors ${i < history.length - 1 ? "border-b border-border/50" : ""}`}
                      >
                        <td className="px-6 py-4 font-bold text-foreground group-hover:text-emerald-500 transition-colors">{row.plan_name}</td>
                        <td className="px-6 py-4 font-medium text-muted-foreground">{new Date(row.started_at).toLocaleDateString()}</td>
                        <td className="px-6 py-4 font-medium text-muted-foreground">{new Date(row.expires_at).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full shadow-sm ${row.sub_status === "ACTIVE"
                            ? "bg-[#4BC957]/15 text-[#4BC957] border border-[#4BC957]/30"
                            : "bg-muted text-muted-foreground border border-border"
                            }`}>
                            {row.sub_status}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-extrabold text-foreground text-right">{row.currency} {row.price}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
