import { uniq } from 'lodash';
import { fidelsObjectNoDiphthongs, fidelsObjectWithDiphthongs } from './groupFidels';

describe('fidelsObjectNoDiphthongs', () => {
  it('includes all letters in the expected order', () => {
    const grouped = fidelsObjectNoDiphthongs();
    expect(Object.keys(grouped)[1]).toEqual('ለ');
    expect(Object.keys(grouped).length).toEqual(34);
  });

  it('does not include diphthongs', () => {
    const grouped = fidelsObjectNoDiphthongs();
    expect(grouped['ለ'].slice(-1)[0]).toEqual({
      character: 'ሎ',
      transliteration: 'lo',
      consonant: 'ለ',
      vowel: 'o',
      file: require('../assets/audio/fidel/02_l_06.wav')
    });
    expect(grouped['ለ'].length).toEqual(7);
  });
});

describe('fidelsObjectWithDiphthongs', () => {
  it('includes all letters in the expected order', () => {
    const grouped = fidelsObjectWithDiphthongs();
    expect(Object.keys(grouped)[1]).toEqual('ለ');
    expect(Object.keys(grouped).length).toEqual(34);
  });

  it('includes diphthongs, including placeholder fake empty letters', () => {
    const grouped = fidelsObjectWithDiphthongs();

    expect(grouped['ለ'][7]).toEqual({
      character: '',
      transliteration: '',
      consonant: 'ለ',
      vowel: 'diphthong_1',
      file: {},
    });

    expect(grouped['ቀ'].slice(-1)[0]).toEqual({
      character: 'ቍ',
      transliteration: 'quuh',
      consonant: 'ቀ',
      vowel: 'uuh',
      file: 1, // Not sure how Jest compares this . . .
    });

    const lenghtsOfFidelGroups = Object.keys(grouped).map((consonant) => grouped[consonant].length);
    expect(uniq(lenghtsOfFidelGroups)).toEqual([12]);
  });
});
