"use client";

import React, { useState } from "react";
import { Check, Zap, Star, ShieldCheck, Lock, Loader2 } from "lucide-react";
import { useGetSubscriptionHistoryQuery, useGetSubscriptionPlansQuery } from "@/store/authApi";

export default function CandidateSubscriptionPage() {
  const { data: historyData, isLoading: historyLoading } = useGetSubscriptionHistoryQuery();
  const { data: plansData, isLoading: plansLoading } = useGetSubscriptionPlansQuery();

  const [yearly, setYearly] = useState(false);

  const history = historyData?.data ?? [];
  const allPlans = plansData?.data ?? [];
  const plans = allPlans.filter((p) => p.category === "CANDIDATE");

  const activeSub = history.find((h) => h.sub_status === "ACTIVE");
  const freePlan = plans.find((p) => p.plan_type === "Free");
  const premiumPlan = plans.find((p) => p.plan_type === "Premium");

  const isLoading = historyLoading || plansLoading;

  if (isLoading) {
    return (
      <div className="min-h-full bg-background text-foreground">
        <div className="max-w-full mx-2 sm:mx-auto px-12 py-8 flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-background text-foreground">
      <div className="max-w-full mx-2 sm:mx-auto px-12 py-8 space-y-8">

        {/* Header */}
        <div>
          <p className="text-xs text-muted-foreground mb-1">Your Plan</p>
          <h1 className="text-3xl font-bold text-foreground">Subscription</h1>
          <p className="text-sm text-muted-foreground mt-1">Unlock your AI Recruiter. Cancel anytime.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-xl px-5 py-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-[#4BC957]" />
              <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">Active Subscriptions</span>
            </div>
            <p className="text-4xl font-extrabold text-foreground">{activeSub ? 1 : 0}</p>
          </div>
          <div className="bg-card border border-border rounded-xl px-5 py-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-[#4BC957]" />
              <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">Total Subscriptions</span>
            </div>
            <p className="text-4xl font-extrabold text-foreground">{history.length}</p>
          </div>
          <div className="bg-card border border-border rounded-xl px-5 py-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Lock className="w-4 h-4 text-slate-400" />
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
        {premiumPlan && (
          <div>
            <div className="flex items-center justify-between mb-4">
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
                  Yearly, Save 16%
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
                  <button className="w-full h-11 rounded-xl font-bold text-sm border border-border text-foreground hover:bg-muted transition-all mb-5">
                    {activeSub?.plan_name === freePlan.name ? "Current plan" : "Get started free"}
                  </button>
                  <div className="border-t border-border mb-4" />
                  <ul className="space-y-2.5 flex-1">
                    {freePlan.features.map((f) => (
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
              <div className="relative bg-green-50 dark:bg-[#0f1f14]  border-2 border-[#4BC957]/50 rounded-2xl p-6 flex flex-col h-full shadow-xl shadow-[#4BC957]/10">
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
                <button className="w-full h-11 rounded-xl font-bold text-sm bg-[#4BC957] hover:bg-[#3DAF49] text-white shadow-lg shadow-[#4BC957]/20 transition-all mb-5">
                  {activeSub?.plan_name === premiumPlan.name ? "Active" : "Upgrade to Premium"}
                </button>
                <div className="border-t border-green-200 dark:border-white/10 mb-4" />
                <ul className="space-y-2.5 flex-1">
                  {premiumPlan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                      <span className="h-4 w-4 rounded-full bg-[#4BC957]/15 flex items-center justify-center shrink-0">
                        <Check className="h-2.5 w-2.5 text-[#4BC957]" />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Billing History */}
        <div>
          <h2 className="text-lg font-bold text-foreground mb-3">Billing history</h2>
          <div className="border border-border rounded-xl overflow-hidden bg-card shadow-sm">
            {history.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-muted-foreground">No subscription history yet.</div>
            ) : (
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
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          row.sub_status === "ACTIVE"
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
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
