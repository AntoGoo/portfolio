import { useState } from 'react';
import { AlertCircle, CheckCircle2, Download, Loader2 } from 'lucide-react';
import Reveal from '@/components/portfolio/Reveal';
import { SectionHeading } from '@/components/portfolio/Section';
import { CV_FILE_NAME, cvHref } from '@/lib/cv';
import { profile as defaultProfile, siteTexts } from '@/data/portfolioContent';

const fieldClass =
  'w-full rounded-md border border-border bg-transparent px-3 py-2 text-[15px] text-foreground placeholder:text-muted-foreground/70 transition-colors focus:border-primary focus:outline-none disabled:cursor-not-allowed disabled:opacity-60';
const fieldLabelClass = 'mb-1.5 block text-[12px] font-medium uppercase tracking-[0.08em] text-muted-foreground';

function ContactForm() {
  const [fields, setFields] = useState({ name: '', email: '', message: '', company: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [errorMessage, setErrorMessage] = useState('');

  const onChange = (key) => (event) => setFields((prev) => ({ ...prev, [key]: event.target.value }));

  const onSubmit = async (event) => {
    event.preventDefault();
    if (status === 'sending') return;
    setStatus('sending');
    setErrorMessage('');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(fields),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.error || 'Envoi impossible pour le moment.');
      setStatus('success');
      setFields({ name: '', email: '', message: '', company: '' });
    } catch (err) {
      setStatus('error');
      setErrorMessage(err.message || 'Envoi impossible pour le moment.');
    }
  };

  if (status === 'success') {
    return (
      <p className="flex items-center gap-2.5 text-[15px] text-foreground">
        <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
        Message envoyé, merci : je reviens vers vous rapidement.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      {/* Honeypot : un humain ne voit ni ne remplit ce champ (hors écran, pas display:none). */}
      <input
        type="text"
        name="company"
        value={fields.company}
        onChange={onChange('company')}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden"
      />

      <div>
        <label htmlFor="contact-name" className={fieldLabelClass}>
          Nom
        </label>
        <input
          id="contact-name"
          type="text"
          required
          value={fields.name}
          onChange={onChange('name')}
          disabled={status === 'sending'}
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="contact-email" className={fieldLabelClass}>
          E-mail
        </label>
        <input
          id="contact-email"
          type="email"
          required
          value={fields.email}
          onChange={onChange('email')}
          disabled={status === 'sending'}
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="contact-message" className={fieldLabelClass}>
          Message
        </label>
        <textarea
          id="contact-message"
          required
          rows={4}
          maxLength={5000}
          value={fields.message}
          onChange={onChange('message')}
          disabled={status === 'sending'}
          className={`${fieldClass} resize-none`}
        />
      </div>

      {status === 'error' && (
        <p className="flex items-start gap-2 text-[14px] text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-[6px] border border-primary px-6 text-[15px] font-medium text-primary transition-colors hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === 'sending' && <Loader2 className="h-4 w-4 animate-spin" />}
        {status === 'sending' ? 'Envoi…' : 'Envoyer le message'}
      </button>
    </form>
  );
}

function ContactBlock({ label, children }) {
  return (
    <div className="px-7 py-[26px]">
      <p className="flex items-center gap-2.5 font-heading text-[14px] font-medium text-muted-foreground">
        <span aria-hidden="true" className="h-[7px] w-[7px] shrink-0 bg-accent2" />
        {label}
      </p>
      <div className="mt-2">{children}</div>
    </div>
  );
}

const valueClass = 'font-heading text-[18px] font-semibold leading-snug text-foreground';

export default function Contact({ profile = defaultProfile, texts: allTexts = siteTexts }) {
  const texts = allTexts.contact;
  const linkedin = profile.linkedin;

  return (
    <section id="contact" className="border-t border-border/70 py-20 md:py-28">
      <div className="mx-auto grid w-full max-w-[1200px] gap-12 px-6 md:px-10 lg:grid-cols-[1.15fr_1fr] lg:items-start lg:gap-20">
        <Reveal>
          <SectionHeading index="06" eyebrow={texts.eyebrow} title={texts.title} />
          <a
            href={cvHref(profile)}
            download={CV_FILE_NAME}
            className="mt-12 inline-flex h-[54px] w-full items-center justify-center gap-2.5 rounded-[6px] border border-primary px-7 text-[16px] font-medium text-primary transition-colors hover:bg-primary/10 md:w-auto"
          >
            <Download className="h-[18px] w-[18px]" />
            {texts.cvButton}
          </a>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="divide-y divide-border rounded-[10px] border border-border bg-card">
            <ContactBlock label="Envoyer un message">
              <ContactForm />
            </ContactBlock>

            <ContactBlock label={texts.linkedinLabel}>
              <a
                href={linkedin || '#contact'}
                target={linkedin ? '_blank' : undefined}
                rel="noopener noreferrer"
                className={`${valueClass} transition-colors hover:text-primary`}
              >
                {linkedin ? texts.linkedinLink : 'Profil à renseigner'}
              </a>
            </ContactBlock>

            <ContactBlock label={texts.locationLabel}>
              <p className={valueClass}>{profile.location}</p>
            </ContactBlock>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
