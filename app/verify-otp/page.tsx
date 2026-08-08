"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, ShieldCheck } from "lucide-react";
import { useVerifyOtpMutation, useForgotPasswordMutation } from "@/store/authApi";
import { setPasswordResetOtp } from "@/store/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import Image from "next/image";

const OTP_LENGTH = 6;

export default function VerifyOtpPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const storedEmail = useAppSelector((s) => s.auth.passwordResetEmail);
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [errorMsg, setErrorMsg] = useState("");
  const [resendMsg, setResendMsg] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();
  const [forgotPassword, { isLoading: resending }] = useForgotPasswordMutation();

  const otp = digits.join("");

  function handleDigit(index: number, value: string) {
    // Accept only the last typed digit
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      if (digits[index]) {
        const next = [...digits];
        next[index] = "";
        setDigits(next);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
        const next = [...digits];
        next[index - 1] = "";
        setDigits(next);
      }
    }
    if (e.key === "ArrowLeft" && index > 0) inputRefs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  }

  function handlePaste(e: React.ClipboardEvent) {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    e.preventDefault();
    const next = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((c, i) => { next[i] = c; });
    setDigits(next);
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    if (!storedEmail) {
      setErrorMsg("Session expired. Please restart the password reset flow.");
      return;
    }

    if (otp.length < OTP_LENGTH) {
      setErrorMsg("Please enter the full 6-digit code.");
      return;
    }

    try {
      await verifyOtp({ email: storedEmail, otp }).unwrap();
      dispatch(setPasswordResetOtp(otp));
      router.push("/reset-password");
    } catch (err: unknown) {
      const message =
        (err as { data?: { details?: string }; message?: string })?.data?.details ??
        (err as { message?: string })?.message ??
        "Invalid or expired code.";
      setErrorMsg(message);
    }
  }

  async function handleResend() {
    if (!storedEmail) return;
    setResendMsg("");
    setErrorMsg("");
    try {
      await forgotPassword({ email: storedEmail }).unwrap();
      setResendMsg("A new code has been sent to your email.");
      setDigits(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    } catch {
      setErrorMsg("Could not resend the code. Please try again.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4 py-12 text-on-surface">
      <div className="w-full max-w-100 bg-surface-card border border-surface rounded-3xl p-6 sm:p-10 shadow-2xl">

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            <div className="hidden dark:block">
              <Image src='/logo.png' height={700} width={700} className="w-48 h-auto" alt="logo" />
            </div>
            <div className="block dark:hidden">
              <Image src='/light-logo.png' height={700} width={700} className="w-48 h-auto" alt="logo" />
            </div></Link>
        </div>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-[#4BC957]/10 border border-[#4BC957]/20 flex items-center justify-center">
            <ShieldCheck size={26} className="text-[#4BC957]" />
          </div>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-on-surface mb-2 text-center">Check your email</h1>
        <p className="text-on-surface-muted text-sm mb-1 text-center">
          We sent a 6-digit code to
        </p>
        <p className="text-sm font-semibold text-on-surface mb-8 text-center truncate">
          {storedEmail ?? "your email"}
        </p>

        {/* Error / resend messages */}
        {errorMsg && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
            {errorMsg}
          </div>
        )}
        {resendMsg && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-[#4BC957]/10 border border-[#4BC957]/20 text-[#4BC957] text-sm">
            {resendMsg}
          </div>
        )}

        {/* OTP inputs */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-3" onPaste={handlePaste}>
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={(e) => handleDigit(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className={`w-11 h-13 text-center text-lg font-bold bg-surface-deep border rounded-xl text-on-surface focus:outline-none transition-colors ${d
                  ? "border-[#4BC957]/60 bg-[#4BC957]/5"
                  : "border-surface focus:border-[#4BC957]/50"
                  }`}
                aria-label={`Digit ${i + 1}`}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={isLoading || otp.length < OTP_LENGTH}
            className="w-full flex items-center justify-center gap-2 bg-[#4BC957] hover:bg-[#00B96E] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold px-6 py-3 rounded-xl transition-all"
          >
            {/*{isLoading && <Loader2 size={16} className="animate-spin" />}*/}
            {isLoading ? "Verifying…" : "Verify code"}
          </button>
        </form>

        {/* Resend */}
        <p className="mt-6 text-center text-xs text-on-surface-muted">
          Didn&apos;t receive it?{" "}
          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="text-[#4BC957] font-semibold hover:underline disabled:opacity-60"
          >
            {resending ? "Sending…" : "Resend code"}
          </button>
        </p>

        {/* Back */}
        <div className="mt-6 flex justify-center">
          <Link
            href="/forgot-password"
            className="flex items-center gap-1.5 text-xs text-on-surface-muted hover:text-on-surface transition-colors"
          >
            <ArrowLeft size={13} />
            Back
          </Link>
        </div>
      </div>
    </div>
  );
}
