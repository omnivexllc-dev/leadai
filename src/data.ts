/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Lead, ConsultantProfile } from './types';

export const INITIAL_CONSULTANT_PROFILE: ConsultantProfile = {
  name: 'Alex Vance',
  company: 'Apex B2B Strategies',
  title: 'Lead Growth Advisor & Digital Architect',
  email: 'alex@apexb2bstrategies.com',
  phone: '+1 (512) 555-8831',
  website: 'www.apexb2bstrategies.com',
  bookingLink: 'calendly.com/apex-b2b/strategy-session'
};

export const DEMO_LEADS: Lead[] = [
  {
    id: 'demo-lead-1',
    businessName: 'Horizon Dental Studio',
    industry: 'Dental Clinics',
    websiteUrl: 'https://www.horizondentalcaremiami.com',
    contactPerson: 'Dr. Marcus Sterling',
    contactTitle: 'Lead Practitioner & Co-Founder',
    email: 'msterling@horizondentalmiami.com',
    phone: '+1 (305) 555-0143',
    linkedinUrl: 'linkedin.com/in/dr-marcus-sterling-miami',
    companySize: '12-18 team members',
    whyNewWebsite: 'High-traffic practice experiencing patient drop-offs because of an outdated, non-responsive registration page. The schedule appointment form breaks completely on iPhone viewports and doesn\'t load secure HTTPS.',
    websiteScore: 3,
    budgetPotential: '$5,500 - $8,000',
    priority: 'Hot',
    status: 'New',
    issues: {
      design: [
        'Uses outdated mid-2000s structural tables with unreadable white-on-light-blue contrast.',
        'Stale stock images of dentists that do not match the real interior studio decor.',
        'Extremely cluttered layout containing overlapping banners and blocks.'
      ],
      mobile: [
        'Registration forms clip completely out of bounds on mobile screens.',
        'Tiny navigation links requiring multiple taps of the thumb is highly frustating.'
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
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString() // 1 day ago
  },
  {
    id: 'demo-lead-2',
    businessName: 'Mercer & Associates Counsel',
    industry: 'Law Firms',
    websiteUrl: 'https://www.mercerlegalgrouptexas.com',
    contactPerson: 'Victoria Mercer, Esq.',
    contactTitle: 'Senior Managing Partner',
    email: 'vmercer@mercerlegaltexas.com',
    phone: '+1 (512) 555-0811',
    linkedinUrl: 'linkedin.com/in/victoria-mercer-texaslaw',
    companySize: '8 legal associates',
    whyNewWebsite: 'A highly credible regional litigation partnership. They recently expanded their practice areas to Intellectual Property, but the website is completely static with missing sub-pages, outdated profiles, and no call scheduling integration.',
    websiteScore: 4,
    budgetPotential: '$8,500 - $12,000',
    priority: 'Hot',
    status: 'New',
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
    createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString() // 1.5 days ago
  },
  {
    id: 'demo-lead-3',
    businessName: 'The Rustic Fork Bistro',
    industry: 'Restaurants',
    websiteUrl: 'https://www.therusticforkbostoneats.com',
    contactPerson: 'Chef Jean-Luc Dubois',
    contactTitle: 'Executive Chef & Owner',
    email: 'jldubois@therusticforkboston.com',
    phone: '+1 (617) 555-4921',
    companySize: '24 hospitality staff',
    whyNewWebsite: 'Popular local restaurant where foodies are frustrated because the lunch/dinner menus are served solely as raw, heavy PDF downloads that are unreadable on mobile phones. Also lacks an integrated tables booking connector.',
    websiteScore: 5,
    budgetPotential: '$4,000 - $6,000',
    priority: 'Warm',
    status: 'Interested',
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

I tried reviewing your bistro menu on my smartphone last night and noticed it requires downloading an 8MB raw PDF file. Most mobile dinners will click away immediately instead of waiting for a file download on cellular data. Additionally, search engines like Google cannot read text inside PDFs, limiting your local bistro discovery.

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
  },
  {
    id: 'lead-scored-1',
    businessName: 'Vanguard Logistics Corp',
    industry: 'Freight & Logistics',
    websiteUrl: 'https://www.vanguardlogisticsgulf.com',
    contactPerson: 'William Harrison',
    contactTitle: 'Operations Director',
    email: 'wharrison@vanguardlogisticsgulf.com',
    phone: '+1 (713) 555-0192',
    linkedinUrl: 'linkedin.com/in/william-harrison-vanguard',
    companySize: '45-60 staff members',
    whyNewWebsite: 'Outdated table-based layout built in 2011 with broken asset tags and inactive Adobe Flash. Forms are completely unresponsive and fail to collect quote queries securely on mobile. Fails local SEO completely.',
    websiteScore: 2, // Website Quality Score (1-10)
    budgetPotential: '$14,000 - $18,500',
    priority: 'Hot', // Scored 14/14: Outdatedness=5, Mobile=3, SEO=3, Industry=3 (Total=14)
    status: 'New',
    issues: {
      design: [
        'Outdated industrial layout reminiscent of early 2011.',
        'Uses heavy unstyled container sidebars causing severe content overcrowding.',
        'Extremely low contrast grids making text difficult to scan on modern screens.'
      ],
      mobile: [
        'Non-responsive layout requires wide physical zooming on modern viewports.',
        'Lead submission form elements clip entirely outside screen margins.'
      ],
      seo: [
        'Fails basic local keyword indexing for Houston and Gulf Coast transport logs.',
        'No mobile-adapted meta-queries or search optimization tags anywhere.'
      ],
      speed: [
        'Heavy uncompressed truck inventory images lead to an 8.5-second load delay.'
      ],
      conversion: [
        'Quote request sheets are completely hidden on cell phones.',
        'Primary hotline is a static text element without click-to-dial links.'
      ],
      trust: [
        'Missing standard SSL certificate warning visitors of an insecure connection.',
        'Copyright footer is stuck on 2011, signaling potential commercial inactivity.'
      ],
      branding: [
        'Company logo is distorted and matches an old corporate logo footprint.'
      ]
    },
    outreach: {
      subject: 'Mobilizing Vanguard Logistics Corp: Redesign Lead Pipeline',
      body: `Hi William,

I was auditing B2B transportation partners along the Gulf Coast and came across Vanguard Logistics Corp. While your fleet and operations are expansive, your online portal (www.vanguardlogisticsgulf.com) does not match the size and scale of your business.

Specifically, I drafted a quick review of your site and flagged three issues that are leaking valuable commercial quote requests:
- **No Mobile Adaptability**: The page requires physical double-pinching to read on phones, and the quote application forms clip completely out of bounds.
- **Zero Local Search Indexing**: Missing modern header hierarchies and local structured schema, leaving you invisible under major logistics queries.
- **Vulnerable Trust Padlock**: The page triggers browser "Not Secure" flags, which can turn away premium enterprise logistics brokers.

A clean, modern, mobile-friendly custom portal with quick-quote calculator widgets could save your operations team hours of manual email back-and-forth and multiply inbound leads.

At Apex B2B Strategies, we build high-converting web portals for mid-market logistics and supply chain providers.

Would you be open to a direct 5-minute preview of a modern, secure operations dashboard mockup we sketched for Vanguard?

Best regards,

Alex Vance
Lead Growth Advisor & Digital Architect
Apex B2B Strategies
Direct: +1 (512) 555-8831
Schedule Session: calendly.com/apex-b2b/strategy-session`
    },
    createdAt: new Date().toISOString()
  },
  {
    id: 'lead-scored-2',
    businessName: 'Oakridge Veterinary Guild',
    industry: 'Healthcare & Veterinary',
    websiteUrl: 'https://www.oakridgevetguild.com',
    contactPerson: 'Dr. Evelyn Ross',
    contactTitle: 'Co-Owner & Lead Veterinarian',
    email: 'dr.ross@oakridgevetguild.com',
    phone: '+1 (512) 555-3210',
    linkedinUrl: 'linkedin.com/in/dr-evelyn-ross-vet',
    companySize: '15 hospitality team members',
    whyNewWebsite: 'Needs an integrated booking and appointment scheduler to eliminate phone clutter. Visual typography is messy, loading speed is lagging badly, and localized SEO is missing crucial local Google maps pins.',
    websiteScore: 3, // Website Quality Score (1-10)
    budgetPotential: '$6,500 - $8,500',
    priority: 'Hot', // Scored 12/14: Outdatedness=4, Mobile=3, SEO=3, Industry=2 (Total=12)
    status: 'New',
    issues: {
      design: [
        'Confusing navigation structure with over 15 primary headers.',
        'Dull, low-quality photos of treatment areas that feel sterile instead of friendly.',
        'Severe layout shifting as custom widgets load slowly.'
      ],
      mobile: [
        'Emergency care hours block maps underneath overlapping picture elements.',
        'Tiny dropdown menus require multiple clicks on a touchscreen device.'
      ],
      seo: [
        'Absence of microdata/schema structure for emergency care clinics.',
        'Duplicate title tags across several inner clinic services pages.'
      ],
      speed: [
        'Server response time lags past 3.2 seconds due to unoptimized script calls.'
      ],
      conversion: [
        'Patients must call by phone to check slot availability, loading up staff time.',
        'Primary emergency helpline is a static image element.'
      ],
      trust: [
        'Lacks review integration or certificates displaying modern vet care compliance.',
        'Missing standard SSL certificate, raising warnings on visitor devices.'
      ],
      branding: [
        'Inconsistent color scheme across sections that clashes with clinic interior.'
      ]
    },
    outreach: {
      subject: 'Converting Oakridge Vet inquiries: Mobile calendar upgrade',
      body: `Hi Dr. Ross,

I was reviewing dental and veterinary providers around Austin, TX, and found Oakridge Veterinary Guild. Your local patient feedback is outstanding, but your website (www.oakridgevetguild.com) is likely causing pet owners to schedule elsewhere.

During our regional medical review, we noticed a few critical blocks that are causing patient drop-offs:
- **Mobile Menu Collisions**: Emergency contact hours and locations cross over one another on standard screens, making urgent details difficult to click.
- **High-Friction Scheduling**: Requiring patients to dial direct only during business hours creates friction, particularly for new prospective pet owners looking for quick bookings.
- **Missing Secure Seals**: Browser padlock warnings due to missing SSL protocols can reduce new patient trust when inputting email data.

Upgrading to an automated pet portal with interactive, mobile-friendly schedulers could save your front desk hours and increase bookings by over 30%.

We design fast-loading clinical portals that simplify scheduling. I've compiled a brief, free mockup of an elegant patient booking form showing how easy it is to schedule a visit in 3 taps.

Do you have a few free minutes this week to take a look?

Warm regards,

Alex Vance
Lead Growth Advisor & Digital Architect
Apex B2B Strategies
Direct: +1 (512) 555-8831
Book a call: calendly.com/apex-b2b/strategy-session`
    },
    createdAt: new Date().toISOString()
  },
  {
    id: 'lead-scored-3',
    businessName: 'Phoenix Architectural Partners',
    industry: 'Architecture & Design',
    websiteUrl: 'https://www.phoenixarchpartners.com',
    contactPerson: 'Julian Mercer',
    contactTitle: 'Principal Architect & Founder',
    email: 'jmercer@phoenixarchpartners.com',
    phone: '+1 (415) 555-7811',
    linkedinUrl: 'linkedin.com/in/julian-mercer-phoenix',
    companySize: '28 designers and managers',
    whyNewWebsite: 'High-end custom residential architecture studio whose portfolio gallery imagery breaks or stays un-responsive on mobile formats. Lacks a refined presentation aesthetic fitting their premium pricing structure.',
    websiteScore: 5, // Website Quality Score (1-10)
    budgetPotential: '$10,000 - $14,000',
    priority: 'Warm', // Scored 9/14: Outdatedness=3, Mobile=3, SEO=0, Industry=3 (Total=9)
    status: 'New',
    issues: {
      design: [
        'Portfolio grid lacks fluid aspect ratios, distorting high-resolution renders.',
        'Outdated sidebar design cramps the screen and hides visual build records.'
      ],
      mobile: [
        'The mobile navigation menu is an overlay card with no clear close button.',
        'High-resolution slideshow images cause persistent swipe lag.'
      ],
      seo: [
        'Alt tags are completely empty on portfolio build illustration blocks.'
      ],
      speed: [
        'Loads ultra-heavy RAW project renders, freezing screens on slow networks.'
      ],
      conversion: [
        'Consultation buttons lead to a general mailto tag rather than structured forms.'
      ],
      trust: [
        'Lists accolades and projects ending in 2022, creating a stale portfolio look.'
      ],
      branding: [
        'Uses generic web-safe fonts that undercut an otherwise elite creative aesthetic.'
      ]
    },
    outreach: {
      subject: 'Mobilizing Phoenix Architectural Partners: Modern Portfolio grid',
      body: `Hi Julian,

I came across Phoenix Architectural Partners while reviewing San Francisco premium build specialists. Your residential design portfolio is incredible, but your current portfolio website (www.phoenixarchpartners.com) is undercutting your premium brand value.

A quick mobile audit pointed out a few bottlenecks that may filter out high-intent clients:
- **Responsive Portfolio Collapses**: Portfolio slideshows scale poorly on mobile screens, cropping beautiful angles of your best work.
- **Heavy Media Delay**: Uncompressed rendering files cause significant latency, slowing down load times for users on cell networks.
- **Microscopic Typography**: Side-navigation fonts are formatted very small, creating friction for users scanning on mobile.

Premium B2B and design buyers expect immersive, hyper-fast, editorial-grade portfolios that work perfectly on iPads, iPhones, and desktop screens alike.

We specialize in designing highly polished, responsive visual portfolios for high-end architects and creators. I would love to send over a 1-page design mockup demonstrating a dynamic layout with fluid image grids.

Would you be open to an email intro or quick 5-minute strategy call next Tuesday?

Warm regards,

Alex Vance
Lead Growth Advisor & Digital Architect
Apex B2B Strategies
Direct: +1 (512) 555-8831
Scheduler: calendly.com/apex-b2b/strategy-session`
    },
    createdAt: new Date().toISOString()
  },
  {
    id: 'lead-scored-4',
    businessName: 'Apex Precision Machining',
    industry: 'Industrial Manufacturing',
    websiteUrl: 'https://www.apexprecisionmachining.com',
    contactPerson: 'Carl Dunlap',
    contactTitle: 'VP of Operations',
    email: 'cdunlap@apexprecisionmachining.com',
    phone: '+1 (312) 555-0988',
    linkedinUrl: 'linkedin.com/in/carl-dunlap-machining',
    companySize: '75 plant floor operators',
    whyNewWebsite: 'Industrial parts catalog is unsearchable because details are locked inside static image scans and non-searchable PDF attachments. No structured request-for-quote (RFQ) mechanism leads to long email conversion loops.',
    websiteScore: 4, // Website Quality Score (1-10)
    budgetPotential: '$9,000 - $12,500',
    priority: 'Warm', // Scored 9/14: Outdatedness=4, Mobile=0, SEO=3, Industry=2 (Total=9)
    status: 'New',
    issues: {
      design: [
        'Very dense text layouts that feel disorganized and highly technical.',
        'Outdated color palette with heavily saturated blue elements.'
      ],
      mobile: [
        'Complex specs tables force excessive horizontal scrolling.'
      ],
      seo: [
        'Search engine crawlers cannot read specs because they are inside image files.',
        'Zero crawlable tags optimized for heavy B2B machining keywords.'
      ],
      speed: [
        'Poor initial page rendering speeds due to unminified Javascript assets.'
      ],
      conversion: [
        'Interactive Request for Quote (RFQ) tables are completely non-existent.'
      ],
      trust: [
        'No clear display of ISO certifications or client logos on the front page.'
      ],
      branding: [
        'The logo layout is noisy, which clashes with modern industrial standards.'
      ]
    },
    outreach: {
      subject: 'Converting precision parts buyers: Apex RFQ Portal Upgrade',
      body: `Hi Carl,

I was reviewing B2B parts fabricators and came across Apex Precision Machining. Your machining capabilities and equipment look state-of-the-art, but your digital catalog is currently hiding them.

We checked your catalog site (www.apexprecisionmachining.com) and found a few blocks to rapid sales generation:
- **Locked specs indices**: Because many of your engineering specifications sit inside static scan files, web crawlers cannot index them, causing you to lose valuable SEO search placements.
- **No Structured RFQ Funnel**: Customers cannot configure requests or upload part files (STEP/IGS) directly, leading to slow sales cycles and heavy email management.
- **Horizontal Scrolling Friction**: Dense technical tables require intensive hand-swiping to scan on mobile screens.

Upgrading to a clean, search-optimized parts directory with a direct RFQ upload form can capture high-intent inquiries and cut down response lag times.

We specialize in designing technical B2B platforms that convert. I would love to share a free custom mockup of your high-conversions RFQ parts page.

Do you have a few minutes for a brief call next week?

Respectfully,

Alex Vance
Lead Growth Advisor & Digital Architect
Apex B2B Strategies
Direct: +1 (512) 555-8831
My link: calendly.com/apex-b2b/strategy-session`
    },
    createdAt: new Date().toISOString()
  },
  {
    id: 'lead-scored-5',
    businessName: 'Windsor Coffee Roasters',
    industry: 'Food & Beverage Wholesaler',
    websiteUrl: 'https://www.windsorcoffeeroasters.com',
    contactPerson: 'Liam Vance',
    contactTitle: 'Co-Founder & Lead Roaster',
    email: 'liam@windsorcoffeeroasters.com',
    phone: '+1 (503) 555-2245',
    linkedinUrl: 'linkedin.com/in/liam-vance-roasters',
    companySize: '6 staff members',
    whyNewWebsite: 'Clean Shopify storefront, but lacks robust wholesaler portals or active subscription funnels for commercial accounts. Redesign is low urgency and currently functional.',
    websiteScore: 7, // Website Quality Score (1-10)
    budgetPotential: '$3,500 - $5,000',
    priority: 'Cold', // Scored 3/14: Outdatedness=2, Mobile=0, SEO=0, Industry=1 (Total=3)
    status: 'New',
    issues: {
      design: [
        'Aesthetic styling is generally clear, but has dull footer blocks.'
      ],
      mobile: [
        'Basic checkout button layouts would benefit from larger touch boundaries.'
      ],
      seo: [
        'Missing structured keyword tags for regional retail office coffee programs.'
      ],
      speed: [
        'Generally fast, with minor script delays on custom newsletter overlays.'
      ],
      conversion: [
        'Wholesale inquiry form is a text email link, missing custom corporate requests.'
      ],
      trust: [
        'Needs direct placement of roastery certs and retail testimonials.'
      ],
      branding: [
        'Color palette is cohesive but misses accent contrasts.'
      ]
    },
    outreach: {
      subject: 'Commercial bulk growth: Windsor Wholesale Portal Upgrade',
      body: `Hi Liam,

I am a big fan of Windsor Coffee Roasters and love your retail roasting program. Your current brand is incredibly rich, but your online commercial presence is currently leaving B2B corporate office accounts behind.

While reviewing your portal (www.windsorcoffeeroasters.com), we flagged a quick commercial growth opportunity:
- **No Private Wholesaler Funnel**: Managing custom contract bulk accounts requires manual emailing instead of an interactive wholesale portal.
- **Unoptimized Corporate SEO**: Your local listings target direct-to-consumer buyers but miss high-volume regional workplace supply queries.

Upgrading your commerce site with a clean B2B wholesale client portal with automated invoicing can capture premium recurring merchant accounts.

We craft custom commercial e-commerce additions. If you are looking to scale your workplace bulk accounts in the future, let's keep in touch.

Best regards,

Alex Vance
Lead Growth Advisor & Digital Architect
Apex B2B Strategies
Direct: +1 (512) 555-8831
Calendly: calendly.com/apex-b2b/strategy-session`
    },
    createdAt: new Date().toISOString()
  }
];

