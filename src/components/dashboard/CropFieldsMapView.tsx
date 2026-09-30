/// <reference types="@types/google.maps" />
import React, { useState, useEffect, useRef } from 'react';
import { 
  APIProvider, 
  Map, 
  AdvancedMarker, 
  MapControl, 
  ControlPosition, 
  useMap 
} from '@vis.gl/react-google-maps';
import { CropFieldSector, FarmOperator } from '../../types/farm';
import { useTheme } from '../../context/ThemeContext';
import { sound } from '../../utils/audio';
import { 
  Wheat, 
  Droplets, 
  Layers, 
  Plus, 
  X, 
  Check, 
  Undo, 
  Maximize2, 
  MapPin, 
  Activity, 
  Calendar, 
  Clock, 
  Sparkles, 
  RotateCw, 
  MousePointer, 
  Compass, 
  Info,
  Sprout
} from 'lucide-react';

interface CropFieldsMapViewProps {
  cropSectors: CropFieldSector[];
  operator: FarmOperator;
  onSelectCrop: (crop: CropFieldSector) => void;
  selectedCrop: CropFieldSector | null;
  onAddCropSector: (newCrop: CropFieldSector) => void;
  onUpdateIrrigation: (sectorId: string, status: 'idle' | 'active' | 'scheduled') => void;
}

// Key from env or fallback to provisioned key
const GOOGLE_MAPS_API_KEY = 
  import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyBIuVUJB6dfIwh10lR8_tKgbXlq4ET3QRU';

// Center on agricultural farm landscape (Willamette Valley farming zone)
const DEFAULT_CENTER = { lat: 44.8225, lng: -123.1415 };

/**
 * Native Google Maps Polygon wrapper with useMap hook
 */
const FieldBoundaryPolygon: React.FC<{
  paths: Array<{ lat: number; lng: number }>;
  strokeColor: string;
  fillColor: string;
  fillOpacity: number;
  strokeWeight: number;
  isSelected: boolean;
  onClick: () => void;
}> = ({ paths, strokeColor, fillColor, fillOpacity, strokeWeight, isSelected, onClick }) => {
  const map = useMap();
  const polygonRef = useRef<google.maps.Polygon | null>(null);

  useEffect(() => {
    if (!map || typeof window === 'undefined' || !window.google?.maps) return;

    const polygon = new window.google.maps.Polygon({
      paths,
      strokeColor,
      strokeOpacity: 0.95,
      strokeWeight: isSelected ? 3.5 : strokeWeight,
      fillColor,
      fillOpacity: isSelected ? 0.65 : fillOpacity,
      clickable: true,
      zIndex: isSelected ? 10 : 1,
      map
    });

    const clickListener = polygon.addListener('click', () => {
      onClick();
    });

    polygonRef.current = polygon;

    return () => {
      window.google.maps.event.removeListener(clickListener);
      polygon.setMap(null);
    };
  }, [map, paths, strokeColor, fillColor, fillOpacity, strokeWeight, isSelected, onClick]);

  return null;
};

/**
 * Interactive Drawing Controller for mapping new field areas
 */
const DrawingCanvasController: React.FC<{
  isDrawing: boolean;
  draftPoints: Array<{ lat: number; lng: number }>;
  onAddPoint: (pt: { lat: number; lng: number }) => void;
}> = ({ isDrawing, draftPoints, onAddPoint }) => {
  const map = useMap();
  const polylineRef = useRef<google.maps.Polyline | null>(null);
  const polygonRef = useRef<google.maps.Polygon | null>(null);

  // Map click listener to add boundary vertices
  useEffect(() => {
    if (!map || !isDrawing || typeof window === 'undefined' || !window.google?.maps) return;

    const listener = map.addListener('click', (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        onAddPoint({ lat: e.latLng.lat(), lng: e.latLng.lng() });
      }
    });

    // Change cursor to crosshair during drawing
    map.setOptions({ draggableCursor: 'crosshair' });

    return () => {
      window.google.maps.event.removeListener(listener);
      map.setOptions({ draggableCursor: '' });
    };
  }, [map, isDrawing, onAddPoint]);

  // Render in-progress polyline or polygon preview
  useEffect(() => {
    if (!map || typeof window === 'undefined' || !window.google?.maps) return;

    if (polylineRef.current) polylineRef.current.setMap(null);
    if (polygonRef.current) polygonRef.current.setMap(null);

    if (draftPoints.length >= 2) {
      if (draftPoints.length >= 3) {
        polygonRef.current = new window.google.maps.Polygon({
          paths: draftPoints,
          strokeColor: '#38BDF8',
          strokeOpacity: 0.9,
          strokeWeight: 2.5,
          fillColor: '#38BDF8',
          fillOpacity: 0.35,
          map
        });
      } else {
        polylineRef.current = new window.google.maps.Polyline({
          path: draftPoints,
          strokeColor: '#38BDF8',
          strokeOpacity: 0.9,
          strokeWeight: 2.5,
          map
        });
      }
    }

    return () => {
      if (polylineRef.current) polylineRef.current.setMap(null);
      if (polygonRef.current) polygonRef.current.setMap(null);
    };
  }, [map, draftPoints]);

  return null;
};

