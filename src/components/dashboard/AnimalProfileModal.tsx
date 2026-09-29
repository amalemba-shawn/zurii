import React, { useState } from 'react';
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
  Clock
} from 'lucide-react';
import { sound } from '../../utils/audio';

interface AnimalProfileModalProps {
  animal: IndividualAnimal | null;
  sector: LivestockSector;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (animalId: string, newStatus: AnimalPhysiologicalStatus) => void;
  onRemove: (animalId: string, reason: string) => void;
}

export const AnimalProfileModal: React.FC<AnimalProfileModalProps> = ({
  animal,
  sector,
  isOpen,
  onClose,
  onUpdateStatus,
  onRemove
}) => {
  const [isChangingStatus, setIsChangingStatus] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!isOpen || !animal) return null;

  const isDairy = sector.category === 'dairy';

  const availableStatusOptions: AnimalPhysiologicalStatus[] = isDairy
    ? ['Milking', 'Dried', 'Expecting', 'Heifer / Kid', 'Under Treatment']
    : sector.animalType === 'chicken' || sector.animalType === 'ducks'
    ? ['Broiler', 'Layer', 'Grower', 'Breeder']
    : ['Growing / Pasture', 'Finishing / Market Ready', 'Breeding Stock', 'Expecting', 'Nursery'];

  const getStatusBadgeStyle = (status: string) => {
    const lower = status.toLowerCase();
    if (lower.includes('milking')) return 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300';
    if (lower.includes('expecting')) return 'bg-purple-950/80 border-purple-500/50 text-purple-300';
    if (lower.includes('dried')) return 'bg-zinc-800 border-zinc-600/50 text-zinc-300';
    if (lower.includes('finishing') || lower.includes('market')) return 'bg-amber-950/80 border-amber-500/50 text-amber-300';
    if (lower.includes('breeding')) return 'bg-sky-950/80 border-sky-500/50 text-sky-300';
    return 'bg-white/[0.08] border-white/20 text-white/80';
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#131E17] border border-white/10 rounded-3xl shadow-2xl p-6 sm:p-7 text-white space-y-6 my-6 max-h-[92vh] overflow-y-auto">
        {/* Top Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#1F3325] border border-emerald-500/30 flex items-center justify-center text-sm font-mono font-bold text-emerald-300 shadow-md">
              {animal.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  {animal.name}
                </h2>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-lg bg-black/50 border border-emerald-500/30 text-emerald-400 font-semibold tracking-wider">
                  {animal.tagNumber}
                </span>
              </div>
              <p className="text-xs text-white/50 mt-0.5">
                {animal.breed} <span className="text-white/30">·</span> {animal.gender} <span className="text-white/30">·</span> {sector.name}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-white/40 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Strip & Quick Change */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-mono uppercase text-white/40 block">
              Physiological Status
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs font-mono px-3 py-1 rounded-xl border ${getStatusBadgeStyle(animal.categoryStatus)} font-medium`}>
                ● {animal.categoryStatus}
              </span>
              <span className="text-xs text-white/50">
                Health: <strong className="text-emerald-400">{animal.healthStatus}</strong>
              </span>
            </div>
          </div>

          {/* Change Status Dropdown Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsChangingStatus(!isChangingStatus)}
              className="px-3 py-1.5 text-xs font-mono rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white flex items-center gap-1.5 transition-all"
            >
              <span>Update Status</span>
              <ChevronDown className="w-3.5 h-3.5 text-white/60" />
            </button>

            {isChangingStatus && (
              <div className="absolute right-0 top-full mt-1.5 z-20 w-48 rounded-xl bg-[#16231B] border border-white/10 shadow-xl py-1 text-xs font-mono">
                <div className="px-3 py-1 text-[10px] text-white/40 uppercase tracking-wider border-b border-white/5">
                  Select New Status
                </div>
                {availableStatusOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleStatusChange(opt)}
                    className={`w-full text-left px-3 py-1.5 hover:bg-white/10 transition-colors flex items-center justify-between ${
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

        {/* 4 Detailed Info Metric Cards */}
        <div className="grid grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
            <span className="text-white/40 text-[10px] uppercase flex items-center gap-1">
              <Calendar className="w-3 h-3 text-white/30" /> Animal Age
            </span>
            <span className="text-sm font-medium text-white block">
              {animal.age}
            </span>
            <span className="text-[10px] text-white/40 block">
              Registered {animal.dateRegistered}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
            <span className="text-white/40 text-[10px] uppercase flex items-center gap-1">
              <Scale className="w-3 h-3 text-white/30" /> Scale Weight
            </span>
            <span className="text-sm font-medium text-white block">
              {animal.weightKg ? `${animal.weightKg} kg` : 'Not recorded'}
            </span>
            <span className="text-[10px] text-emerald-400/80 block">
              Condition Score 3.5 / 5
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
            <span className="text-white/40 text-[10px] uppercase flex items-center gap-1">
              <MapPin className="w-3 h-3 text-white/30" /> Assigned Location
            </span>
            <span className="text-sm font-medium text-white truncate block">
              {animal.penOrPasture}
            </span>
            <span className="text-[10px] text-white/40 block">
              Nominal forage access
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
            <span className="text-white/40 text-[10px] uppercase flex items-center gap-1">
              {animal.lastMilkingYieldL !== undefined ? (
                <>
                  <Droplets className="w-3 h-3 text-sky-400" /> Daily Yield
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3 h-3 text-emerald-400" /> Welfare Index
                </>
              )}
            </span>
            <span className={`text-sm font-medium block ${
              animal.lastMilkingYieldL !== undefined ? 'text-emerald-300 font-bold' : 'text-white'
            }`}>
              {animal.lastMilkingYieldL !== undefined ? `${animal.lastMilkingYieldL} L / day` : 'Optimal'}
            </span>
            <span className="text-[10px] text-white/40 block">
              {animal.lastMilkingYieldL !== undefined ? 'Automated parlour test' : 'Vaccinated & Tagged'}
            </span>
          </div>
        </div>

        {/* Veterinary & Care Notes */}
        <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2 text-xs">
          <div className="flex items-center justify-between text-white/70">
            <span className="font-mono text-[10px] uppercase text-white/40">
              Veterinary & Nutritional Notes
            </span>
            <span className="text-emerald-400 font-mono text-[10px]">
              Active Record
            </span>
          </div>
          <p className="text-white/80 leading-relaxed text-xs">
            {animal.notes || 'Routine health and pasture checks up to date. No antibiotics or active withdrawal periods logged.'}
          </p>
        </div>

        {/* Footer Actions: Delete / Close */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between">
          {!confirmDelete ? (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="text-xs text-red-400/70 hover:text-red-300 flex items-center gap-1 font-mono transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Transfer / Remove Animal</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs text-red-300 font-mono">Confirm removal?</span>
              <button
                type="button"
                onClick={handleDeleteAnimal}
                className="px-2.5 py-1 text-xs font-semibold bg-red-950/80 border border-red-500/50 text-red-200 rounded-lg"
              >
                Yes, Remove
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="px-2 py-1 text-xs text-white/50 hover:text-white"
              >
                Cancel
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-white/[0.08] hover:bg-white/[0.14] text-white rounded-xl transition-all"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
