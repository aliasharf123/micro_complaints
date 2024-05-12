use sqlx::{query, query_as, PgPool};

use crate::model::{Role, User};

pub(super) async fn select_by_id(db_pool: &PgPool, id: i64) -> User {
	query_as!(
		User,
		r#"SELECT id, name, role as "role!: Role", email, photo FROM users WHERE id = $1 "#,
		id
	)
	.fetch_one(db_pool)
	.await
	.expect("Could not fetch complaint")
}
pub async fn get_email(db_pool: &PgPool, id: i64) -> String {
	query!(r#"SELECT email FROM users WHERE id=$1"#, id)
		.fetch_one(db_pool)
		.await
		.expect("Couldn't get email")
		.email
}
