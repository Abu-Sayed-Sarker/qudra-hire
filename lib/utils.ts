import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function get403Message(error: unknown): string | null {
  if (error && typeof error === "object" && (error as any).status === 403) {
    return ((error as any).data as { detail?: string })?.detail || "You do not have permission to perform this action."
  }
  return null
}
