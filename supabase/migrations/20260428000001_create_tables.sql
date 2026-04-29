CREATE TABLE students (
  id         TEXT   PRIMARY KEY,
  user_id    UUID   NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name       TEXT   NOT NULL,
  created_at BIGINT NOT NULL
);

CREATE TABLE assessments (
  id                   TEXT   PRIMARY KEY,
  user_id              UUID   NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id           TEXT   NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  created_at           BIGINT NOT NULL,
  front_before_date    TEXT,
  front_before_weight  TEXT,
  front_after_date     TEXT,
  front_after_weight   TEXT,
  back_before_date     TEXT,
  back_before_weight   TEXT,
  back_after_date      TEXT,
  back_after_weight    TEXT,
  positive_1           TEXT,
  positive_2           TEXT,
  positive_3           TEXT,
  positive_4           TEXT,
  adjustment_1         TEXT,
  adjustment_2         TEXT,
  adjustment_3         TEXT,
  adjustment_4         TEXT,
  notes                TEXT,
  next_goal            TEXT,
  photo_front_before   TEXT,
  photo_front_after    TEXT,
  photo_back_before    TEXT,
  photo_back_after     TEXT
);
