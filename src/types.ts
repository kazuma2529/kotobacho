export type WordStatus = 'normal' | 'subtle' | 'weak'; // normal: 未分類, subtle: 微妙, weak: 苦手

export interface WordItem {
  id: string; // e.g. "31-1"
  number: number;
  ja: string;
  en: string;
  genreId: number;
}

export interface Genre {
  id: number;
  name: string;
  titleJa: string;
  titleEn: string;
  description: string;
  icon: string; // Emoji
  count: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  avatar: string;
  createdAt: string;
}

export interface UserWordState {
  [wordId: string]: WordStatus;
}

export type MainTab = 'learn' | 'review';
export type FilterType = 'all' | 'subtle' | 'weak';
export type ReviewSubTab = 'subtle' | 'weak';
