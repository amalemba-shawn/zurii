export interface FarmOperator {
  id: string;
  passcode: string;
  name: string;
  role: string;
  sector: string;
  avatarInitials: string;
  activeShift: string;
  assignedTasksCount: number;
  badgeId: string;
  clearanceLevel: 'Field Tech' | 'Specialist' | 'Supervisor' | 'Farm Manager';
}

export type LivestockCategory = 'dairy' | 'meat';
export type AnimalType = 'cows' | 'goats' | 'chicken' | 'ducks' | 'rabbits' | 'sheep' | 'pigs' | 'turkeys' | string;

export type DashboardDomain = 'animals' | 'crops';

export interface IoTSensor {
  id: string;
  name: string;
  type: 'climate' | 'soil_moisture' | 'water_level' | 'air_quality' | 'flow_meter' | 'rfid_gate' | 'power_solar';
  location: string;
  sectorId?: string;
  status: 'online' | 'warning' | 'offline';
  lastReading: {
    metric: string;
    value: number | string;
    unit: string;
    timestamp: string;
  };
  batteryLevel: number; // 0 - 100%
  signalQuality: 'Excellent' | 'Good' | 'Fair' | 'Weak';
  protocol: 'LoRaWAN 915MHz' | 'Cellular NB-IoT' | 'WiFi Mesh' | 'BLE 5.2';
  thresholds?: {
    min?: number;
    max?: number;
    warningText?: string;
  };
  installationDate: string;
}

export interface CropFieldSector {
  id: string;
  name: string;
  cropName: string;
  variety: string;
  acreage: number;
  location: string;
  growthStage: 'Germination' | 'Vegetative' | 'Flowering' | 'Maturity / Ripening' | 'Harvest Ready';
  plantingDate: string;
  estimatedHarvestDate: string;
  healthScore: number; // 0 - 100
  soilMoistureVwc: number; // %
  soilTempF: number;
  sunlightHours: number;
  irrigationStatus: 'idle' | 'active' | 'scheduled';
  expectedYieldTons: number;
  boundaryCoordinates?: Array<{ lat: number; lng: number }>;
  centerCoordinate?: { lat: number; lng: number };
  colorHex?: string;
  cropTypeCategory?: 'Grain / Silage' | 'Forage' | 'Vegetable' | 'Fruit & Orchard' | 'Legume' | 'Other';
  recentLogs: Array<{
    id: string;
    timestamp: string;
    action: string;
    operator: string;
  }>;
}

export type DairyAnimalStatus = 'Milking' | 'Dried' | 'Expecting' | 'Heifer / Kid' | 'Under Treatment';
export type MeatAnimalStatus = 'Growing / Pasture' | 'Finishing / Market Ready' | 'Breeding Stock' | 'Expecting' | 'Nursery';
export type PoultryAnimalStatus = 'Broiler' | 'Layer' | 'Grower' | 'Breeder';
export type AnimalPhysiologicalStatus = DairyAnimalStatus | MeatAnimalStatus | PoultryAnimalStatus | string;

export interface IndividualAnimal {
  id: string;
  sectorId: string;
  name: string;
  tagNumber: string; // Ear tag, RFID, band, tattoo
  age: string; // e.g. "3 yrs 2 mos" or "8 months"
  categoryStatus: AnimalPhysiologicalStatus; // 'Milking', 'Dried', 'Expecting', etc.
  breed: string;
  weightKg?: number;
  gender: 'Female' | 'Male';
  penOrPasture: string;
  healthStatus: 'Healthy' | 'Requires Observation' | 'Quarantined';
  lastMilkingYieldL?: number;
  dateRegistered: string;
  notes?: string;
  photoUrl?: string; // Animal photograph (Data URL or hosted image URL)
}

export interface LivestockSector {
  id: string; // e.g. 'cows-dairy', 'goats-dairy', 'cows-meat', 'goats-meat', 'chicken', 'ducks', 'rabbits'
  name: string;
  animalType: AnimalType;
  category: LivestockCategory;
  headCount: number;
  location: string;
  pastureOrPen: string;
  healthStatus: 'Optimal' | 'Attention Needed' | 'Quarantined';
  dailyOutput: {
    metricName: string; // e.g. 'Daily Milk Volume', 'Average Daily Gain (ADG)', 'Daily Egg Yield'
    metricValue: string; // e.g. '1,420 Liters', '+1.45 kg / day', '840 units'
    efficiency: string; // e.g. '98.2% of target', 'FCR 1.85', 'Butterfat 4.2%'
  };
  feedInventoryKg: number;
  waterConsumptionL: number;
  housingTemp: number; // in Fahrenheit
  alerts: string[];
  recentLogs: Array<{
    id: string;
    timestamp: string;
    action: string;
    operator: string;
  }>;
  animals?: IndividualAnimal[];
}

export interface MilkingRecord {
  id: string;
  species: 'cows' | 'goats';
  animalId?: string;
  animalName: string;
  tagNumber: string;
  breed: string;
  lactationStage?: 'Early Lactation' | 'Peak Lactation' | 'Mid Lactation' | 'Late Lactation';
  date: string; // YYYY-MM-DD
  morningLitres: number;
  eveningLitres: number;
  totalLitres: number;
  butterfatPercentage?: number;
  parlourStall?: string;
  healthNotes?: string;
  milkerOperator: string;
  timestamp: string;
}

export interface EggCollectionRecord {
  id: string;
  sourceSpecies: 'chicken' | 'ducks';
  flockSectorId: string;
  date: string; // YYYY-MM-DD
  timeOfDay: 'Morning (AM)' | 'Afternoon (Noon)' | 'Evening (PM)';
  cleanEggsCount: number;
  crackedEggsCount: number;
  totalEggsCount: number;
  eggGrade?: 'Grade A Large' | 'Grade AA Jumbo' | 'Medium / Pullet' | 'Duck Free-Range';
  averageEggWeightGrams?: number;
  flatsCount?: number; // 30-egg tray flats
  storageLocation: string;
  notes?: string;
  operator: string;
  timestamp: string;
}

export interface DayForecast {
  day: string;
  date: string;
  tempHigh: number;
  tempLow: number;
  condition: 'Sunny' | 'Partly Cloudy' | 'Overcast' | 'Light Rain' | 'Showers' | 'Clear Night';
  rainProbability: number;
  windSpeed: number;
  grazingIndex: 'Optimal' | 'Fair' | 'Heat Caution' | 'Shelter Recommended';
  advisory: string;
}

export interface WeatherData {
  currentTemp: number;
  feelsLike: number;
  humidity: number;
  dewPoint: number;
  barometer: number;
  windSpeed: number;
  windDirection: string;
  uvIndex: number;
  condition: string;
  livestockAdvisory: string;
  hourlyForecast: Array<{
    time: string;
    temp: number;
    rainProb: number;
    condition: string;
  }>;
  dailyForecast: DayForecast[];
}

export interface SectorTelemetry {
  id: string;
  name: string;
  crop: string;
  soilMoisture: number;
  soilTemp: number;
  ambientTemp: number;
  humidity: number;
  sunlightHours: number;
  irrigationStatus: 'idle' | 'active' | 'scheduled';
  healthScore: number;
}

export interface FarmTask {
  id: string;
  title: string;
  time: string;
  location: string;
  priority: 'low' | 'normal' | 'urgent';
  completed: boolean;
  sectorId?: string;
}
