"use client";

import React from "react";
import {
  Sparkles,
  Bell,
  Briefcase,
  Target,
  Bot,
  Pencil,
  MapPin,
  Clock,
  DollarSign,
  Play,
  Loader2,
  CheckCircle2,
  Circle,
  Shield,
  TrendingUp,
  Zap,
  ArrowUpRight,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { useGetCandidateDashboardQuery, useGetCandidateProfilesQuery } from "@/store/authApi";
import {
  SkeletonStatCard,
  SkeletonCard,
  SkeletonChart,
  SkeletonText,
  Skeleton,
} from "@/components/ui/skeleton-cards";
import { ErrorState } from "@/components/ui/error-state";
import { motion, type Variants } from "framer-motion";
import { get403Message } from "@/lib/utils";
import SubscriptionRequiredCard from "@/components/ui/subscription-required-card";

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, when: "beforeChildren" },
  },
};

const cardHover =
  "transition-all duration-300 hover:shadow-xl hover:shadow-black/5 hover:-translate-y-0.5";

export default function CandidateDashboard() {
  const { data, isLoading, isError, error, refetch } = useGetCandidateDashboardQuery();
  const { data: profilesData } = useGetCandidateProfilesQuery();
  const profileId = profilesData?.data?.[0]?.id;
  const d = data?.data;

  if (isLoading) {
    return (
      <div className="p-6 md:p-10 space-y-8 max-w-full mx-auto">
        <div className="space-y-3">
          <div className="h-10 w-full max-w-[18rem] bg-gradient-to-r from-muted to-muted/50 rounded-2xl animate-pulse" />
          <div className="h-5 w-full max-w-[24rem] bg-muted/50 rounded-xl animate-pulse" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonStatCard key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <SkeletonCard />
            <SkeletonChart />
          </div>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-card/50 border border-border/50 rounded-3xl p-6 space-y-4">
                <Skeleton className="h-6 w-32" />
                <SkeletonText lines={3} />
                <Skeleton className="h-12 w-full rounded-2xl" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError || !d) {
    const msg = get403Message(error);
    if (msg) {
      return <SubscriptionRequiredCard message={msg} />;
    }
    return (
      <div className="p-6 md:p-10 max-w-full mx-auto">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-16 w-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Failed to load dashboard</h2>
          <p className="text-sm text-muted-foreground mb-4 max-w-sm">
            Something went wrong while loading your dashboard. Please try again.
          </p>
          <button onClick={() => refetch()} className="text-sm font-semibold text-[#23C65F] hover:underline">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const m = d.metrics;
  const aa = d.auto_apply;
  const cv = d.cv_strength;
  const pref = d.preferences;

  const stats = [
    { label: "Profile match", value: m.profile_match_strength, icon: Target, color: "text-emerald-600", bg: "bg-emerald-500/10", border: "border-emerald-500/20", glow: "shadow-emerald-500/10" },
    { label: "Active applications", value: String(m.active_applications), icon: Briefcase, color: "text-blue-600", bg: "bg-blue-500/10", border: "border-blue-500/20", glow: "shadow-blue-500/10" },
    { label: "New matches", value: String(m.new_matches_today), icon: Bell, color: "text-violet-600", bg: "bg-violet-500/10", border: "border-violet-500/20", glow: "shadow-violet-500/10" },
    { label: "Plan", value: m.plan_badge, icon: Shield, color: "text-amber-600", bg: "bg-amber-500/10", border: "border-amber-500/20", glow: "shadow-amber-500/10" },
  ];

  const matchColor = (score: string) => {
    const n = parseInt(score);
    if (n >= 80) return "text-emerald-600 bg-emerald-500/10 border-emerald-500/20";
    if (n >= 65) return "text-amber-600 bg-amber-500/10 border-amber-500/20";
    return "text-muted-foreground bg-muted border-border";
  };

  const statusColor = (s: string) => {
    const map: Record<string, string> = {
      Applied: "bg-muted text-muted-foreground border-border",
      Shortlisted: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
      Interview: "bg-blue-500/10 text-blue-600 border-blue-500/20",
      Offer: "bg-violet-500/10 text-violet-600 border-violet-500/20",
      Hired: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
      Rejected: "bg-red-500/10 text-red-600 border-red-500/20",
    };
    return map[s] ?? "bg-muted text-muted-foreground border-border";
  };

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-full mx-auto">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative"
      >
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-full blur-3xl" />
        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight relative">
          {d.candidate_name}
        </h1>
        <p className="text-muted-foreground mt-2 text-base font-medium flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600">
            <TrendingUp className="h-3 w-3" />
          </span>
          {d.role_title}
        </p>
      </motion.div>

      {/* Stats Row - Premium Cards */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
        role="list"
        aria-label="Dashboard statistics"
      >
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={i}
              variants={fadeIn}
              custom={i}
              role="listitem"
              className={`group relative bg-card/80 backdrop-blur-sm border ${s.border} rounded-3xl p-4 sm:p-6 ${cardHover} cursor-pointer`}
              tabIndex={0}
              aria-label={`${s.label}: ${s.value}`}
            >
              <div className="absolute inset-0  rounded-3xl pointer-events-none" />
              <div className="relative flex items-start justify-between gap-2 min-w-0">
                <div className="space-y-1.5 min-w-0">
                  <span className="text-[10px] sm:text-[11px] font-bold text-muted-foreground uppercase tracking-widest truncate block">{s.label}</span>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-foreground tracking-tight break-words">{s.value}</p>
                </div>
                <div className={`${s.bg} ${s.color} p-2.5 sm:p-3 rounded-2xl border ${s.border} shadow-lg ${s.glow} group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-border to-transparent opacity-50" />
            </motion.div>
          );
        })}
      </motion.div>

      {/* AI Interview Invites */}
      {d.interview_invites.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
              <Bot className="h-5 w-5 text-emerald-600" />
            </div>
            <h2 className="text-lg font-bold text-foreground">AI Interview Invites</h2>
          </div>
          {d.interview_invites.map((invite: any, idx: number) => (
            <motion.div
              key={invite.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + idx * 0.08, duration: 0.4 }}
              className={`relative bg-card/80 backdrop-blur-sm border border-border rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 ${cardHover}`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-3xl pointer-events-none" />
              <div className="flex items-center gap-4 min-w-0 relative">
                <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-600 flex-shrink-0 shadow-lg shadow-emerald-500/10">
                  <Bot className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <p className="text-base font-bold text-foreground">{invite.company_name}</p>
                  <p className="text-muted-foreground mt-1 text-sm font-medium">{invite.role_context}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
                      <Clock className="h-3.5 w-3.5" />
                      {invite.duration_minutes} min
                    </span>
                    <span className="text-xs text-muted-foreground/80 truncate font-medium max-w-[200px]">{invite.message}</span>
                  </div>
                </div>
              </div>
              <Link
                href={`/candidate/interview?invite=${invite.id}`}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2.5 rounded-2xl transition-all shadow-lg shadow-emerald-600/20 active:scale-[0.97] text-sm flex-shrink-0 relative"
                aria-label={`Start interview with ${invite.company_name}`}
              >
                <Play className="h-4 w-4" />
                Start
                <ArrowUpRight className="h-3.5 w-3.5 opacity-60" />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Main 2-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — recommendations + applications */}
        <div className="lg:col-span-2 space-y-6">
          {/* Daily AI Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative bg-card/80 backdrop-blur-sm border border-border rounded-3xl p-6 md:p-8 space-y-5 shadow-sm"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.02] to-transparent rounded-3xl pointer-events-none" />
            <div className="relative flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                  <Sparkles className="h-5 w-5 text-emerald-600" />
                </div>
                <h2 className="text-lg font-bold text-foreground">Daily AI Recommendations</h2>
              </div>
              <Link href="/candidate/applications" className="text-emerald-600 font-semibold hover:text-emerald-500 text-sm flex items-center gap-1 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500/40 rounded-lg px-2 py-1">
                View all
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative" role="list" aria-label="Job recommendations">
              {d.recommendations.map((job, idx) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + idx * 0.06, duration: 0.4 }}
                  role="listitem"
                >
                  <Link href={`/candidate/jobs/detail?id=${job.id}`} className="block min-w-0">
                    <div className={`group relative bg-background/60 border border-border/80 rounded-2xl p-5 ${cardHover} h-full`}>
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.03] to-transparent rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="relative flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-border flex items-center justify-center text-sm font-bold text-foreground flex-shrink-0">
                            {job.company_name.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs text-muted-foreground font-semibold truncate">{job.company_name}</p>
                            <p className="font-bold text-foreground leading-tight group-hover:text-emerald-600 transition-colors line-clamp-1">{job.title}</p>
                          </div>
                        </div>
                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border flex-shrink-0 ${matchColor(job.match_score)}`}>
                          {job.match_score}%
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground font-medium mt-3.5">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-muted-foreground/70" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground/70" />
                          {job.employment_type}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <DollarSign className="h-3.5 w-3.5 text-muted-foreground/70" />
                          {job.salary}
                        </span>
                        {job.visa === "Visa" && <span className="text-emerald-600 font-bold flex items-center gap-1"><Zap className="h-3 w-3" />Visa</span>}
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-3.5">
                        {job.tags.map((t, ti) => (
                          <span key={ti} className="bg-muted/50 border border-border text-muted-foreground text-[10px] font-bold px-2 py-1 rounded-lg">{t}</span>
                        ))}
                      </div>
                      <p className="text-[11px] text-muted-foreground/70 font-medium mt-3">{job.posted_time}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Recent Applications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative bg-card/80 backdrop-blur-sm border border-border rounded-3xl p-6 md:p-8 space-y-5 shadow-sm"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.02] to-transparent rounded-3xl pointer-events-none" />
            <h2 className="text-lg font-bold text-foreground relative">Recent Applications</h2>
            {d.recent_applications.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center font-medium relative">No applications yet. Start exploring jobs to begin your journey.</p>
            ) : (
              <div className="divide-y divide-border/60 relative" role="list" aria-label="Recent applications">
                {d.recent_applications.map((app, idx) => (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 + idx * 0.06, duration: 0.4 }}
                    role="listitem"
                    className="flex flex-col sm:flex-row sm:items-center justify-between py-5 first:pt-0 last:pb-0 gap-3 group"
                  >
                    <div className="space-y-1.5">
                      <h3 className="text-sm font-bold text-foreground group-hover:text-emerald-600 transition-colors">{app.job_title}</h3>
                      <p className="text-muted-foreground text-sm font-medium">{app.company_name} • {app.applied_date}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-xs font-bold text-muted-foreground">ATS <span className="text-foreground font-extrabold">{app.ats_score}</span></span>
                      <span className={`text-[11px] font-bold border px-3 py-1.5 rounded-full ${statusColor(app.status)}`}>{app.status}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Right sidebar — Auto-apply + CV strength + Preferences */}
        <div className="space-y-5">
          {/* Auto-apply Mode */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative bg-card/80 backdrop-blur-sm border border-emerald-500/20 rounded-3xl p-6 space-y-5 shadow-lg shadow-emerald-500/5"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.04] to-transparent rounded-3xl pointer-events-none" />
            <div className="relative flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <Sparkles className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">Auto-apply Mode</h3>
                <p className="text-xs text-muted-foreground font-medium mt-0.5">CareerSprint AI</p>
              </div>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed font-medium relative">
              CareerSprint AI submits tailored applications to your top matches every day. Daily cap <span className="text-foreground font-bold">{aa.daily_cap}</span>.
            </p>
            <div className="space-y-3 relative">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Today</span>
                <span className={`text-sm font-bold ${aa.enabled ? "text-emerald-600" : "text-muted-foreground"}`}>{aa.enabled ? "Enabled" : "Disabled"}</span>
              </div>
              <div className="w-full bg-muted/50 h-2.5 rounded-full overflow-hidden border border-border/50">
                <div className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-full rounded-full transition-all duration-700 shadow-lg shadow-emerald-500/20" style={{ width: `${aa.daily_cap > 0 ? (aa.sent_today / aa.daily_cap) * 100 : 0}%` }} />
              </div>
              <p className="text-xs text-muted-foreground font-semibold text-right">{aa.sent_today}/{aa.daily_cap} sent</p>
            </div>
          </motion.div>

          {/* CV Strength */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative bg-card/80 backdrop-blur-sm border border-border rounded-3xl p-6 space-y-5 shadow-sm"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.02] to-transparent rounded-3xl pointer-events-none" />
            <div className="relative">
              <h3 className="text-base font-bold text-foreground mb-4">CV Strength</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Score</span>
                  <span className="text-2xl font-extrabold text-foreground">{cv.percentage}%</span>
                </div>
                <div className="w-full bg-muted/50 h-3 rounded-full overflow-hidden border border-border/50">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-400 h-full rounded-full transition-all duration-700 shadow-lg shadow-blue-500/20" style={{ width: `${cv.percentage}%` }} />
                </div>
              </div>
              <div className="space-y-3 mt-5">
                {cv.checklist.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    {item.completed ? (
                      <div className="h-5 w-5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      </div>
                    ) : (
                      <div className="h-5 w-5 rounded-lg border-2 border-border flex items-center justify-center flex-shrink-0">
                        <Circle className="h-3 w-3 text-muted-foreground/40" />
                      </div>
                    )}
                    <span className={`text-sm font-medium ${item.completed ? "text-foreground" : "text-muted-foreground"}`}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <Link href="/candidate/cv" className="w-full block text-center bg-foreground hover:bg-foreground/90 text-background font-bold py-3 rounded-2xl transition-all active:scale-[0.98] text-sm shadow-lg shadow-foreground/10">
              Improve CV
            </Link>
          </motion.div>

          {/* Preferences */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative bg-card/80 backdrop-blur-sm border border-border rounded-3xl p-6 space-y-4 shadow-sm"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/[0.02] to-transparent rounded-3xl pointer-events-none" />
            <div className="relative flex justify-between items-center">
              <h3 className="text-base font-bold text-foreground">Preferences</h3>
              <Link href={profileId ? `/candidate/profile/${profileId}` : "/candidate/profile"} className="text-xs text-emerald-600 hover:text-emerald-500 font-bold flex items-center gap-1 transition-colors">
                Edit
                <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="space-y-3 relative">
              <div className="flex items-center justify-between py-2 border-b border-border/50">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Role</span>
                <span className="text-sm font-bold text-foreground">{pref.role}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border/50">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Salary</span>
                <span className="text-sm font-bold text-foreground">{pref.salary}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Location</span>
                <span className="text-sm font-bold text-foreground">{pref.location}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
