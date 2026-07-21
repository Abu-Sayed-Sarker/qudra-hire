"use client";

import React from "react";
import { X, SlidersHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CompanyCandidatesFilters } from "@/store/authApi";

export interface CandidateFiltersProps {
  filters: CompanyCandidatesFilters;
  onChange: (filters: CompanyCandidatesFilters) => void;
  onApply: () => void;
  onReset: () => void;
  isLoading?: boolean;
}

const EXPERIENCE_LEVELS = [
  { value: "ALL", label: "All" },
  { value: "ENTRY", label: "Entry" },
  { value: "MID", label: "Mid" },
  { value: "SENIOR", label: "Senior" },
  { value: "LEAD", label: "Lead" },
  { value: "EXECUTIVE", label: "Executive" },
];

const GENDERS = [
  { value: "ALL", label: "All" },
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
];

export default function CandidateFilters({
  filters,
  onChange,
  onApply,
  onReset,
  isLoading,
}: CandidateFiltersProps) {
  const setFilter = <K extends keyof CompanyCandidatesFilters>(
    key: K,
    value: CompanyCandidatesFilters[K]
  ) => {
    onChange({ ...filters, [key]: value });
  };

  const hasActiveFilters =
    (filters.role && filters.role.trim() !== "") ||
    (filters.skills && filters.skills.trim() !== "") ||
    (filters.experience_level && filters.experience_level !== "ALL") ||
    (filters.gender && filters.gender !== "ALL") ||
    filters.min_age !== undefined ||
    filters.max_age !== undefined;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground tracking-tight">
          Filters
        </h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5 mr-1" />
            Clear all
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Role */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Role
          </label>
          <Input
            placeholder="e.g. Backend Engineer"
            value={filters.role ?? ""}
            onChange={(e) => setFilter("role", e.target.value || undefined)}
            className="bg-background border-border focus:border-[#4BC957]"
          />
        </div>

        {/* Skills */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Skills
          </label>
          <Input
            placeholder="e.g. React, TypeScript"
            value={filters.skills ?? ""}
            onChange={(e) => setFilter("skills", e.target.value || undefined)}
            className="bg-background border-border focus:border-[#4BC957]"
          />
          <p className="text-[11px] text-muted-foreground">
            Comma-separated values
          </p>
        </div>

        {/* Experience Level */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Experience Level
          </label>
          <Select
            value={filters.experience_level ?? "ALL"}
            onValueChange={(val) =>
              setFilter("experience_level", val && val !== "ALL" ? val : undefined)
            }
          >
            <SelectTrigger className="bg-background border-border focus:border-[#4BC957]">
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              {EXPERIENCE_LEVELS.map((level) => (
                <SelectItem key={level.value} value={level.value}>
                  {level.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Gender */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Gender
          </label>
          <Select
            value={filters.gender ?? "ALL"}
            onValueChange={(val) =>
              setFilter("gender", val && val !== "ALL" ? val : undefined)
            }
          >
            <SelectTrigger className="bg-background border-border focus:border-[#4BC957]">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              {GENDERS.map((g) => (
                <SelectItem key={g.value} value={g.value}>
                  {g.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Min Age */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Min Age
          </label>
          <Input
            type="number"
            min={18}
            max={70}
            placeholder="18"
            value={filters.min_age ?? ""}
            onChange={(e) =>
              setFilter(
                "min_age",
                e.target.value ? parseInt(e.target.value, 10) : undefined
              )
            }
            className="bg-background border-border focus:border-[#4BC957]"
          />
        </div>

        {/* Max Age */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Max Age
          </label>
          <Input
            type="number"
            min={18}
            max={70}
            placeholder="70"
            value={filters.max_age ?? ""}
            onChange={(e) =>
              setFilter(
                "max_age",
                e.target.value ? parseInt(e.target.value, 10) : undefined
              )
            }
            className="bg-background border-border focus:border-[#4BC957]"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          variant="outline"
          onClick={onReset}
          disabled={isLoading}
          className="border-border hover:bg-muted"
        >
          <X className="h-4 w-4 mr-1.5" />
          Reset Filters
        </Button>
        <Button
          onClick={onApply}
          disabled={isLoading}
          className="bg-[#4BC957] hover:bg-[#00B96E] text-white font-bold shadow-md shadow-[#4BC957]/10"
        >
          <SlidersHorizontal className="h-4 w-4 mr-1.5" />
          Search / Apply Filters
        </Button>
      </div>
    </div>
  );
}
