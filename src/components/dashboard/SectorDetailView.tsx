import React, { useState } from 'react';
import { LivestockSector, FarmOperator, IndividualAnimal, AnimalPhysiologicalStatus, MilkingRecord } from '../../types/farm';
import { AddAnimalModal } from './AddAnimalModal';
import { AnimalProfileModal } from './AnimalProfileModal';
import { SectorTelemetryModal, SectorModalTileType } from './SectorTelemetryModal';
import { AddMilkingRecordModal } from './AddMilkingRecordModal';
import { 
  Milk, 
  Beef, 
  Egg, 
  Waves, 
  Rabbit, 
  Plus, 
  Minus, 
  CheckCircle2, 
  AlertCircle, 
  Droplets, 
  Thermometer, 
  Wheat, 
  Clock, 
  Calendar, 
  ShieldCheck, 
  Activity, 
  ArrowRight, 
  Search, 
  Tag, 
  Filter, 
  Trash2, 
  Sparkles, 
  Heart, 
  ChevronDown,
  Info
} from 'lucide-react';
import { sound } from '../../utils/audio';

interface SectorDetailViewProps {
  sector: LivestockSector;
  operator: FarmOperator;
  onUpdateHeadCount: (delta: number) => void;
  onLogActivity: (action: string) => void;
  onAddAnimal: (animal: IndividualAnimal) => void;
  onUpdateAnimalStatus: (animalId: string, newStatus: AnimalPhysiologicalStatus) => void;
  onRemoveAnimal: (animalId: string, reason: string) => void;
  onAddMilkingRecord?: (record: MilkingRecord) => void;
  allSectors?: LivestockSector[];
}

