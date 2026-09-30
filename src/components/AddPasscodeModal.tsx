import React, { useState } from 'react';
import { FarmOperator } from '../types/farm';
import { X, KeyRound, ShieldCheck, Check } from 'lucide-react';
import { sound } from '../utils/audio';
import { useTheme } from '../context/ThemeContext';

interface AddPasscodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (operator: FarmOperator, autoLogin: boolean) => void;
  existingPasscodes: string[];
}

export const AddPasscodeModal: React.FC<AddPasscodeModalProps> = ({
  isOpen,
  onClose,
  onSave,
  existingPasscodes
}) => {
  const { isDark } = useTheme();
  const [name, setName] = useState('');
  const [passcode, setPasscode] = useState('');
  const [role, setRole] = useState('Lead Agronomist');
  const [sector, setSector] = useState('North Orchard');
  const [autoLogin, setAutoLogin] = useState(true);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter operator name');
      return;
    }
    if (!/^\d{4}$/.test(passcode)) {
      setError('Passcode must be exactly 4 digits (e.g. 1234)');
      return;
    }
    if (existingPasscodes.includes(passcode)) {
      setError(`Passcode ${passcode} is already in use by another operator`);
      return;
    }

    sound.playSuccess();

    const initials = name
      .trim()
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'OP';

    const newOperator: FarmOperator = {
      id: `op-${Date.now()}`,
      passcode: passcode.trim(),
      name: name.trim(),
      role: role.trim() || 'Field Specialist',
      sector: sector.trim() || 'Central Operations',
      avatarInitials: initials,
      activeShift: '07:00 – 16:00',
      assignedTasksCount: 3,
      badgeId: `AGR-${Math.floor(100 + Math.random() * 900)}`,
      clearanceLevel: 'Supervisor'
    };

    onSave(newOperator, autoLogin);
    onClose();
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md ${
      isDark ? 'bg-black/80' : 'bg-slate-900/40'
    }`}>
      <div className={`relative w-full max-w-md rounded-3xl shadow-2xl p-6 sm:p-7 overflow-hidden space-y-5 border ${
        isDark 
          ? 'bg-[#131E17] border-white/10 text-white' 
          : 'bg-white border-slate-200 text-slate-900 shadow-xl'
      }`}>
        {/* Header */}
        <div className={`flex items-start justify-between pb-3 border-b ${
          isDark ? 'border-white/10' : 'border-slate-200'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl ${
              isDark 
                ? 'bg-[#223528] border border-emerald-500/20 text-emerald-400' 
                : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
            }`}>
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Add Farm Passcode
              </h3>
              <p className={`text-xs ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
                Register a new operator passcode in your database.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${
              isDark ? 'text-white/40 hover:text-white hover:bg-white/10' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-xs font-mono uppercase tracking-wider mb-1.5 ${
              isDark ? 'text-white/70' : 'text-slate-700 font-semibold'
            }`}>
              Operator Full Name *
            </label>
            <input
              type="text"
              required
              autoFocus
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              placeholder="e.g. Elena Vance or Your Name"
              className={`w-full px-3.5 py-2.5 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors border ${
                isDark 
                  ? 'bg-black/40 border-white/10 text-white placeholder:text-white/30' 
                  : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white'
              }`}
            />
          </div>

          <div>
            <label className={`block text-xs font-mono uppercase tracking-wider mb-1.5 ${
              isDark ? 'text-white/70' : 'text-slate-700 font-semibold'
            }`}>
              Unique 4-Digit Passcode *
            </label>
            <input
              type="text"
              required
              maxLength={4}
              value={passcode}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, '').slice(0, 4);
                setPasscode(digits);
                setError('');
              }}
              placeholder="e.g. 1234, 7429, 0000"
              className={`w-full px-3.5 py-2.5 text-base font-mono tracking-widest rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors border ${
                isDark 
                  ? 'bg-black/40 border-white/10 text-emerald-300 placeholder:text-white/30' 
                  : 'bg-slate-50 border-slate-300 text-emerald-800 font-bold placeholder:text-slate-400 focus:bg-white'
              }`}
            />
            <span className={`text-[11px] font-mono mt-1 block ${
              isDark ? 'text-white/40' : 'text-slate-500'
            }`}>
              Enter any 4 numbers you'll use to log in.
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`block text-xs font-mono uppercase tracking-wider mb-1.5 ${
                isDark ? 'text-white/70' : 'text-slate-700 font-semibold'
              }`}>
                Role / Title
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className={`w-full px-3 py-2 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors border ${
                  isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-800'
                }`}
              >
                <option value="Lead Agronomist">Lead Agronomist</option>
                <option value="Irrigation Specialist">Irrigation Specialist</option>
                <option value="Livestock Manager">Livestock Manager</option>
                <option value="Field Specialist">Field Specialist</option>
                <option value="Farm Technician">Farm Technician</option>
              </select>
            </div>

            <div>
              <label className={`block text-xs font-mono uppercase tracking-wider mb-1.5 ${
                isDark ? 'text-white/70' : 'text-slate-700 font-semibold'
              }`}>
                Assigned Sector
              </label>
              <select
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className={`w-full px-3 py-2 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors border ${
                  isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-800'
                }`}
              >
                <option value="Dairy Herd Alpha">Dairy Herd Alpha</option>
                <option value="North Orchard">North Orchard</option>
                <option value="South Pastures">South Pastures</option>
                <option value="Greenhouse Complex">Greenhouse Complex</option>
                <option value="Livestock Sector">Livestock Sector</option>
              </select>
            </div>
          </div>

          {/* Auto Login option */}
          <label className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer select-none ${
            isDark 
              ? 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04]' 
              : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
          }`}>
            <input
              type="checkbox"
              checked={autoLogin}
              onChange={(e) => setAutoLogin(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 accent-emerald-600"
            />
            <span className={`text-xs ${isDark ? 'text-white/80' : 'text-slate-700 font-medium'}`}>
              Log in immediately to dashboard upon saving
            </span>
          </label>

          {/* Error display */}
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 py-2.5 rounded-xl text-xs font-medium transition-colors border ${
                isDark 
                  ? 'bg-white/[0.04] hover:bg-white/[0.08] text-white/70 border-white/10' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Save Passcode</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
