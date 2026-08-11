"use client";

import { useState } from "react";
import {
  Sparkles, Star, DollarSign, TrendingUp,
  Pencil, Check, Plus, Briefcase, Loader2, AlertTriangle, Trash2,
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  useGetAdminSubscriptionDashboardQuery,
  useCreateSubscriptionPlanMutation,
  useUpdateSubscriptionPlanMutation,
  useDeleteSubscriptionPlanMutation,
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
  plan,
}: {
  open: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  plan?: SubscriptionPlan | null;
}) {
  const [createPlan, { isLoading: isCreating }] = useCreateSubscriptionPlanMutation();
  const [updatePlan, { isLoading: isUpdating }] = useUpdateSubscriptionPlanMutation();
  const isLoading = isCreating || isUpdating;

  const [form, setForm] = useState({
    name: plan?.name ?? "",
    category: plan?.category ?? "CANDIDATE",
    price: plan?.price ?? "0",
    currency: plan?.currency ?? "AED",
    description: plan?.description ?? "",
    is_active: plan?.is_active ?? true,
    plan_title: plan?.plan_title ?? "",
    plan_type: plan?.plan_type ?? "Free",
    renewal: plan?.renewal ?? "forever",
    discount: plan?.discount ?? "",
    features: plan?.features ?? [],
  });

  const [featureInput, setFeatureInput] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function set<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm(prev => ({ ...prev, [k]: v }));
  }

  function addFeature() {
    if (featureInput.trim()) {
      set("features", [...form.features, featureInput.trim()]);
      setFeatureInput("");
    }
  }

  function removeFeature(idx: number) {
    set("features", form.features.filter((_, i) => i !== idx));
  }

  async function handleSave() {
    setError("");
    setSuccess(false);
    try {
      if (mode === "add") {
        await createPlan(form).unwrap();
      } else if (plan) {
        await updatePlan({ id: plan.id, ...form }).unwrap();
      }
      setSuccess(true);
      setTimeout(onClose, 900);
    } catch (err: unknown) {
      setError((err as { data?: { details?: string } })?.data?.details ?? "Save failed.");
    }
  }

  const inputCls =
    "w-full bg-muted border border-border rounded-lg px-3 py-2.5 text-sm text-foreground outline-none focus:border-[#6366f1] transition-colors placeholder:text-muted-foreground";

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="bg-card border border-border text-foreground max-w-md p-0 rounded-xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <DialogHeader className="px-6 py-5 border-b border-border">
          <DialogTitle className="text-lg font-bold text-foreground">
            {mode === "add" ? "Add Plan" : "Edit Plan"}
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-5 space-y-4">
          {error && <p className="text-xs text-red-500 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg">{error}</p>}
          {success && <p className="text-xs text-[#21c55e] bg-[#21c55e]/10 border border-[#21c55e]/20 px-3 py-2 rounded-lg">Saved!</p>}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Plan Name</label>
              <input className={inputCls} value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Pro" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Plan Title</label>
              <input className={inputCls} value={form.plan_title} onChange={e => set("plan_title", e.target.value)} placeholder="e.g. Candidate Pro" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Category</label>
              <select className={inputCls} value={form.category} onChange={e => set("category", e.target.value)}>
                <option value="CANDIDATE">CANDIDATE</option>
                <option value="COMPANY">COMPANY</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Plan Type</label>
              <select className={inputCls} value={form.plan_type} onChange={e => set("plan_type", e.target.value)}>
                <option value="Free">Free</option>
                <option value="Premium">Premium</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Price</label>
              <input className={inputCls} type="number" value={form.price} onChange={e => set("price", e.target.value)} placeholder="0" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Currency</label>
              <select className={inputCls} value={form.currency} onChange={e => set("currency", e.target.value)}>
                <option value="AED">AED</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="SAR">SAR</option>
                <option value="QAR">QAR</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Renewal</label>
              <select className={inputCls} value={form.renewal} onChange={e => set("renewal", e.target.value)}>
                <option value="forever">forever</option>
                <option value="month">month</option>
                <option value="year">year</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Discount</label>
              <input className={inputCls} value={form.discount} onChange={e => set("discount", e.target.value)} placeholder="e.g. Save 16%" />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Description</label>
            <textarea
              rows={2}
              value={form.description}
              onChange={e => set("description", e.target.value)}
              placeholder="Plan description..."
              className={`${inputCls} resize-none`}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Active</label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => set("is_active", !form.is_active)}
                className={`relative w-10 h-5 rounded-full transition-colors ${form.is_active ? "bg-[#21c55e]" : "bg-muted"}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${form.is_active ? "translate-x-5" : ""}`} />
              </button>
              <span className="text-sm text-muted-foreground">{form.is_active ? "Active" : "Inactive"}</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Features</label>
            <div className="flex gap-2 mb-2">
              <input
                className={inputCls}
                value={featureInput}
                onChange={e => setFeatureInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addFeature())}
                placeholder="Add a feature"
              />
              <button
                type="button"
                onClick={addFeature}
                className="shrink-0 w-10 h-10 rounded-lg bg-muted border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-[#6366f1] transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            {form.features.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {form.features.map((f, i) => (
                  <span key={i} className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-muted border border-border text-xs text-foreground">
                    {f}
                    <button onClick={() => removeFeature(i)} className="text-muted-foreground hover:text-red-500 ml-0.5">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading || success}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#6366f1] hover:bg-[#6366f1]/90 disabled:opacity-60 text-white text-sm font-medium transition-colors"
          >

            {isLoading ? "Saving…" : "Save"}
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
  const [deletePlan] = useDeleteSubscriptionPlanMutation();

  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [modalMode, setModalMode] = useState<"add" | "edit" | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);

  async function handleDeletePlan(id: string, name: string) {
    if (confirm(`Delete plan "${name}"? This cannot be undone.`)) {
      await deletePlan(id);
    }
  }

  const metrics = dashboard?.metrics;
  const plans = dashboard?.plans ?? [];
  const activePremiumPlans = dashboard?.active_premium_plans ?? [];

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Subscription Plans</h1>
        <button
          onClick={() => { setSelectedPlan(null); setModalMode("add"); }}
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
      {/* <div className="flex items-center gap-3">
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

        </button>
      </div> */}

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">All Plans</h1>

      </div>


      {/* Plan Cards */}
      <div className={`grid gap-5 items-stretch ${plans.length === 1 ? "grid-cols-1 max-w-md" :
        plans.length === 2 ? "grid-cols-1 md:grid-cols-2" :
          plans.length === 3 ? "grid-cols-1 md:grid-cols-3" :
            "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        }`}>
        {plans.map(plan => {
          const isFree = plan.plan_type === "Free" || plan.name?.toLowerCase() === "free" || Number(plan.price) === 0;

          if (isFree) {
            return (
              <div key={plan.id} className="rounded-xl bg-card border border-border p-6 shadow-sm flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1">⚡ {plan.category} - {plan.plan_type || "STARTER"}</p>
                    <h2 className="text-4xl font-black text-foreground">{plan.name}</h2>
                    <p className="text-sm text-muted-foreground mt-1">{plan.description || "Everything you need to start."}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => { setSelectedPlan(plan); setModalMode("edit"); }}
                      className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      title="Edit Plan"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeletePlan(plan.id, plan.name)}
                      className="p-1.5 rounded-md hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors"
                      title="Delete Plan"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="mb-5">
                  <span className="text-3xl font-black text-foreground">{plan.currency} {Number(plan.price).toFixed(0)} </span>
                  <span className="text-muted-foreground text-sm">/ {plan.renewal}</span>
                </div>
                <div className="border-t border-border/50 mb-5" />
                <ul className="space-y-2.5 flex-1">
                  {plan.features.map((f: string) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-foreground">
                      <Check className="h-4 w-4 text-[#21c55e] shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-muted-foreground mt-5 pt-3 border-t border-border/50 font-medium">{plan.subscribers_count} subscriber{plan.subscribers_count !== 1 ? "s" : ""}</p>
              </div>
            );
          } else {
            return (
              <div key={plan.id} className="rounded-xl bg-card border border-[#6366f1]/40 p-6 shadow-md relative overflow-hidden flex flex-col">
                <div className="absolute top-0 left-1/2 -translate-x-1/2">
                  <span className="inline-block bg-[#21c55e] text-[#0f172a] text-[10px] font-black px-4 py-1 rounded-b-full tracking-wide uppercase">
                    {plan.category}
                  </span>
                </div>
                <div className="flex items-start justify-between mb-4 mt-3">
                  <div>
                    <p className="text-[11px] font-bold text-[#6366f1] uppercase tracking-widest mb-1">⭐ {plan.plan_type || "PREMIUM"}</p>
                    <h2 className="text-4xl font-black text-foreground">{plan.name}</h2>
                    <p className="text-sm text-muted-foreground mt-1">{plan.description || "Your always-on premium features."}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => { setSelectedPlan(plan); setModalMode("edit"); }}
                      className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      title="Edit Plan"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeletePlan(plan.id, plan.name)}
                      className="p-1.5 rounded-md hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors"
                      title="Delete Plan"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="mb-5">
                  <span className="text-3xl font-black text-foreground">
                    {plan.currency} {Number(plan.price).toFixed(0)}{" "}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    / {plan.renewal}
                  </span>
                  {plan.discount && plan.discount !== "None" && (
                    <span className="ml-2 text-xs font-medium text-[#21c55e] bg-[#21c55e]/10 px-2 py-0.5 rounded-full">
                      {plan.discount}
                    </span>
                  )}
                </div>
                <div className="border-t border-[#6366f1]/20 mb-5" />
                <ul className="space-y-2.5 flex-1">
                  {plan.features.map((f: string) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-foreground">
                      <Check className="h-4 w-4 text-[#21c55e] shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-muted-foreground mt-5 pt-3 border-t border-[#6366f1]/20 font-medium">{plan.subscribers_count} subscriber{plan.subscribers_count !== 1 ? "s" : ""}</p>
              </div>
            );
          }
        })}
      </div>

      {/* Active Premium Plans Table */}
      <div>
        <h2 className="text-base font-bold text-foreground mb-3">Active Premium Plans</h2>
        <div className="rounded-xl bg-card border border-border overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-175">
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
          onClose={() => { setModalMode(null); setSelectedPlan(null); }}
          mode={modalMode}
          plan={modalMode === "edit" ? selectedPlan : null}
        />
      )}
    </div>
  );
}
