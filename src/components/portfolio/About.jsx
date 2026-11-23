import Section from '@/components/portfolio/Section';
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
    </Section>
  );
}
