/**
 * @param max numero maximo que pode retornar
 * @returns entre e 1 e o max
 */
export function randomNumber(max: number) {
  return Math.floor(Math.random() * max) + 1;
}
