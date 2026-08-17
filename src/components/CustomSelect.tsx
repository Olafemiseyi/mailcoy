import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Search } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface CustomSelectProps {
  options: (string | SelectOption)[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  align?: 'left' | 'right';
  searchable?: boolean;
}

export function CustomSelect({ 
  options, 
  value, 
  onChange, 
  placeholder = 'Select...',
  className = '', 
  align = 'left',
  searchable = false,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Normalize options to a standard { value, label } structure
  const normalizedOptions: SelectOption[] = options.map((opt) => {
    if (typeof opt === 'string') {
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
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div 
      className={`relative w-full text-left ${className}`} 
      ref={containerRef}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex h-10 items-center justify-between gap-2 bg-background hover:bg-surface-muted border border-line text-ink rounded-xl px-3.5 text-[13.5px] font-medium transition-all cursor-pointer outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 select-none"
      >
        <span className={`truncate ${!selectedOption ? 'text-ink-3' : 'text-ink'}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown 
          className={`h-4 w-4 text-ink-3 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-primary' : ''}`} 
        />
      </button>

        {isOpen && (
          <div
            className={`absolute z-50 mt-1.5 min-w-[200px] w-full max-h-64 overflow-y-auto bg-surface border border-line rounded-xl shadow-xl p-1.5 backdrop-blur-md animate-in fade-in zoom-in-95 duration-150 ${
              align === 'right' ? 'right-0' : 'left-0'
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
                No matching options
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                      setQuery('');
                    }}
                    className={`w-full flex items-center justify-between gap-3 px-3 py-2 text-[13px] rounded-lg text-left cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-primary/10 text-primary font-semibold'
                        : 'text-ink-2 hover:bg-surface-muted hover:text-ink'
                    }`}
                  >
                    <span className="truncate">{opt.label}</span>
                    {isSelected && (
                      <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                    )}
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
