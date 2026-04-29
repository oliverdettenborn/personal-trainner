CREATE TABLE students (
  id         TEXT   PRIMARY KEY,
  user_id    UUID   NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name       TEXT   NOT NULL,
  created_at BIGINT NOT NULL
);

CREATE TABLE assessments (
  id                  TEXT   PRIMARY KEY,
  user_id             UUID   NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id          TEXT   NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  created_at          BIGINT NOT NULL,
  frente_antes_data   TEXT,
  frente_antes_peso   TEXT,
  frente_depois_data  TEXT,
  frente_depois_peso  TEXT,
  costas_antes_data   TEXT,
  costas_antes_peso   TEXT,
  costas_depois_data  TEXT,
  costas_depois_peso  TEXT,
  positivo_1          TEXT,
  positivo_2          TEXT,
  positivo_3          TEXT,
  positivo_4          TEXT,
  ajuste_1            TEXT,
  ajuste_2            TEXT,
  ajuste_3            TEXT,
  ajuste_4            TEXT,
  observacoes         TEXT,
  proxima_meta        TEXT,
  photo_frente_antes  TEXT,
  photo_frente_depois TEXT,
  photo_costas_antes  TEXT,
  photo_costas_depois TEXT
);
