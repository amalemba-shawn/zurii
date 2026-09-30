import React, { useState } from 'react';
import { CropFieldSector, FarmOperator } from '../../types/farm';
import { CropFieldsMapView } from './CropFieldsMapView';
import { useTheme } from '../../context/ThemeContext';
import { sound } from '../../utils/audio';
import { 
  Sprout, 
  Droplets, 
  Sun, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  ArrowUpRight, 
  Plus, 
  Activity, 
  Thermometer, 
  Clock, 
  Layers, 
  Sparkles, 
  Wheat, 
  RotateCw,
  MapPin,
  Map as MapIcon,
  LayoutGrid
} from 'lucide-react';

interface CropsDashboardViewProps {
  cropSectors: CropFieldSector[];
  operator: FarmOperator;
  onUpdateIrrigation: (sectorId: string, status: 'idle' | 'active' | 'scheduled') => void;
  onAddCropSector: (newCrop: CropFieldSector) => void;
  onNavigateToIoT?: () => void;
}

export const CropsDashboardView: React.FC<CropsDashboardViewProps> = ({
  cropSectors,
  operator,
  onUpdateIrrigation,
  onAddCropSector,
  onNavigateToIoT
}) => {
  const { isDark } = useTheme();
  const [selectedCrop, setSelectedCrop] = useState<CropFieldSector | null>(cropSectors[1] || null);
  const [activeSubTab, setActiveSubTab] = useState<'map' | 'roster'>('map');

  const totalAcreage = cropSectors.reduce((acc, c) => acc + c.acreage, 0).toFixed(1);
  const activeIrrigationCount = cropSectors.filter(c => c.irrigationStatus === 'active').length;
  const avgSoilMoisture = (
    cropSectors.reduce((acc, c) => acc + c.soilMoistureVwc, 0) / (cropSectors.length || 1)
  ).toFixed(1);
  const totalExpectedYield = cropSectors.reduce((acc, c) => acc + c.expectedYieldTons, 0).toLocaleString();

  const getStageBadge = (stage: CropFieldSector['growthStage']) => {
    switch (stage) {
      case 'Harvest Ready':
        return isDark ? 'bg-amber-950/80 border-amber-500/50 text-amber-300' : 'bg-amber-100 border-amber-300 text-amber-900';
      case 'Flowering':
        return isDark ? 'bg-purple-950/80 border-purple-500/50 text-purple-300' : 'bg-purple-100 border-purple-300 text-purple-900';
      case 'Vegetative':
        return isDark ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300' : 'bg-emerald-100 border-emerald-300 text-emerald-900';
      default:
        return isDark ? 'bg-sky-950/80 border-sky-500/50 text-sky-300' : 'bg-sky-100 border-sky-300 text-sky-900';
    }
  };

  const handleToggleIrrigation = (sectorId: string, currentStatus: 'idle' | 'active' | 'scheduled') => {
    sound.playKeyTap();
    const nextStatus = currentStatus === 'active' ? 'idle' : currentStatus === 'idle' ? 'scheduled' : 'active';
    onUpdateIrrigation(sectorId, nextStatus);
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
            <Wheat className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight">Crops & Agronomy Operations Dashboard</h1>
              <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border font-semibold ${
                isDark ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-emerald-100 text-emerald-800 border-emerald-300'
              }`}>
                Google Maps Satellite API
              </span>
            </div>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
              Map out custom field boundaries, inspect crop species by satellite plot, and trigger automated center pivot irrigation.
            </p>
          </div>
        </div>

        {/* View Mode Toggle: Satellite Map vs Field Roster */}
        <div className="flex items-center gap-2">
          <div className={`p-1 rounded-2xl border flex items-center text-xs font-mono ${
            isDark ? 'bg-black/40 border-white/10' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              type="button"
              onClick={() => {
                sound.playKeyTap();
                setActiveSubTab('map');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeSubTab === 'map'
                  ? isDark ? 'bg-emerald-950 text-emerald-300 font-semibold border border-emerald-500/30' : 'bg-white text-emerald-800 font-semibold shadow-xs'
                  : isDark ? 'text-white/50 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5 text-emerald-500" />
              <span>Satellite Map & Mapper</span>
            </button>

            <button
              type="button"
              onClick={() => {
                sound.playKeyTap();
                setActiveSubTab('roster');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeSubTab === 'roster'
                  ? isDark ? 'bg-emerald-950 text-emerald-300 font-semibold border border-emerald-500/30' : 'bg-white text-emerald-800 font-semibold shadow-xs'
                  : isDark ? 'text-white/50 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5 text-emerald-500" />
              <span>Field Cards ({cropSectors.length})</span>
            </button>
          </div>

          {onNavigateToIoT && (
            <button
              type="button"
              onClick={onNavigateToIoT}
              className={`hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono border transition-colors cursor-pointer ${
                isDark 
                  ? 'bg-white/[0.04] hover:bg-white/[0.08] text-white/80 border-white/10' 
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 shadow-2xs'
              }`}
            >
              <Droplets className="w-3.5 h-3.5 text-sky-500" />
              <span>IoT Moisture Probes</span>
            </button>
          )}
        </div>
      </div>

      {/* 4 Summary Telemetry Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className={`p-4 rounded-2xl border space-y-1 ${
          isDark ? 'bg-[#131E17] border-white/10' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between text-xs font-mono text-emerald-500">
            <span>Total Mapped Land</span>
            <Layers className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold font-mono">{totalAcreage} Acres</div>
          <span className={`text-[11px] font-mono ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
            {cropSectors.length} Active Mapped Fields
          </span>
        </div>

        <div className={`p-4 rounded-2xl border space-y-1 ${
          isDark ? 'bg-[#131E17] border-white/10' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between text-xs font-mono text-sky-500">
            <span>Active Irrigation</span>
            <Droplets className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold font-mono">{activeIrrigationCount} Fields Active</div>
          <span className={`text-[11px] font-mono ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
            Automated moisture trigger
          </span>
        </div>

        <div className={`p-4 rounded-2xl border space-y-1 ${
          isDark ? 'bg-[#131E17] border-white/10' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between text-xs font-mono text-amber-500">
            <span>Avg Soil Moisture</span>
            <Activity className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold font-mono">{avgSoilMoisture}% VWC</div>
          <span className={`text-[11px] font-mono ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
            Optimal root zone target
          </span>
        </div>

        <div className={`p-4 rounded-2xl border space-y-1 ${
          isDark ? 'bg-[#131E17] border-white/10' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between text-xs font-mono text-purple-400">
            <span>Projected Crop Harvest</span>
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold font-mono">{totalExpectedYield} Tons</div>
          <span className={`text-[11px] font-mono ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
            Total seasonal production
          </span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* VIEW A: INTERACTIVE SATELLITE FIELD MAP & AREA MAPPER   */}
      {/* ======================================================== */}
      {activeSubTab === 'map' && (
        <CropFieldsMapView
          cropSectors={cropSectors}
          operator={operator}
          onSelectCrop={(crop) => setSelectedCrop(crop)}
          selectedCrop={selectedCrop}
          onAddCropSector={onAddCropSector}
          onUpdateIrrigation={onUpdateIrrigation}
        />
      )}

      {/* ======================================================== */}
      {/* VIEW B: FIELD ROSTER CARDS                               */}
      {/* ======================================================== */}
      {activeSubTab === 'roster' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 animate-fade-in">
          {cropSectors.map((crop) => {
            const isIrrigating = crop.irrigationStatus === 'active';
            return (
              <div
                key={crop.id}
                className={`p-6 rounded-3xl border flex flex-col justify-between transition-all ${
                  isDark ? 'bg-[#131E17] border-white/10' : 'bg-white border-slate-200 shadow-sm'
                } ${isIrrigating ? 'ring-1 ring-sky-500/40' : ''}`}
              >
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold">{crop.name}</h3>
                        <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border font-semibold ${getStageBadge(crop.growthStage)}`}>
                          ● {crop.growthStage}
                        </span>
                      </div>
                      <p className={`text-xs mt-0.5 ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
                        {crop.cropName} ({crop.variety}) · <strong>{crop.acreage} Acres</strong>
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCrop(crop);
                        setActiveSubTab('map');
                      }}
                      className={`px-2.5 py-1 rounded-xl text-xs font-mono border flex items-center gap-1 transition-colors cursor-pointer ${
                        isDark ? 'border-white/10 text-emerald-400 hover:text-emerald-300' : 'border-slate-200 text-emerald-700 hover:text-emerald-800'
                      }`}
                      title="View on Satellite Map"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>View on Map</span>
                    </button>
                  </div>

                  {/* Agronomy Metrics 4-Box */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                    <div className={`p-2.5 rounded-xl border space-y-0.5 ${
                      isDark ? 'bg-black/30 border-white/5' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <span className={`text-[10px] uppercase ${isDark ? 'text-white/40' : 'text-slate-400'}`}>Moisture</span>
                      <div className="text-sm font-bold text-sky-500">{crop.soilMoistureVwc}%</div>
                      <span className="text-[10px] opacity-60">Volumetric</span>
                    </div>

                    <div className={`p-2.5 rounded-xl border space-y-0.5 ${
                      isDark ? 'bg-black/30 border-white/5' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <span className={`text-[10px] uppercase ${isDark ? 'text-white/40' : 'text-slate-400'}`}>Soil Temp</span>
                      <div className="text-sm font-bold text-amber-500">{crop.soilTempF}°F</div>
                      <span className="text-[10px] opacity-60">Root zone</span>
                    </div>

                    <div className={`p-2.5 rounded-xl border space-y-0.5 ${
                      isDark ? 'bg-black/30 border-white/5' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <span className={`text-[10px] uppercase ${isDark ? 'text-white/40' : 'text-slate-400'}`}>Sunlight</span>
                      <div className="text-sm font-bold text-emerald-500">{crop.sunlightHours}h</div>
                      <span className="text-[10px] opacity-60">Daily PAR</span>
                    </div>

                    <div className={`p-2.5 rounded-xl border space-y-0.5 ${
                      isDark ? 'bg-black/30 border-white/5' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <span className={`text-[10px] uppercase ${isDark ? 'text-white/40' : 'text-slate-400'}`}>Est. Yield</span>
                      <div className="text-sm font-bold text-purple-400">{crop.expectedYieldTons} T</div>
                      <span className="text-[10px] opacity-60">Harvest target</span>
                    </div>
                  </div>

                  {/* Calendar Cycle Strip */}
                  <div className={`p-3 rounded-2xl border flex items-center justify-between text-xs font-mono ${
                    isDark ? 'bg-white/[0.02] border-white/5' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Planted: <strong>{crop.plantingDate}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      <span>Harvest Window: <strong>{crop.estimatedHarvestDate}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions: Smart Irrigation Control */}
                <div className={`mt-5 pt-3.5 border-t flex items-center justify-between gap-3 ${
                  isDark ? 'border-white/10' : 'border-slate-200'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-mono ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
                      Irrigation Valve:
                    </span>
                    <span className={`text-xs font-mono font-bold uppercase px-2.5 py-0.5 rounded-lg border ${
                      crop.irrigationStatus === 'active'
                        ? 'bg-sky-500/20 text-sky-400 border-sky-500/40 animate-pulse'
                        : crop.irrigationStatus === 'scheduled'
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                        : isDark ? 'bg-white/[0.04] text-white/50 border-white/10' : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}>
                      ● {crop.irrigationStatus}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleIrrigation(crop.id, crop.irrigationStatus)}
                    className={`px-3 py-1.5 text-xs font-mono rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
                      crop.irrigationStatus === 'active'
                        ? 'bg-sky-600 hover:bg-sky-700 text-white border-sky-600'
                        : isDark
                        ? 'bg-white/[0.05] hover:bg-white/[0.1] text-white border-white/10'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300 shadow-2xs'
                    }`}
                  >
                    <RotateCw className="w-3 h-3" />
                    <span>Cycle Irrigation</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
