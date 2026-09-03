import React, { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  X,
  Send,
  Paperclip,
  FileText,
  Trash2,
  ChevronDown,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Plus,
} from "lucide-react";
import { getComposeContext, sendBusinessEmail } from "@/lib/compose.functions";

interface AttachmentItem {
  filename: string;
  size: number;
  content: string; // base64
  contentType?: string;
}

interface QuickComposeModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTo?: string;
  defaultSubject?: string;
  defaultFrom?: string;
  composeCtx?: any;
}

export function QuickComposeModal({
  isOpen,
  onClose,
  defaultTo,
  defaultSubject,
  defaultFrom,
  composeCtx: propComposeCtx,
}: QuickComposeModalProps) {
  const qc = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchContextFn = useServerFn(getComposeContext);
  const sendEmailFn = useServerFn(sendBusinessEmail);

  const { data: composeCtx, isLoading: isContextLoading } = useQuery({
    queryKey: ["compose-context"],
    queryFn: async () => fetchContextFn(),
    enabled: isOpen,
    staleTime: 60_000,
  });

  const [fromEmail, setFromEmail] = useState<string>("");
  const [fromName, setFromName] = useState<string>("");
  const [toInput, setToInput] = useState<string>("");
  const [toAddresses, setToAddresses] = useState<string[]>([]);
  const [ccInput, setCcInput] = useState<string>("");
  const [ccAddresses, setCcAddresses] = useState<string[]>([]);
  const [bccInput, setBccInput] = useState<string>("");
  const [bccAddresses, setBccAddresses] = useState<string[]>([]);
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [subject, setSubject] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [attachments, setAttachments] = useState<AttachmentItem[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Initialize defaults when context loads or modal opens
  useEffect(() => {
    if (composeCtx && composeCtx.senderIdentities.length > 0) {
      if (!fromEmail) {
        setFromEmail(composeCtx.senderIdentities[0].email);
        setFromName(composeCtx.senderIdentities[0].name);
      }
    }
  }, [composeCtx, fromEmail]);

  useEffect(() => {
    if (isOpen) {
      if (defaultTo && !toAddresses.includes(defaultTo)) {
        setToAddresses([defaultTo]);
      }
      if (defaultSubject) {
        setSubject(defaultSubject);
      }
      setErrorMessage(null);
      setSuccessMessage(null);
    }
  }, [isOpen, defaultTo, defaultSubject]);

  const sendMutation = useMutation({
    mutationFn: async () => {
      // Validate recipients
      if (toAddresses.length === 0 && !toInput.trim()) {
        throw new Error("Please add at least one recipient (To).");
      }

      let finalTo = [...toAddresses];
      if (toInput.trim() && !finalTo.includes(toInput.trim())) {
        finalTo.push(toInput.trim());
      }

      if (!subject.trim()) {
        throw new Error("Please enter a subject line.");
      }

      if (!body.trim()) {
        throw new Error("Please enter an email body.");
      }

      // Combine body + signature HTML
      const signature = composeCtx?.signatureHtml || "";
      const formattedBodyHtml = `
        <div style="font-family: Arial, sans-serif; font-size: 15px; color: #1e293b; line-height: 1.6;">
          <div style="white-space: pre-wrap;">${body.trim()}</div>
          ${signature}
        </div>
      `;

      return await sendEmailFn({
        data: {
          from: fromEmail,
          fromName: fromName || undefined,
          to: finalTo,
          cc: ccAddresses.length > 0 ? ccAddresses : undefined,
          bcc: bccAddresses.length > 0 ? bccAddresses : undefined,
          subject: subject.trim(),
          html: formattedBodyHtml,
          text: body.trim(),
          attachments:
            attachments.length > 0
              ? attachments.map((a) => ({
                  filename: a.filename,
                  content: a.content,
                  contentType: a.contentType,
                }))
              : undefined,
        },
      });
    },
    onSuccess: () => {
      setSuccessMessage("Business email dispatched successfully!");
      qc.invalidateQueries({ queryKey: ["email-logs"] });
      setTimeout(() => {
        onClose();
        resetForm();
      }, 1200);
    },
    onError: (err: any) => {
      setErrorMessage(err.message || "Failed to dispatch email");
    },
  });

  const resetForm = () => {
    setToAddresses([]);
    setToInput("");
    setCcAddresses([]);
    setCcInput("");
    setBccAddresses([]);
    setBccInput("");
    setShowCc(false);
    setShowBcc(false);
    setSubject("");
    setBody("");
    setAttachments([]);
    setSelectedTemplateId("");
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleAddRecipient = (
    type: "to" | "cc" | "bcc",
    value: string
  ) => {
    const clean = value.trim().replace(/,$/, "");
    if (!clean) return;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(clean)) {
      setErrorMessage(`"${clean}" is not a valid email address.`);
      return;
    }

    setErrorMessage(null);
    if (type === "to") {
      if (!toAddresses.includes(clean)) setToAddresses([...toAddresses, clean]);
      setToInput("");
    } else if (type === "cc") {
      if (!ccAddresses.includes(clean)) setCcAddresses([...ccAddresses, clean]);
      setCcInput("");
    } else if (type === "bcc") {
      if (!bccAddresses.includes(clean)) setBccAddresses([...bccAddresses, clean]);
      setBccInput("");
    }
  };

  const handleRemoveRecipient = (
    type: "to" | "cc" | "bcc",
    emailToRemove: string
  ) => {
    if (type === "to") {
      setToAddresses(toAddresses.filter((e) => e !== emailToRemove));
    } else if (type === "cc") {
      setCcAddresses(ccAddresses.filter((e) => e !== emailToRemove));
    } else if (type === "bcc") {
      setBccAddresses(bccAddresses.filter((e) => e !== emailToRemove));
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplateId(templateId);
    if (!templateId) return;
    const tpl = composeCtx?.templates.find((t) => t.id === templateId);
    if (tpl) {
      if (!subject) setSubject(tpl.subject || "");
      const cleanBody = tpl.html_body.replace(/<[^>]*>/g, "\n").trim();
      setBody(cleanBody);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      // 25MB limit check
      if (file.size > 25 * 1024 * 1024) {
        setErrorMessage(`File ${file.name} exceeds the 25MB limit.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = (reader.result as string).split(",")[1];
        setAttachments((prev) => [
          ...prev,
          {
            filename: file.name,
            size: file.size,
            content: base64Data,
            contentType: file.type || "application/octet-stream",
          },
        ]);
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-2xl bg-surface border border-line rounded-xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-line bg-background/50">
          <div className="flex items-center gap-2">
            <span className="text-[15px] font-semibold text-ink">New Business Message</span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
              Mailcoy Relay
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close compose modal"
            className="p-1 rounded-md text-ink-3 hover:text-ink hover:bg-ink/[0.05] transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Feedback Alerts */}
        {errorMessage && (
          <div className="flex items-center gap-2 px-5 py-2.5 bg-danger/10 text-danger text-xs border-b border-danger/20">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs border-b border-emerald-500/20">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3.5 text-sm">
          {/* From Selector */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-ink-3 w-12 shrink-0">From:</span>
            {isContextLoading ? (
              <div className="h-8 w-48 rounded bg-ink/5 animate-pulse" />
            ) : (
              <div className="relative flex-1">
                <select
                  value={fromEmail}
                  onChange={(e) => {
                    setFromEmail(e.target.value);
                    const sel = composeCtx?.senderIdentities.find((s) => s.email === e.target.value);
                    if (sel) setFromName(sel.name);
                  }}
                  className="w-full h-8 pl-2.5 pr-8 text-xs font-medium bg-background border border-line rounded-md text-ink focus:outline-none focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
                >
                  {(composeCtx?.senderIdentities || []).map((sender) => (
                    <option key={sender.email} value={sender.email}>
                      {sender.name} &lt;{sender.email}&gt; {sender.isPrimary ? "(Primary)" : ""}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-ink-3 pointer-events-none" />
              </div>
            )}
          </div>

          {/* To Field */}
          <div className="flex items-start gap-3">
            <span className="text-xs font-medium text-ink-3 w-12 pt-1.5 shrink-0">To:</span>
            <div className="flex-1 flex flex-wrap items-center gap-1.5 p-1.5 min-h-[36px] bg-background border border-line rounded-md focus-within:ring-1 focus-within:ring-primary">
              {toAddresses.map((email) => (
                <span
                  key={email}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-primary/10 text-primary text-xs font-medium"
                >
                  {email}
                  <button
                    type="button"
                    onClick={() => handleRemoveRecipient("to", email)}
                    className="hover:text-danger"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              <input
                type="email"
                placeholder={toAddresses.length === 0 ? "client@example.com (press Enter or comma)" : ""}
                value={toInput}
                onChange={(e) => setToInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === "," || e.key === " ") {
                    e.preventDefault();
                    handleAddRecipient("to", toInput);
                  }
                }}
                onBlur={() => handleAddRecipient("to", toInput)}
                className="flex-1 min-w-[140px] bg-transparent text-xs text-ink focus:outline-none px-1"
              />
            </div>
            <div className="flex items-center gap-1 pt-1 text-xs text-ink-4">
              {!showCc && (
                <button
                  type="button"
                  onClick={() => setShowCc(true)}
                  className="hover:text-ink transition"
                >
                  Cc
                </button>
              )}
              {!showBcc && (
                <button
                  type="button"
                  onClick={() => setShowBcc(true)}
                  className="hover:text-ink transition"
                >
                  Bcc
                </button>
              )}
            </div>
          </div>

          {/* CC Field */}
          {showCc && (
            <div className="flex items-start gap-3 animate-in fade-in duration-100">
              <span className="text-xs font-medium text-ink-3 w-12 pt-1.5 shrink-0">Cc:</span>
              <div className="flex-1 flex flex-wrap items-center gap-1.5 p-1.5 min-h-[36px] bg-background border border-line rounded-md focus-within:ring-1 focus-within:ring-primary">
                {ccAddresses.map((email) => (
                  <span
                    key={email}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-ink/10 text-ink text-xs font-medium"
                  >
                    {email}
                    <button
                      type="button"
                      onClick={() => handleRemoveRecipient("cc", email)}
                      className="hover:text-danger"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                <input
                  type="email"
                  placeholder="Add CC recipient..."
                  value={ccInput}
                  onChange={(e) => setCcInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === "," || e.key === " ") {
                      e.preventDefault();
                      handleAddRecipient("cc", ccInput);
                    }
                  }}
                  onBlur={() => handleAddRecipient("cc", ccInput)}
                  className="flex-1 min-w-[120px] bg-transparent text-xs text-ink focus:outline-none px-1"
                />
              </div>
            </div>
          )}

          {/* BCC Field */}
          {showBcc && (
            <div className="flex items-start gap-3 animate-in fade-in duration-100">
              <span className="text-xs font-medium text-ink-3 w-12 pt-1.5 shrink-0">Bcc:</span>
              <div className="flex-1 flex flex-wrap items-center gap-1.5 p-1.5 min-h-[36px] bg-background border border-line rounded-md focus-within:ring-1 focus-within:ring-primary">
                {bccAddresses.map((email) => (
                  <span
                    key={email}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-ink/10 text-ink text-xs font-medium"
                  >
                    {email}
                    <button
                      type="button"
                      onClick={() => handleRemoveRecipient("bcc", email)}
                      className="hover:text-danger"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                <input
                  type="email"
                  placeholder="Add BCC recipient..."
                  value={bccInput}
                  onChange={(e) => setBccInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === "," || e.key === " ") {
                      e.preventDefault();
                      handleAddRecipient("bcc", bccInput);
                    }
                  }}
                  onBlur={() => handleAddRecipient("bcc", bccInput)}
                  className="flex-1 min-w-[120px] bg-transparent text-xs text-ink focus:outline-none px-1"
                />
              </div>
            </div>
          )}

          {/* Subject Field */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-ink-3 w-12 shrink-0">Subject:</span>
            <input
              type="text"
              placeholder="e.g. Partnership Proposal / Product Inquiry"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="flex-1 h-8 px-2.5 text-xs font-medium bg-background border border-line rounded-md text-ink focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Templates & Quick Actions */}
          <div className="flex items-center justify-between pt-1 pb-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-ink-4">Templates:</span>
              <select
                value={selectedTemplateId}
                onChange={(e) => handleTemplateSelect(e.target.value)}
                className="h-7 px-2 text-[11px] bg-background border border-line rounded text-ink-2 focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
              >
                <option value="">Insert template...</option>
                {(composeCtx?.templates || []).map((tpl) => (
                  <option key={tpl.id} value={tpl.id}>
                    {tpl.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-[11px] text-ink-4">
              Signature automatically attached
            </div>
          </div>

          {/* Body Editor */}
          <div className="space-y-2">
            <textarea
              rows={8}
              placeholder="Write your business message here..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full p-3 text-xs leading-relaxed bg-background border border-line rounded-md text-ink focus:outline-none focus:ring-1 focus:ring-primary resize-y"
            />
          </div>

          {/* Attachments List */}
          {attachments.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-medium text-ink-3">
                Attachments ({attachments.length}):
              </span>
              <div className="flex flex-wrap gap-2">
                {attachments.map((att, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-ink/[0.04] border border-line text-xs text-ink"
                  >
                    <Paperclip className="h-3 w-3 text-ink-3" />
                    <span className="truncate max-w-[180px]">{att.filename}</span>
                    <span className="text-[10px] text-ink-4">
                      ({Math.round(att.size / 1024)} KB)
                    </span>
                    <button
                      type="button"
                      onClick={() => removeAttachment(idx)}
                      className="text-ink-4 hover:text-danger ml-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-line bg-background/50">
          <div className="flex items-center gap-2">
            <input
              type="file"
              multiple
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-ink-2 hover:bg-ink/[0.05] border border-line transition cursor-pointer"
            >
              <Paperclip className="h-3.5 w-3.5" />
              <span>Attach files</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={sendMutation.isPending}
              className="px-3 py-1.5 text-xs font-medium text-ink-3 hover:text-ink hover:bg-ink/[0.05] rounded-md transition cursor-pointer"
            >
              Discard
            </button>
            <button
              type="button"
              onClick={() => sendMutation.mutate()}
              disabled={sendMutation.isPending}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium rounded-md bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 transition shadow-sm cursor-pointer"
            >
              {sendMutation.isPending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Dispatching...</span>
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" />
                  <span>Send Business Email</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}




