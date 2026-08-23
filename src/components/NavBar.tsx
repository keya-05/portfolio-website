"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Home } from "lucide-react";

const links = [
  { href: "#home", label: "Home" },
  { href: "#work", label: "Projects" },
  { href: "#experience", label: "Experience" },
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

  return (
    <div className="sticky top-0 z-50 w-full bg-wine shadow-card">
      <nav className="mx-auto flex max-w-screen-2xl items-center justify-between px-6 py-3 sm:px-10 lg:px-16 xl:px-24">
        <a
          href="#home"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-cream/40 text-cream transition-colors hover:bg-cream/10"
          aria-label="Home"
        >
          <Home size={17} strokeWidth={1.75} />
        </a>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar sm:gap-3">
          {links
            .filter((l) => l.href !== "#home")
            .map((link) => {
              const isActive = active === link.href;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className="relative whitespace-nowrap rounded-full px-3 py-1.5 font-serif text-xl text-cream/85 transition-colors sm:text-2xl"
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="absolute inset-0 rounded-full bg-cream/10"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative">{link.label}</span>
                </a>
              );
            })}
        </div>
      </nav>
    </div>
  );
}
