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
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#080C14] text-slate-900 dark:text-white">

      {/* Header */}
      <section className="border-b border-slate-200 dark:border-white/5 bg-white dark:bg-[#0A0F1D] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight
            animate-[fadeInUp_0.7s_ease_forwards]">
            Find your next role
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg mb-8 animate-[fadeInUp_0.7s_0.15s_ease_forwards] opacity-0">
            6 curated openings across the GCC.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 animate-[fadeInUp_0.7s_0.3s_ease_forwards] opacity-0">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400 dark:text-slate-500" />
              </div>
              <input type="text"
                className="w-full bg-slate-50 dark:bg-[#080C14] border border-slate-200 dark:border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-green-500/50 dark:focus:border-[#4BC957]/50 transition-colors"
                placeholder="Search roles, skills, companies..." />
            </div>
            <button className="bg-green-600 hover:bg-green-500 dark:bg-[#4BC957] dark:hover:bg-[#00B96E] text-white dark:text-white font-bold px-8 py-3.5 rounded-xl transition-all active:scale-[0.98] whitespace-nowrap">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Main */}
      <section className="flex-1 max-w-7xl mx-auto px-4 sm:px-8 py-10 w-full flex flex-col md:flex-row gap-8">

        {/* Sidebar */}
        <Animate className="animate-from-left w-full md:w-64 flex-shrink-0 space-y-6">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-2 text-lg">
            <Settings2 className="h-5 w-5" /> Filters
          </div>
          {[
            { title: "Requirements", items: ["Visa sponsorship", "Emiratization", "Saudization", "Remote"] },
            { title: "Location", items: ["Dubai", "Abu Dhabi", "Riyadh", "Doha", "Kuwait City"] },
            { title: "Job type", items: ["Full-time", "Contract", "Part-time", "Internship"] },
          ].map(({ title, items }) => (
            <div key={title} className="bg-white dark:bg-[#0A0F1D] border border-slate-200 dark:border-white/5 rounded-2xl p-5 shadow-sm dark:shadow-none">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">{title}</h3>
              <div className="space-y-3">
                {items.map(item => (
                  <label key={item} className="flex items-center gap-3 cursor-pointer group">
                    <div className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-600 group-hover:border-green-500 dark:group-hover:border-[#4BC957] flex items-center justify-center transition-colors" />
                    <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-300">{item}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </Animate>

        {/* Job Results */}
        <div className="flex-1">
          <Animate className="animate-on-scroll flex items-center justify-between mb-6">
            <span className="text-slate-500 dark:text-slate-400 font-medium">6 results</span>
            <Link href="/login" className="text-green-600 dark:text-[#4BC957] font-semibold hover:underline flex items-center gap-1">
              Switch to auto-apply mode &rarr;
            </Link>
          </Animate>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {jobs.map((job, idx) => (
              <Animate key={idx} className="animate-on-scroll" delay={delays[idx % 6]}>
                <div onClick={()=>router.push("/login")} className="bg-white dark:bg-[#0A0F1D] border border-slate-200 dark:border-white/5 rounded-2xl p-6 hover:border-slate-300 dark:hover:border-white/10 shadow-sm dark:shadow-none transition-colors cursor-pointer group h-full">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-slate-100 dark:bg-[#162032] border border-slate-200 dark:border-white/5 flex items-center justify-center text-sm font-bold text-slate-700 dark:text-white shrink-0">
                        {job.initials}
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{job.company}</p>
                        <h3 className="font-bold text-slate-900 dark:text-white text-lg group-hover:text-green-600 dark:group-hover:text-[#4BC957] transition-colors leading-tight">{job.role}</h3>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="bg-green-100 dark:bg-[#4BC957]/10 text-green-700 dark:text-[#4BC957] border border-green-200 dark:border-[#4BC957]/20 text-xs font-bold px-2.5 py-1 rounded-full">{job.match}</span>
                      <span className="text-xs text-slate-500 font-medium">{job.time}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-slate-600 dark:text-slate-400 mb-5">
                    <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{job.location}</span>
                    <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{job.type}</span>
                    <span className="flex items-center gap-1.5"><DollarSign className="h-3.5 w-3.5" />{job.salary}</span>
                    {job.visa && <span className="text-green-600 dark:text-[#4BC957]">✈ Visa</span>}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {job.tags.map((tag: string) => (
                      <span key={tag} className="bg-slate-100 dark:bg-[#162032] border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-300 text-[11px] font-medium px-2.5 py-1 rounded-md">{tag}</span>
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
