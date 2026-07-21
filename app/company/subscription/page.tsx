"use client";

import React, { useState } from "react";
import { Check, Star, Zap, ShieldCheck, Building2, Loader2 } from "lucide-react";
import { useGetSubscriptionHistoryQuery, useGetSubscriptionPlansQuery } from "@/store/authApi";

export default function CompanySubscriptionPage() {
  const { data: historyData, isLoading: historyLoading } = useGetSubscriptionHistoryQuery();
  const { data: plansData, isLoading: plansLoading } = useGetSubscriptionPlansQuery();

  const [yearly, setYearly] = useState(true);

  const history = historyData?.data ?? [];
  const allPlans = plansData?.data ?? [];
  const plans = allPlans.filter((p) => p.category === "COMPANY");

  const activeSub = history.find((h) => h.sub_status === "ACTIVE");
  const freePlan = plans.find((p) => p.plan_type === "Free");
  const premiumPlan = plans.find((p) => p.plan_type === "Premium");

  const isLoading = historyLoading || plansLoading;

  if (isLoading) {
    return (
      <div className="min-h-full bg-background text-foreground">
        <div className="max-w-full mx-2 sm:mx-auto px-6 py-8 flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
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
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Current Plan</p>
                <h2 className="text-2xl font-extrabold text-foreground mt-0.5">{activeSub.plan_name}</h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Renews {new Date(activeSub.expires_at).toLocaleDateString()} &bull; {activeSub.currency} {activeSub.price}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Plan Toggle + Cards */}
        {premiumPlan && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-extrabold text-foreground">Choose your plan</h2>
              <div className="flex items-center gap-1 bg-muted border border-border rounded-full p-1">
                <button
                  onClick={() => setYearly(false)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                    !yearly ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setYearly(true)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                    yearly ? "bg-[#4BC957] text-white shadow-sm" : "text-muted-foreground"
                  }`}
                >
                  Yearly, Save 16%
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
                  <button className="w-full py-2.5 rounded-xl border border-border bg-background hover:bg-muted text-foreground text-sm font-bold transition-all mb-6">
                    {activeSub?.plan_name === freePlan.name ? "Current plan" : "Get started free"}
                  </button>
                  <div className="border-t border-border pt-5 space-y-3 flex-1">
                    {freePlan.features.map((f) => (
                      <div key={f} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-[#4BC957] shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Premium Card */}
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
                  {yearly && (
                    <span className="ml-2 text-[11px] font-bold bg-[#4BC957]/20 text-[#4BC957] px-2 py-0.5 rounded-full">{premiumPlan.discount}</span>
                  )}
                </div>
                <button className="w-full py-2.5 rounded-xl bg-[#4BC957] hover:bg-[#3DAF49] text-white text-sm font-bold transition-all mb-6 shadow-md shadow-[#4BC957]/30">
                  {activeSub?.plan_name === premiumPlan.name ? "Active" : "Upgrade to Premium"}
                </button>
                <div className="border-t border-green-200 dark:border-white/10 pt-5 space-y-3 flex-1">
                  {premiumPlan.features.map((f) => (
                    <div key={f} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-[#4BC957] shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
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
                        <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${
                          row.sub_status === "ACTIVE"
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
    </div>
  );
}
