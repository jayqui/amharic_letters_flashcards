import { useState, useEffect } from 'react';
import {  StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import { sample, sampleSize } from 'lodash';
import * as globalStyles from '../globalStyles';
import { Audio } from 'expo-av';

import SuccessPage from '../components/SuccessPage';

import fidel from '../data/fidelsArray';
import { updateStats } from '../utils/stats/statsManager';

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
    borderWidth: 1,
    borderColor: globalStyles.red30,
    backgroundColor: globalStyles.red0,
  },
  checkButton: {
    ...globalStyles.standardButton,
    borderWidth: 1,
    borderColor: globalStyles.green30,
    backgroundColor: globalStyles.green10,
  },
  toggleAnswerButton: {
    ...globalStyles.standardButton,
    marginTop: 12,
    borderWidth: 1,
    borderColor: globalStyles.secondaryTextColor,
    backgroundColor: 'none',
  },
  toggleAnswerButtonLabel: {
    ...globalStyles.standardButtonLabel,
    color: globalStyles.secondaryTextColor,
  },
  flashcardPageButtonContent: {
    ...globalStyles.standardButtonContent,
    height: 80,
  },
});

type FlashcardProps = {
  settings: {
    flashcardBatchSize: number,
    keepMissed: boolean,
    shouldSpeak: boolean,
    showVisualHint: boolean,
  }
}

export default function FlashcardPage({ settings: { flashcardBatchSize, keepMissed, shouldSpeak, showVisualHint }}: FlashcardProps) {
  const [showAnswer, setShowAnswer] = useState(false);
  const [queue, setQueue] = useState(generateFidelSample());
  const [currentLetter, setCurrentLetter] = useState(sample(queue));
  const [sound, setSound] = useState<Audio.Sound | undefined>();

  async function playSound() {
    if (!shouldSpeak || !currentLetter) { return; }
    const { sound } = await Audio.Sound.createAsync(currentLetter.file);
    await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
    setSound(sound);
    await sound.playAsync();
  }

  useEffect(() => {
    return sound ? () => { sound.unloadAsync(); } : undefined;
  }, [sound]);

  function generateFidelSample() {
    return sampleSize(fidel, flashcardBatchSize);
  }

  function handleXPress() {
    updateStats(false, currentLetter?.character || '');
    const timeoutDuration = showAnswer ? 0 : 1000;

    if (!showAnswer) playSound();
    if (showVisualHint) setShowAnswer(true);

    setTimeout(() => {
      setShowAnswer(false);
      let nextLetter;
      if (keepMissed) {
        nextLetter = queue.length === 1 ? sample(queue) : sample(queueWithoutCurrentLetter());
        setCurrentLetter(nextLetter);
      } else {
        removeCurrentLetter();
      }
    }, timeoutDuration);
  }

  function handleCheckPress() {
    updateStats(true, currentLetter?.character || '');
    removeCurrentLetter();
  }

  function removeCurrentLetter() {
    const newQueue = queueWithoutCurrentLetter();

    setShowAnswer(false);
    setQueue(newQueue);
    setCurrentLetter(sample(newQueue));
  }

  function handleHelpPress() {
    if (!showAnswer) playSound();
    if (showVisualHint) setShowAnswer(!showAnswer);
  }

  function handleRestartPress() {
    const newQueue = generateFidelSample();
    setQueue(newQueue);
    setCurrentLetter(sample(newQueue));
  }

  function queueWithoutCurrentLetter() {
    return queue.filter((ele: { character: string; }) => (
      ele.character !== currentLetter?.character)
    );
  }

  function renderHelpButtonText() {
    if (showVisualHint) {
      return `${showAnswer ? 'Hide' : 'Show'} Answer`;
    } else {
      return 'Play Audio';
    }
  }

  if (!queue.length) return <SuccessPage handleRestartPress={handleRestartPress} />;

  return (
    <>
      <Text style={[globalStyles.fontSize96]}>{currentLetter?.character}</Text>
      <Text style={[globalStyles.fontSize48]}>
        {showAnswer ? currentLetter?.transliteration : '_'}
      </Text>

      <Text style={[globalStyles.fontSize16, { color: globalStyles.secondaryTextColor }]}>
        {queue.length} left
      </Text>

      <View style={styles.allButtonsContainer}>
        <View style={styles.answerButtonsContainer}>
          <Button
            onPress={handleXPress}
            mode='contained-tonal'
            style={styles.xButton}
            contentStyle={styles.flashcardPageButtonContent}
            labelStyle={globalStyles.standardButtonLabel}
          >
              ❌
          </Button>
          <Button
            onPress={handleCheckPress}
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
          onPress={handleHelpPress}
          style={styles.toggleAnswerButton}
          contentStyle={styles.flashcardPageButtonContent}
          labelStyle={styles.toggleAnswerButtonLabel}
        >
          {renderHelpButtonText()}
        </Button>
      </View>
    </>
  );
}
