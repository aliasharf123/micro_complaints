use super::*;

#[actix_web::test]
async fn send_mail_test() {
	dotenvy::dotenv().ok();
	let response = send_mail(
		String::from("realest.roosya@gmail.com"),
		String::from("LONELY NIGHTS"),
		String::from("FADES INTO HIS WHITE NIKES"),
	)
	.await;
	dbg!(&response);
	assert!(response.is_ok())
}
