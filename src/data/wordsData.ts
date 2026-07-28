import { WordItem } from '../types';
import { WORDS_PART_1 } from './wordsPart1';
import { WORDS_PART_2 } from './wordsPart2';
import { WORDS_PART_3 } from './wordsPart3';
import { WORDS_PART_4 } from './wordsPart4';
import { WORDS_PART_5 } from './wordsPart5';
import { WORDS_PART_6 } from './wordsPart6';

export const ALL_WORDS: WordItem[] = [
  ...WORDS_PART_1,
  ...WORDS_PART_2,
  ...WORDS_PART_3,
  ...WORDS_PART_4,
  ...WORDS_PART_5,
  ...WORDS_PART_6,
];

export function getWordsByGenre(genreId: number): WordItem[] {
  return ALL_WORDS.filter((w) => w.genreId === genreId);
}

export function getWordById(id: string): WordItem | undefined {
  return ALL_WORDS.find((w) => w.id === id);
}

export function searchWords(query: string): WordItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return ALL_WORDS.filter(
    (w) => w.ja.includes(q) || w.en.toLowerCase().includes(q)
  );
}
