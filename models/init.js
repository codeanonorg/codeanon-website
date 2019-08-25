/*
const createTables = `

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

CREATE TABLE IF NOT EXISTS articles (
    article_id      SERIAL PRIMARY KEY NOT NULL,
    title           text        NOT NULL,
    user_id         integer     NOT NULL, -- FK
    timestamp       integer     NOT NULL,
    description     text        NOT NULL,
    content         text        NOT NULL,
    CONSTRAINT fk_articles_user_id FOREIGN KEY (user_id) REFERENCES users (user_id)
);

CREATE TABLE IF NOT EXISTS projects (
    project_id      SERIAL PRIMARY KEY NOT NULL,
    title           text    NOT NULL,
    user_id         integer     NOT NULL, --  FK
    timestamp       integer     NOT NULL,
    description     text,
    content         text    NOT NULL,
    CONSTRAINT fk_projects_user_id FOREIGN KEY (user_id) REFERENCES users (user_id)
);

CREATE TABLE IF NOT EXISTS tags (
    tag_id          SERIAL PRIMARY KEY  NOT NULL,
    name            text    NOT NULL
);

CREATE TABLE IF NOT EXISTS article_tags (
    article_id      integer NOT NULL,   --FK
    tag_id          integer NOT NULL,   --FK
    CONSTRAINT fk_articles_tags_article_id FOREIGN KEY (article_id) REFERENCES articles (article_id),
    CONSTRAINT fk_articles_tags_tag_id FOREIGN KEY (tag_id) REFERENCES tags (tag_id),
    PRIMARY KEY (article_id, tag_id)
);

CREATE TABLE IF NOT EXISTS project_tags (
    project_id      integer NOT NULL, --FK
    tag_id          integer NOT NULL, --FK
    CONSTRAINT fk_project_tags_project_id FOREIGN KEY (project_id) REFERENCES projects (project_id),
    CONSTRAINT fk_project_tags_tag_id FOREIGN KEY (tag_id) REFERENCES tags (tag_id),
    PRIMARY KEY (project_id, tag_id)
);

CREATE TABLE IF NOT EXISTS project_participants (
    project_id      integer NOT NULL, --FK
    user_id         integer NOT NULL, --FK
    CONSTRAINT fk_project_participants_project_id FOREIGN KEY (project_id) REFERENCES projects (project_id),
    CONSTRAINT fk_project_participants_user_id FOREIGN KEY (user_id) REFERENCES users (user_id),
    PRIMARY KEY (project_id, user_id)
);

CREATE TABLE IF NOT EXISTS liked_articles (
    article_id      integer NOT NULL, --FK
    user_id         integer NOT NULL, --FK
    CONSTRAINT fk_liked_articles FOREIGN KEY (article_id) REFERENCES articles (article_id),
    CONSTRAINT fk_liked_projects_user_id FOREIGN KEY (user_id) REFERENCES users (user_id),
    PRIMARY KEY (article_id, user_id)
);

CREATE TABLE IF NOT EXISTS liked_projects (
    project_id      integer NOT NULL, --FK
    user_id         integer NOT NULL, --FK
    CONSTRAINT fk_liked_projects_project_id FOREIGN KEY (project_id) REFERENCES projects (project_id),
    CONSTRAINT fk_liked_projects_user_id FOREIGN KEY (user_id) REFERENCES users (user_id),
    PRIMARY KEY (project_id, user_id)
);
    `;

console.log(init)

*/