"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  SlidersHorizontal,
  Sparkles,
  MessageSquare,
  Video,
  Clock,
  CheckCircle2,
  RefreshCw,
  RotateCcw,
  Search,
  X
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";

export default function JobApplicantsPage() {
  const [filter, setFilter] = useState("All");
  const router = useRouter();

  const [filters, setFilters] = useState({
    stages: [] as string[],
    matchMin: "",
    matchMax: "",
    location: "",
    expMin: "",
    expMax: "",
    interviewStatus: [] as string[],
    sort: "match",
  });

  const [tempFilters, setTempFilters] = useState({ ...filters });
  const [sheetOpen, setSheetOpen] = useState(false);

  const applicants = [
    {
      id: 1,
      name: "Majid Al-Mansoori",
      initials: "LM",
      role: "Senior Product Designer",
      location: "Dubai",
      exp: "7 yrs",
      match: "97%",
      stage: "New",
      interviewStatus: "Pending",
      interviewDesc: "No interview sent yet. Send one to qualify this candidate faster."
    },
    {
      id: 2,
      name: "Omar Haddad",
      initials: "OH",
      role: "Full-Stack Engineer",
      location: "Riyadh",
      exp: "5 yrs",
      match: "94%",
      stage: "AI Interview",
      interviewStatus: "Completed",
      score: "88/100",
      progress: 88
    },
    {
      id: 3,
      name: "Sara Khan",
      initials: "SK",
      role: "ML Engineer",
      location: "Remote",
      exp: "4 yrs",
      match: "91%",
      stage: "Shortlisted",
      interviewStatus: "Completed",
      score: "81/100",
      progress: 81
    },
    {
      id: 4,
      name: "Khalid Al-Otaibi",
      initials: "KO",
      role: "TA Lead",
      location: "Abu Dhabi",
      exp: "9 yrs",
      match: "88%",
      stage: "AI Interview",
      interviewStatus: "In progress",
      interviewDesc: "No interview sent yet. Send one to qualify this candidate faster."
    }
  ];

  const sorted = [...applicants].sort((a, b) => {
    if (filters.sort === "match") return parseInt(b.match) - parseInt(a.match);
    if (filters.sort === "exp") return parseInt(b.exp) - parseInt(a.exp);
    if (filters.sort === "name") return a.name.localeCompare(b.name);
    return 0;
  });

  const filtered = sorted.filter((c) => {
    if (filter !== "All" && c.stage !== filter) return false;
    if (filters.stages.length > 0 && !filters.stages.includes(c.stage)) return false;
    if (filters.matchMin && parseInt(c.match) < parseInt(filters.matchMin)) return false;
    if (filters.matchMax && parseInt(c.match) > parseInt(filters.matchMax)) return false;
    if (filters.location && !c.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
    if (filters.expMin && parseInt(c.exp) < parseInt(filters.expMin)) return false;
    if (filters.expMax && parseInt(c.exp) > parseInt(filters.expMax)) return false;
    if (filters.interviewStatus.length > 0 && !filters.interviewStatus.includes(c.interviewStatus)) return false;
    return true;
  });

  const stages = ["New", "AI Interview", "Shortlisted", "Offer"];
  const interviewStatuses = ["Pending", "In progress", "Completed"];

  const toggleStage = (stage: string) => {
    setTempFilters((prev) => ({
      ...prev,
      stages: prev.stages.includes(stage)
        ? prev.stages.filter((s) => s !== stage)
        : [...prev.stages, stage],
    }));
  };

  const toggleInterviewStatus = (status: string) => {
    setTempFilters((prev) => ({
      ...prev,
      interviewStatus: prev.interviewStatus.includes(status)
        ? prev.interviewStatus.filter((s) => s !== status)
        : [...prev.interviewStatus, status],
    }));
  };

  const applyFilters = () => {
    setFilters({ ...tempFilters });
    setSheetOpen(false);
  };

  const resetFilters = () => {
    const reset = {
      stages: [] as string[],
      matchMin: "",
      matchMax: "",
      location: "",
      expMin: "",
      expMax: "",
      interviewStatus: [] as string[],
      sort: "match",
    };
    setTempFilters({ ...reset });
    setFilters({ ...reset });
    setSheetOpen(false);
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-full mx-auto">
      {/* Top Navigation Back */}
      <div>
        <Link
          href="/company/jobs"
          className="inline-flex items-center gap-2  font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </div>

      {/* Header section matching the screenshot */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Senior Product Designer</h1>
          <p className="text-sm text-slate-400 mt-1">{filtered.length} applicant{filtered.length !== 1 ? "s" : ""} • Dubai, UAE</p>
        </div>
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger render={<button className="flex items-center gap-2 border border-slate-700/80 bg-[#0F172A] hover:bg-[#1E293B] text-slate-200 px-4 py-2 rounded-xl text-sm font-semibold transition-all active:scale-[0.98]">
            <SlidersHorizontal className="h-4 w-4 text-slate-400" />
            Filters
          </button>} />
          <SheetContent side="right" className="w-full sm:max-w-md bg-[#0F172A] border-l border-[#1E293B]/60 text-slate-200 p-0">
            <SheetHeader className="p-6 pb-0">
              <div className="flex items-center justify-between">
                <SheetTitle className="text-lg font-bold text-white">Filters</SheetTitle>
                <SheetClose render={<button className="text-slate-400 hover:text-white transition-colors">
                  <X className="h-5 w-5" />
                </button>} />
              </div>
              <p className=" text-slate-500 font-medium">Refine your applicant list</p>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Stage */}
              <div className="space-y-3">
                <h4 className=" font-bold text-slate-400 uppercase tracking-wider">Stage</h4>
                <div className="space-y-2">
                  {stages.map((stage) => (
                    <label key={stage} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={tempFilters.stages.includes(stage)}
                        onChange={() => toggleStage(stage)}
                        className="w-4 h-4 rounded border-slate-600 bg-[#131926] text-[#4BC957] focus:ring-[#4BC957] focus:ring-offset-0 cursor-pointer accent-[#4BC957]"
                      />
                      <span className="text-sm text-slate-300 group-hover:text-white transition-colors">{stage}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Match Score Range */}
              <div className="space-y-3">
                <h4 className=" font-bold text-slate-400 uppercase tracking-wider">Match Score</h4>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    placeholder="Min"
                    value={tempFilters.matchMin}
                    onChange={(e) => setTempFilters((prev) => ({ ...prev, matchMin: e.target.value }))}
                    className="w-full bg-[#131926] border border-[#2A3C58]/60 focus:border-[#4BC957] text-slate-200 placeholder-slate-500 rounded-xl px-3 py-2 text-sm focus:outline-none transition-colors"
                  />
                  <span className="text-slate-500 ">—</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={tempFilters.matchMax}
                    onChange={(e) => setTempFilters((prev) => ({ ...prev, matchMax: e.target.value }))}
                    className="w-full bg-[#131926] border border-[#2A3C58]/60 focus:border-[#4BC957] text-slate-200 placeholder-slate-500 rounded-xl px-3 py-2 text-sm focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-3">
                <h4 className=" font-bold text-slate-400 uppercase tracking-wider">Location</h4>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search location..."
                    value={tempFilters.location}
                    onChange={(e) => setTempFilters((prev) => ({ ...prev, location: e.target.value }))}
                    className="w-full bg-[#131926] border border-[#2A3C58]/60 focus:border-[#4BC957] text-slate-200 placeholder-slate-500 rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Experience Range */}
              <div className="space-y-3">
                <h4 className=" font-bold text-slate-400 uppercase tracking-wider">Experience (years)</h4>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    placeholder="Min"
                    value={tempFilters.expMin}
                    onChange={(e) => setTempFilters((prev) => ({ ...prev, expMin: e.target.value }))}
                    className="w-full bg-[#131926] border border-[#2A3C58]/60 focus:border-[#4BC957] text-slate-200 placeholder-slate-500 rounded-xl px-3 py-2 text-sm focus:outline-none transition-colors"
                  />
                  <span className="text-slate-500 ">—</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={tempFilters.expMax}
                    onChange={(e) => setTempFilters((prev) => ({ ...prev, expMax: e.target.value }))}
                    className="w-full bg-[#131926] border border-[#2A3C58]/60 focus:border-[#4BC957] text-slate-200 placeholder-slate-500 rounded-xl px-3 py-2 text-sm focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Interview Status */}
              <div className="space-y-3">
                <h4 className=" font-bold text-slate-400 uppercase tracking-wider">Interview Status</h4>
                <div className="space-y-2">
                  {interviewStatuses.map((status) => (
                    <label key={status} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={tempFilters.interviewStatus.includes(status)}
                        onChange={() => toggleInterviewStatus(status)}
                        className="w-4 h-4 rounded border-slate-600 bg-[#131926] text-[#4BC957] focus:ring-[#4BC957] focus:ring-offset-0 cursor-pointer accent-[#4BC957]"
                      />
                      <span className="text-sm text-slate-300 group-hover:text-white transition-colors">{status}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sort By */}
              <div className="space-y-3">
                <h4 className=" font-bold text-slate-400 uppercase tracking-wider">Sort By</h4>
                <select
                  value={tempFilters.sort}
                  onChange={(e) => setTempFilters((prev) => ({ ...prev, sort: e.target.value }))}
                  className="w-full bg-[#131926] border border-[#2A3C58]/60 focus:border-[#4BC957] text-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none transition-colors"
                >
                  <option value="match">Match Score</option>
                  <option value="exp">Experience</option>
                  <option value="name">Name</option>
                </select>
              </div>
            </div>

            <SheetFooter className="p-6 pt-0 border-t border-[#1E293B]/60">
              <div className="flex gap-3 w-full">
                <button
                  onClick={resetFilters}
                  className="flex items-center justify-center gap-2 border border-slate-700/80 hover:bg-slate-800/60 text-slate-300 font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors w-full"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset
                </button>
                <button
                  onClick={applyFilters}
                  className="bg-[#4BC957] hover:bg-[#00B96E] text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-all shadow-md shadow-[#4BC957]/10 active:scale-[0.98] w-full"
                >
                  Apply
                </button>
              </div>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      {/* Status Pills */}
      <div className="flex flex-wrap gap-2 pt-2">
        {["All", "New", "AI Interview", "Shortlisted", "Offer"].map((tab) => {
          const isActive = filter === tab;
          return (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={` font-bold px-4.5 py-2 rounded-full border transition-all ${isActive
                ? "bg-[#4BC957] border-[#4BC957] text-white"
                : "border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white"
                }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Applicants List */}
      {filtered.length === 0 ? (
        <div className="bg-[#0F172A] border border-[#1E293B]/60 rounded-2xl p-12 text-center">
          <p className="text-slate-500 text-sm font-medium">No applicants match your filters.</p>
          <button onClick={resetFilters} className="mt-3 text-[#4BC957]  font-semibold hover:underline">
            Reset filters
          </button>
        </div>
      ) : null}
      <div className="space-y-4">
        {filtered.map((candidate, idx) => (

          <div
            key={idx}
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/company/candidates/profile?id=${candidate.id}`);
            }}
            className="bg-[#0F172A] border border-[#1E293B]/60 rounded-2xl p-5  space-y-4 flex flex-col justify-between hover:border-[#2A3C58] transition-all duration-300 relative group cursor-pointer"
          >
            {/* Top row Info */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-[#2E3C51] flex items-center justify-center font-bold text-slate-300 text-sm shadow-inner flex-shrink-0">
                  {candidate.initials}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight group-hover:text-[#4BC957] transition-colors">{candidate.name}</h3>
                  <p className=" text-slate-500 font-semibold mt-0.5">
                    {candidate.role} <span className="text-slate-600">•</span> {candidate.location} <span className="text-slate-600">•</span> {candidate.exp}
                  </p>
                </div>
              </div>

              {/* Match and Stage Badges */}
              <div className="flex items-center gap-2">
                <span className=" font-semibold text-[#4BC957] bg-[#4BC957]/10 border border-[#4BC957]/20 px-2.5 py-0.5 rounded-lg flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  {candidate.match} match
                </span>
                <span className="text-[13px] font-bold text-slate-400 bg-[#162032] border border-[#2A3C58]/60 px-2.5 py-0.5 rounded-md">
                  Stage: {candidate.stage}
                </span>
              </div>
            </div>

            {/* AI Interview Status & Progress / Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between pt-4 border-t border-[#1E293B]/40 gap-4">
              {/* Interview Status details */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2  font-semibold">
                  <span className="text-slate-500">AI interview</span>
                  {candidate.interviewStatus === "Pending" && (
                    <span className="text-slate-400 flex items-center gap-1 text-[13px]">
                      <Clock className="h-3.5 w-3.5" />
                      Pending
                    </span>
                  )}
                  {candidate.interviewStatus === "In progress" && (
                    <span className="text-amber-400 flex items-center gap-1 text-[13px]">
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" style={{ animationDuration: '6s' }} />
                      In progress
                    </span>
                  )}
                  {candidate.interviewStatus === "Completed" && (
                    <div className="flex items-center gap-3">
                      <span className="text-[#4BC957] flex items-center gap-1 text-[13px]">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Completed
                      </span>
                      <span className="text-white font-bold text-[13px] bg-slate-800 px-2 py-0.5 rounded">
                        {candidate.score}
                      </span>
                      <button onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/company/candidates/interview/report?id=${candidate.id}`);
                      }} className="text-white hover:underline text-[13px] font-bold">
                        View report
                      </button>
                    </div>
                  )}
                </div>

                {/* Progress bar or description */}
                {candidate.interviewStatus === "Completed" && candidate.progress ? (
                  <div className="w-full max-w-md bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#4BC957] h-full rounded-full" style={{ width: `${candidate.progress}%` }} />
                  </div>
                ) : (
                  <p className=" text-slate-500 leading-relaxed font-medium">{candidate.interviewDesc}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/company/inbox?user_id=${candidate.id}`);


                }} className="flex items-center gap-1.5 border border-slate-700/80 hover:bg-slate-800 text-slate-300 px-4 py-2 rounded-xl  font-bold transition-all active:scale-[0.98]">
                  <MessageSquare className="h-3.5 w-3.5 text-slate-400" />
                  Message
                </button>
                <button onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/company/candidates/${candidate.id}/interview`);
                }} className="flex items-center gap-1.5 bg-[#4BC957] hover:bg-[#00B96E] text-white font-bold px-4 py-2 rounded-xl  transition-all shadow-md shadow-[#4BC957]/10 active:scale-[0.98]">
                  <Video className="h-3.5 w-3.5" />
                  Set AI interview
                </button>
              </div>
            </div>
          </div>


        ))}
      </div>
    </div>
  );
}
