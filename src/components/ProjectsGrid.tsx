import { projects } from "@/content/projects";
import ProjectCard from "./ProjectCard";
import Reveal from "./motion/Reveal";

export default function ProjectsGrid() {
  return (
    <section id="work" className="mx-auto max-w-screen-2xl px-6 py-10 sm:px-10 sm:py-12 lg:px-16 xl:px-24">
      <Reveal className="mb-6 text-center lg:text-right">
        <h2 className="text-balance font-serif text-5xl text-wine sm:text-6xl">
          Projects
        </h2>
      </Reveal>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, i) => {
          // Pairs of (wide, normal) fill exactly 3 columns per row, and which
          // side is wide flips every row so the layout reads big/small, then
          // small/big, and so on. When the total is odd, the leftover last
          // card spans the full row instead of sitting alone next to empty space.
          const isOddTrailing =
            projects.length % 2 !== 0 && i === projects.length - 1;
          const row = Math.floor(i / 2);
          const posInRow = i % 2;
          const isWide = isOddTrailing
            ? false
            : row % 2 === 0
              ? posInRow === 0
              : posInRow === 1;
          const spanClassName = isOddTrailing
            ? "sm:col-span-2 lg:col-span-3"
            : isWide
              ? "lg:col-span-2"
              : undefined;

          return (
            <Reveal key={project.id} delay={(i % 3) * 0.08} className={spanClassName}>
              <ProjectCard project={project} wide={isWide} />
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
