import React, { useState } from 'react';
import { FarmOperator } from '../types/farm';
import { KeyRound, ShieldCheck, Plus, X, UserCheck } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface QuickPasscodeHelperProps {
  operators: FarmOperator[];
  onSelectPasscode: (code: string) => void;
  onAddOperator: (operator: FarmOperator) => void;
}

export const QuickPasscodeHelper: React.FC<QuickPasscodeHelperProps> = ({
  operators,
  onSelectPasscode,
  onAddOperator
}) => {
  const { isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newSector, setNewSector] = useState('');
  const [newPasscode, setNewPasscode] = useState('');
  const [formError, setFormError] = useState('');

  const handleCreateOperator = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPasscode.trim()) {
      setFormError('Name and 4-digit passcode are required');
      return;
    }
    if (!/^\d{4}$/.test(newPasscode)) {
      setFormError('Passcode must be exactly 4 numeric digits');
      return;
    }
    if (operators.some(op => op.passcode === newPasscode)) {
      setFormError('This passcode is already assigned to another operator');
      return;
    }

    const initials = newName
      .split(' ')
      .map(n => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'OP';

    const newOp: FarmOperator = {
      id: `op-custom-${Date.now()}`,
      name: newName.trim(),
      role: newRole.trim() || 'Field Agronomist',
      sector: newSector.trim() || 'General Operations',
      passcode: newPasscode,
      avatarInitials: initials,
      activeShift: '07:00 – 16:00',
      assignedTasksCount: 3,
      badgeId: `OPR-${Math.floor(100 + Math.random() * 900)}`,
      clearanceLevel: 'Specialist'
    };

    onAddOperator(newOp);
    onSelectPasscode(newPasscode);
    setShowAddForm(false);
    setIsOpen(false);
    setNewName('');
    setNewPasscode('');
    setNewRole('');
    setNewSector('');
    setFormError('');
  };

  return (
    <div className="mt-4 pt-3 border-t border-dashed flex flex-col items-center border-slate-200 dark:border-white/10">
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 text-xs font-mono transition-colors text-emerald-700 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium cursor-pointer"
      >
        <KeyRound className="w-3.5 h-3.5" />
        <span>Operator Directory & Test Passcodes</span>
      </button>

      {/* Directory Modal */}
      {isOpen && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md ${
          isDark ? 'bg-black/80' : 'bg-slate-900/40'
        }`}>
          <div className={`w-full max-w-md rounded-2xl p-5 border shadow-2xl transition-all ${
            isDark 
              ? 'bg-[#131E17] border-white/10 text-white' 
              : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className={`flex items-start justify-between pb-3 border-b ${
              isDark ? 'border-white/10' : 'border-slate-200'
            }`}>
              <div>
                <div className={`flex items-center gap-2 text-xs font-mono mb-1 ${
                  isDark ? 'text-emerald-400' : 'text-emerald-700 font-medium'
                }`}>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Solum FarmOS · Operator Registry</span>
                </div>
                <h3 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Active Operator Badges
                </h3>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
                  Select any operator below to load their unique 4-digit passcode.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setShowAddForm(false);
                }}
                className={`p-1.5 rounded-lg transition-colors ${
                  isDark ? 'text-white/40 hover:text-white hover:bg-white/10' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List of operators */}
            {!showAddForm ? (
              operators.length === 0 ? (
                <div className="py-8 text-center space-y-3">
                  <p className={`text-xs ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
                    Database is empty. No operator passcodes registered yet.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create First Operator Passcode</span>
                  </button>
                </div>
              ) : (
                <div className="mt-4 space-y-2 max-h-72 overflow-y-auto pr-1">
                  {operators.map((op) => (
                    <button
                      key={op.id}
                      type="button"
                      onClick={() => {
                        onSelectPasscode(op.passcode);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all duration-150 group cursor-pointer ${
                        isDark 
                          ? 'border-white/5 bg-white/[0.02] hover:bg-white/[0.06] hover:border-emerald-500/40' 
                          : 'border-slate-200 bg-slate-50 hover:bg-emerald-50/60 hover:border-emerald-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-lg border flex items-center justify-center font-mono text-xs font-semibold ${
                          isDark 
                            ? 'bg-[#223528] border-emerald-500/20 text-emerald-300' 
                            : 'bg-emerald-100 border-emerald-300 text-emerald-800'
                        }`}>
                          {op.avatarInitials}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium transition-colors ${
                              isDark ? 'text-white group-hover:text-emerald-300' : 'text-slate-900 group-hover:text-emerald-800'
                            }`}>
                              {op.name}
                            </span>
                            <span className={`text-[11px] font-mono ${
                              isDark ? 'text-white/40' : 'text-slate-500'
                            }`}>
                              {op.badgeId}
                            </span>
                          </div>
                          <div className={`text-xs flex items-center gap-1.5 mt-0.5 ${
                            isDark ? 'text-white/50' : 'text-slate-600'
                          }`}>
                            <span>{op.role}</span>
                            <span aria-hidden="true">·</span>
                            <span className={isDark ? 'text-white/40' : 'text-slate-400'}>{op.sector}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pl-3">
                        <span className={`font-mono text-sm tracking-widest px-2.5 py-1 rounded border font-bold ${
                          isDark 
                            ? 'text-emerald-400 bg-emerald-950/40 border-emerald-500/20' 
                            : 'text-emerald-800 bg-emerald-100 border-emerald-300'
                        }`}>
                          {op.passcode}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )
            ) : (
              /* Add new operator form */
              <form onSubmit={handleCreateOperator} className="mt-4 space-y-3">
                <div>
                  <label className={`block text-xs font-medium mb-1 ${
                    isDark ? 'text-white/70' : 'text-slate-700'
                  }`}>
                    Operator Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Liam Walker"
                    className={`w-full px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 border ${
                      isDark 
                        ? 'bg-black/40 border-white/10 text-white' 
                        : 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${
                      isDark ? 'text-white/70' : 'text-slate-700'
                    }`}>
                      Role
                    </label>
                    <input
                      type="text"
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      placeholder="e.g. Vineyard Lead"
                      className={`w-full px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 border ${
                        isDark 
                          ? 'bg-black/40 border-white/10 text-white' 
                          : 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${
                      isDark ? 'text-white/70' : 'text-slate-700'
                    }`}>
                      Sector
                    </label>
                    <input
                      type="text"
                      value={newSector}
                      onChange={(e) => setNewSector(e.target.value)}
                      placeholder="e.g. East Valley"
                      className={`w-full px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 border ${
                        isDark 
                          ? 'bg-black/40 border-white/10 text-white' 
                          : 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-xs font-medium mb-1 ${
                    isDark ? 'text-white/70' : 'text-slate-700'
                  }`}>
                    Unique 4-Digit Passcode
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    value={newPasscode}
                    onChange={(e) => setNewPasscode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="e.g. 5432"
                    className={`w-full px-3 py-2 text-base font-mono tracking-widest rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 border ${
                      isDark 
                        ? 'bg-black/40 border-white/10 text-white' 
                        : 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white font-bold'
                    }`}
                  />
                </div>

                {formError && (
                  <p className="text-xs text-red-500">{formError}</p>
                )}

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className={`px-3 py-1.5 text-xs rounded-lg ${
                      isDark ? 'text-white/60 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Back to List
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors cursor-pointer"
                  >
                    Save & Autofill
                  </button>
                </div>
              </form>
            )}

            {/* Bottom action inside directory modal */}
            {!showAddForm && operators.length > 0 && (
              <div className={`mt-4 pt-3 border-t flex justify-end ${
                isDark ? 'border-white/10' : 'border-slate-200'
              }`}>
                <button
                  type="button"
                  onClick={() => setShowAddForm(true)}
                  className={`inline-flex items-center gap-1.5 text-xs transition-colors ${
                    isDark ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-700 hover:text-emerald-800 font-medium'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Register Another Operator</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
