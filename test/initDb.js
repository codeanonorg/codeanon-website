
const { Client } = require('pg')

//  const time = require('../public/js/timeHandling')

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'catest',
    password: 'dev',
    port: 5555,
})

client.connect()


const createTables = `

CREATE TABLE IF NOT EXISTS roles (
    role_id         SERIAL PRIMARY KEY NOT NULL,
    name            text NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS account_status (
    status_id       SERIAL PRIMARY KEY NOT NULL,
    name            text NOT NULL UNIQUE
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
);`;

client
    .query(createTables)
    .then(res => {
        console.log('tables created')
    })
    .catch(e => console.error(e.stack))

//  Role Init
const role_sql = 'INSERT INTO roles(name) VALUES ($1), ($2), ($3), ($4) RETURNING *'
const value_ad = ['admin', 'moderateur', 'prestige', 'membre']

client
    .query(role_sql, value_ad)
    .then(res => {
        console.log('roles created ' + res)
    })
    .catch(e => console.error(e.stack))


// Status Init
const status_sql = 'INSERT INTO account_status(name) VALUES ($1),($2),($3),($4)'
const value_st = ['ok', 'kicked','banned','censored']

client
    .query(status_sql, value_st)
    .then(res => {
        console.log('status created')
    })
    .catch(e => console.error(e.stack))
