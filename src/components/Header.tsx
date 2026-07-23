import React from 'react';
import { UserProfile } from '../types';
import { User, LogIn } from 'lucide-react';

interface HeaderProps {
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
  subtleCount: number;
  weakCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onOpenAuth,
  subtleCount,
  weakCount,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 shadow-xs">
      <div className="max-w-xl mx-auto flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <span className="text-xl font-bold font-serif">言</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800 leading-tight font-heading flex items-center gap-1.5">
              ことば帳
            </h1>
            <p className="text-[11px] text-slate-500 font-medium">言えそうで言えない英単語</p>
          </div>
        </div>

        {/* User profile button & status summary */}
        <div className="flex items-center gap-2">
          {currentUser && (
            <div className="hidden sm:flex items-center gap-2 text-xs font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
              <span className="text-blue-600 font-bold">微妙 {subtleCount}</span>
              <span className="text-slate-300">|</span>
              <span className="text-indigo-600 font-bold">苦手 {weakCount}</span>
            </div>
          )}

          <button
            onClick={onOpenAuth}
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200/80 text-slate-700 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border border-slate-200/60 active:scale-95"
            title="ユーザー切替・ログイン"
          >
            {currentUser ? (
              <>
                <span className="text-sm leading-none">{currentUser.avatar}</span>
                <span className="max-w-[70px] truncate">{currentUser.name}</span>
              </>
            ) : (
              <>
                <LogIn className="w-3.5 h-3.5 text-blue-600" />
                <span>ログイン</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
