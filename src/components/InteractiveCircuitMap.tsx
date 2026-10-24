import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useApp } from '../context/AppContext';
import { Circuit, TourDifficulty } from '../types';
import {
  Compass,
  MapPin,
  Layers,
  Sparkles,
  Eye,
  Maximize2,
  Minimize2,
  Calendar,
  Clock,
  Navigation,
  Info,
  CheckCircle2,
  ArrowRight,
  Filter,
  Plus,
  Minus,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

// Helper to get color code based on circuit difficulty (Green = Easy, Orange = Moderate, Red = Challenging)
export const getCircuitDifficultyColor = (difficulty: TourDifficulty): string => {
  switch (difficulty) {
    case 'facile':
      return '#10b981'; // Green (Easy / Accessible / Famille)
    case 'modérée':
      return '#f97316'; // Orange (Moderate / Randonnée & pistes)
    case 'soutenue':
      return '#ef4444'; // Red (Challenging / Treks engagés & Makay)
    default:
      return '#f59e0b'; // Amber default
  }
};

interface PointOfInterest {
  id: string;
  name: { fr: string; en: string; mg: string };
  lat: number;
  lng: number;
  region: string;
  category: 'national_park' | 'nature_reserve' | 'beach' | 'culture' | 'city' | 'canyon';
  description: { fr: string; en: string; mg: string };
  highlights: string[];
  circuitIds: string[];
  isHQ?: boolean;
}

// Comprehensive GPS Coordinates for Madagascar Points of Interest
const MADAGASCAR_POIS: PointOfInterest[] = [
  {
    id: 'mahajanga',
    name: {
      fr: 'Mahajanga (Siège Ravinala Tours)',
      en: 'Mahajanga (Ravinala Tours HQ)',
      mg: 'Mahajanga (Foiben\'ny Ravinala Tours)',
    },
    lat: -15.7167,
    lng: 46.3167,
    region: 'Ouest',
    category: 'city',
    isHQ: true,
    description: {
      fr: 'Cité des fleurs, grand baobab centenaire, plages du Grand Pavois et portes des expéditions de l\'Ouest.',
      en: 'City of flowers, massive centuries-old baobab, Grand Pavois beaches, and western expedition hub.',
      mg: 'Renivohitry ny voninkazo, baobab vaventy, torapasiky ny Grand Pavois ary fiaingana miankandrefana.',
    },
    highlights: ['Siège Ravinala Tours', 'Baobab géant', 'Cirque Rouge', 'Grand Pavois'],
    circuitIds: ['circ-06'],
  },
  {
    id: 'ankarafantsika',
    name: {
      fr: 'Parc National d\'Ankarafantsika',
      en: 'Ankarafantsika National Park',
      mg: 'Valan-javaboary Ankarafantsika',
    },
    lat: -16.315,
    lng: 46.815,
    region: 'Ouest',
    category: 'national_park',
    description: {
      fr: 'Forêt sèche caducifoliée abritant 8 espèces de lémuriens dont le microcèbe pygmée et le pygargue de Madagascar.',
      en: 'Dense deciduous dry forest home to 8 lemur species including mouse lemurs and Madagascar fish eagle.',
      mg: 'Ala maina misy karazana gidro 8 sy voromahery mpihaza trondro.',
    },
    highlights: ['Lac Ravelobe', 'Lémuriens nocturnes', 'Canyon Lavaka'],
    circuitIds: ['circ-06'],
  },
  {
    id: 'antananarivo',
    name: {
      fr: 'Antananarivo (Ivato & Haute Ville)',
      en: 'Antananarivo (Ivato Hub & Upper Town)',
      mg: 'Antananarivo (Renivohitra & Ivato)',
    },
    lat: -18.8792,
    lng: 47.5079,
    region: 'Hautes Terres',
    category: 'city',
    description: {
      fr: 'Capitale aux milles collines, point de départ et d\'arrivée des grands vols internationaux.',
      en: 'Capital city across historic royal hills, starting crossroad for island-wide safaris.',
      mg: 'Renivohitra misy ny seranam-piaramanidina Ivato sy ny lapan\'ny mpanjaka.',
    },
    highlights: ['Palais du Rova', 'Marché artisanal', 'Briefing de départ'],
    circuitIds: ['circ-01', 'circ-02', 'circ-04', 'circ-05', 'circ-07'],
  },
  {
    id: 'ambohimanga',
    name: {
      fr: 'Colline Royale d\'Ambohimanga (UNESCO)',
      en: 'Royal Hill of Ambohimanga (UNESCO)',
      mg: 'Rovan\'Ambohimanga (UNESCO)',
    },
    lat: -18.7614,
    lng: 47.5619,
    region: 'Hautes Terres',
    category: 'culture',
    description: {
      fr: 'Cité royale fortifiée berceau de la royauté Merina, classée au patrimoine mondial.',
      en: 'Historic fortified royal village, spiritual cradle of the Merina kingdom.',
      mg: 'Toerana masina sy fonenan\'ireo mpanjaka nifandimby teto Imerina.',
    },
    highlights: ['Palais royal en bois', 'Arbres sacrés', 'Vue panoramique'],
    circuitIds: ['circ-07'],
  },
  {
    id: 'antsirabe',
    name: {
      fr: 'Antsirabe (Ville d\'Eau & Pousse-Pousse)',
      en: 'Antsirabe (Thermal Springs & Rickshaws)',
      mg: 'Antsirabe (Loharano mafana & Pousse-pousse)',
    },
    lat: -19.8659,
    lng: 47.0333,
    region: 'Hautes Terres',
    category: 'culture',
    description: {
      fr: 'Capitale du pousse-pousse, sources thermales, taille de pierres précieuses et cornes de zébu.',
      en: 'Thermal spa town renowned for colorful rickshaws, gemstone polishing, and zebu horn craftsmanship.',
      mg: 'Tanàna mangatsiaka malaza amin\'ny pousse-pousse sy asa tanana vatosoa.',
    },
    highlights: ['Lac Tritriva', 'Ateliers de marqueterie', 'Sources thermales'],
    circuitIds: ['circ-01', 'circ-05'],
  },
  {
    id: 'ambositra',
    name: {
      fr: 'Ambositra (Art Zafimaniry UNESCO)',
      en: 'Ambositra (Zafimaniry Woodcraft)',
      mg: 'Ambositra (Sokitra Zafimaniry)',
    },
    lat: -20.5303,
    lng: 47.2436,
    region: 'Hautes Terres',
    category: 'culture',
    description: {
      fr: 'Carrefour de l\'ébénisterie et de la sculpture sur bois des peuples Zafimaniry.',
      en: 'Capital of master wood-carving and marquetry crafted by Zafimaniry artisans.',
      mg: 'Renivohitry ny sokitra hazo sy ny fahaiza-manao Zafimaniry.',
    },
    highlights: ['Sculpture sur bois précieux', 'Villages perchés'],
    circuitIds: ['circ-01'],
  },
  {
    id: 'ranomafana',
    name: {
      fr: 'Parc National de Ranomafana',
      en: 'Ranomafana Rainforest National Park',
      mg: 'Valan-javaboary Ranomafana',
    },
    lat: -21.2583,
    lng: 47.4567,
    region: 'Sud',
    category: 'national_park',
    description: {
      fr: 'Forêt tropicale humide de montagne, royaume de l\'hapalémur doré et des caméléons.',
      en: 'Mist-shrouded montane rainforest habitat of the rare Golden Bamboo Lemur and giant tree ferns.',
      mg: 'Ala mando an-tendrombohitra misy ny Hapalemur aureus sy ireo karazam-borona maro.',
    },
    highlights: ['Hapalémur doré', 'Sources d\'eau chaude', 'Pistage guidé'],
    circuitIds: ['circ-01'],
  },
  {
    id: 'fianarantsoa',
    name: {
      fr: 'Fianarantsoa (Vieille Ville Betsileo)',
      en: 'Fianarantsoa (Betsileo Old Town)',
      mg: 'Fianarantsoa (Tanàna Taloha)',
    },
    lat: -21.4536,
    lng: 47.0858,
    region: 'Sud',
    category: 'culture',
    description: {
      fr: 'Capitale culturelle du pays Betsileo, ruelles pavées pittoresques et vignobles.',
      en: 'Cultural capital of the Betsileo people with historic cobblestone lanes and vineyards.',
      mg: 'Renivohitry ny foko Betsileo, tanàna taloha sy havoana mahafinaritra.',
    },
    highlights: ['Vieille Ville Haute', 'Atelier photo Pierrot Men', 'Vignobles'],
    circuitIds: ['circ-01'],
  },
  {
    id: 'anja',
    name: {
      fr: 'Réserve Communautaire d\'Anja',
      en: 'Anja Community Reserve',
      mg: 'Tahirin-javaboary Anja (Ambalavao)',
    },
    lat: -21.85,
    lng: 46.9833,
    region: 'Sud',
    category: 'nature_reserve',
    description: {
      fr: 'Éperons granitiques spectaculaires abritant d\'immenses colonies de lémuriens Catta à queue annelée.',
      en: 'Dramatic towering granitic domes harboring wild colonies of iconic ring-tailed lemurs.',
      mg: 'Vatolampy goavana ahitana ireo Maki catta marobe miriaria.',
    },
    highlights: ['Lémuriens Maki catta', 'Grottes sacrées Bara', 'Gestion communautaire'],
    circuitIds: ['circ-01'],
  },
  {
    id: 'isalo',
    name: {
      fr: 'Parc National de l\'Isalo (Ranohira)',
      en: 'Isalo National Park (Sandstone Canyons)',
      mg: 'Valan-javaboary Isalo (Ranohira)',
    },
    lat: -22.5833,
    lng: 45.3833,
    region: 'Sud',
    category: 'canyon',
    description: {
      fr: 'Canyons de grès ruiniformes sculptés par l\'érosion, piscines naturelles et couchers de soleil à la Fenêtre de l\'Isalo.',
      en: 'Jurassic sandstone labyrinth featuring natural green pools, desert canyons, and glowing sunset window.',
      mg: 'Vatolampy kanto misy hantsana lalina, dobo voajanahary ary filentehan\'ny masoandro.',
    },
    highlights: ['Piscine naturelle', 'Canyon des Singes', 'Fenêtre de l\'Isalo'],
    circuitIds: ['circ-01'],
  },
  {
    id: 'tulear_ifaty',
    name: {
      fr: 'Tuléar & Lagon d\'Ifaty',
      en: 'Toliara & Ifaty Coral Lagoon',
      mg: 'Toliara & Torapasik\'Ifaty',
    },
    lat: -23.15,
    lng: 43.6167,
    region: 'Sud',
    category: 'beach',
    description: {
      fr: 'Terminus de la RN7, récif de corail du canal de Mozambique et forêt d\'épineux aux baobabs bouteilles.',
      en: 'Final stop of RN7 expedition featuring coral barrier reefs and spiny forest of bottle baobabs.',
      mg: 'Faran\'ny RN7 amoron-dranomasina, vatohara sy ala misy tsilo.',
    },
    highlights: ['Forêt de Baobabs bouteilles', 'Pêcheurs Vezo', 'Lagon turquoise'],
    circuitIds: ['circ-01', 'circ-05'],
  },
  {
    id: 'miandrivazo',
    name: {
      fr: 'Miandrivazo (Embarquement Tsiribihina)',
      en: 'Miandrivazo (Tsiribihina Kickoff)',
      mg: 'Miandrivazo (Fiaingana an-drano)',
    },
    lat: -19.5333,
    lng: 45.4667,
    region: 'Ouest',
    category: 'city',
    description: {
      fr: 'Point de départ fluvial des descentes en chaland ou pirogue sur le fleuve Tsiribihina.',
      en: 'River port embarkation for scenic expeditions down the tranquil Tsiribihina river.',
      mg: 'Toerana fiaingana lakana sy sambo mamakivaky ny renirano Tsiribihina.',
    },
    highlights: ['Fleuve Tsiribihina', 'Falaises rouges', 'Bivouacs sauvages'],
    circuitIds: ['circ-02'],
  },
  {
    id: 'tsingy_bemaraha',
    name: {
      fr: 'Tsingy de Bemaraha (UNESCO)',
      en: 'Tsingy de Bemaraha (UNESCO World Heritage)',
      mg: 'Tsingin\'i Bemaraha (UNESCO)',
    },
    lat: -18.7833,
    lng: 44.7167,
    region: 'Ouest',
    category: 'canyon',
    description: {
      fr: 'Forêt minérale de cathédrales calcaires acérées et ponts suspendus vertigineux au-dessus de la canopée.',
      en: 'Awe-inspiring labyrinth of razor-sharp limestone needles and suspension bridges.',
      mg: 'Vatolampy maranitra manaitra sy tetezana mihantona an-tampon-kazo.',
    },
    highlights: ['Grands Tsingy', 'Pont suspendu aérien', 'Gorges de la Manambolo'],
    circuitIds: ['circ-02'],
  },
  {
    id: 'morondava_baobabs',
    name: {
      fr: 'Morondava & Allée des Baobabs',
      en: 'Morondava & Avenue of the Baobabs',
      mg: 'Morondava & Lalam-ben\'ny Baobab',
    },
    lat: -20.25,
    lng: 44.4167,
    region: 'Ouest',
    category: 'nature_reserve',
    description: {
      fr: 'Alignement mondialement célèbre de baobabs géants Adansonia grandidieri vieux de plus de 800 ans.',
      en: 'World-famous corridor of monumental 800-year-old Grandidier baobabs.',
      mg: 'Ireo baobab goavana milahatra malaza eran-tany amin\'ny filentehan\'ny masoandro.',
    },
    highlights: ['Coucher de soleil sur l\'Allée', 'Baobabs amoureux', 'Forêt de Kirindy'],
    circuitIds: ['circ-02'],
  },
  {
    id: 'diego_suarez',
    name: {
      fr: 'Diego-Suarez (Baie d\'Antsiranana)',
      en: 'Diego-Suarez (Antsiranana Bay)',
      mg: 'Antsiranana (Helodranon\'i Diego)',
    },
    lat: -12.2833,
    lng: 49.2833,
    region: 'Nord',
    category: 'city',
    description: {
      fr: 'Deuxième plus grande baie naturelle du monde après Rio, Pain de Sucre et alizés vivifiants.',
      en: 'Second largest natural bay in the world, Sugarloaf rock, and marine jewel of the North.',
      mg: 'Helodrano lehibe faharoa eran-tany misy ny Nosy Lonjo sy rivotra madio.',
    },
    highlights: ['Mer d\'Émeraude', 'Pain de Sucre Nosy Lonjo', '3 Baies'],
    circuitIds: ['circ-03'],
  },
  {
    id: 'montagne_ambre',
    name: {
      fr: 'Montagne d\'Ambre & Tsingy Rouges',
      en: 'Amber Mountain & Red Tsingy',
      mg: 'Montagne d\'Ambre & Tsingy Mena',
    },
    lat: -12.5167,
    lng: 49.1667,
    region: 'Nord',
    category: 'national_park',
    description: {
      fr: 'Oasis volcanique luxuriante avec cascades sacrées, chameleons pygmées et cheminées de fées de latérite rouge.',
      en: 'Volcanic rainforest massif with sacred waterfalls and delicate red sedimentary tsingy.',
      mg: 'Ala mando misy riandrano masina sy ireo Tsingy mena vokatry ny fikaohan-tany.',
    },
    highlights: ['Micro-caméléon Brookesia', 'Grandes cascades', 'Tsingy Rouges d\'Irodo'],
    circuitIds: ['circ-03'],
  },
  {
    id: 'ankarana',
    name: {
      fr: 'Réserve Spéciale de l\'Ankarana',
      en: 'Ankarana Special Reserve',
      mg: 'Tahirin-javaboary Ankarana',
    },
    lat: -12.9167,
    lng: 49.1333,
    region: 'Nord',
    category: 'canyon',
    description: {
      fr: 'Plateau calcaire karstique sculpté de grottes secrètes, rivières souterraines et chauves-souris.',
      en: 'Karst limestone fortress riddled with subterranean bat-filled rivers and green canyons.',
      mg: 'Vatolampy feno lavaka tany sy rano ambanin\'ny tany ary fialofan\'ny ramanavy.',
    },
    highlights: ['Tourelles de Tsingy', 'Grotte des Chauves-Souris', 'Perte de rivière'],
    circuitIds: ['circ-03'],
  },
  {
    id: 'nosy_be',
    name: {
      fr: 'Archipel de Nosy Be & Nosy Tanikely',
      en: 'Nosy Be Archipelago & Marine Park',
      mg: 'Nosy Be sy Nosy Tanikely',
    },
    lat: -13.3167,
    lng: 48.2667,
    region: 'Nord',
    category: 'beach',
    description: {
      fr: 'Île aux parfums, plantations d\'ylang-ylang, réserve marine de corail de Tanikely et lémuriens noirs de Nosy Komba.',
      en: 'Perfume Island, fragrant ylang-ylang distilleries, and crystal-clear marine turtle sanctuaries.',
      mg: 'Nosy manitra malaza amin\'ny ylang-ylang sy ny fano milomano ao Tanikely.',
    },
    highlights: ['Tortues marines de Tanikely', 'Plage d\'Andilana', 'Mont Passot'],
    circuitIds: ['circ-03'],
  },
  {
    id: 'andasibe',
    name: {
      fr: 'Parc National d\'Andasibe-Mantadia',
      en: 'Andasibe-Mantadia Rainforest',
      mg: 'Valan-javaboary Andasibe-Mantadia',
    },
    lat: -18.9333,
    lng: 48.4167,
    region: 'Est',
    category: 'national_park',
    description: {
      fr: 'Le royaume incontesté de l\'Indri indri, le plus grand lémurien vivant au chant puissant et envoûtant.',
      en: 'Pristine rainforest kingdom of the Indri indri, the largest living lemur with haunting calls.',
      mg: 'Aloky ny Babakoto (Indri indri), gidro lehibe indrindra eto an-tany.',
    },
    highlights: ['Chant de l\'Indri indri', 'Orchidées sauvages', 'Sorties nocturnes'],
    circuitIds: ['circ-04'],
  },
  {
    id: 'sainte_marie',
    name: {
      fr: 'Île Sainte-Marie & Île aux Nattes',
      en: 'Sainte-Marie Island & Whale Bay',
      mg: 'Nosy Boraha (Sainte-Marie) & Nosy Nato',
    },
    lat: -16.9042,
    lng: 49.9008,
    region: 'Est',
    category: 'beach',
    description: {
      fr: 'Ancien repaire de pirates, lagon turquoise protégé et sanctuaire des baleines à bosse de juillet à septembre.',
      en: 'Historic pirate haven, coral-encircled lagoon, and humpback whale nursery from July to September.',
      mg: 'Nosy fialofan\'ny jiolahin-tsambo taloha sy toerana fiterahan\'ny trozona.',
    },
    highlights: ['Safari baleines à bosse', 'Île aux Nattes à pied', 'Cimetière des pirates'],
    circuitIds: ['circ-04'],
  },
  {
    id: 'makay',
    name: {
      fr: 'Massif du Makay (Expédition Aventure)',
      en: 'Makay Massif (Wild Wilderness Trek)',
      mg: 'Vohitr\'i Makay (Dia fikarohana)',
    },
    lat: -21.4167,
    lng: 45.25,
    region: 'Sud',
    category: 'canyon',
    description: {
      fr: 'Forteresse de grès jaune totalement vierge, canyons inexplorés et peintures rupestres millénaires.',
      en: 'One of Earth\'s last unexplored sandstone massifs with deep gorges and rock art.',
      mg: 'Hantsana lalina mbola tsy voakitika misy sary hosodoko tranainy.',
    },
    highlights: ['Trekking aquatique dans les gorges', 'Bivouac étoilé', 'Isolement total'],
    circuitIds: ['circ-05'],
  },
];

// Realistic GPS Coordinate Itineraries for Circuit Polylines
const CIRCUIT_ROUTES: Record<string, { color: string; coordinates: [number, number][] }> = {
  'circ-01': {
    color: '#d97706', // Amber-600 (RN7 Classic)
    coordinates: [
      [-18.8792, 47.5079], // Antananarivo
      [-19.8659, 47.0333], // Antsirabe
      [-20.5303, 47.2436], // Ambositra
      [-21.2583, 47.4567], // Ranomafana
      [-21.4536, 47.0858], // Fianarantsoa
      [-21.85, 46.9833],   // Anja / Ambalavao
      [-22.4, 46.2],      // Plateau de l'Ihorombe
      [-22.5833, 45.3833], // Isalo (Ranohira)
      [-23.35, 44.1],      // Sakaraha
      [-23.3516, 43.6675], // Tuléar
      [-23.15, 43.6167],   // Ifaty Lagoon
    ],
  },
  'circ-02': {
    color: '#0284c7', // Sky-600 (Tsiribihina river & Tsingy)
    coordinates: [
      [-18.8792, 47.5079], // Antananarivo
      [-19.5333, 45.4667], // Miandrivazo
      [-19.35, 44.9],      // Gorge Tsiribihina
      [-19.0, 44.75],      // Belo-sur-Tsiribihina
      [-18.7833, 44.7167], // Tsingy de Bemaraha (Bekopaka)
      [-19.5, 44.5],       // Forêt de Kirindy
      [-20.25, 44.4167],   // Allée des Baobabs
      [-20.2986, 44.2825], // Morondava
    ],
  },
  'circ-03': {
    color: '#059669', // Emerald-600 (North & Nosy Be)
    coordinates: [
      [-12.2833, 49.2833], // Diego-Suarez
      [-12.22, 49.35],     // Mer d'Émeraude
      [-12.5167, 49.1667], // Montagne d'Ambre
      [-12.63, 49.3],      // Tsingy Rouges
      [-12.9167, 49.1333], // Ankarana
      [-13.68, 48.33],     // Port d'Ankify
      [-13.3167, 48.2667], // Nosy Be (Hell-Ville / Andilana)
      [-13.48, 48.23],     // Nosy Tanikely
    ],
  },
  'circ-04': {
    color: '#7c3aed', // Purple-600 (Est & Sainte-Marie)
    coordinates: [
      [-18.8792, 47.5079], // Antananarivo
      [-18.9333, 48.4167], // Andasibe-Mantadia
      [-18.5, 48.9],       // Brickaville / Pangalanes
      [-18.15, 49.4],      // Tamatave
      [-16.91, 49.58],     // Soanierana Ivongo
      [-16.9042, 49.9008], // Île Sainte-Marie
      [-17.1, 49.88],      // Île aux Nattes
    ],
  },
  'circ-05': {
    color: '#e11d48', // Rose-600 (Makay Trek)
    coordinates: [
      [-18.8792, 47.5079], // Antananarivo
      [-19.8659, 47.0333], // Antsirabe
      [-20.3, 45.9],       // Malaimbandy
      [-21.4167, 45.25],   // Massif du Makay
      [-21.65, 45.1],      // Beroroha
      [-23.3516, 43.6675], // Tuléar
    ],
  },
  'circ-06': {
    color: '#f59e0b', // Amber-500 (Mahajanga Boeny Hub)
    coordinates: [
      [-15.7167, 46.3167], // Mahajanga
      [-15.65, 46.35],     // Cirque Rouge & Grand Pavois
      [-16.315, 46.815],   // Parc National Ankarafantsika
      [-15.7167, 46.3167], // Retour Mahajanga
    ],
  },
  'circ-07': {
    color: '#b45309', // Amber-700 (Merina Heritage)
    coordinates: [
      [-18.8792, 47.5079], // Antananarivo
      [-18.7614, 47.5619], // Ambohimanga UNESCO
      [-18.8792, 47.5079], // Antananarivo Digue
    ],
  },
};

// Generates accurate GPS path for predefined circuits and automatic region routes for any new circuit added in admin
export const getCircuitCoordinates = (circuit: Circuit): [number, number][] => {
  if (CIRCUIT_ROUTES[circuit.id]?.coordinates) {
    return CIRCUIT_ROUTES[circuit.id].coordinates;
  }
  // Region-aware geographic coordinates for newly created circuits
  switch (circuit.region) {
    case 'Nord':
      return [
        [-12.2833, 49.2833], // Diego-Suarez
        [-12.5167, 49.1667], // Montagne d'Ambre
        [-12.9167, 49.1333], // Ankarana
        [-13.3167, 48.2667], // Nosy Be
      ];
    case 'Sud':
      return [
        [-18.8792, 47.5079], // Antananarivo
        [-19.8659, 47.0333], // Antsirabe
        [-21.4536, 47.0858], // Fianarantsoa
        [-22.5833, 45.3667], // Isalo
        [-23.3516, 43.6675], // Tuléar
      ];
    case 'Ouest':
      return [
        [-18.8792, 47.5079], // Antananarivo
        [-19.5333, 45.4667], // Miandrivazo
        [-18.7833, 44.7167], // Tsingy de Bemaraha
        [-20.25, 44.4167],   // Allée des Baobabs
        [-20.2986, 44.2825], // Morondava
      ];
    case 'Est':
      return [
        [-18.8792, 47.5079], // Antananarivo
        [-18.9333, 48.4167], // Andasibe
        [-18.15, 49.4],      // Tamatave
        [-16.9042, 49.9008], // Sainte-Marie
      ];
    case 'Îles':
      return [
        [-13.3167, 48.2667], // Nosy Be
        [-13.48, 48.23],     // Nosy Tanikely
        [-13.25, 48.30],     // Nosy Komba
      ];
    case 'Hautes Terres':
    default:
      return [
        [-18.8792, 47.5079], // Antananarivo
        [-18.7614, 47.5619], // Ambohimanga
        [-19.8659, 47.0333], // Antsirabe
      ];
  }
};

interface InteractiveCircuitMapProps {
  filteredCircuits?: Circuit[];
  highlightCircuitId?: string;
  onSelectCircuit?: (circuit: Circuit) => void;
  heightClass?: string;
}

export const InteractiveCircuitMap: React.FC<InteractiveCircuitMapProps> = ({
  filteredCircuits,
  highlightCircuitId,
  onSelectCircuit,
  heightClass = 'h-[520px] lg:h-[620px]',
}) => {
  const { language, t, circuits, setSelectedCircuit, openQuoteModal, theme } = useApp();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layersGroupRef = useRef<L.LayerGroup | null>(null);

  const [activeCircuitId, setActiveCircuitId] = useState<string | null>(highlightCircuitId || null);
  const [activeTileLayer, setActiveTileLayer] = useState<'voyager' | 'satellite' | 'topo'>('voyager');
  const [selectedPOI, setSelectedPOI] = useState<PointOfInterest | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLegendOpen, setIsLegendOpen] = useState(true);

  // Sync with highlightCircuitId prop
  useEffect(() => {
    if (highlightCircuitId) {
      setActiveCircuitId(highlightCircuitId);
    }
  }, [highlightCircuitId]);

  // Determine which circuits to show on map
  const activeCircuitsList = useMemo(() => {
    if (filteredCircuits && filteredCircuits.length > 0) {
      return filteredCircuits;
    }
    return circuits;
  }, [filteredCircuits, circuits]);

  // Points of interest filtered by active circuits
  const activePOIs = useMemo(() => {
    const activeCircuitIds = new Set(activeCircuitsList.map((c) => c.id));
    return MADAGASCAR_POIS.filter((poi) =>
      poi.circuitIds.some((cid) => activeCircuitIds.has(cid)) || poi.isHQ
    );
  }, [activeCircuitsList]);

  // Auto-fit bounds function to center and zoom on all current filtered circuits & stops
  const fitToAllFilteredCircuits = () => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const bounds = L.latLngBounds([]);

    activeCircuitsList.forEach((circuit) => {
      const coords = getCircuitCoordinates(circuit);
      coords.forEach((coord) => bounds.extend(coord));
    });

    activePOIs.forEach((poi) => {
      bounds.extend([poi.lat, poi.lng]);
    });

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 8, animate: true });
    } else {
      map.fitBounds([[-25.6, 43.2], [-11.9, 50.6]], { padding: [20, 20], animate: true });
    }
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Create map centered on Madagascar
      const map = L.map(mapContainerRef.current, {
        center: [-18.7669, 46.8691],
        zoom: 6,
        minZoom: 5,
        maxZoom: 12,
        maxBounds: [
          [-26.5, 41.5],
          [-11.0, 52.5],
        ],
        zoomControl: false, // Custom styled zoom controls used instead
        attributionControl: false,
      });

      // Attribution
      L.control.attribution({ position: 'bottomright', prefix: false })
        .addAttribution('&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | Ravinala Tours')
        .addTo(map);

      mapInstanceRef.current = map;
      layersGroupRef.current = L.layerGroup().addTo(map);
    }

    return () => {
      // Map cleanup on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        layersGroupRef.current = null;
      }
    };
  }, []);

  // Update Tile Layers when theme or activeTileLayer changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove existing tile layer if any
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    let tileUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    let subdomains = 'abcd';

    if (activeTileLayer === 'satellite') {
      tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{x}/{y}';
      subdomains = 'abc';
    } else if (activeTileLayer === 'topo') {
      tileUrl = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
      subdomains = 'abc';
    } else if (theme === 'dark') {
      // CartoDB Dark Matter for sleek night mode
      tileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    }

    L.tileLayer(tileUrl, {
      subdomains,
      maxZoom: 18,
    }).addTo(map);
  }, [activeTileLayer, theme]);

  // Render Circuit Routes and POI Markers based on active filtered circuits
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layersGroup = layersGroupRef.current;
    if (!map || !layersGroup) return;

    layersGroup.clearLayers();

    // 1. Draw Circuit Paths with Color-coding by Difficulty (Green = Easy, Orange = Moderate, Red = Challenging)
    activeCircuitsList.forEach((circuit) => {
      const routeCoordinates = getCircuitCoordinates(circuit);

      // Route color directly represents difficulty
      const routeColor = getCircuitDifficultyColor(circuit.difficulty);

      const isFocused = activeCircuitId === circuit.id;
      const isAnyFocused = Boolean(activeCircuitId);

      const title = circuit.title[language] || circuit.title['fr'];
      const weight = isFocused ? 7 : isAnyFocused ? 2.5 : 4.5;
      const opacity = isFocused ? 1 : isAnyFocused ? 0.35 : 0.82;

      const polyline = L.polyline(routeCoordinates, {
        color: routeColor,
        weight,
        opacity,
        dashArray: isFocused ? '8, 6' : undefined,
        lineCap: 'round',
        lineJoin: 'round',
      });

      // Interactive hover & click on polyline
      polyline.on('mouseover', () => {
        if (!activeCircuitId) {
          polyline.setStyle({ weight: 6.5, opacity: 1 });
        }
      });

      polyline.on('mouseout', () => {
        if (!activeCircuitId) {
          polyline.setStyle({ weight: 4.5, opacity: 0.82 });
        }
      });

      polyline.on('click', () => {
        setActiveCircuitId(circuit.id);
        if (onSelectCircuit) {
          onSelectCircuit(circuit);
        }
        map.fitBounds(polyline.getBounds(), { padding: [50, 50], maxZoom: 8, animate: true });
      });

      // Tooltip styling with difficulty badge
      const diffLabel =
        circuit.difficulty === 'facile'
          ? (language === 'en' ? 'Easy' : language === 'mg' ? 'Mora' : 'Facile')
          : circuit.difficulty === 'modérée'
          ? (language === 'en' ? 'Moderate' : language === 'mg' ? 'Antonony' : 'Modérée')
          : (language === 'en' ? 'Challenging' : language === 'mg' ? 'Mafy' : 'Soutenue');

      polyline.bindTooltip(
        `<div class="font-bold text-xs">${title}</div>
         <div class="flex items-center gap-1.5 mt-0.5 text-[10px]">
           <span class="inline-block w-2 h-2 rounded-full" style="background-color: ${routeColor}"></span>
           <span class="font-semibold">${diffLabel}</span> · <span>${circuit.durationDays}j</span> · <span class="font-bold">${circuit.basePriceEUR} €</span>
         </div>`,
        { sticky: true, className: 'leaflet-custom-tooltip' }
      );

      layersGroup.addLayer(polyline);
    });

    // 2. Draw Points of Interest (POIs)
    activePOIs.forEach((poi) => {
      const belongsToActiveCircuit = activeCircuitId
        ? poi.circuitIds.includes(activeCircuitId)
        : true;

      const poiName = poi.name[language] || poi.name['fr'];

      // Distinctive Custom DivIcon
      let iconHtml = '';
      if (poi.isHQ) {
        iconHtml = `
          <div class="relative group">
            <div class="w-8 h-8 rounded-lg bg-amber-500 text-stone-950 font-black text-xs flex items-center justify-center shadow-lg border-2 border-white ring-2 ring-amber-500 transform transition-transform hover:scale-125">
              R
            </div>
            <span class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
          </div>
        `;
      } else {
        const pinBg = belongsToActiveCircuit
          ? 'bg-stone-900 dark:bg-stone-100 text-amber-400 dark:text-stone-900 border-amber-500'
          : 'bg-stone-500 text-white border-stone-200';
        iconHtml = `
          <div class="w-6 h-6 rounded-full ${pinBg} flex items-center justify-center text-[10px] font-bold shadow-md border-2 transform transition-transform hover:scale-125">
            ★
          </div>
        `;
      }

      const customIcon = L.divIcon({
        className: 'custom-poi-marker',
        html: iconHtml,
        iconSize: poi.isHQ ? [32, 32] : [24, 24],
        iconAnchor: poi.isHQ ? [16, 16] : [12, 12],
      });

      const marker = L.marker([poi.lat, poi.lng], { icon: customIcon });

      marker.on('click', () => {
        setSelectedPOI(poi);
        map.setView([poi.lat, poi.lng], Math.max(map.getZoom(), 7), { animate: true });
      });

      marker.bindTooltip(
        `<div class="font-bold text-xs">${poiName}</div><div class="text-[10px] text-amber-600">${poi.region}</div>`,
        { direction: 'top', offset: [0, -12] }
      );

      layersGroup.addLayer(marker);
    });
  }, [activeCircuitsList, activeCircuitId, activePOIs, language, onSelectCircuit]);

  // CRITICAL REQUIREMENT: Automatically adjust zoom and center (fitBounds) whenever filteredCircuits changes
  const filteredCircuitIds = useMemo(() => {
    return (filteredCircuits || []).map((c) => c.id).sort().join(',');
  }, [filteredCircuits]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // If an active circuit was selected that is no longer in filteredCircuits, clear selection
    if (activeCircuitId && filteredCircuits && !filteredCircuits.some((c) => c.id === activeCircuitId)) {
      setActiveCircuitId(null);
    }

    // Auto-fit bounds on all matching circuits
    fitToAllFilteredCircuits();
  }, [filteredCircuitIds]);

  const handleResetMap = () => {
    setActiveCircuitId(null);
    setSelectedPOI(null);
    fitToAllFilteredCircuits();
  };

  const activeCircuitObj = circuits.find((c) => c.id === activeCircuitId);

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 shadow-lg bg-stone-100 dark:bg-stone-950 flex flex-col ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen' : heightClass
      }`}
    >
      {/* Map Header Toolbar */}
      <div className="bg-white/95 dark:bg-stone-900/95 backdrop-blur-md px-4 py-3 border-b border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3 z-10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500 text-stone-950 flex items-center justify-center font-bold text-xs shadow-xs">
            R
          </div>
          <div>
            <div className="text-xs font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
              <span>{language === 'mg' ? 'Sarin-tany ifandrimbonana' : language === 'en' ? 'Interactive Circuit Map' : 'Carte Interactive des Circuits'}</span>
              <span className="text-[10px] font-semibold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full border border-amber-300 dark:border-amber-800">
                {activeCircuitsList.length} {language === 'en' ? 'itineraries' : 'itinéraires'}
              </span>
            </div>
            <div className="text-[10px] text-stone-500 dark:text-stone-400">
              {language === 'mg'
                ? 'Araka ny sivana nosafidianao · Tsindrio ny lalam-pitetezana mba hahitana ny antsipiriany'
                : language === 'en'
                ? 'Synchronized with active filters · Click paths & pins to explore'
                : 'Synchronisée avec vos filtres · Cliquez sur un tracé ou une étape'}
            </div>
          </div>
        </div>

        {/* Controls: Reset, Map Layers, Fullscreen */}
        <div className="flex items-center gap-2">
          {/* Layer switcher */}
          <div className="flex items-center bg-stone-100 dark:bg-stone-800 p-0.5 rounded-lg border border-stone-200 dark:border-stone-700 text-[11px] font-medium">
            <button
              onClick={() => setActiveTileLayer('voyager')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                activeTileLayer === 'voyager'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white font-bold shadow-xs'
                  : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
              }`}
            >
              Plan
            </button>
            <button
              onClick={() => setActiveTileLayer('satellite')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                activeTileLayer === 'satellite'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white font-bold shadow-xs'
                  : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
              }`}
            >
              Satellite
            </button>
            <button
              onClick={() => setActiveTileLayer('topo')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                activeTileLayer === 'topo'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white font-bold shadow-xs'
                  : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
              }`}
            >
              Relief
            </button>
          </div>

          {/* Reset View Button */}
          <button
            onClick={handleResetMap}
            className="p-1.5 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-lg border border-stone-200 dark:border-stone-700 transition-colors cursor-pointer"
            title="Recadrer la carte sur tout Madagascar"
          >
            <Compass className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </button>

          {/* Toggle Fullscreen */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-lg border border-stone-200 dark:border-stone-700 transition-colors cursor-pointer"
            title={isFullscreen ? 'Quitter le plein écran' : 'Agrandir la carte'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Map Canvas Area */}
      <div className="relative flex-1 w-full h-full min-h-[380px]">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Floating Custom Map Zoom & Navigation Controls */}
        <div className="absolute top-4 right-4 z-[400] flex flex-col gap-2 pointer-events-auto">
          {/* Zoom In button */}
          <button
            type="button"
            onClick={() => mapInstanceRef.current?.zoomIn()}
            className="w-10 h-10 rounded-xl bg-white/95 dark:bg-stone-900/95 backdrop-blur-md shadow-lg border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-100 hover:bg-amber-500 hover:text-stone-950 dark:hover:bg-amber-500 dark:hover:text-stone-950 flex items-center justify-center transition-all cursor-pointer group active:scale-95"
            title={language === 'en' ? 'Zoom in' : language === 'mg' ? 'Hanamaro / Hanakaiky' : 'Zoom avant'}
            aria-label="Zoom in"
          >
            <Plus className="w-5 h-5 transition-transform group-hover:scale-110" />
          </button>

          {/* Zoom Out button */}
          <button
            type="button"
            onClick={() => mapInstanceRef.current?.zoomOut()}
            className="w-10 h-10 rounded-xl bg-white/95 dark:bg-stone-900/95 backdrop-blur-md shadow-lg border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-100 hover:bg-amber-500 hover:text-stone-950 dark:hover:bg-amber-500 dark:hover:text-stone-950 flex items-center justify-center transition-all cursor-pointer group active:scale-95"
            title={language === 'en' ? 'Zoom out' : language === 'mg' ? 'Hanalavitra' : 'Zoom arrière'}
            aria-label="Zoom out"
          >
            <Minus className="w-5 h-5 transition-transform group-hover:scale-110" />
          </button>

          {/* Reset / Fit bounds to all filtered results */}
          <button
            type="button"
            onClick={fitToAllFilteredCircuits}
            className="w-10 h-10 rounded-xl bg-white/95 dark:bg-stone-900/95 backdrop-blur-md shadow-lg border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-100 hover:bg-amber-500 hover:text-stone-950 dark:hover:bg-amber-500 dark:hover:text-stone-950 flex items-center justify-center transition-all cursor-pointer group active:scale-95"
            title={language === 'en' ? 'Fit all filtered routes' : language === 'mg' ? 'Ampifanaraho amin\'ireo lalam-pitetezana' : 'Recadrer sur tous les circuits'}
            aria-label="Fit all filtered routes"
          >
            <Maximize2 className="w-4 h-4 transition-transform group-hover:scale-110" />
          </button>
        </div>

        {/* Floating Circuit Filter Chips */}
        <div className="absolute top-3 left-3 right-16 sm:right-auto z-10 flex items-center gap-1.5 overflow-x-auto pb-1 max-w-[calc(100%-80px)] sm:max-w-xl no-scrollbar pointer-events-auto">
          <button
            onClick={() => {
              setActiveCircuitId(null);
              fitToAllFilteredCircuits();
            }}
            className={`px-3 py-1.5 rounded-full text-[11px] font-bold shadow-md backdrop-blur-md transition-all cursor-pointer whitespace-nowrap shrink-0 border ${
              activeCircuitId === null
                ? 'bg-stone-900 text-white border-amber-500 ring-2 ring-amber-400/30'
                : 'bg-white/95 dark:bg-stone-900/95 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-50'
            }`}
          >
            ★ {language === 'en' ? 'All active routes' : language === 'mg' ? 'Ny lalam-pitetezana rehetra' : 'Tous les tracés'} ({activeCircuitsList.length})
          </button>

          {activeCircuitsList.map((circ) => {
            const isSelected = activeCircuitId === circ.id;
            const routeColor = getCircuitDifficultyColor(circ.difficulty);
            const title = circ.title[language] || circ.title['fr'];

            return (
              <button
                key={circ.id}
                onClick={() => {
                  setActiveCircuitId(circ.id);
                  if (onSelectCircuit) onSelectCircuit(circ);
                }}
                className={`px-3 py-1.5 rounded-full text-[11px] font-semibold shadow-md backdrop-blur-md transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 border ${
                  isSelected
                    ? 'bg-stone-900 text-white border-amber-500 ring-2 ring-amber-400/40 font-bold'
                    : 'bg-white/95 dark:bg-stone-900/95 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-50'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: routeColor }}
                />
                <span className="truncate max-w-[150px]">{title}</span>
              </button>
            );
          })}
        </div>

        {/* Difficulty Route Color Legend Overlay (CRITICAL REQUIREMENT) */}
        <div className="absolute bottom-4 right-4 sm:bottom-4 sm:right-4 z-[400] pointer-events-auto">
          <div className="bg-white/95 dark:bg-stone-900/95 backdrop-blur-md rounded-2xl shadow-xl border border-stone-200 dark:border-stone-700 overflow-hidden transition-all text-xs">
            {/* Legend Header & Collapse Toggle */}
            <button
              type="button"
              onClick={() => setIsLegendOpen(!isLegendOpen)}
              className="w-full flex items-center justify-between gap-3 px-3.5 py-2.5 bg-stone-50/80 dark:bg-stone-800/80 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-900 dark:text-white font-bold cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2">
                <Info className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-[11px] uppercase tracking-wider">
                  {language === 'en' ? 'Route Legend' : language === 'mg' ? 'Torolàlana lalam-pitetezana' : 'Légende des parcours'}
                </span>
              </div>
              {isLegendOpen ? <ChevronDown className="w-4 h-4 text-stone-400" /> : <ChevronUp className="w-4 h-4 text-stone-400" />}
            </button>

            {/* Legend Items Body */}
            {isLegendOpen && (
              <div className="p-3 space-y-2.5 w-64 max-w-[85vw] border-t border-stone-100 dark:border-stone-800 text-[11px]">
                {/* Facile / Easy */}
                <div className="flex items-start gap-2.5">
                  <div className="flex items-center gap-1 shrink-0 mt-0.5">
                    <span className="w-5 h-1.5 rounded-full bg-emerald-500 shadow-xs inline-block" />
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 inline-block" />
                  </div>
                  <div className="flex-1">
                    <div className="font-extrabold text-stone-900 dark:text-stone-100 flex items-center justify-between">
                      <span className="text-emerald-600 dark:text-emerald-400">
                        {language === 'en' ? 'Easy (Accessible)' : language === 'mg' ? 'Mora (Fialan-tsasatra)' : 'Facile (Accessible)'}
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono">
                        {activeCircuitsList.filter((c) => c.difficulty === 'facile').length}
                      </span>
                    </div>
                    <div className="text-[10px] text-stone-500 dark:text-stone-400 leading-tight">
                      {language === 'en' ? 'Gentle pace, coastal & family tours' : language === 'mg' ? 'Mora idirana, torapasika & fianakaviana' : 'Rythme doux, découverte & famille'}
                    </div>
                  </div>
                </div>

                {/* Modérée / Moderate */}
                <div className="flex items-start gap-2.5">
                  <div className="flex items-center gap-1 shrink-0 mt-0.5">
                    <span className="w-5 h-1.5 rounded-full bg-orange-500 shadow-xs inline-block" />
                    <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0 inline-block" />
                  </div>
                  <div className="flex-1">
                    <div className="font-extrabold text-stone-900 dark:text-stone-100 flex items-center justify-between">
                      <span className="text-orange-600 dark:text-orange-400">
                        {language === 'en' ? 'Moderate (Discovery)' : language === 'mg' ? 'Antonony (Fikarohana)' : 'Modérée (Découverte)'}
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono">
                        {activeCircuitsList.filter((c) => c.difficulty === 'modérée').length}
                      </span>
                    </div>
                    <div className="text-[10px] text-stone-500 dark:text-stone-400 leading-tight">
                      {language === 'en' ? 'Moderate hiking, 4WD bush trails' : language === 'mg' ? 'Lalan-tany 4x4 & dia an-tongotra antonony' : 'Randonnées régulières & pistes 4x4'}
                    </div>
                  </div>
                </div>

                {/* Soutenue / Challenging */}
                <div className="flex items-start gap-2.5">
                  <div className="flex items-center gap-1 shrink-0 mt-0.5">
                    <span className="w-5 h-1.5 rounded-full bg-red-500 shadow-xs inline-block" />
                    <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 inline-block" />
                  </div>
                  <div className="flex-1">
                    <div className="font-extrabold text-stone-900 dark:text-stone-100 flex items-center justify-between">
                      <span className="text-red-600 dark:text-red-400">
                        {language === 'en' ? 'Challenging (Adventure)' : language === 'mg' ? 'Mafy (Trek & Aventure)' : 'Soutenue (Aventure & Trek)'}
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono">
                        {activeCircuitsList.filter((c) => c.difficulty === 'soutenue').length}
                      </span>
                    </div>
                    <div className="text-[10px] text-stone-500 dark:text-stone-400 leading-tight">
                      {language === 'en' ? 'Remote canyons, Makay trek, bivouac' : language === 'mg' ? 'Hantsana mitoka-monina, Makay, toby' : 'Canyons sauvages, Makay, bivouac'}
                    </div>
                  </div>
                </div>

                {/* POI Markers Info */}
                <div className="pt-2 border-t border-stone-100 dark:border-stone-800/80 space-y-1.5 text-[10px] text-stone-500 dark:text-stone-400">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-stone-900 text-amber-400 font-bold flex items-center justify-center text-[8px] shrink-0">
                      ★
                    </span>
                    <span>{language === 'en' ? 'National Parks & Key Stops' : language === 'mg' ? 'Valan-javaboary & toerana manan-danja' : 'Parcs Nationaux & étapes clés'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded bg-amber-500 text-stone-950 font-black flex items-center justify-center text-[9px] shrink-0">
                      R
                    </span>
                    <span>{language === 'en' ? 'Ravinala Tours HQ (Mahajanga)' : language === 'mg' ? 'Foiben\'ny Ravinala Tours (Mahajanga)' : 'Siège Ravinala Tours (Mahajanga)'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Floating Active Circuit Overlay Card */}
        {activeCircuitObj && (
          <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md bg-white/95 dark:bg-stone-900/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl border-2 border-amber-500 z-10 animate-in fade-in slide-in-from-bottom-2 pointer-events-auto">
            <div className="flex items-start justify-between gap-3">
              <div className="flex gap-3">
                <img
                  src={activeCircuitObj.mainImage}
                  alt=""
                  className="w-16 h-16 rounded-xl object-cover shrink-0 border border-stone-200 dark:border-stone-700 shadow-xs"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                      {activeCircuitObj.region}
                    </span>
                    <span className="text-[10px] text-stone-400">·</span>
                    <span className="text-[10px] font-semibold text-stone-500 dark:text-stone-400">
                      {activeCircuitObj.durationDays} {language === 'en' ? 'days' : 'jours'}
                    </span>
                    <span className="text-[10px] text-stone-400">·</span>
                    <span
                      className="text-[9px] font-extrabold px-1.5 py-0.2 rounded text-white"
                      style={{ backgroundColor: getCircuitDifficultyColor(activeCircuitObj.difficulty) }}
                    >
                      {activeCircuitObj.difficulty}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-sm text-stone-900 dark:text-white line-clamp-1">
                    {activeCircuitObj.title[language] || activeCircuitObj.title['fr']}
                  </h4>
                  <div className="mt-1 text-xs font-bold text-amber-600 dark:text-amber-400">
                    {activeCircuitObj.basePriceEUR > 0 ? `${activeCircuitObj.basePriceEUR} € / pers.` : 'Sur devis'}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveCircuitId(null)}
                className="text-stone-400 hover:text-stone-700 dark:hover:text-white p-1 cursor-pointer"
                title="Fermer ce focus"
              >
                ✕
              </button>
            </div>

            <div className="mt-3 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-2">
              <button
                onClick={() => setSelectedCircuit(activeCircuitObj)}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-stone-600 dark:text-stone-300" />
                <span>Voir le programme</span>
              </button>

              <button
                onClick={() =>
                  openQuoteModal({
                    id: activeCircuitObj.id,
                    title: activeCircuitObj.title[language] || activeCircuitObj.title['fr'],
                  })
                }
                className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold rounded-lg shadow-sm transition-all hover:scale-105 cursor-pointer"
              >
                <span>Devis pour ce circuit</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Floating POI Detail Card */}
        {selectedPOI && !activeCircuitObj && (
          <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-sm bg-white/95 dark:bg-stone-900/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-stone-200 dark:border-stone-800 z-10 animate-in fade-in slide-in-from-bottom-2 pointer-events-auto">
            <div className="flex items-start justify-between gap-2 pb-2 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                <h4 className="font-extrabold text-xs text-stone-900 dark:text-white">
                  {selectedPOI.name[language] || selectedPOI.name['fr']}
                </h4>
              </div>
              <button
                onClick={() => setSelectedPOI(null)}
                className="text-stone-400 hover:text-stone-700 dark:hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="mt-2 text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              {selectedPOI.description[language] || selectedPOI.description['fr']}
            </p>

            <div className="mt-2.5 flex flex-wrap gap-1">
              {selectedPOI.highlights.map((h, i) => (
                <span
                  key={i}
                  className="text-[10px] font-medium bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800"
                >
                  ✓ {h}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
