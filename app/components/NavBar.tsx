import { View, StyleSheet, Image } from 'react-native';
import { Link } from 'react-router-native';
import * as globalStyles from '../globalStyles';

const styles = StyleSheet.create({
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
  navImage: {
    width: 24,
    height: 24,
  },
});

export default function NavBar() {
  return(
    <View style={styles.nav}>
      <Link to='/' underlayColor='#eee' style={styles.navItem}>
        <Image style={styles.navImage} source={require('../assets/images/icons/hamburger.png')} />
      </Link>
      <Link to='/settings' underlayColor='#eee' style={styles.navItem}>
        <Image style={styles.navImage} source={require('../assets/images/icons/settings.png')} />
      </Link>
    </View>
  );
}
