"use client";

import React from "react";
import { Plus, MoreVertical, Eye, Pencil, Trash2, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetCompanyJobsQuery,
  useDeleteCompanyJobMutation,
  type CompanyJob,
} from "@/store/authApi";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

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

  const renderSkeletonRow = () => (
    <tr className="border-b border-border">
      <td className="py-5 px-6">
        <Skeleton className="h-4 w-48 rounded" />
      </td>
      <td className="py-5 px-6">
        <Skeleton className="h-4 w-32 rounded" />
      </td>
      <td className="py-5 px-6">
        <Skeleton className="h-4 w-16 rounded" />
      </td>
      <td className="py-5 px-6">
        <Skeleton className="h-4 w-12 rounded" />
      </td>
      <td className="py-5 px-6">
        <Skeleton className="h-6 w-16 rounded-full" />
      </td>
      <td className="py-5 px-6 text-right">
        <Skeleton className="h-9 w-9 rounded-xl ml-auto" />
      </td>
    </tr>
  );

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-full mx-auto">
      {/* Header section matching the screenshot */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">Manage jobs</h1>
          <p className="text-sm text-muted-foreground mt-1">Post, monitor and close listings.</p>
        </div>
        <Link href="/company/jobs/create" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#4BC957] hover:bg-[#00B96E] text-white font-bold px-5 py-3 rounded-xl transition-all duration-200 shadow-lg shadow-[#4BC957]/10 active:scale-[0.98]">
          <Plus className="h-5 w-5" />
          Post a job
        </Link>
      </div>

      {/* Error State */}
      {isError && (
        <div className="bg-card border border-border rounded-2xl p-12 text-center">
          <p className="text-sm text-muted-foreground mb-4">Failed to load jobs. Please try again.</p>
          <button onClick={() => refetch()} className="text-sm font-semibold text-[#4BC957] hover:underline">
            Retry
          </button>
        </div>
      )}

      {/* Jobs Table Container - Desktop */}
      {!isError && (
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
                  <div key={job.id} className="p-4 space-y-3 hover:bg-muted/50 transition-colors">
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
                        <DropdownMenuTrigger className="inline-flex items-center justify-center border border-border bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground w-9 h-9 rounded-xl transition-all active:scale-[0.98]">
                          <MoreVertical className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40 bg-card border border-border text-foreground">
                          <DropdownMenuItem onClick={() => router.push(`/company/jobs/view?id=${job.id}`)} className="cursor-pointer gap-2 px-2.5 py-2">
                            <Eye className="h-4 w-4" /> View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(`/company/jobs/edit?id=${job.id}`)} className="cursor-pointer gap-2 px-2.5 py-2">
                            <Pencil className="h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(`/company/jobs/applicants`)} className="cursor-pointer gap-2 px-2.5 py-2">
                            <Users className="h-3.5 w-3.5 text-muted-foreground" /> Applicants
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(job.id, job.title)} className="cursor-pointer gap-2 px-2.5 py-2 text-red-500 focus:text-red-500">
                            <Trash2 className="h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
          </div>
          <div className="hidden md:block overflow-x-auto">
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
                {isLoading
                  ? Array.from({ length: 4 }).map((_, i) => renderSkeletonRow())
                  : jobs.map((job) => (
                      <tr key={job.id} className="hover:bg-muted/50 transition-colors group">
                        {/* Role name */}
                        <td className="py-5 px-6 font-bold text-foreground tracking-tight">{job.title}</td>
                        {/* Location */}
                        <td className="py-5 px-6 text-muted-foreground font-medium">{job.location}</td>
                        {/* Applicants Count */}
                        <td className="py-5 px-6 font-extrabold text-foreground">{job.applications_count}</td>
                        {/* AI Matches Score in Qudra Green */}
                        <td className="py-5 px-6 font-bold text-[#4BC957]">{job.ai_matches_count}</td>
                        {/* Status Badge */}
                        <td className="py-5 px-6">
                          <span className="inline-flex items-center bg-[#4BC957]/10 text-[#4BC957] border border-[#4BC957]/20 px-2.5 py-0.5 rounded-full font-semibold">
                            {job.job_status}
                          </span>
                        </td>
                        {/* Kebab Menu */}
                        <td className="py-5 px-6 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger className="inline-flex items-center justify-center border border-border bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground w-9 h-9 rounded-xl transition-all active:scale-[0.98]">
                              <MoreVertical className="h-4 w-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40 bg-card border border-border text-foreground">
                              <DropdownMenuItem onClick={() => router.push(`/company/jobs/view?id=${job.id}`)} className="cursor-pointer gap-2 px-2.5 py-2">
                                <Eye className="h-4 w-4" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => router.push(`/company/jobs/edit?id=${job.id}`)} className="cursor-pointer gap-2 px-2.5 py-2">
                                <Pencil className="h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => router.push(`/company/jobs/applicants`)} className="cursor-pointer gap-2 px-2.5 py-2">
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
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
