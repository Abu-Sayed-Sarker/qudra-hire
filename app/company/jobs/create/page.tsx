"use client";

import React, { useState } from "react";
import { ArrowLeft, ShieldCheck, Sparkles, Loader2, AlertTriangle, CreditCard, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCreateCompanyJobMutation,
  useGetJobQuotaQuery,
  usePurchaseJobSlotsMutation,
} from "@/store/authApi";
import type { CompanyJobPayload, JobQuota } from "@/store/authApi";
import { Skeleton, SkeletonForm } from "@/components/ui/skeleton-cards";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { motion } from "framer-motion";
import { get403Message } from "@/lib/utils";

const EMPTY_PAYLOAD: CompanyJobPayload = {
  title: "",
  description: "",
  requirements: "",
  skills: [],
  preferred_skills: [],
  benefits: [],
  location: "",
  employment_type: "FULL_TIME",
  currency: "",
  salary_min: 0,
  salary_max: 0,
  salary_period: "MONTH",
  visa_sponsorship: false,
  emiratization: false,
  saudization: false,
  open_to_remote: false,
  additional_questions: [],
};

const EMPLOYMENT_TYPES = [
  { value: "FULL_TIME", label: "Full Time" },
  { value: "REMOTE", label: "Remote" },
  { value: "HYBRID", label: "Hybrid" },
] as const;

const CURRENCIES = [
  { value: "AED", label: "AED" },
  { value: "USD", label: "USD" },
  { value: "SAR", label: "SAR" },
  { value: "QAR", label: "QAR" },
] as const;