export const SectorDetailView: React.FC<SectorDetailViewProps> = ({
  sector,
  operator,
  onUpdateHeadCount,
  onLogActivity,
  onAddAnimal,
  onUpdateAnimalStatus,
  onRemoveAnimal,
  onAddMilkingRecord,
  allSectors
}) => {
  const [showLogModal, setShowLogModal] = useState(false);
  const [showAddAnimalModal, setShowAddAnimalModal] = useState(false);
  const [selectedAnimalForProfile, setSelectedAnimalForProfile] = useState<IndividualAnimal | null>(null);
  const [telemetryModalType, setTelemetryModalType] = useState<SectorModalTileType>(null);
  const [selectedAlertText, setSelectedAlertText] = useState<string | null>(null);
  const [isMilkingModalOpen, setIsMilkingModalOpen] = useState(false);
  const [milkingAnimalId, setMilkingAnimalId] = useState<string | undefined>(undefined);

  const [logActionText, setLogActionText] = useState('');
  const [feedKg, setFeedKg] = useState(sector.feedInventoryKg);
  const [waterL, setWaterL] = useState(sector.waterConsumptionL);

  // Animal Roster filter & search
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusMenuOpenForId, setStatusMenuOpenForId] = useState<string | null>(null);

  const isDairy = sector.category === 'dairy';

  const getAnimalIcon = () => {
    switch (sector.animalType) {
      case 'cows':
        return isDairy ? <Milk className="w-6 h-6 text-emerald-400" /> : <Beef className="w-6 h-6 text-amber-400" />;
      case 'goats':
        return isDairy ? <Milk className="w-6 h-6 text-emerald-400" /> : <Beef className="w-6 h-6 text-amber-400" />;
      case 'chicken':
        return <Egg className="w-6 h-6 text-amber-400" />;
      case 'ducks':
        return <Waves className="w-6 h-6 text-sky-400" />;
      case 'rabbits':
        return <Rabbit className="w-6 h-6 text-amber-400" />;
      default:
        return <Activity className="w-6 h-6 text-emerald-400" />;
    }
  };

  const handleHeadCountChange = (delta: number) => {
    sound.playKeyTap();
    onUpdateHeadCount(delta);
    const actionDesc = delta > 0 
      ? `Added ${delta} animal(s) to ${sector.name} inventory` 
      : `Deducted ${Math.abs(delta)} animal(s) (transfer/processed) from ${sector.name}`;
    onLogActivity(actionDesc);
  };

  const handleCustomActionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logActionText.trim()) return;
    sound.playSuccess();
    onLogActivity(logActionText.trim());
    setLogActionText('');
    setShowLogModal(false);
  };

  const handleQuickLog = (presetText: string) => {
    sound.playSuccess();
    onLogActivity(presetText);
  };

  const animals = sector.animals || [];

  // Filter categories options
  const filterCategories = ['All'];
  if (isDairy) {
    filterCategories.push('Milking', 'Dried', 'Expecting', 'Heifer / Kid');
  } else if (sector.animalType === 'chicken' || sector.animalType === 'ducks') {
    filterCategories.push('Broiler', 'Layer', 'Grower', 'Breeder');
  } else {
    filterCategories.push('Finishing / Market Ready', 'Growing / Pasture', 'Breeding Stock', 'Expecting', 'Nursery');
  }

  // Filtered animals list
  const filteredAnimals = animals.filter(animal => {
    const matchesCategory = categoryFilter === 'All' || animal.categoryStatus.toLowerCase().includes(categoryFilter.toLowerCase());
    const matchesSearch = 
      animal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      animal.tagNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      animal.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
      animal.penOrPasture.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getStatusBadgeStyle = (status: string) => {
    const lower = status.toLowerCase();
    if (lower.includes('milking')) {
      return 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300';
    }
    if (lower.includes('expecting')) {
      return 'bg-purple-950/60 border-purple-500/40 text-purple-300';
    }
    if (lower.includes('dried')) {
      return 'bg-zinc-800/80 border-zinc-600/40 text-zinc-300';
    }
    if (lower.includes('finishing') || lower.includes('market')) {
      return 'bg-amber-950/60 border-amber-500/40 text-amber-300';
    }
    if (lower.includes('breeding')) {
      return 'bg-sky-950/60 border-sky-500/40 text-sky-300';
    }
    return 'bg-white/[0.06] border-white/10 text-white/70';
  };

  const availableStatusOptions: AnimalPhysiologicalStatus[] = isDairy
    ? ['Milking', 'Dried', 'Expecting', 'Heifer / Kid', 'Under Treatment']
    : sector.animalType === 'chicken' || sector.animalType === 'ducks'
    ? ['Broiler', 'Layer', 'Grower', 'Breeder']
    : ['Growing / Pasture', 'Finishing / Market Ready', 'Breeding Stock', 'Expecting', 'Nursery'];

  return (
    <div className="space-y-7">
      {/* Sector Hero Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-[#131E17]/90 border border-white/10 backdrop-blur-xl shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start md:items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#1E2E23] border border-white/10 flex items-center justify-center shrink-0">
              {getAnimalIcon()}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                  {sector.name}
                </h1>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase tracking-wider ${
                  isDairy
                    ? 'bg-emerald-950/50 border-emerald-500/30 text-emerald-300'
                    : 'bg-amber-950/50 border-amber-500/30 text-amber-300'
                }`}>
                  {isDairy ? 'Dairy Production' : 'Meat Purpose'}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.05] border border-white/10 text-white/60">
                  {sector.healthStatus} Status
                </span>
              </div>
              <p className="text-xs text-white/60">
                {sector.location} <span className="text-white/30">·</span> {sector.pastureOrPen}
              </p>
            </div>
          </div>

          {/* Header Action Buttons: Add Animal & Log Event */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2 md:pt-0">
            {isDairy && onAddMilkingRecord && (
              <button
                type="button"
                onClick={() => {
                  sound.playKeyTap();
                  setMilkingAnimalId(undefined);
                  setIsMilkingModalOpen(true);
                }}
                className="px-3.5 py-2.5 text-xs font-semibold bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 rounded-xl transition-all shadow-sm flex items-center gap-1.5 active:scale-95"
              >
                <Milk className="w-4 h-4 text-emerald-400" />
                <span>+ Key In Milking</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                sound.playKeyTap();
                setShowAddAnimalModal(true);
              }}
              className="px-4 py-2.5 text-xs font-semibold bg-[#376343] hover:bg-[#437752] text-white rounded-xl transition-all shadow-md flex items-center gap-1.5 active:scale-95"
            >
              <Plus className="w-4 h-4 text-emerald-300" />
              <span>+ Add Animal to Herd</span>
            </button>

            <button
              type="button"
              onClick={() => setShowLogModal(true)}
              className="px-3.5 py-2.5 text-xs font-medium bg-white/[0.04] hover:bg-white/[0.09] text-white/80 hover:text-white rounded-xl border border-white/10 transition-all flex items-center gap-1.5"
            >
              <Activity className="w-3.5 h-3.5 text-white/50" />
              <span>Log Event</span>
            </button>
          </div>
        </div>

        {/* 4 Clickable Metric Tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10">
          {/* Tile 1: Head Count with +/- adjusters */}
          <div 
            onClick={() => {
              sound.playKeyTap();
              setTelemetryModalType('headCount');
            }}
            className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-emerald-500/30 transition-all flex flex-col justify-between cursor-pointer group"
          >
            <div className="flex items-center justify-between text-xs font-mono text-white/40 uppercase tracking-wider group-hover:text-emerald-300">
              <span>Total Head Count</span>
              <Info className="w-3.5 h-3.5 text-white/30 group-hover:text-emerald-400" />
            </div>
            <div className="my-2 flex items-center justify-between">
              <span className="font-mono text-3xl font-light text-white tabular-nums">
                {sector.headCount}
              </span>
              <div 
                onClick={(e) => e.stopPropagation()} 
                className="flex items-center gap-1 bg-black/40 border border-white/10 rounded-xl p-1"
              >
                <button
                  type="button"
                  onClick={() => handleHeadCountChange(-1)}
                  className="p-1 hover:bg-white/10 text-white/60 hover:text-white rounded-lg transition-colors"
                  title="Subtract 1 animal"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleHeadCountChange(1)}
                  className="p-1 hover:bg-white/10 text-white/60 hover:text-white rounded-lg transition-colors"
                  title="Add 1 animal"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <span className="text-[11px] text-emerald-400/80 font-mono group-hover:underline">
              {animals.length} Profiles · Inspect Census →
            </span>
          </div>

          {/* Tile 2: Primary Output */}
          <div 
            onClick={() => {
              sound.playKeyTap();
              setTelemetryModalType('output');
            }}
            className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-emerald-500/30 transition-all flex flex-col justify-between cursor-pointer group"
          >
            <div className="flex items-center justify-between text-xs font-mono text-white/40 uppercase tracking-wider truncate group-hover:text-emerald-300">
              <span className="truncate">{sector.dailyOutput.metricName}</span>
              <Info className="w-3.5 h-3.5 text-white/30 group-hover:text-emerald-400 shrink-0" />
            </div>
            <div className="my-2">
              <span className="font-mono text-2xl font-light text-white tracking-tight">
                {sector.dailyOutput.metricValue}
              </span>
            </div>
            <span className="text-[11px] text-emerald-400/80 truncate font-mono group-hover:underline">
              {sector.dailyOutput.efficiency} →
            </span>
          </div>

          {/* Tile 3: Feed Inventory & Water */}
          <div 
            onClick={() => {
              sound.playKeyTap();
              setTelemetryModalType('feedWater');
            }}
            className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-emerald-500/30 transition-all flex flex-col justify-between cursor-pointer group"
          >
            <div className="flex items-center justify-between text-xs font-mono text-white/40 uppercase tracking-wider group-hover:text-sky-300">
              <span>Feed & Water Telemetry</span>
              <Info className="w-3.5 h-3.5 text-white/30 group-hover:text-sky-400" />
            </div>
            <div className="my-2 font-mono text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-white/60 flex items-center gap-1">
                  <Wheat className="w-3.5 h-3.5 text-amber-300" /> Ration:
                </span>
                <span className="text-white font-medium">{feedKg.toLocaleString()} kg</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60 flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5 text-sky-400" /> Intake:
                </span>
                <span className="text-white font-medium">{waterL.toLocaleString()} L/day</span>
              </div>
            </div>
            <span className="text-[10px] text-emerald-400/80 font-mono group-hover:underline">
              Adequate for 14 days · View Rations →
            </span>
          </div>

          {/* Tile 4: Housing Climate */}
          <div 
            onClick={() => {
              sound.playKeyTap();
              setTelemetryModalType('climate');
            }}
            className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-emerald-500/30 transition-all flex flex-col justify-between cursor-pointer group"
          >
            <div className="flex items-center justify-between text-xs font-mono text-white/40 uppercase tracking-wider group-hover:text-amber-300">
              <span>Housing Environment</span>
              <Info className="w-3.5 h-3.5 text-white/30 group-hover:text-amber-400" />
            </div>
            <div className="my-2 flex items-center gap-2">
              <Thermometer className="w-5 h-5 text-amber-400" />
              <span className="font-mono text-3xl font-light text-white">
                {sector.housingTemp}°F
              </span>
            </div>
            <span className="text-[11px] text-emerald-400/80 font-mono group-hover:underline">
              Ventilation Automated · Check Probes →
            </span>
          </div>
        </div>
      </div>

      {/* ANIMAL HERD ROSTER & REGISTRY SECTION */}
      <div className="p-6 md:p-7 rounded-3xl bg-[#131E17]/90 border border-white/10 backdrop-blur-xl shadow-xl space-y-5">
        {/* Registry Header & Quick Add */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-white">
                Individual Herd & Flock Roster
              </h2>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/20 text-emerald-300">
                {animals.length} Registered
              </span>
            </div>
            <p className="text-xs text-white/50 mt-0.5">
              Click any animal card to view their complete dossier, pedigree, health records, or transfer status.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              sound.playKeyTap();
              setShowAddAnimalModal(true);
            }}
            className="self-start sm:self-auto px-3.5 py-2 text-xs font-semibold bg-[#376343] hover:bg-[#437752] text-white rounded-xl transition-all shadow-sm flex items-center gap-1.5 active:scale-95 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Animal</span>
          </button>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {filterCategories.map((cat) => {
              const isSelected = categoryFilter === cat;
              const count = cat === 'All' 
                ? animals.length 
                : animals.filter(a => a.categoryStatus.toLowerCase().includes(cat.toLowerCase())).length;

              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    sound.playKeyTap();
                    setCategoryFilter(cat);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-emerald-950/80 text-emerald-200 border border-emerald-500/40 shadow-sm'
                      : 'bg-white/[0.03] text-white/60 hover:text-white border border-white/5 hover:bg-white/[0.06]'
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                    isSelected ? 'bg-emerald-900/60 text-emerald-300' : 'bg-black/30 text-white/40'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tag #, name, breed..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-black/40 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-400"
            />
          </div>
        </div>

        {/* Clickable Animal Cards */}
        {filteredAnimals.length === 0 ? (
          <div className="py-12 text-center rounded-2xl border border-dashed border-white/10 p-6 space-y-3">
            <Tag className="w-8 h-8 text-white/20 mx-auto" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-white/70">
                No animals match this filter in {sector.name}
              </p>
              <p className="text-xs text-white/40">
                {searchQuery 
                  ? `No records found matching "${searchQuery}".` 
                  : `No animals registered under "${categoryFilter}" status.`}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                sound.playKeyTap();
                setShowAddAnimalModal(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-[#376343] hover:bg-[#437752] text-white rounded-xl transition-all shadow-md"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Register Animal to Herd</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredAnimals.map((animal) => {
              const isMenuOpen = statusMenuOpenForId === animal.id;

              return (
                <div
                  key={animal.id}
                  onClick={() => {
                    sound.playKeyTap();
                    setSelectedAnimalForProfile(animal);
                  }}
                  className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/40 hover:bg-white/[0.05] transition-all space-y-3 relative group cursor-pointer shadow-sm active:scale-[0.99]"
                >
                  {/* Top Bar: Name, Tag #, and Status Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-[#1E2E23] border border-emerald-500/20 flex items-center justify-center text-xs font-mono font-bold text-emerald-300 group-hover:scale-105 transition-transform">
                        {animal.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors">
                            {animal.name}
                          </h3>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 border border-white/10 text-emerald-400 font-medium">
                            {animal.tagNumber}
                          </span>
                        </div>
                        <div className="text-xs text-white/50 flex items-center gap-1.5 mt-0.5">
                          <span>{animal.breed}</span>
                          <span aria-hidden="true">·</span>
                          <span>{animal.gender}</span>
                          <span aria-hidden="true">·</span>
                          <span className="text-white/40">{animal.age}</span>
                        </div>
                      </div>
                    </div>

                    {/* Status Pill with Dropdown Trigger */}
                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => setStatusMenuOpenForId(isMenuOpen ? null : animal.id)}
                        className={`text-[11px] font-mono px-2.5 py-1 rounded-lg border flex items-center gap-1 transition-all ${getStatusBadgeStyle(animal.categoryStatus)}`}
                        title="Click to update status"
                      >
                        <span>{animal.categoryStatus}</span>
                        <ChevronDown className="w-3 h-3 opacity-60" />
                      </button>

                      {/* Status Change Dropdown Menu */}
                      {isMenuOpen && (
                        <div className="absolute right-0 top-full mt-1.5 z-20 w-44 rounded-xl bg-[#16221A] border border-white/10 shadow-xl py-1 text-xs font-mono">
                          <div className="px-3 py-1 text-[10px] text-white/40 uppercase tracking-wider border-b border-white/5">
                            Set Status
                          </div>
                          {availableStatusOptions.map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => {
                                sound.playKeyTap();
                                onUpdateAnimalStatus(animal.id, opt);
                                setStatusMenuOpenForId(null);
                              }}
                              className={`w-full text-left px-3 py-1.5 text-xs hover:bg-white/10 transition-colors flex items-center justify-between ${
                                animal.categoryStatus === opt ? 'text-emerald-300 font-semibold' : 'text-white/70'
                              }`}
                            >
                              <span>{opt}</span>
                              {animal.categoryStatus === opt && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Animal Details Grid */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5 text-xs font-mono">
                    <div>
                      <span className="text-white/40 block text-[10px]">Location</span>
                      <span className="text-white truncate block text-[11px]">{animal.penOrPasture}</span>
                    </div>

                    <div>
                      <span className="text-white/40 block text-[10px]">Weight</span>
                      <span className="text-white block text-[11px]">
                        {animal.weightKg ? `${animal.weightKg} kg` : 'Not recorded'}
                      </span>
                    </div>

                    <div>
                      <span className="text-white/40 block text-[10px]">
                        {animal.lastMilkingYieldL !== undefined ? 'Daily Yield' : 'Health'}
                      </span>
                      <span className={`block text-[11px] ${
                        animal.lastMilkingYieldL !== undefined ? 'text-emerald-300 font-semibold' : 'text-emerald-400'
                      }`}>
                        {animal.lastMilkingYieldL !== undefined ? `${animal.lastMilkingYieldL} L/day` : animal.healthStatus}
                      </span>
                    </div>
                  </div>

                  {/* Card Bottom: Click to inspect info + delete option */}
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400/90 group-hover:underline flex items-center gap-1 font-mono text-[10px]">
                        <span>Dossier</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>

                      {isDairy && animal.categoryStatus === 'Milking' && onAddMilkingRecord && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            sound.playKeyTap();
                            setMilkingAnimalId(animal.id);
                            setIsMilkingModalOpen(true);
                          }}
                          className="px-2 py-0.5 rounded bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono flex items-center gap-1 transition-colors"
                          title="Key in morning/evening milk harvest for this animal"
                        >
                          <Droplets className="w-3 h-3 text-emerald-400" />
                          <span>+ Log Milk</span>
                        </button>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        sound.playBackspace();
                        onRemoveAnimal(animal.id, 'Operator transfer');
                      }}
                      className="text-white/20 hover:text-red-400 p-1 rounded transition-colors"
                      title="Transfer / Remove Animal"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Action Presets Bar */}
      <div className="p-4 rounded-2xl bg-[#131E17]/60 border border-white/10 backdrop-blur-md">
        <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 block mb-2.5">
          Quick Operator Actions for {sector.name}
        </span>
        <div className="flex flex-wrap gap-2">
          {isDairy ? (
            <>
              <button
                type="button"
                onClick={() => handleQuickLog(`Recorded Milking Run: Parlour batch sanitized & chilled`)}
                className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-emerald-950/40 border border-white/10 hover:border-emerald-500/30 text-xs font-mono text-white/80 hover:text-emerald-300 transition-colors"
              >
                + Record Milk Harvest Run
              </button>
              <button
                type="button"
                onClick={() => handleQuickLog(`TMR Dairy feed ration delivered to feed bunks`)}
                className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-emerald-950/40 border border-white/10 hover:border-emerald-500/30 text-xs font-mono text-white/80 hover:text-emerald-300 transition-colors"
              >
                + Restock Alfalfa & Grain
              </button>
              <button
                type="button"
                onClick={() => handleQuickLog(`Rotated herd to clean grazing sector`)}
                className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-emerald-950/40 border border-white/10 hover:border-emerald-500/30 text-xs font-mono text-white/80 hover:text-emerald-300 transition-colors"
              >
                + Shift Pasture Paddock
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => handleQuickLog(`Batch weigh-in completed: target gain on track`)}
                className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-amber-950/40 border border-white/10 hover:border-amber-500/30 text-xs font-mono text-white/80 hover:text-amber-300 transition-colors"
              >
                + Log Batch Weigh-In
              </button>
              <button
                type="button"
                onClick={() => handleQuickLog(`High-protein forage & organic grain ration supplied`)}
                className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-amber-950/40 border border-white/10 hover:border-amber-500/30 text-xs font-mono text-white/80 hover:text-amber-300 transition-colors"
              >
                + Distribute Daily Feed
              </button>
              <button
                type="button"
                onClick={() => handleQuickLog(`Health check & bedding refresh completed`)}
                className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-amber-950/40 border border-white/10 hover:border-amber-500/30 text-xs font-mono text-white/80 hover:text-amber-300 transition-colors"
              >
                + Log Health & Bedding Check
              </button>
            </>
          )}
        </div>
      </div>

      {/* Grid: Alerts & Recent Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sector Alerts & Protocols (1 col) - Clickable Alerts */}
        <div className="p-6 rounded-3xl bg-[#131E17]/80 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">
              Active Sector Alerts
            </h3>
            <span className="text-[10px] font-mono text-emerald-400">
              {sector.alerts.length} Active
            </span>
          </div>

          <div className="space-y-2.5">
            {sector.alerts.map((alert, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  sound.playKeyTap();
                  setSelectedAlertText(alert);
                  setTelemetryModalType('alert');
                }}
                className="w-full text-left p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-emerald-500/30 text-xs flex items-start gap-2.5 transition-all group cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <span className="text-white/80 leading-relaxed group-hover:text-white flex-1">{alert}</span>
              </button>
            ))}
          </div>

          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1.5 text-xs font-mono">
            <span className="text-white/40 block text-[10px] uppercase">
              Veterinary Protocol
            </span>
            <div className="flex justify-between text-white/70">
              <span>Vaccination Due</span>
              <span className="text-white">Oct 18, 2026</span>
            </div>
            <div className="flex justify-between text-white/70">
              <span>Deworming Status</span>
              <span className="text-emerald-400">Compliant</span>
            </div>
          </div>
        </div>

        {/* Activity & Shift Logs Table (2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#131E17]/80 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">
                Sector Activity & Operational Logs
              </h3>
              <p className="text-xs text-white/50 mt-0.5">
                Timestamped feed, animal registration, and yield entries for this sector.
              </p>
            </div>
            <span className="text-xs font-mono text-white/40">
              {sector.recentLogs.length} Records
            </span>
          </div>

          <div className="space-y-2 pt-1">
            {sector.recentLogs.map((log) => (
              <div 
                key={log.id}
                className="p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="font-medium text-white">
                    {log.action}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-white/50 font-mono text-[11px] pl-4 sm:pl-0">
                  <span>{log.operator}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-emerald-300/80">{log.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Animal Modal */}
      <AddAnimalModal
        isOpen={showAddAnimalModal}
        onClose={() => setShowAddAnimalModal(false)}
        sector={sector}
        onSave={(animal) => {
          onAddAnimal(animal);
        }}
      />

      {/* Animal Dossier / Profile Modal when clicking any animal card */}
      <AnimalProfileModal
        animal={selectedAnimalForProfile}
        sector={sector}
        isOpen={!!selectedAnimalForProfile}
        onClose={() => setSelectedAnimalForProfile(null)}
        onUpdateStatus={(animalId, newStatus) => {
          onUpdateAnimalStatus(animalId, newStatus);
          if (selectedAnimalForProfile && selectedAnimalForProfile.id === animalId) {
            setSelectedAnimalForProfile({ ...selectedAnimalForProfile, categoryStatus: newStatus });
          }
        }}
        onRemove={(animalId, reason) => {
          onRemoveAnimal(animalId, reason);
          setSelectedAnimalForProfile(null);
        }}
      />

      {/* Telemetry Detail Modal when clicking on Head Count, Output, Feed & Water, Climate, or Alerts */}
      <SectorTelemetryModal
        type={telemetryModalType}
        alertText={selectedAlertText}
        sector={sector}
        isOpen={!!telemetryModalType}
        onClose={() => {
          setTelemetryModalType(null);
          setSelectedAlertText(null);
        }}
        onOpenAddAnimal={() => setShowAddAnimalModal(true)}
      />

      {/* Custom Event Log Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#131E17] border border-white/10 rounded-3xl p-6 text-white space-y-4">
            <h3 className="text-base font-semibold">
              Log Custom Event for {sector.name}
            </h3>
            <p className="text-xs text-white/50">
              Record pasture movements, weight calibrations, health notes, or feeding logs.
            </p>
            <form onSubmit={handleCustomActionSubmit} className="space-y-3">
              <textarea
                rows={3}
                required
                autoFocus
                value={logActionText}
                onChange={(e) => setLogActionText(e.target.value)}
                placeholder="e.g. Completed rotational pasture shift to Paddock 4. High clover content noted."
                className="w-full p-3 text-xs bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-400"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-3 py-1.5 text-xs text-white/60 hover:text-white rounded-xl hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-medium bg-[#376343] hover:bg-[#437752] text-white rounded-xl"
                >
                  Record Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Milking Record Modal */}
      {isMilkingModalOpen && onAddMilkingRecord && (
        <AddMilkingRecordModal
          isOpen={isMilkingModalOpen}
          onClose={() => setIsMilkingModalOpen(false)}
          sectors={allSectors || [sector]}
          operator={operator}
          preselectedSpecies={sector.animalType === 'cows' ? 'cows' : 'goats'}
          preselectedAnimalId={milkingAnimalId}
          onSave={(rec) => {
            onAddMilkingRecord(rec);
            setIsMilkingModalOpen(false);
          }}
        />
      )}
    </div>
  );
};
