"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, ArrowLeft, KeyRound } from "lucide-react";
import { useResetPasswordMutation } from "@/store/authApi";
import { clearPasswordReset } from "@/store/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import Image from "next/image";

function PasswordInput({
  label,
  value,
  onChange,
  placeholder = "••••••••",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="block text-xs font-medium text-on-surface mb-1.5">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required
          className="w-full bg-surface-deep border border-surface rounded-xl px-4 py-3 pr-11 text-sm text-on-surface placeholder:text-on-surface-subtle focus:outline-none focus:border-[#4BC957]/50 transition-colors"
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-subtle hover:text-on-surface transition-colors"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const storedEmail = useAppSelector((s) => s.auth.passwordResetEmail);
  const storedOtp = useAppSelector((s) => s.auth.passwordResetOtp);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [done, setDone] = useState(false);

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    if (!storedEmail || !storedOtp) {
      setErrorMsg("Session expired. Please restart the password reset flow.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    try {
      await resetPassword({
        email: storedEmail,
        otp: storedOtp,
        new_password: newPassword,
        confirm_password: confirmPassword,
      }).unwrap();

      dispatch(clearPasswordReset());
      setDone(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: unknown) {
      const message =
        (err as { data?: { details?: string }; message?: string })?.data?.details ??
        (err as { message?: string })?.message ??
        "Reset failed. Please try again.";
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
            <KeyRound size={26} className="text-[#4BC957]" />
          </div>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-on-surface mb-2 text-center">Set new password</h1>
        <p className="text-on-surface-muted text-sm mb-8 text-center">
          Choose a strong password you haven&apos;t used before.
        </p>

        {done ? (
          <div className="flex flex-col items-center gap-3 py-4">
            <div className="w-12 h-12 rounded-full bg-[#4BC957]/15 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-[#4BC957]">
                <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-on-surface">Password reset successfully!</p>
            <p className="text-xs text-on-surface-muted">Redirecting to login…</p>
          </div>
        ) : (
          <>
            {errorMsg && (
              <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <PasswordInput
                label="New password"
                value={newPassword}
                onChange={setNewPassword}
              />

              <PasswordInput
                label="Confirm new password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                placeholder="Re-enter password"
              />

              {/* Password strength hint */}
              {newPassword.length > 0 && (
                <div className="space-y-1.5">
                  <div className="h-1.5 w-full bg-surface-deep rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${newPassword.length < 6
                        ? "w-1/4 bg-red-500"
                        : newPassword.length < 10
                          ? "w-2/4 bg-yellow-500"
                          : "w-full bg-[#4BC957]"
                        }`}
                    />
                  </div>
                  <p className="text-xs text-on-surface-muted">
                    {newPassword.length < 6
                      ? "Too short"
                      : newPassword.length < 10
                        ? "Fair strength"
                        : "Strong password"}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-[#4BC957] hover:bg-[#00B96E] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold px-6 py-3 rounded-xl transition-all mt-2"
              >
                {/*{isLoading && <Loader2 size={16} className="animate-spin" />}*/}
                {isLoading ? "Resetting…" : "Reset password"}
              </button>
            </form>
          </>
        )}

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
