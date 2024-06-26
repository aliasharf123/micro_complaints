-- Add up migration script here
CREATE TYPE status AS ENUM ('open', 'closed', 'taken');
-- CREATE TYPE tags AS ENUM ('')
CREATE TABLE IF NOT EXISTS complaint (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status status NOT NULL DEFAULT 'open', -- Use single quotes for string literals
  tags TEXT, -- Consider using an ENUM for well-defined tags
  time_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Auto-populate creation time
  time_closed TIMESTAMP,
  author BIGSERIAL NOT NULL REFERENCES users(id),
  supporter BIGSERIAL REFERENCES users(id),
  CONSTRAINT chk_is_supporter CHECK (is_support(supporter))
);
