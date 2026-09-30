import React from 'react';
import { Delete, RotateCcw } from 'lucide-react';
import { sound } from '../utils/audio';
import { useTheme } from '../context/ThemeContext';

interface KeypadProps {
  onDigitPress: (digit: string) => void;
  onBackspace: () => void;
  onClear: () => void;
  disabled?: boolean;
}

interface KeyConfig {
  key: string;
  label?: string;
  sub?: string;
  isAction?: boolean;
  actionType?: 'clear' | 'backspace';
}

const KEYS: KeyConfig[] = [
  { key: '1', label: '1', sub: '·' },
  { key: '2', label: '2', sub: 'ABC' },
  { key: '3', label: '3', sub: 'DEF' },
  { key: '4', label: '4', sub: 'GHI' },
  { key: '5', label: '5', sub: 'JKL' },
  { key: '6', label: '6', sub: 'MNO' },
  { key: '7', label: '7', sub: 'PQRS' },
  { key: '8', label: '8', sub: 'TUV' },
  { key: '9', label: '9', sub: 'WXYZ' },
  { key: 'clear', label: 'C', isAction: true, actionType: 'clear' },
  { key: '0', label: '0', sub: '+' },
  { key: 'backspace', isAction: true, actionType: 'backspace' }
];

export const Keypad: React.FC<KeypadProps> = ({
  onDigitPress,
  onBackspace,
  onClear,
  disabled = false
}) => {
  const { isDark } = useTheme();

  const handleKeyClick = (k: KeyConfig) => {
    if (disabled) return;

    if (navigator.vibrate) {
      try {
        navigator.vibrate(10);
      } catch {
        // Ignored
      }
    }

    if (k.actionType === 'clear') {
      sound.playBackspace();
      onClear();
    } else if (k.actionType === 'backspace') {
      sound.playBackspace();
      onBackspace();
    } else {
      sound.playKeyTap();
      onDigitPress(k.key);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-3 md:gap-3.5 w-full max-w-[340px] select-none mx-auto">
      {KEYS.map((k) => {
        if (k.actionType === 'clear') {
          return (
            <button
              key="clear"
              type="button"
              disabled={disabled}
              onClick={() => handleKeyClick(k)}
              aria-label="Clear passcode"
              className={`group relative flex flex-col items-center justify-center h-16 rounded-2xl border transition-all duration-150 disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 cursor-pointer ${
                isDark
                  ? 'border-white/5 bg-white/[0.03] text-white/40 hover:text-white/80 hover:bg-white/[0.07] hover:border-white/10 active:scale-[0.96] active:bg-white/10'
                  : 'border-slate-200 bg-slate-100/70 text-slate-500 hover:text-slate-900 hover:bg-slate-200/80 hover:border-slate-300 active:scale-[0.96] active:bg-slate-300/80 shadow-2xs'
              }`}
            >
              <RotateCcw className="w-4 h-4 transition-transform group-hover:-rotate-45" />
              <span className="text-[10px] uppercase font-mono tracking-wider mt-1 opacity-70">
                Clear
              </span>
            </button>
          );
        }

        if (k.actionType === 'backspace') {
          return (
            <button
              key="backspace"
              type="button"
              disabled={disabled}
              onClick={() => handleKeyClick(k)}
              aria-label="Delete last digit"
              className={`group relative flex flex-col items-center justify-center h-16 rounded-2xl border transition-all duration-150 disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 cursor-pointer ${
                isDark
                  ? 'border-white/5 bg-white/[0.03] text-white/40 hover:text-white/80 hover:bg-white/[0.07] hover:border-white/10 active:scale-[0.96] active:bg-white/10'
                  : 'border-slate-200 bg-slate-100/70 text-slate-500 hover:text-slate-900 hover:bg-slate-200/80 hover:border-slate-300 active:scale-[0.96] active:bg-slate-300/80 shadow-2xs'
              }`}
            >
              <Delete className="w-5 h-5 transition-transform group-active:-translate-x-0.5" />
              <span className="text-[10px] uppercase font-mono tracking-wider mt-1 opacity-70">
                Delete
              </span>
            </button>
          );
        }

        return (
          <button
            key={k.key}
            type="button"
            disabled={disabled}
            onClick={() => handleKeyClick(k)}
            aria-label={`Digit ${k.label}`}
            className={`group relative flex flex-col items-center justify-center h-16 rounded-2xl border transition-all duration-150 disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 cursor-pointer ${
              isDark
                ? 'border-white/10 bg-white/[0.04] hover:bg-white/[0.09] hover:border-[#4E805B]/50 active:scale-[0.96] active:bg-[#203325] text-white'
                : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-emerald-500/50 active:scale-[0.96] active:bg-emerald-50 text-slate-900 shadow-xs'
            }`}
          >
            <span className={`font-mono text-xl md:text-2xl font-normal tracking-tight leading-none ${
              isDark ? 'text-white group-active:text-emerald-200' : 'text-slate-900 group-active:text-emerald-700'
            }`}>
              {k.label}
            </span>
            {k.sub && (
              <span className={`text-[9px] font-mono tracking-widest mt-1 leading-none uppercase ${
                isDark ? 'text-white/35 group-hover:text-white/55' : 'text-slate-400 group-hover:text-slate-600'
              }`}>
                {k.sub}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
