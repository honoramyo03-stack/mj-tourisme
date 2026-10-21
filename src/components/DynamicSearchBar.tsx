import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  MapPin,
  Calendar,
  Compass,
  Clock,
  Sparkles,
  DollarSign,
  X,
  ArrowRight,
  Filter,
  Check,
} from 'lucide-react';

interface DynamicSearchBarProps {
  variant?: 'hero' | 'catalog';
  onSearchComplete?: () => void;
}

export const DynamicSearchBar: React.FC<DynamicSearchBarProps> = ({
  variant = 'hero',
  onSearchComplete,
}) => {
  const {
    circuits,
    filters,
    setFilters,
    resetFilters,
    language,
    t,
    setActiveView,
    setSelectedCircuit,
  } = useApp();

  const [isExpanded, setIsExpanded] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Key tourist hubs & locations across Madagascar
  const POPULAR_LOCATIONS = [
    { label: 'Mahajanga & Boeny (Base)', value: 'mahajanga' },
    { label: 'Tsingy de Namoroka / Bemaraha', value: 'tsingy' },
    { label: 'Allée des Baobabs & Morondava', value: 'baobab' },
    { label: 'Nosy Be & Archipels', value: 'nosy be' },
    { label: 'Parc National de l\'Isalo & Sud', value: 'isalo' },
    { label: 'Sainte-Marie & Baie d\'Antongil', value: 'sainte-marie' },
    { label: 'Andasibe & Forêt Pluviale', value: 'andasibe' },
    { label: 'Diego-Suarez & Mer d\'Émeraude', value: 'diego' },
    { label: 'Antsirabe & Hautes Terres', value: 'antsirabe' },
  ];

  const DEPARTURE_PERIODS = [
    { label: 'Toutes les périodes', value: 'all' },
    { label: 'Fin d\'année 2026 (Nov - Déc)', value: '2026-late' },
    { label: 'Début 2027 (Jan - Mar)', value: '2027-early' },
    { label: 'Printemps 2027 (Avr - Juin)', value: '2027-spring' },
    { label: 'Haute saison 2027 (Juil - Oct)', value: '2027-summer' },
  ];

  // Quick suggestions based on query
  const suggestions = useMemo(() => {
    const q = (filters.query || '').trim().toLowerCase();
    if (!q) return [];
    return circuits
      .filter((c) => {
        const title = (c.title[language] || c.title.fr).toLowerCase();
        const summary = (c.summary[language] || c.summary.fr).toLowerCase();
        const reg = c.region.toLowerCase();
        const start = (c.startingPoint || '').toLowerCase();
        const end = (c.endingPoint || '').toLowerCase();
        return (
          title.includes(q) ||
          summary.includes(q) ||
          reg.includes(q) ||
          start.includes(q) ||
          end.includes(q)
        );
      })
      .slice(0, 5);
  }, [circuits, filters.query, language]);

  // Live matching circuits count
  const matchingCount = useMemo(() => {
    return circuits.filter((c) => {
      // Query filter
      if (filters.query && filters.query.trim()) {
        const q = filters.query.trim().toLowerCase();
        const title = (c.title[language] || c.title.fr).toLowerCase();
        const summary = (c.summary[language] || c.summary.fr).toLowerCase();
        const reg = c.region.toLowerCase();
        if (
          !title.includes(q) &&
          !summary.includes(q) &&
          !reg.includes(q) &&
          !c.startingPoint?.toLowerCase().includes(q) &&
          !c.endingPoint?.toLowerCase().includes(q)
        ) {
          return false;
        }
      }

      // Location filter
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

      // Region filter
      if (filters.region !== 'all' && c.region !== filters.region) {
        return false;
      }

      // Duration filter
      if (filters.duration === '1' && c.durationDays !== 1) return false;
      if (filters.duration === 'short' && (c.durationDays < 2 || c.durationDays > 7)) return false;
      if (filters.duration === 'medium' && (c.durationDays < 8 || c.durationDays > 11)) return false;
      if (filters.duration === 'long' && c.durationDays < 12) return false;

      // Theme filter
      if (filters.theme !== 'all' && c.theme !== filters.theme) return false;

      // Max price filter
      if (filters.maxPrice > 0 && c.basePriceEUR > filters.maxPrice) return false;

      return true;
    }).length;
  }, [circuits, filters, language]);

  const hasActiveFilters =
    Boolean(filters.query) ||
    filters.location !== 'all' ||
    filters.region !== 'all' ||
    filters.date !== 'all' ||
    filters.duration !== 'all' ||
    filters.theme !== 'all' ||
    filters.maxPrice > 0;

  const handleApplySearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setShowSuggestions(false);
    setActiveView('circuits');
    if (onSearchComplete) onSearchComplete();
    const el = document.getElementById('catalogue-section') || document.getElementById('catalog-content');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectSuggestion = (circuit: any) => {
    setShowSuggestions(false);
    setSelectedCircuit(circuit);
  };

  return (
    <div
      className={`w-full transition-all ${
        variant === 'hero'
          ? 'bg-stone-900/95 dark:bg-stone-900/95 backdrop-blur-md border border-stone-800 text-stone-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl'
          : 'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 rounded-2xl p-4 sm:p-5 shadow-sm'
      }`}
    >
      {/* Header bar with title & dynamic counter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-stone-800/80 dark:border-stone-800 gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500 text-stone-950 font-bold">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-extrabold tracking-tight">
              {variant === 'hero' ? 'Recherche Interactive & Dynamique de Circuits' : 'Barre de Recherche en Temps Réel'}
            </h3>
            <p className="text-[11px] text-stone-400">
              Filtrez instantanément par lieu, région, date, durée ou mot-clé
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          {/* Dynamic real-time badge */}
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">
            <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
            <span>{matchingCount} voyage{matchingCount > 1 ? 's' : ''} trouvé{matchingCount > 1 ? 's' : ''}</span>
          </span>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-[11px] text-stone-400 hover:text-white dark:hover:text-amber-400 flex items-center gap-1 px-2 py-1 rounded bg-stone-800 dark:bg-stone-800 hover:bg-stone-700 transition-colors cursor-pointer"
              title="Réinitialiser tous les filtres"
            >
              <X className="w-3 h-3" />
              <span>Effacer</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Search Inputs Grid */}
      <form onSubmit={handleApplySearch} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* 1. KEYWORD / CIRCUIT / STEP SEARCH */}
          <div className="relative">
            <label className="block text-[11px] font-bold text-stone-300 dark:text-stone-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Search className="w-3 h-3 text-amber-400" />
              <span>Circuit ou Étape</span>
            </label>
            <div className="relative">
              <input
                ref={searchInputRef}
                type="text"
                value={filters.query}
                onChange={(e) => {
                  setFilters((prev) => ({ ...prev, query: e.target.value }));
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Ex: RN7, Namoroka, Baobabs, Baleines..."
                className="w-full text-xs py-2.5 pl-3 pr-8 rounded-xl border border-stone-700 dark:border-stone-700 bg-stone-800/90 dark:bg-stone-800 text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
              />
              {filters.query && (
                <button
                  type="button"
                  onClick={() => setFilters((prev) => ({ ...prev, query: '' }))}
                  className="absolute right-2.5 top-2.5 text-stone-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 z-30 bg-stone-900 border border-stone-700 rounded-xl shadow-2xl p-2 space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400 px-2 py-0.5">
                  Circuits suggérés
                </div>
                {suggestions.map((circ) => (
                  <button
                    key={circ.id}
                    type="button"
                    onClick={() => handleSelectSuggestion(circ)}
                    className="w-full text-left p-2 rounded-lg hover:bg-stone-800 flex items-center gap-2.5 text-xs text-stone-200 transition-colors cursor-pointer"
                  >
                    <img
                      src={circ.mainImage}
                      alt=""
                      className="w-8 h-8 rounded object-cover shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-white truncate text-xs">
                        {circ.title[language] || circ.title.fr}
                      </div>
                      <div className="text-[10px] text-stone-400">
                        {circ.region} · {circ.durationDays}j · {circ.basePriceEUR} €
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 2. SPECIFIC PLACE / LIEU */}
          <div>
            <label className="block text-[11px] font-bold text-stone-300 dark:text-stone-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-amber-400" />
              <span>Lieu / Site Clé</span>
            </label>
            <select
              value={filters.location}
              onChange={(e) => setFilters((prev) => ({ ...prev, location: e.target.value }))}
              className="w-full text-xs py-2.5 px-3 rounded-xl border border-stone-700 dark:border-stone-700 bg-stone-800/90 dark:bg-stone-800 text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
            >
              <option value="all">Tous les lieux & étapes</option>
              {POPULAR_LOCATIONS.map((loc) => (
                <option key={loc.value} value={loc.value}>
                  {loc.label}
                </option>
              ))}
            </select>
          </div>

          {/* 3. REGION */}
          <div>
            <label className="block text-[11px] font-bold text-stone-300 dark:text-stone-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Compass className="w-3 h-3 text-amber-400" />
              <span>Région Géographique</span>
            </label>
            <select
              value={filters.region}
              onChange={(e) => setFilters((prev) => ({ ...prev, region: e.target.value }))}
              className="w-full text-xs py-2.5 px-3 rounded-xl border border-stone-700 dark:border-stone-700 bg-stone-800/90 dark:bg-stone-800 text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
            >
              <option value="all">Toutes les régions</option>
              <option value="Ouest">Ouest (Mahajanga, Namoroka, Boeny)</option>
              <option value="Sud">Sud (Isalo, Tuléar, RN7)</option>
              <option value="Hautes Terres">Hautes Terres (Antananarivo, Antsirabe)</option>
              <option value="Nord">Nord (Diego-Suarez, Ankarana, Nosy Be)</option>
              <option value="Est">Est (Andasibe, Sainte-Marie)</option>
            </select>
          </div>

          {/* 4. DATE / PÉRIODE */}
          <div>
            <label className="block text-[11px] font-bold text-stone-300 dark:text-stone-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Calendar className="w-3 h-3 text-amber-400" />
              <span>Date / Période de départ</span>
            </label>
            <select
              value={filters.date}
              onChange={(e) => setFilters((prev) => ({ ...prev, date: e.target.value }))}
              className="w-full text-xs py-2.5 px-3 rounded-xl border border-stone-700 dark:border-stone-700 bg-stone-800/90 dark:bg-stone-800 text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
            >
              {DEPARTURE_PERIODS.map((period) => (
                <option key={period.value} value={period.value}>
                  {period.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Extended Filter Options Toggle */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs font-semibold text-stone-400 hover:text-amber-400 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>{isExpanded ? 'Moins de filtres' : '+ Filtres avancés (Durée, Thème, Budget)'}</span>
            </button>

            {/* Quick tags */}
            <div className="hidden lg:flex items-center gap-1.5 text-[11px]">
              <span className="text-stone-500">Suggestions rapides :</span>
              {['Namoroka', 'Baobabs', 'RN7', 'Nosy Be'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setFilters((prev) => ({ ...prev, query: tag }))}
                  className={`px-2 py-0.5 rounded-full border text-[10px] transition-colors cursor-pointer ${
                    filters.query.toLowerCase() === tag.toLowerCase()
                      ? 'bg-amber-500 text-stone-950 border-amber-500 font-bold'
                      : 'border-stone-700 text-stone-300 hover:border-amber-400 hover:text-white'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer shrink-0"
          >
            <span>Voir les {matchingCount} voyage{matchingCount > 1 ? 's' : ''}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Collapsible advanced section (Duration, Theme, Budget) */}
        {isExpanded && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-stone-800 animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Duration */}
            <div>
              <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-amber-400" />
                <span>Durée du voyage</span>
              </label>
              <select
                value={filters.duration}
                onChange={(e) => setFilters((prev) => ({ ...prev, duration: e.target.value }))}
                className="w-full text-xs py-2 px-3 rounded-lg border border-stone-700 bg-stone-800 text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="all">Toutes les durées</option>
                <option value="1">1 jour (Excursion courte)</option>
                <option value="short">Court séjour (2 à 7 jours)</option>
                <option value="medium">Moyen séjour (8 à 11 jours)</option>
                <option value="long">Grande traversée (12 jours et +)</option>
              </select>
            </div>

            {/* Theme */}
            <div>
              <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Thématique principale</span>
              </label>
              <select
                value={filters.theme}
                onChange={(e) => setFilters((prev) => ({ ...prev, theme: e.target.value }))}
                className="w-full text-xs py-2 px-3 rounded-lg border border-stone-700 bg-stone-800 text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="all">Toutes les thématiques</option>
                <option value="nature">Faune & Nature endémique</option>
                <option value="adventure">Aventure & Pistes 4x4</option>
                <option value="beach">Plage & Archipels</option>
                <option value="culture">Immersion & Culture</option>
                <option value="trek">Randonnée & Trek</option>
              </select>
            </div>

            {/* Max Budget */}
            <div>
              <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <DollarSign className="w-3 h-3 text-amber-400" />
                <span>Budget max / pers. (€)</span>
              </label>
              <select
                value={filters.maxPrice}
                onChange={(e) => setFilters((prev) => ({ ...prev, maxPrice: Number(e.target.value) }))}
                className="w-full text-xs py-2 px-3 rounded-lg border border-stone-700 bg-stone-800 text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="0">Tous les budgets</option>
                <option value="500">Jusqu'à 500 €</option>
                <option value="1000">Jusqu'à 1 000 €</option>
                <option value="1500">Jusqu'à 1 500 €</option>
                <option value="2000">Jusqu'à 2 000 €</option>
                <option value="2500">Jusqu'à 2 500 €</option>
              </select>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
