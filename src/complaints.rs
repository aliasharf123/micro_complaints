use actix_web::{HttpResponse, web::Data, Responder, get};
use serde::Serialize;
use sqlx::query_as;

use crate::model::AppState;

#[derive(Debug, sqlx::Type, Serialize)]
#[sqlx(type_name = "status")]
#[sqlx(rename_all = "lowercase")]
enum Status {
	Open,
	Taken,
	Closed,
}
#[derive(Debug, Serialize)]
struct Complaint {
	id: i64,
	title: String,
	description: Option<String>,
	status: Status,
	tags: Option<String> //Vec<Tags> ?
}

#[get("complaints")]
pub async fn get_complaints(state: Data<AppState>) -> impl Responder {
	let db_pool = &state.get_ref().db;
	let complaints = query_as!(
		Complaint,
		r#"SELECT id, title, description, status as "status!: Status", tags FROM complaint"#
	)
    .fetch_all(db_pool)
    .await
    .expect("Could not fetch complaints");
    HttpResponse::Ok()
        .content_type("application/json")
        .json(complaints)
}
