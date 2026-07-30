"use client";

import React from "react";
import Link from "next/link";
import { Loader2, AlertTriangle, ExternalLink } from "lucide-react";
import { useGetCandidateApplicationsQuery } from "@/store/authApi";

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
  const { data, isLoading, isError } = useGetCandidateApplicationsQuery();
  const applications = data?.data?.applications ?? [];

  // Compute counts from applications
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
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight">My applications</h1>
        <p className="text-sm text-on-surface-muted mt-1">Track every step from apply to offer.</p>
      </div>

      {/* Error */}
      {isError && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          Failed to load applications.
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Applications Table Card */}
      {!isLoading && (
        <div className="bg-surface-card border border-surface rounded-2xl overflow-hidden">
          {/* Mobile card view */}
          <div className="block md:hidden divide-y divide-surface">
            {applications.length === 0 ? (
              <div className="p-8 text-center text-on-surface-muted text-sm">No applications yet.</div>
            ) : (
              applications.map((app) => (
                <div key={app.id} className="p-4 space-y-2 hover:bg-surface-item/50 transition-colors">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-on-surface text-sm leading-tight">{app.job_title}</h3>
                    <span className={`text-xs font-bold border px-2.5 py-0.5 rounded-full whitespace-nowrap ${statusColor(app.application_status)}`}>
                      {statusLabel(app.application_status)}
                    </span>
                  </div>
                  <p className="text-sm text-on-surface-muted">{app.company_name}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-on-surface-muted">Applied {formatDate(app.created_at)}</span>
                  </div>
                  <div className="pt-1">
                    <Link
                      href={`/candidate/jobs/detail?id=${app.job}`}
                      className="text-sm font-bold text-[#23C65F] hover:underline transition-colors inline-flex items-center gap-1"
                    >
                      View <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-surface text-on-surface-muted font-semibold uppercase tracking-wider bg-surface-deep">
                  <th className="py-4 px-6 font-medium text-xs">Role</th>
                  <th className="py-4 px-6 font-medium text-xs">Company</th>
                  <th className="py-4 px-6 font-medium text-xs">Applied</th>
                  <th className="py-4 px-6 font-medium text-xs">Status</th>
                  <th className="py-4 px-6 font-medium text-xs text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface text-on-surface text-sm">
                {applications.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-16 text-center text-on-surface-muted text-sm">No applications yet.</td>
                  </tr>
                ) : (
                  applications.map((app) => (
                    <tr key={app.id} className="hover:bg-surface-item/50 transition-colors group">
                      <td className="py-4 px-6 font-bold max-w-[280px] truncate">
                        {app.job_title}
                      </td>
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
                          className="font-bold text-[#23C65F] hover:underline transition-all inline-flex items-center gap-1 text-sm"
                        >
                          View <ExternalLink className="h-3 w-3" />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Stats Cards Row */}
      {!isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {stats.map((s, idx) => (
            <div
              key={idx}
              className="bg-surface-card border border-surface rounded-2xl p-4 md:p-5 space-y-1 hover:border-inner transition-all"
            >
              <span className="font-semibold text-on-surface-muted text-sm">{s.label}</span>
              <p className="text-2xl md:text-3xl font-extrabold text-on-surface">{s.count}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
