"use client";

import { useState } from "react";
import { motion, type Variants } from "framer-motion";
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
  Briefcase,
  X,
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  useGetAdminJobsQuery,
  useDeleteAdminJobMutation,
  type AdminJobListItem,
} from "@/store/authApi";
import { SkeletonTable } from "@/components/ui/skeleton-cards";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  if (!iso) return "N/A";
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function formatSalary(min?: number, max?: number, currency?: string) {
  if (!min && !max) return "Not specified";
  const curr = currency || "USD";
  if (min && max) return `${curr} ${min.toLocaleString()}–${max.toLocaleString()}`;
  if (min) return `From ${curr} ${min.toLocaleString()}`;
  return `Up to ${curr} ${max?.toLocaleString()}`;
}

// ── Badge helpers ────────────────────────────────────────────────────────────

const statusStyles: Record<string, string> = {
  ACTIVE: "bg-[#21c55e]/15 text-[#21c55e]",
  CLOSED: "bg-red-500/15 text-red-400",
  PENDING: "bg-amber-500/15 text-amber-400",
  REJECTED: "bg-gray-500/15 text-gray-400",
  DRAFT: "bg-gray-500/15 text-gray-400",
  PAUSED: "bg-amber-500/15 text-amber-400",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-[11px] font-semibold ${statusStyles[status] ?? "bg-muted text-muted-foreground"}`}>
      {status}
    </span>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

const rowVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.03, duration: 0.3, ease: "easeOut" },
  }),
};

export default function JobManagementPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [employmentType, setEmploymentType] = useState("ALL");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const [selectedJob, setSelectedJob] = useState<AdminJobListItem | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const { data: res, isLoading, isFetching, isError, refetch } = useGetAdminJobsQuery({
    page,
    page_size: pageSize,
    search: search || undefined,
    status: status !== "ALL" ? status : undefined,
    employment_type: employmentType !== "ALL" ? employmentType : undefined,
  });

  const [deleteJob] = useDeleteAdminJobMutation();

  // Safely extract results and total count from API envelope or direct pagination wrapper
  const rawData = res?.data ?? res;
  const jobs: AdminJobListItem[] = Array.isArray(rawData)
    ? rawData
    : Array.isArray(rawData?.results)
    ? rawData.results
    : Array.isArray(res?.results)
    ? res.results
    : [];

  const totalCount: number =
    typeof res?.count === "number"
      ? res.count
      : typeof rawData?.count === "number"
      ? rawData.count
      : jobs.length;

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  async function handleDelete(id: string, title: string) {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      await deleteJob(id);
      setIsDetailsOpen(false);
      setSelectedJob(null);
    }
  }

  const hasFilters = !!search || status !== "ALL" || employmentType !== "ALL";

  const clearFilters = () => {
    setSearch("");
    setStatus("ALL");
    setEmploymentType("ALL");
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Job Management</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {isLoading ? "Loading…" : `${totalCount} total jobs found`}
        </p>
      </div>

      {/* Toolbar & Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search title, company, location…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full bg-background border border-border rounded-xl pl-9 pr-4 py-2 text-sm text-foreground placeholder-muted-foreground outline-none focus:border-[#21c55e]/40 transition-colors"
          />
          {search && (
            <button
              onClick={() => { setSearch(""); setPage(1); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Status Filter */}
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:border-[#21c55e]/40 transition-colors"
        >
          <option value="ALL">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="ACTIVE">Active</option>
          <option value="CLOSED">Closed</option>
          <option value="REJECTED">Rejected</option>
        </select>

        {/* Employment Type Filter */}
        <select
          value={employmentType}
          onChange={(e) => { setEmploymentType(e.target.value); setPage(1); }}
          className="bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:border-[#21c55e]/40 transition-colors"
        >
          <option value="ALL">All Employment Types</option>
          <option value="FULL_TIME">Full Time</option>
          <option value="PART_TIME">Part Time</option>
          <option value="CONTRACT">Contract</option>
          <option value="INTERNSHIP">Internship</option>
          <option value="FREELANCE">Freelance</option>
        </select>

        {/* Page size */}
        <select
          value={pageSize}
          onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
          className="bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:border-[#21c55e]/40 transition-colors"
        >
          <option value={10}>10 / page</option>
          <option value={20}>20 / page</option>
          <option value={50}>50 / page</option>
          <option value={100}>100 / page</option>
        </select>

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-card text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="h-3.5 w-3.5" /> Clear Filters
          </button>
        )}

        {isFetching && !isLoading && (
          <Loader2 className="h-4 w-4 animate-spin text-[#21c55e] ml-auto" />
        )}
      </div>

      {/* Error State */}
      {isError && (
        <ErrorState
          icon={AlertTriangle}
          title="Unable to load jobs"
          description="Something went wrong while fetching the job list."
          onRetry={() => refetch()}
          retryLabel="Retry"
        />
      )}

      {/* Table Card */}
      {!isError && (
        <div className="rounded-2xl bg-card border border-border overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px]" role="grid" aria-label="Jobs list">
              <thead>
                <tr className="border-b border-border sticky top-0 bg-card/95 backdrop-blur z-10">
                  {["Job Title", "Company", "Location", "Matches", "Applications", "Posted", "Status", "Actions"].map((h) => (
                    <th key={h} className={`px-4 py-3.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider ${h === "Actions" ? "text-right" : "text-left"}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading
                  ? <SkeletonTable rows={5} columns={8} />
                  : jobs.length === 0
                    ? (
                      <tr>
                        <td colSpan={8}>
                          <EmptyState
                            icon={Briefcase}
                            title="No jobs found"
                            description={hasFilters ? "No jobs match your selected filters." : "Jobs will appear here once companies post them."}
                          />
                        </td>
                      </tr>
                    )
                    : jobs.map((j, idx) => (
                      <motion.tr
                        key={j.id}
                        custom={idx}
                        initial="hidden"
                        animate="visible"
                        variants={rowVariants}
                        className={`border-b border-border hover:bg-muted/50 transition-colors ${idx === jobs.length - 1 ? "border-b-0" : ""}`}
                      >
                        {/* Job Title */}
                        <td className="px-4 py-3.5">
                          <div>
                            <span className="text-sm font-medium text-foreground block">{j.title}</span>
                            <span className="text-xs text-muted-foreground block">{formatSalary(j.salary_min, j.salary_max, j.currency)}</span>
                          </div>
                        </td>

                        {/* Company */}
                        <td className="px-4 py-3.5">
                          <span className="text-sm text-muted-foreground">{j.company}</span>
                        </td>

                        {/* Location */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                            <span className="text-sm text-muted-foreground">{j.location || "Remote / N/A"}</span>
                          </div>
                        </td>

                        {/* Matches */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1.5">
                            <Target className="h-3.5 w-3.5 text-[#b48eed] shrink-0" />
                            <span className="text-sm text-[#b48eed] font-medium">{j.matches ?? 0}</span>
                          </div>
                        </td>

                        {/* Applications */}
                        <td className="px-4 py-3.5">
                          <span className="text-sm text-muted-foreground">{j.applications ?? 0}</span>
                        </td>

                        {/* Posted */}
                        <td className="px-4 py-3.5">
                          <span className="text-sm text-muted-foreground">{formatDate(j.posted)}</span>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3.5">
                          <StatusBadge status={j.job_status} />
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => { setSelectedJob(j); setIsDetailsOpen(true); }}
                              aria-label="View job details"
                              className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(j.id, j.title)}
                              aria-label="Delete job"
                              className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                }
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {!isLoading && totalCount > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-3.5 border-t border-border">
              <span className="text-xs text-muted-foreground">
                Showing {Math.min((page - 1) * pageSize + 1, totalCount)}–{Math.min(page * pageSize, totalCount)} of {totalCount} jobs
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  aria-label="Previous page"
                  className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((n) => n === 1 || n === totalPages || Math.abs(n - page) <= 2)
                  .map((n) => (
                    <button
                      key={n}
                      onClick={() => setPage(n)}
                      aria-label={`Page ${n}`}
                      aria-current={n === page ? "page" : undefined}
                      className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors ${n === page ? "bg-[#21c55e]/20 text-[#21c55e]" : "hover:bg-muted text-muted-foreground"}`}
                    >
                      {n}
                    </button>
                  ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  aria-label="Next page"
                  className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="bg-card border-border text-foreground max-w-[500px] p-6 rounded-2xl overflow-hidden !ring-0">
          <DialogHeader className="flex flex-row items-center justify-between pb-4 border-b border-border">
            <DialogTitle className="text-lg font-bold text-foreground">
              {selectedJob?.title}
            </DialogTitle>
          </DialogHeader>

          {selectedJob && (
            <div className="grid grid-cols-2 gap-y-6 gap-x-4 py-5 border-b border-border">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Company</p>
                <p className="text-sm font-medium text-foreground">{selectedJob.company}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Location</p>
                <p className="text-sm font-medium text-foreground">{selectedJob.location || "N/A"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Salary</p>
                <p className="text-sm font-medium text-foreground font-mono">{formatSalary(selectedJob.salary_min, selectedJob.salary_max, selectedJob.currency)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Applications</p>
                <p className="text-sm font-medium text-foreground">{selectedJob.applications ?? 0}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">AI Matches</p>
                <p className="text-sm font-medium text-foreground">{selectedJob.matches ?? 0}</p>
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
            <button
              onClick={() => setIsDetailsOpen(false)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground text-xs font-medium transition-colors"
            >
              <XCircle className="w-3.5 h-3.5" />
              Close
            </button>
            <button
              onClick={() => selectedJob && handleDelete(selectedJob.id, selectedJob.title)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-transparent hover:bg-red-500/10 text-red-400 text-xs font-medium transition-colors"
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
