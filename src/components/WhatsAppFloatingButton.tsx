import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MessageCircle, X } from 'lucide-react';

export const WhatsAppFloatingButton: React.FC = () => {
  const { t } = useApp();
  const [showTooltip, setShowTooltip] = useState(false);

  const phone = '261345861363';
  const defaultText = encodeURIComponent(t('whatsapp.msg.default'));
  const waUrl = `https://wa.me/${phone}?text=${defaultText}`;

  return (
    <div className="fixed bottom-5 right-5 z-30 flex flex-col items-end">
      {showTooltip && (
        <div className="mb-2 bg-stone-900 text-white text-xs py-2 px-3 rounded-lg shadow-xl border border-stone-800 flex items-center gap-2 max-w-[260px] animate-fadeIn">
          <span>{t('whatsapp.tooltip')}</span>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-stone-400 hover:text-white cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        className="w-13 h-13 sm:w-14 sm:h-14 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-lg shadow-emerald-950/20 flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer border-2 border-white"
        aria-label={t('whatsapp.title')}
        title={t('whatsapp.title')}
      >
        <MessageCircle className="w-7 h-7" />
      </a>
    </div>
  );
};
