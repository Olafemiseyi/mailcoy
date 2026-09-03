import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useSuspenseQuery, useQueryClient, queryOptions, useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState, useEffect, useRef } from "react";
import { listEmployees, addEmployee, deleteEmployee } from "@/lib/employees.functions";
import { listDomains } from "@/lib/domains.functions";
import {
  PageHeader,
  Card,
  Button,
  Input,
  Field,
  StatusPill,
  CustomSelect,
} from "@/components/app/AppShell";
import {
  FileSpreadsheet,
  Search,
  Plus,
  BriefcaseBusiness,
  Mail,
  Send,
  Trash2,
  Users,
  ChevronRight,
  ChevronDown,
  Check,
  AlertCircle,
} from "lucide-react";
import { EmployeesSkeleton } from "@/components/Skeleton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { InviteModal } from "@/components/InviteModal";
import { BulkImportModal } from "@/components/BulkImportModal";
import { friendlyError } from "@/lib/errors";

const empOpts = queryOptions({
  queryKey: ["employees"],
  queryFn: async () => listEmployees(),
  staleTime: 15_000,
});
const domOpts = queryOptions({
  queryKey: ["domains"],
  queryFn: async () => listDomains(),
  staleTime: 30_000,
});

import { GlobalError } from "@/components/GlobalError";

export const Route = createFileRoute("/_authenticated/_shell/employees")({
  head: () => ({ meta: [{ title: "Employees — Mailcoy" }] }),
  loader: async ({ context }: any) => {
    await Promise.all([
      context.queryClient.ensureQueryData(empOpts),
      context.queryClient.ensureQueryData(domOpts),
    ]);
  },
  pendingMs: 0,
  pendingComponent: () => <EmployeesSkeleton />,
  errorComponent: ({ error, reset }) => <GlobalError error={error} reset={reset} />,
  component: EmployeesRoute,
});

const DEFAULT_DEPARTMENTS = [
  "Sales",
  "Marketing",
  "Engineering",
  "Product",
  "Operations",
  "Customer Support",
  "Human Resources",
  "Finance & Accounting",
  "Legal",
  "Executive & Management",
];

const DEFAULT_POSITIONS = [
  "Account Executive",
  "Sales Representative",
  "Sales Manager",
  "Marketing Specialist",
  "Marketing Lead",
  "Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Product Manager",
  "Operations Specialist",
  "Operations Manager",
  "Customer Support Specialist",
  "HR Specialist",
  "Financial Analyst",
  "Managing Director",
  "Founder & CEO",
];

