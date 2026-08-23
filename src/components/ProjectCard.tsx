"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { ArrowUpRight, ImageIcon } from "lucide-react";
import type { Project } from "@/content/types";
import TiltCard from "./motion/TiltCard";

export default function ProjectCard({ project }: { project: Project }) {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const imageFrameClassName =
    "relative h-48 sm:h-56 overflow-hidden rounded-[28px] border border-cream/20 bg-surface";

  const imageContent = project.image ? (
    <Image
      src={project.image}
      alt={project.title}
      fill
      sizes="(min-width: 1024px) 480px, 90vw"
      className="object-contain"
    />
  ) : (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-ink-3">
      <ImageIcon size={22} strokeWidth={1.5} />
      <span className="font-mono text-xs">Image coming soon</span>
    </div>
  );

  return (
    <TiltCard className="flex h-full flex-col gap-3 rounded-[28px] border border-wine bg-wine p-4 shadow-card sm:p-5">
      {mounted && !reduce ? (
        <motion.div
          className={imageFrameClassName}
          initial={{ clipPath: "inset(0 0 100% 0 round 28px)" }}
          whileInView={{ clipPath: "inset(0 0 0% 0 round 28px)" }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {imageContent}
        </motion.div>
      ) : (
        <div className={imageFrameClassName}>{imageContent}</div>
      )}

      <div className="flex flex-col gap-1">
        <h3 className="font-serif text-2xl leading-tight text-cream">
          {project.title}
        </h3>
        <p className="text-sm font-medium text-cream/70">{project.role}</p>
        <p className="line-clamp-2 text-sm leading-relaxed text-cream/70">
          {project.description}
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {project.tags.map((tag, i) => (
          <span
            key={`${project.id}-tag-${i}`}
            className="rounded-full border border-cream/25 px-2.5 py-0.5 font-mono text-xs text-cream/70"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-auto">
        {project.link ? (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm font-semibold text-cream hover:underline"
          >
            View project <ArrowUpRight size={14} />
          </a>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full border border-dashed border-cream/25 px-3 py-1 font-mono text-xs text-cream/60">
            Link coming soon
          </span>
        )}
      </div>
    </TiltCard>
  );
}
