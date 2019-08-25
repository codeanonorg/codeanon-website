const user = `

CREATE TABLE IF NOT EXISTS roles (
    role_id         SERIAL PRIMARY KEY NOT NULL,
    name            text NOT NULL
);

CREATE TABLE IF NOT EXISTS account_status (
    status_id       SERIAL PRIMARY KEY NOT NULL,
    name            text NOT NULL,
    timestamp       int  NOT NULL,
    update_timestamp int
);

CREATE TABLE IF NOT EXISTS users (
    user_id         SERIAL PRIMARY KEY  NOT NULL,
    username        text    NOT NULL,
    real_name       text    NOT NULL,
    email           text,
    password        text,
    timestamp       integer,
    role_id         integer, -- FK
    status_id       integer, -- FK
    CONSTRAINT fk_users_role_id FOREIGN KEY (role_id) REFERENCES roles (role_id),
    CONSTRAINT fk_users_status_id FOREIGN KEY (status_id) REFERENCES account_status (status_id)
);

`