import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Circuit, GuaranteedDeparture, Region, TourTheme, TourDifficulty, TourMode } from '../../types';
import {
  Sparkles,
  Copy,
  Edit,
  Eye,
  Calendar,
  Plus,
  Check,
  MapPin,
  Clock,
  DollarSign,
  Trash2,
  CalendarDays,
  X,
  Users,
  AlertTriangle,
  Lock,
  ShieldAlert,
} from 'lucide-react';

export const ContentManagement: React.FC = () => {
  const {
    circuits,
    toggleCircuitFeatured,
    duplicateCircuit,
    saveCircuit,
    addCircuit,
    deleteCircuit,
    departures,
    addDeparture,
    updateDeparture,
    deleteDeparture,
    setSelectedCircuit,
    adminRole,
    language,
    t,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'circuits' | 'departures'>('circuits');
  const [editingCircuit, setEditingCircuit] = useState<Circuit | null>(null);
  const [createCircuitModalOpen, setCreateCircuitModalOpen] = useState(false);
  const [circuitToDelete, setCircuitToDelete] = useState<string | null>(null);

  // New Circuit Form Fields
  const [newTitleFr, setNewTitleFr] = useState('');
  const [newTitleEn, setNewTitleEn] = useState('');
  const [newTitleMg, setNewTitleMg] = useState('');
  const [newRegion, setNewRegion] = useState<Region>('Ouest');
  const [newDuration, setNewDuration] = useState<number>(7);
  const [newPrice, setNewPrice] = useState<number>(1150);
  const [newTheme, setNewTheme] = useState<TourTheme>('nature');
  const [newDifficulty, setNewDifficulty] = useState<TourDifficulty>('modérée');
  const [newMode, setNewMode] = useState<TourMode>('prive');
  const [newImage, setNewImage] = useState('/src/assets/images/hero_madagascar_baobabs_1792223499188.jpg');
  const [newSummaryFr, setNewSummaryFr] = useState('');

  const handleOpenCreateCircuit = () => {
    setNewTitleFr('');
    setNewTitleEn('');
    setNewTitleMg('');
    setNewRegion('Ouest');
    setNewDuration(7);
    setNewPrice(1150);
    setNewTheme('nature');
    setNewDifficulty('modérée');
    setNewMode('prive');
    setNewImage('/src/assets/images/hero_madagascar_baobabs_1792223499188.jpg');
    setNewSummaryFr('');
    setCreateCircuitModalOpen(true);
  };

  const handleCreateCircuitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitleFr.trim()) return;
    const newId = `circ-${Date.now().toString(36)}`;
    const slug = newTitleFr
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const newCirc: Circuit = {
      id: newId,
      slug,
      title: {
        fr: newTitleFr.trim(),
        en: newTitleEn.trim() || newTitleFr.trim(),
        mg: newTitleMg.trim() || newTitleFr.trim(),
      },
      summary: {
        fr: newSummaryFr.trim() || 'Expédition sur les pistes légendaires de Madagascar, paysages spectaculaires et faune endémique.',
        en: 'Expedition on legendary Madagascar tracks, spectacular landscapes, and endemic biodiversity.',
        mg: 'Fitsidihana manokana ireo lalam-pitetezana mahafinaritra eto Madagasikara sy ireo biby tsy manan-tsahala.',
      },
      mainImage: newImage || '/src/assets/images/hero_madagascar_baobabs_1792223499188.jpg',
      gallery: [newImage || '/src/assets/images/hero_madagascar_baobabs_1792223499188.jpg'],
      durationDays: newDuration,
      durationNights: Math.max(1, newDuration - 1),
      region: newRegion,
      theme: newTheme,
      difficulty: newDifficulty,
      mode: newMode,
      startingPoint: 'Antananarivo / Mahajanga',
      endingPoint: 'Mahajanga / Antananarivo',
      basePriceEUR: newPrice,
      priceNote: {
        fr: 'Base 2 à 4 personnes. Chauffeur-guide et véhicule 4x4 tout-terrain inclus.',
        en: 'Based on 2-4 travelers. Private 4WD vehicle and driver-guide included.',
        mg: 'Ho an\'olona 2 ka hatramin\'ny 4. Miaraka amin\'ny fiara 4x4 sy mpamily-mpitarika.',
      },
      isFeatured: false,
      dayProgram: [
        {
          day: 1,
          title: {
            fr: 'Départ de Mahajanga et début d\'itinéraire',
            en: 'Departure from Mahajanga and journey kickoff',
            mg: 'Fiaingana avy eo Mahajanga sy fiandohan\'ny dia',
          },
          description: {
            fr: 'Prise en charge par l\'équipe Ravinala Tours, briefing sécurité et route vers la première étape.',
            en: 'Pick up by Ravinala Tours team, safety briefing, and road to the first stage.',
            mg: 'Fandraisana ataon\'ny ekipa Ravinala Tours, torolàlana fiarovana ary fiaingana.',
          },
          lodging: 'Hôtel sélectionné charme',
          meals: 'Dîner inclus',
          highlights: ['Briefing sécurité', 'Rencontre avec le chauffeur-guide'],
        },
      ],
      inclusions: {
        fr: ['Véhicule 4x4 climatisé avec chauffeur-guide professionnel', 'Carburant pour tout le parcours', 'Hébergements en demi-pension', 'Droits d\'entrée parcs nationaux'],
        en: ['Air-conditioned 4WD vehicle with professional driver-guide', 'Fuel for the entire itinerary', 'Half-board accommodations', 'National park entrance fees'],
        mg: ['Fiara 4x4 misy rivotra madio sy mpamily-mpitarika matihanina', 'Solika mandritra ny dia', 'Toeram-pandraisam-bahiny', 'Saram-pidirana valan-javaboary'],
      },
      exclusions: {
        fr: ['Vols internationaux et domestiques', 'Boissons et pourboires', 'Assurances voyage'],
        en: ['International and domestic flights', 'Beverages and gratuities', 'Travel insurance'],
        mg: ['Tsidina fiaramanidina', 'Zava-pisotro sy fisaorana', 'Fiantohana manokana'],
      },
      practicalTips: {
        fr: ['Prévoir vêtements légers et chaussures de randonnée', 'Crème solaire et répulsif anti-moustiques'],
        en: ['Pack lightweight clothing and trekking footwear', 'Sunblock and mosquito repellent'],
        mg: ['Fitafiana maivana sy kiraro tsara handehanana', 'Fiarovana amin\'ny masoandro sy moka'],
      },
      guideLanguages: ['Français', 'English', 'Malagasy'],
      translationStatus: {
        fr: 'published',
        en: newTitleEn ? 'published' : 'draft',
        mg: newTitleMg ? 'published' : 'draft',
      },
    };

    addCircuit(newCirc);
    setCreateCircuitModalOpen(false);
  };

  // Departures Modal State
  const [departureModalOpen, setDepartureModalOpen] = useState(false);
  const [editingDeparture, setEditingDeparture] = useState<GuaranteedDeparture | null>(null);
  const [departureToDelete, setDepartureToDelete] = useState<string | null>(null);

  // Departure Form Fields
  const [depCircuitId, setDepCircuitId] = useState<string>(circuits[0]?.id || '');
  const [depStartDate, setDepStartDate] = useState<string>('2026-11-20');
  const [depEndDate, setDepEndDate] = useState<string>('2026-11-30');
  const [depCapacityTotal, setDepCapacityTotal] = useState<number>(8);
  const [depSeatsBooked, setDepSeatsBooked] = useState<number>(0);
  const [depMinParticipants, setDepMinParticipants] = useState<number>(4);
  const [depPriceEUR, setDepPriceEUR] = useState<number>(1200);
  const [depStatus, setDepStatus] = useState<GuaranteedDeparture['status']>('ouvert');

  const handleOpenCreateDeparture = () => {
    setEditingDeparture(null);
    const initialCircuit = circuits[0];
    setDepCircuitId(initialCircuit ? initialCircuit.id : '');
    setDepStartDate('2026-11-20');
    setDepEndDate('2026-11-30');
    setDepCapacityTotal(8);
    setDepSeatsBooked(0);
    setDepMinParticipants(4);
    setDepPriceEUR(initialCircuit ? initialCircuit.basePriceEUR || 1200 : 1200);
    setDepStatus('ouvert');
    setDepartureModalOpen(true);
  };

  const handleOpenEditDeparture = (dep: GuaranteedDeparture) => {
    setEditingDeparture(dep);
    setDepCircuitId(dep.circuitId);
    setDepStartDate(dep.startDate);
    setDepEndDate(dep.endDate);
    setDepCapacityTotal(dep.capacityTotal);
    setDepSeatsBooked(dep.seatsBooked);
    setDepMinParticipants(dep.minParticipants);
    setDepPriceEUR(dep.priceEUR);
    setDepStatus(dep.status);
    setDepartureModalOpen(true);
  };

  const handleCircuitChangeInForm = (circuitId: string) => {
    setDepCircuitId(circuitId);
    const selected = circuits.find((c) => c.id === circuitId);
    if (selected && selected.basePriceEUR) {
      setDepPriceEUR(selected.basePriceEUR);
    }
  };

  const handleSaveDeparture = (e: React.FormEvent) => {
    e.preventDefault();
    const circuitObj = circuits.find((c) => c.id === depCircuitId);
    if (!circuitObj) return;

    if (editingDeparture) {
      updateDeparture({
        ...editingDeparture,
        circuitId: circuitObj.id,
        circuitSlug: circuitObj.slug,
        circuitTitle: circuitObj.title,
        startDate: depStartDate,
        endDate: depEndDate,
        capacityTotal: Number(depCapacityTotal),
        seatsBooked: Number(depSeatsBooked),
        minParticipants: Number(depMinParticipants),
        priceEUR: Number(depPriceEUR),
        status: depStatus,
      });
    } else {
      addDeparture({
        circuitId: circuitObj.id,
        circuitSlug: circuitObj.slug,
        circuitTitle: circuitObj.title,
        startDate: depStartDate,
        endDate: depEndDate,
        capacityTotal: Number(depCapacityTotal),
        seatsBooked: Number(depSeatsBooked),
        minParticipants: Number(depMinParticipants),
        priceEUR: Number(depPriceEUR),
        status: depStatus,
      });
    }

    setDepartureModalOpen(false);
    setEditingDeparture(null);
  };

  const handleConfirmDeleteDeparture = () => {
    if (departureToDelete) {
      deleteDeparture(departureToDelete);
      setDepartureToDelete(null);
    }
  };

  const handleSaveCircuitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCircuit) {
      saveCircuit(editingCircuit);
      setEditingCircuit(null);
    }
  };

  const getStatusBadge = (status: GuaranteedDeparture['status']) => {
    switch (status) {
      case 'confirme':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            {t('departures.admin.status.confirmed')}
          </span>
        );
      case 'presque_complet':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            {t('departures.admin.status.almostFull')}
          </span>
        );
      case 'complet':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-stone-100 text-stone-700 border border-stone-200">
            {t('departures.admin.status.full')}
          </span>
        );
      case 'ouvert':
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
            {t('departures.admin.status.open')}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
        <button
          onClick={() => setActiveTab('circuits')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'circuits'
              ? 'bg-stone-900 text-white'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          {language === 'mg' ? 'Lalam-pitetezana & Fitsidihana' : language === 'en' ? 'Tours & Excursions' : 'Circuits & Excursions'} ({circuits.length})
        </button>
        <button
          onClick={() => setActiveTab('departures')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'departures'
              ? 'bg-stone-900 text-white'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          {t('nav.departures')} ({departures.length})
        </button>
      </div>

      {activeTab === 'circuits' && (
        <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                  {language === 'mg' ? 'Fitantanana ireo Tolotra Fitsidihana' : language === 'en' ? 'Tourism Offers Management' : 'Gestion des Offres Touristiques'}
                </h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${adminRole === 'Administrateur' ? 'bg-amber-100 text-amber-900' : 'bg-sky-100 text-sky-900'}`}>
                  {adminRole === 'Administrateur' ? 'Mode Admin (Création & Édition)' : 'Mode Commercial (Lecture seule)'}
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                {adminRole === 'Administrateur'
                  ? 'Créez de nouveaux voyages, dupliquez, modifiez ou supprimez des circuits du catalogue.'
                  : 'Consultation complète des fiches et tarifs des circuits créés par l\'administration. (Création restreinte à l\'admin).'}
              </p>
            </div>

            {adminRole === 'Administrateur' ? (
              <button
                type="button"
                onClick={handleOpenCreateCircuit}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-lg text-xs shadow-sm transition-all cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>+ Nouveau Circuit</span>
              </button>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 border border-stone-200 rounded-lg text-xs text-stone-500 shrink-0">
                <Lock className="w-3.5 h-3.5 text-stone-400" />
                <span>Création réservée à l'Admin</span>
              </div>
            )}
          </div>

          <div className="divide-y divide-stone-100">
            {circuits.map((circ) => (
              <div
                key={circ.id}
                className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-stone-50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-12 bg-stone-100 rounded-lg overflow-hidden shrink-0 border border-stone-200">
                    <img
                      src={circ.mainImage}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-stone-900">
                        {circ.title[language] || circ.title['fr']}
                      </span>
                      {circ.isFeatured && (
                        <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                          ★ {language === 'mg' ? 'Asongadina' : language === 'en' ? 'Featured' : 'En avant'}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-stone-500 mt-1">
                      <span>{circ.region}</span>
                      <span>·</span>
                      <span>
                        {circ.durationDays} {language === 'en' ? 'days' : language === 'mg' ? 'andro' : 'jours'}
                      </span>
                      <span>·</span>
                      <span className="font-bold text-stone-800">
                        {circ.basePriceEUR > 0 ? `${circ.basePriceEUR} €` : (language === 'en' ? 'On quote' : language === 'mg' ? 'Araka ny fangatahana' : 'Sur devis')}
                      </span>
                      <span>·</span>
                      <span className="text-[10px] uppercase text-stone-400">
                        FR {circ.translationStatus.fr === 'published' ? '✓' : '…'} | EN {circ.translationStatus.en === 'published' ? '✓' : '…'} | MG {circ.translationStatus.mg === 'published' ? '✓' : '…'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                  {/* Public preview button available for all roles */}
                  <button
                    onClick={() => setSelectedCircuit(circ)}
                    className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors cursor-pointer flex items-center gap-1 text-xs"
                    title="Prévisualiser la fiche publique"
                  >
                    <Eye className="w-4 h-4 text-stone-500" />
                    <span className="hidden sm:inline text-[11px] font-medium">Voir fiche</span>
                  </button>

                  {adminRole === 'Administrateur' ? (
                    <>
                      <button
                        onClick={() => toggleCircuitFeatured(circ.id)}
                        className={`px-2.5 py-1.5 text-xs font-medium rounded border transition-colors cursor-pointer ${
                          circ.isFeatured
                            ? 'bg-amber-50 border-amber-300 text-amber-800'
                            : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                        }`}
                        title="Mettre en avant sur la page d'accueil"
                      >
                        <Sparkles className="w-3.5 h-3.5 inline mr-1" />
                        <span>{circ.isFeatured ? (language === 'mg' ? 'Voasongadina' : language === 'en' ? 'Featured' : 'Vedette') : (language === 'mg' ? 'Asongadino' : language === 'en' ? 'Feature' : 'En avant')}</span>
                      </button>

                      <button
                        onClick={() => duplicateCircuit(circ.id)}
                        className="px-2.5 py-1.5 text-xs font-medium bg-white border border-stone-200 text-stone-700 hover:bg-stone-100 rounded transition-colors cursor-pointer"
                        title="Dupliquer ce circuit pour une variante"
                      >
                        <Copy className="w-3.5 h-3.5 inline mr-1" />
                        <span>{language === 'mg' ? 'Adikao' : language === 'en' ? 'Duplicate' : 'Dupliquer'}</span>
                      </button>

                      <button
                        onClick={() => setEditingCircuit(circ)}
                        className="px-2.5 py-1.5 text-xs font-medium bg-stone-900 hover:bg-stone-800 text-white rounded transition-colors cursor-pointer"
                        title="Modifier les informations"
                      >
                        <Edit className="w-3.5 h-3.5 inline mr-1" />
                        <span>{language === 'mg' ? 'Hanova' : language === 'en' ? 'Edit' : 'Modifier'}</span>
                      </button>

                      <button
                        onClick={() => setCircuitToDelete(circ.id)}
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors cursor-pointer"
                        title="Supprimer définitivement ce circuit"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    /* Commercial role: Read-only badge */
                    <div className="flex items-center gap-1 text-[11px] text-stone-400 bg-stone-100 px-2 py-1 rounded">
                      <Lock className="w-3 h-3" />
                      <span>Lecture seule</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DEPARTURES TAB WITH CREATION & DELETION */}
      {activeTab === 'departures' && (
        <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-4 sm:p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900">
                {language === 'mg' ? 'Fandaharam-potoana sy Fiaingana Azo Antoka' : language === 'en' ? 'Scheduled Guaranteed Departures' : 'Calendrier des Départs Programmés'}
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                {language === 'mg'
                  ? 'Famoronana, fanovana, famafana ary fitantanana ireo toerana voatokana'
                  : language === 'en'
                  ? 'Create, edit, delete and monitor booked seats quotas'
                  : 'Création, modification, suppression et gestion des quotas de réservations.'}
              </p>
            </div>

            {adminRole === 'Administrateur' ? (
              <button
                onClick={handleOpenCreateDeparture}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-lg text-xs shadow-sm transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{t('departures.admin.createNew')}</span>
              </button>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 border border-stone-200 rounded-lg text-xs text-stone-500">
                <Lock className="w-3.5 h-3.5 text-stone-400" />
                <span>Création réservée à l'Admin</span>
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-stone-50 border-y border-stone-200 text-stone-600 font-bold">
                  <th className="p-3">{language === 'mg' ? 'Lalam-pitetezana' : language === 'en' ? 'Tour' : 'Circuit'}</th>
                  <th className="p-3">{language === 'mg' ? 'Fotoana' : language === 'en' ? 'Dates' : 'Période'}</th>
                  <th className="p-3">{language === 'mg' ? 'Toerana (Rehetra/Voatokana)' : language === 'en' ? 'Capacity / Booked' : 'Capacité & Inscrits'}</th>
                  <th className="p-3">{t('departures.admin.status')}</th>
                  <th className="p-3">{language === 'mg' ? 'Sarany' : language === 'en' ? 'Rate' : 'Tarif'}</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {departures.map((dep) => {
                  const circuitObj = circuits.find((c) => c.id === dep.circuitId);
                  const availableSeats = dep.capacityTotal - dep.seatsBooked;
                  return (
                    <tr key={dep.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="p-3 font-bold text-stone-900">
                        <div className="flex items-center gap-2.5">
                          {circuitObj?.mainImage && (
                            <img
                              src={circuitObj.mainImage}
                              alt=""
                              className="w-10 h-8 rounded object-cover border border-stone-200 shrink-0"
                            />
                          )}
                          <div>
                            <div>{dep.circuitTitle[language] || dep.circuitTitle['fr']}</div>
                            <div className="text-[10px] text-stone-400 font-normal">
                              ID: {dep.id} · Min {dep.minParticipants} pers.
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-stone-700 font-medium">
                        <div className="flex items-center gap-1.5 whitespace-nowrap">
                          <CalendarDays className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                          <span>{dep.startDate}</span>
                          <span className="text-stone-400">→</span>
                          <span>{dep.endDate}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="font-semibold text-stone-900">
                          {dep.seatsBooked} / {dep.capacityTotal} {t('departures.booked')}
                        </div>
                        <div className="text-[11px] text-stone-500">
                          {availableSeats} {t('departures.availableSeats')}
                        </div>
                      </td>
                      <td className="p-3">
                        {getStatusBadge(dep.status)}
                      </td>
                      <td className="p-3 font-extrabold tabular-nums text-stone-900">
                        {dep.priceEUR} €
                      </td>
                      <td className="p-3 text-right whitespace-nowrap">
                        {adminRole === 'Administrateur' ? (
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => handleOpenEditDeparture(dep)}
                              className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors cursor-pointer"
                              title={t('departures.admin.edit')}
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDepartureToDelete(dep.id)}
                              className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors cursor-pointer"
                              title={t('departures.admin.delete')}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] text-stone-400 bg-stone-100 px-2 py-1 rounded">
                            <Lock className="w-3 h-3" />
                            Lecture seule
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE / EDIT DEPARTURE MODAL */}
      {departureModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveDeparture}
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4 text-xs animate-in fade-in zoom-in-95"
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-extrabold text-stone-900">
                  {editingDeparture ? t('departures.admin.edit') : t('departures.admin.new')}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setDepartureModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700 rounded cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">
                {t('departures.admin.circuitSelect')}
              </label>
              <select
                value={depCircuitId}
                onChange={(e) => handleCircuitChangeInForm(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-white focus:ring-2 focus:ring-amber-500/40"
              >
                {circuits.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title[language] || c.title['fr']} ({c.durationDays}j · {c.region})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  {t('departures.admin.startDate')}
                </label>
                <input
                  type="date"
                  required
                  value={depStartDate}
                  onChange={(e) => setDepStartDate(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-stone-300 bg-white"
                />
              </div>
              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  {t('departures.admin.endDate')}
                </label>
                <input
                  type="date"
                  required
                  value={depEndDate}
                  onChange={(e) => setDepEndDate(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-stone-300 bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  {t('departures.admin.capacity')}
                </label>
                <input
                  type="number"
                  min="2"
                  max="50"
                  required
                  value={depCapacityTotal}
                  onChange={(e) => setDepCapacityTotal(Number(e.target.value))}
                  className="w-full text-xs p-2 rounded-lg border border-stone-300"
                />
              </div>
              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  {t('departures.admin.booked')}
                </label>
                <input
                  type="number"
                  min="0"
                  max={depCapacityTotal}
                  required
                  value={depSeatsBooked}
                  onChange={(e) => setDepSeatsBooked(Number(e.target.value))}
                  className="w-full text-xs p-2 rounded-lg border border-stone-300"
                />
              </div>
              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  {t('departures.admin.min')}
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  required
                  value={depMinParticipants}
                  onChange={(e) => setDepMinParticipants(Number(e.target.value))}
                  className="w-full text-xs p-2 rounded-lg border border-stone-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  {t('departures.admin.price')}
                </label>
                <input
                  type="number"
                  min="50"
                  step="10"
                  required
                  value={depPriceEUR}
                  onChange={(e) => setDepPriceEUR(Number(e.target.value))}
                  className="w-full text-xs p-2 rounded-lg border border-stone-300"
                />
              </div>
              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  {t('departures.admin.status')}
                </label>
                <select
                  value={depStatus}
                  onChange={(e) => setDepStatus(e.target.value as GuaranteedDeparture['status'])}
                  className="w-full text-xs p-2 rounded-lg border border-stone-300 bg-white"
                >
                  <option value="ouvert">{t('departures.admin.status.open')}</option>
                  <option value="presque_complet">{t('departures.admin.status.almostFull')}</option>
                  <option value="confirme">{t('departures.admin.status.confirmed')}</option>
                  <option value="complet">{t('departures.admin.status.full')}</option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDepartureModalOpen(false)}
                className="px-3.5 py-2 text-stone-600 hover:text-stone-900 cursor-pointer font-semibold"
              >
                {t('departures.admin.cancel')}
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-lg cursor-pointer"
              >
                {t('departures.admin.save')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {departureToDelete && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 space-y-4 text-xs animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-sm font-extrabold text-stone-900">
                {t('departures.admin.delete')}
              </h3>
            </div>

            <p className="text-stone-600 leading-relaxed">
              {t('departures.admin.deleteConfirm')}
            </p>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDepartureToDelete(null)}
                className="px-3 py-1.5 text-stone-600 hover:text-stone-900 font-semibold cursor-pointer"
              >
                {t('departures.admin.cancel')}
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteDeparture}
                className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg cursor-pointer"
              >
                {t('departures.admin.delete')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Circuit Modal */}
      {editingCircuit && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveCircuitEdit}
            className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-stone-200 space-y-4 text-xs"
          >
            <h3 className="text-base font-bold text-stone-900 pb-2 border-b border-stone-100">
              Modifier le circuit : {editingCircuit.title.fr}
            </h3>

            <div>
              <label className="font-semibold block mb-1">Titre (Français)</label>
              <input
                type="text"
                value={editingCircuit.title.fr}
                onChange={(e) =>
                  setEditingCircuit({
                    ...editingCircuit,
                    title: { ...editingCircuit.title, fr: e.target.value },
                  })
                }
                className="w-full text-xs p-2 rounded border border-stone-300"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold block mb-1">Durée (jours)</label>
                <input
                  type="number"
                  value={editingCircuit.durationDays}
                  onChange={(e) =>
                    setEditingCircuit({
                      ...editingCircuit,
                      durationDays: Number(e.target.value),
                    })
                  }
                  className="w-full text-xs p-2 rounded border border-stone-300"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Prix indicatif base (€)</label>
                <input
                  type="number"
                  value={editingCircuit.basePriceEUR}
                  onChange={(e) =>
                    setEditingCircuit({
                      ...editingCircuit,
                      basePriceEUR: Number(e.target.value),
                    })
                  }
                  className="w-full text-xs p-2 rounded border border-stone-300"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold block mb-1">Note tarifaire</label>
              <input
                type="text"
                value={editingCircuit.priceNote.fr}
                onChange={(e) =>
                  setEditingCircuit({
                    ...editingCircuit,
                    priceNote: { ...editingCircuit.priceNote, fr: e.target.value },
                  })
                }
                className="w-full text-xs p-2 rounded border border-stone-300"
              />
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingCircuit(null)}
                className="px-3 py-1.5 text-stone-600 hover:text-stone-900"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded"
              >
                Enregistrer les modifications
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CREATE NEW CIRCUIT MODAL (Admin Only) */}
      {createCircuitModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <form
            onSubmit={handleCreateCircuitSubmit}
            className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-stone-200 space-y-4 text-xs my-8"
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-extrabold text-stone-900">
                  Créer un Nouveau Circuit Touristique
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCreateCircuitModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700 rounded cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block font-bold text-stone-800 mb-1">
                  Titre du Circuit (Français) *
                </label>
                <input
                  type="text"
                  required
                  value={newTitleFr}
                  onChange={(e) => setNewTitleFr(e.target.value)}
                  placeholder="Ex: Trésors Sauvages du Boeny & Tsingy de Namoroka"
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Titre en Anglais (Optionnel)
                </label>
                <input
                  type="text"
                  value={newTitleEn}
                  onChange={(e) => setNewTitleEn(e.target.value)}
                  placeholder="Ex: Wild Wonders of Boeny & Namoroka Tsingy"
                  className="w-full text-xs p-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Titre en Malagasy (Optionnel)
                </label>
                <input
                  type="text"
                  value={newTitleMg}
                  onChange={(e) => setNewTitleMg(e.target.value)}
                  placeholder="Ex: Harena miafin'i Boeny sy Tsingin'i Namoroka"
                  className="w-full text-xs p-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Région de Madagascar *
                </label>
                <select
                  value={newRegion}
                  onChange={(e) => setNewRegion(e.target.value as Region)}
                  className="w-full text-xs p-2 rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                >
                  <option value="Ouest">Ouest (Mahajanga, Namoroka, Baobabs)</option>
                  <option value="Sud">Sud (Isalo, Tuléar, Ifaty)</option>
                  <option value="Hautes Terres">Hautes Terres (Antsirabe, Fianarantsoa)</option>
                  <option value="Nord">Nord (Diego-Suarez, Nosy Be, Ankarana)</option>
                  <option value="Est">Est (Andasibe, Sainte-Marie, Pangalanes)</option>
                  <option value="Îles">Îles & Archipels</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Thématique principale
                </label>
                <select
                  value={newTheme}
                  onChange={(e) => setNewTheme(e.target.value as TourTheme)}
                  className="w-full text-xs p-2 rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="nature">Nature & Biodiversité</option>
                  <option value="adventure">Aventure & Pistes 4x4</option>
                  <option value="beach">Plage & Détente</option>
                  <option value="culture">Culture & Rencontres</option>
                  <option value="trek">Trek & Randonnée</option>
                  <option value="family">Famille</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Durée (jours) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    required
                    value={newDuration}
                    onChange={(e) => setNewDuration(Number(e.target.value))}
                    className="w-full text-xs p-2 rounded-lg border border-stone-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Prix de base (€) *
                  </label>
                  <input
                    type="number"
                    min={100}
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full text-xs p-2 rounded-lg border border-stone-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Difficulté
                  </label>
                  <select
                    value={newDifficulty}
                    onChange={(e) => setNewDifficulty(e.target.value as TourDifficulty)}
                    className="w-full text-xs p-2 rounded-lg border border-stone-300 bg-white"
                  >
                    <option value="facile">Facile</option>
                    <option value="modérée">Modérée</option>
                    <option value="soutenue">Soutenue</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Format
                  </label>
                  <select
                    value={newMode}
                    onChange={(e) => setNewMode(e.target.value as TourMode)}
                    className="w-full text-xs p-2 rounded-lg border border-stone-300 bg-white"
                  >
                    <option value="prive">Privé sur mesure</option>
                    <option value="groupe">Petit groupe</option>
                    <option value="depart_garanti">Départ garanti</option>
                  </select>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block font-semibold text-stone-700 mb-1">
                  URL de l'image principale
                </label>
                <input
                  type="text"
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  placeholder="/src/assets/images/... ou https://..."
                  className="w-full text-xs p-2 rounded-lg border border-stone-300"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-semibold text-stone-700 mb-1">
                  Résumé / Présentation (Français)
                </label>
                <textarea
                  rows={2}
                  value={newSummaryFr}
                  onChange={(e) => setNewSummaryFr(e.target.value)}
                  placeholder="Points forts du parcours, merveilles géologiques, faune et immersion..."
                  className="w-full text-xs p-2 rounded-lg border border-stone-300"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setCreateCircuitModalOpen(false)}
                className="px-4 py-2 text-stone-600 hover:text-stone-900 font-semibold cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-lg shadow-sm cursor-pointer"
              >
                Créer et Publier le Circuit
              </button>
            </div>
          </form>
        </div>
      )}

      {/* DELETE CIRCUIT CONFIRMATION MODAL */}
      {circuitToDelete && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 space-y-4 text-xs animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 text-red-600">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-stone-900">
                Supprimer le circuit ?
              </h3>
            </div>
            <p className="text-stone-600 leading-relaxed">
              Êtes-vous certain de vouloir supprimer définitivement ce circuit touristique ? Cette action est irréversible.
            </p>
            <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setCircuitToDelete(null)}
                className="px-3 py-1.5 text-stone-600 hover:text-stone-900 font-semibold cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteCircuit(circuitToDelete);
                  setCircuitToDelete(null);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg cursor-pointer"
              >
                Supprimer définitivement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
