import React, { useState } from 'react';
import { FarmOperator } from '../types/farm';
import { KeyRound, ShieldCheck, Plus, X, UserCheck } from 'lucide-react';

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
    setNewRole('');
    setNewSector('');
    setNewPasscode('');
    setFormError('');
  };

  return (
    <>
      {/* Discreet bottom trigger button */}
      <div className="flex items-center justify-center mt-6">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-2 text-xs font-mono text-white/50 hover:text-emerald-400 py-1.5 px-3 rounded-lg border border-white/5 hover:border-emerald-500/30 bg-white/[0.02] hover:bg-emerald-950/20 transition-all duration-150"
        >
          <KeyRound className="w-3.5 h-3.5" />
          <span>Operator Directory & Test Passcodes</span>
        </button>
      </div>

      {/* Directory Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-[#141E17] border border-white/10 rounded-2xl shadow-2xl p-6 text-white overflow-hidden">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Solum FarmOS · Operator Registry</span>
                </div>
                <h3 className="text-base font-semibold text-white">
                  Active Operator Badges
                </h3>
                <p className="text-xs text-white/50 mt-0.5">
                  Select any operator below to load their unique 4-digit passcode.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setShowAddForm(false);
                }}
                className="p-1.5 text-white/40 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List of operators */}
            {!showAddForm ? (
              operators.length === 0 ? (
                <div className="py-8 text-center space-y-3">
                  <p className="text-xs text-white/50">
                    Database is empty. No operator passcodes registered yet.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium bg-[#376343] hover:bg-[#437752] text-white rounded-lg transition-colors"
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
                      className="w-full flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] hover:border-emerald-500/40 text-left transition-all duration-150 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[#223528] border border-emerald-500/20 flex items-center justify-center font-mono text-xs font-semibold text-emerald-300">
                          {op.avatarInitials}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-white group-hover:text-emerald-300 transition-colors">
                              {op.name}
                            </span>
                            <span className="text-[11px] text-white/40 font-mono">
                              {op.badgeId}
                            </span>
                          </div>
                          <div className="text-xs text-white/50 flex items-center gap-1.5 mt-0.5">
                            <span>{op.role}</span>
                            <span aria-hidden="true">·</span>
                            <span className="text-white/40">{op.sector}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pl-3">
                        <span className="font-mono text-sm tracking-widest text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded border border-emerald-500/20">
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
                  <label className="block text-xs font-medium text-white/70 mb-1">
                    Operator Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Liam Walker"
                    className="w-full px-3 py-2 text-sm bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-1">
                      Role
                    </label>
                    <input
                      type="text"
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      placeholder="e.g. Vineyard Lead"
                      className="w-full px-3 py-2 text-sm bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-1">
                      Assigned Sector
                    </label>
                    <input
                      type="text"
                      value={newSector}
                      onChange={(e) => setNewSector(e.target.value)}
                      placeholder="e.g. South Slope"
                      className="w-full px-3 py-2 text-sm bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1">
                    Unique 4-Digit Passcode
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    pattern="[0-9]{4}"
                    required
                    value={newPasscode}
                    onChange={(e) => setNewPasscode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="e.g. 5621"
                    className="w-full px-3 py-2 text-sm font-mono tracking-widest bg-black/40 border border-white/10 rounded-lg text-emerald-300 focus:outline-none focus:border-emerald-400"
                  />
                </div>

                {formError && (
                  <p className="text-xs text-red-400">{formError}</p>
                )}

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-3 py-1.5 text-xs text-white/60 hover:text-white rounded-lg hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-medium bg-[#376343] hover:bg-[#437752] text-white rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    Register & Fill Passcode
                  </button>
                </div>
              </form>
            )}

            {/* Footer action */}
            {!showAddForm && (
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-white/40">
                  Total Operators: {operators.length}
                </span>
                <button
                  type="button"
                  onClick={() => setShowAddForm(true)}
                  className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Register Custom Passcode</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
