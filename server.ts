/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initializer for Gemini SDK as per guidelines
let aiInstance: GoogleGenAI | null = null;
function getAI(): GoogleGenAI {
  if (!aiInstance) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error('GEMINI_API_KEY is missing. Please add it in Settings > Secrets.');
    }
    aiInstance = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiInstance;
}

// -----------------------------------------------------
// API Route: Generate B2B Website Leads
// -----------------------------------------------------
app.post('/api/generate-leads', async (req, res) => {
  try {
    const { location, industry, additionalNotes } = req.body;
    if (!location || !industry) {
      return res.status(400).json({ error: 'Location and Industry are required fields.' });
    }

    const ai = getAI();
    
    const userPrompt = `
You are an elite B2B Lead Generation specialist and Growth Marketing Consultant.
Your task is to find and identify 4 to 6 small or mid-sized businesses in the industry: "${industry}" located in or near: "${location}".
These businesses are selected because they are high-potential candidates for website design, redesign, SEO audit, or branding overhaul.

Additional user instructions: ${additionalNotes || 'Focus on active small-to-medium businesses needing updates.'}

For each of these 4 to 6 leads, you must construct a complete, high-fidelity profile. Provide actual/highly logical local URLs (e.g. www.chicagodentalcare.com or www.austinlawyers.group instead of mock domains like www.example.com), real-sounding specific company names, realistic contact names, accurate localized phone formats, and a detailed bento-grade outline of their digital challenges.

Generate the output STRICTLY in JSON format following this TypeScript structure. Do not wrap in markdown or block backticks outside of returning a pure JSON response or JSON-compatible string.

TypeScript schema to follow strictly:
\`\`\`ts
interface Lead {
  id: string; // generate a unique safe string id e.g. "lead-1", "lead-2"
  businessName: string;
  industry: string;
  websiteUrl: string;
  contactPerson?: string; // a realistic full name of the founder, owner, practitioner, or marketing contact
  contactTitle?: string; // e.g. "Primary Physician", "Managing Partner", "Owner & Founder", "Director of Operations"
  email: string; // a realistic professional email based on their name/domain
  phone: string; // localized phone number matching the region
  linkedinUrl?: string; // realistic LinkedIn profile handle or URL
  companySize: string; // e.g., "3-8 employees", "12-25 team members", "Independent Practitioner"
  whyNewWebsite: string; // A highly-specific, compelling business reason explaining their exact digital gaps or recent triggers (e.g., rebrand, expansion, broken site structure)
  websiteScore: number; // 1 to 10 quality score (where 1 is an offline/broken site, and 10 is pristine)
  budgetPotential: string; // realistic budget estimate for website design based on size and sector, e.g., "$3,500 - $6,000" or "$8,000 - $12,000"
  priority: 'Hot' | 'Warm' | 'Cold'; // rank 'Hot' if score is < 5 and has active booking/reputation issues
  status: 'New'; // default to 'New'
  issues: {
    design: string[]; // 2-4 highly specific visual/layout complaints (e.g., "Uses generic templates with unreadable white-on-yellow contrast")
    mobile: string[]; // 1-2 responsive failures (e.g., "Interactive booking forms clip on standard mobile viewports")
    seo: string[]; // 2-3 local keyword optimization or structural issues
    speed: string[]; // 1-2 performance complaints
    conversion: string[]; // 2-3 call-to-action issues (e.g., "Booking phone number buried in fine print, no prominent click-to-dial")
    trust: string[]; // 1-3 authority/social proof gaps (e.g., "Copyright statement expired in 2021, missing secure HTTPS certification")
    branding: string[]; // 1-3 theme/relevance problems (e.g., "Stale logo from the late 90s, inconsistent corporate typography")
  };
  outreach: {
    subject: string; // an irresistible, helpful, non-spammy subject line targeting their main pain-point
    body: string; // a highly personalized outreach message explaining what problems were found, how a redesign fixes it, expected ROI/benefits, and a clean call to action.
  };
}
\`\`\`

Return a direct JSON array of these Lead objects: Lead[]. Ensure your analysis is deeply authentic to the specific industry and target city!
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: userPrompt,
      config: {
        responseMimeType: 'application/json',
        tools: [{ googleSearch: {} }], // Enable real-world Google search grounding
        systemInstruction: 'You are an absolute expert B2B growth and web design consultant. You find and diagnose digital presence challenges for local businesses, producing real-world, actionable value analysis without generic fluff.',
      },
    });

    const text = response.text || '[]';
    res.json(JSON.parse(text));
  } catch (error: any) {
    console.error('Lead Generation Error:', error);
    res.status(500).json({ error: error.message || 'An unexpected error occurred during lead generation.' });
  }
});

// -----------------------------------------------------
// API Route: Audit Specific Website URL (Single Scan)
// -----------------------------------------------------
app.post('/api/audit-website', async (req, res) => {
  try {
    const { url, industry, location, additionalNotes } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'URL is required for audits.' });
    }

    const ai = getAI();

    const userPrompt = `
Perform a detailed, simulated B2B audit of the website URL: "${url}".
The business reports as operating in the "${industry || 'Local Business'}" sector relative to "${location || 'USA'}".
User annotations/request details: ${additionalNotes || 'N/A'}.

Generate a high-potential lead profile including:
1. Business Name (deduced logically or from public details)
2. Website URL
3. Contact Person & Title estimation
4. Real-looking email & phone details
5. Company size & Budget Potential
6. Website Score (1 to 10)
7. Specific lists of issues (design, mobile, seo, speed, conversion, trust, branding)
8. Custom tailored outreach emails.

Generate the output strictly as a JSON object matching the single 'Lead' structure:
{
  "id": "audit-custom",
  "businessName": string,
  "industry": string,
  "websiteUrl": string,
  "contactPerson": string,
  "contactTitle": string,
  "email": string,
  "phone": string,
  "linkedinUrl": string,
  "companySize": string,
  "whyNewWebsite": string,
  "websiteScore": number,
  "budgetPotential": string,
  "priority": "Hot" | "Warm" | "Cold",
  "status": "New",
  "issues": {
    "design": string[],
    "mobile": string[],
    "seo": string[],
    "speed": string[],
    "conversion": string[],
    "trust": string[],
    "branding": string[]
  },
  "outreach": {
    "subject": string,
    "body": string
  }
}

Use your search grounding capability to check details of "${url}" if possible, and extract realistic flaws. Write a highly tailored outreach message outlining the actual issues found.
Return only valid, raw JSON.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: userPrompt,
      config: {
        responseMimeType: 'application/json',
        tools: [{ googleSearch: {} }],
        systemInstruction: 'You are a veteran web audit specialist and UI/UX consultant. Your audits are deeply objective, specific, action-focused, and highly respectful.',
      },
    });

    const text = response.text || '{}';
    res.json(JSON.parse(text));
  } catch (error: any) {
    console.error('Custom Audit Error:', error);
    res.status(500).json({ error: error.message || 'An unexpected error occurred during custom website audit.' });
  }
});

