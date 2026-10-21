import { Destination } from '../types';

export const DESTINATIONS: Destination[] = [
  {
    id: 'dest-01',
    slug: 'hautes-terres-imerina',
    name: {
      fr: 'Les Hautes Terres & Pays Betsileo',
      en: 'Central Highlands & Betsileo Valleys',
      mg: 'Ny Afovoan-tany & Faritra Betsileo',
    },
    region: 'Hautes Terres',
    description: {
      fr: 'Le cœur historique et culturel de Madagascar : rizières en terrasses sculptées à la main, collines sacrées mérina, architecture de briques rouges et ateliers de marqueterie Zafimaniry classés UNESCO.',
      en: 'The cultural and geographical backbone of Madagascar: sculpted emerald rice terraces, sacred royal hills, distinct red clay brick architecture and UNESCO Zafimaniry woodcrafting villages.',
      mg: 'Fonenana ara-tantara sy kolontsaina : tanimbary tsara tarehy, tendrombohitra masina, trano biriky mena ary sokitra Zafimaniry UNESCO.',
    },
    image: '/src/assets/images/destination_highlands_terraces_1792223500842.jpg',
    highlights: {
      fr: ['Rizières étagées d\'Antsirabe et Ambositra', 'Royaume Merina d\'Ambohimanga', 'Thermes et pousse-pousse'],
      en: ['Tiered rice terraces of Antsirabe', 'Sacred Royal Hill of Ambohimanga', 'Zafimaniry woodcraft workshops'],
      mg: ['Tanimbary kanto', 'Rovan\'Ambohimanga', 'Asa tanana hazo Zafimaniry'],
    },
    bestPeriod: {
      fr: 'Avril à Décembre',
      en: 'April to December',
      mg: 'Aprily hatramin\'ny Desambra',
    },
    practicalInfo: {
      fr: 'Altitude de 1 200 à 1 500m. Soirées fraîches de mai à septembre (prévoir une polaire). Idéal pour les randonnées villageoises à pied.',
      en: 'Elevation 1,200 to 1,500m. Cool evenings from May through September (pack a warm fleece). Ideal for village walks.',
      mg: 'Toerana avo 1 200 hatramin\'ny 1 500m. Mangatsiaka ny hariva amin\'ny ririnina (mitondra akanjo mafana).',
    },
    associatedCircuitSlugs: ['grande-traversee-rn7-isalo-ifaty', 'excursion-1j-colline-royale-ambohimanga-artisanat'],
  },
  {
    id: 'dest-02',
    slug: 'ouest-baobabs-tsingy',
    name: {
      fr: 'L\'Ouest Sauvage : Baobabs & Tsingy de Bemaraha',
      en: 'Wild West: Baobab Avenue & Grand Tsingy',
      mg: 'Andrefana : Baobab sy Tsingy de Bemaraha',
    },
    region: 'Ouest',
    description: {
      fr: 'Le territoire de l\'aventure par excellence : fleuves majestueux, savanes arides peuplées de baobabs géants millénaires, et la forteresse calcaire vertigineuse des Tsingy.',
      en: 'Ultimate raw expedition realm: wide brown rivers, scrub savannahs dotted with colossal Grandidier baobabs, and the razor-sharp karst cathedral labyrinth of Tsingy.',
      mg: 'Faritra feno zava-miafina : renirano lehibe, baobab vaventy tranainy ary vato maranitra ao amin\'ny Tsingy.',
    },
    image: '/src/assets/images/hero_madagascar_baobabs_1792223499188.jpg',
    highlights: {
      fr: ['Coucher de soleil sur l\'Allée des Baobabs', 'Ponts suspendus des Grands Tsingy', 'Descente en pirogue de la Manambolo'],
      en: ['Sunset at Avenue of the Baobabs', 'Grand Tsingy suspension bridge', 'Manambolo river gorge canoe'],
      mg: ['Lalan\'ny Baobab', 'Tetezana mihantona Tsingy', 'Lakana Manambolo'],
    },
    bestPeriod: {
      fr: 'Mi-Mai à Début Novembre',
      en: 'Mid-May to Early November',
      mg: 'Mamatonalina May hatramin\'ny fiandohan\'ny Novambra',
    },
    practicalInfo: {
      fr: 'Accessible uniquement en saison sèche en véhicule 4x4 tout-terrain. Climat chaud et sec en journée.',
      en: 'Accessible strictly during the dry season with heavy-duty 4WD. Warm and dry daytime climate.',
      mg: 'Amin\'ny main-tany ihany no azo aleha miaraka amin\'ny fiara 4x4. Mafana ny andro.',
    },
    associatedCircuitSlugs: ['aventure-tsingy-bemaraha-baobabs-morondava'],
  },
  {
    id: 'dest-03',
    slug: 'sud-isalo-lagon-ifaty',
    name: {
      fr: 'Le Grand Sud : Canyons de l\'Isalo & Lagon d\'Ifaty',
      en: 'The Deep South: Isalo Massif & Coral Reefs',
      mg: 'Atsimo : Isalo sy ny Morontsirak\'Ifaty',
    },
    region: 'Sud',
    description: {
      fr: 'Des steppes semi-désertiques aux massifs de grès érodés de l\'Isalo, peuplés de lémuriens catta, jusqu\'aux rivages turquoise protégés par la barrière de corail vezo.',
      en: 'From arid semi-desert steppes and sculpted Jurassic sandstone massifs of Isalo to the tranquil turquoise lagoons and reef waters of the Vezo sea nomads.',
      mg: 'Tany efitra kanto, hantsana vato ao Isalo misy varika, hatrany amin\'ny ranomasina manga ao Ifaty.',
    },
    image: '/src/assets/images/wildlife_ringtailed_lemur_1792223500854.jpg',
    highlights: {
      fr: ['Piscines naturelles de l\'Isalo', 'Lémuriens Catta d\'Anja', 'Forêt de baobabs Reniala et récif corallien'],
      en: ['Isalo natural canyon rock pools', 'Wild Ring-tailed lemurs of Anja', 'Reniala bottle baobab forest & reef'],
      mg: ['Farihy voajanahary Isalo', 'Varika ao Anja', 'Baobab Reniala sy vatohara'],
    },
    bestPeriod: {
      fr: 'Toute l\'année (idéal Avril à Novembre)',
      en: 'Year-round (ideal April to November)',
      mg: 'Mandavan-taona (tsara indrindra Aprily ka hatramin\'ny Novambra)',
    },
    practicalInfo: {
      fr: 'Ensoleillement exceptionnel (plus de 300 jours/an). Prévoir de bonnes chaussures de marche et protection solaire renforcée.',
      en: 'Over 300 sunny days per year. Bring hiking boots and strong sun protection.',
      mg: 'Masoandro mafana mandavantaona. Mitondra kiraro fandehanana an-tongotra tsara.',
    },
    associatedCircuitSlugs: ['grande-traversee-rn7-isalo-ifaty'],
  },
  {
    id: 'dest-04',
    slug: 'nord-diego-nosy-be',
    name: {
      fr: 'Le Nord : Baies de Diego Suarez & Îles de Nosy Be',
      en: 'The Tropical North: Diego Bays & Nosy Be Islands',
      mg: 'Avaratra : Antsiranana sy Nosy Be',
    },
    region: 'Nord',
    description: {
      fr: 'Une mosaïque tropicale enchanteresse : la Mer d\'Émeraude, les féeriques Tsingy Rouges, les cascades sacrées de la Montagne d\'Ambre et les fonds marins de Nosy Be.',
      en: 'An enchanting tropical spectrum: the crystal waters of Emerald Sea, surreal Red Tsingy, Amber Mountain cloud forest cascades and world-class marine sanctuaries around Nosy Be.',
      mg: 'Fiaraha-mientan\'ny ranomasina emerauda, Tsingy Mena kanto, Tendrombohitra Ambre ary Nosy Be.',
    },
    image: '/src/assets/images/destination_nosy_be_beach_1792223501335.jpg',
    highlights: {
      fr: ['Mer d\'Émeraude et lagons turquoise', 'Tsingy Rouges d\'Irodo', 'Tortues marines de Nosy Tanikely'],
      en: ['Emerald Sea lagoon sailing', 'Sculpted Red Tsingy canyons', 'Sea turtles at Nosy Tanikely sanctuary'],
      mg: ['Ranomasina Emerauda', 'Tsingy Mena Irodo', 'Sokatra ao Nosy Tanikely'],
    },
    bestPeriod: {
      fr: 'Mars à Décembre',
      en: 'March to December',
      mg: 'Martsa hatramin\'ny Desambra',
    },
    practicalInfo: {
      fr: 'Climat doux et venté dans les baies (parfait pour kitesurf/windsurf de juin à octobre), chaleur tropicale agréable à Nosy Be.',
      en: 'Pleasant trade winds in Diego bays (world-famous kitesurfing June-October), balmy tropical beaches in Nosy Be.',
      mg: 'Misy rivotra mahafinaritra any Antsiranana, mafana tsara amoron-dranomasina ao Nosy Be.',
    },
    associatedCircuitSlugs: ['paradis-tropical-nord-diego-nosy-be'],
  },
  {
    id: 'dest-05',
    slug: 'est-pangalanes-sainte-marie',
    name: {
      fr: 'La Côte Est : Canal des Pangalanes & Île Sainte-Marie',
      en: 'The Lush East: Pangalanes Canal & Sainte-Marie Island',
      mg: 'Atsinanana : Lakandranon\'ny Pangalanes sy Nosy Boraha',
    },
    region: 'Est',
    description: {
      fr: 'La luxuriance verdoyante : forêts humides abritant le grand Indri-Indri, navigation paisible sur les lagunes intérieures des Pangalanes et sanctuaire des baleines à bosse.',
      en: 'Verdant tropical wilderness: primary cloud forests home to the singing Indri-indri, tranquil boat journeys along Pangalanes canal and humpback whale nurseries at Sainte-Marie.',
      mg: 'Ala mando maitso mavana misy ny Babakoto, lakandrano milamina ary toerana fiterahan\'ny trozona ao Nosy Boraha.',
    },
    image: '/src/assets/images/destination_highlands_terraces_1792223500842.jpg',
    highlights: {
      fr: ['Chant envoûtant de l\'Indri-Indri à Andasibe', 'Safari baleines à bosse (juillet à septembre)', 'Îlot paradisiaque aux Nattes'],
      en: ['Indri-Indri calls in Andasibe misty forest', 'Whale breeding safari (July to September)', 'Car-free tropical paradise Île aux Nattes'],
      mg: ['Feon\'ny Babakoto Andasibe', 'Fijerena trozona (Jolay hatramin\'ny Septambra)', 'Nosy Nato'],
    },
    bestPeriod: {
      fr: 'Août à Décembre (et Juillet pour les baleines)',
      en: 'August to December (and July for whales)',
      mg: 'Aogositra hatramin\'ny Desambra (sy Jolay ho an\'ny trozona)',
    },
    practicalInfo: {
      fr: 'Climat humide équatorial avec averses bienfaisantes. Prévoir un vêtement imperméable toute l\'année.',
      en: 'Humid equatorial climate with tropical showers. Carry a light waterproof jacket.',
      mg: 'Toetrandro mando misy orana matetika. Mitondra fitaovana miaro amin\'ny orana.',
    },
    associatedCircuitSlugs: ['immersion-nature-andasibe-pangalanes-sainte-marie', 'excursion-1j-andasibe-mantadia-express'],
  },
];
