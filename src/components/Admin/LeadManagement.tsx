import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { QuoteRequest, LeadStatus } from '../../types';
import {
  Search,
  Filter,
  Download,
  Clock,
  User,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Plus,
  Send,
  MessageSquare,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ShieldCheck,
  Lock,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
} from 'lucide-react';

export const LeadManagement: React.FC = () => {
  const {
    quoteRequests,
    updateLeadStatus,
    addLeadNote,
    assignLead,
    approveLead,
    rejectLead,
    adminRole,
    language,
    t,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [languageFilter, setLanguageFilter] = useState<string>('all');
  const [selectedLead, setSelectedLead] = useState<QuoteRequest | null>(null);
  const [newNoteText, setNewNoteText] = useState('');

  // Decision Modal (Admin only)
  const [decisionModal, setDecisionModal] = useState<{
    type: 'approve' | 'reject';
    lead: QuoteRequest;
  } | null>(null);
  const [decisionNote, setDecisionNote] = useState('');

  const statusLabels: Record<LeadStatus, Record<string, string>> = {
    nouvelle: { fr: 'Nouvelle', en: 'New', mg: 'Vaovao' },
    a_traiter: { fr: 'À traiter', en: 'To Process', mg: 'Hokarohana' },
    contact_etabli: { fr: 'Contact établi', en: 'Contacted', mg: 'Nifandraisana' },
    devis_envoye: { fr: 'Devis envoyé', en: 'Quote Sent', mg: 'Tolotra lasa' },
    acceptee: { fr: 'Acceptée', en: 'Accepted', mg: 'Neiky' },
    sans_suite: { fr: 'Sans suite', en: 'Closed', mg: 'Tsy nitohy' },
  };

  const filteredLeads = quoteRequests.filter((lead) => {
    if (statusFilter !== 'all' && lead.status !== statusFilter) return false;
    if (languageFilter !== 'all' && lead.language !== languageFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = lead.fullName.toLowerCase().includes(q);
      const matchEmail = lead.email.toLowerCase().includes(q);
      const matchId = lead.id.toLowerCase().includes(q);
      const matchTour = (lead.targetCircuitTitle || '').toLowerCase().includes(q);
      return matchName || matchEmail || matchId || matchTour;
    }
    return true;
  });

  const getStatusBadge = (status: LeadStatus) => {
    const label = statusLabels[status]?.[language] || statusLabels[status]?.fr || status;
    switch (status) {
      case 'nouvelle':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
            {label}
          </span>
        );
      case 'a_traiter':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-800">
            {label}
          </span>
        );
      case 'contact_etabli':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800">
            {label}
          </span>
        );
      case 'devis_envoye':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-800">
            {label}
          </span>
        );
      case 'acceptee':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
            ✓ {label}
          </span>
        );
      case 'sans_suite':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-300 dark:border-stone-700">
            {label}
          </span>
        );
      default:
        return null;
    }
  };

  const handleExportCsv = () => {
    const headers = [
      'Référence',
      'Date de création',
      'Statut',
      'Nom Client',
      'Email',
      'Téléphone',
      'Langue',
      'Circuit',
      'Durée (j)',
      'Adultes',
      'Enfants',
      'Budget',
      'Devise',
      'Responsable',
    ];

    const rows = filteredLeads.map((l) => [
      l.id,
      new Date(l.createdAt).toLocaleDateString(),
      l.status,
      `"${l.fullName.replace(/"/g, '""')}"`,
      l.email,
      l.phone || '',
      l.language.toUpperCase(),
      `"${(l.targetCircuitTitle || 'Sur-mesure').replace(/"/g, '""')}"`,
      l.durationDays,
      l.adultsCount,
      l.childrenCount,
      l.budgetEUR || '',
      l.currency,
      l.assignedTo || 'Non assigné',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `leads-ravinala-tours-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !newNoteText.trim()) return;
    addLeadNote(selectedLead.id, adminRole, newNoteText.trim());
    setNewNoteText('');
    // Update local selected lead view
    const updated = quoteRequests.find((l) => l.id === selectedLead.id);
    if (updated) setSelectedLead(updated);
  };

  const handleConfirmDecision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!decisionModal) return;
    if (decisionModal.type === 'approve') {
      approveLead(decisionModal.lead.id, decisionNote.trim());
    } else {
      rejectLead(decisionModal.lead.id, decisionNote.trim());
    }
    // Update selected lead state if it's the one being decided
    setSelectedLead((prev) =>
      prev && prev.id === decisionModal.lead.id
        ? {
            ...prev,
            status: decisionModal.type === 'approve' ? 'acceptee' : 'sans_suite',
          }
        : null
    );
    setDecisionModal(null);
    setDecisionNote('');
  };

  return (
    <div className="space-y-6">
      {/* Top Filter & Search Bar */}
      <div className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 transition-colors">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher réf, nom, email..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="nouvelle">Nouvelles</option>
            <option value="a_traiter">À traiter</option>
            <option value="contact_etabli">Contact établi</option>
            <option value="devis_envoye">Devis envoyé</option>
            <option value="acceptee">Acceptée</option>
            <option value="sans_suite">Sans suite</option>
          </select>

          {/* Language Filter */}
          <select
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value)}
            className="text-xs px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="all">Toutes les langues</option>
            <option value="fr">Français (FR)</option>
            <option value="en">English (EN)</option>
            <option value="mg">Malagasy (MG)</option>
          </select>

          {/* Export CSV button */}
          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 text-xs font-semibold bg-stone-900 dark:bg-amber-500 hover:bg-stone-800 dark:hover:bg-amber-400 text-white dark:text-stone-950 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-sm ml-auto transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Main Split: Leads List & Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Table / List */}
        <div className="lg:col-span-7 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden transition-colors">
          <div className="p-4 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
              Pipeline des Demandes ({filteredLeads.length})
            </span>
            <span className="text-xs text-stone-500 dark:text-stone-400">
              Cliquez pour afficher le dossier
            </span>
          </div>

          <div className="divide-y divide-stone-100 dark:divide-stone-800 max-h-[640px] overflow-y-auto">
            {filteredLeads.length === 0 ? (
              <div className="p-8 text-center text-xs text-stone-500 dark:text-stone-400">
                Aucune demande ne correspond aux critères.
              </div>
            ) : (
              filteredLeads.map((lead) => {
                const isSelected = selectedLead?.id === lead.id;
                return (
                  <div
                    key={lead.id}
                    onClick={() => setSelectedLead(lead)}
                    className={`p-4 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors cursor-pointer flex items-center justify-between gap-4 ${
                      isSelected ? 'bg-amber-50/60 dark:bg-amber-950/40 border-l-4 border-l-amber-500' : ''
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-extrabold text-stone-900 dark:text-amber-400">
                          {lead.id}
                        </span>
                        {getStatusBadge(lead.status)}
                        <span className="text-[10px] uppercase font-bold text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 px-1.5 py-0.5 rounded">
                          {lead.language}
                        </span>
                      </div>

                      <div className="text-xs font-semibold text-stone-800 dark:text-stone-100">
                        {lead.fullName}
                      </div>

                      <div className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-1">
                        {lead.targetCircuitTitle || 'Voyage sur mesure'} · {lead.durationDays}j · {lead.adultsCount} ad.
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="block text-[11px] text-stone-400">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </span>
                      <span className="block text-xs font-bold text-stone-900 dark:text-white tabular-nums">
                        {lead.budgetEUR ? `${lead.budgetEUR} ${lead.currency}` : 'Sur devis'}
                      </span>
                      <ChevronRight className="w-4 h-4 text-stone-400 inline-block mt-1" />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Detail Pane */}
        <div className="lg:col-span-5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm p-6 space-y-6 transition-colors">
          {selectedLead ? (
            <>
              {/* Header */}
              <div className="flex items-start justify-between pb-4 border-b border-stone-100 dark:border-stone-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-extrabold text-amber-800 dark:text-amber-400">
                      {selectedLead.id}
                    </span>
                    <span className="text-xs uppercase font-bold text-stone-500 dark:text-stone-400">
                      [{selectedLead.language.toUpperCase()}]
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-stone-900 dark:text-white mt-1">
                    {selectedLead.fullName}
                  </h3>
                  <span className="text-xs text-stone-400">
                    Reçu le {new Date(selectedLead.createdAt).toLocaleString()}
                  </span>
                </div>

                <div>
                  {getStatusBadge(selectedLead.status)}
                </div>
              </div>

              {/* Dedicated Decision & Status Card */}
              <div className="p-4 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-stone-800 dark:text-stone-200 flex items-center gap-1.5 uppercase tracking-wide text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    Décision & Statut du Voyage
                  </span>
                  <span className="text-[10px] text-stone-500 dark:text-stone-400 font-medium">
                    {adminRole === 'Administrateur' ? '👑 Accès Décisionnaire' : '💼 Consultation Commerciale'}
                  </span>
                </div>

                {/* Current Decision State Banner */}
                {selectedLead.status === 'acceptee' && (
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-lg flex items-center gap-2.5 text-emerald-900 dark:text-emerald-200 font-bold">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <div>
                      <div>Voyage Approuvé & Validé</div>
                      <div className="text-[10px] font-normal text-emerald-700 dark:text-emerald-300">
                        Cette demande de voyage a été approuvée officiellement par l'administration.
                      </div>
                    </div>
                  </div>
                )}

                {selectedLead.status === 'sans_suite' && (
                  <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-800 rounded-lg flex items-center gap-2.5 text-red-900 dark:text-red-200 font-bold">
                    <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />
                    <div>
                      <div>Demande Refusée / Sans suite</div>
                      <div className="text-[10px] font-normal text-red-700 dark:text-red-300">
                        Cette demande a été rejetée ou classée sans suite par l'administration.
                      </div>
                    </div>
                  </div>
                )}

                {/* Approve / Reject Action Buttons */}
                {adminRole === 'Administrateur' ? (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setDecisionModal({ type: 'approve', lead: selectedLead });
                          setDecisionNote('');
                        }}
                        className={`flex-1 py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 text-xs transition-colors cursor-pointer shadow-sm ${
                          selectedLead.status === 'acceptee'
                            ? 'bg-emerald-700 text-white ring-2 ring-emerald-500'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        }`}
                        title="Approuver officiellement le voyage client"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>Approuver le voyage</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setDecisionModal({ type: 'reject', lead: selectedLead });
                          setDecisionNote('');
                        }}
                        className={`flex-1 py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 text-xs transition-colors cursor-pointer shadow-sm ${
                          selectedLead.status === 'sans_suite'
                            ? 'bg-red-700 text-white ring-2 ring-red-500'
                            : 'bg-red-600 hover:bg-red-500 text-white'
                        }`}
                        title="Refuser ou classer sans suite la demande"
                      >
                        <ThumbsDown className="w-3.5 h-3.5" />
                        <span>Refuser la demande</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-stone-200 dark:border-stone-700">
                      <span className="text-[11px] text-stone-500 dark:text-stone-400">Changer l'étape commerciale :</span>
                      <select
                        value={selectedLead.status}
                        onChange={(e) => {
                          const newStatus = e.target.value as LeadStatus;
                          updateLeadStatus(selectedLead.id, newStatus);
                          setSelectedLead({ ...selectedLead, status: newStatus });
                        }}
                        className="bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded px-2 py-1 font-semibold text-stone-800 dark:text-stone-200 text-[11px]"
                      >
                        <option value="nouvelle">Nouvelle</option>
                        <option value="a_traiter">À traiter</option>
                        <option value="contact_etabli">Contact établi</option>
                        <option value="devis_envoye">Devis envoyé</option>
                        <option value="acceptee">Acceptée (Approuvée)</option>
                        <option value="sans_suite">Sans suite (Refusée)</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  /* Commercial view */
                  <div className="space-y-2">
                    <div className="p-2.5 bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/40 rounded-lg flex items-start gap-2 text-[11px] text-amber-900 dark:text-amber-200">
                      <Lock className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block font-semibold">Décision réservée à l'Administrateur :</strong>
                        <span>
                          En tant que Commercial, vous pouvez consulter ce voyage créé par le client, le contacter et ajouter des notes de négociation. Seul l'administrateur peut approuver ou refuser la demande.
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 opacity-60 cursor-not-allowed">
                      <button
                        type="button"
                        disabled
                        className="flex-1 py-2 px-3 bg-stone-300 dark:bg-stone-700 text-stone-600 dark:text-stone-300 rounded-lg font-bold flex items-center justify-center gap-1.5 text-xs cursor-not-allowed"
                        title="Action réservée à l'administrateur"
                      >
                        <Lock className="w-3 h-3" />
                        <span>Approuver (Réservé Admin)</span>
                      </button>
                      <button
                        type="button"
                        disabled
                        className="flex-1 py-2 px-3 bg-stone-300 dark:bg-stone-700 text-stone-600 dark:text-stone-300 rounded-lg font-bold flex items-center justify-center gap-1.5 text-xs cursor-not-allowed"
                        title="Action réservée à l'administrateur"
                      >
                        <Lock className="w-3 h-3" />
                        <span>Refuser (Réservé Admin)</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-stone-200 dark:border-stone-700">
                      <span className="text-[11px] text-stone-500 dark:text-stone-400">Étape commerciale :</span>
                      <select
                        value={selectedLead.status}
                        onChange={(e) => {
                          const newStatus = e.target.value as LeadStatus;
                          updateLeadStatus(selectedLead.id, newStatus);
                          setSelectedLead({ ...selectedLead, status: newStatus });
                        }}
                        className="bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded px-2 py-1 font-semibold text-stone-800 dark:text-stone-200 text-[11px]"
                      >
                        <option value="nouvelle">Nouvelle</option>
                        <option value="a_traiter">À traiter</option>
                        <option value="contact_etabli">Contact établi</option>
                        <option value="devis_envoye">Devis envoyé</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Contact Information */}
              <div className="space-y-2 text-xs text-stone-700 dark:text-stone-300">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-stone-400" />
                  <a href={`mailto:${selectedLead.email}`} className="text-amber-700 dark:text-amber-400 hover:underline">
                    {selectedLead.email}
                  </a>
                </div>
                {selectedLead.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-stone-400" />
                    <a
                      href={`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 dark:text-emerald-400 hover:underline"
                    >
                      {selectedLead.phone} (Ouvrir WhatsApp)
                    </a>
                  </div>
                )}
                {selectedLead.country && (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-stone-400" />
                    <span>Pays de résidence : {selectedLead.country}</span>
                  </div>
                )}
              </div>

              {/* Trip Parameters */}
              <div className="p-4 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700 text-xs space-y-2">
                <div className="font-bold text-stone-900 dark:text-white border-b border-stone-200 dark:border-stone-700 pb-1">
                  Projet : {selectedLead.targetCircuitTitle || 'Voyage Sur Mesure'}
                </div>
                <div className="grid grid-cols-2 gap-2 text-stone-600 dark:text-stone-400">
                  <div>Durée : <strong className="text-stone-900 dark:text-white">{selectedLead.durationDays} jours</strong></div>
                  <div>Participants : <strong className="text-stone-900 dark:text-white">{selectedLead.adultsCount} ad. {selectedLead.childrenCount > 0 ? `/ ${selectedLead.childrenCount} enf.` : ''}</strong></div>
                  <div>Départ : <strong className="text-stone-900 dark:text-white">{selectedLead.departureDate || 'À définir'}</strong></div>
                  <div>Hébergement : <strong className="text-stone-900 dark:text-white capitalize">{selectedLead.accommodationLevel}</strong></div>
                  <div>Budget : <strong className="text-stone-900 dark:text-white">{selectedLead.budgetEUR ? `${selectedLead.budgetEUR} ${selectedLead.currency}` : 'Non spécifié'}</strong></div>
                  <div>Assigné à : <strong className="text-stone-900 dark:text-white">{selectedLead.assignedTo || 'Non assigné'}</strong></div>
                </div>

                {selectedLead.message && (
                  <div className="pt-2 border-t border-stone-200 dark:border-stone-700">
                    <span className="font-semibold text-stone-700 dark:text-stone-300 block mb-0.5">Message client :</span>
                    <p className="italic text-stone-600 dark:text-stone-300 bg-white dark:bg-stone-900 p-2.5 rounded border border-stone-200 dark:border-stone-700">
                      "{selectedLead.message}"
                    </p>
                  </div>
                )}
              </div>

              {/* Internal Notes History */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-stone-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  Notes Internes & Historique ({selectedLead.internalNotes.length})
                </h4>

                <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                  {selectedLead.internalNotes.length === 0 ? (
                    <span className="text-xs text-stone-400 italic">Aucune note enregistrée.</span>
                  ) : (
                    selectedLead.internalNotes.map((note) => (
                      <div
                        key={note.id}
                        className="p-2.5 bg-stone-50 dark:bg-stone-800/60 rounded border border-stone-200 dark:border-stone-700 text-xs text-stone-700 dark:text-stone-300"
                      >
                        <div className="flex items-center justify-between text-[10px] text-stone-400 dark:text-stone-500 mb-1">
                          <span className="font-bold text-stone-800 dark:text-stone-200">{note.author}</span>
                          <span>{note.date}</span>
                        </div>
                        <p>{note.note}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Note Input */}
                <form onSubmit={handleAddNote} className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="Ajouter une note de suivi..."
                    className="flex-1 text-xs px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 bg-stone-900 dark:bg-amber-500 hover:bg-stone-800 dark:hover:bg-amber-400 text-white dark:text-stone-950 font-bold rounded-lg text-xs cursor-pointer transition-colors"
                  >
                    Ajouter
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="py-20 text-center text-xs text-stone-400 space-y-2">
              <User className="w-8 h-8 text-stone-300 dark:text-stone-600 mx-auto" />
              <p>Sélectionnez une demande dans la liste pour voir l'intégralité du dossier et les notes commerciales.</p>
            </div>
          )}
        </div>
      </div>

      {/* Decision Modal (Admin Confirmation) */}
      {decisionModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleConfirmDecision}
            className="bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 dark:border-stone-800 space-y-4 text-xs animate-in fade-in zoom-in-95 max-h-[92dvh] overflow-y-auto"
          >
            <div className="flex items-center gap-3 pb-3 border-b border-stone-100 dark:border-stone-800">
              <div
                className={`p-2 rounded-lg ${
                  decisionModal.type === 'approve'
                    ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300'
                    : 'bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-300'
                }`}
              >
                {decisionModal.type === 'approve' ? (
                  <ThumbsUp className="w-5 h-5" />
                ) : (
                  <ThumbsDown className="w-5 h-5" />
                )}
              </div>
              <div>
                <h3 className="text-base font-extrabold text-stone-900 dark:text-white">
                  {decisionModal.type === 'approve'
                    ? 'Confirmer l\'Approbation du Voyage'
                    : 'Confirmer le Refus de la Demande'}
                </h3>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  Client : {decisionModal.lead.fullName} ({decisionModal.lead.id})
                </p>
              </div>
            </div>

            <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
              {decisionModal.type === 'approve'
                ? `En tant qu'Administrateur, vous validez officiellement le projet "${decisionModal.lead.targetCircuitTitle || 'Voyage sur mesure'}" (${decisionModal.lead.durationDays} jours). Le statut passera à "Acceptée" et une note officielle sera ajoutée.`
                : `En tant qu'Administrateur, vous refusez cette demande de voyage. Le statut passera à "Sans suite" avec consignation du motif.`}
            </p>

            <div>
              <label className="block font-bold text-stone-800 dark:text-stone-200 mb-1">
                {decisionModal.type === 'approve'
                  ? 'Note de validation / Accord (optionnel) :'
                  : 'Motif du refus (optionnel) :'}
              </label>
              <textarea
                value={decisionNote}
                onChange={(e) => setDecisionNote(e.target.value)}
                placeholder={
                  decisionModal.type === 'approve'
                    ? 'Ex: Devis accepté, dates confirmées avec le réceptif...'
                    : 'Ex: Capacité hébergement saturée sur cette période...'
                }
                rows={3}
                className="w-full text-xs p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDecisionModal(null)}
                className="px-3.5 py-2 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white font-semibold cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="submit"
                className={`px-4 py-2 text-white font-bold rounded-lg shadow-sm cursor-pointer ${
                  decisionModal.type === 'approve'
                    ? 'bg-emerald-600 hover:bg-emerald-500'
                    : 'bg-red-600 hover:bg-red-500'
                }`}
              >
                {decisionModal.type === 'approve'
                  ? 'Valider l\'approbation'
                  : 'Confirmer le refus'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
