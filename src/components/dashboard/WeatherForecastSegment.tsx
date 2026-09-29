import React, { useState } from 'react';
import { WeatherData, DayForecast } from '../../types/farm';
import { 
  CloudSun, 
  Droplets, 
  Wind, 
  Sun, 
  Compass, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert,
  ChevronRight,
  Gauge,
  X,
  Clock,
  Sparkles
} from 'lucide-react';
import { sound } from '../../utils/audio';

interface WeatherForecastSegmentProps {
  weather: WeatherData;
  compact?: boolean;
}

export const WeatherForecastSegment: React.FC<WeatherForecastSegmentProps> = ({ 
  weather,
  compact = false 
}) => {
  const [selectedDay, setSelectedDay] = useState<DayForecast>(weather.dailyForecast[0]);
  const [showHourlyModal, setShowHourlyModal] = useState(false);

  return (
    <div className="rounded-3xl bg-[#131E17]/90 border border-white/10 p-5 md:p-6 backdrop-blur-xl shadow-xl space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-950/40 border border-amber-500/20 text-amber-300">
            <CloudSun className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-white">
                Farm Microclimate & Weather Forecast
              </h2>
              <button
                type="button"
                onClick={() => {
                  sound.playKeyTap();
                  setShowHourlyModal(true);
                }}
                className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/20 px-2 py-0.5 rounded cursor-pointer transition-colors"
              >
                Station 04 · View Hourly →
              </button>
            </div>
            <p className="text-xs text-white/50 mt-0.5">
              Agricultural forecast & pasture grazing advisories for dairy and meat herds.
            </p>
          </div>
        </div>

        {/* Current summary pill */}
        <div className="flex items-center gap-4 text-xs font-mono text-white/60">
          <div>
            <span className="text-white/40 block text-[10px]">Barometer</span>
            <span className="text-white font-medium">{weather.barometer} hPa</span>
          </div>
          <div>
            <span className="text-white/40 block text-[10px]">Dew Point</span>
            <span className="text-white font-medium">{weather.dewPoint}°F</span>
          </div>
          <div>
            <span className="text-white/40 block text-[10px]">UV Index</span>
            <span className="text-amber-300 font-medium">{weather.uvIndex} (Moderate)</span>
          </div>
        </div>
      </div>

      {/* Main Weather Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Current Temperature & Primary Conditions (Clickable) */}
        <div 
          onClick={() => {
            sound.playKeyTap();
            setShowHourlyModal(true);
          }}
          className="p-5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-emerald-500/30 transition-all flex flex-col justify-between cursor-pointer group"
        >
          <div>
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider block group-hover:underline">
                  Current Ambient · Inspect →
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-mono text-4xl sm:text-5xl font-light text-white tracking-tight">
                    {weather.currentTemp}°
                  </span>
                  <span className="text-sm text-white/50 font-mono">
                    Feels {weather.feelsLike}°F
                  </span>
                </div>
              </div>
              <span className="text-xs font-medium text-white/80 bg-white/[0.06] border border-white/10 px-2.5 py-1 rounded-lg">
                {weather.condition}
              </span>
            </div>

            {/* Microclimate Gauges */}
            <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-white/5 text-xs font-mono">
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-sky-400" />
                <div>
                  <span className="text-white/40 block text-[10px]">Humidity</span>
                  <span className="text-white font-medium">{weather.humidity}%</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Wind className="w-4 h-4 text-teal-400" />
                <div>
                  <span className="text-white/40 block text-[10px]">Wind Velocity</span>
                  <span className="text-white font-medium">{weather.windSpeed} mph {weather.windDirection}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Advisory banner */}
          <div className="mt-4 p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-400 font-medium mb-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Livestock Welfare Status</span>
            </div>
            <p className="text-[11px] text-emerald-100/70 leading-relaxed">
              {weather.livestockAdvisory}
            </p>
          </div>
        </div>

        {/* Middle & Right: 5-Day Forecast Strip with Grazing Index */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-white/40 uppercase tracking-wider">
              5-Day Livestock Pasture & Grazing Forecast
            </span>
            <span className="text-[11px] text-white/40 font-mono">
              Click day to inspect details
            </span>
          </div>

          {/* 5-Day Card Carousel/List */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {weather.dailyForecast.map((day) => {
              const isSelected = selectedDay.day === day.day;
              return (
                <button
                  key={day.day}
                  type="button"
                  onClick={() => {
                    sound.playKeyTap();
                    setSelectedDay(day);
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all duration-150 flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-950/50 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/30'
                      : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.06] hover:border-white/10'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-white">{day.day}</span>
                      <span className="text-[10px] font-mono text-white/40">{day.date.split(' ')[1]}</span>
                    </div>

                    <div className="my-2.5">
                      <div className="text-lg font-mono font-medium text-white">
                        {day.tempHigh}°
                        <span className="text-xs text-white/40 font-normal ml-1">/ {day.tempLow}°</span>
                      </div>
                      <div className="text-[11px] text-white/60 truncate mt-0.5">
                        {day.condition}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/5 space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-sky-300 flex items-center gap-0.5">
                        <Droplets className="w-2.5 h-2.5" />
                        {day.rainProbability}%
                      </span>
                      <span className="text-white/40">
                        {day.windSpeed}m
                      </span>
                    </div>

                    <div className={`text-[9px] font-mono font-medium px-1.5 py-0.5 rounded text-center truncate ${
                      day.grazingIndex === 'Optimal'
                        ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-500/20'
                        : day.grazingIndex === 'Fair'
                        ? 'bg-amber-900/40 text-amber-300 border border-amber-500/20'
                        : 'bg-red-900/40 text-red-300 border border-red-500/20'
                    }`}>
                      {day.grazingIndex}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Day Expanded Detail */}
          <div className="p-3.5 rounded-xl bg-black/30 border border-white/5 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="font-medium text-white flex items-center gap-2">
                <span>{selectedDay.day} ({selectedDay.date}) Agricultural Advisory:</span>
                <span className="text-[11px] font-mono text-emerald-400">
                  {selectedDay.grazingIndex} Grazing
                </span>
              </span>
              <p className="text-[11px] text-white/60">
                {selectedDay.advisory}
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0 font-mono text-[11px] text-white/50 border-t sm:border-t-0 pt-2 sm:pt-0 border-white/5">
              <span>Rain: <strong className="text-sky-300">{selectedDay.rainProbability}%</strong></span>
              <span>Wind: <strong className="text-white">{selectedDay.windSpeed} mph</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Hourly Weather & Microclimate Detail Modal */}
      {showHourlyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-xl bg-[#131E17] border border-white/10 rounded-3xl shadow-2xl p-6 text-white space-y-5 my-6">
            <div className="flex items-start justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-amber-950/40 border border-amber-500/20 text-amber-300">
                  <CloudSun className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Hourly Microclimate & Livestock Comfort
                  </h3>
                  <p className="text-xs text-white/50 mt-0.5">
                    Sensor Station 04 telemetry · Automated THI (Temperature-Humidity Index) monitoring
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowHourlyModal(false)}
                className="p-1.5 text-white/40 hover:text-white rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Hourly Row Cards */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase text-white/40 block">
                Today's Hourly Temperature & Rain Risk
              </span>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 text-center text-xs font-mono">
                {weather.hourlyForecast.map((hour) => (
                  <div key={hour.time} className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                    <span className="text-[10px] text-white/40 block">{hour.time}</span>
                    <span className="text-base font-medium text-white block">{hour.temp}°</span>
                    <span className="text-[9px] text-sky-300 flex items-center justify-center gap-0.5">
                      <Droplets className="w-2.5 h-2.5" />
                      {hour.rainProb}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* THI Comfort Scale Info */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2 text-xs font-mono">
              <div className="flex justify-between items-center text-white/70">
                <span className="uppercase text-[10px] text-white/40">Livestock Thermal Comfort</span>
                <span className="text-emerald-400">THI 62 (Normal / No Stress)</span>
              </div>
              <p className="text-[11px] text-white/60 leading-relaxed font-sans">
                Dairy cows operate at peak metabolic yield below 68 THI. Pasture shade sails and barn misting lines are currently on automated standby.
              </p>
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-end">
              <button
                type="button"
                onClick={() => setShowHourlyModal(false)}
                className="px-4 py-2 text-xs font-semibold bg-white/[0.08] hover:bg-white/[0.14] text-white rounded-xl"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
