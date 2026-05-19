import { loadGameState, saveGameState } from "../storage/gameState";
import { fetchAniListData } from "./anilist";

// Obtiene el ID del personaje más reciente registrado en AniList.
const fetchLastCharacterId = async (): Promise<number> => {
  const query = `
    query {
      Page(perPage: 1) {
        characters(sort: ID_DESC) {
          id
        }
      }
    }`;

  const response = await fetchAniListData(query);

  const id = response.data.Page.characters[0].id;

  if (!id) {
    throw new Error("Invalid API response");
  }

  return id;
};

// Recupera el ID máximo desde almacenamiento local o lo actualiza si expiró.
export async function getMaxCharacterId(
  expirationDays: number = 7,
): Promise<number> {
  const state = loadGameState();

  const cache = state?.maxCharacterId;

  if (cache) {
    const age = Date.now() - cache.updatedAt;
    const maxAge = expirationDays * 24 * 60 * 60 * 1000;

    if (age < maxAge && Number.isInteger(cache.value)) {
      return cache.value;
    }
  }

  const value = await fetchLastCharacterId();

  saveGameState({
    ...state,
    maxCharacterId: {
      value,
      updatedAt: Date.now(),
    },
  });

  return value;
}
