mod auth;
mod complaints;
mod config;
mod model;

use crate::model::AppState;
use actix_cors::Cors;
use actix_web::{http::header, middleware::Logger, web, App, HttpServer};
use dotenvy::dotenv;
use env_logger::Env;
use micro_complaints::*;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
	dotenv().ok();

	let db_pool = init_dbpool().await;
	let db = AppState::init(db_pool);
	let app_data = web::Data::new(db);
	env_logger::init_from_env(Env::default().default_filter_or("info"));

	println!("🚀 Server started successfully");

	HttpServer::new(move || {
		let cors = Cors::default()
			.allow_any_origin()
			.allowed_methods(vec!["GET", "POST"])
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
