"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Upload,
  FileText,
  Sparkles,
  Download,
  Loader2,
  AlertTriangle,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import {
  useGetCandidateCvQuery,
  useUploadCandidateCvMutation,
  useDownloadCandidateCvMutation,
  useAutoSuggestCandidateCvMutation,
  useGetAutoSuggestStatusQuery,
} from "@/store/authApi";

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
  const { data: cvData, isLoading, isError, refetch: refetchCv } =
    useGetCandidateCvQuery();
  const [uploadCv, { isLoading: isUploading }] = useUploadCandidateCvMutation();
  const [downloadCv, { isLoading: isDownloading }] = useDownloadCandidateCvMutation();
  const [autoSuggest, { isLoading: isSuggesting }] = useAutoSuggestCandidateCvMutation();

  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mounted, setMounted] = useState(false);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<{
    ats_score: number;
    parsed_skills: string[];
    suggestions: string[];
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

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
      toast.success("AI analysis complete");
    } else if (status === "FAILURE") {
      toast.error(statusData.data.error || "Auto-suggest failed");
      setTaskId(null);
    }
  }, [statusData?.data?.status, taskId]);

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
    if (mounted && cvData?.data && !taskId && !analysis) {
      triggerAutoSuggest();
    }
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
      setAnalysis(null);
      setTaskId(null);
      await refetchCv();
    } catch {
      toast.error("Failed to upload CV");
    }
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
    return (
      <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-full mx-auto text-slate-900 dark:text-white">
        <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          Failed to load CV data.
        </div>
      </div>
    );
  }

  const hasCv = !!cvData?.data;
  const isAnalyzing = !!taskId && !analysis;
  const atsScore = analysis?.ats_score ?? 0;
  const parsedSkills = analysis?.parsed_skills ?? [];
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
        <div className="lg:col-span-2 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-[#1E293B]/60 rounded-2xl p-6 flex flex-col justify-between space-y-6 shadow-sm dark:shadow-none">
          <div className="space-y-6">
            {/* File info header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-green-50 dark:bg-[#4BC957]/10 border border-green-200 dark:border-[#4BC957]/20 rounded-xl text-green-600 dark:text-[#4BC957]">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{cvData?.data?.cv_name || "No CV uploaded"}</h3>
                  <p className="text-[13px] text-slate-500 mt-0.5">
                    {hasCv ? `Updated ${formatDate(cvData!.data!.updated_at)}` : "Upload a CV to get started"}
                  </p>
                </div>
              </div>
              {hasCv && (
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${isAnalyzing ? "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20" : "bg-green-50 dark:bg-[#23C65F]/10 text-green-600 dark:text-[#23C65F] border-green-200 dark:border-[#23C65F]/20"}`}>
                  {isAnalyzing ? "ANALYZING" : "COMPLETED"}
                </span>
              )}
            </div>

            {/* ATS Score */}
            {(atsScore > 0 || isAnalyzing) && (
              <div className="space-y-2">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-600 dark:text-slate-400">ATS readiness</span>
                  <span className="text-green-600 dark:text-[#4BC957]">{atsScore}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-green-500 dark:bg-[#4BC957] h-full rounded-full transition-all duration-500" style={{ width: `${atsScore}%` }} />
                </div>
              </div>
            )}

            {/* Upload Dropzone */}
            <div
              className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center space-y-4 transition-all cursor-pointer ${dragOver ? "border-green-500 dark:border-[#4BC957]/70 bg-green-50 dark:bg-[#4BC957]/5" : "border-green-200 dark:border-[#4BC957]/30 bg-slate-50 dark:bg-[#0F172A]/30 hover:border-green-400 dark:hover:border-[#4BC957]/50"}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-[#4BC957]/10 flex items-center justify-center text-green-600 dark:text-[#4BC957]">
                <Upload className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Drop your CV here</h3>
                <p className="text-slate-600 dark:text-slate-400">PDF or DOCX, max 10MB. We will parse skills, projects and experience.</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
              {selectedFile && (
                <p className="text-[13px] text-slate-600 dark:text-slate-400 font-medium truncate max-w-xs">
                  Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                </p>
              )}
            </div>

            {/* Upload Button (outside dropzone) */}
            <button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="w-full bg-green-600 hover:bg-green-500 dark:bg-[#4BC957] dark:hover:bg-[#00B96E] text-white dark:text-white font-bold px-5 py-3 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <span className="flex items-center justify-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Uploading...</span>
              ) : (
                <span className="flex items-center justify-center gap-2"><Upload className="h-4 w-4" /> Review My CV</span>
              )}
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 pt-4 border-t border-slate-200 dark:border-[#1E293B]/40">
            <button
              onClick={triggerAutoSuggest}
              disabled={!hasCv || isAnalyzing || isPolling}
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
        </div>

        {/* Right Column - Parsed Skills & Suggestions */}
        <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-[#1E293B]/60 rounded-2xl p-6 space-y-4 shadow-sm dark:shadow-none">
          {!hasCv ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">Upload a CV to see parsed skills and suggestions.</p>
          ) : isAnalyzing ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-green-600 dark:text-[#4BC957]" />
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Analyzing your CV...</p>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">This may take a few seconds.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider">Parsed skills</h3>

              {parsedSkills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {parsedSkills.map((skill: string) => (
                    <span
                      key={skill}
                      className="bg-slate-100 dark:bg-[#1E293B]/50 border border-slate-200 dark:border-slate-700/50 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-xl font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400">No skills parsed yet.</p>
              )}

              {suggestions.length > 0 && (
                <div className="space-y-2 pt-2">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider">Suggestions</h4>
                  <ul className="space-y-2">
                    {suggestions.map((suggestion, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-slate-700 dark:text-slate-300 text-sm">
                        <Check className="h-4 w-4 text-green-600 dark:text-[#4BC957] flex-shrink-0 mt-0.5" />
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
