/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Lead, ConsultantProfile, Campaign, TeamMember, ActivityLog, Notification, Proposal, SubscriptionPlan } from './types';

export const INITIAL_CONSULTANT_PROFILE: ConsultantProfile = {
  name: 'Alex Vance',
  company: 'Apex B2B Strategies',
  title: 'Lead Growth Advisor & Digital Architect',
  email: 'alex@apexb2bstrategies.com',
  phone: '+1 (512) 555-8831',
  website: 'www.apexb2bstrategies.com',
  bookingLink: 'calendly.com/apex-b2b/strategy-session'
};

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'plan-starter',
    name: 'Starter',
    price: 49,
    period: 'month',
    features: [
      '500 leads/month search limit',
      'Basic Website Analyzer (10 scans/mo)',
      '1 Active Cold Outreach Campaign',
      'AI Email Generator (Standard)',
      'Single User Access',
      'Email Support'
    ],
    leadLimit: 500
  },
  {
    id: 'plan-growth',
    name: 'Growth',
    price: 99,
    period: 'month',
    features: [
      '5,000 leads/month search limit',
      'Unlimited Website Analyzer scans',
      '5 Active Campaigns',
      'Decision Maker Finder (100 credits/mo)',
      'AI Research Agent (Warm angles)',
      '3 Team Collaboration Seats',
      'Priority Email & Chat Support'
    ],
    leadLimit: 5000,
    isPopular: true
  },
  {
    id: 'plan-agency',
    name: 'Agency',
    price: 249,
    period: 'month',
    features: [
      '25,000 leads/month search limit',
      'Unlimited Analyzer & Research Agents',
      'Unlimited Sending Campaigns',
      'Full Decision Maker Finder (1000/mo)',
      'White-label AI Proposals (PDF exports)',
      '10 Team Collaboration Seats',
      'Dedicated Account Manager',
      'Stripe / HubSpot CRM syncing'
    ],
    leadLimit: 25000
  },
  {
    id: 'plan-enterprise',
    name: 'Enterprise',
    price: 599,
    period: 'month',
    features: [
      'Unlimited leads search & export',
      'Custom AI Agent crawling models',
      'Unlimited active sending campaigns',
      'Dedicated API endpoint integrations',
      'Unlimited Team Collaboration Seats',
      'Enterprise SLA & 24/7 Phone Support',
      'Custom Contract Billing options'
    ],
    leadLimit: 999999
  }
];

