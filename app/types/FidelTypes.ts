export type Fidel = {
  character: string,
  transliteration: string,
  consonant: string,
  vowel: string,
  file: object,
}

export type consonantGroup = {
  [index: string]: Array<Fidel>,
}
