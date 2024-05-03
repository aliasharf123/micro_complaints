use sqlx::{query, query_as, PgPool};

use crate::model::{Complaint, CreatedComplaint, Status, UpdatedComplaint};

pub async fn insert_complaint(complaint: CreatedComplaint, db_pool: &PgPool, user_id: i64) {
    query!(
        r#"INSERT INTO complaint (title, description, status, tags, author) VALUES ($1, $2, $3, $4, $5)"#,
        complaint.title,
        complaint.description,
        complaint.status as Status, //why this wanted a clone but aight
        complaint.tags,
        user_id
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

pub async fn select_by_id(db_pool: &PgPool, id: i64) -> Complaint {
    query_as!(
        Complaint,
        r#"SELECT id, title, description, status as "status!: Status", tags FROM complaint WHERE id = $1 "#,
        id
    ).fetch_one(db_pool)
    .await
    .expect("Could not fetch complaint")
}

pub async fn delete(db_pool: &PgPool, id: i64) {
    query!(r#"DELETE FROM complaint WHERE id = $1"#, id)
        .execute(db_pool)
        .await
        .expect("I shat");
}

pub async fn update(db_pool: &PgPool, update_complaint: UpdatedComplaint, id: i64) {
    // query!(
    //     r#"UPDATE complaint SET title = $1, description = $2, status = $3, tags = $4 WHERE id = $5"#,
    //     update_complaint.title,
    //     update_complaint.description,
    //     update_complaint.status as Status,
    //     update_complaint.tags,
    //     id
    // )
    // .execute(db_pool)
    // .await
    // .expect("Failed to update complaint");
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
