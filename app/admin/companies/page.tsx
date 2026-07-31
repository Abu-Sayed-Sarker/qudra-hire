"use client";

import { useState, useEffect } from "react";
import { motion, type Variants } from "framer-motion";
import {
  Search, Eye, Pencil, Trash2, Globe,
  ChevronLeft, ChevronRight, Loader2,
  CheckCircle, XCircle, Key, AlertTriangle, Copy, Check, Ban, X,
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  useGetAdminCompaniesQuery,
  useGetAdminCompanyByIdQuery,
  usePatchAdminCompanyMutation,
  useDeleteAdminCompanyMutation,
  useApproveAdminCompanyMutation,
  useRejectAdminCompanyMutation,
  useResetAdminCompanyPasswordMutation,
  useSuspendAdminCompanyMutation,
  useUnsuspendAdminCompanyMutation,
  type AdminCompanyListItem,
} from "@/store/authApi";
import { SkeletonTable } from "@/components/ui/skeleton-cards";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Building2 } from "lucide-react";

// ── Helpers ────────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  if (!name) return "CO";
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

function avatarColor(id: number) {
  const colors = ["#6366f1", "#8b5cf6", "#10b981", "#f59e0b", "#ec4899", "#3b82f6", "#14b8a6", "#f97316"];
  return colors[id % colors.length];
}

function formatDate(iso: string) {
  if (!iso) return "N/A";
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

// ── Badges ─────────────────────────────────────────────────────────────────────

function ApprovalBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    VERIFIED: "bg-[#21c55e]/15 text-[#21c55e]",
    PENDING: "bg-amber-500/15 text-amber-500",
    REJECTED: "bg-red-500/15 text-red-500",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-[11px] font-semibold ${map[status] ?? "bg-muted text-muted-foreground"}`}>
      {status}
    </span>
  );
}

function SuspendedBadge({ suspended }: { suspended: boolean }) {
  return suspended ? (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-[11px] font-semibold bg-red-500/15 text-red-500">Suspended</span>
  ) : (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-[11px] font-semibold bg-[#21c55e]/15 text-[#21c55e]">Active</span>
  );
}

// ── Detail Panel ───────────────────────────────────────────────────────────────

function DetailPanel({
  id,
  onEdit,
  onDelete,
  onApprove,
  onReject,
  onResetPwd,
  onSuspend,
}: {
  id: number;
  onEdit: () => void;
  onDelete: () => void;
  onApprove: () => void;
  onReject: () => void;
  onResetPwd: () => void;
  onSuspend: () => void;
}) {
  const { data, isLoading, isError } = useGetAdminCompanyByIdQuery(id);
  const c = data?.data;

  if (isLoading) return (
    <div className="flex items-center justify-center py-16">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  );
  if (isError || !c) return (
    <p className="text-sm text-red-500 py-8 text-center">Failed to load company.</p>
  );

  return (
    <>
      {/* Header row */}
      <div className="flex items-center gap-4 pb-5 border-b border-border">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0"
          style={{ background: avatarColor(c.id) }}
        >
          {getInitials(c.company_name)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-base font-bold text-foreground truncate">{c.company_name}</p>
          <p className="text-xs text-muted-foreground">{c.email}</p>
        </div>
        <div className="flex flex-col gap-1 items-end shrink-0">
          <ApprovalBadge status={c.approval_status} />
          <SuspendedBadge suspended={c.is_suspended} />
        </div>
      </div>

      {/* Logo */}
      {c.logo && (
        <div className="py-4 border-b border-border">
          <p className="text-[11px] text-muted-foreground mb-2">Logo</p>
          <img src={c.logo} alt={`${c.company_name} logo`} className="h-16 w-16 rounded-xl object-cover" />
        </div>
      )}

      {/* Details grid */}
      <div className="grid grid-cols-2 gap-y-5 gap-x-4 py-5 border-b border-border">
        {[
          ["Contact Person", c.contact_person || "—"],
          ["Phone", c.phone || "—"],
          ["Country", c.country || "—"],
          ["Subscription", c.subsription || "—"],
          ["Active Jobs", String(c.active_jobs)],
          ...(c.rejection_reason ? [["Rejection Reason", c.rejection_reason]] : []),
        ].map(([label, val]) => (
          <div key={label}>
            <p className="text-[11px] text-muted-foreground mb-1">{label}</p>
            <p className="text-sm font-medium text-foreground break-words">{val}</p>
          </div>
        ))}
        {c.about && (
          <div className="col-span-2">
            <p className="text-[11px] text-muted-foreground mb-1">About</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{c.about}</p>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2 pt-4">
        <button onClick={onEdit}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground text-xs font-medium transition-colors">
          <Pencil className="w-3.5 h-3.5" /> Edit
        </button>
        {c.approval_status !== "VERIFIED" && (
          <button onClick={onApprove}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#21c55e]/20 hover:bg-[#21c55e]/10 text-[#21c55e] text-xs font-medium transition-colors">
            <CheckCircle className="w-3.5 h-3.5" /> Approve
          </button>
        )}
        {c.approval_status !== "REJECTED" && (
          <button onClick={onReject}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-500/20 hover:bg-amber-500/10 text-amber-500 text-xs font-medium transition-colors">
            <XCircle className="w-3.5 h-3.5" /> Reject
          </button>
        )}
        <button onClick={onResetPwd}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground text-xs font-medium transition-colors">
          <Key className="w-3.5 h-3.5" /> Reset Password
        </button>
        <button onClick={onSuspend}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${c.is_suspended
              ? "border-amber-500/20 hover:bg-amber-500/10 text-amber-500"
              : "border-orange-500/20 hover:bg-orange-500/10 text-orange-500"
            }`}>
          <Ban className="w-3.5 h-3.5" /> {c.is_suspended ? "Unsuspend" : "Suspend"}
        </button>
        <button onClick={onDelete}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/20 hover:bg-red-500/10 text-red-500 text-xs font-medium transition-colors ml-auto">
          <Trash2 className="w-3.5 h-3.5" /> Delete
        </button>
      </div>
    </>
  );
}

