"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { useLoginWithEmailMutation, useGoogleLoginMutation } from "@/store/authApi";
import { setCredentials } from "@/store/authSlice";
import { useAppDispatch } from "@/store/hooks";
import Image from "next/image";
import GoogleLoginButton from "@/components/shared/GoogleLoginButton";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [accountType, setAccountType] = useState<"candidate" | "company">("candidate");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [loginWithEmail, { isLoading: isEmailLoading }] = useLoginWithEmailMutation();
  const [googleLogin, { isLoading: isGoogleLoading }] = useGoogleLoginMutation();

  async function handleGoogleSuccess(credential: string) {
    setErrorMsg("");
    try {
      const result = await googleLogin({ id_token: credential }).unwrap();

      dispatch(
        setCredentials({
          access: result.data.access,
          refresh: result.data.refresh,
          user: result.data.user,
        })
      );

      const role = result.data.user.role?.toUpperCase();
      if (role === "ADMIN") {
        router.push("/admin/dashboard");
      } else if (role === "COMPANY") {
        router.push("/company");
      } else {
        router.push("/candidate");
      }
    } catch (err: unknown) {
      const message =
        (err as { data?: { details?: string }; message?: string })?.data
          ?.details ??
        (err as { message?: string })?.message ??
        "Google login failed. Please try again.";
      setErrorMsg(message);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    try {
      const result = await loginWithEmail({ email, password }).unwrap();

      dispatch(
        setCredentials({
          access: result.data.access,
          refresh: result.data.refresh,
          user: result.data.user,
        })
      );

      const role = result.data.user.role?.toUpperCase();
      if (role === "ADMIN") {
        router.push("/admin/dashboard");
      } else if (role === "COMPANY") {
        router.push("/company");
      } else {
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-100 bg-card border border-border rounded-2xl p-6 sm:p-10 shadow-sm"
      >
        <div className="flex justify-center mb-8">
          <Link href="/" className="text-2xl font-bold tracking-tight" aria-label="Home">
            <div className="hidden dark:block">
              <Image src="/logo.png" height={200} width={700} className="w-48 h-auto" alt="logo" />
            </div>
            <div className="block dark:hidden">
              <Image src="/light-logo.png" height={200} width={700} className="w-48 h-auto" alt="logo" />
            </div>
          </Link>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-on-surface mb-2">Welcome back</h1>
        <p className="text-muted-foreground text-sm mb-6">Log in to continue progressing.</p>

        <GoogleLoginButton
          onSuccess={handleGoogleSuccess}
          onError={() => setErrorMsg("Google login failed. Please try again.")}
        />

        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1 bg-border" />
          <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">OR</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        {errorMsg && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm" role="alert">
            {errorMsg}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <div>
            <label htmlFor="email" className="block text-xs font-medium text-on-surface mb-1.5">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@work.com"
              required
              aria-required="true"
              className="w-full bg-surface-deep border border-border rounded-xl px-4 py-3 text-sm text-on-surface placeholder:text-muted-foreground focus:outline-none focus:border-[#23C65F]/50 transition-colors"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="password" className="block text-xs font-medium text-on-surface">Password</label>
              <Link
                href="/forgot-password"
                className="text-xs text-[#23C65F] hover:underline font-medium"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                aria-required="true"
                className="w-full bg-surface-deep border border-border rounded-xl px-4 py-3 pr-11 text-sm text-on-surface placeholder:text-muted-foreground focus:outline-none focus:border-[#23C65F]/50 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-on-surface transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isEmailLoading || isGoogleLoading}
            aria-label={isEmailLoading ? "Logging in" : "Log in"}
            className="w-full flex items-center justify-center gap-2 bg-[#23C65F] hover:bg-[#1a9e4a] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold px-6 py-3 rounded-xl transition-all mt-2"
          >
            {/* {isEmailLoading && <Loader2 size={16} className="animate-spin" />} */}
            {isEmailLoading ? "Logging in…" : "Log in"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            No account?{" "}
            <Link href="/signup" className="text-[#23C65F] font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}