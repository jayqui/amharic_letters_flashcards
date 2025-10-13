import { render, screen, waitFor } from '@testing-library/react-native';
import React from 'react';
import Stats from './Stats';

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

import { loadStats, clearAllStats } from '../utils/stats/statsManager';

const mockLoadStats = loadStats as jest.MockedFunction<typeof loadStats>;
const mockClearAllStats = clearAllStats as jest.MockedFunction<typeof clearAllStats>;

describe('Stats page', (): void => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading state initially', (): void => {
    mockLoadStats.mockResolvedValue({ today: {}, allTime: {} });

    render(<Stats />);

    expect(screen.getByText('Loading stats...')).toBeTruthy();
  });

  it('shows stats when loaded', async (): void => {
    const mockStats = {
      today: {
        'ር': { correct: 5, attempted: 5 },
        'ም': { correct: 3, attempted: 5 },
      },
      allTime: {
        'ር': { correct: 15, attempted: 15 },
        'ም': { correct: 12, attempted: 15 },
      }
    };

    mockLoadStats.mockResolvedValue(mockStats);

    render(<Stats />);

    await waitFor(() => {
      expect(screen.getByText('Best Fidels Today')).toBeTruthy();
      expect(screen.getByText('Best Fidels All Time')).toBeTruthy();
    });
  });

  it('handles clear stats button', async (): void => {
    mockLoadStats.mockResolvedValue({ today: {}, allTime: {} });
    mockClearAllStats.mockResolvedValue();

    render(<Stats />);

    await waitFor(() => {
      const clearButton = screen.getByText('Clear Stats');
      expect(clearButton).toBeTruthy();
    });
  });
});

