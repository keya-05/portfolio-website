import type { Profile } from "./types";

// Edit everything below — this is the only file you need to touch
// to change who this site says you are.
export const profile: Profile = {
  name: "Keya Chaudhary",
  role: "Software Developer",
  tagline:
    "Backend-leaning software developer building AI-integrated, full-stack applications with React, Node.js, and REST APIs.",
  bio: "Software developer with a strong foundation in data structures, algorithms, object-oriented programming, and backend development. Currently pursuing a B.Tech in Computer Science (CGPA: 9.26) and skilled in SQL, Python, and full-stack development, with hands-on experience building AI-integrated applications and REST APIs. Passionate about problem-solving, software engineering, and continuously learning emerging technologies.",
  location: "India",
  email: "chaudhary.keya18@gmail.com",
  photo: undefined, // e.g. "/images/profile.jpg" — drop the file into public/images and set this
  resume: "/resume.pdf",
  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/keya-chaudhary/" },
    { label: "GitHub", href: "https://github.com/keya-05" },
  ],
};
