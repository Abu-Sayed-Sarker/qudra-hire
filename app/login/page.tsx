"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useLoginWithEmailMutation } from "@/store/authApi";
import { setCredentials } from "@/store/authSlice";
import { useAppDispatch } from "@/store/hooks";
import Image from "next/image";

// Google SVG inline so no extra dependency
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [accountType, setAccountType] = useState<"candidate" | "company">("candidate");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [loginWithEmail, { isLoading }] = useLoginWithEmailMutation();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    try {
      const result = await loginWithEmail({ email, password }).unwrap();

      // Persist tokens + user in Redux state (also written to localStorage in the slice)
      dispatch(
        setCredentials({
          access: result.data.access,
          refresh: result.data.refresh,
          user: result.data.user,
        })
      );

      // Route based on role returned from the API
      const role = result.data.user.role?.toUpperCase();
      if (role === "ADMIN") {
        router.push("/admin/dashboard");
      } else if (role === "COMPANY") {
        router.push("/company");
      } else {
        // CANDIDATE or anything else
        router.push(accountType === "company" ? "/company" : "/candidate");
      }
    } catch (err: unknown) {
      const message =
        (err as { data?: { details?: string }; message?: string })?.data
          ?.details ??
        (err as { message?: string })?.message ??
        "Login failed. Please check your credentials.";
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

        <h1 className="text-xl sm:text-2xl font-bold text-on-surface mb-2">Welcome back</h1>
        <p className="text-on-surface-muted text-sm mb-6">Log in to continue progressing.</p>



        {/* Google button */}
        <button
          type="button"
          className="w-full flex items-center justify-center gap-3 bg-surface-item hover:bg-surface-deep border border-surface text-on-surface text-sm font-medium py-3 rounded-xl transition-colors mb-6"
        >
          <GoogleIcon />
          Continue with Google
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1 bg-surface-deep" />
          <span className="text-[10px] text-on-surface-subtle font-bold uppercase tracking-wider">OR</span>
          <div className="h-px flex-1 bg-surface-deep" />
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-medium text-on-surface mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@work.com"
              required
              className="w-full bg-surface-deep border border-surface rounded-xl px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-subtle focus:outline-none focus:border-[#4BC957]/50 transition-colors"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-on-surface">Password</label>
              <Link
                href="/forgot-password"
                className="text-xs text-[#4BC957] hover:underline font-medium"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-surface-deep border border-surface rounded-xl px-4 py-3 pr-11 text-sm text-on-surface placeholder:text-on-surface-subtle focus:outline-none focus:border-[#4BC957]/50 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-subtle hover:text-on-surface transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-[#4BC957] hover:bg-[#00B96E] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold px-6 py-3 rounded-xl transition-all mt-2"
          >
            {/*{isLoading && <Loader2 size={16} className="animate-spin" />}*/}
            {isLoading ? "Logging in…" : "Log in"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs text-on-surface-muted">
            No account?{" "}
            <Link href="/signup" className="text-[#4BC957] font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
