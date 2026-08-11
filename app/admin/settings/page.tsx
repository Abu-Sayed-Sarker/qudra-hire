"use client";

import { useState, useEffect } from "react";
import { Loader2, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  useGetAdminSettingsQuery,
  usePatchAdminSettingsMutation,
} from "@/store/authApi";

export default function SettingsPage() {
  const { data, isLoading, isError } = useGetAdminSettingsQuery();
  const [patchSettings, { isLoading: isSaving }] = usePatchAdminSettingsMutation();

  const settings = data?.data;

  const [form, setForm] = useState({
    platform_name: "",
    support_email: "",
    currency: "AED",
    timezone: "Asia/Dubai",
    primary_language: "English (EN)",
    rtl_support: true,
    email_notifications: true,
    ai_auto_matching: true,
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (settings) {
      setForm({
        platform_name: settings.platform_name,
        support_email: settings.support_email,
        currency: settings.currency,
        timezone: settings.timezone,
        primary_language: settings.primary_language,
        rtl_support: settings.rtl_support,
        email_notifications: settings.email_notifications,
        ai_auto_matching: settings.ai_auto_matching,
      });
    }
  }, [settings]);

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  async function handleSave() {
    setError("");
    setSuccess(false);
    try {
      await patchSettings(form).unwrap();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      setError((err as { data?: { details?: string } })?.data?.details ?? "Failed to save settings.");
    }
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        {!isLoading && !isError && (
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#6366f1] hover:bg-[#6366f1]/90 disabled:opacity-60 text-white text-sm font-medium transition-colors"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {isSaving ? "Saving…" : "Save Changes"}
          </button>
        )}
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {isError && (
        <p className="text-sm text-red-400 py-20 text-center">Failed to load settings.</p>
      )}

      {!isLoading && !isError && (
        <>
          {error && (
            <p className="text-xs text-red-500 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg">{error}</p>
          )}
          {success && (
            <p className="text-xs text-[#21c55e] bg-[#21c55e]/10 border border-[#21c55e]/20 px-3 py-2 rounded-lg">Settings saved successfully!</p>
          )}

          {/* General Settings */}
          <div className="rounded-xl bg-card border border-border overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="text-sm font-semibold text-foreground">General</h2>
            </div>
            <div className="p-6 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="platform-name" className="text-xs text-muted-foreground">Platform Name</Label>
                <Input
                  id="platform-name"
                  value={form.platform_name}
                  onChange={(e) => set("platform_name", e.target.value)}
                  className="bg-background border-border text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="support-email" className="text-xs text-muted-foreground">Support Email</Label>
                <Input
                  id="support-email"
                  type="email"
                  value={form.support_email}
                  onChange={(e) => set("support_email", e.target.value)}
                  className="bg-background border-border text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency" className="text-xs text-muted-foreground">Currency</Label>
                <Select value={form.currency} onValueChange={(v) => v && set("currency", v)}>
                  <SelectTrigger id="currency" className="bg-background border-border text-foreground h-10 w-full">
                    <SelectValue placeholder="Select Currency" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border text-foreground">
                    <SelectItem value="AED">AED</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="SAR">SAR</SelectItem>
                    <SelectItem value="QAR">QAR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone" className="text-xs text-muted-foreground">Timezone</Label>
                <Select value={form.timezone} onValueChange={(v) => v && set("timezone", v)}>
                  <SelectTrigger id="timezone" className="bg-background border-border text-foreground h-10 w-full">
                    <SelectValue placeholder="Select Timezone" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border text-foreground">
                    <SelectItem value="Asia/Dubai">Asia/Dubai (UTC+4)</SelectItem>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="Asia/Riyadh">Asia/Riyadh (UTC+3)</SelectItem>
                    <SelectItem value="Asia/Qatar">Asia/Qatar (UTC+3)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Localization & Preferences */}
          <div className="rounded-xl bg-card border border-border overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="text-sm font-semibold text-foreground">Localization & Preferences</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="language" className="text-xs text-muted-foreground">Primary Language</Label>
                <Select value={form.primary_language} onValueChange={(v) => v && set("primary_language", v)}>
                  <SelectTrigger id="language" className="bg-background border-border text-foreground h-10 w-full">
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border text-foreground">
                    <SelectItem value="English (EN)">English (EN)</SelectItem>
                    <SelectItem value="Arabic (AR)">Arabic (AR)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between py-1">
                <div className="space-y-1">
                  <Label htmlFor="rtl-support" className="text-sm font-medium text-foreground">RTL Support (Arabic)</Label>
                  <p className="text-xs text-muted-foreground">Enable right-to-left layout for Arabic</p>
                </div>
                <Switch
                  id="rtl-support"
                  checked={form.rtl_support}
                  onCheckedChange={(v) => set("rtl_support", v)}
                  className="data-[state=checked]:bg-[#6366f1]"
                />
              </div>

              <div className="w-full h-px bg-border" />

              <div className="flex items-center justify-between py-1">
                <div className="space-y-1">
                  <Label htmlFor="email-notifications" className="text-sm font-medium text-foreground">Email Notifications</Label>
                  <p className="text-xs text-muted-foreground">Send transactional emails</p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={form.email_notifications}
                  onCheckedChange={(v) => set("email_notifications", v)}
                  className="data-[state=checked]:bg-[#6366f1]"
                />
              </div>

              <div className="w-full h-px bg-border" />

              <div className="flex items-center justify-between py-1">
                <div className="space-y-1">
                  <Label htmlFor="auto-matching" className="text-sm font-medium text-foreground">AI Auto-Matching</Label>
                  <p className="text-xs text-muted-foreground">Auto-run matching when jobs are posted</p>
                </div>
                <Switch
                  id="auto-matching"
                  checked={form.ai_auto_matching}
                  onCheckedChange={(v) => set("ai_auto_matching", v)}
                  className="data-[state=checked]:bg-[#6366f1]"
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
