use actix_web::web;

mod handlers;
pub(crate) mod queries;
#[cfg(test)]
mod test;

pub fn config(config: &mut web::ServiceConfig) {
	let scope = web::scope("/users").service(handlers::get_id);

	config.service(scope);
}
