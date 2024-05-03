use sqlx::{query, query_as, PgPool};

use crate::model::{Complaint, Status};

pub async fn insert_complaint(complaint: Complaint, db_pool: &PgPool) {
    query!(
        r#"INSERT INTO complaint (title, description, status, tags) VALUES ($1, $2, $3, $4)"#,
        complaint.title,
        complaint.description,
        complaint.status as Status, //why this wanted a clone but aight
        complaint.tags
    )
    .execute(db_pool)
    .await
    .expect("I shat");
}

pub async fn select_everything(db_pool: &PgPool) -> Vec<Complaint> {
    query_as!(
		Complaint,
		r#"SELECT id, title, description, status as "status!: Status", tags FROM complaint WHERE status='open'"#
	)
    .fetch_all(db_pool)
    .await
    .expect("Could not fetch complaints")
}

pub async fn select_exclude_users(db_pool: &PgPool) -> Vec<Complaint> {
    query_as!(
		Complaint,
		r#"SELECT id, title, description, status as "status!: Status", tags FROM complaint WHERE status='open'"#
	)
    .fetch_all(db_pool)
    .await
    .expect("Could not fetch complaints")
}
