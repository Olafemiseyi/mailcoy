import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useChat } from "@ai-sdk/react";
import type { UIMessage } from "ai";
import { Send, Bot, ChevronDown, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getMyOrganization } from "@/lib/orgs.functions";
import { Logomark } from "@/components/brand/Logomark";

export function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const getOrgFn = useServerFn(getMyOrganization);
  const { data: org } = useQuery({ queryKey: ["organization"], queryFn: getOrgFn });

  // Listen for global open events
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-ai-assistant", handleOpen);
    return () => window.removeEventListener("open-ai-assistant", handleOpen);
  }, []);

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        title="Chat with Mailcoy AI"
        className={
          "fixed bottom-6 right-6 p-4 bg-primary text-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.18)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.28)] hover:scale-110 active:scale-95 transition-all duration-300 z-50 flex items-center justify-center " +
          (isOpen ? "scale-0 opacity-0 pointer-events-none" : "scale-100 opacity-100")
        }
      >
        <Logomark className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      <div
        className={
          "fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[420px] sm:h-[650px] bg-surface sm:border border-line sm:rounded-2xl shadow-2xl flex flex-col z-50 transition-all duration-300 origin-bottom-right " +
          (isOpen ? "sm:scale-100 opacity-100" : "sm:scale-95 opacity-0 pointer-events-none")
        }
      >
        {/* Only mount the chat once org is loaded so useChat gets a valid organizationId */}
        {org?.id ? (
          <ChatInner orgId={org.id} setIsOpen={setIsOpen} />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-surface sm:rounded-2xl">
            <Loader2 className="w-6 h-6 text-primary animate-spin mb-4" />
            <p className="text-sm text-ink-2">Connecting to AI Assistant...</p>
          </div>
        )}
      </div>
    </>
  );
}

import { DefaultChatTransport } from "ai";

function ChatInner({ orgId, setIsOpen }: { orgId: string; setIsOpen: (v: boolean) => void }) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const transport = React.useMemo(() => new DefaultChatTransport({
    api: "/api/chat",
    body: { organizationId: orgId }
  }), [orgId]);

  const { messages, status, sendMessage, error } = useChat({
    transport
  });

  const [input, setInput] = React.useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || status === "streaming" || status === "submitted") return;
    sendMessage({ role: "user", content: input } as any);
    setInput("");
  };

  const isLoading = status === "streaming" || status === "submitted";

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const SUGGESTIONS = [
    "Add a new domain called mycompany.com",
    "How many emails have I sent today?",
    "Check the verification status of my domains",
    "Update my catch-all routing to reject",
    "How many emails were received this week?",
  ];

  const [randomSuggestions, setRandomSuggestions] = useState<string[]>([]);
  useEffect(() => {
    const shuffled = [...SUGGESTIONS].sort(() => 0.5 - Math.random());
    setRandomSuggestions(shuffled.slice(0, 2));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-line bg-gradient-to-r from-primary/10 to-transparent sm:rounded-t-2xl shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Bot className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-ink text-sm">Mailcoy AI</h3>
            <p className="text-xs text-emerald-500 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Online
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-ink-3 hover:text-ink p-2 hover:bg-surface-2 rounded-lg transition-colors"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 && (
          <div className="text-center text-ink-3 text-sm mt-12 flex flex-col items-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Logomark className="w-8 h-8 text-primary opacity-80" />
            </div>
            <h4 className="font-medium text-ink mb-2">How can I help?</h4>
            <p className="max-w-[80%] mx-auto text-xs leading-relaxed">
              I can provision new domains, check DNS verification statuses, configure routing rules, or analyze your workspace traffic.
            </p>
            <div className="mt-6 flex flex-col gap-2 w-full px-4">
              <div className="text-[11px] font-semibold tracking-wider uppercase text-ink-3 text-left">
                Try asking:
              </div>
              {randomSuggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  className="text-left text-xs p-3 bg-surface-2 hover:bg-line/30 rounded-xl border border-line transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    sendMessage({ role: "user", content: suggestion } as any);
                  }}
                >
                  &ldquo;{suggestion}&rdquo;
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m: UIMessage) => (
          <MessageBubble key={m.id} message={m} />
        ))}

        {/* Streaming / thinking indicator */}
        {isLoading && messages.length > 0 && messages[messages.length - 1].role === "user" && (
          <div className="flex justify-start">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2 shrink-0 mt-1">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div className="bg-surface-2 border border-line rounded-2xl rounded-tl-sm px-5 py-3 flex items-center gap-2">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-ink-3 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 bg-ink-3 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 bg-ink-3 rounded-full animate-bounce" />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex flex-col gap-1 items-center justify-center mt-4">
            <p className="text-xs text-red-600 font-medium flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              {error.message || "Failed to reach AI"}
            </p>
            <button
              onClick={() => {
                const last = messages[messages.length - 1];
                if (last) sendMessage({ role: "user", content: last.role === "user" ? (last.parts.find((p: any) => p.type === "text") as any)?.text ?? "" : "" } as any);
              }}
              className="text-[10px] bg-red-500/10 text-red-600 px-3 py-1 rounded-full font-medium hover:bg-red-500/20 transition-colors mt-1"
            >
              Retry
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-line bg-surface/80 backdrop-blur-md sm:rounded-b-2xl shrink-0">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask AI to manage your workspace..."
            disabled={isLoading}
            className="w-full bg-surface-2 border border-line rounded-full pl-5 pr-12 py-3.5 text-[14px] outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-ink shadow-sm transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-2 bg-primary text-white rounded-full disabled:opacity-40 disabled:bg-ink-3 transition-all shadow-sm hover:bg-primary/90"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </form>
        <div className="text-center mt-2">
          <span className="text-[10px] text-ink-3 font-medium">Powered by Mailcoy AI</span>
        </div>
      </div>
    </>
  );
}

