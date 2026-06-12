/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Flame, Star, AlertTriangle, ExternalLink, Mail, Phone, Calendar, ArrowRight, Trash2, ShieldAlert, BadgeInfo } from 'lucide-react';
import { Lead, LeadStatus } from '../types';

interface LeadCardProps {
  lead: Lead;
  onSelect: (lead: Lead) => void;
  onStatusChange: (id: string, status: LeadStatus) => void;
  onDelete: (id: string) => void;
}

export default function LeadCard({ lead, onSelect, onStatusChange, onDelete }: LeadCardProps) {
  // Score color helper
  const getScoreColor = (score: number) => {
    if (score <= 4) return 'bg-rose-50 text-rose-700 border-rose-200';
    if (score <= 7) return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  };

  // Priority badge helper
  const getPriorityBadge = (priority: 'Hot' | 'Warm' | 'Cold') => {
    switch (priority) {
      case 'Hot':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200">
            <Flame className="w-3 h-3 fill-rose-600 text-rose-600 animate-pulse" /> HOT TARGET
          </span>
        );
      case 'Warm':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200">
            ⚡ WARM
          </span>
        );
      case 'Cold':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-205">
            ❄️ COLD
          </span>
        );
    }
  };

  // Render Status Badge classes
  const getStatusBadgeColor = (status: LeadStatus) => {
    switch (status) {
      case 'New': return 'bg-slate-100 text-slate-700 border border-slate-200';
      case 'Outreached': return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'Interested': return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'Meeting': return 'bg-indigo-50 text-indigo-700 border border-indigo-200';
      case 'Closed': return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
    }
  };

  return (
    <div className="bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 rounded-xl p-5 relative group transition-all duration-300 flex flex-col justify-between">
      {/* Top Section */}
      <div>
        <div className="flex justify-between items-start mb-3 gap-2">
          {getPriorityBadge(lead.priority)}
          <div className="flex items-center gap-2">
            {/* Inline interactive status */}
            <select
              value={lead.status}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => onStatusChange(lead.id, e.target.value as LeadStatus)}
              className={`text-[10px] font-bold py-1 px-2 rounded-lg border-transparent focus:ring-0 outline-none cursor-pointer tracking-wide ${getStatusBadgeColor(lead.status)}`}
            >
              <option value="New" className="bg-white text-slate-700 font-semibold">New</option>
              <option value="Outreached" className="bg-white text-blue-600 font-semibold">Outreached</option>
              <option value="Interested" className="bg-white text-amber-600 font-semibold">Interested</option>
              <option value="Meeting" className="bg-white text-indigo-600 font-semibold">Meeting</option>
              <option value="Closed" className="bg-white text-emerald-600 font-semibold">Closed Deal</option>
            </select>
          </div>
        </div>

        {/* Name and Sector */}
        <div className="mb-3">
          <h4 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">
            {lead.businessName}
          </h4>
          <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500">
            <span>{lead.industry}</span>
            <span className="text-slate-300">•</span>
            {/* Domain URL clickable */}
            <a
              href={lead.websiteUrl}
              target="_blank"
              rel="noopener referrer nofollow"
              onClick={(e) => e.stopPropagation()}
              className="text-slate-450 hover:text-blue-600 flex items-center gap-0.5 transition-colors underline truncate max-w-[140px]"
            >
              {lead.websiteUrl.replace(/https?:\/\/(www\.)?/, '')}
              <ExternalLink className="w-2.5 h-2.5 shrink-0" />
            </a>
          </div>
        </div>

        {/* Website Rating Score Gauge */}
        <div className="bg-slate-50 shadow-inner p-3 rounded-lg border border-slate-150 mb-4">
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="text-slate-500 font-medium">UX/SEO Quality Grade:</span>
            <span className={`px-1.5 py-0.5 rounded font-extrabold border text-[10px] leading-none ${getScoreColor(lead.websiteScore)}`}>
              {lead.websiteScore}/10
            </span>
          </div>
          {/* Progress bar representing quality score */}
          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                lead.websiteScore <= 4 ? 'bg-rose-500' : lead.websiteScore <= 7 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${lead.websiteScore * 10}%` }}
            />
          </div>
          
          {/* Critical Problem bullet point snapshot */}
          <p className="text-[10px] text-slate-505 line-clamp-2 mt-2 leading-relaxed">
            <span className="text-rose-600 font-bold text-[9px] uppercase tracking-wide inline-block mr-1">GAP:</span> 
            {lead.whyNewWebsite}
          </p>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-slate-100 pt-3 mt-1">
        {/* Contact info snippets */}
        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 mb-4">
          <div>
            <p className="text-slate-400 text-[9px] uppercase tracking-wider font-semibold">Contact Person</p>
            <p className="font-bold text-slate-700 truncate" title={lead.contactPerson}>
              {lead.contactPerson || 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-slate-400 text-[9px] uppercase tracking-wider font-semibold">Estimated Budget</p>
            <p className="font-extrabold text-blue-600 truncate text-[11.5px]">
              {lead.budgetPotential}
            </p>
          </div>
        </div>

        {/* Actions bar */}
        <div className="flex justify-between items-center gap-2">
          {/* Delete Icon */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(lead.id);
            }}
            title="Remove lead"
            className="p-2 text-slate-400 hover:text-rose-650 hover:bg-rose-50 rounded-lg transition-all border border-transparent hover:border-rose-100 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          {/* View Audit / Open Drawer Button */}
          <button
            type="button"
            onClick={() => onSelect(lead)}
            className="flex-1 py-1.5 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-1 group-hover:bg-blue-600 group-hover:hover:bg-blue-700 group-hover:text-white group-hover:border-transparent cursor-pointer"
          >
            Review & Outreach <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-all" />
          </button>
        </div>
      </div>
    </div>
  );
}
