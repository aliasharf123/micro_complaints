use std::env;

pub fn init_address() -> (String, u16) {
    let port: u16 = env::var("ACTIX_PORT")
        .expect("SET ACTIX_PORT PLOX")
        .parse()
        .expect("Couldn't parse the ACTIX_PORT variable >:(");
    let address = env::var("ACTIX_IP").expect("SET ACTIX_IP PLEASE");
    (address, port)
}

// Database connection
use sqlx::Pool;
pub async fn init_dbpool() -> Pool<sqlx::Postgres> {
    use sqlx::postgres::PgPoolOptions;

    let database_url = env::var("DATABASE_URL").expect("Put a DB url in the .env file dumbass");
    let pool = PgPoolOptions::new()
        .max_connections(10)
        .connect(database_url.as_str())
        .await
        .expect("No pool connection man :(");
    pool
}
