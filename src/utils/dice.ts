export type DieType = 4 | 6 | 8 | 10 | 12 | 20;

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

export const DICE_TYPES: DieType[] = [4, 6, 8, 10, 12, 20];

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function rollDie(type: DieType): number {
  return Math.floor(Math.random() * type) + 1;
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
