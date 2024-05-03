use actix_web::web;

use crate::model::User;

mod handlers;
pub mod authenticate_token;
mod google_oauth;

pub struct AuthenticationGuard {
	pub user: User,
}

pub fn config(config: &mut web::ServiceConfig) {
	use handlers::*;
	let scope = web::scope("/auth")
		.service(google_oauth_handler)
		.service(logout_handler);
	config.service(scope);
}
