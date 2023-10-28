import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';
import { NativeRouter, Routes, Route, Link, useNavigate } from "react-router-native"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { cloneDeep, merge } from 'lodash';
import { MD3LightTheme as DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

import * as globalStyles from './app/globalStyles';

import MainMenu from './app/components/MainMenu';
import FidelsList from './app/components/FidelsList';
import FlashcardPage from './app/components/FlashcardPage';
import Settings from './app/components/Settings';
import { SettingsTypes, DEFAULT_SETTINGS } from './app/types/SettingsTypes';
import Stats from "./app/components/Stats"

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
  nav: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    backgroundColor: globalStyles.green30,
    height: '11%',
    width: '100%',
    paddingHorizontal: 20,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  mainContentContainer: {
    alignItems: 'center',
    justifyContent: 'space-evenly',
    height: '89%',
    width: '100%',
  },
  navImage: {
    width: 24,
    height: 24,
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

  function renderActivityIndicator() {
    return(
      <ActivityIndicator
        color={globalStyles.green30}
        size={'large'}
        style={styles.mainContentContainer}
      />
    );
  }

  function renderMainContent() {
    return <MainContent settings={settings} setSettings={setSettings} />;
  }

  return (
    <NativeRouter>
      <StatusBar style='auto' />
      <View style={styles.outermostContainer}>
        <NavBar />
        {loading ? renderActivityIndicator() : renderMainContent()}
      </View>
    </NativeRouter>
  );
}

function NavBar() {
  return(
    <View style={styles.nav}>
      <Link to='/' underlayColor='#eee' style={styles.navItem}>
        <Image style={styles.navImage} source={require('./app/assets/images/icons/hamburger.png')} />
      </Link>
      <Link to='/settings' underlayColor='#eee' style={styles.navItem}>
        <Image style={styles.navImage} source={require('./app/assets/images/icons/settings.png')} />
      </Link>
    </View>
  );
}

function MainContent({ settings, setSettings }: SettingsTypes) {
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
        <Route path='/stats' element={<Stats />} />
      </Routes>
    </View>
  );
}
