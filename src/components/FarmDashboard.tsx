import React, { useState, useEffect } from 'react';
import { 
  FarmOperator, 
  LivestockSector, 
  WeatherData, 
  IndividualAnimal, 
  AnimalPhysiologicalStatus, 
  MilkingRecord,
  EggCollectionRecord,
  DashboardDomain,
  IoTSensor,
  CropFieldSector
} from '../types/farm';
import { livestockDb } from '../services/livestockDb';
import { iotDb } from '../services/iotDb';
import { cropsDb } from '../services/cropsDb';
import { LeftSidebar, DashboardSectorTab } from './dashboard/LeftSidebar';
import { FarmOverviewView } from './dashboard/FarmOverviewView';
import { SectorDetailView } from './dashboard/SectorDetailView';
import { WeatherForecastSegment } from './dashboard/WeatherForecastSegment';
import { MilkingRecordsView } from './dashboard/MilkingRecordsView';
import { EggCollectionView } from './dashboard/EggCollectionView';
import { CropsDashboardView } from './dashboard/CropsDashboardView';
import { IoTSensorsView } from './dashboard/IoTSensorsView';
import { FarmSettingsView } from './dashboard/FarmSettingsView';
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
  Image as ImageIcon,
  Wheat,
  Radio,
  Settings
} from 'lucide-react';

interface FarmDashboardProps {
  operator: FarmOperator;
  operators?: FarmOperator[];
  onLockTerminal: () => void;
  onAddOperator?: (operator: FarmOperator) => void;
  onUpdateOperatorRole?: (
    operatorId: string, 
    role: string, 
    clearance: 'Field Tech' | 'Specialist' | 'Supervisor' | 'Farm Manager',
    sector?: string
  ) => void;
  onDeleteOperator?: (operatorId: string) => void;
  bgMode: 'mist' | 'greenhouse' | 'solid';
  onChangeBgMode: (mode: 'mist' | 'greenhouse' | 'solid') => void;
}

