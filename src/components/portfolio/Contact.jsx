import { Download } from 'lucide-react';
import Reveal from '@/components/portfolio/Reveal';
import { SectionHeading } from '@/components/portfolio/Section';
import { downloadCv } from '@/lib/generateCv';
import { profile as defaultProfile } from '@/data/portfolioContent';

function ContactBlock({ label, children }) {
  return (
    <div className="px-7 py-[26px]">
      <p className="flex items-center gap-2.5 font-heading text-[14px] font-medium text-muted-foreground">
        <span aria-hidden="true" className="h-[7px] w-[7px] shrink-0 bg-primary" />
        {label}
      </p>
      <div className="mt-2">{children}</div>
    </div>
  );
}

const valueClass = 'font-heading text-[18px] font-semibold leading-snug text-foreground';

export default function Contact({ profile = defaultProfile, experiences }) {
  const email = profile.email;
  const linkedin = profile.linkedin;

  return (
    <section id="contact" className="border-t border-border/70 py-20 md:py-28">
      <div className="mx-auto grid w-full max-w-[1200px] gap-12 px-6 md:px-10 lg:grid-cols-[1.15fr_1fr] lg:items-start lg:gap-20">
        <Reveal>
          <SectionHeading index="07" eyebrow="Contact" title={'Un projet à concrétiser ? Échangeons ensemble.'} />
          <button
            type="button"
            onClick={() => downloadCv({ profile, experiences })}
            className="mt-12 inline-flex h-[54px] w-full items-center justify-center gap-2.5 rounded-[6px] border border-primary px-7 text-[16px] font-medium text-primary transition-colors hover:bg-primary/10 md:w-auto"
          >
            <Download className="h-[18px] w-[18px]" />
            Télécharger mon CV
          </button>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="divide-y divide-border rounded-[10px] border border-border bg-card">
            <ContactBlock label="E-mail">
              <a
                href={email ? `mailto:${email}` : '#contact'}
                className={`${valueClass} transition-colors [overflow-wrap:anywhere] hover:text-primary`}
              >
                {/* Sur petit écran, l'adresse passe à la ligne après « @ » plutôt qu'en plein mot. */}
                {email ? (
                  <>
                    {email.slice(0, email.indexOf('@') + 1)}
                    <wbr />
                    {email.slice(email.indexOf('@') + 1)}
                  </>
                ) : (
                  'Adresse à renseigner'
                )}
              </a>
            </ContactBlock>

            <ContactBlock label="LinkedIn">
              <a
                href={linkedin || '#contact'}
                target={linkedin ? '_blank' : undefined}
                rel="noopener noreferrer"
                className={`${valueClass} transition-colors hover:text-primary`}
              >
                {linkedin ? 'Voir le profil ↗' : 'Profil à renseigner'}
              </a>
            </ContactBlock>

            <ContactBlock label="Localisation">
              <p className={valueClass}>{profile.location}</p>
            </ContactBlock>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
