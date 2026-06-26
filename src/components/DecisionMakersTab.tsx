/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Users, ShieldCheck, Mail, Linkedin, Search, RefreshCw, CheckCircle2, AlertTriangle, XCircle, Plus, Eye } from 'lucide-react';
import { DecisionMaker, EmailStatus } from '../types';
import { safeApiRequest } from '../utils/api';

interface DecisionMakersTabProps {
  isDark: boolean;
}

export default function DecisionMakersTab({ isDark }: DecisionMakersTabProps) {
  // Discovery states
  const [website, setWebsite] = useState('https://www.horizondentalcaremiami.com');
  const [businessName, setBusinessName] = useState('Horizon Dental Studio');
  const [discoveryLoading, setDiscoveryLoading] = useState(false);
  const [discoveredMakers, setDiscoveredMakers] = useState<DecisionMaker[]>([]);
  const [discoveryError, setDiscoveryError] = useState<string | null>(null);

  // Verification states
  const [testEmail, setTestEmail] = useState('msterling@horizondentalmiami.com');
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{ email: string; status: EmailStatus; confidence: number; details: string } | null>(null);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  const handleDiscover = async (e: React.FormEvent) => {
    e.preventDefault();
    setDiscoveryLoading(true);
    setDiscoveryError(null);
    setDiscoveredMakers([]);

    try {
      const data = await safeApiRequest('/api/find-decision-makers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ websiteUrl: website, businessName })
      });
      setDiscoveredMakers(data);
    } catch (err: any) {
      console.error(err);
      setDiscoveryError(err.message || 'Error running B2B contact miners.');
    } finally {
      setDiscoveryLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerificationLoading(true);
    setVerificationError(null);
    setVerificationResult(null);

    try {
      const data = await safeApiRequest('/api/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testEmail })
      });
      setVerificationResult(data);
    } catch (err: any) {
      console.error(err);
      setVerificationError(err.message || 'Email verification failed.');
    } finally {
      setVerificationLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Col 1: Decision Maker Finder */}
      <div className="space-y-6">
        <div>
          <h3 className={`text-sm font-bold flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <Users className="w-4.5 h-4.5 text-blue-500" /> Executive Decision Maker Finder
          </h3>
          <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Discover real B2B leads, managers, founders, and stakeholders associated with any company website URL.
          </p>
        </div>

        {/* Discovery Form */}
        <div className={`p-5 rounded-xl border shadow-sm ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <form onSubmit={handleDiscover} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Company Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Horizon Dental Studio"
                  className={`w-full py-2 px-3 rounded-lg text-xs outline-none focus:ring-2 border ${
                    isDark
                      ? 'bg-slate-950 border-slate-800 focus:border-blue-500 focus:ring-blue-500/20 text-white'
                      : 'bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500/10 text-slate-800'
                  }`}
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Website URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://example.com"
                  className={`w-full py-2 px-3 rounded-lg text-xs outline-none focus:ring-2 border ${
                    isDark
                      ? 'bg-slate-950 border-slate-800 focus:border-blue-500 focus:ring-blue-500/20 text-white'
                      : 'bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500/10 text-slate-800'
                  }`}
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={discoveryLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2 rounded-lg flex items-center gap-1.5 shadow transition-all cursor-pointer disabled:opacity-50"
              >
                {discoveryLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                Find Decision Makers
              </button>
            </div>
          </form>
        </div>

        {/* Discovery Results */}
        {discoveryError && (
          <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 rounded-xl text-xs text-rose-600 dark:text-red-300">
            {discoveryError}
          </div>
        )}

        {discoveryLoading && (
          <div className="p-12 text-center border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl space-y-2">
            <RefreshCw className="w-6 h-6 text-blue-600 animate-spin mx-auto" />
            <p className="text-slate-700 dark:text-slate-300 text-xs font-bold animate-pulse">Scanning Corporate Directories & LinkedIn Graph Indexes...</p>
          </div>
        )}

        {discoveredMakers.length > 0 && (
          <div className="space-y-3">
            <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Discovered Personnel ({discoveredMakers.length})</p>
            <div className="space-y-3">
              {discoveredMakers.map((person, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border flex justify-between items-center shadow-sm ${
                    isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="space-y-1 min-w-0">
                    <p className={`text-xs font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{person.name}</p>
                    <p className="text-slate-500 text-[10px] uppercase font-bold">{person.title}</p>
                    <p className="text-[11px] text-slate-400 truncate flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-blue-500 shrink-0" /> {person.email}
                    </p>
                  </div>
                  <div className="text-right shrink-0 ml-4 space-y-2">
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 text-[9px] font-bold rounded">
                      Confidence {person.confidence}%
                    </span>
                    <div className="flex gap-1.5 justify-end mt-1">
                      {person.linkedinUrl && (
                        <a
                          href={`https://${person.linkedinUrl}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1 border border-slate-200 dark:border-slate-700 hover:border-blue-500 rounded bg-slate-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400"
                        >
                          <Linkedin className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Col 2: Email Deliverability Verifier */}
      <div className="space-y-6">
        <div>
          <h3 className={`text-sm font-bold flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <ShieldCheck className="w-4.5 h-4.5 text-indigo-500" /> AI Email Deliverability Auditor
          </h3>
          <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Verify cold leads deliverability in real-time. Check SMTP handshakes and protect your outbound mailbox reputation.
          </p>
        </div>

        {/* Verifier Form */}
        <div className={`p-5 rounded-xl border shadow-sm ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Lead Email Address</label>
              <input
                type="email"
                required
                placeholder="msterling@horizondentalmiami.com"
                className={`w-full py-2 px-3 rounded-lg text-xs outline-none focus:ring-2 border ${
                  isDark
                    ? 'bg-slate-950 border-slate-800 focus:border-blue-500 focus:ring-blue-500/20 text-white'
                    : 'bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500/10 text-slate-800'
                }`}
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={verificationLoading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2 rounded-lg flex items-center gap-1.5 shadow transition-all cursor-pointer disabled:opacity-50"
              >
                {verificationLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                Audit Mailbox Status
              </button>
            </div>
          </form>
        </div>

        {/* Verification Results */}
        {verificationError && (
          <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 rounded-xl text-xs text-rose-600 dark:text-red-300">
            {verificationError}
          </div>
        )}

        {verificationLoading && (
          <div className="p-12 text-center border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl space-y-2">
            <RefreshCw className="w-6 h-6 text-indigo-600 animate-spin mx-auto" />
            <p className="text-slate-700 dark:text-slate-300 text-xs font-bold animate-pulse">Running DNS checks, MX logs lookup, and ping SMTP pings...</p>
          </div>
        )}

        {verificationResult && (
          <div className={`p-5 rounded-xl border shadow-sm flex flex-col justify-between animate-fadeIn ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-400">Audited Address</span>
                <p className={`text-sm font-bold font-mono ${isDark ? 'text-white' : 'text-slate-800'}`}>{verificationResult.email}</p>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-1">
                {verificationResult.status === 'Valid' && (
                  <span className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-600 dark:bg-emerald-950/40 dark:border-emerald-900 text-xs font-black rounded-lg flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Valid & Safe
                  </span>
                )}
                {verificationResult.status === 'Risky' && (
                  <span className="px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-600 dark:bg-amber-950/40 dark:border-amber-900 text-xs font-black rounded-lg flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Catch-All / Risky
                  </span>
                )}
                {verificationResult.status === 'Invalid' && (
                  <span className="px-2.5 py-1 bg-rose-50 border border-rose-200 text-rose-600 dark:bg-rose-950/40 dark:border-rose-900 text-xs font-black rounded-lg flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> Invalid / Hard Bounce
                  </span>
                )}
              </div>
            </div>

            <div className="py-4 border-t border-slate-100 dark:border-slate-800 mt-4 text-xs space-y-2">
              <p className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Audit Report: {verificationResult.details}
              </p>
              <div className="flex justify-between items-center pt-2">
                <span className="text-[10px] text-slate-400">Security Deliverability index:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{verificationResult.confidence}% Confidence</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
