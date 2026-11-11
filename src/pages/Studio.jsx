import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/api/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProjectsManager from '@/components/studio/ProjectsManager';
import ExperiencesManager from '@/components/studio/ExperiencesManager';
import SettingsForm from '@/components/studio/SettingsForm';
import TextsEditor from '@/components/studio/TextsEditor';
import StudioLogin from '@/components/studio/StudioLogin';
import { ArrowUpRight, LogOut } from 'lucide-react';

// /studio exige une connexion : sans session valide, seul le formulaire s'affiche.
// L'API (/api/admin/*) vérifie la session de son côté.
export default function Studio() {
  const [session, setSession] = useState(null);

  const check = useCallback(() => {
    api.auth
      .session()
      .then(setSession)
      .catch((err) => setSession({ authenticated: false, configured: true, error: err.message }));
  }, []);

  useEffect(() => {
    check();
    const onUnauthorized = () => setSession((prev) => ({ ...prev, authenticated: false, expired: true }));
    window.addEventListener('studio:unauthorized', onUnauthorized);
    return () => window.removeEventListener('studio:unauthorized', onUnauthorized);
  }, [check]);

  if (!session) return <div className="min-h-screen bg-background" />;
  if (!session.authenticated) return <StudioLogin session={session} onLoggedIn={check} />;

  const logout = async () => {
    await api.auth.logout().catch(() => null);
    setSession({ authenticated: false, configured: true });
  };

  return <StudioSpace onLogout={logout} />;
}

function StudioSpace({ onLogout }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex h-[68px] w-full max-w-[1100px] items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card font-heading text-[13px] font-bold">
              AG
            </span>
            <div>
              <p className="font-heading text-[13.5px] font-medium">Espace privé</p>
              <p className="text-[11px] text-muted-foreground">Gestion du portfolio</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border px-3 text-[12.5px] text-muted-foreground transition-colors hover:border-primary/60 hover:text-foreground"
            >
              Voir le site
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border px-3 text-[12.5px] text-muted-foreground transition-colors hover:border-destructive/60 hover:text-destructive"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1100px] px-6 py-10 md:py-14">
        <h1 className="font-heading text-[26px] font-semibold tracking-[-0.02em]">Contenu du portfolio</h1>
        <p className="mt-2 max-w-xl text-[13.5px] text-muted-foreground">
          Gérez vos réalisations, votre parcours, vos coordonnées et tous les textes du site. Les
          modifications apparaissent sur le site d’ici une minute.
        </p>

        <Tabs defaultValue="projets" className="mt-10">
          <TabsList className="mb-8">
            <TabsTrigger value="projets">Projets</TabsTrigger>
            <TabsTrigger value="parcours">Parcours</TabsTrigger>
            <TabsTrigger value="profil">Profil & contact</TabsTrigger>
            <TabsTrigger value="textes">Textes du site</TabsTrigger>
          </TabsList>
          <TabsContent value="projets">
            <ProjectsManager />
          </TabsContent>
          <TabsContent value="parcours">
            <ExperiencesManager />
          </TabsContent>
          <TabsContent value="profil">
            <SettingsForm />
          </TabsContent>
          <TabsContent value="textes">
            <TextsEditor />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}