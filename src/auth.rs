use actix_web::{post, web, Responder};

use crate::model::{AppState, RegisterUserSchema};

#[post("/auth/register")]
async fn register_user_handler(
    body: web::Json<RegisterUserSchema>,
    data: web::Data<AppState>,
) -> impl Responder {
}
