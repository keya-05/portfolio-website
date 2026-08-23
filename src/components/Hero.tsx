"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { profile } from "@/content/profile";
import ProfilePhoto from "./ProfilePhoto";
import Reveal from "./motion/Reveal";

function ResumeDoodle() {
  return (
    <svg
      viewBox="0 0 240 110"
      className="h-20 w-40 shrink-0 text-doodle sm:h-24 sm:w-48"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4,58 C34,20 54,92 86,64 C104,48 92,16 70,24 C50,31 58,64 90,72 C132,82 176,58 205,42"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M205,42 L192,36 M205,42 L195,54"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

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
      className="mx-auto max-w-screen-2xl px-6 py-16 sm:px-10 sm:py-24 lg:px-16 lg:py-20 xl:px-24"
    >
      <div className="grid grid-cols-1 items-center gap-10 rounded-[32px] border-2 border-wine/25 bg-surface/60 p-8 shadow-card sm:p-12 lg:grid-cols-[1.2fr_.8fr] lg:gap-20 lg:p-16">
        <Reveal className="flex flex-col items-start gap-6 text-center lg:text-left">
          <span className="font-script text-3xl text-ink sm:text-4xl">Hi, I&apos;m</span>
          <div className="rounded-2xl bg-wine px-7 py-3 shadow-card">
            <h1 className="font-script text-3xl leading-none text-cream sm:text-5xl">
              {profile.name}
            </h1>
          </div>
          <p className="max-w-xl font-serif text-xl italic leading-relaxed text-ink-2 sm:text-2xl">
            {profile.tagline}
          </p>

          {profile.resume && (
            <div className="flex items-center gap-1 self-center lg:self-start">
              <span className="max-w-[8rem] font-serif text-lg italic leading-tight text-ink-2 sm:max-w-[10rem] sm:text-xl">
                Here&apos;s my resume
              </span>
              <ResumeDoodle />
              <a
                href={profile.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border border-wine bg-placeholder text-center font-script text-2xl text-wine shadow-card transition-transform hover:scale-105 sm:h-28 sm:w-28 sm:text-3xl"
              >
                resume
              </a>
            </div>
          )}
        </Reveal>
        <motion.div
          style={{ y: photoY }}
          className="mx-auto w-full max-w-xs lg:mx-0 lg:max-w-none"
        >
          <ProfilePhoto src={profile.photo} name={profile.name} />
        </motion.div>
      </div>
    </section>
  );
}
