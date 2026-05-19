export type ErrorType = null | "init" | "quiz";

export interface ApiResponseType {
  data: {
    Page: {
      characters: CharacterType[];
    };
  };
}

export interface CharacterType {
  id: number;
  name: {
    full: string;
  };
  image: {
    large: string;
  };
  media: {
    nodes: MediaType[];
  };
  siteUrl: string;
}

export interface MediaType {
  id: number;
  isAdult: boolean;
  title: {
    english: string;
    romaji: string;
  };
  siteUrl: string;
}

export interface SettingsType {
  language: "es" | "en";
  questionMode: "character" | "series";
  seriesTitleLanguage: "english" | "romaji";
  mediaType: string | null;
  includeAdultMedia: boolean;
}

export interface ScoreType {
  total: number;
  correct: number;
}

export interface GameStateType {
  maxCharacterId?: {
    value: number;
    updatedAt: number;
  };
  usedCharacterIds: number[];
  optionCharacterIds: number[] | null;
  questionCharacterId: number | null;
  score: ScoreType;
  settings: SettingsType;
}
