import React, { useState, useEffect } from 'react';
import { WifiOff, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const OfflineIndicator: React.FC = () => {
  const { t } = useApp();
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      const timer = setTimeout(() => {
        setShowReconnected(false);
      }, 4000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && !showReconnected) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-md z-50 pointer-events-none transition-all duration-300"
    >
      {!isOnline ? (
        <div className="pointer-events-auto bg-stone-900/95 text-white dark:bg-stone-800/95 backdrop-blur-md px-4 py-3 rounded-xl shadow-xl border border-amber-600/30 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <WifiOff className="w-4 h-4" />
          </div>
          <p className="text-xs text-stone-200 leading-snug">
            {t('pwa.offline.notice')}
          </p>
        </div>
      ) : showReconnected ? (
        <div className="pointer-events-auto bg-emerald-900/95 text-white backdrop-blur-md px-4 py-3 rounded-xl shadow-xl border border-emerald-500/30 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <p className="text-xs text-emerald-100 font-medium">
            Connexion rétablie. Les dernières disponibilités sont synchronisées.
          </p>
        </div>
      ) : null}
    </div>
  );
};
