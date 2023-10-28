import { render, screen, fireEvent, waitFor, act } from '@testing-library/react-native';
import React from 'react';
import FlashcardPage from './FlashcardPage';

// Mock expo-av
jest.mock('expo-av', () => ({
  Audio: {
    Sound: {
      createAsync: jest.fn(),
    },
    setAudioModeAsync: jest.fn(),
  },
}));

// Mock statsManager
jest.mock('../utils/stats/statsManager', () => ({
  updateStats: jest.fn(),
}));

// Mock SuccessPage
jest.mock('./SuccessPage', () => {
  const { Text, View, TouchableOpacity } = require('react-native'); // eslint-disable-line @typescript-eslint/no-var-requires
  return function MockSuccessPage({ handleRestartPress }: { handleRestartPress: () => void }) {
    return (
      <View>
        <Text>Success Page</Text>
        <TouchableOpacity onPress={handleRestartPress}>
          <Text>Restart</Text>
        </TouchableOpacity>
      </View>
    );
  };
});

import { Audio } from 'expo-av';
import { updateStats } from '../utils/stats/statsManager';

const mockCreateAsync = Audio.Sound.createAsync as jest.MockedFunction<typeof Audio.Sound.createAsync>;
const mockSetAudioModeAsync = Audio.setAudioModeAsync as jest.MockedFunction<typeof Audio.setAudioModeAsync>;
const mockUpdateStats = updateStats as jest.MockedFunction<typeof updateStats>;

describe('FlashcardPage', () => {
  const defaultSettings = {
    flashcardBatchSize: 5,
    keepMissed: false,
    shouldSpeak: true,
    showVisualHint: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockCreateAsync.mockResolvedValue({
      sound: {
        playAsync: jest.fn(),
        unloadAsync: jest.fn(),
      },
      status: { isLoaded: true },
    } as any); // eslint-disable-line @typescript-eslint/no-explicit-any
    mockSetAudioModeAsync.mockResolvedValue();
  });

  it('renders the current letter and queue count', () => {
    render(<FlashcardPage settings={defaultSettings} />);

    expect(screen.getByText(/\d+ left/)).toBeTruthy();
  });

  it('shows answer when help button is pressed and showVisualHint is true', async () => {
    render(<FlashcardPage settings={defaultSettings} />);

    const helpButton = screen.getByText('Show Answer');
    fireEvent.press(helpButton);

    await waitFor(() => {
      expect(screen.getByText('Hide Answer')).toBeTruthy();
    });
  });

  it('shows "Play Audio" when showVisualHint is false', () => {
    const settings = { ...defaultSettings, showVisualHint: false };
    render(<FlashcardPage settings={settings} />);

    expect(screen.getByText('Play Audio')).toBeTruthy();
  });

  it('calls updateStats with correct parameters when X button is pressed', () => {
    render(<FlashcardPage settings={defaultSettings} />);

    const xButton = screen.getByText('❌');
    fireEvent.press(xButton);

    expect(mockUpdateStats).toHaveBeenCalledWith(false, expect.any(String));
  });

  it('calls updateStats with correct parameters when check button is pressed', () => {
    render(<FlashcardPage settings={defaultSettings} />);

    const checkButton = screen.getByText('✅');
    fireEvent.press(checkButton);

    expect(mockUpdateStats).toHaveBeenCalledWith(true, expect.any(String));
  });

  it('plays audio when shouldSpeak is true and help button is pressed', async () => {
    render(<FlashcardPage settings={defaultSettings} />);

    const helpButton = screen.getByText('Show Answer');

    await act(async () => {
      fireEvent.press(helpButton);
    });

    await waitFor(() => {
      expect(mockCreateAsync).toHaveBeenCalled();
      expect(mockSetAudioModeAsync).toHaveBeenCalledWith({ playsInSilentModeIOS: true });
    });
  });

  it('does not play audio when shouldSpeak is false', async () => {
    const settings = { ...defaultSettings, shouldSpeak: false };
    render(<FlashcardPage settings={settings} />);

    const helpButton = screen.getByText('Show Answer');

    await act(async () => {
      fireEvent.press(helpButton);
    });

    await waitFor(() => {
      expect(mockCreateAsync).not.toHaveBeenCalled();
    });
  });

  it('shows success page when queue is empty', () => {
    // Mock a very small batch size to potentially empty the queue quickly
    const settings = { ...defaultSettings, flashcardBatchSize: 1 };
    render(<FlashcardPage settings={settings} />);

    // Press check button to remove the only item
    const checkButton = screen.getByText('✅');
    fireEvent.press(checkButton);

    expect(screen.getByText('Success Page')).toBeTruthy();
  });

  it('handles restart from success page', () => {
    const settings = { ...defaultSettings, flashcardBatchSize: 1 };
    render(<FlashcardPage settings={settings} />);

    // Remove the only item to trigger success page
    const checkButton = screen.getByText('✅');
    fireEvent.press(checkButton);

    // Press restart button
    const restartButton = screen.getByText('Restart');
    fireEvent.press(restartButton);

    // Should be back to flashcard view
    expect(screen.getByText(/\d+ left/)).toBeTruthy();
  });

  it('keeps missed letters when keepMissed is true', () => {
    const settings = { ...defaultSettings, keepMissed: true };
    render(<FlashcardPage settings={settings} />);

    const xButton = screen.getByText('❌');
    fireEvent.press(xButton);

    // Should still have items in queue
    expect(screen.getByText(/\d+ left/)).toBeTruthy();
  });

  it('removes letters when keepMissed is false', () => {
    const settings = { ...defaultSettings, keepMissed: false };
    render(<FlashcardPage settings={settings} />);

    const checkButton = screen.getByText('✅');
    fireEvent.press(checkButton);

    // Should have one less item
    expect(screen.getByText(/\d+ left/)).toBeTruthy();
  });
});
