/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { 
  Send, Zap, Calendar, Play, Pause, Plus, Eye, Sliders, Settings, Mail, 
  TrendingUp, Sparkles, Paperclip, UploadCloud, Globe, DollarSign, 
  AlertCircle, Trash2, Inbox, ArrowRight, ShieldCheck, FileText, 
  Users, Lock, ChevronDown, Check, RefreshCw 
} from 'lucide-react';
import { Campaign, Lead, ConsultantProfile } from '../types';

interface CampaignManagerTabProps {
  campaigns: Campaign[];
  onAddCampaign: (campaign: Campaign) => void;
  onToggleStatus: (id: string) => void;
  isDark: boolean;
  leads?: Lead[];
  consultant?: ConsultantProfile;
}

// Sparkline Component using inline responsive SVG pathing for crisp rendering
interface SparklineProps {
  data: number[];
  color?: string;
  height?: number;
}

function SparklineChart({ data, color = '#10b981', height = 60 }: SparklineProps) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 500;
  
  const points = data.map((val, idx) => {
    const x = (idx / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * (height - 14) - 7;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="w-full h-[60px] mt-2 relative">
      <svg className="w-full h-full" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.2} />
            <stop offset="100%" stopColor={color} stopOpacity={0.0} />
          </linearGradient>
        </defs>
        {/* Fill Area */}
        <polyline
          fill={`url(#grad-${color.replace('#', '')})`}
          stroke="none"
          points={`0,${height} ${points} ${width},${height}`}
        />
        {/* Stroke Line */}
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          points={points}
        />
        {/* Interaction Circles */}
        {data.map((val, idx) => {
          const x = (idx / (data.length - 1)) * width;
          const y = height - ((val - min) / range) * (height - 14) - 7;
          return (
            <circle
              key={idx}
              cx={x}
              cy={y}
              r="4.5"
              fill={color}
              stroke={color === '#10b981' ? '#065f46' : color === '#3b82f6' ? '#1e3a8a' : '#581c87'}
              strokeWidth="1.5"
              className="transition-all duration-200 hover:r-6 cursor-pointer"
            />
          );
        })}
      </svg>
    </div>
  );
}

