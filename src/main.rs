mod config;
mod google_oauth;
mod model;
mod complaints;

use crate::model::AppState;
use actix_cors::Cors;
use actix_web::{http::header, web, App, HttpServer};
use dotenvy::dotenv;
use micro_complaints::*;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();

    let db_pool = init_dbpool().await;
    let db = AppState::init(db_pool);
    let app_data = web::Data::new(db);

    println!("🚀 Server started successfully");

    HttpServer::new(move || {
        let cors = Cors::default()
            .allowed_origin("*")
            .allowed_methods(vec!["GET", "POST"])
            .allowed_headers(vec![
                header::CONTENT_TYPE,
                header::AUTHORIZATION,
                header::ACCEPT,
            ])
            .supports_credentials();
        App::new().app_data(app_data.clone()).wrap(cors)
    })
    .bind(init_address())?
    .run()
    .await
}
