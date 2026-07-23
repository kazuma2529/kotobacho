import React, { useState } from 'react';
import { Genre, UserWordState, WordStatus } from '../types';
import { GENRES } from '../data/genresData';
import { ALL_WORDS, searchWords } from '../data/wordsData';
import { GenreCard } from './GenreCard';
import { WordCard } from './WordCard';
import { Search, SlidersHorizontal, BookOpen, Eye, EyeOff } from 'lucide-react';

interface LearnTabProps {
  onSelectGenre: (genre: Genre) => void;
  userWordState: UserWordState;
  onUpdateWordStatus: (wordId: string, status: WordStatus) => void;
}

export const LearnTab: React.FC<LearnTabProps> = ({
  onSelectGenre,
  userWordState,
  onUpdateWordStatus,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showJapaneseSearch, setShowJapaneseSearch] = useState(false);

  const isSearching = searchQuery.trim().length > 0;
  const searchResults = isSearching ? searchWords(searchQuery) : [];

  const genreCount = GENRES.length;
  const totalWordsCount = ALL_WORDS.length;

  // Filter genres by search query
  const filteredGenres = GENRES.filter(
    (g) =>
      g.titleJa.includes(searchQuery.trim()) ||
      g.titleEn.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
      g.description.includes(searchQuery.trim())
  );

  return (
    <div className="pb-24 animate-in fade-in duration-200">
      {/* Search Bar */}
      <div className="sticky top-[61px] z-20 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-3">
        <div className="max-w-xl mx-auto flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ジャンルや英単語・日本語で検索..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 hover:bg-slate-100/80 focus:bg-white border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-2xl text-sm outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 bg-slate-200 px-1.5 py-0.5 rounded-full"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-xl mx-auto px-4 pt-4">
        {!isSearching ? (
          <>
            {/* Learn Tab Hero Banner */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-3xl p-5 mb-5 shadow-lg relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 text-white/10 text-9xl font-serif pointer-events-none select-none">
                {genreCount}
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-blue-200 text-xs font-bold uppercase tracking-wider mb-1">
                  <BookOpen className="w-4 h-4" />
                  <span>言えそうで言えない {genreCount}ジャンル</span>
                </div>
                <h2 className="text-xl font-bold font-heading">
                  日常会話の身近な名詞をマスター
                </h2>
                <p className="text-xs text-blue-100 mt-1 max-w-md">
                  気になるジャンルを選択して、英語と日本語の対訳を学びましょう。
                </p>
              </div>
            </div>

            {/* Genre Header */}
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 font-heading">
                <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                ジャンル一覧 (全 {genreCount} ジャンル / {totalWordsCount.toLocaleString()} 語)
              </h3>
            </div>

            {/* Genre Cards List */}
            <div className="space-y-3">
              {filteredGenres.map((genre) => (
                <GenreCard
                  key={genre.id}
                  genre={genre}
                  onSelectGenre={onSelectGenre}
                  userWordState={userWordState}
                />
              ))}
            </div>
          </>
        ) : (
          /* Search Mode View */
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-800">
                検索結果: 単語 ({searchResults.length} 件) / ジャンル ({filteredGenres.length} 件)
              </h3>
              {searchResults.length > 0 && (
                <button
                  onClick={() => setShowJapaneseSearch(!showJapaneseSearch)}
                  className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg flex items-center gap-1"
                >
                  {showJapaneseSearch ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>和訳 {showJapaneseSearch ? '表示中' : '非表示'}</span>
                </button>
              )}
            </div>

            {/* Matching Words */}
            {searchResults.length > 0 && (
              <div className="mb-6 space-y-2">
                <div className="text-xs font-bold text-slate-500 mb-2">該当単語</div>
                {searchResults.slice(0, 50).map((word) => (
                  <WordCard
                    key={word.id}
                    word={word}
                    status={userWordState[word.id] || 'normal'}
                    showJapaneseAll={showJapaneseSearch}
                    onUpdateStatus={onUpdateWordStatus}
                  />
                ))}
                {searchResults.length > 50 && (
                  <p className="text-xs text-center text-slate-400 py-2">
                    上位 50 件を表示しています。絞り込み検索をお試しください。
                  </p>
                )}
              </div>
            )}

            {/* Matching Genres */}
            {filteredGenres.length > 0 && (
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-500 mb-2">該当ジャンル</div>
                {filteredGenres.map((genre) => (
                  <GenreCard
                    key={genre.id}
                    genre={genre}
                    onSelectGenre={onSelectGenre}
                    userWordState={userWordState}
                  />
                ))}
              </div>
            )}

            {searchResults.length === 0 && filteredGenres.length === 0 && (
              <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 my-6">
                <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-sm font-bold text-slate-700">「{searchQuery}」に一致する結果は見つかりませんでした</p>
                <p className="text-xs text-slate-400 mt-1">
                  別のキーワードまたはひらがな・アルファベットでお試しください。
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
