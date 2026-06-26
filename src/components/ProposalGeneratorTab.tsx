/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FileText, Sparkles, Printer, RefreshCw, Bookmark, AlertCircle, Calendar, ShieldCheck, DollarSign, BookOpen } from 'lucide-react';
import { Lead, Proposal, ConsultantProfile } from '../types';

interface ProposalGeneratorTabProps {
  leads: Lead[];
  consultant: ConsultantProfile;
  proposals: Proposal[];
  onAddProposal: (proposal: Proposal) => void;
  isDark: boolean;
}

export default function ProposalGeneratorTab({
  leads,
  consultant,
  proposals,
  onAddProposal,
  isDark
}: ProposalGeneratorTabProps) {
  const [selectedLeadId, setSelectedLeadId] = useState(leads[0]?.id || '');
  const [coverStyle, setCoverStyle] = useState<'Classic' | 'Modern' | 'Minimalist'>('Modern');
  const [isLoading, setIsLoading] = useState(false);
  const [activeProposal, setActiveProposal] = useState<Proposal | null>(proposals[0] || null);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const handleGenerateProposal = async () => {
    const lead = leads.find(l => l.id === selectedLeadId);
    if (!lead) {
      setError('Please select a valid lead first.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead, coverStyle })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to generate proposal.');
      }

      const data = await response.json();
      const newProp: Proposal = {
        ...data,
        id: `prop-${Date.now()}`,
        createdAt: new Date().toISOString()
      };

      onAddProposal(newProp);
      setActiveProposal(newProp);
      setToast(`AI Proposal for ${lead.businessName} generated and stored in active documents ledger!`);
      setTimeout(() => setToast(null), 4000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error drafting contract proposals.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h3 className={`text-sm font-bold flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          <FileText className="w-4.5 h-4.5 text-blue-500" /> B2B AI Proposal Suite
        </h3>
        <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Instantly compile conversion-focused corporate proposals. Customize prices, print as pristine paper documents, or save directly as PDF.
        </p>
      </div>

      {/* Selector and Generator Form */}
      <div className={`p-5 rounded-xl border shadow-sm ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      } print:hidden`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Target Lead</label>
            <select
              value={selectedLeadId}
              onChange={(e) => setSelectedLeadId(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-xs text-slate-700 dark:text-slate-200 outline-none"
            >
              <option value="">-- Choose a lead --</option>
              {leads.map(l => (
                <option key={l.id} value={l.id}>{l.businessName}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Cover Page Theme</label>
            <select
              value={coverStyle}
              onChange={(e) => setCoverStyle(e.target.value as any)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-xs text-slate-700 dark:text-slate-200 outline-none"
            >
              <option value="Modern">Modern Executive</option>
              <option value="Classic">Classic Corporate</option>
              <option value="Minimalist">Minimalist Clean</option>
            </select>
          </div>

          <button
            onClick={handleGenerateProposal}
            disabled={isLoading || !selectedLeadId}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-xs px-5 py-2.5 rounded-lg flex items-center justify-center gap-1.5 shadow transition-all cursor-pointer"
          >
            {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 animate-pulse" />}
            Generate Web Redesign Proposal
          </button>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 rounded-xl text-xs text-red-600 dark:text-red-300 print:hidden">
          {error}
        </div>
      )}

      {isLoading && (
        <div className="p-16 text-center border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl space-y-3 print:hidden">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
          <p className="text-slate-700 dark:text-slate-300 text-xs font-bold animate-pulse">Running Proposal Architects & Calculating Costs...</p>
          <p className="text-slate-400 text-[10px]">Laying out cover pages, formatting problem bullet points, and designing timelines.</p>
        </div>
      )}

      {/* Document View and Print Section */}
      {activeProposal && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Saved Proposals list - Left Sidebar */}
          <div className="space-y-2.5 lg:col-span-1 print:hidden">
            <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Proposal Library</p>
            {proposals.map(p => (
              <button
                key={p.id}
                onClick={() => setActiveProposal(p)}
                className={`w-full flex items-center gap-2 p-3 rounded-xl border text-xs text-left transition-all cursor-pointer ${
                  activeProposal.id === p.id
                    ? 'bg-blue-600 border-blue-600 text-white font-bold shadow'
                    : isDark
                      ? 'bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-300'
                      : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <BookOpen className="w-4 h-4 shrink-0" />
                <span className="truncate">{p.leadName} Redesign</span>
              </button>
            ))}
          </div>

          {/* Core Proposal Paper Document sheet */}
          <div className="lg:col-span-3 space-y-4">
            {/* Action Bar */}
            <div className="flex justify-end print:hidden">
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-slate-850 hover:bg-slate-950 dark:bg-slate-800 dark:hover:bg-slate-750 text-white font-bold text-xs rounded-lg shadow-md flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" /> Print / Export PDF
              </button>
            </div>

            {/* Document sheet */}
            <div id="proposal-paper" className="bg-white text-slate-900 border border-slate-300 rounded-xl p-8 sm:p-12 shadow-md space-y-8 font-serif leading-relaxed text-sm print:border-none print:p-0 print:shadow-none print:text-black">
              {/* Cover Layout style */}
              <div className={`p-8 rounded-xl border flex flex-col justify-between h-[280px] text-white ${
                activeProposal.coverStyle === 'Modern'
                  ? 'bg-gradient-to-br from-slate-900 to-indigo-950 border-slate-900'
                  : activeProposal.coverStyle === 'Classic'
                    ? 'bg-gradient-to-br from-blue-900 to-slate-900 border-blue-900'
                    : 'bg-white border-slate-300 text-slate-900'
              }`}>
                <div>
                  <span className={`text-[10px] uppercase font-black tracking-widest block mb-1.5 ${
                    activeProposal.coverStyle === 'Minimalist' ? 'text-blue-600' : 'text-blue-300'
                  }`}>
                    Business Growth Strategy Proposal
                  </span>
                  <h1 className={`text-xl sm:text-2xl font-serif font-bold leading-snug tracking-tight ${
                    activeProposal.coverStyle === 'Minimalist' ? 'text-slate-900' : 'text-white'
                  }`}>
                    {activeProposal.title}
                  </h1>
                </div>

                <div className="flex justify-between items-end border-t border-white/20 dark:border-slate-200/20 pt-4 text-xs font-sans">
                  <div>
                    <p className="opacity-70">Prepared for:</p>
                    <p className="font-bold">{activeProposal.leadName}</p>
                  </div>
                  <div className="text-right">
                    <p className="opacity-70">Prepared by:</p>
                    <p className="font-bold">{consultant.company}</p>
                  </div>
                </div>
              </div>

              {/* Section 1: Problems identified */}
              <div className="space-y-3 pt-4">
                <h3 className="text-xs uppercase font-sans font-black tracking-widest text-slate-500 flex items-center gap-1.5 pb-1 border-b border-slate-200">
                  <AlertCircle className="w-4.5 h-4.5 text-red-500" /> Executive Problem Assessment
                </h3>
                <p className="text-xs text-slate-500 font-sans leading-relaxed">
                  Based on our deep design and security scans of the prospective patient/client acquisition flows, we identified several critical friction barriers currently driving mobile traffic drops:
                </p>
                <ul className="space-y-2 list-none pl-1">
                  {activeProposal.problemsFound.map((p, idx) => (
                    <li key={idx} className="flex gap-2 text-xs">
                      <span className="text-red-500 font-bold font-sans">✕</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Section 2: Recommendations solutions */}
              <div className="space-y-3">
                <h3 className="text-xs uppercase font-sans font-black tracking-widest text-slate-500 flex items-center gap-1.5 pb-1 border-b border-slate-200">
                  <ShieldCheck className="w-4.5 h-4.5 text-emerald-500" /> Strategic Solutions Matrix
                </h3>
                <ul className="space-y-2 list-none pl-1">
                  {activeProposal.recommendations.map((r, idx) => (
                    <li key={idx} className="flex gap-2 text-xs">
                      <span className="text-emerald-500 font-bold font-sans">✓</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Section 3: Pricing schedule */}
              <div className="space-y-4">
                <h3 className="text-xs uppercase font-sans font-black tracking-widest text-slate-500 flex items-center gap-1.5 pb-1 border-b border-slate-200">
                  <DollarSign className="w-4.5 h-4.5 text-blue-500" /> Commercial Structure & Pricing
                </h3>
                <div className="border border-slate-200 rounded-lg overflow-hidden text-xs font-sans">
                  <div className="grid grid-cols-4 bg-slate-50 p-2.5 font-bold border-b border-slate-200">
                    <span className="col-span-3">Growth Solution Item</span>
                    <span className="text-right">Price (USD)</span>
                  </div>
                  {activeProposal.pricing.map((p, idx) => (
                    <div key={idx} className="grid grid-cols-4 p-2.5 border-b border-slate-100 last:border-b-0">
                      <span className="col-span-3 text-slate-700">{p.item}</span>
                      <span className="text-right font-bold text-slate-900">${p.price.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="grid grid-cols-4 bg-slate-100 p-2.5 font-black text-slate-900">
                    <span className="col-span-3 uppercase">Total Project Value</span>
                    <span className="text-right">
                      ${activeProposal.pricing.reduce((acc, p) => acc + p.price, 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Section 4: Timeline and Call to Action */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 font-sans text-xs">
                <div className="space-y-1.5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <p className="font-bold uppercase text-[9px] text-slate-400">Target Delivery Schedule</p>
                  <p className="font-semibold text-slate-800">{activeProposal.timeline}</p>
                </div>
                <div className="space-y-1.5 p-3.5 bg-blue-50/50 border border-blue-100 rounded-xl">
                  <p className="font-bold uppercase text-[9px] text-blue-500">Securing Delivery</p>
                  <p className="text-slate-700 leading-normal">{activeProposal.callToAction}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-800 flex items-center gap-2 animate-fadeIn text-xs font-bold">
          <FileText className="w-4 h-4 text-blue-400 shrink-0" />
          <span>{toast}</span>
          <button onClick={() => setToast(null)} className="ml-2 text-slate-400 hover:text-white cursor-pointer">✕</button>
        </div>
      )}
    </div>
  );
}
