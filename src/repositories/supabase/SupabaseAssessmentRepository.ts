import { SupabaseClient } from '@supabase/supabase-js';

import { Assessment } from '@/src/types/assessment';

import { IAssessmentRepository } from '../IAssessmentRepository';

const CINTURA_FIELDS: Array<keyof Assessment> = [
  'front_before_cintura',
  'front_after_cintura',
  'back_before_cintura',
  'back_after_cintura',
];

export class SupabaseAssessmentRepository implements IAssessmentRepository {
  constructor(
    private readonly client: SupabaseClient,
    private readonly userId: string,
  ) {}

  async findAll(): Promise<Assessment[]> {
    const { data, error } = await this.client
      .from('assessments')
      .select(
        '*, snapshots:assessment_snapshots(*), feedback:assessment_feedback(*), metrics:assessment_metrics(*)',
      )
      .order('created_at', { ascending: true });
    if (error) throw error;
    return (data ?? []).map((row) => this.fromRow(row));
  }

  async insert(assessment: Assessment): Promise<void> {
    const { error } = await this.client.from('assessments').insert(this.toCoreRow(assessment));
    if (error) throw error;
    await this.upsertSubEntities(assessment);
  }

  async upsert(assessment: Assessment): Promise<void> {
    const { error } = await this.client.from('assessments').upsert(this.toCoreRow(assessment));
    if (error) throw error;
    await this.upsertSubEntities(assessment);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.client.from('assessments').delete().eq('id', id);
    if (error) throw error;
  }

  private toCoreRow(a: Assessment) {
    return {
      id: a.id,
      student_id: a.studentId,
      user_id: this.userId,
      created_at: a.createdAt,
      notes: a.notes,
      next_goal: a.next_goal,
    };
  }

  private async upsertSubEntities(assessment: Assessment): Promise<void> {
    await this.upsertSnapshots(assessment);
    await this.replaceFeedback(assessment);
    await this.replaceMetrics(assessment);
  }

  private async upsertSnapshots(a: Assessment): Promise<void> {
    const pairs = [
      {
        side: 'front',
        moment: 'before',
        photo: a.photo_front_before,
        date: a.front_before_date,
        weight: a.front_before_weight,
      },
      {
        side: 'front',
        moment: 'after',
        photo: a.photo_front_after,
        date: a.front_after_date,
        weight: a.front_after_weight,
      },
      {
        side: 'back',
        moment: 'before',
        photo: a.photo_back_before,
        date: a.back_before_date,
        weight: a.back_before_weight,
      },
      {
        side: 'back',
        moment: 'after',
        photo: a.photo_back_after,
        date: a.back_after_date,
        weight: a.back_after_weight,
      },
    ];
    const rows = pairs
      .filter((p) => p.photo || p.date || p.weight)
      .map((p) => ({
        id: crypto.randomUUID(),
        assessment_id: a.id,
        side: p.side,
        moment: p.moment,
        photo_url: p.photo ?? null,
        date: p.date ?? null,
        weight: p.weight ? parseFloat(p.weight) : null,
      }));
    if (rows.length === 0) return;
    const { error } = await this.client
      .from('assessment_snapshots')
      .upsert(rows, { onConflict: 'assessment_id,side,moment', ignoreDuplicates: false });
    if (error) throw error;
  }

  private async replaceFeedback(a: Assessment): Promise<void> {
    if (!a.positive_items && !a.adjustment_items) return;
    await this.client.from('assessment_feedback').delete().eq('assessment_id', a.id);
    const rows = [
      ...(a.positive_items ?? []).map((content, i) => ({
        id: crypto.randomUUID(),
        assessment_id: a.id,
        category: 'positive',
        content,
        position: i,
      })),
      ...(a.adjustment_items ?? []).map((content, i) => ({
        id: crypto.randomUUID(),
        assessment_id: a.id,
        category: 'adjustment',
        content,
        position: i,
      })),
    ];
    if (rows.length === 0) return;
    const { error } = await this.client.from('assessment_feedback').insert(rows);
    if (error) throw error;
  }

  // Cintura → assessment_metrics. Uses legacy field name as metric name for reversibility.
  private async replaceMetrics(a: Assessment): Promise<void> {
    const rows = CINTURA_FIELDS.flatMap((field, i) => {
      const raw = a[field] as string | undefined;
      if (!raw) return [];
      const value = parseFloat(raw);
      if (isNaN(value)) return [];
      return [
        {
          id: crypto.randomUUID(),
          assessment_id: a.id,
          name: field as string,
          value,
          unit: 'cm',
          position: i,
        },
      ];
    });
    await this.client
      .from('assessment_metrics')
      .delete()
      .eq('assessment_id', a.id)
      .in('name', CINTURA_FIELDS as string[]);
    if (rows.length === 0) return;
    const { error } = await this.client.from('assessment_metrics').insert(rows);
    if (error) throw error;
  }

  private fromRow(row: any): Assessment {
    const {
      user_id: _u,
      student_id,
      created_at,
      snapshots = [],
      feedback = [],
      metrics = [],
      ...core
    } = row;

    const assessment: Assessment = {
      ...core,
      studentId: student_id,
      createdAt: created_at,
      snapshots: snapshots.map((s: any) => ({
        id: s.id,
        assessmentId: s.assessment_id,
        side: s.side,
        moment: s.moment,
        photoUrl: s.photo_url ?? undefined,
        date: s.date ?? undefined,
        weight: s.weight ?? undefined,
      })),
      feedback: feedback.map((f: any) => ({
        id: f.id,
        assessmentId: f.assessment_id,
        category: f.category,
        content: f.content,
        position: f.position,
      })),
      metrics: metrics.map((m: any) => ({
        id: m.id,
        assessmentId: m.assessment_id,
        name: m.name,
        value: m.value,
        unit: m.unit ?? undefined,
        position: m.position,
      })),
    };

    // Backfill legacy flat snapshot fields (UI compatibility)
    for (const snap of snapshots) {
      const s = snap.side as string;
      const m = snap.moment as string;
      if (snap.photo_url) (assessment as any)[`photo_${s}_${m}`] = snap.photo_url;
      if (snap.date) (assessment as any)[`${s}_${m}_date`] = snap.date;
      if (snap.weight != null) (assessment as any)[`${s}_${m}_weight`] = String(snap.weight);
    }

    // Backfill legacy feedback arrays
    const positives = feedback.filter((f: any) => f.category === 'positive');
    const adjustments = feedback.filter((f: any) => f.category === 'adjustment');
    if (positives.length > 0)
      assessment.positive_items = positives
        .sort((a: any, b: any) => a.position - b.position)
        .map((f: any) => f.content);
    if (adjustments.length > 0)
      assessment.adjustment_items = adjustments
        .sort((a: any, b: any) => a.position - b.position)
        .map((f: any) => f.content);

    // Backfill legacy cintura fields (metric.name = legacy field name)
    for (const metric of metrics) {
      (assessment as any)[metric.name] = String(metric.value);
    }

    return assessment;
  }
}
