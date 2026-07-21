"use client";

import React from "react";
import { Sparkles, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import type { CompanyCandidate } from "@/store/authApi";

export interface CandidateCardProps {
  candidate: CompanyCandidate;
}

export default function CandidateCard({ candidate }: CandidateCardProps) {
  const initials = candidate.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="bg-card border border-border rounded-2xl p-5 space-y-4 flex flex-col justify-between hover:border-[#4BC957]/30 transition-all duration-300 relative group cursor-pointer shadow-sm">
      {/* Top row: Avatar, Name, Role, Match score */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-muted border border-border flex items-center justify-center font-bold text-foreground text-sm shadow-inner flex-shrink-0">
            {initials}
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground tracking-tight">
              {candidate.name}
            </h3>
            <p className="text-sm text-muted-foreground font-medium">
              {candidate.role_title}
            </p>
          </div>
        </div>
        <span className="text-sm font-semibold text-[#4BC957] bg-[#4BC957]/10 border border-[#4BC957]/20 px-2.5 py-0.5 rounded-lg flex items-center gap-1">
          <Sparkles className="h-3 w-3" />
          {candidate.match_score !== null && candidate.match_score !== undefined
            ? `${candidate.match_score}%`
            : "N/A"}
        </span>
      </div>

      {/* Meta info */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground font-medium">
        <span>{candidate.industry}</span>
        <span className="hidden sm:inline text-border">|</span>
        <span>{candidate.location}</span>
      </div>

      {/* Experience & Personal Info */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground font-medium">
        <span>
          {candidate.years_experience} yrs experience
          {candidate.experience_level && (
            <span className="ml-1.5 text-[#4BC957]">
              ({candidate.experience_level})
            </span>
          )}
        </span>
        <span className="hidden sm:inline text-border">|</span>
        <span>
          Age:{" "}
          {candidate.age !== null && candidate.age !== undefined
            ? candidate.age
            : "N/A"}
        </span>
        <span className="hidden sm:inline text-border">|</span>
        <span>
          Gender:{" "}
          {candidate.gender ? candidate.gender : "N/A"}
        </span>
      </div>

      {/* Skills Badges */}
      <div className="flex flex-wrap gap-1.5">
        {candidate.skills.map((skill, sIdx) => (
          <span
            key={sIdx}
            className="bg-muted border border-border text-muted-foreground text-[13px] font-semibold px-2.5 py-1 rounded-md"
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Unlock Status */}
      <div className="flex items-center gap-2 text-sm">
        {candidate.is_unlocked ? (
          <Badge
            variant="outline"
            className="bg-[#4BC957]/10 text-[#4BC957] border-[#4BC957]/20"
          >
            Unlocked
          </Badge>
        ) : (
          <Badge variant="outline" className="bg-muted text-muted-foreground">
            <Lock className="h-3 w-3 mr-1" />
            {candidate.unlock_cost} credits
          </Badge>
        )}
      </div>

      {/* Footer actions */}
      <div className="flex items-center gap-2 pt-1.5 flex-wrap">
        <Link
          href={`/company/candidates/profile?id=${candidate.id}`}
          className="flex-1 bg-[#4BC957] hover:bg-[#00B96E] text-white font-bold py-2.5 px-4 rounded-xl text-sm flex items-center justify-center gap-1.5 transition-all shadow-md shadow-[#4BC957]/5 active:scale-[0.98]"
        >
          <Lock className="h-3.5 w-3.5" />
          View profile
        </Link>
        <Link
          href={`/company/inbox?id=${candidate.id}`}
          className="p-2.5 bg-muted border border-border text-muted-foreground hover:text-foreground rounded-xl hover:border-[#4BC957]/40 transition-colors"
        >
          Message
        </Link>
        <Link
          href={`/company/candidates/interview?id=${candidate.id}`}
          className="p-2.5 bg-muted border border-border text-muted-foreground hover:text-foreground rounded-xl hover:border-[#4BC957]/40 transition-colors"
        >
          Interview
        </Link>
      </div>
    </div>
  );
}
