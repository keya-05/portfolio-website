import { profile } from "@/content/profile";
import Reveal from "./motion/Reveal";

export default function About() {
  return (
    <section id="about" className="mx-auto max-w-screen-2xl px-6 py-16 sm:px-10 sm:py-20 lg:px-16 xl:px-24">
      <Reveal className="grid grid-cols-1 gap-8 rounded-[28px] border border-wine bg-wine p-8 shadow-card sm:p-10 lg:grid-cols-[.6fr_1fr] lg:gap-12 lg:p-14">
        <div className="flex flex-col gap-2">
          <span className="font-script text-3xl text-cream">About</span>
          <h2 className="text-balance font-display text-2xl font-bold text-cream">
            {profile.role}
          </h2>
          {profile.location && (
            <p className="text-sm text-cream/60">{profile.location}</p>
          )}
        </div>
        <p className="max-w-2xl font-serif text-lg italic leading-relaxed text-cream/85">
          {profile.bio}
        </p>
      </Reveal>
    </section>
  );
}
