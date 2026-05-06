import { getRandomInt } from "../utils/randomInt";

// Genera IDs únicos evitando duplicados.
export const generateUniqueIds = (
  count: number,
  maxId: number,
  excluded: Set<number>,
): number[] => {
  const ids: number[] = [];
  const localExcluded = new Set(excluded);

  for (let i = 0; i < count; i++) {
    const id = getRandomInt(1, maxId, localExcluded);
    ids.push(id);
    localExcluded.add(id);
  }

  return ids;
};