export type SettingsTypes = {
  settings: SettingsType,
  setSettings: (settings: SettingsType) => void,
};

export type SettingsType = {
  flashcardBatchSize: number,
  keepMissed: boolean,
  shouldSpeak: boolean,
  showVisualHint: boolean,

  diphthongFreeFidelList: boolean,
}

export const DEFAULT_SETTINGS = {
  flashcardBatchSize: 3,
  keepMissed: true,
  shouldSpeak: true,
  showVisualHint: true,
  diphthongFreeFidelList: false,
};
