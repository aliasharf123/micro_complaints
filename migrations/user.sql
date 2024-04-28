CREATE TYPE role AS ENUM ('pleb', 'admin', 'support');

CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  role role DEFAULT 'pleb', -- Use double quotes for column names with spaces
  email TEXT NOT NULL UNIQUE, -- Add UNIQUE constraint for unique email addresses
  photo Text
);