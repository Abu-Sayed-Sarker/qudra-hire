"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Inbox from "@/components/shared/Inbox";

function CandidateInboxContent() {
  const searchParams = useSearchParams();
  const conversationId = searchParams.get("id") ?? undefined;

  return (
    <Inbox
      title="Messages"
      subtitle="Talk directly with recruiters — no recruiter spam, no email tag."
      initialConversationId={conversationId}
    />
  );
}

export default function CandidateInboxPage() {
  return (
    <Suspense fallback={<div className="p-8 text-muted-foreground">Loading...</div>}>
      <CandidateInboxContent />
    </Suspense>
  );
}
