import Section from '@/components/portfolio/Section';
import { downloadCv } from '@/lib/generateCv';
import { profile as defaultProfile } from '@/data/portfolioContent';

export default function Contact({ profile = defaultProfile, experiences }) {
  const { email, linkedin, location } = profile;

  const rows = [
    email && { label: 'E-mail', value: email, href: `mailto:${email}` },
    linkedin && { label: 'LinkedIn', value: 'Voir le profil', href: linkedin, external: true },
    { label: 'Localisation', value: `${location}, mobilité et interventions sur site` },
  ].filter(Boolean);

  return (
    <Section
      id="contact"
      dark
      title="Un projet à structurer, une équipe à coordonner ?"
      lead="Échangeons."
    >
      <dl className="border-t border-foreground">
        {rows.map((row) => (
          <div key={row.label} className="grid grid-cols-12 items-baseline gap-y-1 border-b border-border py-6">
            <dt className="col-span-12 text-[14px] text-muted-foreground md:col-span-3">{row.label}</dt>
            <dd className="col-span-12 text-[1.4rem] font-semibold tracking-[-0.02em] md:col-span-9 md:text-[2rem]">
              {row.href ? (
                <a
                  href={row.href}
                  className="line-link"
                  target={row.external ? '_blank' : undefined}
                  rel={row.external ? 'noopener noreferrer' : undefined}
                >
                  {row.value}
                </a>
              ) : (
                row.value
              )}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-10 flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
        <p className="max-w-[48ch] text-[16px] text-muted-foreground">
          Le parcours complet en une page : expériences, expertises et environnement technique, au format PDF.
        </p>
        <button
          type="button"
          onClick={() => downloadCv({ profile, experiences })}
          className="h-12 bg-primary px-6 text-[15px] font-semibold text-primary-foreground transition-colors hover:bg-primary/85"
        >
          Télécharger le CV
        </button>
      </div>
    </Section>
  );
}
