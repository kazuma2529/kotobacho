import React, { useState, useEffect } from 'react';
import { Genre, UserWordState, WordItem, WordStatus } from '../types';
import { getWordsByGenre } from '../data/wordsData';
import { WordCard } from './WordCard';
import { ArrowLeft, Eye, EyeOff, Filter } from 'lucide-react';

interface GenreWordListScreenProps {
  genre: Genre;
  onBack: () => void;
  userWordState: UserWordState;
  onUpdateWordStatus: (wordId: string, status: WordStatus) => void;
}

export const GenreWordListScreen: React.FC<GenreWordListScreenProps> = ({
  genre,
  onBack,
  userWordState,
  onUpdateWordStatus,
}) => {
  const [showJapaneseAll, setShowJapaneseAll] = useState(false); // Default OFF per user spec
  const [filter, setFilter] = useState<'all' | 'subtle' | 'weak'>('all');

  // Always scroll to top when opening a genre
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [genre.id]);

  const words: WordItem[] = getWordsByGenre(genre.id);

  // Filter words
  const filteredWords = words.filter((word) => {
    const status = userWordState[word.id] || 'normal';
    if (filter === 'subtle') return status === 'subtle';
    if (filter === 'weak') return status === 'weak';
    return true;
  });

  // Calculate statistics for this genre
  const subtleCount = words.filter((w) => userWordState[w.id] === 'subtle').length;
  const weakCount = words.filter((w) => userWordState[w.id] === 'weak').length;

  return (
    <div className="pb-24 animate-in fade-in duration-200">
      {/* Top Bar with Back Button */}
      <div className="sticky top-[61px] z-20 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 flex items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-slate-700 hover:text-blue-600 font-bold text-xs bg-slate-100 hover:bg-slate-200/80 px-3 py-2 rounded-xl transition-colors active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>ジャンル一覧へ</span>
        </button>

        {/* Global Japanese Translation Toggle (Default OFF) */}
        <button
          onClick={() => setShowJapaneseAll(!showJapaneseAll)}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
            showJapaneseAll
              ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
              : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200/80'
          }`}
        >
          {showJapaneseAll ? (
            <>
              <Eye className="w-4 h-4" />
              <span>日本語: 表示中</span>
            </>
          ) : (
            <>
              <EyeOff className="w-4 h-4" />
              <span>日本語: 非表示</span>
            </>
          )}
        </button>
      </div>

      {/* Genre Banner Header */}
      <div className="p-4 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl m-4 shadow-lg">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-3">
            <span className="text-4xl bg-white/10 w-14 h-14 rounded-2xl flex items-center justify-center backdrop-blur-xs border border-white/10">
              {genre.icon}
            </span>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-400 bg-blue-950/60 px-2.5 py-0.5 rounded-full border border-blue-800/60">
                Genre {genre.id}
              </span>
              <h2 className="text-xl font-bold mt-1 text-white font-heading">
                {genre.titleJa}
              </h2>
              <p className="text-xs text-slate-300 font-sans">{genre.titleEn}</p>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-300 mt-2 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/5">
          {genre.description}
        </p>

        {/* Word count summary badges */}
        <div className="flex items-center justify-between text-xs mt-3 pt-2 border-t border-white/10">
          <span className="text-slate-300 font-medium">全 {words.length} 単語</span>
          <div className="flex items-center gap-2 font-bold text-[11px]">
            <span className="bg-sky-500/20 text-sky-300 px-2.5 py-0.5 rounded-full border border-sky-400/30">
              微妙: {subtleCount}
            </span>
            <span className="bg-indigo-500/30 text-indigo-200 px-2.5 py-0.5 rounded-full border border-indigo-400/30">
              苦手: {weakCount}
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs within Genre */}
      <div className="px-4 mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filter === 'all'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'hover:text-slate-800'
            }`}
          >
            すべて ({words.length})
          </button>
          <button
            onClick={() => setFilter('subtle')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filter === 'subtle'
                ? 'bg-sky-500 text-white shadow-xs'
                : 'hover:text-slate-800'
            }`}
          >
            微妙 ({subtleCount})
          </button>
          <button
            onClick={() => setFilter('weak')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filter === 'weak'
                ? 'bg-indigo-900 text-white shadow-xs'
                : 'hover:text-slate-800'
            }`}
          >
            苦手 ({weakCount})
          </button>
        </div>
      </div>

      {/* Words List */}
      <div className="px-4">
        {filteredWords.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 my-4">
            <Filter className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-600">該当する単語はありません</p>
            <p className="text-xs text-slate-400 mt-1">
              フィルターを切り替えるか、単語を「微妙」「苦手」に分類してみましょう。
            </p>
          </div>
        ) : (
          filteredWords.map((word) => (
            <WordCard
              key={word.id}
              word={word}
              status={userWordState[word.id] || 'normal'}
              showJapaneseAll={showJapaneseAll}
              onUpdateStatus={onUpdateWordStatus}
            />
          ))
        )}
      </div>
    </div>
  );
};
