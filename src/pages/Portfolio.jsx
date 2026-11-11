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
  const { profile, texts, projects, experiences, ready } = usePortfolioData();

  // Les textes viennent de l'API : on attend sa réponse (ou son échec) pour ne pas
  // afficher les textes par défaut puis les remplacer sous les yeux du visiteur.
  if (!ready) return <div className="portfolio bg-page min-h-screen" />;

  return (
    <div className="portfolio bg-page min-h-screen">
      <Nav texts={texts.nav} />
      <main>
        <Hero profile={profile} texts={texts} experiences={experiences} />
        <About texts={texts.about} />
        <Expertises texts={texts.expertises} />
        <Projects projects={projects} texts={texts.projects} />
        <Method texts={texts.method} />
        <Skills texts={texts.skills} />
        <Timeline experiences={experiences} texts={texts.timeline} />
        <Contact profile={profile} texts={texts} experiences={experiences} />
      </main>
      <Footer profile={profile} texts={texts} />
    </div>
  );
}
