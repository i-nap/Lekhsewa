CREATE TABLE IF NOT EXISTS forms (
                                     id BIGSERIAL PRIMARY KEY,
                                     name VARCHAR(255) NOT NULL,
                                     description TEXT
);



CREATE TABLE IF NOT EXISTS form_fields (
                                           id BIGSERIAL PRIMARY KEY,
                                           form_id BIGINT NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
                                           label VARCHAR(255) NOT NULL,
                                           field_name VARCHAR(255) NOT NULL,
                                           type VARCHAR(255) NOT NULL,
                                           required BOOLEAN DEFAULT FALSE,
                                            nepali_text BOOLEAN DEFAULT FALSE
);
CREATE TABLE IF NOT EXISTS field_options (
                                             id BIGSERIAL PRIMARY KEY,
                                             field_id BIGINT NOT NULL REFERENCES form_fields(id) ON DELETE CASCADE,
                                             opt_value VARCHAR(255) NOT NULL,
                                             opt_label VARCHAR(255) NOT NULL
);