export const FarmDashboard: React.FC<FarmDashboardProps> = ({
  operator,
  operators = [],
  onLockTerminal,
  onAddOperator,
  onUpdateOperatorRole,
  onDeleteOperator,
  bgMode,
  onChangeBgMode
}) => {
  const { isDark } = useTheme();

  // Primary Domain Switcher: Animals vs Crops
  const [activeDomain, setActiveDomain] = useState<DashboardDomain>('animals');
  const [currentTab, setCurrentTab] = useState<DashboardSectorTab>('overview');

  // Database states
  const [sectors, setSectors] = useState<LivestockSector[]>([]);
  const [weather, setWeather] = useState<WeatherData>(livestockDb.getWeather());
  const [milkingRecords, setMilkingRecords] = useState<MilkingRecord[]>([]);
  const [eggRecords, setEggRecords] = useState<EggCollectionRecord[]>([]);
  const [cropSectors, setCropSectors] = useState<CropFieldSector[]>([]);
  const [sensors, setSensors] = useState<IoTSensor[]>([]);

  // UI state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Load database on mount
  useEffect(() => {
    setSectors(livestockDb.getSectors());
    setMilkingRecords(livestockDb.getMilkingRecords());
    setEggRecords(livestockDb.getEggRecords());
    setCropSectors(cropsDb.getCropSectors());
    setSensors(iotDb.getSensors());
  }, []);

  const handleRefresh = () => {
    sound.playKeyTap();
    setIsRefreshing(true);
    setTimeout(() => {
      setSectors([...livestockDb.getSectors()]);
      setMilkingRecords([...livestockDb.getMilkingRecords()]);
      setEggRecords([...livestockDb.getEggRecords()]);
      setCropSectors([...cropsDb.getCropSectors()]);
      setSensors([...iotDb.getSensors()]);
      setIsRefreshing(false);
    }, 400);
  };

  // Animal sector management (Admin capability)
  const handleAddSector = (newSector: LivestockSector) => {
    livestockDb.addSector(newSector, operator.name);
    setSectors(livestockDb.getSectors());
  };

  const handleDeleteSector = (sectorId: string) => {
    livestockDb.deleteSector(sectorId, operator.name);
    setSectors(livestockDb.getSectors());
    if (currentTab === sectorId) {
      setCurrentTab('overview');
    }
  };

  // Livestock Operations
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

  const handleUpdateAnimalPhoto = (sectorId: string, animalId: string, photoUrl: string) => {
    livestockDb.updateAnimalPhoto(sectorId, animalId, photoUrl, operator.name);
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

  // Egg Collection Operations
  const handleAddEggRecord = (record: EggCollectionRecord) => {
    livestockDb.addEggRecord(record, operator.name);
    setEggRecords(livestockDb.getEggRecords());
    setSectors(livestockDb.getSectors());
  };

  const handleDeleteEggRecord = (recordId: string) => {
    livestockDb.deleteEggRecord(recordId, operator.name);
    setEggRecords(livestockDb.getEggRecords());
    setSectors(livestockDb.getSectors());
  };

  // IoT Sensor Operations
  const handleAddSensor = (newSensor: IoTSensor) => {
    const updated = iotDb.addSensor(newSensor);
    setSensors(updated);
  };

  const handleDeleteSensor = (sensorId: string) => {
    const updated = iotDb.deleteSensor(sensorId);
    setSensors(updated);
  };

  // Crops Operations
  const handleUpdateIrrigation = (sectorId: string, status: 'idle' | 'active' | 'scheduled') => {
    const updated = cropsDb.updateIrrigationStatus(sectorId, status, operator.name);
    setCropSectors(updated);
  };

  const handleAddCropSector = (newCrop: CropFieldSector) => {
    const updated = cropsDb.addCropSector(newCrop);
    setCropSectors(updated);
  };

  // Find currently selected sector if tab matches an animal sector
  const activeSector = sectors.find(s => s.id === currentTab);

  return (
    <div className={`min-h-screen flex transition-colors duration-200 ${
      isDark ? 'bg-[#0C140F] text-[#E4ECE6]' : 'bg-[#F8FAF9] text-[#0F172A]'
    }`}>
      {/* Left-Side Navigation Bar with Dropdown Tabs & IoT & Settings */}
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
        activeDomain={activeDomain}
        onChangeDomain={(domain) => {
          sound.playKeyTap();
          setActiveDomain(domain);
        }}
      />

      {/* Main Content Area (offset by collapsed left rail on desktop) */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-20 transition-all duration-300">
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
              aria-label="Open navigation menu"
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
              {/* Domain Pill */}
              <button
                type="button"
                onClick={() => {
                  const next = activeDomain === 'animals' ? 'crops' : 'animals';
                  setActiveDomain(next);
                  setCurrentTab(next === 'crops' ? 'crops-overview' : 'overview');
                }}
                className={`hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border font-semibold text-[11px] transition-all cursor-pointer ${
                  activeDomain === 'animals'
                    ? isDark ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : isDark ? 'bg-amber-950/60 border-amber-500/30 text-amber-300' : 'bg-amber-50 border-amber-200 text-amber-800'
                }`}
                title="Click to toggle between Animals & Crops Dashboard"
              >
                {activeDomain === 'animals' ? '🐄 Animals Domain' : '🌾 Crops Domain'}
              </button>
              <span className={`hidden sm:inline ${isDark ? 'text-white/20' : 'text-slate-300'}`}>
                /
              </span>
              <span className={`font-semibold capitalize truncate max-w-[200px] sm:max-w-none ${
                isDark ? 'text-emerald-400' : 'text-emerald-800'
              }`}>
                {currentTab === 'overview' 
                  ? 'Animals Dashboard Overview' 
                  : currentTab === 'crops-overview'
                  ? 'Crops & Agronomy Dashboard'
                  : currentTab === 'iot'
                  ? 'IoT Remote Monitoring Sensors'
                  : currentTab === 'settings'
                  ? 'Farm Administration & Role Settings'
                  : currentTab === 'weather' 
                  ? 'Weather & Pastures' 
                  : currentTab === 'milking-records'
                  ? 'Dairy Milking Records & Harvest'
                  : currentTab === 'egg-collection'
                  ? 'Egg Collection & Laying Records (Chickens & Ducks)'
                  : activeSector?.name || currentTab}
              </span>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Domain Switcher Pill for mobile/tablet */}
            <div className={`flex md:hidden items-center border rounded-xl p-0.5 text-xs font-mono ${
              isDark ? 'bg-white/[0.04] border-white/10' : 'bg-slate-100 border-slate-200'
            }`}>
              <button
                type="button"
                onClick={() => {
                  setActiveDomain('animals');
                  if (currentTab === 'crops-overview') setCurrentTab('overview');
                }}
                className={`px-2 py-0.5 rounded-lg ${
                  activeDomain === 'animals'
                    ? isDark ? 'bg-emerald-950 text-emerald-300 font-bold' : 'bg-white text-emerald-800 font-bold shadow-xs'
                    : 'text-slate-400'
                }`}
              >
                🐄 Animals
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveDomain('crops');
                  setCurrentTab('crops-overview');
                }}
                className={`px-2 py-0.5 rounded-lg ${
                  activeDomain === 'crops'
                    ? isDark ? 'bg-amber-950 text-amber-300 font-bold' : 'bg-white text-amber-800 font-bold shadow-xs'
                    : 'text-slate-400'
                }`}
              >
                🌾 Crops
              </button>
            </div>

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
          {/* 1. Animals Dashboard Overview */}
          {currentTab === 'overview' && activeDomain === 'animals' && (
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

          {/* 2. Crops Dashboard Overview (When in Crops domain or on crops-overview tab) */}
          {(currentTab === 'crops-overview' || (currentTab === 'overview' && activeDomain === 'crops')) && (
            <CropsDashboardView
              cropSectors={cropSectors}
              operator={operator}
              onUpdateIrrigation={handleUpdateIrrigation}
              onAddCropSector={handleAddCropSector}
              onNavigateToIoT={() => {
                sound.playKeyTap();
                setCurrentTab('iot');
              }}
            />
          )}

          {/* 3. IoT Remote Sensors Monitoring Segment */}
          {currentTab === 'iot' && (
            <IoTSensorsView
              sensors={sensors}
              sectors={sectors}
              onAddSensor={handleAddSensor}
              onDeleteSensor={handleDeleteSensor}
              onRefreshTelemetry={handleRefresh}
            />
          )}

          {/* 4. Administration & Role Settings Tab (Admin & Farm Manager Only) */}
          {currentTab === 'settings' && (
            <FarmSettingsView
              currentOperator={operator}
              operators={operators}
              sectors={sectors}
              onAddSector={handleAddSector}
              onDeleteSector={handleDeleteSector}
              onUpdateOperatorRole={onUpdateOperatorRole || ((id, r, c, s) => {})}
              onAddOperator={onAddOperator || ((op) => {})}
              onDeleteOperator={onDeleteOperator || ((id) => {})}
            />
          )}

          {/* 5. Weather Forecast Segment */}
          {currentTab === 'weather' && (
            <div className="space-y-6">
              <WeatherForecastSegment weather={weather} />
            </div>
          )}

          {/* 6. Milking Records View */}
          {currentTab === 'milking-records' && (
            <MilkingRecordsView
              records={milkingRecords}
              sectors={sectors}
              operator={operator}
              onAddRecord={handleAddMilkingRecord}
              onDeleteRecord={handleDeleteMilkingRecord}
            />
          )}

          {/* 7. Egg Collection View (Chickens & Ducks) */}
          {currentTab === 'egg-collection' && (
            <EggCollectionView
              records={eggRecords}
              sectors={sectors}
              operator={operator}
              onAddRecord={handleAddEggRecord}
              onDeleteRecord={handleDeleteEggRecord}
            />
          )}

          {/* 8. Individual Animal Sector Detail View (e.g. cows-dairy, goats-dairy, or new custom sector) */}
          {activeSector && (
            <SectorDetailView
              sector={activeSector}
              operator={operator}
              onUpdateHeadCount={(delta) => handleUpdateHeadCount(activeSector.id, delta)}
              onLogActivity={(action) => handleLogActivity(activeSector.id, action)}
              onAddAnimal={(animal) => handleAddAnimal(activeSector.id, animal)}
              onUpdateAnimalStatus={(animalId, newStatus) => handleUpdateAnimalStatus(activeSector.id, animalId, newStatus)}
              onRemoveAnimal={(animalId, reason) => handleRemoveAnimal(activeSector.id, animalId, reason)}
              onUpdateAnimalPhoto={(animalId, photoUrl) => handleUpdateAnimalPhoto(activeSector.id, animalId, photoUrl)}
            />
          )}
        </main>
      </div>

      {/* Add Passcode Modal (from quick action if needed) */}
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
