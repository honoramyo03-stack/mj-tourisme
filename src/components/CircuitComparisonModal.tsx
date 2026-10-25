import React from 'react';
import { useApp } from '../context/AppContext';
import { Circuit } from '../types';
import {
  X,
  Compass,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Trash2,
  Sparkles,
  Layers,
} from 'lucide-react';
import { WeatherBadge } from './WeatherBadge';

export const CircuitComparisonModal: React.FC = () => {
  const {
    language,
    t,
    comparisonCircuits,
    removeFromComparison,
    clearComparison,
    isComparisonModalOpen,
    setIsComparisonModalOpen,
    setSelectedCircuit,
    openQuoteModal,
    formatPrice,
  } = useApp();

  if (!isComparisonModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-5xl w-full max-h-[92dvh] flex flex-col overflow-hidden border border-stone-200 dark:border-stone-800 shadow-2xl">
        {/* Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white flex items-center justify-between border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 font-bold flex items-center justify-center shadow">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                {language === 'en'
                  ? 'Side-by-Side Comparison'
                  : language === 'mg'
                  ? 'Fampitahana lalam-pitetezana'
                  : 'Comparateur de Circuits Face-à-Face'}
              </div>
              <h3 className="text-base sm:text-lg font-extrabold text-white">
                {comparisonCircuits.length}{' '}
                {language === 'en'
                  ? 'circuit(s) selected'
                  : language === 'mg'
                  ? 'dia voafantina'
                  : 'circuit(s) sélectionné(s)'}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {comparisonCircuits.length > 0 && (
              <button
                onClick={clearComparison}
                className="text-xs text-stone-400 hover:text-rose-400 px-3 py-1.5 rounded-lg border border-stone-700 hover:border-rose-500/50 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">
                  {language === 'en' ? 'Clear all' : language === 'mg' ? 'Fafao rehetra' : 'Tout effacer'}
                </span>
              </button>
            )}
            <button
              onClick={() => setIsComparisonModalOpen(false)}
              className="p-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-x-auto overflow-y-auto p-4 sm:p-6">
          {comparisonCircuits.length === 0 ? (
            <div className="text-center py-16 max-w-md mx-auto space-y-3">
              <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
                <Compass className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-stone-900 dark:text-white">
                {language === 'en'
                  ? 'No circuits added for comparison'
                  : language === 'mg'
                  ? 'Tsy misy dia ampitahaina'
                  : 'Aucun circuit sélectionné'}
              </h4>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {language === 'en'
                  ? 'Click "Compare" on any circuit card in the catalog to confront their duration, budget, itinerary and highlights side by side.'
                  : language === 'mg'
                  ? 'Tsindrio ny bokotra "Ampitahao" amin\'ny fampisehoana dia mba hampitahana azy ireo.'
                  : 'Cliquez sur "Comparer" sur les fiches de circuits du catalogue pour afficher leurs caractéristiques en vis-à-vis.'}
              </p>
              <button
                onClick={() => setIsComparisonModalOpen(false)}
                className="mt-2 px-4 py-2 bg-amber-500 text-stone-950 font-bold text-xs rounded-xl shadow cursor-pointer hover:bg-amber-400"
              >
                {language === 'en' ? 'Explore catalog' : language === 'mg' ? 'Hijery ireo dia' : 'Parcourir le catalogue'}
              </button>
            </div>
          ) : (
            <div className="min-w-[700px] grid grid-cols-[160px,repeat(var(--count),minmax(220px,1fr))] gap-4" style={{ '--count': comparisonCircuits.length } as React.CSSProperties}>
              {/* Row 0: Labels column */}
              <div className="space-y-6 pt-3 font-bold text-xs text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                <div className="h-44 flex items-end">Circuit</div>
                <div className="h-10 flex items-center">Tarif indicatif</div>
                <div className="h-10 flex items-center">Durée</div>
                <div className="h-10 flex items-center">Région & Météo</div>
                <div className="h-10 flex items-center">Difficulté</div>
                <div className="h-10 flex items-center">Formule</div>
                <div className="h-14 flex items-center">Départ / Arrivée</div>
                <div className="h-28 flex items-center">Temps forts</div>
                <div className="h-12 flex items-center">Actions</div>
              </div>

              {/* Columns for each circuit */}
              {comparisonCircuits.map((circ) => {
                const title = circ.title[language] || circ.title.fr;
                const summary = circ.summary[language] || circ.summary.fr;

                return (
                  <div
                    key={circ.id}
                    className="bg-stone-50 dark:bg-stone-800/60 rounded-2xl p-4 border border-stone-200 dark:border-stone-700 flex flex-col justify-between space-y-6"
                  >
                    {/* Visual header */}
                    <div className="h-44 flex flex-col justify-between">
                      <div className="relative h-28 rounded-xl overflow-hidden shadow-xs bg-stone-900">
                        <img
                          src={circ.mainImage}
                          alt={title}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => removeFromComparison(circ.id)}
                          className="absolute top-1.5 right-1.5 p-1 bg-stone-900/80 hover:bg-rose-500 text-white rounded-full transition-colors cursor-pointer"
                          title="Retirer du comparateur"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                        <div className="absolute top-1.5 left-1.5">
                          <WeatherBadge region={circ.region} variant="compact" />
                        </div>
                      </div>
                      <h4 className="text-xs font-black text-stone-900 dark:text-white line-clamp-2 mt-2">
                        {title}
                      </h4>
                    </div>

                    {/* Price */}
                    <div className="h-10 flex items-center">
                      <div className="text-base font-extrabold text-amber-600 dark:text-amber-400 font-mono">
                        {formatPrice(circ.basePriceEUR)}
                        <span className="text-[10px] text-stone-500 font-normal"> / pers.</span>
                      </div>
                    </div>

                    {/* Duration */}
                    <div className="h-10 flex items-center text-xs font-semibold text-stone-800 dark:text-stone-200">
                      {circ.durationDays} jours · {circ.durationNights} nuits
                    </div>

                    {/* Region */}
                    <div className="h-10 flex items-center gap-2">
                      <span className="text-xs font-bold text-amber-700 dark:text-amber-400">
                        {circ.region}
                      </span>
                    </div>

                    {/* Difficulty */}
                    <div className="h-10 flex items-center">
                      <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full capitalize ${
                        circ.difficulty === 'facile'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : circ.difficulty === 'modérée'
                          ? 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                      }`}>
                        {circ.difficulty}
                      </span>
                    </div>

                    {/* Mode */}
                    <div className="h-10 flex items-center text-xs font-medium text-stone-700 dark:text-stone-300 capitalize">
                      {circ.mode === 'prive' ? '4x4 Privatif dédié' : circ.mode === 'groupe' ? 'Petit groupe' : 'Départ garanti'}
                    </div>

                    {/* Start / End */}
                    <div className="h-14 flex flex-col justify-center text-[11px] text-stone-600 dark:text-stone-400 leading-tight">
                      <div><strong>De :</strong> {circ.startingPoint}</div>
                      <div><strong>À :</strong> {circ.endingPoint}</div>
                    </div>

                    {/* Highlights */}
                    <div className="h-28 overflow-y-auto no-scrollbar space-y-1 text-[10px]">
                      {circ.dayProgram.slice(0, 3).map((d, i) => (
                        <div key={i} className="text-stone-600 dark:text-stone-300 flex items-start gap-1">
                          <span className="text-amber-500 font-bold shrink-0">✓</span>
                          <span className="line-clamp-1">{d.title[language] || d.title.fr}</span>
                        </div>
                      ))}
                    </div>

                    {/* Buttons */}
                    <div className="h-12 flex items-center gap-1.5 pt-2 border-t border-stone-200 dark:border-stone-700">
                      <button
                        onClick={() => {
                          setSelectedCircuit(circ);
                          setIsComparisonModalOpen(false);
                        }}
                        className="flex-1 py-1.5 bg-stone-900 dark:bg-stone-700 hover:bg-stone-800 text-white text-[11px] font-bold rounded-lg transition-colors cursor-pointer text-center"
                      >
                        Voir fiche
                      </button>
                      <button
                        onClick={() => {
                          openQuoteModal({ id: circ.id, title });
                          setIsComparisonModalOpen(false);
                        }}
                        className="py-1.5 px-2 bg-amber-500 hover:bg-amber-400 text-stone-950 text-[11px] font-extrabold rounded-lg transition-all cursor-pointer"
                        title="Demander un devis"
                      >
                        Devis
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
