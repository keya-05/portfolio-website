"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { profile } from "@/content/profile";
import ProfilePhoto from "./ProfilePhoto";
import Reveal from "./motion/Reveal";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const photoY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 60]);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="mx-auto grid max-w-screen-2xl grid-cols-1 items-center gap-10 px-6 py-16 sm:px-10 sm:py-24 lg:grid-cols-[1.2fr_.8fr] lg:gap-20 lg:px-16 lg:py-20 xl:px-24"
    >
      <Reveal className="flex flex-col items-start gap-6 text-center lg:text-left">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-wine">
          Portfolio
        </span>
        <h1 className="text-balance font-display text-4xl font-bold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl">
          {profile.name}
        </h1>
        <p className="max-w-xl text-lg leading-relaxed text-ink-2">
          {profile.tagline}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
          <a
            href="#work"
            className="rounded-full bg-wine px-6 py-3 text-sm font-semibold text-bg shadow-card transition-colors hover:bg-wine-2"
          >
            See my work
          </a>
          <a
            href="#contact"
            className="rounded-full border border-line-2 bg-surface px-6 py-3 text-sm font-semibold text-ink transition-colors hover:border-wine hover:text-wine"
          >
            Get in touch
          </a>
        </div>
      </Reveal>
      <motion.div
        style={{ y: photoY }}
        className="mx-auto w-full max-w-xs lg:mx-0 lg:max-w-none"
      >
        <ProfilePhoto src={profile.photo} name={profile.name} />
      </motion.div>
    </section>
  );
}
