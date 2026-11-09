import { motion } from 'framer-motion';
import { ArrowDownRight, Download } from 'lucide-react';
import Reveal from '@/components/portfolio/Reveal';
import { downloadCv } from '@/lib/generateCv';
import { experienceSpans, extractClients, largestTeam, yearsOfExperience } from '@/lib/roadmap';
import { profile as defaultProfile } from '@/data/portfolioContent';

const ease = [0.16, 1, 0.3, 1];

// « Faire avancer les projets. Donner du sens à la technologie. » → une ligne par phrase.
const splitSentences = (text) =>
  String(text || '')
    .split(/(?<=[.!?])\s+/)
    .map((line) => line.trim())
    .filter(Boolean);

export default function Hero({ profile = defaultProfile, projects, experiences }) {
  const lines = splitSentences(profile.tagline);
  const spans = experienceSpans(experiences || []);
  const clients = extractClients(experiences || []);

  const figures = [
    { value: yearsOfExperience(spans), unit: 'ans', caption: 'de conduite de projets' },
    { value: clients.length || null, unit: 'clients', caption: 'grands comptes et secteur public' },
    { value: largestTeam(experiences || []), unit: 'personnes', caption: 'coordonnées sur un même projet' },
    { value: projects?.length || null, unit: 'projets', caption: 'détaillés plus bas' },
  ].filter((item) => item.value);

  return (
    <section id="top" className="relative pt-[88px]">
      <div className="rm-container">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b rm-rule py-5">
          <p className="rm-label">
            <span className="text-foreground">{profile.name}</span>
            <span className="mx-2 opacity-40">—</span>
            {profile.role}
          </p>
          <p className="rm-label">{profile.location}</p>
        </div>

        <h1 className="rm-display pt-[clamp(2.5rem,6vw,5rem)] text-[clamp(3rem,7.3vw,7.75rem)]">
          {lines.map((line, i) => (
            <span key={line} className="block overflow-hidden pb-[0.08em]">
              <motion.span
                className={i % 2 === 1 ? 'block italic text-primary' : 'block'}
                initial={{ y: '105%' }}
                animate={{ y: 0 }}
                transition={{ duration: 1, delay: 0.1 + i * 0.12, ease }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <div className="grid gap-x-10 gap-y-12 pb-[clamp(3rem,6vw,5rem)] pt-[clamp(2.5rem,4.5vw,4rem)] md:grid-cols-12">
          {figures.length > 0 && (
            <dl className="grid grid-cols-2 self-start border-t rm-rule md:col-span-5">
              {figures.map((item, i) => (
                <Reveal
                  key={item.unit}
                  delay={0.4 + i * 0.07}
                  className="border-b rm-rule py-5 pr-4 even:border-l even:pl-5"
                >
                  <dt className="sr-only">{item.caption}</dt>
                  <dd>
                    <span className="rm-display text-[clamp(2.5rem,4vw,3.5rem)] tabular-nums">{item.value}</span>
                    <span className="ml-2 font-mono text-[13px] text-foreground/70">{item.unit}</span>
                    <p className="mt-1.5 text-[13.5px] leading-snug text-muted-foreground">{item.caption}</p>
                  </dd>
                </Reveal>
              ))}
            </dl>
          )}

          <Reveal delay={0.3} className="md:col-span-6 md:col-start-7">
            <p className="max-w-[46ch] text-[clamp(1.0625rem,0.5vw+0.95rem,1.25rem)] leading-[1.55] text-foreground/80">
              {profile.intro}
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
              <a
                href="#realisations"
                className="group inline-flex h-12 items-center gap-3 bg-foreground px-6 text-[15px] font-medium text-background transition-colors duration-300 hover:bg-primary"
              >
                Voir les réalisations
                <ArrowDownRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
              </a>
              <button
                type="button"
                onClick={() => downloadCv({ profile, experiences })}
                className="rm-link inline-flex items-center gap-2 text-[15px] font-medium"
              >
                <Download className="h-4 w-4" />
                Télécharger le CV
              </button>
            </div>
          </Reveal>
        </div>

        {clients.length > 0 && (
          <Reveal delay={0.2}>
            <div className="grid gap-4 border-t rm-rule py-7 md:grid-cols-12 md:gap-10">
              <p className="rm-label md:col-span-3">Clients accompagnés</p>
              <p className="font-mono text-[13.5px] leading-[1.9] text-foreground/75 md:col-span-9">
                {clients.map((name, i) => (
                  <span key={name} className="whitespace-nowrap">
                    {name}
                    {i < clients.length - 1 && <span className="mx-2.5 text-primary/70">/</span>}
                  </span>
                ))}
              </p>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
