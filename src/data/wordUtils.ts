import { WordItem } from '../types';

/**
 * Helper function to create an array of WordItems efficiently and safely.
 * @param genreId - The ID of the genre
 * @param items - Array of [Japanese, English] tuples
 * @param startNum - Starting number for items (defaults to 1)
 */
export function makeWordList(
  genreId: number,
  items: [string, string][],
  startNum = 1
): WordItem[] {
  return items.map(([ja, en], index) => {
    const num = startNum + index;
    return {
      id: `${genreId}-${num}`,
      number: num,
      ja,
      en,
      genreId,
    };
  });
}
