-- Add up migration script here
CREATE TYPE role AS ENUM ('complainer', 'admin', 'support');

CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  role role DEFAULT 'complainer', -- Use double quotes for column names with spaces
  email TEXT NOT NULL UNIQUE, -- Add UNIQUE constraint for unique email addresses
  photo Text
);