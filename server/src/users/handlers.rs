use actix_web::{
	get,
	web::{self, Data},
	HttpResponse, Responder,
};

use crate::{auth::AuthenticationGuard, model::AppState, users::queries::select_by_id};

#[get("/{id}")]
pub(super) async fn get_id(
	state: Data<AppState>,
	path: web::Path<(i64,)>,
	_db_pool: AuthenticationGuard,
) -> impl Responder {
	let _db_pool = &state.get_ref().db;
	let id = path.into_inner().0;
	let user = select_by_id(_db_pool, id).await;

	HttpResponse::Ok()
		.content_type("application/json")
		.json(user)
}
