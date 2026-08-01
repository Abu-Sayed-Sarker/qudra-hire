"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Search, Send, Sparkles, ChevronLeft, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import {
  useGetConversationsQuery,
  useGetConversationMessagesQuery,
  useMarkConversationReadMutation,
  type ChatConversation,
  type ChatMessage,
} from "@/store/authApi";
import { get403Message } from "@/lib/utils";

const WS_BASE_URL =
  (process.env.NEXT_PUBLIC_API_URL ?? "https://api.career-sprint.com/api/v1")
    .replace(/^http/, "ws")
    .replace(/\/api\/v1$/, "");

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d`;
  return date.toLocaleDateString();
}

interface InboxProps {
  title: string;
  subtitle: string;
  showSearch?: boolean;
  showMatchBadge?: boolean;
  initialConversationId?: string;
}

export default function Inbox({
  title,
  subtitle,
  showSearch = false,
  showMatchBadge = false,
  initialConversationId,
}: InboxProps) {
  const router = useRouter();
  const accessToken = useAppSelector((state) => state.auth.accessToken);

  const [activeConversation, setActiveConversation] = useState<ChatConversation | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [inputText, setInputText] = useState("");
  const [showChatDetail, setShowChatDetail] = useState(false);
  const [wsMessages, setWsMessages] = useState<ChatMessage[]>([]);
  const [connected, setConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch conversations
  const { data: conversationsData, isLoading: conversationsLoading, isError: conversationsError, error: conversationsErrorData } =
    useGetConversationsQuery(debouncedSearch || undefined);

  // Fetch initial messages via REST API
  const { data: messagesData, isLoading: messagesLoading, isError: messagesError, error: messagesErrorData } =
    useGetConversationMessagesQuery(activeConversation?.id ?? "", {
      skip: !activeConversation,
    });

  // Mark conversation as read mutation
  const [markConversationRead] = useMarkConversationReadMutation();

  const conversations = conversationsData?.data ?? [];
  const restMessages = messagesData?.data ?? [];

  // Combine REST-fetched messages with WebSocket messages
  const messages = [...restMessages, ...wsMessages];

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // WebSocket connection
  const connectWebSocket = useCallback(
    (conversationId: string) => {
      // Close existing connection
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
        setConnected(false);
      }

      if (!accessToken) return;

      const wsUrl = `${WS_BASE_URL}/ws/chat/${conversationId}/?token=${accessToken}`;
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        setConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const newMessage: ChatMessage = {
            id: data.id || crypto.randomUUID(),
            conversation: conversationId,
            sender: data.sender || "",
            sender_name: data.sender_name || "",
            is_mine: data.is_mine ?? false,
            content: data.content || data.message || "",
            is_read: data.is_read ?? false,
            created_at: data.created_at || new Date().toISOString(),
          };
          setWsMessages((prev) => [...prev, newMessage]);
        } catch {
          // Ignore malformed messages
        }
      };

      ws.onclose = () => {
        setConnected(false);
      };

      ws.onerror = () => {
        setConnected(false);
      };

      wsRef.current = ws;
    },
    [accessToken]
  );

  // Disconnect WebSocket when conversation changes or component unmounts
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [activeConversation?.id]);

  // Connect WebSocket when conversation is selected
  useEffect(() => {
    if (activeConversation) {
      setWsMessages([]);
      connectWebSocket(activeConversation.id);
    }
  }, [activeConversation, connectWebSocket]);

  const selectConversation = useCallback(
    (conversation: ChatConversation) => {
      setActiveConversation(conversation);
      setShowChatDetail(true);
      // Update URL with conversation ID
      const url = new URL(window.location.href);
      url.searchParams.set("id", conversation.id);
      router.push(url.pathname + url.search, { scroll: false });
      if (conversation.unread_count > 0) {
        markConversationRead(conversation.id);
      }
    },
    [markConversationRead, router]
  );

  // Pre-select conversation from URL param
  useEffect(() => {
    if (initialConversationId && conversations.length > 0 && !activeConversation) {
      const match = conversations.find((c) => c.id === initialConversationId);
      if (match) {
        selectConversation(match);
      }
    }
  }, [initialConversationId, conversations, activeConversation, selectConversation]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConversation || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN)
      return;

    const content = inputText.trim();
    setInputText("");

    // Send via WebSocket — server echo will add the message
    wsRef.current.send(JSON.stringify({ message: content }));
  };

  const selectedParty = activeConversation?.other_party;

  return (
    <div className="p-4 md:p-8 max-w-full mx-auto h-[calc(100vh-2rem)] flex flex-col space-y-4 md:space-y-6">
      <div>
        <h1 className="text-sm font-medium text-on-surface-muted uppercase tracking-widest">{title}</h1>
        <p className="text-2xl md:text-3xl font-extrabold text-on-surface mt-1 tracking-tight">{subtitle}</p>
      </div>

      <div className="flex-1 bg-surface-card border border-surface rounded-2xl overflow-hidden flex flex-row min-h-0">
        {/* Chat List Sidebar - hidden on mobile when chat is open */}
        <div className={`${showChatDetail ? "hidden" : "flex"} md:flex w-full md:w-80 lg:w-[380px] border-r border-surface flex-col flex-shrink-0`}>
          {showSearch && (
            <div className="p-4 border-b border-surface">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-subtle" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-surface-deep border border-surface rounded-lg py-1.5 pl-9 pr-4 text-on-surface placeholder:text-on-surface-subtle focus:outline-none focus:border-[#4BC957]"
                />
              </div>
            </div>
          )}
          <div className="flex-1 overflow-y-auto divide-y divide-surface">
            {conversationsError ? (() => {
              const msg = get403Message(conversationsErrorData);
              return (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="h-12 w-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-3">
                    <AlertTriangle className="h-6 w-6 text-red-500" />
                  </div>
                  <p className="text-sm font-bold text-foreground mb-1">{msg ? "Access Denied" : "Failed to load conversations"}</p>
                  <p className="text-xs text-muted-foreground max-w-xs">{msg || "Something went wrong while fetching your messages."}</p>
                </div>
              );
            })() : conversationsLoading ? (
              <div className="flex items-center justify-center py-8 text-sm text-on-surface-muted">
                Loading conversations...
              </div>
            ) : conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-on-surface-muted">
                <p className="text-sm">No conversations found</p>
              </div>
            ) : (
              conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => selectConversation(conversation)}
                  className={`p-4 lg:p-5 flex gap-3 cursor-pointer transition-colors text-left ${
                    activeConversation?.id === conversation.id && showChatDetail
                      ? "bg-surface-item"
                      : "hover:bg-surface-item/50"
                  }`}
                >
                  <div className="h-10 w-10 rounded-xl bg-surface-item border border-surface flex items-center justify-center font-bold text-on-surface text-sm flex-shrink-0">
                    {conversation.other_party.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-on-surface truncate">{conversation.other_party.name}</p>
                      <span className="text-[13px] text-on-surface-subtle flex-shrink-0 ml-2">
                        {conversation.last_message ? timeAgo(conversation.last_message_at) : ""}
                      </span>
                    </div>
                    <p className="text-[13px] text-[#4BC957] truncate mt-0.5 font-medium">
                      {conversation.other_party.role_title}
                    </p>
                    <p className="text-on-surface-muted truncate mt-1">
                      {conversation.last_message?.content ?? "No messages yet"}
                    </p>
                  </div>
                  {conversation.unread_count > 0 && (
                    <span className="h-5 w-5 rounded-full bg-[#4BC957] flex items-center justify-center text-[13px] font-bold text-white flex-shrink-0 self-center">
                      {conversation.unread_count}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`${!showChatDetail ? "hidden" : "flex"} md:flex flex-1 flex-col bg-surface-deep`}>
          {activeConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 lg:p-5 border-b border-surface bg-surface-card flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowChatDetail(false)}
                    className="md:hidden text-on-surface-muted hover:text-on-surface transition-colors p-1"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <div className="h-10 w-10 rounded-xl bg-surface-item border border-surface flex items-center justify-center font-bold text-on-surface text-sm flex-shrink-0">
                    {selectedParty?.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-on-surface">{selectedParty?.name}</p>
                    <p className="text-on-surface-muted font-medium">
                      {selectedParty?.role_title}
                    </p>
                  </div>
                  {connected && (
                    <span className="h-2 w-2 rounded-full bg-green-500" title="Connected" />
                  )}
                </div>
                {showMatchBadge && (
                  <span className="text-[#4BC957] bg-[#4BC957]/10 px-2 py-0.5 rounded-md font-semibold flex items-center gap-1 border border-[#4BC957]/20">
                    <Sparkles className="h-3 w-3" />
                    Match
                  </span>
                )}
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4">
                {messagesError ? (() => {
                  const msg = get403Message(messagesErrorData);
                  return (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <div className="h-12 w-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-3">
                        <AlertTriangle className="h-6 w-6 text-red-500" />
                      </div>
                      <p className="text-sm font-bold text-foreground mb-1">{msg ? "Access Denied" : "Failed to load messages"}</p>
                      <p className="text-xs text-muted-foreground max-w-xs">{msg || "Something went wrong while fetching messages."}</p>
                    </div>
                  );
                })() : messagesLoading ? (
                  <div className="flex items-center justify-center py-8 text-sm text-on-surface-muted">
                    Loading messages...
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-on-surface-muted">
                    <p className="text-sm">No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col space-y-1 max-w-[85%] md:max-w-[70%] ${msg.is_mine ? "ml-auto items-end" : "items-start"}`}
                    >
                      {!msg.is_mine && (
                        <span className="text-[11px] text-on-surface-muted font-medium px-1">
                          {msg.sender_name}
                        </span>
                      )}
                      <div
                        className={`px-4 py-3 rounded-2xl font-medium leading-relaxed ${
                          msg.is_mine
                            ? "bg-[#4BC957] text-white rounded-tr-none"
                            : "bg-surface-item text-on-surface border border-surface rounded-tl-none"
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-surface bg-surface-card flex gap-3">
                <input
                  type="text"
                  placeholder="Write a message..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 bg-surface-deep border border-surface rounded-xl px-4 py-3 text-on-surface placeholder:text-on-surface-subtle focus:outline-none focus:border-[#4BC957] transition-colors"
                />
                <button
                  type="submit"
                  disabled={!connected || !inputText.trim()}
                  className="bg-[#4BC957] hover:bg-[#00B96E] text-white p-3 rounded-xl transition-all duration-200 shadow-md shadow-[#4BC957]/10 flex-shrink-0 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-on-surface-muted">
              <p className="text-sm">Select a conversation to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
