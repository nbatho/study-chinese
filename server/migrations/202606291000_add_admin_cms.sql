BEGIN;

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS role VARCHAR(20) NOT NULL DEFAULT 'student';

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'users_role_check'
  ) THEN
    ALTER TABLE users
      ADD CONSTRAINT users_role_check CHECK (role IN ('student', 'admin'));
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS course_issue_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  lesson_id VARCHAR(50) REFERENCES lessons(id) ON DELETE SET NULL,
  word_id VARCHAR(50) REFERENCES words(id) ON DELETE SET NULL,
  exercise_id VARCHAR(50),
  category VARCHAR(30) NOT NULL DEFAULT 'content'
    CHECK (category IN ('content', 'translation', 'audio', 'exercise', 'technical', 'other')),
  status VARCHAR(20) NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'reviewing', 'resolved', 'dismissed')),
  message TEXT NOT NULL,
  admin_note TEXT,
  resolved_by UUID REFERENCES users(id) ON DELETE SET NULL,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS trg_course_issue_reports_updated_at ON course_issue_reports;
CREATE TRIGGER trg_course_issue_reports_updated_at BEFORE UPDATE ON course_issue_reports
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_course_issue_reports_status_created ON course_issue_reports (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_course_issue_reports_lesson ON course_issue_reports (lesson_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users (role);
CREATE INDEX IF NOT EXISTS idx_users_active ON users (is_active);

COMMIT;
