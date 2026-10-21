import React from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, Phone, Mail, Clock, MessageCircle, ShieldCheck } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { t, openQuoteModal } = useApp();

  return (
    <section className="py-16 bg-stone-50 border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="text-xs font-semibold uppercase tracking-wider text-amber-700 mb-2">
            {t('contact.kicker')}
          </div>
          <h2 className="text-3xl font-extrabold text-stone-900 tracking-tight">
            {t('contact.title')}
          </h2>
          <p className="mt-2 text-sm text-stone-600">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Details Card */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-stone-900 border-b border-stone-100 pb-3">
              {t('contact.hqTitle')}
            </h3>

            <div className="space-y-4 text-xs sm:text-sm text-stone-700">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-stone-900 block">{t('contact.hqOffice')}</span>
                  <span className="text-stone-600">{t('contact.address')}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-stone-900 block">{t('contact.phoneLabel')}</span>
                  <a
                    href="tel:+261345861363"
                    className="text-stone-600 hover:text-amber-700 font-medium block"
                  >
                    {t('contact.phone1')} {t('contact.phoneSubtext')}
                  </a>
                  <a
                    href="tel:+261323943234"
                    className="text-stone-600 hover:text-amber-700 block"
                  >
                    {t('contact.phone2')} {t('contact.landlineSubtext')}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-stone-900 block">{t('contact.emailLabel')}</span>
                  <a
                    href={`mailto:${t('contact.email')}`}
                    className="text-amber-700 hover:underline"
                  >
                    {t('contact.email')}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-stone-900 block">{t('contact.hoursLabel')}</span>
                  <span className="text-stone-600">{t('contact.hours')}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-amber-50/80 rounded-xl border border-amber-200 text-xs text-amber-950 flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0" />
              <span className="font-medium">{t('contact.responseCommitment')}</span>
            </div>

            {/* Direct WhatsApp Callout */}
            <a
              href={`https://wa.me/261345861363?text=${encodeURIComponent(t('whatsapp.msg.default'))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{t('contact.whatsappBtn')}</span>
            </a>
          </div>

          {/* Location & Map Visual Representation */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-stone-900 border-b border-stone-100 pb-3">
              {t('contact.presenceTitle')}
            </h3>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {t('contact.presenceDesc')}
            </p>

            <div className="p-5 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-800 block">
                {t('contact.basesTitle')}
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-stone-600">
                <div className="p-2.5 bg-white rounded-lg border border-stone-200">
                  <strong className="block text-stone-900">Mahajanga</strong>
                  <span>{t('contact.base.mahajanga')}</span>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-stone-200">
                  <strong className="block text-stone-900">Antananarivo</strong>
                  <span>{t('contact.base.tana')}</span>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-stone-200">
                  <strong className="block text-stone-900">Morondava</strong>
                  <span>{t('contact.base.morondava')}</span>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-stone-200">
                  <strong className="block text-stone-900">Tuléar / Ifaty</strong>
                  <span>{t('contact.base.tulear')}</span>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-stone-200">
                  <strong className="block text-stone-900">Diego Suarez</strong>
                  <span>{t('contact.base.diego')}</span>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-stone-200">
                  <strong className="block text-stone-900">Nosy Be</strong>
                  <span>{t('contact.base.nosybe')}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <span className="text-xs text-stone-500">
                {t('contact.preferCustom')}
              </span>
              <button
                onClick={() => openQuoteModal()}
                className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer whitespace-nowrap"
              >
                {t('contact.customBtn')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
