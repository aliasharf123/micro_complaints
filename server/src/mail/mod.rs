#[cfg(test)]
mod tests;

use std::{env, error::Error};
use actix_web::web::Json;
use reqwest::{Client, Response};
use serde::Serialize;

#[allow(non_snake_case)]
#[derive(Serialize)]
struct Mail {
	subject: String,
	body: String,
	mailRecipient: String,
}
#[allow(non_snake_case)]
pub async fn send_mail(
	mailRecipient: String,
	subject: String,
	body: String,
) -> Result<Response, reqwest::Error> {
	let mail = Mail {
		subject,
		body,
		mailRecipient,
	};
	let root_url = env::var("MAIL_URL").expect("No MAIL_URL set in .env");
	let client = Client::new();
	client.post(root_url).json(&mail).send().await
}
