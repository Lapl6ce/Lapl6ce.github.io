/* Portfolio content, rendered by both the professional site and fun mode.
   Data only fun mode uses lives in src/play/config.ts.

   Adding a project: append to `projects`. A featured project's figure shows the first available of:
     1. `sites`: a screenshot of the live site, captioned with a link to it
        ({ name, url, image }; image in public/assets/previews/, 16:10; entries without a url are hidden)
     2. `preview`: a screenshot of the project itself
     3. `imageNeeded`: the screenshot at that path, or an IMAGE NEEDED box until the file exists
     4. `flow`: steps for a small how-it-works diagram, e.g. ["Shopify", "Middleware", "WordPress"]
     5. the project name on a plain ground
   Other projects are one row each in "More projects": no picture, and the name links to the first link.
   `featured: true` sorts a project first; featured projects can also carry a `caseStudy`.

   Placeholder strings are shown on the page as-is; TODO-OWNER.md lists them all.
   On `npm run dev` the hand-written fields can be edited and saved from the page,
   and /settings switches on demo mode (see demo.ts) for builds that go online first. */

import { DEMO_ACTIVE, withDemo } from "./demo";

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
  sites?: SitePreview[];
  /** screenshot of the project itself, e.g. "/assets/previews/crm-base.jpg" */
  preview?: string;
  /** steps for a how-it-works diagram, used when there is no screenshot */
  flow?: string[];
  /** where a screenshot will go, e.g. "/assets/previews/sync-system.jpg"; shown once the file exists */
  imageNeeded?: string;
  /** what the owner personally built, for team projects whose repo belongs to someone else */
  myPart?: string;
  /** longer write-up under a featured project; fun mode ignores it */
  caseStudy?: CaseStudy;
};

export type CaseStudy = {
  problem: string;
  approach: string;
  whatBroke: string;
  result: string;
  /** paths under public/, e.g. "/assets/previews/sync-dashboard.jpg" */
  images: string[];
};

export type Site = {
  name: string;
  handle: string;
  role: string;
  /** short line under the name on the professional hero; the summary carries the detail */
  headline?: string;
  school: string;
  location: string;
  status?: string;
  email: string;
  resume?: string;
  links: Partial<Record<"github" | "linkedin" | "upwork", string>>;
  summary: string;
  /** one line on current work, shown in the hero as "now: ..." */
  now?: string;
  /** portrait beside the About text, e.g. "/assets/photo.jpg" */
  photo?: string;
  /** availability line shown above the contact details */
  contactNote: string;
  about: string[];
  experience: TimelineEntry[];
  education: Education[];
  projects: Project[];
  skills: { group: string; items: string[] }[];
  leadership: TimelineEntry[];
};

export const LINK_LABELS: Record<string, string> = { github: "GitHub", linkedin: "LinkedIn", upwork: "Upwork" };

/** "https://www.example.com/" → "example.com" */
export const domain = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
/** profile links that are filled in, as [key, url] pairs */
export const profileLinks = () => Object.entries(SITE.links).filter((e): e is [string, string] => !!e[1]);
export type ContactRow = { key: string; label: string; url: string; text: string };
/** Email, then each filled-in profile. The hero and Contact both read this, so they can't drift apart. */
export const contactRows = (): ContactRow[] => [
  { key: "email", label: "Email", url: `mailto:${SITE.email}`, text: SITE.email },
  ...profileLinks().map(([key, url]) => ({ key, label: LINK_LABELS[key] || key, url, text: domain(url) })),
];
/** the entry's `sites` that have a url */
export const liveSites = (item: { sites?: SitePreview[] }) => (item.sites || []).filter((s) => s.url);
/** stable hue (0-359) per name, used for generated covers */
export const hueOf = (name: string) => {
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return hash % 360;
};
export const featuredFirst = (ps: Project[]) => [...ps].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));

