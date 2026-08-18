import NavBar from "@/components/NavBar";
import Hero from "@/components/Hero";
import ProjectsGrid from "@/components/ProjectsGrid";
import About from "@/components/About";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <main className="relative z-10 min-h-screen">
      <NavBar />
      <Hero />
      <ProjectsGrid />
      <About />
      <Contact />
    </main>
  );
}
