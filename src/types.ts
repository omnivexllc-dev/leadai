/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PriorityLevel = 'Hot' | 'Warm' | 'Cold';
export type LeadStatus = 'New' | 'Outreached' | 'Interested' | 'Meeting' | 'Closed';
export type CRMStage = 'New Lead' | 'Contacted' | 'Qualified' | 'Proposal Sent' | 'Won' | 'Lost';
export type UserRole = 'Admin' | 'Agency Owner' | 'Sales Team Member' | 'Freelancer';
export type OutreachChannel = 'Cold Email' | 'Follow-Up' | 'LinkedIn' | 'WhatsApp';
export type EmailStatus = 'Valid' | 'Risky' | 'Invalid';

export interface WebsiteIssues {
  design: string[];
  mobile: string[];
  seo: string[];
  speed: string[];
  conversion: string[];
  trust: string[];
  branding: string[];
}

export interface OutreachDraft {
  subject: string;
  body: string;
}

export interface DecisionMaker {
  name: string;
  title: string;
  linkedinUrl: string;
  email: string;
  confidence: number; // 0 to 100
}

export interface BusinessResearch {
  overview: string;
  services: string[];
  painPoints: string[];
  salesAngle: string;
}

export interface WebsiteMetrics {
  overall: number;
  mobile: number;
  seo: number;
  performance: number;
  security: number;
  design: number;
  detectedIssues: {
    ssl: boolean;
    slowSpeed: boolean;
    poorMobile: boolean;
    outdatedDesign: boolean;
    missingSeo: boolean;
    missingForms: boolean;
  };
}

export interface Lead {
  id: string;
  businessName: string;
  industry: string;
  websiteUrl: string;
  contactPerson?: string;
  contactTitle?: string;
  email: string;
  emailStatus?: EmailStatus;
  emailConfidence?: number;
  phone: string;
  linkedinUrl?: string;
  companySize: string;
  whyNewWebsite: string;
  revenueEstimate?: string;
  websiteScore: number; // 1 to 10
  budgetPotential: string;
  priority: PriorityLevel;
  status: LeadStatus;
  crmStage: CRMStage;
  issues: WebsiteIssues;
  outreach: OutreachDraft;
  outreachVariations?: { [key in OutreachChannel]?: OutreachDraft[] };
  decisionMakers?: DecisionMaker[];
  research?: BusinessResearch;
  websiteMetrics?: WebsiteMetrics;
  createdAt: string;
  notes?: CRMNote[];
  tasks?: CRMTask[];
}

export interface CRMNote {
  id: string;
  content: string;
  createdAt: string;
  author: string;
}

export interface CRMTask {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
  assignedTo?: string;
}

export interface SearchConfig {
  location: string;
  industry: string;
  additionalNotes?: string;
  revenueRange?: string;
  employeeCount?: string;
  techUsed?: string;
  minScore?: number;
}

export interface ConsultantProfile {
  name: string;
  company: string;
  title: string;
  email: string;
  phone: string;
  website: string;
  bookingLink: string;
}

export interface PipelineStats {
  totalLeads: number;
  averageScore: number;
  hotLeads: number;
  totalEstimatedValue: number;
  emailsSent: number;
  replyRate: number;
  openRate: number;
  meetingsBooked: number;
}

export interface Campaign {
  id: string;
  name: string;
  leadCount: number;
  status: 'Draft' | 'Active' | 'Paused' | 'Completed';
  templateId: string;
  schedule: string; // e.g. "Mon-Fri, 9AM-5PM"
  sentCount: number;
  openedCount: number;
  clickedCount: number;
  repliedCount: number;
  bouncedCount: number;
  createdAt: string;
}

export interface CampaignTemplate {
  id: string;
  name: string;
  channel: OutreachChannel;
  subject: string;
  body: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  status: 'Active' | 'Invited' | 'Suspended';
  joinedAt: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string; // e.g. "Discovered lead"
  target: string; // e.g. "Horizon Dental Studio"
  createdAt: string;
  type: 'lead' | 'campaign' | 'team' | 'crm' | 'billing';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'reply' | 'lead' | 'campaign' | 'activity';
  read: boolean;
  createdAt: string;
}

export interface ProposalSection {
  title: string;
  content: string;
}

export interface Proposal {
  id: string;
  leadId: string;
  leadName: string;
  title: string;
  coverStyle: 'Classic' | 'Modern' | 'Minimalist';
  problemsFound: string[];
  recommendations: string[];
  pricing: { item: string; price: number }[];
  timeline: string;
  callToAction: string;
  createdAt: string;
}

export interface SubscriptionPlan {
  id: string;
  name: 'Starter' | 'Growth' | 'Agency' | 'Enterprise';
  price: number;
  period: 'month' | 'year';
  features: string[];
  leadLimit: number;
  isPopular?: boolean;
}