// -----------------------------------------------------
// API Route: Rewrite Outreach Message (Tone Adjuster)
// -----------------------------------------------------
app.post('/api/rewrite-outreach', async (req, res) => {
  try {
    const { lead, tone, consultant, websiteStatus } = req.body;
    if (!lead) {
      return res.status(400).json({ error: 'Lead details are required to rewrite.' });
    }

    const ai = getAI();

    const userPrompt = `
You are drafting a professional B2B outreach email.
Lead Business: "${lead.businessName}" (${lead.industry})
Website URL: "${lead.websiteUrl}"
Website Score: ${lead.websiteScore}/10

${websiteStatus ? `CURRENT WEBSITE STATUS & OBSERVATIONS:\n${websiteStatus}\n` : ''}
Key Challenges Identified on their Website:
- Design: ${lead.issues.design.join(', ')}
- Conversion: ${lead.issues.conversion.join(', ')}
- Trust: ${lead.issues.trust.join(', ')}
- Responsive Checklist: ${lead.issues.mobile.join(', ')}

My Consultant Profile:
- My Name: "${consultant?.name || 'an expert consultant'}"
- My Agency: "${consultant?.company || 'Web Growth Agency'}"
- My Title: "${consultant?.title || 'Web Strategy Partner'}"
- Reachable at: ${consultant?.email || 'my-email'} / ${consultant?.phone || 'my-phone'}
- My Booking Calendar: "${consultant?.bookingLink || '[Provide Scheduling Link]'}"

Please rewrite their customized B2B outreach message using the requested Tone: "${tone || 'Value-First Audit'}".
${websiteStatus ? `Ensure you place a strong, custom emphasis on the current website status: "${websiteStatus}".` : ''}

Tones guidelines:
- "Friendly & Conversational": Relaxed, respectful, building a personal connection, warm introductory greeting, helpful advice without hard selling.
- "Direct & ROI-Focused": Straight to the point. Focus heavily on expected business metrics, conversion gains, sales uplifts, and bottom-line value. Keep it scannable with quick bullet points of the flaws.
- "Value-First Audit": Start by detailing 2 key things they did great, then introduce 3 critical visual or SEO flaws. Frame it as "I created this mini-review for you, free of charge." High professional value.
- "Urgent Security & SEO": Emphasize technical standards. Focus on lack of responsive accessibility, security trust indicators (SSL, footer certificates), expired visual trust, and core Web Vitals penalty risks. Highly technical and problem-solving.

Return the modified version in a clean JSON format:
{
  "subject": "Rewritten irresistible email subject line",
  "body": "Rewritten personalized professional email body. Incorporate my consultant information, signature, and booking calendar smoothly."
}

Do not include any extra text. Return only valid JSON.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: userPrompt,
      config: {
        responseMimeType: 'application/json',
        systemInstruction: 'You are a world-class copywriter specializing in warm B2B cold outreach that conversion-rates over 25%. You excel at helpful, concise, high-credibility messages.',
      },
    });

    const text = response.text || '{}';
    res.json(JSON.parse(text));
  } catch (error: any) {
    console.error('Outreach Rewrite Error:', error);
    res.status(500).json({ error: error.message || 'An unexpected error occurred during email copywriting.' });
  }
});

// -----------------------------------------------------
// Vite Server Integration (Middleware / Production static)
// -----------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`B2B Lead Finder Server active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
