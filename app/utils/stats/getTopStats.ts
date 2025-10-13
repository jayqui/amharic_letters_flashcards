export const todayStats = {
  'ም': { correct: 2, attempted: 3 },
  'ሂ': { correct: 1, attempted: 5 },
  'ቸ': { correct: 0, attempted: 5 },
  'ሌ': { correct: 0, attempted: 5 },
  'ሎ': { correct: 0, attempted: 3 },
  'ህ': { correct: 0, attempted: 5 },
  'ር': { correct: 5, attempted: 5 },
  'ሯ': { correct: 0, attempted: 4 },
  'ሉ': { correct: 2, attempted: 4 },
  'ሆ': { correct: 3, attempted: 5 },
  'ሲ': { correct: 0, attempted: 5 },
};

export const allTimeStats = {
  'ም': { correct: 12, attempted: 13 },
  'ሲ': { correct: 10, attempted: 15 },
  'ሯ': { correct: 0, attempted: 15 },
  'ሆ': { correct: 13, attempted: 15 },
  'ሉ': { correct: 12, attempted: 14 },
  'ሂ': { correct: 11, attempted: 15 },
  'ቸ': { correct: 10, attempted: 15 },
  'ሌ': { correct: 2, attempted: 15 },
  'ር': { correct: 15, attempted: 15 },
  'ሎ': { correct: 3, attempted: 15 },
  'ህ': { correct: 10, attempted: 15 },
};

type FidelStats = { correct: number; attempted: number };
type StatsWithPercentage = FidelStats & { percentage: number; fidel: string };

function calculatePercentage(correct: number, attempted: number): number {
  return attempted === 0 ? 0 : (correct / attempted) * 100;
}

export function getBestAndWorstStats(stats: Record<string, FidelStats>) {
  const statsWithPercentages: StatsWithPercentage[] = Object.entries(stats).map(([fidel, { correct, attempted }]) => ({
    fidel,
    correct,
    attempted,
    percentage: calculatePercentage(correct, attempted),
  }));

  // Sort by percentage (descending for best, ascending for worst)
  const sortedByPercentage = statsWithPercentages.sort((a, b) => b.percentage - a.percentage);

  const bestStats = sortedByPercentage.slice(0, 5).reduce((acc, { fidel, correct, attempted }) => {
    acc[fidel] = { correct, attempted };
    return acc;
  }, {} as Record<string, FidelStats>);

  const worstStats = sortedByPercentage.slice(-5).reduce((acc, { fidel, correct, attempted }) => {
    acc[fidel] = { correct, attempted };
    return acc;
  }, {} as Record<string, FidelStats>);

  return { bestStats, worstStats };
}

export const todayBestStats = getBestAndWorstStats(todayStats).bestStats;
export const todayWorstStats = getBestAndWorstStats(todayStats).worstStats;
export const allTimeBestStats = getBestAndWorstStats(allTimeStats).bestStats;
export const allTimeWorstStats = getBestAndWorstStats(allTimeStats).worstStats;
