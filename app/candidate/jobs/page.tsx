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
} from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useGetCandidateJobsQuery, type CandidateJobItem } from "@/store/authApi";
import { motion } from "framer-motion";
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

  const { data, isLoading, isError, refetch } = useGetCandidateJobsQuery(queryParams);

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

  const salaryLabel = (job: (typeof jobs)[0]) => {
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

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-full mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight">
          Browse Jobs
        </h1>
        <p className="text-sm text-on-surface-muted mt-1 font-medium">
          {isLoading ? "Searching jobs..." : `${totalResults} active jobs found`}
        </p>
      </motion.div>

      {/* Search and Filter Toggle */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-subtle" />
          <Input
            placeholder="Search by title, company, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-11 rounded-xl border-border bg-surface-deep focus:ring-2 focus:ring-[#23C65F]/40"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="h-11 px-4 rounded-xl border-border gap-2 font-semibold text-sm"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <Badge className="bg-[#23C65F] text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
              {Object.values(queryParams).filter(Boolean).length}
            </Badge>
          )}
        </Button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-surface-card border border-border rounded-2xl p-5 space-y-4 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-on-surface text-sm">Filters</h3>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-red-500 hover:text-red-600 text-xs font-semibold gap-1"
              >
                <X className="h-3.5 w-3.5" />
                Clear all
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-on-surface-muted">Job Title / Keyword</label>
              <Input
                placeholder="e.g. React, Python"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-10 rounded-lg border-border bg-surface-deep text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-on-surface-muted">Location</label>
              <Input
                placeholder="e.g. Dubai, Remote"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="h-10 rounded-lg border-border bg-surface-deep text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-on-surface-muted">Company</label>
              <Input
                placeholder="e.g. Qudra Technologies"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="h-10 rounded-lg border-border bg-surface-deep text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-on-surface-muted">Employment Type</label>
              <div className="relative">
                <select
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value)}
                  className="h-10 w-full rounded-lg border border-border bg-surface-deep text-sm px-3 pr-8 appearance-none text-on-surface focus:ring-2 focus:ring-[#23C65F]/40 outline-none"
                >
                  <option value="">All types</option>
                  {EMPLOYMENT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-subtle pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-on-surface-muted">Min Salary</label>
              <Input
                type="number"
                placeholder="Min"
                value={minSalary}
                onChange={(e) => setMinSalary(e.target.value)}
                className="h-10 rounded-lg border-border bg-surface-deep text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-on-surface-muted">Max Salary</label>
              <Input
                type="number"
                placeholder="Max"
                value={maxSalary}
                onChange={(e) => setMaxSalary(e.target.value)}
                className="h-10 rounded-lg border-border bg-surface-deep text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-on-surface-muted">Industry</label>
              <Input
                placeholder="e.g. Technology"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="h-10 rounded-lg border-border bg-surface-deep text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-on-surface-muted">Skills (comma separated)</label>
              <Input
                placeholder="e.g. React, TypeScript"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="h-10 rounded-lg border-border bg-surface-deep text-sm"
              />
            </div>
          </div>

          {/* Boolean Filters */}
          <div className="flex flex-wrap gap-3">
            {[
              { label: "Visa Sponsorship", checked: visaSponorship, setter: setVisaSponsorship },
              { label: "Open to Remote", checked: openToRemote, setter: setOpenToRemote },
              { label: "Emiratization", checked: emiratization, setter: setEmiratization },
              { label: "Saudization", checked: saudization, setter: setSaudization },
            ].map((filter) => (
              <label
                key={filter.label}
                className="flex items-center gap-2 cursor-pointer select-none"
              >
                <div
                  className={`h-5 w-5 rounded-md border-2 flex items-center justify-center transition-all ${
                    filter.checked
                      ? "bg-[#23C65F] border-[#23C65F]"
                      : "border-border bg-surface-deep"
                  }`}
                  onClick={() => filter.setter(!filter.checked)}
                >
                  {filter.checked && (
                    <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="text-sm font-medium text-on-surface">{filter.label}</span>
              </label>
            ))}
          </div>
        </motion.div>
      )}

      {/* Error State */}
      {isError && (
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 text-center">
          <p className="text-sm font-medium text-red-600 dark:text-red-400">
            Failed to load jobs. Please try again.
          </p>
          <Button
            onClick={() => refetch()}
            variant="outline"
            size="sm"
            className="mt-3 rounded-lg"
          >
            Retry
          </Button>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-surface-card border border-border rounded-2xl p-5 space-y-3 animate-pulse"
            >
              <div className="h-6 bg-muted rounded-lg w-3/4" />
              <div className="h-4 bg-muted rounded-lg w-1/2" />
              <div className="h-4 bg-muted rounded-lg w-full" />
              <div className="flex gap-2">
                <div className="h-6 bg-muted rounded-full w-16" />
                <div className="h-6 bg-muted rounded-full w-20" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Jobs Grid */}
      {!isLoading && !isError && (
        <>
          {jobs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-surface-card border border-border rounded-2xl p-12 text-center"
            >
              <Briefcase className="h-12 w-12 text-on-surface-subtle mx-auto mb-4" />
              <h3 className="text-lg font-bold text-on-surface mb-1">No jobs found</h3>
              <p className="text-sm text-on-surface-muted font-medium max-w-md mx-auto">
                Try adjusting your search criteria or filters to find more opportunities.
              </p>
              {hasActiveFilters && (
                <Button
                  onClick={clearFilters}
                  variant="outline"
                  className="mt-4 rounded-lg font-semibold text-sm"
                >
                  Clear all filters
                </Button>
              )}
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {jobs.map((job: CandidateJobItem, idx: number) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04, duration: 0.3 }}
                >
                  <Link
                    href={`/candidate/jobs/detail?id=${job.id}`}
                    className="block h-full"
                  >
                    <div className="bg-surface-card border border-border rounded-2xl p-5 space-y-3 hover:border-[#23C65F]/40 hover:shadow-md transition-all cursor-pointer group h-full">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="h-10 w-10 rounded-xl bg-surface-item border border-surface flex items-center justify-center text-sm font-bold text-on-surface flex-shrink-0">
                            {job.company_name?.slice(0, 2).toUpperCase() || "CO"}
                          </div>
                          <div className="min-w-0">
                            <p className="text-[13px] text-on-surface-muted font-semibold truncate">
                              {job.company_name}
                            </p>
                            <p className="font-bold text-on-surface leading-tight group-hover:text-[#23C65F] transition-colors line-clamp-1">
                              {job.title}
                            </p>
                          </div>
                        </div>
                        {job.match_score !== null && (
                          <span className="text-[12px] font-bold px-2 py-0.5 rounded-md border flex-shrink-0 bg-[#23C65F]/10 text-[#23C65F] border-[#23C65F]/20">
                            {job.match_score}% match
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-on-surface-muted font-medium">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-on-surface-subtle" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-on-surface-subtle" />
                          {job.employment_type_display}
                        </span>
                      </div>

                      <p className="text-[13px] text-on-surface-muted font-medium flex items-center gap-1">
                        <DollarSign className="h-3 w-3 text-on-surface-subtle" />
                        {salaryLabel(job)}
                      </p>

                      <div className="flex flex-wrap gap-1.5">
                        {job.skills?.slice(0, 4).map((skill: string, si: number) => (
                          <span
                            key={si}
                            className="bg-surface-item border border-surface text-on-surface-subtle text-[11px] font-semibold px-2 py-0.5 rounded-md"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-2 pt-1">
                        {job.visa_sponsorship && (
                          <Badge variant="outline" className="text-[11px] font-semibold border-[#23C65F]/30 text-[#23C65F]">
                            Visa
                          </Badge>
                        )}
                        {job.open_to_remote && (
                          <Badge variant="outline" className="text-[11px] font-semibold border-blue-500/30 text-blue-500">
                            Remote
                          </Badge>
                        )}
                        {job.already_applied && (
                          <Badge variant="outline" className="text-[11px] font-semibold border-purple-500/30 text-purple-500">
                            Applied
                          </Badge>
                        )}
                      </div>

                      <p className="text-[12px] text-on-surface-subtle font-medium pt-1">
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
            </div>
          )}
        </>
      )}
    </div>
  );
}
