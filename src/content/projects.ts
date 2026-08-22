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
    image: undefined,
    link: undefined,
  },
  {
    id: "intelligent-order-management",
    title: "Intelligent Order Management System",
    role: "Backend developer",
    description:
      "NLP-driven middleware built with LangChain that translates natural language queries into optimized SQL execution plans. Engineered fault-tolerant workflows with full test coverage for zero-downtime API execution, and used LangSmith and LM Studio to debug LLM latency and reduce hallucination.",
    tags: ["Model Context Protocol", "REST APIs", "React", "Node.js", "MySQL"],
    image: undefined,
    link: undefined,
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
];
