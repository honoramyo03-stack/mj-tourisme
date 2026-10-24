import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Language,
  Circuit,
  GuaranteedDeparture,
  Destination,
  QuoteRequest,
  LeadStatus,
  Region,
  TourTheme,
} from '../types';
import { TRANSLATIONS } from '../data/translations';
import { INITIAL_CIRCUITS } from '../data/circuits';
import { INITIAL_DEPARTURES } from '../data/departures';
import { DESTINATIONS } from '../data/destinations';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  circuits: Circuit[];
  departures: GuaranteedDeparture[];
  destinations: Destination[];
  quoteRequests: QuoteRequest[];
  activeView: string;
  setActiveView: (view: string) => void;
  selectedCircuit: Circuit | null;
  setSelectedCircuit: (circuit: Circuit | null) => void;
  selectedDestination: Destination | null;
  setSelectedDestination: (dest: Destination | null) => void;
  quoteModalOpen: boolean;
  setQuoteModalOpen: (open: boolean) => void;
  quotePrefilledCircuit: { id: string; title: string } | null;
  openQuoteModal: (circuit?: { id: string; title: string }) => void;
  catalogPdfModalOpen: boolean;
  setCatalogPdfModalOpen: (open: boolean) => void;
  legalModalType: 'mentions' | 'privacy' | 'cgv' | null;
  setLegalModalType: (type: 'mentions' | 'privacy' | 'cgv' | null) => void;
  isAdminMode: boolean;
  setIsAdminMode: (admin: boolean) => void;
  isAdminAuthenticated: boolean;
  adminLoginModalOpen: boolean;
  setAdminLoginModalOpen: (open: boolean) => void;
  loginAdmin: (password: string, email?: string) => boolean;
  logoutAdmin: () => void;
  adminRole: 'Administrateur' | 'Commercial';
  setAdminRole: (role: 'Administrateur' | 'Commercial') => void;
  addQuoteRequest: (
    req: Omit<QuoteRequest, 'id' | 'createdAt' | 'status' | 'internalNotes'>
  ) => string;
  updateLeadStatus: (id: string, status: LeadStatus) => void;
  addLeadNote: (leadId: string, author: string, note: string) => void;
  assignLead: (leadId: string, assignedTo: string) => void;
  approveLead: (leadId: string, note?: string) => void;
  rejectLead: (leadId: string, reason?: string) => void;
  toggleCircuitFeatured: (circuitId: string) => void;
  duplicateCircuit: (circuitId: string) => void;
  saveCircuit: (circuit: Circuit) => void;
  addCircuit: (circuit: Circuit) => void;
  deleteCircuit: (circuitId: string) => void;
  addDeparture: (dep: Omit<GuaranteedDeparture, 'id'>) => void;
  updateDeparture: (dep: GuaranteedDeparture) => void;
  deleteDeparture: (id: string) => void;
  // Theme & Favorites
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  favorites: string[];
  toggleFavorite: (circuitId: string) => void;
  isFavorite: (circuitId: string) => boolean;
  activeCatalogTab: 'all' | 'departures' | 'excursions' | 'favorites';
  setActiveCatalogTab: (tab: 'all' | 'departures' | 'excursions' | 'favorites') => void;
  // Currency System (EUR, USD, MGA Ariary)
  currency: 'EUR' | 'USD' | 'MGA';
  setCurrency: (curr: 'EUR' | 'USD' | 'MGA') => void;
  formatPrice: (eurAmount: number, forceCurrency?: 'EUR' | 'USD' | 'MGA') => string;
  convertAmount: (amount: number, from: 'EUR' | 'USD' | 'MGA', to: 'EUR' | 'USD' | 'MGA') => number;
  isCurrencyConverterModalOpen: boolean;
  setIsCurrencyConverterModalOpen: (open: boolean) => void;
  // Circuit Comparison System
  comparisonCircuits: Circuit[];
  addToComparison: (circuit: Circuit) => void;
  removeFromComparison: (circuitId: string) => void;
  clearComparison: () => void;
  isComparisonModalOpen: boolean;
  setIsComparisonModalOpen: (open: boolean) => void;
  // Budget Simulator System
  isBudgetSimulatorOpen: boolean;
  setIsBudgetSimulatorOpen: (open: boolean) => void;
  // Filters for Catalog & Dynamic Search Bar
  filters: {
    query: string;
    location: string;
    region: string;
    date: string;
    duration: string;
    theme: string;
    difficulty: string;
    mode: string;
    maxPrice: number;
    sortBy: string;
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    query: string;
    location: string;
    region: string;
    date: string;
    duration: string;
    theme: string;
    difficulty: string;
    mode: string;
    maxPrice: number;
    sortBy: string;
  }>>;
  resetFilters: () => void;
}

