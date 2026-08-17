import { useState, useEffect, FormEvent, DragEvent, ChangeEvent } from 'react';
import { motion } from 'motion/react';
import { Domain, Employee } from '../types';
import { dbService } from '../lib/supabaseClient';
import { 
  Users, 
  Search, 
  Trash2, 
  Plus, 
  X, 
  Loader2, 
  CheckCircle2,
  Mail,
  UserPlus,
  Upload,
  FileText,
  AlertCircle,
  Check
} from 'lucide-react';

interface EmployeesPageProps {
  domain: Domain | null;
  employees: Employee[];
  onAddEmployee: (name: string, companyEmail: string, personalGmail: string) => void;
  onDeleteEmployee: (id: string) => void;
  onUpdateEmployee: (id: string, name: string, companyEmail: string, personalGmail: string, status?: 'active' | 'pending_auth') => void;
  onImportEmployees: (newEmployeesList: { name: string; companyEmail: string; personalGmail: string }[]) => void;
}

export default function EmployeesPage({ 
  domain, 
  employees, 
  onAddEmployee, 
  onDeleteEmployee,
  onUpdateEmployee,
  onImportEmployees
}: EmployeesPageProps) {
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [gmailConnections, setGmailConnections] = useState<any[]>([]);
  const [isConnectingGmail, setIsConnectingGmail] = useState(false);

  const fetchConnections = async () => {
    try {
      const connections = await dbService.getGmailConnections();
      setGmailConnections(connections);
    } catch (e) {
      console.error("Error loading Gmail connections:", e);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, [employees]);

  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  // Drawer Form States
  const [addName, setAddName] = useState('');
  const [addPrefix, setAddPrefix] = useState('');
  const [addGmail, setAddGmail] = useState('');
  const [addError, setAddError] = useState('');

  // Edit Drawer Form States
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [editName, setEditName] = useState('');
  const [editPrefix, setEditPrefix] = useState('');
  const [editGmail, setEditGmail] = useState('');
  const [editStatus, setEditStatus] = useState<'active' | 'pending_auth'>('active');
  const [editError, setEditError] = useState('');

  useEffect(() => {
    const handleOAuthMessage = (event: MessageEvent) => {
      const origin = event.origin;
      if (!origin.endsWith('.run.app') && !origin.includes('localhost') && !origin.includes('127.0.0.1')) {
        return;
      }
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS' && event.data?.employeeId) {
        showToast(`Successfully linked Gmail: ${event.data.email}`);
        fetchConnections();
        
        // Auto update status to active
        const empId = event.data.employeeId;
        const linkedEmail = event.data.email;
        const emp = employees.find(e => e.id === empId);
        if (emp) {
          onUpdateEmployee(emp.id, emp.name, emp.companyEmail, linkedEmail, 'active');
          if (selectedEmployee && selectedEmployee.id === empId) {
            setEditGmail(linkedEmail);
            setEditStatus('active');
          }
        }
      }
    };
    window.addEventListener('message', handleOAuthMessage);
    return () => window.removeEventListener('message', handleOAuthMessage);
  }, [employees, selectedEmployee]);

  // Bulk Import States
  interface ParsedImportRow {
    name: string;
    prefix: string;
    gmail: string;
    companyEmail: string;
    status: 'valid' | 'duplicate' | 'invalid_prefix' | 'invalid_gmail' | 'incomplete';
    statusMessage: string;
    checked: boolean;
  }

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importText, setImportText] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [parsedRows, setParsedRows] = useState<ParsedImportRow[]>([]);
  const [importTab, setImportTab] = useState<'upload' | 'paste'>('upload');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const domainName = domain?.domainName || 'company.com';

  const parseCSVData = (text: string) => {
    const lines = text.split(/\r?\n/);
    const parsed: ParsedImportRow[] = [];
    const localPrefixes = new Set<string>();

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      // Split by comma, tab, or semicolon
      const parts = trimmed.split(/,|\t|;/).map(part => part.trim().replace(/^["']|["']$/g, ''));
      if (parts.length === 0 || (parts.length === 1 && !parts[0])) continue;

      // Header detector: if line looks like header, skip it
      if (
        parts[0].toLowerCase() === 'name' || 
        parts[0].toLowerCase() === 'employee' ||
        parts[1]?.toLowerCase() === 'prefix' ||
        parts[1]?.toLowerCase() === 'email'
      ) {
        continue;
      }

      let name = parts[0] || '';
      let prefix = parts[1] || '';
      let gmail = parts[2] || '';

      // Auto fallback for 2-column format (Name, Gmail)
      if (parts.length === 2) {
        name = parts[0];
        gmail = parts[1];
        // Auto compute prefix from name: "John Doe" -> "john.doe"
        prefix = name.toLowerCase().replace(/[^a-z0-9]/g, '.').replace(/\.+/g, '.').replace(/^\.|\.$/g, '');
      }

      // Clean prefix: remove spaces, convert to lowercase, keep only alphanumeric, dots, hyphens, underscores
      const cleanedPrefix = prefix.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9._-]/g, '');
      const companyEmail = `${cleanedPrefix}@${domainName}`;

      let status: 'valid' | 'duplicate' | 'invalid_prefix' | 'invalid_gmail' | 'incomplete' = 'valid';
      let statusMessage = 'Ready to import';

      if (!name || !cleanedPrefix || !gmail) {
        status = 'incomplete';
        statusMessage = 'Missing required fields';
      } else if (!gmail.toLowerCase().endsWith('@gmail.com')) {
        status = 'invalid_gmail';
        statusMessage = 'Must end with @gmail.com';
      } else if (!cleanedPrefix) {
        status = 'invalid_prefix';
        statusMessage = 'Invalid prefix format';
      } else if (employees.some(emp => emp.companyEmail.toLowerCase() === companyEmail.toLowerCase())) {
        status = 'duplicate';
        statusMessage = 'Prefix already allocated';
      } else if (localPrefixes.has(cleanedPrefix)) {
        status = 'duplicate';
        statusMessage = 'Duplicate prefix in batch';
      } else {
        localPrefixes.add(cleanedPrefix);
      }

      parsed.push({
        name,
        prefix: cleanedPrefix,
        gmail,
        companyEmail,
        status,
        statusMessage,
        checked: status === 'valid'
      });
    }

    setParsedRows(parsed);
  };

  const handleTextImportChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setImportText(val);
    parseCSVData(val);
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) {
        setImportText(text);
        setImportTab('paste'); // Switch to editor & preview tab to show parsed entries
        parseCSVData(text);
      }
    };
    reader.readAsText(file);
  };

  const onDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleBulkImportSubmit = () => {
    const toImport = parsedRows.filter(row => row.checked && row.status === 'valid');
    if (toImport.length === 0) return;

    const formattedList = toImport.map(row => ({
      name: row.name,
      companyEmail: row.companyEmail,
      personalGmail: row.gmail
    }));

    onImportEmployees(formattedList);
    showToast(`Bulk imported ${toImport.length} forwarding routes successfully.`);
    
    // Close & reset
    setIsImportModalOpen(false);
    setImportText('');
    setParsedRows([]);
  };

  const handleToggleRow = (index: number) => {
    setParsedRows(prev => prev.map((row, idx) => {
      if (idx === index && row.status === 'valid') {
        return { ...row, checked: !row.checked };
      }
      return row;
    }));
  };

  const handleToggleSelectAll = () => {
    const allValid = parsedRows.filter(r => r.status === 'valid');
    const allChecked = allValid.length > 0 && allValid.every(r => r.checked);
    setParsedRows(prev => prev.map(row => {
      if (row.status === 'valid') {
        return { ...row, checked: !allChecked };
      }
      return row;
    }));
  };

  const handleAddEmployeeSubmit = (e: FormEvent) => {
    e.preventDefault();
    setAddError('');

    if (!addName.trim() || !addGmail.trim() || !addPrefix.trim()) {
      setAddError('All fields are required.');
      return;
    }

    if (!addGmail.toLowerCase().endsWith('@gmail.com')) {
      setAddError('The target address must be a valid @gmail.com account.');
      return;
    }

    const companyEmail = `${addPrefix.toLowerCase().replace(/\s+/g, '')}@${domainName}`;

    // Check duplicate
    if (employees.some(emp => emp.companyEmail.toLowerCase() === companyEmail.toLowerCase())) {
      setAddError(`Forwarder route ${companyEmail} is already allocated.`);
      return;
    }

    onAddEmployee(addName, companyEmail, addGmail);
    showToast(`Provisioned forwarding route for ${addName}`);
    setIsAddDrawerOpen(false);

    // Reset Form fields
    setAddName('');
    setAddPrefix('');
    setAddGmail('');
  };

  const handleEditEmployeeSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedEmployee) return;
    setEditError('');

    if (!editName.trim() || !editGmail.trim() || !editPrefix.trim()) {
      setEditError('All fields are required.');
      return;
    }

    if (!editGmail.toLowerCase().endsWith('@gmail.com')) {
      setEditError('The target address must be a valid @gmail.com account.');
      return;
    }

    const companyEmail = `${editPrefix.toLowerCase().replace(/\s+/g, '')}@${domainName}`;

    // Check duplicate
    if (employees.some(emp => emp.id !== selectedEmployee.id && emp.companyEmail.toLowerCase() === companyEmail.toLowerCase())) {
      setEditError(`Forwarder route ${companyEmail} is already allocated.`);
      return;
    }

    onUpdateEmployee(selectedEmployee.id, editName, companyEmail, editGmail, editStatus);
    showToast(`Updated forwarding route for ${editName}`);
    setSelectedEmployee(null);
  };

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.companyEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.personalGmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-16 text-left font-sans antialiased max-w-4xl mx-auto">
      
      {/* Toast Alert */}
      
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-55 max-w-sm bg-slate-900 text-white dark:bg-white dark:text-zinc-950 px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-slate-800 dark:border-zinc-200"
          >
            <div className="h-4 w-4 bg-emerald-650 rounded-full flex items-center justify-center text-[10px] text-white">✓</div>
            <p className="text-xs font-bold">{toast}</p>
          </motion.div>
        )}
      

      {/* Page Header */}
      <div className="pb-6 border-b border-slate-200/60 dark:border-zinc-850 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
            Team Members
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
            Manage your employee email mappings and monitor target routing configurations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => {
              setIsImportModalOpen(true);
              setImportTab('upload');
              setImportText('');
              setParsedRows([]);
            }}
            className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 dark:border-zinc-800 dark:hover:bg-zinc-850 text-slate-700 dark:text-zinc-300 text-xs font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01]"
          >
            <Upload className="h-4 w-4" />
            <span>Import CSV / Paste</span>
          </button>

          <button
            onClick={() => setIsAddDrawerOpen(true)}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-sm min-h-[44px] sm:min-h-fit transition-all hover:scale-[1.01]"
          >
            <UserPlus className="h-4 w-4" />
            <span>Add Team Route</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-5">
        <div className="relative">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 dark:text-zinc-500" />
          <input
            type="text"
            placeholder="Search by name, company email prefix, or personal target address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold text-slate-800 dark:text-zinc-100 shadow-xs"
          />
        </div>

        {/* List of employees */}
        {filteredEmployees.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-850 rounded-2xl p-12 text-center max-w-sm mx-auto space-y-4 shadow-sm">
            <div className="w-10 h-10 bg-slate-50 dark:bg-zinc-950 rounded-xl flex items-center justify-center mx-auto text-slate-400 border border-slate-100 dark:border-zinc-800">
              <Users className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">No employees found</h3>
              <p className="text-xs text-slate-400 dark:text-zinc-500 leading-relaxed font-medium">
                Add an employee mapping to route business email queries straight to their private Gmail address.
              </p>
            </div>
            <button
              onClick={() => setIsAddDrawerOpen(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl cursor-pointer whitespace-nowrap shadow-xs"
            >
              Add Employee
            </button>
          </div>
        ) : (
          <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-850/80 rounded-2xl overflow-hidden shadow-sm">
            
            {/* Table layout */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[600px]">
                <thead>
                  <tr className="border-b border-slate-200/60 dark:border-zinc-850 text-slate-400 dark:text-zinc-500 uppercase tracking-widest text-[9px] font-bold bg-slate-50/40 dark:bg-zinc-950/20">
                    <th className="py-4 px-6">Name</th>
                    <th className="py-4 px-6">Company Address</th>
                    <th className="py-4 px-6">Target Destination</th>
                    <th className="py-4 px-6 text-center">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-850/50 text-slate-700 dark:text-zinc-300">
                  {filteredEmployees.map((emp) => (
                    <tr 
                      key={emp.id} 
                      onClick={() => {
                        setSelectedEmployee(emp);
                        setEditName(emp.name);
                        setEditPrefix(emp.companyEmail.split('@')[0]);
                        setEditGmail(emp.personalGmail);
                        setEditStatus(emp.status as 'active' | 'pending_auth');
                        setEditError('');
                      }}
                      className="hover:bg-slate-50/50 dark:hover:bg-zinc-950/20 transition-colors cursor-pointer group"
                      title="Click to view details & edit"
                    >
                      <td className="py-4.5 px-6 font-bold text-slate-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          <span>{emp.name}</span>
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity ml-1">
                            (click to edit)
                          </span>
                        </div>
                      </td>
                      <td className="py-4.5 px-6 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {emp.companyEmail}
                      </td>
                      <td className="py-4.5 px-6 font-mono text-slate-500 dark:text-zinc-400 font-medium">
                        {(() => {
                          const conn = gmailConnections.find(c => c.employee_id === emp.id);
                          return conn ? (
                            <div className="flex flex-col">
                              <span className="text-slate-800 dark:text-zinc-200 font-bold">{conn.google_email}</span>
                              <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold flex items-center gap-1 mt-0.5 font-sans">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Google Identity Linked
                              </span>
                            </div>
                          ) : (
                            <span>{emp.personalGmail}</span>
                          );
                        })()}
                      </td>
                      <td className="py-4.5 px-6 text-center">
                        {(() => {
                          const conn = gmailConnections.find(c => c.employee_id === emp.id);
                          const isActive = emp.status === 'active' || !!conn;
                          return (
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                              isActive 
                                ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-100/50 dark:border-emerald-900/30' 
                                : 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border border-amber-100/50 dark:border-amber-900/30'
                            }`}>
                              {isActive ? 'Active' : 'Connecting'}
                            </span>
                          );
                        })()}
                      </td>
                      <td className="py-4.5 px-6 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`Are you sure you want to remove the forwarding mapping for ${emp.name}?`)) {
                              onDeleteEmployee(emp.id);
                              showToast(`Forwarder route for ${emp.name} has been removed.`);
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer inline-flex items-center relative z-10"
                          title="Delete employee route"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}
      </div>

      {/* Add Employee Side Drawer */}
      
        {isAddDrawerOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsAddDrawerOpen(false);
                setAddError('');
              }}
              className="absolute inset-0 bg-slate-950"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26 }}
              className="relative w-full max-w-md bg-white dark:bg-zinc-900 h-full shadow-2xl flex flex-col justify-between overflow-hidden z-10 border-l border-slate-200 dark:border-zinc-800 text-left"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-slate-100 dark:border-zinc-800/80 flex items-center justify-between shrink-0">
                <div>
                  <span className="text-[9px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest block">Provision</span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white font-display mt-0.5">
                    Add Team Route
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setIsAddDrawerOpen(false);
                    setAddError('');
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Drawer Form */}
              <form onSubmit={handleAddEmployeeSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs font-bold text-slate-700 dark:text-zinc-400">
                
                {addError && (
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-xl font-medium">
                    {addError}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Employee Name</label>
                  <input
                    type="text"
                    required
                    value={addName}
                    onChange={(e) => setAddName(e.target.value)}
                    placeholder="E.g. Sarah Jenkins"
                    className="w-full text-xs border border-slate-200 dark:border-zinc-800 rounded-xl p-3 bg-slate-50/50 dark:bg-zinc-950 outline-none focus:border-emerald-500 text-slate-800 dark:text-zinc-200 font-semibold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Professional Prefix Address</label>
                  <div className="flex items-center">
                    <input
                      type="text"
                      required
                      value={addPrefix}
                      onChange={(e) => setAddPrefix(e.target.value)}
                      placeholder="sarah"
                      className="w-full text-xs border border-slate-200 dark:border-zinc-800 rounded-l-xl p-3 bg-slate-50/50 dark:bg-zinc-950 outline-none focus:border-emerald-500 text-slate-800 dark:text-zinc-200 font-semibold"
                    />
                    <span className="bg-slate-100 dark:bg-zinc-950 border border-l-0 border-slate-200 dark:border-zinc-800 px-4 py-3 rounded-r-xl text-xs font-mono text-slate-500 select-none">
                      @{domainName}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Destination Gmail</label>
                  <input
                    type="email"
                    required
                    value={addGmail}
                    onChange={(e) => setAddGmail(e.target.value)}
                    placeholder="sarah.jenkins.grow@gmail.com"
                    className="w-full text-xs border border-slate-200 dark:border-zinc-800 rounded-xl p-3 bg-slate-50/50 dark:bg-zinc-950 outline-none focus:border-emerald-500 text-slate-800 dark:text-zinc-200 font-semibold"
                  />
                  <p className="text-[10px] text-slate-400 dark:text-zinc-400 font-medium leading-relaxed font-sans mt-1">
                    A secure authentication connection invite will be sent directly to this address.
                  </p>
                </div>

              </form>

              {/* Drawer Footer */}
              <div className="p-4 bg-slate-50 dark:bg-zinc-950 border-t border-slate-200/60 dark:border-zinc-800 flex gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddDrawerOpen(false);
                    setAddError('');
                  }}
                  className="flex-1 py-2.5 border border-slate-200 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl text-xs font-bold text-slate-500 dark:text-zinc-400 cursor-pointer text-center whitespace-nowrap"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddEmployeeSubmit}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer text-center whitespace-nowrap shadow-sm"
                >
                  Confirm & Invite
                </button>
              </div>

            </motion.div>
          </div>
        )}
      

      {/* Edit Employee Side Drawer */}
      
        {selectedEmployee && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setSelectedEmployee(null);
                setEditError('');
              }}
              className="absolute inset-0 bg-slate-950"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26 }}
              className="relative w-full max-w-md bg-white dark:bg-zinc-900 h-full shadow-2xl flex flex-col justify-between overflow-hidden z-10 border-l border-slate-200 dark:border-zinc-800 text-left"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-slate-100 dark:border-zinc-800/80 flex items-center justify-between shrink-0">
                <div>
                  <span className="text-[9px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest block">Modify Connection</span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white font-display mt-0.5">
                    Edit Employee Route
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setSelectedEmployee(null);
                    setEditError('');
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Drawer Form */}
              <form onSubmit={handleEditEmployeeSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs font-bold text-slate-700 dark:text-zinc-400">
                
                {editError && (
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-xl font-medium">
                    {editError}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Employee Name</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="E.g. Sarah Jenkins"
                    className="w-full text-xs border border-slate-200 dark:border-zinc-800 rounded-xl p-3 bg-slate-50/50 dark:bg-zinc-950 outline-none focus:border-emerald-500 text-slate-800 dark:text-zinc-200 font-semibold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Professional Prefix Address</label>
                  <div className="flex items-center">
                    <input
                      type="text"
                      required
                      value={editPrefix}
                      onChange={(e) => setEditPrefix(e.target.value)}
                      placeholder="sarah"
                      className="w-full text-xs border border-slate-200 dark:border-zinc-800 rounded-l-xl p-3 bg-slate-50/50 dark:bg-zinc-950 outline-none focus:border-emerald-500 text-slate-800 dark:text-zinc-200 font-semibold"
                    />
                    <span className="bg-slate-100 dark:bg-zinc-950 border border-l-0 border-slate-200 dark:border-zinc-800 px-4 py-3 rounded-r-xl text-xs font-mono text-slate-500 select-none">
                      @{domainName}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Destination Gmail</label>
                  <input
                    type="email"
                    required
                    value={editGmail}
                    onChange={(e) => setEditGmail(e.target.value)}
                    placeholder="sarah.jenkins.grow@gmail.com"
                    className="w-full text-xs border border-slate-200 dark:border-zinc-800 rounded-xl p-3 bg-slate-50/50 dark:bg-zinc-950 outline-none focus:border-emerald-500 text-slate-800 dark:text-zinc-200 font-semibold"
                  />
                  <p className="text-[10px] text-slate-400 dark:text-zinc-400 font-medium leading-relaxed font-sans mt-1">
                    Route updates are synchronised immediately on the global edge nodes.
                  </p>
                </div>

                 <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Routing Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as 'active' | 'pending_auth')}
                    className="w-full text-xs border border-slate-200 dark:border-zinc-800 rounded-xl p-3 bg-slate-50/50 dark:bg-zinc-950 outline-none focus:border-emerald-500 text-slate-800 dark:text-zinc-200 font-semibold cursor-pointer"
                  >
                    <option value="active" className="bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-200">Active (Forwarding Enabled)</option>
                    <option value="pending_auth" className="bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-200">Connecting (Pending Security Invite)</option>
                  </select>
                </div>

                {/* Real Gmail Account Connection Block */}
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-zinc-800/80">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                    <Mail className="h-3 w-3 text-emerald-500" />
                    Gmail Identity Verification
                  </label>
                  
                  {gmailConnections.some(c => c.employee_id === selectedEmployee?.id) ? (
                    (() => {
                      const conn = gmailConnections.find(c => c.employee_id === selectedEmployee?.id);
                      return (
                        <div className="p-3.5 bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/30 rounded-xl space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                              Identity Active
                            </span>
                            <span className="text-[9px] font-mono text-slate-400">
                              Connected
                            </span>
                          </div>
                          <div className="space-y-1 text-[11px] text-slate-600 dark:text-zinc-400 font-medium leading-relaxed">
                            <p>Linked Account: <strong className="font-semibold text-slate-800 dark:text-zinc-200">{conn?.google_email}</strong></p>
                            <p className="text-[9px] text-slate-400">Can reply as: <strong className="font-mono text-emerald-600 dark:text-emerald-400">{selectedEmployee?.companyEmail}</strong></p>
                          </div>
                          <button
                            type="button"
                            onClick={async () => {
                              if (selectedEmployee && conn && confirm(`Disconnect linked Gmail account ${conn.google_email}?`)) {
                                try {
                                  await dbService.disconnectGmail(selectedEmployee.id);
                                  showToast("Gmail account disconnected.");
                                  fetchConnections();
                                  onUpdateEmployee(selectedEmployee.id, editName, selectedEmployee.companyEmail, selectedEmployee.personalGmail, 'pending_auth');
                                } catch (err) {
                                  alert("Failed to disconnect Gmail account.");
                                }
                              }
                            }}
                            className="w-full py-2 border border-rose-200 dark:border-rose-950/30 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl text-[11px] font-bold transition-colors cursor-pointer text-center"
                          >
                            Disconnect Gmail Account
                          </button>
                        </div>
                      );
                    })()
                  ) : (
                    <div className="p-3.5 bg-slate-50 dark:bg-zinc-950 border border-slate-150/40 dark:border-zinc-850 rounded-xl space-y-3">
                      <p className="text-[11px] text-slate-400 dark:text-zinc-400 font-medium leading-relaxed font-sans">
                        Authorize this employee's corporate identity to reply as <strong className="text-slate-700 dark:text-zinc-300">{selectedEmployee?.companyEmail}</strong> from their personal Gmail.
                      </p>
                      <button
                        type="button"
                        disabled={isConnectingGmail}
                        onClick={async () => {
                          if (!selectedEmployee) return;
                          setIsConnectingGmail(true);
                          try {
                            const url = await dbService.getGoogleAuthUrl(selectedEmployee.id);
                            const width = 500;
                            const height = 650;
                            const left = window.screen.width / 2 - width / 2;
                            const top = window.screen.height / 2 - height / 2;
                            const popup = window.open(url, "gmail_oauth_popup", `width=${width},height=${height},top=${top},left=${left}`);
                            if (!popup) {
                              alert("OAuth popup was blocked. Please enable popups in your browser settings to continue.");
                            }
                          } catch (err: any) {
                            alert(err.message || "Failed to generate Google auth link.");
                          } finally {
                            setIsConnectingGmail(false);
                          }
                        }}
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[11px] font-bold shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        {isConnectingGmail ? (
                          <>
                            <Loader2 className="h-3 w-3 animate-spin" />
                            Initializing...
                          </>
                        ) : (
                          <>
                            <Plus className="h-3.5 w-3.5" />
                            Connect Personal Gmail
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

              </form>

              {/* Drawer Footer */}
              <div className="p-4 bg-slate-50 dark:bg-zinc-950 border-t border-slate-200/60 dark:border-zinc-800 flex gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedEmployee(null);
                    setEditError('');
                  }}
                  className="flex-1 py-2.5 border border-slate-200 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl text-xs font-bold text-slate-500 dark:text-zinc-400 cursor-pointer text-center whitespace-nowrap"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditEmployeeSubmit}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer text-center whitespace-nowrap shadow-sm"
                >
                  Save Changes
                </button>
              </div>

            </motion.div>
          </div>
        )}
      

      {/* Bulk Import Modal Dialog */}
      
        {isImportModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsImportModalOpen(false)}
              className="absolute inset-0 bg-slate-950"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden z-10 border border-slate-200 dark:border-zinc-800 text-left"
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-slate-100 dark:border-zinc-800/80 flex items-center justify-between shrink-0">
                <div>
                  <span className="text-[9px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest block">Bulk Allocation</span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white font-display mt-0.5">
                    Import Team Members
                  </h3>
                </div>
                <button
                  onClick={() => setIsImportModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Tabs & Input Container */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-700 dark:text-zinc-350">
                
                {/* Format advice */}
                <div className="p-3.5 bg-slate-50 dark:bg-zinc-950 rounded-xl border border-slate-200/50 dark:border-zinc-850/80 flex items-start gap-3">
                  <AlertCircle className="h-4 w-4 text-emerald-650 dark:text-emerald-400 mt-0.5 shrink-0" />
                  <div className="space-y-1 text-xs">
                    <p className="font-bold text-slate-800 dark:text-zinc-200">CSV or Text Import Formats</p>
                    <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium leading-relaxed font-sans">
                      Paste spreadsheet lines directly, or drop a file in these column styles:<br/>
                      <code className="text-emerald-600 dark:text-emerald-400 font-mono font-semibold bg-emerald-50/50 dark:bg-emerald-950/25 px-1 py-0.5 rounded">Name, company_prefix, target_gmail@gmail.com</code><br/>
                      <code className="text-slate-600 dark:text-zinc-400 font-mono bg-slate-100/50 dark:bg-zinc-900 px-1 py-0.5 rounded mt-1 inline-block">Sarah Jenkins, sarah.jenkins, sarah@gmail.com</code>
                    </p>
                  </div>
                </div>

                {/* Tab buttons */}
                <div className="flex border-b border-slate-100 dark:border-zinc-800/80">
                  <button
                    onClick={() => setImportTab('upload')}
                    className={`pb-3 text-xs font-bold border-b-2 px-4 transition-colors cursor-pointer ${
                      importTab === 'upload' 
                        ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 dark:border-emerald-400' 
                        : 'border-transparent text-slate-400 dark:text-zinc-500 hover:text-slate-600 dark:hover:text-zinc-300'
                    }`}
                  >
                    Upload CSV File
                  </button>
                  <button
                    onClick={() => setImportTab('paste')}
                    className={`pb-3 text-xs font-bold border-b-2 px-4 transition-colors cursor-pointer ${
                      importTab === 'paste' 
                        ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 dark:border-emerald-400' 
                        : 'border-transparent text-slate-400 dark:text-zinc-500 hover:text-slate-600 dark:hover:text-zinc-300'
                    }`}
                  >
                    Copy-Paste Text
                  </button>
                </div>

                {/* Tab Contents */}
                {importTab === 'upload' ? (
                  <div
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                    onClick={() => document.getElementById('csv-file-picker')?.click()}
                    className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-3 ${
                      isDragging 
                        ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/10' 
                        : 'border-slate-200 dark:border-zinc-800 hover:border-slate-350 dark:hover:border-zinc-700 bg-slate-50/20 dark:bg-zinc-950/20'
                    }`}
                  >
                    <input
                      type="file"
                      id="csv-file-picker"
                      accept=".csv,.txt"
                      onChange={handleFileInputChange}
                      className="hidden"
                    />
                    <div className="w-12 h-12 bg-white dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800 rounded-xl flex items-center justify-center text-slate-400 shadow-xs">
                      <Upload className="h-5 w-5 text-emerald-650" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-800 dark:text-zinc-200">
                        Drag and drop your file here, or <span className="text-emerald-600 dark:text-emerald-400 underline">browse</span>
                      </p>
                      <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-medium">
                        Supports CSV or TXT text files (up to 2MB)
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Pasted spreadsheet data</label>
                    <textarea
                      rows={5}
                      value={importText}
                      onChange={handleTextImportChange}
                      placeholder="Sarah Jenkins, sarah.jenkins, sarah@gmail.com&#10;David Miller, david, miller@gmail.com"
                      className="w-full text-xs font-mono border border-slate-200 dark:border-zinc-800 rounded-xl p-3 bg-slate-50/50 dark:bg-zinc-950 outline-none focus:border-emerald-500 text-slate-800 dark:text-zinc-200 font-medium resize-none min-h-[120px]"
                    />
                  </div>
                )}

                {/* Parsed results Preview table */}
                {parsedRows.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                        Parsed Results ({parsedRows.length} lines detected)
                      </h4>
                      <button
                        type="button"
                        onClick={handleToggleSelectAll}
                        className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                      >
                        {parsedRows.filter(r => r.status === 'valid').every(r => r.checked) ? 'Deselect All' : 'Select All Valid'}
                      </button>
                    </div>

                    <div className="border border-slate-200 dark:border-zinc-850 rounded-xl overflow-hidden max-h-[220px] overflow-y-auto">
                      <table className="w-full text-left text-[11px] font-sans">
                        <thead className="bg-slate-50 dark:bg-zinc-950 text-slate-400 dark:text-zinc-500 font-bold uppercase text-[9px] tracking-wider border-b border-slate-200 dark:border-zinc-850 sticky top-0 z-10">
                          <tr>
                            <th className="py-2.5 px-3.5 w-8">
                              <input 
                                type="checkbox"
                                checked={parsedRows.filter(r => r.status === 'valid').length > 0 && parsedRows.filter(r => r.status === 'valid').every(r => r.checked)}
                                onChange={handleToggleSelectAll}
                                className="rounded text-emerald-600 focus:ring-emerald-500"
                              />
                            </th>
                            <th className="py-2.5 px-3">Name</th>
                            <th className="py-2.5 px-3">Forwarder Email</th>
                            <th className="py-2.5 px-3">Private Gmail</th>
                            <th className="py-2.5 px-3 text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-zinc-850/50 text-slate-700 dark:text-zinc-300">
                          {parsedRows.map((row, index) => (
                            <tr 
                              key={index} 
                              onClick={() => handleToggleRow(index)}
                              className={`transition-colors cursor-pointer ${
                                row.status === 'valid' 
                                  ? 'hover:bg-slate-50/50 dark:hover:bg-zinc-950/25' 
                                  : 'opacity-65 bg-slate-50/20 dark:bg-zinc-950/10'
                              }`}
                            >
                              <td className="py-2.5 px-3.5" onClick={(e) => e.stopPropagation()}>
                                <input
                                  type="checkbox"
                                  disabled={row.status !== 'valid'}
                                  checked={row.checked}
                                  onChange={() => handleToggleRow(index)}
                                  className="rounded text-emerald-600 focus:ring-emerald-500 disabled:opacity-30"
                                />
                              </td>
                              <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white max-w-[120px] truncate">{row.name}</td>
                              <td className="py-2.5 px-3 font-mono font-semibold text-emerald-600 dark:text-emerald-400 max-w-[130px] truncate">{row.companyEmail}</td>
                              <td className="py-2.5 px-3 font-mono max-w-[150px] truncate">{row.gmail}</td>
                              <td className="py-2.5 px-3 text-right">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                  row.status === 'valid'
                                    ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400'
                                    : row.status === 'duplicate'
                                    ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400'
                                    : 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400'
                                }`}>
                                  {row.statusMessage}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-slate-50 dark:bg-zinc-950 border-t border-slate-200/60 dark:border-zinc-800 flex items-center justify-between shrink-0">
                <span className="text-[10px] text-slate-500 dark:text-zinc-400 font-semibold">
                  {parsedRows.filter(r => r.checked && r.status === 'valid').length} valid connection(s) selected
                </span>
                
                <div className="flex gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsImportModalOpen(false)}
                    className="py-2 px-4 border border-slate-200 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl text-xs font-bold text-slate-500 dark:text-zinc-400 cursor-pointer text-center"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBulkImportSubmit}
                    disabled={parsedRows.filter(r => r.checked && r.status === 'valid').length === 0}
                    className="py-2 px-5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 dark:disabled:bg-zinc-800 text-white rounded-xl text-xs font-bold cursor-pointer text-center shadow-sm whitespace-nowrap transition-colors disabled:cursor-not-allowed"
                  >
                    Import Selected
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      

    </div>
  );
}
