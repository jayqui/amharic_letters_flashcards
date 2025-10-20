import { useState } from 'react';
import { StyleSheet, Switch, ScrollView, View } from 'react-native';
import { Text } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SettingsTypes, SettingsType } from '../types/SettingsTypes';
import { cloneDeep } from 'lodash';

import { fidelsArray as fidel } from '../data/fidels';

const styles = StyleSheet.create({
  contentContainer: {
    width: '100%',
  },
  sectionTitle: {
    marginTop: 16,
  },
  option: {
    marginVertical: 16,
  },
  booleanOption: {
    marginVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  optionText: {
    maxWidth: '80%',
  },
  batchSizePicker: {
    flex: 1,
    minWidth: '50%',
    maxWidth: '80%',
  },
  dropDownPicker: {
    backgroundColor: '#fff',
    padding: 8, // for web
    flexDirection: 'row',
    borderRadius: 5,
  }
});

const FLASHCARD_BATCH_SIZE_CHOICES = [
  {label: '1', value: '1'},
  {label: '2', value: '2'},
  {label: '3', value: '3'},
  {label: '4', value: '4'},
  {label: '5', value: '5'},
  {label: '6', value: '6'},
  {label: '7', value: '7'},
  {label: '8', value: '8'},
  {label: '9', value: '9'},
  {label: '10', value: '10'},
  {label: '15', value: '15'},
  {label: '20', value: '20'},
  {label: '25', value: '25'},
  {label: '30', value: '30'},
  {label: '40', value: '40'},
  {label: '50', value: '50'},
  {label: '100', value: '100'},
  {label: '200', value: '200'},
  {label: `${fidel.length}`, value: `${fidel.length}`},
];

export default function Settings({ settings, setSettings }: SettingsTypes) {
  const [open, setOpen] = useState(false);
  const [flashcardBatchSizeChoices, setFlashcardBatchSizeChoices] = useState(FLASHCARD_BATCH_SIZE_CHOICES);

  async function storeData(key: string, value: string) {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      alert(`error saving settings: ${error}`);
    }
  }

  function adjustSetting<K extends keyof SettingsType>(settingsKey: K, newValue: SettingsType[K]) {
    const newSettings: SettingsType = cloneDeep(settings);
    newSettings[settingsKey] = newValue;
    storeData('settings', JSON.stringify(newSettings));
    setSettings(newSettings);
  }

  function toggleBooleanSetting(settingsKey: keyof SettingsType) {
    adjustSetting(settingsKey, !settings[settingsKey]);
  }

  function handleBatchSizeChange(choice: (prevValue: string) => string) {
    const newValue = choice(String(settings.flashcardBatchSize));
    adjustSetting('flashcardBatchSize', Number(newValue));
  }

  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>

      <View style={styles.batchSizePicker}>
        <Text variant='headlineLarge' style={styles.sectionTitle}>Flashcards</Text>
        <View style={{ ...styles.option, zIndex: 1000000 }}>
          <Text variant='bodyLarge' style={styles.optionText}>Flashcard Batch Size</Text>
          <DropDownPicker
            testID="batch-size-picker"
            listMode='SCROLLVIEW'
            style={styles.dropDownPicker}
            open={open}
            value={String(settings.flashcardBatchSize)}
            items={flashcardBatchSizeChoices}
            setOpen={setOpen}
            setValue={handleBatchSizeChange}
            setItems={setFlashcardBatchSizeChoices}
          />
        </View>
        <View style={styles.booleanOption}>
          <Text variant='bodyLarge' style={styles.optionText}>Keep Cards in Rotation Until Answered Correctly</Text>
          <Switch testID="keepMissed-switch" value={settings.keepMissed} onValueChange={() => toggleBooleanSetting('keepMissed')} />
        </View>
        <View style={styles.booleanOption}>
          <Text variant='bodyLarge' style={styles.optionText}>Play Sounds</Text>
          <Switch testID="shouldSpeak-switch" value={settings.shouldSpeak} onValueChange={() => toggleBooleanSetting('shouldSpeak')} />
        </View>
        <View style={styles.booleanOption}>
          <Text variant='bodyLarge' style={styles.optionText}>Show Visual Hint</Text>
          <Switch testID="showVisualHint-switch" value={settings.showVisualHint} onValueChange={() => toggleBooleanSetting('showVisualHint')} />
        </View>

        <Text variant='headlineLarge' style={styles.sectionTitle}>Fidels List</Text>
        <View style={styles.booleanOption}>
          <Text variant='bodyLarge' style={styles.optionText}>Show Diphthongs</Text>
          <Switch testID="diphthong-switch" value={!settings.diphthongFreeFidelList} onValueChange={() => toggleBooleanSetting('diphthongFreeFidelList')} />
        </View>

      </View>
    </ScrollView>
  );
}
