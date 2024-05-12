use crate::model::AppState;
use actix_cors::Cors;
use actix_web::{http::header, middleware::Logger, web, App, HttpServer};
use dotenvy::dotenv;
use micro_complaints::*;

mod auth;
mod complaints;
mod config;
mod mail;
mod model;
mod users;
#[actix_web::main]
async fn main() -> std::io::Result<()> {
	dotenv().ok();

	std::env::set_var("RUST_LOG", "debug");
	env_logger::init();

	let db_pool = init_dbpool().await;
	sqlx::migrate!()
		.run(&db_pool)
		.await
		.expect("the migration did not work");

	let app_state = AppState::init(db_pool);
	let app_data = web::Data::new(app_state);

	println!("🚀 Server started successfully");

	HttpServer::new(move || {
		let cors = Cors::default()
			.allow_any_origin()
			.allowed_methods(vec!["GET", "POST", "PUT", "DELETE"])
			.allowed_headers(vec![
				header::CONTENT_TYPE,
				header::AUTHORIZATION,
				header::ACCEPT,
			])
			.supports_credentials();
		App::new()
			.configure(auth::config)
			.configure(complaints::config)
			.app_data(app_data.clone())
			.wrap(cors)
			.wrap(Logger::default())
			.wrap(Logger::new("%a %{User-Agent}i"))
	})
	.bind(init_address())?
	.run()
	.await
}
