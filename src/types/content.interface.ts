import { LucideIcon } from 'lucide-react';

export interface Project {
  emoji: string;
  name: string;
  subtitle: string;
  gradient: string;
  tags: string[];
  title: string;
  type: string;
  bullets: string[];
  badges: string[];
  reverse?: boolean;
  githubUrl?: string;
}

export interface IWorkArea {
  Icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  title: string;
  desc: string;
}

export interface Skill {
  name: string;
  icon: LucideIcon;
}

export interface SkillGroup {
  label: string;
  icon: LucideIcon;
  skills: Skill[];
}
