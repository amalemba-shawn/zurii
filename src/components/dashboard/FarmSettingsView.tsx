import React, { useState } from 'react';
import { FarmOperator, LivestockSector } from '../../types/farm';
import { useTheme } from '../../context/ThemeContext';
import { sound } from '../../utils/audio';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Settings, 
  Plus, 
  Trash2, 
  UserCheck, 
  Users, 
  Milk, 
  Beef, 
  Tag, 
  Lock, 
  Check, 
  AlertTriangle,
  ChevronRight,
  Layers,
  Sparkles,
  KeyRound
} from 'lucide-react';

interface FarmSettingsViewProps {
  currentOperator: FarmOperator;
  operators: FarmOperator[];
  sectors: LivestockSector[];
  onAddSector: (newSector: LivestockSector) => void;
  onDeleteSector: (sectorId: string) => void;
  onUpdateOperatorRole: (
    operatorId: string, 
    role: string, 
    clearance: 'Field Tech' | 'Specialist' | 'Supervisor' | 'Farm Manager',
    sector?: string
  ) => void;
  onAddOperator: (operator: FarmOperator) => void;
  onDeleteOperator: (operatorId: string) => void;
}

export const FarmSettingsView: React.FC<FarmSettingsViewProps> = ({
  currentOperator,
  operators,
  sectors,
  onAddSector,
  onDeleteSector,
  onUpdateOperatorRole,
  onAddOperator,
  onDeleteOperator
}) => {
  const { isDark } = useTheme();

  // Role verification check: Farm Manager or Admin
  const isAuthorized = 
    currentOperator.clearanceLevel === 'Farm Manager' ||
    currentOperator.role.toLowerCase().includes('manager') ||
    currentOperator.role.toLowerCase().includes('admin') ||
    currentOperator.role.toLowerCase().includes('lead');

  const [activeTab, setActiveTab] = useState<'sectors' | 'users'>('sectors');

  // Sector addition form state
  const [isAddSectorOpen, setIsAddSectorOpen] = useState(false);
  const [sectorName, setSectorName] = useState('');
  const [animalCategory, setAnimalCategory] = useState<'dairy' | 'meat'>('meat');
  const [animalType, setAnimalType] = useState('sheep');
  const [headCount, setHeadCount] = useState('35');
  const [location, setLocation] = useState('South Hill Pasture 5');
  const [pastureOrPen, setPastureOrPen] = useState('Paddock 5 (Rotational Fescue)');
  const [metricName, setMetricName] = useState('Average Daily Gain (ADG)');
  const [metricValue, setMetricValue] = useState('+0.95 kg / day');
  const [efficiency, setEfficiency] = useState('Pasture Condition 4.2 / 5');
  const [sectorError, setSectorError] = useState('');

  // User editing role modal state
  const [editingOperator, setEditingOperator] = useState<FarmOperator | null>(null);
  const [assignedRole, setAssignedRole] = useState('');
  const [assignedClearance, setAssignedClearance] = useState<'Field Tech' | 'Specialist' | 'Supervisor' | 'Farm Manager'>('Specialist');
  const [assignedSector, setAssignedSector] = useState('');

  // Add new operator modal state
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserPasscode, setNewUserPasscode] = useState('');
  const [newUserRole, setNewUserRole] = useState('Livestock Operator');
  const [newUserClearance, setNewUserClearance] = useState<'Field Tech' | 'Specialist' | 'Supervisor' | 'Farm Manager'>('Specialist');
  const [newUserSector, setNewUserSector] = useState('Meat Livestock');
  const [userFormError, setUserFormError] = useState('');

  // Delete confirm state
  const [sectorToDelete, setSectorToDelete] = useState<string | null>(null);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  // If unauthorized, show security guard screen
  if (!isAuthorized) {
    return (
      <div className={`p-8 rounded-3xl border text-center max-w-xl mx-auto my-12 space-y-4 shadow-xl ${
        isDark ? 'bg-[#131E17] border-red-500/30 text-white' : 'bg-white border-red-200 text-slate-900'
      }`}>
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-500 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold tracking-tight">Access Restricted</h2>
        <p className={`text-sm max-w-md mx-auto ${isDark ? 'text-white/60' : 'text-slate-600'}`}>
          The Farm Management & System Configuration tab is restricted to <strong>Farm Managers</strong> and <strong>System Administrators</strong>.
        </p>
        <div className={`p-3 rounded-xl border text-xs font-mono inline-block ${
          isDark ? 'bg-black/30 border-white/10 text-white/70' : 'bg-slate-50 border-slate-200 text-slate-700'
        }`}>
          Current Role: <span className="text-emerald-500 font-semibold">{currentOperator.role}</span> · Clearance: <span className="text-amber-500">{currentOperator.clearanceLevel}</span>
        </div>
        <p className={`text-xs ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
          Please lock the terminal and authenticate using an authorized administrator badge or passcode (e.g. Elena Vance: 1234 or Marcus Holt: 5678).
        </p>
      </div>
    );
  }

  // Handle Create Sector
  const handleCreateSector = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sectorName.trim()) {
      setSectorError('Please provide a descriptive sector name');
      return;
    }

    const countNum = parseInt(headCount) || 0;
    const cleanId = `${animalType.toLowerCase().replace(/\s+/g, '-')}-${animalCategory}`;

    // Ensure unique ID
    let finalId = cleanId;
    if (sectors.some(s => s.id === finalId)) {
      finalId = `${cleanId}-${Date.now().toString().slice(-4)}`;
    }

    const newSector: LivestockSector = {
      id: finalId,
      name: sectorName.trim(),
      animalType: animalType.trim(),
      category: animalCategory,
      headCount: countNum,
      location: location.trim() || 'Central Paddock',
      pastureOrPen: pastureOrPen.trim() || 'Paddock Zone',
      healthStatus: 'Optimal',
      dailyOutput: {
        metricName: metricName.trim() || (animalCategory === 'dairy' ? 'Daily Milk Volume' : 'Average Daily Gain'),
        metricValue: metricValue.trim() || (animalCategory === 'dairy' ? '380 Liters' : '+1.1 kg / day'),
        efficiency: efficiency.trim() || 'Nominal Feed Conversion'
      },
      feedInventoryKg: 4500,
      waterConsumptionL: 1200,
      housingTemp: 64,
      alerts: [`New animal sector ${sectorName} commissioned by ${currentOperator.name}`],
      recentLogs: [
        {
          id: `sl-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          action: `Commissioned animal sector "${sectorName}" (${animalCategory.toUpperCase()})`,
          operator: currentOperator.name
        }
      ],
      animals: []
    };

    sound.playSuccess();
    onAddSector(newSector);
    setIsAddSectorOpen(false);
    setSectorName('');
    setHeadCount('25');
    setSectorError('');
  };

  // Handle Update Role
  const handleSaveRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOperator) return;
    sound.playSuccess();
    onUpdateOperatorRole(editingOperator.id, assignedRole, assignedClearance, assignedSector);
    setEditingOperator(null);
  };

  // Handle Create New User
  const handleCreateNewUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserPasscode.trim()) {
      setUserFormError('Name and 4-digit passcode are required');
      return;
    }
    if (!/^\d{4}$/.test(newUserPasscode)) {
      setUserFormError('Passcode must be exactly 4 numeric digits');
      return;
    }
    if (operators.some(op => op.passcode === newUserPasscode)) {
      setUserFormError('Passcode is already assigned to another user');
      return;
    }

    const initials = newUserName
      .split(' ')
      .map(n => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'OP';

    const newOp: FarmOperator = {
      id: `op-${Date.now()}`,
      name: newUserName.trim(),
      role: newUserRole.trim(),
      clearanceLevel: newUserClearance,
      sector: newUserSector.trim(),
      passcode: newUserPasscode.trim(),
      avatarInitials: initials,
      activeShift: '07:00 – 16:00',
      assignedTasksCount: 3,
      badgeId: `OPR-${Math.floor(100 + Math.random() * 900)}`
    };

    sound.playSuccess();
    onAddOperator(newOp);
    setIsAddUserOpen(false);
    setNewUserName('');
    setNewUserPasscode('');
    setUserFormError('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className={`p-6 rounded-3xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm ${
        isDark ? 'bg-[#131E17] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-2xl ${
            isDark ? 'bg-emerald-950/60 border border-emerald-500/30 text-emerald-400' : 'bg-emerald-100 border border-emerald-300 text-emerald-800'
          }`}>
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight">Farm Administration & Settings</h1>
              <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border font-semibold ${
                isDark ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-emerald-100 text-emerald-800 border-emerald-300'
              }`}>
                Admin Portal
              </span>
            </div>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
              Manage animal species & sectors, configure sidebar visibility, and assign or de-assign user roles.
            </p>
          </div>
        </div>

        {/* Tab Switcher: Sectors vs Users */}
        <div className={`flex items-center p-1 rounded-2xl border text-xs font-mono ${
          isDark ? 'bg-black/40 border-white/10' : 'bg-slate-100 border-slate-200'
        }`}>
          <button
            type="button"
            onClick={() => setActiveTab('sectors')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'sectors'
                ? isDark 
                  ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/30 font-semibold' 
                  : 'bg-white text-emerald-800 font-semibold shadow-xs border border-slate-200'
                : isDark ? 'text-white/50 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Animal Sectors ({sectors.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'users'
                ? isDark 
                  ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/30 font-semibold' 
                  : 'bg-white text-emerald-800 font-semibold shadow-xs border border-slate-200'
                : isDark ? 'text-white/50 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>User Roles ({operators.length})</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: ANIMAL SECTOR MANAGEMENT (ADD & REMOVE ANIMALS)   */}
      {/* ======================================================== */}
      {activeTab === 'sectors' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold">Active Livestock & Poultry Sectors</h2>
              <p className={`text-xs ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
                Animals and sectors configured here automatically sync with the sidebar dropdowns and farm telemetry.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAddSectorOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Animal Sector to Sidebar</span>
            </button>
          </div>

          {/* Sectors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sectors.map((sec) => {
              const isDairy = sec.category === 'dairy';
              return (
                <div
                  key={sec.id}
                  className={`p-5 rounded-3xl border flex flex-col justify-between transition-all hover:border-emerald-500/40 ${
                    isDark ? 'bg-[#131E17] border-white/10' : 'bg-white border-slate-200 shadow-sm'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className={`p-2.5 rounded-2xl border ${
                          isDairy
                            ? isDark ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-400' : 'bg-emerald-100 border-emerald-300 text-emerald-800'
                            : isDark ? 'bg-amber-950/60 border-amber-500/30 text-amber-400' : 'bg-amber-100 border-amber-300 text-amber-800'
                        }`}>
                          {isDairy ? <Milk className="w-4 h-4" /> : <Beef className="w-4 h-4" />}
                        </div>
                        <div>
                          <h3 className="text-sm font-bold tracking-tight leading-snug">{sec.name}</h3>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold ${
                            isDairy
                              ? isDark ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/20' : 'bg-emerald-100 text-emerald-800'
                              : isDark ? 'bg-amber-950/80 text-amber-300 border border-amber-500/20' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {sec.category} Animal
                          </span>
                        </div>
                      </div>

                      <span className={`text-xs font-mono px-2.5 py-1 rounded-xl border font-bold ${
                        isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-100 border-slate-200 text-slate-800'
                      }`}>
                        {sec.headCount} heads
                      </span>
                    </div>

                    <div className={`p-3 rounded-2xl border text-xs font-mono space-y-1.5 ${
                      isDark ? 'bg-black/30 border-white/5' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className={isDark ? 'text-white/40' : 'text-slate-400'}>Location:</span>
                        <span className="truncate font-medium">{sec.pastureOrPen}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={isDark ? 'text-white/40' : 'text-slate-400'}>{sec.dailyOutput.metricName}:</span>
                        <span className={`font-semibold ${isDairy ? 'text-emerald-500' : 'text-amber-500'}`}>
                          {sec.dailyOutput.metricValue}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={isDark ? 'text-white/40' : 'text-slate-400'}>Sidebar Group:</span>
                        <span className="font-semibold capitalize">
                          {sec.category === 'dairy' ? 'Dairy Animals' : 'Meat Animals'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className={`mt-4 pt-3 border-t flex items-center justify-between ${
                    isDark ? 'border-white/10' : 'border-slate-200'
                  }`}>
                    <span className={`text-[10px] font-mono ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
                      ID: {sec.id}
                    </span>

                    {sectorToDelete === sec.id ? (
                      <div className="flex items-center gap-1.5 animate-fade-in">
                        <button
                          type="button"
                          onClick={() => {
                            sound.playBackspace();
                            onDeleteSector(sec.id);
                            setSectorToDelete(null);
                          }}
                          className="px-2.5 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold cursor-pointer"
                        >
                          Confirm
                        </button>
                        <button
                          type="button"
                          onClick={() => setSectorToDelete(null)}
                          className={`px-2 py-1 text-xs rounded-lg ${isDark ? 'text-white/60 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setSectorToDelete(sec.id)}
                        className="text-xs font-mono text-red-500 hover:text-red-600 flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove Sector</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: USER ROLE MANAGEMENT (ASSIGN & DE-ASSIGN ROLES)   */}
      {/* ======================================================== */}
      {activeTab === 'users' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold">System Operators & Role Access Control</h2>
              <p className={`text-xs ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
                Assign and de-assign clearance levels, shift assignments, and passcodes for all farm workers.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAddUserOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Register New Operator</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {operators.map((op) => {
              const isCurrentUser = op.id === currentOperator.id;
              return (
                <div
                  key={op.id}
                  className={`p-5 rounded-3xl border flex flex-col justify-between transition-all ${
                    isDark ? 'bg-[#131E17] border-white/10' : 'bg-white border-slate-200 shadow-sm'
                  } ${isCurrentUser ? 'ring-2 ring-emerald-500/50' : ''}`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center font-mono font-bold text-sm ${
                          isDark ? 'bg-[#223528] border-emerald-500/30 text-emerald-300' : 'bg-emerald-100 border-emerald-300 text-emerald-800'
                        }`}>
                          {op.avatarInitials}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="text-sm font-bold">{op.name}</h3>
                            {isCurrentUser && (
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-semibold">
                                You
                              </span>
                            )}
                          </div>
                          <p className={`text-xs font-medium ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                            {op.role}
                          </p>
                        </div>
                      </div>

                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-lg border font-semibold ${
                        op.clearanceLevel === 'Farm Manager'
                          ? 'bg-purple-950/80 border-purple-500/40 text-purple-300'
                          : op.clearanceLevel === 'Supervisor'
                          ? 'bg-amber-950/80 border-amber-500/40 text-amber-300'
                          : 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
                      }`}>
                        {op.clearanceLevel}
                      </span>
                    </div>

                    <div className={`p-3 rounded-2xl border text-xs font-mono space-y-1.5 ${
                      isDark ? 'bg-black/30 border-white/5' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className={isDark ? 'text-white/40' : 'text-slate-400'}>Assigned Sector:</span>
                        <span className="truncate font-medium">{op.sector}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={isDark ? 'text-white/40' : 'text-slate-400'}>Badge ID:</span>
                        <span className="font-semibold">{op.badgeId}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={isDark ? 'text-white/40' : 'text-slate-400'}>Passcode:</span>
                        <span className="font-mono tracking-widest text-emerald-500 font-bold">
                          {op.passcode ? `•••• (${op.passcode})` : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions: Reassign Role & Delete */}
                  <div className={`mt-4 pt-3 border-t flex items-center justify-between gap-2 ${
                    isDark ? 'border-white/10' : 'border-slate-200'
                  }`}>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingOperator(op);
                        setAssignedRole(op.role);
                        setAssignedClearance(op.clearanceLevel);
                        setAssignedSector(op.sector);
                      }}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-colors cursor-pointer ${
                        isDark 
                          ? 'bg-white/[0.04] hover:bg-white/[0.08] text-white border-white/10' 
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                      }`}
                    >
                      <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Re-assign Role</span>
                    </button>

                    {!isCurrentUser && (
                      userToDelete === op.id ? (
                        <div className="flex items-center gap-1 animate-fade-in">
                          <button
                            type="button"
                            onClick={() => {
                              sound.playBackspace();
                              onDeleteOperator(op.id);
                              setUserToDelete(null);
                            }}
                            className="px-2 py-1 text-xs bg-red-600 text-white rounded font-medium"
                          >
                            Yes
                          </button>
                          <button
                            type="button"
                            onClick={() => setUserToDelete(null)}
                            className={`px-1.5 py-1 text-xs ${isDark ? 'text-white/50' : 'text-slate-400'}`}
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setUserToDelete(op.id)}
                          className="text-xs text-red-500 hover:text-red-600 p-1.5 rounded-lg transition-colors cursor-pointer"
                          title="Revoke operator"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD ANIMAL SECTOR (Immediately affects sidebar)   */}
      {/* ======================================================== */}
      {isAddSectorOpen && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md overflow-y-auto ${
          isDark ? 'bg-black/85' : 'bg-slate-900/40'
        }`}>
          <div className={`relative w-full max-w-xl rounded-3xl shadow-2xl p-6 sm:p-7 space-y-5 my-6 max-h-[92vh] overflow-y-auto border ${
            isDark ? 'bg-[#131E17] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-start justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-600 text-white">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Add Animal Sector / Species</h3>
                  <p className={`text-xs ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
                    This animal sector will immediately appear in the left sidebar under Dairy or Meat dropdowns.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddSectorOpen(false)}
                className={`p-1.5 rounded-lg ${isDark ? 'text-white/40 hover:text-white' : 'text-slate-400 hover:text-slate-700'}`}
              >
                ✕
              </button>
            </div>

            {sectorError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-500 font-medium">
                {sectorError}
              </div>
            )}

            <form onSubmit={handleCreateSector} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block mb-1 font-semibold uppercase tracking-wider text-[11px]">
                    Sector / Herd Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={sectorName}
                    onChange={(e) => setSectorName(e.target.value)}
                    placeholder="e.g. Sheep (Dairy Fleece), Heritage Turkeys"
                    className={`w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block mb-1 font-semibold uppercase tracking-wider text-[11px]">
                    Category (Sidebar Dropdown) *
                  </label>
                  <select
                    value={animalCategory}
                    onChange={(e) => setAnimalCategory(e.target.value as 'dairy' | 'meat')}
                    className={`w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  >
                    <option value="dairy" className={isDark ? 'bg-[#131E17] text-white' : 'bg-white text-slate-900'}>
                      🥛 Dairy Animals (Milking, Cheese, Dairy Herd)
                    </option>
                    <option value="meat" className={isDark ? 'bg-[#131E17] text-white' : 'bg-white text-slate-900'}>
                      🥩 Meat Animals (Livestock, Broiler, Market)
                    </option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block mb-1 font-semibold uppercase tracking-wider text-[11px]">
                    Animal Species
                  </label>
                  <input
                    type="text"
                    value={animalType}
                    onChange={(e) => setAnimalType(e.target.value)}
                    placeholder="e.g. sheep, pigs, turkeys"
                    className={`w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block mb-1 font-semibold uppercase tracking-wider text-[11px]">
                    Initial Head Count
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={headCount}
                    onChange={(e) => setHeadCount(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block mb-1 font-semibold uppercase tracking-wider text-[11px]">
                    Pasture / Pen
                  </label>
                  <input
                    type="text"
                    value={pastureOrPen}
                    onChange={(e) => setPastureOrPen(e.target.value)}
                    placeholder="e.g. Paddock 5"
                    className={`w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block mb-1 font-semibold uppercase tracking-wider text-[11px]">
                    Primary Output Metric Name
                  </label>
                  <input
                    type="text"
                    value={metricName}
                    onChange={(e) => setMetricName(e.target.value)}
                    placeholder="e.g. Daily Yield, ADG"
                    className={`w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block mb-1 font-semibold uppercase tracking-wider text-[11px]">
                    Metric Value Target
                  </label>
                  <input
                    type="text"
                    value={metricValue}
                    onChange={(e) => setMetricValue(e.target.value)}
                    placeholder="e.g. 450 Liters, +1.2 kg / day"
                    className={`w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddSectorOpen(false)}
                  className={`px-4 py-2 rounded-xl border ${
                    isDark ? 'border-white/10 text-white/70 hover:text-white' : 'border-slate-300 text-slate-700'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Check className="w-4 h-4" />
                  <span>Publish to Sidebar & Database</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: RE-ASSIGN USER ROLE                               */}
      {/* ======================================================== */}
      {editingOperator && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md ${
          isDark ? 'bg-black/85' : 'bg-slate-900/40'
        }`}>
          <div className={`relative w-full max-w-md rounded-3xl shadow-2xl p-6 space-y-4 border ${
            isDark ? 'bg-[#131E17] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-start justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="text-base font-bold">Assign & Update Role: {editingOperator.name}</h3>
                <p className={`text-xs ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
                  Badge: {editingOperator.badgeId} · Passcode: {editingOperator.passcode}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingOperator(null)}
                className={`p-1 ${isDark ? 'text-white/40 hover:text-white' : 'text-slate-400'}`}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveRole} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block mb-1 font-semibold uppercase text-[11px]">Role Title</label>
                <select
                  value={assignedRole}
                  onChange={(e) => setAssignedRole(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                >
                  <option value="Farm Manager" className={isDark ? 'bg-[#131E17] text-white' : 'bg-white text-slate-900'}>Farm Manager (Full Access)</option>
                  <option value="Admin & Operations Lead" className={isDark ? 'bg-[#131E17] text-white' : 'bg-white text-slate-900'}>Admin & Operations Lead (Full Access)</option>
                  <option value="Herd Supervisor" className={isDark ? 'bg-[#131E17] text-white' : 'bg-white text-slate-900'}>Herd Supervisor</option>
                  <option value="Senior Milking Specialist" className={isDark ? 'bg-[#131E17] text-white' : 'bg-white text-slate-900'}>Senior Milking Specialist</option>
                  <option value="Lead Agronomist & Field Tech" className={isDark ? 'bg-[#131E17] text-white' : 'bg-white text-slate-900'}>Lead Agronomist & Field Tech</option>
                  <option value="Livestock Operator" className={isDark ? 'bg-[#131E17] text-white' : 'bg-white text-slate-900'}>Livestock Operator</option>
                  <option value="Veterinary Health Inspector" className={isDark ? 'bg-[#131E17] text-white' : 'bg-white text-slate-900'}>Veterinary Health Inspector</option>
                  <option value="IoT & Sensors Technician" className={isDark ? 'bg-[#131E17] text-white' : 'bg-white text-slate-900'}>IoT & Sensors Technician</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 font-semibold uppercase text-[11px]">Clearance Level</label>
                <select
                  value={assignedClearance}
                  onChange={(e) => setAssignedClearance(e.target.value as any)}
                  className={`w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                >
                  <option value="Farm Manager" className={isDark ? 'bg-[#131E17] text-white' : 'bg-white text-slate-900'}>Farm Manager (Tier 1 - Full Settings & Roster Rights)</option>
                  <option value="Supervisor" className={isDark ? 'bg-[#131E17] text-white' : 'bg-white text-slate-900'}>Supervisor (Tier 2 - Operational Management)</option>
                  <option value="Specialist" className={isDark ? 'bg-[#131E17] text-white' : 'bg-white text-slate-900'}>Specialist (Tier 3 - Sector Entry & Harvesting)</option>
                  <option value="Field Tech" className={isDark ? 'bg-[#131E17] text-white' : 'bg-white text-slate-900'}>Field Tech (Tier 4 - Standard Field Operator)</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 font-semibold uppercase text-[11px]">Assigned Sector Jurisdiction</label>
                <input
                  type="text"
                  value={assignedSector}
                  onChange={(e) => setAssignedSector(e.target.value)}
                  placeholder="e.g. All Farm Sectors, Dairy Cattle, Crops"
                  className={`w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingOperator(null)}
                  className={`px-3 py-1.5 rounded-xl border ${
                    isDark ? 'border-white/10 text-white/70' : 'border-slate-300 text-slate-700'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold cursor-pointer"
                >
                  Save Role Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: REGISTER NEW USER & PASSCODE                      */}
      {/* ======================================================== */}
      {isAddUserOpen && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md ${
          isDark ? 'bg-black/85' : 'bg-slate-900/40'
        }`}>
          <div className={`relative w-full max-w-md rounded-3xl shadow-2xl p-6 space-y-4 border ${
            isDark ? 'bg-[#131E17] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-start justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="text-base font-bold">Register New Operator</h3>
                <p className={`text-xs ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
                  Create a new worker profile with a 4-digit terminal passcode.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddUserOpen(false)}
                className={`p-1 ${isDark ? 'text-white/40 hover:text-white' : 'text-slate-400'}`}
              >
                ✕
              </button>
            </div>

            {userFormError && (
              <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-500">
                {userFormError}
              </div>
            )}

            <form onSubmit={handleCreateNewUser} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block mb-1 font-semibold uppercase text-[11px]">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="e.g. Robert Thorne"
                  className={`w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold uppercase text-[11px]">4-Digit Passcode *</label>
                <input
                  type="text"
                  maxLength={4}
                  required
                  value={newUserPasscode}
                  onChange={(e) => setNewUserPasscode(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 7788"
                  className={`w-full px-3 py-2 rounded-xl border tracking-widest text-center font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    isDark ? 'bg-black/40 border-white/10 text-emerald-300' : 'bg-slate-50 border-slate-300 text-emerald-800'
                  }`}
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold uppercase text-[11px]">Initial Role</label>
                <input
                  type="text"
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                  placeholder="e.g. Milking Technician, Agronomist"
                  className={`w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold uppercase text-[11px]">Clearance Level</label>
                <select
                  value={newUserClearance}
                  onChange={(e) => setNewUserClearance(e.target.value as any)}
                  className={`w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                >
                  <option value="Farm Manager" className={isDark ? 'bg-[#131E17] text-white' : 'bg-white text-slate-900'}>Farm Manager (Full Access)</option>
                  <option value="Supervisor" className={isDark ? 'bg-[#131E17] text-white' : 'bg-white text-slate-900'}>Supervisor</option>
                  <option value="Specialist" className={isDark ? 'bg-[#131E17] text-white' : 'bg-white text-slate-900'}>Specialist</option>
                  <option value="Field Tech" className={isDark ? 'bg-[#131E17] text-white' : 'bg-white text-slate-900'}>Field Tech</option>
                </select>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddUserOpen(false)}
                  className={`px-3 py-1.5 rounded-xl border ${
                    isDark ? 'border-white/10 text-white/70' : 'border-slate-300 text-slate-700'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold cursor-pointer"
                >
                  Register Operator
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
