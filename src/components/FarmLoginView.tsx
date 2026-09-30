import React, { useState, useEffect, useCallback } from 'react';
import { FarmOperator } from '../types/farm';
import { PasscodeDisplay } from './PasscodeDisplay';
import { Keypad } from './Keypad';
import { QuickPasscodeHelper } from './QuickPasscodeHelper';
import { ExportVSCodiumModal } from './ExportVSCodiumModal';
import { AddPasscodeModal } from './AddPasscodeModal';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from '../context/ThemeContext';
import { sound } from '../utils/audio';
import { 
  Sprout, 
  Volume2, 
  VolumeX, 
  Clock, 
  CloudSun, 
  Code2, 
  Plus, 
  KeyRound 
} from 'lucide-react';

interface FarmLoginViewProps {
  operators: FarmOperator[];
  onSuccessfulLogin: (operator: FarmOperator) => void;
  onAddOperator: (operator: FarmOperator) => void;
  bgMode: 'mist' | 'greenhouse' | 'solid';
  onChangeBgMode: (mode: 'mist' | 'greenhouse' | 'solid') => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const FarmLoginView: React.FC<FarmLoginViewProps> = ({
  operators,
  onSuccessfulLogin,
  onAddOperator,
  bgMode,
  onChangeBgMode,
  soundEnabled,
  onToggleSound
}) => {
  const { isDark } = useTheme();
  const [passcode, setPasscode] = useState('');
  const [showDigits, setShowDigits] = useState(false);
  const [authStatus, setAuthStatus] = useState<'idle' | 'checking' | 'error' | 'success'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isAddPasscodeOpen, setIsAddPasscodeOpen] = useState(false);

  // Keep live time updated for field shift accuracy
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  // Passcode verification logic
  const verifyPasscode = useCallback((code: string) => {
    setAuthStatus('checking');

    setTimeout(() => {
      const matchedOperator = operators.find((op) => op.passcode === code);

      if (matchedOperator) {
        sound.playSuccess();
        setAuthStatus('success');
        setTimeout(() => {
          onSuccessfulLogin(matchedOperator);
        }, 600);
      } else {
        sound.playError();
        setAuthStatus('error');
        if (operators.length === 0) {
          setErrorMessage('Database has no passcodes · Click "+ Add Passcode"');
        } else {
          setErrorMessage('Unrecognized passcode · Try again or add a new one');
        }
        setTimeout(() => {
          setPasscode('');
          setAuthStatus('idle');
        }, 1300);
      }
    }, 350);
  }, [operators, onSuccessfulLogin]);

  // Handle digit input
  const handleDigitPress = useCallback((digit: string) => {
    if (authStatus === 'checking' || authStatus === 'success') return;
    
    // Clear error immediately upon new typing
    if (authStatus === 'error') {
      setAuthStatus('idle');
      setPasscode(digit);
      return;
    }

    if (passcode.length < 4) {
      const nextCode = passcode + digit;
      setPasscode(nextCode);

      // Auto-submit when 4 digits are completed
      if (nextCode.length === 4) {
        verifyPasscode(nextCode);
      }
    }
  }, [passcode, authStatus, verifyPasscode]);

  // Handle backspace
  const handleBackspace = useCallback(() => {
    if (authStatus === 'checking' || authStatus === 'success') return;
    if (authStatus === 'error') {
      setAuthStatus('idle');
      setPasscode('');
      return;
    }
    setPasscode((prev) => prev.slice(0, -1));
  }, [authStatus]);

  // Handle clear
  const handleClear = useCallback(() => {
    if (authStatus === 'checking' || authStatus === 'success') return;
    setPasscode('');
    setAuthStatus('idle');
  }, [authStatus]);

