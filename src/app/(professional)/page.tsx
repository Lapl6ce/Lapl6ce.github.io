// Sections live in src/professional/sections; their order here is the page order.

import Terminal from "@/shared/Terminal";
import Starfield from "@/professional/components/Starfield";
import ScrollEffects from "@/professional/components/ScrollEffects";
import Header from "@/professional/sections/Header";
import Hero from "@/professional/sections/Hero";
import About from "@/professional/sections/About";
import Experience from "@/professional/sections/Experience";
import Projects from "@/professional/sections/Projects";
import Skills from "@/professional/sections/Skills";
import Education from "@/professional/sections/Education";
import Leadership from "@/professional/sections/Leadership";
import Contact from "@/professional/sections/Contact";
import Footer from "@/professional/sections/Footer";

export default function ProfessionalPage() {
  return (
    <>
      <Starfield />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Education />
        <Leadership />
        <Contact />
      </main>
      <Footer />
      <ScrollEffects />
      <Terminal mode="professional" />
    </>
  );
}
