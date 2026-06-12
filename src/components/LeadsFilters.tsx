/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Search, Flame, LayoutGrid, List, SlidersHorizontal, Trash2, Download, RefreshCw } from 'lucide-react';
import { PriorityLevel, LeadStatus } from '../types';

interface LeadsFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedPriority: string;
  setSelectedPriority: (priority: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  orderBy: string;
  setOrderBy: (order: string) => void;
  onClearAll: () => void;
  onLoadDemo: () => void;
  onExportCSV: () => void;
  totalCount: number;
}

export default function LeadsFilters({
  searchQuery,
  setSearchQuery,
  selectedPriority,
  setSelectedPriority,
  selectedStatus,
  setSelectedStatus,
  orderBy,
  setOrderBy,
  onClearAll,
  onLoadDemo,
  onExportCSV,
  totalCount,
}: LeadsFiltersProps) {
  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-4 mb-6">
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
        {/* Search Input */}
        <div className="relative w-full lg:max-w-xs">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search leads, sectors, or cities..."
            className="w-full bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 outline-none shadow-inner"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filters Select boxes */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Priority */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Priority:</span>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="bg-transparent border-none outline-none text-xs text-slate-700 font-semibold cursor-pointer"
            >
              <option value="All" className="bg-white text-slate-700">All</option>
              <option value="Hot" className="bg-white text-red-600 font-bold">🔥 Hot</option>
              <option value="Warm" className="bg-white text-amber-600 font-bold">⚡ Warm</option>
              <option value="Cold" className="bg-white text-blue-600 font-bold">❄️ Cold</option>
            </select>
          </div>

          {/* Status */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-transparent border-none outline-none text-xs text-slate-700 font-semibold cursor-pointer"
            >
              <option value="All" className="bg-white text-slate-700">All</option>
              <option value="New" className="bg-white text-slate-700">New</option>
              <option value="Outreached" className="bg-white text-slate-700">Outreached</option>
              <option value="Interested" className="bg-white text-slate-700 font-bold">Interested</option>
              <option value="Meeting" className="bg-white text-blue-600 font-bold">Meeting Scheduled</option>
              <option value="Closed" className="bg-white text-emerald-600 font-bold">Closed Deal</option>
            </select>
          </div>

          {/* Order By */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Sort By:</span>
            <select
              value={orderBy}
              onChange={(e) => setOrderBy(e.target.value)}
              className="bg-transparent border-none outline-none text-xs text-slate-700 font-semibold cursor-pointer"
            >
              <option value="newest" className="bg-white text-slate-700">Newest Created</option>
              <option value="worst-score" className="bg-white text-slate-700">Worst Website Score (High Potential)</option>
              <option value="best-budget" className="bg-white text-slate-700">Highest Budget Potential</option>
              <option value="priority" className="bg-white text-slate-700">Priority Level</option>
            </select>
          </div>
        </div>

        {/* Global Operations Tray */}
        <div className="flex items-center gap-2 w-full lg:w-auto justify-end border-t border-slate-100 pt-3 lg:border-none lg:pt-0">
          <button
            type="button"
            onClick={onExportCSV}
            title="Export pipeline to CSV"
            className="flex items-center gap-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Export Leads
          </button>

          <button
            type="button"
            onClick={onLoadDemo}
            title="Re-populate with rich pre-loaded B2B examples"
            className="flex items-center gap-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Demo Datasets
          </button>

          <button
            type="button"
            onClick={onClearAll}
            title="Clear all leads stored locally"
            className="flex items-center gap-1.5 border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg px-2.5 py-1.5 text-xs font-bold transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear Pipeline
          </button>
        </div>
      </div>
    </div>
  );
}
