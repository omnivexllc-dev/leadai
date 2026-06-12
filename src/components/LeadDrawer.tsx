/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  X, Mail, Phone, Linkedin, Building, ExternalLink, Flame, Check, Copy, Sparkles,
  ChevronDown, Layout, Smartphone, Globe, Zap, Target, ShieldCheck, HelpCircle, Loader2
} from 'lucide-react';
import { Lead, ConsultantProfile, WebsiteIssues } from '../types';

interface LeadDrawerProps {
  lead: Lead;
  onClose: () => void;
  onSaveLeadChanges: (updatedLead: Lead) => void;
  consultant: ConsultantProfile;
}

export default function LeadDrawer({ lead, onClose, onSaveLeadChanges, consultant }: LeadDrawerProps) {
  const [selectedTone, setSelectedTone] = useState('Value-First Audit');
  const [isUpdatingCopy, setIsUpdatingCopy] = useState(false);
  const [rewriteError, setRewriteError] = useState<string | null>(null);

  // Editable copies
  const [subject, setSubject] = useState(lead.outreach.subject);
  const [body, setBody] = useState(lead.outreach.body);
  const [customWebsiteStatus, setCustomWebsiteStatus] = useState('');

  const [copiedSubject, setCopiedSubject] = useState(false);
  const [copiedBody, setCopiedBody] = useState(false);

  // Sync state if lead changes
  useEffect(() => {
    setSubject(lead.outreach.subject);
    setBody(lead.outreach.body);
    setCustomWebsiteStatus(
      `Quality Score: ${lead.websiteScore}/10 - ${lead.whyNewWebsite || 'Outdated design and poor responsive mobile formatting.'}`
    );
  }, [lead]);

  // Handle local state updates back to main DB
  const handleSaveDraft = () => {
    const updated: Lead = {
      ...lead,
      outreach: {
        subject,
        body
      }
    };
    onSaveLeadChanges(updated);
  };

  // Copy helpers
  const handleCopySubject = async () => {
    try {
      await navigator.clipboard.writeText(subject);
      setCopiedSubject(true);
      setTimeout(() => setCopiedSubject(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyBody = async () => {
    try {
      await navigator.clipboard.writeText(body);
      setCopiedBody(true);
      setTimeout(() => setCopiedBody(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  // Rewrite outreach via API
  const handleRewriteOutreach = async () => {
    setIsUpdatingCopy(true);
    setRewriteError(null);

    try {
      const response = await fetch('/api/rewrite-outreach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead,
          tone: selectedTone,
          consultant,
          websiteStatus: customWebsiteStatus
        })
      });

      if (!response.ok) {
        throw new Error('Failed to content draft from copywriting server.');
      }

      const data = await response.json();
      if (data && data.body) {
        setSubject(data.subject);
        setBody(data.body);
        
        // Auto save back to state
        const updated: Lead = {
          ...lead,
          outreach: {
            subject: data.subject,
            body: data.body
          }
        };
        onSaveLeadChanges(updated);
      } else {
        throw new Error('Could not parse polished results from GenAI.');
      }
    } catch (err: any) {
      console.error(err);
      setRewriteError(err.message || 'Error occurred rewriting email template.');
    } finally {
      setIsUpdatingCopy(false);
    }
  };

  // Mailto Link Builder
  const handleLaunchEmailClient = () => {
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);
    const mailtoUrl = `mailto:${lead.email}?subject=${encodedSubject}&body=${encodedBody}`;
    window.location.href = mailtoUrl;
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer content */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'tween', duration: 0.35, ease: 'easeOut' }}
        className="fixed top-0 right-0 bottom-0 w-full max-w-4xl bg-white border-l border-slate-200 z-50 flex flex-col h-full shadow-2xl overflow-hidden"
      >
        {/* Drawer Header */}
        <div className="bg-slate-50 px-6 py-5 border-b border-slate-200 flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-blue-650 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                PROSPECT DEEP AUDIT
              </span>
              {lead.priority === 'Hot' && (
                <span className="text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-155 flex items-center gap-0.5 animate-pulse">
                  <Flame className="w-3 h-3 fill-red-600 text-red-600" /> URGENT
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-slate-900 font-sans">{lead.businessName}</h2>
            <p className="text-xs text-slate-500 flex items-center gap-1.5">
              <span>{lead.industry}</span>
              <span className="text-slate-300">•</span>
              <a 
                href={lead.websiteUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-slate-455 hover:text-blue-605 flex items-center gap-0.5 underline transition-colors"
              >
                {lead.websiteUrl} <ExternalLink className="w-3 h-3 stroke-2" />
              </a>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition-all border border-slate-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Scrollable Body split into Grid */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Section 1: Lead Metrics Block */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Website Score</p>
              <p className={`text-2xl font-black mt-1 ${lead.websiteScore < 5 ? 'text-rose-600' : 'text-amber-600'}`}>
                {lead.websiteScore} <span className="text-sm font-normal text-slate-400">/ 10</span>
              </p>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Estimated Budget</p>
              <p className="text-xl font-extrabold text-emerald-650 mt-1">{lead.budgetPotential}</p>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Company Scale</p>
              <p className="text-sm font-bold text-slate-700 mt-2.5 truncate" title={lead.companySize}>
                {lead.companySize || 'N/A employees'}
              </p>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Key Target Contact</p>
              <p className="text-xs font-bold text-slate-800 mt-1 truncate" title={lead.contactPerson}>
                {lead.contactPerson || 'Unknown Decisionmaker'}
              </p>
              <p className="text-[10px] text-slate-500 truncate">{lead.contactTitle || 'Owner'}</p>
            </div>
          </div>

          {/* Section 2: Contact Communication Grid */}
          <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200 flex flex-wrap gap-4 justify-between items-center text-xs shadow-sm">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-slate-400" />
              <span className="text-slate-500">Direct Email:</span>
              <a href={`mailto:${lead.email}`} className="font-bold text-blue-600 hover:text-blue-700 transition-colors underline">
                {lead.email}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-slate-400" />
              <span className="text-slate-500">Direct Line:</span>
              <span className="font-bold text-slate-700">
                {lead.phone || 'N/A'}
              </span>
            </div>
            {lead.linkedinUrl && (
              <div className="flex items-center gap-2">
                <Linkedin className="w-4 h-4 text-blue-500" />
                <span className="text-slate-500">LinkedIn:</span>
                <a href={lead.linkedinUrl} target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:text-blue-700 transition-colors underline truncate max-w-[150px]">
                  {lead.linkedinUrl.includes('linkedin.com') ? 'View Profile' : lead.linkedinUrl}
                </a>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Box: DIAGNOSTIC AUDIT LOGS */}
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-rose-500" /> UX/SEO Gap Diagnostics
                </h3>
                <p className="text-[11px] text-slate-500 mb-3 leading-relaxed">
                  The following issues score penalties on modern search engines, customer conversion thresholds, and layout indexes:
                </p>
              </div>

              {/* Bento accordion display of challenges */}
              <div className="space-y-2.5">
                {/* 1. Design */}
                {lead.issues.design && lead.issues.design.length > 0 && (
                  <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                    <h4 className="text-xs font-bold text-slate-700 flex items-center gap-2 mb-1.5">
                      <Layout className="w-3.5 h-3.5 text-blue-500" /> Design UI/UX Outlining
                    </h4>
                    <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-600">
                      {lead.issues.design.map((issue, idx) => <li key={idx}>{issue}</li>)}
                    </ul>
                  </div>
                )}

                {/* 2. Mobile */}
                {lead.issues.mobile && lead.issues.mobile.length > 0 && (
                  <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                    <h4 className="text-xs font-bold text-slate-700 flex items-center gap-2 mb-1.5">
                      <Smartphone className="w-3.5 h-3.5 text-indigo-505 text-indigo-600" /> Mobile Accessibility
                    </h4>
                    <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-600">
                      {lead.issues.mobile.map((issue, idx) => <li key={idx}>{issue}</li>)}
                    </ul>
                  </div>
                )}

                {/* 3. SEO */}
                {lead.issues.seo && lead.issues.seo.length > 0 && (
                  <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                    <h4 className="text-xs font-bold text-slate-700 flex items-center gap-2 mb-1.5">
                      <Globe className="w-3.5 h-3.5 text-emerald-600" /> Search Optimization (SEO)
                    </h4>
                    <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-600">
                      {lead.issues.seo.map((issue, idx) => <li key={idx}>{issue}</li>)}
                    </ul>
                  </div>
                )}

                {/* 4. Speed & Performance */}
                {lead.issues.speed && lead.issues.speed.length > 0 && (
                  <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                    <h4 className="text-xs font-bold text-slate-700 flex items-center gap-2 mb-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-500" /> Speed & Performance
                    </h4>
                    <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-600">
                      {lead.issues.speed.map((issue, idx) => <li key={idx}>{issue}</li>)}
                    </ul>
                  </div>
                )}

                {/* 5. Conversions */}
                {lead.issues.conversion && lead.issues.conversion.length > 0 && (
                  <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                    <h4 className="text-xs font-bold text-slate-700 flex items-center gap-2 mb-1.5">
                      <Target className="w-3.5 h-3.5 text-red-500" /> Conversion Funnels
                    </h4>
                    <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-600">
                      {lead.issues.conversion.map((issue, idx) => <li key={idx}>{issue}</li>)}
                    </ul>
                  </div>
                )}

                {/* 6. Trust & Branding if available */}
                {(lead.issues.trust?.length > 0 || lead.issues.branding?.length > 0) && (
                  <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                    <h4 className="text-xs font-bold text-slate-700 flex items-center gap-2 mb-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-teal-600" /> Trust, Authority & Consistency
                    </h4>
                    <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-600">
                      {lead.issues.trust?.map((issue, idx) => <li key={`t-${idx}`}>{issue}</li>)}
                      {lead.issues.branding?.map((issue, idx) => <li key={`b-${idx}`}>{issue}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Right Box: AI OUTREACH ENGINE COPYWRITER */}
            <div className="space-y-4">
              <div className="bg-blue-50/30 border border-blue-100 rounded-xl p-4 space-y-3.5">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-blue-600" /> AI Copywriting Assistant
                  </h3>
                  <p className="text-[10px] text-slate-400">Trained on converted B2B emails</p>
                </div>

                {/* Tone Controller drop-down / select */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-500">Pitch Strategy Tone:</span>
                  <select
                    value={selectedTone}
                    onChange={(e) => setSelectedTone(e.target.value)}
                    className="bg-white border border-slate-200 text-slate-800 py-1 px-2.5 text-[11px] rounded font-bold focus:outline-none cursor-pointer focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Value-First Audit" className="bg-white text-slate-800">Value-First Mini Audit</option>
                    <option value="Direct & ROI-Focused" className="bg-white text-slate-800">Direct & ROI-Focused</option>
                    <option value="Friendly & Conversational" className="bg-white text-slate-800">Friendly & Casual Presentation</option>
                    <option value="Urgent Security & SEO" className="bg-white text-slate-800">Urgent Tech Standards Warning</option>
                  </select>
                </div>

                {/* Custom Website Status & Observations */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <span>Website Status / Focal Problems</span>
                    <span className="text-[9px] text-blue-500 italic normal-case font-semibold">Tuned for AI Copy</span>
                  </div>
                  <textarea
                    rows={3}
                    value={customWebsiteStatus}
                    onChange={(e) => setCustomWebsiteStatus(e.target.value)}
                    placeholder="e.g., Website is down / loading extremely slowly. Incomplete catalog tables on cell phones."
                    className="w-full bg-white border border-slate-205 hover:border-slate-300 text-[11px] text-slate-700 py-1.5 px-2.5 rounded-lg outline-none leading-relaxed focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-sans shadow-inner transition-all resize-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleRewriteOutreach}
                  disabled={isUpdatingCopy}
                  className="w-full py-1.5 bg-white hover:bg-slate-50 text-blue-600 font-bold text-xs border border-blue-200 hover:border-blue-300 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  {isUpdatingCopy ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" /> Drafting customized pitch via Gemini...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-blue-500" /> Re-Draft Outreach ({selectedTone})
                    </>
                  )}
                </button>

                {rewriteError && (
                  <p className="text-[10px] text-rose-700 bg-rose-50 p-2 rounded-lg border border-rose-200">
                    {rewriteError}
                  </p>
                )}
              </div>

              {/* OUTREACH DRAFT PREVIEW & SCRIPT CHANGER */}
              <div className="space-y-3">
                {/* Subject Block */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Subject Line</label>
                    <button
                      type="button"
                      onClick={handleCopySubject}
                      className="text-[10px] text-slate-400 hover:text-blue-600 flex items-center gap-1 transition-all cursor-pointer font-semibold"
                    >
                      {copiedSubject ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      {copiedSubject ? 'Copied' : 'Copy Subject'}
                    </button>
                  </div>
                  <input
                    type="text"
                    className="w-full bg-white border border-slate-205 hover:border-slate-300 text-xs text-slate-800 py-2 px-3 rounded-lg outline-none font-bold focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-inner transition-all"
                    value={subject}
                    onChange={(e) => {
                      setSubject(e.target.value);
                      handleSaveDraft();
                    }}
                    onBlur={handleSaveDraft}
                  />
                </div>

                {/* Body Block */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Email Script Body</label>
                    <button
                      type="button"
                      onClick={handleCopyBody}
                      className="text-[10px] text-slate-400 hover:text-blue-600 flex items-center gap-1 transition-all cursor-pointer font-semibold"
                    >
                      {copiedBody ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      {copiedBody ? 'Copied' : 'Copy Message'}
                    </button>
                  </div>
                  <textarea
                    rows={12}
                    className="w-full bg-white border border-slate-205 hover:border-slate-300 text-xs text-slate-700 py-2 px-3 rounded-lg outline-none leading-relaxed focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-sans shadow-inner transition-all"
                    value={body}
                    onChange={(e) => {
                      setBody(e.target.value);
                      handleSaveDraft();
                    }}
                    onBlur={handleSaveDraft}
                  />
                  <p className="text-[9px] text-slate-400 italic text-right">
                    *Edits are instantly synced with this prospect's CRM profile pipeline.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lead Drawer Lower Action bar */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex gap-3 justify-end shadow-inner">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
          >
            Close Audit
          </button>
          
          <button
            type="button"
            onClick={handleLaunchEmailClient}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-all flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <Mail className="w-4 h-4" /> Send Email via Mail Client
          </button>
        </div>
      </motion.div>
    </>
  );
}
