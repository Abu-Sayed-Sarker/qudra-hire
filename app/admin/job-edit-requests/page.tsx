"use client";

import { useState } from "react";
import {
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import Link from "next/link";
import {
  useGetAdminJobEditRequestsQuery,
  type AdminJobEditRequest,
} from "@/store/authApi";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

const statusStyles: Record<string, string> = {
  PENDING: "bg-amber-500/15 text-amber-400",
  APPROVED: "bg-[#21c55e]/15 text-[#21c55e]",
  REJECTED: "bg-red-500/15 text-red-400",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold ${statusStyles[status] ?? "bg-muted text-muted-foreground"}`}>
      {status === "PENDING" && <Clock className="h-3 w-3" />}
      {status === "APPROVED" && <CheckCircle2 className="h-3 w-3" />}
      {status === "REJECTED" && <XCircle className="h-3 w-3" />}
      {status}
    </span>
  );
}

function SkeletonRow() {
  return (
    <tr className="border-b border-border">
      {[140, 120, 80, 80, 60].map((w, i) => (
        <td key={i} className="px-5 py-4">
          <div className="h-3 rounded bg-muted animate-pulse" style={{ width: w }} />
        </td>
      ))}
    </tr>
  );
}

const PAGE_SIZE = 10;

export default function AdminJobEditRequestsPage() {
  const { data, isLoading, isError } = useGetAdminJobEditRequestsQuery();
  const requests = data?.data ?? [];

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = requests.filter(
    (r) =>
      r.job_title.toLowerCase().includes(search.toLowerCase()) ||
      r.company.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Job Edit Requests</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {isLoading ? "Loading…" : `${requests.length} total requests`}
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
      </div>

      {/* Error */}
      {isError && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          Failed to load edit requests. Check your connection and try again.
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl bg-card border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-border">
                {["Job Title", "Company", "Status", "Requested", "Actions"].map((h) => (
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
                      <td colSpan={5} className="text-center py-16 text-muted-foreground text-sm">
                        {search ? "No requests match your search." : "No edit requests found."}
                      </td>
                    </tr>
                  )
                  : paginated.map((r, idx) => (
                    <tr
                      key={r.id}
                      className={`border-b border-border hover:bg-muted/50 transition-colors ${idx === paginated.length - 1 ? "border-b-0" : ""}`}
                    >
                      <td className="px-5 py-3.5">
                        <span className="text-sm font-medium text-foreground">{r.job_title}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm text-muted-foreground">{r.company}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusBadge status={r.request_status} />
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm text-muted-foreground">{formatDate(r.created_at)}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/admin/job-edit-requests/${r.id}`}
                            title="View details"
                            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Link>
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
    </div>
  );
}
