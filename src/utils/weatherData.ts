import { Region } from '../types';

export interface RegionWeather {
  temperatureC: number;
  temperatureF: number;
  condition: {
    fr: string;
    en: string;
    mg: string;
  };
  icon: 'sun' | 'cloud-sun' | 'sun-rain' | 'wind' | 'waves';
  humidity: string;
  windSpeed: string;
  bestSeason: {
    fr: string;
    en: string;
    mg: string;
  };
  travelTip: {
    fr: string;
    en: string;
    mg: string;
  };
}

export const REGION_WEATHER_DATA: Record<Region, RegionWeather> = {
  Ouest: {
    temperatureC: 31,
    temperatureF: 88,
    condition: {
      fr: 'Ensoleillé & Chaud',
      en: 'Sunny & Warm',
      mg: 'Masoandro mibaliaka & Mahamay',
    },
    icon: 'sun',
    humidity: '58%',
    windSpeed: '18 km/h (Varatraza doux)',
    bestSeason: {
      fr: 'Avril à Novembre (Idéal pistes & mer)',
      en: 'April to November (Ideal tracks & sea)',
      mg: 'Aprily hatramin\'ny Novambra',
    },
    travelTip: {
      fr: 'Protection solaire et hydratation conseillées. Baignades idéales au Grand Pavois.',
      en: 'Sunscreen and plenty of water recommended. Great swimming at Grand Pavois.',
      mg: 'Mila misotro rano matetika ary manao satroka.',
    },
  },
  Nord: {
    temperatureC: 29,
    temperatureF: 84,
    condition: {
      fr: 'Ciel bleu azur & Mer calme',
      en: 'Azure skies & Calm seas',
      mg: 'Manga ny lanitra & Milamina ny ranomasina',
    },
    icon: 'waves',
    humidity: '64%',
    windSpeed: '22 km/h (Alizé Varatraza)',
    bestSeason: {
      fr: 'Toute l\'année (Kitesurf & Plages)',
      en: 'Year-round (Kitesurf & Beaches)',
      mg: 'Mandavan-taona',
    },
    travelTip: {
      fr: 'Idéal pour le snorkeling à Nosy Tanikely et la Mer d\'Émeraude.',
      en: 'Perfect for snorkeling at Nosy Tanikely and Emerald Sea.',
      mg: 'Tena tsara hilomanosana sy hijerena vatohara.',
    },
  },
  Sud: {
    temperatureC: 28,
    temperatureF: 82,
    condition: {
      fr: 'Sec, Lumineux & Végétation épineuse',
      en: 'Dry, Bright & Spiny Bush',
      mg: 'Maina, Mazava & Ala misy tsilo',
    },
    icon: 'sun',
    humidity: '42%',
    windSpeed: '15 km/h',
    bestSeason: {
      fr: 'Avril à Décembre (Parfait pour Isalo)',
      en: 'April to December (Perfect for Isalo)',
      mg: 'Aprily hatramin\'ny Desambra',
    },
    travelTip: {
      fr: 'Températures fraîches la nuit dans les canyons de l\'Isalo en hiver austral (juin-août).',
      en: 'Cooler evening temperatures in Isalo canyons during austral winter (June-August).',
      mg: 'Mangatsiaka ny alina any an-tany efitra.',
    },
  },
  Est: {
    temperatureC: 26,
    temperatureF: 79,
    condition: {
      fr: 'Doux tropical & Forêts humides',
      en: 'Mild tropical & Mist rainforest',
      mg: 'Ala mando & Toetrandro mafana antonony',
    },
    icon: 'cloud-sun',
    humidity: '78%',
    windSpeed: '14 km/h',
    bestSeason: {
      fr: 'Septembre à Décembre (Baleines en juil-sept)',
      en: 'September to December (Whales July-Sept)',
      mg: 'Septambra ka hatramin\'ny Desambra',
    },
    travelTip: {
      fr: 'Prévoir un coupe-vent imperméable pour la visite matinale d\'Andasibe.',
      en: 'Pack a waterproof light jacket for early morning Indri tracking in Andasibe.',
      mg: 'Mitondrà akanjo tsy tratsry ny orana any Andasibe.',
    },
  },
  'Hautes Terres': {
    temperatureC: 22,
    temperatureF: 72,
    condition: {
      fr: 'Tempéré d\'altitude & Air pur',
      en: 'Highland temperate & Crisp air',
      mg: 'Mangatsiatsiaka an-tendrombohitra',
    },
    icon: 'cloud-sun',
    humidity: '55%',
    windSpeed: '12 km/h',
    bestSeason: {
      fr: 'Avril à Novembre (Rizières verdoyantes)',
      en: 'April to November (Lush rice terraces)',
      mg: 'Aprily hatramin\'ny Novambra',
    },
    travelTip: {
      fr: 'Prévoir une petite laine pour les soirées fraîches à Antsirabe et Fianarantsoa.',
      en: 'A light sweater is recommended for cool evenings in Antsirabe & Fianarantsoa.',
      mg: 'Mitondrà akanjo mafana ho an\'ny hariva sy alina.',
    },
  },
  'Îles': {
    temperatureC: 30,
    temperatureF: 86,
    condition: {
      fr: 'Ensoleillé, Mer à 28°C & Brise côtière',
      en: 'Sunny, 28°C Water & Sea breeze',
      mg: 'Mafonja ny masoandro & Mafana ny rano',
    },
    icon: 'waves',
    humidity: '66%',
    windSpeed: '16 km/h',
    bestSeason: {
      fr: 'Mai à Décembre (Détente balnéaire)',
      en: 'May to December (Beach leisure)',
      mg: 'Mey hatramin\'ny Desambra',
    },
    travelTip: {
      fr: 'Masque et tuba indispensables pour explorer les récifs coralliens.',
      en: 'Mask and snorkel essential to discover colorful reef fishes.',
      mg: 'Mila solomaso fantsika hilomanosana anaty rano.',
    },
  },
};

export const getCircuitWeather = (region: Region): RegionWeather => {
  return REGION_WEATHER_DATA[region] || REGION_WEATHER_DATA['Ouest'];
};
