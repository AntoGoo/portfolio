import Section from '@/components/portfolio/Section';
import { methodSteps } from '@/data/portfolioContent';

// La méthode est une vraie séquence : c'est le seul endroit numéroté.
export default function Method() {
  return (
    <Section id="methode" title="Une démarche agile en sept étapes">
      <ol className="grid border-t border-foreground md:grid-cols-7">
        {methodSteps.map((step) => (
          <li
            key={step.number}
            className="grid grid-cols-[3.5rem_1fr] gap-x-4 border-b border-border py-5 md:block md:border-b-0 md:border-r md:px-4 md:py-6 md:first:pl-0 md:last:border-r-0"
          >
            <span className="text-[2rem] font-extrabold leading-none tracking-[-0.05em] text-primary md:text-[2.6rem]">
              {step.number}
            </span>
            <div>
              <h3 className="text-[17px] font-semibold md:mt-5">{step.title}</h3>
              <p className="mt-1 text-[14px] leading-relaxed text-muted-foreground">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
