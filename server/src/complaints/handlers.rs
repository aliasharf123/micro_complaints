use crate::auth::AuthenticationGuard;
use crate::complaints::queries::*;
use crate::mail::send_mail;
use crate::model::{AppState, CreatedComplaint, Status, Role};
use actix_web::{
	delete, get, patch, post,
	web::{self, Data, Json},
	HttpResponse, Responder,
};
use serde::Deserialize;
#[derive(Deserialize)]
struct Params {
	status: Option<Status>,
}
#[get("")]
pub(super) async fn get_all(
	state: Data<AppState>,
	query: web::Query<Params>,
	_: AuthenticationGuard,
) -> impl Responder {
	let db_pool = &state.get_ref().db;
	let status = query.status;

	HttpResponse::Ok()
		.content_type("application/json")
		.json(select(db_pool, status).await)
}

#[get("/{id}")]
pub(super) async fn get_id(
	state: Data<AppState>,
	path: web::Path<(i64,)>,
	_db_pool: AuthenticationGuard,
) -> impl Responder {
	let _db_pool = &state.get_ref().db;
	let id = path.into_inner().0;
	let complaint = select_by_id(_db_pool, id).await;

	HttpResponse::Ok()
		.content_type("application/json")
		.json(complaint)
}

#[patch("/{id}")]
pub(super) async fn patch_id(
	state: Data<AppState>,
	path: web::Path<(i64,)>,
	complaint: Json<Status>,
	_: AuthenticationGuard,
) -> impl Responder {
	let db_pool = &state.get_ref().db;
	let id = path.into_inner().0;

	update(db_pool, complaint.into_inner(), &id).await;

	HttpResponse::Ok().body(format!("Updated complaint! id: {:?}", id))
}

#[delete("/{id}")]
pub(super) async fn delete_id(
	state: Data<AppState>,
	path: web::Path<(i64,)>,
	_: AuthenticationGuard,
) -> impl Responder {
	let db_pool = &state.get_ref().db;
	let id = path.into_inner().0;

	delete(db_pool, id).await;
	HttpResponse::Ok().body(format!("Deleted complaint! id: {}", id))
}

#[post("")]
async fn post_complaint(
	state: Data<AppState>,
	complaint: Json<CreatedComplaint>,
	auth_token: AuthenticationGuard,
) -> impl Responder {
	let db_pool = &state.get_ref().db;
	let complaint: CreatedComplaint = complaint.into_inner();
	let user = auth_token.user;

	let complaint_id = insert_complaint(complaint, db_pool, user.id).await;
	let mail_subject: String = String::from("Complaint Confirmation");
	let mail_body: String = format!(
		"Thank you for submitting a complaint! your complaint ID is {}",
		complaint_id
	);
	send_mail(user.email, mail_subject, mail_body)
		.await
		.expect("couldn't send mail");
	HttpResponse::Ok().body("inserted")
}
#[patch("close")]
async fn close_complaint(
	state: Data<AppState>,
	complaint_id: Data<i64>,
	close_reason: Data<String>,
	auth_token: AuthenticationGuard,
) -> impl Responder {
	let db_pool = &state.get_ref().db;
	let user = auth_token.user;
	let mail_subject: String = String::from("Complaint Closed");
	let mail_body: String = format!(
		"Your complaint with the id {} has been closed with the reason:\n {}",
		*complaint_id, *close_reason
	);
	send_mail(user.email, mail_subject, mail_body)
		.await
		.expect("couldn't send mail");

	let mut response = match user.role {
    Role::Complainer => HttpResponse::Forbidden(),
		_ => HttpResponse::Ok(),
	};

	update(db_pool, Status::Closed, &complaint_id).await;
	response.body("Authorised")
}
