"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Phone, Clock, MessageSquare, Send, CheckCircle2, ChevronRight, Headphones, AlertTriangle } from "lucide-react";
import { Animate } from "@/components/ui/animate";
import { useSubmitContactFormMutation } from "@/store/authApi";

export default function ContactPage() {
  const [formState, setFormState] = useState({ firstName: "", lastName: "", email: "", topic: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [submitContactForm] = useSubmitContactFormMutation();

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setFormState(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await submitContactForm({
        full_name: `${formState.firstName} ${formState.lastName}`.trim(),
        email: formState.email,
        phone_number: "",
        message: formState.message,
      }).unwrap();
      setSubmitted(true);
    } catch {
      setError("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">

      {/* Hero */}
      <section className="relative py-20 sm:py-28 text-center overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 flex items-start justify-center">
          <div className="w-[600px] h-[300px] bg-[#4BC957]/6 rounded-full blur-[120px] mt-10" />
        </div>
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: "linear-gradient(currentColor 1px,transparent 1px),linear-gradient(90deg,currentColor 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="relative max-w-2xl mx-auto px-4">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight
            animate-[fadeInUp_0.7s_ease_forwards]">
            Get in <span className="text-[#4BC957]">touch.</span>
          </h1>
          <p className="mt-5 text-[16px] sm:text-lg text-on-surface-muted leading-relaxed
            animate-[fadeInUp_0.7s_0.2s_ease_forwards] opacity-0">
            Have a question about hiring, partnerships, or your account? Reach out and our GCC team will respond within one business day.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="flex-1 max-w-7xl mx-auto px-4 sm:px-8 pb-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Form */}
          <Animate className="animate-from-left lg:col-span-3">
            <div className="bg-surface-card border border-surface rounded-2xl p-7 sm:p-8 shadow-xl">
              {!submitted ? (
                <>
                  <div className="mb-6">
                    <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-[#4BC957]" /> Send a message
                    </h2>
                    <p className="text-sm text-on-surface-subtle mt-1">Fill in the form below and we will get back to you shortly.</p>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[["firstName", "First name", "Enter name"], ["lastName", "Last name", "Enter name"]].map(([name, label, placeholder]) => (
                        <div key={name} className="space-y-1.5">
                          <label htmlFor={name} className="text-sm font-medium text-on-surface-muted">{label}</label>
                          <input id={name} name={name} type="text" required placeholder={placeholder}
                            value={formState[name as keyof typeof formState]} onChange={handleChange}
                            className="w-full h-11 bg-surface-deep border border-surface text-on-surface placeholder:text-on-surface-subtle rounded-xl px-4 text-sm focus:outline-none focus:border-[#4BC957]/50 focus:ring-1 focus:ring-[#4BC957]/30 transition-all" />
                        </div>
                      ))}
                    </div>
                    {[["email", "Email", "text", "Enter email"], ["topic", "Topic", "text", "e.g. Partnership, Support, Sales"]].map(([name, label, , placeholder]) => (
                      <div key={name} className="space-y-1.5">
                        <label htmlFor={name} className="text-sm font-medium text-on-surface-muted">{label}</label>
                        <input id={name} name={name} type={name === "email" ? "email" : "text"} required={name === "email"} placeholder={placeholder}
                          value={formState[name as keyof typeof formState]} onChange={handleChange}
                          className="w-full h-11 bg-surface-deep border border-surface text-on-surface placeholder:text-on-surface-subtle rounded-xl px-4 text-sm focus:outline-none focus:border-[#4BC957]/50 focus:ring-1 focus:ring-[#4BC957]/30 transition-all" />
                      </div>
                    ))}
                     <div className="space-y-1.5">
                       <label htmlFor="message" className="text-sm font-medium text-on-surface-muted">Message</label>
                       <textarea id="message" name="message" required rows={5} placeholder="How can we help you?"
                         value={formState.message} onChange={handleChange}
                         className="w-full bg-surface-deep border border-surface text-on-surface placeholder:text-on-surface-subtle rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#4BC957]/50 focus:ring-1 focus:ring-[#4BC957]/30 transition-all resize-none" />
                     </div>
                     {error && (
                       <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3">
                         <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" />
                         <p className="text-sm text-red-500 font-medium">{error}</p>
                       </div>
                     )}
                     <button type="submit" disabled={loading}
                      className="w-full h-12 bg-[#4BC957] hover:bg-[#00B96E] disabled:opacity-60 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-[#4BC957]/10">
                      {loading ? <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg> : <Send className="h-4 w-4" />}
                      {loading ? "Sending…" : "Send message"}
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-accent-tint border border-accent flex items-center justify-center">
                    <CheckCircle2 className="h-8 w-8 text-[#4BC957]" />
                  </div>
                  <h2 className="text-xl font-bold text-on-surface">Message sent!</h2>
                  <p className="text-on-surface-muted max-w-xs leading-relaxed">Thanks for reaching out. Our team will get back to you within one business day.</p>
                  <button onClick={() => { setSubmitted(false); setFormState({ firstName: "", lastName: "", email: "", topic: "", message: "" }); }}
                    className="mt-2 text-sm text-[#4BC957] hover:underline font-medium flex items-center gap-1">
                    Send another message <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </Animate>

          {/* Info Cards */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <Animate className="animate-from-right" delay="anim-delay-100">
              <div className="bg-surface-card border border-surface rounded-2xl p-6 space-y-4 shadow-xl">
                <h3 className="text-base font-bold text-on-surface">General inquiries</h3>
                <ul className="space-y-3">
                  {[[Mail, "hello@CareerSprint.com"], [Phone, "+971 4 555 0199"], [Clock, "Sun – Thu, 9:00 – 18:00 GST"]].map(([Icon, text], i) => {
                    const I = Icon as React.ElementType;
                    return (
                      <li key={i} className="flex items-center gap-3 text-sm text-on-surface-muted">
                        <span className="h-7 w-7 rounded-lg bg-accent-tint border border-accent flex items-center justify-center flex-shrink-0">
                          <I className="h-3.5 w-3.5 text-[#4BC957]" />
                        </span>
                        {text as string}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </Animate>

            <Animate className="animate-from-right" delay="anim-delay-200">
              <div className="bg-surface-card border border-surface rounded-2xl p-6 space-y-4 shadow-xl">
                <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                  <Headphones className="h-4 w-4 text-on-surface-muted" /> Support
                </h3>
                <ul className="space-y-3">
                  {[[Mail, "support@CareerSprint.com"], [Phone, "WhatsApp Business: +971 4 555 0199"]].map(([Icon, text], i) => {
                    const I = Icon as React.ElementType;
                    return (
                      <li key={i} className="flex items-center gap-3 text-sm text-on-surface-muted">
                        <span className="h-7 w-7 rounded-lg bg-accent-tint border border-accent flex items-center justify-center flex-shrink-0">
                          <I className="h-3.5 w-3.5 text-[#4BC957]" />
                        </span>
                        {text as string}
                      </li>
                    );
                  })}
                </ul>
                <p className="text-xs text-on-surface-subtle leading-relaxed border-t border-surface pt-4">
                  For fastest resolution, include your account email and a screenshot if applicable.
                </p>
              </div>
            </Animate>

            <Animate className="animate-from-right" delay="anim-delay-300">
              <div className="bg-surface-card border border-surface rounded-2xl p-6 space-y-3 shadow-xl">
                <h3 className="text-sm font-bold text-on-surface-muted">Quick links</h3>
                <div className="flex flex-col gap-2">
                  {[{ label: "Help Center", href: "/" }, { label: "Pricing Plans", href: "/pricing" }, { label: "About CareerSprint", href: "/about" }].map(link => (
                    <Link key={link.label} href={link.href}
                      className="flex items-center justify-between text-sm text-on-surface-subtle hover:text-[#4BC957] transition-colors group">
                      <span>{link.label}</span>
                      <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  ))}
                </div>
              </div>
            </Animate>
          </div>
        </div>
      </section>
    </div>
  );
}
