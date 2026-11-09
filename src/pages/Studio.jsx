import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProjectsManager from '@/components/studio/ProjectsManager';
import ExperiencesManager from '@/components/studio/ExperiencesManager';
import SettingsForm from '@/components/studio/SettingsForm';
import { ArrowUpRight, LogOut } from 'lucide-react';

export default function Studio() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    base44.auth
      .me()
      .then((user) => setRole(user?.role || 'user'))
      .catch(() => setRole('user'));
  }, []);

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
              onClick={() => base44.auth.logout('/')}
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
          Gérez vos réalisations, votre parcours et vos coordonnées. Les modifications sont visibles
          immédiatement sur le site.
        </p>

        {role !== null && role !== 'admin' ? (
          <div className="mt-10 rounded-xl border border-border bg-card p-8">
            <p className="font-heading text-[16px] font-medium">Accès réservé</p>
            <p className="mt-2 text-[13.5px] text-muted-foreground">
              Cet espace est réservé au propriétaire du portfolio.
            </p>
          </div>
        ) : (
          <Tabs defaultValue="projets" className="mt-10">
            <TabsList className="mb-8">
              <TabsTrigger value="projets">Projets</TabsTrigger>
              <TabsTrigger value="parcours">Parcours</TabsTrigger>
              <TabsTrigger value="profil">Profil & contact</TabsTrigger>
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
          </Tabs>
        )}
      </main>
    </div>
  );
}