function ComboboxField({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const filtered = value.trim()
    ? options.filter((o) => o.toLowerCase().includes(value.toLowerCase()))
    : options;

  return (
    <div className="relative w-full" ref={ref}>
      <div className="relative flex items-center">
        <Input
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="pr-8"
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setOpen(!open)}
          className="absolute right-2 p-1 text-ink-3 hover:text-ink cursor-pointer transition"
        >
          <ChevronDown
            className={`h-3.5 w-3.5 transition-transform duration-200 ${
              open ? "rotate-180 text-primary" : ""
            }`}
          />
        </button>
      </div>

      {open && filtered.length > 0 && (
        <div className="absolute left-0 top-full mt-1 w-full max-h-52 overflow-y-auto bg-surface border border-line rounded-xl shadow-xl z-50 p-1 animate-in fade-in duration-100">
          {filtered.map((opt) => (
            <button
              key={opt}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                onChange(opt);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-[13px] transition cursor-pointer flex items-center justify-between ${
                value.toLowerCase() === opt.toLowerCase()
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-ink hover:bg-surface-muted"
              }`}
            >
              <span>{opt}</span>
              {value.toLowerCase() === opt.toLowerCase() && (
                <Check className="h-3.5 w-3.5 text-primary" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function EmployeesRoute() {
  const path = useRouterState({
    select: (s: { location: { pathname: string } }) => s.location.pathname,
  });
  if (path !== "/employees") return <Outlet />;
  return <EmployeesList />;
}

type EmployeeRow = {
  id: string;
  full_name: string | null;
  professional_email: string | null;
  job_title: string | null;
  department: string | null;
  status: string;
  gmail_connected?: boolean;
  gmail_email?: string | null;
};

function EmployeesList() {
  const qc = useQueryClient();
  const { data: employees } = useSuspenseQuery(empOpts);
  const { data: domains } = useSuspenseQuery(domOpts);
  const add = useServerFn(addEmployee);
  const del = useServerFn(deleteEmployee);

  const [openAdd, setOpenAdd] = useState(false);
  const [openBulk, setOpenBulk] = useState(false);
  const [name, setName] = useState("");
  const [local, setLocal] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [phone, setPhone] = useState("");
  const [dom, setDom] = useState<string>(
    (domains[0] as { domain_name?: string })?.domain_name ?? "",
  );
  const [busy, setBusy] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<null | {
    id: string;
    name: string;
    email: string;
  }>(null);
  const [inviteFor, setInviteFor] = useState<EmployeeRow | null>(null);
  const [localEdited, setLocalEdited] = useState(false);

  useEffect(() => {
    if (!localEdited && name) {
      const suggested = name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, ".")
        .replace(/\.+/g, ".")
        .replace(/^\.+|\.+$/g, "");
      if (suggested) {
        setLocal(suggested);
      }
    } else if (!localEdited && !name) {
      setLocal("");
    }
  }, [name, localEdited]);

  const allEmps = employees as EmployeeRow[];
  const uniqueDepts = Array.from(
    new Set([...DEFAULT_DEPARTMENTS, ...allEmps.map((e) => e.department).filter(Boolean)]),
  ) as string[];
  const uniquePositions = Array.from(
    new Set([...DEFAULT_POSITIONS, ...allEmps.map((e) => e.job_title).filter(Boolean)]),
  ) as string[];

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      await add({
        data: {
          full_name: name,
          local_part: local.toLowerCase(),
          domain: dom,
          job_title: jobTitle || undefined,
          department: department || undefined,
          phone_number: phone || undefined,
        },
      });
      await qc.invalidateQueries({ queryKey: ["employees"] });
      setName("");
      setLocal("");
      setJobTitle("");
      setDepartment("");
      setPhone("");
      setLocalEdited(false);
      setOpenAdd(false);
    } catch (e: any) {
      setErr(friendlyError(e, "Could not add employee. Please verify details."));
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await del({ data: { id: pendingDelete.id } });
      await qc.invalidateQueries({ queryKey: ["employees"] });
      setPendingDelete(null);
    } catch (e: any) {
      alert(friendlyError(e, "Failed to delete employee"));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Employees"
        subtitle="Create professional addresses. Each employee connects their own Gmail via an invite link — you never sign in for them."
        actions={
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="ghost"
              onClick={() => setOpenBulk(true)}
              className="flex-1 sm:flex-initial h-9 sm:h-10 px-3 sm:px-4 text-[12.5px] sm:text-[13px] border border-line bg-surface hover:bg-surface-muted transition justify-center font-medium"
            >
              <FileSpreadsheet className="h-4 w-4 mr-1.5 text-ink-3 shrink-0" />
              <span>Bulk import</span>
            </Button>
            <Button
              onClick={() => setOpenAdd((v) => !v)}
              className="flex-1 sm:flex-initial h-9 sm:h-10 px-3.5 sm:px-5 text-[12.5px] sm:text-[13px] justify-center font-medium shadow-xs"
            >
              <Plus className="h-4 w-4 mr-1.5 shrink-0" />
              <span>Add employee</span>
            </Button>
          </div>
        }
      />

      <Sheet open={openAdd} onOpenChange={setOpenAdd}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle>Add Employee</SheetTitle>
            <SheetDescription>
              Create a new professional email address and signature profile.
            </SheetDescription>
          </SheetHeader>

          {domains.length === 0 ? (
            <p className="text-[13px] text-ink-3">Add a domain first.</p>
          ) : (
            <form onSubmit={submit} className="space-y-5">
              <Field label="Full name">
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  required
                />
              </Field>
              <Field label="Professional address">
                <div className="flex flex-col sm:flex-row items-stretch gap-2">
                  <div className="flex-1 min-w-0">
                    <Input
                      value={local}
                      onChange={(e) => {
                        setLocal(e.target.value.toLowerCase().replace(/\s+/g, ""));
                        setLocalEdited(true);
                      }}
                      placeholder="jane.doe"
                      required
                    />
                  </div>
                  <div className="w-full sm:w-44 shrink-0">
                    <CustomSelect
                      value={dom}
                      onChange={(v) => setDom(v)}
                      options={domains.map((d: { id: string; domain_name: string }) => ({
                        value: d.domain_name,
                        label: `@${d.domain_name}`,
                      }))}
                    />
                  </div>
                </div>
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Department">
                  <ComboboxField
                    value={department}
                    onChange={setDepartment}
                    options={uniqueDepts}
                    placeholder="Sales"
                  />
                </Field>
                <Field label="Position">
                  <ComboboxField
                    value={jobTitle}
                    onChange={setJobTitle}
                    options={uniquePositions}
                    placeholder="Account Executive"
                  />
                </Field>
              </div>
              <Field label="Phone number (optional)">
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 555 0123"
                  type="tel"
                />
              </Field>

              {err && (
                <div className="p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400 text-[12.5px] flex items-start gap-2 animate-fadeIn">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{err}</span>
                </div>
              )}

              <SheetFooter className="mt-8">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setOpenAdd(false)}
                  disabled={busy}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={busy}>
                  {busy ? "Adding…" : "Add employee"}
                </Button>
              </SheetFooter>
            </form>
          )}
        </SheetContent>
      </Sheet>

      <Card className="p-0">
        {employees.length === 0 ? (
          <div className="py-16 text-center flex flex-col items-center justify-center border-t border-line bg-surface-muted/20">
            <div className="h-12 w-12 rounded-full bg-ink/[0.04] grid place-items-center mb-3">
              <Users className="h-6 w-6 text-ink-3" />
            </div>
            <h3 className="font-semibold text-ink">No employees yet</h3>
            <p className="mt-1 text-[13px] text-ink-3 max-w-sm">
              Add your staff to generate their professional email addresses.
            </p>
            <Button onClick={() => setOpenAdd(true)} className="mt-5">
              Add employee
            </Button>
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {(employees as EmployeeRow[]).map((emp) => (
              <li
                key={emp.id}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 px-5 py-4 hover:bg-ink/[0.02] transition"
              >
                <Link to="/employees/$id" params={{ id: emp.id }} className="min-w-0 flex-1">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
                    <div className="font-medium truncate">{emp.full_name ?? "—"}</div>
                    {(emp.job_title || emp.department) && (
                      <span className="inline-flex w-fit items-center gap-1 rounded-md bg-ink/[0.04] px-2 py-0.5 text-[11.5px] text-ink-3">
                        <BriefcaseBusiness className="h-3 w-3" />
                        {[emp.job_title, emp.department].filter(Boolean).join(" · ")}
                      </span>
                    )}
                  </div>
                  <div className="mt-1 text-[12.5px] text-ink-3 font-mono truncate">
                    {emp.professional_email ?? "—"}
                  </div>
                </Link>
                <div className="flex flex-wrap items-center gap-2 shrink-0 self-start sm:self-auto max-w-full mt-2 sm:mt-0">
                  <StatusPill status={emp.status ?? "pending"} />
                  {!emp.gmail_connected && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setInviteFor(emp);
                      }}
                      className="inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-md border border-line px-2.5 text-[12.5px] text-ink-2 hover:bg-ink/[0.04]"
                      title="Send invite"
                    >
                      <Send className="h-3.5 w-3.5" /> Invite
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setPendingDelete({
                        id: emp.id,
                        name: emp.full_name ?? "Employee",
                        email: emp.professional_email ?? "—",
                      });
                    }}
                    className="p-1.5 text-ink-3 hover:text-danger"
                    title="Delete"
                    aria-label="Delete employee"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <ChevronRight className="h-4 w-4 text-ink-3 opacity-0 group-hover:opacity-100 transition" />
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {pendingDelete && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/45 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <Card className="w-full max-w-md p-5 shadow-xl">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-danger/10 text-danger">
                <Trash2 className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h2 className="font-display text-lg font-semibold">Delete employee?</h2>
                <p className="mt-1 text-[13.5px] text-ink-3">
                  {pendingDelete.name} ({pendingDelete.email}) will be removed from the active
                  employee list.
                </p>
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setPendingDelete(null)}
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button type="button" variant="danger" onClick={remove} disabled={deleting}>
                {deleting ? "Deleting…" : "Delete"}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {inviteFor && (
        <InviteModal
          employee={inviteFor}
          onClose={() => {
            setInviteFor(null);
            qc.invalidateQueries({ queryKey: ["employees"] });
          }}
        />
      )}
      {openBulk && (
        <BulkImportModal domain={dom || "company.com"} onClose={() => setOpenBulk(false)} />
      )}
    </div>
  );
}
