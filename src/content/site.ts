/* ============================================================
   site.ts — EVERYTHING about you lives here.
   Both versions of the site (classic at / and XMB at /play)
   render from this file, so you only edit your info once.

   PROJECT PREVIEWS
   Every project card shows a preview, picked in this order:
     1. a live website in `sites` (clickable browser-window card)
     2. `preview`: a screenshot in public/assets/previews/
     3. `flow`: a short how-it-works diagram, e.g. ["Shopify", "Middleware", "WordPress"]
     4. otherwise a generated cover with the name and tech

   WEBSITE PREVIEWS
   Any project can list `sites`. Each one renders
   as a clickable browser-window preview instead of a plain link:
     { name: "Label", url: "https://...", image: "/assets/previews/x.png" }
   - Entries with an empty url are hidden.
   - `image` is a screenshot in public/assets/previews (16:10 looks best).
     Without one, a styled placeholder showing the domain is used.
   ============================================================ */

export type SitePreview = { name: string; url: string; image?: string };

export type TimelineEntry = {
  title: string;
  org?: string;
  date: string;
  location?: string;
  points: string[];
};

export type Education = {
  school: string;
  degree: string;
  date: string;
  location?: string;
  points?: string[];
};

export type Project = {
  name: string;
  year?: string;
  blurb: string;
  description?: string;
  tags: string[];
  links: Partial<Record<"code" | "demo", string>>;
  featured?: boolean;
  thumb?: string; // optional image for the XMB "game card"
  sites?: SitePreview[];
  /** screenshot of the project itself, e.g. "/assets/previews/crm-base.jpg" */
  preview?: string;
  /** no screenshot? describe how it works and the card draws a little diagram */
  flow?: string[];
};

export type Site = {
  name: string;
  handle: string;
  role: string;
  school: string;
  location: string;
  status?: string;
  email: string;
  resume?: string;
  links: Partial<Record<"github" | "linkedin" | "upwork", string>>;
  summary: string;
  about: string[];
  experience: TimelineEntry[];
  education: Education[];
  projects: Project[];
  skills: { group: string; items: string[] }[];
  leadership: TimelineEntry[];
  also?: string;
  bookmarks: { name: string; url: string; note?: string }[];
  changelog: { version: string; date: string; note: string }[];
};

export const LINK_LABELS: Record<string, string> = { github: "GitHub", linkedin: "LinkedIn", upwork: "Upwork" };

export const domain = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
export const liveSites = (item: { sites?: SitePreview[] }) => (item.sites || []).filter((s) => s.url);
/** stable hue (0-359) per name, used for generated covers */
export const hueOf = (name: string) => {
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return hash % 360;
};
export const featuredFirst = (ps: Project[]) => [...ps].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));

