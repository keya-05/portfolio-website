"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { profile } from "@/content/profile";
import ThemeToggle from "./ThemeToggle";

const links = [
  { href: "#home", label: "Home" },
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export default function NavBar() {
  const [active, setActive] = useState("#home");

  useEffect(() => {
    const sections = links
      .map((l) => document.querySelector<HTMLElement>(l.href))
      .filter((el): el is HTMLElement => el !== null);

    let ticking = false;

    function updateActive() {
      ticking = false;
      const activationLine = window.innerHeight * 0.35;

      // Sections are in document order, so the last one that has scrolled
      // past the activation line is the current section — recomputed fresh
      // from actual positions every time, so scrolling up is just as correct
      // as scrolling down.
      let current = sections[0];
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= activationLine) {
          current = section;
        }
      }

      // A short final section can end before its top ever reaches the
      // activation line, so force it active once the page is fully scrolled.
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      if (atBottom) current = sections[sections.length - 1];

      if (current) setActive(`#${current.id}`);
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(updateActive);
    }

    updateActive();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const initials = profile.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="sticky top-4 z-50 flex justify-center gap-2 px-4">
      <nav className="flex w-full max-w-2xl items-center justify-between gap-2 rounded-full border border-line-2 bg-coral px-2 py-2 shadow-card">
        <a
          href="#home"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-foam font-display text-sm font-bold text-coral"
        >
          {initials}
        </a>
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {links
            .filter((l) => l.href !== "#home")
            .map((link) => {
              const isActive = active === link.href;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className="relative whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium text-foam/85 transition-colors"
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="absolute inset-0 rounded-full bg-coral-2"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative">{link.label}</span>
                </a>
              );
            })}
        </div>
      </nav>
      <ThemeToggle />
    </div>
  );
}
