use crate::config;
// use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

#[derive(Debug, sqlx::Type, Serialize, Deserialize, Clone)]
#[sqlx(type_name = "role", rename_all = "lowercase")]
pub enum Role {
    Complainer,
    Admin,
    Support,
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct User {
    pub id: i64,
    pub name: String,
    pub email: String,
    pub role: Role,
    pub photo: Option<String>,
}
pub struct AppState {
    pub db: sqlx::Pool<sqlx::Postgres>,
    pub env: config::Config,
}

impl AppState {
    pub fn init(db: sqlx::Pool<sqlx::Postgres>) -> AppState {
        AppState {
            db,
            env: config::Config::init(),
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TokenClaims {
    pub sub: String,
    pub iat: usize,
    pub exp: usize,
}

#[derive(Debug, Deserialize)]
pub struct RegisterUserSchema {
    pub name: String,
    pub email: String,
}

#[derive(Debug, Deserialize)]
pub struct QueryCode {
    pub code: String,
    pub state: String,
}

#[derive(Debug, Deserialize)]
pub struct LoginUserSchema {
    pub email: String,
    pub password: String,
}

#[derive(Debug, sqlx::Type, Serialize, Deserialize, Clone, Copy)]
#[sqlx(type_name = "status", rename_all = "lowercase")]
pub enum Status {
    Open,
    Taken,
    Closed,
}
#[derive(Debug, Serialize, Deserialize, Clone, sqlx::FromRow)]
pub struct Complaint {
    pub id: i64,
    pub title: String,
    pub description: Option<String>,
    pub status: Status,
    pub tags: Option<String>, //Vec<Tags> ?
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ComplaintWithAuthor {
    pub id: i64,
    pub title: String,
    pub description: Option<String>,
    pub status: Status,
    pub tags: Option<String>, //Vec<Tags> ?
    pub author_id: i64,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct CreatedComplaint {
    pub title: String,
    pub description: Option<String>,
    pub status: Status,
    pub tags: Option<String>, //Vec<Tags> ?
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct UpdatedComplaint {
    pub title: Option<String>,
    pub description: Option<String>,
    pub status: Option<Status>,
    pub tags: Option<String>,
}
