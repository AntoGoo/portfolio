import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { profile as fallbackProfile } from '@/data/portfolioContent';

export default function usePortfolioData() {
  const [settings, setSettings] = useState(null);
  const [projects, setProjects] = useState(null);
  const [experiences, setExperiences] = useState(null);

  useEffect(() => {
    let alive = true;
    Promise.all([
      base44.entities.SiteSettings.filter({}, { sort: '-created_date', limit: 1 }),
      base44.entities.Project.filter({ published: true }, { sort: 'order', limit: 50 }),
      base44.entities.Experience.filter({ published: true }, { sort: 'order', limit: 50 }),
    ]).then(([settingsPage, projectsPage, experiencesPage]) => {
      if (!alive) return;
      setSettings(settingsPage?.items?.[0] || null);
      setProjects(projectsPage?.items || []);
      setExperiences(experiencesPage?.items || []);
    });
    return () => {
      alive = false;
    };
  }, []);

  const mergedProfile = { ...fallbackProfile };
  Object.entries(settings || {}).forEach(([key, value]) => {
    if (value) mergedProfile[key] = value;
  });

  return { profile: mergedProfile, projects, experiences };
}