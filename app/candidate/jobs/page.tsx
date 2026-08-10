"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Search,
  SlidersHorizontal,
  X,
  Loader2,
  ExternalLink,
  ChevronDown,
  Sparkles,
  TrendingUp,
  ArrowUpRight,
  Zap,
  Globe,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useGetCandidateJobsQuery, type CandidateJobItem } from "@/store/authApi";
import { get403Message } from "@/lib/utils";
import SubscriptionRequiredCard from "@/components/ui/subscription-required-card";
import { motion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const EMPLOYMENT_TYPES = [
  "FULL_TIME",
  "PART_TIME",
  "CONTRACT",
  "INTERNSHIP",
  "FREELANCE",
];

const cardHover =
  "transition-all duration-300 hover:shadow-xl hover:shadow-black/5 hover:-translate-y-0.5";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, when: "beforeChildren" },
  },
};

export default function BrowseJobsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [title, setTitle] = useState(searchParams.get("title") || searchParams.get("name") || "");
  const [location, setLocation] = useState(searchParams.get("location") || searchParams.get("place") || "");
  const [company, setCompany] = useState(searchParams.get("company") || searchParams.get("company_name") || "");
  const [employmentType, setEmploymentType] = useState(searchParams.get("employment_type") || "");
  const [industry, setIndustry] = useState(searchParams.get("industry") || "");
  const [minSalary, setMinSalary] = useState(searchParams.get("min_salary") || "");
  const [maxSalary, setMaxSalary] = useState(searchParams.get("max_salary") || "");
  const [visaSponorship, setVisaSponsorship] = useState(searchParams.get("visa_sponsorship") === "true");
  const [emiratization, setEmiratization] = useState(searchParams.get("emiratization") === "true");
  const [saudization, setSaudization] = useState(searchParams.get("saudization") === "true");
  const [openToRemote, setOpenToRemote] = useState(searchParams.get("open_to_remote") === "true");
  const [skills, setSkills] = useState(searchParams.get("skills") || "");
  const [showFilters, setShowFilters] = useState(false);

  const buildQueryParams = () => {
    const params: Record<string, string | number | boolean | undefined> = {};
    if (search) params.search = search;
    if (title) params.title = title;
    if (location) params.location = location;
    if (company) params.company = company;
    if (employmentType) params.employment_type = employmentType;
    if (industry) params.industry = industry;
    if (minSalary) params.min_salary = Number(minSalary);
    if (maxSalary) params.max_salary = Number(maxSalary);
    if (visaSponorship) params.visa_sponsorship = true;
    if (emiratization) params.emiratization = true;
    if (saudization) params.saudization = true;
    if (openToRemote) params.open_to_remote = true;
    if (skills) params.skills = skills;
    return params;
  };

  const queryParams = useMemo(() => buildQueryParams(), [
    search,
    title,
    location,
    company,
    employmentType,
    industry,
    minSalary,
    maxSalary,
    visaSponorship,
    emiratization,
    saudization,
    openToRemote,
    skills,
  ]);

  const { data, isLoading, isError, error, refetch } = useGetCandidateJobsQuery(queryParams);

  const jobs = data?.data ?? [];
  const totalResults = data?.data?.length ?? 0;

  const clearFilters = () => {
    setSearch("");
    setTitle("");
    setLocation("");
    setCompany("");
    setEmploymentType("");
    setIndustry("");
    setMinSalary("");
    setMaxSalary("");
    setVisaSponsorship(false);
    setEmiratization(false);
    setSaudization(false);
    setOpenToRemote(false);
    setSkills("");
  };

  const hasActiveFilters = useMemo(() => {
    return (
      search ||
      title ||
      location ||
      company ||
      employmentType ||
      industry ||
      minSalary ||
      maxSalary ||
      visaSponorship ||
      emiratization ||
      saudization ||
      openToRemote ||
      skills
    );
  }, [
    search,
    title,
    location,
    company,
    employmentType,
    industry,
    minSalary,
    maxSalary,
    visaSponorship,
    emiratization,
    saudization,
    openToRemote,
    skills,
  ]);

  const salaryLabel = (job: CandidateJobItem) => {
    const min = job.salary_min;
    const max = job.salary_max;
    const period = job.salary_period?.toLowerCase() || "";
    if (min && max) {
      return `${job.currency} ${min.toLocaleString()} - ${max.toLocaleString()} / ${period}`;
    }
    if (min) {
      return `${job.currency} ${min.toLocaleString()}+ / ${period}`;
    }
    return "Salary not disclosed";
  };

  if (isError) {
    const msg = get403Message(error);
    if (msg) {
      return <SubscriptionRequiredCard message={msg} />;
    }
    return (
      <div className="p-6 md:p-10 space-y-8 max-w-full mx-auto">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-16 w-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
            <X className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Unable to load jobs</h2>
          <p className="text-sm text-muted-foreground mb-4 max-w-sm">
            Something went wrong while fetching job listings.
          </p>
          <button onClick={() => refetch()} className="text-sm font-semibold text-[#4BC957] hover:underline">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-full mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative"
      >
        <div className="absolute -top-4 -left-4 w-32 h-32 bg-linear-to-br from-emerald-500/20 to-blue-500/20 rounded-full blur-3xl" />
        <div className="relative flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
            <Briefcase className="h-6 w-6 text-emerald-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">Browse Jobs</h1>
        </div>
        <p className="text-muted-foreground mt-3 text-base font-medium flex items-center gap-2 ml-1">
          <TrendingUp className="h-4 w-4 text-emerald-600" />
          {isLoading ? "Searching opportunities..." : `${totalResults} active opportunities found`}
        </p>
      </motion.div>

      {/* Search and Filter Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1 group">
          <div className="absolute inset-0 bg-linear-to-r from-emerald-500/10 to-blue-500/10 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/60 group-focus-within:text-emerald-600 transition-colors" />
          <Input
            placeholder="Search by title, company, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.currentTarget.blur();
              }
            }}
            className="pl-11 h-13 rounded-2xl border-border bg-background/80 backdrop-blur-sm focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/30 text-sm font-medium shadow-sm transition-all"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="h-13 px-5 rounded-2xl border-border gap-2.5 font-bold text-sm shadow-sm hover:shadow-md transition-all"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <Badge className="bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-lg shadow-emerald-600/20">
              {Object.values(queryParams).filter(Boolean).length}
            </Badge>
          )}
        </Button>
      </motion.div>

      {/* Filters Panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative bg-card/80 backdrop-blur-sm border border-border rounded-3xl p-6 md:p-8 space-y-6 shadow-sm overflow-hidden"
        >
          <div className="absolute inset-0 bg-linear-to-br from-emerald-500/2 to-transparent pointer-events-none" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <SlidersHorizontal className="h-4 w-4 text-emerald-600" />
              </div>
              <h3 className="font-bold text-foreground">Filters</h3>
            </div>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-red-500 hover:text-red-600 text-xs font-bold gap-1.5 hover:bg-red-500/5"
              >
                <X className="h-3.5 w-3.5" />
                Clear all
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { label: "Job Title / Keyword", value: title, setter: setTitle, placeholder: "e.g. React, Python" },
              { label: "Location", value: location, setter: setLocation, placeholder: "e.g. Dubai, Remote" },
              { label: "Company", value: company, setter: setCompany, placeholder: "e.g. Qudra Technologies" },
              { label: "Industry", value: industry, setter: setIndustry, placeholder: "e.g. Technology" },
              { label: "Min Salary", value: minSalary, setter: setMinSalary, placeholder: "Min", type: "number" },
              { label: "Max Salary", value: maxSalary, setter: setMaxSalary, placeholder: "Max", type: "number" },
            ].map((field) => (
              <div key={field.label} className="space-y-2">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">{field.label}</label>
                <Input
                  type={field.type || "text"}
                  placeholder={field.placeholder}
                  value={field.value}
                  onChange={(e) => field.setter(e.target.value)}
                  className="h-11 rounded-xl border-border bg-background/60 text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/30"
                />
              </div>
            ))}

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Employment Type</label>
              <div className="relative">
                <select
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value)}
                  className="h-11 w-full rounded-xl border border-border bg-background/60 text-sm font-medium px-4 pr-10 appearance-none text-foreground focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/30 outline-none"
                >
                  <option value="">All types</option>
                  {EMPLOYMENT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Skills</label>
              <Input
                placeholder="e.g. React, TypeScript"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="h-11 rounded-xl border-border bg-background/60 text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/30"
              />
            </div>
          </div>

          {/* Boolean Filters */}
          <div className="flex flex-wrap gap-3">
            {[
              { label: "Visa Sponsorship", checked: visaSponorship, setter: setVisaSponsorship, color: "emerald" },
              { label: "Open to Remote", checked: openToRemote, setter: setOpenToRemote, color: "blue" },
              { label: "Emiratization", checked: emiratization, setter: setEmiratization, color: "violet" },
              { label: "Saudization", checked: saudization, setter: setSaudization, color: "amber" },
            ].map((filter) => (
              <button
                key={filter.label}
                onClick={() => filter.setter(!filter.checked)}
                className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-sm font-bold transition-all ${filter.checked
                  ? `bg-${filter.color}-500/10 border-${filter.color}-500/30 text-${filter.color}-600 shadow-sm`
                  : "border-border bg-background/40 text-muted-foreground hover:border-border/80"
                  }`}
              >
                <div className={`h-4 w-4 rounded-md border-2 flex items-center justify-center transition-all ${filter.checked
                  ? `bg-${filter.color}-600 border-${filter.color}-600`
                  : "border-border"
                  }`}>
                  {filter.checked && (
                    <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                {filter.label}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Loading State */}
      {isLoading && (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              custom={i}
              className="bg-card/50 border border-border/50 rounded-3xl p-6 space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-muted/70 animate-pulse" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-muted/70 rounded-lg w-3/4 animate-pulse" />
                  <div className="h-3 bg-muted/50 rounded-lg w-1/2 animate-pulse" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-muted/50 rounded-lg w-full animate-pulse" />
                <div className="h-3 bg-muted/50 rounded-lg w-2/3 animate-pulse" />
              </div>
              <div className="flex gap-2">
                <div className="h-6 bg-muted/50 rounded-lg w-16 animate-pulse" />
                <div className="h-6 bg-muted/50 rounded-lg w-20 animate-pulse" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Jobs Grid */}
      {!isLoading && !isError && (
        <>
          {jobs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative bg-card/80 backdrop-blur-sm border border-border rounded-3xl p-12 md:p-16 text-center overflow-hidden"
            >
              <div className="absolute inset-0 bg-linear-to-br from-muted/20 to-transparent pointer-events-none" />
              <div className="relative">
                <div className="w-16 h-16 rounded-3xl bg-muted/50 border border-border flex items-center justify-center mx-auto mb-5">
                  <Briefcase className="h-7 w-7 text-muted-foreground/60" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">No jobs found</h3>
                <p className="text-sm text-muted-foreground font-medium max-w-md mx-auto mb-6">
                  Try adjusting your search criteria or filters to discover more opportunities.
                </p>
                {hasActiveFilters && (
                  <Button
                    onClick={clearFilters}
                    variant="outline"
                    className="rounded-xl font-bold text-sm shadow-sm hover:shadow-md transition-all"
                  >
                    Clear all filters
                  </Button>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
            >
              {jobs.map((job: CandidateJobItem, idx: number) => (
                <motion.div
                  key={job.id}
                  variants={fadeInUp}
                  custom={idx}
                >
                  <Link
                    href={`/candidate/jobs/detail?id=${job.id}`}
                    className="block h-full"
                  >
                    <div className={`group relative bg-card/80 backdrop-blur-sm border border-border/80 rounded-3xl p-6 ${cardHover} h-full overflow-hidden`}>
                      <div className="absolute inset-0 bg-linear-to-br from-emerald-500/3 via-transparent to-blue-500/2 rounded-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="relative flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="h-12 w-12 rounded-2xl bg-linear-to-br from-emerald-500/10 to-blue-500/10 border border-border flex items-center justify-center text-sm font-bold text-foreground shrink-0 shadow-sm">
                            {
                              job.company_logo ? (
                                <img
                                  src={job.company_logo}
                                  alt={job.company_name}
                                  className="rounded-2xl object-cover object-top w-full h-full"
                                />
                              )
                                : job.company_name?.slice(0, 2).toUpperCase() || "CO"
                            }
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs text-muted-foreground font-semibold truncate">{job.company_name}</p>
                            <p className="font-bold text-foreground leading-tight group-hover:text-emerald-600 transition-colors line-clamp-1 mt-0.5">{job.title}</p>
                          </div>
                        </div>
                        {job.match_score !== null && (
                          <span className="text-[11px] font-bold px-2.5 py-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 shrink-0 shadow-sm shadow-emerald-500/5">
                            {job.match_score}% match
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground font-medium mt-4">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-muted-foreground/70" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground/70" />
                          {job.employment_type_display}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 mt-3 text-xs text-muted-foreground font-medium">
                        <DollarSign className="h-3.5 w-3.5 text-muted-foreground/70" />
                        <span className="font-semibold text-foreground">{salaryLabel(job)}</span>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-4">
                        {job.skills?.slice(0, 4).map((skill: string, si: number) => (
                          <span
                            key={si}
                            className="bg-muted/40 border border-border text-muted-foreground text-[10px] font-bold px-2.5 py-1.5 rounded-lg"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border/50">
                        {job.visa_sponsorship && (
                          <Badge variant="outline" className="text-[10px] font-bold border-emerald-500/25 text-emerald-600 bg-emerald-500/5">
                            <Zap className="h-3 w-3 mr-1" />
                            Visa
                          </Badge>
                        )}
                        {job.open_to_remote && (
                          <Badge variant="outline" className="text-[10px] font-bold border-blue-500/25 text-blue-600 bg-blue-500/5">
                            <Globe className="h-3 w-3 mr-1" />
                            Remote
                          </Badge>
                        )}
                        {job.already_applied && (
                          <Badge variant="outline" className="text-[10px] font-bold border-violet-500/25 text-violet-600 bg-violet-500/5">
                            <Sparkles className="h-3 w-3 mr-1" />
                            Applied
                          </Badge>
                        )}
                      </div>

                      <p className="text-[11px] text-muted-foreground/70 font-semibold mt-4 flex items-center gap-1.5">
                        <Clock className="h-3 w-3" />
                        {new Date(job.published_at).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
