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

export interface SectorTelemetry {
  id: string;
  name: string;
  crop: string;
  soilMoisture: number; // percentage
  soilTemp: number; // fahrenheit
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
}

export interface FarmActivityLog {
  id: string;
  timestamp: string;
  operator: string;
  action: string;
  sector: string;
}
