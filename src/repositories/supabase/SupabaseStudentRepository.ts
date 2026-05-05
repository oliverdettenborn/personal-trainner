import { SupabaseClient } from '@supabase/supabase-js';
import { IStudentRepository } from '../IStudentRepository';
import { Student } from '@/src/types/assessment';

export class SupabaseStudentRepository implements IStudentRepository {
  constructor(
    private readonly client: SupabaseClient,
    private readonly userId: string,
  ) {}

  async findAll(): Promise<Student[]> {
    const { data, error } = await this.client
      .from('students')
      .select('*')
      .order('created_at', { ascending: true });
    if (error) throw error;
    return (data ?? []).map((r) => ({
      id: r.id,
      name: r.name,
      createdAt: r.created_at,
    }));
  }

  async insert(student: Student): Promise<void> {
    const { error } = await this.client.from('students').insert({
      id: student.id,
      user_id: this.userId,
      name: student.name,
      created_at: student.createdAt,
    });
    if (error) throw error;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.client.from('students').delete().eq('id', id);
    if (error) throw error;
  }
}
