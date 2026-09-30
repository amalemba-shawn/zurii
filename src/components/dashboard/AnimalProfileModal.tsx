import React, { useState, useRef } from 'react';
import { IndividualAnimal, LivestockSector, AnimalPhysiologicalStatus } from '../../types/farm';
import { 
  X, 
  Tag, 
  Heart, 
  Calendar, 
  MapPin, 
  Scale, 
  Droplets, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Edit3, 
  Trash2, 
  Activity,
  ChevronDown,
  Wheat,
  Clock,
  Camera,
  Upload,
  Check,
  Image as ImageIcon
} from 'lucide-react';
import { sound } from '../../utils/audio';
import { useTheme } from '../../context/ThemeContext';
import { getPhotoPresetsForSector, processUploadedAnimalImage } from '../../utils/animalPhotoPresets';

interface AnimalProfileModalProps {
  animal: IndividualAnimal | null;
  sector: LivestockSector;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (animalId: string, newStatus: AnimalPhysiologicalStatus) => void;
  onRemove: (animalId: string, reason: string) => void;
  onUpdatePhoto?: (animalId: string, photoUrl: string) => void;
}

export const AnimalProfileModal: React.FC<AnimalProfileModalProps> = ({
  animal,
  sector,
  isOpen,
  onClose,
  onUpdateStatus,
  onRemove,
  onUpdatePhoto
}) => {
  const { isDark } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isChangingStatus, setIsChangingStatus] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isPhotoPickerOpen, setIsPhotoPickerOpen] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState('');

  if (!isOpen || !animal) return null;

  const isDairy = sector.category === 'dairy';
  const photoPresets = getPhotoPresetsForSector(sector.animalType, sector.category);

  const availableStatusOptions: AnimalPhysiologicalStatus[] = isDairy
    ? ['Milking', 'Dried', 'Expecting', 'Heifer / Kid', 'Under Treatment']
    : sector.animalType === 'chicken' || sector.animalType === 'ducks'
    ? ['Broiler', 'Layer', 'Grower', 'Breeder']
    : ['Growing / Pasture', 'Finishing / Market Ready', 'Breeding Stock', 'Expecting', 'Nursery'];

  const getStatusBadgeStyle = (status: string) => {
    const lower = status.toLowerCase();
    if (lower.includes('milking')) {
      return isDark ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300' : 'bg-emerald-100 border-emerald-300 text-emerald-800';
    }
    if (lower.includes('expecting')) {
      return isDark ? 'bg-purple-950/80 border-purple-500/50 text-purple-300' : 'bg-purple-100 border-purple-300 text-purple-800';
    }
    if (lower.includes('dried')) {
      return isDark ? 'bg-zinc-800 border-zinc-600/50 text-zinc-300' : 'bg-slate-200 border-slate-300 text-slate-700';
    }
    if (lower.includes('finishing') || lower.includes('market')) {
      return isDark ? 'bg-amber-950/80 border-amber-500/50 text-amber-300' : 'bg-amber-100 border-amber-300 text-amber-800';
    }
    if (lower.includes('breeding')) {
      return isDark ? 'bg-sky-950/80 border-sky-500/50 text-sky-300' : 'bg-sky-100 border-sky-300 text-sky-800';
    }
    return isDark ? 'bg-white/[0.08] border-white/20 text-white/80' : 'bg-slate-100 border-slate-200 text-slate-700';
  };

  const handleStatusChange = (newStatus: AnimalPhysiologicalStatus) => {
    sound.playKeyTap();
    onUpdateStatus(animal.id, newStatus);
    setIsChangingStatus(false);
  };

  const handleDeleteAnimal = () => {
    sound.playBackspace();
    onRemove(animal.id, 'Removed via Animal Dossier');
    onClose();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onUpdatePhoto) return;

    try {
      setIsUploadingPhoto(true);
      setPhotoError('');
      sound.playKeyTap();
      const compressed = await processUploadedAnimalImage(file);
      onUpdatePhoto(animal.id, compressed);
      sound.playSuccess();
      setIsPhotoPickerOpen(false);
    } catch (err: any) {
      sound.playError();
      setPhotoError(err?.message || 'Failed to update photo');
    } finally {
      setIsUploadingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSelectPreset = (url: string) => {
    if (!onUpdatePhoto) return;
    sound.playSuccess();
    onUpdatePhoto(animal.id, url);
    setIsPhotoPickerOpen(false);
  };

  const handleRemovePhoto = () => {
    if (!onUpdatePhoto) return;
    sound.playBackspace();
    onUpdatePhoto(animal.id, '');
    setIsPhotoPickerOpen(false);
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 backdrop-blur-md overflow-y-auto ${
      isDark ? 'bg-black/85' : 'bg-slate-900/40'
    }`}>
      <div className={`relative w-full max-w-xl rounded-3xl shadow-2xl p-6 sm:p-7 space-y-6 my-6 max-h-[92vh] overflow-y-auto border ${
        isDark 
          ? 'bg-[#131E17] border-white/10 text-white' 
          : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Top Header with Animal Avatar/Photo and Quick Photo Edit */}
        <div className={`flex items-start justify-between pb-4 border-b ${
          isDark ? 'border-white/10' : 'border-slate-200'
        }`}>
          <div className="flex items-center gap-3.5">
            {/* Animal Photo or Initial Avatar */}
            <div className="relative group shrink-0">
              <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border-2 flex items-center justify-center overflow-hidden shadow-md transition-transform group-hover:scale-105 ${
                animal.photoUrl 
                  ? 'border-emerald-500' 
                  : isDark ? 'border-emerald-500/30 bg-[#1F3325]' : 'border-emerald-300 bg-emerald-100'
              }`}>
                {animal.photoUrl ? (
                  <img
                    src={animal.photoUrl}
                    alt={animal.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className={`text-base font-mono font-bold ${
                    isDark ? 'text-emerald-300' : 'text-emerald-800'
                  }`}>
                    {animal.name.slice(0, 2).toUpperCase()}
                  </span>
                )}
              </div>

              {/* Camera edit overlay badge */}
              {onUpdatePhoto && (
                <button
                  type="button"
                  onClick={() => setIsPhotoPickerOpen(!isPhotoPickerOpen)}
                  title="Change or add picture of animal"
                  className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-transform active:scale-90 cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className={`text-lg sm:text-xl font-bold tracking-tight ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  {animal.name}
                </h2>
                <span className={`text-xs font-mono px-2.5 py-0.5 rounded-lg border font-semibold tracking-wider ${
                  isDark ? 'bg-black/50 border-emerald-500/30 text-emerald-400' : 'bg-emerald-50 border-emerald-300 text-emerald-800'
                }`}>
                  {animal.tagNumber}
                </span>
              </div>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
                {animal.breed} <span className={isDark ? 'text-white/30' : 'text-slate-300'}>·</span> {animal.gender} <span className={isDark ? 'text-white/30' : 'text-slate-300'}>·</span> {sector.name}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors ${
              isDark ? 'text-white/40 hover:text-white hover:bg-white/10' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Photo Picker Drawer (when farmer clicks camera button) */}
        {isPhotoPickerOpen && onUpdatePhoto && (
          <div className={`p-4 rounded-2xl border space-y-3 animate-in fade-in duration-150 ${
            isDark ? 'bg-black/40 border-emerald-500/30' : 'bg-emerald-50/70 border-emerald-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-mono font-semibold uppercase tracking-wider flex items-center gap-1.5 ${
                isDark ? 'text-emerald-300' : 'text-emerald-800'
              }`}>
                <Camera className="w-3.5 h-3.5" />
                <span>Update Animal Picture</span>
              </span>
              <button
                type="button"
                onClick={() => setIsPhotoPickerOpen(false)}
                className={`text-xs ${isDark ? 'text-white/40 hover:text-white' : 'text-slate-400 hover:text-slate-700'}`}
              >
                Close
              </button>
            </div>

            {photoError && (
              <p className="text-xs text-red-500">{photoError}</p>
            )}

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingPhoto}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{isUploadingPhoto ? 'Uploading...' : 'Take Photo / Upload Picture'}</span>
              </button>

              {animal.photoUrl && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="px-3 py-1.5 text-xs font-mono rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 cursor-pointer"
                >
                  Remove Current Photo
                </button>
              )}
            </div>

            {/* Presets */}
            {photoPresets.length > 0 && (
              <div className="pt-1">
                <span className={`text-[10px] font-mono block mb-1.5 ${isDark ? 'text-white/40' : 'text-slate-500'}`}>
                  Or select sample portrait preset:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {photoPresets.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectPreset(preset.url)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono border transition-all cursor-pointer ${
                        animal.photoUrl === preset.url
                          ? 'bg-emerald-600 text-white border-emerald-600 font-semibold'
                          : isDark
                          ? 'bg-white/[0.04] hover:bg-white/[0.1] border-white/10 text-white/70'
                          : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700'
                      }`}
                    >
                      <img src={preset.url} alt={preset.title} className="w-4 h-4 rounded-full object-cover" />
                      <span>{preset.title.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Status Strip & Quick Change */}
        <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
          isDark ? 'bg-white/[0.03] border-white/5' : 'bg-slate-50 border-slate-200'
        }`}>
          <div>
            <span className={`text-[10px] font-mono uppercase block ${isDark ? 'text-white/40' : 'text-slate-400 font-semibold'}`}>
              Physiological Status
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs font-mono px-3 py-1 rounded-xl border ${getStatusBadgeStyle(animal.categoryStatus)} font-medium`}>
                ● {animal.categoryStatus}
              </span>
              <span className={`text-xs ${isDark ? 'text-white/50' : 'text-slate-600'}`}>
                Health: <strong className={isDark ? 'text-emerald-400' : 'text-emerald-700'}>{animal.healthStatus}</strong>
              </span>
            </div>
          </div>

          {/* Change Status Dropdown Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsChangingStatus(!isChangingStatus)}
              className={`px-3 py-1.5 text-xs font-mono rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
                isDark 
                  ? 'bg-white/[0.06] hover:bg-white/[0.12] border-white/10 text-white' 
                  : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800 shadow-2xs'
              }`}
            >
              <span>Update Status</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>

            {isChangingStatus && (
              <div className={`absolute right-0 top-full mt-1.5 z-20 w-48 rounded-xl shadow-xl py-1 text-xs font-mono border ${
                isDark ? 'bg-[#16231B] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-lg'
              }`}>
                <div className={`px-3 py-1 text-[10px] uppercase tracking-wider border-b ${
                  isDark ? 'text-white/40 border-white/5' : 'text-slate-400 border-slate-100'
                }`}>
                  Select New Status
                </div>
                {availableStatusOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleStatusChange(opt)}
                    className={`w-full text-left px-3 py-1.5 transition-colors flex items-center justify-between cursor-pointer ${
                      animal.categoryStatus === opt 
                        ? isDark ? 'text-emerald-300 font-semibold' : 'text-emerald-800 font-semibold bg-emerald-50'
                        : isDark ? 'text-white/70 hover:bg-white/10' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{opt}</span>
                    {animal.categoryStatus === opt && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 4 Detailed Info Metric Cards */}
        <div className="grid grid-cols-2 gap-3 text-xs font-mono">
          <div className={`p-3.5 rounded-xl border space-y-1 ${
            isDark ? 'bg-white/[0.02] border-white/5' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className={`text-[10px] uppercase flex items-center gap-1 ${isDark ? 'text-white/40' : 'text-slate-500 font-medium'}`}>
              <Calendar className="w-3 h-3 opacity-60" /> Animal Age
            </span>
            <span className={`text-sm font-medium block ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {animal.age}
            </span>
            <span className={`text-[10px] block ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
              Registered {animal.dateRegistered}
            </span>
          </div>

          <div className={`p-3.5 rounded-xl border space-y-1 ${
            isDark ? 'bg-white/[0.02] border-white/5' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className={`text-[10px] uppercase flex items-center gap-1 ${isDark ? 'text-white/40' : 'text-slate-500 font-medium'}`}>
              <Scale className="w-3 h-3 opacity-60" /> Scale Weight
            </span>
            <span className={`text-sm font-medium block ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {animal.weightKg ? `${animal.weightKg} kg` : 'Not recorded'}
            </span>
            <span className={`text-[10px] block ${isDark ? 'text-emerald-400/80' : 'text-emerald-700'}`}>
              Condition Score 3.5 / 5
            </span>
          </div>

          <div className={`p-3.5 rounded-xl border space-y-1 ${
            isDark ? 'bg-white/[0.02] border-white/5' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className={`text-[10px] uppercase flex items-center gap-1 ${isDark ? 'text-white/40' : 'text-slate-500 font-medium'}`}>
              <MapPin className="w-3 h-3 opacity-60" /> Assigned Location
            </span>
            <span className={`text-sm font-medium truncate block ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {animal.penOrPasture}
            </span>
            <span className={`text-[10px] block ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
              Nominal forage access
            </span>
          </div>

          <div className={`p-3.5 rounded-xl border space-y-1 ${
            isDark ? 'bg-white/[0.02] border-white/5' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className={`text-[10px] uppercase flex items-center gap-1 ${isDark ? 'text-white/40' : 'text-slate-500 font-medium'}`}>
              {animal.lastMilkingYieldL !== undefined ? (
                <>
                  <Droplets className="w-3 h-3 text-sky-500" /> Daily Yield
                </>
              ) : (
                <>
                  <Activity className="w-3 h-3 text-emerald-500" /> Health Rating
                </>
              )}
            </span>
            <span className={`text-sm font-semibold block ${
              animal.lastMilkingYieldL !== undefined 
                ? isDark ? 'text-sky-300' : 'text-sky-700' 
                : isDark ? 'text-emerald-300' : 'text-emerald-700'
            }`}>
              {animal.lastMilkingYieldL !== undefined ? `${animal.lastMilkingYieldL} L / day` : animal.healthStatus}
            </span>
            <span className={`text-[10px] block ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
              {animal.lastMilkingYieldL !== undefined ? 'Target: Parlour Grade A' : 'Zero veterinary flags'}
            </span>
          </div>
        </div>

        {/* Notes & Pedigree Section */}
        {animal.notes && (
          <div className={`p-4 rounded-2xl border space-y-1.5 ${
            isDark ? 'bg-black/30 border-white/5' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className={`text-[10px] font-mono uppercase tracking-wider block ${
              isDark ? 'text-white/40' : 'text-slate-400 font-semibold'
            }`}>
              Clinical & Management Notes
            </span>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
              {animal.notes}
            </p>
          </div>
        )}

        {/* Delete / Transfer Action */}
        <div className={`pt-3 border-t flex items-center justify-between ${
          isDark ? 'border-white/10' : 'border-slate-200'
        }`}>
          {!confirmDelete ? (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Transfer / De-register Animal</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs text-red-500 font-medium">Confirm removal from herd?</span>
              <button
                type="button"
                onClick={handleDeleteAnimal}
                className="px-2.5 py-1 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer"
              >
                Yes, Remove
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className={`px-2.5 py-1 text-xs rounded-lg ${isDark ? 'text-white/60 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Cancel
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all shadow-xs cursor-pointer"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
