"use client";

import React, { useState, useEffect, Suspense } from "react";
import { ArrowLeft, ShieldCheck, Sparkles, Loader2, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
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
  useGetCompanyJobDetailQuery,
  useRequestCompanyJobEditMutation,
} from "@/store/authApi";
import type { CompanyJob, CompanyJobPayload } from "@/store/authApi";
import { SkeletonForm } from "@/components/ui/skeleton-cards";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { motion } from "framer-motion";
import { get403Message } from "@/lib/utils";

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

function EditJobInner() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const router = useRouter();

  const [visaSp, setVisaSp] = useState(false);
  const [emiratization, setEmiratization] = useState(false);
  const [saudization, setSaudization] = useState(false);
  const [remote, setRemote] = useState(false);
  const [form, setForm] = useState<CompanyJobPayload>({
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
    custome: "",
    additional_questions: [],
  });
  const [skillsText, setSkillsText] = useState("");
  const [original, setOriginal] = useState<CompanyJobPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [requestSent, setRequestSent] = useState(false);

  const {
    data,
    isLoading: isLoadingDetail,
    isError: isDetailError,
  } = useGetCompanyJobDetailQuery(id ?? "", {
    skip: !id,
  });

  const [requestEdit, { isLoading: isRequesting }] = useRequestCompanyJobEditMutation();

  const job: CompanyJob | undefined = data?.data;

  useEffect(() => {
    if (job) {
      const payload: CompanyJobPayload = {
        title: job.title,
        description: job.description,
        requirements: job.requirements,
        skills: job.skills,
        preferred_skills: job.preferred_skills,
        benefits: job.benefits,
        location: job.location,
        employment_type: job.employment_type,
        currency: job.currency,
        salary_min: job.salary_min,
        salary_max: job.salary_max,
        salary_period: job.salary_period,
        visa_sponsorship: job.visa_sponsorship,
        emiratization: job.emiratization,
        saudization: job.saudization,
        open_to_remote: job.open_to_remote,
        custome: job.custome,
        additional_questions: job.additional_questions,
      };
      setForm(payload);
      setOriginal(payload);
      setSkillsText(payload.skills.join(", "));
      setVisaSp(job.visa_sponsorship);
      setEmiratization(job.emiratization);
      setSaudization(job.saudization);
      setRemote(job.open_to_remote);
    }
  }, [job]);

  const updateField = <K extends keyof CompanyJobPayload>(key: K, value: CompanyJobPayload[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const getDiff = (): Partial<CompanyJobPayload> => {
    if (!original) return {};
    const current = { ...form, visa_sponsorship: visaSp, emiratization, saudization, open_to_remote: remote };
    const diff: Partial<CompanyJobPayload> = {};
    const fields: (keyof CompanyJobPayload)[] = [
      "title", "description", "requirements", "skills", "preferred_skills",
      "benefits", "location", "employment_type", "currency", "salary_min",
      "salary_max", "salary_period", "visa_sponsorship", "emiratization",
      "saudization", "open_to_remote", "custome",
    ];
    for (const key of fields) {
      if (JSON.stringify(current[key]) !== JSON.stringify(original[key])) {
        (diff as any)[key] = current[key];
      }
    }
    return diff;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    const diff = getDiff();
    if (Object.keys(diff).length === 0) {
      setError("No changes detected. Please modify at least one field.");
      return;
    }
    setError(null);
    try {
      await requestEdit({ id, proposed_changes: diff }).unwrap();
      setRequestSent(true);
    } catch (err: any) {
      setError(err?.data?.details || "Failed to send edit request. Please try again.");
    }
  };

  if (!id) {
    return (
      <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-full mx-auto">
        <ErrorState
          title="No job selected"
          description="Please select a job from the list to edit."
          onRetry={() => router.push("/company/jobs")}
          retryLabel="Browse jobs"
        />
      </div>
    );
  }

  if (isDetailError) {
    const msg = get403Message(error);
    return (
      <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-full mx-auto">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-16 w-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">{msg ? "Access Denied" : "Failed to load job"}</h2>
          <p className="text-sm text-muted-foreground mb-4 max-w-sm">
            {msg || "Something went wrong while fetching the job details."}
          </p>
          {!msg && (
            <button onClick={() => window.location.reload()} className="text-sm font-semibold text-[#4BC957] hover:underline">
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  if (requestSent) {
    return (
      <motion.div
        className="p-4 md:p-8 max-w-full mx-auto"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
          <div className="h-20 w-20 rounded-full bg-[#4BC957]/15 border border-[#4BC957]/30 flex items-center justify-center shadow-[0_0_40px_-8px_rgba(0,208,124,0.4)]">
            <ShieldCheck className="h-9 w-9 text-[#4BC957]" />
          </div>
          <div className="space-y-3 max-w-md">
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Edit request sent</h1>
            <p className="text-sm text-muted-foreground leading-relaxed font-medium">
              Your proposed changes have been submitted for review. You&apos;ll be notified once the request is processed.
            </p>
          </div>
          <Link
            href="/company/jobs"
            className="bg-[#4BC957] hover:bg-[#00B96E] text-white font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-md shadow-[#4BC957]/10 active:scale-[0.98]"
          >
            Back to jobs
          </Link>
        </div>
      </motion.div>
    );
  }

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
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Request job edit</h1>
            <p className="text-sm text-muted-foreground mt-1">Modify the fields you want to change. Only changed fields will be sent.</p>
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

      {isLoadingDetail ? (
        <SkeletonForm fields={6} />
      ) : (
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
                />
              </div>

              {/* Skills */}
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

              {/* Location & Employment Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="font-bold text-muted-foreground uppercase tracking-wider">Location</label>
                  <Input
                    type="text"
                    value={form.location}
                    onChange={(e) => updateField("location", e.target.value)}
                    placeholder="Dubai, UAE."
                    className="bg-background border-border focus:border-[#4BC957]"
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

              {/* Currency & Salary Range */}
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
                    />
                    <span className="text-muted-foreground">—</span>
                    <Input
                      type="number"
                      value={form.salary_max || ""}
                      onChange={(e) => updateField("salary_max", Number(e.target.value))}
                      placeholder="Max"
                      className="bg-background border-border focus:border-[#4BC957]"
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
                />
              </div>

              {/* Custom Name */}
              <div className="space-y-2">
                <label className="font-bold text-muted-foreground uppercase tracking-wider">Custom name</label>
                <textarea
                  rows={3}
                  value={form.custome}
                  onChange={(e) => updateField("custome", e.target.value)}
                  placeholder="Enter custom name..."
                  className="w-full bg-background border border-border focus:border-[#4BC957] text-foreground placeholder:text-muted-foreground rounded-xl p-4 text-sm focus:outline-none transition-colors resize-none"
                />
              </div>

              {/* GCC Flags Switches Group */}
              <div className="border border-border rounded-xl p-5 space-y-4">
                <h3 className="font-bold text-muted-foreground uppercase tracking-wider mb-2">GCC flags</h3>

                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">Visa sponsorship offered</span>
                  <Switch checked={visaSp} onCheckedChange={setVisaSp} className="data-checked:bg-[#4BC957]!" />
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">Emiratization (UAE national priority)</span>
                  <Switch checked={emiratization} onCheckedChange={setEmiratization} className="data-checked:bg-[#4BC957]!" />
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">Saudization (Nitaqat-aligned)</span>
                  <Switch checked={saudization} onCheckedChange={setSaudization} className="data-checked:bg-[#4BC957]!" />
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">Open to remote</span>
                  <Switch checked={remote} onCheckedChange={setRemote} className="data-checked:bg-[#4BC957]!" />
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
                  disabled={isLoadingDetail || isRequesting}
                  className="bg-[#4BC957] hover:bg-[#00B96E] text-white font-bold px-6 py-5 flex justify-center items-center rounded-xl text-sm transition-all shadow-md shadow-[#4BC957]/10 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#4BC957]/50 focus-visible:ring-offset-2"
                >
                  {(isLoadingDetail || isRequesting) ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send edit request"
                  )}
                </Button>
              </div>

            </div>

            {/* Sidebar Info Columns (1/3 width) */}
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-sm">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                  <Sparkles className="h-4.5 w-4.5 text-[#4BC957]" />
                  What happens next
                </h3>
                <ol className="space-y-3.5 text-muted-foreground list-decimal pl-4 leading-relaxed font-medium">
                  <li>Your edit request is submitted for review</li>
                  <li>Only changed fields will be updated</li>
                  <li>You&apos;ll be notified once the request is processed</li>
                </ol>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6 space-y-5 shadow-sm">
                <h3 className="text-sm font-bold text-foreground">Cost</h3>
                <div className="space-y-3.5 font-semibold">
                  <div className="flex justify-between items-center text-muted-foreground">
                    <span>Request edit</span>
                    <span className="text-foreground">Free</span>
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

export default function EditJobPage() {
  return (
    <Suspense fallback={
      <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-full mx-auto">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-[#4BC957]" />
        </div>
      </div>
    }>
      <EditJobInner />
    </Suspense>
  );
}