export const DEMO_LEADS: Lead[] = [
  {
    id: 'demo-lead-1',
    businessName: 'Horizon Dental Studio',
    industry: 'Dental Clinics',
    websiteUrl: 'https://www.horizondentalcaremiami.com',
    contactPerson: 'Dr. Marcus Sterling',
    contactTitle: 'Lead Practitioner & Co-Founder',
    email: 'msterling@horizondentalmiami.com',
    emailStatus: 'Valid',
    emailConfidence: 98,
    phone: '+1 (305) 555-0143',
    linkedinUrl: 'linkedin.com/in/dr-marcus-sterling-miami',
    companySize: '12-18 employees',
    revenueEstimate: '$1.2M - $1.8M',
    whyNewWebsite: 'High-traffic practice experiencing patient drop-offs because of an outdated, non-responsive registration page. The schedule appointment form breaks completely on iPhone viewports and doesn\'t load secure HTTPS.',
    websiteScore: 3,
    budgetPotential: '$5,500 - $8,000',
    priority: 'Hot',
    status: 'New',
    crmStage: 'New Lead',
    websiteMetrics: {
      overall: 35,
      mobile: 20,
      seo: 45,
      performance: 30,
      security: 10,
      design: 40,
      detectedIssues: {
        ssl: true,
        slowSpeed: true,
        poorMobile: true,
        outdatedDesign: true,
        missingSeo: false,
        missingForms: false
      }
    },
    research: {
      overview: 'Horizon Dental Studio is an established general and cosmetic dental clinic in Miami, FL. They have exceptional patient reviews on Yelp/Google but suffer from severe digital friction that prevents seamless online acquisitions.',
      services: ['Cosmic Whitening', 'Invisalign Alignment', 'Emergency Root Canals', 'Dental Veneers'],
      painPoints: [
        'Missing secure SSL certificate leading to scary browser warnings for security-conscious patients.',
        'Online appointment scheduler form is completely broken on iOS/Android viewports.',
        'Mobile navigation menu collapses into overlapping text layers.'
      ],
      salesAngle: 'Focus on patient safety (SSL upgrade) and mobile convenience (frictionless 3-step booking calendar) to double online appointment generation rates without spending more on ads.'
    },
    decisionMakers: [
      { name: 'Dr. Marcus Sterling', title: 'Co-Founder & Lead Dentist', linkedinUrl: 'linkedin.com/in/dr-marcus-sterling-miami', email: 'msterling@horizondentalmiami.com', confidence: 95 },
      { name: 'Sarah Jenkins', title: 'Clinic Operations Manager', linkedinUrl: 'linkedin.com/in/sarah-jenkins-operations-miami', email: 'sjenkins@horizondentalmiami.com', confidence: 88 }
    ],
    issues: {
      design: [
        'Uses outdated mid-2000s structural tables with unreadable white-on-light-blue contrast.',
        'Stale stock images of dentists that do not match the real interior studio decor.',
        'Extremely cluttered layout containing overlapping banners and blocks.'
      ],
      mobile: [
        'Registration forms clip completely out of bounds on mobile screens.',
        'Tiny navigation links requiring multiple taps of the thumb is highly frustrating.'
      ],
      seo: [
        'Zero Google Maps local business schema or meta indexing matches.',
        'Fails keyword relevance for premium tags such as "Miami Cosmetic Dentistry".'
      ],
      speed: [
        'Loads uncompressed high-resolution banners causing 6.2s Time To Interactive (TTI) on 4G.'
      ],
      conversion: [
        'No sticky header call-to-action button for "Book Appointment".',
        'Emergency dentist contact hotline is buried inside a legal footnote PDF link.'
      ],
      trust: [
        'Copyright footer lists the copyright of 2017, suggesting an inactive practitioner.',
        'Missing secure SSL padlock, prompting browsers to warn patients that the site is insecure.'
      ],
      branding: [
        'Brand logo is pixelated, and typefaces mismatch across pages (Arial, Comic Sans, Times New Roman).'
      ]
    },
    outreach: {
      subject: 'Quick UX issue on Horizon Dental Studio (And how Dr. Sterling can solve it)',
      body: `Hi Dr. Sterling,

I came across Horizon Dental Studio while researching top cosmetic clinics in Miami, FL. Your patient reviews are stellar, but your website (www.horizondentalcaremiami.com) is currently holding back new signups.

Specifically, I ran a quick mobile audit and noticed that your registration forms clip completely out of bounds on iPhones. Patients are likely dropping out simply because they cannot request a slot on their phone. Additionally, the browser reports a "Not Secure" warning of SSL flags.

Updating this layout could easily double your online bookings. At Apex B2B Strategies, we design patient-converting, fully mobile-adapted portals.

I've put together a quick, free 5-minute mockup of how your mobile booking flow could look. Do you have a few minutes this week to review it?

Best regards,

Alex Vance
Lead Growth Advisor & Digital Architect
Apex B2B Strategies
Phone: +1 (512) 555-8831
Schedule a 15-min call: calendly.com/apex-b2b/strategy-session`
    },
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(), // 1 day ago
    notes: [
      { id: 'n1', content: 'Discovered via local Google maps. Very high potential for complete design overhaul.', createdAt: new Date(Date.now() - 23 * 3600 * 1000).toISOString(), author: 'Alex Vance' }
    ],
    tasks: [
      { id: 't1', title: 'Send first custom cold email via Campaign Manager', dueDate: new Date(Date.now() + 24 * 3600 * 1000).toISOString().split('T')[0], completed: false }
    ]
  },
  {
    id: 'demo-lead-2',
    businessName: 'Mercer & Associates Counsel',
    industry: 'Law Firms',
    websiteUrl: 'https://www.mercerlegalgrouptexas.com',
    contactPerson: 'Victoria Mercer, Esq.',
    contactTitle: 'Senior Managing Partner',
    email: 'vmercer@mercerlegaltexas.com',
    emailStatus: 'Valid',
    emailConfidence: 96,
    phone: '+1 (512) 555-0811',
    linkedinUrl: 'linkedin.com/in/victoria-mercer-texaslaw',
    companySize: '8 legal associates',
    revenueEstimate: '$2.5M - $4.0M',
    whyNewWebsite: 'A highly credible regional litigation partnership. They recently expanded their practice areas to Intellectual Property, but the website is completely static with missing sub-pages, outdated profiles, and no call scheduling integration.',
    websiteScore: 4,
    budgetPotential: '$8,500 - $12,000',
    priority: 'Hot',
    status: 'New',
    crmStage: 'New Lead',
    websiteMetrics: {
      overall: 42,
      mobile: 35,
      seo: 50,
      performance: 48,
      security: 70,
      design: 25,
      detectedIssues: {
        ssl: false,
        slowSpeed: true,
        poorMobile: true,
        outdatedDesign: true,
        missingSeo: true,
        missingForms: true
      }
    },
    research: {
      overview: 'Mercer & Associates Counsel is a high-ticket regional law firm based in Austin, TX. While highly professional in courtroom settings, their digital presence is trapped in a 2012 boxed table layout, making them look small and uncompetitive to large enterprise clients.',
      services: ['Corporate Litigation', 'Intellectual Property Filings', 'Contract Governance'],
      painPoints: [
        'Website does not stretch to full width on modern monitors, looking obsolete.',
        'No direct booking/scheduler tool, causing intake coordinators to drop phone consultations.',
        'Extremely dense legal jargon block paragraphs with zero helpful visual summaries.'
      ],
      salesAngle: 'Focus on corporate prestige, authority building, and automated consult intake scheduling. Target their new IP practice with high-authority service landing pages.'
    },
    decisionMakers: [
      { name: 'Victoria Mercer, Esq.', title: 'Senior Managing Partner', linkedinUrl: 'linkedin.com/in/victoria-mercer-texaslaw', email: 'vmercer@mercerlegaltexas.com', confidence: 99 },
      { name: 'Robert Vance', title: 'Legal Counsel Co-Owner', linkedinUrl: 'linkedin.com/in/robert-vance-law', email: 'rvance@mercerlegaltexas.com', confidence: 92 }
    ],
    issues: {
      design: [
        'Tears apart on wide 1080p+ desktop viewports, feeling like a tiny narrow box.',
        'High body typography fatigue; uses microscopic gray serif paragraphs which are unreadable.'
      ],
      mobile: [
        'Navigation header bar is completely absent on narrow mobile viewport breakpoints.'
      ],
      seo: [
        'No structured schema markup for law firms, making them invisible in local pack search filters.',
        'Empty Alt text attributes on all team portrait image elements.'
      ],
      speed: [
        'Poor server response times exceeding 2.3 seconds for initial paint.'
      ],
      conversion: [
        'No direct scheduling widgets, and contact forms have 12 mandatory fields leading to high user friction.'
      ],
      trust: [
        'Lists obsolete address details from their old Houston suite location, confusing local clients.'
      ],
      branding: [
        'Uses inconsistent legal branding guidelines, conflicting with their premium corporate rebrand.'
      ]
    },
    outreach: {
      subject: 'Outdated Texas Law presence limit: Mercer & Associates Counsel',
      body: `Hi Victoria,

I was reviewing regional litigation listings in Austin, TX, and saw Mercer & Associates is expanding in Intellectual Property law. Congratulations on the growth!

I wanted to point out a few details on your website (www.mercerlegalgrouptexas.com) that might be undercutting the firm's credibility with premium corporate clients. 

The site currently lacks standard schema indexing for Texas firms, meaning you may be losing case volume to smaller practices. Furthermore, the desktop design is locked in a narrow layout that breaks on standard monitors.

Corporate legal buyers expect modern, clean, authoritative portals that easily demonstrate lawyer portfolios and integrate instant contact channels.

At Apex B2B Strategies, we help leading legal firms upgrade their digital presence to match their professional reputation. We estimate a modern mobile-optimized site could increase consult requests by 35%.

Would you be open to a brief chat to see standard redesign benchmarks for high-converting firms?

Warm regards,

Alex Vance
Lead Growth Advisor & Digital Architect
Apex B2B Strategies
Phone: +1 (512) 555-8831
Calendly: calendly.com/apex-b2b/strategy-session`
    },
    createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(), // 1.5 days ago
    notes: [
      { id: 'n2', content: 'Met Robert at local chamber event. He mentioned wanting to revamp their site before Q4.', createdAt: new Date(Date.now() - 35 * 3600 * 1000).toISOString(), author: 'Alex Vance' }
    ]
  },
  {
    id: 'demo-lead-3',
    businessName: 'The Rustic Fork Bistro',
    industry: 'Restaurants',
    websiteUrl: 'https://www.therusticforkbostoneats.com',
    contactPerson: 'Chef Jean-Luc Dubois',
    contactTitle: 'Executive Chef & Owner',
    email: 'jldubois@therusticforkboston.com',
    emailStatus: 'Risky',
    emailConfidence: 65,
    phone: '+1 (617) 555-4921',
    companySize: '24 staff',
    revenueEstimate: '$600K - $1.0M',
    whyNewWebsite: 'Popular local restaurant where foodies are frustrated because the lunch/dinner menus are served solely as raw, heavy PDF downloads that are unreadable on mobile phones. Also lacks an integrated tables booking connector.',
    websiteScore: 5,
    budgetPotential: '$4,000 - $6,000',
    priority: 'Warm',
    status: 'Interested',
    crmStage: 'Qualified',
    websiteMetrics: {
      overall: 54,
      mobile: 30,
      seo: 40,
      performance: 55,
      security: 90,
      design: 60,
      detectedIssues: {
        ssl: false,
        slowSpeed: true,
        poorMobile: true,
        outdatedDesign: false,
        missingSeo: true,
        missingForms: true
      }
    },
    research: {
      overview: 'The Rustic Fork Bistro is a highly rated organic French-American restaurant in Boston. They get huge organic social buzz but suffer from online customer dropoffs due to heavy menu PDFs and lack of online reservation.',
      services: ['Catering Services', 'Private Parties', 'Fine Dining Dine-In'],
      painPoints: [
        'Menu is an 8MB raw PDF file, completely unreadable and unsearchable on mobile cellular data.',
        'No direct booking widget, forces telephone calls during peak service rushes.'
      ],
      salesAngle: 'Integrate a direct OpenTable/Resy API widget and display high-speed, interactive text menus on their site to grow mobile conversions by 40%.'
    },
    decisionMakers: [
      { name: 'Chef Jean-Luc Dubois', title: 'Executive Chef & Owner', linkedinUrl: 'linkedin.com/in/chef-jean-luc-boston', email: 'jldubois@therusticforkboston.com', confidence: 95 }
    ],
    issues: {
      design: [
        'Lacks basic culinary visual energy; is styled as a dull slate layout without mouthwatering plating photos.',
        'Over-saturated backgrounds clash with the text layout.'
      ],
      mobile: [
        'Menu cannot be read on mobile without zooming into a raw 8MB PDF file.',
        'Opening hours block maps underneath overlapping pictures.'
      ],
      seo: [
        'Zero crawlable menu texts on the site, limiting local Google index searches like "Best Bistro near Boston Common".'
      ],
      speed: [
        'The unoptimized raw PDF menu on home page locks up client mobile browsers for up to 8 seconds.'
      ],
      conversion: [
        'Booking tables requires dialing a telephone line during busy lunch hours, creating reservation backlogs.'
      ],
      trust: [
        'Old reviews and obsolete sanitization alerts from 2020 are still highlighted on the front page.'
      ],
      branding: [
        'Visuals match a fast-food diner instead of an elegant, high-end organic bistro.'
      ]
    },
    outreach: {
      subject: 'Converting Boston foodies: The Rustic Fork Menu Issue',
      body: `Bonjour Chef Jean-Luc,

Your dishes at The Rustic Fork are legendary in Boston, but your current website (www.therusticforkbostoneats.com) is unfortunately turning hungry customers away.

I tried reviewing your bistro menu on my smartphone last night and noticed it requires downloading an 8MB raw PDF file. Most mobile diners will click away immediately instead of waiting for a file download on cellular data. Additionally, search engines like Google cannot read text inside PDFs, limiting your local bistro discovery.

Over 70% of restaurant customers now check menus on their phones before ordering. 

We specialize in designing mouthwatering, fast-loading, mobile-friendly menus that allow customers to view your dishes in real-time text and instantly reserve a table with one click.

I've sketched a simple web menu mock for The Rustic Fork. May I drop you a line or email you the screenshot for feedback?

With respect,

Alex Vance
Lead Growth Advisor & Digital Architect
Apex B2B Strategies
Direct: +1 (512) 555-8831
Join my schedule: calendly.com/apex-b2b/strategy-session`
    },
    createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString()
  }
];

