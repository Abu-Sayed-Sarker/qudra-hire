"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  ArrowLeft,
  Bot,
  Send,
  Mic,
  Star,
  CheckCircle2,
  Loader2,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useStartInterviewAttemptMutation, useSubmitInterviewAnswerMutation, useSubmitInterviewAttemptMutation } from "@/store/authApi";
import type { InterviewAttempt, InterviewAttemptQuestion } from "@/store/authApi";
import { toast } from "sonner";

export default function CandidateInterviewPage() {
  const searchParams = useSearchParams();
  const inviteId = searchParams.get("invite");

  const [startAttempt, { isLoading: isStarting, error: startError }] =
    useStartInterviewAttemptMutation();
  const [submitAnswer, { isLoading: isSubmitting }] =
    useSubmitInterviewAnswerMutation();
  const [submitAttempt, { isLoading: isSubmittingAttempt }] =
    useSubmitInterviewAttemptMutation();

  const [attempt, setAttempt] = useState<InterviewAttempt | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [response, setResponse] = useState("");
  const [isFinished, setIsFinished] = useState(false);
  const [allAnswered, setAllAnswered] = useState(false);
  const [answeredIds, setAnsweredIds] = useState<Set<string>>(new Set());
  const [startErrorMsg, setStartErrorMsg] = useState<string | null>(null);

  // Voice states
  const [mode, setMode] = useState<"text" | "voice">("text");
  const [voiceState, setVoiceState] = useState<"idle" | "recording" | "transcribing">("idle");
  const [transcribingLoader, setTranscribingLoader] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const recordingStartRef = useRef<number>(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  // Start the attempt on mount
  useEffect(() => {
    if (!inviteId) return;
    startAttempt(inviteId)
      .unwrap()
      .then((res) => {
        const data = res.data;
        setAttempt(data);
        // Resume from first unanswered question
        const firstUnanswered = data.questions.findIndex((q) => !q.is_answered);
        if (firstUnanswered >= 0) {
          setCurrentQuestionIdx(firstUnanswered);
        } else {
          setAllAnswered(true);
        }
      })
      .catch((err) => {
        const msg = err?.data?.details || err?.data?.message || "Something went wrong. Please try again.";
        setStartErrorMsg(msg);
      });
  }, [inviteId, startAttempt]);

  const questions: InterviewAttemptQuestion[] = attempt?.questions ?? [];
  const currentQuestion = questions[currentQuestionIdx];

  const goToNext = useCallback(() => {
    // Find next unanswered question after current
    for (let i = currentQuestionIdx + 1; i < questions.length; i++) {
      if (!questions[i].is_answered && !answeredIds.has(questions[i].id)) {
        setCurrentQuestionIdx(i);
        setResponse("");
        setVoiceState("idle");
        setAudioBlob(null);
        return;
      }
    }
    // No more unanswered questions — show submit screen
    setAllAnswered(true);
  }, [currentQuestionIdx, questions, answeredIds]);

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!response.trim() || !attempt || !currentQuestion) return;
    try {
      await submitAnswer({
        attemptId: attempt.interview,
        questionId: currentQuestion.id,
        inputType: "TEXT",
        responseText: response,
      }).unwrap();
      setAnsweredIds((prev) => new Set(prev).add(currentQuestion.id));
      goToNext();
    } catch {
      toast.error("Failed to submit answer. Please try again.");
    }
  };

  const handleVoiceToggle = async () => {
    if (voiceState === "idle") {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        const chunks: BlobPart[] = [];
        mediaRecorderRef.current = mediaRecorder;
        recordingStartRef.current = Date.now();

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunks.push(e.data);
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: "audio/webm" });
          setAudioBlob(blob);
          stream.getTracks().forEach((t) => t.stop());
        };

        mediaRecorder.start();
        setVoiceState("recording");
      } catch {
        toast.error("Microphone access denied. Please allow microphone access.");
      }
    } else if (voiceState === "recording" && mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setVoiceState("transcribing");
      setTranscribingLoader(true);
      setTimeout(() => {
        setResponse("Voice recorded — review your answer above, then submit.");
        setTranscribingLoader(false);
      }, 1500);
    }
  };

  const handleVoiceSubmit = async () => {
    if (!attempt || !currentQuestion) return;
    const durationSeconds = Math.round((Date.now() - recordingStartRef.current) / 1000);
    try {
      await submitAnswer({
        attemptId: attempt.interview,
        questionId: currentQuestion.id,
        inputType: "VOICE",
        responseText: response || undefined,
        audioFile: audioBlob ? new File([audioBlob], "answer.webm", { type: "audio/webm" }) : undefined,
        durationSeconds,
      }).unwrap();
      setAnsweredIds((prev) => new Set(prev).add(currentQuestion.id));
      goToNext();
    } catch {
      toast.error("Failed to submit voice answer. Please try again.");
    }
  };

  const handleSubmitInterview = async () => {
    if (!attempt) return;
    try {
      await submitAttempt(attempt.interview).unwrap();
      setIsFinished(true);
    } catch {
      toast.error("Failed to submit interview. Please try again.");
    }
  };

  // Loading state
  if (isStarting) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-[#4BC957] mx-auto" />
          <p className="text-sm text-muted-foreground font-semibold">Starting your interview...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (startError || startErrorMsg || (!attempt && !isStarting)) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center space-y-4 max-w-sm">
          <div className="h-14 w-14 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto">
            <span className="text-red-500 text-xl font-bold">!</span>
          </div>
          <h2 className="text-lg font-bold text-foreground">Could not start interview</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {!inviteId
              ? "No interview invite found. Please go back to the dashboard and try again."
              : startErrorMsg || "Something went wrong. Please try again or contact support."}
          </p>
          <Link
            href="/candidate"
            className="inline-block bg-[#4BC957] hover:bg-[#00B96E] text-white font-bold px-6 py-2.5 rounded-xl transition-all shadow-md shadow-[#4BC957]/10 active:scale-[0.98] text-sm"
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  // All answered — ready to submit
  if (allAnswered && !isFinished) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="bg-card border border-border rounded-3xl p-8 md:p-10 text-center space-y-6 shadow-sm max-w-md w-full">
          <div className="h-16 w-16 bg-[#4BC957]/10 border border-[#4BC957]/20 rounded-full flex items-center justify-center mx-auto text-[#4BC957] shadow-lg shadow-[#4BC957]/10">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-foreground tracking-tight">All questions answered!</h2>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
              You&apos;ve answered all {questions.length} questions. Review your answers or submit your interview to {attempt?.company_name}.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/candidate"
              className="inline-block bg-muted hover:bg-muted/80 text-foreground font-bold px-6 py-3 rounded-2xl transition-all text-sm border border-border"
            >
              Back to dashboard
            </Link>
            <button
              onClick={handleSubmitInterview}
              disabled={isSubmittingAttempt}
              className="inline-flex items-center justify-center gap-2 bg-[#4BC957] hover:bg-[#00B96E] disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed text-white font-bold px-6 py-3 rounded-2xl transition-all shadow-md shadow-[#4BC957]/10 active:scale-[0.98] text-sm"
            >
              {/* {isSubmittingAttempt ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} */}
              {isSubmittingAttempt ? "Submitting..." : "Submit interview"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Completed state
  if (isFinished) {
    return (
      <div className="p-8 max-w-full mx-auto min-h-[calc(100vh-4rem)] flex flex-col justify-center text-foreground">
        <div className="bg-card border border-border rounded-3xl p-8 md:p-10 text-center space-y-6 shadow-sm">
          <div className="h-16 w-16 bg-[#4BC957]/10 border border-[#4BC957]/20 rounded-full flex items-center justify-center mx-auto text-[#4BC957] shadow-lg shadow-[#4BC957]/10">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-foreground tracking-tight">Interview Completed!</h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              Well done! Your responses have been submitted successfully to {attempt.company_name}.
            </p>
          </div>
          <div className="bg-muted border border-border rounded-2xl p-4 text-xs text-muted-foreground leading-relaxed max-w-sm mx-auto">
            The hiring team will review the AI transcript and feedback report. You will be notified in your Inbox regarding subsequent rounds.
          </div>
          <div className="pt-4">
            <Link
              href="/candidate"
              className="inline-block bg-[#4BC957] hover:bg-[#00B96E] text-white font-bold px-6 py-3 rounded-2xl transition-all shadow-md shadow-[#4BC957]/10 active:scale-[0.98]"
            >
              Return to dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto text-foreground flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Back button */}
      <div>
        <Link
          href="/candidate"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm font-semibold transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </div>

      {/* Interview Meta */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
            AI interview &bull; {attempt.company_name}
          </p>
          <h1 className="text-2xl font-extrabold text-foreground mt-1 tracking-tight">
            {attempt.job_title}
          </h1>
        </div>
        {attempt.hours_remaining > 0 && (
          <div className="flex items-center gap-1.5 bg-muted border border-border rounded-lg px-3 py-1.5 text-xs font-semibold text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            {Math.floor(attempt.hours_remaining)}h remaining
          </div>
        )}
      </div>

      {/* Main Container Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start flex-1 min-h-0">

        {/* Left Column: Mode Toggle + Chat Area */}
        <div className="lg:col-span-2 flex flex-col space-y-4 h-full">

          {/* Mode toggle row */}
          <div className="bg-muted border border-border p-1.5 rounded-2xl flex w-full">
            <button
              onClick={() => {
                setMode("text");
                setVoiceState("idle");
              }}
              className={`flex-1 text-center py-2.5 rounded-xl text-xs font-bold transition-all ${mode === "text"
                  ? "bg-[#4BC957] text-white shadow"
                  : "text-muted-foreground hover:text-foreground"
                }`}
            >
              Text mode
            </button>
            <button
              onClick={() => {
                setMode("voice");
                setResponse("");
              }}
              className={`flex-1 text-center py-2.5 rounded-xl text-xs font-bold transition-all ${mode === "voice"
                  ? "bg-[#4BC957] text-white shadow"
                  : "text-muted-foreground hover:text-foreground"
                }`}
            >
              Voice mode
            </button>
          </div>

          {/* Active Chat panel */}
          <div className="bg-card border border-border rounded-2xl p-6 flex flex-col justify-between min-h-[440px] flex-1 shadow-sm">

            {/* Chat Messages */}
            <div className="space-y-4">
              <div className="flex gap-3 items-start">
                <div className="h-8 w-8 rounded-lg bg-[#4BC957]/10 border border-[#4BC957]/20 flex items-center justify-center text-[#4BC957] flex-shrink-0 mt-0.5">
                  <Bot className="h-4.5 w-4.5" />
                </div>
                <div className="bg-muted text-foreground px-4 py-3 rounded-2xl rounded-tl-none text-xs font-semibold leading-relaxed max-w-[80%] border border-border/50">
                  {currentQuestion?.question_text}
                </div>
              </div>

              {/* Show transcribed text when available in Voice Mode */}
              {mode === "voice" && response && (
                <div className="flex gap-3 items-start justify-end">
                  <div className="bg-[#4BC957] text-white px-4 py-3 rounded-2xl rounded-tr-none text-xs font-semibold leading-relaxed max-w-[80%]">
                    {response}
                  </div>
                </div>
              )}
            </div>

            {/* Answer Control Area */}
            <div className="pt-6 border-t border-border mt-6">

              {/* TEXT MODE INPUT */}
              {mode === "text" && (
                <form onSubmit={handleTextSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    placeholder="Type your answer..."
                    disabled={isSubmitting}
                    className="flex-1 bg-background border border-border rounded-xl px-4 py-3 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#4BC957]"
                  />
                  <button
                    type="submit"
                    disabled={!response.trim() || isSubmitting}
                    className="bg-[#4BC957] hover:bg-[#00B96E] disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed text-white p-3 rounded-xl transition-all shadow-md shadow-[#4BC957]/10 flex-shrink-0"
                  >
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </button>
                </form>
              )}

              {/* VOICE MODE CONTROLS */}
              {mode === "voice" && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {voiceState === "idle" && (
                      <>
                        <button
                          onClick={handleVoiceToggle}
                          className="h-12 w-12 rounded-full bg-[#4BC957] hover:bg-[#00B96E] text-white flex items-center justify-center transition-all shadow shadow-[#4BC957]/10"
                        >
                          <Mic className="h-5 w-5" />
                        </button>
                        <div className="text-left">
                          <p className="text-xs font-bold text-foreground">Tap to speak</p>
                          <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">We'll transcribe with AI</p>
                        </div>
                      </>
                    )}

                    {voiceState === "recording" && (
                      <>
                        <button
                          onClick={handleVoiceToggle}
                          className="h-12 w-12 rounded-full bg-[#EF4444] animate-pulse text-white flex items-center justify-center transition-all"
                        >
                          <Mic className="h-5 w-5" />
                        </button>
                        <div className="text-left">
                          <p className="text-xs font-bold text-foreground">Recording...</p>
                          <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">Tap again to stop &amp; transcribe</p>
                        </div>
                      </>
                    )}

                    {voiceState === "transcribing" && (
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground">
                          {transcribingLoader ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle2 className="h-5 w-5 text-[#4BC957]" />}
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-bold text-foreground">{transcribingLoader ? "Transcribing with AI..." : "Transcribed Successfully"}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {mode === "voice" && response && !transcribingLoader && (
                    <button
                      onClick={handleVoiceSubmit}
                      disabled={isSubmitting}
                      className="bg-[#4BC957] hover:bg-[#00B96E] disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-[#4BC957]/10 active:scale-[0.98]"
                    >
                      {/* {isSubmitting ? <Loader2 className="h-3.5 w-3.5 animate-spin inline mr-1" /> : null} */}
                      {isSubmitting ? "Submitting..." : "Submit answer"}
                    </button>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Right Column: AI Interviewer Note & Progress list */}
        <div className="space-y-6">

          {/* Interviewer intro card */}
          <div className="bg-card border border-border rounded-2xl p-5 space-y-3 shadow-sm">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#4BC957]">
              <Star className="h-4 w-4 fill-[#4BC957]" />
              AI interviewer
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed font-semibold">
              Hi, I'm CareerSprint — your AI interviewer trained on {attempt.company_name}'s rubric. Answer naturally; I'll score for clarity, depth, and relevance.
            </p>
          </div>

          {/* Progress list card */}
          <div className="bg-card border border-border rounded-2xl p-5 space-y-4 shadow-sm">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Progress</h3>

            <div className="w-full bg-muted h-1 rounded-full overflow-hidden">
              <div
                className="bg-[#4BC957] h-full transition-all duration-300"
                style={{ width: `${((questions.filter((q) => q.is_answered || answeredIds.has(q.id)).length) / questions.length) * 100}%` }}
              />
            </div>

            <div className="space-y-3.5 pt-2">
              {questions.map((q, idx) => {
                const isActive = currentQuestionIdx === idx;
                const isAnswered = q.is_answered || answeredIds.has(q.id);
                return (
                  <div key={q.id} className="flex items-center gap-3 text-xs font-semibold">
                    <span className={`h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] ${isAnswered
                        ? "bg-[#4BC957]/10 border border-[#4BC957]/20 text-[#4BC957]"
                        : isActive
                          ? "bg-foreground text-background"
                          : "border border-border text-muted-foreground"
                      }`}>
                      {isAnswered ? <CheckCircle2 className="h-3 w-3" /> : idx + 1}
                    </span>
                    <span className={isActive ? "text-foreground" : isAnswered ? "text-muted-foreground" : "text-muted-foreground/60"}>
                      Question {idx + 1}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
