import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Language } from '../types';
import { Globe, Menu, X, Shield, PhoneCall, Sun, Moon, Heart } from 'lucide-react';

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
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

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
    <header className="sticky top-0 z-40 bg-stone-900/95 backdrop-blur-md text-stone-100 border-b border-stone-800 transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-3 sm:gap-8">
        {/* Zone 1: Brand Wordmark (Clean single-line, display typography) */}
        <button
          onClick={() => handleNavClick('home')}
          className="text-left group cursor-pointer shrink-0 min-w-0"
        >
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-amber-600 flex items-center justify-center text-stone-950 font-bold text-base sm:text-lg shadow-sm shrink-0">
              R
            </div>
            <div className="min-w-0">
              <span className="text-base sm:text-xl font-bold tracking-tight text-white group-hover:text-amber-400 transition-colors truncate block">
                Ravinala Tours
              </span>
              <span className="hidden sm:inline-block text-xs font-medium text-stone-400 uppercase tracking-widest">
                Madagascar
              </span>
            </div>
          </div>
        </button>

        {/* Zone 2: 4-5 Concise Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-stone-300">
          <button
            onClick={() => handleNavClick('home')}
            className={`whitespace-nowrap transition-colors hover:text-white py-1 relative ${
              activeView === 'home' && !isAdminMode
                ? 'text-white font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-amber-500'
                : ''
            }`}
          >
            {t('nav.home')}
          </button>
          <button
            onClick={() => handleNavClick('circuits')}
            className={`whitespace-nowrap transition-colors hover:text-white py-1 relative ${
              activeView === 'circuits' && !isAdminMode
                ? 'text-white font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-amber-500'
                : ''
            }`}
          >
            {t('nav.circuits')}
          </button>
          <button
            onClick={() => handleNavClick('departures')}
            className={`whitespace-nowrap transition-colors hover:text-white py-1 relative ${
              activeView === 'departures' && !isAdminMode
                ? 'text-white font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-amber-500'
                : ''
            }`}
          >
            {t('nav.departures')}
          </button>
          <button
            onClick={() => handleNavClick('destinations')}
            className={`whitespace-nowrap transition-colors hover:text-white py-1 relative ${
              activeView === 'destinations' && !isAdminMode
                ? 'text-white font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-amber-500'
                : ''
            }`}
          >
            {t('nav.destinations')}
          </button>
          <button
            onClick={() => handleNavClick('customTrip')}
            className={`whitespace-nowrap transition-colors hover:text-white py-1 relative ${
              activeView === 'customTrip' && !isAdminMode
                ? 'text-white font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-amber-500'
                : ''
            }`}
          >
            {t('nav.customTrip')}
          </button>
          <button
            onClick={() => handleNavClick('about')}
            className={`whitespace-nowrap transition-colors hover:text-white py-1 relative ${
              activeView === 'about' && !isAdminMode
                ? 'text-white font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-amber-500'
                : ''
            }`}
          >
            {t('nav.about')}
          </button>
          <button
            onClick={() => handleNavClick('faq')}
            className={`whitespace-nowrap transition-colors hover:text-white py-1 relative ${
              activeView === 'faq' && !isAdminMode
                ? 'text-white font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-amber-500'
                : ''
            }`}
          >
            {t('nav.faq')}
          </button>
          <button
            onClick={() => handleNavClick('contact')}
            className={`whitespace-nowrap transition-colors hover:text-white py-1 relative ${
              activeView === 'contact' && !isAdminMode
                ? 'text-white font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-amber-500'
                : ''
            }`}
          >
            {t('nav.contact')}
          </button>
        </nav>

        {/* Zone 3: Actions + Language Switcher + Agency Admin link + Primary CTA */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1 px-2 py-1.5 sm:px-2.5 sm:py-1.5 text-xs font-semibold text-stone-300 hover:text-white bg-stone-800/80 rounded-md border border-stone-700 hover:border-stone-600 transition-colors cursor-pointer"
              aria-label="Changer de langue"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="uppercase text-[11px] sm:text-xs">{language}</span>
            </button>

            {langDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-36 bg-stone-800 border border-stone-700 rounded-lg shadow-xl py-1 z-50"
                onClick={() => setLangDropdownOpen(false)}
              >
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setLanguage(l.code)}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-stone-700 transition-colors ${
                      language === l.code
                        ? 'text-amber-400 font-bold bg-stone-700/50'
                        : 'text-stone-300'
                    }`}
                  >
                    <span>{l.label}</span>
                    <span className="text-[10px] text-stone-400">{l.flag}</span>
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
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                : 'bg-stone-800/80 text-stone-300 border-stone-700 hover:text-white hover:border-stone-600'
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
            className="p-1.5 text-stone-300 hover:text-white bg-stone-800/80 hover:bg-stone-700 rounded-md border border-stone-700 hover:border-stone-600 transition-colors cursor-pointer"
            title={theme === 'dark' ? t('theme.lightMode') : t('theme.darkMode')}
            aria-label={theme === 'dark' ? t('theme.lightMode') : t('theme.darkMode')}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-stone-300" />
            )}
          </button>

          {/* Espace Agence / Admin Portal toggle with Authentication - hidden on mobile bar, accessible in drawer */}
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
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-stone-800 text-stone-300 border-stone-700 hover:text-white hover:border-stone-600'
            }`}
            title="Accès Espace Commercial & Gestion"
          >
            <Shield className="w-3.5 h-3.5 text-amber-400" />
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
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-stone-950 bg-amber-500 hover:bg-amber-400 rounded-lg shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer whitespace-nowrap"
          >
            <span>{t('nav.cta')}</span>
          </button>

          {/* Mobile hamburger menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 sm:p-2 text-stone-300 hover:text-white focus:outline-none"
            aria-label="Ouvrir le menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-stone-900 border-b border-stone-800 px-4 pt-3 pb-6 space-y-2">
          <button
            onClick={() => handleNavClick('home')}
            className="w-full text-left py-2.5 px-3 text-sm font-medium text-stone-200 hover:bg-stone-800 rounded-md"
          >
            {t('nav.home')}
          </button>
          <button
            onClick={() => handleNavClick('circuits')}
            className="w-full text-left py-2.5 px-3 text-sm font-medium text-stone-200 hover:bg-stone-800 rounded-md"
          >
            {t('nav.circuits')}
          </button>
          <button
            onClick={() => handleNavClick('departures')}
            className="w-full text-left py-2.5 px-3 text-sm font-medium text-stone-200 hover:bg-stone-800 rounded-md"
          >
            {t('nav.departures')}
          </button>
          <button
            onClick={() => handleNavClick('destinations')}
            className="w-full text-left py-2.5 px-3 text-sm font-medium text-stone-200 hover:bg-stone-800 rounded-md"
          >
            {t('nav.destinations')}
          </button>
          <button
            onClick={() => handleNavClick('customTrip')}
            className="w-full text-left py-2.5 px-3 text-sm font-medium text-stone-200 hover:bg-stone-800 rounded-md"
          >
            {t('nav.customTrip')}
          </button>
          <button
            onClick={() => handleNavClick('about')}
            className="w-full text-left py-2.5 px-3 text-sm font-medium text-stone-200 hover:bg-stone-800 rounded-md"
          >
            {t('nav.about')}
          </button>
          <button
            onClick={() => handleNavClick('faq')}
            className="w-full text-left py-2.5 px-3 text-sm font-medium text-stone-200 hover:bg-stone-800 rounded-md"
          >
            {t('nav.faq')}
          </button>
          <button
            onClick={() => handleNavClick('contact')}
            className="w-full text-left py-2.5 px-3 text-sm font-medium text-stone-200 hover:bg-stone-800 rounded-md"
          >
            {t('nav.contact')}
          </button>

          {/* Mobile Favorites Button */}
          <button
            onClick={handleFavoritesClick}
            className="w-full text-left py-2.5 px-3 text-sm font-semibold text-rose-400 hover:bg-stone-800 rounded-md flex items-center justify-between"
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
            className="w-full text-left py-2.5 px-3 text-sm font-medium text-stone-200 hover:bg-stone-800 rounded-md flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-300" />}
              {theme === 'dark' ? t('theme.lightMode') : t('theme.darkMode')}
            </span>
            <span className="text-[11px] text-stone-400 uppercase font-mono">
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
            className="w-full text-left py-2.5 px-3 text-sm font-semibold text-amber-400 hover:bg-stone-800 rounded-md flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-400" />
              {t('nav.admin')}
            </span>
            {pendingLeadsCount > 0 && (
              <span className="bg-amber-500 text-stone-950 font-bold text-[10px] px-1.5 py-0.5 rounded-full">
                {pendingLeadsCount}
              </span>
            )}
          </button>

          <div className="pt-3 border-t border-stone-800 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openQuoteModal();
              }}
              className="w-full py-3 text-center text-sm font-bold bg-amber-500 text-stone-950 rounded-lg shadow"
            >
              {t('nav.cta')}
            </button>
            <div className="flex items-center justify-between py-2 text-xs text-stone-400">
              <span className="flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
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
