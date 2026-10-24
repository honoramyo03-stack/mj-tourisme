import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Language } from '../types';
import { Globe, Menu, X, Shield, PhoneCall, Sun, Moon, Heart, Coins, Calculator, Layers } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    language,
    setLanguage,
    t,
    activeView,
    setActiveView,
    openQuoteModal,
    isAdminMode,
    setIsAdminMode,
    isAdminAuthenticated,
    setAdminLoginModalOpen,
    quoteRequests,
    theme,
    toggleTheme,
    favorites,
    activeCatalogTab,
    setActiveCatalogTab,
    currency,
    setCurrency,
    comparisonCircuits,
    setIsComparisonModalOpen,
    setIsBudgetSimulatorOpen,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);

  const pendingLeadsCount = quoteRequests.filter(
    (l) => l.status === 'nouvelle' || l.status === 'a_traiter'
  ).length;

  const handleNavClick = (view: string) => {
    setActiveView(view);
    setIsAdminMode(false);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFavoritesClick = () => {
    setIsAdminMode(false);
    setActiveView('circuits');
    setActiveCatalogTab('favorites');
    setMobileMenuOpen(false);
    const el = document.getElementById('catalogue-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'fr', label: 'Français', flag: 'FR' },
    { code: 'en', label: 'English', flag: 'EN' },
    { code: 'mg', label: 'Malagasy', flag: 'MG' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md text-stone-900 dark:text-stone-100 border-b border-stone-200 dark:border-stone-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-3 sm:gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => handleNavClick('home')}
          className="text-left group cursor-pointer shrink-0 min-w-0"
        >
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-amber-500 flex items-center justify-center text-stone-950 font-bold text-base sm:text-lg shadow-sm shrink-0">
              R
            </div>
            <div className="min-w-0">
              <span className="text-base sm:text-xl font-bold tracking-tight text-stone-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors truncate block">
                Ravinala Tours
              </span>
              <span className="hidden sm:inline-block text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-widest">
                Madagascar
              </span>
            </div>
          </div>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-stone-600 dark:text-stone-300">
          <button
            onClick={() => handleNavClick('home')}
            className={`whitespace-nowrap transition-colors hover:text-stone-900 dark:hover:text-white py-1 relative ${
              activeView === 'home' && !isAdminMode
                ? 'text-stone-950 dark:text-white font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-amber-500'
                : ''
            }`}
          >
            {t('nav.home')}
          </button>
          <button
            onClick={() => handleNavClick('circuits')}
            className={`whitespace-nowrap transition-colors hover:text-stone-900 dark:hover:text-white py-1 relative ${
              activeView === 'circuits' && !isAdminMode
                ? 'text-stone-950 dark:text-white font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-amber-500'
                : ''
            }`}
          >
            {t('nav.circuits')}
          </button>
          <button
            onClick={() => handleNavClick('departures')}
            className={`whitespace-nowrap transition-colors hover:text-stone-900 dark:hover:text-white py-1 relative ${
              activeView === 'departures' && !isAdminMode
                ? 'text-stone-950 dark:text-white font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-amber-500'
                : ''
            }`}
          >
            {t('nav.departures')}
          </button>
          <button
            onClick={() => handleNavClick('destinations')}
            className={`whitespace-nowrap transition-colors hover:text-stone-900 dark:hover:text-white py-1 relative ${
              activeView === 'destinations' && !isAdminMode
                ? 'text-stone-950 dark:text-white font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-amber-500'
                : ''
            }`}
          >
            {t('nav.destinations')}
          </button>
          <button
            onClick={() => handleNavClick('customTrip')}
            className={`whitespace-nowrap transition-colors hover:text-stone-900 dark:hover:text-white py-1 relative ${
              activeView === 'customTrip' && !isAdminMode
                ? 'text-stone-950 dark:text-white font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-amber-500'
                : ''
            }`}
          >
            {t('nav.customTrip')}
          </button>
          <button
            onClick={() => handleNavClick('about')}
            className={`whitespace-nowrap transition-colors hover:text-stone-900 dark:hover:text-white py-1 relative ${
              activeView === 'about' && !isAdminMode
                ? 'text-stone-950 dark:text-white font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-amber-500'
                : ''
            }`}
          >
            {t('nav.about')}
          </button>
          <button
            onClick={() => handleNavClick('faq')}
            className={`whitespace-nowrap transition-colors hover:text-stone-900 dark:hover:text-white py-1 relative ${
              activeView === 'faq' && !isAdminMode
                ? 'text-stone-950 dark:text-white font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-amber-500'
                : ''
            }`}
          >
            {t('nav.faq')}
          </button>
          <button
            onClick={() => handleNavClick('contact')}
            className={`whitespace-nowrap transition-colors hover:text-stone-900 dark:hover:text-white py-1 relative ${
              activeView === 'contact' && !isAdminMode
                ? 'text-stone-950 dark:text-white font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-amber-500'
                : ''
            }`}
          >
            {t('nav.contact')}
          </button>
          {/* DEDICATED CURRENCY CONVERTER TAB */}
          <button
            onClick={() => handleNavClick('converter')}
            className={`whitespace-nowrap transition-colors hover:text-stone-900 dark:hover:text-white py-1 relative flex items-center gap-1.5 ${
              activeView === 'converter' && !isAdminMode
                ? 'text-stone-950 dark:text-white font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-amber-500'
                : 'text-amber-700 dark:text-amber-400 font-semibold'
            }`}
            title="Convertisseur de devises € / $ / Ariary"
          >
            <Coins className="w-3.5 h-3.5 text-amber-500" />
            <span>{language === 'en' ? 'Currency (Ar / € / $)' : language === 'mg' ? 'Fanakalozam-bola' : 'Devises (Ar / € / $)'}</span>
          </button>
        </nav>

        {/* Zone 3: Actions + Currency Switcher + Language Switcher + Agency Admin link + Primary CTA */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Global Currency Switcher */}
          <div className="relative">
            <button
              onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
              className="flex items-center gap-1 px-2 py-1.5 sm:px-2.5 sm:py-1.5 text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/50 rounded-md border border-amber-300 dark:border-amber-700 transition-colors cursor-pointer"
              title="Changer la devise d'affichage du site"
              aria-label="Changer de devise"
            >
              <Coins className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>
                {currency === 'EUR' ? '€ EUR' : currency === 'USD' ? '$ USD' : 'Ar MGA'}
              </span>
            </button>

            {currencyDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-40 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg shadow-xl py-1 z-50 animate-in fade-in zoom-in-95"
                onClick={() => setCurrencyDropdownOpen(false)}
              >
                <button
                  onClick={() => setCurrency('EUR')}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors ${
                    currency === 'EUR'
                      ? 'text-amber-600 dark:text-amber-400 font-bold bg-amber-50/60 dark:bg-stone-700/50'
                      : 'text-stone-700 dark:text-stone-300'
                  }`}
                >
                  <span>Euro (€ EUR)</span>
                  <span className="text-[10px] text-stone-400">1 €</span>
                </button>
                <button
                  onClick={() => setCurrency('USD')}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors ${
                    currency === 'USD'
                      ? 'text-amber-600 dark:text-amber-400 font-bold bg-amber-50/60 dark:bg-stone-700/50'
                      : 'text-stone-700 dark:text-stone-300'
                  }`}
                >
                  <span>Dollar ($ USD)</span>
                  <span className="text-[10px] text-stone-400">1.08 $</span>
                </button>
                <button
                  onClick={() => setCurrency('MGA')}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors ${
                    currency === 'MGA'
                      ? 'text-amber-600 dark:text-amber-400 font-bold bg-amber-50/60 dark:bg-stone-700/50'
                      : 'text-stone-700 dark:text-stone-300'
                  }`}
                >
                  <span>Ariary (Ar MGA)</span>
                  <span className="text-[10px] text-stone-400">≈ 4 950 Ar</span>
                </button>
              </div>
            )}
          </div>

          {/* Quick Budget Simulator Modal Trigger */}
          <button
            onClick={() => setIsBudgetSimulatorOpen(true)}
            className="hidden md:flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white bg-stone-100 hover:bg-stone-200 dark:bg-stone-800/80 dark:hover:bg-stone-700 rounded-md border border-stone-300 dark:border-stone-700 transition-colors cursor-pointer"
            title="Simulateur de budget voyage personnalisé"
          >
            <Calculator className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span className="hidden xl:inline">{language === 'en' ? 'Budget' : 'Simulateur'}</span>
          </button>

          {/* Circuit Comparison Modal Trigger */}
          <button
            onClick={() => setIsComparisonModalOpen(true)}
            className={`hidden md:flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-md border transition-all cursor-pointer ${
              comparisonCircuits.length > 0
                ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-500/50 shadow-xs'
                : 'text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white bg-stone-100 hover:bg-stone-200 dark:bg-stone-800/80 dark:hover:bg-stone-700 border-stone-300 dark:border-stone-700'
            }`}
            title="Comparateur de circuits face-à-face"
          >
            <Layers className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span className="hidden xl:inline">{language === 'en' ? 'Compare' : 'Comparer'}</span>
            {comparisonCircuits.length > 0 && (
              <span className="bg-amber-500 text-stone-950 font-bold text-[10px] px-1.5 py-0.2 rounded-full inline-flex items-center justify-center">
                {comparisonCircuits.length}
              </span>
            )}
          </button>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1 px-2 py-1.5 sm:px-2.5 sm:py-1.5 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white bg-stone-100 hover:bg-stone-200 dark:bg-stone-800/80 dark:hover:bg-stone-700 rounded-md border border-stone-300 dark:border-stone-700 transition-colors cursor-pointer"
              aria-label="Changer de langue"
            >
              <Globe className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
              <span className="uppercase text-[11px] sm:text-xs">{language}</span>
            </button>

            {langDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-36 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg shadow-xl py-1 z-50 animate-in fade-in zoom-in-95"
                onClick={() => setLangDropdownOpen(false)}
              >
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setLanguage(l.code)}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors ${
                      language === l.code
                        ? 'text-amber-600 dark:text-amber-400 font-bold bg-amber-50/50 dark:bg-stone-700/50'
                        : 'text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <span>{l.label}</span>
                    <span className="text-[10px] text-stone-400 font-bold">{l.flag}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Favorites Button with Counter */}
          <button
            onClick={handleFavoritesClick}
            className={`flex items-center gap-1 px-2 py-1.5 sm:px-2.5 sm:py-1.5 text-xs font-semibold rounded-md border transition-all cursor-pointer ${
              activeCatalogTab === 'favorites' && activeView === 'circuits' && !isAdminMode
                ? 'bg-rose-50 dark:bg-rose-500/20 text-rose-600 dark:text-rose-300 border-rose-300 dark:border-rose-500/40'
                : 'bg-stone-100 hover:bg-stone-200 dark:bg-stone-800/80 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 border-stone-300 dark:border-stone-700 hover:text-stone-900 dark:hover:text-white'
            }`}
            title={t('favorites.title')}
            aria-label={t('favorites.title')}
          >
            <Heart className={`w-3.5 h-3.5 transition-colors shrink-0 ${favorites.length > 0 ? 'fill-rose-500 text-rose-500' : 'text-stone-400'}`} />
            <span className="hidden lg:inline">{t('nav.favorites')}</span>
            {favorites.length > 0 && (
              <span className="bg-rose-500 text-white font-bold text-[10px] px-1.5 py-0.2 rounded-full inline-flex items-center justify-center">
                {favorites.length}
              </span>
            )}
          </button>

          {/* Manual Dark / Light Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white bg-stone-100 hover:bg-stone-200 dark:bg-stone-800/80 dark:hover:bg-stone-700 rounded-md border border-stone-300 dark:border-stone-700 transition-colors cursor-pointer"
            title={theme === 'dark' ? t('theme.lightMode') : t('theme.darkMode')}
            aria-label={theme === 'dark' ? t('theme.lightMode') : t('theme.darkMode')}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-stone-700" />
            )}
          </button>

          {/* Espace Agence / Admin Portal toggle */}
          <button
            onClick={() => {
              if (isAdminMode) {
                setIsAdminMode(false);
              } else if (isAdminAuthenticated) {
                setIsAdminMode(true);
              } else {
                setAdminLoginModalOpen(true);
              }
              setMobileMenuOpen(false);
            }}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-colors cursor-pointer ${
              isAdminMode
                ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-500/40'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-300 dark:border-stone-700 hover:text-stone-900 dark:hover:text-white hover:border-stone-400 dark:hover:border-stone-600'
            }`}
            title="Accès Espace Commercial & Gestion"
          >
            <Shield className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>{t('nav.admin')}</span>
            {pendingLeadsCount > 0 && (
              <span className="bg-amber-500 text-stone-950 font-bold text-[10px] w-4 h-4 rounded-full inline-flex items-center justify-center">
                {pendingLeadsCount}
              </span>
            )}
          </button>

          {/* Primary CTA Button */}
          <button
            onClick={() => openQuoteModal()}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-stone-950 bg-amber-500 hover:bg-amber-400 rounded-lg shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer whitespace-nowrap"
          >
            <span>{t('nav.cta')}</span>
          </button>

          {/* Mobile hamburger menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 sm:p-2 text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white focus:outline-none"
            aria-label="Ouvrir le menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 px-4 pt-3 pb-6 space-y-2 text-stone-800 dark:text-stone-200">
          <button
            onClick={() => handleNavClick('home')}
            className="w-full text-left py-2.5 px-3 text-sm font-medium hover:bg-stone-100 dark:hover:bg-stone-800 rounded-md"
          >
            {t('nav.home')}
          </button>
          <button
            onClick={() => handleNavClick('circuits')}
            className="w-full text-left py-2.5 px-3 text-sm font-medium hover:bg-stone-100 dark:hover:bg-stone-800 rounded-md"
          >
            {t('nav.circuits')}
          </button>
          <button
            onClick={() => handleNavClick('departures')}
            className="w-full text-left py-2.5 px-3 text-sm font-medium hover:bg-stone-100 dark:hover:bg-stone-800 rounded-md"
          >
            {t('nav.departures')}
          </button>
          <button
            onClick={() => handleNavClick('destinations')}
            className="w-full text-left py-2.5 px-3 text-sm font-medium hover:bg-stone-100 dark:hover:bg-stone-800 rounded-md"
          >
            {t('nav.destinations')}
          </button>
          <button
            onClick={() => handleNavClick('customTrip')}
            className="w-full text-left py-2.5 px-3 text-sm font-medium hover:bg-stone-100 dark:hover:bg-stone-800 rounded-md"
          >
            {t('nav.customTrip')}
          </button>
          <button
            onClick={() => handleNavClick('about')}
            className="w-full text-left py-2.5 px-3 text-sm font-medium hover:bg-stone-100 dark:hover:bg-stone-800 rounded-md"
          >
            {t('nav.about')}
          </button>
          <button
            onClick={() => handleNavClick('faq')}
            className="w-full text-left py-2.5 px-3 text-sm font-medium hover:bg-stone-100 dark:hover:bg-stone-800 rounded-md"
          >
            {t('nav.faq')}
          </button>
          <button
            onClick={() => handleNavClick('contact')}
            className="w-full text-left py-2.5 px-3 text-sm font-medium hover:bg-stone-100 dark:hover:bg-stone-800 rounded-md"
          >
            {t('nav.contact')}
          </button>
          {/* Mobile Currency Converter */}
          <button
            onClick={() => handleNavClick('converter')}
            className="w-full text-left py-2.5 px-3 text-sm font-semibold text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-stone-800 rounded-md flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-amber-500" />
              <span>{language === 'en' ? 'Currency Converter (€ / $ / Ar)' : language === 'mg' ? 'Fanakalozam-bola (€ / $ / Ar)' : 'Convertisseur de Devises (€ / $ / Ar)'}</span>
            </span>
          </button>

          {/* Mobile Budget Simulator */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              setIsBudgetSimulatorOpen(true);
            }}
            className="w-full text-left py-2.5 px-3 text-sm font-medium hover:bg-stone-100 dark:hover:bg-stone-800 rounded-md flex items-center gap-2"
          >
            <Calculator className="w-4 h-4 text-amber-500" />
            <span>{language === 'en' ? 'Trip Budget Simulator' : language === 'mg' ? 'Fikajiana tetibola' : 'Simulateur de Budget Voyage'}</span>
          </button>

          {/* Mobile Comparison Modal */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              setIsComparisonModalOpen(true);
            }}
            className="w-full text-left py-2.5 px-3 text-sm font-medium hover:bg-stone-100 dark:hover:bg-stone-800 rounded-md flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-500" />
              <span>{language === 'en' ? 'Circuit Comparison' : 'Comparateur de Circuits'}</span>
            </span>
            {comparisonCircuits.length > 0 && (
              <span className="bg-amber-500 text-stone-950 font-bold text-xs px-2 py-0.5 rounded-full">
                {comparisonCircuits.length}
              </span>
            )}
          </button>

          {/* Mobile Favorites Button */}
          <button
            onClick={handleFavoritesClick}
            className="w-full text-left py-2.5 px-3 text-sm font-semibold text-rose-500 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-md flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <Heart className={`w-4 h-4 ${favorites.length > 0 ? 'fill-rose-500 text-rose-500' : 'text-rose-400'}`} />
              {t('favorites.title')}
            </span>
            {favorites.length > 0 && (
              <span className="bg-rose-500 text-white font-bold text-xs px-2 py-0.5 rounded-full">
                {favorites.length}
              </span>
            )}
          </button>

          {/* Mobile Dark / Light Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="w-full text-left py-2.5 px-3 text-sm font-medium hover:bg-stone-100 dark:hover:bg-stone-800 rounded-md flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-600" />}
              {theme === 'dark' ? t('theme.lightMode') : t('theme.darkMode')}
            </span>
            <span className="text-[11px] text-stone-500 dark:text-stone-400 uppercase font-mono">
              {theme}
            </span>
          </button>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              if (isAdminAuthenticated) {
                setIsAdminMode(true);
              } else {
                setAdminLoginModalOpen(true);
              }
            }}
            className="w-full text-left py-2.5 px-3 text-sm font-semibold text-amber-600 dark:text-amber-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-md flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              {t('nav.admin')}
            </span>
            {pendingLeadsCount > 0 && (
              <span className="bg-amber-500 text-stone-950 font-bold text-[10px] px-1.5 py-0.5 rounded-full">
                {pendingLeadsCount}
              </span>
            )}
          </button>

          <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openQuoteModal();
              }}
              className="w-full py-3 text-center text-sm font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-lg shadow cursor-pointer"
            >
              {t('nav.cta')}
            </button>
            <div className="flex items-center justify-between py-2 text-xs text-stone-500 dark:text-stone-400">
              <span className="flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                {t('contact.phone1')}
              </span>
              <span>{t('contact.agencyCity')}</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
