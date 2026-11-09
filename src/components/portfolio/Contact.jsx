import { Download, Linkedin, Mail, MapPin } from 'lucide-react';
import Section from '@/components/portfolio/Section';
import Reveal from '@/components/portfolio/Reveal';
import { downloadCv } from '@/lib/generateCv';
import { profile as defaultProfile } from '@/data/portfolioContent';

export default function Contact({ profile = defaultProfile, experiences }) {
  const email = profile.email;
  const linkedin = profile.linkedin;

  return (
    <Section
      id="contact"
      index="08"
      eyebrow="Contact"
      title="Vous avez un projet à structurer, une équipe à coordonner ou une transformation numérique à accompagner ?"
      lead="Échangeons."
    >
      <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border/60 sm:grid-cols-2 lg:grid-cols-3">
        <Reveal className="bg-card">
          <a
            href={email ? `mailto:${email}` : '#contact'}
            className="group flex h-full flex-col justify-between gap-8 p-7 transition-colors hover:bg-secondary/40"
          >
            <div className="flex items-center justify-between">
              <Mail className="h-5 w-5 text-primary" strokeWidth={1.6} />
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">E-mail</span>
            </div>
            <div>
              <p className="font-heading text-[15px] font-medium text-foreground transition-colors group-hover:text-primary">
                {email || 'Adresse à renseigner'}
              </p>
              <p className="mt-1 text-[12.5px] text-muted-foreground">Écrire un message</p>
            </div>
          </a>
        </Reveal>

        <Reveal delay={0.05} className="bg-card">
          <a
            href={linkedin || '#contact'}
            target={linkedin ? '_blank' : undefined}
            rel="noopener noreferrer"
            className="group flex h-full flex-col justify-between gap-8 p-7 transition-colors hover:bg-secondary/40"
          >
            <div className="flex items-center justify-between">
              <Linkedin className="h-5 w-5 text-primary" strokeWidth={1.6} />
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">LinkedIn</span>
            </div>
            <div>
              <p className="font-heading text-[15px] font-medium text-foreground transition-colors group-hover:text-primary">
                {linkedin ? 'Voir le profil' : 'Profil à renseigner'}
              </p>
              <p className="mt-1 text-[12.5px] text-muted-foreground">Réseau professionnel</p>
            </div>
          </a>
        </Reveal>

        <Reveal delay={0.1} className="bg-card">
          <div className="flex h-full flex-col justify-between gap-8 p-7">
            <div className="flex items-center justify-between">
              <MapPin className="h-5 w-5 text-primary" strokeWidth={1.6} />
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Localisation</span>
            </div>
            <div>
              <p className="font-heading text-[15px] font-medium">{profile.location}</p>
              <p className="mt-1 text-[12.5px] text-muted-foreground">Mobilité et interventions sur site</p>
            </div>
          </div>
        </Reveal>
      </div>

      <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-xl border border-primary/30 bg-primary/5 p-6 sm:flex-row sm:items-center md:p-8">
        <div>
          <p className="font-heading text-[16px] font-medium">Le parcours complet en une page</p>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Expériences, expertises et environnement technique au format PDF.
          </p>
        </div>
        <button
          type="button"
          onClick={() => downloadCv({ profile, experiences })}
          className="inline-flex h-[44px] items-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Download className="h-4 w-4" />
          Télécharger mon CV
        </button>
      </div>
    </Section>
  );
}