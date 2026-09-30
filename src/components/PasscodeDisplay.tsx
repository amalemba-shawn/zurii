import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface PasscodeDisplayProps {
  passcode: string;
  maxDigits?: number;
  showDigits: boolean;
  onToggleShowDigits: () => void;
  status: 'idle' | 'checking' | 'error' | 'success';
  errorMessage?: string;
}

export const PasscodeDisplay: React.FC<PasscodeDisplayProps> = ({
  passcode,
  maxDigits = 4,
  showDigits,
  onToggleShowDigits,
  status,
  errorMessage = 'Passcode not recognized on station registry'
}) => {
  const { isDark } = useTheme();
  const digitsArray = Array.from({ length: maxDigits });

  return (
    <div className="flex flex-col items-center w-full">
      {/* Indicator Dots / Digits container */}
      <div
        className={`relative flex items-center justify-center gap-4 py-4 px-6 rounded-2xl transition-all duration-200 ${
          status === 'error'
            ? isDark
              ? 'animate-[shake_0.4s_ease-in-out] bg-red-950/20 border border-red-500/30'
              : 'animate-[shake_0.4s_ease-in-out] bg-red-50 border border-red-300'
            : status === 'success'
            ? isDark
              ? 'bg-emerald-950/25 border border-emerald-500/40'
              : 'bg-emerald-50 border border-emerald-300'
            : isDark
            ? 'bg-white/[0.03] border border-white/10'
            : 'bg-slate-50 border border-slate-200 shadow-2xs'
        }`}
      >
        {digitsArray.map((_, index) => {
          const char = passcode[index];
          const isFilled = char !== undefined;
          const isCurrentActive = passcode.length === index && status !== 'error';

          return (
            <div
              key={index}
              className={`relative flex items-center justify-center w-12 h-14 rounded-xl border transition-all duration-200 ${
                isFilled
                  ? status === 'error'
                    ? isDark
                      ? 'border-red-400 bg-red-900/20 text-red-200 scale-105'
                      : 'border-red-500 bg-red-100 text-red-800 scale-105'
                    : status === 'success'
                    ? isDark
                      ? 'border-emerald-400 bg-emerald-900/20 text-emerald-200 scale-105'
                      : 'border-emerald-500 bg-emerald-100 text-emerald-800 scale-105'
                    : isDark
                    ? 'border-[#4E805B] bg-[#1E3024]/70 text-emerald-100 shadow-[0_0_12px_rgba(78,128,91,0.25)] scale-100'
                    : 'border-emerald-500 bg-emerald-50 text-emerald-800 shadow-xs scale-100'
                  : isCurrentActive
                  ? isDark
                    ? 'border-white/40 bg-white/[0.05] animate-pulse'
                    : 'border-emerald-400 bg-white shadow-xs animate-pulse'
                  : isDark
                  ? 'border-white/10 bg-transparent text-white/20'
                  : 'border-slate-200 bg-white/70 text-slate-300'
              }`}
            >
              {isFilled ? (
                showDigits ? (
                  <span className={`font-mono text-xl font-semibold tracking-tight ${
                    isDark ? 'text-emerald-100' : 'text-emerald-900'
                  }`}>
                    {char}
                  </span>
                ) : (
                  <span
                    className={`w-3 h-3 rounded-full transition-transform duration-150 ${
                      status === 'error'
                        ? 'bg-red-500'
                        : status === 'success'
                        ? 'bg-emerald-600'
                        : isDark
                        ? 'bg-emerald-300 shadow-[0_0_8px_rgba(110,231,183,0.6)]'
                        : 'bg-emerald-600 shadow-xs'
                    }`}
                  />
                )
              ) : (
                <span className={`w-1.5 h-1.5 rounded-full ${
                  isDark ? 'bg-white/20' : 'bg-slate-300'
                }`} />
              )}
            </div>
          );
        })}

        {/* Visibility Toggle Button */}
        {passcode.length > 0 && (
          <button
            type="button"
            onClick={onToggleShowDigits}
            aria-label={showDigits ? 'Hide passcode digits' : 'Show passcode digits'}
            className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 ${
              isDark ? 'text-white/40 hover:text-white/80' : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            {showDigits ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Dynamic Status / Helper Text */}
      <div className="h-7 mt-3 flex items-center justify-center text-xs tracking-wide">
        {status === 'checking' && (
          <span className={`flex items-center gap-2 font-mono ${
            isDark ? 'text-emerald-300' : 'text-emerald-700 font-medium'
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            Verifying operator credentials...
          </span>
        )}
        {status === 'error' && (
          <span className="text-red-500 font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            {errorMessage}
          </span>
        )}
        {status === 'success' && (
          <span className={`font-medium flex items-center gap-1.5 font-mono ${
            isDark ? 'text-emerald-300' : 'text-emerald-700'
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Identity confirmed · Terminal opening
          </span>
        )}
        {status === 'idle' && (
          <span className={isDark ? 'text-white/45' : 'text-slate-500'}>
            {passcode.length === 0
              ? 'Enter your assigned 4-digit unique passcode'
              : `${passcode.length} of ${maxDigits} digits entered`}
          </span>
        )}
      </div>
    </div>
  );
};
