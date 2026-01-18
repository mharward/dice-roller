export type DieType = 4 | 6 | 8 | 10 | 100 | 12 | 20;

export interface PoolDie {
  id: string;
  type: DieType;
  value: number | null;
}

export interface HistoryEntry {
  id: string;
  dice: PoolDie[];
  total: number;
  timestamp: number;
}

export const DICE_TYPES: DieType[] = [4, 6, 8, 10, 100, 12, 20];

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function rollDie(type: DieType): number {
  if (type === 100) {
    // Percentile die: 10, 20, 30... 90, 100 (100 represents "00")
    return (Math.floor(Math.random() * 10) + 1) * 10;
  }
  return Math.floor(Math.random() * type) + 1;
}

// Display value for dice (handles percentile "00" display)
export function getDieDisplayValue(die: PoolDie): string {
  if (die.value === null) return '?';
  if (die.type === 100 && die.value === 100) return '00';
  return String(die.value);
}

export function createDie(type: DieType): PoolDie {
  return {
    id: generateId(),
    type,
    value: null,
  };
}

export function rollPool(pool: PoolDie[]): PoolDie[] {
  return pool.map(die => ({
    ...die,
    value: rollDie(die.type),
  }));
}

export function calculateTotal(dice: PoolDie[]): number {
  return dice.reduce((sum, die) => sum + (die.value || 0), 0);
}
