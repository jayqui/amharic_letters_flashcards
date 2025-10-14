import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadStats, updateStats, clearAllStats, getStatsForDate } from './statsManager';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

describe('statsManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock Date.now() to return a consistent timestamp
    jest.spyOn(Date, 'now').mockReturnValue(1640995200000); // 2022-01-01 00:00:00
    // Mock toISOString to return a consistent date
    jest.spyOn(Date.prototype, 'toISOString').mockReturnValue('2022-01-01T00:00:00.000Z');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('loadStats', () => {
    it('should return empty stats when no data is stored', async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);

      const result = await loadStats();

      expect(result).toEqual({ today: {}, allTime: {} });
      expect(mockAsyncStorage.getItem).toHaveBeenCalledWith('stats');
    });

    it('should return stored stats when data is valid and not expired', async () => {
      const storedData = {
        today: { 'ር': { correct: 5, attempted: 5 } },
        allTime: { 'ር': { correct: 15, attempted: 15 } },
        lastUpdated: 1640995200000,
        date: '2022-01-01'
      };
      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(storedData));

      const result = await loadStats();

      expect(result).toEqual({
        today: { 'ር': { correct: 5, attempted: 5 } },
        allTime: { 'ር': { correct: 15, attempted: 15 } }
      });
    });

    it('should reset today stats when data is expired (different date)', async () => {
      const storedData = {
        today: { 'ር': { correct: 5, attempted: 5 } },
        allTime: { 'ር': { correct: 15, attempted: 15 } },
        lastUpdated: 1640995200000,
        date: '2021-12-31' // Different date
      };
      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(storedData));

      const result = await loadStats();

      expect(result).toEqual({
        today: {},
        allTime: { 'ር': { correct: 15, attempted: 15 } } // All-time preserved
      });
      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith('stats', expect.stringContaining('"today":{}'));
    });

    it('should handle JSON parse errors gracefully', async () => {
      mockAsyncStorage.getItem.mockResolvedValue('invalid json');

      const result = await loadStats();

      expect(result).toEqual({ today: {}, allTime: {} });
    });

    it('should handle AsyncStorage errors gracefully', async () => {
      mockAsyncStorage.getItem.mockRejectedValue(new Error('Storage error'));

      const result = await loadStats();

      expect(result).toEqual({ today: {}, allTime: {} });
    });
  });

  describe('updateStats', () => {
    it('should update stats for a correct answer', async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);
      mockAsyncStorage.setItem.mockResolvedValue(undefined);

      await updateStats(true, 'ር');

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith('stats', expect.stringContaining('"correct":1'));
      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith('stats', expect.stringContaining('"attempted":1'));
    });

    it('should update stats for an incorrect answer', async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);
      mockAsyncStorage.setItem.mockResolvedValue(undefined);

      await updateStats(false, 'ር');

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith('stats', expect.stringContaining('"correct":0'));
      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith('stats', expect.stringContaining('"attempted":1'));
    });

    it('should increment existing stats', async () => {
      const existingData = {
        today: { 'ር': { correct: 2, attempted: 3 } },
        allTime: { 'ር': { correct: 5, attempted: 8 } },
        lastUpdated: 1640995200000,
        date: '2022-01-01'
      };
      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(existingData));
      mockAsyncStorage.setItem.mockResolvedValue(undefined);

      await updateStats(true, 'ር');

      const setItemCall = mockAsyncStorage.setItem.mock.calls[0][1];
      const storedData = JSON.parse(setItemCall);

      expect(storedData.today['ር']).toEqual({ correct: 3, attempted: 4 });
      expect(storedData.allTime['ር']).toEqual({ correct: 6, attempted: 9 });
    });

    it('should handle multiple fidels in a single update', async () => {
      // Mock the scenario where we have existing data and add multiple fidels
      const existingData = {
        today: { 'ር': { correct: 1, attempted: 1 } },
        allTime: { 'ር': { correct: 1, attempted: 1 } },
        lastUpdated: 1640995200000,
        date: '2022-01-01'
      };

      // First call returns existing data, second call returns updated data
      mockAsyncStorage.getItem
        .mockResolvedValueOnce(JSON.stringify(existingData))
        .mockResolvedValueOnce(JSON.stringify(existingData));
      mockAsyncStorage.setItem.mockResolvedValue(undefined);

      await updateStats(false, 'ም');

      const setItemCall = mockAsyncStorage.setItem.mock.calls[0][1];
      const storedData = JSON.parse(setItemCall);

      // Should preserve existing fidel and add new one
      expect(storedData.today['ር']).toEqual({ correct: 1, attempted: 1 });
      expect(storedData.today['ም']).toEqual({ correct: 0, attempted: 1 });
      expect(storedData.allTime['ር']).toEqual({ correct: 1, attempted: 1 });
      expect(storedData.allTime['ም']).toEqual({ correct: 0, attempted: 1 });
    });

    it('should handle AsyncStorage errors gracefully', async () => {
      mockAsyncStorage.getItem.mockRejectedValue(new Error('Storage error'));

      await expect(updateStats(true, 'ር')).resolves.not.toThrow();
    });
  });

  describe('clearAllStats', () => {
    it('should remove stats from storage', async () => {
      mockAsyncStorage.removeItem.mockResolvedValue(undefined);

      await clearAllStats();

      expect(mockAsyncStorage.removeItem).toHaveBeenCalledWith('stats');
    });

    it('should handle AsyncStorage errors gracefully', async () => {
      mockAsyncStorage.removeItem.mockRejectedValue(new Error('Storage error'));

      await expect(clearAllStats()).resolves.not.toThrow();
    });
  });

  describe('getStatsForDate', () => {
    it('should return stats for matching date', async () => {
      const storedData = {
        today: { 'ር': { correct: 5, attempted: 5 } },
        allTime: { 'ር': { correct: 15, attempted: 15 } },
        lastUpdated: 1640995200000,
        date: '2022-01-01'
      };
      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(storedData));

      const result = await getStatsForDate('2022-01-01');

      expect(result).toEqual({ 'ር': { correct: 5, attempted: 5 } });
    });

    it('should return null for non-matching date', async () => {
      const storedData = {
        today: { 'ር': { correct: 5, attempted: 5 } },
        allTime: { 'ር': { correct: 15, attempted: 15 } },
        lastUpdated: 1640995200000,
        date: '2022-01-01'
      };
      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(storedData));

      const result = await getStatsForDate('2022-01-02');

      expect(result).toBeNull();
    });

    it('should return null when no data is stored', async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);

      const result = await getStatsForDate('2022-01-01');

      expect(result).toBeNull();
    });

    it('should handle JSON parse errors gracefully', async () => {
      mockAsyncStorage.getItem.mockResolvedValue('invalid json');

      const result = await getStatsForDate('2022-01-01');

      expect(result).toBeNull();
    });
  });

  describe('date handling', () => {
    it('should use consistent date format', async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);
      mockAsyncStorage.setItem.mockResolvedValue(undefined);

      await updateStats(true, 'ር');

      const setItemCall = mockAsyncStorage.setItem.mock.calls[0][1];
      const storedData = JSON.parse(setItemCall);

      expect(storedData.date).toBe('2022-01-01');
    });
  });
});
