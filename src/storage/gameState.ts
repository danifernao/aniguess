import type { GameStateType } from "../types/types";

// Guarda en el almacenamiento local del navegador la información del juego.
export const saveGameState = (state: GameStateType): void => {
  localStorage.setItem("gameState", JSON.stringify(state));
};

// Carga los datos del juego guardados en el almacenamiento local del navegador.
export const loadGameState = (): GameStateType | null => {
  const data = localStorage.getItem("gameState");

  if (!data) {
    return null;
  }

  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
};
