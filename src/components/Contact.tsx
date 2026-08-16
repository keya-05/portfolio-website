import { Link as LinkIcon, Mail } from "lucide-react";
import { profile } from "@/content/profile";
import Reveal from "./motion/Reveal";

export default function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-screen-2xl px-6 py-16 sm:px-10 sm:py-24 lg:px-16 xl:px-24">
      <Reveal className="flex flex-col items-center gap-6 rounded-card border border-line bg-surface p-10 text-center shadow-card sm:p-14">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-wine">
          Get in touch
        </span>
        <h2 className="text-balance font-display text-3xl font-bold text-ink sm:text-4xl">
          Let&apos;s work together
        </h2>

        {profile.email ? (
          <a
            href={`mailto:${profile.email}`}
            className="inline-flex items-center gap-2 rounded-full bg-wine px-6 py-3 text-sm font-semibold text-bg shadow-card transition-colors hover:bg-wine-2"
          >
            <Mail size={16} />
            {profile.email}
          </a>
        ) : (
          <span className="rounded-full border border-dashed border-line-2 px-4 py-2 font-mono text-xs text-ink-3">
            Add your email in content/profile.ts
          </span>
        )}

        <div className="flex flex-wrap items-center justify-center gap-3">
          {profile.socials.map((social) =>
            social.href ? (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full border border-line-2 bg-surface-2 px-4 py-2 text-sm font-medium text-ink-2 transition-colors hover:border-wine hover:text-wine"
              >
                <LinkIcon size={15} />
                {social.label}
              </a>
            ) : (
              <span
                key={social.label}
                className="flex items-center gap-2 rounded-full border border-dashed border-line-2 px-4 py-2 text-sm text-ink-3 opacity-70"
              >
                <LinkIcon size={15} />
                {social.label}
              </span>
            )
          )}
        </div>
      </Reveal>

      <p className="mt-10 text-center font-mono text-xs text-ink-3">
        &copy; {new Date().getFullYear()} {profile.name}
      </p>
    </section>
  );
}
