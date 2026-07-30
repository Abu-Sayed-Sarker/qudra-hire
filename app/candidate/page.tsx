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
import { motion } from "framer-motion";

const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: "easeOut" },
  }),
};

export default function CandidateDashboard() {
  const { data, isLoading, isError, refetch } = useGetCandidateDashboardQuery();
  const { data: profilesData } = useGetCandidateProfilesQuery();
  const profileId = profilesData?.data?.[0]?.id;
  const d = data?.data;

  if (isLoading) {
    return (
      <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-full mx-auto">
        <div className="space-y-2">
          <div className="h-9 w-64 bg-muted/70 rounded-xl animate-pulse" />
          <div className="h-4 w-80 bg-muted/70 rounded-xl animate-pulse" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonStatCard key={i} />
          ))}
        </div>
        <div className="space-y-4">
          <div className="h-6 w-48 bg-muted/70 rounded-xl animate-pulse" />
          <div className="space-y-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <SkeletonChart />
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-card border border-border rounded-2xl p-5">
                  <SkeletonText lines={2} />
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-5 space-y-4">
                <Skeleton className="h-5 w-32" />
                <SkeletonText lines={3} />
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError || !d) {
    return (
      <div className="p-4 md:p-8 max-w-full mx-auto">
        <ErrorState
          title="Failed to load dashboard"
          description="Something went wrong while loading your dashboard. Please try again."
          onRetry={() => refetch()}
          retryLabel="Retry"
        />
      </div>
    );
  }

  const m = d.metrics;
  const aa = d.auto_apply;
  const cv = d.cv_strength;
  const pref = d.preferences;

  const stats = [
    { label: "Profile match strength", value: m.profile_match_strength, icon: Target, color: "text-[#23C65F]", bg: "bg-[#23C65F]/10" },
    { label: "Active applications", value: String(m.active_applications), icon: Briefcase, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "New matches today", value: String(m.new_matches_today), icon: Bell, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Plan", value: m.plan_badge, icon: Shield, color: "text-amber-500", bg: "bg-amber-500/10" },
  ];

  const matchColor = (score: string) => {
    const n = parseInt(score);
    if (n >= 80) return "text-[#23C65F] bg-[#23C65F]/10 border-[#23C65F]/20";
    if (n >= 65) return "text-amber-500 bg-amber-500/10 border-amber-500/20";
    return "text-muted-foreground bg-muted border-border";
  };

  const statusColor = (s: string) => {
    const map: Record<string, string> = {
      Applied: "bg-muted text-muted-foreground border-border",
      Shortlisted: "bg-[#23C65F]/10 text-[#23C65F] border-[#23C65F]/20",
      Interview: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      Offer: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      Hired: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
      Rejected: "bg-red-500/10 text-red-500 border-red-500/20",
    };
    return map[s] ?? "bg-muted text-muted-foreground border-border";
  };

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-full mx-auto">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight" aria-label={`Welcome, ${d.candidate_name}`}>
          {d.candidate_name}
        </h1>
        <p className="text-on-surface-muted mt-1 text-sm font-medium">{d.role_title}</p>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4" role="list" aria-label="Dashboard statistics">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={i}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              role="listitem"
              className="bg-surface-card border border-border rounded-2xl p-5 flex items-center justify-between hover:border-inner hover:shadow-md transition-all duration-300 group cursor-pointer focus-within:ring-2 focus-within:ring-[#23C65F]/40"
              tabIndex={0}
              aria-label={`${s.label}: ${s.value}`}
            >
              <div className="space-y-1">
                <span className="text-[13px] font-semibold text-on-surface-muted uppercase tracking-wider">{s.label}</span>
                <p className="text-2xl font-extrabold text-on-surface tracking-tight">{s.value}</p>
              </div>
              <div className={`${s.bg} ${s.color} p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`} aria-hidden="true">
                <Icon className="h-5 w-5" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* AI Interview Invites */}
      {d.interview_invites.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
          className="space-y-3"
        >
          <h2 className="text-base font-bold text-on-surface flex items-center gap-2">
            <Bot className="h-4 w-4 text-[#23C65F]" aria-hidden="true" />
            AI Interview Invites
          </h2>
          {d.interview_invites.map((invite: any, idx: number) => (
            <motion.div
              key={invite.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + idx * 0.05, duration: 0.3 }}
              className="bg-surface-card border border-border rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-[#23C65F]/30 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="p-3 bg-[#23C65F]/10 border border-[#23C65F]/20 rounded-xl text-[#23C65F] flex-shrink-0" aria-hidden="true">
                  <Bot className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-on-surface">{invite.company_name}</p>
                  <p className="text-on-surface-muted mt-0.5 text-sm font-medium">{invite.role_context}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="flex items-center gap-1 text-xs text-on-surface-subtle font-medium">
                      <Clock className="h-3 w-3" aria-hidden="true" />
                      {invite.duration_minutes} min
                    </span>
                    <span className="text-xs text-on-surface-subtle truncate font-medium">{invite.message}</span>
                  </div>
                </div>
              </div>
              <Link
                href={`/candidate/interview?invite=${invite.id}`}
                className="flex items-center gap-1.5 bg-[#23C65F] hover:bg-[#1DA852] text-white font-bold px-4 py-2 rounded-xl transition-all shadow-md shadow-[#23C65F]/10 active:scale-[0.98] text-sm flex-shrink-0 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#23C65F]"
                aria-label={`Start interview with ${invite.company_name}`}
              >
                <Play className="h-3.5 w-3.5" aria-hidden="true" />
                Start
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
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
            className="bg-surface-card border border-border rounded-2xl p-6 space-y-4 shadow-sm"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-base font-bold text-on-surface">Daily AI recommendations</h2>
              <Link href="/candidate/applications" className="text-[#23C65F] font-semibold hover:underline text-sm focus-visible:ring-2 focus-visible:ring-[#23C65F]/40 rounded">
                View all
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="list" aria-label="Job recommendations">
              {d.recommendations.map((job, idx) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + idx * 0.04, duration: 0.3 }}
                  role="listitem"
                >
                  <Link href={`/candidate/jobs/detail?id=${job.id}`} className="block min-w-0">
                    <div className="bg-surface-deep border border-border rounded-xl p-4 space-y-3 hover:border-[#23C65F]/40 hover:shadow-md transition-all cursor-pointer group h-full focus-within:ring-2 focus-within:ring-[#23C65F]/40">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-lg bg-surface-item border border-surface flex items-center justify-center text-[13px] font-bold text-on-surface flex-shrink-0" aria-hidden="true">
                            {job.company_name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-[13px] text-on-surface-muted font-semibold">{job.company_name}</p>
                            <p className="font-bold text-on-surface leading-tight group-hover:text-[#23C65F] transition-colors">{job.title}</p>
                          </div>
                        </div>
                        <span className={`text-[13px] font-bold px-2 py-0.5 rounded-md border flex-shrink-0 ${matchColor(job.match_score)}`} aria-label={`${job.match_score}% match`}>
                          {job.match_score} match
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[13px] text-on-surface-muted font-medium">
                        <span className="flex items-center gap-0.5"><MapPin className="h-3 w-3 text-on-surface-subtle" aria-hidden="true" />{job.location}</span>
                        <span className="flex items-center gap-0.5"><Clock className="h-3 w-3 text-on-surface-subtle" aria-hidden="true" />{job.employment_type}</span>
                        <span className="flex items-center gap-0.5"><DollarSign className="h-3 w-3 text-on-surface-subtle" aria-hidden="true" />{job.salary}</span>
                        {job.visa === "Visa" && <span className="text-[#23C65F] font-bold">✓ Visa</span>}
                      </div>
                      <div className="flex flex-wrap gap-1" aria-label="Job tags">
                        {job.tags.map((t, ti) => (
                          <span key={ti} className="bg-surface-item border border-surface text-on-surface-subtle text-[9px] font-semibold px-2 py-0.5 rounded">{t}</span>
                        ))}
                      </div>
                      <p className="text-[13px] text-on-surface-subtle font-medium">{job.posted_time}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Recent Applications */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
            className="bg-surface-card border border-border rounded-2xl p-6 space-y-4 shadow-sm"
          >
            <h2 className="text-base font-bold text-on-surface">Recent applications</h2>
            {d.recent_applications.length === 0 ? (
              <p className="text-sm text-on-surface-muted py-4 text-center font-medium">No applications yet.</p>
            ) : (
              <div className="divide-y divide-border" role="list" aria-label="Recent applications">
                {d.recent_applications.map((app, idx) => (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 + idx * 0.04, duration: 0.3 }}
                    role="listitem"
                    className="flex flex-col sm:flex-row sm:items-center justify-between py-4 first:pt-0 last:pb-0 gap-3"
                  >
                    <div className="space-y-0.5">
                      <h3 className="text-sm font-bold text-on-surface">{app.job_title}</h3>
                      <p className="text-on-surface-muted text-sm font-medium">{app.company_name} • {app.applied_date}</p>
                    </div>
                    <div className="flex items-center gap-2.5 flex-shrink-0">
                      <span className="text-[13px] font-bold text-on-surface-muted">ATS <span className="text-on-surface">{app.ats_score}</span></span>
                      <span className={`text-[13px] font-bold border px-2.5 py-1 rounded-full ${statusColor(app.status)}`}>{app.status}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Right sidebar — Auto-apply + CV strength + Preferences */}
        <div className="space-y-4">
          {/* Auto-apply Mode */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
            className="bg-surface-card border border-border rounded-2xl p-5 space-y-4 shadow-sm"
          >
            <div className="flex items-center gap-2 font-bold text-[#23C65F]">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Auto-apply mode
            </div>
            <p className="text-on-surface-muted text-sm leading-relaxed font-medium">
              CareerSprint AI submits tailored applications to your top matches every day. Daily cap {aa.daily_cap}.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center font-bold">
                <span className="text-on-surface-muted">Today</span>
                <span className="text-[#23C65F]">{aa.enabled ? "Enabled" : "Disabled"}</span>
              </div>
              <div className="w-full bg-muted h-2 rounded-full overflow-hidden" role="progressbar" aria-valuenow={aa.sent_today} aria-valuemin={0} aria-valuemax={aa.daily_cap}>
                <div className="bg-[#23C65F] h-full rounded-full transition-all duration-500" style={{ width: `${aa.daily_cap > 0 ? (aa.sent_today / aa.daily_cap) * 100 : 0}%` }} />
              </div>
              <p className="text-[13px] text-on-surface-subtle font-medium text-right">{aa.sent_today}/{aa.daily_cap} sent</p>
            </div>
          </motion.div>

          {/* CV Strength */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
            className="bg-surface-card border border-border rounded-2xl p-5 space-y-4 shadow-sm"
          >
            <h3 className="text-sm font-bold text-on-surface">CV strength</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between font-bold">
                <span className="text-on-surface-muted">Score</span>
                <span className="text-[#23C65F]">{cv.percentage}%</span>
              </div>
              <div className="w-full bg-muted h-2 rounded-full overflow-hidden" role="progressbar" aria-valuenow={cv.percentage} aria-valuemin={0} aria-valuemax={100}>
                <div className="bg-[#23C65F] h-full rounded-full transition-all duration-500" style={{ width: `${cv.percentage}%` }} />
              </div>
            </div>
            <div className="space-y-2 text-on-surface-muted text-sm font-medium">
              {cv.checklist.map((item, i) => (
                <p key={i} className="flex items-center gap-2">
                  {item.completed ? (
                    <CheckCircle2 className="h-4 w-4 text-[#23C65F] flex-shrink-0" aria-hidden="true" />
                  ) : (
                    <Circle className="h-4 w-4 text-on-surface-subtle flex-shrink-0" aria-hidden="true" />
                  )}
                  <span>{item.text}</span>
                </p>
              ))}
            </div>
            <Link href="/candidate/cv" className="w-full block text-center bg-[#23C65F] hover:bg-[#1DA852] text-white font-bold py-2.5 rounded-xl transition-all active:scale-[0.98] text-sm shadow-md shadow-[#23C65F]/10 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#23C65F]">
              Improve CV
            </Link>
          </motion.div>

          {/* Preferences */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25, ease: "easeOut" }}
            className="bg-surface-card border border-border rounded-2xl p-5 space-y-3 shadow-sm"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-on-surface">Preferences</h3>
              <Link href={profileId ? `/candidate/profile/${profileId}` : "/candidate/profile"} className="text-xs text-[#23C65F] hover:underline font-semibold focus-visible:ring-2 focus-visible:ring-[#23C65F]/40 rounded">
                Edit
              </Link>
            </div>
            <div className="space-y-2 text-on-surface-muted text-sm font-medium">
              <p>Role. <span className="text-on-surface font-semibold">{pref.role}</span></p>
              <p>Salary. <span className="text-on-surface font-semibold">{pref.salary}</span></p>
              <p>Location. <span className="text-on-surface font-semibold">{pref.location}</span></p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
