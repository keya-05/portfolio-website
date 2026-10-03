import type { ReactNode } from 'react';
import {
  availability,
  contactChannels,
  education,
  experience,
  links,
  profile,
  projects,
  secretMission,
  site,
  skills,
} from '../../data/content';
import { useGame } from '../shell/GameContext';

const ext = { target: '_blank', rel: 'noopener noreferrer' } as const;

function ExtLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} {...ext} className="text-yellow underline underline-offset-4 hover:text-off-white">
      {children} ↗<span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  const id = `c-${title.toLowerCase().replace(/\s+/g, '-')}`;
  return (
    <section className="border-t border-off-white/15 py-10" aria-labelledby={id}>
      <h2 id={id} className="font-ui text-sm font-bold uppercase tracking-hud text-yellow">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function ProjectEntry({ p }: { p: typeof secretMission }) {
  return (
    <li>
      <h3 className="text-lg font-semibold">
        {p.title} <span className="text-sm font-normal text-hud-gray">· {p.type}{p.status ? ` · ${p.status}` : ''}</span>
      </h3>
      <p className="text-sm text-hud-gray">
        {p.tech.join(', ')} · Scope {p.scope}/100
      </p>
      <dl className="mt-2 space-y-1 text-off-white/85">
        <div><dt className="inline font-semibold">Objective: </dt><dd className="inline">{p.objective}</dd></div>
        <div><dt className="inline font-semibold">Problem: </dt><dd className="inline">{p.problem}</dd></div>
        <div><dt className="inline font-semibold">Approach: </dt><dd className="inline">{p.approach}</dd></div>
        <div><dt className="inline font-semibold">Result: </dt><dd className="inline">{p.result}</dd></div>
      </dl>
      {(p.live || p.github) && (
        <p className="mt-2 flex gap-5">
          {p.live && <ExtLink href={p.live}>Live project</ExtLink>}
          {p.github && <ExtLink href={p.github}>Source code</ExtLink>}
        </p>
      )}
    </li>
  );
}

/** Plain, readable, motion-free layout of the exact same content. */
export function ClassicView() {
  const { setClassic } = useGame();

  return (
    <div className="min-h-screen bg-black font-body text-off-white">
      <a href="#classic-main" className="skip-link">
        Skip to content
      </a>
      <header className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-4 px-5 py-6">
        <span className="font-ui font-bold uppercase tracking-hud">{site.name}</span>
        <button
          type="button"
          onClick={() => setClassic(false)}
          className="min-h-[44px] bg-yellow px-4 font-ui text-sm font-bold uppercase tracking-hud text-black hover:bg-off-white"
        >
          Back to game view
        </button>
      </header>

      <main id="classic-main" tabIndex={-1} className="mx-auto max-w-3xl px-5 pb-20 leading-relaxed">
        <h1 className="font-display text-5xl uppercase sm:text-6xl">{profile.fullName}</h1>
        <p className="mt-2 text-lg text-off-white/80">
          {profile.roleLines.join(' · ')} · {profile.location}
        </p>
        <p className="mt-6 text-off-white/85">{profile.bio}</p>
        <p className="mt-6">
          <a href={links.resume} download className="text-yellow underline underline-offset-4 hover:text-off-white">
            Download résumé (PDF)
          </a>
        </p>

        <Block title="Skills">
          <ul className="grid gap-x-8 gap-y-1 sm:grid-cols-2">
            {skills.map((s) => (
              <li key={s.name}>
                {s.name} <span className="text-hud-gray">(self-rated {s.level}/100)</span>
              </li>
            ))}
          </ul>
        </Block>

        <Block title="Experience">
          <ol className="space-y-8">
            {[...experience].reverse().map((e) => (
              <li key={e.id}>
                <h3 className="text-lg font-semibold">
                  {e.title}, {e.company}
                </h3>
                <p className="text-sm text-hud-gray">
                  {e.start} – {e.end} · {e.status === 'completed' ? 'Completed' : 'Current'} · {e.tech.join(', ')}
                </p>
                <p className="mt-2 text-off-white/85">{e.objective}</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-off-white/85">
                  {e.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </Block>

        <Block title="Education">
          <p className="text-lg font-semibold">{education.university}</p>
          <p className="text-off-white/85">
            {education.school} · {education.program} · Specialization: {education.specialization} · {education.status}
          </p>
          <p className="mt-1 text-off-white/85">CGPA {education.cgpa}</p>
          <h3 className="mt-6 font-semibold">Academic skills</h3>
          <ul className="mt-1 grid gap-x-8 gap-y-1 sm:grid-cols-2">
            {education.academicLoadout.map((s) => (
              <li key={s.name}>
                {s.name} <span className="text-hud-gray">({s.level}/100)</span>
              </li>
            ))}
          </ul>
          <h3 className="mt-6 font-semibold">Key courses</h3>
          <ul className="mt-2 space-y-3">
            {education.courses.map((c) => (
              <li key={c.id}>
                <span className="font-medium">{c.name}</span> <span className="text-sm text-hud-gray">({c.code})</span>
                <p className="text-sm text-off-white/80">Topics: {c.abilities.join(', ')}</p>
              </li>
            ))}
          </ul>
        </Block>

        <Block title="Projects">
          <ul className="space-y-8">
            {projects.map((p) => (
              <ProjectEntry key={p.id} p={p} />
            ))}
          </ul>
        </Block>

        <Block title="Currently building">
          <ul>
            <ProjectEntry p={secretMission} />
          </ul>
        </Block>

        <Block title="Contact">
          <ul className="space-y-2">
            {contactChannels.map((c) => (
              <li key={c.id}>
                <span className="font-medium">{c.label}: </span>
                {c.id === 'email' ? (
                  <a href={c.href} className="text-yellow underline underline-offset-4 hover:text-off-white">
                    {c.handle}
                  </a>
                ) : (
                  <ExtLink href={c.href}>{c.handle}</ExtLink>
                )}
              </li>
            ))}
          </ul>
          <h3 className="mt-6 font-semibold">Available for</h3>
          <ul className="mt-1 list-disc pl-5 text-off-white/85">
            {availability.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </Block>
      </main>
    </div>
  );
}
