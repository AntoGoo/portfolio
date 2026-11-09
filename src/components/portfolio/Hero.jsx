import { ArrowDown, Download, MapPin } from 'lucide-react';
import Reveal from '@/components/portfolio/Reveal';
import { downloadCv } from '@/lib/generateCv';
import { profile as defaultProfile } from '@/data/portfolioContent';

export default function Hero({ profile = defaultProfile, experiences }) {
  const [firstName, ...rest] = profile.name.split(' ');

  return (
    <section id="top" className="relative overflow-hidden pt-[68px]">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.55] [mask-image:radial-gradient(ellipse_at_50%_35%,black,transparent_72%)]" />
      <div className="pointer-events-none absolute -right-32 -top-24 h-[520px] w-[520px] rounded-full bg-primary/10 blur-[130px]" />
      <div className="pointer-events-none absolute -bottom-24 left-1/4 h-[280px] w-[420px] rounded-full bg-primary/5 blur-[120px]" />

      <div className="relative mx-auto grid w-full max-w-[1200px] items-center gap-14 px-6 pb-20 pt-16 md:px-10 md:pb-28 md:pt-24 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-12">
          <Reveal>
            <div className="flex items-center gap-2.5 text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              {profile.location}
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <h1 className="mt-7 font-heading text-[2.9rem] font-semibold leading-[0.94] tracking-[-0.035em] text-balance sm:text-[3.8rem] lg:text-[4.4rem]">
              {firstName}
              {rest.length > 0 && (
                <>
                  <br />
                  <span className="text-muted-foreground">{rest.join(' ')}</span>
                </>
              )}
            </h1>
          </Reveal>

          <Reveal delay={0.14}>
            <p className="mt-7 text-[12px] font-medium uppercase tracking-[0.26em] text-primary">
              {profile.role}
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="mt-8 max-w-xl font-heading text-xl font-medium leading-snug tracking-[-0.01em] text-foreground md:text-[1.6rem]">
              {profile.tagline}
            </p>
          </Reveal>

          <Reveal delay={0.26}>
            <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-muted-foreground md:text-base">
              {profile.intro}
            </p>
          </Reveal>

          <Reveal delay={0.32}>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <a
                href="#parcours"
                className="inline-flex h-[46px] items-center gap-2 rounded-md border border-primary/50 px-6 text-sm font-medium text-primary transition-all hover:border-primary hover:bg-primary/10"
              >
                Découvrir mon parcours
                <ArrowDown className="h-4 w-4" />
              </a>
              <button
                type="button"
                onClick={() => downloadCv({ profile, experiences })}
                className="inline-flex h-[46px] items-center gap-2 rounded-md border border-border px-6 text-sm font-medium text-foreground transition-all hover:border-primary/60 hover:text-primary"
              >
                <Download className="h-4 w-4" />
                Télécharger mon CV
              </button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}