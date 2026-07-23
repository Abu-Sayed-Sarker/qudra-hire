"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Mail } from "lucide-react";
import { useForgotPasswordMutation } from "@/store/authApi";
import { setPasswordResetEmail } from "@/store/authSlice";
import { useAppDispatch } from "@/store/hooks";
import Image from "next/image";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [sent, setSent] = useState(false);

  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    try {
      await forgotPassword({ email }).unwrap();
      // Store email in Redux so verify-otp / reset-password can use it
      dispatch(setPasswordResetEmail(email));
      setSent(true);
      // Brief pause so the user sees the success state, then navigate
      setTimeout(() => router.push("/verify-otp"), 1800);
    } catch (err: unknown) {
      const message =
        (err as { data?: { details?: string }; message?: string })?.data?.details ??
        (err as { message?: string })?.message ??
        "Something went wrong. Please try again.";
      setErrorMsg(message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4 py-12 text-on-surface">
      <div className="w-full max-w-[400px] bg-surface-card border border-surface rounded-3xl p-6 sm:p-10 shadow-2xl">

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            <div className="hidden dark:block">
              <Image src='/logo.png' height={700} width={700} className="w-48 h-auto" alt="logo" />
            </div>
            <div className="block dark:hidden">
              <Image src='/light-logo.png' height={700} width={700} className="w-48 h-auto" alt="logo" />
            </div>
          </Link>
        </div>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-[#4BC957]/10 border border-[#4BC957]/20 flex items-center justify-center">
            <Mail size={26} className="text-[#4BC957]" />
          </div>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-on-surface mb-2 text-center">Forgot your password?</h1>
        <p className="text-on-surface-muted text-sm mb-8 text-center">
          Enter your email and we&apos;ll send you a one-time code to reset your password.
        </p>

        {/* Success state */}
        {sent ? (
          <div className="flex flex-col items-center gap-3 py-4">
            <div className="w-12 h-12 rounded-full bg-[#4BC957]/15 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-[#4BC957]">
                <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-sm font-medium text-on-surface">OTP sent! Redirecting…</p>
            <p className="text-xs text-on-surface-muted text-center">
              Check <span className="font-semibold">{email}</span> for your one-time code.
            </p>
          </div>
        ) : (
          <>
            {/* Error */}
            {errorMsg && (
              <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                {errorMsg}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-on-surface mb-1.5">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@work.com"
                  required
                  className="w-full bg-surface-deep border border-surface rounded-xl px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-subtle focus:outline-none focus:border-[#4BC957]/50 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-[#4BC957] hover:bg-[#00B96E] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold px-6 py-3 rounded-xl transition-all"
              >
                {/*{isLoading && <Loader2 size={16} className="animate-spin" />}*/}
                {isLoading ? "Sending…" : "Send reset code"}
              </button>
            </form>
          </>
        )}

        {/* Back to login */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/login"
            className="flex items-center gap-1.5 text-xs text-on-surface-muted hover:text-on-surface transition-colors"
          >
            <ArrowLeft size={13} />
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
