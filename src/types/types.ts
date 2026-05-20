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
  relations: {
    nodes: [
      {
        id: number;
      },
    ];
  };
  siteUrl: string;
}

export interface SettingsType {
  language: "es" | "en";
  questionMode: "character" | "series";
  mediaType: string | null;
  seriesTitleLanguage: "english" | "romaji";
  includeAdultMedia: boolean;
  enableSoundEffects: boolean;
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
  availableHints: number;
  score: ScoreType;
  settings: SettingsType;
}
