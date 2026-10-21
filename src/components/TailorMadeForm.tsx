import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Region, TourTheme, AccommodationLevel, Language } from '../types';
import {
  Send,
  CheckCircle,
  Clock,
  Sparkles,
  Shield,
  HelpCircle,
  Copy,
  Check,
  MessageCircle,
} from 'lucide-react';

interface TailorMadeFormProps {
  prefilledCircuit?: { id: string; title: string } | null;
  onSuccessClose?: () => void;
}

export const TailorMadeForm: React.FC<TailorMadeFormProps> = ({
  prefilledCircuit,
  onSuccessClose,
}) => {
  const { language, t, addQuoteRequest } = useApp();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [commLanguage, setCommLanguage] = useState<Language>(language);

  useEffect(() => {
    setCommLanguage(language);
  }, [language]);
  const [departureDate, setDepartureDate] = useState('');
  const [isDateFlexible, setIsDateFlexible] = useState(true);
  const [durationDays, setDurationDays] = useState(12);
  const [adultsCount, setAdultsCount] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);
  const [childrenAges, setChildrenAges] = useState('');
  const [selectedRegions, setSelectedRegions] = useState<Region[]>(['Sud', 'Hautes Terres']);
  const [selectedThemes, setSelectedThemes] = useState<TourTheme[]>(['nature', 'culture']);
  const [accommodationLevel, setAccommodationLevel] = useState<AccommodationLevel>('charme');
  const [budgetVal, setBudgetVal] = useState<number | ''>(1500);
  const [currency, setCurrency] = useState<'EUR' | 'USD' | 'MGA'>('EUR');
  const [message, setMessage] = useState('');

  // States
  const [submitting, setSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const toggleRegion = (reg: Region) => {
    if (selectedRegions.includes(reg)) {
      setSelectedRegions(selectedRegions.filter((r) => r !== reg));
    } else {
      setSelectedRegions([...selectedRegions, reg]);
    }
  };

  const toggleTheme = (th: TourTheme) => {
    if (selectedThemes.includes(th)) {
      setSelectedThemes(selectedThemes.filter((t) => t !== th));
    } else {
      setSelectedThemes([...selectedThemes, th]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim() || !email.trim()) {
      setErrorMsg(t('custom.validationError'));
      return;
    }

    setSubmitting(true);

    setTimeout(() => {
      const generatedRef = addQuoteRequest({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        language: commLanguage,
        country: country.trim() || undefined,
        targetCircuitId: prefilledCircuit?.id,
        targetCircuitTitle: prefilledCircuit?.title,
        departureDate: departureDate || undefined,
        isDateFlexible,
        durationDays: Number(durationDays) || 10,
        adultsCount: Number(adultsCount) || 1,
        childrenCount: Number(childrenCount) || 0,
        childrenAges: childrenAges.trim() || undefined,
        preferredDestinations: selectedRegions,
        preferredThemes: selectedThemes,
        accommodationLevel,
        budgetEUR: budgetVal ? Number(budgetVal) : undefined,
        currency,
        message: message.trim(),
      });

      setSubmitting(false);
      setSubmittedRef(generatedRef);
    }, 600);
  };

  const handleCopyRef = () => {
    if (submittedRef) {
      navigator.clipboard.writeText(submittedRef);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  if (submittedRef) {
    const waFollowUpText = encodeURIComponent(
      language === 'en'
        ? `Hello Ravinala Tours Mahajanga, here is my quote tracking reference: ${submittedRef}`
        : language === 'mg'
        ? `Manao ahoana Ravinala Tours Mahajanga, ity ny laharana fanaraha-maso ny tolotra nataoko: ${submittedRef}`
        : `Bonjour Ravinala Tours Mahajanga, voici ma référence de devis : ${submittedRef}`
    );

    return (
      <div className="bg-white rounded-2xl p-8 border border-stone-200 shadow-xl max-w-2xl mx-auto text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-8 h-8" />
        </div>

        <div>
          <h3 className="text-2xl font-bold text-stone-900">
            {t('custom.successTitle')}
          </h3>
          <p className="mt-2 text-sm text-stone-600 max-w-lg mx-auto">
            {t('custom.successMessage')}
          </p>
        </div>

        {/* Reference Box */}
        <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 max-w-md mx-auto flex items-center justify-between">
          <div className="text-left">
            <span className="text-xs text-stone-600 block">{t('custom.successRef')}</span>
            <span className="text-lg font-mono font-extrabold text-amber-700 tracking-wider">
              {submittedRef}
            </span>
          </div>

          <button
            onClick={handleCopyRef}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white border border-stone-300 rounded-lg hover:bg-stone-100 text-stone-700 transition-colors cursor-pointer"
          >
            {copiedRef ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copiedRef ? t('custom.copied') : t('custom.copy')}</span>
          </button>
        </div>

        <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={`https://wa.me/261345861363?text=${waFollowUpText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{t('custom.trackWhatsApp')}</span>
          </a>

          {onSuccessClose ? (
            <button
              onClick={onSuccessClose}
              className="w-full sm:w-auto px-5 py-2.5 bg-stone-900 text-white font-semibold text-xs rounded-lg hover:bg-stone-800 transition-colors"
            >
              {t('custom.closeModal')}
            </button>
          ) : (
            <button
              onClick={() => {
                setSubmittedRef(null);
                setFullName('');
                setEmail('');
                setMessage('');
              }}
              className="w-full sm:w-auto px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs rounded-lg transition-colors"
            >
              {t('custom.newRequest')}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-stone-200 shadow-xl overflow-hidden max-w-4xl mx-auto"
    >
      {/* Header Banner */}
      <div className="bg-stone-900 text-white p-6 sm:p-8">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{t('custom.badge')}</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
          {prefilledCircuit ? `${t('custom.quoteRequestFor')} ${prefilledCircuit.title}` : t('custom.title')}
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-stone-300 max-w-2xl">
          {t('custom.subtitle')}
        </p>
      </div>

      <div className="p-6 sm:p-8 space-y-8">
        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
            {errorMsg}
          </div>
        )}

        {/* Section 1: Coordonnées */}
        <div>
          <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider pb-2 border-b border-stone-200 flex items-center justify-between">
            <span>1. {t('custom.step1')}</span>
            <span className="text-[11px] font-normal text-stone-600">{t('custom.requiredNote')}</span>
          </h3>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {t('custom.fullName')} *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ex : Claire & Julien Valéry"
                className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {t('custom.email')} *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ex : famille.valery@gmail.com"
                className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {t('custom.phone')}
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ex : +33 6 12 34 56 78 (WhatsApp)"
                className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {t('custom.country')}
                </label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Ex : France, Suisse..."
                  className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {t('custom.language')}
                </label>
                <select
                  value={commLanguage}
                  onChange={(e) => setCommLanguage(e.target.value as Language)}
                  className="w-full text-sm px-3 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                  <option value="mg">Malagasy</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Projet de Voyage */}
        <div>
          <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider pb-2 border-b border-stone-200">
            2. {t('custom.step2')}
          </h3>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {t('custom.departureDate')}
              </label>
              <input
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <label className="mt-1.5 flex items-center gap-2 text-xs text-stone-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isDateFlexible}
                  onChange={(e) => setIsDateFlexible(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <span>{t('custom.flexibleDates')}</span>
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {t('custom.duration')}
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={durationDays}
                onChange={(e) => setDurationDays(Number(e.target.value))}
                className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {t('custom.adults')}
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={adultsCount}
                  onChange={(e) => setAdultsCount(Number(e.target.value))}
                  className="w-full text-sm px-3 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {t('custom.children')}
                </label>
                <input
                  type="number"
                  min="0"
                  max="15"
                  value={childrenCount}
                  onChange={(e) => setChildrenCount(Number(e.target.value))}
                  className="w-full text-sm px-3 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          {childrenCount > 0 && (
            <div className="mt-3">
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {t('custom.childrenAges')}
              </label>
              <input
                type="text"
                value={childrenAges}
                onChange={(e) => setChildrenAges(e.target.value)}
                placeholder="Ex : 6 ans et 12 ans"
                className="w-full text-sm px-3.5 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          )}

          {/* Preferred Regions Multi-Select */}
          <div className="mt-5">
            <label className="block text-xs font-semibold text-stone-700 mb-2">
              {t('custom.regions')}
            </label>
            <div className="flex flex-wrap gap-2">
              {(['Hautes Terres', 'Sud', 'Ouest', 'Nord', 'Est', 'Îles'] as Region[]).map(
                (reg) => {
                  const active = selectedRegions.includes(reg);
                  const regLabel =
                    reg === 'Hautes Terres'
                      ? t('region.hautesTerres')
                      : reg === 'Sud'
                      ? t('region.sud')
                      : reg === 'Ouest'
                      ? t('region.ouest')
                      : reg === 'Nord'
                      ? t('region.nord')
                      : reg === 'Est'
                      ? t('region.est')
                      : t('region.iles');

                  return (
                    <button
                      type="button"
                      key={reg}
                      onClick={() => toggleRegion(reg)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                        active
                          ? 'bg-amber-50 border-amber-500 text-amber-900 font-semibold'
                          : 'bg-white border-stone-300 text-stone-700 hover:border-stone-400'
                      }`}
                    >
                      {active ? '✓ ' : ''}{regLabel}
                    </button>
                  );
                }
              )}
            </div>
          </div>

          {/* Preferred Themes Multi-Select */}
          <div className="mt-4">
            <label className="block text-xs font-semibold text-stone-700 mb-2">
              {t('custom.themes')}
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'nature' as TourTheme, label: t('custom.theme.nature') },
                { id: 'adventure' as TourTheme, label: t('custom.theme.adventure') },
                { id: 'beach' as TourTheme, label: t('custom.theme.beach') },
                { id: 'culture' as TourTheme, label: t('custom.theme.culture') },
                { id: 'trek' as TourTheme, label: t('custom.theme.trek') },
                { id: 'family' as TourTheme, label: t('custom.theme.family') },
              ].map((thm) => {
                const active = selectedThemes.includes(thm.id);
                return (
                  <button
                    type="button"
                    key={thm.id}
                    onClick={() => toggleTheme(thm.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                      active
                        ? 'bg-amber-50 border-amber-500 text-amber-900 font-semibold'
                        : 'bg-white border-stone-300 text-stone-700 hover:border-stone-400'
                    }`}
                  >
                    {active ? '✓ ' : ''}{thm.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 3: Style & Budget */}
        <div>
          <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider pb-2 border-b border-stone-200">
            3. {t('custom.step3')}
          </h3>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {t('custom.accommodation')}
              </label>
              <select
                value={accommodationLevel}
                onChange={(e) => setAccommodationLevel(e.target.value as AccommodationLevel)}
                className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="eco">{t('custom.accommodation.eco')}</option>
                <option value="charme">{t('custom.accommodation.charme')}</option>
                <option value="confort">{t('custom.accommodation.confort')}</option>
                <option value="luxe">{t('custom.accommodation.luxe')}</option>
              </select>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {t('custom.budget')}
                </label>
                <input
                  type="number"
                  step="50"
                  value={budgetVal}
                  onChange={(e) => setBudgetVal(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="Ex : 1500"
                  className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {t('custom.currency')}
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as 'EUR' | 'USD' | 'MGA')}
                  className="w-full text-sm px-2 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="EUR">EUR (€)</option>
                  <option value="USD">USD ($)</option>
                  <option value="MGA">MGA (Ariary)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              {t('custom.message')}
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t('custom.messagePlaceholder')}
              className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-y"
            />
          </div>
        </div>

        {/* Anti-spam & Privacy note */}
        <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs text-stone-500 flex items-start gap-2">
          <Shield className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>{t('custom.dataPrivacy')}</span>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
          {onSuccessClose && (
            <button
              type="button"
              onClick={onSuccessClose}
              className="px-4 py-2.5 text-xs font-semibold text-stone-600 hover:text-stone-900 cursor-pointer"
            >
              {t('circuit.cancel')}
            </button>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-3 text-xs font-bold text-stone-950 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 rounded-lg shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>{submitting ? t('custom.submitting') : t('custom.submit')}</span>
          </button>
        </div>
      </div>
    </form>
  );
};
