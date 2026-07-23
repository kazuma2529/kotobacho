import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInAnonymously,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  collection,
  onSnapshot,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, googleProvider, db } from './firebase';
import { UserProfile, UserWordState, WordStatus } from '../types';

const AVATARS = ['👨‍🎓', '👩‍🎓', '👨‍🏫', '👩‍🏫', '🧑‍💻', '👨‍🚀', '👩‍🎨', '🦊', '🐱', '🐼'];

function getRandomAvatar(): string {
  return AVATARS[Math.floor(Math.random() * AVATARS.length)];
}

// Map Firebase User to app UserProfile
export async function getOrCreateUserProfile(fbUser: FirebaseUser): Promise<UserProfile> {
  const userRef = doc(db, 'users', fbUser.uid);
  const snap = await getDoc(userRef);

  if (snap.exists()) {
    const data = snap.data();
    return {
      id: fbUser.uid,
      name: data.displayName || fbUser.displayName || '学習者',
      email: data.email || fbUser.email || undefined,
      avatar: data.avatar || '👨‍🎓',
      createdAt: data.createdAt || new Date().toISOString(),
    };
  } else {
    const avatar = getRandomAvatar();
    const name = fbUser.displayName || (fbUser.isAnonymous ? 'ゲストユーザー' : '学習者');
    const profile: UserProfile = {
      id: fbUser.uid,
      name,
      email: fbUser.email || undefined,
      avatar,
      createdAt: new Date().toISOString(),
    };

    try {
      await setDoc(userRef, {
        displayName: profile.name,
        email: profile.email || '',
        avatar: profile.avatar,
        createdAt: profile.createdAt,
        updatedAt: serverTimestamp(),
      });
    } catch (e) {
      console.warn('Could not save user profile to Firestore:', e);
    }

    return profile;
  }
}

// Auth State Listener
export function subscribeToAuthChanges(
  onUserChanged: (userProfile: UserProfile | null, fbUser: FirebaseUser | null) => void
) {
  return onAuthStateChanged(auth, async (fbUser) => {
    if (fbUser) {
      try {
        const profile = await getOrCreateUserProfile(fbUser);
        onUserChanged(profile, fbUser);
      } catch (err) {
        console.error('Error fetching user profile:', err);
        onUserChanged(null, null);
      }
    } else {
      onUserChanged(null, null);
    }
  });
}

// Firestore Word State Listener
export function subscribeToUserWordState(
  userId: string,
  onStateUpdated: (wordState: UserWordState) => void
) {
  const wordStatesRef = collection(db, 'users', userId, 'wordStates');
  return onSnapshot(
    wordStatesRef,
    (snapshot) => {
      const state: UserWordState = {};
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.status) {
          state[docSnap.id] = data.status as WordStatus;
        }
      });
      onStateUpdated(state);
    },
    (error) => {
      console.warn('Error listening to word states:', error);
    }
  );
}

// Update word status in Firestore
export async function updateFirestoreWordStatus(
  userId: string,
  wordId: string,
  status: WordStatus
) {
  const wordDocRef = doc(db, 'users', userId, 'wordStates', wordId);
  if (status === 'normal') {
    await deleteDoc(wordDocRef);
  } else {
    await setDoc(
      wordDocRef,
      {
        status,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  }
}

// Sign up with Email & Password
export async function signUpWithEmail(email: string, pass: string, name: string) {
  const cred = await createUserWithEmailAndPassword(auth, email, pass);
  if (name.trim()) {
    await updateProfile(cred.user, { displayName: name.trim() });
  }
  const profile = await getOrCreateUserProfile(cred.user);
  return profile;
}

// Sign in with Email & Password
export async function signInWithEmail(email: string, pass: string) {
  const cred = await signInWithEmailAndPassword(auth, email, pass);
  const profile = await getOrCreateUserProfile(cred.user);
  return profile;
}

// Sign in with Google
export async function signInWithGoogle() {
  const cred = await signInWithPopup(auth, googleProvider);
  const profile = await getOrCreateUserProfile(cred.user);
  return profile;
}

// Sign in as Guest (Anonymous auth, or local-only profile if unavailable)
export async function signInAsGuest() {
  try {
    const cred = await signInAnonymously(auth);
    return await getOrCreateUserProfile(cred.user);
  } catch (err) {
    console.warn('Anonymous auth unavailable, using local guest profile:', err);
    return {
      id: 'local-guest-user',
      name: 'ゲストユーザー',
      avatar: '🚀',
      createdAt: new Date().toISOString(),
    };
  }
}

// Sign Out
export async function signOutUser() {
  await firebaseSignOut(auth);
}
