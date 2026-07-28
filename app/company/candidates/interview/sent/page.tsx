"use client";

import React, { Suspense } from "react";
import { ArrowLeft, Send } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function InterviewSentContent() {
  const searchParams = useSearchParams();
  const interviewId = searchParams.get("interview_id");

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="mb-10">
        <Link
          href="/company/candidates"
          className="inline-flex items-center gap-2 font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to candidates
        </Link>
      </div>

      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        {/* Icon */}
        <div className="h-20 w-20 rounded-full bg-[#4BC957]/15 border border-[#4BC957]/30 flex items-center justify-center shadow-[0_0_40px_-8px_rgba(0,208,124,0.4)]">
          <Send className="h-9 w-9 text-[#4BC957]" />
        </div>

        {/* Title */}
        <div className="space-y-3 max-w-md">
          <h1 className="text-4xl font-extrabold text-foreground tracking-tight">Interview sent</h1>
          <p className="text-sm text-muted-foreground leading-relaxed font-medium">
            The candidate will get a WhatsApp + email invite. You&apos;ll be notified when the AI scoring report is ready (usually within minutes of completion).
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <Link
            href="/company/candidates"
            className="border border-border hover:bg-muted text-foreground font-bold px-6 py-3 rounded-xl text-sm transition-all active:scale-[0.98]"
          >
            Back to candidates
          </Link>
          {interviewId ? (
            <Link
              href={`/company/candidates/interview/report?interview_id=${interviewId}`}
              className="bg-[#4BC957] hover:bg-[#00B96E] text-white font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-md shadow-[#4BC957]/10 active:scale-[0.98]"
            >
              Preview report
            </Link>
          ) : (
            <Link
              href="/company/interviews"
              className="bg-[#4BC957] hover:bg-[#00B96E] text-white font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-md shadow-[#4BC957]/10 active:scale-[0.98]"
            >
              View interviews
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default function InterviewSentPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-20"><div className="h-6 w-6 animate-spin rounded-full border-2 border-muted border-t-foreground" /></div>}>
      <InterviewSentContent />
    </Suspense>
  );
}
