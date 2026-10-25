import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Shield } from 'lucide-react';

export const LegalModal: React.FC = () => {
  const { legalModalType, setLegalModalType, language, t } = useApp();

  if (!legalModalType) return null;

  const titles: Record<string, Record<string, string>> = {
    mentions: {
      fr: 'Mentions Légales & Informations Réglementaires',
      en: 'Legal Notice & Regulatory Information',
      mg: 'Fampahafantarana Ara-dalàna & Fitsipika',
    },
    privacy: {
      fr: 'Politique de Confidentialité & Protection des Données',
      en: 'Privacy Policy & Data Protection',
      mg: 'Fiarovana ny Mombamomba sy ny Angona Manokana',
    },
    cgv: {
      fr: 'Conditions Générales de Vente, Réservation et Annulation',
      en: 'General Terms of Service, Booking & Cancellation',
      mg: 'Fepetra Ankapobeny momba ny Fivarotana, Famandrihana ary Fanafoanana',
    },
  };

  const title = titles[legalModalType]?.[language] || titles[legalModalType]?.['fr'];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-fadeIn">
      <div className="bg-white dark:bg-stone-900 max-w-3xl w-full rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col max-h-[92dvh]">
        <div className="bg-stone-900 text-white px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-between border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold tracking-tight">
              {title}
            </h3>
          </div>
          <button
            onClick={() => setLegalModalType(null)}
            className="p-1 text-stone-400 hover:text-white rounded cursor-pointer"
            aria-label={t('circuit.close')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 overflow-y-auto text-xs sm:text-sm text-stone-700 space-y-4 leading-relaxed">
          {legalModalType === 'mentions' && (
            <>
              {language === 'en' ? (
                <>
                  <h4 className="font-bold text-stone-900 text-sm">1. Operator & Publisher</h4>
                  <p>
                    Company Name: Ravinala Tours Madagascar SARL U<br />
                    Head Office: Bord de la mer, Boulevard Poincaré, Mahajanga 401, Madagascar<br />
                    Registration: NIF 4001283912 · STAT 79120 11 2012 0 10294 · RCS Mahajanga 2012 B 00418<br />
                    Inbound Tour Operator License: Category A officially issued by the Ministry of Tourism of Madagascar N° 042-MINTOUR/ED · Mahajanga.<br />
                    Phone: 034 58 613 63 / 032 39 432 34 (WhatsApp: +261 34 58 613 63)<br />
                    Official Email: Mahajanga@tourist.com
                  </p>

                  <h4 className="font-bold text-stone-900 text-sm pt-2">2. Editorial Direction</h4>
                  <p>
                    Director of Publication: Managing Director, contactable at: Mahajanga@tourist.com.
                  </p>

                  <h4 className="font-bold text-stone-900 text-sm pt-2">3. Intellectual Property</h4>
                  <p>
                    All itineraries, wildlife and landscape photography, maps, and texts are protected under international copyright legislation. Any reproduction without prior consent is prohibited.
                  </p>
                </>
              ) : language === 'mg' ? (
                <>
                  <h4 className="font-bold text-stone-900 text-sm">1. Momba ny Orinasa</h4>
                  <p>
                    Anaran\'ny orinasa : Ravinala Tours Madagascar SARL U<br />
                    Foiben-toerana : Moron-dranomasina, Boulevard Poincaré, Mahajanga 401, Madagasikara<br />
                    Fisoratana ara-panjakana : NIF 4001283912 · STAT 79120 11 2012 0 10294 · RCS Mahajanga 2012 B 00418<br />
                    Fahazoan-dàlana A : Navoakan\'ny Minisiteran\'ny Fizahan-tany eto Madagasikara N° 042-MINTOUR/ED · Mahajanga.<br />
                    Finday : 034 58 613 63 / 032 39 432 34 (WhatsApp: +261 34 58 613 63)<br />
                    Mailaka ofisialy : Mahajanga@tourist.com
                  </p>

                  <h4 className="font-bold text-stone-900 text-sm pt-2">2. Mpitantana ny Famoahana</h4>
                  <p>
                    Mpitantana : Ny Mpitantana ankapobeny, azo ifandraisana amin\'ny mailaka : Mahajanga@tourist.com.
                  </p>

                  <h4 className="font-bold text-stone-900 text-sm pt-2">3. Fiarovana ny Zava-bita sy ny Sary</h4>
                  <p>
                    Voaaro ara-dalàna ny lalam-pitetezana rehetra, ny sary tany sy biby ary ny soratra rehetra. Voarara tanteraka ny fanaovana dika mitovy tsy nahazoana alalana.
                  </p>
                </>
              ) : (
                <>
                  <h4 className="font-bold text-stone-900 text-sm">1. Éditeur de la plateforme</h4>
                  <p>
                    Raison sociale : Ravinala Tours Madagascar SARL U<br />
                    Siège social : Bord de la mer, Boulevard Poincaré, Mahajanga 401, Madagascar<br />
                    Immatriculation : NIF 4001283912 · STAT 79120 11 2012 0 10294 · RCS Mahajanga 2012 B 00418<br />
                    Licence d'exploitation d'Agence de Voyages : Catégorie A délivrée par le Ministère du Tourisme de Madagascar N° 042-MINTOUR/ED · Mahajanga.<br />
                    Téléphone : 034 58 613 63 / 032 39 432 34 (WhatsApp : +261 34 58 613 63)<br />
                    Courriel officiel : Mahajanga@tourist.com
                  </p>

                  <h4 className="font-bold text-stone-900 text-sm pt-2">2. Direction de la publication</h4>
                  <p>
                    Directeur de la publication : Le Gérant Réceptif, joignable par e-mail à : Mahajanga@tourist.com.
                  </p>

                  <h4 className="font-bold text-stone-900 text-sm pt-2">3. Propriété intellectuelle</h4>
                  <p>
                    L'ensemble des contenus (itinéraires détaillés, photographies originales de la faune et des paysages malgaches, logos, textes) est protégé par les dispositions relatives aux droits d'auteur et à la propriété intellectuelle. Toute reproduction non autorisée est strictement prohibée.
                  </p>
                </>
              )}
            </>
          )}

          {legalModalType === 'privacy' && (
            <>
              {language === 'en' ? (
                <>
                  <h4 className="font-bold text-stone-900 text-sm">1. Collected Information</h4>
                  <p>
                    Information gathered via our quotation inquiry forms (name, email, phone number, travel preferences, estimated budget) is used exclusively to design, customize and monitor your trip proposal.
                  </p>

                  <h4 className="font-bold text-stone-900 text-sm pt-2">2. Confidentiality & No 3rd-Party Sale</h4>
                  <p>
                    We strictly commit to never selling, renting, or trading your personal data to third parties for commercial advertising. Your contact details are shared solely with required local operational partners (lodges, domestic transport, national parks permits).
                  </p>

                  <h4 className="font-bold text-stone-900 text-sm pt-2">3. Rights of Access & Rectification</h4>
                  <p>
                    In accordance with international data privacy laws, you maintain the full right to access, rectify or delete your personal details by contacting us directly at Mahajanga@tourist.com.
                  </p>
                </>
              ) : language === 'mg' ? (
                <>
                  <h4 className="font-bold text-stone-900 text-sm">1. Angona Angonina</h4>
                  <p>
                    Ny fanazavana voaray amin\'ny alalan\'ny taratasy fangatahana tolotra (anarana, mailaka, finday, hetahetam-pitetezana) dia ampiasaina hikarakarana sy hanamboarana ny dianao manokana ihany.
                  </p>

                  <h4 className="font-bold text-stone-900 text-sm pt-2">2. Tsiambaratelo</h4>
                  <p>
                    Tsy amidy na omena orinasa hafa mihitsy ny mombamomba anao. Ireo mpiara-miasa mivantana amin\'ny dianao ihany (hotely, valan-javaboary) no mahazo ny fampahalalana ilaina amin\'ny dianao.
                  </p>

                  <h4 className="font-bold text-stone-900 text-sm pt-2">3. Zon\'ny Mpitsidika</h4>
                  <p>
                    Manan-jo feno ianao hanamarina na hamafa ny mombamomba anao amin\'ny alalan\'ny fandefasana hafatra amin\'ny mailaka : Mahajanga@tourist.com.
                  </p>
                </>
              ) : (
                <>
                  <h4 className="font-bold text-stone-900 text-sm">1. Données collectées</h4>
                  <p>
                    Les informations recueillies via les formulaires de demande de devis (nom, e-mail, téléphone, préférences de voyage, budget indicatif) sont uniquement destinées à l'élaboration et au suivi de vos propositions personnalisées de séjour.
                  </p>

                  <h4 className="font-bold text-stone-900 text-sm pt-2">2. Confidentialité & Absence de cession</h4>
                  <p>
                    Nous nous engageons formellement à ne jamais commercialiser, louer ou céder vos données personnelles à des organismes tiers à des fins de prospection publicitaire. Vos coordonnées ne sont transmises qu'aux prestataires locaux indispensables à la bonne exécution de votre voyage (hébergeurs, compagnies maritimes intérieures, parcs nationaux).
                  </p>

                  <h4 className="font-bold text-stone-900 text-sm pt-2">3. Droit d'accès et de rectification</h4>
                  <p>
                    Conformément aux réglementations internationales de protection des données, vous disposez d'un droit d'accès, de rectification et de suppression de vos données en adressant une simple demande à Mahajanga@tourist.com.
                  </p>
                </>
              )}
            </>
          )}

          {legalModalType === 'cgv' && (
            <>
              {language === 'en' ? (
                <>
                  <h4 className="font-bold text-stone-900 text-sm">1. Quotation Request & Contract Formation</h4>
                  <p>
                    An online quote request entails no financial obligation and does not constitute a confirmed booking. A booking becomes binding only after written acceptance of the travel proposal, signing of the contract, and payment of the required deposit.
                  </p>

                  <h4 className="font-bold text-stone-900 text-sm pt-2">2. Payment Terms</h4>
                  <p>
                    • 30% to 50% deposit upon firm booking confirmation.<br />
                    • Balance payable 30 calendar days before arrival date, or upon arrival in foreign currency (EUR/USD) or Ariary as agreed contractually.
                  </p>

                  <h4 className="font-bold text-stone-900 text-sm pt-2">3. Cancellation Policy</h4>
                  <p>
                    In the event of cancellation by traveler:<br />
                    • More than 45 days before departure: non-refundable direct costs incurred (domestic flights, special park permits).<br />
                    • 44 to 30 days before departure: 30% of total amount retained.<br />
                    • 29 to 15 days before departure: 50% of total amount retained.<br />
                    • Less than 15 days or no-show: 100% of total amount.
                  </p>
                </>
              ) : language === 'mg' ? (
                <>
                  <h4 className="font-bold text-stone-900 text-sm">1. Fangatahana Tolotra sy Fifanekena</h4>
                  <p>
                    Tsy misy fandoavam-bola ny fangatahana tolotra an-tserasera. Tsy raikitra ny famandrihana raha tsy efa voasonia ny fifanarahana ary voaloa ny ampahany voalohany amin\'ny sarany (acompte).
                  </p>

                  <h4 className="font-bold text-stone-900 text-sm pt-2">2. Fandoavam-bola</h4>
                  <p>
                    • 30% hatramin\'ny 50% amin\'ny sarany rehefa manamafy ny famandrihana.<br />
                    • Ny ambiny aloa 30 andro mialohan\'ny fiaingana na rehefa tonga eto an-toerana araka ny fifanarahana.
                  </p>

                  <h4 className="font-bold text-stone-900 text-sm pt-2">3. Fepetra Fanafoanana</h4>
                  <p>
                    Raha manafoana ny diany ny mpandeha :<br />
                    • Mihoatra ny 45 andro mialoha : fandaniana tsy azo averina efa natao (tapakila fiaramanidina anatiny).<br />
                    • 44 hatramin\'ny 30 andro : 30% amin\'ny totalim-bidy.<br />
                    • 29 hatramin\'ny 15 andro : 50% amin\'ny totalim-bidy.<br />
                    • Latsaky ny 15 andro : 100% amin\'ny totalim-bidy.
                  </p>
                </>
              ) : (
                <>
                  <h4 className="font-bold text-stone-900 text-sm">1. Demande de devis et Formation du contrat</h4>
                  <p>
                    La simple demande de devis en ligne n'emporte aucune obligation financière et ne constitue pas une réservation confirmée. La réservation définitive n'intervient qu'après acceptation écrite du devis descriptif, signature du contrat de voyage et versement de l'acompte prévu.
                  </p>

                  <h4 className="font-bold text-stone-900 text-sm pt-2">2. Modalités de paiement</h4>
                  <p>
                    • Acompte de 30% à 50% du montant total à la confirmation ferme du dossier.<br />
                    • Règlement du solde 30 jours calendaires avant la date d'arrivée, ou à l'arrivée en devises (EUR/USD) ou Ariary selon l'accord contractuel particulier.
                  </p>

                  <h4 className="font-bold text-stone-900 text-sm pt-2">3. Barème d'annulation</h4>
                  <p>
                    En cas d'annulation du fait du voyageur :<br />
                    • Plus de 45 jours avant le départ : conservation des frais réels non remboursables déjà engagés (vols intérieurs émis, permis parcs spéciaux).<br />
                    • De 44 à 30 jours : 30% du montant total conservé.<br />
                    • De 29 à 15 jours : 50% du montant total.<br />
                    • Moins de 15 jours ou non-présentation : 100% du montant total.
                  </p>
                </>
              )}
            </>
          )}
        </div>

        <div className="bg-stone-100 px-6 py-3 border-t border-stone-200 text-right">
          <button
            onClick={() => setLegalModalType(null)}
            className="px-4 py-2 bg-stone-900 text-white font-semibold text-xs rounded-lg hover:bg-stone-800 cursor-pointer"
          >
            {t('circuit.close')}
          </button>
        </div>
      </div>
    </div>
  );
};
