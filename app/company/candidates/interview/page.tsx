"use client";

import React, { useState } from "react";
import { ArrowLeft, Sparkles, Trash2, Plus, Send } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useGetCompanyJobsQuery,
  useCreateCompanyInterviewMutation,
} from "@/store/authApi";
import type { CompanyInterviewPayload } from "@/store/authApi";

const EMPTY_PAYLOAD: CompanyInterviewPayload = {
  candidate_profile_id: 0,
  job_id: "",
  num_questions: 5,
};

export default function SetAIInterviewPage() {
  const searchParams = useSearchParams();
  const candidateId = searchParams.get("id");
  const { data: jobsData } = useGetCompanyJobsQuery();
  const jobs = jobsData?.data ?? [];

  const [roleContext, setRoleContext] = useState("Senior Product Designer");
  const [duration, setDuration] = useState("20 min");
  const [selectedPack, setSelectedPack] = useState("Product design • Senior");
  const [numQuestions, setNumQuestions] = useState(5);
  const [allowVoice, setAllowVoice] = useState(true);
  const [notifyComplete, setNotifyComplete] = useState(true);
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [createInterview] = useCreateCompanyInterviewMutation();

  const packs = [
    { name: "Product design • Senior", qCount: 6, time: "20 min" },
    { name: "Full-stack engineer • Mid", qCount: 8, time: "30 min" },
    { name: "Behavioural • Leadership", qCount: 5, time: "15 min" },
    { name: "Culture fit • GCC", qCount: 4, time: "12 min" }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateId || !selectedJobId) return;
    setIsSubmitting(true);
    setError(null);

    try {
      await createInterview({
        candidate_profile_id: Number(candidateId),
        job_id: selectedJobId,
        num_questions: numQuestions,
      }).unwrap();
      window.location.href = "/company/candidates/interview/sent";
    } catch (err) {
      setError("Failed to create interview. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (!candidateId) {
    return (
      <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-full mx-auto">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-lg font-bold text-foreground mb-2">No candidate selected</p>
          <p className="text-sm text-muted-foreground mb-4">Please select a candidate first.</p>
          <Link href="/company/candidates" className="text-sm font-semibold text-[#4BC957] hover:underline">
            Browse candidates
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-full mx-auto">
      {/* Top Navigation Back */}
      <div>
        <Link
          href="/company/candidates"
          className="inline-flex items-center gap-2 font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3">
          <p className="text-sm text-red-500 font-medium">{error}</p>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 rounded-full bg-muted border-2 border-border flex items-center justify-center font-extrabold text-foreground text-lg shadow-md flex-shrink-0">
          {candidateId}
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">AI interview setup</h1>
          <p className="text-muted-foreground font-semibold mt-1">Candidate ID: {candidateId}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Main Configuration Card (2/3 width) */}
          <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 space-y-6">

            {/* Job Selection */}
            <div className="space-y-2">
              <label className="font-bold text-muted-foreground uppercase tracking-wider">Select Job</label>
              <Select value={selectedJobId} onValueChange={(val) => val && setSelectedJobId(val)}>
                <SelectTrigger className="w-full bg-background border-border focus:border-[#4BC957]">
                  <SelectValue placeholder="Select a job" />
                </SelectTrigger>
                <SelectContent>
                  {jobs.map((job) => (
                    <SelectItem key={job.id} value={job.id}>
                      {job.title} — {job.location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Role Context & Duration inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="font-bold text-muted-foreground uppercase tracking-wider">Role context</label>
                <input
                  type="text"
                  value={roleContext}
                  onChange={(e) => setRoleContext(e.target.value)}
                  className="w-full bg-background border border-border focus:border-[#4BC957] text-foreground placeholder:text-muted-foreground rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="font-bold text-muted-foreground uppercase tracking-wider">Duration</label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-background border border-border focus:border-[#4BC957] text-foreground placeholder:text-muted-foreground rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Number of Questions */}
            <div className="space-y-2">
              <label className="font-bold text-muted-foreground uppercase tracking-wider">Number of questions</label>
              <input
                type="number"
                min={1}
                max={20}
                value={numQuestions}
                onChange={(e) => setNumQuestions(Number(e.target.value))}
                className="w-full bg-background border border-border focus:border-[#4BC957] text-foreground placeholder:text-muted-foreground rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors"
              />
            </div>

            {/* Preloaded Question Packs Grid */}
            <div className="space-y-3">
              <label className="font-bold text-muted-foreground uppercase tracking-wider block">Preloaded question packs</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {packs.map((pack) => {
                  const isSelected = selectedPack === pack.name;
                  return (
                    <div
                      key={pack.name}
                      onClick={() => setSelectedPack(pack.name)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${isSelected
                        ? "bg-muted border-[#4BC957]/50 shadow-[0_0_15px_-3px_rgba(0,208,124,0.15)]"
                        : "bg-background border-border hover:border-muted-foreground/30"
                        }`}
                    >
                      <p className="text-sm font-bold text-foreground">{pack.name}</p>
                      <p className="text-[13px] text-muted-foreground font-semibold mt-1">{pack.qCount} questions • {pack.time}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Settings Switches */}
            <div className="border-t border-border pt-6 space-y-4">
              <h3 className="font-bold text-muted-foreground uppercase tracking-wider">Settings</h3>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground">Allow voice answers</span>
                <Switch checked={allowVoice} onCheckedChange={setAllowVoice} className="data-checked:bg-[#4BC957]!" />
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground">Notify me when complete</span>
                <Switch checked={notifyComplete} onCheckedChange={setNotifyComplete} className="data-checked:bg-[#4BC957]!" />
              </div>
            </div>

          </div>

          {/* Sidebar Preview Details (1/3 width) */}
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
              <span className="text-[13px] text-[#4BC957] bg-[#4BC957]/10 border border-[#4BC957]/20 px-2.5 py-1 rounded-full flex items-center gap-1 font-bold uppercase tracking-wider w-fit">
                <Sparkles className="h-3.5 w-3.5" />
                Preview
              </span>

              <p className="text-muted-foreground leading-relaxed font-medium">
                CareerSprint AI will conduct a {numQuestions}-question interview, transcribe voice, and score answers on clarity, depth and rubric fit.
              </p>

              <div className="space-y-3.5 font-semibold pt-2">
                <div className="flex justify-between items-center text-muted-foreground">
                  <span>Questions</span>
                  <span className="text-foreground">{numQuestions}</span>
                </div>
                <div className="flex justify-between items-center text-muted-foreground">
                  <span>Estimated duration</span>
                  <span className="text-foreground">{duration}</span>
                </div>
                <div className="flex justify-between items-center text-muted-foreground">
                  <span>Cost</span>
                  <span className="text-foreground">5 credits</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !selectedJobId}
                className="w-full flex items-center justify-center gap-2 bg-[#4BC957] hover:bg-[#00B96E] text-white font-bold py-3 px-5 rounded-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send interview
                  </>
                )}
              </button>
            </div>

            {/* Under-sidebar info box */}
            <div className="border border-border bg-muted/50 rounded-2xl p-4">
              <p className="text-[13px] text-muted-foreground leading-relaxed font-medium">
                Candidates get a link to complete the interview anytime within 48 hours. You receive a scored report instantly after submission.
              </p>
            </div>
          </div>

        </div>
      </form>
    </div>
  );
}
