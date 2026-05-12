import { characterIdsWithInvalidImages } from "../constants/characterIdsWithInvalidImages";

// Obtiene un número entero aleatorio dentro de un rango.
export const getRandomInt = (
  from: number,                       // Límite inferior.
  to: number,                         // Límite superior.
  exclude: Set<number> = new Set(),   // Valores excluidos.
): number => {
  let num: number;

  do {
    num = Math.floor(Math.random() * (to - from + 1)) + from;
  } while (exclude.has(num));

  return num;
};

// Genera IDs aleatorios únicos.
export const generateUniqueIds = (
  count: number,          // Cantidad de IDs.
  maxId: number,          // Valor máximo permitido.
  excluded: Set<number>,  // IDs excluidos.
): number[] => {
  const ids: number[] = [];
  const localExcluded = new Set([
    ...excluded,
    ...characterIdsWithInvalidImages,
  ]);

  for (let i = 0; i < count; i++) {
    const id = getRandomInt(1, maxId, localExcluded);
    ids.push(id);
    localExcluded.add(id);
  }

  return ids;
};