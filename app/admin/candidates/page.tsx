"use client";

import { useState } from "react";
import {
  Search, Eye, Trash2,
  ChevronLeft, ChevronRight, Loader2, X, AlertTriangle, UserCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useGetAdminCandidatesQuery,
  useDeleteAdminCandidateMutation,
  type AdminCandidateListItem,
} from "@/store/authApi";
import { SkeletonTable } from "@/components/ui/skeleton-cards";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";

// ── Helpers ───────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  if (!name) return "CA";
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function avatarColor(id: number) {
  const colors = ["#6366f1", "#8b5cf6", "#10b981", "#f59e0b", "#ec4899", "#3b82f6", "#14b8a6", "#f97316"];
  return colors[id % colors.length];
}

// ── Badges ────────────────────────────────────────────────────────────────────

function SubBadge({ label }: { label: string }) {
  const styles: Record<string, string> = {
    Premium: "bg-[#6366f1]/20 text-[#6366f1]",
    Starter: "bg-muted text-muted-foreground",
    Pro: "bg-[#6366f1]/20 text-[#6366f1]",
    Basic: "bg-muted text-muted-foreground",
    Free: "bg-muted text-muted-foreground",
    Enterprise: "bg-[#f59e0b]/20 text-[#f59e0b]",
  };
  const cls = styles[label] ?? "bg-muted text-muted-foreground";
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${cls}`}>
      {label || "Free"}
    </span>
  );
}

function StatusBadge({ suspended }: { suspended: boolean }) {
  return suspended ? (
    <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold border border-red-500/20 text-red-500 bg-red-500/10">
      Suspended
    </span>
  ) : (
    <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold border border-[#21c55e]/20 text-[#21c55e] bg-[#21c55e]/10">
      Active
    </span>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function AdminCandidatesPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [place, setPlace] = useState("");
  const [minAge, setMinAge] = useState<string>("");
  const [maxAge, setMaxAge] = useState<string>("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const { data: res, isLoading, isFetching, isError, refetch } = useGetAdminCandidatesQuery({
    page,
    page_size: pageSize,
    search: search || undefined,
    status: status !== "ALL" ? status : undefined,
    place: place || undefined,
    min_age: minAge ? Number(minAge) : undefined,
    max_age: maxAge ? Number(maxAge) : undefined,
  });

  const [deleteCandidate] = useDeleteAdminCandidateMutation();

  const rawData = res?.data ?? res;
  const candidates: AdminCandidateListItem[] = Array.isArray(rawData)
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
      : candidates.length;

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  async function handleDelete(id: number, name: string) {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      await deleteCandidate(id);
    }
  }

  const hasFilters = !!search || status !== "ALL" || !!place || !!minAge || !!maxAge;

  const clearFilters = () => {
    setSearch("");
    setStatus("ALL");
    setPlace("");
    setMinAge("");
    setMaxAge("");
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Candidate Management</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {isLoading ? "Loading…" : `${totalCount} total candidates found`}
        </p>
      </div>

      {/* Toolbar & Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search candidate name, email…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full bg-background border border-border rounded-xl pl-9 pr-4 py-2 text-sm text-foreground placeholder-muted-foreground outline-none focus:border-[#6366f1]/40 transition-colors"
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
          className="bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:border-[#6366f1]/40 transition-colors"
        >
          <option value="ALL">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="SUSPENDED">Suspended</option>
        </select>

        {/* Location / Place Filter */}
        <input
          type="text"
          placeholder="Filter location…"
          value={place}
          onChange={(e) => { setPlace(e.target.value); setPage(1); }}
          className="bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:border-[#6366f1]/40 transition-colors max-w-[160px]"
        />

        {/* Min / Max Age */}
        <div className="flex items-center gap-1.5">
          <input
            type="number"
            placeholder="Min Age"
            value={minAge}
            onChange={(e) => { setMinAge(e.target.value); setPage(1); }}
            className="bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:border-[#6366f1]/40 transition-colors w-20"
          />
          <span className="text-xs text-muted-foreground">–</span>
          <input
            type="number"
            placeholder="Max Age"
            value={maxAge}
            onChange={(e) => { setMaxAge(e.target.value); setPage(1); }}
            className="bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:border-[#6366f1]/40 transition-colors w-20"
          />
        </div>

        {/* Page size */}
        <select
          value={pageSize}
          onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
          className="bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:border-[#6366f1]/40 transition-colors"
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
          <Loader2 className="h-4 w-4 animate-spin text-[#6366f1] ml-auto" />
        )}
      </div>

      {/* Error state */}
      {isError && (
        <ErrorState
          icon={AlertTriangle}
          title="Unable to load candidates"
          description="Something went wrong while fetching the candidate list."
          onRetry={() => refetch()}
          retryLabel="Retry"
        />
      )}

      {/* Table */}
      {!isError && (
        <div className="rounded-xl bg-card border border-border overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  {["CANDIDATE", "LOCATION", "DESIGNATIONS & PLANS", "ATS", "JOBS APPLIED", "STATUS", "ACTIONS"].map((h) => (
                    <th
                      key={h}
                      className={`px-5 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider ${h === "ACTIONS" ? "text-right" : "text-left"}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading
                  ? <SkeletonTable rows={5} columns={7} />
                  : candidates.length === 0
                    ? (
                      <tr>
                        <td colSpan={7}>
                          <EmptyState
                            icon={UserCheck}
                            title="No candidates found"
                            description={hasFilters ? "No candidates match your search or filter criteria." : "Candidates will appear here once registered."}
                          />
                        </td>
                      </tr>
                    )
                    : candidates.map((c, idx) => (
                        <tr
                          key={c.id}
                          className={`border-b border-border hover:bg-muted/50 transition-colors ${idx === candidates.length - 1 ? "border-b-0" : ""}`}
                        >
                          {/* Name */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                                style={{ background: avatarColor(c.id) }}
                              >
                                {getInitials(c.full_name)}
                              </div>
                              <div>
                                <span className="block text-sm font-semibold text-foreground">{c.full_name}</span>
                                <span className="block text-[11px] text-muted-foreground">{c.email}</span>
                              </div>
                            </div>
                          </td>

                          {/* Location */}
                          <td className="px-5 py-4">
                            <span className="text-sm font-medium text-foreground">{c.location || "—"}</span>
                          </td>

                          {/* Designations & Plans */}
                          <td className="px-5 py-4">
                            <div className="space-y-1.5">
                              {c.designations_plans?.map((d, i) => (
                                <div key={i} className="flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#6366f1]/50" />
                                  <span className="text-xs text-foreground">{d.designation || "—"}</span>
                                  <SubBadge label={d.plan} />
                                </div>
                              )) ?? <span className="text-xs text-muted-foreground">—</span>}
                            </div>
                          </td>

                          {/* ATS Score */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                                <div className="h-full bg-[#21c55e]" style={{ width: `${c.ats_score ?? 0}%` }} />
                              </div>
                              <span className="text-xs font-medium text-foreground">{c.ats_score ?? 0}</span>
                            </div>
                          </td>

                          {/* Jobs Applied */}
                          <td className="px-5 py-4">
                            <span className="text-sm font-medium text-foreground">{c.jobs_applied ?? 0}</span>
                          </td>

                          {/* Status */}
                          <td className="px-5 py-4">
                            <StatusBadge suspended={c.is_suspended} />
                          </td>

                          {/* Actions */}
                          <td className="px-5 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => router.push(`/admin/candidates/${c.id}`)}
                                title="View details"
                                className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors border border-transparent hover:border-border"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(c.id, c.full_name)}
                                title="Delete"
                                className="p-1.5 rounded-md hover:bg-red-500/10 text-red-500/60 hover:text-red-500 transition-colors border border-transparent hover:border-red-500/20"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                }
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {!isLoading && totalCount > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-3.5 border-t border-border">
              <span className="text-xs text-muted-foreground">
                Showing {Math.min((page - 1) * pageSize + 1, totalCount)}–{Math.min(page * pageSize, totalCount)} of {totalCount} candidates
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
                      className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors ${n === page ? "bg-[#6366f1] text-white" : "hover:bg-muted text-muted-foreground"}`}
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
    </div>
  );
}
