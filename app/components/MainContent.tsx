import { View, StyleSheet } from 'react-native';
import { Routes, Route, useNavigate } from 'react-router-native';
import * as globalStyles from '../globalStyles';
import { SettingsTypes } from '../types/SettingsTypes';

import MainMenu from './MainMenu';
import FidelsList from './FidelsList';
import FlashcardPage from './FlashcardPage';
import Settings from './Settings';
import StatsPage from './StatsPage';

const styles = StyleSheet.create({
  mainContentContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default function MainContent({ settings, setSettings }: SettingsTypes) {
  const navigate = useNavigate();

  return(
    <View style={styles.mainContentContainer}>
      <Routes>
        <Route path='/' element={<MainMenu navigate={navigate} />} />
        <Route path='/flashcards' element={<FlashcardPage settings={settings} />} />
        <Route path='/fidels-list' element={<FidelsList settings={settings} />} />
        <Route path='/settings' element={
          <Settings settings={settings} setSettings={setSettings} />}
        />
        <Route path='/stats' element={<StatsPage />} />
      </Routes>
    </View>
  );
}
