import { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  X,
  Send,
  Bot,
  Sparkles,
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  User,
} from "lucide-react";
import { Card, Button } from "@/components/app/AppShell";
import { useServerFn } from "@tanstack/react-start";
import { askAiAssistant, escalateToAdmin } from "@/lib/chat.functions";
import { Logomark } from "@/components/brand/Logomark";

interface Message {
  role: "assistant" | "user" | "system";
  content: string;
}

const COMMON_ISSUES = [
  { id: "domain_verify", label: "🌐 Domain not verifying" },
  { id: "gmail_send_as", label: "✉️ Gmail Send-As setup" },
  { id: "spam_issues", label: "🛡️ Emails landing in spam" },
  { id: "bimi_logo", label: "✨ Show my logo in Gmail" },
  { id: "other", label: "💬 Other question / issue" },
];

export function SupportChatWidget({ userEmail }: { userEmail?: string }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi there! I'm your AI Support Assistant. Select a common issue below or type your question and I'll analyze your account in real-time.",
    },
  ]);
  const [input, setInput] = useState("");
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("Thinking...");
  const [escalated, setEscalated] = useState(false);
  const [escalating, setEscalating] = useState(false);

  const ask = useServerFn(askAiAssistant);
  const escalate = useServerFn(escalateToAdmin);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  useEffect(() => {
    const handleOpen = () => setOpen(true);
    window.addEventListener("open-ai-assistant", handleOpen);
    return () => window.removeEventListener("open-ai-assistant", handleOpen);
  }, []);

  function getDynamicLoadingStatus(text: string) {
    const lower = text.toLowerCase();
    if (lower.includes("logged in") || lower.includes("account") || lower.includes("user")) {
      return "Checking your account session...";
    }
    if (
      lower.includes("domain") ||
      lower.includes("dns") ||
      lower.includes("mx") ||
      lower.includes("spf") ||
      lower.includes("txt")
    ) {
      return "Inspecting DNS & domain configuration...";
    }
    if (lower.includes("gmail") || lower.includes("inbox") || lower.includes("send as")) {
      return "Checking Gmail routing status...";
    }
    if (
      lower.includes("price") ||
      lower.includes("cost") ||
      lower.includes("save") ||
      lower.includes("workspace")
    ) {
      return "Calculating pricing & savings...";
    }
    if (lower.includes("deliverability") || lower.includes("spam") || lower.includes("blacklist")) {
      return "Scanning deliverability metrics...";
    }
    if (lower.includes("bimi") || lower.includes("logo")) {
      return "Reviewing BIMI & logo guidelines...";
    }
    return "Composing response...";
  }

  async function handleSend(customText?: string) {
    const query = customText || input;
    if (!query.trim()) return;

    const newMsgs: Message[] = [...messages, { role: "user", content: query }];
    setMessages(newMsgs);
    if (!customText) setInput("");
    setLoadingStatus(getDynamicLoadingStatus(query));
    setBusy(true);

    try {
      const res = await ask({
        data: {
          message: query,
          userEmail: userEmail || undefined,
          selectedIssue: selectedIssue || undefined,
        },
      });

      setMessages([...newMsgs, { role: "assistant", content: res.reply }]);
    } catch {
      setMessages([
        ...newMsgs,
        {
          role: "assistant",
          content:
            "I ran into a temporary issue connecting. Would you like me to send your message directly to our human support team?",
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  async function handleEscalate() {
    setEscalating(true);
    try {
      const transcript = messages.map((m) => `${m.role.toUpperCase()}: ${m.content}`).join("\n\n");
      await escalate({
        data: {
          userEmail: userEmail || "customer@mailcoy.com",
          subject: selectedIssue ? `Support Request: ${selectedIssue}` : "Support Chat Escalation",
          conversationHistory: transcript,
        },
      });
      setEscalated(true);
      setMessages((prev) => [
        ...prev,
        {
          role: "system",
          content:
            "✅ Ticket created! Your issue has been forwarded to our platform Super Admin. We will reach out to your email shortly.",
        },
      ]);
    } catch {
      alert("Failed to escalate. Please try again.");
    } finally {
      setEscalating(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {/* Floating Chat Trigger Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="group relative flex items-center justify-center rounded-full bg-ink text-surface shadow-2xl h-[48px] w-[48px] sm:h-[56px] sm:w-[56px] transition-all duration-200 hover:scale-105 hover:-translate-y-1"
          aria-label="Open support chat"
        >
          <Logomark className="h-6 w-6 sm:h-7 sm:w-7" />
          <span className="absolute top-0 right-0 h-3 w-3 sm:h-3.5 sm:w-3.5 rounded-full bg-emerald-400 border-2 border-background animate-pulse" />
        </button>
      )}

      {/* Interactive Chat Window */}
      {open && (
        <Card className="fixed inset-x-3 bottom-3 sm:static sm:w-[400px] h-[520px] max-h-[85vh] p-0 flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 duration-200 border-line z-50">
          {/* Header */}
          <div className="px-4 py-3.5 bg-primary text-primary-foreground flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-white/20 grid place-items-center">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-display text-[14.5px] font-semibold">Mailcoy AI Specialist</h3>
                <span className="text-[11px] text-primary-foreground/80 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Online · Diagnostic
                  Active
                </span>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1 rounded-md hover:bg-white/10 text-primary-foreground/80 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-surface-muted/30 text-[13px]">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "assistant" && (
                  <div className="h-7 w-7 rounded-full bg-primary/10 text-primary grid place-items-center shrink-0 mt-0.5">
                    <Bot className="h-4 w-4" />
                  </div>
                )}
                <div
                  className={`rounded-2xl px-3.5 py-2.5 max-w-[82%] leading-relaxed prose prose-sm dark:prose-invert text-[12.5px] ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-none whitespace-pre-wrap font-medium"
                      : m.role === "system"
                        ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-[12px]"
                        : "bg-surface border border-line text-ink rounded-bl-none shadow-sm space-y-1.5"
                  }`}
                >
                  {m.role === "user" || m.role === "system" ? (
                    m.content
                  ) : (
                    <FormattedMessage content={m.content} />
                  )}
                </div>
              </div>
            ))}

            {/* Quick Issue Selection Buttons */}
            {messages.length === 1 && !selectedIssue && (
              <div className="pt-2 space-y-1.5">
                <span className="text-[11px] text-ink-3 uppercase font-medium tracking-wider block mb-1">
                  Quick Select Your Issue:
                </span>
                {COMMON_ISSUES.map((issue) => (
                  <button
                    key={issue.id}
                    onClick={() => {
                      setSelectedIssue(issue.id);
                      handleSend(`I need help with: ${issue.label}`);
                    }}
                    className="w-full text-left p-2 rounded-lg border border-line bg-surface hover:bg-ink/[0.03] text-[12.5px] text-ink transition flex items-center justify-between"
                  >
                    <span>{issue.label}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-ink-3" />
                  </button>
                ))}
              </div>
            )}

            {busy && (
              <div className="flex gap-2 items-center text-[12px] text-ink-3 italic">
                <Bot className="h-4 w-4 animate-spin text-primary" /> {loadingStatus}
              </div>
            )}

            {/* Human Escalation Option */}
            {messages.length > 2 && !escalated && (
              <div className="pt-2 text-center">
                <button
                  onClick={handleEscalate}
                  disabled={escalating}
                  className="text-[12px] text-primary hover:underline font-medium inline-flex items-center gap-1"
                >
                  <AlertCircle className="h-3.5 w-3.5" />
                  {escalating
                    ? "Connecting to admin..."
                    : "Can't resolve? Escalate to Human Super Admin"}
                </button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 border-t border-line bg-surface flex gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question or explain your issue..."
              className="flex-1 text-[12.5px] px-3 py-2 rounded-lg border border-line bg-background text-ink placeholder:text-ink-4 outline-none focus:border-primary"
            />
            <Button type="submit" disabled={busy || !input.trim()} className="h-9 px-3">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </Card>
      )}
    </div>
  );
}

function FormattedMessage({ content }: { content: string }) {
  const lines = content.split("\n");

  return (
    <div className="space-y-1 text-[12.5px] leading-relaxed">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={i} className="h-1.5" />;

        // Bullet point
        if (trimmed.startsWith("* ") || trimmed.startsWith("- ") || trimmed.startsWith("• ")) {
          const text = trimmed.replace(/^[\*\-•]\s*/, "");
          return (
            <div key={i} className="flex gap-2 items-start pl-1">
              <span className="text-primary font-bold">•</span>
              <span className="flex-1">{renderInlineFormatting(text)}</span>
            </div>
          );
        }

        // Numbered list
        const numMatch = trimmed.match(/^(\d+)\.\s*(.*)$/);
        if (numMatch) {
          return (
            <div key={i} className="flex gap-2 items-start pl-1">
              <span className="font-semibold text-primary">{numMatch[1]}.</span>
              <span className="flex-1">{renderInlineFormatting(numMatch[2])}</span>
            </div>
          );
        }

        return <div key={i}>{renderInlineFormatting(line)}</div>;
      })}
    </div>
  );
}

function renderInlineFormatting(text: string) {
  // Regex to split by **bold** or `code`
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold text-ink">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={index}
          className="px-1 py-0.5 rounded bg-ink/[0.06] font-mono text-[11.5px] text-ink"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}
