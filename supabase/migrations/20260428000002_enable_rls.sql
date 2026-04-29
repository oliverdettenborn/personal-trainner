ALTER TABLE students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_students" ON students
  FOR ALL
  USING      (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_assessments" ON assessments
  FOR ALL
  USING      (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
