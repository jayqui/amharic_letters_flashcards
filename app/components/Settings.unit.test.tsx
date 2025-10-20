import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Settings from './Settings';
import { DEFAULT_SETTINGS } from '../types/SettingsTypes';

// Mock AsyncStorage to avoid writing to actual storage during tests
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
}));

// Mock the fidels data to provide a consistent length for the batch size choices
jest.mock('../data/fidels', () => ({
  fidelsArray: Array.from({ length: 287 }),
}));

// Mock the DropDownPicker to make it testable and avoid environment issues
jest.mock('react-native-dropdown-picker', () => {
  function MockDropDownPicker(props: Record<string, unknown>) {
    // require() is used inside the mock to avoid out-of-scope errors
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { Text, TouchableOpacity } = require('react-native');
    const { testID, value, setValue, open, setOpen } = props;

    // Simulate opening the picker and selecting a new value
    const handlePress = () => {
      if (typeof setOpen === 'function') {
        setOpen(!open);
      }
      if (typeof setValue === 'function') {
        // Simulate the user picking '5' from the dropdown
        setValue(() => '5');
      }
    };

    return (
      <TouchableOpacity testID={testID} onPress={handlePress}>
        <Text>{value}</Text>
      </TouchableOpacity>
    );
  }
  return MockDropDownPicker;
});

describe('Settings', () => {
  const mockSetSettings = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all the settings options correctly', () => {
    const { getByText } = render(
      <Settings settings={DEFAULT_SETTINGS} setSettings={mockSetSettings} />
    );
    expect(getByText('Flashcard Batch Size')).toBeTruthy();
    expect(getByText('Keep Cards in Rotation Until Answered Correctly')).toBeTruthy();
  });

  it('displays the initial batch size value from props', () => {
    const { getByText } = render(
      <Settings settings={DEFAULT_SETTINGS} setSettings={mockSetSettings} />
    );
    expect(getByText(String(DEFAULT_SETTINGS.flashcardBatchSize))).toBeTruthy();
  });

  it('calls setSettings with the new value when "Keep Cards in Rotation" is toggled', () => {
    const { getByTestId } = render(
      <Settings settings={DEFAULT_SETTINGS} setSettings={mockSetSettings} />
    );

    const keepMissedSwitch = getByTestId('keepMissed-switch');
    fireEvent(keepMissedSwitch, 'onValueChange');

    expect(mockSetSettings).toHaveBeenCalledWith({
      ...DEFAULT_SETTINGS,
      keepMissed: !DEFAULT_SETTINGS.keepMissed,
    });
  });

  it('calls setSettings with the new value when the batch size is changed', () => {
    const { getByTestId } = render(
      <Settings settings={DEFAULT_SETTINGS} setSettings={mockSetSettings} />
    );

    const batchSizePicker = getByTestId('batch-size-picker');
    fireEvent.press(batchSizePicker);

    expect(mockSetSettings).toHaveBeenCalledWith({
      ...DEFAULT_SETTINGS,
      flashcardBatchSize: 5,
    });
  });
});
