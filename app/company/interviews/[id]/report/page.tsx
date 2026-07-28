"use client";

import React, { useCallback } from "react";
import {
  Loader2,
  ArrowLeft,
  Download,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Star,
  Mic,
  FileText,
  TrendingUp,
  TrendingDown,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useGetCompanyInterviewReportQuery, useLazyDownloadCompanyInterviewReportPdfQuery } from "@/store/authApi";

function ScoreBar({ score, max = 100 }: { score: number; max?: number }) {
  const pct = Math.round((score / max) * 100);
  let color = "bg-[#4BC957]";
  if (pct <= 30) color = "bg-red-500";
  else if (pct <= 60) color = "bg-amber-500";
  return (
    <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
      <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function CompanyInterviewReportPage() {
  const params = useParams();
  const id = params.id as string;
  const { data, isLoading, isError } = useGetCompanyInterviewReportQuery(id);
  const [triggerPdf, { isLoading: isDownloading }] = useLazyDownloadCompanyInterviewReportPdfQuery();
  const report = data?.data;

  const handleDownloadPdf = useCallback(async () => {
    try {
      const result = await triggerPdf(id).unwrap();
      const url = URL.createObjectURL(result);
      const a = document.createElement("a");
      a.href = url;
      a.download = `interview-report-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // silent
    }
  }, [id, triggerPdf]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !report) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-muted-foreground">Report not found or still generating.</p>
      </div>
    );
  }

  const { overall, progress, timeline, strengths, concerns, questions } = report;

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-full">
      {/* Back */}
      <Link
        href={`/company/interviews/${id}`}
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm font-semibold transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to interview
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Interview Report</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {report.candidate.name} — {report.job.title}
          </p>
        </div>
        <button
          onClick={handleDownloadPdf}
          disabled={isDownloading}
          className="inline-flex items-center gap-1.5 bg-[#4BC957] hover:bg-[#00B96E] disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed text-white font-bold px-4 py-2 rounded-xl transition-all shadow-md shadow-[#4BC957]/10 active:scale-[0.98] text-sm"
        >
          {isDownloading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
          {isDownloading ? "Downloading..." : "Download PDF"}
        </button>
      </div>

      {/* Overall Score Card */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Score */}
          <div className="text-center md:text-left space-y-3">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <BarChart3 className="h-5 w-5 text-[#4BC957]" />
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Overall Score</span>
            </div>
            <div className="flex items-baseline gap-2 justify-center md:justify-start">
              <span className="text-5xl font-extrabold text-foreground">{overall.score}</span>
              <span className="text-lg text-muted-foreground font-semibold">/ {overall.score_out_of}</span>
            </div>
            <ScoreBar score={overall.score} max={overall.score_out_of} />
            <p className="text-sm font-bold text-foreground">{overall.headline}</p>
            <span className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full border ${
              overall.band === "STRONG" ? "text-[#4BC957] bg-[#4BC957]/10 border-[#4BC957]/20" :
              overall.band === "MODERATE" ? "text-amber-500 bg-amber-500/10 border-amber-500/20" :
              "text-red-500 bg-red-500/10 border-red-500/20"
            }`}>
              {overall.band === "STRONG" && <Star className="h-3 w-3" />}
              {overall.band === "WEAK" && <AlertTriangle className="h-3 w-3" />}
              {overall.band}
            </span>
          </div>

          {/* Progress */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Progress</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Questions</span>
                <span className="font-semibold text-foreground">{progress.answered_count} / {progress.total_questions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Scored</span>
                <span className="font-semibold text-foreground">{progress.scored_count}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Voice answers</span>
                <span className="font-semibold text-foreground">{progress.voice_answers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total speaking</span>
                <span className="font-semibold text-foreground">{Math.round(progress.total_speaking_seconds / 60)} min</span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Timeline</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Started</span>
                <span className="font-semibold text-foreground">{new Date(timeline.started_at).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Submitted</span>
                <span className="font-semibold text-foreground">{new Date(timeline.submitted_at).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Evaluated</span>
                <span className="font-semibold text-foreground">{new Date(timeline.evaluated_at).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Strengths & Concerns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strengths */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-[#4BC957]" />
            <h3 className="text-sm font-bold text-foreground">Strengths</h3>
          </div>
          {strengths.length === 0 ? (
            <p className="text-xs text-muted-foreground">No strengths identified.</p>
          ) : (
            <div className="space-y-2">
              {strengths.map((s, i) => (
                <div key={i} className="bg-[#4BC957]/5 border border-[#4BC957]/10 rounded-lg p-3">
                  <p className="text-xs font-semibold text-foreground">{s.question}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-bold text-[#4BC957]">{s.score_100}/100</span>
                    {s.feedback && <span className="text-[11px] text-muted-foreground">{s.feedback}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Concerns */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-red-500" />
            <h3 className="text-sm font-bold text-foreground">Concerns</h3>
          </div>
          {concerns.length === 0 ? (
            <p className="text-xs text-muted-foreground">No concerns identified.</p>
          ) : (
            <div className="space-y-2">
              {concerns.map((c, i) => (
                <div key={i} className="bg-red-500/5 border border-red-500/10 rounded-lg p-3">
                  <p className="text-xs font-semibold text-foreground">{c.question}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-bold text-red-500">{c.score_100}/100</span>
                    {c.feedback && <span className="text-[11px] text-muted-foreground">{c.feedback}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Detailed Questions */}
      {questions.length > 0 && (
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-5">
          <h2 className="text-base font-bold text-foreground">Detailed Answers</h2>
          <div className="space-y-4">
            {questions.map((q) => (
              <div key={q.id} className="border border-border rounded-xl p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                      Question {q.order + 1}
                    </p>
                    <p className="text-sm font-semibold text-foreground leading-relaxed">{q.question_text}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                      q.input_type === "VOICE"
                        ? "text-blue-500 bg-blue-500/10 border-blue-500/20"
                        : "text-muted-foreground bg-muted border-border"
                    }`}>
                      {q.input_type === "VOICE" ? <Mic className="h-2.5 w-2.5" /> : <FileText className="h-2.5 w-2.5" />}
                      {q.input_type}
                    </span>
                    <span className="text-lg font-extrabold text-foreground">{q.score_100}</span>
                    <span className="text-[10px] text-muted-foreground">/100</span>
                  </div>
                </div>

                <ScoreBar score={q.score_100} />

                {/* Expected vs Given */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-muted rounded-lg p-3">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Expected</p>
                    <p className="text-xs text-foreground leading-relaxed">{q.expected_answer}</p>
                  </div>
                  <div className="bg-[#4BC957]/5 border border-[#4BC957]/10 rounded-lg p-3">
                    <p className="text-[10px] font-bold text-[#4BC957] uppercase tracking-wider mb-1">Candidate Response</p>
                    <p className="text-xs text-foreground leading-relaxed">{q.response}</p>
                  </div>
                </div>

                {/* Audio player */}
                {q.audio_url && (
                  <div className="bg-muted rounded-lg p-3">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Voice Answer</p>
                    <audio controls className="w-full h-8" src={q.audio_url}>
                      Your browser does not support the audio element.
                    </audio>
                    {q.duration_seconds && (
                      <p className="text-[10px] text-muted-foreground mt-1">
                        Duration: {Math.round(q.duration_seconds / 60)}m {q.duration_seconds % 60}s
                      </p>
                    )}
                  </div>
                )}

                {q.feedback && (
                  <div className="bg-muted rounded-lg p-3">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Feedback</p>
                    <p className="text-xs text-foreground leading-relaxed">{q.feedback}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
