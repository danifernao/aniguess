export interface ApiResponseType {
  data: {
    Page: {
      characters: ALCharType[];
    };
  };
}

export interface AppScoreType {
  total: number;
  correct: number;
}

export interface AppSettingsType {
  mediaType: string | null;
  mediaNsfw: boolean;
}

export interface AppBackupType {
  totalChars: number | null;
  idsTaken: number[];
  score: AppScoreType;
  settings: AppSettingsType;
}

export interface ALCharType {
  id: number;
  name: {
    full: string;
  };
  image: {
    large: string;
  };
  media: {
    nodes: ALMediaType[];
  };
  siteUrl: string;
}

export interface ALMediaType {
  id: number;
  isAdult: boolean;
  title: {
    english: string;
    romaji: string;
  };
  siteUrl: string;
}

export interface TranslType {
  question: string;
  answer: TranslAnswerType;
  score: TranslScoreType;
  loading: TranslLoadingType;
  settings: TranslSettingsType;
}

export interface TranslAnswerType {
  correct: string;
  incorrect: string;
  next: string;
}

export interface TranslScoreType {
  correct: string;
  total: string;
  percentage: string;
}

export interface TranslLoadingType {
  intro: string;
  delay: string;
  error: string;
}

export interface TranslSettingsType {
  title: string;
  mediaType: {
    legend: string;
    options: {
      anime: string;
      manga: string;
    }
  };
  mediaNsfw: {
    legend: string;
    options: {
      yes: string;
      no: string;
    }
  },
  note: string;
  close: string;
}