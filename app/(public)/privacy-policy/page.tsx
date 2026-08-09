"use client";

import React from "react";
import { Animate } from "@/components/ui/animate";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface">
      <section className="relative pt-24 pb-12 sm:pt-32 sm:pb-16 text-center overflow-hidden">
        <div className="relative max-w-4xl mx-auto px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-on-surface">
            Privacy Policy
          </h1>
          <p className="mt-4 text-sm sm:text-base md:text-lg text-on-surface-muted leading-relaxed max-w-2xl mx-auto">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-8 pb-20 w-full">
        <Animate className="animate-from-bottom">
          <div className="bg-surface-card border border-surface rounded-3xl p-8 sm:p-12 text-on-surface-muted max-w-none">
            <h2 className="text-2xl font-bold text-on-surface mb-4">1. Introduction</h2>
            <p className="mb-6 leading-relaxed">
              Welcome to CareerSprint. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights.
            </p>
            
            <h2 className="text-2xl font-bold text-on-surface mb-4">2. The Data We Collect</h2>
            <p className="mb-6 leading-relaxed">
              We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 leading-relaxed">
              <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
              <li><strong>Contact Data</strong> includes billing address, delivery address, email address and telephone numbers.</li>
              <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location.</li>
              <li><strong>Profile Data</strong> includes your resume, employment history, skills, and preferences.</li>
            </ul>

            <h2 className="text-2xl font-bold text-on-surface mb-4">3. How We Use Your Data</h2>
            <p className="mb-6 leading-relaxed">
              We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 leading-relaxed">
              <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
              <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
              <li>Where we need to comply with a legal obligation.</li>
            </ul>

            <h2 className="text-2xl font-bold text-on-surface mb-4">4. Data Security</h2>
            <p className="mb-6 leading-relaxed">
              We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorised way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
            </p>

            <h2 className="text-2xl font-bold text-on-surface mb-4">5. Contact Us</h2>
            <p className="leading-relaxed">
              If you have any questions about this privacy policy or our privacy practices, please contact us at privacy@careersprint.com.
            </p>
          </div>
        </Animate>
      </section>
    </div>
  );
}
