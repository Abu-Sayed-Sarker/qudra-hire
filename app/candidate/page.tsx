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
import { useGetCandidateDashboardQuery } from "@/store/authApi";

export default function CandidateDashboard() {
  const { data, isLoading, isError } = useGetCandidateDashboardQuery();
  const d = data?.data;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !d) {
    return (
      <div className="py-20 text-center">
        <p className="text-red-400">Failed to load dashboard.</p>
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

  const matchColor = (m: string) => {
    const n = parseInt(m);
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
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight">{d.candidate_name}</h1>
        <p className="text-on-surface-muted mt-1 text-sm">{d.role_title}</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {stats.map((s, i) => (
          <div key={i} className="bg-surface-card border border-surface rounded-2xl p-5 flex items-center justify-between hover:border-inner transition-all duration-300 group cursor-pointer">
            <div className="space-y-1">
              <span className="text-[13px] font-semibold text-on-surface-muted uppercase tracking-wider">{s.label}</span>
              <p className="text-2xl font-extrabold text-on-surface tracking-tight">{s.value}</p>
            </div>
            <div className={`${s.bg} ${s.color} p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
              <s.icon className="h-5 w-5" />
            </div>
          </div>
        ))}
      </div>

      {/* AI Interview Invites */}
      {d.interview_invites.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-base font-bold text-on-surface flex items-center gap-2">
            <Bot className="h-4 w-4 text-[#23C65F]" />
            AI Interview Invites
          </h2>
          {d.interview_invites.map((invite: any) => (
            <div key={invite.id} className="bg-surface-card border border-surface rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-[#23C65F]/30 transition-all duration-300">
              <div className="flex items-center gap-4 min-w-0">
                <div className="p-3 bg-[#23C65F]/10 border border-[#23C65F]/20 rounded-xl text-[#23C65F] flex-shrink-0">
                  <Bot className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-on-surface">{invite.company_name}</p>
                  <p className="text-on-surface-muted mt-0.5 text-sm">{invite.role_context}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="flex items-center gap-1 text-xs text-on-surface-subtle">
                      <Clock className="h-3 w-3" />
                      {invite.duration_minutes} min
                    </span>
                    <span className="text-xs text-on-surface-subtle truncate">{invite.message}</span>
                  </div>
                </div>
              </div>
              <Link
                href={`/candidate/interview?invite=${invite.id}`}
                className="flex items-center gap-1.5 bg-[#23C65F] hover:bg-[#1DA852] text-white font-bold px-4 py-2 rounded-xl transition-all shadow-md shadow-[#23C65F]/10 active:scale-[0.98] text-sm flex-shrink-0"
              >
                <Play className="h-3.5 w-3.5" />
                Start
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Main 2-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — recommendations + applications */}
        <div className="lg:col-span-2 space-y-6">
          {/* Daily AI Recommendations */}
          <div className="bg-surface-card border border-surface rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-bold text-on-surface">Daily AI recommendations</h2>
              <button className="text-[#23C65F] font-semibold hover:underline text-sm">View all</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {d.recommendations.map((job) => (
                <Link key={job.id} href={`/candidate/jobs/detail?id=${job.id}`} className="block min-w-0">
                  <div className="bg-surface-deep border border-surface rounded-xl p-4 space-y-3 hover:border-[#23C65F]/40 transition-all cursor-pointer group h-full">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-lg bg-surface-item border border-surface flex items-center justify-center text-[13px] font-bold text-on-surface flex-shrink-0">
                          {job.company_name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-[13px] text-on-surface-muted font-semibold">{job.company_name}</p>
                          <p className="font-bold text-on-surface leading-tight group-hover:text-[#23C65F] transition-colors">{job.title}</p>
                        </div>
                      </div>
                      <span className={`text-[13px] font-bold px-2 py-0.5 rounded-md border flex-shrink-0 ${matchColor(job.match_score)}`}>
                        {job.match_score} match
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[13px] text-on-surface-muted font-medium">
                      <span className="flex items-center gap-0.5"><MapPin className="h-3 w-3 text-on-surface-subtle" />{job.location}</span>
                      <span className="flex items-center gap-0.5"><Clock className="h-3 w-3 text-on-surface-subtle" />{job.employment_type}</span>
                      <span className="flex items-center gap-0.5"><DollarSign className="h-3 w-3 text-on-surface-subtle" />{job.salary}</span>
                      {job.visa === "Visa" && <span className="text-[#23C65F]">✓ Visa</span>}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {job.tags.map((t, ti) => (
                        <span key={ti} className="bg-surface-item border border-surface text-on-surface-subtle text-[9px] font-semibold px-2 py-0.5 rounded">{t}</span>
                      ))}
                    </div>
                    <p className="text-[13px] text-on-surface-subtle font-medium">{job.posted_time}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Applications */}
          <div className="bg-surface-card border border-surface rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-bold text-on-surface">Recent applications</h2>
            {d.recent_applications.length === 0 ? (
              <p className="text-sm text-on-surface-muted py-4 text-center">No applications yet.</p>
            ) : (
              <div className="divide-y divide-surface">
                {d.recent_applications.map((app) => (
                  <div key={app.id} className="flex flex-col sm:flex-row sm:items-center justify-between py-4 first:pt-0 last:pb-0 gap-3">
                    <div className="space-y-0.5">
                      <h3 className="text-sm font-bold text-on-surface">{app.job_title}</h3>
                      <p className="text-on-surface-muted text-sm font-medium">{app.company_name} • {app.applied_date}</p>
                    </div>
                    <div className="flex items-center gap-2.5 flex-shrink-0">
                      <span className="text-[13px] font-bold text-on-surface-muted">ATS <span className="text-on-surface">{app.ats_score}</span></span>
                      <span className={`text-[13px] font-bold border px-2.5 py-1 rounded-full ${statusColor(app.status)}`}>{app.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right sidebar — Auto-apply + CV strength + Preferences */}
        <div className="space-y-4">
          {/* Auto-apply Mode */}
          <div className="bg-surface-card border border-surface rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2 font-bold text-[#23C65F]">
              <Sparkles className="h-4 w-4" />
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
              <div className="w-full bg-surface-item h-2 rounded-full overflow-hidden">
                <div className="bg-[#23C65F] h-full rounded-full transition-all duration-500" style={{ width: `${aa.daily_cap > 0 ? (aa.sent_today / aa.daily_cap) * 100 : 0}%` }} />
              </div>
              <p className="text-[13px] text-on-surface-subtle font-medium text-right">{aa.sent_today}/{aa.daily_cap} sent</p>
            </div>
          </div>

          {/* CV Strength */}
          <div className="bg-surface-card border border-surface rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-on-surface">CV strength</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between font-bold">
                <span className="text-on-surface-muted">Score</span>
                <span className="text-[#23C65F]">{cv.percentage}%</span>
              </div>
              <div className="w-full bg-surface-item h-2 rounded-full overflow-hidden">
                <div className="bg-[#23C65F] h-full rounded-full transition-all duration-500" style={{ width: `${cv.percentage}%` }} />
              </div>
            </div>
            <div className="space-y-2 text-on-surface-muted text-sm font-medium">
              {cv.checklist.map((item, i) => (
                <p key={i} className="flex items-center gap-2">
                  {item.completed ? (
                    <CheckCircle2 className="h-4 w-4 text-[#23C65F] flex-shrink-0" />
                  ) : (
                    <Circle className="h-4 w-4 text-on-surface-subtle flex-shrink-0" />
                  )}
                  {item.text}
                </p>
              ))}
            </div>
            <Link href="/candidate/cv" className="w-full block text-center bg-[#23C65F] hover:bg-[#1DA852] text-white font-bold py-2.5 rounded-xl transition-all active:scale-[0.98] text-sm">
              Improve CV
            </Link>
          </div>

          {/* Preferences */}
          <div className="bg-surface-card border border-surface rounded-2xl p-5 space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-on-surface">Preferences</h3>
           
            </div>
            <div className="space-y-2 text-on-surface-muted text-sm font-medium">
              <p>Role. <span className="text-on-surface font-semibold">{pref.role}</span></p>
              <p>Salary. <span className="text-on-surface font-semibold">{pref.salary}</span></p>
              <p>Location. <span className="text-on-surface font-semibold">{pref.location}</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
