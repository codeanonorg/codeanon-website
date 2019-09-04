-- INIT TABLES

CREATE TABLE IF NOT EXISTS roles (
    role_id         SERIAL PRIMARY KEY NOT NULL,
    name            text NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS account_status (
    status_id       SERIAL PRIMARY KEY NOT NULL,
    name            text NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS codakeys (
    key_id          SERIAL PRIMARY KEY NOT NULL,
    key_text        text NOT NULL UNIQUE,
    user_id         integer, -- FK
    CONSTRAINT fk_codakeys_user_id FOREIGN KEY (user_id) REFERENCES users (user_id)
);

CREATE TABLE IF NOT EXISTS users (
    user_id         SERIAL PRIMARY KEY  NOT NULL,
    username        text    NOT NULL UNIQUE,
    real_name       text    NOT NULL,
    email           text    NOT NULL UNIQUE,
    password        text    NOT NULL,
    timestamp       bigint,
    role_id         integer, -- FK
    status_id       integer, -- FK
    update_timestamp bigint,
    CONSTRAINT fk_users_role_id FOREIGN KEY (role_id) REFERENCES roles (role_id),
    CONSTRAINT fk_users_status_id FOREIGN KEY (status_id) REFERENCES account_status (status_id)
);

CREATE TABLE IF NOT EXISTS articles (
    article_id      SERIAL PRIMARY KEY NOT NULL,
    title           text        NOT NULL UNIQUE,
    user_id         integer     NOT NULL, -- FK
    timestamp       bigint      NOT NULL,
    tags            text[],
    description     text        NOT NULL,
    content         text        NOT NULL,
    verified        boolean     NOT NULL DEFAULT false,
    CONSTRAINT fk_articles_user_id FOREIGN KEY (user_id) REFERENCES users (user_id)
);

CREATE TABLE IF NOT EXISTS projects (
    project_id      SERIAL PRIMARY KEY NOT NULL,
    title           text        NOT NULL UNIQUE,
    user_id         integer     NOT NULL, --  FK
    timestamp       bigint      NOT NULL,
    tags            text[],
    description     text,
    content         text        NOT NULL,
    verified        boolean     NOT NULL DEFAULT false,
    CONSTRAINT fk_projects_user_id FOREIGN KEY (user_id) REFERENCES users (user_id)
);

CREATE TABLE IF NOT EXISTS project_participants (
    project_id      integer     NOT NULL, --FK
    user_id         integer     NOT NULL, --FK
    CONSTRAINT fk_project_participants_project_id FOREIGN KEY (project_id) REFERENCES projects (project_id),
    CONSTRAINT fk_project_participants_user_id FOREIGN KEY (user_id) REFERENCES users (user_id),
    PRIMARY KEY (project_id, user_id)
);

CREATE TABLE IF NOT EXISTS liked_articles (
    article_id      integer     NOT NULL, --FK
    user_id         integer     NOT NULL, --FK
    CONSTRAINT fk_liked_articles FOREIGN KEY (article_id) REFERENCES articles (article_id),
    CONSTRAINT fk_liked_projects_user_id FOREIGN KEY (user_id) REFERENCES users (user_id),
    PRIMARY KEY (article_id, user_id)
);

CREATE TABLE IF NOT EXISTS liked_projects (
    project_id      integer     NOT NULL, --FK
    user_id         integer     NOT NULL, --FK
    CONSTRAINT fk_liked_projects_project_id FOREIGN KEY (project_id) REFERENCES projects (project_id),
    CONSTRAINT fk_liked_projects_user_id FOREIGN KEY (user_id) REFERENCES users (user_id),
    PRIMARY KEY (project_id, user_id)
);

INSERT INTO roles(name) VALUES ('admin'), ('moderateur'), ('prestige'), ('membre');

INSERT INTO account_status(name) VALUES ('ok'), ('kicked'), ('banned'), ('censored');