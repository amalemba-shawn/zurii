import React from 'react';
import { LivestockSector, FarmOperator } from '../../types/farm';
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
      <aside className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#0E1611]/95 border-r border-white/10 flex flex-col justify-between backdrop-blur-2xl transition-transform duration-200 lg:translate-x-0 ${
        isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Top: Brand Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#203627] border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm">
              <Sprout className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-semibold tracking-tight text-white font-mono leading-none">
                SOLUM LIVESTOCK
              </div>
              <span className="text-[10px] text-emerald-400/80 font-mono tracking-wider mt-1 block">
                DAIRY & MEAT SECTORS
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onCloseMobile}
            className="p-1.5 text-white/40 hover:text-white rounded-lg lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Middle: Navigation Links */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Main Navigation */}
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 px-3 block mb-1.5">
              General
            </span>

            <button
              type="button"
              onClick={() => handleTabClick('overview')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                currentTab === 'overview'
                  ? 'bg-emerald-950/60 text-white border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                  : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className={`w-4 h-4 ${currentTab === 'overview' ? 'text-emerald-400' : 'text-white/40'}`} />
                <span>Dashboard Overview</span>
              </div>
              <span className="text-[10px] font-mono text-white/40">All</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabClick('weather')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                currentTab === 'weather'
                  ? 'bg-emerald-950/60 text-white border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                  : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <CloudSun className={`w-4 h-4 ${currentTab === 'weather' ? 'text-amber-400' : 'text-white/40'}`} />
                <span>Weather & Pastures</span>
              </div>
              <span className="text-[10px] font-mono text-amber-400/80">Live</span>
            </button>
          </div>

          {/* Dairy Animals Group */}
          <div className="space-y-1">
            <div className="flex items-center justify-between px-3 mb-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">
                Dairy Animals
              </span>
              <span className="text-[10px] font-mono text-white/40">
                Lactation
              </span>
            </div>

            {/* Cows Dairy */}
            <button
              type="button"
              onClick={() => handleTabClick('cows-dairy')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                currentTab === 'cows-dairy'
                  ? 'bg-emerald-950/60 text-white border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                  : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Milk className={`w-4 h-4 ${currentTab === 'cows-dairy' ? 'text-emerald-400' : 'text-white/40 group-hover:text-emerald-300'}`} />
                <span>Cows (Dairy Herd)</span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-black/40 text-emerald-300 border border-white/5">
                {getSectorHeadCount('cows-dairy')}
              </span>
            </button>

            {/* Goats Dairy */}
            <button
              type="button"
              onClick={() => handleTabClick('goats-dairy')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                currentTab === 'goats-dairy'
                  ? 'bg-emerald-950/60 text-white border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                  : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Milk className={`w-4 h-4 ${currentTab === 'goats-dairy' ? 'text-emerald-400' : 'text-white/40 group-hover:text-emerald-300'}`} />
                <span>Goats (Dairy Herd)</span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-black/40 text-emerald-300 border border-white/5">
                {getSectorHeadCount('goats-dairy')}
              </span>
            </button>

            {/* Milking Records & Log */}
            <button
              type="button"
              onClick={() => handleTabClick('milking-records')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                currentTab === 'milking-records'
                  ? 'bg-emerald-950/60 text-white border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                  : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ClipboardList className={`w-4 h-4 ${currentTab === 'milking-records' ? 'text-emerald-400' : 'text-white/40 group-hover:text-emerald-300'}`} />
                <span>Milking Records & Log</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-300 border border-emerald-500/20">
                AM / PM
              </span>
            </button>
          </div>

          {/* Meat Animals Group */}
          <div className="space-y-1">
            <div className="flex items-center justify-between px-3 mb-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400">
                Meat Animals
              </span>
              <span className="text-[10px] font-mono text-white/40">
                Market
              </span>
            </div>

            {/* Cows Meat */}
            <button
              type="button"
              onClick={() => handleTabClick('cows-meat')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                currentTab === 'cows-meat'
                  ? 'bg-emerald-950/60 text-white border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                  : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Beef className={`w-4 h-4 ${currentTab === 'cows-meat' ? 'text-amber-400' : 'text-white/40 group-hover:text-amber-300'}`} />
                <span>Cows (Beef Cattle)</span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-black/40 text-amber-300 border border-white/5">
                {getSectorHeadCount('cows-meat')}
              </span>
            </button>

            {/* Goats Meat */}
            <button
              type="button"
              onClick={() => handleTabClick('goats-meat')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                currentTab === 'goats-meat'
                  ? 'bg-emerald-950/60 text-white border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                  : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Beef className={`w-4 h-4 ${currentTab === 'goats-meat' ? 'text-amber-400' : 'text-white/40 group-hover:text-amber-300'}`} />
                <span>Goats (Meat / Boer)</span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-black/40 text-amber-300 border border-white/5">
                {getSectorHeadCount('goats-meat')}
              </span>
            </button>

            {/* Chicken */}
            <button
              type="button"
              onClick={() => handleTabClick('chicken')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                currentTab === 'chicken'
                  ? 'bg-emerald-950/60 text-white border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                  : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Egg className={`w-4 h-4 ${currentTab === 'chicken' ? 'text-amber-400' : 'text-white/40 group-hover:text-amber-300'}`} />
                <span>Chickens (Broiler / Meat)</span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-black/40 text-amber-300 border border-white/5">
                {getSectorHeadCount('chicken')}
              </span>
            </button>

            {/* Ducks */}
            <button
              type="button"
              onClick={() => handleTabClick('ducks')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                currentTab === 'ducks'
                  ? 'bg-emerald-950/60 text-white border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                  : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Waves className={`w-4 h-4 ${currentTab === 'ducks' ? 'text-sky-400' : 'text-white/40 group-hover:text-sky-300'}`} />
                <span>Ducks (Waterfowl Meat)</span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-black/40 text-sky-300 border border-white/5">
                {getSectorHeadCount('ducks')}
              </span>
            </button>

            {/* Rabbits */}
            <button
              type="button"
              onClick={() => handleTabClick('rabbits')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                currentTab === 'rabbits'
                  ? 'bg-emerald-950/60 text-white border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                  : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Rabbit className={`w-4 h-4 ${currentTab === 'rabbits' ? 'text-amber-400' : 'text-white/40 group-hover:text-amber-300'}`} />
                <span>Rabbits (Cuniculture Meat)</span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-black/40 text-amber-300 border border-white/5">
                {getSectorHeadCount('rabbits')}
              </span>
            </button>
          </div>
        </div>

        {/* Bottom: Operator Profile Card & Lock Terminal */}
        <div className="p-4 border-t border-white/10 bg-black/20 space-y-3">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="w-9 h-9 rounded-lg bg-[#223528] border border-emerald-500/20 flex items-center justify-center font-mono text-xs font-semibold text-emerald-300 shrink-0">
              {operator.avatarInitials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-white truncate">
                {operator.name}
              </div>
              <div className="text-[10px] text-white/50 truncate font-mono">
                {operator.role}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onLockTerminal}
            className="w-full py-2 px-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white text-xs font-medium border border-white/10 flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Lock Terminal</span>
          </button>
        </div>
      </aside>
    </>
  );
};
