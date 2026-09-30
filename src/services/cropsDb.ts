import { CropFieldSector } from '../types/farm';

const STORAGE_KEY_CROPS = 'solum_farm_crops_sectors_v2';

export const INITIAL_CROP_SECTORS: CropFieldSector[] = [
  {
    id: 'crop-greenhouse-1',
    name: 'Greenhouse Alpha (Climate Controlled)',
    cropName: 'Heirloom Vine Tomatoes & Bell Peppers',
    variety: 'Cherokee Purple & Red Bull',
    cropTypeCategory: 'Vegetable',
    acreage: 2.8,
    location: 'Zone 1 · Controlled Polycarbonate Bay',
    growthStage: 'Flowering',
    plantingDate: '2024-02-15',
    estimatedHarvestDate: '2024-06-20',
    healthScore: 97,
    soilMoistureVwc: 44.5,
    soilTempF: 71.2,
    sunlightHours: 12.5,
    irrigationStatus: 'active',
    expectedYieldTons: 28.5,
    colorHex: '#F59E0B',
    centerCoordinate: { lat: 44.8236, lng: -123.1425 },
    boundaryCoordinates: [
      { lat: 44.8230, lng: -123.1435 },
      { lat: 44.8242, lng: -123.1435 },
      { lat: 44.8242, lng: -123.1415 },
      { lat: 44.8230, lng: -123.1415 }
    ],
    recentLogs: [
      { id: 'cl-1', timestamp: '08:15 AM', action: 'Drip fertigation line automated pulse (EC 2.2 mS/cm)', operator: 'Marcus Holt' },
      { id: 'cl-2', timestamp: '06:30 AM', action: 'Bumblebee pollination activity check verified nominal', operator: 'Elena Vance' }
    ]
  },
  {
    id: 'crop-pivot-1',
    name: 'North Pivot Field 1 (Dairy Silage)',
    cropName: 'High-Energy Silage Corn',
    variety: 'Pioneer 1197AM',
    cropTypeCategory: 'Grain / Silage',
    acreage: 125,
    location: 'North Prairie Basin · Center Pivot 1',
    growthStage: 'Vegetative',
    plantingDate: '2024-04-10',
    estimatedHarvestDate: '2024-09-15',
    healthScore: 92,
    soilMoistureVwc: 31.8,
    soilTempF: 66.4,
    sunlightHours: 11.2,
    irrigationStatus: 'scheduled',
    expectedYieldTons: 520,
    colorHex: '#10B981',
    centerCoordinate: { lat: 44.8270, lng: -123.1400 },
    boundaryCoordinates: [
      { lat: 44.8260, lng: -123.1460 },
      { lat: 44.8290, lng: -123.1445 },
      { lat: 44.8305, lng: -123.1400 },
      { lat: 44.8295, lng: -123.1350 },
      { lat: 44.8265, lng: -123.1340 },
      { lat: 44.8240, lng: -123.1365 },
      { lat: 44.8235, lng: -123.1420 },
      { lat: 44.8245, lng: -123.1455 }
    ],
    recentLogs: [
      { id: 'cl-3', timestamp: 'Yesterday', action: 'Tissue nitrogen sap test verified optimal vegetative nitrogen', operator: 'Marcus Holt' },
      { id: 'cl-4', timestamp: '3 days ago', action: 'Pivot rotation rate set to 0.65 inches / revolution', operator: 'Liam Cooper' }
    ]
  },
  {
    id: 'crop-pivot-2',
    name: 'West Pivot Field 2 (Dairy Fodder)',
    cropName: 'Stand-Fast Alfalfa Hay',
    variety: 'WL 375HQ (High Relative Feed Value)',
    cropTypeCategory: 'Forage',
    acreage: 80,
    location: 'West Terrace Ridge · Center Pivot 2',
    growthStage: 'Harvest Ready',
    plantingDate: '2023-09-01',
    estimatedHarvestDate: '2024-05-18',
    healthScore: 95,
    soilMoistureVwc: 27.4,
    soilTempF: 64.0,
    sunlightHours: 11.5,
    irrigationStatus: 'idle',
    expectedYieldTons: 175,
    colorHex: '#059669',
    centerCoordinate: { lat: 44.8210, lng: -123.1480 },
    boundaryCoordinates: [
      { lat: 44.8200, lng: -123.1520 },
      { lat: 44.8240, lng: -123.1500 },
      { lat: 44.8245, lng: -123.1445 },
      { lat: 44.8210, lng: -123.1440 },
      { lat: 44.8185, lng: -123.1475 },
      { lat: 44.8180, lng: -123.1510 }
    ],
    recentLogs: [
      { id: 'cl-5', timestamp: '07:00 AM', action: 'Cutting planned for 3rd cutting high-protein dairy bale', operator: 'Elena Vance' }
    ]
  },
  {
    id: 'crop-orchard',
    name: 'South Terrace Orchard Block',
    cropName: 'Honeycrisp Apples & Sweet Cherries',
    variety: 'Royal Honeycrisp on M9 Rootstock',
    cropTypeCategory: 'Fruit & Orchard',
    acreage: 38,
    location: 'South Slopes · Microclimate Valley',
    growthStage: 'Maturity / Ripening',
    plantingDate: '2021-04-05',
    estimatedHarvestDate: '2024-08-30',
    healthScore: 89,
    soilMoistureVwc: 34.0,
    soilTempF: 65.5,
    sunlightHours: 12.0,
    irrigationStatus: 'idle',
    expectedYieldTons: 72,
    colorHex: '#F43F5E',
    centerCoordinate: { lat: 44.8185, lng: -123.1395 },
    boundaryCoordinates: [
      { lat: 44.8175, lng: -123.1430 },
      { lat: 44.8205, lng: -123.1425 },
      { lat: 44.8200, lng: -123.1360 },
      { lat: 44.8165, lng: -123.1370 }
    ],
    recentLogs: [
      { id: 'cl-6', timestamp: '2 days ago', action: 'Micro-sprinkler frost mitigation system pressure test passed', operator: 'Liam Cooper' }
    ]
  },
  {
    id: 'crop-terrace-3',
    name: 'Terrace Field 3 (Grain Rotation)',
    cropName: 'Hard Red Winter Wheat',
    variety: 'WestBred WB9719',
    cropTypeCategory: 'Grain / Silage',
    acreage: 95,
    location: 'East Bench · Dryland Contour',
    growthStage: 'Vegetative',
    plantingDate: '2023-10-14',
    estimatedHarvestDate: '2024-07-25',
    healthScore: 91,
    soilMoistureVwc: 26.2,
    soilTempF: 63.8,
    sunlightHours: 11.8,
    irrigationStatus: 'scheduled',
    expectedYieldTons: 195,
    colorHex: '#EAB308',
    centerCoordinate: { lat: 44.8232, lng: -123.1308 },
    boundaryCoordinates: [
      { lat: 44.8220, lng: -123.1345 },
      { lat: 44.8255, lng: -123.1330 },
      { lat: 44.8250, lng: -123.1270 },
      { lat: 44.8205, lng: -123.1285 }
    ],
    recentLogs: [
      { id: 'cl-7', timestamp: '4 days ago', action: 'Drone NDVI aerial multispectral canopy analysis: Index 0.81', operator: 'Marcus Holt' }
    ]
  }
];

