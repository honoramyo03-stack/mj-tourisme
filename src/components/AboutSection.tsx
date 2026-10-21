import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Truck, HeartHandshake, PhoneCall, CheckCircle, Users } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const { t, setActiveView, openQuoteModal } = useApp();

  return (
    <section className="py-16 bg-stone-100/70 border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="text-xs font-semibold uppercase tracking-wider text-amber-700 mb-2">
            {t('about.kicker')}
          </div>
          <h2 className="text-3xl font-extrabold text-stone-900 tracking-tight">
            {t('about.title')}
          </h2>
          <p className="mt-3 text-sm text-stone-600 leading-relaxed">
            {t('about.subtitle')}
          </p>
        </div>

        {/* 4 Pillars of Trust */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-amber-50 text-amber-700 rounded-xl flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-900 mb-2">
              {t('about.pillar1.title')}
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              {t('about.pillar1.desc')}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-amber-50 text-amber-700 rounded-xl flex items-center justify-center mb-4">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-900 mb-2">
              {t('about.pillar2.title')}
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              {t('about.pillar2.desc')}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-amber-50 text-amber-700 rounded-xl flex items-center justify-center mb-4">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-900 mb-2">
              {t('about.pillar3.title')}
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              {t('about.pillar3.desc')}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-amber-50 text-amber-700 rounded-xl flex items-center justify-center mb-4">
              <PhoneCall className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-900 mb-2">
              {t('about.pillar4.title')}
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              {t('about.pillar4.desc')}
            </p>
          </div>
        </div>

        {/* Agency Story & Commitments */}
        <div className="mt-12 bg-white rounded-2xl border border-stone-200 p-8 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
            <h3 className="text-xl font-bold text-stone-900">
              {t('about.story.title')}
            </h3>
            <p>
              {t('about.story.p1')}
            </p>
            <p>
              {t('about.story.p2')}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-stone-900">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{t('about.check.license')}</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-stone-900">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{t('about.check.partners')}</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-stone-900">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{t('about.check.insurance')}</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-stone-900">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{t('about.check.transparency')}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-stone-900 text-white p-6 rounded-xl flex flex-col justify-between space-y-6">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                {t('about.advisor.badge')}
              </span>
              <h4 className="text-lg font-bold text-white mt-1">
                {t('about.advisor.title')}
              </h4>
              <p className="mt-2 text-xs text-stone-300 leading-relaxed">
                {t('about.advisor.desc')}
              </p>
            </div>

            <button
              onClick={() => openQuoteModal()}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-lg transition-colors cursor-pointer text-center"
            >
              {t('about.advisor.btn')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
