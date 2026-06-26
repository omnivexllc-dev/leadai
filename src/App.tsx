/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Search, Smartphone, Cpu, Users, Mail, Zap, Layers, FileText, 
  Settings, CreditCard, Shield, Sun, Moon, Sparkles, Building2, LogOut, Menu, Bell
} from 'lucide-react';

// Custom modular components
import SaaSDashboard from './components/SaaSDashboard';
import LeadFinderTab from './components/LeadFinderTab';
import WebsiteAnalyzerTab from './components/WebsiteAnalyzerTab';
import ResearchAgentTab from './components/ResearchAgentTab';
import DecisionMakersTab from './components/DecisionMakersTab';
import OutreachStudioTab from './components/OutreachStudioTab';
import CampaignManagerTab from './components/CampaignManagerTab';
import CRMKanbanTab from './components/CRMKanbanTab';
import ProposalGeneratorTab from './components/ProposalGeneratorTab';
import TeamCollaborationTab from './components/TeamCollaborationTab';
import BillingTab from './components/BillingTab';
import AdminPanelTab from './components/AdminPanelTab';

// Static demo arrays
import { Lead, ConsultantProfile, Campaign, TeamMember, ActivityLog, Notification, Proposal, CRMStage, LeadStatus, CRMNote, CRMTask } from './types';
import { 
  DEMO_LEADS, INITIAL_CONSULTANT_PROFILE, INITIAL_CAMPAIGNS, 
  INITIAL_TEAM_MEMBERS, INITIAL_ACTIVITY_LOGS, INITIAL_NOTIFICATIONS, INITIAL_PROPOSALS 
} from './data';

