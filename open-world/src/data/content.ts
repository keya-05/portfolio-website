/**
 * ALL site content lives here. Edit this file — components only read from it.
 * Seeded from the previous Next.js portfolio (src/content/*).
 * Lines marked TODO are reasonable placeholders that need your real details.
 */

export type DistrictId = 'profile' | 'career' | 'campus' | 'projects' | 'connect';

export interface Point {
  /** 0-100, percent of the map/board width */
  x: number;
  /** 0-100, percent of the map/board height */
  y: number;
}

export interface District {
  id: DistrictId;
  /** Short nav label */
  label: string;
  /** In-world district name shown on the map */
  codename: string;
  /** Minimap position in a 200x200 map space */
  map: { x: number; y: number };
  mission: string;
}

export interface Profile {
  alias: string;
  fullName: string;
  title: string;
  location: string;
  roleLines: string[];
  bio: string;
  /** Transparent-background cutout. Falls back to a silhouette if missing. */
  photo: string;
}

export interface Skill {
  name: string;
  /** Self-rated, 0-100 */
  level: number;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  /** Self-rated mastery, 0-100 */
  mastery: number;
  /** Shown as "UNLOCKED ABILITIES" */
  abilities: string[];
}

export interface Education {
  university: string;
  school: string;
  program: string;
  specialization: string;
  status: string;
  cgpa: string;
  /** Building marker on the campus mini-map */
  marker: Point;
  academicLoadout: Skill[];
  courses: Course[];
}

export type MissionStatus = 'completed' | 'in-progress';

export interface Experience {
  id: string;
  /** Playful mission name — decoration only; title/company stay readable. */
  alias: string;
  title: string;
  company: string;
  start: string;
  end: string;
  status: MissionStatus;
  /** One or two lines distilled from the bullets */
  objective: string;
  bullets: string[];
  tech: string[];
  xp: number;
  logo?: string;
}

export type ProjectType = 'AI' | 'Backend' | 'Full Stack' | 'DevOps' | 'Experimental';
export type ProjectFilter = 'All' | ProjectType;

export interface Project {
  id: string;
  title: string;
  type: ProjectType;
  tech: string[];
  objective: string;
  problem: string;
  approach: string;
  result: string;
  /** Complexity of the build, 0-100 (scope, not difficulty) */
  scope: number;
  /** Pin position on the mission board */
  pin: Point;
  live?: string;
  github?: string;
  image?: string;
  /** Short status line, e.g. for the secret mission */
  status?: string;
}

export interface Links {
  linkedin: string;
  github: string;
  email: string;
  resume: string;
}

export interface ContactChannel {
  id: 'linkedin' | 'github' | 'email';
  /** Game-style verb */
  action: string;
  /** Plain readable label */
  label: string;
  handle: string;
  href: string;
  /** Shown for ~600ms before the link opens */
  status: string;
}

export const site = {
  name: 'KC // OPEN WORLD',
  city: 'K-CITY',
  tagline: 'ONE DEVELOPER. MULTIPLE MISSIONS. NO FAST TRAVEL.',
  timeZone: 'Asia/Kolkata',
} as const;

export const districts: District[] = [
  { id: 'profile', label: 'Profile', codename: 'Spawn Point', map: { x: 58, y: 128 }, mission: 'Meet the player' },
  { id: 'career', label: 'Career', codename: 'Business District', map: { x: 138, y: 64 }, mission: 'Track the work history' },
  { id: 'campus', label: 'Campus', codename: 'University Hill', map: { x: 52, y: 52 }, mission: 'Visit the academy' },
  { id: 'projects', label: 'Projects', codename: 'Workshop Docks', map: { x: 150, y: 140 }, mission: 'Inspect the builds' },
  { id: 'connect', label: 'Connect', codename: 'Radio Tower', map: { x: 100, y: 176 }, mission: 'Open a channel' },
];

/** Districts that must be visited for the completion screen. */
export const completionDistricts: DistrictId[] = ['profile', 'career', 'campus', 'projects'];

export const profile: Profile = {
  alias: 'KC',
  fullName: 'Keya Chaudhary',
  title: 'The Developer',
  location: 'Pune, India',
  roleLines: [
    'Final-year B.Tech CS (AI specialization)',
    'Full-stack / AI agent builder',
    'Backend x DevOps',
  ],
  bio: 'Backend-leaning developer building AI-integrated, full-stack applications with React, Node.js and REST APIs. Strong foundation in data structures, algorithms and OOP; happiest designing APIs, wiring LLMs into real products and shipping them reliably.',
  photo: '/profile.png',
};

/** Self-rated loadout. Tweak the numbers to taste. */
export const skills: Skill[] = [
  { name: 'React', level: 85 },
  { name: 'Node.js', level: 85 },
  { name: 'Python', level: 80 },
  { name: 'MERN', level: 82 },
  { name: 'AI Agents', level: 78 },
  { name: 'DevOps', level: 65 },
];

