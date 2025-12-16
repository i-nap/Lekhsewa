CREATE TABLE message (
                         id BIGSERIAL PRIMARY KEY,
                         full_name VARCHAR(255) NOT NULL,
                         email VARCHAR(255) NOT NULL,
                         message TEXT NOT NULL,
                         created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
