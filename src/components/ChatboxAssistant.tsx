import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  RotateCcw,
  ExternalLink,
  Calendar,
  Compass,
  FileText,
  PhoneCall,
  CheckCircle2,
  ChevronRight,
  HelpCircle,
  Clock,
  MapPin,
  Languages,
  Map,
  Coins,
  Calculator,
} from 'lucide-react';
import { Circuit, Language } from '../types';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  actionButtons?: {
    label: string;
    action: () => void;
    icon?: 'circuit' | 'quote' | 'pdf' | 'departures' | 'whatsapp' | 'filter' | 'map' | 'converter' | 'calculator';
  }[];
}

// Robust language detection heuristic for Malagasy, English, and French
export const detectQueryLanguage = (rawText: string, fallbackLanguage: Language): Language => {
  const t = rawText.toLowerCase().trim();

  // Malagasy vocabulary & grammatical markers
  const mgKeywords = [
    'manao ahoana', 'salama', 'akory', 'inona', 'iza', 'aiza', 'oviana', 'rahoviana',
    'ahoana', 'nahoana', 'misy', 'firy', 'ohatrinona', 'misaotra', 'aza fady', 'tsara',
    'lalam-pitetezana', 'lalana', 'dia', 'vidiny', 'sarany', 'tetibola', 'fahasalamana',
    'famandrihana', 'tombana', 'masoivoho', 'fiara', 'mpamily', 'hafatra', 'torolalana',
    'torolàlana', 'vanim-potoana', 'toetrandro', 'orana', 'mahamay', 'morondava', 'mahajanga',
    'antsirabe', 'tulear', 'toliara', 'toamasina', 'tamatave', 'nosy be', 'baleine',
    'trozona', 'baobaba', 'gidro', 'tsingy', 'isalo', 'renivohitra', 'malagasy', 'gasy',
    'amin\'ny', 'an\'ny', 'ho an\'ny', 'momba', 'rehefa', 'izahay', 'ianao', 'izy',
    'ireo', 'eto', 'any', 'hividy', 'handoa', 'boky', 'sarintany', 'sarin-tany', 'valan-javaboary',
    'mora', 'mafy', 'antonony', 'fitsidihana'
  ];

  // English vocabulary & grammatical markers
  const enKeywords = [
    'hello', 'hi ', 'hey', 'good morning', 'good evening', 'how ', 'what ', 'where ', 'when ',
    'why ', 'who ', 'can you', 'could you', 'would you', 'is there', 'are there', 'please',
    'thank', 'price', 'prices', 'cost', 'budget', 'quote', 'tour', 'tours', 'trip', 'trips',
    'circuit', 'circuits', 'book', 'booking', 'reserve', 'reservation', 'departure',
    'departures', 'guaranteed', 'weather', 'climate', 'season', 'best time', 'visa', 'visas',
    'health', 'malaria', 'safe', 'safety', 'contact', 'phone', 'email', 'driver', 'guide',
    'car', 'rental', '4wd', 'itinerary', 'days', 'nights', 'lemur', 'lemurs', 'whale',
    'whales', 'beach', 'beaches', 'recommend', 'flight', 'flights', 'english', 'help',
    'map', 'easy', 'moderate', 'challenging', 'hiking', 'trek'
  ];

  // French vocabulary & grammatical markers
  const frKeywords = [
    'bonjour', 'bonsoir', 'salut', 'comment', 'combien', 'quel', 'quelle', 'quels', 'quelles',
    'où', 'ou ', 'quand', 'pourquoi', 'qui ', 'est-ce', 'pouvez-vous', 'pourriez-vous',
    'merci', 's\'il vous', 'svp', 'prix', 'tarif', 'tarifs', 'coût', 'cout', 'budget',
    'devis', 'circuit', 'circuits', 'voyage', 'voyages', 'séjour', 'sejour', 'réserver',
    'reserver', 'réservation', 'reservation', 'départ', 'depart', 'départs', 'garanti',
    'météo', 'meteo', 'climat', 'saison', 'meilleure', 'visas', 'santé', 'sante',
    'paludisme', 'contact', 'téléphone', 'telephone', 'adresse', 'chauffeur', 'voiture',
    'véhicule', 'parc', 'lémuriens', 'baobabs', 'balade', 'aide', 'carte', 'tracé',
    'facile', 'modérée', 'soutenue', 'baleines'
  ];

  let mgScore = 0;
  let enScore = 0;
  let frScore = 0;

  for (const kw of mgKeywords) {
    if (t.includes(kw)) {
      mgScore += kw.includes(' ') ? 3 : 1.5;
    }
  }

  for (const kw of enKeywords) {
    if (t.includes(kw)) {
      enScore += kw.includes(' ') ? 3 : 1.5;
    }
  }

  for (const kw of frKeywords) {
    if (t.includes(kw)) {
      frScore += kw.includes(' ') ? 3 : 1.5;
    }
  }

  if (mgScore > 0 && mgScore >= enScore && mgScore >= frScore) return 'mg';
  if (enScore > 0 && enScore > mgScore && enScore >= frScore) return 'en';
  if (frScore > 0 && frScore > mgScore && frScore >= enScore) return 'fr';

  return fallbackLanguage;
};

