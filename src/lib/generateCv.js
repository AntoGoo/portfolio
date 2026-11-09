import { jsPDF } from 'jspdf';
import { profile, expertises, skillGroups, sampleExperiences } from '@/data/portfolioContent';

const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 20;
const CONTENT_W = PAGE_W - MARGIN * 2;

export function downloadCv({ profile: profileOverride, experiences } = {}) {
  const p = { ...profile, ...(profileOverride || {}) };
  const jobs = experiences && experiences.length ? experiences : sampleExperiences;

  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  let y = MARGIN + 4;

  const ensure = (height) => {
    if (y + height > PAGE_H - MARGIN) {
      doc.addPage();
      y = MARGIN;
    }
  };

  const write = (text, { size = 10, style = 'normal', color = [55, 60, 70], lh = 4.8, gap = 0 } = {}) => {
    doc.setFont('helvetica', style);
    doc.setFontSize(size);
    doc.setTextColor(color[0], color[1], color[2]);
    doc.splitTextToSize(String(text), CONTENT_W).forEach((line) => {
      ensure(lh);
      doc.text(line, MARGIN, y);
      y += lh;
    });
    y += gap;
  };

  const heading = (text) => {
    ensure(16);
    y += 4;
    doc.setDrawColor(200, 205, 212);
    doc.line(MARGIN, y - 3, PAGE_W - MARGIN, y - 3);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 34, 40);
    doc.text(text.toUpperCase(), MARGIN, y + 3, { charSpace: 0.7 });
    y += 10;
  };

  write(p.name, { size: 22, style: 'bold', color: [17, 19, 24], lh: 9 });
  write(p.role, { size: 11, color: [66, 133, 244], lh: 6, gap: 1 });

  const contact = [p.email, p.location, p.linkedin].filter(Boolean).join('   ·   ');
  if (contact) write(contact, { size: 9, color: [110, 118, 130], lh: 5 });

  heading('Profil');
  write(p.intro);

  heading('Expertises');
  expertises.forEach((item) => {
    write(item.title, { size: 10.5, style: 'bold', color: [30, 34, 40], lh: 5 });
    write(item.items.join(' · '), { size: 9, color: [90, 97, 108], gap: 1.5 });
  });

  heading('Parcours professionnel');
  jobs.forEach((job) => {
    const period = [job.start, job.end].filter(Boolean).join(' — ');
    write(`${job.role}${job.company ? ' · ' + job.company : ''}`, {
      size: 10.5,
      style: 'bold',
      color: [30, 34, 40],
      lh: 5,
    });
    if (period) write(period, { size: 8.5, color: [66, 133, 244], lh: 4.5 });
    if (job.context) write(job.context, { size: 9, color: [90, 97, 108], lh: 4.6 });
    (job.missions || []).forEach((mission) => write('— ' + mission, { size: 9, lh: 4.4 }));
    y += 2;
  });

  heading('Environnement & compétences');
  skillGroups.forEach((group) => {
    write(`${group.label} : ${group.items.join(', ')}`, { size: 9, lh: 4.6 });
  });

  doc.save(`CV-${p.name.replace(/\s+/g, '-')}.pdf`);
}