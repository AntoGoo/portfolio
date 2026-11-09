// Contenu du portfolio.
// Les réalisations et le parcours sont des exemples de structure : ils se
// modifient depuis l'espace privé une fois le portfolio en ligne.

export const profile = {
  name: 'Anthony Gouvrillon',
  initials: 'AG',
  role: 'Chef de projet IT',
  tagline: 'Faire avancer les projets. Donner du sens à la technologie.',
  intro:
    'Chef de projet IT depuis plus de 20 ans (jeu vidéo, GED/OCR, ingénierie événementielle), je pilote les projets du cadrage au déploiement avec une bonne facilité de compréhension technique et fonctionnelle des sujets.',
  location: 'Nantes',
  email: 'antogouvrillon@gmail.com',
  linkedin: 'https://linkedin.com/in/anthonygouvrillon',
  cvUrl: '',
};

export const expertises = [
  {
    key: 'projet',
    icon: 'clipboard',
    title: 'Gestion de projet',
    summary: "Structurer, planifier et conduire les projets jusqu'à la mise en service.",
    items: [
      'Cadrage et recueil des besoins',
      'Spécifications fonctionnelles',
      'Planification et suivi',
      'Gestion des risques',
      'Pilotage QCDP',
      'Recette et déploiement',
    ],
  },
  {
    key: 'techno',
    icon: 'code',
    title: 'Compréhension et usage',
    summary:
      "Utiliser certaines technologies au quotidien et comprendre les autres : de quoi dialoguer avec les équipes techniques et arbitrer en connaissance de cause.",
    items: [
      'Docker et environnements conteneurisés',
      'Linux, Windows Server, VMware',
      'Node.js, React, Ruby on Rails',
      'PostgreSQL, MSSQL',
      'OCR, IoT, frameworks 3D / 2D',
      "Lecture de code et d'architecture",
    ],
  },
  {
    key: 'gouvernance',
    icon: 'network',
    title: 'Gouvernance',
    summary: 'Donner de la visibilité, arbitrer et faire avancer les décisions.',
    items: [
      'COPIL, COTECH et COSUI',
      'Reporting et indicateurs',
      'Arbitrages',
      "Plans d'action",
      'Coordination des parties prenantes',
    ],
  },
  {
    key: 'management',
    icon: 'users',
    title: 'Management & accompagnement',
    summary: 'Fédérer les équipes et accompagner le changement.',
    items: [
      'Coordination des équipes',
      'Animation des réunions',
      'Accompagnement au changement',
      'Communication',
      'Facilitation et résolution de problèmes',
    ],
  },
];

export const methodSteps = [
  { number: '01', title: 'Comprendre', text: 'Analyser le besoin et le contexte.' },
  { number: '02', title: 'Cadrer', text: 'Définir les objectifs, le périmètre et les ressources.' },
  { number: '03', title: 'Organiser', text: 'Planifier, prioriser et mobiliser les équipes.' },
  { number: '04', title: 'Piloter', text: 'Suivre les actions, les risques et les résultats.' },
  { number: '05', title: 'Itérer', text: 'Ajuster les livrables au fil des retours.' },
  { number: '06', title: 'Recetter', text: 'Tester, vérifier les livrables et faire valider par les métiers.' },
  { number: '07', title: 'Livrer', text: 'Déployer et accompagner les utilisateurs.' },
];

export const skillGroups = [
  { label: 'Méthodes', items: ['Agile', 'Cycle en V', 'Suivi QCD'] },
  { label: 'Outils', items: ['Wrike', 'Coda', 'Google Workspace', 'VS Code', 'GitHub', 'n8n'] },
  { label: 'Usage et compréhension', items: ['Docker', 'Railway', 'VMware vSphere', 'Windows Server', 'Linux', 'Ruby on Rails', 'Node.js', 'React'] },
  { label: 'Données et technologies', items: ['MSSQL', 'PostgreSQL', 'OCR', 'IoT', 'Framework 3D / 2D'] },
  { label: 'IA', items: ['Claude Code', 'LLM (Claude, ChatGPT)'] },
  { label: 'Langues', items: ['Français', 'Anglais : courant et technique'] },
];

