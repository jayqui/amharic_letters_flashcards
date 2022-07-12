import { StatusBar } from 'expo-status-bar';
import { Image, StyleSheet, View } from 'react-native';
import { NativeRouter, Routes, Route, Link } from 'react-router-native';

import FlashcardPage from './app/components/FlashcardPage';
import Settings from './app/components/Settings';

export default function App() {
  return (
    <NativeRouter>
      <StatusBar style="auto" />
      <View style={styles.outermostContainer}>
        <View style={styles.nav}>
          <Link to='/' underlayColor='#eee' style={styles.navItem}>
            <Image style={styles.navImage} source={require('./app/assets/images/icons/hamburger.png')} />
          </Link>
          <Link to='/settings' underlayColor='#eee' style={styles.navItem}>
            <Image style={styles.navImage} source={require('./app/assets/images/icons/settings.png')} />
          </Link>
        </View>

        <View style={styles.mainContentContainer}>
          <Routes>
            <Route path='/' element={<FlashcardPage />} />
            <Route path='/settings' element={<Settings />} />
          </Routes>
        </View>
      </View>
    </NativeRouter>
  )
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
    backgroundColor: '#0f8',
    justifyContent: 'space-between',
    height: '11%',
    width: '100%',
    paddingTop: 44,
    paddingBottom: 10,
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
    height: '95%',
    width: '100%',
  },
  navImage: {
    width: 24,
    height: 24,
  },
});
