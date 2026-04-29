CREATE TABLE students (
  id         TEXT   PRIMARY KEY,
  user_id    UUID   NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name       TEXT   NOT NULL,
  created_at BIGINT NOT NULL
);

CREATE TABLE assessments (
  id         TEXT   PRIMARY KEY,
  user_id    UUID   NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id TEXT   NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  created_at BIGINT NOT NULL,
  notes      TEXT,
  next_goal  TEXT
);

-- one row per view (side × moment): photo + date + weight at that snapshot
CREATE TABLE assessment_snapshots (
  id            TEXT    PRIMARY KEY,
  assessment_id TEXT    NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  side          TEXT    NOT NULL CHECK (side IN ('front', 'back')),
  moment        TEXT    NOT NULL CHECK (moment IN ('before', 'after')),
  photo_url     TEXT,
  date          TEXT,
  weight        TEXT,
  UNIQUE (assessment_id, side, moment)
);

-- extensible key-value measurements (weight, body fat %, circumferences, etc.)
CREATE TABLE assessment_metrics (
  id            TEXT    PRIMARY KEY,
  assessment_id TEXT    NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  name          TEXT    NOT NULL,
  value         TEXT    NOT NULL,
  unit          TEXT,
  position      INTEGER NOT NULL DEFAULT 0
);

-- categorized feedback items (positive, adjustment, or any future category)
CREATE TABLE assessment_feedback (
  id            TEXT    PRIMARY KEY,
  assessment_id TEXT    NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  category      TEXT    NOT NULL CHECK (category IN ('positive', 'adjustment')),
  content       TEXT    NOT NULL,
  position      INTEGER NOT NULL DEFAULT 0
);
