/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sparkles, Building2, Download, Layers, Flame, RefreshCw, BarChart2, ShieldCheck, Mail } from 'lucide-react';
import { AnimatePresence } from 'motion/react';

// Custom components
import StatsCards from './components/StatsCards';
import ConsultantSettings from './components/ConsultantSettings';
import NewLeadScanner from './components/NewLeadScanner';
import LeadsFilters from './components/LeadsFilters';
import LeadCard from './components/LeadCard';
import LeadDrawer from './components/LeadDrawer';

// Static assets & structures
import { Lead, ConsultantProfile, LeadStatus, PriorityLevel } from './types';
import { DEMO_LEADS, INITIAL_CONSULTANT_PROFILE } from './data';

export default function App() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [consultant, setConsultant] = useState<ConsultantProfile>(INITIAL_CONSULTANT_PROFILE);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [orderBy, setOrderBy] = useState('newest');

  // Load from LocalStorage on mount
  useEffect(() => {
    try {
      const cachedLeads = localStorage.getItem('b2b_web_design_leads');
      const cachedProfile = localStorage.getItem('b2b_web_design_profile');

      if (cachedLeads) {
        setLeads(JSON.parse(cachedLeads));
      } else {
        // Fallback to load default curated demo leads on very first open
        setLeads(DEMO_LEADS);
        localStorage.setItem('b2b_web_design_leads', JSON.stringify(DEMO_LEADS));
      }

      if (cachedProfile) {
        setConsultant(JSON.parse(cachedProfile));
      } else {
        localStorage.setItem('b2b_web_design_profile', JSON.stringify(INITIAL_CONSULTANT_PROFILE));
      }
    } catch (e) {
      console.error('LocalStorage load failed, fallback to defaults:', e);
      setLeads(DEMO_LEADS);
    }
  }, []);

  // Save Leads to LocalStorage whenever they change
  const saveLeadsToDB = (updatedLeads: Lead[]) => {
    setLeads(updatedLeads);
    localStorage.setItem('b2b_web_design_leads', JSON.stringify(updatedLeads));
  };

  const handleSaveConsultant = (updatedProfile: ConsultantProfile) => {
    setConsultant(updatedProfile);
    localStorage.setItem('b2b_web_design_profile', JSON.stringify(updatedProfile));
  };

  // Add multiple leads (bulk finders)
  const handleLeadsAdded = (newLeads: Lead[]) => {
    // Avoid exact website URL duplicates
    const existingUrls = new Set(leads.map(l => l.websiteUrl.toLowerCase().trim()));
    const filteredNew = newLeads.filter(l => !existingUrls.has(l.websiteUrl.toLowerCase().trim()));
    
    const updated = [...filteredNew, ...leads];
    saveLeadsToDB(updated);
  };

  // Add single audited lead & open instantly in drawer
  const handleLeadSingleAdded = (newLead: Lead) => {
    // Replace if exact duplicate URL exists, or append
    const cleanedUrl = newLead.websiteUrl.toLowerCase().trim();
    const filtered = leads.filter(l => l.websiteUrl.toLowerCase().trim() !== cleanedUrl);
    const updated = [newLead, ...filtered];
    
    saveLeadsToDB(updated);
    setSelectedLead(newLead); // Trigger micro-interaction opening the drawer instantly!
  };

  // In-line status change dropdown hook
  const handleStatusChange = (id: string, newStatus: LeadStatus) => {
    const updated = leads.map(l => l.id === id ? { ...l, status: newStatus } : l);
    saveLeadsToDB(updated);
    // Sync current drawer if open
    if (selectedLead && selectedLead.id === id) {
      setSelectedLead({ ...selectedLead, status: newStatus });
    }
  };

  // Single Lead Changes coming back from the edit drawers
  const handleSaveLeadChanges = (updatedLead: Lead) => {
    const updated = leads.map(l => l.id === updatedLead.id ? updatedLead : l);
    saveLeadsToDB(updated);
    setSelectedLead(updatedLead);
  };

  // Delete lead from cache
  const handleDeleteLead = (id: string) => {
    if (window.confirm('Are you sure you want to remove this prospect from your pipeline?')) {
      const updated = leads.filter(l => l.id !== id);
      saveLeadsToDB(updated);
      if (selectedLead && selectedLead.id === id) {
        setSelectedLead(null);
      }
    }
  };

  // Global actions
  const handleClearAll = () => {
    if (window.confirm('WARNING: You are about to wipe your entire lead generation pipeline records. This cannot be undone. Proceed?')) {
      saveLeadsToDB([]);
      setSelectedLead(null);
    }
  };

  const handleLoadDemo = () => {
    if (window.confirm('Do you want to restore the default high-quality B2B demo targets into your workspace?')) {
      saveLeadsToDB(DEMO_LEADS);
      setSelectedLead(null);
    }
  };

  const handleExportCSV = () => {
    if (leads.length === 0) {
      alert('Your pipeline database is currently empty. Find some leads first!');
      return;
    }

    try {
      const headers = [
        'Business Name',
        'Industry',
        'Website URL',
        'Contact Person',
        'Title',
        'Email Address',
        'Phone Number',
        'Company Size',
        'Website Quality Grade',
        'Priority',
        'Current Stage Status',
        'Target Budget Potential',
        'Identified Challenges Snapshot'
      ];

      const csvRows = [headers.join(',')];

      for (const l of leads) {
        const issuesSummary = Object.entries(l.issues)
          .map(([k, v]) => `${k.toUpperCase()}: ${(v as string[]).join(' | ')}`)
          .join('; ');

        const row = [
          `"${l.businessName.replace(/"/g, '""')}"`,
          `"${l.industry.replace(/"/g, '""')}"`,
          `"${l.websiteUrl}"`,
          `"${l.contactPerson ? l.contactPerson.replace(/"/g, '""') : 'N/A'}"`,
          `"${l.contactTitle ? l.contactTitle.replace(/"/g, '""') : 'N/A'}"`,
          `"${l.email}"`,
          `"${l.phone}"`,
          `"${l.companySize}"`,
          l.websiteScore,
          `"${l.priority}"`,
          `"${l.status}"`,
          `"${l.budgetPotential}"`,
          `"${issuesSummary.replace(/"/g, '""')}"`
        ];
        csvRows.push(row.join(','));
      }

      const csvString = csvRows.join('\n');
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'b2b_web_design_prospects_pipeline.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
      alert('Failed to generate local CSV file.');
    }
  };

  // Filter & Sort Logic
  const getFilteredLeads = () => {
    let filtered = [...leads];

    // Search Query (ByName, Industry, website, Contact and city)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(l => 
        l.businessName.toLowerCase().includes(query) ||
        l.industry.toLowerCase().includes(query) ||
        l.websiteUrl.toLowerCase().includes(query) ||
        (l.contactPerson && l.contactPerson.toLowerCase().includes(query)) ||
        l.whyNewWebsite.toLowerCase().includes(query)
      );
    }

    // Priority level filter
    if (selectedPriority !== 'All') {
      filtered = filtered.filter(l => l.priority === selectedPriority);
    }

    // Pipeline status filter
    if (selectedStatus !== 'All') {
      filtered = filtered.filter(l => l.status === selectedStatus);
    }

    // Ordering/Sorting
    filtered.sort((a, b) => {
      if (orderBy === 'newest') {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA; // descending
      }
      if (orderBy === 'worst-score') {
        return a.websiteScore - b.websiteScore; // ascending (lower score is better redesign lead)
      }
      if (orderBy === 'best-budget') {
        const getBudgetScore = (budgetStr: string) => {
          const numbers = budgetStr.replace(/[^0-9]/g, '');
          return parseInt(numbers) || 0;
        };
        return getBudgetScore(b.budgetPotential) - getBudgetScore(a.budgetPotential); // descending
      }
      if (orderBy === 'priority') {
        const priorityVals = { Hot: 3, Warm: 2, Cold: 1 };
        return priorityVals[b.priority] - priorityVals[a.priority];
      }
      return 0;
    });

    return filtered;
  };

  const filteredLeads = getFilteredLeads();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans transition-all duration-300 antialiased selection:bg-blue-600/20">
      {/* Upper bar workspace status */}
      <nav className="h-16 bg-slate-900 text-white flex items-center justify-between px-6 shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-lg text-white">S</div>
          <h1 className="text-lg font-bold tracking-tight">SiteScout AI</h1>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="hidden sm:flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
            <span className="text-slate-400 text-[10px] uppercase font-bold">Dynamic Engine:</span>
            <span className="text-xs font-semibold text-blue-400">Gemini 3.5 Active</span>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-slate-400 leading-none">Pipeline Load</p>
            <p className="text-xs font-semibold text-slate-200 mt-1">{leads.length} Sites Stored</p>
          </div>
        </div>
      </nav>

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-6 space-y-6">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Building2 className="w-7 h-7 text-blue-600 shrink-0" /> Web Design Client Finder
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-xl leading-relaxed">
              Identify high-potential local businesses needing modern responsive design, speed enhancements, and SEO strategy. Evaluate website gaps and write pristine, personalized B2B outreach templates with server-side Gemini 3.5 Flash.
            </p>
          </div>
          <div className="bg-white border border-slate-200 shadow-sm px-4 py-2 rounded-xl flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-100">
              <BarChart2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold">Active Pipeline Stage</p>
              <p className="text-xs text-slate-800 font-bold mt-0.5">
                {leads.filter(l => l.status === 'Interested' || l.status === 'Meeting').length} Opportunities
              </p>
            </div>
          </div>
        </div>

        {/* Section 1: Dashboard Stats cards */}
        <StatsCards leads={leads} />

        {/* Section 2: Consultant Profile settings */}
        <ConsultantSettings profile={consultant} onSave={handleSaveConsultant} />

        {/* Section 3: New Lead Scanning module (Bulk finder / Single auditor) */}
        <NewLeadScanner 
          onLeadsAdded={handleLeadsAdded} 
          onLeadSingleAdded={handleLeadSingleAdded} 
        />

        {/* Section 4: Filters and Leads List */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Layers className="w-4.5 h-4.5 text-blue-600" /> Lead Pipeline Matrix ({filteredLeads.length})
            </h3>
            <p className="text-[11px] text-slate-500">
              Ranked automatically from highest to lowest redesign potential
            </p>
          </div>

          <LeadsFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedPriority={selectedPriority}
            setSelectedPriority={setSelectedPriority}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            orderBy={orderBy}
            setOrderBy={setOrderBy}
            onClearAll={handleClearAll}
            onLoadDemo={handleLoadDemo}
            onExportCSV={handleExportCSV}
            totalCount={leads.length}
          />

          {filteredLeads.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredLeads.map(lead => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  onSelect={setSelectedLead}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDeleteLead}
                />
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-slate-200 rounded-xl p-12 text-center bg-white shadow-sm">
              <Sparkles className="w-8 h-8 text-slate-400 mx-auto mb-3 stroke-1.5" />
              <p className="text-slate-700 text-xs font-semibold">No high-potential leads found matching details.</p>
              <p className="text-slate-500 text-[11px] mt-1">Try expanding filters, clearing search variables, or searching a new sector!</p>
            </div>
          )}
        </div>
      </main>

      {/* Floating Detailed Audit & Outreach slide-out Drawer */}
      <AnimatePresence>
        {selectedLead && (
          <LeadDrawer
            lead={selectedLead}
            onClose={() => setSelectedLead(null)}
            onSaveLeadChanges={handleSaveLeadChanges}
            consultant={consultant}
          />
        )}
      </AnimatePresence>

      {/* Footer copyright */}
      <footer className="bg-white border-t border-slate-150 py-6 text-center mt-12 text-[11px] text-slate-500">
        <p>© 2026 SiteScout AI • Professional B2B Web Design Lead Generation & CRM Workspace. Stored locally in sandbox browser.</p>
      </footer>
    </div>
  );
}
