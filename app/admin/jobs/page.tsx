"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Target,
  XCircle,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useGetAdminJobsQuery,
  useDeleteAdminJobMutation,
  type AdminJobListItem,
} from "@/store/authApi";

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function formatSalary(min: number, max: number, currency: string) {
  return `${currency} ${min.toLocaleString()}–${max.toLocaleString()}`;
}

// ── Badge helpers ────────────────────────────────────────────────────────────

const statusStyles: Record<string, string> = {
  ACTIVE: "bg-[#21c55e]/15 text-[#21c55e]",
  CLOSED: "bg-red-500/15 text-red-400",
  DRAFT: "bg-gray-500/15 text-gray-400",
  PAUSED: "bg-amber-500/15 text-amber-400",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`px-2.5 py-0.5 rounded text-[11px] font-semibold ${statusStyles[status] ?? "bg-muted text-muted-foreground"}`}>
      {status}
    </span>
  );
}

// ── Skeleton row ─────────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <tr className="border-b border-border">
      {[140, 120, 120, 60, 80, 80, 60].map((w, i) => (
        <td key={i} className="px-5 py-4">
          <div className="h-3 rounded bg-muted animate-pulse" style={{ width: w }} />
        </td>
      ))}
    </tr>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

const PAGE_SIZE = 10;

export default function JobManagementPage() {
  const { data, isLoading, isError } = useGetAdminJobsQuery();
  const jobs = data?.data ?? [];
  const [deleteJob] = useDeleteAdminJobMutation();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedJob, setSelectedJob] = useState<AdminJobListItem | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  async function handleDelete(id: string, title: string) {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      await deleteJob(id);
      setIsDetailsOpen(false);
      setSelectedJob(null);
    }
  }

  const filtered = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Job Management</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {isLoading ? "Loading…" : `${jobs.length} total jobs`}
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by title or company…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full bg-background border border-border rounded-lg pl-9 pr-4 py-2 text-sm text-foreground placeholder-muted-foreground outline-none focus:border-[#21c55e]/40 transition-colors"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card text-sm font-medium text-foreground hover:bg-muted transition-colors">
          <Filter className="h-3.5 w-3.5" /> Filter
        </button>
      </div>

      {/* Error */}
      {isError && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          Failed to load jobs. Check your connection and try again.
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl bg-card border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px]">
            <thead>
              <tr className="border-b border-border">
                {["Job Title", "Company", "Location", "Matches", "Applications", "Posted", "Status", "Actions"].map((h) => (
                  <th key={h} className={`px-5 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider ${h === "Actions" ? "text-right" : "text-left"}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                : paginated.length === 0
                  ? (
                    <tr>
                      <td colSpan={8} className="text-center py-16 text-muted-foreground text-sm">
                        {search ? "No jobs match your search." : "No jobs found."}
                      </td>
                    </tr>
                  )
                  : paginated.map((j, idx) => (
                    <tr
                      key={j.id}
                      className={`border-b border-border hover:bg-muted/50 transition-colors ${idx === paginated.length - 1 ? "border-b-0" : ""}`}
                    >
                      {/* Job Title */}
                      <td className="px-5 py-3.5">
                        <div>
                          <span className="text-sm font-medium text-foreground block">{j.title}</span>
                          <span className="text-xs text-muted-foreground block">{formatSalary(j.salary_min, j.salary_max, j.currency)}</span>
                        </div>
                      </td>

                      {/* Company */}
                      <td className="px-5 py-3.5">
                        <span className="text-sm text-muted-foreground">{j.company}</span>
                      </td>

                      {/* Location */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
                          <span className="text-sm text-muted-foreground">{j.location}</span>
                        </div>
                      </td>

                      {/* Matches */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <Target className="h-3 w-3 text-[#b48eed] shrink-0" />
                          <span className="text-sm text-[#b48eed] font-medium">{j.matches}</span>
                        </div>
                      </td>

                      {/* Applications */}
                      <td className="px-5 py-3.5">
                        <span className="text-sm text-muted-foreground">{j.applications}</span>
                      </td>

                      {/* Posted */}
                      <td className="px-5 py-3.5">
                        <span className="text-sm text-muted-foreground">{formatDate(j.posted)}</span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3.5">
                        <StatusBadge status={j.job_status} />
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => { setSelectedJob(j); setIsDetailsOpen(true); }}
                            title="View details"
                            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(j.id, j.title)}
                            title="Delete"
                            className="p-1.5 rounded-md hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isLoading && filtered.length > 0 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-border">
            <span className="text-xs text-muted-foreground">
              Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </span>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors">
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button key={n} onClick={() => setPage(n)}
                  className={`w-7 h-7 rounded-md text-xs font-semibold transition-colors ${n === page ? "bg-[#21c55e]/20 text-[#21c55e]" : "hover:bg-muted text-muted-foreground"}`}>
                  {n}
                </button>
              ))}
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors">
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="bg-card border-border text-foreground max-w-[500px] p-6 rounded-xl overflow-hidden !ring-0">
          <DialogHeader className="flex flex-row items-center justify-between pb-4 border-b border-border">
            <DialogTitle className="text-lg font-bold text-foreground">
              {selectedJob?.title}
            </DialogTitle>
          </DialogHeader>

          {selectedJob && (
            <div className="grid grid-cols-2 gap-y-6 gap-x-4 py-4 border-b border-border">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Company</p>
                <p className="text-sm font-medium text-foreground">{selectedJob.company}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Location</p>
                <p className="text-sm font-medium text-foreground">{selectedJob.location}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Salary</p>
                <p className="text-sm font-medium text-foreground font-mono">{formatSalary(selectedJob.salary_min, selectedJob.salary_max, selectedJob.currency)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Applications</p>
                <p className="text-sm font-medium text-foreground">{selectedJob.applications}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">AI Matches</p>
                <p className="text-sm font-medium text-foreground">{selectedJob.matches}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Posted</p>
                <p className="text-sm font-medium text-foreground font-mono">{formatDate(selectedJob.posted)}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-muted-foreground mb-1">Status</p>
                <StatusBadge status={selectedJob.job_status} />
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 pt-4">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground text-xs font-medium transition-colors">
              <XCircle className="w-3.5 h-3.5" />
              Close Job
            </button>
            <button
              onClick={() => selectedJob && handleDelete(selectedJob.id, selectedJob.title)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-transparent hover:bg-red-500/10 text-red-400 text-xs font-medium transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
