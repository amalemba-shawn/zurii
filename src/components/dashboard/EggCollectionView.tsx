import React, { useState } from 'react';
import { EggCollectionRecord, FarmOperator, LivestockSector } from '../../types/farm';
import { useTheme } from '../../context/ThemeContext';
import { sound } from '../../utils/audio';
import { 
  Egg, 
  Plus, 
  Trash2, 
  Waves, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  Clock, 
  Filter, 
  Package, 
  Scale, 
  TrendingUp, 
  Layers, 
  Search,
  Check,
  X
} from 'lucide-react';

interface EggCollectionViewProps {
  records: EggCollectionRecord[];
  sectors: LivestockSector[];
  operator: FarmOperator;
  onAddRecord: (record: EggCollectionRecord) => void;
  onDeleteRecord: (recordId: string) => void;
}

export const EggCollectionView: React.FC<EggCollectionViewProps> = ({
  records,
  sectors,
  operator,
  onAddRecord,
  onDeleteRecord
}) => {
  const { isDark } = useTheme();

  const [speciesFilter, setSpeciesFilter] = useState<'all' | 'chicken' | 'ducks'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);

  // Form State
  const [sourceSpecies, setSourceSpecies] = useState<'chicken' | 'ducks'>('chicken');
  const [collectionDate, setCollectionDate] = useState(new Date().toISOString().split('T')[0]);
  const [timeOfDay, setTimeOfDay] = useState<'Morning (AM)' | 'Afternoon (Noon)' | 'Evening (PM)'>('Morning (AM)');
  const [cleanEggs, setCleanEggs] = useState('320');
  const [crackedEggs, setCrackedEggs] = useState('4');
  const [eggGrade, setEggGrade] = useState<EggCollectionRecord['eggGrade']>('Grade A Large');
  const [averageWeight, setAverageWeight] = useState('58.5');
  const [storageLocation, setStorageLocation] = useState('Cold Room Packhouse A (45°F)');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');

  // Calculations
  const todayStr = new Date().toISOString().split('T')[0];
  const todayRecords = records.filter(r => r.date === todayStr);

  const todayTotalEggs = todayRecords.reduce((acc, r) => acc + r.totalEggsCount, 0);
  const todayCleanEggs = todayRecords.reduce((acc, r) => acc + r.cleanEggsCount, 0);
  const todayCrackedEggs = todayRecords.reduce((acc, r) => acc + r.crackedEggsCount, 0);

  const chickenEggsTotal = records
    .filter(r => r.sourceSpecies === 'chicken')
    .reduce((acc, r) => acc + r.totalEggsCount, 0);

  const duckEggsTotal = records
    .filter(r => r.sourceSpecies === 'ducks')
    .reduce((acc, r) => acc + r.totalEggsCount, 0);

  const overallMarketRate = todayTotalEggs > 0 
    ? ((todayCleanEggs / todayTotalEggs) * 100).toFixed(1)
    : '98.5';

  // Filtered records
  const filteredRecords = records.filter(r => {
    const matchesSpecies = speciesFilter === 'all' || r.sourceSpecies === speciesFilter;
    const matchesSearch = 
      r.storageLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.operator.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.notes && r.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSpecies && matchesSearch;
  });

  const handleSpeciesChange = (species: 'chicken' | 'ducks') => {
    setSourceSpecies(species);
    if (species === 'ducks') {
      setCleanEggs('120');
      setCrackedEggs('2');
      setEggGrade('Duck Free-Range');
      setAverageWeight('73.0');
      setStorageLocation('Cold Room Packhouse B (Duck Bay)');
    } else {
      setCleanEggs('350');
      setCrackedEggs('5');
      setEggGrade('Grade A Large');
      setAverageWeight('58.5');
      setStorageLocation('Cold Room Packhouse A (45°F)');
    }
  };

  const handleCreateRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNum = parseInt(cleanEggs) || 0;
    const crackedNum = parseInt(crackedEggs) || 0;
    const total = cleanNum + crackedNum;

    if (total <= 0) {
      setFormError('Total eggs collected must be greater than zero');
      return;
    }

    const flats = parseFloat((total / 30).toFixed(1));
    const targetSectorId = sourceSpecies === 'chicken' ? 'chicken' : 'ducks';

    const newRecord: EggCollectionRecord = {
      id: `egg-rec-${Date.now()}`,
      sourceSpecies,
      flockSectorId: targetSectorId,
      date: collectionDate,
      timeOfDay,
      cleanEggsCount: cleanNum,
      crackedEggsCount: crackedNum,
      totalEggsCount: total,
      eggGrade,
      averageEggWeightGrams: parseFloat(averageWeight) || (sourceSpecies === 'ducks' ? 72 : 58),
      flatsCount: flats,
      storageLocation: storageLocation.trim() || 'Cold Room Packhouse',
      notes: notes.trim() || undefined,
      operator: operator.name,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    sound.playSuccess();
    onAddRecord(newRecord);
    setIsAddModalOpen(false);
    setNotes('');
    setFormError('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className={`p-6 rounded-3xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm ${
        isDark ? 'bg-[#131E17] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-2xl ${
            isDark ? 'bg-amber-950/60 border border-amber-500/30 text-amber-400' : 'bg-amber-100 border border-amber-300 text-amber-800'
          }`}>
            <Egg className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight">Egg Harvest & Flock Production</h1>
              <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border font-semibold ${
                isDark ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-amber-100 text-amber-800 border-amber-300'
              }`}>
                Layers & Waterfowl
              </span>
            </div>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
              Record and audit daily egg harvests from pasture-raised chickens and free-range duck flocks.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Record Egg Collection</span>
        </button>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className={`p-4 rounded-2xl border space-y-1 ${
          isDark ? 'bg-[#131E17] border-white/10' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between text-xs font-mono text-amber-500">
            <span>Today's Total Harvest</span>
            <Egg className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold font-mono">
            {todayTotalEggs > 0 ? todayTotalEggs.toLocaleString() : '532'} Eggs
          </div>
          <span className={`text-[11px] font-mono ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
            ~{((todayTotalEggs || 532) / 30).toFixed(1)} 30-egg tray flats
          </span>
        </div>

        <div className={`p-4 rounded-2xl border space-y-1 ${
          isDark ? 'bg-[#131E17] border-white/10' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between text-xs font-mono text-emerald-500">
            <span>Market Grade A Rate</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold font-mono">{overallMarketRate}%</div>
          <span className={`text-[11px] font-mono ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
            {todayCrackedEggs} cracked eggs isolated
          </span>
        </div>

        <div className={`p-4 rounded-2xl border space-y-1 ${
          isDark ? 'bg-[#131E17] border-white/10' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between text-xs font-mono text-amber-400">
            <span>Pastured Chicken Eggs</span>
            <Egg className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold font-mono">{chickenEggsTotal.toLocaleString()}</div>
          <span className={`text-[11px] font-mono ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
            Rhode Island Reds & Leghorns
          </span>
        </div>

        <div className={`p-4 rounded-2xl border space-y-1 ${
          isDark ? 'bg-[#131E17] border-white/10' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between text-xs font-mono text-sky-400">
            <span>Duck Waterfowl Eggs</span>
            <Waves className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold font-mono">{duckEggsTotal.toLocaleString()}</div>
          <span className={`text-[11px] font-mono ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
            Khaki Campbells & Pekins
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className={`p-3 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono ${
        isDark ? 'bg-[#131E17] border-white/10' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className={`text-[10px] uppercase font-semibold flex items-center gap-1 ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
            <Filter className="w-3 h-3" /> Species:
          </span>
          <button
            type="button"
            onClick={() => setSpeciesFilter('all')}
            className={`px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
              speciesFilter === 'all'
                ? isDark ? 'bg-amber-950/80 border-amber-500/50 text-amber-300 font-semibold' : 'bg-amber-100 border-amber-300 text-amber-900 font-semibold'
                : isDark ? 'bg-black/20 text-white/60 border-white/10' : 'bg-white text-slate-600 border-slate-200'
            }`}
          >
            All Flocks ({records.length})
          </button>
          <button
            type="button"
            onClick={() => setSpeciesFilter('chicken')}
            className={`px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
              speciesFilter === 'chicken'
                ? isDark ? 'bg-amber-950/80 border-amber-500/50 text-amber-300 font-semibold' : 'bg-amber-100 border-amber-300 text-amber-900 font-semibold'
                : isDark ? 'bg-black/20 text-white/60 border-white/10' : 'bg-white text-slate-600 border-slate-200'
            }`}
          >
            🐔 Chickens
          </button>
          <button
            type="button"
            onClick={() => setSpeciesFilter('ducks')}
            className={`px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
              speciesFilter === 'ducks'
                ? isDark ? 'bg-sky-950/80 border-sky-500/50 text-sky-300 font-semibold' : 'bg-sky-100 border-sky-300 text-sky-900 font-semibold'
                : isDark ? 'bg-black/20 text-white/60 border-white/10' : 'bg-white text-slate-600 border-slate-200'
            }`}
          >
            🦆 Ducks
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search operator, storage..."
            className={`w-full pl-8 pr-3 py-1.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
              isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
            }`}
          />
        </div>
      </div>

      {/* Collection Records Table / List */}
      <div className={`rounded-3xl border overflow-hidden shadow-sm ${
        isDark ? 'bg-[#131E17] border-white/10' : 'bg-white border-slate-200'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className={`border-b text-[10px] uppercase tracking-wider ${
              isDark ? 'border-white/10 bg-white/[0.02] text-white/50' : 'border-slate-200 bg-slate-50 text-slate-500'
            }`}>
              <tr>
                <th className="py-3 px-4">Date / Time</th>
                <th className="py-3 px-4">Flock Source</th>
                <th className="py-3 px-4">Clean Eggs</th>
                <th className="py-3 px-4">Cracked</th>
                <th className="py-3 px-4">Total Count</th>
                <th className="py-3 px-4">Trays (Flats)</th>
                <th className="py-3 px-4">Grade & Weight</th>
                <th className="py-3 px-4">Storage / Packhouse</th>
                <th className="py-3 px-4">Operator</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-white/5' : 'divide-slate-100'}`}>
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-400">
                    No egg collection records found for the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec) => {
                  const isDuck = rec.sourceSpecies === 'ducks';
                  return (
                    <tr 
                      key={rec.id}
                      className={`transition-colors hover:bg-white/[0.02] ${
                        isDark ? 'text-white/90' : 'text-slate-800'
                      }`}
                    >
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-bold">{rec.date}</div>
                        <div className={`text-[10px] ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
                          {rec.timeOfDay} · {rec.timestamp}
                        </div>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[10px] font-semibold ${
                          isDuck
                            ? isDark ? 'bg-sky-950/60 border-sky-500/30 text-sky-300' : 'bg-sky-50 border-sky-200 text-sky-800'
                            : isDark ? 'bg-amber-950/60 border-amber-500/30 text-amber-300' : 'bg-amber-50 border-amber-200 text-amber-800'
                        }`}>
                          {isDuck ? <Waves className="w-3 h-3 text-sky-400" /> : <Egg className="w-3 h-3 text-amber-400" />}
                          <span>{isDuck ? 'Duck Waterfowl' : 'Chicken Layers'}</span>
                        </span>
                      </td>

                      <td className="py-3 px-4 font-bold text-emerald-500">
                        {rec.cleanEggsCount.toLocaleString()}
                      </td>

                      <td className="py-3 px-4 font-bold text-amber-500">
                        {rec.crackedEggsCount}
                      </td>

                      <td className="py-3 px-4 font-extrabold text-sm text-slate-900 dark:text-white">
                        {rec.totalEggsCount.toLocaleString()}
                      </td>

                      <td className="py-3 px-4 text-slate-500 dark:text-white/60">
                        {rec.flatsCount || (rec.totalEggsCount / 30).toFixed(1)} flats
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <div>{rec.eggGrade || 'Grade A'}</div>
                        <div className="text-[10px] opacity-60">Avg ~{rec.averageEggWeightGrams}g</div>
                      </td>

                      <td className="py-3 px-4 max-w-[160px] truncate" title={rec.storageLocation}>
                        {rec.storageLocation}
                      </td>

                      <td className="py-3 px-4 text-slate-500 dark:text-white/60 whitespace-nowrap">
                        {rec.operator}
                      </td>

                      <td className="py-3 px-4 text-right">
                        {recordToDelete === rec.id ? (
                          <div className="inline-flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                sound.playBackspace();
                                onDeleteRecord(rec.id);
                                setRecordToDelete(null);
                              }}
                              className="px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-bold"
                            >
                              Yes
                            </button>
                            <button
                              type="button"
                              onClick={() => setRecordToDelete(null)}
                              className="px-1.5 py-0.5 rounded text-slate-400 text-[10px]"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setRecordToDelete(rec.id)}
                            className="p-1 rounded-lg text-red-500 hover:text-red-600 transition-colors"
                            title="Delete log"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL: RECORD NEW EGG HARVEST                            */}
      {/* ======================================================== */}
      {isAddModalOpen && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md overflow-y-auto ${
          isDark ? 'bg-black/85' : 'bg-slate-900/40'
        }`}>
          <div className={`relative w-full max-w-lg rounded-3xl shadow-2xl p-6 sm:p-7 space-y-4 border my-6 ${
            isDark ? 'bg-[#131E17] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-start justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-600 text-white">
                  <Egg className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Record Farm Egg Harvest</h3>
                  <p className={`text-xs ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
                    Log collected clean & cracked eggs from chickens or ducks.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className={`p-1.5 rounded-lg ${isDark ? 'text-white/40 hover:text-white' : 'text-slate-400'}`}
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-500">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateRecord} className="space-y-4 text-xs font-mono">
              {/* Species Toggle */}
              <div>
                <label className="block mb-1.5 font-semibold uppercase text-[11px]">Source Flock *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleSpeciesChange('chicken')}
                    className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all cursor-pointer ${
                      sourceSpecies === 'chicken'
                        ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                        : isDark ? 'bg-black/40 border-white/10 text-white/60' : 'bg-slate-100 border-slate-300 text-slate-700'
                    }`}
                  >
                    <Egg className="w-4 h-4" />
                    <span>🐔 Chickens (Layers)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSpeciesChange('ducks')}
                    className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all cursor-pointer ${
                      sourceSpecies === 'ducks'
                        ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                        : isDark ? 'bg-black/40 border-white/10 text-white/60' : 'bg-slate-100 border-slate-300 text-slate-700'
                    }`}
                  >
                    <Waves className="w-4 h-4" />
                    <span>🦆 Ducks (Waterfowl)</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block mb-1 font-semibold uppercase text-[11px]">Collection Date</label>
                  <input
                    type="date"
                    required
                    value={collectionDate}
                    onChange={(e) => setCollectionDate(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block mb-1 font-semibold uppercase text-[11px]">Collection Shift</label>
                  <select
                    value={timeOfDay}
                    onChange={(e) => setTimeOfDay(e.target.value as any)}
                    className={`w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      isDark ? 'bg-[#131E17] text-white border-white/10' : 'bg-white text-slate-900 border-slate-300'
                    }`}
                  >
                    <option value="Morning (AM)">Morning (AM) Harvest</option>
                    <option value="Afternoon (Noon)">Afternoon (Noon) Check</option>
                    <option value="Evening (PM)">Evening (PM) Final Gathering</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block mb-1 font-semibold uppercase text-[11px] text-emerald-500">
                    Clean & Sound Eggs *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={cleanEggs}
                    onChange={(e) => setCleanEggs(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block mb-1 font-semibold uppercase text-[11px] text-amber-500">
                    Cracked / Damaged Eggs
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={crackedEggs}
                    onChange={(e) => setCrackedEggs(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block mb-1 font-semibold uppercase text-[11px]">Egg Grade</label>
                  <select
                    value={eggGrade}
                    onChange={(e) => setEggGrade(e.target.value as any)}
                    className={`w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      isDark ? 'bg-[#131E17] text-white border-white/10' : 'bg-white text-slate-900 border-slate-300'
                    }`}
                  >
                    <option value="Grade A Large">Grade A Large (56-63g)</option>
                    <option value="Grade AA Jumbo">Grade AA Jumbo (&gt;70g)</option>
                    <option value="Medium / Pullet">Medium / Pullet (&lt;53g)</option>
                    <option value="Duck Free-Range">Duck Free-Range (Rich Yolk)</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 font-semibold uppercase text-[11px]">Storage / Destination</label>
                  <input
                    type="text"
                    value={storageLocation}
                    onChange={(e) => setStorageLocation(e.target.value)}
                    placeholder="e.g. Cold Room Packhouse A"
                    className={`w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 font-semibold uppercase text-[11px]">Batch Notes (Optional)</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Shell quality optimal, nest box straw refreshed"
                  className={`w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className={`px-4 py-2 rounded-xl border ${
                    isDark ? 'border-white/10 text-white/70' : 'border-slate-300 text-slate-700'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Check className="w-4 h-4" />
                  <span>Log Harvest to Registry</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
