import React from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Globe } from 'lucide-react';
import { Language } from '../types';

export const Footer: React.FC = () => {
  const {
    language,
    setLanguage,
    t,
    setActiveView,
    setLegalModalType,
    setIsAdminMode,
    isAdminAuthenticated,
    setAdminLoginModalOpen,
  } = useApp();

  const handleNav = (view: string) => {
    setActiveView(view);
    setIsAdminMode(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-stone-100 dark:bg-stone-950 text-stone-600 dark:text-stone-300 border-t border-stone-200 dark:border-stone-800 text-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Col 1: Brand & License */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-stone-950 font-bold text-base shadow-sm">
                R
              </div>
              <span className="text-lg font-bold text-stone-900 dark:text-white tracking-tight">
                Ravinala Tours Madagascar
              </span>
            </div>

            <p className="text-stone-600 dark:text-stone-400 text-xs leading-relaxed max-w-sm">
              {t('footer.col1.desc')}
            </p>

            <div className="pt-2 text-[11px] text-stone-500 dark:text-stone-500 space-y-1">
              <p>{t('footer.licence')}</p>
              <p>{t('contact.address')}</p>
              <p>{t('contact.phoneLabel')} {t('contact.phone')}</p>
              <p>{t('contact.emailLabel')} {t('contact.email')}</p>
            </div>
          </div>

          {/* Col 2: Navigation rapide */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-white mb-3">
              {t('footer.tours')}
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleNav('circuits')}
                  className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
                >
                  {t('footer.allTours')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('departures')}
                  className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
                >
                  {t('footer.guaranteed2026')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('destinations')}
                  className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
                >
                  {t('footer.exploreRegions')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('customTrip')}
                  className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
                >
                  {t('footer.customTrip')}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Informations pratiques */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-white mb-3">
              {t('footer.tipsAndAgency')}
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleNav('about')}
                  className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
                >
                  {t('nav.about')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('faq')}
                  className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
                >
                  {t('nav.faq')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('contact')}
                  className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
                >
                  {t('nav.contact')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    if (isAdminAuthenticated) {
                      setIsAdminMode(true);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    } else {
                      setAdminLoginModalOpen(true);
                    }
                  }}
                  className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Shield className="w-3 h-3" />
                  <span>{t('footer.agencyPortal')}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Langues du site */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-white mb-3">
              {t('footer.availableLanguages')}
            </h4>
            <div className="space-y-2">
              <button
                onClick={() => setLanguage('fr')}
                className={`w-full text-left px-2.5 py-1.5 rounded transition-colors flex items-center justify-between cursor-pointer ${
                  language === 'fr'
                    ? 'bg-amber-100 dark:bg-stone-800 text-amber-800 dark:text-amber-400 font-bold border border-amber-300 dark:border-stone-700'
                    : 'hover:bg-stone-200 dark:hover:bg-stone-900 text-stone-700 dark:text-stone-400'
                }`}
              >
                <span>Français (FR)</span>
                {language === 'fr' && <span className="text-[10px]">✓</span>}
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`w-full text-left px-2.5 py-1.5 rounded transition-colors flex items-center justify-between cursor-pointer ${
                  language === 'en'
                    ? 'bg-amber-100 dark:bg-stone-800 text-amber-800 dark:text-amber-400 font-bold border border-amber-300 dark:border-stone-700'
                    : 'hover:bg-stone-200 dark:hover:bg-stone-900 text-stone-700 dark:text-stone-400'
                }`}
              >
                <span>English (EN)</span>
                {language === 'en' && <span className="text-[10px]">✓</span>}
              </button>
              <button
                onClick={() => setLanguage('mg')}
                className={`w-full text-left px-2.5 py-1.5 rounded transition-colors flex items-center justify-between cursor-pointer ${
                  language === 'mg'
                    ? 'bg-amber-100 dark:bg-stone-800 text-amber-800 dark:text-amber-400 font-bold border border-amber-300 dark:border-stone-700'
                    : 'hover:bg-stone-200 dark:hover:bg-stone-900 text-stone-700 dark:text-stone-400'
                }`}
              >
                <span>Malagasy (MG)</span>
                {language === 'mg' && <span className="text-[10px]">✓</span>}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Legal Links Bar */}
        <div className="pt-8 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500 dark:text-stone-500">
          <p>© 2026 Ravinala Tours Madagascar. {t('footer.rights')}</p>

          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={() => setLegalModalType('mentions')}
              className="hover:text-stone-800 dark:hover:text-stone-300 transition-colors cursor-pointer"
            >
              {t('footer.legal')}
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setLegalModalType('privacy')}
              className="hover:text-stone-800 dark:hover:text-stone-300 transition-colors cursor-pointer"
            >
              {t('footer.privacy')}
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setLegalModalType('cgv')}
              className="hover:text-stone-800 dark:hover:text-stone-300 transition-colors cursor-pointer"
            >
              {t('footer.cgv')}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
