"use client";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  UserCheck,
  Building2,
  Briefcase,
  FileText,
  DollarSign,
  Star,
  Sparkles,
  AlertCircle,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import { useGetAdminDashboardQuery } from "@/store/authApi";
import { Skeleton } from "@/components/ui/skeleton";

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  change,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  change: string;
  color?: string;
}) {
  const accentColor = color || "primary";
  return (
    <div className="group rounded-2xl bg-card border border-border p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary/20">
      <div className="flex items-start justify-between">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center bg-${accentColor}/10`}>
          <Icon className={`h-5 w-5 text-${accentColor}`} />
        </div>
        {change && (
          <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-lg">
            <TrendingUp className="h-3 w-3" />
            {change}
          </span>
        )}
      </div>
      <div>
        <p className="text-3xl font-bold text-foreground tracking-tight">{value}</p>
        <p className="text-sm text-muted-foreground mt-1">{label}</p>
      </div>
    </div>
  );
}

function StatCardSkeleton() {
  return (
    <div className="rounded-2xl bg-card border border-border p-6 flex flex-col gap-4 shadow-sm">
      <div className="flex items-start justify-between">
        <Skeleton className="w-11 h-11 rounded-xl" />
        <Skeleton className="w-16 h-6 rounded-lg" />
      </div>
      <div>
        <Skeleton className="w-24 h-8 mb-2" />
        <Skeleton className="w-32 h-4" />
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Successful: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Failed: "bg-red-50 text-red-700 border-red-200",
    Pending: "bg-amber-50 text-amber-700 border-amber-200",
  };
  return (
    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${map[status] ?? "bg-muted text-muted-foreground border-border"}`}>
      {status}
    </span>
  );
}

function PlanBadge({ plan }: { plan: string }) {
  return (
    <span className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-semibold">
      {plan}
    </span>
  );
}

