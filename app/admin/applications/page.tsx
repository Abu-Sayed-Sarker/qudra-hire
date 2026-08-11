"use client";

import { useState } from "react";
import {
  Eye, Download, ChevronRight,
  Loader2, AlertTriangle,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { BASE_URL } from "@/store/authApi";
import {
  useGetAdminApplicationsQuery,
  type AdminApplicationItem,
} from "@/store/authApi";

// ── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

function avatarColor(name: string) {
  const colors = ["#6366f1", "#8b5cf6", "#10b981", "#f59e0b", "#ec4899", "#3b82f6", "#14b8a6", "#f97316"];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

// ── Types ─────────────────────────────────────────────────────────────────────

type AppStatus = "Applied" | "Shortlisted" | "Interview" | "Offer" | "Hired" | "Withdrawn" | "Rejected";

const statusOrder: AppStatus[] = ["Applied", "Shortlisted", "Interview", "Offer", "Hired"];

const statusColors: Record<string, string> = {
  Applied: "bg-blue-500/10 text-blue-600 border border-blue-200",
  Shortlisted: "bg-primary/10 text-primary border border-primary/20",
  Interview: "bg-amber-500/10 text-amber-600 border border-amber-200",
  Offer: "bg-purple-500/10 text-purple-600 border border-purple-200",
  Hired: "bg-emerald-500/10 text-emerald-600 border border-emerald-200",
  Withdrawn: "bg-gray-500/10 text-gray-500 border border-gray-200",
  Rejected: "bg-red-500/10 text-red-500 border border-red-200",
};

// ── Application Details Modal ─────────────────────────────────────────────────

function AppDetailModal({
  app,
  onClose,
}: {
  app: AdminApplicationItem;
  onClose: () => void;
}) {
  return (
    <Dialog open onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="bg-card border border-border text-foreground max-w-md p-0 rounded-2xl overflow-hidden">
        <DialogHeader className="px-6 py-5 border-b border-border">
          <DialogTitle className="text-lg font-bold text-foreground">Application Details</DialogTitle>
        </DialogHeader>

        <div className="px-6 py-5 space-y-5">
          {/* Candidate header */}
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold text-white"
              style={{ background: avatarColor(app.candidate_name) }}
            >
              {getInitials(app.candidate_name)}
            </div>
            <div>
              <p className="text-base font-semibold text-foreground">{app.candidate_name}</p>
              <p className="text-sm text-muted-foreground">{app.company_name}</p>
            </div>
          </div>

          {/* Grid details */}
          <div className="grid grid-cols-2 gap-y-5 gap-x-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Job Title</p>
              <p className="text-sm font-semibold text-foreground">{app.job_title}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Company</p>
              <p className="text-sm font-semibold text-foreground">{app.company_name}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Match Score</p>
              <p className="text-sm font-bold text-primary">{app.match_score}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">ATS Score</p>
              <p className="text-sm font-semibold text-foreground">{app.ats_score}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Applied Date</p>
              <p className="text-sm text-foreground">{app.applied_date}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Status</p>
              <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${statusColors[app.status] ?? "bg-muted text-muted-foreground border border-border"}`}>
                {app.status}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function ApplicationManagementPage() {
  const { data, isLoading, isError } = useGetAdminApplicationsQuery();
  const appData = data?.data;
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  const [filter, setFilter] = useState<AppStatus | "All">("All");
  const [selected, setSelected] = useState<AdminApplicationItem | null>(null);

  const counts = appData?.counts;
  const applications = appData?.applications ?? [];

  const filtered = filter === "All" ? applications : applications.filter(a => a.status === filter);

  async function handleDownload(id: string) {
    try {
      const res = await fetch(`${BASE_URL}/admin/applications/${id}/pdf/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `application_${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      alert("Failed to download PDF.");
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[28px] font-bold text-foreground tracking-tight">Application Management</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {isLoading ? "Loading…" : `${counts?.all ?? 0} total applications`}
        </p>
      </div>

      {/* Error */}
      {isError && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          Failed to load applications.
        </div>
      )}

      {/* Pipeline filter bar */}
      {!isLoading && counts && (
        <div className="flex items-center gap-1 flex-wrap">
          {statusOrder.map((s, idx) => (
            <div key={s} className="flex items-center gap-1">
              <button
                onClick={() => setFilter(s)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold border transition-all duration-200 ${filter === s
                    ? "bg-primary/10 border-primary/30 text-primary"
                    : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/20"
                  }`}
              >
                <span className="text-foreground font-bold">{counts[s.toLowerCase() as keyof typeof counts] ?? 0}</span>
                {s}
              </button>
              {idx < statusOrder.length - 1 && (
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40" />
              )}
            </div>
          ))}
          <button
            onClick={() => setFilter("All")}
            className={`ml-2 px-3.5 py-2 rounded-xl text-sm font-semibold border transition-all duration-200 ${filter === "All"
                ? "bg-primary text-white border-primary"
                : "bg-card border-border text-muted-foreground hover:text-foreground"
              }`}
          >
            All ({counts.all})
          </button>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Table */}
      {!isLoading && (
        <div className="rounded-2xl bg-card border border-border overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {["Candidate", "Company", "Job", "Match", "ATS", "Applied", "Status", "Actions"].map(h => (
                    <th
                      key={h}
                      className={`px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider ${h === "Actions" ? "text-right" : "text-left"}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-16 text-center text-sm text-muted-foreground">
                      No applications found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((app, idx) => {
                    const matchNum = parseInt(app.match_score) || 0;
                    return (
                      <tr
                        key={app.id}
                        className={`border-b border-border hover:bg-muted/30 transition-colors ${idx === filtered.length - 1 ? "border-b-0" : ""}`}
                      >
                        {/* Candidate */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                              style={{ background: avatarColor(app.candidate_name) }}
                            >
                              {getInitials(app.candidate_name)}
                            </div>
                            <span className="text-sm font-semibold text-foreground">{app.candidate_name}</span>
                          </div>
                        </td>
                        {/* Company */}
                        <td className="px-5 py-4">
                          <span className="text-sm text-muted-foreground">{app.company_name}</span>
                        </td>
                        {/* Job */}
                        <td className="px-5 py-4">
                          <span className="text-sm text-foreground">{app.job_title}</span>
                        </td>
                        {/* Match */}
                        <td className="px-5 py-4">
                          <span className={`text-sm font-bold ${matchNum >= 80 ? "text-primary" : matchNum >= 60 ? "text-amber-500" : "text-red-400"}`}>
                            {app.match_score}
                          </span>
                        </td>
                        {/* ATS */}
                        <td className="px-5 py-4">
                          <span className="text-sm font-medium text-foreground">{app.ats_score}</span>
                        </td>
                        {/* Applied */}
                        <td className="px-5 py-4">
                          <span className="text-sm text-muted-foreground">{app.applied_date}</span>
                        </td>
                        {/* Status */}
                        <td className="px-5 py-4">
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${statusColors[app.status] ?? "bg-muted text-muted-foreground border border-border"}`}>
                            {app.status}
                          </span>
                        </td>
                        {/* Actions */}
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => setSelected(app)}
                              title="View details"
                              className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDownload(app.id)}
                              title="Download PDF"
                              className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <AppDetailModal
          app={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
