"use client";

import React, { useState, useEffect } from "react";
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
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { useChangePasswordMutation, useGetCompanyProfileQuery, useUpdateCompanyProfileMutation } from "@/store/authApi";
import type { CompanyProfile } from "@/store/authApi";
import { get403Message } from "@/lib/utils";

export default function CompanySettingsPage() {
  const { data: profileData, isLoading: isLoadingProfile, isError: isProfileError, error: profileError, refetch } = useGetCompanyProfileQuery();
  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateCompanyProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();

  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [phone, setPhone] = useState("");
  const [workEmail, setWorkEmail] = useState("");
  const [address, setAddress] = useState("");
  const [about, setAbout] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [licenceNumber, setLicenceNumber] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [tradeLicenceFile, setTradeLicenceFile] = useState<File | null>(null);

  const maxAbout = 600;

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (profileData?.data) {
      const p: CompanyProfile = profileData.data;
      setCompanyName(p.company_name);
      setIndustry(p.industry);
      setPhone(p.phone);
      setWorkEmail(p.work_email);
      setAddress(p.address || "");
      setAbout(p.about || "");
      setFirstName(p.first_name);
      setLastName(p.last_name);
      setLicenceNumber(p.licence_number || "");
      setLogoPreview(p.logo);
    }
  }, [profileData]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Logo must be under 2 MB");
        return;
      }
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleTradeLicenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        toast.error("Trade licence must be a PDF file");
        return;
      }
      setTradeLicenceFile(file);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("company_name", companyName);
    formData.append("industry", industry);
    formData.append("phone", phone);
    formData.append("work_email", workEmail);
    formData.append("address", address);
    formData.append("about", about);
    formData.append("first_name", firstName);
    formData.append("last_name", lastName);
    formData.append("licence_number", licenceNumber);

    if (logoFile) {
      formData.append("logo", logoFile);
    }
    if (tradeLicenceFile) {
      formData.append("trade_licence", tradeLicenceFile);
    }

    try {
      await updateProfile(formData).unwrap();
      toast.success("Profile updated successfully");
      setLogoFile(null);
      setTradeLicenceFile(null);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.details ?? "Failed to update profile");
    }
  };

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

  if (isLoadingProfile) {
    return (
      <div className="min-h-full bg-background text-foreground">
        <div className="max-w-full mx-auto px-6 py-8 space-y-8">
          <div className="space-y-3">
            <div className="h-8 w-48 bg-muted rounded-xl animate-pulse" />
            <div className="h-4 w-64 bg-muted rounded-xl animate-pulse" />
          </div>
          <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
            <div className="h-40 bg-muted rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (isProfileError) {
    const msg = get403Message(profileError);
    return (
      <div className="min-h-full bg-background text-foreground">
        <div className="max-w-full mx-auto px-6 py-8 flex flex-col items-center justify-center py-20 text-center">
          <div className="h-16 w-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">{msg ? "Access Denied" : "Failed to load settings"}</h2>
          <p className="text-sm text-muted-foreground mb-4 max-w-sm">
            {msg || "Something went wrong while fetching your profile."}
          </p>
          {!msg && (
            <button onClick={() => refetch()} className="text-sm font-semibold text-[#4BC957] hover:underline">
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-background text-foreground">
      <div className="max-w-full mx-auto px-6 py-8 space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Company profile workspace</p>
        </div>

        {/* Profile Card */}
        <form onSubmit={handleSaveProfile}>
          <div className="bg-card border border-border rounded-2xl p-6 space-y-6 shadow-sm">

            {/* Logo Upload */}
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-xl bg-muted border border-border flex items-center justify-center text-lg font-extrabold text-foreground shrink-0 overflow-hidden">
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  profileData?.data?.company_name?.charAt(0)?.toUpperCase() || "L"
                )}
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-foreground border border-border bg-background hover:bg-muted px-4 py-2 rounded-lg transition-colors cursor-pointer">
                  <UploadCloud className="w-4 h-4" />
                  Upload logo
                  <input type="file" accept="image/png,image/jpeg" onChange={handleLogoChange} className="hidden" />
                </label>
                <p className="text-xs text-muted-foreground mt-1.5">PNG or JPG • square, max 2 MB</p>
              </div>
            </div>

            {/* Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">First name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Last name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Company name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Industry</label>
                <input
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Work email</label>
                <input
                  type="email"
                  value={workEmail}
                  onChange={(e) => setWorkEmail(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition"
                />
              </div>
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
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
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Licence number</label>
                <input
                  type="text"
                  value={licenceNumber}
                  onChange={(e) => setLicenceNumber(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition"
                />
              </div>
            </div>
          </div>


        {/* Trade Licence */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#4BC957]" />
              <h2 className="text-base font-bold text-foreground">Trade licence</h2>
            </div>
            {/* <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#4BC957]/10 text-[#4BC957] border border-[#4BC957]/20 px-3 py-1 rounded-full">
              <Check className="w-3 h-3" />
              Verified
            </span> */}
          </div>

          <div className="bg-background border border-border rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#4BC957]/10 rounded-lg flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-[#4BC957]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {profileData?.data?.trade_licence ? profileData.data.trade_licence.split("/").pop() : "No trade licence uploaded"}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {profileData?.data?.licence_number || "No licence number"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground border border-border bg-background hover:bg-muted px-3 py-1.5 rounded-lg transition-colors cursor-pointer">
                <RefreshCw className="w-3.5 h-3.5" />
                Update
                <input type="file" accept="application/pdf" onChange={handleTradeLicenceChange} className="hidden" />
              </label>
            </div>
          </div>
        </div>

        {/* Save Profile Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isUpdatingProfile}
            className="text-sm font-semibold bg-[#4BC957] hover:bg-[#3DAF49] text-white px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isUpdatingProfile && <Loader2 className="w-4 h-4 animate-spin" />}
            {isUpdatingProfile ? "Saving..." : "Save changes"}
          </button>
        </div>
        </form>

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
