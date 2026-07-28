"use client";

import { useState, use } from "react";
import { ArrowLeft, Loader2, AlertTriangle, CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import {
  useGetAdminJobEditRequestDetailQuery,
  useApproveAdminJobEditRequestMutation,
  useRejectAdminJobEditRequestMutation,
} from "@/store/authApi";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

const statusStyles: Record<string, string> = {
  PENDING: "bg-amber-500/15 text-amber-400",
  APPROVED: "bg-[#21c55e]/15 text-[#21c55e]",
  REJECTED: "bg-red-500/15 text-red-400",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold ${statusStyles[status] ?? "bg-muted text-muted-foreground"}`}>
      {status === "PENDING" && <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />}
      {status === "APPROVED" && <CheckCircle2 className="h-3 w-3" />}
      {status === "REJECTED" && <XCircle className="h-3 w-3" />}
      {status}
    </span>
  );
}

export default function AdminJobEditRequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data, isLoading, isError } = useGetAdminJobEditRequestDetailQuery(id);
  const [approveRequest, { isLoading: isApproving }] = useApproveAdminJobEditRequestMutation();
  const [rejectRequest, { isLoading: isRejecting }] = useRejectAdminJobEditRequestMutation();
  const [actionDone, setActionDone] = useState<"APPROVED" | "REJECTED" | null>(null);

  const req = data?.data;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !req) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-foreground mb-2">Failed to load edit request</h2>
        <p className="text-sm text-muted-foreground mb-4">Something went wrong while fetching the details.</p>
        <Link href="/admin/job-edit-requests" className="text-sm font-semibold text-[#21c55e] hover:underline">
          Back to requests
        </Link>
      </div>
    );
  }

  const changeEntries = Object.entries(req.changes || {});

  const handleApprove = async () => {
    try {
      await approveRequest(id).unwrap();
      setActionDone("APPROVED");
    } catch (err: any) {
      alert(err?.data?.details || "Failed to approve. Please try again.");
    }
  };

  const handleReject = async () => {
    try {
      await rejectRequest(id).unwrap();
      setActionDone("REJECTED");
    } catch (err: any) {
      alert(err?.data?.details || "Failed to reject. Please try again.");
    }
  };

  if (actionDone) {
    return (
      <div className="space-y-6">
        <Link
          href="/admin/job-edit-requests"
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to edit requests
        </Link>
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className={`h-20 w-20 rounded-full flex items-center justify-center ${actionDone === "APPROVED" ? "bg-[#21c55e]/15 border border-[#21c55e]/30" : "bg-red-500/15 border border-red-500/30"}`}>
            {actionDone === "APPROVED"
              ? <CheckCircle2 className="h-9 w-9 text-[#21c55e]" />
              : <XCircle className="h-9 w-9 text-red-400" />
            }
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
              Request {actionDone === "APPROVED" ? "approved" : "rejected"}
            </h1>
            <p className="text-sm text-muted-foreground">
              The edit request for &quot;{req.job_title}&quot; has been {actionDone === "APPROVED" ? "approved and applied" : "rejected"}.
            </p>
          </div>
          <Link
            href="/admin/job-edit-requests"
            className="bg-[#21c55e] hover:bg-[#1da852] text-white font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-md active:scale-[0.98]"
          >
            Back to requests
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link
        href="/admin/job-edit-requests"
        className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to edit requests
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">{req.job_title}</h1>
            <StatusBadge status={req.request_status} />
          </div>
          <p className="text-sm text-muted-foreground">{req.company} &bull; Requested {formatDate(req.created_at)}</p>
        </div>

        {req.request_status === "PENDING" && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleReject}
              disabled={isRejecting}
              className="inline-flex items-center gap-1.5 border border-red-500/30 hover:bg-red-500/10 text-red-400 font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50"
            >
              {isRejecting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <XCircle className="h-3.5 w-3.5" />}
              Reject
            </button>
            <button
              onClick={handleApprove}
              disabled={isApproving}
              className="inline-flex items-center gap-1.5 bg-[#21c55e] hover:bg-[#1da852] text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-all shadow-md shadow-[#21c55e]/10 active:scale-[0.98] disabled:opacity-50"
            >
              {isApproving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
              Approve
            </button>
          </div>
        )}
      </div>

      {/* Changes */}
      {changeEntries.length > 0 ? (
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">Proposed Changes</h2>
          <div className="rounded-xl bg-card border border-border overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Field</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Current</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider"></th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Proposed</th>
                </tr>
              </thead>
              <tbody>
                {changeEntries.map(([field, change]) => (
                  <tr key={field} className="border-b border-border last:border-b-0">
                    <td className="px-5 py-3.5">
                      <span className="text-sm font-semibold text-foreground capitalize">{field.replace(/_/g, " ")}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-sm text-muted-foreground bg-muted/50 rounded px-2 py-1 inline-block max-w-xs truncate">
                        {typeof change.from === "object" ? JSON.stringify(change.from) : String(change.from ?? "—")}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-sm text-[#21c55e] font-medium bg-[#21c55e]/10 rounded px-2 py-1 inline-block max-w-xs truncate">
                        {typeof change.to === "object" ? JSON.stringify(change.to) : String(change.to ?? "—")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="rounded-xl bg-card border border-border p-8 text-center">
          <p className="text-sm text-muted-foreground">No changes detected in this request.</p>
        </div>
      )}

      {/* Review info */}
      {req.review_reason && (
        <div className="rounded-xl bg-card border border-border p-5 space-y-2">
          <h3 className="text-sm font-bold text-foreground">Review Reason</h3>
          <p className="text-sm text-muted-foreground">{req.review_reason}</p>
        </div>
      )}
    </div>
  );
}
