"use client";

import React from "react";
import Link from "next/link";
import { Search, MapPin, Clock, DollarSign, Settings2 } from "lucide-react";
import { Animate } from "@/components/ui/animate";
import { useRouter } from "next/navigation";

const jobs = Array(6).fill({
  company: "Emirates NBD", initials: "ENB", role: "Senior Product Designer",
  location: "Dubai, UAE", type: "Full-time", salary: "AED 28k-35k",
  visa: true, match: "96% match", time: "2d ago",
  tags: ["Figma", "Design system", "Ux research", "Fintech", "Emiratization"],
});

const delays = ["", "anim-delay-100", "anim-delay-200", "anim-delay-300", "anim-delay-400", "anim-delay-500"];

export default function JobsPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">

      {/* Header */}
      <section className="border-b border-surface bg-surface-deep py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <h1 className="text-xl sm:text-2xl md:text-4xl font-extrabold text-on-surface mb-2 tracking-tight
            animate-[fadeInUp_0.7s_ease_forwards]">
            Find your next role
          </h1>
          <p className="text-on-surface-muted text-sm sm:text-base mb-6 animate-[fadeInUp_0.7s_0.15s_ease_forwards] opacity-0">
            6 curated openings across the GCC.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 animate-[fadeInUp_0.7s_0.3s_ease_forwards] opacity-0">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-on-surface-muted" />
              </div>
              <input type="text"
                className="w-full bg-surface-deep border border-surface rounded-xl py-3 pl-11 pr-4 text-on-surface placeholder:text-on-surface-subtle focus:outline-none focus:border-[#4BC957]/50 transition-colors min-h-[44px]"
                placeholder="Search roles, skills, companies..." />
            </div>
            <button className="bg-[#4BC957] hover:bg-[#00B96E] text-white font-bold px-6 sm:px-8 py-3 rounded-xl transition-all active:scale-[0.98] whitespace-nowrap min-h-[44px] text-sm">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Main */}
      <section className="flex-1 max-w-7xl mx-auto px-4 sm:px-8 py-6 md:py-10 w-full flex flex-col md:flex-row gap-6">

        {/* Sidebar */}
        <Animate className="animate-from-left w-full md:w-64 flex-shrink-0 space-y-4 sm:space-y-6">
          <div className="flex items-center gap-2 font-bold text-on-surface mb-2 text-lg">
            <Settings2 className="h-5 w-5" /> Filters
          </div>
          {[
            { title: "Requirements", items: ["Visa sponsorship", "Emiratization", "Saudization", "Remote"] },
            { title: "Location", items: ["Dubai", "Abu Dhabi", "Riyadh", "Doha", "Kuwait City"] },
            { title: "Job type", items: ["Full-time", "Contract", "Part-time", "Internship"] },
          ].map(({ title, items }) => (
            <div key={title} className="bg-surface-card border border-surface rounded-2xl p-4 sm:p-5 shadow-sm">
              <h3 className="font-bold text-on-surface mb-3 sm:mb-4 text-sm">{title}</h3>
              <div className="space-y-2.5 sm:space-y-3">
                {items.map(item => (
                  <label key={item} className="flex items-center gap-3 cursor-pointer group min-h-[44px]">
                    <div className="w-5 h-5 rounded-full border border-surface group-hover:border-[#4BC957] flex items-center justify-center transition-colors shrink-0" />
                    <span className="text-sm text-on-surface-muted group-hover:text-on-surface transition-colors">{item}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </Animate>

        {/* Job Results */}
        <div className="flex-1">
          <Animate className="animate-on-scroll flex items-center justify-between mb-4 sm:mb-6">
            <span className="text-on-surface-muted font-medium text-sm">6 results</span>
            <Link href="/login" className="text-[#4BC957] font-semibold hover:underline flex items-center gap-1 text-sm">
              Switch to auto-apply mode &rarr;
            </Link>
          </Animate>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
            {jobs.map((job, idx) => (
              <Animate key={idx} className="animate-on-scroll" delay={delays[idx % 6]}>
                <div onClick={()=>router.push("/login")} className="bg-surface-card border border-surface rounded-2xl p-5 sm:p-6 hover:border-surface transition-colors cursor-pointer group h-full min-h-[44px]">
                  <div className="flex justify-between items-start mb-3 sm:mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-surface-item border border-surface flex items-center justify-center text-sm font-bold text-on-surface shrink-0">
                        {job.initials}
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-on-surface-muted font-medium">{job.company}</p>
                        <h3 className="font-bold text-on-surface text-sm sm:text-lg group-hover:text-[#4BC957] transition-colors leading-tight">{job.role}</h3>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="bg-accent-tint border border-accent text-[#4BC957] text-xs font-bold px-2.5 py-1 rounded-full">{job.match}</span>
                      <span className="text-xs text-on-surface-subtle font-medium">{job.time}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-2 text-xs sm:text-sm font-medium text-on-surface-muted mb-4 sm:mb-5">
                    <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{job.location}</span>
                    <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{job.type}</span>
                    <span className="flex items-center gap-1.5"><DollarSign className="h-3.5 w-3.5" />{job.salary}</span>
                    {job.visa && <span className="text-[#4BC957]">✈ Visa</span>}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {job.tags.map((tag: string) => (
                      <span key={tag} className="bg-surface-item border border-surface text-on-surface-muted text-[10px] sm:text-[11px] font-medium px-2.5 py-1 rounded-md">{tag}</span>
                    ))}
                  </div>
                </div>
              </Animate>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
