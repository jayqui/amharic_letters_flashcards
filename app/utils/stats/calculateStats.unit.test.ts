import { todayStats, allTimeStats, getBestAndWorstStats } from './calculateStats';

describe('calculateStats', () => {
  describe('getBestAndWorstStats', () => {
    it('should return 5 best and 5 worst stats from todayStats', () => {
      const result = getBestAndWorstStats(todayStats);

      // Check that we get exactly 5 best and 5 worst
      expect(Object.keys(result.bestStats)).toHaveLength(5);
      expect(Object.keys(result.worstStats)).toHaveLength(5);

      // Check that best stats are actually the highest percentages
      const bestPercentages = Object.entries(result.bestStats).map(([fidel, stats]) =>
        (stats.correct / stats.attempted) * 100
      );
      const worstPercentages = Object.entries(result.worstStats).map(([fidel, stats]) =>
        (stats.correct / stats.attempted) * 100
      );

      // Best should be higher percentages than worst
      const minBestPercentage = Math.min(...bestPercentages);
      const maxWorstPercentage = Math.max(...worstPercentages);
      expect(minBestPercentage).toBeGreaterThanOrEqual(maxWorstPercentage);
    });

    it('should return 5 best and 5 worst stats from allTimeStats', () => {
      const result = getBestAndWorstStats(allTimeStats);

      // Check that we get exactly 5 best and 5 worst
      expect(Object.keys(result.bestStats)).toHaveLength(5);
      expect(Object.keys(result.worstStats)).toHaveLength(5);
    });

    it('should handle stats with zero attempts correctly', () => {
      const testStats = {
        'ር': { correct: 0, attempted: 0 },
        'ም': { correct: 5, attempted: 5 },
        'ሆ': { correct: 0, attempted: 5 },
        'ሉ': { correct: 2, attempted: 4 },
        'ሂ': { correct: 1, attempted: 5 },
        'ቸ': { correct: 0, attempted: 5 },
        'ሌ': { correct: 0, attempted: 5 },
        'ሎ': { correct: 0, attempted: 3 },
        'ህ': { correct: 0, attempted: 5 },
        'ሯ': { correct: 0, attempted: 4 },
        'ሲ': { correct: 0, attempted: 5 },
      };

      const result = getBestAndWorstStats(testStats);

      // Should handle zero attempts (should be treated as 0% success)
      expect(Object.keys(result.bestStats)).toHaveLength(5);
      expect(Object.keys(result.worstStats)).toHaveLength(5);

      // The perfect score (5/5) should be in best stats
      expect(result.bestStats['ም']).toEqual({ correct: 5, attempted: 5 });
    });

    it('should return all stats when there are 5 or fewer total stats', () => {
      const smallStats = {
        'ር': { correct: 3, attempted: 5 },
        'ም': { correct: 5, attempted: 5 },
        'ሆ': { correct: 0, attempted: 5 },
      };

      const result = getBestAndWorstStats(smallStats);

      // Should return all 3 stats for both best and worst
      expect(Object.keys(result.bestStats)).toHaveLength(3);
      expect(Object.keys(result.worstStats)).toHaveLength(3);
    });

    it('should sort by percentage correctly', () => {
      const testStats = {
        'ር': { correct: 5, attempted: 5 }, // 100%
        'ም': { correct: 3, attempted: 5 }, // 60%
        'ሆ': { correct: 1, attempted: 5 }, // 20%
        'ሉ': { correct: 0, attempted: 5 }, // 0%
        'ሂ': { correct: 4, attempted: 5 }, // 80%
      };

      const result = getBestAndWorstStats(testStats);

      // Best should include the highest percentages
      expect(result.bestStats['ር']).toEqual({ correct: 5, attempted: 5 }); // 100%
      expect(result.bestStats['ሂ']).toEqual({ correct: 4, attempted: 5 }); // 80%

      // Worst should include the lowest percentages
      expect(result.worstStats['ሉ']).toEqual({ correct: 0, attempted: 5 }); // 0%
      expect(result.worstStats['ሆ']).toEqual({ correct: 1, attempted: 5 }); // 20%
    });
  });

  describe('todayStats and allTimeStats', () => {
    it('should have valid stats structure', () => {
      expect(todayStats).toBeDefined();
      expect(allTimeStats).toBeDefined();

      // Check that all stats have correct and attempted properties
      Object.values(todayStats).forEach(stat => {
        expect(stat).toHaveProperty('correct');
        expect(stat).toHaveProperty('attempted');
        expect(typeof stat.correct).toBe('number');
        expect(typeof stat.attempted).toBe('number');
        expect(stat.correct).toBeGreaterThanOrEqual(0);
        expect(stat.attempted).toBeGreaterThanOrEqual(0);
      });
    });

    it('should have correct <= attempted for all stats', () => {
      Object.entries(todayStats).forEach(([fidel, stat]) => {
        expect(stat.correct).toBeLessThanOrEqual(stat.attempted);
      });

      Object.entries(allTimeStats).forEach(([fidel, stat]) => {
        expect(stat.correct).toBeLessThanOrEqual(stat.attempted);
      });
    });
  });
});
