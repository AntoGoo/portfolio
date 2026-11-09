import { ArrowUpRight, Download } from 'lucide-react';
import Reveal from '@/components/portfolio/Reveal';
import { downloadCv } from '@/lib/generateCv';
import { profile as defaultProfile } from '@/data/portfolioContent';

// Section finale en négatif : l'encre devient le fond.
export default function Contact({ profile = defaultProfile, experiences }) {
  const { email, linkedin } = profile;

  return (
    <section id="contact" className="bg-foreground pb-16 pt-[clamp(5rem,11vw,10rem)] text-background">
      <div className="rm-container">
        <Reveal>
          <p className="rm-label text-background/55">
            <span className="text-primary">§ 07</span>
            <span className="mx-2 opacity-40">/</span>
            Contact
          </p>
          <h2 className="rm-display mt-8 max-w-[19ch] text-[clamp(2.6rem,6.2vw,6.25rem)] text-balance">
            Un projet à structurer, une équipe à coordonner ?{' '}
            <em className="text-primary">Échangeons.</em>
          </h2>
        </Reveal>

        <div className="mt-[clamp(3rem,7vw,6rem)] grid border-t border-background/20 md:grid-cols-12">
          {email && (
            <Reveal className="border-b border-background/20 py-8 md:col-span-6 md:border-r md:pr-10">
              <p className="rm-label text-background/55">E-mail</p>
              <a
                href={`mailto:${email}`}
                className="group mt-4 flex items-center justify-between gap-4 font-display text-[clamp(1.5rem,2.8vw,2.5rem)] leading-tight"
              >
                <span className="rm-link break-all">{email}</span>
                <ArrowUpRight className="h-6 w-6 shrink-0 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
              </a>
            </Reveal>
          )}
          {linkedin && (
            <Reveal delay={0.06} className="border-b border-background/20 py-8 md:col-span-6 md:pl-10">
              <p className="rm-label text-background/55">LinkedIn</p>
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-4 flex items-center justify-between gap-4 font-display text-[clamp(1.5rem,2.8vw,2.5rem)] leading-tight"
              >
                <span className="rm-link">Voir le profil</span>
                <ArrowUpRight className="h-6 w-6 shrink-0 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
              </a>
            </Reveal>
          )}
        </div>

        <Reveal delay={0.1}>
          <div className="flex flex-col items-start justify-between gap-6 py-10 sm:flex-row sm:items-center">
            <p className="max-w-[40ch] text-[16px] leading-[1.55] text-background/70">
              Le parcours complet en une page : expériences, expertises et environnement technique, au format PDF.
            </p>
            <button
              type="button"
              onClick={() => downloadCv({ profile, experiences })}
              className="inline-flex h-12 shrink-0 items-center gap-3 bg-primary px-6 text-[15px] font-medium text-primary-foreground transition-colors duration-300 hover:bg-background hover:text-foreground"
            >
              <Download className="h-4 w-4" />
              Télécharger le CV
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
