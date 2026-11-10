import { useEffect, useRef, useState } from 'react';
import { Download } from 'lucide-react';
import Reveal from '@/components/portfolio/Reveal';
import { SectionHeading } from '@/components/portfolio/Section';
import { downloadCv } from '@/lib/generateCv';
import { profile as defaultProfile } from '@/data/portfolioContent';

function ContactBlock({ label, children, note }) {
  return (
    <div className="px-7 py-[26px]">
      <p className="flex items-center gap-2.5 font-heading text-[14px] font-medium text-muted-foreground">
        <span aria-hidden="true" className="h-[7px] w-[7px] shrink-0 bg-primary" />
        {label}
      </p>
      <div className="mt-2.5">{children}</div>
      <p className="mt-1.5 text-[14px] text-muted-foreground">{note}</p>
    </div>
  );
}

const valueClass = 'font-heading text-[22px] font-semibold leading-snug text-foreground';

export default function Contact({ profile = defaultProfile, experiences }) {
  const email = profile.email;
  const linkedin = profile.linkedin;
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // Presse-papiers refusé ou indisponible : le lien mailto reste là.
    }
  };

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
            <ContactBlock label="E-mail" note="Écrire un message">
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
                <a
                  href={email ? `mailto:${email}` : '#contact'}
                  className={`${valueClass} min-w-0 transition-colors [overflow-wrap:anywhere] hover:text-primary`}
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
                {email && (
                  <button
                    type="button"
                    onClick={copyEmail}
                    className="h-10 shrink-0 rounded-md border border-border px-4 text-[13px] text-muted-foreground transition-colors hover:border-muted-foreground/60 hover:text-foreground"
                  >
                    <span aria-live="polite">{copied ? 'Copié' : 'Copier'}</span>
                  </button>
                )}
              </div>
            </ContactBlock>

            <ContactBlock label="LinkedIn" note="Réseau professionnel">
              <a
                href={linkedin || '#contact'}
                target={linkedin ? '_blank' : undefined}
                rel="noopener noreferrer"
                className={`${valueClass} transition-colors hover:text-primary`}
              >
                {linkedin ? 'Voir le profil ↗' : 'Profil à renseigner'}
              </a>
            </ContactBlock>

            <ContactBlock label="Localisation" note="Mobilité et interventions sur site">
              <p className={valueClass}>{profile.location}</p>
            </ContactBlock>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
