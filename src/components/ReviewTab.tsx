import React, { useState } from 'react';
import { UserWordState, WordItem, WordStatus } from '../types';
import { ALL_WORDS } from '../data/wordsData';
import { GENRES } from '../data/genresData';
import { WordCard } from './WordCard';
import { Eye, EyeOff, CheckCircle2, Sparkles, HelpCircle, AlertCircle } from 'lucide-react';

interface ReviewTabProps {
  userWordState: UserWordState;
  onUpdateWordStatus: (wordId: string, status: WordStatus) => void;
  onNavigateToLearnTab: () => void;
}

export const ReviewTab: React.FC<ReviewTabProps> = ({
  userWordState,
  onUpdateWordStatus,
  onNavigateToLearnTab,
}) => {
  const [subTab, setSubTab] = useState<'subtle' | 'weak'>('subtle');
  const [showJapaneseAll, setShowJapaneseAll] = useState(false); // Default OFF

  // Filter words that have 'subtle' or 'weak' status
  const filteredWords = ALL_WORDS.filter((word) => {
    const status = userWordState[word.id];
    return status === subTab;
  });

  // Calculate subtle and weak counts overall
  const subtleWords = ALL_WORDS.filter((w) => userWordState[w.id] === 'subtle');
  const weakWords = ALL_WORDS.filter((w) => userWordState[w.id] === 'weak');

  // Group words by genre
  const wordsByGenre: { [genreId: number]: { genreTitle: string; icon: string; words: WordItem[] } } = {};

  filteredWords.forEach((word) => {
    const genre = GENRES.find((g) => g.id === word.genreId);
    if (!genre) return;

    if (!wordsByGenre[word.genreId]) {
      wordsByGenre[word.genreId] = {
        genreTitle: genre.titleJa,
        icon: genre.icon,
        words: [],
      };
    }
    wordsByGenre[word.genreId].words.push(word);
  });

  return (
    <div className="pb-24 animate-in fade-in duration-200">
      {/* Top Header Controls */}
      <div className="sticky top-[61px] z-20 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-3">
        <div className="max-w-xl mx-auto flex items-center justify-between gap-2">
          {/* Sub-tabs: 微妙 (Subtle) | 苦手 (Weak) */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl">
            <button
              onClick={() => setSubTab('subtle')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                subTab === 'subtle'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>微妙</span>
              <span
                className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-full ${
                  subTab === 'subtle' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                }`}
              >
                {subtleWords.length}
              </span>
            </button>

            <button
              onClick={() => setSubTab('weak')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                subTab === 'weak'
                  ? 'bg-indigo-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>苦手</span>
              <span
                className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-full ${
                  subTab === 'weak' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                }`}
              >
                {weakWords.length}
              </span>
            </button>
          </div>

          {/* Toggle Japanese display */}
          <button
            onClick={() => setShowJapaneseAll(!showJapaneseAll)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
              showJapaneseAll
                ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200/80'
            }`}
          >
            {showJapaneseAll ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">日本語: </span>
            <span>{showJapaneseAll ? '表示中' : '非表示'}</span>
          </button>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 pt-4">
        {/* Banner */}
        <div
          className={`rounded-3xl p-5 mb-4 text-white shadow-md transition-colors ${
            subTab === 'subtle'
              ? 'bg-gradient-to-r from-sky-600 to-blue-700'
              : 'bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950'
          }`}
        >
          <div className="flex items-center gap-2 text-xs font-bold opacity-90 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>{subTab === 'subtle' ? '微妙な単語を復習' : '苦手な単語を集中克服'}</span>
          </div>
          <h2 className="text-xl font-bold font-heading">
            {subTab === 'subtle'
              ? `「微妙」に分類した単語 (${subtleWords.length}語)`
              : `「苦手」に分類した単語 (${weakWords.length}語)`}
          </h2>
          <p className="text-xs opacity-90 mt-1">
            スワイプして「クリア」を押すと復習リストから完了できます。
          </p>
        </div>

        {/* Empty State */}
        {filteredWords.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 my-6 shadow-xs">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3 text-3xl">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              {subTab === 'subtle'
                ? '「微妙」な単語はありません'
                : '「苦手」な単語はありません'}
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
              「学ぶ」タブで単語をチェックして、自信のない単語をスワイプ登録してみましょう。
            </p>
            <button
              onClick={onNavigateToLearnTab}
              className="mt-4 inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-2xl font-bold text-xs shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95"
            >
              「学ぶ」タブへ移動
            </button>
          </div>
        ) : (
          /* Grouped by Genre */
          <div className="space-y-6">
            {Object.entries(wordsByGenre).map(([genreId, group]) => (
              <div key={genreId} className="space-y-2">
                {/* Genre Group Header */}
                <div className="flex items-center gap-2 bg-slate-100 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700">
                  <span className="text-base">{group.icon}</span>
                  <span className="font-heading">
                    No.{genreId} {group.genreTitle}
                  </span>
                  <span className="ml-auto bg-white px-2 py-0.5 rounded-md text-[11px] text-slate-500">
                    {group.words.length} 語
                  </span>
                </div>

                {/* Word cards */}
                {group.words.map((word) => (
                  <WordCard
                    key={word.id}
                    word={word}
                    status={userWordState[word.id] || 'normal'}
                    showJapaneseAll={showJapaneseAll}
                    onUpdateStatus={onUpdateWordStatus}
                    reviewContext={subTab}
                  />
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
