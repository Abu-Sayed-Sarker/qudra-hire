"use client";

import React, { useState } from "react";
import {
  Loader2,
  Search,
  Bot,
  Clock,
  CheckCircle2,
  AlertCircle,
  Send,
  FileText,
  Eye,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { useGetCompanyInterviewsQuery } from "@/store/authApi";
import type { CompanyInterview } from "@/store/authApi";
import { get403Message } from "@/lib/utils";

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  COMPLETED: { label: "Completed", color: "text-[#4BC957]", bg: "bg-[#4BC957]/10 border-[#4BC957]/20" },
  IN_PROGRESS: { label: "In Progress", color: "text-blue-500", bg: "bg-blue-500/10 border-blue-500/20" },
  INVITED: { label: "Invited", color: "text-amber-500", bg: "bg-amber-500/10 border-amber-500/20" },
  DRAFT: { label: "Draft", color: "text-muted-foreground", bg: "bg-muted border-border" },
  EXPIRED: { label: "Expired", color: "text-red-500", bg: "bg-red-500/10 border-red-500/20" },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.DRAFT;
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${cfg.color} ${cfg.bg}`}>
      {status === "COMPLETED" && <CheckCircle2 className="h-3 w-3" />}
      {status === "INVITED" && <Send className="h-3 w-3" />}
      {status === "DRAFT" && <AlertCircle className="h-3 w-3" />}
      {cfg.label}
    </span>
  );
}

export default function CompanyInterviewsPage() {
  const { data, isLoading, isError, error } = useGetCompanyInterviewsQuery();
  const [search, setSearch] = useState("");

  const interviews = (data?.data ?? []).filter((inv) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      inv.candidate_name.toLowerCase().includes(q) ||
      inv.job_title.toLowerCase().includes(q) ||
      inv.role_context.toLowerCase().includes(q)
    );
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    const msg = get403Message(error);
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="h-16 w-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
          <AlertTriangle className="h-8 w-8 text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">{msg ? "Access Denied" : "Failed to load interviews"}</h2>
        <p className="text-sm text-muted-foreground mb-4 max-w-sm">
          {msg || "Something went wrong while fetching interviews."}
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Interviews</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage AI interviews for your candidates.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by candidate, job..."
            className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#4BC957]"
          />
        </div>
      </div>

      {/* Interviews Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="py-3.5 px-5 font-semibold text-muted-foreground">Candidate</th>
                <th className="py-3.5 px-5 font-semibold text-muted-foreground">Job Title</th>
                <th className="py-3.5 px-5 font-semibold text-muted-foreground">Role</th>
                <th className="py-3.5 px-5 font-semibold text-muted-foreground">Status</th>
                <th className="py-3.5 px-5 font-semibold text-muted-foreground">Questions</th>
                <th className="py-3.5 px-5 font-semibold text-muted-foreground">Created</th>
                <th className="py-3.5 px-5 font-semibold text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {interviews.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-muted-foreground">
                    <Bot className="h-8 w-8 mx-auto mb-3 text-muted-foreground/40" />
                    <p className="font-semibold">No interviews found</p>
                    <p className="text-xs mt-1">Create an interview from the candidates page.</p>
                  </td>
                </tr>
              )}
              {interviews.map((inv) => (
                <tr key={inv.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3.5 px-5">
                    <p className="font-semibold text-foreground">{inv.candidate_name}</p>
                  </td>
                  <td className="py-3.5 px-5">
                    <p className="text-foreground font-medium">{inv.job_title}</p>
                  </td>
                  <td className="py-3.5 px-5 text-muted-foreground">{inv.role_context}</td>
                  <td className="py-3.5 px-5">
                    <StatusBadge status={inv.status} />
                  </td>
                  <td className="py-3.5 px-5 text-muted-foreground">
                    {inv.questions.length > 0 ? (
                      <span className="flex items-center gap-1">
                        <FileText className="h-3.5 w-3.5" />
                        {inv.questions.length}
                      </span>
                    ) : (
                      <span className="text-muted-foreground/50">—</span>
                    )}
                  </td>
                  <td className="py-3.5 px-5 text-muted-foreground text-xs">
                    {new Date(inv.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/company/interviews/${inv.id}`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground hover:text-[#4BC957] transition-colors px-3 py-1.5 rounded-lg hover:bg-[#4BC957]/10"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </Link>
                      {inv.status === "COMPLETED" && (
                        <Link
                          href={`/company/interviews/${inv.id}/report`}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4BC957] hover:text-[#3DAF49] transition-colors px-3 py-1.5 rounded-lg bg-[#4BC957]/10"
                        >
                          <FileText className="h-3.5 w-3.5" />
                          Report
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
