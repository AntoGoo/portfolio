import { useEffect, useMemo, useState } from 'react';
import { api } from '@/api/client';
import { profile as fallbackProfile } from '@/data/portfolioContent';
import { sortProjectsByDate } from '@/lib/projectDate';
import { resolveTexts } from '@/lib/siteTexts';

export default function usePortfolioData() {
  const [settings, setSettings] = useState(null);
  const [projects, setProjects] = useState(null);
  const [experiences, setExperiences] = useState(null);
  const [storedTexts, setStoredTexts] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    api
      .portfolio()
      .then((data) => {
        if (!alive) return;
        setSettings(data?.settings || null);
        setStoredTexts(data?.texts || null);
        setReady(true);
        setProjects(sortProjectsByDate(data?.projects || []));
        setExperiences(data?.experiences || []);
      })
      .catch(() => {
        if (!alive) return;
        setProjects([]);
        setExperiences([]);
        setReady(true);
      });
    return () => {
      alive = false;
    };
  }, []);

  const mergedProfile = { ...fallbackProfile };
  Object.entries(settings || {}).forEach(([key, value]) => {
    if (value) mergedProfile[key] = value;
  });

  const texts = useMemo(() => resolveTexts(storedTexts), [storedTexts]);

  return { profile: mergedProfile, texts, projects, experiences, ready };
}
