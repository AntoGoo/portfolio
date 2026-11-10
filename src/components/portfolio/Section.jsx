import Reveal from '@/components/portfolio/Reveal';
import { cn } from '@/lib/utils';

export default function Section({ id, index, eyebrow, title, lead, children, className, variant = 'default' }) {
  return (
    <section id={id} className={cn('border-t border-border/70 py-20 md:py-28', className)}>
      <div className="mx-auto w-full max-w-[1200px] px-6 md:px-10">
        <Reveal>
          <header className="border-b border-border/70 pb-8 md:pb-10">
            {variant === 'grotesk' ? (
              <div className="grid gap-5 font-grotesk md:grid-cols-[80px_1fr] md:items-end md:gap-8">
                <p className="text-[13px] leading-snug">
                  <span className="block font-medium text-primary">{index} /</span>
                  <span className="block font-normal text-muted-foreground">{eyebrow}</span>
                </p>
                <h2 className="text-[2rem] font-semibold leading-[0.98] tracking-[-0.035em] md:text-[2.5rem]">
                  {title}
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
