import { Button } from 'react-native-paper';
import { useNavigate } from 'react-router-native';
import * as globalStyles from '../globalStyles';

const pages = [
  {
    path: '/flashcards',
    copy: 'Flashcards',
    icon: 'cards-outline',
  },
  {
    path: '/fidels-list',
    copy: 'Fidels List',
    icon: 'grid',
  },
  {
    path: '/stats',
    copy: 'Stats',
    icon: 'chart-bar',
  },
];

export default function MainMenu() {
  const navigate = useNavigate();
  return(
    <>
      {pages.map((page) => (
        <Button
          key={page.path}
          onPress={() => navigate(page.path)}
          mode='contained'
          icon={page.icon}
          style={globalStyles.standardButton}
          contentStyle={globalStyles.standardButtonContent}
          labelStyle={globalStyles.standardButtonLabel}
        >
          {page.copy}
        </Button>
      ))}
    </>
  );
}
