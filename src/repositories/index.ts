import { supabase } from "@lib/supabase";

import type { IStudentRepository } from "./IStudentRepository";
import { SupabaseStudentRepository } from "./supabase/SupabaseStudentRepository";

export function createStudentRepository(userId: string): IStudentRepository {
  return new SupabaseStudentRepository(supabase, userId);
}

export type { IStudentRepository };