export const SITE: Site = {
  // ---------- basics ----------
  name: "Ebrahim Daginawala",
  handle: "ebrahim",
  role: "Computer Science Student & Freelance Full-Stack Developer",
  school: "York University",
  location: "Toronto, Canada",
  status: "Seeking a software development internship",
  email: "ebrahimdaginawala2006@gmail.com",
  resume: "/assets/Ebrahim_Daginawala_Resume.pdf",
  links: {
    github: "https://github.com/Lapl6ce",
    linkedin: "https://www.linkedin.com/in/ebrahim-daginawala-a45039305",
    upwork: "https://www.upwork.com/freelancers/~01ddd67c430e08843d",
  },

  // shown at the top of the classic site
  summary:
    "Second-year Computer Science student at York University and freelance full-stack developer. " +
    "I build web applications, API integrations and automation that help businesses run more reliably.",

  // longer bio, one string per paragraph
  about: [
    "I'm a second-year Computer Science student at York University in Toronto, and I freelance as a " +
      "full-stack developer. I work mostly in Java, Python and TypeScript, with React, Node.js and Next.js " +
      "on the web side, and I'm currently learning Rust.",
    "My main client right now is AKD Jewelers, a retailer in Mumbai. I built the Shopify–WordPress sync " +
      "that keeps inventory and orders consistent across their two sites, plus a custom Shopify dashboard so " +
      "non-technical staff can monitor it. I'm now building them a lightweight CRM.",
    "Before York, I completed the IB Diploma at JBCN International School in Mumbai on a full-tuition " +
      "scholarship. Outside of code I've founded a STEAM club, served as Cultural Captain, finished the " +
      "Tata Mumbai Marathon 10 km, and won a national online debate final.",
  ],

  // ---------- experience (most recent first) ----------
  experience: [
    {
      title: "Web & App Developer (Freelance)",
      org: "AKD Jewelers",
      date: "May 2026 – Present",
      location: "Mumbai, India (remote)",
      points: [
        "Synced two of the business's websites so inventory and orders stay consistent across both.",
        "Built a custom Shopify app that gives non-technical staff a single dashboard to monitor the sync.",
        "Currently building a lightweight CRM that tracks customers through the sales pipeline and triggers personalized offers.",
      ],
    },
    {
      title: "IT Head",
      org: "JBCN Model UN Committee",
      date: "Jun 2023 – Jun 2025",
      location: "Mumbai, India",
      points: [
        "Built and maintained the club's website across two iterations, moving from Google Sites to WordPress as its needs grew.",
        "Owned design, content structure and updates each conference cycle, giving delegates and staff schedules, resources and conference info.",
      ],
    },
  ],

  // ---------- education ----------
  education: [
    {
      school: "York University",
      degree: "Bachelor of Science, Computer Science",
      date: "Expected 2029",
      location: "Toronto, Canada",
      points: [
        "Apply coursework and personal projects to client work: reused a CRM base I built in React/TypeScript for AKD Jewelers' customer-tracking app.",
      ],
    },
    {
      school: "JBCN International School",
      degree: "International Baccalaureate Diploma Programme",
      date: "2022 – 2024",
      location: "Mumbai, India",
      points: [
        "IB score 38/45 (HL Mathematics AA, Physics, Chemistry). Full-tuition scholarship for the two-year IBDP, awarded through a competitive selection process.",
        "ICSE Class 10: 96% (Mathematics 100, Computer Applications 98); ranked 3rd of 100 students.",
      ],
    },
  ],

  // ---------- projects ----------
  // links: delete any you don't have. featured: true shows it first.
  // thumb: optional image for the XMB "game card". sites: live previews (see top).
  projects: [
    {
      name: "Dagina Designs",
      year: "2026",
      blurb: "Jewellery inspiration platform for AKD Jewelers: browse, filter and save designs.",
      description:
        "A jewellery inspiration platform for AKD Jewelers, a retailer in Mumbai. Visitors browse a gallery of " +
        "designs, filter by metal and product type, and like, save or share pieces.",
      tags: ["Flutter Web", "Jewellery"],
      links: {},
      featured: true,
      sites: [{ name: "Dagina Designs", url: "https://www.dagina.design/", image: "/assets/previews/dagina-designs.jpg" }],
    },
    {
      name: "JBCN MUN Website",
      year: "2023–2025",
      blurb: "Conference site for JBCN Model United Nations: registration, committees and delegate prep.",
      description:
        "Website for the JBCN Model UN conference, giving delegates and staff schedules, committee info, " +
        "registration and prep resources each conference cycle.",
      tags: ["Web design", "Content"],
      links: {},
      featured: true,
      sites: [{ name: "JBCN MUN", url: "https://jbcnparelmun.com/", image: "/assets/previews/jbcn-mun.jpg" }],
    },
    {
      name: "Shopify–WordPress Sync System",
      year: "2026",
      blurb: "Middleware that keeps a retail client's Shopify store and WordPress site in sync.",
      description:
        "Node.js/Express middleware, deployed on Render, that handles Shopify webhooks and creates ARMember " +
        "memberships through a custom WordPress plugin. Payment flows were verified end to end using Razorpay test orders.",
      tags: ["Node.js", "Express", "Shopify", "WordPress", "Razorpay"],
      links: {},
      flow: ["Shopify store", "Webhook middleware on Render", "WordPress + ARMember"],
      featured: true,
    },
    {
      name: "thrift_feed",
      year: "",
      blurb: "Thrift marketplace with shop pages, anonymous visitor identity, and a persistent cart.",
      description:
        "A thrift marketplace with item and shop pages, cookie-based anonymous visitor identity, and a " +
        "persistent wishlist and cart, backed by a Neon Postgres database through Drizzle ORM.",
      tags: ["Next.js 15", "Drizzle ORM", "Neon Postgres"],
      links: {},
      preview: "", // TODO: screenshot → "/assets/previews/thrift-feed.jpg"
      flow: ["Next.js 15 storefront", "Drizzle ORM", "Neon Postgres"],
      featured: true,
      sites: [{ name: "thrift_feed", url: "", image: "" }],              // TODO: url if deployed
    },
    {
      name: "CRM Base",
      year: "2026",
      blurb: "Reusable React/TypeScript CRM foundation, forked per client.",
      description:
        "A CRM foundation designed to be forked per client: a swappable data layer, self-contained modules, " +
        "and architecture rules enforced by lint. Reused as the base for AKD Jewelers' customer-tracking app.",
      tags: ["React", "TypeScript"],
      links: {},
      preview: "/assets/previews/crm-base.jpg",
    },
    {
      name: "University LMS Platform",
      year: "",
      blurb: "Full-stack learning management system modeled on a university eClass.",
      description: "A full-stack learning management system modeled on a university eClass.",
      tags: ["Full-stack"],
      links: {},
    },
    {
      name: "AI 3D Asset Generator",
      year: "",
      blurb: "Generates 3D assets from images for use in game engines.",
      description: "A tool that generates 3D assets from images for use in game engines.",
      tags: ["AI", "Image-to-3D", "Game engines"],
      links: {},
    },
    {
      name: "Vaie",
      year: "",
      blurb: "Hackathon app teaching village students and adults in 11 Indian languages, by voice.",
      description:
        "One-day hackathon demo for a village-education project: an Expo/React Native Android app with a " +
        "gamified learning map for students and a voice-first skills assistant for adult learners, " +
        "live-translated into 11 Indian languages. A small Node/Express/SQLite server makes all AI calls (Gemini, Sarvam).",
      tags: ["React Native", "Expo", "Node.js", "SQLite", "Gemini"],
      flow: ["Expo app on the phone", "Town-hall server", "Gemini + Sarvam AI"],
      links: { code: "https://github.com/Lapl6ce/Vaie" },
    },
    {
      name: "WISE: Weather Information System for the Elderly",
      year: "2024",
      blurb: "Sensor system showing temperature, humidity, pollution, wind and light on an LCD.",
      description:
        "Built at Plaksha University: a sensor system displaying temperature, humidity, pollution, wind speed " +
        "and light on an LCD, using circuit design, soldering, 3D printing and calibration.",
      tags: ["Hardware", "Sensors", "3D printing"],
      flow: ["Temperature, humidity, pollution, wind & light sensors", "LCD display"],
      links: {},
    },
    {
      name: "Physics Extended Essay",
      year: "2024",
      blurb: "How pendulum speed and electromagnet strength affect eddy-current damping.",
      description:
        "IB Extended Essay investigating how pendulum speed and electromagnet field strength affect " +
        "eddy-current damping, using stopping time as the measured variable.",
      tags: ["Physics", "Research"],
      links: {},
    },
  ],

  // ---------- skills ----------
  skills: [
    { group: "Languages", items: ["Python", "JavaScript", "TypeScript", "Java", "HTML/CSS", "Rust (learning)"] },
    { group: "Frameworks & Tools", items: ["React", "Next.js", "Node.js/Express", "WordPress", "Shopify (custom apps)", "Drizzle ORM", "Postgres", "Git/GitHub", "Zapier", "Google Sheets"] },
    { group: "Concepts", items: ["REST API integration", "Webhooks", "Workflow automation", "Full-stack web development"] },
  ],

  // ---------- leadership & activities ----------
  leadership: [
    {
      title: "Founder, STEAM Club",
      org: "JBCN International School",
      date: "Sep 2023",
      points: ["Founded the club and recruited 11 members; led a model plane build from blueprint and sourcing through testing."],
    },
    {
      title: "Cultural Captain",
      org: "JBCN International School",
      date: "Jan 2024",
      points: ["Elected school-wide; organized festival events and raised over ₹1 lakh for an NGO supporting cancer survivors."],
    },
    {
      title: "Harvard Young Leaders Conference",
      org: "Delhi, India",
      date: "Jun 2023",
      points: ["Selected among 115+ students nationwide; mentored by Harvard students on a financial-literacy outreach project."],
    },
  ],
  also:
    "Hosted the closing ceremony of a school event with a celebrity chief guest; Tata Mumbai Marathon 10 km finisher; " +
    "won a national online debate program final.",

  // ---------- bookmarks (XMB "Network" tab, after your profiles) ----------
  bookmarks: [],

  // ---------- changelog (XMB "System Information") ----------
  changelog: [
    { version: "4.1", date: "2026-11", note: "Fun mode: project backdrops, ambient music, new menu sounds." },
    { version: "4.0", date: "2026-11", note: "Rebuilt in React with Next.js." },
    { version: "3.1", date: "2026-11", note: "Filled in from résumé; added website previews." },
    { version: "3.0", date: "2026-11", note: "Merged both sites; added XMB mode." },
    { version: "2.0", date: "2026-09", note: "Interactive room experiment." },
    { version: "1.0", date: "2026-07", note: "First single-page version." },
  ],
};
