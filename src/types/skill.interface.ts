import { Types } from 'mongoose';

// ─────────────────────────────────────────────
//  Lucide icon names allowed in the system
//  (extend as needed — stored as strings in DB)
// ─────────────────────────────────────────────
export type LucideIconName =
  | 'Braces'
  | 'Cloud'
  | 'Code2'
  | 'Cpu'
  | 'CreditCard'
  | 'Database'
  | 'DatabaseZap'
  | 'FileCode2'
  | 'GitBranch'
  | 'Globe'
  | 'Leaf'
  | 'Link2'
  | 'Palette'
  | 'Server'
  | 'Shield'
  | 'Wrench'
  // add more Lucide icon names here
  | (string & {});

// ─────────────────────────────────────────────
//  SkillCategory — one document per group
// ─────────────────────────────────────────────

/** Raw MongoDB document shape */
export interface ISkillCategory {
  _id: Types.ObjectId;
  label: string; // "Languages", "Frontend", …
  iconName: LucideIconName; // stored as string, resolved to component on FE
  slug: string; // "languages", "frontend", … (auto-generated, unique)
  order: number; // display order (0-based)
  createdAt: Date;
  updatedAt: Date;
}

/** DTO returned from the API (serialized _id → string) */
export interface SkillCategoryDTO {
  id: string;
  label: string;
  iconName: LucideIconName;
  slug: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

/** Payload for creating a new category */
export interface CreateSkillCategoryPayload {
  label: string;
  iconName: LucideIconName;
  order?: number; // defaults to next available position
}

/** Payload for updating an existing category */
export interface UpdateSkillCategoryPayload {
  label?: string;
  iconName?: LucideIconName;
  order?: number;
}

// ─────────────────────────────────────────────
//  Skill — one document per skill item
// ─────────────────────────────────────────────

/** Raw MongoDB document shape */
export interface ISkill {
  _id: Types.ObjectId;
  name: string; // "React.js", "TypeScript", …
  iconName: LucideIconName;
  categoryId: Types.ObjectId; // ref → SkillCategory._id
  order: number; // display order within the category
  createdAt: Date;
  updatedAt: Date;
}

/** DTO returned from the API */
export interface SkillDTO {
  id: string;
  name: string;
  iconName: LucideIconName;
  categoryId: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

/** Payload for creating a skill */
export interface CreateSkillPayload {
  name: string;
  iconName: LucideIconName;
  categoryId: string; // ObjectId string of the parent category
  order?: number;
}

/** Payload for updating a skill */
export interface UpdateSkillPayload {
  name?: string;
  iconName?: LucideIconName;
  categoryId?: string; // move to a different category
  order?: number;
}

// ─────────────────────────────────────────────
//  Aggregated / view types (used in the FE)
// ─────────────────────────────────────────────

/** A category with its skills nested — used to render the Skills section */
export interface SkillGroupView {
  category: SkillCategoryDTO;
  skills: SkillDTO[];
}

/** Full page payload — all groups sorted by category.order */
export type SkillsPageData = SkillGroupView[];

/** Frontend Skill item model returned from /api/skills and consumed by skill cards */
export interface SkillItem {
  _id: string;
  name: string;
  category: string;
  icon?: string;
  proficiency?: 'beginner' | 'intermediate' | 'advanced' | 'expert' | string;
  description?: string;
  yearsOfExperience?: number;
  isPublished?: boolean;
  order?: number;
}