export const education: Education = {
  university: 'MIT ADT University',
  school: 'School of Computing',
  program: 'B.Tech Computer Science & Engineering',
  specialization: 'Artificial Intelligence',
  status: 'Final year', // TODO: add semester, e.g. 'Final year · Semester 7'
  cgpa: '9.26/10',
  marker: { x: 60, y: 42 },
  // TODO: self-rate these
  academicLoadout: [
    { name: 'DSA', level: 85 },
    { name: 'DBMS', level: 82 },
    { name: 'Operating Systems', level: 75 },
    { name: 'Networking', level: 70 },
    { name: 'AI/ML', level: 80 },
  ],
  // TODO: swap in your actual course codes and the topics you covered
  courses: [
    {
      id: 'dsa',
      name: 'Data Structures & Algorithms',
      code: 'CS-DSA',
      mastery: 85,
      abilities: ['Trees, heaps & graphs', 'Dynamic programming', 'Complexity analysis', 'Sorting & searching'],
    },
    {
      id: 'dbms',
      name: 'Database Management Systems',
      code: 'CS-DBMS',
      mastery: 82,
      abilities: ['SQL & query optimization', 'Normalization', 'Transactions & ACID', 'Indexing'],
    },
    {
      id: 'os',
      name: 'Operating Systems',
      code: 'CS-OS',
      mastery: 75,
      abilities: ['Processes & threads', 'CPU scheduling', 'Memory management', 'Deadlocks'],
    },
    {
      id: 'cn',
      name: 'Computer Networks',
      code: 'CS-CN',
      mastery: 70,
      abilities: ['OSI & TCP/IP', 'HTTP & REST', 'Routing basics', 'Sockets'],
    },
    {
      id: 'aiml',
      name: 'Artificial Intelligence & Machine Learning',
      code: 'CS-AIML',
      mastery: 80,
      abilities: ['Supervised learning', 'Model evaluation', 'Neural networks', 'Prompt engineering'],
    },
    {
      id: 'oop',
      name: 'Object-Oriented Programming',
      code: 'CS-OOP',
      mastery: 85,
      abilities: ['Encapsulation & inheritance', 'Design patterns', 'SOLID principles'],
    },
  ],
};

export const experience: Experience[] = [
  {
    id: 'google-aicte',
    alias: 'Teach the Machine',
    title: 'AI-ML Virtual Intern',
    company: 'Google for Developers & AICTE',
    start: 'Apr 2025',
    end: 'Jun 2025',
    status: 'completed',
    objective: 'Built and evaluated a supervised classification model end to end with TensorFlow and Keras.',
    logo: '/images/Eduskills.png',
    bullets: [
      'Implemented model training, data preprocessing and performance evaluation using TensorFlow and Keras.',
      'Built a supervised classification model for real-world predictive analysis.',
    ],
    tech: ['TensorFlow', 'Keras', 'Python', 'Machine Learning'],
    xp: 600,
  },
  {
    id: 'hapticware',
    alias: 'Keep the Servers Running',
    title: 'Backend Intern',
    company: 'Hapticware Intelligence Pvt Ltd',
    start: 'Jun 2026',
    end: 'Present',
    status: 'in-progress',
    objective: 'Design and optimize REST APIs, own features from build to deployment, and keep backend services reliable.',
    logo: '/images/hapticware-logo.png',
    bullets: [
      'Develop and maintain scalable server-side applications, collaborating with frontend and product teams for end-to-end feature delivery.',
      'Design and optimize RESTful APIs to improve response times, database performance and service reliability.',
      'Contribute to core architecture decisions, debug production issues and manage backend deployments using AI-assisted workflows.',
      'Own full-cycle feature development with robust unit and integration testing.',
    ],
    tech: ['REST APIs', 'Backend services', 'Testing', 'Deployment'],
    xp: 1200,
  },
];

