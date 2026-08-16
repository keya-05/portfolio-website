# Portfolio Website

My personal portfolio — a single-page site introducing who I am, what I've worked on, and how to reach me.

**Live site:** https://keyachaudhary.netlify.app/

## About the Project

Built with a component-based structure — a hero section, an about section, a projects grid, and a contact section — all wired together with smooth scrolling and subtle motion so the page feels alive without being distracting.

### Tech Stack

- **[Next.js](https://nextjs.org)** (App Router) — React framework for the site
- **[TypeScript](https://www.typescriptlang.org)** — type safety across components and content
- **[Tailwind CSS](https://tailwindcss.com)** — styling
- **[Motion](https://motion.dev)** — animations and transitions
- **[Lenis](https://lenis.darkroom.engineering)** — smooth scrolling
- **[Lucide React](https://lucide.dev)** — icons

### Structure

```
src/
├── app/            # Next.js app router pages and layout
├── components/     # Hero, About, ProjectsGrid, Contact, NavBar, etc.
└── content/        # Editable content — profile info and project list live here
```



## Running Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