// Renders a single message — handles both text and tool-call parts using the AI SDK v7 parts API
function MessageBubble({ message }: { message: UIMessage }) {
  const isUser = message.role === "user";

  return (
    <div className={"flex " + (isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2 shrink-0 mt-1">
          <Bot className="w-4 h-4 text-primary" />
        </div>
      )}
      <div className="max-w-[80%] flex flex-col gap-1.5">
        {message.parts ? message.parts.map((part: any, i: number) => {
          if (part.type === "text") {
            return (
              <div
                key={i}
                className={
                  "rounded-2xl px-4 py-3 text-[14px] leading-relaxed " +
                  (isUser
                    ? "bg-primary text-primary-foreground rounded-tr-sm"
                    : "bg-surface-2 border border-line text-ink rounded-tl-sm ai-markdown")
                }
              >
                {isUser ? (
                  <div className="whitespace-pre-wrap">{part.text}</div>
                ) : (
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                      ul: ({ node, ...props }) => <ul className="list-disc ml-4 mb-2" {...props} />,
                      ol: ({ node, ...props }) => <ol className="list-decimal ml-4 mb-2" {...props} />,
                      li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                      h1: ({ node, ...props }) => <h1 className="text-lg font-bold mb-2 mt-4 first:mt-0" {...props} />,
                      h2: ({ node, ...props }) => <h2 className="text-base font-bold mb-2 mt-4 first:mt-0" {...props} />,
                      h3: ({ node, ...props }) => <h3 className="text-sm font-bold mb-2 mt-3 first:mt-0" {...props} />,
                      table: ({ node, ...props }) => <div className="overflow-x-auto mb-4"><table className="w-full text-sm border-collapse" {...props} /></div>,
                      th: ({ node, ...props }) => <th className="border border-line bg-surface-muted px-3 py-2 text-left font-semibold" {...props} />,
                      td: ({ node, ...props }) => <td className="border border-line px-3 py-2" {...props} />,
                      a: ({ node, ...props }) => <a className="text-primary underline hover:opacity-80" target="_blank" rel="noopener noreferrer" {...props} />,
                      code: ({ node, className, children, ...props }) => {
                        const match = /language-(\w+)/.exec(className || '');
                        const isInline = !match && !className?.includes('language-');
                        return isInline ? (
                          <code className="bg-ink/10 px-1 py-0.5 rounded text-[0.9em] font-mono" {...props}>{children}</code>
                        ) : (
                          <div className="bg-ink text-surface rounded-md p-3 mb-2 overflow-x-auto text-[0.9em] font-mono">
                            <code className={className} {...props}>{children}</code>
                          </div>
                        );
                      }
                    }}
                  >
                    {part.text}
                  </ReactMarkdown>
                )}
              </div>
            );
          }

          // Tool call parts (static tools show as "tool-<name>", dynamic as "dynamic-tool")
          if (part.type?.startsWith("tool-") || part.type === "dynamic-tool") {
            const toolName: string = part.type === "dynamic-tool" ? (part.toolName ?? "tool") : part.type.replace(/^tool-/, "");
            const isDone = part.state === "output-available" || part.state === "output-error";
            return (
              <div
                key={i}
                className="text-[11px] bg-surface border border-line p-2.5 rounded-xl flex items-center gap-2 shadow-sm font-medium"
              >
                {isDone ? (
                  part.state === "output-error" ? (
                    <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  )
                ) : (
                  <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />
                )}
                <span className="text-ink-2 font-mono">{toolName}</span>
                <span className="text-ink-3 ml-auto opacity-70">
                  {isDone ? (part.state === "output-error" ? "Error" : "Complete") : "Running..."}
                </span>
              </div>
            );
          }

          return null;
        }) : (
          <>
            {/* Fallback for older message formats (content + toolInvocations) */}
            {(message as any).content && (
              <div
                className={
                  "rounded-2xl px-4 py-3 text-[14px] leading-relaxed " +
                  (isUser
                    ? "bg-primary text-primary-foreground rounded-tr-sm"
                    : "bg-surface-2 border border-line text-ink rounded-tl-sm ai-markdown")
                }
              >
                {isUser ? (
                  <div className="whitespace-pre-wrap">{(message as any).content}</div>
                ) : (
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                      ul: ({ node, ...props }) => <ul className="list-disc ml-4 mb-2" {...props} />,
                      ol: ({ node, ...props }) => <ol className="list-decimal ml-4 mb-2" {...props} />,
                      li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                      h1: ({ node, ...props }) => <h1 className="text-lg font-bold mb-2 mt-4 first:mt-0" {...props} />,
                      h2: ({ node, ...props }) => <h2 className="text-base font-bold mb-2 mt-4 first:mt-0" {...props} />,
                      h3: ({ node, ...props }) => <h3 className="text-sm font-bold mb-2 mt-3 first:mt-0" {...props} />,
                      table: ({ node, ...props }) => <div className="overflow-x-auto mb-4"><table className="w-full text-sm border-collapse" {...props} /></div>,
                      th: ({ node, ...props }) => <th className="border border-line bg-surface-muted px-3 py-2 text-left font-semibold" {...props} />,
                      td: ({ node, ...props }) => <td className="border border-line px-3 py-2" {...props} />,
                      a: ({ node, ...props }) => <a className="text-primary underline hover:opacity-80" target="_blank" rel="noopener noreferrer" {...props} />,
                      code: ({ node, className, children, ...props }) => {
                        const match = /language-(\w+)/.exec(className || '');
                        const isInline = !match && !className?.includes('language-');
                        return isInline ? (
                          <code className="bg-ink/10 px-1 py-0.5 rounded text-[0.9em] font-mono" {...props}>{children}</code>
                        ) : (
                          <div className="bg-ink text-surface rounded-md p-3 mb-2 overflow-x-auto text-[0.9em] font-mono">
                            <code className={className} {...props}>{children}</code>
                          </div>
                        );
                      }
                    }}
                  >
                    {(message as any).content}
                  </ReactMarkdown>
                )}
              </div>
            )}
            {(message as any).toolInvocations?.map((tool: any, i: number) => {
              const isDone = "result" in tool || tool.state === "result";
              return (
                <div
                  key={`tool-${i}`}
                  className="text-[11px] bg-surface border border-line p-2.5 rounded-xl flex items-center gap-2 shadow-sm font-medium"
                >
                  {isDone ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />
                  )}
                  <span className="text-ink-2 font-mono">{tool.toolName}</span>
                  <span className="text-ink-3 ml-auto opacity-70">
                    {isDone ? "Complete" : "Running..."}
                  </span>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
