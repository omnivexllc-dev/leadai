/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Globe, Sparkles, Building2, MapPin, ListPlus, Loader2, PlayCircle, AlertCircle } from 'lucide-react';
import { Lead } from '../types';

interface NewLeadScannerProps {
  onLeadsAdded: (leads: Lead[]) => void;
  onLeadSingleAdded: (lead: Lead) => void;
}

export default function NewLeadScanner({ onLeadsAdded, onLeadSingleAdded }: NewLeadScannerProps) {
  const [activeTab, setActiveTab] = useState<'search' | 'audit'>('search');
  
  // Search state
  const [searchLocation, setSearchLocation] = useState('Miami, FL');
  const [searchIndustry, setSearchIndustry] = useState('Dental Clinics');
  const [searchNotes, setSearchNotes] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Audit state
  const [auditUrl, setAuditUrl] = useState('');
  const [auditIndustry, setAuditIndustry] = useState('Local Restaurant');
  const [auditLocation, setAuditLocation] = useState('Boston, MA');
  const [auditNotes, setAuditNotes] = useState('');
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditError, setAuditError] = useState<string | null>(null);

  // Suggestions arrays
  const industrySuggestions = [
    'Dental Clinics', 'Law Firms', 'Restaurants', 
    'Real Estate Agencies', 'Construction Companies', 'Financial Advisors'
  ];
  
  const locationSuggestions = [
    'Miami, FL', 'Austin, TX', 'Sydney, Australia', 
    'London, UK', 'Boston, MA'
  ];

  // Run Search
  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchLocation || !searchIndustry) return;

    setIsSearching(true);
    setSearchError(null);

    try {
      const response = await fetch('/api/generate-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: searchLocation,
          industry: searchIndustry,
          additionalNotes: searchNotes
        })
      });

      const responseText = await response.text();
      let responseData: any;
      try {
        responseData = JSON.parse(responseText);
      } catch (jsonErr) {
        console.error('Failed to parse search leads JSON response:', responseText);
        throw new Error(`Server returned a non-JSON response (${response.status}): ${responseText.substring(0, 150)}...`);
      }

      if (!response.ok) {
        throw new Error(responseData?.error || `Failed to generate B2B prospects (Status: ${response.status}).`);
      }

      const rawLeads = responseData;
      if (Array.isArray(rawLeads) && rawLeads.length > 0) {
        // Enforce safe default formats and assign a creation date
        const validatedLeads: Lead[] = rawLeads.map((lead: any, idx: number) => ({
          ...lead,
          id: lead.id || `lead-${Date.now()}-${idx}`,
          status: lead.status || 'New',
          createdAt: lead.createdAt || new Date().toISOString()
        }));
        onLeadsAdded(validatedLeads);
        setSearchNotes('');
      } else {
        throw new Error('Gemini successfully processed but did not return a valid list array. Please retry.');
      }
    } catch (err: any) {
      console.error(err);
      setSearchError(err.message || 'Error occurred while contacting web design audit engine.');
    } finally {
      setIsSearching(false);
    }
  };

  // Run Single Audit
  const handleAuditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auditUrl) return;

    setIsAuditing(true);
    setAuditError(null);

    try {
      // Basic prefix correction helper
      let formattedUrl = auditUrl.trim();
      if (!/^https?:\/\//i.test(formattedUrl)) {
        formattedUrl = `https://${formattedUrl}`;
      }

      const response = await fetch('/api/audit-website', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: formattedUrl,
          industry: auditIndustry,
          location: auditLocation,
          additionalNotes: auditNotes
        })
      });

      const responseText = await response.text();
      let responseData: any;
      try {
        responseData = JSON.parse(responseText);
      } catch (jsonErr) {
        console.error('Failed to parse audit website JSON response:', responseText);
        throw new Error(`Server returned a non-JSON response (${response.status}): ${responseText.substring(0, 150)}...`);
      }

      if (!response.ok) {
        throw new Error(responseData?.error || `Audit analysis failed (Status: ${response.status}).`);
      }

      const parsedLead = responseData;
      if (parsedLead && parsedLead.businessName) {
        const validatedLead: Lead = {
          ...parsedLead,
          id: parsedLead.id || `audit-${Date.now()}`,
          status: 'New',
          createdAt: new Date().toISOString()
        };
        onLeadSingleAdded(validatedLead);
        setAuditUrl('');
        setAuditNotes('');
      } else {
        throw new Error('Could not parse a high-fidelity audit report. Ensure the URL is valid.');
      }
    } catch (err: any) {
      console.error(err);
      setAuditError(err.message || 'Error performing instant website audit.');
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 mb-6">
      <div className="flex border-b border-slate-200 mb-5">
        <button
          onClick={() => setActiveTab('search')}
          className={`flex items-center gap-2 pb-3 px-4 font-bold text-xs border-b-2 transition-all outline-none cursor-pointer ${
            activeTab === 'search'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <Search className="w-4 h-4" /> B2B Prospect Finder
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`flex items-center gap-2 pb-3 px-4 font-bold text-xs border-b-2 transition-all outline-none cursor-pointer ${
            activeTab === 'audit'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <Globe className="w-4 h-4" /> Custom Live Website Audit
        </button>
      </div>

      {activeTab === 'search' ? (
        <form onSubmit={handleSearchSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Industry Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" /> Target B2B Industry
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Dental Clinics, Law Firms"
                className="w-full bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg py-2 px-3 text-xs text-slate-800 outline-none shadow-inner"
                value={searchIndustry}
                onChange={(e) => setSearchIndustry(e.target.value)}
              />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {industrySuggestions.map(ind => (
                  <button
                    key={ind}
                    type="button"
                    onClick={() => setSearchIndustry(ind)}
                    className="px-2 py-0.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 text-[10px] text-slate-600 hover:text-slate-850 rounded transition-colors cursor-pointer"
                  >
                    {ind}
                  </button>
                ))}
              </div>
            </div>

            {/* Location Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" /> Target Metro Area / Country
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Miami, FL or Austin, TX"
                className="w-full bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg py-2 px-3 text-xs text-slate-800 outline-none shadow-inner"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
              />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {locationSuggestions.map(loc => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => setSearchLocation(loc)}
                    className="px-2 py-0.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 text-[10px] text-slate-600 hover:text-slate-850 rounded transition-colors cursor-pointer"
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600 flex items-center gap-1">
              Additional Filters or Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Focus on companies with old legacy look or no secure HTTPS"
              className="w-full bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-505 rounded-lg py-2 px-3 text-xs text-slate-800 outline-none shadow-inner"
              value={searchNotes}
              onChange={(e) => setSearchNotes(e.target.value)}
            />
          </div>

          {searchError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-lg flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <span className="font-medium">{searchError}</span>
            </div>
          )}

          <div className="flex justify-between items-center pt-2">
            <p className="text-[10px] text-slate-500 max-w-sm">
              Uses modern search-grounding to check actual structures, ratings, and design cues in the designated city.
            </p>
            <button
              type="submit"
              disabled={isSearching}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
            >
              {isSearching ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Grounding Research & Building Leads...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" /> Retrieve Warm Leads
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleAuditSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Custom URL */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-slate-400" /> Website URL to Audit
              </label>
              <input
                type="text"
                required
                placeholder="e.g. www.citycentraldentist.com"
                className="w-full bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg py-2 px-3 text-xs text-slate-800 outline-none shadow-inner"
                value={auditUrl}
                onChange={(e) => setAuditUrl(e.target.value)}
              />
            </div>

            {/* Target Location or Industry contextual parameters */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">Indicated Sector</label>
                <input
                  type="text"
                  placeholder="e.g. Attorney / Spa"
                  className="w-full bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg py-2 px-3 text-xs text-slate-800 outline-none shadow-inner"
                  value={auditIndustry}
                  onChange={(e) => setAuditIndustry(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">City / Region</label>
                <input
                  type="text"
                  placeholder="e.g. Chicago, IL"
                  className="w-full bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg py-2 px-3 text-xs text-slate-800 outline-none shadow-inner"
                  value={auditLocation}
                  onChange={(e) => setAuditLocation(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600">Contextual Audit Clues (e.g. branding notes, known issues)</label>
            <input
              type="text"
              placeholder="e.g. Logo is pixelated, missing a clear call-to-action button, loading is highly sluggish"
              className="w-full bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-505 rounded-lg py-2 px-3 text-xs text-slate-800 outline-none shadow-inner"
              value={auditNotes}
              onChange={(e) => setAuditNotes(e.target.value)}
            />
          </div>

          {auditError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-lg flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
              <span className="font-medium">{auditError}</span>
            </div>
          )}

          <div className="flex justify-between items-center pt-2">
            <p className="text-[10px] text-slate-500 max-w-sm">
              Drives Gemini to run a comprehensive code/design/UX mockup and formulate the ideal pitch script for the owner.
            </p>
            <button
              type="submit"
              disabled={isAuditing}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
            >
              {isAuditing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Inspecting Code, Structure & UX...
                </>
              ) : (
                <>
                  <PlayCircle className="w-3.5 h-3.5" /> Analyze Quality & Generate Pitch
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
