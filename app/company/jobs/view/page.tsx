"use client";

import React, { Suspense } from "react";
import { ArrowLeft, MapPin, Users, Sparkles, Briefcase, Clock, DollarSign, ShieldCheck, Loader2, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetCompanyJobDetailQuery,
  type CompanyJob,
} from "@/store/authApi";

function JobViewContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const {
    data,
    isLoading,
    isError,
    error,
  } = useGetCompanyJobDetailQuery(id ?? "", {
    skip: !id,
  });

  const job: CompanyJob | undefined = data?.data;

  if (!id) {
    return (
      <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-full mx-auto">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">No job selected</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Please select a job from the list to view its details.
          </p>
          <Link href="/company/jobs" className="text-sm font-semibold text-[#4BC957] hover:underline">
            Browse jobs
          </Link>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-full mx-auto">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">Failed to load job</h2>
          <p className="text-sm text-muted-foreground mb-4">
            {error && "status" in error
              ? `Error ${error.status}: ${JSON.stringify(error.data)}`
              : "Something went wrong while fetching the job details."}
          </p>
          <button onClick={() => window.location.reload()} className="text-sm font-semibold text-[#4BC957] hover:underline">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const formatSalary = () => {
    if (!job) return "N/A";
    const min = job.salary_min.toLocaleString();
    const max = job.salary_max.toLocaleString();
    return `${min} — ${max} ${job.currency} / ${job.salary_period.toLowerCase()}`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-full mx-auto">
      {/* Back */}
      <div>
        <Link
          href="/company/jobs"
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight">{job?.title}</h1>
            <span className="bg-[#4BC957]/10 text-[#4BC957] border border-[#4BC957]/20 px-3 py-0.5 rounded-full text-sm font-semibold">
              {job?.job_status}
            </span>
          </div>
          {job && (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 shrink-0" />
                {job.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Briefcase className="h-4 w-4 shrink-0" />
                {job.employment_type.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase())}
              </span>
              <span className="flex items-center gap-1.5">
                <DollarSign className="h-4 w-4 shrink-0" />
                {formatSalary()}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 shrink-0" />
                Posted {formatDate(job.published_at)}
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/company/jobs/edit?id=${job?.id}`}
            className="border border-border hover:bg-muted text-foreground font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors"
          >
            Edit job
          </Link>
          <Link
            href="/company/jobs/applicants"
            className="bg-[#4BC957] hover:bg-[#00B96E] text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-all shadow-md shadow-[#4BC957]/10 active:scale-[0.98] inline-flex items-center gap-1.5"
          >
            <Users className="h-4 w-4" />
            View applicants
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      {job && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
          <div className="bg-card border border-border rounded-2xl p-5 space-y-1 shadow-sm">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Applicants</p>
            <p className="text-3xl font-extrabold text-foreground">{job.applications_count}</p>
            <p className="text-sm text-muted-foreground">Total candidates applied</p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-5 space-y-1 shadow-sm">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">AI Match Score</p>
            <p className="text-3xl font-extrabold text-[#4BC957]">{job.ai_matches_count}</p>
            <p className="text-sm text-muted-foreground">Average match across applicants</p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-5 space-y-1 shadow-sm">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</p>
            <p className="text-3xl font-extrabold text-foreground flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#4BC957] inline-block" />
              {job.job_status}
            </p>
            <p className="text-sm text-muted-foreground">Listing is active and visible</p>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
              <Skeleton className="h-5 w-32 rounded" />
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-3/4 rounded" />
            </div>
            <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
              <Skeleton className="h-5 w-32 rounded" />
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-2/3 rounded" />
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
              <Skeleton className="h-5 w-20 rounded" />
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-6 w-16 rounded-lg" />
                <Skeleton className="h-6 w-20 rounded-lg" />
                <Skeleton className="h-6 w-14 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      )}

      {!isLoading && job && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-sm">
              <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">Job Description</h2>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{job.description}</p>
            </div>

            {/* Requirements */}
            <div className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-sm">
              <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">Requirements</h2>
              <ul className="space-y-2">
                {job.requirements_list.map((req, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#4BC957] mt-2 flex-shrink-0" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Skills */}
            <div className="bg-card border border-border rounded-2xl p-6 space-y-3 shadow-sm">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-[#4BC957]" />
                Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, i) => (
                  <span key={i} className="bg-muted text-foreground text-sm font-semibold px-2.5 py-1 rounded-lg border border-border">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Verification */}
            <div className="bg-card border border-border rounded-2xl p-6 space-y-3 shadow-sm">
              <h3 className="text-sm font-bold text-foreground">Verification</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-[#4BC957]" />
                Trade-licence verified
              </div>
            </div>

            {/* Cost */}
            <div className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-sm">
              <h3 className="text-sm font-bold text-foreground">Cost</h3>
              <div className="space-y-2 text-sm font-semibold">
                
                <div className="flex justify-between text-muted-foreground">
                  <span>Top 10 shortlist</span>
                  <span className="text-foreground">Free</span>
                </div>
              </div>
              <div className="border-t border-border pt-4 text-sm font-bold text-[#4BC957]">
                Balance: 1,240 credits
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading overlay for initial load */}
      {isLoading && (
        <div className="fixed inset-0 bg-background/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="flex items-center gap-3 bg-card border border-border rounded-2xl px-6 py-4 shadow-xl">
            <Loader2 className="h-5 w-5 animate-spin text-[#4BC957]" />
            <span className="text-sm font-bold text-foreground">Loading job details...</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function JobViewPage() {
  return (
    <Suspense fallback={
      <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-full mx-auto">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-[#4BC957]" />
        </div>
      </div>
    }>
      <JobViewContent />
    </Suspense>
  );
}
