/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CircuitCard } from './components/CircuitCard';
import { CircuitDetailModal } from './components/CircuitDetailModal';
import { TailorMadeForm } from './components/TailorMadeForm';
import { GuaranteedDepartures } from './components/GuaranteedDepartures';
import { DestinationsSection } from './components/DestinationsSection';
import { AboutSection } from './components/AboutSection';
import { FAQSection } from './components/FAQSection';
import { ContactSection } from './components/ContactSection';
import { CatalogPdfModal } from './components/CatalogPdfModal';
import { LegalModal } from './components/LegalModal';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { AdminLoginModal } from './components/Admin/AdminLoginModal';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';
import { ChatboxAssistant } from './components/ChatboxAssistant';
import { DynamicSearchBar } from './components/DynamicSearchBar';
import { InteractiveCircuitMap } from './components/InteractiveCircuitMap';
import { CurrencyConverterView } from './components/CurrencyConverterView';
import { CircuitComparisonModal } from './components/CircuitComparisonModal';
import { BudgetSimulatorModal } from './components/BudgetSimulatorModal';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { OfflineIndicator } from './components/OfflineIndicator';
import {
  Compass,
  Filter,
  RotateCcw,
  Sparkles,
  ArrowRight,
  X,
  Calendar,
  Layers,
  Heart,
  MapPin,
  Clock,
  Award,
  Users,
  ArrowUpDown,
  LayoutGrid,
  Map,
} from 'lucide-react';
import { Circuit } from './types';

