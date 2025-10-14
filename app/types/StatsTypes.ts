export interface FidelStats {
  correct: number;
  attempted: number;
}

export interface StatsSection {
  [fidel: string]: FidelStats;
}
