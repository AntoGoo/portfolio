import Reveal from '@/components/portfolio/Reveal';
import { cn } from '@/lib/utils';

// En-tête de section façon dossier de projet : référence en mono, titre en serif.
export default function Section({ id, index, eyebrow, title, lead, children, className }) {
  return (
    <section id={id} className={cn('py-[clamp(4.5rem,10vw,9rem)]', className)}>
      <div className="rm-container">
        <Reveal>
          <header className="grid gap-x-10 gap-y-5 border-t rm-rule pt-6 md:grid-cols-12">
            <p className="rm-label md:col-span-3 md:pt-3">
              <span className="text-primary">§ {index}</span>
              <span className="mx-2 opacity-40">/</span>
              {eyebrow}
            </p>
            <div className="md:col-span-9">
              <h2 className="rm-display max-w-[18ch] text-balance text-[clamp(2.4rem,5.2vw,4.75rem)]">{title}</h2>
              {lead && (
                <p className="mt-6 max-w-[52ch] text-[clamp(1.0625rem,0.4vw+0.95rem,1.1875rem)] leading-[1.55] text-muted-foreground">
                  {lead}
                </p>
              )}
            </div>
          </header>
        </Reveal>
        <div className="pt-[clamp(2.5rem,5vw,4.5rem)]">{children}</div>
      </div>
    </section>
  );
}
