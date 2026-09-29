import React, { useState, useEffect } from 'react';
import { FarmOperator, LivestockSector, WeatherData, IndividualAnimal, AnimalPhysiologicalStatus, MilkingRecord } from '../types/farm';
import { livestockDb } from '../services/livestockDb';
import { LeftSidebar, DashboardSectorTab } from './dashboard/LeftSidebar';
import { FarmOverviewView } from './dashboard/FarmOverviewView';
import { SectorDetailView } from './dashboard/SectorDetailView';
import { WeatherForecastSegment } from './dashboard/WeatherForecastSegment';
import { MilkingRecordsView } from './dashboard/MilkingRecordsView';
import { AddPasscodeModal } from './AddPasscodeModal';
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
    <div className="min-h-screen bg-[#0C140F] text-[#E4ECE6] flex">
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
        <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-white/10 bg-[#0E1611]/90 backdrop-blur-md">
          {/* Left: Mobile hamburger & breadcrumbs */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-1 text-white/70 hover:text-white rounded-xl bg-white/[0.04] border border-white/10 lg:hidden"
              aria-label="Open sectors menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-white/40 hidden sm:inline">Solum FarmOS</span>
              <span className="text-white/20 hidden sm:inline">/</span>
              <span className="text-emerald-400 font-medium capitalize">
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
            {/* Background switcher */}
            <div className="hidden md:flex items-center bg-white/[0.04] border border-white/10 rounded-xl p-0.5 text-[11px] font-mono">
              <button
                type="button"
                onClick={() => onChangeBgMode('mist')}
                className={`px-2 py-0.5 rounded-lg transition-colors ${
                  bgMode === 'mist' ? 'bg-emerald-950/80 text-emerald-300 font-medium' : 'text-white/40 hover:text-white'
                }`}
              >
                Mist
              </button>
              <button
                type="button"
                onClick={() => onChangeBgMode('greenhouse')}
                className={`px-2 py-0.5 rounded-lg transition-colors ${
                  bgMode === 'greenhouse' ? 'bg-emerald-950/80 text-emerald-300 font-medium' : 'text-white/40 hover:text-white'
                }`}
              >
                Glass
              </button>
              <button
                type="button"
                onClick={() => onChangeBgMode('solid')}
                className={`px-2 py-0.5 rounded-lg transition-colors ${
                  bgMode === 'solid' ? 'bg-emerald-950/80 text-emerald-300 font-medium' : 'text-white/40 hover:text-white'
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
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/30 rounded-xl transition-all"
                title="Add another operator passcode"
              >
                <UserPlus className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">+ Passcode</span>
              </button>
            )}

            {/* Refresh */}
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 text-white/60 hover:text-white rounded-xl hover:bg-white/5 border border-white/10 transition-colors"
              title="Refresh Telemetry"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
            </button>

            {/* Lock terminal */}
            <button
              type="button"
              onClick={onLockTerminal}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-white/[0.08] hover:bg-white/[0.14] border border-white/10 rounded-xl transition-all"
            >
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
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
              }}
              onAddAnimal={(sectorId, animal) => handleAddAnimal(sectorId, animal)}
            />
          )}

          {currentTab === 'weather' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-[#131E17]/90 border border-white/10">
                <h1 className="text-xl font-bold text-white">
                  Farm Weather & Microclimate Station
                </h1>
                <p className="text-xs text-white/50 mt-1">
                  High-precision field atmospheric data, barometric trends, and livestock grazing safety ratings.
                </p>
              </div>
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
              onAddMilkingRecord={handleAddMilkingRecord}
              allSectors={sectors}
            />
          )}
        </main>
      </div>

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
