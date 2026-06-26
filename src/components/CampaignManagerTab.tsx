/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Send, Zap, Calendar, Play, Pause, Plus, Eye, BarChart2, PlusCircle, CheckCircle2 } from 'lucide-react';
import { Campaign } from '../types';

interface CampaignManagerTabProps {
  campaigns: Campaign[];
  onAddCampaign: (campaign: Campaign) => void;
  onToggleStatus: (id: string) => void;
  isDark: boolean;
}

export default function CampaignManagerTab({
  campaigns,
  onAddCampaign,
  onToggleStatus,
  isDark
}: CampaignManagerTabProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCampName, setNewCampName] = useState('');
  const [newCampSchedule, setNewCampSchedule] = useState('Mon-Fri, 9AM-5PM EST');
  const [toast, setToast] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampName) return;

    const newCamp: Campaign = {
      id: `camp-${Date.now()}`,
      name: newCampName,
      leadCount: 0,
      status: 'Draft',
      templateId: 'temp-custom',
      schedule: newCampSchedule,
      sentCount: 0,
      openedCount: 0,
      clickedCount: 0,
      repliedCount: 0,
      bouncedCount: 0,
      createdAt: new Date().toISOString()
    };

    onAddCampaign(newCamp);
    setNewCampName('');
    setShowAddForm(false);
    setToast(`Campaign "${newCampName}" has been successfully drafted in the workspace ledger!`);
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className={`text-sm font-bold flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <Zap className="w-4.5 h-4.5 text-blue-500" /> Cold Outreach Campaign Sequences
          </h3>
          <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Configure multi-stage email sequences, assign lead blocks, adjust delivery clocks, and view cold outreach KPIs.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-md flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4" /> Create Sequence
        </button>
      </div>

      {/* Add Campaign Form popup overlay */}
      {showAddForm && (
        <div className={`p-5 rounded-xl border animate-slideDown shadow-md ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <h4 className={`text-xs uppercase font-black tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Draft New Sequence Setup
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Sequence Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dentists Mobile Schedulers Sequence"
                  className={`w-full py-2 px-3 rounded-lg text-xs outline-none focus:ring-2 border ${
                    isDark
                      ? 'bg-slate-950 border-slate-800 focus:border-blue-500 focus:ring-blue-500/20 text-white'
                      : 'bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500/10 text-slate-800'
                  }`}
                  value={newCampName}
                  onChange={(e) => setNewCampName(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Schedule Delivery Clock</label>
                <input
                  type="text"
                  required
                  className={`w-full py-2 px-3 rounded-lg text-xs outline-none focus:ring-2 border ${
                    isDark
                      ? 'bg-slate-950 border-slate-800 focus:border-blue-500 focus:ring-blue-500/20 text-white'
                      : 'bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500/10 text-slate-800'
                  }`}
                  value={newCampSchedule}
                  onChange={(e) => setNewCampSchedule(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-1.5 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow cursor-pointer"
              >
                Add Sequence
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Campaigns list */}
      <div className="space-y-4">
        {campaigns.map((camp) => {
          const hasDeliveries = camp.sentCount > 0;
          const openRate = hasDeliveries ? Math.round((camp.openedCount / camp.sentCount) * 100) : 0;
          const replyRate = hasDeliveries ? Math.round((camp.repliedCount / camp.sentCount) * 100) : 0;

          return (
            <div
              key={camp.id}
              className={`p-5 rounded-xl border shadow-sm transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6 ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
              }`}
            >
              {/* Left Column: Info & Status */}
              <div className="space-y-2 lg:max-w-xs flex-1 min-w-0">
                <div className="flex items-center gap-2.5">
                  <span className={`px-2 py-0.5 text-[9px] font-black rounded uppercase ${
                    camp.status === 'Active'
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-900'
                      : camp.status === 'Paused'
                        ? 'bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-950/40 dark:border-amber-900'
                        : 'bg-slate-50 text-slate-500 border border-slate-200 dark:bg-slate-950/40 dark:border-slate-800'
                  }`}>
                    {camp.status}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> {camp.schedule}
                  </span>
                </div>
                <h4 className={`text-sm font-black truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {camp.name}
                </h4>
                <p className="text-[11px] text-slate-500">
                  {camp.leadCount} active prospects in queue
                </p>
              </div>

              {/* Center Column: Interactive Performance Gauges */}
              <div className="grid grid-cols-5 gap-3 flex-1 min-w-0 text-center">
                <div className="space-y-1">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Sent</span>
                  <span className={`text-xs font-black block ${isDark ? 'text-slate-100' : 'text-slate-850'}`}>{camp.sentCount}</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Opened</span>
                  <span className="text-xs font-black text-blue-600 block">{camp.openedCount}</span>
                  {hasDeliveries && <span className="text-[9px] font-bold text-slate-400">{openRate}%</span>}
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Clicked</span>
                  <span className="text-xs font-black text-purple-600 block">{camp.clickedCount}</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Replied</span>
                  <span className="text-xs font-black text-emerald-500 block">{camp.repliedCount}</span>
                  {hasDeliveries && <span className="text-[9px] font-bold text-slate-400">{replyRate}%</span>}
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Bounced</span>
                  <span className="text-xs font-black text-red-500 block">{camp.bouncedCount}</span>
                </div>
              </div>

              {/* Right Column: Controls toggle */}
              <div className="flex items-center gap-2 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100 dark:border-slate-800 justify-end">
                <button
                  onClick={() => onToggleStatus(camp.id)}
                  className={`p-2 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    camp.status === 'Active'
                      ? 'bg-amber-50 border-amber-200 text-amber-600 dark:bg-amber-950/40 dark:border-amber-900'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-950/40 dark:border-emerald-900'
                  }`}
                >
                  {camp.status === 'Active' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  {camp.status === 'Active' ? 'Pause' : 'Activate'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-800 flex items-center gap-2 animate-fadeIn text-xs font-bold">
          <Zap className="w-4 h-4 text-blue-400 shrink-0" />
          <span>{toast}</span>
          <button onClick={() => setToast(null)} className="ml-2 text-slate-400 hover:text-white cursor-pointer">✕</button>
        </div>
      )}
    </div>
  );
}
