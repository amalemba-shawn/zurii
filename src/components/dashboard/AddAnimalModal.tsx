import React, { useState } from 'react';
import { LivestockSector, IndividualAnimal, AnimalPhysiologicalStatus } from '../../types/farm';
import { X, Plus, ShieldCheck, Tag, HeartPulse, Check, Sparkles } from 'lucide-react';
import { sound } from '../../utils/audio';

interface AddAnimalModalProps {
  isOpen: boolean;
  onClose: () => void;
  sector: LivestockSector;
  onSave: (animal: IndividualAnimal) => void;
}

export const AddAnimalModal: React.FC<AddAnimalModalProps> = ({
  isOpen,
  onClose,
  sector,
  onSave
}) => {
  // Preset breeds and categories based on animal type & sector category
  const isDairy = sector.category === 'dairy';

  const defaultCategoryOptions: AnimalPhysiologicalStatus[] = isDairy
    ? ['Milking', 'Dried', 'Expecting', 'Heifer / Kid', 'Under Treatment']
    : sector.animalType === 'chicken' || sector.animalType === 'ducks'
    ? ['Broiler', 'Layer', 'Grower', 'Breeder']
    : ['Growing / Pasture', 'Finishing / Market Ready', 'Breeding Stock', 'Expecting', 'Nursery'];

  const breedPresets: Record<string, string[]> = {
    cows: isDairy
      ? ['Holstein Friesian', 'Jersey', 'Guernsey', 'Ayrshire', 'Brown Swiss']
      : ['Black Angus', 'Hereford', 'Charolais', 'Simmental', 'Wagyu Cross'],
    goats: isDairy
      ? ['Saanen', 'Alpine', 'Nubian', 'Toggenburg', 'LaMancha']
      : ['Boer', 'Kalahari Red', 'Kiko', 'Spanish Goat', 'Savanna'],
    chicken: ['Cornish Cross (Broiler)', 'Rhode Island Red', 'Plymouth Rock', 'Sussex', 'Australorp'],
    ducks: ['Pekin (Meat)', 'Rouen', 'Muscovy', 'Khaki Campbell', 'Aylesbury'],
    rabbits: ['New Zealand White', 'Californian', 'Flemish Giant', 'Champagne d’Argent', 'Rex']
  };

  const defaultBreeds = breedPresets[sector.animalType] || ['Commercial Farm Breed'];

  // Form State
  const [name, setName] = useState('');
  const [tagNumber, setTagNumber] = useState('');
  const [age, setAge] = useState('');
  const [categoryStatus, setCategoryStatus] = useState<AnimalPhysiologicalStatus>(
    isDairy ? 'Milking' : defaultCategoryOptions[0]
  );
  const [breed, setBreed] = useState(defaultBreeds[0]);
  const [gender, setGender] = useState<'Female' | 'Male'>(isDairy ? 'Female' : 'Female');
  const [weightKg, setWeightKg] = useState<string>('');
  const [penOrPasture, setPenOrPasture] = useState(sector.pastureOrPen);
  const [healthStatus, setHealthStatus] = useState<'Healthy' | 'Requires Observation' | 'Quarantined'>('Healthy');
  const [milkYieldL, setMilkYieldL] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  // Auto-generate tag helper
  const handleAutoGenerateTag = () => {
    sound.playKeyTap();
    const prefix = sector.animalType === 'cows'
      ? (isDairy ? 'COW' : 'BEEF')
      : sector.animalType === 'goats'
      ? (isDairy ? 'GTD' : 'GTM')
      : sector.animalType === 'chicken'
      ? 'CHK'
      : sector.animalType === 'ducks'
      ? 'DCK'
      : 'RAB';
    const randomNum = Math.floor(100 + Math.random() * 900);
    setTagNumber(`${prefix}-${randomNum}`);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a name or identification title for the animal.');
      return;
    }
    if (!tagNumber.trim()) {
      setError('Please provide an official Ear Tag / RFID / Band number.');
      return;
    }
    if (!age.trim()) {
      setError('Please specify the age (e.g. "3.5 yrs", "18 months", "45 days").');
      return;
    }

    sound.playSuccess();

    const newAnimal: IndividualAnimal = {
      id: `animal-${Date.now()}`,
      sectorId: sector.id,
      name: name.trim(),
      tagNumber: tagNumber.trim().toUpperCase(),
      age: age.trim(),
      categoryStatus,
      breed: breed.trim(),
      weightKg: weightKg ? parseFloat(weightKg) : undefined,
      gender,
      penOrPasture: penOrPasture.trim() || sector.pastureOrPen,
      healthStatus,
      lastMilkingYieldL: isDairy && categoryStatus === 'Milking' && milkYieldL ? parseFloat(milkYieldL) : undefined,
      dateRegistered: new Date().toISOString().split('T')[0],
      notes: notes.trim() || undefined
    };

    onSave(newAnimal);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#131E17] border border-white/10 rounded-3xl shadow-2xl p-5 sm:p-7 text-white my-6 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#223528] border border-emerald-500/20 text-emerald-400">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-semibold text-white">
                  Add Animal to {sector.name}
                </h3>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase ${
                  isDairy
                    ? 'bg-emerald-950/60 border border-emerald-500/30 text-emerald-300'
                    : 'bg-amber-950/60 border border-amber-500/30 text-amber-300'
                }`}>
                  {sector.category}
                </span>
              </div>
              <p className="text-xs text-white/50 mt-0.5">
                Register animal profile, tag number, age, category status, and health metrics into the herd database.
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

        {/* Error notification */}
        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-950/50 border border-red-500/30 text-xs text-red-200">
            {error}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Row 1: Name & Tag Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1.5">
                Animal Name / Identification *
              </label>
              <input
                type="text"
                required
                autoFocus
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError('');
                }}
                placeholder={isDairy ? 'e.g. Bessie, Daisy, Bella' : 'e.g. Titan, Ranger, Batch Alpha'}
                className="w-full px-3.5 py-2 text-sm bg-black/40 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-mono uppercase tracking-wider text-white/70">
                  Tag / RFID / Band # *
                </label>
                <button
                  type="button"
                  onClick={handleAutoGenerateTag}
                  className="text-[11px] font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Auto-Gen</span>
                </button>
              </div>
              <input
                type="text"
                required
                value={tagNumber}
                onChange={(e) => {
                  setTagNumber(e.target.value);
                  setError('');
                }}
                placeholder="e.g. COW-0104, GTD-0042"
                className="w-full px-3.5 py-2 text-sm font-mono tracking-wider bg-black/40 border border-white/10 rounded-xl text-emerald-300 placeholder:text-white/30 focus:outline-none focus:border-emerald-400"
              />
            </div>
          </div>

          {/* Row 2: Age, Category / Status & Gender */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1.5">
                Age *
              </label>
              <input
                type="text"
                required
                value={age}
                onChange={(e) => {
                  setAge(e.target.value);
                  setError('');
                }}
                placeholder="e.g. 3.5 yrs, 18 mos, 45 days"
                className="w-full px-3.5 py-2 text-sm bg-black/40 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-emerald-400 mb-1.5 font-semibold">
                Category / Status *
              </label>
              <select
                value={categoryStatus}
                onChange={(e) => setCategoryStatus(e.target.value as AnimalPhysiologicalStatus)}
                className="w-full px-3.5 py-2 text-sm bg-black/40 border border-emerald-500/40 rounded-xl text-white focus:outline-none focus:border-emerald-400"
              >
                {defaultCategoryOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1.5">
                Gender
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setGender('Female')}
                  className={`flex-1 py-2 text-xs font-medium rounded-xl border transition-all ${
                    gender === 'Female'
                      ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                      : 'bg-black/30 border-white/10 text-white/50 hover:text-white'
                  }`}
                >
                  Female
                </button>
                <button
                  type="button"
                  onClick={() => setGender('Male')}
                  className={`flex-1 py-2 text-xs font-medium rounded-xl border transition-all ${
                    gender === 'Male'
                      ? 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                      : 'bg-black/30 border-white/10 text-white/50 hover:text-white'
                  }`}
                >
                  Male
                </button>
              </div>
            </div>
          </div>

          {/* Row 3: Breed & Weight */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1.5">
                Breed
              </label>
              <div className="space-y-1.5">
                <select
                  value={breed}
                  onChange={(e) => setBreed(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-400"
                >
                  {defaultBreeds.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                  <option value="Other / Crossbred">Other / Crossbred</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1.5">
                Body Weight (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                placeholder="e.g. 580 (optional)"
                className="w-full px-3.5 py-2 text-sm font-mono bg-black/40 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-400"
              />
            </div>
          </div>

          {/* Row 4: Pasture/Pen Location & Health Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1.5">
                Pasture / Pen / Stall Location
              </label>
              <input
                type="text"
                value={penOrPasture}
                onChange={(e) => setPenOrPasture(e.target.value)}
                placeholder="e.g. Pasture 3 (Rotational Clover), Barn A Stall 4"
                className="w-full px-3.5 py-2 text-sm bg-black/40 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1.5">
                Health Status
              </label>
              <select
                value={healthStatus}
                onChange={(e) => setHealthStatus(e.target.value as any)}
                className="w-full px-3.5 py-2 text-sm bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-400"
              >
                <option value="Healthy">Optimal / Healthy</option>
                <option value="Requires Observation">Requires Observation / Check</option>
                <option value="Quarantined">Quarantined / Sick Bay</option>
              </select>
            </div>
          </div>

          {/* Conditional Field: Daily Milk Yield for Milking animals */}
          {isDairy && categoryStatus === 'Milking' && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-1.5">
              <label className="block text-xs font-mono uppercase tracking-wider text-emerald-300">
                Daily Milk Production (Liters / day)
              </label>
              <input
                type="number"
                step="0.1"
                value={milkYieldL}
                onChange={(e) => setMilkYieldL(e.target.value)}
                placeholder="e.g. 32.5 (Current test yield)"
                className="w-full px-3.5 py-2 text-sm font-mono bg-black/40 border border-emerald-500/30 rounded-xl text-emerald-200 placeholder:text-white/30 focus:outline-none focus:border-emerald-400"
              />
              <span className="text-[10px] text-emerald-200/60 font-mono">
                Automatically factored into sector's total daily harvest volume.
              </span>
            </div>
          )}

          {/* Special Notes & Medical/Feeding alerts */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1.5">
              Veterinary Notes, Pedigree, or Special Care
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Due date Nov 14, high butterfat line, vaccinated for BVD on Oct 1"
              className="w-full px-3.5 py-2 text-xs bg-black/40 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-400"
            />
          </div>

          {/* Action buttons */}
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
              <span>Register Animal to Herd</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
