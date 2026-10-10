'use server';

import { serverFetch } from '../lib/server-fetch';

export interface ISkillPayload {
  name: string;
  category: string;
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  description?: string;
  yearsOfExperience?: number;
  icon?: string;
  isPublished?: boolean;
  order?: number;
}

type GetSkillsParams = {
  page?: number;
  limit?: number;
  category?: string;
  proficiency?: string;
  search?: string;
  isPublished?: boolean;
  sortBy?: string;
  orderBy?: string;
};

export async function createSkill(payload: ISkillPayload) {
  try {
    console.log({ payload });
    const res = await serverFetch.post('/skills', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const result = await res.json();
      return { success: false, ...result };
    }

    const skill = await res.json();
    return { success: true, data: skill };
  } catch {
    return { success: false, message: 'Failed to create skill' };
  }
}

export async function updateSkill(id: string, payload: ISkillPayload) {
  try {
    const res = await serverFetch.patch(`/skills/${id}`, {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const result = await res.json();
      return { success: false, ...result };
    }

    const skill = await res.json();
    return { success: true, data: skill };
  } catch (error) {
    console.error('updateSkill', error);
    return { success: false, message: 'Failed to update skill' };
  }
}

export async function getAllSkills(params?: GetSkillsParams) {
  try {
    const query = new URLSearchParams();

    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.category) query.set('category', params.category);
    if (params?.proficiency) query.set('proficiency', params.proficiency);
    if (params?.search) query.set('search', params.search);
    if (params?.isPublished !== undefined) query.set('isPublished', String(params.isPublished));
    if (params?.sortBy) query.set('sortBy', params.sortBy);
    if (params?.orderBy) query.set('orderBy', params.orderBy);

    const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/skills${
      query.toString() ? `?${query.toString()}` : ''
    }`;

    const res = await fetch(url, {
      method: 'GET',
      cache: 'no-store',
    });

    if (!res.ok) {
      return { success: false, message: 'Failed to fetch skills' };
    }

    const result = await res.json();

    return {
      success: true,
      data: result.skills,
      pagination: result.pagination,
    };
  } catch (error) {
    console.error('getAllSkills', error);
    return { success: false, message: 'Failed to fetch skills' };
  }
}

export async function deleteSkill(id: string) {
  try {
    const res = await serverFetch.delete(`/skills/${id}`);

    if (!res.ok) {
      const result = await res.json();
      return { success: false, ...result };
    }

    return { success: true, message: 'Skill deleted successfully' };
  } catch (error) {
    console.error('deleteSkill', error);
    return { success: false, message: 'Failed to delete skill' };
  }
}

export async function getSingleSkill(id: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/skills/${id}`,
      {
        method: 'GET',
        cache: 'no-store',
      }
    );

    if (!res.ok) {
      return { success: false, message: 'Failed to fetch skill' };
    }

    const skill = await res.json();
    return { success: true, data: skill };
  } catch (error) {
    console.error('getSingleSkill', error);
    return { success: false, message: 'Failed to fetch skill' };
  }
}
