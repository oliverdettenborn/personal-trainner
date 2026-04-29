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
  // pg-mem doesn't support auth.users FK — strip it
  const sanitized = ddl
    .replace(/REFERENCES auth\.users\(id\) ON DELETE CASCADE/g, '')
    .replace(/REFERENCES auth\.users\(id\)/g, '');
  db.public.none(sanitized);
  return db;
}

describe('Schema Integration', () => {
  const db = loadDb();

  it('students table has required columns', () => {
    const cols = db.public
      .many(`
        SELECT column_name FROM information_schema.columns
        WHERE table_name = 'students' ORDER BY column_name
      `)
      .map((r: any) => r.column_name);

    expect(cols).toContain('id');
    expect(cols).toContain('user_id');
    expect(cols).toContain('name');
    expect(cols).toContain('created_at');
  });

  it('assessments table has all required columns', () => {
    const cols = db.public
      .many(`
        SELECT column_name FROM information_schema.columns
        WHERE table_name = 'assessments' ORDER BY column_name
      `)
      .map((r: any) => r.column_name);

    expect(cols).toContain('id');
    expect(cols).toContain('student_id');
    expect(cols).toContain('user_id');
    expect(cols).toContain('photo_front_before');
    expect(cols).toContain('photo_front_after');
    expect(cols).toContain('photo_back_before');
    expect(cols).toContain('photo_back_after');
    expect(cols).toContain('positive_items');
    expect(cols).toContain('adjustment_items');
    expect(cols).toContain('notes');
    expect(cols).toContain('next_goal');
  });

  it('assessments.student_id enforces FK to students.id', () => {
    expect(() => {
      db.public.none(`
        INSERT INTO assessments (id, user_id, student_id, created_at)
        VALUES ('a1', 'b2e1e2a0-0000-0000-0000-000000000001', 'nonexistent-student', 1)
      `);
    }).toThrow();
  });
});
