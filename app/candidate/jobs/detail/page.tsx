"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import {
  ArrowLeft,
  Check,
  Sparkles,
  RotateCcw,
  Eye,
  ArrowRight,
  CheckCircle2,
  MapPin,
  Clock,
  DollarSign,
  X,
  Loader2,
  Globe,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { useGetCandidateJobDetailQuery, useApplyToJobMutation, useTailorCandidateCvMutation, authApi, TailoredCv } from "@/store/authApi";
import { get403Message } from "@/lib/utils";
import SubscriptionRequiredCard from "@/components/ui/subscription-required-card";
import { AlertTriangle } from "lucide-react";

function JobDetailContent() {
  const params = useSearchParams();
  const router = useRouter();
  const id = params.get("id") ?? "";

  const { data, isLoading, isError, error } = useGetCandidateJobDetailQuery(id);
  const job = data?.data;

  const status = params.get("status") as "initial" | "tailoring" | "tailored" | "comparison" | "success" | null;
  const [rightState, setRightStateRaw] = useState<"initial" | "tailoring" | "tailored" | "comparison" | "success">(status ?? "initial");

  const setRightState = (state: typeof rightState) => {
    setRightStateRaw(state);
    const url = new URL(window.location.href);
    url.searchParams.set("status", state);
    router.replace(url.toString(), { scroll: false });
  };
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [applyStep, setApplyStep] = useState<"review" | "submitted">("review");
  const [applyToJob, { isLoading: isApplying }] = useApplyToJobMutation();

  const [applyForm, setApplyForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    age: "",
    expected_salary: "",
  });
  const [applyError, setApplyError] = useState("");

  const [tailorCv] = useTailorCandidateCvMutation();
  const dispatch = useAppDispatch();

  const urlTailoredCvId = params.get("tailoredCvId");
  const pollingRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pollStartedRef = useRef(false);
  const [tailoredCvData, setTailoredCvData] = useState<TailoredCv | null>(null);

  useEffect(() => {
    if (!urlTailoredCvId || pollStartedRef.current) return;
    pollStartedRef.current = true;

    let attempts = 0;
    const maxAttempts = 60;

    const poll = async () => {
      attempts++;
      if (attempts > maxAttempts) return;
      try {
        const result = await dispatch(
          authApi.endpoints.getTailoredCv.initiate(urlTailoredCvId, { forceRefetch: true })
        ).unwrap();
        const cvStatus = result.data.status;
        if (cvStatus === "COMPLETED") {
          setTailoredCvData(result.data);
          setTailoringSteps(prev => prev.map(step => ({ ...step, done: true })));
          setProgressWidth(100);
          setTimeout(() => setRightState("tailored"), 500);
          return;
        }
        if (cvStatus === "FAILED") {
          const url = new URL(window.location.href);
          url.searchParams.delete("tailoredCvId");
          router.replace(url.toString(), { scroll: false });
          setRightState("initial");
          return;
        }
        pollingRef.current = setTimeout(poll, 3000);
      } catch {
        pollingRef.current = setTimeout(poll, 3000);
      }
    };

    pollingRef.current = setTimeout(poll, 2000);

    return () => {
      if (pollingRef.current) clearTimeout(pollingRef.current);
    };
  }, [urlTailoredCvId, dispatch, router]);

  const [tailoringSteps, setTailoringSteps] = useState([
    { id: 1, text: "Extracting keywords from job description", done: false },
    { id: 2, text: "Comparing your skills", done: false },
    { id: 3, text: "Improving summary", done: false },
    { id: 4, text: "Matching experience", done: false },
    { id: 5, text: "Updating skills section", done: false },
  ]);
  const [progressWidth, setProgressWidth] = useState(0);

  const startTailoring = async () => {
    if (!job) return;
    setRightState("tailoring");
    setProgressWidth(0);
    setTailoringSteps([
      { id: 1, text: "Extracting keywords from job description", done: false },
      { id: 2, text: "Comparing your skills", done: false },
      { id: 3, text: "Improving summary", done: false },
      { id: 4, text: "Matching experience", done: false },
      { id: 5, text: "Updating skills section", done: false },
    ]);

    // Start animation steps — max 80% until COMPLETED
    const timings = [500, 1200, 2000, 2800, 3600];
    timings.forEach((ms, idx) => {
      setTimeout(() => {
        setTailoringSteps(prev => prev.map((step, i) => i === idx ? { ...step, done: true } : step));
        setProgressWidth(Math.min((idx + 1) * 20, 80));
      }, ms);
    });

    try {
      // Call the tailor-cv API
      const result = await tailorCv(job.id).unwrap();
      const tailoredCvId = result.data.id;

      const url = new URL(window.location.href);
      url.searchParams.set("tailoredCvId", tailoredCvId);
      router.replace(url.toString(), { scroll: false });

      // Poll until status is COMPLETED or FAILED
      let attempts = 0;
      const maxAttempts = 60; // 60 * 3s = 3 minutes max

      const poll = async () => {
        attempts++;
        if (attempts > maxAttempts) {
          setRightState("tailored");
          return;
        }
        try {
          // Use forceRefetch to bypass RTK Query cache
          const pollResult = await dispatch(
            authApi.endpoints.getTailoredCv.initiate(tailoredCvId, { forceRefetch: true })
          ).unwrap();
          const status = pollResult.data.status;
          if (status === "COMPLETED") {
            setTailoredCvData(pollResult.data);
            setTailoringSteps(prev => prev.map(step => ({ ...step, done: true })));
            setProgressWidth(100);
            setTimeout(() => setRightState("tailored"), 500);
            return;
          }
          if (status === "FAILED") {
            setRightState("initial");
            return;
          }
          // Still PROCESSING or PENDING — poll again after 3s
          setTimeout(poll, 3000);
        } catch {
          // Transient error — retry after 3s
          setTimeout(poll, 3000);
        }
      };

      // Start first poll after 3s
      setTimeout(poll, 3000);
    } catch {
      // API call failed, still show animation result
      setTimeout(() => setRightState("tailored"), 4500);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !job) {
    const msg = get403Message(error);
    if (msg) {
      return <SubscriptionRequiredCard message={msg} />;
    }
    return (
      <div className="py-20 text-center">
        <p className="text-red-400">Failed to load job details.</p>
        <Link href="/candidate" className="mt-4 text-sm text-[#23C65F] hover:underline inline-block">Go Back</Link>
      </div>
    );
  }

  const matchScore = job.match_score;
  const salary = `${job.currency} ${(job.salary_min / 1000).toFixed(0)}k–${(job.salary_max / 1000).toFixed(0)}k`;
  const companyInitials = job.company_name.slice(0, 2).toUpperCase();

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-full mx-auto text-on-surface">
      {/* Back button */}
      <div>
        <Link href="/candidate" className="inline-flex items-center gap-2 text-on-surface-muted hover:text-on-surface text-sm font-semibold transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Job Description */}
        <div className="lg:col-span-7 bg-surface-card border border-surface rounded-2xl p-6 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-surface-item to-surface-deep border border-surface flex items-center justify-center font-bold text-on-surface-muted text-sm flex-shrink-0">
                {companyInitials}
              </div>
              <div>
                <p className="text-on-surface-muted font-semibold">{job.company_name}</p>
                <h1 className="text-xl font-bold text-on-surface leading-tight">{job.title}</h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-on-surface-muted text-[13px] font-semibold mt-1">
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{job.employment_type_display}</span>
                  <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" />{salary}</span>
                  {job.visa_sponsorship && <span className="text-[#23C65F]">✓ Visa</span>}
                </div>
              </div>
            </div>
            <span className="text-[13px] font-bold px-2.5 py-1 rounded-full bg-[#23C65F]/15 border border-[#23C65F]/30 text-[#23C65F] flex-shrink-0">
              {matchScore}% match
            </span>
          </div>

          {/* About the role */}
          <div className="space-y-2">
            <h2 className="text-sm font-bold text-on-surface">About the role</h2>
            <p className="text-on-surface-muted leading-relaxed font-medium">{job.description}</p>
          </div>

          {/* Requirements */}
          {job.requirements_list.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-sm font-bold text-on-surface">Requirements</h2>
              <ul className="space-y-2 text-on-surface-muted font-medium">
                {job.requirements_list.map((req, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#23C65F] font-extrabold mt-0.5">&gt;</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Required skills */}
          {job.skills.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-sm font-bold text-on-surface">Required skills</h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, i) => (
                  <span key={i} className="bg-surface-item border border-surface text-on-surface-muted text-[13px] font-semibold px-3 py-1 rounded-lg">{skill}</span>
                ))}
              </div>
            </div>
          )}

          {/* Preferred skills */}
          {job.preferred_skills.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-sm font-bold text-on-surface">Preferred skills</h2>
              <div className="flex flex-wrap gap-2">
                {job.preferred_skills.map((skill, i) => (
                  <span key={i} className="bg-surface-item border border-surface text-on-surface-muted text-[13px] font-semibold px-3 py-1 rounded-lg">{skill}</span>
                ))}
              </div>
            </div>
          )}

          {/* Benefits */}
          {job.benefits.length > 0 && (
            <div className="space-y-2 border-t border-surface pt-4">
              <h2 className="text-sm font-bold text-on-surface">Benefits</h2>
              <ul className="space-y-1.5 text-on-surface-muted font-medium">
                {job.benefits.map((b, i) => (
                  <li key={i}>✓ {b}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Job tags */}
          <div className="flex flex-wrap gap-2 pt-2">
            {job.visa_sponsorship && (
              <span className="flex items-center gap-1 text-[13px] font-semibold text-on-surface-muted bg-surface-item border border-surface px-3 py-1 rounded-lg">
                <Globe className="h-3 w-3" /> Visa Sponsorship
              </span>
            )}
            {job.emiratization && (
              <span className="text-[13px] font-semibold text-[#23C65F] bg-[#23C65F]/10 border border-[#23C65F]/20 px-3 py-1 rounded-lg">Emiratization</span>
            )}
            {job.saudization && (
              <span className="text-[13px] font-semibold text-amber-600 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-lg">Saudization</span>
            )}
            {job.open_to_remote && (
              <span className="text-[13px] font-semibold text-blue-500 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-lg">Remote OK</span>
            )}
          </div>
        </div>

        {/* Right Column: Interactive AI CV Aligner */}
        <div className="lg:col-span-5 space-y-6">
          {/* STATE 1: INITIAL */}
          {rightState === "initial" && (
            <div className="space-y-6">
              <div className="bg-surface-card border border-surface rounded-2xl p-6 space-y-5">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-on-surface-muted uppercase tracking-wider">CV match score</h3>
                  <span className="font-bold text-on-surface">Current CV</span>
                </div>
                <div className="space-y-1">
                  <div className="text-4xl font-extrabold text-on-surface tracking-tight">{matchScore}%</div>
                  <div className="w-full bg-surface-item h-2 rounded-full overflow-hidden">
                    <div className="bg-[#23C65F] h-full rounded-full transition-all duration-500" style={{ width: `${matchScore}%` }} />
                  </div>
                </div>
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <span className="text-[13px] font-bold text-on-surface-muted uppercase tracking-wider block">Required Skills</span>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-on-surface font-semibold">
                      {job.skills.map((s, i) => (
                        <span key={i} className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-[#23C65F]" />{s}</span>
                      ))}
                    </div>
                  </div>
                  {job.preferred_skills.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[13px] font-bold text-on-surface-muted uppercase tracking-wider block">Preferred</span>
                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-on-surface-muted font-semibold">
                        {job.preferred_skills.map((s, i) => (
                          <span key={i} className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-surface-item" />{s}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex gap-3">
                  <button onClick={startTailoring} className="flex-1 flex items-center justify-center gap-1.5 border border-[#23C65F] hover:bg-[#23C65F]/10 text-[#23C65F] text-[13px] font-bold py-3 px-3 rounded-xl transition-all active:scale-[0.98]">
                    Tailor my CV for this role
                  </button>
                  <button onClick={() => { setApplyModalOpen(true); setApplyStep("review"); }} className="flex-1 flex items-center justify-center gap-1.5 bg-[#23C65F] hover:bg-[#1DA852] text-white text-[13px] font-bold py-3 px-3 rounded-xl transition-all shadow-md shadow-[#23C65F]/10 active:scale-[0.98]">
                    Apply now
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STATE 2: TAILORING */}
          {rightState === "tailoring" && (
            <div className="bg-surface-card border border-surface rounded-2xl p-6 space-y-6">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#23C65F] animate-ping" />
                <h3 className="font-bold text-on-surface-muted uppercase tracking-wider">AI is tailoring your CV...</h3>
              </div>
              <div className="space-y-4">
                {tailoringSteps.map((step) => (
                  <div key={step.id} className="flex items-center gap-3 font-semibold">
                    {step.done ? (
                      <span className="h-5 w-5 rounded-full bg-[#23C65F]/10 border border-[#23C65F]/20 text-[#23C65F] flex items-center justify-center flex-shrink-0">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                    ) : (
                      <span className="h-5 w-5 rounded-full border border-surface text-on-surface-muted flex items-center justify-center flex-shrink-0 text-[13px]">{step.id}</span>
                    )}
                    <span className={step.done ? "text-on-surface" : "text-on-surface-muted"}>{step.text}</span>
                  </div>
                ))}
              </div>
              <div className="w-full bg-surface-item h-2 rounded-full overflow-hidden">
                <div className="bg-[#23C65F] h-full rounded-full transition-all duration-300" style={{ width: `${progressWidth}%` }} />
              </div>
            </div>
          )}

          {/* STATE 3: TAILORED */}
          {rightState === "tailored" && tailoredCvData && (
            <div className="bg-surface-card border border-surface rounded-2xl p-6 space-y-5">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-on-surface-muted uppercase tracking-wider">Updated Match</h3>
                <span className="text-[13px] font-bold bg-[#23C65F]/15 border border-[#23C65F]/30 text-[#23C65F] px-2 py-0.5 rounded-md">Tailored CV</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-on-surface tracking-tight">{tailoredCvData.score_after}%</span>
                  <span className="text-[13px] font-bold text-[#23C65F] bg-[#23C65F]/10 border border-[#23C65F]/20 px-2 py-0.5 rounded">+{(tailoredCvData.score_after ?? 0) - (tailoredCvData.score_before ?? 0)}</span>
                </div>
                <div className="w-full bg-surface-item h-2 rounded-full overflow-hidden">
                  <div className="bg-[#23C65F] h-full rounded-full" style={{ width: `${tailoredCvData.score_after}%` }} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button onClick={startTailoring} className="border border-surface hover:bg-surface-item text-on-surface py-2.5 rounded-xl text-[13px] font-bold flex items-center justify-center gap-1">
                  <RotateCcw className="h-3 w-3" /> Regenerate
                </button>
                <button onClick={() => setRightState("comparison")} className="border border-surface hover:bg-surface-item text-on-surface py-2.5 rounded-xl text-[13px] font-bold flex items-center justify-center gap-1">
                  <Eye className="h-3 w-3" /> Compare
                </button>
                <button onClick={() => { setApplyModalOpen(true); setApplyStep("review"); }} className="bg-[#23C65F] hover:bg-[#1DA852] text-white py-2.5 rounded-xl text-[13px] font-bold flex items-center justify-center gap-1">
                  Use tailored CV <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
              {(tailoredCvData.html_url || tailoredCvData.pdf_url) && (
                <div className="flex gap-2 pt-1">
                  {tailoredCvData.html_url && (
                    <a href={tailoredCvData.html_url} target="_blank" rel="noopener noreferrer" className="flex-1 border border-surface hover:bg-surface-item text-on-surface-muted py-2 rounded-xl text-[13px] font-bold text-center transition-colors">
                      View HTML
                    </a>
                  )}
                  {tailoredCvData.pdf_url && (
                    <a href={tailoredCvData.pdf_url} target="_blank" rel="noopener noreferrer" className="flex-1 border border-surface hover:bg-surface-item text-on-surface-muted py-2 rounded-xl text-[13px] font-bold text-center transition-colors">
                      Download PDF
                    </a>
                  )}
                </div>
              )}
            </div>
          )}

          {/* STATE 4: COMPARISON */}
          {rightState === "comparison" && tailoredCvData && (
            <div className="bg-surface-card border border-surface rounded-2xl p-6 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-on-surface-muted uppercase tracking-wider">Side-by-side comparison</h3>
                <button onClick={() => setRightState("tailored")} className="text-on-surface-muted hover:text-on-surface font-bold flex items-center gap-1 transition-colors">
                  <ArrowLeft className="h-3 w-3" /> Back
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-surface-deep border border-surface space-y-3">
                  <span className="text-[13px] font-bold text-on-surface-muted uppercase tracking-wider block">Original</span>
                  <div className="text-3xl font-extrabold text-on-surface">{tailoredCvData.score_before ?? 0}%</div>
                  <div className="w-full bg-surface-item h-1.5 rounded-full overflow-hidden"><div className="bg-on-surface-muted h-full rounded-full transition-all duration-700" style={{ width: `${tailoredCvData.score_before ?? 0}%` }} /></div>
                </div>
                <div className="p-4 rounded-xl bg-surface-deep border border-[#23C65F]/25 space-y-3">
                  <span className="text-[13px] font-bold text-[#23C65F] uppercase tracking-wider block">Tailored</span>
                  <div className="text-3xl font-extrabold text-[#23C65F]">{tailoredCvData.score_after ?? 0}%</div>
                  <div className="w-full bg-surface-item h-1.5 rounded-full overflow-hidden"><div className="bg-[#23C65F] h-full rounded-full transition-all duration-700" style={{ width: `${tailoredCvData.score_after ?? 0}%` }} /></div>
                </div>
              </div>
              <button onClick={() => { setApplyModalOpen(true); setApplyStep("review"); }} className="w-full flex items-center justify-center gap-1.5 bg-[#23C65F] hover:bg-[#1DA852] text-white font-bold py-3 px-5 rounded-xl transition-all shadow-md shadow-[#23C65F]/10 active:scale-[0.98]">
                Use tailored CV <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* STATE 5: SUCCESS */}
          {rightState === "success" && (
            <div className="bg-surface-card border border-surface rounded-2xl p-6 text-center space-y-6">
              <div className="h-12 w-12 bg-[#23C65F]/10 border border-[#23C65F]/20 rounded-full flex items-center justify-center mx-auto text-[#23C65F] shadow-lg shadow-[#23C65F]/10 animate-bounce">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-on-surface tracking-tight">Application Submitted!</h3>
                <p className="text-on-surface-muted leading-relaxed font-semibold">
                  Your application has been sent to {job.company_name} successfully.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-surface-deep border border-surface text-on-surface-muted font-medium leading-relaxed max-w-sm mx-auto">
                You can track this application in your Applications dashboard or check for recruiter messages in the Inbox.
              </div>
              <button disabled className="w-full bg-surface-item text-on-surface-muted border border-surface font-bold py-3 px-5 rounded-xl flex items-center justify-center gap-2 cursor-not-allowed">
                <CheckCircle2 className="h-4 w-4 text-[#23C65F]" /> Already Applied
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Apply to Job Modal */}
      {applyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !isApplying && setApplyModalOpen(false)} />
          <div className="relative z-10 w-full max-w-md bg-surface-card border border-surface rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-surface">
              <h2 className="text-base font-extrabold text-on-surface">Apply to job</h2>
              <button onClick={() => !isApplying && setApplyModalOpen(false)} className="text-on-surface-muted hover:text-on-surface transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
            {applyStep === "review" && (
              <>
                <div className="px-6 pt-4">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex-1 bg-surface-item h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#23C65F] h-full rounded-full" style={{ width: "100%" }} />
                    </div>
                    <span className="ml-3 text-[13px] font-bold text-on-surface">100%</span>
                  </div>
                </div>
                <div className="overflow-y-auto flex-1 px-6 py-5 space-y-6">
                  <h3 className="text-lg font-bold text-on-surface">Review your application</h3>
                  {applyError && (
                    <p className="text-xs text-red-500 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg">{applyError}</p>
                  )}
                  <div className="border-t border-surface pt-5 space-y-4">
                    <h4 className="font-bold text-on-surface">Contact Info</h4>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[13px] font-semibold text-on-surface-muted">Your name <span className="text-red-400">*</span></label>
                        <input type="text" placeholder="Enter name" value={applyForm.full_name} onChange={(e) => setApplyForm(p => ({ ...p, full_name: e.target.value }))} className="w-full bg-surface-item border border-surface rounded-xl px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-muted focus:outline-none focus:border-[#23C65F]/50 transition-colors" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[13px] font-semibold text-on-surface-muted">Your email <span className="text-red-400">*</span></label>
                        <input type="email" placeholder="Enter email" value={applyForm.email} onChange={(e) => setApplyForm(p => ({ ...p, email: e.target.value }))} className="w-full bg-surface-item border border-surface rounded-xl px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-muted focus:outline-none focus:border-[#23C65F]/50 transition-colors" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[13px] font-semibold text-on-surface-muted">Your phone <span className="text-red-400">*</span></label>
                        <input type="tel" placeholder="+971 50 000 0000" value={applyForm.phone} onChange={(e) => setApplyForm(p => ({ ...p, phone: e.target.value }))} className="w-full bg-surface-item border border-surface rounded-xl px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-muted focus:outline-none focus:border-[#23C65F]/50 transition-colors" />
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-surface pt-5 space-y-4">
                    <h4 className="font-bold text-on-surface">Additional Questions</h4>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[13px] font-semibold text-on-surface-muted">Your Age <span className="text-red-400">*</span></label>
                        <input type="number" placeholder="e.g. 28" value={applyForm.age} onChange={(e) => setApplyForm(p => ({ ...p, age: e.target.value }))} className="w-full bg-surface-item border border-surface rounded-xl px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-muted focus:outline-none focus:border-[#23C65F]/50 transition-colors" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[13px] font-semibold text-on-surface-muted">Your Expected Salary <span className="text-red-400">*</span></label>
                        <input type="text" placeholder="e.g. AED 15,000" value={applyForm.expected_salary} onChange={(e) => setApplyForm(p => ({ ...p, expected_salary: e.target.value }))} className="w-full bg-surface-item border border-surface rounded-xl px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-muted focus:outline-none focus:border-[#23C65F]/50 transition-colors" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4 border-t border-surface flex gap-3">
                  <button onClick={() => setApplyModalOpen(false)} disabled={isApplying} className="flex-1 border border-surface hover:bg-surface-item text-on-surface font-bold py-3 rounded-xl text-sm transition-all disabled:opacity-50">Back</button>
                  <button
                    onClick={async () => {
                      if (!applyForm.full_name.trim() || !applyForm.email.trim() || !applyForm.phone.trim()) {
                        setApplyError("Please fill in all contact fields.");
                        return;
                      }
                      setApplyError("");
                      try {
                        await applyToJob({
                          id: job.id,
                          full_name: applyForm.full_name,
                          email: applyForm.email,
                          phone: applyForm.phone,
                          answers: [
                            { question: "What is your age?", answer: applyForm.age },
                            { question: "What is your expected salary?", answer: applyForm.expected_salary },
                          ],
                        }).unwrap();
                        setApplyStep("submitted");
                        setRightState("success");
                      } catch (err: unknown) {
                        setApplyError((err as { data?: { details?: string } })?.data?.details ?? "Failed to submit application.");
                      }
                    }}
                    disabled={isApplying}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#23C65F] hover:bg-[#1DA852] text-white font-bold py-3 rounded-xl text-sm transition-all shadow-md shadow-[#23C65F]/10 active:scale-[0.98] disabled:opacity-60"
                  >
                    {isApplying && <Loader2 className="h-4 w-4 animate-spin" />}
                    {isApplying ? "Submitting…" : "Submit"}
                  </button>
                </div>
              </>
            )}
            {applyStep === "submitted" && (
              <div className="px-6 py-10 flex flex-col items-center text-center gap-5">
                <div className="h-14 w-14 bg-[#23C65F]/10 border border-[#23C65F]/20 rounded-full flex items-center justify-center text-[#23C65F] animate-bounce">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-extrabold text-on-surface">Application Submitted!</h3>
                  <p className="text-sm text-on-surface-muted font-medium">Your application has been sent to {job.company_name} successfully.</p>
                </div>
                <button onClick={() => setApplyModalOpen(false)} className="mt-2 bg-[#23C65F] hover:bg-[#1DA852] text-white font-bold py-3 px-8 rounded-xl text-sm transition-all">Done</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function JobDetailPage() {
  return (
    <Suspense>
      <JobDetailContent />
    </Suspense>
  );
}
