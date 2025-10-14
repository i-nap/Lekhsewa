CREATE TABLE app_user (
  id           BIGSERIAL PRIMARY KEY,
  auth0_sub    TEXT UNIQUE NOT NULL,
  email        TEXT,
  full_name         TEXT,
  email_verified BOOLEAN DEFAULT FALSE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE canvas_image
ADD COLUMN IF NOT EXISTS uploaded_by TEXT REFERENCES app_user(auth0_sub);