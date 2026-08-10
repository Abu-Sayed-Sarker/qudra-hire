"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, type Variants } from "framer-motion";
import {
  Upload,
  FileText,
  Sparkles,
  Download,
  Loader2,
  AlertTriangle,
  Check,
  Bot,
} from "lucide-react";
import { AnalysisPopup } from "@/components/cv/analysis-popup";
import { toast } from "sonner";
import {
  useGetCandidateCvQuery,
  useUploadCandidateCvMutation,
  useDownloadCandidateCvMutation,
  useAutoSuggestCandidateCvMutation,
  useGetAutoSuggestStatusQuery,
} from "@/store/authApi";
import { get403Message } from "@/lib/utils";
import SubscriptionRequiredCard from "@/components/ui/subscription-required-card";

function formatDate(iso: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function CandidateCVPage() {
  const { data: cvData, isLoading, isError, error, refetch: refetchCv } =
    useGetCandidateCvQuery();
  const [uploadCv, { isLoading: isUploading }] = useUploadCandidateCvMutation();
  const [downloadCv, { isLoading: isDownloading }] = useDownloadCandidateCvMutation();
  const [autoSuggest, { isLoading: isSuggesting }] = useAutoSuggestCandidateCvMutation();

  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mounted, setMounted] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<{
    ats_score: number;
    parsed_skills: string[];
    suggestions: string[];
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const autoSuggestTriggeredRef = useRef(false);

  const {
    data: statusData,
    isFetching: isPolling,
  } = useGetAutoSuggestStatusQuery(taskId!, {
    skip: !taskId,
    pollingInterval: 2000,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!taskId || !statusData?.data) return;
    const status = statusData.data.status as string;
    if (status === "SUCCESS" && statusData.data.result) {
      setAnalysis(statusData.data.result);
      setTaskId(null);
      refetchCv();
      toast.success("AI analysis complete");
    } else if (status === "FAILURE") {
      toast.error(statusData.data.error || "Auto-suggest failed");
      setTaskId(null);
    }
  }, [statusData?.data?.status, taskId, refetchCv]);

  const triggerAutoSuggest = useCallback(async () => {
    if (!cvData?.data) return;
    try {
      const result = await autoSuggest(undefined).unwrap();
      if (result.data?.task_id) {
        setTaskId(result.data.task_id);
        setAnalysis(null);
      }
      toast.success(result.details || "Auto-suggest started");
    } catch {
      toast.error("Failed to start auto-suggest");
    }
  }, [autoSuggest, cvData]);

  useEffect(() => {
    if (autoSuggestTriggeredRef.current) return;
    if (!mounted || !cvData?.data || taskId || analysis) return;

    autoSuggestTriggeredRef.current = true;
    // triggerAutoSuggest();
  }, [mounted, cvData, taskId, analysis, triggerAutoSuggest]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && (file.type === "application/pdf" || file.type.includes("word"))) {
      setSelectedFile(file);
    } else {
      toast.error("Please drop a PDF or DOCX file.");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("cv", selectedFile);
    try {
      const result = await uploadCv(formData).unwrap();
      toast.success(result.details || "CV uploaded successfully");
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setShowAnalysis(true);

      setAnalysis(null);
      setTaskId(null);
      // await refetchCv();

      // Trigger AI auto-suggest for the new CV automatically
      try {
        const suggestResult = await autoSuggest(undefined).unwrap();
        if (suggestResult.data?.task_id) {
          setTaskId(suggestResult.data.task_id);

        }
      } catch (err) {
        console.error("Auto suggest trigger error:", err);
      }
    } catch {
      toast.error("Failed to upload CV");
    }
  };

  const handleAutoSuggestClick = async () => {
    setShowAnalysis(true);
    await triggerAutoSuggest();
  };

  const handleDownload = async () => {
    try {
      await downloadCv({ filename: cvData?.data?.cv_name || "cv.pdf" }).unwrap();
      toast.success("Download started");
    } catch {
      toast.error("Failed to download CV");
    }
  };

  if (!mounted || isLoading) {
    return (
      <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-full mx-auto text-slate-900 dark:text-white">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
          <div className="h-4 w-80 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
        </div>
        <div className="h-40 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
        <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (isError) {
    const msg = get403Message(error);
    if (msg) {
      return <SubscriptionRequiredCard message={msg} />;
    }
    return (
      <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-full mx-auto text-slate-900 dark:text-white">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-16 w-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Failed to load CV</h2>
          <p className="text-sm text-muted-foreground mb-4 max-w-sm">
            Something went wrong while fetching your CV data.
          </p>
          <button onClick={() => refetchCv()} className="text-sm font-semibold text-[#4BC957] hover:underline">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const hasCv = !!cvData?.data;
  const isAnalyzing = (!!taskId && !analysis) || isUploading;
  const atsScore = analysis?.ats_score ?? cvData?.data?.ats_score ?? 0;
  const parsedSkills = (analysis?.parsed_skills && analysis.parsed_skills.length > 0)
    ? analysis.parsed_skills
    : (cvData?.data?.parsed_skills ?? []);
  const suggestions = analysis?.suggestions ?? [];

  const suggestIcon = isAnalyzing || isSuggesting ? (
    <Loader2 className="h-3.5 w-3.5 animate-spin" />
  ) : (
    <Sparkles className="h-3.5 w-3.5" />
  );

  const downloadIcon = isDownloading ? (
    <Loader2 className="h-3.5 w-3.5 animate-spin" />
  ) : (
    <Download className="h-3.5 w-3.5" />
  );

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-full mx-auto text-slate-900 dark:text-white">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">CV & ATS optimization</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Upload once. Tailor for every role with AI.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="lg:col-span-2 group relative overflow-hidden bg-card/60 backdrop-blur-2xl border border-emerald-500/20 rounded-xl p-6 md:p-8 flex flex-col justify-between space-y-6 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/10 hover:border-emerald-500/30"
        >
          {/* Premium Background Gradient Reveal */}
          <div className="absolute inset-0 bg-linear-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-xl" />
          <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-white/5 to-transparent pointer-events-none z-0 skew-x-12" />

          <div className="space-y-6 relative z-10">
            {/* File info header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-600 dark:text-[#4BC957] shadow-lg shadow-emerald-500/10 relative group-hover:border-emerald-500/40 transition-colors"
                >
                  <FileText className="h-6 w-6 relative z-10" />
                  <div className="absolute inset-0 bg-emerald-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
                </motion.div>
                <div>
                  <h3 className="text-base font-bold text-foreground group-hover:text-emerald-500 transition-colors">{cvData?.data?.cv_name || "No CV uploaded"}</h3>
                  <p className="text-[13px] text-muted-foreground mt-0.5 font-medium">
                    {hasCv ? `Updated ${formatDate(cvData!.data!.updated_at)}` : "Upload a CV to get started"}
                  </p>
                </div>
              </div>
              {hasCv && (
                <span className={`text-[11px] font-bold px-3 py-1.5 rounded-full border shadow-sm self-start md:self-auto ${isAnalyzing ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" : "bg-emerald-500/10 text-emerald-600 dark:text-[#4BC957] border-emerald-500/20"}`}>
                  {isAnalyzing ? "ANALYZING" : "COMPLETED"}
                </span>
              )}
            </div>

            {/* ATS Score */}
            {(atsScore > 0 || isAnalyzing) && (
              <div className="space-y-2.5">
                <div className="flex justify-between items-baseline font-bold">
                  <span className="text-sm text-muted-foreground uppercase tracking-wider">ATS readiness</span>
                  <span className="text-xl text-emerald-600 dark:text-[#4BC957]">{atsScore}%</span>
                </div>
                <div className="w-full bg-muted/50 h-3 rounded-full overflow-hidden border border-border/50">
                  <div className="bg-linear-to-r from-emerald-500 to-emerald-400 h-full rounded-full transition-all duration-700 shadow-lg shadow-emerald-500/20" style={{ width: `${atsScore}%` }} />
                </div>
              </div>
            )}

            {/* Upload Dropzone */}
            <div
              className={`relative overflow-hidden border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center text-center space-y-5 transition-all duration-300 cursor-pointer ${dragOver ? "border-emerald-500 dark:border-[#4BC957] bg-emerald-500/10 shadow-lg shadow-emerald-500/20 scale-[1.02]" : "border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10"}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              {dragOver && <div className="absolute inset-0 bg-emerald-500/10 animate-pulse pointer-events-none" />}

              {selectedFile ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="p-3 bg-emerald-500/20 rounded-full text-emerald-500">
                    <Check className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-bold text-foreground">Ready to upload</p>
                  <p className="text-xs text-muted-foreground font-medium truncate max-w-xs">
                    {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                  </p>
                </div>
              ) : (
                <>
                  <div className={`h-14 w-14 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-[#4BC957] transition-transform duration-300 ${dragOver ? "scale-110" : ""}`}>
                    <Upload className="h-7 w-7" />
                  </div>
                  <div className="space-y-1.5 z-10 relative">
                    <h3 className="text-lg font-bold text-foreground">Drop your CV here</h3>
                    <p className="text-sm text-muted-foreground font-medium max-w-sm mx-auto">PDF or DOCX, max 10MB. We will parse skills, projects and experience.</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </>

              )}
            </div>

            {/* Upload Button (outside dropzone) — now opens analysis popup */}
            <button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="w-full bg-green-600 hover:bg-green-500 dark:bg-[#4BC957] dark:hover:bg-[#00B96E] text-white dark:text-white font-bold px-5 py-3 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="flex items-center justify-center gap-2">
                {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                {isUploading ? "Uploading..." : "Review My CV"}
              </span>
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 pt-4 border-t border-slate-200 dark:border-[#1E293B]/40">
            <button
              onClick={handleAutoSuggestClick}
              disabled={!hasCv || isSuggesting || isAnalyzing}
              className="flex items-center gap-1.5 bg-green-600 hover:bg-green-500 dark:bg-[#4BC957] dark:hover:bg-[#00B96E] text-white dark:text-white px-4 py-2.5 rounded-xl font-bold transition-all shadow-md shadow-green-500/10 dark:shadow-[#4BC957]/10 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {suggestIcon}
              Auto suggest
            </button>
            <button
              onClick={handleDownload}
              disabled={!hasCv || isDownloading}
              className="flex items-center gap-1.5 border border-slate-300 dark:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 px-4 py-2.5 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {downloadIcon}
              Download
            </button>
          </div>
        </motion.div>

        {/* Right Column - Parsed Skills & Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="group relative overflow-hidden bg-card/60 backdrop-blur-2xl border border-blue-500/20 rounded-xl p-6 md:p-8 space-y-6 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-500/30"
        >
          <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-xl" />
          <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-white/5 to-transparent pointer-events-none z-0 skew-x-12" />

          <div className="relative z-10">
            {!hasCv ? (
              <div className="flex flex-col items-center justify-center text-center h-full space-y-3 py-10">
                <div className="p-3 bg-blue-500/10 rounded-full text-blue-500">
                  <Sparkles className="h-6 w-6" />
                </div>
                <p className="text-sm text-muted-foreground font-medium">Upload a CV to see parsed skills and AI suggestions.</p>
              </div>
            ) : isAnalyzing ? (
              <div className="space-y-4 py-8 flex flex-col items-center text-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
                  <Loader2 className="h-10 w-10 animate-spin text-blue-500 relative z-10" />
                </div>
                <div>
                  <p className="text-base font-bold text-foreground">Analyzing your CV...</p>
                  <p className="text-sm text-muted-foreground mt-1">This may take a few seconds.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="h-5 w-5 text-blue-500" />
                    <h3 className="font-bold text-foreground uppercase tracking-wider text-sm">Parsed skills</h3>
                  </div>

                  {parsedSkills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {parsedSkills.map((skill: string) => (
                        <span
                          key={skill}
                          className="bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-xl text-[13px] font-bold shadow-sm transition-transform hover:scale-105 cursor-default"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground font-medium">No skills parsed yet.</p>
                  )}
                </div>

                {suggestions.length > 0 && (
                  <div className="space-y-4 pt-4 border-t border-border/50">
                    <div className="flex items-center gap-2">
                      <Bot className="h-5 w-5 text-emerald-500" />
                      <h4 className="font-bold text-foreground text-sm uppercase tracking-wider">AI Suggestions</h4>
                    </div>
                    <ul className="space-y-3">
                      {suggestions.map((suggestion: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3 bg-muted/30 p-4 rounded-2xl border border-border/50 hover:bg-muted/50 transition-colors">
                          <Check className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5 drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]" />
                          <span className="text-sm text-foreground/80 font-medium leading-relaxed">{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <AnalysisPopup
        open={showAnalysis}
        onOpenChange={setShowAnalysis}
        isAnalyzing={isAnalyzing}
        isDone={!isAnalyzing && !!analysis}
      />
    </div>
  );
}
