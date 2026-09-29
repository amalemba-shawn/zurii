import React from 'react';
import { LivestockSector, WeatherData } from '../../types/farm';
import { DashboardSectorTab } from './LeftSidebar';
import { 
  X, 
  Sprout, 
  Milk, 
  Beef, 
  Droplets, 
  Wheat, 
  ArrowRight, 
  CheckCircle2, 
  Activity,
  Layers
} from 'lucide-react';
import { sound } from '../../utils/audio';

export type OverviewModalType = 'livestock' | 'dairy' | 'meat' | 'resources' | null;

interface OverviewDetailModalProps {
  type: OverviewModalType;
  onClose: () => void;
  sectors: LivestockSector[];
  onNavigateSector: (tab: DashboardSectorTab) => void;
}

export const OverviewDetailModal: React.FC<OverviewDetailModalProps> = ({
  type,
  onClose,
  sectors,
  onNavigateSector
}) => {
  if (!type) return null;

  const totalHeadCount = sectors.reduce((sum, s) => sum + s.headCount, 0);
  const dairySectors = sectors.filter(s => s.category === 'dairy');
  const meatSectors = sectors.filter(s => s.category === 'meat');

  const dairyHeadCount = dairySectors.reduce((sum, s) => sum + s.headCount, 0);
  const meatHeadCount = meatSectors.reduce((sum, s) => sum + s.headCount, 0);

  const totalFeedKg = sectors.reduce((sum, s) => sum + s.feedInventoryKg, 0);
  const totalWaterL = sectors.reduce((sum, s) => sum + s.waterConsumptionL, 0);

  const handleSectorJump = (sectorId: string) => {
    sound.playKeyTap();
    onNavigateSector(sectorId as DashboardSectorTab);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#131E17] border border-white/10 rounded-3xl shadow-2xl p-6 sm:p-7 text-white space-y-5 my-6 max-h-[92vh] overflow-y-auto">
        {/* Modal Header based on Type */}
        <div className="flex items-start justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#1F3325] border border-emerald-500/30 text-emerald-400">
              {type === 'livestock' && <Sprout className="w-5 h-5" />}
              {type === 'dairy' && <Milk className="w-5 h-5 text-emerald-300" />}
              {type === 'meat' && <Beef className="w-5 h-5 text-amber-300" />}
              {type === 'resources' && <Droplets className="w-5 h-5 text-sky-300" />}
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                {type === 'livestock' && 'Livestock Census & Sector Breakdown'}
                {type === 'dairy' && 'Dairy Herd Operations & Milk Production'}
                {type === 'meat' && 'Meat Herd & Flock Market Readiness'}
                {type === 'resources' && 'Feed Stockpile & Hydration Telemetry'}
              </h2>
              <p className="text-xs text-white/50 mt-0.5">
                {type === 'livestock' && `${totalHeadCount} total animals managed across 7 agricultural sectors.`}
                {type === 'dairy' && `${dairyHeadCount} lactating dairy animals yielding 2,825 Liters daily.`}
                {type === 'meat' && `${meatHeadCount} head across cattle, goats, broilers, waterfowl & rabbits.`}
                {type === 'resources' && `${totalFeedKg.toLocaleString()} kg feed reserves & ${totalWaterL.toLocaleString()} L daily consumption.`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-white/40 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CONTENT BY MODAL TYPE */}

        {/* 1. Total Livestock Breakdown */}
        {type === 'livestock' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="text-white/40 text-[10px] block">Total Animals</span>
                <span className="text-2xl font-light text-white">{totalHeadCount}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="text-white/40 text-[10px] block">Dairy Herd</span>
                <span className="text-2xl font-light text-emerald-300">{dairyHeadCount}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="text-white/40 text-[10px] block">Meat Animals</span>
                <span className="text-2xl font-light text-amber-300">{meatHeadCount}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="text-white/40 text-[10px] block">Health Rate</span>
                <span className="text-2xl font-light text-emerald-400">100%</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-white/50 block">
                Select Sector to Open Workspace:
              </span>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {sectors.map((sec) => (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => handleSectorJump(sec.id)}
                    className="w-full p-3 rounded-2xl bg-white/[0.03] hover:bg-emerald-950/40 border border-white/5 hover:border-emerald-500/40 text-left transition-all flex items-center justify-between group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white group-hover:text-emerald-300">
                          {sec.name}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 text-white/50 border border-white/10 uppercase">
                          {sec.category}
                        </span>
                      </div>
                      <p className="text-xs text-white/40 mt-0.5 font-mono">
                        {sec.headCount} Head · {sec.pastureOrPen}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 group-hover:translate-x-1 transition-transform">
                      <span>Open Workspace</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. Dairy Division Breakdown */}
        {type === 'dairy' && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20">
                <span className="text-emerald-400/70 text-[10px] uppercase block">Total Dairy Output</span>
                <span className="text-2xl font-light text-white">2,825 L</span>
                <span className="text-[10px] text-emerald-300 block mt-0.5">Daily Volume</span>
              </div>
              <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20">
                <span className="text-emerald-400/70 text-[10px] uppercase block">Cattle Butterfat</span>
                <span className="text-2xl font-light text-white">4.15%</span>
                <span className="text-[10px] text-emerald-300 block mt-0.5">Grade A Certified</span>
              </div>
              <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20">
                <span className="text-emerald-400/70 text-[10px] uppercase block">Goat Milk Solids</span>
                <span className="text-2xl font-light text-white">3.6%</span>
                <span className="text-[10px] text-emerald-300 block mt-0.5">Cheese Grade</span>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              {dairySectors.map((sec) => (
                <div
                  key={sec.id}
                  className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <h3 className="text-sm font-semibold text-white">{sec.name}</h3>
                    <p className="text-xs text-white/50 font-mono mt-0.5">
                      {sec.headCount} Animals · Daily harvest: <strong className="text-emerald-300">{sec.dailyOutput.metricValue}</strong>
                    </p>
                    <span className="text-[11px] text-white/40 block mt-1">
                      {sec.dailyOutput.efficiency}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSectorJump(sec.id)}
                    className="px-3.5 py-2 text-xs font-semibold bg-[#376343] hover:bg-[#437752] text-white rounded-xl transition-all flex items-center gap-1.5 self-start sm:self-auto shrink-0"
                  >
                    <span>View {sec.animalType} Herd</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. Meat Animals Breakdown */}
        {type === 'meat' && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/20">
                <span className="text-amber-400/70 text-[10px] uppercase block">Total Meat Head</span>
                <span className="text-2xl font-light text-white">{meatHeadCount}</span>
                <span className="text-[10px] text-amber-300 block mt-0.5">Across 5 species</span>
              </div>
              <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/20">
                <span className="text-amber-400/70 text-[10px] uppercase block">Market Ready</span>
                <span className="text-2xl font-light text-white">42 Head</span>
                <span className="text-[10px] text-amber-300 block mt-0.5">Steers & Boer Goats</span>
              </div>
              <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/20">
                <span className="text-amber-400/70 text-[10px] uppercase block">Poultry FCR</span>
                <span className="text-2xl font-light text-white">1.82</span>
                <span className="text-[10px] text-amber-300 block mt-0.5">Optimal conversion</span>
              </div>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {meatSectors.map((sec) => (
                <div
                  key={sec.id}
                  className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between gap-3"
                >
                  <div>
                    <h3 className="text-sm font-semibold text-white">{sec.name}</h3>
                    <p className="text-xs text-white/50 font-mono mt-0.5">
                      {sec.headCount} Head · {sec.dailyOutput.metricName}: <strong className="text-amber-300">{sec.dailyOutput.metricValue}</strong>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSectorJump(sec.id)}
                    className="px-3 py-1.5 text-xs font-medium bg-white/[0.06] hover:bg-amber-950/60 border border-white/10 hover:border-amber-500/30 text-white rounded-xl transition-all flex items-center gap-1 shrink-0"
                  >
                    <span>Open</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Resources: Feed & Water Telemetry */}
        {type === 'resources' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-4 rounded-2xl bg-sky-950/30 border border-sky-500/20 space-y-1">
                <div className="flex items-center gap-2 text-sky-400">
                  <Droplets className="w-4 h-4" />
                  <span className="text-xs uppercase">Water Consumption</span>
                </div>
                <span className="text-3xl font-light text-white block mt-2">
                  {totalWaterL.toLocaleString()} Liters
                </span>
                <p className="text-[11px] text-white/50">
                  Automated float-valve troughs pressurized across all pastures. Flow rate: 18.5 L/min nominal.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/20 space-y-1">
                <div className="flex items-center gap-2 text-amber-400">
                  <Wheat className="w-4 h-4" />
                  <span className="text-xs uppercase">Total Feed Stockpile</span>
                </div>
                <span className="text-3xl font-light text-white block mt-2">
                  {totalFeedKg.toLocaleString()} kg
                </span>
                <p className="text-[11px] text-white/50">
                  Silage, non-GMO dairy grain, alfalfa square bales & broiler ration adequate for 16 days.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2 text-xs font-mono">
              <span className="text-white/40 uppercase text-[10px] block">
                Water & Feed Consumption Breakdown
              </span>
              <div className="space-y-1.5 text-white/70">
                <div className="flex justify-between">
                  <span>Dairy Cattle (North Meadow & Barn A)</span>
                  <span className="text-white">7,560 L/day · 14,200 kg feed</span>
                </div>
                <div className="flex justify-between">
                  <span>Beef Herd (East Plateau)</span>
                  <span className="text-white">4,200 L/day · 18,500 kg feed</span>
                </div>
                <div className="flex justify-between">
                  <span>Dairy & Meat Goats</span>
                  <span className="text-white">980 L/day · 8,000 kg feed</span>
                </div>
                <div className="flex justify-between">
                  <span>Poultry, Ducks & Rabbits</span>
                  <span className="text-white">2,060 L/day · 5,850 kg feed</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="pt-3 border-t border-white/10 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-white/[0.08] hover:bg-white/[0.14] text-white rounded-xl transition-all"
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
};
