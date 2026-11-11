import Section from '@/components/portfolio/Section';
import Reveal from '@/components/portfolio/Reveal';
import { cn } from '@/lib/utils';
import { siteTexts } from '@/data/portfolioContent';

export default function About({ texts = siteTexts.about }) {
  return (
    <Section
      id="profil"
      index="01"
      eyebrow={texts.eyebrow}
      title={texts.title}
      lead={texts.lead}
    >
      <div className="space-y-[18px] md:w-8/12">
        {texts.intro && (
          <p className="max-w-[65ch] text-[19px] leading-relaxed text-foreground/85">{texts.intro}</p>
        )}
        {texts.paragraphs.filter(Boolean).map((text) => (
          <p key={text} className="max-w-[65ch] text-base leading-relaxed text-muted-foreground">
            {text}
          </p>
        ))}
      </div>

      <div className="mt-14 grid gap-4 md:grid-cols-2">
        {texts.principles.map((item, i) => {
          const featured = i === 0;
          return (
            <Reveal key={i} delay={0.06 * i} className={cn(featured && 'md:row-span-2')}>
              <div
                className={cn(
                  'h-full rounded-2xl border',
                  featured ? 'border-muted-foreground/25 bg-secondary p-7 md:p-9' : 'border-border bg-card p-7'
                )}
              >
                <h3
                  className={cn(
                    'font-heading text-foreground',
                    featured
                      ? 'text-[34px] font-extrabold leading-[1.1] tracking-[-0.02em]'
                      : 'text-[20px] font-bold leading-snug tracking-[-0.01em]'
                  )}
                >
                  {item.title}
                </h3>
                <div className={cn('mt-4 flex flex-col gap-3.5', featured && 'max-w-[470px]')}>
                  <p className="text-[17px] leading-relaxed text-foreground/85">{item.lead}</p>
                  {item.detail.filter(Boolean).map((text) => (
                    <div key={text} className="flex items-start gap-3">
                      <span aria-hidden="true" className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-[2px] bg-primary" />
                      <p className="text-[15px] leading-relaxed text-muted-foreground">{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