export const sampleProjects = [
  {
    id: 'exemple-1',
    index: '01',
    title: 'Pilotage du projet GED — ELO',
    year: 'Dématérialisation',
    context:
      "Déploiement d'une gestion électronique des documents dans un environnement multi-sites, avec des usages métiers hétérogènes.",
    problem:
      'Des documents dispersés entre serveurs, boîtes mail et arborescences locales, rendant la recherche, le partage et la traçabilité difficiles.',
    objectives:
      "Structurer le référentiel documentaire, harmoniser les pratiques et sécuriser l'accès à l'information.",
    role: 'Chef de projet : cadrage, spécifications fonctionnelles, planification, pilotage des prestataires et recette.',
    methodology:
      'Cadrage fonctionnel, ateliers métiers, plan de déploiement par vagues, comités de suivi réguliers.',
    solutions:
      'Paramétrage ELO, arborescence et plan de classement, gestion des droits, reprise des données existantes, formation des utilisateurs.',
    results:
      'Un référentiel documentaire unique, des droits maîtrisés et des circuits de validation dématérialisés.',
    tags: ['GED', 'ELO', 'Conduite du changement'],
    link: '',
    link_label: '',
    image_url: '',
    published: true,
  },
  {
    id: 'exemple-2',
    index: '02',
    title: 'Dématérialisation et optimisation des processus',
    year: 'Processus',
    context:
      'Des processus métiers encore largement papier, avec des circuits de validation longs et peu traçables.',
    problem:
      'Multiplicité des supports, ressaisies et délais de traitement difficiles à mesurer.',
    objectives:
      'Dématérialiser les circuits de validation, fiabiliser les données et réduire les manipulations manuelles.',
    role: "Analyse des processus existants, rédaction des spécifications, coordination des développements et conduite du changement.",
    methodology: 'Cartographie des processus, ateliers de conception, prototypage, déploiement progressif.',
    solutions: 'Formulaires dématérialisés, circuits de validation, tableau de suivi des demandes.',
    results:
      "Un processus unifié, traçable de bout en bout et partagé par l'ensemble des services concernés.",
    tags: ['Dématérialisation', 'Processus', 'Change'],
    link: '',
    link_label: '',
    image_url: '',
    published: true,
  },
  {
    id: 'exemple-3',
    index: '03',
    title: "Conception d'une solution digitale métier",
    year: 'Produit',
    context:
      "Un besoin métier mal couvert par les outils existants, générant des contournements et des fichiers parallèles.",
    problem: "Absence d'outil adapté, dispersion de l'information et dépendance à des traitements manuels.",
    objectives: "Concevoir une solution ciblée, intuitive et intégrée à l'existant.",
    role: 'Chef de projet : vision produit, backlog, user stories, priorisation et recette fonctionnelle.',
    methodology: 'Entretiens utilisateurs, ateliers de cadrage, backlog priorisé, itérations courtes.',
    solutions: 'Application web métier, gestion des droits, interfaces avec les systèmes existants via API.',
    results: 'Un outil adopté par les équipes métiers et un socle évolutif pour les besoins suivants.',
    tags: ['Web', 'API'],
    link: '',
    link_label: '',
    image_url: '',
    published: true,
  },
  {
    id: 'exemple-4',
    index: '04',
    title: 'Pilotage de projet en environnement Agile',
    year: 'Agile',
    context:
      'Une équipe pluridisciplinaire et un périmètre fonctionnel évolutif nécessitant un cadre de travail lisible.',
    problem: 'Priorités mouvantes, visibilité limitée sur avancement et difficulté à sécuriser les livraisons.',
    objectives: "Installer un rythme de livraison régulier et rendre l'avancement compréhensible par tous.",
    role: 'Chef de projet : animation des rituels, suivi du backlog, levée des points bloquants.',
    methodology: 'Scrum, sprints de deux semaines, revues de sprint, indicateurs de suivi, amélioration continue.',
    solutions: "Backlog structuré, définition des critères d'acceptation, suivi des tests avec Xray.",
    results:
      'Un cadre de travail partagé et des points d’avancement compréhensibles par les métiers comme par la direction.',
    tags: ['Agile', 'Scrum', 'Jira'],
    link: '',
    link_label: '',
    image_url: '',
    published: true,
  },
  {
    id: 'exemple-5',
    index: '05',
    title: 'Développement de solutions interactives',
    year: 'Interfaces',
    context: 'Des contenus métiers à rendre accessibles et manipulables de manière plus directe et plus visuelle.',
    problem: 'Des supports statiques peu adaptés aux usages et difficiles à maintenir.',
    objectives: 'Proposer des interfaces interactives, lisibles et maintenables.',
    role: 'Conception fonctionnelle, prototypage, coordination technique et recette.',
    methodology: 'Maquettage, prototypage rapide, tests utilisateurs, ajustements itératifs.',
    solutions: 'Interfaces web interactives, composants réutilisables, intégration aux données existantes.',
    results: 'Des supports plus clairs, plus simples à utiliser et plus faciles à faire évoluer.',
    tags: ['Interfaces', 'Prototypage', 'Web'],
    link: '',
    link_label: '',
    image_url: '',
    published: true,
  },
];

export const sampleExperiences = [
  {
    id: 'exp-1',
    company: '',
    role: 'Chef de projet IT',
    start: '2021',
    end: "aujourd'hui",
    context: 'Pilotage de projets numériques pour des directions métiers.',
    missions: [
      'Cadrage, spécifications et planification des projets',
      'Animation des comités de suivi et arbitrages',
      'Gestion du backlog et priorisation des évolutions',
    ],
  },
  {
    id: 'exp-2',
    company: '',
    role: 'Chef de projet informatique',
    start: '2012',
    end: '2021',
    context: 'Conduite de projets applicatifs et de dématérialisation.',
    missions: [
      'Recueil des besoins et rédaction des spécifications',
      'Coordination des prestataires et des équipes internes',
      'Recette, déploiement et accompagnement des utilisateurs',
    ],
  },
  {
    id: 'exp-3',
    company: '',
    role: 'Chef de projet / développement',
    start: '2000',
    end: '2012',
    context: 'Conception et réalisation de solutions web et métiers.',
    missions: [
      'Analyse des besoins et conception des solutions',
      'Développement et intégration',
      'Mise en production et support',
    ],
  },
];