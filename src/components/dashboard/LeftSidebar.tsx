import React from 'react';
import { LivestockSector, FarmOperator } from '../../types/farm';
import { ThemeToggle } from '../ThemeToggle';
import { useTheme } from '../../context/ThemeContext';
import { 
  LayoutDashboard, 
  CloudSun, 
  Milk, 
  Beef, 
  Egg, 
  Waves, 
  Rabbit, 
  Lock, 
  X, 
  ShieldCheck,
  ChevronRight,
  Sprout,
  ClipboardList
} from 'lucide-react';

export type DashboardSectorTab = 
  | 'overview' 
  | 'weather' 
  | 'cows-dairy' 
  | 'goats-dairy' 
  | 'milking-records' 
  | 'cows-meat' 
  | 'goats-meat' 
  | 'chicken' 
  | 'ducks' 
  | 'rabbits';

interface LeftSidebarProps {
  currentTab: DashboardSectorTab;
  onSelectTab: (tab: DashboardSectorTab) => void;
  sectors: LivestockSector[];
  operator: FarmOperator;
  onLockTerminal: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  currentTab,
  onSelectTab,
  sectors,
  operator,
  onLockTerminal,
  isOpenMobile,
  onCloseMobile
}) => {
  const { isDark } = useTheme();

  const getSectorHeadCount = (id: string) => {
    const sec = sectors.find(s => s.id === id);
    return sec ? sec.headCount : 0;
  };

  const handleTabClick = (tab: DashboardSectorTab) => {
    onSelectTab(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`fixed top-0 bottom-0 left-0 z-50 w-72 flex flex-col justify-between backdrop-blur-2xl transition-all duration-200 lg:translate-x-0 border-r ${
        isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } ${
        isDark 
          ? 'bg-[#0E1611]/95 border-white/10 text-white' 
          : 'bg-white/95 border-slate-200 text-slate-900 shadow-lg'
      }`}>
        {/* Top: Brand Header */}
        <div className={`p-5 border-b flex items-center justify-between ${
          isDark ? 'border-white/10' : 'border-slate-200'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-sm ${
              isDark 
                ? 'bg-[#203627] border border-emerald-500/30 text-emerald-400' 
                : 'bg-emerald-600 border border-emerald-500 text-white shadow-xs'
            }`}>
              <Sprout className="w-4 h-4" />
            </div>
            <div>
              <div className={`text-sm font-semibold tracking-tight font-mono leading-none ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                SOLUM LIVESTOCK
              </div>
              <span className={`text-[10px] font-mono tracking-wider mt-1 block ${
                isDark ? 'text-emerald-400/80' : 'text-emerald-700 font-semibold'
              }`}>
                DAIRY & MEAT SECTORS
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onCloseMobile}
            className={`p-1.5 rounded-lg lg:hidden transition-colors ${
              isDark ? 'text-white/40 hover:text-white' : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Middle: Navigation Links */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Main Navigation */}
          <div className="space-y-1">
            <span className={`text-[10px] font-mono uppercase tracking-wider px-3 block mb-1.5 ${
              isDark ? 'text-white/40' : 'text-slate-400 font-medium'
            }`}>
              General
            </span>

            <button
              type="button"
              onClick={() => handleTabClick('overview')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                currentTab === 'overview'
                  ? isDark 
                    ? 'bg-emerald-950/60 text-white border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.15)] font-semibold' 
                    : 'bg-emerald-50 text-emerald-900 border border-emerald-300 shadow-2xs font-semibold'
                  : isDark 
                    ? 'text-white/60 hover:text-white hover:bg-white/[0.04]' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className={`w-4 h-4 ${
                  currentTab === 'overview' 
                    ? isDark ? 'text-emerald-400' : 'text-emerald-700' 
                    : isDark ? 'text-white/40' : 'text-slate-400'
                }`} />
                <span>Dashboard Overview</span>
              </div>
              <span className={`text-[10px] font-mono ${isDark ? 'text-white/40' : 'text-slate-400'}`}>All</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabClick('weather')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                currentTab === 'weather'
                  ? isDark 
                    ? 'bg-emerald-950/60 text-white border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.15)] font-semibold' 
                    : 'bg-emerald-50 text-emerald-900 border border-emerald-300 shadow-2xs font-semibold'
                  : isDark 
                    ? 'text-white/60 hover:text-white hover:bg-white/[0.04]' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <CloudSun className={`w-4 h-4 ${
                  currentTab === 'weather' 
                    ? 'text-amber-500' 
                    : isDark ? 'text-white/40' : 'text-slate-400'
                }`} />
                <span>Weather & Pastures</span>
              </div>
              <span className={`text-[10px] font-mono ${isDark ? 'text-amber-400/80' : 'text-amber-600 font-semibold'}`}>Live</span>
            </button>
          </div>

          {/* Dairy Animals Group */}
          <div className="space-y-1">
            <div className="flex items-center justify-between px-3 mb-1.5">
              <span className={`text-[10px] font-mono uppercase tracking-wider font-semibold ${
                isDark ? 'text-emerald-400' : 'text-emerald-700'
              }`}>
                Dairy Animals
              </span>
              <span className={`text-[10px] font-mono ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
                Lactation
              </span>
            </div>

            {/* Cows Dairy */}
            <button
              type="button"
              onClick={() => handleTabClick('cows-dairy')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group cursor-pointer ${
                currentTab === 'cows-dairy'
                  ? isDark 
                    ? 'bg-emerald-950/60 text-white border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.15)] font-semibold' 
                    : 'bg-emerald-50 text-emerald-900 border border-emerald-300 shadow-2xs font-semibold'
                  : isDark 
                    ? 'text-white/60 hover:text-white hover:bg-white/[0.04]' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Milk className={`w-4 h-4 ${
                  currentTab === 'cows-dairy' 
                    ? isDark ? 'text-emerald-400' : 'text-emerald-700' 
                    : isDark ? 'text-white/40 group-hover:text-emerald-300' : 'text-slate-400 group-hover:text-emerald-700'
                }`} />
                <span>Cows (Dairy Herd)</span>
              </div>
              <span className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
                isDark 
                  ? 'bg-black/40 text-emerald-300 border-white/5' 
                  : 'bg-slate-100 text-emerald-800 border-slate-200'
              }`}>
                {getSectorHeadCount('cows-dairy')}
              </span>
            </button>

            {/* Goats Dairy */}
            <button
              type="button"
              onClick={() => handleTabClick('goats-dairy')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group cursor-pointer ${
                currentTab === 'goats-dairy'
                  ? isDark 
                    ? 'bg-emerald-950/60 text-white border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.15)] font-semibold' 
                    : 'bg-emerald-50 text-emerald-900 border border-emerald-300 shadow-2xs font-semibold'
                  : isDark 
                    ? 'text-white/60 hover:text-white hover:bg-white/[0.04]' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Milk className={`w-4 h-4 ${
                  currentTab === 'goats-dairy' 
                    ? isDark ? 'text-emerald-400' : 'text-emerald-700' 
                    : isDark ? 'text-white/40 group-hover:text-emerald-300' : 'text-slate-400 group-hover:text-emerald-700'
                }`} />
                <span>Goats (Dairy Herd)</span>
              </div>
              <span className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
                isDark 
                  ? 'bg-black/40 text-emerald-300 border-white/5' 
                  : 'bg-slate-100 text-emerald-800 border-slate-200'
              }`}>
                {getSectorHeadCount('goats-dairy')}
              </span>
            </button>

            {/* Milking Records Tab */}
            <button
              type="button"
              onClick={() => handleTabClick('milking-records')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group cursor-pointer ${
                currentTab === 'milking-records'
                  ? isDark 
                    ? 'bg-emerald-950/60 text-white border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.15)] font-semibold' 
                    : 'bg-emerald-50 text-emerald-900 border border-emerald-300 shadow-2xs font-semibold'
                  : isDark 
                    ? 'text-white/60 hover:text-white hover:bg-white/[0.04]' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ClipboardList className={`w-4 h-4 ${
                  currentTab === 'milking-records' 
                    ? isDark ? 'text-emerald-400' : 'text-emerald-700' 
                    : isDark ? 'text-white/40 group-hover:text-emerald-300' : 'text-slate-400 group-hover:text-emerald-700'
                }`} />
                <span>Milking Records & Log</span>
              </div>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-semibold ${
                isDark 
                  ? 'bg-emerald-500/20 text-emerald-300' 
                  : 'bg-emerald-100 text-emerald-800'
              }`}>
                Daily
              </span>
            </button>
          </div>

          {/* Meat Animals Group */}
          <div className="space-y-1">
            <div className="flex items-center justify-between px-3 mb-1.5">
              <span className={`text-[10px] font-mono uppercase tracking-wider font-semibold ${
                isDark ? 'text-amber-400' : 'text-amber-700'
              }`}>
                Meat Purpose Animals
              </span>
              <span className={`text-[10px] font-mono ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
                Livestock
              </span>
            </div>

            {/* Cows Meat */}
            <button
              type="button"
              onClick={() => handleTabClick('cows-meat')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group cursor-pointer ${
                currentTab === 'cows-meat'
                  ? isDark 
                    ? 'bg-emerald-950/60 text-white border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.15)] font-semibold' 
                    : 'bg-emerald-50 text-emerald-900 border border-emerald-300 shadow-2xs font-semibold'
                  : isDark 
                    ? 'text-white/60 hover:text-white hover:bg-white/[0.04]' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Beef className={`w-4 h-4 ${
                  currentTab === 'cows-meat' 
                    ? 'text-amber-500' 
                    : isDark ? 'text-white/40 group-hover:text-amber-300' : 'text-slate-400 group-hover:text-amber-700'
                }`} />
                <span>Cows (Beef Cattle)</span>
              </div>
              <span className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
                isDark 
                  ? 'bg-black/40 text-amber-300 border-white/5' 
                  : 'bg-slate-100 text-amber-800 border-slate-200'
              }`}>
                {getSectorHeadCount('cows-meat')}
              </span>
            </button>

            {/* Goats Meat */}
            <button
              type="button"
              onClick={() => handleTabClick('goats-meat')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group cursor-pointer ${
                currentTab === 'goats-meat'
                  ? isDark 
                    ? 'bg-emerald-950/60 text-white border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.15)] font-semibold' 
                    : 'bg-emerald-50 text-emerald-900 border border-emerald-300 shadow-2xs font-semibold'
                  : isDark 
                    ? 'text-white/60 hover:text-white hover:bg-white/[0.04]' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Beef className={`w-4 h-4 ${
                  currentTab === 'goats-meat' 
                    ? 'text-amber-500' 
                    : isDark ? 'text-white/40 group-hover:text-amber-300' : 'text-slate-400 group-hover:text-amber-700'
                }`} />
                <span>Goats (Meat / Boer)</span>
              </div>
              <span className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
                isDark 
                  ? 'bg-black/40 text-amber-300 border-white/5' 
                  : 'bg-slate-100 text-amber-800 border-slate-200'
              }`}>
                {getSectorHeadCount('goats-meat')}
              </span>
            </button>

            {/* Chicken */}
            <button
              type="button"
              onClick={() => handleTabClick('chicken')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group cursor-pointer ${
                currentTab === 'chicken'
                  ? isDark 
                    ? 'bg-emerald-950/60 text-white border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.15)] font-semibold' 
                    : 'bg-emerald-50 text-emerald-900 border border-emerald-300 shadow-2xs font-semibold'
                  : isDark 
                    ? 'text-white/60 hover:text-white hover:bg-white/[0.04]' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Egg className={`w-4 h-4 ${
                  currentTab === 'chicken' 
                    ? 'text-amber-500' 
                    : isDark ? 'text-white/40 group-hover:text-amber-300' : 'text-slate-400 group-hover:text-amber-700'
                }`} />
                <span>Chickens (Broiler / Meat)</span>
              </div>
              <span className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
                isDark 
                  ? 'bg-black/40 text-amber-300 border-white/5' 
                  : 'bg-slate-100 text-amber-800 border-slate-200'
              }`}>
                {getSectorHeadCount('chicken')}
              </span>
            </button>

            {/* Ducks */}
            <button
              type="button"
              onClick={() => handleTabClick('ducks')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group cursor-pointer ${
                currentTab === 'ducks'
                  ? isDark 
                    ? 'bg-emerald-950/60 text-white border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.15)] font-semibold' 
                    : 'bg-emerald-50 text-emerald-900 border border-emerald-300 shadow-2xs font-semibold'
                  : isDark 
                    ? 'text-white/60 hover:text-white hover:bg-white/[0.04]' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Waves className={`w-4 h-4 ${
                  currentTab === 'ducks' 
                    ? 'text-sky-500' 
                    : isDark ? 'text-white/40 group-hover:text-sky-300' : 'text-slate-400 group-hover:text-sky-700'
                }`} />
                <span>Ducks (Waterfowl Meat)</span>
              </div>
              <span className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
                isDark 
                  ? 'bg-black/40 text-sky-300 border-white/5' 
                  : 'bg-slate-100 text-sky-800 border-slate-200'
              }`}>
                {getSectorHeadCount('ducks')}
              </span>
            </button>

            {/* Rabbits */}
            <button
              type="button"
              onClick={() => handleTabClick('rabbits')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group cursor-pointer ${
                currentTab === 'rabbits'
                  ? isDark 
                    ? 'bg-emerald-950/60 text-white border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.15)] font-semibold' 
                    : 'bg-emerald-50 text-emerald-900 border border-emerald-300 shadow-2xs font-semibold'
                  : isDark 
                    ? 'text-white/60 hover:text-white hover:bg-white/[0.04]' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Rabbit className={`w-4 h-4 ${
                  currentTab === 'rabbits' 
                    ? 'text-amber-500' 
                    : isDark ? 'text-white/40 group-hover:text-amber-300' : 'text-slate-400 group-hover:text-amber-700'
                }`} />
                <span>Rabbits (Cuniculture Meat)</span>
              </div>
              <span className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
                isDark 
                  ? 'bg-black/40 text-amber-300 border-white/5' 
                  : 'bg-slate-100 text-amber-800 border-slate-200'
              }`}>
                {getSectorHeadCount('rabbits')}
              </span>
            </button>
          </div>
        </div>

        {/* Bottom: Theme Mode Switcher & Operator Profile Card */}
        <div className={`p-4 border-t space-y-3 ${
          isDark ? 'border-white/10 bg-black/20' : 'border-slate-200 bg-slate-50/80'
        }`}>
          {/* Theme switcher button in sidebar */}
          <div className="w-full">
            <ThemeToggle variant="expanded" />
          </div>

          <div className={`flex items-center gap-3 p-2 rounded-xl border ${
            isDark ? 'bg-white/[0.03] border-white/5' : 'bg-white border-slate-200 shadow-2xs'
          }`}>
            <div className={`w-9 h-9 rounded-lg border flex items-center justify-center font-mono text-xs font-semibold shrink-0 ${
              isDark 
                ? 'bg-[#223528] border-emerald-500/20 text-emerald-300' 
                : 'bg-emerald-100 border-emerald-300 text-emerald-800'
            }`}>
              {operator.avatarInitials}
            </div>
            <div className="flex-1 min-w-0">
              <div className={`text-xs font-semibold truncate ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                {operator.name}
              </div>
              <div className={`text-[10px] truncate font-mono ${
                isDark ? 'text-white/50' : 'text-slate-500'
              }`}>
                {operator.role}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onLockTerminal}
            className={`w-full py-2 px-3 rounded-xl text-xs font-medium border flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer ${
              isDark 
                ? 'bg-white/[0.06] hover:bg-white/[0.12] text-white border-white/10' 
                : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-2xs'
            }`}
          >
            <Lock className={`w-3.5 h-3.5 ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`} />
            <span>Lock Terminal</span>
          </button>
        </div>
      </aside>
    </>
  );
};
