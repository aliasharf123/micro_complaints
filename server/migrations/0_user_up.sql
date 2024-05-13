-- Add up migration script here
CREATE TYPE role AS ENUM ('complainer', 'admin', 'support');

CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  role role DEFAULT 'complainer', -- Use double quotes for column names with spaces
  email TEXT NOT NULL UNIQUE, -- Add UNIQUE constraint for unique email addresses
  photo Text
);
CREATE OR REPLACE FUNCTION is_support(user_id bigint) RETURNS boolean
       AS
       $func$
         BEGIN
              IF user_id IS NULL THEN
                RETURN TRUE;
              END IF;
              RETURN (SELECT role FROM users WHERE id = user_id) = 'support'::role;
        END
       $func$
       LANGUAGE plpgsql;

INSERT INTO public.users (name, email, role) VALUES ('test', 'aslida@da', 'support');