export const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: 'camp-1',
    name: 'Dentists Premium Mobile Schedulers',
    leadCount: 24,
    status: 'Active',
    templateId: 'temp-1',
    schedule: 'Mon-Fri, 9AM-5PM EST',
    sentCount: 18,
    openedCount: 14,
    clickedCount: 8,
    repliedCount: 3,
    bouncedCount: 0,
    createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: 'camp-2',
    name: 'Law Firm Trust & Schema Overhauls',
    leadCount: 12,
    status: 'Paused',
    templateId: 'temp-2',
    schedule: 'Tue-Thu, 10AM-4PM CST',
    sentCount: 12,
    openedCount: 9,
    clickedCount: 4,
    repliedCount: 1,
    bouncedCount: 1,
    createdAt: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: 'camp-3',
    name: 'Bistro Live Menus Launch',
    leadCount: 45,
    status: 'Draft',
    templateId: 'temp-3',
    schedule: 'Daily, 11AM-3PM EST',
    sentCount: 0,
    openedCount: 0,
    clickedCount: 0,
    repliedCount: 0,
    bouncedCount: 0,
    createdAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString()
  }
];

export const INITIAL_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'team-1',
    name: 'Alex Vance',
    email: 'alex@apexb2bstrategies.com',
    role: 'Agency Owner',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&fit=crop&q=80',
    status: 'Active',
    joinedAt: '2025-01-10T12:00:00Z'
  },
  {
    id: 'team-2',
    name: 'Marcus Brody',
    email: 'marcus@apexb2bstrategies.com',
    role: 'Sales Team Member',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&fit=crop&q=80',
    status: 'Active',
    joinedAt: '2025-04-15T09:30:00Z'
  },
  {
    id: 'team-3',
    name: 'Lina Dupont',
    email: 'lina@apexb2bstrategies.com',
    role: 'Admin',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&fit=crop&q=80',
    status: 'Active',
    joinedAt: '2025-02-20T14:45:00Z'
  }
];

