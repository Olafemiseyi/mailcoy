import { useState } from "react";
import { Card, Button } from "@/components/app/AppShell";
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle, Users, Download, X } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { addEmployee } from "@/lib/employees.functions";
import { useQueryClient } from "@tanstack/react-query";

interface BulkImportModalProps {
  domain: string;
  onClose: () => void;
}

interface ParsedEmployee {
  fullName: string;
  localPart: string;
  department?: string;
  jobTitle?: string;
  phone?: string;
  status: "pending" | "ready" | "error";
  error?: string;
}

export function BulkImportModal({ domain, onClose }: BulkImportModalProps) {
  const qc = useQueryClient();
  const add = useServerFn(addEmployee);
  const [csvText, setCsvText] = useState("");
  const [parsedList, setParsedList] = useState<ParsedEmployee[]>([]);
  const [importing, setImporting] = useState(false);
  const [importDone, setImportDone] = useState(false);
  const [successCount, setSuccessCount] = useState(0);

  function parseCSV(text: string) {
    const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    const results: ParsedEmployee[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      // skip header line if present
      if (i === 0 && (line.toLowerCase().includes("name") || line.toLowerCase().includes("email"))) {
        continue;
      }

      const parts = line.split(",").map((p) => p.trim().replace(/^["']|["']$/g, ""));
      if (parts.length >= 1 && parts[0]) {
        const fullName = parts[0];
        let localPart = parts[1] || "";
        if (!localPart) {
          localPart = fullName.toLowerCase().replace(/[^a-z0-9]/g, ".").replace(/\.+/g, ".").replace(/^\.+|\.+$/g, "");
        }
        const department = parts[2] || undefined;
        const jobTitle = parts[3] || undefined;
        const phone = parts[4] || undefined;

        results.push({
          fullName,
          localPart: localPart.toLowerCase(),
          department,
          jobTitle,
          phone,
          status: "ready",
        });
      }
    }
    setParsedList(results);
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setCsvText(content);
      parseCSV(content);
    };
    reader.readAsText(file);
  }

  async function handleImport() {
    if (parsedList.length === 0) return;
    setImporting(true);
    let count = 0;

    for (const emp of parsedList) {
      try {
        await add({
          data: {
            full_name: emp.fullName,
            local_part: emp.localPart,
            domain: domain,
            job_title: emp.jobTitle,
            department: emp.department,
            phone_number: emp.phone,
          },
        });
        count++;
      } catch {
        // continue with other rows
      }
    }

    await qc.invalidateQueries({ queryKey: ["employees"] });
    setSuccessCount(count);
    setImporting(false);
    setImportDone(true);
  }

  const sampleCsvTemplate = "Full Name,Username,Department,Job Title,Phone\nJane Doe,jane.doe,Sales,Account Executive,+15550123\nAlex Smith,alex.smith,Engineering,Senior Developer,+15550124";

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 px-4 backdrop-blur-sm" role="dialog" aria-modal="true">
      <Card className="w-full max-w-xl p-0 overflow-hidden shadow-2xl animate-fadeIn">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary grid place-items-center">
              <FileSpreadsheet className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-display text-[16px] font-semibold text-ink">Bulk Import Employees</h2>
              <p className="text-[12px] text-ink-3">Upload a CSV or spreadsheet to create multiple accounts at once</p>
            </div>
          </div>
          <button onClick={onClose} className="text-ink-3 hover:text-ink p-1 rounded-md">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {!importDone ? (
            <>
              {/* Dropzone / Upload area */}
              <div className="rounded-xl border-2 border-dashed border-line hover:border-primary/40 bg-surface-muted/40 p-6 text-center transition">
                <Upload className="h-8 w-8 text-primary mx-auto mb-2 opacity-80" />
                <div className="text-[13px] font-medium text-ink mb-1">
                  Upload employee roster (.csv)
                </div>
                <p className="text-[11.5px] text-ink-3 mb-3">
                  Columns: <code>Full Name, Username, Department, Job Title, Phone</code>
                </p>
                <label className="inline-flex cursor-pointer items-center justify-center rounded-lg bg-primary px-3.5 py-1.5 text-[12.5px] font-medium text-primary-foreground hover:bg-primary-focus transition">
                  Choose CSV File
                  <input type="file" accept=".csv,text/csv" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>

              {/* Paste or Preview */}
              {parsedList.length > 0 ? (
                <div>
                  <div className="flex items-center justify-between text-[12px] font-medium text-ink-2 mb-2">
                    <span>Preview ({parsedList.length} employees found):</span>
                    <span className="text-primary font-mono font-normal">@{domain}</span>
                  </div>
                  <div className="max-h-48 overflow-y-auto rounded-lg border border-line bg-surface divide-y divide-line">
                    {parsedList.map((emp, i) => (
                      <div key={i} className="px-3.5 py-2 text-[12px] flex items-center justify-between">
                        <div>
                          <strong className="text-ink font-medium">{emp.fullName}</strong>
                          <span className="text-ink-3 font-mono ml-2">{emp.localPart}@{domain}</span>
                        </div>
                        {emp.department && (
                          <span className="text-[11px] bg-ink/[0.04] px-2 py-0.5 rounded text-ink-3">
                            {emp.department}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between text-[11.5px] text-ink-3 mb-1">
                    <span>Or paste CSV text:</span>
                    <button
                      onClick={() => {
                        setCsvText(sampleCsvTemplate);
                        parseCSV(sampleCsvTemplate);
                      }}
                      className="text-primary hover:underline inline-flex items-center gap-1"
                    >
                      <Download className="h-3 w-3" /> Load sample CSV
                    </button>
                  </div>
                  <textarea
                    rows={3}
                    value={csvText}
                    onChange={(e) => {
                      setCsvText(e.target.value);
                      parseCSV(e.target.value);
                    }}
                    placeholder="Jane Doe, jane.doe, Sales, Account Executive, +15550123"
                    className="w-full text-[12px] font-mono p-3 rounded-lg border border-line bg-surface text-ink placeholder:text-ink-4 focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-line">
                <Button variant="ghost" onClick={onClose} disabled={importing}>
                  Cancel
                </Button>
                <Button
                  onClick={handleImport}
                  disabled={importing || parsedList.length === 0}
                >
                  {importing ? "Importing Roster…" : `Import ${parsedList.length || 0} Employees`}
                </Button>
              </div>
            </>
          ) : (
            <div className="py-6 text-center space-y-3">
              <div className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-600 mx-auto grid place-items-center">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="font-display text-[16px] font-semibold text-ink">Import Complete!</h3>
              <p className="text-[13px] text-ink-3">
                Successfully created <strong>{successCount}</strong> professional employee accounts under <code>@{domain}</code>.
              </p>
              <Button onClick={onClose} className="mt-2">
                Done
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
