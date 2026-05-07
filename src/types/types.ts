export interface ScoreType {
  total: number;
  correct: number;
}

export interface SettingsType {
  language: "es" | "en";
  questionMode: "character" | "series";
  mediaType: string | null;
  mediaNsfw: boolean;
}

export interface GameStateType {
  maxCharacterId: number | null;
  usedCharacterIds: number[];
  score: ScoreType;
  settings: SettingsType;
}

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