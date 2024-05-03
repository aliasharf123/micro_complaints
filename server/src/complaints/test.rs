use actix_web::test;
use dotenvy::dotenv;

use crate::{model::AppState, init_dbpool};

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
			.service(post_complaint),
	)
	.await;

	let req = test::TestRequest::post().uri("/complaints").to_request();
	let resp = test::call_service(&app, req).await;
	assert!(resp.status().is_client_error());
}
