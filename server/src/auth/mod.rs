use actix_web::web::{self};

use crate::model::User;

pub mod authenticate_token;
mod google_oauth;
mod handlers;

pub struct AuthenticationGuard {
	pub user: User,
}

pub fn config(config: &mut web::ServiceConfig) {
	use handlers::*;
	let scope = web::scope("/auth")
		.service(google_oauth_handler)
		.service(logout_handler)
		.service(me_handler);
	config.service(scope);
}
