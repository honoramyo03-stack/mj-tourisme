import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Coins,
  ArrowRightLeft,
  DollarSign,
  Euro,
  CreditCard,
  Banknote,
  ShieldCheck,
  Sparkles,
  Info,
  Calendar,
  Compass,
} from 'lucide-react';

export const CurrencyConverterView: React.FC<{ isModal?: boolean; onClose?: () => void }> = ({
  isModal = false,
  onClose,
}) => {
  const { language, currency, setCurrency, formatPrice, convertAmount, setActiveView, openQuoteModal } =
    useApp();

  const [amount, setAmount] = useState<number>(1000);
  const [fromCurrency, setFromCurrency] = useState<'EUR' | 'USD' | 'MGA'>('EUR');
  const [toCurrency, setToCurrency] = useState<'EUR' | 'USD' | 'MGA'>('MGA');

  const RATE_EUR_TO_MGA = 4950;
  const RATE_USD_TO_MGA = 4580;
  const RATE_EUR_TO_USD = 1.08;

  const convertedValue = convertAmount(amount, fromCurrency, toCurrency);

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const presetScenarios = [
    {
      title: {
        fr: 'Repas typique restaurant',
        en: 'Authentic local restaurant meal',
        mg: 'Sakafo trano fisakafoanana',
      },
      eur: 10,
      desc: 'Plat de zébu ou poisson grillé avec accompagnement',
    },
    {
      title: {
        fr: 'Excursion journée / Visite parc',
        en: 'Day tour / National park guide',
        mg: 'Fitsidihana valan-javaboary 1 andro',
      },
      eur: 45,
      desc: 'Entrée parc national & pistage avec guide certifié',
    },
    {
      title: {
        fr: 'Location 4x4 + chauffeur/jour',
        en: 'Private 4WD + Chauffeur / day',
        mg: 'Fiara 4x4 miaraka amin\'ny mpamily / andro',
      },
      eur: 75,
      desc: 'Toyota Land Cruiser climatisé avec chauffeur privé',
    },
    {
      title: {
        fr: 'Circuit classique 12j (Ex: RN7)',
        en: 'Classic 12-day Tour (e.g. RN7)',
        mg: 'Dia 12 andro (RN7 sy Isalo)',
      },
      eur: 1390,
      desc: 'Prix moyen par personne en demi-pension tout inclus',
    },
  ];

  return (
    <div className={`w-full ${isModal ? 'p-0' : 'max-w-5xl mx-auto px-4 py-8 sm:py-12'}`}>
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white rounded-3xl p-6 sm:p-8 border border-stone-800 shadow-xl mb-8 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider mb-3">
            <Coins className="w-3.5 h-3.5" />
            <span>
              {language === 'en'
                ? 'Official Travel Currency Converter'
                : language === 'mg'
                ? 'Mpanakalo vola ofisialy'
                : 'Convertisseur Officiel Devises Madagascar'}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {language === 'en'
              ? 'Convert EUR (€), USD ($) & Malagasy Ariary (Ar)'
              : language === 'mg'
              ? 'Fanakalozana Euro (€), Dollar ($) ary Ariary (MGA)'
              : 'Convertissez vos Euros (€), Dollars ($) et Ariary (Ar)'}
          </h2>

          <p className="mt-2 text-stone-300 text-xs sm:text-sm leading-relaxed">
            {language === 'en'
              ? 'Real-time financial estimates based on prevailing central bank rates. 1 EUR ≈ 4,950 MGA · 1 USD ≈ 4,580 MGA.'
              : language === 'mg'
              ? 'Tahan\'ny fanakalozana ara-dalàna eto Madagasikara. 1 EUR ≈ 4 950 MGA · 1 USD ≈ 4 580 MGA.'
              : 'Taux indicatifs réels appliqués pour la saison 2026-2027. Cours officiel : 1 EUR ≈ 4 950 MGA · 1 USD ≈ 4 580 MGA.'}
          </p>

          {/* Quick Currency preference selector */}
          <div className="mt-4 flex items-center gap-2">
            <span className="text-xs text-stone-400 font-semibold">
              {language === 'en' ? 'Active site currency:' : language === 'mg' ? 'Vola ampiasaina:' : 'Devise active du site :'}
            </span>
            <div className="inline-flex rounded-xl bg-stone-800 p-1 border border-stone-700">
              {(['EUR', 'USD', 'MGA'] as ('EUR' | 'USD' | 'MGA')[]).map((curr) => (
                <button
                  key={curr}
                  onClick={() => setCurrency(curr)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    currency === curr
                      ? 'bg-amber-500 text-stone-950 shadow-sm'
                      : 'text-stone-300 hover:text-white'
                  }`}
                >
                  {curr === 'EUR' ? '€ EUR' : curr === 'USD' ? '$ USD' : 'Ar MGA'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative Watermark */}
        <div className="absolute -right-6 -bottom-10 opacity-10 text-amber-500 pointer-events-none select-none text-[180px] font-black">
          Ar
        </div>
      </div>

      {/* Main Interactive Converter Card */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-xl mb-8">
        <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4 items-center">
          {/* Source Currency Input */}
          <div className="bg-stone-50 dark:bg-stone-800/80 p-5 rounded-2xl border border-stone-200 dark:border-stone-700">
            <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-2">
              {language === 'en' ? 'You convert (amount)' : language === 'mg' ? 'Vola ovaina' : 'Vous convertissez (Montant)'}
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="1"
                step="any"
                value={amount}
                onChange={(e) => setAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white bg-transparent border-none focus:outline-none focus:ring-0 font-mono"
              />
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value as 'EUR' | 'USD' | 'MGA')}
                className="p-2.5 text-xs font-bold rounded-xl bg-white dark:bg-stone-700 text-stone-900 dark:text-white border border-stone-300 dark:border-stone-600 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer shrink-0"
              >
                <option value="EUR">EUR (€)</option>
                <option value="USD">USD ($)</option>
                <option value="MGA">MGA (Ariary)</option>
              </select>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <button
              onClick={handleSwap}
              className="p-3.5 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold shadow-lg transition-transform hover:rotate-180 active:scale-95 cursor-pointer"
              title="Inverser les devises"
              aria-label="Inverser les devises"
            >
              <ArrowRightLeft className="w-5 h-5" />
            </button>
          </div>

          {/* Target Converted Value Display */}
          <div className="bg-amber-500/10 dark:bg-amber-500/15 p-5 rounded-2xl border-2 border-amber-500/50">
            <label className="block text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-2">
              {language === 'en' ? 'Equivalent in' : language === 'mg' ? 'Sandany amin\'ny' : 'Équivalent en'} {toCurrency}
            </label>
            <div className="flex items-center justify-between gap-3">
              <div className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white truncate font-mono">
                {convertedValue.toLocaleString('fr-FR')} {toCurrency === 'MGA' ? 'Ar' : toCurrency === 'EUR' ? '€' : '$'}
              </div>
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value as 'EUR' | 'USD' | 'MGA')}
                className="p-2.5 text-xs font-bold rounded-xl bg-white dark:bg-stone-700 text-stone-900 dark:text-white border border-stone-300 dark:border-stone-600 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer shrink-0"
              >
                <option value="MGA">MGA (Ariary)</option>
                <option value="EUR">EUR (€)</option>
                <option value="USD">USD ($)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Quick Amount Chips */}
        <div className="mt-5 pt-4 border-t border-stone-100 dark:border-stone-800 flex flex-wrap items-center gap-2">
          <span className="text-xs text-stone-500 font-semibold mr-1">
            {language === 'en' ? 'Quick benchmarks:' : language === 'mg' ? 'Fiankinan-doha haingana:' : 'Montants types :'}
          </span>
          {[50, 100, 500, 1000, 1390, 5000].map((val) => (
            <button
              key={val}
              onClick={() => {
                setAmount(val);
                setFromCurrency('EUR');
                setToCurrency('MGA');
              }}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-amber-100 dark:hover:bg-amber-950/40 text-stone-700 dark:text-stone-300 hover:text-amber-900 dark:hover:text-amber-300 border border-stone-200 dark:border-stone-700 transition-colors cursor-pointer"
            >
              {val} €
            </button>
          ))}
          <button
            onClick={() => {
              setAmount(1000000);
              setFromCurrency('MGA');
              setToCurrency('EUR');
            }}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-amber-100 dark:hover:bg-amber-950/40 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 transition-colors cursor-pointer"
          >
            1 000 000 Ar
          </button>
        </div>
      </div>

      {/* Real-world Voyage Benchmarks */}
      <div className="mb-8">
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-stone-900 dark:text-white mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>
            {language === 'en'
              ? 'Typical Travel Expenses in Madagascar'
              : language === 'mg'
              ? 'Fandaniana mahazatra amin\'ny dia'
              : 'Repères de prix réels sur place à Madagascar'}
          </span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {presetScenarios.map((sc, idx) => {
            const scTitle = sc.title[language] || sc.title.fr;
            const mgaAmount = sc.eur * RATE_EUR_TO_MGA;
            const usdAmount = Math.round(sc.eur * RATE_EUR_TO_USD);

            return (
              <div
                key={idx}
                onClick={() => {
                  setAmount(sc.eur);
                  setFromCurrency('EUR');
                  setToCurrency('MGA');
                }}
                className="bg-white dark:bg-stone-900 rounded-2xl p-4 border border-stone-200 dark:border-stone-800 hover:border-amber-500/50 shadow-sm transition-all cursor-pointer group"
              >
                <div className="text-xs font-bold text-stone-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400">
                  {scTitle}
                </div>
                <div className="mt-1 text-lg font-black text-amber-600 dark:text-amber-400 font-mono">
                  {sc.eur} € <span className="text-xs font-normal text-stone-400">(${usdAmount})</span>
                </div>
                <div className="text-xs font-bold text-stone-700 dark:text-stone-300 font-mono">
                  ≈ {mgaAmount.toLocaleString('fr-FR')} Ar
                </div>
                <p className="mt-2 text-[10px] text-stone-500 dark:text-stone-400 leading-snug">
                  {sc.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Practical Advice: Money & Banks in Madagascar */}
      <div className="bg-stone-50 dark:bg-stone-900/60 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 space-y-4">
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-stone-900 dark:text-white flex items-center gap-2">
          <Banknote className="w-4 h-4 text-emerald-500" />
          <span>
            {language === 'en'
              ? 'Practical Guide: Money, Cards & Cash in Madagascar'
              : language === 'mg'
              ? 'Torolàlana: Vola, Karatra ary Fanakalozana'
              : 'Guide Pratique : Devises, Cartes Bancaires & Retraits'}
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-stone-600 dark:text-stone-300">
          <div className="space-y-1.5">
            <div className="font-bold text-stone-900 dark:text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-amber-500" />
              <span>Cartes Visa & Mastercard</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Les distributeurs automatiques (GAB/DAB) sont présents dans toutes les grandes villes (Antananarivo, Mahajanga, Antsirabe, Tuléar, Diego-Suarez). Privilégiez les banques BNI, BOA et BFV-SG.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="font-bold text-stone-900 dark:text-white flex items-center gap-2">
              <Banknote className="w-4 h-4 text-amber-500" />
              <span>Coupures en Ariary (MGA)</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Le plus gros billet est le <strong>20 000 Ariary</strong> (environ 4 €). Pensez à toujours garder des petites coupures (1 000, 2 000, 5 000 Ar) pour les pourboires, artisans et marchés de brousse.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="font-bold text-stone-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Bureau de change réceptif</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Le change s'effectue sans problème dès votre arrivée à l'aéroport d'Ivato ou au siège de notre agence à Mahajanga. Nos chauffeurs-guides vous accompagnent pour vos retraits sécurisés.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => {
              if (onClose) onClose();
              setActiveView('circuits');
              const el = document.getElementById('catalogue-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-xl font-bold text-xs hover:bg-stone-800 cursor-pointer transition-colors"
          >
            <Compass className="w-4 h-4" />
            <span>{language === 'en' ? 'Explore tours with live currency' : language === 'mg' ? 'Hijery ny dia amin\'ny vola voafantina' : 'Voir les circuits avec la devise active'}</span>
          </button>

          <button
            onClick={() => {
              if (onClose) onClose();
              openQuoteModal();
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl font-extrabold text-xs shadow-sm cursor-pointer transition-all"
          >
            <span>{language === 'en' ? 'Get a tailor-made quote' : language === 'mg' ? 'Hangataka tombana manokana' : 'Demander une cotation sur mesure'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
