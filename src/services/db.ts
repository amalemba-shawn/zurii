import { FarmOperator, SectorTelemetry, FarmTask } from '../types/farm';

const STORAGE_KEY_OPERATORS = 'farm_db_operators';
const STORAGE_KEY_SECTORS = 'farm_db_sectors';
const STORAGE_KEY_TASKS = 'farm_db_tasks';

export const INITIAL_OPERATORS: FarmOperator[] = [
  {
    id: 'op-elena',
    name: 'Elena Vance',
    role: 'Farm Manager',
    clearanceLevel: 'Farm Manager',
    sector: 'All Farm Sectors',
    passcode: '1234',
    avatarInitials: 'EV',
    activeShift: '06:00 – 16:00',
    assignedTasksCount: 5,
    badgeId: 'MGR-001'
  },
  {
    id: 'op-marcus',
    name: 'Marcus Holt',
    role: 'Admin & Operations Lead',
    clearanceLevel: 'Farm Manager',
    sector: 'Agronomy & Livestock',
    passcode: '5678',
    avatarInitials: 'MH',
    activeShift: '07:00 – 17:00',
    assignedTasksCount: 4,
    badgeId: 'ADM-002'
  },
  {
    id: 'op-sarah',
    name: 'Sarah Jenkins',
    role: 'Senior Milking Specialist',
    clearanceLevel: 'Specialist',
    sector: 'Dairy Cattle & Parlour',
    passcode: '9900',
    avatarInitials: 'SJ',
    activeShift: '05:00 – 14:00',
    assignedTasksCount: 3,
    badgeId: 'VET-104'
  },
  {
    id: 'op-liam',
    name: 'Liam Cooper',
    role: 'Field Technician',
    clearanceLevel: 'Field Tech',
    sector: 'Pastures & Greenhouses',
    passcode: '4321',
    avatarInitials: 'LC',
    activeShift: '08:00 – 17:00',
    assignedTasksCount: 2,
    badgeId: 'OPR-210'
  }
];

export const farmDb = {
  // --- Operators ---
  async getOperators(): Promise<FarmOperator[]> {
    if (typeof window === 'undefined') return INITIAL_OPERATORS;
    try {
      const data = localStorage.getItem(STORAGE_KEY_OPERATORS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Ignore
    }
    localStorage.setItem(STORAGE_KEY_OPERATORS, JSON.stringify(INITIAL_OPERATORS));
    return INITIAL_OPERATORS;
  },

  async verifyPasscode(passcode: string): Promise<FarmOperator | null> {
    const operators = await this.getOperators();
    return operators.find((op) => op.passcode === passcode) || null;
  },

  async saveOperator(operator: FarmOperator): Promise<void> {
    const operators = await this.getOperators();
    const updated = [...operators.filter((o) => o.id !== operator.id), operator];
    localStorage.setItem(STORAGE_KEY_OPERATORS, JSON.stringify(updated));
  },

  async updateOperatorRole(
    operatorId: string, 
    newRole: string, 
    newClearance: 'Field Tech' | 'Specialist' | 'Supervisor' | 'Farm Manager',
    newSector?: string
  ): Promise<FarmOperator[]> {
    const operators = await this.getOperators();
    const updated = operators.map(op => {
      if (op.id === operatorId) {
        return {
          ...op,
          role: newRole,
          clearanceLevel: newClearance,
          sector: newSector || op.sector
        };
      }
      return op;
    });
    localStorage.setItem(STORAGE_KEY_OPERATORS, JSON.stringify(updated));
    return updated;
  },

  async deleteOperator(operatorId: string): Promise<void> {
    const operators = await this.getOperators();
    const updated = operators.filter((o) => o.id !== operatorId);
    localStorage.setItem(STORAGE_KEY_OPERATORS, JSON.stringify(updated));
  },

  // --- Sectors / Telemetry ---
  async getSectors(): Promise<SectorTelemetry[]> {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_KEY_SECTORS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  async saveSector(sector: SectorTelemetry): Promise<void> {
    const sectors = await this.getSectors();
    const updated = [...sectors.filter((s) => s.id !== sector.id), sector];
    localStorage.setItem(STORAGE_KEY_SECTORS, JSON.stringify(updated));
  },

  // --- Tasks ---
  async getTasks(): Promise<FarmTask[]> {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_KEY_TASKS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  async saveTask(task: FarmTask): Promise<void> {
    const tasks = await this.getTasks();
    const updated = [...tasks.filter((t) => t.id !== task.id), task];
    localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(updated));
  },

  // --- Clear all data ---
  clearDatabase(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY_OPERATORS);
    localStorage.removeItem(STORAGE_KEY_SECTORS);
    localStorage.removeItem(STORAGE_KEY_TASKS);
  }
};
