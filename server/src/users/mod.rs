use actix_web::web;

mod handlers;
mod queries;
#[cfg(test)]
mod test;

pub fn config(config: &mut web::ServiceConfig) {
	let scope = web::scope("/users");

	config.service(scope);
}
