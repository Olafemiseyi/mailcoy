import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Search } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface CustomSelectProps {
  options: (string | SelectOption)[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
  align?: "left" | "right";
  searchable?: boolean;
  size?: "sm" | "default";
  direction?: "down" | "up";
  menuWidth?: string;
  disabled?: boolean;
}

export function CustomSelect({
  options,
  value,
  onChange,
  placeholder = "Select...",
  className = "",
  buttonClassName = "",
  align = "left",
  searchable = false,
  size = "default",
  direction = "down",
  menuWidth = "",
  disabled = false,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Normalize options to a standard { value, label } structure
  const normalizedOptions: SelectOption[] = options.map((opt) => {
    if (typeof opt === "string") {
      return { value: opt, label: opt };
    }
    return opt;
  });

  const filteredOptions = query.trim()
    ? normalizedOptions.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
    : normalizedOptions;

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const sizeClasses =
    size === "sm"
      ? "h-8 text-xs rounded-lg px-2.5"
      : "h-10 text-[13.5px] rounded-xl px-3.5";

  // Strict anti-overflow formatter for identities with <email>
  const formatIdentityDisplay = (label: string) => {
    const match = label.match(/^(.*?)\s*<([^>]+)>\s*(\(Primary\))?$/i);
    if (match) {
      const name = match[1].trim();
      const email = match[2].trim();
      const isPrimary = !!match[3];
      return (
        <span className="block w-full min-w-0 truncate text-left text-xs">
          <span className="font-semibold text-ink">{name}</span>{" "}
          <span className="text-ink-4 text-[11px] font-mono">&lt;{email}&gt;</span>
          {isPrimary && (
            <span className="ml-1.5 px-1 py-0.2 rounded text-[9px] font-bold bg-primary/10 text-primary uppercase tracking-wider">
              Primary
            </span>
          )}
        </span>
      );
    }
    return <span className="block w-full min-w-0 truncate text-left">{label}</span>;
  };

  const renderOptionContent = (label: string) => {
    const match = label.match(/^(.*?)\s*<([^>]+)>\s*(\(Primary\))?$/i);
    if (match) {
      const name = match[1].trim();
      const email = match[2].trim();
      const isPrimary = !!match[3];
      return (
        <div className="flex flex-col min-w-0 max-w-full flex-1 py-0.5 overflow-hidden">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="font-semibold text-ink text-xs truncate">{name}</span>
            {isPrimary && (
              <span className="px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold shrink-0">
                Primary
              </span>
            )}
          </div>
          <span className="text-[11px] font-mono text-ink-4 truncate block w-full">{email}</span>
        </div>
      );
    }
    return <span className="flex-1 min-w-0 truncate text-[13px] block">{label}</span>;
  };

  return (
    <div className={`relative w-full min-w-0 max-w-full text-left ${className}`} ref={containerRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full min-w-0 max-w-full overflow-hidden flex items-center justify-between gap-2 bg-background hover:bg-surface-muted border border-line text-ink font-medium transition-all cursor-pointer outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 select-none disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses} ${buttonClassName}`}
      >
        <div className="flex-1 min-w-0 max-w-[calc(100%-20px)] overflow-hidden text-left">
          {selectedOption ? formatIdentityDisplay(selectedOption.label) : (
            <span className="text-ink-3 truncate block">{placeholder}</span>
          )}
        </div>
        <ChevronDown
          className={`h-3.5 w-3.5 text-ink-3 transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180 text-primary" : ""}`}
        />
      </button>

      {isOpen && (
        <div
          className={`absolute z-[9999] ${
            direction === "up" ? "bottom-full mb-1.5" : "mt-1.5"
          } ${
            menuWidth ? menuWidth : "w-full min-w-full sm:w-auto sm:min-w-full sm:max-w-md"
          } max-h-64 overflow-y-auto overflow-x-hidden bg-surface border border-line rounded-xl shadow-2xl p-1.5 backdrop-blur-md animate-in fade-in zoom-in-95 duration-150 ${
            align === "right" ? "right-0 left-auto" : "left-0"
          }`}
        >
          {searchable && normalizedOptions.length > 6 && (
            <div className="p-1 mb-1 border-b border-line">
              <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-surface-muted text-ink-3">
                <Search className="h-3.5 w-3.5 shrink-0" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search options…"
                  className="w-full bg-transparent text-[12.5px] text-ink outline-none placeholder:text-ink-4"
                />
              </div>
            </div>
          )}

          {filteredOptions.length === 0 ? (
            <div className="px-3.5 py-3 text-center text-[12.5px] text-ink-3 select-none">
              {normalizedOptions.length === 0 ? "Loading senders…" : "No matching options"}
            </div>
          ) : (
            filteredOptions.map((opt) => {
              const isSelected = opt.value === value;
              const isDisabled = Boolean(opt.disabled);
              return (
                <button
                  key={opt.value}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => {
                    if (isDisabled) return;
                    onChange(opt.value);
                    setIsOpen(false);
                    setQuery("");
                  }}
                  className={`w-full min-w-0 max-w-full overflow-hidden flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                    isDisabled
                      ? "opacity-50 cursor-not-allowed text-ink-4 bg-transparent"
                      : isSelected
                        ? "bg-primary/10 text-primary font-semibold cursor-pointer"
                        : "text-ink-2 hover:bg-surface-muted hover:text-ink cursor-pointer"
                  }`}
                >
                  {renderOptionContent(opt.label)}
                  {isSelected && <Check className="h-4 w-4 text-primary shrink-0 ml-1.5" />}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

export default CustomSelect;
