import React, { useState, useEffect, useCallback } from 'react';
import { 
  Sprout, 
  Delete, 
  RotateCcw, 
  Eye, 
  EyeOff, 
  Volume2, 
  VolumeX, 
  Clock, 
  CloudSun,
  ShieldCheck,
  CheckCircle2,
  Lock
} from 'lucide-react';

export interface FarmOperator {
  id: string;
  passcode: string;
  name: string;
  role: string;
  sector: string;
  badgeId: string;
  activeShift: string;
}

export interface FarmPasscodeLoginProps {
  operators?: FarmOperator[];
  onVerifyPasscode?: (code: string) => Promise<FarmOperator | null> | FarmOperator | null;
  onUnlock?: (operator: FarmOperator) => void;
  farmName?: string;
  stationName?: string;
}

export const FarmPasscodeLogin: React.FC<FarmPasscodeLoginProps> = ({
  operators = [],
  onVerifyPasscode,
  onUnlock,
  farmName = 'SOLUM AGRONOMICS',
  stationName = 'Field Terminal 04'
}) => {
  const [passcode, setPasscode] = useState<string>('');
  const [showDigits, setShowDigits] = useState<boolean>(false);
  const [status, setStatus] = useState<'idle' | 'checking' | 'error' | 'success'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [authenticatedOperator, setAuthenticatedOperator] = useState<FarmOperator | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<string>('');

  // Keep live time updated
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 10000);
    return () => clearInterval(timer);
  }, []);

  // Web Audio synthetic click
  const playClick = useCallback((freq = 320) => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.045);
    } catch {
      // AudioContext unavailable
    }
  }, [soundEnabled]);

  // Passcode verification
  const verifyPasscode = useCallback(async (code: string) => {
    setStatus('checking');
    try {
      let matched: FarmOperator | null = null;
      if (onVerifyPasscode) {
        matched = await onVerifyPasscode(code);
      } else {
        matched = operators.find((op) => op.passcode === code) || null;
      }

      if (matched) {
        setStatus('success');
        setAuthenticatedOperator(matched);
        if (onUnlock) onUnlock(matched);
      } else {
        setStatus('error');
        setErrorMessage('Unrecognized operator passcode');
        setTimeout(() => {
          setPasscode('');
          setStatus('idle');
        }, 1200);
      }
    } catch {
      setStatus('error');
      setErrorMessage('Database verification failed');
      setTimeout(() => {
        setPasscode('');
        setStatus('idle');
      }, 1200);
    }
  }, [operators, onVerifyPasscode, onUnlock]);

  const handleDigitPress = useCallback((digit: string) => {
    if (status === 'checking' || status === 'success') return;
    playClick(320);

    if (status === 'error') {
      setStatus('idle');
      setPasscode(digit);
      return;
    }

    if (passcode.length < 4) {
      const next = passcode + digit;
      setPasscode(next);
      if (next.length === 4) {
        verifyPasscode(next);
      }
    }
  }, [passcode, status, playClick, verifyPasscode]);

  const handleBackspace = useCallback(() => {
    if (status === 'checking' || status === 'success') return;
    playClick(220);
    if (status === 'error') {
      setStatus('idle');
      setPasscode('');
      return;
    }
    setPasscode((prev) => prev.slice(0, -1));
  }, [status, playClick]);

  const handleClear = useCallback(() => {
    if (status === 'checking' || status === 'success') return;
    playClick(180);
    setPasscode('');
    setStatus('idle');
  }, [status, playClick]);

  // Physical keyboard listeners
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (authenticatedOperator) return;
      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault();
        handleDigitPress(e.key);
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleClear();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleDigitPress, handleBackspace, handleClear, authenticatedOperator]);

  // If already unlocked
  if (authenticatedOperator) {
    return (
      <div className="min-h-screen bg-[#0E1510] text-[#E4ECE6] flex flex-col justify-center items-center p-6">
        <div className="w-full max-w-md bg-[#141F17]/90 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-[#233829] border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-300">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <div className="text-xs font-mono text-emerald-400 uppercase tracking-widest">
              Identity Verified
            </div>
            <h2 className="text-2xl font-semibold text-white mt-1">
              {authenticatedOperator.name}
            </h2>
            <div className="text-xs text-white/60 mt-1">
              {authenticatedOperator.role} · {authenticatedOperator.sector}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-left space-y-1.5 font-mono">
            <div className="flex justify-between text-white/60">
              <span>Badge ID</span>
              <span className="text-white">{authenticatedOperator.badgeId}</span>
            </div>
            <div className="flex justify-between text-white/60">
              <span>Shift Window</span>
              <span className="text-white">{authenticatedOperator.activeShift}</span>
            </div>
            <div className="flex justify-between text-white/60">
              <span>Terminal Node</span>
              <span className="text-emerald-400">{stationName}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setAuthenticatedOperator(null);
              setPasscode('');
              setStatus('idle');
            }}
            className="w-full py-3 px-4 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-white text-xs font-medium border border-white/10 flex items-center justify-center gap-2 transition-colors"
          >
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>Lock Terminal</span>
          </button>
        </div>
      </div>
    );
  }

  const keys = [
    { key: '1', label: '1', sub: '·' },
    { key: '2', label: '2', sub: 'ABC' },
    { key: '3', label: '3', sub: 'DEF' },
    { key: '4', label: '4', sub: 'GHI' },
    { key: '5', label: '5', sub: 'JKL' },
    { key: '6', label: '6', sub: 'MNO' },
    { key: '7', label: '7', sub: 'PQRS' },
    { key: '8', label: '8', sub: 'TUV' },
    { key: '9', label: '9', sub: 'WXYZ' },
    { key: 'C', label: 'C', isClear: true },
    { key: '0', label: '0', sub: '+' },
    { key: 'del', isDel: true }
  ];

  return (
    <div className="relative min-h-screen bg-[#0D1510] text-[#E5EAE7] flex flex-col justify-between p-4 sm:p-6 md:p-8 select-none">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#2F4C38_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* Top Header */}
      <header className="relative z-10 flex items-center justify-between w-full max-w-5xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#223527] border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Sprout className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm font-semibold tracking-tight text-white font-mono flex items-center gap-1.5">
              <span>{farmName}</span>
              <span className="text-[10px] text-emerald-400 px-1.5 rounded border border-emerald-500/20 bg-emerald-950/40">
                FIELD OS
              </span>
            </div>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-4 text-xs font-mono text-white/50">
          <div className="flex items-center gap-1.5">
            <CloudSun className="w-3.5 h-3.5 text-amber-300/80" />
            <span>64°F · North Orchard</span>
          </div>
          <span className="text-white/20">/</span>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-emerald-400/80" />
            <span className="text-white/80 tabular-nums">{currentTime || '08:00 AM'}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-2 rounded-xl text-white/50 hover:text-white bg-white/[0.04] border border-white/10 transition-colors"
          title={soundEnabled ? 'Mute' : 'Unmute'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-white/30" />}
        </button>
      </header>

      {/* Passcode Card */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center my-6">
        <div className="w-full max-w-[380px] rounded-3xl bg-[#121B15]/90 border border-white/10 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-mono tracking-widest text-emerald-400 uppercase mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {stationName} · Ready
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              Operator Sign In
            </h1>
            <p className="text-xs text-white/50 mt-1">
              Key in your unique 4-digit passcode
            </p>
          </div>

          {/* 4-Digit Display */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative flex items-center justify-center gap-3.5 py-3 px-5 rounded-2xl bg-white/[0.03] border border-white/10">
              {[0, 1, 2, 3].map((idx) => {
                const char = passcode[idx];
                const isFilled = char !== undefined;
                return (
                  <div
                    key={idx}
                    className={`flex items-center justify-center w-11 h-13 rounded-xl border transition-all duration-150 ${
                      isFilled
                        ? status === 'error'
                          ? 'border-red-400 bg-red-900/20 text-red-200'
                          : 'border-[#4E805B] bg-[#1E3024]/70 text-emerald-100 shadow-[0_0_12px_rgba(78,128,91,0.25)]'
                        : passcode.length === idx
                        ? 'border-white/40 bg-white/[0.05] animate-pulse'
                        : 'border-white/10 bg-transparent'
                    }`}
                  >
                    {isFilled ? (
                      showDigits ? (
                        <span className="font-mono text-lg font-medium text-emerald-100">
                          {char}
                        </span>
                      ) : (
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                      )
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                    )}
                  </div>
                );
              })}

              {passcode.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowDigits(!showDigits)}
                  className="absolute right-2 text-white/40 hover:text-white p-1"
                >
                  {showDigits ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              )}
            </div>

            {/* Helper status text */}
            <div className="h-6 mt-2.5 text-xs text-center font-mono">
              {status === 'checking' && <span className="text-emerald-300">Verifying credentials...</span>}
              {status === 'error' && <span className="text-red-400">{errorMessage}</span>}
              {status === 'idle' && (
                <span className="text-white/40">
                  {passcode.length === 0 ? 'Enter passcode to begin shift' : `${passcode.length} / 4 digits`}
                </span>
              )}
            </div>
          </div>

          {/* Numeric Keypad */}
          <div className="grid grid-cols-3 gap-3 w-full max-w-[320px] mx-auto select-none">
            {keys.map((k, i) => {
              if (k.isClear) {
                return (
                  <button
                    key="clear"
                    type="button"
                    onClick={handleClear}
                    className="flex flex-col items-center justify-center h-15 rounded-2xl border border-white/5 bg-white/[0.03] text-white/40 hover:text-white/80 hover:bg-white/[0.07] active:scale-95 transition-all"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span className="text-[9px] uppercase font-mono tracking-wider mt-1 opacity-70">Clear</span>
                  </button>
                );
              }
              if (k.isDel) {
                return (
                  <button
                    key="del"
                    type="button"
                    onClick={handleBackspace}
                    className="flex flex-col items-center justify-center h-15 rounded-2xl border border-white/5 bg-white/[0.03] text-white/40 hover:text-white/80 hover:bg-white/[0.07] active:scale-95 transition-all"
                  >
                    <Delete className="w-4 h-4" />
                    <span className="text-[9px] uppercase font-mono tracking-wider mt-1 opacity-70">Delete</span>
                  </button>
                );
              }
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleDigitPress(k.key)}
                  className="flex flex-col items-center justify-center h-15 rounded-2xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.09] hover:border-[#4E805B]/50 active:scale-95 active:bg-[#203325] transition-all"
                >
                  <span className="font-mono text-xl font-light text-white leading-none">
                    {k.label}
                  </span>
                  {k.sub && (
                    <span className="text-[9px] font-mono tracking-widest text-white/30 mt-1 uppercase">
                      {k.sub}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Database Operator Status */}
          <div className="mt-6 pt-4 border-t border-white/5 text-center">
            {operators.length > 0 ? (
              <span className="text-[10px] font-mono text-emerald-400/80 uppercase tracking-wider block">
                {operators.length} Operator Passcode{operators.length > 1 ? 's' : ''} Active in Database
              </span>
            ) : (
              <span className="text-[10px] font-mono text-white/40 block">
                Database ready · Pass custom operators or connect backend API
              </span>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 flex items-center justify-between text-[11px] text-white/40 font-mono w-full max-w-5xl mx-auto pt-4 border-t border-white/5">
        <span>Solum FarmOS · Field Terminal</span>
        <span>Keyboard numpad supported</span>
      </footer>
    </div>
  );
};

export default FarmPasscodeLogin;
