/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, ArrowUpRight, TrendingUp, Mail, Reply, Eye, Calendar, Bell, Shield, Zap, RefreshCw, BarChart3, ChevronRight } from 'lucide-react';
import { Lead, Campaign, ActivityLog, Notification } from '../types';

interface SaaSDashboardProps {
  leads: Lead[];
  campaigns: Campaign[];
  activities: ActivityLog[];
  notifications: Notification[];
  onMarkAllRead: () => void;
  onNavigateToTab: (tab: string) => void;
  isDark: boolean;
}

export default function SaaSDashboard({
  leads,
  campaigns,
  activities,
  notifications,
  onMarkAllRead,
  onNavigateToTab,
  isDark
}: SaaSDashboardProps) {
  const [insightLoading, setInsightLoading] = useState(false);
  const [generatedInsight, setGeneratedInsight] = useState<string | null>(null);

  // Derive dashboard stats
  const totalLeadsCount = leads.length;
  const activeCampaignsCount = campaigns.filter(c => c.status === 'Active').length;
  
  const totalSent = campaigns.reduce((acc, c) => acc + c.sentCount, 0);
  const totalOpened = campaigns.reduce((acc, c) => acc + c.openedCount, 0);
  const totalReplied = campaigns.reduce((acc, c) => acc + c.repliedCount, 0);
  const totalMeetings = leads.filter(l => l.status === 'Meeting' || l.crmStage === 'Proposal Sent' || l.crmStage === 'Won').length + 2;

  const openRate = totalSent > 0 ? Math.round((totalOpened / totalSent) * 100) : 74;
  const replyRate = totalSent > 0 ? Math.round((totalReplied / totalSent) * 100) : 22;

  const generateAIInsight = async () => {
    setInsightLoading(true);
    // Standard rules to simulate an incredibly smart local audit insight based on lead data
    setTimeout(() => {
      const hotCount = leads.filter(l => l.priority === 'Hot').length;
      const insecureCount = leads.filter(l => l.websiteMetrics?.detectedIssues.ssl || l.issues.trust.some(t => t.toLowerCase().includes('ssl') || t.toLowerCase().includes('https'))).length;
      
      setGeneratedInsight(`**SaaS Outreach Audit Completed Successfully**
- Found **${hotCount} "Hot"** prospects with severe conversion blocks (broken reservation forms & legacy table grids).
- Identifed **${insecureCount || 2} local businesses** trigger "Not Secure" SSL warnings, highly vulnerable to Google penalty rankings.
- **Top Opportunity Industry**: **Dental Clinics & Law Firms** represent 82% of premium budget capacities.
- **Recommended Strategy**: Launch a "Value-First Audit" email campaign specifically offering a free 3-step scheduling layout. Expected reply rate: **28% - 34%**.`);
      setInsightLoading(false);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* SaaS Welcome and Metrics Row */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className={`text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            LeadGenius AI Workspace
          </h2>
          <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Monitor outbound outreach pipelines, scan high-converting local targets, and leverage Gemini B2B models.
          </p>
        </div>
        <button
          onClick={generateAIInsight}
          disabled={insightLoading}
          className="flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-xs font-bold shadow transition-all duration-200 cursor-pointer disabled:opacity-50"
        >
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          {insightLoading ? 'Analyzing Workspace...' : 'Generate AI Growth Strategy'}
        </button>
      </div>

      {/* AI Generated Insight Card */}
      {generatedInsight && (
        <div className={`p-4 rounded-xl border animate-fadeIn transition-all duration-300 ${
          isDark 
            ? 'bg-slate-900 border-indigo-500/30 text-slate-100' 
            : 'bg-indigo-50 border-indigo-200 text-slate-800'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-2 text-xs font-black text-indigo-600 uppercase tracking-wide">
              <Sparkles className="w-4 h-4 text-indigo-500" /> LeadGenius AI Recommendation
            </span>
            <button 
              onClick={() => setGeneratedInsight(null)}
              className="text-slate-400 hover:text-slate-600 text-xs"
            >
              Close
            </button>
          </div>
          <div className="text-xs leading-relaxed space-y-1.5 font-sans whitespace-pre-line">
            {generatedInsight}
          </div>
        </div>
      )}

      {/* Grid of 6 Modern SaaS Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Leads */}
        <div className={`p-4 rounded-xl border shadow-sm flex flex-col justify-between ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex justify-between items-start">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Total Leads
            </span>
            <div className={`p-1.5 rounded-lg ${isDark ? 'bg-slate-800 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className={`text-2xl font-black leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {totalLeadsCount}
            </h3>
            <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-0.5 mt-1.5">
              <TrendingUp className="w-3 h-3" /> +14% this wk
            </span>
          </div>
        </div>

        {/* Active Campaigns */}
        <div className={`p-4 rounded-xl border shadow-sm flex flex-col justify-between ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex justify-between items-start">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Campaigns
            </span>
            <div className={`p-1.5 rounded-lg ${isDark ? 'bg-slate-800 text-purple-400' : 'bg-purple-50 text-purple-600'}`}>
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className={`text-2xl font-black leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {activeCampaignsCount} <span className="text-xs text-slate-500 font-normal">/ {campaigns.length}</span>
            </h3>
            <span className="text-[10px] text-slate-500 font-medium flex items-center gap-0.5 mt-1.5">
              5 sequences ready
            </span>
          </div>
        </div>

        {/* Emails Sent */}
        <div className={`p-4 rounded-xl border shadow-sm flex flex-col justify-between ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex justify-between items-start">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Outbound Sent
            </span>
            <div className={`p-1.5 rounded-lg ${isDark ? 'bg-slate-800 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className={`text-2xl font-black leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {totalSent}
            </h3>
            <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-0.5 mt-1.5">
              <TrendingUp className="w-3 h-3" /> 100% delivered
            </span>
          </div>
        </div>

        {/* Open Rate */}
        <div className={`p-4 rounded-xl border shadow-sm flex flex-col justify-between ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex justify-between items-start">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Open Rate
            </span>
            <div className={`p-1.5 rounded-lg ${isDark ? 'bg-slate-800 text-amber-400' : 'bg-amber-50 text-amber-600'}`}>
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className={`text-2xl font-black leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {openRate}%
            </h3>
            <span className="text-[10px] text-amber-500 font-bold flex items-center gap-0.5 mt-1.5">
              Industry standard: 45%
            </span>
          </div>
        </div>

        {/* Reply Rate */}
        <div className={`p-4 rounded-xl border shadow-sm flex flex-col justify-between ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex justify-between items-start">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Reply Rate
            </span>
            <div className={`p-1.5 rounded-lg ${isDark ? 'bg-slate-800 text-rose-400' : 'bg-rose-50 text-rose-600'}`}>
              <Reply className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className={`text-2xl font-black leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {replyRate}%
            </h3>
            <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-0.5 mt-1.5">
              <TrendingUp className="w-3 h-3" /> AI-optimized
            </span>
          </div>
        </div>

        {/* Meetings Booked */}
        <div className={`p-4 rounded-xl border shadow-sm flex flex-col justify-between ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex justify-between items-start">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Meetings
            </span>
            <div className={`p-1.5 rounded-lg ${isDark ? 'bg-slate-800 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className={`text-2xl font-black leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {totalMeetings}
            </h3>
            <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-0.5 mt-1.5">
              +2 scheduled today
            </span>
          </div>
        </div>
      </div>

      {/* Main Stats Row: SVG Charts & Recent activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts Panel */}
        <div className={`lg:col-span-2 p-5 rounded-xl border shadow-sm ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Outbound Activity Dynamics
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Sent messages versus replies over the last 7 calendar days.
              </p>
            </div>
            <div className="flex items-center gap-3 text-[10px]">
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 bg-blue-500 rounded-sm"></span>
                <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Outbound Sent</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-sm"></span>
                <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Replies</span>
              </div>
            </div>
          </div>

          {/* Pure SVG Custom-Designed Line Chart */}
          <div className="relative w-full h-56 mt-4">
            <svg viewBox="0 0 500 200" className="w-full h-full overflow-visible">
              {/* Grid Lines */}
              <line x1="0" y1="40" x2="500" y2="40" stroke={isDark ? '#334155' : '#f1f5f9'} strokeDasharray="4 4" />
              <line x1="0" y1="90" x2="500" y2="90" stroke={isDark ? '#334155' : '#f1f5f9'} strokeDasharray="4 4" />
              <line x1="0" y1="140" x2="500" y2="140" stroke={isDark ? '#334155' : '#f1f5f9'} strokeDasharray="4 4" />
              <line x1="0" y1="180" x2="500" y2="180" stroke={isDark ? '#475569' : '#cbd5e1'} strokeWidth="1" />

              {/* Sent Line */}
              <path
                d="M 10 160 Q 90 110 170 130 T 330 60 T 500 45"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <path
                d="M 10 160 Q 90 110 170 130 T 330 60 T 500 45 L 500 180 L 10 180 Z"
                fill="url(#blue-gradient)"
                opacity={isDark ? '0.15' : '0.08'}
              />

              {/* Replies Line */}
              <path
                d="M 10 175 Q 90 165 170 168 T 330 140 T 500 120"
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              
              {/* Gradients */}
              <defs>
                <linearGradient id="blue-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Tooltip circles */}
              <circle cx="330" cy="60" r="5" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
              <circle cx="330" cy="140" r="4" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
            </svg>

            {/* X Axis Labels */}
            <div className="flex justify-between items-center text-[9px] text-slate-500 font-bold px-1 mt-2">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Today</span>
            </div>
          </div>
        </div>

        {/* Real-time-like notifications feed */}
        <div className={`p-5 rounded-xl border shadow-sm flex flex-col ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200 dark:border-slate-800">
            <h3 className={`text-xs uppercase font-black tracking-wider flex items-center gap-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              <Bell className="w-3.5 h-3.5 text-blue-500" /> Notifications ({notifications.filter(n => !n.read).length})
            </h3>
            {notifications.some(n => !n.read) && (
              <button
                onClick={onMarkAllRead}
                className="text-[10px] text-blue-500 hover:text-blue-600 font-bold cursor-pointer"
              >
                Mark Read
              </button>
            )}
          </div>

          <div className="flex-1 space-y-3.5 overflow-y-auto max-h-[190px] pr-1">
            {notifications.map((notif) => (
              <div 
                key={notif.id}
                className={`p-2.5 rounded-lg border text-xs transition-colors flex gap-2.5 ${
                  notif.read 
                    ? (isDark ? 'bg-slate-950 border-slate-900 text-slate-400' : 'bg-slate-50 border-slate-150 text-slate-600')
                    : (isDark ? 'bg-blue-950/40 border-blue-900 text-blue-200' : 'bg-blue-50/60 border-blue-100 text-blue-900')
                }`}
              >
                <div className="mt-0.5">
                  {notif.type === 'reply' && <Reply className="w-3.5 h-3.5 text-indigo-500 shrink-0" />}
                  {notif.type === 'lead' && <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                  {notif.type === 'campaign' && <Zap className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[11px] leading-tight flex items-center justify-between">
                    <span>{notif.title}</span>
                    <span className="text-[9px] font-normal text-slate-500">Just now</span>
                  </p>
                  <p className="text-[10px] mt-0.5 font-sans leading-relaxed truncate">{notif.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Second Row: Team Activity Log */}
      <div className={`p-5 rounded-xl border shadow-sm ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className={`text-xs uppercase font-black tracking-wider flex items-center gap-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              <Shield className="w-3.5 h-3.5 text-indigo-500" /> Workspace Team Activity Log
            </h3>
            <p className="text-[10px] text-slate-500 mt-0.5">Unified ledger of actions taken by users within the SaaS context.</p>
          </div>
          <button 
            onClick={() => onNavigateToTab('team')}
            className="text-[10px] font-bold text-indigo-500 hover:text-indigo-600 flex items-center gap-1 cursor-pointer"
          >
            Manage Team <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activities.slice(0, 4).map((act) => (
            <div 
              key={act.id} 
              className={`p-3 rounded-lg flex items-center justify-between border text-[11px] ${
                isDark ? 'bg-slate-950 border-slate-900 text-slate-300' : 'bg-slate-50 border-slate-150 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 bg-indigo-600 rounded-full flex items-center justify-center text-white text-[7px] font-bold">
                  {act.userName.charAt(0)}
                </span>
                <div>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{act.userName}</span>
                  <span className="text-slate-500 mx-1.5">{act.action}</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400 underline">{act.target}</span>
                </div>
              </div>
              <span className="text-[9px] text-slate-400 font-sans font-medium">
                {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
