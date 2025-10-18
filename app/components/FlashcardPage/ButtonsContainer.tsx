import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import * as globalStyles from '../../globalStyles';

type ButtonsContainerProps = {
  showAnswer: boolean;
  showVisualHint: boolean;
  onXPress: () => void;
  onCheckPress: () => void;
  onHelpPress: () => void;
};

const styles = StyleSheet.create({
  allButtonsContainer: {
    width: '80%',
  },
  answerButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  xButton: {
    ...globalStyles.standardButton,
    borderWidth: 1.5,
    borderColor: globalStyles.red30,
    backgroundColor: globalStyles.red0,
  },
  checkButton: {
    ...globalStyles.standardButton,
    borderWidth: 1.5,
    borderColor: globalStyles.green30,
    backgroundColor: globalStyles.green10,
  },
  toggleAnswerButton: {
    ...globalStyles.standardButton,
    marginTop: 12,
    borderWidth: 2,
    borderColor: globalStyles.blue40,
    backgroundColor: 'none',
  },
  toggleAnswerButtonLabel: {
    ...globalStyles.standardButtonLabel,
    color: globalStyles.blue50,
  },
  flashcardPageButtonContent: {
    ...globalStyles.standardButtonContent,
    height: 80,
  },
});

export default function ButtonsContainer({
  showAnswer,
  showVisualHint,
  onXPress,
  onCheckPress,
  onHelpPress,
}: ButtonsContainerProps) {
  function renderHelpButtonText() {
    if (showVisualHint) {
      return `${showAnswer ? 'Hide' : 'Show'} Answer`;
    } else {
      return 'Play Audio';
    }
  }

  return (
    <View style={styles.allButtonsContainer}>
      <View style={styles.answerButtonsContainer}>
        <Button
          onPress={onXPress}
          mode='contained-tonal'
          style={styles.xButton}
          contentStyle={styles.flashcardPageButtonContent}
          labelStyle={globalStyles.standardButtonLabel}
        >
          ❌
        </Button>
        <Button
          onPress={onCheckPress}
          mode='contained-tonal'
          style={styles.checkButton}
          contentStyle={styles.flashcardPageButtonContent}
          labelStyle={globalStyles.standardButtonLabel}
        >
          ✅
        </Button>
      </View>

      <Button
        mode='contained-tonal'
        onPress={onHelpPress}
        style={styles.toggleAnswerButton}
        contentStyle={styles.flashcardPageButtonContent}
        labelStyle={styles.toggleAnswerButtonLabel}
      >
        {renderHelpButtonText()}
      </Button>
    </View>
  );
}
