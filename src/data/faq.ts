import { FAQItem } from '../types';

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq-01',
    category: 'preparation',
    question: {
      fr: 'Quelle est la meilleure période pour voyager à Madagascar ?',
      en: 'What is the best season to travel to Madagascar?',
      mg: 'Rahoviana ny fotoana tsara indrindra hanaovana dia eto Madagasikara ?',
    },
    answer: {
      fr: 'La saison sèche s\'étend d\'avril à novembre. C\'est la période idéale pour l\'ensemble des régions (RN7, Tsingy de Bemaraha, Ouest, Nord). Pour l\'observation des baleines à bosse à Sainte-Marie, privilégiez la période de fin juin à fin septembre.',
      en: 'The dry season runs from April through November, offering optimal conditions across most circuits (RN7, Tsingy, Western tracks). For humpback whale watching around Sainte-Marie, late June to late September is optimal.',
      mg: 'Ny main-tany (Aprily hatramin\'ny Novambra) no tena tsara indrindra ho an\'ny lalam-pitetezana rehetra. Ho an\'ny trozona ao Nosy Boraha kosa dia ny faran\'ny Jona ka hatramin\'ny Septambra.',
    },
  },
  {
    id: 'faq-02',
    category: 'sante',
    question: {
      fr: 'Quelles sont les recommandations sanitaires (paludisme, vaccins) ?',
      en: 'What are the health recommendations (malaria, vaccinations)?',
      mg: 'Inona avy ireo torohevitra ara-pahasalamana (tazo, vaksiny) ?',
    },
    answer: {
      fr: 'Un traitement antipaludéen préventif (type Malarone ou Doxycycline) est fortement conseillé sur l\'ensemble du territoire. Prévoyez des répulsifs tropicaux pour la peau et les vêtements. Aucun vaccin n\'est légalement obligatoire (sauf fièvre jaune en cas de provenance d\'une zone endémique), mais les vaccins universels (DTP, Hépatites A et B) doivent être à jour.',
      en: 'Preventive anti-malarial treatment (such as Malarone or Doxycycline) is strongly recommended across Madagascar. Pack tropical-strength mosquito repellents. Universal vaccinations (Tetanus, Hepatitis A & B, Typhoid) are advised.',
      mg: 'Toroana hevitra ny fandraisana fanafody miaro amin\'ny tazomoka sy fampiasana fanafody manala moka. Ilaina koa ny fanavaozana ireo vaksiny mahazatra.',
    },
  },
  {
    id: 'faq-03',
    category: 'logistique',
    question: {
      fr: 'Quel type de bagages privilégier pour les circuits 4x4 ?',
      en: 'What type of luggage is best suited for 4WD overland expeditions?',
      mg: 'Inona ny karazana kitapo mety amin\'ny dia fiara 4x4 ?',
    },
    answer: {
      fr: 'Privilégiez impérativement des sacs de voyage souples (duffel bags) plutôt que des valises rigides volumineuses, afin de faciliter le chargement dans les coffres ou galeries étanches des 4x4 sur les pistes de brousse.',
      en: 'Soft-sided duffel bags are strongly preferred over rigid hard suitcases. They fit smoothly into 4x4 cargo boots and withstand bumpy overland tracks much better.',
      mg: 'Kitapo malefaka no tena tsara fa tsy valizy mafy be, mba hanamora ny fametrahana entana ao anaty fiara 4x4.',
    },
  },
  {
    id: 'faq-04',
    category: 'reservation',
    question: {
      fr: 'Comment se déroule la réservation et le paiement ?',
      en: 'How does the inquiry and booking process work?',
      mg: 'Ahoana ny fomba famandrihana sy fandoavam-bola ?',
    },
    answer: {
      fr: 'Après l\'envoi de votre formulaire, notre conseiller vous fait parvenir un devis détaillé avec le programme jour par jour. Après vos éventuels ajustements et votre accord, un contrat de voyage est émis. Un acompte de 30% à 50% confirme la réservation de vos hébergements et véhicules, le solde étant réglé 30 jours avant le départ ou à l\'arrivée selon l\'accord convenu.',
      en: 'Following your inquiry, our local travel planner prepares a detailed proposal with a day-by-day itinerary. Upon your agreement, a formal travel contract is issued. A deposit of 30% to 50% confirms vehicle and lodge bookings, with the balance due before arrival or upon touchdown.',
      mg: 'Rehefa mandefa ny fangatahanao ianao dia mandefa tolotra antsipiriany izahay. Rehefa manaiky ianao dia manao fifanarahana ary mandoa ampahany mialoha (acompte 30% hatramin\'ny 50%) hanamafisana ny hotely sy ny fiara.',
    },
  },
];
