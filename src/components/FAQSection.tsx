import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FAQ_ITEMS } from '../data/faq';
import { REVIEWS } from '../data/reviews';
import { ChevronDown, ChevronUp, FileText, Star, CheckCircle, HelpCircle } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const { language, t, setCatalogPdfModalOpen } = useApp();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>('faq-01');

  const filteredFaq =
    activeCategory === 'all'
      ? FAQ_ITEMS
      : FAQ_ITEMS.filter((item) => item.category === activeCategory);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section className="py-16 bg-white dark:bg-stone-950 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Reviews First */}
        <div className="mb-20">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-2">
              {t('reviews.kicker')}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white tracking-tight">
              {t('reviews.title')}
            </h2>
            <p className="mt-2 text-sm text-stone-600 dark:text-stone-300">
              {t('reviews.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {REVIEWS.map((rev) => {
              const tripTitle = rev.tripTaken[language] || rev.tripTaken['fr'];
              const comment = rev.comment[language] || rev.comment['fr'];

              return (
                <div
                  key={rev.id}
                  className="bg-stone-50 dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 flex flex-col justify-between shadow-sm"
                >
                  <div>
                    {/* Stars */}
                    <div className="flex items-center gap-1 text-amber-500 mb-3">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-500" />
                      ))}
                    </div>

                    <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed italic">
                      "{comment}"
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-stone-200/80 dark:border-stone-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-stone-900 dark:text-stone-100 block">{rev.author}</span>
                      <span className="text-[11px] text-stone-500 dark:text-stone-400">{tripTitle}</span>
                    </div>

                    <div className="text-right">
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                        <CheckCircle className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        {t('reviews.verifiedBadge')}
                      </span>
                      <span className="block text-[10px] text-stone-400 dark:text-stone-500">{rev.date}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* PDF Download Banner */}
        <div className="mb-16 bg-gradient-to-r from-stone-900 to-stone-800 dark:from-stone-900 dark:to-stone-950 border border-stone-800 rounded-2xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-amber-500 text-stone-950 rounded-xl flex items-center justify-center shrink-0">
              <FileText className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold tracking-tight">
                {t('pdf.banner.title')}
              </h3>
              <p className="text-xs text-stone-300 mt-1">
                {t('pdf.info')}
              </p>
            </div>
          </div>

          <button
            onClick={() => setCatalogPdfModalOpen(true)}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-lg transition-all hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap shrink-0 shadow"
          >
            {t('pdf.download')}
          </button>
        </div>

        {/* FAQ Header & Filter Tabs */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-2">
            {t('faq.kicker')}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white tracking-tight">
            {t('faq.title')}
          </h2>
          <p className="mt-2 text-sm text-stone-600 dark:text-stone-300">
            {t('faq.subtitle')}
          </p>

          {/* Interactive filter tabs */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-1 p-1 bg-stone-100 dark:bg-stone-800 rounded-lg max-w-md mx-auto border border-stone-200 dark:border-stone-700">
            {[
              { id: 'all', label: t('faq.all') },
              { id: 'preparation', label: t('faq.cat.prep') },
              { id: 'sante', label: t('faq.cat.health') },
              { id: 'reservation', label: t('faq.cat.booking') },
              { id: 'logistique', label: t('faq.cat.logistics') },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  activeCategory === tab.id
                    ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-sm'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="max-w-3xl mx-auto space-y-3">
          {filteredFaq.map((item) => {
            const isExpanded = expandedId === item.id;
            const q = item.question[language] || item.question['fr'];
            const a = item.answer[language] || item.answer['fr'];

            return (
              <div
                key={item.id}
                className="border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden transition-colors bg-stone-50/50 dark:bg-stone-900/60"
              >
                <button
                  onClick={() => toggleExpand(item.id)}
                  className="w-full p-4 sm:p-5 text-left font-bold text-xs sm:text-sm text-stone-900 dark:text-white flex items-center justify-between gap-4 hover:bg-stone-100/70 dark:hover:bg-stone-800/60 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                    {q}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-stone-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-stone-500 shrink-0" />
                  )}
                </button>

                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed border-t border-stone-100 dark:border-stone-800 bg-white dark:bg-stone-900">
                    {a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
