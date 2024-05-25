FROM rust:1.75
ENV SQLX_OFFLINE=true
WORKDIR /usr/src/micro_complaints
# COPY . .
COPY ../target/release/micro_complaints ./micro_complaints

# RUN cargo install --path .

CMD ["./micro_complaints"]
