import React, { useState, useEffect } from 'react';
import { FarmOperator, LivestockSector, WeatherData, IndividualAnimal, AnimalPhysiologicalStatus, MilkingRecord } from '../types/farm';
import { livestockDb } from '../services/livestockDb';
import { LeftSidebar, DashboardSectorTab } from './dashboard/LeftSidebar';
import { FarmOverviewView } from './dashboard/FarmOverviewView';
import { SectorDetailView } from './dashboard/SectorDetailView';
import { WeatherForecastSegment } from './dashboard/WeatherForecastSegment';
import { MilkingRecordsView } from './dashboard/MilkingRecordsView';
import { AddPasscodeModal } from './AddPasscodeModal';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from '../context/ThemeContext';
import { sound } from '../utils/audio';
import { 
  Menu, 
  Lock, 
  RefreshCw, 
  UserPlus, 
  Bell, 
  Sprout,
  Image as ImageIcon
} from 'lucide-react';

interface FarmDashboardProps {
  operator: FarmOperator;
  operators?: FarmOperator[];
  onLockTerminal: () => void;
  onAddOperator?: (operator: FarmOperator) => void;
  bgMode: 'mist' | 'greenhouse' | 'solid';
  onChangeBgMode: (mode: 'mist' | 'greenhouse' | 'solid') => void;
}

