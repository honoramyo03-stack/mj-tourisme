import React, { useState } from 'react';
import { Circuit } from '../types';
import { useApp } from '../context/AppContext';
import {
  X,
  Calendar,
  MapPin,
  Compass,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  MessageCircle,
  ChevronRight,
  ShieldAlert,
  Heart,
  FileDown,
  Loader2,
  Layers,
  Share2,
  Check,
  Bed,
  Utensils,
  Milestone,
  Route,
  Car,
  Eye,
  ListOrdered,
} from 'lucide-react';
import { generateSingleCircuitPdf } from '../utils/circuitPdfGenerator';
import { WeatherBadge } from './WeatherBadge';

interface CircuitDetailModalProps {
  circuit: Circuit;
  onClose: () => void;
}

export const CircuitDetailModal: React.FC<CircuitDetailModalProps> = ({ circuit, onClose }) => {
  const {
    language,
    t,
    openQuoteModal,
    departures,
    toggleFavorite,
    isFavorite,
    formatPrice,
    comparisonCircuits,
    addToComparison,
    removeFromComparison,
    setIsComparisonModalOpen,
  } = useApp();
  const [activeDay, setActiveDay] = useState<number>(1);
  const [activePhoto, setActivePhoto] = useState<string>(circuit.mainImage);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState<boolean>(false);
  const [itineraryMode, setItineraryMode] = useState<'timeline' | 'tabs'>('timeline');
  const [copiedShare, setCopiedShare] = useState<boolean>(false);

  const isCompared = comparisonCircuits.some((c) => c.id === circuit.id);

  const handleDownloadPdf = () => {
    try {
      setIsDownloadingPdf(true);
      generateSingleCircuitPdf(circuit, language);
    } catch (err) {
      console.error('Failed to generate circuit PDF:', err);
    } finally {
      setTimeout(() => setIsDownloadingPdf(false), 800);
    }
  };

  const title = circuit.title[language] || circuit.title['fr'];
  const summary = circuit.summary[language] || circuit.summary['fr'];
  const priceNote = circuit.priceNote[language] || circuit.priceNote['fr'];
  const inclusions = circuit.inclusions[language] || circuit.inclusions['fr'] || [];
  const exclusions = circuit.exclusions[language] || circuit.exclusions['fr'] || [];
  const practicalTips = circuit.practicalTips[language] || circuit.practicalTips['fr'] || [];

  const tourDepartures = departures.filter((d) => d.circuitId === circuit.id);

  const regionLabel =
    circuit.region === 'Hautes Terres'
      ? t('region.hautesTerres')
      : circuit.region === 'Sud'
      ? t('region.sud')
      : circuit.region === 'Ouest'
      ? t('region.ouest')
      : circuit.region === 'Nord'
      ? t('region.nord')
      : circuit.region === 'Est'
      ? t('region.est')
      : circuit.region === 'Îles'
      ? t('region.iles')
      : circuit.region;

  const difficultyLabels: Record<string, string> = {
    facile: t('filter.diff.easy') || (language === 'en' ? 'Easy' : language === 'mg' ? 'Mora' : 'Facile'),
    modérée: t('filter.diff.moderate') || (language === 'en' ? 'Moderate' : language === 'mg' ? 'Antonony' : 'Modérée'),
    soutenue: t('filter.diff.challenging') || (language === 'en' ? 'Challenging' : language === 'mg' ? 'Mavesatra' : 'Soutenue'),
  };

  const modeLabels: Record<string, string> = {
    prive: t('filter.mode.private') || (language === 'en' ? 'Private 4WD' : language === 'mg' ? 'Dia manokana' : 'Circuit Privé'),
    groupe: language === 'en' ? 'Small Group' : language === 'mg' ? 'Vondrona kely' : 'Petit Groupe',
    depart_garanti: t('filter.mode.guaranteed') || (language === 'en' ? 'Guaranteed Departure' : language === 'mg' ? 'Fiaingana azo antoka' : 'Départ Garanti'),
  };

  const guideLanguagesDisplay = circuit.guideLanguages
    .map((gl) => {
      if (gl === 'Français') return language === 'en' ? 'French' : language === 'mg' ? 'Frantsay' : 'Français';
      if (gl === 'Anglais') return language === 'en' ? 'English' : language === 'mg' ? 'Anglisy' : 'Anglais';
      if (gl === 'Malgache') return language === 'en' ? 'Malagasy' : language === 'mg' ? 'Malagasy' : 'Malgache';
      if (gl === 'Italien') return language === 'en' ? 'Italian' : language === 'mg' ? 'Italianina' : 'Italien';
      if (gl === 'Allemand') return language === 'en' ? 'German' : language === 'mg' ? 'Alemana' : 'Allemand';
      return gl;
    })
    .join(', ');

  const translateMeal = (mealText: string) => {
    if (!mealText || language === 'fr') return mealText;
    const lower = mealText.toLowerCase();
    if (language === 'en') {
      if (lower.includes('petit-déjeuner') && lower.includes('dîner gastronomique')) return 'Breakfast & gourmet dinner';
      if (lower.includes('petit-déjeuner') && lower.includes('dîner')) return 'Breakfast & dinner included';
      if (lower.includes('petit-déjeuner') && lower.includes('déjeuner langouste')) return 'Breakfast & lobster seafood lunch';
      if (lower.includes('petit-déjeuner') && lower.includes('déjeuner buffet créole')) return 'Breakfast & Creole buffet lunch';
      if (lower.includes('petit-déjeuner') && lower.includes('déjeuner local')) return 'Breakfast & authentic local lunch';
      if (lower.includes('petit-déjeuner') && lower.includes('déjeuner')) return 'Breakfast & lunch included';
      if (lower.includes('petit-déjeuner') && lower.includes('pique-nique')) return 'Breakfast & picnic lunch';
      if (lower.includes('dîner inclus') || lower.includes('dîner')) return 'Welcome dinner included';
      if (lower.includes('petit-déjeuner')) return 'Breakfast included';
      if (lower.includes('pension complète')) return 'Full board';
      return mealText;
    }
    if (language === 'mg') {
      if (lower.includes('petit-déjeuner') && lower.includes('dîner gastronomique')) return 'Sakafo maraina sy sakafo hariva tsara indrindra';
      if (lower.includes('petit-déjeuner') && lower.includes('dîner')) return 'Sakafo maraina sy hariva tafiditra';
      if (lower.includes('petit-déjeuner') && lower.includes('déjeuner langouste')) return 'Sakafo maraina sy drakaka/orana amin\'ny antoandro';
      if (lower.includes('petit-déjeuner') && lower.includes('déjeuner')) return 'Sakafo maraina sy antoandro';
      if (lower.includes('petit-déjeuner') && lower.includes('pique-nique')) return 'Sakafo maraina sy sakafo maivana';
      if (lower.includes('dîner inclus') || lower.includes('dîner')) return 'Sakafo hariva tafiditra';
      if (lower.includes('petit-déjeuner')) return 'Sakafo maraina';
      if (lower.includes('pension complète')) return 'Sakafo feno (maraina, antoandro, hariva)';
      return mealText;
    }
    return mealText;
  };

  // WhatsApp link with prefilled tour inquiry using updated default phone
  const whatsAppPhone = '261345861363';
  const whatsAppMessage = encodeURIComponent(
    t('whatsapp.msg.circuit')
      .replace('{title}', title)
      .replace('{days}', circuit.durationDays.toString())
  );
  const whatsAppUrl = `https://wa.me/${whatsAppPhone}?text=${whatsAppMessage}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-6 animate-fadeIn">
      <div className="relative bg-white dark:bg-stone-900 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden border border-stone-200 dark:border-stone-800 flex flex-col max-h-[92dvh]">
        {/* Sticky Modal Header */}
        <div className="sticky top-0 z-20 bg-stone-900 text-white px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-between border-b border-stone-800 shrink-0">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-amber-400">
              <span>{regionLabel}</span>
              <span aria-hidden="true">·</span>
              <span>{circuit.durationDays} {t('card.days')} / {circuit.durationNights} {t('card.nights')}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight line-clamp-1">
              {title}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {/* Compare Button */}
            <button
              onClick={() => {
                if (isCompared) {
                  removeFromComparison(circuit.id);
                } else {
                  addToComparison(circuit);
                  setIsComparisonModalOpen(true);
                }
              }}
              className={`px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
                isCompared
                  ? 'bg-amber-500 text-stone-950 shadow-sm'
                  : 'bg-stone-800 text-stone-300 hover:text-white border border-stone-700 hover:border-amber-500/50'
              }`}
              title={isCompared ? 'Retirer de la comparaison' : 'Ajouter au comparateur'}
            >
              <Layers className="w-4 h-4" />
              <span className="hidden sm:inline">
                {isCompared ? 'Comparé' : 'Comparer'}
              </span>
            </button>

            {/* Quick Share */}
            <button
              onClick={() => {
                const shareUrl = window.location.origin + `?circuit=${circuit.slug}`;
                if (navigator.share) {
                  navigator.share({
                    title: title,
                    text: `Découvrez le circuit "${title}" avec Ravinala Tours Madagascar !`,
                    url: shareUrl,
                  }).catch(() => {});
                } else {
                  navigator.clipboard?.writeText(shareUrl);
                  setCopiedShare(true);
                  setTimeout(() => setCopiedShare(false), 2000);
                }
              }}
              className="p-2 sm:px-3 sm:py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white border border-stone-700 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
              title={copiedShare ? 'Lien copié dans le presse-papier !' : 'Partager'}
            >
              {copiedShare ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="hidden sm:inline text-emerald-400">Copié !</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Partager</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={isDownloadingPdf}
              className="px-2.5 py-1.5 sm:px-3 sm:py-2 bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-stone-950 border border-amber-500/40 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold disabled:opacity-50"
              title="Télécharger la fiche complète de ce voyage en PDF"
            >
              {isDownloadingPdf ? (
                <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
              ) : (
                <FileDown className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">
                {isDownloadingPdf ? 'Génération...' : 'Télécharger PDF'}
              </span>
            </button>

            <button
              onClick={() => toggleFavorite(circuit.id)}
              className={`p-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold ${
                isFavorite(circuit.id)
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : 'bg-stone-800 text-stone-300 hover:text-white border border-stone-700'
              }`}
              title={isFavorite(circuit.id) ? t('favorites.remove') : t('favorites.add')}
            >
              <Heart className={`w-4 h-4 ${isFavorite(circuit.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span className="hidden sm:inline">
                {isFavorite(circuit.id) ? t('favorites.remove') : t('favorites.add')}
              </span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 space-y-8 text-stone-800 dark:text-stone-200">
          {/* Top Gallery & Quick Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Visual Gallery */}
            <div className="lg:col-span-7 space-y-3">
              <div className="aspect-[16/10] bg-stone-100 dark:bg-stone-800 rounded-xl overflow-hidden relative border border-stone-200 dark:border-stone-800">
                <img
                  src={activePhoto}
                  alt={title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />

                {/* CRITICAL USER REQUIREMENT: Weather Widget placed right next to top of circuit image */}
                <div className="absolute top-3 left-3 z-10 max-w-[calc(100%-24px)]">
                  <WeatherBadge region={circuit.region} variant="detailed" />
                </div>
              </div>

              {/* Thumbnails */}
              {circuit.gallery.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {circuit.gallery.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActivePhoto(img)}
                      className={`relative w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                        activePhoto === img ? 'border-amber-500 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Specs & Booking Box */}
            <div className="lg:col-span-5 bg-stone-50 dark:bg-stone-800/60 p-5 rounded-xl border border-stone-200 dark:border-stone-800 flex flex-col justify-between h-full">
              <div>
                <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed italic">
                  "{summary}"
                </p>

                <div className="mt-5 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between py-1.5 border-b border-stone-200 dark:border-stone-700">
                    <span className="text-stone-500 dark:text-stone-400">{t('circuit.startEnd')}</span>
                    <span className="font-semibold text-stone-900 dark:text-white text-right">{circuit.startingPoint} → {circuit.endingPoint}</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-b border-stone-200 dark:border-stone-700">
                    <span className="text-stone-500 dark:text-stone-400">{t('circuit.difficultyLabel')}</span>
                    <span className="font-semibold text-stone-900 dark:text-white">{difficultyLabels[circuit.difficulty] || circuit.difficulty}</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-b border-stone-200 dark:border-stone-700">
                    <span className="text-stone-500 dark:text-stone-400">{t('circuit.modeLabel')}</span>
                    <span className="font-semibold text-stone-900 dark:text-white">{modeLabels[circuit.mode] || circuit.mode.replace('_', ' ')}</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-b border-stone-200 dark:border-stone-700">
                    <span className="text-stone-500 dark:text-stone-400">{t('circuit.guideLangLabel')}</span>
                    <span className="font-semibold text-stone-900 dark:text-white">{guideLanguagesDisplay}</span>
                  </div>
                </div>
              </div>

              {/* Price & Actions Box */}
              <div className="mt-6 pt-4 border-t border-stone-200 dark:border-stone-700">
                <div className="mb-3">
                  <span className="text-xs text-stone-600 dark:text-stone-400 uppercase font-semibold">{t('card.from')}</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-stone-900 dark:text-amber-400 tabular-nums">
                      {circuit.basePriceEUR > 0 ? formatPrice(circuit.basePriceEUR) : t('card.onQuote')}
                    </span>
                    {circuit.basePriceEUR > 0 && (
                      <span className="text-xs text-stone-600 dark:text-stone-400">{t('card.perPerson')}</span>
                    )}
                  </div>
                  <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-1 leading-snug">{priceNote}</p>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => {
                      onClose();
                      openQuoteModal({ id: circuit.id, title });
                    }}
                    className="w-full py-3 px-4 text-xs font-bold text-stone-950 bg-amber-500 hover:bg-amber-400 rounded-lg shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer text-center"
                  >
                    {t('card.requestQuote')}
                  </button>

                  <a
                    href={whatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>{t('circuit.contactWhatsApp')}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Guaranteed Departures if present for this circuit */}
          {tourDepartures.length > 0 && (
            <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-xl">
              <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-amber-700" />
                {t('circuit.guaranteedDepartures')}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {tourDepartures.map((dep) => (
                  <div
                    key={dep.id}
                    className="bg-white p-3 rounded-lg border border-amber-200/80 text-xs flex flex-col justify-between"
                  >
                    <div>
                      <span className="font-bold text-stone-900">
                        Du {new Date(dep.startDate).toLocaleDateString()} au {new Date(dep.endDate).toLocaleDateString()}
                      </span>
                      <div className="mt-1 flex items-center justify-between text-stone-500">
                        <span>{dep.capacityTotal - dep.seatsBooked} {t('departures.availableSeats')}</span>
                        <span className="font-bold text-amber-700">{dep.priceEUR} €</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        onClose();
                        openQuoteModal({ id: circuit.id, title: `${title} (Départ du ${dep.startDate})` });
                      }}
                      className="mt-2 text-center py-1.5 bg-stone-900 text-white rounded hover:bg-stone-800 font-semibold cursor-pointer"
                    >
                      {t('departures.join')}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Day-by-day Itinerary Section with Visual Timeline & Tabs Switcher */}
          <div className="pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
                  <Compass className="w-5 h-5 text-amber-500" />
                  <span>{t('circuit.itinerary')}</span>
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  {circuit.dayProgram.length} {t('circuit.detailedSteps')} · {circuit.startingPoint} → {circuit.endingPoint}
                </p>
              </div>

              {/* View Mode Toggle: Visual Timeline vs Classic Day Tabs */}
              <div className="inline-flex p-1 bg-stone-100 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setItineraryMode('timeline')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    itineraryMode === 'timeline'
                      ? 'bg-amber-500 text-stone-950 shadow-sm'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                  }`}
                >
                  <Route className="w-3.5 h-3.5" />
                  <span>{language === 'en' ? 'Visual Timeline' : language === 'mg' ? 'Lalam-baovao mirindra' : 'Timeline Visuelle'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setItineraryMode('tabs')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    itineraryMode === 'tabs'
                      ? 'bg-amber-500 text-stone-950 shadow-sm'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                  }`}
                >
                  <ListOrdered className="w-3.5 h-3.5" />
                  <span>{language === 'en' ? 'Day by Day' : language === 'mg' ? 'Isan\'andro' : 'Vue par jour'}</span>
                </button>
              </div>
            </div>

            {/* MODE 1: ILLUSTRATED VISUAL TIMELINE */}
            {itineraryMode === 'timeline' ? (
              <div className="relative pl-6 sm:pl-8 border-l-2 border-dashed border-amber-400 dark:border-amber-500/70 space-y-6 sm:space-y-8 ml-3 sm:ml-4 py-2">
                {circuit.dayProgram.map((dp, idx) => {
                  const dayTitle = dp.title[language] || dp.title['fr'];
                  const dayDesc = dp.description[language] || dp.description['fr'];
                  const isFirst = idx === 0;
                  const isLast = idx === circuit.dayProgram.length - 1;

                  return (
                    <div key={dp.day} className="relative group">
                      {/* Milestone Node on Connecting Line */}
                      <div
                        className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-7 h-7 sm:w-9 sm:h-9 rounded-full font-black flex items-center justify-center text-[11px] sm:text-xs shadow-md ring-4 ring-white dark:ring-stone-900 transition-transform group-hover:scale-110 ${
                          isFirst
                            ? 'bg-emerald-600 text-white'
                            : isLast
                            ? 'bg-amber-600 text-white'
                            : 'bg-stone-900 dark:bg-amber-500 text-amber-400 dark:text-stone-950'
                        }`}
                      >
                        {dp.day}
                      </div>

                      {/* Timeline Day Card */}
                      <div className="bg-stone-50/90 dark:bg-stone-850 p-4 sm:p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs hover:border-amber-400/60 dark:hover:border-amber-500/60 transition-all space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                              {t('circuit.dayPrefix')} {dp.day}
                            </span>
                            {isFirst && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                                {language === 'en' ? 'Start' : language === 'mg' ? 'Fiaingana' : 'Départ'}
                              </span>
                            )}
                            {isLast && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                                {language === 'en' ? 'Arrival & End' : language === 'mg' ? 'Fahatongavana' : 'Arrivée'}
                              </span>
                            )}
                          </div>
                          <h4 className="w-full sm:w-auto text-sm sm:text-base font-bold text-stone-900 dark:text-white">
                            {dayTitle}
                          </h4>
                        </div>

                        {/* Narrative description */}
                        <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed whitespace-pre-line">
                          {dayDesc}
                        </p>

                        {/* Lodging & Meals badges */}
                        <div className="pt-2 border-t border-stone-200/80 dark:border-stone-700/80 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          <div className="flex items-center gap-1.5 text-stone-700 dark:text-stone-300">
                            <Bed className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                            <span className="text-stone-500 dark:text-stone-400">{t('circuit.lodging')} :</span>
                            <span className="font-semibold truncate">{dp.lodging}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-stone-700 dark:text-stone-300">
                            <Utensils className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                            <span className="text-stone-500 dark:text-stone-400">{t('circuit.meals')} :</span>
                            <span className="font-semibold truncate">{translateMeal(dp.meals)}</span>
                          </div>
                        </div>

                        {/* Key highlights tags */}
                        {dp.highlights && dp.highlights.length > 0 && (
                          <div className="flex items-center flex-wrap gap-1.5 pt-1 text-[11px]">
                            {dp.highlights.map((hl, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center gap-1 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 px-2 py-0.8 rounded-md border border-stone-200 dark:border-stone-700"
                              >
                                <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                                <span>{hl}</span>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* MODE 2: CLASSIC DAY TABS SELECTOR */
              <div>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-stone-200 dark:border-stone-700">
                  {circuit.dayProgram.map((dp) => (
                    <button
                      key={dp.day}
                      type="button"
                      onClick={() => setActiveDay(dp.day)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                        activeDay === dp.day
                          ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                      }`}
                    >
                      {t('circuit.dayPrefix')} {dp.day}
                    </button>
                  ))}
                </div>

                {/* Active Day Detail Card */}
                {(() => {
                  const currentDay = circuit.dayProgram.find((d) => d.day === activeDay) || circuit.dayProgram[0];
                  if (!currentDay) return null;
                  const dayTitle = currentDay.title[language] || currentDay.title['fr'];
                  const dayDesc = currentDay.description[language] || currentDay.description['fr'];

                  return (
                    <div className="mt-4 p-5 bg-stone-50/90 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700 space-y-4">
                      <div className="flex items-baseline gap-3">
                        <span className="text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/70 px-2 py-0.5 rounded">
                          {t('circuit.dayPrefix')} {currentDay.day}
                        </span>
                        <h4 className="text-base font-bold text-stone-900 dark:text-white">{dayTitle}</h4>
                      </div>

                      <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed whitespace-pre-line">
                        {dayDesc}
                      </p>

                      <div className="pt-3 border-t border-stone-200/80 dark:border-stone-700/80 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-stone-500 dark:text-stone-400 font-medium">{t('circuit.lodging')} : </span>
                          <span className="font-semibold text-stone-800 dark:text-stone-200">{currentDay.lodging}</span>
                        </div>
                        <div>
                          <span className="text-stone-500 dark:text-stone-400 font-medium">{t('circuit.meals')} : </span>
                          <span className="font-semibold text-stone-800 dark:text-stone-200">{translateMeal(currentDay.meals)}</span>
                        </div>
                      </div>

                      {currentDay.highlights && currentDay.highlights.length > 0 && (
                        <div className="flex items-center flex-wrap gap-2 pt-1 text-xs text-stone-600 dark:text-stone-400">
                          <span className="font-semibold text-stone-700 dark:text-stone-300">{t('circuit.keyPoints')}</span>
                          {currentDay.highlights.map((hl, i) => (
                            <span key={i} className="inline-flex items-center gap-1 bg-white dark:bg-stone-800 px-2 py-1 rounded border border-stone-200 dark:border-stone-700">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              {hl}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>

          {/* Inclusions & Exclusions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-stone-200">
            {/* Inclusions */}
            <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100">
              <h4 className="text-sm font-bold text-emerald-950 flex items-center gap-1.5 mb-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                {t('circuit.inclusions')}
              </h4>
              <ul className="space-y-2 text-xs text-emerald-900/90">
                {inclusions.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold shrink-0">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Exclusions */}
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
              <h4 className="text-sm font-bold text-stone-900 flex items-center gap-1.5 mb-3">
                <XCircle className="w-4 h-4 text-rose-500" />
                {t('circuit.exclusions')}
              </h4>
              <ul className="space-y-2 text-xs text-stone-600">
                {exclusions.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold shrink-0">✕</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Practical Tips & Advice */}
          {practicalTips.length > 0 && (
            <div className="p-4 bg-stone-100/70 rounded-xl border border-stone-200 text-xs text-stone-700">
              <h4 className="font-bold text-stone-900 flex items-center gap-1.5 mb-2">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                {t('circuit.practical')}
              </h4>
              <ul className="list-disc list-inside space-y-1">
                {practicalTips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="bg-stone-100 px-6 py-4 border-t border-stone-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-xs font-semibold text-stone-600 hover:text-stone-900 cursor-pointer"
          >
            {t('circuit.backToCatalog')}
          </button>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloadingPdf}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-700 dark:text-stone-300 bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 rounded-lg transition-colors cursor-pointer border border-stone-300 dark:border-stone-700"
              title="Télécharger la fiche circuit en PDF"
            >
              {isDownloadingPdf ? (
                <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
              ) : (
                <FileDown className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              )}
              <span>{isDownloadingPdf ? 'Génération...' : 'Télécharger PDF'}</span>
            </button>

            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-emerald-700" />
              <span>WhatsApp</span>
            </a>

            <button
              onClick={() => {
                onClose();
                openQuoteModal({ id: circuit.id, title });
              }}
              className="px-4 sm:px-5 py-2 sm:py-2.5 text-xs font-bold text-stone-950 bg-amber-500 hover:bg-amber-400 rounded-lg shadow-sm transition-all hover:scale-[1.02] cursor-pointer"
            >
              {t('card.requestQuote')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
