import React, { useState, useRef } from 'react';
import { LivestockSector, IndividualAnimal, AnimalPhysiologicalStatus } from '../../types/farm';
import { 
  X, 
  Plus, 
  Tag, 
  Check, 
  Sparkles, 
  Camera, 
  Upload, 
  Image as ImageIcon, 
  Trash2, 
  Link as LinkIcon, 
  CheckCircle2 
} from 'lucide-react';
import { sound } from '../../utils/audio';
import { useTheme } from '../../context/ThemeContext';
import { getPhotoPresetsForSector, processUploadedAnimalImage } from '../../utils/animalPhotoPresets';

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
  const { isDark } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  const photoPresets = getPhotoPresetsForSector(sector.animalType, sector.category);

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
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);
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

  // Handle file upload / camera capture
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessingPhoto(true);
      setError('');
      sound.playKeyTap();
      const compressedDataUrl = await processUploadedAnimalImage(file);
      setPhotoUrl(compressedDataUrl);
      sound.playSuccess();
    } catch (err: any) {
      sound.playError();
      setError(err?.message || 'Failed to process image file');
    } finally {
      setIsProcessingPhoto(false);
      // Reset input value so re-selecting the same file works
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSelectPreset = (presetUrl: string) => {
    sound.playKeyTap();
    setPhotoUrl(presetUrl);
  };

  const handleApplyCustomUrl = () => {
    if (!customUrl.trim()) return;
    sound.playKeyTap();
    setPhotoUrl(customUrl.trim());
    setShowUrlInput(false);
    setCustomUrl('');
  };

  const handleRemovePhoto = () => {
    sound.playBackspace();
    setPhotoUrl('');
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
      notes: notes.trim() || undefined,
      photoUrl: photoUrl.trim() || undefined
    };

    onSave(newAnimal);
    onClose();
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 backdrop-blur-md overflow-y-auto ${
      isDark ? 'bg-black/80' : 'bg-slate-900/40'
    }`}>
      <div className={`relative w-full max-w-2xl rounded-3xl shadow-2xl p-5 sm:p-7 my-6 max-h-[92vh] overflow-y-auto border ${
        isDark 
          ? 'bg-[#131E17] border-white/10 text-white' 
          : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Header */}
        <div className={`flex items-start justify-between pb-4 border-b ${
          isDark ? 'border-white/10' : 'border-slate-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl ${
              isDark 
                ? 'bg-[#223528] border border-emerald-500/20 text-emerald-400' 
                : 'bg-emerald-100 border border-emerald-300 text-emerald-800'
            }`}>
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className={`text-base sm:text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Add Animal to {sector.name}
                </h3>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold ${
                  isDairy
                    ? isDark 
                      ? 'bg-emerald-950/60 border border-emerald-500/30 text-emerald-300' 
                      : 'bg-emerald-100 border border-emerald-300 text-emerald-800'
                    : isDark 
                      ? 'bg-amber-950/60 border border-amber-500/30 text-amber-300' 
                      : 'bg-amber-100 border border-amber-300 text-amber-800'
                }`}>
                  {sector.category}
                </span>
              </div>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
                Register animal profile, tag number, photograph, age, and health metrics into the herd database.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${
              isDark ? 'text-white/40 hover:text-white hover:bg-white/10' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-500 font-medium">
            {error}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          {/* ========================================================= */}
          {/* ANIMAL PICTURE SECTION (Farmer Photo Upload & Presets)   */}
          {/* ========================================================= */}
          <div className={`p-4 rounded-2xl border transition-all ${
            photoUrl 
              ? isDark ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-emerald-50/60 border-emerald-200' 
              : isDark ? 'bg-white/[0.02] border-white/10' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <label className={`text-xs font-mono uppercase tracking-wider font-semibold flex items-center gap-1.5 ${
                isDark ? 'text-white/80' : 'text-slate-700'
              }`}>
                <Camera className={`w-4 h-4 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                <span>Animal Picture & Visual Identification</span>
                <span className={`text-[10px] font-normal lowercase tracking-normal px-2 py-0.5 rounded ${
                  isDark ? 'bg-white/10 text-white/50' : 'bg-slate-200 text-slate-600'
                }`}>
                  optional
                </span>
              </label>

              {photoUrl && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="text-[11px] font-mono text-red-500 hover:text-red-600 flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Remove Picture</span>
                </button>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Picture Preview Thumbnail / Frame */}
              <div className="relative group shrink-0">
                <div className={`w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-2 overflow-hidden flex items-center justify-center transition-all ${
                  photoUrl 
                    ? 'border-emerald-500 shadow-sm' 
                    : isDark ? 'border-dashed border-white/20 bg-black/30' : 'border-dashed border-slate-300 bg-white'
                }`}>
                  {photoUrl ? (
                    <img
                      src={photoUrl}
                      alt="Animal preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-2 text-center">
                      <ImageIcon className={`w-7 h-7 mb-1 ${isDark ? 'text-white/20' : 'text-slate-300'}`} />
                      <span className={`text-[10px] font-mono ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
                        No Picture
                      </span>
                    </div>
                  )}

                  {isProcessingPhoto && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>

                {photoUrl && (
                  <div className="absolute -top-1.5 -right-1.5 bg-emerald-600 text-white rounded-full p-0.5 shadow-xs">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                )}
              </div>

              {/* Action Buttons to Attach Photo */}
              <div className="flex-1 space-y-2.5 w-full">
                {/* Hidden File Input (supports camera capture on mobile) */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={`px-3 py-2 text-xs font-semibold rounded-xl border flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95 ${
                      isDark
                        ? 'bg-emerald-950/60 hover:bg-emerald-900 border-emerald-500/40 text-emerald-300'
                        : 'bg-emerald-600 hover:bg-emerald-700 border-emerald-600 text-white'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Picture / Take Photo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowUrlInput(!showUrlInput)}
                    className={`px-3 py-2 text-xs font-mono rounded-xl border transition-colors cursor-pointer ${
                      isDark
                        ? 'bg-white/[0.04] hover:bg-white/[0.08] text-white/70 border-white/10'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                    }`}
                  >
                    <LinkIcon className="w-3.5 h-3.5 inline mr-1" />
                    <span>Paste Link</span>
                  </button>
                </div>

                {/* Paste URL Input bar */}
                {showUrlInput && (
                  <div className="flex items-center gap-2 pt-1 animate-in fade-in duration-150">
                    <input
                      type="url"
                      value={customUrl}
                      onChange={(e) => setCustomUrl(e.target.value)}
                      placeholder="https://example.com/animal-photo.jpg"
                      className={`flex-1 px-3 py-1.5 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                        isDark ? 'bg-black/50 border-white/10 text-white' : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={handleApplyCustomUrl}
                      className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 text-white rounded-xl hover:bg-emerald-700"
                    >
                      Use Link
                    </button>
                  </div>
                )}

                {/* Quick Presets for Cows & Goats */}
                {photoPresets.length > 0 && (
                  <div className="pt-1">
                    <span className={`text-[10px] font-mono block mb-1.5 ${isDark ? 'text-white/40' : 'text-slate-500'}`}>
                      Or choose sample {sector.animalType === 'cows' ? 'cow' : sector.animalType === 'goats' ? 'goat' : 'animal'} portrait preset:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {photoPresets.map((preset) => {
                        const isSelected = photoUrl === preset.url;
                        return (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => handleSelectPreset(preset.url)}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono border transition-all cursor-pointer ${
                              isSelected
                                ? isDark
                                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-semibold ring-1 ring-emerald-500'
                                  : 'bg-emerald-100 border-emerald-500 text-emerald-900 font-semibold ring-1 ring-emerald-500'
                                : isDark
                                ? 'bg-black/30 hover:bg-white/10 border-white/10 text-white/70'
                                : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700'
                            }`}
                          >
                            <img
                              src={preset.url}
                              alt={preset.title}
                              className="w-4 h-4 rounded-full object-cover"
                            />
                            <span>{preset.title.split(' ')[0]}</span>
                            {isSelected && <Check className="w-3 h-3 text-emerald-500" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Row 1: Name & Tag Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className={`block text-xs font-mono uppercase tracking-wider mb-1.5 font-semibold ${
                isDark ? 'text-white/70' : 'text-slate-700'
              }`}>
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
                className={`w-full px-3.5 py-2 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 border ${
                  isDark 
                    ? 'bg-black/40 border-white/10 text-white placeholder:text-white/30' 
                    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white'
                }`}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className={`block text-xs font-mono uppercase tracking-wider font-semibold ${
                  isDark ? 'text-white/70' : 'text-slate-700'
                }`}>
                  Tag / RFID / Band # *
                </label>
                <button
                  type="button"
                  onClick={handleAutoGenerateTag}
                  className={`text-[11px] font-mono flex items-center gap-1 transition-colors ${
                    isDark ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-700 hover:text-emerald-800 font-semibold'
                  }`}
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
                className={`w-full px-3.5 py-2 text-sm font-mono tracking-wider rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 border ${
                  isDark 
                    ? 'bg-black/40 border-white/10 text-emerald-300 placeholder:text-white/30' 
                    : 'bg-slate-50 border-slate-300 text-emerald-800 font-bold placeholder:text-slate-400 focus:bg-white'
                }`}
              />
            </div>
          </div>

          {/* Row 2: Age, Category / Status & Gender */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className={`block text-xs font-mono uppercase tracking-wider mb-1.5 font-semibold ${
                isDark ? 'text-white/70' : 'text-slate-700'
              }`}>
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
                placeholder={isDairy ? 'e.g. 3.2 yrs, 18 mos' : 'e.g. 14 mos, 6 weeks'}
                className={`w-full px-3.5 py-2 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 border ${
                  isDark 
                    ? 'bg-black/40 border-white/10 text-white placeholder:text-white/30' 
                    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white'
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-mono uppercase tracking-wider mb-1.5 font-semibold ${
                isDark ? 'text-white/70' : 'text-slate-700'
              }`}>
                Status / Category *
              </label>
              <select
                value={categoryStatus}
                onChange={(e) => setCategoryStatus(e.target.value)}
                className={`w-full px-3 py-2 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 border ${
                  isDark 
                    ? 'bg-black/40 border-white/10 text-white' 
                    : 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white'
                }`}
              >
                {defaultCategoryOptions.map((opt) => (
                  <option key={opt} value={opt} className={isDark ? 'bg-[#131E17] text-white' : 'bg-white text-slate-900'}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={`block text-xs font-mono uppercase tracking-wider mb-1.5 font-semibold ${
                isDark ? 'text-white/70' : 'text-slate-700'
              }`}>
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as 'Female' | 'Male')}
                className={`w-full px-3 py-2 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 border ${
                  isDark 
                    ? 'bg-black/40 border-white/10 text-white' 
                    : 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white'
                }`}
              >
                <option value="Female" className={isDark ? 'bg-[#131E17] text-white' : 'bg-white text-slate-900'}>Female (Cow/Doe/Hen/Doe)</option>
                <option value="Male" className={isDark ? 'bg-[#131E17] text-white' : 'bg-white text-slate-900'}>Male (Bull/Buck/Rooster/Buck)</option>
              </select>
            </div>
          </div>

          {/* Row 3: Breed & Scale Weight */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className={`block text-xs font-mono uppercase tracking-wider mb-1.5 font-semibold ${
                isDark ? 'text-white/70' : 'text-slate-700'
              }`}>
                Breed
              </label>
              <div className="flex items-center gap-2">
                <select
                  value={breed}
                  onChange={(e) => setBreed(e.target.value)}
                  className={`w-full px-3 py-2 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 border ${
                    isDark 
                      ? 'bg-black/40 border-white/10 text-white' 
                      : 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white'
                  }`}
                >
                  {defaultBreeds.map((b) => (
                    <option key={b} value={b} className={isDark ? 'bg-[#131E17] text-white' : 'bg-white text-slate-900'}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className={`block text-xs font-mono uppercase tracking-wider mb-1.5 font-semibold ${
                isDark ? 'text-white/70' : 'text-slate-700'
              }`}>
                Weight (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                placeholder="e.g. 580 (optional)"
                className={`w-full px-3.5 py-2 text-sm font-mono rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 border ${
                  isDark 
                    ? 'bg-black/40 border-white/10 text-white placeholder:text-white/30' 
                    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white'
                }`}
              />
            </div>
          </div>

          {/* Row 4: Pasture/Pen Location & Health Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className={`block text-xs font-mono uppercase tracking-wider mb-1.5 font-semibold ${
                isDark ? 'text-white/70' : 'text-slate-700'
              }`}>
                Pasture / Pen / Stall Location
              </label>
              <input
                type="text"
                value={penOrPasture}
                onChange={(e) => setPenOrPasture(e.target.value)}
                placeholder="e.g. Pasture 3 (Rotational Clover), Barn A Stall 4"
                className={`w-full px-3.5 py-2 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 border ${
                  isDark 
                    ? 'bg-black/40 border-white/10 text-white placeholder:text-white/30' 
                    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white'
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-mono uppercase tracking-wider mb-1.5 font-semibold ${
                isDark ? 'text-white/70' : 'text-slate-700'
              }`}>
                Health Status
              </label>
              <select
                value={healthStatus}
                onChange={(e) => setHealthStatus(e.target.value as any)}
                className={`w-full px-3 py-2 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 border ${
                  isDark 
                    ? 'bg-black/40 border-white/10 text-white' 
                    : 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white'
                }`}
              >
                <option value="Healthy" className={isDark ? 'bg-[#131E17] text-white' : 'bg-white text-slate-900'}>Optimal / Healthy</option>
                <option value="Requires Observation" className={isDark ? 'bg-[#131E17] text-white' : 'bg-white text-slate-900'}>Requires Observation / Check</option>
                <option value="Quarantined" className={isDark ? 'bg-[#131E17] text-white' : 'bg-white text-slate-900'}>Quarantined / Sick Bay</option>
              </select>
            </div>
          </div>

          {/* Conditional Field: Daily Milk Yield for Milking animals */}
          {isDairy && categoryStatus === 'Milking' && (
            <div className={`p-3.5 rounded-2xl border space-y-1.5 ${
              isDark ? 'bg-emerald-950/30 border-emerald-500/30' : 'bg-emerald-50 border-emerald-200'
            }`}>
              <label className={`block text-xs font-mono uppercase tracking-wider font-semibold ${
                isDark ? 'text-emerald-300' : 'text-emerald-800'
              }`}>
                Daily Milk Production (Liters / day)
              </label>
              <input
                type="number"
                step="0.1"
                value={milkYieldL}
                onChange={(e) => setMilkYieldL(e.target.value)}
                placeholder="e.g. 32.5 (Current test yield)"
                className={`w-full px-3.5 py-2 text-sm font-mono rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 border ${
                  isDark 
                    ? 'bg-black/40 border-emerald-500/30 text-emerald-200 placeholder:text-white/30' 
                    : 'bg-white border-emerald-300 text-emerald-900 placeholder:text-slate-400 font-semibold'
                }`}
              />
              <span className={`text-[10px] font-mono ${isDark ? 'text-emerald-200/60' : 'text-emerald-700'}`}>
                Automatically factored into sector's total daily harvest volume.
              </span>
            </div>
          )}

          {/* Special Notes & Medical/Feeding alerts */}
          <div>
            <label className={`block text-xs font-mono uppercase tracking-wider mb-1.5 font-semibold ${
              isDark ? 'text-white/70' : 'text-slate-700'
            }`}>
              Veterinary Notes, Pedigree, or Special Care
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Due date Nov 14, high butterfat line, vaccinated for BVD on Oct 1"
              className={`w-full px-3.5 py-2 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 border ${
                isDark 
                  ? 'bg-black/40 border-white/10 text-white placeholder:text-white/30' 
                  : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white'
              }`}
            />
          </div>

          {/* Action buttons */}
          <div className={`flex items-center justify-end gap-3 pt-3 border-t ${
            isDark ? 'border-white/10' : 'border-slate-200'
          }`}>
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 text-xs rounded-xl border transition-colors ${
                isDark 
                  ? 'text-white/60 hover:text-white hover:bg-white/5 border-transparent' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-slate-200'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all shadow-md flex items-center gap-1.5 active:scale-95 cursor-pointer"
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
