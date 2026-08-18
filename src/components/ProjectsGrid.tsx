import { projects } from "@/content/projects";
import ProjectCard from "./ProjectCard";
import Reveal from "./motion/Reveal";

export default function ProjectsGrid() {
  return (
    <section id="work" className="mx-auto max-w-screen-2xl px-6 py-16 sm:px-10 sm:py-20 lg:px-16 xl:px-24">
      <Reveal className="mb-10 flex flex-col gap-2 text-center lg:text-left">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-coral">
          Selected work
        </span>
        <h2 className="text-balance font-display text-3xl font-bold text-ink sm:text-4xl">
          Projects
        </h2>
      </Reveal>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, i) => (
          <Reveal
            key={project.id}
            delay={(i % 3) * 0.08}
            className={i % 3 === 0 ? "lg:col-span-2" : undefined}
          >
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
