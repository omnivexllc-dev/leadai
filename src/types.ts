/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PriorityLevel = 'Hot' | 'Warm' | 'Cold';
export type LeadStatus = 'New' | 'Outreached' | 'Interested' | 'Meeting' | 'Closed';

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

export interface Lead {
  id: string;
  businessName: string;
  industry: string;
  websiteUrl: string;
  contactPerson?: string;
  contactTitle?: string;
  email: string;
  phone: string;
  linkedinUrl?: string;
  companySize: string;
  whyNewWebsite: string;
  websiteScore: number; // 1 to 10
  budgetPotential: string; // e.g. "$4,000 - $6,500"
  priority: PriorityLevel;
  status: LeadStatus;
  issues: WebsiteIssues;
  outreach: OutreachDraft;
  createdAt: string;
}

export interface SearchConfig {
  location: string;
  industry: string;
  additionalNotes?: string;
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
}
