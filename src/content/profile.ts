import type { Profile } from "./types";

// Edit everything below — this is the only file you need to touch
// to change who this site says you are.
export const profile: Profile = {
  name: "Keya Chaudhary",
  role: "Your role or title",
  tagline: "A one-line hook about what you do and who it's for.",
  bio: "Two or three sentences about who you are, what kind of work you do, and what you're looking for right now. Specific beats clever — name the tools, the domain, the kind of problem you like solving.",
  location: "City, Country",
  email: "chaudhary.keya18@gmail.com",
  photo: undefined, // e.g. "/images/profile.jpg" — drop the file into public/images and set this
  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/keya-chaudhary/" },
    { label: "GitHub", href: "https://github.com/keya-05" },
  ],
};
