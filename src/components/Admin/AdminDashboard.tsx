import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LeadManagement } from './LeadManagement';
import { ContentManagement } from './ContentManagement';
import {
  Users,
  Compass,
  FileCheck,
  TrendingUp,
  Globe,
  ArrowLeft,
  DollarSign,
  Shield,
  Layers,
  LogOut,
  Briefcase,
  ShieldCheck,
  Crown,
  Info,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  X,
  Check,
  KeyRound,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    quoteRequests,
    circuits,
    setIsAdminMode,
    logoutAdmin,
    adminRole,
    setAdminRole,
    language,
    t,
    formatPrice,
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<'leads' | 'content' | 'audit'>('leads');
  const [showAdminUnlockModal, setShowAdminUnlockModal] = useState<boolean>(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState<string>('');
  const [adminPasswordError, setAdminPasswordError] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [unlockSuccessToast, setUnlockSuccessToast] = useState<boolean>(false);

  // Compute key commercial KPIs
  const totalLeads = quoteRequests.length;
  const newLeads = quoteRequests.filter((l) => l.status === 'nouvelle').length;
  const inProgressLeads = quoteRequests.filter(
    (l) => l.status === 'a_traiter' || l.status === 'contact_etabli' || l.status === 'devis_envoye'
  ).length;
  const acceptedLeads = quoteRequests.filter((l) => l.status === 'acceptee').length;

  const totalPipelineBudgetEUR = quoteRequests.reduce((sum, l) => {
    return sum + (l.budgetEUR || 0);
  }, 0);

  const frLeadsCount = quoteRequests.filter((l) => l.language === 'fr').length;
  const enLeadsCount = quoteRequests.filter((l) => l.language === 'en').length;
  const mgLeadsCount = quoteRequests.filter((l) => l.language === 'mg').length;

  const handleRoleSelect = (targetRole: 'Commercial' | 'Administrateur') => {
    if (targetRole === 'Commercial') {
      setAdminRole('Commercial');
    } else if (targetRole === 'Administrateur') {
      if (adminRole === 'Administrateur') return;
      setAdminPasswordInput('');
      setAdminPasswordError(false);
      setShowAdminUnlockModal(true);
    }
  };

  const handleUnlockAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = adminPasswordInput.trim();
    if (
      trimmed === 'admin123' ||
      trimmed === 'admin2026' ||
      trimmed === 'Admin2026@Mahajanga' ||
      trimmed === 'admin' ||
      trimmed.toLowerCase() === 'mahajanga' ||
      trimmed.toLowerCase() === 'mahajanga2026'
    ) {
      setAdminRole('Administrateur');
      setShowAdminUnlockModal(false);
      setAdminPasswordError(false);
      setAdminPasswordInput('');
      setUnlockSuccessToast(true);
      setTimeout(() => setUnlockSuccessToast(false), 3500);
    } else {
      setAdminPasswordError(true);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100/60 dark:bg-stone-950 text-stone-900 dark:text-stone-100 pb-20 transition-colors duration-200">
      {/* Admin Top Header - Always fixed and permanently visible */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-stone-900/95 backdrop-blur-md text-white border-b border-stone-800 shadow-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              onClick={() => setIsAdminMode(false)}
              className="p-1.5 sm:p-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors cursor-pointer shrink-0"
              title={t('admin.exit')}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-amber-400">
                  {t('admin.title')}
                </span>
                <span className="text-xs text-stone-500">·</span>
                <span className="text-xs text-stone-400">Mahajanga</span>
              </div>
              <h1 className="text-base sm:text-xl font-extrabold text-white tracking-tight truncate">
                <span className="hidden sm:inline">Ravinala Tours Madagascar — </span>Administration & Ventes
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Protected Role Switcher */}
            <div className="flex items-center gap-2 bg-stone-800/90 p-1.5 rounded-lg border border-stone-700 text-xs">
              <span className="text-stone-400 px-2 flex items-center gap-1 font-medium">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                {t('admin.roleActive')}
              </span>
              
              {/* Commercial Button */}
              <button
                type="button"
                onClick={() => handleRoleSelect('Commercial')}
                className={`px-3 py-1.5 rounded font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  adminRole === 'Commercial'
                    ? 'bg-amber-500 text-stone-950 shadow-sm font-bold'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                <Briefcase className="w-3 h-3" />
                <span>Commercial</span>
              </button>

              {/* Administrateur Button (Password-Locked from Commercial) */}
              <button
                type="button"
                onClick={() => handleRoleSelect('Administrateur')}
                className={`px-3 py-1.5 rounded font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  adminRole === 'Administrateur'
                    ? 'bg-amber-500 text-stone-950 shadow-sm font-bold'
                    : 'text-stone-300 hover:text-white hover:bg-stone-700/60'
                }`}
                title={adminRole === 'Commercial' ? 'Verrouillé par mot de passe administrateur' : 'Rôle actif'}
              >
                {adminRole === 'Administrateur' ? (
                  <Crown className="w-3 h-3 text-stone-950" />
                ) : (
                  <Lock className="w-3 h-3 text-amber-400" />
                )}
                <span>
                  {adminRole === 'Administrateur' ? 'Administrateur' : 'Admin (Verrouillé)'}
                </span>
              </button>
            </div>

            {/* Logout Button */}
            <button
              onClick={logoutAdmin}
              className="flex items-center gap-1.5 px-3 py-2 bg-stone-800 hover:bg-red-950/80 text-stone-300 hover:text-red-200 border border-stone-700 hover:border-red-700/60 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              title={t('admin.logout')}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('admin.logout')}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Spacer to guarantee content starts cleanly below the fixed admin header */}
      <div className="h-28 sm:h-20 shrink-0" aria-hidden="true" />

      {/* Success notification when Admin is unlocked */}
      {unlockSuccessToast && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 animate-fadeIn">
          <div className="bg-emerald-600 text-white text-xs px-4 py-2.5 rounded-xl shadow flex items-center gap-2 font-medium">
            <Check className="w-4 h-4 text-emerald-200" />
            <span>Accès Administrateur déverrouillé avec succès ! Vous disposez désormais de tous les droits de création, modification et décision.</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Active Role Explanatory Banner with Lock/Unlock action */}
        <div
          className={`p-4 rounded-xl border text-xs sm:text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm ${
            adminRole === 'Administrateur'
              ? 'bg-gradient-to-r from-amber-50 to-emerald-50 dark:from-stone-900 dark:to-stone-900 border-amber-200 dark:border-stone-800 text-stone-900 dark:text-stone-100'
              : 'bg-gradient-to-r from-sky-50 to-amber-50 dark:from-stone-900 dark:to-stone-900 border-sky-200 dark:border-stone-800 text-stone-900 dark:text-stone-100'
          }`}
        >
          <div className="flex items-start sm:items-center gap-3">
            <div
              className={`p-2.5 rounded-lg shrink-0 ${
                adminRole === 'Administrateur'
                  ? 'bg-amber-500 text-stone-950 shadow-sm'
                  : 'bg-sky-600 text-white shadow-sm'
              }`}
            >
              {adminRole === 'Administrateur' ? (
                <ShieldCheck className="w-5 h-5" />
              ) : (
                <Briefcase className="w-5 h-5" />
              )}
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-extrabold uppercase tracking-wide text-xs px-2 py-0.5 rounded-full bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white">
                  {adminRole === 'Administrateur' ? '👑 Administrateur' : '💼 Commercial'}
                </span>
                <span className="text-xs font-bold text-stone-600 dark:text-stone-400">
                  {adminRole === 'Administrateur'
                    ? 'Faits & Droits : Plein pouvoir'
                    : 'Faits & Droits : Consultation & Traitement'}
                </span>
              </div>
              <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed max-w-3xl">
                {adminRole === 'Administrateur' ? (
                  <>
                    <strong>Pouvoirs exclusifs :</strong> Vous pouvez <strong>créer, modifier et supprimer de nouveaux voyages</strong> (circuits et départs garantis) et vous détenez l'autorité d'<strong>approuver ou refuser officiellement les demandes de voyage</strong> faites par les utilisateurs.
                  </>
                ) : (
                  <>
                    <strong>Attributions commerciales :</strong> Vous pouvez <strong>consulter les voyages créés par les utilisateurs</strong> (demandes de devis et projets sur-mesure) ainsi que <strong>les voyages créés par l'administration</strong>. Vous pouvez ajouter des notes de suivi. <em>La création, modification et suppression de voyages ainsi que la validation/refus officiel sont verrouillées par mot de passe.</em>
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2 self-end sm:self-center">
            {adminRole === 'Administrateur' ? (
              <button
                onClick={() => setAdminRole('Commercial')}
                className="px-3 py-1.5 bg-stone-800 hover:bg-stone-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                title="Repasser en mode Commercial pour protéger les actions sensibles"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Verrouiller en mode Commercial</span>
              </button>
            ) : (
              <button
                onClick={() => handleRoleSelect('Administrateur')}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-all hover:scale-[1.02]"
                title="Saisir le mot de passe pour passer en mode Administrateur"
              >
                <Lock className="w-3.5 h-3.5 text-stone-950" />
                <span>Déverrouiller Administrateur</span>
              </button>
            )}
          </div>
        </div>

        {/* Commercial Pipeline KPI Cards - Responsive & Informative Display */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Card 1: Total Leads */}
          <div className="bg-white dark:bg-stone-900 p-4 sm:p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs hover:border-amber-400 dark:hover:border-amber-500 transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 truncate">
                {t('admin.leadsTotal')}
              </span>
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold shrink-0">
                <Users className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </div>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tabular-nums tracking-tight">
                {totalLeads}
              </span>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 truncate">
                {t('admin.leadsTotalSub')}
              </p>
            </div>
          </div>

          {/* Card 2: Active / In-Progress Leads */}
          <div className="bg-white dark:bg-stone-900 p-4 sm:p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs hover:border-blue-400 dark:hover:border-blue-500 transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 truncate">
                {t('admin.leadsActive')}
              </span>
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold shrink-0">
                <TrendingUp className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </div>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tabular-nums tracking-tight">
                {inProgressLeads}
              </span>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 truncate">
                {t('admin.leadsActiveSub')}
              </p>
            </div>
          </div>

          {/* Card 3: Confirmed / Accepted Trips */}
          <div className="bg-white dark:bg-stone-900 p-4 sm:p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs hover:border-emerald-400 dark:hover:border-emerald-500 transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 truncate">
                {t('admin.leadsConfirmed')}
              </span>
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold shrink-0">
                <FileCheck className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </div>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tabular-nums tracking-tight">
                {acceptedLeads}
              </span>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 truncate">
                {t('admin.leadsConfirmedSub')}
              </p>
            </div>
          </div>

          {/* Card 4: Estimated Pipeline Budget */}
          <div className="bg-white dark:bg-stone-900 p-4 sm:p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs hover:border-amber-400 dark:hover:border-amber-500 transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 truncate">
                {t('admin.leadsBudget')}
              </span>
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold shrink-0">
                <DollarSign className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </div>
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white tabular-nums tracking-tight">
                {formatPrice(totalPipelineBudgetEUR)}
              </span>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 truncate">
                {t('admin.leadsBudgetSub')}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation Strip */}
        <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveAdminTab('leads')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer transition-colors shrink-0 ${
              activeAdminTab === 'leads'
                ? 'bg-stone-900 dark:bg-amber-500 text-white dark:text-stone-950 shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200/60 dark:hover:bg-stone-800'
            }`}
          >
            <Users className="w-4 h-4 text-amber-400 dark:text-stone-950" />
            <span>Gestion des Devis & Dossiers ({quoteRequests.length})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('content')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer transition-colors shrink-0 ${
              activeAdminTab === 'content'
                ? 'bg-stone-900 dark:bg-amber-500 text-white dark:text-stone-950 shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200/60 dark:hover:bg-stone-800'
            }`}
          >
            <Compass className="w-4 h-4 text-amber-400 dark:text-stone-950" />
            <span>Circuits & Départs Garantis ({circuits.length})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('audit')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer transition-colors shrink-0 ${
              activeAdminTab === 'audit'
                ? 'bg-stone-900 dark:bg-amber-500 text-white dark:text-stone-950 shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200/60 dark:hover:bg-stone-800'
            }`}
          >
            <Globe className="w-4 h-4 text-amber-400 dark:text-stone-950" />
            <span>Audit Trilingue FR / EN / MG</span>
          </button>
        </div>

        {/* TAB CONTENT 1: LEADS MANAGEMENT */}
        {activeAdminTab === 'leads' && <LeadManagement />}

        {/* TAB CONTENT 2: CONTENT MANAGEMENT */}
        {activeAdminTab === 'content' && <ContentManagement />}

        {/* TAB CONTENT 3: TRILINGUAL AUDIT */}
        {activeAdminTab === 'audit' && (
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-bold text-stone-900 dark:text-white">
                Contrôle de Conformité Linguistique (FR / EN / MG)
              </h2>
              <p className="text-xs text-stone-600 dark:text-stone-300 mt-1">
                Vérification de l'exhaustivité des contenus pour les marchés francophone, anglophone et le public national malagasy.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-stone-900 dark:text-white">Français (FR)</span>
                  <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                    100% Conforme
                  </span>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-300">
                  {circuits.length} circuits intégralement rédigés avec étapes, inclusions et conseils.
                </p>
                <div className="text-[11px] text-stone-500 dark:text-stone-400 pt-2 border-t border-stone-200 dark:border-stone-700">
                  {frLeadsCount} demandes reçues en Français
                </div>
              </div>

              <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-stone-900 dark:text-white">English (EN)</span>
                  <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                    100% Conforme
                  </span>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-300">
                  {circuits.length} circuits avec descriptions et étapes anglaises complètes.
                </p>
                <div className="text-[11px] text-stone-500 dark:text-stone-400 pt-2 border-t border-stone-200 dark:border-stone-700">
                  {enLeadsCount} demandes reçues en Anglais
                </div>
              </div>

              <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-stone-900 dark:text-white">Malagasy (MG)</span>
                  <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                    100% Conforme
                  </span>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-300">
                  {circuits.length} circuits avec fiches et étapes en langue malgache authentique.
                </p>
                <div className="text-[11px] text-stone-500 dark:text-stone-400 pt-2 border-t border-stone-200 dark:border-stone-700">
                  {mgLeadsCount} demandes reçues en Malagasy
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 dark:bg-stone-800 border-b border-stone-200 dark:border-stone-700 text-stone-500 dark:text-stone-400 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="p-3">Circuit</th>
                    <th className="p-3">FR</th>
                    <th className="p-3">EN</th>
                    <th className="p-3">MG</th>
                    <th className="p-3">Dernière révision</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                  {circuits.map((circ) => (
                    <tr key={circ.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/50">
                      <td className="p-3 font-semibold text-stone-900 dark:text-white">
                        {circ.title.fr}
                      </td>
                      <td className="p-3">
                        <span className="bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded font-bold">
                          Publié (100%)
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded font-bold">
                          Publié (100%)
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded font-bold">
                          Publié (100%)
                        </span>
                      </td>
                      <td className="p-3 text-stone-400 dark:text-stone-500">17 Octobre 2026</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ADMIN UNLOCK SECURITY MODAL */}
      {showAdminUnlockModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-stone-200 dark:border-stone-800 relative animate-in fade-in zoom-in-95 duration-150 max-h-[92dvh] overflow-y-auto">
            <button
              onClick={() => {
                setShowAdminUnlockModal(false);
                setAdminPasswordError(false);
              }}
              className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
              title="Fermer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5" />
                  Sécurité Ravinala Tours
                </span>
                <h3 className="text-lg font-extrabold text-stone-900 dark:text-white tracking-tight">
                  Déverrouiller le rôle Administrateur
                </h3>
              </div>
            </div>

            <p className="text-xs text-stone-600 dark:text-stone-300 mb-5 leading-relaxed">
              La bascule vers l'espace <strong>Administrateur</strong> est protégée. Ce rôle permet la création, modification et suppression des circuits, ainsi que la validation officielle des demandes de devis.
            </p>

            {adminPasswordError && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-xl text-xs text-red-700 dark:text-red-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Mot de passe administrateur incorrect</p>
                  <p className="text-[11px] text-red-600 dark:text-red-400 mt-0.5">
                    Veuillez saisir le code administrateur autorisé (ex: <code className="bg-red-100 dark:bg-red-900/50 px-1 py-0.5 rounded font-mono font-bold text-red-800 dark:text-red-200">admin123</code> ou <code className="bg-red-100 dark:bg-red-900/50 px-1 py-0.5 rounded font-mono font-bold text-red-800 dark:text-red-200">admin2026</code>).
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleUnlockAdmin} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
                    Mot de passe Administrateur
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setAdminPasswordInput('admin123');
                      setAdminPasswordError(false);
                    }}
                    className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                  >
                    Remplir démo (admin123)
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoFocus
                    value={adminPasswordInput}
                    onChange={(e) => {
                      setAdminPasswordInput(e.target.value);
                      setAdminPasswordError(false);
                    }}
                    placeholder="Saisissez le mot de passe administrateur"
                    className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-stone-300 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-600 transition-colors bg-white dark:bg-stone-800 text-stone-900 dark:text-white font-medium pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 cursor-pointer"
                    aria-label="Afficher/masquer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAdminUnlockModal(false);
                    setAdminPasswordError(false);
                  }}
                  className="flex-1 py-2.5 px-4 text-xs font-semibold text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-lg transition-colors cursor-pointer text-center"
                >
                  Rester Commercial
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 text-xs font-bold text-stone-950 bg-amber-500 hover:bg-amber-400 rounded-lg shadow-sm transition-all hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Déverrouiller</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