export default function CampaignManagerTab({
  campaigns,
  onAddCampaign,
  onToggleStatus,
  isDark,
  leads = [],
  consultant
}: CampaignManagerTabProps) {
  // Navigation
  const [activeSubTab, setActiveSubTab] = useState<'dashboard' | 'autopilot' | 'templates'>('dashboard');
  
  // Dashboard states
  const [targetDomain, setTargetDomain] = useState(consultant?.website || 'webnest-two.vercel.app');
  const [dailyBudget, setDailyBudget] = useState(10);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'today' | '7d' | '30d' | 'all'>('7d');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCampName, setNewCampName] = useState('');
  const [newCampSchedule, setNewCampSchedule] = useState('Mon-Fri, 9AM-5PM EST');
  const [toast, setToast] = useState<string | null>(null);

  // Autopilot Engine states
  const [autopilotEnabled, setAutopilotEnabled] = useState(true);
  const [autoRepliesEnabled, setAutoRepliesEnabled] = useState(true);
  const [reviewWindow, setReviewWindow] = useState(2); // hours
  const [ccOnReplies, setCcOnReplies] = useState(false);
  const [bookingLink, setBookingLink] = useState(consultant?.bookingLink || 'https://calendly.com/your-handle');
  const [autopilotRecap, setAutopilotRecap] = useState(true);
  const [dailyDigest, setDailyDigest] = useState(true);
  
  // Materials attachments
  const [materials, setMaterials] = useState<Array<{ id: string; name: string; size: string; status: string }>>([
    { id: '1', name: 'WebNest_B2B_Portfolio.pdf', size: '4.2 MB', status: 'Approved' },
    { id: '2', name: 'Apex_Agency_Intro_Deck.pdf', size: '2.8 MB', status: 'Approved' }
  ]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Email template states
  const [sameTemplate, setSameTemplate] = useState(true);
  const [copyInstructions, setCopyInstructions] = useState(
    'Focus on active small-to-medium businesses needing updates. Keep tone consultative, highlighting their actual design or SEO scores. Offer a short 15-minute diagnostic call.'
  );
  const [templateLanguage, setTemplateLanguage] = useState('en');
  const [sendingDomain, setSendingDomain] = useState<'prewarmed' | 'custom'>('prewarmed');
  const [previewLeadId, setPreviewLeadId] = useState<string>('');
  const [activePreviewTab, setActivePreviewTab] = useState<'first' | 'followup'>('first');

  // Trigger brief alert toasts
  const triggerToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3500);
  };

  // Predefined lists to merge with user's custom ones if empty
  const defaultExpleeCampaigns = [
    { id: 'camp-ex-1', name: 'Local Service Firms', domain: targetDomain, schedule: 'Mon-Fri, 9AM-5PM', sentCount: 12, repliedCount: 0, status: 'Active', rate: '~1 emails/day', spend: 0 },
    { id: 'camp-ex-2', name: 'AI Feature Teams', domain: targetDomain, schedule: 'Mon-Fri, 9AM-5PM', sentCount: 32, repliedCount: 0, status: 'Active', rate: '~5 emails/day', spend: 1 },
    { id: 'camp-ex-3', name: 'Ecommerce Brands', domain: targetDomain, schedule: 'Mon-Fri, 9AM-5PM', sentCount: 64, repliedCount: 0, status: 'Active', rate: '~9 emails/day', spend: 2 },
    { id: 'camp-ex-4', name: 'Education Providers', domain: targetDomain, schedule: 'Mon-Fri, 9AM-5PM', sentCount: 10, repliedCount: 0, status: 'Active', rate: '~1 emails/day', spend: 0 },
    { id: 'camp-ex-5', name: 'SMB SaaS Founders', domain: targetDomain, schedule: 'Mon-Fri, 9AM-5PM', sentCount: 1, repliedCount: 0, status: 'Active', rate: '~1 emails/day', spend: 0 },
    { id: 'camp-ex-6', name: 'Professional Practices', domain: targetDomain, schedule: 'Mon-Fri, 9AM-5PM', sentCount: 16, repliedCount: 0, status: 'Active', rate: '~2 emails/day', spend: 0 }
  ];

  // Dynamic Metrics depending on timeframe
  const metricsData = {
    today: {
      sent: 125,
      sentTrend: '▲ 125 today',
      sentChart: [12, 18, 35, 45, 62, 85, 110, 125],
      replyRate: 0,
      replyTrend: '0 replies',
      replyChart: [0, 0, 0, 0, 0, 0, 0, 0],
      hotLeads: 0,
      hotTrend: 'No replies yet',
      hotChart: [0, 0, 0, 0, 0, 0, 0, 0],
      spend: 4.10,
      spendTrend: '▲ $4.10 today',
      spendChart: [0.4, 0.8, 1.2, 1.8, 2.4, 2.9, 3.4, 4.1]
    },
    '7d': {
      sent: 125,
      sentTrend: '▲ 125 today',
      sentChart: [15, 22, 45, 30, 64, 85, 125],
      replyRate: 0,
      replyTrend: '0% avg reply rate',
      replyChart: [0, 0, 0, 0, 0, 0, 0],
      hotLeads: 0,
      hotTrend: '0 hot leads',
      hotChart: [0, 0, 0, 0, 0, 0, 0],
      spend: 4.00,
      spendTrend: '▲ $4.00 total',
      spendChart: [0.5, 0.8, 1.6, 1.1, 2.3, 3.1, 4.0]
    },
    '30d': {
      sent: 580,
      sentTrend: '▲ 42% vs last month',
      sentChart: [100, 150, 180, 220, 250, 310, 390, 420, 480, 520, 550, 580],
      replyRate: 1.8,
      replyTrend: '1.8% avg reply rate',
      replyChart: [1.2, 1.4, 1.1, 1.6, 1.5, 1.8, 2.0, 1.9, 2.1, 2.3, 2.2, 1.8],
      hotLeads: 8,
      hotTrend: '8 hot leads booked',
      hotChart: [1, 2, 0, 1, 3, 1, 4, 1, 2, 2, 1, 0],
      spend: 21.50,
      spendTrend: '▲ $21.50 spent',
      spendChart: [3.2, 4.8, 5.7, 7.0, 8.0, 9.9, 12.4, 13.4, 15.3, 16.6, 18.5, 21.5]
    },
    all: {
      sent: 1240,
      sentTrend: 'All time active',
      sentChart: [200, 450, 680, 820, 950, 1100, 1240],
      replyRate: 2.1,
      replyTrend: '2.1% avg reply rate',
      replyChart: [1.5, 1.8, 1.9, 2.1, 2.2, 2.3, 2.1],
      hotLeads: 24,
      hotTrend: '24 total hot leads',
      hotChart: [3, 5, 4, 6, 2, 3, 1],
      spend: 45.80,
      spendTrend: 'All-time budget spend',
      spendChart: [10.2, 18.5, 25.4, 31.0, 37.6, 41.2, 45.8]
    }
  };

  const activeMetrics = metricsData[selectedTimeframe];

  // Campaign additions
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampName) return;

    const newCamp: Campaign = {
      id: `camp-${Date.now()}`,
      name: newCampName,
      leadCount: 0,
      status: 'Active',
      templateId: 'temp-custom',
      schedule: newCampSchedule,
      sentCount: 0,
      openedCount: 0,
      clickedCount: 0,
      repliedCount: 0,
      bouncedCount: 0,
      createdAt: new Date().toISOString()
    };

    onAddCampaign(newCamp);
    setNewCampName('');
    setShowAddForm(false);
    triggerToast(`Campaign "${newCampName}" has been successfully initialized on Autopilot!`);
  };

  // Upload simulation
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filesList = e.target.files;
    if (!filesList || filesList.length === 0) return;
    const file = filesList[0];
    
    setUploading(true);
    triggerToast(`Scanning and uploading "${file.name}" to Campaign Materials...`);
    
    setTimeout(() => {
      setUploading(false);
      setMaterials(prev => [
        ...prev,
        {
          id: `file-${Date.now()}`,
          name: file.name,
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          status: 'Approved'
        }
      ]);
      triggerToast(`"${file.name}" has been security cleared & added to Autopilot attachments.`);
    }, 1800);
  };

  const deleteMaterial = (id: string, name: string) => {
    setMaterials(prev => prev.filter(m => m.id !== id));
    triggerToast(`Removed "${name}" from campaign attachments.`);
  };

  // Fallback demo leads for previews if none added yet
  const fallbackLeads: Lead[] = [
    {
      id: 'demo-l-1',
      businessName: 'TellyOn Media',
      industry: 'Digital Cable TV & Media SaaS',
      websiteUrl: 'tellyon.media',
      contactPerson: 'Amit Kamra',
      contactTitle: 'Founder',
      email: 'amit@tellyon.media',
      phone: '+1 555-019-2831',
      whyNewWebsite: 'They are moving a legacy sales force-led business into a digitally driven SaaS platform, but their landing page lacks clear conversions.',
      websiteScore: 4,
      priority: 'Hot',
      status: 'New',
      crmStage: 'New Lead',
      companySize: '11-50 employees',
      issues: {
        design: ['Outdated layout structure', 'Lacks micro-interactions'],
        mobile: ['Text clipping on small displays'],
        seo: ['Missing OpenGraph tags'],
        speed: ['High-resolution image load delays'],
        conversion: ['No prominent sign-up flow on hero page'],
        trust: ['No security badge', 'Insecure form submission'],
        branding: ['Mismatch with product logo colors']
      },
      outreach: { subject: '', body: '' },
      createdAt: new Date().toISOString(),
      budgetPotential: 'High'
    },
    {
      id: 'demo-l-2',
      businessName: 'Apex Dental Care',
      industry: 'Local Healthcare & Dental Clinics',
      websiteUrl: 'apexdental.com',
      contactPerson: 'Dr. Sarah Jenkins',
      contactTitle: 'Practice Owner',
      email: 'sarah@apexdental.com',
      phone: '+1 415-321-4560',
      whyNewWebsite: 'No online booking integration, layout is not responsive, and page speed is slow, causing booking drops.',
      websiteScore: 5,
      priority: 'Hot',
      status: 'New',
      crmStage: 'New Lead',
      companySize: '1-10 employees',
      issues: {
        design: ['Dense layouts', 'Cluttered sidebars'],
        mobile: ['Hamburger menu fails to trigger on iOS'],
        seo: ['Missing schema markup'],
        speed: ['Slow server response'],
        conversion: ['No direct booking widget'],
        trust: ['Expired SSL certificate'],
        branding: ['Low contrast links']
      },
      outreach: { subject: '', body: '' },
      createdAt: new Date().toISOString(),
      budgetPotential: 'Medium'
    }
  ];

  const activeLeads = leads.length > 0 ? leads : fallbackLeads;
  
  // Set first lead as default preview
  React.useEffect(() => {
    if (activeLeads.length > 0 && !previewLeadId) {
      setPreviewLeadId(activeLeads[0].id);
    }
  }, [activeLeads, previewLeadId]);

  const selectedPreviewLead = activeLeads.find(l => l.id === previewLeadId) || activeLeads[0];

  // Template email body builder with dynamic parameters
  const generateEmailDraft = (lead: Lead, isFollowUp: boolean) => {
    const pName = lead.contactPerson ? lead.contactPerson.split(' ')[0] : 'there';
    const bizName = lead.businessName;
    const score = lead.websiteScore || 4;
    const website = lead.websiteUrl;
    
    // Custom values for TellyOn Media or others
    const customIndustryDetail = lead.id.includes('demo-l-1') || lead.businessName.toLowerCase().includes('tellyon')
      ? 'is building a SaaS platform for the digital cable TV industry, and that you are moving a legacy sales force-led business into a digitally driven model.'
      : `operates in the ${lead.industry.toLowerCase()} sector, and looks like a prominent business in your market.`;

    const customWebImprovement = lead.id.includes('demo-l-1') || lead.businessName.toLowerCase().includes('tellyon')
      ? 'use a sharper product landing page and stronger lead capture setup. I can map out 3 concrete improvements for your site in 15 minutes, or I will leave you with the outline free.'
      : `use an optimized, high-speed mobile layout with an integrated appointment system to capture more leads. I've noted that your current site speed and layout score sits around ${score}/10.`;

    if (!isFollowUp) {
      return {
        subject: `${bizName} x ${consultant?.company || 'WebNest Digital'}`,
        body: `Hi ${pName},\n\nI saw ${bizName} ${customIndustryDetail} For a founder-led business, the website usually has to do a lot of heavy lifting to build trust and turn visitors into demos.\n\nI'm ${consultant?.name || 'Grant'} from ${consultant?.company || 'WebNest Digital Studio'}. I help businesses build modern websites that make their product value clearer and capture more qualified interest.\n\nI think ${bizName} could ${customWebImprovement}\n\nOpen to a short reply and I'll send the outline?\n\nBest,\n${consultant?.name || 'Grant'}`
      };
    } else {
      return {
        subject: `Re: ${bizName} x ${consultant?.company || 'WebNest Digital'}`,
        body: `Hi ${pName},\n\nI wanted to follow up briefly on my previous email. I know you're busy running ${bizName}.\n\nI've drafted a quick wireframe audit of ${website} showing how a modernized hero section and faster load speeds could increase conversion by up to 25%.\n\nWould you be open to a quick look? You can book a time directly on my calendar here: ${bookingLink}\n\nThanks,\n${consultant?.name || 'Grant'}`
      };
    }
  };

  const previewEmail = selectedPreviewLead ? generateEmailDraft(selectedPreviewLead, activePreviewTab === 'followup') : { subject: '', body: '' };

  return (
    <div className="space-y-6">
      {/* EXPLEE NAVIGATION & SUBTABS HEADER */}
      <div className={`p-4 rounded-xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-500">
            <Zap className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className={`text-base font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              AutoGTM Campaign Engine
            </h2>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Autopilot outbound SDR targeting and personalized client generation.
            </p>
          </div>
        </div>

        {/* Sub-tabs buttons */}
        <div className={`p-1 rounded-xl flex gap-1 ${isDark ? 'bg-slate-950' : 'bg-slate-100'}`}>
          <button
            onClick={() => setActiveSubTab('dashboard')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'dashboard'
                ? (isDark ? 'bg-slate-800 text-emerald-400 shadow-sm' : 'bg-white text-emerald-600 shadow-sm')
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            Overview Dashboard
          </button>
          <button
            onClick={() => setActiveSubTab('autopilot')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'autopilot'
                ? (isDark ? 'bg-slate-800 text-emerald-400 shadow-sm' : 'bg-white text-emerald-600 shadow-sm')
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            AI Autopilot
          </button>
          <button
            onClick={() => setActiveSubTab('templates')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'templates'
                ? (isDark ? 'bg-slate-800 text-emerald-400 shadow-sm' : 'bg-white text-emerald-600 shadow-sm')
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            Email Templates
          </button>
        </div>
      </div>

      {/* -------------------- 1. OVERVIEW DASHBOARD TAB -------------------- */}
      {activeSubTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Header notification widget: Add calendar link */}
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/20 text-amber-500 rounded-lg">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <p className={`text-xs font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  Add your calendar link — <span className="text-amber-500 font-bold">hot leads ask "when can we talk?"</span> and you currently have nothing to send.
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Connect Calendly or tidy up routing to close agency clients on autopilot.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setActiveSubTab('autopilot');
                triggerToast("Scrolled to booking links in Autopilot configuration.");
              }}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs rounded-lg transition-colors cursor-pointer shrink-0"
            >
              Add Link
            </button>
          </div>

          {/* Budget & Target Node Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Target Domain Config */}
            <div className={`p-5 rounded-xl border flex flex-col justify-between ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5" /> Active Sending Domain
                </label>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Outreach SDR mailboxes will be pre-configured and authenticated under this web domain context.
                </p>
              </div>
              <div className="mt-4 flex gap-2">
                <input
                  type="text"
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs outline-none focus:ring-1 border font-mono ${
                    isDark
                      ? 'bg-slate-950 border-slate-800 focus:border-emerald-500 focus:ring-emerald-500/20 text-white'
                      : 'bg-white border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/10 text-slate-800'
                  }`}
                  value={targetDomain}
                  onChange={(e) => setTargetDomain(e.target.value)}
                  placeholder="e.g. youragency.com"
                />
                <button 
                  onClick={() => triggerToast(`Sending domain context updated to ${targetDomain}. SPF/DKIM validation active.`)}
                  className="px-3 py-1.5 bg-slate-850 dark:bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-lg transition-all"
                >
                  Verify
                </button>
              </div>
            </div>

            {/* Daily Budget Slider */}
            <div className={`p-5 rounded-xl border lg:col-span-2 flex flex-col justify-between ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className={`text-xs font-black flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    <DollarSign className="w-4 h-4 text-emerald-500" /> Daily Budget
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Spread across your active outreach campaigns automatically.
                  </p>
                </div>
                <div className="text-right">
                  <span className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    ${dailyBudget} <span className="text-xs text-slate-500 font-normal">/ day</span>
                  </span>
                  <p className="text-[10px] text-emerald-500 font-bold flex items-center gap-1 justify-end">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    ${(dailyBudget * 0.378).toFixed(2)} spent today
                  </p>
                </div>
              </div>

              {/* Slider track */}
              <div className="mt-4 space-y-2">
                <input
                  type="range"
                  min="5"
                  max="150"
                  step="5"
                  className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  value={dailyBudget}
                  onChange={(e) => setDailyBudget(Number(e.target.value))}
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>Min: $5/day</span>
                  <span>Max: $150/day</span>
                </div>
              </div>

              <div className="flex justify-end mt-2">
                <button
                  onClick={() => triggerToast(`Daily budget limit successfully adjusted to $${dailyBudget}/day.`)}
                  className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Save Budget
                </button>
              </div>
            </div>
          </div>

          {/* CAMPAIGNS LIST WITH FULL METRICS */}
          <div className={`p-5 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
              <div>
                <h3 className={`text-xs font-black uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Campaign Pipelines ({defaultExpleeCampaigns.length + campaigns.length})
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Active pre-warmed AI SDR instances running automated sequences.
                </p>
              </div>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> New Campaign
              </button>
            </div>

            {/* Campaign Form popup */}
            {showAddForm && (
              <div className={`p-4 rounded-xl border mb-5 animate-slideDown ${
                isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h4 className={`text-[11px] uppercase font-black tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Deploy New AI Outreach Sequence
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Sequence Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Restaurant Booking Leads"
                        className={`w-full py-1.5 px-3 rounded-lg text-xs outline-none focus:ring-1 border ${
                          isDark
                            ? 'bg-slate-900 border-slate-800 focus:border-emerald-500 focus:ring-emerald-500/20 text-white'
                            : 'bg-white border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/10 text-slate-800'
                        }`}
                        value={newCampName}
                        onChange={(e) => setNewCampName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Schedule delivery window</label>
                      <input
                        type="text"
                        required
                        className={`w-full py-1.5 px-3 rounded-lg text-xs outline-none focus:ring-1 border ${
                          isDark
                            ? 'bg-slate-900 border-slate-800 focus:border-emerald-500 focus:ring-emerald-500/20 text-white'
                            : 'bg-white border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/10 text-slate-800'
                        }`}
                        value={newCampSchedule}
                        onChange={(e) => setNewCampSchedule(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-lg shadow"
                    >
                      Launch Sequence
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Campaign Table Grid */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] uppercase text-slate-400 font-black tracking-wider">
                    <th className="pb-3 pt-1 pl-2">Status</th>
                    <th className="pb-3 pt-1">Campaign</th>
                    <th className="pb-3 pt-1 text-center">Sent</th>
                    <th className="pb-3 pt-1 text-center">Reply Rate</th>
                    <th className="pb-3 pt-1 text-center">Hot Leads</th>
                    <th className="pb-3 pt-1 text-center">Cost / Lead</th>
                    <th className="pb-3 pt-1 text-center">Spent</th>
                    <th className="pb-3 pt-1 pr-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {/* Render newly added campaigns if any */}
                  {campaigns.map((camp) => (
                    <tr key={camp.id} className="text-xs hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all">
                      <td className="py-3 pl-2">
                        <span className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${camp.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                          <span className="font-extrabold text-[11px] text-slate-400 uppercase">{camp.status}</span>
                        </span>
                      </td>
                      <td className="py-3">
                        <div>
                          <p className={`font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{camp.name}</p>
                          <p className="text-[10px] text-slate-500 font-mono">{targetDomain} · ~{camp.leadCount || 1} emails/day</p>
                        </div>
                      </td>
                      <td className="py-3 text-center font-bold font-mono text-slate-400">{camp.sentCount}</td>
                      <td className="py-3 text-center font-bold font-mono text-slate-400">0%</td>
                      <td className="py-3 text-center font-bold font-mono text-slate-400">{camp.repliedCount}</td>
                      <td className="py-3 text-center font-bold font-mono text-slate-500">—</td>
                      <td className="py-3 text-center font-bold font-mono text-slate-400">${camp.sentCount * 0.03}</td>
                      <td className="py-3 pr-2 text-right">
                        <button
                          onClick={() => {
                            onToggleStatus(camp.id);
                            triggerToast(`Toggled campaign "${camp.name}" execution status.`);
                          }}
                          className={`px-2 py-1 rounded text-[10px] font-extrabold transition-all border ${
                            camp.status === 'Active'
                              ? 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                              : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                          }`}
                        >
                          {camp.status === 'Active' ? 'Pause' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}

                  {/* Render standard default Explee AutoGTM campaigns */}
                  {defaultExpleeCampaigns.map((camp) => (
                    <tr key={camp.id} className="text-xs hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all">
                      <td className="py-3 pl-2">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="font-extrabold text-[11px] text-slate-400 uppercase">Active</span>
                        </span>
                      </td>
                      <td className="py-3">
                        <div>
                          <p className={`font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{camp.name}</p>
                          <p className="text-[10px] text-slate-500 font-mono">{camp.domain} · {camp.rate}</p>
                        </div>
                      </td>
                      <td className="py-3 text-center font-bold font-mono text-slate-400">{camp.sentCount}</td>
                      <td className="py-3 text-center font-bold font-mono text-slate-400">0%</td>
                      <td className="py-3 text-center font-bold font-mono text-slate-400">0</td>
                      <td className="py-3 text-center font-bold font-mono text-slate-500">—</td>
                      <td className="py-3 text-center font-bold font-mono text-slate-400">${camp.spend}</td>
                      <td className="py-3 pr-2 text-right">
                        <button
                          onClick={() => triggerToast(`Standard campaign "${camp.name}" status updated on server.`)}
                          className="px-2 py-1 rounded text-[10px] font-extrabold transition-all border bg-amber-500/10 border-amber-500/20 text-amber-500"
                        >
                          Pause
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-slate-100 dark:border-slate-800 text-xs font-black">
                    <td className="py-3 pl-2 uppercase text-slate-400 text-[10px]">TOTAL</td>
                    <td className="py-3 text-slate-400">{defaultExpleeCampaigns.length + campaigns.length} of {defaultExpleeCampaigns.length + campaigns.length} running</td>
                    <td className="py-3 text-center font-mono">125</td>
                    <td className="py-3 text-center font-mono">0% <span className="text-[10px] text-slate-500 font-normal">(0)</span></td>
                    <td className="py-3 text-center font-mono">0</td>
                    <td className="py-3 text-center font-mono text-slate-500">—</td>
                    <td className="py-3 text-center font-mono">$4</td>
                    <td className="py-3 pr-2 text-right">—</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* 4 BENTO CARDS - PERFORMANCE ANALYTICS */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className={`text-xs font-black uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Performance Metrics
                </h3>
                <p className="text-[11px] text-slate-500">
                  Analytics compiled across active outbound agents.
                </p>
              </div>

              {/* Timeframe selector */}
              <div className={`p-0.5 rounded-lg flex gap-0.5 ${isDark ? 'bg-slate-950' : 'bg-slate-100'}`}>
                {(['today', '7d', '30d', 'all'] as const).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setSelectedTimeframe(tf)}
                    className={`px-2 py-1 text-[10px] font-black uppercase rounded-md transition-all cursor-pointer ${
                      selectedTimeframe === tf
                        ? (isDark ? 'bg-slate-800 text-emerald-400' : 'bg-white text-emerald-600 shadow-sm')
                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Emails Sent */}
              <div className={`p-4 rounded-xl border flex flex-col justify-between ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Emails Sent</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {activeMetrics.sent}
                    </span>
                    <span className="text-[10px] text-emerald-500 font-bold flex items-center">
                      {activeMetrics.sentTrend}
                    </span>
                  </div>
                </div>
                <SparklineChart data={activeMetrics.sentChart} color="#3b82f6" />
              </div>

              {/* Card 2: Reply Rate */}
              <div className={`p-4 rounded-xl border flex flex-col justify-between ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Reply Rate</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {activeMetrics.replyRate}%
                    </span>
                    <span className="text-[10px] text-slate-500 font-bold">
                      {activeMetrics.replyTrend}
                    </span>
                  </div>
                </div>
                <SparklineChart data={activeMetrics.replyChart} color="#10b981" />
              </div>

              {/* Card 3: Hot Leads */}
              <div className={`p-4 rounded-xl border flex flex-col justify-between ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Hot Leads</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {activeMetrics.hotLeads}
                    </span>
                    <span className="text-[10px] text-amber-500 font-bold">
                      {activeMetrics.hotTrend}
                    </span>
                  </div>
                </div>
                <SparklineChart data={activeMetrics.hotChart} color="#f59e0b" />
              </div>

              {/* Card 4: Spend */}
              <div className={`p-4 rounded-xl border flex flex-col justify-between ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Spend</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      ${activeMetrics.spend.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-emerald-500 font-bold">
                      {activeMetrics.spendTrend}
                    </span>
                  </div>
                </div>
                <SparklineChart data={activeMetrics.spendChart} color="#a855f7" />
              </div>
            </div>
          </div>

          {/* LAST REPLIES FEED */}
          <div className={`p-5 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="flex justify-between items-center mb-3">
              <h4 className={`text-xs font-black uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Last Replies
              </h4>
              <button 
                onClick={() => triggerToast("Outbox is currently active. Waiting for replies.")}
                className="text-[11px] text-emerald-500 hover:underline font-bold"
              >
                View inbox →
              </button>
            </div>
            <div className={`py-8 text-center rounded-lg border border-dashed ${
              isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <Inbox className="w-8 h-8 text-slate-500 mx-auto mb-2" />
              <p className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>No replies yet.</p>
              <p className="text-[10px] text-slate-500 mt-0.5">As soon as prospects reply, they will populate here and halt the sequence autopilot.</p>
            </div>
          </div>

          {/* DAILY BREAKDOWN HISTORIC TABLE */}
          <div className={`p-5 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <h4 className={`text-xs font-black uppercase tracking-wider mb-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Daily Breakdown
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs min-w-[600px]">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] uppercase text-slate-400 font-black tracking-wider">
                    <th className="pb-2.5">Day</th>
                    <th className="pb-2.5 text-center">Emails Sent</th>
                    <th className="pb-2.5 text-center">Reply Rate</th>
                    <th className="pb-2.5 text-center">Hot Leads</th>
                    <th className="pb-2.5 text-center">Engaged</th>
                    <th className="pb-2.5 text-center">Spend</th>
                    <th className="pb-2.5 text-right">Cost / Lead</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 text-[11px] font-mono text-slate-400">
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-2.5 font-sans font-black text-slate-700 dark:text-slate-300">Today · Fri, Jun 26</td>
                    <td className="py-2.5 text-center">125</td>
                    <td className="py-2.5 text-center">0%</td>
                    <td className="py-2.5 text-center">0</td>
                    <td className="py-2.5 text-center">0 (0%)</td>
                    <td className="py-2.5 text-center">$4</td>
                    <td className="py-2.5 text-right font-sans text-slate-500">—</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-2.5 font-sans text-slate-500">Thu, Jun 25</td>
                    <td className="py-2.5 text-center">0</td>
                    <td className="py-2.5 text-center">0%</td>
                    <td className="py-2.5 text-center">0</td>
                    <td className="py-2.5 text-center">0 (0%)</td>
                    <td className="py-2.5 text-center">$0</td>
                    <td className="py-2.5 text-right font-sans text-slate-500">—</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-2.5 font-sans text-slate-500">Wed, Jun 24</td>
                    <td className="py-2.5 text-center">0</td>
                    <td className="py-2.5 text-center">0%</td>
                    <td className="py-2.5 text-center">0</td>
                    <td className="py-2.5 text-center">0 (0%)</td>
                    <td className="py-2.5 text-center">$0</td>
                    <td className="py-2.5 text-right font-sans text-slate-500">—</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-2.5 font-sans text-slate-500">Tue, Jun 23</td>
                    <td className="py-2.5 text-center">0</td>
                    <td className="py-2.5 text-center">0%</td>
                    <td className="py-2.5 text-center">0</td>
                    <td className="py-2.5 text-center">0 (0%)</td>
                    <td className="py-2.5 text-center">$0</td>
                    <td className="py-2.5 text-right font-sans text-slate-500">—</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-2.5 font-sans text-slate-500">Mon, Jun 22</td>
                    <td className="py-2.5 text-center">0</td>
                    <td className="py-2.5 text-center">0%</td>
                    <td className="py-2.5 text-center">0</td>
                    <td className="py-2.5 text-center">0 (0%)</td>
                    <td className="py-2.5 text-center">$0</td>
                    <td className="py-2.5 text-right font-sans text-slate-500">—</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-2.5 font-sans text-slate-500">Sun, Jun 21</td>
                    <td className="py-2.5 text-center">0</td>
                    <td className="py-2.5 text-center">0%</td>
                    <td className="py-2.5 text-center">0</td>
                    <td className="py-2.5 text-center">0 (0%)</td>
                    <td className="py-2.5 text-center">$0</td>
                    <td className="py-2.5 text-right font-sans text-slate-500">—</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-2.5 font-sans text-slate-500">Sat, Jun 20</td>
                    <td className="py-2.5 text-center">0</td>
                    <td className="py-2.5 text-center">0%</td>
                    <td className="py-2.5 text-center">0</td>
                    <td className="py-2.5 text-center">0 (0%)</td>
                    <td className="py-2.5 text-center">$0</td>
                    <td className="py-2.5 text-right font-sans text-slate-500">—</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="border-t border-slate-100 dark:border-slate-800 font-black text-slate-700 dark:text-white">
                    <td className="py-3">Total · 7d</td>
                    <td className="py-3 text-center">125</td>
                    <td className="py-3 text-center">0% <span className="text-[10px] text-slate-500 font-normal">avg · 0 replied</span></td>
                    <td className="py-3 text-center">0</td>
                    <td className="py-3 text-center">0 (0%)</td>
                    <td className="py-3 text-center">$4</td>
                    <td className="py-3 text-right text-slate-500">—</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}


      {/* -------------------- 2. AI AUTOPILOT ENGINE TAB -------------------- */}
      {activeSubTab === 'autopilot' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Col: Autopilot switches configuration */}
            <div className="lg:col-span-2 space-y-6">
              {/* Card A: Autopilot Switch */}
              <div className={`p-5 rounded-xl border relative overflow-hidden ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
              }`}>
                {/* Glowing subtle gradient background */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

                <div className="flex justify-between items-start">
                  <div className="space-y-1 pr-6">
                    <div className="flex items-center gap-2">
                      <h4 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Autopilot</h4>
                      <div className="p-1 bg-slate-100 dark:bg-slate-950 text-slate-500 rounded text-[9px] font-mono">
                        Help
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Reads what's working and what isn't, then generates new campaign hypotheses to test — more conversions at a lower cost per lead.
                    </p>
                    <div className="pt-2 flex items-center gap-1.5 text-[10px] text-emerald-500 font-extrabold uppercase">
                      <Sparkles className="w-3.5 h-3.5" />
                      Runs on our trained models + Claude Opus 4.8 / Gemini Flash
                    </div>
                  </div>

                  {/* Switch button */}
                  <button
                    onClick={() => {
                      setAutopilotEnabled(!autopilotEnabled);
                      triggerToast(autopilotEnabled ? "Outbound Autopilot model paused." : "Outbound Autopilot model armed & running.");
                    }}
                    className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 cursor-pointer focus:outline-none ${
                      autopilotEnabled ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-800'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ${
                      autopilotEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              </div>

              {/* Card B: Auto-replies Switch */}
              <div className={`p-5 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <div className="flex justify-between items-start">
                  <div className="space-y-1 pr-6 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Auto-replies</h4>
                      <div className="p-1 bg-slate-100 dark:bg-slate-950 text-slate-500 rounded text-[9px] font-mono">
                        Help
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Drafts a reply to every hot lead, then holds it for a review window so you can review, edit, or cancel it before it sends. The average company takes 42h to even respond.
                    </p>
                    <p className="text-[10px] text-slate-400 italic">
                      As soon as a real person on your side replies in a thread — you, or anyone you've Cc'd — auto-replies stop there and the conversation is yours.
                    </p>
                  </div>

                  {/* Switch button */}
                  <button
                    onClick={() => {
                      setAutoRepliesEnabled(!autoRepliesEnabled);
                      triggerToast(autoRepliesEnabled ? "AI auto-responder suspended." : "AI auto-responder armed with safety review hold.");
                    }}
                    className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 cursor-pointer focus:outline-none ${
                      autoRepliesEnabled ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-800'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ${
                      autoRepliesEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                {/* Review Window Slider */}
                {autoRepliesEnabled && (
                  <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-800 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-slate-500">Review Window</span>
                      <span className="px-2 py-0.5 bg-emerald-500/15 text-emerald-500 rounded-md font-extrabold text-[11px]">
                        {reviewWindow === 0 ? 'Instant' : `${reviewWindow}h`}
                      </span>
                    </div>
                    
                    <input
                      type="range"
                      min="0"
                      max="24"
                      step="1"
                      className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      value={reviewWindow}
                      onChange={(e) => setReviewWindow(Number(e.target.value))}
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>Instant</span>
                      <span>1h</span>
                      <span>2h</span>
                      <span>4h</span>
                      <span>24h</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Card C: CC on every reply */}
              <div className={`p-5 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <div className="flex justify-between items-center">
                  <div className="space-y-1 pr-6">
                    <h4 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>CC on every reply</h4>
                    <p className="text-xs text-slate-500 leading-normal">
                      Every reply we send to a hot lead is also Cc'd to <span className="font-mono text-emerald-500 font-semibold">{consultant?.email || 'omnivexllc@gmail.com'}</span>.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setCcOnReplies(!ccOnReplies);
                      triggerToast(ccOnReplies ? "CC sync disabled." : `Carbon copy sync active on ${consultant?.email || 'omnivexllc@gmail.com'}`);
                    }}
                    className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 cursor-pointer focus:outline-none ${
                      ccOnReplies ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-800'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ${
                      ccOnReplies ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              </div>

              {/* Card D: Booking Link */}
              <div className={`p-5 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-emerald-500" />
                    <h4 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Booking Link</h4>
                  </div>
                  <p className="text-xs text-slate-500">
                    Where the agent routes positive replies. Hot clients who show calendar interest will be served this link to schedule instantly.
                  </p>
                  
                  <div className="flex gap-2 pt-2">
                    <input
                      type="text"
                      className={`flex-1 py-1.5 px-3 rounded-lg text-xs outline-none focus:ring-1 border ${
                        isDark
                          ? 'bg-slate-950 border-slate-800 focus:border-emerald-500 focus:ring-emerald-500/20 text-white'
                          : 'bg-white border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/10 text-slate-800'
                      }`}
                      value={bookingLink}
                      onChange={(e) => setBookingLink(e.target.value)}
                      placeholder="e.g. https://calendly.com/your-username"
                    />
                    <button
                      onClick={() => triggerToast(`Consulting booking link updated to ${bookingLink}`)}
                      className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-lg transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>

              {/* Card E: Notifications */}
              <div className={`p-5 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <div className="space-y-4">
                  <h4 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Notifications</h4>
                  <p className="text-xs text-slate-500">
                    The decisions that matter, with no real-time noise.
                  </p>

                  <div className="space-y-3 pt-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className={`text-xs font-black ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Autopilot recap</p>
                        <p className="text-[10px] text-slate-500">A once-daily email of what Autopilot changed and why.</p>
                      </div>
                      <button
                        onClick={() => setAutopilotRecap(!autopilotRecap)}
                        className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                          autopilotRecap ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-800'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${
                          autopilotRecap ? 'translate-x-4' : 'translate-x-0'
                        }`} />
                      </button>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-800/60">
                      <div>
                        <p className={`text-xs font-black ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Daily digest</p>
                        <p className="text-[10px] text-slate-500">A daily summary of everything across your active outreach campaigns.</p>
                      </div>
                      <button
                        onClick={() => setDailyDigest(!dailyDigest)}
                        className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                          dailyDigest ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-800'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${
                          dailyDigest ? 'translate-x-4' : 'translate-x-0'
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Col: Campaign Materials upload zone */}
            <div className="space-y-6">
              <div className={`p-5 rounded-xl border flex flex-col justify-between h-full ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
              }`}>
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Paperclip className="w-4 h-4 text-emerald-500" />
                    <h4 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Materials</h4>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">
                    Files the AI Autopilot can attach to replies and follow-ups. Describe each so the agent knows exactly when and to whom to send them.
                  </p>

                  {/* Drop zone box */}
                  <div
                    onClick={handleUploadClick}
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all hover:bg-slate-50/50 dark:hover:bg-slate-950/20 ${
                      uploading ? 'border-amber-500 bg-amber-500/5' : 'border-slate-300 dark:border-slate-800'
                    }`}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,image/*"
                    />
                    
                    {uploading ? (
                      <div className="space-y-2 animate-pulse">
                        <RefreshCw className="w-8 h-8 text-amber-500 mx-auto animate-spin" />
                        <p className="text-xs font-black text-amber-500">Security checking file...</p>
                        <p className="text-[10px] text-slate-500">Passing threat prevention parameters</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <UploadCloud className="w-8 h-8 text-slate-400 mx-auto" />
                        <p className={`text-xs font-black ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                          Drop files here <span className="font-normal text-slate-500">or click to browse</span>
                        </p>
                        <p className="text-[9px] text-slate-500">
                          PDF, Word, PowerPoint, Excel, Text, Images — max 25 MB
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Uploaded Materials List */}
                  <div className="mt-6 space-y-3">
                    <h5 className="text-[10px] uppercase font-black tracking-wider text-slate-400">
                      Uploaded Documents ({materials.length})
                    </h5>

                    {materials.map((mat) => (
                      <div
                        key={mat.id}
                        className={`p-3 rounded-lg border flex items-center justify-between gap-3 text-xs ${
                          isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText className="w-4 h-4 text-emerald-500 shrink-0" />
                          <div className="min-w-0">
                            <p className={`font-bold truncate ${isDark ? 'text-white' : 'text-slate-800'}`}>{mat.name}</p>
                            <p className="text-[9px] text-slate-500">{mat.size} · {mat.status}</p>
                          </div>
                        </div>

                        <button
                          onClick={() => deleteMaterial(mat.id, mat.name)}
                          className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md text-red-500 shrink-0 cursor-pointer"
                          title="Remove document"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}

                    {materials.length === 0 && (
                      <p className="text-center text-[11px] text-slate-500 italic py-4">
                        No materials uploaded yet. Upload PDFs or case studies to empower your AI agent's outreach.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* -------------------- 3. EMAIL TEMPLATES & PREVIEW TAB -------------------- */}
      {activeSubTab === 'templates' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left: Template Instructions configuration */}
            <div className={`p-5 rounded-xl border space-y-4 ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800/60">
                <Sliders className="w-4 h-4 text-emerald-500" />
                <h4 className={`text-xs font-black uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Template Directives
                </h4>
              </div>

              {/* Checkbox template rule */}
              <label className="flex items-start gap-2.5 cursor-pointer py-1">
                <input
                  type="checkbox"
                  className="mt-1 w-3.5 h-3.5 rounded accent-emerald-500"
                  checked={sameTemplate}
                  onChange={(e) => setSameTemplate(e.target.checked)}
                />
                <div className="text-xs">
                  <p className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Use the same template for every campaign</p>
                  <p className="text-[10px] text-slate-500">Enable static consistency across all SDR pipelines.</p>
                </div>
              </label>

              {/* Textarea instructions */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Email Copy Instructions
                </label>
                <textarea
                  rows={4}
                  className={`w-full p-2.5 rounded-lg text-xs outline-none focus:ring-1 border leading-relaxed ${
                    isDark
                      ? 'bg-slate-950 border-slate-800 focus:border-emerald-500 focus:ring-emerald-500/20 text-white'
                      : 'bg-white border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/10 text-slate-800'
                  }`}
                  value={copyInstructions}
                  onChange={(e) => setCopyInstructions(e.target.value)}
                  placeholder="Optional — we'll blend these instructions with our proven cold-outreach best practices."
                />
                <p className="text-[10px] text-slate-500">
                  Instruction set version 1 · Updated just now
                </p>
              </div>

              {/* Language Dropdown */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Language Context
                </label>
                <select
                  value={templateLanguage}
                  onChange={(e) => {
                    setTemplateLanguage(e.target.value);
                    triggerToast(`SDR Outreach language model locked to ${e.target.value.toUpperCase()}`);
                  }}
                  className={`w-full py-1.5 px-3 rounded-lg text-xs outline-none focus:ring-1 border ${
                    isDark
                      ? 'bg-slate-950 border-slate-800 focus:border-emerald-500 text-white'
                      : 'bg-white border-slate-200 focus:border-emerald-500 text-slate-800'
                  }`}
                >
                  <option value="en">🇺🇸 Auto · English</option>
                  <option value="es">🇪🇸 Spanish</option>
                  <option value="fr">🇫🇷 French</option>
                  <option value="de">🇩🇪 German</option>
                  <option value="it">🇮🇹 Italian</option>
                </select>
              </div>

              {/* From Name */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-slate-500" /> From Name
                </label>
                <input
                  type="text"
                  disabled
                  value="Names from our pre-warmed mailboxes"
                  className={`w-full py-1.5 px-3 rounded-lg text-xs border bg-slate-100 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-500 italic`}
                />
                <p className="text-[9px] text-slate-500 leading-normal">
                  Sent from our pre-warmed mailboxes, each with its own sender name so campaigns start within ~5 min of launch. Names vary; custom ones are coming soon.
                </p>
              </div>

              {/* Sending Domain Toggle */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Sending Domain Pool
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setSendingDomain('prewarmed')}
                    className={`py-1.5 px-3 rounded-lg font-bold border text-center transition-all cursor-pointer ${
                      sendingDomain === 'prewarmed'
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-500'
                        : 'border-slate-200 dark:border-slate-800 text-slate-500'
                    }`}
                  >
                    Pre-warmed pool
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSendingDomain('custom');
                      triggerToast("Custom domain pooling is currently locked. Upgrade to Enterprise to unlock.");
                    }}
                    className={`py-1.5 px-3 rounded-lg font-bold border text-center transition-all cursor-pointer flex items-center justify-center gap-1 ${
                      sendingDomain === 'custom'
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-500'
                        : 'border-slate-200 dark:border-slate-800 text-slate-500 opacity-60'
                    }`}
                  >
                    Custom domains
                    <span className="text-[8px] bg-slate-200 dark:bg-slate-850 px-1 py-0.5 rounded text-slate-500">Soon</span>
                  </button>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => triggerToast("Outreach generation model synchronized.")}
                  className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-lg text-center"
                >
                  Preview Model
                </button>
                <button
                  type="button"
                  onClick={() => triggerToast("Copy instructions saved and applied globally across 6 campaigns.")}
                  className="flex-1 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-lg text-center"
                >
                  Save for all campaigns
                </button>
              </div>
            </div>

            {/* Right: Dynamic Email Preview thread */}
            <div className={`lg:col-span-2 p-5 rounded-xl border flex flex-col justify-between ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/60">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-emerald-500" />
                    <h4 className={`text-xs font-black uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      Dynamic Copy Preview
                    </h4>
                  </div>

                  {/* Recipient lead selector */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">To prospect:</span>
                    <div className="relative">
                      <select
                        value={previewLeadId}
                        onChange={(e) => setPreviewLeadId(e.target.value)}
                        className={`py-1 pr-8 pl-2.5 text-xs font-black rounded border cursor-pointer outline-none ${
                          isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-850'
                        }`}
                      >
                        {activeLeads.map(l => (
                          <option key={l.id} value={l.id}>{l.businessName}</option>
                        ))}
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2 top-1.5 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* First Email vs Follow up toggle tabs */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setActivePreviewTab('first')}
                    className={`px-3 py-1 text-xs font-black rounded-lg border transition-all cursor-pointer ${
                      activePreviewTab === 'first'
                        ? 'bg-slate-800 border-slate-700 text-emerald-400'
                        : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                  >
                    First email
                  </button>
                  <button
                    onClick={() => setActivePreviewTab('followup')}
                    className={`px-3 py-1 text-xs font-black rounded-lg border transition-all cursor-pointer ${
                      activePreviewTab === 'followup'
                        ? 'bg-slate-800 border-slate-700 text-emerald-400'
                        : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                  >
                    Follow-up sequence
                  </button>
                </div>

                {/* Email Envelope Box */}
                <div className={`p-4 rounded-xl border font-sans space-y-3 ${
                  isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-250 text-slate-800'
                }`}>
                  {/* From info */}
                  <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-900 pb-2 text-xs">
                    <span className="text-slate-500 font-bold w-12 text-right">From:</span>
                    <span className="font-bold flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                      📬 Grant <span className="text-slate-500 font-normal">&lt;grant@{targetDomain}&gt;</span>
                    </span>
                  </div>

                  {/* To info */}
                  <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-900 pb-2 text-xs">
                    <span className="text-slate-500 font-bold w-12 text-right">To:</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      👤 {selectedPreviewLead?.contactPerson || 'Prospect Founder'} <span className="text-slate-500 font-normal">&lt;{selectedPreviewLead?.email || 'contact@domain.com'}&gt;</span>
                    </span>
                  </div>

                  {/* Subject */}
                  <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-900 pb-2 text-xs">
                    <span className="text-slate-500 font-bold w-12 text-right">Subject:</span>
                    <span className={`font-black uppercase text-[11px] ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {previewEmail.subject}
                    </span>
                  </div>

                  {/* Body text area with highlight overlays */}
                  <div className="pt-2 text-xs leading-relaxed space-y-3 font-normal font-sans">
                    {previewEmail.body.split('\n\n').map((paragraph, pIdx) => {
                      return (
                        <p key={pIdx}>
                          {paragraph.split(/(\[.*?\]|https:\/\/.*?|calendly\.com\/.*?\b)/g).map((chunk, cIdx) => {
                            if (chunk.startsWith('http') || chunk.includes('calendly.com')) {
                              return <span key={cIdx} className="text-emerald-500 font-bold underline cursor-pointer">{chunk}</span>;
                            }
                            
                            // Highlight custom variables
                            if (
                              chunk.includes('TellyOn Media') || 
                              chunk.includes('Apex Dental Care') || 
                              chunk.includes('Amit') || 
                              chunk.includes('Sarah') ||
                              chunk.includes('landing page') ||
                              chunk.includes('3 concrete improvements') ||
                              chunk.includes('online booking') ||
                              chunk.includes('integrated appointment')
                            ) {
                              return (
                                <span key={cIdx} className="bg-emerald-500/10 text-emerald-400 px-1 py-0.5 rounded font-medium">
                                  {chunk}
                                </span>
                              );
                            }
                            return chunk;
                          })}
                        </p>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Tips block */}
              <div className="mt-4 p-3 bg-emerald-500/5 rounded-lg border border-emerald-500/10 flex items-start gap-2 text-[10px]">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-slate-500 leading-normal">
                  <span className="font-bold text-emerald-500 uppercase">AI SDR tip:</span> This outreach email was synthesized using the targets' direct website health analysis. If you audit new targets under <span className="font-bold">"Prospect Finder"</span> or <span className="font-bold">"Website Analyzer"</span>, they will automatically sync as dynamic variables in this sequence draft.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION FLOATER */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-950 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-800 flex items-center gap-2 animate-fadeIn text-xs font-bold">
          <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast}</span>
          <button onClick={() => setToast(null)} className="ml-2 text-slate-500 hover:text-white cursor-pointer font-sans">✕</button>
        </div>
      )}
    </div>
  );
}
