/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, Cpu, Search, CheckCircle2, RefreshCw, AlertCircle, Bookmark, Compass, Heart } from 'lucide-react';
import { BusinessResearch } from '../types';
import { safeApiRequest } from '../utils/api';

interface ResearchAgentTabProps {
  isDark: boolean;
}

export default function ResearchAgentTab({ isDark }: ResearchAgentTabProps) {
  const [url, setUrl] = useState('https://www.mercerlegalgrouptexas.com');
  const [industry, setIndustry] = useState('Law Firms');
  const [isLoading, setIsLoading] = useState(false);
  const [researchResult, setResearchResult] = useState<BusinessResearch | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleResearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResearchResult(null);

    try {
      const data = await safeApiRequest('/api/business-research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, industry })
      });
      setResearchResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Research connection issue. Try another business URL.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div>
        <h3 className={`text-sm font-bold flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          <Cpu className="w-4.5 h-4.5 text-blue-500" /> B2B AI Business Research Agent
        </h3>
        <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Deconstruct any target business. Sift service offerings, discover operational gaps, and construct personalized hooks.
        </p>
      </div>

      {/* Query Form */}
      <div className={`p-5 rounded-xl border shadow-sm ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <form onSubmit={handleResearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Website URL</label>
              <input
                type="url"
                required
                placeholder="https://www.mercerlegalgrouptexas.com"
                className={`w-full py-2 px-3 rounded-lg text-xs outline-none focus:ring-2 border ${
                  isDark
                    ? 'bg-slate-950 border-slate-800 focus:border-blue-500 focus:ring-blue-500/20 text-white'
                    : 'bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500/10 text-slate-800'
                }`}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Primary Industry Category</label>
              <input
                type="text"
                required
                placeholder="e.g. Law Firms"
                className={`w-full py-2 px-3 rounded-lg text-xs outline-none focus:ring-2 border ${
                  isDark
                    ? 'bg-slate-950 border-slate-800 focus:border-blue-500 focus:ring-blue-500/20 text-white'
                    : 'bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500/10 text-slate-800'
                }`}
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2 rounded-lg flex items-center gap-1.5 shadow transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              Launch Deep Crawler
            </button>
          </div>
        </form>
      </div>

      {/* Loading & Errors */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-xl text-xs text-red-600 dark:text-red-300">
          <p className="font-bold">Research Failure:</p>
          <p className="mt-1">{error}</p>
        </div>
      )}

      {isLoading && (
        <div className="p-16 text-center border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl space-y-3">
          <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
          <p className="text-slate-700 dark:text-slate-300 text-xs font-bold animate-pulse">Visiting Sitemap & Running Semantic Summarizers...</p>
          <p className="text-slate-400 text-[10px]">Analyzing value propositions, scanning About page copy, and drafting outreach strategy.</p>
        </div>
      )}

      {/* Output Profile */}
      {researchResult && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
          {/* Overview & Services */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview Card */}
            <div className={`p-5 rounded-xl border shadow-sm ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <span className="flex items-center gap-1 text-[10px] uppercase font-black text-blue-500 tracking-wider mb-2">
                <Bookmark className="w-3.5 h-3.5" /> Company Deep Overview
              </span>
              <p className={`text-xs font-sans leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {researchResult.overview}
              </p>
            </div>

            {/* Core Services catalog */}
            <div className={`p-5 rounded-xl border shadow-sm ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <span className="flex items-center gap-1 text-[10px] uppercase font-black text-purple-500 tracking-wider mb-3">
                <Compass className="w-3.5 h-3.5" /> Detected Service Lines
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {researchResult.services.map((srv, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-lg border ${
                      isDark ? 'bg-slate-950 border-slate-850 text-slate-300' : 'bg-slate-50 border-slate-150 text-slate-700'
                    }`}
                  >
                    🚀 {srv}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pain points and sales angle */}
          <div className="space-y-6">
            {/* Pain points */}
            <div className={`p-5 rounded-xl border shadow-sm ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <span className="flex items-center gap-1 text-[10px] uppercase font-black text-red-500 tracking-wider mb-3">
                <AlertCircle className="w-3.5 h-3.5" /> Core Digital Friction
              </span>
              <div className="space-y-2.5 text-xs text-slate-500 dark:text-slate-400 font-sans leading-relaxed">
                {researchResult.painPoints.map((pt, idx) => (
                  <p key={idx} className="flex gap-2">
                    <span className="text-red-500 shrink-0">•</span>
                    <span>{pt}</span>
                  </p>
                ))}
              </div>
            </div>

            {/* Strategic conversion angle */}
            <div className="p-5 rounded-xl border border-indigo-500/30 bg-gradient-to-b from-indigo-50/10 to-indigo-50/40 dark:from-indigo-950/20 dark:to-indigo-950/5 hover:border-indigo-500 transition-all shadow-sm">
              <span className="flex items-center gap-1 text-[10px] uppercase font-black text-indigo-500 tracking-wider mb-2">
                <Heart className="w-3.5 h-3.5 animate-pulse" /> Custom Sales Angle Proposal
              </span>
              <p className="text-xs text-indigo-900 dark:text-indigo-200 leading-relaxed font-semibold">
                {researchResult.salesAngle}
              </p>
              <div className="mt-4 flex items-center justify-end">
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1">
                  100% Client-Ready Outbound Hook <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
