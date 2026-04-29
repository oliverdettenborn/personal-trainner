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

ALTER TABLE assessment_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_assessment_snapshots" ON assessment_snapshots
  FOR ALL
  USING (
    assessment_id IN (SELECT id FROM assessments WHERE user_id = auth.uid())
  );

ALTER TABLE assessment_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_assessment_metrics" ON assessment_metrics
  FOR ALL
  USING (
    assessment_id IN (SELECT id FROM assessments WHERE user_id = auth.uid())
  );

ALTER TABLE assessment_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_assessment_feedback" ON assessment_feedback
  FOR ALL
  USING (
    assessment_id IN (SELECT id FROM assessments WHERE user_id = auth.uid())
  );