const SAMPLE_LEADS: QuoteRequest[] = [
  {
    id: 'DEV-2026-1042',
    createdAt: '2026-10-15T09:20:00Z',
    fullName: 'Laurent & Christine Dupont',
    email: 'c.dupont@orange.fr',
    phone: '+33 6 12 34 56 78',
    language: 'fr',
    country: 'France',
    targetCircuitId: 'circ-01',
    targetCircuitTitle: 'La Grande Traversée de la RN7 & Canyons de l\'Isalo',
    departureDate: '2027-05-10',
    isDateFlexible: true,
    durationDays: 14,
    adultsCount: 2,
    childrenCount: 0,
    preferredDestinations: ['Sud', 'Hautes Terres'],
    preferredThemes: ['nature', 'culture'],
    accommodationLevel: 'charme',
    budgetEUR: 1600,
    currency: 'EUR',
    message: 'Nous fêtons nos 20 ans de mariage. Nous aimons marcher sans trop forcer et souhaitons voir les lémuriens et l\'artisanat local.',
    status: 'contact_etabli',
    assignedTo: 'Mamy (Conseiller Voyage)',
    internalNotes: [
      {
        id: 'note-1',
        date: '2026-10-15 10:30',
        author: 'Mamy',
        note: 'Premier échange WhatsApp constructif. Intéressés par un surclassement à l\'Isalo Rock Lodge.',
      },
      {
        id: 'note-2',
        date: '2026-10-16 14:15',
        author: 'Mamy',
        note: 'Proposition tarifaire avec extension Sainte-Marie en préparation.',
      },
    ],
  },
  {
    id: 'DEV-2026-1039',
    createdAt: '2026-10-14T16:45:00Z',
    fullName: 'Mark & Susan Taylor',
    email: 'mark.taylor.uk@gmail.com',
    phone: '+44 7700 900123',
    language: 'en',
    country: 'United Kingdom',
    targetCircuitId: 'circ-02',
    targetCircuitTitle: 'Expédition Tsingy de Bemaraha & Allée des Baobabs',
    departureDate: '2027-06-04',
    isDateFlexible: false,
    durationDays: 9,
    adultsCount: 4,
    childrenCount: 0,
    preferredDestinations: ['Ouest'],
    preferredThemes: ['adventure', 'nature'],
    accommodationLevel: 'confort',
    budgetEUR: 1300,
    currency: 'EUR',
    message: 'Looking for a private 4x4 expedition for 4 active friends. We want to do the full Grand Tsingy suspension bridge trek.',
    status: 'devis_envoye',
    assignedTo: 'Haingo (Spécialiste Ouest)',
    internalNotes: [
      {
        id: 'note-3',
        date: '2026-10-14 17:00',
        author: 'Haingo',
        note: 'Devis envoyé avec réservation optionnelle du vol retour Morondava.',
      },
    ],
  },
  {
    id: 'DEV-2026-1045',
    createdAt: '2026-10-16T11:10:00Z',
    fullName: 'Andry & Rova Rakotoarisoa',
    email: 'andry.rakoto@gmail.com',
    phone: '+261 34 58 613 63',
    language: 'mg',
    country: 'Madagasikara (Mahajanga)',
    departureDate: '2026-12-20',
    isDateFlexible: true,
    durationDays: 10,
    adultsCount: 2,
    childrenCount: 2,
    childrenAges: '8 ans, 11 ans',
    preferredDestinations: ['Est', 'Îles'],
    preferredThemes: ['beach', 'family', 'nature'],
    accommodationLevel: 'charme',
    budgetEUR: 1400,
    currency: 'EUR',
    message: 'Fialan-tsasatra miaraka amin\'ny ankizy mandritra ny fetin\'ny Krismasy. Tianay ny miala sasatra amoron-dranomasina sy mahita biby.',
    status: 'nouvelle',
    assignedTo: 'À assigner',
    internalNotes: [],
  },
];

