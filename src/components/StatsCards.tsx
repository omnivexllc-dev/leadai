/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Building2, Flame, Gauge, Coins, ArrowUpRight } from 'lucide-react';
import { Lead } from '../types';

interface StatsCardsProps {
  leads: Lead[];
}

export default function StatsCards({ leads }: StatsCardsProps) {
  // Compute Stats
  const totalLeads = leads.length;
  
  const averageScore = totalLeads > 0 
    ? Math.round((leads.reduce((sum, l) => sum + l.websiteScore, 0) / totalLeads) * 10) / 10
    : 0;

  const hotLeads = leads.filter(l => l.priority === 'Hot').length;

  // Calculate estimated total target pipeline value
  const totalValue = leads.reduce((sum, l) => {
    // Extract first number or a high average from potential e.g. "$3,500 - $6,000"
    const numbers = l.budgetPotential.replace(/[^0-9]/g, '');
    let itemValue = 4000; // default benchmark
    if (numbers.length >= 8) {
      const min = parseInt(numbers.substring(0, numbers.length / 2)) || 3500;
      const max = parseInt(numbers.substring(numbers.length / 2)) || 6000;
      itemValue = Math.round((min + max) / 2);
    } else if (numbers.length > 0) {
      itemValue = parseInt(numbers) || 4000;
    }
    return sum + itemValue;
  }, 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Stat 1 */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 relative overflow-hidden group hover:border-blue-500/50 transition-all duration-300">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Prospects</p>
            <h3 className="text-3xl font-black font-sans text-slate-900 mt-1 group-hover:text-blue-600 transition-colors">
              {totalLeads}
            </h3>
          </div>
          <div className="bg-blue-50 text-blue-600 p-2.5 rounded-lg border border-blue-100">
            <Building2 className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-xs text-slate-500">
          <span className="text-blue-600 flex items-center mr-1 font-semibold">
            Active Leads <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
          </span>
          persisted in CRM
        </div>
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-blue-50/30 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
      </div>

      {/* Stat 2 */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 relative overflow-hidden group hover:border-amber-500/50 transition-all duration-300">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Avg Quality Score</p>
            <h3 className="text-3xl font-black font-sans text-slate-900 mt-1 group-hover:text-amber-600 transition-colors">
              {averageScore}/10
            </h3>
          </div>
          <div className="bg-amber-50 text-amber-700 p-2.5 rounded-lg border border-amber-100">
            <Gauge className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-xs text-slate-500">
          <span className={`${averageScore <= 5 ? 'text-rose-600' : 'text-emerald-600'} font-semibold mr-1`}>
            {averageScore <= 5 ? 'Overhaul Target' : 'Underperforming'}
          </span>
          average index
        </div>
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-amber-50/30 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
      </div>

      {/* Stat 3 */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 relative overflow-hidden group hover:border-rose-500/50 transition-all duration-300">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Hot Targets</p>
            <h3 className="text-3xl font-black font-sans text-slate-900 mt-1 group-hover:text-rose-600 transition-colors">
              {hotLeads}
            </h3>
          </div>
          <div className="bg-rose-50 text-rose-700 p-2.5 rounded-lg border border-rose-100">
            <Flame className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-xs text-slate-500">
          <span className="text-rose-600 font-semibold mr-1">
            {totalLeads > 0 ? Math.round((hotLeads / totalLeads) * 100) : 0}% Hot Priority
          </span>
          with critical flaws
        </div>
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-rose-50/30 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
      </div>

      {/* Stat 4 */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 relative overflow-hidden group hover:border-emerald-500/50 transition-all duration-300">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Projected Pipeline</p>
            <h3 className="text-3xl font-black font-sans text-slate-900 mt-1 group-hover:text-emerald-600 transition-colors font-mono">
              ${totalValue.toLocaleString()}
            </h3>
          </div>
          <div className="bg-emerald-50 text-emerald-700 p-2.5 rounded-lg border border-emerald-100">
            <Coins className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-xs text-slate-500">
          <span className="text-emerald-600 font-semibold mr-1">
            Est. B2B Portfolio
          </span>
          potential revenue
        </div>
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-emerald-50/30 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
      </div>
    </div>
  );
}
