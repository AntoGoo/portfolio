import Section from '@/components/portfolio/Section';
import Reveal from '@/components/portfolio/Reveal';
import { clients } from '@/data/portfolioContent';

export default function Clients() {
  if (!clients?.length) return null;

  return (
    <Section
      id="references"
      index="04"
      eyebrow="Références"
      title="Clients accompagnés et produits conçus"
    >
      <ul className="grid auto-rows-fr grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {clients.map((client, i) => (
          <li key={client.name} className="h-full">
            <Reveal delay={0.04 * i} className="h-full">
              <div className="group relative flex h-full min-h-[132px] flex-col justify-between overflow-hidden rounded-xl border border-border bg-card p-5 transition-colors duration-300 hover:border-primary/45 md:min-h-[156px] md:p-6">
                <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-primary/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <span className="font-mono text-[10.5px] tracking-[0.16em] text-primary">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="mt-6">
                  <span className="block font-heading text-[17px] font-semibold leading-tight tracking-[-0.015em] transition-colors group-hover:text-primary md:text-[19px]">
                    {client.name}
                  </span>
                  {client.detail && (
                    <span className="mt-1 block text-[12.5px] leading-snug text-muted-foreground md:text-[13px]">
                      {client.detail}
                    </span>
                  )}
                </span>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  );
}
