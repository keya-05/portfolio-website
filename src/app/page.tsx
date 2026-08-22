import NavBar from "@/components/NavBar";
import Hero from "@/components/Hero";
import ProjectsGrid from "@/components/ProjectsGrid";
import Experience from "@/components/Experience";
import About from "@/components/About";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <main className="min-h-screen bg-bg">
      <NavBar />
      <Hero />
      <ProjectsGrid />
      <Experience />
      <About />
      <Contact />
    </main>
  );
}
