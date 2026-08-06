"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { useChangePasswordMutation } from "@/store/authApi";
import { useAppSelector } from "@/store/hooks";
import Image from "next/image";

// ── Reusable password input ────────────────────────────────────────────────────
function PasswordInput({
  label,
  value,
  onChange,
  placeholder = "••••••••",
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
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
      {hint && <p className="text-xs text-on-surface-subtle mt-1">{hint}</p>}
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function ChangePasswordPage() {
  const router = useRouter();

  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const user = useAppSelector((s) => s.auth.user);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [done, setDone] = useState(false);

  const [changePassword, { isLoading }] = useChangePasswordMutation();

  // Guard: redirect to login if not authenticated
  useEffect(() => {
    if (!accessToken) {
      router.replace("/login");
    }
  }, [accessToken, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    if (newPassword !== confirmPassword) {
      setErrorMsg("New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg("New password must be at least 6 characters.");
      return;
    }

    if (newPassword === currentPassword) {
      setErrorMsg("New password must be different from your current password.");
      return;
    }

    try {
      await changePassword({
        password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      }).unwrap();

      setDone(true);
      // Clear fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      const message =
        (err as { data?: { details?: string }; message?: string })?.data?.details ??
        (err as { message?: string })?.message ??
        "Password change failed. Please try again.";
      setErrorMsg(message);
    }
  }

  if (!accessToken) return null; // will redirect

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4 py-12 text-on-surface">
      <div className="w-full max-w-[420px] bg-surface-card border border-surface rounded-3xl p-6 sm:p-10 shadow-2xl">

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            <div className="hidden dark:block">
              <Image src='/logo.png' height={200} width={700} className="w-48 h-auto" alt="logo" />
            </div>
            <div className="block dark:hidden">
              <Image src='/light-logo.png' height={200} width={700} className="w-48 h-auto" alt="logo" />
            </div>
          </Link>
        </div>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-[#4BC957]/10 border border-[#4BC957]/20 flex items-center justify-center">
            <Lock size={26} className="text-[#4BC957]" />
          </div>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-on-surface mb-2 text-center">Change password</h1>
        {user?.email && (
          <p className="text-on-surface-muted text-sm mb-8 text-center truncate">
            Logged in as <span className="font-medium text-on-surface">{user.email}</span>
          </p>
        )}

        {/* Success state */}
        {done ? (
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="w-14 h-14 rounded-full bg-[#4BC957]/15 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-[#4BC957]">
                <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-base font-semibold text-on-surface">Password updated!</p>
              <p className="text-xs text-on-surface-muted mt-1">Your password has been changed successfully.</p>
            </div>
            <button
              type="button"
              onClick={() => setDone(false)}
              className="mt-2 text-xs text-[#4BC957] hover:underline font-medium"
            >
              Change again
            </button>
          </div>
        ) : (
          <>
            {/* Error */}
            {errorMsg && (
              <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <PasswordInput
                label="Current password"
                value={currentPassword}
                onChange={setCurrentPassword}
                hint="Enter the password you currently use to log in."
              />

              <div className="pt-2 border-t border-surface" />

              <PasswordInput
                label="New password"
                value={newPassword}
                onChange={setNewPassword}
              />

              {/* Password strength bar */}
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
                        : "Strong password ✓"}
                  </p>
                </div>
              )}

              <PasswordInput
                label="Confirm new password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                placeholder="Re-enter new password"
              />

              {/* Match indicator */}
              {confirmPassword.length > 0 && (
                <p className={`text-xs ${newPassword === confirmPassword ? "text-[#4BC957]" : "text-red-500"}`}>
                  {newPassword === confirmPassword ? "Passwords match ✓" : "Passwords do not match"}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-[#4BC957] hover:bg-[#00B96E] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold px-6 py-3 rounded-xl transition-all mt-2"
              >
                 {/*{isLoading && <Loader2 size={16} className="animate-spin" />}*/}
                {isLoading ? "Updating…" : "Update password"}
              </button>
            </form>
          </>
        )}

        {/* Navigation */}
        <div className="mt-8 flex justify-center gap-6 text-xs text-on-surface-muted">
          <Link href="/login" className="hover:text-on-surface transition-colors">
            Back to login
          </Link>
          <span className="text-surface-deep">·</span>
          <Link
            href={user?.role === "COMPANY" ? "/company" : "/candidate"}
            className="hover:text-on-surface transition-colors"
          >
            Go to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
