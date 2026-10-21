import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Destination } from '../types';
import { MapPin, Calendar, Compass, ArrowRight, X, Check } from 'lucide-react';
import { MadagascarInteractiveMap } from './MadagascarInteractiveMap';

export const DestinationsSection: React.FC = () => {
  const {
    language,
    t,
    destinations,
    circuits,
    setSelectedCircuit,
    setActiveView,
    setFilters,
  } = useApp();

  const [activeModalDest, setActiveModalDest] = useState<Destination | null>(null);

  const getRegionLabel = (region: string) => {
    if (region === 'Hautes Terres') return t('region.hautesTerres');
    if (region === 'Sud') return t('region.sud');
    if (region === 'Ouest') return t('region.ouest');
    if (region === 'Nord') return t('region.nord');
    if (region === 'Est') return t('region.est');
    if (region === 'Îles') return t('region.iles');
    return region;
  };

  const handleFilterByRegion = (regionName: string) => {
    setFilters((prev) => ({ ...prev, region: regionName }));
    setActiveView('circuits');
    const el = document.getElementById('catalogue-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-16 bg-white dark:bg-stone-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-2">
            {t('destinations.kicker')}
          </div>
          <h2 className="text-3xl font-extrabold text-stone-900 dark:text-white tracking-tight">
            {t('destinations.title')}
          </h2>
          <p className="mt-3 text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
            {t('destinations.subtitle')}
          </p>
        </div>

        {/* Embedded Interactive Vector Map of Madagascar */}
        <MadagascarInteractiveMap />

        {/* Bento/Grid Layout for Destinations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((dest) => {
            const name = dest.name[language] || dest.name['fr'];
            const description = dest.description[language] || dest.description['fr'];
            const highlights = dest.highlights[language] || dest.highlights['fr'] || [];
            const bestPeriodText =
              typeof dest.bestPeriod === 'object'
                ? dest.bestPeriod[language] || dest.bestPeriod['fr']
                : dest.bestPeriod;

            return (
              <div
                key={dest.id}
                className="group rounded-2xl border border-stone-200 overflow-hidden bg-stone-50 hover:bg-white hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div
                  className="relative aspect-[16/10] overflow-hidden cursor-pointer"
                  onClick={() => setActiveModalDest(dest)}
                >
                  <img
                    src={dest.image}
                    alt={name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4">
                    <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                      {getRegionLabel(dest.region)}
                    </span>
                    <h3 className="text-lg font-bold text-white leading-snug line-clamp-1">
                      {name}
                    </h3>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                      {description}
                    </p>

                    <div className="mt-3 space-y-1.5">
                      {highlights.slice(0, 2).map((h, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-xs text-stone-700">
                          <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span className="line-clamp-1">{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-200/80 flex items-center justify-between">
                    <span className="text-[11px] text-stone-600 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-stone-600" />
                      {bestPeriodText}
                    </span>

                    <button
                      onClick={() => handleFilterByRegion(dest.region)}
                      className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>{t('destinations.viewTours')}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Destination Modal Details */}
      {activeModalDest && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-stone-200 flex flex-col max-h-[90vh]">
            <div className="relative aspect-[16/9] bg-stone-900">
              <img
                src={activeModalDest.image}
                alt=""
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setActiveModalDest(null)}
                className="absolute top-3 right-3 bg-stone-900/80 text-white p-2 rounded-full hover:bg-stone-900"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-4 left-6">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                  {getRegionLabel(activeModalDest.region)}
                </span>
                <h3 className="text-xl font-bold text-white">
                  {activeModalDest.name[language] || activeModalDest.name['fr']}
                </h3>
              </div>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-stone-700">
              <p className="leading-relaxed">
                {activeModalDest.description[language] || activeModalDest.description['fr']}
              </p>

              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider">
                  {t('destinations.highlightsTitle')}
                </h4>
                <ul className="space-y-1 text-xs">
                  {(activeModalDest.highlights[language] || activeModalDest.highlights['fr'] || []).map((h, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200/80 text-xs">
                <span className="font-bold text-amber-900 block mb-1">{t('destinations.tipsTitle')}</span>
                <p className="text-amber-950/90 leading-relaxed">
                  {activeModalDest.practicalInfo[language] || activeModalDest.practicalInfo['fr']}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={() => setActiveModalDest(null)}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 cursor-pointer"
                >
                  {t('circuit.close')}
                </button>
                <button
                  onClick={() => {
                    const reg = activeModalDest.region;
                    setActiveModalDest(null);
                    handleFilterByRegion(reg);
                  }}
                  className="px-5 py-2.5 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-lg shadow cursor-pointer"
                >
                  {t('destinations.exploreRegionBtn')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
