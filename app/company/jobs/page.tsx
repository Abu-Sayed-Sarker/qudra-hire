"use client";

import React from "react";
import {
  Plus,
  MoreVertical,
  Eye,
  Pencil,
  Trash2,
  Users,
  Loader2,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
  Briefcase,
  MapPin,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Skeleton,
  SkeletonTable,
} from "@/components/ui/skeleton-cards";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import {
  useGetCompanyJobsQuery,
  useDeleteCompanyJobMutation,
  type CompanyJob,
} from "@/store/authApi";
import { get403Message } from "@/lib/utils";
import SubscriptionRequiredCard from "@/components/ui/subscription-required-card";
import { motion, type Variants } from "framer-motion";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, when: "beforeChildren" },
  },
};

const cardHover =
  "transition-all duration-300 hover:shadow-xl hover:shadow-black/5 hover:-translate-y-0.5";

export default function JobsPage() {
  const router = useRouter();
  const { data, isLoading, isError, error, refetch } = useGetCompanyJobsQuery();
  const [deleteJob] = useDeleteCompanyJobMutation();

  const jobs: CompanyJob[] = data?.data ?? [];

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
            Something went wrong while fetching your job listings.
          </p>
          <button onClick={() => refetch()} className="text-sm font-semibold text-[#4BC957] hover:underline">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      await deleteJob(id);
    }
  };

  const statusColor = (status: string) => {
    const map: Record<string, string> = {
      ACTIVE: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
      DRAFT: "bg-amber-500/10 text-amber-600 border-amber-500/20",
      CLOSED: "bg-muted text-muted-foreground border-border",
      PAUSED: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    };
    return map[status] ?? "bg-muted text-muted-foreground border-border";
  };

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-full mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative flex flex-col sm:flex-row justify-between items-start sm:items-end gap-5"
      >
        <div className="absolute -top-6 -left-6 w-32 h-32 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
              <Briefcase className="h-5 w-5 text-emerald-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">Manage Jobs</h1>
          </div>
          <p className="text-muted-foreground mt-2 text-base font-medium flex items-center gap-2 ml-1">
            <TrendingUp className="h-4 w-4 text-emerald-600" />
            Post, monitor and close listings
          </p>
        </div>
        <Link
          href="/company/jobs/create"
          className="inline-flex items-center justify-center gap-2 bg-foreground hover:bg-foreground/90 text-background font-bold px-6 py-3.5 rounded-2xl transition-all duration-200 shadow-lg shadow-foreground/10 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-foreground/50 focus-visible:ring-offset-2"
          aria-label="Create a new job posting"
        >
          <Plus className="h-5 w-5" />
          Post a job
          <ArrowUpRight className="h-4 w-4 opacity-60" />
        </Link>
      </motion.div>

      {/* Jobs Container */}
      {!isError && (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="relative bg-card/80 backdrop-blur-sm border border-border rounded-3xl overflow-hidden shadow-sm"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.02] to-transparent pointer-events-none" />

          {/* Mobile card view */}
          <div className="block md:hidden divide-y divide-border/60">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="p-5 space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-muted/70 rounded-lg w-3/4 animate-pulse" />
                        <div className="h-3 bg-muted/50 rounded-lg w-1/2 animate-pulse" />
                      </div>
                      <div className="h-6 bg-muted/70 rounded-full w-20 animate-pulse" />
                    </div>
                    <div className="h-3 bg-muted/50 rounded-lg w-32 animate-pulse" />
                    <div className="flex items-center justify-between">
                      <div className="h-3 bg-muted/50 rounded-lg w-24 animate-pulse" />
                      <div className="h-8 w-8 bg-muted/70 rounded-xl animate-pulse" />
                    </div>
                  </div>
                ))
              : jobs.map((job) => (
                  <motion.div
                    key={job.id}
                    className={`p-5 space-y-3 ${cardHover}`}
                    variants={fadeInUp}
                    custom={job.id}
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-foreground text-sm leading-tight truncate">{job.title}</h3>
                        <p className="text-muted-foreground text-xs font-medium mt-1">{job.location}</p>
                      </div>
                      <span className={`inline-flex items-center border px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap ${statusColor(job.job_status)}`}>
                        {job.job_status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground font-medium">
                        <strong className="text-foreground font-extrabold">{job.applications_count}</strong> applicants
                      </span>
                      <span className="font-bold text-emerald-600 flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5" />
                        {job.ai_matches_count} matches
                      </span>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="inline-flex items-center justify-center border border-border bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground w-9 h-9 rounded-xl transition-all active:scale-[0.98]" aria-label="Job options">
                          <MoreVertical className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44 bg-card border border-border text-foreground shadow-xl rounded-2xl">
                          <DropdownMenuItem onClick={() => router.push(`/company/jobs/view?id=${job.id}`)} className="cursor-pointer gap-2.5 px-3 py-2.5 rounded-xl">
                            <Eye className="h-4 w-4" /> View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(`/company/jobs/edit?id=${job.id}`)} className="cursor-pointer gap-2.5 px-3 py-2.5 rounded-xl">
                            <Pencil className="h-4 w-4" /> Request edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(`/company/jobs/applicants?id=${job.id}`)} className="cursor-pointer gap-2.5 px-3 py-2.5 rounded-xl">
                            <Users className="h-3.5 w-3.5 text-muted-foreground" /> Applicants
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(job.id, job.title)} className="cursor-pointer gap-2.5 px-3 py-2.5 rounded-xl text-red-500 focus:text-red-500">
                            <Trash2 className="h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </motion.div>
                ))}
          </div>

          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            {isLoading ? (
              <SkeletonTable rows={5} columns={6} />
            ) : jobs.length === 0 ? (
              <div className="p-12">
                <EmptyState
                  icon={Plus}
                  title="No jobs yet"
                  description="Create your first job posting to start attracting candidates."
                  action={{ label: "Create job", onClick: () => window.location.href = "/company/jobs/create" }}
                />
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border text-muted-foreground font-semibold uppercase tracking-wider">
                    <th className="py-5 px-6 font-medium text-xs">Role</th>
                    <th className="py-5 px-6 font-medium text-xs">Location</th>
                    <th className="py-5 px-6 font-medium text-xs">Applicants</th>
                    <th className="py-5 px-6 font-medium text-xs">AI Matches</th>
                    <th className="py-5 px-6 font-medium text-xs">Status</th>
                    <th className="py-5 px-6 font-medium text-xs text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-foreground text-sm">
                  {jobs.map((job) => (
                    <motion.tr
                      key={job.id}
                      className="group hover:bg-muted/30 transition-colors"
                      variants={fadeInUp}
                      custom={job.id}
                    >
                      <td className="py-5 px-6">
                        <div className="font-bold text-foreground tracking-tight group-hover:text-emerald-600 transition-colors">{job.title}</div>
                      </td>
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-2 text-muted-foreground font-medium">
                          <MapPin className="h-3.5 w-3.5 text-muted-foreground/60" />
                          {job.location}
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <span className="font-extrabold text-foreground">{job.applications_count}</span>
                      </td>
                      <td className="py-5 px-6">
                        <span className="font-bold text-emerald-600 flex items-center gap-1.5">
                          <Sparkles className="h-3.5 w-3.5" />
                          {job.ai_matches_count}
                        </span>
                      </td>
                      <td className="py-5 px-6">
                        <span className={`inline-flex items-center border px-3 py-1.5 rounded-full text-[11px] font-bold ${statusColor(job.job_status)}`}>
                          {job.job_status}
                        </span>
                      </td>
                      <td className="py-5 px-6 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger className="inline-flex items-center justify-center border border-border bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground w-9 h-9 rounded-xl transition-all active:scale-[0.98]" aria-label={`Options for ${job.title}`}>
                            <MoreVertical className="h-4 w-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44 bg-card border border-border text-foreground shadow-xl rounded-2xl">
                            <DropdownMenuItem onClick={() => router.push(`/company/jobs/view?id=${job.id}`)} className="cursor-pointer gap-2.5 px-3 py-2.5 rounded-xl">
                              <Eye className="h-4 w-4" /> View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/company/jobs/edit?id=${job.id}`)} className="cursor-pointer gap-2.5 px-3 py-2.5 rounded-xl">
                              <Pencil className="h-4 w-4" /> Request edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/company/jobs/applicants?id=${job.id}`)} className="cursor-pointer gap-2.5 px-3 py-2.5 rounded-xl">
                              <Users className="h-3.5 w-3.5 text-muted-foreground" /> Applicants
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(job.id, job.title)} className="cursor-pointer gap-2.5 px-3 py-2.5 rounded-xl text-red-500 focus:text-red-500">
                              <Trash2 className="h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
