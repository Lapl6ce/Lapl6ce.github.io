// Sections live in src/professional/sections; their order here is the page order.
// Work leads, then what was used to build it; the personal and school record come after.

import ScrollEffects from "@/professional/components/ScrollEffects";
import OwnerTodo from "@/professional/owner/OwnerTodo";
import { DEMO_ACTIVE } from "@/content/demo";
import Header from "@/professional/sections/Header";
import Hero from "@/professional/sections/Hero";
import About from "@/professional/sections/About";
import Experience from "@/professional/sections/Experience";
import Projects from "@/professional/sections/Projects";
import Skills from "@/professional/sections/Skills";
import Background from "@/professional/sections/Background";
import Contact from "@/professional/sections/Contact";
import Footer from "@/professional/sections/Footer";

export default function ProfessionalPage() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <Projects />
        <Experience />
        <Skills />
        <About />
        <Background />
        <Contact />
      </main>
      <Footer />
      <ScrollEffects />
      {process.env.NODE_ENV === "development" &&
        (DEMO_ACTIVE ? (
          <a className="owner-badge" href="/settings/">
            demo preview on · settings
          </a>
        ) : (
          <OwnerTodo />
        ))}
    </>
  );
}
