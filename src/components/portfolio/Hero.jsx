import { ArrowDown, Download, MapPin } from 'lucide-react';
import Reveal from '@/components/portfolio/Reveal';
import { downloadCv } from '@/lib/generateCv';
import { profile as defaultProfile } from '@/data/portfolioContent';
import useInView from '@/hooks/useInView';
import { cn } from '@/lib/utils';

const parseYear = (value) => {
  const n = parseInt(String(value || '').slice(0, 4), 10);
  return Number.isFinite(n) ? n : null;
};

// Frise des années de parcours, de la première prise de poste à aujourd'hui.
function PlanBar({ experiences }) {
  const [ref, on] = useInView({ threshold: 0.6 });
  const now = new Date().getFullYear();
  const starts = (experiences || []).map((e) => parseYear(e.start)).filter(Boolean);
  const first = starts.length ? Math.min(...starts) : 2000;
  const span = Math.max(now - first, 1);
  const marks = [...new Set([first, ...starts, now])].sort((a, b) => a - b);

  return (
    <div ref={ref} aria-hidden="true" className={cn('relative h-12', on && 'is-on')}>
      <div className="plan-track" />
      <div className="plan-bar" />
      {marks.map((year) => {
        const left = ((year - first) / span) * 100;
        const delay = `${0.1 + (left / 100) * 1.2}s`;
        return (
          <span key={year}>
            <i className={cn('plan-dot', year === now && 'is-now')} style={{ left: `${left}%`, transitionDelay: delay }} />
            <span
              className="absolute bottom-0 font-mono text-[10.5px] tracking-[0.12em] text-muted-foreground"
              style={{
                left: `${left}%`,
                transform: left > 95 ? 'translateX(-100%)' : left < 5 ? 'none' : 'translateX(-50%)',
              }}
            >
              {year === now ? (
                <>
                  <span className="md:hidden">{year}</span>
                  <span className="hidden md:inline">Aujourd&apos;hui</span>
                </>
              ) : (
                year
              )}
            </span>
          </span>
        );
      })}
    </div>
  );
}

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

          <Reveal delay={0.38}>
            <div className="mt-16 md:mt-20">
              <PlanBar experiences={experiences} />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}