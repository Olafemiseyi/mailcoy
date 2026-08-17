import { useState, useEffect } from 'react';
import { Sun, Moon, Laptop } from 'lucide-react';
import { motion } from 'motion/react';

export type Theme = 'light' | 'dark' | 'system';

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mailcoy-theme') as Theme;
      return saved || 'system';
    }
    return 'system';
  });

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    
    const applyTheme = (currentTheme: Theme) => {
      root.classList.remove('light', 'dark');
      
      if (currentTheme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        root.classList.add(systemTheme);
      } else {
        root.classList.add(currentTheme);
      }
    };

    applyTheme(theme);
    localStorage.setItem('mailcoy-theme', theme);

    // Listen for system changes if system is selected
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        applyTheme('system');
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  const options: { id: Theme; label: string; icon: typeof Sun }[] = [
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'system', label: 'System', icon: Laptop },
  ];

  const currentOption = options.find(opt => opt.id === theme) || options[0];
  const CurrentIcon = currentOption.icon;

  return (
    <div className="relative z-40">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all cursor-pointer shadow-sm text-xs font-semibold"
        title="Change theme"
        id="theme-switcher-btn"
      >
        <CurrentIcon className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
        <span className="hidden sm:inline">{currentOption.label}</span>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-36 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-1.5 shadow-xl z-50 animate-fade-in">
            {options.map((opt) => {
              const Icon = opt.icon;
              const isSelected = theme === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => {
                    setTheme(opt.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 font-bold'
                      : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/60'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isSelected ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-zinc-500'}`} />
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
