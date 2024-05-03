use crate::auth::authenticate_token::AuthenticationGuard;
use crate::complaints::queries::insert_complaint;
use crate::model::{AppState, Complaint, Status, UpdatedComplaint};
use actix_web::{
	delete, get, patch, post,
	web::{self, Data, Json},
	HttpResponse, Responder,
};
use log::info;
use serde::Deserialize;
#[derive(Deserialize)]
struct Params {
	status: Option<Status>,
	included_users: Option<bool>,
}
#[get("")]
pub async fn get_all(
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
pub async fn get_id(
	state: Data<AppState>,
	path: web::Path<(u32,)>,
	_: AuthenticationGuard,
) -> impl Responder {
	let _db_pool = &state.get_ref().db;
	let id = path.into_inner().0;

	HttpResponse::Ok().body(format!("Welcome complaint! id: {}", id))
}

#[patch("/{id}")]
pub async fn patch_id(
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
pub async fn delete_id(
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
async fn post_complaint(
	state: Data<AppState>,
	complaint: Json<Complaint>,
	_: AuthenticationGuard,
) -> impl Responder {
	let db_pool = &state.get_ref().db;
	let complaint: Complaint = complaint.into_inner();
	insert_complaint(complaint, db_pool).await;
	HttpResponse::Ok().body("inserted")
}
