"use client";

import React, { Suspense } from "react";
import { ArrowLeft, Download, MessageSquare, Sparkles, Mic, CheckCircle2, Loader2, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetCompanyInterviewDetailQuery,
} from "@/store/authApi";
import { get403Message } from "@/lib/utils";

function InterviewReportContent() {
  const searchParams = useSearchParams();
  const interviewId = searchParams.get("interview_id");

  const {
    data,
    isLoading,
    isError,
    error,
  } = useGetCompanyInterviewDetailQuery(interviewId ?? "", {
    skip: !interviewId,
  });

  const interview = data?.data;

  if (!interviewId) {
    return (
      <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-full mx-auto">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">No interview selected</h2>
          <p className="text-sm text-muted-foreground mb-4">Please select an interview to view its report.</p>
          <Link href="/company/candidates" className="text-sm font-semibold text-[#4BC957] hover:underline">
            Browse candidates
          </Link>
        </div>
      </div>
    );
  }

  if (isError) {
    const msg = get403Message(error);
    return (
      <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-full mx-auto">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-16 w-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">{msg ? "Access Denied" : "Failed to load interview"}</h2>
          <p className="text-sm text-muted-foreground mb-4 max-w-sm">
            {msg || "Something went wrong while fetching the interview report."}
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

  const questions = interview?.questions ?? [];

  const averageScore = questions.length > 0
    ? Math.round(questions.reduce((sum, q) => {
        const scoreMatch = q.answer_text.match(/(\d+)\/100/);
        return sum + (scoreMatch ? parseInt(scoreMatch[1], 10) : 0);
      }, 0) / questions.length)
    : 0;

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-full mx-auto">
      {/* Back */}
      <div>
        <Link
          href="/company/candidates/interview/sent"
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Interview report</h1>
          <p className="text-sm text-muted-foreground mt-1 font-medium">
            {interview?.candidate_name} • {interview?.job_title}
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button className="flex items-center gap-2 border border-border hover:bg-muted text-foreground font-bold px-4 py-2.5 rounded-xl text-sm transition-all active:scale-[0.98]">
            <Download className="h-4 w-4 text-muted-foreground" />
            Export PDF
          </button>
          <Link href={`/company/inbox?user_id=${interview?.candidate_profile}`} className="flex justify-center items-center gap-2 bg-[#4BC957] hover:bg-[#00B96E] text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-all shadow-md shadow-[#4BC957]/10 active:scale-[0.98]">
            <MessageSquare className="h-4 w-4" />
            Message Candidate
          </Link>
        </div>
      </div>

      {/* AI Overall Score Card */}
      {isLoading ? (
        <div className="bg-card border border-border rounded-2xl p-8 space-y-6 shadow-sm">
          <Skeleton className="h-4 w-32 rounded" />
          <Skeleton className="h-20 w-48 rounded" />
          <Skeleton className="h-4 w-64 rounded" />
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl p-8 space-y-6 shadow-sm">
          <div className="flex items-center gap-2 text-xs text-[#4BC957] font-bold uppercase tracking-wider">
            <Sparkles className="h-4 w-4" />
            AI overall score
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-7xl font-extrabold text-foreground tracking-tight">{averageScore}</span>
            <span className="text-2xl text-muted-foreground font-semibold">/ 100</span>
          </div>

          <p className="text-sm text-muted-foreground font-medium">
            Strong hire signal. Top 8% of candidates interviewed for this role.
          </p>

          <div>
            <span className="inline-flex items-center gap-1.5 border border-[#4BC957]/30 text-[#4BC957] text-sm font-bold px-3 py-1.5 rounded-full bg-[#4BC957]/10">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Recommended: Move to onsite
            </span>
          </div>
        </div>
      )}

      {/* Transcript & Per-question Scoring */}
      <div className="bg-card border border-border rounded-2xl p-6 space-y-5 shadow-sm">
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-bold uppercase tracking-wider">
          <Mic className="h-4 w-4 text-muted-foreground shrink-0" />
          Transcript &amp; per-question scoring
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-background border border-border rounded-xl p-5 space-y-3">
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-3 w-3/4 rounded" />
                <Skeleton className="h-2 w-full rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {questions.map((item, idx) => {
              const scoreMatch = item.answer_text.match(/(\d+)\/100/);
              const score = scoreMatch ? parseInt(scoreMatch[1], 10) : 0;
              return (
                <div
                  key={item.id}
                  className="bg-background border border-border rounded-xl p-5 space-y-2 transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-sm font-bold text-foreground leading-snug">{item.question_text}</p>
                    <span className="text-sm font-bold text-[#4BC957] bg-[#4BC957]/10 border border-[#4BC957]/20 px-2.5 py-1 rounded-lg flex-shrink-0">
                      {score}/100
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Mic className="h-3.5 w-3.5 text-[#4BC957] mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-[#4BC957] font-medium leading-relaxed">{item.answer_text}</p>
                  </div>

                  {/* Per-question progress bar */}
                  <div className="w-full bg-muted h-1 rounded-full overflow-hidden mt-2">
                    <div
                      className="bg-[#4BC957] h-full rounded-full transition-all duration-500"
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Loading overlay for initial load */}
      {isLoading && (
        <div className="fixed inset-0 bg-background/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="flex items-center gap-3 bg-card border border-border rounded-2xl px-6 py-4 shadow-xl">
            <Loader2 className="h-5 w-5 animate-spin text-[#4BC957]" />
            <span className="text-sm font-bold text-foreground">Loading interview report...</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function InterviewReportPage() {
  return (
    <Suspense fallback={
      <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-full mx-auto">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-[#4BC957]" />
        </div>
      </div>
    }>
      <InterviewReportContent />
    </Suspense>
  );
}
