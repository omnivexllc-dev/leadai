/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, Globe, Shield, RefreshCw, Smartphone, Search, AlertCircle, CheckCircle2, FileText, ChevronRight } from 'lucide-react';
import { WebsiteMetrics } from '../types';

interface WebsiteAnalyzerTabProps {
  isDark: boolean;
}

export default function WebsiteAnalyzerTab({ isDark }: WebsiteAnalyzerTabProps) {
  const [url, setUrl] = useState('https://www.horizondentalcaremiami.com');
  const [isLoading, setIsLoading] = useState(false);
  const [metrics, setMetrics] = useState<WebsiteMetrics | null>(null);
  const [issuesList, setIssuesList] = useState<{ category: string; issue: string; severity: 'High' | 'Medium' | 'Low' }[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMetrics(null);
    setIssuesList([]);

    try {
      const response = await fetch('/api/audit-website', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to complete website audit scan.');
      }

      const data = await response.json();
      
      // Construct rich metrics based on response
      const hasSslError = data.issues?.trust?.some((t: string) => t.toLowerCase().includes('ssl') || t.toLowerCase().includes('insecure')) || false;
      const hasSpeedError = data.issues?.speed?.length > 0 || false;
      const hasMobileError = data.issues?.mobile?.length > 0 || false;

      const designLen = data.issues?.design?.length ?? 3;
      const seoLen = data.issues?.seo?.length ?? 2;
      const calculatedOverall = Math.max(20, Math.round(100 - (designLen * 10) - (seoLen * 10)));

      const auditMetrics: WebsiteMetrics = {
        overall: calculatedOverall,
        mobile: hasMobileError ? 30 : 85,
        seo: data.issues?.seo?.length > 1 ? 45 : 80,
        performance: hasSpeedError ? 35 : 90,
        security: hasSslError ? 15 : 95,
        design: Math.max(20, calculatedOverall - 10),
        detectedIssues: {
          ssl: hasSslError,
          slowSpeed: hasSpeedError,
          poorMobile: hasMobileError,
          outdatedDesign: data.issues?.design?.length > 0,
          missingSeo: data.issues?.seo?.length > 0,
          missingForms: data.issues?.conversion?.length > 0
        }
      };

      // Assemble issues with categories & severity
      const assembled: { category: string; issue: string; severity: 'High' | 'Medium' | 'Low' }[] = [];
      if (data.issues?.design) {
        data.issues.design.forEach((i: string) => assembled.push({ category: 'Visual & Layout', issue: i, severity: 'High' }));
      }
      if (data.issues?.mobile) {
        data.issues.mobile.forEach((i: string) => assembled.push({ category: 'Mobile Adaptability', issue: i, severity: 'High' }));
      }
      if (data.issues?.seo) {
        data.issues.seo.forEach((i: string) => assembled.push({ category: 'SEO Search Rankings', issue: i, severity: 'Medium' }));
      }
      if (data.issues?.speed) {
        data.issues.speed.forEach((i: string) => assembled.push({ category: 'Page Performance', issue: i, severity: 'High' }));
      }
      if (data.issues?.trust) {
        data.issues.trust.forEach((i: string) => assembled.push({ category: 'Trust & Security', issue: i, severity: 'High' }));
      }

      setMetrics(auditMetrics);
      setIssuesList(assembled);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Audit connection failed. Try another business URL.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title block */}
      <div>
        <h3 className={`text-sm font-bold flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          <Smartphone className="w-4.5 h-4.5 text-blue-500" /> B2B Website Redesign Auditor
        </h3>
        <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Instantly evaluate any local business website. Find security flaws, un-responsive layouts, and conversion blocks to pitch.
        </p>
      </div>

      {/* Input box */}
      <div className={`p-5 rounded-xl border shadow-sm ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <form onSubmit={handleAudit} className="flex gap-3">
          <div className="relative flex-1">
            <input
              type="url"
              required
              placeholder="https://example-business-clinic.com"
              className={`w-full py-2.5 pl-9 pr-4 rounded-lg text-xs outline-none focus:ring-2 border shadow-sm ${
                isDark
                  ? 'bg-slate-950 border-slate-800 focus:border-blue-500 focus:ring-blue-500/20 text-white'
                  : 'bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500/10 text-slate-850'
              }`}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-lg flex items-center gap-1.5 shadow transition-all cursor-pointer disabled:opacity-50 shrink-0"
          >
            {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
            Analyze Domain
          </button>
        </form>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 rounded-xl text-xs text-rose-600 dark:text-rose-300">
          <p className="font-bold">Auditor failed to run:</p>
          <p className="mt-1">{error}</p>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="p-16 text-center border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl space-y-3">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
          <p className="text-slate-700 dark:text-slate-300 text-xs font-bold animate-pulse">Scanning HTML DOM structures & SSL Handshakes...</p>
          <p className="text-slate-400 text-[10px]">Evaluating responsive viewport meta tags, loading speed latencies, and forms security.</p>
        </div>
      )}

      {/* Audit results */}
      {metrics && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
          {/* Circular Gauges Card */}
          <div className={`p-5 rounded-xl border shadow-sm ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h4 className={`text-xs font-black uppercase tracking-wider mb-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              UX Performance Scoring Matrix
            </h4>

            {/* Big overall score */}
            <div className="flex flex-col items-center justify-center py-6 border-b border-slate-100 dark:border-slate-800">
              <div className="relative flex items-center justify-center">
                {/* SVG Radial Gauge */}
                <svg className="w-28 h-28 transform -rotate-90">
                  <circle cx="56" cy="56" r="48" stroke={isDark ? '#1e293b' : '#f1f5f9'} strokeWidth="10" fill="transparent" />
                  <circle
                    cx="56"
                    cy="56"
                    r="48"
                    stroke={metrics.overall <= 40 ? '#ef4444' : metrics.overall <= 60 ? '#f59e0b' : '#10b981'}
                    strokeWidth="10"
                    fill="transparent"
                    strokeDasharray={301.6}
                    strokeDashoffset={301.6 - (301.6 * metrics.overall) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className={`text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{metrics.overall}</span>
                  <span className="text-slate-400 text-[11px] font-bold block">/ 100</span>
                </div>
              </div>
              <p className={`text-xs font-bold mt-3 ${
                metrics.overall <= 40 ? 'text-red-500' : metrics.overall <= 60 ? 'text-amber-500' : 'text-emerald-500'
              }`}>
                {metrics.overall <= 40 ? 'Severe Redesign Gap' : metrics.overall <= 60 ? 'Average Potential' : 'Excellent Health'}
              </p>
            </div>

            {/* Small dynamic rating gauges */}
            <div className="grid grid-cols-2 gap-4 mt-5 text-center text-xs">
              {/* Mobile Adaptability */}
              <div className="p-3 bg-slate-50 dark:bg-slate-950/40 rounded-lg border border-slate-100 dark:border-slate-850">
                <span className="text-slate-400 text-[9px] uppercase font-bold block">Mobile Score</span>
                <span className={`text-sm font-black block mt-1 ${metrics.mobile < 50 ? 'text-red-500' : 'text-emerald-500'}`}>
                  {metrics.mobile}%
                </span>
              </div>
              {/* SEO Ranking */}
              <div className="p-3 bg-slate-50 dark:bg-slate-950/40 rounded-lg border border-slate-100 dark:border-slate-850">
                <span className="text-slate-400 text-[9px] uppercase font-bold block">SEO Meta Score</span>
                <span className={`text-sm font-black block mt-1 ${metrics.seo < 50 ? 'text-red-500' : 'text-emerald-500'}`}>
                  {metrics.seo}%
                </span>
              </div>
              {/* Load speed */}
              <div className="p-3 bg-slate-50 dark:bg-slate-950/40 rounded-lg border border-slate-100 dark:border-slate-850">
                <span className="text-slate-400 text-[9px] uppercase font-bold block">Performance Speed</span>
                <span className={`text-sm font-black block mt-1 ${metrics.performance < 50 ? 'text-red-500' : 'text-emerald-500'}`}>
                  {metrics.performance}%
                </span>
              </div>
              {/* Security SSL */}
              <div className="p-3 bg-slate-50 dark:bg-slate-950/40 rounded-lg border border-slate-100 dark:border-slate-850">
                <span className="text-slate-400 text-[9px] uppercase font-bold block">SSL Security</span>
                <span className={`text-sm font-black block mt-1 ${metrics.security < 50 ? 'text-red-500' : 'text-emerald-500'}`}>
                  {metrics.security}%
                </span>
              </div>
            </div>
          </div>

          {/* Detailed Issues List Panel */}
          <div className={`lg:col-span-2 p-5 rounded-xl border shadow-sm flex flex-col justify-between ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                <h4 className={`text-xs font-black uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  System Flagged Conversions Blocks ({issuesList.length})
                </h4>
                <span className="px-2 py-0.5 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-[9px] font-bold rounded">
                  Pitch opportunities
                </span>
              </div>

              <div className="space-y-3 max-h-[290px] overflow-y-auto pr-1">
                {issuesList.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-lg border flex gap-3 text-xs items-start ${
                      item.severity === 'High'
                        ? 'bg-rose-50/40 border-rose-100 dark:bg-rose-950/20 dark:border-rose-900/40'
                        : 'bg-amber-50/40 border-amber-100 dark:bg-amber-950/20 dark:border-amber-900/40'
                    }`}
                  >
                    <AlertCircle className={`w-4 h-4 shrink-0 mt-0.5 ${item.severity === 'High' ? 'text-red-500' : 'text-amber-500'}`} />
                    <div className="flex-1">
                      <p className="font-bold flex items-center justify-between">
                        <span className={isDark ? 'text-slate-300' : 'text-slate-800'}>{item.category}</span>
                        <span className={`text-[8px] font-bold px-1 rounded uppercase ${
                          item.severity === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-950' : 'bg-amber-100 text-amber-700 dark:bg-amber-950'
                        }`}>
                          {item.severity} Gap
                        </span>
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5 font-sans leading-relaxed">
                        {item.issue}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pitch callout */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4 flex justify-between items-center">
              <span className="text-[10px] text-slate-500 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Grounded in Gemini Web Analytics
              </span>
              <p className="text-[11px] text-indigo-500 font-bold hover:underline cursor-pointer flex items-center gap-0.5">
                Generate Redesign Outreach <ChevronRight className="w-3.5 h-3.5" />
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
