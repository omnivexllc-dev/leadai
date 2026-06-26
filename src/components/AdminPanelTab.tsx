/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Shield, Server, Database, Key, Activity, Heart, RefreshCw, BarChart2 } from 'lucide-react';

interface AdminPanelTabProps {
  isDark: boolean;
}

export default function AdminPanelTab({ isDark }: AdminPanelTabProps) {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Title */}
      <div>
        <h3 className={`text-sm font-bold flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          <Shield className="w-4.5 h-4.5 text-blue-500" /> LeadGenius SaaS Global Admin Panel
        </h3>
        <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Configure core model bindings, audit credit parameters, monitor Node server cluster performance, and check security indexes.
        </p>
      </div>

      {/* Grid status overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* API Clusters status */}
        <div className={`p-4 rounded-xl border flex items-center gap-3.5 shadow-sm ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="p-2.5 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 rounded-lg">
            <Server className="w-4.5 h-4.5" />
          </div>
          <div className="min-w-0">
            <span className="text-[9px] uppercase font-bold text-slate-400 block">Server Status</span>
            <span className="font-bold text-xs text-emerald-500 block">Cluster: Healthy</span>
          </div>
        </div>

        {/* Database records */}
        <div className={`p-4 rounded-xl border flex items-center gap-3.5 shadow-sm ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="p-2.5 bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 rounded-lg">
            <Database className="w-4.5 h-4.5" />
          </div>
          <div className="min-w-0">
            <span className="text-[9px] uppercase font-bold text-slate-400 block">Database Records</span>
            <span className={`font-bold text-xs block ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>4,502 entries</span>
          </div>
        </div>

        {/* AI tokens used */}
        <div className={`p-4 rounded-xl border flex items-center gap-3.5 shadow-sm ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="p-2.5 bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400 rounded-lg">
            <Activity className="w-4.5 h-4.5" />
          </div>
          <div className="min-w-0">
            <span className="text-[9px] uppercase font-bold text-slate-400 block">AI Token Quota</span>
            <span className={`font-bold text-xs block ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>12.8M utilized</span>
          </div>
        </div>

        {/* API Gateways */}
        <div className={`p-4 rounded-xl border flex items-center gap-3.5 shadow-sm ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="p-2.5 bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 rounded-lg">
            <Key className="w-4.5 h-4.5" />
          </div>
          <div className="min-w-0">
            <span className="text-[9px] uppercase font-bold text-slate-400 block">Gateways Bound</span>
            <span className={`font-bold text-xs block ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Gemini, Resend, Stripe</span>
          </div>
        </div>
      </div>

      {/* Main system activity chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`lg:col-span-2 p-5 rounded-xl border shadow-sm ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <h4 className={`text-xs font-black uppercase tracking-wider mb-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Daily System Utilization Logs
          </h4>

          {/* Line chart */}
          <div className="h-44 relative">
            <svg viewBox="0 0 500 150" className="w-full h-full overflow-visible">
              <line x1="0" y1="30" x2="500" y2="30" stroke={isDark ? '#334155' : '#f1f5f9'} strokeDasharray="4 4" />
              <line x1="0" y1="80" x2="500" y2="80" stroke={isDark ? '#334155' : '#f1f5f9'} strokeDasharray="4 4" />
              <line x1="0" y1="130" x2="500" y2="130" stroke={isDark ? '#475569' : '#cbd5e1'} />

              {/* utilization line */}
              <path
                d="M 10 120 Q 90 40 170 90 T 330 30 T 500 10"
                fill="none"
                stroke="#6366f1"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <path
                d="M 10 120 Q 90 40 170 90 T 330 30 T 500 10 L 500 130 L 10 130 Z"
                fill="url(#indigo-grad)"
                opacity="0.1"
              />
              <defs>
                <linearGradient id="indigo-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
            <div className="flex justify-between items-center text-[9px] text-slate-500 font-bold mt-2 font-mono">
              <span>00:00</span>
              <span>06:00</span>
              <span>12:00</span>
              <span>18:00</span>
              <span>Active</span>
            </div>
          </div>
        </div>

        {/* Node server process monitors */}
        <div className={`p-5 rounded-xl border shadow-sm ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <h4 className={`text-xs font-black uppercase tracking-wider mb-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Cluster Health Audits
          </h4>

          <div className="space-y-4 text-xs font-sans">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Instance Memory usage:</span>
              <span className={`font-mono font-bold ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>124MB / 512MB</span>
            </div>
            <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-800 pt-3">
              <span className="text-slate-500">Avg response latency:</span>
              <span className={`font-mono font-bold ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>42ms</span>
            </div>
            <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-800 pt-3">
              <span className="text-slate-500">HTTP Success rate:</span>
              <span className="font-mono font-bold text-emerald-500">99.98%</span>
            </div>
            <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-800 pt-3">
              <span className="text-slate-500">Docker Sandbox Isolation:</span>
              <span className="font-bold text-blue-500 flex items-center gap-1">
                Active <Heart className="w-3.5 h-3.5 animate-pulse text-rose-500 fill-rose-500" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
