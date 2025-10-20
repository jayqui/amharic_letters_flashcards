import { useState, useEffect } from 'react';
import { Text } from 'react-native';
import { sample, sampleSize } from 'lodash';
import * as globalStyles from '../globalStyles';
import { Audio } from 'expo-av';

import SuccessPage from '../components/SuccessPage';
import ButtonsContainer from './FlashcardPage/ButtonsContainer';

import { fidelsArray as fidel } from '../data/fidels';
import { updateStats } from '../utils/stats/statsManager';


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

  function handleHelpPress() {
    if (!showAnswer) playSound();
    if (showVisualHint) setShowAnswer(!showAnswer);
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

      <ButtonsContainer
        showAnswer={showAnswer}
        showVisualHint={showVisualHint}
        onXPress={handleXPress}
        onCheckPress={handleCheckPress}
        onHelpPress={handleHelpPress}
      />
    </>
  );
}
