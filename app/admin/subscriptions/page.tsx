"use client";

import { useState } from "react";
import {
  Sparkles, Star, DollarSign, TrendingUp,
  Pencil, Check, Plus, Briefcase, Loader2, AlertTriangle,
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  useGetAdminSubscriptionDashboardQuery,
  type SubscriptionPlan,
} from "@/store/authApi";

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface PlanForm {
  name: string;
  type: string;
  title: string;
  price: string;
  renewal: string;
  discount: string;
  feature: string;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, change }: {
  icon: React.ElementType; label: string; value: string; change: string;
}) {
  return (
    <div className="rounded-xl bg-card border border-border p-5 flex flex-col gap-3 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <span className="text-xs font-medium text-[#21c55e]">↑ {change}</span>
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
      </div>
    </div>
  );
}

function PlanModal({
  open,
  onClose,
  mode,
}: {
  open: boolean;
  onClose: () => void;
  mode: "add" | "edit";
}) {
  const [form, setForm] = useState<PlanForm>({
    name: mode === "edit" ? "Starter" : "",
    type: mode === "edit" ? "Free" : "",
    title: mode === "edit" ? "Your always-on AI Recruiter." : "",
    price: mode === "edit" ? "0" : "",
    renewal: mode === "edit" ? "month" : "",
    discount: mode === "edit" ? "• Save 16%" : "",
    feature: mode === "edit" ? "Everything in Free" : "",
  });

  function set(field: keyof PlanForm, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  const inputCls =
    "w-full bg-muted border border-border rounded-lg px-3 py-2.5 text-sm text-foreground outline-none focus:border-[#6366f1] transition-colors placeholder:text-muted-foreground";

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="bg-card border border-border text-foreground max-w-md p-0 rounded-xl overflow-hidden">
        <DialogHeader className="px-6 py-5 border-b border-border">
          <DialogTitle className="text-lg font-bold text-foreground">
            {mode === "add" ? "Add plans" : "Edit Plan"}
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Plan Name</label>
            <input className={inputCls} value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Starter" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Plan Type</label>
            <input className={inputCls} value={form.type} onChange={e => set("type", e.target.value)} placeholder="e.g. Free / Premium" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Plan title</label>
            <input className={inputCls} value={form.title} onChange={e => set("title", e.target.value)} placeholder="Short description" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Price (AED)</label>
            <input className={inputCls} type="number" value={form.price} onChange={e => set("price", e.target.value)} placeholder="0" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Renewal</label>
            <input className={inputCls} value={form.renewal} onChange={e => set("renewal", e.target.value)} placeholder="month / year" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Discount</label>
            <input className={inputCls} value={form.discount} onChange={e => set("discount", e.target.value)} placeholder="e.g. • Save 16%" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Feature</label>
            <div className="flex gap-2">
              <input className={inputCls} value={form.feature} onChange={e => set("feature", e.target.value)} placeholder="Add a feature" />
              <button className="flex-shrink-0 w-10 h-10 rounded-lg bg-muted border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-[#6366f1] transition-colors">
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            className="px-5 py-2 rounded-lg bg-[#6366f1] hover:bg-[#6366f1]/90 text-white text-sm font-medium transition-colors"
          >
            Save
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function SubscriptionsPage() {
  const { data, isLoading, isError } = useGetAdminSubscriptionDashboardQuery();
  const dashboard = data?.data;

  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [modalMode, setModalMode] = useState<"add" | "edit" | null>(null);

  const metrics = dashboard?.metrics;
  const plans = dashboard?.plans ?? [];
  const activePremiumPlans = dashboard?.active_premium_plans ?? [];

  const freePlans = plans.filter(p => p.plan_type === "Free");
  const premiumPlans = plans.filter(p => p.plan_type === "Premium");

  const statsData = metrics ? [
    { icon: Sparkles, label: "Premium Plans Active", value: String(metrics.premium_active_count), change: "" },
    { icon: Star, label: "Starter Plans Active", value: String(metrics.starter_active_count), change: "" },
    { icon: DollarSign, label: "Monthly Revenue", value: `AED ${metrics.monthly_revenue.toLocaleString()}`, change: "" },
    { icon: TrendingUp, label: "Conversion Rate", value: `${metrics.conversion_rate_percentage}%`, change: "" },
  ] : [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-20 text-center">
        <AlertTriangle className="h-8 w-8 text-red-400 mx-auto mb-3" />
        <p className="text-red-400">Failed to load subscription data.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Subscription Plans</h1>
        <button
          onClick={() => setModalMode("add")}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#6366f1] hover:bg-[#6366f1]/90 text-white text-sm font-semibold transition-colors shadow"
        >
          <Plus className="h-4 w-4" /> Add plans
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Billing toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setBilling("monthly")}
          className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${billing === "monthly"
              ? "bg-[#21c55e] text-[#0f172a]"
              : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
        >
          Monthly
        </button>
        <button
          onClick={() => setBilling("yearly")}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${billing === "yearly"
              ? "bg-[#21c55e] text-[#0f172a]"
              : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
        >
          Yearly
          <span className="text-[11px] font-medium text-[#21c55e] bg-[#21c55e]/10 px-1.5 py-0.5 rounded-full">
            • Save 16%
          </span>
        </button>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Free Plan */}
        {freePlans.filter(p => p.category === "CANDIDATE").map(plan => (
          <div key={plan.id} className="rounded-xl bg-card border border-border p-6 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1">⚡ {plan.plan_title}</p>
                <h2 className="text-4xl font-black text-foreground">{plan.name}</h2>
                <p className="text-sm text-muted-foreground mt-1">{plan.description || "Everything you need to start your search."}</p>
              </div>
              <button
                onClick={() => setModalMode("edit")}
                className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <Pencil className="h-4 w-4" />
              </button>
            </div>
            <div className="mb-5">
              <span className="text-3xl font-black text-foreground">{plan.currency} {Number(plan.price).toFixed(0)} </span>
              <span className="text-muted-foreground text-sm">{plan.renewal}</span>
            </div>
            <button className="w-full py-2.5 rounded-lg border border-border text-sm font-semibold text-foreground hover:bg-muted transition-colors mb-5">
              Get started free
            </button>
            <ul className="space-y-2.5">
              {plan.features.map(f => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-foreground">
                  <Check className="h-4 w-4 text-[#21c55e] flex-shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
            <p className="text-xs text-muted-foreground mt-3">{plan.subscribers_count} subscriber{plan.subscribers_count !== 1 ? "s" : ""}</p>
          </div>
        ))}

        {/* Premium Plan */}
        {premiumPlans.filter(p => p.category === "CANDIDATE").map(plan => (
          <div key={plan.id} className="rounded-xl bg-card border border-[#6366f1]/40 p-6 shadow-md relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2">
              <span className="inline-block bg-[#21c55e] text-[#0f172a] text-[10px] font-black px-4 py-1 rounded-b-full tracking-wide">
                Most popular
              </span>
            </div>
            <div className="flex items-start justify-between mb-4 mt-3">
              <div>
                <p className="text-[11px] font-bold text-[#6366f1] uppercase tracking-widest mb-1">⭐ {plan.plan_title}</p>
                <h2 className="text-4xl font-black text-foreground">{plan.name}</h2>
                <p className="text-sm text-muted-foreground mt-1">{plan.description || "Your always-on AI Recruiter."}</p>
              </div>
              <button
                onClick={() => setModalMode("edit")}
                className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <Pencil className="h-4 w-4" />
              </button>
            </div>
            <div className="mb-5">
              <span className="text-3xl font-black text-foreground">
                {plan.currency} {Number(plan.price).toFixed(0)}{" "}
              </span>
              <span className="text-muted-foreground text-sm">
                / {billing === "monthly" ? "month" : "year"}
              </span>
              {plan.discount && plan.discount !== "None" && (
                <span className="ml-2 text-xs font-medium text-[#21c55e] bg-[#21c55e]/10 px-2 py-0.5 rounded-full">
                  {plan.discount}
                </span>
              )}
            </div>
            <button className="w-full py-2.5 rounded-lg bg-[#21c55e] hover:bg-[#21c55e]/90 text-[#0f172a] text-sm font-bold transition-colors mb-5">
              Upgrade to Premium
            </button>
            <ul className="space-y-2.5">
              {plan.features.map(f => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-foreground">
                  <Check className="h-4 w-4 text-[#21c55e] flex-shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
            <p className="text-xs text-muted-foreground mt-3">{plan.subscribers_count} subscriber{plan.subscribers_count !== 1 ? "s" : ""}</p>
          </div>
        ))}
      </div>

      {/* Active Premium Plans Table */}
      <div>
        <h2 className="text-base font-bold text-foreground mb-3">Active Premium Plans</h2>
        <div className="rounded-xl bg-card border border-border overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  {["CANDIDATE", "DESIGNATION", "BILLING", "START", "EXPIRES", "JOBS APPLIED"].map(h => (
                    <th key={h} className="px-5 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-left">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {activePremiumPlans.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-muted-foreground text-sm">No active premium plans.</td>
                  </tr>
                ) : (
                  activePremiumPlans.map((row, idx) => (
                    <tr
                      key={row.id}
                      className={`border-b border-border hover:bg-muted/40 transition-colors ${idx === activePremiumPlans.length - 1 ? "border-b-0" : ""}`}
                    >
                      <td className="px-5 py-3.5 text-sm font-semibold text-foreground">{row.candidate}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Briefcase className="h-3.5 w-3.5" />
                          {row.designation}
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-semibold border ${row.billing === "Month"
                            ? "bg-muted border-border text-foreground"
                            : "bg-[#6366f1]/10 border-[#6366f1]/20 text-[#6366f1]"
                          }`}>
                          {row.billing}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-muted-foreground">{row.start}</td>
                      <td className="px-5 py-3.5 text-sm text-muted-foreground">{row.expires}</td>
                      <td className="px-5 py-3.5 text-sm font-semibold text-foreground">{row.jobs_applied}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modals */}
      {(modalMode === "add" || modalMode === "edit") && (
        <PlanModal
          open={true}
          onClose={() => setModalMode(null)}
          mode={modalMode}
        />
      )}
    </div>
  );
}
