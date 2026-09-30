import React, { useState } from 'react';
import { LivestockSector, FarmOperator, DashboardDomain } from '../../types/farm';
import { ThemeToggle } from '../ThemeToggle';
import { useTheme } from '../../context/ThemeContext';
import { sound } from '../../utils/audio';
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
  Sprout,
  ClipboardList,
  ChevronDown,
  ChevronRight,
  Radio,
  Settings,
  Wheat,
  ShieldCheck,
  Layers
} from 'lucide-react';

export type DashboardSectorTab = 
  | 'overview' 
  | 'weather' 
  | 'milking-records' 
  | 'egg-collection'
  | 'iot' 
  | 'settings'
  | 'crops-overview'
  | string; // Dynamic sector IDs

interface LeftSidebarProps {
  currentTab: DashboardSectorTab;
  onSelectTab: (tab: DashboardSectorTab) => void;
  sectors: LivestockSector[];
  operator: FarmOperator;
  onLockTerminal: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  activeDomain: DashboardDomain;
  onChangeDomain: (domain: DashboardDomain) => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  currentTab,
  onSelectTab,
  sectors,
  operator,
  onLockTerminal,
  isOpenMobile,
  onCloseMobile,
  activeDomain,
  onChangeDomain
}) => {
  const { isDark } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  // Dropdown accordions state: ONLY expand when clicked by user!
  const [isDairyOpen, setIsDairyOpen] = useState(false);
  const [isMeatOpen, setIsMeatOpen] = useState(false);

  // Expanded if mobile menu is open OR if hovered on desktop
  const isExpanded = isOpenMobile || isHovered;

  // Filter sectors dynamically into Dairy and Meat
  const dairySectors = sectors.filter(s => s.category === 'dairy');
  const meatSectors = sectors.filter(s => s.category === 'meat');

  const totalDairyHeads = dairySectors.reduce((acc, s) => acc + s.headCount, 0);
  const totalMeatHeads = meatSectors.reduce((acc, s) => acc + s.headCount, 0);

  // Admin / Manager check
  const isAdminOrManager = 
    operator.clearanceLevel === 'Farm Manager' ||
    operator.role.toLowerCase().includes('manager') ||
    operator.role.toLowerCase().includes('admin') ||
    operator.role.toLowerCase().includes('lead');

  const handleTabClick = (tab: DashboardSectorTab) => {
    onSelectTab(tab);
    onCloseMobile();
  };

  const getAnimalIcon = (animalType: string, isDairy: boolean) => {
    const type = animalType.toLowerCase();
    if (type.includes('cow') || type.includes('cattle')) {
      return isDairy ? Milk : Beef;
    }
    if (type.includes('goat')) {
      return isDairy ? Milk : Beef;
    }
    if (type.includes('chicken') || type.includes('poultry')) {
      return Egg;
    }
    if (type.includes('duck')) {
      return Waves;
    }
    if (type.includes('rabbit')) {
      return Rabbit;
    }
    if (type.includes('sheep')) {
      return isDairy ? Milk : Beef;
    }
    return isDairy ? Milk : Beef;
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden animate-fade-in"
        />
      )}

      {/* Sidebar Container */}
      <aside 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col justify-between backdrop-blur-2xl transition-all duration-300 ease-in-out lg:translate-x-0 border-r overflow-x-hidden ${
          isOpenMobile 
            ? 'translate-x-0 w-72 shadow-2xl' 
            : '-translate-x-full lg:translate-x-0'
        } ${
          !isOpenMobile && (isHovered ? 'w-72 shadow-[0_15px_50px_rgba(0,0,0,0.35)]' : 'w-72 lg:w-20 shadow-none')
        } ${
          isDark 
            ? 'bg-[#0E1611]/95 border-white/10 text-white' 
            : 'bg-white/95 border-slate-200 text-slate-900 shadow-lg'
        }`}
      >
        {/* Top: Brand Header */}
        <div className={`p-4 border-b shrink-0 transition-colors ${
          isDark ? 'border-white/10' : 'border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-transform duration-200 ${
                isDark 
                  ? 'bg-[#203627] border border-emerald-500/30 text-emerald-400' 
                  : 'bg-emerald-600 border border-emerald-500 text-white shadow-xs'
              } ${isHovered ? 'scale-105' : ''}`}>
                <Sprout className="w-5 h-5" />
              </div>

              <div className={`min-w-0 transition-all duration-200 ${
                isExpanded 
                  ? 'opacity-100 translate-x-0 w-auto' 
                  : 'opacity-0 -translate-x-3 w-0 hidden lg:hidden'
              }`}>
                <div className={`text-sm font-semibold tracking-tight font-mono whitespace-nowrap leading-none ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  SOLUM FARMOS
                </div>
                <span className={`text-[10px] font-mono tracking-wider mt-1 block whitespace-nowrap ${
                  isDark ? 'text-emerald-400/80' : 'text-emerald-700 font-semibold'
                }`}>
                  INTEGRATED OPERATIONS
                </span>
              </div>
            </div>

            {/* Close button for mobile */}
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

          {/* Dual Dashboard Domain Switcher (Animals vs Crops) */}
          {isExpanded ? (
            <div className={`mt-3 p-1 rounded-2xl border flex items-center text-xs font-mono transition-all animate-fade-in ${
              isDark ? 'bg-black/40 border-white/10' : 'bg-slate-100 border-slate-200'
            }`}>
              <button
                type="button"
                onClick={() => {
                  onChangeDomain('animals');
                  if (currentTab === 'crops-overview') {
                    onSelectTab('overview');
                  }
                }}
                className={`flex-1 py-1.5 px-2 rounded-xl text-center flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeDomain === 'animals'
                    ? isDark
                      ? 'bg-emerald-950/90 text-emerald-300 font-semibold border border-emerald-500/30'
                      : 'bg-white text-emerald-800 font-semibold shadow-xs border border-slate-200'
                    : isDark ? 'text-white/50 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <span>🐄 Animals</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onChangeDomain('crops');
                  onSelectTab('crops-overview');
                }}
                className={`flex-1 py-1.5 px-2 rounded-xl text-center flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeDomain === 'crops'
                    ? isDark
                      ? 'bg-emerald-950/90 text-emerald-300 font-semibold border border-emerald-500/30'
                      : 'bg-white text-emerald-800 font-semibold shadow-xs border border-slate-200'
                    : isDark ? 'text-white/50 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <span>🌾 Crops</span>
              </button>
            </div>
          ) : (
            <div className="mt-2.5 flex justify-center">
              <button
                type="button"
                onClick={() => {
                  const nextDomain = activeDomain === 'animals' ? 'crops' : 'animals';
                  onChangeDomain(nextDomain);
                  onSelectTab(nextDomain === 'crops' ? 'crops-overview' : 'overview');
                }}
                title={`Switch Domain (Currently: ${activeDomain})`}
                className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-transform hover:scale-105 cursor-pointer ${
                  activeDomain === 'crops'
                    ? isDark ? 'bg-amber-950/80 border-amber-500/40 text-amber-300' : 'bg-amber-100 border-amber-300 text-amber-800'
                    : isDark ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300' : 'bg-emerald-100 border-emerald-300 text-emerald-800'
                }`}
              >
                {activeDomain === 'crops' ? <Wheat className="w-4 h-4" /> : <Milk className="w-4 h-4" />}
              </button>
            </div>
          )}
        </div>

        {/* Middle: Navigation Links with Accordion Dropdowns */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-4 py-3">
          {/* 1. General Section */}
          <div className="space-y-1">
            {isExpanded && (
              <span className={`text-[10px] font-mono uppercase tracking-wider px-3 block mb-1.5 whitespace-nowrap ${
                isDark ? 'text-white/40' : 'text-slate-400 font-medium'
              }`}>
                General
              </span>
            )}

            {/* Dashboard Overview */}
            <button
              type="button"
              title="Dashboard Overview"
              onClick={() => handleTabClick('overview')}
              className={`w-full flex items-center ${isExpanded ? 'justify-between px-3' : 'justify-center px-0'} py-2.5 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer ${
                currentTab === 'overview'
                  ? isDark 
                    ? 'bg-emerald-950/60 text-white border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.15)] font-semibold' 
                    : 'bg-emerald-50 text-emerald-900 border border-emerald-300 shadow-2xs font-semibold'
                  : isDark 
                    ? 'text-white/60 hover:text-white hover:bg-white/[0.04]' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <div className={`flex items-center ${isExpanded ? 'gap-2.5' : 'justify-center'}`}>
                <LayoutDashboard className={`w-5 h-5 shrink-0 ${
                  currentTab === 'overview' 
                    ? isDark ? 'text-emerald-400' : 'text-emerald-700' 
                    : isDark ? 'text-white/40' : 'text-slate-400'
                }`} />
                {isExpanded && <span className="whitespace-nowrap">Dashboard Overview</span>}
              </div>
              {isExpanded && (
                <span className={`text-[10px] font-mono ${isDark ? 'text-white/40' : 'text-slate-400'}`}>All</span>
              )}
            </button>

            {/* Crops Dashboard Overview */}
            <button
              type="button"
              title="Crops & Agronomy Operations"
              onClick={() => {
                onChangeDomain('crops');
                handleTabClick('crops-overview');
              }}
              className={`w-full flex items-center ${isExpanded ? 'justify-between px-3' : 'justify-center px-0'} py-2.5 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer ${
                currentTab === 'crops-overview'
                  ? isDark 
                    ? 'bg-emerald-950/60 text-white border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.15)] font-semibold' 
                    : 'bg-emerald-50 text-emerald-900 border border-emerald-300 shadow-2xs font-semibold'
                  : isDark 
                    ? 'text-white/60 hover:text-white hover:bg-white/[0.04]' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <div className={`flex items-center ${isExpanded ? 'gap-2.5' : 'justify-center'}`}>
                <Wheat className={`w-5 h-5 shrink-0 ${
                  currentTab === 'crops-overview' 
                    ? 'text-amber-500' 
                    : isDark ? 'text-white/40' : 'text-slate-400'
                }`} />
                {isExpanded && <span className="whitespace-nowrap">Crops & Agronomy</span>}
              </div>
              {isExpanded && (
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                  isDark ? 'bg-amber-500/20 text-amber-300' : 'bg-amber-100 text-amber-800'
                }`}>
                  5 Fields
                </span>
              )}
            </button>

            {/* Weather & Pastures */}
            <button
              type="button"
              title="Weather & Pastures"
              onClick={() => handleTabClick('weather')}
              className={`w-full flex items-center ${isExpanded ? 'justify-between px-3' : 'justify-center px-0'} py-2.5 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer ${
                currentTab === 'weather'
                  ? isDark 
                    ? 'bg-emerald-950/60 text-white border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.15)] font-semibold' 
                    : 'bg-emerald-50 text-emerald-900 border border-emerald-300 shadow-2xs font-semibold'
                  : isDark 
                    ? 'text-white/60 hover:text-white hover:bg-white/[0.04]' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <div className={`flex items-center ${isExpanded ? 'gap-2.5' : 'justify-center'}`}>
                <CloudSun className={`w-5 h-5 shrink-0 ${
                  currentTab === 'weather' 
                    ? 'text-amber-500' 
                    : isDark ? 'text-white/40' : 'text-slate-400'
                }`} />
                {isExpanded && <span className="whitespace-nowrap">Weather & Pastures</span>}
              </div>
              {isExpanded && (
                <span className={`text-[10px] font-mono ${isDark ? 'text-amber-400/80' : 'text-amber-600 font-semibold'}`}>Live</span>
              )}
            </button>

            {/* IoT Remote Sensors Segment (NEW) */}
            <button
              type="button"
              title="IoT Remote Monitoring Sensors"
              onClick={() => handleTabClick('iot')}
              className={`w-full flex items-center ${isExpanded ? 'justify-between px-3' : 'justify-center px-0'} py-2.5 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer ${
                currentTab === 'iot'
                  ? isDark 
                    ? 'bg-sky-950/80 text-sky-200 border border-sky-500/40 shadow-[0_0_12px_rgba(56,189,248,0.15)] font-semibold' 
                    : 'bg-sky-50 text-sky-900 border border-sky-300 shadow-2xs font-semibold'
                  : isDark 
                    ? 'text-white/60 hover:text-white hover:bg-white/[0.04]' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <div className={`flex items-center ${isExpanded ? 'gap-2.5' : 'justify-center'}`}>
                <Radio className={`w-5 h-5 shrink-0 ${
                  currentTab === 'iot' 
                    ? 'text-sky-400 animate-pulse' 
                    : isDark ? 'text-sky-400/70' : 'text-sky-600'
                }`} />
                {isExpanded && <span className="whitespace-nowrap">IoT Remote Sensors</span>}
              </div>
              {isExpanded && (
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              )}
            </button>
          </div>

          {/* 2. Dairy Animals DROPDOWN ACCORDION - ONLY expands when clicked */}
          <div className="space-y-1">
            {isExpanded ? (
              <button
                type="button"
                onClick={() => {
                  sound.playKeyTap();
                  setIsDairyOpen(prev => !prev);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-colors cursor-pointer group ${
                  isDairyOpen
                    ? isDark ? 'bg-emerald-950/40 text-emerald-300' : 'bg-emerald-50/80 text-emerald-800'
                    : isDark ? 'hover:bg-white/[0.04]' : 'hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-mono uppercase tracking-wider font-semibold ${
                    isDark ? 'text-emerald-400' : 'text-emerald-700'
                  }`}>
                    🥛 Dairy Animals
                  </span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                    isDark ? 'bg-emerald-950/60 border-emerald-500/20 text-emerald-300' : 'bg-emerald-100 border-emerald-300 text-emerald-800'
                  }`}>
                    {totalDairyHeads}
                  </span>
                </div>
                {isDairyOpen ? (
                  <ChevronDown className="w-3.5 h-3.5 text-emerald-500 transition-transform duration-200" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-transform duration-200" />
                )}
              </button>
            ) : (
              <button
                type="button"
                title="Expand Dairy Animals"
                onClick={() => {
                  sound.playKeyTap();
                  setIsDairyOpen(true);
                  setIsHovered(true);
                }}
                className={`w-full flex justify-center py-2 rounded-xl transition-colors cursor-pointer ${
                  isDairyOpen 
                    ? isDark ? 'bg-emerald-950/60 text-emerald-400' : 'bg-emerald-100 text-emerald-800'
                    : isDark ? 'text-white/40 hover:text-white' : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                <Milk className="w-4 h-4" />
              </button>
            )}

            {/* Dairy Sector Items: ONLY rendered when isDairyOpen is true! */}
            {isDairyOpen && (
              <div className="space-y-0.5 animate-fade-in pl-1.5 border-l-2 border-emerald-500/30 ml-2">
                {dairySectors.map((sec) => {
                  const Icon = getAnimalIcon(sec.animalType, true);
                  const isSelected = currentTab === sec.id;
                  return (
                    <button
                      key={sec.id}
                      type="button"
                      title={sec.name}
                      onClick={() => handleTabClick(sec.id)}
                      className={`w-full flex items-center ${isExpanded ? 'justify-between px-3' : 'justify-center px-0'} py-2 rounded-xl text-xs font-medium transition-all duration-150 group cursor-pointer ${
                        isSelected
                          ? isDark 
                            ? 'bg-emerald-950/60 text-white border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.15)] font-semibold' 
                            : 'bg-emerald-50 text-emerald-900 border border-emerald-300 shadow-2xs font-semibold'
                          : isDark 
                            ? 'text-white/60 hover:text-white hover:bg-white/[0.04]' 
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                      }`}
                    >
                      <div className={`flex items-center ${isExpanded ? 'gap-2.5' : 'justify-center'}`}>
                        <Icon className={`w-4 h-4 shrink-0 ${
                          isSelected 
                            ? isDark ? 'text-emerald-400' : 'text-emerald-700' 
                            : isDark ? 'text-white/40 group-hover:text-emerald-300' : 'text-slate-400 group-hover:text-emerald-700'
                        }`} />
                        {isExpanded && <span className="whitespace-nowrap truncate">{sec.name}</span>}
                      </div>
                      {isExpanded && (
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                          isDark 
                            ? 'bg-black/40 text-emerald-300 border-white/5' 
                            : 'bg-slate-100 text-emerald-800 border-slate-200'
                        }`}>
                          {sec.headCount}
                        </span>
                      )}
                    </button>
                  );
                })}

                {/* Milking Records */}
                <button
                  type="button"
                  title="Milking Records & Log"
                  onClick={() => handleTabClick('milking-records')}
                  className={`w-full flex items-center ${isExpanded ? 'justify-between px-3' : 'justify-center px-0'} py-2 rounded-xl text-xs font-medium transition-all duration-150 group cursor-pointer ${
                    currentTab === 'milking-records'
                      ? isDark 
                        ? 'bg-emerald-950/60 text-white border border-emerald-500/40 font-semibold' 
                        : 'bg-emerald-50 text-emerald-900 border border-emerald-300 font-semibold'
                      : isDark 
                        ? 'text-white/60 hover:text-white hover:bg-white/[0.04]' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <div className={`flex items-center ${isExpanded ? 'gap-2.5' : 'justify-center'}`}>
                    <ClipboardList className={`w-4 h-4 shrink-0 ${
                      currentTab === 'milking-records' 
                        ? 'text-emerald-400' 
                        : isDark ? 'text-white/40' : 'text-slate-400'
                    }`} />
                    {isExpanded && <span className="whitespace-nowrap">Milking Records & Log</span>}
                  </div>
                  {isExpanded && (
                    <span className="text-[10px] font-mono font-semibold text-emerald-500">Daily</span>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* 3. Meat Animals DROPDOWN ACCORDION - ONLY expands when clicked */}
          <div className="space-y-1">
            {isExpanded ? (
              <button
                type="button"
                onClick={() => {
                  sound.playKeyTap();
                  setIsMeatOpen(prev => !prev);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-colors cursor-pointer group ${
                  isMeatOpen
                    ? isDark ? 'bg-amber-950/40 text-amber-300' : 'bg-amber-50/80 text-amber-800'
                    : isDark ? 'hover:bg-white/[0.04]' : 'hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-mono uppercase tracking-wider font-semibold ${
                    isDark ? 'text-amber-400' : 'text-amber-700'
                  }`}>
                    🥩 Meat Animals
                  </span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                    isDark ? 'bg-amber-950/60 border-amber-500/20 text-amber-300' : 'bg-amber-100 border-amber-300 text-amber-800'
                  }`}>
                    {totalMeatHeads}
                  </span>
                </div>
                {isMeatOpen ? (
                  <ChevronDown className="w-3.5 h-3.5 text-amber-500 transition-transform duration-200" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-transform duration-200" />
                )}
              </button>
            ) : (
              <button
                type="button"
                title="Expand Meat Animals"
                onClick={() => {
                  sound.playKeyTap();
                  setIsMeatOpen(true);
                  setIsHovered(true);
                }}
                className={`w-full flex justify-center py-2 rounded-xl transition-colors cursor-pointer ${
                  isMeatOpen 
                    ? isDark ? 'bg-amber-950/60 text-amber-400' : 'bg-amber-100 text-amber-800'
                    : isDark ? 'text-white/40 hover:text-white' : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                <Beef className="w-4 h-4" />
              </button>
            )}

            {/* Meat Sector Items: ONLY rendered when isMeatOpen is true! */}
            {isMeatOpen && (
              <div className="space-y-0.5 animate-fade-in pl-1.5 border-l-2 border-amber-500/30 ml-2">
                {meatSectors.map((sec) => {
                  const Icon = getAnimalIcon(sec.animalType, false);
                  const isSelected = currentTab === sec.id;
                  return (
                    <button
                      key={sec.id}
                      type="button"
                      title={sec.name}
                      onClick={() => handleTabClick(sec.id)}
                      className={`w-full flex items-center ${isExpanded ? 'justify-between px-3' : 'justify-center px-0'} py-2 rounded-xl text-xs font-medium transition-all duration-150 group cursor-pointer ${
                        isSelected
                          ? isDark 
                            ? 'bg-emerald-950/60 text-white border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.15)] font-semibold' 
                            : 'bg-emerald-50 text-emerald-900 border border-emerald-300 shadow-2xs font-semibold'
                          : isDark 
                            ? 'text-white/60 hover:text-white hover:bg-white/[0.04]' 
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                      }`}
                    >
                      <div className={`flex items-center ${isExpanded ? 'gap-2.5' : 'justify-center'}`}>
                        <Icon className={`w-4 h-4 shrink-0 ${
                          isSelected 
                            ? 'text-amber-500' 
                            : isDark ? 'text-white/40 group-hover:text-amber-300' : 'text-slate-400 group-hover:text-amber-700'
                        }`} />
                        {isExpanded && <span className="whitespace-nowrap truncate">{sec.name}</span>}
                      </div>
                      {isExpanded && (
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                          isDark 
                            ? 'bg-black/40 text-amber-300 border-white/5' 
                            : 'bg-slate-100 text-amber-800 border-slate-200'
                        }`}>
                          {sec.headCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 4. Egg Collection Segment (Directly below Meat Animals as requested!) */}
          <div className="space-y-1">
            <button
              type="button"
              title="Egg Collection (Chickens & Ducks)"
              onClick={() => handleTabClick('egg-collection')}
              className={`w-full flex items-center ${isExpanded ? 'justify-between px-3' : 'justify-center px-0'} py-2.5 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer ${
                currentTab === 'egg-collection'
                  ? isDark 
                    ? 'bg-amber-950/80 text-amber-200 border border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.15)] font-semibold' 
                    : 'bg-amber-50 text-amber-900 border border-amber-300 shadow-2xs font-semibold'
                  : isDark 
                    ? 'text-white/60 hover:text-white hover:bg-white/[0.04]' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <div className={`flex items-center ${isExpanded ? 'gap-2.5' : 'justify-center'}`}>
                <Egg className={`w-5 h-5 shrink-0 ${
                  currentTab === 'egg-collection' 
                    ? 'text-amber-400' 
                    : isDark ? 'text-amber-400/80' : 'text-amber-600'
                }`} />
                {isExpanded && <span className="whitespace-nowrap font-medium">Egg Collection</span>}
              </div>
              {isExpanded && (
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                  isDark ? 'bg-amber-500/20 text-amber-300' : 'bg-amber-100 text-amber-800'
                }`}>
                  🐔 🦆 Harvest
                </span>
              )}
            </button>
          </div>

          {/* 4. Administration & Settings Tab (Visible/Restricted to Farm Manager & Admin) */}
          <div className="space-y-1 pt-1">
            {isExpanded && (
              <span className={`text-[10px] font-mono uppercase tracking-wider px-3 block mb-1 whitespace-nowrap ${
                isDark ? 'text-white/40' : 'text-slate-400 font-medium'
              }`}>
                Management
              </span>
            )}
            <button
              type="button"
              title="Settings & Admin Portal"
              onClick={() => handleTabClick('settings')}
              className={`w-full flex items-center ${isExpanded ? 'justify-between px-3' : 'justify-center px-0'} py-2.5 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer ${
                currentTab === 'settings'
                  ? isDark 
                    ? 'bg-purple-950/80 text-purple-200 border border-purple-500/40 shadow-[0_0_12px_rgba(168,85,247,0.15)] font-semibold' 
                    : 'bg-purple-50 text-purple-900 border border-purple-300 shadow-2xs font-semibold'
                  : isDark 
                    ? 'text-white/60 hover:text-white hover:bg-white/[0.04]' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <div className={`flex items-center ${isExpanded ? 'gap-2.5' : 'justify-center'}`}>
                <Settings className={`w-5 h-5 shrink-0 ${
                  currentTab === 'settings' 
                    ? 'text-purple-400' 
                    : isDark ? 'text-purple-400/80' : 'text-purple-600'
                }`} />
                {isExpanded && <span className="whitespace-nowrap">Settings & Admin</span>}
              </div>
              {isExpanded && (
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                  isAdminOrManager
                    ? isDark ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-800'
                    : isDark ? 'bg-white/10 text-white/50' : 'bg-slate-200 text-slate-500'
                }`}>
                  {isAdminOrManager ? 'Admin' : 'Lock'}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Bottom: Theme Mode Switcher & Operator Profile Card */}
        <div className={`p-3 border-t space-y-2.5 shrink-0 ${
          isDark ? 'border-white/10 bg-black/20' : 'border-slate-200 bg-slate-50/80'
        }`}>
          {/* Theme switcher */}
          <div className="w-full flex justify-center">
            {isExpanded ? (
              <ThemeToggle variant="expanded" />
            ) : (
              <ThemeToggle variant="icon" />
            )}
          </div>

          {/* Operator profile */}
          <div 
            title={`${operator.name} · ${operator.role} (${operator.clearanceLevel})`}
            className={`flex items-center ${isExpanded ? 'gap-3 p-2' : 'justify-center p-1'} rounded-xl border transition-all ${
              isDark ? 'bg-white/[0.03] border-white/5' : 'bg-white border-slate-200 shadow-2xs'
            }`}
          >
            <div className={`w-9 h-9 rounded-lg border flex items-center justify-center font-mono text-xs font-semibold shrink-0 ${
              isDark 
                ? 'bg-[#223528] border-emerald-500/20 text-emerald-300' 
                : 'bg-emerald-100 border-emerald-300 text-emerald-800'
            }`}>
              {operator.avatarInitials}
            </div>
            {isExpanded && (
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
            )}
          </div>

          {/* Lock terminal button */}
          <button
            type="button"
            title="Lock Terminal"
            onClick={onLockTerminal}
            className={`w-full py-2 ${isExpanded ? 'px-3' : 'px-0'} rounded-xl text-xs font-medium border flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer ${
              isDark 
                ? 'bg-white/[0.06] hover:bg-white/[0.12] text-white border-white/10' 
                : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-2xs'
            }`}
          >
            <Lock className={`w-4 h-4 shrink-0 ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`} />
            {isExpanded && <span className="whitespace-nowrap">Lock Terminal</span>}
          </button>
        </div>
      </aside>
    </>
  );
};