export const cropsDb = {
  getCropSectors(): CropFieldSector[] {
    if (typeof window === 'undefined') return INITIAL_CROP_SECTORS;
    try {
      const data = localStorage.getItem(STORAGE_KEY_CROPS);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // Ignore
    }
    localStorage.setItem(STORAGE_KEY_CROPS, JSON.stringify(INITIAL_CROP_SECTORS));
    return INITIAL_CROP_SECTORS;
  },

  updateIrrigationStatus(sectorId: string, status: 'idle' | 'active' | 'scheduled', operatorName: string): CropFieldSector[] {
    const sectors = this.getCropSectors();
    const updated = sectors.map(sec => {
      if (sec.id === sectorId) {
        const newLog = {
          id: `cl-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          action: `Irrigation valve switched to: ${status.toUpperCase()}`,
          operator: operatorName
        };
        return {
          ...sec,
          irrigationStatus: status,
          recentLogs: [newLog, ...sec.recentLogs.slice(0, 8)]
        };
      }
      return sec;
    });
    localStorage.setItem(STORAGE_KEY_CROPS, JSON.stringify(updated));
    return updated;
  },

  addCropSector(newCrop: CropFieldSector): CropFieldSector[] {
    const sectors = this.getCropSectors();
    const updated = [newCrop, ...sectors];
    localStorage.setItem(STORAGE_KEY_CROPS, JSON.stringify(updated));
    return updated;
  },

  deleteCropSector(sectorId: string): CropFieldSector[] {
    const sectors = this.getCropSectors();
    const updated = sectors.filter(s => s.id !== sectorId);
    localStorage.setItem(STORAGE_KEY_CROPS, JSON.stringify(updated));
    return updated;
  }
};
