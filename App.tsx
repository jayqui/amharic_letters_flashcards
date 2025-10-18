import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { NativeRouter } from 'react-router-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { cloneDeep, merge } from 'lodash';
import { MD3LightTheme as DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

import * as globalStyles from './app/globalStyles';

import MainContent from './app/components/MainContent';
import NavBar from './app/components/NavBar';
import { DEFAULT_SETTINGS } from './app/types/SettingsTypes';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: globalStyles.green40,
    secondary: globalStyles.red40,
    secondaryContainer: globalStyles.yellow0,
  },
};

export default function AppContainer() {
  return(
    <PaperProvider theme={theme}>
      <App />
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  outermostContainer: {
    flex: 1,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});

function App() {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  useEffect(() => {
    getSettings();
  }, []);

  async function getSettings() {
    try {
      const jsonValue = await AsyncStorage.getItem('settings');
      const settingsParsedJson = jsonValue != null ? JSON.parse(jsonValue) : {};
      const finalSettingsValue = merge(cloneDeep(DEFAULT_SETTINGS), settingsParsedJson);

      setSettings(finalSettingsValue);
      setLoading(false);
    } catch (error) {
      alert(`error retrieving saved settings: ${error}`);
    }
  }

  return (
    <NativeRouter>
      <StatusBar style='auto' />
      <View style={styles.outermostContainer}>
        <NavBar />
        {loading ?
          <ActivityIndicator color={globalStyles.green30} size={'large'} /> :
          <MainContent settings={settings} setSettings={setSettings} />}
      </View>
    </NativeRouter>
  );
}