const MainApp: React.FC = () => {
  const {
    language,
    t,
    circuits,
    activeView,
    setActiveView,
    selectedCircuit,
    setSelectedCircuit,
    quoteModalOpen,
    setQuoteModalOpen,
    quotePrefilledCircuit,
    isAdminMode,
    setIsAdminMode,
    isAdminAuthenticated,
    setAdminLoginModalOpen,
    favorites,
    activeCatalogTab,
    setActiveCatalogTab,
    filters,
    setFilters,
    resetFilters,
    comparisonCircuits,
    setIsComparisonModalOpen,
    clearComparison,
    isCurrencyConverterModalOpen,
    setIsCurrencyConverterModalOpen,
  } = useApp();

  // Catalog display mode: grid cards, interactive Leaflet map, or split view
  const [catalogViewMode, setCatalogViewMode] = useState<'grid' | 'map' | 'split'>('grid');

  // Filtered Circuits
  const filteredCircuits = useMemo(() => {
    return circuits.filter((c) => {
      // Tab filter
      if (activeCatalogTab === 'departures' && c.mode !== 'depart_garanti') {
        return false;
      }
      if (activeCatalogTab === 'excursions' && c.durationDays > 2) {
        return false;
      }
      if (activeCatalogTab === 'favorites' && !favorites.includes(c.id)) {
        return false;
      }

      // 1. Text Query (Search input)
      if (filters.query && filters.query.trim()) {
        const q = filters.query.trim().toLowerCase();
        const title = (c.title[language] || c.title.fr).toLowerCase();
        const summary = (c.summary[language] || c.summary.fr).toLowerCase();
        const reg = c.region.toLowerCase();
        const start = (c.startingPoint || '').toLowerCase();
        const end = (c.endingPoint || '').toLowerCase();
        const highlightsStr = c.dayProgram.flatMap((d) => d.highlights).join(' ').toLowerCase();

        const matchesQuery =
          title.includes(q) ||
          summary.includes(q) ||
          reg.includes(q) ||
          start.includes(q) ||
          end.includes(q) ||
          highlightsStr.includes(q);

        if (!matchesQuery) return false;
      }

      // 2. Specific Location / Lieu
      if (filters.location && filters.location !== 'all') {
        const loc = filters.location.toLowerCase();
        const title = (c.title[language] || c.title.fr).toLowerCase();
        const summary = (c.summary[language] || c.summary.fr).toLowerCase();
        const start = (c.startingPoint || '').toLowerCase();
        const end = (c.endingPoint || '').toLowerCase();
        const highlightsStr = c.dayProgram.flatMap((d) => d.highlights).join(' ').toLowerCase();

        const matchesLoc =
          title.includes(loc) ||
          summary.includes(loc) ||
          start.includes(loc) ||
          end.includes(loc) ||
          highlightsStr.includes(loc);

        if (!matchesLoc) return false;
      }

      // 3. Region filter
      if (filters.region !== 'all' && c.region !== filters.region) {
        return false;
      }

      // 4. Duration filter
      if (filters.duration === '1' && c.durationDays !== 1) return false;
      if (filters.duration === 'short' && (c.durationDays < 2 || c.durationDays > 7)) return false;
      if (filters.duration === 'medium' && (c.durationDays < 8 || c.durationDays > 11)) return false;
      if (filters.duration === 'long' && c.durationDays < 12) return false;

      // 5. Theme filter
      if (filters.theme !== 'all' && c.theme !== filters.theme) return false;

      // 6. Difficulty filter
      if (filters.difficulty !== 'all' && c.difficulty !== filters.difficulty) return false;

      // 7. Mode filter
      if (filters.mode !== 'all' && c.mode !== filters.mode) return false;

      // 8. Max Price filter
      if (filters.maxPrice > 0 && c.basePriceEUR > filters.maxPrice) return false;

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'durationAsc') return a.durationDays - b.durationDays;
      if (filters.sortBy === 'durationDesc') return b.durationDays - a.durationDays;
      if (filters.sortBy === 'priceAsc') return a.basePriceEUR - b.basePriceEUR;
      if (filters.sortBy === 'priceDesc') return b.basePriceEUR - a.basePriceEUR;
      return 0;
    });
  }, [circuits, filters, activeCatalogTab, favorites, language]);

  // Featured circuits for Home preview
  const featuredCircuits = useMemo(() => {
    return circuits.filter((c) => c.isFeatured);
  }, [circuits]);

  // Admin mode authentication protection
  if (isAdminMode && isAdminAuthenticated) {
    return <AdminDashboard />;
  }

  // If someone navigated to admin mode without authentication, reset and show login modal
  if (isAdminMode && !isAdminAuthenticated) {
    setIsAdminMode(false);
    setAdminLoginModalOpen(true);
  }

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-clip flex flex-col bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 selection:bg-amber-600 selection:text-white transition-colors duration-200">
      {/* Top Header - Always fixed and permanently visible */}
      <Header />
      {/* Spacer to guarantee content starts cleanly below the fixed header */}
      <div className="h-16 sm:h-20 shrink-0" aria-hidden="true" />

      <main className="flex-1 w-full max-w-full overflow-x-hidden">
        {/* VIEW: HOME */}
        {activeView === 'home' && (
          <div>
            <Hero />

            {/* Featured Circuits Section */}
            <section id="catalogue-section" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-1">
                    {t('home.featured.kicker')}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white tracking-tight">
                    {t('home.featured.title')}
                  </h2>
                  <p className="mt-1 text-sm text-stone-600 max-w-xl">
                    {t('home.featured.desc')}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setActiveView('circuits');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="self-start md:self-auto text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{t('home.featured.viewAll')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredCircuits.map((circuit) => (
                  <CircuitCard
                    key={circuit.id}
                    circuit={circuit}
                    onSelect={(c) => setSelectedCircuit(c)}
                  />
                ))}
              </div>
            </section>

            {/* Guaranteed Departures Strip */}
            <GuaranteedDepartures />

            {/* Regional Destinations Section */}
            <DestinationsSection />

            {/* About & Trust Section */}
            <AboutSection />

            {/* Reviews & FAQ Section with PDF download */}
            <FAQSection />

            {/* Contact Section */}
            <ContactSection />
          </div>
        )}

        {/* VIEW: CIRCUITS CATALOGUE */}
        {activeView === 'circuits' && (
          <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <div className="text-xs font-semibold uppercase tracking-wider text-amber-700 mb-2">
                {t('catalog.kicker')}
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
                {t('catalog.title')}
              </h1>
              <p className="mt-2 text-sm text-stone-600 dark:text-stone-300">
                {t('catalog.subtitle')}
              </p>
            </div>

            {/* Interactive & Dynamic Search Bar */}
            <div className="mb-8">
              <DynamicSearchBar variant="catalog" />
            </div>

            {/* Segmented Filter Tabs (Buttons with click handlers) */}
            <div className="flex items-center justify-center mb-8">
              <div className="inline-flex flex-wrap items-center justify-center p-1 bg-stone-200/80 dark:bg-stone-800 rounded-xl gap-1">
                <button
                  onClick={() => setActiveCatalogTab('all')}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    activeCatalogTab === 'all'
                      ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-sm'
                      : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
                  }`}
                >
                  {t('catalog.tab.all')}
                </button>
                <button
                  onClick={() => setActiveCatalogTab('departures')}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    activeCatalogTab === 'departures'
                      ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-sm'
                      : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
                  }`}
                >
                  {t('catalog.tab.departures')}
                </button>
                <button
                  onClick={() => setActiveCatalogTab('excursions')}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    activeCatalogTab === 'excursions'
                      ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-sm'
                      : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
                  }`}
                >
                  {t('catalog.tab.excursions')}
                </button>
                <button
                  onClick={() => setActiveCatalogTab('favorites')}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeCatalogTab === 'favorites'
                      ? 'bg-rose-500 text-white shadow-sm'
                      : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${activeCatalogTab === 'favorites' ? 'fill-white' : 'text-rose-500'}`} />
                  <span>{t('catalog.tab.favorites')}</span>
                  {favorites.length > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      activeCatalogTab === 'favorites' ? 'bg-white/20 text-white' : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                    }`}>
                      {favorites.length}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-4 sm:p-5 shadow-sm mb-10 space-y-4">
              <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-stone-100 dark:border-stone-800">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider">
                    {language === 'en' ? 'Advanced Trip Filters' : language === 'mg' ? 'Sivana fikarohana manokana' : 'Filtres de recherche avancés'}
                  </span>
                </div>
                {(filters.region !== 'all' || filters.duration !== 'all' || filters.theme !== 'all' || filters.difficulty !== 'all' || filters.mode !== 'all' || filters.sortBy !== 'default') && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                    {language === 'en' ? 'Filters active' : language === 'mg' ? 'Sivana miasa' : 'Filtres actifs'}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
                {/* Cage 1: Région */}
                <div className={`p-2.5 rounded-xl border transition-all ${
                  filters.region !== 'all'
                    ? 'bg-amber-500/10 dark:bg-amber-500/15 border-amber-500/50 shadow-xs'
                    : 'bg-stone-50 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600'
                }`}>
                  <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 uppercase mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-500" />
                      <span>{t('filter.region')}</span>
                    </span>
                    {filters.region !== 'all' && (
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    )}
                  </label>
                  <select
                    value={filters.region}
                    onChange={(e) => setFilters((prev) => ({ ...prev, region: e.target.value }))}
                    className="w-full text-xs py-2 px-2.5 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
                  >
                    <option value="all">{t('filter.allRegions')}</option>
                    <option value="Hautes Terres">{t('region.hautesTerres')}</option>
                    <option value="Sud">{t('region.sud')}</option>
                    <option value="Ouest">{t('region.ouest')}</option>
                    <option value="Nord">{t('region.nord')}</option>
                    <option value="Est">{t('region.est')}</option>
                  </select>
                </div>

                {/* Cage 2: Durée */}
                <div className={`p-2.5 rounded-xl border transition-all ${
                  filters.duration !== 'all'
                    ? 'bg-amber-500/10 dark:bg-amber-500/15 border-amber-500/50 shadow-xs'
                    : 'bg-stone-50 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600'
                }`}>
                  <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 uppercase mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-sky-500" />
                      <span>{t('filter.duration')}</span>
                    </span>
                    {filters.duration !== 'all' && (
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    )}
                  </label>
                  <select
                    value={filters.duration}
                    onChange={(e) => setFilters((prev) => ({ ...prev, duration: e.target.value }))}
                    className="w-full text-xs py-2 px-2.5 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
                  >
                    <option value="all">{t('filter.allDurations')}</option>
                    <option value="1">{t('filter.duration.1day')}</option>
                    <option value="short">{t('filter.duration.short')}</option>
                    <option value="medium">{t('filter.duration.medium')}</option>
                    <option value="long">{t('filter.duration.long')}</option>
                  </select>
                </div>

                {/* Cage 3: Thème */}
                <div className={`p-2.5 rounded-xl border transition-all ${
                  filters.theme !== 'all'
                    ? 'bg-amber-500/10 dark:bg-amber-500/15 border-amber-500/50 shadow-xs'
                    : 'bg-stone-50 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600'
                }`}>
                  <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 uppercase mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{t('filter.theme')}</span>
                    </span>
                    {filters.theme !== 'all' && (
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    )}
                  </label>
                  <select
                    value={filters.theme}
                    onChange={(e) => setFilters((prev) => ({ ...prev, theme: e.target.value }))}
                    className="w-full text-xs py-2 px-2.5 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
                  >
                    <option value="all">{t('filter.allThemes')}</option>
                    <option value="nature">{t('filter.theme.nature')}</option>
                    <option value="adventure">{t('filter.theme.adventure')}</option>
                    <option value="beach">{t('filter.theme.beach')}</option>
                    <option value="culture">{t('filter.theme.culture')}</option>
                  </select>
                </div>

                {/* Cage 4: Difficulté */}
                <div className={`p-2.5 rounded-xl border transition-all ${
                  filters.difficulty !== 'all'
                    ? 'bg-amber-500/10 dark:bg-amber-500/15 border-amber-500/50 shadow-xs'
                    : 'bg-stone-50 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600'
                }`}>
                  <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 uppercase mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-orange-500" />
                      <span>{t('filter.difficulty')}</span>
                    </span>
                    {filters.difficulty !== 'all' && (
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    )}
                  </label>
                  <select
                    value={filters.difficulty}
                    onChange={(e) => setFilters((prev) => ({ ...prev, difficulty: e.target.value }))}
                    className="w-full text-xs py-2 px-2.5 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
                  >
                    <option value="all">{t('filter.allDifficulties')}</option>
                    <option value="facile">{t('filter.diff.easy')}</option>
                    <option value="modérée">{t('filter.diff.moderate')}</option>
                    <option value="soutenue">{t('filter.diff.challenging')}</option>
                  </select>
                </div>

                {/* Cage 5: Mode */}
                <div className={`p-2.5 rounded-xl border transition-all ${
                  filters.mode !== 'all'
                    ? 'bg-amber-500/10 dark:bg-amber-500/15 border-amber-500/50 shadow-xs'
                    : 'bg-stone-50 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600'
                }`}>
                  <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 uppercase mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-purple-500" />
                      <span>{t('filter.mode')}</span>
                    </span>
                    {filters.mode !== 'all' && (
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    )}
                  </label>
                  <select
                    value={filters.mode}
                    onChange={(e) => setFilters((prev) => ({ ...prev, mode: e.target.value }))}
                    className="w-full text-xs py-2 px-2.5 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
                  >
                    <option value="all">{t('filter.allModes')}</option>
                    <option value="prive">{t('filter.mode.private')}</option>
                    <option value="depart_garanti">{t('filter.mode.guaranteed')}</option>
                  </select>
                </div>

                {/* Cage 6: Trier par */}
                <div className={`p-2.5 rounded-xl border transition-all ${
                  filters.sortBy !== 'default'
                    ? 'bg-amber-500/10 dark:bg-amber-500/15 border-amber-500/50 shadow-xs'
                    : 'bg-stone-50 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600'
                }`}>
                  <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 uppercase mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <ArrowUpDown className="w-3.5 h-3.5 text-amber-500" />
                      <span>{t('filter.sortBy')}</span>
                    </span>
                    {filters.sortBy !== 'default' && (
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    )}
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value }))}
                    className="w-full text-xs py-2 px-2.5 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
                  >
                    <option value="default">{t('filter.sort.relevance')}</option>
                    <option value="durationAsc">{t('filter.sort.durationAsc')}</option>
                    <option value="durationDesc">{t('filter.sort.durationDesc')}</option>
                    <option value="priceAsc">{t('filter.sort.priceAsc')}</option>
                    <option value="priceDesc">{t('filter.sort.priceDesc')}</option>
                  </select>
                </div>
              </div>

              {/* Status row: Result count, View mode toggle (Grid / Leaflet Map / Split), and reset */}
              <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-500 dark:text-stone-400">
                <span className="font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>{filteredCircuits.length} {t('filter.results')}</span>
                </span>

                {/* View Mode Toggle: Grid, Leaflet Map, Split */}
                <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl border border-stone-200 dark:border-stone-700">
                  <button
                    onClick={() => setCatalogViewMode('grid')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      catalogViewMode === 'grid'
                        ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-xs'
                        : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                    }`}
                    title="Affichage en cartes détaillées"
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>{language === 'en' ? 'Grid' : 'Grille'}</span>
                  </button>

                  <button
                    onClick={() => setCatalogViewMode('map')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      catalogViewMode === 'map'
                        ? 'bg-amber-500 text-stone-950 shadow-xs'
                        : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                    }`}
                    title="Affichage des tracés et étapes sur carte interactive Leaflet"
                  >
                    <Map className="w-3.5 h-3.5" />
                    <span>{language === 'en' ? 'Interactive Map' : 'Carte des tracés'}</span>
                    <span className="bg-amber-400/30 text-stone-900 dark:text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                      {filteredCircuits.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setCatalogViewMode('split')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      catalogViewMode === 'split'
                        ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-xs'
                        : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                    }`}
                    title="Afficher à la fois la carte et les fiches"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>{language === 'en' ? 'Split View' : 'Mixte'}</span>
                  </button>
                </div>

                <button
                  onClick={resetFilters}
                  className="flex items-center gap-1.5 text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-amber-400 font-semibold cursor-pointer transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{t('filter.reset')}</span>
                </button>
              </div>
            </div>

            {/* Results Display Area */}
            {filteredCircuits.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-8 max-w-lg mx-auto space-y-3 shadow-xs">
                {activeCatalogTab === 'favorites' ? (
                  <>
                    <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center mx-auto">
                      <Heart className="w-6 h-6 fill-current" />
                    </div>
                    <h3 className="text-base font-bold text-stone-900 dark:text-white">
                      {t('favorites.empty.title')}
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                      {t('favorites.empty.desc')}
                    </p>
                    <button
                      onClick={() => setActiveCatalogTab('all')}
                      className="mt-2 px-4 py-2 bg-stone-900 hover:bg-stone-800 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-stone-950 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                    >
                      {t('favorites.empty.btn')}
                    </button>
                  </>
                ) : (
                  <>
                    <Compass className="w-10 h-10 text-stone-300 dark:text-stone-600 mx-auto" />
                    <h3 className="text-base font-bold text-stone-800 dark:text-stone-200">
                      {t('filter.noResults')}
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                      {t('filter.noResultsHelp')}
                    </p>
                    <button
                      onClick={resetFilters}
                      className="mt-2 px-4 py-2 bg-stone-900 dark:bg-stone-700 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 dark:hover:bg-stone-600 cursor-pointer"
                    >
                      {t('filter.reset')}
                    </button>
                  </>
                )}
              </div>
            ) : catalogViewMode === 'map' ? (
              /* VIEW MODE: LEAFLET INTERACTIVE MAP */
              <div className="space-y-4">
                <InteractiveCircuitMap
                  filteredCircuits={filteredCircuits}
                  onSelectCircuit={(c) => setSelectedCircuit(c)}
                  heightClass="h-[620px] lg:h-[720px]"
                />
              </div>
            ) : catalogViewMode === 'split' ? (
              /* VIEW MODE: SPLIT (LEAFLET MAP + CARDS GRID) */
              <div className="space-y-8">
                <InteractiveCircuitMap
                  filteredCircuits={filteredCircuits}
                  onSelectCircuit={(c) => setSelectedCircuit(c)}
                  heightClass="h-[460px] lg:h-[540px]"
                />
                <div>
                  <h3 className="text-sm font-bold text-stone-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                    <LayoutGrid className="w-4 h-4 text-amber-500" />
                    <span>Fiches détaillées des circuits ({filteredCircuits.length})</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredCircuits.map((circuit) => (
                      <CircuitCard
                        key={circuit.id}
                        circuit={circuit}
                        onSelect={(c) => setSelectedCircuit(c)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* VIEW MODE: CARDS GRID (WITH QUICK MAP BANNER) */
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent dark:from-amber-500/10 p-3 sm:p-4 rounded-xl border border-amber-300/60 dark:border-amber-800/60 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-500 text-stone-950 flex items-center justify-center font-bold shrink-0">
                      <Map className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-stone-900 dark:text-white">
                        Visualiser les {filteredCircuits.length} circuits sur la carte interactive
                      </div>
                      <div className="text-[11px] text-stone-600 dark:text-stone-400">
                        Explorez les tracés GPS complets, étapes et points d'intérêt sur la carte Leaflet
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setCatalogViewMode('map')}
                    className="px-3.5 py-2 bg-stone-900 hover:bg-stone-800 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-stone-950 font-bold rounded-lg text-xs cursor-pointer shrink-0 transition-all shadow-xs"
                  >
                    Ouvrir la carte
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredCircuits.map((circuit) => (
                    <CircuitCard
                      key={circuit.id}
                      circuit={circuit}
                      onSelect={(c) => setSelectedCircuit(c)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW: TAILOR-MADE TRIP */}
        {activeView === 'customTrip' && (
          <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <TailorMadeForm />
          </div>
        )}

        {/* VIEW: GUARANTEED DEPARTURES */}
        {activeView === 'departures' && (
          <div>
            <GuaranteedDepartures />
            <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto">
                <h3 className="text-lg font-bold text-stone-900 mb-2">
                  {t('home.departures.explanation.title')}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {t('home.departures.explanation.desc')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: DESTINATIONS */}
        {activeView === 'destinations' && <DestinationsSection />}

        {/* VIEW: ABOUT */}
        {activeView === 'about' && <AboutSection />}

        {/* VIEW: FAQ */}
        {activeView === 'faq' && <FAQSection />}

        {/* VIEW: CONTACT */}
        {activeView === 'contact' && <ContactSection />}

        {/* VIEW: CURRENCY CONVERTER DEDICATED TAB */}
        {activeView === 'converter' && <CurrencyConverterView />}
      </main>

      {/* Floating Circuit Comparison Dock */}
      {comparisonCircuits.length > 0 && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 bg-stone-900/95 text-white backdrop-blur-md px-4 py-3 rounded-2xl shadow-2xl border border-amber-500/40 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <div className="w-8 h-8 rounded-lg bg-amber-500 text-stone-950 font-bold flex items-center justify-center shrink-0">
            <Layers className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <span className="font-bold text-amber-400">{comparisonCircuits.length}</span>
            <span className="text-stone-300"> / 3 {language === 'en' ? 'circuits in comparison' : 'circuits à comparer'}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsComparisonModalOpen(true)}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-lg text-xs cursor-pointer shadow-sm transition-all"
            >
              {language === 'en' ? 'Compare now' : 'Comparer'}
            </button>
            <button
              onClick={clearComparison}
              className="p-1.5 text-stone-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              title="Vider la comparaison"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Non-Intrusive WhatsApp Button */}
      <WhatsAppFloatingButton />

      {/* Automated Site-Wide Virtual Assistant Chatbox */}
      <ChatboxAssistant />

      {/* Footer */}
      <Footer />

      {/* Circuit Detail Modal */}
      {selectedCircuit && (
        <CircuitDetailModal
          circuit={selectedCircuit}
          onClose={() => setSelectedCircuit(null)}
        />
      )}

      {/* Side-by-Side Circuit Comparison Modal */}
      <CircuitComparisonModal />

      {/* Interactive Travel Budget Simulator Modal */}
      <BudgetSimulatorModal />

      {/* Dedicated Currency Converter Modal (when opened from anywhere) */}
      {isCurrencyConverterModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-6 animate-fadeIn">
          <div className="relative w-full max-w-4xl max-h-[92dvh] overflow-y-auto rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-4 sm:p-6 shadow-2xl">
            <button
              onClick={() => setIsCurrencyConverterModalOpen(false)}
              className="sticky top-2 float-right z-30 bg-stone-900/80 hover:bg-stone-900 text-white p-2 rounded-full cursor-pointer shadow-lg"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
            <CurrencyConverterView isModal onClose={() => setIsCurrencyConverterModalOpen(false)} />
          </div>
        </div>
      )}

      {/* Quote Request Modal */}
      {quoteModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-6 animate-fadeIn">
          <div className="relative w-full max-w-4xl max-h-[92dvh] overflow-y-auto rounded-2xl">
            <button
              onClick={() => setQuoteModalOpen(false)}
              className="sticky top-4 float-right mr-3 z-30 bg-stone-900/80 hover:bg-stone-900 text-white p-2 rounded-full cursor-pointer shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>
            <TailorMadeForm
              prefilledCircuit={quotePrefilledCircuit}
              onSuccessClose={() => setQuoteModalOpen(false)}
            />
          </div>
        </div>
      )}

      {/* PDF Synthetic Catalogue Modal */}
      <CatalogPdfModal />

      {/* Legal Notices Modal */}
      <LegalModal />

      {/* Admin Authentication Modal */}
      <AdminLoginModal />

      {/* Android PWA Install Banner */}
      <PWAInstallPrompt />

      {/* Network Offline Indicator */}
      <OfflineIndicator />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
