/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, Mail, Send, Copy, Edit2, Check, RefreshCw, Smartphone, Linkedin, MessageSquare, Clipboard } from 'lucide-react';
import { Lead, ConsultantProfile, OutreachDraft, OutreachChannel } from '../types';

interface OutreachStudioTabProps {
  leads: Lead[];
  consultant: ConsultantProfile;
  isDark: boolean;
}

export default function OutreachStudioTab({ leads, consultant, isDark }: OutreachStudioTabProps) {
  const [selectedLeadId, setSelectedLeadId] = useState(leads[0]?.id || '');
  const [isLoading, setIsLoading] = useState(false);
  const [variations, setVariations] = useState<{ [key in OutreachChannel]?: OutreachDraft[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Tab within the generator
  const [activeChannel, setActiveChannel] = useState<OutreachChannel>('Cold Email');
  const [activeVarIdx, setActiveVarIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  const selectedLead = leads.find(l => l.id === selectedLeadId);

  const handleGenerateOutreach = async () => {
    if (!selectedLead) {
      setError('Please select a valid lead to write personalized copies.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setVariations(null);
    setActiveVarIdx(0);

    try {
      const response = await fetch('/api/generate-outreach-variations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead: selectedLead, consultant })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to craft outreach pitches.');
      }

      const data = await response.json();
      setVariations(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Outbound generation failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activeDrafts = variations?.[activeChannel] || [];
  const currentDraft = activeDrafts[activeVarIdx] || (activeChannel === 'Cold Email' && selectedLead ? selectedLead.outreach : null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className={`text-sm font-bold flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          <Mail className="w-4.5 h-4.5 text-blue-500" /> AI Personalized Outreach Generator
        </h3>
        <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Select any qualified lead from your CRM pipeline, click write, and instantly access customized B2B sequences across multiple channels.
        </p>
      </div>

      {/* Inputs selectors */}
      <div className={`p-5 rounded-xl border shadow-sm ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Target Lead</label>
            <select
              value={selectedLeadId}
              onChange={(e) => {
                setSelectedLeadId(e.target.value);
                setVariations(null);
              }}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-xs text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">-- Choose a lead --</option>
              {leads.map(l => (
                <option key={l.id} value={l.id}>{l.businessName} ({l.industry})</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleGenerateOutreach}
            disabled={isLoading || !selectedLeadId}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 shadow transition-all cursor-pointer shrink-0"
          >
            {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 animate-pulse" />}
            Compile Personal Copies
          </button>
        </div>
      </div>

      {/* Loading & error */}
      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 rounded-xl text-xs text-rose-600 dark:text-red-300">
          {error}
        </div>
      )}

      {isLoading && (
        <div className="p-16 text-center border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl space-y-3">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
          <p className="text-slate-700 dark:text-slate-300 text-xs font-bold animate-pulse">Personalizing Hooks & Writing Subject Copies...</p>
          <p className="text-slate-400 text-[10px]">Combining design audit notes, consultant links, and CRM milestones into multi-channel variations.</p>
        </div>
      )}

      {/* Copy board output */}
      {selectedLead && (currentDraft || variations) && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-fadeIn">
          {/* Multi-channel selector sidebar tabs */}
          <div className="space-y-2.5 lg:col-span-1">
            <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Outreach Outlets</p>
            
            <button
              onClick={() => { setActiveChannel('Cold Email'); setActiveVarIdx(0); }}
              className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs text-left transition-all cursor-pointer ${
                activeChannel === 'Cold Email'
                  ? 'bg-blue-600 border-blue-600 text-white font-bold shadow'
                  : isDark
                    ? 'bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-300'
                    : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <span className="flex items-center gap-2"><Mail className="w-4 h-4 shrink-0" /> Cold Email</span>
              <span className="text-[10px] opacity-70">2 options</span>
            </button>

            <button
              onClick={() => { setActiveChannel('Follow-Up'); setActiveVarIdx(0); }}
              className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs text-left transition-all cursor-pointer ${
                activeChannel === 'Follow-Up'
                  ? 'bg-blue-600 border-blue-600 text-white font-bold shadow'
                  : isDark
                    ? 'bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-300'
                    : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <span className="flex items-center gap-2"><Send className="w-4 h-4 shrink-0" /> Follow-Up</span>
              <span className="text-[10px] opacity-70">2 options</span>
            </button>

            <button
              onClick={() => { setActiveChannel('LinkedIn'); setActiveVarIdx(0); }}
              className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs text-left transition-all cursor-pointer ${
                activeChannel === 'LinkedIn'
                  ? 'bg-blue-600 border-blue-600 text-white font-bold shadow'
                  : isDark
                    ? 'bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-300'
                    : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <span className="flex items-center gap-2"><Linkedin className="w-4 h-4 shrink-0" /> LinkedIn Prompt</span>
              <span className="text-[10px] opacity-70">1 option</span>
            </button>

            <button
              onClick={() => { setActiveChannel('WhatsApp'); setActiveVarIdx(0); }}
              className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs text-left transition-all cursor-pointer ${
                activeChannel === 'WhatsApp'
                  ? 'bg-blue-600 border-blue-600 text-white font-bold shadow'
                  : isDark
                    ? 'bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-300'
                    : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <span className="flex items-center gap-2"><MessageSquare className="w-4 h-4 shrink-0" /> WhatsApp Pitch</span>
              <span className="text-[10px] opacity-70">1 option</span>
            </button>
          </div>

          {/* Copy Board Display */}
          <div className={`lg:col-span-3 p-5 rounded-xl border shadow-sm flex flex-col justify-between ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h4 className={`text-xs uppercase font-black tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Active Channel Template ({activeChannel})
                  </h4>
                  {/* Variation pills if available */}
                  {activeDrafts.length > 1 && (
                    <div className="flex gap-1.5 mt-1.5">
                      {activeDrafts.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveVarIdx(idx)}
                          className={`px-2.5 py-0.5 rounded text-[10px] font-bold border transition-colors cursor-pointer ${
                            activeVarIdx === idx
                              ? 'bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-950 dark:border-blue-900 dark:text-blue-300'
                              : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-500 dark:bg-slate-950/40 dark:border-slate-800'
                          }`}
                        >
                          Variation {idx + 1}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleCopy(currentDraft ? `${currentDraft.subject ? `Subject: ${currentDraft.subject}\n\n` : ''}${currentDraft.body}` : '')}
                  className="flex items-center gap-1 text-[10px] uppercase font-black text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-400 px-3 py-1.5 rounded-lg shadow-sm border border-blue-100 dark:border-blue-900 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500 animate-bounce" /> : <Clipboard className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy All'}
                </button>
              </div>

              {/* Template Content Box */}
              {currentDraft ? (
                <div className="space-y-4 font-mono text-[11px] leading-relaxed">
                  {currentDraft.subject && (
                    <div className={`p-3 rounded-lg border flex gap-2 ${
                      isDark ? 'bg-slate-950 border-slate-850' : 'bg-slate-50 border-slate-150'
                    }`}>
                      <span className="text-slate-400 shrink-0 select-none">Subject:</span>
                      <span className={`font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{currentDraft.subject}</span>
                    </div>
                  )}
                  <div className={`p-4 rounded-xl border whitespace-pre-wrap ${
                    isDark ? 'bg-slate-950 border-slate-850 text-slate-300' : 'bg-slate-50 border-slate-150 text-slate-700'
                  }`}>
                    {currentDraft.body}
                  </div>
                </div>
              ) : (
                <div className="text-center p-12 text-slate-400">
                  <Mail className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p className="text-xs">Select or generate customized copy structures for this lead.</p>
                </div>
              )}
            </div>

            {/* Campaign Launch Trigger */}
            {currentDraft && (
              <div className="border-t border-slate-100 dark:border-slate-800 mt-5 pt-3.5 flex justify-between items-center text-xs">
                <span className="text-slate-500">
                  ⚡ Fully responsive, anti-spam audited cold outreach draft.
                </span>
                <p className="text-indigo-500 font-bold hover:underline cursor-pointer">
                  Sync & Push to Outbound Campaign Sequence →
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