export const FarmDashboard: React.FC<FarmDashboardProps> = ({
  operator,
  operators = [],
  onLockTerminal,
  onAddOperator,
  bgMode,
  onChangeBgMode
}) => {
  const { isDark } = useTheme();
  const [currentTab, setCurrentTab] = useState<DashboardSectorTab>('overview');
  const [sectors, setSectors] = useState<LivestockSector[]>([]);
  const [weather, setWeather] = useState<WeatherData>(livestockDb.getWeather());
  const [milkingRecords, setMilkingRecords] = useState<MilkingRecord[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Load livestock sectors and milking records
  useEffect(() => {
    const loaded = livestockDb.getSectors();
    setSectors(loaded);
    setMilkingRecords(livestockDb.getMilkingRecords());
  }, []);

  const handleRefresh = () => {
    sound.playKeyTap();
    setIsRefreshing(true);
    setTimeout(() => {
      const reloaded = livestockDb.getSectors();
      setSectors([...reloaded]);
      setMilkingRecords([...livestockDb.getMilkingRecords()]);
      setIsRefreshing(false);
    }, 400);
  };

  const handleUpdateHeadCount = (sectorId: string, delta: number) => {
    livestockDb.updateHeadCount(sectorId, delta);
    setSectors(livestockDb.getSectors());
  };

  const handleLogActivity = (sectorId: string, action: string) => {
    livestockDb.logActivity(sectorId, action, operator.name);
    setSectors(livestockDb.getSectors());
  };

  const handleAddAnimal = (sectorId: string, animal: IndividualAnimal) => {
    livestockDb.addAnimal(sectorId, animal, operator.name);
    setSectors(livestockDb.getSectors());
  };

  const handleUpdateAnimalStatus = (
    sectorId: string, 
    animalId: string, 
    newStatus: AnimalPhysiologicalStatus
  ) => {
    livestockDb.updateAnimalStatus(sectorId, animalId, newStatus, operator.name);
    setSectors(livestockDb.getSectors());
  };

  const handleRemoveAnimal = (sectorId: string, animalId: string, reason: string) => {
    livestockDb.removeAnimal(sectorId, animalId, reason, operator.name);
    setSectors(livestockDb.getSectors());
  };

  const handleAddMilkingRecord = (record: MilkingRecord) => {
    livestockDb.addMilkingRecord(record, operator.name);
    setMilkingRecords(livestockDb.getMilkingRecords());
    setSectors(livestockDb.getSectors());
  };

  const handleDeleteMilkingRecord = (recordId: string) => {
    livestockDb.deleteMilkingRecord(recordId, operator.name);
    setMilkingRecords(livestockDb.getMilkingRecords());
    setSectors(livestockDb.getSectors());
  };

  // Find currently selected sector if tab matches an animal sector
  const activeSector = sectors.find(s => s.id === currentTab);

  return (
    <div className={`min-h-screen flex transition-colors duration-200 ${
      isDark ? 'bg-[#0C140F] text-[#E4ECE6]' : 'bg-[#F8FAF9] text-[#0F172A]'
    }`}>
      {/* Left-Side Navigation Bar */}
      <LeftSidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          sound.playKeyTap();
          setCurrentTab(tab);
        }}
        sectors={sectors}
        operator={operator}
        onLockTerminal={onLockTerminal}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area (offset by left sidebar on desktop) */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        {/* Top Header Bar */}
        <header className={`sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 py-3.5 border-b backdrop-blur-md transition-colors ${
          isDark 
            ? 'border-white/10 bg-[#0E1611]/90 text-white' 
            : 'border-slate-200 bg-white/90 text-slate-900 shadow-2xs'
        }`}>
          {/* Left: Mobile hamburger & breadcrumbs */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className={`p-2 -ml-1 rounded-xl lg:hidden border transition-colors ${
                isDark 
                  ? 'text-white/70 hover:text-white bg-white/[0.04] border-white/10' 
                  : 'text-slate-600 hover:text-slate-900 bg-slate-100 border-slate-200'
              }`}
              aria-label="Open sectors menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-mono">
              <span className={`hidden sm:inline ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
                Solum FarmOS
              </span>
              <span className={`hidden sm:inline ${isDark ? 'text-white/20' : 'text-slate-300'}`}>
                /
              </span>
              <span className={`font-semibold capitalize ${
                isDark ? 'text-emerald-400' : 'text-emerald-800'
              }`}>
                {currentTab === 'overview' 
                  ? 'Dashboard Overview' 
                  : currentTab === 'weather' 
                  ? 'Weather & Pastures' 
                  : currentTab === 'milking-records'
                  ? 'Dairy Milking Records & Harvest'
                  : activeSector?.name || currentTab}
              </span>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme switcher toggle button */}
            <ThemeToggle variant="icon" />

            {/* Background switcher */}
            <div className={`hidden md:flex items-center border rounded-xl p-0.5 text-[11px] font-mono ${
              isDark ? 'bg-white/[0.04] border-white/10' : 'bg-slate-100 border-slate-200'
            }`}>
              <button
                type="button"
                onClick={() => onChangeBgMode('mist')}
                className={`px-2 py-0.5 rounded-lg transition-colors ${
                  bgMode === 'mist' 
                    ? isDark 
                      ? 'bg-emerald-950/80 text-emerald-300 font-medium' 
                      : 'bg-white text-emerald-800 font-semibold shadow-xs border border-slate-200'
                    : isDark 
                      ? 'text-white/40 hover:text-white' 
                      : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Mist
              </button>
              <button
                type="button"
                onClick={() => onChangeBgMode('greenhouse')}
                className={`px-2 py-0.5 rounded-lg transition-colors ${
                  bgMode === 'greenhouse' 
                    ? isDark 
                      ? 'bg-emerald-950/80 text-emerald-300 font-medium' 
                      : 'bg-white text-emerald-800 font-semibold shadow-xs border border-slate-200'
                    : isDark 
                      ? 'text-white/40 hover:text-white' 
                      : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Glass
              </button>
              <button
                type="button"
                onClick={() => onChangeBgMode('solid')}
                className={`px-2 py-0.5 rounded-lg transition-colors ${
                  bgMode === 'solid' 
                    ? isDark 
                      ? 'bg-emerald-950/80 text-emerald-300 font-medium' 
                      : 'bg-white text-emerald-800 font-semibold shadow-xs border border-slate-200'
                    : isDark 
                      ? 'text-white/40 hover:text-white' 
                      : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Solid
              </button>
            </div>

            {/* Add operator passcode */}
            {onAddOperator && (
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                  isDark
                    ? 'text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/60 border-emerald-500/30'
                    : 'text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border-emerald-300 shadow-2xs'
                }`}
                title="Add another operator passcode"
              >
                <UserPlus className={`w-3.5 h-3.5 ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`} />
                <span className="hidden sm:inline">+ Passcode</span>
              </button>
            )}

            {/* Refresh */}
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isDark 
                  ? 'text-white/60 hover:text-white hover:bg-white/5 border-white/10' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200 bg-slate-100 border-slate-200 shadow-2xs'
              }`}
              title="Refresh Telemetry"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-500' : ''}`} />
            </button>

            {/* Lock terminal */}
            <button
              type="button"
              onClick={onLockTerminal}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border transition-all cursor-pointer ${
                isDark 
                  ? 'text-white bg-white/[0.08] hover:bg-white/[0.14] border-white/10' 
                  : 'text-slate-700 bg-slate-100 hover:bg-slate-200 border-slate-200 shadow-2xs'
              }`}
            >
              <Lock className={`w-3.5 h-3.5 ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`} />
              <span className="hidden sm:inline">Lock</span>
            </button>
          </div>
        </header>

        {/* Dashboard Dynamic View Body */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'overview' && (
            <FarmOverviewView
              sectors={sectors}
              weather={weather}
              operator={operator}
              onNavigateSector={(tab) => {
                sound.playKeyTap();
                setCurrentTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onAddAnimal={handleAddAnimal}
            />
          )}

          {currentTab === 'weather' && (
            <div className="space-y-6">
              <WeatherForecastSegment weather={weather} />
            </div>
          )}

          {currentTab === 'milking-records' && (
            <MilkingRecordsView
              records={milkingRecords}
              sectors={sectors}
              operator={operator}
              onAddRecord={handleAddMilkingRecord}
              onDeleteRecord={handleDeleteMilkingRecord}
            />
          )}

          {activeSector && (
            <SectorDetailView
              sector={activeSector}
              operator={operator}
              onUpdateHeadCount={(delta) => handleUpdateHeadCount(activeSector.id, delta)}
              onLogActivity={(action) => handleLogActivity(activeSector.id, action)}
              onAddAnimal={(animal) => handleAddAnimal(activeSector.id, animal)}
              onUpdateAnimalStatus={(animalId, newStatus) => handleUpdateAnimalStatus(activeSector.id, animalId, newStatus)}
              onRemoveAnimal={(animalId, reason) => handleRemoveAnimal(activeSector.id, animalId, reason)}
            />
          )}
        </main>
      </div>

      {/* Add Passcode Modal (from Dashboard view) */}
      <AddPasscodeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={(newOp) => {
          if (onAddOperator) {
            onAddOperator(newOp);
          }
        }}
        existingPasscodes={operators.map((o) => o.passcode)}
      />
    </div>
  );
};
