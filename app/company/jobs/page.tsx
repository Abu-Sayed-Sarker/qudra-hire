"use client";

import React from "react";
import { Plus, MoreVertical, Eye, Pencil, Trash2, Users, Loader2 } from "lucide-react";
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
import { motion, type Variants } from "framer-motion";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      when: "beforeChildren",
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

export default function JobsPage() {
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useGetCompanyJobsQuery();
  const [deleteJob] = useDeleteCompanyJobMutation();

  const jobs: CompanyJob[] = data?.data ?? [];

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      await deleteJob(id);
    }
  };

  return (
    <motion.div
      className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-full mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header section */}
      <motion.div
        className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4"
        variants={itemVariants}
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">Manage jobs</h1>
          <p className="text-sm text-muted-foreground mt-1">Post, monitor and close listings.</p>
        </div>
        <Link
          href="/company/jobs/create"
          className="inline-flex items-center justify-center gap-2 bg-[#4BC957] hover:bg-[#00B96E] text-white font-bold px-5 py-3 rounded-xl transition-all duration-200 shadow-lg shadow-[#4BC957]/10 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#4BC957]/50 focus-visible:ring-offset-2"
          aria-label="Create a new job posting"
        >
          <Plus className="h-5 w-5" />
          Post a job
        </Link>
      </motion.div>

      {/* Error State */}
      {isError ? (
        <motion.div variants={itemVariants}>
          <ErrorState
            title="Failed to load jobs"
            description="Something went wrong while fetching your job listings."
            onRetry={refetch}
          />
        </motion.div>
      ) : (
        <motion.div variants={itemVariants}>
          {/* Jobs Table Container */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            {/* Mobile card view */}
            <div className="block md:hidden divide-y divide-border">
              {isLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="p-4 space-y-3">
                      <div className="flex justify-between items-start gap-2">
                        <Skeleton className="h-4 w-48 rounded" />
                        <Skeleton className="h-5 w-16 rounded-full" />
                      </div>
                      <Skeleton className="h-4 w-32 rounded" />
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-4 w-24 rounded" />
                        <Skeleton className="h-4 w-12 rounded" />
                      </div>
                      <Skeleton className="h-9 w-9 rounded-xl ml-auto" />
                    </div>
                  ))
                : jobs.map((job) => (
                    <motion.div
                      key={job.id}
                      className="p-4 space-y-3 hover:bg-muted/50 transition-colors"
                      whileHover={{ backgroundColor: "rgba(0,0,0,0.01)" }}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-bold text-foreground text-sm leading-tight">{job.title}</h3>
                        <span className="inline-flex items-center bg-[#4BC957]/10 text-[#4BC957] border border-[#4BC957]/20 px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap">
                          {job.job_status}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-sm">{job.location}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          <strong className="text-foreground font-semibold">{job.applications_count}</strong> applicants
                        </span>
                        <span className="font-bold text-[#4BC957]">{job.ai_matches_count}</span>
                      </div>
                      <div className="flex items-center gap-2 pt-1">
                        <DropdownMenu>
                          <DropdownMenuTrigger className="inline-flex items-center justify-center border border-border bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground w-9 h-9 rounded-xl transition-all active:scale-[0.98]" aria-label="Job options">
                            <MoreVertical className="h-4 w-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40 bg-card border border-border text-foreground">
                            <DropdownMenuItem onClick={() => router.push(`/company/jobs/view?id=${job.id}`)} className="cursor-pointer gap-2 px-2.5 py-2">
                              <Eye className="h-4 w-4" /> View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/company/jobs/edit?id=${job.id}`)} className="cursor-pointer gap-2 px-2.5 py-2">
                              <Pencil className="h-4 w-4" /> Request edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/company/jobs/applicants?id=${job.id}`)} className="cursor-pointer gap-2 px-2.5 py-2">
                              <Users className="h-3.5 w-3.5 text-muted-foreground" /> Applicants
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(job.id, job.title)} className="cursor-pointer gap-2 px-2.5 py-2 text-red-500 focus:text-red-500">
                              <Trash2 className="h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </motion.div>
                  ))}
            </div>
            <div className="hidden md:block overflow-x-auto">
              {isLoading ? (
                <SkeletonTable rows={4} columns={6} />
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
                    <tr className="border-b border-border text-muted-foreground font-semibold uppercase tracking-wider bg-muted/40">
                      <th className="py-4 px-6 font-medium">Role</th>
                      <th className="py-4 px-6 font-medium">Location</th>
                      <th className="py-4 px-6 font-medium">Applicants</th>
                      <th className="py-4 px-6 font-medium">AI Matches</th>
                      <th className="py-4 px-6 font-medium">Status</th>
                      <th className="py-4 px-6 font-medium text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border text-foreground text-sm">
                    {jobs.map((job) => (
                      <motion.tr
                        key={job.id}
                        className="hover:bg-muted/50 transition-colors group"
                        whileHover={{ backgroundColor: "rgba(0,0,0,0.01)" }}
                      >
                        <td className="py-5 px-6 font-bold text-foreground tracking-tight">{job.title}</td>
                        <td className="py-5 px-6 text-muted-foreground font-medium">{job.location}</td>
                        <td className="py-5 px-6 font-extrabold text-foreground">{job.applications_count}</td>
                        <td className="py-5 px-6 font-bold text-[#4BC957]">{job.ai_matches_count}</td>
                        <td className="py-5 px-6">
                          <span className="inline-flex items-center bg-[#4BC957]/10 text-[#4BC957] border border-[#4BC957]/20 px-2.5 py-0.5 rounded-full font-semibold">
                            {job.job_status}
                          </span>
                        </td>
                        <td className="py-5 px-6 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger className="inline-flex items-center justify-center border border-border bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground w-9 h-9 rounded-xl transition-all active:scale-[0.98]" aria-label={`Options for ${job.title}`}>
                              <MoreVertical className="h-4 w-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40 bg-card border border-border text-foreground">
                              <DropdownMenuItem onClick={() => router.push(`/company/jobs/view?id=${job.id}`)} className="cursor-pointer gap-2 px-2.5 py-2">
                                <Eye className="h-4 w-4" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => router.push(`/company/jobs/edit?id=${job.id}`)} className="cursor-pointer gap-2 px-2.5 py-2">
                                <Pencil className="h-4 w-4" />
                                Request edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => router.push(`/company/jobs/applicants?id=${job.id}`)} className="cursor-pointer gap-2 px-2.5 py-2">
                                <Users className="h-3.5 w-3.5 text-muted-foreground" />
                                Applicants
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDelete(job.id, job.title)} className="cursor-pointer gap-2 px-2.5 py-2 text-red-500 focus:text-red-500">
                                <Trash2 className="h-4 w-4" />
                                Delete
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
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}