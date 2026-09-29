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
export type AnimalType = 'cows' | 'goats' | 'chicken' | 'ducks' | 'rabbits';

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
