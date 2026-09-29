import React from 'react';
import { LivestockSector } from '../../types/farm';
import { 
  X, 
  Activity, 
  Droplets, 
  Thermometer, 
  Wheat, 
  ShieldCheck, 
  CheckCircle2, 
  Calendar,
  AlertTriangle
} from 'lucide-react';

export type SectorModalTileType = 'headCount' | 'output' | 'feedWater' | 'climate' | 'alert' | null;

interface SectorTelemetryModalProps {
  type: SectorModalTileType;
  alertText?: string | null;
  sector: LivestockSector;
  isOpen: boolean;
  onClose: () => void;
  onOpenAddAnimal?: () => void;
}

export const SectorTelemetryModal: React.FC<SectorTelemetryModalProps> = ({
  type,
  alertText,
  sector,
  isOpen,
  onClose,
  onOpenAddAnimal
}) => {
  if (!isOpen || !type) return null;

  const isDairy = sector.category === 'dairy';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#131E17] border border-white/10 rounded-3xl shadow-2xl p-6 text-white space-y-5 my-6">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#1F3325] border border-emerald-500/30 text-emerald-400">
              {type === 'headCount' && <ShieldCheck className="w-5 h-5" />}
              {type === 'output' && <Activity className="w-5 h-5 text-emerald-300" />}
              {type === 'feedWater' && <Wheat className="w-5 h-5 text-amber-300" />}
              {type === 'climate' && <Thermometer className="w-5 h-5 text-amber-400" />}
              {type === 'alert' && <AlertTriangle className="w-5 h-5 text-amber-400" />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                {type === 'headCount' && `${sector.name} · Herd Census`}
                {type === 'output' && `${sector.name} · Production Telemetry`}
                {type === 'feedWater' && `${sector.name} · Feed & Hydration`}
                {type === 'climate' && `${sector.name} · Climate Control`}
                {type === 'alert' && `Sector Alert Details`}
              </h2>
              <p className="text-xs text-white/50 mt-0.5">
                {sector.location} · {sector.pastureOrPen}
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

        {/* Tile Content */}
        {type === 'headCount' && (
          <div className="space-y-4 text-xs font-mono">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
              <span className="text-white/40 uppercase text-[10px]">Herd Composition</span>
              <div className="flex justify-between items-baseline">
                <span className="text-2xl font-light text-white">{sector.headCount} Total Head</span>
                <span className="text-emerald-400">100% Accounted</span>
              </div>
              <p className="text-white/60 text-[11px] leading-relaxed pt-1">
                Every animal in this sector has a physical ear-tag or band registered in the herd database.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between p-2.5 rounded-xl bg-white/[0.02]">
                <span className="text-white/60">Registered Profiles in Roster</span>
                <span className="text-white font-medium">{sector.animals?.length || 0} Records</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-white/[0.02]">
                <span className="text-white/60">Quarantine Status</span>
                <span className="text-emerald-400 font-medium">None Quarantined</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-white/[0.02]">
                <span className="text-white/60">Pasture Capacity Utilization</span>
                <span className="text-white font-medium">68% of Paddock Max</span>
              </div>
            </div>

            {onOpenAddAnimal && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAddAnimal();
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-[#376343] hover:bg-[#437752] text-white font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md"
              >
                <span>+ Add Another Animal to Herd</span>
              </button>
            )}
          </div>
        )}

        {type === 'output' && (
          <div className="space-y-4 text-xs font-mono">
            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 space-y-2">
              <span className="text-emerald-400 text-[10px] uppercase">Yield & Output Report</span>
              <div className="flex justify-between items-baseline">
                <span className="text-2xl font-light text-white">{sector.dailyOutput.metricValue}</span>
                <span className="text-emerald-300">{sector.dailyOutput.metricName}</span>
              </div>
              <p className="text-emerald-200/70 text-[11px]">
                {sector.dailyOutput.efficiency}
              </p>
            </div>

            <div className="space-y-2">
              {isDairy ? (
                <>
                  <div className="flex justify-between p-2.5 rounded-xl bg-white/[0.02]">
                    <span className="text-white/60">Bulk Tank Chilling Temp</span>
                    <span className="text-emerald-300 font-medium">38.2°F (Compliant)</span>
                  </div>
                  <div className="flex justify-between p-2.5 rounded-xl bg-white/[0.02]">
                    <span className="text-white/60">Somatic Cell Count (SCC)</span>
                    <span className="text-emerald-300 font-medium">&lt; 118,000 / mL</span>
                  </div>
                  <div className="flex justify-between p-2.5 rounded-xl bg-white/[0.02]">
                    <span className="text-white/60">Next Milk Hauler Pickup</span>
                    <span className="text-white font-medium">Tomorrow, 07:30 AM</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between p-2.5 rounded-xl bg-white/[0.02]">
                    <span className="text-white/60">Average Daily Gain (ADG)</span>
                    <span className="text-amber-300 font-medium">+1.42 kg / day</span>
                  </div>
                  <div className="flex justify-between p-2.5 rounded-xl bg-white/[0.02]">
                    <span className="text-white/60">Batch Weigh-In Frequency</span>
                    <span className="text-white font-medium">Bi-weekly on scale</span>
                  </div>
                  <div className="flex justify-between p-2.5 rounded-xl bg-white/[0.02]">
                    <span className="text-white/60">Finishing Readiness</span>
                    <span className="text-emerald-300 font-medium">On Target Curve</span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {type === 'feedWater' && (
          <div className="space-y-4 text-xs font-mono">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/20">
                <span className="text-amber-400 text-[10px] uppercase block">Feed Inventory</span>
                <span className="text-xl font-light text-white mt-1 block">
                  {sector.feedInventoryKg.toLocaleString()} kg
                </span>
                <span className="text-[10px] text-white/40 block">14 days reserve</span>
              </div>
              <div className="p-3.5 rounded-xl bg-sky-950/30 border border-sky-500/20">
                <span className="text-sky-400 text-[10px] uppercase block">Daily Water Intake</span>
                <span className="text-xl font-light text-white mt-1 block">
                  {sector.waterConsumptionL.toLocaleString()} L
                </span>
                <span className="text-[10px] text-white/40 block">Float-valve active</span>
              </div>
            </div>

            <div className="space-y-2 p-3.5 rounded-2xl bg-black/40 border border-white/5">
              <span className="text-white/40 uppercase text-[10px] block">Ration Composition</span>
              <p className="text-white/70 leading-relaxed text-xs">
                {isDairy 
                  ? 'Total Mixed Ration (TMR) comprising 55% alfalfa haylage, 30% cracked non-GMO corn, 10% soybean meal, and 5% vitamin-mineral buffer.'
                  : 'High-energy pasture grass supplemented with mineral lick blocks and grain finishing rations.'}
              </p>
            </div>
          </div>
        )}

        {type === 'climate' && (
          <div className="space-y-4 text-xs font-mono">
            <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/20 flex items-center justify-between">
              <div>
                <span className="text-amber-400 text-[10px] uppercase block">Barn Ambient Temperature</span>
                <span className="text-3xl font-light text-white mt-1 block">
                  {sector.housingTemp}°F
                </span>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300">
                Nominal Comfort Range
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between p-2.5 rounded-xl bg-white/[0.02]">
                <span className="text-white/60">Automated Ventilation Curtains</span>
                <span className="text-emerald-400 font-medium">Open 45% (Cross-breeze)</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-white/[0.02]">
                <span className="text-white/60">High-Volume Low-Speed Fans</span>
                <span className="text-white font-medium">Armed (Auto-starts at 72°F)</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-white/[0.02]">
                <span className="text-white/60">High-Pressure Misting Line</span>
                <span className="text-white font-medium">Ready (Humidity sensor tied)</span>
              </div>
            </div>
          </div>
        )}

        {type === 'alert' && alertText && (
          <div className="space-y-4 text-xs font-mono">
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span className="font-semibold uppercase tracking-wider text-[11px]">Active Operational Protocol</span>
              </div>
              <p className="text-white text-sm leading-relaxed font-sans pt-1">
                {alertText}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1 text-white/60">
              <span className="text-[10px] uppercase text-white/40 block">Resolution Status</span>
              <p className="text-xs">
                Logged during current shift. Verified by automated telemetry probes and field operators.
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-3 border-t border-white/10 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-white/[0.08] hover:bg-white/[0.14] text-white rounded-xl transition-all"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
