import Section from '@/components/portfolio/Section';
import Reveal from '@/components/portfolio/Reveal';
import { methodSteps } from '@/data/portfolioContent';

export default function Method() {
  return (
    <Section
      id="methode"
      index="05"
      eyebrow="Méthodologie"
      title="Une démarche agile en sept étapes"
    >
      <div className="relative">
        <ol className="relative grid gap-8 md:grid-cols-7 md:gap-5">
          {/* frise mobile */}
          <span className="pointer-events-none absolute left-[17px] top-2 h-[calc(100%-1.5rem)] w-px bg-gradient-to-b from-border via-border to-transparent md:hidden" />
          {/* frise desktop */}
          <span className="pointer-events-none absolute inset-x-0 top-5 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent md:block" />

          {methodSteps.map((step, i) => (
            <Reveal key={step.number} delay={0.06 * i}>
              <li className="group relative pl-11 md:pl-0">
                <span className="absolute left-0 top-0 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background font-mono text-[10px] tracking-[0.06em] text-primary shadow-sm transition-colors duration-300 group-hover:border-primary/60 group-hover:bg-primary/10 md:static md:mb-6 md:h-10 md:w-10 md:text-[10.5px]">
                  {step.number}
                </span>
                <h3 className="font-heading text-[16.5px] font-semibold leading-snug tracking-[-0.01em] transition-colors duration-300 group-hover:text-primary md:mt-0 md:text-[15.5px]">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{step.text}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </Section>
  );
}