mod google_oauth;
use chrono::Duration;

use crate::model::{AppState, QueryCode, Role, TokenClaims, User};
use actix_web::{
	cookie::{time::Duration as ActixWebDuration, Cookie},
	get, web, HttpResponse, Responder,
};
use chrono::Utc;
use google_oauth::{get_google_user, request_token};
use jsonwebtoken::{encode, EncodingKey, Header};
use sqlx::{query, query_as};

#[get("google")]
async fn google_oauth_handler(
	query: web::Query<QueryCode>,
	data: web::Data<AppState>,
) -> impl Responder {
	let code = &query.code;
	let state = &query.state; //this is unused...please explain

	if code.is_empty() {
		return HttpResponse::Unauthorized().json(
			serde_json::json!({"status": "fail", "message": "Authorization code not provided!"}),
		);
	}

	let token_response = request_token(code.as_str(), &data).await;
	if token_response.is_err() {
		let message = token_response.err().unwrap().to_string();
		return HttpResponse::BadGateway()
			.json(serde_json::json!({"status": "fail", "message": message}));
	}

	let token_response = token_response.unwrap();
	let google_user = get_google_user(&token_response.access_token, &token_response.id_token).await;

	if google_user.is_err() {
		let message = google_user.err().unwrap().to_string();
		return HttpResponse::BadGateway()
			.json(serde_json::json!({"status": "fail", "message": message}));
	}
	let google_user = google_user.unwrap();
	let db_pool = &data.get_ref().db;

	let user = query_as!(
		User,
		r#"SELECT id, name, role as "role!: Role", email, photo FROM users WHERE email = $1 "#,
		google_user.email
	)
	.fetch_one(db_pool)
	.await;

	//this caused me brain confusion - Sewelam
	let user_id: i64;
	if user.is_err() {
		let result = query!(
			r#"INSERT INTO users (name, email, role, photo) VALUES ($1, $2, $3, $4)
            RETURNING id as "id!: i64""#,
			google_user.name,
			google_user.email,
			Role::Complainer as Role,
			Some(google_user.picture)
		)
		.fetch_one(db_pool)
		.await
		.expect("this should never happen");

		user_id = result.id;
	// if result.is_err() {}
	} else {
		user_id = user.unwrap().id;
	}

	let jwt_secret = data.env.jwt_secret.to_owned();
	let now = Utc::now();
	let iat = now.timestamp() as usize;
	let exp = (now + Duration::minutes(data.env.jwt_max_age)).timestamp() as usize;
	let claims: TokenClaims = TokenClaims {
		sub: user_id.to_string(),
		exp,
		iat,
	};

	let token = encode(
		&Header::default(),
		&claims,
		&EncodingKey::from_secret(jwt_secret.as_ref()),
	)
	.unwrap();

	let cookie = Cookie::build("token", token)
		.path("/")
		.max_age(ActixWebDuration::new(60 * data.env.jwt_max_age, 0))
		.http_only(true)
		.finish();
    let frontend_origin = data.env.client_origin.to_owned();
    let mut response = HttpResponse::Found();
    response.append_header((LOCATION, format!("{}{}", frontend_origin, state)));
    response.cookie(cookie);
    response.finish()
}

pub fn config(config: &mut web::ServiceConfig) {
	let scope = web::scope("/sessions/oauth/").service(google_oauth_handler);
	config.service(scope);
}
