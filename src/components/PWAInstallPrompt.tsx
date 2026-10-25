import React, { useState } from 'react';
import { Download, X, Smartphone, Check, HelpCircle } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useApp } from '../context/AppContext';

export const PWAInstallPrompt: React.FC = () => {
  const { t } = useApp();
  const { canInstall, isInstalled, isDismissed, hasPrompt, promptInstall, dismiss } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  // If already installed or dismissed, do not display floating banner
  if (isInstalled || isDismissed || !canInstall) {
    return null;
  }

  const handleInstallClick = async () => {
    if (hasPrompt) {
      const outcome = await promptInstall();
      if (outcome === 'accepted') {
        setInstallSuccess(true);
        setTimeout(() => setInstallSuccess(false), 4000);
      }
    } else {
      // Show Android step-by-step guide
      setShowGuideModal(true);
    }
  };

  return (
    <>
      {/* Floating Bottom Card for Android / Mobile users */}
      <div className="fixed bottom-3 inset-x-3 sm:bottom-6 sm:right-6 sm:left-auto sm:max-w-md z-45 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border border-amber-500/30 dark:border-amber-500/20 rounded-2xl p-4 shadow-2xl shadow-amber-950/20 text-stone-900 dark:text-stone-100">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white shrink-0 shadow-md">
              <Smartphone className="w-6 h-6" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-stone-900 dark:text-white truncate">
                  {t('pwa.install.bannerTitle')}
                </h3>
                <button
                  onClick={dismiss}
                  className="p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                  aria-label="Fermer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 line-clamp-2">
                {t('pwa.install.bannerDesc')}
              </p>

              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={handleInstallClick}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-semibold text-xs rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{t('pwa.install.installBtn')}</span>
                </button>

                <button
                  onClick={dismiss}
                  className="px-3 py-2 text-xs font-medium text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-colors cursor-pointer"
                >
                  {t('pwa.install.dismissBtn')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Manual Android Instructions Modal (when native beforeinstallprompt is not directly triggered) */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-stone-900 rounded-2xl max-w-sm w-full p-5 border border-amber-500/30 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-stone-900 dark:text-white">
                  Installation Android Chrome
                </h4>
              </div>
              <button
                onClick={() => setShowGuideModal(false)}
                className="p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <ol className="space-y-3 text-xs text-stone-700 dark:text-stone-300">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 font-bold flex items-center justify-center shrink-0">
                  1
                </span>
                <span>
                  Appuyez sur le menu à trois points <strong>(⋮)</strong> en haut à droite de Google Chrome.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 font-bold flex items-center justify-center shrink-0">
                  2
                </span>
                <span>
                  Sélectionnez <strong>« Ajouter à l'écran d'accueil »</strong> ou <strong>« Installer l'application »</strong>.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 font-bold flex items-center justify-center shrink-0">
                  3
                </span>
                <span>
                  Confirmez pour retrouver l'icône Ravinala Tours directement sur votre smartphone.
                </span>
              </li>
            </ol>

            <button
              onClick={() => setShowGuideModal(false)}
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors cursor-pointer"
            >
              Compris
            </button>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {installSuccess && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 text-xs font-medium">
          <Check className="w-4 h-4" />
          <span>{t('pwa.install.installed')}</span>
        </div>
      )}
    </>
  );
};

export const PWAInstallNavButton: React.FC = () => {
  const { t } = useApp();
  const { canInstall, isInstalled, hasPrompt, promptInstall } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);

  if (isInstalled || !canInstall) {
    return null;
  }

  const handleClick = async () => {
    if (hasPrompt) {
      await promptInstall();
    } else {
      setShowGuide(true);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        title="Installer l'application Android"
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-300 border border-amber-500/30 transition-all cursor-pointer"
      >
        <Smartphone className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
        <span className="hidden sm:inline">{t('pwa.install.headerBtn')}</span>
      </button>

      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-stone-900 rounded-2xl max-w-sm w-full p-5 border border-amber-500/30 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
              <h4 className="font-bold text-sm text-stone-900 dark:text-white">
                Installer sur Android
              </h4>
              <button
                onClick={() => setShowGuide(false)}
                className="p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-300">
              Dans Google Chrome sur Android : appuyez sur le bouton <strong>(⋮)</strong> en haut à droite, puis sélectionnez <strong>« Installer l'application »</strong> ou <strong>« Ajouter à l'écran d'accueil »</strong>.
            </p>
            <button
              onClick={() => setShowGuide(false)}
              className="w-full py-2 bg-amber-600 text-white rounded-xl text-xs font-semibold"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </>
  );
};