export default function App() {
  // App primary states
  const [leads, setLeads] = useState<Lead[]>([]);
  const [consultant, setConsultant] = useState<ConsultantProfile>(INITIAL_CONSULTANT_PROFILE);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [currentPlanId, setCurrentPlanId] = useState<string>('plan-growth');

  // View states
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isDark, setIsDark] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  // Load cache on mount
  useEffect(() => {
    try {
      const cachedLeads = localStorage.getItem('lg_leads');
      const cachedProfile = localStorage.getItem('lg_profile');
      const cachedCampaigns = localStorage.getItem('lg_campaigns');
      const cachedMembers = localStorage.getItem('lg_members');
      const cachedActivities = localStorage.getItem('lg_activities');
      const cachedNotifications = localStorage.getItem('lg_notifications');
      const cachedProposals = localStorage.getItem('lg_proposals');
      const cachedPlan = localStorage.getItem('lg_plan_id');
      const cachedTheme = localStorage.getItem('lg_is_dark');

      if (cachedLeads) setLeads(JSON.parse(cachedLeads));
      else {
        setLeads(DEMO_LEADS);
        localStorage.setItem('lg_leads', JSON.stringify(DEMO_LEADS));
      }

      if (cachedProfile) setConsultant(JSON.parse(cachedProfile));
      else {
        localStorage.setItem('lg_profile', JSON.stringify(INITIAL_CONSULTANT_PROFILE));
      }

      if (cachedCampaigns) setCampaigns(JSON.parse(cachedCampaigns));
      else {
        setCampaigns(INITIAL_CAMPAIGNS);
        localStorage.setItem('lg_campaigns', JSON.stringify(INITIAL_CAMPAIGNS));
      }

      if (cachedMembers) setMembers(JSON.parse(cachedMembers));
      else {
        setMembers(INITIAL_TEAM_MEMBERS);
        localStorage.setItem('lg_members', JSON.stringify(INITIAL_TEAM_MEMBERS));
      }

      if (cachedActivities) setActivities(JSON.parse(cachedActivities));
      else {
        setActivities(INITIAL_ACTIVITY_LOGS);
        localStorage.setItem('lg_activities', JSON.stringify(INITIAL_ACTIVITY_LOGS));
      }

      if (cachedNotifications) setNotifications(JSON.parse(cachedNotifications));
      else {
        setNotifications(INITIAL_NOTIFICATIONS);
        localStorage.setItem('lg_notifications', JSON.stringify(INITIAL_NOTIFICATIONS));
      }

      if (cachedProposals) setProposals(JSON.parse(cachedProposals));
      else {
        setProposals(INITIAL_PROPOSALS);
        localStorage.setItem('lg_proposals', JSON.stringify(INITIAL_PROPOSALS));
      }

      if (cachedPlan) setCurrentPlanId(cachedPlan);
      if (cachedTheme) setIsDark(JSON.parse(cachedTheme));

    } catch (e) {
      console.error('LocalStorage load issue, using fallback demo sets:', e);
      setLeads(DEMO_LEADS);
      setCampaigns(INITIAL_CAMPAIGNS);
      setMembers(INITIAL_TEAM_MEMBERS);
      setActivities(INITIAL_ACTIVITY_LOGS);
      setNotifications(INITIAL_NOTIFICATIONS);
      setProposals(INITIAL_PROPOSALS);
    }
  }, []);

  // Save changes wrapper
  const saveLeadsToDB = (updatedLeads: Lead[]) => {
    setLeads(updatedLeads);
    localStorage.setItem('lg_leads', JSON.stringify(updatedLeads));
  };

  const saveCampaignsToDB = (updatedCampaigns: Campaign[]) => {
    setCampaigns(updatedCampaigns);
    localStorage.setItem('lg_campaigns', JSON.stringify(updatedCampaigns));
  };

  const saveMembersToDB = (updatedMembers: TeamMember[]) => {
    setMembers(updatedMembers);
    localStorage.setItem('lg_members', JSON.stringify(updatedMembers));
  };

  const saveActivitiesToDB = (updatedActivities: ActivityLog[]) => {
    setActivities(updatedActivities);
    localStorage.setItem('lg_activities', JSON.stringify(updatedActivities));
  };

  const saveNotificationsToDB = (updatedNotifications: Notification[]) => {
    setNotifications(updatedNotifications);
    localStorage.setItem('lg_notifications', JSON.stringify(updatedNotifications));
  };

  const saveProposalsToDB = (updatedProposals: Proposal[]) => {
    setProposals(updatedProposals);
    localStorage.setItem('lg_proposals', JSON.stringify(updatedProposals));
  };

  const handleToggleTheme = () => {
    const nextTheme = !isDark;
    setIsDark(nextTheme);
    localStorage.setItem('lg_is_dark', JSON.stringify(nextTheme));
  };

  // Add individual actions
  const handleLeadSingleAdded = (newLead: Lead) => {
    const newUrl = (newLead?.websiteUrl || '').toLowerCase().trim();
    const updated = [newLead, ...leads.filter(l => (l?.websiteUrl || '').toLowerCase().trim() !== newUrl)];
    saveLeadsToDB(updated);

    // Append discovery event
    const newLog: ActivityLog = {
      id: `act-${Date.now()}`,
      userId: 'team-1',
      userName: 'Alex Vance',
      action: 'Imported scanned prospect',
      target: newLead.businessName,
      createdAt: new Date().toISOString(),
      type: 'lead'
    };
    saveActivitiesToDB([newLog, ...activities]);
  };

  const handleLeadsAdded = (newLeads: Lead[]) => {
    const urls = new Set(leads.map(l => (l?.websiteUrl || '').toLowerCase().trim()));
    const uniques = newLeads.filter(l => !urls.has((l?.websiteUrl || '').toLowerCase().trim()));
    const updated = [...uniques, ...leads];
    saveLeadsToDB(updated);

    // Append log
    const newLog: ActivityLog = {
      id: `act-${Date.now()}`,
      userId: 'team-1',
      userName: 'Alex Vance',
      action: `Bulk scanned & imported ${newLeads.length} leads`,
      target: 'SaaS Active Directory',
      createdAt: new Date().toISOString(),
      type: 'lead'
    };
    saveActivitiesToDB([newLog, ...activities]);
  };

  const handleAddCampaign = (camp: Campaign) => {
    const updated = [camp, ...campaigns];
    saveCampaignsToDB(updated);

    const newLog: ActivityLog = {
      id: `act-${Date.now()}`,
      userId: 'team-1',
      userName: 'Alex Vance',
      action: 'Created sequence campaign',
      target: camp.name,
      createdAt: new Date().toISOString(),
      type: 'campaign'
    };
    saveActivitiesToDB([newLog, ...activities]);
  };

  const handleToggleCampaignStatus = (id: string) => {
    const updated = campaigns.map(c => {
      if (c.id === id) {
        const nextStatus = (c.status === 'Active' ? 'Paused' : 'Active') as 'Active' | 'Paused';
        return { ...c, status: nextStatus };
      }
      return c;
    });
    saveCampaignsToDB(updated);
  };

  const handleInviteTeamSeat = (m: TeamMember) => {
    const updated = [...members, m];
    saveMembersToDB(updated);

    const newLog: ActivityLog = {
      id: `act-${Date.now()}`,
      userId: 'team-1',
      userName: 'Alex Vance',
      action: 'Allocated collaboration seat to',
      target: m.name,
      createdAt: new Date().toISOString(),
      type: 'team'
    };
    saveActivitiesToDB([newLog, ...activities]);
  };

  const handleMarkNotificationsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    saveNotificationsToDB(updated);
  };

  const handleAddProposal = (prop: Proposal) => {
    const updated = [prop, ...proposals];
    saveProposalsToDB(updated);

    const newLog: ActivityLog = {
      id: `act-${Date.now()}`,
      userId: 'team-1',
      userName: 'Alex Vance',
      action: 'Generated smart AI business proposal for',
      target: prop.leadName,
      createdAt: new Date().toISOString(),
      type: 'crm'
    };
    saveActivitiesToDB([newLog, ...activities]);
  };

  // CRM status operations
  const handleUpdateLeadStage = (leadId: string, stage: CRMStage, status: LeadStatus) => {
    const updated = leads.map(l => l.id === leadId ? { ...l, crmStage: stage, status } : l);
    saveLeadsToDB(updated);

    const targetLead = leads.find(l => l.id === leadId);
    if (targetLead) {
      const newLog: ActivityLog = {
        id: `act-${Date.now()}`,
        userId: 'team-2',
        userName: 'Marcus Brody',
        action: `Moved deal to "${stage}" for`,
        target: targetLead.businessName,
        createdAt: new Date().toISOString(),
        type: 'crm'
      };
      saveActivitiesToDB([newLog, ...activities]);
    }
  };

  const handleAddCRMNote = (leadId: string, note: CRMNote) => {
    const updated = leads.map(l => {
      if (l.id === leadId) {
        return { ...l, notes: [...(l.notes || []), note] };
      }
      return l;
    });
    saveLeadsToDB(updated);
  };

  const handleAddCRMTask = (leadId: string, task: CRMTask) => {
    const updated = leads.map(l => {
      if (l.id === leadId) {
        return { ...l, tasks: [...(l.tasks || []), task] };
      }
      return l;
    });
    saveLeadsToDB(updated);
  };

  const handleToggleCRMTask = (leadId: string, taskId: string) => {
    const updated = leads.map(l => {
      if (l.id === leadId) {
        const tasks = (l.tasks || []).map(t => t.id === taskId ? { ...t, completed: !t.completed } : t);
        return { ...l, tasks };
      }
      return l;
    });
    saveLeadsToDB(updated);
  };

  const handleUpgradePlan = (planId: string) => {
    setCurrentPlanId(planId);
    localStorage.setItem('lg_plan_id', planId);

    const newLog: ActivityLog = {
      id: `act-${Date.now()}`,
      userId: 'team-3',
      userName: 'Lina Dupont',
      action: 'Upgraded subscription tier to',
      target: planId.split('-')[1].toUpperCase(),
      createdAt: new Date().toISOString(),
      type: 'billing'
    };
    saveActivitiesToDB([newLog, ...activities]);
  };

  return (
    <div className={`min-h-screen flex font-sans select-none antialiased ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* LEFT SIDEBAR BAR PANEL */}
      <aside className={`shrink-0 border-r transition-all duration-300 flex flex-col justify-between ${
        sidebarOpen ? 'w-64' : 'w-16'
      } ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      } print:hidden`}>
        
        {/* Core Logo heading */}
        <div className="space-y-6">
          <div className={`h-16 flex items-center justify-between px-4 border-b ${
            isDark ? 'border-slate-800' : 'border-slate-150'
          }`}>
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shrink-0 font-black text-sm">
                L
              </div>
              {sidebarOpen && (
                <span className={`text-sm font-black tracking-tight truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  LeadGenius AI
                </span>
              )}
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>

          {/* Links list */}
          <nav className="px-2.5 space-y-1.5 overflow-y-auto max-h-[75vh]">
            <p className={`text-[10px] uppercase tracking-wider font-black px-2 pb-1.5 ${
              sidebarOpen ? 'block' : 'hidden'
            } ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              Main Workspace
            </p>

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-blue-600 text-white font-black shadow'
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              {sidebarOpen && <span>SaaS Overview</span>}
            </button>

            <button
              onClick={() => setActiveTab('lead-finder')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'lead-finder'
                  ? 'bg-blue-600 text-white font-black shadow'
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Search className="w-4 h-4 shrink-0" />
              {sidebarOpen && <span>AI Lead Finder</span>}
            </button>

            <button
              onClick={() => setActiveTab('website-analyzer')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'website-analyzer'
                  ? 'bg-blue-600 text-white font-black shadow'
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Smartphone className="w-4 h-4 shrink-0" />
              {sidebarOpen && <span>Website Analyzer</span>}
            </button>

            <button
              onClick={() => setActiveTab('research-agent')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'research-agent'
                  ? 'bg-blue-600 text-white font-black shadow'
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Cpu className="w-4 h-4 shrink-0" />
              {sidebarOpen && <span>AI Research Agent</span>}
            </button>

            <button
              onClick={() => setActiveTab('contacts-verifier')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'contacts-verifier'
                  ? 'bg-blue-600 text-white font-black shadow'
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Users className="w-4 h-4 shrink-0" />
              {sidebarOpen && <span>Decision & Verify</span>}
            </button>

            <button
              onClick={() => setActiveTab('outreach-studio')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'outreach-studio'
                  ? 'bg-blue-600 text-white font-black shadow'
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Mail className="w-4 h-4 shrink-0" />
              {sidebarOpen && <span>Outreach Studio</span>}
            </button>

            <button
              onClick={() => setActiveTab('sequences-manager')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'sequences-manager'
                  ? 'bg-blue-600 text-white font-black shadow'
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Zap className="w-4 h-4 shrink-0" />
              {sidebarOpen && <span>Email Campaigns</span>}
            </button>

            <button
              onClick={() => setActiveTab('pipeline-crm')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'pipeline-crm'
                  ? 'bg-blue-600 text-white font-black shadow'
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Layers className="w-4 h-4 shrink-0" />
              {sidebarOpen && <span>Kanban CRM Board</span>}
            </button>

            <button
              onClick={() => setActiveTab('proposals')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'proposals'
                  ? 'bg-blue-600 text-white font-black shadow'
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <FileText className="w-4 h-4 shrink-0" />
              {sidebarOpen && <span>AI Proposals</span>}
            </button>

            <p className={`text-[10px] uppercase tracking-wider font-black px-2 pt-4 pb-1.5 ${
              sidebarOpen ? 'block' : 'hidden'
            } ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              System & Billing
            </p>

            <button
              onClick={() => setActiveTab('team')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'team'
                  ? 'bg-blue-600 text-white font-black shadow'
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Settings className="w-4 h-4 shrink-0" />
              {sidebarOpen && <span>Team Collaboration</span>}
            </button>

            <button
              onClick={() => setActiveTab('billing')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'billing'
                  ? 'bg-blue-600 text-white font-black shadow'
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <CreditCard className="w-4 h-4 shrink-0" />
              {sidebarOpen && <span>Billing & Quota</span>}
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-blue-600 text-white font-black shadow'
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Shield className="w-4 h-4 shrink-0" />
              {sidebarOpen && <span>Admin Panel</span>}
            </button>
          </nav>
        </div>

        {/* Profile Footer */}
        {sidebarOpen && (
          <div className={`p-4 border-t flex items-center gap-3 ${
            isDark ? 'border-slate-800' : 'border-slate-150'
          }`}>
            <span className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xs text-white">
              AV
            </span>
            <div className="min-w-0 flex-1">
              <p className={`text-xs font-bold truncate leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {consultant.name}
              </p>
              <p className="text-[10px] text-slate-400 truncate mt-0.5">
                {consultant.company}
              </p>
            </div>
          </div>
        )}
      </aside>

      {/* CORE WORKSPACE SHEET WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* UPPER NAVIGATION BAR HEADER */}
        <header className={`h-16 border-b shrink-0 px-6 flex items-center justify-between print:hidden ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center gap-3">
            <span className={`text-xs uppercase tracking-wide font-black px-2.5 py-1 bg-slate-100 dark:bg-slate-950 rounded-lg text-blue-500 border border-slate-200 dark:border-slate-900`}>
              B2B Outbound Engine Active
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-sans">
            {/* Dark Theme toggle */}
            <button
              onClick={handleToggleTheme}
              className={`p-2 border rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 transition-colors cursor-pointer ${
                isDark ? 'border-slate-800' : 'border-slate-250'
              }`}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* COMPONENT RENDER BLOCK */}
        <main className="flex-1 overflow-y-auto p-6 max-w-7xl w-full mx-auto print:p-0">
          {activeTab === 'dashboard' && (
            <SaaSDashboard 
              leads={leads} 
              campaigns={campaigns} 
              activities={activities}
              notifications={notifications}
              onMarkAllRead={handleMarkNotificationsRead}
              onNavigateToTab={setActiveTab}
              isDark={isDark}
            />
          )}

          {activeTab === 'lead-finder' && (
            <LeadFinderTab 
              onLeadsAdded={handleLeadsAdded} 
              onLeadSingleAdded={handleLeadSingleAdded}
              isDark={isDark}
            />
          )}

          {activeTab === 'website-analyzer' && (
            <WebsiteAnalyzerTab isDark={isDark} />
          )}

          {activeTab === 'research-agent' && (
            <ResearchAgentTab isDark={isDark} />
          )}

          {activeTab === 'contacts-verifier' && (
            <DecisionMakersTab isDark={isDark} />
          )}

          {activeTab === 'outreach-studio' && (
            <OutreachStudioTab 
              leads={leads} 
              consultant={consultant} 
              isDark={isDark}
            />
          )}

          {activeTab === 'sequences-manager' && (
            <CampaignManagerTab 
              campaigns={campaigns} 
              onAddCampaign={handleAddCampaign}
              onToggleStatus={handleToggleCampaignStatus}
              isDark={isDark}
            />
          )}

          {activeTab === 'pipeline-crm' && (
            <CRMKanbanTab 
              leads={leads}
              onUpdateLeadStage={handleUpdateLeadStage}
              onAddNote={handleAddCRMNote}
              onAddTask={handleAddCRMTask}
              onToggleTask={handleToggleCRMTask}
              isDark={isDark}
            />
          )}

          {activeTab === 'proposals' && (
            <ProposalGeneratorTab 
              leads={leads} 
              consultant={consultant} 
              proposals={proposals}
              onAddProposal={handleAddProposal}
              isDark={isDark}
            />
          )}

          {activeTab === 'team' && (
            <TeamCollaborationTab 
              members={members} 
              onInviteMember={handleInviteTeamSeat} 
              activities={activities}
              isDark={isDark}
            />
          )}

          {activeTab === 'billing' && (
            <BillingTab 
              currentPlanId={currentPlanId} 
              onUpgradePlan={handleUpgradePlan} 
              isDark={isDark}
            />
          )}

          {activeTab === 'admin' && (
            <AdminPanelTab isDark={isDark} />
          )}
        </main>
      </div>
    </div>
  );
}
