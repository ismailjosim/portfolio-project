import {
  BadgeCheck,
  Code2,
  Database,
  Flame,
  KeyRound,
  Layers3,
  Server,
  Terminal,
  Globe,
  Compass,
  type LucideIcon,
} from 'lucide-react';

export interface ProjectCardProject {
  _id: string;
  name: string;
  subtitle?: string;
  title?: string;
  type?: string;
  image?: string;
  demoImages?: string[];
  description?: string;
  technologies: string[];
  features: string[];
  githubUrl?: string;
  liveUrl?: string;
  serverGithubUrl?: string;
  caseStudyUrl?: string;
  featured?: boolean;
  slug?: string;
}

export const TECH_ICON_MAP: Record<string, LucideIcon> = {
  react: Code2,
  'react.js': Code2,
  next: Code2,
  'next.js': Code2,
  node: Server,
  'node.js': Server,
  express: Terminal,
  'express.js': Terminal,
  mongodb: Database,
  mongo: Database,
  firebase: Flame,
  stripe: BadgeCheck,
  jwt: KeyRound,
  tailwind: Code2,
  'tailwind css': Code2,
  daisyui: Layers3,
  'react router': Compass,
  axios: Globe,
};

export function getTechIcon(tech: string): LucideIcon {
  const normalized = tech.trim().toLowerCase();
  return TECH_ICON_MAP[normalized] ?? Code2;
}

export function getProjectLinks(project: ProjectCardProject) {
  const repoUrls = [project.githubUrl, project.serverGithubUrl, project.caseStudyUrl].filter(
    (url): url is string => Boolean(url && url.includes('github.com'))
  );

  const liveSiteUrl = project.liveUrl;

  const clientRepoUrl =
    repoUrls.find((url) => url.toLowerCase().includes('client')) ||
    repoUrls.find((url) => !url.toLowerCase().includes('server'));

  const serverRepoUrl =
    [
      project.serverGithubUrl,
      project.caseStudyUrl,
      repoUrls.find((url) => url.toLowerCase().includes('server')),
    ].find((url) => url && url.includes('github.com') && url !== clientRepoUrl) || undefined;

  const repoCount = new Set([clientRepoUrl, serverRepoUrl].filter(Boolean)).size;

  return { liveSiteUrl, clientRepoUrl, serverRepoUrl, hasMultipleRepos: repoCount > 1 };
}
