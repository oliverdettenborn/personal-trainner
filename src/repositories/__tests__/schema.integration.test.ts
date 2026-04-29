import { newDb } from 'pg-mem';
import * as fs from 'fs';
import * as path from 'path';

const ddlPath = path.join(
  __dirname,
  '../../../supabase/migrations/20260428000001_create_tables.sql',
);

function loadDb() {
  const db = newDb();
  const ddl = fs.readFileSync(ddlPath, 'utf-8');
  const sanitized = ddl
    .replace(/REFERENCES auth\.users\(id\) ON DELETE CASCADE/g, '')
    .replace(/REFERENCES auth\.users\(id\)/g, '');
  db.public.none(sanitized);
  return db;
}

function columns(db: ReturnType<typeof loadDb>, table: string): string[] {
  return db.public
    .many(
      `SELECT column_name FROM information_schema.columns
       WHERE table_name = '${table}' ORDER BY column_name`,
    )
    .map((r: any) => r.column_name);
}

describe('Schema Integration', () => {
  const db = loadDb();

  it('students table has required columns', () => {
    const cols = columns(db, 'students');
    expect(cols).toContain('id');
    expect(cols).toContain('user_id');
    expect(cols).toContain('name');
    expect(cols).toContain('created_at');
  });

  it('assessments table has required columns', () => {
    const cols = columns(db, 'assessments');
    expect(cols).toContain('id');
    expect(cols).toContain('student_id');
    expect(cols).toContain('user_id');
    expect(cols).toContain('notes');
    expect(cols).toContain('next_goal');
  });

  it('assessment_snapshots table has required columns', () => {
    const cols = columns(db, 'assessment_snapshots');
    expect(cols).toContain('id');
    expect(cols).toContain('assessment_id');
    expect(cols).toContain('side');
    expect(cols).toContain('moment');
    expect(cols).toContain('photo_url');
    expect(cols).toContain('date');
    expect(cols).toContain('weight');
  });

  it('assessment_metrics table has required columns', () => {
    const cols = columns(db, 'assessment_metrics');
    expect(cols).toContain('id');
    expect(cols).toContain('assessment_id');
    expect(cols).toContain('name');
    expect(cols).toContain('value');
    expect(cols).toContain('unit');
    expect(cols).toContain('position');
  });

  it('assessment_feedback table has required columns', () => {
    const cols = columns(db, 'assessment_feedback');
    expect(cols).toContain('id');
    expect(cols).toContain('assessment_id');
    expect(cols).toContain('category');
    expect(cols).toContain('content');
    expect(cols).toContain('position');
  });

  it('assessment_snapshots enforces FK to assessments', () => {
    expect(() => {
      db.public.none(`
        INSERT INTO assessment_snapshots (id, assessment_id, side, moment)
        VALUES ('s1', 'nonexistent-assessment', 'front', 'before')
      `);
    }).toThrow();
  });

  it('assessments enforces FK to students', () => {
    expect(() => {
      db.public.none(`
        INSERT INTO assessments (id, user_id, student_id, created_at)
        VALUES ('a1', 'b2e1e2a0-0000-0000-0000-000000000001', 'nonexistent-student', 1)
      `);
    }).toThrow();
  });
});