const initialFilters = {
  query: '',
  location: 'all',
  region: 'all',
  date: 'all',
  duration: 'all',
  theme: 'all',
  difficulty: 'all',
  mode: 'all',
  maxPrice: 0,
  sortBy: 'default',
};

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('ravinala_lang');
    return saved === 'en' || saved === 'mg' || saved === 'fr' ? saved : 'fr';
  });

  const [activeView, setActiveView] = useState<string>('home');
  const [selectedCircuit, setSelectedCircuit] = useState<Circuit | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [quoteModalOpen, setQuoteModalOpen] = useState<boolean>(false);
  const [quotePrefilledCircuit, setQuotePrefilledCircuit] = useState<{ id: string; title: string } | null>(null);
  const [catalogPdfModalOpen, setCatalogPdfModalOpen] = useState<boolean>(false);
  const [legalModalType, setLegalModalType] = useState<'mentions' | 'privacy' | 'cgv' | null>(null);

  const CIRCUITS_STORAGE_KEY = 'ravinala_circuits_v4_mahajanga';
  const LEADS_STORAGE_KEY = 'ravinala_leads_v4_mahajanga';
  const DEPARTURES_STORAGE_KEY = 'ravinala_departures_v1_mahajanga';
  const FAVORITES_STORAGE_KEY = 'ravinala_favorites_v1';

  // Dark / Light Theme
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('ravinala_theme');
      if (saved === 'dark' || saved === 'light') return saved;
      if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch (e) {}
    return 'light';
  });

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    try {
      localStorage.setItem('ravinala_theme', theme);
      if (typeof document !== 'undefined') {
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    } catch (e) {}
  }, [theme]);

  // Catalog Tab State (all, departures, excursions, favorites)
  const [activeCatalogTab, setActiveCatalogTab] = useState<'all' | 'departures' | 'excursions' | 'favorites'>('all');

  // Favorites state with persistence
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return ['circ-01', 'circ-02'];
  });

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch (e) {}
  }, [favorites]);

  const toggleFavorite = (circuitId: string) => {
    setFavorites((prev) =>
      prev.includes(circuitId) ? prev.filter((id) => id !== circuitId) : [...prev, circuitId]
    );
  };

  const isFavorite = (circuitId: string) => {
    return favorites.includes(circuitId);
  };

  // Currency State (EUR default, USD, MGA Ariary)
  const [currency, setCurrencyState] = useState<'EUR' | 'USD' | 'MGA'>(() => {
    try {
      const saved = localStorage.getItem('ravinala_currency');
      if (saved === 'EUR' || saved === 'USD' || saved === 'MGA') return saved;
    } catch {}
    return 'EUR';
  });

  const setCurrency = (c: 'EUR' | 'USD' | 'MGA') => {
    setCurrencyState(c);
    try {
      localStorage.setItem('ravinala_currency', c);
    } catch {}
  };

  // Real-world official exchange rates:
  // 1 EUR = 4,950 MGA
  // 1 USD = 4,580 MGA
  // 1 EUR = 1.08 USD
  const RATE_EUR_TO_MGA = 4950;
  const RATE_EUR_TO_USD = 1.08;

  const convertAmount = (amount: number, from: 'EUR' | 'USD' | 'MGA', to: 'EUR' | 'USD' | 'MGA'): number => {
    if (from === to || !amount) return amount;
    // Normalize to EUR first
    let inEur = amount;
    if (from === 'MGA') inEur = amount / RATE_EUR_TO_MGA;
    if (from === 'USD') inEur = amount / RATE_EUR_TO_USD;

    // Convert from EUR to target
    if (to === 'EUR') return Math.round(inEur);
    if (to === 'USD') return Math.round(inEur * RATE_EUR_TO_USD);
    if (to === 'MGA') return Math.round(inEur * RATE_EUR_TO_MGA);
    return amount;
  };

  const formatPrice = (eurAmount: number, forceCurrency?: 'EUR' | 'USD' | 'MGA'): string => {
    if (!eurAmount || isNaN(eurAmount) || eurAmount <= 0) return 'Sur devis';
    const targetCurr = forceCurrency || currency;

    if (targetCurr === 'EUR') {
      return `${eurAmount.toLocaleString('fr-FR')} €`;
    }
    if (targetCurr === 'USD') {
      const usd = Math.round(eurAmount * RATE_EUR_TO_USD);
      return `$${usd.toLocaleString('en-US')}`;
    }
    if (targetCurr === 'MGA') {
      const mga = Math.round(eurAmount * RATE_EUR_TO_MGA);
      return `${mga.toLocaleString('fr-FR')} Ar`;
    }
    return `${eurAmount} €`;
  };

  const [isCurrencyConverterModalOpen, setIsCurrencyConverterModalOpen] = useState(false);

  // Circuit Comparison System
  const [comparisonCircuits, setComparisonCircuits] = useState<Circuit[]>([]);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);

  const addToComparison = (circuit: Circuit) => {
    setComparisonCircuits((prev) => {
      if (prev.some((c) => c.id === circuit.id)) return prev;
      if (prev.length >= 3) {
        return [...prev.slice(1), circuit];
      }
      return [...prev, circuit];
    });
  };

  const removeFromComparison = (circuitId: string) => {
    setComparisonCircuits((prev) => prev.filter((c) => c.id !== circuitId));
  };

  const clearComparison = () => {
    setComparisonCircuits([]);
  };

  // Budget Simulator System
  const [isBudgetSimulatorOpen, setIsBudgetSimulatorOpen] = useState(false);

  // Admin state & Authentication
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [adminRole, setAdminRole] = useState<'Administrateur' | 'Commercial'>('Commercial');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('ravinala_admin_auth') === 'true';
    } catch {
      return false;
    }
  });
  const [adminLoginModalOpen, setAdminLoginModalOpen] = useState<boolean>(false);

  const loginAdmin = (password: string, email?: string): boolean => {
    const trimmed = (password || '').trim();
    // Authorized passwords: 'admin123', 'Admin2026@Mahajanga', 'mahajanga2026', 'admin'
    if (
      trimmed === 'admin123' ||
      trimmed === 'Admin2026@Mahajanga' ||
      trimmed === 'admin' ||
      trimmed.toLowerCase() === 'mahajanga' ||
      trimmed.toLowerCase() === 'mahajanga2026'
    ) {
      setIsAdminAuthenticated(true);
      try {
        sessionStorage.setItem('ravinala_admin_auth', 'true');
      } catch (e) {}
      setAdminLoginModalOpen(false);
      setIsAdminMode(true);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    try {
      sessionStorage.removeItem('ravinala_admin_auth');
    } catch (e) {}
    setIsAdminMode(false);
  };

  // Circuits storage - auto-migrated to guarantee complete trilingual data (FR, EN, MG)
  const [circuits, setCircuits] = useState<Circuit[]>(() => {
    try {
      localStorage.removeItem('ravinala_circuits');
      localStorage.removeItem('ravinala_circuits_v2');
      localStorage.removeItem('ravinala_circuits_v3');
      const saved = localStorage.getItem(CIRCUITS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.title?.mg) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to parse saved circuits', e);
    }
    return INITIAL_CIRCUITS;
  });

  // Departures with persistence and mutation support
  const [departures, setDepartures] = useState<GuaranteedDeparture[]>(() => {
    try {
      const saved = localStorage.getItem(DEPARTURES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to parse saved departures', e);
    }
    return INITIAL_DEPARTURES;
  });

  useEffect(() => {
    try {
      localStorage.setItem(DEPARTURES_STORAGE_KEY, JSON.stringify(departures));
    } catch (e) {
      console.error('Failed to save departures', e);
    }
  }, [departures]);

  const addDeparture = (depData: Omit<GuaranteedDeparture, 'id'>) => {
    const newDep: GuaranteedDeparture = {
      ...depData,
      id: `dep-${Date.now().toString(36)}`,
    };
    setDepartures((prev) => [newDep, ...prev]);
  };

  const updateDeparture = (updated: GuaranteedDeparture) => {
    setDepartures((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
  };

  const deleteDeparture = (id: string) => {
    setDepartures((prev) => prev.filter((d) => d.id !== id));
  };

  // Destinations
  const [destinations] = useState<Destination[]>(DESTINATIONS);

  // Quote Requests (Leads)
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>(() => {
    try {
      localStorage.removeItem('ravinala_leads');
      const saved = localStorage.getItem(LEADS_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse saved leads', e);
    }
    return SAMPLE_LEADS;
  });

  // Filters
  const [filters, setFilters] = useState(initialFilters);

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  useEffect(() => {
    localStorage.setItem('ravinala_lang', language);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  useEffect(() => {
    localStorage.setItem(CIRCUITS_STORAGE_KEY, JSON.stringify(circuits));
  }, [circuits]);

  useEffect(() => {
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(quoteRequests));
  }, [quoteRequests]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS['fr']?.[key] || key;
  };

  const openQuoteModal = (circuit?: { id: string; title: string }) => {
    if (circuit) {
      setQuotePrefilledCircuit(circuit);
    } else {
      setQuotePrefilledCircuit(null);
    }
    setQuoteModalOpen(true);
  };

  const addQuoteRequest = (
    req: Omit<QuoteRequest, 'id' | 'createdAt' | 'status' | 'internalNotes'>
  ): string => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newId = `DEV-2026-${randomSuffix}`;
    const newRequest: QuoteRequest = {
      ...req,
      id: newId,
      createdAt: new Date().toISOString(),
      status: 'nouvelle',
      internalNotes: [
        {
          id: `note-${Date.now()}`,
          date: new Date().toLocaleString(),
          author: 'Système',
          note: `Demande reçue via le formulaire ${req.targetCircuitTitle ? `pour le circuit "${req.targetCircuitTitle}"` : 'Voyage sur mesure'}.`,
        },
      ],
    };
    setQuoteRequests((prev) => [newRequest, ...prev]);
    return newId;
  };

  const updateLeadStatus = (id: string, status: LeadStatus) => {
    setQuoteRequests((prev) =>
      prev.map((lead) => {
        if (lead.id === id) {
          return {
            ...lead,
            status,
            internalNotes: [
              ...lead.internalNotes,
              {
                id: `note-${Date.now()}`,
                date: new Date().toLocaleString(),
                author: adminRole,
                note: `Statut modifié en : ${status.replace('_', ' ')}`,
              },
            ],
          };
        }
        return lead;
      })
    );
  };

  const addLeadNote = (leadId: string, author: string, note: string) => {
    if (!note.trim()) return;
    setQuoteRequests((prev) =>
      prev.map((lead) => {
        if (lead.id === leadId) {
          return {
            ...lead,
            internalNotes: [
              ...lead.internalNotes,
              {
                id: `note-${Date.now()}`,
                date: new Date().toLocaleString(),
                author: author || adminRole,
                note: note.trim(),
              },
            ],
          };
        }
        return lead;
      })
    );
  };

  const assignLead = (leadId: string, assignedTo: string) => {
    setQuoteRequests((prev) =>
      prev.map((lead) => {
        if (lead.id === leadId) {
          return {
            ...lead,
            assignedTo,
            internalNotes: [
              ...lead.internalNotes,
              {
                id: `note-${Date.now()}`,
                date: new Date().toLocaleString(),
                author: adminRole,
                note: `Dossier assigné à ${assignedTo}`,
              },
            ],
          };
        }
        return lead;
      })
    );
  };

  const toggleCircuitFeatured = (circuitId: string) => {
    setCircuits((prev) =>
      prev.map((c) => (c.id === circuitId ? { ...c, isFeatured: !c.isFeatured } : c))
    );
  };

  const duplicateCircuit = (circuitId: string) => {
    const existing = circuits.find((c) => c.id === circuitId);
    if (!existing) return;
    const newId = `circ-${Date.now().toString().slice(-4)}`;
    const duplicated: Circuit = {
      ...existing,
      id: newId,
      slug: `${existing.slug}-copie-${Date.now().toString().slice(-3)}`,
      title: {
        fr: `${existing.title.fr} (Copie)`,
        en: `${existing.title.en} (Copy)`,
        mg: `${existing.title.mg} (Dika mitovy)`,
      },
      isFeatured: false,
    };
    setCircuits((prev) => [duplicated, ...prev]);
  };

  const saveCircuit = (updated: Circuit) => {
    setCircuits((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    );
  };

  const addCircuit = (circuit: Circuit) => {
    setCircuits((prev) => [circuit, ...prev]);
  };

  const deleteCircuit = (circuitId: string) => {
    setCircuits((prev) => prev.filter((c) => c.id !== circuitId));
  };

  const approveLead = (leadId: string, note?: string) => {
    setQuoteRequests((prev) =>
      prev.map((lead) => {
        if (lead.id === leadId) {
          return {
            ...lead,
            status: 'acceptee' as LeadStatus,
            internalNotes: [
              ...lead.internalNotes,
              {
                id: `note-${Date.now()}`,
                date: new Date().toLocaleString(),
                author: 'Administrateur',
                note: note
                  ? `[DÉCISION ADMIN : VOYAGE APPROUVÉ] ${note}`
                  : 'Voyage approuvé et confirmé officiellement par l\'Administrateur.',
              },
            ],
          };
        }
        return lead;
      })
    );
  };

  const rejectLead = (leadId: string, reason?: string) => {
    setQuoteRequests((prev) =>
      prev.map((lead) => {
        if (lead.id === leadId) {
          return {
            ...lead,
            status: 'sans_suite' as LeadStatus,
            internalNotes: [
              ...lead.internalNotes,
              {
                id: `note-${Date.now()}`,
                date: new Date().toLocaleString(),
                author: 'Administrateur',
                note: reason
                  ? `[DÉCISION ADMIN : DEMANDE REFUSÉE] Motif : ${reason}`
                  : 'Demande de voyage refusée / classée sans suite par l\'Administrateur.',
              },
            ],
          };
        }
        return lead;
      })
    );
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        circuits,
        departures,
        destinations,
        quoteRequests,
        activeView,
        setActiveView,
        selectedCircuit,
        setSelectedCircuit,
        selectedDestination,
        setSelectedDestination,
        quoteModalOpen,
        setQuoteModalOpen,
        quotePrefilledCircuit,
        openQuoteModal,
        catalogPdfModalOpen,
        setCatalogPdfModalOpen,
        legalModalType,
        setLegalModalType,
        isAdminMode,
        setIsAdminMode,
        isAdminAuthenticated,
        adminLoginModalOpen,
        setAdminLoginModalOpen,
        loginAdmin,
        logoutAdmin,
        adminRole,
        setAdminRole,
        addQuoteRequest,
        updateLeadStatus,
        addLeadNote,
        assignLead,
        approveLead,
        rejectLead,
        toggleCircuitFeatured,
        duplicateCircuit,
        saveCircuit,
        addCircuit,
        deleteCircuit,
        addDeparture,
        updateDeparture,
        deleteDeparture,
        theme,
        toggleTheme,
        favorites,
        toggleFavorite,
        isFavorite,
        activeCatalogTab,
        setActiveCatalogTab,
        currency,
        setCurrency,
        formatPrice,
        convertAmount,
        isCurrencyConverterModalOpen,
        setIsCurrencyConverterModalOpen,
        comparisonCircuits,
        addToComparison,
        removeFromComparison,
        clearComparison,
        isComparisonModalOpen,
        setIsComparisonModalOpen,
        isBudgetSimulatorOpen,
        setIsBudgetSimulatorOpen,
        filters,
        setFilters,
        resetFilters,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
