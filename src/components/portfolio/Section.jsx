import Reveal from '@/components/portfolio/Reveal';
import { cn } from '@/lib/utils';

// Point final ajouté aux titres texte qui ne se terminent pas déjà par une ponctuation.
const withPeriod = (title) =>
  typeof title === 'string' && !/[.!?…:]$/.test(title.trim()) ? `${title.trim()}.` : title;

export default function Section({ id, index, eyebrow, title, lead, children, className }) {
  return (
    <section id={id} className={cn('border-t border-border/70 py-20 md:py-28', className)}>
      <div className="mx-auto w-full max-w-[1200px] px-6 md:px-10">
        <Reveal>
          <header className="border-b border-border/70 pb-8 md:pb-10">
            {index ? (
              <div className="font-grotesk">
                <p className="font-label text-[13px] leading-snug">
                  <span className="font-medium text-primary">{index} /</span>{' '}
                  <span className="font-normal text-muted-foreground">{eyebrow}</span>
                </p>
                <h2 className="mt-3.5 text-[1.75rem] font-semibold leading-[0.98] tracking-[-0.035em] md:text-[2.5rem]">
                  {withPeriod(title)}
                </h2>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-semibold tracking-[0.24em] text-primary">{index}</span>
                  <span className="h-px w-8 bg-primary/50" />
                  <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">{eyebrow}</span>
                </div>
                <h2 className="mt-5 max-w-[26ch] font-heading text-[1.75rem] font-semibold leading-[1.12] tracking-[-0.02em] md:text-[2.2rem]">
                  {title}
                </h2>
              </>
            )}
            {lead && (
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-[17px]">
                {lead}
              </p>
            )}
          </header>
        </Reveal>
        <div className="pt-10 md:pt-14">{children}</div>
      </div>
    </section>
  );
}
