import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { sound } from '../utils/audio';

interface ThemeToggleProps {
  variant?: 'icon' | 'pill' | 'expanded';
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  variant = 'icon',
  className = ''
}) => {
  const { theme, toggleTheme, isDark } = useTheme();

  const handleToggle = () => {
    sound.playKeyTap();
    toggleTheme();
  };

  if (variant === 'pill') {
    return (
      <div 
        className={`inline-flex items-center p-0.5 rounded-xl border transition-colors ${
          isDark 
            ? 'bg-white/[0.04] border-white/10' 
            : 'bg-slate-100 border-slate-200'
        } ${className}`}
        role="group"
        aria-label="Theme mode switcher"
      >
        <button
          type="button"
          onClick={() => {
            if (isDark) handleToggle();
          }}
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded-lg transition-all ${
            !isDark
              ? 'bg-white text-emerald-800 font-semibold shadow-xs border border-slate-200/80'
              : 'text-white/50 hover:text-white'
          }`}
          title="Switch to Light Mode"
        >
          <Sun className="w-3.5 h-3.5 text-amber-500" />
          <span>Light</span>
        </button>
        <button
          type="button"
          onClick={() => {
            if (!isDark) handleToggle();
          }}
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded-lg transition-all ${
            isDark
              ? 'bg-emerald-950/80 text-emerald-300 font-semibold border border-emerald-500/20'
              : 'text-slate-500 hover:text-slate-900'
          }`}
          title="Switch to Dark Mode"
        >
          <Moon className="w-3.5 h-3.5 text-indigo-400" />
          <span>Dark</span>
        </button>
      </div>
    );
  }

  if (variant === 'expanded') {
    return (
      <button
        type="button"
        onClick={handleToggle}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
          isDark
            ? 'bg-white/[0.05] hover:bg-white/[0.09] text-white border border-white/10'
            : 'bg-slate-100 hover:bg-slate-200/80 text-slate-800 border border-slate-200'
        } ${className}`}
        aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
        <div className="flex items-center gap-2">
          {isDark ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600" />
          )}
          <span>{isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</span>
        </div>
        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded uppercase ${
          isDark ? 'bg-white/10 text-emerald-400' : 'bg-white text-slate-700 border border-slate-200'
        }`}>
          {theme}
        </span>
      </button>
    );
  }

  // Default 'icon' variant
  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={isDark ? 'Switch to Light Mode (White theme)' : 'Switch to Dark Mode'}
      title={isDark ? 'Switch to Light Mode (White theme)' : 'Switch to Dark Mode'}
      className={`p-2 rounded-xl transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
        isDark
          ? 'text-amber-300 hover:text-amber-200 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10'
          : 'text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 shadow-xs'
      } ${className}`}
    >
      {isDark ? (
        <Sun className="w-4 h-4 transition-transform hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 transition-transform hover:-rotate-12" />
      )}
    </button>
  );
};
