import type { Project } from "./types";

// Add, remove, or edit projects here — the grid picks up whatever's in this array.
// Leave `image` and `link` unset until you have them; both render clean placeholders.
export const projects: Project[] = [
  {
    id: "sentiment-analysis",
    title: "Sentiment Analysis from User Feedback",
    role: "Full-stack developer",
    description:
      "Multi-tier application with decoupled frontend and backend services, integrating external LLM APIs for automated sentiment classification. Used targeted prompt engineering to cut model hallucination and built optimized backend pipelines for stable, large-scale feedback processing.",
    tags: ["React", "Node.js", "REST APIs", "MySQL"],
    image: "/images/projects/sentiment-analysis.png",
    link: "https://sentiment-analysis-kappa-black.vercel.app/",
  },
  {
    id: "intelligent-order-management",
    title: "Intelligent Order Management System",
    role: "Backend developer",
    description:
      "NLP-driven middleware built with LangChain that translates natural language queries into optimized SQL execution plans. Engineered fault-tolerant workflows with full test coverage for zero-downtime API execution, and used LangSmith and LM Studio to debug LLM latency and reduce hallucination.",
    tags: ["Model Context Protocol", "REST APIs", "React", "Node.js", "MySQL"],
    image: "/images/projects/pizzabroker.png",
    link: "https://pizzabroker.netlify.app/",
  },
  {
    id: "shopsphere",
    title: "ShopSphere — Full Stack E-Commerce Platform",
    role: "Full-stack developer",
    description:
      "MERN-stack e-commerce application with user authentication, product management, cart, and order processing. Designed RESTful APIs for user management, catalog handling, and transaction workflows behind a responsive React frontend and modular backend services.",
    tags: ["React", "Node.js", "Express.js", "MongoDB"],
    image: undefined,
    link: undefined,
  },
  {
    id: "ai-learning-path-generator",
    title: "AI-Powered Learning Path Generator",
    role: "Full-stack developer",
    description:
      "Adaptive learning dashboard that maps prerequisite structure between concepts and flags gaps before a learner moves on to dependent topics. Visualizes a concept dependency graph and per-unit skill mastery, and surfaces exam readiness, study time, and days-until-exam tracking alongside an AI assistant for personalized guidance.",
    tags: ["React", "AI/LLM", "Data Visualization"],
    image: "/images/projects/ai-learning-path-generator.png",
    link: "https://ai-powered-learning-path-generator.vercel.app",
  },
];
