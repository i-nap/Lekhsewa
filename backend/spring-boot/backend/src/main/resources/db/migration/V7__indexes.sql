CREATE INDEX IF NOT EXISTS idx_forms_lower_name ON forms (LOWER(name));

CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX IF NOT EXISTS idx_forms_name_trgm ON forms USING GIN (name gin_trgm_ops);
