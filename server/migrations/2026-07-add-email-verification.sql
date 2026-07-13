-- Email verification + password reset support.
-- Tokens are stored as SHA-256 hashes, never in plaintext.

ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verification_token_hash VARCHAR(128);
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verification_expires_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_reset_token_hash VARCHAR(128);
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_reset_expires_at TIMESTAMPTZ;

-- Accounts created before email verification existed are grandfathered in.
UPDATE users SET email_verified = true WHERE email_verification_token_hash IS NULL;

CREATE INDEX IF NOT EXISTS idx_users_email_verification_token
  ON users (email_verification_token_hash)
  WHERE email_verification_token_hash IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_users_password_reset_token
  ON users (password_reset_token_hash)
  WHERE password_reset_token_hash IS NOT NULL;
