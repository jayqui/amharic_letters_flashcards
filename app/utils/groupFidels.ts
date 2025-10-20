import fidelsObject from '../data/fidels';
import { Fidel } from '../types/FidelTypes';

const STANDARD_VOWELS = ['ə', 'u', 'i', 'a', 'ē', 'ih', 'o'];
const DIPHTHONGS = ['diphthong_1', 'diphthong_2', 'uah', 'diphthong_4', 'uuh'];

export function fidelsObjectNoDiphthongs() {
  const accum: { [key: string]: Fidel[] } = {};

  Object.keys(fidelsObject).forEach((consonant) => {
    const allFidelsForConsonant = (fidelsObject as Record<string, Record<string, Fidel>>)[consonant];
    const nonDiphthongFidelsForConsonant = STANDARD_VOWELS.map((vowel) => allFidelsForConsonant[vowel]);
    accum[consonant] = nonDiphthongFidelsForConsonant;
  });

  return accum;
}

export function fidelsObjectWithDiphthongs() {
  const accum: { [key: string]: Fidel[] } = {};

  const allVowelsAndDiphthongs = STANDARD_VOWELS.concat(DIPHTHONGS);
  const fakeFidel = (consonant: string, vowelOrDiphthong: string) => ({
    character: '',
    transliteration: '',
    consonant,
    vowel: vowelOrDiphthong,
    file: {},
  });

  Object.keys(fidelsObject).forEach((consonant) => {
    const allFidelsForConsonant = (fidelsObject as Record<string, Record<string, Fidel>>)[consonant];
    const paddedFidelListForConsonant = allVowelsAndDiphthongs.map((vowelOrDiphthong) => {
      if (Object.hasOwn(allFidelsForConsonant, vowelOrDiphthong)) {
        return allFidelsForConsonant[vowelOrDiphthong];
      } else {
        return fakeFidel(consonant, vowelOrDiphthong);
      }
    });
    accum[consonant] = paddedFidelListForConsonant;
  });

  return accum;
}
