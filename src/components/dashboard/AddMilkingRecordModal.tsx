import React, { useState, useEffect } from 'react';
import { MilkingRecord, LivestockSector, IndividualAnimal, FarmOperator } from '../../types/farm';
import { 
  X, 
  Milk, 
  Droplets, 
  Check, 
  Sparkles, 
  Calendar, 
  Tag, 
  Clock, 
  ShieldCheck, 
  Activity,
  Calculator
} from 'lucide-react';
import { sound } from '../../utils/audio';

interface AddMilkingRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  sectors: LivestockSector[];
  operator: FarmOperator;
  onSave: (record: MilkingRecord) => void;
  preselectedSpecies?: 'cows' | 'goats';
  preselectedAnimalId?: string;
}

export const AddMilkingRecordModal: React.FC<AddMilkingRecordModalProps> = ({
  isOpen,
  onClose,
  sectors,
  operator,
  onSave,
  preselectedSpecies = 'cows',
  preselectedAnimalId
}) => {
  const [species, setSpecies] = useState<'cows' | 'goats'>(preselectedSpecies);
  const [selectedAnimalId, setSelectedAnimalId] = useState<string>(preselectedAnimalId || '');
  const [customName, setCustomName] = useState('');
  const [customTag, setCustomTag] = useState('');
  const [breed, setBreed] = useState('Holstein Friesian');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [morningLitres, setMorningLitres] = useState<string>('');
  const [eveningLitres, setEveningLitres] = useState<string>('');
  const [lactationStage, setLactationStage] = useState<'Early Lactation' | 'Peak Lactation' | 'Mid Lactation' | 'Late Lactation'>('Peak Lactation');
  const [butterfat, setButterfat] = useState<string>(species === 'cows' ? '4.15' : '3.75');
  const [parlourStall, setParlourStall] = useState<string>(species === 'cows' ? 'Parlour Bay 1' : 'Goat Stand A-1');
  const [healthNotes, setHealthNotes] = useState('Strip cup clear, teats sanitized, post-dip applied.');
  const [error, setError] = useState('');

  // Target sector
  const targetSector = sectors.find(s => s.id === (species === 'cows' ? 'cows-dairy' : 'goats-dairy'));
  const dairyAnimals = (targetSector?.animals || []).filter(a => a.categoryStatus === 'Milking' || a.categoryStatus === 'Expecting' || true);

  // Auto-populate when an animal is picked
  useEffect(() => {
    if (selectedAnimalId && selectedAnimalId !== 'custom') {
      const found = dairyAnimals.find(a => a.id === selectedAnimalId);
      if (found) {
        setCustomName(found.name);
        setCustomTag(found.tagNumber);
        setBreed(found.breed);
        if (found.lastMilkingYieldL && found.lastMilkingYieldL > 0) {
          // prefill suggested morning/evening split (approx 55% AM, 45% PM)
          const am = (found.lastMilkingYieldL * 0.54).toFixed(1);
          const pm = (found.lastMilkingYieldL - parseFloat(am)).toFixed(1);
          setMorningLitres(am);
          setEveningLitres(pm);
        }
      }
    }
  }, [selectedAnimalId, species]);

  // Handle species switch
  const handleSpeciesChange = (newSpecies: 'cows' | 'goats') => {
    sound.playKeyTap();
    setSpecies(newSpecies);
    setSelectedAnimalId('');
    setCustomName('');
    setCustomTag('');
    setBreed(newSpecies === 'cows' ? 'Holstein Friesian' : 'Saanen');
    setButterfat(newSpecies === 'cows' ? '4.15' : '3.75');
    setParlourStall(newSpecies === 'cows' ? 'Parlour Bay 1' : 'Goat Stand A-1');
  };

  if (!isOpen) return null;

  // Live calculation of total
  const amVal = parseFloat(morningLitres) || 0;
  const pmVal = parseFloat(eveningLitres) || 0;
  const totalVal = parseFloat((amVal + pmVal).toFixed(2));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) {
      setError('Please provide or select the animal name.');
      return;
    }
    if (!customTag.trim()) {
      setError('Please provide the official Ear Tag number.');
      return;
    }
    if (amVal <= 0 && pmVal <= 0) {
      setError('Please enter morning or evening milk volume in Litres.');
      return;
    }

    sound.playSuccess();

    const record: MilkingRecord = {
      id: `milk-${Date.now()}`,
      species,
      animalId: selectedAnimalId !== 'custom' ? selectedAnimalId : undefined,
      animalName: customName.trim(),
      tagNumber: customTag.trim().toUpperCase(),
      breed: breed.trim(),
      lactationStage,
      date,
      morningLitres: amVal,
      eveningLitres: pmVal,
      totalLitres: totalVal,
      butterfatPercentage: butterfat ? parseFloat(butterfat) : undefined,
      parlourStall: parlourStall.trim() || undefined,
      healthNotes: healthNotes.trim() || undefined,
      milkerOperator: operator.name,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    onSave(record);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#131E17] border border-white/10 rounded-3xl shadow-2xl p-5 sm:p-7 text-white space-y-5 my-6 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#1F3325] border border-emerald-500/30 text-emerald-400">
              <Milk className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Key In Daily Milking Record
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-300">
                  AM & PM Harvest
                </span>
              </div>
              <p className="text-xs text-white/50 mt-0.5">
                Record morning and evening milk yields, lactation stage, and parlour quality checks.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-white/40 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Species Switcher: Cows vs Goats */}
        <div className="flex gap-2 p-1.5 bg-black/40 border border-white/10 rounded-2xl">
          <button
            type="button"
            onClick={() => handleSpeciesChange('cows')}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 ${
              species === 'cows'
                ? 'bg-emerald-950/90 text-white border border-emerald-500/40 shadow-sm'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Milk className="w-4 h-4 text-emerald-400" />
            <span>Dairy Cows (Bovine)</span>
          </button>
          <button
            type="button"
            onClick={() => handleSpeciesChange('goats')}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 ${
              species === 'goats'
                ? 'bg-emerald-950/90 text-white border border-emerald-500/40 shadow-sm'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Milk className="w-4 h-4 text-emerald-400" />
            <span>Dairy Goats (Caprine)</span>
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/30 text-xs text-red-200">
            {error}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Row 1: Select Animal from Herd or Custom */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 block font-semibold">
              1. Select {species === 'cows' ? 'Cow' : 'Goat'} from Dairy Herd
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-1">
                <label className="block text-[11px] font-mono text-white/60 mb-1">
                  Pick Registered Animal
                </label>
                <select
                  value={selectedAnimalId}
                  onChange={(e) => {
                    setSelectedAnimalId(e.target.value);
                    setError('');
                  }}
                  className="w-full px-3 py-2 text-xs bg-black/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-400"
                >
                  <option value="">-- Choose from roster --</option>
                  {dairyAnimals.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.tagNumber}) - {a.categoryStatus}
                    </option>
                  ))}
                  <option value="custom">+ Manual / Unlisted Animal</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-white/60 mb-1">
                  Animal Name *
                </label>
                <input
                  type="text"
                  required
                  value={customName}
                  onChange={(e) => {
                    setCustomName(e.target.value);
                    setError('');
                  }}
                  placeholder="e.g. Bessie, Daisy"
                  className="w-full px-3 py-2 text-xs bg-black/50 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-white/60 mb-1">
                  Tag / RFID # *
                </label>
                <input
                  type="text"
                  required
                  value={customTag}
                  onChange={(e) => {
                    setCustomTag(e.target.value);
                    setError('');
                  }}
                  placeholder="e.g. COW-0104"
                  className="w-full px-3 py-2 text-xs font-mono tracking-wider bg-black/50 border border-white/10 rounded-xl text-emerald-300 placeholder:text-white/30 focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>
          </div>

          {/* Row 2: Date, Breed & Lactation Stage */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1.5">
                Milking Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1.5">
                Lactation Stage
              </label>
              <select
                value={lactationStage}
                onChange={(e) => setLactationStage(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-400"
              >
                <option value="Early Lactation">Early Lactation (Day 1 - 60)</option>
                <option value="Peak Lactation">Peak Lactation (Day 60 - 120)</option>
                <option value="Mid Lactation">Mid Lactation (Day 120 - 240)</option>
                <option value="Late Lactation">Late Lactation (Day 240+)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1.5">
                Breed Line
              </label>
              <input
                type="text"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                placeholder="e.g. Holstein, Jersey, Saanen"
                className="w-full px-3 py-2 text-xs bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-400"
              />
            </div>
          </div>

          {/* Row 3: MORNING & EVENING LITRES WITH LIVE CALCULATION */}
          <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-300 font-semibold flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-emerald-400" />
                <span>2. Morning & Evening Harvest Volumes</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-400/80">
                Unit: Litres (L)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 items-center">
              <div>
                <label className="block text-xs font-mono text-white/80 mb-1">
                  Morning Yield (Litres) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={morningLitres}
                  onChange={(e) => {
                    setMorningLitres(e.target.value);
                    setError('');
                  }}
                  placeholder={species === 'cows' ? 'e.g. 18.5' : 'e.g. 2.4'}
                  className="w-full px-3.5 py-2.5 text-base font-mono font-medium bg-black/50 border border-white/15 rounded-xl text-emerald-200 placeholder:text-white/30 focus:outline-none focus:border-emerald-400"
                />
                <span className="text-[10px] text-white/40 font-mono mt-0.5 block">
                  06:00 – 08:00 AM parlour run
                </span>
              </div>

              <div>
                <label className="block text-xs font-mono text-white/80 mb-1">
                  Evening Yield (Litres) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={eveningLitres}
                  onChange={(e) => {
                    setEveningLitres(e.target.value);
                    setError('');
                  }}
                  placeholder={species === 'cows' ? 'e.g. 15.7' : 'e.g. 2.1'}
                  className="w-full px-3.5 py-2.5 text-base font-mono font-medium bg-black/50 border border-white/15 rounded-xl text-emerald-200 placeholder:text-white/30 focus:outline-none focus:border-emerald-400"
                />
                <span className="text-[10px] text-white/40 font-mono mt-0.5 block">
                  16:00 – 18:00 PM parlour run
                </span>
              </div>

              {/* Total Daily Calculation Card */}
              <div className="p-3 rounded-xl bg-black/50 border border-emerald-500/40 text-center space-y-0.5">
                <span className="text-[10px] font-mono uppercase text-emerald-400 tracking-wider block">
                  Computed Total Day Yield
                </span>
                <div className="text-2xl sm:text-3xl font-mono font-light text-white tracking-tight">
                  {totalVal} <span className="text-sm font-normal text-emerald-300">Liters</span>
                </div>
                <span className="text-[10px] text-white/50 font-mono block">
                  {species === 'cows' 
                    ? `${(totalVal * 2.27).toFixed(1)} lbs milk equiv.` 
                    : 'Artisan cheese batch standard'}
                </span>
              </div>
            </div>
          </div>

          {/* Row 4: Quality & Parlour Stall */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1.5">
                Butterfat Percentage (%)
              </label>
              <input
                type="number"
                step="0.01"
                value={butterfat}
                onChange={(e) => setButterfat(e.target.value)}
                placeholder="e.g. 4.15"
                className="w-full px-3 py-2 text-xs font-mono bg-black/40 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1.5">
                Milking Stall / Bay Location
              </label>
              <input
                type="text"
                value={parlourStall}
                onChange={(e) => setParlourStall(e.target.value)}
                placeholder="e.g. Parlour Bay 1, Rapid Exit Stall 3"
                className="w-full px-3 py-2 text-xs bg-black/40 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-400"
              />
            </div>
          </div>

          {/* Health & Teat Condition Notes */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1.5">
              Teat Condition, Strip Cup & Hygiene Notes
            </label>
            <input
              type="text"
              value={healthNotes}
              onChange={(e) => setHealthNotes(e.target.value)}
              placeholder="e.g. Teats clean, post-milking barrier dip applied, somatic test clear."
              className="w-full px-3.5 py-2 text-xs bg-black/40 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-400"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-white/60 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-semibold bg-[#376343] hover:bg-[#437752] text-white rounded-xl transition-all shadow-md flex items-center gap-1.5 active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>Save Milking Record</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