export const projects: Project[] = [
  {
    id: 'sentiment-analysis',
    title: 'Sentiment Analysis from User Feedback',
    type: 'AI',
    tech: ['React', 'Node.js', 'REST APIs', 'MySQL', 'LLM APIs'],
    objective: 'Classify large volumes of user feedback by sentiment automatically.',
    problem: 'Manual feedback triage is slow, and naive LLM calls hallucinate labels.',
    approach: 'Multi-tier app with decoupled frontend/backend, external LLM APIs and targeted prompt engineering, backed by optimized processing pipelines.',
    result: 'Reduced hallucinated classifications and kept large-scale feedback processing stable.',
    scope: 70,
    pin: { x: 22, y: 34 },
    live: 'https://sentiment-analysis-kappa-black.vercel.app/',
    github: undefined, // TODO: add repo URL
    image: '/images/projects/sentiment-analysis.png',
  },
  {
    id: 'intelligent-order-management',
    title: 'Intelligent Order Management System',
    type: 'Backend',
    tech: ['LangChain', 'Model Context Protocol', 'Node.js', 'React', 'MySQL'],
    objective: 'Let staff query orders in plain English.',
    problem: 'Non-technical users cannot write SQL, and LLM-generated queries can be slow or wrong.',
    approach: 'NLP middleware with LangChain translating natural language into optimized SQL; fault-tolerant workflows with full test coverage; LangSmith and LM Studio for latency and hallucination debugging.',
    result: 'Zero-downtime API execution with reliable NL-to-SQL translation.',
    scope: 82,
    pin: { x: 58, y: 24 },
    live: 'https://pizzabroker.netlify.app/',
    github: undefined, // TODO: add repo URL
    image: '/images/projects/pizzabroker.png',
  },
  {
    id: 'shopsphere',
    title: 'ShopSphere E-Commerce Platform',
    type: 'Full Stack',
    tech: ['React', 'Node.js', 'Express.js', 'MongoDB'],
    objective: 'Ship a complete MERN storefront end to end.',
    problem: 'E-commerce needs auth, catalog, cart and orders working together reliably.',
    approach: 'RESTful APIs for users, catalog and transactions behind a responsive React frontend and modular backend services.',
    result: 'A working storefront with authentication, product management, cart and order processing.',
    scope: 65,
    pin: { x: 36, y: 70 },
    live: undefined,
    github: undefined, // TODO: add repo URL
  },
  {
    id: 'ai-learning-path-generator',
    title: 'AI-Powered Learning Path Generator',
    type: 'AI',
    tech: ['React', 'AI/LLM', 'Data Visualization'],
    objective: 'Guide learners through topics in the right order.',
    problem: 'Learners move on to dependent topics before mastering prerequisites.',
    approach: 'Maps prerequisite structure as a concept dependency graph, tracks per-unit mastery and pairs it with an AI assistant for personalized guidance.',
    result: 'Flags knowledge gaps early and surfaces exam readiness, study time and countdown tracking.',
    scope: 75,
    pin: { x: 76, y: 60 },
    live: 'https://ai-powered-learning-path-generator.vercel.app',
    github: undefined, // TODO: add repo URL
    image: '/images/projects/ai-learning-path-generator.png',
  },
];

/** Unlocks on the board once every project above has been opened. */
export const secretMission: Project = {
  id: 'secret-open-world',
  title: 'KC // OPEN WORLD',
  type: 'Experimental',
  status: 'Currently building',
  tech: ['React', 'TypeScript', 'GSAP', 'Lenis', 'Framer Motion', 'Tailwind CSS'],
  objective: 'Turn a portfolio into something you play rather than scroll.',
  problem: 'Most portfolios read like a résumé with extra padding.',
  approach: 'A game-inspired shell (HUD, phone, map, missions) on top of plain, accessible content, with a classic view for anyone who just wants the facts.',
  result: 'You are standing in it. More districts are under construction.',
  scope: 88,
  pin: { x: 84, y: 22 },
  github: undefined, // TODO: add repo URL
};

export const links: Links = {
  linkedin: 'https://www.linkedin.com/in/keya-chaudhary/',
  github: 'https://github.com/keya-05',
  email: 'chaudhary.keya18@gmail.com',
  resume: '/resume.pdf',
};

export const contactChannels: ContactChannel[] = [
  {
    id: 'linkedin',
    action: 'Connect',
    label: 'LinkedIn',
    handle: 'in/keya-chaudhary',
    href: links.linkedin,
    status: 'Connecting…',
  },
  {
    id: 'github',
    action: 'Access',
    label: 'GitHub',
    handle: 'github.com/keya-05',
    href: links.github,
    status: 'Accessing repository…',
  },
  {
    id: 'email',
    action: 'Call',
    label: 'Email',
    handle: links.email,
    href: `mailto:${links.email}`,
    status: 'Composing message…',
  },
];

// TODO: confirm what you're open to
export const availability: string[] = [
  'Full-time software engineering roles',
  'Backend & AI engineering internships',
  'Freelance builds',
  'Interesting projects & collaborations',
];

/** Shown briefly during long Phone/Minimap jumps. */
export const loadingTips: string[] = [
  '"It works on my machine" is not a deployment strategy.',
  'Read the error message. Then read it again. It usually knows.',
  'Commit early, commit often, never commit node_modules.',
  'A rubber duck is the cheapest senior engineer you will ever hire.',
  'A 500 is just the server asking for a coffee break.',
  'git push --force is a boss fight. Bring backup.',
  'Naming things is hard. Naming things well is a side quest.',
];
