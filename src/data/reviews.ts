import { Review } from '../types';

export const REVIEWS: Review[] = [
  {
    id: 'rev-01',
    author: 'Jean-Marc & Sophie Laurent',
    country: 'France',
    tripTaken: {
      fr: 'La Grande Traversée de la RN7 & Isalo (12 jours)',
      en: 'The Classic RN7 Expedition & Isalo (12 days)',
      mg: 'Dia Mamakivaky ny RN7 sy Isalo (12 andro)',
    },
    rating: 5,
    date: 'Septembre 2026',
    comment: {
      fr: 'Un voyage inoubliable orchestré avec une précision remarquable. Notre chauffeur-guide Toky a été d\'une bienveillance exceptionnelle, connaissant chaque recoin de Madagascar. Les piscines naturelles de l\'Isalo et la réserve d\'Anja resteront gravées dans nos mémoires !',
      en: 'An unforgettable expedition arranged with surgical precision. Our driver-guide Toky was remarkably attentive, knowing every hidden trail across Madagascar. Swimming in Isalo\'s canyon pools was pure magic.',
      mg: 'Dia tsy hohadinoina mihitsy ! Toky mpamily sy mpitari-dalana dia tena tsara fanahy sy mahay ny asany. Tena nahafinaritra ny nitsidika an\'Isalo sy Anja.',
    },
    verified: true,
  },
  {
    id: 'rev-02',
    author: 'David & Sarah Jenkins',
    country: 'United Kingdom',
    tripTaken: {
      fr: 'Expédition Tsingy de Bemaraha & Baobabs (8 jours)',
      en: 'Tsingy de Bemaraha Expedition & Baobabs (8 days)',
      mg: 'Dia Fikarohana Tsingy sy Baobab (8 andro)',
    },
    rating: 5,
    date: 'Août 2026',
    comment: {
      fr: 'Les pistes de l\'Ouest peuvent sembler intimidantes, mais avec le 4x4 impeccable et la maîtrise totale des bacs de notre équipe Ravinala Tours, nous nous sommes toujours sentis en parfaite sécurité. Le coucher de soleil sur l\'Allée des Baobabs a dépassé toutes nos espérances.',
      en: 'The rugged tracks of the west could be daunting, but with our sturdy Land Cruiser and our guide\'s effortless handling of river ferries, we felt completely safe. Sunset at the Baobab Avenue exceeded our highest dreams.',
      mg: 'Na mafy aza ny lalan-tany tany Andrefana, ny fiara matanjaka sy ny traikefan\'ny mpamily dia nahatonga anay nilamina tsara foana. Tsara loatra ny masoandro milentika eo amin\'ny Baobab.',
    },
    verified: true,
  },
  {
    id: 'rev-03',
    author: 'Clara & Philippe Moreau',
    country: 'Belgique',
    tripTaken: {
      fr: 'Échappée Tropicale du Nord : Diego Suarez & Nosy Be (10 jours)',
      en: 'Northern Tropical Escape: Diego & Nosy Be (10 days)',
      mg: 'Dia Kanto any Avaratra : Diego sy Nosy Be (10 andro)',
    },
    rating: 5,
    date: 'Juillet 2026',
    comment: {
      fr: 'L\'équilibre parfait entre découverte naturaliste (Tsingy Rouges et Montagne d\'Ambre) et détente absolue sur les îles de Nosy Be. Nager au milieu des tortues géantes à Nosy Tanikely était un rêve d\'enfant devenu réalité.',
      en: 'The quintessential balance between nature discovery (surreal Red Tsingy and Amber Mountain) and pristine beach bliss in Nosy Be. Snorkeling alongside green sea turtles at Tanikely was sublime.',
      mg: 'Fifandanjana tonga lafatra eo amin\'ny fitsidihana zavaboary sy fialan-tsasatra amoron-dranomasina. Mahafinaritra ny niara-nandro tamin\'ny sokatra tao Nosy Tanikely.',
    },
    verified: true,
  },
];
