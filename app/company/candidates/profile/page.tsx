"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  MessageSquare,
  Video,
  Star,
  MapPin,
  Briefcase,
  Clock,
  Mail,
  Phone,
  FileText,
  Download,
  Languages,
  Globe,
  Award,
  Sparkles,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import {
  useGetCompanyCandidateDetailQuery,
  type CandidateDetail,
} from "@/store/authApi";
import { get403Message } from "@/lib/utils";

function CandidateProfileInner() {
  const searchParams = useSearchParams();
  const candidateId = searchParams.get("id");
  const [status, setStatus] = useState("New");

  const {
    data,
    isLoading,
    isError,
    error,
  } = useGetCompanyCandidateDetailQuery(Number(candidateId), {
    skip: !candidateId,
  });

  const candidate: CandidateDetail | undefined = data?.data;

  if (!candidateId) {
    return (
      <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-full mx-auto">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">No candidate selected</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Please select a candidate from the list to view their profile.
          </p>
          <Link
            href="/company/candidates"
            className="text-sm font-semibold text-[#4BC957] hover:underline"
          >
            Browse candidates
          </Link>
        </div>
      </div>
    );
  }

  if (isError) {
    const msg = get403Message(error);
    return (
      <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-full mx-auto">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-16 w-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">{msg ? "Access Denied" : "Failed to load profile"}</h2>
          <p className="text-sm text-muted-foreground mb-4 max-w-sm">
            {msg || "Something went wrong while fetching the candidate profile."}
          </p>
          {!msg && (
            <button
              onClick={() => window.location.reload()}
              className="text-sm font-semibold text-[#4BC957] hover:underline"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  const initials = candidate
    ? candidate.name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "??";

  const matchDisplay = candidate?.match_score !== null && candidate?.match_score !== undefined
    ? `${candidate.match_score}%`
    : "N/A";

  const experienceLevel = candidate?.experience_level ?? "N/A";

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-full mx-auto">
      {/* Back button */}
      <div>
        <Link
          href="/company/candidates"
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </div>

      {/* Profile Header Card */}
      <div className="bg-card border border-border rounded-2xl p-4 md:p-6 space-y-6 shadow-sm">
        {isLoading ? (
          <div className="flex items-center gap-5">
            <div className="h-20 w-20 rounded-full bg-muted border-2 border-border animate-pulse" />
            <div className="space-y-3 flex-1">
              <div className="h-6 w-48 bg-muted rounded animate-pulse" />
              <div className="h-4 w-64 bg-muted rounded animate-pulse" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="h-20 w-20 rounded-full bg-muted border-2 border-border flex items-center justify-center font-extrabold text-foreground text-3xl shadow-lg">
                {initials}
              </div>
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-extrabold text-foreground tracking-tight">{candidate?.name}</h1>
                  <span className="text-sm font-semibold text-[#4BC957] bg-[#4BC957]/10 border border-[#4BC957]/20 px-2.5 py-0.5 rounded-lg flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5" />
                    {matchDisplay} match
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm font-semibold text-muted-foreground">
                  <span className="flex items-center gap-1.5"><Briefcase className="h-4 w-4" /> {candidate?.role_title}</span>
                  <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {candidate?.location}</span>
                  <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {candidate?.years_experience ?? 0} yrs exp</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 self-start md:self-center">
              <Link href={`/company/inbox?user_id=${candidate?.id}`} className="flex items-center gap-1.5 border border-border hover:bg-muted text-foreground px-4 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-[0.98]">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                Message
              </Link>
              <Link href={`/company/candidates/interview?id=${candidate?.id}`} className="flex items-center gap-1.5 bg-[#4BC957] hover:bg-[#00B96E] text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-all shadow-md shadow-[#4BC957]/10 active:scale-[0.98]">
                <Video className="h-4 w-4" />
                Set AI interview
              </Link>
            </div>
          </div>
        )}

        {/* Status Row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-5 border-t border-border gap-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Set status:</span>
            {[
              { label: "Shortlisted", active: status === "Shortlisted" },
              { label: "Hired", active: status === "Hired" },
              { label: "Rejected", active: status === "Rejected" }
            ].map((btn) => (
              <button
                key={btn.label}
                onClick={() => setStatus(btn.label)}
                className={`text-sm font-bold px-4 py-2 rounded-xl border transition-all ${btn.active
                  ? "bg-[#4BC957]/10 border-[#4BC957] text-[#4BC957]"
                  : "border-border text-muted-foreground hover:border-border/80 hover:text-foreground"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
          <div className="text-sm text-muted-foreground font-semibold">
            Current: <span className="text-foreground font-bold">{status}</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Preferences Column */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 space-y-6 shadow-sm">
          <h2 className="text-lg font-bold text-foreground">Preferences</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: "Role", value: candidate?.role_title ?? "N/A", icon: Briefcase },
              { title: "Industry", value: candidate?.industry ?? "N/A", icon: Globe },
              { title: "Location", value: candidate?.location ?? "N/A", icon: MapPin },
              { title: "Experience Level", value: experienceLevel, icon: Award },
              { title: "Notice period", value: "N/A", icon: Clock },
              { title: "Languages", value: "N/A", icon: Languages }
            ].map((pref, idx) => (
              <div key={idx} className="bg-background border border-border rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  <pref.icon className="h-3.5 w-3.5" />
                  {pref.title}
                </div>
                <p className="text-sm font-bold text-foreground">{pref.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact */}
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-sm">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Contact</h3>
            <div className="space-y-3.5 text-sm font-semibold text-foreground">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="truncate">{candidate?.email ?? "N/A"}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                <span>{candidate?.phone_whatsapp ?? "N/A"}</span>
              </div>
            </div>
          </div>

          {/* Top Skills */}
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-sm">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Top skills</h3>
            <div className="flex flex-wrap gap-2">
              {(candidate?.skills ?? []).slice(0, 10).map((skill) => (
                <span
                  key={skill}
                  className="bg-muted border border-border text-foreground text-sm font-bold px-3 py-1.5 rounded-lg"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* AI Interview */}
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-sm">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">AI interview</h3>
            <p className="text-sm text-muted-foreground leading-relaxed font-medium">
              View the candidate's AI interview performance and rubric breakdown.
            </p>
            <Link href={`/company/interviews?candidate_id=${candidate?.id}`} className="w-full text-sm flex justify-center border border-border hover:bg-muted text-foreground font-bold py-2.5 rounded-xl transition-colors">
              View report
            </Link>
          </div>
        </div>
      </div>

      {/* Resume Section */}
      <div className="bg-card border border-border rounded-2xl p-6 space-y-5 shadow-sm">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-foreground">Resume</h2>
          {candidate?.cv && (
            <a
              href={candidate.cv}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 border border-border hover:bg-muted text-foreground px-4 py-2 rounded-xl text-sm font-bold transition-all"
            >
              <Download className="h-3.5 w-3.5 text-muted-foreground" />
              Download CV
            </a>
          )}
        </div>

        {candidate?.cv && (
          <div className="flex items-center justify-between bg-background border border-border rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#4BC957]/10 text-[#4BC957] border border-[#4BC957]/20 rounded-xl">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">
                  {candidate.name.replace(/\s+/g, "_")}_CV.pdf
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">Uploaded • Parsed by AI</p>
              </div>
            </div>
            <a
              href={candidate.cv}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold text-[#4BC957] hover:underline px-3 py-1.5"
            >
              View
            </a>
          </div>
        )}
      </div>

      {/* About Me Section */}
      {candidate?.about_me && (
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-sm">
          <h2 className="text-lg font-bold text-foreground">About</h2>
          <p className="text-sm text-muted-foreground leading-relaxed font-medium whitespace-pre-wrap">
            {candidate.about_me}
          </p>
        </div>
      )}

      {/* Experience Section */}
      <div className="bg-card border border-border rounded-2xl p-6 space-y-6 shadow-sm">
        <h2 className="text-lg font-bold text-foreground">Experience</h2>
        {candidate?.experiences && candidate.experiences.length > 0 ? (
          <div className="space-y-6 pl-4 border-l-2 border-border">
            {candidate.experiences.map((exp) => (
              <div key={exp.id} className="relative space-y-1.5">
                <div className="absolute -left-[23px] top-1.5 h-3 w-3 rounded-full bg-[#4BC957] border-2 border-card" />
                <h3 className="text-base font-bold text-foreground tracking-tight">
                  {exp.job_title} <span className="text-[#4BC957] font-normal">•</span> {exp.company}
                </h3>
                <p className="text-sm text-[#4BC957] font-semibold">
                  {exp.start_date ? new Date(exp.start_date).getFullYear() : ""}
                  {exp.start_date && exp.end_date ? " — " : ""}
                  {exp.is_current ? "Present" : exp.end_date ? new Date(exp.end_date).getFullYear() : ""}
                </p>
                <p className="text-sm text-muted-foreground font-medium leading-relaxed mt-1">{exp.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No experience information available.</p>
        )}
      </div>

      {/* Education Section */}
      <div className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-sm">
        <h2 className="text-lg font-bold text-foreground">Education</h2>
        {candidate?.educations && candidate.educations.length > 0 ? (
          <div className="space-y-4">
            {candidate.educations.map((edu) => (
              <div key={edu.id} className="space-y-1">
                <h3 className="text-base font-bold text-foreground">{edu.degree} {edu.field_of_study}</h3>
                <p className="text-sm text-muted-foreground font-semibold">
                  {edu.school} • {edu.start_year ? new Date(edu.start_year).getFullYear() : ""}{edu.start_year && edu.end_year ? " — " : ""}{edu.end_year ? new Date(edu.end_year).getFullYear() : "Present"}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No education information available.</p>
        )}
      </div>

      {/* Loading overlay for initial load */}
      {isLoading && (
        <div className="fixed inset-0 bg-background/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="flex items-center gap-3 bg-card border border-border rounded-2xl px-6 py-4 shadow-xl">
            <Loader2 className="h-5 w-5 animate-spin text-[#4BC957]" />
            <span className="text-sm font-bold text-foreground">Loading profile...</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CandidateProfilePage() {
  return (
    <Suspense fallback={
      <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-full mx-auto">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-[#4BC957]" />
        </div>
      </div>
    }>
      <CandidateProfileInner />
    </Suspense>
  );
}
