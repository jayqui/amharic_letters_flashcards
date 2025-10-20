import { View, StyleSheet } from 'react-native';
import { Routes, Route } from 'react-router-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SettingsTypes } from '../types/SettingsTypes';

import MainMenu from './MainMenu';
import FidelsList from './FidelsList';
import FlashcardPage from './FlashcardPage';
import Settings from './Settings';
import StatsPage from './StatsPage';
import FlashcardSetup from './FlashcardSetup';
import SuccessPage from './SuccessPage';

// Ethiopian flag colors (very subtle)
const ETHIOPIAN_GREEN = '#4CAF50';
const ETHIOPIAN_YELLOW = '#FFC107';
const ETHIOPIAN_RED = '#F44336';

const styles = StyleSheet.create({
  mainContentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    height: '89%',
    width: '100%',
  },
  flagBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.08, // Very subtle
  },
});

export default function MainContent({ settings, setSettings }: SettingsTypes) {
  return(
    <View style={styles.mainContentContainer}>
      <LinearGradient
        colors={[ETHIOPIAN_GREEN, ETHIOPIAN_YELLOW, ETHIOPIAN_RED]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.flagBackground}
      />
      <Routes>
        <Route path='/' element={<MainMenu />} />
        <Route path='/flashcards' element={<FlashcardSetup />} />
        <Route path='/flashcards/session' element={<FlashcardPage settings={settings} />} />
        <Route path='/flashcards/success' element={<SuccessPage />} />
        <Route path='/fidels-list' element={<FidelsList settings={settings} />} />
        <Route path='/settings' element={
          <Settings settings={settings} setSettings={setSettings} />}
        />
        <Route path='/stats' element={<StatsPage />} />
      </Routes>
    </View>
  );
}
