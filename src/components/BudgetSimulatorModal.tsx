import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Calculator,
  Users,
  Calendar,
  Sparkles,
  Hotel,
  Sun,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Plane,
  Utensils,
  Binoculars,
} from 'lucide-react';

export const BudgetSimulatorModal: React.FC = () => {
  const {
    language,
    isBudgetSimulatorOpen,
    setIsBudgetSimulatorOpen,
    formatPrice,
    currency,
    openQuoteModal,
  } = useApp();

  const [travelers, setTravelers] = useState<number>(2);
  const [days, setDays] = useState<number>(10);
  const [comfortLevel, setComfortLevel] = useState<'bivouac' | 'confort' | 'charme' | 'prestige'>('charme');
  const [season, setSeason] = useState<'basse' | 'moyenne' | 'haute'>('moyenne');
  const [hasDomesticFlight, setHasDomesticFlight] = useState<boolean>(true);
  const [hasFullBoard, setHasFullBoard] = useState<boolean>(false);
  const [hasSpecialistGuide, setHasSpecialistGuide] = useState<boolean>(false);

  if (!isBudgetSimulatorOpen) return null;

  // Realistic travel pricing algorithm
  // Base daily rate per vehicle/chauffeur shared by travelers: ~85 EUR/day
  // Daily lodging & half board per person based on comfort:
  const comfortDailyRates: Record<string, number> = {
    bivouac: 45,
    confort: 65,
    charme: 95,
    prestige: 160,
  };

  const seasonMultipliers: Record<string, number> = {
    basse: 0.9,
    moyenne: 1.0,
    haute: 1.15,
  };

  const baseVehicleDaily = 85;
  const parkAndGuideDaily = 18;

  const totalVehicleCost = baseVehicleDaily * days;
  const lodgingCostPerPerson = comfortDailyRates[comfortLevel] * days * seasonMultipliers[season];
  const parksCostPerPerson = parkAndGuideDaily * days;

  let extrasPerPerson = 0;
  if (hasDomesticFlight) extrasPerPerson += 210; // Vol intérieur Tsaradia/Madagascar Airlines
  if (hasFullBoard) extrasPerPerson += 20 * days; // Déjeuners midi
  if (hasSpecialistGuide) extrasPerPerson += Math.round(150 / travelers); // Guide ornitho partagé

  const baseTripPerPerson =
    totalVehicleCost / Math.max(1, travelers) +
    lodgingCostPerPerson +
    parksCostPerPerson +
    extrasPerPerson;

  const roundedPerPersonEUR = Math.round(baseTripPerPerson / 10) * 10;
  const roundedTotalEUR = roundedPerPersonEUR * travelers;

  const handleApplyToQuote = () => {
    setIsBudgetSimulatorOpen(false);
    openQuoteModal();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-3xl w-full max-h-[92dvh] flex flex-col overflow-hidden border border-stone-200 dark:border-stone-800 shadow-2xl">
        {/* Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white flex items-center justify-between border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 font-bold flex items-center justify-center shadow">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                {language === 'en'
                  ? 'Interactive Travel Cost Estimator'
                  : language === 'mg'
                  ? 'Fikajiana tetibola mialoha'
                  : 'Simulateur de Budget Voyage'}
              </div>
              <h3 className="text-base sm:text-lg font-extrabold text-white">
                {language === 'en'
                  ? 'Customize your stay & preview pricing'
                  : language === 'mg'
                  ? 'Kajio ny saran\'ny dianao manokana'
                  : 'Configurez votre voyage & estimez votre tarif'}
              </h3>
            </div>
          </div>

          <button
            onClick={() => setIsBudgetSimulatorOpen(false)}
            className="p-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          {/* Sliders: Travelers & Days */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Travelers Slider */}
            <div className="bg-stone-50 dark:bg-stone-800/60 p-4 rounded-2xl border border-stone-200 dark:border-stone-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5 uppercase">
                  <Users className="w-4 h-4 text-amber-500" />
                  <span>Voyageurs</span>
                </span>
                <span className="text-sm font-black text-amber-600 dark:text-amber-400 font-mono">
                  {travelers} {travelers > 1 ? 'personnes' : 'personne'}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="8"
                value={travelers}
                onChange={(e) => setTravelers(parseInt(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 font-mono mt-1">
                <span>1 solo</span>
                <span>2 couple</span>
                <span>4 amis</span>
                <span>8 groupe</span>
              </div>
            </div>

            {/* Duration Slider */}
            <div className="bg-stone-50 dark:bg-stone-800/60 p-4 rounded-2xl border border-stone-200 dark:border-stone-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5 uppercase">
                  <Calendar className="w-4 h-4 text-amber-500" />
                  <span>Durée du circuit</span>
                </span>
                <span className="text-sm font-black text-amber-600 dark:text-amber-400 font-mono">
                  {days} jours ({days - 1} nuits)
                </span>
              </div>
              <input
                type="range"
                min="4"
                max="21"
                value={days}
                onChange={(e) => setDays(parseInt(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 font-mono mt-1">
                <span>4j Express</span>
                <span>10j Équilibré</span>
                <span>14j RN7</span>
                <span>21j Grand Tour</span>
              </div>
            </div>
          </div>

          {/* Standing / Comfort level */}
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-2.5 flex items-center gap-2">
              <Hotel className="w-4 h-4 text-amber-500" />
              <span>Gamme d'Hébergement & Confort</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: 'bivouac', label: 'Bivouac & Étape', sub: 'Aventure roots' },
                { id: 'confort', label: 'Confort 3★', sub: 'Hôtels propres' },
                { id: 'charme', label: 'Charme & Écolodge', sub: 'Piscine & nature' },
                { id: 'prestige', label: 'Luxe & Prestige', sub: 'Relais & Châteaux' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setComfortLevel(opt.id as any)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    comfortLevel === opt.id
                      ? 'bg-amber-500 text-stone-950 border-amber-500 font-bold shadow-sm'
                      : 'bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-stone-400'
                  }`}
                >
                  <div className="text-xs">{opt.label}</div>
                  <div className={`text-[10px] ${comfortLevel === opt.id ? 'text-stone-900' : 'text-stone-400'}`}>
                    {opt.sub}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Season Selector */}
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-2.5 flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-500" />
              <span>Période de Voyage (Saisonnalité)</span>
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'basse', label: 'Basse saison', period: 'Janv - Mars (-10%)' },
                { id: 'moyenne', label: 'Moyenne saison', period: 'Avr-Juin / Oct-Nov' },
                { id: 'haute', label: 'Haute saison', period: 'Juil-Sept / Fêtes (+15%)' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSeason(s.id as any)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    season === s.id
                      ? 'bg-stone-900 text-white dark:bg-amber-500 dark:text-stone-950 border-amber-500 font-bold'
                      : 'bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
                  }`}
                >
                  <div className="text-xs">{s.label}</div>
                  <div className="text-[10px] text-stone-400 dark:text-stone-300/80">{s.period}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Optional Extensions Checkboxes */}
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-2.5">
              Options Complémentaires
            </label>
            <div className="space-y-2">
              <label className="flex items-center justify-between p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 cursor-pointer">
                <span className="flex items-center gap-2.5 text-xs text-stone-800 dark:text-stone-200 font-semibold">
                  <Plane className="w-4 h-4 text-amber-500" />
                  <span>Vol intérieur Madagascar Airlines (ex: Tuléar ➔ Tana ou Diego ➔ Tana)</span>
                </span>
                <input
                  type="checkbox"
                  checked={hasDomesticFlight}
                  onChange={(e) => setHasDomesticFlight(e.target.checked)}
                  className="w-4 h-4 accent-amber-500 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 cursor-pointer">
                <span className="flex items-center gap-2.5 text-xs text-stone-800 dark:text-stone-200 font-semibold">
                  <Utensils className="w-4 h-4 text-amber-500" />
                  <span>Option Pension Complète (déjeuners midi en auberges & pique-niques inclus)</span>
                </span>
                <input
                  type="checkbox"
                  checked={hasFullBoard}
                  onChange={(e) => setHasFullBoard(e.target.checked)}
                  className="w-4 h-4 accent-amber-500 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 cursor-pointer">
                <span className="flex items-center gap-2.5 text-xs text-stone-800 dark:text-stone-200 font-semibold">
                  <Binoculars className="w-4 h-4 text-amber-500" />
                  <span>Guide naturaliste & ornithologique bilingue dédié tout au long du parcours</span>
                </span>
                <input
                  type="checkbox"
                  checked={hasSpecialistGuide}
                  onChange={(e) => setHasSpecialistGuide(e.target.checked)}
                  className="w-4 h-4 accent-amber-500 rounded"
                />
              </label>
            </div>
          </div>

          {/* Pricing Output Panel */}
          <div className="bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent dark:from-amber-500/10 rounded-2xl p-5 border-2 border-amber-500 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                Estimation Budgétaire Globale
              </div>
              <div className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white font-mono">
                {formatPrice(roundedPerPersonEUR)}{' '}
                <span className="text-xs font-normal text-stone-500 dark:text-stone-400">/ personne</span>
              </div>
              <div className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                Total groupe ({travelers} pers.) :{' '}
                <strong className="text-stone-800 dark:text-stone-200 font-mono">
                  {formatPrice(roundedTotalEUR)}
                </strong>
              </div>
            </div>

            <button
              onClick={handleApplyToQuote}
              className="inline-flex items-center gap-2 px-5 py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-xs rounded-xl shadow-lg transition-transform hover:scale-105 cursor-pointer"
            >
              <span>Valider ce projet & demander mon devis</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
