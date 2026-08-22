export type Project = {
  id: string;
  title: string;
  role: string;
  description: string;
  tags: string[];
  /** Path under /public, e.g. "/images/projects/my-project.jpg". Leave undefined to show a placeholder. */
  image?: string;
  /** Live URL. Leave undefined to show a "link coming soon" badge instead of a dead link. */
  link?: string;
};

export type SocialLink = {
  label: string;
  href?: string;
};

export type Profile = {
  name: string;
  role: string;
  tagline: string;
  bio: string;
  location?: string;
  email?: string;
  /** Path under /public, e.g. "/images/profile.jpg". Leave undefined to show the monogram placeholder. */
  photo?: string;
  /** Path under /public, e.g. "/resume.pdf". Leave undefined to hide the resume link. */
  resume?: string;
  socials: SocialLink[];
};

export type Experience = {
  id: string;
  title: string;
  org: string;
  period: string;
  points: string[];
};
