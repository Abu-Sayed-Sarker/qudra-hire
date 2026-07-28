"use client";

import React from "react";
import {
  Loader2,
  ArrowLeft,
  Bot,
  Clock,
  CheckCircle2,
  FileText,
  User,
  Briefcase,
  Mic,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useGetCompanyInterviewDetailQuery } from "@/store/authApi";

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  COMPLETED: { label: "Completed", color: "text-[#4BC957]", bg: "bg-[#4BC957]/10 border-[#4BC957]/20" },
  IN_PROGRESS: { label: "In Progress", color: "text-blue-500", bg: "bg-blue-500/10 border-blue-500/20" },
  INVITED: { label: "Invited", color: "text-amber-500", bg: "bg-amber-500/10 border-amber-500/20" },
  DRAFT: { label: "Draft", color: "text-muted-foreground", bg: "bg-muted border-border" },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.DRAFT;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${cfg.color} ${cfg.bg}`}>
      {status === "COMPLETED" && <CheckCircle2 className="h-3.5 w-3.5" />}
      {cfg.label}
    </span>
  );
}

export default function CompanyInterviewDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data, isLoading, isError } = useGetCompanyInterviewDetailQuery(id);
  const interview = data?.data;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !interview) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-muted-foreground">Interview not found.</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-full">
      {/* Back */}
      <Link
        href="/company/interviews"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm font-semibold transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to interviews
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
            {interview.candidate_name}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{interview.job_title}</p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={interview.status} />
          {interview.status === "COMPLETED" && (
            <Link
              href={`/company/interviews/${id}/report`}
              className="inline-flex items-center gap-1.5 bg-[#4BC957] hover:bg-[#00B96E] text-white font-bold px-4 py-2 rounded-xl transition-all shadow-md shadow-[#4BC957]/10 active:scale-[0.98] text-sm"
            >
              <FileText className="h-3.5 w-3.5" />
              View Report
            </Link>
          )}
        </div>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-card border border-border rounded-xl p-4 space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            <User className="h-3 w-3" />
            Candidate
          </div>
          <p className="text-sm font-semibold text-foreground">{interview.candidate_name}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            <Briefcase className="h-3 w-3" />
            Job
          </div>
          <p className="text-sm font-semibold text-foreground">{interview.job_title}</p>
          <p className="text-xs text-muted-foreground">{interview.role_context}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            <Clock className="h-3 w-3" />
            Duration
          </div>
          <p className="text-sm font-semibold text-foreground">{interview.duration_minutes} min</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            <Bot className="h-3 w-3" />
            Questions
          </div>
          <p className="text-sm font-semibold text-foreground">{interview.questions.length}</p>
        </div>
      </div>

      {/* Questions & Answers */}
      {interview.questions.length > 0 && (
        <div className="bg-card border border-border rounded-2xl p-6 space-y-5 shadow-sm">
          <h2 className="text-base font-bold text-foreground">Questions & Answers</h2>
          <div className="space-y-4">
            {interview.questions.map((q, idx) => (
              <div key={q.id} className="border border-border rounded-xl p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <span className="h-6 w-6 rounded-full bg-muted border border-border flex items-center justify-center text-[10px] font-bold text-muted-foreground flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground leading-relaxed">{q.question_text}</p>
                  </div>
                </div>
                {q.answer_text && (
                  <div className="ml-9 bg-[#4BC957]/5 border border-[#4BC957]/10 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <MessageSquare className="h-3 w-3 text-[#4BC957]" />
                      <span className="text-[10px] font-bold text-[#4BC957] uppercase tracking-wider">Answer</span>
                    </div>
                    <p className="text-xs text-foreground leading-relaxed">{q.answer_text}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {interview.questions.length === 0 && (
        <div className="bg-card border border-border rounded-2xl p-10 text-center">
          <Bot className="h-8 w-8 mx-auto mb-3 text-muted-foreground/40" />
          <p className="text-sm font-semibold text-foreground">No questions yet</p>
          <p className="text-xs text-muted-foreground mt-1">
            {interview.status === "DRAFT"
              ? "Questions will be generated when you send the interview."
              : "This interview has no questions."}
          </p>
        </div>
      )}
    </div>
  );
}
