use sqlx::{query, query_as, PgPool};

use crate::model::{Complaint, CreatedComplaint, Status, UpdatedComplaint};

pub(super) async fn insert_complaint(
	complaint: CreatedComplaint,
	db_pool: &PgPool,
	user_id: i64,
) -> i64 {
	query!(
        r#"INSERT INTO complaint (title, description, status, tags, author) VALUES ($1, $2, $3, $4, $5) RETURNING id"#,
        complaint.title,
        complaint.description,
        complaint.status as Status, //why this wanted a clone but alright
        complaint.tags,
        user_id
    )
    .fetch_one(db_pool)
    .await
    .expect("Could not insert complaint").id
}

pub(super) async fn select_by_id(db_pool: &PgPool, id: i64) -> Complaint {
	query_as!(
		Complaint,
		r#"SELECT id, title, description, status as "status!: Status", tags FROM complaint WHERE id = $1 "#,
		id
	)
	.fetch_one(db_pool)
	.await
	.expect("Could not fetch complaint")
}

pub(super) async fn delete(db_pool: &PgPool, id: i64) {
	query!(r#"DELETE FROM complaint WHERE id = $1"#, id)
		.execute(db_pool)
		.await
		.expect("I shat");
}

//forgive me for I am about to cause paradigm conflictions
pub(super) async fn update(db_pool: &PgPool, status: Status, id: i64) {
	query!(
		r#"UPDATE complaint SET status = $1 WHERE id = $2"#,
		status as Status,
		id
	)
	.execute(db_pool)
	.await
	.expect("Failed to update complaint");
}

pub(super) async fn select(db_pool: &PgPool, status: Option<Status>) -> Vec<Complaint> {
	let mut query_str =
		String::from(r#"SELECT id, title, description, status, tags FROM complaint"#);
	if let Some(n) = status {
		query_str.push_str(" WHERE status = $1");
		sqlx::query_as(query_str.as_str()).bind(n as Status)
	} else {
		sqlx::query_as(&query_str)
	}
	.fetch_all(db_pool)
	.await
	.expect("Could not fetch complaints")
}