// The draft as written. Pages read SITE below, which is this with demo mode applied when it is on.
const DRAFT: Site = {
  name: "Ebrahim Daginawala",
  handle: "ebrahim",
  role: "Computer Science Student & Freelance Full-Stack Developer",
  headline: "Freelance full-stack developer · CS @ York",
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

  summary: "TODO(owner): one or two sentences in your own words: what you build and one concrete example",
  now: "TODO(owner): what you're working on or learning right now, one line",
  // Optional: remove this line to show an IMAGE NEEDED box instead, or remove the slot in About.tsx.
  photo: "/assets/photo.jpg", // .jpeg, .png or .webp with the same name also work

  contactNote: "TODO(owner): one line on what you're looking for and how to reach you",

  // one string per paragraph
  about: [
    "TODO(owner): paragraph 1: who you are and what you like building, in your own voice",
    "TODO(owner): paragraph 2: the AKD Jewelers work and what was hard about it",
    "TODO(owner): paragraph 3: something outside code that matters to you",
  ],

  // most recent first
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
        "TODO(owner): impact, with numbers: products/orders synced, webhooks per day, hours saved, error rate",
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

  education: [
    {
      school: "York University",
      degree: "Bachelor of Science, Computer Science",
      date: "Expected 2029",
      location: "Toronto, Canada",
      points: [
        "Relevant coursework: Java, Python, discrete mathematics, advanced computational logic, linear algebra, calculus I and II, probability and statistics.",
      ],
    },
    {
      school: "JBCN International School",
      degree: "International Baccalaureate Diploma Programme",
      date: "2022 – 2024",
      location: "Mumbai, India",
      points: [
        "IB score 38/45 (HL Mathematics AA, Physics, Chemistry). Full-tuition scholarship for the two-year IBDP, awarded through a competitive selection process.",
      ],
    },
  ],

  projects: [
    {
      name: "Shopify–WordPress Sync System",
      year: "2026",
      blurb: "Middleware that keeps a retail client's Shopify store and WordPress site in sync.",
      description:
        "Node.js/Express middleware, deployed on Render, that handles Shopify webhooks and creates ARMember " +
        "memberships through a custom WordPress plugin. Payment flows were verified end to end using Razorpay test orders.",
      tags: ["Node.js", "Express", "Shopify", "WordPress", "Razorpay"],
      links: {},
      // TODO(owner): Sync System flow: replace with the real steps (e.g. signature check, queue/retry, plugin call)
      flow: ["Shopify store", "Webhook middleware on Render", "Custom WordPress plugin", "ARMember membership"],
      featured: true,
      imageNeeded: "/assets/previews/sync-system.jpg",
      caseStudy: {
        problem: "TODO(owner): Sync System, the problem: what needed solving, for whom, and why it mattered",
        approach: "TODO(owner): Sync System, the approach: what you built and the key decisions",
        whatBroke: "TODO(owner): Sync System, what broke: the hardest bug or failure and how you fixed it",
        result: "TODO(owner): Sync System, the result: what changed for the users, with numbers if you have them",
        images: ["/assets/previews/sync-dashboard.jpg"],
      },
    },
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
      caseStudy: {
        problem: "TODO(owner): Dagina Designs, the problem: what needed solving, for whom, and why it mattered",
        approach: "TODO(owner): Dagina Designs, the approach: what you built and the key decisions",
        whatBroke: "TODO(owner): Dagina Designs, what broke: the hardest bug or failure and how you fixed it",
        result: "TODO(owner): Dagina Designs, the result: what changed for the users, with numbers if you have them",
        images: ["/assets/previews/dagina-case.jpg"],
      },
    },
    {
      name: "Neighbor",
      year: "2026",
      blurb: "Hackathon voice companion for elderly people that listens for early signs of dementia and breathing trouble.",
      description:
        "Built by a team of three in 36 hours at CTRL+HACK+DEL 2.0 (York University): a voice companion that chats " +
        "with elderly people living alone to ease isolation and screen out scam calls, while passively checking their " +
        "speech for early signs of dementia (Wav2Vec2 fine-tuned on DementiaBank) and their breathing rate from the " +
        "microphone. Results show on a live React dashboard.",
      tags: ["Python", "Flask", "PyTorch", "Whisper", "React"],
      flow: ["Microphone", "Whisper + Wav2Vec2 on Flask", "React dashboard"],
      links: { code: "https://github.com/razoring/Neighor-Hackathon-Project" },
      featured: true,
      imageNeeded: "/assets/previews/neighbor.jpg",
      myPart: "TODO(owner): what you personally built (the repo is a teammate's)",
    },
    {
      name: "Vaie",
      year: "TODO(owner): year",
      blurb: "Hackathon app teaching village students and adults in 11 Indian languages, by voice.",
      description:
        "One-day hackathon demo for a village-education project: an Expo/React Native Android app with a " +
        "gamified learning map for students and a voice-first skills assistant for adult learners, " +
        "live-translated into 11 Indian languages. A small Node/Express/SQLite server makes all AI calls (Gemini, Sarvam).",
      tags: ["React Native", "Expo", "Node.js", "SQLite", "Gemini"],
      flow: ["Expo app on the phone", "Town-hall server", "Gemini + Sarvam AI"],
      links: { code: "https://github.com/Lapl6ce/Vaie" },
      featured: true,
      // three screens from the repo's Media folder, side by side
      imageNeeded: "/assets/previews/vaie.jpg",
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
      featured: false,
      sites: [{ name: "JBCN MUN", url: "https://jbcnparelmun.com/", image: "/assets/previews/jbcn-mun.jpg" }],
    },
    {
      name: "CRM Base",
      year: "2026",
      blurb: "Reusable React/TypeScript CRM foundation, forked per client.",
      description:
        "A CRM foundation designed to be forked per client: a swappable data layer, self-contained modules, " +
        "and architecture rules enforced by lint. Reused as the base for AKD Jewelers' customer-tracking app.",
      tags: ["React", "TypeScript"],
      links: { code: "https://github.com/Lapl6ce/crm-base" },
      preview: "/assets/previews/crm-base.jpg",
    },
    {
      name: "University LMS Platform",
      year: "TODO(owner): year",
      blurb: "Full-stack learning management system modeled on a university eClass.",
      description: "A full-stack learning management system modeled on a university eClass.",
      tags: ["Full-stack"],
      links: { code: "https://github.com/Lapl6ce/group-project-1012" },
    },
    {
      name: "AI 3D Asset Generator",
      year: "TODO(owner): year",
      blurb: "Generates 3D assets from images for use in game engines.",
      description:
        "A tool that generates 3D assets from images for use in game engines, using two Gemini API calls: " +
        "one produces a text file of vectors, the other translates it into an .obj file.",
      tags: ["Gemini API", "Image-to-3D", "Game engines"],
      links: { code: "https://github.com/anthskti/fabfab" },
      myPart: "TODO(owner): what you personally built (the repo is a teammate's)",
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
  ],

  skills: [
    { group: "Languages", items: ["Python", "JavaScript", "TypeScript", "Java", "HTML/CSS", "Rust (learning)"] },
    { group: "Frameworks & Tools", items: ["React", "Next.js", "Node.js/Express", "WordPress", "Shopify (custom apps)", "Drizzle ORM", "Postgres", "Git/GitHub", "Zapier", "Google Sheets"] },
    { group: "Concepts", items: ["REST API integration", "Webhooks", "Workflow automation", "Full-stack web development"] },
  ],

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
};

export const SITE: Site = DEMO_ACTIVE ? withDemo(DRAFT) : DRAFT;
