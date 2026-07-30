"use client"

import { useEffect, useState, useRef } from "react"
import { Dialog } from "@base-ui/react/dialog"
import { cn } from "@/lib/utils"
import { FileText, Sparkles, Check, Loader2 } from "lucide-react"

const STEPS = [
  { label: "Reading CV document...", duration: 2000 },
  { label: "Parsing skills & experience...", duration: 2500 },
  { label: "Analyzing ATS compatibility...", duration: 2500 },
  { label: "Generating suggestions...", duration: 2000 },
  { label: "Finalizing report...", duration: 1000 },
]

const TOTAL_DURATION = STEPS.reduce((sum, s) => sum + s.duration, 0)

export function AnalysisPopup({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [progress, setProgress] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)
  const [stepProgress, setStepProgress] = useState(0)
  const [done, setDone] = useState(false)
  const startRef = useRef(0)
  const frameRef = useRef(0)

  useEffect(() => {
    if (!open) {
      setProgress(0)
      setStepIndex(0)
      setStepProgress(0)
      setDone(false)
      return
    }

    startRef.current = performance.now()

    function animate(now: number) {
      const elapsed = now - startRef.current
      const pct = Math.min(elapsed / TOTAL_DURATION, 1)
      setProgress(pct)

      let acc = 0
      for (let i = 0; i < STEPS.length; i++) {
        const nextAcc = acc + STEPS[i].duration
        if (elapsed < nextAcc) {
          setStepIndex(i)
          setStepProgress((elapsed - acc) / STEPS[i].duration)
          break
        }
        acc = nextAcc
      }

      if (pct < 1) {
        frameRef.current = requestAnimationFrame(animate)
      } else {
        setStepIndex(STEPS.length - 1)
        setStepProgress(1)
        setDone(true)
        setTimeout(() => onOpenChange(false), 1200)
      }
    }

    frameRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameRef.current)
  }, [open, onOpenChange])

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white dark:bg-[#0F172A] p-6 shadow-xl ring-1 ring-slate-200 dark:ring-[#1E293B]/60 outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95">
          <div className="flex flex-col items-center gap-5 text-center">
            {done ? (
              <>
                <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-[#4BC957]/10 flex items-center justify-center">
                  <Check className="h-8 w-8 text-green-600 dark:text-[#4BC957]" />
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-bold text-slate-900 dark:text-white">Analysis Complete</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Your CV has been analyzed successfully.</p>
                </div>
              </>
            ) : (
              <>
                <div className="relative h-20 w-20">
                  <div className="absolute inset-0 rounded-full bg-green-100 dark:bg-[#4BC957]/10" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FileText className="h-8 w-8 text-green-600 dark:text-[#4BC957]" />
                  </div>
                  <svg className="absolute inset-0 -rotate-90" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="36" fill="none" stroke="currentColor" strokeWidth="3"
                      className="text-slate-200 dark:text-slate-700" />
                    <circle cx="40" cy="40" r="36" fill="none" stroke="currentColor" strokeWidth="3"
                      strokeDasharray={226.2}
                      strokeDashoffset={226.2 * (1 - progress)}
                      strokeLinecap="round"
                      className="text-green-500 dark:text-[#4BC957] transition-all duration-100 ease-linear" />
                  </svg>
                </div>

                <div className="w-full space-y-3">
                  <div className="flex items-center gap-2 justify-center">
                    <Loader2 className="h-4 w-4 animate-spin text-green-600 dark:text-[#4BC957]" />
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {STEPS[stepIndex].label}
                    </p>
                  </div>

                  <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-400 to-green-600 dark:from-[#4BC957] dark:to-[#00B96E] rounded-full transition-all duration-150 ease-linear"
                      style={{ width: `${(stepIndex + stepProgress) / STEPS.length * 100}%` }} />
                  </div>

                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    Analyzing your CV — {Math.round(progress * 100)}%
                  </p>
                </div>
              </>
            )}
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
