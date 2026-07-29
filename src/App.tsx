import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Genre, MainTab, UserProfile, UserWordState, WordStatus } from './types';
import {
  subscribeToAuthChanges,
  subscribeToUserWordState,
  updateFirestoreWordStatus,
} from './lib/authService';
import { Header } from './components/Header';
import { BottomNavigation } from './components/BottomNavigation';
import { LearnTab } from './components/LearnTab';
import { ReviewTab } from './components/ReviewTab';
import { GenreWordListScreen } from './components/GenreWordListScreen';
import { AuthModal } from './components/AuthModal';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const [activeTab, setActiveTab] = useState<MainTab>('learn');
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const learnScrollPositionRef = useRef(0);
  const shouldRestoreLearnScrollRef = useRef(false);

  // User word statuses state
  const [userWordState, setUserWordState] = useState<UserWordState>({});

  // Restore the genre list to where the user was before opening a genre.
  useLayoutEffect(() => {
    if (
      activeTab === 'learn' &&
      selectedGenre === null &&
      shouldRestoreLearnScrollRef.current
    ) {
      shouldRestoreLearnScrollRef.current = false;
      window.scrollTo({
        top: learnScrollPositionRef.current,
        left: 0,
        behavior: 'auto',
      });
    }
  }, [selectedGenre, activeTab]);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((profile) => {
      setCurrentUser(profile);
    });
    return () => unsubscribe();
  }, []);

  // Listen to Firestore real-time word state changes for the current user
  useEffect(() => {
    if (!currentUser) {
      setUserWordState({});
      return;
    }

    const unsubscribe = subscribeToUserWordState(currentUser.id, (newState) => {
      setUserWordState(newState);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Handle word status updates (subtle, weak, normal)
  const handleUpdateWordStatus = async (wordId: string, newStatus: WordStatus) => {
    if (!currentUser) {
      setIsAuthOpen(true);
      return;
    }

    // Optimistic UI update
    setUserWordState((prev) => {
      const next = { ...prev };
      if (newStatus === 'normal') {
        delete next[wordId];
      } else {
        next[wordId] = newStatus;
      }
      return next;
    });

    // Update in Firestore
    try {
      await updateFirestoreWordStatus(currentUser.id, wordId, newStatus);
    } catch (e) {
      console.warn('Could not sync status to Firestore:', e);
    }
  };

  // Calculate global subtle & weak totals for badges
  const subtleCount = Object.values(userWordState).filter((s) => s === 'subtle').length;
  const weakCount = Object.values(userWordState).filter((s) => s === 'weak').length;

  const handleSelectTab = (tab: MainTab) => {
    shouldRestoreLearnScrollRef.current = false;
    setActiveTab(tab);
    // Reset selected genre screen when changing tabs
    setSelectedGenre(null);
    window.scrollTo(0, 0);
  };

  const handleSelectGenre = (genre: Genre) => {
    learnScrollPositionRef.current = window.scrollY;
    shouldRestoreLearnScrollRef.current = false;
    setSelectedGenre(genre);
  };

  const handleBackToGenreList = () => {
    shouldRestoreLearnScrollRef.current = true;
    setSelectedGenre(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Top Application Header */}
      <Header
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        subtleCount={subtleCount}
        weakCount={weakCount}
      />

      {/* Main View Area */}
      <main className="max-w-xl mx-auto">
        {selectedGenre ? (
          /* Genre Word List Screen */
          <GenreWordListScreen
            genre={selectedGenre}
            onBack={handleBackToGenreList}
            userWordState={userWordState}
            onUpdateWordStatus={handleUpdateWordStatus}
          />
        ) : activeTab === 'learn' ? (
          /* Tab 1: 学ぶ (Learn - 40 Genres) */
          <LearnTab
            onSelectGenre={handleSelectGenre}
            userWordState={userWordState}
            onUpdateWordStatus={handleUpdateWordStatus}
          />
        ) : (
          /* Tab 2: 復習 (Review) */
          <ReviewTab
            userWordState={userWordState}
            onUpdateWordStatus={handleUpdateWordStatus}
            onNavigateToLearnTab={() => handleSelectTab('learn')}
          />
        )}
      </main>

      {/* Bottom Navigation Bar (Exactly 2 Tabs: 学ぶ & 復習) */}
      <BottomNavigation
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        subtleCount={subtleCount}
        weakCount={weakCount}
      />

      {/* Authentication / User Switcher Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        subtleCount={subtleCount}
        weakCount={weakCount}
        onSetLocalUser={(user) => setCurrentUser(user)}
      />
    </div>
  );
}
