"use client";

import React, { useState, Suspense } from "react";
import { ArrowLeft, Sparkles, Send, Loader2, Mic, CheckCircle2, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetCompanyJobsQuery,
  useGetCompanyCandidateDetailQuery,
  useCreateCompanyInterviewMutation,
  useGetCompanyInterviewDetailQuery,
  useCreateCompanyInterviewQuestionMutation,
  useDeleteCompanyInterviewQuestionMutation,
  useGenerateCompanyInterviewQuestionsMutation,
  useSendCompanyInterviewMutation,
} from "@/store/authApi";
import type { CompanyInterviewPayload } from "@/store/authApi";

const EMPTY_PAYLOAD: CompanyInterviewPayload = {
  candidate_profile_id: 0,
  job_id: "",
  num_questions: 5,
};

function SetAIInterviewInner() {
  const searchParams = useSearchParams();
  const candidateId = searchParams.get("id");
  const interviewId = searchParams.get("interview_id");
  const { data: jobsData } = useGetCompanyJobsQuery();
  const { data: candidateData } = useGetCompanyCandidateDetailQuery(Number(candidateId), {
    skip: !candidateId,
  });
  const { data: interviewData, isLoading: isLoadingInterview, isError: isInterviewError } = useGetCompanyInterviewDetailQuery(interviewId ?? "", {
    skip: !interviewId,
  });
  const jobs = jobsData?.data ?? [];
  const candidate = candidateData?.data;
  const candidateName = candidate?.name ?? "Candidate";
  const interview = interviewData?.data;

  const [numQuestions, setNumQuestions] = useState(5);
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [allowVoice, setAllowVoice] = useState(true);
  const [notifyComplete, setNotifyComplete] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [createInterview] = useCreateCompanyInterviewMutation();
  const [createQuestion] = useCreateCompanyInterviewQuestionMutation();
  const [deleteQuestion] = useDeleteCompanyInterviewQuestionMutation();
  const [generateQuestions] = useGenerateCompanyInterviewQuestionsMutation();
  const [sendInterview] = useSendCompanyInterviewMutation();

  const [newQuestionText, setNewQuestionText] = useState("");
  const [newAnswerText, setNewAnswerText] = useState("");
  const [newQuestionOrder, setNewQuestionOrder] = useState<number>(0);
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [isSendingInterview, setIsSendingInterview] = useState(false);
  const [questionError, setQuestionError] = useState<string | null>(null);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);

  const selectedJob = jobs.find((j) => j.id === selectedJobId);

  React.useEffect(() => {
    if (interview?.job && !selectedJobId) {
      setSelectedJobId(interview.job);
    }
  }, [interview, selectedJobId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateId || !selectedJobId) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await createInterview({
        candidate_profile_id: Number(candidateId),
        job_id: selectedJobId,
        num_questions: numQuestions,
      }).unwrap();
      window.location.href = `/company/candidates/interview?id=${candidateId}&interview_id=${result.data.id}`;
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

  const questions = interview?.questions ?? [];

  const averageScore = questions.length > 0
    ? Math.round(questions.reduce((sum, q) => {
        const scoreMatch = q.answer_text.match(/(\d+)\/100/);
        return sum + (scoreMatch ? parseInt(scoreMatch[1], 10) : 0);
      }, 0) / questions.length)
    : 0;

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!interviewId || !newQuestionText.trim()) return;
    setIsAddingQuestion(true);
    setQuestionError(null);

    try {
      await createQuestion({
        interviewId,
        question_text: newQuestionText.trim(),
        answer_text: newAnswerText.trim() || "Pending answer",
        order: newQuestionOrder,
      }).unwrap();
      setNewQuestionText("");
      setNewAnswerText("");
      setNewQuestionOrder(questions.length + 1);
    } catch (err) {
      setQuestionError("Failed to add question. Please try again.");
    } finally {
      setIsAddingQuestion(false);
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!interviewId) return;
    try {
      await deleteQuestion({ interviewId, questionId }).unwrap();
    } catch (err) {
      setQuestionError("Failed to delete question. Please try again.");
    }
  };

  const handleGenerateQuestions = async () => {
    if (!interviewId || !interview) return;
    setIsGeneratingQuestions(true);
    setGenerateError(null);

    try {
      const generated = await generateQuestions({
        job_id: interview.job,
        job_description: interview.role_context || "",
        num_questions: numQuestions,
      }).unwrap();

      const questionsList = Array.isArray(generated.data) ? generated.data : [];
      for (let i = 0; i < questionsList.length; i++) {
        await createQuestion({
          interviewId,
          question_text: questionsList[i],
          answer_text: "Pending answer",
          order: questions.length + i,
        }).unwrap();
      }
    } catch (err) {
      setGenerateError("Failed to generate questions. Please try again.");
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  const handleSendInterview = async () => {
    if (!interviewId) return;
    setIsSendingInterview(true);
    setSendError(null);

    try {
      await sendInterview(interviewId).unwrap();
      window.location.href = "/company/candidates/interview/sent";
    } catch (err) {
      setSendError("Failed to send interview. Please try again.");
    } finally {
      setIsSendingInterview(false);
    }
  };

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
      <div>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">AI interview</h1>
        <p className="text-muted-foreground font-semibold mt-1">{candidateName}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Main Column (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Create Interview Form */}
          <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
            <h2 className="text-lg font-bold text-foreground">Create Interview</h2>

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
              {selectedJob && (
                <p className="text-sm text-muted-foreground font-medium pt-1">
                  Selected: <span className="text-foreground font-semibold">{selectedJob.title}</span>
                </p>
              )}
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

              {/* Create Interview Button */}
            <button
              type="submit"
              disabled={isSubmitting || !selectedJobId}
              className="w-full flex items-center justify-center gap-2 bg-[#4BC957] hover:bg-[#00B96E] text-white font-bold py-3 px-5 rounded-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSubmit}
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Create Interview
                </>
              )}
            </button>

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

          {/* Interview Details Section (shown when interview_id is present) */}
          {interviewId && (
            <div className="bg-card border border-border rounded-2xl p-6 space-y-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-foreground">Interview Details</h2>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Status:</span>
                  <span className="text-xs font-bold text-[#4BC957] bg-[#4BC957]/10 border border-[#4BC957]/20 px-2.5 py-1 rounded-full">
                    {interview?.status ?? "DRAFT"}
                  </span>
                </div>
              </div>

              {isLoadingInterview ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="bg-background border border-border rounded-xl p-5 space-y-3">
                      <Skeleton className="h-4 w-full rounded" />
                      <Skeleton className="h-3 w-3/4 rounded" />
                      <Skeleton className="h-2 w-full rounded" />
                    </div>
                  ))}
                </div>
              ) : isInterviewError ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <p className="text-sm text-red-500 font-medium mb-2">Failed to load interview details.</p>
                  <button onClick={() => window.location.reload()} className="text-sm font-semibold text-[#4BC957] hover:underline">
                    Retry
                  </button>
                </div>
              ) : (
                <>
                  {/* AI Generate Questions Button */}
                  <button
                    type="button"
                    disabled={isGeneratingQuestions}
                    onClick={handleGenerateQuestions}
                    className="w-full flex items-center justify-center gap-2 bg-muted hover:bg-muted/80 border border-border text-foreground font-bold py-3 px-5 rounded-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGeneratingQuestions ? (
                      <>
                        <div className="h-4 w-4 border-2 border-muted-foreground/30 border-t-muted-foreground rounded-full animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 text-[#4BC957]" />
                        AI Generate Questions
                      </>
                    )}
                  </button>

                  {generateError && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                      <p className="text-xs text-red-500 font-medium">{generateError}</p>
                    </div>
                  )}

                  {/* Transcript & Per-question Scoring */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-bold uppercase tracking-wider">
                      <Mic className="h-4 w-4 text-muted-foreground shrink-0" />
                      Transcript &amp; per-question scoring
                    </div>

                    {questionError && (
                      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                        <p className="text-xs text-red-500 font-medium">{questionError}</p>
                      </div>
                    )}

                    {/* Add Question Form */}
                    <form onSubmit={handleAddQuestion} className="bg-background border border-border rounded-xl p-5 space-y-3">
                      <h4 className="text-sm font-bold text-foreground uppercase tracking-wider">Add Question</h4>
                      <Input
                        type="text"
                        placeholder="Question text"
                        value={newQuestionText}
                        onChange={(e) => setNewQuestionText(e.target.value)}
                        className="bg-background border-border focus:border-[#4BC957]"
                        required
                      />
                      <textarea
                        rows={2}
                        placeholder="Answer text"
                        value={newAnswerText}
                        onChange={(e) => setNewAnswerText(e.target.value)}
                        className="w-full bg-background border border-border focus:border-[#4BC957] text-foreground placeholder:text-muted-foreground rounded-xl p-3 text-sm focus:outline-none transition-colors resize-none"
                      />
                      <div className="flex items-center gap-2">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Order:</label>
                        <input
                          type="number"
                          min={0}
                          value={newQuestionOrder}
                          onChange={(e) => setNewQuestionOrder(Number(e.target.value))}
                          className="w-20 bg-background border border-border focus:border-[#4BC957] text-foreground rounded-xl px-3 py-2 text-sm focus:outline-none transition-colors"
                        />
                        <button
                          type="submit"
                          disabled={isAddingQuestion || !newQuestionText.trim()}
                          className="flex items-center gap-1.5 bg-[#4BC957] hover:bg-[#00B96E] text-white font-bold px-4 py-2 rounded-xl text-sm transition-all active:scale-[0.98] disabled:opacity-50"
                        >
                          {isAddingQuestion ? (
                            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <Plus className="h-4 w-4" />
                          )}
                          Add
                        </button>
                      </div>
                    </form>

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

                            <div className="flex justify-end pt-1">
                              <button
                                onClick={() => handleDeleteQuestion(item.id)}
                                className="flex items-center gap-1.5 text-red-500 hover:text-red-600 text-xs font-semibold px-2.5 py-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                Delete
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
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
                <span>Cost</span>
                <span className="text-foreground">5 credits</span>
              </div>
             </div>

             {sendError && (
               <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                 <p className="text-xs text-red-500 font-medium">{sendError}</p>
               </div>
             )}

             <button
               onClick={handleSendInterview}
               disabled={isSendingInterview || !interviewId}
               className="w-full flex items-center justify-center gap-2 bg-[#4BC957] hover:bg-[#00B96E] text-white font-bold py-3 px-5 rounded-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
             >
               {isSendingInterview ? (
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
    </div>
  );
}

export default function SetAIInterviewPage() {
  return (
    <Suspense fallback={
      <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-full mx-auto">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-[#4BC957]" />
        </div>
      </div>
    }>
      <SetAIInterviewInner />
    </Suspense>
  );
}
