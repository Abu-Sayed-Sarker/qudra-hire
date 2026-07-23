"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Upload, X, FileText } from "lucide-react";
import { useRegisterCandidateMutation, useRegisterCompanyMutation } from "@/store/authApi";
import { setTokens } from "@/store/authSlice";
import { useAppDispatch } from "@/store/hooks";
import Image from "next/image";

// ─── Shared input class ────────────────────────────────────────────────────────
const inputCls =
  "w-full bg-surface-deep border border-surface rounded-xl px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-subtle focus:outline-none focus:border-[#4BC957]/50 transition-colors";

// ─── Google SVG ────────────────────────────────────────────────────────────────
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

// ─── Password field with show/hide ────────────────────────────────────────────
function PasswordInput({
  value,
  onChange,
  placeholder = "••••••••",
  label,
  required,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  label: string;
  required?: boolean;
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
          required={required}
          className={`${inputCls} pr-11`}
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

// ─── File drop zone ────────────────────────────────────────────────────────────
function FileDropZone({
  label,
  hint,
  accept,
  file,
  onFile,
}: {
  label: string;
  hint: string;
  accept: string;
  file: File | null;
  onFile: (f: File | null) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div>
      <label className="block text-xs font-medium text-on-surface mb-1.5">{label}</label>
      <div
        role="button"
        tabIndex={0}
        onClick={() => ref.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && ref.current?.click()}
        className="border border-dashed border-surface bg-surface-deep/50 rounded-xl p-6 text-center hover:bg-surface-deep transition-colors cursor-pointer"
      >
        <input
          ref={ref}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => onFile(e.target.files?.[0] ?? null)}
        />
        {file ? (
          <div className="flex items-center justify-center gap-2">
            <FileText size={16} className="text-[#4BC957] shrink-0" />
            <span className="text-sm text-on-surface truncate max-w-[200px]">{file.name}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onFile(null);
                if (ref.current) ref.current.value = "";
              }}
              className="ml-1 text-on-surface-subtle hover:text-red-500 transition-colors"
              aria-label="Remove file"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <>
            <Upload className="h-5 w-5 text-on-surface-muted mx-auto mb-2" />
            <p className="text-xs text-on-surface-muted leading-relaxed">{hint}</p>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function SignupPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [accountType, setAccountType] = useState<"candidate" | "company">("candidate");
  const [errorMsg, setErrorMsg] = useState("");

  // Candidate fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [candidateEmail, setCandidateEmail] = useState("");
  const [candidatePassword, setCandidatePassword] = useState("");
  const [candidateConfirm, setCandidateConfirm] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);

  // Company fields
  const [companyName, setCompanyName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyPassword, setCompanyPassword] = useState("");
  const [companyConfirm, setCompanyConfirm] = useState("");
  const [licenceFile, setLicenceFile] = useState<File | null>(null);

  const [registerCandidate, { isLoading: loadingCandidate }] = useRegisterCandidateMutation();
  const [registerCompany, { isLoading: loadingCompany }] = useRegisterCompanyMutation();

  const isLoading = loadingCandidate || loadingCompany;

  // ── Candidate submit ──────────────────────────────────────────────────────
  async function handleCandidateSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    if (candidatePassword !== candidateConfirm) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    const formData = new FormData();
    formData.append("first_name", firstName);
    formData.append("last_name", lastName);
    formData.append("email", candidateEmail);
    formData.append("password", candidatePassword);
    formData.append("confirm_password", candidateConfirm);
    if (cvFile) formData.append("cv", cvFile);

    try {
      const result = await registerCandidate(formData).unwrap();
      dispatch(
        setTokens({
          access: result.data.access,
          refresh: result.data.refresh,
          email: result.data.email,
        })
      );
      router.push("/candidate");
    } catch (err: unknown) {
      const message =
        (err as { data?: { details?: string }; message?: string })?.data?.details ??
        (err as { message?: string })?.message ??
        "Registration failed. Please try again.";
      setErrorMsg(message);
    }
  }

  // ── Company submit ────────────────────────────────────────────────────────
  async function handleCompanySubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    if (companyPassword !== companyConfirm) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    const formData = new FormData();
    formData.append("company_name", companyName);
    formData.append("email", companyEmail);
    formData.append("password", companyPassword);
    formData.append("confirm_password", companyConfirm);
    if (licenceFile) formData.append("trade_licence", licenceFile);

    try {
      const result = await registerCompany(formData).unwrap();
      dispatch(
        setTokens({
          access: result.data.access,
          refresh: result.data.refresh,
          email: result.data.email,
        })
      );
      router.push("/company");
    } catch (err: unknown) {
      const message =
        (err as { data?: { details?: string }; message?: string })?.data?.details ??
        (err as { message?: string })?.message ??
        "Registration failed. Please try again.";
      setErrorMsg(message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4 py-12 text-on-surface">
      <div className="w-full max-w-[450px] bg-surface-card border border-surface rounded-3xl p-6 sm:p-10 shadow-2xl">

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

        <h1 className="text-xl sm:text-2xl font-bold text-on-surface mb-2">Create your account</h1>
        <p className="text-on-surface-muted text-sm mb-6">Start progressing in under a minute.</p>

        {/* Toggle */}
        <div className="flex bg-surface-deep border border-surface p-1 rounded-2xl mb-8">
          {(["candidate", "company"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => { setAccountType(type); setErrorMsg(""); }}
              className={`flex-1 py-2.5 text-sm font-medium rounded-xl transition-all capitalize ${accountType === type
                ? "bg-[#4BC957] text-white"
                : "text-on-surface-muted hover:text-on-surface"
                }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Error message (shared) */}
        {errorMsg && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
            {errorMsg}
          </div>
        )}

        {/* ── Candidate Form ─────────────────────────────────────────────── */}
        {accountType === "candidate" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
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

            <form className="space-y-4" onSubmit={handleCandidateSubmit}>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-on-surface mb-1.5">First name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Isabella"
                    required
                    maxLength={150}
                    className={inputCls}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-on-surface mb-1.5">Last name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Brock"
                    required
                    maxLength={150}
                    className={inputCls}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-on-surface mb-1.5">Email</label>
                <input
                  type="email"
                  value={candidateEmail}
                  onChange={(e) => setCandidateEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className={inputCls}
                />
              </div>

              <PasswordInput
                label="Password"
                value={candidatePassword}
                onChange={setCandidatePassword}
                required
              />

              <PasswordInput
                label="Confirm password"
                value={candidateConfirm}
                onChange={setCandidateConfirm}
                placeholder="Re-enter password"
                required
              />

              <FileDropZone
                label="CV / Résumé"
                hint={"Upload CV (PDF / DOCX) — AI parses into a structured profile"}
                accept=".pdf,.doc,.docx"
                file={cvFile}
                onFile={setCvFile}
              />

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-[#4BC957] hover:bg-[#00B96E] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold px-6 py-3 rounded-xl transition-all mt-2"
              >
                {/*{isLoading && <Loader2 size={16} className="animate-spin" />}*/}
                {isLoading ? "Creating account…" : "Create account & start matching"}
              </button>
            </form>
          </div>
        )}

        {/* ── Company Form ──────────────────────────────────────────────── */}
        {accountType === "company" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <form className="space-y-4" onSubmit={handleCompanySubmit}>
              <div>
                <label className="block text-xs font-medium text-on-surface mb-1.5">Company name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Acme Corp"
                  required
                  maxLength={255}
                  className={inputCls}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-on-surface mb-1.5">Work email</label>
                <input
                  type="email"
                  value={companyEmail}
                  onChange={(e) => setCompanyEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                  className={inputCls}
                />
              </div>

              <PasswordInput
                label="Password"
                value={companyPassword}
                onChange={setCompanyPassword}
                required
              />

              <PasswordInput
                label="Confirm password"
                value={companyConfirm}
                onChange={setCompanyConfirm}
                placeholder="Re-enter password"
                required
              />

              <FileDropZone
                label="Trade licence"
                hint={"Upload trade licence (UAE / KSA / GCC) as PDF or DOCX"}
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                file={licenceFile}
                onFile={setLicenceFile}
              />

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-[#4BC957] hover:bg-[#00B96E] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold px-6 py-3 rounded-xl transition-all mt-2"
              >
                {/*{isLoading && <Loader2 size={16} className="animate-spin" />}*/}
                {isLoading ? "Creating account…" : "Create account"}
              </button>
            </form>
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-xs text-on-surface-muted">
            Already a member?{" "}
            <Link href="/login" className="text-[#4BC957] font-semibold hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
