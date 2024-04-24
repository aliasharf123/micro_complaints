CREATE TYPE role as ENUMM ('pleb', 'admin' 'support')

CREATE TABLE IF NOT EXISTS user
(
	id BIGSERIAL PRIMARY KEY,
	name TEXT NOT NULL,
	password TEXT NOT NULL,
	"role" role DEFAULT 'pleb',
	email TEXT NOT NULL,
)
