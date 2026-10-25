import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Lock, Shield, Eye, EyeOff, KeyRound, AlertCircle, X, Sparkles } from 'lucide-react';

export const AdminLoginModal: React.FC = () => {
  const {
    adminLoginModalOpen,
    setAdminLoginModalOpen,
    loginAdmin,
    t,
  } = useApp();

  const [email, setEmail] = useState('Mahajanga@tourist.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);

  if (!adminLoginModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    const success = loginAdmin(password, email);
    if (!success) {
      setError(true);
    }
  };

  const handleFillDemo = () => {
    setEmail('Mahajanga@tourist.com');
    setPassword('admin123');
    setError(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 rounded-2xl max-w-md w-full p-5 sm:p-7 shadow-2xl border border-stone-200 dark:border-stone-800 relative animate-in fade-in zoom-in-95 duration-150 max-h-[92dvh] overflow-y-auto">
        <button
          onClick={() => setAdminLoginModalOpen(false)}
          className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
          title={t('admin.login.cancel')}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/20 dark:border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" />
                Ravinala Tours Mahajanga
              </span>
            </div>
            <h3 className="text-lg font-extrabold text-stone-900 dark:text-white tracking-tight">
              {t('admin.login.title')}
            </h3>
          </div>
        </div>

        <p className="text-xs text-stone-600 dark:text-stone-300 mb-5 leading-relaxed">
          {t('admin.login.subtitle')}
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-xl text-xs text-red-700 dark:text-red-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">{t('admin.login.error')}</p>
              <p className="text-[11px] text-red-600 dark:text-red-400 mt-0.5">
                Mot de passe par défaut : <code className="bg-red-100 dark:bg-red-900/50 px-1 py-0.5 rounded font-mono font-bold text-red-800 dark:text-red-200">admin123</code>
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
              {t('admin.login.email')}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Mahajanga@tourist.com"
              className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-stone-300 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-600 transition-colors bg-white dark:bg-stone-800 text-stone-900 dark:text-white font-medium"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
                {t('admin.login.password')}
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 flex items-center gap-1 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showPassword ? 'Masquer' : 'Afficher'}</span>
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(false);
                }}
                placeholder="Entrez votre mot de passe (ex: admin123)"
                className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-stone-300 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-600 transition-colors bg-white dark:bg-stone-800 text-stone-900 dark:text-white font-medium"
              />
            </div>
          </div>

          {/* Quick-fill helper banner */}
          <div className="bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/40 rounded-xl p-3 flex items-center justify-between gap-2">
            <div className="text-[11px] text-amber-900 dark:text-amber-200">
              <span className="font-bold flex items-center gap-1">
                <KeyRound className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                {t('admin.login.demoHelper')}
              </span>
              <span className="font-mono text-stone-700 dark:text-stone-300">admin123</span>
            </div>
            <button
              type="button"
              onClick={handleFillDemo}
              className="px-2.5 py-1 text-[11px] font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-lg shadow-xs transition-colors cursor-pointer shrink-0 flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              {t('admin.login.autoFill')}
            </button>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setAdminLoginModalOpen(false)}
              className="px-4 py-2.5 text-xs font-semibold text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              {t('admin.login.cancel')}
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold bg-stone-900 dark:bg-amber-500 hover:bg-stone-800 dark:hover:bg-amber-400 text-white dark:text-stone-950 rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-2"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400 dark:text-stone-950" />
              <span>{t('admin.login.submit')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
