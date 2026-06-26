/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Globe, Filter, Star, Sparkles, Building2, MapPin, DollarSign, Users, Link2, Plus, ArrowRight, RefreshCw, Eye } from 'lucide-react';
import { Lead } from '../types';

interface LeadFinderTabProps {
  onLeadsAdded: (leads: Lead[]) => void;
  onLeadSingleAdded: (lead: Lead) => void;
  isDark: boolean;
}

interface CountryPreset {
  name: string;
  code: string;
  flag: string;
  cities: string[];
}

const COUNTRY_PRESETS: CountryPreset[] = [
  {
    name: 'India',
    code: 'IN',
    flag: '🇮🇳',
    cities: ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune']
  },
  {
    name: 'USA',
    code: 'US',
    flag: '🇺🇸',
    cities: ['Miami, FL', 'Austin, TX', 'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'San Francisco, CA']
  },
  {
    name: 'Canada',
    code: 'CA',
    flag: '🇨🇦',
    cities: ['Toronto, ON', 'Vancouver, BC', 'Montreal, QC', 'Calgary, AB', 'Ottawa, ON']
  },
  {
    name: 'Australia',
    code: 'AU',
    flag: '🇦🇺',
    cities: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide']
  },
  {
    name: 'United Kingdom',
    code: 'GB',
    flag: 'GB',
    cities: ['London', 'Manchester', 'Birmingham', 'Edinburgh', 'Glasgow']
  },
  {
    name: 'France',
    code: 'FR',
    flag: '🇫🇷',
    cities: ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice']
  }
];

export default function LeadFinderTab({ onLeadsAdded, onLeadSingleAdded, isDark }: LeadFinderTabProps) {
  const [prompt, setPrompt] = useState('Find dentists in Mumbai needing website redesigns');
  const [selectedCountryCode, setSelectedCountryCode] = useState('IN');
  const [searchLocation, setSearchLocation] = useState('Mumbai, India');
  const [searchIndustry, setSearchIndustry] = useState('Dental Clinics');
  const [searchNotes, setSearchNotes] = useState('');
  
  // Advanced filters
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [revenueRange, setRevenueRange] = useState('All');
  const [employeeCount, setEmployeeCount] = useState('All');
  const [techUsed, setTechUsed] = useState('WordPress');
  const [minWebsiteScore, setMinWebsiteScore] = useState(5);

  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Lead[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const handleNaturalLanguageSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResults([]);

    // Deduce industry & location from prompt dynamically to assist backend mapping
    let deducedIndustry = searchIndustry;
    let deducedLocation = searchLocation;

    const lowerPrompt = prompt.toLowerCase();
    if (lowerPrompt.includes('roofing')) {
      deducedIndustry = 'Roofing Contractors';
    } else if (lowerPrompt.includes('dentist')) {
      deducedIndustry = 'Dental Clinics';
    } else if (lowerPrompt.includes('ecommerce') || lowerPrompt.includes('store')) {
      deducedIndustry = 'E-commerce Retailers';
    } else if (lowerPrompt.includes('law') || lowerPrompt.includes('legal') || lowerPrompt.includes('attorney')) {
      deducedIndustry = 'Law Firms';
    } else if (lowerPrompt.includes('bistro') || lowerPrompt.includes('restaurant')) {
      deducedIndustry = 'Restaurants & Bistros';
    } else if (lowerPrompt.includes('machining') || lowerPrompt.includes('manufacturing')) {
      deducedIndustry = 'Industrial Manufacturing';
    }

    COUNTRY_PRESETS.forEach(c => {
      if (lowerPrompt.includes(c.name.toLowerCase())) {
        deducedLocation = c.name;
      }
      c.cities.forEach(city => {
        if (lowerPrompt.includes(city.toLowerCase().split(',')[0])) {
          deducedLocation = `${city}, ${c.name === 'USA' ? 'USA' : c.name}`;
        }
      });
    });

    try {
      const response = await fetch('/api/generate-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: deducedLocation,
          industry: deducedIndustry,
          additionalNotes: `${searchNotes}. Natural prompt request: "${prompt}". Tech stack: ${techUsed}. Revenue filter: ${revenueRange}. Employee filter: ${employeeCount}. Max website quality score limit: ${minWebsiteScore}.`
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Server returned an error scanning Google records.');
      }

      const data = await response.json();
      
      // Inject some advanced fields to results
      const enriched = data.map((item: any, idx: number) => ({
        ...item,
        crmStage: 'New Lead',
        revenueEstimate: item.revenueEstimate || (revenueRange !== 'All' ? revenueRange : ['$150K - $300K', '$500K - $1.2M', '$2.0M - $4.5M'][idx % 3]),
        companySize: item.companySize || (employeeCount !== 'All' ? `${employeeCount} employees` : ['4-8 team members', '15-25 staff', 'Independent Practitioner'][idx % 3]),
        websiteMetrics: item.websiteMetrics || {
          overall: item.websiteScore * 10,
          mobile: Math.max(15, item.websiteScore * 10 - 15),
          seo: Math.max(20, item.websiteScore * 10 + 10),
          performance: Math.max(10, item.websiteScore * 10 - 5),
          security: item.websiteScore < 5 ? 10 : 80,
          design: item.websiteScore * 10,
          detectedIssues: {
            ssl: item.websiteScore < 5,
            slowSpeed: item.websiteScore < 6,
            poorMobile: item.websiteScore < 5,
            outdatedDesign: item.websiteScore < 7,
            missingSeo: item.websiteScore < 6,
            missingForms: item.websiteScore < 5
          }
        }
      }));

      setResults(enriched);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportSingle = (lead: Lead) => {
    onLeadSingleAdded(lead);
    // Remove from findings list
    setResults(prev => prev.filter(r => r.id !== lead.id));
  };

  const handleImportAll = () => {
    if (results.length === 0) return;
    onLeadsAdded(results);
    setToast(`Successfully imported ${results.length} leads into your active CRM pipeline workspace!`);
    setTimeout(() => setToast(null), 4000);
    setResults([]);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className={`p-4 rounded-xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
        isDark ? 'bg-gradient-to-r from-slate-900 to-indigo-950/40 border-slate-800' : 'bg-gradient-to-r from-blue-50 to-indigo-50/40 border-blue-100'
      }`}>
        <div>
          <h3 className={`text-sm font-bold flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <Sparkles className="w-4.5 h-4.5 text-blue-500" /> AI Lead Finder Engine
          </h3>
          <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Enter B2B queries or click global presets. Our crawler uses Google search grounding to find real websites with digital gaps.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => {
              setPrompt('Find roofing companies in London with outdated websites');
              setSearchIndustry('Roofing Contractors');
              setSearchLocation('London, United Kingdom');
              setSelectedCountryCode('GB');
            }}
            className="px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 text-[10px] rounded cursor-pointer text-slate-700 dark:text-slate-200"
          >
            "London Roofers"
          </button>
          <button
            onClick={() => {
              setPrompt('Find dentists in Miami needing secure booking appointments');
              setSearchIndustry('Dental Clinics');
              setSearchLocation('Miami, USA');
              setSelectedCountryCode('US');
            }}
            className="px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 text-[10px] rounded cursor-pointer text-slate-700 dark:text-slate-200"
          >
            "Miami Dentists"
          </button>
          <button
            onClick={() => {
              setPrompt('Find ecommerce stores in India on WordPress with slow speeds');
              setSearchIndustry('E-commerce Retailers');
              setSearchLocation('Mumbai, India');
              setSelectedCountryCode('IN');
            }}
            className="px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 text-[10px] rounded cursor-pointer text-slate-700 dark:text-slate-200"
          >
            "India E-com"
          </button>
        </div>
      </div>

      {/* Main Search Form Card */}
      <div className={`p-5 rounded-xl border shadow-sm ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <form onSubmit={handleNaturalLanguageSearch} className="space-y-4">
          <div className="space-y-1">
            <label className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              What kind of businesses are you targeting?
            </label>
            <div className="relative">
              <input
                type="text"
                required
                className={`w-full py-2.5 pl-9 pr-24 rounded-lg text-xs outline-none focus:ring-2 border shadow-sm ${
                  isDark
                    ? 'bg-slate-950 border-slate-800 focus:border-blue-500 focus:ring-blue-500/20 text-white'
                    : 'bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500/10 text-slate-850'
                }`}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <button
                type="submit"
                disabled={isLoading}
                className="absolute right-1.5 top-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-1.5 rounded-md flex items-center gap-1.5 shadow transition-all cursor-pointer disabled:opacity-50"
              >
                {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                Scan B2B Hub
              </button>
            </div>
          </div>

          {/* Quick Target Market Preset Selector */}
          <div className="space-y-2">
            <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-blue-500" /> Target International Market
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {COUNTRY_PRESETS.map((country) => {
                const isActive = selectedCountryCode === country.code;
                return (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => {
                      setSelectedCountryCode(country.code);
                      const city = country.cities[0];
                      const countryName = country.name === 'USA' ? 'USA' : country.name;
                      setSearchLocation(`${city}, ${countryName}`);
                      setPrompt(`Find ${searchIndustry.toLowerCase()} in ${city}, ${countryName} with outdated websites`);
                    }}
                    className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs transition-all cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 border-blue-600 text-white shadow font-bold'
                        : isDark
                          ? 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                          : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <span>{country.flag}</span>
                    <span>{country.name}</span>
                  </button>
                );
              })}
            </div>

            {/* City chips corresponding to chosen country preset */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-900">
              <span className="text-[9px] uppercase font-black text-slate-400 mr-2">Local Hubs:</span>
              {COUNTRY_PRESETS.find(c => c.code === selectedCountryCode)?.cities.map((city) => {
                const countryName = COUNTRY_PRESETS.find(c => c.code === selectedCountryCode)!.name;
                const fullLoc = `${city}, ${countryName === 'USA' ? 'USA' : countryName}`;
                const isSelected = searchLocation.toLowerCase().trim() === fullLoc.toLowerCase().trim();

                return (
                  <button
                    key={city}
                    type="button"
                    onClick={() => {
                      setSearchLocation(fullLoc);
                      setPrompt(`Find ${searchIndustry.toLowerCase()} in ${city}, ${countryName === 'USA' ? 'USA' : countryName} needing conversions`);
                    }}
                    className={`px-2 py-0.5 border text-[10px] rounded transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-100 border-blue-300 text-blue-700 font-bold dark:bg-blue-950 dark:border-blue-900 dark:text-blue-300'
                        : isDark
                          ? 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                          : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-600'
                    }`}
                  >
                    {city}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Advanced filters toggle button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
            >
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              {showAdvanced ? 'Hide Advanced SaaS Filters' : 'Show Advanced SaaS Filters'}
            </button>
          </div>

          {/* Advanced Filter Panel */}
          {showAdvanced && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 animate-slideDown">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Estimated Revenue</label>
                <select
                  value={revenueRange}
                  onChange={(e) => setRevenueRange(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded p-1.5 text-[11px] text-slate-700 dark:text-slate-300 outline-none"
                >
                  <option value="All">All Categories</option>
                  <option value="$100K - $500K">$100K - $500K</option>
                  <option value="$500K - $2.0M">$500K - $2.0M</option>
                  <option value="$2.0M - $10.0M">$2.0M - $10.0M</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Employee Count</label>
                <select
                  value={employeeCount}
                  onChange={(e) => setEmployeeCount(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded p-1.5 text-[11px] text-slate-700 dark:text-slate-300 outline-none"
                >
                  <option value="All">All Sizes</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Technology Used</label>
                <select
                  value={techUsed}
                  onChange={(e) => setTechUsed(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded p-1.5 text-[11px] text-slate-700 dark:text-slate-300 outline-none"
                >
                  <option value="WordPress">WordPress</option>
                  <option value="Shopify">Shopify</option>
                  <option value="Wix/Squarespace">Wix / Squarespace</option>
                  <option value="Static HTML/Legacy">Legacy Custom HTML</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Max Website Score</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="2"
                    max="9"
                    value={minWebsiteScore}
                    onChange={(e) => setMinWebsiteScore(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-[11px] font-bold text-red-500 dark:text-red-400">{minWebsiteScore}/10</span>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Errors or Loading State */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-xl text-xs text-red-600 dark:text-red-300">
          <p className="font-bold">Scan Execution Issue:</p>
          <p className="mt-1">{error}</p>
        </div>
      )}

      {isLoading && (
        <div className="p-16 text-center border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl space-y-3 shadow-inner">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
          <p className="text-slate-700 dark:text-slate-300 text-xs font-bold animate-pulse">Running Crawler & Reading Google Grounding Data...</p>
          <p className="text-slate-400 text-[10px]">Analyzing local businesses in {searchLocation} matching "{searchIndustry}". Estimating tech stacks...</p>
        </div>
      )}

      {/* Results Display */}
      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h4 className={`text-xs uppercase font-black tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Scan Findings: {results.length} Qualified Targets Discovered
            </h4>
            <button
              onClick={handleImportAll}
              className="flex items-center gap-1.5 px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-md transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Import All Leads to CRM
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {results.map((lead) => (
              <div
                key={lead.id}
                className={`p-4 rounded-xl border flex flex-col justify-between shadow-sm hover:shadow transition-all ${
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                <div className="space-y-3">
                  {/* Lead Title Block */}
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0">
                      <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-[9px] font-bold rounded">
                        {lead.industry}
                      </span>
                      <h5 className={`text-sm font-bold truncate mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {lead.businessName}
                      </h5>
                      <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-[11px] mt-0.5">
                        <MapPin className="w-3 h-3 text-red-400" />
                        <span>{searchLocation}</span>
                      </div>
                    </div>

                    {/* Website score circle badge */}
                    <div className="text-center shrink-0">
                      <span className={`text-xs font-black inline-flex items-center justify-center w-8 h-8 rounded-full border ${
                        lead.websiteScore <= 3
                          ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/30 dark:border-rose-900'
                          : lead.websiteScore <= 5
                            ? 'bg-amber-50 border-amber-200 text-amber-600 dark:bg-amber-950/30 dark:border-amber-900'
                            : 'bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-950/30 dark:border-emerald-900'
                      }`}>
                        {lead.websiteScore}
                      </span>
                      <p className="text-[8px] uppercase text-slate-500 mt-1 font-bold">UX Score</p>
                    </div>
                  </div>

                  {/* Company stats row */}
                  <div className="grid grid-cols-3 gap-2 py-2 border-t border-b border-slate-100 dark:border-slate-800 text-[11px]">
                    <div className="text-center">
                      <span className="text-[9px] uppercase font-bold text-slate-400 block">Employees</span>
                      <span className={`font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{lead.companySize}</span>
                    </div>
                    <div className="text-center border-l border-r border-slate-100 dark:border-slate-800">
                      <span className="text-[9px] uppercase font-bold text-slate-400 block">Revenue</span>
                      <span className="font-bold text-emerald-500">{lead.revenueEstimate || 'N/A'}</span>
                    </div>
                    <div className="text-center">
                      <span className="text-[9px] uppercase font-bold text-slate-400 block">Estimated Budget</span>
                      <span className={`font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{lead.budgetPotential}</span>
                    </div>
                  </div>

                  {/* Specific pain point summary */}
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Identified Digital Gap</p>
                    <p className={`text-[11px] leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      {lead.whyNewWebsite}
                    </p>
                  </div>

                  {/* Contact detail row */}
                  {lead.contactPerson && (
                    <div className="p-2 rounded bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 text-xs text-slate-600 dark:text-slate-400 space-y-1">
                      <p className="font-bold text-[11px] text-slate-800 dark:text-slate-200 flex items-center justify-between">
                        <span>👤 {lead.contactPerson}</span>
                        <span className="text-[9px] text-slate-400">{lead.contactTitle}</span>
                      </p>
                      <p className="text-[11px] flex items-center justify-between">
                        <span>✉️ {lead.email}</span>
                        {lead.emailConfidence && (
                          <span className="text-[9px] text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 px-1 py-0.5 rounded font-semibold">
                            Verified {lead.emailConfidence}%
                          </span>
                        )}
                      </p>
                    </div>
                  )}
                </div>

                {/* Import actions */}
                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <a
                    href={lead.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={`flex-1 text-center py-1.5 border rounded text-xs transition-colors cursor-pointer flex items-center justify-center gap-1 ${
                      isDark 
                        ? 'bg-slate-950 border-slate-800 hover:bg-slate-800 text-slate-300' 
                        : 'bg-white border-slate-250 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5 text-blue-500" /> Visit Site
                  </a>
                  <button
                    onClick={() => handleImportSingle(lead)}
                    className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded transition-colors cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Import Lead
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-800 flex items-center gap-2 animate-fadeIn text-xs font-bold">
          <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
          <span>{toast}</span>
          <button onClick={() => setToast(null)} className="ml-2 text-slate-400 hover:text-white cursor-pointer">✕</button>
        </div>
      )}
    </div>
  );
}
