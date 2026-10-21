import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Download, Printer, Check, FileText, Loader2, Sparkles } from 'lucide-react';
import { jsPDF } from 'jspdf';

export const CatalogPdfModal: React.FC = () => {
  const { catalogPdfModalOpen, setCatalogPdfModalOpen, circuits, language, t } = useApp();
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!catalogPdfModalOpen) return null;

  const modalTitles: Record<string, string> = {
    fr: 'Catalogue Officiel · Ravinala Tours Madagascar (PDF)',
    en: 'Official Tour Catalogue · Ravinala Tours Madagascar (PDF)',
    mg: 'Bokin-tolotra Ôfisialy · Ravinala Tours Madagascar (PDF)',
  };

  const introTitles: Record<string, string> = {
    fr: 'Le spécialiste des expéditions et circuits sur mesure à Madagascar',
    en: 'The specialist in tailor-made expeditions and tours in Madagascar',
    mg: 'Manampahaizana manokana amin\'ny dia sy fikarohana eto Madagasikara',
  };

  const introParagraphs: Record<string, string> = {
    fr: 'Ce catalogue synthétique rassemble notre sélection d\'itinéraires éprouvés sur le terrain. Tous nos circuits s\'effectuent en véhicules 4x4 tout-terrain révisés, conduits par des chauffeurs chevronnés et accompagnés de guides agréés par Madagascar National Parks.',
    en: 'This tour catalogue highlights our tested overland expeditions. All tours operate with inspected 4WD vehicles, skilled local drivers and official certified guides from Madagascar National Parks.',
    mg: 'Ity boky fohy ity dia mirakitra ireo lalam-pitetezana tsara indrindra. Ny dia rehetra dia tanterahina amin\'ny fiara 4x4 voakarakara tsara, miaraka amin\'ny mpamily za-draharaha sy mpitari-dalana nahazo fankatoavana avy amin\'ny Madagascar National Parks.',
  };

  const catalogSectionTitles: Record<string, string> = {
    fr: 'Catalogue Synthétique des Circuits & Tarifs Indicatifs',
    en: 'Expedition Summary & Indicative Rates',
    mg: 'Famintinana ireo Lalam-pitetezana sy Tombam-bidy',
  };

  const bookingTermsTitles: Record<string, string> = {
    fr: 'Conditions de Devis & Réservation :',
    en: 'Quotation & Booking Conditions:',
    mg: 'Fepetra momba ny Tolotra sy Famandrihana :',
  };

  const bookingTerms: Record<string, string[]> = {
    fr: [
      'Les tarifs indiqués sont des prix de base indicatifs par personne en chambre double et peuvent varier selon la saisonnalité et la disponibilité des lodges.',
      'Toute demande de devis fait l\'objet d\'un chiffrage personnalisé gratuit sans engagement sous 24h ouvrées.',
      'Réservation confirmée à réception d\'un acompte de 30% à 50% et signature du contrat de voyage.',
    ],
    en: [
      'Rates listed are indicative per person in twin-share rooms and adjust based on seasonality and lodge availability.',
      'Every quote request receives a free, non-binding bespoke proposal within 24 business hours.',
      'Booking is finalized upon payment of a 30% to 50% deposit and signature of the travel agreement.',
    ],
    mg: [
      'Ny sarany voalaza dia tombam-bidy fototra isan\'olona (efitrano roa) ary mety hiova arakaraka ny vanim-potoana sy ny hotely.',
      'Ny fangatahana tolotra rehetra dia omena valiny maimaim-poana ao anatin\'ny 24 ora fiasana.',
      'Raikitra ny famandrihana rehefa voaloa ny acompte 30% hatramin\'ny 50% ary voasonia ny fifanekena.',
    ],
  };

  const handlePrint = () => {
    try {
      window.print();
    } catch {
      handleDownloadPdf();
    }
  };

  const handleDownloadPdf = () => {
    try {
      setIsGenerating(true);

      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 14;
      const contentWidth = pageWidth - margin * 2;
      let y = margin;

      // Header Banner
      doc.setFillColor(28, 25, 23); // stone-900
      doc.rect(margin, y, contentWidth, 24, 'F');

      // Accent gold stripe
      doc.setFillColor(245, 158, 11); // amber-500
      doc.rect(margin, y + 23, contentWidth, 1.5, 'F');

      // Header Brand
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('RAVINALA TOURS MADAGASCAR', margin + 5, y + 8);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(214, 211, 209);
      doc.text('Agence Receptive Agreee · Licence N* 042-MINTOUR/ED · Mahajanga 401', margin + 5, y + 13.5);
      doc.text('WhatsApp: +261 34 58 613 63 | Email: Mahajanga@tourist.com | Web: ravinala-tours.mg', margin + 5, y + 18.5);

      // Header Right Info
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(245, 158, 11);
      doc.text('CATALOGUE 2026-2027', pageWidth - margin - 5, y + 8, { align: 'right' });
      doc.setTextColor(200, 200, 200);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.text(`Version: ${language.toUpperCase()}`, pageWidth - margin - 5, y + 14, { align: 'right' });
      doc.text('Edition Octobre 2026', pageWidth - margin - 5, y + 18.5, { align: 'right' });

      y += 30;

      // Editorial Intro
      doc.setTextColor(28, 25, 23);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      const heading = introTitles[language] || introTitles.fr;
      doc.text(heading, margin, y);
      y += 5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(68, 64, 60);
      const introTxt = introParagraphs[language] || introParagraphs.fr;
      const splitIntro = doc.splitTextToSize(introTxt, contentWidth);
      doc.text(splitIntro, margin, y);
      y += splitIntro.length * 4 + 4;

      // Section Title
      doc.setFillColor(245, 245, 244);
      doc.rect(margin, y, contentWidth, 7, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(180, 83, 9);
      const secTitle = catalogSectionTitles[language] || catalogSectionTitles.fr;
      doc.text(secTitle.toUpperCase(), margin + 3, y + 5);
      y += 10;

      // Circuits Loop
      circuits.forEach((circ, index) => {
        // Page break if near bottom
        if (y > pageHeight - 38) {
          doc.addPage();
          y = margin;
        }

        const tourTitle = circ.title[language] || circ.title['fr'];
        const tourSummary = circ.summary[language] || circ.summary['fr'];
        const priceStr = circ.basePriceEUR > 0 ? `${circ.basePriceEUR.toLocaleString()} EUR` : 'Sur devis';

        // Card box
        doc.setFillColor(250, 250, 249);
        doc.setDrawColor(229, 231, 235);
        doc.rect(margin, y, contentWidth, 23, 'FD');

        // Tour number & Title
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(28, 25, 23);
        const titleStr = `0${index + 1}. ${tourTitle} [${circ.region}]`;
        const splitTitle = doc.splitTextToSize(titleStr, contentWidth - 45);
        doc.text(splitTitle[0] || titleStr, margin + 3, y + 5);

        // Summary text
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(87, 83, 78);
        const splitSummary = doc.splitTextToSize(tourSummary, contentWidth - 46);
        doc.text(splitSummary.slice(0, 2), margin + 3, y + 10);

        // Route and difficulty info
        doc.setFontSize(7);
        doc.setTextColor(120, 113, 108);
        doc.text(
          `Depart: ${circ.startingPoint} -> Fin: ${circ.endingPoint} | Mode: ${circ.mode.replace('_', ' ')} | Difficulte: ${circ.difficulty}`,
          margin + 3,
          y + 19.5
        );

        // Price block on right
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10.5);
        doc.setTextColor(180, 83, 9);
        doc.text(priceStr, pageWidth - margin - 3, y + 7, { align: 'right' });

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(120, 113, 108);
        doc.text(`${circ.durationDays} Jours / ${circ.durationNights} Nuits`, pageWidth - margin - 3, y + 12, { align: 'right' });
        doc.text('par pers.', pageWidth - margin - 3, y + 16.5, { align: 'right' });

        y += 26;
      });

      // Terms Box
      if (y > pageHeight - 45) {
        doc.addPage();
        y = margin;
      }

      y += 2;
      doc.setFillColor(245, 245, 244);
      doc.setDrawColor(229, 231, 235);
      doc.rect(margin, y, contentWidth, 25, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(28, 25, 23);
      doc.text(bookingTermsTitles[language] || bookingTermsTitles.fr, margin + 3, y + 5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(87, 83, 78);
      const terms = bookingTerms[language] || bookingTerms.fr;
      let termY = y + 9.5;
      terms.forEach((term) => {
        const splitTerm = doc.splitTextToSize(`- ${term}`, contentWidth - 8);
        doc.text(splitTerm, margin + 3, termY);
        termY += splitTerm.length * 3.3;
      });

      // Number pages
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(168, 162, 158);
        doc.text(
          `Ravinala Tours Madagascar · Mahajanga · mahajanga@tourist.com · Tel: +261 34 58 613 63 · Page ${i} / ${totalPages}`,
          pageWidth / 2,
          pageHeight - 7,
          { align: 'center' }
        );
      }

      // Save PDF file to download
      const filename = `catalogue-ravinala-tours-madagascar-${language}.pdf`;
      doc.save(filename);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-6 animate-fadeIn">
      <div className="relative bg-white dark:bg-stone-900 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden border border-stone-200 dark:border-stone-800 flex flex-col max-h-[94vh]">
        {/* Modal Top Bar */}
        <div className="bg-stone-900 text-white px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-stone-800">
          <div className="flex items-center gap-2 min-w-0">
            <FileText className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-xs font-bold tracking-tight truncate">
              {modalTitles[language] || modalTitles.fr}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Direct PDF Download button */}
            <button
              onClick={handleDownloadPdf}
              disabled={isGenerating}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer shadow-sm transition-all hover:scale-[1.02] disabled:opacity-60"
            >
              {isGenerating ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : downloadSuccess ? (
                <Check className="w-3.5 h-3.5 text-emerald-950" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>
                {isGenerating
                  ? 'Génération...'
                  : downloadSuccess
                  ? 'Téléchargé !'
                  : 'Télécharger PDF'}
              </span>
            </button>

            {/* Print button */}
            <button
              onClick={handlePrint}
              className="hidden sm:flex px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-xs items-center gap-1.5 cursor-pointer border border-stone-700 transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-stone-400" />
              <span>Imprimer</span>
            </button>

            {/* Close button */}
            <button
              onClick={() => setCatalogPdfModalOpen(false)}
              className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 cursor-pointer transition-colors"
              aria-label={t('circuit.close')}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Success notification banner */}
        {downloadSuccess && (
          <div className="bg-emerald-600 text-white text-xs px-4 py-2 flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2 font-medium">
              <Check className="w-4 h-4" />
              <span>Le fichier PDF a été généré et téléchargé sur votre appareil avec succès !</span>
            </div>
          </div>
        )}

        {/* PDF Simulated Sheet */}
        <div className="overflow-y-auto p-3 sm:p-8 bg-stone-100 dark:bg-stone-950/60 flex justify-center">
          <div
            id="printable-pdf-catalog"
            className="bg-white w-full max-w-3xl p-6 sm:p-10 shadow-md rounded-xl border border-stone-200 text-stone-900 space-y-7 print:p-0 print:border-none print:shadow-none"
          >
            {/* Header / Brand */}
            <div className="border-b-2 border-stone-900 pb-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-stone-900">
                  RAVINALA TOURS MADAGASCAR
                </span>
                <p className="text-[11px] text-stone-500 font-medium tracking-widest uppercase mt-0.5">
                  Agence Réceptive Agréée · Licence N° 042-MINTOUR/ED · Mahajanga 401
                </p>
                <p className="text-xs text-stone-600 mt-1">
                  Email : Mahajanga@tourist.com | Téléphone : 034 58 613 63 / 032 39 432 34 (WhatsApp: +261 34 58 613 63)
                </p>
                <p className="text-xs text-stone-500">
                  Lieu : Bord de la mer, Boulevard Poincaré, Mahajanga, Madagascar
                </p>
              </div>

              <div className="text-left sm:text-right shrink-0">
                <span className="inline-block text-[11px] font-bold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded">
                  2026-2027
                </span>
                <span className="block text-[11px] text-stone-400 mt-1">
                  Octobre 2026
                </span>
                <span className="block text-[11px] font-semibold text-stone-600 uppercase">
                  {language === 'fr' ? 'Français' : language === 'en' ? 'English' : 'Malagasy'}
                </span>
              </div>
            </div>

            {/* Editorial Introduction */}
            <div>
              <h2 className="text-base sm:text-lg font-bold text-stone-900 mb-1.5">
                {introTitles[language] || introTitles.fr}
              </h2>
              <p className="text-xs text-stone-600 leading-relaxed">
                {introParagraphs[language] || introParagraphs.fr}
              </p>
            </div>

            {/* Circuits Summary List */}
            <div className="space-y-4">
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-800 border-b border-stone-200 pb-1">
                {catalogSectionTitles[language] || catalogSectionTitles.fr}
              </h3>

              {circuits.map((circ, index) => {
                const tourTitle = circ.title[language] || circ.title['fr'];
                const tourSummary = circ.summary[language] || circ.summary['fr'];
                const regionLabel =
                  circ.region === 'Hautes Terres'
                    ? t('region.hautesTerres')
                    : circ.region === 'Sud'
                    ? t('region.sud')
                    : circ.region === 'Ouest'
                    ? t('region.ouest')
                    : circ.region === 'Nord'
                    ? t('region.nord')
                    : circ.region === 'Est'
                    ? t('region.est')
                    : circ.region;

                return (
                  <div
                    key={circ.id}
                    className="p-3.5 sm:p-4 rounded-lg bg-stone-50 border border-stone-200 space-y-2 text-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-stone-900 text-sm">
                            0{index + 1}. {tourTitle}
                          </span>
                          <span className="text-[10px] bg-stone-200 px-1.5 py-0.5 rounded font-medium text-stone-700">
                            {regionLabel}
                          </span>
                        </div>
                        <p className="text-stone-600 mt-1 leading-relaxed">
                          {tourSummary}
                        </p>
                      </div>

                      <div className="text-left sm:text-right shrink-0">
                        <span className="text-base font-extrabold text-stone-900 tabular-nums block">
                          {circ.basePriceEUR > 0 ? `${circ.basePriceEUR.toLocaleString()} €` : t('card.onQuote')}
                        </span>
                        <span className="text-[10px] text-stone-500 block">
                          {circ.durationDays} {t('card.days')} / {circ.durationNights} {t('card.nights')}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-stone-200/80 flex flex-wrap items-center justify-between text-[11px] text-stone-500 gap-1">
                      <span>{t('circuit.startEnd')} {circ.startingPoint} → {circ.endingPoint}</span>
                      <span>{t('circuit.modeLabel')} {circ.mode.replace('_', ' ')} ({circ.difficulty})</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Engagement and Booking Terms */}
            <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 text-[11px] text-stone-600 space-y-1.5">
              <span className="font-bold text-stone-900 block">
                {bookingTermsTitles[language] || bookingTermsTitles.fr}
              </span>
              {(bookingTerms[language] || bookingTerms.fr).map((term, i) => (
                <p key={i}>• {term}</p>
              ))}
            </div>

            {/* Document Footer */}
            <div className="pt-4 border-t border-stone-200 text-center text-[10px] text-stone-400">
              © 2026 Ravinala Tours Madagascar · Mahajanga · Mahajanga@tourist.com · 034 58 613 63 / 032 39 432 34
            </div>
          </div>
        </div>

        {/* Modal Action Bottom Bar */}
        <div className="bg-stone-50 dark:bg-stone-900 px-4 sm:px-6 py-3 border-t border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-stone-500 dark:text-stone-400">
            {language === 'en'
              ? 'PDF document generated dynamically with official rates & circuits.'
              : language === 'mg'
              ? 'Taratasy PDF novokarina ara-dalana miaraka amin\'ny sarany sy lalam-pitetezana.'
              : 'Document PDF généré dynamiquement avec circuits et tarifs officiels.'}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-2 bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-semibold text-xs rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer</span>
            </button>
            <button
              onClick={handleDownloadPdf}
              disabled={isGenerating}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-lg flex items-center gap-1.5 cursor-pointer shadow transition-all hover:scale-[1.02] disabled:opacity-60"
            >
              {isGenerating ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : downloadSuccess ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>{isGenerating ? 'Création en cours...' : 'Télécharger le PDF (.pdf)'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
