import React, { useState } from 'react';
import { LivestockSector, WeatherData, FarmOperator, IndividualAnimal } from '../../types/farm';
import { WeatherForecastSegment } from './WeatherForecastSegment';
import { DashboardSectorTab } from './LeftSidebar';
import { OverviewDetailModal, OverviewModalType } from './OverviewDetailModal';
import { AddAnimalModal } from './AddAnimalModal';
import { 
  Milk, 
  Beef, 
  Egg, 
  Waves, 
  Rabbit, 
  Droplets, 
  Wheat, 
  ArrowUpRight, 
  Sprout, 
  Activity, 
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Plus,
  Info
} from 'lucide-react';
import { sound } from '../../utils/audio';

interface FarmOverviewViewProps {
  sectors: LivestockSector[];
  weather: WeatherData;
  operator: FarmOperator;
  onNavigateSector: (tab: DashboardSectorTab) => void;
  onAddAnimal?: (sectorId: string, animal: IndividualAnimal) => void;
}

export const FarmOverviewView: React.FC<FarmOverviewViewProps> = ({
  sectors,
  weather,
  operator,
  onNavigateSector,
  onAddAnimal
}) => {
  const [modalType, setModalType] = useState<OverviewModalType>(null);
  const [addAnimalSector, setAddAnimalSector] = useState<LivestockSector | null>(null);

  const totalHeadCount = sectors.reduce((sum, s) => sum + s.headCount, 0);
  const dairySectors = sectors.filter(s => s.category === 'dairy');
  const meatSectors = sectors.filter(s => s.category === 'meat');

  const dairyHeadCount = dairySectors.reduce((sum, s) => sum + s.headCount, 0);
  const meatHeadCount = meatSectors.reduce((sum, s) => sum + s.headCount, 0);

  const totalFeedKg = sectors.reduce((sum, s) => sum + s.feedInventoryKg, 0);
  const totalWaterL = sectors.reduce((sum, s) => sum + s.waterConsumptionL, 0);

  const getAnimalIcon = (animalType: string, category: string) => {
    switch (animalType) {
      case 'cows':
        return category === 'dairy' ? <Milk className="w-5 h-5 text-emerald-400" /> : <Beef className="w-5 h-5 text-amber-400" />;
      case 'goats':
        return category === 'dairy' ? <Milk className="w-5 h-5 text-emerald-400" /> : <Beef className="w-5 h-5 text-amber-400" />;
      case 'chicken':
        return <Egg className="w-5 h-5 text-amber-400" />;
      case 'ducks':
        return <Waves className="w-5 h-5 text-sky-400" />;
      case 'rabbits':
        return <Rabbit className="w-5 h-5 text-amber-400" />;
      default:
        return <Activity className="w-5 h-5 text-emerald-400" />;
    }
  };

  const handleOpenDetail = (type: OverviewModalType) => {
    sound.playKeyTap();
    setModalType(type);
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between p-6 rounded-3xl bg-[#131E17]/90 border border-white/10 backdrop-blur-xl shadow-xl gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Farm Operations Hub · Active Shift</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Welcome, {operator.name}
          </h1>
          <p className="text-xs text-white/60 mt-0.5">
            Click on any card to view detailed sector reports, livestock rosters, and telemetry breakdown.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs text-white/50 border-t md:border-t-0 pt-3 md:pt-0 border-white/5">
          <div className="text-right">
            <span className="text-[10px] uppercase text-white/40 block">Role Clearance</span>
            <span className="text-white font-medium">{operator.role}</span>
          </div>
          <span className="text-white/20">/</span>
          <div className="text-right">
            <span className="text-[10px] uppercase text-white/40 block">Shift Window</span>
            <span className="text-emerald-400 font-medium">{operator.activeShift}</span>
          </div>
        </div>
      </div>

      {/* 4 Clickable High-Level Summary Stat Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Livestock Card */}
        <button
          type="button"
          onClick={() => handleOpenDetail('livestock')}
          className="p-5 rounded-2xl bg-[#131E17]/80 hover:bg-[#18261D] border border-white/10 hover:border-emerald-500/40 backdrop-blur-sm flex flex-col justify-between text-left transition-all duration-150 group shadow-sm active:scale-[0.98] cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs text-white/50 w-full">
            <span className="font-mono uppercase tracking-wider group-hover:text-emerald-300 transition-colors">
              Total Livestock
            </span>
            <Sprout className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="my-2.5">
            <span className="font-mono text-3xl sm:text-4xl font-light text-white tabular-nums">
              {totalHeadCount.toLocaleString()}
            </span>
          </div>
          <div className="text-[11px] text-emerald-400/90 font-mono flex items-center justify-between w-full">
            <span>7 Sectors Healthy</span>
            <span className="text-[10px] text-white/40 group-hover:text-emerald-300 underline">View Census →</span>
          </div>
        </button>

        {/* Dairy Division Card */}
        <button
          type="button"
          onClick={() => handleOpenDetail('dairy')}
          className="p-5 rounded-2xl bg-[#131E17]/80 hover:bg-[#18261D] border border-white/10 hover:border-emerald-500/40 backdrop-blur-sm flex flex-col justify-between text-left transition-all duration-150 group shadow-sm active:scale-[0.98] cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs text-white/50 w-full">
            <span className="font-mono uppercase tracking-wider group-hover:text-emerald-300 transition-colors">
              Dairy Animals
            </span>
            <Milk className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="my-2.5">
            <span className="font-mono text-3xl sm:text-4xl font-light text-white tabular-nums">
              {dairyHeadCount}
            </span>
            <span className="text-xs text-white/40 ml-1">Head</span>
          </div>
          <div className="text-[11px] text-emerald-400/90 font-mono flex items-center justify-between w-full">
            <span>2,825 L Daily Milk</span>
            <span className="text-[10px] text-white/40 group-hover:text-emerald-300 underline">Production →</span>
          </div>
        </button>

        {/* Meat Purpose Division Card */}
        <button
          type="button"
          onClick={() => handleOpenDetail('meat')}
          className="p-5 rounded-2xl bg-[#131E17]/80 hover:bg-[#1E251E] border border-white/10 hover:border-amber-500/40 backdrop-blur-sm flex flex-col justify-between text-left transition-all duration-150 group shadow-sm active:scale-[0.98] cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs text-white/50 w-full">
            <span className="font-mono uppercase tracking-wider group-hover:text-amber-300 transition-colors">
              Meat Animals
            </span>
            <Beef className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="my-2.5">
            <span className="font-mono text-3xl sm:text-4xl font-light text-white tabular-nums">
              {meatHeadCount}
            </span>
            <span className="text-xs text-white/40 ml-1">Head</span>
          </div>
          <div className="text-[11px] text-amber-400/90 font-mono flex items-center justify-between w-full">
            <span>5 Species</span>
            <span className="text-[10px] text-white/40 group-hover:text-amber-300 underline">Readiness →</span>
          </div>
        </button>

        {/* Feed & Water Reserves Card */}
        <button
          type="button"
          onClick={() => handleOpenDetail('resources')}
          className="p-5 rounded-2xl bg-[#131E17]/80 hover:bg-[#172421] border border-white/10 hover:border-sky-500/40 backdrop-blur-sm flex flex-col justify-between text-left transition-all duration-150 group shadow-sm active:scale-[0.98] cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs text-white/50 w-full">
            <span className="font-mono uppercase tracking-wider group-hover:text-sky-300 transition-colors">
              Feed & Water
            </span>
            <Droplets className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="my-2.5">
            <span className="font-mono text-3xl sm:text-4xl font-light text-white tabular-nums">
              {totalWaterL.toLocaleString()}
            </span>
            <span className="text-xs text-white/40 ml-1">L/day</span>
          </div>
          <div className="text-[11px] text-sky-300 font-mono flex items-center justify-between w-full">
            <span>{totalFeedKg.toLocaleString()} kg reserves</span>
            <span className="text-[10px] text-white/40 group-hover:text-sky-300 underline">Stockpiles →</span>
          </div>
        </button>
      </div>

      {/* Weather Forecast Segment */}
      <WeatherForecastSegment weather={weather} />

      {/* Dairy Sectors Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-white">
              Dairy Production Division
            </h2>
            <p className="text-xs text-white/50">
              Click any dairy card below to enter its workspace and view or register individual animals.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400">
            2 Dairy Sectors
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dairySectors.map((sector) => (
            <div
              key={sector.id}
              onClick={() => {
                sound.playKeyTap();
                onNavigateSector(sector.id as DashboardSectorTab);
              }}
              className="p-5 rounded-2xl bg-[#131E17]/80 border border-white/10 hover:border-emerald-500/40 hover:bg-[#16251c] transition-all duration-150 cursor-pointer group shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#1E2E23] flex items-center justify-center">
                      {getAnimalIcon(sector.animalType, sector.category)}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors">
                        {sector.name}
                      </h3>
                      <p className="text-xs text-white/50">
                        {sector.location}
                      </p>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-white/30 group-hover:text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-white/5 text-xs font-mono">
                  <div>
                    <span className="text-white/40 block text-[10px]">Head Count</span>
                    <span className="text-lg font-light text-white">{sector.headCount} Animals</span>
                  </div>
                  <div>
                    <span className="text-white/40 block text-[10px]">Output</span>
                    <span className="text-lg font-light text-emerald-300">{sector.dailyOutput.metricValue}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-white/40">
                <span>{sector.animals?.length || 0} in Roster · {sector.pastureOrPen}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      sound.playKeyTap();
                      setAddAnimalSector(sector);
                    }}
                    className="px-2 py-1 rounded bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/30 text-emerald-300 text-[10px] flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Animal</span>
                  </button>
                  <span className="text-emerald-400 group-hover:underline">Open Workspace →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Meat Purpose Sectors Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-white">
              Meat Animals Division
            </h2>
            <p className="text-xs text-white/50">
              Click any meat sector below to enter its workspace, inspect market readiness, or add animals.
            </p>
          </div>
          <span className="text-xs font-mono text-amber-400">
            5 Meat Sectors
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {meatSectors.map((sector) => (
            <div
              key={sector.id}
              onClick={() => {
                sound.playKeyTap();
                onNavigateSector(sector.id as DashboardSectorTab);
              }}
              className="p-5 rounded-2xl bg-[#131E17]/80 border border-white/10 hover:border-amber-500/40 hover:bg-[#1A251E] transition-all duration-150 cursor-pointer group shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#1E2E23] flex items-center justify-center">
                      {getAnimalIcon(sector.animalType, sector.category)}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors">
                        {sector.name}
                      </h3>
                      <p className="text-xs text-white/50 truncate max-w-[160px]">
                        {sector.pastureOrPen}
                      </p>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-white/30 group-hover:text-amber-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-white/5 text-xs font-mono">
                  <div>
                    <span className="text-white/40 block text-[10px]">Head Count</span>
                    <span className="text-base font-light text-white">{sector.headCount} Head</span>
                  </div>
                  <div>
                    <span className="text-white/40 block text-[10px] truncate">{sector.dailyOutput.metricName}</span>
                    <span className="text-base font-light text-amber-300 truncate block">{sector.dailyOutput.metricValue}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-white/40">
                <span className="truncate max-w-[120px]">{sector.animals?.length || 0} in Roster</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      sound.playKeyTap();
                      setAddAnimalSector(sector);
                    }}
                    className="px-2 py-1 rounded bg-amber-950/60 hover:bg-amber-900 border border-amber-500/30 text-amber-300 text-[10px] flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Animal</span>
                  </button>
                  <span className="text-amber-400 group-hover:underline">Open →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Overview Detail Modal when stat cards are clicked */}
      <OverviewDetailModal
        type={modalType}
        onClose={() => setModalType(null)}
        sectors={sectors}
        onNavigateSector={onNavigateSector}
      />

      {/* Quick Add Animal Modal when "+ Add Animal" is clicked from any sector card */}
      {addAnimalSector && onAddAnimal && (
        <AddAnimalModal
          isOpen={true}
          sector={addAnimalSector}
          onClose={() => setAddAnimalSector(null)}
          onSave={(animal) => {
            onAddAnimal(addAnimalSector.id, animal);
            setAddAnimalSector(null);
          }}
        />
      )}
    </div>
  );
};
