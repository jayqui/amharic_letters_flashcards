import { todayStats, allTimeStats, getBestAndWorstStats } from './getTopStats';

describe('getTopStats', () => {
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

    it('should return custom count of best and worst stats', () => {
      const testStats = {
        'ር': { correct: 5, attempted: 5 }, // 100%
        'ም': { correct: 4, attempted: 5 }, // 80%
        'ሆ': { correct: 3, attempted: 5 }, // 60%
        'ሉ': { correct: 2, attempted: 5 }, // 40%
        'ሂ': { correct: 1, attempted: 5 }, // 20%
        'ቸ': { correct: 0, attempted: 5 }, // 0%
      };

      const result = getBestAndWorstStats(testStats, 3);

      // Should return exactly 3 best and 3 worst
      expect(Object.keys(result.bestStats)).toHaveLength(3);
      expect(Object.keys(result.worstStats)).toHaveLength(3);

      // Best should include the top 3 (100%, 80%, 60%)
      expect(result.bestStats['ር']).toEqual({ correct: 5, attempted: 5 }); // 100%
      expect(result.bestStats['ም']).toEqual({ correct: 4, attempted: 5 }); // 80%
      expect(result.bestStats['ሆ']).toEqual({ correct: 3, attempted: 5 }); // 60%

      // Worst should include the bottom 3 (40%, 20%, 0%)
      expect(result.worstStats['ሉ']).toEqual({ correct: 2, attempted: 5 }); // 40%
      expect(result.worstStats['ሂ']).toEqual({ correct: 1, attempted: 5 }); // 20%
      expect(result.worstStats['ቸ']).toEqual({ correct: 0, attempted: 5 }); // 0%
    });

    it('should handle count larger than available stats', () => {
      const smallStats = {
        'ር': { correct: 3, attempted: 5 },
        'ም': { correct: 5, attempted: 5 },
        'ሆ': { correct: 0, attempted: 5 },
      };

      const result = getBestAndWorstStats(smallStats, 10);

      // Should return all available stats (3) for both best and worst
      expect(Object.keys(result.bestStats)).toHaveLength(3);
      expect(Object.keys(result.worstStats)).toHaveLength(3);
    });

    it('should handle count of 0', () => {
      const testStats = {
        'ር': { correct: 5, attempted: 5 },
        'ም': { correct: 3, attempted: 5 },
        'ሆ': { correct: 0, attempted: 5 },
      };

      const result = getBestAndWorstStats(testStats, 0);

      // Should return empty objects
      expect(Object.keys(result.bestStats)).toHaveLength(0);
      expect(Object.keys(result.worstStats)).toHaveLength(0);
    });

    it('should default to count of 5 when no count parameter provided', () => {
      const testStats = {
        'ር': { correct: 5, attempted: 5 }, // 100%
        'ም': { correct: 4, attempted: 5 }, // 80%
        'ሆ': { correct: 3, attempted: 5 }, // 60%
        'ሉ': { correct: 2, attempted: 5 }, // 40%
        'ሂ': { correct: 1, attempted: 5 }, // 20%
        'ቸ': { correct: 0, attempted: 5 }, // 0%
        'ሌ': { correct: 0, attempted: 5 }, // 0%
        'ሎ': { correct: 0, attempted: 5 }, // 0%
        'ህ': { correct: 0, attempted: 5 }, // 0%
        'ሯ': { correct: 0, attempted: 5 }, // 0%
      };

      const result = getBestAndWorstStats(testStats);

      // Should return exactly 5 best and 5 worst (default behavior)
      expect(Object.keys(result.bestStats)).toHaveLength(5);
      expect(Object.keys(result.worstStats)).toHaveLength(5);
    });

    it('should throw error for negative count', () => {
      const testStats = { 'ር': { correct: 5, attempted: 5 } };

      expect(() => getBestAndWorstStats(testStats, -1)).toThrow('Invalid count parameter: -1. Must be a non-negative number.');
    });

    it('should throw error for NaN count', () => {
      const testStats = { 'ር': { correct: 5, attempted: 5 } };

      expect(() => getBestAndWorstStats(testStats, NaN)).toThrow('Invalid count parameter: NaN. Must be a non-negative number.');
    });

    it('should handle non-integer count gracefully', () => {
      const testStats = {
        'ር': { correct: 5, attempted: 5 },
        'ም': { correct: 3, attempted: 5 },
        'ሆ': { correct: 0, attempted: 5 },
      };

      const result = getBestAndWorstStats(testStats, 2.7); // Should truncate to 2

      // Should return 2 best and 2 worst (truncated from 2.7)
      expect(Object.keys(result.bestStats)).toHaveLength(2);
      expect(Object.keys(result.worstStats)).toHaveLength(2);
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
