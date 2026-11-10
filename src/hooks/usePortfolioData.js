import { useEffect, useState } from 'react';
import { api } from '@/api/client';
import { profile as fallbackProfile } from '@/data/portfolioContent';
import { sortProjectsByDate } from '@/lib/projectDate';

export default function usePortfolioData() {
  const [settings, setSettings] = useState(null);
  const [projects, setProjects] = useState(null);
  const [experiences, setExperiences] = useState(null);

  useEffect(() => {
    let alive = true;
    api
      .portfolio()
      .then((data) => {
        if (!alive) return;
        setSettings(data?.settings || null);
        setProjects(sortProjectsByDate(data?.projects || []));
        setExperiences(data?.experiences || []);
      })
      .catch(() => {
        if (!alive) return;
        setProjects([]);
        setExperiences([]);
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
