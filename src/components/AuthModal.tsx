import React, { useState } from 'react';
import { UserProfile } from '../types';
import {
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
  signInAsGuest,
  signOutUser,
} from '../lib/authService';
import {
  X,
  LogIn,
  UserPlus,
  LogOut,
  Mail,
  Lock,
  User as UserIcon,
  Sparkles,
  AlertCircle,
  Loader2,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  subtleCount: number;
  weakCount: number;
  onSetLocalUser?: (user: UserProfile | null) => void;
}

type AuthMode = 'login' | 'register';

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  subtleCount,
  weakCount,
  onSetLocalUser,
}) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleReset = () => {
    setErrorMsg(null);
    setEmail('');
    setPassword('');
    setName('');
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      let profile: UserProfile;
      if (mode === 'register') {
        if (!name.trim()) {
          setErrorMsg('お名前を入力してください。');
          setLoading(false);
          return;
        }
        profile = await signUpWithEmail(email, password, name);
      } else {
        profile = await signInWithEmail(email, password);
      }
      if (profile && onSetLocalUser) {
        onSetLocalUser(profile);
      }
      handleReset();
      onClose();
    } catch (err: any) {
      console.error('Auth error:', err);
      let msg = '認証に失敗しました。もう一度お試しください。';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        msg = 'メールアドレスまたはパスワードが正しくありません。';
      } else if (err.code === 'auth/email-already-in-use') {
        msg = 'このメールアドレスは既に登録されています。';
      } else if (err.code === 'auth/weak-password') {
        msg = 'パスワードは6文字以上で入力してください。';
      } else if (err.code === 'auth/invalid-email') {
        msg = '有効なメールアドレスを入力してください。';
      }
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setErrorMsg(null);
    setLoading(true);
    try {
      const profile = await signInWithGoogle();
      if (profile && onSetLocalUser) {
        onSetLocalUser(profile);
      }
      handleReset();
      onClose();
    } catch (err: any) {
      console.warn('Google auth error:', err);
      if (err.code === 'auth/unauthorized-domain') {
        setErrorMsg('ドメイン制限によりGoogleログインがブロックされました。メールアドレスまたは「ゲストログイン」をご利用いただくか、Firebase管理画面の承認済みドメイン設定をご確認ください。');
      } else if (err.code !== 'auth/popup-closed-by-user') {
        setErrorMsg('Googleログインに失敗しました。メールアドレスまたはゲストログインをお試しください。');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGuestAuth = async () => {
    setErrorMsg(null);
    setLoading(true);
    try {
      const profile = await signInAsGuest();
      if (profile && onSetLocalUser) {
        onSetLocalUser(profile);
      }
      handleReset();
      onClose();
    } catch (err: any) {
      console.warn('Guest auth warning:', err);
      const guestProfile: UserProfile = {
        id: 'guest-user-session',
        name: 'ゲストユーザー',
        avatar: '🚀',
        createdAt: new Date().toISOString(),
      };
      if (onSetLocalUser) {
        onSetLocalUser(guestProfile);
      }
      handleReset();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (window.confirm('ログアウトしますか？')) {
      try {
        await signOutUser();
      } catch (e) {
        console.warn('Sign out warning:', e);
      }
      if (onSetLocalUser) {
        onSetLocalUser(null);
      }
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 overflow-hidden relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-2xl shadow-inner">
            🔐
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-heading">
              {currentUser ? 'アカウント情報' : 'ログイン・会員登録'}
            </h2>
            <p className="text-xs text-slate-500">
              単語の学習進捗データ（「微妙」「苦手」）を安全にクラウド保存します
            </p>
          </div>
        </div>

        {/* If user is logged in */}
        {currentUser ? (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-4 rounded-2xl shadow-md">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold bg-white/20 text-white px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-300 fill-amber-300" />
                  ログイン中
                </span>
                <span className="text-xs text-blue-100 font-mono truncate max-w-[150px]">
                  {currentUser.email || 'ゲスト'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-3xl bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center shadow-inner">
                  {currentUser.avatar}
                </span>
                <div>
                  <h3 className="font-bold text-lg leading-tight">{currentUser.name}</h3>
                  <p className="text-xs text-blue-100 mt-1">
                    微妙: <span className="font-bold text-white">{subtleCount}</span> 語 | 苦手: <span className="font-bold text-white">{weakCount}</span> 語
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleLogout}
                className="w-full py-3 rounded-2xl border border-rose-200 text-rose-600 bg-rose-50/50 hover:bg-rose-100/70 text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <LogOut className="w-4 h-4" />
                ログアウトする
              </button>
            </div>
          </div>
        ) : (
          /* Auth Form */
          <div>
            {/* Mode Tabs */}
            <div className="grid grid-cols-2 bg-slate-100 p-1 rounded-2xl mb-4">
              <button
                onClick={() => {
                  setMode('login');
                  setErrorMsg(null);
                }}
                className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  mode === 'login'
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                ログイン
              </button>
              <button
                onClick={() => {
                  setMode('register');
                  setErrorMsg(null);
                }}
                className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  mode === 'register'
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                新規会員登録
              </button>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="mb-4 bg-rose-50 border border-rose-200/80 rounded-xl p-3 text-xs text-rose-700 flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Email Form */}
            <form onSubmit={handleEmailAuth} className="space-y-3">
              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    お名前 <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="例: 太郎"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-sm"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  メールアドレス <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  パスワード（6文字以上） <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : mode === 'login' ? (
                  <>
                    <LogIn className="w-4 h-4" />
                    メールアドレスでログイン
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    アカウントを作成
                  </>
                )}
              </button>
            </form>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-400 font-medium">または</span>
              </div>
            </div>

            {/* Quick Auth Buttons */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={loading}
                className="w-full py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 shadow-2xs disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                Googleでログイン
              </button>

              <button
                type="button"
                onClick={handleGuestAuth}
                disabled={loading}
                className="w-full py-2.5 rounded-xl border border-dashed border-slate-300 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <span>🚀 登録せずに今すぐ体験（ゲストログイン）</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
