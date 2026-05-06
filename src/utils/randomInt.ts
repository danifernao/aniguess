// Obtiene un número entero aleatorio entre un rango determinado.
// Acepta un arreglo de números a no tener en cuenta.
export const getRandomInt = (
  from: number,
  to: number,
  exclude: Set<number> = new Set(),
): number => {
  let num: number;

  do {
    num = Math.floor(Math.random() * (to - from + 1)) + from;
  } while (exclude.has(num));

  return num;
};