// ── Edit Form ──────────────────────────────────────────────────────────────────

function EditForm({ company, onClose }: { company: AdminCompanyListItem; onClose: () => void }) {
  const { data: detail } = useGetAdminCompanyByIdQuery(company.id);
  const c = detail?.data;
  const [patch, { isLoading }] = usePatchAdminCompanyMutation();
  const [form, setForm] = useState({
    company_name: company.company_name,
    email: company.email,
    contact_person: c?.contact_person ?? "",
    phone: c?.phone ?? "",
    country: company.country ?? "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (c) {
      setForm((p) => ({
        ...p,
        contact_person: c.contact_person ?? "",
        phone: c.phone ?? "",
      }));
    }
  }, [c]);

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  async function handleSave() {
    setError("");
    try {
      await patch({
        id: company.id,
        company_name: form.company_name || undefined,
        email: form.email || undefined,
        contact_person: form.contact_person || undefined,
        phone: form.phone || undefined,
        country: form.country || undefined,
      }).unwrap();
      setSuccess(true);
      setTimeout(onClose, 900);
    } catch (err: unknown) {
      setError((err as { data?: { details?: string } })?.data?.details ?? "Save failed.");
    }
  }

  const inp = "w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-foreground outline-none focus:border-[#6366f1]/50 transition-colors placeholder:text-muted-foreground";

  return (
    <div className="py-4 space-y-4">
      {error && <p className="text-xs text-red-500 bg-red-500/10 border border-red-500/20 px-3 py-2.5 rounded-xl">{error}</p>}
      {success && <p className="text-xs text-[#21c55e] bg-[#21c55e]/10 border border-[#21c55e]/20 px-3 py-2.5 rounded-xl">Saved!</p>}
      <div>
        <label className="text-xs text-muted-foreground mb-1.5 block">Company Name</label>
        <input className={inp} value={form.company_name} onChange={(e) => set("company_name", e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block">Email</label>
          <input type="email" className={inp} value={form.email} onChange={(e) => set("email", e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block">Contact Person</label>
          <input className={inp} placeholder="Full name" value={form.contact_person} onChange={(e) => set("contact_person", e.target.value)} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block">Phone</label>
          <input className={inp} placeholder="+971 50 000 0000" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block">Country</label>
          <input className={inp} placeholder="UAE" value={form.country} onChange={(e) => set("country", e.target.value)} />
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        <button onClick={onClose} className="px-4 py-2 rounded-lg border border-border text-muted-foreground hover:bg-muted text-sm font-medium transition-colors">Cancel</button>
        <button onClick={handleSave} disabled={isLoading || success}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#6366f1] hover:bg-[#6366f1]/90 disabled:opacity-60 text-white text-sm font-medium transition-colors">

          {isLoading ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

// ── Reject Form ────────────────────────────────────────────────────────────────

function RejectForm({ company, onClose }: { company: AdminCompanyListItem; onClose: () => void }) {
  const [reject, { isLoading }] = useRejectAdminCompanyMutation();
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  async function handleReject() {
    if (!reason.trim()) { setError("Please provide a reason."); return; }
    setError("");
    try {
      await reject({ id: company.id, reason }).unwrap();
      onClose();
    } catch (err: unknown) {
      setError((err as { data?: { details?: string } })?.data?.details ?? "Rejection failed.");
    }
  }

  return (
    <div className="py-4 space-y-4">
      <p className="text-sm text-muted-foreground">
        Rejecting <span className="font-semibold text-foreground">{company.company_name}</span>. Please state the reason.
      </p>
      {error && <p className="text-xs text-red-500 bg-red-500/10 border border-red-500/20 px-3 py-2.5 rounded-xl">{error}</p>}
      <div>
        <label className="text-xs text-muted-foreground mb-1.5 block">Reason</label>
        <textarea
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g. Invalid trade licence…"
          className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-foreground outline-none focus:border-amber-500/40 transition-colors resize-none placeholder:text-muted-foreground"
        />
      </div>
      <div className="flex justify-end gap-3 pt-2 border-t border-border">
        <button onClick={onClose} className="px-4 py-2 rounded-lg border border-border text-muted-foreground hover:bg-muted text-sm font-medium transition-colors">Cancel</button>
        <button onClick={handleReject} disabled={isLoading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 disabled:opacity-60 text-white text-sm font-medium transition-colors">

          {isLoading ? "Rejecting…" : "Reject Company"}
        </button>
      </div>
    </div>
  );
}

// ── Delete Confirm ─────────────────────────────────────────────────────────────

function DeleteConfirm({ company, onClose }: { company: AdminCompanyListItem; onClose: () => void }) {
  const [deleteCompany, { isLoading }] = useDeleteAdminCompanyMutation();
  const [error, setError] = useState("");

  async function handleDelete() {
    setError("");
    try {
      await deleteCompany(company.id).unwrap();
      onClose();
    } catch (err: unknown) {
      setError((err as { data?: { details?: string } })?.data?.details ?? "Delete failed.");
    }
  }

  return (
    <div className="py-4 space-y-4">
      <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
        <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-red-500">Permanently delete company</p>
          <p className="text-xs text-red-500/80 mt-1">
            <span className="font-bold">{company.company_name}</span> and all their data will be removed. This cannot be undone.
          </p>
        </div>
      </div>
      {error && <p className="text-xs text-red-500 bg-red-500/10 border border-red-500/20 px-3 py-2.5 rounded-xl">{error}</p>}
      <div className="flex justify-end gap-3 pt-2 border-t border-border">
        <button onClick={onClose} className="px-4 py-2 rounded-lg border border-border text-muted-foreground hover:bg-muted text-sm font-medium transition-colors">Cancel</button>
        <button onClick={handleDelete} disabled={isLoading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 disabled:opacity-60 text-white text-sm font-medium transition-colors">

          {isLoading ? "Deleting…" : "Yes, Delete"}
        </button>
      </div>
    </div>
  );
}

// ── Approve Confirm ────────────────────────────────────────────────────────────

function ApproveConfirm({ company, onClose }: { company: AdminCompanyListItem; onClose: () => void }) {
  const [approve, { isLoading }] = useApproveAdminCompanyMutation();
  const [error, setError] = useState("");

  async function handleApprove() {
    setError("");
    try {
      await approve(company.id).unwrap();
      onClose();
    } catch (err: unknown) {
      setError((err as { data?: { details?: string } })?.data?.details ?? "Approval failed.");
    }
  }

  return (
    <div className="py-4 space-y-4">
      <p className="text-sm text-muted-foreground">
        Approve <span className="font-semibold text-foreground">{company.company_name}</span>? They will be able to post jobs and use the platform.
      </p>
      {error && <p className="text-xs text-red-500 bg-red-500/10 border border-red-500/20 px-3 py-2.5 rounded-xl">{error}</p>}
      <div className="flex justify-end gap-3 pt-2 border-t border-border">
        <button onClick={onClose} className="px-4 py-2 rounded-lg border border-border text-muted-foreground hover:bg-muted text-sm font-medium transition-colors">Cancel</button>
        <button onClick={handleApprove} disabled={isLoading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#21c55e] hover:bg-[#00c98e] disabled:opacity-60 text-white text-sm font-semibold transition-colors">

          {isLoading ? "Approving…" : "Approve"}
        </button>
      </div>
    </div>
  );
}

// ── Suspend Confirm ──────────────────────────────────────────────────────────

function SuspendConfirm({ company, onClose }: { company: AdminCompanyListItem; onClose: () => void }) {
  const [suspend, { isLoading: isSuspending }] = useSuspendAdminCompanyMutation();
  const [unsuspend, { isLoading: isUnsuspending }] = useUnsuspendAdminCompanyMutation();
  const [error, setError] = useState("");
  const isLoading = isSuspending || isUnsuspending;
  const isSuspended = company.is_suspended;

  async function handleToggle() {
    setError("");
    try {
      if (isSuspended) {
        await unsuspend(company.id).unwrap();
      } else {
        await suspend(company.id).unwrap();
      }
      onClose();
    } catch (err: unknown) {
      setError((err as { data?: { details?: string } })?.data?.details ?? "Action failed.");
    }
  }

  return (
    <div className="py-4 space-y-4">
      <div className="flex items-start gap-3 p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
        <Ban className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-orange-500">
            {isSuspended ? "Unsuspend company" : "Suspend company"}
          </p>
          <p className="text-xs text-orange-500/80 mt-1">
            {isSuspended
              ? <>Re-activate <span className="font-bold">{company.company_name}</span>. They will regain platform access.</>
              : <>Suspend <span className="font-bold">{company.company_name}</span>. They will lose platform access.</>
            }
          </p>
        </div>
      </div>
      {error && <p className="text-xs text-red-500 bg-red-500/10 border border-red-500/20 px-3 py-2.5 rounded-xl">{error}</p>}
      <div className="flex justify-end gap-3 pt-2 border-t border-border">
        <button onClick={onClose} className="px-4 py-2 rounded-lg border border-border text-muted-foreground hover:bg-muted text-sm font-medium transition-colors">Cancel</button>
        <button onClick={handleToggle} disabled={isLoading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 disabled:opacity-60 text-white text-sm font-medium transition-colors">

          {isLoading ? "Processing…" : isSuspended ? "Unsuspend" : "Suspend"}
        </button>
      </div>
    </div>
  );
}

// ── Reset Password Result ──────────────────────────────────────────────────────

function ResetPasswordPanel({ company, onClose }: { company: AdminCompanyListItem; onClose: () => void }) {
  const [resetPwd, { isLoading }] = useResetAdminCompanyPasswordMutation();
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  async function handleReset() {
    if (!password.trim()) { setError("Please enter a new password."); return; }
    setError("");
    try {
      await resetPwd({ id: company.id, new_password: password }).unwrap();
      setSuccess(true);
    } catch (err: unknown) {
      setError((err as { data?: { details?: string } })?.data?.details ?? "Reset failed.");
    }
  }

  function copyPwd() {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const inp = "w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-foreground outline-none focus:border-[#6366f1]/50 transition-colors placeholder:text-muted-foreground";

  return (
    <div className="py-4 space-y-4">
      {!success ? (
        <>
          <p className="text-sm text-muted-foreground">
            Set a new password for <span className="font-semibold text-foreground">{company.company_name}</span>.
          </p>
          {error && <p className="text-xs text-red-500 bg-red-500/10 border border-red-500/20 px-3 py-2.5 rounded-xl">{error}</p>}
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">New Password</label>
            <input
              type="text"
              className={inp}
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-border">
            <button onClick={onClose} className="px-4 py-2 rounded-lg border border-border text-muted-foreground hover:bg-muted text-sm font-medium transition-colors">Cancel</button>
            <button onClick={handleReset} disabled={isLoading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#6366f1] hover:bg-[#6366f1]/90 disabled:opacity-60 text-white text-sm font-medium transition-colors">

              {isLoading ? "Resetting…" : "Reset Password"}
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="text-sm text-[#21c55e]">Password reset successfully! Share this with the company:</p>
          <div className="flex items-center gap-2 bg-background border border-border rounded-xl px-4 py-3">
            <code className="flex-1 text-sm font-mono text-foreground tracking-wider">{password}</code>
            <button onClick={copyPwd} className="text-muted-foreground hover:text-foreground transition-colors">
              {copied ? <Check className="h-4 w-4 text-[#21c55e]" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
          <p className="text-xs text-muted-foreground">Store this securely — it won't be shown again.</p>
          <div className="flex justify-end pt-2 border-t border-border">
            <button onClick={onClose} className="px-4 py-2 rounded-lg bg-muted hover:bg-accent text-muted-foreground text-sm font-medium transition-colors">Done</button>
          </div>
        </>
      )}
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────

type ModalMode = "view" | "edit" | "delete" | "approve" | "reject" | "reset-pwd" | "suspend" | null;

const rowVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.03, duration: 0.3, ease: "easeOut" },
  }),
};

export default function CompanyManagementPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [place, setPlace] = useState("");
  const [industry, setIndustry] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const [modal, setModal] = useState<ModalMode>(null);
  const [selected, setSelected] = useState<AdminCompanyListItem | null>(null);

  const { data: res, isLoading, isFetching, isError, refetch } = useGetAdminCompaniesQuery({
    page,
    page_size: pageSize,
    search: search || undefined,
    status: status !== "ALL" ? status : undefined,
    place: place || undefined,
    industry: industry || undefined,
  });

  const rawData = res?.data ?? res;
  const companies: AdminCompanyListItem[] = Array.isArray(rawData)
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
      : companies.length;

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  function open(mode: ModalMode, c: AdminCompanyListItem) { setSelected(c); setModal(mode); }
  function close() { setModal(null); setSelected(null); }

  const hasFilters = !!search || status !== "ALL" || !!place || !!industry;

  const clearFilters = () => {
    setSearch("");
    setStatus("ALL");
    setPlace("");
    setIndustry("");
    setPage(1);
  };

  const modalTitle: Record<NonNullable<ModalMode>, string> = {
    view: "Company Details",
    edit: "Edit Company",
    delete: "Confirm Delete",
    approve: "Approve Company",
    reject: "Reject Company",
    "reset-pwd": "Reset Password",
    suspend: "Suspend / Unsuspend",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Company Management</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {isLoading ? "Loading…" : `${totalCount} total companies found`}
        </p>
      </div>

      {/* Toolbar & Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search name, email, contact…"
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
          <option value="VERIFIED">Verified</option>
          <option value="REJECTED">Rejected</option>
          <option value="ACTIVE">Active</option>
          <option value="SUSPENDED">Suspended</option>
        </select>

        {/* Country / Place Input Filter */}
        <input
          type="text"
          placeholder="Filter by country/place…"
          value={place}
          onChange={(e) => { setPlace(e.target.value); setPage(1); }}
          className="bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:border-[#21c55e]/40 transition-colors max-w-[180px]"
        />

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

      {/* Error banner */}
      {isError && (
        <ErrorState
          icon={AlertTriangle}
          title="Unable to load companies"
          description="Something went wrong while fetching the company list."
          onRetry={() => refetch()}
          retryLabel="Retry"
        />
      )}

      {/* Table Card */}
      {!isError && (
        <div className="rounded-2xl bg-card border border-border overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px]" role="grid" aria-label="Companies list">
              <thead>
                <tr className="border-b border-border sticky top-0 bg-card/95 backdrop-blur z-10">
                  {["Company", "Country", "Jobs", "Subscription", "Approval", "Status", "Actions"].map((h) => (
                    <th key={h} className={`px-4 py-3.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider ${h === "Actions" ? "text-right" : "text-left"}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading
                  ? <SkeletonTable rows={5} columns={7} />
                  : companies.length === 0
                    ? (
                      <tr>
                        <td colSpan={7}>
                          <EmptyState
                            icon={Building2}
                            title="No companies found"
                            description={hasFilters ? "No companies match your selected filters." : "Get started by adding your first company to the platform."}
                          />
                        </td>
                      </tr>
                    )
                    : companies.map((c, idx) => (
                      <motion.tr
                        key={c.id}
                        custom={idx}
                        initial="hidden"
                        animate="visible"
                        variants={rowVariants}
                        className={`border-b border-border hover:bg-muted/50 transition-colors ${idx === companies.length - 1 ? "border-b-0" : ""}`}
                      >
                        {/* Company */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
                              style={{ background: avatarColor(c.id) }}>
                              {getInitials(c.company_name)}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">{c.company_name}</p>
                              <p className="text-xs text-muted-foreground">{c.email}</p>
                            </div>
                          </div>
                        </td>

                        {/* Country */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1.5">
                            <Globe className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                            <span className="text-sm text-muted-foreground">{c.country || "—"}</span>
                          </div>
                        </td>

                        {/* Jobs */}
                        <td className="px-4 py-3.5">
                          <span className="text-sm text-muted-foreground">{c.active_jobs ?? 0}</span>
                        </td>

                        {/* Subscription */}
                        <td className="px-4 py-3.5">
                          <span className="capitalize text-blue-600 bg-blue-600/10 px-2 py-1 inline-block text-center rounded-lg text-xs font-semibold"> {c.subscription ?? "—"}</span>
                        </td>

                        {/* Approval */}
                        <td className="px-4 py-3.5">
                          <ApprovalBadge status={c.approval_status} />
                        </td>

                        {/* Suspended Status */}
                        <td className="px-4 py-3.5">
                          <SuspendedBadge suspended={c.is_suspended} />
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => open("view", c)} aria-label="View company"
                              className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                              <Eye className="h-3.5 w-3.5" />
                            </button>
                            <button onClick={() => open("edit", c)} aria-label="Edit company"
                              className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            {c.approval_status === "PENDING" && (
                              <button onClick={() => open("approve", c)} aria-label="Approve company"
                                className="p-1.5 rounded-lg hover:bg-[#21c55e]/10 text-muted-foreground hover:text-[#21c55e] transition-colors">
                                <CheckCircle className="h-3.5 w-3.5" />
                              </button>
                            )}
                            <button onClick={() => open("delete", c)} aria-label="Delete company"
                              className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors">
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
                Showing {Math.min((page - 1) * pageSize + 1, totalCount)}–{Math.min(page * pageSize, totalCount)} of {totalCount} companies
              </span>
              <div className="flex items-center gap-1">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} aria-label="Previous page"
                  className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors">
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((n) => n === 1 || n === totalPages || Math.abs(n - page) <= 2)
                  .map((n) => (
                    <button key={n} onClick={() => setPage(n)} aria-label={`Page ${n}`} aria-current={n === page ? "page" : undefined}
                      className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors ${n === page ? "bg-[#21c55e]/20 text-[#21c55e]" : "hover:bg-muted text-muted-foreground"}`}>
                      {n}
                    </button>
                  ))}
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} aria-label="Next page"
                  className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors">
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Single dialog for all modals */}
      <Dialog open={modal !== null} onOpenChange={(o) => { if (!o) close(); }}>
        <DialogContent className="bg-card border-border text-foreground max-w-lg p-6 rounded-2xl overflow-hidden !ring-0 max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-4 border-b border-border">
            <DialogTitle className="text-lg font-bold text-foreground">
              {modal ? modalTitle[modal] : ""}
            </DialogTitle>
          </DialogHeader>

          {selected && modal === "view" && (
            <DetailPanel
              id={selected.id}
              onEdit={() => setModal("edit")}
              onDelete={() => setModal("delete")}
              onApprove={() => setModal("approve")}
              onReject={() => setModal("reject")}
              onResetPwd={() => setModal("reset-pwd")}
              onSuspend={() => setModal("suspend")}
            />
          )}
          {selected && modal === "edit" && <EditForm company={selected} onClose={close} />}
          {selected && modal === "delete" && <DeleteConfirm company={selected} onClose={close} />}
          {selected && modal === "approve" && <ApproveConfirm company={selected} onClose={close} />}
          {selected && modal === "reject" && <RejectForm company={selected} onClose={close} />}
          {selected && modal === "reset-pwd" && <ResetPasswordPanel company={selected} onClose={close} />}
          {selected && modal === "suspend" && <SuspendConfirm company={selected} onClose={close} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