export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'log-1',
    userId: 'team-1',
    userName: 'Alex Vance',
    action: 'Discovered high-potential lead',
    target: 'Horizon Dental Studio',
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    type: 'lead'
  },
  {
    id: 'log-2',
    userId: 'team-2',
    userName: 'Marcus Brody',
    action: 'Updated sales pipeline stage to Interested',
    target: 'The Rustic Fork Bistro',
    createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    type: 'crm'
  },
  {
    id: 'log-3',
    userId: 'team-1',
    userName: 'Alex Vance',
    action: 'Launched outreach campaign',
    target: 'Dentists Premium Mobile Schedulers',
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    type: 'campaign'
  },
  {
    id: 'log-4',
    userId: 'team-3',
    userName: 'Lina Dupont',
    action: 'Renewed Growth SaaS subscription',
    target: 'Apex B2B Strategies Core Account',
    createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    type: 'billing'
  }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    title: 'New Campaign Reply Recieved',
    message: 'Dr. Marcus Sterling (Horizon Dental Studio) replied: "Yes, I would love to see the mobile calendar mock next Tuesday."',
    type: 'reply',
    read: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString() // 30 mins ago
  },
  {
    id: 'notif-2',
    title: 'Email Found & Verified',
    message: 'Found senior decision maker for Mercer & Associates Counsel with 96% verification confidence.',
    type: 'lead',
    read: false,
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
  },
  {
    id: 'notif-3',
    title: 'Campaign 80% Completed',
    message: '"Dentists Premium Mobile Schedulers" has successfully outreached 18 targets with 22% reply rate.',
    type: 'campaign',
    read: true,
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
  }
];

