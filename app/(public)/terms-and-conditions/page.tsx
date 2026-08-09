"use client";

import React from "react";
import { Animate } from "@/components/ui/animate";

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface">
      <section className="relative pt-24 pb-12 sm:pt-32 sm:pb-16 text-center overflow-hidden">
        <div className="relative max-w-4xl mx-auto px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-on-surface">
            Terms & Conditions
          </h1>
          <p className="mt-4 text-sm sm:text-base md:text-lg text-on-surface-muted leading-relaxed max-w-2xl mx-auto">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-8 pb-20 w-full">
        <Animate className="animate-from-bottom">
          <div className="bg-surface-card border border-surface rounded-3xl p-8 sm:p-12 text-on-surface-muted max-w-none">
            <h2 className="text-2xl font-bold text-on-surface mb-4">1. Agreement to Terms</h2>
            <p className="mb-6 leading-relaxed">
              These Terms and Conditions constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and CareerSprint ("we," "us" or "our"), concerning your access to and use of our platform and website.
            </p>
            
            <h2 className="text-2xl font-bold text-on-surface mb-4">2. Intellectual Property Rights</h2>
            <p className="mb-6 leading-relaxed">
              Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us.
            </p>

            <h2 className="text-2xl font-bold text-on-surface mb-4">3. User Representations</h2>
            <p className="mb-6 leading-relaxed">
              By using the Site, you represent and warrant that: 
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 leading-relaxed">
              <li>All registration information you submit will be true, accurate, current, and complete.</li>
              <li>You will maintain the accuracy of such information and promptly update such registration information as necessary.</li>
              <li>You have the legal capacity and you agree to comply with these Terms and Conditions.</li>
              <li>You will not use the Site for any illegal or unauthorized purpose.</li>
            </ul>

            <h2 className="text-2xl font-bold text-on-surface mb-4">4. Prohibited Activities</h2>
            <p className="mb-6 leading-relaxed">
              You may not access or use the Site for any purpose other than that for which we make the Site available. The Site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.
            </p>

            <h2 className="text-2xl font-bold text-on-surface mb-4">5. Governing Law</h2>
            <p className="mb-6 leading-relaxed">
              These Terms shall be governed by and defined following the laws of the applicable jurisdiction. CareerSprint and yourself irrevocably consent that the courts of the applicable jurisdiction shall have exclusive jurisdiction to resolve any dispute which may arise in connection with these terms.
            </p>

            <h2 className="text-2xl font-bold text-on-surface mb-4">6. Contact Us</h2>
            <p className="leading-relaxed">
              In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at legal@careersprint.com.
            </p>
          </div>
        </Animate>
      </section>
    </div>
  );
}
