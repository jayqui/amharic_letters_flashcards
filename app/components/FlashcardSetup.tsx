import { View, Text } from 'react-native';
import { Button } from 'react-native-paper';
import { useNavigate } from 'react-router-native';
import * as globalStyles from '../globalStyles';

export default function FlashcardSetup() {
  const navigate = useNavigate();

  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={[globalStyles.fontSize48, { marginBottom: 20 }]}>Flashcard Setup</Text>
      <Button
        mode='contained'
        onPress={() => navigate('/flashcards/session')}
        style={globalStyles.standardButton}
        contentStyle={globalStyles.standardButtonContent}
        labelStyle={globalStyles.standardButtonLabel}
      >
        Start
      </Button>
    </View>
  );
}