export const ChatboxAssistant: React.FC = () => {
  const {
    language,
    t,
    circuits,
    departures,
    setSelectedCircuit,
    openQuoteModal,
    setCatalogPdfModalOpen,
    setActiveView,
    setFilters,
    convertAmount,
    setIsBudgetSimulatorOpen,
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const [chatLanguage, setChatLanguage] = useState<Language>(language);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Sync default chat language when main app language changes
  useEffect(() => {
    setChatLanguage(language);
  }, [language]);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setUnreadCount(0);
    }
  }, [messages, isOpen]);

  // Initial welcome message according to active chat language
  useEffect(() => {
    const welcomeText =
      chatLanguage === 'mg'
        ? "Manao ahoana ary tonga soa! Izaho no mpanampy virtoaly an'ny Ravinala Tours Madagascar. Mahay ny teny Malagasy, Frantsay ary Anglisy aho. Afaka manampy anao amin'ny fisafidianana lalam-pitetezana, fiaingana azo antoka 2026-2027, sarin-tany, sarany, toetrandro, ary fangatahana tombana maimaim-poana. Inona no tianao ho fantatra?"
        : chatLanguage === 'en'
        ? "Hello and welcome! I am your Ravinala Tours Madagascar virtual travel advisor. I can assist you fluently in English, French, and Malagasy. I have full knowledge of our 2026-2027 guaranteed departures, circuit itineraries, pricing, interactive map, and custom quotes. How may I help you today?"
        : "Bonjour et tonga soa ! Je suis l'assistant virtuel de Ravinala Tours Madagascar. Je réponds à toutes vos questions en français, malagasy ou anglais. J'ai accès à l'ensemble du site : circuits détaillés, calendrier des départs garantis 2026-2027, carte interactive des tracés, météo, visas et devis gratuits. Que souhaitez-vous découvrir ?";

    setMessages([
      {
        id: 'msg-welcome',
        sender: 'bot',
        text: welcomeText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionButtons: [
          {
            label:
              chatLanguage === 'mg'
                ? 'Hijery ireo lalam-pitetezana'
                : chatLanguage === 'en'
                ? 'Explore all tours'
                : 'Découvrir nos circuits',
            action: () => {
              setActiveView('circuits');
              const el = document.getElementById('catalogue-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            },
            icon: 'circuit',
          },
          {
            label:
              chatLanguage === 'mg'
                ? 'Sarin-tany ifandrimbonana'
                : chatLanguage === 'en'
                ? 'Interactive route map'
                : 'Carte interactive des tracés',
            action: () => {
              setActiveView('circuits');
              const el = document.getElementById('catalogue-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            },
            icon: 'map',
          },
          {
            label:
              chatLanguage === 'mg'
                ? 'Fiaingana azo antoka 2026-2027'
                : chatLanguage === 'en'
                ? 'Guaranteed Departures 2026-2027'
                : 'Départs garantis 2026-2027',
            action: () => setActiveView('departures'),
            icon: 'departures',
          },
          {
            label:
              chatLanguage === 'mg'
                ? 'Hangataka tombana maimaim-poana'
                : chatLanguage === 'en'
                ? 'Free tailor-made quote'
                : 'Devis sur mesure gratuit',
            action: () => openQuoteModal(),
            icon: 'quote',
          },
        ],
      },
    ]);
  }, [chatLanguage]);

  // Quick suggested questions translated for active chat language
  const quickSuggestions = [
    {
      q:
        chatLanguage === 'mg'
          ? "Ohatrinona ny 100€ na 100$ amin'ny Ariary?"
          : chatLanguage === 'en'
          ? "Convert 100€ or 100$ to Malagasy Ariary?"
          : "Convertir 100€ ou 100$ en Ariary ?",
    },
    {
      q:
        chatLanguage === 'mg'
          ? "Inona ireo dia hahitana gidro sy baobaba?"
          : chatLanguage === 'en'
          ? "Which tours feature lemurs & baobabs?"
          : "Quels circuits pour voir lémuriens et baobabs ?",
    },
    {
      q:
        chatLanguage === 'mg'
          ? "Ohatrinona ny vidiny sy ny tetibola ilaina?"
          : chatLanguage === 'en'
          ? "What are the tour prices and budget?"
          : "Quel est le budget moyen d'un voyage ?",
    },
    {
      q:
        chatLanguage === 'mg'
          ? "Ahoana ny fiasan'ny sarin-tany ifandrimbonana?"
          : chatLanguage === 'en'
          ? "How does the interactive route map work?"
          : "Comment fonctionne la carte interactive des tracés ?",
    },
    {
      q:
        chatLanguage === 'mg'
          ? "Ahoana ny famandrihana fiaingana azo antoka?"
          : chatLanguage === 'en'
          ? "How to book a guaranteed departure?"
          : "Comment réserver un départ garanti ?",
    },
    {
      q:
        chatLanguage === 'mg'
          ? "Rahoviana ny vanim-potoana tsara indrindra?"
          : chatLanguage === 'en'
          ? "Best season and weather to travel?"
          : "Quelle est la meilleure saison pour partir ?",
    },
    {
      q:
        chatLanguage === 'mg'
          ? "Ahoana ny fifandraisana amin'ny masoivoho Mahajanga?"
          : chatLanguage === 'en'
          ? "How to contact the Mahajanga agency?"
          : "Où se trouve l'agence et comment vous contacter ?",
    },
  ];

  // Multilingual Knowledge Matching Engine responding in target language
  const processQuery = (
    rawQuery: string,
    targetLang: Language
  ): { response: string; buttons?: ChatMessage['actionButtons'] } => {
    const q = rawQuery.toLowerCase().trim();

    // 0. Greetings / Tonga soa / Hello
    if (
      q === 'manao ahoana' ||
      q === 'salama' ||
      q === 'akory' ||
      q === 'hello' ||
      q === 'hi' ||
      q === 'hey' ||
      q === 'bonjour' ||
      q === 'bonsoir' ||
      q === 'salut'
    ) {
      if (targetLang === 'mg') {
        return {
          response:
            "Manao ahoana ary tonga soa tompoko! Faly miarahaba anao ny mpanampy virtoaly an'ny Ravinala Tours. Afaka mamaly anao amin'ny teny Malagasy tanteraka aho. Inona no tianao ho fantatra androany momba ny lalam-pitetezanay, ny fiaingana azo antoka 2026-2027, na ny sarin-tany?",
          buttons: [
            {
              label: 'Hijery ny lisitry ny dia',
              action: () => {
                setActiveView('circuits');
                const el = document.getElementById('catalogue-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              },
              icon: 'circuit',
            },
            {
              label: 'Hangataka tombana maimaim-poana',
              action: () => openQuoteModal(),
              icon: 'quote',
            },
          ],
        };
      }
      if (targetLang === 'en') {
        return {
          response:
            "Hello and warm welcome! I am your Ravinala Tours Madagascar virtual assistant, happy to assist you in English. I can provide details on itineraries, pricing, wildlife tours, 2026-2027 guaranteed departures, or prepare a custom quote. How can I help you plan your journey?",
          buttons: [
            {
              label: 'Explore all circuits',
              action: () => {
                setActiveView('circuits');
                const el = document.getElementById('catalogue-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              },
              icon: 'circuit',
            },
            {
              label: 'Get a free quote',
              action: () => openQuoteModal(),
              icon: 'quote',
            },
          ],
        };
      }
      return {
        response:
          "Bonjour et bienvenue chez Ravinala Tours Madagascar ! Je suis à votre entière disposition pour vous guider à travers notre catalogue de voyages, nos départs garantis 2026-2027, notre carte interactive et nos conseils d'experts réceptifs. Que puis-je faire pour vous ?",
        buttons: [
          {
            label: 'Découvrir nos circuits',
            action: () => {
              setActiveView('circuits');
              const el = document.getElementById('catalogue-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            },
            icon: 'circuit',
          },
          {
            label: 'Demander un devis gratuit',
            action: () => openQuoteModal(),
            icon: 'quote',
          },
        ],
      };
    }

    // 1. Lemurs / Baobabs / Faune / Biby
    if (
      q.includes('lémur') ||
      q.includes('lemur') ||
      q.includes('gidro') ||
      q.includes('baobab') ||
      q.includes('faune') ||
      q.includes('animaux') ||
      q.includes('biby')
    ) {
      return {
        response:
          targetLang === 'mg'
            ? "Maro ireo lalam-pitetezana ahitana gidro sy baobaba:\n• 'La Grande Traversée RN7 & Isalo' (12 andro): Maki Catta, Sifaka, Andasibe Indri-Indri.\n• 'Descente Tsiribihina & Tsingy Bemaraha' (9 andro): Lalan'ny Baobaba amin'ny masoandro mody sy gidro Decken.\n• 'Baobabs du Boeny & Namoroka' (6 andro): Baobabs goavambe any Mahajanga sy Ankarafantsika."
            : targetLang === 'en'
            ? "We offer iconic wildlife and botanical expeditions across Madagascar:\n• 'Classic RN7 & Isalo Canyons' (12 days): Ring-tailed lemurs (Maki), Sifakas, and Ranomafana rainforest.\n• 'Tsiribihina River & Tsingy de Bemaraha' (9 days): Sunset at the legendary Avenue of the Baobabs.\n• 'Boeny Baobabs & Ankarafantsika' (6 days): Centuries-old giant baobabs around Mahajanga."
            : "Nous avons plusieurs itinéraires emblématiques pour observer les lémuriens et contempler les grands baobabs :\n• 'La Grande Traversée de la RN7 & Canyons de l'Isalo' (12 jours) : Lémuriens Maki catta à l'Isalo, lémuriens diurnes et nocturnes à Ranomafana.\n• 'Descente de la Tsiribihina & Tsingy de Bemaraha' (9 jours) : Coucher de soleil sur la mythique Allée des Baobabs.\n• 'Baobabs du Boeny & Tsingy de Namoroka' (6 jours) : Les géants baobabs de Mahajanga et Ankarafantsika.",
        buttons: [
          {
            label:
              targetLang === 'mg'
                ? 'Hijery ny Traversée RN7 (12 andro)'
                : targetLang === 'en'
                ? 'View Classic RN7 (12 days)'
                : 'Voir la Traversée RN7 (12j)',
            action: () => {
              const circ = circuits.find((c) => c.slug.includes('rn7') || c.id === 'circ-01');
              if (circ) setSelectedCircuit(circ);
            },
            icon: 'circuit',
          },
          {
            label:
              targetLang === 'mg'
                ? 'Hijery Tsiribihina & Baobabs (9 andro)'
                : targetLang === 'en'
                ? 'View Tsiribihina & Baobabs (9 days)'
                : 'Voir Tsiribihina & Baobabs (9j)',
            action: () => {
              const circ = circuits.find((c) => c.slug.includes('tsiribihina') || c.id === 'circ-02');
              if (circ) setSelectedCircuit(circ);
            },
            icon: 'circuit',
          },
          {
            label:
              targetLang === 'mg'
                ? 'Hangataka tombana momba ny zavaboary'
                : targetLang === 'en'
                ? 'Request a Wildlife Tour Quote'
                : 'Demander un devis Faune & Nature',
            action: () => openQuoteModal(),
            icon: 'quote',
          },
        ],
      };
    }

    // 1.5 Currency Converter (EUR, USD, MGA Ariary) - Live calculations
    if (
      q.includes('ariary') ||
      q.includes('mga') ||
      q.includes('convert') ||
      q.includes('conversion') ||
      q.includes('convertis') ||
      q.includes('taux') ||
      q.includes('change') ||
      q.includes('sandam-bola') ||
      q.includes('devise') ||
      q.includes('currency') ||
      ((q.includes('euro') || q.includes('dollar')) &&
        (q.includes('combien') || q.includes('firy') || q.includes('how much') || q.includes('rate')))
    ) {
      // Extract number if any
      const numMatch = q.match(/(\d+[\d\s.,]*)/);
      let parsedAmount = 100;
      if (numMatch) {
        const cleanNum = parseFloat(numMatch[1].replace(/\s/g, '').replace(',', '.'));
        if (!isNaN(cleanNum) && cleanNum > 0) {
          parsedAmount = cleanNum;
        }
      }

      const isUsd = q.includes('dollar') || q.includes('usd') || q.includes('$');
      const isAriaryInput =
        q.includes('ariary') &&
        (q.includes('en euro') ||
          q.includes('en dollar') ||
          q.includes('to euro') ||
          q.includes('to usd') ||
          q.includes("amin'ny euro") ||
          q.includes("amin'ny dollar"));

      let calcText = '';
      if (isAriaryInput) {
        const inEur = (parsedAmount / 4950).toFixed(2);
        const inUsd = (parsedAmount / 4580).toFixed(2);
        if (targetLang === 'mg') {
          calcText = `💱 Fikajiana : ${parsedAmount.toLocaleString()} Ariary = ${inEur} € (Euro) na ${inUsd} $ (Dollar US)\n• 1 € ≈ 4 950 Ar | 1 $ ≈ 4 580 Ar.`;
        } else if (targetLang === 'en') {
          calcText = `💱 Live Calculation: ${parsedAmount.toLocaleString()} MGA = €${inEur} (EUR) or $${inUsd} (USD)\n• Reference rates: 1 € ≈ 4,950 Ar | 1 $ ≈ 4,580 Ar.`;
        } else {
          calcText = `💱 Conversion en direct : ${parsedAmount.toLocaleString()} Ariary = ${inEur} € (Euro) ou ${inUsd} $ (Dollar US)\n• Taux de référence : 1 € ≈ 4 950 Ar | 1 $ ≈ 4 580 Ar.`;
        }
      } else if (isUsd) {
        const inMga = Math.round(parsedAmount * 4580);
        const inEur = (parsedAmount / 1.08).toFixed(2);
        if (targetLang === 'mg') {
          calcText = `💱 Fikajiana : ${parsedAmount.toLocaleString()} $ (Dollar US) = ${inMga.toLocaleString()} Ariary (Ar) na ${inEur} €\n• 1 $ ≈ 4 580 Ar | 1 € ≈ 1.08 $.`;
        } else if (targetLang === 'en') {
          calcText = `💱 Live Calculation: $${parsedAmount.toLocaleString()} (USD) = ${inMga.toLocaleString()} Ariary (MGA) or €${inEur}\n• Reference rates: 1 $ ≈ 4,580 Ar | 1 € ≈ 1.08 $.`;
        } else {
          calcText = `💱 Conversion en direct : ${parsedAmount.toLocaleString()} $ (USD) = ${inMga.toLocaleString()} Ariary (Ar) ou ${inEur} €\n• Taux de référence : 1 $ ≈ 4 580 Ar | 1 € ≈ 1,08 $.`;
        }
      } else {
        const inMga = Math.round(parsedAmount * 4950);
        const inUsd = (parsedAmount * 1.08).toFixed(2);
        if (targetLang === 'mg') {
          calcText = `💱 Fikajiana : ${parsedAmount.toLocaleString()} € (Euro) = ${inMga.toLocaleString()} Ariary (Ar) na ${inUsd} $ (Dollar US)\n• 1 € ≈ 4 950 Ar | 1 $ ≈ 4 580 Ar.`;
        } else if (targetLang === 'en') {
          calcText = `💱 Live Calculation: €${parsedAmount.toLocaleString()} (EUR) = ${inMga.toLocaleString()} Ariary (MGA) or $${inUsd} (USD)\n• Official benchmark: 1 € ≈ 4,950 Ar | 1 $ ≈ 4,580 Ar.`;
        } else {
          calcText = `💱 Conversion en direct : ${parsedAmount.toLocaleString()} € (Euro) = ${inMga.toLocaleString()} Ariary (Ar) ou ${inUsd} $ (Dollar US)\n• Taux indicatif de référence : 1 € ≈ 4 950 Ar | 1 $ ≈ 4 580 Ar.`;
        }
      }

      const adviceText =
        targetLang === 'mg'
          ? "\n\n💡 Torohevitra amin'ny vola :\n• Ny Ariary (Ar) no vola ampiasaina manerana ny Nosy.\n• Tsara raha mitondra vola Euro na Dollar vaovao (taona 2013 no miakatra).\n• Misy birao fanakalozam-bola sy DAB (Visa / Mastercard) eny amin'ny seranam-piaramanidina Ivato sy Mahajanga."
          : targetLang === 'en'
          ? "\n\n💡 Practical Currency Tips:\n• Ariary (MGA / Ar) is the official local currency used everywhere in Madagascar.\n• Bring crisp, undamaged EUR or USD bills (dated 2013+) for exchange offices and banks.\n• ATMs (Visa / Mastercard) are available at Ivato airport, Mahajanga, and primary towns."
          : "\n\n💡 Conseils pratiques change & devises :\n• L'Ariary (Ar / MGA) est la devise officielle utilisée partout à Madagascar.\n• Munissez-vous de coupures récentes et propres en Euros ou Dollars US pour changer aux guichets bancaires (BNI, BFV-SG, BOA, BMOI).\n• Retrouvez notre convertisseur complet dans l'onglet dédié et notre simulateur de budget !";

      return {
        response: calcText + adviceText,
        buttons: [
          {
            label:
              targetLang === 'mg'
                ? 'Hanokatra ny mpanakalo vola'
                : targetLang === 'en'
                ? 'Open Currency Converter'
                : "Ouvrir l'onglet Convertisseur",
            action: () => {
              setActiveView('converter');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            },
            icon: 'converter',
          },
          {
            label:
              targetLang === 'mg'
                ? 'Kajiana ny tetibola'
                : targetLang === 'en'
                ? 'Trip Budget Simulator'
                : 'Simulateur de budget voyage',
            action: () => setIsBudgetSimulatorOpen(true),
            icon: 'calculator',
          },
        ],
      };
    }

    // 2. Budget / Prix / Tarifs / Vidiny / Sarany
    if (
      q.includes('budget') ||
      q.includes('prix') ||
      q.includes('tarif') ||
      q.includes('coût') ||
      q.includes('cout') ||
      q.includes('vidiny') ||
      q.includes('sarany') ||
      q.includes('cost') ||
      q.includes('price') ||
      q.includes('tetibola')
    ) {
      return {
        response:
          targetLang === 'mg'
            ? "Ny sandan'ny dianay dia manomboka amin'ny 890 € ka hatramin'ny 1 680 € isaky ny olona, arakaraka ny faharetana sy ny sokajy:\n• Fiaingana fohy (6-8 andro) : 890 € - 1 100 €\n• Dia lehibe (9-14 andro) : 1 250 € - 1 680 €\n\nAo anatiny avokoa: Fiara 4x4 manokana misy rivotra madio, mpamily-mpitarika matihanina, solika amin'ny dia rehetra, trano fandraisam-bahiny ary saram-pidirana valan-javaboary."
            : targetLang === 'en'
            ? "Our guided expeditions range between €890 and €1,680 per person depending on duration and comfort:\n• Short immersions (6-8 days): €890 - €1,100\n• Grand expeditions (9-14 days): €1,250 - €1,680\n\nAll rates systematically include: private air-conditioned 4WD, certified chauffeur-guide, fuel throughout, accommodations with half board, and national park tickets."
            : "Nos circuits accompagnés s'échelonnent généralement de 890 € à 1 680 € par personne selon la durée et le niveau de prestation :\n• Circuits courts (6 à 8 jours) : 890 € à 1 100 €\n• Grandes aventures (9 à 14 jours) : 1 250 € à 1 680 €\n\nNos tarifs incluent systématiquement : le véhicule 4x4 privé climatisé, le chauffeur-guide professionnel, le carburant pour tout le parcours, les hébergements en demi-pension et les droits d'entrée dans les parcs nationaux.",
        buttons: [
          {
            label:
              targetLang === 'mg'
                ? 'Hangarona ny bokin-dia PDF'
                : targetLang === 'en'
                ? 'Download Pricing PDF Catalog'
                : 'Télécharger le catalogue tarifaire PDF',
            action: () => setCatalogPdfModalOpen(true),
            icon: 'pdf',
          },
          {
            label:
              targetLang === 'mg'
                ? 'Hangataka tombana manokana'
                : targetLang === 'en'
                ? 'Request a tailored quote'
                : 'Demander une cotation personnalisée',
            action: () => openQuoteModal(),
            icon: 'quote',
          },
        ],
      };
    }

    // 3. Carte interactive des tracés / Interactive Map / Sarin-tany
    if (
      q.includes('carte') ||
      q.includes('map') ||
      q.includes('sarintany') ||
      q.includes('sarin-tany') ||
      q.includes('tracé') ||
      q.includes('trace') ||
      q.includes('légende') ||
      q.includes('zoom')
    ) {
      return {
        response:
          targetLang === 'mg'
            ? "Ny sarin-tany ifandrimbonana (Carte interactive Leaflet) dia manampy anao hahita ny lalam-pitetezana rehetra eto Madagasikara:\n• Loko maitso (#10b981): Mora (accessible, fialan-tsasatra, fianakaviana)\n• Loko volomboasary (#f97316): Antonony (randonnées, lalan-tany 4x4)\n• Loko mena (#ef4444): Mafy (treks Makay, canyons lalina)\n• Bokotra zoom (+ / -) sy recadrage mandeha ho azy mifanaraka amin'ny sivana!"
            : targetLang === 'en'
            ? "Our interactive Leaflet route map displays full GPS paths and stops across Madagascar:\n• Green lines (#10b981): Easy routes (family-friendly, gentle pace, coastal)\n• Orange lines (#f97316): Moderate routes (regular hiking & 4WD tracks)\n• Red lines (#ef4444): Challenging routes (wild Makay treks & deep canyons)\n• Features custom zoom buttons (+/-), route difficulty legend, and auto-fit on active filter changes!"
            : "Notre carte interactive Leaflet affiche en temps réel les tracés GPS complets et étapes des circuits :\n• Tracé vert (#10b981) : Facile (accessible à tous, balades douces, famille)\n• Tracé orange (#f97316) : Modérée (randonnées régulières, pistes 4x4)\n• Tracé rouge (#ef4444) : Soutenue (treks engagés, canyons du Makay)\n• Dispose de boutons de zoom dédiés (+/-), d'un recadrage automatique selon vos filtres et d'une légende complète !",
        buttons: [
          {
            label:
              targetLang === 'mg'
                ? 'Hanokatra ny sarin-tany'
                : targetLang === 'en'
                ? 'Open interactive map view'
                : 'Ouvrir la vue Carte interactive',
            action: () => {
              setActiveView('circuits');
              const el = document.getElementById('catalogue-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            },
            icon: 'map',
          },
          {
            label:
              targetLang === 'mg'
                ? 'Hangataka tombana maimaim-poana'
                : targetLang === 'en'
                ? 'Request a free quote'
                : 'Demander un devis gratuit',
            action: () => openQuoteModal(),
            icon: 'quote',
          },
        ],
      };
    }

    // 4. Départs garantis / Guaranteed Departures / Fiaingana azo antoka
    if (
      q.includes('garanti') ||
      q.includes('départ') ||
      q.includes('depart') ||
      q.includes('fiaingana') ||
      q.includes('calendar') ||
      q.includes('calendrier') ||
      q.includes('date') ||
      q.includes('2026') ||
      q.includes('2027')
    ) {
      const openCount = departures.filter(
        (d) => d.status === 'ouvert' || d.status === 'presque_complet'
      ).length;
      return {
        response:
          targetLang === 'mg'
            ? `Manana fiaingana azo antoka ${departures.length} voalahatra ho an'ny taona 2026-2027 izahay, ka misy ${openCount} mbola misy toerana malalaka ankehitriny. Afaka manatevin-daharana vondrona kely (4 ka hatramin'ny 8 olona) ianao mba hampihenana ny sarany nefa hitazona ny kalitao tsara indrindra.`
            : targetLang === 'en'
            ? `We have ${departures.length} scheduled guaranteed departures for 2026-2027 (${openCount} currently have open seats). Traveling in small groups (4 to 8 guests maximum) allows you to benefit from shared costs with guaranteed departure dates from 4 registered participants!`
            : `Nous proposons actuellement ${departures.length} départs garantis programmés pour 2026-2027 (dont ${openCount} sessions avec places encore disponibles). Ce format en petit groupe (4 à 8 personnes max) vous assure un tarif avantageux et une ambiance conviviale tout en maintenant un encadrement haut de gamme.`,
        buttons: [
          {
            label:
              targetLang === 'mg'
                ? 'Hijery ny fiaingana azo antoka 2026-2027'
                : targetLang === 'en'
                ? 'View guaranteed departures 2026-2027'
                : 'Consulter les départs garantis 2026-2027',
            action: () => setActiveView('departures'),
            icon: 'departures',
          },
          {
            label:
              targetLang === 'mg'
                ? 'Hamandrika toerana amin\'ny fiaingana'
                : targetLang === 'en'
                ? 'Hold a seat on a departure'
                : 'Bloquer une place sur un départ',
            action: () => openQuoteModal(),
            icon: 'quote',
          },
        ],
      };
    }

    // 5. Saison / Météo / Climat / Season / Toetrandro
    if (
      q.includes('saison') ||
      q.includes('météo') ||
      q.includes('meteo') ||
      q.includes('climat') ||
      q.includes('pluie') ||
      q.includes('quand') ||
      q.includes('season') ||
      q.includes('weather') ||
      q.includes('toetrandro') ||
      q.includes('vanim-potoana') ||
      q.includes('baleine') ||
      q.includes('whale') ||
      q.includes('trozona')
    ) {
      return {
        response:
          targetLang === 'mg'
            ? "Ny vanim-potoana tsara indrindra hitsidihana an'i Madagasikara dia manomboka amin'ny volana Aprily ka hatramin'ny Novambra (vanim-potoana maina sy mahafinaritra).\n• Hijery trozona any Sainte-Marie: Jolay ka hatramin'ny Septambra.\n• Mahajanga sy ny Andrefana: Mahamay sy misy masoandro mandavan-taona!\n• Tsingy de Bemaraha: Misokatra ny volana Mey ka hatramin'ny Novambra."
            : targetLang === 'en'
            ? "The best season to travel to Madagascar is from April to November (dry season), offering sunny skies and accessible trails.\n• Humpback whales in Sainte-Marie: July to late September.\n• Western beaches & Mahajanga: Sunny tropical climate year-round.\n• Tsingy de Bemaraha: Accessible from May to November."
            : "La saison idéale s'étend d'avril à novembre (saison sèche), avec des pistes praticables et un climat très agréable.\n• Observation des baleines à bosse (Sainte-Marie) : Juillet à fin septembre.\n• Plages et soleil (Mahajanga & Nosy Be) : Ensoleillé quasiment toute l'année.\n• Tsingy de Bemaraha : Ouvert de mai à novembre.",
        buttons: [
          {
            label:
              targetLang === 'mg'
                ? 'Hijery ny dia any Andrefana & Mahajanga'
                : targetLang === 'en'
                ? 'View West & Mahajanga tours'
                : 'Voir les circuits Ouest & Mahajanga',
            action: () => {
              setFilters((prev) => ({ ...prev, region: 'Ouest' }));
              setActiveView('circuits');
              const el = document.getElementById('catalogue-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            },
            icon: 'filter',
          },
          {
            label:
              targetLang === 'mg'
                ? 'Hangataka torohevitra momba ny daty'
                : targetLang === 'en'
                ? 'Get advice for my travel dates'
                : 'Demander conseil pour mes dates',
            action: () => openQuoteModal(),
            icon: 'quote',
          },
        ],
      };
    }

    // 6. Visas / Santé / Vaccins / Monnaie / Ariary / Fahasalamana
    if (
      q.includes('visa') ||
      q.includes('santé') ||
      q.includes('sante') ||
      q.includes('vaccin') ||
      q.includes('monnaie') ||
      q.includes('ariary') ||
      q.includes('health') ||
      q.includes('currency') ||
      q.includes('fahasalamana') ||
      q.includes('palu') ||
      q.includes('tazomoka')
    ) {
      return {
        response:
          targetLang === 'mg'
            ? "Torolàlana manan-danja ho an'ny mpandeha:\n• Visa: Azo alaina mivantana eny amin'ny seranam-piaramanidina (Ivato na Nosy Be) rehefa tonga (30 na 60 andro).\n• Fahasalamana: Fitsaboana mialoha ny tazomoka (Malarone) no soso-kevitra. Misotroa rano tavoahangy voaisy tombo-kase foana.\n• Vola: Ny Ariary Malagasy (MGA) no ampiasaina. Misy DAB ho an'ny carte Visa/Mastercard any amin'ny tanàn-dehibe."
            : targetLang === 'en'
            ? "Essential travel formalities for Madagascar:\n• Visa: Issued on arrival at international airports in Antananarivo (Ivato) and Nosy Be (valid up to 30 or 60 days).\n• Health: Malaria prophylaxis (Malarone) is strongly recommended. Drink sealed bottled water only.\n• Currency: Malagasy Ariary (MGA). ATMs are accessible in major cities; Euros are widely accepted for currency exchange."
            : "Conseils pratiques essentiels pour votre voyage :\n• Visa : Délivré à l'arrivée aux aéroports d'Antananarivo (Ivato) et Nosy Be (valable jusqu'à 30 ou 60 jours).\n• Santé : Traitement préventif antipaludéen conseillé (type Malarone). Ne buvez que de l'eau capsulée.\n• Monnaie : L'Ariary malgache (MGA). Des distributeurs automatiques (Visa/Mastercard) sont disponibles dans les villes principales. L'Euro est accepté pour le change.",
        buttons: [
          {
            label:
              targetLang === 'mg'
                ? 'Hamaky ny Fanontaniana fohifohy (FAQ)'
                : targetLang === 'en'
                ? 'Read Frequently Asked Questions'
                : 'Consulter la Foire Aux Questions (FAQ)',
            action: () => {
              setActiveView('faq');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            },
            icon: 'filter',
          },
          {
            label:
              targetLang === 'mg'
                ? 'Hangarona ny bokin-dia PDF'
                : targetLang === 'en'
                ? 'Download Practical Guide PDF'
                : 'Télécharger la fiche pratique PDF',
            action: () => setCatalogPdfModalOpen(true),
            icon: 'pdf',
          },
        ],
      };
    }

    // 7. Contact / Mahajanga / Masoivoho / Agence / Téléphone / WhatsApp
    if (
      q.includes('contact') ||
      q.includes('adresse') ||
      q.includes('agence') ||
      q.includes('mahajanga') ||
      q.includes('téléphone') ||
      q.includes('telephone') ||
      q.includes('whatsapp') ||
      q.includes('phone') ||
      q.includes('masoivoho') ||
      q.includes('foibe')
    ) {
      return {
        response:
          targetLang === 'mg'
            ? "Ravinala Tours Madagascar dia masoivoho ara-dalàna (Licence B n° 042-MINTOUR/EDT):\n• Foibe: Avenue Philibert Tsiranana, Mahajanga\n• Sampana: Antananarivo (akaikin'ny seranam-piaramanidina Ivato)\n• WhatsApp / Antso: +261 34 58 613 63\n• Email: contact@ravinalatours.com\n• Misokatra 7 andro amin'ny 7: 07:00 hatramin'ny 20:00."
            : targetLang === 'en'
            ? "Ravinala Tours Madagascar is a licensed receptive tour operator (License B n° 042-MINTOUR/EDT):\n• Headquarters: Avenue Philibert Tsiranana, Mahajanga\n• Branch: Antananarivo (near Ivato International Airport)\n• WhatsApp & Phone: +261 34 58 613 63\n• Email: contact@ravinalatours.com\n• Available 7 days a week: 07:00 to 20:00."
            : "Ravinala Tours Madagascar est une agence réceptive agréée par le Ministère du Tourisme (Licence B n° 042-MINTOUR/EDT) :\n• Siège : Avenue Philibert Tsiranana, Mahajanga (Madagascar)\n• Antenne : Antananarivo (proximité aéroport Ivato)\n• WhatsApp & Mobile : +261 34 58 613 63\n• Fixe Mahajanga : +261 32 39 432 34\n• Email : contact@ravinalatours.com\n• Nos conseillers sont joignables 7j/7 de 07h00 à 20h00.",
        buttons: [
          {
            label:
              targetLang === 'mg'
                ? "Hiresaka mivantana amin'ny WhatsApp"
                : targetLang === 'en'
                ? 'Chat directly on WhatsApp'
                : 'Échanger directement sur WhatsApp',
            action: () => {
              window.open(
                `https://wa.me/261345861363?text=${encodeURIComponent(
                  targetLang === 'mg'
                    ? 'Manao ahoana Ravinala Tours, te hahazo fanazavana momba ny dia aho.'
                    : targetLang === 'en'
                    ? 'Hello Ravinala Tours, I would like information about your tours in Madagascar.'
                    : 'Bonjour Ravinala Tours, je souhaite avoir des informations sur vos voyages.'
                )}`,
                '_blank'
              );
            },
            icon: 'whatsapp',
          },
          {
            label:
              targetLang === 'mg'
                ? 'Hangataka tombana maimaim-poana'
                : targetLang === 'en'
                ? 'Contact form & quote request'
                : 'Formulaire de contact & devis',
            action: () => openQuoteModal(),
            icon: 'quote',
          },
        ],
      };
    }

    // 8. 4x4 / Fiara / Mpamily / Chauffeur-guide / Transport
    if (
      q.includes('4x4') ||
      q.includes('véhicule') ||
      q.includes('vehicule') ||
      q.includes('voiture') ||
      q.includes('fiara') ||
      q.includes('guide') ||
      q.includes('chauffeur') ||
      q.includes('mpamily') ||
      q.includes('transport')
    ) {
      return {
        response:
          targetLang === 'mg'
            ? "Mampiasa fiara 4x4 matanjaka sy voakarakara tsara izahay (Toyota Land Cruiser, Nissan Patrol) misy rivotra madio, miaraka amin'ny mpamily-mpitarika manana traikefa am-polo taonany amin'ny lalan-tany malagasy. Ny solika sy ny fikarakarana teknika dia tafiditra foana amin'ny tolotray!"
            : targetLang === 'en'
            ? "We operate our own fleet of robust, air-conditioned 4WD vehicles (Toyota Land Cruiser, Nissan Patrol) paired with experienced chauffeur-guides fluent in French, English, and Malagasy. Fuel and roadside assistance are 100% included in all our packages!"
            : "Nous disposons de notre propre parc de véhicules 4x4 tout-terrain récents et climatisés (Toyota Land Cruiser et Nissan Patrol), parfaitement entretenus pour les pistes malgaches. Chaque circuit est accompagné par un chauffeur-guide professionnel expérimenté. Carburant et assistance mécanique sont intégralement compris.",
        buttons: [
          {
            label:
              targetLang === 'mg'
                ? 'Hangataka tombana miaraka amin\'ny 4x4'
                : targetLang === 'en'
                ? 'Request a private 4WD quote'
                : 'Demander un devis avec 4x4 privé',
            action: () => openQuoteModal(),
            icon: 'quote',
          },
          {
            label:
              targetLang === 'mg'
                ? 'Hangarona ny bokin-dia PDF'
                : targetLang === 'en'
                ? 'Download PDF Catalog'
                : 'Télécharger le catalogue PDF',
            action: () => setCatalogPdfModalOpen(true),
            icon: 'pdf',
          },
        ],
      };
    }

    // 9. Régions spécifiques (Nord / Nosy Be / Diego)
    if (q.includes('nord') || q.includes('nosy be') || q.includes('diego') || q.includes('avaratra')) {
      return {
        response:
          targetLang === 'mg'
            ? "Ny lalam-pitetezana any Avaratra: 'Parfums du Nord & Archipel de Nosy Be' (8 andro / 7 alina, manomboka amin'ny 1 100 €). Ahitana an'i Diego-Suarez, Montagne d'Ambre, Tsingy Rouges ary fialan-tsasatra amoron-dranomasina any Nosy Be."
            : targetLang === 'en'
            ? "Our flagship Northern circuit: 'Scents of the North & Nosy Be Archipelago' (8 days, starting at €1,100). Highlights include Diego-Suarez, Amber Mountain national park, Red Tsingy, and turquoise beaches in Nosy Be."
            : "Notre circuit phare dans le Nord : 'Parfums du Nord & Archipel de Nosy Be' (8 jours / 7 nuits, à partir de 1 100 €). Il combine la Baie de Diego-Suarez, les Tsingy Rouges, le parc national de la Montagne d'Ambre et une détente paradisiaque sur les îles de Nosy Be.",
        buttons: [
          {
            label:
              targetLang === 'mg'
                ? 'Hijery ny dia Nord & Nosy Be (8 andro)'
                : targetLang === 'en'
                ? 'View North & Nosy Be Tour (8 days)'
                : 'Voir le circuit Nord & Nosy Be (8j)',
            action: () => {
              const circ = circuits.find((c) => c.slug.includes('nord') || c.region === 'Nord');
              if (circ) setSelectedCircuit(circ);
            },
            icon: 'circuit',
          },
          {
            label:
              targetLang === 'mg'
                ? 'Sivana: Faritra Avaratra'
                : targetLang === 'en'
                ? 'Filter Northern tours'
                : 'Filtrer les circuits du Nord',
            action: () => {
              setFilters((prev) => ({ ...prev, region: 'Nord' }));
              setActiveView('circuits');
              const el = document.getElementById('catalogue-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            },
            icon: 'filter',
          },
        ],
      };
    }

    // 10. Intelligent Search Match with existing circuits in catalog
    const matchedCircuit = circuits.find((c) => {
      const title = (c.title[targetLang] || c.title.fr).toLowerCase();
      const region = c.region.toLowerCase();
      return title.includes(q) || region.includes(q);
    });

    if (matchedCircuit) {
      const title = matchedCircuit.title[targetLang] || matchedCircuit.title.fr;
      return {
        response:
          targetLang === 'mg'
            ? `Hitako ny lalam-pitetezana mifanaraka amin'ny fangatahanao: "${title}" (${matchedCircuit.durationDays} andro, faritra ${matchedCircuit.region}, manomboka amin'ny ${matchedCircuit.basePriceEUR} €).\n\nTe hijery ny fandaharam-potoana feno ve ianao sa hangataka tombana maimaim-poana?`
            : targetLang === 'en'
            ? `I found the tour matching your request: "${title}" (${matchedCircuit.durationDays} days, ${matchedCircuit.region} region, from €${matchedCircuit.basePriceEUR}).\n\nWould you like to examine the day-by-day program or request a tailored quotation?`
            : `J'ai trouvé le circuit qui correspond à votre recherche : "${title}" (${matchedCircuit.durationDays} jours, région ${matchedCircuit.region}, à partir de ${matchedCircuit.basePriceEUR} €).\n\nSouhaitez-vous consulter sa fiche complète ou obtenir un devis personnalisé ?`,
        buttons: [
          {
            label:
              targetLang === 'mg'
                ? `Hijery ny fandehan-draharaha`
                : targetLang === 'en'
                ? `View tour details`
                : `Ouvrir la fiche du circuit`,
            action: () => setSelectedCircuit(matchedCircuit),
            icon: 'circuit',
          },
          {
            label:
              targetLang === 'mg'
                ? `Hangataka tombana ho an'ity dia ity`
                : targetLang === 'en'
                ? `Request quote for this trip`
                : `Demander un devis pour ce voyage`,
            action: () => openQuoteModal({ id: matchedCircuit.id, title }),
            icon: 'quote',
          },
        ],
      };
    }

    // Default Fallback in target language
    return {
      response:
        targetLang === 'mg'
          ? "Misaotra tamin'ny fanontanianao. Amin'ny maha-masoivoho matihanina anay dia manolotra fitsidihana manokana, fiaingana azo antoka 2026-2027, fiara 4x4 ary tombana maimaim-poana izahay. Azonao atao ny manindry ireo safidy eto ambany na miresaka mivantana amin'ny mpanolotsainanay ao amin'ny WhatsApp!"
          : targetLang === 'en'
          ? "Thank you for reaching out! As a certified Madagascar receptive tour operator based in Mahajanga, we organize bespoke private expeditions, scheduled 2026-2027 guaranteed departures, 4x4 rentals, and free tailored quotes within 24 hours.\n\nYou can explore the shortcuts below or ask me about any region, pricing, season, or tour difficulty."
          : "Merci pour votre question ! En tant qu'agence réceptive basée à Mahajanga, nous organisons des circuits sur mesure, des départs garantis 2026-2027 en petits groupes, la location de 4x4 avec chauffeurs-guides et des devis gratuits sous 24h.\n\nVous pouvez cliquer sur une suggestion ci-dessous ou me poser une autre question précise sur une région, un tarif ou une saison.",
      buttons: [
        {
          label:
            targetLang === 'mg'
              ? 'Hijery ny dia rehetra'
              : targetLang === 'en'
              ? 'Explore all tours'
              : 'Découvrir tous les circuits',
          action: () => {
            setActiveView('circuits');
            const el = document.getElementById('catalogue-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          },
          icon: 'circuit',
        },
        {
          label:
            targetLang === 'mg'
              ? 'Hangataka tombana maimaim-poana'
              : targetLang === 'en'
              ? 'Request a tailor-made quote'
              : 'Demander un devis sur mesure',
          action: () => openQuoteModal(),
          icon: 'quote',
        },
        {
          label:
            targetLang === 'mg'
              ? 'Hangarona ny bokin-dia PDF'
              : targetLang === 'en'
              ? 'Download complete PDF catalog'
              : 'Télécharger le catalogue PDF complet',
          action: () => setCatalogPdfModalOpen(true),
          icon: 'pdf',
        },
        {
          label:
            targetLang === 'mg'
              ? "Hiresaka amin'ny WhatsApp"
              : targetLang === 'en'
              ? 'Chat on WhatsApp'
              : 'Parler à un conseiller sur WhatsApp',
          action: () => {
            window.open('https://wa.me/261345861363', '_blank');
          },
          icon: 'whatsapp',
        },
      ],
    };
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    // Detect language of question, with fallback to current chatLanguage
    const detectedLang = detectQueryLanguage(text, chatLanguage);
    if (detectedLang !== chatLanguage) {
      setChatLanguage(detectedLang);
    }

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const { response, buttons } = processQuery(text, detectedLang);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionButtons: buttons,
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 400);
  };

  const handleSwitchLanguageManually = (newLang: Language) => {
    setChatLanguage(newLang);
    const text =
      newLang === 'mg'
        ? "Voafantina ny teny Malagasy. Faly manampy anao amin'ny teny Malagasy ny mpanampy virtoaly an'ny Ravinala Tours. Inona no tianao ho fantatra?"
        : newLang === 'en'
        ? "English selected. Welcome! Your Ravinala Tours assistant will now communicate in English. How can I assist you with your travels to Madagascar?"
        : "Français sélectionné. Bienvenue ! Votre assistant Ravinala Tours communique désormais en français. Comment puis-je vous renseigner ?";

    setMessages((prev) => [
      ...prev,
      {
        id: `lang-switch-${Date.now()}`,
        sender: 'bot',
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'msg-welcome-reset',
        sender: 'bot',
        text:
          chatLanguage === 'mg'
            ? "Efa voaova ny resaka. Inona ny fanontaniana manaraka tianao hapetraka momba an'i Madagasikara?"
            : chatLanguage === 'en'
            ? "Conversation restarted. What else would you like to discover about our trips to Madagascar?"
            : "Conversation réinitialisée. Que souhaitez-vous découvrir à propos de nos voyages à Madagascar ?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionButtons: [
          {
            label:
              chatLanguage === 'mg'
                ? 'Hijery ireo dia'
                : chatLanguage === 'en'
                ? 'View our tours'
                : 'Voir nos circuits',
            action: () => {
              setActiveView('circuits');
              const el = document.getElementById('catalogue-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            },
            icon: 'circuit',
          },
          {
            label:
              chatLanguage === 'mg'
                ? 'Hangataka tombana maimaim-poana'
                : chatLanguage === 'en'
                ? 'Request a free quote'
                : 'Demander un devis gratuit',
            action: () => openQuoteModal(),
            icon: 'quote',
          },
        ],
      },
    ]);
  };

  return (
    <>
      {/* Floating Trigger Button: Positioned cleanly above the WhatsApp button */}
      <div className="fixed bottom-22 right-5 sm:bottom-24 sm:right-6 z-40 flex flex-col items-end">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-2.5 px-4 py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-full shadow-2xl border-2 border-amber-500/80 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            aria-label="Ouvrir l'assistant voyage automatique"
          >
            <div className="relative">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-stone-950 flex items-center justify-center font-black text-base shadow shrink-0">
                R
              </div>
              {/* Online pulse indicator */}
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-stone-900 animate-pulse" />
            </div>

            <div className="text-left hidden md:block pr-1">
              <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Assistant Virtuel
              </div>
              <div className="text-xs font-semibold text-white">
                Conseiller 24/7 (FR / EN / MG)
              </div>
            </div>

            {unreadCount > 0 && (
              <span className="md:hidden absolute -top-1.5 -right-1.5 bg-amber-500 text-stone-950 font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-stone-900">
                1
              </span>
            )}
          </button>
        )}
      </div>

      {/* Interactive Chat Window Modal */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[94vw] sm:w-[420px] h-[570px] max-h-[88vh] bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 transition-all">
          {/* Header */}
          <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 dark:from-stone-950 dark:to-stone-900 text-white p-3.5 px-4 flex items-center justify-between border-b border-stone-800 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-9 h-9 rounded-lg bg-amber-500 text-stone-950 flex items-center justify-center font-black text-base shadow shrink-0">
                  R
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-stone-900" />
              </div>

              <div>
                <div className="flex items-center gap-1.5 font-extrabold text-sm text-white">
                  <span>Assistant Ravinala</span>
                  <span className="text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-400/30 px-1.5 py-0.2 rounded">
                    FR · EN · MG
                  </span>
                </div>
                <div className="text-[11px] text-stone-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block" />
                  <span>
                    {chatLanguage === 'mg'
                      ? 'Mpanampy vonona amin\'ny teny 3'
                      : chatLanguage === 'en'
                      ? 'Live 3-language assistant'
                      : 'En ligne · Répond en 3 langues'}
                  </span>
                </div>
              </div>
            </div>

            {/* Language Switch Pills & Window Controls */}
            <div className="flex items-center gap-1.5">
              {/* Quick Language Toggle */}
              <div className="flex items-center bg-stone-800 rounded-lg p-0.5 border border-stone-700 text-[10px] font-bold">
                {(['fr', 'en', 'mg'] as Language[]).map((code) => (
                  <button
                    key={code}
                    onClick={() => handleSwitchLanguageManually(code)}
                    className={`px-1.5 py-0.5 rounded cursor-pointer uppercase transition-colors ${
                      chatLanguage === code
                        ? 'bg-amber-500 text-stone-950 font-black'
                        : 'text-stone-400 hover:text-white'
                    }`}
                    title={`Passer en ${code === 'mg' ? 'Malagasy' : code === 'en' ? 'English' : 'Français'}`}
                  >
                    {code}
                  </button>
                ))}
              </div>

              <button
                onClick={handleResetChat}
                className="p-1.5 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
                title="Réinitialiser l'échange"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
                title="Réduire l'assistant"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-stone-50/70 dark:bg-stone-950/70 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-lg bg-amber-500 text-stone-950 flex items-center justify-center shrink-0 mt-0.5 font-black text-xs shadow-xs">
                    R
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3 shadow-xs space-y-2 leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-amber-500 text-stone-950 font-medium rounded-tr-xs'
                      : 'bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-800 rounded-tl-xs whitespace-pre-line'
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* Interactive Buttons attached to bot message */}
                  {msg.actionButtons && msg.actionButtons.length > 0 && (
                    <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex flex-wrap gap-1.5">
                      {msg.actionButtons.map((btn, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            btn.action();
                          }}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-stone-100 hover:bg-amber-100 dark:bg-stone-800 dark:hover:bg-amber-950/40 text-stone-900 dark:text-stone-100 font-semibold rounded-lg text-[11px] border border-stone-200 dark:border-stone-700 transition-colors cursor-pointer"
                        >
                          {btn.icon === 'circuit' && <Compass className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />}
                          {btn.icon === 'quote' && <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />}
                          {btn.icon === 'pdf' && <FileText className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />}
                          {btn.icon === 'departures' && <Calendar className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />}
                          {btn.icon === 'whatsapp' && <PhoneCall className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
                          {btn.icon === 'filter' && <ChevronRight className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />}
                          {btn.icon === 'map' && <Map className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />}
                          {btn.icon === 'converter' && <Coins className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />}
                          {btn.icon === 'calculator' && <Calculator className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />}
                          <span>{btn.label}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  <div
                    className={`text-[9px] text-right font-mono ${
                      msg.sender === 'user' ? 'text-stone-800/70' : 'text-stone-400'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-stone-800 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <User className="w-4 h-4 text-stone-200" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2 items-center text-stone-400 text-xs italic pl-9">
                <span className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-amber-500 rounded-full animate-bounce delay-100" />
                <span className="w-2 h-2 bg-amber-500 rounded-full animate-bounce delay-200" />
                <span className="ml-1 text-[11px]">
                  {chatLanguage === 'mg'
                    ? 'Manomana ny valin-teny amin\'ny teny Malagasy...'
                    : chatLanguage === 'en'
                    ? 'Consulting site knowledge in English...'
                    : 'L\'assistant consulte les données du site...'}
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions Carousel */}
          <div className="p-2 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 overflow-x-auto shrink-0 flex items-center gap-1.5 no-scrollbar">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider shrink-0 pl-1">
              {chatLanguage === 'mg' ? 'Soso-kevitra :' : chatLanguage === 'en' ? 'Suggestions :' : 'Suggestions :'}
            </span>
            {quickSuggestions.map((item, index) => (
              <button
                key={index}
                onClick={() => handleSendMessage(item.q)}
                className="whitespace-nowrap px-2.5 py-1 bg-stone-100 hover:bg-amber-100 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 hover:text-amber-900 dark:hover:text-amber-300 rounded-full text-[11px] font-medium border border-stone-200 dark:border-stone-700 transition-colors cursor-pointer shrink-0"
              >
                {item.q}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-2.5 sm:p-3 bg-stone-100 dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                chatLanguage === 'mg'
                  ? 'Apetraho ny fanontanianao (dia, vidiny, fiaingana, toetrandro...)'
                  : chatLanguage === 'en'
                  ? 'Ask your question (tours, price, departures, weather...)'
                  : 'Posez votre question (circuit, tarif, départ, météo...)'
              }
              className="flex-1 text-xs p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-stone-950 font-bold rounded-xl transition-all cursor-pointer shrink-0 shadow-sm"
              title="Envoyer la question"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
