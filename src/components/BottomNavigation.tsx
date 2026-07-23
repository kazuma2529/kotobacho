import React from 'react';
import { MainTab } from '../types';
import { BookOpen, RefreshCw } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: MainTab;
  onSelectTab: (tab: MainTab) => void;
  subtleCount: number;
  weakCount: number;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onSelectTab,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-lg">
      <div className="max-w-md mx-auto grid grid-cols-2 h-16">
        {/* Tab 1: 学ぶ (Learn) */}
        <button
          onClick={() => onSelectTab('learn')}
          className={`flex flex-col items-center justify-center gap-1 transition-all relative ${
            activeTab === 'learn'
              ? 'text-blue-600 font-bold'
              : 'text-slate-400 font-medium hover:text-slate-600'
          }`}
        >
          <div className="relative">
            <BookOpen
              className={`w-5 h-5 transition-transform ${
                activeTab === 'learn' ? 'scale-110' : ''
              }`}
            />
          </div>
          <span className="text-xs leading-none">学ぶ</span>
          {activeTab === 'learn' && (
            <span className="absolute bottom-1 w-8 h-0.5 bg-blue-600 rounded-full" />
          )}
        </button>

        {/* Tab 2: 復習 (Review) */}
        <button
          onClick={() => onSelectTab('review')}
          className={`flex flex-col items-center justify-center gap-1 transition-all relative ${
            activeTab === 'review'
              ? 'text-blue-600 font-bold'
              : 'text-slate-400 font-medium hover:text-slate-600'
          }`}
        >
          <div className="relative">
            <RefreshCw
              className={`w-5 h-5 transition-transform ${
                activeTab === 'review' ? 'scale-110' : ''
              }`}
            />
          </div>
          <span className="text-xs leading-none">復習</span>
          {activeTab === 'review' && (
            <span className="absolute bottom-1 w-8 h-0.5 bg-blue-600 rounded-full" />
          )}
        </button>
      </div>
    </nav>
  );
};