export const INITIAL_PROPOSALS: Proposal[] = [
  {
    id: 'prop-1',
    leadId: 'demo-lead-1',
    leadName: 'Horizon Dental Studio',
    title: 'Elite Patient-Converting Portal Redesign Proposal',
    coverStyle: 'Modern',
    problemsFound: [
      'Lack of valid SSL/HTTPS protocol displays scary security warnings to patient traffic.',
      'Mobile appointment booking forms clip out of view on iPhones.',
      'Extremely slow page speed metrics (6.2s load) causing prospective patients to bounce.'
    ],
    recommendations: [
      'Provision secure Cloudflare SSL layer with automatic HTTPS forwarding.',
      'Implement fully-responsive Tailwind booking modules with integrated Calendly APIs.',
      'Optimize media assets and minify CSS/JS files to reduce load speed under 1.5 seconds.'
    ],
    pricing: [
      { item: 'Modern Mobile-First Clinical UX Design & SSL Integration', price: 2800 },
      { item: 'Frictionless Patient Intake and Scheduler API Integration', price: 1200 },
      { item: 'SEO Structural Foundation & Google Business Setup', price: 800 }
    ],
    timeline: '3 Weeks from Kickoff',
    callToAction: 'Schedule a brief Zoom preview or secure the proposal with a 50% deposit below.',
    createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString()
  }
];