export const CropFieldsMapView: React.FC<CropFieldsMapViewProps> = ({
  cropSectors,
  operator,
  onSelectCrop,
  selectedCrop,
  onAddCropSector,
  onUpdateIrrigation
}) => {
  const { isDark } = useTheme();

  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [draftPoints, setDraftPoints] = useState<Array<{ lat: number; lng: number }>>([]);
  const [calculatedAcres, setCalculatedAcres] = useState<number>(0);
  const [isCommissionModalOpen, setIsCommissionModalOpen] = useState(false);

  // New Mapped Area Form State
  const [newFieldName, setNewFieldName] = useState('');
  const [newCropName, setNewCropName] = useState('Organic Soybeans');
  const [newVariety, setNewVariety] = useState('Golden Harvest Enlist');
  const [newCategory, setNewCategory] = useState<CropFieldSector['cropTypeCategory']>('Legume');
  const [newGrowthStage, setNewGrowthStage] = useState<CropFieldSector['growthStage']>('Vegetative');
  const [newColorHex, setNewColorHex] = useState('#3B82F6');
  const [newYieldTons, setNewYieldTons] = useState('110');
  const [formError, setFormError] = useState('');

  // Calculate live area when points change
  useEffect(() => {
    if (draftPoints.length < 3 || typeof window === 'undefined' || !window.google?.maps?.geometry?.spherical) {
      setCalculatedAcres(0);
      return;
    }

    try {
      const latLngs = draftPoints.map(p => new window.google.maps.LatLng(p.lat, p.lng));
      const areaM2 = window.google.maps.geometry.spherical.computeArea(latLngs);
      // 1 m² = 0.000247105 acres
      const acres = parseFloat((areaM2 * 0.000247105).toFixed(1));
      setCalculatedAcres(acres);
    } catch {
      setCalculatedAcres(0);
    }
  }, [draftPoints]);

  const handleStartDrawing = () => {
    sound.playKeyTap();
    setIsDrawing(true);
    setDraftPoints([]);
  };

  const handleAddPoint = (pt: { lat: number; lng: number }) => {
    sound.playKeyTap();
    setDraftPoints(prev => [...prev, pt]);
  };

  const handleUndoPoint = () => {
    sound.playBackspace();
    setDraftPoints(prev => prev.slice(0, -1));
  };

  const handleCancelDrawing = () => {
    sound.playBackspace();
    setIsDrawing(false);
    setDraftPoints([]);
    setCalculatedAcres(0);
  };

  const handleCompleteBoundary = () => {
    if (draftPoints.length < 3) return;
    sound.playSuccess();
    setIsCommissionModalOpen(true);
  };

  const handleSaveMappedCropArea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFieldName.trim() || !newCropName.trim()) {
      setFormError('Please enter a field name and crop variety');
      return;
    }

    // Compute center
    const lats = draftPoints.map(p => p.lat);
    const lngs = draftPoints.map(p => p.lng);
    const centerLat = lats.reduce((a, b) => a + b, 0) / lats.length;
    const centerLng = lngs.reduce((a, b) => a + b, 0) / lngs.length;

    const newSector: CropFieldSector = {
      id: `crop-mapped-${Date.now()}`,
      name: newFieldName.trim(),
      cropName: newCropName.trim(),
      variety: newVariety.trim() || 'Standard Field Strain',
      cropTypeCategory: newCategory,
      acreage: calculatedAcres > 0 ? calculatedAcres : 45.0,
      location: `Farm Quadrant ${Math.floor(1 + Math.random() * 4)} · Mapped Plot`,
      growthStage: newGrowthStage,
      plantingDate: new Date().toISOString().split('T')[0],
      estimatedHarvestDate: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
      healthScore: 94,
      soilMoistureVwc: 30.5,
      soilTempF: 65.2,
      sunlightHours: 11.5,
      irrigationStatus: 'scheduled',
      expectedYieldTons: parseFloat(newYieldTons) || 120,
      colorHex: newColorHex,
      centerCoordinate: { lat: centerLat, lng: centerLng },
      boundaryCoordinates: draftPoints,
      recentLogs: [
        {
          id: `cl-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          action: `Geospatially mapped and tagged ${newCropName} (${calculatedAcres} Acres)`,
          operator: operator.name
        }
      ]
    };

    sound.playSuccess();
    onAddCropSector(newSector);
    onSelectCrop(newSector);
    setIsCommissionModalOpen(false);
    setIsDrawing(false);
    setDraftPoints([]);
    setNewFieldName('');
    setFormError('');
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Top Map Action Bar */}
      <div className={`p-4 rounded-3xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
        isDark ? 'bg-[#131E17] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-xs'
      }`}>
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-600 text-white shadow-xs">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold tracking-tight">Geospatial Farm Satellite & Field Mapper</h2>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-semibold ${
                isDark ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-emerald-100 text-emerald-800 border-emerald-300'
              }`}>
                Google Maps API Active
              </span>
            </div>
            <p className={`text-xs ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
              Click any colored field polygon to inspect live crop vitals, or map out a new cultivation plot.
            </p>
          </div>
        </div>

        {/* Map Out Action Button */}
        <div className="flex items-center gap-2">
          {!isDrawing ? (
            <button
              type="button"
              onClick={handleStartDrawing}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Map Out New Crop Area</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 animate-fade-in">
              <button
                type="button"
                onClick={handleUndoPoint}
                disabled={draftPoints.length === 0}
                className={`px-3 py-2 rounded-xl text-xs font-mono border flex items-center gap-1.5 transition-colors cursor-pointer ${
                  draftPoints.length === 0
                    ? 'opacity-40 cursor-not-allowed'
                    : isDark ? 'bg-white/[0.05] hover:bg-white/[0.1] text-white border-white/10' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                }`}
              >
                <Undo className="w-3.5 h-3.5" />
                <span>Undo</span>
              </button>

              <button
                type="button"
                onClick={handleCancelDrawing}
                className={`px-3 py-2 rounded-xl text-xs font-mono border transition-colors cursor-pointer ${
                  isDark ? 'text-white/60 hover:text-white border-white/10' : 'text-slate-600 hover:text-slate-900 border-slate-200'
                }`}
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={draftPoints.length < 3}
                onClick={handleCompleteBoundary}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  draftPoints.length >= 3
                    ? 'bg-sky-500 hover:bg-sky-600 text-white shadow-md active:scale-95 animate-pulse'
                    : 'bg-slate-300 dark:bg-white/10 text-slate-500 cursor-not-allowed'
                }`}
              >
                <Check className="w-4 h-4" />
                <span>Save Crop Area ({draftPoints.length} pts)</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Map Container & Interactive Crop Dossier Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Google Map View (8 or 12 cols depending on selection) */}
        <div className={`relative rounded-3xl overflow-hidden border shadow-lg ${
          selectedCrop ? 'lg:col-span-8' : 'lg:col-span-12'
        } ${isDark ? 'border-white/10' : 'border-slate-200'} h-[540px]`}>
          <APIProvider apiKey={GOOGLE_MAPS_API_KEY} libraries={['geometry', 'marker', 'maps']}>
            <Map
              defaultCenter={DEFAULT_CENTER}
              defaultZoom={15}
              mapId="DEMO_MAP_ID"
              mapTypeId="hybrid"
              gestureHandling="greedy"
              disableDefaultUI={false}
              internalUsageAttributionIds={['gmp_git_agentskills_v1']}
              className="w-full h-full"
            >
              {/* Render Existing Field Polygons */}
              {cropSectors.map((crop) => {
                if (!crop.boundaryCoordinates || crop.boundaryCoordinates.length < 3) return null;
                const isSelected = selectedCrop?.id === crop.id;
                return (
                  <React.Fragment key={crop.id}>
                    <FieldBoundaryPolygon
                      paths={crop.boundaryCoordinates}
                      strokeColor={crop.colorHex || '#10B981'}
                      strokeWeight={isSelected ? 3.5 : 2}
                      fillColor={crop.colorHex || '#10B981'}
                      fillOpacity={isSelected ? 0.65 : 0.38}
                      isSelected={isSelected}
                      onClick={() => {
                        sound.playKeyTap();
                        onSelectCrop(crop);
                      }}
                    />

                    {/* Centered Crop Identification Marker */}
                    {crop.centerCoordinate && (
                      <AdvancedMarker
                        position={crop.centerCoordinate}
                        onClick={() => {
                          sound.playKeyTap();
                          onSelectCrop(crop);
                        }}
                      >
                        <div className={`px-2 py-1 rounded-xl shadow-md border text-[11px] font-mono font-bold flex items-center gap-1.5 backdrop-blur-md cursor-pointer transition-transform hover:scale-110 ${
                          isSelected
                            ? 'bg-emerald-600 text-white border-white ring-2 ring-emerald-400 scale-105'
                            : 'bg-black/80 text-white border-white/20'
                        }`}>
                          <Wheat className="w-3 h-3 text-amber-400 shrink-0" />
                          <span className="truncate max-w-[120px]">{crop.cropName.split(' ')[0]}</span>
                          <span className="opacity-75 text-[10px]">· {crop.acreage}Ac</span>
                        </div>
                      </AdvancedMarker>
                    )}
                  </React.Fragment>
                );
              })}

              {/* Drawing Controller for live custom polygon mapping */}
              <DrawingCanvasController
                isDrawing={isDrawing}
                draftPoints={draftPoints}
                onAddPoint={handleAddPoint}
              />
            </Map>
          </APIProvider>

          {/* Floating Live Guidance Overlay during Drawing Mode */}
          {isDrawing && (
            <div className={`absolute top-4 left-4 right-4 sm:right-auto sm:max-w-md p-4 rounded-2xl border backdrop-blur-xl shadow-2xl space-y-2 z-20 animate-fade-in ${
              isDark ? 'bg-[#0E1611]/90 border-sky-500/40 text-white' : 'bg-white/95 border-sky-300 text-slate-900'
            }`}>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-sky-400">
                <MousePointer className="w-4 h-4 animate-bounce" />
                <span>Field Perimeter Mapping Mode</span>
              </div>
              <p className="text-xs">
                Click across the satellite map to place perimeter vertices around the crop boundaries.
              </p>
              <div className="flex items-center justify-between text-xs font-mono pt-1 border-t border-white/10">
                <span>Vertices Placed: <strong>{draftPoints.length}</strong></span>
                <span className="text-emerald-400 font-bold">
                  {calculatedAcres > 0 ? `~${calculatedAcres} Acres Enclosed` : 'Need ≥ 3 points'}
                </span>
              </div>
            </div>
          )}

          {/* Map Legend Strip */}
          <div className={`absolute bottom-3 left-3 p-2 rounded-2xl border backdrop-blur-md flex items-center gap-3 text-[11px] font-mono z-10 ${
            isDark ? 'bg-black/75 border-white/10 text-white' : 'bg-white/90 border-slate-200 text-slate-800'
          }`}>
            <span className="text-slate-400 text-[10px] uppercase font-semibold">Crops:</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              <span>Silage Corn</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500 inline-block" />
              <span>Alfalfa</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
              <span>Greenhouse</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
              <span>Orchard</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 inline-block" />
              <span>Wheat</span>
            </div>
          </div>
        </div>

        {/* Selected Crop Dossier Card (Appears whenever a farmer clicks any mapped crop area) */}
        {selectedCrop && (
          <div className={`lg:col-span-4 p-6 rounded-3xl border flex flex-col justify-between shadow-xl space-y-4 animate-fade-in ${
            isDark ? 'bg-[#131E17] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between gap-2 pb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div 
                    className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-white shadow-xs"
                    style={{ backgroundColor: selectedCrop.colorHex || '#10B981' }}
                  >
                    <Wheat className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold tracking-tight">{selectedCrop.name}</h3>
                    <p className={`text-xs ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
                      {selectedCrop.location}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectCrop(null as any)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    isDark ? 'text-white/40 hover:text-white' : 'text-slate-400 hover:text-slate-700'
                  }`}
                  title="Close Card"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Crop & Variety Badge */}
              <div className={`p-3.5 rounded-2xl border font-mono space-y-1 ${
                isDark ? 'bg-black/30 border-white/5' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between text-[10px] uppercase text-slate-400">
                  <span>Species & Variety</span>
                  <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[9px] ${
                    isDark ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    ● {selectedCrop.growthStage}
                  </span>
                </div>
                <div className="text-sm font-bold text-emerald-500">{selectedCrop.cropName}</div>
                <div className="text-xs text-slate-400">{selectedCrop.variety}</div>
              </div>

              {/* Agronomy Metrics Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className={`p-2.5 rounded-xl border space-y-0.5 ${
                  isDark ? 'bg-white/[0.02] border-white/5' : 'bg-white border-slate-200'
                }`}>
                  <span className={`text-[10px] flex items-center gap-1 ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
                    <Layers className="w-3 h-3 text-emerald-500" /> Mapped Area
                  </span>
                  <div className="text-base font-bold">{selectedCrop.acreage} Acres</div>
                </div>

                <div className={`p-2.5 rounded-xl border space-y-0.5 ${
                  isDark ? 'bg-white/[0.02] border-white/5' : 'bg-white border-slate-200'
                }`}>
                  <span className={`text-[10px] flex items-center gap-1 ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
                    <Droplets className="w-3 h-3 text-sky-500" /> Soil Moisture
                  </span>
                  <div className="text-base font-bold text-sky-500">{selectedCrop.soilMoistureVwc}% VWC</div>
                </div>

                <div className={`p-2.5 rounded-xl border space-y-0.5 ${
                  isDark ? 'bg-white/[0.02] border-white/5' : 'bg-white border-slate-200'
                }`}>
                  <span className={`text-[10px] flex items-center gap-1 ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
                    <Calendar className="w-3 h-3 text-amber-500" /> Planted
                  </span>
                  <div className="font-semibold text-[11px] truncate">{selectedCrop.plantingDate}</div>
                </div>

                <div className={`p-2.5 rounded-xl border space-y-0.5 ${
                  isDark ? 'bg-white/[0.02] border-white/5' : 'bg-white border-slate-200'
                }`}>
                  <span className={`text-[10px] flex items-center gap-1 ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
                    <Sparkles className="w-3 h-3 text-purple-400" /> Est. Harvest
                  </span>
                  <div className="text-base font-bold text-purple-400">{selectedCrop.expectedYieldTons} Tons</div>
                </div>
              </div>

              {/* Agronomy Field Logs */}
              <div>
                <span className={`text-[10px] font-mono uppercase tracking-wider block mb-1.5 ${
                  isDark ? 'text-white/40' : 'text-slate-400 font-medium'
                }`}>
                  Recent Field Logs
                </span>
                <div className="space-y-1 max-h-28 overflow-y-auto pr-1">
                  {selectedCrop.recentLogs.map((log) => (
                    <div 
                      key={log.id}
                      className={`p-2 rounded-xl border text-[11px] font-mono ${
                        isDark ? 'bg-black/20 border-white/5' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>{log.operator}</span>
                        <span className="text-emerald-500 font-semibold">{log.timestamp}</span>
                      </div>
                      <p className="mt-0.5 truncate">{log.action}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Smart Irrigation Trigger */}
            <div className={`pt-3 border-t flex items-center justify-between gap-2 ${
              isDark ? 'border-white/10' : 'border-slate-200'
            }`}>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className={isDark ? 'text-white/50' : 'text-slate-500'}>Irrigation:</span>
                <span className={`font-bold uppercase text-[10px] px-2 py-0.5 rounded-md ${
                  selectedCrop.irrigationStatus === 'active'
                    ? 'bg-sky-500/20 text-sky-400 animate-pulse'
                    : 'bg-slate-200 dark:bg-white/10 text-slate-400'
                }`}>
                  ● {selectedCrop.irrigationStatus}
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  const next = selectedCrop.irrigationStatus === 'active' ? 'idle' : 'active';
                  onUpdateIrrigation(selectedCrop.id, next);
                }}
                className={`px-3 py-1.5 text-xs font-mono rounded-xl border flex items-center gap-1.5 cursor-pointer transition-all ${
                  selectedCrop.irrigationStatus === 'active'
                    ? 'bg-sky-600 text-white border-sky-600'
                    : isDark ? 'bg-white/[0.05] hover:bg-white/[0.1] text-white border-white/10' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <RotateCw className="w-3 h-3" />
                <span>{selectedCrop.irrigationStatus === 'active' ? 'Stop Valve' : 'Start Valve'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* MODAL: TAG & COMMISSION NEWLY MAPPED CROP AREA           */}
      {/* ======================================================== */}
      {isCommissionModalOpen && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md overflow-y-auto ${
          isDark ? 'bg-black/85' : 'bg-slate-900/40'
        }`}>
          <div className={`relative w-full max-w-lg rounded-3xl shadow-2xl p-6 sm:p-7 space-y-4 border my-6 ${
            isDark ? 'bg-[#131E17] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-start justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-600 text-white">
                  <Sprout className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Register Mapped Crop Area</h3>
                  <p className={`text-xs ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
                    Perimeter Enclosed: <strong>{draftPoints.length} GPS Vertices</strong> · Calculated: <strong>{calculatedAcres} Acres</strong>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCommissionModalOpen(false)}
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

            <form onSubmit={handleSaveMappedCropArea} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block mb-1 font-semibold uppercase text-[11px]">Field / Plot Name *</label>
                  <input
                    type="text"
                    required
                    value={newFieldName}
                    onChange={(e) => setNewFieldName(e.target.value)}
                    placeholder="e.g. East Pivot Field 4"
                    className={`w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block mb-1 font-semibold uppercase text-[11px]">Crop Species *</label>
                  <input
                    type="text"
                    required
                    value={newCropName}
                    onChange={(e) => setNewCropName(e.target.value)}
                    placeholder="e.g. Soybeans, Sunflowers, Sweet Corn"
                    className={`w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block mb-1 font-semibold uppercase text-[11px]">Crop Variety</label>
                  <input
                    type="text"
                    value={newVariety}
                    onChange={(e) => setNewVariety(e.target.value)}
                    placeholder="e.g. Pioneer 1197, Golden Harvest"
                    className={`w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block mb-1 font-semibold uppercase text-[11px]">Crop Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className={`w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      isDark ? 'bg-[#131E17] text-white border-white/10' : 'bg-white text-slate-900 border-slate-300'
                    }`}
                  >
                    <option value="Grain / Silage">Grain / Silage</option>
                    <option value="Forage">Forage / Hay</option>
                    <option value="Vegetable">Vegetable & Hydroponic</option>
                    <option value="Fruit & Orchard">Fruit & Orchard</option>
                    <option value="Legume">Legume / Pulse</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block mb-1 font-semibold uppercase text-[11px]">Growth Stage</label>
                  <select
                    value={newGrowthStage}
                    onChange={(e) => setNewGrowthStage(e.target.value as any)}
                    className={`w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      isDark ? 'bg-[#131E17] text-white border-white/10' : 'bg-white text-slate-900 border-slate-300'
                    }`}
                  >
                    <option value="Germination">Germination</option>
                    <option value="Vegetative">Vegetative</option>
                    <option value="Flowering">Flowering</option>
                    <option value="Maturity / Ripening">Maturity / Ripening</option>
                    <option value="Harvest Ready">Harvest Ready</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 font-semibold uppercase text-[11px]">Polygon Color</label>
                  <input
                    type="color"
                    value={newColorHex}
                    onChange={(e) => setNewColorHex(e.target.value)}
                    className="w-full h-9 rounded-xl border cursor-pointer p-0.5 bg-transparent"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-semibold uppercase text-[11px]">Est. Yield (Tons)</label>
                  <input
                    type="number"
                    value={newYieldTons}
                    onChange={(e) => setNewYieldTons(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsCommissionModalOpen(false)}
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
                  <span>Save to Satellite Map</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
