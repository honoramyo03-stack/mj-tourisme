export type Language = 'fr' | 'en' | 'mg';

export type Region = 'Hautes Terres' | 'Sud' | 'Ouest' | 'Nord' | 'Est' | 'Îles';

export type TourTheme = 'nature' | 'trek' | 'beach' | 'culture' | 'family' | 'adventure';

export type TourDifficulty = 'facile' | 'modérée' | 'soutenue';

export type TourMode = 'prive' | 'groupe' | 'depart_garanti';

export interface DayProgram {
  day: number;
  title: Record<Language, string>;
  description: Record<Language, string>;
  lodging: string;
  meals: string;
  highlights: string[];
}

export interface Circuit {
  id: string;
  slug: string;
  title: Record<Language, string>;
  summary: Record<Language, string>;
  mainImage: string;
  gallery: string[];
  durationDays: number;
  durationNights: number;
  region: Region;
  theme: TourTheme;
  difficulty: TourDifficulty;
  mode: TourMode;
  startingPoint: string;
  endingPoint: string;
  basePriceEUR: number;
  priceNote: Record<Language, string>;
  isFeatured: boolean;
  dayProgram: DayProgram[];
  inclusions: Record<Language, string[]>;
  exclusions: Record<Language, string[]>;
  practicalTips: Record<Language, string[]>;
  guideLanguages: string[];
  translationStatus: Record<Language, 'published' | 'draft' | 'to_review'>;
}

export interface GuaranteedDeparture {
  id: string;
  circuitId: string;
  circuitSlug: string;
  circuitTitle: Record<Language, string>;
  startDate: string;
  endDate: string;
  capacityTotal: number;
  seatsBooked: number;
  minParticipants: number;
  priceEUR: number;
  status: 'ouvert' | 'presque_complet' | 'confirme' | 'complet';
}

export interface Destination {
  id: string;
  slug: string;
  name: Record<Language, string>;
  region: Region;
  description: Record<Language, string>;
  image: string;
  highlights: Record<Language, string[]>;
  bestPeriod: Record<Language, string> | string;
  practicalInfo: Record<Language, string>;
  associatedCircuitSlugs: string[];
}

export type AccommodationLevel = 'eco' | 'charme' | 'confort' | 'luxe';

export type LeadStatus =
  | 'nouvelle'
  | 'a_traiter'
  | 'contact_etabli'
  | 'devis_envoye'
  | 'acceptee'
  | 'sans_suite';

export interface InternalNote {
  id: string;
  date: string;
  author: string;
  note: string;
}

export interface QuoteRequest {
  id: string; // e.g. "DEV-2026-8412"
  createdAt: string;
  fullName: string;
  email: string;
  phone?: string;
  language: Language;
  country?: string;
  targetCircuitId?: string;
  targetCircuitTitle?: string;
  departureDate?: string;
  isDateFlexible: boolean;
  durationDays: number;
  adultsCount: number;
  childrenCount: number;
  childrenAges?: string;
  preferredDestinations: Region[];
  preferredThemes: TourTheme[];
  accommodationLevel: AccommodationLevel;
  budgetEUR?: number;
  currency: 'EUR' | 'USD' | 'MGA';
  message: string;
  status: LeadStatus;
  assignedTo?: string;
  internalNotes: InternalNote[];
}

export interface Review {
  id: string;
  author: string;
  country: string;
  tripTaken: Record<Language, string>;
  rating: number;
  date: string;
  comment: Record<Language, string>;
  verified: boolean;
}

export interface FAQItem {
  id: string;
  category: 'preparation' | 'reservation' | 'sante' | 'logistique';
  question: Record<Language, string>;
  answer: Record<Language, string>;
}
