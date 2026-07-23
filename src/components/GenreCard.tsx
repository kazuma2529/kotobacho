import React from 'react';
import { Genre, UserWordState } from '../types';
import { ChevronRight } from 'lucide-react';

interface GenreCardProps {
  genre: Genre;
  onSelectGenre: (genre: Genre) => void;
  userWordState: UserWordState;
}

export const GenreCard: React.FC<GenreCardProps> = ({
  genre,
  onSelectGenre,
  userWordState,
}) => {
  // Count words marked in this genre
  let subtleCount = 0;
  let weakCount = 0;

  Object.entries(userWordState).forEach(([wordId, status]) => {
    // wordId format is `${genreId}-${number}`
    const prefix = `${genre.id}-`;
    if (wordId.startsWith(prefix)) {
      if (status === 'subtle') subtleCount++;
      if (status === 'weak') weakCount++;
    }
  });

  return (
    <button
      onClick={() => onSelectGenre(genre)}
      className="w-full text-left bg-white rounded-2xl p-4 border border-slate-200/80 hover:border-blue-400 hover:shadow-md transition-all duration-200 group flex items-center justify-between gap-3 active:scale-[0.99]"
    >
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 group-hover:bg-blue-50 transition-all">
          {genre.icon}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
              No.{genre.id}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {genre.count}語
            </span>
          </div>
          <h3 className="font-bold text-slate-800 text-sm sm:text-base truncate group-hover:text-blue-600 transition-colors font-heading">
            {genre.titleJa}
          </h3>
          <p className="text-xs text-slate-400 truncate">{genre.titleEn}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {(subtleCount > 0 || weakCount > 0) && (
          <div className="flex flex-col items-end gap-1 text-[10px] font-semibold">
            {subtleCount > 0 && (
              <span className="bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full">
                微妙 {subtleCount}
              </span>
            )}
            {weakCount > 0 && (
              <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                苦手 {weakCount}
              </span>
            )}
          </div>
        )}
        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </button>
  );
};
