create table if not exists canvas_image (
    id bigserial primary key,
    file_name text not null unique,
    image_data bytea not null,
    uploaded_at timestamptz not null default now()
)