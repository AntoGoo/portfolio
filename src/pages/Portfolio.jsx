import { MotionConfig } from 'framer-motion';
import usePortfolioData from '@/hooks/usePortfolioData';
import Nav from '@/components/portfolio/Nav';
import Hero from '@/components/portfolio/Hero';
import About from '@/components/portfolio/About';
import Roadmap from '@/components/portfolio/Roadmap';
import Projects from '@/components/portfolio/Projects';
import Expertises from '@/components/portfolio/Expertises';
import Method from '@/components/portfolio/Method';
import Skills from '@/components/portfolio/Skills';
import Contact from '@/components/portfolio/Contact';
import Footer from '@/components/portfolio/Footer';

export default function Portfolio() {
  const { profile, projects, experiences } = usePortfolioData();

  return (
    <MotionConfig reducedMotion="user">
      <div className="theme-roadmap min-h-screen overflow-x-clip">
        <Nav profile={profile} />
        <main>
          <Hero profile={profile} projects={projects} experiences={experiences} />
          <About />
          <Roadmap experiences={experiences} />
          <Projects projects={projects} />
          <Expertises />
          <Method />
          <Skills />
          <Contact profile={profile} experiences={experiences} />
        </main>
        <Footer profile={profile} />
      </div>
    </MotionConfig>
  );
}
