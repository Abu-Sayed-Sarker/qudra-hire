"use client";

import React, { useState, useCallback, useMemo } from "react";
import {
  Users,
  SlidersHorizontal,
  Sparkles,
  FilterX,
  X,
  Search,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetCompanyCandidatesQuery,
  type CompanyCandidatesFilters,
  type CompanyCandidate,
} from "@/store/authApi";
import CandidateFilters from "@/components/company/candidate-filters";
import CandidateCard from "@/components/company/candidate-card";

const EMPTY_FILTERS: CompanyCandidatesFilters = {};

export default function CandidatesPage() {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<CompanyCandidatesFilters>({});
  const [appliedFilters, setAppliedFilters] =
    useState<CompanyCandidatesFilters>(EMPTY_FILTERS);

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetCompanyCandidatesQuery(appliedFilters);

  const candidates: CompanyCandidate[] = data?.data ?? [];

  const handleApplyFilters = useCallback(() => {
    setAppliedFilters(filters);
    setIsFiltersOpen(false);
  }, [filters]);

  const handleResetFilters = useCallback(() => {
    setFilters(EMPTY_FILTERS);
    setAppliedFilters(EMPTY_FILTERS);
  }, []);

  const hasActiveFilters = useMemo(
    () =>
      !!(appliedFilters.role?.trim() ||
        appliedFilters.skills?.trim() ||
        appliedFilters.experience_level ||
        appliedFilters.gender ||
        appliedFilters.min_age !== undefined ||
        appliedFilters.max_age !== undefined),
    [appliedFilters]
  );

  const renderSkeletons = () =>
    Array.from({ length: 6 }).map((_, i) => (
      <div
        key={i}
        className="bg-card border border-border rounded-2xl p-5 space-y-4"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-11 w-11 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32 rounded" />
              <Skeleton className="h-3 w-48 rounded" />
            </div>
          </div>
          <Skeleton className="h-6 w-12 rounded-lg" />
        </div>
        <Skeleton className="h-3 w-3/4 rounded" />
        <div className="flex gap-1.5">
          <Skeleton className="h-5 w-16 rounded-md" />
          <Skeleton className="h-5 w-20 rounded-md" />
          <Skeleton className="h-5 w-14 rounded-md" />
        </div>
        <Skeleton className="h-3 w-1/2 rounded" />
        <Skeleton className="h-10 w-full rounded-xl" />
      </div>
    ));

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-full mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">
            AI-ranked candidates
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Unlock full profiles using credits.
          </p>
        </div>

        {/* Filters Dialog */}
        <Dialog open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
          <DialogTrigger
            render={
              <button className="flex items-center gap-2 border border-border bg-card hover:bg-muted text-foreground px-4 py-2 rounded-xl text-sm font-semibold transition-all active:scale-[0.98]">
                <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                Filters
                {hasActiveFilters && (
                  <span className="h-2 w-2 rounded-full bg-[#4BC957]"></span>
                )}
              </button>
            }
          />

          <DialogContent className="max-w-2xl w-full bg-card border border-border p-6 rounded-2xl text-foreground shadow-2xl ring-0 outline-hidden max-h-[85vh] overflow-y-auto">
            <DialogHeader className="flex flex-row items-center justify-between border-b border-border pb-4">
              <DialogTitle className="text-xl font-bold text-foreground tracking-tight">
                Filters
              </DialogTitle>
            </DialogHeader>

            <div className="py-4">
              <CandidateFilters
                filters={filters}
                onChange={setFilters}
                onApply={handleApplyFilters}
                onReset={handleResetFilters}
                isLoading={isFetching}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Active filter pills */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground font-medium">
            Active filters:
          </span>
          {appliedFilters.role?.trim() && (
            <Badge
              variant="outline"
              className="bg-muted text-foreground border-border rounded-lg px-2.5 py-1 flex items-center gap-1.5 text-xs font-medium"
            >
              Role: {appliedFilters.role}
              <button
                onClick={() =>
                  setFilters((f) => ({ ...f, role: undefined }))
                }
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {appliedFilters.skills?.trim() && (
            <Badge
              variant="outline"
              className="bg-muted text-foreground border-border rounded-lg px-2.5 py-1 flex items-center gap-1.5 text-xs font-medium"
            >
              Skills: {appliedFilters.skills}
              <button
                onClick={() =>
                  setFilters((f) => ({ ...f, skills: undefined }))
                }
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {appliedFilters.experience_level &&
            appliedFilters.experience_level !== "ALL" && (
              <Badge
                variant="outline"
                className="bg-muted text-foreground border-border rounded-lg px-2.5 py-1 flex items-center gap-1.5 text-xs font-medium"
              >
                {appliedFilters.experience_level}
                <button
                  onClick={() =>
                    setFilters((f) => ({
                      ...f,
                      experience_level: undefined,
                    }))
                  }
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          {appliedFilters.gender && appliedFilters.gender !== "ALL" && (
            <Badge
              variant="outline"
              className="bg-muted text-foreground border-border rounded-lg px-2.5 py-1 flex items-center gap-1.5 text-xs font-medium"
            >
              {appliedFilters.gender}
              <button
                onClick={() =>
                  setFilters((f) => ({ ...f, gender: undefined }))
                }
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {(appliedFilters.min_age !== undefined ||
            appliedFilters.max_age !== undefined) && (
            <Badge
              variant="outline"
              className="bg-muted text-foreground border-border rounded-lg px-2.5 py-1 flex items-center gap-1.5 text-xs font-medium"
            >
              Age: {appliedFilters.min_age ?? 0}–
              {appliedFilters.max_age ?? "∞"}
              <button
                onClick={() =>
                  setFilters((f) => ({
                    ...f,
                    min_age: undefined,
                    max_age: undefined,
                  }))
                }
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          <button
            onClick={handleResetFilters}
            className="text-xs text-[#4BC957] hover:underline font-semibold ml-1"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-16 w-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
            <FilterX className="h-8 w-8 text-red-500" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-1">
            Something went wrong
          </h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-sm">
            {error && "status" in error
              ? `Error ${error.status}: ${JSON.stringify(error.data)}`
              : "Failed to fetch candidates. Please try again."}
          </p>
          <button
            onClick={() => refetch()}
            className="text-sm font-semibold text-[#4BC957] hover:underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Content */}
      {!isError && (
        <>
          {isLoading || isFetching ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
              {renderSkeletons()}
            </div>
          ) : candidates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
              {candidates.map((candidate) => (
                <CandidateCard key={candidate.id} candidate={candidate} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="h-16 w-16 rounded-2xl bg-muted border border-border flex items-center justify-center mb-4">
                <FilterX className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-1">
                No candidates found
              </h3>
              <p className="text-sm text-muted-foreground mb-4 max-w-sm">
                Try adjusting your filters or removing some to see more
                results.
              </p>
              <button
                onClick={handleResetFilters}
                className="text-sm font-semibold text-[#4BC957] hover:underline"
              >
                Reset all filters
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
