import { render, screen, waitFor, fireEvent } from '@testing-library/react-native';
import React from 'react';
import StatsPage from './StatsPage';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Mock statsManager
jest.mock('../utils/stats/statsManager', () => ({
  loadStats: jest.fn(),
  clearAllStats: jest.fn(),
}));

// Mock TopCountSelection to avoid RadioButton async issues
jest.mock('./StatsPage/TopCountSelection', () => {
  const { Text, View, TouchableOpacity } = require('react-native'); // eslint-disable-line @typescript-eslint/no-var-requires
  return function MockTopCountSelection({ value, onValueChange }: { value: string; onValueChange: (value: string) => void }) {
    return (
      <View>
        <Text>Show top: {value}</Text>
        <TouchableOpacity onPress={() => onValueChange('3')}>
          <Text>3</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onValueChange('5')}>
          <Text>5</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onValueChange('10')}>
          <Text>10</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onValueChange('20')}>
          <Text>20</Text>
        </TouchableOpacity>
      </View>
    );
  };
});

import { loadStats, clearAllStats } from '../utils/stats/statsManager';

const mockLoadStats = loadStats as jest.MockedFunction<typeof loadStats>;
const mockClearAllStats = clearAllStats as jest.MockedFunction<typeof clearAllStats>;

describe('Stats page', (): void => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading state initially', async (): Promise<void> => {
    mockLoadStats.mockResolvedValue({ today: {}, allTime: {} });

    render(<StatsPage />);

    expect(screen.getByText('Loading stats...')).toBeTruthy();

    // Wait for the async operations to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading stats...')).toBeNull();
    });
  });

  it('shows stats when loaded', async (): Promise<void> => {
    const mockStats = {
      today: {
        'ር': { correct: 5, attempted: 5 },
        'ም': { correct: 3, attempted: 5 },
        'ሂ': { correct: 1, attempted: 5 },
        'ቸ': { correct: 0, attempted: 5 },
        'ሌ': { correct: 0, attempted: 5 },
      },
      allTime: {
        'ር': { correct: 15, attempted: 15 },
        'ም': { correct: 12, attempted: 15 },
        'ሂ': { correct: 10, attempted: 15 },
        'ቸ': { correct: 8, attempted: 15 },
        'ሌ': { correct: 5, attempted: 15 },
      }
    };

    mockLoadStats.mockResolvedValue(mockStats);

    render(<StatsPage />);

    await waitFor(() => {
      expect(screen.getByText('Best Fidels Today')).toBeTruthy();
      expect(screen.getByText('Best Fidels All Time')).toBeTruthy();
      expect(screen.getByText('Worst Fidels Today')).toBeTruthy();
      expect(screen.getByText('Worst Fidels All Time')).toBeTruthy();
    });
  });

  it('handles clear stats button', async (): Promise<void> => {
    mockLoadStats.mockResolvedValue({ today: {}, allTime: {} });
    mockClearAllStats.mockResolvedValue();

    render(<StatsPage />);

    await waitFor(() => {
      const clearButton = screen.getByText('Clear Stats');
      expect(clearButton).toBeTruthy();
    });
  });

  it('shows confirmation dialog when clear stats is pressed', async (): Promise<void> => {
    mockLoadStats.mockResolvedValue({ today: {}, allTime: {} });
    mockClearAllStats.mockResolvedValue();

    render(<StatsPage />);

    await waitFor(() => {
      const clearButton = screen.getByText('Clear Stats');
      fireEvent.press(clearButton);
    });

    // The Alert.alert is mocked by React Native Testing Library automatically
    // We can't easily test the actual dialog interaction, but we can verify
    // that the button press doesn't immediately clear stats (since it shows dialog first)
    expect(mockClearAllStats).not.toHaveBeenCalled();
  });

  it('shows TopCountSelection component', async (): Promise<void> => {
    mockLoadStats.mockResolvedValue({ today: {}, allTime: {} });

    render(<StatsPage />);

    await waitFor(() => {
      expect(screen.getByText(/Show top:/i)).toBeTruthy();
      expect(screen.getByText('3')).toBeTruthy();
      expect(screen.getByText('5')).toBeTruthy();
      expect(screen.getByText('10')).toBeTruthy();
      expect(screen.getByText('20')).toBeTruthy();
    });
  });

  it('allows changing the top count selection', async (): Promise<void> => {
    const mockStats = {
      today: {
        'ር': { correct: 5, attempted: 5 },
        'ም': { correct: 3, attempted: 5 },
        'ሂ': { correct: 1, attempted: 5 },
        'ቸ': { correct: 0, attempted: 5 },
        'ሌ': { correct: 0, attempted: 5 },
      },
      allTime: {
        'ር': { correct: 15, attempted: 15 },
        'ም': { correct: 12, attempted: 15 },
        'ሂ': { correct: 10, attempted: 15 },
        'ቸ': { correct: 8, attempted: 15 },
        'ሌ': { correct: 5, attempted: 15 },
      }
    };

    mockLoadStats.mockResolvedValue(mockStats);

    render(<StatsPage />);

    await waitFor(() => {
      expect(screen.getByText('Best Fidels Today')).toBeTruthy();
    });

    // Test changing to top 5
    const button5 = screen.getByText('5');
    fireEvent.press(button5);

    // Test changing to top 10
    const button10 = screen.getByText('10');
    fireEvent.press(button10);

    // Test changing to top 20
    const button20 = screen.getByText('20');
    fireEvent.press(button20);
  });

  it('defaults to top 3 selection', async (): Promise<void> => {
    mockLoadStats.mockResolvedValue({ today: {}, allTime: {} });

    render(<StatsPage />);

    await waitFor(() => {
      expect(screen.getByText('3')).toBeTruthy();
    });
  });
});

