import React, { useState } from 'react';
import { FarmOperator } from '../types/farm';
import { X, KeyRound, ShieldCheck, Check } from 'lucide-react';
import { sound } from '../utils/audio';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-[#131E17] border border-white/10 rounded-3xl shadow-2xl p-6 sm:p-7 text-white overflow-hidden space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#223528] border border-emerald-500/20 text-emerald-400">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">
                Add Farm Passcode
              </h3>
              <p className="text-xs text-white/50">
                Register a new operator passcode in your database.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-white/40 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1.5">
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
              className="w-full px-3.5 py-2.5 text-sm bg-black/40 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1.5">
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
              className="w-full px-3.5 py-2.5 text-base font-mono tracking-widest bg-black/40 border border-white/10 rounded-xl text-emerald-300 placeholder:text-white/30 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
            />
            <span className="text-[11px] font-mono text-white/40 mt-1 block">
              Enter any 4 numbers you'll use to log in.
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1.5">
                Role / Title
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-400"
              >
                <option value="Lead Agronomist">Lead Agronomist</option>
                <option value="Irrigation Specialist">Irrigation Specialist</option>
                <option value="Greenhouse Supervisor">Greenhouse Supervisor</option>
                <option value="Field Tech Lead">Field Tech Lead</option>
                <option value="Farm Operations Manager">Farm Operations Manager</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1.5">
                Assigned Sector
              </label>
              <select
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-400"
              >
                <option value="North Orchard">North Orchard</option>
                <option value="Sector 4 Flat">Sector 4 Flat</option>
                <option value="Hydroponics Bay B">Hydroponics Bay B</option>
                <option value="West Grain Silos">West Grain Silos</option>
                <option value="Central Operations">Central Operations</option>
              </select>
            </div>
          </div>

          {/* Auto Login Checkbox */}
          <label className="flex items-center gap-2.5 text-xs text-white/70 cursor-pointer select-none pt-1">
            <input
              type="checkbox"
              checked={autoLogin}
              onChange={(e) => setAutoLogin(e.target.checked)}
              className="w-4 h-4 rounded border-white/20 bg-black/40 text-emerald-500 focus:ring-0 focus:ring-offset-0"
            />
            <span>Log in immediately to dashboard upon saving</span>
          </label>

          {error && (
            <div className="p-2.5 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-300">
              {error}
            </div>
          )}

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-white/60 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold bg-[#376343] hover:bg-[#437752] text-white rounded-xl transition-all shadow-md flex items-center gap-1.5 active:scale-95"
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