export default function PostJobPage() {
  const router = useRouter();
  const [visaSp, setVisaSp] = useState(false);
  const [emiratization, setEmiratization] = useState(false);
  const [saudization, setSaudization] = useState(false);
  const [remote, setRemote] = useState(false);
  const [form, setForm] = useState<CompanyJobPayload>(EMPTY_PAYLOAD);
  const [skillsText, setSkillsText] = useState(form.skills.join(", "));
  const [error, setError] = useState<string | null>(null);
  const [quotaExceeded, setQuotaExceeded] = useState(false);
  const [quotaData, setQuotaData] = useState<JobQuota | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);

  const [createJob, { isLoading }] = useCreateCompanyJobMutation();
  const { data: quotaRes, isError: isQuotaError, error: quotaError } = useGetJobQuotaQuery();
  const [purchaseSlots] = usePurchaseJobSlotsMutation();

  const updateField = <K extends keyof CompanyJobPayload>(key: K, value: CompanyJobPayload[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await createJob({
        ...form,
        visa_sponsorship: visaSp,
        emiratization,
        saudization,
        open_to_remote: remote,
      }).unwrap();
      router.push("/company/jobs");
    } catch (err: unknown) {
      const apiError = err as { data?: { code?: string; details?: string } };
      if (apiError.data?.code === "JOB_QUOTA_EXCEEDED") {
        setQuotaExceeded(true);
        setQuotaData(quotaRes?.data ?? null);
        setError(null);
      } else {
        setError("Failed to create job. Please try again.");
      }
    }
  };

  const handlePurchaseSlots = async (quantity: number) => {
    setIsPurchasing(true);
    try {
      const result = await purchaseSlots({ quantity }).unwrap();
      if (result.data?.checkout_url) {
        window.location.href = result.data.checkout_url;
      }
    } catch {
      setError("Failed to purchase slots. Please try again.");
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <motion.div
      className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-full mx-auto"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Top Navigation Back / Title */}
      <div className="space-y-3">
        <Link
          href="/company/jobs"
          className="inline-flex items-center gap-2 font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Post a new job</h1>
            <p className="text-sm text-muted-foreground mt-1">AI will shortlist your top 10 matches within minutes.</p>
          </div>
          {/* <span className="bg-[#4BC957]/10 text-[#4BC957] border border-[#4BC957]/20 px-3 py-1.5 rounded-full font-semibold flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4" />
            Trade-licence verified
          </span> */}
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3" role="alert">
          <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" />
          <p className="text-sm text-red-500 font-medium">{error}</p>
        </div>
      )}

      {isQuotaError && (() => {
        const msg = get403Message(quotaError);
        return (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-3">
              <AlertTriangle className="h-6 w-6 text-red-500" />
            </div>
            <h3 className="text-sm font-bold text-foreground mb-1">{msg ? "Access Denied" : "Failed to load quota"}</h3>
            <p className="text-xs text-muted-foreground max-w-sm">
              {msg || "Something went wrong while fetching your job quota."}
            </p>
          </div>
        );
      })()}

      {quotaExceeded && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-6 space-y-4" role="alert">
          <div className="flex items-center gap-3">
            <CreditCard className="h-5 w-5 text-amber-500 shrink-0" />
            <div>
              <h3 className="text-sm font-bold text-foreground">Job posting limit reached</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                You have used all available slots on your {quotaData?.plan ?? "Pro"} plan.
                Purchase additional slots to post more jobs.
              </p>
            </div>
          </div>
          {quotaData && (
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-background rounded-lg p-3">
                <p className="text-lg font-bold text-foreground">{quotaData.total_allowed}</p>
                <p className="text-[11px] text-muted-foreground">Total slots</p>
              </div>
              <div className="bg-background rounded-lg p-3">
                <p className="text-lg font-bold text-foreground">{quotaData.used}</p>
                <p className="text-[11px] text-muted-foreground">Used</p>
              </div>
              <div className="bg-background rounded-lg p-3">
                <p className="text-lg font-bold text-red-500">{quotaData.remaining}</p>
                <p className="text-[11px] text-muted-foreground">Remaining</p>
              </div>
            </div>
          )}
          <div className="flex gap-3">
            <Button
              type="button"
              onClick={() => handlePurchaseSlots(1)}
              disabled={isPurchasing}
              className="flex items-center gap-2 bg-[#4BC957] hover:bg-[#00B96E] text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all active:scale-[0.98]"
            >
              {isPurchasing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CreditCard className="h-4 w-4" />
              )}
              Purchase 1 slot
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => { setQuotaExceeded(false); setQuotaData(null); }}
              className="text-sm font-medium"
            >
              Dismiss
            </Button>
          </div>
        </div>
      )}

      {isLoading && (
        <SkeletonForm fields={6} />
      )}

      {!isLoading && (
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Main Form (2/3 width) */}
            <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 space-y-6">

              {/* Job Title */}
              <div className="space-y-2">
                <label className="font-bold text-muted-foreground uppercase tracking-wider">Job title</label>
                <Input
                  type="text"
                  value={form.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  placeholder="e.g. Lead Developer"
                  className="bg-background border-border focus:border-[#4BC957]"
                  required
                />
              </div>

              {/* Skills Tag input */}
              <div className="space-y-2">
                <label className="font-bold text-muted-foreground uppercase tracking-wider">Skills (comma-separated)</label>
                <Input
                  type="text"
                  value={skillsText}
                  onChange={(e) => setSkillsText(e.target.value)}
                  onBlur={() => updateField("skills", skillsText.split(",").map((s) => s.trim()).filter(Boolean))}
                  placeholder="e.g. Figma, React, TypeScript"
                  className="bg-background border-border focus:border-[#4BC957]"
                />
              </div>

              {/* Location & Employment Type (2 Columns) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="font-bold text-muted-foreground uppercase tracking-wider">Location</label>
                  <Input
                    type="text"
                    value={form.location}
                    onChange={(e) => updateField("location", e.target.value)}
                    placeholder="Dubai, UAE."
                    className="bg-background border-border focus:border-[#4BC957]"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-bold text-muted-foreground uppercase tracking-wider">Employment type</label>
                  <Select value={form.employment_type} onValueChange={(v) => v && updateField("employment_type", v)}>
                    <SelectTrigger className="bg-background border-border focus:border-[#4BC957] h-10 w-full">
                      <SelectValue placeholder="Select employment type" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border text-foreground">
                      {EMPLOYMENT_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Currency & Salary Range (2 Columns) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="font-bold text-muted-foreground uppercase tracking-wider">Currency</label>
                  <Select value={form.currency} onValueChange={(v) => v && updateField("currency", v)}>
                    <SelectTrigger className="bg-background border-border focus:border-[#4BC957] h-10 w-full">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border text-foreground">
                      {CURRENCIES.map((curr) => (
                        <SelectItem key={curr.value} value={curr.value}>
                          {curr.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="font-bold text-muted-foreground uppercase tracking-wider">Salary range</label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={form.salary_min || ""}
                      onChange={(e) => updateField("salary_min", Number(e.target.value))}
                      placeholder="Min"
                      className="bg-background border-border focus:border-[#4BC957]"
                      required
                    />
                    <span className="text-muted-foreground">—</span>
                    <Input
                      type="number"
                      value={form.salary_max || ""}
                      onChange={(e) => updateField("salary_max", Number(e.target.value))}
                      placeholder="Max"
                      className="bg-background border-border focus:border-[#4BC957]"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Job Description */}
              <div className="space-y-2">
                <label className="font-bold text-muted-foreground uppercase tracking-wider">Job description</label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  placeholder="Describe the role..."
                  className="w-full bg-background border border-border focus:border-[#4BC957] text-foreground placeholder:text-muted-foreground rounded-xl p-4 text-sm focus:outline-none transition-colors resize-none"
                  required
                />
              </div>

              {/* Requirements */}
              <div className="space-y-2">
                <label className="font-bold text-muted-foreground uppercase tracking-wider">Requirements (one per line)</label>
                <textarea
                  rows={4}
                  value={form.requirements}
                  onChange={(e) => updateField("requirements", e.target.value)}
                  placeholder={"Requirement 1\nRequirement 2\nRequirement 3"}
                  className="w-full bg-background border border-border focus:border-[#4BC957] text-foreground placeholder:text-muted-foreground rounded-xl p-4 text-sm focus:outline-none transition-colors resize-none"
                  required
                />
              </div>

              {/* GCC Flags Switches Group */}
              <div className="border border-border rounded-xl p-5 space-y-4">
                <h3 className="font-bold text-muted-foreground uppercase tracking-wider mb-2">GCC flags</h3>

                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">Visa sponsorship offered</span>
                  <Switch
                    checked={visaSp}
                    onCheckedChange={setVisaSp}
                    className="data-checked:bg-[#4BC957]!"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">Emiratization (UAE national priority)</span>
                  <Switch
                    checked={emiratization}
                    onCheckedChange={setEmiratization}
                    className="data-checked:bg-[#4BC957]!"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">Saudization (Nitaqat-aligned)</span>
                  <Switch
                    checked={saudization}
                    onCheckedChange={setSaudization}
                    className="data-checked:bg-[#4BC957]!"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">Open to remote</span>
                  <Switch
                    checked={remote}
                    onCheckedChange={setRemote}
                    className="data-checked:bg-[#4BC957]!"
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex justify-start gap-3 border-t border-border pt-6">
                <Link
                  href="/company/jobs"
                  className="border border-border hover:bg-muted text-foreground font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors text-center"
                >
                  Cancel
                </Link>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-[#4BC957] hover:bg-[#00B96E] text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all shadow-md shadow-[#4BC957]/10 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#4BC957]/50 focus-visible:ring-offset-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    "Publish & get approved"
                  )}
                </Button>
              </div>

            </div>

            {/* Sidebar Info Columns (1/3 width) */}
            <div className="space-y-6">

              {/* What happens next */}
              <div className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-sm">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                  <Sparkles className="h-4.5 w-4.5 text-[#4BC957]" />
                  What happens next
                </h3>
                <ol className="space-y-3.5 text-muted-foreground list-decimal pl-4 leading-relaxed font-medium">
                  <li>AI scans 50,000+ candidate profiles</li>
                  <li>Top 10 ranked shortlist within minutes</li>
                  <li>Candidates appear anonymised — unlock with credits</li>
                  <li>Message directly inside the platform</li>
                </ol>
              </div>

              {/* Cost breakdown */}
              <div className="bg-card border border-border rounded-2xl p-6 space-y-5 shadow-sm">
                <h3 className="text-sm font-bold text-foreground">Cost</h3>

                <div className="space-y-3.5 font-semibold">
                  <div className="flex justify-between items-center text-muted-foreground">
                    <span>Top 10 shortlist</span>
                    <span className="text-foreground">Free</span>
                  </div>
                  <div className="flex justify-between items-center text-muted-foreground">
                    <span>Per unlock</span>
                    <span className="text-foreground">2 credits</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </form>
      )}
    </motion.div>
  );
}