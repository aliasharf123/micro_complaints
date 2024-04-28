mod google_oauth;
use chrono::{prelude::*, Duration};
use std::borrow::{Borrow, BorrowMut};

use crate::model::{AppState, QueryCode, RegisterUserSchema, Role, TokenClaims, User};
use actix_web::{
    cookie::{time::Duration as ActixWebDuration, Cookie},
    get, post, web, HttpResponse, Responder,
};
use chrono::Utc;
use google_oauth::{get_google_user, request_token};
use serde_json;
use sqlx::{postgres::PgRow, query, query_as};
use uuid::Uuid;
use jsonwebtoken::{encode, EncodingKey, Header};
#[get("/sessions/oauth/google")]
async fn google_oauth_handler(
    query: web::Query<QueryCode>,
    data: web::Data<AppState>,
) -> impl Responder {
    let code = &query.code;
    let state = &query.state;

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

    let user_id: i64;
    if user.is_err() {
        let user = User {
            id: user_id,
            name: google_user.name,
            email: google_user.email,
            role: Role::Pleb,
            photo: Some(google_user.picture),
        };
        let result = query!(
            "INSERT INTO users (name, email, role, photo) VALUES ($1, $2, $3, $4)
            returning id",
            user.name,
            user.email,
            user.role as Role,
            user.photo
        )
        .fetch_one(db_pool)
        .await;

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

    return HttpResponse::Ok().json(
        serde_json::json!({"status": "success", "data": "hello from google oauth handler!"}),
    );
}

pub fn config(config: &mut web::ServiceConfig) {
    let scope = web::scope("").service(google_oauth_handler);
}
