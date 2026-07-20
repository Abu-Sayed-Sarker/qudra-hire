"use client";

import React, { useState, Suspense } from "react";
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
  FileText,
  Phone,
  Mail,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function JobDetailContent() {
  const params = useSearchParams();
  const id = params.get("id")
  const status = params.get("status") as "initial" | "tailoring" | "tailored" | "comparison" | "success" || "initial";
  // States: 'initial' | 'tailoring' | 'tailored' | 'comparison' | 'success'
  const [rightState, setRightState] = useState<"initial" | "tailoring" | "tailored" | "comparison" | "success">(status);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [applyStep, setApplyStep] = useState<"review" | "submitted">("review");

  // Steps for tailoring animation
  const [tailoringSteps, setTailoringSteps] = useState([
    { id: 1, text: "Extracting keywords from job description", done: false },
    { id: 2, text: "Comparing your skills", done: false },
    { id: 3, text: "Improving summary", done: false },
    { id: 4, text: "Matching experience", done: false },
    { id: 5, text: "Updating skills section", done: false }
  ]);
  const [progressWidth, setProgressWidth] = useState(0);

  // Trigger the AI tailoring animation
  const startTailoring = () => {
    setRightState("tailoring");
    setProgressWidth(0);
    setTailoringSteps([
      { id: 1, text: "Extracting keywords from job description", done: false },
      { id: 2, text: "Comparing your skills", done: false },
      { id: 3, text: "Improving summary", done: false },
      { id: 4, text: "Matching experience", done: false },
      { id: 5, text: "Updating skills section", done: false }
    ]);

    // Step-by-step progress simulation
    const timings = [500, 1200, 2000, 2800, 3600];
    timings.forEach((ms, idx) => {
      setTimeout(() => {
        setTailoringSteps(prev =>
          prev.map((step, i) => i === idx ? { ...step, done: true } : step)
        );
        setProgressWidth((idx + 1) * 20);
      }, ms);
    });

    setTimeout(() => {
      setRightState("tailored");
    }, 4500);
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-full mx-auto text-on-surface">
      {/* Back button */}
      <div>
        <Link
          href="/candidate"
          className="inline-flex items-center gap-2 text-on-surface-muted hover:text-on-surface text-sm font-semibold transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </div>

      {/* Main Grid: Job Details (Left) vs CV Matcher (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Left Column: Job Description (7 cols on lg) */}
        <div className="lg:col-span-7 bg-surface-card border border-surface rounded-2xl p-6 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-surface-item to-surface-deep border border-surface flex items-center justify-center font-bold text-on-surface-muted text-sm flex-shrink-0">
                ENB
              </div>
              <div>
                <p className=" text-on-surface-muted font-semibold">Emirates NBD</p>
                <h1 className="text-xl font-bold text-on-surface leading-tight">Senior Product Designer</h1>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-on-surface-muted text-[13px] font-semibold mt-1">
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />Dubai, UAE</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />Full-time</span>
                  <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" />AED 28k-35k</span>
                  <span className="text-[#4BC957]">✓ Visa</span>
                </div>
              </div>
            </div>

            <span className="text-[13px] font-bold px-2.5 py-1 rounded-full bg-[#4BC957]/15 border border-[#4BC957]/30 text-[#4BC957] flex-shrink-0">
              78% match
            </span>
          </div>

          {/* About the role */}
          <div className="space-y-2">
            <h2 className="text-sm font-bold text-on-surface">About the role</h2>
            <p className=" text-on-surface-muted leading-relaxed font-medium">
              Lead end-to-end product design for Emirates NBD's flagship mobile banking experience, serving over 9M customers across the GCC. You'll partner closely with product, engineering, and research to ship measurable improvements to the core banking journey.
            </p>
          </div>

          {/* Responsibilities */}
          <div className="space-y-2">
            <h2 className="text-sm font-bold text-on-surface">Responsibilities</h2>
            <ul className="space-y-2  text-on-surface-muted font-medium">
              <li className="flex items-start gap-2">
                <span className="text-[#4BC957] font-extrabold mt-0.5">&gt;</span>
                <span>Own the design vision for two core squads within retail banking</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#4BC957] font-extrabold mt-0.5">&gt;</span>
                <span>Run discovery, ideation, prototyping and validation cycles</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#4BC957] font-extrabold mt-0.5">&gt;</span>
                <span>Mentor mid-level designers and contribute to the design system</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#4BC957] font-extrabold mt-0.5">&gt;</span>
                <span>Present work to senior leadership and align cross-functional partners</span>
              </li>
            </ul>
          </div>

          {/* Required skills */}
          <div className="space-y-2">
            <h2 className="text-sm font-bold text-on-surface">Required skills</h2>
            <div className="flex flex-wrap gap-2  text-on-surface-muted font-semibold">
              <span>Figma</span> • <span>Design systems</span> • <span>UX research</span> • <span>Prototyping</span> • <span>Mobile design</span>
            </div>
          </div>

          {/* Preferred skills */}
          <div className="space-y-2">
            <h2 className="text-sm font-bold text-on-surface">Preferred skills</h2>
            <div className="flex flex-wrap gap-2  text-on-surface-muted font-semibold">
              <span>Fintech experience</span> • <span>Arabic localization</span> • <span>Motion design</span> • <span>Accessibility (WCAG)</span>
            </div>
          </div>

          {/* Benefits */}
          <div className="space-y-2 border-t border-surface pt-4">
            <h2 className="text-sm font-bold text-on-surface">Benefits</h2>
            <ul className="space-y-1.5  text-on-surface-muted font-medium">
              <li>✓ Full health coverage for you and dependents</li>
              <li>✓ 30 days paid leave plus public holidays</li>
              <li>✓ Annual flight allowance home</li>
              <li>✓ End-of-service gratuity per UAE law</li>
            </ul>
          </div>
        </div>

        {/* Right Column: Interactive AI CV Aligner (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-6">

          {/* STATE 1: INITIAL */}
          {rightState === "initial" && (
            <div className="space-y-6">
              {/* CV Match Card */}
              <div className="bg-surface-card border border-surface rounded-2xl p-6 space-y-5">
                <div className="flex justify-between items-center">
                  <h3 className=" font-bold text-on-surface-muted uppercase tracking-wider">CV match score</h3>
                  <span className=" font-bold text-on-surface">Current CV</span>
                </div>

                <div className="space-y-1">
                  <div className="text-4xl font-extrabold text-on-surface tracking-tight">78%</div>
                  <div className="w-full bg-surface-item h-2 rounded-full overflow-hidden">
                    <div className="bg-[#4BC957] h-full rounded-full" style={{ width: "78%" }} />
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <span className="text-[13px] font-bold text-on-surface-muted uppercase tracking-wider block">Matched</span>
                    <div className="flex flex-wrap gap-x-3 gap-y-1  text-on-surface font-semibold">
                      <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-[#4BC957]" />Figma</span>
                      <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-[#4BC957]" />Design systems</span>
                      <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-[#4BC957]" />UX research</span>
                      <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-[#4BC957]" />Prototyping</span>
                      <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-[#4BC957]" />Mobile design</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[13px] font-bold text-on-surface-muted uppercase tracking-wider block">Missing</span>
                    <span className=" text-on-surface font-bold">—</span>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[13px] font-bold text-on-surface-muted uppercase tracking-wider block">Recommended</span>
                    <div className="flex flex-wrap gap-x-3 gap-y-1  text-on-surface-muted font-semibold">
                      <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-surface-item" />Fintech experience</span>
                      <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-surface-item" />Arabic localization</span>
                      <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-surface-item" />Motion design</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={startTailoring}
                    className="flex-1 flex items-center justify-center gap-1.5 border border-[#4BC957] hover:bg-[#4BC957]/10 text-[#4BC957] text-[13px] font-bold py-3 px-3 rounded-xl transition-all active:scale-[0.98]"
                  >
                    Tailor my CV for this role
                  </button>
                  <button
                    onClick={() => { setApplyModalOpen(true); setApplyStep("review"); }}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-[#4BC957] hover:bg-[#3ab04b] text-[#0f172a] text-[13px] font-bold py-3 px-3 rounded-xl transition-all shadow-md shadow-[#4BC957]/10 active:scale-[0.98]"
                  >
                    Apply now
                  </button>
                </div>
              </div>

              {/* CV Preview */}
              <CVPreviewComponent name="Majid Al-Mansoori" email="Majid.mansoori@gmail.com" />
            </div>
          )}

          {/* STATE 2: TAILORING */}
          {rightState === "tailoring" && (
            <div className="bg-surface-card border border-surface rounded-2xl p-6 space-y-6">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#4BC957] animate-ping" />
                <h3 className=" font-bold text-on-surface-muted uppercase tracking-wider">AI is tailoring your CV...</h3>
              </div>

              <div className="space-y-4">
                {tailoringSteps.map((step) => (
                  <div key={step.id} className="flex items-center gap-3  font-semibold">
                    {step.done ? (
                      <span className="h-5 w-5 rounded-full bg-[#4BC957]/10 border border-[#4BC957]/20 text-[#4BC957] flex items-center justify-center flex-shrink-0">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                    ) : (
                      <span className="h-5 w-5 rounded-full border border-surface text-on-surface-muted flex items-center justify-center flex-shrink-0 text-[13px]">
                        {step.id}
                      </span>
                    )}
                    <span className={step.done ? "text-on-surface" : "text-on-surface-muted"}>
                      {step.text}
                    </span>
                  </div>
                ))}
              </div>

              <div className="w-full bg-surface-item h-2 rounded-full overflow-hidden">
                <div className="bg-[#4BC957] h-full rounded-full transition-all duration-300" style={{ width: `${progressWidth}%` }} />
              </div>
            </div>
          )}

          {/* STATE 3: TAILORED */}
          {rightState === "tailored" && (
            <div className="space-y-6">
              {/* Tailored Results Card */}
              <div className="bg-surface-card border border-surface rounded-2xl p-6 space-y-5">
                <div className="flex justify-between items-center">
                  <h3 className=" font-bold text-on-surface-muted uppercase tracking-wider">Updated Match</h3>
                  <span className="text-[13px] font-bold bg-[#4BC957]/15 border border-[#4BC957]/30 text-[#4BC957] px-2 py-0.5 rounded-md">Tailored CV</span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold text-on-surface tracking-tight">96%</span>
                    <span className="text-[13px] font-bold text-[#4BC957] bg-[#4BC957]/10 border border-[#4BC957]/20 px-2 py-0.5 rounded">
                      78% +18
                    </span>
                  </div>
                  <div className="w-full bg-surface-item h-2 rounded-full overflow-hidden">
                    <div className="bg-[#4BC957] h-full rounded-full" style={{ width: "96%" }} />
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <span className="text-[13px] font-bold text-on-surface-muted uppercase tracking-wider block">What changed</span>
                  <div className="space-y-2  text-on-surface font-semibold">
                    <p className="flex items-start gap-2">
                      <span className="text-[#4BC957] font-bold">+</span>
                      <span>Added keywords: Figma, Design systems, UX research</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-[#4BC957] font-bold">+</span>
                      <span>Optimised skills section for Emirates NBD</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-[#4BC957] font-bold">+</span>
                      <span>Enhanced 3 experience descriptions</span>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={startTailoring}
                    className="border border-surface hover:bg-surface-item text-on-surface py-2.5 rounded-xl text-[13px] font-bold flex items-center justify-center gap-1"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Regenerate
                  </button>
                  <button
                    onClick={() => setRightState("comparison")}
                    className="border border-surface hover:bg-surface-item text-on-surface py-2.5 rounded-xl text-[13px] font-bold flex items-center justify-center gap-1"
                  >
                    <Eye className="h-3 w-3" />
                    Compare versions
                  </button>
                  <button
                    onClick={() => setRightState("success")}
                    className="bg-[#4BC957] hover:bg-[#00B96E] text-white py-2.5 rounded-xl text-[13px] font-bold flex items-center justify-center gap-1"
                  >
                    Use tailored CV
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* CV Preview with tailored layout */}
              <CVPreviewComponent name="Majid Al-Mansoori" email="Majid.mansoori@gmail.com" tailored />
            </div>
          )}

          {/* STATE 4: COMPARISON */}
          {rightState === "comparison" && (
            <div className="bg-surface-card border border-surface rounded-2xl p-6 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className=" font-bold text-on-surface-muted uppercase tracking-wider">Side-by-side comparison</h3>
                <button
                  onClick={() => setRightState("tailored")}
                  className=" text-on-surface-muted hover:text-on-surface font-bold flex items-center gap-1 transition-colors"
                >
                  <ArrowLeft className="h-3 w-3" />
                  Back
                </button>
              </div>

              {/* Two columns stats check */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-surface-deep border border-surface space-y-3">
                  <span className="text-[13px] font-bold text-on-surface-muted uppercase tracking-wider block">Original</span>
                  <div className="text-3xl font-extrabold text-on-surface">78%</div>
                  <div className="w-full bg-surface-item h-1.5 rounded-full overflow-hidden">
                    <div className="bg-on-surface-muted h-full rounded-full" style={{ width: "78%" }} />
                  </div>
                  <p className="text-[13px] text-on-surface-muted font-semibold">Missing: —</p>
                </div>

                <div className="p-4 rounded-xl bg-surface-deep border border-[#4BC957]/25 space-y-3">
                  <span className="text-[13px] font-bold text-[#4BC957] uppercase tracking-wider block">Tailored</span>
                  <div className="text-3xl font-extrabold text-[#4BC957]">96%</div>
                  <div className="w-full bg-surface-item h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#4BC957] h-full rounded-full" style={{ width: "96%" }} />
                  </div>
                  <p className="text-[13px] text-[#4BC957] font-semibold">All required skills addressed</p>
                </div>
              </div>

              {/* Changes list */}
              <div className="space-y-3">
                <span className="text-[13px] font-bold text-on-surface-muted uppercase tracking-wider block">Changes summary</span>
                <div className="space-y-2  text-on-surface font-semibold">
                  <p className="flex items-start gap-2">
                    <span className="text-[#4BC957] font-bold">+</span>
                    <span>Added keywords aligned with Emirates NBD's job description</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-[#4BC957] font-bold">+</span>
                    <span>Re-ordered skills to lead with Figma</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-[#4BC957] font-bold">+</span>
                    <span>Re-wrote summary for the Senior Product Designer role</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setRightState("success")}
                className="w-full flex items-center justify-center gap-1.5 bg-[#4BC957] hover:bg-[#00B96E] text-white font-bold py-3 px-5 rounded-xl transition-all shadow-md shadow-[#4BC957]/10 active:scale-[0.98]"
              >
                Use tailored CV
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* STATE 5: SUCCESS / ALREADY APPLIED SCREEN */}
          {rightState === "success" && (
            <div className="bg-surface-card border border-surface rounded-2xl p-6 text-center space-y-6">
              <div className="h-12 w-12 bg-[#4BC957]/10 border border-[#4BC957]/20 rounded-full flex items-center justify-center mx-auto text-[#4BC957] shadow-lg shadow-[#4BC957]/10 animate-bounce">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-on-surface tracking-tight">Application Submitted!</h3>
                <p className=" text-on-surface-muted leading-relaxed font-semibold">
                  Your tailored CV (96% ATS match score) has been sent to Emirates NBD successfully.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-surface-deep border border-surface text-on-surface-muted font-medium leading-relaxed max-w-sm mx-auto">
                You can track this application in your Applications dashboard or check for recruiter messages in the Inbox.
              </div>

              <button
                disabled
                className="w-full bg-surface-item text-on-surface-muted border border-surface font-bold py-3 px-5 rounded-xl  flex items-center justify-center gap-2 cursor-not-allowed"
              >
                <CheckCircle2 className="h-4 w-4 text-[#4BC957]" />
                Already Applied
              </button>
            </div>
          )}

        </div>

      </div>

      {/* Apply to Job Modal */}
      {applyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setApplyModalOpen(false)}
          />

          {/* Modal */}
          <div className="relative z-10 w-full max-w-md bg-surface-card border border-surface rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-surface">
              <h2 className="text-base font-extrabold text-on-surface">Apply to job</h2>
              <button
                onClick={() => setApplyModalOpen(false)}
                className="text-on-surface-muted hover:text-on-surface transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {applyStep === "review" && (
              <>
                {/* Progress bar */}
                <div className="px-6 pt-4">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex-1 bg-surface-item h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#4BC957] h-full rounded-full" style={{ width: "100%" }} />
                    </div>
                    <span className="ml-3 text-[13px] font-bold text-on-surface">100%</span>
                  </div>
                </div>

                {/* Body */}
                <div className="overflow-y-auto flex-1 px-6 py-5 space-y-6">
                  <h3 className="text-lg font-bold text-on-surface">Review your application</h3>

                  {/* Contact Info */}
                  <div className="border-t border-surface pt-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-on-surface">Contact Info</h4>
                      <button className="text-[13px] font-semibold text-[#4BC957] hover:underline">Edit</button>
                    </div>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[13px] font-semibold text-on-surface-muted">Your name <span className="text-red-400">*</span></label>
                        <input
                          type="text"
                          placeholder="Enter name"
                          className="w-full bg-surface-item border border-surface rounded-xl px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-muted focus:outline-none focus:border-[#4BC957]/50 transition-colors"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[13px] font-semibold text-on-surface-muted">Your email <span className="text-red-400">*</span></label>
                        <input
                          type="email"
                          placeholder="Enter email"
                          className="w-full bg-surface-item border border-surface rounded-xl px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-muted focus:outline-none focus:border-[#4BC957]/50 transition-colors"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[13px] font-semibold text-on-surface-muted">Your phone <span className="text-red-400">*</span></label>
                        <input
                          type="tel"
                          placeholder="+971 50 000 0000"
                          className="w-full bg-surface-item border border-surface rounded-xl px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-muted focus:outline-none focus:border-[#4BC957]/50 transition-colors"
                        />
                      </div>
                    </div>
                  </div>


                  {/* Additional Questions */}
                  <div className="border-t border-surface pt-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-on-surface">Additional Questions</h4>
                      <button className="text-[13px] font-semibold text-[#4BC957] hover:underline">Edit</button>
                    </div>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[13px] font-semibold text-on-surface-muted">Your Age <span className="text-red-400">*</span></label>
                        <input
                          type="number"
                          placeholder=""
                          className="w-full bg-surface-item border border-surface rounded-xl px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-muted focus:outline-none focus:border-[#4BC957]/50 transition-colors"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[13px] font-semibold text-on-surface-muted">Your Expected Salary <span className="text-red-400">*</span></label>
                        <input
                          type="text"
                          placeholder=""
                          className="w-full bg-surface-item border border-surface rounded-xl px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-muted focus:outline-none focus:border-[#4BC957]/50 transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="px-6 py-4 border-t border-surface flex gap-3">
                  <button
                    onClick={() => setApplyModalOpen(false)}
                    className="flex-1 border border-surface hover:bg-surface-item text-on-surface font-bold py-3 rounded-xl text-sm transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => { setApplyStep("submitted"); setRightState("success"); }}
                    className="flex-1 bg-[#4BC957] hover:bg-[#3ab04b] text-[#0f172a] font-bold py-3 rounded-xl text-sm transition-all shadow-md shadow-[#4BC957]/10 active:scale-[0.98]"
                  >
                    Submit
                  </button>
                </div>
              </>
            )}

            {applyStep === "submitted" && (
              <div className="px-6 py-10 flex flex-col items-center text-center gap-5">
                <div className="h-14 w-14 bg-[#4BC957]/10 border border-[#4BC957]/20 rounded-full flex items-center justify-center text-[#4BC957] animate-bounce">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-extrabold text-on-surface">Application Submitted!</h3>
                  <p className="text-sm text-on-surface-muted font-medium">
                    Your application has been sent to Emirates NBD successfully.
                  </p>
                </div>
                <button
                  onClick={() => setApplyModalOpen(false)}
                  className="mt-2 bg-[#4BC957] hover:bg-[#3ab04b] text-[#0f172a] font-bold py-3 px-8 rounded-xl text-sm transition-all"
                >
                  Done
                </button>
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

// PDF CV Preview Component Reference
function CVPreviewComponent({ name, email, tailored = false }: { name: string; email: string; tailored?: boolean }) {
  return (
    <div className="bg-surface-card border border-surface rounded-2xl overflow-hidden flex flex-col">
      <div className="p-4 border-b border-surface bg-surface-deep flex justify-between items-center">
        <span className="text-[13px] font-bold text-on-surface-muted uppercase tracking-wider">CV preview • PDF</span>
        <div className="flex items-center gap-1.5">
          <button className="text-[13px] bg-surface-item hover:bg-surface border border-surface px-2 py-0.5 rounded font-bold">-</button>
          <button className="text-[13px] bg-surface-item hover:bg-surface border border-surface px-2 py-0.5 rounded font-bold">+</button>
          <button className="text-[9px] bg-surface-item hover:bg-surface border border-surface px-2.5 py-0.5 rounded font-extrabold uppercase tracking-wider">Fullscreen</button>
        </div>
      </div>

      <div className="p-6 bg-surface text-left  space-y-4">
        {/* PDF Name */}
        <div>
          <h4 className="text-sm font-extrabold text-on-surface">{name}</h4>
          <p className="text-[13px] text-on-surface-muted font-semibold mt-0.5">Product Designer • 6 yrs • Dubai, UAE • {email}</p>
        </div>

        {/* PDF Summary */}
        <div className="space-y-1">
          <span className="text-[9px] font-bold text-on-surface-muted uppercase tracking-wider block">Summary</span>
          <p className="text-[13px] text-on-surface leading-relaxed font-semibold">
            {tailored
              ? "Product designer with 6 years across fintech and consumer mobile. Strong systems thinker, comfortable shipping in fast cycles. Recently focused on Figma and Design systems for Emirates NBD-scale products."
              : "UX/UI Designer with 6 years experience in mobile wallet apps, digital banking, and telecom systems. Highly skilled in Figma, workflow systems, and cross-functional team delivery."
            }
          </p>
        </div>

        {/* PDF Skills */}
        <div className="space-y-1">
          <span className="text-[9px] font-bold text-on-surface-muted uppercase tracking-wider block">Skills</span>
          <div className="flex flex-wrap gap-1">
            {["Figma", "Prototyping", "UX research", "Design systems", "Mobile design", "Visual design"].map((skill) => (
              <span key={skill} className="bg-surface-item text-on-surface text-[9px] font-bold px-2 py-0.5 rounded border border-surface">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* PDF Experience */}
        <div className="space-y-2">
          <span className="text-[9px] font-bold text-on-surface-muted uppercase tracking-wider block">Experience</span>
          <div className="space-y-1.5 text-[13px] font-semibold">
            <div className="flex justify-between items-baseline">
              <span className="text-on-surface">Product Designer - Tabby</span>
              <span className="text-on-surface-subtle text-[9px]">2022 — Present</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-on-surface">Product Designer - Mashreq Neo</span>
              <span className="text-on-surface-subtle text-[9px]">2020 — 2022</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-on-surface">UI Designer - Souq.com</span>
              <span className="text-on-surface-subtle text-[9px]">2018 — 2020</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
