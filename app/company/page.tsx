"use client";

import React, { useState } from "react";
import {
  Briefcase,
  Users,
  MessageSquare,
  Wallet,
  Plus,
  ExternalLink,
  MapPin,
  Clock,
  Sparkles,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import {
  useGetCompanyDashboardQuery,
} from "@/store/authApi";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function CompanyDashboard() {
  const { data, isLoading, isError, error, refetch } = useGetCompanyDashboardQuery();

  const dashboard = data?.data;

  if (isError) {
    return (
      <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-full mx-auto">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">Failed to load dashboard</h2>
          <p className="text-sm text-muted-foreground mb-4">
            {error && "status" in error
              ? `Error ${error.status}: ${JSON.stringify(error.data)}`
              : "Something went wrong while fetching the dashboard."}
          </p>
          <button onClick={() => refetch()} className="text-sm font-semibold text-[#4BC957] hover:underline">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const stats = dashboard?.stats;

  const pipeline = dashboard?.pipeline ?? [];

  const topMatches = dashboard?.top_ai_matches ?? [];

  const openRoles = dashboard?.open_roles ?? [];

  const companyName = dashboard?.company_name ?? "Company";

  const workspaceLabel = dashboard?.workspace_label ?? "Hiring workspace";

  const renderSkeletonCards = () =>
    Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="bg-card border border-border rounded-2xl p-5 flex items-center justify-between">
        <div className="space-y-3">
          <Skeleton className="h-3 w-24 rounded" />
          <Skeleton className="h-8 w-16 rounded" />
        </div>
        <Skeleton className="h-12 w-12 rounded-xl" />
      </div>
    ));

  const renderSkeletonPipeline = () =>
    Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="bg-muted/50 rounded-xl p-3 space-y-2 min-w-[140px]">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <Skeleton className="h-3 w-16 rounded" />
          <Skeleton className="h-5 w-6 rounded-full" />
        </div>
        <Skeleton className="h-16 w-full rounded" />
      </div>
    ));

  const renderSkeletonMatches = () =>
    Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="flex items-center justify-between p-3.5 rounded-xl bg-muted/50 border border-border">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32 rounded" />
            <Skeleton className="h-3 w-20 rounded" />
          </div>
        </div>
        <Skeleton className="h-9 w-12 rounded-lg" />
      </div>
    ));

  const renderSkeletonRoles = () =>
    Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4.5 gap-4">
        <div className="space-y-3 flex-1">
          <Skeleton className="h-4 w-48 rounded" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-3 w-24 rounded" />
            <Skeleton className="h-3 w-20 rounded" />
          </div>
        </div>
        <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-9 w-16 rounded-lg" />
        </div>
      </div>
    ));

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-full mx-auto">
      {/* Top Welcome / Header Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-sm font-medium text-muted-foreground uppercase tracking-widest">{workspaceLabel}</h1>
          <p className="text-3xl font-extrabold text-foreground mt-1 tracking-tight">
            {companyName} <span className="text-[#4BC957] font-normal">•</span> Talent
          </p>
        </div>
        <Link href="/company/jobs/create" className="flex items-center gap-2 bg-[#4BC957] hover:bg-[#00B96E] text-white font-bold px-5 py-3 rounded-xl transition-all duration-200 shadow-lg shadow-[#4BC957]/10 active:scale-[0.98]">
          <Plus className="h-5 w-5" />
          Post a job
        </Link>
      </div>

      {/* Stats Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {isLoading
          ? renderSkeletonCards()
          : [
              { label: "Active jobs", value: stats?.active_jobs ?? 0, icon: Briefcase, color: "text-[#4BC957]", bg: "bg-[#4BC957]/10", href: "/company/jobs" },
              { label: "Shortlisted", value: stats?.shortlisted ?? 0, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10", href: "/company/candidates" },
              { label: "Messaged", value: stats?.messaged ?? 0, icon: MessageSquare, color: "text-purple-500", bg: "bg-purple-500/10", href: "/company/inbox" },

            ].map((stat, idx) => (
              <Link
                key={idx}
                href={stat.href}
                className="bg-card border border-border rounded-2xl p-5 flex items-center justify-between hover:border-[#4BC957]/30 transition-all duration-300 group cursor-pointer"
              >
                <div className="space-y-1">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</span>
                  <p className="text-3xl font-bold text-foreground tracking-tight">{stat.value}</p>
                </div>
                <div className={`${stat.bg} ${stat.color} p-3.5 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </Link>
            ))}
      </div>

      {/* Pipeline & AI Matches Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recruitment Pipeline Column (2/3 width) */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 flex flex-col space-y-5">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              Recruitment pipeline
            </h2>
            <Link href={"/company/interviews"} className="text-[#4BC957] font-semibold hover:underline flex items-center gap-1.5">
              Open board <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>

          {isLoading ? (
            <div className="flex md:grid md:grid-cols-5 gap-3 overflow-x-auto pb-2 md:pb-0">
              {renderSkeletonPipeline()}
            </div>
          ) : (
            <div className="flex md:grid md:grid-cols-5 gap-3 h-full min-h-[220px] overflow-x-auto pb-2 md:pb-0">
              {pipeline.map((stage) => (
                <div key={stage.key} className="bg-muted/50 rounded-xl p-3 flex flex-col space-y-3 min-w-[140px] md:min-w-0">
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <span className="text-sm font-semibold text-muted-foreground">{stage.label}</span>
                    <span className="text-[13px] font-bold text-muted-foreground bg-card px-2 py-0.5 rounded-full border border-border">{stage.count}</span>
                  </div>

                  <div className="flex-1 space-y-2 overflow-y-auto">
                    {stage.candidates.map((candidateName,idx) => (
                      <div
                        key={candidateName + idx}
                        className="bg-muted border border-border rounded-lg p-2.5 hover:border-[#4BC957]/50 transition-all duration-200"
                      >
                        <p className="text-sm font-semibold text-foreground truncate">{candidateName}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top AI Matches Column (1/3 width) */}
        <div className="bg-card border border-border rounded-2xl p-6 flex flex-col space-y-5">
          <div>
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Sparkles className="h-4.5 w-4.5 text-[#4BC957]" />
              Top AI matches
            </h2>
          </div>

          <div className="flex-1 flex flex-col justify-between space-y-4">
            {isLoading
              ? renderSkeletonMatches()
              : topMatches.map((match) => (
                  <Link key={match.id} href={`/company/candidates/profile?id=${match.id}`}>
                    <div
                      className="flex items-center justify-between p-3.5 rounded-xl bg-muted/50 border border-border hover:border-[#4BC957]/30 transition-all duration-300 cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-muted border border-border flex items-center justify-center font-bold text-foreground text-sm">
                          {getInitials(match.name)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground group-hover:text-[#4BC957] transition-colors">{match.name}</p>
                          <p className="text-sm text-muted-foreground text-xs">{match.role_title}</p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-[#4BC957] bg-[#4BC957]/10 px-2.5 py-1 rounded-lg">
                        {match.match_score}
                      </span>
                    </div>
                  </Link>
                ))}
          </div>
        </div>
      </div>

      {/* Open Roles Table / List */}
      <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            Open roles
          </h2>
          <Link href={"/company/jobs"} className="text-muted-foreground hover:text-foreground font-semibold flex items-center gap-1 transition-colors">
            Manage
          </Link>
        </div>

        {isLoading ? (
          <div className="divide-y divide-border">
            {renderSkeletonRoles()}
          </div>
        ) : (
          <div className="divide-y divide-border">
            {openRoles.map((role) => (
              <div key={role.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4.5 first:pt-0 last:pb-0 gap-4 group">
                <div className="space-y-1">
                  <h3 className="text-base font-semibold text-foreground group-hover:text-[#4BC957] transition-colors">{role.title}</h3>
                  <div className="flex items-center gap-4 text-muted-foreground text-sm">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                      {role.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      {role.employment_type}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                  <span className="font-medium text-muted-foreground text-sm">
                    <strong className="text-foreground font-semibold">{role.applicants}</strong> applicants
                  </span>
                  <Link href={`/company/jobs/applicants?id=${role.id}`} className="border border-[#4BC957]/40 text-[#4BC957] hover:bg-[#4BC957] hover:text-white px-4 py-1.5 rounded-lg font-semibold transition-all duration-200">
                    Open
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