const PLAN_COLORS = ["#23C65F", "#3B82F6", "#F59E0B", "#8B5CF6", "#EF4444"];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  const { data, isLoading, isError, error } = useGetAdminDashboardQuery();

  if (isError) {
    return (
      <div className="space-y-6">
        <h1 className="text-[28px] font-bold text-foreground tracking-tight">Dashboard</h1>
        <div className="rounded-2xl bg-card border border-border p-12 flex flex-col items-center justify-center gap-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
            <AlertCircle className="w-7 h-7 text-red-500" />
          </div>
          <div className="text-center">
            <p className="text-base font-semibold text-foreground">Failed to load dashboard data</p>
            <p className="text-sm text-muted-foreground mt-1">
              {(error as { data?: { details?: string } })?.data?.details ?? "Please try again later."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const d = data?.data;

  const revenueData = d
    ? d.revenue_overview.labels.map((label, i) => {
        const entry: Record<string, string | number> = { month: label };
        d.revenue_overview.datasets.forEach((ds) => {
          entry[ds.label] = ds.data[i];
        });
        return entry;
      })
    : [];

  const userGrowthData = d
    ? d.user_growth.labels.map((label, i) => ({
        month: label,
        users: d.user_growth.data[i],
      }))
    : [];

  const appsTrendData = d
    ? d.applications_trend.labels.map((label, i) => ({
        day: label,
        apps: d.applications_trend.data[i],
      }))
    : [];

  const planDistributionData = d
    ? d.plan_distribution.data.map((item, i) => ({
        ...item,
        color: PLAN_COLORS[i % PLAN_COLORS.length],
      }))
    : [];

  const revenueDataset = d?.revenue_overview.datasets.find((ds) =>
    ds.label.toLowerCase().includes("revenue")
  );
  const revenueKey = revenueDataset?.label ?? d?.revenue_overview.datasets[1]?.label ?? "";

  const tooltipStyle = {
    background: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: 12,
    color: "var(--foreground)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    padding: "8px 12px",
  };

  const fmt = (v: string | number) =>
    String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-[28px] font-bold text-foreground tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Welcome back. Here&apos;s what&apos;s happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : d ? (
          <>
            <StatCard icon={Users} label="Total Users" value={fmt(d.cards.total_users.value)} change={d.cards.total_users.change} />
            <StatCard icon={UserCheck} label="Total Candidates" value={fmt(d.cards.total_candidates.value)} change={d.cards.total_candidates.change} />
            <StatCard icon={Building2} label="Total Companies" value={fmt(d.cards.total_companies.value)} change={d.cards.total_companies.change} />
            <StatCard icon={Briefcase} label="Active Jobs" value={fmt(d.cards.active_jobs.value)} change={d.cards.active_jobs.change} />
            <StatCard icon={FileText} label="Applications Today" value={fmt(d.cards.applications_today.value)} change={d.cards.applications_today.change} />
            <StatCard icon={DollarSign} label="Yearly Revenue" value={String(d.cards.yearly_revenue.value)} change={d.cards.yearly_revenue.change} />
            <StatCard icon={Star} label="Active Subscriptions" value={fmt(d.cards.active_subscriptions.value)} change={d.cards.active_subscriptions.change} />
            <StatCard icon={Sparkles} label="Premium Subscriptions" value={String(d.cards.premium_subscriptions.value)} change={d.cards.premium_subscriptions.change} />
          </>
        ) : null}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Revenue Overview */}
        <div className="col-span-2 rounded-2xl bg-card border border-border p-6 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-base font-semibold text-foreground">{d?.revenue_overview.title ?? "Revenue Overview"}</p>
              <p className="text-sm text-muted-foreground mt-0.5">{d?.revenue_overview.subtitle ?? ""}</p>
            </div>
            <span className="text-xs font-medium text-muted-foreground bg-muted px-3 py-1.5 rounded-lg">{d?.revenue_overview.period ?? ""}</span>
          </div>
          {isLoading ? (
            <Skeleton className="w-full h-[220px] rounded-xl" />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={revenueData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#23C65F" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#23C65F" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.04} />
                <XAxis dataKey="month" tick={{ fill: "currentColor", opacity: 0.4, fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "currentColor", opacity: 0.4, fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${v / 1000}k`} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey={revenueKey} stroke="#23C65F" strokeWidth={2.5} fill="url(#revGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Plan Distribution */}
        <div className="rounded-2xl bg-card border border-border p-6 shadow-sm flex flex-col">
          <p className="text-base font-semibold text-foreground">{d?.plan_distribution.title ?? "Plan Distribution"}</p>
          <p className="text-sm text-muted-foreground mt-0.5">{d?.plan_distribution.subtitle ?? ""}</p>
          {isLoading ? (
            <Skeleton className="w-full h-[180px] mt-4 rounded-xl" />
          ) : (
            <>
              <div className="flex-1 flex justify-center items-center mt-2">
                <ResponsiveContainer width="100%" height={170}>
                  <PieChart>
                    <Pie data={planDistributionData} cx="50%" cy="50%" innerRadius={52} outerRadius={72} dataKey="value" stroke="none">
                      {planDistributionData.map((entry, i) => (
                        <Cell key={`${entry.name}-${i}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2.5 mt-3">
                {planDistributionData.map((item, idx) => (
                  <div key={`${item.name}-${idx}`} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
                      <span className="text-sm text-muted-foreground">{item.name}</span>
                    </div>
                    <span className="text-sm text-foreground font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* User Growth */}
        <div className="rounded-2xl bg-card border border-border p-6 shadow-sm">
          <p className="text-base font-semibold text-foreground mb-4">{d?.user_growth.title ?? "User Growth"}</p>
          {isLoading ? (
            <Skeleton className="w-full h-[180px] rounded-xl" />
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={userGrowthData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.04} />
                <XAxis dataKey="month" tick={{ fill: "currentColor", opacity: 0.4, fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "currentColor", opacity: 0.4, fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="users" fill="#23C65F" radius={[6, 6, 0, 0]} barSize={22} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Applications Trend */}
        <div className="rounded-2xl bg-card border border-border p-6 shadow-sm">
          <p className="text-base font-semibold text-foreground mb-4">{d?.applications_trend.title ?? "Applications Trend"}</p>
          {isLoading ? (
            <Skeleton className="w-full h-[180px] rounded-xl" />
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={appsTrendData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.04} />
                <XAxis dataKey="day" tick={{ fill: "currentColor", opacity: 0.4, fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "currentColor", opacity: 0.4, fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="apps" stroke="#3B82F6" strokeWidth={2.5} dot={{ fill: "#3B82F6", r: 4 }} activeDot={{ r: 6, stroke: "#3B82F6", strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Candidates */}
        <div className="rounded-2xl bg-card border border-border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <p className="text-base font-semibold text-foreground">Recent Candidates</p>
            <button className="text-sm text-primary hover:text-primary/80 font-medium transition-colors">View All</button>
          </div>
          <div className="space-y-4">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-10 h-10 rounded-xl" />
                      <div>
                        <Skeleton className="w-28 h-3.5 mb-1.5" />
                        <Skeleton className="w-20 h-2.5" />
                      </div>
                    </div>
                    <Skeleton className="w-16 h-6 rounded-lg" />
                  </div>
                ))
              : d?.recent_candidates.map((c) => (
                  <div key={c.email} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold text-white flex-shrink-0 bg-gradient-to-br from-primary to-emerald-400 shadow-sm">
                        {c.initials}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{c.name}</p>
                        <p className="text-xs text-muted-foreground">{c.designations}</p>
                      </div>
                    </div>
                    <PlanBadge plan={c.plan} />
                  </div>
                ))}
          </div>
        </div>

        {/* Pending Verification */}
        <div className="rounded-2xl bg-card border border-border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <p className="text-base font-semibold text-foreground">Pending Verification</p>
            <button className="text-sm text-primary hover:text-primary/80 font-medium transition-colors">Review</button>
          </div>
          <div className="space-y-4">
            {isLoading
              ? Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-10 h-10 rounded-xl" />
                      <div>
                        <Skeleton className="w-32 h-3.5 mb-1.5" />
                        <Skeleton className="w-16 h-2.5" />
                      </div>
                    </div>
                    <Skeleton className="w-16 h-6 rounded-lg" />
                  </div>
                ))
              : d?.pending_verifications.map((p) => (
                  <div key={p.company_name} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 bg-amber-50 text-amber-600 border border-amber-200">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{p.company_name}</p>
                        <p className="text-xs text-muted-foreground">{p.location}</p>
                      </div>
                    </div>
                    <StatusBadge status={p.status} />
                  </div>
                ))}
          </div>
        </div>

        {/* Recent Payments */}
        <div className="rounded-2xl bg-card border border-border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <p className="text-base font-semibold text-foreground">Recent Payments</p>
            <button className="text-sm text-primary hover:text-primary/80 font-medium transition-colors">View All</button>
          </div>
          <div className="space-y-4">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <Skeleton className="w-28 h-3.5 mb-1.5" />
                      <Skeleton className="w-24 h-2.5" />
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <Skeleton className="w-16 h-3.5" />
                      <Skeleton className="w-16 h-5 rounded-lg" />
                    </div>
                  </div>
                ))
              : d?.recent_payments.map((p, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">{p.candidate_name}</p>
                      <p className="text-xs text-muted-foreground">{p.designation}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <span className="text-sm font-semibold text-foreground">{p.amount}</span>
                      <StatusBadge status={p.status} />
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
}
