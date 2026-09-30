import React, { useState } from 'react';
import { LivestockSector, WeatherData, FarmOperator, IndividualAnimal } from '../../types/farm';
import { WeatherForecastSegment } from './WeatherForecastSegment';
import { DashboardSectorTab } from './LeftSidebar';
import { OverviewDetailModal, OverviewModalType } from './OverviewDetailModal';
import { AddAnimalModal } from './AddAnimalModal';
import { useTheme } from '../../context/ThemeContext';
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
  Plus 
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
  const { isDark } = useTheme();
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
        return category === 'dairy' 
          ? <Milk className={`w-5 h-5 ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`} /> 
          : <Beef className={`w-5 h-5 ${isDark ? 'text-amber-400' : 'text-amber-700'}`} />;
      case 'goats':
        return category === 'dairy' 
          ? <Milk className={`w-5 h-5 ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`} /> 
          : <Beef className={`w-5 h-5 ${isDark ? 'text-amber-400' : 'text-amber-700'}`} />;
      case 'chicken':
        return <Egg className={`w-5 h-5 ${isDark ? 'text-amber-400' : 'text-amber-700'}`} />;
      case 'ducks':
        return <Waves className={`w-5 h-5 ${isDark ? 'text-sky-400' : 'text-sky-700'}`} />;
      case 'rabbits':
        return <Rabbit className={`w-5 h-5 ${isDark ? 'text-amber-400' : 'text-amber-700'}`} />;
      default:
        return <Activity className={`w-5 h-5 ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`} />;
    }
  };

  const handleOpenDetail = (type: OverviewModalType) => {
    sound.playKeyTap();
    setModalType(type);
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between p-6 rounded-3xl border backdrop-blur-xl gap-4 shadow-sm transition-colors ${
        isDark 
          ? 'bg-[#131E17]/90 border-white/10 text-white' 
          : 'bg-white border-slate-200 text-slate-900 shadow-xs'
      }`}>
        <div>
          <div className={`flex items-center gap-2 text-xs font-mono uppercase tracking-wider mb-1 font-semibold ${
            isDark ? 'text-emerald-400' : 'text-emerald-700'
          }`}>
            <ShieldCheck className="w-4 h-4" />
            <span>Farm Operations Hub · Active Shift</span>
          </div>
          <h1 className={`text-xl md:text-2xl font-bold tracking-tight ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            Welcome, {operator.name}
          </h1>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
            Click on any card to view detailed sector reports, livestock rosters, and telemetry breakdown.
          </p>
        </div>

        <div className={`flex items-center gap-3 font-mono text-xs border-t md:border-t-0 pt-3 md:pt-0 ${
          isDark ? 'text-white/50 border-white/5' : 'text-slate-500 border-slate-200'
        }`}>
          <div className="text-right">
            <span className={`text-[10px] uppercase block ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
              Role Clearance
            </span>
            <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>
              {operator.role}
            </span>
          </div>
          <span className={isDark ? 'text-white/20' : 'text-slate-300'}>/</span>
          <div className="text-right">
            <span className={`text-[10px] uppercase block ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
              Shift Window
            </span>
            <span className={`font-medium ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
              {operator.activeShift}
            </span>
          </div>
        </div>
      </div>

      {/* 4 Clickable High-Level Summary Stat Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Livestock Card */}
        <button
          type="button"
          onClick={() => handleOpenDetail('livestock')}
          className={`p-5 rounded-2xl border flex flex-col justify-between text-left transition-all duration-150 group active:scale-[0.98] cursor-pointer ${
            isDark
              ? 'bg-[#131E17]/80 hover:bg-[#18261D] border-white/10 hover:border-emerald-500/40 text-white shadow-sm'
              : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-emerald-400 text-slate-900 shadow-xs'
          }`}
        >
          <div className={`flex items-center justify-between text-xs w-full ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
            <span className={`font-mono uppercase tracking-wider transition-colors ${
              isDark ? 'group-hover:text-emerald-300' : 'group-hover:text-emerald-700 font-medium'
            }`}>
              Total Livestock
            </span>
            <Sprout className={`w-4 h-4 group-hover:scale-110 transition-transform ${
              isDark ? 'text-emerald-400' : 'text-emerald-600'
            }`} />
          </div>
          <div className="my-2.5">
            <span className={`font-mono text-3xl sm:text-4xl font-light tabular-nums ${
              isDark ? 'text-white' : 'text-slate-900 font-normal'
            }`}>
              {totalHeadCount.toLocaleString()}
            </span>
          </div>
          <div className={`text-[11px] font-mono flex items-center justify-between w-full ${
            isDark ? 'text-emerald-400/90' : 'text-emerald-700 font-medium'
          }`}>
            <span>7 Sectors Healthy</span>
            <span className={`text-[10px] underline ${
              isDark ? 'text-white/40 group-hover:text-emerald-300' : 'text-slate-400 group-hover:text-emerald-700'
            }`}>
              View Census →
            </span>
          </div>
        </button>

        {/* Dairy Division Card */}
        <button
          type="button"
          onClick={() => handleOpenDetail('dairy')}
          className={`p-5 rounded-2xl border flex flex-col justify-between text-left transition-all duration-150 group active:scale-[0.98] cursor-pointer ${
            isDark
              ? 'bg-[#131E17]/80 hover:bg-[#18261D] border-white/10 hover:border-emerald-500/40 text-white shadow-sm'
              : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-emerald-400 text-slate-900 shadow-xs'
          }`}
        >
          <div className={`flex items-center justify-between text-xs w-full ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
            <span className={`font-mono uppercase tracking-wider transition-colors ${
              isDark ? 'group-hover:text-emerald-300' : 'group-hover:text-emerald-700 font-medium'
            }`}>
              Dairy Animals
            </span>
            <Milk className={`w-4 h-4 group-hover:scale-110 transition-transform ${
              isDark ? 'text-emerald-400' : 'text-emerald-600'
            }`} />
          </div>
          <div className="my-2.5">
            <span className={`font-mono text-3xl sm:text-4xl font-light tabular-nums ${
              isDark ? 'text-white' : 'text-slate-900 font-normal'
            }`}>
              {dairyHeadCount}
            </span>
            <span className={`text-xs ml-1 ${isDark ? 'text-white/40' : 'text-slate-400'}`}>Head</span>
          </div>
          <div className={`text-[11px] font-mono flex items-center justify-between w-full ${
            isDark ? 'text-emerald-400/90' : 'text-emerald-700 font-medium'
          }`}>
            <span>2,825 L Daily Milk</span>
            <span className={`text-[10px] underline ${
              isDark ? 'text-white/40 group-hover:text-emerald-300' : 'text-slate-400 group-hover:text-emerald-700'
            }`}>
              Production →
            </span>
          </div>
        </button>

        {/* Meat Purpose Division Card */}
        <button
          type="button"
          onClick={() => handleOpenDetail('meat')}
          className={`p-5 rounded-2xl border flex flex-col justify-between text-left transition-all duration-150 group active:scale-[0.98] cursor-pointer ${
            isDark
              ? 'bg-[#131E17]/80 hover:bg-[#1E251E] border-white/10 hover:border-amber-500/40 text-white shadow-sm'
              : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-amber-400 text-slate-900 shadow-xs'
          }`}
        >
          <div className={`flex items-center justify-between text-xs w-full ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
            <span className={`font-mono uppercase tracking-wider transition-colors ${
              isDark ? 'group-hover:text-amber-300' : 'group-hover:text-amber-700 font-medium'
            }`}>
              Meat Animals
            </span>
            <Beef className={`w-4 h-4 group-hover:scale-110 transition-transform ${
              isDark ? 'text-amber-400' : 'text-amber-600'
            }`} />
          </div>
          <div className="my-2.5">
            <span className={`font-mono text-3xl sm:text-4xl font-light tabular-nums ${
              isDark ? 'text-white' : 'text-slate-900 font-normal'
            }`}>
              {meatHeadCount}
            </span>
            <span className={`text-xs ml-1 ${isDark ? 'text-white/40' : 'text-slate-400'}`}>Head</span>
          </div>
          <div className={`text-[11px] font-mono flex items-center justify-between w-full ${
            isDark ? 'text-amber-400/90' : 'text-amber-700 font-medium'
          }`}>
            <span>5 Species</span>
            <span className={`text-[10px] underline ${
              isDark ? 'text-white/40 group-hover:text-amber-300' : 'text-slate-400 group-hover:text-amber-700'
            }`}>
              Readiness →
            </span>
          </div>
        </button>

        {/* Feed & Water Reserves Card */}
        <button
          type="button"
          onClick={() => handleOpenDetail('resources')}
          className={`p-5 rounded-2xl border flex flex-col justify-between text-left transition-all duration-150 group active:scale-[0.98] cursor-pointer ${
            isDark
              ? 'bg-[#131E17]/80 hover:bg-[#172421] border-white/10 hover:border-sky-500/40 text-white shadow-sm'
              : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-sky-400 text-slate-900 shadow-xs'
          }`}
        >
          <div className={`flex items-center justify-between text-xs w-full ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
            <span className={`font-mono uppercase tracking-wider transition-colors ${
              isDark ? 'group-hover:text-sky-300' : 'group-hover:text-sky-700 font-medium'
            }`}>
              Feed & Water
            </span>
            <Droplets className={`w-4 h-4 group-hover:scale-110 transition-transform ${
              isDark ? 'text-sky-400' : 'text-sky-600'
            }`} />
          </div>
          <div className="my-2.5">
            <span className={`font-mono text-3xl sm:text-4xl font-light tabular-nums ${
              isDark ? 'text-white' : 'text-slate-900 font-normal'
            }`}>
              {totalWaterL.toLocaleString()}
            </span>
            <span className={`text-xs ml-1 ${isDark ? 'text-white/40' : 'text-slate-400'}`}>L/day</span>
          </div>
          <div className={`text-[11px] font-mono flex items-center justify-between w-full ${
            isDark ? 'text-sky-300' : 'text-sky-700 font-medium'
          }`}>
            <span>{totalFeedKg.toLocaleString()} kg reserves</span>
            <span className={`text-[10px] underline ${
              isDark ? 'text-white/40 group-hover:text-sky-300' : 'text-slate-400 group-hover:text-sky-700'
            }`}>
              Stockpiles →
            </span>
          </div>
        </button>
      </div>

      {/* Weather Forecast Segment */}
      <WeatherForecastSegment weather={weather} />

      {/* Dairy Sectors Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Dairy Production Division
            </h2>
            <p className={`text-xs ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
              Click any dairy card below to enter its workspace and view or register individual animals.
            </p>
          </div>
          <span className={`text-xs font-mono font-semibold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
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
              className={`p-5 rounded-2xl border transition-all duration-150 cursor-pointer group shadow-xs flex flex-col justify-between ${
                isDark 
                  ? 'bg-[#131E17]/80 border-white/10 hover:border-emerald-500/40 hover:bg-[#16251c] text-white' 
                  : 'bg-white border-slate-200 hover:border-emerald-400 hover:bg-slate-50/80 text-slate-900'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isDark ? 'bg-[#1E2E23]' : 'bg-emerald-50 border border-emerald-200'
                    }`}>
                      {getAnimalIcon(sector.animalType, sector.category)}
                    </div>
                    <div>
                      <h3 className={`text-sm font-semibold transition-colors ${
                        isDark ? 'text-white group-hover:text-emerald-300' : 'text-slate-900 group-hover:text-emerald-800'
                      }`}>
                        {sector.name}
                      </h3>
                      <p className={`text-xs ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
                        {sector.location}
                      </p>
                    </div>
                  </div>
                  <ArrowUpRight className={`w-4 h-4 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                    isDark ? 'text-white/30 group-hover:text-emerald-400' : 'text-slate-400 group-hover:text-emerald-700'
                  }`} />
                </div>

                <div className={`grid grid-cols-2 gap-2 mt-4 pt-4 border-t text-xs font-mono ${
                  isDark ? 'border-white/5' : 'border-slate-100'
                }`}>
                  <div>
                    <span className={`block text-[10px] ${isDark ? 'text-white/40' : 'text-slate-400'}`}>Head Count</span>
                    <span className={`text-lg font-normal ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {sector.headCount} Animals
                    </span>
                  </div>
                  <div>
                    <span className={`block text-[10px] ${isDark ? 'text-white/40' : 'text-slate-400'}`}>Output</span>
                    <span className={`text-lg font-semibold ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>
                      {sector.dailyOutput.metricValue}
                    </span>
                  </div>
                </div>
              </div>

              <div className={`mt-4 pt-3 border-t flex items-center justify-between text-[11px] font-mono ${
                isDark ? 'border-white/5 text-white/40' : 'border-slate-100 text-slate-500'
              }`}>
                <span>{sector.animals?.length || 0} in Roster · {sector.pastureOrPen}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      sound.playKeyTap();
                      setAddAnimalSector(sector);
                    }}
                    className={`px-2 py-1 rounded text-[10px] flex items-center gap-1 transition-colors font-medium border cursor-pointer ${
                      isDark
                        ? 'bg-emerald-950/60 hover:bg-emerald-900 border-emerald-500/30 text-emerald-300'
                        : 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-800'
                    }`}
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Animal</span>
                  </button>
                  <span className={`group-hover:underline ${
                    isDark ? 'text-emerald-400' : 'text-emerald-700 font-medium'
                  }`}>
                    Open Workspace →
                  </span>
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
            <h2 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Meat Animals Division
            </h2>
            <p className={`text-xs ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
              Click any meat sector below to enter its workspace, inspect market readiness, or add animals.
            </p>
          </div>
          <span className={`text-xs font-mono font-semibold ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>
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
              className={`p-5 rounded-2xl border transition-all duration-150 cursor-pointer group shadow-xs flex flex-col justify-between ${
                isDark 
                  ? 'bg-[#131E17]/80 border-white/10 hover:border-amber-500/40 hover:bg-[#1A251E] text-white' 
                  : 'bg-white border-slate-200 hover:border-amber-400 hover:bg-slate-50/80 text-slate-900'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isDark ? 'bg-[#1E2E23]' : 'bg-amber-50 border border-amber-200'
                    }`}>
                      {getAnimalIcon(sector.animalType, sector.category)}
                    </div>
                    <div>
                      <h3 className={`text-sm font-semibold transition-colors ${
                        isDark ? 'text-white group-hover:text-amber-300' : 'text-slate-900 group-hover:text-amber-800'
                      }`}>
                        {sector.name}
                      </h3>
                      <p className={`text-xs truncate max-w-[160px] ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
                        {sector.pastureOrPen}
                      </p>
                    </div>
                  </div>
                  <ArrowUpRight className={`w-4 h-4 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                    isDark ? 'text-white/30 group-hover:text-amber-400' : 'text-slate-400 group-hover:text-amber-700'
                  }`} />
                </div>

                <div className={`grid grid-cols-2 gap-2 mt-4 pt-4 border-t text-xs font-mono ${
                  isDark ? 'border-white/5' : 'border-slate-100'
                }`}>
                  <div>
                    <span className={`block text-[10px] ${isDark ? 'text-white/40' : 'text-slate-400'}`}>Head Count</span>
                    <span className={`text-base font-normal ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {sector.headCount} Head
                    </span>
                  </div>
                  <div>
                    <span className={`block text-[10px] truncate ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
                      {sector.dailyOutput.metricName}
                    </span>
                    <span className={`text-base font-semibold truncate block ${
                      isDark ? 'text-amber-300' : 'text-amber-700'
                    }`}>
                      {sector.dailyOutput.metricValue}
                    </span>
                  </div>
                </div>
              </div>

              <div className={`mt-4 pt-3 border-t flex items-center justify-between text-[11px] font-mono ${
                isDark ? 'border-white/5 text-white/40' : 'border-slate-100 text-slate-500'
              }`}>
                <span className="truncate max-w-[120px]">{sector.animals?.length || 0} in Roster</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      sound.playKeyTap();
                      setAddAnimalSector(sector);
                    }}
                    className={`px-2 py-1 rounded text-[10px] flex items-center gap-1 transition-colors font-medium border cursor-pointer ${
                      isDark
                        ? 'bg-amber-950/60 hover:bg-amber-900 border-amber-500/30 text-amber-300'
                        : 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-800'
                    }`}
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Animal</span>
                  </button>
                  <span className={`group-hover:underline ${
                    isDark ? 'text-amber-400' : 'text-amber-700 font-medium'
                  }`}>
                    Open →
                  </span>
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
