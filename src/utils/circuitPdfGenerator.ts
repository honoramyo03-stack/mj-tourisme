import { jsPDF } from 'jspdf';
import { Circuit, Language, DayProgram } from '../types';

export function generateSingleCircuitPdf(circuit: Circuit, language: Language = 'fr'): void {
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

  const title = circuit.title[language] || circuit.title['fr'];
  const summary = circuit.summary[language] || circuit.summary['fr'];
  const inclusions = circuit.inclusions[language] || circuit.inclusions['fr'] || [];
  const exclusions = circuit.exclusions[language] || circuit.exclusions['fr'] || [];
  const practicalTips = circuit.practicalTips[language] || circuit.practicalTips['fr'] || [];
  const priceNote = circuit.priceNote[language] || circuit.priceNote['fr'];

  // Top Dark Header Bar
  doc.setFillColor(28, 25, 23); // stone-900
  doc.rect(margin, y, contentWidth, 24, 'F');

  // Accent stripe (amber-500)
  doc.setFillColor(245, 158, 11);
  doc.rect(margin, y + 23, contentWidth, 1.5, 'F');

  // Agency branding
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('RAVINALA TOURS MADAGASCAR', margin + 5, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(214, 211, 209);
  doc.text('Agence Receptive Agreee · Licence N* 042-MINTOUR/ED · Mahajanga 401', margin + 5, y + 13.5);
  doc.text('Mahajanga, Madagascar | WhatsApp: +261 34 58 613 63 | Email: Mahajanga@tourist.com', margin + 5, y + 18.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(245, 158, 11);
  doc.text('FICHE CIRCUIT OFFICIELLE', pageWidth - margin - 5, y + 8, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(200, 200, 200);
  doc.text(`Ref: ${circuit.id.toUpperCase()}`, pageWidth - margin - 5, y + 14, { align: 'right' });
  doc.text(`Edition 2026-2027`, pageWidth - margin - 5, y + 18.5, { align: 'right' });

  y += 29;

  // Circuit Title Banner
  doc.setFillColor(254, 243, 199); // amber-100
  doc.setDrawColor(245, 158, 11);
  doc.roundedRect(margin, y, contentWidth, 18, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(120, 53, 15); // amber-900
  const splitTitle = doc.splitTextToSize(title, contentWidth - 42);
  doc.text(splitTitle[0] || title, margin + 4, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(146, 64, 14);
  doc.text(
    `Region: ${circuit.region} | Duree: ${circuit.durationDays} Jours / ${circuit.durationNights} Nuits | Difficulte: ${circuit.difficulty}`,
    margin + 4,
    y + 13
  );

  // Price on the right
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(180, 83, 9);
  const priceDisplay = circuit.basePriceEUR > 0 ? `${circuit.basePriceEUR.toLocaleString()} EUR` : 'Sur devis';
  doc.text(priceDisplay, pageWidth - margin - 5, y + 8, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(120, 113, 108);
  doc.text('/ personne en ch. double', pageWidth - margin - 5, y + 13, { align: 'right' });

  y += 22;

  // Summary section
  doc.setFillColor(250, 250, 249);
  doc.setDrawColor(229, 231, 235);
  doc.roundedRect(margin, y, contentWidth, 18, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(28, 25, 23);
  doc.text('PRESENTATION DU VOYAGE', margin + 3, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(68, 64, 60);
  const splitSummary = doc.splitTextToSize(summary, contentWidth - 6);
  doc.text(splitSummary.slice(0, 3), margin + 3, y + 9.5);

  y += 22;

  // Key trip parameters strip
  doc.setFillColor(245, 245, 244);
  doc.rect(margin, y, contentWidth, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(68, 64, 60);
  const guides = circuit.guideLanguages ? circuit.guideLanguages.join(', ') : 'Francais, Anglais';
  doc.text(
    `Itineraire: ${circuit.startingPoint} -> ${circuit.endingPoint}  |  Mode: ${circuit.mode.replace('_', ' ')}  |  Guides: ${guides}`,
    margin + 3,
    y + 4.8
  );
  y += 11;

  // Detailed Day-by-Day Itinerary Section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(180, 83, 9);
  doc.text('ITINERAIRE DETAILLE JOUR PAR JOUR', margin, y);
  y += 4;

  const days = circuit.dayProgram || [];
  days.forEach((step: DayProgram) => {
    const dayTitle = step.title[language] || step.title['fr'];
    const dayDesc = step.description[language] || step.description['fr'];
    const lodging = step.lodging || 'Hôtel / Lodge sélectionné';
    const meals = step.meals || 'Petit-déjeuner inclus';

    // Check if new page is needed
    if (y > pageHeight - 32) {
      doc.addPage();
      y = margin;
    }

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(229, 231, 235);
    doc.rect(margin, y, contentWidth, 19, 'FD');

    // Day number bubble
    doc.setFillColor(245, 158, 11);
    doc.rect(margin, y, 14, 19, 'F');
    doc.setTextColor(28, 25, 23);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text(`J${step.day}`, margin + 3.5, y + 7);

    // Day title
    doc.setTextColor(28, 25, 23);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    const splitDayTitle = doc.splitTextToSize(dayTitle, contentWidth - 20);
    doc.text(splitDayTitle[0] || dayTitle, margin + 17, y + 4.5);

    // Day description
    doc.setTextColor(87, 83, 78);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    const splitDesc = doc.splitTextToSize(dayDesc, contentWidth - 20);
    doc.text(splitDesc.slice(0, 2), margin + 17, y + 9);

    // Accommodation & meals
    doc.setFontSize(6.5);
    doc.setTextColor(140, 130, 122);
    doc.text(`Hebergement: ${lodging}  |  Repas: ${meals}`, margin + 17, y + 16.5);

    y += 21;
  });

  // Check page break for Inclusions / Exclusions
  if (y > pageHeight - 50) {
    doc.addPage();
    y = margin;
  }

  y += 2;
  // Inclusions & Exclusions 2-column box
  const colWidth = (contentWidth - 4) / 2;
  doc.setFillColor(245, 245, 244);
  doc.setDrawColor(229, 231, 235);
  doc.rect(margin, y, colWidth, 26, 'FD');
  doc.rect(margin + colWidth + 4, y, colWidth, 26, 'FD');

  // Inclusions
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(16, 120, 70); // green
  doc.text('CE QUI EST INCLUS :', margin + 3, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(68, 64, 60);
  let incY = y + 9;
  inclusions.slice(0, 4).forEach((inc) => {
    const s = doc.splitTextToSize(`+ ${inc}`, colWidth - 6);
    doc.text(s[0] || inc, margin + 3, incY);
    incY += 3.8;
  });

  // Exclusions
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(185, 28, 28); // red
  doc.text('CE QUI N\'EST PAS INCLUS :', margin + colWidth + 7, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(68, 64, 60);
  let excY = y + 9;
  exclusions.slice(0, 4).forEach((exc) => {
    const s = doc.splitTextToSize(`- ${exc}`, colWidth - 6);
    doc.text(s[0] || exc, margin + colWidth + 7, excY);
    excY += 3.8;
  });

  y += 30;

  // Practical Tips Box
  if (practicalTips.length > 0) {
    if (y > pageHeight - 35) {
      doc.addPage();
      y = margin;
    }
    doc.setFillColor(254, 242, 242);
    doc.setDrawColor(254, 202, 202);
    doc.rect(margin, y, contentWidth, 16, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(153, 27, 27);
    doc.text('CONSEILS PRATIQUES & SANTE :', margin + 3, y + 4.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(87, 83, 78);
    let tipY = y + 8.5;
    practicalTips.slice(0, 2).forEach((tip) => {
      const s = doc.splitTextToSize(`* ${tip}`, contentWidth - 6);
      doc.text(s[0] || tip, margin + 3, tipY);
      tipY += 3.5;
    });

    y += 19;
  }

  // Booking CTA Box
  if (y > pageHeight - 25) {
    doc.addPage();
    y = margin;
  }
  doc.setFillColor(28, 25, 23);
  doc.rect(margin, y, contentWidth, 15, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('RESERVATION & DEVIS SUR-MESURE :', margin + 4, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(220, 220, 220);
  doc.text('Contactez nos conseillers specialistes a Mahajanga : mahajanga@tourist.com | WhatsApp: +261 34 58 613 63', margin + 4, y + 10);

  // Page numbering on all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(168, 162, 158);
    doc.text(
      `Ravinala Tours Madagascar · Fiche Circuit: ${circuit.id.toUpperCase()} · Mahajanga · Page ${i} / ${totalPages}`,
      pageWidth / 2,
      pageHeight - 6,
      { align: 'center' }
    );
  }

  const safeFilename = `programme-${circuit.id}-${language}.pdf`;
  doc.save(safeFilename);
}
