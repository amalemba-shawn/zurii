import React, { useState } from 'react';
import { FarmOperator, SectorTelemetry, FarmTask } from '../types/farm';
import { 
  Lock, 
  Droplets, 
  Thermometer, 
  Sun, 
  Wind, 
  CheckCircle2, 
  Circle, 
  RefreshCw, 
  Compass,
  Sprout,
  UserPlus
} from 'lucide-react';
import { sound } from '../utils/audio';
import { AddPasscodeModal } from './AddPasscodeModal';

interface FarmDashboardProps {
  operator: FarmOperator;
  operators?: FarmOperator[];
  sectors: SectorTelemetry[];
  tasks: FarmTask[];
  onLockTerminal: () => void;
  onAddOperator?: (operator: FarmOperator) => void;
  bgMode: 'mist' | 'greenhouse' | 'solid';
  onChangeBgMode: (mode: 'mist' | 'greenhouse' | 'solid') => void;
}

export const FarmDashboard: React.FC<FarmDashboardProps> = ({
  operator,
  operators = [],
  sectors: initialSectors,
  tasks: initialTasks,
  onLockTerminal,
  onAddOperator,
  bgMode,
  onChangeBgMode
}) => {
  const [sectors, setSectors] = useState<SectorTelemetry[]>(initialSectors);
  const [tasks, setTasks] = useState<FarmTask[]>(initialTasks);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'irrigation' | 'tasks'>('overview');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleToggleTask = (taskId: string) => {
    sound.playKeyTap();
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleToggleIrrigation = (sectorId: string) => {
    sound.playKeyTap();
    setSectors(prev =>
      prev.map(s => {
        if (s.id === sectorId) {
          const nextStatus = s.irrigationStatus === 'active' ? 'idle' : 'active';
          const moistureBoost = nextStatus === 'active' ? Math.min(100, s.soilMoisture + 4) : s.soilMoisture;
          return { ...s, irrigationStatus: nextStatus, soilMoisture: moistureBoost };
        }
        return s;
      })
    );
  };

  const handleRefresh = () => {
    sound.playKeyTap();
    setIsRefreshing(true);
    setTimeout(() => {
      setSectors(prev =>
        prev.map(s => ({
          ...s,
          soilMoisture: Math.min(95, Math.max(25, s.soilMoisture + Math.floor((Math.random() - 0.5) * 4))),
          ambientTemp: Math.min(85, Math.max(50, s.ambientTemp + Math.floor((Math.random() - 0.5) * 2)))
        }))
      );
      setIsRefreshing(false);
    }, 600);
  };

  return (
    <div className="min-h-screen text-[#E4ECE6] flex flex-col">
      {/* Top Bar Contract: 3 zones */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0E1511]/90 backdrop-blur-md">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span className="text-base font-semibold tracking-tight text-white font-mono">
            Solum FarmOS
          </span>
        </div>

        {/* Zone 2: Clean navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-white/60">
          <button
            onClick={() => setActiveTab('overview')}
            className={`transition-colors pb-0.5 ${
              activeTab === 'overview'
                ? 'text-white border-b-2 border-emerald-400'
                : 'hover:text-white'
            }`}
          >
            Field Overview
          </button>
          <button
            onClick={() => setActiveTab('irrigation')}
            className={`transition-colors pb-0.5 ${
              activeTab === 'irrigation'
                ? 'text-white border-b-2 border-emerald-400'
                : 'hover:text-white'
            }`}
          >
            Irrigation Manifolds
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`transition-colors pb-0.5 ${
              activeTab === 'tasks'
                ? 'text-white border-b-2 border-emerald-400'
                : 'hover:text-white'
            }`}
          >
            Operator Workload
          </button>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-3">
          {onAddOperator && (
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/30 rounded-lg transition-colors whitespace-nowrap"
              title="Add another operator passcode"
            >
              <UserPlus className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">+ Add Passcode</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 text-white/60 hover:text-white rounded-lg hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400"
            title="Refresh Field Sensors"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
          </button>

          <button
            type="button"
            onClick={onLockTerminal}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-white bg-white/[0.08] hover:bg-white/[0.14] border border-white/10 rounded-lg transition-colors whitespace-nowrap"
          >
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Lock Terminal</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 space-y-6">
        {/* Operator Profile Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between p-6 rounded-2xl bg-[#141F17]/80 border border-white/10 backdrop-blur-md gap-4">
          <div className="flex items-start md:items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#233829] border border-emerald-500/30 flex items-center justify-center text-lg font-mono font-semibold text-emerald-300 shrink-0">
              {operator.avatarInitials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold text-white tracking-tight">
                  {operator.name}
                </h1>
                <span className="text-xs font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-500/20">
                  {operator.clearanceLevel}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-white/60 mt-1">
                <span>{operator.role}</span>
                <span aria-hidden="true">·</span>
                <span>Badge {operator.badgeId}</span>
                <span aria-hidden="true">·</span>
                <span>Shift {operator.activeShift}</span>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-300">{operator.sector}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-3 md:pt-0 border-t md:border-t-0 border-white/5">
            <div className="text-right hidden sm:block">
              <div className="text-[11px] font-mono text-white/40 uppercase">
                Active Station
              </div>
              <div className="text-sm font-medium text-white flex items-center gap-1.5 justify-end mt-0.5">
                <Compass className="w-3.5 h-3.5 text-emerald-400" />
                <span>Station 04 · North Parcel</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ambient Farm Metrics Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#141F17]/60 border border-white/10 backdrop-blur-sm">
            <div className="flex items-center justify-between text-xs text-white/50 mb-2">
              <span>Avg Soil Moisture</span>
              <Droplets className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-2xl font-mono font-semibold text-white tabular-nums">
              51%
            </div>
            <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
              <span>Nominal hydration range</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#141F17]/60 border border-white/10 backdrop-blur-sm">
            <div className="flex items-center justify-between text-xs text-white/50 mb-2">
              <span>Ambient Temp</span>
              <Thermometer className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-mono font-semibold text-white tabular-nums">
              64°F
            </div>
            <div className="text-xs text-white/50 mt-1">
              Dew point 52°F · Low 48°F
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#141F17]/60 border border-white/10 backdrop-blur-sm">
            <div className="flex items-center justify-between text-xs text-white/50 mb-2">
              <span>Solar Radiation</span>
              <Sun className="w-4 h-4 text-yellow-400" />
            </div>
            <div className="text-2xl font-mono font-semibold text-white tabular-nums">
              7.4 <span className="text-sm font-normal text-white/50">hrs</span>
            </div>
            <div className="text-xs text-emerald-400 mt-1">
              Photosynthetic active +12%
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#141F17]/60 border border-white/10 backdrop-blur-sm">
            <div className="flex items-center justify-between text-xs text-white/50 mb-2">
              <span>Wind Velocity</span>
              <Wind className="w-4 h-4 text-teal-400" />
            </div>
            <div className="text-2xl font-mono font-semibold text-white tabular-nums">
              6.2 <span className="text-sm font-normal text-white/50">mph</span>
            </div>
            <div className="text-xs text-white/50 mt-1">
              NW direction · Calm breeze
            </div>
          </div>
        </div>

        {/* Parcels and Tasks Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sectors Telemetry Table (Takes 2 cols) */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-[#141F17]/80 border border-white/10 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-white">
                  Agricultural Sectors & Parcels
                </h2>
                <p className="text-xs text-white/50 mt-0.5">
                  Real-time telemetry feeds from wireless in-soil probes.
                </p>
              </div>
              <span className="text-xs font-mono text-emerald-400">
                4 Active Zones
              </span>
            </div>

            <div className="space-y-3 pt-2">
              {sectors.length === 0 ? (
                <div className="py-12 text-center rounded-xl border border-dashed border-white/10 p-6 space-y-2">
                  <Sprout className="w-8 h-8 text-white/20 mx-auto" />
                  <p className="text-xs font-mono text-white/50">
                    No farm sectors or soil sensors currently configured in database.
                  </p>
                  <p className="text-[11px] text-white/30">
                    Connect your backend API or seed telemetry tables in your database.
                  </p>
                </div>
              ) : (
                sectors.map((sec) => (
                  <div
                    key={sec.id}
                    className="p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#1E2E22] flex items-center justify-center text-emerald-300">
                          <Sprout className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">
                            {sec.name}
                          </div>
                          <div className="text-xs text-white/50">
                            {sec.crop}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleToggleIrrigation(sec.id)}
                          className={`px-3 py-1 text-xs font-mono rounded-lg border transition-all ${
                            sec.irrigationStatus === 'active'
                              ? 'bg-sky-950/60 border-sky-400 text-sky-200'
                              : sec.irrigationStatus === 'scheduled'
                              ? 'bg-amber-950/40 border-amber-500/30 text-amber-200'
                              : 'bg-white/[0.03] border-white/10 text-white/40 hover:text-white/80'
                          }`}
                        >
                          {sec.irrigationStatus === 'active'
                            ? '● Valve Open (Flowing)'
                            : sec.irrigationStatus === 'scheduled'
                            ? '⏱ Scheduled 14:00'
                            : '○ Valve Idle'}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2 pt-2 border-t border-white/5 text-xs">
                      <div>
                        <span className="text-white/40 block text-[10px]">Soil Moisture</span>
                        <span className="font-mono font-medium text-white tabular-nums">
                          {sec.soilMoisture}%
                        </span>
                      </div>
                      <div>
                        <span className="text-white/40 block text-[10px]">Soil Temp</span>
                        <span className="font-mono font-medium text-white tabular-nums">
                          {sec.soilTemp}°F
                        </span>
                      </div>
                      <div>
                        <span className="text-white/40 block text-[10px]">Air Temp</span>
                        <span className="font-mono font-medium text-white tabular-nums">
                          {sec.ambientTemp}°F
                        </span>
                      </div>
                      <div>
                        <span className="text-white/40 block text-[10px]">Crop Health</span>
                        <span className="font-mono font-medium text-emerald-300 tabular-nums">
                          {sec.healthScore}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Assigned Workload / Tasks (1 col) */}
          <div className="p-6 rounded-2xl bg-[#141F17]/80 border border-white/10 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-white">
                  Active Shift Tasks
                </h2>
                <p className="text-xs text-white/50 mt-0.5">
                  Assigned to {operator.name}
                </p>
              </div>
              <span className="text-xs font-mono text-white/40">
                {tasks.filter(t => t.completed).length}/{tasks.length} Done
              </span>
            </div>

            <div className="space-y-2.5 pt-2">
              {tasks.length === 0 ? (
                <div className="py-8 text-center text-xs text-white/40 font-mono">
                  No active shift tasks logged in database for this operator.
                </div>
              ) : (
                tasks.map((task) => (
                  <button
                    key={task.id}
                    type="button"
                    onClick={() => handleToggleTask(task.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all duration-150 flex items-start gap-3 ${
                      task.completed
                        ? 'border-white/5 bg-white/[0.01] opacity-60'
                        : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-emerald-500/30'
                    }`}
                  >
                    <div className="mt-0.5 text-emerald-400 shrink-0">
                      {task.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Circle className="w-4 h-4 text-white/30" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p
                        className={`text-xs font-medium ${
                          task.completed ? 'line-through text-white/40' : 'text-white'
                        }`}
                      >
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-white/40 mt-1 font-mono">
                        <span>{task.time}</span>
                        <span aria-hidden="true">·</span>
                        <span>{task.location}</span>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>

            {/* Quick Farm Theme Switcher in Dashboard */}
            <div className="pt-4 border-t border-white/10">
              <span className="text-[11px] font-mono text-white/40 block mb-2">
                Atmosphere Backdrop
              </span>
              <div className="flex items-center gap-1.5 p-1 bg-black/40 rounded-lg">
                <button
                  type="button"
                  onClick={() => onChangeBgMode('mist')}
                  className={`flex-1 py-1 text-[11px] rounded transition-colors ${
                    bgMode === 'mist'
                      ? 'bg-emerald-900/60 text-emerald-200 font-medium'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  Morning Mist
                </button>
                <button
                  type="button"
                  onClick={() => onChangeBgMode('greenhouse')}
                  className={`flex-1 py-1 text-[11px] rounded transition-colors ${
                    bgMode === 'greenhouse'
                      ? 'bg-emerald-900/60 text-emerald-200 font-medium'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  Greenhouse
                </button>
                <button
                  type="button"
                  onClick={() => onChangeBgMode('solid')}
                  className={`flex-1 py-1 text-[11px] rounded transition-colors ${
                    bgMode === 'solid'
                      ? 'bg-emerald-900/60 text-emerald-200 font-medium'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  Minimal Solid
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Add Passcode Modal */}
      {onAddOperator && (
        <AddPasscodeModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSave={(newOp) => onAddOperator(newOp)}
          existingPasscodes={operators.map((o) => o.passcode)}
        />
      )}
    </div>
  );
};
