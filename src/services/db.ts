import { FarmOperator, SectorTelemetry, FarmTask } from '../types/farm';

/**
 * Farm Database Service Layer
 * 
 * Replace these storage methods with your own database client:
 * (e.g., Supabase, PostgreSQL via Prisma/Drizzle, Firebase, or custom REST API).
 */

const STORAGE_KEY_OPERATORS = 'farm_db_operators';
const STORAGE_KEY_SECTORS = 'farm_db_sectors';
const STORAGE_KEY_TASKS = 'farm_db_tasks';

export const farmDb = {
  // --- Operators ---
  async getOperators(): Promise<FarmOperator[]> {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_KEY_OPERATORS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
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