  // Direct physical keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault();
        sound.playKeyTap();
        handleDigitPress(e.key);
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        sound.playBackspace();
        handleBackspace();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        sound.playBackspace();
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDigitPress, handleBackspace, handleClear]);

  // Direct autofill from directory
  const handleSelectQuickPasscode = (code: string) => {
    setPasscode(code);
    sound.playKeyTap();
    verifyPasscode(code);
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between p-4 sm:p-6 md:p-8 select-none overflow-hidden">
      {/* Top Station Bar: Minimalist 3-zone contract */}
      <header className="relative z-10 flex items-center justify-between w-full max-w-5xl mx-auto">
        {/* Brand mark */}
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-sm backdrop-blur-sm transition-colors ${
            isDark 
              ? 'bg-[#223527]/90 border border-emerald-500/30 text-emerald-400' 
              : 'bg-emerald-600 border border-emerald-500 text-white shadow-xs'
          }`}>
            <Sprout className="w-4 h-4" />
          </div>
          <div>
            <div className={`text-sm font-semibold tracking-tight font-mono flex items-center gap-1.5 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              <span>SOLUM AGRONOMICS</span>
              <span className={`text-[10px] font-normal px-1.5 py-0.2 rounded border ${
                isDark 
                  ? 'text-emerald-400 border-emerald-500/20 bg-emerald-950/40' 
                  : 'text-emerald-800 border-emerald-300 bg-emerald-100/70 font-semibold'
              }`}>
                FIELD OS
              </span>
            </div>
          </div>
        </div>

        {/* Ambient telemetry indicators */}
        <div className={`hidden sm:flex items-center gap-4 text-xs font-mono ${
          isDark ? 'text-white/50' : 'text-slate-500'
        }`}>
          <div className="flex items-center gap-1.5">
            <CloudSun className={`w-3.5 h-3.5 ${isDark ? 'text-amber-300/80' : 'text-amber-500'}`} />
            <span>64°F · North Orchard</span>
          </div>
          <span aria-hidden="true" className={isDark ? 'text-white/20' : 'text-slate-300'}>/</span>
          <div className="flex items-center gap-1.5">
            <Clock className={`w-3.5 h-3.5 ${isDark ? 'text-emerald-400/80' : 'text-emerald-600'}`} />
            <span className={`tabular-nums font-medium ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
              {currentTime || '08:00 AM'}
            </span>
          </div>
        </div>

        {/* Terminal Controls: Theme Switcher, Audio toggle & Background switcher */}
        <div className="flex items-center gap-2">
          {/* Theme switcher toggle button */}
          <ThemeToggle variant="icon" />

          {/* Audio toggle */}
          <button
            type="button"
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'Mute audio clicks' : 'Enable audio clicks'}
            className={`p-2 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400 ${
              isDark 
                ? 'text-white/50 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10' 
                : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 shadow-xs'
            }`}
            title={soundEnabled ? 'Tactile clicks on' : 'Tactile clicks muted'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className={`w-4 h-4 ${isDark ? 'text-white/30' : 'text-slate-400'}`} />
            )}
          </button>

          {/* Background backdrop switcher */}
          <div className={`flex items-center rounded-xl p-0.5 border ${
            isDark ? 'bg-white/[0.04] border-white/10' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              type="button"
              onClick={() => onChangeBgMode('mist')}
              className={`px-2 py-1 text-[11px] font-mono rounded-lg transition-colors ${
                bgMode === 'mist'
                  ? isDark 
                    ? 'bg-emerald-950/80 text-emerald-300 font-medium border border-emerald-500/20' 
                    : 'bg-white text-emerald-800 font-semibold shadow-xs border border-slate-200'
                  : isDark 
                    ? 'text-white/40 hover:text-white' 
                    : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Atmosphere: Morning Mist"
            >
              Mist
            </button>
            <button
              type="button"
              onClick={() => onChangeBgMode('greenhouse')}
              className={`px-2 py-1 text-[11px] font-mono rounded-lg transition-colors ${
                bgMode === 'greenhouse'
                  ? isDark 
                    ? 'bg-emerald-950/80 text-emerald-300 font-medium border border-emerald-500/20' 
                    : 'bg-white text-emerald-800 font-semibold shadow-xs border border-slate-200'
                  : isDark 
                    ? 'text-white/40 hover:text-white' 
                    : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Atmosphere: Greenhouse"
            >
              Glass
            </button>
            <button
              type="button"
              onClick={() => onChangeBgMode('solid')}
              className={`px-2 py-1 text-[11px] font-mono rounded-lg transition-colors ${
                bgMode === 'solid'
                  ? isDark 
                    ? 'bg-emerald-950/80 text-emerald-300 font-medium border border-emerald-500/20' 
                    : 'bg-white text-emerald-800 font-semibold shadow-xs border border-slate-200'
                  : isDark 
                    ? 'text-white/40 hover:text-white' 
                    : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Atmosphere: Pure Minimal Solid"
            >
              Pure
            </button>
          </div>

          {/* Export to VSCodium button */}
          <button
            type="button"
            onClick={() => setIsExportOpen(true)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-mono transition-all ${
              isDark 
                ? 'text-white/70 hover:text-emerald-300 bg-white/[0.04] hover:bg-emerald-950/40 border border-white/10 hover:border-emerald-500/30' 
                : 'text-slate-600 hover:text-emerald-800 bg-slate-100 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 shadow-xs'
            }`}
            title="Export TypeScript JSX to VSCodium"
          >
            <Code2 className={`w-3.5 h-3.5 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
            <span className="hidden sm:inline">Export Code</span>
          </button>
        </div>
      </header>

      {/* Center Passcode Login Module */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center my-6 md:my-10">
        <div className={`w-full max-w-[390px] rounded-3xl p-6 sm:p-8 backdrop-blur-2xl transition-all duration-200 border ${
          isDark 
            ? 'bg-[#121B15]/85 border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]' 
            : 'bg-white/95 border-slate-200/90 shadow-[0_20px_50px_rgba(0,0,0,0.06)]'
        }`}>
          {/* Card Header */}
          <div className="text-center mb-6">
            <div className={`inline-flex items-center gap-1.5 text-[11px] font-mono tracking-widest uppercase mb-2 ${
              isDark ? 'text-emerald-400' : 'text-emerald-700 font-semibold'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                isDark ? 'bg-emerald-400' : 'bg-emerald-600'
              }`} />
              Station Terminal 04 · Ready
            </div>
            <h1 className={`text-xl sm:text-2xl font-semibold tracking-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Operator Sign In
            </h1>
            <p className={`text-xs mt-1 max-w-[280px] mx-auto text-balance ${
              isDark ? 'text-white/50' : 'text-slate-500'
            }`}>
              Key in your unique 4-digit farm passcode to access station telemetry.
            </p>
          </div>

          {/* Passcode Visual Indicator */}
          <div className="mb-6">
            <PasscodeDisplay
              passcode={passcode}
              maxDigits={4}
              showDigits={showDigits}
              onToggleShowDigits={() => setShowDigits((prev) => !prev)}
              status={authStatus}
              errorMessage={errorMessage}
            />
          </div>

          {/* Tactile Numeric Keypad */}
          <Keypad
            onDigitPress={handleDigitPress}
            onBackspace={handleBackspace}
            onClear={handleClear}
            disabled={authStatus === 'checking' || authStatus === 'success'}
          />

          {/* Physical Keyboard Tip */}
          <div className="mt-4 text-center">
            <span className={`text-[11px] font-mono ${
              isDark ? 'text-white/30' : 'text-slate-400'
            }`}>
              Tip: Supports keyboard numpad & backspace
            </span>
          </div>

          {/* Setup / Add Passcode Banner */}
          {operators.length === 0 ? (
            <div className={`mt-5 p-4 rounded-2xl border text-center space-y-2.5 ${
              isDark 
                ? 'bg-emerald-950/40 border-emerald-500/30' 
                : 'bg-emerald-50/80 border-emerald-200'
            }`}>
              <div className={`text-xs font-medium flex items-center justify-center gap-1.5 ${
                isDark ? 'text-emerald-300' : 'text-emerald-800 font-semibold'
              }`}>
                <KeyRound className={`w-3.5 h-3.5 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                <span>No passcodes registered yet</span>
              </div>
              <p className={`text-[11px] leading-relaxed ${
                isDark ? 'text-white/50' : 'text-slate-600'
              }`}>
                Click below to set up your 4-digit passcode and unlock the dashboard.
              </p>
              <button
                type="button"
                onClick={() => setIsAddPasscodeOpen(true)}
                className="w-full py-2.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Your Login Passcode</span>
              </button>
            </div>
          ) : (
            <div className={`mt-4 pt-3 border-t flex items-center justify-between text-xs font-mono ${
              isDark ? 'border-white/10' : 'border-slate-200'
            }`}>
              <span className={isDark ? 'text-white/40' : 'text-slate-500'}>
                {operators.length} Passcode{operators.length > 1 ? 's' : ''} Active
              </span>
              <button
                type="button"
                onClick={() => setIsAddPasscodeOpen(true)}
                className={`flex items-center gap-1 font-medium transition-colors ${
                  isDark ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-700 hover:text-emerald-800'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Another Passcode</span>
              </button>
            </div>
          )}

          {/* Quick Passcode Helper / Directory */}
          <QuickPasscodeHelper
            operators={operators}
            onSelectPasscode={handleSelectQuickPasscode}
            onAddOperator={onAddOperator}
          />
        </div>
      </main>

      {/* Quiet Footer Contract: Minimal metadata */}
      <footer className={`relative z-10 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono w-full max-w-5xl mx-auto gap-2 pt-4 border-t ${
        isDark ? 'text-white/40 border-white/5' : 'text-slate-500 border-slate-200'
      }`}>
        <div className="flex items-center gap-3">
          <span>Solum Agronomics Ltd · Field Gateway v2.4</span>
          <span aria-hidden="true">·</span>
          <button 
            type="button"
            onClick={() => setIsExportOpen(true)}
            className={`transition-colors underline underline-offset-2 flex items-center gap-1 ${
              isDark ? 'hover:text-emerald-300 text-white/40' : 'hover:text-emerald-700 text-slate-500'
            }`}
          >
            <Code2 className={`w-3 h-3 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
            <span>Export to VSCodium</span>
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span>Need assistance? Contact Farm Ops (Ext. 04)</span>
        </div>
      </footer>

      {/* Add Passcode Modal */}
      <AddPasscodeModal
        isOpen={isAddPasscodeOpen}
        onClose={() => setIsAddPasscodeOpen(false)}
        onSave={(newOp, autoLogin) => {
          onAddOperator(newOp);
          if (autoLogin) {
            onSuccessfulLogin(newOp);
          } else {
            setPasscode(newOp.passcode);
            verifyPasscode(newOp.passcode);
          }
        }}
        existingPasscodes={operators.map((o) => o.passcode)}
      />

      {/* Export to VSCodium modal dialog */}
      <ExportVSCodiumModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />
    </div>
  );
};
