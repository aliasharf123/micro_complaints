use crate::model::{AppState, Complaint, Status, UpdatedComplaint};
use actix_web::{
    delete, get, patch, post,
    web::{self, service, Data, Json},
    HttpResponse, Responder,
};
use serde::{Deserialize, Serialize};
use sqlx::{query, query_as};

#[derive(Deserialize)]
struct GetParams {
    status: Status,
    included_users: bool,
}

#[get("")]
pub async fn get_complaints(state: Data<AppState>) -> impl Responder {
    let db_pool = &state.get_ref().db;

    HttpResponse::Ok().body("open complaints")
}

#[get("/{id}")]
pub async fn get_complaint_by_id(state: Data<AppState>, path: web::Path<(u32,)>) -> impl Responder {
    let db_pool = &state.get_ref().db;
    let id = path.into_inner().0;

    HttpResponse::Ok().body(format!("Welcome complaint! id: {}", id))
}

#[patch("/{id}")]
pub async fn update_complaint(
    state: Data<AppState>,
    path: web::Path<(u32,)>,
    complaint: Json<UpdatedComplaint>,
) -> impl Responder {
    let db_pool = &state.get_ref().db;
    let id = path.into_inner().0;

    print!("{}", id);
    HttpResponse::Ok().body(format!("Updated complaint! id: {:?}", complaint))
}

#[delete("/{id}")]
pub async fn delete_complaint(state: Data<AppState>, path: web::Path<(u32,)>) -> impl Responder {
    let db_pool = &state.get_ref().db;
    let id = path.into_inner().0;

    HttpResponse::Ok().body(format!("Deleted complaint! id: {}", id))
}

#[post("")]
async fn insert_complaint(state: Data<AppState>, complaint: Json<Complaint>) -> impl Responder {
    let db_pool = &state.get_ref().db;
    // query!(
    //     r#"INSERT INTO complaint (title, description, status, tags) VALUES ($1, $2, $3, $4)"#,
    //     complaint.title,
    //     complaint.description,
    //     complaint.clone().status as Status, //why this wanted a clone but aight
    //     complaint.tags
    // )
    // .execute(db_pool)
    // .await
    // .expect("I shat");
    HttpResponse::Ok().body("inserted")
}

pub fn config(config: &mut web::ServiceConfig) {
    let scope = web::scope("/complaints")
        .service(insert_complaint)
        .service(get_complaints)
        .service(update_complaint)
        .service(get_complaint_by_id)
        .service(delete_complaint);
    config.service(scope);
}
