"use client";

import { use, useState } from "react";
import {
  ChevronLeft, MapPin, Phone, Mail, Calendar,
  CheckCircle2, ShieldOff, Trash2, Loader2, Ban,
  Key, Copy, Check,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useGetAdminCandidateByIdQuery,
  useDeleteAdminCandidateMutation,
  useSuspendAdminCandidateMutation,
  useUnsuspendAdminCandidateMutation,
  useResetAdminCandidatePasswordMutation,
} from "@/store/authApi";

function getInitials(name: string) {
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

export default function CandidateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const id = parseInt(resolvedParams.id, 10);

  const { data, isLoading, isError } = useGetAdminCandidateByIdQuery(id);
  const [deleteCandidate, { isLoading: isDeleting }] = useDeleteAdminCandidateMutation();
  const [suspendCandidate, { isLoading: isSuspending }] = useSuspendAdminCandidateMutation();
  const [unsuspendCandidate, { isLoading: isUnsuspending }] = useUnsuspendAdminCandidateMutation();
  const [resetPwd, { isLoading: isResetting }] = useResetAdminCandidatePasswordMutation();

  const [showResetModal, setShowResetModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState("");
  const [copied, setCopied] = useState(false);

  const c = data?.data;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !c) {
    return (
      <div className="py-20 text-center">
        <p className="text-red-400">Failed to load candidate details.</p>
        <button
          onClick={() => router.back()}
          className="mt-4 text-sm text-[#6366f1] hover:underline"
        >
          Go Back
        </button>
      </div>
    );
  }

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this candidate?")) {
      await deleteCandidate(id);
      router.push("/admin/candidates");
    }
  };

  const handleSuspend = async () => {
    const action = c.is_suspended ? "unsuspend" : "suspend";
    if (confirm(`Are you sure you want to ${action} this candidate?`)) {
      if (c.is_suspended) {
        await unsuspendCandidate(id);
      } else {
        await suspendCandidate(id);
      }
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword.trim()) {
      setResetError("Please enter a new password.");
      return;
    }
    setResetError("");
    try {
      await resetPwd({ id, new_password: newPassword }).unwrap();
      setResetSuccess(true);
    } catch (err: unknown) {
      setResetError((err as { data?: { details?: string } })?.data?.details ?? "Reset failed.");
    }
  };

  const copyPwd = () => {
    navigator.clipboard.writeText(newPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openResetModal = () => {
    setNewPassword("");
    setResetSuccess(false);
    setResetError("");
    setCopied(false);
    setShowResetModal(true);
  };

  const ps = c.profile_summary;

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ChevronLeft className="h-4 w-4" /> Back
        </button>
        <h1 className="text-2xl font-bold text-foreground">{c.full_name}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-4 space-y-4">
          {/* Profile Card */}
          <div className="rounded-xl bg-card border border-border p-6 shadow-sm">
            <div className="flex flex-col items-center text-center pb-6 border-b border-border">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white mb-3"
                style={{ background: avatarColor(c.id) }}
              >
                {getInitials(c.full_name)}
              </div>
              <h2 className="text-lg font-bold text-foreground">{c.full_name}</h2>
              <p className="text-xs text-muted-foreground mb-3">{c.email}</p>
              <div className="flex gap-2">
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-semibold border ${
                  c.is_suspended
                    ? "bg-red-500/10 border-red-500/20 text-red-500"
                    : "bg-[#21c55e]/10 border-[#21c55e]/20 text-[#21c55e]"
                }`}>
                  {c.status}
                </span>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-semibold bg-[#6366f1]/10 border border-[#6366f1]/20 text-[#6366f1]">
                  {c.plan_badge}
                </span>
              </div>
            </div>
            <div className="pt-6 space-y-3">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{c.phone || "—"}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{c.country || "—"}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{c.email}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Joined {c.joined}</span>
              </div>
            </div>
          </div>

          {/* Skills Card */}
          <div className="rounded-xl bg-card border border-border p-5 shadow-sm">
            <h3 className="text-xs font-bold text-foreground mb-3">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {c.skills.map((skill) => (
                <span key={skill} className="px-2.5 py-1 rounded-md bg-muted text-muted-foreground text-[10px] font-medium border border-border/50">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Profile Summary */}
          <div className="rounded-xl bg-card border border-border p-5 shadow-sm">
            <h3 className="text-xs font-bold text-foreground mb-3">Profile Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">ATS Score</span>
                <span className="font-bold text-[#21c55e]">{ps.ats_score}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Designations</span>
                <span className="font-semibold text-foreground">{ps.designations}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Active Plans</span>
                <span className="font-semibold text-foreground">{ps.active_plans}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Jobs Applied</span>
                <span className="font-semibold text-foreground">{ps.jobs_applied}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-8 space-y-4">

          {/* Designation Plans */}
          <div className="rounded-xl bg-card border border-border p-5 shadow-sm">
            <div className="mb-4">
              <h3 className="text-sm font-bold text-foreground">Designation Plans</h3>
              <p className="text-[11px] text-muted-foreground">Each designation requires its own subscription. Changing designation = new plan required.</p>
            </div>

            <div className="space-y-3">
              {c.designation_plans.map((dp) => (
                <div key={dp.id} className="rounded-lg border border-border bg-muted/20 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-md bg-[#6366f1]/10 flex items-center justify-center text-[#6366f1]">
                        <ShieldOff className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-foreground">{dp.designation}</span>
                          <span className="text-[10px] text-muted-foreground">{dp.industry}</span>
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#21c55e]/10 text-[#21c55e]">{dp.status}</span>
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#6366f1]/10 text-[#6366f1]">{dp.plan}</span>
                        </div>
                        <div className="flex items-center gap-4 text-[10px] text-muted-foreground mt-1">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Started {dp.started_at}</span>
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Expires {dp.expires_at}</span>
                          <span>{dp.price_text}</span>
                          <span>{dp.jobs_applied_count} jobs applied</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {dp.features.map((tag) => (
                      <span key={tag} className="flex items-center gap-1 text-[9px] font-medium text-muted-foreground bg-muted px-2 py-1 rounded-md border border-border/50">
                        <CheckCircle2 className="w-3 h-3 text-[#6366f1]" /> {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Application History */}
          <div className="rounded-xl bg-card border border-border p-5 shadow-sm">
            <div className="mb-4">
              <h3 className="text-sm font-bold text-foreground">Application History</h3>
              <p className="text-[11px] text-muted-foreground">Jobs applied under each designation</p>
            </div>

            <div className="space-y-4">
              {c.application_history.length === 0 ? (
                <p className="text-xs text-muted-foreground">No application history.</p>
              ) : (
                c.application_history.map((ah, idx) => (
                  <div key={idx} className={`pb-4 ${idx < c.application_history.length - 1 ? "border-b border-border" : ""}`}>
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        <ShieldOff className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs font-semibold text-foreground">{ah.designation}</span>
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#6366f1]/10 text-[#6366f1]">{ah.plan}</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground">{ah.applications_count} applications</span>
                    </div>
                    {ah.applications.length === 0 ? (
                      <p className="text-[10px] text-muted-foreground pl-6">No recorded applications</p>
                    ) : (
                      <div className="space-y-2 pl-6">
                        {ah.applications.map((app, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <div>
                              <span className="block text-xs font-semibold text-foreground">{app.title}</span>
                              <span className="text-[10px] text-muted-foreground">{app.company} - {app.date}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              {app.score && <span className="text-[10px] font-bold text-[#21c55e]">{app.score}</span>}
                              {app.status && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/20">
                                  {app.status}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        <button
          onClick={openResetModal}
          className="flex items-center justify-center gap-2 py-2.5 rounded-lg border border-border bg-card hover:bg-muted text-sm font-semibold text-foreground transition-colors shadow-sm"
        >
          <Key className="h-4 w-4" /> Reset Password
        </button>
        <button
          onClick={handleSuspend}
          disabled={isSuspending || isUnsuspending}
          className="flex items-center justify-center gap-2 py-2.5 rounded-lg border border-border bg-card hover:bg-muted text-sm font-semibold text-foreground transition-colors shadow-sm disabled:opacity-60"
        >
          {(isSuspending || isUnsuspending) && <Loader2 className="h-4 w-4 animate-spin" />}
          <Ban className="h-4 w-4" />
          {c.is_suspended ? "Unsuspend" : "Suspend"}
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="py-2.5 rounded-lg border border-red-500/20 bg-card hover:bg-red-500/10 text-sm font-semibold text-red-500 transition-colors shadow-sm disabled:opacity-60"
        >
          {isDeleting ? "Deleting…" : "Delete"}
        </button>
      </div>

      {/* Reset Password Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-bold text-foreground mb-4">Reset Password</h3>
            {!resetSuccess ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Set a new password for <span className="font-semibold text-foreground">{c.full_name}</span>.
                </p>
                {resetError && (
                  <p className="text-xs text-red-500 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg">{resetError}</p>
                )}
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">New Password</label>
                  <input
                    type="text"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-[#6366f1]/50 transition-colors placeholder:text-muted-foreground"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2 border-t border-border">
                  <button
                    onClick={() => setShowResetModal(false)}
                    className="px-4 py-2 rounded-lg border border-border text-muted-foreground hover:bg-muted text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleResetPassword}
                    disabled={isResetting}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#6366f1] hover:bg-[#6366f1]/90 disabled:opacity-60 text-white text-sm font-medium transition-colors"
                  >
                  
                    {isResetting ? "Resetting…" : "Reset Password"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-[#21c55e]">Password reset successfully! Share this with the candidate:</p>
                <div className="flex items-center gap-2 bg-background border border-border rounded-lg px-4 py-3">
                  <code className="flex-1 text-sm font-mono text-foreground tracking-wider">{newPassword}</code>
                  <button onClick={copyPwd} className="text-muted-foreground hover:text-foreground transition-colors">
                    {copied ? <Check className="h-4 w-4 text-[#21c55e]" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">Store this securely — it won't be shown again.</p>
                <div className="flex justify-end pt-2 border-t border-border">
                  <button
                    onClick={() => setShowResetModal(false)}
                    className="px-4 py-2 rounded-lg bg-muted hover:bg-accent text-muted-foreground text-sm font-medium transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
