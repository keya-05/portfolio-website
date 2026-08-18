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
    "relative aspect-[16/10] overflow-hidden rounded-[14px] border border-line-2 bg-surface-2";

  const imageContent = project.image ? (
    <Image
      src={project.image}
      alt={project.title}
      fill
      sizes="(min-width: 1024px) 480px, 90vw"
      className="object-cover"
    />
  ) : (
    <div
      className="flex h-full w-full flex-col items-center justify-center gap-2 text-ink-3"
      style={{
        backgroundImage:
          "repeating-linear-gradient(135deg, rgb(var(--color-coral) / 0.08) 0px, rgb(var(--color-coral) / 0.08) 10px, transparent 10px, transparent 20px)",
      }}
    >
      <ImageIcon size={22} strokeWidth={1.5} />
      <span className="font-mono text-xs">Image coming soon</span>
    </div>
  );

  return (
    <TiltCard className="flex h-full flex-col gap-4 rounded-card border border-line bg-surface/90 p-5 shadow-card backdrop-blur-sm">
      {mounted && !reduce ? (
        <motion.div
          className={imageFrameClassName}
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          whileInView={{ clipPath: "inset(0 0 0% 0)" }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {imageContent}
        </motion.div>
      ) : (
        <div className={imageFrameClassName}>{imageContent}</div>
      )}

      <div className="flex flex-col gap-1.5">
        <h3 className="font-display text-lg font-bold text-ink">
          {project.title}
        </h3>
        <p className="text-sm font-medium text-coral">{project.role}</p>
        <p className="text-sm leading-relaxed text-ink-2">
          {project.description}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {project.tags.map((tag, i) => (
          <span
            key={`${project.id}-tag-${i}`}
            className="rounded-full border border-line bg-surface-2 px-2.5 py-1 font-mono text-xs text-ink-2"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-auto pt-1">
        {project.link ? (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm font-semibold text-coral hover:underline"
          >
            View project <ArrowUpRight size={14} />
          </a>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full border border-dashed border-line-2 px-3 py-1 font-mono text-xs text-ink-3">
            Link coming soon
          </span>
        )}
      </div>
    </TiltCard>
  );
}
