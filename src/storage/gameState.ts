import type { GameStateType } from "../types/types";

const defaultGameState: GameStateType = {
  usedCharacterIds: [],
  optionCharacterIds: null,
  questionCharacterId: null,
  score: {
    total: 0,
    correct: 0,
  },
  settings: {
    language: "en",
    questionMode: "series",
    mediaType: null,
    seriesTitleLanguage: "english",
    includeAdultMedia: true,
  },
};

// Guarda en el almacenamiento local del navegador la información del juego.
export const saveGameState = (state: GameStateType): void => {
  localStorage.setItem("gameState", JSON.stringify(state));
};

// Carga los datos del juego guardados en el almacenamiento local del navegador.
export const loadGameState = (): GameStateType => {
  const data = localStorage.getItem("gameState");

  if (!data) {
    return defaultGameState;
  }

  try {
    return {
      ...defaultGameState,
      ...JSON.parse(data),
    };
  } catch {
    return defaultGameState;
  }
};
