import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, ArrowRight, ShieldCheck, Award, Headset, FileText } from 'lucide-react';
import { DynamicSearchBar } from './DynamicSearchBar';

export const Hero: React.FC = () => {
  const { t, setActiveView, setCatalogPdfModalOpen } = useApp();

  return (
    <div className="relative min-h-[640px] lg:min-h-[720px] flex items-center justify-center bg-stone-950 text-white overflow-hidden">
      {/* Background Image with Measured Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_madagascar_baobabs_1792223499188.jpg"
          alt={t('hero.imgAlt')}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-105 transform animate-pulse duration-1000"
          style={{ animationDuration: '8s' }}
        />
        {/* Anti-Slop Measured Scrim for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/70 to-stone-950/40" />
        <div className="absolute inset-0 bg-stone-950/30 backdrop-blur-[0.5px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 flex flex-col items-center text-center">
        {/* Subtle Brand Kicker (No static pill box) */}
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-400 mb-4">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{t('hero.badge')}</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl text-balance leading-tight drop-shadow-md">
          {t('hero.title')}
        </h1>

        {/* Subtitle */}
        <p className="mt-5 text-base sm:text-lg lg:text-xl text-stone-200 max-w-2xl text-balance leading-relaxed drop-shadow">
          {t('hero.subtitle')}
        </p>

        {/* Main Action CTAs */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <button
            onClick={() => {
              setActiveView('circuits');
              const el = document.getElementById('catalogue-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-5 sm:px-6 py-3 sm:py-3.5 text-xs sm:text-sm font-bold text-stone-950 bg-amber-500 hover:bg-amber-400 rounded-lg shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2 whitespace-nowrap"
          >
            <span>{t('hero.cta.discover')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              setActiveView('customTrip');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-5 sm:px-6 py-3 sm:py-3.5 text-xs sm:text-sm font-semibold text-white bg-stone-900/80 hover:bg-stone-800 border border-stone-700 hover:border-stone-500 rounded-lg backdrop-blur-sm transition-all hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
          >
            {t('hero.cta.custom')}
          </button>

          <button
            onClick={() => setCatalogPdfModalOpen(true)}
            className="px-4 py-3 sm:py-3.5 text-xs sm:text-sm font-semibold text-stone-300 hover:text-white bg-stone-900/70 hover:bg-stone-800 border border-stone-700/80 hover:border-amber-500/50 rounded-lg backdrop-blur-sm transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
            title="Télécharger le catalogue officiel en PDF"
          >
            <FileText className="w-4 h-4 text-amber-400" />
            <span>Catalogue PDF</span>
          </button>
        </div>

        {/* Interactive & Dynamic Search Bar */}
        <div className="mt-10 w-full max-w-4xl text-left">
          <DynamicSearchBar variant="hero" />
        </div>

        {/* Claim-to-Proof Adjacency Strip */}
        <div className="mt-12 pt-8 border-t border-stone-800/80 w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center">
            <span className="font-extrabold text-2xl text-amber-400 tabular-nums">{t('hero.stat.yearsNum')}</span>
            <span className="text-xs text-stone-400 mt-1">{t('hero.stat.years')}</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
              <span className="font-bold text-lg">MNP</span>
            </div>
            <span className="text-xs text-stone-400 mt-1">{t('hero.stat.guides')}</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-amber-400">
              <Headset className="w-5 h-5" />
              <span className="font-bold text-lg">24/7</span>
            </div>
            <span className="text-xs text-stone-400 mt-1">{t('hero.stat.support')}</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-amber-400">
              <Award className="w-5 h-5" />
              <span className="font-extrabold text-2xl text-amber-400 tabular-nums">98%</span>
            </div>
            <span className="text-xs text-stone-400 mt-1">{t('hero.stat.satisfaction')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
