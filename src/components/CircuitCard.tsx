import React, { useState } from 'react';
import { Circuit } from '../types';
import { useApp } from '../context/AppContext';
import { Calendar, MapPin, Users, ArrowRight, Sparkles, Heart, FileDown, Loader2 } from 'lucide-react';
import { generateSingleCircuitPdf } from '../utils/circuitPdfGenerator';

interface CircuitCardProps {
  circuit: Circuit;
  onSelect: (circuit: Circuit) => void;
}

export const CircuitCard: React.FC<CircuitCardProps> = ({ circuit, onSelect }) => {
  const { language, t, openQuoteModal, toggleFavorite, isFavorite } = useApp();
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const title = circuit.title[language] || circuit.title['fr'];
  const summary = circuit.summary[language] || circuit.summary['fr'];
  const priceNote = circuit.priceNote[language] || circuit.priceNote['fr'];

  const difficultyLabels: Record<string, string> = {
    facile: language === 'en' ? 'Easy' : language === 'mg' ? 'Mora' : 'Facile',
    modérée: language === 'en' ? 'Moderate' : language === 'mg' ? 'Antonony' : 'Modérée',
    soutenue: language === 'en' ? 'Challenging' : language === 'mg' ? 'Mavesatra' : 'Soutenue',
  };

  const modeLabels: Record<string, string> = {
    prive: language === 'en' ? 'Private 4WD' : language === 'mg' ? 'Dia manokana' : 'Circuit Privé',
    groupe: language === 'en' ? 'Small Group' : language === 'mg' ? 'Vondrona kely' : 'Petit Groupe',
    depart_garanti: language === 'en' ? 'Guaranteed Departure' : language === 'mg' ? 'Fiaingana azo antoka' : 'Départ Garanti',
  };

  const regionLabels: Record<string, string> = {
    'Hautes Terres': t('region.hautesTerres'),
    Sud: t('region.sud'),
    Ouest: t('region.ouest'),
    Nord: t('region.nord'),
    Est: t('region.est'),
    'Îles': t('region.iles'),
  };

  const favorited = isFavorite(circuit.id);

  const handlePdfDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setIsGeneratingPdf(true);
      generateSingleCircuitPdf(circuit, language);
    } catch (err) {
      console.error('Error generating circuit PDF:', err);
    } finally {
      setTimeout(() => setIsGeneratingPdf(false), 800);
    }
  };

  return (
    <div className="group bg-white dark:bg-stone-900 rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 hover:border-amber-500/50 dark:hover:border-amber-500/50 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      {/* Media Container */}
      <div
        onClick={() => onSelect(circuit)}
        className="relative h-56 overflow-hidden bg-stone-900 cursor-pointer"
      >
        <img
          src={circuit.mainImage}
          alt={title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />

        {/* Featured Flag (Discrete tag) */}
        {circuit.isFeatured && (
          <div className="absolute top-3 left-3 bg-amber-500 text-stone-950 font-bold text-[11px] px-2.5 py-1 rounded shadow flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>{t('card.featured')}</span>
          </div>
        )}

        {/* Quick PDF Download on Image */}
        <button
          type="button"
          onClick={handlePdfDownload}
          disabled={isGeneratingPdf}
          className="absolute top-3 right-12 p-2 rounded-full backdrop-blur-md shadow-md transition-all cursor-pointer bg-stone-900/60 hover:bg-stone-900 text-amber-400 hover:scale-105"
          title="Télécharger la fiche circuit en PDF"
          aria-label="Télécharger la fiche circuit en PDF"
        >
          {isGeneratingPdf ? (
            <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
          ) : (
            <FileDown className="w-4 h-4" />
          )}
        </button>

        {/* Favorite Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(circuit.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md shadow-md transition-all cursor-pointer ${
            favorited
              ? 'bg-rose-500 text-white hover:bg-rose-600 scale-105'
              : 'bg-stone-900/60 text-white hover:bg-stone-900 hover:scale-105'
          }`}
          title={favorited ? t('favorites.remove') : t('favorites.add')}
          aria-label={favorited ? t('favorites.remove') : t('favorites.add')}
        >
          <Heart
            className={`w-4 h-4 transition-transform ${
              favorited ? 'fill-current scale-110' : ''
            }`}
          />
        </button>

        {/* Duration Overlay Bottom Right */}
        <div className="absolute bottom-3 right-3 bg-stone-950/80 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded">
          {circuit.durationDays} {t('card.days')} {circuit.durationNights > 0 && `· ${circuit.durationNights} ${t('card.nights')}`}
        </div>
      </div>

      {/* Content Container */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata String */}
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 dark:text-amber-400 mb-2 uppercase tracking-wider">
            <span>
              {regionLabels[circuit.region] || circuit.region}
            </span>
            <span aria-hidden="true" className="text-stone-300 dark:text-stone-600">·</span>
            <span>{modeLabels[circuit.mode] || circuit.mode}</span>
            <span aria-hidden="true" className="text-stone-300 dark:text-stone-600">·</span>
            <span>{difficultyLabels[circuit.difficulty] || circuit.difficulty}</span>
          </div>

          {/* Title */}
          <h3
            onClick={() => onSelect(circuit)}
            className="text-lg font-bold text-stone-900 dark:text-stone-100 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors cursor-pointer leading-snug line-clamp-2"
          >
            {title}
          </h3>

          {/* Summary */}
          <p className="mt-2 text-sm text-stone-600 dark:text-stone-300 line-clamp-2 leading-relaxed">
            {summary}
          </p>
        </div>

        {/* Pricing & CTA */}
        <div className="mt-5 pt-4 border-t border-stone-100 dark:border-stone-800 flex flex-col gap-2.5">
          <div className="flex items-baseline justify-between gap-2">
            <div>
              <span className="block text-[11px] uppercase tracking-wider text-stone-500 dark:text-stone-400 font-semibold">
                {t('card.from')}
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-extrabold text-stone-900 dark:text-white tabular-nums">
                  {circuit.basePriceEUR > 0 ? `${circuit.basePriceEUR.toLocaleString()} €` : t('card.onQuote')}
                </span>
                {circuit.basePriceEUR > 0 && (
                  <span className="text-xs text-stone-500 dark:text-stone-400 font-normal">
                    {t('card.perPerson')}
                  </span>
                )}
              </div>
            </div>
            <span className="text-[11px] text-stone-500 dark:text-stone-400 text-right truncate max-w-[150px]" title={priceNote}>
              {priceNote}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 w-full pt-0.5">
            <button
              onClick={() => onSelect(circuit)}
              className="w-full px-2 py-2 text-xs font-semibold text-center text-stone-800 dark:text-stone-200 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-lg transition-colors cursor-pointer truncate"
              title={t('card.viewDetails')}
            >
              {t('card.viewDetails')}
            </button>
            <button
              onClick={handlePdfDownload}
              disabled={isGeneratingPdf}
              className="w-full px-2 py-2 text-xs font-semibold text-center text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 truncate border border-stone-200 dark:border-stone-700"
              title="Télécharger la fiche de ce voyage (PDF)"
            >
              {isGeneratingPdf ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-500" />
              ) : (
                <FileDown className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
              )}
              <span className="truncate">{isGeneratingPdf ? 'PDF...' : (t('card.downloadPdf') || 'Fiche PDF')}</span>
            </button>
          </div>

          <button
            onClick={() => openQuoteModal({ id: circuit.id, title })}
            className="w-full px-3 py-2.5 text-xs font-bold text-center text-stone-950 bg-amber-500 hover:bg-amber-400 rounded-lg shadow-xs transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            title={t('card.quoteBtn')}
          >
            {t('card.quoteBtn')}
          </button>
        </div>
      </div>
    </div>
  );
};
