import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  MapPin,
  Compass,
  ArrowRight,
  Eye,
  Sparkles,
  Route,
  Navigation,
  Info,
  Calendar,
  Check,
  Layers,
} from 'lucide-react';
import { Circuit } from '../types';

interface MapLocation {
  id: string;
  name: { fr: string; en: string; mg: string };
  region: string;
  x: number; // SVG viewBox coordinates (width: 500, height: 750)
  y: number;
  circuitId: string;
  circuitSlug: string;
  isHQ?: boolean;
  highlight: { fr: string; en: string; mg: string };
}

interface CircuitPath {
  id: string;
  circuitId: string;
  name: { fr: string; en: string; mg: string };
  color: string;
  d: string; // SVG path data
}

export const MadagascarInteractiveMap: React.FC = () => {
  const { language, t, circuits, setSelectedCircuit, setActiveView, setFilters } = useApp();

  const [selectedLocationId, setSelectedLocationId] = useState<string>('mahajanga');
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<string>('all');
  const [showRoutes, setShowRoutes] = useState<boolean>(true);
  const [hoveredLocationId, setHoveredLocationId] = useState<string | null>(null);

  // Geographic pinpoints with realistic projection on Madagascar
  const locations: MapLocation[] = [
    {
      id: 'mahajanga',
      name: {
        fr: 'Mahajanga (Siège Ravinala Tours)',
        en: 'Mahajanga (Ravinala Tours HQ)',
        mg: 'Mahajanga (Foiben\'ny Ravinala Tours)',
      },
      region: 'Ouest',
      x: 185,
      y: 200,
      circuitId: 'circ-06',
      circuitSlug: 'excursion-mahajanga-cirque-rouge-ankarafantsika',
      isHQ: true,
      highlight: {
        fr: 'Cirque Rouge, Baobabs géants & Parc Ankarafantsika',
        en: 'Red Cirque, Giant Baobabs & Ankarafantsika Park',
        mg: 'Cirque Rouge, Baobab vaventy & Valan-javaboary Ankarafantsika',
      },
    },
    {
      id: 'tana',
      name: {
        fr: 'Antananarivo (Capitale & Départ RN7)',
        en: 'Antananarivo (Capital & RN7 Hub)',
        mg: 'Antananarivo (Renivohitra & Fiaingana RN7)',
      },
      region: 'Hautes Terres',
      x: 245,
      y: 335,
      circuitId: 'circ-01',
      circuitSlug: 'grande-traversee-rn7-isalo-ifaty',
      highlight: {
        fr: 'Collines royales, artisanat & carrefour des expéditions',
        en: 'Royal hills, crafts and trans-island expedition crossroads',
        mg: 'Rovan\'ny mpanjaka, asa tanana & fiaingana ireo dia',
      },
    },
    {
      id: 'morondava',
      name: {
        fr: 'Morondava & Allée des Baobabs',
        en: 'Morondava & Avenue of the Baobabs',
        mg: 'Morondava & Lalam-ben\'ny Baobab',
      },
      region: 'Ouest',
      x: 145,
      y: 380,
      circuitId: 'circ-02',
      circuitSlug: 'aventure-tsingy-bemaraha-baobabs-morondava',
      highlight: {
        fr: 'Coucher de soleil légendaire sous les baobabs grandidieri',
        en: 'Iconic sunset through ancient grandidieri baobabs',
        mg: 'Masoandro mody kanto eo anivon\'ireo baobab tranainy',
      },
    },
    {
      id: 'tsingy',
      name: {
        fr: 'Tsingy de Bemaraha (Bekopaka)',
        en: 'Tsingy de Bemaraha (UNESCO)',
        mg: 'Tsingin\'ny Bemaraha (Vakoka UNESCO)',
      },
      region: 'Ouest',
      x: 155,
      y: 310,
      circuitId: 'circ-02',
      circuitSlug: 'aventure-tsingy-bemaraha-baobabs-morondava',
      highlight: {
        fr: 'Cathédrales minérales, ponts suspendus & lémuriens Decken',
        en: 'Limestone cathedrals, aerial suspension bridges & sifakas',
        mg: 'Vato maranitra kanto, tetezana mihantona & rajako fotsy',
      },
    },
    {
      id: 'isalo',
      name: {
        fr: 'Canyons de l\'Isalo (Ranohira)',
        en: 'Isalo Canyons & Natural Pools',
        mg: 'Hantsan\'ny Isalo (Ranohira)',
      },
      region: 'Sud',
      x: 185,
      y: 535,
      circuitId: 'circ-01',
      circuitSlug: 'grande-traversee-rn7-isalo-ifaty',
      highlight: {
        fr: 'Massif ruiniforme, piscines naturelles & lémuriens Catta',
        en: 'Jurassic sandstone gorges, natural oasis pools & ring-tailed lemurs',
        mg: 'Harambato jurasika, dobo voajanahary & maki',
      },
    },
    {
      id: 'ifaty',
      name: {
        fr: 'Ifaty & Lagons de Tuléar',
        en: 'Ifaty & Toliara Coral Lagoon',
        mg: 'Ifaty & Ranomasina Toliara',
      },
      region: 'Sud',
      x: 140,
      y: 590,
      circuitId: 'circ-01',
      circuitSlug: 'grande-traversee-rn7-isalo-ifaty',
      highlight: {
        fr: 'Barrière de corail, forêt épineuse de baobabs & pirogues vezo',
        en: 'Coral reef barrier, spiny forest & authentic Vezo outriggers',
        mg: 'Haran-dranomasina, ala tsilo & lakana vezo',
      },
    },
    {
      id: 'diego',
      name: {
        fr: 'Diego Suarez & Mer d\'Émeraude',
        en: 'Diego Suarez & Emerald Sea',
        mg: 'Antsiranana & Ranomasina Maitso',
      },
      region: 'Nord',
      x: 320,
      y: 80,
      circuitId: 'circ-03',
      circuitSlug: 'paradis-tropical-nord-diego-nosy-be',
      highlight: {
        fr: 'Tsingy Rouges, lagon émeraude & Pain de Sucre',
        en: 'Red Tsingy, crystal turquoise lagoons & Sugarloaf bay',
        mg: 'Tsingy Mena, ranomasina kristaly & Nosy Lonjo',
      },
    },
    {
      id: 'nosybe',
      name: {
        fr: 'Nosy Be (L\'Île aux Parfums)',
        en: 'Nosy Be (Perfume Island)',
        mg: 'Nosy Be (Nosy Manitra)',
      },
      region: 'Nord',
      x: 250,
      y: 110,
      circuitId: 'circ-03',
      circuitSlug: 'paradis-tropical-nord-diego-nosy-be',
      highlight: {
        fr: 'Ylang-ylang, tortues marines de Nosy Tanikely & plages de sable fin',
        en: 'Fragrant ylang-ylang, swimming with giant sea turtles & coral reefs',
        mg: 'Hazo manitra ylang-ylang, fano an-dranomasina & tora-pasika',
      },
    },
    {
      id: 'andasibe',
      name: {
        fr: 'Andasibe-Mantadia & Forêt Humide',
        en: 'Andasibe Rainforest (Indri Indri)',
        mg: 'Andasibe-Mantadia & Ala Mando',
      },
      region: 'Est',
      x: 295,
      y: 330,
      circuitId: 'circ-04',
      circuitSlug: 'immersion-nature-andasibe-pangalanes-tamatave',
      highlight: {
        fr: 'Chant puissant de l\'Indri Indri, brumes tropicales & orchidées',
        en: 'Echoing calls of the wild Indri Indri, misty canopy & endemic orchids',
        mg: 'Feon\'ny Babakoto, zavona tropikaly & voninkazo kanto',
      },
    },
    {
      id: 'pangalanes',
      name: {
        fr: 'Canal des Pangalanes (Manambato)',
        en: 'Pangalanes Waterway (Manambato)',
        mg: 'Lakandranon\'ny Pangalanes',
      },
      region: 'Est',
      x: 315,
      y: 360,
      circuitId: 'circ-04',
      circuitSlug: 'immersion-nature-andasibe-pangalanes-tamatave',
      highlight: {
        fr: 'Navigation fluviale paisible entre lacs, villages de pêcheurs et ravenalas',
        en: 'Serene riverboat cruising past lakes, fishermen villages & traveler trees',
        mg: 'Fitaingenana lakana amin\'ny rano madio, vohitra mpanjono & ravinala',
      },
    },
    {
      id: 'saintemarie',
      name: {
        fr: 'Île Sainte-Marie (Nosy Boraha)',
        en: 'Sainte-Marie Island (Nosy Boraha)',
        mg: 'Nosy Boraha (Sainte-Marie)',
      },
      region: 'Est',
      x: 350,
      y: 260,
      circuitId: 'circ-05',
      circuitSlug: 'sanctuaire-baleines-saint-marie-pangalanes',
      highlight: {
        fr: 'Sanctuaire des baleines à bosse (juil-sept), lagons & cimetière des pirates',
        en: 'Humpback whale breeding haven (Jul-Sep), calm lagoons & pirate history',
        mg: 'Toeran\'ny trozona (jolay-septambra), farihy manga & tantaran\'ny piraty',
      },
    },
  ];

  // Route paths visually connecting the stops
  const circuitPaths: CircuitPath[] = [
    {
      id: 'path-rn7',
      circuitId: 'circ-01',
      name: {
        fr: 'La Grande Traversée RN7',
        en: 'Classic RN7 Highway',
        mg: 'Dia RN7',
      },
      color: '#d97706', // amber-600
      d: 'M 245 335 Q 230 420 215 480 Q 200 510 185 535 Q 165 565 140 590',
    },
    {
      id: 'path-ouest',
      circuitId: 'circ-02',
      name: {
        fr: 'Pistes Ouest & Tsingy',
        en: 'West Coast & Tsingy Tracks',
        mg: 'Lalan\'ny Tsingy sy Baobab',
      },
      color: '#ea580c', // orange-600
      d: 'M 245 335 Q 195 340 155 310 Q 145 350 145 380',
    },
    {
      id: 'path-nord',
      circuitId: 'circ-03',
      name: {
        fr: 'Itinéraire du Grand Nord',
        en: 'Northern Tropics Route',
        mg: 'Lalan\'ny Avaratra',
      },
      color: '#059669', // emerald-600
      d: 'M 320 80 Q 285 95 250 110',
    },
    {
      id: 'path-est',
      circuitId: 'circ-04',
      name: {
        fr: 'Boucle Est & Pangalanes',
        en: 'East Coast & Rainforest',
        mg: 'Lalan\'ny Atsinanana',
      },
      color: '#0284c7', // sky-600
      d: 'M 245 335 Q 270 330 295 330 Q 305 345 315 360 Q 330 310 350 260',
    },
    {
      id: 'path-boeny',
      circuitId: 'circ-06',
      name: {
        fr: 'Axe Mahajanga & Boeny',
        en: 'Mahajanga Boeny Excursions',
        mg: 'Lalan\'ny Mahajanga & Boeny',
      },
      color: '#f59e0b', // amber-500
      d: 'M 245 335 Q 215 270 185 200',
    },
  ];

  const filteredLocations = locations.filter((loc) => {
    if (selectedRegionFilter === 'all') return true;
    return loc.region === selectedRegionFilter;
  });

  const activeLocation =
    locations.find((l) => l.id === (hoveredLocationId || selectedLocationId)) || locations[0];

  const activeCircuit = circuits.find((c) => c.id === activeLocation.circuitId) || circuits[0];

  const handleOpenCircuitModal = (circuit: Circuit) => {
    setSelectedCircuit(circuit);
  };

  const handleFilterRegionInCatalog = (regionName: string) => {
    setFilters((prev) => ({ ...prev, region: regionName }));
    setActiveView('circuits');
    const el = document.getElementById('catalogue-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-stone-50 dark:bg-stone-900/60 rounded-3xl border border-stone-200 dark:border-stone-800 p-4 sm:p-8 shadow-sm transition-colors mb-16">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-1">
            <Compass className="w-4 h-4 text-amber-600" />
            <span>{t('map.title')}</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white tracking-tight">
            {language === 'mg'
              ? 'Zahao ny lalan\'ny dia manerana an\'i Madagasikara'
              : language === 'en'
              ? 'Explore Tour Routes Across Madagascar'
              : 'Localisez nos Itinéraires à travers Madagascar'}
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-2xl leading-relaxed">
            {t('map.subtitle')}
          </p>
        </div>

        {/* Region Quick Filters */}
        <div className="flex flex-wrap items-center gap-1.5 self-start md:self-auto">
          {[
            { id: 'all', label: t('map.filter.all') },
            { id: 'Ouest', label: 'Mahajanga & Ouest' },
            { id: 'Hautes Terres', label: 'Hautes Terres' },
            { id: 'Sud', label: 'Sud & RN7' },
            { id: 'Nord', label: 'Nord & Nosy Be' },
            { id: 'Est', label: 'Est & Lémuriens' },
          ].map((reg) => (
            <button
              key={reg.id}
              onClick={() => setSelectedRegionFilter(reg.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedRegionFilter === reg.id
                  ? 'bg-amber-500 text-stone-950 shadow-xs'
                  : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:border-amber-400'
              }`}
            >
              {reg.label}
            </button>
          ))}

          <button
            onClick={() => setShowRoutes(!showRoutes)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1 ${
              showRoutes
                ? 'bg-stone-900 dark:bg-stone-700 text-white border-transparent'
                : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-700'
            }`}
            title="Afficher/masquer les tracés d'itinéraires"
          >
            <Route className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('map.routes')}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive SVG Vector Map + Dynamic Stage Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Interactive Madagascar Vector Map Canvas */}
        <div className="lg:col-span-7 relative flex items-center justify-center p-2 sm:p-4 bg-gradient-to-br from-sky-50/80 via-amber-50/20 to-emerald-50/30 dark:from-stone-950 dark:via-stone-900 dark:to-stone-950 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-inner">
          {/* Subtle Water Markings & Compass Rose */}
          <div className="absolute top-4 left-4 text-[10px] uppercase font-bold tracking-widest text-sky-800/40 dark:text-sky-400/20 pointer-events-none select-none">
            Canal de Mozambique
          </div>
          <div className="absolute bottom-4 right-4 text-[10px] uppercase font-bold tracking-widest text-sky-800/40 dark:text-sky-400/20 pointer-events-none select-none">
            Océan Indien
          </div>

          {/* Compass Graphic */}
          <div className="absolute top-4 right-4 w-12 h-12 rounded-full border border-stone-300/40 dark:border-stone-700/40 flex items-center justify-center pointer-events-none opacity-40">
            <Navigation className="w-5 h-5 text-amber-600 dark:text-amber-400 rotate-[-15deg]" />
          </div>

          {/* Interactive SVG */}
          <svg
            viewBox="0 0 450 720"
            className="w-full max-w-[420px] h-auto drop-shadow-md select-none transition-all"
            aria-label="Carte interactive de Madagascar"
          >
            <defs>
              <linearGradient id="islandGradientLight" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#d1fae5" />
                <stop offset="35%" stopColor="#fef3c7" />
                <stop offset="70%" stopColor="#fed7aa" />
                <stop offset="100%" stopColor="#fecdd3" />
              </linearGradient>

              <linearGradient id="islandGradientDark" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#064e3b" stopOpacity="0.8" />
                <stop offset="35%" stopColor="#78350f" stopOpacity="0.8" />
                <stop offset="70%" stopColor="#7c2d12" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#4c0519" stopOpacity="0.8" />
              </linearGradient>

              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* High-fidelity vector path representing Madagascar & Coastal Inlets */}
            <path
              d="M 325 55 
                 C 335 70, 315 95, 295 110 
                 C 280 120, 260 115, 245 130 
                 C 225 150, 205 180, 185 200 
                 C 170 215, 175 235, 165 260 
                 C 155 285, 150 310, 150 335 
                 C 145 365, 135 390, 140 430 
                 C 145 470, 160 510, 170 545 
                 C 180 580, 150 610, 150 635 
                 C 150 655, 175 675, 205 680 
                 C 225 685, 245 675, 255 655 
                 C 265 635, 260 600, 275 565 
                 C 290 530, 310 490, 320 450 
                 C 330 410, 315 375, 320 340 
                 C 325 300, 345 280, 340 245 
                 C 335 210, 310 180, 315 140 
                 C 320 100, 340 85, 325 55 Z"
              className="fill-[url(#islandGradientLight)] dark:fill-[url(#islandGradientDark)] stroke-amber-600/60 dark:stroke-amber-400/50 stroke-2 transition-all duration-300"
            />

            {/* Sainte-Marie Island (Nosy Boraha, East) */}
            <path
              d="M 345 240 C 352 250, 355 265, 348 275 C 344 265, 342 250, 345 240 Z"
              className="fill-emerald-200 dark:fill-emerald-800 stroke-emerald-600 dark:stroke-emerald-400 stroke-1.5"
            />

            {/* Nosy Be Island (North-West) */}
            <circle
              cx="245"
              cy="108"
              r="9"
              className="fill-sky-200 dark:fill-sky-800 stroke-sky-600 dark:stroke-sky-400 stroke-1.5"
            />

            {/* Circuit Route Connecting Paths (Animated dashed lines) */}
            {showRoutes &&
              circuitPaths.map((cp) => (
                <path
                  key={cp.id}
                  d={cp.d}
                  fill="none"
                  stroke={cp.color}
                  strokeWidth="3"
                  strokeDasharray="6 4"
                  strokeLinecap="round"
                  className="opacity-75 hover:opacity-100 hover:stroke-[4] transition-all cursor-pointer"
                >
                  <title>{cp.name[language] || cp.name.fr}</title>
                </path>
              ))}

            {/* Interactive Location Markers */}
            {filteredLocations.map((loc) => {
              const isSelected = selectedLocationId === loc.id;
              const isHovered = hoveredLocationId === loc.id;
              const isHQ = loc.isHQ;

              return (
                <g
                  key={loc.id}
                  className="cursor-pointer group"
                  onClick={() => setSelectedLocationId(loc.id)}
                  onMouseEnter={() => setHoveredLocationId(loc.id)}
                  onMouseLeave={() => setHoveredLocationId(null)}
                >
                  {/* Glowing halo for active or HQ pin */}
                  {(isSelected || isHovered || isHQ) && (
                    <circle
                      cx={loc.x}
                      cy={loc.y}
                      r={isHQ ? 16 : 14}
                      className={`${
                        isHQ
                          ? 'fill-amber-400/30 dark:fill-amber-400/20 stroke-amber-500 animate-ping duration-1000'
                          : 'fill-amber-500/30 dark:fill-amber-400/20'
                      }`}
                    />
                  )}

                  {/* Marker Pin Center */}
                  <circle
                    cx={loc.x}
                    cy={loc.y}
                    r={isSelected ? 8 : isHQ ? 7 : 5.5}
                    className={`transition-transform duration-200 ${
                      isHQ
                        ? 'fill-amber-500 stroke-stone-950 stroke-2'
                        : isSelected
                        ? 'fill-rose-500 stroke-white stroke-2 shadow-lg'
                        : 'fill-stone-900 dark:fill-stone-100 stroke-white dark:stroke-stone-900 stroke-1.5 hover:scale-125'
                    }`}
                  />

                  {/* Label Text for clarity */}
                  <text
                    x={loc.x + 10}
                    y={loc.y + 4}
                    className={`text-[10px] font-bold select-none pointer-events-none transition-colors ${
                      isSelected || isHovered
                        ? 'fill-stone-950 dark:fill-white font-extrabold text-[11px]'
                        : isHQ
                        ? 'fill-amber-700 dark:fill-amber-400 font-extrabold'
                        : 'fill-stone-700 dark:fill-stone-300'
                    }`}
                  >
                    {loc.name[language]?.split(' (')[0] || loc.id}
                    {isHQ && ' ★'}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Right Column: Dynamic Stage Card with Circuit Info */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 sm:p-6 shadow-sm space-y-4">
            {/* Location Tag & Title */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {activeLocation.region}
                </span>

                {activeLocation.isHQ && (
                  <span className="text-[10px] font-bold bg-amber-500 text-stone-950 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                    <Sparkles className="w-3 h-3" />
                    {t('map.baseBadge')}
                  </span>
                )}
              </div>

              <h4 className="text-xl font-extrabold text-stone-900 dark:text-white tracking-tight">
                {activeLocation.name[language] || activeLocation.name.fr}
              </h4>

              <p className="mt-2 text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-medium">
                {activeLocation.highlight[language] || activeLocation.highlight.fr}
              </p>
            </div>

            {/* Embedded Circuit Showcase Card */}
            {activeCircuit && (
              <div className="pt-3 border-t border-stone-100 dark:border-stone-800 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-20 h-16 rounded-xl overflow-hidden shrink-0 border border-stone-200 dark:border-stone-700 bg-stone-100">
                    <img
                      src={activeCircuit.mainImage}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500">
                      Circuit recommandé :
                    </span>
                    <h5 className="text-xs font-bold text-stone-900 dark:text-stone-100 line-clamp-1">
                      {activeCircuit.title[language] || activeCircuit.title.fr}
                    </h5>
                    <div className="flex items-center gap-2 text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                      <span>{activeCircuit.durationDays} {t('card.days')}</span>
                      <span>·</span>
                      <span className="font-extrabold text-amber-700 dark:text-amber-400">
                        {activeCircuit.basePriceEUR > 0 ? `${activeCircuit.basePriceEUR} €` : t('card.onQuote')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => handleOpenCircuitModal(activeCircuit)}
                    className="flex-1 py-2 px-3 bg-stone-900 hover:bg-stone-800 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-stone-950 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{t('map.viewTour')}</span>
                  </button>

                  <button
                    onClick={() => handleFilterRegionInCatalog(activeLocation.region)}
                    className="py-2 px-3 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                    title={t('map.filterRegion')}
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick hint banner */}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-50/70 dark:bg-stone-800/60 border border-amber-200/60 dark:border-stone-700/60 rounded-xl text-[11px] text-amber-900 dark:text-stone-300">
            <Info className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{t('map.clickHint')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
