import { supabase } from "@lib/supabase";
import { SupabaseStudentRepository } from "./supabase/SupabaseStudentRepository";
import type { IStudentRepository } from "./IStudentRepository";

export function createStudentRepository(userId: string): IStudentRepository {
  return new SupabaseStudentRepository(supabase, userId);
}

export type { IStudentRepository };
