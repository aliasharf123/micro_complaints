use std::{future::Future, pin::Pin};

use actix_web::{
    dev::Payload,
    error::ErrorUnauthorized,
    http,
    web::{self},
    FromRequest, HttpRequest,
};
use jsonwebtoken::{decode, Algorithm, DecodingKey, Validation};
use log::info;
use serde_json::json;
use sqlx::query_as;

use crate::model::{AppState, Role, TokenClaims, User};

use super::AuthenticationGuard;

impl FromRequest for AuthenticationGuard {
    type Error = actix_web::Error;
    type Future = Pin<Box<dyn Future<Output = Result<Self, Self::Error>>>>;

    fn from_request(req: &HttpRequest, _: &mut Payload) -> Self::Future {
        let req = req.clone();
        Box::pin(async move {
            let token = req
                .cookie("token")
                .map(|c| c.value().to_string())
                .or_else(|| {
                    req.headers()
                        .get(http::header::AUTHORIZATION)
                        .map(|h| h.to_str().unwrap().split_at(7).1.to_string())
                });

            if token.is_none() {
                return Err(ErrorUnauthorized(
                    json!({"status": "fail", "message": "You are not logged in, please provide token"}),
                ));
            }

            let data = req.app_data::<web::Data<AppState>>().unwrap();

            let jwt_secret = data.env.jwt_secret.to_owned();

            let decode = decode::<TokenClaims>(
                token.unwrap().as_str(),
                &DecodingKey::from_secret(jwt_secret.as_ref()),
                &Validation::new(Algorithm::HS256),
            );

            match decode {
                Ok(_) => {
                    let db_pool = &data.db;
                    // info!("decode = {:?}", decode.unwrap().claims.sub);

                    let user = query_as!(
						User,
						r#"SELECT id, name, role as "role!: Role", email, photo FROM users WHERE id = $1 "#,
						decode.unwrap().claims.sub.parse::<i64>().unwrap()
					)
					.fetch_one(db_pool)
					.await;

                    match user {
                        Ok(user) => Ok(AuthenticationGuard { user }),
                        Err(_) => Err(ErrorUnauthorized(
                            json!({"status": "fail", "message": "Invalid token or user doesn't exists"}),
                        )),
                    }
                }
                Err(_) => Err(ErrorUnauthorized(
                    json!({"status": "fail", "message": "Invalid token or usre doesn't exists"}),
                )),
            }
        })
    }
}
