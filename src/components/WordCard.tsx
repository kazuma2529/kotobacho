import React, { useState, useRef } from 'react';
import { WordItem, WordStatus } from '../types';
import { speakEnglishWord } from '../utils/audio';
import { Volume2, ChevronLeft, Check, AlertCircle, HelpCircle } from 'lucide-react';

interface WordCardProps {
  word: WordItem;
  status: WordStatus;
  showJapaneseAll: boolean;
  onUpdateStatus: (wordId: string, newStatus: WordStatus) => void;
  reviewContext?: 'subtle' | 'weak'; // Optional context when rendered in Review tab
}

export const WordCard: React.FC<WordCardProps> = ({
  word,
  status,
  showJapaneseAll,
  onUpdateStatus,
  reviewContext,
}) => {
  const [showJapaneseLocal, setShowJapaneseLocal] = useState(false);
  const [isSwipedOpen, setIsSwipedOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const isJapaneseVisible = showJapaneseAll || showJapaneseLocal;

  // Handle Speech Audio
  const handleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    speakEnglishWord(word.en);
  };

  // Toggle local Japanese translation view
  const handleToggleLocalJa = () => {
    setShowJapaneseLocal(!showJapaneseLocal);
  };

  // Touch Swipe Handling
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartX.current - touchEndX;

    // Swipe left threshold (reveal action buttons)
    if (diffX > 40) {
      setIsSwipedOpen(true);
    } else if (diffX < -40) {
      setIsSwipedOpen(false);
    }
    touchStartX.current = null;
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/90 shadow-xs mb-2.5 transition-all">
      {/* Container wrapper for slide effect */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={handleToggleLocalJa}
        className={`p-3.5 sm:p-4 flex items-center justify-between gap-3 cursor-pointer select-none transition-transform duration-200 bg-white ${
          isSwipedOpen ? '-translate-x-32 sm:-translate-x-36' : 'translate-x-0'
        }`}
      >
        {/* Left: Number + Audio + English & Japanese */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Index Number */}
          <span className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 font-bold text-xs flex items-center justify-center shrink-0">
            {word.number}
          </span>

          {/* Audio Pronunciation Button */}
          <button
            type="button"
            onClick={handleAudio}
            className="w-9 h-9 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 active:scale-95 transition-all"
            title="音声を聞く"
          >
            <Volume2 className="w-4 h-4" />
          </button>

          {/* Word text */}
          <div className="min-w-0 flex-1">
            <div className="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-snug font-sans break-words">
              {word.en}
            </div>

            {/* Japanese translation */}
            <div className="mt-0.5">
              {isJapaneseVisible ? (
                <span className="text-xs font-semibold text-slate-600 bg-amber-50 text-amber-900 px-2 py-0.5 rounded-md inline-block max-w-full break-words animate-in fade-in duration-150">
                  {word.ja}
                </span>
              ) : (
                <span className="text-[11px] font-medium text-slate-400 bg-slate-100/80 hover:bg-slate-200 px-2 py-0.5 rounded-md inline-block transition-colors">
                  タップして和訳を表示
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right side status badge & action handle */}
        <div className="flex items-center gap-2 shrink-0">
          {status === 'subtle' && (
            <span className="bg-sky-100 text-sky-800 text-[11px] font-bold px-2.5 py-1 rounded-full border border-sky-200/80 flex items-center gap-1">
              <HelpCircle className="w-3 h-3 text-sky-600" />
              微妙
            </span>
          )}
          {status === 'weak' && (
            <span className="bg-indigo-900 text-indigo-100 text-[11px] font-bold px-2.5 py-1 rounded-full border border-indigo-700 flex items-center gap-1 shadow-xs">
              <AlertCircle className="w-3 h-3 text-indigo-300" />
              苦手
            </span>
          )}

          {/* Swipe toggle button for non-touch / click users */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsSwipedOpen(!isSwipedOpen);
            }}
            className={`p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-transform ${
              isSwipedOpen ? 'rotate-180 bg-slate-100' : ''
            }`}
            title={isSwipedOpen ? '閉じる' : 'スライド操作'}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Slide-out Action Buttons (Revealed on left-swipe) */}
      <div
        className={`absolute top-0 right-0 bottom-0 flex items-center h-full transition-opacity duration-200 ${
          isSwipedOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {reviewContext === 'subtle' ? (
          // In Subtle Review Tab
          <>
            <button
              onClick={() => {
                onUpdateStatus(word.id, 'weak');
                setIsSwipedOpen(false);
              }}
              className="h-full bg-indigo-900 hover:bg-indigo-950 text-white font-bold text-xs px-3 sm:px-4 flex flex-col items-center justify-center gap-1 transition-colors"
            >
              <AlertCircle className="w-4 h-4 text-indigo-300" />
              苦手へ
            </button>
            <button
              onClick={() => {
                onUpdateStatus(word.id, 'normal');
                setIsSwipedOpen(false);
              }}
              className="h-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 sm:px-4 flex flex-col items-center justify-center gap-1 transition-colors"
            >
              <Check className="w-4 h-4" />
              クリア
            </button>
          </>
        ) : reviewContext === 'weak' ? (
          // In Weak Review Tab
          <>
            <button
              onClick={() => {
                onUpdateStatus(word.id, 'subtle');
                setIsSwipedOpen(false);
              }}
              className="h-full bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs px-3 sm:px-4 flex flex-col items-center justify-center gap-1 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              微妙へ
            </button>
            <button
              onClick={() => {
                onUpdateStatus(word.id, 'normal');
                setIsSwipedOpen(false);
              }}
              className="h-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 sm:px-4 flex flex-col items-center justify-center gap-1 transition-colors"
            >
              <Check className="w-4 h-4" />
              クリア
            </button>
          </>
        ) : (
          // Standard Genre Word List
          <>
            <button
              onClick={() => {
                onUpdateStatus(word.id, status === 'subtle' ? 'normal' : 'subtle');
                setIsSwipedOpen(false);
              }}
              className={`h-full font-bold text-xs px-3 sm:px-4 flex flex-col items-center justify-center gap-1 transition-colors ${
                status === 'subtle'
                  ? 'bg-slate-600 hover:bg-slate-700 text-white'
                  : 'bg-sky-500 hover:bg-sky-600 text-white'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              {status === 'subtle' ? '解除' : '微妙'}
            </button>
            <button
              onClick={() => {
                onUpdateStatus(word.id, status === 'weak' ? 'normal' : 'weak');
                setIsSwipedOpen(false);
              }}
              className={`h-full font-bold text-xs px-3 sm:px-4 flex flex-col items-center justify-center gap-1 transition-colors ${
                status === 'weak'
                  ? 'bg-slate-600 hover:bg-slate-700 text-white'
                  : 'bg-indigo-900 hover:bg-indigo-950 text-white'
              }`}
            >
              <AlertCircle className="w-4 h-4 text-indigo-300" />
              {status === 'weak' ? '解除' : '苦手'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};
