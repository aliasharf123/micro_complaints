use actix_web::{get, post, web, web::Data, HttpResponse, Responder};
use serde::{Serialize, Deserialize};
use sqlx::{query, query_as};

use crate::model::AppState;

#[derive(Debug, sqlx::Type, Serialize, Deserialize)]
#[sqlx(type_name = "status")]
#[sqlx(rename_all = "lowercase")]
enum Status {
    Open,
    Taken,
    Closed,
}
#[derive(Debug, Serialize, Deserialize)]
struct Complaint {
    id: i64,
    title: String,
    description: Option<String>,
    status: Status,
    tags: Option<String>, //Vec<Tags> ?
}

#[get("open")]
pub async fn get_complaints(state: Data<AppState>) -> impl Responder {
    let db_pool = &state.get_ref().db;
    let complaints = query_as!(
		Complaint,
		r#"SELECT id, title, description, status as "status!: Status", tags FROM complaint WHERE status='open'"#
	)
    .fetch_all(db_pool)
    .await
    .expect("Could not fetch complaints");
    HttpResponse::Ok()
        .content_type("application/json")
        .json(complaints)
}

#[get("closed")]
pub async fn get_closed_complaints(state: Data<AppState>) -> impl Responder {
    let db_pool = &state.get_ref().db;
    let complaints = query_as!(
		Complaint,
		r#"SELECT id, title, description, status as "status!: Status", tags FROM complaint WHERE status='closed'"#
	)
    .fetch_all(db_pool)
    .await
    .expect("Could not fetch complaints");
    HttpResponse::Ok()
        .content_type("application/json")
        .json(complaints)
}

#[post("new")]
async fn insert_complaint(state: Data<AppState>, complaint: Json<Complaint>) -> impl Responder {
    let db_pool = &state.get_ref().db;
    query!(
        r#"INSERT INTO complaint (title, description, status, tags) VALUES ($1, $2, $3, $4)"#,
        complaint.title,
        complaint.description,
        complaint.clone().status as Status, //why this wanted a clone but aight
        complaint.tags
    )
    .execute(db_pool)
    .await
    .expect("I shat");
    HttpResponse::Ok().body("inserted")
}
