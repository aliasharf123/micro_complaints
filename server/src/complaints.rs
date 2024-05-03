use crate::auth::authenticate_token::AuthenticationGuard;
use crate::model::{AppState, Complaint, Status, UpdatedComplaint};
use actix_web::{
	delete, get, patch, post,
	web::{self, Data, Json},
	HttpResponse, Responder,
};
use log::info;
use serde::Deserialize;
use sqlx::query;
#[derive(Deserialize)]
struct Params {
	status: Option<Status>,
	included_users: Option<bool>,
}

#[get("")]
pub async fn get_complaints(
	state: Data<AppState>,
	query: web::Query<Params>,
	_: AuthenticationGuard,
) -> impl Responder {
	let _db_pool = &state.get_ref().db;
	let (status, included_users) = (query.status, query.included_users);

	HttpResponse::Ok().body(format!(
		"Welcome complaints! status: {:?}, included_users: {:?}",
		status, included_users
	))
}

#[get("/{id}")]
pub async fn get_complaint_by_id(
	state: Data<AppState>,
	path: web::Path<(u32,)>,
	_: AuthenticationGuard,
) -> impl Responder {
	let _db_pool = &state.get_ref().db;
	let id = path.into_inner().0;

	HttpResponse::Ok().body(format!("Welcome complaint! id: {}", id))
}

#[patch("/{id}")]
pub async fn update_complaint(
	state: Data<AppState>,
	path: web::Path<(u32,)>,
	complaint: Json<UpdatedComplaint>,
	_: AuthenticationGuard,
) -> impl Responder {
	let _db_pool = &state.get_ref().db;
	let id = path.into_inner().0;

	print!("{}", id);
	HttpResponse::Ok().body(format!("Updated complaint! id: {:?}", complaint))
}

#[delete("/{id}")]
pub async fn delete_complaint(
	state: Data<AppState>,
	path: web::Path<(u32,)>,
	_: AuthenticationGuard,
) -> impl Responder {
	let _db_pool = &state.get_ref().db;
	let id = path.into_inner().0;
	info!("User logged in:asda");

	HttpResponse::Ok().body(format!("Deleted complaint! id: {}", id))
}

#[post("")]
async fn insert_complaint(
	state: Data<AppState>,
	complaint: Json<Complaint>,
	_: AuthenticationGuard,
) -> impl Responder {
	let db_pool = &state.get_ref().db;
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
	HttpResponse::Ok().body("inserted")
}

pub fn config(config: &mut web::ServiceConfig) {
	let scope = web::scope("/complaints")
		.service(insert_complaint)
		.service(get_complaints)
		.service(update_complaint)
		.service(get_complaint_by_id)
		.service(delete_complaint);

	config.service(scope);
}
#[cfg(test)]
mod tests {
	use actix_web::test;
	use dotenvy::dotenv;
use micro_complaints::init_dbpool;

	use super::*;

	#[actix_web::test]
	async fn insert_complaint_test() {
		dotenv().ok();
		let db_pool = init_dbpool().await;
		let app_state = AppState::init(db_pool);
		let app_data = web::Data::new(app_state);

		let app = test::init_service(
			actix_web::App::new()
				.app_data(app_data)
				.service(insert_complaint),
		)
		.await;

		let req = test::TestRequest::post().uri("/complaints").to_request();
		let resp = test::call_service(&app, req).await;
		assert!(resp.status().is_client_error());
	}
}
