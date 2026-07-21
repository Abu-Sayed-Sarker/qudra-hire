"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Inbox from "@/components/shared/Inbox";

function CompanyInboxContent() {
  const searchParams = useSearchParams();
  const conversationId = searchParams.get("id") ?? undefined;

  return (
    <Inbox
      title="Hiring Workspace"
      subtitle="Inbox"
      showSearch
      showMatchBadge
      initialConversationId={conversationId}
    />
  );
}

export default function CompanyInboxPage() {
  return (
    <Suspense fallback={<div className="p-8 text-muted-foreground">Loading...</div>}>
      <CompanyInboxContent />
    </Suspense>
  );
}
