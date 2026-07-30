"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useCreateConversationMutation } from "@/store/authApi";
import { toast } from "sonner";
import Inbox from "@/components/shared/Inbox";

function CompanyInboxContent() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("user_id");
  const conversationId = searchParams.get("id") ?? undefined;

  const [createConversation, { isLoading: isCreating }] = useCreateConversationMutation();

  useEffect(() => {
    if (!userId || conversationId) return;

    const init = async () => {
      try {
        const result = await createConversation({ candidate_profile_id: userId }).unwrap();
        const newConversationId = result.data?.id;
        if (newConversationId) {
          const url = new URL(window.location.href);
          url.searchParams.set("id", newConversationId);
          window.history.replaceState({}, "", url.pathname + url.search);
        }
      } catch (err: any) {
        toast.error(err?.data?.details ?? "Failed to start conversation");
      }
    };

    init();
  }, [userId, conversationId, createConversation]);

  if (userId && !conversationId && isCreating) {
    return (
      <div className="p-4 md:p-8 max-w-full mx-auto h-[calc(100vh-2rem)] flex flex-col items-center justify-center">
        <p className="text-sm text-muted-foreground">Starting conversation...</p>
      </div>
    );
  }

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
