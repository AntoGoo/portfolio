import Section from '@/components/portfolio/Section';
import { clients } from '@/data/portfolioContent';

const COLS = 6;

export default function Clients() {
  if (!clients?.length) return null;
  const filler = (COLS - (clients.length % COLS)) % COLS;

  return (
    <Section id="references" dark title="Références" lead="Clients accompagnés et produits conçus.">
      <ul className="grid grid-cols-2 border-l border-t border-border sm:grid-cols-3 lg:grid-cols-6">
        {clients.map((client) => (
          <li
            key={client.name}
            className="flex min-h-[120px] flex-col justify-end border-b border-r border-border p-4 transition-colors duration-200 hover:bg-primary hover:text-primary-foreground"
          >
            <span className="text-[17px] font-semibold tracking-[-0.01em]">{client.name}</span>
            {client.detail && <span className="mt-0.5 text-[13px] opacity-70">{client.detail}</span>}
          </li>
        ))}
        {Array.from({ length: filler }, (_, i) => (
          <li key={`vide-${i}`} aria-hidden="true" className="hidden border-b border-r border-border lg:block" />
        ))}
      </ul>
    </Section>
  );
}
