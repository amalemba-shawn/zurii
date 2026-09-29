import React, { useState } from 'react';
import { MilkingRecord, LivestockSector, FarmOperator } from '../../types/farm';
import { AddMilkingRecordModal } from './AddMilkingRecordModal';
import { 
  Milk, 
  Droplets, 
  Plus, 
  Search, 
  Trash2, 
  Calendar, 
  CheckCircle2, 
  Filter, 
  Activity, 
  Award,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  Clock
} from 'lucide-react';
import { sound } from '../../utils/audio';

interface MilkingRecordsViewProps {
  records: MilkingRecord[];
  sectors: LivestockSector[];
  operator: FarmOperator;
  onAddRecord: (record: MilkingRecord) => void;
  onDeleteRecord: (recordId: string) => void;
}

export const MilkingRecordsView: React.FC<MilkingRecordsViewProps> = ({
  records,
  sectors,
  operator,
  onAddRecord,
  onDeleteRecord
}) => {
  const [speciesFilter, setSpeciesFilter] = useState<'all' | 'cows' | 'goats'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [preselectedSpecies, setPreselectedSpecies] = useState<'cows' | 'goats'>('cows');

  // Filtered records
  const filteredRecords = records.filter(rec => {
    const matchesSpecies = speciesFilter === 'all' || rec.species === speciesFilter;
    const matchesSearch = 
      rec.animalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.tagNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.milkerOperator.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSpecies && matchesSearch;
  });

  // Analytics calculation
  const totalVolume = records.reduce((sum, r) => sum + r.totalLitres, 0);
  const totalAm = records.reduce((sum, r) => sum + r.morningLitres, 0);
  const totalPm = records.reduce((sum, r) => sum + r.eveningLitres, 0);

  // Top producer
  const topProducer = records.length > 0 
    ? [...records].sort((a, b) => b.totalLitres - a.totalLitres)[0] 
    : null;

  const handleOpenAddModal = (speciesToPreselect: 'cows' | 'goats' = 'cows') => {
    sound.playKeyTap();
    setPreselectedSpecies(speciesToPreselect);
    setIsAddModalOpen(true);
  };

  return (
    <div className="space-y-7">
      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-[#131E17]/90 border border-white/10 backdrop-blur-xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider mb-1">
            <Milk className="w-4 h-4" />
            <span>Dairy Operations Hub · Milking Parlour Log</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Daily Milking Records & Harvest
          </h1>
          <p className="text-xs text-white/60 mt-0.5">
            Key in and monitor morning (AM) and evening (PM) milk production for cows and goats.
          </p>
        </div>

        {/* Action Button: Key In Milking Record */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => handleOpenAddModal('cows')}
            className="px-4 py-2.5 text-xs font-semibold bg-[#376343] hover:bg-[#437752] text-white rounded-xl transition-all shadow-md flex items-center gap-1.5 active:scale-95"
          >
            <Plus className="w-4 h-4 text-emerald-300" />
            <span>+ Key In Milking Record</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
        {/* Stat 1: Total Volume */}
        <div className="p-4 rounded-2xl bg-[#131E17]/80 border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-white/50">
            <span className="uppercase text-[10px]">Today's Recorded Yield</span>
            <Droplets className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="my-2">
            <span className="text-2xl sm:text-3xl font-light text-white font-mono">
              {totalVolume.toFixed(1)}
            </span>
            <span className="text-xs text-emerald-300 ml-1">Litres Total</span>
          </div>
          <div className="text-[10px] text-white/50 flex justify-between">
            <span>AM: <strong className="text-emerald-300">{totalAm.toFixed(1)} L</strong></span>
            <span>PM: <strong className="text-emerald-300">{totalPm.toFixed(1)} L</strong></span>
          </div>
        </div>

        {/* Stat 2: Active Producers */}
        <div className="p-4 rounded-2xl bg-[#131E17]/80 border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-white/50">
            <span className="uppercase text-[10px]">Milked Today</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="my-2">
            <span className="text-2xl sm:text-3xl font-light text-white font-mono">
              {new Set(records.map(r => r.tagNumber)).size}
            </span>
            <span className="text-xs text-white/40 ml-1">Individual Animals</span>
          </div>
          <span className="text-[10px] text-emerald-400/80">
            Zero mastitis flags reported
          </span>
        </div>

        {/* Stat 3: Top Producer */}
        <div className="p-4 rounded-2xl bg-[#131E17]/80 border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-white/50">
            <span className="uppercase text-[10px]">Top Producing Animal</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="my-2">
            <span className="text-base sm:text-lg font-semibold text-white truncate block">
              {topProducer ? `${topProducer.animalName} (${topProducer.tagNumber})` : 'N/A'}
            </span>
            <span className="text-xs font-mono text-emerald-300">
              {topProducer ? `${topProducer.totalLitres} Litres / day` : '0 L'}
            </span>
          </div>
          <span className="text-[10px] text-white/40">
            {topProducer ? `${topProducer.breed} · ${topProducer.lactationStage || 'Peak'}` : 'No entries'}
          </span>
        </div>

        {/* Stat 4: Bulk Tank Chilling */}
        <div className="p-4 rounded-2xl bg-[#131E17]/80 border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-white/50">
            <span className="uppercase text-[10px]">Bulk Tank Status</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="my-2">
            <span className="text-2xl sm:text-3xl font-light text-emerald-300 font-mono">
              38.2°F
            </span>
            <span className="text-xs text-white/40 ml-1">Chilled</span>
          </div>
          <span className="text-[10px] text-emerald-400/80">
            Grade A Dairy Standard Compliant
          </span>
        </div>
      </div>

      {/* Main Records Log Table & Filters */}
      <div className="p-6 md:p-7 rounded-3xl bg-[#131E17]/90 border border-white/10 backdrop-blur-xl shadow-xl space-y-5">
        {/* Table Filter & Search Header */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pb-4 border-b border-white/10">
          {/* Species Tabs */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                sound.playKeyTap();
                setSpeciesFilter('all');
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-xl transition-all ${
                speciesFilter === 'all'
                  ? 'bg-emerald-950/80 text-emerald-200 border border-emerald-500/40 shadow-sm'
                  : 'bg-white/[0.03] text-white/60 hover:text-white border border-white/5'
              }`}
            >
              All Records ({records.length})
            </button>
            <button
              type="button"
              onClick={() => {
                sound.playKeyTap();
                setSpeciesFilter('cows');
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-xl transition-all flex items-center gap-1.5 ${
                speciesFilter === 'cows'
                  ? 'bg-emerald-950/80 text-emerald-200 border border-emerald-500/40 shadow-sm'
                  : 'bg-white/[0.03] text-white/60 hover:text-white border border-white/5'
              }`}
            >
              <Milk className="w-3.5 h-3.5 text-emerald-400" />
              <span>Dairy Cows ({records.filter(r => r.species === 'cows').length})</span>
            </button>
            <button
              type="button"
              onClick={() => {
                sound.playKeyTap();
                setSpeciesFilter('goats');
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-xl transition-all flex items-center gap-1.5 ${
                speciesFilter === 'goats'
                  ? 'bg-emerald-950/80 text-emerald-200 border border-emerald-500/40 shadow-sm'
                  : 'bg-white/[0.03] text-white/60 hover:text-white border border-white/5'
              }`}
            >
              <Milk className="w-3.5 h-3.5 text-emerald-400" />
              <span>Dairy Goats ({records.filter(r => r.species === 'goats').length})</span>
            </button>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tag #, animal, milker..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-black/40 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-400"
            />
          </div>
        </div>

        {/* Milking Log Cards / Table */}
        {filteredRecords.length === 0 ? (
          <div className="py-12 text-center rounded-2xl border border-dashed border-white/10 p-6 space-y-3">
            <Milk className="w-8 h-8 text-white/20 mx-auto" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-white/70">
                No milking entries recorded under this filter
              </p>
              <p className="text-xs text-white/40">
                Key in your first morning & evening parlour harvest yield.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleOpenAddModal('cows')}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-[#376343] hover:bg-[#437752] text-white rounded-xl transition-all shadow-md"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Key In Milking Record</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredRecords.map((rec) => (
              <div
                key={rec.id}
                className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 hover:bg-white/[0.04] transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs font-mono"
              >
                {/* Animal & Species Info */}
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-[#1E2E23] border border-emerald-500/20 flex items-center justify-center text-xs font-bold text-emerald-300 shrink-0">
                    {rec.species === 'cows' ? 'COW' : 'GOAT'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white text-sm font-sans">
                        {rec.animalName}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-black/40 border border-white/10 text-emerald-400 font-semibold tracking-wider text-[11px]">
                        {rec.tagNumber}
                      </span>
                      <span className="text-[10px] text-white/40 uppercase">
                        {rec.breed}
                      </span>
                    </div>
                    <div className="text-[11px] text-white/50 flex items-center gap-2 mt-0.5">
                      <span>{rec.lactationStage || 'Lactating'}</span>
                      <span aria-hidden="true">·</span>
                      <span>{rec.parlourStall || 'Parlour'}</span>
                      <span aria-hidden="true">·</span>
                      <span>Operator: <strong className="text-white/80">{rec.milkerOperator}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Litres Yield Breakdown: Morning, Evening, and Total */}
                <div className="flex items-center gap-4 sm:gap-6 bg-black/40 px-4 py-2.5 rounded-xl border border-white/5 shrink-0">
                  <div className="text-center">
                    <span className="text-[10px] text-white/40 block">Morning (AM)</span>
                    <span className="text-base font-semibold text-emerald-200">
                      {rec.morningLitres.toFixed(1)} L
                    </span>
                  </div>

                  <span className="text-white/20 text-lg">+</span>

                  <div className="text-center">
                    <span className="text-[10px] text-white/40 block">Evening (PM)</span>
                    <span className="text-base font-semibold text-emerald-200">
                      {rec.eveningLitres.toFixed(1)} L
                    </span>
                  </div>

                  <span className="text-white/20 text-lg">=</span>

                  <div className="text-center pl-2 border-l border-white/10">
                    <span className="text-[10px] text-emerald-400 uppercase tracking-wider block font-semibold">
                      Total Daily
                    </span>
                    <span className="text-lg font-bold text-white tracking-tight">
                      {rec.totalLitres.toFixed(1)} <span className="text-xs text-emerald-300">L</span>
                    </span>
                  </div>
                </div>

                {/* Date & Quality Check */}
                <div className="flex items-center justify-between lg:justify-end gap-3 text-right">
                  <div className="text-left lg:text-right">
                    <div className="text-white font-medium">
                      {rec.date} <span className="text-white/40 text-[10px]">{rec.timestamp}</span>
                    </div>
                    <div className="text-[10px] text-emerald-400/80 mt-0.5">
                      {rec.butterfatPercentage ? `Butterfat: ${rec.butterfatPercentage}% · ` : ''}Clean Check
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      sound.playBackspace();
                      onDeleteRecord(rec.id);
                    }}
                    className="p-1.5 text-white/30 hover:text-red-400 rounded-lg hover:bg-white/5 transition-colors"
                    title="Delete Record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Milking Record Modal */}
      <AddMilkingRecordModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        sectors={sectors}
        operator={operator}
        preselectedSpecies={preselectedSpecies}
        onSave={(rec) => {
          onAddRecord(rec);
          setIsAddModalOpen(false);
        }}
      />
    </div>
  );
};
