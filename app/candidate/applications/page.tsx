"use client";

import React from "react";
import Link from "next/link";
import { Loader2, ExternalLink, Briefcase } from "lucide-react";
import { useGetCandidateApplicationsQuery } from "@/store/authApi";
import {
  SkeletonTable,
  SkeletonStatCard,
} from "@/components/ui/skeleton-cards";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { motion } from "framer-motion";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

const statusColor = (s: string) => {
  const map: Record<string, string> = {
    APPLIED: "bg-muted text-muted-foreground border-border",
    UNDER_REVIEW: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    SHORTLISTED: "bg-[#23C65F]/10 text-[#23C65F] border-[#23C65F]/20",
    INTERVIEW: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    OFFER: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    HIRED: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    REJECTED: "bg-red-500/10 text-red-500 border-red-500/20",
    WITHDRAWN: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  };
  return map[s] ?? "bg-muted text-muted-foreground border-border";
};

const statusLabel = (s: string) => {
  return s.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
};

export default function CandidateApplicationsPage() {
  const { data, isLoading, isError, refetch } = useGetCandidateApplicationsQuery();
  const applications = data?.data?.applications ?? [];

  const counts = applications.reduce(
    (acc, app) => {
      const s = app.application_status;
      acc[s] = (acc[s] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const stats = [
    { label: "Applied", count: (counts["APPLIED"] ?? 0) + (counts["UNDER_REVIEW"] ?? 0) },
    { label: "Shortlisted", count: counts["SHORTLISTED"] ?? 0 },
    { label: "Interview", count: counts["INTERVIEW"] ?? 0 },
    { label: "Offer", count: counts["OFFER"] ?? 0 },
    { label: "Rejected", count: counts["REJECTED"] ?? 0 },
  ];

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-full mx-auto">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight">My applications</h1>
        <p className="text-sm text-on-surface-muted mt-1 font-medium">Track every step from apply to offer.</p>
      </motion.div>

      {/* Error */}
      {isError && (
        <ErrorState
          title="Failed to load applications"
          description="Something went wrong while fetching your applications."
          onRetry={() => refetch()}
          retryLabel="Try again"
        />
      )}

      {/* Loading */}
      {isLoading && (
        <div className="space-y-6">
          <SkeletonTable rows={5} columns={5} />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonStatCard key={i} />
            ))}
          </div>
        </div>
      )}

      {/* Applications Table Card */}
      {!isLoading && !isError && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
          className="bg-surface-card border border-border rounded-2xl overflow-hidden shadow-sm"
        >
          {applications.length === 0 ? (
            <EmptyState
              icon={Briefcase}
              title="No applications yet"
              description="Start applying to jobs to track your progress here."
              action={{
                label: "Browse jobs",
                onClick: () => (window.location.href = "/candidate"),
              }}
            />
          ) : (
            <>
              {/* Mobile card view */}
              <div className="block md:hidden divide-y divide-border" role="list" aria-label="Applications list">
                {applications.map((app, idx) => (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04, duration: 0.3 }}
                    role="listitem"
                    className="p-4 space-y-2 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-bold text-on-surface text-sm leading-tight">{app.job_title}</h3>
                      <span className={`text-xs font-bold border px-2.5 py-0.5 rounded-full whitespace-nowrap ${statusColor(app.application_status)}`}>
                        {statusLabel(app.application_status)}
                      </span>
                    </div>
                    <p className="text-sm text-on-surface-muted font-medium">{app.company_name}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-on-surface-muted font-medium">Applied {formatDate(app.created_at)}</span>
                    </div>
                    <div className="pt-1">
                      <Link
                        href={`/candidate/jobs/detail?id=${app.job}`}
                        className="text-sm font-bold text-[#23C65F] hover:underline transition-colors inline-flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-[#23C65F]/40 rounded"
                        aria-label={`View details for ${app.job_title}`}
                      >
                        View <ExternalLink className="h-3 w-3" aria-hidden="true" />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse" aria-label="Applications table">
                  <thead>
                    <tr className="border-b border-border text-on-surface-muted font-semibold uppercase tracking-wider bg-muted/30">
                      <th className="py-4 px-6 font-medium text-xs">Role</th>
                      <th className="py-4 px-6 font-medium text-xs">Company</th>
                      <th className="py-4 px-6 font-medium text-xs">Applied</th>
                      <th className="py-4 px-6 font-medium text-xs">Status</th>
                      <th className="py-4 px-6 font-medium text-xs text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border text-on-surface text-sm">
                    {applications.map((app, idx) => (
                      <motion.tr
                        key={app.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.03, duration: 0.3 }}
                        className="hover:bg-muted/50 transition-colors group"
                      >
                        <td className="py-4 px-6 font-bold max-w-[280px] truncate">{app.job_title}</td>
                        <td className="py-4 px-6 text-on-surface-muted font-medium">{app.company_name}</td>
                        <td className="py-4 px-6 text-on-surface-muted font-medium">{formatDate(app.created_at)}</td>
                        <td className="py-4 px-6">
                          <span className={`text-[13px] font-bold border px-3 py-1 rounded-full ${statusColor(app.application_status)}`}>
                            {statusLabel(app.application_status)}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <Link
                            href={`/candidate/jobs/detail?id=${app.job}`}
                            className="font-bold text-[#23C65F] hover:underline transition-all inline-flex items-center gap-1 text-sm focus-visible:ring-2 focus-visible:ring-[#23C65F]/40 rounded"
                            aria-label={`View details for ${app.job_title}`}
                          >
                            View <ExternalLink className="h-3 w-3" aria-hidden="true" />
                          </Link>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </motion.div>
      )}

      {/* Stats Cards Row */}
      {!isLoading && !isError && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4"
          role="list"
          aria-label="Application statistics"
        >
          {stats.map((s, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25 + idx * 0.04, duration: 0.3 }}
              role="listitem"
              className="bg-surface-card border border-border rounded-2xl p-4 md:p-5 space-y-1 hover:border-inner hover:shadow-md transition-all"
            >
              <span className="font-semibold text-on-surface-muted text-sm">{s.label}</span>
              <p className="text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight">{s.count}</p>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
