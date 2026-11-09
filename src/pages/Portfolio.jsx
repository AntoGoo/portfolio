import usePortfolioData from '@/hooks/usePortfolioData';
import Nav from '@/components/portfolio/Nav';
import Hero from '@/components/portfolio/Hero';
import About from '@/components/portfolio/About';
import Expertises from '@/components/portfolio/Expertises';
import Projects from '@/components/portfolio/Projects';
import Method from '@/components/portfolio/Method';
import Skills from '@/components/portfolio/Skills';
import Timeline from '@/components/portfolio/Timeline';
import Contact from '@/components/portfolio/Contact';
import Footer from '@/components/portfolio/Footer';

export default function Portfolio() {
  const { profile, projects, experiences } = usePortfolioData();

  return (
    <div className="bg-page min-h-screen">
      <Nav profile={profile} />
      <main>
        <Hero profile={profile} experiences={experiences} />
        <About />
        <Expertises />
        <Projects projects={projects} />
        <Method />
        <Skills />
        <Timeline experiences={experiences} />
        <Contact profile={profile} experiences={experiences} />
      </main>
      <Footer profile={profile} />
    </div>
  );
}