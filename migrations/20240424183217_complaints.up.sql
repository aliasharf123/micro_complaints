-- Add up migration script here
CREATE TYPE status AS ENUM ('open', 'closed', 'taken');
-- CREATE TYPE tags AS ENUM ('')
CREATE TABLE IF NOT EXISTS complaint
(
	id BIGSERIAL PRIMARY KEY,
	title TEXT NOT NULL,
	description TEXT NOT NULL,
	status status NOT NULL DEFAULT 'open',
	-- TODO decide if tags should be TEXT or an ENUM
	tags TEXT,
	time_created timestamp NOT NULL,
	time_closed timestamp NOT NULL

);
