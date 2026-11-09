import Section from '@/components/portfolio/Section';
import { expertises } from '@/data/portfolioContent';

export default function Expertises() {
  return (
    <Section id="expertises" title="Quatre domaines complémentaires">
      <div className="grid border-l border-t border-foreground sm:grid-cols-2">
        {expertises.map((item) => (
          <article key={item.key} className="border-b border-r border-foreground bg-background p-6 md:p-9">
            <h3 className="text-[1.5rem] font-bold leading-tight tracking-[-0.025em]">{item.title}</h3>
            <p className="mt-2 max-w-[48ch] text-[15px] leading-relaxed text-muted-foreground">{item.summary}</p>
            <ul className="mt-6 border-t border-border">
              {item.items.map((line) => (
                <li key={line} className="border-b border-border py-2.5 text-[15px]">
                  {line}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </Section>
  );
}
