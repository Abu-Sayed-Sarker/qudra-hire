"use client";

import React, { useState } from "react";
import {
  UploadCloud,
  ShieldCheck,
  Eye,
  Trash2,
  Download,
  RefreshCw,
  Lock,
  FileText,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { useChangePasswordMutation } from "@/store/authApi";

export default function CompanySettingsPage() {
  const [about, setAbout] = useState(
    "Emirates NBD is a leading banking group in the MENAT region. We are driving innovation in engineering, data and design."
  );
  const maxAbout = 600;

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All password fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      await changePassword({
        password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      }).unwrap();

      toast.success("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowCurrent(false);
      setShowNew(false);
      setShowConfirm(false);
    } catch (err: any) {
      toast.error(err?.data?.details ?? "Failed to update password");
    }
  };

  return (
    <div className="min-h-full bg-background text-foreground">
      <div className="max-w-full mx-auto px-6 py-8 space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Company profile workspace</p>
        </div>

        {/* Profile Card */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-6 shadow-sm">

          {/* Logo Upload */}
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-xl bg-muted border border-border flex items-center justify-center text-lg font-extrabold text-foreground shrink-0">
              ENB
            </div>
            <div>
              <button className="flex items-center gap-2 text-sm font-semibold text-foreground border border-border bg-background hover:bg-muted px-4 py-2 rounded-lg transition-colors">
                <UploadCloud className="w-4 h-4" />
                Upload logo
              </button>
              <p className="text-xs text-muted-foreground mt-1.5">PNG or JPG • square, max 2 MB</p>
            </div>
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Company name</label>
              <input
                type="text"
                defaultValue="Emirates NBD"
                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Industry</label>
              <input
                type="text"
                defaultValue="Banking & Financial Services"
                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Phone</label>
              <input
                type="text"
                defaultValue="+971 4 609 2222"
                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Work email</label>
              <input
                type="email"
                defaultValue="talent@emiratesnbd.com"
                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition"
              />
            </div>
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Address</label>
              <input
                type="text"
                defaultValue="Dubai, UAE"
                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition"
              />
            </div>
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">About</label>
              <div className="relative">
                <textarea
                  rows={4}
                  value={about}
                  onChange={(e) => setAbout(e.target.value.slice(0, maxAbout))}
                  className="w-full bg-background border border-border rounded-lg px-3 py-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none transition"
                />
                <span className="absolute bottom-3 right-3 text-[10px] text-muted-foreground">
                  {about.length}/{maxAbout}
                </span>
              </div>
            </div>
          </div>

          {/* Save Profile Button */}
          <div className="flex justify-end pt-2">
            <button className="text-sm font-semibold bg-[#4BC957] hover:bg-[#3DAF49] text-white px-5 py-2.5 rounded-lg transition-colors">
              Save changes
            </button>
          </div>
        </div>

        {/* Trade Licence */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#4BC957]" />
              <h2 className="text-base font-bold text-foreground">Trade licence</h2>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#4BC957]/10 text-[#4BC957] border border-[#4BC957]/20 px-3 py-1 rounded-full">
              <Check className="w-3 h-3" />
              Verified
            </span>
          </div>

          <div className="bg-background border border-border rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#4BC957]/10 rounded-lg flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-[#4BC957]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">EmiratesNBD_TradeLicense_2026.pdf</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">512 KB • updated 5 days ago</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground border border-border bg-background hover:bg-muted px-3 py-1.5 rounded-lg transition-colors">
                <Eye className="w-3.5 h-3.5" /> View
              </button>
              <button className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-destructive border border-border bg-background hover:bg-muted px-3 py-1.5 rounded-lg transition-colors">
                <Trash2 className="w-3.5 h-3.5" /> Remove
              </button>
              <button className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground border border-border bg-background hover:bg-muted px-3 py-1.5 rounded-lg transition-colors">
                <Download className="w-3.5 h-3.5" /> Download
              </button>
              <button className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground border border-border bg-background hover:bg-muted px-3 py-1.5 rounded-lg transition-colors">
                <RefreshCw className="w-3.5 h-3.5" /> Update
              </button>
            </div>
          </div>
        </div>

        {/* Password */}
        <form className="bg-card border border-border rounded-2xl p-6 shadow-sm" onSubmit={handleChangePassword}>
          <div className="flex items-center gap-2 mb-6">
            <Lock className="w-5 h-5 text-[#4BC957]" />
            <h2 className="text-base font-bold text-foreground">Password</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Current password</label>
              <div className="relative">
                <input
                  type={showCurrent ? "text" : "password"}
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring pr-10 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">New password</label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring pr-10 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Confirm new password</label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring pr-10 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-5">
            <button
              type="submit"
              disabled={isChangingPassword}
              className="text-sm font-semibold bg-[#4BC957] hover:bg-[#3DAF49] text-white px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50"
            >
              {isChangingPassword ? "Updating..." : "Update password"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
