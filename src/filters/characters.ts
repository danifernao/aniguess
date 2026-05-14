import type { CharacterType } from "../types/types";

// Filtra los personajes que cumplen con las condiciones necesarias
// para ser usados como opciones de respuesta.
export const filterValidCharacters = (
  apiCharacters: CharacterType[],
  settings: {
    mediaType: string | null;
    mediaNsfw: boolean;
  },
  limit: number,
): CharacterType[] => {
  const result: CharacterType[] = [];

  for (let i = 0; i < apiCharacters.length; i++) {
    const character = apiCharacters[i];

    // Solo se consideran los personajes que tengan al menos una obra.
    if (character.media.nodes.length === 0) {
      continue;
    }

    // Verifica si la imagen del personaje es la predeterminada o no.
    const imageIsDefault = /default\.jpg$/.test(character.image.large);

    // Filtra los personajes que tengan obras con título en inglés o
    // romaji y que cumplan con la configuración de contenido NSFW establecida
    // por el jugador.
    const media = character.media.nodes.filter(
      (m) =>
        (m.title.english || m.title.romaji) &&
        (settings.mediaNsfw || !m.isAdult),
    );

    // Solo se consideran los personajes que tengan imagen y no sea la
    // utilizada por defecto.
    if (imageIsDefault || media.length === 0) {
      continue;
    }

    result.push({
      ...character,
      media: {
        ...character.media,
        nodes: media,
      },
    });

    // Si se han obtenido ya el número de opciones necesarias,
    // se detiene el ciclo.
    if (result.length === limit) {
      break;
    }
  }

  return result;
};
