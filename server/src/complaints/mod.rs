use actix_web::web;

use self::handlers::*;

mod handlers;
#[cfg(test)]
mod test;
pub fn config(config: &mut web::ServiceConfig) {
	let scope = web::scope("/complaints")
		.service(post_complaint)
		.service(get_all)
		.service(patch_id)
		.service(get_id)
		.service(delete_id);

	config.service(scope);
}
mod queries;
