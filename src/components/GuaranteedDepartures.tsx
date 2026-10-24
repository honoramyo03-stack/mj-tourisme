import React from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, Users, CheckCircle2, AlertCircle, Clock, ArrowRight } from 'lucide-react';

export const GuaranteedDepartures: React.FC = () => {
  const { language, t, departures, openQuoteModal, setSelectedCircuit, circuits } = useApp();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirme':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            {t('departures.status.confirmed')}
          </span>
        );
      case 'presque_complet':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            {t('departures.status.almostFull')}
          </span>
        );
      case 'ouvert':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-sky-800 bg-sky-50 px-2.5 py-1 rounded-md border border-sky-200">
            <Clock className="w-3.5 h-3.5 text-sky-600" />
            {t('departures.status.open')}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-stone-600 bg-stone-100 px-2.5 py-1 rounded-md">
            {t('departures.status.full')}
          </span>
        );
    }
  };

  const handleOpenCircuit = (circuitSlug: string) => {
    const found = circuits.find((c) => c.slug === circuitSlug);
    if (found) {
      setSelectedCircuit(found);
    }
  };

  return (
    <section className="py-12 bg-stone-50 dark:bg-stone-950 border-y border-stone-200 dark:border-stone-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-1">
              {t('departures.kicker')}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-white tracking-tight">
              {t('departures.title')}
            </h2>
            <p className="mt-1 text-sm text-stone-600 dark:text-stone-300 max-w-xl">
              {t('departures.subtitle')}
            </p>
          </div>
        </div>

        {/* Departures Table / Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departures.map((dep) => {
            const tourTitle = dep.circuitTitle[language] || dep.circuitTitle['fr'];
            const seatsRemaining = dep.capacityTotal - dep.seatsBooked;

            return (
              <div
                key={dep.id}
                className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    {getStatusBadge(dep.status)}
                    <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 tabular-nums">
                      {seatsRemaining} {t('departures.availableSeats')}
                    </span>
                  </div>

                  <h3
                    onClick={() => handleOpenCircuit(dep.circuitSlug)}
                    className="text-base font-bold text-stone-900 dark:text-white hover:text-amber-700 dark:hover:text-amber-400 transition-colors cursor-pointer line-clamp-2"
                  >
                    {tourTitle}
                  </h3>

                  <div className="mt-4 space-y-2 text-xs text-stone-600 dark:text-stone-300 bg-stone-50 dark:bg-stone-800/60 p-3 rounded-lg border border-stone-100 dark:border-stone-700">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-stone-500 dark:text-stone-400">
                        <Calendar className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                        {t('departures.dates')}
                      </span>
                      <span className="font-semibold text-stone-900 dark:text-white">
                        {new Date(dep.startDate).toLocaleDateString()} → {new Date(dep.endDate).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-stone-500 dark:text-stone-400">
                        <Users className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                        {t('departures.group')}
                      </span>
                      <span className="font-semibold text-stone-900 dark:text-white">
                        {dep.seatsBooked}/{dep.capacityTotal} {t('departures.booked')} (min {dep.minParticipants})
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] uppercase text-stone-500 dark:text-stone-400 block">{t('departures.rate')}</span>
                    <span className="text-lg font-extrabold text-stone-900 dark:text-white tabular-nums">
                      {dep.priceEUR} €
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenCircuit(dep.circuitSlug)}
                      className="px-2.5 py-1.5 text-xs text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white font-medium cursor-pointer"
                    >
                      {t('departures.details')}
                    </button>
                    <button
                      onClick={() =>
                        openQuoteModal({
                          id: dep.circuitId,
                          title: `${tourTitle} (Départ Garanti du ${dep.startDate})`,
                        })
                      }
                      className="px-3.5 py-2 text-xs font-bold text-stone-950 bg-amber-500 hover:bg-amber-400 rounded-lg shadow-sm transition-all hover:scale-[1.02] cursor-pointer whitespace-nowrap"
                    >
                      {t('departures.join')}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
