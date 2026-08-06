"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, Upload, X, FileText } from "lucide-react";
import { useRegisterCandidateMutation, useRegisterCompanyMutation, useGoogleLoginMutation } from "@/store/authApi";
import { setCredentials, setTokens } from "@/store/authSlice";
import { useAppDispatch } from "@/store/hooks";
import Image from "next/image";
import GoogleLoginButton from "@/components/shared/GoogleLoginButton";

const inputCls =
  "w-full bg-surface-deep border border-border rounded-xl px-4 py-3 text-sm text-on-surface placeholder:text-muted-foreground focus:outline-none focus:border-[#23C65F]/50 transition-colors";

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
      <label htmlFor={label} className="block text-xs font-medium text-on-surface mb-1.5">{label}</label>
      <div className="relative">
        <input
          id={label}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          aria-required={required}
          className={`${inputCls} pr-11`}
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-on-surface transition-colors"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
}

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
        className="border border-dashed border-border bg-surface-deep/50 rounded-xl p-6 text-center hover:bg-surface-deep transition-colors cursor-pointer"
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
            <FileText size={16} className="text-[#23C65F] shrink-0" />
            <span className="text-sm text-on-surface truncate max-w-[200px]">{file.name}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onFile(null);
                if (ref.current) ref.current.value = "";
              }}
              className="ml-1 text-muted-foreground hover:text-red-500 transition-colors"
              aria-label="Remove file"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <>
            <Upload className="h-5 w-5 text-muted-foreground mx-auto mb-2" />
            <p className="text-xs text-muted-foreground leading-relaxed">{hint}</p>
          </>
        )}
      </div>
    </div>
  );
}

export default function SignupPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [accountType, setAccountType] = useState<"candidate" | "company">("candidate");
  const [errorMsg, setErrorMsg] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [candidateEmail, setCandidateEmail] = useState("");
  const [candidatePassword, setCandidatePassword] = useState("");
  const [candidateConfirm, setCandidateConfirm] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);

  const [companyName, setCompanyName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyPassword, setCompanyPassword] = useState("");
  const [companyConfirm, setCompanyConfirm] = useState("");
  const [licenceFile, setLicenceFile] = useState<File | null>(null);

  const [registerCandidate, { isLoading: loadingCandidate }] = useRegisterCandidateMutation();
  const [registerCompany, { isLoading: loadingCompany }] = useRegisterCompanyMutation();
  const [googleLogin, { isLoading: isGoogleLoading }] = useGoogleLoginMutation();

  const isLoading = loadingCandidate || loadingCompany || isGoogleLoading;

  async function handleGoogleSuccess(credential: string) {
    setErrorMsg("");
    try {
      const result = await googleLogin({ credential }).unwrap();

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
        "Google sign up failed. Please try again.";
      setErrorMsg(message);
    }
  }

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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-[450px] bg-card border border-border rounded-2xl p-6 sm:p-10 shadow-sm"
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

        <h1 className="text-xl sm:text-2xl font-bold text-on-surface mb-2">Create your account</h1>
        <p className="text-muted-foreground text-sm mb-6">Start progressing in under a minute.</p>

        <div className="flex bg-surface-deep border border-border p-1 rounded-xl mb-8" role="tablist" aria-label="Account type">
          {(["candidate", "company"] as const).map((type) => {
            const label = type === "candidate" ? "Talent" : "Employer";
            return (
              <button
                key={type}
                type="button"
                role="tab"
                aria-selected={accountType === type}
                onClick={() => { setAccountType(type); setErrorMsg(""); }}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all capitalize ${accountType === type
                  ? "bg-[#23C65F] text-white"
                  : "text-muted-foreground hover:text-on-surface"
                  }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {errorMsg && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm" role="alert">
            {errorMsg}
          </div>
        )}

        {accountType === "candidate" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            role="tabpanel"
          >
            <GoogleLoginButton
              onSuccess={handleGoogleSuccess}
              onError={() => setErrorMsg("Google sign up failed. Please try again.")}
            />

            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 bg-border" />
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">OR</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <form className="space-y-4" onSubmit={handleCandidateSubmit} noValidate>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label htmlFor="c-firstName" className="block text-xs font-medium text-on-surface mb-1.5">First name</label>
                  <input
                    id="c-firstName"
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
                  <label htmlFor="c-lastName" className="block text-xs font-medium text-on-surface mb-1.5">Last name</label>
                  <input
                    id="c-lastName"
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
                <label htmlFor="c-email" className="block text-xs font-medium text-on-surface mb-1.5">Email</label>
                <input
                  id="c-email"
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
{/* 
              <FileDropZone
                label="CV / Résumé"
                hint="Upload CV (PDF / DOCX) — AI parses into a structured profile"
                accept=".pdf,.doc,.docx"
                file={cvFile}
                onFile={setCvFile}
              /> */}

              <button
                type="submit"
                disabled={isLoading}
                aria-label={isLoading ? "Creating account" : "Create account and start matching"}
                className="w-full flex items-center justify-center gap-2 bg-[#23C65F] hover:bg-[#1a9e4a] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold px-6 py-3 rounded-xl transition-all mt-2"
              >
                {/* {isLoading && <Loader2 size={16} className="animate-spin" />} */}
                {isLoading ? "Creating account…" : "Create account & start matching"}
              </button>
            </form>
          </motion.div>
        )}

        {accountType === "company" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            role="tabpanel"
          >
            <form className="space-y-4" onSubmit={handleCompanySubmit} noValidate>
              <div>
                <label htmlFor="co-name" className="block text-xs font-medium text-on-surface mb-1.5">Company name</label>
                <input
                  id="co-name"
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
                <label htmlFor="co-email" className="block text-xs font-medium text-on-surface mb-1.5">Work email</label>
                <input
                  id="co-email"
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

              {/* <FileDropZone
                label="Trade licence"
                hint="Upload trade licence (UAE / KSA / GCC) as PDF or DOCX"
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                file={licenceFile}
                onFile={setLicenceFile}
              /> */}

              <button
                type="submit"
                disabled={isLoading}
                aria-label={isLoading ? "Creating account" : "Create account"}
                className="w-full flex items-center justify-center gap-2 bg-[#23C65F] hover:bg-[#1a9e4a] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold px-6 py-3 rounded-xl transition-all mt-2"
              >
                {/* {isLoading && <Loader2 size={16} className="animate-spin" />} */}
                {isLoading ? "Creating account…" : "Create account"}
              </button>
            </form>
          </motion.div>
        )}

        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            Already a member?{" "}
            <Link href="/login" className="text-[#23C65F] font-semibold hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}