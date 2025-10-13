import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatsSection } from '../../types/StatsTypes';

interface StatsStorage {
  today: StatsSection;
  allTime: StatsSection;
  lastUpdated: number;
  date: string; // YYYY-MM-DD format
}

// Get today's date in local timezone
function getTodayKey(): string {
  return new Date().toISOString().split('T')[0];
}

// Check if stats are expired (different day)
function isStatsExpired(storage: StatsStorage): boolean {
  const today = getTodayKey();
  return storage.date !== today;
}

// Load stats with automatic expiration
export async function loadStats(): Promise<{ today: StatsSection; allTime: StatsSection }> {
  try {
    const stored = await AsyncStorage.getItem('stats');
    if (!stored) {
      return { today: {}, allTime: {} };
    }

    const storage: StatsStorage = JSON.parse(stored);

    // Check if today's stats are expired
    if (isStatsExpired(storage)) {
      console.log('Today\'s stats expired, resetting...');
      const resetStorage: StatsStorage = {
        today: {},
        allTime: storage.allTime, // Keep all-time data
        lastUpdated: Date.now(),
        date: getTodayKey()
      };

      await AsyncStorage.setItem('stats', JSON.stringify(resetStorage));
      return { today: {}, allTime: storage.allTime };
    }

    return { today: storage.today, allTime: storage.allTime };
  } catch (error) {
    console.error('Error loading stats:', error);
    return { today: {}, allTime: {} };
  }
}

// Update stats (both today and all-time)
export async function updateStats(correct: boolean, fidel: string): Promise<void> {
  try {
    const { today, allTime } = await loadStats();

    const increment = correct ? 1 : 0;

    // Update today's stats
    today[fidel] = {
      correct: (today[fidel]?.correct || 0) + increment,
      attempted: (today[fidel]?.attempted || 0) + 1
    };

    // Update all-time stats
    allTime[fidel] = {
      correct: (allTime[fidel]?.correct || 0) + increment,
      attempted: (allTime[fidel]?.attempted || 0) + 1
    };

    const storage: StatsStorage = {
      today,
      allTime,
      lastUpdated: Date.now(),
      date: getTodayKey()
    };

    await AsyncStorage.setItem('stats', JSON.stringify(storage));
  } catch (error) {
    console.error('Error updating stats:', error);
  }
}

// Clear all stats
export async function clearAllStats(): Promise<void> {
  try {
    await AsyncStorage.removeItem('stats');
  } catch (error) {
    console.error('Error clearing stats:', error);
  }
}

// Get stats for a specific date (for debugging or historical analysis)
export async function getStatsForDate(date: string): Promise<StatsSection | null> {
  try {
    const stored = await AsyncStorage.getItem('stats');
    if (!stored) return null;

    const storage: StatsStorage = JSON.parse(stored);
    return storage.date === date ? storage.today : null;
  } catch (error) {
    console.error('Error getting stats for date:', error);
    return null;
  }
}
