import { projects } from "@/content/projects";
import ProjectCard from "./ProjectCard";
import Reveal from "./motion/Reveal";

export default function ProjectsGrid() {
  return (
    <section id="work" className="mx-auto max-w-screen-2xl px-6 py-10 sm:px-10 sm:py-12 lg:px-16 xl:px-24">
      <Reveal className="mb-6 flex flex-col gap-2 text-center lg:text-left">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-wine">
          Selected work
        </span>
        <h2 className="text-balance font-display text-3xl font-bold text-ink sm:text-4xl">
          Projects
        </h2>
      </Reveal>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, i) => {
          // Pairs of (wide, normal) fill exactly 3 columns per row. When the
          // total is odd, the leftover last card spans the full row instead
          // of sitting alone next to empty space.
          const isOddTrailing =
            projects.length % 2 !== 0 && i === projects.length - 1;
          const spanClassName = isOddTrailing
            ? "sm:col-span-2 lg:col-span-3"
            : i % 2 === 0
              ? "lg:col-span-2"
              : undefined;

          return (
            <Reveal key={project.id} delay={(i % 3) * 0.08} className={spanClassName}>
              <ProjectCard project={project} />
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
