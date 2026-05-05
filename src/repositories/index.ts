import { supabase } from '@lib/supabase';

import type { IAssessmentRepository } from './IAssessmentRepository';
import type { IStudentRepository } from './IStudentRepository';
import { SupabaseAssessmentRepository } from './supabase/SupabaseAssessmentRepository';
import { SupabaseStudentRepository } from './supabase/SupabaseStudentRepository';

// Single swap point — to migrate to HTTP backend, only this file changes.

export function createStudentRepository(userId: string): IStudentRepository {
  return new SupabaseStudentRepository(supabase, userId);
}

export function createAssessmentRepository(
  userId: string,
): IAssessmentRepository {
  return new SupabaseAssessmentRepository(supabase, userId);
}

export type { IStudentRepository, IAssessmentRepository };
