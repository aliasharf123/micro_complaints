FROM rust:1.75

WORKDIR /usr/src/micro_complaints
COPY . .

RUN cargo install --path .

CMD ["micro_complaints"]
